---
<!-- Archived — reemplazado por wiki-engine -->
# @deprecated — Reemplazado por wiki-engine
# Motivo: Fusión llm-wiki + omd:remember + omd:learn en wiki-engine con preferencias de diseño + auto-ingesta
# Migración: wiki-engine unifica wiki pages + preferencias de diseño + memory graph
name: llm-wiki
description: [DEPRECATED] Reemplazado por wiki-engine. Mantiene un wiki persistente de conocimiento (wiki/) con paginas markdown generadas por LLM + grafo en MCP memory. Se activa automaticamente tras spec-creator, code-generator y validation-offline para ingestar sus outputs. Tambien responde a "guarda esto", "recuerda que...", "documenta esta decision", "crea wiki", "resume esta fuente". Opera en 3 modos: ingest (procesar fuentes), query (responder desde el wiki), lint (revisar salud del wiki). Usa doble capa: markdown versionado para humanos + MCP memory server para busqueda rapida del LLM.
license: MIT
compatibility: Requiere @AGENTS.md. Usa @modelcontextprotocol/server-memory como backend de grafo (ya configurado en opencode.json). 100% markdown, sin scripts, sin imports.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  generatedBy: "skill-creator"
  triggers:
    - "guarda esto"
    - "recuerda que"
    - "documenta esta decision"
    - "crea wiki"
    - "resume esta fuente"
    - "wiki"
    - "persistir conocimiento"
    - "registra esto"
    - "auto-ingest spec-engine"
    - "auto-ingest code-generator"
    - "auto-ingest validation-engine"
    - "lint wiki"
    - "que sabes sobre"
    - "busca en el wiki"
  stack: ["offline-first"]
  language: es
  outputPath: "wiki/"
  autoSave: true
---

# SKILL: llm-wiki (Wiki de Conocimiento Persistente)

> **Proposito**: Mantener un wiki de conocimiento que se enriquece con cada
> interaccion — specs, decisiones, patrones, resultados de validacion.
> Inspirado en el patron LLM Wiki de Andrej Karpathy.
>
> **Modo**: Ingest / Query / Lint | **Idioma**: ES
> **Output**: Paginas en `wiki/` + entidades en MCP memory

---

## FLUJO OBLIGATORIO

### FASE 1: Init — Bootstrap del wiki

Solo si `wiki/` no existe o el usuario pide explícitamente "crea wiki":

1. Crear directorio `wiki/` con subdirectorios:
   ```
   wiki/
   ├── INDEX.md
   ├── LOG.md
   ├── concepts/
   ├── skills/
   ├── patterns/
   ├── apps/
   ├── decisions/
   └── sources/
   ```
2. Escribir INDEX.md usando plantilla de `assets/templates/INDEX.md`
3. Escribir LOG.md con entrada inicial
4. Si hay contenido previo en el repositorio (skills, specs existentes),
   hacer un ingest inicial de cada uno
5. Informar al usuario: "Wiki creado en wiki/. Puedo ingestar fuentes existentes
   si lo deseas."

### FASE 2: Ingest — Procesar fuente nueva

Se activa cuando:
- El usuario dice "guarda esto", "recuerda que...", "resume esta fuente"
- Se completa `spec-engine` (spec generada)
- Se completa `code-generator` (codigo generado)
- Se completa `validation-engine` (reporte generado)
- El usuario comparte un articulo, conversacion o decision

#### Paso 2.1 — Identificar la fuente
Determinar que tipo de fuente es:

