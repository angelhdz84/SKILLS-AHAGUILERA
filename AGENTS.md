# 🏗️ Ateje Stack — Instrucciones para OpenCode

{file:.opencode/rules/STACK.md}
{file:.opencode/rules/PIPELINE.md}
{file:.opencode/rules/TOOL_USAGE.md}
{file:.opencode/rules/RESPONSE_STYLE.md}

## Identidad

Meta-repo de skills OpenCode (SKILL.md autónomos en directorios raíz) para crear apps offline-first con tres perfiles (Lite/Professional/Business). Este es el **Ateje Stack**: una Skill-Layer Architecture de 5 engines + 8 standalone + 16 OmD skills que generan apps completas. No es una app. Skills generan apps en directorios externos, no dentro del repo.

## Perfiles

| Perfil | Nivel | Runtime | DB | Cifrado | Empaquetado | HTML visible? |
|--------|-------|---------|----|---------|-------------|:------------:|
| Lite | Essential | Doble clic `index.html` | Dexie (IndexedDB) | CryptoJS | ZIP + GitHub Pages | ✅ Sí |
| Professional | Professional | Neutralino .exe + Fixed WV2 | Dexie + SQLite (FTS5) | CryptoJS | .exe + carpeta (~30MB ZIP) | ❌ No |
| Business | Business | Neutralino .exe + Fixed WV2 | Dexie + SQLite (FTS5) | CryptoJS | .exe + .apk + branding + docs (~35MB ZIP) | ❌ No |

El frontend (Alpine + DaisyUI + módulos) es ~95% idéntico entre perfiles.

## Skills — Ateje Stack (5 Engines + 8 Standalone + 1 Writer Skill)

### Motores (engines) — Skills de orquestación que reemplazan funcionalidad previa

| Directorio | Propósito | Reemplaza a | Perfiles |
|-----------|-----------|-------------|----------|
| `pipeline-engine/` | Orquestador maestro dual: Classic (5 fases, /new) y Design (10 fases, /pro) | prompt-inicial + supercharged-pipeline + omd:harness + omd:orchestrator | lite, full |
| `spec-engine/` | Spec funcional + DESIGN.md brand layer con 286 referencias oh-my-design | spec-creator + omd:init + omd:taste | lite, full |
| `design-engine/` | Brand context injection + tokens DaisyUI/alpine-ui-patterns + extracción de tokens via OpenPencil (opcional, Business) + captura de preferencias persistentes + decision tree component_library | design-ux-intelligence + daisyui-patterns + omd:apply + omd:sync + omd:remember + omd:learn | lite, full |
| `validation-engine/` | 4 fases: compliance → brand audit → DevTools/Playwright → QA rubric + modo refactor | validation-offline + ux-refactor + omd:designer-review + omd:final-qa | lite, full |
| `wiki-engine/` | Wiki persistente + preferencias de diseño .omd/preferences.md + memoria Engram (opcional) | llm-wiki + omd:remember + omd:learn | lite, full |

### Skills standalone (no reemplazadas)

| Directorio | Propósito | Perfiles |
|-----------|-----------|----------|
| `setup-init/` | Valida entorno, crea estructura, instala librerías. Genera defaults avatar/placeholder en `data/` | lite, professional, business |
| `code-generator/` | Genera código por fases desde specs, un módulo por turno. Soporta `component_library` (DaisyUI/Pines/Penguin/Pinemix). Templates en `code-generator/templates/` (incl. `search-palette.js`, `file-store.js`, `delete.js`) | lite, professional, business |
| `stack-compliance-guard/` | Guarda automática: bloquea imports, CDNs, fetch, crypto faltante | lite, professional, business |
| `deployment-jigue/` | Commit + push + empaquetado segun perfil (Essential/Professional/Business) | lite, professional, business |
| `ia-jutia/` | Mini IA: FlexSearch (Essential) / +ingesta docs + QA (Professional/Business) | lite, full |
| `alpine-ui-patterns/` | Catálogo unificado ~100 componentes Alpine.js de Pines/Penguin/Pinemix con fallback chain + prioridad por calidad | lite, full |
| `capacitor/` | Empaquetado .apk Android nativo con Capacitor. Incluye SQLite FTS5, cámara, GPS, notificaciones, compartir | professional, business |
| `upgrade-engine/` | Migra app entre perfiles Lite/Professional/Business e IA Lite/Full. No modifica módulos ni datos, solo infraestructura | lite, professional, business |

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
| deployment-jigue | — | Commit + Push + empaquetado segun perfil (Essential: ZIP+Pages / Professional: .exe+FixedWV2 / Business: .exe+.apk+branding) |
| capacitor | deployment-jigue | `capacitor.config.json` + `android/` |
| upgrade-engine | — | project.config.js actualizado + infraestructura nueva según perfil destino. Invocación directa `/upgrade` |
| wiki-engine | — | `wiki/` + `.omd/preferences.md` + Engram memory (opcional) |

## MCP Servers

Los siguientes MCPs están disponibles **globalmente** (config `~/.config/opencode/opencode.json`):

