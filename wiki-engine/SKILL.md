---
title: wiki-engine
description: Mantiene un wiki persistente de conocimiento (wiki/) con páginas markdown generadas + preferencias de diseño en .omd/preferences.md. Reemplaza llm-wiki + omd:remember + omd:learn. Triple capa: markdown versionado para humanos + .omd/preferences.md para preferencias + Engram (opcional) para memoria persistente del agente. Ingesta automática tras spec-engine y validation-engine.
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

> **Propósito**: Preservar conocimiento entre sesiones: decisiones técnicas, preferencias de diseño, documentación de la app. Triple capa: markdown para humanos, preferencias para diseño, Engram (opcional) para memoria persistente del agente.
> **Idioma**: ES | **Output**: `wiki/*.md` + `.omd/preferences.md`

---

## Capas de almacenamiento

| Capa | Formato | Propósito | Persistencia |
|------|---------|-----------|-------------|
| **Wiki pages** | `wiki/[slug].md` | Conocimiento general, decisiones, documentación | Versionado en git |
| **Preferences** | `.omd/preferences.md` | Preferencias de diseño capturadas por design-engine | No versionado (local) |
| **Engram** | SQLite + FTS5 | Memoria persistente + búsqueda semántica para el agente | `.omd/` (no versionado) |

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
| "engram tui" | Abre dashboard visual de memoria (si Engram instalado) |
| "engram search [q]" | Busca en memoria persistente |

---

## Memory graph — Engram (opcional)

Engram es un backend de memoria persistente para agentes de IA. Reemplaza el MCP memory graph conceptual con almacenamiento SQLite real + búsqueda FTS5 + 20 tools MCP.

### Requisitos

- Tener Engram instalado: `winget install Gentleman.Programming.Engram`
- O desde GitHub: https://github.com/Gentleman-Programming/engram

### Mapeo wiki-engine → Engram

| wiki-engine acción | Engram tool | Parámetros |
|-------------------|-------------|-----------|
| Guardar página wiki | `mem_save` | `title=wiki:[slug]`, `type=documentation`, `content=[text]` |
| Guardar preferencia | `mem_save` | `title=pref_[scope]`, `type=preference`, `content=[text]` |
| Buscar conocimiento | `mem_search` | `query=[text]`, `type=documentation`, `limit=10` |
| Contexto de sesión | `mem_context` | `project=[app]` |
| Timeline de decisiones | `mem_timeline` | `obs_id=[id]` |
| Detectar conflictos | `mem_compare` | `obs_id_1`, `obs_id_2` |
| Dashboard visual | `engram tui` | (CLI externo) |

### Configuración

```yaml
# .opencode/mcp/engram-wiki.json — solo si Engram está instalado
mcp:
  engram:
    type: local
    command: engram
    args: ["mcp", "--project", "{project_name}"]
```

Variable de entorno: `ENGRAM_DATA_DIR=.omd/` — la memoria viaja con el proyecto.

### Fallback

Si Engram no está instalado, wiki-engine funciona exactamente como antes con:
- `wiki/*.md` — versionado en git
- `.omd/preferences.md` — preferencias de diseño

### Setup automático

Durante `/setup`, `scripts/setup-engram.ps1` detecta Engram y lo configura:

```powershell
if (Get-Command engram -ErrorAction SilentlyContinue) {
    engram setup opencode
    $env:ENGRAM_DATA_DIR = ".omd"
    Write-Output "✅ Engram configurado como memoria persistente"
} else {
    Write-Output "ℹ️ Engram no instalado. Usando solo markdown."
}
```

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
- Si Engram no está disponible, funciona solo con markdown + preferencias.

---

## Output esperado

```
✅ Wiki: wiki/spec-inventario.md creada
✅ Preferencia: pref_abc123 guardada (scope: color)
✅ Memoria: Engram actualizado con 3 entidades
```
