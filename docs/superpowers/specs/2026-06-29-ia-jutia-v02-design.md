# IA Jutia v0.2 — Design Document

> Mejoras para perfiles Lite y Full.
> Fecha: 2026-06-29
> Autor: Angel Hernández Aguilera

## Alcance

6 mejoras (3 Lite + 3 Full) + cambios arquitectónicos transversales sobre la v1.0 actual de IA Jutia.

## Perfil Lite — 3 Mejoras

### L1. Highlight + Resultados Agrupados por Tabla

**Estado actual:** `ia.search()` devuelve array plano de resultados. Solo muestra nombre + descripción.

**Mejora:**
- Resultados agrupados por `tabla` (origen): "Inventario (3)", "Clientes (5)", etc.
- Cada resultado muestra el contexto alrededor del match (fragmento de ~100 chars con el término resaltado)
- El resaltado se implementa con `innerHTML` marcando `<mark class="bg-warning/30 text-warning-content">termino</mark>` (DaisyUI)
- Función auxiliar `_highlight(text, query)` que aplica el wrap insensible a mayúsculas

**Archivos:** `templates/lite/core/ia.js`, `templates/lite/modules/ia-jutia/module.html`

### L2. Auto-completar en Búsqueda

**Estado actual:** Sin sugerencias. El usuario escribe y presiona Enter o espera.

**Mejora:**
- Mientras escribe, muestra dropdown con hasta 8 sugerencias usando `FlexSearch.search()` con `suggest: true` y `limit: 8`
- Las sugerencias muestran: término + nombre de tabla origen + conteo
- Debounce de 200ms
- Navegación por teclado (↑↓ + Enter)
- Click en sugerencia ejecuta la búsqueda

**Archivos:** `templates/lite/modules/ia-jutia/module.html`, `templates/lite/core/ia.js`

### L3. Exportar Estadísticas a PDF

**Estado actual:** `exportResumen()` devuelve texto plano. Sin exportación visual.

**Mejora:**
- Botón "Exportar PDF" en el panel de estadísticas
- Genera PDF usando `window.print()` con CSS `@media print` específico para estadísticas
- Tabla formateada: nombre de tabla, registros, media, mediana, min, max, stddev
- Encabezado: "Reporte de Estadísticas — [app]" + fecha
- Sin librerías extra — usa `print()` nativo

**Archivos:** `templates/lite/core/ia.js` (+ método `exportPDF()`), `templates/lite/modules/ia-jutia/module.html`

## Perfil Full — 3 Mejoras

### F1. OCR para PDFs Escaneados

**Estado actual:** `parse.pdf()` usa pdf.js que solo extrae texto digital. PDFs escaneados devuelven cadena vacía.

**Mejora:**
- Detección automática: si `pdf.js` extrae < 50 caracteres para el documento completo, activar OCR
- Usar Tesseract.js v5 (`Tesseract.recognize()`) con modelo `spa` (español)
- Convertir cada página PDF a canvas vía `pdf.js` → exportar como imagen → pasar a Tesseract
- Progreso: reportar página actual / total páginas al store Alpine
- Worker dedicado para Tesseract (no bloquear UI)
- Tesseract.js se carga desde `assets/js/libs/tesseract.min.js` + `tesseract-core-simd.wasm`
- Descarga ~5MB adicionales (modelo `spa.traineddata` + wasm)

**Archivos:** `templates/full/core/ia-ingest.js`, `templates/full/core/ia-worker.js`, `templates/full/modules/ia-jutia/module.html`, `templates/full/modules/ia-jutia/module.js`

### F2. Chat con Historial / Threads

**Estado actual:** QA pregunta-respuesta sin persistencia. Cada pregunta es independiente.

**Mejora:**
- Las conversaciones QA se guardan en tabla Dexie `_ia_chats`: `id, titulo, createdAt, updatedAt, messageCount`
- Los mensajes se guardan en `_ia_messages`: `id, chatId, rol (user|assistant), contenido, fuente, score, createdAt`
- UI tipo chat con burbujas: usuario derecha (primary), IA izquierda
- Sidebar con lista de conversaciones (más reciente primero)
- Botón "Nuevo chat" limpia el área
- Click en conversación anterior carga sus mensajes
- Cada respuesta de QA se guarda automáticamente en el chat activo
- Las fuentes se muestran como badges debajo de cada respuesta