| Servidor | Propósito |
|----------|-----------|
| **github** | Operaciones GitHub API (issues, PRs, commits, search) |
| **stocky** | Imágenes royalty-free (Pexels + Unsplash) |
| **refero-styles** | Sistemas de diseño en refero.design (286+ brands) |
| **web-search** | Búsqueda web |
| **chrome-devtools** | Navegador headless para testing/Lighthouse |
| **supabase** | Supabase API (DB, Auth, Edge Functions) |
| **context7** | Documentación actualizada de librerías/frameworks |
| **daisyui-gitmcp** | Documentación de DaisyUI |

Solo los siguientes MCPs están configurados **localmente** en `opencode.json` de este repo:

| Servidor | Comando | Propósito | Activar |
|----------|---------|-----------|---------|
| **engram** | `C:\Users\Angel\bin\engram.exe mcp --project Ateje` | Memoria persistente SQLite/FTS5 (cross-sesión) | `scripts/setup-engram.ps1` |
| **open-pencil** | `openpencil-mcp` | Leer/modificar diseños visuales y extraer tokens | `npm install -g @open-pencil/cli @open-pencil/mcp` + Desktop App |

Los MCPs locales son opt-in: si la herramienta no está instalada, OpenCode los ignora silenciosamente.

**Setup de MCPs locales:**
- Engram: descargar binary de [GitHub Releases](https://github.com/Gentleman-Programming/engram/releases) + `scripts/setup-engram.ps1`
- OpenPencil: `npm install -g @open-pencil/cli @open-pencil/mcp` + Desktop App desde [releases](https://github.com/open-pencil/open-pencil/releases) + `scripts/setup-opencil.ps1`

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

Cada nivel mapea a un perfil técnico: **Inicio** (Lite, ZIP+Pages), **Profesional** (Professional, .exe+FixedWV2), **Enterprise** (Business, .exe+FixedWV2+.apk+branding).

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
| `/docs` | — | Abre docs/guia-estudio-ateje.md (guía completa de estudio) |
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

`install-global.ps1` crea junctions en `~/.opencode/skills/` apuntando a cada skill del repo y agrega `skills.paths` al config global (`~/.config/opencode/opencode.json`). Usa `ConvertFrom-Json`/`ConvertTo-Json` para manipulación robusta del JSON (no regex frágil). `uninstall-global.ps1` revierte ambas operaciones sin dejar rastro usando `PSObject.Properties.Remove()`.

Efecto:
- `/new`, `/pro`, `/build`, `/deploy`, etc. disponibles desde cualquier directorio
- Skills se actualizan solas al hacer `git pull` (son junctions, no copias)
- Sin interferencia con otros proyectos (config sandboxeado en `skills.paths`)
- Agentes del stack registrados globalmente con rutas absolutas al repo
- `{file:~/.opencode/skills/...}` resuelve correctamente desde cualquier proyecto

## Directorios generados (no versionar)

`docs/` (incl. `docs/comercial/`) es output de engines. `specs/`, `wiki/`, `.omd/` también. `tests/` contiene app de prueba y resultados.

**Excepciones versionadas:** `docs/guia-estudio-ateje.md`, `docs/stack-completo.md` y este `AGENTS.md` se mantienen en el repo como documentación viva del meta-repo.

## Config (`opencode.json`)

Keys validas del schema actual (`$schema: https://opencode.ai/config.json`):

| Key antigua | Key actual | Formato |
|---|---|---|
| `agents` (array) | `agent` | objeto keyeado por nombre, `mode` en vez de `type`, `permission` opcional |
| `mcpServers` | `mcp` | objeto con `type` (local/remote) y `command` como array unico |
| `commands` (string path) | auto-descubierto | opencode escanea `.opencode/commands/` automaticamente |
| `rules` | `instructions` | array de paths a archivos markdown |
| `skills` (array) | `skills.paths` | objeto con `paths: ["."]` para escaneo recursivo de SKILL.md desde raíz |

Usar `{file:ruta}` inline para prompts de agentes. Ver `opencode.json` en raiz como referencia.

## Tests

```powershell
cd tests; python -m pytest test_app.py -v
```

Playwright E2E sobre `test-app.html` (Alpine.js task manager). Requiere Chrome system channel.

## Deploy

Push a `main` → GitHub Actions (`deploy-pages.yml`) → GitHub Pages. Sin build step (`path: .`).

Para empaquetado profesional: `publicar` → deployment-jigue segun perfil.

Niveles de entrega:
- **Essential** (Lite): ZIP + GitHub Pages. HTML visible para demo/vitrina online.
- **Professional**: .exe (Neutralino) + Fixed WebView2 (carpeta). Sin HTML visible. Sin .apk. IA Full. ~30MB ZIP.
- **Business**: .exe (Neutralino) + Fixed WebView2 + .apk (Capacitor) + branding + docs. Sin código fuente. ~35MB ZIP.

Para white-label (Business): ejecutar `brand.ps1` o `package-business.ps1` con parámetros del cliente.

## Documentación de Estudio

- `docs/guia-estudio-ateje.md` — Guía completa para estudiar y comprender el Stack Ateje
- `docs/stack-completo.md` — Referencia técnica del stack completo
- `docs/guia-stack-skills-layer.md` — Guía de habilidades y capas del stack
- `docs/guia-integracion-engram-openpencil.md` — Integración de Engram + OpenPencil al pipeline
