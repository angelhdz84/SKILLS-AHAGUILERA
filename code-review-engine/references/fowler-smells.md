# Baseline de Smells de Calidad (Refactoring, Fowler — cap. 3)

> **Uso**: El Eje 2 (Calidad) del code-review-engine aplica esta lista como baseline fijo sobre el diff o el código nuevo. Cada smell es una heurística etiquetada ("posible Feature Envy"), nunca una violación dura. Si el repo documenta una norma que contradice un smell, **la norma del repo gana** (se suprime el smell). Se omite todo lo que el tooling ya valida.

Formato: *qué es* → *cómo arreglarlo*.

## 1. Mysterious Name
Función, variable o tipo cuyo nombre no revela qué hace o qué contiene.
→ Renombrarlo; si no surge un nombre honesto, el diseño está turbio.

## 2. Duplicated Code
La misma forma lógica aparece en más de un hunk o archivo del cambio.
→ Extraer la forma compartida y llamarla desde ambos sitios.

## 3. Feature Envy
Un método que accede a los datos de otro objeto más que a los suyos.
→ Mover el método al objeto que "envidia".

## 4. Data Clumps
Los mismos pocos campos o parámetros viajan siempre juntos (un tipo queriendo nacer).
→ Agruparlos en un solo tipo y pasarlo.

## 5. Primitive Obsession
Un primitivo o string que representa un concepto de dominio que merece su propio tipo.
→ Darle al concepto su propio tipo pequeño.

## 6. Repeated Switches
El mismo `switch`/cascada de `if` sobre el mismo tipo se repite en el cambio.
→ Reemplazar con polimorfismo, o con un mapa compartido por ambos sitios.

## 7. Shotgun Surgery
Un cambio lógico obliga a ediciones dispersas en muchos archivos del diff.
→ Reunir lo que cambia junto en un solo módulo.

## 8. Divergent Change
Un archivo o módulo se edita por varias razones no relacionadas.
→ Dividir para que cada módulo cambie por una sola razón.

## 9. Speculative Generality
Abstracciones, parámetros u hooks añadidos para necesidades que la spec no tiene.
→ Eliminarlo; inline de vuelta hasta que surja una necesidad real.

## 10. Message Chains
Navegación larga `a.b().c().d()` de la que el caller no debería depender.
→ Ocultar el recorrido tras un método del primer objeto.

## 11. Middle Man
Clase o función que mayormente delega hacia adelante.
→ Cortarla y llamar directo al destino real.

## 12. Refused Bequest
Subclase o implementador que ignora o sobreescribe casi todo lo que hereda.
→ Dejar la herencia y usar composición.

---

# Reglas de calidad específicas del stack Ateje (ES5 / offline-first)

Estas reglas complementan el baseline de Fowler con las particularidades del stack. Son **normas del repo** (ganan sobre el baseline):

## R-A1: `async` no es nombre de propiedad válido
`async` es palabra reservada. NO usar como nombre de propiedad en notación `{ nombre: function() }`:
```javascript
// ❌ SyntaxError
const obj = { async: async function() { ... } };
// ❌ SyntaxError
const obj = { async nav: function() { ... } };
// ✅ Mover async a la función
const obj = { nav: async function() { ... } };
// ✅ Shorthand ES6 (si el target lo permite)
const obj = { async nav() { ... } };
```
Aplica a TODAS las propiedades que sean funciones async: `guardar`, `init`, `render`, etc.

## R-A2: Funciones > 50 líneas sin dividir
Si una función supera ~50 líneas, sugerir extracción de helpers. Excepción: render de templates largos con HTML.

## R-A3: try/catch sin manejo real
`try/catch` que solo hace `console.error` y traga el error → sugerir feedback real (`UI.toast(e.message, 'error')`) o Result Type.

## R-A4: Tareas destructivas sin confirmación
`db.delete()`, borrado de archivos, reset de datos → deben tener `UI.confirm()` previo.

## R-A5: `alert()`/`confirm()`/`prompt()` nativos
→ Reemplazar por `UI.toast()` / `UI.confirm()`.

## R-A6: Hardcoded strings en inglés
Todo string visible al usuario debe estar en español. `console.log` puede estar en español también (convención del stack).

## R-A7: Nombres de variables inconsistentes
Mezcla de `camelCase`, `snake_case` y abreviaturas crípticas en el mismo módulo → sugerir normalizar a `camelCase` consistente.

## R-A8: Variables globales innecesarias
El stack usa `window.*` para expositores (Dexie, CryptoJS, Alpine, MODULES). No añadir `window.` sueltos sin necesidad; usar `window.MODULES = window.MODULES || {}` pattern para registros.

## R-A9: Módulo sin contrato
Todo módulo debe exponer `id`, `titulo`, `icono`, `init()`, `render()`, `destroy()` y registrarse en `window.MODULES[id]`.

## R-A10: Operaciones Dexie sin try/catch
Lectura/escritura sobre `db.*` debe manejar errores (fallo de IndexedDB es real en file://).

## R-A11: Campos sensibles que viajan descifrados
Al editar un registro con campos cifrados, el form recibe datos descifrados; al guardar, re-cifrar (chequear prefijo `U2FsdGVkX1` para no doble-cifrar).

## R-A12: Spinner genérico en vez de skeleton
Listas y cargas de datos deben usar clases `.sk-*` (skeleton shimmer) o skeletons DaisyUI, no spinners en el centro.

## R-A13: Emojis en UI
→ Reemplazar por Bootstrap Icons o SVG inline.

## R-A14: `// TODO`, `// rest of code`, `// ...` en output
El código entregado debe estar completo. Cualquier placeholder de este tipo es BLOCK.
