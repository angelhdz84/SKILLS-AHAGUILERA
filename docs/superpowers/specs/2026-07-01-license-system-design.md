# AHA License System — Design Document

> Sistema de licencias offline para apps AHA por vertical
> Fecha: 2026-07-01
> Autor: Angel Hernández Aguilera

## 1. Resumen del modelo

Cada app vertical (AHA-POS, AHA-Comanda, etc.) tiene 3 planes que se controlan por un archivo de licencia `.aha` firmado criptográficamente. Sin licencia = Plan Lite (gratis, 30 registros). Con licencia = Plan Profesional o Enterprise.

**Flujo de trabajo del desarrollador:**
```
env.js: ENV = 'development'  →  todo desbloqueado, sin check de licencia
env.js: ENV = 'production'   →  sistema de licencias activo (para el cliente)
```

## 2. Planes

| Feature | Lite | Profesional | Enterprise |
|---------|:----:|:-----------:|:----------:|
| **Registros** | ≤ 30 | ∞ | ∞ |
| **CRUD completo** | ✅ | ✅ | ✅ |
| **Export PDF/CSV** | ❌ | ✅ | ✅ |
| **IA Jutia** | Búsqueda solo | Full (QA + ingesta) | Full |
| **SQLite FTS5** | ❌ | ✅ | ✅ |
| **White-label** | ❌ | ❌ | ✅ |
| **brand.ps1 + docs** | ❌ | ❌ | ✅ |
| **Código fuente** | ❌ | ❌ | ❌ |
| **APK + .exe** | ✅ | ✅ | ✅ |

### Precios

| Plan | Precio por app | Para quién |
|------|:--------------:|------------|
| **Lite** | **Gratis** | Probar, negocio pequeño, ≤ 30 registros |
| **Profesional** | $49–$129 según app | Negocio en operación |
| **Enterprise** | $199–$499 | Marca propia, reventa con su logo |

### Kits por vertical

| Vertical | Kit | Apps | Precio |
|----------|-----|------|:------:|
| Comercio | Ferretería/Minimarket | POS + Inventario + PreFactura + Gastos + Contactos | $299 |
| Gastronomía | Restaurante Completo | Comanda + POS + Inventario + Gastos + Asistencia | $349 |
| Belleza | Barbería/Salón | Citas + Contactos + Gastos + Asistencia | $249 |
| Salud | Consultorio Médico | Rx + Citas + PreFactura + Contactos + Gastos | $299 |
| Construcción | Constructora Pro | Obra + Checklist + Campo + PreFactura + Gastos | $449 |
| Campo | Rancho/Finca | Campo + Inventario + Flota + Gastos | $349 |
| Logística | Flotilla | Flota + Asistencia + Checklist + Gastos | $349 |
| Oficina | Freelancer Pro | CRM + Contactos + PreFactura + Gastos | $249 |

## 3. Key Management

### Setup inicial (una vez)

```powershell
node scripts/generate-keypair.js
```

Genera en `keys/`:
- `private.pem` — RSA 2048-bit private key. **Solo en tu máquina. Hacer backup.**
- `public.pem` — RSA public key. Se embebe en cada app.

### Seguridad

- `private.pem` no se distribuye nunca. Sin ella no se pueden generar licencias válidas.
- Hacer backup de `private.pem` en al menos 2 lugares (USB cifrado + almacenamiento seguro).
- Si la llave se filtra: generar nuevo par y reemitir todas las licencias existentes.

## 4. Archivo de licencia (`.aha`)

### Formato interno (antes de encriptar)

```json
{
  "id": "AHA-P5-20260701-0549",
  "customer": {
    "name": "Juan Pérez López",
    "business": "Ferretería El Clavo",
    "phone": "+52 555 123 4567",
    "email": "juan@elclavo.com"
  },
  "apps": {
    "aha-pos": {
      "plan": "profesional",
      "min_version": "1.0"
    },
    "aha-inventario": {
      "plan": "profesional",
      "min_version": "1.0"
    }
  },
  "issued": "2026-07-01T05:49:00Z",
  "compat": {}
}
```

### ID de licencia

Formato: `AHA-{plan}{apps}-{YYYYMMDD}-{HHMM}`

| Parte | Ejemplo | Significado |
|-------|---------|-------------|
| AHA | AHA | Prefijo de marca |
| Plan | P | Inicial del plan: L / P / E |
| Apps | 5 | Cantidad de apps incluidas |
| Fecha | 20260701 | Fecha de emisión |
| Hora | 0549 | Hora (24h, 4 dígitos) |

