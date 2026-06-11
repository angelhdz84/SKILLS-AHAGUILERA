# Pipeline orquestado (orden exacto)

`nuevo proyecto` → `iniciar setup` → `definir spec app` → `generar codigo` → `validar app` → `publicar`

- **PAUSA tras cada fase**. OpenCode pierde contexto >15k tokens. No generar todo de una vez.
- `prompt-inicial/SKILL.md` es el orquestador maestro. Los triggers se listan en metadata YAML de cada skill.
- `stack-compliance-guard` se auto-activa tras cada output de código. No requiere trigger.
- **Push requiere confirmación explícita** — solo hacer commit, no push sin pedir.
- **Perfil (lite/full)** se define en `project.config.js` y determina setup, templates y empaquetado.
- **IA Jutia (lite/full/no)** es opcional, definida en `project.config.js`.

## Contratos entre Skills

| Skill Output | Skill Input | Artifact |
|---|---|---|
| prompt-inicial | setup-init, spec-creator | Nombre + tipo + descripción + perfil (lite/full) |
| setup-init | code-generator | Estructura + librerías según perfil (curl o bun add) |
| spec-creator | code-generator, design-ux, llm-wiki | `specs/[app].md` v4 con modelo datos + journeys + testing |
| design-ux-intelligence | code-generator, ux-refactor | Tono visual + paleta + estilo + tipografía |
| code-generator | compliance, validation, llm-wiki, ux-refactor, ia-jutia | `modules/*`, `core/*`, `index.html` (+ src/ en Full) |
| stack-compliance-guard | code-generator | Validación automática post-generación (con checks de perfil) |
| ia-jutia | code-generator, setup-init | `modules/ia-jutia/` + `core/ia.js` según perfil Lite/Full |
| validation-offline | llm-wiki | `docs/validacion-[app].md` → llm-wiki actualiza app |
| deployment-jigue | — | Commit + Push + Pages + ZIP (Lite) / .exe + Release (Full) |
| llm-wiki | — | `wiki/` (páginas markdown) + MCP memory (grafo persistente) |

## Archivos generados (no versionar)

- `docs/validacion-[app].md`, `docs/test_results.json`, `docs/screenshot_test.png`
- `dist/[app].zip` (Lite) o `dist/[app].exe` (Full)
- `skills.rar`
