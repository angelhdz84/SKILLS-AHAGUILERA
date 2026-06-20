# AHA Asistencia â€” Control de asistencia de empleados offline

## DescripciÃ³n comercial

Registro de entrada y salida de empleados sin internet. Cada empleado marca desde el celular o PC del negocio, y al final del perÃ­odo se genera el reporte de horas para nÃ³mina. Sin reloj checador caro, sin mensualidades por usuario.

**Target:** PequeÃ±as empresas, talleres, tiendas, restaurantes, consultorios con empleados.

**Dolor que resuelve:** "Pago $20/mes por cada empleado solo para que marquen entrada y salida."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ‘¥ MÃ³dulo Empleados
- CRUD de empleados: nombre, puesto, horario, telÃ©fono
- CÃ³digo QR Ãºnico por empleado para marcado rÃ¡pido
- Foto del empleado (opcional)
- Activo/inactivo

### â° MÃ³dulo Marcaje
- Marcar entrada: seleccionar empleado + hora automÃ¡tica
- Marcar salida: mismo empleado + hora automÃ¡tica
- Marcado por QR: escanear cÃ³digo desde la app
- Marcado manual con confirmaciÃ³n
- ValidaciÃ³n: no permitir doble entrada sin salida (y viceversa)
- GeolocalizaciÃ³n opcional (solo registro, no tracking)

### ðŸ“Š MÃ³dulo Reportes
- Reporte diario: empleados que marcaron, horarios, retardos
- Reporte semanal/mensual: total horas, retardos, faltas
- Export a CSV para nÃ³mina
- Vista calendario con colores (verde=completo, amarillo=retardo, rojo=falta)

### âš™ï¸ MÃ³dulo ConfiguraciÃ³n
- Horarios por empleado o por turno
- Tolerancia de retardo (minutos)
- DÃ­as festivos (no laborables)
- Backup automÃ¡tico al cerrar

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
| Dashboard | Empleados hoy, marcados vs pendientes, retardos del dÃ­a, Ãºltimos marcajes |
| Marcaje rÃ¡pido | Grid de empleados con foto â†’ tap para marcar entrada/salida |
| Marcaje QR | CÃ¡mara escÃ¡ner + confirmaciÃ³n visual |
| Reportes | Selector perÃ­odo â†’ tabla de horas â†’ export CSV |
| Calendario | Grid mensual con colores por estado del dÃ­a |
| Admin empleados | CRUD con bÃºsqueda IA |

## IA integrada

- **BÃºsqueda**: buscar empleados por nombre, puesto, telÃ©fono
- **PredicciÃ³n**: "Basado en el historial, Juan probablemente llegue retardo hoy (60% de probabilidad)"
- **EstadÃ­sticas**: empleado con mÃ¡s retardos, dÃ­a con mÃ¡s faltas, promedio de horas extra
- **Full**: "Â¿CuÃ¡ntas horas extra hizo MarÃ­a la semana pasada?" â€” QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, hasta 10 empleados, reporte bÃ¡sico CSV |
| Standard | $99 | .exe + .apk, ilimitado, QR, predicciones IA |
| Custom | $199+ | Todo + UI con logo + export a sistema de nÃ³mina + cÃ³digo fuente |

## WhatsApp para venta

```
Hola Angel, quiero dejar de pagar suscripciÃ³n por el control
de asistencia. Â¿AHA Asistencia plan Standard con .exe y .apk
me sirve para 15 empleados?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear empleado â†’ marcar entrada â†’ marcar salida
- [ ] Probar validaciÃ³n: evitar doble marcaje sin cierre
- [ ] Probar escaneo QR desde cÃ¡mara (.apk)
- [ ] Probar reporte semanal con export CSV
- [ ] Probar cÃ¡lculo de horas: normales, extras, retardos
- [ ] Verificar que al cerrar app los datos persisten (Dexie)
- [ ] Probar en .exe y .apk
- [ ] Tomar screenshot del dashboard y reporte


