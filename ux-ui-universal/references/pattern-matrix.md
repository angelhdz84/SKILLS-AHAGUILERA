# Matriz de Patrones UX: Problema → Remedio (Multi-Stack)

Guia para seleccionar que patron aplicar segun el problema detectado
durante la auditoria (FASE 1). Se usa en FASE 2 para construir el plan.
Los ejemplos por stack son referencias — el LLM debe actualizarlos con
context7 si detecta el framework correspondiente.

## Problemas de Layout

| Problema | Patron | React / Next | Vue / Nuxt | Angular | Vanilla JS |
|----------|--------|-------------|------------|---------|------------|
| Sin estados loading/empty/error | page-structure-patterns | Conditional render + spinner component | v-if con skeleton | *ngIf else + ng-template | class toggle + DOM manipulation |
| Layout no responsive | mobile-responsive-ux | Tailwind / CSS Grid + media queries | Igual | Igual | Igual |
| Scroll horizontal en mobile | page-structure-patterns | `overflow-x-hidden` + `max-width: 100%` | Igual | Igual | Igual |
| Header/footer mal estructurados | page-structure-patterns | Layout component con sticky header | Layout slots + `<RouterView>` | `app-header` + `app-footer` components | fixed/sticky position |
| Sidebar no colapsa en mobile | navigation-patterns | Drawer component + overlay | `<Transition>` + v-if sidebar | Sidebar component + backdrop | CSS class toggle + event listener |

## Problemas de Navegacion

| Problema | Patron | React / Next | Vue / Nuxt | Angular | Vanilla JS |
|----------|--------|-------------|------------|---------|------------|
| Sin indicador de ruta activa | navigation-patterns | `usePathname()` + active class | `router-link-active` + `router-link-exact-active` | `routerLinkActive` directive | hash-based listener + class toggle |
| Transiciones bruscas entre rutas | interaction-patterns | framer-motion AnimatePresence | `<Transition>` wrapping router-view | Router outlet animations | CSS transitions on route change |
| Breadcrumbs faltantes en detalle | detail-page-patterns | Breadcrumb component basado en ruta | `<Breadcrumb>` + useRoute | Breadcrumb con Router | Array en URL hash + DOM |
| Sin navegacion por teclado | keyboard-shortcuts-patterns | useHotkeys / react-hotkeys-hook | `v-on:keydown` | HostListener o @HostBinding | keydown event listener global |

## Problemas de Componentes

| Problema | Patron | React / Next | Vue / Nuxt | Angular | Vanilla JS |
|----------|--------|-------------|------------|---------|------------|
| Formularios sin validacion inline | form-patterns | react-hook-form + zod | VeeValidate + yup | ReactiveForms + Validators | Constraint Validation API + CSS |
| Modales sin focus trap | modal-patterns | `useFocusTrap` + `aria-modal` | `<Teleport to="body">` + focus-trap | CDK FocusTrap | `tabindex` loop + keydown listener |
| Listas sin paginacion/filtros | list-page-patterns | TanStack Query + pagination | VueUse + computed filter | Angular CDK pagination | Event delegation + array slice |
| Detalle sin tabs/sections | detail-page-patterns | Tab component con estado local | `<Tabs>` con v-model | Angular Material tabs | Button group + show/hide |
| Tarjetas de informacion pobres | info-card-patterns | Card component con props | Card con slots | Card @Input | Template clone |
| Tablas densas dificiles de leer | data-density-patterns | TanStack Table + sticky header | vue-good-table | Angular CDK Table | position: sticky + nth-child |
| Sin comparacion lado a lado | comparison-patterns | Flexbox grid + diff state | v-for + v-if comparison | CSS Grid + *ngFor | Flexbox + event handlers |

## Problemas de Micro-Interacciones

