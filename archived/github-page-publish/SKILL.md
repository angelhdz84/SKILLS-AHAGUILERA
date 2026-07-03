---
<!-- Archived — reemplazado por deployment-jigue -->
# @deprecated — Reemplazado por deployment-jigue
# Motivo: Unificado en deployment-jigue que maneja commit + push + empaquetado según perfil
# Migración: Usar `/deploy` que activa deployment-jigue
name: github-page-publish
description: Publica commits a GitHub y despliega a GitHub Pages. 4 fases secuenciales: diagnostico → commit → push → deploy. Modo manual (con confirmaciones) o rapido (todo automatico). Detecta el repositorio remoto, genera mensaje de commit a partir de los cambios, ejecuta git push y verifica que el Action workflow de Pages se complete exitosamente.
license: MIT
compatibility: Requiere GitHub MCP configurado en opencode.json con GITHUB_TOKEN. Repositorio con GitHub Pages habilitado y action deploy-pages.yml existente.
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
  stack: ["git", "github", "github-pages"]
  language: es
  mcp:
    - "github"
---

# SKILL: github-page-publish (Publicacion y Deploy a GitHub Pages)

> **Proposito**: Publicar cambios locales a GitHub y desplegar automaticamente a GitHub Pages.
> **Modo**: 4 fases secuenciales | **Idioma**: ES | **Contexto**: Repositorio git local con remoto en GitHub
> **Input**: Directorio git local + confirmacion del usuario
> **Output**: Commit en GitHub + despliegue a Pages

---

## REGLAS FUNDAMENTALES

1. **NO forzar push** — usar `git push origin <branch>`, nunca `--force` a menos que el usuario lo autorice explicitamente
2. **NO modificar el repositorio remoto directamente** — todo pasa por `git commit` local + `git push`
3. **SI usar GitHub MCP** para operaciones de consulta (verificar commits, status de Actions, URL de Pages)
4. **SI preguntar mensaje de commit** — nunca hacer commit sin mensaje; si el usuario no da uno, generarlo con `git diff --stat`
5. **NO tocar el action workflow** — ya existe `.github/workflows/deploy-pages.yml`
6. **SI esperar confirmacion** antes de cada fase, a menos que el usuario pida modo rapido

## CUANDO ACTIVARSE

El usuario dice frases como:
- "publica los cambios"
- "sube esto a GitHub"
- "haz push y despliega"
- "actualiza la pagina de GitHub"
- "lanza los cambios a produccion"
- "commit y push"
- "deploy a pages"
- "actualiza el repositorio"

---

## FASE 1: DIAGNOSTICO

```
[▓▓▓░░░░░░░░░░░░░] 25% • Diagnosticando repositorio...
(git status + git remote + GitHub MCP)
```

### Paso 1.1 — Verificar entorno git
Ejecuta y muestra al usuario:

```bash
git status --short
git remote -v
git branch --show-current
git log --oneline -5
```

Analiza la salida:
- ¿Hay cambios sin stage? → mostrar archivos modificados
- ¿Hay remoto configurado? → extraer `owner/repo` de la URL
- ¿Rama actual? → confirmar que es la correcta para deploy

### Paso 1.2 — Consultar GitHub MCP
Usa `list_commits` con `owner/repo` del remoto para verificar el ultimo commit en GitHub:

```
¿Commit local coincide con remoto? → push necesario
¿Commit local detras del remoto? → pull necesario primero
```

### Paso 1.3 — Verificar Pages (opcional)
Si el usuario pidio deploy a Pages, consulta:

```bash
git show HEAD:.github/workflows/deploy-pages.yml
```

Si existe el workflow, informar: "Action deploy-pages.yml detectado — el push automatico desencadenara el deploy."

### Paso 1.4 — Resumen de diagnostico

```
📋 DIAGNOSTICO — github-page-publish

Repositorio: [owner/repo]
Rama actual: [branch]
Remoto: [url]
Estado: [limpio / cambios pendientes]
Ultimo commit local: [hash] — [mensaje]
Ultimo commit remoto: [hash] — [mensaje]
Workflow Pages: [detectado / ausente]

📊 Cambios pendientes: [N] archivos

¿Procedo con FASE 2: Commit?
[1] Si, continuar
[2] Modo rapido (todo automatico)
[3] Cancelar
```

