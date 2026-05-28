# Uso del MCP Memory Server

El servidor `@modelcontextprotocol/server-memory` (instalado en opencode.json)
proporciona un grafo de conocimiento persistente. Este documento describe
como y cuando usar cada tool en el contexto del LLM Wiki.

## Tools disponibles

### create_entities
**Cuando:** Durante un ingest, cuando aparecen nuevas entidades (conceptos,
skills, patrones, apps) que aun no existen en el grafo.

**Reglas:**
- Cada entidad debe tener un `name` unico y descriptivo
- Usa kebab-case para los nombres: `offline-first-pattern`
- `entityType` debe ser uno de: `concept`, `skill`, `pattern`, `app`, `decision`, `source`
- `observations` son hechos atomicos, una idea por string

### create_relations
**Cuando:** Siempre que crees una entidad nueva y esta se relacione con
entidades existentes. Tambien cuando descubras nuevas relaciones entre
entidades ya creadas.

**Reglas:**
- Usa voz activa: `implements`, `depends-on`, `contradicts`, `inspired-by`
- `from` y `to` deben existir en el grafo (crea las entidades primero)
- Relaciones comunes en este proyecto:

| Relacion | Significado |
|----------|-------------|
| `depends-on` | A depende de B |
| `implements` | A implementa el patron B |
| `inspired-by` | A esta inspirado por B |
| `contradicts` | A contradice a B |
| `refines` | A refina/especifica mejor a B |
| `related-to` | A se relaciona con B (relacion debil) |

### add_observations
**Cuando:** Cuando aprendes nuevos datos sobre una entidad existente.
Por ejemplo, durante un ingest de una spec que menciona un skill ya conocido.

**Regla:** La entidad DEBE existir. Si no existe, creala primero con
create_entities.

### search_nodes
**Cuando:** Antes de responder cualquier query. Busca contexto relevante
en el grafo. Es el paso inicial de toda operacion Query.

**Uso:** Pasa un `query` textual. Busca en nombres de entidad, tipos y
observaciones. Usa terminos clave del dominio.

### open_nodes
**Cuando:** Despues de search_nodes, para obtener detalle completo de
entidades especificas que matcharon.

**Uso:** Pasa un array de `names` con los nombres exactos de entidades
que quieres inspeccionar.

### read_graph
**Cuando:** Durante un lint, para obtener una vision completa del grafo
y detectar huerfanos, entidades sin relaciones, etc.

**Precaucion:** En wikis grandes (>50 entidades), prefiere search_nodes
para evitar saturar el contexto.

### delete_entities / delete_observations / delete_relations
**Cuando:** Durante lint, si detectas entidades duplicadas, observaciones
incorrectas o relaciones erroneas.

## Mapeo entidad-tipo

| Entidad en el mundo real | entityType en el grafo | Observaciones tipicas |
|--------------------------|------------------------|----------------------|
| Una skill (spec-creator) | `skill` | Proposito, lenguaje, version, stack |
| Un patron (hash-router) | `pattern` | Descripcion, ventajas, limitaciones |
| Una app (clinica-dental) | `app` | Fecha creacion, modulos, stack |
| Una decision (ADR-001) | `decision` | Contexto, opcion elegida, trade-offs |
| Una fuente (spec .md) | `source` | Tipo, fecha ingest, resumen |
| Un concepto (offline-first) | `concept` | Definicion, principios, ambito |

## Flujo tipico en un ingest

```
1. create_entities  →  crea la entidad "source" para la fuente nueva
2. search_nodes     →  busca entidades relacionadas en el grafo existente
3. create_relations →  conecta la fuente con entidades existentes
4. add_observations →  agrega observaciones atomicas a entidades afectadas
```

## Flujo tipico en una query

```
1. search_nodes     →  busca entidades relevantes al query
2. open_nodes       →  abre detalle de las entidades que matcharon
3. (usa la info para leer paginas wiki relevantes)
4. (opcional: add_observations si la respuesta revela nueva info)
```

## Flujo tipico en un lint

```
1. read_graph       →  vision completa del grafo
2. search_nodes     →  busca patrones sospechosos
3. delete_*         →  limpia duplicados o errores
4. create_relations →  agrega relaciones faltantes
```
