---
name: setup-init
description: Preparar un proyecto offline-first desde cero: valida entorno, crea estructura exacta, descarga librerías base (Tailwind, DaisyUI, Alpine, Dexie, CryptoJS, pako, Chart.js, jsPDF, SheetJS, Bootstrap Icons, Animate.css) + librerías adicionales detectadas en la spec.
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
[2] Full — Escritorio (.exe NeutralinoJS) + Móvil (.apk Capacitor)
```

### 🟢 FASE 2: Validación de Entorno (según perfil)

**Perfil Lite:**
1. Verifica:
   - `curl` disponible (Win10+ / macOS / Linux)
   - Permisos de escritura en carpeta actual
2. Si falta algo, muestra comandos de instalación exactos por SO.

**Perfil Full:**
1. Verifica:
   - `node --version` >= 18
   - `npm --version` (viene con Node)
   - Permisos de escritura
2. Si no tiene Node.js:
```
❌ Node.js no está instalado.
Instalación: https://nodejs.org (versión LTS recomendada)
```
3. Pregunta destino móvil:
```
📋 ¿Incluir empaquetado Android (.apk)?
[1] No, solo escritorio
[2] Si, con Capacitor (requiere Android SDK + JDK 17+)
```
Si [2], verifica:
  - `java --version` >= 17
  - Android SDK: instalado (ANDROID_HOME definido)

4. Verifica Neutralino CLI (opcional, se usa en deploy):
   - `neu --version` (npm install -g @neutralinojs/neu)

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

**Perfil Full:**
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
└── dist/ (output de compilación)
```
2. Copia `neutralino.config.json` desde `deployment-jigue/templates/neutralino.config.json`
   y adapta: `applicationId`, `nativeWindow.title`, `cli.binaryName` según la app.
3. Si incluye .apk (Capacitor), añadir:
   - `capacitor.config.json` (desde `capacitor/templates/capacitor.config.json`)
   - Directorio `android/` (se genera con `npx cap add android`)
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

**Perfil Full:**
1. Busca si existe `specs/[app].md` con `## 📚 Librerías Adicionales`.
2. Inicializa npm e instala dependencias base:
```bash
npm init -y
npm install alpinejs dexie cryptojs pako chart.js jspdf xlsx
```
3. Si hay librerías adicionales en spec:
```bash
npm install [lib1] [lib2]
```
4. Si incluye .apk (Capacitor):
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor-community/sqlite @capacitor/camera @capacitor/geolocation
npm install @capacitor/local-notifications @capacitor/share
npx cap init "AppName" "com.empresa.app" --web-dir "."
npx cap add android
```
5. Si se incluyó IA Jutia Full:
```bash
npm install @xenova/transformers pdfjs-dist mammoth marked
```
6. Descarga `neutralino.js` (cliente Neutralino para frontend):
```bash
curl -o core/neutralino.js https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js
```
7. Si la spec incluye sql.js (IA Jutia Full con SQLite), descargar WASM:
```bash
mkdir -p assets/wasm
curl -o assets/wasm/sql-wasm.wasm https://cdn.jsdelivr.net/npm/sql.js@1.10/dist/sql-wasm.wasm
curl -o assets/wasm/sql-wasm.js https://cdn.jsdelivr.net/npm/sql.js@1.10/dist/sql-wasm.js
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

**Perfil Full:**
1. Verifica `package.json` con dependencias correctas.
2. Verifica `src/index.js` existe.
3. Verifica que `bun run src/index.js` no da error.
4. Si IA Full: verifica modelos en `assets/models/`.

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
- [ ] ¿Perfil Full sin `neutralino.config.json`? → CREAR desde template en `deployment-jigue/templates/`
- [ ] ¿Perfil Full sin `core/neutralino.js`? → DESCARGAR desde CDN de NeutralinoJS
- [ ] ¿sql.js activo pero `assets/wasm/sql-wasm.wasm` no existe? → DESCARGAR desde jsDelivr
- [ ] ¿Modelos IA Full no se descargan a `assets/models/`? → AGREGAR comandos curl
- [ ] ¿Perfil Full con .apk pero sin `capacitor.config.json`? → CREAR desde `capacitor/templates/capacitor.config.json`
- [ ] ¿Perfil Full con .apk pero sin `android/`? → `npx cap add android`
- [ ] ¿Perfil Full con .apk pero sin plugins Capacitor? → `npm install @capacitor/...`
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
%CURL% "assets/js/libs/chart.js" "https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js"
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

