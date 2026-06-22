---
name: deployment-jigue
description: Publica cambios a GitHub, despliega GitHub Pages y empaqueta segun perfil. Lite: ZIP + Pages. Full: NeutralinoJS .exe / Capacitor .apk + Pages + Release.
license: MIT
compatibility: Requiere GitHub MCP configurado en opencode.json con GITHUB_TOKEN. Repositorio con GitHub Pages habilitado y action deploy-pages.yml existente. Perfil Full requiere @neutralinojs/neu CLI.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.0"
  triggers:
    - "publicar"
    - "subir cambios"
    - "pushear"
    - "deploy pages"
    - "github pages"
    - "lanzar cambios"
    - "desplegar"
    - "hacer push"
    - "commit y push"
    - "publicar en github"
    - "actualizar pages"
    - "empaquetar"
    - "compilar"
    - "lanzar"
  stack: ["git", "github", "github-pages", "neutralinojs", "capacitor"]
  perfiles: [lite, full]
  language: es
  mcp:
    - "github"
---

# SKILL: deployment-jigue (Publicacion + Deploy + Empaquetado)

> **Proposito**: Publicar cambios locales a GitHub, desplegar a GitHub Pages y empaquetar segun el perfil del proyecto. Lite genera ZIP. Full genera .exe (NeutralinoJS) + .apk (Capacitor).
> **Modo**: 5 fases secuenciales | **Idioma**: ES | **Contexto**: Repositorio git local con remoto en GitHub
> **Input**: Directorio git local + confirmacion del usuario
> **Output**: Commit + Push + Pages deploy + (Lite) ZIP / (Full) .exe + Release

---

## REGLAS FUNDAMENTALES

1. **NO forzar push** — usar `git push origin <branch>`, nunca `--force` sin autorizacion explicita
2. **NO modificar repositorio remoto directamente** — todo pasa por `git commit` local + `git push`
3. **SI usar GitHub MCP** para operaciones de consulta (verificar commits, status Actions, URL Pages)
4. **SI preguntar mensaje de commit** — nunca hacer commit sin mensaje
5. **NO tocar el action workflow** — ya existe `.github/workflows/deploy-pages.yml`
6. **SI esperar confirmacion** antes de cada fase, a menos que usuario pida modo rapido

---

## FASE 0: DETECCION DE PERFIL

Antes de iniciar, detecta el perfil del proyecto:

1. Revisa `project.config.js` → `APP_CONFIG.perfil` (lite/full)
2. Si no existe, pregunta:
```
📋 ¿Que perfil de deploy usamos?

[1] Lite — ZIP + GitHub Pages
    Empaqueta la app en ZIP para distribucion manual.
    Push a main → GitHub Pages automatico.

[2] Full — NeutralinoJS .exe + Capacitor .apk + Pages + Release
    Compila a ejecutable nativo (.exe, ~2MB) y empaqueta APK Android.
    Ventana nativa + app movil con SQLite FTS5, camara, GPS, notificaciones.
    Push a main → Pages + sube .exe/.apk como Release.

[3] Solo commit + push (sin empaquetar)
```
3. Si perfil=Full, pregunta por el destino:
```
📋 ¿Destino de empaquetado?

[1] .exe (NeutralinoJS) — ventana nativa Windows/Linux/Mac
[2] .apk (Capacitor) — Android nativo (SQLite FTS5, camara, GPS)
[3] Ambos (.exe + .apk)
```
Si se elige .apk o Ambos, verifica requisitos Capacitor:
```
🔍 Verificando requisitos Capacitor...
  node --version: >= 18
  java --version: >= 17
  Android SDK: ¿instalado? [Si/No]
  Si no: "Necesitas Android Studio o command line tools"
```

4. Si perfil=Full y destino incluye .exe, verifica Neutralino CLI:
```
🔍 Verificando Neutralino CLI...
  neu --version: [X.Y.Z]
  ¿neu CLI instalado? [Si/No]
  Si no: "npm install -g @neutralinojs/neu"
```
5. Si perfil=Full y destino incluye .exe, verifica `neutralino.config.json` existe en la raiz del proyecto.
   Si no existe, se genera automaticamente en FASE 4 (usar template).

