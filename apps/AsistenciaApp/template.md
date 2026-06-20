# AsistenciaApp — Control de asistencia de empleados offline

## Descripción comercial

Registro de entrada y salida de empleados sin internet. Cada empleado marca desde el celular o PC del negocio, y al final del período se genera el reporte de horas para nómina. Sin reloj checador caro, sin mensualidades por usuario.

**Target:** Pequeñas empresas, talleres, tiendas, restaurantes, consultorios con empleados.

**Dolor que resuelve:** "Pago $20/mes por cada empleado solo para que marquen entrada y salida."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | Búsqueda de registros + reporte básico |
| Standard | .exe + .apk | + Predicción de retardos + alertas inteligentes |
| Custom | .exe + .apk + código fuente | Todo + personalización + integración nómina |

## Módulos

### 👥 Módulo Empleados
- CRUD de empleados: nombre, puesto, horario, teléfono
- Código QR único por empleado para marcado rápido
- Foto del empleado (opcional)
- Activo/inactivo

### ⏰ Módulo Marcaje
- Marcar entrada: seleccionar empleado + hora automática
- Marcar salida: mismo empleado + hora automática
- Marcado por QR: escanear código desde la app
- Marcado manual con confirmación
- Validación: no permitir doble entrada sin salida (y viceversa)
- Geolocalización opcional (solo registro, no tracking)

### 📊 Módulo Reportes
- Reporte diario: empleados que marcaron, horarios, retardos
- Reporte semanal/mensual: total horas, retardos, faltas
- Export a CSV para nómina
- Vista calendario con colores (verde=completo, amarillo=retardo, rojo=falta)

### ⚙️ Módulo Configuración
- Horarios por empleado o por turno
- Tolerancia de retardo (minutos)
- Días festivos (no laborables)
- Backup automático al cerrar

## Tablas Dexie

```javascript
db.version(1).stores({
  empleados: 'id, nombre, *puesto, *horario, telefono, activo, *createdBy, createdAt, updatedAt',
  turnos: 'id, nombre, *horaEntrada, *horaSalida, createdAt',
  marcajes: 'id, *empleadoId, *tipo, *fecha, *hora, *ubicacion, *metodo, *createdBy, createdAt',
  reportes: 'id, *empleadoId, *periodo, *totalHoras, *retardos, *faltas, *createdBy, createdAt',
  festivos: 'id, *fecha, nombre, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Empleados hoy, marcados vs pendientes, retardos del día, últimos marcajes |
| Marcaje rápido | Grid de empleados con foto → tap para marcar entrada/salida |
| Marcaje QR | Cámara escáner + confirmación visual |
| Reportes | Selector período → tabla de horas → export CSV |
| Calendario | Grid mensual con colores por estado del día |
| Admin empleados | CRUD con búsqueda IA |

## IA integrada

- **Búsqueda**: buscar empleados por nombre, puesto, teléfono
- **Predicción**: "Basado en el historial, Juan probablemente llegue retardo hoy (60% de probabilidad)"
- **Estadísticas**: empleado con más retardos, día con más faltas, promedio de horas extra
- **Full**: "¿Cuántas horas extra hizo María la semana pasada?" — QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, hasta 10 empleados, reporte básico CSV |
| Standard | $99 | .exe + .apk, ilimitado, QR, predicciones IA |
| Custom | $199+ | Todo + UI con logo + export a sistema de nómina + código fuente |

## WhatsApp para venta

```
Hola Angel, quiero dejar de pagar suscripción por el control
de asistencia. ¿AsistenciaApp plan Standard con .exe y .apk
me sirve para 15 empleados?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear empleado → marcar entrada → marcar salida
- [ ] Probar validación: evitar doble marcaje sin cierre
- [ ] Probar escaneo QR desde cámara (.apk)
- [ ] Probar reporte semanal con export CSV
- [ ] Probar cálculo de horas: normales, extras, retardos
- [ ] Verificar que al cerrar app los datos persisten (Dexie)
- [ ] Probar en .exe y .apk
- [ ] Tomar screenshot del dashboard y reporte
