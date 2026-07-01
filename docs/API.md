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

**Archivo:** `ia-jutia/templates/full/core/ia.js`

core/ia.js — IA Jutia Full: FlexSearch + Estadisticas + Predicciones + Orquestacion

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

**Archivo:** `ia-jutia/templates/lite/core/ia.js`

core/ia.js â€” IA Jutia Lite: FlexSearch + EstadÃ­sticas + Predicciones

### Dependencias

- `FlexSearch`
- `db`

---

## ia-chat

**Archivo:** `ia-jutia/templates/full/core/ia-chat.js`

core/ia-chat.js — IA Jutia Chat v0.3 (Full) Extiende Lite: fusión de consultas BD + QA sobre documentos

### Dependencias

- `ia`
- `iaIngest`

---

## ia-chat

**Archivo:** `ia-jutia/templates/lite/core/ia-chat.js`

core/ia-chat.js — IA Jutia Chat v0.3 Motor de chat conversacional con consultas a BD + FlexSearch fallback

### Dependencias

- `db`
- `FlexSearch`
- `ia`
- `db._ia_chats`
- `db._ia_messages`

---

## ia-ingest

**Archivo:** `ia-jutia/templates/full/core/ia-ingest.js`

core/ia-ingest.js — IA Jutia Full: Ingesta documentos + QA

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

**Archivo:** `ia-jutia/templates/full/modules/ia-jutia/module.js`

modules/ia-jutia/module.js — IA Jutia (Full) v0.3 Busqueda + Ingesta documentos + Chat QA + Predicciones

### Dependencias

- `ia`
- `iaIngest`
- `UI`

---

## ia-jutia

**Archivo:** `ia-jutia/templates/lite/modules/ia-jutia/module.js`

modules/ia-jutia/module.js — IA Jutia (Lite) v0.3 Busqueda inteligente + Chat conversacional + estadisticas + predicciones

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

**Archivo:** `ia-jutia/templates/full/core/ia-sqlite.js`

core/ia-sqlite.js — SQLite con FTS5 para IA Jutia (sql.js WASM)

### Dependencias

- `initSqlJs`
- `db`
- `sqliteDB`
- `db._ia_sqlite`
- `db.run`
- `db.export`
- `db.prepare`
- `db.exec`

---

## ia-worker

**Archivo:** `ia-jutia/templates/full/core/ia-worker.js`

core/ia-worker.js — Transformers.js en Web Worker + q4 quantization Cargado como: new Worker('core/ia-worker.js')

---

## ia-worker

**Archivo:** `ia-jutia/templates/lite/core/ia-worker.js`

FLEXSEARCH_SOURCE debe ser reemplazado con el contenido real de flexsearch.min.js durante build El build inlinea FlexSearch antes que este codigo en el Blob URL

---

*Fin del documento*
