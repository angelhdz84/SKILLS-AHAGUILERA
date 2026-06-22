# Recomendación: AHA Citas — Agenda offline para negocios de servicios

> **App**: Sistema de gestión de citas 100% offline
> **Stack**: Alpine.js + Dexie + CryptoJS + DaisyUI + IA Jutia
> **Perfiles**: Inicio (Lite), Profesional (Full .exe + .apk), Enterprise (white-label)
> **Tiempo total**: ~1.5 horas probando los 3 perfiles

---

## 1. ¿Por qué AHA Citas?

| Prueba | Lo que ejercita del stack Ateje |
|--------|--------------------------------|
| 5 tablas Dexie con índices | `clientes`, `profesionales`, `servicios`, `citas`, `pagos` |
| Cifrado CryptoJS | Campos `telefono`, `email` en clientes |
| IA Jutia Lite | Búsqueda difusa de clientes + predicción horas pico + estadísticas |
| UI compleja | Calendario semanal, drag & drop reagendar, slots de tiempo |
| Exportación | Corte del día en PDF (jsPDF) y CSV (SheetJS) |
| .exe (Neutralino) | Notificaciones de citas, bandeja sistema, ventana nativa |
| .apk (Capacitor) | GPS buscar negocios cerca, cámara foto perfil, notif local recordatorios |
| Enterprise | White-label completo para clínicas/barberías/spas |

---

## 2. Módulos

### 📅 Módulo Agenda
- Calendario diario/semanal/mensual
- Bloques de tiempo por cita según duración del servicio
- Agendar: seleccionar cliente + servicio + profesional + hora
- Reagendar: mover cita con drag & drop
- Cancelar cita con motivo
- Vista del día: lista cronológica
- No permitir agendar donde ya hay cita (validación cruce horarios)

### 👤 Módulo Clientes
- CRUD: nombre, teléfono, email, notas
- **Campos sensibles**: teléfono, email (se cifran con CryptoJS)
- Historial de visitas: fecha, servicio, profesional, monto
- Cliente frecuente automático (después de 3 visitas)
- Búsqueda instantánea con IA FlexSearch

### 💇 Módulo Servicios
- CRUD: nombre, duración (minutos), precio
- Categorías: corte, tinte, manicure, consulta, etc.
- Asignar profesionales habilitados por servicio

### 👨‍🔧 Módulo Profesionales
- CRUD: nombre, horario laboral (entrada/salida), días de descanso
- Vista de agenda filtrada por profesional
- Servicios que ofrece cada uno

### 💰 Módulo Ingresos
- Registrar pago al cerrar cita (efectivo/tarjeta/transferencia)
- Corte del día: total, por profesional, por forma de pago
- Historial de ingresos por período
- Export PDF (jsPDF) y CSV (SheetJS)

---

## 3. Modelo de Datos (Dexie)

```javascript
db.version(1).stores({
  clientes: 'id, nombre, *telefono, email, *notas, *frecuente, *createdBy, createdAt, updatedAt',
  profesionales: 'id, nombre, *horarioEntrada, *horarioSalida, *diasDescanso, *serviciosOfrece, *createdBy, createdAt, updatedAt',
  categorias_servicios: 'id, nombre, createdAt',
  servicios: 'id, nombre, *categoriaId, duracion, precio, *createdBy, createdAt, updatedAt',
  citas: 'id, *clienteId, *profesionalId, *servicioId, *fecha, *horaInicio, *horaFin, *estado, *motivoCancelacion, *createdBy, createdAt, updatedAt',
  pagos: 'id, *citaId, *monto, *formaPago, *createdBy, createdAt'
})
```

- `*` indica campo indexado (búsqueda rápida)
- `telefono` y `email` se cifran con `cryptoHelpers.encrypt()`
- Todas las tablas usan UUID string (`id`) no `++id` autoincrement
- Todas incluyen `createdBy`, `createdAt`, `updatedAt`

---

## 4. Pantallas UI

