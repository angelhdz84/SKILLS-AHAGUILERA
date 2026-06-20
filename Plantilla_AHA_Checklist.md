# AHA Checklist

## Descripción
Inspecciones y checklists técnicos offline. Crea plantillas, captura resultados con fotos y firma digital, genera reportes PDF. Ideal para mantenimiento, seguridad y auditorías sin internet.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- dayjs.min.js

## Módulos

### Módulo Plantillas
CRUD de plantillas de inspección. Items con tipo: checklist (sí/no/na), valor numérico, texto libre, foto, firma. Reordenar items por drag & drop. Categorías: seguridad, limpieza, maquinaria, eléctrico, general.

### Módulo Inspecciones
Seleccionar plantilla → crear inspección. Asignar a ubicación/equipo. Recorrer items uno por uno. Capturar foto desde cámara (guardar como base64). Firma digital del inspector (canvas HTML5 touch). Resultado automático: aprobado (todos OK), rechazado (algún NO), observado (con notas). Fecha de próxima inspección sugerida.

### Módulo Ubicaciones
CRUD de ubicaciones: edificio, área, piso, código QR opcional. CRUD de equipos: nombre, código, ubicación, frecuencia de inspección (diaria/semanal/mensual), historial de inspecciones por equipo.

### Módulo Reportes
Reporte PDF de cada inspección: datos generales, resultados con fotos y firma, conclusión. Dashboard de cumplimiento: % aprobado vs rechazado por período. Equipos con más fallas. Export CSV del historial completo.

## Tablas Dexie

```javascript
db.version(1).stores({
  categorias_plantillas: 'id, nombre, createdAt',
  plantillas: 'id, nombre, *categoriaId, *items, orden, *createdBy, createdAt, updatedAt',
  ubicaciones: 'id, nombre, *area, *codigo, *createdBy, createdAt, updatedAt',
  equipos: 'id, nombre, *codigo, *ubicacionId, *frecuencia, *ultimaInspeccion, *createdBy, createdAt, updatedAt',
  inspecciones: 'id, *plantillaId, *ubicacionId, *equipoId, *resultados, *fotos, *firma, *resultado, *proximaFecha, *createdBy, createdAt, updatedAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Inspecciones hoy, % cumplimiento, equipos con fallas, próximas vencidas |
| Plantillas | Lista con búsqueda IA, CRUD con reorden drag & drop |
| Nueva inspección | Selector plantilla → ubicación/equipo → items uno por uno → foto → firma |
| Historial | Filtros por fecha/ubicación/equipo/resultado, export CSV |
| Reporte PDF | Vista previa con logo, fotos y firma incluidos |

## Reglas de UI/UX

- Sidebar: dashboard, plantillas, inspecciones, ubicaciones, reportes
- Items de inspección en vista tipo wizard (uno a la vez con swipe/next)
- Canvas de firma con botón "borrar" y "confirmar"
- Botón de foto con preview (usar input file accept="image/*" + capture)
- Badge resultado: verde (aprobado), rojo (rechazado), amarillo (observado)
- Vista previa PDF generado antes de guardar
- Confirmación al cerrar inspección si faltan items
- Toast feedback en cada operación