6. Si destino incluye .apk, verifica `capacitor.config.json` existe.
   Si no existe, se genera automaticamente en FASE 4 (usar template de `capacitor/templates/capacitor.config.json`).

---

## FASE 1: DIAGNOSTICO

```
[▓▓▓░░░░░░░░░░░░░] 25% • Diagnosticando repositorio...
```

### Paso 1.1 — Verificar entorno git
Ejecuta y muestra:
```bash
git status --short
git remote -v
git branch --show-current
git log --oneline -5
```

### Paso 1.2 — Consultar GitHub MCP
Usa `list_commits` con `owner/repo` del remoto para verificar ultimo commit.

### Paso 1.3 — Resumen de diagnostico
```
📋 DIAGNOSTICO — deployment-jigue

Repositorio: [owner/repo]
Rama actual: [branch]
Perfil: [lite|full]
Estado: [limpio / cambios pendientes]
Ultimo commit: [hash] — [mensaje]
Workflow Pages: [detectado / ausente]

📊 Cambios pendientes: [N] archivos

¿Procedo con FASE 2: Commit?
[1] Si, continuar
[2] Modo rapido (todo automatico)
[3] Modo rapido solo push (sin empaquetar)
[4] Cancelar
```

---

## FASE 2: COMMIT

```
[▓▓▓▓▓░░░░░░░░░░░] 50% • Preparando commit...
```

### Paso 2.1 — Generar mensaje de commit
```bash
git diff --stat
```
Reglas: prefix convencional (`feat:`, `fix:`, `refactor:`, `docs:`), max 72 chars.

### Paso 2.2 — Solicitar mensaje (o aceptar sugerido)
```
📝 MENSAJE DE COMMIT

Sugerido: [mensaje generado]

[1] Usar sugerido
[2] Escribir otro mensaje
[3] Cancelar
```

### Paso 2.3 — Ejecutar commit
```bash
git add .
git commit -m "[mensaje]"
```

### Paso 2.4 — Confirmar
```
✅ Commit exitoso: [hash] — [mensaje]
¿Procedo con FASE 3: Push?
[1] Si
[2] Cancelar
```

---

## FASE 3: PUSH

```
[▓▓▓▓▓▓▓░░░░░░░░░] 75% • Subiendo a GitHub...
```

```bash
git push origin [branch]
```

### Manejo de errores comunes:
- `non-fast-forward` → Preguntar: "El remoto tiene commits nuevos. ¿Hacer pull primero?"
- `permission denied` → "Token sin permisos de push. Revisa GITHUB_TOKEN en opencode.json"
- `not a git repository` → "No hay repositorio git. ¿Inicializar con `git init`?"

### Confirmar push:
```
✅ Push exitoso a [branch] en [owner/repo]
Commit: [hash]
URL: https://github.com/[owner]/repo/commit/[hash]
```

---

## FASE 4: EMPAQUETADO (segun perfil)

### Perfil Lite: ZIP

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 85% • Empaquetando ZIP...
```

1. Determinar nombre del ZIP desde `project.config.js` o nombre del directorio.
2. Generar ZIP con:
```
📦 [nombre-app].zip
  ├── index.html
  ├── core/
  ├── modules/
  ├── assets/
  ├── docs/
  ├── GUIA_USUARIO.md (si existe)
  └── project.config.js
```
3. Comando sugerido:
```bash
# Usando PowerShell:
Compress-Archive -Path "index.html", "core", "modules", "assets", "docs" -DestinationPath "dist/[nombre].zip" -Force
```
4. Confirmar:
```
✅ ZIP generado: dist/[nombre-app].zip
Tamaño: [X] MB
¿Procedo con deploy a Pages?
[1] Si
[2] No, ya termine
```

### Perfil Full: NeutralinoJS .exe

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 85% • Compilando .exe con NeutralinoJS...
```

