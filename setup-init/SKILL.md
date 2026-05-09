---
name: setup-init
description: Preparar un proyecto offline-first desde cero: valida entorno, crea estructura exacta, descarga librerías base (Tailwind, DaisyUI, Alpine, Dexie, CryptoJS, pako, ApexCharts, jsPDF, SheetJS, Bootstrap Icons, Animate.css) + librerías adicionales detectadas en la spec.
license: MIT
compatibility: Requiere curl (Windows/macOS/Linux) y permisos de escritura. Node.js opcional para Electron. Lee specs/[app].md para detectar librerías adicionales.
meta
  author: Angel Hernandez - ahaguilera.dev
  version: "2.0"
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

### 🟢 FASE 1: Validación de Entorno
1. Verifica mentalmente prerequisitos:
   - `curl` disponible (Win10+ / macOS / Linux)
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

### 🔵 FASE 3: Generación de Script de Descarga (Base)
1. Busca si existe `specs/[app].md` con sección `## 📚 Librerías Adicionales`. Si existe, léela para conocer librerías extra.
2. Entrega el bloque exacto para `scripts/descargar-libs.bat` con:
   - `chcp 65001`, creación de carpetas, `curl -f -L --retry 3 -# -o`
   - **12 librerías base** del stack + **librerías adicionales** detectadas en la spec
   - Verificación final de archivos esperados (contando las adicionales)
   - Mensajes en español, compatible con terminales
3. Instrucciones: `💾 Guarda el bloque como scripts/descargar-libs.bat y ejecútalo con doble clic.`
4. Espera confirmación del usuario.

### 🟠 FASE 3.5: Librerías Adicionales desde Spec (si aplica)
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

### 🟣 FASE 4: Verificación de Integridad
1. Tras ejecución del `.bat`, pide confirmar: `✅ Descarga completada` o `❌ Faltan archivos`.
2. Calcula el total de librerías esperadas: 12 base + N adicionales.
3. Ejecuta validación interna contra `@AGENTS.md`:
   ```
   🔍 VALIDACIÓN POST-SETUP
   - [x] 12/12 librerías base en rutas correctas
   - [x] N/N librerías adicionales en assets/js/libs/
   - [x] index.html usa solo <script src> (sin imports)
   - [x] Rutas relativas 100% file:// compatible
   - [x] project.config.js listo para white-label
   ✅ Entorno listo para desarrollo.
   ```
4. Si falla: sugiere desactivar AV temporalmente o ejecutar como Admin.

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
- [ ] ¿Existe `specs/[app].md` con `libreriasAdicionales`? → INYECTAR URLs en el script de descarga
- [ ] ¿Las librerías adicionales tienen URL de descarga válida? → VERIFICAR con Context7 MCP
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
| `spec-creator` | Consume estructura + detecta librerías adicionales en la spec | `✅ Setup completado → definir spec app` |
| `code-generator` | Genera `core/` y `modules/` desde spec validada | `📄 Spec validada → generar código base` |
| `validation-offline` | Valida el resultado final antes de entrega | `🚀 App lista → validar app` |
| `stack-compliance-guard` | Verifica que libs adicionales se cargan desde `assets/` no CDN | Auto-activada |

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

