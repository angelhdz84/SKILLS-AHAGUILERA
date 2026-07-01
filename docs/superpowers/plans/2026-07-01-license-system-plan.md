# Plan de Implementación — Sistema de Licencias

> **Para workers automáticos:** SUB-SKILL REQUERIDA: Usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Objetivo:** Implementar el Sistema de Licencias AHA: generación de par RSA, CLI de archivos `.aha`, flag de entorno, módulo de verificación de licencias, integración en pipeline y comando `/licencia`.

**Arquitectura:** Dos scripts Node.js para generación de llaves/licencias + dos módulos JS inyectados en cada app generada (`env.js` al inicio, `license.js` después de config). El flag `env.js` controla si los checks de licencia están activos. Orden de carga actualizado en `code-generator/SKILL.md`.

**Stack técnico:** Node.js crypto (RSA 2048 + AES-256-CBC), Alpine.js (config en runtime), Dexie (límites condicionales por plan), templates de code-generator, comandos slash de OpenCode

---

### Tarea 1: `scripts/generate-keypair.js`

**Archivos:**
- Crear: `scripts/generate-keypair.js`
- Crear: `keys/.gitkeep`
- Modificar: `.gitignore`

- [ ] **Paso 1: Crear `scripts/generate-keypair.js`**

```javascript
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const keysDir = path.join(__dirname, '..', 'keys')
if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true })

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
})

fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey)
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey)

console.log('RSA key pair generated')
console.log('  Private: keys/private.pem  <- GUARDAR, NO COMPARTIR')
console.log('  Public:  keys/public.pem   <- Se embebe en las apps')
```

- [ ] **Paso 2: Crear `keys/.gitkeep`**

Archivo vacío para que el directorio `keys/` exista.

- [ ] **Paso 3: Agregar `keys/private.pem` al `.gitignore`**

Agregar al `.gitignore`:

```
# License system - private key (never version)
keys/private.pem
```

- [ ] **Paso 4: Ejecutar y verificar**

Ejecutar: `node scripts/generate-keypair.js`

Salida esperada con el par RSA generado. Verificar archivos: `Test-Path keys/private.pem` y `Test-Path keys/public.pem`

- [ ] **Paso 5: Commit**

```bash
git add scripts/generate-keypair.js keys/.gitkeep .gitignore
git commit -m "feat(license): add RSA keypair generator script"
```

---

### Tarea 2: `scripts/license.js`

**Archivos:**
- Crear: `scripts/license.js`

- [ ] **Paso 1: Crear `scripts/license.js`**

Herramienta CLI completa. Script Node.js que:
1. Parsea `--plan`, `--apps`, `--customer`, `--business`, `--phone`, `--email`, `--out`, `--compat`
2. Lee `keys/private.pem`
3. Genera ID de licencia: `AHA-P5-20260701-0549`
4. Construye payload JSON con datos del cliente + apps
5. Firma RSA el JSON
6. Encripta AES-256-CBC el JSON
7. Escribe archivo `.aha` (formato: `ivB64.encryptedB64.signatureB64`)
8. Actualiza `licencias/historial.csv`

Secciones clave del código:

```javascript
// Generación de ID de licencia
const ts = now()
const licenseId = `AHA-${planInitial}${appCount}-${ts.date}-${ts.time}`

// Firmar
const signer = crypto.createSign('sha256')
signer.update(payloadStr)
const signature = signer.sign(privateKey, 'base64')

// Encriptar
const aesKey = crypto.createHash('sha256').update('aha-license-system-v1').digest()
const iv = crypto.randomBytes(16)
const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv)
let encrypted = cipher.update(payloadStr, 'utf8', 'base64')
encrypted += cipher.final('base64')

// .aha final
const ahaContent = `${iv.toString('base64')}.${encrypted}.${signature}`
```

- [ ] **Paso 2: Ejecutar y verificar**

Ejecutar: `node scripts/license.js generate --plan P --apps "aha-pos,aha-inventario" --customer "Juan Perez Lopez" --business "Ferreteria El Clavo" --phone "+52 555 123 4567" --email "juan@elclavo.com"`

Verificar que el archivo `.aha` es ilegible (basura base64).

- [ ] **Paso 3: Commit**

```bash
git add scripts/license.js
git commit -m "feat(license): add AHA license generator CLI"
```

---

