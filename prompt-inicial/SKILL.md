---
name: prompt-inicial
description: Prompt maestro para iniciar un nuevo proyecto offline-first. Orquesta automáticamente: setup → spec → generación de código → validación. Solo requiere nombre, tipo y descripción de la app.
version: "1.0"
language: es
triggers: ["nuevo proyecto", "iniciar pipeline", "crear app", "iniciar flujo"]
---
# 🚀 PROMPT INICIAL: Nuevo Proyecto Offline-First

> **Instrucción**: Copia este archivo en `%USERPROFILE%\.opencode\prompts\prompt-inicial.md`.
> **Activación**: Escribe `nuevo proyecto` en OpenCode. Rellena la plantilla y envía.

---

## 📝 CONFIGURACIÓN RÁPIDA (Rellena antes de enviar)
```text
📦 Nombre del proyecto: [Ej: ClinicaDentalPro]
🎯 Tipo de app: [Ej: Gestión de citas y pacientes]
💡 Descripción breve (1-2 líneas): [Ej: App para recepcionistas que permite registrar pacientes, agendar citas y exportar reportes diarios. Todo offline.]
🎨 Tono visual: [1-6] (1: Profesional, 2: Vibrante, 3: Minimal, 4: Editorial, 5: Retro, 6: Default config)
🔑 Módulos requeridos: [Ej: dashboard, pacientes, citas, reportes, settings]

⚙️ FLUJO AUTOMÁTICO (Ejecutar paso a paso)
Al recibir la configuración, sigue ESTE orden exacto. PAUSA tras cada fase y espera ✅ CONTINUAR:
1️⃣ FASE SETUP
→ Ejecuta: iniciar setup
→ Valida entorno, crea estructura, genera project.config.js y descargar-libs.bat.
→ Espera confirmación del usuario tras ejecutar .bat.
2️⃣ FASE SPEC
→ Ejecuta: definir spec app
→ Usa la configuración rápida como historia de usuario.
→ Genera asunciones, preguntas 4+1 con barra ▓▓░░, y guarda en specs/[nombre].md.
→ Aplica automáticamente principios de design-ux-intelligence.
3️⃣ FASE GENERACIÓN
→ Ejecuta: generar codigo
→ Lee specs/[nombre].md.
→ FASE 2: Core + index.html → Pausa para ✅ FASE 2 OK.
→ FASE 3: Módulos uno por uno → Pausa para ✅ [modulo] OK.
→ Aplica stack-compliance-guard automáticamente tras cada bloque.
4️⃣ FASE VALIDACIÓN
→ Ejecuta: validar app
→ Análisis estático + comandos DevTools + checklist UX.
→ Genera docs/validacion-[nombre].md.
→ Si todo ✅ → Entrega checklist final. Si ❌ → Ofrece correcciones puntuales.
🛡️ REGLAS NO NEGOCIABLES (Recordatorio para IA)
❌ PROHIBIDO: import/export, type="module", fetch, CDNs, build steps.
✅ OBLIGATORIO: Variables globales (Dexie, CryptoJS, Alpine), rutas assets/, file:// compatible.
🔐 Cifrado automático en campos sensibles definidos en la spec.
📐 UI: DaisyUI + Bootstrap Icons + Animate.css. Español. Responsive.
⏸️ PAUSA EXPLÍCITA tras cada fase. No generes todo de una vez.
📤 OUTPUT ESPERADO
Al finalizar, muestra:

🚀 PIPELINE COMPLETADO
✅ Estructura: lista
✅ Spec: specs/[nombre].md
✅ Código: core/ + modules/ generados y validados
✅ Reporte: docs/validacion-[nombre].md
📦 Listo para: empaquetar (ZIP) o build electron
💡 Siguiente: ¿Necesitas ajustes, documentación final o empaquetado?