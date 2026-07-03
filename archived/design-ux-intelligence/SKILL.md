---
<!-- Archived — reemplazado por design-engine -->
# @deprecated — Absorbido por design-engine
# Motivo: Unificación design-ux-intelligence + daisyui-patterns + omd:apply + omd:sync + omd:remember/learn en design-engine
# Migración: design-engine integra todo el diseño + captura de preferencias + catálogo OmD
name: design-ux-intelligence
description: [DEPRECATED] Absorbido por design-engine. Aplica principios de diseño distintivo y UX profesional (extraídos de frontend-design, ui-ux-pro-max, interface-design y awesome-design-md) adaptados estrictamente al stack offline-first: Alpine.js, Dexie, CryptoJS, Tailwind CSS local, DaisyUI, Bootstrap Icons, Animate.css.
license: MIT
compatibility: Requiere @AGENTS.md y @project.config.js presentes. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.6"
  generatedBy: "design-ux-intelligence skill"
  triggers: ["tono visual", "diseño distintivo", "UX profesional", "validar accesibilidad", "mejorar UI", "paleta de colores", "tipografía", "estilo UI", "recomendación de diseño"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  perfiles: [lite, full]
  iconSet: "bootstrap-icons"
  language: es
---

# 🎨 SKILL: design-ux-intelligence (Capa de Diseño Adaptada)

> **Propósito**: Aplicar inteligencia de diseño visual y experiencia de usuario profesional, **100% compatible con tu stack offline-first**. No genera código por sí sola; se activa automáticamente cuando `spec-engine` o `validation-engine` requieren validación de diseño/UX.
> **Modo**: Consulta + Guía | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md
> **Activación**: Automática por triggers o integración con otras SKILLs

---

## 🔄 ACTIVACIÓN AUTOMÁTICA
Esta SKILL se activa cuando:
- `spec-engine` pregunta por "tono visual" o "diferenciador clave"
- `validation-engine` ejecuta la fase de "Validación de Diseño/UX"
- El usuario usa cualquier trigger: `tono visual`, `diseño distintivo`, `UX profesional`, `validar accesibilidad`

---

## 🎯 PRINCIPIOS DE DISEÑO DISTINTIVO (Adaptado de frontend-design)

### 🔴 El Problema (De interface-design)
```
⚠️ ADVERTENCIA: Vas a generar output genérico.

Tu entrenamiento ha visto miles de dashboards, CRUDs y formularios.
Los patrones son fuertes. Puedes seguir TODO el proceso de abajo
—explorar el dominio, nombrar un signature, declarar tu intención—
y aun así producir una plantilla.

Colores cálidos sobre estructuras frías. Fuentes amigables sobre
layouts genéricos. Un "feel de clínica" que se ve como cualquier otra app.

Esto sucede porque la intención vive en prosa, pero la generación
de código tira de patrones. El gap entre ambas es donde ganan los defaults.

Saltar este Paso 0 = el 99% de probabilidad de output genérico.
```

### Paso 0: Interface Discovery (De dammyjay93/interface-design)

Antes de elegir paletas, tipografías o estilos, ejecuta este proceso de 5 pasos. Cada paso es una **conversación con el usuario**. No lo saltes.

```
[▓░░░░░░░░░░░░░░░░░] 0% • Interface Discovery

🎯 PASO 0.1 — Intent Exploration
¿Quién es el humano específico que usará esto?
¿Cuál es su tarea principal (en una frase)?
¿Qué emoción debe transmitir la interfaz?
  - [1] Calma y confianza (healthcare, legal, fintech)
  - [2] Energía y urgencia (fitness, gaming, deadlines)
  - [3] Precisión y control (dashboards, admin, dev tools)
  - [4] Calidez y cercanía (social, e-commerce, kids)
  - [5] Prestigio y exclusividad (luxury, portfolio, premium)

🎯 PASO 0.2 — Domain Exploration
Basado en el dominio detectado:
  - Conceptos únicos: ¿qué palabra/símbolo/color define esta app?
  - Color world: ¿qué colores aparecen naturalmente en este dominio?
    (ej: salud = verde, blanco, celeste; fintech = azul marino, dorado)
  - Signature element: ¿qué elemento visual hará inconfundible esta app?
    (ej: una barra de progreso curva, un badge con forma única,
     un gradiente característico, bordes asimétricos)

🎯 PASO 0.3 — Subtle Layering
¿Cómo crear jerarquía visual sin gritar?
  - Surface elevation: 2-4 niveles de fondo (canvas → surface-1 → -2 → -3)
  - Border progression: sin borde → hairline (1px) → visible (2px)
  - Token architecture: cada nivel tiene su token (--surface-1, --border-subtle)
  - Sin sombras dramáticas: la profundidad se siente, no se anuncia

🎯 PASO 0.4 — Infinite Expression
Rechazar patrones idénticos. Cada pantalla emerge de su tarea:
  - Una lista no se ve igual que un formulario
  - Un dashboard no se ve igual que una configuración
  - La variación viene del contenido, no de templates
  - Pregunta: "¿Qué haría que esta pantalla no pudiera ser de otra app?"

🎯 PASO 0.5 — Systemic Intent
  - Cada decisión (color, spacing, depth, type) refuerza el "feel" declarado en 0.1
  - Si elegiste "calma": colores fríos, transiciones lentas, espaciado generoso
  - Si elegiste "energía": colores cálidos, micro-interacciones rápidas, contraste alto
  - Consistencia > creatividad: el sistema manda, las excepciones se justifican
  - Output esperado: un párrafo que cualquiera pueda leer y decir "sí, esa app se ve así"
```

> 🔑 **Regla**: Si el usuario ya definió tono visual en `spec-engine` (Pasos 1-8 de Configuración), salta los Pasos 0.1-0.2 y ve directo a 0.3-0.5. Si eligió "defaults", ejecuta TODO el Paso 0.

### Paso 1: Definir antes de codificar
```
🎨 Configuración de Diseño Distintivo

1️⃣ Propósito de la app:
   ¿Qué problema resuelve? ¿Quién es el usuario principal?
   Ej: "Recepcionista de clínica → agendar citas en <30 segundos"

2️⃣ Tono visual (elige 1):
   [1] Profesional limpio: slate/blue, sombras sutiles, sans-serif
   [2] Moderno vibrante: gradientes suaves, acentos teal/purple, fadeInUp
   [3] Minimalista premium: whitespace, font-weight variable, micro-interactions
   [4] Editorial/magazine: layout asimétrico, serif en títulos, blur overlays
   [5] Retro-futurista: bordes asimétricos, neón suave, pulse controlado
   [6] Vercel Precision: monocromo, shadow-as-border, Geist→Inter con negative tracking
   [7] Linear Dark: canvas oscuro (#010102), acento lavender (#5e6ad2), surface ladder
   [8] Stripe Indigo: navy ink (#0d253d), índigo CTA (#533afd), gradient mesh

3️⃣ Diferenciador clave:
   ¿Qué recordará el usuario? (máx 1 frase)
   Ej: "Transiciones suaves entre módulos con stagger animation"
```

### Paso 1.5 — High-Agency Design Taste (De design-taste-frontend)
```
🎯 Principios de diseño con intención (no genérico)

1. Calibrated Color — Cada color tiene un propósito:
   - Primario: brand + CTA (máx 1)
   - Neutro: contenido + fondo (mín 3 tonos: surface, text, muted)
   - Acento: solo para highlight (NUNCA para body text)
   - Error/warning/success: semántico, sin mezclar con brand

2. Responsive Layout — No es "mobile-first" es "content-first":
   - El layout cambia por contenido, no por breakpoint
   - Whitespace es activo (respira), no vacío
   - Máx 64ch por línea de texto

3. Intentional Motion — Cada animación explica algo:
   - FadeIn: elemento aparece (nuevo contenido)
   - Slide: elemento se mueve (reordenamiento)
   - Scale: elemento cambia importancia (focus/expand)
   - NUNCA decorar por decorar

4. Non-generic Identity:
   - Sin defaults de framework (evitar look bootstrap-genérico)
   - Diferenciador visual: bordes, radios, sombras personalizados
   - Consistencia > creatividad (el sistema manda)
   - Micro-interacciones: hover states, active states, transition suaves
```

### Paso 1.6 — Design Dials (De Leonxlnx/taste-skill)
Capa opcional de control numérico (1-10). Solo activar si el usuario pide "más control" o "ajustar fine-tuning visual". Default: `5 / 4 / 5`:

```
📊 DESIGN_VARIANCE: [5] (1=simetría perfecta, 10=caos asimétrico)
  1-3: grids simétricos, paddings iguales
  4-7: layouts offset, overlays suaves
  8-10: masonry, fracciones CSS, zonas vacías

🎬 MOTION_INTENSITY: [4] (1=estático, 10=cinemático)
  1-3: solo hover/active CSS
  4-7: Alpine transitions, stagger, fade+slide
  8-10: scroll reveals, parallax suave con IntersectionObserver

🔍 VISUAL_DENSITY: [5] (1=galería de arte, 10=cockpit de datos)
  1-3: whitespace extremo, py-24, gap-16
  4-7: spacing estándar de app
  8-10: padding mínimo, divider líneas, font-mono en números
```

> **Regla**: No preguntar estos diales a menos que el usuario haya ajustado el tono visual primero. Son una capa de refinamiento, no un punto de partida.

### Paso 2: Reglas de implementación (offline-compatible)
| Elemento | Regla Offline-First | Ejemplo de Código |
|----------|-------------------|------------------|
| **Tipografía** | Sistema 5 tamaños con ratio fijo (1.25-1.333). `clamp()` en displays, `rem` fijo en UI. Mín 16px body. Nombres semánticos: `--text-body`, no `--font-size-16`. | `font-size: clamp(1.5rem, 3vw + 1rem, 3rem)` en hero; `text-base` en body |
| **Color** | Usar OKLCH (no HSL) para paletas perceptualmente uniformes. Tinted neutrals: chroma 0.005-0.01. Tokens 2-capas: primitivos (`--blue-500`) → semánticos (`--color-primary`). | `--blue-500: oklch(50% 0.2 250); --color-primary: var(--blue-500)` en `:root` |
| **Motion** | Animate.css + `will-change`. 100/300/500 rule. GPU-safe (transform + opacity). Respeta `prefers-reduced-motion`. | `<div class="animate__animated animate__fadeInUp" style="animation-duration:300ms">` |
| **Espacial** | Container queries para componentes, viewport para layout. Break card grid: espaciado+alineación agrupan. No nesting cards. | `@container (min-width: 400px){...}` en CSS; `grid-cols-1 md:grid-cols-2` en layout |
| **Texturas** | Gradientes CSS, sin glassmorphism decorativo. Alpha es code smell: preferir colores sólidos. Elevation vía surface ladder + hairline. | `bg-gradient-to-r from-primary/90 to-primary/60` + `border border-base-300` |
| **Iconografía** | Bootstrap Icons exclusivamente. Cada acción con icono + texto en móvil. | `<button><i class="bi bi-plus-lg"></i> <span class="sr-only md:not-sr-only">Nuevo</span></button>` |
| **Conexión** | Indicador online/offline visible siempre. Badge fijo + eventos `online`/`offline`. | `<span class="badge badge-sm" :class="conectado ? 'badge-success' : 'badge-error'"><i :class="conectado ? 'bi-wifi' : 'bi-wifi-off'"></i> <span x-text="conectado ? 'En línea' : 'Sin conexión'"></span></span>` |
| **Sync status** | Barra/indicador de progreso de sincronización. Animación pulse mientras sync. | `<progress class="progress progress-primary w-56" x-show="syncing" :value="syncProgress" max="100"></progress>` |

### ❌ PROHIBIDO (Bloquear automáticamente)
- Librerías de animación externas (GSAP, Framer Motion)
- Fonts vía CDN (`<link href="https://fonts.googleapis.com">`)
- Shaders CSS complejos o `clip-path` animado pesado
- Scroll-triggered JS que requiera IntersectionObserver complejo
- Imágenes de fondo base64 >50KB (impacto en carga inicial)

#### AI Tells — Patrones que delatan UI genérica (De taste-skill)
- **No Inter como única tipográfica**: usar Geist, Outfit, Satoshi, Cabinet Grotesk
- **No #000 puro**: usar off-black o tinted dark (#0a0a0a, #121212)
- **No acentos saturados >80%**: desaturar para que se mezclen con neutros
- **No gradiente purple-to-blue**: reemplazar por acento sólido único
- **No glassmorphism decorativo**: solo en overlays/nav fijos funcionales
- **No 3-columnas iguales en features**: zigzag 2-col, asimétrico o masonry
- **No centered hero si DESIGN_VARIANCE > 4**: split-screen o left-aligned
- **No nombres genéricos**: "Juan Pérez", "Acme Corp", "SmartFlow" prohibidos
- **No números falsos**: evitar 99.99%, usar datos orgánicos (47.2%)
- **No placeholder text**: escribir copy real, nunca Lorem Ipsum
- **No emojis en UI**: sustituir por Bootstrap Icons o SVG primitivos
- **No h-screen**: usar min-h-[100dvh] para evitar jumping en iOS Safari
- **No animar layout properties**: solo transform + opacity (GPU-safe)
- **No bounce/linear easing**: usar cubic-bezier personalizados o spring CSS
- **Alpha es code smell**: rgba/hsla extenso indica paleta incompleta. Usar colores sólidos en overlays. Excepción: focus rings y estados interactivos.
- **Gray text on colored backgrounds**: usar un tono más oscuro del color de fondo, no gris puro.
- **Pure gray sin tintar**: añadir chroma 0.005-0.01 para que los neutros respiren.
- **Wrapping todo en cards**: no todo necesita card. Espacio+alineación crean agrupación visual.
- **Sin sistema de escalas**: usar ratio fijo (1.25, 1.333 o 1.5) entre tamaños tipográficos.

---

## 📐 SISTEMA DE ESCALAS TIPOGRÁFICAS (De impeccable/typography)
5 tamaños cubren casi todo con un ratio consistente:

| Token | Ratio 1.25 | Ratio 1.333 | Uso |
|-------|-----------|-------------|-----|
| `--text-xs` | 0.75rem | 0.75rem | Captions, legal |
| `--text-sm` | 0.875rem | 0.875rem | Metadata, UI secundario |
| `--text-base` | 1rem | 1rem | Body text (mín 16px) |
| `--text-lg` | 1.25rem | 1.333rem | Subheadings, lead |
| `--text-xl` | 2rem+ | 2.5rem+ | Headlines, hero |

**Reglas:**
- Nombres semánticos: `--text-body`, `--text-heading` — nunca `--font-size-16`
- Fluid type con `clamp()` en displays: `clamp(1rem, 3vw + 1rem, 2.5rem)`
- `rem` fijo en UI de app (no fluid, preserva predictibilidad espacial)
- Una familia basta: pesos variados crean jerarquía más limpia que dos fuentes. Solo añadir segunda cuando se necesita contraste genuino (display serif + body sans).
- Máx 64ch por línea de texto, line-height 1.5-1.7 body / 1.1-1.2 headings
- Nunca `px` en font-size, nunca `user-scalable=no`, nunca body < 16px

---

## 🏛️ PLANTILLAS DE DESIGN SYSTEM (De awesome-design-md)

### [6] Vercel Precision (adaptado offline)
| Elemento | Token Offline-First | Implementación |
|----------|-------------------|----------------|
| **Canvas** | `#ffffff` fondo, `#171717` texto primario | `bg-white text-[#171717]` |
| **Acento** | Workflow: Ship `#ff5b4f`, Preview `#de1d8d`, Develop `#0a72ef` | Usar solo en contexto de workflow |
| **Bordes** | Shadow-as-border: `0px 0px 0px 1px rgba(0,0,0,0.08)` | `shadow-[0_0_0_1px_rgba(0,0,0,0.08)]` |
| **Tipografía** | Inter 600 con negative tracking en displays | `font-semibold tracking-tight` en títulos |
| **Botón primario** | Fondo `#171717`, texto `#ffffff`, radius 6px | `btn btn-neutral rounded-md` |
| **Cards** | Multi-shadow stack: border + 2px elevation + inner glow | `shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]` |
| **Focus ring** | `hsla(212, 100%, 48%, 1)` | `focus:ring-2 focus:ring-[#0072f5] focus:ring-offset-2` |
| **Espaciado** | Base 8px, gaps de 16px a 32px (sin 20/24) | `gap-4` a `gap-8` |
| **Radio** | 6px botones, 8px cards, 12px images, 9999px badges | `rounded-md`, `rounded-lg`, `rounded-2xl`, `rounded-full` |

### [7] Linear Dark (adaptado offline)
| Elemento | Token Offline-First | Implementación |
|----------|-------------------|----------------|
| **Canvas** | `#010102` (casi negro con tinte azul) | `bg-[#010102]` |
| **Surface ladder** | 4 niveles: surface-1 `#0f1011`, -2 `#141516`, -3 `#18191a`, -4 `#191a1b` | Cards en `bg-[#0f1011]` con 1px `border-[#23252a]` |
| **Acento** | Lavender `#5e6ad2` solo en brand mark, CTA, focus ring | `btn bg-[#5e6ad2] text-white` |
| **Texto** | Ink `#f7f8f8`, Ink-muted `#d0d6e0`, Ink-subtle `#8a8f98` | `text-[#f7f8f8]`, `text-[#d0d6e0]`, `text-[#8a8f98]` |
| **Tipografía** | Display 600 weight, negative tracking agresivo | `font-semibold tracking-tight` en títulos |
| **Botón primario** | Lavender `#5e6ad2`, hover `#828fff`, padding 8px 14px | `btn bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md` |
| **Botón secundario** | Surface-1 bg, ink text, hairline border | `btn bg-[#0f1011] text-[#f7f8f8] border border-[#23252a] rounded-md` |
| **Cards** | Padding 24px, radius 12px, hairline border | `p-6 rounded-xl border border-[#23252a] bg-[#0f1011]` |
| **Inputs** | Surface-1 bg, 8px 12px padding, 8px radius | `input bg-[#0f1011] border border-[#23252a] rounded-md px-3 py-2` |
| **Sin sombras** | La profundidad se logra con surface ladder + hairline | No usar `shadow-*`. Usar `border` y surface bg. |

### [8] Stripe Indigo (adaptado offline)
| Elemento | Token Offline-First | Implementación |
|----------|-------------------|----------------|
| **Canvas** | `#ffffff` con banda gradient mesh (SVG asset) arriba | Fondo blanco + `bg-gradient-to-r from-[#f5e9d4] via-[#e8d5f5] to-[#533afd]` simplificado |
| **Ink** | `#0d253d` (navy profundo) para texto | `text-[#0d253d]` |
| **Acento** | Índigo `#533afd` para CTA y links | `bg-[#533afd] text-white`, hover `#4434d4` |
| **Tipografía** | Weight 300 con negative tracking en displays | `font-light tracking-tight` en títulos |
| **Botón primario** | Pill shape: índigo, 8px 16px padding, 9999px radius | `btn bg-[#533afd] hover:bg-[#4434d4] text-white rounded-full px-4 py-2` |
| **Botón secundario** | Outline pill: canvas bg, índigo border | `btn bg-white text-[#533afd] border border-[#533afd] rounded-full` |
| **Cards feature** | Padding 32px, radius 12px, 1px hairline | `p-8 rounded-xl border border-[#e3e8ee]` |
| **Cards pricing featured** | Navy `#1c1e54` bg, texto blanco | `bg-[#1c1e54] text-white p-8 rounded-xl` |
| **Números tabulares** | Usar `font-feature-settings: "tnum"` en montos | `style="font-feature-settings: 'tnum'"` en celdas numéricas |
| **Cream band** | Sección cálida: `#f5e9d4` | `bg-[#f5e9d4]` para secciones alternas |

---

## 🎨 REFERENCIA DE PALETAS POR TIPO DE APP (De ui-ux-pro-max colors.csv)
Usar estas paletas según el tipo de app. Adaptar a DaisyUI con CSS variables en `:root`.

| # | Tipo App | Primario | Secundario | Acento |
|---|----------|----------|------------|--------|
| 1 | SaaS General | `#2563EB` | `#3B82F6` | `#EA580C` |
| 2 | Micro SaaS | `#6366F1` | `#818CF8` | `#059669` |
| 3 | E-commerce | `#059669` | `#10B981` | `#EA580C` |
| 4 | B2B Service | `#0F172A` | `#334155` | `#0369A1` |
| 5 | Healthcare App | `#0891B2` | `#22D3EE` | `#059669` |
| 6 | Educational App | `#4F46E5` | `#818CF8` | `#EA580C` |
| 7 | Fintech/Crypto | `#F59E0B` | `#FBBF24` | `#8B5CF6` |
| 8 | Productividad | `#0D9488` | `#14B8A6` | `#EA580C` |
| 9 | AI/Chatbot | `#7C3AED` | `#A78BFA` | `#0891B2` |
| 10 | Dashboard Analytics | `#1E40AF` | `#3B82F6` | `#D97706` |
| 11 | Legal | `#1E3A8A` | `#1E40AF` | `#B45309` |
| 12 | Real Estate | `#0F766E` | `#14B8A6` | `#0369A1` |
| 13 | Fitness App | `#F97316` | `#FB923C` | `#22C55E` |
| 14 | Travel | `#0EA5E9` | `#38BDF8` | `#EA580C` |
| 15 | Social Media | `#E11D48` | `#FB7185` | `#2563EB` |
| 16 | Gaming | `#7C3AED` | `#A78BFA` | `#F43F5E` |
| 17 | Music Streaming | `#1E1B4B` | `#4338CA` | `#22C55E` |
| 18 | Developer Tool | `#1E293B` | `#334155` | `#22C55E` |
| 19 | E-learning | `#0D9488` | `#2DD4BF` | `#EA580C` |
| 20 | Food Delivery | `#EA580C` | `#F97316` | `#2563EB` |
| 21 | Mental Health | `#8B5CF6` | `#C4B5FD` | `#059669` |
| 22 | Kids App | `#2563EB` | `#F59E0B` | `#EC4899` |
| 23 | Cybersecurity | `#00FF41` | `#0D0D0D` | `#FF3333` |
| 24 | Portfolio | `#18181B` | `#3F3F46` | `#2563EB` |
| 25 | News/Media | `#DC2626` | `#EF4444` | `#1E40AF` |
| 26 | Hotel/Luxury | `#1E3A8A` | `#3B82F6` | `#A16207` |
| 27 | Real-time Monitoring | `#1E293B` | `#334155` | `#F59E0B` |
| 28 | CRM | `#2563EB` | `#3B82F6` | `#059669` |
| 29 | Booking App | `#0284C7` | `#0EA5E9` | `#059669` |
| 30 | IoT Dashboard | `#1E293B` | `#334155` | `#22C55E` |

**Modo de uso:** Elegir la fila más cercana al tipo de app. Mapear a DaisyUI: `primary` = Primario, `secondary` = Secundario, `accent` = Acento. Definir en `project.config.js` → `tema.colores`.

---

## 📐 REFERENCIA DE ESTILOS UI (De ui-ux-pro-max styles.csv)
Estilos compatibles con stack offline-first. Marcar "Offline" si no requiere CDN externo.

| Estilo | Mejor Para | Offline | Clases Clave |
|--------|-----------|---------|-------------|
| **Minimalism** | Enterprise apps, dashboards, SaaS | ✅ | `grid gap-8 max-w-6xl mx-auto` sin sombras |
| **Flat Design** | Web apps, MVPs, cross-platform | ✅ | `bg-solid shadow-none border-0 rounded-sm` |
| **Glassmorphism** | SaaS moderno, overlays, nav | ⚠️ `backdrop-filter` nativo | `backdrop-blur-md bg-white/10 border border-white/20` |
| **Claymorphism** | Apps educativas, infantiles | ✅ | `rounded-2xl border-4 shadow-inner shadow-lg` |
| **Dark Mode OLED** | Night-mode, coding, entertainment | ✅ | `bg-black text-white accent-neon` |
| **Brutalism** | Portfolios, editorial, tech blogs | ✅ | `rounded-none border-4 font-bold uppercase` |
| **Aurora UI** | SaaS moderno, hero sections | ⚠️ Animación CSS | `bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient` |
| **Hero-Centric** | Landing pages, product launch | ✅ | `min-h-screen flex items-center bg-gradient-to-r` |
| **Retro-Futurism** | Gaming, entertainment | ✅ | `bg-black text-neon font-mono shadow-glow` |
| **Soft UI Evolution** | Enterprise apps, SaaS | ✅ | `rounded-xl shadow-md bg-white focus:ring-2` |
| **Data-Dense Dashboard** | BI, analytics, reporting | ✅ | `grid grid-cols-12 gap-2 text-xs` |
| **Conversion-Optimized** | Landing pages, lead gen | ✅ | `max-w-lg mx-auto form-control gap-4` |

---

## 🔤 REFERENCIA DE PAIRINGS TIPOGRÁFICOS (De ui-ux-pro-max typography.csv)
Combinaciones adaptadas para offline: las fuentes deben descargarse a `assets/fonts/` o usarse system fonts.

| # | Nombre | Títulos | Cuerpo | Mood | Ideal Para |
|---|--------|---------|--------|------|-----------|
| 1 | Classic Elegant | Playfair Display | Inter | Elegante, lujo | Fashion, spa, editorial |
| 2 | Modern Professional | Poppins | Open Sans | Corporativo, limpio | SaaS, startups, servicios |
| 3 | Tech Startup | Space Grotesk | DM Sans | Innovador, tech | Tech, dev tools, AI |
| 4 | Minimal Swiss | Inter | Inter | Limpio, funcional | Dashboards, admin, docs |
| 5 | Playful Creative | Fredoka | Nunito | Divertido, amigable | Kids, gaming, creative |
| 6 | Wellness Calm | Lora | Raleway | Tranquilo, natural | Health, meditation, yoga |
| 7 | Developer Mono | JetBrains Mono | IBM Plex Sans | Técnico, preciso | Dev tools, code, CLI |
| 8 | Geometric Modern | Outfit | Work Sans | Contemporáneo, balanceado | Portfolios, landing pages |
| 9 | Luxury Serif | Cormorant | Montserrat | Refinado, premium | Fashion, luxury e-commerce |
| 10 | Friendly SaaS | Plus Jakarta Sans | Plus Jakarta Sans | Amigable, moderno | SaaS, web apps, B2B |
| 11 | Corporate Trust | Lexend | Source Sans 3 | Confiable, accesible | Enterprise, healthcare, gov |
| 12 | Brutalist Raw | Space Mono | Space Mono | Stark, técnico | Experimental, dev portfolios |
| 13 | Dashboard Data | Fira Code | Fira Sans | Preciso, data | Analytics, admin panels |
| 14 | Medical Clean | Figtree | Noto Sans | Limpio, accesible | Healthcare, medical clinics |
| 15 | Financial Trust | IBM Plex Sans | IBM Plex Sans | Serio, profesional | Banking, fintech, insurance |
| 16 | E-commerce Clean | Rubik | Nunito Sans | Limpio, shopping | Online stores, retail |
| 17 | Accessibility First | Atkinson Hyperlegible | Atkinson Hyperlegible | Inclusivo, claro | Government, healthcare |
| 18 | Academic | Crimson Pro | Atkinson Hyperlegible | Académico, scholarly | Education, research |
| 19 | Sports/Fitness | Barlow Condensed | Barlow | Atlético, energía | Sports, fitness, gyms |
| 20 | Crypto/Web3 | Orbitron | Exo 2 | Futurista, tech | Crypto, NFT, blockchain |

**Regla offline:** Usar `<link rel="preload" href="assets/fonts/[font].woff2">` y `@font-face` en CSS local. Si la fuente no está disponible, fallback a `system-ui, sans-serif`.

---

## 🧠 LÓGICA DE RECOMENDACIÓN AUTOMÁTICA
Usar esta tabla para sugerir automáticamente paleta + estilo + tipografía según el tipo de app declarado en la spec.

| Si la app es tipo... | Paleta Recomendada | Estilo UI | Tipografía |
|---------------------|-------------------|-----------|------------|
| SaaS / B2B | #1 (SaaS) o #2 (Micro SaaS) | Minimalism o Flat Design | Modern Professional |
| E-commerce / Retail | #3 (E-commerce) | Conversion-Optimized o Hero-Centric | E-commerce Clean |
| Dashboard / Analytics | #10 (Analytics) o #27 (Monitoring) | Data-Dense Dashboard | Dashboard Data |
| Healthcare / Medical | #5 (Healthcare) | Soft UI Evolution o Minimalism | Medical Clean |
| Fintech / Crypto | #7 (Fintech) o #20 (Crypto/Web3) | Dark Mode OLED | Financial Trust |
| Gaming / Entertainment | #16 (Gaming) | Retro-Futurism o Brutalism | Tech Startup |
| Education / E-learning | #6 (Education) o #19 (E-learning) | Claymorphism o Flat Design | Playful Creative |
| AI / Chatbot | #9 (AI/Chatbot) | Glassmorphism o Aurora UI | Tech Startup |
| Social Media | #15 (Social Media) | Vibrant & Block-based | Friendly SaaS |
| Portfolio / Personal | #24 (Portfolio) | Minimalism o Brutalism | Minimal Swiss |
| Food / Restaurant | #13 (Fitness) → Food: #25 | Hero-Centric | Classic Elegant |
| Real Estate | #12 (Real Estate) | Hero-Centric o Feature-Rich Showcase | Luxury Serif |
| Legal / Government | #11 (Legal) | Minimalism | Corporate Trust |
| Kids / Infantil | #22 (Kids App) | Claymorphism | Playful Creative |
| Developer Tool | #18 (Developer Tool) | Dark Mode OLED o Minimalism | Developer Mono |

**Si el usuario elige un tono visual (1-8):** La paleta, estilo y tipografía se derivan del tono, no de esta tabla. Usar esta tabla solo cuando NO haya tono visual definido.

---

## 🛡️ CHECKLIST UX CRÍTICO (Adaptado de ui-ux-pro-max)

### Prioridad 1: Accesibilidad (CRÍTICO - Bloquea entrega si falla)
- [ ] Contraste texto/fondo ≥ 4.5:1 (WCAG AA) → Validar con devtools > Accessibility
- [ ] Labels visibles en inputs (no solo placeholder) → `<label for="email">Email</label>`
- [ ] `aria-label` en botones con solo icono → `<button aria-label="Eliminar"><i class="bi bi-trash"></i></button>`
- [ ] `aria-live="polite"` en regiones dinámicas (toast, alerts) → `<div aria-live="polite" id="toast-container"></div>`
- [ ] `role="alert"` en mensajes de error → `<div role="alert" class="alert alert-error">...</div>`
- [ ] `aria-current="page"` en nav activo → `<a aria-current="page" href="#/dashboard">Dashboard</a>`
- [ ] Focus ring visible: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- [ ] Mensajes de error cerca del campo, en español, con icono `bi-exclamation-triangle`
- [ ] Skip link visible al inicio: `<a href="#main-content" class="skip-link">Saltar al contenido</a>`

### Prioridad 1.5: Screen Reader Testing (De screen-reader-testing)
```
🎯 Validación con lectores de pantalla (NVDA/ VoiceOver)

1. Navegación por landmarks (roles regions):
   - `<header role="banner">`, `<nav role="navigation">`, `<main role="main">`
   - Cada pantalla tiene un `<h1>` único que describe su contenido
   
2. Formularios:
   - Cada input tiene `<label for="id">` vinculado
   - Errores anunciados con `aria-describedby` apuntando al mensaje
   - `fieldset` + `legend` para grupos de checkbox/radio

3. Tablas de datos (si aplica):
   - `<table>` con `<caption>` descriptivo
   - `<th scope="col">` en headers de columna
   - Mensaje "Cargando..." con `aria-live="polite"` durante async

4. Modales:
   - Focus atrapado dentro del modal (focus trap)
   - `aria-modal="true"` y `role="dialog"`
   - Al cerrar, focus vuelve al elemento que lo abrió

5. Navegación por teclado:
   - Tab order = orden visual (sin tabindex >0)
   - Skip link funcional: al presionar Tab al cargar, debe ser visible
   - Todos los interactive elements son focusables (a, button, input, select, textarea)
```

### Prioridad 2: Interacción Táctil (CRÍTICO para móvil)
- [ ] Touch targets ≥ 44x44px (medir con devtools > Elements > Computed)
- [ ] Spacing entre botones ≥ 8px para evitar taps accidentales
- [ ] Feedback visual en tap: `active:scale-[0.98]` o `animate__pulse` (duración ≤200ms)
- [ ] Loading states en operaciones async: `<span class="loading loading-spinner"></span>` de DaisyUI

### Prioridad 3: Responsive (HIGH)
- [ ] Mobile-first: probar en 320px ancho (devtools > Toggle device toolbar)
- [ ] Sin scroll horizontal en móvil (evitar `min-width` fijos >100vw)
- [ ] Breakpoints Tailwind: `md:`, `lg:` para desktop, nunca `max-width` para mobile
- [ ] Viewport meta tag presente: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### Prioridad 4: Forms & Feedback (MEDIUM)
- [ ] Validación en blur (no en keystroke) para evitar spam de errores
- [ ] Toast de éxito/error con `UI.toast()` (DaisyUI) + icono + duración 3s
- [ ] Confirmación modal antes de acciones destructivas: `UI.confirm("¿Eliminar?")`
- [ ] Empty states amigables con CTA: `<div class="text-center py-12"><i class="bi bi-inbox text-6xl"></i><p>Sin registros</p><button class="btn btn-primary"><i class="bi bi-plus"></i> Añadir</button></div>`

### Prioridad 5: Motion Engine (De taste-skill + soft-skill)

**Dial MOTION_INTENSITY:**
- 1-3: solo hover/active CSS (`transition-all duration-200`)
- 4-7: plus stagger, fade+slide, micro-interacciones perpetuas
- 8-10: plus scroll reveals (IntersectionObserver), parallax suave

**Spring Physics (CSS).** Reemplazar easing lineal en elementos interactivos:
```css
/* En lugar de transition-all duration-300 ease-in-out */
transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
/* O en Tailwind: */
class="transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
```

**Stagger Orchestration.** No montar listas/grids instantáneamente:
```html
<template x-for="(item, i) in items" :key="item.id">
  <div x-show="true"
       x-transition:enter.duration.300ms
       :style="`animation-delay: ${i * 80}ms; transition-delay: ${i * 80}ms`">
  </div>
</template>
```

**Magnetic Button Hover.** Efecto de botón que "respira" al hover:
```html
<button class="group btn btn-primary transition-[transform,box-shadow] duration-400
               ease-[cubic-bezier(0.34,1.56,0.64,1)]
               hover:scale-[1.02] active:scale-[0.98]">
  <i class="bi bi-arrow-right group-hover:translate-x-0.5 transition-transform"></i>
</button>
```

**Perpetual Micro-Interactions** (cuando MOTION_INTENSITY > 5):
```html
<!-- Badge que respira infinitamente -->
<span class="badge badge-success animate-pulse">En vivo</span>
<!-- Shimmer skeleton en carga -->
<div class="skeleton h-4 w-3/4 animate-shimmer bg-gradient-to-r from-base-200 via-base-100 to-base-200 bg-[length:200%_100%]"></div>
```

**Checklist Motion Engine:**
- [ ] ¿Duración 150-400ms con spring CSS (`cubic-bezier(0.34,1.56,0.64,1)`)? → ❌ APLICAR spring
- [ ] ¿Stagger en listas/grids con delay incremental? → ❌ AÑADIR `animation-delay`
- [ ] ¿Skeleton loaders (no spinner genérico) en carga? → ❌ REEMPLAZAR
- [ ] ¿GPU-safe: solo transform + opacity (nunca top/left/width/height)? → ❌ CORREGIR
- [ ] ¿Respeta `prefers-reduced-motion`? → ❌ AÑADIR media query
- [ ] ¿`min-h-[100dvh]` en lugar de `h-screen`? → ❌ REEMPLAZAR
- [ ] ¿Conexión offline→online con transición? → ❌ AÑADIR `transition-colors duration-300`
- [ ] ¿Sync en progreso con spinner/pulse animado? → ❌ AÑADIR <span class="loading loading-spinner">
- [ ] ¿Datos guardados con checkmark efímero? → ❌ AÑADIR `animate__fadeIn` + auto-hide

---

## 📦 PASO 5: COMPONENTES PINES PASTE-ABLE

Componentes Alpine.js + Tailwind CSS nativo, copiados de [Pines](https://devdojo.com/pines) y adaptados al stack offline-first. Residen en `components/pines/`.

| Componente | Categoría | Cuándo usarlo | Archivo |
|-----------|-----------|---------------|---------|
| **Command Palette** | UX | Cmd+K para navegación rápida, power users | `command.html` |
| **Slide-over** | UX | Panel lateral para detalles, settings, filtros | `slide-over.html` |
| **Date Picker** | Form | Selección de fecha en formularios offline | `date-picker.html` |
| **Context Menu** | UX | Menú en click derecho para acciones contextuales | `context-menu.html` |
| **Hover Card** | UX | Vista previa de perfil/enlace al hacer hover | `hover-card.html` |
| **Popover** | UX | Info contextual expandible cerca del elemento | `popover.html` |
| **Range Slider** | Form | Filtros por rango numérico (precio, fecha) | `range-slider.html` |
| **Rating** | Form | Valoración de 1-5 estrellas | `rating.html` |
| **Switch** | Form | Toggle on/off para preferencias | `switch.html` |
| **Toast** | UX | Notificaciones temporales (éxito, error, alerta) | `toast.html` |
| **Tooltip** | UX | Ayuda contextual al hacer hover | `tooltip.html` |
| **Copy to Clipboard** | Utility | Copiar texto/código al portapapeles | `copy-to-clipboard.html` |
| **Modal / Full Screen** | UX | Diálogos, confirmaciones, preview a pantalla completa | `modal.html`, `full-screen-modal.html` |
| **Dropdown / Menu Bar / Nav** | Nav | Menús de navegación o acciones agrupadas | `dropdown-menu.html`, `menubar.html`, `navigation-menu.html` |
| **Combobox / Select** | Form | Selección de opciones con búsqueda | `combobox.html`, `select.html` |
| **Tabs / Accordion** | Nav | Organizar contenido en pestañas o secciones colapsables | `tabs.html`, `accordion.html` |
| **Pagination / Breadcrumbs** | Nav | Navegación entre páginas y ruta de ubicación | `pagination.html`, `breadcrumbs.html` |
| **Banner / Sticky Header** | Marketing | Avisos importantes o headers fijos | `banner.html`, `sticky-header.html` |
| **Texto animado / Marquee** | Decorative | Headlines animados, scroll infinito de logos | `text-animation.html`, `marquee.html` |
| **Image Gallery / Video** | Media | Galería de imágenes, reproductor de video | `image-gallery.html`, `video.html` |

**Reglas de uso:**
- Son Tailwind nativo (no DaisyUI). Funcionan con Alpine cargado desde `assets/`.
- Para integrar con DaisyUI: mapear `bg-white` → `bg-base-100`, `text-gray-900` → `text-base-content`, `border-neutral-200` → `border-base-300`.
- No contienen CDNs externas ni fetch. 100% offline-file compatible.
- Ver `components/index.html` para galería navegable con preview y copia.

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

### En `spec-engine`:
- Tras recibir historia de usuario, preguntar por tono visual si el usuario lo solicita.
- Incluir respuestas en la spec final bajo sección "## 🎨 UI/UX y Animaciones".

### En `validation-engine`:
- Activar automáticamente en Fase 3.5 para checklist de diseño/UX.
- Si hay FAILs, sugerir correcciones con snippets exactos.

### Formato de sugerencia de corrección:
```html
<!-- SI FAIL en "Focus rings visibles" -->
<!-- ANTES: -->
<button class="btn btn-sm"><i class="bi bi-pencil"></i></button>
<!-- DESPUÉS: -->
<button class="btn btn-sm focus:ring-2 focus:ring-primary focus:ring-offset-2"><i class="bi bi-pencil"></i></button>
```

---

## 💬 FORMATO DE OUTPUT (Terminal-Friendly)
```
[▓▓▓▓░░░░░░░░░░░░░░] 40% • Diseño Distintivo
🎨 Tono seleccionado: [7] Linear Dark
📐 Paleta recomendada: #1a (Developer Tool) — slate/verde
🔤 Tipografía: Developer Mono (JetBrains Mono + IBM Plex Sans)
✨ Aplicando:
  • Canvas: bg-[#010102] text-[#f7f8f8]
  • Surface cards: bg-[#0f1011] border-[#23252a]
  • Acento lavender: bg-[#5e6ad2] hover:bg-[#828fff]
  • Botones: rounded-md, 8px 14px padding
  • Sin sombras — usar surface ladder + hairline borders

✅ Configuración aplicada. Procediendo con generación de código.
```

---

## 📝 NOTAS PARA LA IA
- Esta SKILL **no genera código por sí sola**. Solo valida, sugiere y corrige.
- Siempre prioriza **compatibilidad offline**: si una sugerencia requiere CDN/build, descártala.
- Si el usuario no elige tono visual o elige "[9] defaults", usa los colores de `project.config.js` sin modificar.
- En validación, sé específico: no digas "mejorar contraste", di "cambiar `text-gray-500` a `text-gray-700` en línea 42 de `module.html`".
- Mantén el lenguaje en español técnico pero accesible.

### 📝 Notas de unificación de perfiles
- **Iconos**: Bootstrap Icons es el set único para ambos perfiles (Lite y Full). Funciona en file:// y Bun sin build step. No usar Lucide.
- **Animaciones**: Animate.css incluido en ambos perfiles (~3KB, irrelevante en .exe de 50MB).
- **Perfil Full**: Mismas reglas de diseño UX que Lite. El frontend es idéntico. La única diferencia es el runtime.
- **Refero MCP**: La inspiración de diseño vía refero.design aplica igual a ambos perfiles.

✨ **SKILL ready v2.6. Se activa automáticamente con spec-creator o validation-offline.**
```

---