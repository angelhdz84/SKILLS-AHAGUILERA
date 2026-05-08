---
name: stack-compliance-guard
description: Guarda de cumplimiento automático: valida que TODO código generado cumpla las reglas de @AGENTS.md antes de mostrarlo al usuario. Bloquea imports, CDNs, fetch y omisión de cifrado. Corrige automáticamente o pide confirmación.
license: MIT
compatibility: Requiere @AGENTS.md presente. Funciona como capa de validación para spec-creator, setup-init y code-generator.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  generatedBy: "stack-compliance-guard skill"
  triggers: ["validar stack", "comprobar reglas", "corregir imports", "verificar cifrado", "file:// compatible"]
  stack: ["offline-first", "no-imports", "file-protocol", "global-variables", "cryptojs", "dexie", "alpine"]
  language: es
  autoActivate: true
---

# 🛡️ SKILL: stack-compliance-guard (Guarda de Cumplimiento Automático)

> **Propósito**: Validar que **cualquier código generado** cumpla estrictamente las reglas de `@AGENTS.md` **antes** de mostrarlo al usuario. Bloquea, corrige o pide confirmación. No es opcional: se ejecuta automáticamente tras cada output de código.
> **Modo**: Validación automática | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md

---

## 🔄 ACTIVACIÓN AUTOMÁTICA
Esta SKILL se ejecuta **siempre** que:
- `spec-creator` genera código de módulos
- `setup-init` genera `index.html` o scripts
- `code-generator` produce bloques de código
- El usuario pide "generar", "corregir" o "crear" cualquier archivo `.js`/`.html`

**Flujo**: Generar código → `stack-compliance-guard` valida → Si FAIL: corregir o preguntar → Si PASS: mostrar al usuario.

---

## 🚫 REGLAS DE BLOQUEO AUTOMÁTICO (CRÍTICAS)

Si detecta cualquiera de estos patrones, **RECHAZA el código** y aplica corrección automática:

### ❌ Regla 1: Imports/ES6 Modules
```javascript
// PATRÓN PROHIBIDO:
import { algo } from './archivo.js';
export default function() {}
<script type="module" src="...">

// CORRECCIÓN AUTOMÁTICA:
// 1. Eliminar import/export
// 2. Usar variable global (ej: Dexie, CryptoJS, Alpine)
// 3. Asegurar que el script se carga vía <script src="assets/js/libs/..."> en index.html

// Ejemplo corregido:
// (Asume que db.js ya expuso window.db globalmente)
const usuarios = await db.usuarios.toArray();
```

### ❌ Regla 2: CDNs o Fetch en Runtime
```html
<!-- PATRÓN PROHIBIDO en HTML: -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@...">
<script src="https://unpkg.com/alpinejs@..."></script>

// PATRÓN PROHIBIDO en JS:
fetch('/api/datos');
axios.get('https://...');
XMLHttpRequest();

// CORRECCIÓN AUTOMÁTICA:
// 1. Reemplazar CDN por ruta local: `assets/css/tailwind.min.css`
// 2. Eliminar fetch/axios: usar Dexie para datos locales
// 3. Si se requiere dato externo: documentar que NO es compatible con offline-first
```

### ❌ Regla 3: Omisión de Cifrado en Campos Sensibles
```javascript
// PATRÓN PROHIBIDO (si el campo está en CAMPOS_SENSIBLES):
const paciente = {
  nombre: inputNombre.value,  // ← SIN CIFRAR
  email: inputEmail.value     // ← SIN CIFRAR
};
await db.pacientes.put(paciente);

// CORRECCIÓN AUTOMÁTICA:
const paciente = {
  nombre: cryptoHelpers.encrypt(inputNombre.value),
  email: cryptoHelpers.encrypt(inputEmail.value)
};
await db.pacientes.put(paciente);
```

### ❌ Regla 4: UI sin DaisyUI/Icons/Animate.css
```html
<!-- PATRÓN SUBÓPTIMO: -->
<button style="background:blue;color:white;padding:10px">Guardar</button>

<!-- CORRECCIÓN AUTOMÁTICA: -->
<button class="btn btn-primary">
  <i class="bi bi-check-lg"></i> Guardar
</button>
```

