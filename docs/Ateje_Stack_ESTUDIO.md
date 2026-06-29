# 📚 Guía de Estudio – Stack Ateje

> **Objetivo:** Tener una visión completa y práctica del Stack Ateje, sus componentes, flujos y buenas prácticas, para usarlo, extenderlo y depurarlo con confianza.

---

## 📑 Índice

1. [Visión General](#1️⃣-visión-general)
2. [Arquitectura](#2️⃣-arquitectura)
3. [Perfiles Lite vs Full](#3️⃣-perfiles-lite-vs-full)
4. [Estructura del Repositorio](#4️⃣-estructura-del-repositorio)
5. [Core – Archivos Fundamentales](#5️⃣-core--archivos-fundamentales)
6. [Tablas de Sistema](#6️⃣-tablas-de-sistema)
7. [project.config.js – Schema White-Label](#7️⃣-projectconfigjs--schema-white-label)
8. [UI Padrones](#8️⃣-ui-padrones)
9. [Command Palette (Cmd+K)](#9️⃣-command-palette-cmdk)
10. [FileStore – Gestión de Archivos](#🔟-filestore--gestión-de-archivos)
11. [IA Jutia](#1️⃣1️⃣-ia-jutia)
12. [Catálogo de 13 AHA Apps](#1️⃣2️⃣-catálogo-de-13-aha-apps)
13. [Módulos Compartidos](#1️⃣3️⃣-módulos-compartidos)
14. [Pipeline / Flujo de Trabajo](#1️⃣4️⃣-pipeline--flujo-de-trabajo)
15. [Comandos Slash](#1️⃣5️⃣-comandos-slash)
16. [Instalación Global](#1️⃣6️⃣-instalación-global)
17. [Herramientas de Desarrollo (Engram + OpenPencil)](#1️⃣7️⃣-herramientas-de-desarrollo-engram--openpencil)
18. [Buenas Prácticas](#1️⃣8️⃣-buenas-prácticas)
19. [Análisis de Mercado — Top 6 Apps](#1️⃣9️⃣-análisis-de-mercado--top-6-apps)
20. [Estrategia de Venta](#2️⃣0️⃣-estrategia-de-venta)
21. [Troubleshooting](#2️⃣1️⃣-troubleshooting)
22. [Referencia Rápida](#2️⃣2️⃣-referencia-rápida)

---

## 1️⃣ Visión General

| Concepto | Descripción |
|---|---|
| **¿Qué es?** | Meta-repo que agrupa **skills** y **engines** OpenCode para generar aplicaciones **offline-first** desde cero. |
| **¿Qué genera?** | Apps con frontend Alpine.js + DaisyUI, backend Dexie (IndexedDB), cifrado CryptoJS, y dos perfiles de empaquetado. |
| **Stack técnico** | Alpine.js 3.x + DaisyUI 4.x + Dexie 4.x + CryptoJS + Chart.js 4.x + Bootstrap Icons + pako + jsPDF + SheetJS |
| **Perfiles** | **Lite** (file:// doble clic) y **Full** (NeutralinoJS .exe + Capacitor .apk) |
| **Idioma** | Español latino (microcopy profesional vía `omd:es-writer`) |

### Principios Arquitectónicos

- **Offline-first**: Todo funciona sin internet. La sincronización es un añadido, no un requisito.
- **Skill-Layer Architecture**: 5 engines orquestadores + 8 skills standalone + 16 skills OmD de diseño.
- **Single Source of Truth**: Las plantillas de apps están en `apps/AHA-*/template.md`.
- **Perfiles progresivos**: Inicio (Lite) → Profesional (Full) → Enterprise (Full custom).
- **95% UI compartida**: El frontend (Alpine + DaisyUI) es casi idéntico entre perfiles.

### 1.1 Stack Tecnológico Detallado

**Frontend (95% idéntico entre perfiles):**

| Tecnología | Versión | Rol |
|---|---|---|
| **Alpine.js** | 3.14+ | Reactividad declarativa (`x-data`, `x-model`, `store`, `persist`) |
| **Dexie.js** | 4.0+ | IndexedDB wrapper (CRUD offline, índices, queries paginadas) |
| **CryptoJS** | 4.2+ | Cifrado AES de campos sensibles en reposo |
| **Tailwind CSS** | 3.4+ | CSS utility-first (local, sin CDN) |
| **DaisyUI** | 4.12+ | Componentes UI (btn, card, input, modal, drawer, tabs, table) |
| **Bootstrap Icons** | 1.11+ | Iconos vectoriales (local, sin CDN) |
| **Animate.css** | 4.1+ | Animaciones de entrada (fadeIn, slideIn, bounceIn) |
| **pako** | 2.1+ | Compresión/descompresión de datos binarios |
| **Chart.js** | 4.4+ | Gráficos interactivos (Canvas, stats, dashboards) |
| **jsPDF** | 2.5+ | Exportación a PDF offline |
| **SheetJS (xlsx)** | 0.20+ | Exportación/importación Excel offline |

**Diferencias de carga por perfil:**

| Componente | Lite | Full |
|---|---|---|
| Alpine.js | `assets/js/libs/alpine.js` | npm `alpinejs` |
| Dexie | `assets/js/libs/dexie.js` | npm `dexie` |
| CryptoJS | `assets/js/libs/crypto-js.js` | npm `cryptojs` |
| Carga de libs | `scripts/descargar-libs.bat` (curl) | `npm install` |
| Modelos IA | N/A | `assets/models/` (descarga única ~58MB q4) |
| SQLite FTS5 | N/A | sql.js WASM (1.3MB) o @capacitor-community/sqlite |
| Runtime | file:// (doble clic) | NeutralinoJS (ventana nativa) o Capacitor (WebView Android) |
| Plugins nativos | N/A | Cámara, GPS, notificaciones, compartir |

---

## 2️⃣ Arquitectura

### Capas del Stack

```
┌─────────────────────────────────────────────┐
│            PIPELINE ENGINE                   │
│    (Classic: 5 fases / Design: 10 fases)     │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌───────────┐    │
│  │  Spec    │ │  Design  │ │ Validation│    │
│  │  Engine  │ │  Engine  │ │  Engine   │    │
│  └──────────┘ └──────────┘ └───────────┘    │
│  ┌──────────┐ ┌──────────┐                   │
│  │   Wiki   │ │ Upgrade  │                   │
│  │  Engine  │ │  Engine  │                   │
│  └──────────┘ └──────────┘                   │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌───────────┐    │
│  │  Setup   │ │   Code   │ │ Compliance│    │
│  │  Init    │ │ Generator│ │   Guard   │    │
│  └──────────┘ └──────────┘ └───────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐    │
│  │Deployment│ │ IA Jutia │ │  Alpine   │    │
│  │  Jigue   │ │          │ │   UI Pat  │    │
│  └──────────┘ └──────────┘ └───────────┘    │
│  ┌──────────┐ ┌──────────┐                   │
│  │Capacitor │ │ Upgrade  │                   │
│  │  (Full)  │ │  Engine  │                   │
│  └──────────┘ └──────────┘                   │
├─────────────────────────────────────────────┤
│         16 Skills Oh My Design (OmD)         │
│  (init, taste, apply, harness, sync, learn,  │
│   remember, es-writer, designer-review, QA)  │
└─────────────────────────────────────────────┘
```

### Motores (Engines)

| Motor | Propósito | Reemplaza a |
|---|---|---|
| **pipeline-engine** | Orquestador maestro: Classic (5 fases, `/new`) y Design (10 fases, `/pro`) | prompt-inicial, supercharged-pipeline, omd:harness, omd:orchestrator |
| **spec-engine** | Spec funcional + DESIGN.md brand layer con 286 referencias oh-my-design | spec-creator, omd:init, omd:taste |
| **design-engine** | Brand context injection, tokens DaisyUI/alpine-ui-patterns, preferencias persistentes | design-ux-intelligence, daisyui-patterns, omd:apply, omd:sync, omd:remember, omd:learn |
| **validation-engine** | 4 fases: compliance → brand audit → DevTools/Playwright → QA rubric + modo refactor | validation-offline, ux-refactor, omd:designer-review, omd:final-qa |
| **wiki-engine** | Wiki persistente + preferencias de diseño `.omd/preferences.md` + MCP memory | llm-wiki, omd:remember, omd:learn |

### Skills Standalone

| Skill | Propósito | Perfiles |
|---|---|---|
| **setup-init** | Valida entorno, crea estructura, instala librerías | lite, full |
| **code-generator** | Genera código por fases desde specs, un módulo por turno | lite, full |
| **stack-compliance-guard** | Guarda automática: bloquea imports, CDNs, fetch, crypto faltante | lite, full |
| **deployment-jigue** | Commit + push + Pages + ZIP (Lite) / .exe + Release (Full) | lite, full |
| **ia-jutia** | Mini IA v0.2: FlexSearch + highlight/autocomplete/exportPDF (Lite) / +OCR + chat threads + hybrid search (Full) | lite, full |
| **alpine-ui-patterns** | Catálogo ~100 componentes Alpine.js de Pines/Penguin/Pinemix | lite, full |
| **capacitor** | Empaquetado .apk Android nativo con Capacitor | full |
| **upgrade-engine** | Migra app entre perfiles Lite/Full e IA Lite/Full | lite, full |

### 2.1 Evolución: Antes vs Ahora

31 skills originales consolidadas en 11 activas + 16 OmD:

| Antes (31 skills) | Ahora (11 activas + 16 OmD) |
|---|---|
| prompt-inicial | → pipeline-engine (modo Classic) |
| supercharged-pipeline | → pipeline-engine (modo Design) |
| spec-creator | → spec-engine |
| design-ux-intelligence | → design-engine |
| daisyui-patterns | → design-engine (absorbido) |
| validation-offline | → validation-engine |
| ux-refactor | → validation-engine (modo refactor) |
| llm-wiki | → wiki-engine |
| ux-ui-universal | → eliminado (OmD cubre multi-stack) |
| omd:harness + omd:orchestrator | → pipeline-engine |
| omd:init + omd:taste | → spec-engine |
| omd:apply + omd:sync | → design-engine |
| omd:remember + omd:learn | → wiki-engine |
| omd:designer-review + omd:final-qa | → validation-engine |

### 2.2 Skills Deprecadas

| Skill | Estado | Migrar a |
|---|---|---|
| `prompt-inicial/` | @deprecated | pipeline-engine (`/new`) |
| `spec-creator/` | @deprecated | spec-engine (`/spec`) |
| `design-ux-intelligence/` | @deprecated | design-engine |
| `validation-offline/` | @deprecated | validation-engine (`/test`) |
| `ux-refactor/` | @deprecated | validation-engine (modo refactor) |
| `llm-wiki/` | @deprecated | wiki-engine (`/wiki`) |
| `supercharged-pipeline/` | @deprecated | pipeline-engine (`/pro`) |
| `daisyui-patterns/` | @deprecated | design-engine |
| `github-page-publish/` | @deprecated | deployment-jigue |

---

## 3️⃣ Perfiles Lite vs Full

| Característica | Lite | Full |
|---|---|---|
| **Runtime** | Doble clic `index.html` (file://) | NeutralinoJS (.exe) + Capacitor (.apk) |
| **Base de datos** | Dexie (IndexedDB) | Dexie + SQLite (FTS5) |
| **Archivos** | Blobs en Dexie (`_file_blobs`) | Disco (`APP_DATA_DIR`) |
| **IA Jutia** | FlexSearch + estadísticas + predicciones | +ingesta PDF/DOCX/XLSX + Transformers.js QA |
| **Empaquetado** | ZIP + GitHub Pages | .exe + .apk + Pages + Release |
| **Nivel comercial** | Inicio | Profesional / Enterprise |
| **Cifrado** | CryptoJS (campos sensibles) | CryptoJS (campos sensibles) |
| **PWA** | Service Worker opcional | Nativo (Neutralino/Capacitor) |

### 3.1 Empaquetado por Perfil

**Inicio (Lite):**
```
1. scripts/descargar-libs.bat descarga 12 libs a assets/
2. index.html abre con doble clic (file://)
3. Compress-Archive → dist/[app].zip
4. Push a main → GitHub Pages automático
```

**Profesional (Full .exe):**
```
1. npm install → package.json con dependencias
2. neu build --release → ~2MB runtime + app completa
3. Ventana nativa con bandeja, notificaciones, menú contextual
4. sql.js WASM para FTS5 (QA ~50-150ms)
```

**Profesional (Full .apk):**
```
1. npm install @capacitor/* + npx cap add android
2. npx cap sync android
3. cd android && ./gradlew assembleRelease
4. APK ~5MB base + modelos IA
5. Plugins nativos: SQLite FTS5, cámara, GPS, notificaciones, compartir
```

**Enterprise:**
```
1. brand.ps1 -AppName "Cliente" -LogoPath "logo.png"
   - Reemplaza nombre, AppId, colores, logo en 12 archivos
2. .exe + .apk + código fuente completo
3. Docs personalizados
```

---

## 4️⃣ Estructura del Repositorio

```
Ateje/
│
├── AGENTS.md                    # Instrucciones del agente OpenCode
├── project.config.js            # Template de config white-label
├── install-global.ps1           # Instalación global (13 junctions)
├── uninstall-global.ps1         # Desinstalación global
├── opencode.json                # Config OpenCode (agentes, MCP, skills)
│
├── core/                        # (generado) Archivos core de la app
│   ├── db.js                    # Dexie init + tablas de sistema
│   ├── crypto.js                # Encrypt/decrypt + uuid
│   ├── ui.js                    # Toast, confirm, modalForm, loading
│   ├── theme.js                 # CSS variables desde project.config.js
│   ├── app.js                   # Router hash-based, carga módulos
│   ├── search-palette.js        # Command Palette (Cmd+K) global
│   ├── file-store.js            # Gestión de archivos (Lite/Full)
│   ├── sync.js                  # Export/import .ateje-backup
│   └── network.js               # Monitoreo de conectividad
│
├── apps/                        # Plantillas de 13 AHA Apps
│   ├── AHA-Inventario/template.md
│   ├── AHA-Comanda/template.md
│   ├── AHA-CRM/template.md
│   ├── AHA-Checklist/template.md
│   ├── AHA-Asistencia/template.md
│   ├── AHA-Citas/template.md
│   ├── AHA-Creador/template.md
│   ├── AHA-Campo/template.md
│   ├── AHA-POS/template.md
│   ├── AHA-Rx/template.md
│   ├── AHA-Flota/template.md
│   ├── AHA-Obra/template.md
│   └── AHA-PreFactura/template.md
│
├── engines/                     # Skills de orquestación
│   ├── pipeline-engine/SKILL.md
│   ├── spec-engine/SKILL.md
│   ├── design-engine/SKILL.md
│   ├── validation-engine/SKILL.md
│   └── wiki-engine/SKILL.md
│
├── skills/                      # Skills standalone
│   ├── setup-init/SKILL.md
│   ├── code-generator/SKILL.md
│   ├── stack-compliance-guard/SKILL.md
│   ├── deployment-jigue/SKILL.md
│   ├── ia-jutia/SKILL.md
│   ├── alpine-ui-patterns/SKILL.md
│   ├── capacitor/SKILL.md
│   └── upgrade-engine/SKILL.md
│
├── code-generator/templates/    # Templates reutilizables
│   ├── search-palette.js
│   ├── file-store.js
│   ├── delete.js
│   └── (module.js, module.html)
│
├── components/                  # Componentes UI (Pines)
│   └── pines/
│
├── data/                        # (generado) Datos de la app
│   └── defaults/
│       ├── avatar.svg
│       ├── placeholder.svg
│       └── README.md
│
├── docs/
│   ├── Ateje_Stack_ESTUDIO.md   # ESTA GUÍA (documento unificado)
│   └── comercial/
│
├── specs/                       # (generado) Specs de apps
│   └── .gitkeep
│
├── archived/                    # Skills reemplazadas por engines
│   ├── spec-creator/
│   ├── prompt-inicial/
│   └── ...
│
├── tests/                       # Tests E2E (Playwright)
│   └── test_app.py
│
└── .github/workflows/           # CI/CD
    └── deploy-pages.yml
```

---

## 5️⃣ Core – Archivos Fundamentales

### `core/db.js`

Inicia Dexie con todas las tablas de negocio + tablas de sistema.

```javascript
const db = new Dexie('AppDB');

db.version(1).stores({
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path'
});
```

### `core/crypto.js`

Cifrado de campos sensibles + generador UUID v4 compatible file://.

```javascript
window.cryptoHelpers = {
  encrypt(texto)     → string cifrado en base64,
  decrypt(cifrado)   → string original,
  generarClave()     → clave aleatoria de 32 caracteres
};

window.uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
```

### `core/ui.js`

```javascript
window.UI = {
  toast(msg, tipo = 'info', duracion = 4000),
  confirm(msg, titulo = 'Confirmar'),
  modalForm(titulo, html, onSave),
  loading(show = true),
  formatDate(date),
  formatCurrency(n),
  formatBytes(bytes),
  formatRelative(date)
};
```

**Reglas obligatorias:**
- ✅ Feedback siempre con `UI.toast()`, NUNCA `alert()` nativo
- ✅ Antes de `db.delete()`, SIEMPRE `UI.confirm()`
- ✅ Todos los formularios crear/editar vía `UI.modalForm()`
- ✅ Operaciones largas con `UI.loading(true/false)`

### `core/theme.js`

Inyecta CSS variables desde `APP_CONFIG.tema.colores`. Expone `window.themeStore` con Alpine store.

### `core/app.js`

Router hash-based para navegación SPA sin dependencias externas.

```javascript
window.appRouter = {
  load(moduloId) {
    window.location.hash = moduloId;
  },
  init() {
    window.addEventListener('hashchange', () => this._cargarModulo());
    this._cargarModulo();
  },
  _cargarModulo() { /* renderiza module.html + ejecuta module.js */ }
};

window.MODULES = {};
```

### `core/search-palette.js`

Command Palette global (Ctrl+K / Cmd+K).

- **Atajo:** `Ctrl+K` o `Cmd+K` (global, no interfiere con inputs)
- **Navegación:** Flechas arriba/abajo + Enter
- **Cierre:** Escape o click fuera
- **IA integrada:** Si `window.ia` existe, muestra resultados de FlexSearch

### `core/file-store.js`

```javascript
window.FileStore = {
  APP_DATA_DIR: 'data/',
  async save(tipo, nombre, blob)    → { path, hash, url },
  async getURL(path)                → string (URL para <img> o <a>),
  async read(path)                  → Blob,
  async delete(path),
  async meta(path)                  → metadata desde db._files,
  async cleanOrphans()              → número de huérfanos eliminados,
  avatarDefault()                   → ruta al avatar por defecto,
  revokeAll()                       → libera todas las ObjectURL
};
```

**Backend Lite:** Blobs en Dexie `_file_blobs`. **Backend Full:** Disco en `APP_DATA_DIR`.

### `core/sync.js`

Exporta todas las tablas Dexie a archivo `.ateje-backup` cifrado (AES) y comprimido (pako gzip).

---

## 6️⃣ Tablas de Sistema

### `_files`

```javascript
_files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt'
```

| Campo | Tipo | Descripción |
|---|---|---|
| `path` | string | Ruta relativa a APP_DATA_DIR |
| `tipo` | string | 'avatar' \| 'foto' \| 'doc' \| 'logo' \| 'backup' |
| `nombre` | string | Nombre original del archivo |
| `mime` | string | Tipo MIME |
| `size` | number | Tamaño en bytes |
| `hash` | string | SHA-256 hex |
| `refCount` | number | Contador de referencias |

### `_file_blobs` (Lite only)

```javascript
_file_blobs: '&path'
```

### 6.1 SQLite FTS5 (IA Full — solo Profesional/Enterprise)

```sql
CREATE VIRTUAL TABLE chunks_fts USING fts5(texto, docId);
SELECT texto, docId FROM chunks_fts WHERE texto MATCH ? ORDER BY rank LIMIT 5;
```

**Persistencia cíclica:** export cada 2s a tabla `_ia_sqlite` en IndexedDB.

**Versiones de schema:**
```javascript
db.version(1).stores({
  pacientes: 'id, nombre, email, *createdBy, createdAt, updatedAt',
  citas: 'id, pacienteId, fecha, estado, *createdBy, createdAt, updatedAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path',
  _ia_docs: 'id, nombre, tipo, *createdBy, createdAt, updatedAt',
  _ia_chunks: 'id, docId, *texto, createdAt',
  _ia_index: '&consulta',
  modelos_cache: '&ruta'
});
db.version(2).stores({
  _ia_sqlite: 'id'
});
```

### 6.2 Cifrado en Práctica

```javascript
const registro = {
  nombre: cryptoHelpers.encrypt(input.value),
  email: cryptoHelpers.encrypt(input.value),
  telefono: input.value,
  createdBy: APP_CONFIG.usuarioActual || 'anon',
  createdAt: new Date(),
  updatedAt: new Date()
};
await db.pacientes.put(registro);
```

---

## 7️⃣ project.config.js – Schema White-Label

```javascript
window.APP_CONFIG = {
  app: {
    nombre: 'MiApp', version: '1.0.0', tipo: 'inventario',
    descripcion: 'App de inventario'
  },
  perfil: 'lite',           // 'lite' | 'professional' | 'business'
  iaJutia: 'no',            // 'lite' | 'full' | 'no'
  modulosActivos: ['usuarios', 'inventario', 'dashboard'],
  tema: {
    modo: 'claro',
    colores: {
      primary: '#1e3a5f', secondary: '#64748b',
      accent: '#f59e0b', neutral: '#1c1917', 'base-100': '#ffffff'
    },
    tipografia: { fontFamily: 'Inter, system-ui, sans-serif', headingsFont: 'Inter, system-ui, sans-serif' }
  },
  cifrado: { camposSensibles: ['email', 'telefono', 'ruc'], storageKey: 'mi-app-key' },
  data: {
    dir: 'data/', maxFileSize: 10 * 1024 * 1024,
    tipos: ['avatar', 'foto', 'doc', 'logo', 'backup'],
    avatars: { default: 'data/defaults/avatar.svg', size: 200, calidad: 0.8 }
  },
  sync: {
    primaryFormat: 'json',
    secondaryFormats: (APP_CONFIG.perfil === 'professional' || APP_CONFIG.perfil === 'business') ? ['sqlite'] : [],
    includeFiles: true, encrypt: true, maxExportSize: 50 * 1024 * 1024
  },
  ui: { formsMode: 'modal', alerts: 'toast', confirmDelete: true, avatars: true, avatarDefault: 'data/defaults/avatar.svg' },
  modulos: {
    usuarios: { titulo: 'Usuarios', icono: 'bi-people', activo: true },
    inventario: { titulo: 'Inventario', icono: 'bi-box', activo: true }
  }
};
```

---

## 8️⃣ UI Padrones

### Patrones Obligatorios

| Patrón | Implementación | Excepción |
|---|---|---|
| Forms en modal | `UI.modalForm()` | Solo si la spec pide forms en página |
| Feedback con toast | `UI.toast()` | Nunca `alert()` |
| Confirmación antes de borrar | `UI.confirm()` | Siempre |
| Loading en ops largas | `UI.loading(true/false)` | Si dura < 300ms |
| Tablas responsive | `overflow-x-auto` + `table` | — |
| Empty states | Mensaje + icono cuando no hay datos | — |
| Skeleton loading | Clases `.sk-el`, `.sk-card`, `.sk-row` | — |

### Componentes DaisyUI por Categoría

| Componente | DaisyUI | Tailwind nativo | Pines |
|---|---|---|---|
| button | `btn` | — | — |
| card | `card` | — | — |
| input | `input` | — | — |
| textarea | `textarea` | — | — |
| dropdown | `dropdown` | — | — |
| modal | `modal` | — | — |
| tabs | `tabs` | — | — |
| badge | `badge` | Tailwind pill | — |
| table | `table` | — | — |
| skeleton | `skeleton` | Shimmer | — |
| command palette | — | — | Cmd+K + x-teleport |
| toast | — | — | Alpine component |

**Regla de coherencia:** No mezclar orígenes de componentes en la misma vista.

### 8.1 Animaciones UX y Fallback de Componentes

| Patrón | Implementación |
|---|---|
| Skeleton loader | Clases `.sk-*` en lugar de spinner |
| Empty state | Mensaje + icono que guía al usuario |
| Error state | Contenedor con botón de reintentar |
| Offline banner | Se muestra cuando `navigator.onLine = false` |
| Spring physics | `ease-[cubic-bezier(0.34,1.56,0.64,1)]` |
| Stagger reveal | Delay 80ms por item en listas |
| Solo transform+opacity | Nunca animar top/left/width/height |

**Fallback chain:**
```
component_library: auto → DaisyUI → alpine-ui-patterns A → B → C → DaisyUI
component_library: pines → Pines UI → Penguin → Pinemix → DaisyUI
```

| Librería | Estilo | Prioridad |
|---|---|---|
| **DaisyUI 5** | Tema oscuro/claro, clases semánticas | Default |
| **Pines UI** | Tailwind nativo, UX avanzada | Cat. A |
| **Penguin UI** | 6 temas | Cat. B |
| **Pinemix** | Accesible, keyboard-driven | Cat. C |

### 8.2 Database Schema Patterns

Convenciones de modelado:
- `id`: UUID string (nunca `++id`)
- `createdBy`, `createdAt`, `updatedAt`: campos obligatorios
- `*campo`: indexado para búsqueda Dexie
- `&campo`: Unique Key
- FK como `entidadId` string (sin foreign keys reales)
- Consistencia vía `db.transaction()`

---

## 9️⃣ Command Palette (Cmd+K)

```html
<div x-data="searchPalette"
     @keydown.window.cmd.k.prevent="openPalette()"
     @keydown.window.ctrl.k.prevent="openPalette()"
     @keydown.window="onKeydown">
  <template x-teleport="body">
    <!-- Overlay + input + resultados -->
  </template>
</div>
```

**Comportamiento:**
- Sin query: primeros 8 módulos
- Con query: filtra módulos
- IA activa + query >= 2 chars: resultados FlexSearch
- Navegación por teclado con `_kIdx` tracking

---

## 🔟 FileStore – Gestión de Archivos

### Flujo de Guardado

```
save(tipo, nombre, blob)
  ├─ Valida tamaño (max 10MB)
  ├─ Genera UUID
  ├─ SHA-256 hash
  ├─ Metadatos en db._files
  ├─ Lite: blob en db._file_blobs
  └─ Full: disco via Neutralino.filesystem
```

### Limpieza de Huérfanos

```javascript
async cleanOrphans() {
  const orphans = await db._files.where('refCount').equals(0).toArray();
  for (const f of orphans) { await this.delete(f.path); }
  return orphans.length;
}
```

---

## 1️⃣1️⃣ IA Jutia

### Perfil Lite

```javascript
window.ia = {
  search(query, opts),
  registerTable(nombre, campos),
  indexRecord(tabla, record),
  removeRecord(tabla, id),
  stats(tabla, campo),
  statsAll(),
  predict(tabla, campo, periodos),
  forecast(valores, n),
  movingAverage(valores, ventana),
  initLite()
};
```

### Perfil Full (adicional)

- Ingesta de documentos: PDF, DOCX, XLSX, CSV, MD
- Transformers.js para QA extractivo (q4)
- SQLite FTS5 para búsqueda full-text
- Worker dedicado para no bloquear UI

### Integración con Cmd+K

1. Navegación de módulos (arriba)
2. Búsqueda en datos vía FlexSearch (abajo, con separador)

---

## 1️⃣2️⃣ Catálogo de 13 AHA Apps

Cada app tiene **3 niveles comerciales**:

| Nivel | Perfil Técnico | Empaquetado |
|---|---|---|
| **Inicio** | Lite | ZIP + GitHub Pages |
| **Profesional** | Full | .exe + .apk + Pages + Release |
| **Enterprise** | Full custom | .exe + .apk + fuente + UI personalizada + docs + brand.ps1 |

### Listado Completo

| # | App | Descripción | Módulos Clave |
|---|---|---|---|
| 1 | **AHA Inventario** | Gestión de stock, alertas, códigos de barras | usuarios, inventario, dashboard, configuracion |
| 2 | **AHA Comanda** | Pedidos en mesa, pantalla cocina, pagos | usuarios, comandas, inventario, dashboard, configuracion |
| 3 | **AHA CRM** | Clientes, pipeline Kanban, cotizaciones PDF | usuarios, crm, dashboard, configuracion, citas |
| 4 | **AHA Checklist** | Auditorías, inspecciones con fotos y firmas | usuarios, checklist, dashboard, configuracion, campo |
| 5 | **AHA Asistencia** | Control horario QR, turnos, retardos | usuarios, asistencia, dashboard, configuracion, flota |
| 6 | **AHA Citas** | Agenda, reservas, recordatorios | usuarios, citas, crm, dashboard, configuracion |
| 7 | **AHA Creador** | Contenido, ideas, calendario editorial | usuarios, inventario, crm, dashboard, configuracion |
| 8 | **AHA Campo** | Formularios offline, GPS, fotos, sincronización | usuarios, campo, inventario, checklist, flota, dashboard, configuracion |
| 9 | **AHA POS** | Punto de venta, tickets, caja, promociones | usuarios, inventario, comandas, dashboard, configuracion, prefactura |
| 10 | **AHA Rx** | Recetas médicas, historial pacientes | usuarios, rx, dashboard, configuracion |
| 11 | **AHA Flota** | Vehículos, mantenimiento, combustible | usuarios, flota, asistencia, dashboard, configuracion, campo |
| 12 | **AHA Obra** | Proyectos, presupuesto, avance de obra | usuarios, obra, inventario, checklist, campo, flota, dashboard, configuracion, prefactura |
| 13 | **AHA PreFactura** | Presupuestos, facturación electrónica | usuarios, prefactura, crm, dashboard, configuracion |

### 12.1 Problema que Resuelve por App

| App | Frase del cliente (dolor) |
|---|---|
| Inventario | "Perdemos ventas porque no sabemos qué tenemos en existencia hasta que el cliente pregunta." |
| Comanda | "Se nos pierden los pedidos en papel y los meseros pierden tiempo buscando comandas." |
| CRM | "Se me escapan los clientes porque no les doy seguimiento." |
| Checklist | "Los inspectores llenan formatos en papel que se pierden y nadie puede leer." |
| Asistencia | "Los empleados firman en papel y no sabemos quién llega tarde realmente." |
| Citas | "Se me cruzan las citas, pierdo clientes porque no recuerdo cuándo vinieron." |
| Creador | "Tengo mil ideas pero no las organizo y no sé cuánto estoy ganando." |
| Campo | "No sé realmente cuánto estoy gastando en el campo ni qué lote me da más rendimiento." |
| POS | "Cuando no hay internet no puedo cobrar y pierdo la venta." |
| Rx | "Mis recetas se pierden y no tengo historial de lo que receté." |
| Flota | "No sé cuánto gasto en gasolina ni cuándo toca mantenimiento." |
| Obra | "Los gastos se me disparan y no tengo control del avance." |
| PreFactura | "Necesito facturar pero no siempre tengo internet ni quiero pagar suscripción." |

> Todas incluyen: **IA Jutia**, cifrado AES-256, exportación CSV, modo claro/oscuro, 100% offline.

### 12.2 Análisis de Mercado — Top 6 Apps

| # | App | Mercado | Competencia Offline | Ventaja Clave | Precio Sugerido |
|---|---|---|---|---|---|
| 1 | **AHA POS** | Enorme | Media | Pago único vs $195+/mes | **$99 USD** |
| 2 | **AHA Comanda** | Enorme | Baja-Media | Pago único vs $500+/mes | **$99 USD** |
| 3 | **AHA Obra** | Grande | Casi nula | Primero en offline-first | **$99 USD** |
| 4 | **AHA Flota** | Grande | Casi nula | Única offline en español | **$99 USD** |
| 5 | **AHA Asistencia** | Grande | Media | QR + celular, sin HW caro | **$49 USD** |
| 6 | **AHA Campo** | Grande | Casi nula | Única offline para el campo | **$99 USD** |

### 12.3 Caso de Estudio: AHA Citas

| Prueba | Lo que ejercita del stack |
|---|---|
| 5 tablas Dexie con índices | clientes, profesionales, servicios, citas, pagos |
| Cifrado CryptoJS | teléfono, email en clientes |
| IA Jutia Lite | Búsqueda difusa + predicción horas pico |
| UI compleja | Calendario semanal, drag & drop reagendar |
| Exportación | Corte del día en PDF y CSV |
| .exe (Neutralino) | Notificaciones de citas, bandeja sistema |
| .apk (Capacitor) | GPS, cámara, notificaciones locales |

### Cómo Generar una App

```bash
cp apps/AHA-Inventario/template.md specs/mi-inventario.md
/new mi-inventario      # modo Classic (5 fases)
# o
/pro mi-inventario      # modo Design (10 fases)
```

---

## 1️⃣3️⃣ Módulos Compartidos

### 13.1 `usuarios` — Gestión de Usuarios

```javascript
users: 'id, nombre, email, passwordHash, rol, avatar, createdAt, updatedAt'
user_sessions: 'id, userId, token, expiresAt, createdAt'
```

**Roles:** `admin` \| `usuario` \| `invitado`

### 13.2 `configuracion` — Parámetros Globales

```javascript
app_settings: 'key, value, tipo, updatedAt'
app_preferences: 'userId, key, value, updatedAt'
```

### 13.3 `dashboard` — Panel de Métricas

```javascript
dashboard_widgets: 'id, userId, type, title, query, config, createdAt'
dashboard_layout: 'userId, layout, updatedAt'
```

**Widgets:** `chart` \| `metric` \| `list` \| `quickAction`

### 13.4 `inventario` — Stock y Productos

```javascript
productos: 'id, codigo, nombre, descripcion, categoriaId, marcaId, precioCompra, precioVenta, stock, stockMin, unidadMedida, imagen, createdAt, updatedAt'
categorias: 'id, nombre, padreId, createdAt'
marcas: 'id, nombre, createdAt'
movimientos: 'id, productoId, tipo, cantidad, precioUnitario, almacenId, referenceId, userId, createdAt'
almacenes: 'id, nombre, direccion, createdAt'
```

**Movimientos:** `entrada` \| `salida` \| `ajuste`

### 13.5 `comandas` — Pedidos y Mesas

```javascript
mesas: 'id, numero, estado, sectorId, createdAt'
sectores: 'id, nombre, createdAt'
pedidos: 'id, mesaId, userId, estado, total, igv, descuento, observaciones, createdAt, updatedAt'
lineas_pedido: 'id, pedidoId, productoId, cantidad, precioUnitario'
```

**Estados:** `nuevo` → `en-proceso` → `completado` \| `cancelado`

### 13.6 `crm` — Clientes y Oportunidades

```javascript
clientes: 'id, tipo, nombre, email, phone, direccion, ruc, referidoPor, createdAt, updatedAt'
contactos: 'id, clienteId, nombre, email, phone, tipo, createdAt'
oportunidades: 'id, clienteId, titulo, valor, etapa, probabilidad, closeDate, userId, createdAt, updatedAt'
actividades: 'id, oportunidadId, tipo, titulo, fecha, completada, userId'
```

**Etapas:** `prospeccion` → `calificacion` → `propuesta` → `negociacion` → `cerrado-ganado/perdido`

### 13.7 `checklist` — Auditorías e Inspecciones

```javascript
plantillas_checklist: 'id, nombre, items, createdAt'
items_checklist: 'id, plantillaId, texto, obligatorio, orden'
inspecciones: 'id, plantillaId, titulo, estado, userId, fechaInicio, fechaFin, createdAt'
respuestas: 'id, inspeccionId, itemId, respuesta, observacion, fotoPath'
```

### 13.8 `asistencia` — Control Horario

```javascript
turnos: 'id, userId, fecha, horaEntrada, horaSalida, estado, motivo'
marcas: 'id, turnoId, tipo, hora, ubicacionId'
ubicaciones: 'id, nombre, lat, lng'
```

**Marcas:** `entrada` \| `salida` \| `descanso-inicio` \| `descanso-fin`

### 13.9 `citas` — Agenda y Reservas

```javascript
servicios: 'id, nombre, duracion, precio, createdAt'
citas: 'id, clienteId, servicioId, userId, fechaHora, duracion, estado, notas, createdAt, updatedAt'
```

### 13.10 `flota` — Vehículos

```javascript
vehiculos: 'id, placa, marca, modelo, año, tipo, combustible, kilometraje, estado, createdAt'
mantenimientos: 'id, vehiculoId, tipo, fecha, costo, descripcion, proxMantenimiento, estado'
conductor_asignado: 'vehiculoId, userId, asignadoAt'
```

### 13.11 `rx` — Recetas Médicas

```javascript
recetas: 'id, pacienteId, medicoId, fecha, diagnostico, estado, pdfPath, createdAt'
lineas_receta: 'id, recetaId, medicamentoId, dosis, frecuencia, duracion, instrucciones'
medicamentos: 'id, codigo, nombre, laboratorio, stock, precio'
```

### 13.12 `prefactura` — Facturación

```javascript
presupuestos: 'id, clienteId, numero, fecha, vencimiento, subtotal, igv, descuento, total, estado, userId'
lineas_presupuesto: 'id, presupuestoId, productoServicioId, tipo, descripcion, cantidad, precioUnitario'
facturas: 'id, presupuestoId, numero, serie, fechaEmision, hashDocumento, xmlPath, pdfPath'
```

### 13.13 `campo` — Formularios Offline

```javascript
formularios: 'id, codigo, nombre, campos, configuracion'
respuestas_form: 'id, formularioId, userId, datos, ubicacion, fecha, sincronizado, createdAt'
```

### Matriz Módulos × Apps

| Módulo | Inv | Com | CRM | Chk | Asis | Cit | Cread | Campo | POS | Rx | Flota | Obra | PreF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| usuarios | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| configuracion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| inventario | ✅ | ✅ | | | | | ✅ | ✅ | ✅ | | | ✅ | |
| comandas | | ✅ | | | | | | | ✅ | | | | |
| crm | | | ✅ | | | ✅ | ✅ | | | | | | |
| checklist | | | | ✅ | | | | ✅ | | | | ✅ | |
| asistencia | ✅ | | | | ✅ | | | ✅ | | | ✅ | | |
| citas | | | ✅ | | | ✅ | | | | | | | |
| flota | | | | | ✅ | | | ✅ | | | ✅ | ✅ | |
| rx | | | | | | | | | | ✅ | | | |
| prefactura | | | ✅ | | | | | | | | | ✅ | ✅ |
| campo | | | | | | | | ✅ | | | | ✅ | |

---

## 1️⃣4️⃣ Pipeline – Flujo de Trabajo

### Modo Classic (`/new`) — 5 Fases

```
1. Setup (setup-init)
   ├─ Valida entorno
   ├─ Crea estructura de directorios
   ├─ Genera archivos predeterminados
   └─ Descarga librerías

2. Spec (spec-engine)
   ├─ Lee template de app
   ├─ Genera specs/[app].md (15 secciones)
   └─ Genera specs/DESIGN.md

3. Design (design-engine)
   ├─ Inyecta brand context
   ├─ Aplica tokens DaisyUI
   └─ Selecciona componentes UI

4. Code (code-generator)
   ├─ FASE A: Core + index.html + project.config.js
   ├─ FASE B: Módulos uno por turno
   └─ Validación automática de compliance

5. Validate + Deploy
   ├─ Compliance check
   ├─ Brand audit
   ├─ QA rubric
   └─ Empaquetado + publicación
```

### Modo Design (`/pro`) — 10 Fases

```
 1. taste    → omd:taste
 2. init     → omd:init (DESIGN.md)
 3. design   → design-engine
 4. spec     → spec-engine
 5. code     → code-generator
 6. inject   → omd:apply + omd:harness
 7. review   → omd:designer-review
 8. QA       → omd:final-qa
 9. pack     → deployment-jigue
10. deploy   → GitHub Pages / Release
```

### 14.1 Paso a Paso por Perfil

**Inicio (Lite) — ~10-15 min:**
```
/new → /setup → /spec → /build → /test → /deploy
Resultado: index.html funcional, ZIP distribuible, Pages online
```

**Profesional (Full) — ~20-30 min:**
```
/new (perfil Full) → /setup → /spec (con marca) → /build → /test → /deploy
Resultado: .exe nativo (~2MB) + .apk nativo + Pages + IA Full
```

**Enterprise — ~30-45 min:**
```
Pasos 1-5: igual que Profesional
Paso 6: brand.ps1 -AppName "ClienteX"
Paso 7: Recompilar con marca
Resultado: .exe + .apk + fuente + docs + brand.ps1
```

### 14.2 ¿Classic o Design?

| Pregunta | Classic | Design |
|---|---|---|
| ¿Es un prototipo rápido? | ✅ | ❌ |
| ¿Tiene requisitos de marca? | ❌ | ✅ |
| ¿La usará un equipo? | ❌ | ✅ |
| ¿Necesita assets visuales? | ❌ | ✅ |
| ¿Son < 5 módulos? | ✅ | ✅ |

### 14.3 Casos de Uso

**Caso 1: Prototipo rápido** (Lite, /new) — App de Notas, 4 módulos, ~15-20 min
**Caso 2: App producción** (Full, /pro) — Gestión Clínica, 5 módulos, ~45-60 min
**Caso 3: Landing page** (Lite) — 5 secciones, LH 95/100, ~10-15 min
**Caso 4: Refactor UX** (/refactor) — Auto-corrige desviaciones de diseño, ~20-30 min
**Caso 5: Wiki + Preferencias** (/wiki) — Captura decisiones, ~5-10 min
**Caso 6: Mini IA** (/ia) — Añade IA Jutia Full a app existente, ~10-15 min

---

## 1️⃣5️⃣ Comandos Slash

| Comando | Trigger | Efecto |
|---|---|---|
| `/new` | `nuevo proyecto` | Pipeline Classic completo |
| `/pro` | `pipeline potenciado` | Pipeline Design (10 fases) |
| `/setup` | `iniciar setup` | Crea estructura + instala librerías |
| `/spec` | `definir spec app` | spec-engine |
| `/build` | `generar codigo` | code-generator |
| `/test` | `validar app` | validation-engine |
| `/validate` | `validar diseño` | Brand audit |
| `/refactor` | `refactorizar ux` | Auto-corrige desviaciones |
| `/compliance` | — | stack-compliance-guard manual |
| `/status` | — | Lee pipeline state |
| `/archive` | — | Mueve spec + reporte a archive/ |
| `/docs` | — | Abre guía de estudio |
| `/ia` | `mini ia` | Activa ia-jutia |
| `/deploy` | `publicar` | deployment-jigue |
| `/wiki` | `gestionar wiki` | wiki-engine |
| `/upgrade` | `actualizar perfil` | upgrade-engine |

---

## 1️⃣6️⃣ Instalación Global

```powershell
# Instalar (sin administrador)
.\install-global.ps1

# Desinstalar (sin dejar rastro)
.\uninstall-global.ps1
```

**Efecto:**
- 13 directory junctions en `~/.opencode/skills/`
- Skills se actualizan solas al hacer `git pull`
- Comandos disponibles desde cualquier directorio

---

## 1️⃣7️⃣ Herramientas de Desarrollo (Engram + OpenPencil)

Opcionales. El pipeline funciona 100% sin ellas.

### Engram — Memoria Persistente

| Concepto | Descripción |
|---|---|
| **¿Qué es?** | Memoria persistente SQLite+FTS5 para agentes de IA |
| **Instalación** | Binary de [GitHub Releases](https://github.com/Gentleman-Programming/engram/releases) |
| **Config** | `scripts/setup-engram.ps1` |
| **MCP** | `engram.exe mcp --project Ateje` — 20 tools |
| **Fallback** | Markdown en `wiki/` + `.omd/preferences.md` |

**Mapeo wiki-engine → Engram:**

| wiki-engine acción | Engram tool | Calidad |
|---|---|---|
| Guardar página wiki | `mem_save` | Decisiones no se pierden entre sesiones |
| Guardar preferencia | `mem_save` | "No uses mayúsculas en CTAs" se recuerda |
| Buscar conocimiento | `mem_search` | Especs anteriores como referencia |
| Contexto de sesión | `mem_context` | "¿Qué estábamos haciendo?" |
| Detectar conflictos | `mem_compare` | Advertencia si dices algo contradictorio |
| Timeline de decisiones | `mem_timeline` | Trazabilidad completa |

**Anti-patrones que evitar:**

| ❌ Anti-patrón | ✅ Alternativa |
|---|---|
| "Primero código, luego diseño" | "Primero preview con OpenPencil" |
| "Confiar en que el agente recuerde" | Engram guarda automáticamente |
| "OpenPencil como dependencia crítica" | Opcional, siempre hay fallback |
| "Editar DESIGN.md a mano" | Re-extraer tokens con OpenPencil |

### OpenPencil — Diseño Visual

| Concepto | Descripción |
|---|---|
| **¿Qué es?** | Editor visual Figma-compatible + CLI |
| **Componentes** | Desktop App (Tauri) + CLI (`npm i -g @open-pencil/cli`) |
| **Instalación** | `npm i -g @open-pencil/cli` + Desktop desde releases |
| **MCP** | `openpencil-mcp` — 90+ tools (requiere Desktop) |

**Flujo de extracción de tokens:**
```bash
openpencil analyze colors brand.fig --json > assets/brand/tokens-colors.json
openpencil analyze typography brand.fig --json > assets/brand/tokens-typography.json
openpencil preview brand.fig --output docs/preview-brand.html
```

### ¿Cuándo activarlas?

| Herramienta | Beneficio |
|---|---|
| **Engram** | Memoria persistente entre sesiones, 20 tools MCP |
| **OpenPencil** | Tokens de diseño automáticos, preview visual |

---

## 1️⃣8️⃣ Buenas Prácticas

### Código
- ✅ Stack Compliance Guard (sin imports ES6, rutas relativas)
- ✅ `dbLocal()` para lectura instantánea desde IndexedDB
- ✅ Sincronización en background con `Promise.all()`
- ✅ `bulkAdd()` en vez de `for await add()`

### UI/UX
- ✅ Skeletons CSS (`.sk-el`, `.sk-card`, `.sk-row`) en vez de spinners
- ✅ `Alpine.store('loading', ...)` ANTES de que Alpine procese el DOM
- ✅ `checkSession()` leer de IndexedDB primero
- ✅ Forms en modal con `UI.modalForm()`
- ✅ Feedback con `UI.toast()` (nunca `alert()`)

### Datos
- ✅ UUID string (no `++id`) + `createdBy` + `createdAt` + `updatedAt`
- ✅ Campos sensibles cifrados vía `cryptoHelpers.encrypt()`
- ✅ Operaciones Dexie en lotes de 200
- ✅ Archivos gestionados vía `FileStore`

### Perfiles
- ✅ Solo existe upgrade Lite → Full (no al revés)
- ✅ NeutralinoJS es runtime Full único
- ✅ No modificar módulos/datos al migrar perfil

---

## 1️⃣9️⃣ Análisis de Mercado — Top 6 Apps

### Análisis Competitivo

**AHA POS — Punto de Venta**
Competidores directos: Eleventa ~$75 USD (solo Windows), Tasven ~$260 USD. Cloud: Pulpos ~$499/mes, Comercio Fácil ~$195/mes.

**AHA Comanda — Restaurantes**
Directos: Pagotaco ~$45 USD (solo Windows). Cloud: Loggro Restobar ~$979/mes, Plick ~$379/mes.

**AHA Obra — Construcción**
Mercado casi virgen. Buildertrend $499/mes, Procore $599+/mes (todos cloud, en inglés).

**AHA Flota — Vehículos**
GPS Tracking $200-500/mes + hardware. Sin competencia offline.

**AHA Asistencia — Control Horario**
Relojes biométricos $3,000-8,000 MXN HW. QR + celular = cero inversión.

**AHA Campo — Control Agrícola**
Agroptima ~$30/mes. Mercado desatendido en LATAM.

---

## 2️⃣0️⃣ Estrategia de Venta

### Manifiesto

| Concepto | Lo que ofreces |
|---|---|
| Pago | **Único.** Nunca mensualidad |
| Formatos | .exe (Windows) + .apk (Android) + ZIP (GitHub Pages) |
| Internet | Cero necesario |
| Datos | 100% locales, cifrados con AES-256 |
| Precio | Según complejidad, no por usuario |

### Stack traducido a venta

| Tecnología | Le dices al cliente |
|---|---|
| Alpine.js | "La app responde al instante, como una app nativa" |
| Dexie.js | "Tus datos nunca suben a ningún servidor" |
| CryptoJS AES-256 | "Ni yo puedo ver tus datos" |
| NeutralinoJS | "Un solo .exe (~2MB). No necesitas Java, Node, ni nada" |
| Capacitor | "La misma app en .apk nativo con SQLite, cámara, GPS" |
| IA Jutia | "Tu app tiene inteligencia propia. Sin internet, sin enviar datos" |

### Modelo de Precios

| Nivel | Precio USD | Incluye |
|---|---|---|
| Inicio (Lite) | $39–$79 | ZIP + GitHub Pages, IA Lite |
| Profesional (Full) | $79–$199 | .exe + .apk, SQLite, IA Full, plugins |
| Enterprise | $199–$499 | White-label, código fuente, brand.ps1 |

### Precios Sugeridos por App

| App | Inicio | Profesional | Enterprise |
|---|---|---|---|
| AHA Inventario | $49 | $99 | $299 |
| AHA Comanda | $49 | $99 | $299 |
| AHA CRM | $59 | $129 | $399 |
| AHA Checklist | $39 | $79 | $199 |
| AHA Asistencia | $39 | $79 | $199 |
| AHA Citas | $49 | $99 | $299 |
| AHA Creador | $49 | $99 | $299 |
| AHA Campo | $59 | $149 | $399 |
| AHA POS | $49 | $99 | $299 |
| AHA Rx | $59 | $149 | $399 |
| AHA Flota | $79 | $199 | $499 |
| AHA Obra | $79 | $199 | $499 |
| AHA PreFactura | $39 | $79 | $199 |

### Argumentos de Venta — Frases para WhatsApp

| Situación | Respuesta |
|---|---|
| "¿Cuánto cuesta al mes?" | "Nada. Pagas una sola vez y la app es tuya para siempre" |
| "¿Y si pierdo internet?" | "La app funciona sin internet. Tus datos están en tu PC" |
| "¿Puedo tenerla en mi celular?" | "Sí. La misma app en .apk para Android" |
| "¿Necesito pagar por cada usuario?" | "No. La pagas una vez y la usan los que quieras" |
| "¿Es seguro?" | "AES-256, el mismo estándar que usan los bancos" |
| "¿Tiene IA?" | "Sí. Mini IA incluida, sin internet, sin costo extra" |

---

## 2️⃣1️⃣ Troubleshooting

### "El pipeline se detuvo en fase X"
Causa: pérdida de contexto de OpenCode (>15k tokens).
```
Solución: /status para ver fase → reanudar con /setup, /spec, /build o /test
```

### "No tengo OmD instalado"
```
Síntoma: pipeline-engine dice "OmD no disponible, fallback a Classic"
Solución: npx oh-my-design-cli install-skills --agent opencode --global
```

### "Error de compliance — CDN/import detectado"
```
Solución: Descargar librería a assets/js/libs/, reemplazar CDN, /compliance
```

### "Perdí contexto y no sé qué módulo falta"
```
/status → muestra fase actual (ej: BUILD módulo 3/4)
/build → reanuda desde módulo 3
```

### "Quiero descartar todo y empezar de nuevo"
```
/archive → mueve spec + reporte a archive/
/new → empieza nuevo pipeline
```

### "Mi app no abre con doble clic (perfil Lite)"
Posibles causas: rutas absolutas, fetch() a API externa, type="module", CORS.
```
/compliance → detecta y corrige automáticamente
```

---

## 2️⃣2️⃣ Referencia Rápida

### Archivos Generados

| Archivo | Contenido | Generado por |
|---|---|---|
| `project.config.js` | Config del proyecto | setup-init |
| `specs/[app].md` | Spec funcional + DESIGN.md | spec-engine |
| `core/app.js` | Router + store Alpine | code-generator |
| `core/db.js` | Schema Dexie + CryptoJS | code-generator |
| `modules/*/module.html` | UI del módulo | code-generator |
| `modules/*/module.js` | Lógica del módulo | code-generator |
| `.omd/preferences.md` | Preferencias de diseño | design-engine / wiki-engine |
| `docs/validacion-[app].md` | Reporte de validación | validation-engine |
| `dist/[app].zip` | Paquete Lite | deployment-jigue |
| `dist/[app].exe` | Ejecutable Full | deployment-jigue |

### Resumen Visual del Pipeline

```
/nuevo proyecto
│
├─ /new (Classic) ─────────────────────┐
│   setup → spec → build → deploy      │
│   5 fases, prototipos rápidos         │
└──────────────────────────────────────┘
│
├─ /pro (Design) ──────────────────────┐
│   10 fases + OmD brand layer         │
│   Apps producción con marca          │
└──────────────────────────────────────┘
│
├─ Comandos individuales ──────────────┐
│   /setup  /spec  /build  /test       │
│   /refactor  /deploy  /wiki  /ia     │
└──────────────────────────────────────┘
```

---

> **Documentación unificada del Stack Ateje.**
>
> Fuentes consolidadas: guia-estudio-ateje.md, stack-completo.md, guia-stack-skills-layer.md,
> guia-integracion-engram-openpencil.md, analisis-repos-externos.md, Catalogo app AHA.md,
> landing-aha-sell.md, top-6-apps-potencial-venta.md, SaaS.md, nuevo-stack-ateje.md,
> integracion-oh-my-design.md, erd-plataforma-pagos-fiscales.md, recomendacion-aha-citas.md.
>
> Última actualización: junio 2026