1. Verificar que existe `neutralino.config.json` en la raiz del proyecto:
```bash
if (Test-Path "neutralino.config.json" -PathType Leaf) { "neutralino.config.json encontrado" }
else { "Generando neutralino.config.json desde template..." }
```

2. Si no existe `neutralino.config.json`, usar el template incluido en esta skill
   y adaptarlo al proyecto:
```json
{
  "applicationId": "com.empresa.app",
  "version": "1.0.0",
  "defaultMode": "window",
  "documentRoot": "/public",
  "url": "/",
  "port": 0,
  "enableServer": true,
  "enableNativeAPI": true,
  "nativeWindow": {
    "title": "AppName",
    "icon": "public/favicon.ico",
    "width": 1200,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "fullScreen": false,
    "resizable": true,
    "center": true
  },
  "globalVariables": {
    "APP_NAME": "AppName"
  },
  "modes": {
    "window": { "title": "AppName", "icon": "public/favicon.ico" }
  },
  "cli": {
    "binaryName": "app-name",
    "resourcesPath": "/public/",
    "clientLibrary": "public/core/neutralino.js",
    "binaryVersion": "6.0.0",
    "clientVersion": "6.0.0"
  }
}
```

3. Verificar que `public/core/neutralino.js` existe (cliente Neutralino para el frontend):
   Si no, descargar:
```bash
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js" -OutFile "public/core/neutralino.js"
```

4. Si el proyecto usa icons personalizados, verificar que `public/favicon.ico`
   existe. Si no, usar icono por defecto de Neutralino.

5. Compilar:
```bash
neu build --release
```

6. El binario compilado estara en:
   - `dist/[app-name]-win_x64.zip` (Windows)
   - `dist/[app-name]-linux_x64.zip` (Linux)
   - `dist/[app-name]-mac_x64.zip` / `dist/[app-name]-mac_arm64.zip` (macOS)

7. Extraer el .exe del ZIP para el Release:
```bash
Expand-Archive -Path "dist/[app-name]-win_x64.zip" -DestinationPath "dist/neutralino-out"
```

8. Confirmar:
```
✅ Compilado: dist/[app-name]-win_x64.zip (~2MB runtime + public/)
  El .exe contiene Neutralino runtime (~2MB) + la app completa.
  Ventana nativa, bandeja, notificaciones — sin terminal.

¿Procedo con deploy a Pages + Release?
[1] Si, hacer deploy completo
[2] Solo Pages (sin Release)
[3] Solo .exe (sin deploy)
```

### Perfil Full: Capacitor .apk (si destino incluye .apk)

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 88% • Compilando .apk con Capacitor...
```

1. Verificar que existe `capacitor.config.json` en la raiz del proyecto:
```bash
if (Test-Path "capacitor.config.json" -PathType Leaf) {
  "capacitor.config.json encontrado"
} else {
  "Copiando desde template capacitor..."
  Copy-Item "capacitor/templates/capacitor.config.json" "capacitor.config.json"
}
```

2. Sincronizar codigo web con Android:
```bash
npx cap sync android
```

3. Compilar APK release:
```bash
cd android
.\gradlew assembleRelease
cd ..
```

4. Verificar APK generado:
```bash
if (Test-Path "android/app/build/outputs/apk/release/app-release.apk") {
  "✅ APK generado: android/app/build/outputs/apk/release/app-release.apk"
}
```

5. Reportar:
```
✅ APK generado: android/app/build/outputs/apk/release/app-release.apk
  Plugins: SQLite FTS5 nativo, Camara, GPS, Notificaciones, Compartir
  SDK min: 26 (Android 8), Target: 34 (Android 14)
```

**sql.js (IA Jutia con FTS5):**
Si la app incluye IA Jutia Full con sql.js, verificar que `public/assets/wasm/` contiene:
- `sql-wasm.wasm` — motor SQLite compilado a WASM (~1.3MB)
- `sql-wasm.js` — loader JS para sql.js

Se descargan durante el setup (`/setup`). Si faltan, el modulo `ia-sqlite.js`
hace fallback automatico a Dexie.

**Uso de APIs nativas (opcional):**
Si el proyecto usa el cliente Neutralino en el frontend:
```javascript
// Notificaciones
if (typeof Neutrino !== 'undefined') {
  Neutrino.os.showNotification('Titulo', 'Mensaje');
}

