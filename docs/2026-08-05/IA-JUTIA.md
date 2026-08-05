# 🧠 IA Jutia — Mini IA Offline-First

> **Actualizado:** 2026-08-05 | **Version skill:** v2.1-plugin
> **Trigger:** "mini ia", "ia jutia", "busqueda inteligente", "analisis datos", "preguntar documento"
> **Output:** `modules/ia-jutia/` (plugin auto-contenido)

---

## 1. Que es

IA Jutia agrega **inteligencia artificial offline** a cualquier app del stack como **plugin de un solo script**. Cero modificaciones a `core/`, `db.js` o `index.html` (solo un `<script>`).

```
Unico cambio en index.html:
<script src="modules/ia-jutia/module.js"></script>
```

`module.js` carga todo lo demas dinamicamente: FlexSearch → ia-core → ia-chat → tools → init → DB tables → Alpine store → FAB+Drawer → evento `jutia:ready`.

---

## 2. Perfiles de IA

| Perfil | Peso | Que incluye | Descargas |
|--------|------|-------------|-----------|
| **Lite** | ~40KB | FlexSearch + chat + estadisticas + predicciones + herramientas | Sin descargas |
| **Full+** (DLC) | ~40MB | Lite + ingesta PDF/DOCX/XLSX/CSV/MD + embeddings ONNX + OCR 100% offline + SQLite FTS5 | Una vez, ruta compartida |

Los modelos Full se comparten entre apps del mismo equipo (una sola descarga, no N×40MB).

---

## 3. Arquitectura del Plugin

### Estructura (plugin unificado desde 2026-08-05)

```
modules/ia-jutia/
├── module.js          → Entry point: carga dinamica + store + FAB+Drawer
├── ia-core.js         → window.ia: FlexSearch + stats + predict
├── ia-chat.js         → window.ia.chat: chat NL + historial de hilos
├── ia-full.js         → window.iaFull: ingesta + embeddings + OCR + parsers (Full+)
├── ia-sqlite.js       → sql.js FTS5 wrapper (Full+, Professional/Business)
├── ia-worker.js       → Web Worker Transformers.js (implementacion futura, no se carga en runtime)
├── setup-ia.ps1       → Instalador: descarga assets + modelos, valida integridad
├── assets/            → flexsearch, transformers, pdf.js, mammoth, xlsx, tesseract (+wasm)
├── models/            → Xenova/all-MiniLM-L6-v2 (Full+, ruta compartida)
└── tools/
    ├── _registry.js       → window.IA_TOOLS: registro central de herramientas
    ├── extraer-factura.js → Extraccion multi-region Latam
    ├── extraer-pdf.js     → PDF.js UMD (workerSrc local)
    ├── extraer-docx.js    → Mammoth.js
    └── extraer-xlsx.js    → SheetJS
```

> **Historial:** los templates `archived/{lite,full}/` fueron **colapsados** en `templates/plugin/` (commit `611f27c`, -4370 lineas). Los ZIPs distribuibles se generan con `ia-jutia/scripts/build-ia-zips.ps1` → `dist/ia-jutia-lite/` y `dist/ia-jutia-full/`.

### DB Hibrida

| Tabla | DB | Proposito |
|-------|----|-----------|
| `_ia_chats` | `window.db` (AppDB) | Metadata de conversaciones (backup con la app) |
| `_ia_messages` | `window.db` (AppDB) | Mensajes del chat |
| `_ia_docs` | `window.iaDB` (AHA_Jutia) | Documentos subidos (Full) |
| `_ia_chunks` | `window.iaDB` (AHA_Jutia) | Chunks indexados (Full) |
| `_ia_index` | `window.iaDB` (AHA_Jutia) | Cache de consultas |
| `modelos_cache` | `window.iaDB` (AHA_Jutia) | Cache de modelos (Full) |
| `_ia_sqlite` | `window.iaDB` (AHA_Jutia) | Snapshot SQLite FTS5 (Full) |

### Comunicacion por Eventos

| Evento | Detalle | Dispara |
|--------|---------|---------|
| `jutia:ready` | `{ id: 'ia-jutia' }` | init completo |
| `jutia:trigger` | `{ modulo, query }` | Abre el Drawer desde cualquier modulo |

```javascript
window.dispatchEvent(new CustomEvent('jutia:trigger', { detail: { modulo: 'inventario', query: 'stock' } }));
```

---

## 4. API del Plugin

### `window.ia` (ia-core.js)

