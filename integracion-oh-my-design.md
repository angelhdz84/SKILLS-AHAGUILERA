# Integración oh-my-design → SKILLS-AHAGUILERA
## Propuesta Skill-Layer Architecture: de 31 a 11 skills consolidadas

---

## 1. Diagnóstico: ¿Cuál es el problema real?

### Métricas actuales

| Ecosistema | Skills | Sub-agentes | Total unidades conceptuales |
|-----------|--------|-------------|----------------------------|
| AHAguilera | 14 | 5 (OpenCode nativos) | 19 |
| oh-my-design | 17 | 16 (`.claude/`) + 8 (`.codex/`) | 33+ |
| Suma ingenua (sin consolidar) | **31** | **21+** | **52+** |

### Problemas de sumar 31 skills sin consolidar

1. **Ruido de activación**: Con 31 skills, el agente pierde tiempo evaluando cuál aplicar. Los triggers compiten y se solapan.
2. **Overlap funcional**: Varias skills OmD y AHAguilera hacen exactamente lo mismo (descubrimiento, diseño, validación). Duplicación = mantenimiento × 2.
3. **Sub-agentes incompatibles**: Los 16 sub-agentes OmD están en `.claude/agents/` (`.md`) y `.codex/agents/` (`.toml`). OpenCode **no puede importarlos** — usa su propio sistema de `task` + `subagent_type`. Son 0 utilizables directamente.
4. **Carga cognitiva**: 52 unidades conceptuales = decisiones más lentas, más tokens por turno, más confusión para el agente.

---

## 2. Enfoque: Skill-Layer Architecture

En vez de *sumar* skills OmD a las existentes, las **fusionamos en 5 motores consolidados**. Cada motor absorbe 2-4 skills y ofrece la misma funcionalidad con menos complejidad.

### Principio

```
Cada "motor" es una skill que:
  1. Detecta qué necesita el usuario (modo)
  2. Invoca sub-skills o sub-agentes según corresponda
  3. Unifica el output con un formato común
```

### Mapa de fusión

```
ANTES (31 skills)                    DESPUÉS (11 skills)
─────────────────                    ──────────────────
spec-creator                    ─┐
omd:init                        ─┤  →  spec-engine
omd:taste                       ─┘

design-ux-intelligence          ─┐
daisyui-patterns                ─┤
omd:apply                       ─┤  →  design-engine
omd:sync                        ─┤
omd:remember / omd:learn        ─┘

validation-offline              ─┐
ux-refactor                     ─┤  →  validation-engine
omd:designer-review             ─┤
omd:final-qa                    ─┘

prompt-inicial                  ─┐
supercharged-pipeline           ─┤  →  pipeline-engine
omd:harness                     ─┤
omd:orchestrator                ─┘

llm-wiki                        ─┐
omd:remember / omd:learn (bis)  ─┤  →  wiki-engine
```

### Skills standalone (se quedan intactas)

| Skill | Razón |
|-------|-------|
| `setup-init` | Valida entorno, crea estructura, instala librerías. OmD no tiene equivalente. |
| `stack-compliance-guard` | Única. Bloquea CDNs, imports, fetch, cifrado faltante. No existe en OmD. |
| `code-generator` | Genera código por fases desde specs. Ahora potenciado con DESIGN.md como fuente de tokens. |
| `deployment-jigue` | Publicación GitHub + Pages + ZIP/.exe. Única. |
| `ia-jutia` | Mini IA offline-first (FlexSearch + QA). Única. |

### Nuevas skills de OmD (valor genuino, SIN solapamiento)

| Skill | Valor | Perfiles |
|-------|-------|----------|
| `omd:es-writer` | Microcopy profesional en español latino (adaptado de `kr-writer`) | Lite, Full |
| `omd:reference-capture` | Navega sitios reales vía CDP, extrae tokens de diseño | Lite, Full |
| `omd:asset-fetch` | Busca y cachea assets CC0 (fotos, avatares, iconos) | Lite, Full |
| `omd:experiment-gallery` | Comparativa N-brands para presentar a clientes | Full |
| `omd:codex-image` | Genera imágenes channel-aware desde la spec | Lite, Full |

