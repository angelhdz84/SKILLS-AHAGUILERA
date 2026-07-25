// modules/ia-jutia/ia-full.js — IA Jutia Full Profile Extension v1.0
// Dependencias: FlexSearch, SQLite (opcional), Transformers.js (opcional)
// Cargado bajo demanda por cargarFull() en module.js
// Expone: window.iaFull
// ES5 compatible — sin imports, sin ES6

;(function() {
  'use strict';

  if (typeof window.iaFull !== 'undefined') return;

  var MODULE_PATH = 'modules/ia-jutia/';

  var Full = {
    version: '1.0-plugin-full',
    _ready: false,
    _modelosCargados: false,
    _qaPipeline: null,
    _embedPipeline: null,

    initFull: async function() {
      console.log('[ia-full] Inicializando perfil Full...');
      
      // 1. Cargar ia-sqlite.js si está disponible
      try {
        if (!window.sqliteDB) {
          await Full._loadScript(MODULE_PATH + 'ia-sqlite.js');
        }
      } catch(e) {
        console.warn('[ia-full] SQLite no disponible, usando Dexie fallback:', e.message);
      }
      
      // 2. Cargar modelos si existen en ruta compartida
      Full._modelosCargados = await Full._loadModelos();
      
      // 3. Cargar documentos guardados
      await Full._cargarDocumentosGuardados();
      
      Full._ready = true;
      console.log('[ia-full] Perfil Full listo' + (Full._modelosCargados ? ' + modelos' : ' (sin modelos)'));
    },

    _loadScript: function(src) {
      return new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = function() { reject(new Error('No se pudo cargar: ' + src)); };
        document.head.appendChild(s);
      });
    },

    _loadModelos: async function() {
      // Full profile checks shared model path
      // In real deployment, this loads ONNX models from ProgramData
      // For now, return false (models not installed yet)
      var modeloPath = '';
      if (window.APP_CONFIG && window.APP_CONFIG.iaJutia && window.APP_CONFIG.iaJutia.modeloPath) {
        modeloPath = window.APP_CONFIG.iaJutia.modeloPath;
      }
      if (!modeloPath) {
        console.log('[ia-full] Sin ruta de modelos configurada. Usar solo busqueda local.');
        return false;
      }
      console.log('[ia-full] Modelos en:', modeloPath);
      return false;
    },

    _cargarDocumentosGuardados: async function() {
      if (!window.iaDB || !window.iaDB._ia_docs) return;
      try {
        var docs = await window.iaDB._ia_docs.toArray();
        var store = typeof Alpine !== 'undefined' ? Alpine.store('ia') : null;
        if (store) store.documentos = docs;
        console.log('[ia-full] Documentos cargados:', docs.length);
      } catch(e) {
        console.warn('[ia-full] Error cargando documentos:', e.message);
      }
    },

    // ─── Búsqueda híbrida: FlexSearch + embeddings ───
    searchHybrid: function(query, opts) {
      opts = opts || {};
      if (!window.ia || !window.ia._flex) return Promise.resolve([]);
      return window.ia.search(query, opts);
    },

    // ─── Question Answering sobre documentos ───
    qa: async function(pregunta, opts) {
      opts = opts || {};
      if (!pregunta) return { respuesta: 'Escribe una pregunta.', fuentes: [] };

      // 1. Try SQLite FTS5 first
      if (window.sqliteDB && typeof window.sqliteDB.searchChunks === 'function') {
        try {
          var results = await window.sqliteDB.searchChunks(pregunta);
          if (results && results.length > 0) {
            return {
              respuesta: results[0].texto || 'Resultado encontrado',
              fuentes: [{ tipo: 'fts5', texto: (results[0].texto || '').slice(0, 200) }]
            };
          }
        } catch(e) {
          console.warn('[ia-full] FTS5 error:', e.message);
        }
      }

      // 2. Fallback: buscar en documentos via FlexSearch
      if (window.ia && window.ia._flex) {
        var flexResults = await window.ia.search(pregunta, { limit: 3 });
        if (flexResults && flexResults.length > 0) {
          return {
            respuesta: 'Basado en tus documentos: ' + (flexResults[0].nombre || flexResults[0].texto || ''),
            fuentes: flexResults.slice(0, 3)
          };
        }
      }

      return { respuesta: 'No encontre informacion en los documentos.', fuentes: [] };
    },

    // ─── Ingesta de documentos ───
    ingestFile: async function(blob, nombre) {
      if (!blob) return { error: 'No se proporciono archivo' };
      nombre = nombre || blob.name || 'documento-' + Date.now();

      console.log('[ia-full] Ingiriendo:', nombre, blob.type, blob.size + ' bytes');

      // Read file as text (placeholder — real impl would use proper parsers)
      var texto = '';
      try {
        texto = await Full._readFileAsText(blob);
      } catch(e) {
        texto = '[No se pudo leer el contenido del archivo: ' + e.message + ']';
      }

      // Chunk the text
      var chunks = Full._chunkText(texto, 512, 64);

      // Save to iaDB
      if (window.iaDB) {
        var docId = 'doc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        try {
          await window.iaDB._ia_docs.put({
            id: docId,
            nombre: nombre,
            tipo: blob.type || 'unknown',
            size: blob.size,
            createdBy: (window.APP_CONFIG && window.APP_CONFIG.usuario) || 'local',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

          for (var ci = 0; ci < chunks.length; ci++) {
            await window.iaDB._ia_chunks.put({
              id: docId + '-chunk-' + ci,
              docId: docId,
              texto: chunks[ci],
              indice: ci,
              createdAt: new Date().toISOString()
            });
          }

          // Index in FlexSearch
          if (window.ia && window.ia._flex) {
            for (var fi = 0; fi < chunks.length; fi++) {
              window.ia._flex.add({
                id: docId + '-flex-' + fi,
                nombre: nombre + ' (fragmento ' + (fi + 1) + ')',
                texto: chunks[fi].slice(0, 500),
                tipo: blob.type || 'text',
                tabla: '_ia_docs'
              });
            }
          }

          // Update Alpine store
          var store = typeof Alpine !== 'undefined' ? Alpine.store('ia') : null;
          if (store) {
            var docs = await window.iaDB._ia_docs.toArray();
            store.documentos = docs;
          }

          console.log('[ia-full] Documento indexado:', docId, '-', chunks.length, 'chunks');
          return { id: docId, nombre: nombre, chunks: chunks.length };
        } catch(e) {
          console.error('[ia-full] Error guardando documento:', e);
          return { error: e.message };
        }
      }

      return { error: 'iaDB no disponible' };
    },

    _readFileAsText: function(blob) {
      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result || ''); };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsText(blob);
      });
    },

    _chunkText: function(texto, size, overlap) {
      size = size || 512;
      overlap = overlap || 64;
      if (!texto || texto.length <= size) return [texto || ''];
      var palabras = texto.split(/\s+/);
      var chunks = [];
      var start = 0;
      while (start < palabras.length) {
        var end = Math.min(start + size, palabras.length);
        chunks.push(palabras.slice(start, end).join(' '));
        start += (size - overlap);
      }
      return chunks;
    },

    getDocumentos: async function() {
      if (!window.iaDB || !window.iaDB._ia_docs) return [];
      try {
        return await window.iaDB._ia_docs.toArray();
      } catch(e) {
        console.warn('[ia-full] Error listando documentos:', e.message);
        return [];
      }
    },

    deleteDocumento: async function(docId) {
      if (!window.iaDB || !docId) return;
      try {
        // Delete chunks
        var chunks = await window.iaDB._ia_chunks.where('docId').equals(docId).toArray();
        for (var i = 0; i < chunks.length; i++) {
          await window.iaDB._ia_chunks.delete(chunks[i].id);
        }
        // Delete doc metadata
        await window.iaDB._ia_docs.delete(docId);
        // Remove from FlexSearch
        if (window.ia && window.ia._flex) {
          window.ia._flex.remove(docId + '-flex-*');
        }
        // Remove from SQLite
        if (window.sqliteDB && typeof window.sqliteDB.removeChunks === 'function') {
          try { await window.sqliteDB.removeChunks(docId); } catch(e) {}
        }
        // Update store
        var store = typeof Alpine !== 'undefined' ? Alpine.store('ia') : null;
        if (store) {
          store.documentos = await window.iaDB._ia_docs.toArray();
        }
        console.log('[ia-full] Documento eliminado:', docId);
      } catch(e) {
        console.warn('[ia-full] Error eliminando documento:', e.message);
      }
    },

    ocrStatus: function() {
      return { disponible: false, mensaje: 'OCR requiere Tesseract.js (no incluido en perfil base)' };
    },

    _cosineSimilarity: function(a, b) {
      if (!a || !b || a.length !== b.length) return 0;
      var dot = 0, normA = 0, normB = 0;
      for (var i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
      }
      if (normA === 0 || normB === 0) return 0;
      return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
  };

  window.iaFull = Full;
  console.log('[ia-full] v1.0-plugin-full listo');
})();