```javascript
window.ia = {
  init(),                       // FlexSearch Document + tablas default
  search(query, opts),          // Busqueda con Alpine store update
  registerTable(nombre),        // Indexa tabla Dexie en lotes de 200
  indexRecord(tabla, record),   // Indexacion incremental
  removeRecord(tabla, id),      // Eliminar del indice
  stats(tabla, campo),          // media, mediana, moda, min, max, stddev, count
  statsAll(),                   // Conteo de todas las tablas
  predict(tabla, campo, n),     // Regresion lineal
  forecast(valores, n),         // Proyeccion lineal
  movingAverage(valores, n),    // Media movil
  exportResumen(tabla)          // Resumen en texto plano
};
```

### `window.ia.chat` (ia-chat.js)

```javascript
window.ia.chat = {
  init(), create(titulo), list(), load(chatId), delete(chatId),
  addMessage(chatId, rol, contenido, fuente, score),
  ask(chatId, pregunta),        // Patrones DB + FlexSearch fallback
  searchHistory(query, limit),
  getRelevantHistory(query, n)
};
```

**Patrones NL soportados:** count, sum, rank, top, filter, date, date_range, list, avg. Si no hay patron → fallback FlexSearch.

### `window.IA_TOOLS` (tools/_registry.js)

```javascript
window.IA_TOOLS = {
  register(nombre, tool), get(nombre), list(),
  ejecutar(nombre, contexto), detectar(texto), limpiar()
};
```

### `Alpine.store('ia')` (module.js)

```javascript
Alpine.store('ia') = {
  chatOpen, drawerView, perfil, perfilReal, modeloListo, mensajes,
  documentos, threads, tools, inputText, isLoading, currentChatId, modeloPath,
  toggleChat(), cambiarVista(v), enviarMensaje(), refreshThreads(),
  crearThread(), cargarThread(id), eliminarThread(id), cargarFull()
};
```

Drawer con 3 tabs: **Chat / Hilos / Ajustes**.

---

## 5. Config en project.config.js

```javascript
APP_CONFIG: {
  iaJutia: {
    perfil: 'lite',       // 'lite' | 'full' | false
    modeloPath: ''        // Ruta personalizada de modelos (opcional)
  }
}
```

---

## 6. Decisiones de Producto (v2.1)

- **QA usa keyword retrieval** (sin modelo NLP distilbert, -43MB)
- **OCR 100% offline**: Tesseract.js `recognize(dataUrl, 'spa', { workerPath, corePath, langPath })` con assets locales + tessdata `spa.traineddata.gz` (best_int 2.1MB)
- **PDF.js v3.11.174** (UMD `window.pdfjsLib`; v4 es solo ESM y rompe el patron script)
- **sql.js@1.10** (range semver; la version exacta 1.10.0 no existe en jsDelivr)
- **onnxruntime-web 1.20** solo distribuye `ort-wasm-simd-threaded.wasm`
- **Transformers.js**: `pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')` en main thread, pipeline cacheado (lazy init). El worker NO se usa en runtime para no bloquear UI
- **Ruta compartida de modelos**: Windows `C:\ProgramData\IA-Jutia\models\`, Linux `~/.local/share/ia-jutia/models/`, macOS `~/Library/Application Support/IA-Jutia/models/`
- **Los assets JS se cargan bajo demanda** en `initFull()` (offline-first, no bloquean DOMContentLoaded)
- **Integridad**: setup/build verifican tamano minimo y detectan respuestas HTML 404

---

## 7. Integracion con el Stack

| Skill | Relacion |
|-------|----------|
| `setup-init` | Copia `ia-jutia/templates/plugin/` a `modules/ia-jutia/` + descarga FlexSearch |
| `code-generator` | Agrega el `<script>` en index.html. NO modifica db.js |
| `stack-compliance-guard` | Verifica que el plugin no toque core/ ni tenga imports/ES6 |
| `pipeline-engine` | Fase Build: genera plugin segun perfil Lite/Full |

---

## 8. Comando `/ia`

```
/ia → ¿Que perfil de IA deseas?
  [1] Lite (FlexSearch + chat + estadisticas + predicciones) — 40KB
  [2] Full+ (Lite + ingesta documentos + embeddings + OCR + FTS5) — +40MB DLC
  [3] No incluir IA
```

Si perfil=Full, advierte del DLC ~40MB y confirma la descarga unica.

---

## 9. Notas Importantes para el Desarrollo

- **Plugin auto-contenido**: no modificar `core/`, `db.js`, ni `index.html` mas alla del unico script tag
- **DB Hibrida**: `window.db` para chats (backup compatible), `window.iaDB = new Dexie('AHA_Jutia')` para datos de IA
- **Todo ES5**: IIFE + `var`, sin `import`/`export` (restriccion file://)
- **Eventos**: `jutia:ready` al completar init; `jutia:trigger` para abrir drawer desde cualquier modulo
- **Lotes de 200**: `registerTable()` pagina en lotes de 200; `statsAll()` usa `count()`
- **Idioma**: todo en espanol (labels, mensajes, tooltips)
- **Si el perfil no esta definido**: preguntar, no asumir default