| Problema | Patron | React / Next | Vue / Nuxt | Angular | Vanilla JS |
|----------|--------|-------------|------------|---------|------------|
| Botones sin loading state | interaction-patterns | `useState` + `disabled` + spinner | `ref` + `:disabled` | `(click)` + `[disabled]` + spinner | `classList.add('loading')` + `disabled` |
| Sin toasts en operaciones CRUD | toast-notification-patterns | react-hot-toast / Sonner | vue3-toastify | Angular Material Snackbar | Custom toast position fixed |
| Sin confirmacion en delete | modal-patterns | window.confirm o modal custom | window.confirm o modal | MatDialog confirm | confirm() dialog o modal |
| Drag and drop no implementado | drag-drop-patterns | @hello-pangea/dnd | vuedraggable | Angular CDK DragDrop | HTML5 Drag and Drop API |
| Transiciones ausentes o bruscas | interaction-patterns | framer-motion / CSS transitions | `<Transition>` + `<TransitionGroup>` | Angular animations | CSS transitions + keyframes |
| Feedback hover/focus insuficiente | interaction-patterns | `:hover` + `:focus-visible` CSS | Igual | Igual | Igual |

## Problemas de Accesibilidad

| Problema | Patron | Remedio (generico) |
|----------|--------|---------------------|
| Contraste insuficiente | wcag-accessibility, visual-design-system | Ajustar paleta a ratios WCAG AA (4.5:1 texto, 3:1 grande) |
| Roles ARIA faltantes | wcag-accessibility | Añadir `role`, `aria-*` segun patron (modal, tab, alert) |
| Sin skip link / focus visible | wcag-accessibility | Skip link al inicio, `:focus-visible` en todos los elementos |
| Labels de formulario ausentes | form-patterns, wcag-accessibility | `<label for="">`, `aria-label`, `aria-labelledby` |
| Mensajes no anunciados a SR | wcag-accessibility | `aria-live="polite/assertive"`, `role="alert"`, `role="status"` |
| Sin estructura de headings | wcag-accessibility | Jerarquia h1 > h2 > h3 sin saltos |
| Tabla sin `<th>` / scope | wcag-accessibility | `<th scope="col/row">` en encabezados |

## Problemas de Visual / Diseno

| Problema | Patron | Remedio (generico) |
|----------|--------|---------------------|
| Paleta inconsistente o fea | refero-styles MCP | Obtener paleta de marca real desde refero.design, aplicar CSS variables |
| Tipografia sin jerarquia | visual-design-system | Type scale: 1rem body, 1.25rem h3, 1.5rem h2, 2rem h1 |
| Espaciado irregular | visual-design-system | Sistema 8px: espaciados multiples de 8 (8, 16, 24, 32, 48) |
| Modo oscuro faltante | visual-design-system | CSS custom properties + media query prefers-color-scheme + toggle |
| Sin iconografia consistente | visual-design-system | Una sola libreria de iconos (Bootstrap Icons, Lucide, Heroicons, Phosphor) |
| Animaciones excesivas o lentas | interaction-patterns | `prefers-reduced-motion`, duracion 200-300ms, solo transform+opacity |

## Problemas de Datos Densos

| Problema | Patron | Referencia |
|----------|--------|------------|
| Dashboard con muchos widgets | data-density-patterns, status-visualization-patterns | Grid denso, z-index, scroll sections |
| Muchos datos en una tabla | data-density-patterns, list-page-patterns | Paginacion, filtros, sticky header |
| Timeline de eventos larga | event-timeline-patterns, playback-replay-patterns | Timeline visual, agrupacion, scroll virtual |
| Status/health de multiples items | status-visualization-patterns | Badges, health bars, indicadores color |

## Problemas de Juego / Turnos

| Problema | Patron | Referencia |
|----------|--------|------------|
| UI de juego por turnos | turn-based-ui-patterns | Fase banner, barra de accion, historial |
| Canvas/grid interactivo | canvas-grid-patterns | Grid, zoom, pan, seleccion |
| Controles VCR/replay | playback-replay-patterns | Play/pause, timeline, velocidad |

## Problemas de Editor / Workspace

| Problema | Patron | Referencia |
|----------|--------|------------|
| Editor multi-pestana | editor-workspace-patterns | Tabs, dirty state, undo/redo |
| Panel dividido redimensionable | split-panel-patterns | Divisor, multi-panel, persistencia |
| Validacion en tiempo real | editor-workspace-patterns | Inline errors, lint, auto-save |

## Prioridad de aplicacion

1. **Critico**: Layout roto, sin estados, sin accesibilidad basica, memory leaks
2. **Alto**: Micro-interacciones faltantes, responsive deficiente, contraste insuficiente
3. **Medio**: Transiciones, pulido visual, modo oscuro
4. **Bajo**: Animaciones extra, micro-refinamientos, variaciones de tema
