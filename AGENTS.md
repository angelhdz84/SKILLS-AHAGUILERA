# 🏗️ Ateje Stack — Instrucciones para OpenCode

{file:.opencode/rules/STACK.md}
{file:.opencode/rules/PIPELINE.md}
{file:.opencode/rules/TOOL_USAGE.md}
{file:.opencode/rules/RESPONSE_STYLE.md}

## Identidad

Meta-repo de skills OpenCode (SKILL.md autónomos en directorios raíz) para crear apps offline-first con dos perfiles (Lite/Full). Este es el **Ateje Stack**: una Skill-Layer Architecture de 5 engines + 8 standalone + 16 OmD skills que generan apps completas. No es una app. Skills generan apps en directorios externos, no dentro del repo.

## Perfiles

| Perfil | Runtime | DB | Cifrado | Empaquetado |
|--------|---------|----|---------|-------------|
| Lite | Doble clic `index.html` | Dexie (IndexedDB) | CryptoJS | ZIP + GitHub Pages |
| Full | NeutralinoJS .exe + Capacitor .apk | Dexie + SQLite (FTS5) | CryptoJS | .exe + .apk + Pages + Release |

El frontend (Alpine + DaisyUI + módulos) es ~95% idéntico entre perfiles.

## Skills — Ateje Stack (5 Engines + 8 Standalone + 1 Writer Skill)

### Motores (engines) — Skills de orquestación que reemplazan funcionalidad previa

| Directorio | Propósito | Reemplaza a | Perfiles |
|-----------|-----------|-------------|----------|
| `pipeline-engine/` | Orquestador maestro dual: Classic (5 fases, /new) y Design (10 fases, /pro) | prompt-inicial + supercharged-pipeline + omd:harness + omd:orchestrator | lite, full |
| `spec-engine/` | Spec funcional + DESIGN.md brand layer con 286 referencias oh-my-design | spec-creator + omd:init + omd:taste | lite, full |
| `design-engine/` | Brand context injection + tokens DaisyUI/alpine-ui-patterns + captura de preferencias persistentes + decision tree component_library | design-ux-intelligence + daisyui-patterns + omd:apply + omd:sync + omd:remember + omd:learn | lite, full |
| `validation-engine/` | 4 fases: compliance → brand audit → DevTools/Playwright → QA rubric + modo refactor | validation-offline + ux-refactor + omd:designer-review + omd:final-qa | lite, full |
| `wiki-engine/` | Wiki persistente + preferencias de diseño .omd/preferences.md + MCP memory | llm-wiki + omd:remember + omd:learn | lite, full |

### Skills standalone (no reemplazadas)

| Directorio | Propósito | Perfiles |
|-----------|-----------|----------|
| `setup-init/` | Valida entorno, crea estructura, instala librerías | lite, full |
| `code-generator/` | Genera código por fases desde specs, un módulo por turno. Soporta `component_library` (DaisyUI/Pines/Penguin/Pinemix). Templates en `code-generator/templates/` | lite, full |
| `stack-compliance-guard/` | Guarda automática: bloquea imports, CDNs, fetch, crypto faltante | lite, full |
| `deployment-jigue/` | Commit + push + Pages + ZIP (Lite) / .exe + Release (Full) | lite, full |
| `ia-jutia/` | Mini IA: FlexSearch (Lite) / +ingesta docs + QA (Full) | lite, full |
| `alpine-ui-patterns/` | Catálogo unificado ~100 componentes Alpine.js de Pines/Penguin/Pinemix con fallback chain + prioridad por calidad | lite, full |
| `capacitor/` | Empaquetado .apk Android nativo con Capacitor. Incluye SQLite FTS5, cámara, GPS, notificaciones, compartir | full |
| `upgrade-engine/` | Migra app entre perfiles Lite/Full e IA Lite/Full. No modifica módulos ni datos, solo infraestructura | lite, full |

### Skills externas (oh-my-design + es-writer, en `~/.opencode/skills/`)

| Skill | Propósito | Perfiles |
|-------|-----------|----------|
| `omd:init` a `omd:learn` (16 skills) | Catálogo de 286 referencias de diseño reales (DESIGN.md de Stripe, Linear, Vercel, etc.). Consumidas por los engines, ejecución delegada a sub-agentes OpenCode. | lite, full |
| `omd:es-writer` | Microcopy profesional en español latino. 6 presets de voz. Integrado en pipeline-engine Fase 6 (modo Design). | lite, full |

