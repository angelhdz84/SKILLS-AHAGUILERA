# AHA Campo â€” Registro de campo offline para agricultura y ganaderÃ­a

## DescripciÃ³n comercial

Lleva el registro diario de tus lotes de cultivo, ganado, insumos y gastos â€” todo offline, desde el celular, sin necesidad de seÃ±al. Ideal para el campo mexicano y latinoamericano donde internet no llega.

**Target:** Agricultores, ganaderos, ingenieros agrÃ³nomos, dueÃ±os de ranchos, cooperativas del campo.

**Dolor que resuelve:** "En el campo no hay internet. Llevo todo en libreta y luego paso a Excel. Pierdo tiempo y datos."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | BÃºsqueda de registros + reportes bÃ¡sicos |
| Standard | .exe + .apk | + PredicciÃ³n de rendimiento + alertas de insumos + fotos offline |
| Custom | .exe + .apk + cÃ³digo fuente | Todo + UI personalizada + reportes PDF con marca |

## MÃ³dulos

### ðŸŒ± MÃ³dulo Cultivos
- CRUD de lotes/parcelas: nombre, hectÃ¡reas, cultivo actual
- Siembra: fecha, variedad, densidad, lote
- Registro diario: riego, fertilizaciÃ³n, plagas, temperatura
- Historial de ciclos de cultivo por lote
- Fotos del cultivo por fecha (seguimiento visual)

### ðŸ„ MÃ³dulo Ganado
- Registro de animales: arete/nombre, especie, raza, fecha nacimiento
- Eventos: vacunaciÃ³n, desparasitaciÃ³n, pesaje, inseminaciÃ³n
- Alertas: prÃ³xima vacuna, prÃ³ximo pesaje
- Historial de salud por animal

### ðŸ“¦ MÃ³dulo Insumos
- CRUD de insumos: nombre, tipo (semilla, fertilizante, vacuna, herramienta)
- Entradas: compra con cantidad, fecha, proveedor, costo
- Salidas: aplicaciÃ³n a lote o animal
- Stock actual con alerta de mÃ­nimo

### ðŸ’° MÃ³dulo Gastos
- Registro de gastos: concepto, monto, categorÃ­a, lote asociado
- CategorÃ­as: insumos, mano de obra, maquinaria, transporte
- Reporte de costos por lote y por hectÃ¡rea
- Export CSV

### ðŸ“Š MÃ³dulo Reportes
- Costos del ciclo por lote
- Rendimiento estimado por hectÃ¡rea
- Historial de eventos por lote o animal
- Export PDF y CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  lotes: 'id, nombre, *hectareas, *cultivoActual, *createdBy, createdAt, updatedAt',
  ciclos: 'id, *loteId, *cultivo, *fechaSiembra, *fechaCosecha, *createdBy, createdAt, updatedAt',
  registros_diarios: 'id, *loteId, *fecha, *tipo, *descripcion, *fotos, *createdBy, createdAt',
  animales: 'id, *arete, nombre, *especie, *raza, *fechaNacimiento, *createdBy, createdAt, updatedAt',
  eventos_animal: 'id, *animalId, *tipo, *fecha, *descripcion, *proximaFecha, *createdBy, createdAt',
  insumos: 'id, nombre, *tipo, *stockActual, *stockMinimo, *unidad, *createdBy, createdAt, updatedAt',
  movimientos_insumo: 'id, *insumoId, *tipo, *cantidad, *loteId, *animalId, *proveedor, *costo, *createdBy, createdAt',
  gastos: 'id, *concepto, *monto, *categoria, *loteId, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Lotres activos, animales registrados, insumos bajos, gastos del mes |
| Lotres | Grid de lotes con cultivo actual, estado, Ãºltima actividad |
| Registro diario | Por lote: selector de tipo (riego/ferti/plaga) + descripciÃ³n + foto |
| Ganado | Lista + ficha por animal con eventos y prÃ³ximas alertas |
| Insumos | Tabla con stock, alerta roja si < mÃ­nimo, entradas/salidas |
| Gastos | Por lote o general, grÃ¡fico circular por categorÃ­a |

## IA integrada

- **BÃºsqueda**: buscar lotes, animales, insumos por nombre o arete
- **PredicciÃ³n**: "Basado en el historial de riego, sugiere regar el lote 3 maÃ±ana"
- **EstadÃ­sticas**: costo por hectÃ¡rea, animal con mÃ¡s eventos, insumo mÃ¡s usado
- **Full**: "Â¿CuÃ¡nto gastÃ© en fertilizante este ciclo?" â€” QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 lote, registro bÃ¡sico |
| Standard | $99 | .exe + .apk, ilimitado, fotos + alertas + IA |
| Custom | $199+ | Todo + UI personalizada + reportes PDF con logo del rancho + cÃ³digo fuente |

## WhatsApp para venta

```
Hola Angel, trabajo en el campo y casi nunca tengo internet.
Quiero AHA Campo para llevar registro de mis lotes y ganado
desde el celular. Plan Standard con .apk.
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear lote â†’ sembrar â†’ registro diario â†’ fotos
- [ ] Probar registro de animal con eventos (vacuna, pesaje)
- [ ] Probar insumos: entrada (compra) â†’ salida (aplicaciÃ³n)
- [ ] Probar alerta de stock mÃ­nimo
- [ ] Probar gasto por lote
- [ ] Probar fotos desde cÃ¡mara (.apk)
- [ ] Probar en .exe y .apk
