# AHA Flota — Control de vehículos y flotilla offline

## Descripción comercial

Sistema de control de flota offline para transportistas y dueños de vehículos. Registro de combustible, mantenimiento programado, kilometraje, multas e incidentes. Reportes de costo por km. Sin internet, sin mensualidades.

**Target:** Transportistas, dueños de flotillas, repartidores, empresas de logística, taxis, camionetas de carga.

**Dolor que resuelve:** "No sé cuánto gasto en gasolina ni cuándo le toca mantenimiento a cada vehículo."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 🚗 Módulo Vehículos
- CRUD: marca, modelo, año, placas, número económico, VIN
- Foto del vehículo, tipo (moto, auto, camioneta, camión)
- Estado: activo, en taller, dado de baja
- Búsqueda instantánea por placas o número económico

### ⛽ Módulo Combustible
- Registro de cargas: fecha, litros, importe, kilometraje actual, tipo (gasolina/diésel)
- Cálculo automático de rendimiento (km/litro)
- Historial de consumo por vehículo con gráfico Chart.js

### 🔧 Módulo Mantenimiento
- Registro de servicios: tipo (aceite, llantas, frenos, afinación, general), taller, costo, kilometraje
- Programación: próximo servicio basado en km o fecha
- Alerta visual cuando se acerca el próximo mantenimiento

### ⚠️ Módulo Incidentes
- Registro de multas, accidentes, averías
- Tipo, fecha, costo, descripción, vehículo
- Reporte de costos totales por incidente

### 📊 Módulo Reportes
- Dashboard: flotilla total, gasto combustible mes, próximos mantenimientos
- Costo por km por vehículo (gráfico)
- Export a CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt',
  vehiculos: 'id, *uuid, *placas, *numeroEconomico, marca, modelo, *anio, *tipo, *estado, *createdBy, createdAt, updatedAt',
  cargas_combustible: 'id, *uuid, *vehiculoId, litros, importe, *kilometraje, *tipo, createdAt',
  mantenimientos: 'id, *uuid, *vehiculoId, *tipo, costo, *kilometraje, *taller, *proximoKm, *createdBy, createdAt',
  incidentes: 'id, *uuid, *vehiculoId, *tipo, costo, descripcion, *createdBy, createdAt'
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
Hola Angel, necesito controlar los gastos de mis vehículos
sin pagar mensualidades. ¿AHA Flota plan Standard con .exe y .apk?


