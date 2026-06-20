# AHA Obra

## Descripción
Sistema de control de obra offline para constructores. Gestión de obras, etapas de construcción, materiales, gastos, fotos de avance y reportes PDF con desglose. Sin internet, pago único.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- dayjs.min.js

## Módulos

### Módulo Dashboard
Resumen: obras activas, presupuesto total vs ejercido, avance general ponderado, últimas fotos de avance. Gráficos con ApexCharts.

### Módulo Obras
CRUD completo: nombre, dirección, tipo (casa/edificio/local comercial/bodega/otro), presupuesto total, fecha inicio, fecha estimada fin, estado (planeada/en progreso/completada/en pausa). Búsqueda instantánea por nombre o dirección.

### Módulo Etapas
Etapas semilla: cimentación, estructura, instalaciones, acabados, entrega. Cada etapa con: fecha inicio real, fecha fin real, avance porcentual, estado. Se pueden agregar etapas personalizadas. El avance de obra se calcula como promedio ponderado de etapas.

### Módulo Materiales
CRUD: nombre, unidad de medida (kg/m/pieza/litro/bolsa), cantidad total, precio unitario, stock mínimo. Asignación a obra y etapa. Alerta visual cuando material está por debajo del stock mínimo. Cálculo de costo total por material.

**Campos sensibles:** precio unitario (cifrar con CryptoJS)

### Módulo Gastos
Registro: concepto, monto, categoría (material/mano de obra/renta/herramientas/otros), asignación a obra y etapa. Comparativa presupuesto vs gasto real por obra. Historial completo con filtros.

### Módulo Fotos de Avance
Captura de fotos desde cámara o galería (.apk). Asignación a obra y etapa con descripción opcional. Línea de tiempo visual con fecha. Vista antes/después para comparar progreso.

### Módulo Reportes
Dashboard: presupuesto vs ejercido (gráfico), avance por obra (barra), gastos por categoría (pastel). Reporte PDF por obra: datos generales, tabla de gastos, fotos de avance, firma de recibido. Export CSV.

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

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards (obras activas, presupuesto, avance), timeline últimas fotos, gráfico presupuesto vs ejercido |
| Obras | Tabla con buscador, modal CRUD, badge estado (azul=planeada, verde=progreso, gris=completada, amarillo=pausa), botón "Ver obra" |
| Etapas | Tabla dentro de vista de obra, barra de progreso por etapa, modal crear/editar, reordenar arrastrando |
| Materiales | Tabla con filtro por obra, input unidad con selector, alerta visual si stock < mínimo |
| Gastos | Tabla cronológica, filtros por obra/categoría, modal registro, subtotal por obra en header |
| Fotos | Grid de fotos con fecha, modal ampliar, botón capturar, línea de tiempo |
| Reportes | Selector obra, gráficos ApexCharts, botón "Generar PDF reporte obra", botón export CSV |

## Reglas de UI/UX

- Sidebar con iconos Bootstrap: dashboard, obras, materiales, gastos, fotos, reportes
- Vista de obra dedicada: al hacer clic en una obra, mostrar sus etapas, materiales y gastos en tabs/pestañas
- Barra de progreso visual en cada etapa con color según estado
- Al añadir gasto: auto-sumar al total ejercido de la obra
- Fotos en grid responsive con lazy load
- Confirmación antes de eliminar obra, etapa o material
- Toast feedback en cada operación CRUD
- PDF de reporte con estructura profesional: portada, tabla de contenido, gráficos, fotos
