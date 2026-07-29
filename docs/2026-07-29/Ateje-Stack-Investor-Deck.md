# Ateje Stack — Documento para Inversores

> **Offline-First App Factory**: Un meta-repo de skills que genera aplicaciones de escritorio (.exe) y móviles (.apk) que funcionan 100% sin internet, sin servidores, sin mensualidades.
>
> Creado por Angel Hernandez Aguilera — [ahaguilera.dev](https://ahaguilera.dev)

---

## Indice

1. [Executive Summary](#1-executive-summary)
2. [El Problema](#2-el-problema)
3. [La Solucion: Ateje Stack](#3-la-solucion-ateje-stack)
4. [Arquitectura Tecnica](#4-arquitectura-tecnica)
5. [Catalogo de Apps AHA (15 apps)](#5-catalogo-de-apps-aha)
6. [8 Verticales de Negocio](#6-8-verticales-de-negocio)
7. [Modelo de Precios](#7-modelo-de-precios)
8. [Sistema de Licencias .aha](#8-sistema-de-licencias-aha)
9. [IA Jutia: Mini IA Offline](#9-ia-jutia-mini-ia-offline)
10. [Analisis de Mercado](#10-analisis-de-mercado)
11. [Ventaja Competitiva](#11-ventaja-competitiva)
12. [Modelo de Negocio para Inversores](#12-modelo-de-negocio-para-inversores)
13. [Roadmap](#13-roadmap)
14. [Proyecciones Financieras](#14-proyecciones-financieras)
15. [FAQ para Inversores](#15-faq-para-inversores)

---

## 1. Executive Summary

**Ateje Stack** es una plataforma de generacion de software B2B que produce aplicaciones de escritorio y moviles **100% offline-first**. Cada app se paga una sola vez (sin SaaS, sin suscripciones) y funciona sin internet, sin servidores, sin CDNs.

El stack actual incluye:
- **Un motor de generacion** que produce apps completas desde una spec
- **15 plantillas de apps** listas para vender (14 de negocio + 1 base de desarrollo)
- **8 verticales de negocio** con kits armados y precios definidos
- **Sistema de licencias** RSA+AES con archivos `.aha` firmados
- **Mini IA offline** incluida en cada app (busqueda, predicciones, QA)
- **3 perfiles tecnicos**: Lite (ZIP+Pages), Professional (.exe+.apk), Business (white-label)

**Mercado objetivo**: Micro-PYMEs latinoamericanas (tiendas, restaurantes, consultorios, constructores, transportistas, agricultores, freelancers) que necesitan software pero no tienen internet confiable ni presupuesto para SaaS caro.

**Propuesta de valor unica**: Software profesional que se paga una vez y funciona para siempre, sin depender de internet, sin servidores, sin mensualidades.

---

## 2. El Problema

### El dolor del mercado latinoamericano

| Problema | Consecuencia |
|----------|-------------|
| Internet no confiable | "Cuando no hay internet no puedo cobrar y pierdo la venta" |
| SaaS caro ($30-500/mes) | "Pago $500 mensuales por un sistema que apenas uso" |
| Software en ingles | "No entiendo la interfaz, esta en ingles" |
| Vendor lock-in | "Si dejo de pagar, pierdo todos mis datos" |
| Costo por usuario | "Tengo 10 empleados, me sale mas caro que la renta" |

### Tamanos de mercado por vertical (Latam)

| Vertical | Cantidad estimada de negocios en Latam |
|----------|--------------------------------------|
| Tiendas minoristas | ~8-12 millones |
| Restaurantes/fondas | ~3-5 millones |
| Consultorios medicos | ~1.5-2 millones |
| Barberias/salones | ~2-3 millones |
| Constructores/contratistas | ~500K-1M |
| Transportistas/flotillas | ~500K-1M |
| Agricultores/ganaderos | ~3-5 millones |
| Freelancers/profesionistas | ~10-15 millones |

**TAM total estimado**: ~30-45 millones de negocios en Latam que podrian beneficiarse de software offline-first.

---

## 3. La Solucion: Ateje Stack

Ateje Stack no es una app. Es un **meta-repo de skills** (SKILL.md autonomos) que orquesta la generacion de apps completas mediante un pipeline automatizado.

### Filosofia

| Principio | Implicacion |
|-----------|-------------|
| Offline-first | 100% local, sin servidores, sin internet requerido |
| Pago unico | El cliente paga una vez, la app es suya para siempre |
| Sin vendor lock-in | Datos cifrados, exportables, portables |
| IA incluida | Cada app trae Mini IA (busqueda + predicciones + QA) |
| Codigo compartido | 95% del frontend es identico entre perfiles y apps |
| Sin builds | Lite se abre con doble clic en index.html |

### Los 3 Perfiles Tecnicos

| Aspecto | Lite (Essential) | Professional | Business (Enterprise) |
|---------|:----------------:|:------------:|:--------------------:|
| Runtime | Doble clic `index.html` | Neutralino .exe + Fixed WV2 | Neutralino .exe + Fixed WV2 |
| DB | Dexie (IndexedDB) | Dexie + SQLite (FTS5) | Dexie + SQLite (FTS5) |
| Cifrado | CryptoJS | CryptoJS | CryptoJS |
| Formato entrega | ZIP + GitHub Pages | .exe + .apk (~30MB ZIP) | .exe + .apk + white-label (~35MB ZIP) |
| HTML visible | Si (demo online) | No | No |
| IA Jutia | Lite (FlexSearch) | Full (QA + OCR) | Full (QA + OCR) |
| Codigo fuente | No | No | Si |
| Marca personalizada | No | No | Si |
| Soporte | Estandar | Estandar | Prioritario 48h |

**El frontend es ~95% identico entre perfiles.** Solo cambia el empaquetado y la infraestructura.

---

## 4. Arquitectura Tecnica

### Componentes del Stack

Ateje Stack esta compuesto por **5 Engines** (orquestacion) + **9 Skills Standalone** (ejecucion) + **16 Skills OmD** (diseno) + **1 Writer Skill**.

```
                     ┌─────────────────────────────┐
                     │      pipeline-engine         │
                     │   Orquestador Maestro Dual   │
                     │   Classic (5 fases) / Design (10 fases)  │
                     └──────────┬──────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   spec-engine   │  │  design-engine  │  │  validation-    │
│ Spec funcional  │  │ Brand context   │  │  engine         │
│ + DESIGN.md     │  │ + tokens UI     │  │ 4 fases + QA    │
│ + 286 ref OmD  │  │ + OpenPencil    │  │ + brand audit   │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              ▼
                     ┌─────────────────┐
                     │  code-generator │
                     │ 20 templates    │
                     │ core + modulos  │
                     │ por fases       │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ deployment-     │
                     │ jigue           │
                     │ Commit + Push + │
                     │ ZIP/.exe/.apk   │
                     └─────────────────┘
```

### Los 5 Engines

| Engine | Proposito | Fases |
|--------|-----------|-------|
| **pipeline-engine** | Orquestador maestro dual | Classic: 5 fases / Design: 10 fases |
| **spec-engine** | Spec funcional + DESIGN.md brand layer | Discovery + config + spec + brand |
| **design-engine** | Brand context injection + tokens DaisyUI | Load brand + apply tokens + capture preferences |
| **validation-engine** | Compliance + brand audit + DevTools/Playwright + QA rubric | 4 fases de validacion |
| **wiki-engine** | Wiki persistente + preferencias de diseno + memoria Engram | Ingest/query/lint |

### Las 9 Skills Standalone

| Skill | Proposito | Perfiles |
|-------|-----------|----------|
| **setup-init** | Valida entorno, crea estructura, instala librerias | L, P, B |
| **code-generator** | Genera codigo por fases desde specs. 20 templates core | L, P, B |
| **stack-compliance-guard** | Guarda automatica: bloquea imports, CDNs, fetch, crypto faltante | L, P, B |
| **deployment-jigue** | Commit + push + empaquetado segun perfil | L, P, B |
| **ia-jutia** | Mini IA offline-first: busqueda, predicciones, QA, OCR | L, Full |
| **alpine-ui-patterns** | Catalogo ~100 componentes Alpine.js de Pines/Penguin/Pinemix | L, P, B |
| **capacitor** | Empaquetado .apk Android nativo con Capacitor | P, B |
| **white-label** | Self-service branding desde la app: colores, logo, fuentes | B |
| **upgrade-engine** | Migra apps entre perfiles Lite/Professional/Business e IA Lite/Full | L, P, B |

### Stack Tecnologico Base

```
Frontend:   Alpine.js 3.x + DaisyUI 5 + @tailwindcss/browser 4 + Bootstrap Icons + Animate.css
Base de datos: Dexie.js (IndexedDB) + SQLite FTS5 (Professional/Business)
Cifrado:   CryptoJS AES-256
IA:        FlexSearch (Lite) + Transformers.js + Tesseract.js OCR (Full)
Escritorio: NeutralinoJS (un solo .exe ~2MB, sin Java/Node)
Movil:     Capacitor (.apk nativo Android con SQLite, camara, GPS)
Otros:     Chart.js, jsPDF, SheetJS (xlsx), pako, QRCode
```

### 20 Templates Core de code-generator

```
app.js, db.js, crypto.js, ui.js, theme.js, main.js, sw.js,
manifest.json, a11y.js, focus-trap.js, responsive.js,
bottom-nav.js, push-manager.js, analytics.js, sync.js,
backup-manager.js, env.js, network.js, export.js, license.js
```

### MCP Servers Integrados

| Servidor | Proposito |
|----------|-----------|
| **github** | Operaciones GitHub API |
| **stocky** | Imagenes royalty-free (Pexels + Unsplash) |
| **refero-styles** | 286+ sistemas de diseno en refero.design |
| **web-search** | Busqueda web |
| **chrome-devtools** | Testing/Lighthouse headless |
| **supabase** | Supabase API (DB, Auth, Edge Functions) |
| **context7** | Documentacion actualizada de librerias |
| **daisyui-gitmcp** | Documentacion de DaisyUI |
| **engram** | Memoria persistente SQLite/FTS5 (local) |

---

## 5. Catalogo de Apps AHA

El repositorio incluye **15 plantillas de apps** listas para generar con el pipeline. Cada plantilla incluye: descripcion comercial, modulos, tablas Dexie, pricing sugerido y mensaje pre-llenado para venta por WhatsApp.

### Apps Transversales (aparecen en TODAS las verticales)

| App | Proposito | Precio Base | Precio Profesional |
|-----|-----------|:-----------:|:------------------:|
| **AHA Gastos** | Control de ingresos/egresos, categorias, reportes PDF, graficos | $49 | $99 |
| **AHA Contactos** | CRM manual: contactos, historial, plantillas WhatsApp, recordatorios | $79 | $149 |

### Apps por Vertical

| App | Proposito | Precio Base | Precio Profesional |
|-----|-----------|:-----------:|:------------------:|
| **AHA POS** | Punto de venta offline: carrito, codigos de barras, corte de caja, devoluciones | $49 | $99 |
| **AHA Inventario** | Control de stock: productos, movimientos, alertas bajo inventario, QR | $49 | $99 |
| **AHA PreFactura** | Prefacturacion offline: XML+PDF, folio automatico, clientes fiscales | $29 | $49 |
| **AHA Comanda** | Toma de pedidos: mesas, comandas, cocina, split de cuenta, corte | $49 | $99 |
| **AHA CRM** | Pipeline Kanban, cotizaciones, facturacion, reportes de conversion | $59 | $129 |
| **AHA Citas** | Agenda: calendario, profesionales, servicios, ingresos por dia | $49 | $99 |
| **AHA Asistencia** | Control horario: marcaje QR, empleados, retardos, export nomina | $39 | $79 |
| **AHA Checklist** | Inspecciones: plantillas, fotos, firma digital, reportes PDF | $39 | $79 |
| **AHA Rx** | Recetas medicas: pacientes, medicamentos, recetas PDF, historial | $59 | $149 |
| **AHA Campo** | Agricultura: lotes, cultivos, ganado, insumos, gastos por hectarea | $59 | $149 |
| **AHA Flota** | Flotilla: vehiculos, combustible, mantenimiento, incidentes | $79 | $199 |
| **AHA Obra** | Construccion: obras, etapas, materiales, fotos de avance, presupuesto | $79 | $199 |
| **AHA Base** | Template de desarrollo con shell completo para construir apps custom | Gratis (dev) | Custom |

### Pricing Sugerido por App (Individual)

| App | Inicio (Lite) | Profesional | Enterprise |
|-----|:-------------:|:-----------:|:----------:|
| AHA POS | $49 | $99 | $299 |
| AHA Inventario | $49 | $99 | $299 |
| AHA Comanda | $49 | $99 | $299 |
| AHA CRM | $59 | $129 | $399 |
| AHA Checklist | $39 | $79 | $199 |
| AHA Asistencia | $39 | $79 | $199 |
| AHA Citas | $49 | $99 | $299 |
| AHA Gastos | $49 | $99 | $299 |
| AHA Contactos | $79 | $149 | $299 |
| AHA Campo | $59 | $149 | $399 |
| AHA Rx | $59 | $149 | $399 |
| AHA Flota | $79 | $199 | $499 |
| AHA Obra | $79 | $199 | $499 |
| AHA PreFactura | $29 | $49 | $199 |

---

## 6. 8 Verticales de Negocio

Cada vertical tiene un **kit completo** con su app estrella, apps complementarias y un precio cerrado. Esto permite vender soluciones integrales en lugar de apps sueltas.

### Vertical 1: Comercio y Retail
**Target:** Ferreterias, abarrotes, tiendas de ropa, minimarkets, puestos de mercado
**Dolor:** "Si se va internet no cobro y no se que tengo en stock"

| App | Rol |
|-----|-----|
| **AHA POS** | Motor de ventas (estrella) |
| AHA Inventario | Control de stock en tiempo real |
| AHA PreFactura | Facturacion electronica local |
| AHA Gastos | Control financiero del negocio |
| AHA Contactos | CRM de clientes frecuentes |

**Kit Ferreteria/Minimarket** = POS + Inventario + PreFactura + Gastos + Contactos
- Lite: $299 | Professional: $599 | Enterprise: $999

### Vertical 2: Gastronomia
**Target:** Restaurantes, bares, cafeterias, taquerias, food trucks
**Dolor:** "Los pedidos en papel se pierden y la cocina tarda"

| App | Rol |
|-----|-----|
| **AHA Comanda** | Motor de pedidos (estrella) |
| AHA POS | Cobro y corte de caja |
| AHA Inventario | Control de insumos y mermas |
| AHA Gastos | Control de gastos operativos |
| AHA Asistencia | Control de meseros y cocineros |

**Kit Restaurante Completo** = Comanda + POS + Inventario + Gastos + Asistencia
- Lite: $349 | Professional: $699 | Enterprise: $1,199

### Vertical 3: Belleza y Servicios Personales
**Target:** Barberias, peluquerias, salones de unas, spas, tatuadores
**Dolor:** "Se me cruzan las citas y pierdo clientes por no dar seguimiento"

| App | Rol |
|-----|-----|
| **AHA Citas** | Agenda visual (estrella) |
| AHA Contactos | Historial y seguimiento WhatsApp |
| AHA CRM | Clientes y promociones |
| AHA Gastos | Control financiero |
| AHA Asistencia | Control de estilistas/barberos |

**Kit Barberia/Salon** = Citas + Contactos + Gastos + Asistencia
- Lite: $249 | Professional: $499 | Enterprise: $899

### Vertical 4: Salud y Consultorios
**Target:** Medicos independientes, dentistas, fisioterapeutas, farmacias, psicologos
**Dolor:** "Mis recetas se pierden y no tengo historial clinico digital"

| App | Rol |
|-----|-----|
| **AHA Rx** | Recetas e historial clinico (estrella) |
| AHA Citas | Agenda de pacientes |
| AHA Contactos | Seguimiento de pacientes |
| AHA PreFactura | Facturacion de consultas |
| AHA Gastos | Control del consultorio |

**Kit Consultorio Medico** = Rx + Citas + PreFactura + Contactos + Gastos
- Lite: $299 | Professional: $699 | Enterprise: $1,299

### Vertical 5: Construccion y Obra (Ticket Premium)
**Target:** Constructores, arquitectos, contratistas, ingenieros civiles
**Dolor:** "Los gastos se disparan y no tengo control del avance en obra"

| App | Rol |
|-----|-----|
| **AHA Obra** | Control de partidas y avances (estrella) |
| AHA Checklist | Inspecciones y seguridad |
| AHA Campo | Reportes desde obra sin internet |
| AHA Flota | Maquinaria y transporte |
| AHA Asistencia | Control de trabajadores |
| AHA PreFactura | Certificaciones y facturacion |
| AHA Gastos | Control presupuestario |

**Kit Constructora Pro** = Obra + Checklist + Campo + PreFactura + Gastos
- Lite: $449 | Professional: $999 | Enterprise: $1,999

### Vertical 6: Campo y Agro
**Target:** Agricultores, ganaderos, ranchos, cooperativas agricolas
**Dolor:** "No se cuanto gasto en el campo ni que lote me da mas"

| App | Rol |
|-----|-----|
| **AHA Campo** | Lotes, cultivos y rendimiento (estrella) |
| AHA Inventario | Control de insumos y cosecha |
| AHA Flota | Tractores y vehiculos agricolas |
| AHA Asistencia | Jornaleros y trabajadores |
| AHA Gastos | Control por lote/hectarea |

**Kit Rancho/Finca** = Campo + Inventario + Flota + Gastos
- Lite: $349 | Professional: $799 | Enterprise: $1,499

### Vertical 7: Logistica y Transporte
**Target:** Empresas de transporte, repartidores, flotillas, mensajerias
**Dolor:** "No se cuanto gasto en gasolina ni cuando toca mantenimiento"

| App | Rol |
|-----|-----|
| **AHA Flota** | Control vehicular (estrella) |
| AHA Asistencia | Control de choferes |
| AHA Checklist | Inspecciones vehiculares |
| AHA Gastos | Control por vehiculo |
| AHA PreFactura | Facturacion de servicios |

**Kit Flotilla** = Flota + Asistencia + Checklist + Gastos
- Lite: $349 | Professional: $799 | Enterprise: $1,499

### Vertical 8: Oficina y Freelancers
**Target:** Contadores, abogados, consultores, freelancers, agencias pequenas
**Dolor:** "Tengo mil clientes y no se a quien dar seguimiento ni cuanto gano"

| App | Rol |
|-----|-----|
| **AHA CRM** | Pipeline de oportunidades (estrella) |
| AHA Contactos | Gestion WhatsApp |
| AHA PreFactura | Facturacion profesional |
| AHA Citas | Agenda de reuniones |
| AHA Gastos | Control financiero |

**Kit Freelancer Pro** = CRM + Contactos + PreFactura + Gastos
- Lite: $249 | Professional: $399 | Enterprise: $799

---

## 7. Modelo de Precios

### Escalera de Valor

| Nivel | Que compra el cliente | Rango precio |
|-------|----------------------|:-----------:|
| **Entrada** | 1 app individual (Lite) | $29 - $79 |
| **Crecimiento** | Kit Vertical completo (Lite) | $199 - $449 |
| **Profesional** | Kit Vertical completo (Professional: .exe + .apk) | $399 - $999 |
| **Enterprise** | Kit completo + white-label + codigo fuente + soporte prioritario | $799 - $1,999 |

### Estrategia de Upselling

```
App Individual ($29-79)
    └─ Kit Vertical Lite ($199-449)
         └─ Kit Vertical Professional ($399-999)
              └─ Kit Enterprise white-label ($799-1,999)
```

### Precios de Kits por Vertical

| Vertical | Lite | Professional | Enterprise |
|----------|:----:|:------------:|:----------:|
| Comercio & Retail | $299 | $599 | $999 |
| Gastronomia | $349 | $699 | $1,199 |
| Belleza & Servicios | $249 | $499 | $899 |
| Salud & Consultorios | $299 | $699 | $1,299 |
| Construccion | $449 | $999 | $1,999 |
| Campo & Agro | $349 | $799 | $1,499 |
| Logistica & Transporte | $349 | $799 | $1,499 |
| Oficina & Freelancers | $249 | $399 | $799 |

---

## 8. Sistema de Licencias .aha

Cada app generada incluye un sistema de licencias **criptograficamente firmado** que permite:

### Como funciona

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  generate-      │     │    Licencia       │     │    App runtime   │
│  keypair.js     │────>│    .aha file      │────>│                  │
│                 │     │                   │     │ Verifica firma   │
│ RSA 2048-bit    │     │ AES-256-CBC       │     │ RSA public key   │
│ private.pem     │     │ iv.cipher.sig     │     │ embebida         │
│ public.pem      │     │                   │     │                  │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

### Generacion de Licencia

```bash
node scripts/license.js generate \
  --plan P \
  --apps "aha-pos,aha-inventario" \
  --customer "Juan Perez" \
  --business "Ferreteria El Clavo"
```

Esto genera:
- Archivo `.aha` firmado con RSA-2048 + cifrado AES-256-CBC
- Entrada en `licencias/historial.csv`
- ID unico de licencia: `AHA-P2-20260708-1430`

### Datos incluidos en la licencia

| Campo | Descripcion |
|-------|-------------|
| `id` | ID unico (AHA-Lx, AHA-Px, AHA-Ex) |
| `customer.name` | Nombre del cliente |
| `customer.business` | Nombre del negocio |
| `customer.phone` | Telefono |
| `customer.email` | Email |
| `apps.*` | Apps licenciadas con plan y version minima |
| `compat` | Mapeo de compatibilidad entre apps |
| `issued` | Fecha ISO de emision |

### Planes de Licencia

| Codigo | Plan | Apps incluidas |
|--------|------|----------------|
| L | Lite (Inicio) | 1 o mas apps en perfil Lite |
| P | Profesional | 1 o mas apps en perfil Professional |
| E | Enterprise | 1 o mas apps en perfil Business |

### Flujo de Validacion en Runtime

1. La app lee el archivo `.aha` del sistema de archivos
2. Descifra con AES-256-CBC (clave derivada: `sha256("aha-license-system-v1")`)
3. Verifica firma RSA-2048 contra `public.pem` embebido
4. Valida plan, apps incluidas y fecha de vigencia
5. Si todo OK: desbloquea funcionalidad completa
6. Si falla: modo restringido / bloqueo de features premium

---

## 9. IA Jutia: Mini IA Offline

Cada app AHA incluye **IA Jutia**, una inteligencia artificial que corre 100% local, sin enviar datos a ningun servidor. Viene incluida en el precio, no es un extra.

### Perfiles

| Perfil | Peso | Funcionalidad |
|--------|:----:|---------------|
| **Lite** | ~40KB | FlexSearch (busqueda full-text), chat conversacional, estadisticas, predicciones, autocompletado, export PDF |
| **Full** | +233MB | Todo Lite + ingesta de documentos (PDF, DOCX, XLSX, CSV, MD), QA extractivo, OCR en PDFs escaneados, chat con historial persistente, busqueda hibrida (FlexSearch + embeddings) |

### Arquitectura

```
module.js (entry point)
  └── loadFlexSearch()         → assets/flexsearch.min.js
  └── loadScript(ia-core.js)   → window.ia (FlexSearch + stats + predicciones)
  └── loadScript(ia-chat.js)   → window.ia.chat (motor de chat NL)
  └── loadScript(tools/*.js)   → window.IA_TOOLS (herramientas extensibles)
  └── window.ia.init()         → FlexSearch Document + register default tables
  └── ensureDBTables()         → _ia_chats + _ia_messages en db principal
  └── registerAlpineStore()    → Alpine.store('ia')
  └── injectFabDrawer()        → FAB + Drawer con tabs: Chat/Hilos/Ajustes
  └── dispatchEvent(ready)     → window.dispatch('jutia:ready')
```

### Caracteristicas Clave

| Feature | Lite | Full |
|---------|:----:|:----:|
| Busqueda full-text | Si | Si |
| Autocompletado | Si | Si |
| Resaltado de resultados | Si | Si |
| Export PDF de resultados | Si | Si |
| Estadisticas y predicciones | Si | Si |
| Chat conversacional | Si | Si |
| Historial persistente | Si | Si |
| Ingesta PDF/DOCX/XLSX/CSV/MD | No | Si |
| OCR en PDFs escaneados | No | Si |
| QA extractivo | No | Si |
| Busqueda hibrida | No | Si |
| Atajo global Cmd+K | Si | Si |

---

## 10. Analisis de Mercado

### Top 6 Apps con Mayor Potencial

Priorizadas por tamano de mercado + poca competencia offline + predisposicion a pagar:

| # | App | Mercado | Competencia Offline | Ventaja Clave | Precio |
|---|-----|---------|:-------------------:|---------------|:------:|
| 1 | **AHA POS** | Enorme | Media | Pago unico vs $195+/mes suscripcion cloud | $99 |
| 2 | **AHA Comanda** | Enorme | Baja-Media | Pago unico vs $500+/mes Loggro/Plick | $99 |
| 3 | **AHA Obra** | Grande | Casi nula | Primer offline-first en espanol. Buildertrend/Procore $499+/mes | $99 |
| 4 | **AHA Flota** | Grande | Casi nula | Unica offline en espanol. GPS tracking $200-500/mes | $99 |
| 5 | **AHA Asistencia** | Grande | Media | QR + celular, sin $3,000-8,000 MXN en reloj biometrico | $49 |
| 6 | **AHA Campo** | Grande | Casi nula | Unica offline para el campo. Agroptima ~$30/mes | $99 |

### Analisis Competitivo Detallado

#### AHA POS — Punto de Venta
| Competidor | Precio | Limitaciones |
|------------|:------:|--------------|
| **Eleventa** | ~$75 USD (pago unico) | Solo Windows, sin IA |
| **Tasven** | ~$260 USD (pago unico) | Solo Windows |
| **Pulpos** | ~$499/mes | Cloud, requiere internet |
| **Comercio Facil** | ~$195/mes | Cloud |
| **AHA POS** | $49-299 (pago unico) | Windows + Android, IA incluida, offline |

#### AHA Comanda — Restaurantes
| Competidor | Precio | Limitaciones |
|------------|:------:|--------------|
| **Pagotaco** | ~$45 USD (pago unico) | Solo Windows, sin app movil |
| **Loggro Restobar** | ~$979/mes | Cloud |
| **Plick** | ~$379/mes | Cloud |
| **AHA Comanda** | $49-299 (pago unico) | Windows + Android, offline, split cuenta |

#### AHA Obra — Construccion
| Competidor | Precio | Limitaciones |
|------------|:------:|--------------|
| **Buildertrend** | $499/mes | Cloud, ingles |
| **Procore** | $599+/mes | Cloud, ingles |
| **AHA Obra** | $79-499 (pago unico) | Offline, espanol, fotos avance, presupuesto |

#### AHA Flota — Vehiculos
| Competidor | Precio | Limitaciones |
|------------|:------:|--------------|
| **GPS Tracking** | $200-500/mes + hardware | Requiere hardware GPS |
| **AHA Flota** | $79-499 (pago unico) | Software puro, sin hardware, offline |

#### AHA Asistencia — Control Horario
| Competidor | Precio | Limitaciones |
|------------|:------:|--------------|
| **Reloj biometrico** | $3,000-8,000 MXN inversion | Hardware costoso |
| **Soluciones locales** | $50-200/mes | Sin app movil normalmente |
| **AHA Asistencia** | $39-199 (pago unico) | QR + celular, offline |

#### AHA Campo — Control Agricola
| Competidor | Precio | Limitaciones |
|------------|:------:|--------------|
| **Agroptima** | ~$30/mes | Cloud |
| **AHA Campo** | $59-399 (pago unico) | Offline, fotos, lotes, ganado |

### Factores Diferenciales Clave

| Factor | Ateje Stack | Competencia |
|--------|:-----------:|:-----------:|
| Pago unico | Si | Rara vez |
| Offline-first | Si | Casi nunca |
| IA incluida | Si | Casi nunca |
| Windows + Android mismo codigo | Si | Casi nunca |
| Sin servidores | Si | No |
| Codigo en espanol | Si | Rara vez |
| Sin vendor lock-in | Si | No |
| IA 100% local (datos privados) | Si | No (envian a cloud) |
| Backup cifrado portable | Si | Rara vez |

---

## 11. Ventaja Competitiva

### Para el desarrollador (quien construye apps con el stack)

| Ventaja | Beneficio |
|---------|-----------|
| Un solo codigo fuente | 3 builds: ZIP / .exe / .apk |
| 20 templates core pre-hechos | No empezar de cero cada vez |
| Pipeline automatizado | Setup → spec → code → validate → deploy |
| 15 plantillas de apps | Listas para vender, solo personalizar |
| ~95% codigo compartido | Entre perfiles y entre apps |
| Sin builds | Lite se abre con doble clic |
| Stack compliance guard | Errores bloqueados automaticamente |
| IA incluida por defecto | Diferenciador competitivo sin costo extra |

### Para el cliente final

| Ventaja | Traduccion de venta |
|---------|---------------------|
| Pago unico | "Pagas una sola vez, la app es tuya para siempre" |
| Offline-first | "Funciona sin internet. Tus datos estan en tu PC" |
| Cifrado AES-256 | "Ni yo puedo ver tus datos. Estandar bancario" |
| Sin mensualidades | "No hay cuotas mensuales. Nunca" |
| Windows + Android | "La misma app en tu PC y tu celular" |
| IA local | "Tu app entiende tus datos. Sin enviarlos a nadie" |
| Backup portable | "Lleva tus datos a cualquier PC. Son tuyos" |

### Lo que la competencia NO puede decir

- "Nuestra IA corre local" → ellos envian tus datos a OpenAI
- "La IA viene incluida" → ellos la venden como add-on
- "Misma IA en escritorio y movil" → ellos tienen versiones distintas
- "Sin internet" → ellos necesitan cloud
- "Pago unico" → ellos cobran mensualidad
- "Sin servidores" → ellos tienen infraestructura cloud

---

## 12. Modelo de Negocio para Inversores

### Flujo de Ingresos

```
Venta Directa (WhatsApp/Web)
  └─ App Individual ($29-199)
  └─ Kit Vertical ($199-1,999)
  └─ Desarrollo a medida ($500-5,000+)

Canales de Distribucion
  └─ Landing Page (identidad AHA)
  └─ WhatsApp directo
  └─ Referidos
  └─ Marketplace de apps (futuro)
  └─ Revendedores / integradores (futuro)

Ingresos Recurrentes (futuro)
  └─ Soporte premium anual ($X/ano)
  └─ Actualizaciones mayores (pago unico menor)
  └─ White-label como servicio
```

### Margenes

| Concepto | Margen Estimado |
|----------|:--------------:|
| App Individual (Lite) | ~95% (sin costos de infraestructura) |
| Kit Vertical (Lite) | ~95% |
| Kit Professional (.exe+.apk) | ~90% (costo: licencias dev ocasional) |
| Kit Enterprise (white-label) | ~85% (costo: personalizacion) |
| Desarrollo a medida | ~80-90% |

**Sin costos de servidores.** Sin costos de hosting. Sin costos de API externa. El unico costo es tiempo de desarrollo (y este se reduce drasticamente con el pipeline).

### Estrategia de Growth

1. **Fase 1 (Actual):** Venta directa por WhatsApp + landing page. Nicho por nicho.
2. **Fase 2:** Red de revendedores (contadores, consultores, Tiendas de tecnologia locales).
3. **Fase 3:** Programa de integradores (agencias que usen el stack para construir custom).
4. **Fase 4:** Marketplace de apps AHA (comision por venta de terceros).
5. **Fase 5:** Expandir a otros paises (modelo replica con agentes locales).

### Proyeccion de Ingresos (Estimacion Conservadora)

| Ano | Ventas estimadas | Ingreso estimado |
|:---:|:----------------:|:----------------:|
| 1 | 50 apps individuales + 10 kits | $5,000 - $15,000 |
| 2 | 150 apps + 30 kits + 5 custom | $20,000 - $50,000 |
| 3 | 500 apps + 100 kits + 20 custom | $75,000 - $200,000 |
| 4 | 1,000 apps + 250 kits + 50 custom | $200,000 - $500,000 |
| 5 | 2,000 apps + 500 kits + 100 custom | $500,000 - $1,200,000 |

*Estimaciones conservadoras basadas en: precio promedio ponderado $50-150/app, conversion de lead a cliente 5-10%, mercado Latam de 30M+ negocios.*

---

## 13. Roadmap

### Estado Actual (Julio 2026)

- Stack completo: 5 engines + 9 standalone + 16 OmD + 1 writer
- 15 plantillas de apps listas (14 negocio + 1 dev)
- 8 verticales definidas con precios
- Sistema de licencias RSA+AES funcional
- Pipeline dual: Classic (5 fases) y Design (10 fases)
- IA Jutia Lite y Full funcional
- White-label (Business) funcional
- Upgrade-engine entre perfiles
- Deploy a GitHub Pages + ZIP + .exe + .apk
- Tests automatizados (Playwright E2E + pytest)

### Proximos Pasos

| Prioridad | Feature | Impacto |
|:---------:|---------|:-------:|
| 1 | **Marketplace de apps** | Plataforma donde terceros vendan apps AHA |
| 2 | **Soporte recurrente** | Planes de mantenimiento anual ($X/ano) |
| 3 | **Red de revendedores** | Comision 20-30% para integradores |
| 4 | **Multi-idioma** | Interfaces en portugues (Brasil), ingles (US) |
| 5 | **Sincronizacion P2P** | Sincronizar entre dispositivos via LAN |
| 6 | **Plugin store** | Plugins de pago para funcionalidades extra |
| 7 | **Dashboard de ventas** | Estadisticas de ventas, clientes, ingresos |
| 8 | **App mobile builder** | Cliente final personaliza su kit desde web |

---

## 14. Proyecciones Financieras

### Escenario Base (Anual)

| Concepto | Ano 1 | Ano 2 | Ano 3 | Ano 5 |
|----------|:-----:|:-----:|:-----:|:-----:|
| Apps vendidas | 50 | 150 | 500 | 2,000 |
| Kits vendidos | 10 | 30 | 100 | 500 |
| Custom dev | 2 | 5 | 20 | 100 |
| **Ingreso bruto** | ~$10K | ~$35K | ~$150K | ~$800K |
| Costos directos | ~$500 | ~$1,500 | ~$5,000 | ~$20K |
| **Margen bruto** | ~95% | ~95% | ~95% | ~95% |
| Gastos operativos | ~$5K | ~$10K | ~$30K | ~$100K |
| **Utilidad neta** | ~$4.5K | ~$23.5K | ~$115K | ~$680K |

### Necesidad de Inversion

| Uso de fondos | Monto estimado |
|---------------|:--------------:|
| Desarrollo de marketplace | $15,000 - $30,000 |
| Marketing y publicidad digital | $10,000 - $20,000 |
| Contratacion de soporte parcial | $5,000 - $15,000 |
| Infraestructura (dominios, servidores minimos) | $1,000 - $3,000 |
| **Total inversion buscada** | **$30,000 - $70,000** |

---

## 15. FAQ para Inversores

### ¿Que hace unico al Ateje Stack?

Es la unica plataforma que genera apps offline-first completas (setup → codigo → validacion → deploy) con IA local incluida, en espanol, para multiples plataformas (Windows + Android), a precio unico, sin suscripcion.

### ¿Por que offline-first en 2026?

Porque en Latam el internet no es confiable. Millones de negocios operan en areas con conectividad limitada o nula. El SaaS asume internet siempre disponible — eso no es realista para el mercado objetivo.

### ¿Por que pago unico y no suscripcion?

Porque el mercado objetivo (micro-PYMEs latinoamericanas) tiene aversion a las suscripciones. Prefieren pagar una vez y ser duenos del software. Este modelo elimina la friccion de venta y es un diferenciador clave.

### ¿Como se protege la propiedad intelectual?

Cada app incluye verificacion de licencia RSA+AES. El archivo `.aha` firmado criptograficamente desbloquea funcionalidad. Sin el archivo, la app funciona en modo limitado. El codigo fuente solo se entrega en plan Enterprise.

### ¿Cual es el TAM (Total Addressable Market)?

Estimado en **30-45 millones de negocios** en Latam que podrian beneficiarse de software offline-first. Esto incluye tiendas, restaurantes, consultorios, barberias, constructores, transportistas, agricultores y freelancers.

### ¿Que evita que alguien clone el stack?

1. **El pipeline completo** no es solo codigo — es la orquestacion de 30+ skills que se coordinan.
2. **Las 15 plantillas** de apps con schemas de datos, modulos, flujos y pricing.
3. **La IA Jutia** integrada en cada app.
4. **El sistema de licencias** RSA+AES con archivos `.aha` firmados.
5. **El conocimiento acumulado** de cientos de horas de desarrollo y debugging.

### ¿Como se escala este negocio?

1. **Red de revendedores**: Contadores, consultores, tecnicos locales venden las apps con su marca.
2. **Marketplace**: Terceros desarrollan y venden apps sobre el stack (comision 20-30%).
3. **Programa de integradores**: Agencias construyen apps custom usando el stack.
4. **Expansion geografica**: Brasil (portugues), US Hispanos (ingles), Espana.

### ¿Quien es el fundador?

**Angel Hernandez Aguilera** — Desarrollador freelance con experiencia en arquitectura offline-first, sistemas de licencias, Alpine.js, Dexie.js, NeutralinoJS, Capacitor y automatizacion de pipelines con OpenCode. Creador del ecosistema AHA (Aplicaciones Hispanas离线).

- Web: [ahaguilera.dev](https://ahaguilera.dev)
- GitHub: [github.com/angelhdz84](https://github.com/angelhdz84)
- Email: angel@ahaguilera.dev

---

## Anexos

### Anexo A: Resumen de Skills del Stack

```
Ateje/
├── pipeline-engine/       — Orquestador maestro dual (/new, /pro)
├── spec-engine/           — Spec funcional + DESIGN.md brand layer
├── design-engine/         — Brand context injection + tokens DaisyUI
├── validation-engine/     — Compliance + brand audit + QA rubric
├── wiki-engine/           — Wiki persistente + preferencias
├── setup-init/            — Valida entorno, crea estructura
├── code-generator/        — Genera codigo por fases (20 templates core)
├── stack-compliance-guard/— Guarda automatica offline-first
├── alpine-ui-patterns/    — Catalogo ~100 comps Pines/Penguin/Pinemix
├── deployment-jigue/      — Commit + push + Pages + ZIP/.exe/.apk
├── ia-jutia/              — Mini IA offline-first
├── capacitor/             — Empaquetado .apk Android
├── white-label/           — Self-service branding
├── upgrade-engine/        — Migra entre perfiles
├── apps/                  — 15 plantillas de apps AHA
└── scripts/               — Utilidades (licencias, keypair, docs)
```

### Anexo B: Repositorios

| Recurso | URL |
|---------|-----|
| Ateje Stack (meta-repo) | `https://github.com/angelhdz84/Ateje` |
| Landing AHA | `https://angelhdz84.github.io/Identidad_AHA/` |
| Landing repo | `github.com/angelhdz84/Identidad_AHA` |
| Portfolio | `https://ahaguilera.dev` |

### Anexo C: Referencias de Documentacion Interna

| Documento | Proposito |
|-----------|-----------|
| `docs/guia-estudio-ateje.md` | Guia completa de estudio del Stack |
| `docs/stack-completo.md` | Referencia tecnica del stack completo |
| `docs/guia-stack-skills-layer.md` | Guia de habilidades y capas del stack |
| `docs/guia-integracion-engram-openpencil.md` | Integracion de herramientas de diseno |
| `docs/Estrategia_Ventas.md` | Roadmap comercial y pricing detallado |
| `docs/landing-aha-sell.md` | Estrategia de venta completa |
| `docs/Transversales.md` | Organizacion de apps por verticales |
| `docs/comercial/CONTRATO_FREELANCE.txt` | Plantilla de contrato freelance |
| `docs/comercial/CORREO_ENTREGA_PROFESIONAL.txt` | Plantilla de correo de entrega |
| `apps/README.md` | Catalogo de 15 plantillas de apps |

---

> **Ateje Stack** — Creado por Angel Hernandez Aguilera
>
> "Software que funciona donde el internet no llega.
>  Que se paga una vez y es tuyo para siempre."
