# 📱 AHApp — Ateje Hybrid App (Que es y como se estructura)

> **Actualizado:** 2026-08-05
> **Definicion:** Una AHApp es una aplicacion web moderna **offline-first** generada por el Stack Ateje. Se abre con doble clic en `index.html` y funciona 100% sin internet.

---

## 1. Que es una AHApp

| Caracteristica | Detalle |
|----------------|---------|
| **Offline-first** | Funciona sin internet; la sincronizacion es un anadido, no un requisito |
| **Apertura** | Doble clic en `index.html` (file://, sin servidor) |
| **Frontend** | Alpine.js (reactividad) + DaisyUI (UI) + Bootstrap Icons |
| **Datos** | Dexie.js sobre IndexedDB (CRUD offline, indices, queries) |
| **Cifrado** | CryptoJS AES en campos sensibles |
| **Extras** | Chart.js (graficos), FlexSearch (busqueda), jsPDF/SheetJS (PDF/Excel) |
| **Empaquetado** | ZIP + Pages (Lite), .exe + .apk (Profesional/Business) |

---

## 2. Estructura de una App Generada

```
[app]/
├── index.html                # Punto de entrada (doble clic)
├── project.config.js         # APP_CONFIG: perfil, modulos, tema, cifrado, sync
├── core/                     # Núcleo (generado por code-generator)
│   ├── db.js                 # Dexie init + tablas de sistema + tablas de negocio
│   ├── crypto.js             # window.cryptoHelpers (encrypt/decrypt/uuid)
│   ├── ui.js                 # window.UI (toast, confirm, modalForm, loading, formatos)
│   ├── theme.js              # CSS variables desde APP_CONFIG.tema
│   ├── app.js                # Router hash-based (window.appRouter)
│   ├── search-palette.js     # Command Palette (Ctrl+K)
│   ├── file-store.js         # Gestion de archivos (window.FileStore)
│   ├── sync.js               # Backup .ateje-backup cifrado y comprimido
│   ├── network.js            # Monitoreo de conectividad
│   ├── main.js               # Bootstrap: sesion, carga de modulos
│   ├── sw.js                 # Service Worker (offline cache)
│   ├── manifest.json         # PWA manifest
│   └── a11y.js, responsive.js, bottom-nav.js, push-manager.js, export.js,
│       license.js, env.js, analytics.js, feature-flags.js, brand-loader.js
├── modules/                  # Modulos de negocio
│   └── [modulo]/
│       ├── module.js         # Logica CRUD (IIFE, ES5, sin imports)
│       └── module.html       # UI Alpine + DaisyUI
├── assets/
│   ├── css/                  # tailwind, daisyui, bootstrap-icons, animate
│   ├── js/libs/              # alpine, dexie, crypto-js, chart, jspdf, xlsx, pako
│   ├── wasm/                 # sql-wasm (Full)
│   ├── models/               # Modelos Transformers (Full IA)
│   └── fonts/
├── data/                     # avatars, placeholder, archivos de usuario
└── configuracion/            # (segun perfil)
```

---

## 3. Core — API Fundamental

### `window.db` (core/db.js)

```javascript
const db = new Dexie('AppDB');
// Tablas de sistema siempre incluidas:
db.version(1).stores({
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path'   // Solo Lite
});
// Tablas de negocio se anaden segun spec
```

### `window.cryptoHelpers` (core/crypto.js)

```javascript
cryptoHelpers.encrypt(texto) -> string base64 cifrado
cryptoHelpers.decrypt(cifrado) -> string
cryptoHelpers.generarClave() -> clave aleatoria 32 chars
window.uuid() -> UUID v4 compatible file://
```

> **Regla obligatoria:** todos los campos sensibles deben cifrarse con `cryptoHelpers.encrypt()`.

### `window.UI` (core/ui.js)

```javascript
UI.toast(msg, tipo='info', duracion=4000)   // success | error | warning | info
UI.confirm(msg, titulo='Confirmar')         // Promise<boolean>
UI.modalForm(titulo, html, onSave)          // Formulario en <dialog>
UI.loading(show=true)
UI.formatDate(date) / formatCurrency(n) / formatBytes(b) / formatRelative(date)
```

**Reglas UI obligatorias:**
- Feedback con `UI.toast()`, **NUNCA** `alert()` nativo
- Antes de `db.delete()`, **SIEMPRE** `UI.confirm()`
- Formularios crear/editar via `UI.modalForm()`
- Operaciones largas con `UI.loading(true/false)`

### `window.appRouter` (core/app.js)

```javascript
appRouter.load(moduloId)   // Navega por hash
appRouter.init()           // Escucha hashchange + carga modulo
window.MODULES = {}        // Registro de modulos cargados
```

### `window.FileStore` (core/file-store.js)

```javascript
FileStore.save(tipo, nombre, blob) -> { path, hash, url }
FileStore.getURL(path) -> URL para <img> o <a>
FileStore.read(path) / delete(path) / meta(path) / cleanOrphans()
```

Backend **Lite**: blobs en tabla `_file_blobs` (ObjectURL). Backend **Professional/Business**: disco en `APP_DATA_DIR`.

### `window.appSync` (core/sync.js)

Backup de todas las tablas a `.ateje-backup` **cifrado (AES) + comprimido (pako)**, restaurable en cualquier perfil.

---

## 4. Modulos de Negocio (patron)

Cada modulo sigue el patron `module.js` + `module.html`:

**module.js** (IIFE, ES5, sin imports):
```javascript
(function () {
  'use strict';
  var tabla = 'productos';

  window.MODULES.inventario = {
    async listar() { return await window.db[tabla].toArray(); },
    async guardar(registro) { /* validar + cifrar + put */ },
    async eliminar(id) { UI.confirm(...); await window.db[tabla].delete(id); }
  };

  // Integracion con appRouter
  window.MODULES.inventario.init = function () { /* carga UI, datos */ };
})();
```

**module.html** (Alpine + DaisyUI):
```html
<section x-data="moduleData()">
  <div class="card bg-base-100 shadow-xl">
    <h2 class="card-title">Productos</h2>
    <table class="table table-zebra">
      <tbody>
        <template x-for="item in items" :key="item.id">
          <tr>
            <td x-text="item.nombre"></td>
            <td x-text="item.precio"></td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</section>
```

---

## 5. Tablas de Sistema

| Tabla | Proposito |
|-------|-----------|
| `_files` | Metadatos de archivos (path, tipo, mime, size, hash, refCount) |
| `_file_blobs` | Blobs de archivos (Lite only) |
| `users` + `user_sessions` | Usuarios, roles, sesiones |
| `_sync_log` | Bitacora de sincronizacion |
| `_analytics` | Eventos de uso |
| `_ia_chats` + `_ia_messages` | Conversaciones de IA Jutia |

---

## 6. Perfiles de Empaquetado

| Perfil | HTML visible | DB | Empaquetado |
|--------|:------------:|----|-------------|
| **Lite** | Si | Dexie (IndexedDB) | ZIP + GitHub Pages |
| **Professional** | No | Dexie + SQLite FTS5 | .exe (Neutralino) + .apk (Capacitor) ~30MB |
| **Business** | No | Dexie + SQLite FTS5 | .exe + .apk + white-label + docs ~35MB |

---

## 7. Performance Offline-First (patrones actuales)

1. **`dbLocal` helper** — wrapper solo-lectura sobre Dexie (`db[table].toArray()`), usado en `render()` en vez de `dbOnline.getAll()` que hace HTTP
2. **Background sync** — bootstrap + `refreshCache()` en `Promise.all()` tras `appRouter.init()`, sin bloquear `DOMContentLoaded`
3. **`bulkAdd()`** en vez de `for await add()` en `refreshCache()`, `_onRealtimeChange()` y `_setCache()`
4. **Tablas en paralelo** — `refreshCache()` mapea las 8 tablas con `Promise.all(tables.map(...))`
5. **Squeletons** — clases `.sk-el/.sk-card/.sk-chart/.sk-row` (shimmer), nunca spinners genericos
6. **Session check local primero** — `checkSession()` lee IndexedDB antes de verificar Supabase en background
