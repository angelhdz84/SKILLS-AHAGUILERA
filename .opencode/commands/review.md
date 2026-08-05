---
name: review
description: Revisa el codigo del diff git (o del turno actual) en 4 ejes con code-review-engine
trigger: review, revision, revisar, code review, repasar el codigo, revisar cambios, revisar diff
---

Ejecuta la skill code-review-engine en modo `/review`:

1. **Punto de referencia**: si el usuario pasó un commit/rama/tag (`main`, `HEAD~5`, SHA), úsalo. Si no, pregunta: "¿Contra qué punto reviso? (ej: main, HEAD~3, rama/feature)".
2. **Captura el diff**:
   - `git diff <punto>...HEAD` (tres puntos → merge-base)
   - `git log <punto>..HEAD --oneline`
   - Verifica `git rev-parse <punto>`; si no resuelve o el diff está vacío, avisa y para.
3. **Identifica la spec**: busca `specs/[app].md` (puede inferirse del nombre de módulos en el diff o de `project.config.js`). Si hay referencias de commit (ej: "fix #123"), úsalas.
4. **Lanza en paralelo** los dos subagentes con el diff:
   - `review-agent` → Ejes 1 (compliance) + 2 (calidad)
   - `spec-reviewer` → Ejes 3 (spec) + 4 (brand/UX)
5. **Presenta** ambos reportes lado a lado (secciones `## Eje 1+2` y `## Eje 3+4`). No los fusiones.
6. **Cierre**: una línea por eje con total de findings y el peor issue.

Si el usuario pidió revisar **solo el turno actual** (no git), ejecuta la skill en modo auto con los archivos del turno.

**Output ES.** Cada finding con `[BLOCK]`/`[WARN]`/`[FYI]` + `archivo:línea`. Veredicto global: BLOCK detiene, WARN se puede diferir, PASS se confirma.
