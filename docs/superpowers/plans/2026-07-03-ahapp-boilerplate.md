# AHApp Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear `modules/_template/` (CRUD completo), fijar path de `file-store.js`, y crear `apps/AHA-Base/template.md`

**Architecture:** Tres artefactos independientes: plantilla de módulo Alpine.js con patrón canonico del code-generator, bugfix de path en app-shell.html, y spec de app base para pipeline.

**Tech Stack:** Alpine.js + Dexie.js + jsPDF + SheetJS. Patrones y estructura existentes en `code-generator/SKILL.md` (líneas 634-852).

---

### Task 1: `modules/_template/module.js`

**Files:**
- Create: `modules/_template/module.js`

- [ ] **Step 1: Write the module controller**

```javascript
const ModuloPlantilla = {
  id: '_template',
  titulo: 'Plantilla',
  icono: 'bi bi-box',

  // --- Estado ---
  items: [],
  item: null,
  formData: {},
  errors: {},
  searchQuery: '',
  loading: true,
  error: null,
  saving: false,
  page: 1,
  pageSize: 25,
  totalPages: 1,

  async init() {
    console.log(`💡 [${this.id}] Inicializado`);
    await this.cargarDatos();
  },

  async render(params = {}) {
    this.error = null;
    this.loading = true;
    await this.cargarDatos();
    return `
      <div x-data="plantillaData()" x-init="init()" class="animate__animated animate__fadeInUp">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <i class="bi bi-box"></i> Plantilla
        </h2>

        <div class="flex flex-wrap gap-2 mb-4">
          <button class="btn btn-primary" @click="abrirForm()">
            <i class="bi bi-plus-lg"></i> Agregar
          </button>
          <input type="search" x-model="searchQuery" @input.debounce="buscar" placeholder="Buscar..."
                 class="input input-bordered flex-1 min-w-[200px]" />
          <button class="btn btn-ghost" @click="exportarPDF()" x-show="items.length">
            <i class="bi bi-file-earmark-pdf"></i> PDF
          </button>
          <button class="btn btn-ghost" @click="exportarCSV()" x-show="items.length">
            <i class="bi bi-file-earmark-spreadsheet"></i> CSV
          </button>
        </div>

        <template x-if="error">
          <div class="alert alert-error mb-4">
            <i class="bi bi-exclamation-triangle"></i>
            <span x-text="error"></span>
          </div>
        </template>

        <template x-if="!loading && !error && items.length === 0">
          <div class="flex flex-col items-center justify-center py-16 text-base-content/50">
            <i class="bi bi-box text-6xl mb-4"></i>
            <p class="text-lg mb-4">No hay registros aún</p>
            <button class="btn btn-primary" @click="abrirForm()">
              <i class="bi bi-plus-lg"></i> Agregar primero
            </button>
          </div>
        </template>

        <template x-if="!loading && items.length > 0">
          <div>
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr x-for="item in paginated">
                    <td>
                      <span class="font-medium" x-text="item.nombre"></span>
                    </td>
                    <td>
                      <span class="badge" :class="item.estado === 'activo' ? 'badge-success' : 'badge-ghost'"
                            x-text="item.estado || 'inactivo'"></span>
                    </td>
                    <td class="text-sm text-base-content/60" x-text="formatearFecha(item.createdAt)"></td>
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
            <div class="flex justify-between items-center mt-4" x-show="totalPages > 1">
              <span class="text-sm text-base-content/60">
                Página <span x-text="page"></span> de <span x-text="totalPages"></span>
              </span>
              <div class="flex gap-2">
                <button class="btn btn-sm" :disabled="page === 1" @click="page--;">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button class="btn btn-sm" :disabled="page === totalPages" @click="page++;">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </template>

        <template x-if="loading">
          <div class="space-y-3">
            <div class="skeleton h-12 w-full"></div>
            <div class="skeleton h-12 w-full"></div>
            <div class="skeleton h-12 w-full"></div>
          </div>
        </template>
      </div>
    `;
  },

  destroy() {
    this.items = [];
    this.item = null;
    this.searchQuery = '';
    this.loading = true;
    this.error = null;
    this.page = 1;
  },

  formatearFecha(fecha) {
    if (!fecha) return '';
    try {
      return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch { return fecha; }
  },

  get paginated() {
    const start = (this.page - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  },

  // ─── CRUD ───

  async cargarDatos() {
    try {
      this.loading = true;
      this.error = null;
      const filtro = this.searchQuery.trim().toLowerCase();
      let datos = await db._template.orderBy('createdAt').reverse().toArray();
      if (filtro) {
        datos = datos.filter(i =>
          (i.nombre || '').toLowerCase().includes(filtro) ||
          (i.estado || '').toLowerCase().includes(filtro)
        );
      }
      this.items = datos;
      this.totalPages = Math.max(1, Math.ceil(this.items.length / this.pageSize));
      if (this.page > this.totalPages) this.page = this.totalPages;
    } catch (e) {
      console.error('Error cargando datos:', e);
      this.error = 'Error al cargar datos';
      UI.toast('Error al cargar datos', 'error');
    } finally {
      this.loading = false;
    }
  },

  async abrirForm(item = null) {
    const editando = !!item;
    const descifrado = item ? { ...item } : {};
    if (editando && APP_CONFIG.cifrado.camposSensibles) {
      for (const campo of APP_CONFIG.cifrado.camposSensibles) {
        if (descifrado[campo]) descifrado[campo] = cryptoHelpers.decrypt(descifrado[campo]);
      }
    }
    const html = `
      <div class="space-y-4">
        <label class="form-control w-full">
          <span class="label-text">Nombre <span class="text-error">*</span></span>
          <input type="text" x-model="form.nombre" class="input input-bordered"
                 :class="errors.nombre ? 'input-error' : ''" />
          <template x-if="errors.nombre">
            <span class="text-error text-sm mt-1" x-text="errors.nombre"></span>
          </template>
        </label>
        <label class="form-control w-full">
          <span class="label-text">Descripción</span>
          <textarea x-model="form.descripcion" class="textarea textarea-bordered" rows="3"></textarea>
        </label>
        <label class="form-control w-full">
          <span class="label-text">Estado</span>
          <select x-model="form.estado" class="select select-bordered">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>
      </div>`;
    await UI.modalForm(
      editando ? 'Editar Plantilla' : 'Nueva Plantilla',
      html,
      async (data) => {
        if (editando) await this.actualizar(descifrado.id, data);
        else await this.guardar(data);
        await this.cargarDatos();
      },
      descifrado
    );
  },

  validarForm(datos) {
    this.errors = {};
    if (!datos.nombre || !datos.nombre.trim()) {
      this.errors.nombre = 'El nombre es obligatorio';
    }
    return Object.keys(this.errors).length === 0;
  },

  async guardar(datos) {
    if (!this.validarForm(datos)) return;
    this.saving = true;
    try {
      const registro = {
        id: uuid(),
        nombre: APP_CONFIG.cifrado.camposSensibles?.includes('nombre')
          ? cryptoHelpers.encrypt(datos.nombre) : datos.nombre.trim(),
        descripcion: datos.descripcion?.trim() || '',
        estado: datos.estado || 'activo',
        createdBy: APP_CONFIG?.usuarioActual || 'anon',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db._template.put(registro);
      UI.toast('Guardado correctamente', 'success');
    } catch (e) {
      console.error('Error al guardar:', e);
      UI.toast('Error al guardar: ' + e.message, 'error');
    } finally {
      this.saving = false;
    }
  },

  async actualizar(id, datos) {
    if (!this.validarForm(datos)) return;
    this.saving = true;
    try {
      const existente = await db._template.get(id);
      if (!existente) {
        UI.toast('Registro no encontrado', 'error');
        return;
      }
      const actualizado = {
        ...existente,
        nombre: APP_CONFIG.cifrado.camposSensibles?.includes('nombre')
          ? cryptoHelpers.encrypt(datos.nombre) : datos.nombre.trim(),
        descripcion: datos.descripcion?.trim() || '',
        estado: datos.estado || 'activo',
        updatedAt: new Date().toISOString()
      };
      for (const campo of (APP_CONFIG.cifrado.camposSensibles || [])) {
        if (actualizado[campo] && typeof actualizado[campo] === 'string' && !actualizado[campo].startsWith('U2FsdGVkX1')) {
          actualizado[campo] = cryptoHelpers.encrypt(actualizado[campo]);
        }
      }
      await db._template.put(actualizado);
      UI.toast('Actualizado correctamente', 'success');
    } catch (e) {
      console.error('Error al actualizar:', e);
      UI.toast('Error al actualizar: ' + e.message, 'error');
    } finally {
      this.saving = false;
    }
  },

  async eliminar(item) {
    const ok = await UI.confirm(`Eliminar ${item.nombre || 'este registro'}?`);
    if (!ok) return;
    try {
      await db._template.delete(item.id);
      UI.toast('Eliminado correctamente', 'success');
      await this.cargarDatos();
    } catch (e) {
      console.error('Error al eliminar:', e);
      UI.toast(e.message, 'error');
    }
  },

  // ─── Búsqueda ───

  async buscar() {
    this.page = 1;
    await this.cargarDatos();
  },

  limpiarBusqueda() {
    this.searchQuery = '';
    this.page = 1;
    this.cargarDatos();
  },

  // ─── Exportación ───

  async exportarPDF() {
    if (!this.items.length) {
      UI.toast('No hay datos para exportar', 'warning');
      return;
    }
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        UI.toast('jsPDF no disponible', 'error');
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Plantilla - Registros', 14, 20);
      doc.setFontSize(10);
      let y = 30;
      doc.text('Nombre', 14, y);
      doc.text('Estado', 80, y);
      doc.text('Creado', 130, y);
      y += 6;
      doc.setDrawColor(200);
      doc.line(14, y, 196, y);
      y += 4;
      for (const item of this.items) {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(item.nombre || '', 14, y);
        doc.text(item.estado || 'inactivo', 80, y);
        doc.text(this.formatearFecha(item.createdAt), 130, y);
        y += 6;
      }
      doc.save('plantilla-registros.pdf');
      UI.toast('PDF exportado', 'success');
    } catch (e) {
      console.error('Error exportando PDF:', e);
      UI.toast('Error al exportar PDF', 'error');
    }
  },

  async exportarCSV() {
    if (!this.items.length) {
      UI.toast('No hay datos para exportar', 'warning');
      return;
    }
    try {
      const cabeceras = ['Nombre', 'Estado', 'Creado'];
      const filas = this.items.map(i => [
        i.nombre || '',
        i.estado || 'inactivo',
        this.formatearFecha(i.createdAt)
      ]);
      let csv = cabeceras.join(',') + '\n';
      for (const fila of filas) {
        csv += fila.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';
      }
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla-registros.csv';
      a.click();
      URL.revokeObjectURL(url);
      UI.toast('CSV exportado', 'success');
    } catch (e) {
      console.error('Error exportando CSV:', e);
      UI.toast('Error al exportar CSV', 'error');
    }
  }
};

window.MODULES = window.MODULES || {};
window.MODULES['_template'] = ModuloPlantilla;

document.addEventListener('alpine:init', () => {
  Alpine.data('plantillaData', () => ModuloPlantilla);
});
```