---

## 3. Los 5 Motores en detalle

### 3.1 `spec-engine`

**Reemplaza**: `spec-creator` + `omd:init` + `omd:taste`

**Fases**:

1. **Discovery** — Pregunta por tono de marca, audiencia, personalidad visual. Inspira con las 286 referencias reales de OmD.
2. **Functional spec** — Define modelo de datos, módulos, flujos, reglas de negocio (secciones 1-9 de la spec actual).
3. **Brand spec** — Genera DESIGN.md embebido (secciones 10-15: Voice, Narrative, Principles, Personas, States, Motion).
4. **Cross-check** — Verifica coherencia entre brand spec y functional spec.

**Output** — `specs/[app].md` con formato extendido:

```markdown
# spec: [app]
## 1. Descripción
## 2. Stack técnico
## ...
## 9. UX y Animaciones
## 10. Brand Voice
## 11. Narrative
## 12. Design Principles
## 13. Personas
## 14. States (loading / empty / error / edge)
## 15. Motion Design
```

**Trigger**: `/spec` o detección de "nueva app" o "define mi app"

**Sub-agentes**: invoca `spec-agent` (OpenCode nativo) para la parte funcional; la brand spec la genera la skill directamente.

---

### 3.2 `design-engine`

**Reemplaza**: `design-ux-intelligence` + `daisyui-patterns` + `omd:apply` + `omd:sync` + `omd:remember` + `omd:learn`

**Fases**:

1. **Load brand context** — Lee `specs/[app].md` secciones 10-15, o `.omd/preferences.md` si existe.
2. **Resolve tokens** — Mapea brand spec → tokens DaisyUI 5 (colores, tipografía, espaciado, border-radius).
3. **Apply to module** — Para cada módulo generado por `code-generator`, aplica tokens + patrones DaisyUI + Alpine.js.
4. **Capture feedback** — Si el usuario corrige algo (color, spacing, layout), guarda en `.omd/preferences.md`.
5. **Sync** — Asegura que todos los agentes futuros lean el mismo DESIGN.md actualizado.

**Knowledge base interna**: Las 286 referencias OmD como catálogo de inspiración por tipo de app (SaaS, ecommerce, dashboard, landing, etc.).

**Output**: UI visualmente consistente con la brand spec, módulo a módulo.

**Trigger**: Se activa automáticamente tras `code-generator` o en `/build`.

**Sub-agentes**: Invoca `design-agent` (OpenCode nativo) para tareas complejas de UI; la skill maneja la aplicación de tokens directamente.

**Diferencia clave con OmD puro**: `design-engine` aplica tokens a **componentes DaisyUI 5 reales** (btn, card, input, modal, drawer) en vez de HTML genérico. El conocimiento de DaisyUI está dentro de la skill, no en un archivo separado.

---

### 3.3 `validation-engine`

**Reemplaza**: `validation-offline` + `ux-refactor` + `omd:designer-review` + `omd:final-qa`

**Fases**:

1. **Stack compliance** — Verifica reglas offline-first (delega a `stack-compliance-guard`): sin CDNs, sin imports, sin fetch, cifrado presente.
2. **Brand audit** — Compara UI generada contra DESIGN.md: ¿colores correctos? ¿tipografía? ¿spacing? ¿estados (loading/empty/error)?
3. **Technical QA** — DevTools console errors + Lighthouse accessibility + Playwright E2E.
4. **UX heuristic review** — Evalúa contra las 10 heurísticas de Nielsen + checklist UX crítico.
5. **QA rubric** — 8-item rubric estilo OmD final-qa: readiness score 0-100.
6. **Refactor mode** — Si hay desviaciones de DESIGN.md, auto-corrige in-place (reemplaza la fase `ux-refactor` completa).

**Output**: `docs/validacion-[app].md` con score final, lista de issues priorizados, y diff de auto-correcciones si aplica.

**Trigger**: `/test`, `/validate`, o `/refactor`.

**Sub-agentes**: `test-agent`, `ux-auditor`, `accessibility-auditor` (todos nativos de OpenCode).

---

### 3.4 `pipeline-engine`

