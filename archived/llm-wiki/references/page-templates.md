# Plantillas de pagina y convenciones

## Tipos de pagina

| Tipo | Descripcion | Ubicacion |
|------|-------------|-----------|
| `concept` | Concepto o idea abstracta | wiki/concepts/ |
| `skill` | Una skill del repositorio | wiki/skills/ |
| `pattern` | Patron de diseno o arquitectura | wiki/patterns/ |
| `app` | Una app generada por code-generator | wiki/apps/ |
| `decision` | Decision arquitectonica o de diseno | wiki/decisions/ |
| `source` | Fuente ingested (spec, articulo, etc.) | wiki/sources/ |

## Estructura de directorios

```
wiki/
├── INDEX.md           ← Indice central
├── LOG.md             ← Registro cronologico
├── concepts/          ← Paginas de concepto
│   ├── offline-first.md
│   └── memory-graph.md
├── skills/            ← Paginas sobre skills del repo
│   ├── spec-creator.md
│   └── code-generator.md
├── patterns/          ← Patrones y arquitecturas
│   ├── hash-router.md
│   └── module-system.md
├── apps/              ← Apps generadas
│   └── clinica-dental.md
├── decisions/         ← Decisiones registradas
│   └── ADR-001-sync-strategy.md
└── sources/           ← Fuentes ingested
    ├── spec-clinica-dental.md
    └── conversation-2026-05-28.md
```

## Frontmatter YAML obligatorio

Toda pagina wiki DEBE tener frontmatter YAML con estos campos minimos:

```yaml
---
type: concept | skill | pattern | app | decision | source
tags: [tag1, tag2]
related: [related-page-1, related-page-2]   # Omitir si no aplica
sources: [source-page-1]                     # Solo si la pagina deriva de fuentes
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Reglas del frontmatter

- `type` es obligatorio y DEBE ser uno de los valores listados
- `created` es la fecha de creacion de la pagina, no se modifica
- `updated` se actualiza cada vez que la pagina se modifica
- `related` incluye solo paginas que existen en el wiki
- `sources` referencia paginas en wiki/sources/ (no rutas absolutas)

## Convenciones de cross-referencing

Usa enlaces markdown relativos:

```markdown
Como se explica en [offline-first](../concepts/offline-first.md),
este patron sigue el mismo enfoque.
```

No uses `[[wiki-links]]` de Obsidian — manten compatibilidad con markdown plano.

## Nombrado de archivos

- kebab-case: `mi-pagina.md`, no `MiPagina.md` ni `mi_pagina.md`
- Una idea por pagina: si un concepto necesita muchas secciones, dividelo
- Maximo 300 lineas por pagina. Si se acerca al limite, divide en sub-paginas

## Ciclo de vida de una pagina

1. **Creacion**: LLM crea pagina con frontmatter completo
2. **Actualizacion**: LLM modifica pagina (nuevas fuentes, nuevos hallazgos)
3. **Enriquecimiento**: LLM agrega cross-refs cuando se crean paginas relacionadas
4. **Archivo**: Si una pagina queda obsoleta, se marca `status: archived` en frontmatter
   en vez de eliminarse. Asi se preserva el historial sin polucionar el indice.
