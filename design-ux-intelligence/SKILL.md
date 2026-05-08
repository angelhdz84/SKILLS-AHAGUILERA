---
name: design-ux-intelligence
description: Aplica principios de diseño distintivo y UX profesional (extraídos de frontend-design y ui-ux-pro-max) adaptados estrictamente al stack offline-first: Alpine.js, Dexie, CryptoJS, Tailwind CSS local, DaisyUI, Bootstrap Icons, Animate.css.
license: MIT
compatibility: Requiere @AGENTS.md y @project.config.js presentes. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  generatedBy: "design-ux-intelligence skill"
  triggers: ["tono visual", "diseño distintivo", "UX profesional", "validar accesibilidad", "mejorar UI"]
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

3️⃣ Diferenciador clave:
   ¿Qué recordará el usuario? (máx 1 frase)
   Ej: "Transiciones suaves entre módulos con stagger animation"
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

### ❌ PROHIBIDO (Bloquear automáticamente)
- Librerías de animación externas (GSAP, Framer Motion)
- Fonts vía CDN (`<link href="https://fonts.googleapis.com">`)
- Shaders CSS complejos o `clip-path` animado pesado
- Scroll-triggered JS que requiera IntersectionObserver complejo
- Imágenes de fondo base64 >50KB (impacto en carga inicial)

---

## 🛡️ CHECKLIST UX CRÍTICO (Adaptado de ui-ux-pro-max)

### Prioridad 1: Accesibilidad (CRÍTICO - Bloquea entrega si falla)
- [ ] Contraste texto/fondo ≥ 4.5:1 (WCAG AA) → Validar con devtools > Accessibility
- [ ] Labels visibles en inputs (no solo placeholder) → `<label for="email">Email</label>`
- [ ] `aria-label` en botones con solo icono → `<button aria-label="Eliminar"><i class="bi bi-trash"></i></button>`
- [ ] Focus ring visible: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- [ ] Mensajes de error cerca del campo, en español, con icono `bi-exclamation-triangle`

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
🎨 Tono seleccionado: [2] Moderno vibrante
✨ Aplicando:
  • Gradiente en headers: bg-gradient-to-r from-primary to-secondary
  • Acentos: animate__pulse en botones hover (200ms)
  • Tipografía: font-black en títulos, font-light en subtítulos
  • Espacial: rounded-t-2xl rounded-b-lg en tarjetas principales

✅ Configuración aplicada. Procediendo con generación de código.
```

---

## 📝 NOTAS PARA LA IA
- Esta SKILL **no genera código por sí sola**. Solo valida, sugiere y corrige.
- Siempre prioriza **compatibilidad offline**: si una sugerencia requiere CDN/build, descártala.
- Si el usuario elige "tono visual [6] defaults", usa los colores de `project.config.js` sin modificar.
- En validación, sé específico: no digas "mejorar contraste", di "cambiar `text-gray-500` a `text-gray-700` en línea 42 de `module.html`".
- Mantén el lenguaje en español técnico pero accesible.

✨ **SKILL ready. Se activa automáticamente con spec-creator o validation-offline.**
```

---