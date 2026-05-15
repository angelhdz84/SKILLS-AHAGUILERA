---
name: validation-offline
description: Valida que la app offline-first cumple estrictamente con @AGENTS.md, specs y reglas del stack. Verificación estática + guía DevTools + tests automatizados con Playwright + reporte técnico en docs/validacion-[app].md.
license: MIT
compatibility: Requiere @AGENTS.md, @project.config.js y specs/[app].md presentes. Playwright opcional (Python). Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.3"
  generatedBy: "validation-offline skill"
  triggers: ["validar app", "verificar spec", "validar stack", "chequeo calidad", "reporte validación", "test automatizado", "playwright", "e2e"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  outputPath: "docs/"
  reportFormat: "markdown"
---

# 🛡️ SKILL: validation-offline v2 (Validación Integral + Testing Automatizado)

> **Propósito**: Verificar que la app generada cumple estrictamente con `@AGENTS.md`, `@specs/[app].md` y las reglas del stack offline-first. Incluye análisis estático, guía DevTools interactiva Y tests automatizados con Playwright (sin servidor, vía `file://`).
> **Modo**: Diagnóstico + Automatización | **Idioma**: ES | **Contexto**: Requiere `@AGENTS.md`, `@project.config.js`, `@specs/[app].md`
> **Output**: Reporte en `docs/validacion-[app].md` + script `tests/test_[app].py`

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Verificación de Prerequisitos
1. Comprueba existencia de:
   - `index.html`, `project.config.js`, `AGENTS.md`
   - `specs/[nombre-app].md` (si no existe, activa `spec-creator`)
   - Carpetas: `core/`, `modules/`, `assets/`, `docs/`
2. Si falta algo: `⚠️ Ejecuta primero: setup → definir spec app → generar código`
3. Si todo existe: `✅ Contexto cargado. Iniciando validación.`

### 🟡 FASE 2: Análisis Estático del Código
Ejecuta estas comprobaciones sobre los archivos generados:
```
[▓▓░░░░░░░░░░░░░░] 25% • Análisis Estático
🔍 Verificando reglas críticas...
- [ ] ❌ `import` / `export` / `type="module"` → PROHIBIDO
- [ ] ❌ `<link href="http` / `<script src="http` → PROHIBIDO (solo `assets/`)
- [ ] ❌ `fetch(` / `axios.` / `XMLHttpRequest` → PROHIBIDO
- [ ] ✅ Variables globales usadas: `Dexie`, `CryptoJS`, `Alpine`, `UI`, `db`, `cryptoHelpers`
- [ ] ✅ Orden de carga en `index.html`: CSS → Libs base → Libs adicionales → Core → Main
- [ ] ✅ Librerías adicionales en `assets/js/libs/` (sin CDNs)
- [ ] ✅ `project.config.js` tiene `modulosActivos`, `tema.colores`, `app.nombre`
- [ ] ✅ Módulos registrados en `window.MODULES` con `id`, `init`, `render`, `destroy`
- [ ] ✅ Campos sensibles cifrados antes de `db.put()` y descifrados en UI
- [ ] ✅ `aria-label` en botones con solo icono (`<i>` sin texto)
- [ ] ✅ `@media (prefers-reduced-motion: reduce)` en CSS
- [ ] ✅ Inputs tienen `<label for="...">` visible (no solo placeholder)
- [ ] ✅ Indicador de estado online/offline en UI (badge o barra)
- [ ] ✅ Datos mínimos recolectados (no pedir info innecesaria)
```
- Si falla: marca `❌ FAIL` + línea exacta + snippet de corrección.
- Si pasa: marca `✅ PASS`.

### 🔵 FASE 3: Guía de Validación Dinámica (DevTools)
Como OpenCode no ejecuta navegadores, **entrega estos comandos listos para pegar en `F12 > Console`**. Pide al usuario que los ejecute uno a uno y responda `✅` o `❌ [mensaje]`.

```
[▓▓▓▓▓░░░░░░░░░░░] 50% • Validación Dinámica
🖥️ Abre index.html con doble clic → F12 → Console. Ejuta:

1️⃣  Librerías cargadas:
`[typeof Dexie, typeof CryptoJS, typeof Alpine, typeof XLSX].join(" | ")`
→ Esperado: "function | object | object | object"

2️⃣  IndexedDB & Cifrado:
`db.open().then(() => cryptoHelpers.encrypt("test")).then(c => console.log("DB + Crypto:", c.startsWith("U2FsdGVkX1") ? "✅ OK" : "❌ FAIL"))`

3️⃣  Theme Toggle:
`$store.theme.toggle(); console.log(document.documentElement.classList.contains("dark") ? "✅ Modo Oscuro" : "✅ Modo Claro")`

4️⃣  Router Hash:
`location.hash = "#/dashboard"; setTimeout(() => console.log(document.getElementById("app-content")?.innerHTML.includes("animate__") ? "✅ Render OK" : "❌ Render FAIL"), 300)`

5️⃣  Exportación (si aplica):
`UI.toast("Test", "info"); console.log("✅ UI System OK")`

📝 Responde con: "1✅ 2✅ 3✅ 4❌ error... 5✅"
```

### 🟠 FASE 3.5: Validación de Diseño/UX (Automática con design-ux-intelligence)
```
[▓▓▓▓▓▓▓░░░░░░░░░] 70% • Validación de Diseño/UX
🎨 Verificando checklist UX crítico...

✅ Contraste WCAG AA: [PASS/FAIL] → [ratio actual si FAIL]
✅ Touch targets ≥44px: [PASS/FAIL] → [elementos afectados si FAIL]
✅ Focus rings visibles: [PASS/FAIL]
✅ Empty states con CTA: [PASS/FAIL]
✅ Animaciones con propósito: [PASS/FAIL] → [lista si decorativas]
✅ Screen reader labels: [PASS/FAIL] → [botones sin aria-label si FAIL]
✅ Keyboard navigation: [PASS/FAIL] → [elementos no focusables si FAIL]
✅ Offline indicators: [PASS/FAIL] → [falta UI de estado offline si FAIL]

📝 Si hay FAILs: Responde "corregir UX [números]" para parchear automáticamente.
```

### 🔴 FASE 3.6: Testing Automatizado con Playwright (NUEVO v2)
```
[▓▓▓▓▓▓▓▓░░░░░░░░░] 80% • Testing Automatizado
🎭 Generando script Playwright para tests E2E sin servidor (file://)
```

La app offline-first se abre con doble clic (protocolo `file://`), **no necesita servidor**. Playwright puede navegar directamente al archivo HTML. Esto permite automatizar completamente la validación dinámica.

#### Paso 1: Generar script de test

Crea `tests/test_[app].py` con el siguiente esquema usando los datos reales de la app:

```python
from playwright.sync_api import sync_playwright
import json, os

APP_PATH = os.path.abspath("index.html")
REPORT = {"pass": [], "fail": []}

def test(description, condition, detail=""):
    if condition:
        REPORT["pass"].append(f"✅ {description}")
        print(f"  ✅ {description}")
    else:
        REPORT["fail"].append(f"❌ {description}: {detail}")
        print(f"  ❌ {description}: {detail}")

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page()
    page.goto(f"file://{APP_PATH}")
    page.wait_for_load_state("networkidle")

    # 1. Consola sin errores JS
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.wait_for_timeout(1000)
    test("Sin errores en consola JS", len(console_errors) == 0, str(console_errors))

    # 2. Librerías globales cargadas
    libs = page.evaluate("""() => ({
        Dexie: typeof Dexie === 'function',
        CryptoJS: typeof CryptoJS === 'object',
        Alpine: typeof Alpine === 'object',
        UI: typeof UI === 'object'
    })""")
    for lib, loaded in libs.items():
        test(f"Librería {lib} cargada", loaded)

    # 3. Módulos registrados (del project.config.js)
    modulos = page.evaluate("""() => {
        try {
            return (window.MODULES || []).map(m => m.id);
        } catch(e) { return []; }
    }""")
    for mod_id in ["dashboard", "configuracion"]:  # ← obtener de project.config.js
        test(f"Módulo '{mod_id}' registrado", mod_id in modulos)

    # 4. Router navega a cada módulo sin error
    for mod_id in modulos:
        try:
            page.evaluate(f"location.hash = '#/{mod_id}'")
            page.wait_for_timeout(300)
            content = page.evaluate("document.getElementById('app-content')?.innerHTML || ''")
            test(f"Ruta '#/{mod_id}' renderiza", len(content) > 50)
        except Exception as e:
            test(f"Ruta '#/{mod_id}' renderiza", False, str(e))

    # 5. IndexedDB abierta (verifica que db existe)
    db_ok = page.evaluate("""async () => {
        try {
            await window.db.open();
            return true;
        } catch(e) { return false; }
    }""")
    test("IndexedDB accesible sin errores", db_ok)

    # 6. Tema oscuro/claro toggle funciona
    theme_toggle = page.evaluate("""() => {
        if (!window.$store?.theme) return 'no-store';
        const before = document.documentElement.classList.contains('dark');
        window.$store.theme.toggle();
        const after = document.documentElement.classList.contains('dark');
        return before !== after ? 'ok' : 'no-change';
    }""")
    test("Theme toggle cambia modo oscuro/claro", theme_toggle == 'ok', theme_toggle)

    # 7. Elementos UI clave presentes
    ui_elements = page.evaluate("""() => ({
        sidebar: !!document.querySelector('[data-sidebar], .drawer, aside'),
        topbar: !!document.querySelector('[data-topbar], header, nav.navbar'),
        content: !!document.getElementById('app-content')
    })""")
    for el, present in ui_elements.items():
        test(f"Elemento UI '{el}' presente en DOM", present)

    # 8. Screenshot para revisión visual
    page.screenshot(path="docs/screenshot_test.png", full_page=True)
    test("Screenshot capturado en docs/screenshot_test.png", True)

    browser.close()

# Reporte resumen
print(f"\n{'='*40}")
print(f"RESULTADOS: {len(REPORT['pass'])} ✅ | {len(REPORT['fail'])} ❌")
print(f"{'='*40}")
with open("docs/test_results.json", "w") as f:
    json.dump(REPORT, f, indent=2)
```

#### Paso 2: Instrucciones para el usuario

```
📋 Para ejecutar el test automatizado:

1. Instala Playwright (solo primera vez):
   pip install playwright

2. Ejecuta el script (usa Chrome del sistema, no descarga nada):
   python tests/test_[app].py

3. Revisa resultados en consola y en:
   - docs/test_results.json  (reporte estructurado)
   - docs/screenshot_test.png  (captura visual)

4. Responde con los resultados para integrarlos al reporte final.
```

#### Paso 3: Integrar resultados al reporte

Cuando el usuario ejecute y responda, parsea `docs/test_results.json`:

```
📥 Resultados recibidos:
  ✅ 8/10 tests pasaron
  ❌ 2 fallos: 'Módulo "reportes" registrado', 'Ruta "#/reportes" renderiza'
```

Los FAILs se agregan automáticamente a la sección de correcciones del reporte final.

#### Paso 4 — Checks avanzados (a11y + offline + flaky prevention)

Añade estos bloques al script `test_[app].py` generado, entre los checks existentes:

```python
# === CHECKS AVANZADOS ===

# 9. Accesibilidad: elementos clave tienen aria-label
def check_a11y(page):
    issues = []
    # Botones con solo icono deben tener aria-label
    icon_buttons = page.evaluate("""() => {
        const btns = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        return Array.from(btns).filter(b => b.querySelector('i') && !b.textContent.trim()).map(b => ({
            tag: b.outerHTML.substring(0, 80)
        }));
    }""")
    for btn in icon_buttons:
        issues.append(f"Botón sin aria-label: {btn['tag']}")
    # Contraste: verificar clases CSS sospechosas (text-gray-400 en fondo claro)
    low_contrast = page.evaluate("""() => {
        const els = document.querySelectorAll('.text-gray-400, .text-gray-300');
        return Array.from(els).map(e => e.tagName + '.' + (e.className || ''));
    }""")
    for el in low_contrast:
        issues.append(f"Posible bajo contraste en {el}")
    return issues

a11y_issues = check_a11y(page)
test("Accesibilidad: botones con icono tienen aria-label", len(a11y_issues) == 0, str(a11y_issues))

# 10. Simulación de modo offline (airplane mode)
try:
    context = browser.new_context()
    offline_page = context.new_page()
    offline_page.goto(f"file://{APP_PATH}")
    offline_page.wait_for_load_state("networkidle")
    # Desconectar red simulada
    context.route("**/*", lambda route: route.abort())
    offline_page.wait_for_timeout(500)
    # Verificar que la app muestra estado offline sin errores
    console_errs = []
    offline_page.on("console", lambda msg: console_errs.append(msg.text) if msg.type == "error" else None)
    offline_page.wait_for_timeout(1000)
    test("Modo offline: sin errores JS al desconectar red", len(console_errs) == 0, str(console_errs))
    context.close()
except Exception as e:
    test("Modo offline: simulación ejecutada", False, str(e))

# 11. Navegación por teclado (Tab key)
page.keyboard.press("Tab")
focused = page.evaluate("() => document.activeElement?.tagName || 'none'")
test("Navegación teclado: primer foco en elemento DOM", focused != 'none' and focused != 'body', f"activeElement: {focused}")

# 12. Viewport meta tag presente (responsive)
viewport = page.evaluate("() => document.querySelector('meta[name=\"viewport\"]')?.content || ''")
test("Viewport meta tag presente", 'width=device-width' in viewport, viewport)

# 13. Flaky test prevention: retry en checks de renderizado
def retry_check(description, fn, retries=3, delay=500):
    for i in range(retries):
        try:
            result = fn()
            if result:
                test(description, True)
                return
        except:
            pass
        if i < retries - 1:
            import time; time.sleep(delay / 1000)
    test(description, False, f"Falló tras {retries} intentos")

retry_check("Render persistente tras retry", lambda: len(page.evaluate("document.getElementById('app-content')?.innerHTML || ''")) > 50)
```

> **Nota para la IA**: Si el usuario no tiene Python/Playwright, salta esta fase y usa solo la Fase 3 (DevTools manual). Pregunta "¿Tienes Python y Playwright instalados? (s/n)" antes de generar el script.

#### Paso 5 — Auditoría CLI con Impeccable (opcional)

Si el usuario tiene Node.js, ofrecer ejecutar:

```bash
npx impeccable detect index.html --fast --json > docs/impeccable-report.json
```

Esto escanea el HTML final contra 27 anti-patrones determinísticos (gradient text, glassmorphism, side-stripe borders, etc.) sin LLM.

Parsear `docs/impeccable-report.json` y agregar resultados al reporte:

```
🔍 Impeccable Audit:
  ✅ 20/27 reglas OK
  ⚠️ 4 warnings: glassmorphism decorativo (#3), card grid idéntico (#5),
     gray-on-color-text (#8), placeholder contrast (#21)
  ❌ 3 fails: centered-stack hero (#19), modal-first (#6), animated layout props (#11)
  📄 Reporte guardado en: docs/impeccable-report.json
```

Los FAILs se agregan a la sección de correcciones del reporte final, con el snippet de corrección de `stack-compliance-guard` Regla 7.

> **Nota**: Si el usuario no tiene Node.js o decline, saltar este paso sin preguntar de nuevo.

### 🟣 FASE 4: Reporte Final & Handoff
1. Compila resultados en tabla markdown.
2. Genera `docs/validacion-[app].md` con:
   - Resumen ejecutivo (% cumplimiento)
   - Tabla de checks (Pass/Fail/Warning)
   - Snippets de corrección para cada FAIL
   - Checklist de pre-entrega firmado
3. Muestra mensaje final:
   ```
   ✅ Validación completada.
   📄 Reporte guardado en: docs/validacion-[app].md
   🚀 Si todos los checks son ✅: Listo para empaquetar y entregar.
   🛠️ Si hay ❌: Responde con "corregir [número]" y regeneraré solo lo afectado.
   ```

---

## 🛡️ AUTO-VALIDACIÓN CONTRA @AGENTS.md (EJECUTAR SIEMPRE)
Antes de outputtear cualquier resultado:
- [ ] ¿La app usa imports o módulos ES6? → `FAIL` + regla `@AGENTS.md §2`
- [ ] ¿Falta cifrado en campos sensibles detectados en spec? → `FAIL` + patrón `cryptoHelpers.encrypt()`
- [ ] ¿UI no usa DaisyUI/Icons/Animate.css? → `FAIL` + guía de reemplazo
- [ ] ¿Módulo no está en `modulosActivos` o no sigue contrato? → `FAIL` + template `_template/`
- [ ] ¿Botones icon-only sin `aria-label`? → `FAIL` + añadir atributo
- [ ] ¿Falta `@media (prefers-reduced-motion)`? → `FAIL` + añadir regla CSS
- [ ] ¿Inputs sin `<label>` visible (solo placeholder)? → `FAIL` + añadir `<label>`
- [ ] ¿Sin indicador visual de estado offline? → `WARN` + sugerir badge de conexión

=== DESIGN AUDIT (De taste-skill/redesign-skill) ===
- [ ] ¿Inter como única tipográfica? → `FAIL` + sugerir Geist/Outfit/Satoshi
- [ ] ¿#000 puro en fondos? → `FAIL` + reemplazar por off-black (#0a0a0a)
- [ ] ¿Acentos saturados >80%? → `FAIL` + desaturar (chroma < 0.08)
- [ ] ¿3-columnas iguales en features? → `FAIL` + zigzag 2-col o masonry
- [ ] ¿h-screen en secciones? → `FAIL` + reemplazar por min-h-[100dvh]
- [ ] ¿Animaciones en top/left/width/height? → `FAIL` + usar transform + opacity
- [ ] ¿Empty states sin CTA? → `WARN` + añadir botón de acción
- [ ] ¿Skeleton loaders ausentes? → `WARN` + añadir skeleton (no spinner)
- [ ] ¿Sin hover/focus/active en interactivos? → `FAIL` + añadir transitions
- [ ] ¿Nombres genéricos (Acme, Juan Pérez)? → `WARN` + reemplazar por realistas
- [ ] ¿Números falsos (99.99%)? → `WARN` + usar datos orgánicos (47.2%)
Si detecta violación, **no continúa** hasta corregirla o pedir confirmación.

---

## 💬 FORMATO DE SALIDA (Terminal-Friendly)
```
[▓▓▓▓▓▓▓░░░░░░░░░] 65% • Fase 3/4: Validación Dinámica
🖥️ Comando 3/5:
$store.theme.toggle(); console.log(...)
→ Tu resultado: 
```
- Usa `▓▓░░` para progreso
- Bloques con `js` o `txt`
- Mensajes cortos, técnicos, sin fluff
- Siempre en español

---

## 📋 PLANTILLA DE REPORTE FINAL (Generada en docs/)
```markdown
# 🛡️ Reporte de Validación: [Nombre App]
**Fecha**: YYYY-MM-DD | **Spec**: specs/[app].md | **Stack**: Offline-First v1.1

## 📊 Resumen
- ✅ Pass: X/Y
- ⚠️ Warnings: Z
- ❌ Fail: W
- 🎯 Cumplimiento: XX%
- 🎭 Tests Automatizados: X✅ / Y❌ (si se ejecutaron)

## 🔍 Detalle de Checks
| # | Regla | Estado | Comentario |
|---|-------|--------|------------|
| 1 | Sin imports/ES6 | ✅ PASS | - |
| 2 | Cifrado campos sensibles | ❌ FAIL | `email` guardado en claro en line 42 de `pacientes.js` |
| 3 | UI DaisyUI + Icons | ✅ PASS | - |
| 4 | Contraste WCAG AA | ⚠️ WARNING | Texto gris en fondo oscuro: ratio 3.8:1 (mínimo 4.5:1) |
| 5 | Touch targets ≥44px | ✅ PASS | - |

## 🛠️ Correcciones Requeridas
```javascript
// En modules/pacientes/module.js (línea 42)
// ANTES:
const paciente = { email: inputEmail.value };
// DESPUÉS:
const paciente = { email: cryptoHelpers.encrypt(inputEmail.value) };
```

## ✅ Checklist de Entrega
- [ ] Funciona con doble clic en `index.html`
- [ ] 0 errores en consola DevTools
- [ ] Test automatizado Playwright: 0 fallos
- [ ] Datos cifrados visibles en IndexedDB
- [ ] Tema oscuro/claro persistente
- [ ] Exportación PDF/Excel operativa
- [ ] `GUIA_USUARIO.md` incluido
- [ ] ZIP o `.exe` generado

## 📝 Notas para el Cliente
> Todos los datos se guardan localmente en su dispositivo. 
> Para preservar su información, use la función de Backup semanal en Configuración.
> Si formatea su equipo o borra los datos del navegador, perderá acceso a los datos cifrados.
```

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

### Con `stack-compliance-guard.md`:
- Ejecutar automáticamente como Fase 0:
  ```
  [▓░░░░░░░░░░░░░░░░░] 5% • Stack Compliance
  🛡️ Validando contra @AGENTS.md... → 12/12 checks passed
  ```

### Con `design-ux-intelligence.md`:
- Activar automáticamente en Fase 3.5 para checklist de diseño/UX
- Si hay FAILs de diseño, sugerir correcciones con snippets exactos

### Con `spec-creator.md`:
- Si no existe `specs/[app].md`, activar automáticamente `spec-creator` con la historia detectada en `project.config.js`

---

## 📝 NOTAS PARA LA IA
- **NO simules ejecución de navegador**. OpenCode es TUI. Guía al usuario a usar DevTools o el script Playwright.
- **Espera confirmación** tras cada bloque de comandos DevTools y tras ejecutar test Playwright antes de avanzar.
- **Prioriza correcciones mínimas**. No regeneres archivos completos si solo falla 1 línea.
- **Si el usuario reporta `CORS` o `Not allowed`**: verifica rutas relativas y prohíbe `file://` + `import`.
- **Playwright**: Antes de generar el script, pregunta si tiene Python/Playwright. Si no, salta la Fase 3.6.
- **Mantén el reporte en `docs/`** para auditoría y handoff profesional.
- **Idioma**: Todos los mensajes al usuario en español técnico pero claro.

✨ **SKILL ready. Trigger: `validar app` para iniciar.**
```

---
