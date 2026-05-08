---
name: validation-offline
description: Valida que la app offline-first cumple estrictamente con @AGENTS.md, specs y reglas del stack. Verificación estática + guía de pruebas en DevTools + reporte técnico en docs/validacion-[app].md.
license: MIT
compatibility: Requiere @AGENTS.md, @project.config.js y specs/[app].md presentes. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.1"
  generatedBy: "validation-offline skill"
  triggers: ["validar app", "verificar spec", "validar stack", "chequeo calidad", "reporte validación"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  outputPath: "docs/"
  reportFormat: "markdown"
---

# 🛡️ SKILL: validation-offline (Validación Integral de Apps Offline-First)

> **Propósito**: Verificar que la app generada cumple estrictamente con `@AGENTS.md`, `@specs/[app].md` y las reglas del stack offline-first. Genera reporte técnico con Pass/Fail y correcciones exactas.
> **Modo**: Diagnóstico + Guía interactiva | **Idioma**: ES | **Contexto**: Requiere `@AGENTS.md`, `@project.config.js`, `@specs/[app].md`
> **Output**: Reporte en `docs/validacion-[app].md`

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
- [ ] ✅ Orden de carga en `index.html`: CSS → Libs → Core → Modules → Main
- [ ] ✅ `project.config.js` tiene `modulosActivos`, `tema.colores`, `app.nombre`
- [ ] ✅ Módulos registrados en `window.MODULES` con `id`, `init`, `render`, `destroy`
- [ ] ✅ Campos sensibles cifrados antes de `db.put()` y descifrados en UI
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

✅ Contraste WCAG AA: [PASS/FAIL] → [comentario si FAIL]
✅ Touch targets ≥44px: [PASS/FAIL] → [elementos afectados si FAIL]
✅ Focus rings visibles: [PASS/FAIL]
✅ Empty states con CTA: [PASS/FAIL]
✅ Animaciones con propósito: [PASS/FAIL] → [lista si decorativas]

📝 Si hay FAILs: Responde "corregir UX [números]" para parchear automáticamente.
```

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
- **NO simules ejecución de navegador**. OpenCode es TUI. Guía al usuario a usar DevTools.
- **Espera confirmación** tras cada bloque de comandos DevTools antes de avanzar.
- **Prioriza correcciones mínimas**. No regeneres archivos completos si solo falla 1 línea.
- **Si el usuario reporta `CORS` o `Not allowed`**: verifica rutas relativas y prohíbe `file://` + `import`.
- **Mantén el reporte en `docs/`** para auditoría y handoff profesional.
- **Idioma**: Todos los mensajes al usuario en español técnico pero claro.

✨ **SKILL ready. Trigger: `validar app` para iniciar.**
```

---
