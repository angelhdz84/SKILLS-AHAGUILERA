// BackupManager — Interfaz de 4 botones para backup/restore/limpiar/demo
// window.BackupManager expuesto globalmente
// Dependencias: SyncEngine, ExportEngine, UI, JSZip

(function () {
  'use strict';

  if (typeof window.BackupManager !== 'undefined') return;

  window.BackupManager = {
    _debug: false,

    async exportarBackup(password) {
      return SyncEngine.exportarBackup(password);
    },

    async importarBackup(password) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.ahabackup,.zip';
      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) { resolve(false); return; }
          try {
            await SyncEngine.importarBackup(file, password);
            resolve(true);
          } catch (err) {
            UI.toast('Error al importar: ' + err.message, 'error');
            resolve(false);
          }
        };
        input.click();
      });
    },

    async importarNeutralino(password) {
      if (!window.Neutralino) {
        return this.importarBackup(password);
      }
      try {
        const entries = await Neutralino.os.showOpenDialog('Seleccionar respaldo', {
          filters: [{ name: 'Respaldo AHA', extensions: ['ahabackup', 'zip'] }],
          multiSelections: false
        });
        if (!entries || !entries.length) return false;
        const data = await Neutralino.filesystem.readBinaryFile(entries[0]);
        await SyncEngine.importarBackup(data.buffer || data, password);
        return true;
      } catch (err) {
        UI.toast('Error al importar: ' + err.message, 'error');
        return false;
      }
    },

    async limpiarDatos() {
      if (!confirm('¿Estás seguro de limpiar todos los datos locales? Esta acción no se puede deshacer.')) return false;
      try {
        var dbRef = window.db;
        if (!dbRef) { UI.toast('Base de datos no disponible', 'error'); return false; }
        var tables = dbRef.tables;
        var ps = [];
        for (var i = 0; i < tables.length; i++) {
          ps.push(tables[i].clear());
        }
        return Promise.all(ps).then(function () {
          UI.toast('Datos locales eliminados correctamente', 'success');
          return true;
        }).catch(function (err) {
          UI.toast('Error al limpiar datos: ' + (err.message || 'Error'), 'error');
          return false;
        });
      } catch (err) {
        UI.toast('Error al limpiar datos: ' + (err.message || 'Error'), 'error');
        return false;
      }
    },

    async recargarDemo() {
      if (typeof window.recargarDemo === 'function') {
        return window.recargarDemo();
      }
      UI.toast('Demo no disponible para esta app', 'warning');
      return false;
    },

    async autoBackupOnClose() {
      if (!APP_CONFIG?.backup?.autoOnClose) return;
      try {
        const result = await SyncEngine.exportarBackup();
        if (result) {
          const blob = new Blob([result.content], { type: 'application/zip' });
          this._downloadBlob(blob, result.filename);
        }
      } catch {}
    }
  };

  // Registrar auto-backup si está configurado
  window.addEventListener('beforeunload', () => {
    if (APP_CONFIG?.backup?.autoOnClose) {
      BackupManager.autoBackupOnClose();
    }
  });
})();
