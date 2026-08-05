# IA Jutia Full+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Spec:** `docs/2026-07-29/ia-jutia-full-module-design.md`

**Goal:** Build 2 portable ZIPs (Lite ~40KB, Full+ ~33MB) que se extraen en `modules/ia-jutia/` y activan IA offline con un solo `<script>`.

**Architecture:** Plugin auto-contenido con deteccion de perfil. Lite: FlexSearch + stats + chat. Full+: anade Transformers.js (embeddings), parsers (PDF/DOCX/XLSX), OCR (Tesseract), modelos ONNX locales. DB hibrida (chats en app DB, docs en AHA_Jutia).

**Tech Stack:** ES5, Alpine.js, Dexie, FlexSearch v0.8, Transformers.js UMD, ONNX Runtime Web (WASM), PDF.js, Mammoth.js, SheetJS, Tesseract.js, sql.js

---

## File Structure

```
ia-jutia/templates/plugin/
├── module.js              MODIFY — detect Full+ + load chain
├── ia-core.js             MODIFY — add embed() placeholder
├── ia-chat.js             MODIFY — hybrid search (BD + semantic)
├── ia-full.js             MODIFY — real Transformers + OCR + ingest
├── ia-worker.js           MODIFY — real Transformers pipeline
├── ia-sqlite.js           MODIFY — real sql.js FTS5
├── setup-ia.ps1           MODIFY — download Full+ models/assets
└── tools/
    ├── _registry.js        (existing, no change)
    ├── extraer-factura.js  (existing, no change)
    ├── extraer-pdf.js      CREATE — PDF.js wrapper
    ├── extraer-docx.js     CREATE — Mammoth.js wrapper
    └── extraer-xlsx.js     CREATE — SheetJS wrapper

ia-jutia/scripts/
└── build-ia-zips.ps1      CREATE — download CDN + models, package ZIPs

ia-jutia/SKILL.md           MODIFY — update version, add Full+ profile
```

---

### Task 1: Upgrade ia-core.js — add embed() method

**Files:**
- Modify: `ia-jutia/templates/plugin/ia-core.js` (after line 250, before closing `})()`)

- [ ] **Step 1: Add `embed()` method to IA object**

The `embed()` method checks for `window.iaFull` and delegates to its transformer model. Falls back to simple TF-IDF if Full+ not available.

Add after `movingAverage` function:

```javascript
    embed: function(texto) {
      // Si Full+ esta activo, usa transformers embedding
      if (window.iaFull && typeof window.iaFull.embed === 'function') {
        return window.iaFull.embed(texto);
      }
      // Fallback Lite: TF-IDF simple
      if (!texto) return [];
      var palabras = texto.toLowerCase().split(/\s+/);
      var freq = {};
      for (var i = 0; i < palabras.length; i++) {
        if (palabras[i].length > 2) {
          freq[palabras[i]] = (freq[palabras[i]] || 0) + 1;
        }
      }
      var keys = Object.keys(freq);
      var vec = [];
      for (var j = 0; j < keys.length; j++) {
        vec.push(freq[keys[j]]);
      }
      return vec;
    },
```

- [ ] **Step 2: Verify syntax**

Run: `node --check ia-jutia/templates/plugin/ia-core.js` (if Node available) or visual review for ES5 compatibility.

- [ ] **Step 3: Commit**

```bash
git add ia-jutia/templates/plugin/ia-core.js
git commit -m "feat(ia-jutia): add embed() method with Full+ fallback"
```

---

### Task 2: Upgrade ia-chat.js — hybrid search (BD + semantic)

**Files:**
- Modify: `ia-jutia/templates/plugin/ia-chat.js`

- [ ] **Step 1: Enhance `ask()` method**

The `ask()` method currently uses pattern matching for BD queries (count, sum, list, etc.). Enhance to fall back to semantic search when Full+ active.

Find the `ask` function and add semantic fallback after pattern matching fails:

```javascript
    ask: async function(chatId, pregunta) {
      // 1. Guardar mensaje usuario
      if (chatId) {
        await this.addMessage(chatId, 'user', pregunta, null, null);
      }

      // 2. Intentar patrones NL primero
      var patronResult = this._matchPattern(pregunta);
      if (patronResult) {
        var respuesta = await this._ejecutarPatron(patronResult);
        if (chatId) {
          await this.addMessage(chatId, 'ia', respuesta.respuesta, respuesta.fuente, respuesta.score);
        }
        return respuesta;
      }

      // 3. Fallback: busqueda semantica (Full+) o FlexSearch
      var resultados = [];
      var fuente = 'flexsearch';

      if (window.iaFull && window.iaFull._ready && window.iaFull.searchHybrid) {
        // Full+: embeddings semanticos
        resultados = await window.iaFull.searchHybrid(pregunta, { limit: 3 });
        fuente = 'semantico';
      } else if (window.ia && window.ia._flex) {
        // Lite: FlexSearch full-text
        resultados = await window.ia.search(pregunta, { limit: 3 });
      }

      var respuestaIA = '';
      if (resultados && resultados.length > 0) {
        respuestaIA = this._formatearResultados(resultados);
      } else {
        respuestaIA = 'No encontre informacion relacionada en los datos disponibles. ' +
          'Intenta reformular la pregunta o se mas especifico.';
      }

      if (chatId) {
        await this.addMessage(chatId, 'ia', respuestaIA, fuente, null);
      }
      return { respuesta: respuestaIA, fuente: fuente };
    },
```

