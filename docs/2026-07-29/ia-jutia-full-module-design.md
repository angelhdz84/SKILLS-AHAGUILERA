# IA Jutia Full — Diseno del Modulo Portable

> **Fecha:** 29 de julio de 2026
> **Diseno aprobado por:** Usuario (Full+ con OCR, ~33MB)
> **Estado:** Pendiente de implementacion

---

## 1. Concepto

Dos ZIPs independientes que se extraen en `modules/ia-jutia/`. Lite funciona sin Full, Full funciona sin Lite (Full contiene TODO, reemplaza a Lite al sobrescribir la carpeta).

El modulo se activa con una unica linea en `index.html`:

```html
<script src="modules/ia-jutia/module.js"></script>
```

Sin import/export, sin ES6 modules, 100% offline, compatible con Neutralino (.exe) y Capacitor (.apk).

---

## 2. Estructura de Archivos

### Lite ZIP (~40KB)

```
modules/ia-jutia/
├── module.js              → Entry point (carga todo, registra store Alpine, inyecta FAB+Drawer)
├── ia-core.js             → window.ia: FlexSearch + stats + predict
├── ia-chat.js             → window.ia.chat: conversacional + patrones NL
├── setup-ia.ps1           → Descarga FlexSearch a assets/
└── tools/
    ├── _registry.js       → window.IA_TOOLS
    └── extraer-factura.js → Extraccion multi-region Latam
```

### Full ZIP (~50MB comprimido)

```
modules/ia-jutia/
├── module.js              → Entry point (incluye deteccion de perfil Full)
├── ia-core.js             → FlexSearch + stats + predict
├── ia-chat.js             → Chat + patrones NL
├── ia-full.js             → window.iaFull: QA + ingesta + embeddings + OCR
├── ia-worker.js           → Web Worker para Transformers.js (no bloquea UI)
├── ia-sqlite.js           → window.sqliteDB: SQLite FTS5 (sql.js)
├── setup-ia.ps1           → Setup
├── tools/
│   ├── _registry.js
│   ├── extraer-factura.js
│   ├── extraer-pdf.js     → PDF.js wrapper
│   ├── extraer-docx.js    → Mammoth.js wrapper
│   └── extraer-xlsx.js    → SheetJS wrapper
├── assets/
│   ├── flexsearch.min.js              → FlexSearch v0.8 (~50KB)
│   ├── transformers.min.js            → Transformers.js UMD v4.x (~530KB)
│   ├── wasm/                          → ONNX Runtime Web
│   │   ├── ort-wasm-simd-threaded.wasm
│   │   └── ort-wasm-simd.wasm
│   ├── pdf.min.js                     → PDF.js UMD (~500KB)
│   ├── mammoth.min.js                 → Mammoth.js UMD (~200KB)
│   └── tesseract.min.js               → Tesseract.js UMD (~8MB)
└── models/
    └── Xenova/
        ├── all-MiniLM-L6-v2/          → Embeddings (~23.7MB)
        │   └── onnx/
        │       ├── model_quantized.onnx
        │       ├── config.json
        │       └── tokenizer.json
        └── distilbert-squad-qa/       → QA (~43MB)
            └── onnx/
                ├── model_quantized.onnx
                ├── config.json
                └── tokenizer.json
```

---

## 3. Perfiles Finales

| Perfil | Peso | Contenido | Compatible File:// |
|--------|:----:|-----------|:-----------------:|
| **Lite** | ~40KB | FlexSearch + stats + predict + chat + tools | SI |
| **Full+** | ~33MB | Lite + Transformers.js + all-MiniLM-L6-v2 + WASM + parsers PDF/DOCX/XLSX + Tesseract OCR | NO (requiere localhost: Neutralino/Capacitor) |

---

## 4. API del Plugin

### window.ia (ia-core.js) — Siempre disponible

```javascript
window.ia = {
  init(),                       // Crea FlexSearch Document + registra tablas
  search(query, opts),          // FlexSearch con Alpine store update
  registerTable(nombre),        // Indexa tabla Dexie en lotes de 200
  indexRecord(tabla, record),   // Indexacion incremental
  removeRecord(tabla, id),      // Eliminar del indice
  stats(tabla, campo),          // media, mediana, moda, min, max, stddev, count
  statsAll(),                   // Conteo de todas las tablas
  predict(tabla, campo, n),     // Regresion lineal
  forecast(valores, n),         // Proyeccion lineal
  movingAverage(valores, n),    // Media movil
  embed(texto),                 // Vector embedding (Full) o fallback TF-IDF
};
```

### window.ia.chat (ia-chat.js) — Siempre disponible

```javascript
window.ia.chat = {
  init(),
  create(titulo),               // Nuevo thread
  list(),                       // Listar threads
  load(chatId),                 // Cargar thread + mensajes
  delete(chatId),               // Eliminar thread
  addMessage(chatId, rol, contenido, fuente, score),
  ask(chatId, pregunta),        // Patrones DB + FlexSearch + (Full) QA semantico
  searchHistory(query, limit),
  getRelevantHistory(query, n)
};
```

### window.iaFull (ia-full.js) — Solo Full

```javascript
window.iaFull = {
  initFull(),                   // Carga modelos, configura env, inicializa iaDB
  qa(pregunta, opts),           // QA sobre documentos (embeddings + FTS5)
  ingestFile(blob, nombre),     // Ingesta PDF/DOCX/XLSX/TXT
  searchHybrid(query, opts),    // Embeddings + FlexSearch
  getDocumentos(),
  deleteDocumento(docId),
  embed(texto),                 // Embedding vector via Transformers
  ocr(imagenBlob),              // OCR via Tesseract.js
  cosineSimilarity(a, b),
  _chunkText(texto, size, overlap),
};
```