Ejemplos:
- `AHA-L5-20260701-0549` — Lite, 5 apps, 1 julio 2026, 05:49
- `AHA-P1-20260715-1430` — Profesional, 1 app, 15 julio 2026, 14:30
- `AHA-E8-20260801-0900` — Enterprise, 8 apps, 1 agosto 2026, 09:00

### Encriptación y firma

```
[JSON plano] → AES-encrypt (clave derivada de app seed) → base64
                                                              ↓
[JSON plano] → SHA-256 hash → RSA-sign (private.pem) → base64
                                                              ↓
Archivo .aha = base64_encrypted + "." + base64_signature
```

La app:
1. Toma el archivo `.aha`
2. Separa encrypted payload y signature
3. Verifica la firma RSA con la llave pública embebida
4. Si es válida, decripta con AES (clave derivada)
5. Lee el JSON y busca su `appId`

### Nombre del archivo

- Formato: `{business-sanitizado}.aha`
- Reglas: minúsculas, sin acentos, espacios → guiones
- Ejemplo: `Ferretería El Clavo` → `ferreteria-el-clavo.aha`

Para multi-app, el nombre del archivo es el mismo para todos los clientes (`license.aha`) ya que la app busca por `appId` dentro del JSON, no por nombre de archivo. Opcional: usar el nombre del negocio sanitizado para identificar visualmente.

### Extensión

`.aha` — no es `.json`, no es `.lic`. No se abre con doble clic. No se asocia a nada.

## 5. Feature Flags en la app

### `env.js`

```javascript
// Cambiar a 'production' al compilar para cliente
const ENV = 'development' // 'development' | 'production'
```

### `core/license.js`

```javascript
window.APP_CONFIG = {
  plan: 'lite',
  maxRecords: 30,
  canExport: false,
  iaTier: 'lite',
  canWhiteLabel: false,
  customer: null
}

async function checkLicense() {
  if (ENV === 'development') {
    // Todo desbloqueado para el desarrollador
    Object.assign(window.APP_CONFIG, {
      plan: 'enterprise',
      maxRecords: Infinity,
      canExport: true,
      iaTier: 'full',
      canWhiteLabel: true,
      customer: { name: 'DEV', business: 'Modo Desarrollo' }
    })
    return
  }

  // Buscar .aha en la carpeta de la app
  const files = await scanForAHAFiles()
  for (const file of files) {
    const data = await verifyAndDecryptLicense(file)
    if (data && data.apps && data.apps[APP_ID]) {
      applyLicense(data, data.apps[APP_ID])
      return
    }
  }
  // Sin licencia válida → se queda como Lite
}
```

### Uso en módulos

```javascript
// modules/dashboard.js
function render() {
  if (APP_CONFIG.plan === 'lite') {
    const count = db.movimientos.count()
    showBanner(`Plan Lite — ${count}/${APP_CONFIG.maxRecords} registros`)
  }
  // ...resto del render
}
```

## 6. UI en la app

### Dashboard

Si el plan es Lite, se muestra un banner sutil pero visible:

```
┌──────────────────────────────────────┐
│  📋 Plan Lite — 22/30 registros      │
│  [ Mejorar plan → ]                  │
└──────────────────────────────────────┘
```

Si es Profesional o Enterprise: sin banner.

### Pantalla de Ajustes

```
┌──────────────────────────────┐
│  ⚙️ Ajustes                  │
│                              │
│  📄 Licencia                 │
│  ──────────────────────────  │
│  Estado: ✅ Plan Profesional │
│  Cliente: Juan Pérez López   │
│  Negocio: Ferretería El Clavo│
│  Tel: +52 555 123 4567       │
│  ID: AHA-P5-20260701-0549    │
│                              │
│  [ Cargar licencia ]         │
│                              │
│  (Sin licencia cargada)      │
│  [ 📂 Seleccionar archivo ]  │
└──────────────────────────────┘
```

### Mecanismo de carga

1. **Automático** al iniciar la app: escanea la carpeta en busca de `*.aha`
2. **Manual** desde Ajustes: botón "Cargar licencia" abre selector de archivos
3. Soporta: file picker nativo (Neutralino), input file (Capacitor/Web), drag & drop

## 7. Comando `/licencia`

### Script CLI

```powershell
node scripts/license.js generate ^
  --plan P ^
  --apps "aha-pos,aha-inventario,aha-prefactura,aha-gastos,aha-contactos" ^
  --customer "Juan Pérez López" ^
  --business "Ferretería El Clavo" ^
  --phone "+52 555 123 4567" ^
  --email "juan@elclavo.com"
```

