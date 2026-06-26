---
name: code-generator
description: Genera código estructurado y funcional siguiendo estrictamente specs/[app].md y @AGENTS.md. Flujo por fases, validación automática de compliance, y output listo para file:// sin imports ES6. Soporta librerías adicionales desde la spec.
license: MIT
compatibility: Requiere @AGENTS.md, specs/[app].md, project.config.js presentes. Funciona offline-first, sin builds, sin CDNs, sin imports. Lee libreriasAdicionales de la spec.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "3.0"
  perfiles: [lite, full]
  generatedBy: "code-generator skill"
  triggers: ["generar codigo", "crear módulos", "implementar spec", "build app", "escribir código", "code-generator"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "alpine-ui-patterns", "bootstrap-icons", "animate.css"]
  language: es
  inputSpec: "specs/[app].md"
  autoValidate: true
---

# 🛠️ SKILL: code-generator (Generación de Código Offline-First)

> **Propósito**: Transformar `specs/[app].md` en código funcional, modular y 100% compatible con `file://`. Entrega por fases para evitar pérdida de contexto, aplica `stack-compliance-guard` automáticamente y respeta `design-ux-intelligence`.
> **Modo**: Iterativo por fases | **Idioma**: ES | **Contexto**: Requiere spec validada + @AGENTS.md
> **Output**: Archivos `.js` y `.html` listos para copiar/pegar o escribir directamente en el proyecto.

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

> **Nota**: ~95% del código es idéntico entre perfiles (Alpine + Dexie + CryptoJS + UI). Solo difieren setup/build/deploy. Los templates core son los mismos para Lite y Full.

### 🟢 FASE 1: Carga de Spec y Perfil
1. Lee `specs/[app].md` y extrae:
   - Módulos requeridos (`modulosActivos`)
   - Campos sensibles a cifrar
   - Reglas de UI/UX y animaciones
   - Configuración de `project.config.js`
   - **Librerías adicionales** (sección `## 📚 Librerías Adicionales` o bloque `libreriasAdicionales`)
   - **Perfil** (`project.config.js` → `APP_CONFIG.perfil`: lite/full)
   - **IA Jutia** (`APP_CONFIG.iaJutia.perfil`: lite/full/no)
   - **component_library** (`.omd/preferences.md` o `APP_CONFIG.componentLibrary`): `auto` | `daisyui` | `pines` | `penguin` | `pinemix`
 2. Si detecta librerías adicionales o IA, las incluye en el plan:
   ```
   📋 PLAN DE GENERACIÓN
   • Perfil: [lite|full]
   • Core: app.js, db.js, crypto.js, ui.js, theme.js, main.js, index.html (compartido 95%)
   • Módulos: [lista de módulos desde spec] (compartidos)
    • IA Jutia: [lite|full|no] (genera modules/ia-jutia/ + core/ia.js)
    • Librería UI: [daisyui|pines|penguin|pinemix] (desde preferencia o auto)
    • Librerías adicionales: [lista] (desde spec)
   • Full extra: src/index.js (Bun server entry point)
   • Validación: stack-compliance-guard auto-aplicado
   • Entregable: Código por bloques con ruta exacta
   ✅ ¿Procedo con FASE 2: Core y Shell? (Responde: SÍ)
   ```
3. **ESPERA confirmación** antes de continuar.

### 🟡 FASE 2: Core, Shell y Configuración
Genera los archivos base **en un solo bloque bien estructurado** con rutas exactas.
**Estos archivos son idénticos para Lite y Full:**

**Index.html con librerías dinámicas:**
El orden de carga debe ser: CSS base → CSS adicional (si hay) → Libs base → **Libs adicionales (desde spec)** → Core → Main

```markdown
📁 CORE / INDEX
### `index.html`
[Contenido completo con orden: CSS → Libs base → Libs adicionales → Core → Main, x-cloak, sin type="module"]

### `core/db.js`
[Iniciación Dexie según spec. Variables globales. window.db expuesto. Todas las tablas de negocio usan `id` (UUID string, no ++id) + `createdBy` + `createdAt` + `updatedAt`.

**Tablas de sistema (siempre incluidas):**
- `_files`: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt'
  - path: ruta relativa a APP_DATA_DIR, ej: "avatars/uuid-user.jpg"
  - tipo: 'avatar' | 'foto' | 'doc' | 'logo' | 'backup'
  - hash: SHA-256 hex del archivo (para dedup en import)
  - refCount: contador de referencias desde registros de negocio

**Tablas de sistema (Lite only, si perfil=lite):**
- `_file_blobs`: '&path'
  - Almacena los blobs binarios cuando no hay acceso a disco (file://)

### `core/crypto.js`
[encrypt/decrypt + gestión de clave localStorage + uuid(). window.cryptoHelpers expuesto. window.uuid generador UUID v4 compatible file://]

Añadir al final del archivo:
```javascript
// Generador UUID v4 (compatible con file:// — no requiere crypto.randomUUID)
window.uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};
```

### `core/ui.js`
[API estándar de UI expuesta en `window.UI`:

```javascript
window.UI = {
  // Toast: feedback no bloqueante. tipos: 'success' | 'error' | 'warning' | 'info'
  toast(msg, tipo = 'info', duracion = 4000),

  // Confirm: modal de confirmación. Retorna Promise<boolean>
  confirm(msg, titulo = 'Confirmar'),

  // ModalForm: renderiza formulario dentro de <dialog> Alpine+DaisyUI
  // html: template string con el formulario
  // onSave: async(data) → se llama al submit, cierra modal si ok
  modalForm(titulo, html, onSave),

  // Loading: overlay de carga
  loading(show = true),

  // Formateo
  formatDate(date),       // "24 jun 2026"
  formatCurrency(n),      // "$1,234.00"
  formatBytes(bytes),     // "1.5 MB"
  formatRelative(date)    // "hace 2 horas"
}
```

**Reglas de uso (padrones):**
- ✅ Feedback siempre con `UI.toast()`, NUNCA `alert()` nativo
- ✅ Antes de `db.delete()`, SIEMPRE `UI.confirm()`
- ✅ Todos los formularios crear/editar vía `UI.modalForm()`
- ✅ Operaciones largas (export, import, cálculo) con `UI.loading(true/false)`]

### `core/theme.js`
[Inyección de CSS variables desde APP_CONFIG.tema.colores. window.themeStore]

### `core/search-palette.js`
[Command Palette (Cmd+K) global con navegación de módulos + búsqueda IA integrada.

- Atajo: `Ctrl+K` / `Cmd+K` (global, no interfiere con inputs)
- Navegación por teclado: flechas arriba/abajo + Enter
- Escape o click fuera para cerrar
- Si `window.ia` existe (IA Jutía activa), añade resultados de búsqueda FlexSearch
- Renderiza vía Alpine `x-teleport` desde markup en index.html

```javascript
// core/search-palette.js — se carga después de core/app.js
// Ver template en code-generator/templates/search-palette.js
```

![Busca módulos al instante: escribe "inven" y muestra acceso directo a Inventario]

**Reglas:**
- ✅ `@keydown.window.cmd.k.prevent` como único atajo
- ✅ Si IA Jutía está activa, su palette se unifica aquí (no duplicar atajos)
- ✅ Navegación por teclado con índice seleccionado resaltado
- ✅ Cerrar siempre con Escape

**Markup en index.html (x-teleport a body):**
```html
<div x-data="searchPalette"
     @keydown.window.cmd.k.prevent="openPalette()"
     @keydown.window.ctrl.k.prevent="openPalette()"
     @keydown.window="onKeydown">
  <template x-teleport="body">
    <div x-show="open" x-cloak class="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh]"
         @click.away="closePalette">
      <div class="absolute inset-0 bg-base-300/60 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-xl">
        <div class="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
          <!-- Input -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-base-200">
            <svg class="w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input x-model="query" type="text" class="sp-search-input flex-1 bg-transparent border-0 outline-none text-base placeholder:text-base-content/30"
                   placeholder="Buscar módulos o registros...">
            <kbd class="hidden sm:inline-flex px-2 py-0.5 text-xs rounded bg-base-200 text-base-content/50">ESC</kbd>
          </div>
          <!-- Results -->
          <div class="max-h-80 overflow-y-auto p-2">
            <template x-if="!hasResults && query.length >= 2">
              <div class="px-3 py-8 text-center text-sm text-base-content/40">
                <svg class="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Sin resultados para "<span x-text="query"></span>"
              </div>
            </template>
            <template x-if="!query">
              <div class="px-3 py-2 text-xs font-semibold text-base-content/40 uppercase tracking-wider">Módulos</div>
            </template>
            <template x-for="(item, i) in filtered" :key="i">
              <template x-if="item.type === 'separator'">
                <div class="px-3 py-1.5 text-xs font-semibold text-base-content/30 uppercase tracking-wider">Registros</div>
              </template>
              <template x-if="item.type !== 'separator'">
                <div @click="selectItem(item)" @mouseenter="keyboardNav = false"
                     :class="{'bg-primary/10 text-primary': keyboardNav && item._kIdx === selectedIdx, 'hover:bg-base-200': !(keyboardNav && item._kIdx === selectedIdx)}"
                     class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors">
                  <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 text-base-content/60 shrink-0">
                    <i :class="'bi ' + item.icon" class="text-sm"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate" x-text="item.title"></div>
                    <div x-show="item.subtitle" class="text-xs text-base-content/40 truncate" x-text="item.subtitle"></div>
                  </div>
                  <span x-show="item.type === 'module'" class="badge badge-ghost badge-sm">módulo</span>
                  <span x-show="item.type === 'record'" class="badge badge-ghost badge-sm">registro</span>
                </div>
              </template>
            </template>
          </div>
          <!-- Footer -->
          <div class="flex items-center gap-4 px-5 py-2.5 border-t border-base-200 text-xs text-base-content/40">
            <span class="flex items-center gap-1"><kbd class="kbd kbd-xs">↑↓</kbd> Navegar</span>
            <span class="flex items-center gap-1"><kbd class="kbd kbd-xs">↵</kbd> Abrir</span>
            <span class="flex items-center gap-1"><kbd class="kbd kbd-xs">Esc</kbd> Cerrar</span>
          </div>
        </div>
      </div>
    </div>
  </template>
