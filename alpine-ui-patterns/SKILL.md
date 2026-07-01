---
name: alpine-ui-patterns
---

# alpine-ui-patterns — Catálogo Unificado de Componentes Alpine.js

Catálogo unificado de las 3 librerías de componentes Alpine.js + Tailwind CSS: **Pines UI**, **Penguin UI** y **Pinemix**. Consumido por `code-generator` y `design-engine` como alternativa o complemento a DaisyUI.

## Stack target

Alpine.js 3.x + Tailwind CSS 3.x + DaisyUI 5 (coexiste). Sin imports ES6 ni type="module". Sin CDNs en runtime. Sin npm install.

## Preferencia `component_library`

El usuario configura su preferencia en `.omd/preferences.md`:

| Valor | Comportamiento |
|-------|---------------|
| `auto` | DaisyUI por defecto; si no existe el componente, cascada Pines → Penguin → Pinemix |
| `pines` | Pines primero, fallback Penguin → Pinemix → DaisyUI |
| `penguin` | Penguin primero, fallback Pines → Pinemix → DaisyUI |
| `pinemix` | Pinemix primero, fallback Pines → Penguin → DaisyUI |
| `daisyui` | DaisyUI primero, fallback Pines → Penguin → Pinemix |

## Catálogo por categoría

| Categoría | Pines UI (40+) | Penguin UI (30+) | Pinemix (30) |
|-----------|---------------|-----------------|--------------|
| Accordion | ✅ | ✅ | ✅ |
| Alert | ✅ | ✅ | — |
| Avatar | — | ✅ | — |
| Badge | ✅ | ✅ | — |
| Banner | ✅ | ✅ | ✅ |
| Breadcrumb | ✅ | ✅ | ✅ |
| Button | ✅ | ✅ | — |
| Card | ✅ | ✅ | — |
| Carousel | — | ✅ | — |
| Chat Bubble | — | ✅ | — |
| Checkbox | ✅ | ✅ | — |
| Color Picker | — | — | ✅ |
| Combobox | — | ✅ | — |
| Command Palette | ✅ | — | ✅ |
| Context Menu | ✅ | — | — |
| Copy to Clipboard | ✅ | — | ✅ |
| Counter | — | ✅ | — |
| Countdown | — | — | ✅ |
| Dark Mode Toggle | — | — | ✅ |
| Date Picker | ✅ | — | — |
| Dropdown | ✅ | ✅ | ✅ |
| File Input | — | ✅ | — |
| Full Screen Modal | ✅ | — | — |
| Hover Card | ✅ | — | — |
| Image Gallery | ✅ | — | ✅ |
| Image Slider | — | — | ✅ |
| KBD | — | ✅ | — |
| Link | — | ✅ | — |
| Marquee | ✅ | — | ✅ |
| Menu Bar | ✅ | — | — |
| Modal | ✅ | ✅ | ✅ |
| Monaco Editor | ✅ | — | — |
| Navigation Menu | ✅ | — | — |
| Navbar | — | ✅ | — |
| Notification | — | — | ✅ |
| Offcanvas | — | — | ✅ |
| Pagination | ✅ | ✅ | — |
| Password Strength | — | — | ✅ |
| Popover | ✅ | — | ✅ |
| Pricing Switch | — | — | ✅ |
| Progress | ✅ | ✅ | ✅ |
| Quotes | ✅ | — | — |
| Radio Group | ✅ | ✅ | — |
| Range Slider | ✅ | ✅ | ✅ |
| Rating | ✅ | ✅ | ✅ |
| Retro Grid | ✅ | — | — |
| Select | ✅ | ✅ | ✅ |
| Side Navigation | — | — | ✅ |
| Sidebar | — | ✅ | — |
| Skeleton | ✅ | ✅ | ✅ |
| Slide-over | ✅ | — | — |
| Spinner | — | ✅ | — |
| Steps | — | ✅ | — |
| Switch | ✅ | — | — |
| Table | ✅ | ✅ | ✅ |
| Tabs | ✅ | ✅ | ✅ |
| Tag Input | — | — | ✅ |
| Text Input | ✅ | ✅ | — |
| Text Animation | ✅ | — | — |
| Textarea | ✅ | ✅ | — |
| Toast Notification | ✅ | ✅ | ✅ |
| Toggle | — | ✅ | — |
| Tooltip | ✅ | ✅ | ✅ |
| Tree View | — | — | ✅ |
| Two Factor | — | — | ✅ |
| Typing Effect | ✅ | — | — |
| Video | ✅ | — | — |