Output:
```
✔ Licencia generada
  Archivo: licencias/2026-07-01/ferreteria-el-clavo.aha
  ID: AHA-P5-20260701-0549
  Apps: 5 (aha-pos, aha-inventario, aha-prefactura, aha-gastos, aha-contactos)
```

### OpenCode command

```
/licencia
  → ¿Plan? [lite|profesional|enterprise]
  → ¿Apps? [lista, separada por comas]
  → ¿Nombre del cliente?
  → ¿Negocio?
  → ¿Teléfono?
  → ¿Email?
  → ✔ Genera .aha en licencias/[fecha]/
```

### Historial

Cada licencia generada se registra en `licencias/historial.csv`:

```
id,fecha,cliente,negocio,plan,apps
AHA-P5-20260701-0549,2026-07-01T05:49,Juan Pérez López,Ferretería El Clavo,profesional,5
```

### Operaciones soportadas

| Operación | Comportamiento |
|-----------|----------------|
| **Nueva** | Genera .aha nuevo con ID único |
| **Upgrade** | Mismo cliente, mismo archivo, nuevo plan. Nuevo ID. Historial registra cambio. |
| **Add-on** | Mismo cliente, mismas apps + nuevas. Se regenera el .aha con nuevas apps. Nuevo ID. |
| **Renovar** | Si en futuro hay expiración, genera misma licencia con nueva fecha. |

## 8. Manejo de cambios en apps

### Rename de app

Si una app cambia de nombre (ej. `AHA-Creador` → `AHA-Gastos`), las licencias existentes usan `compat` para mantener compatibilidad:

```json
"apps": {
  "aha-gastos": {
    "plan": "profesional",
    "compat": ["aha-creador"]
  }
}
```

La app busca primero su `appId` actual. Si no lo encuentra, busca si algún entry tiene su nombre antiguo en `compat`.

### Nuevas apps en el catálogo (Congelado)

La licencia lista explícitamente cada app y plan. Si se agrega una app nueva al catálogo, las licencias existentes no la incluyen. El cliente debe comprar un add-on.

**No usar** un modelo "inclusivo" donde la licencia diga "kit: comercio" y automáticamente incluya todas las apps del kit presentes y futuras.

### Versión mínima de app

Cada entry en la licencia incluye `min_version`. Si la app está en una versión inferior, muestra un mensaje: "Esta licencia requiere la app versión X.X. Actualiza la app."

## 9. Demo

### Contenido

- La app en modo Lite (30 registros máximo)
- Datos de prueba precargados (seed data en `demo-data.js`):
  - 15 productos
  - 10 clientes
  - 20 transacciones/movimientos
- El cliente abre la app y ya tiene datos — juega al instante

### Formatos de entrega

| Formato | Medio |
|---------|-------|
| `.apk` | Link WhatsApp / web |
| `.exe` | Link web |

### Conversión

Cuando el cliente quiere comprar:
1. Se genera su `.aha` con `/licencia`
2. Se le envía por WhatsApp o email
3. Lo copia a la carpeta de la app y lo carga desde Ajustes
4. **No necesita reinstalar** — la licencia desbloquea el plan

## 10. Demo Kit (delivery opcional)

Además de la demo por app individual, existe un "Demo Kit" que es un instalador único con datos de prueba de las 3 apps core (POS, Inventario, Citas) entrelazados.

Se genera igual que una app normal con `ENV='production'` y semilla de datos. El cliente juega con el kit completo y si le gusta, compra licencias individuales.

## 11. Estructura de archivos

```
keys/
├── private.pem          ← NO versionar. Backup manual.
├── public.pem           ← Versionar (se embebe en apps).

licencias/
├── historial.csv        ← Registro de todas las licencias emitidas
├── 2026-07-01/
│   └── ferreteria-el-clavo.aha
├── 2026-07-15/
│   └── taqueria-la-posta.aha
└── ...

scripts/
├── generate-keypair.js  ← Una vez, setup inicial
├── license.js           ← CLI: node scripts/license.js generate --plan ...

docs/superpowers/specs/
└── 2026-07-01-license-system-design.md  ← Este documento
```

## 12. Lo que queda fuera (diferido)

- **Revocación de licencias**: Sin internet no hay forma de invalidar una licencia ya emitida. Si es crítico en el futuro, agregar lista negra local que se actualice al abrir la app con conexión.
- **Machine ID binding**: Amarrar la licencia a un ID de hardware evita compartir archivos, pero añade fricción (el cliente debe enviar su ID para generar la licencia). Posible para Enterprise.
- **Trial por tiempo**: El Lite es permanente con 30 registros. No hay trial de 14 días porque la fecha del sistema se puede manipular.