### Skills archivadas (movidas a `archived/`)

Las siguientes skills fueron reemplazadas por engines y movidas a `archived/` para evitar confusión:

`prompt-inicial/`, `supercharged-pipeline/`, `spec-creator/`, `design-ux-intelligence/`, `validation-offline/`, `ux-refactor/`, `llm-wiki/`, `daisyui-patterns/`, `github-page-publish/`

## Agente Orchestrator

El agente **Orchestrator** (registrado en `opencode.json` como agente `primary`) activa **pipeline-engine** como puerta de entrada principal. Soporta dos modos:

| Modo | Comando | Pipeline | Cuándo usarlo |
|------|---------|----------|---------------|
| Classic | `/new` | 5 fases: setup → spec → design → build → validate → deploy | Proyectos simples, prototipos rápidos |
| Design | `/pro` | 10 fases: taste → init → design → spec → code → inject → review → QA → pack → deploy | Proyectos con marca, producción, equipo |

El Orchestrator pregunta el modo si no se especifica. Si el catálogo OmD no está disponible, fallback automático al modo Classic.

## Pipeline (orden exacto)

`nuevo proyecto` → `iniciar setup` → `generar spec + brand` → `aplicar diseño` → `generar codigo` → `validar + auditar marca` → `publicar`

## Contratos entre Skills

| Emisor | Receptor(es) | Artefacto |
|--------|-------------|-----------|
| pipeline-engine | setup-init, spec-engine | Nombre + tipo + descripción + perfil + modo (classic/design) |
| setup-init | code-generator | Estructura + librerías según perfil |
| spec-engine | design-engine, code-generator, wiki-engine | `specs/[app].md` + `specs/DESIGN.md` |
| design-engine | code-generator | Preferencias de diseño en `.omd/preferences.md` |
| code-generator | stack-compliance-guard, validation-engine, wiki-engine, design-engine (retroalimentación) | `modules/*`, `core/*`, `index.html` |
| stack-compliance-guard | code-generator | Validación automática post-generación (con checks de perfil) |
| validation-engine | wiki-engine | `docs/validacion-[app].md` + brand audit + QA rubric |
| deployment-jigue | — | Commit + Push + Pages + ZIP (Lite) / .exe + .apk + Release (Full) |
| capacitor | deployment-jigue | `capacitor.config.json` + `android/` |
| upgrade-engine | — | project.config.js actualizado + infraestructura nueva según perfil destino. Invocación directa `/upgrade` |
| wiki-engine | — | `wiki/` + `.omd/preferences.md` + MCP memory graph |

## MCP Servers

- `mcp-servers/stocky/` — Python. Busca imágenes Pexels + Unsplash. Setup: `pip install -e .`
- `mcp-servers/refero-styles/` — TypeScript. Busca sistemas de diseño en refero.design. Setup: `npm install && npm run build`

Configurados en `opencode.json` en la raíz del repo. Incluye memory, github, stocky y refero-styles.

## Catálogo de apps AHA

El repo incluye **13 plantillas de apps** listas para generar con el pipeline. Tres formatos por app:

| App | Template comercial | Niveles comerciales | Spec técnica |
|-----|-------------------|-------------------|-------------|
| **AHA Inventario** | `apps/AHA-Inventario/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Inventario/template.md` |
| **AHA Comanda** | `apps/AHA-Comanda/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Comanda/template.md` |
| **AHA CRM** | `apps/AHA-CRM/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-CRM/template.md` |
| **AHA Checklist** | `apps/AHA-Checklist/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Checklist/template.md` |
| **AHA Asistencia** | `apps/AHA-Asistencia/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Asistencia/template.md` |
| **AHA Citas** | `apps/AHA-Citas/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Citas/template.md` |
| **AHA Creador** | `apps/AHA-Creador/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Creador/template.md` |
| **AHA Campo** | `apps/AHA-Campo/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Campo/template.md` |
| **AHA POS** | `apps/AHA-POS/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-POS/template.md` |
| **AHA Rx** | `apps/AHA-Rx/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Rx/template.md` |
| **AHA Flota** | `apps/AHA-Flota/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Flota/template.md` |
| **AHA Obra** | `apps/AHA-Obra/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-Obra/template.md` |
| **AHA PreFactura** | `apps/AHA-PreFactura/template.md` | Inicio / Profesional / Enterprise | `apps/AHA-PreFactura/template.md` |

