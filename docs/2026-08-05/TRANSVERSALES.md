# 🔀 Transversales — Apps y Modulos que se Reutilizan en Todos los Verticales

> **Actualizado:** 2026-08-05
> **Concepto:** Hay piezas del stack que aparecen en **TODOS** los verticales de negocio. Son las que construyes una vez y reutilizas en cada kit.

---

## 1. Las 2 Apps Transversales

| App | Rol | Por que es transversal |
|-----|-----|----------------------|
| **AHA Gastos** 💰 | Control financiero (ingresos, egresos, categorias, presupuestos, reportes PDF) | Todo negocio necesita controlar su dinero |
| **AHA Contactos** 📱 | CRM manual + plantillas WhatsApp + recordatorios | Universal para gestionar clientes/proveedores |

**Regla de construccion:** construyelas **primero** (semanas 1-2), porque se usan en los 8 kits.

---

## 2. Apps mas Versatiles (aparecen en 5+ verticales)

| App | Verticales |
|-----|-----------|
| **AHA Asistencia** | Gastronomia, Belleza, Construccion, Campo, Logistica (5) |
| **AHA PreFactura** | Comercio, Salud, Construccion, Logistica, Oficina (5) |
| **AHA Inventario** | Comercio, Gastronomia, Campo (3) |
| **AHA CRM** | Belleza, Oficina (2) |
| **AHA Checklist** | Construccion, Logistica (2) |

## 3. Apps Especializadas (1-2 verticales)

| App | Vertical |
|-----|----------|
| AHA Rx | Solo Salud |
| AHA Obra | Solo Construccion |
| AHA Comanda | Solo Gastronomia |
| AHA Campo | Campo + Construccion |
| AHA Flota | Logistica + Campo + Construccion |

---

## 3. Las 8 Verticales de Negocio + Kits

| Vertical | App Estrella | Target | Kit sugerido | Precio |
|----------|-------------|--------|--------------|--------|
| **Comercio y Retail** | AHA POS | Ferreterias, abarrotes, tiendas | POS + Inventario + PreFactura + Gastos + Contactos | $299 |
| **Gastronomia** | AHA Comanda | Restaurantes, bares, cafeterias | Comanda + POS + Inventario + Gastos + Asistencia | $349 |
| **Belleza y Servicios** | AHA Citas | Barberias, salones, spas | Citas + Contactos + Gastos + Asistencia | $249 |
| **Salud y Consultorios** | AHA Rx | Medicos, dentistas, farmacias | Rx + Citas + PreFactura + Contactos + Gastos | $299 |
| **Construccion y Obra** | AHA Obra | Constructores, contratistas | Obra + Checklist + Campo + PreFactura + Gastos | $449 |
| **Campo y Agro** | AHA Campo | Agricultores, ranchos, cooperativas | Campo + Inventario + Flota + Gastos | $349 |
| **Logistica y Transporte** | AHA Flota | Flotillas, mensajerias | Flota + Asistencia + Checklist + Gastos | $349 |
| **Oficina y Freelancers** | AHA CRM | Contadores, abogados, freelancers | CRM + Contactos + PreFactura + Gastos | $249 |
| **Desarrollo** 🧪 | AHA Base | Prototipado y desarrollo | Base (gratuito) | $0 |

---

## 4. Catalogo Completo de las 14 Apps de Negocio

