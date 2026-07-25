# AHA Checklist — Inspecciones y checklists técnicos offline

## Descripción comercial

Crea plantillas de inspección, asígnelas a equipos o ubicaciones, y capture resultados con fotos y firmas digitales — todo sin internet. Ideal para mantenimiento industrial, seguridad, limpieza y auditorías internas.

**Target:** Supervisores de mantenimiento, encargados de seguridad, administradores de instalaciones, empresas de limpieza, construcción.

**Dolor que resuelve:** "Los inspectores llenan papeles que luego hay que digitalizar. Perdemos datos y tiempo."


## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 📋 Módulo Plantillas
- CRUD de plantillas de inspección
- Items con tipo: checklist (sí/no), valor numérico, texto libre, foto, firma
- Reordenar items por drag & drop
- Categorías de plantillas (seguridad, limpieza, maquinaria)

### ✅ Módulo Inspecciones
- Seleccionar plantilla → crear inspección
- Asignar a ubicación/equipo
- Capturar foto desde cámara (almacenamiento local)
- Firma digital del inspector
- Resultado: aprobado / rechazado / observado
- Fecha de próxima inspección programada

### 📍 Módulo Ubicaciones / Equipos
- CRUD de ubicaciones (edificio, área, piso)
- CRUD de equipos (nombre, código, ubicación, frecuencia de inspección)
- Historial de inspecciones por equipo

### 📊 Módulo Reportes
- Reporte PDF de cada inspección con fotos y firmas
- Dashboard de cumplimiento: % aprobado vs rechazado
- Equipos con más fallas
- Export CSV del historial completo

## Tablas Dexie

```javascript
db.version(2).stores({
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt',
  plantillas: 'id, *uuid, nombre, *categoriaId, *items, *createdBy, createdAt, updatedAt',
  categorias_plantillas: 'id, *uuid, nombre, createdAt, updatedAt',
  ubicaciones: 'id, *uuid, nombre, *area, *createdBy, createdAt, updatedAt',
  equipos: 'id, *uuid, nombre, *codigo, *ubicacionId, frecuencia, *createdBy, createdAt, updatedAt',
  inspecciones: 'id, *uuid, *plantillaId, *ubicacionId, *equipoId, *resultados, *fotos, *firma, resultado, *createdBy, createdAt, updatedAt',
  programacion: 'id, *uuid, *ubicacionId, *equipoId, *plantillaId, frecuencia, *proximaFecha, *ultimaFecha, *createdBy, createdAt, updatedAt'
});
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Inspecciones hoy, % cumplimiento, equipos con fallas, próximas vencidas |
| Plantillas | Lista con búsqueda IA, CRUD con reorden drag & drop de items |
| Nueva inspección | Selector plantilla → ubicación/equipo → llenar items → fotos → firma → resultado |
| Historial | Filtros por fecha, ubicación, equipo, resultado. Export CSV |
| Reporte PDF | Vista previa + descarga con logo, fotos y firma |

## IA integrada

- **Búsqueda**: encontrar plantillas e inspecciones por texto libre
- **Predicción**: "Esta área concentra el 40% de las fallas. Sugiero inspección semanal"
- **Estadísticas**: equipos más problemáticos, tipos de falla más comunes
- **Full**: "¿Cuántas inspecciones fallaron en el edificio A este mes?" — QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 ubicación, 10 equipos, IA Lite |
| Standard | $99 | .exe + .apk, ilimitado, fotos + firma, IA Full |
| Custom | $199+ | Todo + UI con logo + plantillas pre-cargadas + código fuente |

## WhatsApp para venta

```
Hola Angel, necesito un sistema de inspecciones offline
para mantenimiento. Me interesa AHA Checklist plan Standard
con .exe y .apk.
```

## Checklist pre-lanzamiento

- [ ] Probar creación de plantilla con todos los tipos de item
- [ ] Probar flujo: plantilla → inspección → fotos → firma → PDF
- [ ] Probar firma digital (canvas touch)
- [ ] Probar captura de foto desde cámara (en .apk)
- [ ] Verificar PDF incluye fotos y firma
- [ ] Probar en .exe y .apk
- [ ] Tomar screenshot de inspección en proceso y PDF generado


