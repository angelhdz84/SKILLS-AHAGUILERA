---
name: prompt-inicial
description: Prompt maestro para iniciar un nuevo proyecto offline-first. Orquesta automáticamente: setup → spec (con detección de librerías externas) → generación de código → validación. Solo requiere nombre, tipo y descripción de la app.
license: MIT
compatibility: Requiere @AGENTS.md y las 7 SKILLs base instaladas en ~/.opencode/skills/. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "3.0"
  perfiles: [lite, full]
  generatedBy: "prompt-inicial orchestrator"
  triggers: ["nuevo proyecto", "iniciar pipeline", "crear app", "iniciar flujo", "prompt-inicial", "/pro"]
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
📦 Perfil: [lite/full]
   (lite) file:// + Dexie + CryptoJS — doble clic, sin dependencias
   (full) Bun + SQLite + Web Crypto — .exe instalable profesional
🧠 IA Jutia: [lite/full/no]
   (lite) FlexSearch + estadísticas + predicciones (~7KB)
   (full) +Ingesta documentos + QA con Transformers.js (~233MB)
   (no) Sin módulo de IA
```

---

## ⚙️ FLUJO AUTOMÁTICO (Ejecutar paso a paso)
Al recibir la configuración, sigue ESTE orden exacto. **PAUSA tras cada fase y espera `✅ CONTINUAR`**:

1️⃣ **FASE SETUP**
→ Ejecuta: `iniciar setup`
→ Según perfil:
   • **Lite**: Valida entorno, `mkdir`, genera `project.config.js` y `descargar-libs.bat` con curl.
   • **Full**: Valida Bun, `bun init`, genera `package.json` y estructura con dependencias npm.
→ Si existe `specs/[nombre].md` con `libreriasAdicionales`, las inyecta.
→ Si perfil=Full e incluye IA Full, descarga modelos Transformers.js.
→ Espera confirmación del usuario.
→ ⏸️ **PAUSA**: Espera `✅ FASE 1 OK`

2️⃣ **FASE SPEC**
→ Ejecuta: `definir spec app`
→ Usa la configuración rápida como historia de usuario.
→ Incluye **Fase 0.6 (Detección de librerías externas)**: propone librerías según la descripción de la app.
→ Si perfil=Full, genera Modelo de Datos con schema SQL además del schema Dexie.
→ Genera asunciones 4+1 con barra `▓▓░░`, y guarda en `specs/[nombre].md`.
→ Aplica automáticamente principios de `design-ux-intelligence` si se solicitó tono visual.
→ Si se detectaron librerías adicionales, se registran en la spec bajo `## 📚 Librerías Adicionales`.
→ ⏸️ **PAUSA**: Espera `✅ FASE 2 OK`

3️⃣ **FASE GENERACIÓN**
→ Ejecuta: `generar codigo`
→ Lee `specs/[nombre].md` (incluyendo `libreriasAdicionales`).
→ Según perfil, code-generator usa templates compartidos (95%) + específicos de perfil:
   • **Lite**: `core/db.js` (Dexie), `index.html` (file://), assets/libs por curl.
   • **Full**: `core/db.js` (Dexie, mismo), `index.html` (servido por Bun), `src/index.js` (entry point).
→ FASE A: Core + `index.html` con libs base + adicionales en orden → Pausa para `✅ CORE OK`
→ FASE B: Módulos uno por uno → Pausa para `✅ [modulo] OK`
→ Si se incluyó IA Jutia, genera `modules/ia-jutia/` según perfil Lite/Full.
→ Aplica `stack-compliance-guard` automáticamente tras cada bloque.
→ ⏸️ **PAUSA**: Espera `✅ FASE 3 OK`

4️⃣ **FASE VALIDACIÓN**
→ Ejecuta: `validar app`
→ Análisis estático + comandos DevTools + checklist UX.
→ Si perfil=Full: validar que Bun compila correctamente.
→ Genera `docs/validacion-[nombre].md`.
→ Si todo ✅ → Entrega checklist final. Si ❌ → Ofrece correcciones puntuales.
→ ⏸️ **PAUSA**: Espera `✅ FASE 4 OK` o ajustes.

5️⃣ **FASE EMPAQUETADO Y DEPLOY (opcional)**
→ Ejecuta: `publicar` (deployment-jigue)
→ **Lite**: Genera ZIP para distribución + GitHub Pages.
→ **Full**: `bun build --compile .exe` + GitHub Pages + Release en GitHub.
→ ⏸️ **PAUSA**: Espera confirmación final.

---

## 🛡️ REGLAS NO NEGOCIABLES (Recordatorio para IA)
- ❌ PROHIBIDO (Lite): `import`/`export`, `type="module"`, `fetch`, CDNs, build steps.
- ✅ PERMITIDO (Full): `import` dentro de `src/` para Bun, web server para servir archivos.
- ✅ OBLIGATORIO (ambos): Variables globales (`Dexie`, `CryptoJS`, `Alpine`), rutas relativas.
- 🔐 Cifrado con CryptoJS en ambos perfiles (campos sensibles definidos en spec).
- 📐 UI: DaisyUI + Bootstrap Icons + Animate.css. Español. Responsive.
- 📚 **Librerías adicionales**: Se descargan en setup (no en runtime). Lite a `assets/js/libs/`, Full vía npm.
- 🧠 IA Jutia: Opcional. Lite usa FlexSearch (assets/). Full usa modelos Transformers (assets/models/).
- ⏸️ PAUSA EXPLÍCITA tras cada fase. No generes todo de una vez. Respeta el contexto de OpenCode.
- 📦 Perfil define setup, empaquetado y deploy. El frontend (Alpine + módulos) es idéntico en ambos.

---

## 📤 OUTPUT ESPERADO
Al finalizar, muestra:
```
🚀 PIPELINE COMPLETADO
📦 Perfil: [lite|full]
✅ Estructura: lista
✅ Spec: specs/[nombre].md (con librerías adicionales detectadas)
✅ Librerías: base + adicionales descargadas
✅ Código: core/ + modules/ generados y validados
✅ Reporte: docs/validacion-[nombre].md
🧠 IA Jutia: [lite|full|no]
📦 Package: [dist/[app].zip | dist/[app].exe]
🚀 Siguiente: publicar en GitHub Pages o distribuir el paquete
💡 Comando: publicar para deploy completo
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
| `ia-jutia` | Módulo de IA opcional (Lite/Full) | `mini ia` |
| `validation-offline` | Fase 4: Reporte final | `validar app` |
| `deployment-jigue` | Fase 5: Empaquetado y deploy | `publicar` |
| `supercharged-pipeline` | Pipeline potenciado SP+SA (alternativa a /new) | `/pro` |
| `ux-refactor` | Refactor UX/UI para apps existentes | `/refactor` |
| `daisyui-patterns` | Patrones DaisyUI 5 + Alpine.js | Auto-activada por code-generator |

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