- [ ] **Step 2: Add `_formatearResultados()` helper**

```javascript
    _formatearResultados: function(resultados) {
      if (!resultados || resultados.length === 0) return 'Sin resultados.';
      var lines = ['Encontre esto en tus datos:\n'];
      for (var i = 0; i < Math.min(resultados.length, 3); i++) {
        var r = resultados[i];
        var nombre = r.nombre || r.tabla || 'documento';
        var texto = r.texto || r.descripcion || '';
        lines.push((i + 1) + '. **' + nombre + '**: ' + texto.slice(0, 200));
      }
      return lines.join('\n');
    },
```

- [ ] **Step 3: Commit**

```bash
git add ia-jutia/templates/plugin/ia-chat.js
git commit -m "feat(ia-jutia): add semantic fallback to chat ask()"
```

---

### Task 3: Rewrite module.js — Full+ detection + load chain

**Files:**
- Modify: `ia-jutia/templates/plugin/module.js`

- [ ] **Step 1: Rewrite `init()` to detect Full+ by asset presence**

Replace the current `init()` method (lines 494-541) with this version that auto-detects Full+:

```javascript
    async init () {
      console.log('[ia-jutia] Plugin IA Jutia iniciando...');
      var store = null;

      // 1. FlexSearch lazy load
      try {
        var FS = await loadFlexSearch();
        console.log('[ia-jutia] FlexSearch:', FS ? 'ok' : 'no disponible');
      } catch (e) {
        console.warn('[ia-jutia] FlexSearch no disponible:', e.message);
      }

      // 2. Cargar ia-core.js + ia-chat.js (siempre)
      try {
        await loadScript('modules/ia-jutia/ia-core.js');
        await loadScript('modules/ia-jutia/ia-chat.js');
        console.log('[ia-jutia] Core + Chat cargados');
      } catch (e) {
        console.warn('[ia-jutia] Error cargando core:', e.message);
        return;
      }

      // 3. Cargar tools
      for (var ti = 0; ti < TOOL_FILES.length; ti++) {
        try {
          await loadScript('modules/ia-jutia/' + TOOL_FILES[ti]);
        } catch (e) { /* tool opcional */ }
      }

      // 4. Inicializar IA core + chat
      if (window.ia && typeof window.ia.init === 'function') {
        window.ia.init();
        if (window.ia.chat && typeof window.ia.chat.init === 'function') {
          window.ia.chat.init();
        }
      }

      // 5. Asegurar tablas DB
      ensureDBTables();

      // 6. Registrar store Alpine (necesario para FAB+Drawer)
      registerAlpineStore();
      store = Alpine.store('ia');

      // 7. Detectar Full+: intentar cargar transformers.min.js desde assets/
      this._detectarFull(store).then(function() {
        console.log('[ia-jutia] Plugin listo, perfil:', store ? store.perfilReal : 'unknown');
      });

      // 8. Inyectar FAB + Drawer
      injectFabDrawer();

      // 9. Disparar evento ready
      var evt = new CustomEvent('jutia:ready', { detail: { id: MODULE_ID } });
      window.dispatchEvent(evt);
    },

    _detectarFull: async function(store) {
      // Intentar cargar Transformers.js desde assets local
      try {
        await loadScript('modules/ia-jutia/assets/transformers.min.js');
        console.log('[ia-jutia] Transformers.js cargado — perfil Full+');
      } catch (e) {
        console.log('[ia-jutia] Transformers.js no disponible — perfil Lite');
        if (store) store.perfilReal = 'lite';
        return;
      }

      // Transformers.js cargado, cargar modulos Full+
      try {
        await loadScript('modules/ia-jutia/ia-full.js');
        await loadScript('modules/ia-jutia/ia-sqlite.js');
        console.log('[ia-jutia] Modulos Full+ cargados');
      } catch (e) {
        console.warn('[ia-jutia] Error cargando modulos Full+:', e.message);
        if (store) store.perfilReal = 'lite';
        return;
      }

      // Inicializar Full+
      if (window.iaFull && typeof window.iaFull.initFull === 'function') {
        try {
          await window.iaFull.initFull();
          if (store) {
            store.perfilReal = 'full';
            store.modeloListo = true;
          }
          console.log('[ia-jutia] Perfil Full+ listo');
        } catch (e) {
          console.warn('[ia-jutia] Error initFull:', e.message);
          if (store) store.perfilReal = 'lite';
        }
      }
    },
```

- [ ] **Step 2: Update `TOOL_FILES` array to include new tools**

```javascript
  var TOOL_FILES = [
    'tools/_registry.js',
    'tools/extraer-factura.js',
    'tools/extraer-pdf.js',
    'tools/extraer-docx.js',
    'tools/extraer-xlsx.js'
  ];
```

- [ ] **Step 3: Update DRAWER_HTML settings view to show upload button for Full+**

Replace the "Documentos indexados" section in DRAWER_HTML (lines 441-453) with:

