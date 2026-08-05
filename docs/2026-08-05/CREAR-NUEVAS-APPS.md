# 🚀 Como Crear una Nueva App con el Stack Ateje — Guia Practica con Ejemplos

> **Actualizado:** 2026-08-05
> **Requisito previo:** OpenCode CLI + `install-global.ps1` ejecutado (o trabajar dentro del repo).
> **Skill nueva:** `code-review-engine` revisa tu codigo en 4 ejes tras cada bloque — dejalo actuar.

---

## 1. Decision Rapida: ¿Que flujo uso?

| Situacion | Flujo | Comando |
|-----------|-------|---------|
| App rapida siguiendo un template AHA | Classic | `/new` (5 fases) |
| App con capa de marca profesional | Design | `/pro` (10 fases) |
| Solo generar codigo de una spec ya lista | Build | `/build` |
| Anadir IA a la app | Plugin | `/ia` |
| Revisar el codigo del diff git | Review | `/review` |

---

## 2. Flujo Completo con `/new` (ejemplo: AHA Gastos)

### Paso 1 — Elegir la app

```
/new
```

El pipeline pregunta el nombre de la app. Para usar un template existente:

```
/new AHA-Gastos
```

### Paso 2 — Setup (Fase 1)

El setup-init valida entorno (curl, node), crea la estructura de directorios, genera defaults (avatar/placeholder) y descarga las librerias base:

```
[app]/
├── index.html  core/  modules/  assets/  data/  scripts/
```

### Paso 3 — Spec (Fase 2)

`spec-engine` genera `specs/[app].md` con **15 secciones** (descripcion, target, dolor, modulos, tablas Dexie, campos, reglas de negocio, validaciones, permisos, exportaciones, IA, UI, estado vacio, acciones de emergencia, metricas) + `specs/DESIGN.md` (brand layer).

**Input:** el template de la app (`apps/AHA-Gastos/template.md`) o una historia de usuario.

### Paso 4 — Design (Fase 3)

`design-engine` inyecta el brand context desde `DESIGN.md`, aplica tokens DaisyUI (colores, tipografia) y selecciona componentes UI.

### Paso 5 — Code (Fase 4) — **donde entra code-review-engine**

`code-generator` genera el codigo por fases:

```
FASE A: core/ + index.html + project.config.js
FASE B: modulos (uno por turno, con pausa)
```

**Despues de cada bloque** (FASE A completo, cada modulo de FASE B), `code-review-engine` se ejecuta **automaticamente** y revisa en 4 ejes:
- Eje 1 Compliance (imports ES6, CDN, cifrado)
- Eje 2 Calidad (smells Fowler, ES5)
- Eje 3 Spec (requisitos cumplidos)
- Eje 4 Brand (tokens DESIGN.md)

Si hay `[BLOCK]`, no continua hasta corregir. Los fixes deterministicos se aplican con tu confirmacion en lote.

### Paso 6 — Validate + Deploy (Fase 5)

```
/test      → validation-engine 4 fases (compliance → brand audit → DevTools/Playwright → QA rubric)
/deploy    → deployment-jigue (commit + push + empaquetado segun perfil)
```

---

## 3. Ejemplo Practico — Crear "AHA Pedidos" (app nueva custom)

### Paso 1: Historia de usuario

```
"Necesito registrar pedidos de clientes, con productos, cantidades y estado,
que funcione sin internet en mi bodega."
```

### Paso 2: Generar spec

```
/spec AHA-Pedidos
```

El spec-engine genera `specs/AHA-Pedidos.md` con:
- **Tablas Dexie:** `pedidos: 'id, cliente, fecha, estado, total, createdAt'`, `pedidos_items: 'id, pedidoId, producto, cantidad, precio'`
- **Modulos:** pedidos (lista + formulario), dashboard (metricas)
- **Reglas:** total = suma de items; estado ∈ {pendiente, completado, cancelado}
- **Cifrado:** campo `cliente` sensible → `cryptoHelpers.encrypt()`

### Paso 3: Build

```
/build AHA-Pedidos
```

FASE A genera core + index.html. FASE B genera modulos, **uno por turno**, con `code-review-engine` revisando cada uno.

**Ejemplo de revision que recibiras:**

```markdown
# Revisión: modules/pedidos/module.js
## Eje 1+2 — Compliance + Calidad
[WARN]  (R-A5) alert() nativo en module.js:87 → UI.toast()
✅ Compliance: sin CDNs, cifrado aplicado, contrato módulo OK

## Eje 3+4 — Spec + Brand
[BLOCK] Falta campo 'estado' en form — spec AHA-Pedidos.md:214 lo pide obligatorio

## Veredicto: BLOCK (1 crítico)
→ Corrige el bloqueo antes de continuar. ¿Aplico el fix?
```

### Paso 4: Validar y desplegar

```
/test
/deploy
```

---

## 4. Ejemplo con `/pro` (brand layer profesional)

```
/pro mi-tienda-online
```

10 fases: taste → init (DESIGN.md bootstrap) → design → spec → code → inject (microcopy) → review (visual) → QA → pack → deploy. Ideal cuando el cliente pide marca propia.

---

## 5. Usar `/review` para revisar un diff git

```
/review            # Pregunta el punto de referencia
/review main       # Revisa git diff main...HEAD
/review HEAD~5     # Revisa los ultimos 5 commits
```

Lanza `review-agent` (Ejes 1+2) y `spec-reviewer` (Ejes 3+4) **en paralelo** y presenta ambos reportes lado a lado, con una linea de cierre por eje.

---

## 6. Perfiles al Crear

| Perfil | Para que cliente | Comando post-build |
|--------|------------------|--------------------|
| **Lite** | Negocio pequeno, presupuesto bajo | ZIP + GitHub Pages |
| **Professional** | Negocio mediano | .exe + .apk |
| **Business** | Empresa | .exe + .apk + white-label + soporte |

El perfil se define en `project.config.js`:

```javascript
APP_CONFIG: {
  perfil: 'lite',        // 'lite' | 'professional' | 'business'
  appId: 'AHA-Pedidos',
  modulo: 'pedidos',
  tabs: ['Pedidos', 'Dashboard'],
  tema: { colores: { primary: '#0ea5e9', ... } },
  cifrado: { camposSensibles: ['cliente'] },
  sync: { autoBackup: true }
}
```

Cambiar perfil despues: `/upgrade`.

---

## 7. Checklist de Buenas Practicas al Crear Apps

- [ ] Todo en ES5 (IIFE, `var`, sin `import`/`export` — restriccion file://)
- [ ] Cero CDN en runtime (librerias en `assets/` local)
- [ ] Campos sensibles con `cryptoHelpers.encrypt()`
- [ ] Feedback con `UI.toast()`, nunca `alert()`
- [ ] `UI.confirm()` antes de `db.delete()`
- [ ] Formularios via `UI.modalForm()`
- [ ] UI en espanol (microcopy con `omd:es-writer`)
- [ ] DaisyUI + Bootstrap Icons + Alpine.js (no otras UI)
- [ ] Deja que `code-review-engine` revise cada bloque (no lo saltes)
- [ ] `/test` al final antes de `/deploy`
