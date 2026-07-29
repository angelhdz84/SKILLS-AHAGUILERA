# AHA Creador â€” GestiÃ³n de contenido para YouTubers y creadores

## DescripciÃ³n comercial

Planifica tus videos, gestiona patrocinios, organiza ideas y lleva el control de ingresos â€” todo offline, sin depender de internet para lo importante. Ideal para creadores que quieren organizar su producciÃ³n sin pagar herramientas SaaS caras.

**Target:** YouTubers, streamers, podcasters, creadores de contenido, agencies pequeÃ±as.

**Dolor que resuelve:** "Tengo las ideas en 5 notas distintas y los patrocinios en un Excel. Necesito todo en un solo lugar, sin pagar $30/mes."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | NeutralinoJS .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ’¡ MÃ³dulo Banco de Ideas
- CRUD de ideas: tÃ­tulo, descripciÃ³n, etiquetas, prioridad (baja/media/alta)
- Estado: idea, en producciÃ³n, publicado, archivado
- BÃºsqueda y filtro por etiqueta/prioridad/estado

### ðŸ“… MÃ³dulo Calendario Editorial
- Vista mensual y semanal
- Arrastrar video a fecha de publicaciÃ³n
- Colores por estado (planificado, grabando, editando, publicado)
- Recordatorio de fecha lÃ­mite por video

### ðŸ“ MÃ³dulo ProducciÃ³n
- Checklist por video: guiÃ³n, grabaciÃ³n, ediciÃ³n, thumbnail, publicaciÃ³n
- Notas de producciÃ³n por video
- Asignar colaborador (solo nombre, sin login)

### ðŸ’° MÃ³dulo Patrocinios
- CRUD de marcas/patrocinadores
- Por patrocinio: marca, monto, fecha entrega, estado, contrato (notas)
- Historial de pagos por marca
- Ingresos totales: ads + patrocinios + membresÃ­as

### ðŸ“Š MÃ³dulo Reportes
- Ingresos del mes con grÃ¡fico de barras
- Videos publicados vs planificados
- Top marcas por ingreso
- Export CSV de todo

## Tablas Dexie

```javascript
db.version(1).stores({
  ideas: 'id, titulo, *descripcion, *etiquetas, prioridad, *estado, *createdBy, createdAt, updatedAt',
  videos: 'id, *ideaId, titulo, *fechaPublicacion, *estado, *checklist, *notas, *colaborador, *createdBy, createdAt, updatedAt',
  marcas: 'id, nombre, *contacto, *createdBy, createdAt, updatedAt',
  patrocinios: 'id, *marcaId, *monto, *fechaEntrega, *estado, *notas, *createdBy, createdAt, updatedAt',
  ingresos: 'id, *fuente, *monto, *fecha, *categoria, *createdBy, createdAt',
  colaboradores: 'id, nombre, *rol, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Videos del mes, pendientes, ingresos totales, patrocinios activos |
| Banco de ideas | Grid/tabla con filtros por etiqueta/prioridad/estado, bÃºsqueda IA |
| Calendario | Grid mensual con dots de videos, drag a fecha |
| ProducciÃ³n | Checklist interactivo por video, notas, asignar colaborador |
| Patrocinios | Tarjetas por marca, barra de progreso por estado |
| Reportes | GrÃ¡fico ingresos, tabla exportable |

## IA integrada

- **BÃºsqueda**: buscar ideas y videos por tÃ­tulo o descripciÃ³n
- **PredicciÃ³n**: "EstÃ¡s produciendo 3 videos esta semana. Tu promedio es 2. Sugiero ajustar calendario"
- **EstadÃ­sticas**: ingresos por fuente, mes mÃ¡s productivo, tiempo promedio de producciÃ³n
- **Full**: "Â¿CuÃ¡nto he ganado en patrocinios este trimestre?" â€” QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, ideas + calendario bÃ¡sico |
| Standard | $99 | .exe + .apk, todos los mÃ³dulos + IA predicciÃ³n |
| Custom | $199+ | Todo + UI personalizada + plantillas de checklist + cÃ³digo fuente |

## WhatsApp para venta

```
Hola Angel, necesito organizar mi contenido de YouTube
sin pagar herramientas online. Â¿AHA Creador plan Standard
con .exe y .apk?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: idea â†’ video en producciÃ³n â†’ checklist â†’ publicado
- [ ] Probar calendario con drag a fecha
- [ ] Probar patrocinio: crear marca â†’ asignar monto â†’ cambiar estado
- [ ] Probar grÃ¡fico de ingresos con datos de prueba
- [ ] Probar export CSV
- [ ] Probar en .exe y .apk


