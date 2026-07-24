// db.js — Inicialización Dexie con tablas de sistema
// window.db expuesto globalmente
// window.DB_VERSION auto-gestionado
// window.dbLocal helper de solo-lectura
// Dependencias: Dexie.js, APP_CONFIG

(function () {
  'use strict';

  if (typeof window.db !== 'undefined') return;

  var DB_NAME = window.APP_CONFIG && window.APP_CONFIG.app
    ? (window.APP_CONFIG.app.id || 'app') : 'app';

  var SCHEMA = {};

  // Tablas de sistema (siempre presentes)
  SCHEMA._sync_log = 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt';
  SCHEMA._ia_chats = 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt';
  SCHEMA._ia_messages = 'id, *chatId, *rol, contenido, *createdBy, createdAt';
  SCHEMA._files = '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt';
  SCHEMA._analytics = 'id, *page, *category, *action, *synced, *timestamp, createdAt';

  // En perfil Lite, añadir tabla de blobs para file:// sin acceso a disco
  if (!window.NL_OS && !window.Capacitor) {
    SCHEMA._file_blobs = '&path';
  }

  var db = new Dexie(DB_NAME);

  // ─── Versiones de schema ────────────────────────────
  // [INYECCIÓN DEL GENERADOR]: Cada app template define sus versiones
  // con stores() + upgrade() opcional. El generador reemplaza este bloque
  // completo con las versiones del template.
  //
  // Formato esperado del template:
  // ```javascript
  // db.version(1).stores(SCHEMA_V1);
  // db.version(2).stores(SCHEMA_V2).upgrade(tx => { ... });
  // window.DB_VERSION = 2;
  // ```

  // Fallback: una sola versión si el template no define migraciones
  window.DB_VERSION = 1;
  db.version(window.DB_VERSION).stores(SCHEMA);

  // ─── Helper de migración (disponible globalmente) ──
  // Las funciones upgrade() inyectadas pueden usar tx.table(name)
  // para transformar datos entre versiones. Ver apps/*/template.md
  // sección "Migración Dexie".

  window.db = db;

  // dbLocal — Dexie read-only helper (lectura instantánea desde IndexedDB)
  window.dbLocal = {
    async getAll(table) { return db[table].toArray(); },
    async get(table, id) { return db[table].get(id); },
    async where(table, field, value) { return db[table].where(field).equals(value).toArray(); },
    async first(table, field, value) { return db[table].where(field).equals(value).first(); },
    async count(table) { return db[table].count(); }
  };

  console.log('[db] Inicializado: ' + DB_NAME);
})();
