# Análisis de Alternativas y Mejoras para el Stack Ateje + IA Jutia

> Investigación basada en Context7 + documentación oficial + repositorios de referencia.
> Complemento del documento `analisis-arquitectura-entrega.md`.

---

## Índice

1. [Alternativas a NeutralinoJS para escritorio](#1-alternativas-a-neutralinojs-para-escritorio)
2. [Alternativas a Capacitor para móvil](#2-alternativas-a-capacitor-para-móvil)
3. [Alternativas a sql.js para SQLite en navegador](#3-alternativas-a-sqljs-para-sqlite-en-navegador)
4. [Mejoras para Transformers.js (IA Jutia)](#4-mejoras-para-transformersjs-ia-jutia)
5. [Web Workers para descargar el hilo principal](#5-web-workers-para-descargar-el-hilo-principal)
6. [Tabla comparativa final](#6-tabla-comparativa-final)
7. [Recomendaciones consolidadas](#7-recomendaciones-consolidadas)

---

## 1. Alternativas a NeutralinoJS para escritorio

### NeutralinoJS (recomendado actualmente)

| Aspecto | Valor |
|---------|-------|
| **Peso** | ~2 MB (runtime) + `public/` |
| **WebView** | WebView2 (Win), WKWebView (Mac), WebKitGTK (Linux) |
| **APIs nativas** | 15+ (notificaciones, bandeja, file system, ventana, clipboard) |
| **Extensiones** | C++ (binarios compilados por SO), o Node.js via `command` |
| **SQLite** | Vía extensión C++ externa (no oficial, hay que compilarla) |
| **DevTools** | Chrome DevTools con `--debug-mode` |
| **Comunidad** | Pequeña (~4K stars) pero activa |
| **Licencia** | MIT |
| **Docs** | [neutralino.js.org](https://neutralino.js.org) |
| **Facilidad migración** | **Muy fácil** — mismo HTML/JS sin cambios, solo agregar `neutralino.config.json` |

### Tauri 2.x

| Aspecto | Valor |
|---------|-------|
| **Peso** | ~5-15 MB (runtime Rust + WebView) |
| **WebView** | WebView2 (Win), WKWebView (Mac), WebKitGTK (Linux) |
| **APIs nativas** | Ilimitadas (Rust backend) |
| **Extensiones** | Rust crates (ecosistema enorme) |
| **SQLite** | `tauri-plugin-sql` (oficial, SQL + migrations) |
| **Tauri Mobile** | Experimental para Android/iOS (Tauri 2.0+) |
| **DevTools** | Chrome DevTools integrado |
| **Comunidad** | **Grande y creciendo** (~85K stars) |
| **Licencia** | MIT |
| **Docs** | [tauri.app](https://tauri.app) |
| **Facilidad migración** | **Media** — requiere Rust toolchain, `tauri.conf.json`, build.rs |

### Electron

| Aspecto | Valor |
|---------|-------|
| **Peso** | ~150 MB (Chromium completo) |
| **WebView** | Chromium propio |
| **APIs nativas** | Ilimitadas (Node.js) |
| **SQLite** | `better-sqlite3` (nativo, síncrono, muy rápido) |
| **DevTools** | Chrome DevTools integrado |
| **Comunidad** | **Enorme** (el estándar de facto) |
| **Licencia** | MIT |
| **Facilidad migración** | **Fácil** — pero peso y RAM son prohibitivos |

### PWABuilder + Windows App

| Aspecto | Valor |
|---------|-------|
| **Peso** | ~0.5 MB (wrapper nativo) |
| **WebView** | WebView2 del SO |
| **APIs nativas** | Limitadas (solo las que expone el wrapper) |
| **SQLite** | No directamente (solo IndexedDB via WebView) |
| **Comunidad** | Mediana (Microsoft) |
| **Licencia** | MIT |
| **Facilidad migración** | **Muy fácil** — solo PWA manifest + service worker |

> **Novedad:** PWABuilder de Microsoft permite empaquetar PWAs como apps de Windows
> (Store), Android (.apk) y iOS. Sin framework, sin runtime extra.
> Requiere Service Worker y manifest.json — el stack Ateje hoy no tiene SW.
> **Ideal como opción ultraligera** para el tier gratuito/profesional sin
> necesidad de Neutralino, pero con limitaciones de APIs nativas.

### Veredicto escritorio

| Framework | Peso | SQLite | APIs nativas | Complejidad | Recomendación |
|-----------|------|--------|-------------|-------------|---------------|
| **NeutralinoJS** | ✅ 2MB | ⚠️ extensión C++ | ✅ 15+ | ✅ Baja | **Recomendado para empezar** |
| **Tauri 2.x** | ✅ 5-15MB | ✅ plugin oficial | ✅ Ilimitadas | ⚠️ Rust | **Recomendado a futuro** (cuando se necesite más potencia) |
| **Electron** | ❌ 150MB | ✅ better-sqlite3 | ✅ Ilimitadas | ✅ Baja | Solo si Neutralino/Tauri no cubren |
| **PWABuilder Win** | 🚀 0.5MB | ❌ No | ❌ Limitadas | 🚀 Mínima | Opción complementaria |

**Recomendación:** Neutralino ahora, preparar migración a Tauri si se necesitan
más APIs nativas o SQLite plugin oficial. Neutralino es suficiente para el 80%
de los casos de uso del stack Ateje.

---

## 2. Alternativas a Capacitor para móvil

### Capacitor (recomendado para .apk)

| Aspecto | Ionic Capacitor | PWABuilder + Bubblewrap | Cordova | Tauri Mobile |
|---------|----------------|------------------------|---------|--------------|
| **Peso app** | ~5MB base | ~3MB base | ~8MB base | ~10MB base |
| **WebView** | Android WebView | Android WebView | Android WebView | Android WebView |
| **Plugins nativos** | **70+ oficiales** (cámara, GPS, SQLite, etc.) | Limitados (solo PWABuilder API) | **3000+ legacy** | Experimentales |
| **SQLite plugin** | ✅ `@capacitor-community/sqlite` (nativo, FTS5) | ❌ No | ✅ `cordova-sqlite-storage` | ⚠️ experimental |
| **Cámara** | ✅ | ⚠️ web only | ✅ | ⚠️ |
| **Mantenimiento** | ✅ Activo (Ionic) | ✅ Activo (Microsoft) | ⚠️ Legacy | ⚠️ Experimental |
| **Comunidad** | Grande | Mediana | Grande (declinando) | Pequeña (mobile) |
| **Build CI** | `gradle assembleRelease` | `npx @pwabuilder/cli package` | `gradle assembleRelease` | `cargo tauri build` |
| **Licencia** | MIT | MIT | Apache 2.0 | MIT |
| **Facilidad** | Media (requiere Android Studio) | **Baja** (CLI) | Media | **Alta** (requiere Rust) |

### ¿PWABuilder como alternativa a Capacitor?

PWABuilder de Microsoft puede convertir una PWA en .apk **sin Android SDK**:

```
npx @pwabuilder/cli package -p android -m https://miapp.com/manifest.json
```

**Ventajas:**
- No requiere Android Studio ni JDK
- Build en la nube (servicio de PWABuilder)
- Genera .apk firmado listo para subir a Play Store
- Peso mínimo (~3MB)

**Desventajas:**
- **Sin plugins nativos** — no hay cámara, GPS, SQLite nativo
- Depende del Service Worker para caché y offline
- La app es literalmente un acceso directo a la PWA en modo pantalla completa
- No tienes control sobre el WebView configuration

**Veredicto:** PWABuilder es bueno para el **tier gratuito** (el cliente puede
instalar la app en su móvil sin pagar). Pero para el **tier Profesional** donde
se necesita cámara, GPS, y SQLite nativo, Capacitor es la opción correcta.

### Veredicto móvil

| Opción | SQLite nativo | Cámara/GPS | Facilidad | Recomendación |
|--------|--------------|-----------|-----------|---------------|
| **Capacitor** | ✅ plugin oficial | ✅ 70+ plugins | ⚠️ requiere SDK | **Tier Profesional** |
| **PWABuilder** | ❌ solo IndexedDB | ❌ solo web APIs | 🚀 CLI en la nube | **Tier Gratuito** (App básica) |
| **Cordova** | ✅ | ✅ (legacy) | ⚠️ legacy | No recomendado |
| **Tauri Mobile** | ⚠️ experimental | ⚠️ experimental | ❌ Rust | No ahora |

---

## 3. Alternativas a sql.js para SQLite en navegador

### sql.js (recomendado para Neutralino/.exe)

| Aspecto | sql.js | wa-sqlite | sql.js-httpvfs | OPFS directo |
|---------|--------|-----------|---------------|--------------|
| **Motor** | SQLite via WASM | SQLite via WASM | SQLite via WASM + Worker | File System Access API |
| **Peso WASM** | ~1.3MB | ~1.5MB | ~1.3MB + Worker | 0 (navegador) |
| **FTS5** | ✅ (compilar con flag) | ✅ nativo | ✅ | ❌ |
| **Persistencia** | `export()` → Uint8Array → IndexedDB (cíclico) | **OPFS nativo** (archivo real en disco) | Solo lectura (vía HTTP Range) | Archivos reales (OPFS) |
| **Velocidad escritura** | ⚠️ Lenta (ciclo export/import) | 🚀 Rápida (OPFS directo) | 🚀 Lectura (servido estático) | 🚀 Rápida |
| **Modo síncrono** | ✅ Sí (bloquea, usar Worker) | ⚠️ Async (requiere Asyncify) | ✅ Worker automático | ✅ Async API |
| **Compatibilidad** | ✅ Todos los navegadores | ⚠️ Chrome/Edge (OPFS) | ✅ Todos (solo lectura) | ⚠️ Solo Chrome 86+ |
| **file://** | ⚠️ Frágil (require `locateFile`) | ❌ No (OPFS requiere HTTPS) | ❌ No (requiere HTTP Range) | ❌ No (OPFS requiere HTTPS) |
| **Mantenimiento** | ✅ Activo (1.1.1, 2026) | ✅ Activo (1.1.1, Apr 2026) | ✅ Activo | Nativo del navegador |
| **Complejidad** | Baja | Media | Baja (solo lectura) | Alta |

### wa-sqlite — El competidor más fuerte

wa-sqlite es una alternativa moderna a sql.js con ventajas significativas:

```javascript
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite.mjs';
import * as SQLite from 'wa-sqlite';

async function initDB() {
  const module = await SQLiteESMFactory();
  const sqlite3 = SQLite.Factory(module);
  
  // OPFS VFS → persistencia real en disco (no cíclico)
  const db = await sqlite3.open_v2('myDB', undefined, 'opfs');
  
  await sqlite3.exec(db, `CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)`);
  await sqlite3.exec(db, `INSERT INTO test VALUES (1)`);
  await sqlite3.close(db);
}
```

**Ventajas de wa-sqlite sobre sql.js:**
1. **OPFS nativo** — los datos se guardan en archivos reales en el disco, no en IndexedDB
2. **No hay ciclo export/import** — datos persistentes sin copiar Uint8Array
3. **Async nativo** — no bloquea el hilo principal
4. **Múltiples VFS** — Memory, IndexedDB, OPFS, AccessHandlePool, Mirror
5. **Benchmarks** — wa-sqlite + OPFS es ~3-5x más rápido que sql.js + IndexedDB

**Desventajas:**
1. **OPFS solo en Chrome/Edge 86+** — Firefox y Safari no soportan OPFS completamente
2. **Requiere HTTPS** — OPFS no funciona en `file://` ni `localhost` sin flags
3. **API más compleja** — la API es más cercana al C de SQLite que sql.js

### Veredicto SQLite en navegador

| Opción | Persistencia | Velocidad | Compatibilidad | Recomendación |
|--------|-------------|-----------|---------------|---------------|
| **sql.js** | IndexedDB (cíclico) | ⚡ Buena | ✅ Todos los browsers + file:// (con cuidado) | **Tier Profesional (.exe)** |
| **wa-sqlite** | OPFS (disco real) | 🚀 Óptima | ⚠️ Chrome/Edge, HTTPS | **Future-proof** cuando OPFS sea universal |
| **sql.js-httpvfs** | Solo lectura (HTTP) | 🚀 Lectura | ✅ Todos | **Gratuito (GitHub Pages)** — BD readonly desde servidor |
| **Dexie (actual)** | IndexedDB | 🐢 2-3s QA | ✅ Todos | **Gratuito + fallback** |

### Nueva idea: sql.js-httpvfs para GitHub Pages (Gratuito)

Una alternativa interesante para el **tier gratuito (GitHub Pages)**:

```javascript
import { createDbWorker } from "sql.js-httpvfs";

// Usar una base SQLite pre-generada y subirla a GitHub Pages
// El worker la descarga vía HTTP Range Requests (parcial, solo lo necesario)
const worker = await createDbWorker(
  [{ serverMode: "full", url: "/data/ia-jutia.db" }],
  workerUrl, wasmUrl
);

// Consultas SQL directamente sobre la BD remota (solo lectura)
const result = await worker.db.exec(`
  SELECT * FROM chunks_fts WHERE texto MATCH ?
`, [query]);
```

Esto permitiría que **el tier gratuito tenga FTS5** sin sql.js en el cliente:
- La BD SQLite se genera durante el build y se sube a GitHub Pages
- sql.js-httpvfs la consulta con HTTP Range Requests (solo descarga lo necesario)
- El usuario nunca descarga la BD completa — solo los fragmentos que consulta
- **Limitación:** Solo lectura — no se pueden subir documentos nuevos

---

## 4. Mejoras para Transformers.js (IA Jutia)

### Estado actual

Transformers.js usa **ONNX Runtime Web** con backend **WASM** por defecto.
Los modelos se cargan desde `assets/models/` con `local: true`.

### Novedades descubiertas

#### 1. WebGPU acceleration (Transformers.js v3+)

```javascript
const pipe = await pipeline('question-answering', 'Xenova/bert-base-multilingual-uncased-squad', {
  device: 'webgpu',           // ← GPU acceleration
  dtype: 'q4'                 // ← 4-bit quantization (reduce modelo 4x)
});
```

**Impacto:** 
- WASM: QA en CPU → 200-500ms
- WebGPU: QA en GPU → **50-100ms** (comparable a FTS5 + SQLite)
- `dtype: 'q4'`: modelo de 150MB → ~38MB

**Disponibilidad:** 
- ✅ WebGPU ya estable en Chrome 113+, Edge 113+
- ⚠️ Firefox: en desarrollo (Nightly)
- ⚠️ Safari: no disponible

#### 2. Modelos más pequeños (distilación)

| Modelo | Tamaño original | q4 (4-bit) | Velocidad QA |
|--------|----------------|------------|-------------|
| `bert-base-multilingual-uncased-squad` | 150MB | **~38MB** | 200-500ms (WASM) / 50-100ms (WebGPU) |
| `distilbert-base-multilingual-cased` (alternativa) | 80MB | **~20MB** | 100-200ms (WASM) / 30-50ms (WebGPU) |
| `Xenova/mobilebert-uncased-squad-v2` (móvil) | 25MB | **~6MB** | 50-100ms (WASM) / 20-40ms (WebGPU) |

#### 3. Pipeline de summarization disponible

Transformers.js ahora soporta `summarization` pipeline:

```javascript
const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
const summary = await summarizer(docText, { max_length: 150 });
```

Esto permitiría **resumir documentos automáticamente** sin cargar un modelo
adicional (usa BART, ~200MB).

#### 4. Modelos más nuevos disponibles

Transformers.js ahora soporta cientos de modelos adicionales:
- **Gemma 3n** (Google) — modelos ligeros para mobile
- **Granite** (IBM) — modelos enterprise
- **Phi-3** (Microsoft) — modelos pequeños eficientes
- **DeepSeek** — modelos de código abierto

Para QA en español, `bert-base-multilingual-uncased-squad` sigue siendo la
mejor opción por su soporte multilingüe y tamaño moderado.

### Recomendaciones IA Jutia

| Mejora | Perfil | Impacto | Esfuerzo | Dependencias |
|--------|--------|---------|----------|-------------|
| **WebGPU acceleration** | .exe + WebView2 | QA 50-100ms 🚀 | Bajo (1 flag) | WebGPU en WebView2 (Chrome 113+) |
| **q4 quantization** | Todos | Modelos 4x más pequeños | Bajo (1 flag) | Ninguna |
| **Summarization pipeline** | Full | Resúmenes automáticos de documentos | Medio (~30 líneas) | Modelo BART (~200MB) |
| **Web Worker para pipelines** | Todos | UI no se congela durante QA | Medio (~50 líneas) | Ninguna |

---

## 5. Web Workers para descargar el hilo principal

### Problema actual

Actualmente, cuando IA Jutia ejecuta:
- `initLite()` hace `toArray()` de todas las tablas → bloquea UI
- `qa()` ejecuta Transformers.js → congela la UI 200-500ms
- Las estadísticas/predicciones se ejecutan en el hilo principal

### Solución con Web Workers

```javascript
// core/ia-worker.js
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;
  
  if (type === 'qa') {
    const { pregunta, chunks } = data;
    // Transformers.js dentro del Worker
    const pipe = await pipeline('question-answering', modelName);
    const result = await pipe(pregunta, chunks);
    self.postMessage({ type: 'qa-result', result });
  }
  
  if (type === 'stats') {
    const { values } = data;
    const media = values.reduce((a,b) => a+b, 0) / values.length;
    // ... cálculos pesados
    self.postMessage({ type: 'stats-result', result: { media, /* ... */ } });
  }
  
  if (type === 'embed') {
    const { texts } = data;
    const pipe = await pipeline('feature-extraction', modelName);
    const embeddings = await Promise.all(texts.map(t => pipe(t)));
    self.postMessage({ type: 'embed-result', embeddings });
  }
});
```

### Qué mover a Workers

| Operación | Tiempo actual | Worker | UI afectada |
|-----------|--------------|--------|-------------|
| QA con Transformers.js | 200-500ms | ✅ | ❌ No se congela |
| Cálculo de embeddings | 100-300ms | ✅ | ❌ No se congela |
| FlexSearch rebuild | 200-2000ms | ✅ | ❌ No se congela |
| Stats con `toArray()` | 50-500ms | ✅ | ❌ No se congela |
| Chunking de documentos | 10-100ms | ⚠️ Opcional | ❌ Casi imperceptible |

### Dependencias en Workers

**Problema:** Transformers.js en un Worker requiere cargar los modelos desde el Worker.

```javascript
// En el Worker, importar Transformers.js
importScripts('assets/js/libs/transformers.min.js');
// ⚠️ O usar ES6 module worker (requiere --enable-experimental-web-platform-features)

// Alternativa: usar el CDN de Transformers.js dentro del Worker
// pero esto viola la regla de no CDN del stack...

// Mejor alternativa: precargar los archivos del Worker
// y usar new Worker('core/ia-worker.js') con rutas relativas
```

**Nota:** Los Workers cargados desde `file://` no pueden importar scripts
adicionales fácilmente. En `file://`, `importScripts()` funciona con rutas
relativas, así que:

```javascript
// core/ia-worker.js
importScripts('../assets/js/libs/transformers.min.js');
// ✅ Funciona en file:// (rutas relativas al worker)
```

### Veredicto Web Workers

| Aspecto | Impacto |
|--------|---------|
| **UI responsiva** | ✅ La app nunca se congela durante QA |
| **Complejidad** | Media (~50 líneas de worker + mensajes) |
| **file://** | ⚠️ `importScripts` funciona con rutas relativas |
| **Transformers.js** | ✅ Funciona dentro de Worker vía `importScripts` |
| **Dependencias** | 0 (nativo del navegador) |

---

## 6. Tabla comparativa final

### Todas las opciones para cada capa

| Capa | Opción 1 | Opción 2 | Opción 3 | Opción 4 |
|------|----------|----------|----------|----------|
| **Desktop wrapper** | **NeutralinoJS** (~2MB) | **Tauri 2.x** (~5-15MB) | Electron (~150MB) | PWABuilder Win (~0.5MB) |
| **Mobile wrapper** | **Capacitor** (~5MB + SDK) | **PWABuilder** (~3MB, sin plugins) | Cordova (~8MB, legacy) | Tauri Mobile (experimental) |
| **SQLite browser** | **sql.js** (~1.3MB WASM) | **wa-sqlite** (~1.5MB, OPFS) | sql.js-httpvfs (solo lectura) | Dexie (sin SQL, actual) |
| **IA aceleración** | **WebGPU** (GPU, 50ms) | **q4 quantization** (4x menos) | WASM (CPU, 200ms) | Workers (no bloquea UI) |
| **Resúmenes IA** | **summarization pipeline** | — | — | — |

### Mapa por tier

```
GRATUITO (GitHub Pages + ZIP):
  Frontend:  Alpine + Dexie (sin cambios)
  Desktop:   ❌ No aplica (es web)
  Mobile:    PWABuilder (PWA installable, sin plugins nativos)
  SQLite:    ❌ Dexie optimizado (el plan anterior)
  IA:        Lite (FlexSearch + stats + predicciones)
  Workers:   ✅ (evita congelar UI)

PROFESIONAL (.exe):
  Desktop:   NeutralinoJS (~2MB)
  Mobile:    ❌ No aplica
  SQLite:    sql.js con FTS5 (chunks de IA en SQLite)
  IA:        Full con FTS5 + WebGPU + q4
  Workers:   ✅ (Transformers.js en Worker)

PROFESIONAL (.apk):
  Desktop:   ❌ No aplica
  Mobile:    Capacitor + @capacitor-community/sqlite
  SQLite:    Plugin nativo (FTS5, sin WASM)
  IA:        Full con FTS5 + WebGPU (si disponible) + q4
  Workers:   ✅

ENTERPRISE (.exe + .apk + src + WL):
  = Profesional (.exe + .apk) + código fuente + white-label
  IA:        Todos los anteriores + summarization pipeline
```

---

## 7. Recomendaciones consolidadas

### Resumen de tecnologías

| Tecnología | Rol | ¿Usar? | Por qué |
|-----------|-----|--------|---------|
| **NeutralinoJS** | Desktop wrapper | ✅ **Sí** | 2MB, sin Chromium, mismo HTML/JS |
| **Tauri 2.x** | Desktop wrapper (futuro) | ⏳ Más adelante | Cuando se necesiten más APIs nativas o SQLite plugin oficial |
| **Capacitor** | Mobile wrapper (.apk) | ✅ **Sí** | Único con SQLite nativo + plugins de cámara/GPS maduros |
| **PWABuilder** | Mobile alternativo gratuito | ✅ Para tier Gratuito | Sin SDK, sin plugins, app básica instalable |
| **sql.js** | SQLite en navegador (.exe) | ✅ **Sí** | FTS5, compatible con WebView2, 1.3MB |
| **wa-sqlite** | SQLite futuro | ⏳ Más adelante | OPFS es superior, pero requiere Chrome/HTTPS |
| **sql.js-httpvfs** | BD readonly en GitHub Pages | ✅ Para Gratuito | FTS5 sin descargar BD completa, HTTP Range |
| **WebGPU** | IA acceleration | ✅ **Sí** | 4x más rápido, 1 flag de código |
| **q4 quantization** | Modelos 4x más pequeños | ✅ **Sí** | Reduce 150MB → 38MB, casi sin pérdida |
| **Web Workers** | UI no bloqueante | ✅ **Sí** | La app nunca se congela |
| **Summarization** | Resúmenes de documentos | ⏳ Más adelante | Requiere modelo BART ~200MB extra |

### Orden de implementación sugerido

```
FASE 0 (Semana 1-2) — Dexie optimizado + Web Workers
  ├── Paginar chunks, count() en stats, indexación incremental
  ├── Web Worker para Transformers.js (UI no se congela)
  └── q4 quantization en modelos (150MB → 38MB)

FASE 1 (Semana 3-4) — Neutralino (reemplaza Bun .exe)
  ├── NeutralinoJS: ~2MB, ventana nativa, bandeja, notificaciones
  └── WebGPU para QA (50ms en WebView2 de Edge)

FASE 2 (Semana 5-6) — SQLite para IA Jutia
  ├── sql.js con FTS5 para chunks (.exe)
  └── Dexie como fallback (Gratuito + Lite)

FASE 3 (Semana 7-10) — Capacitor (.apk)
  ├── Capacitor + @capacitor-community/sqlite (FTS5 nativo)
  ├── Plugins: cámara, GPS, notificaciones
  └── PWABuilder para tier Gratuito (opcional)

FASE 4 (Semana 11-12) — Enterprise
  ├── White-label (rebranding script)
  └── Summarization pipeline (opcional)
```

### Diagrama de decisión

```
¿Qué perfil necesitas?
│
├─ Gratuito (evaluación, prueba):
│   └── GitHub Pages + Dexie optimizado + PWABuilder (mobile básico)
│       IA: Lite + Web Workers + q4
│
├─ Profesional (.exe escritorio):
│   └── NeutralinoJS + sql.js (FTS5)
│       IA: Full + WebGPU + Workers + q4
│
├─ Profesional (.apk Android):
│   └── Capacitor + @capacitor-community/sqlite (FTS5 nativo)
│       IA: Full + WebGPU + Workers + q4
│
├─ Profesional (ambos):
│   └── NeutralinoJS + Capacitor (mismo código base)
│       IA: Full + FTS5 + WebGPU + Workers + q4
│
└─ Enterprise:
    └── = Profesional + código fuente + white-label + summarization
```

---

*Documento generado con información de Context7, documentación oficial
de NeutralinoJS, Capacitor, sql.js, wa-sqlite, Transformers.js y PWABuilder.
Abril 2026.*