### ❌ Regla 5: Módulo no Registrable en project.config.js
```javascript
// PATRÓN PROHIBIDO:
// Módulo creado pero no listado en APP_CONFIG.modulosActivos

// CORRECCIÓN AUTOMÁTICA:
// 1. Añadir snippet al final del output:
/*
📝 Para activar este módulo, añade en project.config.js:
modulosActivos: [...existentes, 'nuevo-modulo']
*/
```

---

## ✅ CHECKLIST DE VALIDACIÓN (Ejecutar en cada output)

Antes de mostrar código al usuario, verificar:
```
🔍 STACK COMPLIANCE CHECK
[ ] ¿Contiene `import` / `export` / `type="module"`? → ❌ RECHAZAR
[ ] ¿Usa `<link href="http` o `<script src="http`? → ❌ RECHAZAR
[ ] ¿Contiene `fetch(` / `axios.` / `XMLHttpRequest`? → ❌ RECHAZAR
[ ] ¿Campos sensibles sin `cryptoHelpers.encrypt()`? → ❌ RECHAZAR
[ ] ¿UI sin clases DaisyUI o iconos Bootstrap Icons? → ⚠️ SUGERIR corrección
[ ] ¿Módulo no registrable en project.config.js? → ⚠️ AÑADIR snippet
[ ] ¿Rutas absolutas o `../` que rompen file://? → ❌ RECHAZAR
[ ] ¿Orden de scripts en index.html incorrecto? → ❌ RECHAZAR

✅ Si todo PASS: mostrar código al usuario.
⚠️ Si hay warnings: mostrar código + nota de mejora.
❌ Si hay FAILs: corregir automáticamente o preguntar: "¿Aplico corrección [X]?"
```

---

## 💬 FORMATO DE MENSAJES AL USUARIO

### Cuando corrige automáticamente:
```
🛡️ Stack Compliance: Corregido automáticamente
- ❌ import db from './db.js' → ✅ Usando variable global window.db
- ❌ email sin cifrar → ✅ Añadido cryptoHelpers.encrypt(email)
- ❌ botón sin icono → ✅ Añadido <i class="bi bi-check"></i>

✅ Código validado y listo para usar.
```

### Cuando requiere confirmación:
```
🛡️ Stack Compliance: Requiere confirmación

Se detectó: `fetch('/api/backup')` en modules/settings/module.js
❌ Esto viola la regla offline-first (no funciona con file://).

Opciones:
[1] Eliminar fetch y usar solo IndexedDB + exportación local (RECOMENDADO)
[2] Mantener fetch pero documentar que requiere servidor (NO offline)
[3] Otra → (especifica alternativa offline)

Tu respuesta: 
```

### Cuando todo está bien:
```
🛡️ Stack Compliance: ✅ 12/12 checks passed
- Sin imports/ES6
- Rutas relativas 100%
- Cifrado aplicado en 3 campos sensibles
- UI con DaisyUI + Bootstrap Icons + Animate.css
- Módulo registrable en project.config.js

✅ Código listo para producción offline.
```

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

### En `spec-creator.md`:
- Tras generar cada módulo, ejecutar mentalmente `stack-compliance-guard` antes de mostrar output.
- Si hay correcciones, aplicarlas silenciosamente y añadir nota al final: `🛡️ Ajustado a reglas offline-first`.

### En `setup-init.md`:
- Validar que `index.html` generado cumple:
  - Orden de scripts: CSS → Libs → Core → Modules → Main
  - Sin `type="module"`, sin CDNs
  - `x-cloak` presente para evitar FOUC

### En `validation-offline.md`:
- Añadir como Fase 0 automática:
  ```
  [▓░░░░░░░░░░░░░░░░░] 5% • Stack Compliance
  🛡️ Ejecutando validación contra @AGENTS.md...
  → 12/12 checks passed (o lista de correcciones aplicadas)
  ```

---

## 📝 NOTAS PARA LA IA
- **Auto-activación**: Esta SKILL no requiere trigger explícito. Se ejecuta tras cualquier generación de código.
- **Corrección silenciosa**: Si la corrección es obvia y no ambigua (ej: añadir `encrypt()`), aplica sin preguntar.
- **Preguntar solo si ambiguo**: Si hay múltiples formas de corregir (ej: reemplazar fetch), pide confirmación con opciones.
- **Mantén el contexto**: Si corriges un archivo, menciona qué otros archivos podrían verse afectados.
- **Idioma**: Todos los mensajes al usuario en español técnico pero claro.

✨ **SKILL ready. Se activa automáticamente. No requiere trigger.**
```

---

