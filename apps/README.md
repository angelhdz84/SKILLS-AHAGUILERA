# Ateje Stack — App Templates

Catálogo de plantillas de apps listas para construir y vender con el Ateje Stack. Cada template es una spec completa que el `code-generator` puede consumir para generar la app.

## Filosofía

- **Offline-first**: 100% local, sin servidores, sin internet
- **Pago único**: el cliente paga una vez, la app es suya para siempre
- **Dos formatos**: .exe (Windows) + .apk (Android) desde un solo código
- **IA incluida**: cada app trae Mini IA (búsqueda + predicciones + QA)
- **Sin vendor lock-in**: el cliente tiene sus datos, cifrados, exportables

## Templates disponibles

| App | Vertical | Precio base | IA | Estado |
|-----|----------|------------|----|--------|
| [AHA Inventario](AHA-Inventario/template.md) | Retail / Comercio | $99 | ✅ Lite | 🟢 En spec |
| [AHA Comanda](AHA-Comanda/template.md) | Restaurantes / Bares | $99 | ✅ Lite | 🟢 Listo |
| [AHA CRM](AHA-CRM/template.md) | Ventas / Freelancers | $99 | ✅ Lite | 🟢 En spec |
| [AHA Checklist](AHA-Checklist/template.md) | Mantenimiento / Inspecciones | $99 | ✅ Lite | 🟢 Listo |
| [AHA Asistencia](AHA-Asistencia/template.md) | RRHH / Pequeñas empresas | $49 | ✅ Lite | 🟢 Listo |
| [AHA Citas](AHA-Citas/template.md) | Salud / Belleza / Servicios | $99 | ✅ Lite | 🟢 Listo |
| [AHA Creador](AHA-Creador/template.md) | Creadores de contenido | $49 | ✅ Lite | 🟢 Listo |
| [AHA Campo](AHA-Campo/template.md) | Agricultura / Ganadería | $99 | ✅ Lite | 🟢 Listo |

## Cómo usar un template

Cada app tiene dos formatos de documentación:

1. **`apps/AHA-Nombre/template.md`** — template comercial con pricing, target, argumentos de venta
2. **`Plantilla_AHA_Nombre.md`** (raíz del repo) — spec técnica lista para pasar al code-generador de OpenCode

Para generar una app:

```bash
# 1. Copiar la plantilla a specs/
cp Plantilla_AHA_Nombre.md specs/[app].md

# 2. Ejecutar el pipeline
/nuevo [nombre-app] --perfil full --ia full

# 3. El pipeline ejecuta:
#    setup-init → code-generator → validation → deployment
```

Cada template incluye:

- **Descripción comercial**: qué problema resuelve, para quién
- **Módulos**: lista de módulos con sus tablas Dexie y campos UUID
- **IA integrada**: qué funciones de IA aplican por módulo
- **UI**: estructura de pantallas y componentes principales
- **Pricing**: sugerencia de precio Lite / Standard / Custom
- **WhatsApp**: mensaje pre-llenado para venta directa
- **Checklist**: pasos antes de lanzar

## Próximos templates (en backlog)

| App | Vertical | Prioridad |
|-----|----------|-----------|
| AHA POS | Punto de venta offline | Alta |
| AHA Rx | Recetas médicas offline | Media |
| AHA Flota | Control de flota/vehículos | Media |
| AHA Obra | Construcción / avance de obra | Media |
| AHA PreFactura | Prefacturación offline | Baja |
