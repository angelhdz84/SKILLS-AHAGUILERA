# AHA Comanda

## Descripción
Toma de pedidos offline para restaurantes y bares. Gestión de mesas, comandas, platillos, cuentas con split y corte de caja. Sin internet, sin mensualidades.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- ninguna

## Módulos

### Módulo Mesas
CRUD de mesas: nombre/número, capacidad, ubicación (salón/terraza/barra). Mapa visual del salón con grid de mesas. Estados con color: disponible (verde), ocupada (rojo), cuenta solicitada (amarillo). Tap para cambiar estado.

### Módulo Platillos
CRUD: nombre, categoría, precio, disponible/agotado, foto local (base64). Categorías: bebidas, entradas, plato fuerte, postres. Marcar como "del día". Búsqueda instantánea IA.

**Campos sensibles:** precio (cifrar)

### Módulo Comandas
Seleccionar mesa → crear comanda. Agregar platillos por categoría con cantidad y notas por item ("sin cebolla", "término medio", "sin sal"). Comanda abierta: permite agregar items después. Historial de comandas cerradas. Estados: abierta, cerrada, cancelada.

### Módulo Cuentas
Cerrar comanda: muestra todos los items con subtotales. Split de cuenta: dividir entre N personas (automático o manual). Formas de pago: efectivo, tarjeta, transferencia, mixto. Corte de caja del día: total ventas, desglose por forma de pago, top 5 platillos, ticket promedio. Export PDF.

## Tablas Dexie

```javascript
db.version(1).stores({
  mesas: 'id, nombre, *capacidad, *ubicacion, estado, *createdBy, createdAt, updatedAt',
  categorias: 'id, nombre, *color, orden, createdAt',
  platillos: 'id, nombre, *categoriaId, precio, disponible, *foto, *createdBy, createdAt, updatedAt',
  comandas: 'id, *mesaId, *items, *estado, total, *notas, *createdBy, createdAt, updatedAt',
  cuentas: 'id, *comandaId, *split, *formaPago, total, *createdBy, createdAt',
  cortes: 'id, fecha, *totalVentas, *porFormaPago, *platillosVendidos, *ticketPromedio, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Mesas del día, comandas activas, total del día, platillo más vendido |
| Mapa mesas | Grid de mesas touch, colores por estado, tap para abrir comanda |
| Nueva comanda | Selector mesa → categorías acordeón → platillos con + → notas → confirmar |
| Comanda activa | Items, total parcial, botón +, botón cerrar cuenta |
| Split cuenta | Selector N personas, auto split o manual, formas de pago |
| Corte caja | Total día, por forma pago, top 5, export PDF |
| Admin | CRUD platillos y mesas con búsqueda IA |

## Reglas de UI/UX

- Sidebar: dashboard, mapa, admin, corte
- Interfaz táctil优先 (botones grandes, target mínimo 48px)
- Mapa de mesas tipo grid responsive (3-4 columnas según pantalla)
- Badge de estado en mesas con color vivo
- Modal para agregar items a comanda (no redirigir)
- Confirmación al cerrar cuenta (verificar que no falten items)
- Vista previa PDF del corte antes de exportar
- Toast feedback en cada operación
