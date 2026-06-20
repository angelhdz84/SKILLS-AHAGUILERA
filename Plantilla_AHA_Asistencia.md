# AHA Asistencia

## Descripción
Control de asistencia de empleados offline. Marcaje de entrada/salida, escaneo QR, reportes de horas, retardos y exportación a CSV para nómina. Sin reloj checador caro, sin mensualidades.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- qrcode.min.js
- dayjs.min.js

## Módulos

### Módulo Empleados
CRUD: nombre, puesto, horario, teléfono, foto. Código QR único por empleado. Activo/inactivo (solo activos pueden marcar). Búsqueda instantánea IA.

**Campos sensibles:** teléfono (cifrar)

### Módulo Marcaje
Marcar entrada: seleccionar empleado (lista o QR), hora automática. Marcar salida: mismo flujo. Validaciones: no permitir doble entrada sin salida, no permitir salida sin entrada, no marcar empleados inactivos. Dos métodos: lista rápida (grid con fotos, tap para marcar) o escáner QR (cámara .apk). Geolocalización opcional al marcar (solo registrar coordenadas, no tracking).

### Módulo Reportes
Reporte diario: empleados que marcaron, horario, retardos (más de N minutos después del horario). Reporte semanal/mensual: total horas normales, horas extra, retardos, faltas. Vista calendario con colores (verde=completo, amarillo=retardo, rojo=falta, gris=descanso). Export CSV para nómina.

### Módulo Configuración
Horarios por empleado o por turno general. Tolerancia de retardo en minutos. Días festivos (no laborables). Backup automático al cerrar app (.ateje-backup).

## Tablas Dexie

```javascript
db.version(1).stores({
  empleados: 'id, nombre, *puesto, *horarioEntrada, *horarioSalida, *telefono, *foto, *qrCode, activo, *createdBy, createdAt, updatedAt',
  marcajes: 'id, *empleadoId, *tipo, *fecha, *hora, *ubicacionLat, *ubicacionLng, *metodo, *createdBy, createdAt',
  festivos: 'id, *fecha, nombre, createdAt',
  configuracion: 'id, *tolerancia, *toleranciaUnidad, createdAt, updatedAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Empleados hoy, marcados vs pendientes, retardos del día, últimos marcajes |
| Marcaje rápido | Grid de empleados con foto y nombre, tap para marcar entrada/salida |
| Marcaje QR | Cámara escáner + confirmación visual con nombre y hora |
| Reportes | Selector período → tabla de horas → botón export CSV |
| Calendario | Grid mensual con colores, tap para ver detalle del día |
| Admin | CRUD empleados, configuración horarios, festivos |

## Reglas de UI/UX

- Sidebar: dashboard, marcar, reportes, calendario, admin
- Botones grandes en vista de marcaje (prioridad táctil)
- Feedback visual inmediato al marcar: check verde + nombre + hora
- El escáner QR ocupa toda la pantalla en .apk
- Badge rojo en sidebar si hay retardos hoy
- Confirmación antes de eliminar empleado (advierte si tiene marcajes)
- Export CSV con encoding UTF-8 BOM para que Excel abra bien los acentos
- Toast feedback en cada marcaje y operación CRUD
