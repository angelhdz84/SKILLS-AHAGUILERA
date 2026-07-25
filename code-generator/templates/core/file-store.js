// file-store.js — FileStore API offline-first para adjuntos
// window.fileStore expuesto globalmente
// Dos backends: Lite (IndexedDB blobs via _file_blobs) / Full (Neutralino/Capacitor filesystem)
// Tablas Dexie requeridas: _files (metadatos), _file_blobs (blobs en perfil Lite)
// Dependencias: Dexie, APP_CONFIG

(function () {
  'use strict';

  if (typeof window.fileStore !== 'undefined') return;

  // ─── Configuración ────────────────────────────────────
  var CONFIG = window.APP_CONFIG || {};
  var PERFIL = CONFIG.perfil || 'lite';
  var DATA_DIR = CONFIG.data && CONFIG.data.dir ? CONFIG.data.dir : 'data/';
  var MAX_SIZE = CONFIG.data && CONFIG.data.maxFileSize
    ? CONFIG.data.maxFileSize
    : 10 * 1024 * 1024; // 10 MB por defecto

  // Usa Neutralino? (solo Binary)
  var _hasNeutralino = typeof window.Neutralino !== 'undefined'
    && window.Neutralino.filesystem
    && typeof window.Neutralino.filesystem.writeBinaryFile === 'function';

  // Usa Capacitor?
  var _hasCapacitor = typeof window.Capacitor !== 'undefined'
    && window.Capacitor.Plugins
    && window.Capacitor.Plugins.Filesystem;

  // Usa Dexie blobs (perfil Lite en navegador sin Neutralino/Capacitor)
  var _useDexieBlob = !_hasNeutralino && !_hasCapacitor;

  // ─── Pool de object URLs para limpieza ────────────────
  var _objectUrls = [];

  function _revokeUrl(url) {
    if (url && typeof url === 'string' && url.indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(url); } catch (e) {}
    }
  }

  function _removeFromPool(url) {
    var idx = _objectUrls.indexOf(url);
    if (idx !== -1) {
      _objectUrls.splice(idx, 1);
    }
  }

  // ─── Helpers internos ─────────────────────────────────
  function _uuid() {
    if (typeof window.uuid === 'function') {
      return window.uuid();
    }
    // Fallback UUID v4 si crypto.js no está cargado
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function _readAsArrayBuffer(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('Error leyendo archivo')); };
      reader.readAsArrayBuffer(blob);
    });
  }

  function _nowISO() {
    return new Date().toISOString();
  }

  // ─── Generar hash SHA-256 (si crypto.subtle disponible) ─
  function _hashBlob(blob) {
    if (!window.crypto || !window.crypto.subtle || !window.crypto.subtle.digest) {
      return Promise.resolve('');
    }
    try {
      return blob.arrayBuffer().then(function (buf) {
        return window.crypto.subtle.digest('SHA-256', buf);
      }).then(function (hash) {
        var hex = '';
        var bytes = new Uint8Array(hash);
        for (var i = 0; i < bytes.length; i++) {
          hex += ('00' + bytes[i].toString(16)).slice(-2);
        }
        return hex;
      }).catch(function () {
        return '';
      });
    } catch (e) {
      return Promise.resolve('');
    }
  }

  // ─── Normalizar ruta ──────────────────────────────────
  function _normalizePath(path) {
    if (!path) return '';
    // Asegurar que no empiece con / o \\
    var p = String(path).replace(/^[\\\/]+/, '');
    return p;
  }

  // ─── Validar tamaño ───────────────────────────────────
  function _validateSize(blob) {
    if (blob.size > MAX_SIZE) {
      var maxMB = Math.round(MAX_SIZE / 1024 / 1024);
      throw new Error('El archivo excede el tamaño máximo de ' + maxMB + 'MB');
    }
    return true;
  }

  // ─── API pública ──────────────────────────────────────
  window.fileStore = {

    /**
     * Guardar un archivo en la ruta especificada
     * @param {string} path - Ruta relativa (ej: 'avatares/user1.jpg')
     * @param {Blob|File} blob - Contenido del archivo
     * @returns {Promise<{path: string, url: string, hash: string}>}
     */
    save: function (path, blob) {
      path = _normalizePath(path);
      if (!path) return Promise.reject(new Error('path es requerido'));
      if (!blob) return Promise.reject(new Error('blob es requerido'));

      try {
        _validateSize(blob);
      } catch (e) {
        return Promise.reject(e);
      }

      var mime = blob.type || 'application/octet-stream';
      var nombre = path.split('/').pop() || 'archivo';
      var self = this;

      return _hashBlob(blob).then(function (hash) {
        var now = _nowISO();
        var meta = {
          path: path,
          tipo: path.indexOf('/') !== -1 ? path.split('/')[0] : 'general',
          nombre: nombre,
          mime: mime,
          size: blob.size,
          hash: hash,
          refCount: 1,
          createdAt: now,
          updatedAt: now
        };

        // 1. Guardar metadatos en _files
        return db._files.put(meta).then(function () {

          // 2. Guardar blob según backend disponible
          if (_useDexieBlob) {
            // Perfil Lite → IndexedDB via _file_blobs
            return db._file_blobs.put({ path: path, blob: blob }).then(function () {
              var url = URL.createObjectURL(blob);
              _objectUrls.push(url);
              return { path: path, hash: hash, url: url };
            });
          }

          // Neutralino
          if (_hasNeutralino) {
            return _readAsArrayBuffer(blob).then(function (buf) {
              return window.Neutralino.filesystem.writeBinaryFile(DATA_DIR + path, buf);
            }).then(function () {
              return { path: path, hash: hash, url: '/' + DATA_DIR + path };
            });
          }

          // Capacitor
          if (_hasCapacitor) {
            return _readAsArrayBuffer(blob).then(function (buf) {
              return window.Capacitor.Plugins.Filesystem.writeFile({
                path: DATA_DIR + path,
                data: _arrayBufferToBase64(buf),
                directory: 'DATA'
              });
            }).then(function () {
              return { path: path, hash: hash, url: '/' + DATA_DIR + path };
            });
          }

          // Fallback: IndexedDB blobs
          return db._file_blobs.put({ path: path, blob: blob }).then(function () {
            var url = URL.createObjectURL(blob);
            _objectUrls.push(url);
            return { path: path, hash: hash, url: url };
          });
        });
      });
    },

    /**
     * Obtener URL para visualizar/previsualizar un archivo
     * @param {string} path - Ruta del archivo
     * @returns {Promise<string|null>} object URL o null si no existe
     */
    getURL: function (path) {
      path = _normalizePath(path);
      if (!path) return Promise.resolve(null);

      if (_useDexieBlob) {
        return db._file_blobs.get(path).then(function (entry) {
          if (!entry || !entry.blob) return null;
          var url = URL.createObjectURL(entry.blob);
          _objectUrls.push(url);
          return url;
        });
      }

      if (_hasNeutralino) {
        // Verificar que el archivo existe
        return window.Neutralino.filesystem.getStats(DATA_DIR + path).then(function () {
          return '/' + DATA_DIR + path;
        }).catch(function () {
          return null;
        });
      }

      if (_hasCapacitor) {
        return window.Capacitor.Plugins.Filesystem.readFile({
          path: DATA_DIR + path,
          directory: 'DATA'
        }).then(function (result) {
          if (!result || !result.data) return null;
          // Convertir base64 a blob URL
          var byteChars = atob(result.data);
          var byteNums = new Array(byteChars.length);
          for (var i = 0; i < byteChars.length; i++) {
            byteNums[i] = byteChars.charCodeAt(i);
          }
          var byteArr = new Uint8Array(byteNums);
          var blob = new Blob([byteArr]);
          var url = URL.createObjectURL(blob);
          _objectUrls.push(url);
          return url;
        }).catch(function () {
          return null;
        });
      }

      // Fallback Dexie blobs
      return db._file_blobs.get(path).then(function (entry) {
        if (!entry || !entry.blob) return null;
        var url = URL.createObjectURL(entry.blob);
        _objectUrls.push(url);
        return url;
      });
    },

    /**
     * Leer un archivo como ArrayBuffer
     * @param {string} path - Ruta del archivo
     * @returns {Promise<ArrayBuffer|null>}
     */
    read: function (path) {
      path = _normalizePath(path);
      if (!path) return Promise.resolve(null);

      if (_useDexieBlob) {
        return db._file_blobs.get(path).then(function (entry) {
          if (!entry || !entry.blob) return null;
          return _readAsArrayBuffer(entry.blob);
        });
      }

      if (_hasNeutralino) {
        return window.Neutralino.filesystem.readBinaryFile(DATA_DIR + path).then(function (data) {
          return data;
        }).catch(function () {
          return null;
        });
      }

      if (_hasCapacitor) {
        return window.Capacitor.Plugins.Filesystem.readFile({
          path: DATA_DIR + path,
          directory: 'DATA'
        }).then(function (result) {
          if (!result || !result.data) return null;
          var binaryStr = atob(result.data);
          var len = binaryStr.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          return bytes.buffer;
        }).catch(function () {
          return null;
        });
      }

      // Fallback Dexie blobs
      return db._file_blobs.get(path).then(function (entry) {
        if (!entry || !entry.blob) return null;
        return _readAsArrayBuffer(entry.blob);
      });
    },

    /**
     * Eliminar un archivo y liberar recursos
     * @param {string} path - Ruta del archivo
     * @returns {Promise<void>}
     */
    delete: function (path) {
      path = _normalizePath(path);
      if (!path) return Promise.resolve();

      // Revocar cualquier object URL pendiente para esta ruta
      // Nota: no podemos mapear URLs a paths directamente, mejor limpiar pool

      if (_useDexieBlob) {
        return db._file_blobs.delete(path).then(function () {
          return db._files.delete(path);
        });
      }

      if (_hasNeutralino) {
        return window.Neutralino.filesystem.removeFile(DATA_DIR + path).then(function () {
          return db._files.delete(path);
        }).catch(function () {
          // El archivo puede no existir en disco, igual limpiar metadatos
          return db._files.delete(path);
        });
      }

      if (_hasCapacitor) {
        return window.Capacitor.Plugins.Filesystem.deleteFile({
          path: DATA_DIR + path,
          directory: 'DATA'
        }).then(function () {
          return db._files.delete(path);
        }).catch(function () {
          return db._files.delete(path);
        });
      }

      // Fallback
      return db._file_blobs.delete(path).then(function () {
        return db._files.delete(path);
      });
    },

    /**
     * Listar archivos por prefijo de ruta
     * @param {string} prefix - Prefijo de ruta (ej: 'avatares/')
     * @returns {Promise<Array<Object>>} Array de metadatos
     */
    list: function (prefix) {
      prefix = _normalizePath(prefix);
      if (!prefix) {
        // Si no hay prefijo, devolver todos
        return db._files.toArray();
      }
      return db._files
        .filter(function (f) {
          return f.path && f.path.indexOf(prefix) === 0;
        })
        .toArray();
    },

    /**
     * Obtener metadatos de un archivo
     * @param {string} path
     * @returns {Promise<Object|null>}
     */
    meta: function (path) {
      path = _normalizePath(path);
      if (!path) return Promise.resolve(null);
      return db._files.get(path);
    },

    /**
     * Limpiar archivos huérfanos (refCount === 0)
     * @returns {Promise<number>} Cantidad de archivos limpiados
     */
    cleanOrphans: function () {
      var self = this;
      return db._files.where('refCount').equals(0).toArray().then(function (orphans) {
        if (!orphans || orphans.length === 0) return 0;
        var count = orphans.length;
        var chain = Promise.resolve();
        for (var i = 0; i < orphans.length; i++) {
          chain = chain.then((function (f) {
            return function () { return self.delete(f.path); };
          })(orphans[i]));
        }
        return chain.then(function () { return count; });
      });
    },

    /**
     * Liberar todos los object URLs creados
     */
    revokeAll: function () {
      for (var i = 0; i < _objectUrls.length; i++) {
        _revokeUrl(_objectUrls[i]);
      }
      _objectUrls = [];
    },

    /**
     * Obtener ruta del avatar por defecto
     * @returns {string}
     */
    avatarDefault: function () {
      var def = 'data/defaults/avatar.svg';
      if (CONFIG.data && CONFIG.data.avatars && CONFIG.data.avatars.default) {
        def = CONFIG.data.avatars.default;
      }
      return def;
    },

    /**
     * Incrementar refCount de un archivo
     */
    ref: function (path) {
      path = _normalizePath(path);
      if (!path) return Promise.resolve();
      return db._files.get(path).then(function (meta) {
        if (!meta) return;
        meta.refCount = (meta.refCount || 0) + 1;
        meta.updatedAt = _nowISO();
        return db._files.put(meta);
      });
    },

    /**
     * Decrementar refCount de un archivo
     */
    unref: function (path) {
      path = _normalizePath(path);
      if (!path) return Promise.resolve();
      return db._files.get(path).then(function (meta) {
        if (!meta) return;
        meta.refCount = Math.max(0, (meta.refCount || 1) - 1);
        meta.updatedAt = _nowISO();
        return db._files.put(meta);
      });
    }
  };

  console.log('[fileStore] FileStore API iniciada (perfil: ' + PERFIL + ')');
})();

// ─── Helper base64 (para Capacitor) ───────────────────
function _arrayBufferToBase64(buffer) {
  var bytes = new Uint8Array(buffer);
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
