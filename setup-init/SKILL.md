---
name: setup-init
description: Preparar un proyecto offline-first desde cero: valida entorno, crea estructura exacta, descarga todas las librerías localmente (Tailwind, DaisyUI, Alpine, Dexie, CryptoJS, pako, ApexCharts, jsPDF, SheetJS, Bootstrap Icons, Animate.css).
license: MIT
compatibility: Requiere curl (Windows/macOS/Linux) y permisos de escritura. Node.js opcional para Electron.
metadata:
  author: OpenCode User
  version: "1.0"
  generatedBy: "setup-init skill"
---

# 🛠️ SKILL: setup-init (Entorno, Estructura y Librerías)

> **Propósito**: Preparar un proyecto nuevo desde cero, validando el entorno, creando la estructura exacta, generando archivos base y descargando todas las dependencias locales.
> **Modo**: Guiado por pasos | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md
> **Triggers**: `iniciar setup`, `crear estructura`, `descargar libs`, `verificar entorno`, `setup`

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Validación de Entorno
1. Verifica mentalmente prerequisitos:
   - `curl` disponible (Win10+/macOS/Linux)
   - `node` & `npm` (solo si se usará Electron después)
   - Permisos de escritura en carpeta actual
2. Si falta algo, muestra comandos de instalación exactos por SO.
3. Si todo está listo, confirma: `✅ Entorno validado. Procedo a crear estructura.`

### 🟡 FASE 2: Generación de Estructura y Archivos Base
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
2. Muestra `project.config.js` mínimo (white-label listo) y `index.html` shell (scripts en orden correcto, sin imports, con `x-cloak`).
3. Pide confirmación: `📁 Estructura lista. ¿Continuar con descarga de librerías? (S/N)`

### 🔵 FASE 3: Generación de Script de Descarga
1. Entrega el bloque exacto para `scripts/descargar-libs.bat` con:
   - `chcp 65001`, creación de carpetas, `curl -f -L --retry 3 -# -o`
   - Rutas exactas y URLs estables de las 12 librerías del stack
   - Verificación final de archivos esperados
   - Mensajes en español, compatible con terminales
2. Instrucciones: `💾 Guarda el bloque como scripts/descargar-libs.bat y ejecútalo con doble clic.`
3. Espera confirmación del usuario.

### 🟣 FASE 4: Verificación de Integridad
1. Tras ejecución del `.bat`, pide confirmar: `✅ Descarga completada` o `❌ Faltan archivos`.
2. Ejecuta validación interna contra `@AGENTS.md`:
   ```
   🔍 VALIDACIÓN POST-SETUP
   - [x] 12/12 librerías en rutas correctas
   - [x] index.html usa solo <script src> (sin imports)
   - [x] Rutas relativas 100% file:// compatible
   - [x] project.config.js listo para white-label
   ✅ Entorno listo para desarrollo.
   ```
3. Si falla: sugiere desactivar AV temporalmente o ejecutar como Admin.

### 🔴 FASE 5: Handoff
```
🚀 Setup completado.
📦 Estructura: lista
📚 Librerías: descargadas localmente
⚙️ Configuración: project.config.js activo
✅ Listo para definir la app.

📝 Siguiente paso: definir spec app
```

---

## 🛡️ AUTO-VALIDACIÓN CONTRA @AGENTS.md (EJECUTAR SIEMPRE)
Antes de mostrar cualquier bloque, verifica:
- [ ] ¿Incluye `<script type="module">` o `import/export`? → RECHAZAR
- [ ] ¿Usa CDNs en `<head>` o `<body>`? → REEMPLAZAR por `assets/`
- [ ] ¿Falta `pako.js`, `jspdf.js` o `xlsx.js`? → AGREGAR
- [ ] ¿`index.html` no carga scripts en orden (libs → core → modules → main)? → REORDENAR
- [ ] ¿No genera `project.config.js` con `modulosActivos` y `tema.colores`? → AGREGAR
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

## 📦 CONTENIDO EXACTO DE `scripts/descargar-libs.bat`
*(La IA debe outputtear este bloque para que el usuario lo guarde)*
```bat
@echo off
chcp 65001 >nul
title ⚡ Descargando Librerías - Setup Offline
cls
echo ====================================================
echo  ⚡ STACK OFFLINE-FIRST - DESCARGA DE LIBRERÍAS
echo ====================================================
if not exist "assets\css" mkdir "assets\css"
if not exist "assets\js\libs" mkdir "assets\js\libs"
if not exist "assets\fonts" mkdir "assets\fonts"

set "CURL=curl -f -L --retry 3 --retry-delay 2 -# -o"

%CURL% "assets/css/tailwind.min.css" "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
%CURL% "assets/css/daisyui.min.css" "https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.css"
%CURL% "assets/css/bootstrap-icons.css" "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
%CURL% "assets/css/animate.min.css" "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
%CURL% "assets/fonts/bootstrap-icons.woff2" "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2"
%CURL% "assets/fonts/inter-400.woff2" "https://fonts.gstatic.com/s/inter/v13.woff2"
%CURL% "assets/fonts/inter-500.woff2" "https://fonts.gstatic.com/s/inter/v13.woff2"
%CURL% "assets/fonts/inter-700.woff2" "https://fonts.gstatic.com/s/inter/v13.woff2"
%CURL% "assets/js/libs/alpine.js" "https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"
%CURL% "assets/js/libs/dexie.js" "https://unpkg.com/dexie@4.0.8/dist/dexie.min.js"
%CURL% "assets/js/libs/crypto-js.js" "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"
%CURL% "assets/js/libs/pako.js" "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"
%CURL% "assets/js/libs/apexcharts.js" "https://cdn.jsdelivr.net/npm/apexcharts@3.49.1/dist/apexcharts.min.js"
%CURL% "assets/js/libs/jspdf.js" "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
%CURL% "assets/js/libs/xlsx.js" "https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js"

echo ✅ Descarga finalizada. Presiona una tecla para salir.
pause >nul

Validar que index.html generado cumple:
Orden de scripts: CSS → Libs → Core → Modules → Main
Sin type="module", sin CDNs
x-cloak presente para evitar FOUC

📝 NOTA: Las fuentes de Google se descargan via curl (inter incluido por defecto).
Para otras fuentes: descargar desde fonts.google.com → guardar en assets/fonts/
Usar @font-face en CSS para fuentes locales, nunca <link> de Google en producción.

