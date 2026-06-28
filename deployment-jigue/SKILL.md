---
name: deployment-jigue
description: Publica cambios a GitHub, despliega GitHub Pages y empaqueta segun perfil. Lite: ZIP + Pages. Professional: Neutralino .exe + Fixed WV2. Business: .exe + .apk (Capacitor) + branding + docs.
license: MIT
compatibility: Requiere GitHub MCP configurado en opencode.json con GITHUB_TOKEN. Repositorio con GitHub Pages habilitado y action deploy-pages.yml existente. Perfil Professional/Business requiere @neutralinojs/neu CLI.
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
  perfiles: [lite, professional, business]
  language: es
  mcp:
    - "github"
---

# SKILL: deployment-jigue (Publicacion + Deploy + Empaquetado)

> **Proposito**: Publicar cambios locales a GitHub, desplegar a GitHub Pages y empaquetar segun el perfil del proyecto. Lite genera ZIP+Pages. Professional genera .exe (Neutralino) + Fixed WV2. Business genera .exe + .apk (Capacitor) + branding + docs.
> **Modo**: 5 fases secuenciales | **Idioma**: ES | **Contexto**: Repositorio git local con remoto en GitHub
> **Input**: Directorio git local + confirmacion del usuario
> **Output**: Commit + Push + Pages deploy + (Essential) ZIP+Pages / (Professional) .exe+FixedWV2 / (Business) .exe+.apk+branding+docs

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

1. Revisa `project.config.js` → `APP_CONFIG.perfil` (lite/professional/business)
2. Si no existe, pregunta:
```
📋 ¿Que perfil de deploy usamos?

[1] Essential (Lite) — ZIP + GitHub Pages
    Demo online, HTML visible, IA Lite (FlexSearch).
    Push a main → GitHub Pages automatico.

[2] Professional — .exe + Fixed WebView2
    Ejecutable nativo SIN WebView2 del sistema.
    Incluye Fixed WebView2 (stripped, x64 + espanol).
    IA Full (FlexSearch + QA con documentos).
    Sin HTML visible para el cliente.
    Tamaño: ~30MB ZIP. NO incluye .apk.

[3] Business — .exe + .apk + branding
    Todo lo de Professional + .apk Android (Capacitor).
    Branding personalizado (logo, colores, nombre cliente).
    Documentacion personalizada (GUIA_USUARIO, GUIA_INSTALACION).
    Tamaño: ~35MB ZIP.

[4] Solo commit + push (sin empaquetar)
```
3. Si perfil=Professional, verifica:
```
🔍 Verificando requisitos Professional...

  neu --version: [X.Y.Z]
  ¿neu CLI instalado? [Si/No]
  Si no: "npm install -g @neutralinojs/neu"

  ¿tools/WebView2-Fixed/ existe? [Si/No]
  Si no: ".\.scripts\download-fixed-wv2.ps1"

  neutralino.config.json: [Si/No]
  Si no: se genera en FASE 4
```
4. Si perfil=Business, verifica todo lo de Professional + Capacitor:
```
🔍 Verificando requisitos Business...

  neu --version: [X.Y.Z]
  tools/WebView2-Fixed/: [Si/No]
  neutralino.config.json: [Si/No]

  node --version: >= 18
  java --version: >= 17
  Android SDK: ¿instalado? [Si/No]
  Si no: "Necesitas Android Studio o command line tools"

  capacitor.config.json: [Si/No]
  Si no: se genera en FASE 4
```

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
Perfil: [lite|professional|business]
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

