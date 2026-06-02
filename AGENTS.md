# SKILLS-AHAGUILERA — Instrucciones para OpenCode

{file:.opencode/rules/STACK.md}
{file:.opencode/rules/PIPELINE.md}
{file:.opencode/rules/TOOL_USAGE.md}
{file:.opencode/rules/RESPONSE_STYLE.md}

## Estructura del repo

```
skill-name/SKILL.md            — cada skill es un archivo YAML+Markdown autónomo
project.config.js              — configuración white-label
components/pines/              — 35 componentes Alpine.js + Tailwind paste-able
tests/test_app.py              — Playwright E2E (channel="chrome")
tests/test-app.html            — app de prueba Alpine.js para E2E
wiki/                          — wiki de conocimiento persistente (generado por llm-wiki)
docs/                          — reportes de validación / screenshots (generados, excluir commits)
specs/                         — specs técnicas (generadas por spec-creator)
ux-refactor/                   — skill de refactorización UX/UI (4 fases)
github-page-publish/           — skill de publicación y deploy a GitHub Pages
daisyui-patterns/              — skill de patrones DaisyUI 5 + Alpine.js
guia-skills-mcps.html          — guía de skills y MCPs
manual-referencia.html         — manual offline de referencia de skills
manual-de-uso.html             — manual de uso de skills con ejemplos prácticos
PLANTILLA DE CONTRATO FREELANCE.txt
PLANTILLA DE CORREO DE ENTREGA PROFESIONAL.txt
```

## Comandos disponibles

Usa `/comando` en OpenCode:
`/new` `/setup` `/spec` `/build` `/test` `/compliance` `/status` `/archive` `/docs` `/wiki`
