---
name: ux-ui-universal
description: Audita, recomienda y aplica mejoras de UX/UI a cualquier app web existente, independientemente del stack. Detecta automaticamente el framework (React, Vue, Angular, Svelte, Django, Rails, Laravel, ASP.NET, Spring Boot, etc.) y adapta las recomendaciones usando context7. 4 fases: audit → recommend → implement → validate.
license: MIT
compatibility: Funciona con cualquier app web. Detecta automaticamente React, Vue, Angular, Svelte, Next.js, Nuxt, SvelteKit, Solid, Django, Rails, Laravel, ASP.NET, Spring Boot, WordPress, Vanilla JS, y otros. Lee codigo existente y lo modifica in-place sin regenerar la app.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.1"
  generatedBy: "ux-ui-universal skill"
  triggers: ["mejorar UI", "mejorar diseño", "cambiar diseño", "refactor UX", "refactorizar interfaz", "cambiar apariencia", "mejorar la interfaz", "hacer mas bonito", "aplicar diseño profesional", "ux audit", "auditoria UX", "refactorizar UI de"]
  language: es
  references:
    - "references/audit-checklist.md"
    - "references/pattern-matrix.md"
  mcp:
    - "a11y"
    - "refero-styles"
    - "context7"
    - "chrome-devtools"
  stackDetection:
    packageJson: ["react", "next", "vue", "nuxt", "svelte", "solid-js", "@angular/core", "stimulus", "livewire", "alpinejs"]
    configFiles: ["next.config", "nuxt.config", "svelte.config", "vite.config", "angular.json", "tailwind.config"]
    backendSignals:
      - "requirements.txt + django → Django"
      - "Gemfile + rails → Rails"
      - "composer.json + laravel → Laravel"
      - ".csproj / .cshtml → ASP.NET"
      - "pom.xml / build.gradle + spring-boot → Spring Boot"
      - "theme.json + wp-content → WordPress"
      - "package.json + next → Next.js (fullstack)"
    templateExtensions: [".jsx", ".tsx", ".vue", ".svelte", ".jinja", ".jinja2", ".erb", ".haml", ".blade.php", ".cshtml", ".liquid", ".twig"]
  orchestrates:
    - "page-structure-patterns"
    - "form-patterns"
    - "list-page-patterns"
    - "detail-page-patterns"
    - "modal-patterns"
    - "interaction-patterns"
    - "toast-notification-patterns"
    - "navigation-patterns"
    - "info-card-patterns"
    - "data-density-patterns"
    - "status-visualization-patterns"
    - "mobile-responsive-ux"
    - "wcag-accessibility"
    - "keyboard-shortcuts-patterns"
    - "split-panel-patterns"
    - "editor-workspace-patterns"
    - "canvas-grid-patterns"
    - "turn-based-ui-patterns"
    - "event-timeline-patterns"
    - "drag-drop-patterns"
    - "comparison-patterns"
    - "playback-replay-patterns"
    - "visual-design-system"
  noTouch:
    - "Logica de negocio y estado global"
    - "Logica CRUD y acceso a datos"
    - "API calls y autenticacion"
    - "Testing y configuracion de build"
    - "Migraciones y schemas de base de datos"
    - "Controladores, servicios, repositorios"
---

# SKILL: ux-ui-universal (Refactorizacion UX/UI Multi-Stack)

> **Proposito**: Mejorar la experiencia de usuario y apariencia visual de **cualquier app web**, independientemente del framework o stack. Detecta automaticamente el stack, consulta context7 para obtener APIs actualizadas, y aplica cambios in-place.
> **Modo**: 4 fases secuenciales | **Idioma**: ES | **Contexto**: Cualquier app web
> **Input**: Codigo fuente existente (cualquier estructura)
> **Output**: Archivos modificados in-place + reporte de cambios en `docs/refactor-[app].md`

---

## REGLAS FUNDAMENTALES

