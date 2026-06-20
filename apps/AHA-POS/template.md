# AHA POS — Punto de venta offline para pequeños comercios

## Descripción comercial

Sistema POS (punto de venta) offline para tiendas, ferias, puestos y pequeños comercios. Carrito de compras rápido, escaneo de códigos de barras, corte de caja diario y reportes de ventas. Sin internet, sin mensualidades.

**Target:** Tiendas de barrio, ferias, puestos de mercado, pequeños comercios, emprendedores.

**Dolor que resuelve:** "Cuando no hay internet no puedo cobrar y pierdo la venta."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | Búsqueda de productos + alertas de stock |
| Standard | .exe + .apk | + Predicción de productos más vendidos por hora |
| Custom | .exe + .apk + código fuente | Todo + UI con logo del negocio |

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

### 💵 Módulo Corte de Caja
- Apertura y cierre de caja por turno
- Resumen: total ventas, métodos de pago, número de transacciones
- Diferencia entre efectivo esperado vs real

### ↩️ Módulo Devoluciones
- Seleccionar venta del historial, elegir productos a devolver
- Registrar motivo, reembolso parcial o total
- Afecta inventario automáticamente

### 📊 Módulo Reportes
- Dashboard: ventas hoy, productos top, corte de caja activo
- Ventas por día/semana/mes con gráficos ApexCharts
- Export a CSV

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
