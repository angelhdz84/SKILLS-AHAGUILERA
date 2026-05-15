---
name: stack-compliance-guard
description: Guarda de cumplimiento automático: valida que TODO código generado cumpla las reglas de @AGENTS.md antes de mostrarlo al usuario. Bloquea imports, CDNs, fetch y omisión de cifrado. Verifica que librerías adicionales se carguen localmente (assets/) y no vía CDN.
license: MIT
compatibility: Requiere @AGENTS.md presente. Funciona como capa de validación para spec-creator, setup-init y code-generator.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "2.3"
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

// PATRÓN PROHIBIDO en componentes Pines:
<!-- <script src="//unpkg.com/alpinejs" defer></script> (debe cargarse desde assets/) -->
<!-- <img src="https://cdn.devdojo.com/..." /> (reemplazar por SVG inline o local) -->

// CORRECCIÓN AUTOMÁTICA:
// 1. Reemplazar CDN por ruta local: `assets/css/tailwind.min.css`
// 2. Eliminar fetch/axios: usar Dexie para datos locales
// 3. Si se requiere dato externo: documentar que NO es compatible con offline-first
// 4. En componentes Pines: Alpine.js debe cargarse desde assets/, no desde CDN
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

### ❌ Regla 4.5: Omisión de Privacidad (Privacy by Design)
```javascript
// PATRÓN PROHIBIDO: Recolectar datos sin necesidad
const usuario = {
  nombre: inputNombre.value,
  email: inputEmail.value,
  telefono: inputTelefono.value,     // ¿Realmente necesario?
  direccion: inputDireccion.value,   // ¿Realmente necesario?
  fechaNacimiento: inputFecha.value  // ¿Realmente necesario?
};

// CORRECCIÓN AUTOMÁTICA:
// 1. Revisar spec: ¿estos campos están definidos como requeridos?
// 2. Si no están en la spec, preguntar: "¿Este campo es necesario para la funcionalidad?"
// 3. Marcar visibilidad: datos obligatorios vs opcionales en UI
const usuario = {};
if (inputNombre.value) usuario.nombre = cryptoHelpers.encrypt(inputNombre.value);
if (inputEmail.value) usuario.email = cryptoHelpers.encrypt(inputEmail.value);
// Solo guardar lo declarado en spec
```

### ❌ Regla 4.6: Sin consentimiento local antes de guardar datos
```javascript
// PATRÓN PROHIBIDO: Guardar datos sin preguntar al usuario
// En una app médica o con datos personales:
db.pacientes.put(paciente);  // Sin consentimiento

// CORRECCIÓN AUTOMÁTICA:
// 1. Mostrar aviso de privacidad antes del primer guardado
// 2. Guardar preferencia de consentimiento en localStorage
// 3. No cifrar si el usuario no consintió

if (!localStorage.getItem('consentimiento_privacidad')) {
  UI.confirm(
    '📋 Aviso de Privacidad',
    'Los datos se guardan localmente en tu dispositivo. ' +
    'Ningún dato se envía a servidores externos. ¿Aceptas?',
    (acepta) => {
      if (acepta) {
        localStorage.setItem('consentimiento_privacidad', 'true');
        // proceder con guardado
      }
    }
  );
}
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

### ❌ Regla 6: Librerías Adicionales mal referenciadas

---

### ❌ Regla 7: Anti-patrones de Diseño (De pbakaus/impeccable)

Detecta y corrige patrones que hacen que una interfaz se vea "genérica" o "hecha por IA". 27 reglas determinísticas:

```html
<!-- PATRÓN PROHIBIDO 7.1: Side-stripe borders -->
<div class="border-l-4 border-primary">...</div>
<!-- CORRECCIÓN: Usar fondo tintado, icono leading, o borde completo -->

<!-- PATRÓN PROHIBIDO 7.2: Gradient text -->
<span class="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">...</span>
<!-- CORRECCIÓN: Usar color sólido. Énfasis vía weight o tamaño -->

<!-- PATRÓN PROHIBIDO 7.3: Glassmorphism decorativo -->
<div class="backdrop-blur-xl bg-white/10">...</div>
<!-- CORRECCIÓN: Solo usar si cumple propósito funcional (overlay, nav fijo) -->