1. **NO regenerar la app** — trabajas sobre el codigo existente, editandolo in-place
2. **NO tocar logica de negocio** — solo UI: plantillas, CSS, clases, atributos, estructura DOM, ARIA, colores, tipografia
3. **NO escribir codigo de ejemplo hardcodeado** — los .md solo tienen queries para context7; el codigo concreto se obtiene via context7 segun el stack detectado
4. **SI detectar el stack** en FASE 1 para adaptar todo el flujo
5. **SI usar context7** para obtener documentacion actualizada del stack detectado
6. **SI orquestar** skills de patrones (form-patterns, modal-patterns, etc.) y MCPs (a11y, refero-styles, context7) como oraculos de consulta

---

## FASE 1: AUDITORIA

```
[▓▓▓▓░░░░░░░░░░░░] 25% • Detectando stack y auditando UX/UI...
(stack detection + audit-checklist + a11y MCP + refero-styles)
```

### Paso 1.1 — Detectar stack (completo)

Busca multiples señales para identificar el stack con precision:

**Frontend JS:**
| Señal | Stack |
|-------|-------|
| `package.json` con `react`, `next` | React / Next.js |
| `package.json` con `vue`, `nuxt` | Vue / Nuxt |
| `package.json` con `@angular/core`, `angular.json` | Angular |
| `package.json` con `svelte`, `sveltekit` | Svelte / SvelteKit |
| `package.json` con `solid-js` | Solid |
| `.vue` files | Vue |
| `.svelte` files | Svelte |
| `.jsx` / `.tsx` files | React / Solid |
| Sin seniales de framework | Vanilla JS |

**Backend / Fullstack:**
| Señal | Stack |
|-------|-------|
| `requirements.txt` + `django` | Django |
| `Pipfile` + `django` | Django |
| `Gemfile` + `rails` | Ruby on Rails |
| `composer.json` + `laravel` | Laravel |
| `.csproj` / `.sln` / `.cshtml` files | ASP.NET / Blazor |
| `pom.xml` + `spring-boot` / `build.gradle` + `spring-boot` | Spring Boot |
| `theme.json` + `wp-content` | WordPress |
| `package.json` + `next` (con `pages/` o `app/`) | Next.js (fullstack) |
| `package.json` + `nuxt` | Nuxt (fullstack) |

**CSS Framework:**
| Señal | Stack |
|-------|-------|
| `tailwind.config.*` | Tailwind CSS |
| `_variables.scss` + `bootstrap` | Bootstrap |
| `@mui/material` en package.json | MUI |
| `@angular/material` | Angular Material |
| `primevue` / `primeng` / `primereact` | Prime* |
| `bulma` | Bulma |

**Template engine (backend):**
| Extension | Engine |
|-----------|--------|
| `.jinja` / `.jinja2` / `.html` (Django) | Jinja2 / Django templates |
| `.erb` | ERB (Rails) |
| `.haml` | Haml (Rails) |
| `.blade.php` | Blade (Laravel) |
| `.cshtml` | Razor (ASP.NET) |
| `.liquid` | Liquid (Shopify / Jekyll) |
| `.twig` | Twig (Symfony) |

### Paso 1.2 — Identificar estructura de archivos de UI

Segun el stack detectado, busca estos patrones:

**Frontend SPA:**
- React: `src/components/`, `src/app/`, `*.jsx`
- Vue: `src/components/`, `src/layouts/`, `*.vue`
- Angular: `src/app/`, `*.component.html`, `*.component.ts`
- Svelte: `src/lib/`, `src/routes/`, `*.svelte`

**Backend rendered:**
- Django: `templates/`, `templates/*/`, `static/`, `static/*/css/`
- Rails: `app/views/`, `app/views/layouts/`, `app/assets/stylesheets/`
- Laravel: `resources/views/`, `resources/views/layouts/`, `public/css/`
- ASP.NET: `Pages/`, `Views/`, `wwwroot/css/`
- Spring Boot: `src/main/resources/templates/`, `static/`

**CSS:** busca el archivo principal de estilos segun el framework detectado.

### Paso 1.3 — Ejecutar auditoria sistematica

Usa `references/audit-checklist.md` para revisar cada aspecto:

1. **Inspeccion visual** — Abre la app en navegador (si disponible) o revisa HTML/plantillas
2. **Inspeccion de codigo** — Busca clases, atributos, estructura en los archivos detectados
3. **A11y check** — Usa MCP de accesibilidad para verificar contraste, roles, ARIA
4. **Stack conventions** — Verifica que el codigo siga las convenciones del framework detectado
5. **Refero match** — Si aplica, usa refero-styles para encontrar paletas de marca reales
6. **Generar seccion 7** — Crea dinamicamente la seccion 7 del checklist con items especificos del stack detectado, usando context7 si es necesario

### Paso 1.4 — Compilar reporte de auditoria

```
📋 REPORTE DE AUDITORIA UX/UI — [app]

Stack detectado: [framework + version + CSS framework]

CRITICOS (debe corregirse):
- [ ] [item] — [archivo:linea]

ALTOS (debe corregirse si posible):
- [ ] [item] — [archivo:linea]

MEDIOS (mejora notable):
- [ ] [item] — [archivo:linea]

BAJOS (nice-to-have):
- [ ] [item] — [archivo:linea]

ESTILO RECOMENDADO (de refero-styles):
- [nombre estilo] — [razon]
```

### Paso 1.5 — Pedir confirmacion

```
📊 Auditoria completa. Stack: [framework + version]. Encontrados [N] items (X criticos, Y altos).
¿Procedo con FASE 2: Recomendacion detallada?
[1] Si, continuar
[2] Mostrar solo criticos/altos
[3] Cancelar
```

---

## FASE 2: RECOMENDACION

```
[▓▓▓▓▓▓▓▓░░░░░░░░] 50% • Generando plan de accion con context7...
(pattern-matrix + context7 batch queries + refero-styles)
```

### Paso 2.1 — Mapear problemas a patrones

Para cada item de la auditoria, consulta `references/pattern-matrix.md`.
Tiene 3 columnas: **Problema** → **Patron** → **context7 query base**.

**No uses los ejemplos hardcodeados del pattern-matrix** — son solo queries para context7.
El codigo concreto se obtiene en el paso siguiente.

### Paso 2.2 — Batch de consultas context7

Agrupa los items por stack detectado y haz consultas **en paralelo** a context7:

```
// Ejemplo para items detectados en React 19:
context7: "modal dialog focus trap React 19 2026"
context7: "form validation react hook form zod React 19"
context7: "table sort filter pagination React 19"
context7: "toast notification library React 19"
context7: "keyboard shortcuts navigation React 19"
```

```
// Ejemplo para items detectados en Django 5.1:
context7: "Django crispy forms inline validation 5.1"
context7: "Django message framework toast Bootstrap 5"
context7: "Django pagination class template 5.1"
context7: "Django modal dialog HTMX Bootstrap 5"
context7: "Django template breadcrumb pattern"
```

```
// Ejemplo para items detectados en Rails 8:
context7: "Rails simple form error styling 8"
context7: "Rails Turbo Stream toast notification"
context7: "Rails Hotwire modal dialog stimulus controller"
context7: "Rails will paginate bootstrap 5 styling"
```

**Casos donde context7 es obligatorio:**
- Formularios y validacion (APIs cambian por version)
- Modales/dialogos (cada framework tiene su implementacion)
- Drag and drop (distinto en React vs Vue vs Angular vs vanilla)
- Animaciones y transiciones (librerias especificas)
- Atajos de teclado (binding distinto en cada stack)
- Toasts/notificaciones (librerias especificas)
- Paginacion, tabs, breadcrumbs (componentes propios del framework)

**Casos donde NO se necesita context7:**
- Contraste, ARIA roles, focus visible (WCAG es universal)
- Espaciado, tipografia, modo oscuro (CSS puro)
- Layout responsive (media queries)
- Iconografia (elegir libreria)

### Paso 2.3 — Consultar oraculos de patrones (si aplica)