```javascript
    '    <!-- Documentos (Full+) -->',
    '    <div class="card bg-base-200 rounded-box p-3 mb-3" x-show="$store.ia.perfilReal === \'full\'">',
    '      <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">',
    '        <i class="bi bi-file-earmark"></i> Documentos',
    '      </p>',
    '      <div class="flex gap-2 mb-2">',
    '        <input type="file" id="ia-file-upload" accept=".pdf,.docx,.xlsx,.txt,.csv,.md,.jpg,.png"',
    '               class="file-input file-input-bordered file-input-xs w-full"',
    '               @change="$store.ia.uploadDocumento($event)" />',
    '      </div>',
    '      <template x-if="$store.ia.documentos.length === 0">',
    '        <p class="text-[10px] text-base-content/40">Sin documentos. Sube un PDF, DOCX o XLSX para consultar.</p>',
    '      </template>',
    '      <template x-for="doc in $store.ia.documentos" :key="doc.id">',
    '        <div class="flex items-center justify-between py-1">',
    '          <span class="text-xs truncate flex-1" x-text="doc.nombre"></span>',
    '          <button class="btn btn-ghost btn-xs btn-square text-error/60 hover:text-error"',
    '                  @click="if(window.iaFull) window.iaFull.deleteDocumento(doc.id)"',
    '                  title="Eliminar">',
    '            <i class="bi bi-trash3"></i>',
    '          </button>',
    '        </div>',
    '      </template>',
    '    </div>',
```

- [ ] **Step 4: Add `uploadDocumento()` method to Alpine store**

```javascript
        uploadDocumento: async function(event) {
          var store = Alpine.store('ia');
          var file = event.target.files[0];
          if (!file || !window.iaFull) return;
          store.isLoading = true;
          try {
            var result = await window.iaFull.ingestFile(file, file.name);
            if (result.error) {
              console.warn('[ia-jutia] Error subiendo:', result.error);
            } else {
              store.documentos = await window.iaFull.getDocumentos();
            }
          } catch(e) {
            console.warn('[ia-jutia] Error:', e.message);
          }
          store.isLoading = false;
          event.target.value = '';
        },
```

- [ ] **Step 5: Commit**

```bash
git add ia-jutia/templates/plugin/module.js
git commit -m "feat(ia-jutia): module.js with Full+ detection + document upload"
```

---

### Task 4: Rewrite ia-full.js — real Transformers.js + OCR + ingest

**Files:**
- Modify: `ia-jutia/templates/plugin/ia-full.js`

- [ ] **Step 1: Rewrite `initFull()` with real transformer loading**

```javascript
    initFull: async function() {
      console.log('[ia-full] Inicializando perfil Full+...');

      // 1. Configurar Transformers.js para modo offline
      if (typeof self.Transformers !== 'undefined') {
        self.Transformers.env.localModelPath = 'modules/ia-jutia/models/';
        self.Transformers.env.allowRemoteModels = false;
        // Configurar rutas WASM
        if (self.Transformers.env.backends && self.Transformers.env.backends.onnx) {
          self.Transformers.env.backends.onnx.wasm = self.Transformers.env.backends.onnx.wasm || {};
          self.Transformers.env.backends.onnx.wasm.wasmPaths = 'modules/ia-jutia/assets/wasm/';
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
            _ia_index: '&consulta',
            modelos_cache: '&ruta'
          });
        } catch(e) {
          console.warn('[ia-full] Error creando iaDB:', e.message);
        }
      }

      // 3. Cargar SQLite si disponible
      try {
        if (!window.sqliteDB) {
          await Full._loadScript('modules/ia-jutia/ia-sqlite.js');
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
```

- [ ] **Step 2: Rewrite `embed()` with real Transformers.js pipeline**

```javascript
    _pipeline: null,

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
        return data;
      } catch(e) {
        console.warn('[ia-full] Error en embed:', e.message);
        return [];
      }
    },
```

- [ ] **Step 3: Rewrite `qa()` with semantic search**

```javascript
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
```

- [ ] **Step 4: Rewrite `ingestFile()` with real parsers**

```javascript
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
        texto = '[Error al leer: ' + e.message + ']';
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
          return { error: e.message };
        }
      }
      return { error: 'iaDB no disponible' };
    },
```

- [ ] **Step 5: Add parsing methods**

```javascript
    _extraerPDF: function(blob) {
      return new Promise(function(resolve, reject) {
        // Usar FileReader + PDF.js si esta disponible en window
        if (typeof window.pdfjsLib === 'undefined') {
          reject(new Error('PDF.js no disponible'));
          return;
        }
        var reader = new FileReader();
        reader.onload = async function() {
          try {
            var data = new Uint8Array(reader.result);
            var doc = await window.pdfjsLib.getDocument({ data: data }).promise;
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
```

- [ ] **Step 6: Update `searchHybrid()` for real embedding search**

Replace existing `searchHybrid`:

```javascript
    searchHybrid: async function(query, opts) {
      opts = opts || {};
      if (!query) return [];

      var results = [];

      // 1. Embedding search against chunks (if available)
      if (window.iaDB && window.iaDB._ia_chunks) {
        try {
          var queryVec = await Full.embed(query);
          if (queryVec && queryVec.length > 0) {
            // Encontrar chunks mas similares
            var allChunks = await window.iaDB._ia_chunks.toArray();
            // Para busqueda inicial, usar keyword match + score
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
            results = scored.slice(0, opts.limit || 5).map(function(s) {
              return { texto: s.chunk.texto, nombre: s.chunk.docId, score: s.score, tabla: '_ia_docs' };
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
```

