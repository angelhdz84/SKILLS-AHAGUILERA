# AHA Contactos — CRM manual companion para vendedores

## Descripción comercial

Gestiona tus contactos de ventas, da seguimiento a clientes y organiza tu agenda comercial — todo offline, sin internet. Usa plantillas de mensajes para copiar a WhatsApp, programa recordatorios de seguimiento y etiqueta clientes por estado. Sin integración API, sin mensualidades.

**Target:** Vendedores, inmobiliarias, agentes de seguros, servicios profesionales, pymes.

**Dolor que resuelve:** "Tengo 500 contactos en WhatsApp y no sé a quién seguir ni cuándo."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | .exe + .apk | FlexSearch + alertas inteligentes |

## Módulos

### 📊 Dashboard
- Contactos nuevos del día
- Seguimientos pendientes (recordatorios activos)
- Total clientes por etiqueta

### 👥 Contactos
- CRUD: nombre, teléfono, email, empresa, notas
- Etiquetas: prospecto, cliente, VIP, inactivo
- Búsqueda instantánea

### 📋 Historial
- Timeline de interacciones por contacto
- Tipos: llamada, mensaje, reunión, nota
- Registro manual con fecha y descripción

### 💬 Plantillas
- Mensajes predefinidos para copiar y pegar en WhatsApp
- Categorías: saludo, seguimiento, oferta, cobro, cierre
- Editor para crear/editar plantillas

### ⏰ Recordatorios
- Alerta por fecha para dar seguimiento a un contacto
- Estado: pendiente / completado
- Vista "recordatorios de hoy"

### 📤 Export
- CSV de todos los contactos con historial
- Filtro por etiqueta antes de exportar

## Tablas Dexie

```javascript
db.version(2).stores({
  contactos: 'id, nombre, *telefono, *email, *empresa, *etiqueta, *notas, *ultimoContacto, *createdBy, createdAt, updatedAt',
  historial: 'id, *contactoId, *tipo, *descripcion, *fecha, createdAt',
  plantillas: 'id, nombre, *contenido, *categoria, *createdBy, createdAt, updatedAt',
  recordatorios: 'id, *contactoId, *fecha, *nota, completado, *createdBy, createdAt, updatedAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Tarjetas de resumen, recordatorios de hoy, últimos contactos |
| Contactos | Lista con búsqueda, modal CRUD, badges de etiqueta |
| Detalle contacto | Timeline de historial, botón copiar teléfono, recordatorios |
| Plantillas | Grid de tarjetas por categoría, botón copiar al portapapeles |
| Recordatorios | Lista con check, filtro hoy/semana/todos |
| Export | Selector de etiquetas, botón descargar CSV |

## IA integrada

- **Búsqueda**: buscar contactos por nombre, teléfono o empresa
- **Alerta**: "Tienes 8 contactos que no has contactado en más de 30 días"

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $99 | Contactos + plantillas + historial |
| Full | $149 | + Recordatorios + IA alertas + export CSV |

## WhatsApp para venta

```
Hola Angel, necesito organizar mis contactos de WhatsApp
y dar seguimiento a clientes. ¿AHA Contactos con recordatorios?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear contacto → registrar historial → programar recordatorio
- [ ] Probar copiar plantilla al portapapeles
- [ ] Probar notificación de recordatorio al abrir app
- [ ] Probar export CSV con contactos de prueba
- [ ] Probar búsqueda por nombre y teléfono