Cada nivel mapea a un perfil técnico: **Inicio** (Lite, ZIP+Pages), **Profesional** (Full, .exe+Pages+Release), **Enterprise** (Full+custom, código fuente+UI personalizada).

Para generar una app: copiar `apps/AHA-Nombre/template.md` a `specs/[app].md` y ejecutar pipeline.

## Comandos slash

| Comando | Trigger | Efecto |
|---------|---------|--------|
| `/new` | `nuevo proyecto` | pipeline-engine → setup-init → spec-engine → design-engine → code-generator → validation-engine → deployment-jigue |
| `/pro` | `pipeline potenciado` | pipeline-engine modo Design: 10 fases con brand layer OmD |
| `/setup` | `iniciar setup` | Crea estructura + instala librerías según perfil |
| `/spec` | `definir spec app` | spec-engine: spec funcional + DESIGN.md brand layer |
| `/build` | `generar codigo` | code-generator: Fase A (core/index.html) + Fase B (módulos uno por uno) |
| `/test` | `validar app` | validation-engine: compliance → brand audit → DevTools/Playwright → QA rubric |
| `/validate` | `validar diseño` | validation-engine modo brand audit: verifica coherencia con DESIGN.md |
| `/refactor` | `refactorizar ux` | validation-engine modo refactor: auto-corrige desviaciones de diseño |
| `/compliance` | — | stack-compliance-guard manual |
| `/status` | — | Lee pipeline state (specs/, project.config.js, docs/) |
| `/archive` | — | Mueve spec + reporte a specs/archive/ |
| `/docs` | — | Abre docs/guia-skills-mcps.html |
| `/ia` | `mini ia` | Activa ia-jutia (pregunta perfil Lite/Full/No) |
| `/deploy` | `publicar` | deployment-jigue: commit + push + empaquetado según perfil |
| `/wiki` | `gestionar wiki` | wiki-engine: ingest/query/lint sobre wiki + preferencias |
| `/upgrade` | `actualizar perfil` | upgrade-engine: diagnostico → migra Lite→Full y/o IA Lite→Full. Sin modificar modulos ni datos |

## Instalación Global

Para usar el Ateje Stack desde cualquier proyecto (no solo dentro de este repo):

```powershell
# Sin administrador — crea 13 directory junctions + configura OpenCode global
.\install-global.ps1

# Para remover completamente
.\uninstall-global.ps1
```

`install-global.ps1` crea junctions en `~/.opencode/skills/` apuntando a cada skill del repo y agrega `skills.paths` al config global (`~/.config/opencode/opencode.json`). `uninstall-global.ps1` revierte ambas operaciones sin dejar rastro.

Efecto:
- `/new`, `/pro`, `/build`, `/deploy`, etc. disponibles desde cualquier directorio
- Skills se actualizan solas al hacer `git pull` (son junctions, no copias)
- Sin interferencia con otros proyectos (config sandboxeado en `skills.paths`)

## Directorios generados (no versionar)

`docs/` (incl. `docs/comercial/`), `specs/`, `wiki/`, `.omd/` son output de engines. `tests/` contiene app de prueba y resultados.

## Tests

```powershell
cd tests; python -m pytest test_app.py -v
```

Playwright E2E sobre `test-app.html` (Alpine.js task manager). Requiere Chrome system channel.

## Deploy

Push a `main` → GitHub Actions (`deploy-pages.yml`) → GitHub Pages. Sin build step (`path: .`).

Para empaquetado profesional: `publicar` → deployment-jigue segun perfil.

Niveles de entrega:
- **Inicio** (Lite): ZIP + GitHub Pages
- **Profesional** (Full): .exe (Neutralino) + .apk (Capacitor) + Pages + Release
- **Enterprise** (Full custom): .exe + .apk + código fuente completo + UI personalizada + docs + script brand.ps1 para re-brandeo

Para white-label: ejecutar `brand.ps1` con parámetros del cliente antes de empaquetar.