**Reemplaza**: `prompt-inicial` + `supercharged-pipeline` + `omd:harness` + `omd:orchestrator`

**Modos**:

| Comando | Modo | Fases | Cuándo usarlo |
|---------|------|-------|---------------|
| `/new` | Classic | 5 fases: setup → spec → build → validate → deploy | Proyectos simples, prototipos rápidos |
| `/pro` | Design | 10 fases con sub-agentes (harness-style) | Proyectos complejos, producción, equipo |

**Fases del modo Design** (10 fases, inspiradas en OmD harness):

```
 1. Brainstorming
 2. UX Research (sub-agente explore + design-agent)
 3. Spec + Brand (spec-engine)
 4. Design System (design-engine)
 5. UI Coding (code-generator + design-engine aplica tokens)
 6. Microcopy (omd:es-writer)
 7. Assets (omd:asset-fetch + stocky MCP)
 8. Testing (validation-engine fases 1-3)
 9. Design Review (validation-engine fases 4-5)
10. Deploy (deployment-jigue)
```

**Auto-detección**: Si el usuario da una descripción vaga, pregunta si quiere rápido (`/new`) o completo (`/pro`).

**Orquestación**: Dispatching secuencial de skills según la fase actual, con paso de contexto entre fases (`specs/` → `project.config.js` → `assets/`).

**Trigger**: `/new`, `/pro`, o cualquier mensaje que indique inicio de proyecto o "quiero crear una app".

---

### 3.5 `wiki-engine`

**Reemplaza**: `llm-wiki` + `omd:remember` + `omd:learn`

**Capas**:

1. **Wiki pages** (`wiki/` markdown versionado): conocimiento general, decisiones de arquitectura, documentación técnica.
2. **Preferences** (`.omd/preferences.md`): preferencias de diseño capturadas por `design-engine` (colores, fuentes, spacing preferidos).
3. **Memory graph** (MCP memory server): búsqueda semántica rápida para el agente.

**Auto-ingesta**:

| Disparador | Qué ingesta |
|-----------|-------------|
| Tras `spec-engine` | Guarda la spec completa en `wiki/` |
| Tras `validation-engine` | Guarda el reporte en `wiki/` |
| Tras corrección de diseño | Guarda preferencia en `.omd/preferences.md` |
| "Guarda esto" | Crea página en `wiki/` con el contexto actual |
| "Recuerda que..." | Crea observación en MCP memory + página en `wiki/` |

**Trigger**: `/wiki`, "guarda esto", "recuerda que...", "documenta esta decisión", o automático tras otras skills.

---

## 4. Sub-agentes: Mapeo OmD → OpenCode

OpenCode NO puede importar sub-agentes OmD (`.md`/`.toml`). Pero ya tiene equivalentes funcionales integrados:

| Sub-agente OmD | Rol | OpenCode equivalente | Suficiente |
|---------------|-----|---------------------|:---:|
| `omd-master` | Orquestador maestro | `task` dispatching + `pipeline-engine` | ✅ |
| `omd-ux-researcher` | Investigación UX | `explore` + `design-agent` | ✅ |
| `omd-ui-junior` | Implementación UI | `design-agent` | ✅ |
| `omd-ux-engineer` | Ingeniería UX | `design-agent` + `ux-engineer` | ✅ |
| `omd-asset-curator` | Curaduría de assets | MCP `stocky` (Pexels + Unsplash) — ya instalado | ✅ |
| `omd-microcopy` | Microcopy | Nueva skill `omd:es-writer` | ✅ |
| `omd-ux-writer` | UX writing | Nueva skill `omd:es-writer` | ✅ |
| `omd-a11y-auditor` | Auditoría accesibilidad | `accessibility-auditor` + `accessibility-engineer` | ✅ |
| `omd-persona-tester` | Testing con personnas | `ux-auditor` (análisis heurístico) | ~ |
| `omd-critic` | Crítica de diseño | `ux-auditor` + dual review en `/pro` | ✅ |
| `omd-orchestrator` | Orquestador v0.2 | `pipeline-engine` | ✅ |

**Total sub-agentes gestionados**: ~9 (todos nativos de OpenCode, 0 importados de OmD).

