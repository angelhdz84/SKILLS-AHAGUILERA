# AHA Citas â€” GestiÃ³n de citas y agenda offline para negocios de servicios

## DescripciÃ³n comercial

Agenda digital para negocios de servicios que manejan citas. GestiÃ³n de clientes, calendario por profesional, historial de visitas y recordatorios locales. Todo sin internet, sin pagar por calendario SaaS.

**Target:** BarberÃ­as, salones de belleza, consultorios mÃ©dicos, dentistas, spas, talleres mecÃ¡nicos.

**Dolor que resuelve:** "Uso Google Calendar pero cuando no hay internet no veo mis citas del dÃ­a."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ“… MÃ³dulo Agenda
- Calendario diario/semanal/mensual
- Bloque de tiempo por cita (15/30/60 min)
- Agendar: seleccionar cliente + servicio + profesional + hora
- Reagendar: mover cita con drag & drop
- Cancelar cita con motivo
- Vista del dÃ­a: lista cronolÃ³gica de citas

### ðŸ‘¤ MÃ³dulo Clientes
- CRUD: nombre, telÃ©fono, email, notas
- Historial de visitas: fecha, servicio, profesional, monto
- Cliente frecuente: automÃ¡tico despuÃ©s de 3 visitas
- BÃºsqueda instantÃ¡nea

### ðŸ’‡ MÃ³dulo Servicios
- CRUD de servicios: nombre, duraciÃ³n, precio
- CategorÃ­as: corte, tinte, manicure, etc.
- Asignar profesionales habilitados por servicio

### ðŸ‘¨â€ðŸ”§ MÃ³dulo Profesionales
- CRUD: nombre, horario laboral, dÃ­as de descanso
- Vista de agenda por profesional
- Servicios que ofrece cada uno

### ðŸ’° MÃ³dulo Ingresos
- Registro de pago al cerrar cita
- Corte del dÃ­a: total, por profesional, por forma de pago
- Export PDF y CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  clientes: 'id, nombre, *telefono, email, *frecuente, *createdBy, createdAt, updatedAt',
  profesionales: 'id, nombre, *horario, *diasDescanso, *serviciosOfrece, *createdBy, createdAt, updatedAt',
  servicios: 'id, nombre, *categoriaId, duracion, precio, *createdBy, createdAt',
  categorias_servicios: 'id, nombre, createdAt',
  citas: 'id, *clienteId, *profesionalId, *servicioId, *fecha, *horaInicio, *horaFin, *estado, *motivoCancelacion, *createdBy, createdAt, updatedAt',
  pagos: 'id, *citaId, *monto, *formaPago, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Citas hoy, prÃ³ximas, ingresos del dÃ­a, ocupaciÃ³n |
| Calendario | Grid semanal con slots de tiempo, drag para reagendar |
| Nueva cita | Selector cliente (bÃºsqueda IA) â†’ servicio â†’ profesional â†’ hora |
| Ficha cliente | Datos + historial de visitas + total gastado |
| Corte del dÃ­a | Total, por profesional, por servicio, export PDF |

## IA integrada

- **BÃºsqueda**: buscar clientes por nombre, telÃ©fono o descripciÃ³n difusa
- **PredicciÃ³n**: "Los miÃ©rcoles a las 10am son los mÃ¡s solicitados. Sugiero abrir agenda"
- **EstadÃ­sticas**: servicio mÃ¡s vendido, profesional con mÃ¡s citas, hora pico
- **Full**: "Â¿CuÃ¡nto ingresÃ³ la barberÃ­a la semana pasada?" â€” QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 profesional, agenda bÃ¡sica |
| Standard | $99 | .exe + .apk, mÃºltiples profesionales, IA predicciÃ³n |
| Custom | $199+ | Todo + UI con logo + cliente frecuente automÃ¡tico + cÃ³digo fuente |

## WhatsApp para venta

```
Hola Angel, quiero una agenda offline para mi barberÃ­a.
Me interesa AHA Citas con .exe y .apk para varios
profesionales. Plan Standard.
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear cliente â†’ agendar cita â†’ cerrar â†’ registrar pago
- [ ] Probar drag & drop para reagendar
- [ ] Probar vista por profesional
- [ ] Probar bloqueo de horarios (no agendar donde ya hay cita)
- [ ] Probar cancelaciÃ³n con motivo
- [ ] Probar corte del dÃ­a vs citas pagadas
- [ ] Probar en .exe y .apk