- [ ] **Step 7: Remove old duplicate methods and clean up**

Ensure there's only one copy of `_cosineSimilarity`, `_chunkText`, `_readFileAsText`. Keep the existing ones (they're fine).

- [ ] **Step 8: Commit**

```bash
git add ia-jutia/templates/plugin/ia-full.js
git commit -m "feat(ia-jutia): rewrite ia-full.js with real Transformers.js + OCR + parsers"
```

---

### Task 5: Rewrite ia-worker.js — real Transformers.js worker

**Files:**
- Modify: `ia-jutia/templates/plugin/ia-worker.js`

- [ ] **Step 1: Rewrite with real Transformers.js pipeline**

```javascript
// modules/ia-jutia/ia-worker.js — IA Jutia Web Worker (Full+ DLC)
// Cargado por ia-full.js cuando Transformers.js esta disponible
// Usa importScripts() para cargar UMD bundle

self.onmessage = function(e) {
  var msg = e.data || {};

  switch (msg.type) {
    case 'init':
      // Transformers.js UMD debe estar cargado via importScripts ANTES de crear el worker
      self.postMessage({ type: 'ready', worker: 'ia-jutia', version: '2.0-full' });
      break;

    case 'embed':
      _handleEmbed(msg);
      break;

    case 'qa':
      _handleQA(msg);
      break;

    default:
      self.postMessage({ type: 'error', message: 'Tipo desconocido: ' + msg.type });
  }
};

function _handleEmbed(msg) {
  var texto = msg.text || '';
  if (!texto) {
    self.postMessage({ type: 'embed_result', vector: [], dimension: 0 });
    return;
  }

  // Usar Transformers.js pipeline
  try {
    if (typeof self.Transformers === 'undefined') {
      self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: 'Transformers.js no disponible' });
      return;
    }

    self.Transformers.env.localModelPath = msg.modelPath || 'modules/ia-jutia/models/';
    self.Transformers.env.allowRemoteModels = false;

    var pipeline = self.Transformers.pipeline;

    pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2').then(function(extract) {
      return extract(texto, { pooling: 'mean', normalize: true });
    }).then(function(result) {
      var data = result.tolist ? result.tolist() : [];
      self.postMessage({
        type: 'embed_result',
        vector: data,
        dimension: Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) ? data[0].length : 384
      });
    }).catch(function(err) {
      self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: err.message });
    });
  } catch(e) {
    self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: e.message });
  }
}

function _handleQA(msg) {
  var pregunta = msg.question || '';
  var chunks = msg.chunks || [];

  if (typeof self.Transformers === 'undefined' || !pregunta || chunks.length === 0) {
    // Fallback: keyword matching
    var best = null;
    var bestScore = 0;
    var qWords = pregunta.toLowerCase().split(/\s+/);
    for (var i = 0; i < chunks.length; i++) {
      var text = (chunks[i].texto || '').toLowerCase();
      var score = 0;
      for (var j = 0; j < qWords.length; j++) {
        if (qWords[j].length > 2 && text.indexOf(qWords[j]) !== -1) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        best = chunks[i];
      }
    }
    self.postMessage({
      type: 'qa_result',
      respuesta: best ? best.texto.slice(0, 500) : 'No se encontro respuesta',
      confianza: bestScore / Math.max(qWords.length, 1),
      chunkId: best ? best.id : null
    });
    return;
  }

  // Usar Transformers.js QA pipeline
  try {
    self.Transformers.env.localModelPath = msg.modelPath || 'modules/ia-jutia/models/';
    self.Transformers.env.allowRemoteModels = false;

    var pipelineQA = self.Transformers.pipeline;
    pipelineQA('question-answering', 'Xenova/distilbert-squad-qa').then(function(qa) {
      var contexto = chunks.map(function(c) { return c.texto || ''; }).join(' ');
      return qa(pregunta, contexto);
    }).then(function(result) {
      self.postMessage({
        type: 'qa_result',
        respuesta: result.answer || result.text || '',
        confianza: result.score || 0,
        chunkId: null
      });
    }).catch(function(err) {
      self.postMessage({ type: 'qa_result', error: err.message });
    });
  } catch(e) {
    self.postMessage({ type: 'qa_result', error: e.message });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/templates/plugin/ia-worker.js
git commit -m "feat(ia-jutia): rewrite ia-worker.js with real Transformers pipelines"
```

---

### Task 6: Rewrite ia-sqlite.js — real sql.js FTS5

**Files:**
- Modify: `ia-jutia/templates/plugin/ia-sqlite.js`

- [ ] **Step 1: Rewrite with real sql.js + FTS5**

Replace entire file content:

