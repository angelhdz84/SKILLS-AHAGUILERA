# Guia de Estudio - Stack Ateje

> **Objetivo:** Tener una vision completa y practica del Stack Ateje, sus componentes, flujos y buenas practicas, para usarlo, extenderlo y explicarselo a desarrolladores nuevos.

---

## Indice

1. [Vision General](#1-vision-general)
2. [Arquitectura](#2-arquitectura)
3. [Perfiles Lite vs Professional vs Business](#3-perfiles-lite-vs-professional-vs-business)
4. [Estructura del Repositorio](#4-estructura-del-repositorio)
5. [Core - Archivos Fundamentales](#5-core---archivos-fundamentales)
6. [Tablas de Sistema](#6-tablas-de-sistema)
7. [project.config.js - Schema White-Label](#7-projectconfigjs---schema-white-label)
8. [UI Padrones](#8-ui-padrones)
9. [Command Palette (Cmd+K)](#9-command-palette-cmdk)
10. [FileStore - Gestion de Archivos](#10-filestore---gestion-de-archivos)
11. [IA Jutia - Plugin de Inteligencia Artificial](#11-ia-jutia---plugin-de-inteligencia-artificial)
12. [Catalogo de 15 AHA Apps](#12-catalogo-de-15-aha-apps)
13. [Verticales de Negocio](#13-verticales-de-negocio)
14. [Modulos Compartidos](#14-modulos-compartidos)
15. [Pipeline / Flujo de Trabajo](#15-pipeline--flujo-de-trabajo)
16. [Comandos Slash](#16-comandos-slash)
17. [Sistema de Licencias](#17-sistema-de-licencias)
18. [Instalacion Global](#18-instalacion-global)
19. [MCP Servers](#19-mcp-servers)
20. [Herramientas de Desarrollo (Engram + OpenPencil)](#20-herramientas-de-desarrollo-engram--openpencil)
21. [Configuracion opencode.json](#21-configuracion-opencodejson)
22. [Tests](#22-tests)
23. [Deploy / Niveles de Entrega](#23-deploy--niveles-de-entrega)
24. [Buenas Practicas](#24-buenas-practicas)

---

## 1. Vision General

| Concepto | Descripcion |
|---|---|
| **Que es?** | Meta-repo que agrupa **skills** y **engines** OpenCode para generar aplicaciones **offline-first** desde cero. |
| **Que genera?** | Apps con frontend Alpine.js + DaisyUI, backend Dexie (IndexedDB), cifrado CryptoJS, y tres perfiles de empaquetado. |
| **Stack tecnico** | Alpine.js 3.x + Tailwind Browser 4 + DaisyUI 5.x + Dexie 4.x + CryptoJS + Chart.js 4.x + Bootstrap Icons + pako + jsPDF + SheetJS |
| **Perfiles** | **Lite** (file:// doble clic, ZIP+Pages), **Professional** (Neutralino .exe + .apk), **Business** (.exe + .apk + white-label) |
| **Idioma** | Espanol latino (microcopy profesional via `omd:es-writer`) |

### Principios Arquitectonicos

- **Offline-first**: Todo funciona sin internet. La sincronizacion es un anadido, no un requisito.
- **Skill-Layer Architecture**: 5 engines orquestadores + 9 standalone + 1 writer + 16 OmD
- **Single Source of Truth**: Las plantillas de apps estan en `apps/AHA-*/template.md`.
- **Perfiles progresivos**: Inicio (Lite, ZIP+Pages) -> Profesional (Professional, .exe+.apk) -> Enterprise (Business, .exe+.apk+white-label).
- **95% UI compartida**: El frontend (Alpine + DaisyUI) es casi identico entre perfiles.

---

## 2. Arquitectura

### Capas del Stack

```
+-----------------------------------------------------+
|            PIPELINE ENGINE                           |  Orquestador maestro
|    (Classic: 5 fases / Design: 10 fases)             |
+-----------------------------------------------------+
|  +----------+ +----------+ +-----------+             |
|  |  Spec    | |  Design  | | Validation|             |  Engines
|  |  Engine  | |  Engine  | |  Engine   |             |
|  +----------+ +----------+ +-----------+             |
|  +----------+ +----------+                           |
|  |   Wiki   | | Upgrade  |                           |
|  |  Engine  | |  Engine  |                           |
|  +----------+ +----------+                           |
+-----------------------------------------------------+
|  +----------+ +----------+ +-----------+             |
|  |  Setup   | |   Code   | | Compliance|             |  Standalone
|  |  Init    | | Generator| |   Guard   |             |  Skills
|  +----------+ +----------+ +-----------+             |
|  +----------+ +----------+ +-----------+             |
|  |Deployment| | IA Jutia | |  Alpine   |             |
|  |  Jigue   | | (Plugin) | |   UI Pat  |             |
|  +----------+ +----------+ +-----------+             |
|  +----------+ +----------+                           |
|  |Capacitor | | Upgrade  |                           |
|  |(Prof/Bus)| |  Engine  |                           |
|  +----------+ +----------+                           |
+-----------------------------------------------------+
|         16 Skills Oh My Design (OmD)                 |  Diseno
|  (init, taste, apply, harness, sync, learn,          |
|   remember, es-writer, designer-review, QA...)       |
+-----------------------------------------------------+
```

### Motores (Engines)

| Motor | Proposito | Reemplaza a |
|---|---|---|
| **pipeline-engine** | Orquestador maestro: Classic (5 fases, `/new`) y Design (10 fases, `/pro`) | prompt-inicial, supercharged-pipeline, omd:harness, omd:orchestrator |
| **spec-engine** | Spec funcional + DESIGN.md brand layer con 286 referencias oh-my-design | spec-creator, omd:init, omd:taste |
| **design-engine** | Brand context injection + tokens DaisyUI/alpine-ui-patterns + extraccion de tokens via OpenPencil (opcional, Business) + captura de preferencias persistentes + decision tree component_library | design-ux-intelligence, daisyui-patterns, omd:apply, omd:sync, omd:remember, omd:learn |
| **validation-engine** | 4 fases: compliance -> brand audit -> DevTools/Playwright -> QA rubric + modo refactor | validation-offline, ux-refactor, omd:designer-review, omd:final-qa |
| **wiki-engine** | Wiki persistente + preferencias de diseno `.omd/preferences.md` + MCP memory (Engram opcional) | llm-wiki, omd:remember, omd:learn |

### Skills Standalone

| Skill | Proposito | Perfiles |
|---|---|---|
| **setup-init** | Valida entorno, crea estructura, instala librerias. Genera defaults avatar/placeholder en `data/` | lite, professional, business |
| **code-generator** | Genera codigo por fases desde specs, un modulo por turno. **20 templates core** (app, db, crypto, ui, theme, main, sw, manifest, a11y, focus-trap, responsive, bottom-nav, push-manager, analytics, sync, backup-manager, env, network, export, license) | lite, professional, business |
| **stack-compliance-guard** | Guarda automatica: bloquea imports, CDNs, fetch, crypto faltante | lite, professional, business |
| **deployment-jigue** | Commit + push + empaquetado segun perfil (Essential/Professional/Business). CI/CD validation: GitHub Actions test.yml + deploy-pages.yml con test gate | lite, professional, business |
| **ia-jutia** | Mini IA v0.2 como **plugin unificado**: FlexSearch + highlight/autocomplete/exportPDF (IA Lite) / +OCR + chat threads + hybrid search (IA Full). Un solo `module.js` + `ia-core.js` + `ia-chat.js` + tools extensibles | lite, full |
| **alpine-ui-patterns** | Catalogo unificado ~100 componentes Alpine.js de Pines/Penguin/Pinemix con fallback chain + prioridad por calidad | lite, full |
| **capacitor** | Empaquetado .apk Android nativo con Capacitor. Incluye SQLite FTS5, camara, GPS, notificaciones, compartir | professional, business |
| **upgrade-engine** | Migra app entre perfiles Lite/Professional/Business e IA Lite/Full. No modifica modulos ni datos, solo infraestructura | lite, professional, business |

### Skills Externas (oh-my-design + es-writer, en `~/.opencode/skills/`)

| Skill | Proposito | Perfiles |
|---|---|---|
| `omd:init` a `omd:learn` (16 skills) | Catalogo de 286 referencias de diseno reales (DESIGN.md de Stripe, Linear, Vercel, etc.). Consumidas por los engines, ejecucion delegada a sub-agentes OpenCode. | lite, full |
| `omd:es-writer` | Microcopy profesional en espanol latino. 6 presets de voz. Integrado en pipeline-engine Fase 6 (modo Design). | lite, full |

### Skills Archivadas (movidas a `archived/`)

Las siguientes skills fueron reemplazadas por engines y archivadas:

`prompt-inicial/`, `supercharged-pipeline/`, `spec-creator/`, `design-ux-intelligence/`, `validation-offline/`, `ux-refactor/`, `llm-wiki/`, `daisyui-patterns/`, `github-page-publish/`

---

## 3. Perfiles Lite vs Professional vs Business

| Caracteristica | Lite | Professional | Business |
|---|---|---|---|
| **Runtime** | Doble clic `index.html` (file://) | NeutralinoJS (.exe) + Capacitor (.apk) | NeutralinoJS (.exe) + Capacitor (.apk) + white-label |
| **Base de datos** | Dexie (IndexedDB) | Dexie + SQLite (FTS5) | Dexie + SQLite (FTS5) |
| **Archivos** | Blobs en Dexie (`_file_blobs`) | Disco (`APP_DATA_DIR`) | Disco (`APP_DATA_DIR`) |
| **IA Jutia** | FlexSearch + estadisticas + predicciones | IA Full (ocasional IA Lite) | IA Full |
| **Cifrado** | CryptoJS (campos sensibles) | CryptoJS | CryptoJS |
| **Empaquetado** | ZIP + GitHub Pages | .exe + .apk (~30MB ZIP) | .exe + .apk + white-label + docs (~35MB ZIP) |
| **HTML visible?** | Si (demo/vitrina) | No (.exe + carpeta) | No (codigo fuente no incluido) |
| **Nivel comercial** | Inicio | Profesional | Enterprise |
| **PWA / Nativo** | Service Worker opcional | Nativo Neutralino | Nativo Neutralino + Capacitor |

**Regla importante:** El upgrade entre perfiles solo anade infraestructura. Nunca modifica modulos ni datos.

---

## 4. Estructura del Repositorio

```
Ateje/
|
+-- AGENTS.md                    # Instrucciones del agente OpenCode
+-- project.config.js            # Template de config white-label
+-- install-global.ps1           # Instalacion global (junctions)
+-- uninstall-global.ps1         # Desinstalacion global
+-- opencode.json                # Config OpenCode (agentes, MCP, skills)
|
+-- core/                        # (generado por code-generator)
|   +-- db.js                    # Dexie init + tablas de sistema
|   +-- crypto.js                # Encrypt/decrypt + uuid
|   +-- ui.js                    # Toast, confirm, modalForm, loading
|   +-- theme.js                 # CSS variables desde project.config.js
|   +-- app.js                   # Router hash-based, carga modulos
|   +-- search-palette.js        # Command Palette (Cmd+K) global
|   +-- file-store.js            # Gestion de archivos (Lite/Professional/Business)
|   +-- sync.js                  # Export/import .ateje-backup
|   +-- network.js               # Monitoreo de conectividad
|
+-- apps/                        # Plantillas de 15 AHA Apps (14 negocio + 1 dev template)
|   +-- AHA-Inventario/template.md    AHA-Comanda/template.md
|   +-- AHA-CRM/template.md          AHA-Checklist/template.md
|   +-- AHA-Asistencia/template.md   AHA-Citas/template.md
|   +-- AHA-Gastos/template.md       AHA-Contactos/template.md
|   +-- AHA-Campo/template.md        AHA-POS/template.md
|   +-- AHA-Rx/template.md           AHA-Flota/template.md
|   +-- AHA-Obra/template.md         AHA-PreFactura/template.md
|
+-- engines/                     # Skills de orquestacion (5 motores)
|   +-- pipeline-engine/SKILL.md
|   +-- spec-engine/SKILL.md
|   +-- design-engine/SKILL.md
|   +-- validation-engine/SKILL.md
|   +-- wiki-engine/SKILL.md
|
+-- skills/                      # Skills standalone (9 directorios + 1 writer)
|   +-- setup-init/       code-generator/       stack-compliance-guard/
|   +-- deployment-jigue/ ia-jutia/             alpine-ui-patterns/
|   +-- capacitor/        upgrade-engine/
|
+-- code-generator/templates/    # 20 templates core + patrones de modulo
|   +-- core/                    # app.js, db.js, crypto.js, ui.js, theme.js, main.js,
|   |                            # sw.js, manifest.json, a11y.js, focus-trap.js,
|   |                            # responsive.js, bottom-nav.js, push-manager.js,
|   |                            # analytics.js, sync.js, backup-manager.js,
|   |                            # env.js, network.js, export.js, license.js
|   +-- search-palette.js
|   +-- file-store.js
|   +-- delete.js
|
+-- ia-jutia/templates/          # Templates de la IA Jutia
|   +-- plugin/                  # Plugin unificado (module.js, ia-core.js, ia-chat.js, tools/)
|   +-- archived/                # Versiones viejas (lite/ y full/ separados)
|
+-- component-examples/          # Componentes UI de ejemplo (Pines)
|   +-- pines/                   # ~40 componentes avanzados
|
+-- data/                        # (generado) Datos de la app
|   +-- defaults/                # avatar.svg, placeholder.svg, README.md
|
+-- docs/                        # Documentacion del stack
|   +-- guia-estudio-ateje.md    # ESTA GUIA
|   +-- stack-completo.md        # Documentacion completa de referencia
|   +-- API.md                   # API Reference (auto-generado)
|   +-- ...                      # Otros docs
|
+-- specs/                       # (generado) Specs de apps
+-- archived/                    # 9 skills reemplazadas por engines
+-- tests/                       # Tests E2E (Playwright)
+-- .github/workflows/           # CI/CD
+-- .opencode/                   # Configuracion local OpenCode
|   +-- rules/                   # STACK.md, PIPELINE.md, TOOL_USAGE.md, RESPONSE_STYLE.md
|   +-- plans/                   # Planes de implementacion
|   +-- prompts/                 # Prompts de agentes
+-- scripts/                     # Scripts de utilidad
|   +-- license.js               # Generador de licencias .aha (/licencia)
|   +-- generate-docs.js         # Generador de docs/API.md (/docs-gen)
|   +-- setup-engram.ps1         # Setup de Engram
|   +-- setup-opencil.ps1        # Setup de OpenPencil
```

**Directorios NO versionados** (output de engines): `docs/` (excepto guias), `specs/`, `wiki/`, `.omd/`

---

## 5. Core - Archivos Fundamentales

### `core/db.js`

Inicia Dexie con todas las tablas de negocio + tablas de sistema.

```javascript
const db = new Dexie('AppDB');

// Tablas de sistema (siempre incluidas)
db.version(1).stores({
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path'    // Solo perfil Lite
});

// Las tablas de negocio se anaden dinamicamente segun spec
```

### `core/crypto.js`

Cifrado de campos sensibles + generador UUID v4 compatible file://.

```javascript
window.cryptoHelpers = {
  encrypt(texto)     -> string cifrado en base64,
  decrypt(cifrado)   -> string original,
  generarClave()     -> clave aleatoria de 32 caracteres
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

API estandar de UI expuesta en `window.UI`.

```javascript
window.UI = {
  toast(msg, tipo = 'info', duracion = 4000),      // success | error | warning | info
  confirm(msg, titulo = 'Confirmar'),                // Promise<boolean>
  modalForm(titulo, html, onSave),                   // Formulario en <dialog>
  loading(show = true),                              // Overlay de carga
  formatDate(date),                                  // "24 jun 2026"
  formatCurrency(n),                                 // "$1,234.00"
  formatBytes(bytes),                                // "1.5 MB"
  formatRelative(date)                               // "hace 2 horas"
};
```

**Reglas obligatorias:**
- Feedback siempre con `UI.toast()`, NUNCA `alert()` nativo
- Antes de `db.delete()`, SIEMPRE `UI.confirm()`
- Todos los formularios crear/editar via `UI.modalForm()`
- Operaciones largas con `UI.loading(true/false)`

### `core/theme.js`

Inyecta CSS variables desde `APP_CONFIG.tema.colores`. Expone `window.themeStore` con Alpine store para cambio dinamico de tema.

### `core/app.js`

Router hash-based para navegacion SPA sin dependencias externas.

```javascript
window.appRouter = {
  load(moduloId) {             // Carga modulo por hash
    window.location.hash = moduloId;
  },
  init() {
    window.addEventListener('hashchange', () => this._cargarModulo());
    this._cargarModulo();
  },
  _cargarModulo() { /* renderiza module.html + ejecuta module.js */ }
};

window.MODULES = {};  // Registro de modulos cargados
```

### `core/search-palette.js`

Command Palette global (Ctrl+K / Cmd+K) para navegacion de modulos + busqueda IA.

- **Atajo:** `Ctrl+K` o `Cmd+K` (global, no interfiere con inputs)
- **Navegacion:** Flechas arriba/abajo + Enter
- **Cierre:** Escape o click fuera
- **IA integrada:** Si `window.ia` existe, muestra resultados de FlexSearch

El componente Alpine renderiza via `x-teleport="body"` con markup DaisyUI.

### `core/file-store.js`

Gestion unificada de archivos con dos backends segun perfil.

```javascript
window.FileStore = {
  APP_DATA_DIR: 'data/',
  async save(tipo, nombre, blob)    -> { path, hash, url },
  async getURL(path)                -> string (URL para <img> o <a>),
  async read(path)                  -> Blob,
  async delete(path),
  async meta(path)                  -> metadata desde db._files,
  async cleanOrphans()              -> numero de huerfanos eliminados,
  avatarDefault()                   -> ruta al avatar por defecto,
  revokeAll()                       -> libera todas las ObjectURL
};
```

**Backend Lite:** Almacena blobs en tabla Dexie `_file_blobs`. `getURL()` retorna ObjectURL.

**Backend Professional/Business:** Escribe a disco en `APP_DATA_DIR`. `getURL()` retorna ruta real.

### `core/sync.js`

Motor de respaldo unificado. Exporta todas las tablas Dexie a archivo `.ateje-backup` cifrado y comprimido, y restaura en cualquier perfil.

- Incluye archivos (metadatos + blobs en Lite, rutas en Professional/Business)
- Cifrado AES con CryptoJS
- Compresion con pako (gzip)

---

## 6. Tablas de Sistema

### `_files`

Metadatos de todos los archivos gestionados por FileStore.

```javascript
_files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt'
```

| Campo | Tipo | Descripcion |
|---|---|---|
| `path` | string | Ruta relativa a APP_DATA_DIR, ej: "avatars/uuid-user.jpg" |
| `tipo` | string | 'avatar' \| 'foto' \| 'doc' \| 'logo' \| 'backup' |
| `nombre` | string | Nombre original del archivo |
| `mime` | string | Tipo MIME (image/png, application/pdf, etc.) |
| `size` | number | Tamano en bytes |
| `hash` | string | SHA-256 hex (para dedup en import) |
| `refCount` | number | Contador de referencias desde registros de negocio |

### `_file_blobs` (Lite only)

```javascript
_file_blobs: '&path'
```

Almacena los blobs binarios cuando no hay acceso a disco (file://).

---

## 7. project.config.js - Schema White-Label

```javascript
window.APP_CONFIG = {
  // Seccion app (siempre)
  app: {
    nombre: 'MiApp',
    version: '1.0.0',
    tipo: 'inventario',
    descripcion: 'App de inventario'
  },

  // Perfil
  perfil: 'lite',            // 'lite' | 'professional' | 'business'
  iaJutia: { perfil: false }, // { perfil: 'lite' } | { perfil: 'full' } | { perfil: false }

  // Modulos activos
  modulosActivos: ['usuarios', 'inventario', 'dashboard'],

  // Tema (DaisyUI)
  tema: {
    modo: 'claro',            // 'claro' | 'oscuro'
    colores: {
      primary: '#1e3a5f',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#1c1917',
      'base-100': '#ffffff'
    },
    tipografia: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingsFont: 'Inter, system-ui, sans-serif'
    }
  },

  // Cifrado
  cifrado: {
    camposSensibles: ['email', 'telefono', 'ruc'],
    storageKey: 'mi-app-key'
  },

  // Seccion data (siempre)
  data: {
    dir: 'data/',
    maxFileSize: 10 * 1024 * 1024,
    tipos: ['avatar', 'foto', 'doc', 'logo', 'backup'],
    avatars: {
      default: 'data/defaults/avatar.svg',
      size: 200,
      calidad: 0.8
    }
  },

  // Seccion sync (siempre)
  sync: {
    primaryFormat: 'json',
    secondaryFormats: APP_CONFIG.perfil === 'professional' || APP_CONFIG.perfil === 'business' ? ['sqlite'] : [],
    includeFiles: true,
    encrypt: true,
    maxExportSize: 50 * 1024 * 1024
  },

  // Seccion ui (siempre)
  ui: {
    formsMode: 'modal',
    alerts: 'toast',
    confirmDelete: true,
    avatars: true,
    avatarDefault: 'data/defaults/avatar.svg'
  },

  // Modulos (definicion)
  modulos: {
    usuarios: { titulo: 'Usuarios', icono: 'bi-people', activo: true },
    inventario: { titulo: 'Inventario', icono: 'bi-box', activo: true }
  }
};
```

### Valores de `iaJutia`

| Valor | Significado |
|---|---|
| `{ perfil: false }` | IA Jutia desactivada |
| `{ perfil: 'lite' }` | FlexSearch + estadisticas + predicciones |
| `{ perfil: 'full' }` | Todo lo anterior + OCR + chat threads + busqueda hibrida + QA |
| `{ perfil: 'lite', flexSearch: { preset: 'default', tokenize: 'forward' } }` | Lite con configuracion FlexSearch personalizada |

---

## 8. UI Padrones

### Patrones Obligatorios

| Patron | Implementacion | Excepcion |
|---|---|---|
| Forms en modal | `UI.modalForm()` | Solo si la spec pide explicitamente forms en pagina |
| Feedback con toast | `UI.toast()` | Nunca `alert()` |
| Confirmacion antes de borrar | `UI.confirm()` | Siempre |
| Loading en ops largas | `UI.loading(true/false)` | Si dura < 300ms |
| Tablas responsive | `overflow-x-auto` + `table` | -- |
| Empty states | Mensaje + icono cuando no hay datos | -- |
| Skeleton loading | Clases `.sk-el`, `.sk-card`, `.sk-row`, etc. | -- |

### Componentes DaisyUI por Categoria

| Componente | DaisyUI | Tailwind nativo | Pines |
|---|---|---|---|
| button | `btn` | -- | -- |
| card | `card` | -- | -- |
| input | `input` | -- | -- |
| textarea | `textarea` | -- | -- |
| dropdown | `dropdown` | -- | -- |
| modal | `modal` | -- | -- |
| tabs | `tabs` | -- | -- |
| badge | `badge` | Tailwind pill | -- |
| table | `table` | -- | -- |
| skeleton | `skeleton` | Shimmer | -- |
| command palette | -- | -- | Cmd+K + x-teleport |
| toast | -- | -- | Alpine component |

**Regla de coherencia:** Si el modulo usa DaisyUI para botones (btn), tambien debe usar DaisyUI para cards, tabs e inputs. No mezclar en la misma vista.

---

## 9. Command Palette (Cmd+K)

La command palette se integra en `index.html` via el componente Alpine `searchPalette`:

```html
<div x-data="searchPalette"
     @keydown.window.cmd.k.prevent="openPalette()"
     @keydown.window.ctrl.k.prevent="openPalette()"
     @keydown.window="onKeydown">
  <template x-teleport="body">
    <!-- Overlay con backdrop blur, input de busqueda, resultados -->
  </template>
</div>
```

**Comportamiento:**
- Sin query: muestra los primeros 8 modulos
- Con query: filtra modulos por titulo o ID
- Si IA Jutia activa y query >= 2 caracteres: anade resultados de FlexSearch
- Separador visual entre modulos y registros
- Navegacion por teclado con `_kIdx` tracking

---

## 10. FileStore - Gestion de Archivos

### Flujo de Guardado

```
save(tipo, nombre, blob)
  |
  +- Valida tamano (max 10MB)
  +- Genera UUID para el nombre
  +- Calcula SHA-256 hash
  +- Registra metadatos en db._files
  |
  +- Lite: guarda blob en db._file_blobs
  |         +- Si falla: rollback (elimina _files)
  |
  +- Professional/Business: escribe a disco via Neutralino.filesystem
            +- Si falla: rollback (elimina _files)
```

### Flujo de Limpieza de Huerfanos

```javascript
async cleanOrphans() {
  // Busca archivos con refCount === 0
  const orphans = await db._files.where('refCount').equals(0).toArray();
  for (const f of orphans) { await this.delete(f.path); }
  return orphans.length;
}
```

### Consideraciones Tecnicas

- `crypto.subtle.digest()` para hash: funciona en Neutralino (http) pero falla en `file://` -> capturado con try/catch
- `URL.createObjectURL()` para blobs: gestionado con `_objectUrls` Set + `revokeAll()`
- `Neutralino.filesystem` accedido con optional chaining (`?.`) para permitir fallback en navegador

---

## 11. IA Jutia - Plugin de Inteligencia Artificial

IA Jutia es un **plugin unificado** (no dos versiones separadas). Un solo conjunto de archivos que se comporta segun `APP_CONFIG.iaJutia.perfil`.

### Arquitectura del Plugin

```
ia-jutia/templates/plugin/
  +-- module.js                  # Entry point del plugin (IIFE, Alpine module)
  +-- ia-core.js                 # Core: FlexSearch, estadisticas, predicciones, OCR, chat
  +-- ia-chat.js                 # Chat conversacional con historial Dexie
  +-- setup-ia.ps1               # Script de instalacion de dependencias
  +-- assets/
  |   +-- flexsearch.min.js      # FlexSearch bundle (carga lazy)
  +-- tools/                     # Tools extensibles
      +-- _registry.js           # Registro de herramientas (window.IA_TOOLS)
      +-- extraer-factura.js     # Tool: extraccion de datos de facturas Latam
```

### Modo de Carga

1. `module.js` se carga como modulo Alpine (como cualquier otro modulo)
2. Al cargar, lee `APP_CONFIG.iaJutia.perfil`
3. Carga lazy `ia-core.js` y `ia-chat.js` via `loadScript()`
4. Carga tools desde `tools/` (registry primero)
5. Si perfil === 'full': inicializa capacidades adicionales (OCR, chat threads)
6. Expone `window.ia` con la API completa

### API de `window.ia`

```javascript
window.ia = {
  // Busqueda FlexSearch
  search(query, opts),              // Busqueda sobre tablas registradas
  registerTable(nombre, campos),    // Registrar tabla Dexie para indexado
  indexRecord(tabla, record),       // Indexar 1 registro incremental
  removeRecord(tabla, id),          // Eliminar 1 registro del indice

  // Estadisticas y predicciones (siempre disponibles)
  stats(tabla, campo),              // media, mediana, moda, min, max, stddev
  statsAll(),                       // Estadisticas de todas las tablas
  predict(tabla, campo, periodos),  // Regresion lineal
  forecast(valores, n),             // Proyeccion de array numerico
  movingAverage(valores, ventana),  // Media movil

  // Chat (perfil full)
  chat: {
    init(),                         // Inicializar chat
    send(mensaje),                  // Enviar mensaje, recibe respuesta
    getHistory(chatId),             // Obtener historial de chat
    listChats(),                    // Listar conversaciones
    delete(chatId)                  // Eliminar conversacion
  },

  // Export (siempre disponible)
  exportPDF(),                      // Exportar estadisticas a PDF
  highlight(texto, query),          // Resaltar terminos en texto
  getAutocomplete(query),           // Autocomplete con FlexSearch
  _escapeHtml(str)                  // Sanitizar HTML
};
```

### Integracion con Cmd+K

Cuando IA Jutia esta activa (`window.ia` existe), la command palette unifica:
1. Navegacion de modulos (arriba)
2. Busqueda en datos via FlexSearch (abajo, con separador)

### Tools del Plugin

Las tools son modulos autoregistrables que se cargan al iniciar el plugin. Cada tool expone:
- `nombre`: identificador unico
- `descripcion`: que hace
- `patrones`: regex para deteccion
- `ejecutar(texto)`: funcion principal

Ejemplo - `extraer-factura.js`:
- Detecta pais automaticamente (14 paises Latam)
- Extrae RUC/RUT/NIT, razon social, montos, IVA/IGV
- Autoregistra en `window.IA_TOOLS`

### Esquema de Configuracion

```javascript
// project.config.js
iaJutia: {
  perfil: 'lite',               // 'lite' | 'full' | false
  flexSearch: {                  // Opcional
    preset: 'default',
    tokenize: 'forward'
  }
}
```

---

## 12. Catalogo de 15 AHA Apps

Cada app tiene **3 niveles comerciales** que mapean a perfiles tecnicos:

| Nivel | Perfil Tecnico | Empaquetado |
|---|---|---|
| **Inicio** | Lite | ZIP + GitHub Pages |
| **Profesional** | Professional | .exe + .apk (~30MB ZIP) |
| **Enterprise** | Business | .exe + .apk + white-label + docs (~35MB ZIP, sin codigo fuente) |

> **AHA Base** 🧪 — Template de desarrollo para prototipado, sin niveles comerciales (gratuito)

### Listado Completo

| # | App | Descripcion | Modulos Clave |
|---|-----|-------------|---------------|
| 1 | **AHA Inventario** | Gestion de stock, entradas/salidas, alertas de stock minimo, lotes, codigos de barras | usuarios, inventario, dashboard, configuracion |
| 2 | **AHA Comanda** | Toma de pedidos en mesa, pantalla cocina, impresora termica, pagos | usuarios, comandas, inventario, dashboard, configuracion |
| 3 | **AHA CRM** | Clientes, pipeline de oportunidades, actividades, reportes de ventas | usuarios, crm, dashboard, configuracion, citas |
| 4 | **AHA Checklist** | Listas de verificacion, auditorias, inspecciones con fotos y firmas | usuarios, checklist, dashboard, configuracion, campo |
| 5 | **AHA Asistencia** | Control horario, geolocalizacion en marcaciones, turnos, excepciones | usuarios, asistencia, dashboard, configuracion, flota |
| 6 | **AHA Citas** | Agenda, reservas, recordatorios, disponibilidad en tiempo real | usuarios, citas, crm, dashboard, configuracion |
| 7 | **AHA Gastos** | Ingresos, egresos, categorias, reportes PDF | usuarios, contabilidad, dashboard, configuracion |
| 8 | **AHA Contactos** | CRM manual, plantillas WhatsApp, recordatorios | usuarios, contactos, dashboard, configuracion |
| 9 | **AHA Campo** | Formularios offline, GPS, fotos, sincronizacion diferida | usuarios, campo, inventario, checklist, flota, dashboard, configuracion |
| 10 | **AHA POS** | Punto de venta, tickets, caja, arqueo, promociones | usuarios, inventario, comandas, dashboard, configuracion, prefactura |
| 11 | **AHA Rx** | Recetas medicas, dispensacion, historial pacientes, alertas interacciones | usuarios, rx, dashboard, configuracion |
| 12 | **AHA Flota** | Vehiculos, mantenimiento, rutas, consumo combustible, conductores | usuarios, flota, asistencia, dashboard, configuracion, campo |
| 13 | **AHA Obra** | Proyectos, partidas, avances de obra, materiales, certificaciones | usuarios, obra, inventario, checklist, campo, flota, dashboard, configuracion, prefactura |
| 14 | **AHA PreFactura** | Presupuestos, albaranes, facturacion electronica, series, impuestos | usuarios, prefactura, crm, dashboard, configuracion |

### Como Generar una App

```bash
# 1. Copiar template a spec
cp apps/AHA-Inventario/template.md specs/mi-inventario.md

# 2. Ejecutar pipeline
/new mi-inventario     # modo Classic (5 fases)
# o
/pro mi-inventario     # modo Design (10 fases con brand layer)
```

---

## 13. Verticales de Negocio

Las apps se venden en **8 verticales de negocio**, cada una con su app estrella y un kit sugerido:

| Vertical | App Estrella | Target | Kit sugerido | Precio Kit |
|---|---|---|---|---|
| **Comercio y Retail** | POS | Ferreterias, abarrotes, tiendas | POS + Inventario + PreFactura + Gastos + Contactos | $299 |
| **Gastronomia** | Comanda | Restaurantes, bares, cafeterias | Comanda + POS + Inventario + Gastos + Asistencia | $349 |
| **Belleza y Servicios** | Citas | Barberias, salones, spas | Citas + Contactos + Gastos + Asistencia | $249 |
| **Salud y Consultorios** | Rx | Medicos, dentistas, farmacias | Rx + Citas + PreFactura + Contactos + Gastos | $299 |
| **Construccion y Obra** | Obra | Constructores, contratistas | Obra + Checklist + Campo + PreFactura + Gastos | $449 |
| **Campo y Agro** | Campo | Agricultores, ranchos, cooperativas | Campo + Inventario + Flota + Gastos | $349 |
| **Logistica y Transporte** | Flota | Flotillas, mensajerias | Flota + Asistencia + Checklist + Gastos | $349 |
| **Oficina y Freelancers** | CRM | Contadores, abogados, freelancers | CRM + Contactos + PreFactura + Gastos | $249 |
| **Desarrollo** 🧪 | Base | Prototipado y desarrollo | Base (gratuito) | $0 |

**Apps transversales:** AHA **Gastos** y AHA **Contactos** aparecen en las 8 verticales. Son el complemento base de cualquier kit.

Cada nivel mapea a un perfil tecnico: **Inicio** (Lite, ZIP+Pages), **Profesional** (Professional, .exe+.apk), **Enterprise** (Business, .exe+.apk+white-label).

---

## 14. Modulos Compartidos

### 14.1 `usuarios` - Gestion de Usuarios y Perfiles

**Apps:** Todas

**Tabla Dexie:**
```javascript
users: 'id, nombre, email, passwordHash, rol, avatar, createdAt, updatedAt'
user_sessions: 'id, userId, token, expiresAt, createdAt'
```

**Campos:**
| Campo | Tipo | Descripcion |
|---|---|---|
| `id` | UUID | Identificador unico |
| `nombre` | string | Nombre completo |
| `email` | string | Email unico (cifrado) |
| `passwordHash` | string | Contrasena cifrada (CryptoJS) |
| `rol` | enum | `'admin' \| 'usuario' \| 'invitado'` |
| `avatar` | string | Ruta al avatar (FileStore) |

**Flujo:**
1. Login: verifica `passwordHash` con `cryptoHelpers.decrypt()`
2. Sesion: guarda token en `localStorage`, verifica contra `user_sessions`
3. Avatar: `FileStore.save('avatar', nombre, blob)` al subir foto

### 14.2 `configuracion` - Parametros Globales

**Apps:** Todas

**Tablas:**
```javascript
app_settings: 'key, value, tipo, updatedAt'
app_preferences: 'userId, key, value, updatedAt'
```

**Keys comunes:**
- `general.theme` -> `'light' | 'dark'`
- `general.language` -> `'es' | 'en'`
- `notifications.push` -> `true | false`

### 14.3 `dashboard` - Panel de Metricas

**Apps:** Todas

**Tablas:**
```javascript
dashboard_widgets: 'id, userId, type, title, query, config, createdAt'
dashboard_layout: 'userId, layout, updatedAt'
```

**Tipos de widget:**
- `chart` -> grafico Chart.js
- `metric` -> numero con tendencia
- `list` -> registros recientes
- `quickAction` -> botones de accion rapida

### 14.4 `inventario` - Stock y Productos

**Apps:** Inventario, POS, Campo, Obra

**Tablas:**
```javascript
productos: 'id, codigo, nombre, descripcion, categoriaId, marcaId, precioCompra, precioVenta, stock, stockMin, unidadMedida, imagen, createdAt, updatedAt'
categorias: 'id, nombre, padreId, createdAt'
marcas: 'id, nombre, createdAt'
movimientos: 'id, productoId, tipo, cantidad, precioUnitario, almacenId, referenceId, userId, createdAt'
almacenes: 'id, nombre, direccion, createdAt'
```

**Tipos de movimiento (`tipo`):** `entrada` | `salida` | `ajuste`

**Flujo critico:** Los movimientos se generan automaticamente dentro de `db.transaction()` para mantener consistencia stock <-> movimientos.

**Alerta:** Cuando `stock <= stockMin`, se dispara `UI.toast('warning')`.

### 14.5 `comandas` - Pedidos y Mesas

**Apps:** Comanda, POS

**Tablas:**
```javascript
mesas: 'id, numero, estado, sectorId, createdAt'
sectores: 'id, nombre, createdAt'
pedidos: 'id, mesaId, userId, estado, total, igv, descuento, observaciones, createdAt, updatedAt'
lineas_pedido: 'id, pedidoId, productoId, cantidad, precioUnitario'
```

**Estados de pedido:** `nuevo` -> `en-proceso` -> `completado` | `cancelado`

### 14.6 `crm` - Clientes y Oportunidades

**Apps:** CRM, Citas, Contactos

**Tablas:**
```javascript
clientes: 'id, tipo, nombre, email, phone, direccion, ruc, referidoPor, createdAt, updatedAt'
contactos: 'id, clienteId, nombre, email, phone, tipo, createdAt'
oportunidades: 'id, clienteId, titulo, valor, etapa, probabilidad, closeDate, userId, createdAt, updatedAt'
actividades: 'id, oportunidadId, tipo, titulo, fecha, completada, userId'
```

**Etapas de oportunidad:** `prospeccion` -> `calificacion` -> `propuesta` -> `negociacion` -> `cerrado-ganado/perdido`

### 14.7 `checklist` - Auditorias e Inspecciones

**Apps:** Checklist, Campo, Obra

**Tablas:**
```javascript
plantillas_checklist: 'id, nombre, items, createdAt'
items_checklist: 'id, plantillaId, texto, obligatorio, orden'
inspecciones: 'id, plantillaId, titulo, estado, userId, fechaInicio, fechaFin, createdAt'
respuestas: 'id, inspeccionId, itemId, respuesta, observacion, fotoPath'
```

**Estados:** `borrador` -> `en-progreso` -> `completado` -> `revisionada`

**Integracion:** Fotos via `FileStore.save('foto', ...)`, firma digital en canvas.

### 14.8 `asistencia` - Control Horario

**Apps:** Asistencia, Flota

**Tablas:**
```javascript
turnos: 'id, userId, fecha, horaEntrada, horaSalida, estado, motivo'
marcas: 'id, turnoId, tipo, hora, ubicacionId'
ubicaciones: 'id, nombre, lat, lng'
```

**Tipos de marca:** `entrada` | `salida` | `descanso-inicio` | `descanso-fin`

**GPS:** `navigator.geolocation.getCurrentPosition()` para validar ubicacion.

### 14.9 `citas` - Agenda y Reservas

**Apps:** Citas, CRM

**Tablas:**
```javascript
servicios: 'id, nombre, duracion, precio, createdAt'
citas: 'id, clienteId, servicioId, userId, fechaHora, duracion, estado, notas, createdAt, updatedAt'
```

**Estados:** `programada` -> `confirmada` -> `completada` | `cancelada`

### 14.10 `flota` - Vehiculos

**Apps:** Flota, Campo, Obra

**Tablas:**
```javascript
vehiculos: 'id, placa, marca, modelo, ano, tipo, combustible, kilometraje, estado, createdAt'
mantenimientos: 'id, vehiculoId, tipo, fecha, costo, descripcion, proxMantenimiento, estado'
conductor_asignado: 'vehiculoId, userId, asignadoAt'
```

**Tipos de mantenimiento:** `preventivo` | `correctivo` | `reparacion`

### 14.11 `rx` - Recetas Medicas

**Apps:** Rx

**Tablas:**
```javascript
recetas: 'id, pacienteId, medicoId, fecha, diagnostico, estado, pdfPath, createdAt'
lineas_receta: 'id, recetaId, medicamentoId, dosis, frecuencia, duracion, instrucciones'
medicamentos: 'id, codigo, nombre, laboratorio, stock, precio'
```

**Estados:** `borrador` -> `emitida` -> `dispensada` | `cancelada`

### 14.12 `prefactura` - Facturacion

**Apps:** PreFactura, POS, Obra

**Tablas:**
```javascript
presupuestos: 'id, clienteId, numero, fecha, vencimiento, subtotal, igv, descuento, total, estado, userId'
lineas_presupuesto: 'id, presupuestoId, productoServicioId, tipo, descripcion, cantidad, precioUnitario'
facturas: 'id, presupuestoId, numero, serie, fechaEmision, hashDocumento, xmlPath, pdfPath'
```

**Integracion:** PDF via jsPDF + html2canvas. XML SUNAT en perfil Business.

### 14.13 `campo` - Formularios Offline

**Apps:** Campo, Obra

**Tablas:**
```javascript
formularios: 'id, codigo, nombre, campos, configuracion'
respuestas_form: 'id, formularioId, userId, datos, ubicacion, fecha, sincronizado, createdAt'
```

**Flujo offline:**
1. Captura datos sin conexion -> almacena en Dexie
2. Al recuperar conexion -> sincroniza automaticamente
3. Indicador visual de estado de sincronizacion

### Matriz Modulos x Apps

| Modulo | Inv | Com | CRM | Chk | Asis | Cit | Cread | Campo | POS | Rx | Flota | Obra | PreF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| usuarios | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si |
| configuracion | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si |
| dashboard | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si | Si |
| inventario | Si | Si | | | | | Si | Si | Si | | | Si | |
| comandas | | Si | | | | | | | Si | | | | |
| crm | | | Si | | | Si | Si | | | | | | |
| checklist | | | | Si | | | | Si | | | | Si | |
| asistencia | Si | | | | Si | | | Si | | | Si | | |
| citas | | | Si | | | Si | | | | | | | |
| flota | | | | | Si | | | Si | | | Si | Si | |
| rx | | | | | | | | | | Si | | | |
| prefactura | | | Si | | | | | | | | | Si | Si |
| campo | | | | | | | | Si | | | | Si | |

---

## 15. Pipeline / Flujo de Trabajo

### Orquestador

El `pipeline-engine` es el orquestador maestro. Soporta dos modos. El **perfil** (`lite`, `professional`, `business`) se define en `project.config.js` y determina setup, templates y empaquetado.

### Modo Classic (`/new`) - 5 Fases

```
1. Setup (setup-init)
   +- Valida entorno (curl, node, permisos)
   +- Crea estructura de directorios
   +- Genera archivos predeterminados (avatar, placeholder)
   +- Descarga librerias (Tailwind, DaisyUI, Alpine, Dexie, etc.)

2. Spec (spec-engine)
   +- Lee template de app o historia de usuario
   +- Genera specs/[app].md (15 secciones)
   +- Genera specs/DESIGN.md (brand layer)

3. Design (design-engine)
   +- Inyecta brand context desde DESIGN.md
   +- Aplica tokens DaisyUI (colores, tipografia)
   +- Selecciona componentes UI segun preferencia

4. Code (code-generator)
   +- FASE A: Core + index.html + project.config.js
   +- FASE B: Modulos (uno por turno, con pausa)
   +- Validacion automatica de compliance

5. Validate + Deploy
   +- Compliance check (stack-compliance-guard)
   +- Brand audit (validation-engine)
   +- QA rubric (omd:final-qa)
   +- Empaquetado + publicacion (deployment-jigue)
```

### Modo Design (`/pro`) - 10 Fases

```
1.  taste    ->  omd:taste (preferencias de diseno)
2.  init     ->  omd:init (DESIGN.md bootstrap)
3.  design   ->  design-engine (brand injection)
4.  spec     ->  spec-engine (funcional + brand)
5.  code     ->  code-generator (modulos)
6.  inject   ->  omd:apply + omd:harness (microcopy, refinamiento)
7.  review   ->  omd:designer-review (revision visual)
8.  QA       ->  omd:final-qa (rubrica 8 items)
9.  pack     ->  deployment-jigue (empaquetado)
10. deploy   ->  GitHub Pages / Release
```

---

## 16. Comandos Slash

| Comando | Trigger | Efecto |
|---|---|---|
| `/new` | `nuevo proyecto` | Pipeline Classic completo (5 fases) |
| `/pro` | `pipeline potenciado` | Pipeline Design (10 fases con brand layer) |
| `/setup` | `iniciar setup` | Crea estructura + instala librerias segun perfil |
| `/spec` | `definir spec app` | spec-engine: spec funcional + DESIGN.md |
| `/build` | `generar codigo` | code-generator: Fase A (core) + Fase B (modulos) |
| `/test` | `validar app` | validation-engine 4 fases |
| `/validate` | `validar diseno` | validation-engine modo brand audit |
| `/refactor` | `refactorizar ux` | validation-engine modo refactor: auto-corrige desviaciones |
| `/compliance` | -- | stack-compliance-guard manual |
| `/status` | -- | Lee pipeline state (specs/, project.config.js, docs/) |
| `/archive` | -- | Mueve spec + reporte a specs/archive/ |
| `/docs` | -- | Abre docs/guia-estudio-ateje.md (guia completa de estudio) |
| `/ia` | `mini ia` | Activa ia-jutia (pregunta perfil IA Lite / IA Full / No) |
| `/deploy` | `publicar` | deployment-jigue: commit + push + empaquetado segun perfil |
| `/wiki` | `gestionar wiki` | wiki-engine: ingest/query/lint sobre wiki + preferencias |
| `/upgrade` | `actualizar perfil` | upgrade-engine: diagnostico -> migra Lite->Professional/Business y/o IA Lite->IA Full |
| `/licencia` | `generar licencia` | scripts/license.js - CLI interactivo que genera archivos .aha firmados |
| `/docs-gen` | `generar docs` | scripts/generate-docs.js - Escanea modulos y genera docs/API.md |

---

## 17. Sistema de Licencias

El comando `/licencia` activa `scripts/license.js`, un CLI interactivo para generar archivos de licencia `.aha` firmados.

### Funcionamiento

```
/licencia generar
  +- Pregunta: plan (Inicio/Profesional/Enterprise)
  +- Pregunta: apps (una o varias)
  +- Pregunta: cliente (nombre, empresa, email)
  +- Genera archivo .aha firmado (RSA + AES)
  +- Guarda en licencias/[fecha]/

/licencia generar --kit [vertical]
  +- Usa kit predefinido por vertical
  +- Ejemplo: /licencia generar --kit gastronomia
```

### Estructura del Archivo `.aha`

```json
{
  "version": 1,
  "plan": "professional",
  "cliente": {
    "nombre": "Cliente SA",
    "email": "cliente@empresa.com",
    "empresa": "Empresa SAC"
  },
  "apps": ["AHA-Inventario", "AHA-POS"],
  "kit": "comercio",
  "emitido": "2026-07-02T12:00:00Z",
  "vencimiento": "2027-07-02T12:00:00Z",
  "firma": "RSA-OAEP-SHA256:base64..."
}
```

### Seguridad

- **RSA**: Firma asimetrica del archivo completo
- **AES**: Cifrado del contenido sensible
- Las licencias se almacenan en `licencias/[fecha]/` dentro del proyecto

---

## 18. Instalacion Global

Para usar el Ateje Stack desde cualquier proyecto (no solo dentro de este repo):

```powershell
# Instalar (sin administrador)
.\install-global.ps1

# Desinstalar (sin dejar rastro)
.\uninstall-global.ps1
```

### Que hace la instalacion

1. Crea 13 directory junctions en `~/.opencode/skills/` apuntando a cada skill del repo
2. Agrega `skills.paths: ["~/.opencode/skills/"]` al config global OpenCode (`~/.config/opencode/opencode.json`)
3. Usa `ConvertFrom-Json`/`ConvertTo-Json` para manipulacion robusta del JSON (no regex fragil)
4. Agentes del stack registrados globalmente con rutas absolutas al repo

### Que hace la desinstalacion

- `uninstall-global.ps1` revierte ambas operaciones sin dejar rastro
- Usa `PSObject.Properties.Remove()` para limpieza precisa del JSON

### Efecto

- `/new`, `/pro`, `/build`, `/deploy`, etc. disponibles desde cualquier directorio
- Skills se actualizan solas al hacer `git pull` (son junctions, no copias)
- Sin interferencia con otros proyectos (config sandboxeado en `skills.paths`)
- `{file:~/.opencode/skills/...}` resuelve correctamente desde cualquier proyecto

---

## 19. MCP Servers

### MCPs Globales (config `~/.config/opencode/opencode.json`)

Estos servidores estan disponibles en **cualquier repositorio** donde trabajes con OpenCode:

| Servidor | Proposito |
|---|---|
| **github** | Operaciones GitHub API (issues, PRs, commits, search) |
| **stocky** | Imagenes royalty-free (Pexels + Unsplash) |
| **refero-styles** | Sistemas de diseno en refero.design (286+ brands) |
| **web-search** | Busqueda web |
| **chrome-devtools** | Navegador headless para testing/Lighthouse |
| **supabase** | Supabase API (DB, Auth, Edge Functions) |
| **context7** | Documentacion actualizada de librerias/frameworks |
| **daisyui-gitmcp** | Documentacion de DaisyUI |

### MCP Local (config `opencode.json` del repo)

Solo **Engram** esta configurado localmente:

| Servidor | Comando | Proposito |
|---|---|---|
| **engram** | `C:\Users\Angel\bin\engram.exe mcp --project Ateje` | Memoria persistente SQLite/FTS5 (cross-sesion) |

**OpenPencil** esta en la config global (`~/.config/opencode/opencode.json`), disponible en cualquier repo.

Los MCPs locales son opt-in: si la herramienta no esta instalada, OpenCode los ignora silenciosamente.

---

## 20. Herramientas de Desarrollo (Engram + OpenPencil)

Dos herramientas externas opcionales que mejoran la memoria del agente y el diseno visual. **No son requisito** - el pipeline funciona 100% sin ellas.

### Engram - Memoria Persistente

Engram reemplaza el MCP memory graph conceptual de `wiki-engine` con almacenamiento SQLite real + busqueda FTS5 + 20 tools MCP.

| Concepto | Descripcion |
|---|---|
| **Que es?** | Servicio de memoria persistente para agentes de IA. Captura decisiones, preferencias y contexto entre sesiones. |
| **Instalacion** | Descargar binary de [GitHub Releases](https://github.com/Gentleman-Programming/engram/releases) (~10MB Go binary) |
| **Configuracion** | `scripts/setup-engram.ps1` - detecta Engram, configura `ENGRAM_DATA_DIR=.omd/`, inicializa el proyecto |
| **Uso en pipeline** | `wiki-engine` lo usa como backend de memoria durante ingest/query/lint |
| **MCP** | `C:\Users\Angel\bin\engram.exe mcp --project Ateje` - 20 herramientas MCP (create, search, read, delete entities, add observations, etc.) |
| **Fallback** | Sin Engram, `wiki-engine` usa markdown en `wiki/` + `.omd/preferences.md` |

**Flujo:**
1. `scripts/setup-engram.ps1` corre durante `/setup` si Engram esta instalado
2. Configura `ENGRAM_DATA_DIR=.omd/` para que la memoria sea portable
3. `wiki-engine` invoca Engram via MCP para persistir y buscar conocimiento
4. Sin Engram: todo funciona con archivos markdown

### OpenPencil - Diseno Visual + MCP

OpenPencil es un editor visual Figma-compatible con CLI para extraccion de tokens de diseno.

| Concepto | Descripcion |
|---|---|
| **Que es?** | Editor visual Figma-compatible + CLI para extraer tokens de diseno a DESIGN.md |
| **Componentes** | **Desktop App** (Tauri, ~7MB): editor visual + MCP server. **CLI** (`npm install -g @open-pencil/cli`): extraccion headless de tokens |
| **Instalacion** | `winget install OpenPencil.OpenPencil` (Desktop) + `npm install -g @open-pencil/cli` (CLI) |
| **Configuracion** | `scripts/setup-opencil.ps1` - detecta CLI + Desktop, crea `assets/brand/`, imprime guia de uso |
| **MCP** | `openpencil-mcp` - 90+ tools para leer/modificar diseno desde OpenCode (requiere Desktop App abierta) |

**Flujo de extraccion de tokens:**
```bash
# 1. Abrir diseno en OpenPencil Desktop y exportar como .fig
# 2. Extraer tokens
openpencil analyze colors brand.fig --json > assets/brand/tokens-colors.json
openpencil analyze typography brand.fig --json > assets/brand/tokens-typography.json
openpencil analyze spacing brand.fig --json > assets/brand/tokens-spacing.json
# 3. Preview del diseno
openpencil preview brand.fig --output docs/preview-brand.html
# 4. design-engine lee los JSON y genera tokens DaisyUI @theme en DESIGN.md
```

### Cuando Activarlas

| Herramienta | Activar si... | Beneficio |
|---|---|---|
| **Engram** | El agente olvida decisiones entre sesiones de trabajo | Memoria persistente SQLite/FTS5, 20 tools MCP, dashboard visual |
| **OpenPencil** | Tienes disenos en Figma/OpenPencil y quieres que el codigo generado coincida exactamente | Tokens de diseno automaticos, preview visual, MCP para edicion desde OpenCode |

---

## 21. Configuracion opencode.json

El archivo `opencode.json` en la raiz configura OpenCode para este meta-repo. Keys validas:

| Key antigua | Key actual | Formato |
|---|---|---|
| `agents` (array) | `agent` | objeto keyeado por nombre, `mode` en vez de `type`, `permission` opcional |
| `mcpServers` | `mcp` | objeto con `type` (local/remote) y `command` como array unico |
| `commands` (string path) | auto-descubierto | opencode escanea `.opencode/commands/` automaticamente |
| `rules` | `instructions` | array de paths a archivos markdown |
| `skills` (array) | `skills.paths` | objeto con `paths: ["."]` para escaneo recursivo de SKILL.md desde raiz |

Usar `{file:ruta}` inline para prompts de agentes. Ver `opencode.json` en la raiz como referencia.

---

## 22. Tests

### Test E2E (Playwright)

```powershell
cd tests; python test_app.py
```

Playwright E2E sobre `test-app.html` (Alpine.js task manager). 17 checks:
- page load, Alpine interactivity, form validation, toggle, responsive
- touch targets, focus rings, viewport, empty state, skip link
- aria-live, manifest, SW, bottom nav, loading state, stagger, offline detection

Requiere Chrome system channel.

### Test de Template

```powershell
cd tests; python -m pytest test-template.py -v
```

Playwright + pytest para verificar estructura de modulos generados.

---

## 23. Deploy / Niveles de Entrega

### CI/CD

Push a `main` -> GitHub Actions (`deploy-pages.yml`) -> GitHub Pages. Sin build step (`path: .`).

Para empaquetado profesional: ejecutar `/deploy` que activa `deployment-jigue` segun perfil.

### Niveles de Entrega

| Nivel | Perfil | Contenido | HTML visible? |
|---|---|---|---|
| **Essential** | Lite | ZIP + GitHub Pages. HTML visible para demo/vitrina online. | Si |
| **Professional** | Professional | .exe (Neutralino) + .apk (Capacitor). Sin HTML visible. ~30MB ZIP. | No |
| **Business** | Business | .exe (Neutralino) + .apk (Capacitor) + white-label + soporte prioritario + guia de marca. Sin codigo fuente. ~35MB ZIP. | No |

### White-Label (Business)

Para personalizar marca de un cliente Business:
```powershell
.\deployment-jigue\templates\brand.ps1 -cliente "NombreCliente"
# o
.\deployment-jigue\templates\package-business.ps1 -cliente "NombreCliente"
```

---

## 24. Buenas Practicas

### Codigo

- Todo codigo debe pasar **Stack Compliance Guard** (sin imports ES6, rutas relativas, cifrado aplicado, UI consistente)
- Usar `dbLocal()` para lectura instantanea desde IndexedDB en vez de `dbOnline.getAll()` (HTTP)
- Sincronizacion en background con `Promise.all()` para las 8 tablas
- `bulkAdd()` en vez de `for await add()` en refreshCache

### UI/UX

- Skeletons CSS (`.sk-el`, `.sk-card`, `.sk-row`, etc.) en vez de spinners genericos
- Inicializar `Alpine.store('loading', ...)` ANTES de que Alpine procese el DOM
- `checkSession()` leer de IndexedDB primero, verificacion contra Supabase en background
- Forms siempre en modal con `UI.modalForm()`
- Feedback con `UI.toast()` (nunca `alert()`)

### Datos

- Todas las tablas de negocio usan `id` (UUID string, no ++id) + `createdBy` + `createdAt` + `updatedAt`
- Campos sensibles cifrados automaticamente via `cryptoHelpers.encrypt()`
- Operaciones Dexie en lotes de 200 en vez de `toArray()` completo
- Archivos gestionados exclusivamente via `FileStore`, nunca acceso directo a `_files` o `_file_blobs`

### Perfiles

- No existe downgrade de perfil (solo upgrade)
- NeutralinoJS es runtime para Professional y Business
- No modificar modulos ni datos al migrar perfil (solo infraestructura)
- Professional ya NO incluye .apk (solo Business tiene Capacitor)

### Trabajo en Equipo

- Mantener `AGENTS.md` actualizado con cualquier cambio en skills
- Los contratos entre skills (emisor/receptor/artefacto) son la fuente de verdad para integraciones
- Usar `/docs-gen` para regenerar `docs/API.md` tras cambios en modulos
- No versionar directorios generados: `docs/` (excepto guias), `specs/`, `wiki/`, `.omd/`

---

> **Documentacion generada a partir del repositorio Ateje.**
>
> Ultima actualizacion: julio 2026
