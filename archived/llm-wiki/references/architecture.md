# Arquitectura del LLM Wiki

Este documento describe las 3 capas del patron LLM Wiki de Karpathy
adaptadas al stack offline-first de SKILLS-AHAGUILERA.

## Las 3 capas

```
+----------------------------------------------------------+
|                     CAPA 3: SCHEMA                        |
|  AGENTS.md - instrucciones que orquestan al LLM          |
|  Define: cuando ingest, cuando query, formato paginas    |
+----------------------------------------------------------+
                          |
                          v
+----------------------------------------------------------+
|                     CAPA 2: WIKI                          |
|  wiki/ — Paginas markdown generadas y mantenidas por LLM |
|  INDEX.md (indice), LOG.md (cronologico), paginas entidad |
|  Versionado en git, legible por humanos, navegable        |
|  Backend dual: markdown (lectura) + MCP memory (busqueda) |
+----------------------------------------------------------+
                          ^
                          |
+----------------------------------------------------------+
|                     CAPA 1: RAW SOURCES                   |
|  Inmutables — el LLM lee de aqui pero nunca modifica     |
|  Fuentes tipicas en este repo:                            |
|    - specs/[app].md (generadas por spec-creator)          |
|    - skills/*/SKILL.md (skills del repositorio)           |
|    - conversaciones con el usuario                        |
|    - componentes/ (patrones de UI)                        |
|    - tests/ (resultados de validacion)                    |
|    - docs/ (reportes generados)                           |
+----------------------------------------------------------+
```

## Las 3 operaciones

### Ingest
Una fuente nueva llega (spec, conversacion, skill, decision).
El LLM:
1. Lee la fuente
2. Discute hallazgos clave con el usuario
3. Crea/actualiza pagina(s) en wiki/
4. Actualiza INDEX.md
5. Agrega entrada a LOG.md
6. Crea entidades y relaciones en MCP memory
7. Revisa paginas relacionadas y actualiza cross-refs

### Query
El usuario pregunta algo que involucra conocimiento acumulado.
El LLM:
1. Busca en MCP memory (search_nodes) contexto relevante
2. Lee paginas wiki pertinentes
3. Sintetiza respuesta con citas a paginas wiki
4. Si la respuesta aporta valor nuevo, la archiva como pagina wiki

### Lint
Revision periodica de salud del wiki.
El LLM:
1. Busca paginas huerfanas (sin inbound links desde INDEX.md u otras paginas)
2. Detecta contradicciones entre paginas
3. Identifica conceptos mencionados sin pagina propia
4. Sugiere nuevas fuentes a buscar
5. Actualiza frontmatter (fechas, tags, relaciones)

## Estrategia dual: markdown + MCP memory

| Aspecto | wiki/*.md | MCP memory (@modelcontextprotocol/server-memory) |
|---------|-----------|--------------------------------------------------|
| Proposito | Lectura humana durable | Busqueda rapida del LLM |
| Persistencia | Git (versionado) | Archivo JSONL local |
| Estructura | Paginas markdown con frontmatter | Grafo de entidades + relaciones |
| Cross-refs | Enlaces markdown `[link](page.md)` | Relaciones tipadas entre entidades |
| Busqueda | INDEX.md + grep | search_nodes / open_nodes |
| Cuando usarlo | Respuestas largas, documentacion, revision humana | Antes de cada respuesta, recuperar contexto rapido |

## Flujo de activacion automatica

Este skill se activa automaticamente al completar fases del pipeline:

```
spec-creator (spec generada)
    ↓ [auto-ingest]
    llama a llm-wiki: ingest de specs/[app].md
    Crea pagina de app, actualiza INDEX.md, registra en LOG.md

code-generator (codigo generado)
    ↓ [auto-ingest]
    llama a llm-wiki: ingest de patron usado
    Crea/actualiza pagina de patron/arquitectura

validation-offline (validacion completada)
    ↓ [auto-ingest]
    llama a llm-wiki: ingest de hallazgos
    Actualiza pagina de app con resultados de validacion

/usuario/ (decision o conocimiento nuevo)
    ↓ [trigger directo]
    "guarda esto", "recuerda que...", "documenta esta decision"
    Crea pagina de decision, relaciona con entidades existentes
```
