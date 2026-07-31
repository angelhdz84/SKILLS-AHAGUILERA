// modules/ia-jutia/ia-full.js — IA Jutia Full Profile Extension v1.0
// Dependencias: FlexSearch, SQLite (opcional), Transformers.js, PDF.js, mammoth, SheetJS, Tesseract.js
// Cargado bajo demanda por _detectarFull() en module.js
// Expone: window.iaFull
// ES5 compatible — sin imports, sin ES6

;(function() {
  'use strict';

  if (typeof window.iaFull !== 'undefined') return;

  var MODULE_PATH = 'modules/ia-jutia/';

  var Full = {
    version: '1.0-plugin-full',
    _ready: false,
    _pipeline: null,

    // ─── Inicializacion ───
    initFull: async function() {
      console.log('[ia-full] Inicializando perfil Full+...');

      // 1. Configurar Transformers.js para modo offline
      if (typeof self.Transformers !== 'undefined') {
        self.Transformers.env.localModelPath = MODULE_PATH + 'models/';
        self.Transformers.env.allowRemoteModels = false;
        // Configurar rutas WASM
        if (self.Transformers.env.backends && self.Transformers.env.backends.onnx) {
          self.Transformers.env.backends.onnx.wasm = self.Transformers.env.backends.onnx.wasm || {};
          self.Transformers.env.backends.onnx.wasm.wasmPaths = MODULE_PATH + 'assets/wasm/';
        }
      } else {
        console.warn('[ia-full] Transformers.js no disponible');
        return;
      }

      // 2. Inicializar iaDB si no existe
      if (!window.iaDB) {
        try {
          window.iaDB = new Dexie('AHA_Jutia');
          window.iaDB.version(1).stores({
            _ia_docs: 'id, nombre, tipo, createdBy, createdAt, updatedAt',
            _ia_chunks: 'id, docId, texto, indice, createdAt',
            _ia_index: '&consulta'
          });
        } catch(e) {
          console.warn('[ia-full] Error creando iaDB:', e.message);
        }
      }

      // 3. Cargar SQLite si disponible
      try {
        if (!window.sqliteDB) {
          await Full._loadScript(MODULE_PATH + 'ia-sqlite.js');
        }
        if (window.sqliteDB && typeof window.sqliteDB.init === 'function') {
          await window.sqliteDB.init();
        }
      } catch(e) {
        console.warn('[ia-full] SQLite no disponible:', e.message);
      }

      // 4. Cargar documentos guardados
      await Full._cargarDocumentosGuardados();

      Full._ready = true;
      console.log('[ia-full] Perfil Full+ listo');
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

    // ─── Embeddings ───
    embed: async function(texto) {
      if (!texto) return [];
      try {
        // Lazy init: crear pipeline de embeddings
        if (!Full._pipeline) {
          if (typeof self.Transformers === 'undefined') return [];
          var pipelineFn = self.Transformers.pipeline;
          Full._pipeline = await pipelineFn(
            'feature-extraction',
            'Xenova/all-MiniLM-L6-v2'
          );
        }
        // Generar embedding
        var result = await Full._pipeline(texto, {
          pooling: 'mean',
          normalize: true
        });
        // Extraer vector del tensor
        var data = result.tolist ? result.tolist() : result.data || [];
        // El tensor de feature-extraction tiene forma [1, dim]; aplanar si es 2D
        if (data && data.length === 1 && Array.isArray(data[0])) {
          data = data[0];
        }
        return data;
      } catch(e) {
        console.warn('[ia-full] Error en embed:', e.message);
        return [];
      }
    },

    // ─── Question Answering sobre documentos ───
    qa: async function(pregunta, opts) {
      opts = opts || {};
      if (!pregunta) return { respuesta: 'Escribe una pregunta.', fuentes: [] };

      var resultados = [];

      // 1. SQLite FTS5
      if (window.sqliteDB && typeof window.sqliteDB.searchChunks === 'function') {
        try {
          var ftsResults = await window.sqliteDB.searchChunks(pregunta);
          if (ftsResults && ftsResults.length > 0) {
            resultados = ftsResults.slice(0, 5);
          }
        } catch(e) { /* fallback */ }
      }

      // 2. Embedding search si hay chunks
      if (resultados.length === 0 && window.iaDB && window.iaDB._ia_chunks) {
        try {
          var queryVec = await Full.embed(pregunta);
          if (queryVec && queryVec.length > 0) {
            var allChunks = await window.iaDB._ia_chunks.toArray();
            var scored = [];
            for (var ci = 0; ci < allChunks.length; ci++) {
              // Necesitariamos embedding del chunk guardado
              // Por ahora usar keyword match como placeholder
              var text = (allChunks[ci].texto || '').toLowerCase();
              var q = pregunta.toLowerCase();
              var score = 0;
              q.split(/\s+/).forEach(function(w) {
                if (w.length > 2 && text.indexOf(w) !== -1) score++;
              });
              if (score > 0) scored.push({ chunk: allChunks[ci], score: score });
            }
            scored.sort(function(a, b) { return b.score - a.score; });
            resultados = scored.slice(0, 3).map(function(s) { return s.chunk; });
          }
        } catch(e) { /* fallback */ }
      }

      // 3. Fallback FlexSearch
      if (resultados.length === 0 && window.ia && window.ia._flex) {
        try {
          var flexResults = await window.ia.search(pregunta, { limit: 3 });
          if (flexResults && flexResults.length > 0) {
            return {
              respuesta: 'Basado en tus datos: ' + (flexResults[0].nombre || flexResults[0].texto || ''),
              fuentes: flexResults.slice(0, 3)
            };
          }
        } catch(e) { /* fallback */ }
      }

      if (resultados.length > 0) {
        var texto = resultados.map(function(r) {
          return r.texto || r.text || '';
        }).join('\n\n').slice(0, 1000);
        return { respuesta: texto, fuentes: resultados.slice(0, 3) };
      }

      return { respuesta: 'No encontre informacion en los documentos.', fuentes: [] };
    },

    // ─── Ingesta de documentos ───
    ingestFile: async function(blob, nombre) {
      if (!blob) return { error: 'No se proporciono archivo' };
      nombre = nombre || blob.name || 'documento-' + Date.now();
      var ext = (nombre.split('.').pop() || '').toLowerCase();
      console.log('[ia-full] Ingiriendo:', nombre, ext, blob.size + ' bytes');

      // 1. Extraer texto segun tipo
      var texto = '';
      try {
        if (ext === 'pdf') {
          texto = await Full._extraerPDF(blob);
        } else if (ext === 'docx') {
          texto = await Full._extraerDOCX(blob);
        } else if (ext === 'xlsx' || ext === 'xls') {
          texto = await Full._extraerXLSX(blob);
        } else if (['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif'].indexOf(ext) !== -1) {
          texto = await Full._ocrImage(blob);
        } else {
          // TXT, CSV, MD, JSON
          texto = await Full._readFileAsText(blob);
        }
      } catch(e) {
        console.warn('[ia-full] Error extrayendo texto:', e.message);
        return { error: 'No se pudo extraer texto: ' + e.message };
      }

      if (!texto || texto.trim().length < 10) {
        return { error: 'El archivo no contiene texto legible.' };
      }

      // 2. Chunking
      var chunks = Full._chunkText(texto, 512, 64);

      // 3. Guardar en iaDB
      if (window.iaDB) {
        var docId = 'doc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        try {
          await window.iaDB._ia_docs.put({
            id: docId,
            nombre: nombre,
            tipo: ext,
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

          // Indexar chunks en FlexSearch
          if (window.ia && window.ia._flex) {
            for (var fi = 0; fi < chunks.length; fi++) {
              window.ia._flex.add({
                id: docId + '-flex-' + fi,
                nombre: nombre + ' (frag. ' + (fi + 1) + ')',
                texto: chunks[fi].slice(0, 500),
                tipo: ext,
                tabla: '_ia_docs'
              });
            }
          }

          // Indexar en SQLite FTS5
          if (window.sqliteDB && typeof window.sqliteDB.addChunks === 'function') {
            try {
              await window.sqliteDB.addChunks(docId, chunks);
            } catch(e) { /* fallback */ }
          }

          // Actualizar store
          var store = typeof Alpine !== 'undefined' ? Alpine.store('ia') : null;
          if (store) {
            store.documentos = await window.iaDB._ia_docs.toArray();
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

    // ─── Parsers de documentos ───
    _extraerPDF: function(blob) {
      return new Promise(function(resolve, reject) {
        if (typeof window.pdfjsLib === 'undefined') {
          reject(new Error('PDF.js no disponible'));
          return;
        }
        var reader = new FileReader();
        reader.onload = async function() {
          try {
            var data = new Uint8Array(reader.result);
            var loadingTask = window.pdfjsLib.getDocument({ data: data });
            // Compatible con PDF.js v2/v3 (task.promise) y v4+ (promise directo)
            var doc = await (loadingTask.promise ? loadingTask.promise : loadingTask);
            var fullText = [];
            for (var pi = 1; pi <= Math.min(doc.numPages, 50); pi++) {
              var page = await doc.getPage(pi);
              var content = await page.getTextContent();
              var strings = content.items.map(function(item) { return item.str; });
              fullText.push(strings.join(' '));
            }
            resolve(fullText.join('\n\n'));
          } catch(e) {
            reject(e);
          }
        };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsArrayBuffer(blob);
      });
    },

    _extraerDOCX: function(blob) {
      return new Promise(function(resolve, reject) {
        if (typeof window.mammoth === 'undefined') {
          reject(new Error('Mammoth.js no disponible'));
          return;
        }
        var reader = new FileReader();
        reader.onload = async function() {
          try {
            var result = await window.mammoth.extractRawText({ arrayBuffer: reader.result });
            resolve(result.value || '');
          } catch(e) {
            reject(e);
          }
        };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsArrayBuffer(blob);
      });
    },

    _extraerXLSX: function(blob) {
      return new Promise(function(resolve, reject) {
        if (typeof window.XLSX === 'undefined') {
          reject(new Error('SheetJS no disponible'));
          return;
        }
        var reader = new FileReader();
        reader.onload = function() {
          try {
            var wb = window.XLSX.read(reader.result, { type: 'array' });
            var lines = [];
            for (var si = 0; si < wb.SheetNames.length; si++) {
              var sheet = wb.Sheets[wb.SheetNames[si]];
              var json = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });
              for (var ri = 0; ri < json.length; ri++) {
                if (json[ri] && json[ri].length > 0) {
                  lines.push(json[ri].filter(function(c) { return c != null; }).join(' | '));
                }
              }
            }
            resolve(lines.join('\n'));
          } catch(e) {
            reject(e);
          }
        };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsArrayBuffer(blob);
      });
    },

    _ocrImage: function(blob) {
      return new Promise(function(resolve, reject) {
        if (typeof window.Tesseract === 'undefined') {
          reject(new Error('Tesseract.js no disponible'));
          return;
        }
        var reader = new FileReader();
        reader.onload = async function() {
          try {
            var result = await window.Tesseract.recognize(reader.result, 'spa', {
              logger: function(m) {
                if (m.status === 'recognizing text') {
                  var store = typeof Alpine !== 'undefined' ? Alpine.store('ia') : null;
                  if (store) store.progresoModelo = Math.round(m.progress * 100);
                }
              }
            });
            resolve(result.data.text || '');
          } catch(e) {
            reject(e);
          }
        };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsDataURL(blob);
      });
    },

    // ─── Busqueda híbrida: chunks puntuados + FlexSearch ───
    searchHybrid: async function(query, opts) {
      opts = opts || {};
      if (!query) return [];

      var results = [];

      // 1. Puntuar chunks por coincidencia de terminos
      if (window.iaDB && window.iaDB._ia_chunks) {
        try {
          var queryVec = await Full.embed(query);
          if (queryVec && queryVec.length > 0) {
            var allChunks = await window.iaDB._ia_chunks.toArray();
            var qWords = query.toLowerCase().split(/\s+/).filter(function(w) { return w.length > 2; });
            var scored = [];
            for (var ci = 0; ci < allChunks.length; ci++) {
              var text = (allChunks[ci].texto || '').toLowerCase();
              var score = 0;
              for (var wi = 0; wi < qWords.length; wi++) {
                var idx = text.indexOf(qWords[wi]);
                if (idx !== -1) {
                  score++;
                  // Bonus por posicion temprana
                  if (idx < 50) score += 0.5;
                }
              }
              if (score > 0) {
                scored.push({ chunk: allChunks[ci], score: score });
              }
            }
            scored.sort(function(a, b) { return b.score - a.score; });

            // Mapa docId -> nombre para mostrar el nombre real del documento
            var docMap = {};
            var docs = await window.iaDB._ia_docs.toArray();
            for (var di = 0; di < docs.length; di++) {
              docMap[docs[di].id] = docs[di].nombre;
            }

            results = scored.slice(0, opts.limit || 5).map(function(s) {
              return {
                texto: s.chunk.texto,
                nombre: docMap[s.chunk.docId] || s.chunk.docId,
                score: s.score,
                tabla: '_ia_docs'
              };
            });
          }
        } catch(e) {
          console.warn('[ia-full] Error en searchHybrid:', e.message);
        }
      }

      // 2. Fallback a FlexSearch
      if (results.length < (opts.limit || 5) && window.ia && window.ia._flex) {
        try {
          var flexResults = await window.ia.search(query, { limit: (opts.limit || 5) - results.length });
          if (flexResults && flexResults.length > 0) {
            results = results.concat(flexResults);
          }
        } catch(e) { /* fallback */ }
      }

      return results;
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
        // Remove from FlexSearch (un id por chunk, sin wildcards)
        if (window.ia && window.ia._flex) {
          for (var fi = 0; fi < chunks.length; fi++) {
            window.ia._flex.remove(docId + '-flex-' + fi);
          }
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