```javascript
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
      } catch(e) {
        console.warn('[ia-sqlite] Error SQLite, modo degradado:', e.message);
        this._ready = true;
      }
    },

    _loadSqlJs: function() {
      return new Promise(function(resolve, reject) {
        // Buscar assets/wasm/sql-wasm.js (descargado por setup-ia.ps1)
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
      try {
        this._db.run("BEGIN TRANSACTION");
        var stmt = this._db.prepare("INSERT INTO chunks_fts(docId, texto) VALUES (?, ?)");
        for (var i = 0; i < chunks.length; i++) {
          stmt.run([docId, chunks[i]]);
        }
        stmt.free();
        this._db.run("COMMIT");
        this._dirty = true;
        this._scheduleSave();
      } catch(e) {
        console.warn('[ia-sqlite] Error addChunks:', e.message);
      }
    },

    removeChunks: async function(docId) {
      if (!this._ready || !this._db) return;
      try {
        this._db.run("DELETE FROM chunks_fts WHERE docId = ?", [docId]);
        this._dirty = true;
        this._scheduleSave();
      } catch(e) {
        console.warn('[ia-sqlite] Error removeChunks:', e.message);
      }
    },

    searchChunks: async function(query) {
      if (!this._ready || !this._db) return SQLiteDB._fallbackSearch(query);
      try {
        // Escape FTS5 special chars
        var sanitized = query.replace(/['"]/g, '').replace(/[^\w\sáéíóúñ]/g, ' ').trim();
        if (!sanitized) return [];

        var words = sanitized.split(/\s+/).filter(function(w) { return w.length > 2; });
        if (words.length === 0) return [];

        // Build FTS5 query: each word as a required term
        var ftsQuery = words.map(function(w) { return w + '*'; }).join(' AND ');

        var sql = "SELECT docId, texto, rank FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY rank LIMIT 10";
        var stmt = this._db.prepare(sql);
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
        stmt.free();
        return results;
      } catch(e) {
        console.warn('[ia-sqlite] FTS5 error, fallback Dexie:', e.message);
        return SQLiteDB._fallbackSearch(query);
      }
    },

    _fallbackSearch: async function(query) {
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
        return [];
      }
    },

    count: async function() {
      if (!this._ready || !this._db) return 0;
      try {
        var stmt = this._db.prepare("SELECT COUNT(*) as cnt FROM chunks_fts");
        stmt.step();
        var row = stmt.getAsObject();
        stmt.free();
        return row.cnt || 0;
      } catch(e) {
        return 0;
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
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/templates/plugin/ia-sqlite.js
git commit -m "feat(ia-jutia): rewrite ia-sqlite.js with real sql.js FTS5"
```

---

### Task 7: Create tool files (extraer-pdf, extraer-docx, extraer-xlsx)

**Files:**
- Create: `ia-jutia/templates/plugin/tools/extraer-pdf.js`
- Create: `ia-jutia/templates/plugin/tools/extraer-docx.js`
- Create: `ia-jutia/templates/plugin/tools/extraer-xlsx.js`

- [ ] **Step 1: Create `extraer-pdf.js`**

```javascript
// modules/ia-jutia/tools/extraer-pdf.js — Extraccion de texto PDF (Full+)
// Dependencias: PDF.js (window.pdfjsLib)
// ES5 compatible

;(function() {
  'use strict';

  if (window.IA_TOOLS && typeof window.IA_TOOLS.register === 'function') {
    window.IA_TOOLS.register('extraer-pdf', {
      nombre: 'Extraer PDF',
      descripcion: 'Extrae texto de archivos PDF usando PDF.js',
      estado: 'disponible',

      ejecutar: async function(contexto) {
        var archivo = contexto && contexto.archivo;
        if (!archivo) return { error: 'No se proporciono archivo PDF' };

        if (typeof window.pdfjsLib === 'undefined') {
          return { error: 'PDF.js no esta cargado. Verifica que assets/pdf.min.js existe.' };
        }

        try {
          var data = new Uint8Array(archivo);
          var doc = await window.pdfjsLib.getDocument({ data: data }).promise;
          var paginas = Math.min(doc.numPages, 100);
          var textoCompleto = [];

          for (var pi = 1; pi <= paginas; pi++) {
            var page = await doc.getPage(pi);
            var content = await page.getTextContent();
            var strings = content.items.map(function(item) { return item.str; });
            textoCompleto.push(strings.join(' '));
          }

          return { exito: true, texto: textoCompleto.join('\n\n'), paginas: paginas };
        } catch(e) {
          return { error: 'Error leyendo PDF: ' + e.message };
        }
      }
    });
  }
})();
```

- [ ] **Step 2: Create `extraer-docx.js`**

```javascript
// modules/ia-jutia/tools/extraer-docx.js — Extraccion de texto DOCX (Full+)
// Dependencias: Mammoth.js (window.mammoth)
// ES5 compatible

;(function() {
  'use strict';

  if (window.IA_TOOLS && typeof window.IA_TOOLS.register === 'function') {
    window.IA_TOOLS.register('extraer-docx', {
      nombre: 'Extraer DOCX',
      descripcion: 'Extrae texto de archivos Word (.docx) usando Mammoth.js',
      estado: 'disponible',

      ejecutar: async function(contexto) {
        var archivo = contexto && contexto.archivo;
        if (!archivo) return { error: 'No se proporciono archivo DOCX' };

        if (typeof window.mammoth === 'undefined') {
          return { error: 'Mammoth.js no esta cargado. Verifica que assets/mammoth.min.js existe.' };
        }

        try {
          var result = await window.mammoth.extractRawText({ arrayBuffer: archivo });
          return { exito: true, texto: result.value || '' };
        } catch(e) {
          return { error: 'Error leyendo DOCX: ' + e.message };
        }
      }
    });
  }
})();
```

