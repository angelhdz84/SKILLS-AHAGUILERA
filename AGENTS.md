# SKILLS-AHAGUILERA — Instrucciones para OpenCode

{file:.opencode/rules/STACK.md}
{file:.opencode/rules/PIPELINE.md}
{file:.opencode/rules/TOOL_USAGE.md}
{file:.opencode/rules/RESPONSE_STYLE.md}

## Identidad

Meta-repo de 14 skills OpenCode (SKILL.md autónomos en directorios raíz) para crear apps offline-first con dos perfiles (Lite/Full). No es una app. Skills generan apps en directorios externos, no dentro del repo.

## Perfiles

| Perfil | Runtime | DB | Cifrado | Empaquetado |
|--------|---------|----|---------|-------------|
| Lite | Doble clic `index.html` | Dexie (IndexedDB) | CryptoJS | ZIP + GitHub Pages |
| Full | Bun --compile .exe | Dexie + SQLite (opcional) | CryptoJS | .exe + Pages + Release |

El frontend (Alpine + DaisyUI + módulos) es ~95% idéntico entre perfiles.

## Skills

| Directorio | Propósito | Perfiles |
|-----------|-----------|----------|
| `prompt-inicial/` | Orquestador maestro del pipeline completo | lite, full |
| `setup-init/` | Valida entorno, crea estructura, instala librerías | lite, full |
| `spec-creator/` | Historia de usuario → spec técnica validada v4 | lite, full |
| `design-ux-intelligence/` | Diseño visual + checklist UX crítico | lite, full |
| `stack-compliance-guard/` | Guarda automática: bloquea imports, CDNs, fetch, crypto faltante | lite, full |
| `code-generator/` | Genera código por fases desde specs, un módulo por turno | lite, full |
| `validation-offline/` | Validación estática + DevTools + Playwright E2E + reporte | lite, full |
| `ux-refactor/` | Refactor UX/UI 4 fases para apps offline-first existentes | lite, full |
| `ux-ui-universal/` | Refactor UX/UI multi-stack vía context7 (React, Django, etc.) | multi-stack |
| `deployment-jigue/` | Commit + push + Pages + ZIP (Lite) / .exe + Release (Full) | lite, full |
| `daisyui-patterns/` | Patrones DaisyUI 5 + Alpine.js | lite, full |
| `ia-jutia/` | Mini IA: FlexSearch (Lite) / +ingesta docs + QA (Full) | lite, full |
| `supercharged-pipeline/` | Pipeline potenciado SP+SA: brainstorming => subagents => dual review | lite, full |
| `llm-wiki/` | Wiki persistente (markdown versionado + MCP memory graph) | lite, full |
| `github-page-publish/` | **(deprecado)** Reemplazado por deployment-jigue | — |

## Agente Orchestrator

El agente **Orchestrator** (registrado en `opencode.json` como agente `primary`) es la puerta de entrada principal del pipeline. Soporta dos modos:

| Modo | Comando | Pipeline | Cuándo usarlo |
|------|---------|----------|---------------|
| Clásico | `/new` | 5 fases: setup → spec → build → validate → deploy | Proyectos simples, prototipos rápidos |
| Supercharged | `/pro` | 7 fases: brainstorming → spec → writing-plans → subagents → dual review → deploy | Proyectos complejos, producción, equipo |

El Orchestrador pregunta el modo si no se especifica. Si Superpowers no está instalado, hace fallback automático al modo clásico.

## MCP Servers

- `mcp-servers/stocky/` — Python. Busca imágenes Pexels + Unsplash. Setup: `pip install -e .`
- `mcp-servers/refero-styles/` — TypeScript. Busca sistemas de diseño en refero.design. Setup: `npm install && npm run build`

## Comandos slash

| Comando | Trigger | Efecto |
|---------|---------|--------|
| `/new` | `nuevo proyecto` | Pipeline clásico 5 fases vía Orchestrator (setup→spec→build→validate→deploy) |
| `/setup` | `iniciar setup` | Crea estructura + instala librerías según perfil |
| `/spec` | `definir spec app` | spec-creator con fases de refinamiento |
| `/build` | `generar codigo` | Fase A (core/index.html) + Fase B (módulos uno por uno) |
| `/test` | `validar app` | Estático + DevTools + Playwright + reporte en docs/ |
| `/compliance` | — | Ejecuta stack-compliance-guard manualmente |
| `/status` | — | Lee pipeline state (specs/, project.config.js, docs/) |
| `/archive` | — | Mueve spec + reporte a specs/archive/ |
| `/docs` | — | Abre guia-skills-mcps.html |
| `/ia` | `mini ia` | Activa ia-jutia (pregunta perfil Lite/Full/No) |
| `/deploy` | `publicar` | deployment-jigue: commit + push + empaquetado según perfil |
| `/pro` | `pipeline potenciado` | Pipeline supercharged 7 fases vía Orchestrator: brainstorming→spec→writing-plans→subagents→dual review→deploy |

## Directorios generados (no versionar)

`docs/`, `specs/`, `wiki/` son output de skills. `tests/` contiene app de prueba y resultados.

## Tests

```powershell
cd tests; python -m pytest test_app.py -v
```

Playwright E2E sobre `test-app.html` (Alpine.js task manager). Requiere Chrome system channel.

## Deploy

Push a `main` → GitHub Actions (`deploy-pages.yml`) → GitHub Pages. Sin build step (`path: .`).

Para empaquetado profesional: `publicar` → deployment-jigue segun perfil.
