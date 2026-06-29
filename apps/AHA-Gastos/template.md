# AHA Gastos — Control de gastos para micro-negocios

## Descripción comercial

Lleva el control de ingresos y egresos diarios de tu negocio sin depender de internet. Categoriza gastos, genera reportes mensuales en PDF y visualiza el flujo de caja con gráficos. Ideal para micro-pymes que necesitan saber si están ganando o perdiendo dinero.

**Target:** Micro-pymes, emprendedores, tiendas, freelancers, pequeños negocios en Latam.

**Dolor que resuelve:** "No sé si estoy ganando o perdiendo dinero porque no llevo un control diario."

## Niveles comerciales

| Nivel | Perfil técnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | .exe + .apk | FlexSearch + Stats + Predicción |

## Módulos

### 📊 Dashboard
- Saldo actual del mes
- Ingresos vs gastos gráfico
- Últimos 5 movimientos

### 💳 Movimientos
- CRUD completo: tipo (ingreso/egreso), categoría, monto, fecha, nota
- Filtro por mes, categoría, tipo

### 🏷️ Categorías
- CRUD personalizable
- Predefinidas: renta, luz, mercancía, nómina, transporte, alimentos, servicios, otros

### 📈 Reportes
- Gráfico de flujo de caja (barras por mes)
- Export PDF de reporte mensual
- Tabla filtrable exportable a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  movimientos: 'id, tipo, *categoria, monto, *fecha, *nota, *createdBy, createdAt',
  categorias: 'id, nombre, tipo, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Saldo, gráfico donut ingresos/gastos, últimos movimientos |
| Movimientos | Lista filtrable, formulario modal, selector de categoría |
| Categorías | Grid de tarjetas con edición inline |
| Reportes | Selector de mes, gráfico Chart.js, botón export PDF |

## IA integrada

- **Estadísticas**: "Este mes gastaste 30% más que el anterior en mercancía"
- **Predicción**: "Si sigues este ritmo, tu saldo proyectado al cierre del mes es $X"

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | Dashboard + movimientos + categorías |
| Full | $99 | + Reportes PDF + gráficos + IA Stats + Predicción |

## WhatsApp para venta

```
Hola Angel, necesito controlar los gastos de mi negocio
sin herramientas online. ¿AHA Gastos con reportes PDF?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear categoría → registrar ingreso → registrar egreso → ver dashboard
- [ ] Probar gráfico flujo de caja con datos de 3 meses
- [ ] Probar export PDF con datos reales
- [ ] Probar filtros de movimientos por mes/categoría/tipo
