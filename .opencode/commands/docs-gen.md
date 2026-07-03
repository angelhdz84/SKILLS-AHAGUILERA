---
name: /docs-gen
---

# /docs-gen

Genera `docs/API.md` escaneando módulos del proyecto para extraer funciones, parámetros y dependencias.

**Uso:** `/docs-gen` en la raíz del proyecto.

**Flags:**

| Flag | Descripción |
|------|-------------|
| `--watch` | Ve el directorio de módulos y regenera automáticamente al detectar cambios |
| `--dir [ruta]` | Escanea un directorio específico en lugar del directorio `modules/` por defecto |

**Script:** `scripts/generate-docs.js`

**Ejemplo:**
```
/docs-gen
→ Escaneando módulos...
→ docs/API.md generado (42 funciones documentadas)

/docs-gen --dir src/modules
→ Escaneando src/modules...
→ docs/API.md generado (18 funciones documentadas)
```
