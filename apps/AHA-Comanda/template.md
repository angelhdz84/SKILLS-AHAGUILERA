# AHA Comanda — Toma de pedidos offline para restaurantes y bares

## Descripción comercial

Sistema de comandas offline para restaurantes, bares y cocinas. El mesero toma el pedido desde una tablet o celular, la cocina lo recibe al instante (dentro de la misma red local), y al final se genera la cuenta con split de pago. Sin depender de internet, sin servidores, sin mensualidades.

**Target:** Restaurantes, bares, pizzerías, taquerías, cocinas económicas, food trucks.

**Dolor que resuelve:** "Se fue el internet y perdimos las comandas de toda la noche."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 🍽️ Módulo Mesas
- Gestión de mesas del local (nombre/número, capacidad, ubicación)
- Estados: disponible, ocupada, cuenta solicitada
- Mapa visual del salón con colores por estado
- Pasar/ocupar mesa desde touch

### 📝 Módulo Comandas
- Seleccionar mesa → crear comanda
- Agregar platillos por categoría
- Cantidad, notas por platillo ("sin cebolla", "término medio")
- Comanda abierta: se pueden agregar más items después
- Historial de comandas cerradas por fecha

### 🥘 Módulo Platillos / Menú
- CRUD de platillos: nombre, categoría, precio, disponible/no disponible
- Categorías: bebidas, entradas, plato fuerte, postres
- Foto del platillo (opcional, desde archivo local)
- Marcar platillo como "del día" o "agotado"

### 💳 Módulo Cuentas
- Cerrar comanda: total con subtotal por item
- Split de cuenta: dividir entre N personas
- Formas de pago: efectivo, tarjeta, transferencia
- Corte de caja del día: total ventas, por forma de pago, platillos más vendidos
- Exportar corte a PDF y CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt',
  mesas: 'id, *uuid, nombre, *capacidad, estado, *createdBy, createdAt, updatedAt',
  categorias: 'id, *uuid, nombre, *color, orden, createdAt, updatedAt',
  platillos: 'id, *uuid, nombre, *categoriaId, precio, disponible, *createdBy, createdAt, updatedAt',
  comandas: 'id, *uuid, *mesaId, *estado, *items, total, *createdBy, createdAt, updatedAt',
  cuentas: 'id, *uuid, *comandaId, total, *split, formaPago, *createdBy, createdAt, updatedAt',
  cortes: 'id, *uuid, fecha, totalVentas, *porFormaPago, *platillosVendidos, *createdBy, createdAt, updatedAt'
});
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Mesas del día, comandas activas, total del día, platillo más vendido |
| Mapa de mesas | Grid de mesas con colores (verde=libre, rojo=ocupada, amarillo=cuenta) |
| Nueva comanda | Selector mesa → categorías → platillos → notas → confirmar |
| Comanda activa | Items agregados, total parcial, botón agregar más, botón cerrar cuenta |
| Corte de caja | Total día, desglose por forma de pago, top 5 platillos, export PDF |
| Admin platillos | CRUD con búsqueda instantánea IA, toggle disponible |

## IA integrada

- **Búsqueda**: buscar platillos por nombre o descripción al escribir
- **Predicción**: "Basado en el día y hora, este cliente probablemente pedirá X"
- **Estadísticas**: platillo más vendido, hora pico, ticket promedio
- **Full**: "¿Cuánto vendimos de bebidas la semana pasada?" — QA sobre los datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 módulo a elección, IA Lite |
| Standard | $99 | .exe + .apk, todos los módulos, IA Full |
| Custom | $199+ | Todo + UI con logo/marca del restaurante + código fuente |

## WhatsApp para venta

```
Hola Angel, vi la AHA Comanda para mi restaurante.
¿Puedo tener el .exe y .apk con todos los módulos?
Me interesa el plan Standard.
```

## Checklist pre-lanzamiento

- [ ] Probar flujo completo: crear mesa → comanda → agregar items → cerrar cuenta
- [ ] Probar split de cuenta (2, 3, 4 personas)
- [ ] Probar corte de caja contra ventas del día
- [ ] Verificar export PDF del corte
- [ ] Probar en .exe (Bun --compile)
- [ ] Probar en .apk (GitHub Actions)
- [ ] Tomar screenshot del mapa de mesas y comanda activa
- [ ] Redactar descripción landing


