# AHA POS — Punto de venta offline para pequeños comercios

## Descripción comercial

Sistema POS (punto de venta) offline para tiendas, ferias, puestos y pequeños comercios. Carrito de compras rápido, escaneo de códigos de barras, corte de caja diario y reportes de ventas. Sin internet, sin mensualidades.

**Target:** Tiendas de barrio, ferias, puestos de mercado, pequeños comercios, emprendedores.

**Dolor que resuelve:** "Cuando no hay internet no puedo cobrar y pierdo la venta."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 🏷️ Módulo Productos
- CRUD: nombre, código barras, precio, categoría, stock, imagen
- Escaneo de código de barras desde cámara (.apk)
- Búsqueda instantánea por nombre o código

### 🛒 Módulo Ventas (Carrito)
- Agregar productos por escaneo o búsqueda
- Cantidad, descuento por producto, subtotal en tiempo real
- Múltiples formas de pago: efectivo, tarjeta, transferencia
- Ticket de venta en pantalla (imprimible)

### 💵 Módulo Corte
- **Arqueo**: ingreso de montos por denominación (billetes/monedas), total calculado vs esperado, alerta de descuadre
- **Gastos Menores**: registro rápido de gasto con concepto y monto, se descuenta del fondo de caja
- **Cierre**: congela el corte del turno, inicia nuevo corte automáticamente
- **Historial**: cortes anteriores con detalle de arqueo y gastos, exportable

### ↩️ Módulo Devoluciones
- Seleccionar venta del historial, elegir productos a devolver
- Registrar motivo, reembolso parcial o total
- Afecta inventario automáticamente

### 📊 Módulo Reportes
- Dashboard: ventas hoy, productos top, corte activo
- Ventas por día/semana/mes con gráficos Chart.js
- Export a CSV

## Tablas Dexie

```javascript
db.version(3).stores({
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  categorias: 'id, nombre, color, createdAt, updatedAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt, updatedAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento',
  cortes: 'id, *folio, apertura, cierre, totalEsperado, totalReal, *createdBy, createdAt, updatedAt',
  devoluciones: 'id, *ventaId, *productoId, cantidad, *motivo, reembolso, createdAt',
  gastosMenores: 'id, *corteId, *concepto, monto, *hora, *createdBy, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});

## Migración Dexie

```javascript
// v1: tablas de sistema (creación inicial)
// v2: tablas de negocio v1 (categorias, productos, ventas, ventas_items)
// v3: añade cortes, devoluciones, gastosMenores + descuentoTotal en ventas

db.version(1).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt'
});

db.version(2).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt',
  categorias: 'id, nombre, color, createdAt, updatedAt',
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt, updatedAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento'
}).upgrade(tx => {
  // v2 no migra datos de v1 porque v1 solo tiene tablas de sistema
  return Promise.resolve();
});

db.version(3).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt',
  categorias: 'id, nombre, color, createdAt, updatedAt',
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt, updatedAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento',
  cortes: 'id, *folio, apertura, cierre, totalEsperado, totalReal, *createdBy, createdAt, updatedAt',
  devoluciones: 'id, *ventaId, *productoId, cantidad, *motivo, reembolso, createdAt',
  gastosMenores: 'id, *corteId, *concepto, monto, *hora, *createdBy, createdAt'
}).upgrade(tx => {
  return tx.table('ventas').toCollection().modify(v => {
    if (typeof v.descuentoTotal === 'undefined') v.descuentoTotal = 0;
  });
});

window.DB_VERSION = 3;
```
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | $49 |
| Standard | $99 |
| Custom | $199+ |

## WhatsApp para venta

```
Hola Angel, necesito un punto de venta offline para mi tienda
sin pagar mensualidades. ¿AHA POS plan Standard con .exe y .apk?
```
