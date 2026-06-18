---
name: validation-engine
description: Valida que la app offline-first cumple con AGENTS.md, specs y reglas del stack. Reemplaza validation-offline + ux-refactor + omd:designer-review + omd:final-qa. 4 fases: compliance estático → brand audit → DevTools/Playwright → QA rubric. Incluye modo refactor para auto-corrección de desviaciones.
license: MIT
compatibility: Requiere specs/[app].md + archivos generados por code-generator. Funciona con Playwright + pytest + DevTools.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, full]
  triggers: ["validar app", "/test", "/validate", "/refactor", "ui review", "diseno revision", "final qa", "rubric"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  requires: [code-generator, design-engine, stack-compliance-guard]
---

# validation-engine — Validación 4 Fases + Refactor

> **Propósito**: Garantizar que la app generada cumple simultáneamente con las reglas del stack offline-first, la identidad de marca (DESIGN.md), y los estándares de calidad QA.
> **Idioma**: ES | **Output**: `docs/validacion-[app].md`

---

## Fases

### Fase 1 — Stack Compliance (delega a stack-compliance-guard)

Verificar automáticamente tras cada output de código:

- ❌ Sin `import`/`export`/`type="module"` (Lite)
- ❌ Sin CDNs en runtime (Lite: todo en `assets/`)
- ❌ Sin `fetch`/`axios`
- ✅ CryptoJS presente para campos sensibles
- ✅ Variables globales (`Dexie`, `CryptoJS`, `Alpine`)
- ✅ Librerías adicionales en `assets/js/libs/` (Lite) o `package.json` (Full)

Si hay violaciones → BLOCK. No mostrar código hasta corregir.

### Fase 2 — Brand Audit (hereda de omd:designer-review)

Comparar la UI generada contra DESIGN.md (o `specs/[app].md` secciones 10-15):

| Categoría | Qué verifica | Severidad |
|-----------|-------------|-----------|
| **Typography hierarchy** | h1/h2/h3 sizes, weights, line-height | WARN si salta niveles, BLOCK si fuente incorrecta |
| **Color budget** | Máx 2 colores saturados por viewport | WARN >2, BLOCK >4 |
| **Radius scale** | border-radius contra tokens definidos | WARN si valor fuera de escala |
| **Component states** | default + hover + focus + active + disabled | BLOCK si falta focus (a11y) |
| **Mobile responsive** | Mín 44x44 hit area, sin scroll horizontal | BLOCK si falla |
| **Spacing consistency** | padding/margin contra tokens | WARN si valores inconsistentes |
| **Voice register** | Microcopy contra voz de marca | WARN si fuera de tono |

**Output**: lista de issues con severity + ubicación + sugerencia de fix.

### Fase 3 — Technical QA

- **Consola DevTools**: 0 errors, 0 warnings.
- **Lighthouse**: accessibility score ≥ 90.
- **Playwright E2E**: tests automatizados (si existen en `tests/`).
- **Perfil Full**: verificar que Bun compila correctamente.
- **Perfil Lite**: verificar que `index.html` abre sin errores en file://.

### Fase 4 — QA Rubric (hereda de omd:final-qa)

8 items. Cada uno: PASS / FAIL (no grises). 1 FAIL = REVISION (round 1) o BLOCK (round 2).

| # | Item | Qué verifica |
|---|------|-------------|
| 1 | Brand consistency | Tokens de DESIGN.md usados correctamente |
| 2 | Typography hierarchy | H1→H2→H3 sin saltos, pesos consistentes |
| 3 | Voice register | Microcopy coherente con voz de marca |
| 4 | Images/figures | Alt text presente, captions, src válidos |
| 5 | Accessibility | Contraste AA, focus states, HTML semántico |
| 6 | Performance | Imágenes optimizadas, font-display: swap |
| 7 | Links | Sin broken links, rel="noopener" en externos |
| 8 | Offline compliance | Stack compliance + sin dependencias externas |

**Anti-patterns**:
- ❌ "looks good" / "está bien" — banned. Cada PASS requiere evidencia.
- ❌ Evidence sin line ref — cada FAIL requiere ubicación exacta.
- ❌ Saltar DESIGN.md re-read — releer cada vez (no cachear).

---

## Modo Refactor

Cuando se detectan desviaciones de DESIGN.md o violaciones de compliance, `validation-engine` puede auto-corregir in-place:

1. Identificar la desviación (Fase 2 o Fase 4)
2. Ofrecer corrección al usuario: "Se detectó [problema] en [archivo:línea]. ¿Corrijo automáticamente?"
3. Si usuario acepta → aplicar fix
4. Re-ejecutar validación
5. Mostrar diff

**No corregir sin preguntar** — esto reemplaza la fase `ux-refactor` completa.

---

## Output

```markdown
# Validación: [app]

## Fase 1 — Stack Compliance
✅ Sin imports ES6
✅ Sin CDNs en runtime
✅ CryptoJS presente
...

## Fase 2 — Brand Audit
✅ Typography hierarchy: OK
⚠️ Color budget: 3 saturados en hero (WARN)
...

## Fase 3 — Technical QA
✅ Consola: 0 errors
✅ Lighthouse a11y: 94
...

## Fase 4 — QA Rubric
| # | Item | Verdict |
|---|------|---------|
| 1 | Brand consistency | PASS |
| 2 | Typography | PASS |
| 3 | Voice | FAIL |
...

## Score: 87/100
## Issues: 2 WARN, 1 FAIL

## Refactor aplicado (si aplica)
- [file:line] color budget → corregido
```

---

## Reglas

- Ejecutar siempre tras `code-generator`, en cada módulo.
- No mostrar código que falla compliance hasta corregir.
- Los 8 items de la rubric son fijos (no añadir/eliminar).
- Máximo 2 rondas de revision por ciclo de validación.
