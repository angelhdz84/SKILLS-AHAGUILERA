---
name: deployment-jigue
description: Publica cambios a GitHub, despliega GitHub Pages y empaqueta segun perfil. Lite: ZIP + Pages. Full: bun build --compile .exe + Pages + Release.
license: MIT
compatibility: Requiere GitHub MCP configurado en opencode.json con GITHUB_TOKEN. Repositorio con GitHub Pages habilitado y action deploy-pages.yml existente. Perfil Full requiere Bun >=1.2.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
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
  stack: ["git", "github", "github-pages", "bun"]
  perfiles: [lite, full]
  language: es
  mcp:
    - "github"
---

# SKILL: deployment-jigue (Publicacion + Deploy + Empaquetado)

> **Proposito**: Publicar cambios locales a GitHub, desplegar a GitHub Pages y empaquetar segun el perfil del proyecto. Lite genera ZIP. Full compila a .exe con Bun.
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

[2] Full — Bun --compile .exe + GitHub Pages + Release
    Compila a ejecutable con Bun.
    Push a main → Pages + sube .exe como Release.

[3] Solo commit + push (sin empaquetar)
```
3. Si perfil=Full, verifica Bun:
```
🔍 Verificando Bun...
  bun --version: [X.Y.Z]
  ¿Bun instalado? [Si/No]
  Si no: "Instala Bun desde https://bun.sh (powershell -c "irm bun.sh/install.ps1|iex")"
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

### Perfil Full: Bun --compile

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 85% • Compilando .exe con Bun...
```

1. Verificar que existe `src/index.js` o `servidor.ts`:
```bash
if (Test-Path "src/index.js" -PathType Leaf) { "Entry point encontrado" }
else { "Creando entry point basico..." }
```

2. Si no existe entry point, generar:
```javascript
// src/index.js — Entry point para Bun --compile
import { serve } from 'bun';
import { join } from 'path';

const port = process.env.PORT || 3000;

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    try {
      const file = Bun.file(join(import.meta.dir, '../public', path));
      return new Response(file);
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  }
});

console.log(`🚀 Servidor en http://localhost:${port}`);
```

3. Compilar:
```bash
bun build --compile ./src/index.js --outfile dist/[nombre-app].exe
```

4. Confirmar:
```
✅ Compilado: dist/[nombre-app].exe
Tamaño: [~50] MB

¿Procedo con deploy a Pages + Release?
[1] Si, hacer deploy completo
[2] Solo Pages (sin Release)
[3] Solo .exe (sin deploy)
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
Si el usuario eligio Release y hay .exe:
1. Usar `github_create_release` o sugerir:
```bash
gh release create v[version] dist/[app].exe --title "v[version]" --notes "Release [fecha]"
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
- Paquete: [dist/[app].zip | dist/[app].exe]
- Release: [URL del release | No aplica]

📎 URL: https://[owner].github.io/[repo]
```

---

## MODO RAPIDO

Si el usuario selecciona "Modo rapido" en Fase 1:
```
⚡ MODO RAPIDO ACTIVADO
- Commit: auto-generado desde diff
- Push: inmediato
- Empaquetado: segun perfil (ZIP / .exe)
- Deploy: automatico
```
Sin pausas ni confirmaciones intermedias.

---

## REFERENCIAS

- `.github/workflows/deploy-pages.yml` — Action workflow para Pages
- GitHub Pages docs: https://docs.github.com/en/pages
- Bun build docs: https://bun.sh/docs/bundler
- Bun --compile: https://bun.sh/docs/bundler/executables
