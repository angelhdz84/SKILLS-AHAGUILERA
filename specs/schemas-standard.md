# Esquema Dexie Estandarizado — Ateje Stack v2

## Reglas generales

| Regla | Descripción |
|-------|-------------|
| R1 | Toda tabla **mutable** (se puede editar tras crear) lleva `updatedAt` |
| R2 | Tablas **append-only** (logs, movimientos, items de línea) NO llevan `updatedAt` |
| R3 | Toda tabla lleva `createdAt` como último índice |
| R4 | `createdBy` va en tablas multi-usuario (omitir en catálogos globales: categorías, festivos) |
| R5 | `id` siempre es primer índice (primary key implícita de Dexie) |
| R6 | `*campo` para unique index, `campo` para índice simple |
| R7 | Las apps siempre incluyen `_sync_log`, `_ia_chats`, `_ia_messages` |
| R8 | El versionado de schema debe ser **el número más alto** de todas las tablas (bump al agregar tablas) |

## Tablas transversales (TODAS las apps)

### `_analytics` — Telemetría offline-first

```javascript
_analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt'
```

| Campo | Tipo | Índice | Notas |
|-------|------|--------|-------|
| id | autoIncrement | PK | Dexie auto |
| page | string | * | Ruta de página actual |
| category | string | * | 'pageview', 'event', 'error' |
| action | string | * | Nombre del evento |
| synced | number | * | 0=pendiente, 1=enviado |
| timestamp | string | * | ISO date string |
| createdAt | string | — | ISO string |

### `_files` — Metadatos de archivos adjuntos

```javascript
_files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt'
```

| Campo | Tipo | Índice | Notas |
|-------|------|--------|-------|
| path | string | & (unique) | Ruta relativa del archivo |
| tipo | string | — | 'imagen', 'documento', 'audio', 'video' |
| nombre | string | — | Nombre original |
| mime | string | — | MIME type |
| size | number | — | Bytes |
| hash | string | — | SHA-256 (dedup, integridad) |
| refCount | number | — | Referencias activas |
| createdAt | string | — | ISO string |
| updatedAt | string | — | ISO string |

### `_file_blobs` (Lite) — Contenido binario inline para file://

```javascript
_file_blobs: '&path'
```

| Campo | Tipo | Índice | Notas |
|-------|------|--------|-------|
| path | string | & (unique) | FK → _files.path |
| blob | ArrayBuffer | — | Contenido binario |

### `_sync_log` — Bitácora de respaldo .ahabackup

```javascript
_sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt'
```

| Campo | Tipo | Índice | Notas |
|-------|------|--------|-------|
| id | autoIncrement | PK | Dexie auto |
| tabla | string | * | Nombre de tabla origen |
| operacion | string | * | 'create', 'update', 'delete' |
| idRegistro | string | * | ID del registro modificado |
| estado | string | * | 'pendiente', 'confirmado', 'error' |
| fecha | string | * | ISO date string |
| createdBy | string | * | `app.user?.id` |
| createdAt | string | — | ISO string |

### `_ia_chats` — Historial de chats IA

```javascript
_ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt'
```

| Campo | Tipo | Índice | Notas |
|-------|------|--------|-------|
| id | autoIncrement | PK | Dexie auto |
| titulo | string | * | Título del chat |
| modelo | string | * | 'flexsearch', 'transformers', 'hybrid' |
| createdBy | string | * | `app.user?.id` |
| createdAt | string | — | ISO string |
| updatedAt | string | — | ISO string (último mensaje) |

### `_ia_messages` — Mensajes de chat IA

```javascript
_ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
```

| Campo | Tipo | Índice | Notas |
|-------|------|--------|-------|
| id | autoIncrement | PK | Dexie auto |
| chatId | string | * | FK → _ia_chats.id |
| rol | string | * | 'user' \| 'assistant' \| 'system' |
| contenido | string | — | Texto del mensaje |
| createdBy | string | * | `app.user?.id` |
| createdAt | string | — | ISO string |

## Reglas por categoría de tabla

### Entidades (mutables → llevan `updatedAt`)

Inventario, clientes, profesionales, servicios, platillos, mesas, vehiculos, obras, etapas, pacientes, etc.

```javascript
// ✅ Correcto
tabla: 'id, nombre, *codigo, ...createdBy, createdAt, updatedAt'
```

### Catálogos (semilla, rara vez se editan)

Categorías, colores, festivos, etiquetas.

```javascript
// ✅ Sin createdBy (global), sin updatedAt (casi nunca cambian)
catalogo: 'id, nombre, createdAt'
```

### Logs / Transacciones (append-only → sin `updatedAt`)

Movimientos, marcajes, items de factura, historial, gastos.

```javascript
// ✅ Sin updatedAt (nunca se modifican)
log: 'id, *entidadId, *tipo, cantidad, ...createdBy, createdAt'
```

## Casos especiales

| Tabla | App | Regla | Razón |
|-------|-----|-------|-------|
| `cortes` (POS/Comanda) | POS, Comanda | mutable | Se cierra/actualiza estado |
| `comandas` | Comanda | mutable | Cambia estado: abierta→cerrada→pagada |
| `cuentas` | Comanda | mutable | Split puede modificarse |
| `citas` | Citas | mutable | Se reagendan, cambian estado |
| `facturas` | PreFactura | mutable | Cancelación, complemento |
| `recetas` | Rx | mutable | Se actualiza diagnóstico |
| `animales` | Campo | mutable | Pesos, tratamientos |
| `ciclos` (Campo) | Campo | mutable | Se cierran, actualizan |

## Bumping de versión

Al agregar `_sync_log`, `_ia_chats`, `_ia_messages`, `_analytics`, `_files`, `_file_blobs`:

- Apps en `db.version(1)` → subir a `db.version(2)`
- AHA-Asistencia (en `db.version(2)`) → subir a `db.version(3)`

## Inconsistencias detectadas

### updatedAt faltante por app

| App | Tablas sin updatedAt |
|-----|---------------------|
| AHA-Gastos | movimientos, categorias |
| AHA-POS | productos, ventas, ventas_items, cortes, devoluciones, gastosMenores |
| AHA-Flota | cargas_combustible, mantenimientos, incidentes |
| AHA-Inventario | categorias, movimientos, alertas |
| AHA-Campo | registros_diarios, eventos_animal, movimientos_insumo, gastos |
| AHA-Obra | etapas, materiales, gastos_obra, avances_fotos |
| AHA-Asistencia | turnos, marcajes, reportes, festivos |
| AHA-Checklist | categorias_plantillas, programacion |
| AHA-Citas | servicios, categorias_servicios, pagos |
| AHA-Comanda | categorias, cortes |
| AHA-Contactos | historial, plantillas, recordatorios |
| AHA-CRM | interacciones |
| AHA-PreFactura | productos_fiscales, facturas, facturas_items |
| AHA-Rx | medicamentos, recetas, recetas_items |

### createdBy faltante

| Tabla | App |
|-------|-----|
| categorias | AHA-Inventario, AHA-POS? |
| turnos, festivos | AHA-Asistencia |
| categorias_servicios | AHA-Citas |
| categorias | AHA-Comanda |
| clientes_fiscales, productos_fiscales, facturas_items | AHA-PreFactura |
| medicamentos, recetas_items | AHA-Rx |
| etapas, materiales, avances_fotos | AHA-Obra |

### _sync_log, _ia_chats, _ia_messages

Faltantes en las 14 apps.
