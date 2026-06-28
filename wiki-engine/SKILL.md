---
name: wiki-engine
description: Mantiene un wiki persistente de conocimiento (wiki/) con páginas markdown generadas + preferencias de diseño en .omd/preferences.md. Reemplaza llm-wiki + omd:remember + omd:learn. Doble capa: markdown versionado para humanos + MCP memory graph para búsqueda rápida del agente. Ingesta automática tras spec-engine y validation-engine.
license: MIT
compatibility: Requiere directorio wiki/ en la raíz del proyecto. MCP memory server opcional.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, professional, business]
  triggers: ["guardar", "recuerda", "wiki", "documenta", "almacena", "memo", "preference", "aprende", "integra preferencias", "fold preferences"]
  language: es
  requires: []
---

# wiki-engine — Wiki Persistente + Preferencias de Diseño

> **Propósito**: Preservar conocimiento entre sesiones: decisiones técnicas, preferencias de diseño, documentación de la app. Doble capa: markdown para humanos, MCP memory graph para el agente.
> **Idioma**: ES | **Output**: `wiki/*.md` + `.omd/preferences.md`

---

## Capas de almacenamiento

| Capa | Formato | Propósito | Persistencia |
|------|---------|-----------|-------------|
| **Wiki pages** | `wiki/[slug].md` | Conocimiento general, decisiones, documentación | Versionado en git |
| **Preferences** | `.omd/preferences.md` | Preferencias de diseño capturadas por design-engine | No versionado (local) |
| **Memory graph** | MCP memory server | Búsqueda semántica rápida para la IA | Persistente entre sesiones |

---

## Wiki pages

### Estructura

```
wiki/
├── index.md              ← índice auto-generado
├── spec-[app].md         ← ingesta de spec-engine
├── validacion-[app].md   ← ingesta de validation-engine
├── decision-[slug].md    ← decisiones arquitectónicas (ADR)
└── ...
```

### Cómo se crean

| Disparador | Qué se guarda |
|-----------|--------------|
| Tras spec-engine | `wiki/spec-[app].md` con la spec completa |
| Tras validation-engine | `wiki/validacion-[app].md` con el reporte |
| "Guarda esto: [texto]" | `wiki/[slug].md` con el texto + timestamp |
| "Documenta esta decisión: [título]" | `wiki/decision-[slug].md` en formato ADR |
| Prompt inicial del usuario | `wiki/prompt-[app].md` con el request original |

### Formato de página

```markdown
# wiki: [título]

**Creado:** [ISO timestamp]
**Origen:** [spec-engine | validation-engine | user | auto]

[contenido]

---
*Generado por wiki-engine de SKILLS-AHAGUILERA*
```

### Reglas

- No editar páginas existentes sin preguntar.
- Actualizar `wiki/index.md` al añadir una página nueva.
- Fechas en ISO 8601.

---

## Preferences (.omd/preferences.md)

### Formato

```markdown
---
schema: omd.preferences/v1
---

# Preference Log

## 2026-06-18T12:00:00.000Z — ctas-never-uppercase

\`\`\`omd-meta
id: pref_lqxk2_a3f9c1d4
timestamp: 2026-06-18T12:00:00.000Z
scope: components.button
signal: user-statement
confidence: explicit
status: pending
source_agent: opencode
\`\`\`

CTAs are never uppercase
```

### Scope mapping

| Keywords | scope |
|----------|-------|
| `button`, `cta`, `btn` | `components.button` |
| `card` | `components.card` |
| `dialog`, `modal` | `components.dialog` |
| `input`, `field`, `form` | `components.input` |
| `nav`, `navigation`, `header`, `menu` | `components.navigation` |
| `badge`, `chip`, `pill`, `tag` | `components.badge` |
| `color`, `palette`, `hex`, `hue` | `color` |
| `font`, `typography`, `typeface` | `typography` |
| `spacing`, `gap`, `padding`, `margin` | `spacing` |
| `voice`, `tone`, `copy`, `microcopy` | `voice` |
| `motion`, `animation`, `transition` | `motion` |
| `layout`, `structure`, `hierarchy` | `layout` |
| (sin match) | `visualTheme` |

### Status lifecycle

```
pending → (omd:learn fold-in) → applied
pending → (user rejects) → rejected
applied → (user changes mind) → superseded
```

### Comandos

| Comando | Acción |
|---------|--------|
| "Guarda esto: [preferencia]" | Crea entrada con `status: pending` |
| "Integra preferencias" | Fold-in: pending → applied en DESIGN.md |
| "Olvida [scope/id]" | pending → rejected |
| "Muestra preferencias" | Lista todas con su status |

---

## Memory graph (MCP)

Si el MCP memory server está disponible, mantener un grafo con:

- **Entidades**: apps, specs, módulos, decisiones, preferencias
- **Relaciones**: "usa", "depende de", "reemplaza", "decidió"

---

## Auto-ingesta

Ejecutar automáticamente después de:
- `spec-engine` → wiki-page con la spec
- `validation-engine` → wiki-page con el reporte
- `design-engine` Phase 4 → preferencia en `.omd/preferences.md`
- Cualquier "guarda esto" del usuario

---

## Reglas

- Append-only para `.omd/preferences.md` (nunca editar entradas existentes, solo añadir nuevas).
- No preguntar "¿guardo esto?" — guardar automático.
- Wiki pages se versionan en git. `.omd/` no se versiona (local).
- Si el MCP memory no está disponible, funciona solo con markdown.

---

## Output esperado

```
✅ Wiki: wiki/spec-inventario.md creada
✅ Preferencia: pref_abc123 guardada (scope: color)
✅ Memoria: grafo actualizado con 3 entidades
```