| Pantalla | Componentes DaisyUI |
|----------|-------------------|
| **Dashboard** | Cards: citas hoy, próximas, ingresos del día, % ocupación |
| **Calendario** | Grid semanal con slots de tiempo, tap para crear cita, drag para reagendar. Colores por profesional. |
| **Nueva cita** | Selector cliente (búsqueda IA) → servicio → profesional → hora disponible |
| **Ficha cliente** | Datos personales + historial visitas + total gastado + badge "⭐ Frecuente" |
| **Corte día** | Total, por profesional, por servicio, export PDF/CSV |
| **Admin** | CRUD servicios, profesionales, categorías |

---

## 5. Diseño de Interfaz

- **Sidebar**: dashboard, calendario, clientes, corte, admin
- **Calendario semanal** como vista principal (la más usada)
- **Slots de tiempo** de 15/30 min según configuración
- **Colores por profesional** en el calendario
- **Badge "⭐ Frecuente"** en clientes con 3+ visitas
- **No permitir agendar** en slot ocupado (feedback visual rojo)
- **Confirmación** al cancelar cita con selector de motivo
- **Vista del día** con acordeón expandible por hora
- **Toast feedback** en cada operación

---

## 6. IA Jutia integrada

### Lite
- **Búsqueda**: buscar clientes por nombre, teléfono o descripción difusa (FlexSearch)
- **Predicción**: "Los miércoles a las 10am son los más solicitados. Sugiero abrir agenda"
- **Estadísticas**: servicio más vendido, profesional con más citas, hora pico

### Full (solo Profesional/Enterprise)
- **QA**: "¿Cuánto ingresó la barbería la semana pasada?" — respuesta con fuentes citadas
- **Ingesta**: subir PDF/DOCX con listas de precios o manuales
- **FTS5**: búsqueda rápida en documentos indexados

---

## 7. Perfiles de Entrega

### 🟢 Inicio (Lite) — ZIP + GitHub Pages

