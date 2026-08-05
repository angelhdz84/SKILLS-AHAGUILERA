# API Reference

> Generado automáticamente el 1 de julio de 2026 a las 04:23 p.m.

## Índice

- [ia](#ia)
- [ia](#ia)
- [ia-chat](#ia-chat)
- [ia-chat](#ia-chat)
- [ia-ingest](#ia-ingest)
- [ia-jutia](#ia-jutia)
- [ia-jutia](#ia-jutia)
- [ia-sqlite](#ia-sqlite)
- [ia-worker](#ia-worker)
- [ia-worker](#ia-worker)

---

## ia

**Archivo:** `ia-jutia/templates/plugin/ia-core.js`

ia-core.js — IA Jutia Core Plugin: FlexSearch + Estadisticas + Chat + Predicciones + Orquestacion

### Dependencias

- `sqliteDB`
- `db`
- `iaIngest`
- `db._ia_docs`
- `db._ia_chunks`
- `db._ia_chats`
- `db._ia_messages`

### Funciones

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `_cosineSimilarity` | vecA, vecB | — |

#### `_cosineSimilarity(vecA, vecB)`

- **Línea:** 187
- **Parámetros:**
  - `vecA`
  - `vecB`

---

## ia

**Archivo:** `ia-jutia/templates/plugin/ia-core.js`

ia-core.js — IA Jutia Core Plugin (perfil lite): FlexSearch + Estadisticas + Predicciones

### Dependencias

- `FlexSearch`
- `db`

---

## ia-chat

**Archivo:** `ia-jutia/templates/plugin/ia-chat.js`

ia-chat.js — IA Jutia Chat Plugin: Chat conversacional con consultas BD + FlexSearch fallback

### Dependencias

- `ia`
- `iaIngest`

---

## ia-chat

**Archivo:** `ia-jutia/templates/plugin/ia-chat.js`

ia-chat.js — IA Jutia Chat Plugin (perfil lite): Chat conversacional con consultas a BD + FlexSearch fallback

### Dependencias

- `db`
- `FlexSearch`
- `ia`
- `db._ia_chats`
- `db._ia_messages`

---

## ia-ingest

**Archivo:** `ia-jutia/templates/plugin/ia-core.js`

ia-core.js — IA Jutia Core Plugin (perfil full): Ingesta documentos + QA (funciones integradas)

### Dependencias

- `ia`
- `iaIngest`
- `db`
- `sqliteDB`
- `db._ia_docs`
- `db._ia_chunks`

### Funciones

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `logger` | m | — |

#### `logger(m)`

- **Línea:** 284
- **Parámetros:**
  - `m`

---

## ia-jutia

**Archivo:** `ia-jutia/templates/plugin/module.js`

module.js — IA Jutia Plugin Module (perfil full): Busqueda + Ingesta documentos + Chat QA + Predicciones

### Dependencias

- `ia`
- `iaIngest`
- `UI`

---

## ia-jutia

**Archivo:** `ia-jutia/templates/plugin/module.js`

module.js — IA Jutia Plugin Module (perfil lite): Busqueda inteligente + Chat conversacional + estadisticas + predicciones

### Dependencias

- `ia`
- `appRouter`
- `db`
- `APP_CONFIG`

### Funciones

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `_loadAutocompleteCache` | — | v0.2 — Autocomplete methods |
| `_saveQuery` | query | — |
| `getAutocomplete` | query | — |
| `selectAutocomplete` | text | — |
| `_handleAutocompleteKeydown` | e | — |
| `exportPDF` | — | v0.2 — L3 Export stats PDF |
| `_escapeHtml` | str | — |

#### `_loadAutocompleteCache()`

v0.2 — Autocomplete methods

- **Línea:** 497

#### `_saveQuery(query)`

- **Línea:** 506
- **Parámetros:**
  - `query`

#### `getAutocomplete(query)`

- **Línea:** 518
- **Parámetros:**
  - `query`

#### `selectAutocomplete(text)`

- **Línea:** 552
- **Parámetros:**
  - `text`

#### `_handleAutocompleteKeydown(e)`

- **Línea:** 558
- **Parámetros:**
  - `e`

#### `exportPDF()`

v0.2 — L3 Export stats PDF

- **Línea:** 609

#### `_escapeHtml(str)`

- **Línea:** 678
- **Parámetros:**
  - `str`

---

## ia-sqlite

**Archivo:** `ia-jutia/templates/plugin/ia-sqlite.js`

ia-sqlite.js — SQLite FTS5 para IA Jutia (sql.js WASM). Wrapper que expone `window.sqliteDB` con búsqueda FTS5 en chunks de documentos (Full+).

### Dependencias

- `initSqlJs` (sql.js UMD, local en `assets/wasm/sql-wasm.js`)
- `window.db` (AppDB principal)
- `sqliteDB` (window)
- `db._ia_sqlite`

### API

- `init()` — Carga sql.js (locateFile → `modules/ia-jutia/assets/wasm/`), crea DB en memoria con FTS5 y hace lazy rebuild desde Dexie si la DB no está sincronizada.
- `addChunks(docId, chunks)` — Inserta chunks y reconstruye el índice FTS5 (ROLLBACK + `stmt.free()` en errores).
- `searchChunks(query)` — Búsqueda FTS5 (escape de comillas + `toLowerCase`), con `_fallbackSearch` por scoring de palabras si FTS5 no devuelve resultados.
- `count()` — Conteo total (con `try/finally` para liberar statements).

---

## ia-worker

**Archivo:** `ia-jutia/templates/plugin/ia-worker.js`

ia-worker.js — Web Worker real para Transformers.js (Full+). Creado bajo demanda por `ia-full.js.embed()` para NO bloquear la UI al cargar el modelo ONNX de embeddings (`all-MiniLM-L6-v2`, ~23MB) ni al generar vectores.

### Carga

- `importScripts('modules/ia-jutia/assets/transformers.min.js')` al arrancar (UMD local, 100% offline).
- Requiere servirse por HTTP (fetch de modelos bloqueado en `file://`).
- Si el worker falla, `ia-full.js` hace fallback a pipeline en main thread (`Full._embedMain`).

### Mensajes

- `{ type: 'init', modelPath }` → `{ type: 'ready' }` o `{ type: 'error' }`
- `{ type: 'embed', text, modelPath }` → `{ type: 'embed_result', vector, dimension, error? }`
- `{ type: 'qa', question, chunks }` → `{ type: 'qa_result', respuesta, confianza, chunkId }` (retrieval por keyword, decisión de producto: sin modelo QA NLP)

### Configuración offline (worker)

- `env.localModelPath = 'modules/ia-jutia/models/'`
- `env.allowRemoteModels = false`
- `env.backends.onnx.wasm.wasmPaths = 'modules/ia-jutia/assets/wasm/'`

---

*Fin del documento*
