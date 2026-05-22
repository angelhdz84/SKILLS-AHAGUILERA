---
name: prompt-inicial
description: Prompt maestro para iniciar un nuevo proyecto offline-first. Orquesta automáticamente: setup → spec (con detección de librerías externas) → generación de código → validación. Solo requiere nombre, tipo y descripción de la app.
license: MIT
compatibility: Requiere @AGENTS.md y las 7 SKILLs base instaladas en ~/.opencode/skills/. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.0"
  generatedBy: "prompt-inicial orchestrator"
  triggers: ["nuevo proyecto", "iniciar pipeline", "crear app", "iniciar flujo", "prompt-inicial"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  pipeline: true
---

# 🚀 PROMPT: prompt-inicial (Orquestador Maestro del Pipeline)

> **Propósito**: Orquestar automáticamente todo el flujo de desarrollo freelance: setup → spec → generación → validación. Solo requiere rellenar 5 campos rápidos.
> **Modo**: Orquestador interactivo | **Idioma**: ES | **Contexto**: Requiere las 7 SKILLs base cargadas
> **Output**: Guía paso a paso con pausas explícitas y handoff entre fases

---

## 📝 CONFIGURACIÓN RÁPIDA (Rellenar antes de enviar)
```text
📦 Nombre del proyecto: [Ej: ClinicaDentalPro]
🎯 Tipo de app: [Ej: Gestión de citas y pacientes]
💡 Descripción breve (1-2 líneas): [Ej: App para recepcionistas que permite registrar pacientes, agendar citas y exportar reportes diarios. Todo offline.]
🎨 Tono visual: [1-6] (1: Profesional, 2: Vibrante, 3: Minimal, 4: Editorial, 5: Retro, 6: Default config)
🔑 Módulos requeridos: [Ej: dashboard, pacientes, citas, reportes, settings]
```

---

## ⚙️ FLUJO AUTOMÁTICO (Ejecutar paso a paso)
Al recibir la configuración, sigue ESTE orden exacto. **PAUSA tras cada fase y espera `✅ CONTINUAR`**:

1️⃣ **FASE SETUP**
→ Ejecuta: `iniciar setup`
→ Valida entorno, crea estructura, genera `project.config.js` y `descargar-libs.bat`.
→ Si ya existe `specs/[nombre].md` con `libreriasAdicionales`, las inyecta en el `.bat`.
→ Espera confirmación del usuario tras ejecutar `.bat`.
→ ⏸️ **PAUSA**: Espera `✅ FASE 1 OK`

2️⃣ **FASE SPEC**
→ Ejecuta: `definir spec app`
→ Usa la configuración rápida como historia de usuario.
→ Incluye **Fase 0.6 (Detección de librerías externas)**: propone librerías según la descripción de la app.
→ Genera asunciones, preguntas 4+1 con barra `▓▓░░`, y guarda en `specs/[nombre].md`.
→ Aplica automáticamente principios de `design-ux-intelligence` si se solicitó tono visual.
→ Si se detectaron librerías adicionales, se registran en la spec bajo `## 📚 Librerías Adicionales`.
→ ⏸️ **PAUSA**: Espera `✅ FASE 2 OK`

3️⃣ **FASE GENERACIÓN**
→ Ejecuta: `generar codigo`
→ Lee `specs/[nombre].md` (incluyendo `libreriasAdicionales`).
→ FASE A: Core + `index.html` con libs base + adicionales en orden → Pausa para `✅ CORE OK`
→ FASE B: Módulos uno por uno → Pausa para `✅ [modulo] OK`
→ Aplica `stack-compliance-guard` automáticamente tras cada bloque (valida libs adicionales).
→ ⏸️ **PAUSA**: Espera `✅ FASE 3 OK`

4️⃣ **FASE VALIDACIÓN**
→ Ejecuta: `validar app`
→ Análisis estático + comandos DevTools + checklist UX.
→ Genera `docs/validacion-[nombre].md`.
→ Si todo ✅ → Entrega checklist final. Si ❌ → Ofrece correcciones puntuales.
→ ⏸️ **PAUSA**: Espera `✅ FASE 4 OK` o ajustes.

---

## 🛡️ REGLAS NO NEGOCIABLES (Recordatorio para IA)
- ❌ PROHIBIDO: `import`/`export`, `type="module"`, `fetch`, CDNs, build steps.
- ✅ OBLIGATORIO: Variables globales (`Dexie`, `CryptoJS`, `Alpine`), rutas `assets/`, `file://` compatible.
- 🔐 Cifrado automático en campos sensibles definidos en la spec.
- 📐 UI: DaisyUI + Bootstrap Icons + Animate.css. Español. Responsive.
- 📚 **Librerías adicionales**: Se descargan en setup (no en runtime). Van en `assets/js/libs/`. Se cargan en index.html entre libs base y core.
- ⏸️ PAUSA EXPLÍCITA tras cada fase. No generes todo de una vez. Respeta el contexto de OpenCode.

---

## 📤 OUTPUT ESPERADO
Al finalizar, muestra:
```
🚀 PIPELINE COMPLETADO
✅ Estructura: lista
✅ Spec: specs/[nombre].md (con librerías adicionales detectadas)
✅ Librerías: 12 base + N adicionales descargadas
✅ Código: core/ + modules/ generados y validados
✅ Reporte: docs/validacion-[nombre].md
📦 Listo para: empaquetar (ZIP) o build electron
💡 Siguiente: ¿Necesitas ajustes, documentación final o empaquetado?
```

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs
| SKILL | Rol en este flujo | Trigger usado |
|-------|------------------|---------------|
| `setup-init` | Fase 1: Entorno y librerías | `iniciar setup` |
| `spec-creator` | Fase 2: Definición técnica | `definir spec app` |
| `design-ux-intelligence` | Integración visual/UX | Auto-activada por spec-creator |
| `stack-compliance-guard` | Validación en cada output | Auto-activada |
| `code-generator` | Fase 3: Código funcional | `generar codigo` |
| `validation-offline` | Fase 4: Reporte final | `validar app` |

---

## 📝 NOTAS PARA LA IA
- **Este prompt es un orquestador**: No genera código directamente, solo coordina las SKILLs existentes.
- **Respeta las pausas explícitas**: OpenCode pierde contexto si se generan >15k tokens de una vez.
- **Mantén el flujo lineal**: No saltes fases ni asumas que el usuario ya ejecutó un paso.
- **Si el usuario interrumpe**, guarda el estado actual y pregunta: `⏸️ ¿Deseas continuar donde lo dejamos o reiniciar el pipeline?`
- **Idioma**: Todo en español técnico pero claro.

✨ **PROMPT ready. Trigger: `nuevo proyecto` para iniciar.**
```

---
