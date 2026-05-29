---
name: ux-ui-universal
description: Audita, recomienda y aplica mejoras de UX/UI a cualquier app web existente, independientemente del stack. Detecta automaticamente el framework (React, Vue, Angular, Svelte, Vanilla, etc.) y adapta las recomendaciones. 4 fases: audit → recommend → implement → validate. Usa context7 para obtener documentacion actualizada del framework detectado.
license: MIT
compatibility: Funciona con cualquier app web. Detecta automaticamente React, Vue, Angular, Svelte, Next.js, Nuxt, SvelteKit, Solid, Vanilla JS, y otros. Lee codigo existente y lo modifica in-place sin regenerar la app. No requiere project.config.js ni estructura especifica.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
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
    methods:
      - "package.json dependencies"
      - "tsconfig / vite.config / next.config / nuxt.config"
      - "CDN scripts en <head>"
      - "import/require statements en JS/TS"
      - "extension de archivos (.jsx, .tsx, .vue, .svelte, .cshtml)"
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
---

# SKILL: ux-ui-universal (Refactorizacion UX/UI Multi-Stack)

> **Proposito**: Mejorar la experiencia de usuario y apariencia visual de cualquier app web, independientemente del framework o stack. Detecta automaticamente el stack, adapta las recomendaciones, y aplica cambios in-place.
> **Modo**: 4 fases secuenciales | **Idioma**: ES | **Contexto**: Cualquier app web
> **Input**: Codigo fuente existente (cualquier estructura)
> **Output**: Archivos modificados in-place + reporte de cambios en `docs/refactor-[app].md`

---

## REGLAS FUNDAMENTALES

1. **NO regenerar la app** — trabajas sobre el codigo existente, editandolo in-place
2. **NO tocar logica de negocio** — solo UI: plantillas, CSS, clases, atributos, estructura DOM, ARIA, colores, tipografia
3. **SI adaptar al stack detectado** — cada framework tiene sus propias convenciones (JSX, templates, directivas, etc.)
4. **SI usar context7** para obtener documentacion actualizada del framework detectado (APIs, patrones, version reciente)
5. **SI orquestar** skills de patrones (form-patterns, modal-patterns, etc.) y MCPs (a11y, refero-styles, context7) como oraculos de consulta
6. **Validar con Lighthouse + a11y MCP** al final

## CUANDO ACTIVARSE

El usuario dice frases como:
- "mejorar la UI de [app]"
- "cambiar el diseño de [app]"
- "hacer mas bonito [app]"
- "refactorizar la interfaz de [app]"
- "aplicar diseño profesional a [app]"
- "auditar UX de [app]"
- "mejorar aspecto visual de [app]"
- "refactorizar UI de [proyecto]"

---

## FASE 1: AUDITORIA

```
[▓▓▓▓░░░░░░░░░░░░] 25% • Detectando stack y auditando UX/UI...
(stack detection + audit-checklist + a11y MCP + refero-styles + context7)
```

### Paso 1.1 — Detectar stack y explorar proyecto
Lee la estructura del proyecto para detectar automaticamente el framework:

**Indicios de stack:**
| Señal | Stack probable |
|-------|---------------|
| `package.json` con `react`, `next` | React / Next.js |
| `.jsx` / `.tsx` files | React / Solid |
| `package.json` con `vue`, `nuxt` | Vue / Nuxt |
| `.vue` files + `<template>` | Vue |
| `angular.json`, `@angular/core` | Angular |
| `.component.ts` + decorator `@Component` | Angular |
| `.svelte` files + `$:` | Svelte |
| `solid-js` o `.jsx` con `<For>` | Solid |
| Sin framework, imports vanilla | Vanilla JS |
| `vendor/`, `plugins/`, `<script>` tags | WordPress / CMS |

Para confirmar o resolver dudas, usa **context7**: `ctx7 resolve-library-id` con el nombre del candidato.

### Paso 1.2 — Identificar estructura de archivos
Busca los archivos clave de UI segun el stack detectado:

