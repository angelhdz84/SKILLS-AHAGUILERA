# Ateje Stack — Agent Instructions

{file:.opencode/rules/STACK.md}
{file:.opencode/rules/PIPELINE.md}
{file:.opencode/rules/TOOL_USAGE.md}
{file:.opencode/rules/RESPONSE_STYLE.md}

## Identity

Meta-repo of OpenCode skills (autonomous SKILL.md per root directory). Skills generate offline-first apps with 3 profiles (Lite/Professional/Business). **This repo is not an app** — generated apps go to external directories.

## Critical Constraints

- **No ES6 modules** in generated code (`import`/`export`/`type="module"` blocked by CORS on `file://`)
- **100% offline** — no fetch, no CDNs at runtime; libs local in `assets/` via curl
- `cryptoHelpers.encrypt()` required on all sensitive fields
- DaisyUI + Bootstrap Icons + Alpine.js only; UI in Spanish
- **Pause after each pipeline phase** — context >15k tokens causes quality loss
- **Push requires explicit user confirmation** — commit only without asking

## Agents

Registered in `opencode.json`. Primary is `orchestrator` which dispatches `pipeline-engine`.

| Agent | Mode | Permissions |
|-------|------|-------------|
| `orchestrator` | primary | edit: ask, bash: ask |
| `build-agent` | subagent | edit: allow, bash: ask |
| `spec-agent` | subagent | edit: deny, bash: deny |
| `design-agent` | subagent | edit: deny, bash: deny |
| `test-agent` | subagent | edit: ask, bash: ask |
| `review-agent` | subagent | edit: deny, bash: read-only |
| `spec-reviewer` | subagent | edit: deny, bash: read-only |

Prompts in `.opencode/prompts/[agent].md`.

## Entry Points

| Command | What it does |
|---------|-------------|
| `/new` | Classic pipeline (5 fases): setup → spec → design → build → validate → deploy |
| `/pro` | Design pipeline (10 fases): taste → init → design → spec → code → inject → review → QA → pack → deploy |
| `/build` | code-generator: Fase A (core/index.html) + Fase B (modules, one per turn) |
| `/test` | validation-engine: compliance → brand audit → DevTools/Playwright → QA rubric |
| `/deploy` | deployment-jigue: commit + push + package per profile |
| `/upgrade` | upgrade-engine: migra perfil Lite/Professional/Business e IA Lite/Full |

Full command list in `.opencode/commands/`.

## Config (`opencode.json`)

| Key | Format |
|-----|--------|
| `agent` | Object keyed by name (not array), `mode` not `type` |
| `mcp` | Object with `type` (local/remote) and `command` as array |
| `instructions` | Array of paths to markdown files |
| `skills.paths` | Object with `paths: ["."]` for recursive SKILL.md scan |

Use `{file:path}` in agent prompts for file injection.

## Tests

```powershell
cd tests; python -m pytest test_app.py -v
```

Playwright E2E on `test-app.html` (Alpine.js task manager). 17 checks: page load, Alpine interactivity, form validation, toggle, responsive, touch targets, focus rings, viewport, empty state, skip link, aria-live, manifest, SW, bottom nav, loading state, stagger, offline detection. Requires Chrome system channel.

```powershell
cd tests; python -m pytest test-template.py -v
```

Playwright + pytest for template structure validation.

## CI/CD

- `test.yml`: PRs + non-main pushes → Node 20 + Playwright + Python tests
- `deploy-pages.yml`: push to `main` → test gate → GitHub Pages (`path: .`, no build step)

## Key Files

| File | Purpose |
|------|---------|
| `stack-versions.json` | **Single source of truth** for all library versions (pinned + latest) |
| `project.config.js` | Per-app config: profile, modules, theme, encryption, sync settings |
| `.opencode/commands/*.md` | Slash command definitions |
| `.opencode/prompts/*.md` | Agent prompt files |
| `.opencode/rules/*.md` | Rule files loaded into every session via `{file:}` |
| `code-generator/templates/core/` | 20 core templates (app, db, crypto, ui, theme, main, sw, manifest, etc.) |
| `apps/AHA-*/template.md` | 15 app templates (14 business + 1 dev) ready for pipeline |
| `code-review-engine/` | Skill de revisión continua 4 ejes (compliance, calidad, spec, brand) + subagentes `review-agent`/`spec-reviewer` + comando `/review` |

## Library Migrations (Jul 2026)

| # | Migration | Status | Key Changes |
|---|-----------|--------|-------------|
| 4 | QRCode.js → qrcode npm v1.5.4 | ✅ | `QRCode.toDataURL()` Promise API, CDN jsDelivr |
| 5 | pako v2.1.0 → v3.0.1 | ✅ | `{to:'string'}`→`{toText:true}`, CDN→jsDelivr, `pako.umd.min.js` |
| 6 | jsPDF v2.5.1 → v4.2.1 | ✅ | Constructor compatible, CVE path traversal corregido |
| 7 | FlexSearch v0.7.31 → v0.8.212 | ✅ | CDN `flexsearch.bundle.min.js`, API backward compatible |
| 3 | CryptoJS → Web Crypto API | ⏭️ | Diferido (esfuerzo Alto, sin bug activo) |

## Global Installation

```powershell
.\install-global.ps1   # Creates 13 junctions in ~/.opencode/skills/ + configures global config
.\uninstall-global.ps1  # Reverts cleanly
```

Skills auto-update on `git pull` (junctions, not copies).

## Versioned Files (don't gitignore)

`docs/guia-estudio-ateje.md`, `docs/stack-completo.md`, `stack-versions.json`, `AGENTS.md`

Everything in `docs/`, `specs/`, `wiki/`, `.omd/`, `tests/` is generated output — don't version.
