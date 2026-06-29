# Ateje Stack — Documentacion Completa

> **Stack**: Offline-first Skill-Layer Architecture
> **Version**: 3.0
> **Autor**: Angel Hernandez — ahaguilera.dev
> **Repo**: `https://github.com/ahaguilera/ateje` (meta-repo de skills OpenCode)

---

## 1. Que es Ateje Stack

Ateje Stack es un **meta-repo de skills OpenCode** que genera aplicaciones
offline-first completas. No es una app en si misma — es un taller que construye
apps en directorios externos usando 5 engines orquestadores, 8 skills standalone
y 16 skills externas de diseño (oh-my-design).

Cada app generada comparte ~95% del frontend (Alpine + Dexie + DaisyUI),
diferenciandose solo en setup, empaquetado y perfil de entrega.

---

## 2. Perfiles de Entrega

| Aspecto | Inicio (Lite) | Profesional (Full) | Enterprise (Full custom) |
|---------|--------------|--------------------|-------------------------|
| **Runtime** | Doble clic `index.html` (file://) | NeutralinoJS .exe (~2MB) + Capacitor .apk | Fuente completa + .exe + .apk |
| **DB** | Dexie (IndexedDB) | Dexie + SQLite FTS5 | Dexie + SQLite FTS5 |
| **Cifrado** | CryptoJS AES | CryptoJS AES | CryptoJS AES |
| **IA Jutia** | FlexSearch + stats | FlexSearch + stats + QA con Transformers.js | Personalizable |
| **Empaquetado** | ZIP + GitHub Pages | .exe + .apk + Pages + Release | .exe + .apk + codigo fuente + docs |
| **Plugins nativos** | — | SQLite FTS5, camara, GPS, notificaciones, compartir | Los mismos + UI custom |
| **White-label** | Manual | Manual | Script brand.ps1 automatico |
| **Distribucion** | ZIP descargable / Web | .exe descargable + Google Play | Todo + repositorio privado |

---

## 3. Stack Tecnologico

### 3.1 Frontend (95% identico entre perfiles)

| Tecnologia | Version | Rol |
|-----------|---------|-----|
| **Alpine.js** | 3.14+ | Reactividad declarativa (`x-data`, `x-model`, `$store`, `$persist`) |
| **Dexie.js** | 4.0+ | IndexedDB wrapper (CRUD offline, indices, queries paginadas) |
| **CryptoJS** | 4.2+ | Cifrado AES de campos sensibles en reposo |
| **Tailwind CSS** | 2.2+ | CSS utility-first (local, sin CDN) |
| **DaisyUI** | 4.12+ | Componentes UI (btn, card, input, modal, drawer, tabs, table) |
| **Bootstrap Icons** | 1.11+ | Iconos vectoriales (local, sin CDN) |
| **Animate.css** | 4.1+ | Animaciones de entrada (fadeIn, slideIn, bounceIn) |
| **pako** | 2.1+ | Compresion/decompresion de datos binarios |
| **Chart.js** | 4.4+ | Graficos interactivos (Canvas, stats, dashboards) |
| **jsPDF** | 2.5+ | Exportacion a PDF offline |
| **SheetJS (xlsx)** | 0.20+ | Exportacion/importacion Excel offline |

### 3.2 Diferencias por perfil

| Componente | Inicio (Lite) | Profesional (Full) |
|-----------|--------------|--------------------|
| **Alpine.js** | `assets/js/libs/alpine.js` | npm `alpinejs` |
| **Dexie** | `assets/js/libs/dexie.js` | npm `dexie` |
| **CryptoJS** | `assets/js/libs/crypto-js.js` | npm `cryptojs` |
| **Carga de libs** | `scripts/descargar-libs.bat` (curl) | `npm install` |
| **Models IA** | N/A | `assets/models/` (descarga unica ~58MB con q4) |
| **SQLite FTS5** | N/A | sql.js WASM (1.3MB) o @capacitor-community/sqlite |
| **Runtime** | file:// (doble clic) | NeutralinoJS (ventana nativa, 2MB) o Capacitor (WebView Android) |
| **Plugins nativos** | N/A | Camara, GPS, notificaciones, compartir |

### 3.3 Arquitectura offline-first

```
index.html
├── CSS (assets/css/)
│   ├── tailwind.min.css
│   ├── daisyui.min.css
│   ├── bootstrap-icons.css
│   └── animate.min.css
├── JS Libs (assets/js/libs/)
│   ├── alpine.js / dexie.js / crypto-js.js / pako.js
│   └── chart.js / jspdf.js / xlsx.js
├── Core (core/)
│   ├── db.js          — Dexie init (tablas, indices, versiones)
│   ├── crypto.js       — encrypt/decrypt + uuid
│   ├── ui.js           — toast, confirm, loading, formatos
│   ├── theme.js        — CSS variables desde project.config.js
│   ├── network.js      — Monitoreo de conectividad offline
│   ├── file-store.js   — Gestión de archivos (avatars, fotos, docs)
│   ├── sync.js         — Export/import .ateje-backup cifrado
│   ├── app.js          — Router hash-based, carga de modulos
│   ├── search-palette.js — Command Palette (Cmd+K) global
│   ├── ia.js           — IA Jutia (FlexSearch + stats + QA)
│   └── ia-ingest.js    — (Full) Parsers + Transformers.js
├── Modules (modules/)
│   ├── [modulo]/module.js   — Logica CRUD por modulo
│   └── [modulo]/module.html — UI Alpine + DaisyUI
├── Assets
│   ├── wasm/           — sql-wasm.wasm (Full sql.js)
│   ├── models/         — Modelos Transformers.js q4 (Full IA)
│   └── fonts/          — Fuentes locales
├── Data (data/)
│   ├── avatars/        — Fotos de perfil
│   ├── fotos/          — Imagenes de productos/registros
│   ├── docs/           — Documentos de ingesta IA
│   ├── defaults/       — Placeholders (avatar.png por defecto)
│   ├── exports/        — Exportaciones temporales
│   └── backups/        — Backups .ateje-backup
├── project.config.js   — Config white-label completa
├── neutralino.config.json — (Full) Config NeutralinoJS
├── capacitor.config.json  — (Full .apk) Config Capacitor
├── package.json        — (Full) npm dependencies
├── sw.js               — Service Worker (PWA opcional)
└── manifest.json       — PWA manifest (opcional)
```

---

## 4. Skills del Stack

### 4.1 Engines (orquestadores)

| Skill | Proposito | Output |
|-------|-----------|--------|
| **pipeline-engine** | Orquestador maestro. Soporta Classic (5 fases, /new) y Design (10 fases, /pro). Coordina setup → spec → design → build → validate → deploy. | Pipeline completo ejecutado |
| **spec-engine** | Genera especificacion funcional de 15 secciones + DESIGN.md brand layer con 286 referencias de marca reales (oh-my-design). | `specs/[app].md` + `specs/DESIGN.md` |
| **design-engine** | Aplica tokens de marca (colores, tipografia, spacing) a componentes DaisyUI/alpine-ui-patterns segun DESIGN.md. Captura correcciones del usuario como preferencias persistentes. | `.omd/preferences.md` + tokens aplicados |
| **validation-engine** | 4 fases: compliance (stack rules) → brand audit (DESIGN.md) → DevTools QA → rubric 8 items. Modo refactor para auto-correccion. | `docs/validacion-[app].md` |
| **wiki-engine** | Wiki persistente + preferencias de diseño. Doble capa: markdown versionado (humanos) + MCP memory graph (agente). | `wiki/*.md` + `.omd/preferences.md` |

### 4.2 Standalone skills

| Skill | Proposito | Perfiles |
|-------|-----------|----------|
| **setup-init** | Valida entorno, crea estructura exacta, descarga/instala librerias base y adicionales segun perfil. | lite, full |
| **code-generator** | Genera codigo por fases desde specs. Entrega un modulo por turno para evitar perdida de contexto. Aplica stack-compliance-guard automaticamente. | lite, full |
| **stack-compliance-guard** | Guarda automatica: bloquea imports ES6, CDNs, fetch, crypto faltante. Se activa tras cada output de codigo. | lite, full |
| **deployment-jigue** | Commit + push + empaquetado segun perfil. Lite: ZIP + Pages. Full: .exe + .apk + Release. Incluye white-label (brand.ps1) y entrega Enterprise. | lite, full |
| **ia-jutia** | Mini IA v0.2 offline. Lite: FlexSearch + highlight/autocomplete/exportPDF + estadisticas + predicciones. Full: +OCR (Tesseract.js) + chat threads (Dexie) + busqueda hibrida (FlexSearch+embeddings) + QA extractivo (Transformers.js). | lite, full |
| **alpine-ui-patterns** | Catalogo unificado ~100 componentes Alpine.js de Pines/Penguin/Pinemix con fallback chain (categorias A/B/C) y prioridad por calidad. | lite, full |
| **capacitor** | Empaquetado .apk Android nativo con Capacitor. Incluye plugins: SQLite FTS5 nativo, camara, GPS, notificaciones, compartir. | full |
| **upgrade-engine** | Migra app existente entre perfiles Lite/Full e IA Lite/Full. No modifica modulos ni datos, solo agrega/remueve archivos de infraestructura segun destino. | lite, full |

### 4.3 Contratos entre skills

```
pipeline-engine
  ├─→ setup-init (estructura + librerias)
  ├─→ spec-engine (spec + DESIGN.md)
  │    ├─→ design-engine (tokens de marca)
  │    ├─→ code-generator (modulos)
  │    └─→ wiki-engine (wiki persistente)
  ├─→ design-engine
  │    └─→ code-generator (tokens aplicados en vivo)
  ├─→ code-generator
  │    ├─→ stack-compliance-guard (validacion automatica)
  │    ├─→ validation-engine (reporte)
  │    └─→ wiki-engine (ingesta)
  ├─→ validation-engine
  │    └─→ wiki-engine (reporte)
  ├─→ deployment-jigue
  │    └─→ capacitor (.apk si aplica)
  └─→ upgrade-engine (migracion de perfil, invocacion directa /upgrade)
```

---

## 5. Pipeline Completo

### 5.1 Modo Classic (`/new`) — 5 fases

```
FASE 1: SETUP
  Skill: setup-init
  ──────────────────────────────────────────────
  1. Detectar perfil (Lite/Full) y destino (.exe/.apk/ambos)
  2. Validar entorno:
     - Lite: curl disponible
     - Full: node >=18, npm, (opcional) neu CLI, (opcional) JDK 17+
  3. Crear estructura de directorios
  4. Generar archivos base (project.config.js, index.html, etc.)
  5. Instalar/descargar librerias:
     - Lite: scripts/descargar-libs.bat (curl a assets/)
     - Full: npm install (dependencias en package.json)
  6. Si procede: descargar neutralino.js, sql-wasm.wasm, modelos IA
  7. Si .apk: npm install @capacitor/* + npx cap init + npx cap add android

FASE 2: SPEC
  Skill: spec-engine
  ──────────────────────────────────────────────
  1. Discovery: tipo de proyecto, tono, referencias de marca
  2. Configuracion rapida: nombre, modulos, perfil, IA Jutia
  3. Generar spec funcional (secciones 1-9):
     - Descripcion, stack, modelo datos, modulos, flujos, reglas, pruebas
  4. Si hay referencia de marca: generar DESIGN.md (secciones 10-15):
     - Brand voice, narrative, design principles, personas, states, motion
  5. Validar asunciones 4+1 con usuario
  6. Output: specs/[app].md + specs/DESIGN.md

FASE 3: BUILD
  Skills: design-engine + code-generator
  ──────────────────────────────────────────────
  1. design-engine carga DESIGN.md + preferencias
  2. Seleccionar libreria UI (DaisyUI auto / Pines / Penguin / Pinemix)
  3. code-generator genera core (db, crypto, ui, theme, app, network, sync)
  4. code-generator genera index.html con orden correcto de scripts
  5. Por cada modulo en spec (UNO POR TURNO):
     a. design-engine aplica tokens de marca
     b. code-generator genera module.js + module.html
     c. stack-compliance-guard valida automaticamente
     d. PAUSA hasta confirmacion
  6. Si IA Jutia: generar core/ia.js + core/ia-ingest.js + module IA
  7. Si Full: generar neutralino.config.json + capacitor.config.json

FASE 4: VALIDATE
  Skill: validation-engine
  ──────────────────────────────────────────────
  Fase 1 — Stack Compliance:
    - Sin imports, sin CDNs, sin fetch, crypto presente
    - Librerias en assets/ o package.json segun perfil
  Fase 2 — Brand Audit:
    - Typography hierarchy, color budget, radius scale
    - Component states, mobile responsive, spacing consistency
    - Voice register contra DESIGN.md
  Fase 3 — Technical QA:
    - Consola 0 errors, Lighthouse a11y >=90
    - Perfil Lite: abrir en file:// sin errores
    - Perfil Full: compilar .exe / .apk
  Fase 4 — QA Rubric (8 items, PASS/FAIL):
    - Brand consistency, typography, voice, images
    - Accessibility, performance, links, offline compliance
  Output: docs/validacion-[app].md

FASE 5: DEPLOY
  Skill: deployment-jigue + capacitor
  ──────────────────────────────────────────────
  1. git add + commit + push
  2. GitHub Pages automatico (push a main)
  3. Empaquetado segun perfil:
     - Lite: ZIP en dist/
     - Full .exe: neu build --release
     - Full .apk: npx cap sync android + gradlew assembleRelease
  4. GitHub Release con assets (.exe + .apk si aplica)
  5. Reporte final
```

### 5.2 Modo Design (`/pro`) — 10 fases

Agrega 5 fases extra antes del build:

```
FASE 1: BRAINSTORMING    — Exploracion con sub-agentes
FASE 2: UX RESEARCH      — Audiencia, competidores, referencias
FASE 3: SPEC + BRAND     — spec-engine + DESIGN.md
FASE 4: DESIGN SYSTEM    — design-engine define tokens completos
FASE 5: UI CODING        — code-generator + design-engine en vivo
FASE 6: MICROCOPY        — omd:es-writer (voz de marca profesional)
FASE 7: ASSETS           — omd:asset-fetch + MCP stocky (imagenes CC0)
FASE 8: TESTING          — validation-engine fases 1-3
FASE 9: DESIGN REVIEW    — validation-engine fases 4-5 (brand + rubric)
FASE 10: DEPLOY          — deployment-jigue
```

---

## 6. IA Jutia — Mini IA offline

### Perfil Lite (~7KB adicionales)
- Busqueda full-text con FlexSearch sobre datos de la app
- Estadisticas descriptivas (media, mediana, moda, stddev, count)
- Predicciones (regresion lineal, media movil)
- Indexacion incremental (indexRecord/removeRecord sin recargar)
- Paginacion Dexie (lotes de 200, count() en vez de toArray())

### Perfil Full (+ ~58MB descarga unica con q4 quantization)
- Todo lo de Lite +
- Ingesta de documentos: PDF, DOCX, XLSX, CSV, MD, TXT
- QA extractivo con Transformers.js (BERT multilingual)
- Chunking con overlap + FTS5 (sql.js WASM o Capacitor SQLite nativo)
- Web Worker para no bloquear UI
- WebGPU acceleration (50-100ms en Edge/Chrome/Android WebView)
- Fallback automatico: SQLite nativo → sql.js WASM → Dexie paginado

---

## 7. Empaquetado por Perfil

### Inicio (Lite)
```
1. scripts/descargar-libs.bat descarga 12 libs a assets/
2. index.html abre con doble clic (file://)
3. Compress-Archive → dist/[app].zip
4. Push a main → GitHub Pages automatico
```

### Profesional (Full .exe)
```
1. npm install → package.json con dependencias
2. neu build --release → ~2MB runtime + app completa
3. Ventana nativa con bandeja, notificaciones, menu contextual
4. sql.js WASM para FTS5 (QA ~50-150ms)
5. WebGPU opcional en WebView2 Edge
```

### Profesional (Full .apk)
```
1. npm install @capacitor/* + npx cap add android
2. npx cap sync android (sincroniza web → proyecto nativo)
3. cd android && ./gradlew assembleRelease
4. APK ~5MB base + modelos IA (descarga unica bajo demanda)
5. Plugins nativos: SQLite FTS5, camara, GPS, notificaciones, compartir
6. Runtime detection: window.CAPACITOR + window.native.* helpers
```

### Enterprise
```
1. brand.ps1 -AppName "Cliente" -LogoPath "logo.png"
   - Reemplaza nombre, AppId, colores, logo en 12 archivos
   - Genera docs/GUIA_USUARIO.md personalizada
   - Empaqueta ZIP branded en dist/branded/
2. .exe + .apk + codigo fuente completo
3. Docs personalizados (usuario, instalacion, desarrollo)
4. Script brand.ps1 para que el cliente re-brandee
5. (Opcional) Repositorio privado
```

---

## 8. Paso a Paso: Hacer una App

### 8.1 Preparacion

```powershell
# Requisitos base
git clone https://github.com/ahaguilera/ateje
cd ateje
# Abrir OpenCode en este directorio
opencode .
```

### 8.2 Inicio (Lite) — App web gratis, ZIP + Pages

```
Paso 1: /new
  └─ OpenCode pregunta: "Classic (5 fases) o Design (10 fases)?"
      → Elegir Classic para prototipo rapido
  └─ "Nombre, tipo, descripcion de la app"
      → Ej: "ClinicaDentalPro, Gestion de citas, App para recepcionistas"
  └─ "Perfil?" → Lite
  └─ "IA Jutia?" → Lite / Full / No

Paso 2: /setup (automatico tras /new)
  └─ OpenCode ejecuta setup-init
  └─ Crea estructura: core/, modules/, assets/, docs/, scripts/
  └─ Genera scripts/descargar-libs.bat
  └─ USUARIO: Ejecuta doble clic en scripts/descargar-libs.bat

Paso 3: /spec (automatico tras setup)
  └─ OpenCode ejecuta spec-engine
  └─ Hace preguntas de discovery y asunciones 4+1
  └─ Genera specs/[app].md con 15 secciones

Paso 4: /build (automatico tras spec)
  └─ OpenCode ejecuta design-engine + code-generator
  └─ Genera core/ (db, crypto, ui, theme, app, sync, network)
  └─ Genera modules/ uno por uno (pausa tras cada uno)
  └─ Cada modulo validado por stack-compliance-guard

Paso 5: /test (automatico tras build)
  └─ OpenCode ejecuta validation-engine
  └─ Compliance check, brand audit, QA rubric
  └─ Genera docs/validacion-[app].md

Paso 6: /deploy (automatico tras validate)
  └─ OpenCode ejecuta deployment-jigue
  └─ git add + commit + push
  └─ Genera ZIP en dist/
  └─ La app esta en GitHub Pages: https://[user].github.io/[repo]

RESULTADO:
  - index.html funcional (doble clic)
  - ZIP listo para distribuir
  - GitHub Pages online
```

### 8.3 Profesional (Full .exe + .apk) — App escritorio + Android

```
Paso 1: /new
  └─ Perfil → Full
  └─ Destino → .exe + .apk (o solo uno)
  └─ IA Jutia → Full (recomendado) o Lite

Paso 2: /setup
  └─ npm install (dependencias en package.json)
  └─ Descarga neutralino.js
  └─ Si .apk: npm install @capacitor/* + npx cap add android
  └─ Si IA Full: descarga sql-wasm.wasm + modelos q4 (~58MB)

Paso 3: /spec
  └─ spec-engine con discovery de marca (referencias oh-my-design)
  └─ DESIGN.md con brand voice, colores, tipografia, motion

Paso 4: /build
  └─ code-generator genera core/ + modules/
  └─ design-engine aplica tokens de marca en vivo
  └─ Genera neutralino.config.json + capacitor.config.json
  └─ Si IA Full: incluye ia-worker.js, ia-sqlite.js con FTS5

Paso 5: /test
  └─ validation-engine con auditoria de marca completa
  └─ Verifica .exe compila: neu build --release
  └─ Verifica .apk compila: gradlew assembleRelease

Paso 6: /deploy
  └─ Commit + push + Pages
  └─ .exe en dist/[app]-win_x64.zip (~2MB)
  └─ .apk en android/app/build/outputs/apk/release/app-release.apk
  └─ GitHub Release con ambos assets

RESULTADO:
  - .exe nativo (~2MB) — ventana, bandeja, notificaciones
  - .apk Android nativo — SQLite FTS5, camara, GPS, notificaciones
  - GitHub Pages + Release
  - IA Full con QA, FTS5, WebWorker, WebGPU
```

### 8.4 Enterprise — App white-label con branding completo

```
Paso 1-5: Igual que Profesional (Full)

Paso 6: White-label branding
  └─ Ejecutar brand.ps1 con datos del cliente:
      .\deployment-jigue\templates\brand.ps1 -AppName "ClienteX" `
        -AppId "com.cliente.app" -PrimaryColor "#ff6600" `
        -SecondaryColor "#003366" -LogoPath "C:\logo.png"

Paso 7: Recompilar con branding
  └─ neu build --release (.exe con marca del cliente)
  └─ npx cap sync android + gradlew assembleRelease (.apk con marca)

Paso 8: Generar documentacion Enterprise
  └─ docs/GUIA_USUARIO.md — Manual de usuario personalizado
  └─ docs/GUIA_INSTALACION.md — Como instalar .exe / .apk
  └─ docs/GUIA_DESARROLLO.md — Para el equipo tecnico del cliente

Paso 9: Empaquetar entrega Enterprise
  └─ dist/enterprise/ClienteX-win_x64.zip (.exe)
  └─ dist/enterprise/ClienteX.apk
  └─ dist/enterprise/brand.ps1 (script para re-brandeo futuro)
  └─ dist/enterprise/docs/ (documentacion personalizada)
  └─ dist/enterprise/ClienteX-source-v1.0.zip (codigo fuente completo)

Paso 10: /deploy
  └─ Commit + push + Pages + Release con todos los assets

RESULTADO:
  - App completa con marca del cliente
  - .exe + .apk + codigo fuente
  - Documentacion personalizada
  - Script brand.ps1 para que el cliente re-brandee
  - Todo listo para entregar
```

---

## 9. Comandos Slash Rapidos

| Comando | Que hace |
|---------|----------|
| `/new` | Pipeline Classic completo (5 fases) |
| `/pro` | Pipeline Design completo (10 fases) |
| `/setup` | Solo setup-init: estructura + librerias |
| `/spec` | Solo spec-engine: spec funcional + DESIGN.md |
| `/build` | Solo code-generator: core + modulos uno por uno |
| `/test` | Solo validation-engine: compliance + brand + QA |
| `/deploy` | Solo deployment-jigue: commit + push + empaquetar |
| `/validate` | Solo brand audit (validation-engine modo audit) |
| `/refactor` | Solo correccion UX (validation-engine modo refactor) |
| `/compliance` | Solo stack-compliance-guard |
| `/ia` | Configurar IA Jutia (Lite/Full/No) |
| `/wiki` | Gestionar wiki + preferencias |
| `/status` | Ver estado actual del pipeline |
| `/archive` | Archivar spec + reporte |
| `/upgrade` | Migrar perfil Lite→Full y/o IA Jutia |

---

## 10. Arquitectura de Datos

### Dexie (IndexedDB) — Base de datos principal

```javascript
const db = new Dexie('AppDB');
db.version(1).stores({
  pacientes:  'id, nombre, email, *createdBy, createdAt, updatedAt',
  citas:      'id, pacienteId, fecha, estado, *createdBy, createdAt, updatedAt',
  // ...tablas especificas de cada modulo
  _files:     '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path',
  _ia_docs:   'id, nombre, tipo, *createdBy, createdAt, updatedAt',
  _ia_chunks: 'id, docId, *texto, createdAt',
  _ia_index:  '&consulta',
  modelos_cache: '&ruta'
});
db.version(2).stores({
  _ia_sqlite: 'id'  // snapshot de sql.js
});
```

### SQLite FTS5 (IA Jutia Full — solo Profesional/Enterprise)

- sql.js WASM para .exe (NeutralinoJS WebView)
- @capacitor-community/sqlite nativo para .apk (Capacitor)
- FTS5: `CREATE VIRTUAL TABLE chunks_fts USING fts5(texto, docId)`
- QA: `SELECT texto, docId FROM chunks_fts WHERE texto MATCH ? ORDER BY rank LIMIT 5`
- Persistencia cíclica: export cada 2s a `_ia_sqlite` en IndexedDB
- Fallback automatico a Dexie si SQLite no disponible

### Cifrado

```javascript
// Campos sensibles (definidos en spec)
const registro = {
  nombre: cryptoHelpers.encrypt(input.value),  // AES en reposo
  email:  cryptoHelpers.encrypt(input.value),
  // ...campos no sensibles sin cifrar
  telefono: input.value,
  createdBy: APP_CONFIG.usuarioActual || 'anon',
  createdAt: new Date(),
  updatedAt: new Date()
};
await db.pacientes.put(registro);
```

---

## 11. UI y Componentes

### Librerias UI disponibles

| Libreria | Estilo | Componentes destacados | Prioridad |
|----------|--------|----------------------|-----------|
| **DaisyUI 5** | Tema oscuro/claro, clases semanticas | btn, card, input, modal, drawer, tabs, table, badge, skeleton, dropdown | Default |
| **Pines UI** | Tailwind nativo, UX avanzada | Command palette, slide-over, date picker, context menu, toast | Categoria A |
| **Penguin UI** | 6 temas (Arctic, Modern, Neo Brutalism) | Avatar, steps, carousel, chat bubble, spinner | Categoria B |
| **Pinemix** | Accesible, keyboard-driven | Accordion, tabs, range slider, tag input, tree view | Categoria C |

### Fallback chain

```
component_library: auto (default)
  → DaisyUI para componentes basicos
  → alpine-ui-patterns categoria A si DaisyUI no tiene el componente
  → B → C → DaisyUI otra vez

component_library: pines
  → Pines UI primero
  → Penguin → Pinemix → DaisyUI como fallback
```

### Patrones UX obligatorios

- **Skeleton loader** en lugar de spinner para carga de datos
- **Empty state** que guia al usuario al primer paso
- **Error state** con boton de reintentar
- **Offline banner** que se muestra cuando `navigator.onLine = false`
- **Spring physics** en hover/active (`ease-[cubic-bezier(0.34,1.56,0.64,1)]`)
- **Stagger reveal** en listas (delay 80ms por item)
- **Animaciones solo con transform + opacity** (nunca top/left/width/height)
- **min-h-[100dvh]** en lugar de h-screen

---

## 12. MCP Servers

| Server | Proposito | Setup |
|--------|-----------|-------|
| **memory** | Grafo de conocimiento persistente (entidades, relaciones) | Nativo OpenCode |
| **github** | Operaciones GitHub (issues, PRs, commits, releases) | GITHUB_TOKEN en opencode.json |
| **stocky** | Busqueda de imagenes Pexels + Unsplash | `pip install -e mcp-servers/stocky` |
| **refero-styles** | Busqueda de sistemas de diseño en refero.design | `cd mcp-servers/refero-styles && npm install && npm run build` |

---

## 13. Testing

```powershell
# Tests unitarios (pytest)
cd tests
python -m pytest test_app.py -v

# Playwright E2E sobre test-app.html
# Requiere Chrome system channel
pytest test_app.py --headed

# Lighthouse audit (Chrome DevTools)
# accessibility >= 90, performance segun target

# Stack compliance (automatico tras cada codigo)
# Se ejecuta solo, sin trigger
```

---

## 14. Instalacion Global

El Ateje Stack puede instalarse globalmente para usarse desde cualquier proyecto:

```powershell
# Desde la raiz del repo
.\install-global.ps1
```

**Que hace:**
1. Crea 13 directory junctions en `~/.opencode/skills/` → cada skill del repo
2. Agrega `"skills": { "paths": ["~/.opencode/skills/"] }` al config global (`~/.config/opencode/opencode.json`)
3. Skills disponibles desde cualquier `opencode .` — `/new`, `/build`, `/deploy`, etc.

**Ventajas:**
- Sin administrador (junctions funcionan en Windows sin elevation)
- `git pull` en el repo actualiza todas las skills al instante (son junctions, no copias)
- Sandboxeado: solo escanea `~/.opencode/skills/`, no interfiere con otros proyectos
- Reversible: `.\uninstall-global.ps1` elimina junctions + limpia config

**Efecto:** El orquestador principal se activa desde cualquier directorio con ruta absoluta al repo.

---

## 15. Roadmap de Migracion (Fases 0-5)

```
FASE 0 ✅ (Completada): Estructura raiz unificada (public/ → root)
                    └─ NeutralinoJS como unico runtime Full
                    └─ Bun --compile eliminado
                    └─ Todos los skills actualizados

FASE 0B ✅ (Completada): upgrade-engine skill operativo
                    └─ Migracion Lite→Full automatica
                    └─ Migracion IA Jutia independiente
                    └─ Zero impacto en modulos/datos

FASE 1 (Sem 3-4):   sql.js FTS5 (QA 2-3s → 50-150ms)
                    └─ Persistencia ciclica cada 2s
                    └─ Fallback automatico a Dexie

FASE 2 (Sem 5-7):   Capacitor .apk (SQLite FTS5 nativo)
                    └─ Plugins: camara, GPS, notificaciones, compartir
                    └─ Runtime detection: window.CAPACITOR + window.native.*

FASE 3 (Sem 8-10):  White-label + Enterprise
                    └─ brand.ps1 (reemplaza nombre, colores, logo)
                    └─ Enterprise checklist + docs personalizados
                    └─ Entrega: .exe + .apk + fuente + docs + brand.ps1

FASE 4 (Sem 11-12): Dexie optimizado (paginacion, count() en vez de toArray())
                    └─ Web Worker para Transformers.js
                    └─ q4 quantization (modelos 230MB → 58MB)

FASE 5 (Sem 13-14): WebGPU acceleration + WebWorker IA
                    └─ Ventana nativa, bandeja, notificaciones
                    └─ NeutralinoJS con aceleracion GPU
```

---

## 16. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO (OpenCode CLI)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │ /new /pro /setup /spec /build /deploy
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    pipeline-engine (orquestador)              │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────┐  │
│  │ Classic │ │  Design  │ │ Deteccion │ │ Contrato con  │  │
│  │ (5 fases)│ │ (10 fases)│ │ de modo   │ │ otras skills  │  │
│  └─────────┘ └──────────┘ └───────────┘ └───────────────┘  │
└──────┬──────┬──────┬──────┬──────┬──────┬──────────────────┘
       │      │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼      ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐
│setup-init│ │spec-engine│ │ design-engine│ │code-generator│
│ ──────── │ │ ──────── │ │ ──────────── │ │ ──────────── │
│Entorno   │ │Spec       │ │Brand tokens  │ │Core + modulos│
│Estructura│ │DESIGN.md  │ │Preferencias  │ │stack check   │
│Librerias │ │Asunciones │ │UI components │ │Por fases     │
└──────────┘ └──────────┘ └──────────────┘ └──────────────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │stack-        │
                                     │compliance-   │
                                     │guard         │
                                     │(auto-validación)
                                     └──────────────┘
                                            │
                                            ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────────┐
│  validation  │ │wiki-engine   │ │  deployment-jigue  │
│  -engine     │ │ ─────────── │ │  ───────────────   │
│ ──────────   │ │Wiki memoria  │ │  Commit + push     │
│Compliance    │ │Preferencias  │ │  ZIP / .exe / .apk │
│Brand audit   │ │MCP graph    │ │  Pages + Release   │
│QA rubric     │ │             │ │  Enterprise pack    │
└──────────────┘ └──────────────┘ └────────────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │   capacitor   │
                                    │ ────────────  │
                                    │ .apk nativo   │
                                    │ Plugins FTS5  │
                                    │ Camara, GPS   │
                                    └──────────────┘
```

---

## 17. Resumen: De 0 a App en 6 Pasos

```
┌──────────────────────────────────────────────────────────┐
│  /new  →  Nombre + tipo + perfil (Lite/Full) + IA (si)   │
├──────────────────────────────────────────────────────────┤
│  /setup → Estructura + librerias en 1 comando             │
├──────────────────────────────────────────────────────────┤
│  /spec  → Spec funcional + DESIGN.md (con marca o sin)    │
├──────────────────────────────────────────────────────────┤
│  /build → Core + modulos uno por uno, validados           │
├──────────────────────────────────────────────────────────┤
│  /test  → Compliance + brand audit + QA rubric            │
├──────────────────────────────────────────────────────────┤
│  /deploy → ZIP / .exe / .apk + Pages + Release            │
└──────────────────────────────────────────────────────────┘

Tiempo estimado (app promedio, 5 modulos):
  Inicio (Lite):      ~10-15 minutos
  Profesional (Full): ~20-30 minutos
  Enterprise:         ~30-45 minutos (+ branding)

Cada paso es interactivo — OpenCode pausa y espera confirmacion.
```

---

*Documento generado por Ateje Stack v3.0*
*Skills OpenCode en `D:\REPOSITORIOS GitHUB\Ateje`*

---

## 📚 Recursos de Estudio

- **`docs/guia-estudio-ateje.md`** — Guía completa de estudio del Stack Ateje: visión general, core, perfiles, 13 AHA Apps, módulos compartidos, pipeline, buenas prácticas (981 líneas con tablas, schemas y ejemplos)
- **`docs/stack-completo.md`** — Este documento: referencia técnica detallada del stack
- **`docs/guia-stack-skills-layer.md`** — Guía de habilidades y capas del stack
