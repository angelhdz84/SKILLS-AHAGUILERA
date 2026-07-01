// db.js — Inicialización Dexie con tablas de sistema
// window.db expuesto globalmente
// window.DB_VERSION auto-gestionado
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

  window.DB_VERSION = 1;

  db.version(window.DB_VERSION).stores(SCHEMA);

  window.db = db;
  console.log('[db] Inicializado: ' + DB_NAME);
})();
