// modules/ia-jutia/ia-sqlite.js — SQLite FTS5 wrapper (DLC Full)
// Dependencias: sql.js (opcional, carga diferida)
// Si sql.js no está disponible, degrada a Dexie queries
// Expone: window.sqliteDB
// ES5 compatible

;(function() {
  'use strict';

  if (typeof window.sqliteDB !== 'undefined') return;

  var SQLiteDB = {
    _ready: false,
    _db: null,
    _saveTimer: null,
    _dirty: false,

    init: async function() {
      console.log('[ia-sqlite] Inicializando...');
      // sql.js no se incluye en el bundle offline-first
      // Se cargaría desde ruta compartida si existe
      // Por ahora, usamos modo degradado (Dexie queries)
      console.log('[ia-sqlite] Modo degradado: usando Dexie FTS-like queries');
      this._ready = true;
    },

    addChunks: async function(docId, chunks) {
      // En modo degradado, no-op (los chunks ya están en Dexie _ia_chunks)
      this._dirty = true;
      this._scheduleSave();
    },

    removeChunks: async function(docId) {
      this._dirty = true;
      this._scheduleSave();
    },

    searchChunks: async function(query) {
      // Modo degradado: buscar en Dexie _ia_chunks
      if (!window.iaDB || !window.iaDB._ia_chunks) return [];
      try {
        var allChunks = await window.iaDB._ia_chunks.toArray();
        var q = (query || '').toLowerCase();
        if (!q) return [];
        return allChunks.filter(function(c) {
          return c.texto && c.texto.toLowerCase().indexOf(q) !== -1;
        }).slice(0, 10).map(function(c) {
          return { texto: c.texto, docId: c.docId };
        });
      } catch(e) {
        console.warn('[ia-sqlite] Error en busqueda degradada:', e.message);
        return [];
      }
    },

    count: async function() {
      if (!window.iaDB || !window.iaDB._ia_chunks) return 0;
      try {
        return await window.iaDB._ia_chunks.count();
      } catch(e) {
        return 0;
      }
    },

    forceSave: async function() {
      // En modo degradado, los datos ya están persistidos en Dexie
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }
      this._dirty = false;
    },

    _scheduleSave: function() {
      var self = this;
      if (this._saveTimer) clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(function() {
        self.forceSave();
      }, 2000);
    }
  };

  window.sqliteDB = SQLiteDB;
  console.log('[ia-sqlite] v1.0-plugin listo (modo degradado)');
})();
