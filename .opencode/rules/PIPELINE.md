# Pipeline orquestado (orden exacto)

`nuevo proyecto` → `iniciar setup` → `generar spec + brand` → `aplicar diseño` → `generar codigo` → `validar + auditar marca` → `publicar`

- **PAUSA tras cada fase**. OpenCode pierde contexto >15k tokens. No generar todo de una vez.
- `pipeline-engine/SKILL.md` es el orquestador maestro. Soporta dos modos: Classic (5 fases, /new) y Design (10 fases, /pro).
- `stack-compliance-guard` se auto-activa tras cada output de código. No requiere trigger.
- **Push requiere confirmación explícita** — solo hacer commit, no push sin pedir.
- **Perfil (lite/full)** se define en `project.config.js` y determina setup, templates y empaquetado.
- **IA Jutia (lite/full/no)** es opcional, definida en `project.config.js`.

## Contratos entre Skills

| Emisor | Receptor(es) | Artefacto |
|--------|-------------|-----------|
| pipeline-engine | setup-init, spec-engine | Nombre + tipo + descripción + perfil + modo (classic/design) |
| setup-init | code-generator | Estructura + librerías según perfil (curl o bun add) |
| spec-engine | design-engine, code-generator, wiki-engine | `specs/[app].md` (con modelo datos + journeys + testing) + `specs/DESIGN.md` (brand layer) |
| design-engine | code-generator | Preferencias de diseño en `.omd/preferences.md` (tokens, paleta, tipografía) |
| code-generator | stack-compliance-guard, validation-engine, wiki-engine, design-engine (retroalimentación) | `modules/*`, `core/*`, `index.html` (+ src/ en Full) |
| stack-compliance-guard | code-generator | Validación automática post-generación (con checks de perfil) |
| validation-engine | wiki-engine | `docs/validacion-[app].md` + brand audit + QA rubric |
| deployment-jigue | — | Commit + Push + Pages + ZIP (Lite) / .exe + Release (Full) |
| wiki-engine | — | `wiki/` + `.omd/preferences.md` + MCP memory graph |

## Archivos generados (no versionar)

- `docs/validacion-[app].md`, `docs/test_results.json`, `docs/screenshot_test.png`
- `dist/[app].zip` (Lite) o `dist/[app].exe` (Full)
- `.omd/preferences.md` (preferencias de diseño persistentes)
- `skills.rar`
