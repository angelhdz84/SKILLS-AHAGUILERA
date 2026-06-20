# AHA CRM â€” GestiÃ³n de clientes y ventas offline

## DescripciÃ³n comercial

CRM minimalista offline para freelancers y pequeÃ±os negocios. GestiÃ³n de clientes, pipeline de ventas Kanban, cotizaciones, recordatorios y facturaciÃ³n bÃ¡sica. Sin la complejidad de Salesforce, sin mensualidades.

**Target:** Freelancers, consultores, agentes de seguros, agencias pequeÃ±as, negocios de servicios profesionales.

**Dolor que resuelve:** "Uso Excel para clientes, WhatsApp para cotizaciones y una libreta para seguimiento. Necesito todo en un solo lugar."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ‘¤ MÃ³dulo Contactos
- CRUD: nombre, empresa, telÃ©fono, email, direcciÃ³n, notas
- Historial de interacciones por contacto
- BÃºsqueda instantÃ¡nea IA

### ðŸ“‹ MÃ³dulo Pipeline (Kanban)
- Etapas: prospecto, contactado, propuesta, negociaciÃ³n, cerrado
- Arrastrar deals entre etapas
- Deal: nombre, contacto, monto, probabilidad, fecha cierre

### ðŸ“„ MÃ³dulo Cotizaciones
- Crear cotizaciÃ³n desde un deal
- Items: servicio, cantidad, precio
- Generar PDF de cotizaciÃ³n
- Enviar por WhatsApp (compartir archivo)

### ðŸ’° MÃ³dulo FacturaciÃ³n
- Generar factura desde deal cerrado
- NÃºmero de factura automÃ¡tico
- Estado: pagada / pendiente / vencida
- Export PDF

### ðŸ“Š MÃ³dulo Reportes
- Tasa de conversiÃ³n por etapa
- Ingresos del mes por cliente
- Export CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  contactos: 'id, nombre, *empresa, *telefono, email, *notas, *createdBy, createdAt, updatedAt',
  deals: 'id, *contactoId, *nombre, *monto, *etapa, *probabilidad, *fechaCierre, *createdBy, createdAt, updatedAt',
  cotizaciones: 'id, *dealId, *items, *total, *pdfGenerado, *estado, *createdBy, createdAt, updatedAt',
  facturas: 'id, *dealId, *contactoId, *folio, *total, *estado, *createdBy, createdAt, updatedAt',
  interacciones: 'id, *contactoId, *tipo, *nota, *createdBy, createdAt'
})
```

## Pricing sugerido

| Nivel | Precio USD |
|-------|-----------|
| Lite | $49 |
| Standard | $99 |
| Custom | $199+ |


