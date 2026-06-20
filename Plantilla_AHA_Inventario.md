# AHA Inventario

## Descripción
Sistema de inventario offline para pequeños negocios. Control de stock, alertas, escaneo QR, reportes y exportación. Sin internet, sin servidores, pago único.

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
Resumen con total de productos, valor del stock, productos con bajo stock y actividad reciente. Gráficos con ApexCharts.

### Módulo Productos
CRUD completo: nombre, SKU único, categoría, precio, cantidad en stock, imagen (base64 local), umbral mínimo de stock. Búsqueda instantánea por nombre/SKU. Código QR único por producto generado con qrcode.js. Escaneo QR desde cámara (.apk). Botón de imprimir QR.

**Campos sensibles:** precio (cifrar con CryptoJS)

### Módulo Categorías
CRUD simple: nombre, color (selector de color). Las categorías se usan para filtrar productos en lista y dashboard.

### Módulo Movimientos
Registro de entradas y salidas de stock: seleccionar producto, cantidad, tipo (compra/venta/ajuste/merma/transferencia), motivo, fecha automática. Historial completo con filtros por producto, tipo y fecha.

### Módulo Alertas
Lista de productos con cantidad por debajo del umbral mínimo. Notificación visual en sidebar con badge. Marcar como leída.

### Módulo Reportes
Reportes con gráficos (ApexCharts): productos más vendidos, movimientos por mes, valor del stock por categoría. Exportación a CSV y PDF.

## Tablas Dexie

```javascript
db.version(1).stores({
  categorias: 'id, nombre, *color, createdAt',
  productos: 'id, nombre, *sku, *categoriaId, precio, cantidad, *imagen, *umbralMinimo, *createdBy, createdAt, updatedAt',
  movimientos: 'id, *productoId, *tipo, cantidad, *motivo, *createdBy, createdAt',
  alertas: 'id, *productoId, *tipo, leida, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards (total, valor, bajo stock), tabla actividad reciente, gráfico stock por categoría |
| Productos | Tabla con buscador, filtro por categoría, modal CRUD, botón QR, botón imprimir |
| Categorías | Lista con colores, modal creación, selector color |
| Movimientos | Tabla historial, filtros, modal entrada/salida |
| Alertas | Lista con badge rojo, botón marcar leída |
| Reportes | Selector período, gráficos ApexCharts, botón export CSV/PDF |

## Reglas de UI/UX

- Sidebar con iconos Bootstrap: dashboard, productos, categorías, movimientos, alertas, reportes
- Badge rojo en alertas si hay productos bajo stock
- Modal para CRUDs (no redirigir a otra página)
- Botón flotante "+" para nuevo producto en vista lista
- Tooltip en QR para instrucciones de escaneo
- Confirmación antes de eliminar cualquier registro
- Toast feedback en cada operación CRUD
