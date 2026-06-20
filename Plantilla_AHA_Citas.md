# AHA Citas

## Descripción
Agenda de citas offline para negocios de servicios. Calendario por profesional, gestión de clientes, historial de visitas y corte de caja. Sin internet, para barberías, consultorios, spas y talleres.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- dayjs.min.js

## Módulos

### Módulo Agenda
Calendario diario/semanal/mensual. Bloques de tiempo por cita según duración del servicio. Agendar: seleccionar cliente + servicio + profesional + hora. Reagendar: mover cita en calendario. Cancelar cita con motivo. Vista del día: lista cronológica. No permitir agendar donde ya hay cita (validación de cruce de horarios).

### Módulo Clientes
CRUD: nombre, teléfono, email, notas. Historial de visitas: fecha, servicio, profesional, monto. Cliente frecuente automático (después de 3 visitas). Búsqueda instantánea IA.

**Campos sensibles:** teléfono, email (cifrar)

### Módulo Servicios
CRUD: nombre, duración (minutos), precio. Categorías: corte, tinte, manicure, consulta, etc. Asignar profesionales habilitados por servicio.

### Módulo Profesionales
CRUD: nombre, horario laboral (entrada/salida), días de descanso. Vista de agenda filtrada por profesional. Servicios que ofrece cada uno.

### Módulo Ingresos
Registrar pago al cerrar cita (efectivo/tarjeta/transferencia). Corte del día: total, por profesional, por forma de pago. Historial de ingresos por período. Export PDF y CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  clientes: 'id, nombre, *telefono, email, *notas, *frecuente, *createdBy, createdAt, updatedAt',
  profesionales: 'id, nombre, *horarioEntrada, *horarioSalida, *diasDescanso, *serviciosOfrece, *createdBy, createdAt, updatedAt',
  categorias_servicios: 'id, nombre, createdAt',
  servicios: 'id, nombre, *categoriaId, duracion, precio, *createdBy, createdAt, updatedAt',
  citas: 'id, *clienteId, *profesionalId, *servicioId, *fecha, *horaInicio, *horaFin, *estado, *motivoCancelacion, *createdBy, createdAt, updatedAt',
  pagos: 'id, *citaId, *monto, *formaPago, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Citas hoy, próximas, ingresos del día, % ocupación |
| Calendario | Grid semanal con slots, tap para crear cita, drag para reagendar |
| Nueva cita | Selector cliente (búsqueda IA) → servicio → profesional → hora disponible |
| Ficha cliente | Datos + historial visitas + total gastado + badge "frecuente" |
| Corte día | Total, por profesional, por servicio, export PDF/CSV |
| Admin | CRUD servicios, profesionales, categorías |

## Reglas de UI/UX

- Sidebar: dashboard, calendario, clientes, corte, admin
- Calendario con navegación semanal como vista principal (la más usada)
- Slots de tiempo visibles de 15/30 min según configuración
- Colores por profesional en calendario
- Badge "⭐ Frecuente" en clientes con 3+ visitas
- No permitir agendar en slot ocupado (feedback visual rojo)
- Confirmación al cancelar cita con selector de motivo
- Vista del día con acordeón expandible por hora
- Toast feedback en cada operación