### Tarea 3: `code-generator/templates/core/env.js`

**Archivos:**
- Crear: `code-generator/templates/core/env.js`

- [ ] **Paso 1: Crear `code-generator/templates/core/env.js`**

```javascript
// env.js - Environment flag for license system
// Cambiar a 'production' al compilar para distribuir al cliente
const ENV = 'development'
// const ENV = 'production'
```

Este debe ser el PRIMER script cargado en index.html (antes que project.config.js).

- [ ] **Paso 2: Commit**

```bash
git add code-generator/templates/core/env.js
git commit -m "feat(license): add env.js template for dev/prod flag"
```

---

### Tarea 4: `code-generator/templates/core/license.js`

**Archivos:**
- Crear: `code-generator/templates/core/license.js`

- [ ] **Paso 1: Crear `code-generator/templates/core/license.js`**

Módulo central con estas responsabilidades:

1. **Modo desarrollo:** Si `ENV === 'development'`, desbloquear todo (Enterprise)
2. **Escaneo de licencia:** Al iniciar, buscar archivos `.aha` en el directorio de la app
3. **Verificación:** Verificar firma RSA + descifrar AES
4. **Caché:** Guardar licencia validada en Dexie para siguientes aperturas
5. **API:** Exponer `window.cargarLicencia(contenido)` para carga manual en Ajustes
6. **Configs de plan:** Mapear nombre de plan a feature flags en `window.APP_CONFIG`

La constante `PUBLIC_KEY_PEM` al final es un placeholder. El code-generator la reemplaza con el contenido real de `keys/public.pem` al momento de generar la app.

- [ ] **Paso 2: Commit**

```bash
git add code-generator/templates/core/license.js
git commit -m "feat(license): add license verification core module"
```

---

### Tarea 5: Actualizar orden de carga en code-generator SKILL.md

**Archivos:**
- Modificar: `code-generator/SKILL.md`

- [ ] **Paso 1: Actualizar orden de carga en SKILL.md**

Insertar `env.js` como primer script y `license.js` después de `project.config.js`:

```
<!-- env.js primero -->
<script src="core/env.js"></script>

<!-- project.config.js -->
<script src="project.config.js"></script>

<!-- Core -->
<script src="core/license.js"></script>
<script src="core/db.js"></script>
...
```

- [ ] **Paso 2: Commit**

```bash
git add code-generator/SKILL.md
git commit -m "feat(license): add env.js and license.js to script loading order"
```

---

### Tarea 6: Agregar comando `/licencia`

**Archivos:**
- Modificar: `AGENTS.md`
- Crear: `.opencode/commands/licencia.md`

- [ ] **Paso 1: Agregar fila a la tabla de comandos en AGENTS.md**

| `/licencia` | `generar licencia`, `crear licencia` | `scripts/license.js` — CLI interactivo que genera archivos `.aha` firmados. Pregunta plan, apps, cliente y guarda en `licencias/[fecha]/`. Soporta una app o kits completos. |

- [ ] **Paso 2: Crear `.opencode/commands/licencia.md`**

Archivo de metadatos del comando OpenCode para `/licencia`.

- [ ] **Paso 3: Commit**

```bash
git add AGENTS.md .opencode/commands/licencia.md
git commit -m "feat(license): add /licencia command for license generation"
```

---

### Tarea 7: Actualizar template de project.config.js con app.id y plan

**Archivos:**
- Modificar: `code-generator/SKILL.md`

- [ ] **Paso 1: Actualizar template de project.config.js**

Agregar los campos `app.id` (único por app, ej. `aha-pos`), `env` (development/production) y `plan` (lite/profesional/enterprise) al template de `window.APP_CONFIG` en SKILL.md.

- [ ] **Paso 2: Commit**

```bash
git add code-generator/SKILL.md
git commit -m "feat(license): add app.id, env and plan fields to project.config.js"
```

---

### Lista de verificación (auto-revisión)

- [ ] `scripts/generate-keypair.js` produce llaves RSA válidas
- [ ] `scripts/license.js` genera archivo `.aha` (ilegible, basura base64)
- [ ] `keys/private.pem` está en `.gitignore`
- [ ] `code-generator/SKILL.md` orden de carga: env.js primero, license.js después de config
- [ ] AGENTS.md tiene la fila del comando `/licencia`
- [ ] Sin placeholders TODOs en archivos nuevos