## Prioridad por calidad de componente

Basado en: integración Alpine, accesibilidad, markup mínimo, dark mode, animaciones.

### Categoría A — Patrón de referencia (mejor implementación)

Usar este patrón como referencia de calidad. El generador debe priorizar esta implementación.

| Componente | Fuente | Razón |
|-----------|--------|-------|
| Accordion | Pinemix | `<details>` semántico, accesible, animaciones fluidas |
| Alert | Pines | Variantes color, dismissible, iconos |
| Badge | Pines | Variantes size/color, dot indicator |
| Banner | Pines | Posiciones fixed/top, dismissible, tipos |
| Breadcrumb | Pinemix | Array-driven, truncation, iconos |
| Button | Pines | Loading state, icon variants, group |
| Card | Pines | Imagen header, footer, dividida |
| Command Palette | Pines | Cmd+K, search, keyboard nav, groups |
| Context Menu | Pines | Right-click, submenus, keyboard nav |
| Dark Mode Toggle | Pinemix | `$persist`, animación icono |
| Dropdown | Pinemix | `x-on:keydown.esc`, `x-on:click.outside`, ARIA |
| Modal | Pinemix | Transiciones escala + translate, backdrop blur, ARIA dialog |
| Notification | Pinemix | Stackable, auto-dismiss, posiciones |
| Offcanvas | Pinemix | Slide from edge, backdrop, `x-trap` |
| Pagination | Pines | Page numbers, prev/next, ellipsis |
| Popover | Pinemix | `x-on:click.outside`, posicionamiento |
| Progress | Pinemix | Determinate/indeterminate, label |
| Range Slider | Pinemix | Dual range, stepped, keyboard |
| Rating | Pines | Stars, half-stars, interactive |
| Select Menu | Pinemix | Custom options, search, keyboard |
| Skeleton | Pines | Card/table/text variants, shimmer |
| Slide-over | Pines | Panel lateral animado, `x-trap` |
| Table | Pines | Sortable, searchable, responsive |
| Tabs | Pinemix | ARIA, keyboard, vertical/horizontal |
| Tag Input | Pinemix | Removable tags, keyboard enter/delete |
| Toast | Pines | Stack, auto-dismiss, posiciones |
| Tooltip | Pinemix | `x-on:mouseenter.away`, posiciones |
| Tree View | Pinemix | Expandable, collapsible, icons |

### Categoría B — Alternativa sólida

Buena implementación, usar si fallback de A no está disponible.

| Componente | Fuente |
|-----------|--------|
| Accordion | Pines, Penguin |
| Alert | Penguin |
| Badge | Penguin |
| Banner | Pinemix, Penguin |
| Breadcrumb | Pines, Penguin |
| Button | Penguin |
| Card | Penguin |
| Checkbox | Pines, Penguin |
| Combobox | Penguin |
| Copy to Clipboard | Pines, Pinemix |
| Dropdown | Pines, Penguin |
| File Input | Penguin |
| Image Gallery | Pines, Pinemix |
| Marquee | Pines, Pinemix |
| Modal | Pines, Penguin |
| Pagination | Penguin |
| Popover | Pines |
| Progress | Pines, Penguin |
| Range Slider | Pines, Penguin |
| Rating | Pinemix, Penguin |
| Select | Pines, Penguin |
| Skeleton | Pinemix, Penguin |
| Table | Pinemix, Penguin |
| Tabs | Pines, Penguin |
| Text Input | Pines, Penguin |
| Textarea | Pines, Penguin |
| Toast | Pinemix, Penguin |
| Tooltip | Pines, Penguin |

### Categoría C — Exclusivo de una fuente

Solo disponible en una librería. No hay fallback.

