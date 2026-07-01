# AHA Rx — Recetas médicas offline para consultorios

## Descripción comercial

Sistema de recetas médicas offline para médicos generales y consultorios. Registro de pacientes, catálogo de medicamentos, generación de recetas en PDF e historial clínico completo. Sin internet, sin mensualidades.

**Target:** Médicos generales, consultorios particulares, farmacias, pasantes de servicio social.

**Dolor que resuelve:** "Mis recetas se pierden y no tengo historial de lo que le receté a cada paciente."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## Módulos

### 👤 Módulo Pacientes
- CRUD: nombre, teléfono, dirección, fecha de nacimiento, alergias
- Búsqueda instantánea por nombre o teléfono
- Historial completo de recetas por paciente

### 💊 Módulo Medicamentos
- CRUD: nombre genérico, presentación, dosis comunes, laboratorio
- Búsqueda por nombre con autocompletado
- Catálogo precargado con medicamentos básicos

### 📋 Módulo Recetas
- Seleccionar paciente, agregar medicamentos con dosis, frecuencia y duración
- Diagnóstico, indicaciones adicionales, fecha de próxima cita
- Generación de PDF con formato médico profesional
- Firma digital del médico (texto)

### 📜 Módulo Historial
- Recetas previas por paciente en orden cronológico
- Búsqueda por diagnóstico, medicamento o fecha
- Vista detalle de cada receta con opción de reimprimir PDF

### 📊 Módulo Estadísticas
- Dashboard: total pacientes, recetas emitidas hoy
- Diagnósticos más frecuentes (gráfico Chart.js)
- Export a CSV

## Tablas Dexie

```javascript
db.version(2).stores({
  pacientes: 'id, nombre, *telefono, direccion, *fechaNacimiento, alergias, createdAt, updatedAt',
  medicamentos: 'id, nombre, *presentacion, *laboratorio, createdAt, updatedAt',
  recetas: 'id, *pacienteId, *diagnostico, indicaciones, *proximaCita, *createdBy, createdAt, updatedAt',
  recetas_items: 'id, *recetaId, *medicamentoId, dosis, frecuencia, duracion',
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
| Custom | $149+ |

## WhatsApp para venta

```
Hola Angel, soy médico y necesito llevar mis recetas en digital
sin pagar mensualidades. ¿AHA Rx plan Standard con .exe y .apk?


