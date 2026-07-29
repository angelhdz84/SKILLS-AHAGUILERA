# Guía de la Skill-Layer Architecture del Stack Ateje

La Skill-Layer Architecture organiza el Stack Ateje en 3 capas:

## 1. Motores (Engines) — Capa de orquestación
5 engines que reemplazan funcionalidad previa y orquestan el pipeline:
- **pipeline-engine**: Orquestador maestro dual (Classic 5 fases / Design 10 fases)
- **spec-engine**: Spec funcional + DESIGN.md brand layer con 286 referencias oh-my-design
- **design-engine**: Brand context injection + tokens DaisyUI/alpine-ui-patterns
- **validation-engine**: 4 fases: compliance → brand audit → DevTools/Playwright → QA rubric
- **wiki-engine**: Wiki persistente + preferencias de diseño + memoria Engram

## 2. Skills Standalone — Capa de ejecución
8 skills que implementan funcionalidad específica:
- setup-init, code-generator, stack-compliance-guard, deployment-jigue
- ia-jutia, alpine-ui-patterns, capacitor, upgrade-engine

## 3. Skills Externas (oh-my-design) — Capa de referencia
16 skills OMD + es-writer para microcopy. Consumidas por los engines.

## Flujo de datos
Las capas se comunican mediante artefactos (specs/, DESIGN.md, .omd/preferences.md, modules/*) siguiendo los contratos definidos en AGENTS.md y PIPELINE.md.

Ver contrato completo en AGENTS.md sección "Contratos entre Skills".