### Perfil Professional: Neutralino .exe + Fixed WebView2 (stripped)

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 85% • Empaquetando Professional...
```

1. Verificar que existe `neutralino.config.json` en la raiz del proyecto:
   Si no, generar desde `deployment-jigue/templates/neutralino.config.json`

2. Verificar que `core/neutralino.js` existe. Si no, descargar:
```bash
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js" -OutFile "core/neutralino.js"
```

3. Verificar que `tools/WebView2-Fixed/` existe:
   Si no, ejecutar `.\scripts\download-fixed-wv2.ps1`

4. Ejecutar script de empaquetado:
```bash
.\deployment-jigue\templates\package-professional.ps1 -AppName "[nombre]" -Version "[version]"
```

5. Output:
```
✅ dist/[AppName]-Professional-v1.0.0.zip (~30MB)
  ├── [AppName].exe          ← Neutralino runtime (~2MB)
  ├── resources.neu          ← App ofuscada (terser --mangle)
  ├── WebView2/              ← Fixed Version stripped (~53MB)
  │   └── EBWebView/x64/     ← Solo x64 + es-419.pak + swiftshader (WebGPU)
  └── favicon.ico

  Sin HTML visible, sin WebView2 del sistema, IA Full funcional.
```

### Perfil Business: .exe + .apk + branding + docs

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 85% • Empaquetando Business...
```

1. Asegurar que branding esta definido en `project.config.js`:
   - `whiteLabel.cliente`, `whiteLabel.colores`, `whiteLabel.logo`

2. Ejecutar script de empaquetado Business:
```bash
.\deployment-jigue\templates\package-business.ps1 -AppName "[nombre]" -Cliente "[cliente]" -Version "[version]"
```

3. Output:
```
✅ dist/[AppName]-Business-v1.0.0.zip (~35MB)
  ├── [AppName].exe          ← Neutralino runtime
  ├── resources.neu          ← App ofuscada
  ├── WebView2/              ← Fixed Version stripped
  ├── [AppName].apk          ← Android nativo (Capacitor)
  ├── docs/
  │   ├── GUIA_USUARIO.md
  │   └── GUIA_INSTALACION.md
  ├── favicon.ico
  └── LEEME.txt

  Branding personalizado: colores, logo y nombre del cliente aplicados.
```

**Nota:** El build de .apk requiere Android SDK + JDK 17+. Si no estan disponibles, el script salta el .apk y continua solo con .exe.

**sql.js (IA Jutia con FTS5):**
Si la app incluye IA Jutia Full con sql.js, verificar que `assets/wasm/` contiene:
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

## FASE 5: DEPLOY / ENTREGA

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░] 95% • Preparando entrega...
```

### Perfil Essential (Lite): Deploy a GitHub Pages

1. Verificar Action con GitHub MCP:
```
Action deploy-pages.yml detectado.
El push activo el workflow automaticamente.
```

2. Reporte:
```
✅ DEPLOY COMPLETADO
📎 Pages: https://[owner].github.io/[repo]
📦 ZIP: dist/[app]-Essential-v[version].zip
```

### Perfil Professional: Entrega local

La app se entrega al cliente como ZIP via USB/email/WhatsApp.
NO se despliega a GitHub Pages (no hay HTML publico).

```
✅ ENTREGA PROFESIONAL COMPLETADA
📦 dist/[AppName]-Professional-v[version].zip (~30MB)
  Entregar al cliente por: USB | Email | WhatsApp | Link privado
```

### Perfil Business: Entrega local + Release (opcional)

1. Si se desea, crear Release en GitHub:
```bash
gh release create v[version] "dist/[AppName]-Business-v[version].zip#App_v[version]_Business.zip" --title "v[version] - Business" --notes "Entrega $cliente"
```

2. Reporte:
```
✅ ENTREGA BUSINESS COMPLETADA
📦 dist/[AppName]-Business-v[version].zip (~35MB)
  Contiene: .exe + .apk + branding + docs
  Cliente personalizado
📎 Release: [URL del release | No aplica]
```

---

---

## FASE 6: WHITE-LABEL BRANDING (Business)

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
| `index.html` | `<title>`, meta tags, h1 |
| `neutralino.config.json` | `applicationId`, `nativeWindow.title` |
| `capacitor.config.json` | `appId`, `appName` |
| `package.json` | `name` |
| `manifest.json` | `name`, `short_name` |
| `core/theme.js` | Colores CSS |
| `core/app.js` | Nombre app en UI |

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

## FASE 7: BUSINESS — PERSONALIZACION Y ENTREGA

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 99% • Preparando entrega Business...
```

