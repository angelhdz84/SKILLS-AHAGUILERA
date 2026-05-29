# Pipeline orquestado (orden exacto)

`nuevo proyecto` → `iniciar setup` → `definir spec app` → `generar codigo` → `validar app`

- **PAUSA tras cada fase**. OpenCode pierde contexto >15k tokens. No generar todo de una vez.
- `prompt-inicial/SKILL.md` es el orquestador maestro. Los triggers se listan en metadata YAML de cada skill.
- `stack-compliance-guard` se auto-activa tras cada output de código. No requiere trigger.
- **Push requiere confirmación explícita** — solo hacer commit, no push sin pedir.

## Contratos entre Skills

| Skill Output | Skill Input | Artifact |
|---|---|---|
| prompt-inicial | setup-init, spec-creator | Nombre + tipo + descripción app |
| setup-init | code-generator | Estructura de proyecto + librerías |
| spec-creator | code-generator, design-ux, llm-wiki | `specs/[app].md` → llm-wiki ingesta automática |
| design-ux-intelligence | code-generator, ux-refactor | Tono visual + paleta + estilo + tipografía |
| code-generator | compliance, validation, llm-wiki, ux-refactor | `modules/*`, `core/*`, `index.html` → llm-wiki registra patrones |
| stack-compliance-guard | code-generator | Validación automática post-generación |
| validation-offline | llm-wiki | `docs/validacion-[app].md` → llm-wiki actualiza app |
| llm-wiki | — | `wiki/` (páginas markdown) + MCP memory (grafo persistente) |

## Archivos generados (no versionar)

- `docs/validacion-[app].md`, `docs/test_results.json`, `docs/screenshot_test.png`
- `skills.rar`