</div>
```

**Si IA Jutía está activa**, la búsqueda de registros se integra automáticamente a través de `window.ia.search()`.]

### `core/app.js`
[Router hash-based, carga de módulos, init global. window.appRouter]

### `main.js`
[Punto de entrada. Expone globals, llama a init(), maneja errores]

### `core/network.js` (si la app requiere monitoreo de conexión)
[Monitoreo navigator.onLine, eventos online/offline, Alpine store]

### `core/file-store.js` (siempre incluido — gestión de archivos en APP_DATA_DIR)
[Gestión unificada de archivos (avatares, fotos, documentos) con dos backends según perfil:

**Lite (file://):** almacena blobs en tabla Dexie `_file_blobs`. `getURL()` retorna ObjectURL.

**Full (NeutralinoJS / Capacitor):** escribe a disco en `APP_DATA_DIR`. `getURL()` retorna ruta real.

API:
```javascript
window.FileStore = {
  APP_DATA_DIR: string,        // resuelve según perfil
  async save(tipo, nombre, blob) → { path, hash, url },
  async getURL(path) → string,  // URL para <img> o <a>
  async read(path) → Blob,
  async delete(path),
  async cleanOrphans(),         // elimina archivos con refCount === 0
  async meta(path) → object,    // metadata desde db._files
  avatarDefault() → string      // ruta al avatar default
}
```

```javascript
// Ver template completo en code-generator/templates/file-store.js
```]

### `core/sync.js` (siempre incluido — export/import .ateje-backup)
[Motor de respaldo: exporta todas las tablas Dexie a archivo cifrado/comprimido y restaura en cualquier perfil]

### `sw.js` (si la app requiere PWA/instalabilidad)
[Service Worker con cache-first, skipWaiting, clientsClaim]

### `manifest.json` (si la app requiere PWA/instalabilidad)
[Manifest con name, icons, display standalone, theme_color]

### `project.config.js`
[Config white-label completa según spec, incluyendo:

**Secciones estándar (siempre):**
- `app`: nombre, version, tipo, descripcion
- `perfil`: lite | full
- `iaJutia`: lite | full | no
- `modulosActivos`: array de IDs de módulos
- `tema`: modo (claro|oscuro), colores (DaisyUI palette), tipografia
- `cifrado`: camposSensibles[], storageKey
- `modulos`: objeto clave-valor con titulo, icono, activo por módulo

**Sección `data` (siempre):**
```javascript
data: {
  dir: 'data/',
  maxFileSize: 10 * 1024 * 1024,
  tipos: ['avatar', 'foto', 'doc', 'logo', 'backup'],
  avatars: { default: 'data/defaults/avatar.png', size: 200, calidad: 0.8 }
}
```

**Sección `sync` (siempre):**
```javascript
sync: {
  primaryFormat: 'json',
  secondaryFormats: APP_CONFIG.perfil === 'full' ? ['sqlite'] : [],
  includeFiles: true,
  encrypt: true,
  maxExportSize: 50 * 1024 * 1024
}
```

**Sección `ui` (siempre):**
```javascript
ui: {
  formsMode: 'modal',
  alerts: 'toast',
  confirmDelete: true,
  avatars: true,
  avatarDefault: 'data/defaults/avatar.png'
}
```]

**Si perfil=Full, añadir archivos extra:**
### `neutralino.config.json`
[Configuracion de NeutralinoJS para app de escritorio nativa. Ver deployment-jigue/templates/neutralino.config.json]
```json
{
  "applicationId": "com.empresa.app",
  "version": "1.0.0",
  "defaultMode": "window",
  "documentRoot": "/",
  "url": "/",
  "port": 0,
  "enableServer": true,
  "enableNativeAPI": true,
  "nativeWindow": {
    "title": "AppName",
    "icon": "favicon.ico",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "resizable": true,
    "center": true
  },
  "cli": {
    "binaryName": "app-name",
    "resourcesPath": "/",
    "clientLibrary": "core/neutralino.js",
    "binaryVersion": "6.0.0",
    "clientVersion": "6.0.0"
  }
}
```

**Durante el setup (`/setup`), descargar `neutralino.js`:**
```bash
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js" -OutFile "core/neutralino.js"
```

**Si perfil=Full y se requiere .apk, añadir tambien:**
### `capacitor.config.json`
[Configuracion de Capacitor para APK Android nativo. Ver capacitor/templates/capacitor.config.json]
```json
{
  "appId": "com.empresa.app",
  "appName": "AppName",
  "webDir": "public",
  "plugins": {
    "CapacitorSQLite": { "androidIsEncrypted": false },
    "LocalNotifications": { "smallIcon": "ic_stat_icon_config_sample", "iconColor": "#1e3a5f" }
  },
  "android": {
    "minSdkVersion": 26,
    "targetSdkVersion": 34,
    "compileSdkVersion": 34
  }
}
```

### Inyectar `capacitor-detect.js` en `core/app.js` (si aplica)
Al final de `core/app.js` (antes de `Alpine.start()`), añadir el bloque de deteccion
de Capacitor desde `capacitor/templates/capacitor-detect.js`. Esto permite que
todos los plugins nativos funcionen con fallback web automatico.

⏸️ PAUSA. Revisa estructura. Responde "✅ FASE 2 OK" para continuar.
```