| Componente | Fuente |
|-----------|--------|
| Avatar | Penguin |
| Carousel | Penguin |
| Chat Bubble | Penguin |
| Color Picker | Pinemix |
| Command Palette | Pines, Pinemix |
| Context Menu | Pines |
| Counter | Penguin |
| Countdown | Pinemix |
| Date Picker | Pines |
| Full Screen Modal | Pines |
| Hover Card | Pines |
| Image Slider | Pinemix |
| KBD | Penguin |
| Link | Penguin |
| Menu Bar | Pines |
| Monaco Editor | Pines |
| Navigation Menu | Pines |
| Navbar | Penguin |
| Offcanvas | Pinemix |
| Password Strength | Pinemix |
| Pricing Switch | Pinemix |
| Quotes | Pines |
| Radio Group | Pines, Penguin |
| Retro Grid | Pines |
| Side Navigation | Pinemix |
| Sidebar | Penguin |
| Slide-over | Pines |
| Spinner | Penguin |
| Steps | Penguin |
| Switch | Pines |
| Tag Input | Pinemix |
| Text Animation | Pines |
| Toggle | Penguin |
| Tree View | Pinemix |
| Two Factor | Pinemix |
| Typing Effect | Pines |
| Video | Pines |

## Patrones de código por tipo de componente

### Dropdown (referencia: Pinemix)

```html
<div x-data="{ open: false }" x-on:keydown.esc.prevent.stop="open = false" class="relative inline-block">
  <button @click="open = !open" :aria-expanded="open" type="button"
    class="btn">
    Menu <svg ...>chevron</svg>
  </button>
  <div x-cloak x-show="open"
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="opacity-0 -translate-y-3"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-75"
    x-transition:leave-start="opacity-100 translate-y-0"
    x-transition:leave-end="opacity-0 translate-y-10"
    @click.outside="open = false"
    role="menu" class="absolute end-0 z-10 mt-2 w-44 origin-top-right rounded-lg shadow-xl">
    <div class="divide-y divide-base-200 rounded-lg bg-base-100 ring-1 ring-black/5">
      <div class="p-2">
        <a role="menuitem" href="#" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-base-200">Item</a>
      </div>
    </div>
  </div>
</div>
```

### Modal (referencia: Pinemix)

```html
<div x-data="{ open: false }" @keydown.esc.prevent="open = false">
  <button @click="open = true" type="button" class="btn">Open Modal</button>
  <div x-cloak x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    :aria-hidden="!open" tabindex="-1" role="dialog"
    class="fixed inset-0 z-50 overflow-y-auto bg-base-300/75 p-4 backdrop-blur-sm lg:p-8">
    <div x-cloak x-show="open" @click.away="open = false"
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0 scale-90 -translate-y-full"
      x-transition:enter-end="opacity-100 scale-100 translate-y-0"
      x-transition:leave="transition ease-in duration-150"
      x-transition:leave-start="opacity-100 scale-100 translate-y-0"
      x-transition:leave-end="opacity-0 scale-125 translate-y-full"
      role="document"
      class="mx-auto w-full max-w-md rounded-lg bg-base-100 shadow-xs">
      <div class="flex items-center justify-between border-b border-base-200 px-5 py-4">
        <h3 class="text-lg font-bold">Title</h3>
        <button @click="open = false" class="btn btn-ghost btn-sm">✕</button>
      </div>
      <div class="p-5"><p class="text-sm">Content...</p></div>
      <div class="flex justify-end gap-2 border-t border-base-200 px-5 py-4">
        <button @click="open = false" class="btn">Close</button>
        <button @click="open = false" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

### Accordion (referencia: Pinemix)

```html
<div x-data="{ active: 'q1', setActive(q) { this.active = (this.active !== q) ? q : '' } }"
  class="mx-auto max-w-xl divide-y divide-base-200 overflow-hidden rounded-lg border border-base-200">
  <template x-for="(item, idx) in ['q1','q2','q3']" :key="item">
    <details :open="active === item" class="group">
      <summary @click.prevent="setActive(item)"
        class="flex cursor-pointer list-none items-center justify-between p-4 hover:bg-base-200 group-open:bg-base-200 [&::-webkit-details-marker]:hidden">
        <h4 class="font-semibold" x-text="'Question ' + (idx + 1)"></h4>
        <svg class="size-5 transition-transform group-open:rotate-180" ...>chevron</svg>
      </summary>
      <p class="p-4 text-sm text-base-content/70" x-text="'Answer content...'"></p>
    </details>
  </template>
