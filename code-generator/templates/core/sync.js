// SyncEngine — Export/Import de datos en formato .ahabackup (ZIP)
// Contenido del ZIP: data.json + metadata.json + assets/avatars/
// window.SyncEngine expuesto globalmente
// Dependencias: JSZip, CryptoJS, pako

(function () {
  'use strict';

  const DEFAULT_PASSWORD = '';
  const EXCLUDE_TABLES = ['modelos_cache', '_ia_sqlite', '_file_blobs'];

  if (typeof window.SyncEngine !== 'undefined') return;

  window.SyncEngine = {
    _password: DEFAULT_PASSWORD,

    setPassword(pwd) {
      this._password = pwd || '';
    },

    async exportarBackup(password) {
      const pwd = password || this._password;
      try {
        UI.toast('Preparando respaldo...', 'info');
        const zip = new JSZip();
        const appName = APP_CONFIG?.app?.nombre || 'app';
        const tables = {};
        let files = [];
        let recordCount = 0;

        // 1. Recolectar archivos (metadatos)
        if (db._files) {
          files = await db._files.toArray();
          zip.file('metadata.json', JSON.stringify({
            version: 2,
            app: appName,
            appId: APP_CONFIG?.app?.id || '',
            exportedAt: new Date().toISOString(),
            fileCount: files.length,
            platform: window.Neutralino ? 'neutralino' : window.Capacitor ? 'capacitor' : 'web'
          }, null, 2));
        }

        // 2. Recolectar datos de tablas de negocio
        for (const table of db.tables) {
          if (EXCLUDE_TABLES.includes(table.name)) continue;
          if (table.name === '_files' || table.name === '_file_blobs') continue;
          const records = await table.toArray();
          if (records.length) {
            tables[table.name] = records;
            recordCount += records.length;
          }
        }

        if (!Object.keys(tables).length && !files.length) {
          UI.toast('No hay datos para exportar', 'warning');
          return null;
        }

        // 3. Armar data.json
        const dataPayload = { tables, files };
        let dataStr = JSON.stringify(dataPayload, null, 2);

        // 4. Cifrar si hay password
        if (pwd) {
          dataStr = CryptoJS.AES.encrypt(dataStr, pwd).toString();
          zip.file('data.enc', dataStr);
          zip.file('metadata.json', JSON.stringify({
            version: 2, app: appName, appId: APP_CONFIG?.app?.id || '',
            exportedAt: new Date().toISOString(), encrypted: true,
            fileCount: files.length, recordCount,
            platform: window.Neutralino ? 'neutralino' : window.Capacitor ? 'capacitor' : 'web'
          }, null, 2));
        } else {
          zip.file('data.json', dataStr);
        }

        // 5. Incluir avatares si existen (solo perfil Lite con _file_blobs)
        if (db._file_blobs && files.length) {
          const assets = zip.folder('assets');
          const avatars = assets.folder('avatars');
          for (const f of files) {
            if (f.tipo === 'avatar') {
              try {
                const blobEntry = await db._file_blobs.get(f.path);
                if (blobEntry?.blob) {
                  avatars.file(f.nombre, blobEntry.blob);
                }
              } catch {}
            }
          }
        }

        // 6. Generar ZIP
        const content = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
        const filename = `${appName}-${new Date().toISOString().slice(0, 10)}.ahabackup`;

        return { content, filename, size: content.length, recordCount, fileCount: files.length };
      } catch (err) {
        UI.toast('Error al exportar: ' + err.message, 'error');
        return null;
      }
    },

    async importarBackup(file, password) {
      const pwd = password || this._password;
      try {
        UI.toast('Leyendo respaldo...', 'info');
        const zip = await JSZip.loadAsync(file);
        let tables, files;

        // 1. Validar triple: metadata.json + (data.json o data.enc)
        const metaStr = await zip.file('metadata.json')?.async('string');
        if (!metaStr) { UI.toast('Respaldo inválido: falta metadata.json', 'error'); return; }
        const meta = JSON.parse(metaStr);

        if (meta.encrypted) {
          const encData = await zip.file('data.enc')?.async('string');
          if (!encData) { UI.toast('Respaldo inválido: falta data.enc', 'error'); return; }
          const decrypted = CryptoJS.AES.decrypt(encData, pwd);
          const json = decrypted.toString(CryptoJS.enc.Utf8);
          if (!json) { UI.toast('Contraseña incorrecta o archivo corrupto', 'error'); return; }
          const parsed = JSON.parse(json);
          tables = parsed.tables;
          files = parsed.files;
        } else {
          const dataStr = await zip.file('data.json')?.async('string');
          if (!dataStr) { UI.toast('Respaldo inválido: falta data.json', 'error'); return; }
          const parsed = JSON.parse(dataStr);
          tables = parsed.tables;
          files = parsed.files;
        }

        const tableCount = Object.keys(tables).length;
        const recordCount = Object.values(tables).reduce((a, t) => a + t.length, 0);
        const fileCount = files?.length || 0;

        // 2. Confirmar
        let msg = `Importar ${recordCount} registros en ${tableCount} tablas`;
        if (fileCount) msg += ` + ${fileCount} archivos`;
        const ok = await UI.confirm(msg + '?');
        if (!ok) return;

        // 3. Restaurar archivos primero
        if (files?.length && db._files) {
          for (const f of files) {
            const existing = await db._files.get(f.path);
            if (!existing || new Date(f.updatedAt) > new Date(existing.updatedAt)) {
              await db._files.put(f);
            }
          }
          // Restaurar blobs de avatar desde ZIP
          if (db._file_blobs) {
            const avatarsFolder = zip.folder('assets')?.folder('avatars');
            if (avatarsFolder) {
              const avatarFiles = [];
              avatarsFolder.forEach((relPath, entry) => {
                if (!entry.dir) avatarFiles.push(relPath);
              });
              for (const name of avatarFiles) {
                try {
                  const blob = await avatarsFolder.file(name)?.async('blob');
                  if (!blob) continue;
                  const meta = files.find(f => f.nombre === name);
                  const path = meta?.path || `avatar/${uuid()}.${name.split('.').pop()}`;
                  await db._file_blobs.put({ path, blob });
                } catch {}
              }
            }
          }
        }

        // 4. Merge datos por UUID + updatedAt
        let insertados = 0, actualizados = 0, saltados = 0;
        for (const [name, records] of Object.entries(tables)) {
          if (!db[name]) continue;
          for (const record of records) {
            const existing = await db[name].get(record.id);
            if (!existing) {
              await db[name].put(record);
              insertados++;
            } else if (new Date(record.updatedAt) > new Date(existing.updatedAt)) {
              record.createdAt = existing.createdAt;
              await db[name].put(record);
              actualizados++;
            } else {
              saltados++;
            }
          }
        }

        const fileMsg = fileCount ? `, ${fileCount} archivos` : '';
        UI.toast(`Importación: ${insertados} nuevos, ${actualizados} actualizados, ${saltados} saltados${fileMsg}`, 'success');
      } catch (err) {
        UI.toast('Error al importar: ' + err.message, 'error');
      }
    },

    async exportar(password) {
      const result = await this.exportarBackup(password);
      if (!result) return;

      // Descarga según plataforma
      const blob = new Blob([result.content], { type: 'application/zip' });

      if (window.Neutralino) {
        try {
          const path = await Neutralino.os.showSaveDialog('Guardar respaldo', {
            filters: [{ name: 'Respaldo AHA', extensions: ['ahabackup'] }],
            defaultPath: result.filename
          });
          if (!path) return;
          await Neutralino.filesystem.writeBinaryFile(path, result.content);
        } catch (e) {
          // Fallback a Blob download si showSaveDialog falla
          this._downloadBlob(blob, result.filename);
        }
      } else if (window.Capacitor) {
        try {
          const base64 = await this._blobToBase64(blob);
          await Capacitor.Plugins.Share.share({
            title: 'Respaldo AHA',
            files: [{ path: result.filename, base64 }]
          });
        } catch {
          this._downloadBlob(blob, result.filename);
        }
      } else {
        this._downloadBlob(blob, result.filename);
      }

      const fileInfo = result.fileCount ? ` + ${result.fileCount} archivos` : '';
      UI.toast(`Respaldo exportado (${(result.size / 1024).toFixed(1)} KB${fileInfo})`, 'success');
    },

    async importar(file, password) {
      // file puede ser File (web) o { path, data } desde Neutralino
      let buffer;
      if (file instanceof File) {
        buffer = await file.arrayBuffer();
      } else if (file?.data) {
        buffer = file.data;
      } else if (file?.path && window.Neutralino) {
        const data = await Neutralino.filesystem.readBinaryFile(file.path);
        buffer = data.buffer || data;
      } else {
        UI.toast('Archivo no válido', 'error');
        return;
      }
      await this.importarBackup(buffer, password);
    },

    async limpiarDatos() {
      const tables = db.tables.map(t => t.name)
        .filter(n => !n.startsWith('_') && n !== 'modelos_cache');
      const counts = {};
      for (const name of tables) {
        counts[name] = await db[name].count();
      }
      const total = Object.values(counts).reduce((a, c) => a + c, 0);
      if (total === 0) { UI.toast('No hay datos que limpiar', 'info'); return; }

      const tableList = Object.entries(counts)
        .filter(([, c]) => c > 0)
        .map(([name, c]) => `${name} (${c})`)
        .join(', ');
      const ok = await UI.confirm(`Eliminar ${total} registros de: ${tableList}?`);
      if (!ok) return;

      UI.loading(true);
      try {
        for (const name of tables) {
          if (counts[name] > 0) await db[name].clear();
        }
        UI.toast(`${total} registros eliminados`, 'success');
        return true;
      } catch (err) {
        UI.toast('Error al limpiar: ' + err.message, 'error');
        return false;
      } finally {
        UI.loading(false);
      }
    },

    _downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },

    _blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  };
})();
