# AHA Checklist â€” Inspecciones y checklists tÃ©cnicos offline

## DescripciÃ³n comercial

Crea plantillas de inspecciÃ³n, asÃ­gnelas a equipos o ubicaciones, y capture resultados con fotos y firmas digitales â€” todo sin internet. Ideal para mantenimiento industrial, seguridad, limpieza y auditorÃ­as internas.

**Target:** Supervisores de mantenimiento, encargados de seguridad, administradores de instalaciones, empresas de limpieza, construcciÃ³n.

**Dolor que resuelve:** "Los inspectores llenan papeles que luego hay que digitalizar. Perdemos datos y tiempo."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | BÃºsqueda de plantillas + historial |
| Standard | .exe + .apk | + PredicciÃ³n de Ã¡reas con mÃ¡s fallas + fotos offline |
| Custom | .exe + .apk + cÃ³digo fuente | Todo + UI con logo de la empresa |

## MÃ³dulos

### ðŸ“‹ MÃ³dulo Plantillas
- CRUD de plantillas de inspecciÃ³n
- Items con tipo: checklist (sÃ­/no), valor numÃ©rico, texto libre, foto, firma
- Reordenar items por drag & drop
- CategorÃ­as de plantillas (seguridad, limpieza, maquinaria)

### âœ… MÃ³dulo Inspecciones
- Seleccionar plantilla â†’ crear inspecciÃ³n
- Asignar a ubicaciÃ³n/equipo
- Capturar foto desde cÃ¡mara (almacenamiento local)
- Firma digital del inspector
- Resultado: aprobado / rechazado / observado
- Fecha de prÃ³xima inspecciÃ³n programada

### ðŸ“ MÃ³dulo Ubicaciones / Equipos
- CRUD de ubicaciones (edificio, Ã¡rea, piso)
- CRUD de equipos (nombre, cÃ³digo, ubicaciÃ³n, frecuencia de inspecciÃ³n)
- Historial de inspecciones por equipo

### ðŸ“Š MÃ³dulo Reportes
- Reporte PDF de cada inspecciÃ³n con fotos y firmas
- Dashboard de cumplimiento: % aprobado vs rechazado
- Equipos con mÃ¡s fallas
- Export CSV del historial completo

## Tablas Dexie

```javascript
db.version(1).stores({
  plantillas: 'id, nombre, *categoriaId, *items, *createdBy, createdAt, updatedAt',
  categorias_plantillas: 'id, nombre, createdAt',
  ubicaciones: 'id, nombre, *area, *createdBy, createdAt, updatedAt',
  equipos: 'id, nombre, *codigo, *ubicacionId, frecuencia, *createdBy, createdAt, updatedAt',
  inspecciones: 'id, *plantillaId, *ubicacionId, *equipoId, *resultados, *fotos, *firma, resultado, *createdBy, createdAt, updatedAt',
  programacion: 'id, *ubicacionId, *equipoId, *plantillaId, frecuencia, *proximaFecha, *ultimaFecha, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Inspecciones hoy, % cumplimiento, equipos con fallas, prÃ³ximas vencidas |
| Plantillas | Lista con bÃºsqueda IA, CRUD con reorden drag & drop de items |
| Nueva inspecciÃ³n | Selector plantilla â†’ ubicaciÃ³n/equipo â†’ llenar items â†’ fotos â†’ firma â†’ resultado |
| Historial | Filtros por fecha, ubicaciÃ³n, equipo, resultado. Export CSV |
| Reporte PDF | Vista previa + descarga con logo, fotos y firma |

## IA integrada

- **BÃºsqueda**: encontrar plantillas e inspecciones por texto libre
- **PredicciÃ³n**: "Esta Ã¡rea concentra el 40% de las fallas. Sugiero inspecciÃ³n semanal"
- **EstadÃ­sticas**: equipos mÃ¡s problemÃ¡ticos, tipos de falla mÃ¡s comunes
- **Full**: "Â¿CuÃ¡ntas inspecciones fallaron en el edificio A este mes?" â€” QA sobre datos locales

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | .exe, 1 ubicaciÃ³n, 10 equipos, IA Lite |
| Standard | $99 | .exe + .apk, ilimitado, fotos + firma, IA Full |
| Custom | $199+ | Todo + UI con logo + plantillas pre-cargadas + cÃ³digo fuente |

## WhatsApp para venta

```
Hola Angel, necesito un sistema de inspecciones offline
para mantenimiento. Me interesa AHA Checklist plan Standard
con .exe y .apk.
```

## Checklist pre-lanzamiento

- [ ] Probar creaciÃ³n de plantilla con todos los tipos de item
- [ ] Probar flujo: plantilla â†’ inspecciÃ³n â†’ fotos â†’ firma â†’ PDF
- [ ] Probar firma digital (canvas touch)
- [ ] Probar captura de foto desde cÃ¡mara (en .apk)
- [ ] Verificar PDF incluye fotos y firma
- [ ] Probar en .exe y .apk
- [ ] Tomar screenshot de inspecciÃ³n en proceso y PDF generado