**Archivos:** `templates/full/core/ia.js`, `templates/full/core/ia-ingest.js`, `templates/full/modules/ia-jutia/module.html`, `templates/full/modules/ia-jutia/module.js`. También actualizar schema Dexie en `core/db.js` (añadir `_ia_chats` y `_ia_messages`).

### F3. Búsqueda Híbrida (FlexSearch + Embeddings)

**Estado actual:** QA usa FTS5 (SQLite) o muestreo aleatorio + similitud coseno si hay embeddings. Búsqueda `search()` usa solo FlexSearch.

**Mejora:**
- En `search()`, cuando hay modelos cargados (Full), combinar resultados:
  1. Resultados de FlexSearch (keyword, peso 0.6)
  2. Embeddings de la query vs embeddings almacenados en `_ia_chunks.embedding` (semántico, peso 0.4)
- Score combinado: `scoreFinal = 0.6 * scoreFlex + 0.4 * scoreSemantico`
- Los embeddings de chunks se calculan en el momento de indexación (no en búsqueda)
- Almacenar embedding como `Float32Array` en `_ia_chunks` (campo nuevo)
- Si no hay embeddings disponibles, solo FlexSearch (fallback silencioso)
- Umbral mínimo: ignorar resultados por debajo de 0.15 de score semántico

**Archivos:** `templates/full/core/ia.js`, `templates/full/core/ia-ingest.js` (+ `_computeEmbedding()` en indexDocument)

## Arquitectura Transversal

### Web Worker para Búsqueda Lite

**Estado actual:** `search()` corre en hilo principal. Con 10k+ registros puede congelar ~200ms.

**Mejora:**
- Nuevo `templates/lite/core/ia-worker.js` con FlexSearch dentro del Worker
- `ia.js` delega búsqueda al Worker vía `postMessage`
- FlexSearch se transpila inline en el Worker (FlexSearch no soporta `importScripts` directamente, se necesita bundle)
- Alternativa: usar `comlink` o wrapper manual con transferables
- NOTA: FlexSearch no se puede cargar con `importScripts` en Worker (no está en UMD). Solución: inyectar FlexSearch inline en el Worker mediante blob URL.
- Worker también maneja indexación pesada (registerTable en lotes de 200)

**Archivos:** Nuevo `templates/lite/core/ia-worker.js`, modificar `templates/lite/core/ia.js`

### Web Worker para OCR

**Estado actual:** Sin OCR. El Worker de Full solo maneja Transformers.js.

**Mejora:**
- Ampliar `templates/full/core/ia-worker.js` para manejar también OCR requests
- Tesseract.js se carga con `importScripts('assets/js/libs/tesseract.min.js')`
- Mensaje tipo `{ type: 'ocr', id, data: { imageData, pageNum } }`
- Respuesta `{ type: 'ocr-result', id, data: { text, pageNum } }`

## Schema Dexie — Nuevas Tablas

```javascript
db.version(X).stores({
  // ...existentes...
  _ia_chats: 'id, titulo, createdAt, updatedAt, messageCount',
  _ia_messages: 'id, chatId, rol, contenido, fuente, score, createdAt',
});
// _ia_chunks ya existe, se añade campo embedding (no indexado)
```

## Carga de Librerías Adicionales (Full)

```html
<!-- Solo Full OCR -->
<script src="assets/js/libs/tesseract.min.js"></script>
<!-- WASM para Tesseract en assets/wasm/ -->
```

## Checklist de Validación

- [ ] Highlight no rompe XSS (usar `textContent` para el texto, solo `<mark>` envuelve)
- [ ] Auto-completar no dispara búsqueda si no hay cambios (debounce 200ms)
- [ ] Export PDF usa `@media print` sin cargar librerías extra
- [ ] OCR detecta correctamente PDFs con texto vs escaneados (umbral 50 chars)
- [ ] Tesseract.js carga desde local, no CDN
- [ ] Chat historial persiste entre recargas (Dexie)
- [ ] Búsqueda híbrida falla graceful si no hay embeddings
- [ ] Web Worker Lite no interfiere con Worker Full
- [ ] Cmd+K no se rompe con nuevas UI
- [ ] Perfil Lite no carga nada de Full