<!-- PATRÓN PROHIBIDO 7.4: Hero-metric template -->
<!-- Big number + small label + supporting stats + gradient accent -->
<section><span class="text-5xl font-bold">99%</span><p>Satisfacción</p></section>
<!-- CORRECCIÓN: Reemplazar con contenido real, testimonios, o datos contextuales -->

<!-- PATRÓN PROHIBIDO 7.5: Card grids idénticos -->
<!-- Misma tarjeta (icon + heading + text) repetida 3-6 veces -->
<!-- CORRECCIÓN: Variar layouts, mezclar tipos de contenido -->

<!-- PATRÓN PROHIBIDO 7.6: Modal como primera opción -->
<!-- CORRECCIÓN: Agotar alternativas inline/progresivas antes de modal -->

<!-- PATRÓN PROHIBIDO 7.7: Cards anidadas -->
<div class="card"><div class="card">...</div></div>
<!-- CORRECCIÓN: Extraer contenido anidado a su propia sección -->

<!-- PATRÓN PROHIBIDO 7.8: Gray text sobre fondo de color -->
<span class="text-gray-500 bg-primary">...</span>
<!-- CORRECCIÓN: shade más oscuro del color de fondo, o blanco con opacidad -->

<!-- PATRÓN PROHIBIDO 7.9: #000 o #fff puro -->
<!-- CORRECCIÓN: Tintar neutros hacia el hue brand (chroma 0.005-0.01) -->

<!-- PATRÓN PROHIBIDO 7.10: Bounce/elastic easing -->
<!-- CORRECCIÓN: ease-out-quart / quint / expo -->

<!-- PATRÓN PROHIBIDO 7.11: Animación de layout properties -->
<!-- CORRECCIÓN: Usar transform + opacity, no animar height/width/top/left -->

<!-- PATRÓN PROHIBIDO 7.12: Purple-to-blue gradients -->
<!-- CORRECCIÓN: Elegir UN color sólido como acento -->

<!-- PATRÓN PROHIBIDO 7.13: Inter como única opción tipográfica -->
<!-- CORRECCIÓN: system-ui stack o fuente con personalidad según dominio -->

<!-- PATRÓN PROHIBIDO 7.14: Rounded-square icon tile arriba de headings -->
<div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
  <i class="bi bi-... text-primary"></i>
</div>
<h2>Título</h2>
<!-- CORRECCIÓN: Quitar icon tile, dejar título o icono inline -->

<!-- PATRÓN PROHIBIDO 7.15: Em dashes en copy -->
<!-- CORRECCIÓN: Usar coma, dos puntos, punto y coma, o paréntesis -->

<!-- PATRÓN PROHIBIDO 7.16: Tiny uppercase tracked labels sobre cada sección -->
<span class="text-xs uppercase tracking-widest">Sección</span>
<!-- CORRECCIÓN: Un kicker fuerte puede ser voz; repetirlo es scaffolding -->

<!-- PATRÓN PROHIBIDO 7.17: Monospace como shorthand "técnico" -->
<!-- CORRECCIÓN: Mono SOLO si la marca es genuinamente técnica -->

<!-- PATRÓN PROHIBIDO 7.18: Dark mode = light mode invertido -->
<!-- CORRECCIÓN: dark mode tiene su propia jerarquía (surface lighter = depth) -->

<!-- PATRÓN PROHIBIDO 7.19: Centered stack hero con icon-card-grid -->
<!-- CORRECCIÓN: Asimetría, left-aligned, o grid visible como voz -->

<!-- PATRÓN PROHIBIDO 7.20: All-caps body copy -->
<!-- CORRECCIÓN: Reservar caps para labels cortos y headings -->

<!-- PATRÓN PROHIBIDO 7.21: Placeholder text con bajo contraste -->
<!-- CORRECCIÓN: Placeholder también necesita 4.5:1 mínimo -->

<!-- PATRÓN PROHIBIDO 7.22: Heavy color en estados inactivos -->
<!-- CORRECCIÓN: Inactivo = muted, activo = acento -->