- [ ] **Step 2: Create the file**

- [ ] **Step 3: Verify file created**

```bash
Test-Path -LiteralPath "modules/_template/module.js"
```

Expected: `True`

---

### Task 2: `modules/_template/module.html`

**Files:**
- Create: `modules/_template/module.html`

- [ ] **Step 1: Write the module HTML template**

```html
<div x-data="plantillaData()" x-init="init()" class="animate__animated animate__fadeInUp">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <i class="bi bi-box"></i> Plantilla
  </h2>
  <div class="flex flex-wrap gap-2 mb-4">
    <button class="btn btn-primary" @click="abrirForm()">
      <i class="bi bi-plus-lg"></i> Agregar
    </button>
    <input type="search" x-model="searchQuery" @input.debounce="buscar" placeholder="Buscar..."
           class="input input-bordered flex-1 min-w-[200px]" />
    <button class="btn btn-ghost" @click="exportarPDF()" x-show="items.length">
      <i class="bi bi-file-earmark-pdf"></i> PDF
    </button>
    <button class="btn btn-ghost" @click="exportarCSV()" x-show="items.length">
      <i class="bi bi-file-earmark-spreadsheet"></i> CSV
    </button>
  </div>
  <template x-if="error">
    <div class="alert alert-error mb-4">
      <i class="bi bi-exclamation-triangle"></i>
      <span x-text="error"></span>
    </div>
  </template>
  <template x-if="!loading && !error && items.length === 0">
    <div class="flex flex-col items-center justify-center py-16 text-base-content/50">
      <i class="bi bi-box text-6xl mb-4"></i>
      <p class="text-lg mb-4">No hay registros aún</p>
      <button class="btn btn-primary" @click="abrirForm()">
        <i class="bi bi-plus-lg"></i> Agregar primero
      </button>
    </div>
  </template>
  <template x-if="!loading && items.length > 0">
    <div>
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr x-for="item in paginated">
              <td>
                <span class="font-medium" x-text="item.nombre"></span>
              </td>
              <td>
                <span class="badge"
                      :class="item.estado === 'activo' ? 'badge-success' : 'badge-ghost'"
                      x-text="item.estado || 'inactivo'"></span>
              </td>
              <td class="text-sm text-base-content/60" x-text="formatearFecha(item.createdAt)"></td>
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
      <div class="flex justify-between items-center mt-4" x-show="totalPages > 1">
        <span class="text-sm text-base-content/60">
          Página <span x-text="page"></span> de <span x-text="totalPages"></span>
        </span>
        <div class="flex gap-2">
          <button class="btn btn-sm" :disabled="page === 1" @click="page--;">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="btn btn-sm" :disabled="page === totalPages" @click="page++;">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
  <template x-if="loading">
    <div class="space-y-3">
      <div class="skeleton h-12 w-full"></div>
      <div class="skeleton h-12 w-full"></div>
      <div class="skeleton h-12 w-full"></div>
    </div>
  </template>
</div>
```