**Skills de diseño que se convierten en conocimiento interno** (no en sub-agentes): las 286 referencias OmD se almacenan como base de conocimiento dentro de `design-engine`, no como skills separadas.

---

## 5. Experiencia de usuario

### Flujo clásico (`/new`)

```
Usuario: "crea una app de inventario"
  → pipeline-engine detecta modo clásico
  → spec-engine: pide tono de marca, muestra ejemplos (Linear, Notion, Stripe)
  → spec-engine: genera spec funcional + DESIGN.md (14 secciones)
  → setup-init: descarga librerías según perfil (Lite/Full)
  → design-engine: aplica tokens de marca a cada módulo
  → code-generator: genera módulos respetando DESIGN.md
  → validation-engine: compliance + brand audit + DevTools + rubric
  → deployment-jigue: publica
```

### Flujo pro (`/pro`)

```
Usuario: "/pro, app de inventario corporativo multiusuario"
  → pipeline-engine modo Design: 10 fases
  → Fase 1-2: brainstorming + UX research con explore + design-agent
  → Fase 3: spec-engine genera spec + DESIGN.md
  → Fase 4: design-engine define design system (colores, tipografía, componentes)
  → Fase 5: code-generator genera UI + design-engine aplica tokens en vivo
  → Fase 6: omd:es-writer redacta microcopy profesional
  → Fase 7: omd:asset-fetch + stocky MCP buscan imágenes CC0
  → Fase 8: validation-engine: compliance técnico + tests
  → Fase 9: validation-engine: brand audit + QA rubric + refactor si necesario
  → Fase 10: deployment-jigue publica
```

### Beneficios que nota el usuario

| Antes (solo AHAguilera) | Después (con OmD integrado) |
|-------------------------|----------------------------|
| "Define el tono (formal/casual/divertido)" — 3 opciones genéricas | "Inspírate en Linear, Notion, Stripe, o Toss" — 286 referencias reales |
| UI funcional pero sin personalidad de marca | UI con tokens de marca coherentes (color, tipografía, spacing, motion) |
| Microcopy funcional en español | Microcopy profesional con voz de marca consistente |
| Validación solo técnica | Validación técnica + diseño + brand audit + rúbrica QA |
| Pipeline fijo de 5 fases | Pipeline adaptable (rápido `/new` o completo `/pro`) |
| Sin captura de preferencias | Preferencias persistentes (`.omd/preferences.md`) |
| Sin assets visuales | Catálogo CC0 + generación de imágenes |

---

## 6. Comparativa final

| Aspecto | Antes (suma ingenua 31+21) | Después (Skill-Layer 11+9) |
|---------|---------------------------|---------------------------|
| Skills | 31 | 11 |
| Sub-agentes | 21+ (16 incompatibles) | 9 (todos nativos OpenCode) |
| Unidades conceptuales | 52+ | 20 |
| Brand design layer (DESIGN.md) | ❌ No | ✅ Sí (6 secciones: Voice, Narrative, Principles, Personas, States, Motion) |
| Referencias de marca | 0 | 286 |
| Microcopy español profesional | ❌ No | ✅ Sí (vía `omd:es-writer`) |
| Live design capture (CDP) | ❌ No | ✅ Sí (`omd:reference-capture`, on demand) |
| Assets CCO curados | Solo vía MCP stocky | Catálogo cacheado + MCP stocky |
| Mantenimiento skills duplicadas | Alto (spec/diseño/val se solapan) | Bajo (1 skill por dominio funcional) |
| Riesgo de activación incorrecta | Alto (31 skills compiten por triggers) | Bajo (11 skills, triggers claros y disjuntos) |
| Carga cognitiva para el agente | Muy alta | Gestionable |
| Curva de aprendizaje para el usuario | Alta (31 comandos/triggers) | Baja (11 skills, 5 comandos principales) |

---

## 7. Implementación

### Fase 1: Instalar OmD base

```bash
cd D:\REPOSITORIOS GitHUB\Ateje
npx oh-my-design-cli install-skills --agent opencode
```

Esto descarga:
- 17 skills OmD en `.opencode/skills/omd-*/`
- 286 referencias DESIGN.md de marcas reales
- `skills-lock.json` para integridad

