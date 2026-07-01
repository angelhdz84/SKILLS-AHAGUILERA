---
name: ia-jutia
description: Mini IA offline-first con dos perfiles. Lite: FlexSearch + estadisticas + predicciones + chat conversacional sobre datos. Full: +ingesta PDF/DOCX/XLSX/CSV/MD + Transformers.js QA extractivo + chat combinado BD/documentos. Acceso por modulo + atajo global Cmd+K.
license: MIT
compatibility: Requiere @AGENTS.md y espec validada. Perfil Lite requiere solo FlexSearch (~7KB). Perfil Full requiere pdf.js + mammoth.js + marked.js + Transformers.js (~233MB descarga unica).
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.2"
  generatedBy: "ia-jutia skill"
  triggers: ["mini ia", "ia jutia", "busqueda inteligente", "analisis datos", "subir documento", "preguntar documento", "predicciones", "estadisticas", "chat datos", "preguntar datos", "conversacion datos"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  perfiles: [lite, full]
  language: es
  outputPath: "modules/ia-jutia/"
  autoSave: true
---

# 🧠 SKILL: ia-jutia (Mini IA Offline-First)

> **Proposito**: Agregar inteligencia artificial offline a apps del stack. Dos perfiles: **Lite** (FlexSearch + estadisticas + predicciones, ~7KB) y **Full** (+ingesta documentos + QA extractivo con Transformers.js, ~233MB).
> **Modo**: Generacion de modulo por perfil | **Idioma**: ES | **Contexto**: Requiere spec validada + @AGENTS.md
> **Output**: `modules/ia-jutia/module.js` + `modules/ia-jutia/module.html` + `core/ia.js` + `core/ia-chat.js` (+ `core/ia-ingest.js` en Full)

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Deteccion de Perfil

1. Revisa `project.config.js` o pregunta al usuario:

```
📋 ¿Que perfil de IA deseas?

[1] Lite (FlexSearch + estadisticas + predicciones) — 7KB, sin descargas extra
    Busqueda full-text sobre datos de la app, estadisticas descriptivas,
    proyeccion de tendencias (regresion lineal, media movil).
    NO requiere descargas adicionales.

[2] Full (Lite + ingesta documentos + QA) — +233MB descarga unica
    Todo lo de Lite + subir PDF/DOCX/XLSX/CSV/MD para consultar.
    Chat Q&A con respuestas citando fuentes.
    Requiere descargar modelos Transformers.js (~230MB).
  # Adicional OCR (Tesseract.js):
  #   - Deteccion automatica PDF escaneado vs digital
  #   - Usa Tesseract.js v5 con modelo spa (espanol)
  #   - Se carga desde assets/js/libs/tesseract.min.js
  #   - WASM: assets/wasm/tesseract-core-simd.wasm
  #   - Modelo: assets/tessdata/spa.traineddata

[3] No incluir IA
    Saltar generacion del modulo.
```

2. Si perfil=Full, advierte sobre el tamaño:

```
⚠️ PERFIL FULL: Se descargaran ~233MB adicionales
  - pdf.js + mammoth.js + marked.js: ~2.1MB
  - Transformers.js (runtime): ~1MB
  - Modelo MiniLM (embeddings): ~80MB
  - Modelo BERT multilingual (QA): ~150MB

  La descarga ocurre UNA VEZ durante el setup.
  Luego todo funciona 100% offline.

  ¿Continuar con perfil Full?
  [1] Si, descargar todo
  [2] No, usar Lite
```

### 🟡 FASE 2: Generacion de Codigo

Segun perfil detectado, genera los archivos correspondientes:

**Perfil Lite:**
```
📁 CORE COMPARTIDO
### `core/ia.js`
[FlexSearch init + busqueda full-text sobre Dexie + estadisticas + predicciones]

### `core/ia-chat.js`
[Motor de chat conversacional: patrones DB query + FlexSearch fallback + persistencia Dexie + busqueda en historial FlexSearch]

📁 MODULO IA-JUTIA
### `modules/ia-jutia/module.js`
[Registro en window.MODULES, init de FlexSearch, metodos publicos + chat Alpine data]

### `modules/ia-jutia/module.html`
[UI con tabs: Buscar/Chat/Stats/Pred. Chat con sidebar de hilos + busqueda en historial]

📁 REGISTRO EN INDEX.HTML
[Añadir <script src="core/ia.js"> entre core/ui.js y core/app.js]
[Añadir <script src="core/ia-chat.js"> DESPUES de core/ia.js y ANTES de los scripts de modulo]
[Añadir <script src="assets/js/libs/flexsearch.min.js"> entre libs base y adicionales]
```

**Perfil Full:**
```
📁 CORE COMPARTIDO
### `core/ia.js`
[FlexSearch + estadisticas + predicciones (identico a Lite)
 + metodos de orquestacion: ingest(), qa(), getDocumentos()
 + indexRecord(), removeRecord() para indexacion incremental]

### `core/ia-chat.js`
[Extension de Lite: askFull() combina consultas BD + documentos QA.
 Devuelve fuentes separadas {tipo: 'bd'|'doc', texto: string}.
 Fuentes renderizadas con badges diferenciados BD (primary) / Docs (accent)]

### `core/ia-ingest.js`
[Parsers: pdf(), docx(), xlsx(), csv(), md(), txt()
 + chunking con overlap
 + Transformers.js pipeline init (MiniLM + BERT)
 + QA extractivo con muestreo paginado de chunks
 + soporte Web Worker para evitar bloqueo de UI]

### `core/ia-worker.js`
[Web Worker con Transformers.js + q4 quantization
 + QA y embeddings en segundo plano (sin congelar UI)
 + dtype: 'q4' reduce modelos 4x (230MB → 58MB)]

### `core/ia-sqlite.js`
[sql.js wrapper con FTS5 para chunks de IA Jutia
 + persistencia cíclica (export → IndexedDB, restore en init)
 + CREATE VIRTUAL TABLE chunks_fts USING fts5(texto, docId)
 + SELECT MATCH para QA ~50-150ms vs 2-3s con Dexite
 + Fallback automatico a Dexie si sql.js no disponible]

📁 MODULO IA-JUTIA
### `modules/ia-jutia/module.js`
[Registro + init de modelos + background ingest]

### `modules/ia-jutia/module.html`
[Upload zone drag & drop, lista documentos, chat Q&A, buscador, stats]

📁 REGISTRO EN INDEX.HTML
[Añadir <script src="core/ia.js"> entre core/ui.js y core/app.js]
[Añadir <script src="core/ia-chat.js"> despues de core/ia.js]
[Añadir <script src="core/ia-ingest.js"> despues de core/ia-chat.js]
[Añadir scripts de librerias adicionales entre libs base y core]
```

**Siempre genera bloque de comando Cmd+K:**
En `index.html`, registrar atajos globales:
```html
<div x-data x-init="
  $watch('$store.iaQuery', q => { if(q) window.ia.search(q); });
" @keydown.window.cmd.k.prevent="
  $store.iaPaletteOpen = !$store.iaPaletteOpen;
" @keydown.window.ctrl.k.prevent="
  $store.iaPaletteOpen = !$store.iaPaletteOpen;
"></div>
```

### 🔵 FASE 3: Integracion en Spec y Config

1. Añadir a `project.config.js`:
```javascript
APP_CONFIG: {
  // ...existing config...
  iaJutia: {
    perfil: 'lite',       // 'lite' | 'full' | false
    flexSearch: {
      doc: {
        id: 'id',
        index: ['nombre', 'descripcion', 'notas'],
        store: ['nombre', 'tipo']
      }
    }
  }
}
```

2. Si perfil=Full, añadir a `project.config.js`:
```javascript
    modelos: {
      embeddings: 'Xenova/all-MiniLM-L6-v2',
      qa: 'Xenova/bert-base-multilingual-uncased-squad',
      ruta: 'assets/models/'
    }
```

3. Añadir tablas a Dexie schema en `core/db.js`:
```javascript
const db = new Dexie('AppDB');
db.version(1).stores({
  // ...tablas existentes...
  _ia_docs: 'id, nombre, tipo, *createdBy, createdAt, updatedAt',
  _ia_chunks: 'id, docId, *texto, createdAt',
  _ia_chats: 'id, titulo, createdAt, updatedAt, messageCount',
  _ia_messages: 'id, chatId, rol, contenido, fuente, score, createdAt',
  _ia_index: '&consulta',
  modelos_cache: '&ruta',
});
// La tabla _ia_sqlite se añade en version 2 si hay sql.js:
db.version(2).stores({
  _ia_sqlite: 'id'  // snapshot: { id: 'snapshot', data: Array, updatedAt: string }
});
```

### 🟣 FASE 4: Handoff

```
✅ IA-JUTIA GENERADO

📋 Resumen:
  Perfil: [lite|full]
  Archivos generados: [N]
  Librerias adicionales: [lista]
  Modelos descargados: [solo full]

📌 Para activar, verifica que en index.html:
   - FlexSearch se carga ANTES de core/ia.js
   - core/ia.js se carga DESPUES de core/ui.js
   - (Full) core/ia-ingest.js despues de core/ia.js
   - (Full) core/ia-sqlite.js despues de core/ia.js y antes de ia-ingest.js (si sql.js activo)
   - (Full) sql.js WASM en assets/wasm/sql-wasm.wasm
   - (Full) Los modelos estan en assets/models/

🚀 Siguiente paso: continuar con generacion de modulos o validar app
```

---

## 🛡️ AUTO-VALIDACION CONTRA @AGENTS.md (EJECUTAR SIEMPRE)

- [ ] ¿FlexSearch cargado desde `assets/js/libs/flexsearch.min.js` (Lite) o `bun add flexsearch` (Full)? → RUTA LOCAL siempre
- [ ] ¿Transformers.js (Full) carga modelos desde `assets/models/` con opcion `{local: true}`? → NO CDN en runtime
- [ ] ¿Transformers.js (Full) usa `dtype: 'q4'` en pipeline? → Reduce modelos 230MB → 58MB
- [ ] ¿Los chunks de documentos se guardan en `_ia_chunks` (IndexedDB)? → ✅
- [ ] ¿El chat Q&A (Full) cita la fuente de cada respuesta? → ✅
- [ ] ¿QA usa muestreo paginado (`offset().limit(BATCH)`) en vez de `toArray()` completo? → ✅
- [ ] ¿`statsAll()` y `exportResumen()` usan `count()` en vez de `toArray()`? → ✅
- [ ] ¿`registerTable()` pagina en lotes de 200 en vez de `toArray()` completo? → ✅
- [ ] ¿Se carga `transformers.min.js` antes de crear el Worker? → `importScripts` dentro del Worker
- [ ] ¿sql.js activo y `assets/wasm/sql-wasm.wasm` existe? → `locateFile` apunta a `assets/wasm/`
- [ ] ¿Dexie tabla `_ia_sqlite`? → `db.version(2).stores({ _ia_sqlite: 'id' })` en core/db.js
- [ ] ¿FTS5 disponible? → `CREATE VIRTUAL TABLE chunks_fts USING fts5(texto, docId)` en init
- [ ] ¿Persistencia cíclica? → `db.export()` → `_ia_sqlite.put()` cada 2s tras cambios
- [ ] ¿Cmd+K no interfiere con inputs nativos? → Usar `@keydown.window` no dentro de inputs
- [ ] ¿Perfil Lite pero usa `Transformers`? → ❌ RECHAZAR
- [ ] ¿Perfil Full pero no carga `ia-ingest.js`? → ❌ RECHAZAR
- [ ] ¿Tesseract.js carga desde `assets/js/libs/tesseract.min.js`? → RUTA LOCAL siempre
- [ ] ¿Chat historial persiste en `_ia_chats` y `_ia_messages`? → Dexie put/get
- [ ] ¿Busqueda hibrida combina FlexSearch + embeddings? → weight 0.6 flex + 0.4 semantic
- [ ] ¿OCR se activa solo si pdf.js extrae <50 chars? → umbral configurable
- [ ] ¿Lite Worker no interfiere con Full Worker? → archivos separados
- [ ] v0.3 Chat: ¿core/ia-chat.js se carga DESPUES de core/ia.js y ANTES de module.js?
- [ ] v0.3 Chat: ¿Lite tiene tablas _ia_chats + _ia_messages en db.js? → schema Dexie
- [ ] v0.3 Chat: ¿Patrones DB cubren conteo, suma, ranking, filtro, fecha, lista?
- [ ] v0.3 Chat: ¿FlexSearch fallback activo cuando no hay patrón?
- [ ] v0.3 Chat: ¿Respuestas incluyen fuentes (tabla|flexsearch)?
- [ ] v0.3 Chat: ¿Sidebar de hilos con create/delete/select?
- [ ] v0.3 Chat: ¿Busqueda en historial (Nivel 2) via FlexSearch sobre _ia_messages?
- [ ] v0.3 Chat: ¿Full separa fuentes BD (badge primary) y Docs (badge accent)?

---

## 📋 API DEL MODULO (`window.ia`)

### Ambos perfiles:
```javascript
window.ia = {
  // Busqueda full-text
  search(query, opts),              // FlexSearch sobre tablas registradas
  registerTable(nombre, campos),    // Registrar tabla Dexie para indexado (pagina en lotes de 200)

  // Indexacion incremental
  indexRecord(tabla, record),       // Anadir 1 registro a FlexSearch sin recargar toda la tabla
  removeRecord(tabla, id),          // Eliminar 1 registro de FlexSearch

  // Estadisticas
  stats(tabla, campo),              // media, mediana, moda, min, max, stddev, count
  statsAll(),                       // estadisticas de todas las tablas (usa count() no toArray())

  // Predicciones
  predict(tabla, campo, periodos),  // regresion lineal sobre datos historicos
  forecast(valores, n),             // proyeccion de array numerico
  movingAverage(valores, ventana),  // media movil para smooth

  // Export
  exportResumen(tabla),             // texto plano con hallazgos (usa count() no toArray())

  // UI state
  paletteOpen: false,               // control de command palette

  // Init
  initLite()                        // inicializar FlexSearch + registrar tablas
};
```

### Solo Full:
```javascript
window.iaIngest = {
  file(blob),                       // detecta tipo, parsea, chunk, indexa
  parse: {
    pdf(blob),                      // pdf.js → text
    docx(blob),                     // mammoth.js → text
    xlsx(blob),                     // SheetJS → text
    csv(blob),                      // nativo → text
    md(blob),                       // nativo/marked → text
    txt(blob)                       // nativo → text
  },
  chunk(texto, tamano, overlap),    // divide en chunks
  indexDocument(id, chunks),        // guarda en Dexie + FlexSearch
  generateEmbeddings(chunks),       // MiniLM → vectors
  qa(pregunta),                     // BERT multilingual → {respuesta, fuente, score}
                                    // usa muestreo paginado + Web Worker (si disponible)
  getDocumentos(),                  // lista docs indexados
  deleteDocumento(id),              // eliminar doc + chunks + indices
  _getWorker(),                     // Inicializa Web Worker para Transformers.js
  _qaWithWorker(),                  // QA via Worker (no bloquea UI)
  _qaMainThread(),                  // QA via hilo principal (fallback)
  _muestrearChunks()                // Paginacion inteligente de chunks (max 150)
};

window.ia.initFull = function() {   // init lite + ingest + modelos
  this.initLite();
  // Cargar Transformers pipeline async
};

  // v0.2 — IA Jutia mejorada
  searchHybrid(query),             // FlexSearch + embeddings combinado
  exportPDF(),                     // Exportar estadisticas a PDF

  // Chat historial
  chat: {
    create(titulo),                // v0.3: Crear nuevo chat thread
    list(),                        // Listar conversaciones guardadas
    load(chatId),                  // Cargar mensajes de una conversacion
    delete(chatId),                // Eliminar conversacion
    addMessage(chatId, rol, contenido, fuente, score), // Guardar mensaje
    ask(chatId, pregunta),         // v0.3: Responder con patrones DB + FlexSearch fallback
    searchHistory(query),          // v0.3: Buscar en historial de conversaciones (Nivel 2)
    askFull(chatId, pregunta),     // v0.3 Full: BD + documentos combinado (devuelve fuentes[])
  },
```

---

## 📄 TEMPLATES

Los templates de codigo estan en:
- `templates/lite/core/ia.js` — FlexSearch + stats + predicciones
- `templates/lite/modules/ia-jutia/module.js` — Registro Lite
- `templates/lite/modules/ia-jutia/module.html` — UI Lite
- `templates/full/core/ia.js` — Full (hereda Lite + ingest orchestration)
- `templates/full/core/ia-ingest.js` — Parsers + Transformers + QA
- `templates/lite/core/ia-worker.js` — FlexSearch en Web Worker
- `templates/full/modules/ia-jutia/module.js` — Registro Full
- `templates/full/modules/ia-jutia/module.html` — UI Full (chat + upload)

---

## 🔗 INTEGRACION CON OTRAS SKILLs

| SKILL | Relacion |
|-------|----------|
| `setup-init` | Descarga FlexSearch (Lite) + pdf.js/mammoth.js/Transformers/models (Full) a assets/ |
| `code-generator` | Consume templates/lite/ o templates/full/ segun perfil |
| `spec-creator` | Nueva seccion opcional "Mini IA" en la spec |
| `stack-compliance-guard` | Verifica que modelos y libs se carguen localmente |
| `prompt-inicial` | Checkbox "Incluir IA? (Lite/Full/No)" en config rapida |

---

## 📝 NOTAS PARA LA IA

- **FlexSearch**: Usar `new FlexSearch.Document()` con opciones `{doc: {id: 'id', index: [...], store: [...]}}`. Indexar en `initLite()`.
- **Indexacion incremental**: Usar `indexRecord(tabla, record)` para añadir 1 registro a FlexSearch sin recargar toda la tabla. Usar `removeRecord(tabla, id)` al eliminar.
- **Paginar consultas Dexie**: `registerTable()` pagina en lotes de 200. `statsAll()` usa `count()` indexado. `exportResumen()` usa `count() + limit(1)`. QA usa `offset().limit(BATCH)` paginado.
- **Predicciones**: Regresion lineal `y = mx + b`. Calcular m y b con minimos cuadrados. mediaMovil con ventana configurable (default 3).
- **Transformers.js (Full)**: Usar `pipeline('feature-extraction', model, {local: true, dtype: 'q4', device})` para embeddings. Usar `pipeline('question-answering', model, {local: true, dtype: 'q4', device})` para QA. `dtype: 'q4'` reduce modelos 4x (230MB → 58MB). `device` se detecta automaticamente: `'webgpu'` si `navigator.gpu` existe (WebView2 Edge 113+), `'wasm'` si no. WebGPU acelera QA de 200-500ms a 50-100ms.
- **Web Worker (Full)**: `ia-worker.js` se carga con `new Worker('core/ia-worker.js')`. El Worker hace `importScripts('../assets/js/libs/transformers.min.js')` para cargar Transformers.js. QA via Worker no congela la UI. `ia-ingest.js` detecta si Worker esta disponible; si no, usa hilo principal como fallback.
- **sql.js (Full .exe)**: Descargar a `assets/wasm/sql-wasm.wasm` + `sql-wasm.js` desde CDN. `ia-sqlite.js` inicializa con `initSqlJs({locateFile: f => 'assets/wasm/'+f})`. Crea tabla virtual FTS5 para chunks. Persistencia cíclica: export cíclico a `_ia_sqlite` en IndexedDB cada 2s tras cambios. En `initFull()` se restaura desde IndexedDB. Fallback automático a Dexie si sql.js no disponible.
- **Chunking (Full)**: 512 tokens por chunk, overlap de 64 tokens. Almacenar en `_ia_chunks` (Dexie) + `chunks_fts` (SQLite FTS5 si disponible).
- **QA (Full)**: Si sql.js con FTS5 disponible: `SELECT texto, docId FROM chunks_fts WHERE texto MATCH ? ORDER BY rank LIMIT 5` → ~50-150ms. Si no: muestreo inteligente paginado (Dexie, lotes de 50, max 150 chunks) + similitud coseno si hay embeddings. Pasar top-5 a BERT QA.
- **Cmd+K**: El atajo global abre una command palette tipo "Pregunta a la IA". No interferir con inputs de formularios.
- **Persistencia**: Los documentos subidos (Full) persisten en IndexedDB (`_ia_docs`, `_ia_chunks`). Al recargar, se cargan los ultimos 100 documentos (`reverse().limit(100)`).
- **Idioma**: Todo en español. Labels, mensajes, respuestas del QA, tooltips.
- **Si el perfil no esta definido**: Preguntar. No asumir default.

- **v0.2 Mejoras**: Highlight + resultados agrupados, autocompletar en busqueda, export PDF stats, OCR para PDFs escaneados (Tesseract.js spa), chat con historial/threads en Dexie, busqueda hibrida FlexSearch + embeddings.

- **v0.3 Chat Conversacional**: Nuevo `core/ia-chat.js` con DB Query Engine basado en 9 patrones (count, sum, rank, top, filter, date, list, avg, compare) + fallback a FlexSearch. Busqueda en historial (Nivel 2) indizando mensajes IA con FlexSearch. Full: `askFull()` combina BD + documentos con fuentes separadas visualmente (badges primary/accent). Lite: UI reorganizada con tabs (Buscar/Chat/Stats/Pred). Compatible con perfil Lite y Full.
- **Tesseract.js (Full OCR)**: Cargar con `importScripts('assets/js/libs/tesseract.min.js')` en Worker. Usar `Tesseract.recognize(imageData, 'spa')` con `{ logger: m => onProgress(m) }`. Convertir pagina PDF a canvas con pdf.js, exportar como ImageData, pasar a Tesseract. Deteccion automatica: si pdf.js extrae <50 caracteres, activar OCR.
- **Chat historial (Full)**: Usar `_ia_chats` para metadatos de conversacion y `_ia_messages` para cada mensaje. Ordenar por `createdAt` ascendente.
- **Busqueda hibrida (Full)**: En search(), si hay modelos cargados, calcular embedding de la query, comparar con embeddings de chunks via similitud coseno, combinar scores: 0.6 * flexScore + 0.4 * semanticScore.

✨ **SKILL ready. Trigger: `mini ia` para iniciar.**
