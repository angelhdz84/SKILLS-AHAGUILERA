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
- CRUD: nombre, empresa (desde catálogo empresas), teléfono, email, cargo, dirección
- Catálogo de empresas con datos de contacto
- Tags por contacto (etiquetas coloridas)
- Notas enriquecidas por contacto (markdown)
- Historial de interacciones por contacto (llamada, reunión, email, nota rápida)
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

\`\`\`javascript
db.version(2).stores({
  // ─── Catálogos ───
  actividad_tipos: 'id, nombre, *icono, *color, *orden, createdAt',

  // ─── Entidades principales ───
  empresas: 'id, nombre, *telefono, email, direccion, *industria, *createdBy, createdAt, updatedAt',
  contactos: 'id, nombre, *empresaId, *telefono, email, *cargo, *createdBy, createdAt, updatedAt',

  // ─── Pipeline ───
  deals: 'id, *contactoId, *empresaId, nombre, *monto, *etapa, *probabilidad, *fechaCierre, *createdBy, createdAt, updatedAt',

  // ─── Documentos ───
  cotizaciones: 'id, *dealId, *items, *total, *pdfGenerado, *estado, *validez, *createdBy, createdAt, updatedAt',
  facturas: 'id, *dealId, *contactoId, *folio, *total, *estado, *fechaVencimiento, *createdBy, createdAt, updatedAt',

  // ─── Actividad ───
  interacciones: 'id, *contactoId, *dealId, *tipoId, *nota, *createdBy, createdAt',

  // ─── Tags polimórficos ───
  tags: 'id, nombre, *color, createdAt',
  taggings: 'id, *tagId, *taggableId, *taggableType, createdAt',

  // ─── Notas enriquecidas ───
  notas: 'id, *notableId, *notableType, *contenido, *createdBy, createdAt, updatedAt',

  // ─── Sistema ───
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});
\`\`\`

## Migración Dexie

\`\`\`javascript
// v1: schema original (contactos, deals, cotizaciones, facturas, interacciones + sistema)
// v2: schema enriquecido (empresas separadas, actividad_tipos, tags, taggings, notas)

db.version(1).stores({
  contactos: 'id, nombre, *empresa, *telefono, email, *notas, *createdBy, createdAt, updatedAt',
  deals: 'id, *contactoId, *nombre, *monto, *etapa, *probabilidad, *fechaCierre, *createdBy, createdAt, updatedAt',
  cotizaciones: 'id, *dealId, *items, *total, *pdfGenerado, *estado, *createdBy, createdAt, updatedAt',
  facturas: 'id, *dealId, *contactoId, *folio, *total, *estado, *createdBy, createdAt, updatedAt',
  interacciones: 'id, *contactoId, *tipo, *nota, *createdBy, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt'
});

db.version(2).stores({
  actividad_tipos: 'id, nombre, *icono, *color, *orden, createdAt',
  empresas: 'id, nombre, *telefono, email, direccion, *industria, *createdBy, createdAt, updatedAt',
  contactos: 'id, nombre, *empresaId, *telefono, email, *cargo, *createdBy, createdAt, updatedAt',
  deals: 'id, *contactoId, *empresaId, nombre, *monto, *etapa, *probabilidad, *fechaCierre, *createdBy, createdAt, updatedAt',
  cotizaciones: 'id, *dealId, *items, *total, *pdfGenerado, *estado, *validez, *createdBy, createdAt, updatedAt',
  facturas: 'id, *dealId, *contactoId, *folio, *total, *estado, *fechaVencimiento, *createdBy, createdAt, updatedAt',
  interacciones: 'id, *contactoId, *dealId, *tipoId, *nota, *createdBy, createdAt',
  tags: 'id, nombre, *color, createdAt',
  taggings: 'id, *tagId, *taggableId, *taggableType, createdAt',
  notas: 'id, *notableId, *notableType, *contenido, *createdBy, createdAt, updatedAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _ia_chats: 'id, *titulo, *modelo, *createdBy, createdAt, updatedAt',
  _ia_messages: 'id, *chatId, *rol, contenido, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _analytics: 'id, *page, *category, *action, *synced, *timestamp, createdAt'
}).upgrade(tx => {
  // Migrar contactos v1 → v2: extraer empresa string a entidad empresas
  var empresasMap = {};
  return tx.table('contactos').toCollection().modify(function(c) {
    // Si el contacto tiene una empresa como string, migrarla
    if (c.empresa && typeof c.empresa === 'string' && c.empresa.trim()) {
      var key = c.empresa.trim().toLowerCase();
      if (!empresasMap[key]) {
        empresasMap[key] = window.uuid();
      }
      c.empresaId = empresasMap[key];
    }
    delete c.empresa;
    // Migrar notas simples a historial si existen
    if (c.notas && typeof c.notas === 'string' && c.notas.trim()) {
      // la nota se conserva en el campo notas del contacto v2
    }
  });
});

window.DB_VERSION = 2;
\`\`\`

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Tasa de conversión, ingresos del mes, deals por etapa, últimos contactos |
| Pipeline | Kanban con 5 etapas, drag & drop, modal deal, barra de progreso |
| Contactos | Lista con búsqueda + filtro por empresa/tag, modal CRUD con selector de empresa y tags, historial de interacciones por tipo, notas markdown |
| Cotizaciones | Lista, formulario items, botón generar PDF, botón compartir |
| Facturación | Lista con estado, formulario, export PDF, folio automático |
| Reportes | Gráficos Chart.js, selector de período, export CSV |

## IA integrada

- **Búsqueda**: buscar contactos y deals por nombre, empresa o teléfono
- **Análisis**: "Tu tasa de conversión mejoró 15% este mes vs el anterior"
- **Predicción**: "Basado en tu pipeline actual, proyectas $X en ingresos este mes"

## WhatsApp para venta

```
Hola Angel, necesito un CRM offline para gestionar mis clientes
y ventas sin mensualidades. ¿AHA CRM con pipeline Kanban?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear contacto → crear deal → mover por pipeline → cerrar
- [ ] Probar arrastrar deals entre etapas del Kanban
- [ ] Probar generar PDF de cotización con items reales
- [ ] Probar factura desde deal cerrado con folio automático
- [ ] Probar gráficos de reportes con datos de 3 meses
- [ ] Probar búsqueda por nombre y empresa
- [ ] Probar export CSV de contactos y reportes


