# AHA Flota â€” Control de vehÃ­culos y flotilla offline

## DescripciÃ³n comercial

Sistema de control de flota offline para transportistas y dueÃ±os de vehÃ­culos. Registro de combustible, mantenimiento programado, kilometraje, multas e incidentes. Reportes de costo por km. Sin internet, sin mensualidades.

**Target:** Transportistas, dueÃ±os de flotillas, repartidores, empresas de logÃ­stica, taxis, camionetas de carga.

**Dolor que resuelve:** "No sÃ© cuÃ¡nto gasto en gasolina ni cuÃ¡ndo le toca mantenimiento a cada vehÃ­culo."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸš— MÃ³dulo VehÃ­culos
- CRUD: marca, modelo, aÃ±o, placas, nÃºmero econÃ³mico, VIN
- Foto del vehÃ­culo, tipo (moto, auto, camioneta, camiÃ³n)
- Estado: activo, en taller, dado de baja
- BÃºsqueda instantÃ¡nea por placas o nÃºmero econÃ³mico

### â›½ MÃ³dulo Combustible
- Registro de cargas: fecha, litros, importe, kilometraje actual, tipo (gasolina/diÃ©sel)
- CÃ¡lculo automÃ¡tico de rendimiento (km/litro)
- Historial de consumo por vehÃ­culo con grÃ¡fico ApexCharts

### ðŸ”§ MÃ³dulo Mantenimiento
- Registro de servicios: tipo (aceite, llantas, frenos, afinaciÃ³n, general), taller, costo, kilometraje
- ProgramaciÃ³n: prÃ³ximo servicio basado en km o fecha
- Alerta visual cuando se acerca el prÃ³ximo mantenimiento

### âš ï¸ MÃ³dulo Incidentes
- Registro de multas, accidentes, averÃ­as
- Tipo, fecha, costo, descripciÃ³n, vehÃ­culo
- Reporte de costos totales por incidente

### ðŸ“Š MÃ³dulo Reportes
- Dashboard: flotilla total, gasto combustible mes, prÃ³ximos mantenimientos
- Costo por km por vehÃ­culo (grÃ¡fico)
- Export a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  vehiculos: 'id, *placas, *numeroEconomico, marca, modelo, *anio, *tipo, *estado, *createdBy, createdAt, updatedAt',
  cargas_combustible: 'id, *vehiculoId, litros, importe, *kilometraje, *tipo, createdAt',
  mantenimientos: 'id, *vehiculoId, *tipo, costo, *kilometraje, *taller, *proximoKm, *createdBy, createdAt',
  incidentes: 'id, *vehiculoId, *tipo, costo, descripcion, *createdBy, createdAt'
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
Hola Angel, necesito controlar los gastos de mis vehÃ­culos
sin pagar mensualidades. Â¿AHA Flota plan Standard con .exe y .apk?


