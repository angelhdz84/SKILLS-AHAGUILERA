# AHA Rx â€” Recetas mÃ©dicas offline para consultorios

## DescripciÃ³n comercial

Sistema de recetas mÃ©dicas offline para mÃ©dicos generales y consultorios. Registro de pacientes, catÃ¡logo de medicamentos, generaciÃ³n de recetas en PDF e historial clÃ­nico completo. Sin internet, sin mensualidades.

**Target:** MÃ©dicos generales, consultorios particulares, farmacias, pasantes de servicio social.

**Dolor que resuelve:** "Mis recetas se pierden y no tengo historial de lo que le recetÃ© a cada paciente."

## Niveles comerciales

| Nivel | Perfil tecnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | Bun --compile .exe + GitHub Pages + Release | FlexSearch + Transformers.js QA |
| Enterprise | Full + custom | Codigo fuente + UI personalizada | FlexSearch + Transformers.js QA |

## MÃ³dulos

### ðŸ‘¤ MÃ³dulo Pacientes
- CRUD: nombre, telÃ©fono, direcciÃ³n, fecha de nacimiento, alergias
- BÃºsqueda instantÃ¡nea por nombre o telÃ©fono
- Historial completo de recetas por paciente

### ðŸ’Š MÃ³dulo Medicamentos
- CRUD: nombre genÃ©rico, presentaciÃ³n, dosis comunes, laboratorio
- BÃºsqueda por nombre con autocompletado
- CatÃ¡logo precargado con medicamentos bÃ¡sicos

### ðŸ“‹ MÃ³dulo Recetas
- Seleccionar paciente, agregar medicamentos con dosis, frecuencia y duraciÃ³n
- DiagnÃ³stico, indicaciones adicionales, fecha de prÃ³xima cita
- GeneraciÃ³n de PDF con formato mÃ©dico profesional
- Firma digital del mÃ©dico (texto)

### ðŸ“œ MÃ³dulo Historial
- Recetas previas por paciente en orden cronolÃ³gico
- BÃºsqueda por diagnÃ³stico, medicamento o fecha
- Vista detalle de cada receta con opciÃ³n de reimprimir PDF

### ðŸ“Š MÃ³dulo EstadÃ­sticas
- Dashboard: total pacientes, recetas emitidas hoy
- DiagnÃ³sticos mÃ¡s frecuentes (grÃ¡fico ApexCharts)
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
Hola Angel, soy mÃ©dico y necesito llevar mis recetas en digital
sin pagar mensualidades. Â¿AHA Rx plan Standard con .exe y .apk?


