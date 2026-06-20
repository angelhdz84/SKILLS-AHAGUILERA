# AHA Obra â€” Control de construcciÃ³n y avance de obra offline

## DescripciÃ³n comercial

Sistema de control de obra offline para constructores y contratistas. GestiÃ³n de obras, etapas de construcciÃ³n, materiales, gastos, fotos de avance y reportes PDF. Sin internet, sin mensualidades.

**Target:** Constructores, arquitectos, maestros de obra, contratistas, ingenieros civiles.

**Dolor que resuelve:** "Los gastos de obra se me disparan y no tengo control del avance ni de los materiales."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ—ï¸ MÃ³dulo Obras
- CRUD: nombre, direcciÃ³n, tipo (casa, edificio, local comercial), presupuesto total
- Fecha inicio, fecha estimada fin, estado (planeada/en progreso/completada/en pausa)
- BÃºsqueda instantÃ¡nea por nombre o direcciÃ³n

### ðŸ“‹ MÃ³dulo Etapas
- Etapas predefinidas: cimentaciÃ³n, estructura, instalaciones, acabados, entrega
- Avance porcentual por etapa, fecha inicio y fin real
- Estado por etapa (pendiente/en progreso/completada)

### ðŸ§± MÃ³dulo Materiales
- Registro de materiales: nombre, unidad (kg, m, pieza, litro), cantidad, precio unitario
- AsignaciÃ³n a obra y etapa
- Alertas de materiales agotados (stock mÃ­nimo)

### ðŸ’° MÃ³dulo Gastos
- Registro de gastos: concepto, monto, categorÃ­a (material, mano de obra, renta, otros)
- AsignaciÃ³n a obra y etapa
- Comparativa presupuesto vs gasto real

### ðŸ“¸ MÃ³dulo Fotos de Avance
- Captura de fotos desde cÃ¡mara o galerÃ­a (.apk)
- AsignaciÃ³n a obra y etapa con fecha
- Vista antes/despuÃ©s lÃ­nea de tiempo

### ðŸ“Š MÃ³dulo Reportes
- Dashboard: obras activas, presupuesto total vs ejercido, avance general
- Reporte PDF por obra con fotos y desglose de gastos
- Export a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  obras: 'id, nombre, direccion, *tipo, presupuestoTotal, *estado, *createdBy, createdAt, updatedAt',
  etapas: 'id, *obraId, nombre, *estado, avance, createdAt',
  materiales: 'id, *obraId, *etapaId, nombre, *unidad, cantidad, precioUnitario, stockMinimo, createdAt',
  gastos_obra: 'id, *obraId, *etapaId, concepto, monto, *categoria, *createdBy, createdAt',
  avances_fotos: 'id, *obraId, *etapaId, *imagen, descripcion, createdAt'
})
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
sin pagar mensualidades. Â¿AHA Obra plan Standard con .exe y .apk?


