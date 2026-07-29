# Integración de Engram + OpenPencil al Pipeline Ateje

## Engram (Memoria Persistente)
Engram es un MCP server local que proporciona memoria persistente SQLite/FTS5 cross-sesión. Se integra al pipeline como:
- **wiki-engine**: Engram como backend de memoria (opcional)
- **Almacenamiento**: decisiones de diseño, bugs, descubrimientos
- **Setup**: `scripts/setup-engram.ps1` descarga el binary y configura el MCP

## OpenPencil (Diseño Visual)
OpenPencil es un editor de diseño/FigJam que permite:
- **design-engine**: Extracción de tokens de diseño, análisis de componentes
- **Captura de preferencias visuales** persistentes
- **Decision tree** de `component_library`
- **Setup**: `npm install -g @open-pencil/cli @open-pencil/mcp` + Desktop App
- **Setup script**: `scripts/setup-opencil.ps1`

## Integración en el Pipeline
```
pipeline-engine → spec-engine → design-engine (usa OpenPencil) → code-generator → validation-engine
                                                                     ↑
                                                            wiki-engine (usa Engram opcionalmente)
```

Ambos MCPs están configurados en `~/.config/opencode/opencode.json` (global) y son opt-in: si la herramienta no está instalada, OpenCode los ignora silenciosamente.
