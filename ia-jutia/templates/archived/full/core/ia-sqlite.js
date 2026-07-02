// core/ia-sqlite.js — SQLite con FTS5 para IA Jutia (sql.js WASM)
// Dependencias: sql.js (window.initSqlJs), Dexie (window.db con tabla _ia_sqlite)
// Expone: window.sqliteDB
// Perfil: Full (.exe con Neutralino). Fallback: Dexie si sql.js no disponible.

;(function() {
  'use strict';

  const DB = {
    ready: false,
    _db: null,
    _SQL: null,
    _saveTimeout: null,

    async init() {
      if (typeof initSqlJs === 'undefined') {
        console.warn('⚠️ ia-sqlite: sql.js no disponible. Usando Dexie como fallback.');
        return;
      }
      if (typeof window.db === 'undefined' || !window.db._ia_sqlite) {
        console.warn('⚠️ ia-sqlite: Tabla _ia_sqlite no existe en Dexie. Fallback.');
        return;
      }
      try {
        this._SQL = await initSqlJs({
          locateFile: file => `assets/wasm/${file}`
        });
        const snapshot = await window.db._ia_sqlite.get('snapshot');
        if (snapshot && snapshot.data) {
          const buf = new Uint8Array(snapshot.data);
          this._db = new this._SQL.Database(buf);
        } else {
          this._db = new this._SQL.Database();
        }
        this._db.run('CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(texto, docId)');
        this._db.run('CREATE TABLE IF NOT EXISTS chunk_embeddings(id TEXT PRIMARY KEY, vector BLOB)');
        this.ready = true;
        console.log('🧠 ia-sqlite: SQLite listo con FTS5');
      } catch (err) {
        console.warn('⚠️ ia-sqlite: Error inicializando:', err.message);
      }
    },

    async _saveSnapshot() {
      if (!this._db || !window.db?._ia_sqlite) return;
      const data = this._db.export();
      await window.db._ia_sqlite.put({
        id: 'snapshot',
        data: Array.from(data),
        updatedAt: new Date().toISOString()
      });
    },

    _scheduleSave() {
      if (this._saveTimeout) clearTimeout(this._saveTimeout);
      this._saveTimeout = setTimeout(() => this._saveSnapshot(), 2000);
    },

    async addChunks(chunks, docId) {
      if (!this.ready) return;
      const stmt = this._db.prepare('INSERT INTO chunks_fts(texto, docId) VALUES (?, ?)');
      for (const c of chunks) {
        stmt.run([c.texto, docId]);
      }
      stmt.free();
      this._scheduleSave();
    },

    async removeChunks(docId) {
      if (!this.ready) return;
      this._db.run('DELETE FROM chunks_fts WHERE docId = ?', [docId]);
      this._scheduleSave();
    },

    async searchChunks(query, limit = 5) {
      if (!this.ready) return [];
      if (!query || query.length < 2) return [];
      try {
        const sanitized = query.replace(/['"]/g, '').replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/g, ' ');
        const results = this._db.exec(
          `SELECT texto, docId, rank FROM chunks_fts WHERE texto MATCH ? ORDER BY rank LIMIT ?`,
          [sanitized, limit]
        );
        if (!results.length) return [];
        const rows = results[0];
        return rows.values.map(v => ({
          texto: v[0],
          docId: v[1]
        }));
      } catch (e) {
        console.warn('⚠️ ia-sqlite: Error en FTS5 search:', e.message);
        return [];
      }
    },

    async count() {
      if (!this.ready) return 0;
      const r = this._db.exec('SELECT count(*) FROM chunks_fts');
      return r.length ? r[0].values[0][0] : 0;
    },

    async forceSave() {
      if (this._saveTimeout) {
        clearTimeout(this._saveTimeout);
        this._saveTimeout = null;
      }
      await this._saveSnapshot();
    }
  };

  window.sqliteDB = DB;
  console.log('🧠 ia-sqlite: Modulo SQLite listo');
})();
