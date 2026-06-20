# AHA Creador

## Descripción
Gestión de contenido offline para YouTubers y creadores. Banco de ideas, calendario editorial, checklist de producción, patrocinios y reportes de ingresos. Sin pagar herramientas SaaS.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- dayjs.min.js

## Módulos

### Módulo Banco de Ideas
CRUD de ideas: título, descripción, etiquetas (separadas por coma), prioridad (baja/media/alta/urgente). Estados: idea, en producción, publicado, archivado. Búsqueda instantánea IA y filtros por etiqueta/prioridad/estado.

### Módulo Calendario Editorial
Vista mensual con dots de videos publicados/planificados. Vista semanal con timeline. Arrastrar idea a fecha para programar publicación. Colores por estado: verde=publicado, azul=planificado, naranja=en producción, gris=archivado.

### Módulo Producción
Checklist por video: guión, grabación, edición, thumbnail, descripción, publicación. Notas de producción por video (textarea libre). Asignar colaborador por nombre (sin login, solo referencia). Estado del video: planificado, grabando, editando, listo, publicado.

### Módulo Patrocinios
CRUD de marcas/patrocinadores: nombre, contacto, teléfono, email. Patrocinio: marca, monto acordado, fecha de entrega, estado (pendiente/en progreso/completado/pagado), notas del contrato. Historial de pagos por marca. Ingresos totales desglosados: ads + patrocinios + membresías + otros.

**Campos sensibles:** montos de patrocinio (cifrar)

### Módulo Reportes
Dashboard: videos publicados este mes, videos pendientes, ingresos totales, patrocinios activos. Gráfico de ingresos por mes (barras). Top marcas por ingreso. Videos por estado. Export CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  ideas: 'id, titulo, *descripcion, *etiquetas, prioridad, *estado, *createdBy, createdAt, updatedAt',
  videos: 'id, titulo, *ideaId, *fechaPublicacion, *estado, *checklist, *notas, *colaborador, *createdBy, createdAt, updatedAt',
  marcas: 'id, nombre, *contacto, *telefono, email, *createdBy, createdAt, updatedAt',
  patrocinios: 'id, *marcaId, monto, *fechaEntrega, *estado, *notasContrato, *createdBy, createdAt, updatedAt',
  ingresos: 'id, *fuente, monto, *fecha, *categoria, *marcaId, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards métricas, gráfico ingresos, tabla últimos videos |
| Banco ideas | Grid/tarjetas con etiquetas, filtros, búsqueda IA, modal CRUD |
| Calendario | Grid mensual + lista semanal, drag idea a fecha |
| Producción | Por video: checklist interactivo, notas, selector colaborador |
| Patrocinios | Tarjetas por marca, barra progreso estado, tabla pagos |
| Reportes | Selector período, gráfico barras, export CSV |

## Reglas de UI/UX

- Sidebar: dashboard, ideas, calendario, producción, patrocinios, reportes
- Tarjetas de ideas con color según prioridad (rojo=urgente, amarillo=alta, azul=media, gris=baja)
- Badge de estado en videos con color
- Checklist interactivo: tap para marcar/desmarcar con check animado
- Drag & drop en calendario para programar fecha
- Modal para CRUD, no navegación
- Tooltip con resumen al hover en calendario
- Confirmación al archivar idea
- Toast feedback en cada operación
