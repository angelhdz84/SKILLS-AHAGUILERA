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
| [AHA Inventario](AHA-Inventario/template.md) | Retail / Comercio | $99 | ✅ Lite | 🟢 Listo |
| [AHA Comanda](AHA-Comanda/template.md) | Restaurantes / Bares | $99 | ✅ Lite | 🟢 Listo |
| [AHA CRM](AHA-CRM/template.md) | Ventas / Freelancers | $99 | ✅ Lite | 🟢 Listo |
| [AHA Checklist](AHA-Checklist/template.md) | Mantenimiento / Inspecciones | $99 | ✅ Lite | 🟢 Listo |
| [AHA Asistencia](AHA-Asistencia/template.md) | RRHH / Pequeñas empresas | $49 | ✅ Lite | 🟢 Listo |
| [AHA Citas](AHA-Citas/template.md) | Salud / Belleza / Servicios | $99 | ✅ Lite | 🟢 Listo |
| [AHA Gastos](AHA-Gastos/template.md) | Control gastos micro-negocio | $49 | ✅ Lite | 🟢 Listo |
| [AHA Contactos](AHA-Contactos/template.md) | CRM manual companion | $99 | ✅ Lite | 🟢 Listo |
| [AHA Campo](AHA-Campo/template.md) | Agricultura / Ganadería | $99 | ✅ Lite | 🟢 Listo |
| [AHA POS](AHA-POS/template.md) | Punto de venta offline | $99 | ✅ Lite | 🟢 Listo |
| [AHA Rx](AHA-Rx/template.md) | Recetas médicas offline | $99 | ✅ Lite | 🟢 Listo |
| [AHA Flota](AHA-Flota/template.md) | Control de flota/vehículos | $99 | ✅ Lite | 🟢 Listo |
| [AHA Obra](AHA-Obra/template.md) | Construcción / avance de obra | $99 | ✅ Lite | 🟢 Listo |
| [AHA PreFactura](AHA-PreFactura/template.md) | Prefacturación offline | $49 | ✅ Lite | 🟢 Listo |

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

*(próximas: Caja Chica como feature de POS, ver design doc)*
