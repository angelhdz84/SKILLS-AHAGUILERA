// modules/ia-jutia/ia-sqlite.js — SQLite FTS5 wrapper (Full+ DLC)
// Dependencias: sql.js (window.initSqlJs, cargado desde assets/)
// Expone: window.sqliteDB
// ES5 compatible

;(function() {
  'use strict';

  if (typeof window.sqliteDB !== 'undefined') return;

  // Intentar cargar sql.js si no esta disponible
  var SQL = null;

  var SQLiteDB = {
    _ready: false,
    _db: null,
    _saveTimer: null,
    _dirty: false,

    init: async function() {
      console.log('[ia-sqlite] Inicializando...');
      if (this._ready) return; // guard doble init

      // Cargar sql.js si esta disponible en assets/
      if (typeof window.initSqlJs === 'undefined') {
        try {
          await SQLiteDB._loadSqlJs();
        } catch(e) {
          console.warn('[ia-sqlite] sql.js no disponible, modo degradado Dexie');
          this._ready = true;
          return;
        }
      }

      try {
        SQL = window.SQL ? window.SQL : await window.initSqlJs({
          locateFile: function(file) {
            return 'modules/ia-jutia/assets/wasm/' + file;
          }
        });

        // Crear DB en memoria
        this._db = new SQL.Database();

        // Configurar FTS5
        this._db.run("CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(docId, texto, tokenize='porter unicode61')");
        this._ready = true;
        console.log('[ia-sqlite] SQLite FTS5 listo');
        // Rebuild lazy en background desde Dexie (FTS es cache de sesion)
        SQLiteDB._rebuildFromDexie();
      } catch(e) {
        console.warn('[ia-sqlite] Error SQLite, modo degradado:', (e && e.message) || String(e));
        this._ready = true;
      }
    },

    _rebuildFromDexie: async function() {
      try {
        if (!window.iaDB || !window.iaDB._ia_chunks || !this._db) return;
        var cnt = await window.iaDB._ia_chunks.count();
        if (!cnt) return;
        var chunks = await window.iaDB._ia_chunks.toArray();
        var docMap = {};
        for (var i = 0; i < chunks.length; i++) {
          if (!chunks[i] || !chunks[i].docId) continue;
          if (!docMap[chunks[i].docId]) docMap[chunks[i].docId] = [];
          docMap[chunks[i].docId].push(chunks[i].texto || '');
        }
        var docIds = Object.keys(docMap);
        for (var d = 0; d < docIds.length; d++) {
          await SQLiteDB.addChunks(docIds[d], docMap[docIds[d]]);
        }
        console.log('[ia-sqlite] FTS5 reconstruido:', cnt, 'chunks desde Dexie');
      } catch(e) {
        console.warn('[ia-sqlite] Rebuild FTS5 fallo:', (e && e.message) || String(e));
      }
    },

    _loadSqlJs: function() {
      return new Promise(function(resolve, reject) {
        // Buscar assets/wasm/sql-wasm.js (descarga prevista en setup-ia.ps1, Task 8 del plan)
        var path = 'modules/ia-jutia/assets/wasm/sql-wasm.js';
        var script = document.createElement('script');
        script.src = path;
        script.onload = function() {
          if (typeof window.initSqlJs !== 'undefined') {
            resolve();
          } else {
            reject(new Error('sql.js loaded but initSqlJs not found'));
          }
        };
        script.onerror = function() { reject(new Error('sql.js no disponible en ' + path)); };
        document.head.appendChild(script);
      });
    },

    addChunks: async function(docId, chunks) {
      if (!this._ready || !this._db) return;
      var stmt = null;
      try {
        this._db.run("BEGIN TRANSACTION");
        stmt = this._db.prepare("INSERT INTO chunks_fts(docId, texto) VALUES (?, ?)");
        for (var i = 0; i < chunks.length; i++) {
          stmt.run([docId, chunks[i]]);
        }
        this._db.run("COMMIT");
        this._dirty = true;
        this._scheduleSave();
      } catch(e) {
        try { this._db.run("ROLLBACK"); } catch(re) {}
        console.warn('[ia-sqlite] Error addChunks:', (e && e.message) || String(e));
      } finally {
        if (stmt) { try { stmt.free(); } catch(fe) {} }
      }
    },

    removeChunks: async function(docId) {
      if (!this._ready || !this._db) return;
      try {
        this._db.run("DELETE FROM chunks_fts WHERE docId = ?", [docId]);
        this._dirty = true;
        this._scheduleSave();
      } catch(e) {
        console.warn('[ia-sqlite] Error removeChunks:', (e && e.message) || String(e));
      }
    },

    searchChunks: async function(query) {
      if (!this._ready || !this._db) return SQLiteDB._fallbackSearch(query);
      var stmt = null;
      try {
        // Escape FTS5 special chars (incluye mayusculas acentuadas, normaliza a minusculas)
        var sanitized = query.replace(/['"]/g, '').replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/g, ' ').toLowerCase().trim();
        if (!sanitized) return [];

        var words = sanitized.split(/\s+/).filter(function(w) { return w.length > 2; });
        if (words.length === 0) return [];

        // Build FTS5 query: each word as a required term
        var ftsQuery = words.map(function(w) { return w + '*'; }).join(' AND ');

        var sql = "SELECT docId, texto, rank FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY rank LIMIT 10";
        stmt = this._db.prepare(sql);
        stmt.bind([ftsQuery]);

        var results = [];
        while (stmt.step()) {
          var row = stmt.getAsObject();
          results.push({
            docId: row.docId,
            texto: row.texto,
            score: -row.rank || 0
          });
        }
        return results;
      } catch(e) {
        console.warn('[ia-sqlite] FTS5 error, fallback Dexie:', (e && e.message) || String(e));
        return SQLiteDB._fallbackSearch(query);
      } finally {
        if (stmt) { try { stmt.free(); } catch(fe) {} }
      }
    },

    _fallbackSearch: async function(query) {
      if (!window.iaDB || !window.iaDB._ia_chunks) return [];
      try {
        var allChunks = await window.iaDB._ia_chunks.toArray();
        var q = (query || '').toLowerCase();
        if (!q) return [];
        var words = q.split(/\s+/).filter(function(w) { return w.length > 2; });
        if (words.length === 0) return [];
        var scored = [];
        for (var i = 0; i < allChunks.length; i++) {
          var text = (allChunks[i].texto || '').toLowerCase();
          var score = 0;
          for (var j = 0; j < words.length; j++) {
            if (text.indexOf(words[j]) !== -1) score++;
          }
          if (score > 0) scored.push({ texto: allChunks[i].texto, docId: allChunks[i].docId, score: score });
        }
        scored.sort(function(a, b) { return b.score - a.score; });
        return scored.slice(0, 10);
      } catch(e) {
        return [];
      }
    },

    count: async function() {
      if (!this._ready) return 0;
      if (!this._db) {
        // Modo degradado: contar en Dexie
        if (window.iaDB && window.iaDB._ia_chunks) {
          try { return await window.iaDB._ia_chunks.count(); } catch(e) { return 0; }
        }
        return 0;
      }
      var stmt = null;
      try {
        stmt = this._db.prepare("SELECT COUNT(*) as cnt FROM chunks_fts");
        stmt.step();
        var row = stmt.getAsObject();
        return row.cnt || 0;
      } catch(e) {
        return 0;
      } finally {
        if (stmt) { try { stmt.free(); } catch(fe) {} }
      }
    },

    forceSave: async function() {
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }
      if (this._dirty && this._db) {
        // SQLite en memoria, los datos primarios ya estan en Dexie
        this._dirty = false;
      }
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
  console.log('[ia-sqlite] v2.0-full listo');
})();
