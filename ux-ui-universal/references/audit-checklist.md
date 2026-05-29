# Checklist de Auditoria UX/UI Universal

Este checklist se usa en la FASE 1 de ux-ui-universal para inspeccionar
una app existente y detectar que mejorar, independientemente del stack.
Cada item incluye:
- Que buscar (patron concreto)
- Donde buscarlo (archivo tipico)
- Severidad (critico/alto/medio/bajo)
- Remedio (patron a aplicar)

## 1. Layout y Estructura

### 1.1 Viewport y altura
- [ ] Meta viewport correcto: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] Altura minima usable en movil (evitar `100vh` en iOS Safari — usar `100dvh` o `100%`)
- [ ] Contenedor responsivo con max-width y padding lateral
- [ ] Sin scroll horizontal en viewport movil (320px)

### 1.2 Estados de pantalla
- [ ] Estado loading (skeleton, spinner o shimmer) en cada seccion que carga datos
- [ ] Estado empty (icono + mensaje + CTA) en cada lista
- [ ] Estado error (alerta + boton reintentar) en operaciones async
- [ ] Offline indicator (banner o toast cuando no hay conexion)

### 1.3 Responsive
- [ ] Layout con CSS Grid o Flexbox, no tablas de layout
- [ ] Puntos de quiebra para mobile/tablet/desktop (ej: 640px, 768px, 1024px)
- [ ] Tablas responsivas (overflow-x-auto o card-view en mobile)
- [ ] Touch targets >= 44px (WCAG 2.5.8)
- [ ] Sin elementos fijos que solapen contenido en mobile

## 2. Estados y Feedback

### 2.1 Feedback de acciones
- [ ] Botones tienen loading/disabled state durante operaciones async
- [ ] Toast/notificacion en exito/error de cada operacion CRUD
- [ ] Confirmacion antes de acciones destructivas (modal dialog)
- [ ] Deshabilitar boton durante envio para evitar doble submit

### 2.2 Transiciones y animaciones
- [ ] Transiciones suaves en modales, drawers, dropdowns
- [ ] Animaciones de entrada en listas (fadeIn, slideIn)
- [ ] Sin animaciones en top/left/width/height — solo transform + opacity
- [ ] `prefers-reduced-motion` respetado

### 2.3 Estados hover/focus/active
- [ ] `hover:` en elementos interactivos
- [ ] `focus:` visible en inputs y botones
- [ ] `cursor: pointer` en elementos clickeables
- [ ] Active/selected state en navegacion

## 3. Consistencia Visual

### 3.1 Sistema de diseño
- [ ] Paleta de colores consistente (primario, secundario, exito, error, warning)
- [ ] Botones con variantes semanticas (primario, secundario, ghost, peligro)
- [ ] Cards con estructura consistente (header, body, footer)
- [ ] Inputs con borde, foco y error state
- [ ] Espaciado consistente (sistema 4px/8px)

### 3.2 Tema y modo oscuro
- [ ] Variables CSS definidas para modo claro/oscuro
- [ ] Toggle de tema funcional
- [ ] Colores semanticos (--color-text, --color-bg, --color-primary)

### 3.3 Tipografia
- [ ] Jerarquia clara: h1, h2, h3 con tamaños definidos
- [ ] Line-height legible (1.5 body, 1.2 headings)
- [ ] Contraste suficiente en todos los tamaños
- [ ] Sin mas de 2 familias tipograficas

## 4. Navegacion y Componentes

### 4.1 Navegacion
- [ ] Indicador de ruta/pagina activa
- [ ] Breadcrumbs en paginas de detalle
- [ ] Back button o navegacion hacia atras funcional
- [ ] Transicion suave entre rutas/vistas

### 4.2 Formularios
- [ ] Labels visibles y asociados (`for` / `aria-label` / `aria-labelledby`)
- [ ] Validacion inline (mensaje de error bajo cada campo)
- [ ] Errores de servidor mostrados en formulario
- [ ] Campos requeridos marcados (*)
- [ ] Autocomplete en campos comunes (email, nombre, direccion)

### 4.3 Modales y dialogos
- [ ] Focus trap activo
- [ ] Cierre con Escape y click en backdrop
- [ ] Scroll bloqueado en body cuando modal abierto
- [ ] Animacion de entrada/salida
- [ ] `aria-modal="true"` y `role="dialog"`

