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

**Archivo:** `ia-jutia/templates/archived/full/core/ia-sqlite.js`

ia-sqlite.js — SQLite con FTS5 para IA Jutia (sql.js WASM) [ARCHIVED: funcionalidad integrada en ia-core.js]

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

**Archivo:** `ia-jutia/templates/archived/full/core/ia-worker.js`

ia-worker.js — Transformers.js en Web Worker + q4 quantization [ARCHIVED: funcionalidad integrada en ia-core.js]

---

## ia-worker

**Archivo:** `ia-jutia/templates/archived/lite/core/ia-worker.js`

ia-worker.js — [ARCHIVED: funcionalidad integrada en ia-core.js]

---

*Fin del documento*
