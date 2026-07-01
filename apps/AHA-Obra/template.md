# AHA Obra — Control de construcción y avance de obra offline

## Descripción comercial

Sistema de control de obra offline para constructores y contratistas. Gestión de obras, etapas de construcción, materiales, gastos, fotos de avance y reportes PDF. Sin internet, sin mensualidades.

**Target:** Constructores, arquitectos, maestros de obra, contratistas, ingenieros civiles.

**Dolor que resuelve:** "Los gastos de obra se me disparan y no tengo control del avance ni de los materiales."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 🏗️ Módulo Obras
- CRUD: nombre, dirección, tipo (casa, edificio, local comercial), presupuesto total
- Fecha inicio, fecha estimada fin, estado (planeada/en progreso/completada/en pausa)
- Búsqueda instantánea por nombre o dirección

### 📋 Módulo Etapas
- Etapas predefinidas: cimentación, estructura, instalaciones, acabados, entrega
- Avance porcentual por etapa, fecha inicio y fin real
- Estado por etapa (pendiente/en progreso/completada)

### 🧱 Módulo Materiales
- Registro de materiales: nombre, unidad (kg, m, pieza, litro), cantidad, precio unitario
- Asignación a obra y etapa
- Alertas de materiales agotados (stock mínimo)

### 💰 Módulo Gastos
- Registro de gastos: concepto, monto, categoría (material, mano de obra, renta, otros)
- Asignación a obra y etapa
- Comparativa presupuesto vs gasto real

### 📸 Módulo Fotos de Avance
- Captura de fotos desde cámara o galería (.apk)
- Asignación a obra y etapa con fecha
- Vista antes/después línea de tiempo

### 📊 Módulo Reportes
- Dashboard: obras activas, presupuesto total vs ejercido, avance general
- Reporte PDF por obra con fotos y desglose de gastos
- Export a CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  obras: 'id, nombre, direccion, *tipo, presupuestoTotal, *estado, *createdBy, createdAt, updatedAt',
  etapas: 'id, *obraId, nombre, *estado, avance, createdAt, updatedAt',
  materiales: 'id, *obraId, *etapaId, nombre, *unidad, cantidad, precioUnitario, stockMinimo, createdAt, updatedAt',
  gastos_obra: 'id, *obraId, *etapaId, concepto, monto, *categoria, *createdBy, createdAt, updatedAt',
  avances_fotos: 'id, *obraId, *etapaId, *imagen, descripcion, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | $49 |
| Standard | $99 |
| Custom | $199+ |

## WhatsApp para venta

```
Hola Angel, necesito controlar los gastos y avance de mis obras
sin pagar mensualidades. ¿AHA Obra plan Standard con .exe y .apk?


