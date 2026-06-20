# AHA PreFactura â€” PrefacturaciÃ³n offline para freelancers

## DescripciÃ³n comercial

Sistema de prefacturaciÃ³n offline para freelancers y pequeÃ±os negocios. Genera facturas con folio automÃ¡tico, exporta XML y PDF, lleva el control de clientes con RFC y productos/servicios. Sin internet, sin mensualidades.

> **Nota importante:** AHA PreFactura genera el comprobante fiscal offline (XML+PDF). No envÃ­a al SAT/SUNAT automÃ¡ticamente. El cliente descarga el XML y lo sube manualmente al portal fiscal cuando tenga internet.

**Target:** Freelancers, profesionistas independientes, pequeÃ±os negocios que facturan ocasionalmente.

**Dolor que resuelve:** "Necesito facturar pero no siempre tengo internet y no quiero pagar suscripciÃ³n mensual solo para hacer 5 facturas al mes."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ¢ MÃ³dulo Clientes Fiscales
- CRUD: nombre/razÃ³n social, RFC, rÃ©gimen fiscal, direcciÃ³n fiscal, email, telÃ©fono
- BÃºsqueda instantÃ¡nea por nombre o RFC
- ValidaciÃ³n bÃ¡sica de RFC (formato)

### ðŸ“¦ MÃ³dulo Productos/Servicios
- CRUD: clave (similar a SAT), nombre, precio unitario, IVA aplicable
- ClasificaciÃ³n por categorÃ­a fiscal
- BÃºsqueda por clave o nombre

### ðŸ§¾ MÃ³dulo Facturas
- Crear factura: seleccionar cliente, agregar productos/servicios
- Folio automÃ¡tico por serie (ej: F-001, F-002...)
- CÃ¡lculo automÃ¡tico: subtotal, IVA, total
- GeneraciÃ³n PDF con formato fiscal
- GeneraciÃ³n XML descargable

### ðŸ“œ MÃ³dulo Historial
- Lista de facturas emitidas con filtros por fecha, cliente, folio
- Vista detalle con opciones: ver PDF, descargar XML, reimprimir
- EstadÃ­sticas: total facturado por mes, por cliente

### ðŸ“Š MÃ³dulo Reportes
- Dashboard: total facturado mes, facturas emitidas, clientes registrados
- GrÃ¡fico de ingresos por mes (ApexCharts)
- Export a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  clientes_fiscales: 'id, nombre, *rfc, *regimen, direccion, email, *telefono, createdAt, updatedAt',
  productos_fiscales: 'id, *clave, nombre, precioUnitario, *iva, *categoria, createdAt',
  facturas: 'id, *folio, *serie, *clienteId, subtotal, iva, total, *createdBy, createdAt',
  facturas_items: 'id, *facturaId, *productoId, cantidad, precioUnitario, importe'
})
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | $29 |
| Standard | $49 |
| Custom | $99+ |

## WhatsApp para venta

```
Hola Angel, necesito facturar sin pagar mensualidades ni tener
internet todo el tiempo. Â¿AHA PreFactura plan Standard?