| # | App | Descripcion | Modulos Clave |
|---|-----|-------------|---------------|
| 1 | **AHA Inventario** | Stock, entradas/salidas, alertas stock minimo, lotes, codigos de barras | usuarios, inventario, dashboard, configuracion |
| 2 | **AHA Comanda** | Pedidos en mesa, pantalla cocina, impresora termica, pagos | usuarios, comandas, inventario, dashboard, configuracion |
| 3 | **AHA CRM** | Clientes, pipeline, actividades, reportes de ventas | usuarios, crm, dashboard, configuracion, citas |
| 4 | **AHA Checklist** | Listas de verificacion, auditorias, inspecciones con fotos y firmas | usuarios, checklist, dashboard, configuracion, campo |
| 5 | **AHA Asistencia** | Control horario, geolocalizacion, turnos, excepciones | usuarios, asistencia, dashboard, configuracion, flota |
| 6 | **AHA Citas** | Agenda, reservas, recordatorios, disponibilidad real-time | usuarios, citas, crm, dashboard, configuracion |
| 7 | **AHA Gastos** | Ingresos, egresos, categorias, reportes PDF | usuarios, contabilidad, dashboard, configuracion |
| 8 | **AHA Contactos** | CRM manual, plantillas WhatsApp, recordatorios | usuarios, contactos, dashboard, configuracion |
| 9 | **AHA Campo** | Formularios offline, GPS, fotos, sincronizacion diferida | usuarios, campo, inventario, checklist, flota, dashboard, configuracion |
| 10 | **AHA POS** | Punto de venta, tickets, caja, arqueo, promociones | usuarios, inventario, comandas, dashboard, configuracion, prefactura |
| 11 | **AHA Rx** | Recetas medicas, dispensacion, historial, alertas interacciones | usuarios, rx, dashboard, configuracion |
| 12 | **AHA Flota** | Vehiculos, mantenimiento, rutas, consumo combustible, conductores | usuarios, flota, asistencia, dashboard, configuracion, campo |
| 13 | **AHA Obra** | Proyectos, partidas, avances, materiales, certificaciones | usuarios, obra, inventario, checklist, campo, flota, dashboard, configuracion, prefactura |
| 14 | **AHA PreFactura** | Presupuestos, albaranes, facturacion, series, impuestos | usuarios, prefactura, crm, dashboard, configuracion |

**Niveles comerciales:** Inicio (Lite) / Profesional (Professional) / Enterprise (Business).

---

## 5. Modulos Compartidos Reales (en `modules/apps/`)

El repo contiene **70+ modulos ya implementados** organizados por vertical, listos para reutilizar como base de nuevas apps:

| Vertical | App | Modulos |
|----------|-----|---------|
| comercio | pos | corte, devoluciones, productos, reportes, ventas |
| comercio | inventario | ajustes, movimientos, productos, reportes |
| gastronomia | comanda | cuentas, menu, mesas, pedidos |
| belleza | citas | agenda, calendario, clientes, servicios |
| salud | rx | historial, medicamentos, pacientes, recetas |
| construccion | obra | dashboard-obra, etapas, materiales, personal, reportes |
| construccion | checklist | items, listas, plantillas, reportes |
| finanzas | gastos | categorias, presupuestos, reportes, transacciones |
| finanzas | prefactura | clientes, cotizaciones, facturas, plantillas |
| logistica | flota | combustible, mantenimiento, rutas, vehiculos |
| oficina | contactos | directorio, etiquetas, grupos |
| oficina | crm | contactos, cotizaciones, facturacion, pipeline |
| personal | asistencia | checkin, personal, reportes |
| campo | campo-app | cosechas, cultivos, insumos, lotes |
| ia | ia-jutia | busqueda, chat, ocr |

Cada modulo tiene `.metadata.json` con su contrato de tabla Dexie.

---

## 6. Patron de Reutilizacion

```
Quiero construir un KIT de ferreteria:
  AHA POS (estrella)      → usa modulos pos/{ventas,corte,productos}
  AHA Inventario          → usa modulos inventario/{productos,movimientos,ajustes}
  AHA PreFactura          → usa modulos prefactura/{facturas,cotizaciones,clientes}
  AHA Gastos (transversal)→ usa modulos gastos/{transacciones,categorias,presupuestos}
  AHA Contactos (transversal) → usa modulos contactos/{directorio,etiquetas,grupos}
```

Los modulos transversales (`usuarios`, `dashboard`, `configuracion`, `gastos`, `contactos`) se copian una vez y se reutilizan en cada app del kit sin re-escribir logica.

---

## 7. Orden de Construccion Recomendado

1. **AHA Gastos** (transversal — semana 1)
2. **AHA Contactos** (transversal — semana 2)
3. **AHA POS + AHA Inventario + AHA PreFactura** (Vertical Comercio — semanas 3-4)
4. **AHA Comanda** (Vertical Gastronomia — semana 5)
5. **AHA Citas** (Vertical Belleza — semana 6)
6. **AHA Rx + AHA CRM** (semanas 7-8)
7. **AHA Obra + AHA PreFactura** (semana 9)
8. **AHA Campo + AHA Flota + AHA Asistencia + AHA Checklist** (semanas 10-12)