- [ ] **Step 2: Create the file**

- [ ] **Step 3: Verify file created**

```bash
Test-Path -LiteralPath "modules/_template/module.html"
```

Expected: `True`

---

### Task 3: `modules/_template/SKILL.md`

**Files:**
- Create: `modules/_template/SKILL.md`

- [ ] **Step 1: Write the SKILL.md**

```markdown
# Módulo Plantilla — Guía de uso

Esta plantilla implementa un CRUD completo con los 12 patrones del stack AHA:

| # | Patrón | Implementación |
|---|--------|----------------|
| 1 | CRUD completo | `abrirForm()` → modal → `guardar()` (create/update) + `eliminar()` con confirm |
| 2 | Validación | `validarForm()` con `errors{}` reactivo y clase `input-error` |
| 3 | Estados visuales | Skeleton (carga) / Empty-state (sin datos) / Tabla (con datos) / Error (fallo) |
| 4 | Búsqueda | `buscar()` con filtro Dexie + `@input.debounce` |
| 5 | Paginación | `page`, `pageSize`, `totalPages` + navegación anterior/siguiente |
| 6 | Exportación | PDF (jsPDF) y CSV (Blob download) desde toolbar |
| 7 | Confirmaciones | `UI.confirm()` antes de eliminar |
| 8 | Manejo de errores | `try/catch` + `UI.toast()` en cada operación + estado `error` en UI |
| 9 | Timestamps | `createdAt`, `updatedAt` automáticos en create/update |
| 10 | Badges de estado | Clase dinámica `badge-success` / `badge-ghost` según `estado` |
| 11 | Atajo Cmd+K | `id: '_template'`, `titulo: 'Plantilla'` para search-palette |
| 12 | Ciclo de vida | `init()` → `render()` → `destroy()` con limpieza |

## Cómo usar

1. **Copiar** `modules/_template/` → `modules/mi-modulo/`
2. **Editar `module.js`:**
   - Cambiar `id`, `titulo`, `icono`
   - Cambiar nombre de tabla Dexie (reemplazar `_template` por `mi_tabla`)
   - Adaptar esquema de tabla y campos en `guardar()`/`actualizar()`
   - Ajustar columnas de tabla y formulario
3. **Editar `module.html`:**
   - Cambiar ícono y título
   - Adaptar encabezados de columna (`<th>`)
   - Ajustar celdas de datos (`<td>`)
4. **Registrar en `project.config.js`:**
   ```js
   modulosActivos: ['mi-modulo', ...],
   modulos: {
     'mi-modulo': { titulo: 'Mi Módulo', icono: 'bi bi-icon', activo: true }
   }
   ```
5. **Verificar** que `app.js` tenga el link del módulo en sidebar

## Notas

- Los campos sensibles se cifran automáticamente según `APP_CONFIG.cifrado.camposSensibles`
- La tabla Dexie se crea automáticamente al abrir la app (no requiere migración manual)
- Los skeletons usan clases DaisyUI `.skeleton` — no spinners
- No uses `alert()`, `confirm()`, `prompt()` — usa `UI.toast()`, `UI.confirm()`, `UI.modalForm()`
```