**React/Next:** `pages/`, `app/`, `src/components/`, `src/app.jsx`
**Vue/Nuxt:** `pages/`, `components/`, `layouts/`, `App.vue`
**Angular:** `src/app/`, `*.component.html`, `*.component.ts`
**Svelte:** `src/routes/`, `src/lib/`, `*.svelte`
**Vanilla:** `index.html`, `js/`, `css/`, `src/`

### Paso 1.3 — Ejecutar auditoria sistematica
Usa `references/audit-checklist.md` para revisar cada aspecto:

1. **Inspeccion visual** — Abre la app en navegador (si disponible) o revisa el HTML/plantillas
2. **Inspeccion de codigo** — Busca clases, atributos, estructura en los archivos detectados
3. **A11y check** — Usa MCP de accesibilidad para verificar contraste, roles, ARIA
4. **Stack check** — Verifica que el codigo siga las convenciones del framework detectado
5. **Refero match** — Si aplica, usa refero-styles para encontrar paletas de marca reales
6. **Context7 refresh** — Si hay dudas sobre buenas practicas del stack, consulta context7

Seccion 7 del checklist: generala dinamicamente basandote en el stack detectado.

### Paso 1.4 — Compilar reporte de auditoria
Genera un resumen estructurado:

```
📋 REPORTE DE AUDITORIA UX/UI — [app]

Stack detectado: React 19 + Next.js 15 + Tailwind CSS

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
📊 Auditoria completa. Stack: [framework]. Encontrados [N] items (X criticos, Y altos).
¿Procedo con FASE 2: Recomendacion detallada?
[1] Si, continuar
[2] Mostrar solo criticos/altos
[3] Cancelar
```

---

## FASE 2: RECOMENDACION

```
[▓▓▓▓▓▓▓▓░░░░░░░░] 50% • Generando plan de accion adaptado al stack...
(pattern-matrix + refero-styles + context7)
```

### Paso 2.1 — Seleccionar patrones aplicables
Para cada item de la auditoria, consulta `references/pattern-matrix.md` para determinar que patron/es aplicar.

Usa la columna correspondiente al **stack detectado** para obtener ejemplos concretos.

### Paso 2.2 — Refrescar con context7 (si aplica)
Para frameworks populares, usa context7 para verificar que los patrones y APIs sugeridos esten actualizados:

```
context7_resolve-library-id(query="React focus trap modal 2026", libraryName="react")
→ ID: /facebook/react
→ Query docs: "How to implement focus trap with useFocusTrap in React"
→ Ajusta recomendacion si la API cambio
```

Casos donde usar context7 siempre:
- APIs de animacion/transicion del framework
- Manejo de formularios y validacion
- Patrones de modales/dialogos
- Atajos de teclado
- Drag and drop

### Paso 2.3 — Consultar oraculos de patrones (si aplica)
Para items especificos, carga la skill de patron correspondiente:
- **Layout**: page-structure-patterns
- **Navegacion**: navigation-patterns
- **Formularios**: form-patterns
- **Modales**: modal-patterns
- **Listas**: list-page-patterns
- **Detalle**: detail-page-patterns
- **Micro-interacciones**: interaction-patterns, toast-notification-patterns
- **Datos densos**: data-density-patterns, status-visualization-patterns
- **Responsive**: mobile-responsive-ux
- **Accesibilidad**: wcag-accessibility + a11y MCP
- **Diseno visual**: visual-design-system + refero-styles MCP

No dupliques el contenido de la skill — usala como referencia y adapta sus recomendaciones al contexto del framework detectado.

### Paso 2.4 — Construir plan de accion detallado
Para cada item a corregir, especifica:

```
### [N] — [titulo del cambio]
**Stack**: [framework detectado]
**Archivo**: `ruta/al/archivo`
**Lineas**: ~[lineas a modificar]
**Patron**: [nombre del patron]
**Context7 usado**: [Si/No — que se consulto]
**Cambio concreto**:
- Reemplazar `[codigo actual]` por `[codigo nuevo]`
- Agregar `[nuevo codigo]`
- Eliminar `[codigo a eliminar]`
**Impacto**: [bajo/medio/alto] — [explicacion]
```

