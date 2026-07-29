---
name: setup-init
description: Preparar un proyecto offline-first desde cero: valida entorno, crea estructura exacta, descarga librerías base (Tailwind, DaisyUI, Alpine, Dexie, CryptoJS, pako, Chart.js, jsPDF, SheetJS, Bootstrap Icons, Animate.css) + librerías adicionales detectadas en la spec.
license: MIT
compatibility: Requiere curl (Windows/macOS/Linux) y permisos de escritura. Node.js opcional para Electron. Lee specs/[app].md para detectar librerías adicionales.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "3.0"
  perfiles: [lite, professional, business]
  generatedBy: "setup-init skill"
  triggers: ["iniciar setup", "crear estructura", "descargar libs", "verificar entorno", "setup", "descargar adicionales"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  outputPath: "assets/"
---

# 🛠️ SKILL: setup-init v2 (Entorno, Estructura y Librerías Dinámicas)

> **Propósito**: Preparar un proyecto nuevo desde cero, validando el entorno, creando la estructura exacta, generando archivos base y descargando todas las dependencias locales.
> **Modo**: Guiado por pasos | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md
> **Triggers**: `iniciar setup`, `crear estructura`, `descargar libs`, `verificar entorno`, `setup`

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Detección de Perfil
1. Revisa `project.config.js` existente o pregunta:
```
📋 ¿Qué perfil de proyecto?
[1] Lite (Essential) — file:// + doble clic en index.html (ZIP + GitHub Pages)
[2] Professional — Neutralino .exe + Fixed WebView2 + .apk (Capacitor) (sin HTML visible)
[3] Business — Neutralino .exe + Fixed WebView2 + .apk (Capacitor) + branding
```

### 🟢 FASE 2: Validación de Entorno (según perfil)

**Perfil Lite:**
1. Verifica:
   - `curl` disponible (Win10+ / macOS / Linux)
   - Permisos de escritura en carpeta actual
2. Si falta algo, muestra comandos de instalación exactos por SO.

**Perfil Professional / Business:**
1. Verifica:
   - `node --version` >= 18
   - `npm --version` (viene con Node)
   - Permisos de escritura
   - `neu --version` (npm install -g @neutralinojs/neu)
2. Si no tiene Node.js:
```
❌ Node.js no está instalado.
Instalación: https://nodejs.org (versión LTS recomendada)
```
3. **Solo Business** — verifica herramientas Android:
```
📋 Android SDK disponible:
[1] Si — compilara .apk nativo
[2] No — solo escritorio (.exe)
```
Si [1], verifica:
  - `java --version` >= 17
  - ANDROID_HOME definido

4. Descarga Fixed WebView2 (si no existe en tools/):
```powershell
.\scripts\download-fixed-wv2.ps1
```
5. Si todo está listo, confirma: `✅ Entorno validado. Procedo a crear estructura.`

### 🟡 FASE 3: Generación de Estructura y Archivos Base (según perfil)

**Perfil Lite:**
1. Genera comandos `mkdir` y contenido base para:
```
├── index.html
├── project.config.js
├── AGENTS.md (si no existe)
├── core/
├── modules/_template/
├── assets/{css,js/libs,fonts}
├── data/{avatars,fotos,docs,defaults,exports,backups}
├── docs/
├── electron/
└── scripts/
```
2. **Generar archivos predeterminados en `data/defaults/`**:
```bash
mkdir -p data/defaults
```
   - **Default avatar SVG** (`data/defaults/avatar.svg`): SVG minimalista con inicial de la app.
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="20" fill="#e2e8f0"/>
  <text x="50" y="54" text-anchor="middle" font-family="system-ui" font-weight="600" font-size="36" fill="#64748b">A</text>
</svg>
```
   - **Placeholder imagen** (`data/defaults/placeholder.svg`): para fotos/documentos sin imagen.
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
  <rect width="400" height="300" fill="#f1f5f9"/>
  <path d="M160 130l40 50 30-20 50 60H120z" fill="#cbd5e1"/>
  <circle cx="140" cy="110" r="20" fill="#cbd5e1"/>
  <text x="200" y="200" text-anchor="middle" font-family="system-ui" font-size="14" fill="#94a3b8">Sin imagen</text>
</svg>
```
   - **Archivo readme** (`data/defaults/README.md`): documenta propósito de cada subdirectorio.
```markdown
# Directorio data/

Almacenamiento local de archivos de la aplicación.

- `avatars/` — Imágenes de perfil de usuarios
- `fotos/` — Fotos de registros (productos, clientes, etc.)
- `docs/` — Documentos adjuntos (PDF, DOCX, XLSX)
- `defaults/` — Archivos predeterminados (avatar, placeholder, etc.)
- `exports/` — Exportaciones (backups, reportes, CSVs)
- `backups/` — Copias de seguridad automáticas (.ateje-backup)

> ⚠️ No modificar ni eliminar este directorio manualmente.
> Los archivos se gestionan a través de FileStore API.
```

3. Muestra `project.config.js` mínimo (white-label listo) y `index.html` shell.

**Perfil Professional / Business:**
1. Genera estructura (misma raíz que Lite):
```
├── index.html
├── assets/{css,js/libs,fonts}
├── core/
├── data/{avatars,fotos,docs,defaults,exports,backups}
├── modules/
├── docs/
├── neutralino.config.json
├── package.json
├── project.config.js
├── deployment-jigue/templates/clean-webview2.ps1
├── deployment-jigue/templates/package-professional.ps1
├── tools/WebView2-Fixed/ (descargado en FASE 2)
└── dist/ (output de compilación)
```
2. Copia `neutralino.config.json` desde `deployment-jigue/templates/neutralino.config.json`
   y adapta: `applicationId`, `nativeWindow.title`, `cli.binaryName` según la app.
3. **Solo Business:** si incluye .apk (Capacitor), añadir:
   - `capacitor.config.json` (desde `capacitor/templates/capacitor.config.json`)
   - Directorio `android/` (se genera con `npx cap add android`)
   - `deployment-jigue/templates/package-business.ps1`
4. Muestra `neutralino.config.json` básico (configuración Neutralino).
5. Si .apk, muestra `capacitor.config.json` (configuración Capacitor).

3. Pide confirmación: `📁 Estructura lista. ¿Continuar con descarga de librerías? (S/N)`

### 🔵 FASE 4: Instalación de Librerías (según perfil)

**Perfil Lite:**
1. Busca si existe `specs/[app].md` con `## 📚 Librerías Adicionales`.
2. Entrega `scripts/descargar-libs.bat` con:
   - `chcp 65001`, `curl -f -L --retry 3 -# -o`
   - **12 librerías base** + **librerías adicionales** detectadas
   - Verificación final de archivos esperados
3. Instrucciones: `💾 Guarda como scripts/descargar-libs.bat y ejecuta con doble clic.`

**Perfil Professional / Business:**
1. Lee `stack-versions.json` → `libraries.{key}.npmSpec` para las versiones semver de npm.
2. Busca si existe `specs/[app].md` con `## 📚 Librerías Adicionales`.
3. Inicializa npm e instala dependencias base con versión desde `stack-versions.json`:
```bash
npm init -y
npm install alpinejs@^3.14.0 dexie@^4.0.0 cryptojs@^4.2.0 pako@^2.1.0 chart.js@^4.4.0 jspdf@^2.5.0 xlsx@^0.20.0
```
3. Si hay librerías adicionales en spec:
```bash
npm install [lib1] [lib2]
```
4. **Solo Business** — si incluye .apk (Capacitor):
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor-community/sqlite @capacitor/camera @capacitor/geolocation
npm install @capacitor/local-notifications @capacitor/share
npx cap init "AppName" "com.empresa.app" --web-dir "."
npx cap add android
```
5. IA Jutia Full (siempre incluida en Professional/Business):
```bash
npm install @xenova/transformers pdfjs-dist mammoth marked
```
6. Descarga `neutralino.js` (cliente Neutralino para frontend, versión desde `stack-versions.json → tools.neutralino-framework.pinned`):
```bash
curl -o core/neutralino.js https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js
```
7. Si la spec incluye sql.js (IA Jutia Full con SQLite), descargar WASM (versión desde `stack-versions.json → libraries.sql-js.pinned`):
```bash
mkdir -p assets/wasm
curl -o assets/wasm/sql-wasm.wasm https://cdn.jsdelivr.net/npm/sql.js@{VER_SQLJS}/dist/sql-wasm.wasm
curl -o assets/wasm/sql-wasm.js https://cdn.jsdelivr.net/npm/sql.js@{VER_SQLJS}/dist/sql-wasm.js
```
8. Descarga modelos Transformers.js a `assets/models/`:
```bash
mkdir -p assets/models
curl -f -L -# -o assets/models/minilm-embeddings.onnx "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/model.onnx"
curl -f -L -# -o assets/models/minilm-tokenizer.json "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json"
curl -f -L -# -o assets/models/bert-qa.onnx "https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/model.onnx"
curl -f -L -# -o assets/models/bert-qa-tokenizer.json "https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/tokenizer.json"
```
9. Muestra mensaje: `✅ Dependencias instaladas.`

### 🟠 FASE 4.5: Librerías Adicionales desde Spec (si aplica)
Si la spec contiene `libreriasAdicionales`, muestra este paso antes de la verificación:

```
📦 LIBRERÍAS ADICIONALES DETECTADAS EN SPEC
   Se encontraron [N] librerías adicionales en specs/[app].md:

   • qrcode.min.js → assets/js/libs/qrcode.min.js
   • dayjs.min.js  → assets/js/libs/dayjs.min.js

   Estas ya están incluidas en descargar-libs.bat.
   Si prefieres descargarlas por separado:
   → scripts/descargar-libs-adicionales.bat
```

Si el usuario prefiere scripts separados, genera `scripts/descargar-libs-adicionales.bat` con solo las URLs adicionales.

### 🟣 FASE 5: Verificación de Integridad (según perfil)

**Perfil Lite:**
1. Tras ejecución del `.bat`, pide confirmar: `✅ Descarga completada` o `❌ Faltan archivos`.
2. Calcula el total de librerías esperadas.
3. Ejecuta validación:
```
🔍 VALIDACIÓN POST-SETUP (Lite)
- [x] N/N librerías base en assets/
- [x] index.html usa solo <script src> (sin imports)
- [x] Rutas relativas 100% file:// compatible
- [x] project.config.js listo para white-label
- [x] (Si IA Full) modelos en assets/models/
```
4. Si falla: sugiere desactivar AV temporalmente o ejecutar como Admin.

**Perfil Professional / Business:**
1. Verifica `package.json` con dependencias correctas.
2. Verifica `neutralino.config.json` existe.
3. Verifica `core/neutralino.js` existe.
4. Verifica `tools/WebView2-Fixed/` existe.
5. Si IA Full: verifica modelos en `assets/models/`.
6. **Solo Business:** si aplica, verifica `capacitor.config.json` y `android/`.

### 🔴 FASE 6: Handoff
```
🚀 Setup completado.
📦 Perfil: [lite|professional|business]
📂 Estructura: lista
📚 Librerías: instaladas
⚙️ project.config.js: activo
🧠 IA Jutia: [lite|full|no]
✅ Listo para definir la app.

📝 Siguiente paso: definir spec app
```

---

## 🛡️ AUTO-VALIDACIÓN CONTRA @AGENTS.md (EJECUTAR SIEMPRE)
Antes de mostrar cualquier bloque, verifica:
### Perfil Lite:
- [ ] ¿Incluye `<script type="module">` o `import/export`? → RECHAZAR
- [ ] ¿Usa CDNs en `<head>` o `<body>`? → REEMPLAZAR por `assets/`
- [ ] ¿Falta `pako.js`, `jspdf.js` o `xlsx.js`? → AGREGAR
- [ ] ¿`index.html` no carga scripts en orden (libs → core → modules → main)? → REORDENAR
- [ ] ¿No genera `project.config.js` con `modulosActivos` y `tema.colores`? → AGREGAR
- [ ] ¿Existe `specs/[app].md` con `libreriasAdicionales`? → INYECTAR URLs en el script de descarga
- [ ] ¿Las librerías adicionales tienen URL de descarga válida? → VERIFICAR con Context7 MCP
### Perfil Professional / Business:
- [ ] ¿Perfil Professional/Business sin `neutralino.config.json`? → CREAR desde template en `deployment-jigue/templates/`
- [ ] ¿Perfil Professional/Business sin `core/neutralino.js`? → DESCARGAR desde CDN de NeutralinoJS
- [ ] ¿Perfil Professional/Business sin `tools/WebView2-Fixed/`? → EJECUTAR `scripts/download-fixed-wv2.ps1`
- [ ] ¿sql.js activo pero `assets/wasm/sql-wasm.wasm` no existe? → DESCARGAR desde jsDelivr
- [ ] ¿Modelos IA Full no se descargan a `assets/models/`? → AGREGAR comandos curl
- [ ] **Solo Business:** ¿con .apk pero sin `capacitor.config.json`? → CREAR desde `capacitor/templates/capacitor.config.json`
- [ ] **Solo Business:** ¿con .apk pero sin `android/`? → `npx cap add android`
- [ ] **Solo Business:** ¿con .apk pero sin plugins Capacitor? → `npm install @capacitor/...`
Si falla, corrige silenciosamente antes de output.

---

## 💬 FORMATO DE SALIDA (Terminal-Friendly)
```
[▓▓░░░░░░░░░░░░░░] 25% • Fase 2/4: Estructura
📁 Ejecuta estos comandos:
mkdir core modules assets\css assets\js\libs assets\fonts docs electron scripts
...
```
- Usa `▓▓░░` para progreso
- Bloques con `cmd` o `bat`
- Mensajes claros, sin jerga innecesaria
- Siempre en español

---

## 📦 CONTENIDO BASE DE `scripts/descargar-libs.bat`

> **IMPORTANTE:** Las versiones están en `stack-versions.json` (raíz del repo).
> La IA debe LEER `stack-versions.json` → `libraries.{key}.pinned` para resolver los placeholders `{VER_*}`.
> NUNCA usar valores hardcodeados. Si `stack-versions.json` no existe, reportar error.

Resolución de placeholders desde `stack-versions.json`:

| Placeholder | Key en stack-versions.json |
|------------|--------------------------|
| `{VER_TAILWIND}` | `libraries.tailwindcss.pinned` (ahora @tailwindcss/browser) |
| `{VER_DAISYUI}` | `libraries.daisyui.pinned` |
| `{VER_BSICONS}` | `libraries.bootstrap-icons.pinned` |
| `{VER_ANIMATE}` | `libraries.animate-css.pinned` → `animate.css` |
| `{VER_ALPINE}` | `libraries.alpinejs.pinned` |
| `{VER_DEXIE}` | `libraries.dexie.pinned` |
| `{VER_CRYPTOJS}` | `libraries.cryptojs.pinned` |
| `{VER_PAKO}` | `libraries.pako.pinned` |
| `{VER_CHARTJS}` | `libraries.chartjs.pinned` |
| `{VER_JSPDF}` | `libraries.jspdf.pinned` |
| `{VER_XLSX}` | `libraries.xlsx.pinned` |
| `{VER_QRCODE}` | `libraries.qrcodejs.pinned` |

*(La IA genera este bloque leyendo las versiones de `stack-versions.json`, reemplazando los placeholders con `libraries.{key}.pinned`, luego inyecta las URLs de librerías adicionales detectadas en la spec)*
```bat
@echo off
chcp 65001 >nul
title ⚡ Descargando Librerías - Setup Offline
cls
echo ====================================================
echo  ⚡ STACK OFFLINE-FIRST - DESCARGA DE LIBRERÍAS
echo ====================================================
echo  Base: 12 librerias + Adicionales: [N]
echo ====================================================
if not exist "assets\css" mkdir "assets\css"
if not exist "assets\js\libs" mkdir "assets\js\libs"
if not exist "assets\fonts" mkdir "assets\fonts"

set "CURL=curl -f -L --retry 3 --retry-delay 2 -# -o"

echo --- CSS + Themes ---
rem @tailwindcss/browser@{VER_TAILWIND} — ver stack-versions.json (JS runtime, genera CSS en browser)
%CURL% "assets/js/libs/tailwind-browser.js" "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@{VER_TAILWIND}/dist/index.global.js"
rem daisyui@{VER_DAISYUI} — ver stack-versions.json
%CURL% "assets/css/daisyui.min.css" "https://cdn.jsdelivr.net/npm/daisyui@{VER_DAISYUI}/daisyui.css"
%CURL% "assets/css/daisyui-themes.css" "https://cdn.jsdelivr.net/npm/daisyui@{VER_DAISYUI}/themes.css"
rem bootstrap-icons@{VER_BSICONS} — ver stack-versions.json
%CURL% "assets/css/bootstrap-icons.css" "https://cdn.jsdelivr.net/npm/bootstrap-icons@{VER_BSICONS}/font/bootstrap-icons.css"
rem animate.css/{VER_ANIMATE} — ver stack-versions.json
%CURL% "assets/css/animate.min.css" "https://cdnjs.cloudflare.com/ajax/libs/animate.css/{VER_ANIMATE}/animate.min.css"
rem bootstrap-icons woff2@{VER_BSICONS} — ver stack-versions.json
%CURL% "assets/fonts/bootstrap-icons.woff2" "https://cdn.jsdelivr.net/npm/bootstrap-icons@{VER_BSICONS}/font/fonts/bootstrap-icons.woff2"

echo --- Base: JavaScript ---
rem alpinejs@{VER_ALPINE} — ver stack-versions.json
%CURL% "assets/js/libs/alpine.js" "https://cdn.jsdelivr.net/npm/alpinejs@{VER_ALPINE}/dist/cdn.min.js"
rem dexie@{VER_DEXIE} — ver stack-versions.json
%CURL% "assets/js/libs/dexie.js" "https://unpkg.com/dexie@{VER_DEXIE}/dist/dexie.min.js"
rem crypto-js/{VER_CRYPTOJS} — ver stack-versions.json
%CURL% "assets/js/libs/crypto-js.js" "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/{VER_CRYPTOJS}/crypto-js.min.js"
rem pako/{VER_PAKO} — ver stack-versions.json
%CURL% "assets/js/libs/pako.js" "https://cdnjs.cloudflare.com/ajax/libs/pako/{VER_PAKO}/pako.min.js"
rem chart.js@{VER_CHARTJS} — ver stack-versions.json
%CURL% "assets/js/libs/chart.js" "https://cdn.jsdelivr.net/npm/chart.js@{VER_CHARTJS}/dist/chart.umd.min.js"
rem jspdf/{VER_JSPDF} — ver stack-versions.json
%CURL% "assets/js/libs/jspdf.js" "https://cdnjs.cloudflare.com/ajax/libs/jspdf/{VER_JSPDF}/jspdf.umd.min.js"
rem xlsx-{VER_XLSX} — ver stack-versions.json
%CURL% "assets/js/libs/xlsx.js" "https://cdn.sheetjs.com/xlsx-{VER_XLSX}/package/dist/xlsx.full.min.js"

echo --- Adicionales (desde spec) ---
:: QRCode.js — ver stack-versions.json (libreria legacy, alternativa: npm qrcode)
:: %CURL% "assets/js/libs/qrcode.min.js" "https://cdn.jsdelivr.net/npm/qrcodejs@{VER_QRCODE}/qrcode.min.js"
:: (La IA inyecta aquí las URLs de librerías adicionales detectadas en la spec)

echo ✅ Descarga finalizada. Presiona una tecla para salir.
pause >nul
```

---

---
## 🧬 FLUJO DE ACTUALIZACIÓN DE VERSIONES

1. Ejecutar `scripts/update-libs.ps1 -Apply` para verificar y actualizar `stack-versions.json`
2. La IA lee las nuevas versiones desde `stack-versions.json` antes de generar `descargar-libs.bat`
3. Las versiones de npm (Professional/Business) se toman del campo `npmSpec` de cada librería
4. Librerías con `status: legacy` o `deprecated` incluyen alternativas en el campo `alternative`
5. Después de actualizar, ejecutar `/setup` para regenerar los scripts de descarga

---
## 🔗 INTEGRACIÓN CON OTRAS SKILLs
| SKILL | Relación | Trigger de Handoff |
|-------|----------|-------------------|
| `spec-engine` | Consume estructura + detecta librerías adicionales en spec | `✅ Setup → definir spec app` |
| `code-generator` | Genera `core/` y `modules/` desde spec validada | `📄 Spec validada → generar código` |
| `ia-jutia` | Si perfil IA Full, descarga modelos Transformers.js | `🧠 IA incluida` |
| `validation-engine` | Valida resultado final antes de entrega | `🚀 App lista → validar app` |
| `stack-compliance-guard` | Verifica libs desde `assets/` no CDN | Auto-activada |
| `deployment-jigue` | Empaqueta segun perfil (ZIP / Neutralino .exe) | `📦 App lista → publicar` |

---

## 📝 NOTAS PARA LA IA
- Esta skill **NO escribe archivos por sí sola**. Genera comandos y scripts para que el usuario los ejecute en su terminal.
- Siempre verifica rutas relativas y orden de carga antes de validar.
- **Librerías adicionales**: Revisa `specs/` por si existe spec con `libreriasAdicionales`. Si existe, inyecta las URLs de descarga en el `.bat`. Si no existe, solo genera las 12 base.
- **URLs de librerías**: Usa Context7 MCP para resolver URLs correctas cuando sea necesario. Prioriza jsDelivr > cdnjs > unpkg para máxima estabilidad.
- Si el usuario reporta error en descarga, sugiere: `1) Desactivar AV temporalmente 2) Ejecutar como Admin 3) Usar PowerShell como fallback`.
- Mantén el tono profesional, técnico pero accesible. Zero fluff.

✨ **SKILL ready v2. Trigger: `iniciar setup` para comenzar.**
```

---