// Bandeja del sistema
Neutrino.os.showTray({
  icon: '/favicon.ico',
  menuItems: [
    { id: 'abrir', text: 'Abrir ventana' },
    { id: 'salir', text: 'Salir' }
  ]
});

// Dialogo de archivos
const files = await Neutrino.filesystem.showOpenDialog({
  filters: [{ name: 'Documentos', extensions: ['pdf', 'docx'] }]
});
```

---

## FASE 5: DEPLOY PAGES

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░] 95% • Desplegando a GitHub Pages...
```

### Paso 5.1 — Verificar Action
Usa GitHub MCP para confirmar que el workflow existe:
```
Action deploy-pages.yml detectado.
El push activo el workflow automaticamente.
```

### Paso 5.2 — Perfil Full: Crear Release (opcional)
Si el usuario eligio Release:
1. Si hay .exe, extraer del ZIP y subir:
```bash
gh release create v[version] "dist/[app-name]-win_x64.zip#App_v[version]_win_x64.zip" --title "v[version]" --notes "Release [fecha]"
```
2. Si hay .apk, subir como asset adicional:
```bash
gh release upload v[version] "android/app/build/outputs/apk/release/app-release.apk#App_v[version].apk"
```

### Paso 5.3 — Reporte final
```
✅ DEPLOY COMPLETADO — deployment-jigue

Resumen:
- Repositorio: [owner/repo]
- Rama: [branch]
- Commit: [hash]
- Push: ✅
- Pages: https://[owner].github.io/[repo]
- Paquete: [dist/[app].zip | dist/[app]-win_x64.zip | android/app/build/outputs/apk/release/app-release.apk]
- Release: [URL del release | No aplica]

📎 URL: https://[owner].github.io/[repo]
```

---

---

## FASE 6: WHITE-LABEL BRANDING (Enterprise)

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░] 97% • Aplicando branding white-label...
```

### Paso 6.1 — Ejecutar script brand.ps1

Usar el template `brand.ps1` incluido en esta skill para aplicar branding
automatico al proyecto:

```powershell
.\deployment-jigue\templates\brand.ps1 -AppName "ClienteApp" -AppId "com.cliente.app" -PrimaryColor "#ff6600" -SecondaryColor "#003366"
```

Parametros del script:
```
-AppName        Nombre de la app (ej: "GestorPro")
-AppId          ID dominio reverso (ej: "com.acme.gestorpro")
-PrimaryColor   Color primario hex (ej: "#ff6600")
-SecondaryColor Color secundario hex (ej: "#003366")
-LogoPath       Ruta a logo PNG/SVG
-OutputDir      Directorio de salida (default: ./dist/branded)
-DryRun         Vista previa sin modificar

Ejemplo:
  .\brand.ps1 -AppName "MiApp" -LogoPath "C:\logos\logo.svg" -DryRun
  .\brand.ps1 -AppName "GestorPro" -AppId "com.acme.gestorpro" -PrimaryColor "#ff6600"
```

### Paso 6.2 — Que modifica brand.ps1

El script busca y reemplaza automaticamente en estos archivos:

| Archivo | Que reemplaza |
|---------|--------------|
| `project.config.js` | `nombreApp`, colores |
| `index.html` / `public/index.html` | `<title>`, meta tags, h1 |
| `neutralino.config.json` | `applicationId`, `nativeWindow.title` |
| `capacitor.config.json` | `appId`, `appName` |
| `package.json` | `name` |
| `manifest.json` / `public/manifest.json` | `name`, `short_name` |
| `core/theme.js` / `public/core/theme.js` | Colores CSS |
| `core/app.js` / `public/core/app.js` | Nombre app en UI |

### Paso 6.3 — Logo personalizado

```powershell
# Copiar logo manualmente (si no se uso -LogoPath en brand.ps1):
Copy-Item "ruta/al/logo.svg" "assets/logo.svg" -Force
Copy-Item "ruta/al/favicon.ico" "favicon.ico" -Force
```

### Paso 6.4 — Regenerar .exe y .apk con branding

Despues de aplicar branding, recompilar:

```powershell
# .exe
neu build --release