| Tipo | Origen tipico | Pagina wiki destino |
|------|--------------|-------------------|
| spec | specs/[app].md | wiki/sources/spec-[app].md + wiki/apps/[app].md |
| skill | skills/*/SKILL.md | wiki/sources/skill-[name].md + wiki/skills/[name].md |
| patron | componentes/ o decision | wiki/sources/pattern-[name].md + wiki/patterns/[name].md |
| decision | conversacion con usuario | wiki/sources/decision-[name].md + wiki/decisions/ADR-N.md |
| validacion | docs/validacion-[app].md | wiki/apps/[app].md (actualizar) |
| articulo | URL o texto compartido | wiki/sources/article-[slug].md |

#### Paso 2.2 — Leer y extraer
Leer la fuente y extraer:
- Resumen (3-5 lineas)
- Puntos clave (atomicos, unico cada uno)
- Entidades y conceptos que menciona
- Relaciones con conocimiento existente

#### Paso 2.3 — Actualizar MCP memory
Usar las tools del MCP memory server en este orden:
1. `search_nodes` — buscar entidades relacionadas existentes
2. `create_entities` — crear entidad(es) para la fuente nueva
3. `create_relations` — conectar la fuente con entidades existentes
4. `add_observations` — agregar observaciones atomicas donde corresponda

Ver `references/memory-graph.md` para detalle de cada tool.

#### Paso 2.4 — Crear/actualizar pagina(s) markdown
1. Crear pagina fuente en `wiki/sources/[tipo]-[slug].md`
   usando plantilla SOURCE.md
2. Si la fuente introduce una entidad nueva (app, skill, patron, decision),
   crear su pagina correspondiente usando plantilla ENTITY.md
3. Si la fuente actualiza una entidad existente, modificar su pagina
4. Enlaces entre paginas: `[nombre](ruta/relativa.md)`

#### Paso 2.5 — Actualizar INDEX.md
Agregar entrada en la tabla de contenido:
- Nueva fila en la tabla de paginas
- Nueva fila en la tabla de fuentes
- Actualizar estadisticas (total paginas, fecha)

#### Paso 2.6 — Registrar en LOG.md
Agregar entrada con formato:
```
## [YYYY-MM-DD] ingest | [tipo] | [titulo fuente]
```

Si la fuente contradice o matiza conocimiento existente, documentarlo
en la entrada del log.

#### Paso 2.7 — Cross-refs a paginas relacionadas
Revisar las paginas existentes que se relacionan con la nueva fuente
y actualizar su seccion de "Fuentes" o agregar enlaces cruzados.

### FASE 3: Query — Responder desde el wiki

Se activa cuando el usuario pregunta algo que involucra conocimiento acumulado:
- "que sabes sobre [tema]"
- "busca en el wiki [consulta]"
- Cualquier pregunta que involucre decisiones, patrones o specs previas

#### Paso 3.1 — Buscar en MCP memory
1. `search_nodes` con la consulta del usuario
2. `open_nodes` para las entidades que matchearon

#### Paso 3.2 — Leer paginas wiki relevantes
Buscar en `wiki/` las paginas correspondientes usando INDEX.md
como guia. Leer las paginas relevantes.

#### Paso 3.3 — Sintetizar respuesta
Responder con:
1. Contexto encontrado (con citas a paginas wiki)
2. Relaciones entre entidades (del grafo MCP)
3. Si la respuesta es parcial o hay lagunas, mencionarlo

#### Paso 3.4 — Archivar respuesta valiosa (opcional)
Si durante la respuesta se descubre una conexion nueva o un analisis
que merezca persistirse:
1. Crear/actualizar la pagina wiki correspondiente
2. Actualizar MCP memory con nuevas observaciones/relaciones
3. Registrar en LOG.md

### FASE 4: Lint — Revision de salud del wiki

Se activa cuando:
- El usuario dice "lint wiki" o "revisa el wiki"
- Periodicamente en sesiones largas (>20 turnos)

#### Paso 4.1 — Analizar el grafo
1. `read_graph` para vision completa
2. Identificar:
   - Entidades sin relaciones (aisladas)
   - Entidades duplicadas (mismo concepto, nombres diferentes)

#### Paso 4.2 — Analizar las paginas
1. Leer INDEX.md y comparar con las paginas reales en wiki/
2. Identificar:
   - Paginas huerfanas (sin inbound links desde INDEX.md u otras paginas)
   - Paginas desactualizadas (updated muy antiguo vs. cambios en el repo)
   - Conceptos mencionados en paginas que no tienen pagina propia

#### Paso 4.3 — Detectar contradicciones
Leer paginas relacionadas entre si y detectar:
- Claims contradictorios entre dos paginas
- Info desactualizada que una fuente nueva haya superado

#### Paso 4.4 — Reportar y reparar
Presentar al usuario un resumen:
```
Hallazgos del lint:
- N paginas huerfanas
- N contradicciones detectadas
- N conceptos sin pagina
- N entidades sin relaciones

Acciones tomadas:
- [paginas fusionadas / eliminadas / creadas]
- [relaciones agregadas en MCP memory]
```

Reparar automaticamente lo que sea seguro (paginas huerfanas, relaciones
faltantes). Preguntar antes de fusionar o eliminar paginas.

---

## ACTIVACION AUTOMATICA EN PIPELINE

Este skill se activa automaticamente tras ciertas fases del pipeline
principal, sin necesidad de que el usuario lo solicite.

### Tras spec-engine (spec generada)
Al completar `spec-engine`, auto-ejecutar ingest de `specs/[app].md`:
- Crear pagina fuente en wiki/sources/
- Crear pagina de app en wiki/apps/
- Relacionar con skills y patrones usados en la spec
- La UI de la spec puede referenciar componentes de components/pines/

### Tras code-generator (codigo generado)
Al completar `code-generator`, auto-ejecutar ingest:
- Detectar que patrones se implementaron
- Actualizar pagina de patron en wiki/patterns/
- Actualizar pagina de app con patrones usados
- Si se descubrio un patron nuevo, crear pagina

### Tras validation-engine (validacion completada)
Al completar `validation-engine`, auto-ejecutar ingest:
- Actualizar pagina de app con resultados de validacion
- Registrar issues encontrados como observaciones en la entidad app
- Si un issue revela un patron problematica, crear pagina en wiki/patterns/

### Durante sesion normal
Permanecer atento a estos triggers del usuario:
- "guarda esto" / "recuerda que" — ingest inmediato
- "que sabes sobre [tema]" — query contra el wiki
- "documenta esta decision" — ingest de decision
- "lint wiki" — revision completa

---

## REFERENCIAS

Leer estos archivos para detalle de cada aspecto:

- `references/architecture.md` — Las 3 capas, operaciones, flujo de activacion
- `references/page-templates.md` — Tipos de pagina, frontmatter, convenciones de cross-ref
- `references/memory-graph.md` — Uso de cada tool del MCP memory server
- `assets/templates/INDEX.md` — Plantilla de indice central
- `assets/templates/ENTITY.md` — Plantilla de pagina de entidad
- `assets/templates/SOURCE.md` — Plantilla de pagina de fuente
- `assets/templates/LOG.md` — Plantilla de registro cronologico

---

## NOTAS PARA LA IA

- **Auto-guardado**: Siempre guarda las paginas en `wiki/` con frontmatter YAML
- **Nombres de archivo**: kebab-case: `mi-pagina.md`, no `mi_pagina.md`
- **Idioma**: Todo en espanol (frontmatter, contenido, comentarios)
- **MCP memory**: Usa `@modelcontextprotocol/server-memory` (configurado en
  opencode.json). Si no responde, verifica que el MCP este enabled.
- **No duplicar**: Antes de crear una entidad en MCP memory, busca si ya existe
  con `search_nodes`. Si existe, usa `add_observations` en vez de `create_entities`.
- **Cross-refs**: Al crear una pagina nueva, revisa las paginas existentes para
  ver si deberian enlazarla. No dejes huerfanos.
- **Si el wiki no existe**: Preguntar si quiere inicializarlo (Fase 1) antes
  de cualquier otra operacion.
- **Contexto limitado**: Si la respuesta se corta, prioriza las paginas mas
  relevantes y continua en el siguiente turno.

SKILL ready v1.0. Trigger: `guarda esto` para ingest inmediato.
