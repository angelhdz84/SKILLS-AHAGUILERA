# Matriz de Patrones UX: Problema → Patrón → context7 Query

Guia para seleccionar que patron aplicar segun el problema detectado
durante la auditoria (FASE 1). Se usa en FASE 2 para construir el plan.

Cada fila indica que patron de referencia cargar y que query usar en
**context7** para obtener codigo actualizado segun el stack detectado.

## Problemas de Layout

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Sin estados loading/empty/error | page-structure-patterns | "loading skeleton empty state pattern [framework] [version]" |
| Layout no responsive | mobile-responsive-ux | "responsive layout breakpoints [framework]" |
| Scroll horizontal en mobile | page-structure-patterns | "prevent horizontal overflow [framework]" |
| Header/footer mal estructurados | page-structure-patterns | "sticky header footer layout [framework]" |
| Sidebar no colapsa en mobile | navigation-patterns | "collapsible sidebar responsive drawer [framework]" |

## Problemas de Navegacion

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Sin indicador de ruta activa | navigation-patterns | "active route indicator [framework]" |
| Transiciones bruscas entre rutas | interaction-patterns | "page transition animation route change [framework]" |
| Breadcrumbs faltantes en detalle | detail-page-patterns | "breadcrumb component [framework]" |
| Sin navegacion por teclado | keyboard-shortcuts-patterns | "keyboard shortcuts hotkeys [framework]" |

## Problemas de Componentes

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Formularios sin validacion inline | form-patterns | "form validation inline error [framework] [version]" |
| Modales sin focus trap | modal-patterns | "modal dialog focus trap [framework] [version]" |
| Listas sin paginacion/filtros | list-page-patterns | "table pagination search filter [framework]" |
| Detalle sin tabs/sections | detail-page-patterns | "tab component navigation [framework]" |
| Tarjetas de informacion pobres | info-card-patterns | "card component design pattern [framework]" |
| Tablas densas dificiles de leer | data-density-patterns | "data table sticky header striped rows [framework]" |
| Sin comparacion lado a lado | comparison-patterns | "side by side comparison diff [framework]" |

## Problemas de Micro-Interacciones

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Botones sin loading state | interaction-patterns | "loading button spinner disabled state [framework]" |
| Sin toasts en operaciones CRUD | toast-notification-patterns | "toast notification snackbar [framework] [version]" |
| Sin confirmacion en delete | modal-patterns | "delete confirmation dialog [framework]" |
| Drag and drop no implementado | drag-drop-patterns | "drag and drop [framework] [version]" |
| Transiciones ausentes o bruscas | interaction-patterns | "css transition animation library [framework]" |
| Feedback hover/focus insuficiente | interaction-patterns | "hover focus visible styles best practice" |

## Problemas de Accesibilidad

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Contraste insuficiente | wcag-accessibility | "WCAG AA color contrast ratio tool" |
| Roles ARIA faltantes | wcag-accessibility | "ARIA roles modal tab dialog [framework]" |
| Sin skip link / focus visible | wcag-accessibility | "skip link focus visible outline [framework]" |
| Labels de formulario ausentes | form-patterns, wcag-accessibility | "form label aria-label accessibility [framework]" |
| Mensajes no anunciados a SR | wcag-accessibility | "aria-live role alert screen reader [framework]" |

## Problemas de Visual / Diseno

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Paleta inconsistente | refero-styles MCP | (usar refero-styles, no context7) |
| Tipografia sin jerarquia | visual-design-system | "type scale hierarchy CSS best practice" |
| Espaciado irregular | visual-design-system | "CSS spacing system 8px grid" |
| Modo oscuro faltante | visual-design-system | "dark mode CSS custom properties toggle" |
| Animaciones excesivas o lentas | interaction-patterns | "prefers-reduced-motion CSS animation performance" |

## Problemas de Datos Densos / Juego / Editor

| Problema | Patron | context7 query base |
|----------|--------|---------------------|
| Dashboard con muchos widgets | data-density-patterns, status-visualization-patterns | "dashboard grid layout overview cards" |
| Timeline de eventos larga | event-timeline-patterns | "event timeline component [framework]" |
| UI de juego por turnos | turn-based-ui-patterns | "turn based game UI phase system" |
| Canvas/grid interactivo | canvas-grid-patterns | "canvas grid zoom pan selection" |
| Editor multi-pestana | editor-workspace-patterns | "multi tab editor workspace dirty state" |
| Panel dividido redimensionable | split-panel-patterns | "resizable split panel [framework]" |

## Como usar esta matriz

1. Identifica el problema en la auditoria (FASE 1)
2. Busca el problema en esta matriz
3. Toma el **Patron** y carga esa skill como referencia teorica
4. Toma la **context7 query base** y completala con `[framework]` `[version]` detectados
5. Llama a context7 con la query completa para obtener codigo actualizado
6. Adapta el resultado al archivo concreto detectado en la auditoria
