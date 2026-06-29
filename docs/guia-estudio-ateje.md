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

---

## 2️⃣ Arquitectura

### Capas del Stack

```
┌─────────────────────────────────────────────┐
│            PIPELINE ENGINE                   │  Orquestador maestro
│    (Classic: 5 fases / Design: 10 fases)     │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌───────────┐    │
│  │  Spec    │ │  Design  │ │ Validation│    │  Engines
│  │  Engine  │ │  Engine  │ │  Engine   │    │
│  └──────────┘ └──────────┘ └───────────┘    │
│  ┌──────────┐ ┌──────────┐                   │
│  │   Wiki   │ │ Upgrade  │                   │
│  │  Engine  │ │  Engine  │                   │
│  └──────────┘ └──────────┘                   │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌───────────┐    │
│  │  Setup   │ │   Code   │ │ Compliance│    │  Standalone
│  │  Init    │ │ Generator│ │   Guard   │    │  Skills
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
│         16 Skills Oh My Design (OmD)         │  Diseño
│  (init, taste, apply, harness, sync, learn,  │
│   remember, es-writer, designer-review, QA…) │
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
│   ├── AHA-Gastos/template.md
│   ├── AHA-Contactos/template.md
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
├── skills/                      # Skills standalone (nombres reales en raíz)
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
│   ├── search-palette.js        # Cmd+K Alpine component
│   ├── file-store.js            # FileStore dual backend
│   ├── delete.js                # Confirmación de borrado
│   └── (module.js, module.html  # Patrones de módulo)
│
├── components/                  # Componentes UI (Pines)
│   └── pines/                   # ~40 componentes avanzados
│
├── data/                        # (generado) Datos de la app
│   └── defaults/                # Archivos predeterminados
│       ├── avatar.svg           # Avatar por defecto
│       ├── placeholder.svg      # Placeholder para imágenes
│       └── README.md            # Documentación de data/
│
├── docs/                        # Documentación del stack
│   ├── stack-completo.md        # Documentación completa
│   ├── guia-estudio-ateje.md    # ESTA GUÍA
│   └── ...
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

// Tablas de sistema (siempre incluidas)
db.version(1).stores({
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path'    // Solo perfil Lite
});

// Las tablas de negocio se añaden dinámicamente según spec
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

API estándar de UI expuesta en `window.UI`.

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
- ✅ Feedback siempre con `UI.toast()`, NUNCA `alert()` nativo
- ✅ Antes de `db.delete()`, SIEMPRE `UI.confirm()`
- ✅ Todos los formularios crear/editar vía `UI.modalForm()`
- ✅ Operaciones largas con `UI.loading(true/false)`

### `core/theme.js`

Inyecta CSS variables desde `APP_CONFIG.tema.colores`. Expone `window.themeStore` con Alpine store para cambio dinámico de tema.

### `core/app.js`

Router hash-based para navegación SPA sin dependencias externas.

```javascript
window.appRouter = {
  load(moduloId) {             // Carga módulo por hash
    window.location.hash = moduloId;
  },
  init() {
    window.addEventListener('hashchange', () => this._cargarModulo());
    this._cargarModulo();
  },
  _cargarModulo() { /* renderiza module.html + ejecuta module.js */ }
};