**Reglas para inyectar librerías adicionales en index.html:**
```html
<!-- CSS base -->
<link rel="stylesheet" href="assets/css/tailwind.min.css">
<link rel="stylesheet" href="assets/css/daisyui.min.css">
<link rel="stylesheet" href="assets/css/bootstrap-icons.css">
<link rel="stylesheet" href="assets/css/animate.min.css">

<!-- JS Librerías base -->
<script src="assets/js/libs/alpine.js"></script>
<script src="assets/js/libs/dexie.js"></script>
<script src="assets/js/libs/crypto-js.js"></script>
<script src="assets/js/libs/pako.js"></script>
<script src="assets/js/libs/chart.js"></script>
<script src="assets/js/libs/jspdf.js"></script>
<script src="assets/js/libs/xlsx.js"></script>

<!-- 📚 JS Librerías adicionales (desde spec) -->
<script src="assets/js/libs/qrcode.min.js"></script>
<script src="assets/js/libs/dayjs.min.js"></script>
<!-- FIN librerías adicionales -->

<!-- Core -->
<script src="core/db.js"></script>
<script src="core/crypto.js"></script>
<script src="core/ui.js"></script>
<script src="core/theme.js"></script>
<script src="core/app.js"></script>
<script src="core/search-palette.js"></script>
<script src="core/file-store.js"></script>
<script src="core/sync.js"></script>

<!-- Main -->
<script src="main.js"></script>
```

4. **NO GENERA MÓDULOS AÚN**. Espera confirmación.

### 🔵 FASE 3: Generación de Módulos (Iterativa)
Para cada módulo en la spec:
1. Genera **SOLO UN MÓDULO** por turno.
2. Formato exacto:
   ```markdown
   📦 MÓDULO: [nombre-id]
   ### `modules/[nombre-id]/module.js`
   [Lógica CRUD, cifrado automático en campos sensibles, registro en window.MODULES, validación UI, feedback con UI.toast()]

### `modules/[nombre-id]/module.html`
    [HTML puro + Alpine x-data/x-init, componentes según `component_library` (DaisyUI / Pines / Penguin / Pinemix), Bootstrap Icons en botones, Animate.css en entradas, responsive mobile-first]

    🛡️ Stack Compliance: ✅ Validado automáticamente (sin imports, rutas relativas, cifrado aplicado, UI consistente)
   ⏸️ PAUSA. Responde "✅ [nombre-id] OK" para el siguiente módulo.
   ```
3. Repite hasta completar todos los módulos de la spec.

### 🟣 FASE 4: Ensamblaje Final y Handoff
1. Confirma que todos los módulos están generados.
2. Entrega snippet final de `project.config.js` con `modulosActivos` actualizado.
3. Si perfil=Full, sugiere opciones de compilacion:
```bash
# .exe (NeutralinoJS)
cd proyecto && neu build --release
# .apk (Capacitor, si aplica)
cd proyecto && npx cap sync android && cd android && ./gradlew assembleRelease
```
   El .exe se genera en `dist/[app-name]-win_x64.zip` (~2MB runtime).
   El .apk se genera en `android/app/build/outputs/apk/release/app-release.apk`.
4. Mensaje de cierre:
```
✅ GENERACIÓN COMPLETADA
📦 Perfil: [lite|full]
📂 Estructura: lista
🧠 IA Jutia: [lite|full|no]
🛡️ Compliance: 100% validado
📄 Especificación: specs/[app].md
🚀 Siguiente paso: validar app (ejecuta: validar app)
📦 Para empaquetar: ejecuta publicar
```

---

## 🛡️ AUTO-COMPLIANCE (EJECUTAR SIEMPRE ANTES DE MOSTRAR CÓDIGO)
Internamente, ejecuta `stack-compliance-guard` sobre cada bloque:
- [ ] ¿`import`/`export`/`type="module"`? → ELIMINAR + usar variables globales
- [ ] ¿`fetch`/CDN/URLs absolutas? → REEMPLAZAR por Dexie/`assets/`
- [ ] ¿Campo sensible sin `cryptoHelpers.encrypt()`? → AÑADIR CIFRADO
- [ ] ¿UI sin DaisyUI/Bootstrap Icons/Animate.css? → APLICAR COMPONENTES
- [ ] ¿Módulo no sigue contrato (`id`, `init`, `render`, `destroy`)? → REESCRIBIR
- [ ] ¿Librerías adicionales cargadas vía CDN en vez de `assets/`? → REEMPLAZAR por ruta local
- [ ] ¿`index.html` mezcla libs base con adicionales fuera de orden? → REORDENAR
- [ ] ¿Librerías adicionales de la spec faltan en los `<script>` de index.html? → AGREGAR
- [ ] ¿`sw.js` generado pero no registrado en index.html? → AGREGAR registro
- [ ] ¿`manifest.json` generado pero no enlazado? → AGREGAR `<link rel="manifest">`
- [ ] ¿Falta `core/network.js` en apps que monitorean conexión? → AGREGAR
- [ ] **Sync**: ¿Falta `core/sync.js`? → AGREGAR (siempre se incluye por defecto)
- [ ] **Sync**: ¿Operaciones Dexie en sync.js sin try/catch? → AGREGAR manejo de errores
- [ ] **Sync**: ¿Export/import sin feedback visual (UI.toast)? → AGREGAR notificaciones
- [ ] ¿Operaciones Dexie sin try/catch ni Result Type? → AGREGAR manejo de errores
- [ ] ¿Botón sin loading state en operaciones async? → AÑADIR `loading-spinner` de DaisyUI
- [ ] ¿Sin offline banner en apps PWA? → SUGERIR indicador de conexión
- [ ] **Padrones UI**: ¿Form crear/editar fuera de modal? → REEMPLAZAR por `UI.modalForm()`
- [ ] **Padrones UI**: ¿`alert()` nativo en vez de `UI.toast()`? → REEMPLAZAR
- [ ] **Padrones UI**: ¿`db.delete()` sin `UI.confirm()` previo? → AGREGAR confirmación
- [ ] **Padrones UI**: ¿Lista sin tabla responsive (`overflow-x-auto` + `table`)? → CORREGIR
- [ ] **Padrones UI**: ¿Falta empty state cuando no hay datos? → AGREGAR
- [ ] **Padrones UI**: ¿Lista usa spinner en vez de skeleton? → REEMPLAZAR por skeleton DaisyUI
- [ ] **Perfil**: ¿perfil=Full sin `neutralino.config.json`? → ❌ RECHAZAR (Neutralino requiere config)
- [ ] **Perfil**: ¿perfil=Full y usa `import`/`export`? → ❌ RECHAZAR (Neutralino sirve HTML directo, sin bundler)

