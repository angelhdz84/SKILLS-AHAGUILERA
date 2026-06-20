# AHA Comanda â€” Toma de pedidos offline para restaurantes y bares

## DescripciÃ³n comercial

Sistema de comandas offline para restaurantes, bares y cocinas. El mesero toma el pedido desde una tablet o celular, la cocina lo recibe al instante (dentro de la misma red local), y al final se genera la cuenta con split de pago. Sin depender de internet, sin servidores, sin mensualidades.

**Target:** Restaurantes, bares, pizzerÃ­as, taquerÃ­as, cocinas econÃ³micas, food trucks.

**Dolor que resuelve:** "Se fue el internet y perdimos las comandas de toda la noche."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ½ï¸ MÃ³dulo Mesas
- GestiÃ³n de mesas del local (nombre/nÃºmero, capacidad, ubicaciÃ³n)
- Estados: disponible, ocupada, cuenta solicitada
- Mapa visual del salÃ³n con colores por estado
- Pasar/ocupar mesa desde touch

### ðŸ“ MÃ³dulo Comandas
- Seleccionar mesa â†’ crear comanda
- Agregar platillos por categorÃ­a
- Cantidad, notas por platillo ("sin cebolla", "tÃ©rmino medio")
- Comanda abierta: se pueden agregar mÃ¡s items despuÃ©s
- Historial de comandas cerradas por fecha

### ðŸ¥˜ MÃ³dulo Platillos / MenÃº
- CRUD de platillos: nombre, categorÃ­a, precio, disponible/no disponible
- CategorÃ­as: bebidas, entradas, plato fuerte, postres
- Foto del platillo (opcional, desde archivo local)
- Marcar platillo como "del dÃ­a" o "agotado"

### ðŸ’³ MÃ³dulo Cuentas
- Cerrar comanda: total con subtotal por item
- Split de cuenta: dividir entre N personas
- Formas de pago: efectivo, tarjeta, transferencia
- Corte de caja del dÃ­a: total ventas, por forma de pago, platillos mÃ¡s vendidos
- Exportar corte a PDF y CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  mesas: 'id, nombre, *capacidad, estado, *createdBy, createdAt, updatedAt',
  categorias: 'id, nombre, *color, orden, createdAt',
  platillos: 'id, nombre, *categoriaId, precio, disponible, *createdBy, createdAt, updatedAt',
  comandas: 'id, *mesaId, *estado, *items, total, *createdBy, createdAt, updatedAt',
  cuentas: 'id, *comandaId, total, *split, formaPago, *createdBy, createdAt, updatedAt',
  cortes: 'id, fecha, totalVentas, *porFormaPago, *platillosVendidos, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Mesas del dÃ­a, comandas activas, total del dÃ­a, platillo mÃ¡s vendido |
| Mapa de mesas | Grid de mesas con colores (verde=libre, rojo=ocupada, amarillo=cuenta) |
| Nueva comanda | Selector mesa â†’ categorÃ­as â†’ platillos â†’ notas â†’ confirmar |
| Comanda activa | Items agregados, total parcial, botÃ³n agregar mÃ¡s, botÃ³n cerrar cuenta |
| Corte de caja | Total dÃ­a, desglose por forma de pago, top 5 platillos, export PDF |
| Admin platillos | CRUD con bÃºsqueda instantÃ¡nea IA, toggle disponible |

## IA integrada

- **BÃºsqueda**: buscar platillos por nombre o descripciÃ³n al escribir
- **PredicciÃ³n**: "Basado en el dÃ­a y hora, este cliente probablemente pedirÃ¡ X"
- **EstadÃ­sticas**: platillo mÃ¡s vendido, hora pico, ticket promedio
- **Full**: "Â¿CuÃ¡nto vendimos de bebidas la semana pasada?" â€” QA sobre los datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 mÃ³dulo a elecciÃ³n, IA Lite |
| Standard | $99 | .exe + .apk, todos los mÃ³dulos, IA Full |
| Custom | $199+ | Todo + UI con logo/marca del restaurante + cÃ³digo fuente |

## WhatsApp para venta

```
Hola Angel, vi la AHA Comanda para mi restaurante.
Â¿Puedo tener el .exe y .apk con todos los mÃ³dulos?
Me interesa el plan Standard.
```

## Checklist pre-lanzamiento

- [ ] Probar flujo completo: crear mesa â†’ comanda â†’ agregar items â†’ cerrar cuenta
- [ ] Probar split de cuenta (2, 3, 4 personas)
- [ ] Probar corte de caja contra ventas del dÃ­a
- [ ] Verificar export PDF del corte
- [ ] Probar en .exe (Bun --compile)
- [ ] Probar en .apk (GitHub Actions)
- [ ] Tomar screenshot del mapa de mesas y comanda activa
- [ ] Redactar descripciÃ³n landing


