# AHA-Gastos, AHA-Contactos, Corte — Design Document

> Plan de nuevas apps offline-first para AHApp
> Fecha: 2026-06-29
> Autor: Angel Hernández Aguilera

## Apps involucradas

| Operación | Path | Descripción |
|-----------|------|-------------|
| Archivar | `apps/AHA-Creador/` → `apps/archived/AHA-Creador/` | Reemplazado por AHA-Gastos |
| Crear | `apps/AHA-Gastos/template.md` | Control gastos micro-negocio |
| Crear | `apps/AHA-Contactos/template.md` | CRM manual companion |
| Modificar | `apps/AHA-POS/template.md` | + módulo Corte |

## AHA-Gastos

### Módulos
- **Dashboard**: saldo actual, ingresos vs gastos, últimos 5 movimientos
- **Movimientos**: CRUD ingreso/egreso con categoría, fecha, monto, nota
- **Categorías**: CRUD personalizable (renta, luz, mercancía, nómina, etc.)
- **Reportes**: gráfico flujo de caja, PDF exportable, tabla filtrable

### Dexie
```javascript
db.version(1).stores({
  movimientos: 'id, tipo, *categoria, monto, *fecha, *nota, *createdBy, createdAt',
  categorias: 'id, nombre, tipo, *createdBy, createdAt'
})
```

### IA
Estadísticas y predicción de flujo mensual.

### Pricing
Lite $49 / Full $99

### WhatsApp para venta
```
Hola Angel, necesito controlar los gastos de mi negocio
sin herramientas online. ¿AHA Gastos con reportes PDF?
```

## AHA-Contactos

### Módulos
- **Dashboard**: contactos nuevos, seguimientos pendientes, total activos
- **Contactos**: CRUD con teléfono, email, empresa, etiqueta (prospecto/cliente/VIP/inactivo)
- **Historial**: timeline de interacciones por contacto
- **Plantillas**: mensajes predefinidos para copiar a WhatsApp
- **Recordatorios**: alertas de seguimiento por fecha
- **Export**: CSV

### Dexie
```javascript
db.version(1).stores({
  contactos: 'id, nombre, *telefono, *email, *empresa, *etiqueta, *notas, *ultimoContacto, *createdBy, createdAt, updatedAt',
  historial: 'id, *contactoId, *tipo, *descripcion, *fecha, createdAt',
  plantillas: 'id, nombre, *contenido, *categoria, *createdBy, createdAt',
  recordatorios: 'id, *contactoId, *fecha, *nota, completado, *createdBy, createdAt'
})
```

### IA
Búsqueda de contactos + alerta "contactos no contactados en 30 días"

### Pricing
Lite $99 / Full $149

### WhatsApp para venta
```
Hola Angel, necesito organizar mis contactos de WhatsApp
y dar seguimiento a clientes. ¿AHA Contactos con recordatorios?
```

## Corte (módulo en AHA-POS)

### Funcionalidad
- **Arqueo**: ingreso por denominación, total vs esperado, alerta de descuadre
- **Gastos Menores**: registro rápido de gasto con concepto y monto
- **Cierre**: congela turno, inicia nuevo corte
- **Historial**: cortes anteriores con detalle, exportable

### No standalone
Suma $10-$15 al ticket del POS.

### IA
Alerta predictiva de descuadres recurrentes.

### Dexie (agregar a POS existente)
```javascript
// Agregar a stores existentes de POS
db.version(2).stores({
  ...existingStores,
  cortes: 'id, *fechaApertura, *fechaCierre, *esperado, *real, descuadre, *cajero, *createdBy, createdAt',
  gastosMenores: 'id, *corteId, *concepto, monto, *hora, *createdBy, createdAt'
})
```

## Perfiles técnicos

| App | Lite (ZIP+Pages) | Full (.exe+.apk) |
|-----|-----------------|-------------------|
| AHA-Gastos | ✅ | ✅ (+ IA Stats) |
| AHA-Contactos | ✅ | ✅ (+ IA + recordatorios) |
| Corte | Feature POS | Feature POS |

## Packs

| Pack | Apps incluidas | Precio |
|------|---------------|--------|
| Negocio Completo | POS + Inventario + Gastos | $199 |

## Archivar AHA-Creador

Mover `apps/AHA-Creador/template.md` a `apps/archived/AHA-Creador/template.md` sin modificar.

## Checklist pre-lanzamiento

- [ ] AHA-Gastos: flujo ingreso/egreso con categorías
- [ ] AHA-Gastos: gráfico flujo de caja con datos de prueba
- [ ] AHA-Gastos: export PDF reporte mensual
- [ ] AHA-Contactos: CRUD contactos + historial timeline
- [ ] AHA-Contactos: recordatorios con notificación
- [ ] AHA-Contactos: export CSV
- [ ] Corte: arqueo por denominación + alerta descuadre
- [ ] Corte: cierre de turno + nuevo corte automático
- [ ] Corte: historial de cortes con detalle