=== OUTPUT ENFORCEMENT (De taste-skill/output-skill) ===
- [ ] ¿`// ...` / `// TODO` / `// rest of code` en output? → ❌ COMPLETAR código real
- [ ] ¿Skeleton/ejemplo parcial donde se pidió implementación completa? → ❌ GENERAR todo
- [ ] ¿"for brevity", "let me know if you want me to continue" en prosa? → ❌ ELIMINAR y completar
- [ ] ¿Secciones omitidas entre primera y última? → ❌ ESCRIBIR cada sección completa
- [ ] ¿Count de deliverables real vs solicitado? → ✅ VERIFICAR antes de outputtear
Si falla: corrige silenciosamente y añade `🛡️ Ajustado a reglas offline-first.` al output.

---

## 📐 PATRONES DE CÓDIGO OBLIGATORIOS

### `module.js` (Estructura Base + Padrones UI)
```javascript
const [NombreModulo] = {
  id: '[id-lowercase]',
  titulo: '[Título Visible]',
  icono: 'bi bi-[icon-name]',

  async init() {
    console.log(`💡 [${this.id}] Inicializado`);
    this.cargarDatos();
  },

  async render(params = {}) {
    // Retorna HTML según module.html template con:
    // - Toolbar con botón Agregar + búsqueda
    // - Lista en <table class="table">
    // - Empty state si no hay datos
    // - Loading skeleton
  },

  destroy() {
    // Limpieza de intervals/listeners
  },

  // ─── CRUD con padrones UI ───

  async abrirForm(item = null) {
    const editando = !!item
    if (editando) {
      // Descifrar campos sensibles antes de mostrar
      const descifrado = { ...item }
      if (APP_CONFIG.cifrado.camposSensibles) {
        for (const campo of APP_CONFIG.cifrado.camposSensibles) {
          if (descifrado[campo]) descifrado[campo] = cryptoHelpers.decrypt(descifrado[campo])
        }
      }
    }
    const html = `
      <div class="space-y-4">
        <label class="form-control w-full">
          <span class="label-text">Nombre</span>
          <input type="text" x-model="form.nombre"
                 class="input input-bordered" />
        </label>
      </div>`
    await UI.modalForm(
      editando ? 'Editar [Título]' : 'Nuevo [Título]',
      html,
      async (data) => {
        if (editando) await this.actualizar(item.id, data)
        else await this.guardar(data)
        await this.cargarDatos()
      }
    )
  },

  async guardar(datos) {
    const registro = {
      id: uuid(),
      // Campos sensibles → cifrar
      nombre: APP_CONFIG.cifrado.camposSensibles.includes('nombre')
        ? cryptoHelpers.encrypt(datos.nombre) : datos.nombre,
      email: APP_CONFIG.cifrado.camposSensibles.includes('email')
        ? cryptoHelpers.encrypt(datos.email) : datos.email,
      // No sensibles → directos
      telefono: datos.telefono,
      createdBy: APP_CONFIG?.usuarioActual || 'anon',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.[tabla].put(registro);
    UI.toast('Guardado correctamente', 'success');
  },

  async actualizar(id, datos) {
    const existente = await db.[tabla].get(id);
    if (!existente) { UI.toast('Registro no encontrado', 'error'); return; }
    const actualizado = { ...existente, ...datos, id, updatedAt: new Date() };
    // Re-cifrar campos sensibles si vienen descifrados del form
    for (const campo of APP_CONFIG.cifrado.camposSensibles) {
      if (actualizado[campo] && !actualizado[campo].startsWith('U2FsdGVkX1')) {
        actualizado[campo] = cryptoHelpers.encrypt(actualizado[campo])
      }
    }
    await db.[tabla].put(actualizado);
    UI.toast('Actualizado correctamente', 'success');
  },

  async eliminar(item) {
    const ok = await UI.confirm(`Eliminar ${item.nombre || 'este registro'}?`)
    if (!ok) return
    try {
      await db.[tabla].delete(item.id)
      UI.toast('Eliminado correctamente', 'success')
      await this.cargarDatos()
    } catch (e) {
      UI.toast(e.message, 'error')
    }
  }
};

window.MODULES = window.MODULES || {};
window.MODULES[[NombreModulo].id] = [NombreModulo];
```

### `module.html` (Reglas UI + Padrones)

**Reglas obligatorias (padrones):**
1. ✅ **Forms crear/editar SIEMPRE en modal** vía `UI.modalForm()`. El botón "Agregar" abre el modal, no navega.
2. ✅ **Feedback** con `UI.toast()`. NUNCA `alert()`.
3. ✅ **Antes de borrar** mostrar `UI.confirm()`.
4. ✅ **Toolbar** con botón "Agregar" (abre modal), búsqueda (input con debounce), y "PDF" si aplica.
5. ✅ **Lista** en `<div class="overflow-x-auto">` con `<table class="table">`.
6. ✅ **Avatar** en listas si el módulo tiene campo foto: `<div class="avatar"><div class="w-10 rounded-full">`.
7. ✅ **Empty state** cuando no hay datos: icono grande + mensaje + botón "Agregar primero".
8. ✅ **Loading state** con skeleton (clases de DaisyUI), no spinner genérico.