window.MODULES = {};  // Registro de módulos cargados
```

### `core/search-palette.js`

Command Palette global (Ctrl+K / Cmd+K) para navegación de módulos + búsqueda IA.

- **Atajo:** `Ctrl+K` o `Cmd+K` (global, no interfiere con inputs)
- **Navegación:** Flechas arriba/abajo + Enter
- **Cierre:** Escape o click fuera
- **IA integrada:** Si `window.ia` existe, muestra resultados de FlexSearch

El componente Alpine renderiza vía `x-teleport="body"` con markup DaisyUI.

### `core/file-store.js`

Gestión unificada de archivos con dos backends según perfil.

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

**Backend Lite:** Almacena blobs en tabla Dexie `_file_blobs`. `getURL()` retorna ObjectURL.

**Backend Full:** Escribe a disco en `APP_DATA_DIR`. `getURL()` retorna ruta real.

### `core/sync.js`

Motor de respaldo unificado. Exporta todas las tablas Dexie a archivo `.ateje-backup` cifrado y comprimido, y restaura en cualquier perfil.

- Incluye archivos (metadatos + blobs en Lite, rutas en Full)
- Cifrado AES con CryptoJS
- Compresión con pako (gzip)

---

## 6️⃣ Tablas de Sistema

### `_files`

Metadatos de todos los archivos gestionados por FileStore.

```javascript
_files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt'
```

| Campo | Tipo | Descripción |
|---|---|---|
| `path` | string | Ruta relativa a APP_DATA_DIR, ej: "avatars/uuid-user.jpg" |
| `tipo` | string | 'avatar' \| 'foto' \| 'doc' \| 'logo' \| 'backup' |
| `nombre` | string | Nombre original del archivo |
| `mime` | string | Tipo MIME (image/png, application/pdf, etc.) |
| `size` | number | Tamaño en bytes |
| `hash` | string | SHA-256 hex (para dedup en import) |
| `refCount` | number | Contador de referencias desde registros de negocio |

### `_file_blobs` (Lite only)

```javascript
_file_blobs: '&path'
```
Almacena los blobs binarios cuando no hay acceso a disco (file://).

---

## 7️⃣ project.config.js – Schema White-Label

```javascript
window.APP_CONFIG = {
  // Sección app (siempre)
  app: {
    nombre: 'MiApp',
    version: '1.0.0',
    tipo: 'inventario',
    descripcion: 'App de inventario'
  },

  // Perfil
  perfil: 'lite',            // 'lite' | 'professional' | 'business'
  iaJutia: 'no',             // 'lite' | 'full' | 'no'

  // Módulos activos
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

  // Sección data (siempre)
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

  // Sección sync (siempre)
  sync: {
    primaryFormat: 'json',
    secondaryFormats: APP_CONFIG.perfil === 'professional' || APP_CONFIG.perfil === 'business' ? ['sqlite'] : [],
    includeFiles: true,
    encrypt: true,
    maxExportSize: 50 * 1024 * 1024
  },

  // Sección ui (siempre)
  ui: {
    formsMode: 'modal',
    alerts: 'toast',
    confirmDelete: true,
    avatars: true,
    avatarDefault: 'data/defaults/avatar.svg'
  },

  // Módulos (definición)
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
| Forms en modal | `UI.modalForm()` | Solo si la spec pide explícitamente forms en página |
| Feedback con toast | `UI.toast()` | Nunca `alert()` |
| Confirmación antes de borrar | `UI.confirm()` | Siempre |
| Loading en ops largas | `UI.loading(true/false)` | Si dura < 300ms |
| Tablas responsive | `overflow-x-auto` + `table` | — |
| Empty states | Mensaje + icono cuando no hay datos | — |
| Skeleton loading | Clases `.sk-el`, `.sk-card`, `.sk-row`, etc. | — |

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

**Regla de coherencia:** Si el módulo usa DaisyUI para botones (btn), también debe usar DaisyUI para cards, tabs e inputs. No mezclar en la misma vista.

---

## 9️⃣ Command Palette (Cmd+K)

La command palette se integra en `index.html` vía el componente Alpine `searchPalette`:

```html
<div x-data="searchPalette"
     @keydown.window.cmd.k.prevent="openPalette()"
     @keydown.window.ctrl.k.prevent="openPalette()"
     @keydown.window="onKeydown">
  <template x-teleport="body">
    <!-- Overlay con backdrop blur, input de búsqueda, resultados -->
  </template>
</div>
```

**Comportamiento:**
- Sin query: muestra los primeros 8 módulos
- Con query: filtra módulos por título o ID
- Si IA Jutia activa y query >= 2 caracteres: añade resultados de FlexSearch
- Separador visual entre módulos y registros
- Navegación por teclado con `_kIdx` tracking

---

## 🔟 FileStore – Gestión de Archivos

### Flujo de Guardado

```
save(tipo, nombre, blob)
  │
  ├─ Valida tamaño (max 10MB)
  ├─ Genera UUID para el nombre
  ├─ Calcula SHA-256 hash
  ├─ Registra metadatos en db._files
  │
  ├─ Lite: guarda blob en db._file_blobs
  │         └─ Si falla: rollback (elimina _files)
  │
  └─ Full: escribe a disco via Neutralino.filesystem
            └─ Si falla: rollback (elimina _files)
```

### Flujo de Limpieza de Huérfanos

```javascript
async cleanOrphans() {
  // Busca archivos con refCount === 0
  const orphans = await db._files.where('refCount').equals(0).toArray();
  for (const f of orphans) { await this.delete(f.path); }
  return orphans.length;
}
```

### Consideraciones Técnicas

- `crypto.subtle.digest()` para hash: funciona en Neutralino (http) pero falla en `file://` → capturado con try/catch
- `URL.createObjectURL()` para blobs: gestionado con `_objectUrls` Set + `revokeAll()`
- `Neutralino.filesystem` accedido con optional chaining (`?.`) para permitir fallback en navegador

---

## 1️⃣1️⃣ IA Jutia

### Perfil Lite

```javascript
window.ia = {
  search(query, opts),              // FlexSearch sobre tablas registradas
  registerTable(nombre, campos),    // Registrar tabla Dexie para indexado
  indexRecord(tabla, record),       // Indexar 1 registro incremental
  removeRecord(tabla, id),          // Eliminar 1 registro del índice
  stats(tabla, campo),              // media, mediana, moda, min, max, stddev
  statsAll(),                       // Estadísticas de todas las tablas
  predict(tabla, campo, periodos),  // Regresión lineal
  forecast(valores, n),             // Proyección de array numérico
  movingAverage(valores, ventana),  // Media móvil
  initLite()                        // Inicializar FlexSearch + registrar tablas
};
```

### Perfil Full (adicional)

- Ingesta de documentos: PDF, DOCX, XLSX, CSV, MD
- Transformers.js para QA extractivo con modelos cuantizados (q4)
- SQLite FTS5 para búsqueda full-text sobre chunks
- Worker dedicado para no bloquear UI

### Integración con Cmd+K

Cuando IA Jutia está activa (`window.ia` existe), la command palette unifica:
1. Navegación de módulos (arriba)
2. Búsqueda en datos vía FlexSearch (abajo, con separador)

---

## 1️⃣2️⃣ Catálogo de 13 AHA Apps

Cada app tiene **3 niveles comerciales** que mapean a perfiles técnicos:

| Nivel | Perfil Técnico | Empaquetado |
|---|---|---|
| **Inicio** | Lite | ZIP + GitHub Pages |
| **Profesional** | Full | .exe + .apk + Pages + Release |
| **Enterprise** | Full custom | .exe + .apk + código fuente + UI personalizada + docs + brand.ps1 |

### Listado Completo

| # | App | Descripción | Módulos Clave |
|---|-----|-------------|---------------|
| 1 | **AHA Inventario** | Gestión de stock, entradas/salidas, alertas de stock mínimo, lotes, códigos de barras | usuarios, inventario, dashboard, configuracion |
| 2 | **AHA Comanda** | Toma de pedidos en mesa, pantalla cocina, impresora térmica, pagos | usuarios, comandas, inventario, dashboard, configuracion |
| 3 | **AHA CRM** | Clientes, pipeline de oportunidades, actividades, reportes de ventas | usuarios, crm, dashboard, configuracion, citas |
| 4 | **AHA Checklist** | Listas de verificación, auditorías, inspecciones con fotos y firmas | usuarios, checklist, dashboard, configuracion, campo |
| 5 | **AHA Asistencia** | Control horario, geolocalización en marcaciones, turnos, excepciones | usuarios, asistencia, dashboard, configuracion, flota |
| 6 | **AHA Citas** | Agenda, reservas, recordatorios, disponibilidad en tiempo real | usuarios, citas, crm, dashboard, configuracion |
| 7 | **AHA Gastos** | Ingresos, egresos, categorías, reportes PDF | usuarios, contabilidad, dashboard, configuracion |
| 8 | **AHA Contactos** | CRM manual, plantillas WhatsApp, recordatorios | usuarios, contactos, dashboard, configuracion |
| 9 | **AHA Campo** | Formularios offline, GPS, fotos, sincronización diferida | usuarios, campo, inventario, checklist, flota, dashboard, configuracion |
| 10 | **AHA POS** | Punto de venta, tickets, caja, arqueo, promociones | usuarios, inventario, comandas, dashboard, configuracion, prefactura |
| 11 | **AHA Rx** | Recetas médicas, dispensación, historial pacientes, alertas interacciones | usuarios, rx, dashboard, configuracion |
| 12 | **AHA Flota** | Vehículos, mantenimiento, rutas, consumo combustible, conductores | usuarios, flota, asistencia, dashboard, configuracion, campo |
| 13 | **AHA Obra** | Proyectos, partidas, avances de obra, materiales, certificaciones | usuarios, obra, inventario, checklist, campo, flota, dashboard, configuracion, prefactura |
| 14 | **AHA PreFactura** | Presupuestos, albaranes, facturación electrónica, series, impuestos | usuarios, prefactura, crm, dashboard, configuracion |

### Cómo Generar una App

```bash
# 1. Copiar template a spec
cp apps/AHA-Inventario/template.md specs/mi-inventario.md

# 2. Ejecutar pipeline
/new mi-inventario     # modo Classic (5 fases)
# o
/pro mi-inventario     # modo Design (10 fases con brand layer)
```

---

## 1️⃣3️⃣ Módulos Compartidos

### 13.1 `usuarios` – Gestión de Usuarios y Perfiles

**Apps:** Todas

**Tabla Dexie:**
```javascript
users: 'id, nombre, email, passwordHash, rol, avatar, createdAt, updatedAt'
user_sessions: 'id, userId, token, expiresAt, createdAt'
```

**Campos:**
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `nombre` | string | Nombre completo |
| `email` | string | Email único (cifrado) |
| `passwordHash` | string | Contraseña cifrada (CryptoJS) |
| `rol` | enum | `'admin' \| 'usuario' \| 'invitado'` |
| `avatar` | string | Ruta al avatar (FileStore) |

**Flujo:**
1. Login: verifica `passwordHash` con `cryptoHelpers.decrypt()`
2. Sesión: guarda token en `localStorage`, verifica contra `user_sessions`
3. Avatar: `FileStore.save('avatar', nombre, blob)` al subir foto

### 13.2 `configuracion` – Parámetros Globales

**Apps:** Todas

**Tablas:**
```javascript
app_settings: 'key, value, tipo, updatedAt'
app_preferences: 'userId, key, value, updatedAt'
```

**Keys comunes:**
- `general.theme` → `'light' | 'dark'`
- `general.language` → `'es' | 'en'`
- `notifications.push` → `true | false`

### 13.3 `dashboard` – Panel de Métricas

**Apps:** Todas

**Tablas:**
```javascript
dashboard_widgets: 'id, userId, type, title, query, config, createdAt'
dashboard_layout: 'userId, layout, updatedAt'
```

**Tipos de widget:**
- `chart` → gráfico Chart.js
- `metric` → número con tendencia
- `list` → registros recientes
- `quickAction` → botones de acción rápida

### 13.4 `inventario` – Stock y Productos

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

**Flujo crítico:** Los movimientos se generan automáticamente dentro de `db.transaction()` para mantener consistencia stock ↔ movimientos.

**Alerta:** Cuando `stock <= stockMin`, se dispara `UI.toast('warning')`.

### 13.5 `comandas` – Pedidos y Mesas

**Apps:** Comanda, POS

**Tablas:**
```javascript
mesas: 'id, numero, estado, sectorId, createdAt'
sectores: 'id, nombre, createdAt'
pedidos: 'id, mesaId, userId, estado, total, igv, descuento, observaciones, createdAt, updatedAt'
lineas_pedido: 'id, pedidoId, productoId, cantidad, precioUnitario'
```

**Estados de pedido:** `nuevo` → `en-proceso` → `completado` | `cancelado`

### 13.6 `crm` – Clientes y Oportunidades

**Apps:** CRM, Citas, Contactos

**Tablas:**
```javascript
clientes: 'id, tipo, nombre, email, phone, direccion, ruc, referidoPor, createdAt, updatedAt'
contactos: 'id, clienteId, nombre, email, phone, tipo, createdAt'
oportunidades: 'id, clienteId, titulo, valor, etapa, probabilidad, closeDate, userId, createdAt, updatedAt'
actividades: 'id, oportunidadId, tipo, titulo, fecha, completada, userId'
```

**Etapas de oportunidad:** `prospeccion` → `calificacion` → `propuesta` → `negociacion` → `cerrado-ganado/perdido`

### 13.7 `checklist` – Auditorías e Inspecciones

**Apps:** Checklist, Campo, Obra

**Tablas:**
```javascript
plantillas_checklist: 'id, nombre, items, createdAt'
items_checklist: 'id, plantillaId, texto, obligatorio, orden'
inspecciones: 'id, plantillaId, titulo, estado, userId, fechaInicio, fechaFin, createdAt'
respuestas: 'id, inspeccionId, itemId, respuesta, observacion, fotoPath'
```

**Estados:** `borrador` → `en-progreso` → `completado` → `revisionada`

**Integración:** Fotos vía `FileStore.save('foto', ...)`, firma digital en canvas.

### 13.8 `asistencia` – Control Horario

**Apps:** Asistencia, Flota

**Tablas:**
```javascript
turnos: 'id, userId, fecha, horaEntrada, horaSalida, estado, motivo'
marcas: 'id, turnoId, tipo, hora, ubicacionId'
ubicaciones: 'id, nombre, lat, lng'
```

**Tipos de marca:** `entrada` | `salida` | `descanso-inicio` | `descanso-fin`

**GPS:** `navigator.geolocation.getCurrentPosition()` para validar ubicación.

### 13.9 `citas` – Agenda y Reservas

**Apps:** Citas, CRM

**Tablas:**
```javascript
servicios: 'id, nombre, duracion, precio, createdAt'
citas: 'id, clienteId, servicioId, userId, fechaHora, duracion, estado, notas, createdAt, updatedAt'
```

**Estados:** `programada` → `confirmada` → `completada` | `cancelada`

**Calendar view:** Integración con librería de calendario.

### 13.10 `flota` – Vehículos

**Apps:** Flota, Campo, Obra

**Tablas:**
```javascript
vehiculos: 'id, placa, marca, modelo, año, tipo, combustible, kilometraje, estado, createdAt'
mantenimientos: 'id, vehiculoId, tipo, fecha, costo, descripcion, proxMantenimiento, estado'
conductor_asignado: 'vehiculoId, userId, asignadoAt'
```

**Tipos de mantenimiento:** `preventivo` | `correctivo` | `reparacion`

### 13.11 `rx` – Recetas Médicas

**Apps:** Rx

**Tablas:**
```javascript
recetas: 'id, pacienteId, medicoId, fecha, diagnostico, estado, pdfPath, createdAt'
lineas_receta: 'id, recetaId, medicamentoId, dosis, frecuencia, duracion, instrucciones'
medicamentos: 'id, codigo, nombre, laboratorio, stock, precio'
```

**Estados:** `borrador` → `emitida` → `dispensada` | `cancelada`

### 13.12 `prefactura` – Facturación

**Apps:** PreFactura, POS, Obra

**Tablas:**
```javascript
presupuestos: 'id, clienteId, numero, fecha, vencimiento, subtotal, igv, descuento, total, estado, userId'
lineas_presupuesto: 'id, presupuestoId, productoServicioId, tipo, descripcion, cantidad, precioUnitario'
facturas: 'id, presupuestoId, numero, serie, fechaEmision, hashDocumento, xmlPath, pdfPath'
```

**Integración:** PDF vía jsPDF + html2canvas. XML SUNAT en perfil Full.

### 13.13 `campo` – Formularios Offline

**Apps:** Campo, Obra

**Tablas:**
```javascript
formularios: 'id, codigo, nombre, campos, configuracion'
respuestas_form: 'id, formularioId, userId, datos, ubicacion, fecha, sincronizado, createdAt'
```

**Flujo offline:**
1. Captura datos sin conexión → almacena en Dexie
2. Al recuperar conexión → sincroniza automáticamente
3. Indicador visual de estado de sincronización

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

### Modo Classic (`/new`) – 5 Fases

```
1. Setup (setup-init)
   ├─ Valida entorno (curl, node, permisos)
   ├─ Crea estructura de directorios
   ├─ Genera archivos predeterminados (avatar, placeholder)
   └─ Descarga librerías (Tailwind, DaisyUI, Alpine, Dexie, etc.)

2. Spec (spec-engine)
   ├─ Lee template de app o historia de usuario
   ├─ Genera specs/[app].md (15 secciones)
   └─ Genera specs/DESIGN.md (brand layer)

3. Design (design-engine)
   ├─ Inyecta brand context desde DESIGN.md
   ├─ Aplica tokens DaisyUI (colores, tipografía)
   └─ Selecciona componentes UI según preferencia

4. Code (code-generator)
   ├─ FASE A: Core + index.html + project.config.js
   ├─ FASE B: Módulos (uno por turno, con pausa)
   └─ Validación automática de compliance

5. Validate + Deploy
   ├─ Compliance check (stack-compliance-guard)
   ├─ Brand audit (validation-engine)
   ├─ QA rubric (omd:final-qa)
   └─ Empaquetado + publicación (deployment-jigue)
```

### Modo Design (`/pro`) – 10 Fases

```
1. taste    →  omd:taste (preferencias de diseño)
2. init     →  omd:init (DESIGN.md bootstrap)
3. design   →  design-engine (brand injection)
4. spec     →  spec-engine (funcional + brand)
5. code     →  code-generator (módulos)
6. inject   →  omd:apply + omd:harness (microcopy, refinamiento)
7. review   →  omd:designer-review (revisión visual)
8. QA       →  omd:final-qa (rúbrica 8 ítems)
9. pack     →  deployment-jigue (empaquetado)
10. deploy  →  GitHub Pages / Release
```

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
| `/docs` | — | Abre docs/guia-skills-mcps.html |
| `/ia` | `mini ia` | Activa ia-jutia |
| `/deploy` | `publicar` | deployment-jigue |
| `/wiki` | `gestionar wiki` | wiki-engine |
| `/upgrade` | `actualizar perfil` | upgrade-engine |

---

## 1️⃣6️⃣ Instalación Global

Para usar el Ateje Stack desde cualquier proyecto:

```powershell
# Instalar (sin administrador)
.\install-global.ps1

# Desinstalar (sin dejar rastro)
.\uninstall-global.ps1
```

**Qué hace la instalación:**
1. Crea 13 directory junctions en `~/.opencode/skills/` apuntando a cada skill del repo
2. Agrega `skills.paths: ["~/.opencode/skills/"]` al config global OpenCode

**Efecto:**
- `/new`, `/pro`, `/build`, `/deploy`, etc. disponibles desde cualquier directorio
- Skills se actualizan solas al hacer `git pull` (son junctions, no copias)
- Sin interferencia con otros proyectos

---

## 1️⃣7️⃣ Herramientas de Desarrollo (Engram + OpenPencil)

Dos herramientas externas opcionales que mejoran la memoria del agente y el diseño visual. **No son requisito** — el pipeline funciona 100% sin ellas.

### Engram — Memoria Persistente

Engram reemplaza el MCP memory graph conceptual de `wiki-engine` con almacenamiento SQLite real + búsqueda FTS5 + 20 tools MCP.

| Concepto | Descripción |
|---|---|
| **¿Qué es?** | Servicio de memoria persistente para agentes de IA. Captura decisiones, preferencias y contexto entre sesiones. |
| **Instalación** | Descargar binary de [GitHub Releases](https://github.com/Gentleman-Programming/engram/releases) (~10MB Go binary) |
| **Configuración** | `scripts/setup-engram.ps1` — detecta Engram, configura `ENGRAM_DATA_DIR=.omd/`, inicializa el proyecto |
| **Uso en pipeline** | `wiki-engine` lo usa como backend de memoria durante ingest/query/lint |
| **MCP** | `C:\Users\Angel\bin\engram.exe mcp --project Ateje` — 20 herramientas MCP (create, search, read, delete entities, add observations, etc.) |
| **Fallback** | Sin Engram, `wiki-engine` usa markdown en `wiki/` + `.omd/preferences.md` |

**Flujo:**
1. `scripts/setup-engram.ps1` corre durante `/setup` si Engram está instalado
2. Configura `ENGRAM_DATA_DIR=.omd/` para que la memoria sea portable (en MCP se pasa ruta absoluta: `D:\REPOSITORIOS GitHUB\Ateje\.omd`)
3. `wiki-engine` invoca Engram via MCP para persistir y buscar conocimiento
4. Sin Engram: todo funciona con archivos markdown

### OpenPencil — Diseño Visual + MCP

OpenPencil es un editor visual Figma-compatible con CLI para extracción de tokens de diseño.

| Concepto | Descripción |
|---|---|
| **¿Qué es?** | Editor visual Figma-compatible + CLI para extraer tokens de diseño a DESIGN.md |
| **Componentes** | **Desktop App** (Tauri, ~7MB): editor visual + MCP server. **CLI** (`npm install -g @open-pencil/cli`): extracción headless de tokens |
| **Instalación** | `winget install OpenPencil.OpenPencil` (Desktop) + `npm install -g @open-pencil/cli` (CLI) |
| **Configuración** | `scripts/setup-opencil.ps1` — detecta CLI + Desktop, crea `assets/brand/`, imprime guía de uso |
| **Uso en pipeline** | `design-engine` Fase 1.5: extrae colores/tipografía/spacing desde archivos `.fig` y los inyecta en DESIGN.md como tokens DaisyUI `@theme` |
| **MCP** | `openpencil-mcp` — 90+ tools para leer/modificar diseño desde OpenCode (requiere Desktop App abierta) |

**Flujo de extracción de tokens:**
```bash
# 1. Abrir diseño en OpenPencil Desktop y exportar como .fig
# 2. Extraer tokens
openpencil analyze colors brand.fig --json > assets/brand/tokens-colors.json
openpencil analyze typography brand.fig --json > assets/brand/tokens-typography.json
openpencil analyze spacing brand.fig --json > assets/brand/tokens-spacing.json
# 3. Preview del diseño
openpencil preview brand.fig --output docs/preview-brand.html
# 4. design-engine lee los JSON y genera tokens DaisyUI @theme en DESIGN.md
```

**Token bridge:** OpenPencil analiza `.fig` → tokens JSON → DESIGN.md → DaisyUI `@theme` daisyui.config → el código generado coincide con el preview visual.

### MCP Servers en opencode.json

Ambos están configurados en `opencode.json` como entidades MCP opcionales:

```json
"engram": {
  "type": "local",
  "command": ["C:\\Users\\Angel\\bin\\engram.exe", "mcp", "--project", "Ateje"],
  "env": { "ENGRAM_DATA_DIR": "D:\\REPOSITORIOS GitHUB\\Ateje\\.omd" }
},
"open-pencil": {
  "type": "local",
  "command": ["openpencil-mcp"]
}
```

Si no tienes las herramientas instaladas, OpenCode ignora estos MCP servers silenciosamente.

### ¿Cuándo activarlas?

| Herramienta | Activar si... | Beneficio |
|---|---|---|
| **Engram** | El agente olvida decisiones entre sesiones de trabajo | Memoria persistente SQLite/FTS5, 20 tools MCP, dashboard visual |
| **OpenPencil** | Tienes diseños en Figma/OpenPencil y quieres que el código generado coincida exactamente | Tokens de diseño automáticos, preview visual, MCP para edición desde OpenCode |

---

## 1️⃣8️⃣ Buenas Prácticas

### Código

- ✅ Todo código debe pasar **Stack Compliance Guard** (sin imports ES6, rutas relativas, cifrado aplicado, UI consistente)
- ✅ Usar `dbLocal()` para lectura instantánea desde IndexedDB en vez de `dbOnline.getAll()` (HTTP)
- ✅ Sincronización en background con `Promise.all()` para las 8 tablas
- ✅ `bulkAdd()` en vez de `for await add()` en refreshCache

### UI/UX

- ✅ Skeletons CSS (`.sk-el`, `.sk-card`, `.sk-row`, etc.) en vez de spinners genéricos
- ✅ Inicializar `Alpine.store('loading', ...)` ANTES de que Alpine procese el DOM
- ✅ `checkSession()` leer de IndexedDB primero, verificación contra Supabase en background
- ✅ Forms siempre en modal con `UI.modalForm()`
- ✅ Feedback con `UI.toast()` (nunca `alert()`)

### Datos

- ✅ Todas las tablas de negocio usan `id` (UUID string, no ++id) + `createdBy` + `createdAt` + `updatedAt`
- ✅ Campos sensibles cifrados automáticamente vía `cryptoHelpers.encrypt()`
- ✅ Operaciones Dexie en lotes de 200 en vez de `toArray()` completo
- ✅ Archivos gestionados exclusivamente vía `FileStore`, nunca acceso directo a `_files` o `_file_blobs`

### Perfiles

- ✅ No existe Full → Lite (degradación ilógica)
- ✅ NeutralinoJS es runtime Full único
- ✅ No modificar módulos ni datos al migrar perfil (solo infraestructura)

---

> 📌 **Documentación generada a partir del repositorio Ateje.**
>
> Última actualización: junio 2026
