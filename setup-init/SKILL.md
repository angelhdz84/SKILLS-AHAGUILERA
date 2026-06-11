---
name: setup-init
description: Preparar un proyecto offline-first desde cero: valida entorno, crea estructura exacta, descarga librerías base (Tailwind, DaisyUI, Alpine, Dexie, CryptoJS, pako, ApexCharts, jsPDF, SheetJS, Bootstrap Icons, Animate.css) + librerías adicionales detectadas en la spec.
license: MIT
compatibility: Requiere curl (Windows/macOS/Linux) y permisos de escritura. Node.js opcional para Electron. Lee specs/[app].md para detectar librerías adicionales.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "3.0"
  perfiles: [lite, full]
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
[1] Lite — file:// + doble clic en index.html
[2] Full — Bun + .exe profesional
```

### 🟢 FASE 2: Validación de Entorno (según perfil)

**Perfil Lite:**
1. Verifica:
   - `curl` disponible (Win10+ / macOS / Linux)
   - Permisos de escritura en carpeta actual
2. Si falta algo, muestra comandos de instalación exactos por SO.

**Perfil Full:**
1. Verifica:
   - `bun --version` >= 1.2
   - Permisos de escritura
2. Si no tiene Bun:
```
❌ Bun no está instalado.
Instalación:
  PowerShell: powershell -c "irm bun.sh/install.ps1 | iex"
  macOS/Linux: curl -fsSL https://bun.sh/install | bash
```
3. Verifica `bun --version` y confirma.

3. Si todo está listo, confirma: `✅ Entorno validado. Procedo a crear estructura.`

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
├── docs/
├── electron/
└── scripts/
```
2. Muestra `project.config.js` mínimo (white-label listo) y `index.html` shell.

**Perfil Full:**
1. Inicializa proyecto Bun:
```
bun init -y
```
2. Genera estructura:
```
├── public/
│   ├── index.html
│   └── assets/{css,js/libs,fonts}
├── src/
│   ├── index.js (entry point para Bun serve)
│   └── core/
├── modules/
├── docs/
├── package.json
├── project.config.js
└── dist/ (output de compilación)
```
3. Muestra `src/index.js` básico (servidor de archivos estáticos).

3. Pide confirmación: `📁 Estructura lista. ¿Continuar con descarga de librerías? (S/N)`

### 🔵 FASE 4: Instalación de Librerías (según perfil)

**Perfil Lite:**
1. Busca si existe `specs/[app].md` con `## 📚 Librerías Adicionales`.
2. Entrega `scripts/descargar-libs.bat` con:
   - `chcp 65001`, `curl -f -L --retry 3 -# -o`
   - **12 librerías base** + **librerías adicionales** detectadas
   - Verificación final de archivos esperados
3. Instrucciones: `💾 Guarda como scripts/descargar-libs.bat y ejecuta con doble clic.`

**Perfil Full:**
1. Busca si existe `specs/[app].md` con `## 📚 Librerías Adicionales`.
2. Instala dependencias npm base:
```bash
bun add alpinejs dexie cryptojs pako apexcharts jspdf xlsx
```
3. Si hay librerías adicionales en spec:
```bash
bun add [lib1] [lib2]
```
4. Si se incluyó IA Jutia Full:
```bash
bun add @xenova/transformers pdfjs-dist mammoth marked
```
5. Descarga modelos Transformers.js a `public/assets/models/`:
```bash
mkdir -p public/assets/models
curl -f -L -# -o public/assets/models/minilm-embeddings.onnx "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/model.onnx"
curl -f -L -# -o public/assets/models/minilm-tokenizer.json "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json"
curl -f -L -# -o public/assets/models/bert-qa.onnx "https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/model.onnx"
curl -f -L -# -o public/assets/models/bert-qa-tokenizer.json "https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/tokenizer.json"
```
6. Muestra mensaje: `✅ Dependencias instaladas.`

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

**Perfil Full:**
1. Verifica `package.json` con dependencias correctas.
2. Verifica `src/index.js` existe.
3. Verifica que `bun run src/index.js` no da error.
4. Si IA Full: verifica modelos en `public/assets/models/`.

### 🔴 FASE 6: Handoff
```
🚀 Setup completado.
📦 Perfil: [lite|full]
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
### Perfil Full:
- [ ] ¿Falta `src/index.js` (Bun entry point)? → CREAR
- [ ] ¿`package.json` sin script de compile? → AGREGAR `"compile": "bun build --compile"`
- [ ] ¿Modelos IA Full no se descargan a `public/assets/models/`? → AGREGAR comandos curl
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
*(La IA debe outputtear este bloque + inyectar las URLs de librerías adicionales al final)*
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

echo --- Base: CSS y Fuentes ---
%CURL% "assets/css/tailwind.min.css" "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
%CURL% "assets/css/daisyui.min.css" "https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.css"
%CURL% "assets/css/bootstrap-icons.css" "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
%CURL% "assets/css/animate.min.css" "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
%CURL% "assets/fonts/bootstrap-icons.woff2" "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2"

echo --- Base: JavaScript ---
%CURL% "assets/js/libs/alpine.js" "https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"
%CURL% "assets/js/libs/dexie.js" "https://unpkg.com/dexie@4.0.8/dist/dexie.min.js"
%CURL% "assets/js/libs/crypto-js.js" "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"
%CURL% "assets/js/libs/pako.js" "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"
%CURL% "assets/js/libs/apexcharts.js" "https://cdn.jsdelivr.net/npm/apexcharts@3.49.1/dist/apexcharts.min.js"
%CURL% "assets/js/libs/jspdf.js" "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
%CURL% "assets/js/libs/xlsx.js" "https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js"

echo --- Adicionales (desde spec) ---
:: %CURL% "assets/js/libs/qrcode.min.js" "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"
:: (La IA inyecta aquí las URLs de librerías adicionales detectadas en la spec)

echo ✅ Descarga finalizada. Presiona una tecla para salir.
pause >nul
```

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs
| SKILL | Relación | Trigger de Handoff |
|-------|----------|-------------------|
| `spec-creator` | Consume estructura + detecta librerías adicionales en spec | `✅ Setup → definir spec app` |
| `code-generator` | Genera `core/` y `modules/` desde spec validada | `📄 Spec validada → generar código` |
| `ia-jutia` | Si perfil IA Full, descarga modelos Transformers.js | `🧠 IA incluida` |
| `validation-offline` | Valida resultado final antes de entrega | `🚀 App lista → validar app` |
| `stack-compliance-guard` | Verifica libs desde `assets/` no CDN | Auto-activada |
| `deployment-jigue` | Empaqueta segun perfil (ZIP / .exe) | `📦 App lista → publicar` |

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