```html
<!-- Vista principal: toolbar + lista + empty state -->
<div x-data="[id]Data()" x-init="init()" class="animate__animated animate__fadeInUp">
  <!-- Título -->
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <i class="bi bi-[icon-name]"></i> [Título]
  </h2>

  <!-- Toolbar -->
  <div class="flex flex-wrap gap-2 mb-4">
    <button class="btn btn-primary" @click="abrirForm()">
      <i class="bi bi-plus-lg"></i> Agregar
    </button>
    <input type="search" x-model="busqueda" placeholder="Buscar..."
           class="input input-bordered flex-1 min-w-[200px]" />
    <button class="btn btn-ghost" @click="exportPDF()" x-show="items.length">
      <i class="bi bi-file-earmark-pdf"></i> PDF
    </button>
  </div>

  <!-- Lista -->
  <template x-if="items.length">
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th x-show="APP_CONFIG.ui.avatars">Foto</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr x-for="item in items">
            <!-- Avatar -->
            <td x-show="APP_CONFIG.ui.avatars">
              <div class="avatar">
                <div class="w-10 rounded-full">
                  <img :src="FileStore?.getURL(item.avatar) || APP_CONFIG.data.avatars.default"
                       @error="$el.src=APP_CONFIG.ui.avatarDefault">
                </div>
              </div>
            </td>
            <td x-text="item.nombre"></td>
            <td>
              <button class="btn btn-sm btn-ghost" @click="abrirForm(item)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-ghost text-error" @click="eliminar(item)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <!-- Empty state -->
  <template x-if="!items.length && !cargando">
    <div class="flex flex-col items-center justify-center py-16 text-base-content/50">
      <i class="bi bi-[icon-name] text-6xl mb-4"></i>
      <p class="text-lg mb-4">No hay [título] aún</p>
      <button class="btn btn-primary" @click="abrirForm()">
        <i class="bi bi-plus-lg"></i> Agregar primero
      </button>
    </div>
  </template>

  <!-- Loading skeleton -->
  <template x-if="cargando">
    <div class="space-y-3">
      <div class="skeleton h-12 w-full"></div>
      <div class="skeleton h-12 w-full"></div>
      <div class="skeleton h-12 w-full"></div>
    </div>
  </template>
</div>
```

**Uso de `UI.modalForm()` en `module.js`:**
```javascript
async abrirForm(item = null) {
  const editando = !!item
  const html = `
    <div class="space-y-4">
      <label class="form-control w-full">
        <span class="label-text">Nombre</span>
        <input type="text" x-model="form.nombre"
               class="input input-bordered" />
      </label>
    </div>`
  await UI.modalForm(
    editando ? 'Editar [Título]' : 'Nuevo [Título]',
    html,
    async (data) => {
      if (editando) await this.actualizar(item.id, data)
      else await this.guardar(data)
      await this.cargarLista()
    }
  )
}
```

---

## 📦 PLANTILLAS AVANZADAS (De antigravity-awesome-skills)

### PWA: Service Worker + Manifest

Generar en FASE 2 cuando la app requiera instalabilidad o carga offline:

#### `sw.js` (Service Worker con Workbox-style cache strategies)
```javascript
// sw.js — Offline-first cache strategies
const CACHE = 'v1';
const ASSETS = [
  '/',
  'index.html',
  'assets/css/tailwind.min.css',
  'assets/css/daisyui.min.css',
  'assets/css/bootstrap-icons.css',
  'assets/css/animate.min.css',
  'assets/js/libs/alpine.js',
  'assets/js/libs/dexie.js',
  'assets/js/libs/crypto-js.js',
  'core/db.js', 'core/crypto.js',
  'core/ui.js', 'core/theme.js',
  'core/app.js', 'core/search-palette.js',
  'core/file-store.js', 'core/sync.js', 'main.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first para assets, network-first para navegación
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(r => r || fetch(req))
  );
});
```

#### `manifest.json`
```json
{
  "name": "[Nombre App]",
  "short_name": "[Nombre Corto]",
  "description": "[Descripción]",
  "start_url": "index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "[color primario de tema]",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Registro en index.html:**
```html
<link rel="manifest" href="manifest.json">
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
</script>
```
Colocar DESPUÉS del bloque de librerías adicionales, antes de Core.

### Network Status Monitoring (core/network.js)
```javascript
// core/network.js — Monitoreo de conectividad offline-first
window.network = {
  online: navigator.onLine,

  init() {
    window.addEventListener('online', () => {
      this.online = true;
      this._notify();
    });
    window.addEventListener('offline', () => {
      this.online = false;
      this._notify();
    });
  },

  _notify() {
    const evt = new CustomEvent('connection-change', {
      detail: { online: this.online }
    });
    window.dispatchEvent(evt);
    if (typeof Alpine !== 'undefined') {
      Alpine.store('network', { online: this.online });
    }
  }
};
window.network.init();
```

**Uso en Alpine:**
```html
<span x-data x-init="$store.network = { online: navigator.onLine }"
      x-on:connection-change.window="$store.network.online = $event.detail.online"
      class="badge"
      :class="$store.network.online ? 'badge-success' : 'badge-error'">
  <i :class="$store.network.online ? 'bi-wifi' : 'bi-wifi-off'"></i>
  <span x-text="$store.network.online ? 'En línea' : 'Sin conexión'"></span>