### Fase 2: Crear los 5 motores

Para cada motor, crear su `SKILL.md` en `.opencode/skills/`:

| Motor | Archivo | Reemplaza |
|-------|---------|-----------|
| `spec-engine` | `.opencode/skills/spec-engine/SKILL.md` | `spec-creator`, `omd:init`, `omd:taste` |
| `design-engine` | `.opencode/skills/design-engine/SKILL.md` | `design-ux-intelligence`, `daisyui-patterns`, `omd:apply`, `omd:sync`, `omd:remember`, `omd:learn` |
| `validation-engine` | `.opencode/skills/validation-engine/SKILL.md` | `validation-offline`, `ux-refactor`, `omd:designer-review`, `omd:final-qa` |
| `pipeline-engine` | `.opencode/skills/pipeline-engine/SKILL.md` | `prompt-inicial`, `supercharged-pipeline`, `omd:harness`, `omd:orchestrator` |
| `wiki-engine` | `.opencode/skills/wiki-engine/SKILL.md` | `llm-wiki`, `omd:remember`, `omd:learn` |

### Fase 3: Adaptar OmD al stack offline-first

- Las referencias OmD asumen Google Fonts CDN → adaptar a `assets/fonts/`
- Las referencias asumen imports ES6 → adaptar a etiquetas `<link>`/`<script>`
- Traducir microcopy de referencias coreanas/inglesas a español latino

### Fase 4: Actualizar AGENTS.md

- Desregistrar skills reemplazadas de la sección de skills
- Registrar los 5 motores + nuevas skills OmD
- Actualizar tabla de comandos slash

### Fase 5: Prueba e iteración

```bash
# Probar flujo clásico
/new "app de tareas"

# Probar flujo pro
/pro "app de gestión de proyectos corporativa"

# Probar microcopy
/escribir "botón de guardar para app de inventario"
```

---

## 8. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|:-----------:|------------|
| Las 286 referencias están en inglés/coreano y algunas no aplican al mercado hispano | Alta | Crear `omd:es-writer` que adapta tono y ejemplos. Las referencias son inspiración, no dogma. |
| OmD skills ocupan espacio en `.opencode/skills/` (17 skills ≈ 2-5 MB) | Baja | Espacio en disco no es problema para archivos markdown. |
| Los motores fusionados son demasiado grandes (mucha responsabilidad en una skill) | Media | Si un motor se vuelve muy grande, se puede dividir en sub-skills internas (no expuestas al usuario). |
| OpenCode no soporta todas las features de OmD (CDP para reference-capture) | Media | `omd:reference-capture` usa Chrome DevTools Protocol — OpenCode puede lanzar Chrome. Si no, queda como feature opcional (modo Full). |
| El usuario prefiere mantener skills separadas por claridad | Baja | El diseño es modular: se puede migrar de a una skill. No hay que hacer todo junto. |
| OmD tiene dependencias externas (npm packages) | Media | `oh-my-design-cli` requiere npm. Solo para instalación. En runtime no hay dependencias. |

---

## 9. Preguntas para decidir

1. **¿Eliminar o conservar `daisyui-patterns` como skill separada?** — Propongo absorberla en `design-engine`. Los patrones DaisyUI son conocimiento, no un pipeline activo.

2. **¿Eliminar o conservar `ux-ui-universal`?** — Propongo eliminarla. OmD es multi-stack por naturaleza (`omd:apply` funciona con React, Django, lo que sea). No necesitamos una skill separada para multi-stack UX.

3. **¿`supercharged-pipeline` se elimina o se fusiona?** — Fusión total en `pipeline-engine`. El modo `/pro` es el reemplazo directo.

4. **¿Migrar gradual o todo junto?** — Recomiendo gradual: instalar OmD primero, crear motores uno por uno, probar cada reemplazo. No hay que hacer todo en un solo cambio.

5. **¿Renombrar skills AHAguilera existentes o mantener nombres?** — Propongo mantener nombres familiares donde sea posible. `spec-engine` suena natural, `design-engine` también. Evitar nombres muy técnicos.
