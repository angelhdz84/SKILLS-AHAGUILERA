---
name: pipeline-engine
description: Orquestador maestro del pipeline completo. Reemplaza prompt-inicial + supercharged-pipeline + omd:harness + omd:orchestrator. Soporta dos modos: Classic (5 fases, /new) y Design (10 fases, /pro). Orquesta spec-engine → design-engine → code-generator → validation-engine → deployment-jigue.
license: MIT
compatibility: Requiere @AGENTS.md y las skills engine instaladas. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, full]
  generatedBy: "pipeline-engine orchestrator"
  triggers: ["nuevo proyecto", "iniciar pipeline", "crear app", "iniciar flujo", "/new", "/pro", "landing", "prototype", "primera pantalla"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  pipeline: true
---

# pipeline-engine — Orquestador Maestro

> **Propósito**: Orquestar automáticamente todo el flujo de desarrollo freelance: setup → spec → diseño → generación → validación → deploy.
> **Modo dual**: Classic (/new) para prototipos rápidos, Design (/pro) para proyectos complejos con sub-agentes de diseño.
> **Idioma**: ES | **Contexto**: Requiere las 5 skills engine cargadas

---

## Modos de operación

| Comando | Modo | Fases | Cuándo usarlo |
|---------|------|-------|---------------|
| `/new` | **Classic** | 5 fases: setup → spec → build → validate → deploy | Proyectos simples, prototipos rápidos |
| `/pro` | **Design** | 10 fases con sub-agentes (harness-style) | Proyectos complejos, producción, equipo |

Si no se especifica, pregunta y auto-detecta según la descripción del proyecto.

---

## Modo Classic — 5 fases

```
1. SETUP      → setup-init (valida entorno, crea estructura, instala librerías)
2. SPEC       → spec-engine (spec funcional + DESIGN.md brand layer)
3. BUILD      → design-engine aplica tokens → code-generator genera módulos
4. VALIDATE   → validation-engine (compliance + brand audit + DevTools + rubric)
5. DEPLOY     → deployment-jigue (commit + push + Pages + ZIP/.exe)
```

### ⏸️ PAUSAS

PAUSA tras cada fase. Espera confirmación explícita (`✅ CONTINUAR`). OpenCode pierde contexto >15k tokens. No generar todo de una vez.

---

## Modo Design — 10 fases

```
 1. BRAINSTORMING     → exploración de ideas con sub-agentes
 2. UX RESEARCH       → explore + design-agent (audiencia, competitors, referencias)
 3. SPEC + BRAND      → spec-engine (spec funcional + DESIGN.md con 286 referencias OmD)
 4. DESIGN SYSTEM     → design-engine define tokens: color, typography, spacing, motion
 5. UI CODING         → code-generator genera módulos + design-engine aplica tokens en vivo
 6. MICROCOPY         → omd:es-writer redacta copy profesional con voz de marca
 7. ASSETS            → omd:asset-fetch + MCP stocky (imágenes CC0, iconos, avatares)
 8. TESTING           → validation-engine fases 1-3 (compliance + DevTools + E2E)
 9. DESIGN REVIEW     → validation-engine fases 4-5 (brand audit + QA rubric)
10. DEPLOY            → deployment-jigue (según perfil Lite/Full)
```

### Safety cap

Un solo `/pro` puede ejecutar hasta 12 rondas de sub-agentes. Si se excede, se notifica al usuario y se preserva el directorio de trabajo.

---

## Detección de modo

- `/new` → Classic
- `/pro` → Design
- Descripción vaga ("crea una app de...") → pregunta: "¿Rápido (5 fases) o completo (10 fases con diseño profesional)?"
- "landing", "página principal", "prototipo" → pregunta o asume Design si hay más contexto

---

## Contrato con otras skills

| Skill engine | Rol en el pipeline |
|-------------|-------------------|
| `spec-engine` | Fase spec: genera spec funcional + DESIGN.md |
| `design-engine` | Fase diseño: aplica tokens de marca a cada módulo |
| `code-generator` | Fase build: genera código por módulos |
| `validation-engine` | Fase validate: compliance + brand audit + QA rubric |
| `deployment-jigue` | Fase deploy: publica según perfil |
| `wiki-engine` | Post-pipeline: ingesta automática de decisiones |

---

## Reglas no negociables

- ❌ PROHIBIDO (Lite): `import`/`export`, `type="module"`, `fetch`, CDNs, build steps.
- ✅ PERMITIDO (Full): `import` dentro de `src/` para Bun, web server.
- ✅ OBLIGATORIO (ambos): Variables globales, rutas relativas.
- 🔐 Cifrado con CryptoJS en ambos perfiles (campos sensibles definidos en spec).
- 📐 UI: DaisyUI + Bootstrap Icons + Animate.css. Español. Responsive.
- ⏸️ PAUSA EXPLÍCITA tras cada fase. No generar todo de una vez.
- 📦 Perfil define setup, empaquetado y deploy. Frontend idéntico en ambos.

## Output esperado

```
🚀 PIPELINE COMPLETADO
📦 Perfil: [lite|full]
✅ Estructura: lista
✅ Spec: specs/[app].md (con DESIGN.md brand layer)
✅ Tokens de marca: aplicados
✅ Código: core/ + modules/ generados y validados
✅ Reporte: docs/validacion-[app].md
🧠 IA Jutia: [lite|full|no]
📦 Package: [dist/[app].zip | dist/[app].exe]
🚀 Siguiente: publicar en GitHub Pages o distribuir el paquete
```

## Integración externa: oh-my-design

Las skills OmD instaladas en `~/.opencode/skills/omd-*/` se invocan bajo demanda:

| Función | Skill OmD | Se activa en |
|---------|-----------|-------------|
| Selección de referencia de marca | `omd:init` (fase discovery) | spec-engine |
| Live design capture | `omd:reference-capture` | design-engine (opcional) |
| Assets CC0 | `omd:asset-fetch` | Fase 7 del modo Design |
| Microcopy español | `omd:es-writer` (creado aparte) | Fase 6 del modo Design |
| Catálogo de referencias | 286 DESIGN.md en data/ | spec-engine discovery |

---

## Notas para la IA

- **Este skill es un orquestador**: No genera código directamente, solo coordina las skills engine.
- **Respeta las pausas explícitas**: OpenCode pierde contexto si se generan >15k tokens de una vez.
- **Mantén el flujo lineal**: No saltes fases ni asumas que el usuario ya ejecutó un paso.
- **Si el usuario interrumpe**, guarda el estado actual y pregunta: "⏸️ ¿Deseas continuar donde lo dejamos o reiniciar el pipeline?"
- **Idioma**: Todo en español técnico pero claro.