</span>
```

### Sync Engine (core/sync.js — export/import .ateje-backup)

Motor universal de respaldo para el stack offline-first. Exporta TODAS las tablas Dexie (incluyendo `_files` y opcionalmente `_file_blobs`) a un archivo `.ateje-backup` cifrado (CryptoJS AES) y comprimido (pako), y lo restaura en cualquier perfil (Lite/Full/Mobile). Mismo código, mismo formato.

**Soporte de archivos:** La exportación incluye los metadatos de `_files` y los blobs de `_file_blobs` (perfil Lite) para que fotos, avatares y documentos viajen completos en el backup. En importación, restaura primero los archivos y luego los datos de negocio.

```javascript
// core/sync.js — Export/Import de datos offline-first con soporte de archivos
// Formato .ateje-backup: JSON → pako.deflate → CryptoJS.AES
window.SyncEngine = {
  _password: '',
  _excludeTables: ['modelos_cache', '_ia_sqlite'], // tablas que no se incluyen

  setPassword(pwd) {
    this._password = pwd || '';
  },

  async exportar(password) {
    const pwd = password || this._password;
    try {
      UI.toast('Preparando respaldo...', 'info');
      const tables = {};
      let files, blobs;
      const appName = APP_CONFIG?.app?.nombre || 'app';

      // 1. Recolectar archivos primero (si existe _files)
      if (db._files) {
        files = await db._files.toArray();
        // 2. En perfil Lite, incluir blobs
        if (db._file_blobs && APP_CONFIG.perfil === 'lite') {
          blobs = await db._file_blobs.toArray();
        }
      }

      // 3. Recolectar datos de tablas de negocio (excepto excluidas)
      for (const table of db.tables) {
        if (this._excludeTables.includes(table.name)) continue;
        if (table.name === '_files' || table.name === '_file_blobs') continue;
        const records = await table.toArray();
        if (records.length) tables[table.name] = records;
      }

      if (!Object.keys(tables).length && !files?.length) {
        UI.toast('No hay datos para exportar', 'warning');
        return;
      }

      // 4. Armar payload completo
      const payload = JSON.stringify({
        version: 2,
        app: appName,
        exportedAt: new Date().toISOString(),
        tables,
        files,      // metadatos de _files
        blobs       // blobs Lite (solo si perfil=lite)
      });

      // Comprimir con pako
      const compressed = pako.deflate(payload, { level: 9 });
      let blob;

      if (pwd) {
        const encrypted = CryptoJS.AES.encrypt(
          CryptoJS.lib.WordArray.create(compressed),
          pwd
        ).toString();
        blob = new Blob([encrypted], { type: 'application/octet-stream' });
      } else {
        blob = new Blob([compressed], { type: 'application/octet-stream' });
      }

      // Descargar archivo
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appName}-${new Date().toISOString().slice(0, 10)}.ateje-backup`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const fileInfo = files?.length ? ` + ${files.length} archivos` : '';
      UI.toast(`Respaldo exportado (${(blob.size / 1024).toFixed(1)} KB${fileInfo})`, 'success');
    } catch (err) {
      UI.toast('Error al exportar: ' + err.message, 'error');
    }
  },

  async importar(file, password) {
    const pwd = password || this._password;
    try {
      UI.toast('Leyendo respaldo...', 'info');

      let data;
      if (file instanceof File) {
        data = await file.arrayBuffer();
      } else {
        data = file;
      }

      let decompressed;

      if (pwd) {
        const encrypted = new TextDecoder().decode(data);
        const decrypted = CryptoJS.AES.decrypt(encrypted, pwd);
        const words = decrypted;
        const bytes = new Uint8Array(words.sigBytes);
        for (let i = 0; i < words.sigBytes; i++) {
          bytes[i] = (words.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        }
        decompressed = pako.inflate(bytes, { to: 'string' });
      } else {
        decompressed = pako.inflate(data, { to: 'string' });
      }

      const backup = JSON.parse(decompressed);

      if (!backup.version || !backup.tables) {
        UI.toast('Archivo de respaldo inválido', 'error');
        return;
      }

      const tableCount = Object.keys(backup.tables).length;
      const recordCount = Object.values(backup.tables).reduce((a, t) => a + t.length, 0);
      const fileCount = backup.files?.length || 0;
      const msg = `Importar ${recordCount} registros en ${tableCount} tablas` +
        (fileCount ? ` + ${fileCount} archivos` : '') + '?';
      const ok = await UI.confirm(msg);
      if (!ok) return;

      // 1. Restaurar archivos primero (necesarios para referencias)
      if (backup.files?.length && db._files) {
        for (const f of backup.files) {
          const existing = await db._files.get(f.path);
          if (!existing || new Date(f.updatedAt) > new Date(existing.updatedAt)) {
            await db._files.put(f);
          }
        }
        // Restaurar blobs (perfil Lite)
        if (backup.blobs?.length && db._file_blobs) {
          for (const b of backup.blobs) {
            await db._file_blobs.put(b);
          }
        }
        UI.toast(`${backup.files.length} archivos restaurados`, 'info');
      }

      // 2. Merge datos de negocio por UUID + updatedAt
      let insertados = 0, actualizados = 0, saltados = 0;
      for (const [name, records] of Object.entries(backup.tables)) {
        if (!db[name]) continue;
        for (const record of records) {
          const existing = await db[name].get(record.id);
          if (!existing) {
            await db[name].put(record);
            insertados++;
          } else if (new Date(record.updatedAt) > new Date(existing.updatedAt)) {
            record.createdAt = existing.createdAt;
            await db[name].put(record);
            actualizados++;
          } else {
            saltados++;
          }
        }
      }

      const fileMsg = fileCount ? `, ${fileCount} archivos` : '';
      UI.toast(`Importación: ${insertados} nuevos, ${actualizados} actualizados, ${saltados} saltados${fileMsg}`, 'success');
    } catch (err) {
      UI.toast('Error al importar: ' + err.message, 'error');
    }
  }
};
```

**Uso en módulo de configuración:**
```html
<div x-data="{ password: '' }" class="space-y-4">
  <h3 class="text-lg font-semibold flex items-center gap-2">
    <i class="bi bi-cloud-arrow-down"></i> Respaldo de datos
  </h3>
  <p class="text-sm text-base-content/60">
    Exporta toda la información a un archivo .ateje-backup para usarla en otro dispositivo.
  </p>
  <div class="flex flex-wrap gap-2">
    <button class="btn btn-primary" @click="SyncEngine.exportar(password)">
      <i class="bi bi-download"></i> Exportar respaldo
    </button>
    <button class="btn btn-outline" @click="$refs.fileInput.click()">
      <i class="bi bi-upload"></i> Importar respaldo
    </button>
    <input type="file" accept=".ateje-backup" x-ref="fileInput"
           class="hidden" @change="SyncEngine.importar($event.target.files[0], password)">
  </div>
  <label class="form-control w-full max-w-xs">
    <span class="label-text">Contraseña opcional</span>
    <input type="password" x-model="password" class="input input-bordered input-sm"
           placeholder="Proteger con contraseña">
  </label>
</div>
```

**Reglas:**
- El archivo `.ateje-backup` se puede transferir por cualquier medio (USB, Drive, WhatsApp, Near Share, etc.)
- Si se usa contraseña, debe ser la misma al exportar e importar
- La importación **fusiona** datos por UUID + `updatedAt` (nunca borra datos locales)
- Registros nuevos (UUID no existente) se insertan. Existentes se actualizan solo si el backup es más reciente
- Compatible entre perfiles: Lite, Full y Mobile usan el mismo `core/sync.js`
- Sin contraseña = solo compresión (más rápido), con contraseña = cifrado AES
- Todos los registros incluyen `createdBy`, `createdAt` y `updatedAt` para trazabilidad multi-dispositivo
- Tablas excluidas del backup: `modelos_cache` (son pesos ONNX ~230MB, se redescargan solos)

### Error Handling Patterns (De error-handling-patterns)
```javascript
// Patrón Result Type para operaciones offline
const Result = {
  ok(value) { return { success: true, value }; },
  fail(error) { return { success: false, error }; }
};

// Uso en operaciones Dexie + Crypto
async function guardarRegistro(tabla, datos, camposSensibles = []) {
  try {
    const registro = { ...datos, updatedAt: new Date() };
    for (const campo of camposSensibles) {
      if (registro[campo]) {
        registro[campo] = cryptoHelpers.encrypt(registro[campo]);
      }
    }
    await db[tabla].put(registro);
    UI.toast('Guardado correctamente', 'success');
    return Result.ok(registro);
  } catch (err) {
    UI.toast('Error al guardar: ' + err.message, 'error');
    return Result.fail(err.message);
  }
}

// Graceful degradation offline
async function cargarODefecto(tabla, id, defecto = {}) {
  try {
    const datos = await db[tabla].get(id);
    return datos || defecto;
  } catch (err) {
    console.warn(`Offline: usando defecto para ${tabla}/${id}`, err.message);
    return defecto;
  }
}
```

### UI Patterns para Estados Offline (cards, forms, empty states)
```html
<!-- Empty state con CTA -->
<div class="text-center py-12 animate__animated animate__fadeIn">
  <i class="bi bi-inbox text-6xl text-base-300"></i>
  <h3 class="text-lg font-medium mt-4">Sin registros</h3>
  <p class="text-sm text-base-content/60 mt-1">Agrega tu primer elemento para empezar</p>
  <button class="btn btn-primary mt-4" @click="abrirFormulario()">
    <i class="bi bi-plus-lg"></i> Agregar
  </button>
</div>

<!-- Loading state con skeleton -->
<div class="space-y-4 animate-pulse">
  <div class="flex items-center gap-4">
    <div class="w-12 h-12 bg-base-300 rounded-full"></div>
    <div class="flex-1 space-y-2">
      <div class="h-4 bg-base-300 rounded w-3/4"></div>
      <div class="h-3 bg-base-300 rounded w-1/2"></div>
    </div>
  </div>
</div>

<!-- Error state con retry -->
<div class="alert alert-error shadow-lg">
  <i class="bi bi-exclamation-triangle"></i>
  <span>No se pudieron cargar los datos</span>
  <button class="btn btn-sm btn-ghost" @click="cargar()">
    <i class="bi bi-arrow-clockwise"></i> Reintentar
  </button>
</div>

<!-- Offline banner (se muestra cuando navigator.onLine=false) -->
<div x-show="!$store.network?.online"
     class="fixed top-0 inset-x-0 bg-warning text-warning-content text-center text-sm py-1 z-50
            animate__animated animate__slideInDown">
  <i class="bi bi-wifi-off"></i> Sin conexión — los datos se guardan localmente
</div>
```

### Motion Templates (De taste-skill)

Aplicar spring physics CSS en lugar de easing lineal en todos los interactivos:

```html
<!-- Botón con spring physics en hover/active -->
<button class="btn btn-primary transition-[transform,opacity] duration-400
               ease-[cubic-bezier(0.34,1.56,0.64,1)]
               hover:scale-[1.02] active:scale-[0.98]">
  <i class="bi bi-plus-lg group-hover:translate-x-0.5 transition-transform"></i> Acción
</button>

<!-- Stagger reveal en listas con Alpine -->
<template x-for="(item, i) in items" :key="item.id">
  <div x-transition:enter.duration.300ms
       :style="`animation-delay: ${i * 80}ms; transition-delay: ${i * 80}ms`"
       class="opacity-0 animate__animated animate__fadeInUp"
       :class="`animate__delay-${(i % 5) * 100}ms`">
  </div>
</template>

<!-- Skeleton shimmer en carga (GPU-safe) -->
<div class="skeleton h-4 w-3/4 animate-shimmer bg-gradient-to-r from-base-200 via-base-100 to-base-200 bg-[length:200%_100%]"></div>
```

**Regla**: No animar `top`, `left`, `width`, `height`. Solo `transform` + `opacity`. Usar `min-h-[100dvh]` no `h-screen`.

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

| SKILL | Rol en este flujo |
|-------|------------------|
| `spec-creator` | Provee `specs/[app].md` con estructura, campos sensibles, reglas UI y `libreriasAdicionales` |
| `setup-init` | Instala librerías (Lite: curl a assets/ / Full: bun add npm) |
| `ia-jutia` | Si se incluye, genera módulo IA + core/ia.js según perfil Lite/Full |
| `stack-compliance-guard` | Se ejecuta automáticamente tras generar cada bloque |
| `design-ux-intelligence` | Aplica tono visual, contrastes, espaciado y animaciones según spec |
| `alpine-ui-patterns` | Catálogo de ~100 patrones Pines/Penguin/Pinemix con fallback chain. Se consulta cuando `component_library` ≠ daisyui o cuando DaisyUI no tiene el componente |
| `validation-offline` | Ejecuta `validar app` tras completar FASE 4 |
| `deployment-jigue` | Empaqueta (Lite: ZIP / Full: .exe) y despliega a Pages |

---

## 🧩 SELECCIÓN DE LIBRERÍA UI (por preferencia)

En FASE 3, para cada módulo, determinar la librería de componentes según `component_library`:

1. **Leer preferencia**: `APP_CONFIG.componentLibrary` en `project.config.js` o `.omd/preferences.md`
2. **Resolver fallback**: Usar `alpine-ui-patterns/SKILL.md` para consultar disponibilidad del componente en cada librería
3. **Generar con la librería ganadora**: El módulo HTML debe ser coherente — no mezclar 2 implementaciones del mismo componente en una pantalla

**Mapeo de componentes por librería** (resumen de `alpine-ui-patterns`):

| Componente | DaisyUI | Pines | Penguin | Pinemix |
|-----------|---------|-------|---------|---------|
| btn/button | `btn btn-primary` | Clases Tailwind | Clases Tailwind | — |
| card | `card bg-base-100 shadow-xl` | Tailwind border | Tailwind border | — |
| modal | `dialog` + `modal-box` | `x-show` + teleport | `x-show` básico | `x-show` + backdrop blur |
| dropdown | `dropdown` + `dropdown-content` | `x-data` + `@click.outside` | `x-data` básico | `x-data` + `@keydown.esc` |
| tabs | `tabs` + `tab` | `x-data` nav | `x-data` básico | `x-data` + `@keydown` + ARIA |
| accordion | `collapse` | `<details>` | `<details>` | `<details>` + animación |
| toast | — | `x-data` stack | alert | `x-data` stackable |
| tooltip | `tooltip` | `x-data` hover | Clases CSS | `x-data` + `@mouseenter` |
| skeleton | `skeleton` | `animate-pulse` | Clases | `animate-pulse` |
| progress | `progress` | `div` width-based | `div` width-based | `div` width-based |
| badge | `badge` | Tailwind pill | Tailwind pill | — |
| table | `table` | `table` + sort | `table` Tailwind | `table` + sort |
| alert | `alert` | Variantes color | Variantes color | — |
| pagination | `join` + `btn` | Page numbers | Page numbers | — |
| switch/toggle | `toggle` | `x-data` checkbox | `x-data` checkbox | — |
| select | `select` | Custom dropdown | `select` Tailwind | `select-menu` custom |
| breadcrumb | `breadcrumbs` | Tailwind flex | Tailwind flex | Array-driven |
| range slider | `range` | `input[type=range]` | `input[type=range]` | `input[type=range]` |
| rating | `rating` | Star buttons | Star buttons | Star buttons |
| navbar | `navbar` | — | Flexbox | — |
| sidebar | `drawer` | — | Flexbox | — |
| command palette | — | `Cmd+K` + `x-teleport` | — | `Cmd+K` + `x-data` |
| date picker | — | Custom calendar | — | — |
| image gallery | — | Grid + lightbox | — | Grid + lightbox |
| marquee | — | `animate-scroll` | — | CSS animation |
| skeleton loader | `skeleton` | Shimmer | CSS | Shimmer |
| color picker | — | — | — | Palette grid |
| tag input | — | — | — | Keyboard enter + remove |
| tree view | — | — | — | Expandable hierarchy |
| steps | `steps` | — | Progress steps | — |
| carousel | `carousel` | — | Image slider | Image slider |
| chat bubble | — | — | Flexbox Bubble | — |
| file input | `file-input` | — | Custom input | — |
| spinner/loading | `loading` | — | SVG spinner | — |
| offcanvas | `drawer` | `slide-over` | — | `slide-over` |
| two factor | — | — | — | 6-digit input |
| countdown | — | — | — | Timer component |

**Regla de coherencia**: Si el módulo usa DaisyUI para botones (btn), también debe usar DaisyUI para cards, tabs y inputs. No mezclar en la misma vista.

## 🧩 PLANTILLAS DE COMPONENTES PINES

Cuando la spec requiera UX avanzada o `component_library=pines`, inyectar estos patrones de Pines (en `components/pines/`). Tailwind nativo, no DaisyUI.

### Command Palette (Cmd+K)
```html
<!-- Copiar de components/pines/command.html -->
<div x-data="{
    cmdOpen: false,
    cmdQuery: '',
    cmdItems: [
        { title: 'Ir a Dashboard', value: 'dashboard', icon: 'bi-speedometer2' },
        { title: 'Nuevo registro', value: 'nuevo', icon: 'bi-plus-circle' },
        { title: 'Buscar', value: 'buscar', icon: 'bi-search' }
    ],
    get cmdFiltered() {
        if (!this.cmdQuery) return this.cmdItems.slice(0, 5);
        return this.cmdItems.filter(i => i.title.toLowerCase().includes(this.cmdQuery.toLowerCase()));
    }
}"
@keydown.window.cmd.k.prevent="cmdOpen = true"
@keydown.escape="cmdOpen = false">
    <template x-teleport="body">
        <div x-show="cmdOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
             @click.away="cmdOpen = false">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border overflow-hidden">
                <div class="flex items-center px-4 border-b">
                    <i class="bi bi-search text-gray-400"></i>
                    <input x-model="cmdQuery" type="text" class="w-full px-3 py-3 text-sm bg-transparent border-0 outline-none"
                           placeholder="Buscar...">
                </div>
                <div class="max-h-64 overflow-y-auto p-2">
                    <template x-for="item in cmdFiltered" :key="item.value">
                        <div @click="cmdOpen = false"
                             class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100">
                            <i :class="'bi ' + item.icon" class="text-gray-400"></i>
                            <span x-text="item.title"></span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </template>
</div>
```

### Slide-over Panel
```html
<!-- Copiar de components/pines/slide-over.html -->
<div x-data="{ panelOpen: false }">
    <button @click="panelOpen = true" class="btn btn-ghost btn-sm">
        <i class="bi bi-layout-sidebar"></i> Abrir panel
    </button>
    <template x-teleport="body">
        <div x-show="panelOpen" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black/20" @click="panelOpen = false"></div>
            <div class="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl"
                 x-show="panelOpen"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="translate-x-full"
                 x-transition:enter-end="translate-x-0"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="translate-x-0"
                 x-transition:leave-end="translate-x-full">
                <div class="flex items-center justify-between p-4 border-b">
                    <h2 class="text-lg font-semibold">Panel</h2>
                    <button @click="panelOpen = false" class="btn btn-ghost btn-sm btn-square">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="p-4 overflow-y-auto h-full pb-20">
                    <!-- Contenido del panel -->
                </div>
            </div>
        </div>
    </template>
</div>
```

### Date Picker
```html
<!-- Copiar de components/pines/date-picker.html -->
<div x-data="{
    selectedDate: '',
    showPicker: false,
    pickerMonth: new Date().getMonth(),
    pickerYear: new Date().getFullYear(),
    get daysInMonth() {
        return new Date(this.pickerYear, this.pickerMonth + 1, 0).getDate();
    },
    get firstDayOfMonth() {
        return new Date(this.pickerYear, this.pickerMonth, 1).getDay();
    },
    selectDate(day) {
        this.selectedDate = `${this.pickerYear}-${String(this.pickerMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        this.showPicker = false;
    },
    prevMonth() {
        if (this.pickerMonth === 0) { this.pickerMonth = 11; this.pickerYear--; }
        else { this.pickerMonth--; }
    },
    nextMonth() {
        if (this.pickerMonth === 11) { this.pickerMonth = 0; this.pickerYear++; }
        else { this.pickerMonth++; }
    }
}" class="relative w-64">
    <input type="text" x-model="selectedDate" @focus="showPicker = true" readonly
           class="w-full px-3 py-2 text-sm border rounded-lg cursor-pointer bg-white"
           placeholder="Seleccionar fecha...">
    <div x-show="showPicker" @click.away="showPicker = false"
         class="absolute top-full mt-1 w-64 bg-white border rounded-lg shadow-lg p-3 z-10">
        <div class="flex items-center justify-between mb-2">
            <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">&lt;</button>
            <span class="text-sm font-medium" x-text="new Date(pickerYear, pickerMonth).toLocaleDateString('es', { month: 'long', year: 'numeric' })"></span>
            <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">&gt;</button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs">
            <template x-for="d in ['Do','Lu','Ma','Mi','Ju','Vi','Sa']" :key="d">
                <span class="text-gray-500 font-medium py-1" x-text="d"></span>
            </template>
            <template x-for="i in firstDayOfMonth" :key="'e'+i">
                <div></div>
            </template>
            <template x-for="day in daysInMonth" :key="day">
                <button @click="selectDate(day)"
                        :class="selectedDate.endsWith(String(day).padStart(2,'0')) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'"
                        class="py-1 rounded text-sm" x-text="day"></button>
            </template>
        </div>
    </div>
</div>
```

---

## 📝 NOTAS PARA LA IA
- **NUNCA generes todo de una vez**. Respeta las pausas entre fases. OpenCode pierde contexto >15k tokens.
- **Usa rutas relativas estrictas**. Ej: `assets/js/libs/alpine.js`, NUNCA `https://...` o `../core/...` fuera de `index.html`.
- **Comentarios en español**. Explica lógica compleja con `// 💡 ...`.
- **Si la spec es ambigua**, pregunta: `❓ La spec no define [campo/regla]. ¿Uso default del stack o prefieres especificar?`
- **Librerías adicionales**: Si la spec tiene `libreriasAdicionales`, inyéctalas en `index.html` entre las libs base y los core files. El orden importa: CSS base → CSS adicional → JS libs base → JS libs adicionales → Core → Main.
- **No asumas que la librería adicional existe**. Siempre carga desde `assets/js/libs/[nombre]`, nunca desde CDN.
- **Idioma**: Todo el output, nombres de variables y comentarios en español.
- **Componentes Pines en `components/pines/`**: Command Palette, Slide-over, Date Picker, Context Menu, Toast, Modal, Tabs, Accordion, etc. Tailwind nativo. Ver `design-ux-intelligence` Paso 5.
- **Componentes alpine-ui-patterns**: ~100 patrones de Pines/Penguin/Pinemix en `alpine-ui-patterns/SKILL.md`. Consultar por categoría A (mejor)/B (alternativa)/C (exclusivo). Si `component_library=auto`, usar DaisyUI y solo recurrir a alpine-ui-patterns para componentes que DaisyUI no tiene (toast, command palette, date picker, text animation, etc.)

✨ **SKILL ready. Trigger: `generar codigo` para iniciar.**
```

---

