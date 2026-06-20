# AHA PreFactura — Prefacturación offline para freelancers

## Descripción comercial

Sistema de prefacturación offline para freelancers y pequeños negocios. Genera facturas con folio automático, exporta XML y PDF, lleva el control de clientes con RFC y productos/servicios. Sin internet, sin mensualidades.

> **Nota importante:** AHA PreFactura genera el comprobante fiscal offline (XML+PDF). No envía al SAT/SUNAT automáticamente. El cliente descarga el XML y lo sube manualmente al portal fiscal cuando tenga internet.

**Target:** Freelancers, profesionistas independientes, pequeños negocios que facturan ocasionalmente.

**Dolor que resuelve:** "Necesito facturar pero no siempre tengo internet y no quiero pagar suscripción mensual solo para hacer 5 facturas al mes."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | Búsqueda de clientes por RFC + historial |
| Standard | .exe + .apk | + Cálculo automático de impuestos + estadísticas |
| Custom | .exe + .apk + código fuente | Todo + UI con logo del negocio |

## Módulos

### 🏢 Módulo Clientes Fiscales
- CRUD: nombre/razón social, RFC, régimen fiscal, dirección fiscal, email, teléfono
- Búsqueda instantánea por nombre o RFC
- Validación básica de RFC (formato)

### 📦 Módulo Productos/Servicios
- CRUD: clave (similar a SAT), nombre, precio unitario, IVA aplicable
- Clasificación por categoría fiscal
- Búsqueda por clave o nombre

### 🧾 Módulo Facturas
- Crear factura: seleccionar cliente, agregar productos/servicios
- Folio automático por serie (ej: F-001, F-002...)
- Cálculo automático: subtotal, IVA, total
- Generación PDF con formato fiscal
- Generación XML descargable

### 📜 Módulo Historial
- Lista de facturas emitidas con filtros por fecha, cliente, folio
- Vista detalle con opciones: ver PDF, descargar XML, reimprimir
- Estadísticas: total facturado por mes, por cliente

### 📊 Módulo Reportes
- Dashboard: total facturado mes, facturas emitidas, clientes registrados
- Gráfico de ingresos por mes (ApexCharts)
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
internet todo el tiempo. ¿AHA PreFactura plan Standard?