</div>
```

### Tabs (referencia: Pinemix)

```html
<div x-data="{ active: 'tab1' }" class="flex flex-col">
  <div class="flex items-center text-sm gap-0"
    @keydown.right.prevent.stop="$focus.wrap().next()"
    @keydown.left.prevent.stop="$focus.wrap().previous()">
    <template x-for="tab in ['Tab 1','Tab 2','Tab 3']" :key="tab">
      <button @click="active = tab.toLowerCase().replace(' ','')"
        :aria-selected="active === tab.toLowerCase().replace(' ','')"
        :tabindex="active === tab.toLowerCase().replace(' ','') ? '0' : '-1'"
        class="px-5 py-3 font-medium -mb-px border-x border-t rounded-t-lg"
        :class="active === tab.toLowerCase().replace(' ','')
          ? 'bg-base-100 border-base-200 text-base-content'
          : 'border-transparent hover:text-base-content/80'"
        x-text="tab"></button>
    </template>
  </div>
  <div class="rounded-b-lg rounded-tr-lg border border-base-200 bg-base-100 p-5">
    <div x-show="active === 'tab1'" x-cloak>
      <h4 class="mb-2 text-lg font-bold">Content 1</h4>
      <p class="text-sm">...</p>
    </div>
  </div>
</div>
```

### Toast Notification (referencia: Pines)

```html
<div x-data="{ toasts: [], addToast(msg) { this.toasts.push({ id: Date.now(), message: msg }); setTimeout(() => { this.toasts.shift() }, 4000) } }"
  class="fixed top-4 right-4 z-50 flex flex-col gap-2">
  <template x-for="toast in toasts" :key="toast.id">
    <div x-show="toast.show"
      x-transition:enter="transition ease-out duration-300"
      x-transition:enter-start="opacity-0 translate-x-full"
      x-transition:enter-end="opacity-100 translate-x-0"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100 translate-x-0"
      x-transition:leave-end="opacity-0 translate-x-full"
      class="alert alert-info shadow-lg">
      <span x-text="toast.message"></span>
      <button @click="toasts = toasts.filter(t => t.id !== toast.id)" class="btn btn-ghost btn-xs">✕</button>
    </div>
  </template>
</div>
```

### Skeleton Loader (referencia: Pines)

```html
<div role="status" class="animate-pulse space-y-4">
  <div class="flex items-center gap-4">
    <div class="size-10 rounded-full bg-base-300"></div>
    <div class="h-4 flex-1 rounded bg-base-300"></div>
  </div>
  <div class="h-3 w-3/4 rounded bg-base-300"></div>
  <div class="h-3 w-1/2 rounded bg-base-300"></div>
</div>
```

### Tooltip (referencia: Pinemix)

```html
<div x-data="{ show: false }" class="relative inline-block">
  <div @mouseenter="show = true" @mouseleave="show = false"
    @focusin="show = true" @focusout="show = false"
    class="cursor-help" aria-describedby="tooltip">
    Hover me
  </div>
  <div x-cloak x-show="show"
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="opacity-0 -translate-y-1"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-75"
    x-transition:leave-start="opacity-100 translate-y-0"
    x-transition:leave-end="opacity-0 translate-y-1"
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-base-content text-base-100 whitespace-nowrap shadow-lg z-50"
    role="tooltip">
    Tooltip content
  </div>
</div>
```

### Command Palette / Cmd+K (referencia: Pines)

```html
<div x-data="{ open: false, query: '', results: [], items: ['Dashboard','Profile','Settings','Logout'] }"
  @keydown.cmd.k.prevent="open = true; query = ''"
  @keydown.escape.window="open = false">
  <button @click="open = true" class="btn btn-ghost">
    <kbd class="kbd kbd-sm">⌘K</kbd>
  </button>
  <div x-cloak x-show="open" class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
    <div class="fixed inset-0 bg-base-300/50" @click="open = false"></div>
    <div class="relative w-full max-w-lg rounded-xl bg-base-100 shadow-2xl border border-base-200 overflow-hidden"
      @keydown.escape="open = false">
      <div class="flex items-center gap-2 border-b border-base-200 px-4 py-3">
        <svg class="size-5 opacity-40">search icon</svg>
        <input x-model="query" type="text" placeholder="Search..."
          class="w-full bg-transparent outline-none text-sm"
          x-ref="cmdInput">
      </div>
      <div class="max-h-72 overflow-y-auto p-2">
        <template x-for="item in items.filter(i => i.toLowerCase().includes(query.toLowerCase()))" :key="item">
          <button @click="open = false"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200">
            <span x-text="item"></span>
          </button>
        </template>
      </div>
    </div>
  </div>
