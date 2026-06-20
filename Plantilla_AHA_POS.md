# AHA POS

## Descripción
Sistema POS (punto de venta) offline para pequeños comercios. Carrito de compras rápido, escaneo de códigos de barras, corte de caja diario, devoluciones y reportes de ventas. Sin internet, pago único.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- qrcode.min.js
- dayjs.min.js

## Módulos

### Módulo Dashboard
Resumen con ventas del día, productos más vendidos, corte de caja activo y transacciones recientes. Gráficos con ApexCharts.

### Módulo Productos
CRUD completo: nombre, código de barras único, categoría, precio de venta, stock actual, imagen (base64 local). Escaneo de código de barras desde cámara (.apk) usando qrcode.js. Búsqueda instantánea por nombre o código.

### Módulo Ventas (Carrito)
Flujo: buscar producto → seleccionar cantidad → aplicar descuento (opcional) → agregar al carrito. Resumen en tiempo real con subtotal, IVA y total. Formas de pago: efectivo, tarjeta, transferencia. Al cobrar: genera ticket en pantalla, descuenta stock automáticamente. Ticket imprimible con datos del negocio.

**Campos sensibles:** precio, descuento (cifrar con CryptoJS)

### Módulo Corte de Caja
Apertura de caja con monto inicial. Durante el turno acumula ventas. Al cerrar: muestra total ventas por método de pago, número de transacciones, diferencia efectivo esperado vs real. Historial de cortes anteriores.

### Módulo Devoluciones
Buscar venta por folio, seleccionar productos a devolver, registrar motivo, calcular reembolso (parcial o total). Afecta inventario: regresa productos al stock. Historial de devoluciones por venta.

### Módulo Reportes
Dashboard de ventas por día/semana/mes con gráficos ApexCharts (barras, línea). Top productos más vendidos. Export a CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  categorias: 'id, nombre, color, createdAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento',
  cortes: 'id, *folio, apertura, cierre, totalEsperado, totalReal, *createdBy, createdAt',
  devoluciones: 'id, *ventaId, *productoId, cantidad, *motivo, reembolso, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards (ventas hoy, productos top, corte activo), tabla transacciones recientes, gráfico ventas última semana |
| Productos | Tabla con buscador, filtro por categoría, modal CRUD, botón escanear QR |
| Ventas | Panel carrito (izquierda): lista productos, total, botón cobrar. Panel búsqueda (derecha): input código/nombre, resultados, botón agregar |
| Corte Caja | Formulario apertura, resumen turno activo, historial cortes anteriores |
| Devoluciones | Buscador de venta por folio, selector productos, motivo, confirmación reembolso |
| Reportes | Selector período, gráficos ApexCharts, tabla top productos, botón export CSV |

## Reglas de UI/UX

- Sidebar con iconos Bootstrap: dashboard, productos, ventas, cortes, devoluciones, reportes
- La pantalla de ventas debe ser la principal al abrir la app (flujo rápido)
- Carrito de compras con actualización en tiempo real (x-effect Alpine)
- Input de código de barras con autofocus y soporte de escáner USB (solo teclear código)
- Modal para cobro con selector de método de pago
- Badge en corte de caja si hay uno activo
- Confirmación antes de cerrar corte de caja
- Toast feedback en cada operación CRUD
- Ticket de venta con diseño limpio y datos del negocio (nombre, RFC, teléfono)