<!-- PATRÓN PROHIBIDO 7.23: Nested modales -->
<!-- CORRECCIÓN: Steps progresivos en línea, no modal sobre modal -->

<!-- PATRÓN PROHIBIDO 7.24: Sin skeleton states en carga -->
<!-- CORRECCIÓN: skeleton > spinner-in-the-middle -->

<!-- PATRÓN PROHIBIDO 7.25: Sin empty states que enseñen -->
<!-- CORRECCIÓN: empty state que guía al usuario a dar el primer paso -->

<!-- PATRÓN PROHIBIDO 7.26: Display fonts en UI labels o botones -->
<!-- CORRECCIÓN: Sistema sans para UI, display reservado para branding -->

<!-- PATRÓN PROHIBIDO 7.27: Sin state coverage (hover/focus/active/disabled) -->
<!-- CORRECCIÓN: Cada interactivo tiene: default, hover, focus-visible, active, disabled -->
```

> **Uso**: Estas reglas son determinísticas (no requieren LLM). Se aplican como grep patterns sobre HTML/CSS generado. Si hay match → FAIL + snippet de corrección.

#### Supplement: AI Tells de taste-skill (Leonxlnx, ★17.4k)
Reglas adicionales que impeccable no cubre:
```html
<!-- 7.28: Acentos saturados >80% → desaturar a chroma < 0.08 -->
<!-- 7.29: Nombres genéricos → "Acme Corp", "SmartFlow", "Juan Pérez" prohibidos -->
<!-- 7.30: Números falsos → 99.99%, 50%, $100.00 → usar datos orgánicos (47.2%) -->
<!-- 7.31: Placeholder text / Lorem Ipsum → escribir copy real -->
<!-- 7.32: Emojis en UI → reemplazar por Bootstrap Icons o SVG -->
<!-- 7.33: h-screen → reemplazar por min-h-[100dvh] -->
<!-- 7.34: Icons sin label contextual → añadir sr-only o aria-label -->
```

### ❌ Regla 8: CLI Impeccable Detect (Opcional)

Si el usuario tiene Node.js instalado, ofrecer:

```
npx impeccable detect index.html --fast --json
```

Esto escanea el HTML generado contra 24 anti-patrones sin LLM. Integrar resultados al checklist:
- Parsear output JSON
- Mapear cada hallazgo a un item del checklist
- Si hay fails, sugerir correcciones automáticas

**Nota**: No es obligatorio. Si el usuario no tiene Node.js, saltar.

### ❌ Regla 6: Librerías Adicionales mal referenciadas
```html
<!-- PATRÓN PROHIBIDO: Cargar librería adicional desde CDN en runtime -->
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>

<!-- PATRÓN PROHIBIDO: Librería adicional no listada en spec -->
<!-- La librería se usa en un módulo pero nunca se agregó a la spec ni al index.html -->

<!-- CORRECCIÓN AUTOMÁTICA: -->
<!-- 1. Reemplazar CDN por ruta local: -->
<script src="assets/js/libs/qrcode.min.js"></script>

