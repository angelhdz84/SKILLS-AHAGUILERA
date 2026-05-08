---
name: spec-creator
description: Transforma ideas de apps completas en especificaciones técnicas validadas para stack offline-first. Flujo interactivo con asunciones numeradas, preguntas 4+1 con barra de progreso, y generación de spec en specs/[app].md.
license: MIT
compatibility: Requiere @AGENTS.md y @project.config.js presentes. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta
  author: Angel Hernandez - ahaguilera.dev
  version: "2.1"
  generatedBy: "spec-creator skill"
  triggers: ["definir spec app", "nueva app completa", "crear especificación", "historia de app", "spec creator"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  outputPath: "specs/"
  autoSave: true
---

# 🎯 SKILL: spec-creator (Definición de Apps Offline-First)

> **Propósito**: Transformar una idea de app completa en una especificación técnica validada, paso a paso, cumpliendo estrictamente las reglas del stack offline-first.
> **Modo**: Interactivo | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md y @project.config.js
> **Output**: Guarda spec validada en `specs/[nombre-app-lowercase].md`

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Recepción + Validación de Stack
1. Recibe la descripción de la app completa.
2. Ejecuta **AUTO-VALIDACIÓN** contra `@AGENTS.md` antes de responder:
   ```
   🔍 VALIDACIÓN DE STACK
   - ❌ Imports/ES6/Modules: [x] Prohibidos
   - ❌ Servidor/CDN/Fetch: [x] Prohibidos (file://)
   - 🔐 Cifrado campos sensibles: [x] Obligatorio (CryptoJS)
   - 📐 UI: [x] DaisyUI + Bootstrap Icons + Animate.css
   - ⚙️ Config: [x] Todo registrable en project.config.js
   ✅ Stack validado. Procedo.
   ```
3. Si la historia sugiere violar una regla, corrige automáticamente y advierte: `⚠️ Ajustado a reglas del stack offline-first.`
4. Genera **lista numerada (6-8) de asunciones NO técnicas/NO funcionales** basadas en la historia.

### 🟡 FASE 2: Refinamiento Iterativo (Máx 8 preguntas)
1. Espera que el usuario indique qué números cambiar (ej: `2, 4, 7` o `Todas correctas`).
2. Para CADA número marcado:
   - Muestra progreso exacto: `[▓▓▓░░░░░░░░░░░] 25% • Pregunta 1/4`
   - Presenta la asunción + 4 opciones predefinidas + `[5] Otra`
   - Espera respuesta. Si `5`, pide especificación libre.
   - Actualiza spec interna.
   - Avanza.
3. Si no hay cambios o se completan las preguntas, pasa a Fase 3.

### 🔴 FASE 3: Generación de Spec + Archivo
1. Compila la spec final siguiendo esta estructura exacta:
   ```markdown
   # 📄 Especificación Técnica: [Nombre App]
   ## 🎯 Descripción
   ## ✅ Criterios de Aceptación (Gherkin)
   ## 🧱 Arquitectura y Módulos
   ## 🔐 Seguridad y Datos
   ## 🎨 UI/UX y Animaciones
   ## ⚙️ Configuración (project.config.js)
   ## 📦 Pre-requisitos y Checklist
   ```
2. **Guarda automáticamente** en: `specs/[nombre-app-lowercase].md`
3. Muestra mensaje final:
   ```
   ✅ Especificación generada y guardada en specs/[nombre].md
   📝 Snippets para project.config.js incluidos.
   ¿Procedo a generar el código base o prefieres ajustar algo más?
   ```

---

## 🛡️ AUTO-VALIDACIÓN CONTRA @AGENTS.md (EJECUTAR SIEMPRE)
Antes de cualquier output, verifica mentalmente:
- [ ] ¿Usa `import`/`export` o `type="module"`? → RECHAZAR y corregir
- [ ] ¿Asume servidor, API externa o CDN en runtime? → RECHAZAR y corregir
- [ ] ¿Omite cifrado en campos sensibles detectados? → AGREGAR regla de cifrado
- [ ] ¿UI sin DaisyUI/Icons/Animate.css? → CORREGIR componentes
- [ ] ¿Módulo no registrable en config? → AGREGAR snippet a `modulosActivos`
Si falla cualquier punto, corrige silenciosamente antes de mostrar la respuesta.

---

## 💬 FORMATO DE PREGUNTAS (Fase 2)
```
[▓▓▓░░░░░░░░░░░] {porcentaje}% • Pregunta {actual}/{total}

Asunción #{n}: "{texto}"

Opciones:
[1] {Opción técnica/UX validada por stack}
[2] {Opción alternativa segura}
[3] {Opción mínima/viable}
[4] {Opción avanzada/compleja}
[5] Otra → (especifica)

Tu respuesta: 
```

---

## 📋 LISTA DE ASUNCIONES BASE (Adaptar según historia)
1. **Arquitectura**: SPA hash-based, router en `core/app.js`, módulos en `modules/`.
2. **Datos**: IndexedDB vía Dexie, sin JOINs complejos, <1000 registros/tabla.
3. **Seguridad**: Clave cifrado en `localStorage`, prompt inicial si aplica.
4. **UI/UX**: Mobile-first, modo oscuro/claro persistente, animaciones `fadeInUp` escalonadas.
5. **Módulos**: Activables/desactivables en `project.config.js`.
6. **Backup/Export**: Manual a JSON/PDF/Excel, comprimido con pako si >1MB.
7. **Validación**: Formularios con feedback inmediato, mensajes en español, contraste WCAG AA.
8. **Entrega**: Web (ZIP) + opcional Electron, `GUIA_USUARIO.md` incluido.

---

## 🎨 INTEGRACIÓN CON design-ux-intelligence
Si el usuario menciona "tono visual", "diseño distintivo" o "UX profesional":
1. Activar automáticamente `design-ux-intelligence`
2. Preguntar:
   ```
   🎨 Tono visual preferido:
   [1] Profesional limpio  [2] Moderno vibrante  [3] Minimalista premium
   [4] Editorial  [5] Retro-futurista  [6] Usar defaults de project.config.js

   🎯 Diferenciador clave (máx 10 palabras): ____________________
   ```
3. Incluir respuestas en la spec final bajo sección "## 🎨 UI/UX y Animaciones"

---

## 📝 NOTAS PARA LA IA
- **Auto-guardado**: Siempre guarda la spec en `specs/[nombre].md` usando el formato markdown exacto.
- **Nombres de archivo**: Usa lowercase con guiones: `clinica-dental.md`, no `ClinicaDental.md`.
- **Snippets de config**: Incluye exactamente qué añadir a `project.config.js` → `modulosActivos`.
- **Idioma**: Todo en español, incluyendo comentarios de código en la spec.
- **Contexto limitado**: Si la respuesta se corta, añade `/context clear` y repite el último paso.

✨ **SKILL ready. Trigger: `definir spec app` para iniciar.**
```

---