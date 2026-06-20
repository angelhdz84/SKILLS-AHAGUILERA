# AHA Campo

## Descripción
Registro de campo offline para agricultura y ganadería. Control de lotes, cultivos, ganado, insumos y gastos. Con fotos desde el campo, alertas y reportes. Funciona sin internet, ideal para zonas rurales.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- dayjs.min.js

## Módulos

### Módulo Cultivos
CRUD de lotes/parcelas: nombre, hectáreas, cultivo actual, ubicación (notas de texto, sin mapas). Registrar siembra: fecha, variedad, densidad, lote. Registro diario por lote: tipo (riego/fertilización/plaga/cosecha), descripción, fotos (base64). Historial de ciclos completos por lote con fechas de siembra y cosecha. Seguimiento visual con fotos por fecha.

### Módulo Ganado
CRUD de animales: arete o nombre, especie (bovino/porcino/ovino/caprino/equino/ave), raza, fecha de nacimiento. Eventos: vacunación, desparasitación, pesaje, inseminación, parto, tratamiento. Alertas: próxima vacuna/desparasitación según frecuencia configurable. Historial de salud completo por animal. Búsqueda por arete o nombre.

### Módulo Insumos
CRUD: nombre, tipo (semilla/fertilizante/vacuna/herbicida/herramienta/otro), unidad (kg/l/unidad), stock actual, stock mínimo. Entradas: compra con cantidad, fecha, proveedor, costo unitario, total. Salidas: aplicación a lote o animal con cantidad y fecha. Alerta visual cuando stock < mínimo. Historial de movimientos.

**Campos sensibles:** costos, totales (cifrar)

### Módulo Gastos
Registro de gastos: concepto, monto, categoría (insumos/mano de obra/maquinaria/transporte/imprevisto), lote asociado (opcional), fecha, notas. Reporte de costos por lote y por hectárea. Gráfico circular por categoría. Export CSV.

### Módulo Reportes
Dashboard: lotes activos, animales registrados, insumos bajos, gastos del mes por lote. Costos del ciclo por lote (comparativa). Rendimiento estimado por hectárea. Eventos por animal. Export PDF y CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  lotes: 'id, nombre, *hectareas, *cultivoActual, *ubicacion, *createdBy, createdAt, updatedAt',
  ciclos: 'id, *loteId, *cultivo, *variedad, *densidad, *fechaSiembra, *fechaCosecha, *createdBy, createdAt, updatedAt',
  registros_diarios: 'id, *loteId, *tipo, *descripcion, *fotos, *fecha, *createdBy, createdAt',
  animales: 'id, *arete, nombre, *especie, *raza, *fechaNacimiento, *createdBy, createdAt, updatedAt',
  eventos_animal: 'id, *animalId, *tipo, *fecha, *descripcion, *proximaFecha, *createdBy, createdAt',
  insumos: 'id, nombre, *tipo, *unidad, *stockActual, *stockMinimo, *createdBy, createdAt, updatedAt',
  movimientos_insumo: 'id, *insumoId, *tipo, *cantidad, *costoUnitario, *total, *loteId, *animalId, *proveedor, *createdBy, createdAt',
  gastos: 'id, concepto, *monto, *categoria, *loteId, *notas, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards: lotes activos, animales, insumos bajos, gastos mes |
| Lotes | Grid de lotes con cultivo, última actividad, tap para detalle |
| Registro diario | Por lote: selector tipo, descripción, foto, botón guardar |
| Ganado | Lista + ficha con eventos cronológicos, próximas alertas |
| Insumos | Tabla stock con alerta roja, botones entrada/salida |
| Gastos | Por lote o general, gráfico circular, export CSV |

## Reglas de UI/UX

- Sidebar: dashboard, lotes, ganado, insumos, gastos, reportes
- Interfaz adaptada para campo: botones grandes, contraste alto (leíble con sol)
- Fotografías con preview antes de guardar
- Timeline visual de eventos por animal y lote
- Badge rojo en insumos con stock bajo
- Badge "⚠️ Próximo evento" en animales con alertas pendientes
- Confirmación en eliminar (lote con ciclos, animal con eventos)
- Export CSV con UTF-8 BOM para Excel
- Toast feedback en cada operación