### Paso 2.5 — Mostrar plan y esperar confirmacion
```
📋 PLAN DE ACCION — [app]

Stack: React 19 + Next.js 15

Prioridad 1 - Criticos (N items):
  [1.1] [titulo] — [archivo]
  [1.2] [titulo] — [archivo]

Prioridad 2 - Altos (N items):
  [2.1] [titulo] — [archivo]

Prioridad 3 - Medios (N items):
  [3.1] [titulo] — [archivo]

Prioridad 4 - Bajos (N items):
  [4.1] [titulo] — [archivo]

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
(patrones aplicados + edits directos al codigo)
```

### Paso 3.1 — Aplicar cambios por archivo
Procesa las modificaciones en orden de prioridad (critico → alto → medio → bajo). Para cada cambio:

1. **Lee el archivo** actual (estado mas reciente)
2. **Aplica la edicion** con las herramientas de edicion
3. **Verifica** que el cambio sea correcto sintacticamente segun el stack
4. **Pasa al siguiente** sin esperar confirmacion (a menos que el cambio sea ambiguo)

**Reglas de implementacion segun stack:**

**React/Next:**
- Componentes JSX/TSX: modifica JSX, className, style objects
- No uses dangerouslySetInnerHTML
- Estado local con hooks (no this.setState)
- Tailwind CSS: modifica strings className

**Vue/Nuxt:**
- Templates .vue: modifica template + script setup
- Usa `v-bind`, `v-if`, `v-for` segun el patron
- No toques composables de negocio
- `<script setup>` es el estandar moderno

**Angular:**
- Templates HTML: modifica directivas estructurales, bindings, clases
- Component TS: modifica template, styles, host
- No toques servicios, guards, resolvers
- Standalone components es el estandar actual

**Svelte/SvelteKit:**
- Archivos .svelte: modifica markup, styles, reactive declarations
- No toques load functions ni stores de negocio

**Vanilla:**
- Modifica HTML + CSS + JS directamente
- Usa classList, textContent, createElement (no innerHTML)
- Event delegation para listas

### Paso 3.2 — Aplicar refero-styles (opcional)
Si en FASE 2 se selecciono un estilo de refero-styles:
1. Carga `refero_get_design_md` para el estilo seleccionado
2. Extrae paleta de colores
3. Aplica variables CSS en el archivo de estilos principal
4. Ajusta clases de componentes segun corresponda

### Paso 3.3 — Reporte de cambios aplicados
```
✅ [3/15] • [titulo del cambio] — [archivo] — OK
✅ [4/15] • [titulo del cambio] — [archivo] — OK
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

### Paso 4.3 — Stack-specific validation
Verifica que los cambios respeten las convenciones del framework:
- React: sin referencias a variables no definidas, keys en listas
- Vue: directivas correctas, sin referencias rotas
- Angular: binding syntax correcto
- General: sin console.log, sin importaciones rotas

### Paso 4.4 — Generar reporte final
Guarda el reporte completo en `docs/refactor-[app].md`:

```
# Reporte de Refactorizacion UX/UI — [app]

Fecha: [fecha]
Skill: ux-ui-universal v1.0
App: [nombre]
Stack: [framework + version]
Archivos modificados: [N]

## Cambios realizados

### Criticos (N)
- [x] [item] — resuelto
- [ ] [item] — pendiente (razon)

### Altos (N)
- [x] [item] — resuelto

### Medios (N)
- [x] [item] — resuelto

### Bajos (N)
- [x] [item] — resuelto

## Diseno referente
[estilo] de refero.design

## Resultados validacion
- Lighthouse accessibility: [score]
- Lighthouse best practices: [score]
- Lighthouse SEO: [score]
- Items checklist verificados: [N/M]
- Stack conventions: OK / [observaciones]

## Screenshots
[antes.png] [despues.png] (si se tomaron)
```

### Paso 4.5 — Resumen final
```
✅ REFACTORIZACION COMPLETADA — [app]

Stack: [framework]
Archivos modificados: [N]
Items corregidos: [N] (Criticos: [N], Altos: [N], Medios: [N])
Lighthouse a11y: [antes → despues]
Reporte: docs/refactor-[app].md

💡 Tip: Revisa la app en el navegador para confirmar los cambios.
Si algo no se ve bien, puedo ajustarlo.
```
