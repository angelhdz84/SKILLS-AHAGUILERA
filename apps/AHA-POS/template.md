# AHA POS â€” Punto de venta offline para pequeÃ±os comercios

## DescripciÃ³n comercial

Sistema POS (punto de venta) offline para tiendas, ferias, puestos y pequeÃ±os comercios. Carrito de compras rÃ¡pido, escaneo de cÃ³digos de barras, corte de caja diario y reportes de ventas. Sin internet, sin mensualidades.

**Target:** Tiendas de barrio, ferias, puestos de mercado, pequeÃ±os comercios, emprendedores.

**Dolor que resuelve:** "Cuando no hay internet no puedo cobrar y pierdo la venta."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ·ï¸ MÃ³dulo Productos
- CRUD: nombre, cÃ³digo barras, precio, categorÃ­a, stock, imagen
- Escaneo de cÃ³digo de barras desde cÃ¡mara (.apk)
- BÃºsqueda instantÃ¡nea por nombre o cÃ³digo

### ðŸ›’ MÃ³dulo Ventas (Carrito)
- Agregar productos por escaneo o bÃºsqueda
- Cantidad, descuento por producto, subtotal en tiempo real
- MÃºltiples formas de pago: efectivo, tarjeta, transferencia
- Ticket de venta en pantalla (imprimible)

### 💵 Módulo Corte
- **Arqueo**: ingreso de montos por denominación (billetes/monedas), total calculado vs esperado, alerta de descuadre
- **Gastos Menores**: registro rápido de gasto con concepto y monto, se descuenta del fondo de caja
- **Cierre**: congela el corte del turno, inicia nuevo corte automáticamente
- **Historial**: cortes anteriores con detalle de arqueo y gastos, exportable

### â†©ï¸ MÃ³dulo Devoluciones
- Seleccionar venta del historial, elegir productos a devolver
- Registrar motivo, reembolso parcial o total
- Afecta inventario automÃ¡ticamente

### ðŸ“Š MÃ³dulo Reportes
- Dashboard: ventas hoy, productos top, corte activo
- Ventas por dÃ­a/semana/mes con grÃ¡ficos Chart.js
- Export a CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  categorias: 'id, nombre, color, createdAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento',
  cortes: 'id, *folio, apertura, cierre, totalEsperado, totalReal, *createdBy, createdAt',
  devoluciones: 'id, *ventaId, *productoId, cantidad, *motivo, reembolso, createdAt',
  gastosMenores: 'id, *corteId, *concepto, monto, *hora, *createdBy, createdAt'
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
sin pagar mensualidades. Â¿AHA POS plan Standard con .exe y .apk?