---

## FASE 2: COMMIT

```
[▓▓▓▓▓░░░░░░░░░░░] 50% • Preparando commit...
(git diff --stat + mensaje de commit)
```

### Paso 2.1 — Generar mensaje de commit
Si el usuario no dio mensaje, generalo automaticamente segun los cambios:

```bash
git diff --stat
```

Reglas para el mensaje automatico:
- Si hay pocos cambios: usar `git diff --stat` resumido como cuerpo
- Prefix convencional: `feat:` si hay nuevas funcionalidades, `fix:` si son correcciones, `refactor:` si son cambios estructurales, `docs:` si son solo archivos markdown/html
- Maximo 72 caracteres en el titulo

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

Si falla: informar el error y pedir accion correctiva.

### Paso 2.4 — Confirmar

```
✅ Commit exitoso: [hash] — [mensaje]

¿Procedo con FASE 3: Push?
[1] Si, hacer push
[2] Cancelar
```

---

## FASE 3: PUSH

```
[▓▓▓▓▓▓▓░░░░░░░░░] 75% • Subiendo a GitHub...
(git push origin <branch>)
```

### Paso 3.1 — Ejecutar push

```bash
git push origin [branch]
```

### Paso 3.2 — Manejar errores comunes

| Error | Accion |
|-------|--------|
| `non-fast-forward` | Preguntar: "El remoto tiene commits nuevos. ¿Hacer pull primero?" |
| `permission denied` | "Token sin permisos de push. Revisa GITHUB_TOKEN en opencode.json" |
| `not a git repository` | "No hay repositorio git. ¿Inicializar con `git init`?" |

### Paso 3.3 — Confirmar push exitoso

```
✅ Push exitoso a [branch] en [owner/repo]

Commit: [hash]
URL: https://github.com/[owner/repo]/commit/[hash]

¿Procedo con FASE 4: Deploy Pages?
[1] Si, verificar deploy
[2] No, ya termine
```

---

## FASE 4: DEPLOY PAGES

```
[▓▓▓▓▓▓▓▓▓▓▓▓░░░░] 90% • Desplegando a GitHub Pages...
(GitHub Actions + Pages check)
```

### Paso 4.1 — Verificar que el Action se disparo
Usa GitHub MCP con `list_commits` o `get_file_contents` para confirmar que el workflow existe.

Si el workflow existe: "El push activo el workflow `deploy-pages.yml`. Puedes ver el progreso en: https://github.com/[owner/repo]/actions"

### Paso 4.2 — Esperar estado del deploy (opcional)
Si el usuario quiere esperar:

1. Consulta GitHub Actions API cada 15 segundos (max 3 minutos):
   - Usa `list_commits` para verificar que el commit aparecio
   - Informa: "Workflow en ejecucion..." / "Workflow completado"

2. Cuando el deploy termine, muestra la URL de Pages:
   ```
   ✅ DEPLOY COMPLETADO
   URL: https://[owner].github.io/[repo]
   Commit: [hash]
   Tiempo: [X] segundos
   ```

### Paso 4.3 — Reporte final

```
✅ PUBLICACION COMPLETADA — github-page-publish

Resumen:
- Repositorio: [owner/repo]
- Rama: [branch]
- Commit: [hash]
- Push: ✅
- Pages deploy: [URL o "pendiente"]
- Workflow: [deploy-pages.yml] — [exitoso/en progreso]

📎 URL: https://[owner].github.io/[repo]
```

---

## MODO RAPIDO

Si el usuario selecciona "Modo rapido" en Fase 1.4:

```
⚡ MODO RAPIDO ACTIVADO
- Commit: auto-generado desde diff
- Push: inmediato
- Deploy: verificado automaticamente
```

Flujo:
1. Generar mensaje de commit desde `git diff --stat`
2. `git add . && git commit -m "<mensaje>"`
3. `git push origin <branch>`
4. Mostrar resumen final (Fase 4.3)

Sin pausas ni confirmaciones intermedias.

---

## REFERENCIAS

- `@modelcontextprotocol/server-github` — MCP para operaciones GitHub API
- `.github/workflows/deploy-pages.yml` — Action workflow para Pages (creado aparte)
- GitHub Pages docs: https://docs.github.com/en/pages
