# AHA-Gastos, AHA-Contactos, Corte — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear templates de 2 nuevas apps (AHA-Gastos, AHA-Contactos) + archivar AHA-Creador + agregar módulo Corte a AHA-POS.

**Architecture:** 4 tareas independientes, cada una crea/modifica archivos `apps/*/template.md`. Sin dependencias técnicas entre tareas — cualquier orden funciona.

**Tech Stack:** Markdown templates con estructura consistente (descripción, niveles, módulos, Dexie, IA, pricing, WhatsApp).

**Spec:** `docs/superpowers/specs/2026-06-29-aha-nuevas-apps-design.md`

---

### Task 0: Archivar AHA-Creador

**Files:**
- Move: `apps/AHA-Creador/template.md` → `apps/archived/AHA-Creador/template.md`
- Create: `apps/archived/AHA-Creador/` (directorio)

- [ ] **Step 1: Crear directorio archived/AHA-Creador y mover template**

```bash
New-Item -ItemType Directory -Path "apps/archived/AHA-Creador" -Force
Move-Item -Path "apps/AHA-Creador/template.md" -Destination "apps/archived/AHA-Creador/template.md"
Remove-Item -Path "apps/AHA-Creador" -Recurse
```

Expected: `apps/AHA-Creador/` ya no existe, `apps/archived/AHA-Creador/template.md` existe.

- [ ] **Step 2: Verificar**

```bash
Test-Path "apps/archived/AHA-Creador/template.md"  # debe ser True
Test-Path "apps/AHA-Creador"                        # debe ser False
```

- [ ] **Step 3: Commit**

```bash
git add apps/archived/AHA-Creador apps/AHA-Creador
git rm -r apps/AHA-Creador
git commit -m "archive: mueve AHA-Creador a archived, reemplazado por AHA-Gastos"
```

---

### Task 1: Crear apps/AHA-Gastos/template.md

**Files:**
- Create: `apps/AHA-Gastos/template.md`

- [ ] **Step 1: Crear directorio**

```bash
New-Item -ItemType Directory -Path "apps/AHA-Gastos" -Force
```

- [ ] **Step 2: Escribir template.md**

```markdown
# AHA Gastos — Control de gastos para micro-negocios

## Descripción comercial

Lleva el control de ingresos y egresos diarios de tu negocio sin depender de internet. Categoriza gastos, genera reportes mensuales en PDF y visualiza el flujo de caja con gráficos. Ideal para micro-pymes que necesitan saber si están ganando o perdiendo dinero.

**Target:** Micro-pymes, emprendedores, tiendas, freelancers, pequeños negocios en Latam.

**Dolor que resuelve:** "No sé si estoy ganando o perdiendo dinero porque no llevo un control diario."

## Niveles comerciales

| Nivel | Perfil técnico | Formato | IA |
|-------|---------------|---------|----|
| Inicio | Lite | ZIP + GitHub Pages | FlexSearch |
| Profesional | Full | .exe + .apk | FlexSearch + Stats + Predicción |

## Módulos

### 📊 Dashboard
- Saldo actual del mes
- Ingresos vs gastos gráfico
- Últimos 5 movimientos

### 💳 Movimientos
- CRUD completo: tipo (ingreso/egreso), categoría, monto, fecha, nota
- Filtro por mes, categoría, tipo

### 🏷️ Categorías
- CRUD personalizable
- Predefinidas: renta, luz, mercancía, nómina, transporte, alimentos, servicios, otros

### 📈 Reportes
- Gráfico de flujo de caja (barras por mes)
- Export PDF de reporte mensual
- Tabla filtrable exportable a CSV

## Tablas Dexie

```javascript
db.version(1).stores({
  movimientos: 'id, tipo, *categoria, monto, *fecha, *nota, *createdBy, createdAt',
  categorias: 'id, nombre, tipo, *createdBy, createdAt'
})
```

## UI

| Pantalla | Componentes |
|----------|------------|
| Dashboard | Saldo, gráfico donut ingresos/gastos, últimos movimientos |
| Movimientos | Lista filtrable, formulario modal, selector de categoría |
| Categorías | Grid de tarjetas con edición inline |
| Reportes | Selector de mes, gráfico Chart.js, botón export PDF |

## IA integrada

- **Estadísticas**: "Este mes gastaste 30% más que el anterior en mercancía"
- **Predicción**: "Si sigues este ritmo, tu saldo proyectado al cierre del mes es $X"

## Pricing sugerido

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| Lite | $49 | Dashboard + movimientos + categorías |
| Full | $99 | + Reportes PDF + gráficos + IA Stats + Predicción |

## WhatsApp para venta

```
Hola Angel, necesito controlar los gastos de mi negocio
sin herramientas online. ¿AHA Gastos con reportes PDF?
```

## Checklist pre-lanzamiento

- [ ] Probar flujo: crear categoría → registrar ingreso → registrar egreso → ver dashboard
- [ ] Probar gráfico flujo de caja con datos de 3 meses
- [ ] Probar export PDF con datos reales
- [ ] Probar filtros de movimientos por mes/categoría/tipo
```