### Paso 7.1 — Personalizar UI

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

### Paso 7.2 — Empaquetar entrega Business

Ejecutar `package-business.ps1` con los parametros del cliente:

```powershell
.\deployment-jigue\templates\package-business.ps1 `
    -AppName "MiApp" `
    -Cliente "Acme Corp" `
    -Version "1.0.0" `
    -PrimaryColor "#ff6600" `
    -SecondaryColor "#003366" `
    -LogoPath "C:\clientes\acme\logo.svg"
```

Si no se requiere .apk, usar flag:
```powershell
    -SkipApk
```

### Paso 7.3 — Business checklist

```markdown
# Business Delivery Checklist

## 1. Branding aplicado
[ ] Nombre de app reemplazado en toda la UI
[ ] Colores corporativos aplicados
[ ] Logo personalizado visible
[ ] favicon.ico personalizado
[ ] neutralino.config.json con nombre correcto

## 2. Compilacion verificada
[ ] .exe compila con `package-professional.ps1`
[ ] .apk compila con `npx cap sync android && gradlew assembleRelease`
[ ] IA Jutia Full funcional (WebGPU + Workers)
[ ] Plugins nativos OK (si aplica)

## 3. Documentacion generada
[ ] docs/GUIA_USUARIO.md (con nombre del cliente)
[ ] docs/GUIA_INSTALACION.md

## 4. Assets de entrega
[ ] dist/[AppName]-Business-v[version].zip
[ ] .exe + Fixed WebView2 incluido
[ ] .apk incluido (si aplica)
[ ] Documentacion incluida
```

### Paso 7.4 — Reporte final Business

```
╔═══════════════════════════════════════════╗
  ✅ ENTREGA BUSINESS COMPLETADA
╚═══════════════════════════════════════════╝
  App:        [AppName]
  Cliente:    [Cliente]
  Version:    [version]

  📦 Entregable:
    dist/[AppName]-Business-v[version].zip (~35MB)
    • [AppName].exe + resources.neu (ofuscado)
    • WebView2/ (fixed, stripped, con swiftshader)
    • [AppName].apk (Android)
    • docs/GUIA_USUARIO.md
    • docs/GUIA_INSTALACION.md

  🎨 Branding: verificado (logo, colores, nombre)
  🧪 QA: verificado (validation-engine)
╚═══════════════════════════════════════════╝
```

### Paso 7.5 — Archivar spec y reporte

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
- Essential: Commit + Push + Pages deploy
- Professional: Commit + Push + package-professional.ps1
- Business: Commit + Push + package-business.ps1 (branding desde config)
```

---

## REFERENCIAS

- `.github/workflows/deploy-pages.yml` — Action workflow para Pages
- GitHub Pages docs: https://docs.github.com/en/pages
- NeutralinoJS docs: https://neutralino.js.org/docs
- Neutralino CLI: https://neutralino.js.org/docs/cli/neu-cli
- Neutralino config: https://neutralino.js.org/docs/configuration/neutralino-config
- Neutralino APIs: https://neutralino.js.org/docs/api/neu-overview
- `deployment-jigue/templates/brand.ps1` — Script white-label branding
- `deployment-jigue/templates/clean-webview2.ps1` — Reduce Fixed WebView2 a minimo
- `deployment-jigue/templates/package-professional.ps1` — Empaquetado Professional
- `deployment-jigue/templates/package-business.ps1` — Empaquetado Business
- `deployment-jigue/templates/neutralino.config.json` — Neutralino config template
- `scripts/download-fixed-wv2.ps1` — Descarga Fixed Version WebView2
- Capacitor docs: https://capacitorjs.com/docs
- Capacitor Android: https://capacitorjs.com/docs/android
