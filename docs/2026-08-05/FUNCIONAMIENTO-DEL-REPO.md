# 🏗️ Funcionamiento del Repo — Stack Ateje

> **Actualizado:** 2026-08-05
> **Repo:** `github.com/angelhdz84/SKILLS-AHAGUILERA.git`
> **Naturaleza:** Meta-repo de skills OpenCode. **No es una app** — genera apps offline-first en directorios externos.

---

## 1. Que es Ateje Stack

Un taller de skills que construye aplicaciones **offline-first** usando:

- **Alpine.js** (reactividad) + **DaisyUI** (UI) + **Bootstrap Icons** (iconos)
- **Dexie.js** (IndexedDB) para almacenamiento local
- **CryptoJS** para cifrado de campos sensibles
- **Chart.js**, **jsPDF**, **SheetJS**, **pako**, **FlexSearch** para graficos/export/busqueda

**Principio clave:** las apps funcionan 100% sin internet, se abren con doble clic en `index.html` (file://, sin servidor, sin ES6 modules, sin CDN en runtime).

---

## 2. Estructura de Directorios

```
Ateje/
├── AGENTS.md                    # Instrucciones del agente OpenCode (reglas del stack)
├── project.config.js            # Template de config por app (perfil, modulos, tema, cifrado)
├── install-global.ps1           # Instalacion global (crea junctions en ~/.opencode/skills/)
├── uninstall-global.ps1         # Revertir instalacion global
├── opencode.json                # Config OpenCode: agentes, MCP, skills
│
├── pipeline-engine/             # Orquestador maestro (Classic 5 fases / Design 10 fases)
├── spec-engine/                 # Spec funcional + DESIGN.md brand layer
├── design-engine/               # Brand injection + tokens + preferencias persistentes
├── validation-engine/           # Validacion 4 fases + refactor
├── wiki-engine/                 # Wiki + preferencias de diseno
├── code-review-engine/          # ⭐ Revision continua 4 ejes (nueva 2026-08-05)
│
├── code-generator/              # Generador de codigo + 20 templates core
├── setup-init/                  # Valida entorno, crea estructura, instala librerias
├── stack-compliance-guard/      # Guarda automatica (bloquea imports/CDN/fetch)
├── deployment-jigue/            # Commit + push + empaquetado por perfil
├── ia-jutia/                    # Mini IA offline-first (plugin auto-contenido)
├── alpine-ui-patterns/          # ~100 componentes Alpine.js
├── capacitor/                   # Empaquetado .apk Android
├── upgrade-engine/              # Migra perfiles Lite/Professional/Business e IA Lite/Full
├── white-label/                 # Branding custom (Business)
│
├── apps/AHA-*/template.md       # 15 plantillas de apps (14 negocio + AHA-Base)
├── modules/                     # 70+ modulos compartidos reales (usuarios, inventario, ...)
├── component-examples/          # 35 componentes Pines
├── docs/                        # Documentacion (con snapshots fechados en docs/YYYY-MM-DD/)
├── specs/                       # (generado) Specs de apps — NO versionado
├── tests/                       # Tests E2E Playwright + pytest
├── .github/workflows/           # CI/CD (test.yml + deploy-pages.yml)
├── .opencode/                   # commands/, prompts/, rules/
│   ├── commands/*.md            # Comandos slash (/new, /pro, /build, /review, ...)
│   └── rules/*.md               # STACK.md, PIPELINE.md, TOOL_USAGE.md, RESPONSE_STYLE.md
└── scripts/                     # license.js, generate-docs.js, update-libs.ps1
```

**No versionados** (output generado): `docs/` (excepto guias), `specs/`, `wiki/`, `.omd/`, `licencias/`.

---

## 3. Los 3 Perfiles de Entrega

| Aspecto | Lite (Inicio) | Professional (Profesional) | Business (Enterprise) |
|---------|--------------|----------------------------|----------------------|
| **Runtime** | Doble clic `index.html` | NeutralinoJS .exe + Capacitor .apk | .exe + .apk + white-label |
| **DB** | Dexie (IndexedDB) | Dexie + SQLite FTS5 | Dexie + SQLite FTS5 |
| **Empaquetado** | ZIP + GitHub Pages | .exe + .apk (~30MB) | .exe + .apk (~35MB, sin codigo) |
| **IA Jutia** | Lite (~40KB) | Lite + Full+ (DLC ~40MB) | Personalizable |

El frontend (Alpine + DaisyUI + modulos) es **~95% identico** entre perfiles; la diferencia esta en infraestructura.

---

## 4. Los 4 Ejes de Revision de Codigo (nuevo code-review-engine)

Capas de calidad en cadena:

```
stack-compliance-guard  →  code-review-engine  →  validation-engine
      (valida)               (revisa 4 ejes)        (validacion final 4 fases)
```

| Eje | Que revisa | Fuente | Severidad |
|-----|-----------|--------|-----------|
| 1. Compliance | Imports ES6, CDN/fetch, cifrado, rutas file://, orden scripts, contrato modulo | stack-compliance-guard | BLOCK si violacion dura |
| 2. Calidad | 12 smells Fowler + reglas R-A (async reservado, >50 lineas, try/catch real, alert nativo) | references/fowler-smells.md | WARN / BLOCK |
| 3. Spec | Requisitos faltantes/parciales, scope creep, implementacion incorrecta | specs/[app].md | BLOCK si requisito faltante |
| 4. Brand/UX | Tokens DESIGN.md, tipografia, color budget, radius, states, mobile | validation-engine | WARN / BLOCK |

**Mecanica:** dos subagentes en paralelo — `review-agent` (Ejes 1+2) y `spec-reviewer` (Ejes 3+4) — para no contaminar contextos. Auto-fix deterministico con confirmacion por lote. Max 2 rondas por ciclo.

**Activacion:**
1. **Auto**: tras cada bloque de codigo que genera `code-generator` (FASE 2 core + FASE 3 modulos)
2. **Auto**: cuando dices "revisa", "revísalo", "code review", "cómo está el código"
3. **Manual**: `/review` para diffs git completos

---

## 5. Comandos Slash Disponibles

| Comando | Trigger | Efecto |
|---------|---------|--------|
| `/new` | nuevo proyecto | Pipeline Classic completo (5 fases) |
| `/pro` | pipeline potenciado | Pipeline Design (10 fases con brand layer) |
| `/setup` | iniciar setup | Crea estructura + instala librerias |
| `/spec` | definir spec app | spec-engine |
| `/build` | generar codigo | code-generator (Fase A + Fase B) |
| `/test` | validar app | validation-engine 4 fases |
| `/validate` | validar diseno | Brand audit |
| `/refactor` | refactorizar ux | Auto-corrige desviaciones |
| `/compliance` | -- | stack-compliance-guard manual |
| `/review` | revisar codigo | ⭐ code-review-engine: diff git en 4 ejes |
| `/status` | -- | Estado del pipeline |
| `/archive` | -- | Mueve spec a specs/archive/ |
| `/ia` | mini ia | Activa ia-jutia (perfil Lite/Full) |
| `/deploy` | publicar | Commit + push + empaquetado |
| `/upgrade` | actualizar perfil | Migra entre perfiles |
| `/licencia` | generar licencia | CLI de licencias .aha firmadas |
| `/docs-gen` | generar docs | Genera docs/API.md |
| `/wiki` | gestionar wiki | wiki-engine |

---

## 6. Instalacion Global (para usar desde cualquier proyecto)

```powershell
.\install-global.ps1    # Crea 15 junctions en ~/.opencode/skills/ + configura global
.\uninstall-global.ps1  # Revierte sin dejar rastro
```

Las skills son **junctions (no copias)**: se auto-actualizan con `git pull`.

---

## 7. CI/CD

| Workflow | Cuando | Que hace |
|----------|--------|----------|
| `test.yml` | PRs + pushes no-main | Node 20 + Playwright + Python tests |
| `deploy-pages.yml` | Push a main | Test gate → GitHub Pages (`path: .`, sin build) |

---

## 8. Version de Librerias

**Single source of truth:** `stack-versions.json` (pinned + latest por libreria, URLs CDN con template, perfiles).

Ver reporte en `docs/stack-versiones.md` y actualizar con `scripts/update-libs.ps1` (`/update-libs`).

**Migraciones recientes:** QRCode.js→qrcode npm v1.5.4, pako v2→v3, jsPDF v2.5→v4.2.1, FlexSearch v0.7→v0.8.212. Pendiente: CryptoJS→Web Crypto API (diferido).

---

## 9. Tests

```powershell
cd tests
python -m pytest test_app.py -v              # 17 checks E2E (Playwright)
python -m pytest test-template.py -v         # 4 checks estructura templates
python test-code-review-engine.py            # 5 checks skill code-review-engine
```

Requiere Chrome system channel para Playwright.
