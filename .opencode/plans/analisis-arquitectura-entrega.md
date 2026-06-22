# Análisis de Arquitectura de Entrega: .exe, .apk y el futuro del Stack Ateje

---

## Índice

1. [El problema actual](#1-el-problema-actual)
2. [NeutralinoJS — Desktop nativo](#2-neutralinojs--desktop-nativo)
3. [Capacitor — Android nativo (.apk)](#3-capacitor--android-nativo-apk)
4. [Comparativa: Bun vs Neutralino vs Tauri vs Electron](#4-comparativa-bun-vs-neutralino-vs-tauri-vs-electron)
5. [Nueva arquitectura propuesta](#5-nueva-arquitectura-propuesta)
6. [IA Jutia y SQLite en la nueva arquitectura](#6-ia-jutia-y-sqlite-en-la-nueva-arquitectura)
7. [Ruta de migración](#7-ruta-de-migración)
8. [Recomendaciones finales](#8-recomendaciones-finales)

---

## 1. El problema actual

### Cómo se entrega hoy

| Perfil | Mecanismo | Experiencia de usuario |
|--------|-----------|----------------------|
| **Lite** | ZIP de HTML → doble clic en `index.html` | Se abre en navegador vía `file://` |
| **Full** | `bun build --compile` → `.exe` | Abre terminal → usuario va a `localhost:3000` en su navegador |
| **.apk** | No existe | — |

### Problemas identificados

**Lite (file://):**
- `file://` tiene restricciones CORS → prohibido ES6 modules, WASM frágil
- No hay Service Workers (requieren HTTPS o localhost)
- La experiencia es "abrir una carpeta", no "usar una app"
- El navegador puede aplicar cuotas de almacenamiento diferentes
- No hay icono en el escritorio, no hay "app" para el usuario

**Full (bun --compile .exe):**
- No es una app de escritorio real — es un servidor HTTP
- El usuario ve una terminal negra — UX pobre para un producto pago
- Depende del navegador del usuario (Chrome, Edge, Firefox — todos se comportan diferente)
- 50MB por incluir el runtime Bun completo (JavaScriptCore) cuando el frontend es HTML estático
- No hay APIs nativas: notificaciones, bandeja del sistema, atajos globales

**.apk:**
- Prometido comercialmente pero con 0% de implementación
- No hay pipeline, no hay skill, no hay GitHub Action que lo genere
- Las funcionalidades que dependen de .apk (cámara, GPS, QR) no son posibles hoy

---

## 2. NeutralinoJS — Desktop nativo

### ¿Qué es?

NeutralinoJS es un framework para construir aplicaciones de escritorio nativas
usando tecnologías web (HTML + CSS + JS). A diferencia de Electron, **NO incluye
Chromium** — usa el WebView del sistema operativo:

| SO | WebView usado |
|----|--------------|
| Windows | WebView2 (Edge Chromium) |
| macOS | WKWebView (Safari) |
| Linux | WebKitGTK |

El runtime de Neutralino pesa **~2MB** (vs ~50MB del runtime Bun empacado).

### Arquitectura

```
┌─────────────────────────────────────┐
│         Neutralino App (~2MB)       │
│  ┌──────────────────────────────┐   │
│  │     WebView del SO           │   │
│  │  ┌────────────────────────┐  │   │
│  │  │  index.html            │  │   │
│  │  │  (Alpine + Dexie + IA) │  │   │
│  │  └────────────────────────┘  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Neutralino API (Neu)        │   │
│  │  ┌────────────────────────┐  │   │
│  │  │ Filesystem            │  │   │
│  │  │ OS (tray, notif)      │  │   │
│  │  │ Computer (info, exec) │  │   │
│  │  │ Storage (KV nativo)   │  │   │
│  │  │ Window (native)       │  │   │
│  │  │ Clipboard             │  │   │
│  │  │ Extensions (custom)   │  │   │
│  │  └────────────────────────┘  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Ventajas vs el Bun .exe actual

| Aspecto | Bun --compile (actual) | NeutralinoJS |
|---------|----------------------|--------------|
| **Experiencia** | Terminal + navegador | Ventana nativa real |
| **Peso** | ~50 MB | ~2 MB |
| **Icono en barra** | ❌ | ✅ |
| **Bandeja sistema** | ❌ | ✅ (`os.showTray()`) |
| **Notificaciones** | ❌ | ✅ (`os.showNotification()`) |
| **Atajos teclado** | Solo en página web | ✅ (`globalShortcut`) |
| **File System** | Solo Dexie | Nativo + Dexie |
| **SQLite** | `bun:sqlite` (requiere servidor) | Extensión C++ nativa |
| **Distribución** | .exe de 50MB | .exe de 2MB + `public/` |
| **Actualizaciones** | Manual | `update.check()` integrado |
| **Protección IP** | Ofuscación Bun | Ofuscación + binario nativo |
| **Complejidad** | Media | Baja |
| **Documentación** | — | [neutralino.js.org](https://neutralino.js.org) |

### Desventajas

1. **Dependencia del WebView del SO** — El comportamiento varía: Windows usa
   Edge Chromium (buen soporte), Linux puede tener WebKit antiguo (menos soporte).
   - Windows: WebView2 se instala automáticamente en Windows 11, requiere
     redistribuible en Windows 10
   - macOS: WKWebView es nativo, funciona siempre
   - Linux: WebKitGTK puede no estar instalado

2. **Sin Service Workers** — El WebView de sistema no siempre soporta SW
   (depende del SO). En Windows con WebView2 sí funciona.

3. **Extensiones nativas en C++** — Para funcionalidades no incluidas, hay que
   escribir extensiones en C++ y compilarlas para cada SO. Mayor esfuerzo que
   un plugin npm.

4. **Comunidad más pequeña** — Neutralino tiene menos adopción que Electron o
   Tauri. Menos ejemplos, menos plugins, menos tutoriales.

5. **DevTools** — Neutralino incluye Chrome DevTools pero requieren habilitarse
   con flag `--debug-mode`. No están disponibles por defecto.

### ¿Qué mejora específicamente para IA Jutia?

Con Neutralino, el WebView es Chromium (Edge) en Windows, que tiene excelente
soporte para:

- **WASM 100% confiable** → sql.js funciona sin restricciones de `file://`
- **Web Workers** → cálculos de embeddings sin bloquear UI
- **IndexedDB** → Dexie funciona igual que hoy
- **OPFS** (Origin Private File System) → almacenamiento de archivos grande

Además, Neutralino permite:

- **SQLite vía extensión C++** → más rápido que sql.js (WASM) porque es nativo
- **File System nativo** → leer/guardar archivos directamente sin drag & drop
- **Almacenamiento persistente** en disco real (no sujeto a cuotas del navegador)

---

## 3. Capacitor — Android nativo (.apk)

### ¿Qué es?

Capacitor es un framework de Ionic para construir aplicaciones móviles nativas
(iOS y Android) con tecnologías web. Es el sucesor moderno de Cordova.

**NO confundir con:**
- **Cordova** — Predecesor (más pesado, menos mantenido)
- **React Native** — Renderiza componentes nativos (no es web)
- **Flutter** — Renderiza su propio motor (no es web)

Capacitor es esencialmente un **WebView a pantalla completa** con un puente
hacia APIs nativas:

```
┌─────────────────────────────────────┐
│         .apk (Capacitor)            │
│  ┌──────────────────────────────┐   │
│  │  Android WebView             │   │
│  │  ┌────────────────────────┐  │   │
│  │  │  index.html            │  │   │
│  │  │  (mismo que escritorio)│  │   │
│  │  └────────────────────────┘  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Capacitor Plugins           │   │
│  │  ┌────────────────────────┐  │   │
│  │  │ Camera                │  │   │
│  │  │ Geolocation           │  │   │
│  │  │ Filesystem            │  │   │
│  │  │ Share                 │  │   │
│  │  │ SQLite (community)    │  │   │
│  │  │ Barcode Scanner       │  │   │
│  │  │ Local Notifications   │  │   │
│  │  └────────────────────────┘  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Ventajas

| Aspecto | Sin Capacitor (hoy) | Con Capacitor |
|---------|-------------------|---------------|
| **.apk real** | ❌ No existe | ✅ Generación nativa |
| **Cámara** | ❌ No disponible | ✅ `Camera.getPhoto()` |
| **GPS** | ❌ No disponible | ✅ `Geolocation.getCurrentPosition()` |
| **QR/Barcode** | ❌ No disponible | ✅ `BarcodeScanner.scan()` |
| **SQLite nativo** | ❌ | ✅ `@capacitor-community/sqlite` |
| **Notificaciones push** | ❌ | ✅ Local + push |
| **Compartir nativo** | ❌ | ✅ `Share.share()` |
| **Haptics** | ❌ | ✅ `Haptics.vibrate()` |
| **Código compartido** | — | ~95% mismo HTML/JS que escritorio |
| **Google Play Store** | ❌ | ✅ Publicable |
| **Build pipeline** | ❌ | `npx cap sync android` + Gradle |

### ¿Qué se reutiliza del stack actual?

```
📦 app/
├── public/                    ← 95% se reutiliza TAL CUAL
│   ├── index.html             ← ✅ mismo
│   ├── core/                  ← ✅ db.js, ia.js, crypto.js, ui.js
│   ├── modules/               ← ✅ ia-jutia, etc.
│   └── assets/                ← ✅ CSS, JS libs, modelos IA
├── android/                   ← Generado por Capacitor
│   ├── app/                   ← Config de la app nativa
│   └── build.gradle           ← Build de Android
├── src/                       ← Solo para escritorio
│   └── index.js               ← No se usa en Android
└── package.json               ← Se mantiene
```

**Lo que NO se reutiliza:**
- `src/index.js` (Bun server) — en Android no hay servidor HTTP local
- `core/sync.js` (export/import .ateje-backup) — se reemplaza por SQLite
- `core/network.js` — en Android hay conectividad real, no necesita syncQueue

### Desventajas de Capacitor

1. **WebView Android no es Chromium completo** — El WebView de Android es
   Chrome pero con algunas limitaciones:
   - ES6 modules: ✅ Soportado desde Android 5
   - WASM: ✅ Soportado desde Android 8 (Chrome 57+)
   - Web Workers: ✅ Soportado
   - IndexedDB: ✅ Soportado pero límites variables
   - Service Workers: ✅ Requiere HTTPS (localhost en dev funciona)

2. **Plugins nativos requieren configuración** — No todo funciona out-of-the-box.
   `@capacitor-community/sqlite` requiere configurar el SQLite nativo con
   compilación para ARM/x86.

3. **Build requiere Android SDK** — Para generar el .apk necesitas:
   - Android Studio (o command line tools)
   - SDK 33+
   - Gradle
   - JDK 17
   - En CI: `android-build` GitHub Action

4. **Peso del .apk** — App base ~5MB + modelos IA (~230MB) = **.apk enorme**
   - Solución: descargar modelos ONNX bajo demanda (como hace el perfil Full
     hoy, descarga única en setup)

5. **File:// no existe** — En Android todo es `http://localhost` (Capacitor
   corre un servidor local). Las rutas relativas funcionan igual.

---

## 4. Comparativa: Bun vs Neutralino vs Tauri vs Electron

| Característica | **Bun --compile** (actual) | **NeutralinoJS** | **Tauri** | **Electron** |
|---|---|---|---|---|
| **Peso app** | ~50 MB | ~2 MB | ~5-15 MB | ~150 MB |
| **Runtime** | JavaScriptCore (Bun) | WebView del SO | WebView del SO | Chromium completo |
| **RAM consumo** | ~40 MB (Bun) + ~200 MB (Chrome) | ~80 MB (solo WebView) | ~80 MB | ~250 MB |
| **Ventana nativa** | ❌ (es servidor) | ✅ | ✅ | ✅ |
| **Bandeja sistema** | ❌ | ✅ | ✅ | ✅ |
| **Notificaciones** | ❌ | ✅ | ✅ | ✅ |
| **SQLite nativo** | ✅ bun:sqlite | ✅ Extensión C++ | ✅ rust-side | ✅ better-sqlite3 |
| **APIs nativas** | ❌ | 15+ integradas | Ilimitadas (Rust) | Ilimitadas (Node) |
| **Actualización** | Manual | ✅ integrada | ✅ integrada | ✅ electron-updater |
| **Código reutilizable** | ~95% | ~95% (mismo frontend) | ~95% (mismo frontend) | ~95% |
| **Complejidad migración** | — | **Baja** | Media-alta | Baja |
| **Comunidad** | Pequeña (Bun) | Pequeña | Grande (creciendo) | **Enorme** |
| **Windows** | ✅ | ✅ (WebView2) | ✅ (WebView2) | ✅ |
| **macOS** | ✅ | ✅ | ✅ | ✅ |
| **Linux** | ❌ (Bun tiene issues) | ✅ (WebKitGTK) | ✅ | ✅ |
| **Android** | ❌ | ❌ | ✅ (Tauri Mobile, experimental) | ❌ |
| **iOS** | ❌ | ❌ | ✅ (Tauri Mobile) | ❌ |
| **Licencia** | MIT | MIT | MIT | MIT |

### ¿Por qué Neutralino y no Tauri?

Tauri es más potente (Rust, más APIs nativas, soporte móvil experimental), pero:

1. **Requiere Rust** — El desarrollador necesita instalar Rust, entender Cargo,
   compilar para cada target. El stack Ateje es JS puro — agregar Rust es un
   salto grande de complejidad.

2. **Tauri Mobile es experimental** — Tauri 2.0 tiene soporte mobile pero está
   en maduración. Capacitor es más maduro y documentado para Android.

3. **Neutralino es más ligero** — 2MB vs 5-15MB. Para una app que es 95% HTML,
   Neutralino es suficiente. No necesitas el poder de Rust para envolver
   Alpine.js en una ventana.

4. **Migración más simple** — Neutralino usa el mismo HTML/JS sin cambios.
   Solo agregas `neutralino.config.json`. Tauri requiere configurar
   `tauri.conf.json` y build.rs en Rust.

**Recomendación:** Neutralino para escritorio (reemplazo directo de Bun .exe)
con opción a migrar a Tauri en el futuro si se necesita más potencia nativa.

### ¿Por qué Neutralino y no Electron?

Electron es el más conocido pero:

1. **150MB por app** — Inaceptable para una app que es HTML + JS
2. **250MB RAM** — Cada app Electron corre Chromium completo
3. **Obsolescencia percibida** — El mercado se mueve hacia alternativas más
   ligeras (Tauri, Neutralino)

---

## 5. Nueva arquitectura propuesta

### Visión general

```
┌──────────────────────────────────────────────────────────────┐
│                    CÓDIGO BASE ÚNICO                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  public/                                                │  │
│  │  ├── index.html         (Alpine + DaisyUI)             │  │
│  │  ├── core/db.js         (Dexie — siempre presente)     │  │
│  │  ├── core/ia.js         (IA Jutia — adaptable)         │  │
│  │  ├── modules/*          (Módulos de la app)            │  │
│  │  └── assets/*           (CSS, JS libs, modelos ONNX)   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Gratuito  │ │ Profes.  │ │ Enterprise│
   │ (Web)     │ │ (.exe)   │ │ (.exe    │
   │           │ │ (.apk)   │ │  + .apk  │
   │           │ │          │ │  + src   │
   │           │ │          │ │  + WL)   │
   └──────────┘ └──────────┘ └──────────┘
```

### Tier Gratuito (antes "Lite")

| Aspecto | Descripción |
|---------|-------------|
| **Entrega** | GitHub Pages + ZIP descargable |
| **Runtime** | Navegador (Chrome/Edge/Firefox) vía HTTPS (Pages) o `file://` (ZIP) |
| **DB** | Dexie (IndexedDB) |
| **IA Jutia** | Lite (FlexSearch + stats + predicciones) |
| **SQLite** | No |
| **Costo** | $0 (GitHub Pages gratis) |
| **Propósito** | Evaluación, prueba, uso básico |
| **Límite** | Sin respaldo automático, sin sync, sin SQLite |

**Para qué sirve:**
- El cliente potencial hace clic en un enlace de GitHub Pages y ve la app
  funcionando al instante
- Puede probar todas las funcionalidades básicas
- Los datos se guardan en IndexedDB (persisten en el navegador)
- Si le gusta, compra la versión Profesional o Enterprise
- También se distribuye como ZIP para uso offline sin servidor

### Tier Profesional

| Aspecto | Escritorio | Android |
|---------|-----------|---------|
| **Framework** | NeutralinoJS | Capacitor |
| **Entrega** | `.exe` (~2MB runtime + `public/`) | `.apk` (~5MB base + modelos bajo demanda) |
| **DB** | Dexie + sql.js (IA Jutia) | Dexie + SQLite nativo (plugin) |
| **IA Jutia** | Full con FTS5 (sql.js WASM) | Full con FTS5 (plugin nativo) |
| **APIs nativas** | File system, notificaciones, bandeja | Cámara, GPS, QR, notificaciones, compartir |
| **Respaldos** | Export/import + sql.js export | SQLite backup nativo |
| **Distribución** | .exe descargable + GitHub Release | Google Play Store / APK directo |

### Tier Enterprise

= Profesional +:

- **Código fuente completo** del proyecto generado (sin compilar)
- **White-label**: nombre de app, logo, colores de marca personalizados
- **Dominio personalizado** para GitHub Pages (si aplica)
- **Soporte prioritario** y personalización de módulos
- **Build personalizado**: icono del .exe, splash screen, nombre de proceso

---

## 6. IA Jutia y SQLite en la nueva arquitectura

### Mapa de almacenamiento por tier

| Componente | Gratuito (Web) | Profesional (.exe) | Profesional (.apk) |
|------------|---------------|-------------------|-------------------|
| **Datos de la app** | Dexie (IndexedDB) | Dexie (IndexedDB) | Dexie (IndexedDB) |
| **Chunks de IA** | Dexie `_ia_chunks` | **SQLite** (FTS5) | **SQLite nativo** (FTS5) |
| **Embeddings** | JSON en IndexedDB | **BLOB en SQLite** | **BLOB en SQLite** |
| **Índice búsqueda** | FlexSearch (RAM) | **FTS5 persistente** | **FTS5 persistente** |
| **Documentos** | Dexie `_ia_docs` | Dexie `_ia_docs` | Dexie `_ia_docs` |

### Flujo de IA Jutia en Profesional (.exe con Neutralino + sql.js)

```
  Neutralino WebView (Edge Chromium)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Usuario sube PDF / DOCX                                 │
│       │                                                  │
│       ▼                                                  │
│  Transformers.js (en Web Worker)                         │
│       │  ← no bloquea la UI                              │
│       ▼                                                  │
│  chunk(texto, 512, 64)                                   │
│       │                                                  │
│       ├──→ SQLite (FTS5):                                │
│       │    INSERT INTO chunks_fts(texto, docId)           │
│       │    VALUES(chunkText, docId)                       │
│       │                                                   │
│       ├──→ SQLite (embeddings):                           │
│       │    INSERT INTO chunk_embeddings(id, vector)       │
│       │    VALUES(chunkId, ?)  — BLOB de floats          │
│       │                                                   │
│       └──→ Dexie: _ia_docs (metadata del documento)      │
│                                                          │
│  Usuario pregunta: "¿Cuál es el total?"                  │
│       │                                                  │
│       ▼                                                  │
│  FTS5: SELECT texto FROM chunks_fts                      │
│        WHERE texto MATCH 'total'                         │
│        LIMIT 5                                           │
│       │  ← 10-50ms, indexado en disco                    │
│       ▼                                                  │
│  BERT QA pipeline sobre top-5 chunks                     │
│       │                                                  │
│       ▼                                                  │
│  Respuesta: "El total es $15,230"                        │
│  Fuente: "factura.pdf" · confianza: 94%                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### ¿sql.js o extensión nativa para el .exe?

En Neutralino hay dos opciones para SQLite:

| Opción | Mecanismo | Peso | Velocidad | Complejidad |
|--------|-----------|------|-----------|-------------|
| **sql.js (WASM)** | En el frontend, dentro del WebView | ~1.3MB extra | ⚡ Buena (50-150ms QA) | Baja — misma lógica que web |
| **Extensión C++** | En el backend Neutralino (API nativa) | ~100KB | 🚀 Óptima (30-80ms QA) | Alta — compilar para cada SO |

**Recomendación:** Empezar con **sql.js**. El WebView de Edge Chromium en
Windows soporta WASM sin restricciones. La lógica es la misma que correría
en el navegador web. Cuando la app tenga tracción, se puede migrar a
extensión C++ nativa para velocidad máxima.

### ¿sql.js o plugin nativo para el .apk?

En Capacitor solo hay una opción real:

| Opción | Funciona | Velocidad | Persistencia |
|--------|----------|-----------|-------------|
| **@capacitor-community/sqlite** | ✅ Nativo ARM/x86 | 🚀 Óptima | ✅ Archivo .db real |
| sql.js (WASM) | ❌ No recomendado (WASM en WebView Android es lento) | 🐢 | ❌ En memoria |

**Recomendación:** Usar `@capacitor-community/sqlite` directamente. Es un
plugin nativo que expone SQLite al JavaScript. No pasa por WASM.

### Comparativa de velocidad (chunks de IA)

Estimaciones para 10,000 chunks (~500 páginas de documento):

| Operación | Dexie (hoy) | Dexie optimizado | SQLite FTS5 (sql.js) | SQLite nativo (plugin/ext) |
|-----------|------------|------------------|----------------------|---------------------------|
| QA completo | 2-3s | 200-500ms | **50-150ms** | **30-80ms** |
| Búsqueda texto | FlexSearch (instantáneo en RAM) | FlexSearch | FTS5 10-20ms | FTS5 5-10ms |
| Stats agregados | 500ms (JS reduce) | 10-50ms (Dexie count) | **1-5ms** | **<1ms** |
| Carga de modelos IA | 1-2s (Transformers.js) | 1-2s | 1-2s + WASM init 300ms | 1-2s |
| FlexSearch rebuild | 500ms-2s (en cada carga) | 200ms | **0** (FTS5 es persistente) | **0** |

---

## 7. Ruta de migración

### Fase 0 — Inmediata (Dexie optimizado, todos los tiers)

```
Semana 1-2:
  ├── Paginar chunks en QA (limit + offset en _ia_chunks)
  ├── Usar count() en statsAll en vez de toArray()
  ├── Indexación incremental de FlexSearch (evitar duplicados)
  └── remove() en FlexSearch al borrar documentos
```

- **Objetivo:** Reducir QA de 2-3s a 200-500ms
- **Perfiles:** Todos (Gratuito/Profesional/Enterprise)
- **Dependencias nuevas:** 0
- **Riesgo:** Mínimo

### Fase 1 — Neutralino (reemplaza Bun .exe)

```
Semana 3-4:
  ├── npm install -g @neutralinojs/neu
  ├── neu create ateje-app --template minimal
  ├── Copiar public/ completo al proyecto Neutralino
  ├── Configurar neutralino.config.json:
  │     ├── documentRoot: "public/"
  │     ├── nativeWindow: { title: "AppName", icon: "icon.png" }
  │     └── enableServer: false
  ├── Probar: neu run (ver app en ventana nativa)
  ├── Agregar APIs nativas:
  │     ├── Notificaciones: Neu.os.showNotification()
  │     ├── Bandeja sistema: Neu.os.showTray() con menú
  │     └── File dialog: Neu.filesystem.showOpenDialog()
  └── Compilar: neu build --release
```

**Resultado:** `dist/AppName-win_x64.zip` (~2MB runtime + `public/`)

### Fase 2 — SQLite para IA Jutia (sql.js en .exe)

```
Semana 5-6:
  ├── Descargar sql.js a assets/wasm/ (via setup-init)
  ├── En ia.js: initSQLite() → CREATE TABLE IF NOT EXISTS
  │     CREATE VIRTUAL TABLE chunks_fts USING fts5(texto, docId);
  │     CREATE TABLE chunk_embeddings(id TEXT, vector BLOB);
  ├── indexDocument(): guardar chunks en sql.js + metadata en Dexie
  ├── qa(): SELECT ... FROM chunks_fts WHERE texto MATCH ? LIMIT 3
  ├── Persistencia sql.js → Dexie (export/load cíclico):
  │     const data = db.export();
  │     await dexieDb._ia_sqlite.put({ id:'snapshot', data: [...data] });
  │     Al iniciar: cargar desde Dexie → sql.js
  ├── Detección: si sql.js disponible → usarlo; si no → Dexie fallback
  └── Backup: incluir _ia_sqlite en export/import
```

### Fase 3 — Capacitor (.apk)

```
Semana 7-10:
  ├── npm install @capacitor/core @capacitor/cli
  ├── npx cap init "AppName" "com.empresa.app"
  ├── Configurar webDir: "public"
  ├── npm install @capacitor-community/sqlite
  │     └── FTS5: CREATE VIRTUAL TABLE chunks_fts USING fts5(...)
  ├── npm install @capacitor/camera @capacitor/geolocation
  │     └── Adaptar módulo de cámara/QR para usar plugin
  ├── npm install @capacitor/share @capacitor/local-notifications
  ├── npx cap sync android
  ├── Probar: npx cap open android → run en emulador
  ├── Detectar Capacitor en JS:
  │     if (typeof Capacitor !== 'undefined') {
  │       // Usar plugins nativos
  │     } else {
  │       // Fallback web (mostrar input file en vez de cámara)
  │     }
  └── Build .apk:
        cd android && ./gradlew assembleRelease
```

**GitHub Action para build automático:**
```yaml
- name: Build APK
  run: |
    npx cap sync android
    cd android
    ./gradlew assembleRelease
- name: Upload APK
  uses: actions/upload-artifact@v4
  with:
    name: app-release.apk
    path: android/app/build/outputs/apk/release/app-release.apk
```

### Fase 4 — Enterprise (white-label)

```
Semana 11-12:
  ├── Script de rebranding CLI:
  │     node scripts/rebrand.js --name "ClienteApp" --logo logo.png
  │     → Reemplaza nombre en index.html
  │     → Reemplaza logo en assets/
  │     → Reemplaza colores en theme.js (tokens DaisyUI)
  │     → Reemplaza icono .exe en Neutralino
  ├── Selección de módulos:
  │     node scripts/select-modules.js --modules "ventas,inventario"
  │     → Incluye solo módulos contratados
  ├── Código fuente: zip del proyecto completo (sin compilar)
  └── Documentación de personalización en docs/white-label.md
```

---

## 8. Recomendaciones finales

### Hacer ahora (Semana 1-2)

| Acción | Por qué |
|--------|---------|
| ✅ **Optimizar Dexie** (paginación, count, indexación incremental) | Beneficio inmediato para todos los tiers. 0 dependencias. |
| ✅ **Probar Neutralino** con la app actual | Validar que el WebView del SO funciona con Alpine + Dexie + IA. Riesgo mínimo. |
| ✅ **Probar sql.js** en Neutralino (localhost) | Validar WASM + FTS5 antes de integrar al pipeline. |

### Hacer después (Semanas 3-6)

| Acción | Por qué |
|--------|---------|
| ✅ **Migrar .exe a Neutralino** | Mejor UX que terminal + navegador. Pasa de 50MB a ~2MB. |
| ✅ **Integrar sql.js** para chunks de IA | QA 50-150ms vs 200-500ms. FTS5 persistente. |
| ✅ **Mantener Dexie como fallback** | Compatibilidad con tier web/gratuito. |

### Hacer a medio plazo (Semanas 7-10)

| Acción | Por qué |
|--------|---------|
| ✅ **Implementar Capacitor** para .apk | Primer .apk real. Sin esto, el producto prometido no existe. |
| ✅ **Plugin SQLite nativo** en Android | Mejor rendimiento que sql.js en móvil. |
| ✅ **GitHub Action** para build .apk | Build reproducible sin máquina local. |

### No hacer (a menos que sea necesario)

| Acción | Por qué |
|--------|---------|
| ❌ **Electron** | 150MB, RAM alta, stack legacy. Neutralino hace lo mismo con 2MB. |
| ❌ **Tauri (ahora)** | Requiere Rust, complejidad alta para el equipo. Neutralino es más simple. |
| ❌ **React Native / Flutter** | Reescritura completa. El HTML/JS actual funciona en WebView. |
| ❌ **Reemplazar Dexie completamente** | Dexie es simple y suficiente para datos de la app. Solo IA necesita SQLite. |

### Resumen visual de la arquitectura final

```
                           CÓDIGO BASE
                        (public/index.html)
                     Alpine + Dexie + DAISYUI
                              │
            ┌─────────────────┼─────────────────┐
            ▼                  ▼                  ▼
     ┌────────────┐    ┌──────────────┐    ┌──────────────┐
     │ GITHUB     │    │ NEUTRALINO   │    │ CAPACITOR    │
     │ PAGES      │    │ (.exe)       │    │ (.apk)       │
     ├────────────┤    ├──────────────┤    ├──────────────┤
     │ Gratuito   │    │ Profesional  │    │ Profesional  │
     │ (Inicio)   │    │              │    │              │
     │            │    │              │    │              │
     │ DB: Dexie  │    │ DB: Dexie    │    │ DB: Dexie    │
     │ IA: Lite   │    │     + sql.js │    │     + SQLite │
     │ (FlexS)    │    │ IA: Full+FTS5│    │ IA: Full+FTS5│
     │            │    │              │    │              │
     │ Sin APIs   │    │ APIs:        │    │ APIs:        │
     │ nativas    │    │  Notif, tray │    │  Cámara, GPS │
     │            │    │  File system │    │  QR, Compartir│
     └────────────┘    └──────────────┘    └──────────────┘
                              │                    │
                              └────────┬───────────┘
                                       ▼
                              ┌──────────────┐
                              │  ENTERPRISE  │
                              ├──────────────┤
                              │ = Profesional│
                              │ + Código     │
                              │ + White-label│
                              │ + Soporte    │
                              └──────────────┘
```

### Conclusión

El stack Ateje tiene una base sólida (Alpine + Dexie + DaisyUI + IA Jutia).
El problema no es el código de la app — es **cómo se entrega al cliente**.

Los cambios necesarios son en la capa de empaquetado, no en la lógica de la app:

1. **Neutralino** envuelve el mismo HTML/JS en una ventana nativa de escritorio
   (reemplaza el Bun .exe actual). Pasa de 50MB a ~2MB, y de "terminal + navegador"
   a una app con ventana, bandeja y notificaciones.

2. **Capacitor** envuelve el mismo HTML/JS en un WebView Android para generar
   el .apk prometido. Agrega APIs nativas (cámara, GPS, QR) sin reescribir nada.

3. **SQLite** (sql.js en .exe, plugin nativo en .apk) potencia IA Jutia donde
   más lo necesita: FTS5 para búsqueda de texto en chunks y BLOB para embeddings.
   Reduce el QA de 2-3s a 50-150ms.

4. **Dexie se queda** para los datos de la app y como fallback para el tier
   gratuito/web. No se reemplaza — se complementa.

5. **GitHub Pages** se convierte en el escaparate gratuito: el cliente ve la app
   funcionando sin instalar nada. Si le gusta, compra el .exe o .apk.

---

*Documento generado para análisis del stack Ateje.*
*Fechas y semanas son estimaciones conceptuales.*
