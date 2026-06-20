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
| [ComandaApp](ComandaApp/template.md) | Restaurantes / Bares | $99 | ✅ Lite | 🟢 Listo |
| [ChecklistPRO](ChecklistPRO/template.md) | Mantenimiento / Inspecciones | $99 | ✅ Lite | 🟢 Listo |
| [AsistenciaApp](AsistenciaApp/template.md) | RRHH / Pequeñas empresas | $49 | ✅ Lite | 🟢 Listo |
| [CitasApp](CitasApp/template.md) | Salud / Belleza / Servicios | $99 | ✅ Lite | 🟢 Listo |
| [CreadorApp](CreadorApp/template.md) | Creadores de contenido | $49 | ✅ Lite | 🟢 Listo |
| [CampoApp](CampoApp/template.md) | Agricultura / Ganadería | $99 | ✅ Lite | 🟢 Listo |
| [InventarioPRO](../docs/landing-aha-sell.md) | Retail / Comercio | $99 | ✅ Lite | 🟢 En landing |
| [ClienteSeguro (CRM)](../docs/landing-aha-sell.md) | Ventas / Freelancers | $99 | ✅ Lite | 🟢 En landing |

## Cómo usar un template

```bash
# 1. Elegir app y perfil (lite/full)
# 2. Ejecutar pipeline
/crear [nombre-app] --template apps/[AppName]/template.md --perfil full

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
| POS Lite | Punto de venta offline | Alta |
| RxApp | Recetas médicas offline | Media |
| FlotaApp | Control de flota/vehículos | Media |
| ObraApp | Construcción / avance de obra | Media |
| PreFactura | Prefacturación offline | Baja |
