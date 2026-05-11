---
name: code-generator
description: Genera código estructurado y funcional siguiendo estrictamente specs/[app].md y @AGENTS.md. Flujo por fases, validación automática de compliance, y output listo para file:// sin imports ES6. Soporta librerías adicionales desde la spec.
license: MIT
compatibility: Requiere @AGENTS.md, specs/[app].md, project.config.js presentes. Funciona offline-first, sin builds, sin CDNs, sin imports. Lee libreriasAdicionales de la spec.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.1"
  generatedBy: "code-generator skill"
  triggers: ["generar codigo", "crear módulos", "implementar spec", "build app", "escribir código", "code-generator"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
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

### 🟢 FASE 1: Carga de Spec y Plan de Ejecución
1. Lee `specs/[app].md` y extrae:
   - Módulos requeridos (`modulosActivos`)
   - Campos sensibles a cifrar
   - Reglas de UI/UX y animaciones
   - Configuración de `project.config.js`
   - **Librerías adicionales** (sección `## 📚 Librerías Adicionales` o bloque `libreriasAdicionales`)
2. Si detecta librerías adicionales, las incluye en el plan:
   ```
   📋 PLAN DE GENERACIÓN
   • Core: app.js, db.js, crypto.js, ui.js, theme.js, main.js, index.html
   • Módulos: [lista de módulos desde spec]
   • Librerías adicionales: [qrcode.min.js, dayjs.min.js, ...] (desde spec)
   • Validación: stack-compliance-guard auto-aplicado
   • Entregable: Código por bloques con ruta exacta
   ✅ ¿Procedo con FASE 2: Core y Shell? (Responde: SÍ)
   ```
3. **ESPERA confirmación** antes de continuar.

### 🟡 FASE 2: Core, Shell y Configuración
Genera los archivos base **en un solo bloque bien estructurado** con rutas exactas:

**Index.html con librerías dinámicas:**
El orden de carga debe ser: CSS base → CSS adicional (si hay) → Libs base → **Libs adicionales (desde spec)** → Core → Main

```markdown
📁 CORE / INDEX
### `index.html`
[Contenido completo con orden: CSS → Libs base → Libs adicionales → Core → Main, x-cloak, sin type="module"]

### `core/db.js`
[Iniciación Dexie según spec. Variables globales. window.db expuesto]

### `core/crypto.js`
[encrypt/decrypt + gestión de clave localStorage. window.cryptoHelpers expuesto]

### `core/ui.js`
[toast, confirm, loading, format.currency/date. window.UI expuesto]

### `core/theme.js`
[Inyección de CSS variables desde APP_CONFIG.tema.colores. window.themeStore]

### `core/app.js`
[Router hash-based, carga de módulos, init global. window.appRouter]

### `main.js`
[Punto de entrada. Expone globals, llama a init(), maneja errores]

### `core/network.js` (si la app requiere monitoreo de conexión)
[Monitoreo navigator.onLine, eventos online/offline, Alpine store]

### `sw.js` (si la app requiere PWA/instalabilidad)
[Service Worker con cache-first, skipWaiting, clientsClaim]

### `manifest.json` (si la app requiere PWA/instalabilidad)
[Manifest con name, icons, display standalone, theme_color]

### `project.config.js`
[Config white-label completa según spec]

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
<script src="assets/js/libs/apexcharts.js"></script>
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
   [HTML puro + Alpine x-data/x-init, DaisyUI componentes, Bootstrap Icons en botones, Animate.css en entradas, responsive mobile-first]

   🛡️ Stack Compliance: ✅ Validado automáticamente (sin imports, rutas relativas, cifrado aplicado, UI consistente)
   ⏸️ PAUSA. Responde "✅ [nombre-id] OK" para el siguiente módulo.
   ```
3. Repite hasta completar todos los módulos de la spec.

### 🟣 FASE 4: Ensamblaje Final y Handoff
1. Confirma que todos los módulos están generados.
2. Entrega snippet final de `project.config.js` con `modulosActivos` actualizado.
3. Mensaje de cierre:
   ```
   ✅ GENERACIÓN COMPLETADA
   📂 Estructura: lista
   🛡️ Compliance: 100% validado
   📄 Especificación: specs/[app].md
   🚀 Siguiente paso: validar app (ejecuta: validar app)
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
- [ ] ¿Operaciones Dexie sin try/catch ni Result Type? → AGREGAR manejo de errores
- [ ] ¿Botón sin loading state en operaciones async? → AÑADIR `loading-spinner` de DaisyUI
- [ ] ¿Sin offline banner en apps PWA? → SUGERIR indicador de conexión
Si falla: corrige silenciosamente y añade `🛡️ Ajustado a reglas offline-first.` al output.

---

## 📐 PATRONES DE CÓDIGO OBLIGATORIOS

### `module.js` (Estructura Base)
```javascript
const [NombreModulo] = {
  id: '[id-lowercase]',
  titulo: '[Título Visible]',
  icono: 'bi bi-[icon-name]',

  async init() {
    console.log(`💡 [${this.id}] Inicializado`);
    // Carga única de datos o listeners
  },

  async render(params = {}) {
    // Retorna HTML o manipula #app-content
    // Usa Alpine x-data, DaisyUI, Icons, Animate.css
    return `...`;
  },

  destroy() {
    // Limpieza de intervals/listeners
  },

  // Métodos privados
  async guardar(datos) {
    const registro = {
      // Campos sensibles → cifrar
      nombre: cryptoHelpers.encrypt(datos.nombre),
      email: cryptoHelpers.encrypt(datos.email),
      // No sensibles → directos
      telefono: datos.telefono,
      createdAt: new Date()
    };
    await db.[tabla].put(registro);
    UI.toast('Guardado correctamente', 'success');
  }
};

window.MODULES = window.MODULES || {};
window.MODULES[[NombreModulo].id] = [NombreModulo];
```

### `module.html` (Reglas UI)
```html
<div x-data="[id]Data()" x-init="init()" class="animate__animated animate__fadeInUp">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <i class="bi bi-[icon-name]"></i> [Título]
  </h2>
  
  <!-- Formulario/Tabla con DaisyUI -->
  <div class="card bg-base-100 shadow-xl p-4">
    <label class="form-control w-full">
      <span class="label-text">Nombre</span>
      <input type="text" x-model="form.nombre" class="input input-bordered focus:ring-2 focus:ring-primary" />
    </label>
    <button class="btn btn-primary mt-4" @click="guardar()">
      <i class="bi bi-check-lg"></i> Guardar
    </button>
  </div>
</div>
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
  'core/app.js', 'main.js'
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

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

| SKILL | Rol en este flujo |
|-------|------------------|
| `spec-creator` | Provee `specs/[app].md` con estructura, campos sensibles, reglas UI y `libreriasAdicionales` |
| `setup-init` | Descarga las librerías adicionales a `assets/js/libs/` |
| `stack-compliance-guard` | Se ejecuta automáticamente tras generar cada bloque. Corrige o rechaza si viola reglas |
| `design-ux-intelligence` | Aplica tono visual, contrastes, espaciado y animaciones según spec |
| `validation-offline` | Consume el output de esta SKILL. Ejecuta `validar app` tras completar FASE 4 |

---

## 📝 NOTAS PARA LA IA
- **NUNCA generes todo de una vez**. Respeta las pausas entre fases. OpenCode pierde contexto >15k tokens.
- **Usa rutas relativas estrictas**. Ej: `assets/js/libs/alpine.js`, NUNCA `https://...` o `../core/...` fuera de `index.html`.
- **Comentarios en español**. Explica lógica compleja con `// 💡 ...`.
- **Si la spec es ambigua**, pregunta: `❓ La spec no define [campo/regla]. ¿Uso default del stack o prefieres especificar?`
- **Librerías adicionales**: Si la spec tiene `libreriasAdicionales`, inyéctalas en `index.html` entre las libs base y los core files. El orden importa: CSS base → CSS adicional → JS libs base → JS libs adicionales → Core → Main.
- **No asumas que la librería adicional existe**. Siempre carga desde `assets/js/libs/[nombre]`, nunca desde CDN.
- **Idioma**: Todo el output, nombres de variables y comentarios en español.

✨ **SKILL ready. Trigger: `generar codigo` para iniciar.**
```

---