| Aspecto | Detalle |
|---------|---------|
| Runtime | Doble clic en `index.html` (file://) |
| Librerías | `scripts/descargar-libs.bat` (curl a `assets/`) |
| DB | Dexie (IndexedDB) |
| IA | FlexSearch + estadísticas + predicciones |
| Empaquetado | ZIP en `dist/` |
| Deploy | Push a main → GitHub Pages automático |
| Plugins nativos | Ninguno |
| Precio sugerido | $49 USD |

```
Tiempo: ~15 minutos
Comandos: /new → /setup → /spec → /build → /test → /deploy
```

### 🔵 Profesional (Full) — .exe + .apk

| Aspecto | Detalle |
|---------|---------|
| Runtime .exe | NeutralinoJS (~2MB, ventana nativa + bandeja + notificaciones) |
| Runtime .apk | Capacitor (WebView Chrome + plugins nativos) |
| Librerías | `npm install` |
| DB | Dexie + SQLite FTS5 (sql.js WASM / Capacitor SQLite nativo) |
| IA | Lite + QA extractivo con Transformers.js + Web Worker + WebGPU |
| Empaquetado | .exe en `dist/` (~2MB) + .apk en `android/` (~5MB) |
| Deploy | GitHub Pages + Release con ambos assets |
| Plugins nativos | SQLite FTS5, cámara, GPS, notificaciones, compartir |
| Runtime detection | `window.CAPACITOR` + `window.native.*` helpers |
| Precio sugerido | $99 USD |

```
Tiempo: ~30 minutos
Comandos: /new → /setup → /spec → /build → /test → /deploy
```

### ⚫ Enterprise — White-label completo

| Aspecto | Detalle |
|---------|---------|
| Todo Profesional | .exe + .apk + Pages + Release |
| Branding | `brand.ps1` reemplaza nombre, AppId, colores, logo en 12 archivos |
| Docs | `GUIA_USUARIO.md`, `GUIA_INSTALACION.md`, `GUIA_DESARROLLO.md` |
| Código fuente | ZIP con fuente completa (excluye node_modules, .git) |
| Script re-brand | `brand.ps1` personalizado para que el cliente re-brandee solo |
| Repositorio | Privado (opcional) |
| Entrega | `dist/enterprise/` con todos los assets |
| Precio sugerido | $199+ USD |

```
Tiempo: ~45 minutos
Comandos: /new → /setup → /spec → /build → /test → brand.ps1 → /deploy
```

---

## 8. Paso a Paso — Inicio (Lite)

```
Paso 1: /new
  └─ Nombre: "AHA Citas"
  └─ Tipo: "Agenda de citas offline para negocios de servicios"
  └─ Perfil: Lite
  └─ IA Jutia: Lite
  └─ Modo: Classic (5 fases)

Paso 2: /setup (automático tras /new)
  └─ OpenCode crea estructura: core/, modules/, assets/, docs/
  └─ Genera scripts/descargar-libs.bat (12 librerías base)
  └─ USUARIO: Ejecuta doble clic en scripts/descargar-libs.bat

Paso 3: Copiar Plantilla_AHA_Citas.md a specs/aha-citas.md
  └─ La plantilla ya tiene módulos, tablas, UI, reglas

Paso 4: /spec (automático tras setup)
  └─ OpenCode pregunta asunciones 4+1
  └─ Genera specs/aha-citas.md con 15 secciones

Paso 5: /build (automático tras spec)
  └─ Genera core/: db.js, crypto.js, ui.js, theme.js, app.js, sync.js, network.js
  └─ Genera modules/ uno por uno:
     1. Agenda (calendario, slots, drag)
     2. Clientes (CRUD + búsqueda IA)
     3. Servicios (CRUD + categorías)
     4. Profesionales (CRUD + horarios)
     5. Ingresos (pagos + corte día + export)
  └─ PAUSA tras cada módulo para confirmar

Paso 6: /test (automático tras build)
  └─ Compliance: sin imports, sin CDNs, crypto presente
  └─ Brand audit: UI consistente
  └─ QA rubric: 8 items PASS/FAIL

Paso 7: /deploy (automático tras test)
  └─ git add + commit + push
  └─ ZIP en dist/AHA-Citas.zip
  └─ GitHub Pages: https://[user].github.io/[repo]

✅ App funcionando con doble clic en index.html
```

---

## 9. Paso a Paso — Profesional (Full .exe + .apk)

```
Paso 1: /new
  └─ Perfil: Full
  └─ Destino: Ambos (.exe + .apk)
  └─ IA Jutia: Full (recomendado) o Lite
  └─ Si IA Full: modelos q4 ~58MB (descarga única)

Paso 2: /setup
  └─ npm install (package.json con alpinejs, dexie, cryptojs, etc.)
  └─ npm install @capacitor/core @capacitor/cli @capacitor/android
  └─ npm install @capacitor-community/sqlite @capacitor/camera @capacitor/geolocation
  └─ npm install @capacitor/local-notifications @capacitor/share
  └─ npx cap init "AHA Citas" "com.ahagencies.ahacitas" --web-dir "public"
  └─ npx cap add android
  └─ npm install @xenova/transformers pdfjs-dist mammoth marked (si IA Full)
  └─ Descarga neutralino.js + sql-wasm.wasm + modelos q4

Paso 3: Copiar Plantilla_AHA_Citas.md a specs/aha-citas.md

Paso 4: /spec
  └─ Igual que Lite + DESIGN.md con marca (si modo Design)

Paso 5: /build
  └─ design-engine aplica tokens de marca
  └─ code-generator genera core/ + modules/ (igual que Lite)
  └─ + neutralino.config.json + capacitor.config.json
  └─ + capacitor-detect.js inyectado en core/app.js
  └─ + Si IA Full: ia-worker.js + ia-sqlite.js

Paso 6: /test
  └─ Igual que Lite +
  └─ neu build --release → .exe compila
  └─ cd android && gradlew assembleRelease → .apk compila

Paso 7: /deploy
  └─ Commit + push + Pages
  └─ .exe: dist/AHA-Citas-win_x64.zip (~2MB)
  └─ .apk: android/app/build/outputs/apk/release/app-release.apk (~5MB)
  └─ GitHub Release con ambos assets

✅ .exe: ventana nativa con bandeja + notificaciones
✅ .apk: app Android con SQLite FTS5, cámara, GPS, notificaciones
```

---

## 10. Paso a Paso — Enterprise (white-label)

```
Paso 1-5: Igual que Profesional (Full)

Paso 6: White-label branding
  .\deployment-jigue\templates\brand.ps1 `
    -AppName "ClinicaDentalPro" `
    -AppId "com.clinicadental.app" `
    -PrimaryColor "#1a6b8a" `
    -SecondaryColor "#0d3b4f" `
    -LogoPath "C:\clientes\logo-clinica.svg"

  └─ Reemplaza en project.config.js, index.html, neutralino.config.json,
     capacitor.config.json, package.json, manifest.json, core/theme.js, core/app.js
  └─ Copia logo a assets/ + favicon.ico
  └─ Genera docs/GUIA_USUARIO.md con nombre del cliente

Paso 7: Recompilar con marca
  neu build --release
  cd android && .\gradlew assembleRelease && cd ..

Paso 8: Generar docs Enterprise
  └─ docs/GUIA_INSTALACION.md — cómo instalar .exe / .apk
  └─ docs/GUIA_DESARROLLO.md — para el equipo técnico del cliente

Paso 9: Empaquetar entrega
  New-Item -ItemType Directory -Path "dist/enterprise" -Force
  Copy-Item "dist/ClinicaDentalPro-win_x64.zip" "dist/enterprise/"
  Copy-Item "android/app/build/outputs/apk/release/app-release.apk" "dist/enterprise/ClinicaDentalPro.apk"
  Copy-Item "deployment-jigue/templates/brand.ps1" "dist/enterprise/brand.ps1"
  Copy-Item "docs/" "dist/enterprise/docs/" -Recurse
  Compress-Archive -Path (Get-ChildItem -Path "." -Exclude node_modules,.git,dist,android/.gradle,android/build) `
    -DestinationPath "dist/enterprise/ClinicaDentalPro-source-v1.0.zip" -Force

Paso 10: /deploy
  └─ Commit + push + Pages + Release con todos los assets

✅ Entregables en dist/enterprise/:
  📦 ClinicaDentalPro-win_x64.zip  (.exe con marca)
  📦 ClinicaDentalPro.apk          (.apk con marca)
  📦 brand.ps1                     (script para re-brandeo)
  📦 docs/                         (documentación personalizada)
  📦 ClinicaDentalPro-source-v1.0.zip (código fuente completo)
```

---

## 11. Resumen: Comandos por Perfil

| Comando | Lite | Full | Enterprise |
|---------|------|------|-----------|
| `/new` | ✅ | ✅ | ✅ |
| `/setup` | ✅ + doble clic .bat | ✅ + npm install | ✅ + npm install |
| Copiar plantilla | ✅ | ✅ | ✅ |
| `/build` | ✅ 5 módulos | ✅ 5 módulos + IA | ✅ 5 módulos + IA |
| `/test` | ✅ compliance | ✅ + compilar .exe/.apk | ✅ + compilar .exe/.apk |
| `brand.ps1` | — | — | ✅ |
| `/deploy` | ✅ ZIP+Pages | ✅ .exe+.apk+Release | ✅ + Enterprise pack |

```
Tiempo total para probar los 3 perfiles: ~1.5 horas
  Inicio (Lite):      ~15 min
  Profesional (Full): ~30 min
  Enterprise:         ~45 min
```

---

## 12. Precios sugeridos (de la plantilla comercial)

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| **Lite** | $49 | .exe, 1 profesional, agenda básica |
| **Profesional** | $99 | .exe + .apk, múltiples profesionales, IA predicción |
| **Enterprise** | $199+ | Todo + UI con logo + cliente frecuente automático + código fuente |

### WhatsApp para venta

```
Hola Angel, quiero una agenda offline para mi barbería.
Me interesa AHA Citas con .exe y .apk para varios
profesionales. Plan Profesional.
```

---

## 13. Checklist pre-lanzamiento

- [ ] Probar flujo completo: crear cliente → agendar cita → cerrar → registrar pago
- [ ] Probar drag & drop para reagendar
- [ ] Probar vista por profesional
- [ ] Probar bloqueo de horarios (no agendar donde ya hay cita)
- [ ] Probar cancelación con motivo
- [ ] Probar corte del día vs citas pagadas
- [ ] Probar búsqueda IA de clientes
- [ ] Probar export PDF y CSV
- [ ] Probar en .exe (ventana nativa + notificaciones)
- [ ] Probar en .apk (cámara + GPS + notificaciones)

---

*Documento generado para estudio del stack Ateje v3.0*
*Basado en `apps/AHA-Citas/template.md` y `Plantilla_AHA_Citas.md`*