### 4.4 Listas y tablas
- [ ] Paginacion o scroll infinito
- [ ] Filtros y busqueda visibles
- [ ] Ordenamiento por columnas (opcional)
- [ ] Seleccion multiple (si aplica)
- [ ] Estados alternados (striped rows) en tablas densas

## 5. Accesibilidad (WCAG 2.2 AA)

### 5.1 Contraste
- [ ] Contraste texto/fondo >= 4.5:1 (normal) o 3:1 (grande)
- [ ] Contraste en estados hover/focus/active
- [ ] Iconos con color suficiente contraste

### 5.2 ARIA y semantica
- [ ] Roles ARIA en componentes interactivos (modal, tab, alert, dialog)
- [ ] `aria-label` en iconos sin texto
- [ ] `aria-expanded` en dropdowns y accordions
- [ ] `aria-current="page"` en navegacion activa
- [ ] Landmarks: `<nav>`, `<main>`, `<header>`, `<footer>`

### 5.3 Teclado
- [ ] Tab order logico (tabindex)
- [ ] Skip link al inicio de la pagina
- [ ] Focus visible (no `outline: none` sin alternativa)
- [ ] Navegacion por flechas en menus, tabs, listas

### 5.4 Screen readers
- [ ] `sr-only` / `visually-hidden` para texto informativo solo para lectores
- [ ] Mensajes de error anunciados (`aria-live="assertive"` / `role="alert"`)
- [ ] Cambios de contenido anunciados (`aria-live="polite"`)
- [ ] `<title>` descriptivo por pagina

## 6. Rendimiento

### 6.1 Carga
- [ ] Lazy loading en imagenes (`loading="lazy"`)
- [ ] Code splitting / chunking (si aplica)
- [ ] Sin render blocking excesivo
- [ ] Compresion habilitada (si aplica)

### 6.2 Runtime
- [ ] Sin re-renders innecesarios (React: keys, useMemo; Vue: computed; Angular: OnPush)
- [ ] Bundle size razonable para el tipo de app
- [ ] Sin memory leaks (event listeners, intervals, subscriptions limpiados)
- [ ] Core Web Vitals aceptables (LCP < 2.5s, FID < 100ms, CLS < 0.1)

## 7. Framework-specific (Dinamico)

Esta seccion se completa segun el stack detectado en FASE 1.

### 7.1 React / Next.js
- [ ] Componentes funcionales, no clases (excepto Error Boundary)
- [ ] Hooks con dependencias correctas (useEffect, useMemo, useCallback)
- [ ] Keys unicas y estables en listas
- [ ] Estado global manejado (Context, Zustand, Redux) sin prop drilling excesivo
- [ ] Server vs Client Components correctos (Next.js App Router)

### 7.2 Vue / Nuxt
- [ ] Composition API (no Options API obsoleto)
- [ ] Reactividad correcta (ref, reactive, computed)
- [ ] `:key` en `v-for`
- [ ] Transiciones con `<Transition>` / `<TransitionGroup>`
- [ ] Componentes lazy (`defineAsyncComponent`)

### 7.3 Angular
- [ ] Standalone components (no NgModules legacy)
- [ ] ChangeDetectionStrategy.OnPush en componentes de presentacion
- [ ] `trackBy` en `*ngFor`
- [ ] Async pipe en lugar de subscribe manual
- [ ] Signals donde aplicable

### 7.4 Svelte / SvelteKit
- [ ] Reactividad con `$:` o `$state` (runes en Svelte 5)
- [ ] Stores para estado compartido
- [ ] Load functions en SvelteKit
- [ ] Transiciones con `transition:`, `in:`, `out:`

### 7.5 Vanilla JS
- [ ] Sin innerHTML para contenido dinamico (usar textContent + createElement)
- [ ] Event delegation en listas
- [ ] No fugas de memoria (removeEventListener en destroy)
- [ ] Web Components con Shadow DOM (si se usan)

## Severidad

| Severidad | Significado | Accion |
|-----------|-------------|--------|
| Critico | Rompe funcionalidad o viola accesibilidad | Corregir obligatorio |
| Alto | UX deficiente o problema de rendimiento notable | Corregir recomendado |
| Medio | Mejora visual o de interaccion | Corregir si aplica |
| Bajo | Nice-to-have, refinamiento | Sugerir, no bloquear |
