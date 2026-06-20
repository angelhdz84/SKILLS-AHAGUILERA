# AHA CRM

## Descripción
CRM minimalista offline para freelancers y pequeños negocios. Pipeline Kanban, contactos, cotizaciones PDF, facturación básica y reportes de ventas. Sin internet, sin mensualidades.

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
Resumen: deals activos, ingresos del mes, cotizaciones pendientes, nuevos contactos. Gráfico de pipeline (embudo) y ventas por mes.

### Módulo Contactos
CRUD: nombre, empresa, teléfono, email, dirección, notas. Historial de interacciones (llamada, email, reunión, nota) por contacto. Búsqueda instantánea IA por nombre, empresa o teléfono.

**Campos sensibles:** email, teléfono (cifrar con CryptoJS)

### Módulo Pipeline (Kanban)
Tablero visual con columnas: prospecto, contactado, propuesta enviada, negociación, cerrado ganado, cerrado perdido. Arrastrar deals entre etapas con Alpine.js drag. Cada deal: nombre, contacto asociado, monto, probabilidad (%), fecha de cierre estimada.

### Módulo Cotizaciones
Crear cotización desde un deal: agregar items con servicio, cantidad, precio unitario, subtotal. Total calculado automáticamente. Vista previa y generación de PDF con jsPDF. Estado: pendiente, aprobada, rechazada.

### Módulo Facturación
Generar factura desde deal cerrado. Folio automático (F-0001). Datos: cliente, items, total, fecha, vencimiento. Estados: pagada, pendiente, vencida. Export PDF.

### Módulo Reportes
Tasa de conversión por etapa. Ingresos por mes y por cliente. Deals perdidos con motivo. Export CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  contactos: 'id, nombre, *empresa, *telefono, email, *direccion, *notas, *createdBy, createdAt, updatedAt',
  deals: 'id, *contactoId, nombre, *monto, *etapa, *probabilidad, *fechaCierre, *motivoPerdida, *createdBy, createdAt, updatedAt',
  cotizaciones: 'id, *dealId, *contactoId, *items, *total, *estado, *pdfPath, *createdBy, createdAt, updatedAt',
  facturas: 'id, *dealId, *contactoId, *folio, *items, *total, *estado, *fechaVencimiento, *createdBy, createdAt, updatedAt',
  interacciones: 'id, *contactoId, *tipo, *nota, *fecha, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards métricas, gráfico embudo, tabla últimos deals |
| Contactos | Lista con búsqueda IA, modal CRUD, timeline de interacciones |
| Pipeline | Columnas Kanban con drag, modal deal detail |
| Cotizaciones | Lista, modal creación con items dinámicos, vista previa PDF |
| Facturas | Lista con estados, modal creación, PDF |
| Reportes | Selector período, gráficos, export CSV |

## Reglas de UI/UX

- Sidebar: dashboard, contactos, pipeline, cotizaciones, facturas, reportes
- Drag & drop en Kanban con Alpine.js sortable
- Modal para CRUD, no navegación
- Badge de estado coloreado en deals (verde=cerrado, amarillo=negociación, rojo=perdido)
- PDF preview en pestaña nueva antes de descargar
- Confirmación en eliminar contacto (advierte si tiene deals asociados)
- Toast feedback en cada operación
