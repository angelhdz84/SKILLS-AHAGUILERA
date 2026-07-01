# AHA Inventario — Control de stock offline para pequeños negocios

## Descripción comercial

Sistema de inventario offline para tiendas, bodegas y almacenes. Registro de productos, control de stock, alertas de bajo inventario, escaneo QR y reportes. Sin internet, sin mensualidades.

**Target:** Tiendas minoristas, bodegas, almacenes pequeños, emprendedores, ferreterías, abarrotes.

**Dolor que resuelve:** "Perdemos ventas porque no sabemos qué tenemos en existencia hasta que el cliente pregunta."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 📦 Módulo Productos
- CRUD: nombre, SKU, categoría, precio, cantidad, imagen, umbral mínimo
- Búsqueda instantánea por nombre/SKU
- Código QR único por producto con opción de imprimir
- Escaneo QR desde cámara (.apk)

### 🗂️ Módulo Categorías
- CRUD de categorías con nombre y color
- Productos por categoría en dashboard

### 📥 Módulo Movimientos
- Entradas y salidas de stock: producto, cantidad, motivo, fecha
- Historial completo de movimientos
- Tipo: compra, venta, ajuste, merma, transferencia

### ⚠️ Módulo Alertas
- Umbral mínimo configurable por producto
- Notificación visual en sidebar
- Lista de productos por debajo del mínimo

### 📊 Módulo Reportes
- Dashboard: total productos, valor stock, bajo stock, actividad reciente
- Reportes con gráficos Chart.js
- Export a CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  categorias: 'id, nombre, *color, createdAt, updatedAt',
  productos: 'id, nombre, *sku, *categoriaId, precio, cantidad, *imagen, *umbralMinimo, *createdBy, createdAt, updatedAt',
  movimientos: 'id, *productoId, *tipo, cantidad, *motivo, *createdBy, createdAt',
  alertas: 'id, *productoId, *tipo, leida, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
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
sin pagar mensualidades. ¿AHA Inventario plan Standard
con .exe y .apk?
```


