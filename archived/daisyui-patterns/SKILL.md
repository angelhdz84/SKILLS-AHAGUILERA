---
# @deprecated — Absorbido por design-engine
# Motivo: El conocimiento de DaisyUI 5 + Alpine.js ahora es parte integral de design-engine
# Migración: design-engine aplica patrones DaisyUI directamente al generar UI
name: daisyui-patterns
description: [DEPRECATED] Absorbido por design-engine. Patrones de componentes DaisyUI 5 optimizados para Alpine.js + offline-first. Referencia oficial via SKILL.md de daisyui.com + integracion con Alpine (x-data, $persist, modales, drawer, dropdowns). Consumido por code-generator, design-ux-intelligence, ux-refactor.
license: MIT
compatibility: Requiere DaisyUI 5 + Tailwind CSS 4. Compatible con stack offline-first (assets/ local o CDN).
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.1"
  triggers:
    - "daisyui"
    - "componente daisyui"
    - "boton daisyui"
    - "modal daisyui"
    - "card daisyui"
    - "daisyui 5"
    - "tema daisyui"
    - "componente ui"
    - "patron ui"
  stack: ["daisyui", "daisyui-5", "tailwind-css-4", "offline-first"]
  language: es
  references:
    - "https://daisyui.com/SKILL.md"
  mcp:
    - "daisyui-gitmcp"
    - "context7"
---

# SKILL: daisyui-patterns (Componentes DaisyUI 5 + Alpine.js)

> **Proposito**: Referencia de componentes DaisyUI 5 con patrones de integracion Alpine.js para el stack offline-first.
> **Idioma**: ES | **Stack**: DaisyUI 5 + Tailwind CSS 4 + Alpine.js
> **Referencia oficial**: https://daisyui.com/SKILL.md (componentes, sintaxis, colores, temas)

---

## REGLAS FUNDAMENTALES

1. **NO duplicar** la documentacion oficial — usa `https://daisyui.com/SKILL.md` como referencia viva
2. **SI incluir** patrones de integracion Alpine.js + DaisyUI
3. **SI usar** `use daisyui-gitmcp` o `use context7` en prompts para obtener informacion actualizada
4. **NO generar** clases DaisyUI inventadas — solo las que existen en la documentacion oficial
5. **SI usar** colores semanticos de DaisyUI (`primary`, `secondary`, `accent`, `base-100`, etc.)

## CUANDO ACTIVARSE

El usuario dice frases como:
- "crea un formulario con daisyui"
- "pon un modal con daisyui y alpine"
- "usa componentes daisyui"
- "haz un drawer con alpine"
- "cambia el tema a oscuro con daisyui"
- "usa card btn input de daisyui"
- "componente de [nombre] con daisyui"

---

## PATRONES ALPINE.JS + DAISYUI 5

### Modal con Alpine (dialog HTML)
```html
<button class="btn btn-primary" @click="$refs.modal.showModal()">Abrir</button>
<dialog x-ref="modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Titulo</h3>
    <p class="py-4">Contenido</p>
    <div class="modal-action">
      <button class="btn" @click="$refs.modal.close()">Cerrar</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop"><button>cerrar</button></form>
</dialog>
```

### Drawer sidebar con Alpine
```html
<div class="drawer lg:drawer-open" x-data="{ open: false }">
  <input id="drawer" type="checkbox" class="drawer-toggle" x-model="open" />
  <div class="drawer-content">
    <label for="drawer" class="btn btn-primary drawer-button lg:hidden" @click="open = !open">
      ☰ Menu
    </label>
    <!-- contenido -->
  </div>
  <div class="drawer-side">
    <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4">
      <li><a>Item</a></li>
    </ul>
  </div>
</div>
```

### Dropdown con Alpine
```html
<div x-data="{ open: false }" class="dropdown" @click.outside="open = false">
  <button class="btn" @click="open = !open">Opciones</button>
  <ul class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      x-show="open" x-transition>
    <li><a>Opción 1</a></li>
    <li><a>Opción 2</a></li>
  </ul>
</div>
```

### Tema persistente con Alpine
```html
<html :data-theme="theme" x-data="{ theme: $persist('light') }">
  <button class="btn btn-ghost" @click="theme = theme === 'light' ? 'dark' : 'light'">
    <span x-text="theme === 'light' ? '🌙' : '☀️'"></span>
  </button>
</html>
```

### Accordion con Alpine
```html
<div x-data="{ open: null }">
  <template x-for="(item, i) in items" :key="i">
    <div class="collapse collapse-arrow">
      <input type="radio" name="accordion" :checked="open === i" @click="open = i" />
      <div class="collapse-title font-medium" x-text="item.title"></div>
      <div class="collapse-content" x-text="item.content"></div>
    </div>
  </template>
</div>
```

### Loading state en boton con Alpine
```html
<button class="btn" :class="{ 'btn-disabled': loading }" @click="loading = true">
  <span x-show="loading" class="loading loading-spinner"></span>
  <span x-text="loading ? 'Guardando...' : 'Guardar'"></span>
</button>
```

### Tooltip con Alpine
```html
<div class="tooltip" :data-tip="tip">
  <button class="btn">Hover</button>
</div>
```

### Tabs con Alpine
```html
<div x-data="{ tab: 'info' }">
  <div role="tablist" class="tabs tabs-lift">
    <a role="tab" class="tab" :class="{ 'tab-active': tab === 'info' }" @click="tab = 'info'">Info</a>
    <a role="tab" class="tab" :class="{ 'tab-active': tab === 'config' }" @click="tab = 'config'">Config</a>
  </div>
  <div x-show="tab === 'info'" class="p-4">Contenido info</div>
  <div x-show="tab === 'config'" class="p-4">Contenido config</div>
</div>
```

---

## CARGA EN STACK OFFLINE-FIRST

DaisyUI 5 + Tailwind CSS 4 se cargan desde `assets/`:

```html
<link href="assets/daisyui@5.min.css" rel="stylesheet" type="text/css" />
<link href="assets/daisyui@5/themes.css" rel="stylesheet" type="text/css" />
<script src="assets/tailwindcss-browser@4.js"></script>
```

Sin npm, sin build step. Todas las clases de DaisyUI 5 funcionan directamente.

---

## NOTAS DE PERFIL

- DaisyUI 5 se usa igual en ambos perfiles (Lite y Full). No hay diferencias de componentes entre perfiles.
- En perfil Lite: carga desde `assets/css/daisyui.min.css` (descargado por curl).
- En perfil Full: carga vía `bun add daisyui` y configuración en `tailwind.config.js` como plugin.
- Los patrones Alpine + DaisyUI (modales, drawers, dropdowns, tabs) son idénticos en ambos perfiles.

## REFERENCIAS

- Documentacion oficial completa: `https://daisyui.com/SKILL.md`
- MCP gratuito: `https://gitmcp.io/saadeghi/daisyui` (usar `use daisyui-gitmcp`)
- Context7: MCP ya configurado (usar `use context7`)
- Blueprint MCP (pago): `npx daisyui-blueprint@latest`
