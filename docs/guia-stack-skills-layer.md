# Guía del Stack — Ateje Stack (Skill-Layer Architecture)

> Cómo usar los 5 engines + 6 standalone + 16 OmD skills del **Ateje Stack** para crear apps offline-first.
> Versión: 1.0 | Perfiles: Lite / Full

---

## Índice

1. [¿Qué es Skill-Layer Architecture?](#1-qué-es-skill-layer-architecture)
2. [Mapa completo de skills](#2-mapa-completo-de-skills)
3. [Comandos slash](#3-comandos-slash)
4. [Pipeline Classic — `/new`](#4-pipeline-classic--new)
5. [Pipeline Design — `/pro`](#5-pipeline-design--pro)
6. [Casos de uso](#6-casos-de-uso)
7. [Ejemplo completo: App Control de Gastos](#7-ejemplo-completo-app-control-de-gastos)
8. [Troubleshooting](#8-troubleshooting)
9. [Referencia rápida](#9-referencia-rápida)

---

## 1. ¿Qué es Ateje Stack?

El **Ateje Stack** organiza las 31 skills originales (17 repo + 14 oh-my-design) en **3 capas** con responsabilidades claras (Skill-Layer Architecture):

```
┌─────────────────────────────────────────────┐
│  ENGINES (5) — Orquestación y coordinación   │
│  pipeline · spec · design · validation · wiki │
├─────────────────────────────────────────────┤
│  STANDALONE (6) — Ejecución pura             │
│  setup-init · code-generator · compliance    │
│  alpine-ui-patterns · deployment-jigue · ia  │
├─────────────────────────────────────────────┤
│  OmD (16) — Catálogo de diseño externo       │
│  omd-init · omd-apply · omd-taste · ...      │
└─────────────────────────────────────────────┘
```

### ¿Por qué 3 capas?

| Capa | Problema que resuelve |
|------|----------------------|
| **Engines** | 8 skills hacían lo mismo (prompt-inicial, supercharged, omd:harness, omd:orchestrator todos orquestaban). Ahora `pipeline-engine` es el único orquestador. |
| **Standalone** | Skills de ejecución que no necesitan ser engines — hacen una cosa y la hacen bien. |
| **OmD** | 286 referencias de diseño reales (Stripe, Linear, Vercel...) que los engines consultan bajo demanda. No se ejecutan directamente. |

### Antes vs Ahora

| Antes (31 skills) | Ahora (11 activas + 16 OmD) |
|-------------------|------------------------------|
| prompt-inicial | → pipeline-engine (modo Classic) |
| supercharged-pipeline | → pipeline-engine (modo Design) |
| spec-creator | → spec-engine |
| design-ux-intelligence | → design-engine |
| daisyui-patterns | → design-engine (absorbido) |
| validation-offline | → validation-engine |
| ux-refactor | → validation-engine (modo refactor) |
| llm-wiki | → wiki-engine |
| ux-ui-universal | → eliminado (OmD cubre multi-stack) |
| omd:harness + omd:orchestrator | → pipeline-engine |
| omd:init + omd:taste | → spec-engine |
| omd:apply + omd:sync | → design-engine |
| omd:remember + omd:learn | → wiki-engine |
| omd:designer-review + omd:final-qa | → validation-engine |

---

## 2. Mapa completo de skills

### Motores (engines)

| Skill | Propósito | Reemplaza | Trigger |
|-------|-----------|-----------|---------|
| `pipeline-engine` | Orquestador maestro dual: Classic (5 fases, `/new`) y Design (10 fases, `/pro`) | prompt-inicial + supercharged-pipeline + omd:harness + omd:orchestrator | `/new`, `/pro`, "nuevo proyecto" |
| `spec-engine` | Spec funcional + DESIGN.md brand layer con 286 referencias OmD | spec-creator + omd:init + omd:taste | `/spec`, "definir spec" |
| `design-engine` | Brand context injection + tokens DaisyUI + captura de preferencias | design-ux-intelligence + daisyui-patterns + omd:apply + omd:sync + omd:remember + omd:learn | "diseñar", "aplicar diseño", `/build` |
| `validation-engine` | 4 fases: compliance → brand audit → DevTools/Playwright → QA rubric + modo refactor | validation-offline + ux-refactor + omd:designer-review + omd:final-qa | `/test`, `/validate`, `/refactor` |
| `wiki-engine` | Wiki persistente + preferencias de diseño `.omd/preferences.md` + MCP memory | llm-wiki + omd:remember + omd:learn | `/wiki`, "guarda esto", "recuerda" |

### Skills standalone

| Skill | Propósito | Perfiles |
|-------|-----------|----------|
| `setup-init` | Valida entorno, crea estructura, instala librerías | lite, full |
| `code-generator` | Genera código por fases desde specs, un módulo por turno | lite, full |
| `stack-compliance-guard` | Guarda automática: bloquea imports, CDNs, fetch, crypto faltante | lite, full |
| `alpine-ui-patterns` | Catálogo unificado ~100 componentes Alpine.js de Pines/Penguin/Pinemix con fallback chain + prioridad por calidad | lite, full |
| `deployment-jigue` | Commit + push + Pages + ZIP (Lite) / .exe + Release (Full) | lite, full |
| `ia-jutia` | Mini IA: FlexSearch (Lite) / +ingesta docs + QA (Full) | lite, full |

### Skills externas (oh-my-design)

16 skills instaladas en `~/.opencode/skills/omd-*` con 286 referencias de diseño reales:

| Skill OmD | Función | Consumida por |
|-----------|---------|---------------|
| `omd-init` | Selección de referencia de marca | spec-engine |
| `omd-taste` | Preferencias de estilo del usuario | spec-engine |
| `omd-apply` | Aplicar diseño desde DESIGN.md | design-engine |
| `omd-sync` | Sincronizar cambios de diseño | design-engine |
| `omd-remember` | Guardar correcciones como preferencias | design-engine, wiki-engine |
| `omd-learn` | Fold-in de preferencias acumuladas | wiki-engine |
| `omd-reference-capture` | Capturar diseño de referencia en vivo | design-engine |
| `omd-asset-fetch` | Buscar assets CC0 (imágenes, iconos) | pipeline-engine (modo Design) |
| `omd-designer-review` | Brand audit automatizado | validation-engine |
| `omd-final-qa` | QA rubric de 8 items | validation-engine |
| `omd-harness` | Pipeline 10 fases completo | pipeline-engine (modo Design) |
| `omd-orchestrator` | Workflow 5-stage | pipeline-engine (modo Classic) |
| `omd-codex-image` | Generación de imágenes de diseño | (opcional) |
| `omd-experiment-gallery` | Galería de experimentos visuales | (opcional) |
| `omd-kr-writer` | Escribir key results de diseño | (opcional) |
| `omd-locale-adapter` | Adaptación multi-idioma | (opcional) |

### Skills deprecadas (compatibilidad)

| Skill | Estado | Migrar a |
|-------|--------|----------|
| `prompt-inicial/` | @deprecated | pipeline-engine (`/new`) |
| `spec-creator/` | @deprecated | spec-engine (`/spec`) |
| `design-ux-intelligence/` | @deprecated | design-engine |
| `validation-offline/` | @deprecated | validation-engine (`/test`) |
| `ux-refactor/` | @deprecated | validation-engine (modo refactor) |
| `llm-wiki/` | @deprecated | wiki-engine (`/wiki`) |
| `supercharged-pipeline/` | @deprecated | pipeline-engine (`/pro`) |
| `daisyui-patterns/` | @deprecated | design-engine |
| `ux-ui-universal/` | eliminado | OmD multi-stack |
| `github-page-publish/` | deprecado previamente | deployment-jigue |

---

## 3. Comandos slash

| Comando | Para qué sirve | Dispara |
|---------|---------------|---------|
| `/new` | Nuevo proyecto — pipeline Classic 5 fases | pipeline-engine → setup-init → spec-engine → design-engine → code-generator → validation-engine → deployment-jigue |
| `/pro` | Nuevo proyecto — pipeline Design 10 fases | pipeline-engine modo Design con brand layer OmD |
| `/setup` | Solo crear estructura + instalar librerías | setup-init |
| `/spec` | Solo generar spec (sin pipeline completo) | spec-engine |
| `/build` | Solo generar código desde spec existente | code-generator + design-engine |
| `/test` | Validar app completa | validation-engine: compliance → brand audit → DevTools → QA rubric |
| `/validate` | Solo brand audit (verificar coherencia con DESIGN.md) | validation-engine modo brand audit |
| `/refactor` | Refactorizar UX de app existente | validation-engine modo refactor |
| `/compliance` | Solo verificar reglas del stack | stack-compliance-guard |
| `/status` | Ver estado del pipeline actual | Lee specs/, project.config.js, docs/ |
| `/archive` | Archivar spec + reporte actual | Mueve a specs/archive/ |
| `/deploy` | Publicar app | deployment-jigue según perfil |
| `/wiki` | Gestionar wiki + preferencias | wiki-engine: ingest / query / lint |
| `/ia` | Activar mini IA | ia-jutia (pregunta perfil Lite/Full/No) |
| `/docs` | Abrir guía visual de skills + MCP | Abre docs/guia-skills-mcps.html |

---

## 4. Pipeline Classic — `/new`

Ideal para prototipos rápidos, landing pages, apps simples. 5 fases.

### Fase 1: Setup

```bash
# El engine llama a setup-init automáticamente
/nuevo proyecto
> ¿Nombre? → ControlGastos
> ¿Tipo? → Finanzas personales
> ¿Descripción? → App offline para registrar gastos diarios
> ¿Perfil? → Lite
> ¿IA Jutia? → No

# setup-init crea:
mi-app/
├── index.html
├── core/
│   ├── app.js
│   └── db.js
├── modules/
├── assets/
│   ├── css/
│   └── js/libs/
└── project.config.js
```

### Fase 2: Spec

```bash
# spec-engine genera:
specs/ControlGastos.md
├── 1. Descripción general
├── 2. Stack técnico
├── 3. Modelo de datos (tablas Dexie)
├── 4. Módulos (dashboard, gastos, categorías, reportes)
├── 5. Flujos de usuario
├── 6. Reglas de negocio
├── 7. Perfiles Lite/Full
├── 8. Pruebas
└── 9. Librerías adicionales
```

Si se eligió una referencia de marca (Stripe, Linear, etc.), spec-engine incluye:

```
├── 10. Brand Voice
├── 11. Brand Narrative
├── 12. Design Principles
├── 13. Personas
├── 14. States
└── 15. Motion Design
```

### Fase 3: Design + Build

```bash
# design-engine aplica tokens de marca al output de code-generator
# code-generator genera UN módulo a la vez:

Módulo 1/4: core (index.html, app.js, db.js)
  → stack-compliance-guard valida
  → design-engine inyecta tokens DaisyUI
  → PAUSA: ¿CONTINUAR?

Módulo 2/4: Dashboard
  → compliance → design → PAUSA

Módulo 3/4: Gastos
  → compliance → design → PAUSA

Módulo 4/4: Categorías + Reportes
  → compliance → design
```

### Fase 4: Validation

```bash
# validation-engine ejecuta 4 fases:
1. Stack Compliance → ✅ Sin imports, sin CDNs, crypto presente
2. Brand Audit → ✅ Tipografía, colores, spacing consistentes
3. Technical QA → ✅ Consola 0 errors, Lighthouse a11y ≥ 90
4. QA Rubric → 8 items PASS/FAIL

# Reporte en: docs/validacion-ControlGastos.md
```

### Fase 5: Deploy

```bash
# deployment-jigue según perfil Lite:
git add -A
git commit -m "feat: ControlGastos v1"
git push
# ZIP automático en: dist/ControlGastos.zip
# GitHub Pages: https://angelhdz84.github.io/ControlGastos
```

---

## 5. Pipeline Design — `/pro`

Para apps con marca, producción, equipo. 10 fases con sub-agentes.

### Las 10 fases

```
Fase  1: BRAINSTORMING → exploración de ideas con sub-agentes
Fase  2: UX RESEARCH  → explore + design-agent (audiencia, competencia, referencias)
Fase  3: SPEC + BRAND → spec-engine (spec 15 secciones + DESIGN.md + referencia OmD)
Fase  4: DESIGN SYSTEM → design-engine define tokens: color, tipografía, spacing, motion
Fase  5: UI CODING    → code-generator + design-engine (tokens en vivo)
Fase  6: MICROCOPY    → omd:es-writer redacta copy profesional con voz de marca
Fase  7: ASSETS       → omd:asset-fetch + MCP stocky (imágenes CC0, iconos)
Fase  8: TESTING      → validation-engine fases 1-3 (compliance + DevTools + E2E)
Fase  9: DESIGN REVIEW → validation-engine fases 4-5 (brand audit + QA rubric)
Fase 10: DEPLOY       → deployment-jigue según perfil
```

### ¿Classic o Design?

| Pregunta | → Classic | → Design |
|----------|-----------|----------|
| ¿Es un prototipo rápido? | ✅ | ❌ |
| ¿Tiene requisitos de marca? | ❌ | ✅ |
| ¿La usará un equipo? | ❌ | ✅ |
| ¿Necesita assets visuales? | ❌ | ✅ |
| ¿Tiene microcopy definido? | ❌ | ✅ |
| ¿Son < 5 módulos? | ✅ | ✅ |
| ¿Es una landing page? | ✅ | ❌ |

---

## 6. Casos de uso

### Caso 1: Prototipo rápido — App de Notas (Lite, `/new`)

**Escenario:** Quieres una app de notas offline que funcione con doble clic.

```
Usuario:  "nuevo proyecto"
Sistema:  "¿Classic (/new) o Design (/pro)?"
Usuario:  "/new"
Sistema:  "Nombre? → NotasRapidas
          Tipo? → Productividad
          Descripción? → App de notas offline con categorías
          Perfil? → Lite
          IA Jutia? → No"

--- FASE 1: SETUP ---
✅ Estructura creada en ./NotasRapidas/
✅ Librerías: Alpine, Dexie, DaisyUI, Bootstrap Icons

--- FASE 2: SPEC ---
specs/NotasRapidas.md generada
Módulos: dashboard, notas, categorías, buscar
3 tablas Dexie: notas, categorias, config

--- FASE 3: BUILD ---
Módulo 1/4: core (index.html + app.js + db.js) ✅
Módulo 2/4: dashboard ✅
Módulo 3/4: notas (CRUD completo) ✅
Módulo 4/4: categorías + búsqueda ✅

--- FASE 4: VALIDATE ---
✅ Compliance: sin imports, sin CDNs
✅ Brand audit: DaisyUI default theme
✅ Lighthouse a11y: 92
✅ QA Rubric: 8/8 PASS

--- FASE 5: DEPLOY ---
✅ Commit: "feat: NotasRapidas v1"
✅ Push a main
✅ ZIP: dist/NotasRapidas.zip
📦 Abrir: doble clic en NotasRapidas/index.html
```

**Tiempo estimado:** 15-20 minutos.

---

### Caso 2: App producción — Gestión Clínica (Full, `/pro`)

**Escenario:** App para recepcionistas de clínica dental. Debe funcionar offline, con marca propia, informes PDF.

```
Usuario:  "Quiero crear una app de gestión de clínica dental"
Sistema:  "¿Classic (/new) o Design (/pro)?"
Usuario:  "/pro"
Sistema:  "Nombre? → ClinicaDentalPro
          Tipo? → Salud / Gestión
          Descripción? → App para recepcionistas. Gestión de pacientes,
                          citas, historial clínico, informes PDF.
                          Todo offline-first.
          Perfil? → Full
          IA Jutia? → Lite (búsqueda de pacientes)
          
          Marca de referencia? (opcional)
          > Tengo logo y colores: #005792 (azul), #00bcd4 (cian)
          > Fuente: Inter"

--- FASE 1: BRAINSTORMING ---
Árbol de funcionalidades:
├── Dashboard (resumen del día)
├── Pacientes (CRUD + historial)
├── Citas (calendario + recordatorios)
├── Reportes (PDF con jsPDF)
└── Settings (configuración local)

--- FASE 2: UX RESEARCH ---
Design-agent busca referencias en styles.refero.design:
→ Match #1: "Clinic" (healthcare SaaS, azul dominante)
→ Match #2: "DentalCare PRO" (UI clínica profesional)

--- FASE 3: SPEC + BRAND ---
specs/ClinicaDentalPro.md con 15 secciones:
→ Modelo de datos: Pacientes (cifrado), Citas, Historial, Config
→ DESIGN.md con paleta #005792/cian, voz profesional-cálida
→ 10 tablas Dexie + 4 tablas SQLite (Full)

--- FASE 4: DESIGN SYSTEM ---
design-engine define tokens:
→ primary: #005792, secondary: #00bcd4, accent: #ff6f00
→ title: Inter, body: system-ui
→ border-radius: box (0.5rem)
→ transition: 200ms ease

--- FASE 5-7: UI + MICROCOPY + ASSETS ---
5 módulos generados uno por uno con validación inmediata

--- FASE 8-9: TESTING + DESIGN REVIEW ---
✅ Compliance stack offline-first
✅ Brand audit: 100% coherente con DESIGN.md
✅ Playwright E2E: 12 tests, 12 PASS
✅ QA Rubric: 8/8 PASS

--- FASE 10: DEPLOY ---
✅ git commit + push
✅ bun build --compile → dist/ClinicaDentalPro.exe
✅ GitHub Pages + Release v1.0.0
```

**Tiempo estimado:** 45-60 minutos.

---

### Caso 3: Landing page para freelance (Lite, `/new` sin spec-engine)

**Escenario:** Landing de una sola página para tu portafolio.

```
Usuario:  "Landing page para mi portafolio de desarrollador"
Sistema:  "¿Classic (/new) o Design (/pro)?"
Usuario:  "/new"

┌─ Setup ──────────────────────────────┐
│ ✅ Estructura creada                  │
│ ✅ Tailwind + DaisyUI + Bootstrap Icons │
└──────────────────────────────────────┘

┌─ Spec ───────────────────────────────┐
│ (landing simple, spec mínima)         │
│ Módulos: hero, servicios, proyectos,  │
│           contacto, footer            │
└──────────────────────────────────────┘

┌─ Build ──────────────────────────────┐
│ Hero: foto + título + CTA          ✅│
│ Servicios: 3 cards con iconos      ✅│
│ Proyectos: grid con screenshots    ✅│
│ Contacto: form (Alpine + Dexie)    ✅│
│ Footer: links + redes              ✅│
└──────────────────────────────────────┘

┌─ Validate ───────────────────────────┐
│ ✅ Lighthouse Performance: 95        │
│ ✅ Lighthouse Accessibility: 100     │
│ ✅ Responsive: 375px-1920px          │
└──────────────────────────────────────┘

┌─ Deploy ─────────────────────────────┐
│ ✅ GitHub Pages                      │
│ 🌐 https://tudominio.github.io       │
└──────────────────────────────────────┘
```

**Tiempo estimado:** 10-15 minutos.

---

### Caso 4: Refactor UX de app existente (Lite/Full, `/refactor`)

**Escenario:** Ya tienes una app generada con el stack, pero quieres mejorar su UX/UI.

```
Usuario:  "refactorizar ux"
Sistema:  "Ejecutando validation-engine modo refactor..."

┌─ FASE 1: AUDIT ──────────────────────┐
│ Issues detectados:                    │
│ ⚠ Color budget: 3 colores saturados  │
│   en dashboard (hero + 2 charts)     │
│ ⚠ Typography: h1→h3 salta nivel h2   │
│ ❌ Missing focus states en cards      │
│ ⚠ Spacing inconsistente en módulos   │
└──────────────────────────────────────┘

┌─ FASE 2: RECOMENDAR ─────────────────┐
│ Para cada issue: ¿Corrijo?            │
│ 1. Color budget: reducir a 2 sat. → ✅│
│ 2. Typography: añadir h2 faltante  → ✅│
│ 3. Focus states: añadir :focus     → ✅│
│ 4. Spacing: unificar a escala 4px  → ✅│
└──────────────────────────────────────┘

┌─ FASE 3: IMPLEMENTAR ────────────────┐
│ 4 correcciones aplicadas in-place     │
│ Diff: 12 líneas cambiadas             │
└──────────────────────────────────────┘

┌─ FASE 4: VALIDAR ────────────────────┐
│ Re-ejecutando brand audit...          │
│ ✅ Todos los issues resueltos          │
│ Score: 94/100 (+14 pts desde audit)   │
└──────────────────────────────────────┘
```

**Tiempo estimado:** 20-30 minutos.

---

### Caso 5: Añadir wiki + preferencias (`/wiki`)

**Escenario:** Durante el desarrollo, quieres que el sistema recuerde decisiones de diseño.

```
# Durante una sesión de build:
Usuario:  "recuerda que los botones primarios siempre usan
           border-radius completo (rounded-box), no los quiero
           con bordes rectos nunca"
Sistema:  "✅ Preferencia guardada en .omd/preferences.md
           ID: pref_lqxk2_a3f9c1d4
           Scope: components.button
           Status: pending"

# Más tarde:
Usuario:  "guarda esto: la paleta secundaria es #00bcd4,
           no #0097a7 como estaba en el DESIGN.md original"
Sistema:  "✅ Preferencia guardada. Scope: color, Status: pending"

# Para ver todas las preferencias:
Usuario:  "/wiki"
Sistema:  "Tienes 3 preferencias pendientes:
           1. buttons.rounded-box (scope: components.button)
           2. secondary-palette-fix (scope: color)
           3. card-elevation (scope: components.card)
           ¿Quieres integrarlas (fold-in)?"

Usuario:  "integra preferencias"
Sistema:  "✅ 3 preferencias fold-in: pending → applied
           DESIGN.md actualizado con valores corregidos
           .omd/preferences.md actualizado"

# Wiki automático tras spec-engine:
┌─ Auto-ingesta ───────────────────────┐
│ ✅ wiki/spec-ClinicaDentalPro.md      │
│ ✅ wiki/validacion-ClinicaDentalPro.md │
│ ✅ wiki/index.md actualizado           │
└──────────────────────────────────────┘
```

**Tiempo estimado:** 5-10 minutos.

---

### Caso 6: Mini IA en app existente (`/ia`)

**Escenario:** Tu app de control de gastos ya funciona. Quieres añadir búsqueda inteligente.

```
Usuario:  "/ia"
Sistema:  "¿Qué perfil de IA Jutia prefieres?
           1. Lite → FlexSearch + estadísticas + predicciones
           2. Full → +ingesta PDF/DOCX/XLSX + Transformers.js QA
           3. No → omitir"

Usuario:  "2. Full"

┌─ Setup ──────────────────────────────┐
│ ✅ core/ia.js creado                  │
│ ✅ modules/ia-jutia/ inyectado        │
│ ✅ Transformers.js descargado         │
│ (versión local en assets/js/libs/)    │
└──────────────────────────────────────┘

┌─ Integración ────────────────────────┐
│ Atajo global: Cmd+K                   │
│ Barra de búsqueda en navbar           │
│ Ingesta: PDFs en /docs/ son indexados │
└──────────────────────────────────────┘

┌─ Uso ────────────────────────────────┐
│ Usuario: [Cmd+K] "total gastos enero" │
│ IA: "Gastos de enero: $12,450        │
│      Categoría más alta: Alimentos    │
│      ($4,200, 33.7% del total)"      │
└──────────────────────────────────────┘
```

**Tiempo estimado:** 10-15 minutos.

---

## 7. Ejemplo completo: App Control de Gastos

Sesión completa desde cero, con decisiones y outputs narrados.

### Paso 1: Iniciar

```
Usuario:  "nuevo proyecto"
Sistema:  "¿Classic (/new) o Design (/pro)?"
Usuario:  "/new"  (es un prototipo rápido)

Sistema:  "Nombre del proyecto:"
Usuario:  "ControlGastos"

Sistema:  "Tipo de app:"
Usuario:  "Finanzas personales"

Sistema:  "Descripción breve:"
Usuario:  "App offline para registrar gastos diarios,
           categorizarlos y ver reportes mensuales"

Sistema:  "Perfil:"
Usuario:  "Lite"

Sistema:  "IA Jutia:"
Usuario:  "No"
```

### Paso 2: Setup

```
┌─ pipeline-engine → setup-init ───────┐
│ Validando entorno...                 │
│ ✅ PowerShell 5.1+                    │
│ ✅ Git disponible                     │
│                                      │
│ Creando estructura...                │
│ ./ControlGastos/                     │
│ ├── index.html                       │
│ ├── core/                            │
│ │   ├── app.js                       │
│ │   └── db.js                        │
│ ├── modules/                         │
│ ├── assets/                          │
│ │   ├── css/                         │
│ │   └── js/libs/                     │
│ ├── project.config.js                │
│ └── specs/                           │
│                                      │
│ Descargando librerías...             │
│ ✅ Alpine.js 3.14                    │
│ ✅ Dexie.js 4.0                      │
│ ✅ CryptoJS 4.2                      │
│ ✅ Tailwind CSS 3.4                  │
│ ✅ DaisyUI 5.0                       │
│ ✅ Bootstrap Icons 1.11              │
│ ✅ Animate.css 4.1                   │
└──────────────────────────────────────┘

Usuario: "✅ CONTINUAR"
```

### Paso 3: Spec

```
┌─ pipeline-engine → spec-engine ──────┐
│ 1. Discovery:                        │
│ "¿Tienes alguna referencia de marca? │
│  (Stripe, Linear, Notion, o ninguna)"│
│ Usuario: "ninguna, usa defaults"     │
│                                      │
│ 2. Detectando módulos...             │
│ ¿Módulos requeridos?                 │
│ Usuario: "dashboard, gastos,         │
│           categorías, reportes"      │
│                                      │
│ 3. Asunciones 4+1:                   │
│ [🟩🟩🟩🟩🟩] Los gastos se registran   │
│     manualmente (no bancos)          │
│ [🟩🟩🟩🟩⬜] Reportes mensuales        │
│     con gráficos Chart.js            │
│ [🟩🟩🟩🟩🟩] Cifrado en campo "monto"  │
│ [🟩🟩🟩⬜⬜] Exportar a CSV            │
│     → ¿Quieres exportar a CSV?       │
│     Usuario: "sí" → [🟩🟩🟩🟩🟩]       │
│                                      │
│ 4. Spec generada:                    │
│ specs/ControlGastos.md              │
│ ├── 1. Descripción                   │
│ ├── 2. Stack técnico                 │
│ ├── 3. Modelo de datos               │
│ │   ├── gastos (id, fecha, monto,    │
│ │   │   categoria, nota, cifrado)    │
│ │   ├── categorias (id, nombre,      │
│ │   │   icono, color, presupuesto)   │
│ │   └── config (id, key, value)      │
│ ├── 4. Módulos                       │
│ ├── 5. Flujos                        │
│ ├── 6. Reglas                        │
│ ├── 7. Perfiles                      │
│ ├── 8. Pruebas                       │
│ └── 9. Librerías                     │
│                                      │
│ (Sin DESIGN.md — sin referencia)     │
└──────────────────────────────────────┘

Usuario: "✅ CONTINUAR"
```

### Paso 4: Design + Build

```
┌─ pipeline-engine → design-engine ────┐
│ Sin DESIGN.md → usando tema default   │
│ DaisyUI (light)                       │
│                                       │
│ Tokens aplicados:                     │
│   primary: oklch(0.55 0.2 240)       │
│   secondary: oklch(0.6 0.15 200)     │
│   rounded-box: 1rem                   │
│   font: system-ui                    │
└───────────────────────────────────────┘

┌─ pipeline-engine → code-generator ───┐
│ 4 módulos detectados.                │
│ Generando 1 por vez...               │
│                                       │
│ ── Módulo 1/4: core ────             │
│ ✅ index.html (shell Alpine)          │
│ ✅ core/app.js (router + store)       │
│ ✅ core/db.js (Dexie schema)          │
│ → stack-compliance: ✅                │
│ → design-engine: tema aplicado       │
│                                       │
│ ⏸️ PAUSA. ¿CONTINUAR?                │
│ Usuario: "sí"                         │
│                                       │
│ ── Módulo 2/4: Dashboard ──          │
│ ✅ modules/dashboard/module.html      │
│ ✅ modules/dashboard/module.js        │
│ (resumen: gastos hoy, este mes,      │
│  top categorías, gráfico semanal)     │
│ → compliance: ✅                      │
│ → design: cards con sombra, iconos   │
│                                       │
│ ⏸️ PAUSA. ¿CONTINUAR?                │
│ Usuario: "sí"                         │
│                                       │
│ ── Módulo 3/4: Gastos ──             │
│ ✅ modules/gastos/module.html         │
│ ✅ modules/gastos/module.js           │
│ (formulario + lista + filtros)        │
│ → compliance: ✅                      │
│ → design: inputs + botones DaisyUI   │
│                                       │
│ ⏸️ PAUSA. ¿CONTINUAR?                │
│ Usuario: "sí"                         │
│                                       │
│ ── Módulo 4/4: Categorías ──         │
│ ✅ modules/categorias/module.html     │
│ ✅ modules/categorias/module.js       │
│ (CRUD + presupuesto mensual)          │
│ → compliance: ✅                      │
│                                       │
│ ── Módulo extra: Reportes ──         │
│ ✅ modules/reportes/module.html       │
│ ✅ modules/reportes/module.js         │
│ (Chart.js mensual + CSV export)       │
│ → compliance: ✅                      │
│                                       │
│ 📦 Todos los módulos generados       │
└──────────────────────────────────────┘

Usuario: "✅ CONTINUAR"
```

### Paso 5: Validación

```
┌─ pipeline-engine → validation-engine ┐
│                                       │
│ FASE 1: Stack Compliance             │
│ ✅ Sin import/export/type="module"    │
│ ✅ Sin CDNs en runtime                │
│ ✅ CryptoJS presente en db.js         │
│ ✅ Variables globales (Dexie, Alpine) │
│                                       │
│ FASE 2: Brand Audit                  │
│ ⚠ Sin DESIGN.md — usando defaults    │
│   DaisyUI (no blocker)               │
│ ✅ Typography: h1→h2→h3 correcto     │
│ ✅ Color budget: 2 saturados         │
│ ✅ Responsive: 44x44 hit area        │
│                                       │
│ FASE 3: Technical QA                 │
│ 🔍 Abriendo DevTools...               │
│ ✅ Console: 0 errors, 0 warnings      │
│ ✅ Lighthouse a11y: 94               │
│ ✅ Lighthouse perf: 89               │
│ ✅ file:// test: sin errores          │
│                                       │
│ FASE 4: QA Rubric                    │
│ 1. Brand consistency    → PASS (N/A) │
│ 2. Typography           → PASS       │
│ 3. Voice register       → PASS       │
│ 4. Images/figures       → PASS       │
│ 5. Accessibility        → PASS       │
│ 6. Performance          → PASS       │
│ 7. Links                → PASS       │
│ 8. Offline compliance   → PASS       │
│                                       │
│ 📊 Score: 94/100                      │
│ 📄 docs/validacion-ControlGastos.md  │
└──────────────────────────────────────┘

Usuario: "✅ CONTINUAR"
```

### Paso 6: Deploy

```
┌─ pipeline-engine → deployment-jigue ─┐
│ Perfil: Lite                          │
│                                       │
│ ¿Mensaje de commit?                   │
│ (default: "feat: ControlGastos v1")   │
│ Usuario: "Enter"                      │
│                                       │
│ ✅ git add -A                          │
│ ✅ git commit -m "feat: ControlGastos │
│    v1"                                │
│ ✅ git push origin main               │
│                                       │
│ Empaquetando...                       │
│ ✅ dist/ControlGastos.zip creado      │
│                                       │
│ 🚀 PIPELINE COMPLETADO                │
│ 📦 Perfil: Lite                       │
│ 📁 Estructura: ./ControlGastos/       │
│ 📄 Spec: specs/ControlGastos.md      │
│ 📄 Reporte: docs/validacion-          │
│            ControlGastos.md           │
│ 📦 Package: dist/ControlGastos.zip    │
│ 🌐 Pages: https://angelhdz84.github.  │
│           io/ControlGastos            │
│                                       │
│ 🎯 Siguiente:                         │
│ - Abre index.html con doble clic      │
│ - Comparte el ZIP con tu cliente      │
│ - Siguiente versión: "/new" de nuevo  │
└──────────────────────────────────────┘
```

**Tiempo total:** ~18 minutos.

---

## 8. Troubleshooting

### "El pipeline se detuvo en fase X"

Causa más común: pérdida de contexto de OpenCode (>15k tokens).

```
Solución:
1. Usa /status para ver dónde quedó el pipeline
2. Reanuda con el comando apropiado:
   → "/setup" si no hay estructura
   → "/spec" si falta la spec
   → "/build" si falta código
   → "/test" si falta validación
```

### "No tengo OmD instalado"

```
Síntoma: pipeline-engine dice "OmD no disponible, fallback a Classic"
Solución (opcional):
  npx oh-my-design-cli install-skills --agent opencode --global
  # Instala 16 skills omd-* en ~/.opencode/skills/
  # No afecta pipelines en ejecución
```

Sin OmD, el pipeline funciona en modo Classic sin brand layer. spec-engine omite las secciones 10-15 y design-engine usa defaults de DaisyUI.

### "Error de compliance — el código tiene CDN/import"

```
❌ BLOCK: Se detectó CDN en runtime
   → Archivo: modules/dashboard/module.html:25
   → Recurso: https://cdn.jsdelivr.net/npm/chart.js

Solución:
1. Descargar la librería a assets/js/libs/
2. Reemplazar CDN por ruta relativa:
   <script src="assets/js/libs/chart.js"></script>
3. Re-ejecutar: /compliance
```

### "Perdí contexto y no sé qué módulo falta"

```
Usuario: "/status"
Sistema:
📊 Estado del pipeline:
   ├── Fase actual: BUILD (módulo 3/4)
   ├── Completado: setup ✅, spec ✅, build (2/4) ✅
   ├── Pendiente: gastos, reportes, validate, deploy
   └── specs/ControlGastos.md — presente

Usuario: "/build"  → reanuda desde módulo 3
```

### "Quiero descartar todo y empezar de nuevo"

```
Usuario: "/archive"
Sistema:
✅ spec movida a specs/archive/ControlGastos_20260618.md
✅ reporte movido a docs/archive/validacion-ControlGastos_20260618.md

Usuario: "/new"  → empieza nuevo pipeline
```

### "Mi app no abre con doble clic (perfil Lite)"

```
Posibles causas:
1. Las rutas de assets son absolutas → usar rutas relativas (./assets/...)
2. Hay fetch() a API externa → reemplazar por Dexie
3. Hay type="module" → quitar, usar variables globales
4. CORS bloquea file:// → no usar módulos ES6

Solución:
/compliance → detecta y corrige automáticamente
```

### "El build falló por una librería que no existe"

```
Síntoma: "Error: no se pudo descargar [librería]"
Solución:
1. Verificar nombre en specs/[app].md (sección 9)
2. Descargar manualmente desde CDN a assets/js/libs/
3. Re-ejecutar /build

Las librerías adicionales deben especificarse en la spec:
  ## 9. Librerías Adicionales
  - chart.js: https://cdn.jsdelivr.net/npm/chart.js@4.4.0
  → setup-init descarga a assets/js/libs/chart.js
```

---

## 9. Referencia rápida

### Contratos entre Skills

| Emisor | Receptor | Artefacto |
|--------|----------|-----------|
| `pipeline-engine` | `setup-init`, `spec-engine` | Nombre + tipo + descripción + perfil + modo |
| `setup-init` | `code-generator` | Estructura + librerías según perfil |
| `spec-engine` | `design-engine`, `code-generator`, `wiki-engine` | `specs/[app].md` + `specs/DESIGN.md` |
| `design-engine` | `code-generator`, `alpine-ui-patterns` | Preferencias de diseño en `.omd/preferences.md` (incluye `component_library`) |
| `alpine-ui-patterns` | `design-engine`, `code-generator` | Catálogo de ~100 componentes Pines/Penguin/Pinemix con fallback chain |
| `code-generator` | `stack-compliance-guard`, `validation-engine`, `wiki-engine` | `modules/*`, `core/*`, `index.html` |
| `stack-compliance-guard` | `code-generator` | Validación automática post-generación |
| `validation-engine` | `wiki-engine` | `docs/validacion-[app].md` + brand audit |
| `deployment-jigue` | — | Commit + Push + Pages + ZIP/.exe |
| `wiki-engine` | — | `wiki/` + `.omd/preferences.md` + MCP memory |

### Archivos generados

| Archivo | Contenido | Generado por |
|---------|-----------|-------------|
| `project.config.js` | Config del proyecto (perfil, nombre, módulos) | setup-init |
| `specs/[app].md` | Spec funcional + DESIGN.md (15 secciones) | spec-engine |
| `specs/DESIGN.md` | Brand layer (10-15) separado | spec-engine |
| `core/app.js` | Router + store Alpine | code-generator |
| `core/db.js` | Schema Dexie + CryptoJS | code-generator |
| `modules/*/module.html` | UI del módulo (Alpine + DaisyUI) | code-generator |
| `modules/*/module.js` | Lógica del módulo | code-generator |
| `.omd/preferences.md` | Preferencias de diseño capturadas | design-engine / wiki-engine |
| `docs/validacion-[app].md` | Reporte de validación 4 fases | validation-engine |
| `docs/validacion-[app].html` | Reporte visual (si aplica) | validation-engine |
| `dist/[app].zip` | Paquete distribuible (Lite) | deployment-jigue |
| `dist/[app].exe` | Ejecutable (Full) | deployment-jigue |
| `wiki/*.md` | Páginas de wiki persistente | wiki-engine |

### MCP Servers disponibles

| Servidor | Propósito | Setup |
|----------|-----------|-------|
| `stocky` | Imágenes Pexels + Unsplash (CC0) | `pip install -e mcp-servers/stocky/` |
| `refero-styles` | Sistemas de diseño en refero.design | `npm install && npm run build` en `mcp-servers/refero-styles/` |
| `memory` | Grafo persistente MCP | Incluido en opencode.json |
| `chrome-devtools` | DevTools remoto para validación | Incluido en opencode.json |
| `daisyui-gitmcp` | Documentación DaisyUI 5 vía gitmcp | Incluido en opencode.json |

### Resumen visual del pipeline

```
/nuevo proyecto
│
├─ /new (Classic) ──────────────────────────────┐
│   setup → spec → build → validate → deploy    │
│   5 fases, sin marca, prototipos rápidos       │
└───────────────────────────────────────────────┘
│
├─ /pro (Design) ───────────────────────────────┐
│   10 fases con sub-agentes + OmD brand layer   │
│   Apps producción, marca, equipo               │
└───────────────────────────────────────────────┘
│
├─ Comandos individuales ───────────────────────┐
│   /setup → solo estructura                     │
│   /spec → solo spec                            │
│   /build → solo código                         │
│   /test → solo validación                      │
│   /refactor → solo corregir diseño             │
│   /deploy → solo publicar                      │
│   /wiki → solo gestionar wiki                  │
│   /ia → solo añadir mini IA                    │
└───────────────────────────────────────────────┘
```

---

*Documento generado para **Ateje Stack** — Skill-Layer Architecture v1.0*
*Última actualización: 2026-06-19*
