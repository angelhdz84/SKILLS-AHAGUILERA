# AHA CRM — Gestión de clientes y ventas offline

## Descripción comercial

CRM minimalista offline para freelancers y pequeños negocios. Gestión de clientes, pipeline de ventas Kanban, cotizaciones, recordatorios y facturación básica. Sin la complejidad de Salesforce, sin mensualidades.

**Target:** Freelancers, consultores, agentes de seguros, agencias pequeñas, negocios de servicios profesionales.

**Dolor que resuelve:** "Uso Excel para clientes, WhatsApp para cotizaciones y una libreta para seguimiento. Necesito todo en un solo lugar."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 👤 Módulo Contactos
- CRUD: nombre, empresa, teléfono, email, dirección, notas
- Historial de interacciones por contacto
- Búsqueda instantánea IA

### 📋 Módulo Pipeline (Kanban)
- Etapas: prospecto, contactado, propuesta, negociación, cerrado
- Arrastrar deals entre etapas
- Deal: nombre, contacto, monto, probabilidad, fecha cierre

### 📄 Módulo Cotizaciones
- Crear cotización desde un deal
- Items: servicio, cantidad, precio
- Generar PDF de cotización
- Enviar por WhatsApp (compartir archivo)

### 💰 Módulo Facturación
- Generar factura desde deal cerrado
- Número de factura automático
- Estado: pagada / pendiente / vencida
- Export PDF

### 📊 Módulo Reportes
- Tasa de conversión por etapa
- Ingresos del mes por cliente
- Export CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  contactos: 'id, nombre, *empresa, *telefono, email, *notas, *createdBy, createdAt, updatedAt',
  deals: 'id, *contactoId, *nombre, *monto, *etapa, *probabilidad, *fechaCierre, *createdBy, createdAt, updatedAt',
  cotizaciones: 'id, *dealId, *items, *total, *pdfGenerado, *estado, *createdBy, createdAt, updatedAt',
  facturas: 'id, *dealId, *contactoId, *folio, *total, *estado, *createdBy, createdAt, updatedAt',
  interacciones: 'id, *contactoId, *tipo, *nota, *createdBy, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | $49 |
| Standard | $99 |
| Custom | $199+ |