- [ ] **Step 2: Create the file**

- [ ] **Step 3: Verify file created**

```bash
Test-Path -LiteralPath "modules/_template/SKILL.md"
```

Expected: `True`

---

### Task 4: Fix `file-store.js` path in app-shell.html

**Files:**
- Modify: `code-generator/templates/components/layout/app-shell.html:98`

- [ ] **Step 1: Fix the file reference path**

The `app-shell.html` references `{file:code-generator/templates/core/file-store.js}` but the actual file is at `code-generator/templates/file-store.js` (not inside `core/`).

```diff
-  {file:code-generator/templates/core/file-store.js}
+  {file:code-generator/templates/file-store.js}
```

- [ ] **Step 2: Verify the fix**

```bash
Select-String -LiteralPath "code-generator/templates/components/layout/app-shell.html" -Pattern "file-store"
```

Expected output includes `templates/file-store.js` (not `templates/core/file-store.js`)

---

### Task 5: Create `apps/AHA-Base/template.md`

**Files:**
- Create: `apps/AHA-Base/template.md`

- [ ] **Step 1: Write the template.md**

```markdown
# AHA Base — Proyecto base para desarrollo de apps offline-first

## Descripción comercial

Punto de partida para construir cualquier app AHA. Incluye el shell completo (router, UI core, temas, licencias, sincronización) con un módulo demo de plantilla. Ideal para desarrolladores que quieren empezar rápido desde una base probada.

**Target:** Desarrolladores, integradores, agencias que construyen apps personalizadas sobre el stack AHA.

**Dolor que resuelve:** "Cada app nueva requiere configurar desde cero el shell, core y módulos base."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada + branding | FlexSearch + Transformers.js QA |

## Módulos

### 📦 Módulo Plantilla (demo)
- CRUD completo con validación, búsqueda, paginación
- Campos: nombre, descripción, estado (activo/inactivo)
- Exportación PDF y CSV
- Ejemplo de cifrado de campos sensibles
- Código documentado listo para copiar y adaptar

## Tablas Dexie

```javascript
db.version(1).stores({
  _template: 'id, nombre, estado, createdAt, updatedAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | Gratis |
| Standard | $49 |
| Custom | $149+ |

## WhatsApp para venta

```
Hola, quiero desarrollar una app offline personalizada
para mi negocio. ¿AHA Base plan Professional para empezar
desde cero con .exe?
```
```

- [ ] **Step 2: Create the file**

- [ ] **Step 3: Verify file created**

```bash
Test-Path -LiteralPath "apps/AHA-Base/template.md"
```

Expected: `True`
