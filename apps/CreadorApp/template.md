# CreadorApp — Gestión de contenido para YouTubers y creadores

## Descripción comercial

Planifica tus videos, gestiona patrocinios, organiza ideas y lleva el control de ingresos — todo offline, sin depender de internet para lo importante. Ideal para creadores que quieren organizar su producción sin pagar herramientas SaaS caras.

**Target:** YouTubers, streamers, podcasters, creadores de contenido, agencies pequeñas.

**Dolor que resuelve:** "Tengo las ideas en 5 notas distintas y los patrocinios en un Excel. Necesito todo en un solo lugar, sin pagar $30/mes."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | Búsqueda de ideas y videos + estadísticas |
| Standard | .exe + .apk | + Predicción de ingresos + calendario editorial inteligente |
| Custom | .exe + .apk + código fuente | Todo + UI personalizada + informe automático |

## Módulos

### 💡 Módulo Banco de Ideas
- CRUD de ideas: título, descripción, etiquetas, prioridad (baja/media/alta)
- Estado: idea, en producción, publicado, archivado
- Búsqueda y filtro por etiqueta/prioridad/estado

### 📅 Módulo Calendario Editorial
- Vista mensual y semanal
- Arrastrar video a fecha de publicación
- Colores por estado (planificado, grabando, editando, publicado)
- Recordatorio de fecha límite por video

### 📝 Módulo Producción
- Checklist por video: guión, grabación, edición, thumbnail, publicación
- Notas de producción por video
- Asignar colaborador (solo nombre, sin login)

### 💰 Módulo Patrocinios
- CRUD de marcas/patrocinadores
- Por patrocinio: marca, monto, fecha entrega, estado, contrato (notas)
- Historial de pagos por marca
- Ingresos totales: ads + patrocinios + membresías

### 📊 Módulo Reportes
- Ingresos del mes con gráfico de barras
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
| Banco de ideas | Grid/tabla con filtros por etiqueta/prioridad/estado, búsqueda IA |
| Calendario | Grid mensual con dots de videos, drag a fecha |
| Producción | Checklist interactivo por video, notas, asignar colaborador |
| Patrocinios | Tarjetas por marca, barra de progreso por estado |
| Reportes | Gráfico ingresos, tabla exportable |

## IA integrada

- **Búsqueda**: buscar ideas y videos por título o descripción
- **Predicción**: "Estás produciendo 3 videos esta semana. Tu promedio es 2. Sugiero ajustar calendario"
- **Estadísticas**: ingresos por fuente, mes más productivo, tiempo promedio de producción
- **Full**: "¿Cuánto he ganado en patrocinios este trimestre?" — QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, ideas + calendario básico |
| Standard | $99 | .exe + .apk, todos los módulos + IA predicción |
| Custom | $199+ | Todo + UI personalizada + plantillas de checklist + código fuente |

## WhatsApp para venta

```
Hola Angel, necesito organizar mi contenido de YouTube
sin pagar herramientas online. ¿CreadorApp plan Standard
con .exe y .apk?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: idea → video en producción → checklist → publicado
- [ ] Probar calendario con drag a fecha
- [ ] Probar patrocinio: crear marca → asignar monto → cambiar estado
- [ ] Probar gráfico de ingresos con datos de prueba
- [ ] Probar export CSV
- [ ] Probar en .exe y .apk
