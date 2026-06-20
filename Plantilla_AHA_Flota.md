# AHA Flota

## Descripción
Sistema de control de flota offline para transportistas y dueños de vehículos. Registro de combustible con rendimiento km/l, mantenimientos programados, incidentes y reportes de costo por km. Sin internet, pago único.

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
Resumen de flotilla: total vehículos, activos/en taller, gasto de combustible del mes, próximos mantenimientos, costo total por km. Gráficos con ApexCharts.

### Módulo Vehículos
CRUD completo: marca, modelo, año, placas (único), número económico, VIN, foto (base64 local), tipo (moto/auto/camioneta/camión), estado (activo/en taller/baja). Búsqueda instantánea por placas o número económico.

### Módulo Combustible
Registro de carga: seleccionar vehículo, fecha, litros, importe, kilometraje actual, tipo (gasolina/diésel). Cálculo automático de rendimiento km/l basado en carga anterior. Historial con gráfico de consumo por vehículo. Alertas de consumo anómalo (desviación >20% del promedio).

**Campos sensibles:** importe (cifrar con CryptoJS)

### Módulo Mantenimiento
Registro de servicios: seleccionar vehículo, tipo (aceite/llantas/frenos/afinación/general), taller, costo, kilometraje, fecha. Próximo mantenimiento sugerido según intervalo configurable por tipo (ej: aceite cada 5000 km). Alerta visual en sidebar si hay servicios próximos.

### Módulo Incidentes
Registro de multas, accidentes y averías: seleccionar vehículo, tipo, fecha, costo, descripción, ubicación (opcional). Historial completo por vehículo. Cálculo de costo total por incidente.

### Módulo Reportes
Dashboard: gasto combustible por mes (gráfico), costo por km por vehículo (barra), mantenimientos realizados vs programados. Export a CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  vehiculos: 'id, *placas, *numeroEconomico, marca, modelo, *anio, *tipo, *estado, *createdBy, createdAt, updatedAt',
  cargas_combustible: 'id, *vehiculoId, litros, importe, *kilometraje, *tipo, createdAt',
  mantenimientos: 'id, *vehiculoId, *tipo, costo, *kilometraje, *taller, *proximoKm, *createdBy, createdAt',
  incidentes: 'id, *vehiculoId, *tipo, costo, descripcion, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards (flotilla, gasto mes, próximos mantenimientos), gráfico gasto por vehículo, tabla alertas |
| Vehículos | Tabla con buscador por placas/económico, modal CRUD, badge estado (verde=activo, amarillo=taller, rojo=baja) |
| Combustible | Formulario registro, tabla historial, gráfico consumo por vehículo con selector |
| Mantenimiento | Tabla con filtro por vehículo/tipo, modal registro, badge de próximo servicio |
| Incidentes | Tabla cronológica, filtros, modal registro, total costos acumulados |
| Reportes | Selector período/vehículo, gráficos ApexCharts, botón export CSV |

## Reglas de UI/UX

- Sidebar con iconos Bootstrap: dashboard, vehículos, combustible, mantenimiento, incidentes, reportes
- Badge de color por estado del vehículo en lista
- Al registrar carga de combustible: mostrar rendimiento automático si hay carga previa
- Alerta visual (badge rojo) si hay mantenimientos próximos
- Confirmación antes de eliminar cualquier registro
- Input de kilometraje con formato numérico y validación (> anterior)
- Toast feedback en cada operación CRUD
- Gráfico de consumo con línea de tendencia y alerta de desviación