Para items complejos, carga la skill de patron correspondiente como referencia teorica:
- **Modales**: modal-patterns (focus trap, Escape, backdrop, aria-modal)
- **Formularios**: form-patterns (validacion inline, errores, wizard)
- **Listas**: list-page-patterns (filtros, paginacion, sorting)
- **Layout**: page-structure-patterns (app shell, estados loading/empty/error)
- **Micro-interacciones**: interaction-patterns, toast-notification-patterns
- **Accesibilidad**: wcag-accessibility + a11y MCP

No dupliques el contenido de la skill — usala como referencia conceptual y adapta la implementacion al stack detectado.

### Paso 2.4 — Construir plan de accion detallado

Cada item debe incluir la respuesta de context7:

```
### [N] — [titulo del cambio]
**Stack**: [framework detectado]
**Archivo**: `ruta/al/archivo`
**Patron**: [nombre del patron]
**context7 query**: "[query usada]"
**context7 resultado**: [resumen de lo que devolvio context7]
**Cambio concreto**:
- Reemplazar `[codigo actual]` por `[codigo nuevo]`
- Agregar `[nuevo codigo]`
**Impacto**: [bajo/medio/alto]
```

### Paso 2.5 — Mostrar plan y esperar confirmacion

```
📋 PLAN DE ACCION — [app]

Stack: Django 5.1 + Bootstrap 5 + HTMX

Consultas context7 realizadas: 5

Prioridad 1 - Criticos (N items):
  [1.1] [titulo] — [archivo] ← context7: [framework] modal focus trap

Prioridad 2 - Altos (N items):
  [2.1] [titulo] — [archivo] ← context7: [framework] form validation

Prioridad 3 - Medios (N items):
  [3.1] [titulo] — [archivo] ← context7: [framework] toast

Diseno referente: [nombre] de refero.design

✅ ¿Procedo con FASE 3: Implementacion?
[1] Si, todos
[2] Solo criticos y altos
[3] Seleccionar manualmente
[4] Cancelar / modificar plan
```

---

## FASE 3: IMPLEMENTACION

```
[▓▓▓▓▓▓▓▓▓▓▓▓░░░░] 75% • Aplicando cambios UX/UI en [framework]...
(context7 output aplicado a archivos concretos)
```

### Paso 3.1 — Aplicar cambios por archivo

Procesa las modificaciones en orden de prioridad. Para cada cambio:

1. **Lee el archivo** actual (estado mas reciente)
2. **Usa el output de context7** como guia de implementacion
3. **Aplica la edicion** adaptando al archivo concreto del proyecto
4. **Verifica** que el cambio sea correcto sintacticamente segun el stack

**Reglas por tipo de stack:**

**React/Next (JSX/TSX):**
- Modifica JSX, className, style objects
- No dangerouslySetInnerHTML
- Estado local con hooks funcionales
- Tailwind: modifica strings className

**Vue/Nuxt (SFC .vue):**
- Modifica `<template>` + `<script setup>`
- Usa v-bind, v-if, v-for, v-model
- No toques composables de negocio

**Angular:**
- Modifica template HTML + component TS
- No toques servicios, guards, resolvers
- Standalone components es el estandar

**Svelte (.svelte):**
- Modifica markup, style, reactive declarations
- No toques load functions ni stores

**Django (Jinja templates):**
- Modifica `templates/*.html`
- Template tags: `{% %}`, `{{ }}`, `{% block %}`
- Static files en `static/`
- No toques `views.py`, `models.py`, `urls.py`

**Rails (ERB/Haml):**
- Modifica `app/views/*.html.erb`
- Partials con `render partial:`
- Assets en `app/assets/stylesheets/`
- No toques `controllers/`, `models/`, `helpers/`

**Laravel (Blade):**
- Modifica `resources/views/*.blade.php`
- Directivas: `@section`, `@yield`, `@include`
- Livewire: modifica componentes en `resources/views/livewire/`
- No toques `app/Http/Controllers/`, `app/Models/`