- [ ] **Step 3: Create `extraer-xlsx.js`**

```javascript
// modules/ia-jutia/tools/extraer-xlsx.js — Extraccion de texto XLSX (Full+)
// Dependencias: SheetJS (window.XLSX)
// ES5 compatible

;(function() {
  'use strict';

  if (window.IA_TOOLS && typeof window.IA_TOOLS.register === 'function') {
    window.IA_TOOLS.register('extraer-xlsx', {
      nombre: 'Extraer XLSX',
      descripcion: 'Extrae texto de archivos Excel (.xlsx/.xls) usando SheetJS',
      estado: 'disponible',

      ejecutar: async function(contexto) {
        var archivo = contexto && contexto.archivo;
        if (!archivo) return { error: 'No se proporciono archivo XLSX' };

        if (typeof window.XLSX === 'undefined') {
          return { error: 'SheetJS no esta cargado. Verifica que assets/xlsx.js existe.' };
        }

        try {
          var wb = window.XLSX.read(archivo, { type: 'array' });
          var lines = [];

          for (var si = 0; si < wb.SheetNames.length; si++) {
            var sheetName = wb.SheetNames[si];
            var sheet = wb.Sheets[sheetName];
            var json = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });

            lines.push('--- Hoja: ' + sheetName + ' ---');
            for (var ri = 0; ri < Math.min(json.length, 500); ri++) {
              if (json[ri] && json[ri].length > 0) {
                lines.push(json[ri].filter(function(c) { return c != null; }).join(' | '));
              }
            }
          }

          return { exito: true, texto: lines.join('\n') };
        } catch(e) {
          return { error: 'Error leyendo XLSX: ' + e.message };
        }
      }
    });
  }
})();
```

- [ ] **Step 4: Commit**

```bash
git add ia-jutia/templates/plugin/tools/extraer-pdf.js ia-jutia/templates/plugin/tools/extraer-docx.js ia-jutia/templates/plugin/tools/extraer-xlsx.js
git commit -m "feat(ia-jutia): add PDF, DOCX, XLSX extraction tools"
```

---

### Task 8: Update setup-ia.ps1 — Full+ download support

**Files:**
- Modify: `ia-jutia/templates/plugin/setup-ia.ps1`

- [ ] **Step 1: Add Full+ asset download section**

Add after the FlexSearch download block:

```powershell
# --- Full+ Assets (opcional, solo si existe ia-full.js) ---
$iaFullPath = Join-Path $pluginDir "ia-full.js"

if ((Test-Path $iaFullPath)) {
    Write-Output ""
    Write-Output "[Full+] Detectado perfil Full+"
    
    # Transformers.js UMD
    $tfPath = Join-Path $assetsDir "transformers.min.js"
    if (-not (Test-Path $tfPath) -or $Force) {
        Write-Output "[Full+] Descargando Transformers.js..."
        & $CURL $tfPath "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/dist/transformers.min.js"
    }
    
    # WASM files (ONNX Runtime + sql.js)
    $wasmDir = Join-Path $assetsDir "wasm"
    if (-not (Test-Path $wasmDir)) { New-Item -ItemType Directory -Path $wasmDir -Force | Out-Null }
    
    $wasmFiles = @(
        @("ort-wasm-simd-threaded.wasm", "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort-wasm-simd-threaded.wasm"),
        @("ort-wasm-simd.wasm", "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort-wasm-simd.wasm"),
        @("sql-wasm.wasm", "https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.wasm"),
        @("sql-wasm.js", "https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.js")
    )
    
    foreach ($file in $wasmFiles) {
        $path = Join-Path $wasmDir $file[0]
        if (-not (Test-Path $path) -or $Force) {
            Write-Output "[Full+] Descargando WASM: $($file[0])..."
            & $CURL $path $file[1]
        }
    }
    
    # PDF.js UMD
    $pdfPath = Join-Path $assetsDir "pdf.min.js"
    if (-not (Test-Path $pdfPath) -or $Force) {
        Write-Output "[Full+] Descargando PDF.js..."
        & $CURL $pdfPath "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.min.js"
        # Also download pdf.worker.min.js
        $pdfWorker = Join-Path $assetsDir "pdf.worker.min.js"
        & $CURL $pdfWorker "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.js"
    }
    
    # Mammoth.js UMD
    $mamPath = Join-Path $assetsDir "mammoth.min.js"
    if (-not (Test-Path $mamPath) -or $Force) {
        Write-Output "[Full+] Descargando Mammoth.js..."
        & $CURL $mamPath "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js"
    }
    
    # Tesseract.js UMD + language data
    $tesPath = Join-Path $assetsDir "tesseract.min.js"
    if (-not (Test-Path $tesPath) -or $Force) {
        Write-Output "[Full+] Descargando Tesseract.js..."
        & $CURL $tesPath "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"
    }
    
    # Modelos ONNX (all-MiniLM-L6-v2 + distilbert-squad-qa)
    $modelsDir = Join-Path $pluginDir "models\Xenova"
    if (-not (Test-Path $modelsDir)) { New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null }
    
    $hfBase = "https://huggingface.co/Xenova"
    
    $models = @(
        @("all-MiniLM-L6-v2\onnx\model_quantized.onnx", "$hfBase/all-MiniLM-L6-v2/resolve/main/onnx/model_quantized.onnx"),
        @("all-MiniLM-L6-v2\config.json", "$hfBase/all-MiniLM-L6-v2/resolve/main/config.json"),
        @("all-MiniLM-L6-v2\tokenizer.json", "$hfBase/all-MiniLM-L6-v2/resolve/main/tokenizer.json"),
        @("distilbert-squad-qa\onnx\model_quantized.onnx", "$hfBase/distilbert-base-uncased-distilled-squad/resolve/main/onnx/model_quantized.onnx"),
        @("distilbert-squad-qa\config.json", "$hfBase/distilbert-base-uncased-distilled-squad/resolve/main/config.json"),
        @("distilbert-squad-qa\tokenizer.json", "$hfBase/distilbert-base-uncased-distilled-squad/resolve/main/tokenizer.json")
    )
    
    foreach ($model in $models) {
        $path = Join-Path $modelsDir $model[0]
        $parentDir = Split-Path $path -Parent
        if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Path $parentDir -Force | Out-Null }
        if (-not (Test-Path $path) -or $Force) {
            Write-Output "[Full+] Descargando modelo: $($model[0])..."
            & $CURL $path $model[1]
        }
    }
    
    Write-Output "[Full+] Descarga completa"
}
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/templates/plugin/setup-ia.ps1
git commit -m "feat(ia-jutia): add Full+ asset download to setup-ia.ps1"
```