<!-- 2. Si la librería no está en la spec, generar snippet de advertencia: -->
/*
⚠️ Librería qrcode.min.js no está registrada en la spec.
Agrégala en la spec bajo ## 📚 Librerías Adicionales:
libreriasAdicionales:
  - nombre: qrcode.min.js
    ruta: assets/js/libs/qrcode.min.js
    tipo: script
Luego ejecuta setup-init para descargarla.
*/
```

---

## 📋 CATÁLOGO DE LIBRERÍAS CONOCIDAS (para validación)
Usa esta lista para verificar que las librerías adicionales se cargan desde la ruta correcta:

| Librería | Ruta esperada |
|----------|--------------|
| qrcode.min.js | `assets/js/libs/qrcode.min.js` |
| quagga.min.js | `assets/js/libs/quagga.min.js` |
| leaflet.js | `assets/js/libs/leaflet.js` |
| leaflet.css | `assets/css/leaflet.css` |
| html2canvas.js | `assets/js/libs/html2canvas.min.js` |
| dompurify.js | `assets/js/libs/dompurify.min.js` |
| lodash.js | `assets/js/libs/lodash.min.js` |
| dayjs.min.js | `assets/js/libs/dayjs.min.js` |
| uuid.js | `assets/js/libs/uuid.min.js` |
| marked.js | `assets/js/libs/marked.min.js` |
| cleave.js | `assets/js/libs/cleave.min.js` |
| validator.js | `assets/js/libs/validator.min.js` |
| howler.min.js | `assets/js/libs/howler.min.js` |

Si la librería no está en este catálogo, verifica que su ruta siga el patrón `assets/js/libs/[nombre]`.

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
[ ] ¿Librerías adicionales cargadas vía CDN y no desde `assets/`? → ❌ RECHAZAR
[ ] ¿Librerías adicionales usadas en módulos pero no en spec ni index.html? → ⚠️ AGREGAR a spec
[ ] ¿Librerías adicionales en index.html antes que las base? → ❌ REORDENAR

=== CHECKS DE ACCESIBILIDAD ===
[ ] ¿Botón con solo icono y sin `aria-label`? → ❌ AÑADIR aria-label
[ ] ¿Input sin `<label for="...">` visible? → ❌ AÑADIR label
[ ] ¿Toast o alert sin `aria-live="polite"`? → ⚠️ AÑADIR aria-live
[ ] ¿Modal sin `role="dialog"` ni `aria-modal="true"`? → ❌ AÑADIR atributos
[ ] ¿Falta `@media (prefers-reduced-motion)`? → ⚠️ AÑADIR regla CSS
[ ] ¿Tabla de datos sin `<caption>` ni `<th scope>`? → ⚠️ AÑADIR estructura
[ ] ¿Landmark roles faltantes (banner, nav, main)? → ⚠️ AÑADIR roles

=== CHECKS DE PRIVACIDAD ===
[ ] ¿Formulario pide datos no declarados en spec? → ❌ PREGUNTAR necesidad
[ ] ¿Se guarda automáticamente sin consentimiento? → ❌ AÑADIR flujo de consentimiento
[ ] ¿Se recolectan datos opcionales como obligatorios? → ⚠️ MARCAR como opcional

=== CHECKS DE CODE REVIEW ===
[ ] ¿Nombres de variables claros y consistentes? → ⚠️ SUGERIR rename
[ ] ¿Funciones >50 líneas sin dividir? → ⚠️ SUGERIR refactor
[ ] ¿Try/catch sin manejo real (solo console.error)? → ⚠️ MEJORAR handling
[ ] ¿Tareas destructivas sin confirmación? → ❌ AÑADIR UI.confirm()
[ ] ¿Hardcoded strings sin español? → ❌ TRADUCIR

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
- N/N librerías adicionales en assets/ (sin CDNs)
- Orden correcto: CSS → Libs base → Libs adicionales → Core → Main

✅ Código listo para producción offline.
```

---

## 🔗 INTEGRACIÓN CON OTRAS SKILLs

### En `spec-creator.md`:
- Tras generar cada módulo, ejecutar mentalmente `stack-compliance-guard` antes de mostrar output.
- Si hay correcciones, aplicarlas silenciosamente y añadir nota al final: `🛡️ Ajustado a reglas offline-first`.

### En `setup-init.md`:
- Validar que `index.html` generado cumple:
  - Orden de scripts: CSS → Libs base → **Libs adicionales** → Core → Modules → Main
  - Sin `type="module"`, sin CDNs
  - `x-cloak` presente para evitar FOUC
- Si la spec tiene `libreriasAdicionales`, verificar que todas tengan comando de descarga en el `.bat`

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
- **Librerías adicionales**: Si detectas `src="http"` apuntando a una librería que está en el catálogo de libs conocidas, sugiere la ruta `assets/js/libs/` correcta y recuerda que debe descargarse con `setup-init`.
- **Catálogo**: Usa el catálogo de librerías conocidas para validar rutas. Si una librería no está en el catálogo, verifica que al menos tenga el formato `assets/js/libs/[nombre]`.
- **Idioma**: Todos los mensajes al usuario en español técnico pero claro.

✨ **SKILL ready v2. Se activa automáticamente. No requiere trigger.**
```

---