- [ ] **Step 3: Commit**

```bash
git add apps/AHA-Gastos/template.md
git commit -m "feat: template AHA-Gastos para micro-negocios"
```

---

### Task 2: Crear apps/AHA-Contactos/template.md

**Files:**
- Create: `apps/AHA-Contactos/template.md`

- [ ] **Step 1: Crear directorio**

```bash
New-Item -ItemType Directory -Path "apps/AHA-Contactos" -Force
```

- [ ] **Step 2: Escribir template.md**

```markdown
# AHA Contactos — CRM manual companion para vendedores

## Descripción comercial

Gestiona tus contactos de ventas, da seguimiento a clientes y organiza tu agenda comercial — todo offline, sin internet. Usa plantillas de mensajes para copiar a WhatsApp, programa recordatorios de seguimiento y etiqueta clientes por estado. Sin integración API, sin mensualidades.

**Target:** Vendedores, inmobiliarias, agentes de seguros, servicios profesionales, pymes.

**Dolor que resuelve:** "Tengo 500 contactos en WhatsApp y no sé a quién seguir ni cuándo."

## Niveles comerciales

| Nivel | Perfil técnico | Formato | IA |
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
db.version(1).stores({
  contactos: 'id, nombre, *telefono, *email, *empresa, *etiqueta, *notas, *ultimoContacto, *createdBy, createdAt, updatedAt',
  historial: 'id, *contactoId, *tipo, *descripcion, *fecha, createdAt',
  plantillas: 'id, nombre, *contenido, *categoria, *createdBy, createdAt',
  recordatorios: 'id, *contactoId, *fecha, *nota, completado, *createdBy, createdAt'
})
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
```

- [ ] **Step 3: Commit**

```bash
git add apps/AHA-Contactos/template.md
git commit -m "feat: template AHA-Contactos CRM manual companion"
```

---

### Task 3: Modificar apps/AHA-POS/template.md — + módulo Corte

**Files:**
- Modify: `apps/AHA-POS/template.md`

Changes needed:
1. Expand existing "Corte de Caja" module with gastos menores + arqueo por denominación
2. Add `gastosMenores` table to Dexie schema (db.version(2))

- [ ] **Step 1: Reemplazar módulo Corte de Caja existente con versión expandida**

Lines 32-35 actuales:
```
### 💵 Módulo Corte de Caja
- Apertura y cierre de caja por turno
- Resumen: total ventas, métodos de pago, número de transacciones
- Diferencia entre efectivo esperado vs real
```

Reemplazar con:
```
### 💵 Módulo Corte
- **Arqueo**: ingreso de montos por denominación (billetes/monedas), total calculado vs esperado, alerta de descuadre
- **Gastos Menores**: registro rápido de gasto con concepto y monto, se descuenta del fondo de caja
- **Cierre**: congela el corte del turno, inicia nuevo corte automáticamente
- **Historial**: cortes anteriores con detalle de arqueo y gastos, exportable
```

- [ ] **Step 2: Expandir Dexie schema — agregar tabla gastosMenores + migrar a version 2**

Lines 49-58 actuales:
```javascript
db.version(1).stores({
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  categorias: 'id, nombre, color, createdAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento',
  cortes: 'id, *folio, apertura, cierre, totalEsperado, totalReal, *createdBy, createdAt',
  devoluciones: 'id, *ventaId, *productoId, cantidad, *motivo, reembolso, createdAt'
})
```

Reemplazar con:
```javascript
// v2: + gastosMenores + arqueoDetalle
db.version(2).stores({
  productos: 'id, nombre, *codigoBarras, *categoriaId, precio, stock, createdAt, updatedAt',
  categorias: 'id, nombre, color, createdAt',
  ventas: 'id, *folio, total, *metodoPago, *createdBy, createdAt',
  ventas_items: 'id, *ventaId, *productoId, cantidad, precioUnitario, descuento',
  cortes: 'id, *folio, apertura, cierre, totalEsperado, totalReal, *createdBy, createdAt',
  devoluciones: 'id, *ventaId, *productoId, cantidad, *motivo, reembolso, createdAt',
  gastosMenores: 'id, *corteId, *concepto, monto, *hora, *createdBy, createdAt'
})
```

- [ ] **Step 3: Commit**

```bash
git add apps/AHA-POS/template.md
git commit -m "feat(POS): modulo Corte expandido con gastos menores + arqueo por denominacion"
```

---

### Post-Implementation

- [ ] **Push all commits**

```bash
git push
```

- [ ] **Save Engram memory**

```javascript
mem_save({
  title: "Created AHA-Gastos, AHA-Contactos, Corte module",
  content: "**What**: 2 new app templates + 1 POS module + archived Creador\n**Why**: Replace low-value Creador with Gastos (universal micro-pyme pain), add Contactos CRM companion, enhance POS with Corte\n**Where**: apps/AHA-Gastos/template.md, apps/AHA-Contactos/template.md, apps/AHA-POS/template.md\n**Learned**: Corte module already had basic structure in POS, only needed expansion"
})
```
