# Tutorial: Crear una AHApp desde cero con el Stack Ateje

> Guia practica para desarrolladores. Aprende a generar aplicaciones offline-first
> profesionales usando OpenCode + Ateje Stack.

---

## Indice

1. [Introduccion](#1-introduccion)
2. [Requisitos previos](#2-requisitos-previos)
3. [Elegir que construir](#3-elegir-que-construir)
4. [Setup del proyecto con pipeline](#4-setup-del-proyecto-con-pipeline)
5. [Fase 1: Setup](#5-fase-1-setup)
6. [Fase 2: Spec](#6-fase-2-spec)
7. [Fase 3: Design (brand layer)](#7-fase-3-design-brand-layer)
8. [Fase 4: Build (generacion de codigo)](#8-fase-4-build-generacion-de-codigo)
9. [Fase 5: Validacion](#9-fase-5-validacion)
10. [Fase 6: Deploy](#10-fase-6-deploy)
11. [Que recibe el cliente final](#11-que-recibe-el-cliente-final)
12. [Apps individuales vs Kits verticales](#12-apps-individuales-vs-kits-verticales)
13. [Post-entrega](#13-post-entrega)
14. [Conclusion](#14-conclusion)

---

## 1. Introduccion

### Que es el Stack Ateje

El Stack Ateje es un meta-repo de skills para OpenCode que permite generar aplicaciones
**offline-first** completas. No es una aplicacion en si misma: es un conjunto de motores
(engines) y habilidades (skills) que, orquestados por un pipeline, producen apps listas
para entregar a clientes.

El stack se compone de:

- **5 engines** orquestadores: pipeline, spec, design, validation, wiki
- **8 skills standalone**: setup, code-generator, compliance-guard, deployment, ia-jutia,
  alpine-ui-patterns, capacitor, white-label
- **1 upgrade engine** para migrar entre perfiles
- **16 skills Oh My Design (OmD)** para capa de marca profesional
- **1 writer skill** (omd:es-writer) para microcopy en espanol latino

### Que es una AHApp

Una AHApp (Ateje Hybrid App) es una aplicacion web moderna que:

- Funciona 100% sin internet (offline-first)
- Se abre con doble clic en `index.html` (no requiere servidor)
- Usa **Alpine.js** para reactividad, **DaisyUI** para interfaz, **Dexie.js** (IndexedDB)
  para almacenamiento local
- Incluye cifrado **CryptoJS**, graficos **Chart.js**, iconos **Bootstrap Icons**
- Soporta busqueda con **FlexSearch** y exportacion a PDF/CSV
- Corre en Windows, macOS, Linux, Android y iOS segun el perfil de empaquetado

### Perfiles: Lite / Professional / Enterprise

| Perfil | Nombre comercial | Runtime | Base de datos | Empaquetado | HTML visible |
|--------|-----------------|---------|---------------|-------------|:------------:|
| Lite | Essential | Doble clic `index.html` | Dexie (IndexedDB) | ZIP + GitHub Pages | Si |
| Professional | Professional | Neutralino .exe + WV2 fijo | Dexie + SQLite (FTS5) | .exe + .apk (~30MB ZIP) | No |
| Business | Enterprise | Neutralino .exe + WV2 fijo | Dexie + SQLite (FTS5) | .exe + .apk + white-label (~35MB ZIP) | No |

El codigo frontend (Alpine + DaisyUI + modulos) es ~95% identico entre perfiles.
La diferencia principal esta en la infraestructura (runtime, empaquetado, extras).

---

## 2. Requisitos previos

Antes de empezar, asegurate de tener todo lo necesario:

### Software requerido

```
Git                  >= 2.30    (https://git-scm.com)
Node.js              >= 18      (https://nodejs.org)
OpenCode CLI         >= 1.0     (https://opencode.ai)
```

### Verificar instalaciones

Abre PowerShell (o tu terminal) y ejecuta:

```powershell
git --version
node --version
npm --version
opencode --version
```

Todas deben responder sin error.

### Instalar OpenCode CLI

Si no tienes OpenCode instalado:

```powershell
# Windows (PowerShell)
winget install OpenCode

# O via npm global
npm install -g @opencode/cli

# macOS / Linux
brew install opencode
```

### Opcionales (recomendados)

```powershell
# Playwright para tests E2E
npx playwright install chromium

# Engram (memoria persistente entre sesiones)
# Descargar binary de https://github.com/Gentleman-Programming/engram/releases
# Luego ejecutar:
.\scripts\setup-engram.ps1

# OpenPencil (editor de diseno Figma-compatible)
npm install -g @open-pencil/cli
.\scripts\setup-opencil.ps1
```

### Clonar el repositorio Ateje

```powershell
git clone https://github.com/tu-usuario/Ateje.git
cd Ateje
```

### Instalacion global (opcional pero recomendada)

Para usar los comandos `/new`, `/build`, `/deploy` desde cualquier directorio:

```powershell
.\install-global.ps1
```

Esto crea directory junctions desde `~/.opencode/skills/` hacia cada skill del repo.
Las skills se actualizan solas al hacer `git pull` (son junctions, no copias).

Para remover la instalacion global:

```powershell
.\uninstall-global.ps1
```

---

## 3. Elegir que construir

### Catalogo de 15 apps

El Stack Ateje incluye plantillas para 15 aplicaciones listas para generar:

| App | Descripcion | Target |
|-----|-------------|--------|
| **AHA Base** | Template base de desarrollo | Desarrolladores, prototipos |
| **AHA Inventario** | Control de stock offline | Tiendas, bodegas, almacenes |
| **AHA Comanda** | Pedidos de restaurante | Restaurantes, bares, cafeterias |
| **AHA CRM** | Gestion de clientes | Contadores, abogados, freelancers |
| **AHA Checklist** | Inspecciones y listas | Constructores, supervisores |
| **AHA Asistencia** | Control de personal | Empresas con empleados |
| **AHA Citas** | Agenda de citas visual | Barberias, salones, consultorios |
| **AHA Gastos** | Control financiero | Cualquier negocio |
| **AHA Contactos** | CRM de contactos simple | Cualquier negocio |
| **AHA Campo** | Reportes desde terreno | Agricultores, ranchos |
| **AHA POS** | Punto de venta | Tiendas, ferreterias, abarrotes |
| **AHA Rx** | Recetas e historial clinico | Medicos, farmacias |
| **AHA Flota** | Gestion de vehiculos | Flotillas, mensajerias |
| **AHA Obra** | Control de partidas y avances | Constructores, contratistas |
| **AHA PreFactura** | Facturacion electronica local | Comercios, consultorios |

### 8 verticales de negocio

Las apps se agrupan en verticales que resuelven problemas completos de un sector:

| Vertical | App estrella | Target | Kit sugerido | Precio kit |
|----------|-------------|--------|-------------|:----------:|
| **Comercio y Retail** | POS | Ferreterias, abarrotes | POS + Inventario + PreFactura + Gastos + Contactos | $299 |
| **Gastronomia** | Comanda | Restaurantes, bares | Comanda + POS + Inventario + Gastos + Asistencia | $349 |
| **Belleza y Servicios** | Citas | Barberias, salones, spas | Citas + Contactos + Gastos + Asistencia | $249 |
| **Salud y Consultorios** | Rx | Medicos, dentistas, farmacias | Rx + Citas + PreFactura + Contactos + Gastos | $299 |
| **Construccion y Obra** | Obra | Constructores, contratistas | Obra + Checklist + Campo + PreFactura + Gastos | $449 |
| **Campo y Agro** | Campo | Agricultores, cooperativas | Campo + Inventario + Flota + Gastos | $349 |
| **Logistica y Transporte** | Flota | Flotillas, mensajerias | Flota + Asistencia + Checklist + Gastos | $349 |
| **Oficina y Freelancers** | CRM | Contadores, freelancers | CRM + Contactos + PreFactura + Gastos | $249 |

**Apps transversales:** AHA Gastos y AHA Contactos aparecen en las 8 verticales.
Son el complemento base de cualquier kit.

### Como decidir

**App individual** - Cuando el cliente necesita una sola herramienta:
- "Solo quiero controlar mi inventario" -> AHA Inventario individual
- "Necesito agendar citas" -> AHA Citas individual
- Precios: Inicio $49 / Profesional $99 / Enterprise $199

**Kit vertical** - Cuando el cliente quiere resolver un problema de negocio completo:
- "Tengo un restaurante y necesito todo" -> Kit Gastronomia ($349)
- "Administro una flotilla de camiones" -> Kit Logistica ($349)
- Incluye 4-5 apps por kit con descuento respecto a compra individual

### Leer el template de la app elegida

Cada app tiene su spec comercial en `apps/AHA-Nombre/template.md`:

```powershell
# Para ver el template de AHA Inventario
type apps\AHA-Inventario\template.md
```

El template incluye:
- Descripcion comercial y target
- Niveles comerciales con precios
- Lista de modulos con funcionalidades
- Schema de tablas Dexie
- Precios sugeridos por nivel
- WhatsApp script de venta

---

## 4. Setup del proyecto con pipeline

### Iniciar el pipeline

Desde el directorio del repo Ateje, ejecuta en OpenCode:

```
/nuevo proyecto
```

O直接在 OpenCode CLI:

```
opencode
```

Y luego escribe: "Quiero crear una app nueva"

### Seleccion de modo

El **pipeline-engine** (orquestador maestro) te preguntara el modo:

```
? Elegi el modo de pipeline:
  [1] Classic (/new)  - Rapido, 5 fases ~10 min
  [2] Design (/pro)   - Completo, 10 fases ~30 min
```

#### Modo Classic (5 fases)

Ideal para prototipos, proyectos simples, o cuando quieres algo funcional rapido.

```
Fase 1: SETUP      -> setup-init: valida entorno, estructura, librerias
Fase 2: SPEC       -> spec-engine: spec funcional + DESIGN.md
Fase 3: BUILD      -> design-engine + code-generator: genera modulos
Fase 4: VALIDATE   -> validation-engine: compliance, brand audit, QA
Fase 5: DEPLOY     -> deployment-jigue: commit, push, empaquetado
```

Tiempo estimado: **10 minutos** (con pausas entre fases).

#### Modo Design (10 fases)

Para proyectos con marca, produccion, o cuando trabajas con un equipo.

```
Fase  1: BRAINSTORMING   -> Exploracion de ideas con sub-agentes
Fase  2: UX RESEARCH     -> Audiencia, competencia, referencias
Fase  3: SPEC + BRAND    -> Spec funcional + DESIGN.md con 286 referencias
Fase  4: DESIGN SYSTEM   -> Tokens: color, tipografia, espaciado, motion
Fase  5: UI CODING       -> Code-generator genera modulos con tokens aplicados
Fase  6: MICROCOPY       -> omd:es-writer redacta copy profesional
Fase  7: ASSETS          -> omd:asset-fetch + stocky (imagenes CC0, iconos)
Fase  8: TESTING         -> Compliance + DevTools + E2E
Fase  9: DESIGN REVIEW   -> Brand audit + QA rubric
Fase 10: DEPLOY          -> Segun perfil Lite/Professional/Business
```

Tiempo estimado: **30 minutos** (con pausas entre fases).

Si no especificas el modo, el pipeline pregunta y auto-detecta segun tu
descripcion. Si el catalogo Oh My Design no esta disponible, fallback
automatico al modo Classic.

> **Importante:** OpenCode pierde contexto despues de ~15k tokens. El pipeline
> hace PAUSA tras cada fase y espera confirmacion explicita (`CONTINUAR`).
> No intentes generar todo de una vez.

### Parametros que te pedira el pipeline

Al iniciar, el orquestador necesita:

```
? Nombre del proyecto:       [Nombre de la app]
? Tipo de aplicacion:        [Inventario, POS, Comanda, etc.]
? Descripcion breve:         [Que hace la app]
? Perfil de empaquetado:     [lite / professional / business]
? Modo de pipeline:          [classic / design]
? Incluir IA Jutia?:         [si / no / solo lite]
```

Ejemplo para un proyecto real:

```
? Nombre del proyecto:       ControlStock
? Tipo de aplicacion:        AHA Inventario
? Descripcion breve:         Control de inventario offline para ferreteria
? Perfil de empaquetado:     lite
? Modo de pipeline:          classic
? Incluir IA Jutia?:         solo lite
```

---

## 5. Fase 1: Setup

### Que hace setup-init

La skill **setup-init** es la primera en ejecutarse. Sus responsabilidades:

1. **Validar el entorno**: verifica que Git, Node.js y las herramientas
   necesarias esten disponibles
2. **Crear la estructura de directorios**: genera el arbol completo del
   proyecto en el directorio de salida (por defecto, un subdirectorio con
   el nombre del proyecto)
3. **Instalar librerias**: copia las librerias necesarias segun el perfil
4. **Generar defaults**: crea avatar y placeholder por defecto en `data/`

### Estructura de directorios generada

```
mi-proyecto/
+-- index.html                 # Entry point principal
+-- project.config.js          # Configuracion del proyecto (tokens, perfil)
+-- AGENTS.md                  # Instrucciones para OpenCode en este proyecto
+-- core/
|   +-- app.js                 # Router hash-based SPA
|   +-- db.js                  # Inicializacion Dexie (tablas de sistema)
|   +-- crypto.js              # Cifrado AES + UUID generator
|   +-- ui.js                  # API de UI (toast, confirm, modal, loading)
|   +-- theme.js               # Variables CSS + Alpine store de tema
|   +-- theme-export.css       # Export de tema a CSS estatico (para produccion)
|   +-- sync.js                # Backup/restore cifrado + comprimido
|   +-- file-store.js          # Gestion de archivos (blobs en Lite, disco en Pro)
|   +-- search-palette.js      # Command palette Ctrl+K
|   +-- service-worker.js      # Cache de assets (solo Lite)
|   +-- manifest.json          # PWA manifest (solo Lite)
+-- assets/
|   +-- alpine.min.js          # Alpine.js 3.x
|   +-- alpinejs-*.zip         # Alpine plugins (mask, persist, etc.)
|   +-- dexie.min.js           # Dexie 4.x
|   +-- crypto-js/             # CryptoJS (rollup propio)
|   +-- chart.umd.min.js       # Chart.js 4.x
|   +-- bootstrap-icons/       # Iconos Bootstrap
|   +-- flexsearch.bundle.js   # FlexSearch (busqueda)
|   +-- jspdf.umd.min.js       # jsPDF
|   +-- xlsx.full.min.js       # SheetJS
|   +-- pako.min.js            # Compresion gzip
|   +-- animate.min.css        # Animate.css
|   +-- tailwindcss.min.css    # Tailwind compilado + DaisyUI
|   +-- fonts/                 # Fuentes del sistema (inter, etc.)
+-- modules/                   # Modulos de la app (generados en Fase 4)
|   +-- dashboard/
|   |   +-- module.html
|   |   +-- module.js
|   +-- productos/             # (ejemplo para Inventario)
|   |   +-- module.html
|   |   +-- module.js
+-- data/
|   +-- defaults/
|       +-- avatar.svg
|       +-- placeholder.svg
|       +-- README.md
+-- docs/                      # Documentacion (generado)
+-- specs/                     # Specs funcionales (generado)
```

### Librerias instaladas segun perfil

| Libreria | Lite | Professional | Business |
|----------|:----:|:------------:|:--------:|
| Alpine.js 3.x | Si | Si | Si |
| Alpine.js Mask | Si | Si | Si |
| Alpine.js Persist | Si | Si | Si |
| Alpine.js Collapse | Si | Si | Si |
| Alpine.js Focus | Si | Si | Si |
| Dexie 4.x | Si | Si | Si |
| CryptoJS | Si | Si | Si |
| Chart.js 4.x | Si | Si | Si |
| Bootstrap Icons | Si | Si | Si |
| FlexSearch | Si | Si | Si |
| jsPDF | Si | Si | Si |
| SheetJS | Si | Si | Si |
| pako (gzip) | Si | Si | Si |
| Animate.css | Si | Si | Si |
| Tailwind + DaisyUI | Si | Si | Si |
| Service Worker | Si | No | No |
| PWA Manifest | Si | No | No |
| Neutralino config | No | Si | Si |
| Capacitor config | No | Si | Si |
| White-label panel | No | No | Si |
| SQLite FTS5 | No | Si | Si |

### project.config.js

Al finalizar el setup, se genera `project.config.js` con la configuracion
base del proyecto:

```javascript
window.APP_CONFIG = {
  app: {
    id: 'com.ateje.controlstock',
    nombre: 'ControlStock',
    descripcion: 'Control de inventario offline para ferreteria',
    version: '1.0.0',
    perfil: 'lite',
    ia: 'lite',
    componente_library: 'daisyui'
  },
  tema: {
    mode: 'light',
    colores: {
      primary: '#1d4ed8',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#1f2937',
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    font: {
      family: "'Inter', system-ui, sans-serif",
      size: '16px',
      headings: {
        h1: '2rem',
        h2: '1.5rem',
        h3: '1.25rem'
      }
    },
    radius: {
      box: '8px',
      btn: '8px',
      badge: '9999px',
      card: '12px',
      modal: '16px',
      input: '8px'
    }
  },
  modules: [],
  files: []
};
```

---

## 6. Fase 2: Spec

### Elegir y copiar el template

Cada app del catalogo tiene un template en `apps/AHA-Nombre/template.md`.
Este archivo es la **Single Source of Truth** para la app.

Para empezar, copia el template de la app que elegiste:

```powershell
# Ejemplo: crear spec para AHA Inventario
mkdir -p specs
copy-item apps\AHA-Inventario\template.md specs\ControlStock.md
```

O puedes dejar que **spec-engine** lo haga automaticamente cuando el
pipeline le pase el tipo de app seleccionado.

### spec-engine: genera specs/[app].md + DESIGN.md

El **spec-engine** toma la descripcion del proyecto y genera dos archivos:

1. **`specs/[app].md`** - Especificacion funcional con 15 secciones:
   - Nombre y descripcion
   - Modulos con funcionalidades detalladas
   - Modelo de datos (tablas Dexie con indices)
   - User journeys (flujos completo)
   - Reglas de negocio
   - UI/UX requirements
   - Testing criteria
   - Librerias adicionales
   - Formato de exports (PDF, CSV, XLSX)
   - Perfiles de IA (Lite vs Full)

2. **`specs/DESIGN.md`** - Brand layer con:
   - North Star (filosofia de diseno)
   - Paleta de colores con roles semanticos
   - Tipografia (familia, escalas)
   - Sistema de espaciado (grid de 8px)
   - Superficies y elevacion
   - Componentes y sus estados
   - Voice & Tone (voz de marca)
   - Modo claro/oscuro

### Discovery de marca (286 referencias oh-my-design)

En el modo **Design** (/pro), el spec-engine integra el catalogo
**Oh My Design** con 286 referencias de diseno de marcas reales:

- Stripe, Linear, Vercel, Apple, Notion, Superhuman
- Empresas SaaS, fintech, e-commerce, salud, educacion
- Cada referencia incluye DESIGN.md completo con tokens, componentes,
  ejemplos HTML/CSS

El pipeline te preguntara:

```
? Quieres elegir una referencia de marca para inspirar el diseno?
  [si / no]

? Buscar por estilo o marca:
  [dark minimal, fintech, salud, "Stripe", "Linear", etc.]

? Coincidencias encontradas:
  1. Linear (dark, minimal, productividad)
  2. Vercel (dark, tecnico, developers)
  3. Stripe (light, profesional, fintech)

? Cual prefieres como inspiracion?
  [1-3 o "ninguna"]
```

La referencia seleccionada se usa para generar un DESIGN.md unico que
captura el "espiritu" de la marca inspiradora pero adaptado a tu proyecto.

### Ejemplo de spec funcional generado

```markdown
# ControlStock - Especificacion funcional

## Modulos

### Productos
- CRUD completo: nombre, SKU, categoria, precio, cantidad, imagen, umbral minimo
- Busqueda instantanea por nombre o SKU (FlexSearch)
- Codigo QR unico por producto con opcion de imprimir
- Escaneo QR desde camara (solo perfil Professional/Business, .apk)

### Categorias
- CRUD de categorias con nombre y color
- Vista de productos agrupados por categoria en dashboard

### Movimientos
- Entradas y salidas de stock: producto, cantidad, motivo, fecha
- Tipos: compra, venta, ajuste, merma, transferencia
- Historial completo con filtros por tipo y fecha

### Alertas
- Umbral minimo configurable por producto
- Notificacion visual en sidebar
- Lista de productos por debajo del minimo

### Reportes
- Dashboard: total productos, valor de stock, bajo stock, actividad reciente
- Graficos Chart.js (barras, donut, linea)
- Export a CSV, PDF

## Tablas Dexie

```javascript
db.version(1).stores({
  categorias: 'id, nombre, *color, createdAt, updatedAt',
  productos: 'id, nombre, *sku, *categoriaId, precio, cantidad, *imagen, *umbralMinimo, *createdBy, createdAt, updatedAt',
  movimientos: 'id, *productoId, *tipo, cantidad, *motivo, *createdBy, createdAt',
  alertas: 'id, *productoId, *tipo, leida, createdAt',
  _sync_log: 'id, *tabla, *operacion, *idRegistro, *estado, *fecha, *createdBy, createdAt',
  _files: '&path, tipo, nombre, mime, size, hash, refCount, createdAt, updatedAt',
  _file_blobs: '&path'
});
```

## User journeys

### Journey: Registrar producto nuevo
1. Usuario hace clic en "Nuevo producto"
2. Modal con formulario: nombre, SKU, categoria, precio, cantidad, umbral
3. Usuario completa campos y hace clic en "Guardar"
4. Sistema valida: SKU unico, precio > 0, cantidad >= 0
5. Si todo OK: toast success, producto visible en lista
6. Si SKU duplicado: toast error, campo SKU marcado en rojo
```

---

## 7. Fase 3: Design (brand layer)

### Que hace design-engine

El **design-engine** es el motor de diseno visual. Toma el DESIGN.md generado
en la fase anterior y:

1. Lee el DESIGN.md como autoridad de marca
2. Define tokens de diseno: colores, tipografia, espaciado, bordes, sombras
3. Actualiza `project.config.js` con los tokens seleccionados
4. Selecciona una libreria de componentes (DaisyUI / Pines / Penguin / Pinemix)
5. Guarda las preferencias en `.omd/preferences.md` para sesiones futuras

### Decision tree de libreria de componentes

El design-engine tiene un arbol de decision para elegir la libreria de
componentes optima:

```
? Que libreria de componentes prefieres?
  1. DaisyUI (recomendado) - 55+ componentes, tema CSS, Tailwind nativo
  2. Pines - 40+ componentes Alpine.js avanzados
  3. Penguin - Componentes Alpine.js minimalist
  4. Pinemix - Componentes Alpine.js con animaciones
  5. Mixto - Usar lo mejor de cada una segun el componente
```

La opcion por defecto es **DaisyUI** (la mas completa y mejor integrada).
Las otras librerias se usan como fallback para componentes que DaisyUI no
tiene (ej: command palette, drag & drop, advanced modals).

### alpine-ui-patterns

La skill **alpine-ui-patterns** contiene un catalogo unificado de ~100
componentes Alpine.js organizados por calidad:

| Categoria | Calidad | Ejemplos | Fuente |
|-----------|---------|----------|--------|
| A | Excelente | Command palette, DataTable, Kanban, Datepicker | Pines |
| B | Buena | Timeline, Masonry, Stepper, Split pane | Penguin |
| C | Funcional | Tree view, Color picker, Resize handle | Pinemix |

Cuando un componente no esta disponible en la libreria principal, se usa
el fallback chain: DaisyUI -> Pines -> Penguin -> Pinemix -> generico.

### Tokens de diseno que se definen

El resultado se guarda en `project.config.js`:

```javascript
window.APP_CONFIG = {
  app: { /* ... */ },
  tema: {
    mode: 'light',
    colores: {
      primary: '#2563eb',       // Azul primario
      secondary: '#7c3aed',     // Violeta secundario
      accent: '#f59e0b',        // Ambar para acentos
      neutral: '#1e293b',       // Slate oscuro para textos
      'base-100': '#ffffff',    // Fondo principal
      'base-200': '#f1f5f9',    // Fondo secundario
      'base-300': '#e2e8f0',    // Fondo terciario
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    font: {
      family: "'Inter', system-ui, sans-serif",
      size: '16px',
      headings: { h1: '2rem', h2: '1.5rem', h3: '1.25rem', h4: '1rem' }
    },
    radius: {
      box: '8px', btn: '8px', badge: '9999px',
      card: '12px', modal: '16px', input: '8px'
    },
    component_library: 'daisyui'
  }
};
```

### Preferencias persistentes en .omd/preferences.md

Cada correccion o preferencia que indiques durante el diseno se guarda
en `.omd/preferences.md`:

```markdown
# Preferencias de diseno

## Aplicadas
- color.primary: #2563eb -> Azul primario (2026-07-01)
- font.family: Inter -> Fuente del sistema (2026-07-01)
- radius.card: 12px -> Tarjetas redondeadas (2026-07-01)

## Pendientes (no aplicadas aun)
- layout.sidebar: collapsible -> Pendiente de review
```

Usar `omd:learn` para aplicar las preferencias pendientes al DESIGN.md.

---

## 8. Fase 4: Build (generacion de codigo)

### code-generator: Fase A (core) + Fase B (modulos)

El **code-generator** es el corazon de la generacion. Trabaja en dos fases:

#### Fase A: Core + index.html

Genera los archivos base que forman el esqueleto de la app:

1. `index.html` - Entry point con Alpine, DaisyUI, estructura de layout
2. `core/app.js` - Router hash-based SPA
3. `core/db.js` - Dexie con tablas de sistema + tablas de negocio
4. `core/crypto.js` - Cifrado AES + UUID
5. `core/ui.js` - API de interfaz (toast, confirm, modal, loading)
6. `core/theme.js` - Variables CSS + theme store
7. `core/theme-export.css` - Export de tema estatico
8. `core/sync.js` - Backup/restore cifrado
9. `core/file-store.js` - Gestion de archivos segun perfil
10. `core/search-palette.js` - Command palette Ctrl+K
11. `core/service-worker.js` - Service Worker (solo Lite)
12. `core/manifest.json` - PWA manifest (solo Lite)

#### Fase B: Modulos uno por uno

Cada modulo de la app se genera individualmente. El code-generator
procesa UN modulo por turno y espera confirmacion.

Ejemplo para AHA Inventario:

```
Modulo 1/5: Dashboard          -> modules/dashboard/module.html + module.js
Modulo 2/5: Productos          -> modules/productos/module.html + module.js
Modulo 3/5: Categorias         -> modules/categorias/module.html + module.js
Modulo 4/5: Movimientos        -> modules/movimientos/module.html + module.js
Modulo 5/5: Reportes           -> modules/reportes/module.html + module.js
```

Cada modulo tiene:

- **`module.html`**: Template Alpine.js con markup DaisyUI
- **`module.js`**: Logica del modulo (CRUD, validacion, eventos)

Ejemplo de modulo tipico:

```html
<!-- modules/productos/module.html -->
<section x-data="productos()" x-init="init()">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Productos</h2>
    <button class="btn btn-primary" @click="abrirFormulario()">
      <i class="bi bi-plus-lg"></i>
      Nuevo producto
    </button>
  </div>

  <template x-if="loading">
    <div class="space-y-3">
      <div class="sk-el sk-row"></div>
      <div class="sk-el sk-row"></div>
      <div class="sk-el sk-row"></div>
    </div>
  </template>

  <template x-if="!loading && productos.length === 0">
    <div class="alert alert-info">
      <i class="bi bi-info-circle"></i>
      No hay productos registrados. Crea el primero.
    </div>
  </template>

  <template x-if="!loading && productos.length > 0">
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template x-for="p in productos" :key="p.id">
            <tr>
              <td x-text="p.nombre"></td>
              <td x-text="p.sku"></td>
              <td x-text="p.categoria"></td>
              <td x-text="formatearMoneda(p.precio)"></td>
              <td>
                <span class="badge"
                  :class="p.cantidad <= p.umbralMinimo ? 'badge-warning' : 'badge-success'"
                  x-text="p.cantidad"></span>
              </td>
              <td>
                <button class="btn btn-sm btn-ghost" @click="editar(p)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-ghost text-error" @click="eliminar(p)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </template>
</section>
```

```javascript
// modules/productos/module.js
window.modules = window.modules || {};
window.modules.productos = function() {
  return {
    loading: true,
    productos: [],
    async init() {
      await this.cargar();
    },
    async cargar() {
      this.loading = true;
      this.productos = await db.productos.orderBy('nombre').toArray();
      this.loading = false;
    },
    formatearMoneda(n) {
      return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    },
    async abrirFormulario(producto) {
      const esEdicion = !!producto;
      const html = `
        <label class="form-control">
          <span class="label-text">Nombre</span>
          <input type="text" class="input input-bordered" x-ref="nombre"
            value="${producto?.nombre || ''}" required>
        </label>
        <label class="form-control">
          <span class="label-text">SKU</span>
          <input type="text" class="input input-bordered" x-ref="sku"
            value="${producto?.sku || ''}" required>
        </label>
        <label class="form-control">
          <span class="label-text">Precio</span>
          <input type="number" step="0.01" class="input input-bordered" x-ref="precio"
            value="${producto?.precio || ''}" required>
        </label>
        <label class="form-control">
          <span class="label-text">Cantidad</span>
          <input type="number" class="input input-bordered" x-ref="cantidad"
            value="${producto?.cantidad || 0}" required>
        </label>`;

      const ok = await UI.modalForm(
        esEdicion ? 'Editar producto' : 'Nuevo producto',
        html,
        async (form) => {
          const data = {
            nombre: form.nombre,
            sku: form.sku,
            precio: parseFloat(form.precio),
            cantidad: parseInt(form.cantidad),
            updatedAt: new Date().toISOString()
          };
          if (esEdicion) {
            await db.productos.update(producto.id, data);
            UI.toast('Producto actualizado', 'success');
          } else {
            data.id = uuid();
            data.createdAt = new Date().toISOString();
            await db.productos.add(data);
            UI.toast('Producto creado', 'success');
          }
          await this.cargar();
        }
      );
    },
    async eliminar(producto) {
      const ok = await UI.confirm(
        `Eliminar "${producto.nombre}"?`,
        'Confirmar eliminacion'
      );
      if (ok) {
        await db.productos.delete(producto.id);
        UI.toast('Producto eliminado', 'success');
        await this.cargar();
      }
    }
  };
};
```

### 20 templates core

El code-generator tiene 20 templates base en `code-generator/templates/core/`:

```
code-generator/templates/core/
+-- app.js              # Router SPA
+-- db.js               # Dexie init
+-- crypto.js           # Cifrado
+-- ui.js               # UI helpers
+-- theme.js            # Variables CSS
+-- main.js             # Entry point
+-- sw.js               # Service Worker (Lite)
+-- manifest.json       # PWA manifest (Lite)
+-- a11y.js             # Accesibilidad
+-- focus-trap.js       # Focus trap para modales
+-- responsive.js       # Helpers responsive
+-- bottom-nav.js       # Nav inferior movil
+-- push-manager.js     # Notificaciones push (APK)
+-- analytics.js        # Analytics local
+-- sync.js             # Backup/restore
+-- backup-manager.js   # Gestion de respaldos
+-- env.js              # Variables de entorno
+-- network.js          # Deteccion de conectividad
+-- export.js           # Export PDF/CSV/XLSX
+-- license.js          # Verificacion de licencia .aha
```

Cada template se adapta al perfil seleccionado (Lite/Professional/Business).

### stack-compliance-guard automatico

Al finalizar la generacion de cada modulo, **stack-compliance-guard** se
activa automaticamente y verifica:

1. **No imports ES6**: Todos los scripts deben usar `<script src>` o
   `window.` exports, nunca `import`/`export` de ES6
2. **No CDNs**: Todas las librerias deben estar en `assets/`, no en CDN
3. **No fetch()**: No se permite fetch a servidores externos
4. **Crypto presente**: Verifica que `window.cryptoHelpers` existe
5. **UI API presente**: Verifica `window.UI.toast`, `UI.confirm`, etc.
6. **No alert()**: Debe usarse `UI.toast()` en lugar de `alert()`
7. **Confirm antes de delete**: Toda operacion de borrado debe tener
   `UI.confirm()` previo
8. **No console.log**: Los logs de depuracion deben eliminarse

Si encuentra violaciones, las reporta y ofrece corregirlas automaticamente.

---

## 9. Fase 5: Validacion

### validation-engine: 4 fases

El **validation-engine** ejecuta 4 fases de validacion secuencial:

#### Fase 1: Compliance (automatica)

Verifica el cumplimiento tecnico del stack:

```
[COMPLIANCE] Verificando modulos...
  modules/dashboard/module.js   -> OK
  modules/productos/module.js   -> OK
  modules/categorias/module.js  -> WARN: Usa alert() en linea 42
  modules/movimientos/module.js -> OK
  modules/reportes/module.js    -> OK

[COMPLIANCE] Verificando core...
  core/app.js   -> OK
  core/db.js    -> OK
  core/ui.js    -> OK

[COMPLIANCE] Verificando assets...
  assets/alpine.min.js          -> OK
  assets/dexie.min.js           -> OK

RESULTADO: 1 warning. Corregir? [si/no]
```

#### Fase 2: Brand audit

Compara la implementacion contra el DESIGN.md:

```
[BRAND AUDIT] Verificando coherencia de marca...
  Colores primarios   -> OK (#2563eb en todos los modulos)
  Tipografia          -> OK (Inter en headings y body)
  Radius              -> OK (8px botones, 12px tarjetas)
  Espaciado           -> OK (grid 8px consistente)
  Modo oscuro         -> WARN: No implementado en modulo reportes
  Estados hover       -> OK
  Estados disabled    -> WARN: Faltan en modulo movimientos

RESULTADO: 2 warnings de marca. Corregir con /refactor? [si/no]
```

#### Fase 3: DevTools + Playwright

Abre la app en Chrome DevTools y ejecuta:

- **Accesibilidad**: Contrastes, roles ARIA, focus visible, skip links
- **Responsive**: 320px, 768px, 1024px, 1440px
- **Touch targets**: Botones >= 44px
- **Performance**: Lighthouse snapshot
- **Consola**: Sin errores JS ni warnings

Si hay Playwright instalado, corre tests E2E:

```powershell
cd tests
python test_app.py
```

#### Fase 4: QA rubric

Evalua con 8 criterios obligatorios:

```
RUBRIC OFFLINE-FIRST QA
========================
1. Funciona sin internet (file://)          [PASS/FAIL]
2. No hay imports ES6                       [PASS/FAIL]
3. No hay CDNs en runtime                   [PASS/FAIL]
4. Crypto presente en campos sensibles      [PASS/FAIL]
5. UI.toast en lugar de alert()             [PASS/FAIL]
6. UI.confirm antes de delete()             [PASS/FAIL]
7. Focus trap en modales                    [PASS/FAIL]
8. Estados vacios en todas las listas       [PASS/FAIL]

RESULTADO: 8/8 PASS - APTO PARA ENTREGA
```

### Modo refactor con /refactor

Si el brand audit encuentra desviaciones, puedes ejecutar:

```
/refactor
```

Esto activa el **validation-engine en modo refactor**, que:

1. Lee las desviaciones reportadas
2. Corrige automaticamente colores, tipografia, espaciado
3. Anade estados hover, focus, disabled faltantes
4. Implementa modo oscuro si falta
5. Reporta cambios realizados

### Tests manuales

Puedes abrir la app directamente en el navegador:

```powershell
# Abrir con doble clic (Windows)
start index.html

# O abrir con Chrome
start chrome file:///$pwd/index.html
```

Y probar manualmente:

1. Crear, editar y eliminar registros
2. Busqueda con FlexSearch
3. Export a PDF/CSV
4. Backup y restore
5. Modo oscuro (si aplica)
6. Responsive (redimensionar ventana)
7. Sin internet (desconectar WiFi y recargar)

---

## 10. Fase 6: Deploy

### deployment-jigue

La skill **deployment-jigue** maneja todo el proceso de publicacion:

1. **Commit**: Prepara los archivos para commit (solo los generados,
   excluye `docs/`, `specs/`, `.omd/`)
2. **Push**: Envia a GitHub Pages (Lite) o genera empaquetado
   (Professional/Business)
3. **Empaquetado**: Genera ZIP con la distribucion final segun perfil

Antes de publicar, el pipeline te pedira confirmacion:

```
? Confirmas publicar la app ControlStock?
  Proyecto: D:/Proyectos/ControlStock
  Perfil:   Lite (Essential)
  Version:  1.0.0

  Se generara:
  - commit en git con mensaje "v1.0.0: ControlStock Essential"
  - push a GitHub Pages
  - ZIP: dist/ControlStock-Essential-v1.0.0.zip

? Proceder con el deploy? [si/no]
```

### Segun perfil

#### Lite (Essential): ZIP + GitHub Pages

```powershell
/deploy
```

Resultado:
- Commit y push a GitHub Pages
- ZIP en `dist/ControlStock-Essential-v1.0.0.zip`
- La app queda disponible en `https://tu-user.github.io/ControlStock/`
- HTML visible: cualquiera puede ver el codigo fuente (ideal para demo)

#### Professional: .exe + .apk

```powershell
/deploy
```

Resultado:
- **`.exe`** con Neutralinojs + Fixed WebView2 (no requiere Chrome)
- **`.apk`** con Capacitor (SQLite FTS5, camara, GPS, notificaciones)
- Sin HTML visible: el usuario final no accede al codigo fuente
- ZIP en `dist/ControlStock-Professional-v1.0.0.zip` (~30MB)

#### Business: .exe + .apk + white-label

```powershell
/deploy
```

Resultado:
- Todo lo de Professional
- **White-label**: la app incluye panel de personalizacion (colores,
  logo, fuentes, CSS en vivo) desde ajustes
- Guia de marca personalizada en PDF
- Soporte prioritario configurado
- ZIP en `dist/ControlStock-Business-v1.0.0.zip` (~35MB)

### Acciones post-deploy

El deployment-jigue etiqueta la version en git y genera un release
si hay GitHub Actions configurado:

```yaml
# .github/workflows/deploy-pages.yml (Lite)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
```

---

## 11. Que recibe el cliente final

### Lite (Essential)

```
ControlStock-Essential-v1.0.0.zip
+-- index.html              # Entry point (doble clic para abrir)
+-- project.config.js       # Configuracion
+-- core/                   # Nucleo de la app
|   +-- app.js, db.js, ui.js, crypto.js, theme.js
|   +-- sync.js, file-store.js, search-palette.js
|   +-- service-worker.js, manifest.json
+-- assets/                 # Librerias locales
|   +-- alpine.min.js, dexie.min.js, chart.umd.min.js
|   +-- crypto-js/, bootstrap-icons/, flexsearch.bundle.js
|   +-- jspdf.umd.min.js, xlsx.full.min.js, pako.min.js
|   +-- tailwindcss.min.css, animate.min.css, fonts/
+-- modules/                # Modulos funcionales
|   +-- dashboard/
|   +-- productos/
|   +-- categorias/
|   +-- movimientos/
|   +-- reportes/
+-- data/                   # Datos por defecto
|   +-- defaults/avatar.svg
|   +-- defaults/placeholder.svg
+-- docs/
|   +-- GUIA_USUARIO.pdf
|   +-- README.md
+-- specs/                  # Specs funcionales
|   +-- ControlStock.md
|   +-- DESIGN.md

Y ADEMAS:
- GitHub Pages URL funcional: https://tu-user.github.io/ControlStock/
- HTML visible: el cliente puede ver y modificar el codigo
- Perfecto para: demos, prototipos, presupuestos iniciales
```

### Professional

```
ControlStock-Professional-v1.0.0.zip (~30MB)
+-- ControlStock.exe                # Ejecutable Neutralino (portable)
+-- ControlStock.apk                # App Android (Capacitor)
+-- neutralino.config.json          # Config Neutralino
+-- capacitor.config.json           # Config Capacitor
+-- resources/                      # App empaquetada (sin HTML visible)
|   +-- index.html                  # Ofuscado en Neutralino
|   +-- core/                       # Codigo interno
|   +-- modules/                    # Modulos empaquetados
|   +-- assets/                     # Librerias
+-- docs/
|   +-- GUIA_USUARIO.pdf
|   +-- GUIA_INSTALACION.txt
+-- specs/
|   +-- ControlStock.md
|   +-- DESIGN.md

CARACTERISTICAS:
- .exe con WebView2 fijo (no requiere Chrome instalado)
- .apk con camara, GPS, notificaciones push
- Sin HTML visible: el usuario no accede al codigo fuente
- IA Full: FlexSearch + Transformers.js QA + OCR
- Backup/restore cifrado con AES
```

### Business

```
ControlStock-Business-v1.0.0.zip (~35MB)
+-- ControlStock.exe                # Ejecutable Neutralino
+-- ControlStock.apk                # App Android
+-- neutralino.config.json
+-- capacitor.config.json
+-- resources/                      # App empaquetada
|   +-- ...
+-- brand/                          # White-label
|   +-- brand.config.json           # Config de marca
|   +-- logo.svg / logo.png         # Logo del cliente
|   +-- favicon.ico                 # Favicon personalizado
+-- docs/
|   +-- GUIA_USUARIO.pdf
|   +-- GUIA_MARCA.pdf              # Guia de marca personalizada
|   +-- MANUAL_SOPORTE.pdf          # Manual de soporte prioritario
+-- specs/
|   +-- ControlStock.md
|   +-- DESIGN.md

CARACTERISTICAS ADICIONALES:
- White-label completo: colores, logo, fuentes desde la app
- Panel de personalizacion en ajustes (preview en vivo)
- Soporte prioritario con SLA
- Guia de marca personalizada en PDF
- Sin codigo fuente visible
```

---

## 12. Apps individuales vs Kits verticales

### App individual

Cuando el cliente necesita una sola herramienta, se genera una licencia
para esa app especifica.

**Comando:**

```
/licencia generar
```

El sistema pregunta paso a paso:

```
? Tipo de licencia: [individual / kit]
? App: [Inventario / POS / Comanda / ...]
? Plan: [Inicio / Profesional / Enterprise]
? Cliente: [Nombre del cliente]
? Email: [email del cliente]

Resumen:
  App:       AHA Inventario
  Plan:      Inicio (Lite)
  Precio:    $49 USD
  Cliente:   Juan Perez
  ? Confirmar? [si/no]
```

Genera un archivo `.aha` firmado (RSA+AES) en `licencias/[fecha]/`.

**Precios por app individual:**

| Plan | Perfil tecnico | Precio USD |
|------|---------------|:----------:|
| Inicio | Lite (ZIP+Pages) | $49 |
| Profesional | Professional (.exe+.apk) | $99 |
| Enterprise | Business (.exe+.apk+white-label) | $199 |

### Kit vertical

Cuando el cliente quiere una solucion completa para su negocio, se genera
una licencia que incluye todas las apps del kit.

**Comando:**

```
/licencia generar --kit gastronomia
```

Kits disponibles:

| Vertical | Comando | Apps incluidas | Precio | Ahorro vs individual |
|----------|---------|----------------|:------:|:--------------------:|
| Comercio y Retail | `--kit comercio` | POS + Inventario + PreFactura + Gastos + Contactos | $299 | ~$130 |
| Gastronomia | `--kit gastronomia` | Comanda + POS + Inventario + Gastos + Asistencia | $349 | ~$100 |
| Belleza y Servicios | `--kit belleza` | Citas + Contactos + Gastos + Asistencia | $249 | ~$55 |
| Salud y Consultorios | `--kit salud` | Rx + Citas + PreFactura + Contactos + Gastos | $299 | ~$80 |
| Construccion y Obra | `--kit construccion` | Obra + Checklist + Campo + PreFactura + Gastos | $449 | ~$120 |
| Campo y Agro | `--kit campo` | Campo + Inventario + Flota + Gastos | $349 | ~$80 |
| Logistica y Transporte | `--kit logistica` | Flota + Asistencia + Checklist + Gastos | $349 | ~$80 |
| Oficina y Freelancers | `--kit oficina` | CRM + Contactos + PreFactura + Gastos | $249 | ~$55 |

### Estrategia de venta

1. **Empieza con Inicio (Lite)**: Ofrece el plan Inicio a $49 para que
   el cliente pruebe la app. El HTML visible permite demo online.

2. **Upgrade a Profesional**: Cuando el cliente quiera privacidad (sin
   HTML visible), .exe portable y app Android, ofrece el upgrade.

3. **De app individual a kit**: Cuando el cliente mencione otro problema
   ("tambien necesito controlar gastos"), ofrece el kit completo con
   descuento.

4. **Business para empresas**: Para clientes que quieran su marca,
   colores y logo personalizados, ofrece el plan Enterprise.

WhatsApp script de venta:

```
Hola [nombre], necesito [problema] sin pagar mensualidades.
Ahi AHA [App] plan [Inicio/Profesional] con [ZIP+Pages/.exe+.apk]?
```

Ejemplo real:

```
Hola Angel, necesito controlar el inventario de mi tienda
sin pagar mensualidades. AInventario plan Inicio con ZIP+Pages?
```

---

## 13. Post-entrega

### Upgrade de perfil con /upgrade

El cliente puede querer migrar de perfil (ej: de Lite a Professional).
Para eso existe el **upgrade-engine**.

Comando:

```
/upgrade
```

El engine hace un diagnostico y ofrece opciones:

```
? Diagnostico completado.

  Proyecto:    ControlStock
  Perfil actual: Lite
  Perfiles disponibles: Professional, Business
  IA actual:           Lite
  IA disponible:       Full (FlexSearch + Transformers.js QA + OCR)

? Que upgrade deseas?
  1. Lite -> Professional (agrega Neutralino + Capacitor + IA Full)
  2. Lite -> Business (agrega Neutralino + Capacitor + IA Full + White-label)
  3. IA Lite -> IA Full (mejora busqueda sin cambiar perfil)
  4. Cancelar
```

El upgrade engine:

- No modifica los modulos ni los datos existentes
- Solo agrega/remueve archivos de infraestructura
- Actualiza `project.config.js` con el nuevo perfil
- Si es a Professional/Business: agrega `neutralino.config.json`,
  `capacitor.config.json`, `android/`
- Si es a Business: agrega `brand/` con panel white-label
- Si es IA Full: actualiza `ia-jutia/` con Transformers.js y OCR

### Soporte y actualizaciones

Cada nivel incluye:

| Nivel | Soporte incluido | Actualizaciones |
|-------|-----------------|-----------------|
| Inicio (Lite) | 7 dias por correo | Menores (bugs) |
| Profesional | 30 dias por email + WhatsApp | Menores + parches de seguridad |
| Enterprise (Business) | 90 dias prioritario + telefono | Todas (menores + mayores + features) |

El contrato de servicio freelance tipico incluye:

- Codigo fuente funcional (HTML5, CSS3, JS ES6+, Alpine.js, Dexie, CryptoJS)
- Librerias locales en `assets/` (sin dependencias externas en runtime)
- Documentacion: `GUIA_USUARIO.pdf` + `README.md` tecnico
- Reporte de validacion tecnica (`validacion-[app].md`)
- Soporte post-entrega por X dias

### White-label (Business)

Para clientes Business, la app incluye un panel de personalizacion
accesible desde Ajustes:

```
Ajustes > Personalizar marca

+------------------------------------------+
|  Color primario:    [#2563eb]  [Selector] |
|  Color secundario:  [#7c3aed]  [Selector] |
|  Fuente:            [Inter v]             |
|  Logo:              [Seleccionar imagen]   |
|  Favicon:           [Seleccionar imagen]   |
|                                           |
|  [Vista previa en vivo]                   |
|                                           |
|  [Exportar configuracion]                 |
+------------------------------------------+
```

La configuracion se guarda en `brand.config.json` y se aplica en tiempo
real. El cliente puede exportar la configuracion para usarla en otras
apps del mismo kit.

---

## 14. Conclusion

### Resumen del flujo completo

```
1. Eliges la app del catalogo (apps/AHA-Nombre/template.md)
2. Ejecutas /nuevo proyecto en OpenCode
3. Eliges modo: Classic (/new) o Design (/pro)
4. Pipeline ejecuta 5-10 fases con pausas entre cada una:
   SETUP -> SPEC -> DESIGN -> BUILD -> VALIDATE -> DEPLOY
5. Recibes ZIP + GitHub Pages (Lite) o .exe+.apk (Pro/Business)
6. Generas licencia con /licencia
7. Entregas al cliente
8. Post-entrega: upgrades con /upgrade, soporte, white-label
```

### Tiempos estimados

| Actividad | Tiempo |
|-----------|--------|
| Elegir app y template | 5 min |
| Pipeline Classic (5 fases) | 10 min |
| Pipeline Design (10 fases) | 30 min |
| Probar manualmente | 15 min |
| Generar licencia | 2 min |
| Empaquetar y entregar | 5 min |
| **Total (Classic)** | **~35 min** |
| **Total (Design)** | **~60 min** |

### Checklist de entrega

Antes de entregar al cliente, verifica:

- [ ] La app funciona con doble clic en `index.html`
- [ ] Sin internet: abre sin errores en consola
- [ ] CRUD funcional en todos los modulos
- [ ] Busqueda con FlexSearch funciona
- [ ] Export a PDF/CSV genera archivos validos
- [ ] Backup y restore cifrado funciona
- [ ] UI.toast en lugar de alert() en toda la app
- [ ] UI.confirm antes de delete() en toda la app
- [ ] Estados vacios en listas sin datos
- [ ] Responsive: se ve bien en movil (320px) y escritorio
- [ ] Touch targets >= 44px
- [ ] Focus visible en todos los elementos interactivos
- [ ] Sin errores en consola del navegador
- [ ] `GUIA_USUARIO.pdf` generada y actualizada
- [ ] Licencia `.aha` generada
- [ ] ZIP de distribucion creado

### Referencias

- **Guia de estudio completa**: `docs/guia-estudio-ateje.md`
- **Documentacion del stack**: `docs/stack-completo.md`
- **API Reference**: `docs/API.md` (generado con `/docs-gen`)
- **Skills layer**: `docs/guia-stack-skills-layer.md`
- **Engram + OpenPencil**: `docs/guia-integracion-engram-openpencil.md`
- **Comandos disponibles**: `/docs` desde OpenCode
- **Catalogo de apps**: `apps/` (15 plantillas)
- **Verticales de negocio**: `docs/Transversales.md`

### Comandos slash de referencia rapida

| Comando | Que hace |
|---------|----------|
| `/new` | Pipeline Classic (5 fases) |
| `/pro` | Pipeline Design (10 fases) |
| `/setup` | Solo setup (estructura + librerias) |
| `/spec` | Solo spec (spec funcional + DESIGN.md) |
| `/build` | Solo build (generacion de codigo) |
| `/test` | Validacion completa (compliance + brand + QA) |
| `/validate` | Solo brand audit |
| `/refactor` | Corrige desviaciones de diseno |
| `/compliance` | Solo compliance check |
| `/status` | Estado del pipeline y proyecto |
| `/deploy` | Publicar (commit + push + empaquetado) |
| `/licencia` | Generar licencia .aha |
| `/upgrade` | Migrar entre perfiles |
| `/ia` | Configurar IA Jutia |
| `/wiki` | Gestionar wiki del proyecto |
| `/docs` | Abrir guia de estudio |
| `/docs-gen` | Generar API.md automatico |
| `/archive` | Archivar spec actual |

---

> **Stack Ateje** - Skill-Layer Architecture para apps offline-first.
> Creado por Angel Hernandez - ahaguilera.dev
>
> Documentacion viva. Actualizado a julio 2026.
