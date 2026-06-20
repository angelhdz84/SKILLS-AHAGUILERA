# AHA Rx — Recetas médicas offline para consultorios

## Descripción comercial

Sistema de recetas médicas offline para médicos generales y consultorios. Registro de pacientes, catálogo de medicamentos, generación de recetas en PDF e historial clínico completo. Sin internet, sin mensualidades.

**Target:** Médicos generales, consultorios particulares, farmacias, pasantes de servicio social.

**Dolor que resuelve:** "Mis recetas se pierden y no tengo historial de lo que le receté a cada paciente."

## Perfiles compatibles

| Perfil | Formato | IA |
|--------|---------|----|
| Lite | .exe | Búsqueda de pacientes + historial de recetas |
| Standard | .exe + .apk | + Búsqueda por síntomas + diagnósticos frecuentes |
| Custom | .exe + .apk + código fuente | Todo + UI con logo del consultorio |

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
- Diagnósticos más frecuentes (gráfico ApexCharts)
- Export a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  pacientes: 'id, nombre, *telefono, direccion, *fechaNacimiento, alergias, createdAt, updatedAt',
  medicamentos: 'id, nombre, *presentacion, *laboratorio, createdAt',
  recetas: 'id, *pacienteId, *diagnostico, indicaciones, *proximaCita, *createdBy, createdAt',
  recetas_items: 'id, *recetaId, *medicamentoId, dosis, frecuencia, duracion'
})
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
