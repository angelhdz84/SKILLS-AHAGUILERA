# AHA Rx

## Descripción
Sistema de recetas médicas offline para consultorios. Registro de pacientes, catálogo de medicamentos, generación de recetas PDF con formato médico profesional e historial clínico completo. Sin internet, pago único.

## Perfil
full

## Component Library
auto

## IA Jutia
lite

## Librerías Adicionales
- dayjs.min.js

## Módulos

### Módulo Dashboard
Resumen con total de pacientes, recetas emitidas hoy, próximas citas, diagnósticos más frecuentes. Gráficos con ApexCharts.

### Módulo Pacientes
CRUD completo: nombre completo, teléfono, dirección, fecha de nacimiento, alergias, observaciones. Búsqueda instantánea por nombre o teléfono. Vista de historial completo de recetas por paciente.

**Campos sensibles:** teléfono, dirección (cifrar con CryptoJS)

### Módulo Medicamentos
CRUD: nombre genérico, presentación (tableta, ml, ampolla, crema), dosis común sugerida, laboratorio. Búsqueda por nombre con autocompletado. Catálogo inicial con medicamentos básicos precargados (paracetamol, ibuprofeno, amoxicilina, etc.).

### Módulo Recetas
Crear receta: seleccionar paciente → escribir diagnóstico → agregar medicamentos (medicamento, dosis, frecuencia, duración) → indicaciones adicionales → fecha próxima cita (opcional). Generación de PDF con formato médico profesional: logo consultorio, datos del médico, paciente, medicamentos en tabla, diagnóstico, indicaciones, firma. Reimprimir desde historial.

### Módulo Historial
Lista de recetas por paciente en orden cronológico descendente. Filtros por fecha, diagnóstico o medicamento. Vista detalle de cada receta con opción de reimprimir PDF. Búsqueda de pacientes por diagnóstico previo.

### Módulo Estadísticas
Dashboard: total pacientes, recetas por mes (gráfico), diagnósticos más frecuentes (pastel/barra), medicamentos más recetados. Export a CSV.

## Tablas Dexie

```javascript
db.version(1).stores({
  pacientes: 'id, nombre, *telefono, direccion, *fechaNacimiento, alergias, createdAt, updatedAt',
  medicamentos: 'id, nombre, *presentacion, *laboratorio, createdAt',
  recetas: 'id, *pacienteId, *diagnostico, indicaciones, *proximaCita, *createdBy, createdAt',
  recetas_items: 'id, *recetaId, *medicamentoId, dosis, frecuencia, duracion'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Cards (pacientes, recetas hoy, próximas citas), gráfico recetas por mes, top diagnósticos |
| Pacientes | Tabla con buscador, modal CRUD, botón "Ver historial" que lleva a historial del paciente |
| Medicamentos | Tabla con buscador y autocompletado, modal CRUD, precarga de medicamentos básicos |
| Recetas | Formulario: selector paciente (buscador), input diagnóstico, tabla dinámica de medicamentos con botón "Agregar", textarea indicaciones, datepicker próxima cita, botón "Generar PDF" |
| Historial | Tabla cronológica, filtros, al dar clic muestra detalle con botón reimprimir |
| Estadísticas | Selector período, gráficos ApexCharts, botón export CSV |

## Reglas de UI/UX

- Sidebar con iconos Bootstrap: dashboard, pacientes, medicamentos, recetas, historial, estadísticas
- La generación de PDF debe ser instantánea (sin spinner largo)
- Autocompletado en búsqueda de pacientes y medicamentos
- Modal para CRUDs de pacientes y medicamentos
- Al crear receta: flujo paso a paso en un solo panel (no wizard multi-página)
- Vista previa de receta antes de generar PDF
- Confirmación antes de eliminar paciente o medicamento
- Toast feedback en cada operación CRUD
- Formato PDF con datos del médico configurables en settings