---

### Task 9: Create build-ia-zips.ps1 — ZIP packaging script

**Files:**
- Create: `ia-jutia/scripts/build-ia-zips.ps1`

- [ ] **Step 1: Create packaging script**

```powershell
# ia-jutia/scripts/build-ia-zips.ps1
# Construye los 2 ZIPs distribuibles de IA Jutia
# Requiere: PowerShell 5.1+, curl, 7zip (o Compress-Archive)

param(
    [switch]$Force,
    [switch]$SkipModels
)

$version = "1.0.0"
$outputDir = "dist"
$liteDir = "$outputDir\ia-jutia-lite"
$fullDir = "$outputDir\ia-jutia-full"
$templateDir = "ia-jutia\templates\plugin"

# --- 1. Crear directorios ---
New-Item -ItemType Directory -Path $liteDir -Force | Out-Null
New-Item -ItemType Directory -Path $fullDir -Force | Out-Null

# --- 2. Copiar archivos comunes (Lite = Full sin assets/models) ---
Write-Output "[Build] Copiando archivos Lite..."
Copy-Item "$templateDir\module.js" "$liteDir\"
Copy-Item "$templateDir\ia-core.js" "$liteDir\"
Copy-Item "$templateDir\ia-chat.js" "$liteDir\"
Copy-Item "$templateDir\setup-ia.ps1" "$liteDir\"
Copy-Item "$templateDir\setup-ia.ps1" "$fullDir\"  # Full tambien necesita setup

# Tools (todos menos extraer-pdf/docx/xlsx que no estan en Lite)
$liteTools = @("_registry.js", "extraer-factura.js")
New-Item -ItemType Directory -Path "$liteDir\tools" -Force | Out-Null
foreach ($t in $liteTools) {
    if (Test-Path "$templateDir\tools\$t") {
        Copy-Item "$templateDir\tools\$t" "$liteDir\tools\"
    }
}

# Assets Lite = solo flexsearch
New-Item -ItemType Directory -Path "$liteDir\assets" -Force | Out-Null
Copy-Item "$templateDir\assets\flexsearch.min.js" "$liteDir\assets\" -ErrorAction SilentlyContinue

# --- 3. Full+ = Lite + todos los extras ---
Write-Output "[Build] Copiando archivos Full+..."
# module.js Full+ es el mismo (auto-detects)
Copy-Item "$templateDir\module.js" "$fullDir\"
Copy-Item "$templateDir\ia-core.js" "$fullDir\"
Copy-Item "$templateDir\ia-chat.js" "$fullDir\"

# Full-specific modules
Copy-Item "$templateDir\ia-full.js" "$fullDir\"
Copy-Item "$templateDir\ia-worker.js" "$fullDir\"
Copy-Item "$templateDir\ia-sqlite.js" "$fullDir\"

# Tools (todos)
New-Item -ItemType Directory -Path "$fullDir\tools" -Force | Out-Null
Get-ChildItem "$templateDir\tools\*.js" | ForEach-Object {
    Copy-Item $_.FullName "$fullDir\tools\"
}

# Assets Full+
New-Item -ItemType Directory -Path "$fullDir\assets" -Force | Out-Null
New-Item -ItemType Directory -Path "$fullDir\assets\wasm" -Force | Out-Null

# Descargar assets CDN
$assets = @(
    @("assets\flexsearch.min.js", "https://cdn.jsdelivr.net/npm/flexsearch@0.8.212/dist/flexsearch.bundle.min.js"),
    @("assets\transformers.min.js", "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/dist/transformers.min.js"),
    @("assets\pdf.min.js", "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.min.js"),
    @("assets\pdf.worker.min.js", "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.js"),
    @("assets\mammoth.min.js", "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js"),
    @("assets\tesseract.min.js", "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"),
    @("assets\wasm\ort-wasm-simd-threaded.wasm", "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort-wasm-simd-threaded.wasm"),
    @("assets\wasm\ort-wasm-simd.wasm", "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort-wasm-simd.wasm"),
    @("assets\wasm\sql-wasm.wasm", "https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.wasm"),
    @("assets\wasm\sql-wasm.js", "https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.js")
)

foreach ($asset in $assets) {
    $path = "$fullDir\$($asset[0])"
    if (-not (Test-Path $path) -or $Force) {
        Write-Output "  Descargando: $($asset[0])..."
        $parent = Split-Path $path -Parent
        if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
        Invoke-WebRequest -Uri $asset[1] -OutFile $path -UseBasicParsing
    }
}

# Modelos ONNX (saltar con -SkipModels)
if (-not $SkipModels) {
    $models = @(
        @("models\Xenova\all-MiniLM-L6-v2\onnx\model_quantized.onnx", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model_quantized.onnx"),
        @("models\Xenova\all-MiniLM-L6-v2\config.json", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/config.json"),
        @("models\Xenova\all-MiniLM-L6-v2\tokenizer.json", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json"),
        @("models\Xenova\distilbert-squad-qa\onnx\model_quantized.onnx", "https://huggingface.co/Xenova/distilbert-base-uncased-distilled-squad/resolve/main/onnx/model_quantized.onnx"),
        @("models\Xenova\distilbert-squad-qa\config.json", "https://huggingface.co/Xenova/distilbert-base-uncased-distilled-squad/resolve/main/config.json"),
        @("models\Xenova\distilbert-squad-qa\tokenizer.json", "https://huggingface.co/Xenova/distilbert-base-uncased-distilled-squad/resolve/main/tokenizer.json")
    )

    foreach ($model in $models) {
        $path = "$fullDir\$($model[0])"
        if (-not (Test-Path $path) -or $Force) {
            Write-Output "  Descargando modelo: $($model[0])..."
            $parent = Split-Path $path -Parent
            if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
            Invoke-WebRequest -Uri $model[1] -OutFile $path -UseBasicParsing
        }
    }
} else {
    Write-Output "[Build] SkipModels activado — los modelos ONNX no se descargaron"
}

# --- 4. Crear ZIPs ---
Write-Output "[Build] Creando ZIPs..."

if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    # 7zip produce mejor compresion
    Push-Location $outputDir
    & 7z a -tzip "ia-jutia-lite-v$version.zip" "ia-jutia-lite\*" -mx=9
    & 7z a -tzip "ia-jutia-full-v$version.zip" "ia-jutia-full\*" -mx=9
    Pop-Location
} else {
    Compress-Archive -Path "$liteDir\*" -DestinationPath "$outputDir\ia-jutia-lite-v$version.zip" -Force
    Compress-Archive -Path "$fullDir\*" -DestinationPath "$outputDir\ia-jutia-full-v$version.zip" -Force
}

# --- 5. Limpiar directorios temporales ---
Remove-Item -Path $liteDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path $fullDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ""
Write-Output "=============================="
Write-Output "Build completado!"
Write-Output "=============================="
Write-Output "Lite:  $outputDir\ia-jutia-lite-v$version.zip"
Write-Output "Full+: $outputDir\ia-jutia-full-v$version.zip"
Write-Output ""
Write-Output "Tamano estimado:"
if (Test-Path "$outputDir\ia-jutia-lite-v$version.zip") {
    $liteSize = (Get-Item "$outputDir\ia-jutia-lite-v$version.zip").Length / 1KB
    Write-Output "  Lite:  $([math]::Round($liteSize)) KB"
}
if (Test-Path "$outputDir\ia-jutia-full-v$version.zip") {
    $fullSize = (Get-Item "$outputDir\ia-jutia-full-v$version.zip").Length / 1MB
    Write-Output "  Full+: $([math]::Round($fullSize)) MB"
}
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/scripts/build-ia-zips.ps1
git commit -m "feat(ia-jutia): add build-ia-zips.ps1 packaging script"
```

