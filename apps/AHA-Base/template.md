# AHA Base \u2014 Proyecto base para desarrollo de apps offline-first

## Descripci\u00f3n comercial

Punto de partida para construir cualquier app AHA. Incluye el shell completo (router, UI core, temas, licencias, sincronizaci\u00f3n) con un m\u00f3dulo demo de plantilla. Ideal para desarrolladores que quieren empezar r\u00e1pido desde una base probada.

**Target:** Desarrolladores, integradores, agencias que construyen apps personalizadas sobre el stack AHA.

**Dolor que resuelve:** \u201cCada app nueva requiere configurar desde cero el shell, core y m\u00f3dulos base.\u201d

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | NeutralinoJS .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada + branding | FlexSearch + Transformers.js QA |

## M\u00f3dulos

### \ud83d\udce6 M\u00f3dulo Plantilla (demo)
- CRUD completo con validaci\u00f3n, b\u00fasqueda, paginaci\u00f3n
- Campos: nombre, descripci\u00f3n, estado (activo/inactivo)
- Exportaci\u00f3n PDF y CSV/Excel
- Ejemplo de cifrado de campos sensibles
- C\u00f3digo documentado listo para copiar y adaptar

## Tablas Dexie

```javascript
db.version(1).stores({
  _template: 'id, nombre, estado, createdAt, updatedAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt'
});
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | Gratis |
| Standard | $49 |
| Custom | $149+ |

## WhatsApp para venta

```
Hola, quiero desarrollar una app offline personalizada
para mi negocio. \u00bfAHA Base plan Professional para empezar
desde cero con .exe?
```
