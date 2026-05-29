# Matriz de Patrones UX: Problema → Remedio

Guia para seleccionar que patron aplicar segun el problema detectado
durante la auditoria (FASE 1). Se usa en FASE 2 para construir el plan.

## Problemas de Layout

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Sin estados loading/empty/error | page-structure-patterns | Estados: loading skeleton, empty state con icono, error state con retry |
| Layout no responsive | mobile-responsive-ux | Touch targets 44px, grid cols responsive, overflow-x-auto |
| Scroll horizontal en mobile | page-structure-patterns | `max-w-full overflow-hidden`, responsive images |
| Header/footer mal estructurados | page-structure-patterns | App shell: header sticky, main scroll, footer |
| Sidebar no colapsa en mobile | navigation-patterns | Drawer movil, hamburguesa, overlay |

## Problemas de Navegacion

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Sin indicador de ruta activa | navigation-patterns, list-page-patterns | Active state, breadcrumbs, tabs |
| Transiciones bruscas entre modulos | interaction-patterns | Fade entre modulos, loading skeleton |
| Breadcrumbs faltantes en detalle | detail-page-patterns | Breadcrumb trail, back button |
| Sin navegacion por teclado | keyboard-shortcuts-patterns | Atajos, paleta Cmd+K, focus management |

## Problemas de Componentes

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Formularios sin validacion inline | form-patterns | error message bajo input, focus:ring, required marker |
| Modales sin focus trap | modal-patterns | x-trap.inert, Escape close, backdrop |
| Listas sin paginacion/filtros | list-page-patterns | Paginacion, busqueda, ordenar, filtros |
| Detalle sin tabs/sections | detail-page-patterns | Tabs, metadata grid, related data |
| Tarjetas de informacion pobres | info-card-patterns | Compact/standard/expanded views |
| Tablas densas dificiles de leer | data-density-patterns | striped rows, sticky header, condensed mode |
| Sin comparacion lado a lado | comparison-patterns | Side-by-side, diff highlighting |

## Problemas de Micro-Interacciones

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Botones sin loading state | interaction-patterns | `btn btn-primary loading`, spinner inline |
| Sin toasts en operaciones CRUD | toast-notification-patterns | Posicion, duracion, stacking, tipos |
| Sin confirmacion en delete | modal-patterns | Confirm dialog, undo toast |
| Drag and drop no implementado | drag-drop-patterns | Zonas de drop, feedback visual |
| Transiciones ausentes o bruscas | interaction-patterns | x-transition, Animate.css escalonado |
| Feedback de hover/focus insuficiente | interaction-patterns | hover states, focus ring, cursor pointer |

## Problemas de Accesibilidad

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Contraste insuficiente | visual-design-system, wcag-accessibility | Paleta WCAG AA, colores semanticos |
| Roles ARIA faltantes | wcag-accessibility | ARIA en modales, tabs, alerts |
| Sin skip link / focus visible | wcag-accessibility | Skip link, outline visible |
| Labels de formulario ausentes | form-patterns, wcag-accessibility | `for`, `aria-label`, `sr-only` |
| Mensajes no anunciados a SR | wcag-accessibility | `aria-live`, `role="alert"` |

## Problemas de Visual / Diseno

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Paleta inconsistente o fea | design-ux-intelligence + refero-styles | Paleta de marca real, variables CSS |
| Tipografia sin jerarquia | visual-design-system | Type scale, line-height, weights |
| Espaciado irregular | visual-design-system | Sistema 8px, gap/padding consistente |
| Modo oscuro faltante | page-structure-patterns | `data-theme`, toggle, colores ambos modos |
| Sin iconografia consistente | design-ux-intelligence | Bootstrap Icons, mismos estilos |
| Animaciones excesivas o lentas | interaction-patterns | `prefers-reduced-motion`, duracion 200-300ms |

## Problemas de Datos Densos

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Dashboard con muchos widgets | data-density-patterns, status-visualization-patterns | Grid denso, z-index, scroll sections |
| Muchos datos en una tabla | data-density-patterns, list-page-patterns | Paginacion, filtros, sticky header |
| Timeline de eventos larga | event-timeline-patterns, playback-replay-patterns | Timeline visual, agrupacion, scroll |
| Status/health de multiples items | status-visualization-patterns | Badges, health bars, indicadores color |

## Problemas de Juego / Turnos

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| UI de juego por turnos | turn-based-ui-patterns | Fase banner, barra de accion, historial |
| Canvas/grid interactivo | canvas-grid-patterns | Grid, zoom, pan, seleccion |
| Controles VCR/replay | playback-replay-patterns | Play/pause, timeline, velocidad |

## Problemas de Editor / Workspace

| Problema | Patron a aplicar | Referencia |
|----------|-----------------|------------|
| Editor multi-pestana | editor-workspace-patterns | Tabs, dirty state, undo/redo |
| Panel dividido redimensionable | split-panel-patterns | Divisor, multi-panel, persistencia |
| Validacion en tiempo real | editor-workspace-patterns | Inline errors, lint, auto-save |

## Prioridad de aplicacion

1. **Critico**: Violaciones de stack (CDNs, imports, cifrado) — stack-compliance-guard
2. **Alto**: Layout roto, sin estados, sin loading, sin accesibilidad basica
3. **Medio**: Micro-interacciones, transiciones, responsive refinado
4. **Bajo**: Pulido visual, animaciones extra, variaciones de tema
