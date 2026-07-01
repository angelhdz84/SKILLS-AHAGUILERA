# AHA Citas — Gestión de citas y agenda offline para negocios de servicios

## Descripción comercial

Agenda digital para negocios de servicios que manejan citas. Gestión de clientes, calendario por profesional, historial de visitas y recordatorios locales. Todo sin internet, sin pagar por calendario SaaS.

**Target:** Barberías, salones de belleza, consultorios médicos, dentistas, spas, talleres mecánicos.

**Dolor que resuelve:** "Uso Google Calendar pero cuando no hay internet no veo mis citas del día."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 📅 Módulo Agenda
- Calendario diario/semanal/mensual
- Bloque de tiempo por cita (15/30/60 min)
- Agendar: seleccionar cliente + servicio + profesional + hora
- Reagendar: mover cita con drag & drop
- Cancelar cita con motivo
- Vista del día: lista cronológica de citas

### 👤 Módulo Clientes
- CRUD: nombre, teléfono, email, notas
- Historial de visitas: fecha, servicio, profesional, monto
- Cliente frecuente: automático después de 3 visitas
- Búsqueda instantánea

### 💇 Módulo Servicios
- CRUD de servicios: nombre, duración, precio
- Categorías: corte, tinte, manicure, etc.
- Asignar profesionales habilitados por servicio

### 👨‍🔧 Módulo Profesionales
- CRUD: nombre, horario laboral, días de descanso
- Vista de agenda por profesional
- Servicios que ofrece cada uno

### 💰 Módulo Ingresos
- Registro de pago al cerrar cita
- Corte del día: total, por profesional, por forma de pago
- Export PDF y CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  clientes: 'id, nombre, *telefono, email, *frecuente, *createdBy, createdAt, updatedAt',
  profesionales: 'id, nombre, *horario, *diasDescanso, *serviciosOfrece, *createdBy, createdAt, updatedAt',
  servicios: 'id, nombre, *categoriaId, duracion, precio, *createdBy, createdAt, updatedAt',
  categorias_servicios: 'id, nombre, createdAt, updatedAt',
  citas: 'id, *clienteId, *profesionalId, *servicioId, *fecha, *horaInicio, *horaFin, *estado, *motivoCancelacion, *createdBy, createdAt, updatedAt',
  pagos: 'id, *citaId, *monto, *formaPago, *createdBy, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Citas hoy, próximas, ingresos del día, ocupación |
| Calendario | Grid semanal con slots de tiempo, drag para reagendar |
| Nueva cita | Selector cliente (búsqueda IA) → servicio → profesional → hora |
| Ficha cliente | Datos + historial de visitas + total gastado |
| Corte del día | Total, por profesional, por servicio, export PDF |

## IA integrada

- **Búsqueda**: buscar clientes por nombre, teléfono o descripción difusa
- **Predicción**: "Los miércoles a las 10am son los más solicitados. Sugiero abrir agenda"
- **Estadísticas**: servicio más vendido, profesional con más citas, hora pico
- **Full**: "¿Cuánto ingresó la barbería la semana pasada?" — QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 profesional, agenda básica |
| Standard | $99 | .exe + .apk, múltiples profesionales, IA predicción |
| Custom | $199+ | Todo + UI con logo + cliente frecuente automático + código fuente |

## WhatsApp para venta

```
Hola Angel, quiero una agenda offline para mi barbería.
Me interesa AHA Citas con .exe y .apk para varios
profesionales. Plan Standard.
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear cliente → agendar cita → cerrar → registrar pago
- [ ] Probar drag & drop para reagendar
- [ ] Probar vista por profesional
- [ ] Probar bloqueo de horarios (no agendar donde ya hay cita)
- [ ] Probar cancelación con motivo
- [ ] Probar corte del día vs citas pagadas
- [ ] Probar en .exe y .apk


