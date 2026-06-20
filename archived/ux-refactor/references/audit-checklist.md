# Checklist de Auditoria UX/UI para Apps Offline-First

Este checklist se usa en la FASE 1 de ux-refactor para inspeccionar
una app existente y detectar que mejorar. Cada item incluye:
- Que buscar (patron concreto)
- Donde buscarlo (archivo tipico)
- Severidad (critico/alto/medio/bajo)
- Remedio (skill o patron a aplicar)

## 1. Layout y Estructura

### 1.1 Viewport y altura
- [ ] Usa `min-h-[100dvh]` en vez de `h-screen` (movil: barra navegacion dinamica)
- [ ] Meta viewport correcto: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] Contenedor responsivo: `max-w-6xl mx-auto px-4` o similar
- [ ] Sin scroll horizontal en viewport movil (320px)

### 1.2 Estados de pantalla
- [ ] Estado loading (skeleton o spinner) en cada modulo
- [ ] Estado empty (icono + mensaje + CTA) en cada lista
- [ ] Estado error (alerta + boton reintentar) en operaciones async
- [ ] Offline banner: `x-show="!$store.network?.online"`

### 1.3 Responsive
- [ ] Grid usa `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (o similar)
- [ ] Tablas responsivas (overflow-x-auto o card-view en mobile)
- [ ] Touch targets >= 44px
- [ ] Sin elementos fijos que solapen contenido en mobile

## 2. Sistema de Diseno

### 2.1 Consistencia visual
- [ ] Botones usan `btn btn-primary` / `btn-ghost` / `btn-outline` (DaisyUI)
- [ ] Cards usan `card bg-base-100 shadow-xl`
- [ ] Inputs usan `input input-bordered focus:ring-2 focus:ring-primary`
- [ ] Sin mezcla de Tailwind nativo (`bg-white`, `border-neutral-200`) con DaisyUI
- [ ] Espaciado consistente (gap-4, p-4, mt-4 patron 4/8)

### 2.2 Tema y modo oscuro
- [ ] Variables CSS definidas para modo claro/oscuro
- [ ] `data-theme` en `<html>` y toggle funcional
- [ ] Colores semanticos: `text-base-content`, `bg-base-100`, `text-primary`

### 2.3 Tipografia
- [ ] Jerarquia clara: h1, h2, h3 con tamaños definidos
- [ ] Line-height legible (1.5 body, 1.2 headings)
- [ ] Sin fuentes externas (CDN) — usar system-ui stack

## 3. Micro-Interacciones

### 3.1 Feedback de acciones
- [ ] Botones tienen loading state en operaciones async (`btn btn-primary loading` o spinner)
- [ ] Toast/notificacion en exito/error de cada operacion CRUD
- [ ] Confirmacion antes de acciones destructivas (modal o `confirm()`)
- [ ] Deshabilitar boton durante envio (`:disabled="cargando"`)

### 3.2 Transiciones
- [ ] Transiciones en modales (`x-transition:enter`)
- [ ] Animaciones de entrada en listas (fadeIn escalonado con Animate.css)
- [ ] Sin animaciones en top/left/width/height — solo transform + opacity
- [ ] `prefers-reduced-motion` respetado

### 3.3 Estados hover/focus
- [ ] `hover:` en todos los elementos interactivos
- [ ] `focus:ring` en inputs y botones
- [ ] `cursor-pointer` en elementos clickeables
- [ ] Active state en navegacion

## 4. Navegacion y Componentes

### 4.1 Navegacion
- [ ] Navbar/Sidebar con indicador de ruta activa
- [ ] Breadcrumbs en paginas de detalle
- [ ] Hash-based router funcionando (`window.location.hash`)
- [ ] Transicion suave entre modulos

### 4.2 Formularios
- [ ] Labels visibles y asociados (`for` / `aria-label`)
- [ ] Validacion inline (mensaje bajo cada campo)
- [ ] Errores de servidor mostrados en formulario
- [ ] Campos requeridos marcados (*)

### 4.3 Modales y dialogos
- [ ] Focus trap activo (`x-trap.inert.noscroll`)
- [ ] Cierre con Escape y click fuera
- [ ] Scroll bloqueado en body cuando modal abierto
- [ ] x-cloak en todos los elementos con x-show

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
- [ ] Roles ARIA en componentes interactivos (modal, tab, alert)
- [ ] `aria-label` en iconos sin texto
- [ ] `aria-expanded` en dropdowns y accordions
- [ ] `aria-current="page"` en navegacion activa
- [ ] Landmarks: `<nav>`, `<main>`, `<header>`, `<footer>`

### 5.3 Teclado
- [ ] Tab order logico (tabindex)
- [ ] Skip link al inicio
- [ ] Focus visible (no outline: none sin alternativa)
- [ ] Atajos de teclado documentados (si existen)

### 5.4 Screen readers
- [ ] `sr-only` para texto informativo solo para lectores
- [ ] Mensajes de error anunciados (`aria-live="assertive"`)
- [ ] Cambios de contenido anunciados (`aria-live="polite"`)

## 6. Rendimiento y Tecnico

### 6.1 Carga
- [ ] Sin CDNs en runtime (todo local en assets/)
- [ ] Scripts en orden correcto (libs -> core -> main -> modules)
- [ ] Sin imports/ES6 modules (file:// no soporta CORS)

### 6.2 Cifrado
- [ ] `cryptoHelpers.encrypt()` en campos sensibles
- [ ] Clave de cifrado en localStorage (no hardcodeada)
- [ ] Prompt de clave al inicio si aplica

### 6.3 Service Worker (si aplica)
- [ ] Cache-first strategy
- [ ] Offline fallback page
- [ ] Versionado de cache

## Severidad

| Severidad | Significado | Accion |
|-----------|-------------|--------|
| Critico | Viola regla del stack o rompe funcionalidad | Corregir obligatorio |
| Alto | UX deficiente o violacion WCAG | Corregir recomendado |
| Medio | Mejora visual o de interaccion | Corregir si aplica |
| Bajo | Nice-to-have, refinamiento | Sugerir, no bloquear |