# .apk (si aplica)
npx cap sync android
cd android
.\gradlew assembleRelease
cd ..
```

### Paso 6.5 — Verificar branding

```
🔍 VERIFICACION DE BRANDING

[ ] Nombre correcto en titulo de ventana
[ ] Colores coinciden con especificacion del cliente
[ ] Logo visible en la interfaz
[ ] Favicon correcto en pestana del navegador
[ ] .exe muestra nombre correcto en barra de titulo
[ ] .apk muestra nombre correcto en lanzador Android
[ ] project.config.js con datos del cliente
```

---

## FASE 7: ENTREGA ENTERPRISE

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 99% • Preparando entrega Enterprise...
```

### Paso 7.1 — Seleccionar nivel de entrega

```
📋 NIVEL DE ENTREGA

[1] Profesional — .exe + .apk + Pages
    Compilados listos para distribuir.
    Incluye: .exe (~2MB), .apk (~5MB), GitHub Pages URL.

[2] Enterprise — .exe + .apk + codigo fuente + UI personalizada
    Todo lo anterior MAS:
    - Codigo fuente completo
    - UI personalizada segun preferencias del cliente (DESIGN.md)
    - Docs personalizados (manual usuario, instalacion, dev)
    - Script brand.ps1 para que el cliente pueda re-brandear
    - Repositorio privado (opcional)
```

### Paso 7.2 — Enterprise: Generar documentacion

Si nivel Enterprise, generar docs personalizados:

```
📄 DOCUMENTACION ENTERPRISE

### `docs/GUIA_USUARIO.md`
[Manual de usuario con nombre del cliente, capturas, pasos]
- Que es la app
- Como instalarla (.exe / .apk)
- Primeros pasos
- Modulos disponibles
- Respaldo de datos (.ateje-backup)

### `docs/GUIA_INSTALACION.md`
[Instrucciones tecnicas de instalacion]
- Requisitos: Windows 10+, Android 8+, navegador moderno
- Instalacion .exe: doble clic, sin permisos admin
- Instalacion .apk: permitir orígenes desconocidos, abrir archivo
- Web: abrir index.html en cualquier navegador

### `docs/GUIA_DESARROLLO.md`
[Para el equipo tecnico del cliente]
- Estructura del proyecto
- stack: Alpine + Dexie + DaisyUI + CryptoJS
- Como agregar modulos
- Como cambiar colores/tema
- Como compilar .exe / .apk
- Referencia de APIs
```

### Paso 7.3 — Enterprise: Personalizar UI

Si el cliente tiene preferencias de diseño registradas en `.omd/preferences.md`
o `DESIGN.md`, el codigo generado ya deberia reflejarlas (se aplicaron en
fases previas por design-engine). Verificar:

```
🎨 VERIFICACION UI PERSONALIZADA

[ ] Colores corporativos del cliente en toda la UI
[ ] Tipografia preferida (si aplica)
[ ] Logo del cliente en header/menu
[ ] Nombre del cliente en titulos y footer
[ ] Microcopy adaptado al cliente
[ ] Componentes UI consistentes con DESIGN.md
```

### Paso 7.4 — Enterprise: Empaquetar entrega

```powershell
# 1. Ejecutar branding
.\deployment-jigue\templates\brand.ps1 -AppName "ClienteApp" -AppId "com.cliente.app"

# 2. Compilar
neu build --release
npx cap sync android
cd android; .\gradlew assembleRelease; cd ..

# 3. Generar paquete Enterprise
New-Item -ItemType Directory -Path "dist/enterprise" -Force

# .exe + .apk
Copy-Item "dist/ClienteApp-win_x64.zip" "dist/enterprise/"
Copy-Item "android/app/build/outputs/apk/release/app-release.apk" "dist/enterprise/ClienteApp.apk"

# Branding script personalizado
Copy-Item "deployment-jigue/templates/brand.ps1" "dist/enterprise/brand.ps1"

# Docs
Copy-Item "docs/" "dist/enterprise/docs/" -Recurse

# Fuente completa (excluyendo node_modules, .git, dist)
$exclude = @("node_modules", ".git", "dist", "android/.gradle", "android/build")
$source = Get-ChildItem -Path "." -Exclude $exclude
Compress-Archive -Path $source -DestinationPath "dist/enterprise/ClienteApp-source-v1.0.zip" -Force
```

