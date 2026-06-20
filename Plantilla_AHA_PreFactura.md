# AHA PreFactura

## Descripción
Sistema de prefacturación offline para freelancers y pequeños negocios. Genera facturas con folio automático, exporta XML y PDF, control de clientes con RFC y productos/servicios. El XML se descarga para subir manualmente al portal fiscal. Sin internet, pago único.

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
Resumen: total facturado en el mes, facturas emitidas hoy, clientes registrados, últimas facturas. Gráficos con ApexCharts.

### Módulo Clientes Fiscales
CRUD completo: nombre o razón social, RFC (con validación básica de formato), régimen fiscal (dropdown con regímenes comunes), dirección fiscal, email, teléfono. Búsqueda instantánea por nombre o RFC.

**Campos sensibles:** RFC, dirección fiscal (cifrar con CryptoJS)

### Módulo Productos/Servicios
CRUD: clave interna, nombre, precio unitario, IVA aplicable (sí/no/tasa 0), categoría fiscal. Búsqueda por clave o nombre. Catálogo simple sin conexión a SAT.

### Módulo Facturas
Crear factura: seleccionar cliente → agregar productos/servicios con cantidad → cálculo automático (subtotal → IVA → total). Folio automático con serie configurable (ej: F-001). Fecha de emisión automática. Generación de PDF con:
- Datos del emisor (configurables en settings)
- Datos del cliente (RFC, razón social, dirección)
- Tabla de conceptos con cantidades, precios, importes
- Totales: subtotal, IVA, total
- Folio y fecha
- QR con datos de la factura (texto plano)
- Número de folio + serie

Generación de XML descargable con estructura CFDI básica (sin PAC/timbre).

### Módulo Historial
Lista de facturas emitidas con filtros por fecha, cliente, folio. Vista detalle: ver PDF, descargar XML, reimprimir. Anular factura (marca como anulada, no borra).

### Módulo Reportes
Dashboard: total facturado por mes (gráfico), top clientes por monto, facturas por mes. Export a CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  clientes_fiscales: 'id, nombre, *rfc, *regimen, direccion, email, *telefono, createdAt, updatedAt',
  productos_fiscales: 'id, *clave, nombre, precioUnitario, *iva, *categoria, createdAt',
  facturas: 'id, *folio, *serie, *clienteId, subtotal, iva, total, *createdBy, createdAt',
  facturas_items: 'id, *facturaId, *productoId, cantidad, precioUnitario, importe'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards (total mes, facturas hoy, clientes), gráfico ingresos por mes, tabla últimas facturas |
| Clientes | Tabla con buscador por nombre/RFC, modal CRUD, badge régimen fiscal |
| Productos | Tabla con buscador, modal CRUD, selector IVA (sí/no/tasa 0) |
| Facturas | Formulario: selector cliente (buscador), tabla dinámica de conceptos, totales en vivo, botón "Generar PDF" y "Descargar XML" |
| Historial | Tabla cronológica con estado (activa/anulada), filtros, botones ver PDF / descargar XML / anular |
| Reportes | Selector período, gráficos ApexCharts, botón export CSV |

## Reglas de UI/UX

- Sidebar con iconos Bootstrap: dashboard, clientes, productos, facturas, historial, reportes
- Settings accesible desde sidebar: datos del emisor (nombre, RFC, régimen, dirección) para el PDF
- Al crear factura: cálculo de totales en tiempo real al agregar/quitar conceptos
- Tabla de conceptos editable inline (no modal para cada línea)
- Folio auto-incremental por serie, configurable desde settings
- Botones "Ver PDF" y "Descargar XML" separados en vista detalle
- Confirmación antes de anular factura
- Toast feedback en cada operación CRUD
- El PDF debe tener diseño fiscal profesional (no genérico)
- El XML debe ser válido contra estructura CFDI básica
