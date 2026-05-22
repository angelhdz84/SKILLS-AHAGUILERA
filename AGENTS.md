# SKILLS-AHAGUILERA — Instrucciones para OpenCode

## Stack offline-first (no negociable)

- ❌ `import`/`export`/`type="module"` — CORS en `file://` bloquea ES6 modules
- ❌ `fetch`/`axios`/CDNs en runtime — 100% offline, sin dependencias externas
- ❌ Build steps — la app se abre con doble clic en `index.html`
- ✅ Variables globales (`Alpine`, `Dexie`, `CryptoJS`) para reactividad
- ✅ `cryptoHelpers.encrypt()` en campos sensibles
- ✅ UI: DaisyUI + Bootstrap Icons + Animate.css
- ✅ Todo en español (UI, comentarios, docs)

## Pipeline orquestado (orden exacto)

`nuevo proyecto` → `iniciar setup` → `definir spec app` → `generar codigo` → `validar app`

- **PAUSA tras cada fase**. OpenCode pierde contexto >15k tokens. No generar todo de una vez.
- `prompt-inicial/SKILL.md` es el orquestador maestro. Los triggers se listan en metadata YAML de cada skill.
- `stack-compliance-guard` se auto-activa tras cada output de código. No requiere trigger.

## Estructura del repo

```
skill-name/SKILL.md            — cada skill es un archivo YAML+Markdown autónomo
project.config.js              — configuración white-label (app.nombre, modulosActivos, tema.colores)
components/pines/              — 35 componentes Alpine.js + Tailwind paste-able
tests/test_app.py              — Playwright E2E (channel="chrome", no descarga Chromium)
tests/test-app.html            — app de prueba Alpine.js para E2E
docs/                          — reportes de validación / screenshots (generados, excluir commits)
specs/                         — specs técnicas (generadas por spec-creator)
manual-referencia.html         — manual offline de referencia de skills
PLANTILLA DE CONTRATO FREELANCE.txt     — template de entrega a cliente
PLANTILLA DE CORREO DE ENTREGA PROFESIONAL.txt — template de entrega a cliente
```

## Comandos

```bash
# Test E2E (único comando verificable)
python tests/test_app.py

# Playwright usa Chrome del sistema — channel="chrome" obligatorio
# (Chromium descarga bloqueada por región)
```

## Convenciones

- **Versiones**: en `meta.version` del YAML de cada SKILL.md. Bump al modificar.
- **Auto-validación**: `stack-compliance-guard` chequea imports, CDNs, cifrado, UI, módulos, accesibilidad y privacidad. Corrige automático o pregunta si ambiguo.
- **design-ux-intelligence**: activada por spec-creator cuando el usuario menciona "tono visual" o "diseño". No genera código, solo valida/sugiere.
- **code-generator**: un módulo por turno. Pausa tras cada uno. Lee `libreriasAdicionales` de la spec.
- **validation-offline**: pregunta primero si tiene Python/Playwright. Si no, salta Fase 3.6 (automatizada) y solo da comandos DevTools manuales.
- **Push requiere confirmación explícita** — solo hacer commit, no push sin pedir.
- **MCPs**: 8 servidores en opencode.json (context7, excalidraw, chrome-devtools, canva, filesystem, refero-styles, a11y, web-search)

## Archivos generados (no versionar)

- `docs/validacion-[app].md`, `docs/test_results.json`, `docs/screenshot_test.png`
- `skills.rar`