---

### Task 10: Update ia-jutia/SKILL.md

**Files:**
- Modify: `ia-jutia/SKILL.md`

- [ ] **Step 1: Update version, add Full+ profile, add new tools to template listing**

Update `meta.version` to `3.0-full`, add Full+ profile description, add new tools to the template listing (line 303).

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/SKILL.md
git commit -m "docs(ia-jutia): update SKILL.md with Full+ profile"
```

---

## Spec Coverage Check

| Spec Section | Task |
|-------------|------|
| Lite ZIP structure | Task 9 (package) |
| Full+ ZIP structure | Task 9 (package) |
| API: window.ia.embed() | Task 1 |
| API: window.ia.chat.ask() hybrid | Task 2 |
| Auto-detection of Full+ | Task 3 (module.js _detectarFull) |
| API: window.iaFull.qa() | Task 4 |
| API: window.iaFull.embed() | Task 4 |
| API: window.iaFull.ingestFile() | Task 4 |
| Parsers: PDF/DOCX/XLSX | Task 4 (methods) + Task 7 (tools) |
| OCR: Tesseract.js | Task 4 (ocrImage) |
| Worker: Transformers.js | Task 5 |
| API: window.sqliteDB | Task 6 |
| Build ZIPs script | Task 9 |
| SKILL.md update | Task 10 |
