# AHA Inventario â€” Control de stock offline para pequeÃ±os negocios

## DescripciÃ³n comercial

Sistema de inventario offline para tiendas, bodegas y almacenes. Registro de productos, control de stock, alertas de bajo inventario, escaneo QR y reportes. Sin internet, sin mensualidades.

**Target:** Tiendas minoristas, bodegas, almacenes pequeÃ±os, emprendedores, ferreterÃ­as, abarrotes.

**Dolor que resuelve:** "Perdemos ventas porque no sabemos quÃ© tenemos en existencia hasta que el cliente pregunta."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ“¦ MÃ³dulo Productos
- CRUD: nombre, SKU, categorÃ­a, precio, cantidad, imagen, umbral mÃ­nimo
- BÃºsqueda instantÃ¡nea por nombre/SKU
- CÃ³digo QR Ãºnico por producto con opciÃ³n de imprimir
- Escaneo QR desde cÃ¡mara (.apk)

### ðŸ—‚ï¸ MÃ³dulo CategorÃ­as
- CRUD de categorÃ­as con nombre y color
- Productos por categorÃ­a en dashboard

### ðŸ“¥ MÃ³dulo Movimientos
- Entradas y salidas de stock: producto, cantidad, motivo, fecha
- Historial completo de movimientos
- Tipo: compra, venta, ajuste, merma, transferencia

### âš ï¸ MÃ³dulo Alertas
- Umbral mÃ­nimo configurable por producto
- NotificaciÃ³n visual en sidebar
- Lista de productos por debajo del mÃ­nimo

### ðŸ“Š MÃ³dulo Reportes
- Dashboard: total productos, valor stock, bajo stock, actividad reciente
- Reportes con grÃ¡ficos Chart.js
- Export a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  categorias: 'id, nombre, *color, createdAt',
  productos: 'id, nombre, *sku, *categoriaId, precio, cantidad, *imagen, *umbralMinimo, *createdBy, createdAt, updatedAt',
  movimientos: 'id, *productoId, *tipo, cantidad, *motivo, *createdBy, createdAt',
  alertas: 'id, *productoId, *tipo, leida, createdAt'
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
Hola Angel, necesito controlar el inventario de mi tienda
sin pagar mensualidades. Â¿AHA Inventario plan Standard
con .exe y .apk?
```