**ASP.NET (Razor/Blazor):**
- Modifica `.cshtml` (Razor Pages) o `.razor` (Blazor)
- Tag Helpers: `<form asp-action>`, `<a asp-page>`
- CSS en `wwwroot/css/`
- No toques `Pages/*.cshtml.cs`, `Controllers/`, `Services/`

**Spring Boot (Thymeleaf):**
- Modifica `src/main/resources/templates/*.html`
- Atributos Thymeleaf: `th:text`, `th:field`, `th:each`
- CSS en `src/main/resources/static/css/`
- No toques `@Controller`, `@Service`, `@Repository`

**Vanilla JS:**
- Modifica HTML + CSS + JS directamente
- classList, textContent, createElement (no innerHTML)
- Event delegation para listas

### Paso 3.2 — Aplicar refero-styles (opcional)

Si en FASE 2 se selecciono un estilo de refero-styles:
1. Carga `refero_get_design_md` para el estilo seleccionado
2. Extrae paleta de colores
3. Aplica variables CSS en el archivo de estilos principal
4. Ajusta clases de componentes segun corresponda

### Paso 3.3 — Reporte de cambios aplicados

```
✅ [3/15] • [titulo] — [archivo] — OK (context7: modal focus trap)
✅ [4/15] • [titulo] — [archivo] — OK (context7: form validation)
⚠️ [5/15] • [titulo] — requiere decision manual
```

### Paso 3.4 — Confirmar fin de implementacion

```
📦 Implementacion completada: [N] cambios aplicados, [M] pendientes.
¿Procedo con FASE 4: Validacion?
[1] Si, validar todo
[2] Validar solo cambios criticos
[3] Revisar manualmente antes
```

---

## FASE 4: VALIDACION

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% • Validando cambios...
(Lighthouse + a11y MCP + checklist)
```

### Paso 4.1 — Verificacion de checklist

Re-corre los items de `references/audit-checklist.md` que se marcaron como corregidos:

```
✅ [loading states] — botones tienen estado disabled durante async
✅ [responsive] — grid responsivo funcionando
✅ [focus visible] — :focus-visible presente en inputs y botones
...
```

### Paso 4.2 — Lighthouse / a11y check

Si el usuario tiene la app abierta en navegador:
- Ejecuta auditoria Lighthouse (accesibilidad, SEO, best practices)
- Verifica contraste con a11y MCP
- Toma screenshot de antes/despues (opcional)

### Paso 4.3 — Stack validation

Verifica que los cambios respeten las convenciones del framework:
- **React:** sin referencias a variables no definidas, keys en listas
- **Vue:** directivas correctas, sintaxis `<script setup>`
- **Angular:** binding syntax, standalone components
- **Django:** template tags correctos, static files
- **Rails:** ERB syntax, partials
- **Laravel:** Blade directives
- **General:** sin console.log, sin importaciones rotas

### Paso 4.4 — Generar reporte final

```
# Reporte de Refactorizacion UX/UI — [app]

Fecha: [fecha]
Skill: ux-ui-universal v1.1
App: [nombre]
Stack: [framework + version]
Archivos modificados: [N]
Consultas context7: [N]

## Cambios realizados

### Criticos (N)
- [x] [item] ← context7: [query]

### Altos (N)
- [x] [item] ← context7: [query]

### Medios (N)
- [x] [item]

### Bajos (N)
- [x] [item]

## Diseno referente
[estilo] de refero.design

## Resultados validacion
- Lighthouse accessibility: [score]
- Lighthouse best practices: [score]
- Lighthouse SEO: [score]
- Items checklist verificados: [N/M]
- Stack conventions: OK / [observaciones]
```

### Paso 4.5 — Resumen final

```
✅ REFACTORIZACION COMPLETADA — [app]

Stack: [framework version]
Archivos modificados: [N]
Items corregidos: [N] (Criticos: [N], Altos: [N], Medios: [N])
Consultas context7: [N]
Lighthouse a11y: [antes → despues]
Reporte: docs/refactor-[app].md

💡 Revisa la app en el navegador para confirmar los cambios.
Si algo no se ve bien, puedo ajustarlo.
```
