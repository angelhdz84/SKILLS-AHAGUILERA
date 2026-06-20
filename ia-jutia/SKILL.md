---
name: ia-jutia
description: Mini IA offline-first con dos perfiles. Lite: FlexSearch + estadisticas + predicciones sobre datos de la app. Full: +ingesta PDF/DOCX/XLSX/CSV/MD + Transformers.js QA extractivo. Acceso por modulo + atajo global Cmd+K.
license: MIT
compatibility: Requiere @AGENTS.md y espec validada. Perfil Lite requiere solo FlexSearch (~7KB). Perfil Full requiere pdf.js + mammoth.js + marked.js + Transformers.js (~233MB descarga unica).
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  generatedBy: "ia-jutia skill"
  triggers: ["mini ia", "ia jutia", "busqueda inteligente", "analisis datos", "subir documento", "preguntar documento", "predicciones", "estadisticas"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  perfiles: [lite, full]
  language: es
  outputPath: "modules/ia-jutia/"
  autoSave: true
---

# 🧠 SKILL: ia-jutia (Mini IA Offline-First)

> **Proposito**: Agregar inteligencia artificial offline a apps del stack. Dos perfiles: **Lite** (FlexSearch + estadisticas + predicciones, ~7KB) y **Full** (+ingesta documentos + QA extractivo con Transformers.js, ~233MB).
> **Modo**: Generacion de modulo por perfil | **Idioma**: ES | **Contexto**: Requiere spec validada + @AGENTS.md
> **Output**: `modules/ia-jutia/module.js` + `modules/ia-jutia/module.html` + `core/ia.js` (+ `core/ia-ingest.js` en Full)

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

📁 MODULO IA-JUTIA
### `modules/ia-jutia/module.js`
[Registro en window.MODULES, init de FlexSearch, metodos publicos]

### `modules/ia-jutia/module.html`
[UI: buscador, panel de estadisticas, grafico de predicciones, resultados]

📁 REGISTRO EN INDEX.HTML
[Añadir <script src="core/ia.js"> entre core/ui.js y core/app.js]
[Añadir <script src="assets/js/libs/flexsearch.min.js"> entre libs base y adicionales]
```

**Perfil Full:**
```
📁 CORE COMPARTIDO
### `core/ia.js`
[FlexSearch + estadisticas + predicciones (identico a Lite)
 + metodos de orquestacion: ingest(), qa(), getDocumentos()]

### `core/ia-ingest.js`
[Parsers: pdf(), docx(), xlsx(), csv(), md(), txt()
 + chunking con overlap
 + Transformers.js pipeline init (MiniLM + BERT)
 + QA extractivo con citacion de fuentes]

📁 MODULO IA-JUTIA
### `modules/ia-jutia/module.js`
[Registro + init de modelos + background ingest]

### `modules/ia-jutia/module.html`
[Upload zone drag & drop, lista documentos, chat Q&A, buscador, stats]

📁 REGISTRO EN INDEX.HTML
[Añadir <script src="core/ia.js"> entre core/ui.js y core/app.js]
[Añadir <script src="core/ia-ingest.js"> despues de core/ia.js]
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
  _ia_index: '&consulta',
  modelos_cache: '&ruta'
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
   - (Full) Los modelos estan en assets/models/

🚀 Siguiente paso: continuar con generacion de modulos o validar app
```

---

## 🛡️ AUTO-VALIDACION CONTRA @AGENTS.md (EJECUTAR SIEMPRE)

- [ ] ¿FlexSearch cargado desde `assets/js/libs/flexsearch.min.js` (Lite) o `bun add flexsearch` (Full)? → RUTA LOCAL siempre
- [ ] ¿Transformers.js (Full) carga modelos desde `assets/models/` con opcion `{local: true}`? → NO CDN en runtime
- [ ] ¿Los chunks de documentos se guardan en `_ia_chunks` (IndexedDB)? → ✅
- [ ] ¿El chat Q&A (Full) cita la fuente de cada respuesta? → ✅
- [ ] ¿Cmd+K no interfiere con inputs nativos? → Usar `@keydown.window` no dentro de inputs
- [ ] ¿Perfil Lite pero usa `Transformers`? → ❌ RECHAZAR
- [ ] ¿Perfil Full pero no carga `ia-ingest.js`? → ❌ RECHAZAR

---

## 📋 API DEL MODULO (`window.ia`)

### Ambos perfiles:
```javascript
window.ia = {
  // Busqueda full-text
  search(query, opts),              // FlexSearch sobre tablas registradas
  registerTable(nombre, campos),    // Registrar tabla Dexie para indexado

  // Estadisticas
  stats(tabla, campo),              // media, mediana, moda, min, max, stddev, count
  statsAll(),                       // estadisticas de todas las tablas registradas

  // Predicciones
  predict(tabla, campo, periodos),  // regresion lineal sobre datos historicos
  forecast(valores, n),             // proyeccion de array numerico
  movingAverage(valores, ventana),  // media movil para smooth

  // Export
  exportResumen(tabla),             // texto plano con hallazgos

  // UI state
  paletteOpen: false,               // control de command palette

  // Init
  initLite()                        // inicializar FlexSearch + registrar tablas
};
```

### Solo Full:
```javascript
window.ia.ingest = {
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
  getDocumentos(),                  // lista docs indexados
  deleteDocumento(id)               // eliminar doc + chunks + indices
};

window.ia.initFull = function() {   // init lite + ingest + modelos
  this.initLite();
  // Cargar Transformers pipeline async
};
```

---

## 📄 TEMPLATES

Los templates de codigo estan en:
- `templates/lite/core/ia.js` — FlexSearch + stats + predicciones
- `templates/lite/modules/ia-jutia/module.js` — Registro Lite
- `templates/lite/modules/ia-jutia/module.html` — UI Lite
- `templates/full/core/ia.js` — Full (hereda Lite + ingest orchestration)
- `templates/full/core/ia-ingest.js` — Parsers + Transformers + QA
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
- **Predicciones**: Regresion lineal `y = mx + b`. Calcular m y b con minimos cuadrados. mediaMovil con ventana configurable (default 3).
- **Transformers.js (Full)**: Usar `pipeline('feature-extraction', model, {local: true})` para embeddings. Usar `pipeline('question-answering', model, {local: true})` para QA. Los modelos se cargan desde `assets/models/`.
- **Chunking (Full)**: 512 tokens por chunk, overlap de 64 tokens. Almacenar en `_ia_chunks` con referencia a `docId`.
- **QA (Full)**: Buscar top-3 chunks por similitud coseno (embeddings), pasar a BERT QA que extrae la respuesta exacta del chunk mas relevante. Mostrar fuente (nombre documento + fragmento).
- **Cmd+K**: El atajo global abre una command palette tipo "Pregunta a la IA". No interferir con inputs de formularios.
- **Persistencia**: Los documentos subidos (Full) persisten en IndexedDB (`_ia_docs`, `_ia_chunks`). Al recargar, el chat muestra historial y los documentos siguen disponibles.
- **Idioma**: Todo en español. Labels, mensajes, respuestas del QA, tooltips.
- **Si el perfil no esta definido**: Preguntar. No asumir default.

✨ **SKILL ready. Trigger: `mini ia` para iniciar.**
