# AHA Campo — Registro de campo offline para agricultura y ganadería

## Descripción comercial

Lleva el registro diario de tus lotes de cultivo, ganado, insumos y gastos — todo offline, desde el celular, sin necesidad de señal. Ideal para el campo mexicano y latinoamericano donde internet no llega.

**Target:** Agricultores, ganaderos, ingenieros agrónomos, dueños de ranchos, cooperativas del campo.

**Dolor que resuelve:** "En el campo no hay internet. Llevo todo en libreta y luego paso a Excel. Pierdo tiempo y datos."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | NeutralinoJS .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 🌱 Módulo Cultivos
- CRUD de lotes/parcelas: nombre, hectáreas, cultivo actual
- Siembra: fecha, variedad, densidad, lote
- Registro diario: riego, fertilización, plagas, temperatura
- Historial de ciclos de cultivo por lote
- Fotos del cultivo por fecha (seguimiento visual)

### 🐄 Módulo Ganado
- Registro de animales: arete/nombre, especie, raza, fecha nacimiento
- Eventos: vacunación, desparasitación, pesaje, inseminación
- Alertas: próxima vacuna, próximo pesaje
- Historial de salud por animal

### 📦 Módulo Insumos
- CRUD de insumos: nombre, tipo (semilla, fertilizante, vacuna, herramienta)
- Entradas: compra con cantidad, fecha, proveedor, costo
- Salidas: aplicación a lote o animal
- Stock actual con alerta de mínimo

### 💰 Módulo Gastos
- Registro de gastos: concepto, monto, categoría, lote asociado
- Categorías: insumos, mano de obra, maquinaria, transporte
- Reporte de costos por lote y por hectárea
- Export CSV

### 📊 Módulo Reportes
- Costos del ciclo por lote
- Rendimiento estimado por hectárea
- Historial de eventos por lote o animal
- Export PDF y CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt',
  lotes: 'id, *uuid, nombre, *hectareas, *cultivoActual, *createdBy, createdAt, updatedAt',
  ciclos: 'id, *uuid, *loteId, *cultivo, *fechaSiembra, *fechaCosecha, *createdBy, createdAt, updatedAt',
  registros_diarios: 'id, *uuid, *loteId, *fecha, *tipo, *descripcion, *fotos, *createdBy, createdAt',
  animales: 'id, *uuid, *arete, nombre, *especie, *raza, *fechaNacimiento, *createdBy, createdAt, updatedAt',
  eventos_animal: 'id, *uuid, *animalId, *tipo, *fecha, *descripcion, *proximaFecha, *createdBy, createdAt',
  insumos: 'id, *uuid, nombre, *tipo, *stockActual, *stockMinimo, *unidad, *createdBy, createdAt, updatedAt',
  movimientos_insumo: 'id, *uuid, *insumoId, *tipo, *cantidad, *loteId, *animalId, *proveedor, *costo, *createdBy, createdAt',
  gastos: 'id, *uuid, *concepto, *monto, *categoria, *loteId, *createdBy, createdAt'
});
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Lotres activos, animales registrados, insumos bajos, gastos del mes |
| Lotres | Grid de lotes con cultivo actual, estado, última actividad |
| Registro diario | Por lote: selector de tipo (riego/ferti/plaga) + descripción + foto |
| Ganado | Lista + ficha por animal con eventos y próximas alertas |
| Insumos | Tabla con stock, alerta roja si < mínimo, entradas/salidas |
| Gastos | Por lote o general, gráfico circular por categoría |

## IA integrada

- **Búsqueda**: buscar lotes, animales, insumos por nombre o arete
- **Predicción**: "Basado en el historial de riego, sugiere regar el lote 3 mañana"
- **Estadísticas**: costo por hectárea, animal con más eventos, insumo más usado
- **Full**: "¿Cuánto gasté en fertilizante este ciclo?" — QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 lote, registro básico |
| Standard | $99 | .exe + .apk, ilimitado, fotos + alertas + IA |
| Custom | $199+ | Todo + UI personalizada + reportes PDF con logo del rancho + código fuente |

## WhatsApp para venta

```
Hola Angel, trabajo en el campo y casi nunca tengo internet.
Quiero AHA Campo para llevar registro de mis lotes y ganado
desde el celular. Plan Standard con .apk.
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear lote → sembrar → registro diario → fotos
- [ ] Probar registro de animal con eventos (vacuna, pesaje)
- [ ] Probar insumos: entrada (compra) → salida (aplicación)
- [ ] Probar alerta de stock mínimo
- [ ] Probar gasto por lote
- [ ] Probar fotos desde cámara (.apk)
- [ ] Probar en .exe y .apk


