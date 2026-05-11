---
name: design-ux-intelligence
description: Aplica principios de diseño distintivo y UX profesional (extraídos de frontend-design y ui-ux-pro-max) adaptados estrictamente al stack offline-first: Alpine.js, Dexie, CryptoJS, Tailwind CSS local, DaisyUI, Bootstrap Icons, Animate.css.
license: MIT
compatibility: Requiere @AGENTS.md y @project.config.js presentes. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.1"
  generatedBy: "design-ux-intelligence skill"
  triggers: ["tono visual", "diseño distintivo", "UX profesional", "validar accesibilidad", "mejorar UI", "paleta de colores", "tipografía", "estilo UI", "recomendación de diseño"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
---

# 🎨 SKILL: design-ux-intelligence (Capa de Diseño Adaptada)

> **Propósito**: Aplicar inteligencia de diseño visual y experiencia de usuario profesional, **100% compatible con tu stack offline-first**. No genera código por sí sola; se activa automáticamente cuando `spec-creator` o `validation-offline` requieren validación de diseño/UX.
> **Modo**: Consulta + Guía | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md
> **Activación**: Automática por triggers o integración con otras SKILLs

---

## 🔄 ACTIVACIÓN AUTOMÁTICA
Esta SKILL se activa cuando:
- `spec-creator` pregunta por "tono visual" o "diferenciador clave"
- `validation-offline` ejecuta la fase de "Validación de Diseño/UX"
- El usuario usa cualquier trigger: `tono visual`, `diseño distintivo`, `UX profesional`, `validar accesibilidad`

---

## 🎯 PRINCIPIOS DE DISEÑO DISTINTIVO (Adaptado de frontend-design)

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

### Paso 2: Reglas de implementación (offline-compatible)
| Elemento | Regla Offline-First | Ejemplo de Código |
|----------|-------------------|------------------|
| **Tipografía** | Google Fonts descargadas a `assets/fonts/` o system fonts. Evitar Inter/Roboto si buscas distinción. | `font-family: 'Segoe UI', system-ui, sans-serif;` |
| **Color** | Definir en `project.config.js` → `tema.colores`. Usar CSS variables para consistencia. | `--color-primario: #0d9488;` en `:root` |
| **Motion** | Animate.css + `will-change: transform`. Máx 2 animaciones/vista. Respeta `prefers-reduced-motion`. | `<div class="animate__animated animate__fadeInUp">` |
| **Espacial** | Escala Tailwind (`p-4`, `gap-6`). Asimetría controlada: `rounded-t-2xl rounded-b-lg`. | `<div class="p-6 md:p-8 gap-6">` |
| **Texturas** | Gradientes CSS (`bg-gradient-to-r`), sombras (`shadow-xl`), bordes (`ring-1 ring-primary/20`). | `<header class="bg-gradient-to-r from-primary to-secondary shadow-lg">` |
| **Iconografía** | Bootstrap Icons exclusivamente. Cada acción con icono + texto en móvil. | `<button><i class="bi bi-plus-lg"></i> <span class="sr-only md:not-sr-only">Nuevo</span></button>` |
| **Conexión** | Indicador online/offline visible siempre. Badge fijo + eventos `online`/`offline`. | `<span class="badge badge-sm" :class="conectado ? 'badge-success' : 'badge-error'"><i :class="conectado ? 'bi-wifi' : 'bi-wifi-off'"></i> <span x-text="conectado ? 'En línea' : 'Sin conexión'"></span></span>` |
| **Sync status** | Barra/indicador de progreso de sincronización. Animación pulse mientras sync. | `<progress class="progress progress-primary w-56" x-show="syncing" :value="syncProgress" max="100"></progress>` |

### ❌ PROHIBIDO (Bloquear automáticamente)
- Librerías de animación externas (GSAP, Framer Motion)
- Fonts vía CDN (`<link href="https://fonts.googleapis.com">`)
- Shaders CSS complejos o `clip-path` animado pesado
- Scroll-triggered JS que requiera IntersectionObserver complejo
- Imágenes de fondo base64 >50KB (impacto en carga inicial)

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

### Prioridad 5: Animación con Propósito (MEDIUM)
- [ ] Duración 150-300ms para micro-interacciones (botones, toggles)
- [ ] Animaciones expresan causa-efecto (ej: fila eliminada → `animate__fadeOutRight`)
- [ ] Stagger en listas: `animation-delay: ${index * 100}ms` para `fadeInUp`
- [ ] Respeta `prefers-reduced-motion`: `@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`
- [ ] Conexión offline→online: badge cambia con transición suave (`transition-colors duration-300`)
- [ ] Sync en progreso: spinner/pulse animado mientras dura, sin bloquear UI
- [ ] Error de sync: shake sutil en el indicador de conexión (`animate__headShake`)
- [ ] Datos guardados localmente: checkmark efímero (`animate__fadeIn` + auto-hide 2s)

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

### En `spec-creator.md`:
- Tras recibir historia de usuario, preguntar por tono visual si el usuario lo solicita.
- Incluir respuestas en la spec final bajo sección "## 🎨 UI/UX y Animaciones".

### En `validation-offline.md`:
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

✨ **SKILL ready. Se activa automáticamente con spec-creator o validation-offline.**
```

---