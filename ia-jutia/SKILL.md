---
name: ia-jutia
description: Mini IA offline-first como plugin auto-contenido. Lite: FlexSearch + chat conversacional + estadisticas + predicciones + herramientas extensibles. Full (DLC): +ingesta PDF/DOCX/XLSX/CSV/MD + Transformers.js embeddings + OCR 100% offline + SQLite FTS5. Plugin de un solo script, sin modificar core/ ni index.html.
license: MIT
compatibility: Requiere @AGENTS.md y spec validada. Perfil Lite requiere solo FlexSearch (~40KB). Perfil Full requiere Transformers.js + modelos (~40MB descarga unica).
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.1-plugin"
  generatedBy: "ia-jutia skill"
  triggers: ["mini ia", "ia jutia", "busqueda inteligente", "analisis datos", "subir documento", "preguntar documento", "predicciones", "estadisticas", "chat datos", "preguntar datos", "conversacion datos"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  perfiles: [lite, full]
  language: es
  outputPath: "modules/ia-jutia/"
  autoSave: true
---

# 🧠 SKILL: ia-jutia v2.0 (Plugin Auto-Contenido)

> **Proposito**: Agregar inteligencia artificial offline a apps del stack como plugin auto-contenido. Un solo `<script>` en index.html, cero modificaciones a core/ ni db.js.
> **Modo**: Plugin de un script | **Idioma**: ES | **Contexto**: Requiere spec validada + @AGENTS.md
> **Output**: `modules/ia-jutia/module.js` (entry point, carga todo lo demas dinamicamente)

---

## 🔄 ARQUITECTURA DEL PLUGIN

### Carga (automatica, sin tocar index.html)

```html
<!-- Unico cambio necesario en index.html: -->
<script src="modules/ia-jutia/module.js"></script>
```

module.js carga todo lo demas dinamicamente en orden:

```
module.js (entry point)
  └── loadFlexSearch()         → assets/flexsearch.min.js (con CDN fallback)
  └── loadScript(ia-core.js)   → window.ia (FlexSearch + stats + predicciones)
  └── loadScript(ia-chat.js)   → window.ia.chat (motor de chat NL)
  └── loadScript(tools/*.js)   → window.IA_TOOLS (herramientas extensibles)
  └── window.ia.init()         → FlexSearch Document + register default tables
  └── window.ia.chat.init()    → FlexSearch historial
  └── ensureDBTables()         → _ia_chats + _ia_messages en db principal
  └── registerAlpineStore()    → Alpine.store('ia')
  └── injectFabDrawer()        → FAB + Drawer con tabs: Chat/Hilos/Ajustes
  └── dispatchEvent(ready)     → window.dispatch('jutia:ready')
```

### DB Hibrida

| Tabla | DB | Proposito |
|-------|----|-----------|
| `_ia_chats` | `window.db` (AppDB principal) | Metadata de conversaciones |
| `_ia_messages` | `window.db` (AppDB principal) | Mensajes del chat |
| `_ia_docs` | `window.iaDB` (AHA_Jutia) | Documentos subidos (Full) |
| `_ia_chunks` | `window.iaDB` (AHA_Jutia) | Chunks indexados (Full) |
| `_ia_index` | `window.iaDB` (AHA_Jutia) | Cache de consultas |
| `modelos_cache` | `window.iaDB` (AHA_Jutia) | Cache de modelos (Full) |
| `_ia_sqlite` | `window.iaDB` (AHA_Jutia) | Snapshot SQLite FTS5 (Full) |

Las tablas de chat se crean en `window.db` (la DB principal) para que el backup de la app incluya las conversaciones. Las tablas de IA van en `AHA_Jutia` separada para no contaminar el schema de la app.

### Comunicacion por Eventos

| Evento | Detalle | Dispara |
|--------|---------|---------|
| `jutia:ready` | `{ id: 'ia-jutia' }` | module.js init completo |
| `jutia:trigger` | `{ ... }` | Cualquier modulo abre el Drawer de IA |

Cualquier modulo puede abrir el chat IA con:
```javascript
window.dispatchEvent(new CustomEvent('jutia:trigger', { detail: { modulo: 'inventario', query: 'stock' } }));
```

### Perfiles

| Perfil | Peso | Que incluye | Como se activa |
|--------|------|-------------|----------------|
| **Lite** | ~40KB | FlexSearch + chat + stats + predict + tools | Siempre activo. Sin descargas |
| **Full+** | ~40MB | Lite + ingesta documentos + embeddings + OCR + SQLite FTS5 | DLC opcional. Descarga una vez, ruta compartida entre apps |

---

## 🟢 FASE 1: Deteccion de Perfil

1. Revisa `project.config.js` o pregunta al usuario:

```
📋 ¿Que perfil de IA deseas?

[1] Lite (FlexSearch + chat + estadisticas + predicciones) — 40KB, sin descargas
    Busqueda full-text sobre datos de la app, chat conversacional,
    estadisticas descriptivas, proyeccion de tendencias.
    Plugin auto-contenido. NO requiere modificar core/ ni index.html.

[2] Full+ (Lite + ingesta documentos + embeddings + OCR + FTS5) — +40MB DLC
    Todo lo de Lite + subir PDF/DOCX/XLSX/CSV/MD para consultar.
    OCR 100% offline en PDFs escaneados (worker + core WASM + datos spa locales).
    Busqueda por embeddings ONNX (all-MiniLM-L6-v2) + SQLite FTS5.
    Modelos compartidos entre apps del mismo equipo.

[3] No incluir IA
```

2. Si perfil=Full, advierte:

```
⚠️ PERFIL FULL+: DLC de ~40MB
  Los modelos se comparten entre apps del mismo equipo
  (una sola descarga, no N×40MB).

  La descarga ocurre UNA VEZ durante el setup.
  Luego todo funciona 100% offline.

  ¿Continuar con perfil Full+?
  [1] Si, descargar todo
  [2] No, usar Lite
```

---

## 🟡 FASE 2: Generacion de Codigo

### Perfil Lite

```
📁 modules/ia-jutia/
├── module.js           → Entry point: carga dinamica + store + FAB+Drawer
├── ia-core.js          → window.ia: FlexSearch + stats + predict
├── ia-chat.js          → window.ia.chat: patrones NL + historial
├── setup-ia.ps1        → Descarga FlexSearch a assets/
├── assets/
│   └── flexsearch.min.js  (descargado por setup-ia.ps1)
└── tools/
    ├── _registry.js       → window.IA_TOOLS: registro central
    └── extraer-factura.js → Extraccion multi-region Latam
```

NO modificar:
- `index.html` (solo agregar un `<script src="modules/ia-jutia/module.js">`)
- `core/db.js` (el plugin crea sus propias tablas via hybrid DB)
- `project.config.js` (solo leer `APP_CONFIG.iaJutia.perfil`)

### Perfil Full+ (DLC, ademas de Lite)

```
📁 modules/ia-jutia/
├── ia-full.js          → window.iaFull: ingest + embeddings + parsers + OCR
├── ia-sqlite.js        → sql.js FTS5 wrapper (Professional/Business)
├── ia-worker.js        → Web Worker para Transformers.js (FUTURO: no se carga en runtime;
│                         embed() corre en main thread con pipeline cacheado en ia-full.js)
├── scripts/
│   └── build-ia-zips.ps1 → Genera los 2 ZIPs distribuibles (Lite + Full+)
├── assets/             → FlexSearch, Transformers, PDF.js, mammoth, SheetJS,
│   │                     Tesseract (worker + core WASM), tessdata/spa
│   └── wasm/           → ort-wasm-simd-threaded + sql-wasm (js+wasm)
└── models/
    └── Xenova/all-MiniLM-L6-v2/  → onnx/model_quantized + tokenizer
```

Los modelos Full se almacenan en ruta compartida (no dentro de la app):
- Windows: `C:\ProgramData\IA-Jutia\models\`
- Linux: `~/.local/share/ia-jutia/models/`
- macOS: `~/Library/Application Support/IA-Jutia/models/`

Decisiones de producto (v2.1):
- **QA usa keyword retrieval** (sin modelo NLP distilbert, -43MB).
- **OCR 100% offline**: worker.min.js + tesseract-core-simd.wasm.js + tessdata/spa.traineddata.gz (best_int 2.1MB). `ia-full.js` configura `workerPath`/`corePath`/`langPath` a rutas locales.
- **PDF.js v3.11.174** (UMD `window.pdfjsLib`; v4 es solo ESM y rompe el patron script).
- **sql.js@1.10** (range semver; la version exacta 1.10.0 no existe en jsDelivr).
- **onnxruntime-web 1.20** solo distribuye `ort-wasm-simd-threaded.wasm` (no existe el build simd simple).
- Los assets JS se cargan bajo demanda en `initFull()` (offline-first, no bloquean DOMContentLoaded).

---

## 🔵 FASE 3: Integracion en Config

En `project.config.js`:

```javascript
APP_CONFIG: {
  iaJutia: {
    perfil: 'lite',       // 'lite' | 'full' | false
    modeloPath: ''        // Ruta personalizada de modelos (opcional)
  }
}
```

---

## 📋 API DEL PLUGIN

### `window.ia` (ia-core.js)

```javascript
window.ia = {
  init(),                       // Crea FlexSearch Document + registra tablas default
  search(query, opts),          // FlexSearch con Alpine store update
  registerTable(nombre),        // Indexa tabla Dexie en lotes de 200
  indexRecord(tabla, record),   // Indexacion incremental
  removeRecord(tabla, id),      // Eliminar del indice
  stats(tabla, campo),          // media, mediana, moda, min, max, stddev, count
  statsAll(),                   // Conteo de todas las tablas (usa count())
  predict(tabla, campo, n),     // Regresion lineal
  forecast(valores, n),         // Proyeccion lineal
  movingAverage(valores, n),    // Media movil
  exportResumen(tabla)          // Resumen en texto plano
};
```

### `window.ia.chat` (ia-chat.js)

```javascript
window.ia.chat = {
  init(),                       // Crea FlexSearch historial
  create(titulo),               // Nuevo thread
  list(),                       // Listar threads (ordenados por updatedAt)
  load(chatId),                 // Cargar thread + mensajes
  delete(chatId),               // Eliminar thread + mensajes
  addMessage(chatId, rol, contenido, fuente, score),   // Guardar mensaje
  ask(chatId, pregunta),        // Patrones DB + FlexSearch fallback
  searchHistory(query, limit),  // Buscar en historial de chats
  getRelevantHistory(query, n)  // Contexto relevante para la pregunta
};
```

### `window.IA_TOOLS` (tools/_registry.js)

```javascript
window.IA_TOOLS = {
  register(nombre, tool),       // Auto-registro de herramienta
  get(nombre),                  // Obtener tool por nombre
  list(),                       // Listar tools registradas
  ejecutar(nombre, contexto),   // Ejecutar tool con contexto
  detectar(texto),              // Detectar tool por texto
  limpiar()                     // Limpiar registro
};
```

### `Alpine.store('ia')` (module.js)

```javascript
Alpine.store('ia') = {
  chatOpen: false,              // Drawer abierto/cerrado
  drawerView: 'chat',           // 'chat' | 'threads' | 'settings'
  perfil: 'lite',               // Desde APP_CONFIG
  perfilReal: 'lite',           // Perfil realmente activo
  modeloListo: false,           // Full: modelos cargados
  mensajes: [],                 // Mensajes del thread actual
  documentos: [],               // Documentos indexados (Full)
  threads: [],                  // Lista de hilos
  tools: [],                    // Herramientas registradas
  inputText: '',                // Texto del input
  isLoading: false,
  currentChatId: null,          // ID del thread activo
  modeloPath: '',               // Ruta de modelos Full

  toggleChat(),                 // Abre/cierra drawer
  cambiarVista(vista),          // Cambia tab interna
  enviarMensaje(),              // Envia pregunta al chat
  refreshThreads(),             // Recarga lista de hilos
  crearThread(),                // Crea nuevo hilo
  cargarThread(chatId),         // Carga hilo existente
  eliminarThread(chatId),       // Elimina hilo
  cargarFull()                  // Activa DLC Full
};
```

---

## 🔗 INTEGRACION CON OTRAS SKILLS

| SKILL | Relacion |
|-------|----------|
| `setup-init` | Copia `ia-jutia/templates/plugin/` a `modules/ia-jutia/`. Descarga FlexSearch |
| `code-generator` | Agrega `<script src='modules/ia-jutia/module.js'>` en index.html. NO modifica db.js |
| `stack-compliance-guard` | Verifica que el plugin no modifique core/ ni tenga imports/ES6 |
| `pipeline-engine` | Fase Build: genera plugin segun perfil Lite/Full |

---

## ✅ AUTO-VALIDACION

- [ ] ¿Un solo `<script src='modules/ia-jutia/module.js'>` en index.html?
- [ ] ¿Plugin no modifica core/db.js, core/ui.js ni ningun archivo fuera de modules/ia-jutia/?
- [ ] ¿FlexSearch se carga con CDN fallback si el archivo local no existe?
- [ ] ¿Tablas _ia_chats + _ia_messages se crean en window.db (backup compatible)?
- [ ] ¿Tablas _ia_docs + _ia_chunks van en AHA_Jutia separada?
- [ ] ¿FAB + Drawer se inyectan sin duplicados (guard por id)?
- [ ] ¿Drawer tiene tabs: Chat / Hilos / Ajustes?
- [ ] ¿Threads se persisten con create/list/load/delete?
- [ ] ¿Patrones NL cubren: count, sum, rank, top, filter, date, date_range, list, avg?
- [ ] ¿FlexSearch fallback activo cuando no hay patron?
- [ ] ¿Respuestas incluyen fuente (tabla o flexsearch)?
- [ ] ¿Herramientas se auto-registran en window.IA_TOOLS?
- [ ] ¿Evento jutia:ready se dispara al completar init?
- [ ] ¿jutia:trigger abre el drawer desde cualquier modulo?
- [ ] ¿Todo el codigo usa IIFE, var, sin imports/export?
- [ ] ¿Perfil Lite pero usa Transformers? → ❌ RECHAZAR
- [ ] ¿Perfil Full pero no carga modelos? → ❌ RECHAZAR
- [ ] ¿setup-ia.ps1 descarga FlexSearch a assets/?
- [ ] ¿initFull() carga assets JS bajo demanda (flexsearch, transformers, pdf, mammoth, xlsx, tesseract)?
- [ ] ¿OCR apunta a rutas locales (workerPath/corePath/langPath), sin CDN en runtime?
- [ ] ¿build-ia-zips.ps1 genera los 2 ZIPs y valida integridad (MinBytes + HTML check + reporte)?

---

## 📄 TEMPLATES

Los templates del plugin estan en:

```
templates/plugin/
├── module.js           → Entry point (auto-detecta perfil Full+)
├── ia-core.js          → window.ia (FlexSearch + stats + predict)
├── ia-chat.js          → window.ia.chat (chat NL + historial)
├── ia-full.js          → window.iaFull (ingest + embeddings + OCR + parsers)
├── ia-sqlite.js        → sql.js FTS5 wrapper
├── ia-worker.js        → Web Worker Transformers.js
├── setup-ia.ps1        → Instalador (descarga assets + modelos, valida integridad)
├── assets/             → Librerias (descargadas por setup-ia.ps1)
└── tools/
    ├── _registry.js    → window.IA_TOOLS (registro central)
    ├── extraer-factura.js → Extraccion Latam
    ├── extraer-pdf.js  → PDF.js UMD (workerSrc local)
    ├── extraer-docx.js → Mammoth.js
    └── extraer-xlsx.js → SheetJS
```

---

## 📝 NOTAS PARA LA IA

- **Plugin auto-contenido**: No modificar core/, db.js, index.html mas alla del unico script tag.
- **FlexSearch**: module.js carga FlexSearch con fallback CDN. ia-core.js usa `window.FlexSearch`.
- **DB Hibrida**: `window.db` para chats (backup con la app). `window.iaDB = new Dexie('AHA_Jutia')` para datos de IA.
- **Eventos**: `jutia:ready` al completar init. `jutia:trigger` para abrir drawer desde otros modulos.
- **Lotes de 200**: `registerTable()` pagina en lotes de 200. `statsAll()` usa `count()`.
- **Predicciones**: Regresion lineal `y = mx + b` con minimos cuadrados.
- **Transformers.js (Full+)**: `pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')` en main thread (carga `onnx/model_quantized.onnx` por defecto). Pipeline cacheado en `Full._pipeline` (lazy init). El worker ia-worker.js NO se usa en runtime — queda como implementacion futura para no bloquear UI.
- **OCR offline**: Tesseract.js `recognize(dataUrl, 'spa', { workerPath, corePath, langPath })` con assets locales. Datos spa: build `4.0.0_best_int` (2.1MB).
- **PDF.js v3 UMD**: `window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'modules/ia-jutia/assets/pdf.worker.min.js'` (v4 es solo ESM).
- **Ruta compartida**: Los modelos Full se almacenan fuera de la app (ProgramData, .local/share, etc).
- **Integridad**: setup/build verifican tamano minimo y detectan respuestas HTML 404; reportan errores globales al final.
- **Idioma**: Todo en espanol. Labels, mensajes, tooltips.
- **Si el perfil no esta definido**: Preguntar. No asumir default.

---

## 📦 ENTREGA

```
✅ IA-JUTIA PLUGIN GENERADO

📋 Resumen:
  Perfil: [lite|full]
  Unico script: <script src="modules/ia-jutia/module.js">
  Cero modificaciones a core/ o db.js

🚀 Siguiente paso: continuar con generacion de modulos o validar app
```

✨ **SKILL ready. Trigger: `mini ia` para iniciar.**