### window.sqliteDB (ia-sqlite.js) — Solo Full

```javascript
window.sqliteDB = {
  init(),                       // Inicializa sql.js + FTS5
  addChunks(docId, chunks),     // Indexa chunks en FTS5
  removeChunks(docId),          // Elimina chunks
  searchChunks(query),          // FTS5 search
  count(),
};
```

### Alpine.store('ia') (module.js)

Propiedades y metodos expuestos en Alpine:

```javascript
Alpine.store('ia') = {
  chatOpen, drawerView, perfil, perfilReal,
  modeloListo, progresoModelo,
  mensajes, documentos, threads, tools,
  inputText, isLoading, currentChatId,
  toggleChat(), cambiarVista(), enviarMensaje(),
  refreshThreads(), crearThread(), cargarThread(), eliminarThread(),
  uploadDocumento(), cargarFull(),
};
```

---

## 5. Deteccion de Perfil

```javascript
// module.js init:
try {
  await loadFlexSearch();  // Carga window.FlexSearch
  await loadScript('modules/ia-jutia/ia-core.js');
  await loadScript('modules/ia-jutia/ia-chat.js');
  window.ia.init();

  // Detectar perfil Full por presencia de transformes.min.js en assets/
  var fs = document.createElement('script');
  fs.src = 'modules/ia-jutia/assets/transformers.min.js';
  fs.onload = function() {
    // Transformers.js cargado, inicializar Full
    loadScript('modules/ia-jutia/ia-full.js').then(function() {
      loadScript('modules/ia-jutia/ia-worker.js').then(function() {
        loadScript('modules/ia-jutia/ia-sqlite.js').then(function() {
          window.iaFull.initFull();
        });
      });
    });
  };
  fs.onerror = function() { /* modo Lite normal */ };
  document.head.appendChild(fs);
} catch(e) {
  console.warn('[ia-jutia] Error en init:', e.message);
}
```

El modulo Full se auto-detecta por la presencia de `assets/transformers.min.js`. Si existe, carga modelos y activa QA. Si no, corre solo Lite.

---

## 6. Integracion con Apps

**Unica linea en index.html:**

```html
<script src="modules/ia-jutia/module.js"></script>
```

**Evento para abrir chat desde cualquier modulo:**

```javascript
window.dispatchEvent(new CustomEvent('jutia:trigger', {
  detail: { modulo: 'inventario', query: 'stock bajo' }
}));
```

**Evento de ready:**

```javascript
window.addEventListener('jutia:ready', function() {
  console.log('IA Jutia lista, perfil:', Alpine.store('ia').perfilReal);
});
```

---

## 7. Manejo de Modelos ONNX

Transformers.js UMD se carga via `<script>` clasico en module.js. Expone `self.Transformers`. Config:

```javascript
// Configurar antes de pipeline()
self.Transformers.env.localModelPath = 'modules/ia-jutia/models/';
self.Transformers.env.allowRemoteModels = false;
```

Esto hace que `Transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')` busque los archivos en `modules/ia-jutia/models/Xenova/all-MiniLM-L6-v2/onnx/model_quantized.onnx`.

Para el Worker, se usa `new Worker('modules/ia-jutia/ia-worker.js')`. Dentro del worker se carga Transformers.js via `importScripts('../../assets/transformers.min.js')` (bundle UMD = IIFE, compatible con `importScripts`). Config via `self.Transformers.env`.

---

## 8. DB Hibrida

| Tabla | DB | Proposito |
|-------|----|-----------|
| `_ia_chats` | `window.db` (AppDB) | Metadatos de chats |
| `_ia_messages` | `window.db` (AppDB) | Mensajes del chat |
| `_ia_docs` | `window.iaDB` (AHA_Jutia) | Documentos subidos |
| `_ia_chunks` | `window.iaDB` (AHA_Jutia) | Chunks indexados |
| `_ia_index` | `window.iaDB` (AHA_Jutia) | Cache de consultas |
| `modelos_cache` | `window.iaDB` (AHA_Jutia) | Estado de modelos |
| `_ia_sqlite` | `window.iaDB` (AHA_Jutia) | Snapshot SQLite FTS5 (Full) |

---

## 9. Tamanos Estimados

| Componente | Lite | Full |
|------------|:----:|:----:|
| Codigo JS (modulos) | ~30KB | ~80KB |
| FlexSearch | — | ~50KB |
| Transformers.js UMD | — | ~530KB |
| ONNX WASM runtime | — | ~6MB |
| Modelo embeddings (q8) | — | ~23.7MB |
| Modelo QA (q8) | — | ~43MB |
| Parsers (PDF+DOCX+XLSX) | — | ~1.2MB |
| Tesseract.js + WASM | — | ~8MB |
| **Total ZIP estimado** | **~40KB** | **~33MB** |

---

## 10. Auto-validacion

- [ ] ¿Un solo `<script>` en index.html?
- [ ] ¿Sin import/export/type=module?
- [ ] ¿FAB+Drawer se inyectan sin duplicados?
- [ ] ¿Lite funciona sin carpeta full?
- [ ] ¿Full detecta modelos y activa QA automaticamente?
- [ ] ¿DB hibrida: chats en window.db, docs en AHA_Jutia?
- [ ] ¿Eventos jutia:ready y jutia:trigger?
- [ ] ¿Tools auto-registradas en window.IA_TOOLS?
- [ ] ¿OCR solo disponible en Full?
- [ ] ¿Modelos ONNX cargados desde ruta local, no CDN?
- [ ] ¿Compatible Neutralino (localhost)?
- [ ] ¿Compatible Capacitor (localhost)?
