---
name: code-review-engine
description: Revisa el código mientras lo escribes en 4 ejes — Compliance (reglas stack Ateje), Calidad (smells Fowler + reglas ES5), Spec (specs/[app].md) y Brand (DESIGN.md). Se ejecuta automáticamente tras cada bloque de código generado o editado, cuando dices "revisa", "revísalo", "revisa el código", "code review", "cómo está el código" — incluso si no pides explícitamente una revisión formal. Incluye modo auto-fix con confirmación por lote y comando /review para diffs git completos. Usa dos subagentes en paralelo (review-agent + spec-reviewer) para no contaminar el contexto. Es la capa de calidad que corre entre cada escritura de código y la validación final de validation-engine.
license: MIT
compatibility: Requiere @AGENTS.md, specs/[app].md, stack-compliance-guard y (para brand) DESIGN.md. Funciona con diff git o con archivos del turno actual.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, professional, business]
  generatedBy: "code-review-engine skill"
  triggers: ["revisa", "revisalo", "revisar codigo", "code review", "review", "revision", "como esta el codigo", "repasa el codigo", "mirar el codigo"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  autoActivate: true
  requires: [stack-compliance-guard, validation-engine, code-generator]
---

# 🔍 code-review-engine — Revisión Continua 4 Ejes

> **Propósito**: Revisar el código **mientras se escribe**, no en batch al final. Correr sobre cada bloque generado/editado para atrapar errores antes de que se propaguen. 4 ejes en paralelo: Compliance, Calidad, Spec, Brand.
> **Modo**: Auto-trigger + a demanda | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md + spec + stack-compliance-guard

---

## 🔄 ACTIVACIÓN

Esta skill se ejecuta:
1. **Auto**: tras cada bloque de código que genere `code-generator` (FASE 2 core y FASE 3 cada módulo).
2. **Auto**: cuando el usuario pide revisar ("revisa", "revísalo", "cómo está el código", "code review").
3. **Manual**: vía `/review` para revisar diffs git completos (ramas, PRs, work-in-progress).

**Flujo**: Se escribe código → se corre la revisión 4 ejes → se reportan findings con severidad → auto-fix determinístico con confirmación → re-revisión (máx 2 rondas).

---

## 🧭 LOS 4 EJES

| Eje | Qué revisa | Fuente | Severidad |
|-----|-----------|--------|-----------|
| **1. Compliance** | Imports ES6, CDN/fetch, cifrado, rutas `file://`, orden scripts, contrato módulo, a11y mínima | `stack-compliance-guard` (delegado) | BLOCK si violación dura |
| **2. Calidad** | 12 smells Fowler + reglas R-A (async reservado, >50 líneas, try/catch real, alert nativo, emojis, TODOs) | `references/fowler-smells.md` | WARN / BLOCK |
| **3. Spec** | Requisitos faltantes/parciales, scope creep, implementación incorrecta | `specs/[app].md` | BLOCK si requisito faltante |
| **4. Brand/UX** | Tokens DESIGN.md, jerarquía tipográfica, color budget, radius, states, mobile, microcopy | `validation-engine` Fase 2+4 (heredado) | WARN / BLOCK |

Los ejes **1+2** los corre el subagente `review-agent`; los ejes **3+4** los corre `spec-reviewer`. Se lanzan **en paralelo** (dos subagentes) para no contaminar contextos y luego se agregan los reportes.

---

## ⚙️ PROCESO

### Modo Auto (turno actual)

1. Recoge el material del turno: archivos generados/editados en este turno (o el último bloque entregado por code-generator).
2. Determina contexto: perfil (project.config.js), ruta de spec, existencia de DESIGN.md.
3. Lanza `review-agent` (Ejes 1+2) y `spec-reviewer` (Ejes 3+4) en paralelo con el material.
4. Agrega los reportes bajo `## Eje 1+2` y `## Eje 3+4`.
5. Determina el veredicto global:
   - **BLOCK** si hay algún `[BLOCK]` → no mostrar código nuevo hasta corregir.
   - **WARN** si solo hay `[WARN]`/`[FYI]` → mostrar código + nota.
   - **PASS** si no hay hallazgos.

### Modo /review (diff git)

1. Fija el punto de referencia que dé el usuario (commit SHA, rama, tag, `main`, `HEAD~5`). Si no lo da, pregúntalo.
2. Captura el diff: `git diff <punto>...HEAD` (tres puntos → merge-base) y `git log <punto>..HEAD --oneline`.
3. Confirma que el punto resuelve (`git rev-parse`) y que el diff no está vacío. Si no, falla aquí.
4. Identifica la spec fuente: referencias en mensajes de commit (#123), ruta pasada, o `specs/[app].md`.
5. Lanza los dos subagentes en paralelo con el diff y sus respectivas fuentes.
6. Presenta ambos reportes lado a lado. No los fusiones ni re-rankees — los dos ejes son deliberadamente separados.
7. Cierre: una línea por eje con total de findings y el peor issue de cada eje.

### Modo Auto-fix

Después de reportar:

- **Determinístico** (imports → variable global, campo sin cifrar → `cryptoHelpers.encrypt()`, `alert()` → `UI.toast()`, `async` reservado → mover modificador, emoji → icono, `// TODO` → completar): agrupar y preguntar en lote:
  ```
  🛡️ Code Review: 3 fixes determinísticos detectados.
  ¿Aplico? [1] Sí, todos (RECOMENDADO) [2] Solo algunos [3] No, los corrijo yo
  ```
- **Ambiguo** (fetch, refactor, scope creep, cambio de arquitectura): preguntar con opciones, estilo stack-compliance-guard:
  ```
  Se detectó: [hallazgo] en [archivo:línea]
  Opciones:
  [1] [fix recomendado]
  [2] [alternativa]
  [3] No tocar
  ```
- **No corregir sin preguntar** — el usuario decide. Tras el fix, re-correr los ejes afectados (máx 2 rondas).

---

## 📋 OUTPUT

```markdown
# Revisión: [módulo/archivo]

## Eje 1+2 — Compliance + Calidad
[BLOCK] imports ES6 en modules/pos/module.js:3 → usar variable global window.db
[WARN]  (R-A5) alert() nativo en module.js:87 → UI.toast()
✅ Compliance: sin CDNs, cifrado aplicado, contrato módulo OK

## Eje 3+4 — Spec + Brand
[BLOCK] Falta campo 'correo' en form — spec pos.md:132 lo pide obligatorio
[FYI]   Voice: toast "Operación exitosa" — DESIGN.md:201 espera "Listo, guardado"

## Veredicto: BLOCK (1 crítico)
→ Corrige el bloqueo antes de continuar. ¿Aplico el fix?

## Auto-fix aplicado (si aplica)
- [module.js:3] imports eliminados → variable global
```

---

## 📏 REGLAS

- **Cada finding lleva `[BLOCK]`/`[WARN]`/`[FYI]` + `archivo:línea`**. Sin línea = no es finding.
- **No "looks good" sin evidencia**: cada PASS requiere haber mirado el código y no encontrar nada.
- **Max 2 rondas** de revisión por ciclo. Después, escalar al usuario.
- **Idioma ES** en todo el output (los nombres técnicos pueden quedar en inglés).
- **No duplicar el guard**: Eje 1 delega en stack-compliance-guard; si el guard ya bloqueó, la skill lo respeta y solo reporta lo nuevo.
- **Los 2 subagentes corren en paralelo** siempre que sea posible. El orquestador no revisa por su cuenta antes de que ellos reporten.
- **El reporte del Eje 3+4 cita la línea de spec/DESIGN.md** en cada BLOCK.

---

## 🔗 INTEGRACIÓN

- **En `code-generator`**: tras FASE 2 (core) y cada módulo de FASE 3, ejecutar esta skill sobre el bloque entregado antes de la pausa.
- **En `validation-engine`**: esta skill es el "code review continuo" previo; validation-engine sigue siendo la validación final 4 fases (DevTools, Playwright, rubric). No se reemplazan.
- **En `stack-compliance-guard`**: el guard valida; esta skill revisa y además evalúa calidad/spec/brand. Trabajan en cadena: guard → review → validate.

---

## 🧠 NOTAS PARA LA IA

- **Auto-activación**: usa la descripción para disparar ante cualquier pedido de revisión, incluso informal ("mira si está bien esto").
- **Dos subagentes, no uno**: mantener el contexto de estándares separado del de spec evita que un eje opaque al otro (patrón mattpocock).
- **Prioridad**: un BLOCK de Compliance detiene todo. Un BLOCK de Spec requiere fix antes de continuar. WARN se puede diferir.
- **En archivos sin spec**: Eje 3 reporta "no hay spec" y sigue con el resto.
- **En modo auto, si el material es trivial** (un rename, un string): se puede omitir el subagente y reportar PASS directo. No gastar tokens en ruido.

✨ **SKILL ready v1. Se activa automáticamente tras cada cambio de código.**