### Paso 7.5 — Enterprise checklist

Usar el template `enterprise-checklist.md` y verificar punto por punto:

```markdown
# Enterprise Delivery Checklist

## 1. Branding aplicado
[ ] Nombre de app reemplazado
[ ] Colores aplicados
[ ] Logo personalizado
[ ] favicon.ico personalizado

## 2. Compilacion verificada
[ ] .exe compila y funciona
[ ] .apk compila y funciona
[ ] Plugins nativos OK

## 3. Documentacion generada
[ ] docs/GUIA_USUARIO.md
[ ] docs/GUIA_INSTALACION.md
[ ] docs/GUIA_DESARROLLO.md

## 4. Assets de entrega
[ ] dist/enterprise/ClienteApp-win_x64.zip (.exe)
[ ] dist/enterprise/ClienteApp.apk
[ ] dist/enterprise/brand.ps1 (script personalizado)
[ ] dist/enterprise/docs/ (documentacion)
[ ] dist/enterprise/ClienteApp-source-v1.0.zip (fuente completa)
```

### Paso 7.6 — Reporte final Enterprise

```
═══════════════════════════════════════════
  ✅ ENTREGA ENTERPRISE COMPLETADA
═══════════════════════════════════════════
  App:        [AppName]
  Cliente:    [Cliente]
  Nivel:      [Profesional / Enterprise]

  📦 Entregables:
    • .exe:  dist/enterprise/[AppName]-win_x64.zip (~2MB)
    • .apk:  dist/enterprise/[AppName].apk (~5MB)
    • Docs:  dist/enterprise/docs/
    • Brand: dist/enterprise/brand.ps1
    • Source: dist/enterprise/[AppName]-source-v1.0.zip

  🌐 Web:    https://[org].github.io/[repo]
  📖 Guia:   docs/GUIA_USUARIO.md
  ✅ Branding: verificado
  🧪 QA:     verificado (validation-engine)
═══════════════════════════════════════════
```

### Paso 7.7 — Archivar spec y reporte

```powershell
# Archivar spec para referencia futura
New-Item -ItemType Directory -Path "specs/archive" -Force
$fecha = Get-Date -Format "yyyy-MM-dd"
Copy-Item "specs/[app].md" "specs/archive/[app]-$fecha.md"
```

---

## MODO RAPIDO

Si el usuario selecciona "Modo rapido" en Fase 1:
```
⚡ MODO RAPIDO ACTIVADO
- Commit: auto-generado desde diff
- Push: inmediato
- Empaquetado: segun perfil (ZIP / .exe / .apk)
- Branding: saltado (usar brand.ps1 despues)
- Deploy: automatico
```
Sin pausas ni confirmaciones intermedias.

---

## REFERENCIAS

- `.github/workflows/deploy-pages.yml` — Action workflow para Pages
- GitHub Pages docs: https://docs.github.com/en/pages
- NeutralinoJS docs: https://neutralino.js.org/docs
- Neutralino CLI: https://neutralino.js.org/docs/cli/neu-cli
- Neutralino config: https://neutralino.js.org/docs/configuration/neutralino-config
- Neutralino APIs: https://neutralino.js.org/docs/api/neu-overview
- `deployment-jigue/templates/brand.ps1` — Script white-label branding
- `deployment-jigue/templates/enterprise-checklist.md` — Enterprise delivery checklist
- `deployment-jigue/templates/neutralino.config.json` — Neutralino config template
- Capacitor docs: https://capacitorjs.com/docs
- Capacitor Android: https://capacitorjs.com/docs/android