</div>
```

### Select Menu (referencia: Pinemix)

```html
<div x-data="{ open: false, selected: null, options: ['Option 1','Option 2','Option 3'] }"
  class="relative" @keydown.esc.prevent.stop="open = false">
  <button @click="open = !open" type="button"
    class="flex w-full items-center justify-between gap-2 rounded-lg border border-base-300 bg-base-100 px-4 py-2.5 text-sm">
    <span x-text="selected ?? 'Select option...'" :class="!selected && 'opacity-50'"></span>
    <svg class="size-4 transition-transform" :class="open && 'rotate-180'">chevron</svg>
  </button>
  <div x-cloak x-show="open" @click.outside="open = false"
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="opacity-0 -translate-y-2"
    x-transition:enter-end="opacity-100 translate-y-0"
    class="absolute z-10 mt-1 w-full rounded-lg border border-base-300 bg-base-100 shadow-lg">
    <template x-for="option in options" :key="option">
      <button @click="selected = option; open = false"
        class="flex w-full items-center px-4 py-2.5 text-sm hover:bg-base-200"
        :class="selected === option && 'font-medium'"
        x-text="option"></button>
    </template>
  </div>
</div>
```

### Switch / Toggle (referencia: Pines)

```html
<label class="relative inline-flex cursor-pointer items-center gap-3">
  <input type="checkbox" x-model="enabled" class="sr-only">
  <div class="h-6 w-11 rounded-full transition-colors"
    :class="enabled ? 'bg-primary' : 'bg-base-300'">
    <div class="size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform"
      :class="enabled && 'translate-x-5.5'"></div>
  </div>
  <span class="text-sm font-medium" x-text="enabled ? 'On' : 'Off'"></span>
</label>
```

## CSS específico por librería

### Pines UI
- Usa clases utilitarias Tailwind estándar. No requiere CSS adicional.
- Animaciones: `transition duration-150 ease-out`, `group-hover:`, `group-open:`

### Penguin UI
- Usa variables CSS personalizadas para theming: `--penguin-primary`, `--penguin-secondary`, etc.
- Temas predefinidos: Arctic, Modern, Minimal, Halloween II, Neo Brutalism, Pastel
- Requiere importar su hoja de estilos solo si se usan temas → NO en offline-first (inline styles en su lugar)

### Pinemix
- Iconos Heroicons vía SVG inline (`hi-mini`, `hi-micro`)
- `@keydown.esc.prevent`, `@click.outside` para cierres
- `x-cloak` para prevenir FOUC
- Algunos componentes requieren `@alpinejs/focus` plugin (Tabs, dropdown keyboard nav)

## Clausula de adopción técnica

Cuando code-generator use estos patrones, debe:

1. **No mezclar** 2 implementaciones distintas del mismo componente en una pantalla
2. **Adaptar colores** — Los ejemplos usan `zinc-*`, `base-*`. El generador debe mapear a los tokens del theme activo: `primary`, `secondary`, `accent`, `base-100/200/300`, `base-content`
3. **Preservar clases DaisyUI** — `btn`, `card`, `alert`, `badge`, `kbd`, `table` son compatibles. No reemplazar clases DaisyUI por clases Tailwind vanilla a menos que el componente lo requiera (ej. dropdown, modal de Pinemix)
4. **x-cloak** — Siempre incluir `<style>[x-cloak] { display: none !important }</style>` en `<head>` cuando se use `x-cloak`
5. **Dark mode** — Usar `dark:` prefijo + clase `dark` en `<html>`. Los ejemplos de Pinemix incluyen `dark:` nativo. Pines usa principalmente clases sin `dark:` (asume DaisyUI dark mode)
6. **Accesibilidad** — Mantener `role`, `aria-*`, `tabindex` de los patrones de referencia (categoría A)
