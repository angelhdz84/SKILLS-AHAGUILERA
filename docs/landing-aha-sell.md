# AHAguilera × Ateje Stack — Estrategia de Venta

> Landing: https://angelhdz84.github.io/Identidad_AHA/
> Repo: `angelhdz84/Identidad_AHA`
> Autor: Angel Hernández Aguilera

---

## 1. Manifiesto

**¿Qué vendes?** Aplicaciones de escritorio (.exe) y móviles (.apk) que funcionan sin internet, sin servidores, sin mensualidades.

**¿Quién eres?** Angel Hernández Aguilera. Freelance. No vendes SaaS, vendes software que es propiedad del cliente desde el día uno.

**El trato:**

| Concepto | Lo que ofreces |
|----------|---------------|
| Pago | **Único.** Nunca mensualidad |
| Formatos | .exe (Windows) + .apk (Android) |
| Internet | Cero necesario |
| Datos | 100% locales, cifrados con AES-256 |
| Soporte | Tú tienes el código, la app es tuya |
| Precio | Según complejidad, no por usuario |

---

## 2. Ateje Stack — Tu ventaja competitiva

Cada app que vendes usa la misma base probada. No reinventas nada, solo construyes el módulo de negocio. Esto te da:

| Para ti (desarrollador) | Para tu cliente |
|------------------------|-----------------|
| Un solo código fuente | Una app que pesa ~5MB |
| Tres builds: .exe + .apk + ZIP web | No necesita instalar nada más |
| Librerías locales, sin CDNs | No depende de internet jamás |
| Misma UI en todos los formatos | Misma experiencia en PC y móvil |
| Cifrado por defecto | Sus datos son solo suyos |

### Stack completo traducido a beneficios de venta

| Tecnología | Le dices al cliente |
|------------|-------------------|
| **Alpine.js** | "La app responde al instante, como una app nativa" |
| **Dexie.js (IndexedDB)** | "Tus datos nunca suben a ningún servidor. Están en tu PC" |
| **CryptoJS AES-256** | "Ni yo puedo ver tus datos. Están cifrados localmente" |
| **Bun --compile** | "Un solo archivo .exe. Lo abres y funciona. No necesitas instalar Java, Node, ni nada" |
| **Bootstrap Icons** | "Interfaz moderna con iconos claros, sin depender de internet para cargarlos" |

### Lo que NO tienes que explicar

- No hay servidores que mantener
- No hay cuentas que crear
- No hay facturas mensuales
- No hay límite de usuarios
- No hay "se cayó el sistema"

---

## 3. Catálogo de verticales

No vendes apps fijas. Vendes **soluciones por vertical**. El cliente describe su problema, tú eliges los módulos que necesita.

| Vertical | Ejemplos de app | Módulos típicos |
|----------|----------------|-----------------|
| **Inventario** | Control de stock, almacén, bodega | Productos, movimientos, alertas, reportes PDF, escaneo |
| **Facturación** | Facturación offline, POS, comandas | RFC/catálogo, PDF, histórico, corte de caja |
| **CRM** | Agenda clientes, seguros, cobranza | Fichas, historial, notas, recordatorios, export CSV |
| **Gastos** | Finanzas personales, negocio pequeño | Categorías, gráficos, Excel export, presupuestos |
| **Logística** | Rutas, entregas, checklists | Órdenes, firmas digitales, fotos offline, GPS |
| **Salud** | Consultorio, pacientes, citas | Expedientes, recetas, agenda, historial clínico |
| **Educación** | Cursos offline, quizzes, progreso | Lecciones, ejercicios, calificaciones, reportes |
| **Campo** | Cosecha, ganado, insumos | Registro diario, lotes, alertas de stock |
| **Servicio** | Órdenes de trabajo, garantías | Clientes, equipos, diagnóstico, historial |
| **Construcción** | Presupuestos, materiales, avance | Obra, insumos, fotos de avance, reportes |

---

## 4. Modelo de precios

| Nivel | Precio USD | Incluye |
|-------|-----------|---------|
| **Lite** | $49 | 1 módulo, solo .exe, datos sin cifrar |
| **Standard** | $99 | Hasta 3 módulos, .exe + .apk, cifrado AES-256, gráficos + exportación PDF |
| **Custom** | $199+ | Todo lo anterior + UI personalizada + código fuente + empaquetado white-label |

Reglas:
- Precio base. Complejidad adicional (API externa, integración hardware scanner, etc.) = proporcional
- Sin regateo. Sin descuentos. Precio justo, una vez.
- El código fuente se entrega solo en Custom — es parte del valor.
- El .exe + .apk de Lite y Standard son funcionales completos, pero sin acceso al source.

---

## 5. Estructura de la landing

La landing actual https://angelhdz84.github.io/Identidad_AHA/ ya tiene la estructura correcta. Este es el orden y propósito de cada sección:

### Hero
- Titular bilingüe fuerte: "Normal software ties you down. Mine sets you free."
- Comparación directa: 4 puntos de dolor vs 4 beneficios
- CTA principal: WhatsApp

### Productos / Verticales
- Cards con icono + nombre + descripción + etiqueta de categoría
- Cada card lleva a WhatsApp con mensaje pre-llenado
- Al final: CTA para desarrollo a medida

### Pricing
- 3 tarjetas: Lite / Standard / Custom
- POPULAR badge en Standard
- Features checklist por tier
- CTA por tier

### Cómo funciona
- 4 pasos: Cuentas → Construyo → Empaqueto → Entrego
- Visual: icono + título + descripción bilingüe

### Stack técnico
- Cards hover con tecnología + descripción del beneficio
- NO pongas nombres técnicos sin traducción al beneficio

### Tabla comparativa
- Offline-first vs Tradicional
- 7 filas: Internet, Costo, Velocidad, Privacidad, Instalación, Uptime, Propiedad de datos

### FAQ
- Preguntas reales de clientes
- Formato acordeón (una se expande a la vez)
- Bilingüe

### About + CTA final
- Bio corta + foto/avatar
- Skills badges
- CTA: WhatsApp + Email

---

## 6. Mejoras sugeridas para la landing

### Alta prioridad

| Mejora | Por qué |
|--------|---------|
| **WhatsApp real** | Los placeholders `521XXXXXXXXXX` están en toda la landing. Poner el número real activa las conversiones |
| **Screenshots de apps** | Una imagen de InventarioPRO o FacturaExpress funcionando vale más que mil palabras. Captura mockups o fotos reales |
| **Meta tags OG** | `og:title`, `og:description`, `og:image` para que se vea bien al compartir en WhatsApp/Redes |
| **Analytics sin tracker** | Contar visitas con un contador offline-friendly o al menos verificar con Lighthouse que no haya fugas |

### Media prioridad

| Mejora | Implementación |
|--------|---------------|
| **Demo animada** | GIF o video corto mostrando una app funcionando offline |
| **Testimonios** | "Compré InventarioPRO para mi ferretería y dejé de perder stock" |
| **Favicon** | El logo AHA como favicon |
| **Google Analytics no** | Si pones analytics, que sea Plausible o umami (auto-hosted). Sin trackers de Google |
| **Enlaces a cada app** | Cada app podría tener su propia página de detalle (o sección expandible) con features, screenshots, video |

### Baja prioridad / futuro

| Mejora | Notas |
|--------|-------|
| **Blog** | Casos de uso, tutoriales de las apps |
| **Video embed** | "Cómo instalé mi app en 2 minutos" |
| **Dark mode toggle** | Ya es oscura, pero un toggle light/dark suma |
| **PWA** | La landing misma podría ser instalable |
| **Multi-idioma completo** | Selector ES/EN en vez de contenido duplicado inline |

---

## 7. Cómo mantener la landing

### Añadir un nuevo producto/vertical

1. En el HTML, localizar la sección de productos (buscar `APPS LISTAS PARA LLEVAR`)
2. Duplicar un bloque `article` de producto existente
3. Cambiar: título, descripción, categoría, enlace WhatsApp
4. Si hay screenshot: añadir `<img>` dentro del card

### Actualizar precios

1. Localizar la sección de pricing (buscar `PRECIOS PRICING` o `Inversión clara`)
2. Modificar el monto en cada tier
3. Si cambian features, editar los `<li>` dentro de cada card

### Modificar el stack

1. Localizar la sección de stack (buscar `STACK TÉCNICO TECH STACK`)
2. Cada tecnología es un `article` con hover card
3. Cambiar nombre, descripción o icono según corresponda

### Publicar cambios

```bash
# La landing está en repo separado: angelhdz84/Identidad_AHA
cd /ruta/a/Identidad_AHA
git add .
git commit -m "feat: nuevo producto [nombre] o fix: [cambio]"
git push origin main
# GitHub Pages despliega automáticamente
```

---

## 8. Argumentos de venta — Frases lista para WhatsApp

| Situación | Respuesta |
|-----------|-----------|
| "¿Cuánto cuesta al mes?" | "Nada. Pagas una sola vez y la app es tuya para siempre" |
| "¿Y si pierdo internet?" | "La app funciona sin internet. Tus datos están en tu PC, no en la nube" |
| "¿Y si se me daña el equipo?" | "Sacas tu backup cifrado, lo pones en la PC nueva y sigues trabajando" |
| "¿Puedo tenerla en mi celular también?" | "Sí. La misma app la convierto en .apk para Android. Mismos datos, sincronizados" |
| "¿Necesito pagar por cada usuario?" | "No. La pagas una vez y la usan los que quieras" |
| "¿Qué pasa si necesito cambios después?" | "Te los cotizo. Pero como tienes la app, si es Custom puedes modificarla tú mismo" |
| "¿Es seguro?" | "Tus datos se cifran con el mismo estándar que usan los bancos: AES-256" |
| "¿Y si no me gusta?" | "Te muestro un demo funcional antes de que pagues. Sin riesgo" |

---

## 9. Checklist de pre-lanzamiento de cada app

Antes de poner una app nueva en venta:

- [ ] Probar en modo file:// (doble clic en index.html)
- [ ] Probar build .exe (Bun --compile)
- [ ] Probar build .apk (push a GitHub → Actions)
- [ ] Verificar cifrado funcional en datos sensibles
- [ ] Verificar export backup (.ateje-backup) funcional
- [ ] Probar import backup en otro dispositivo
- [ ] Tomar screenshot / mockup para la landing
- [ ] Redactar descripción: problema + solución + features
- [ ] Generar enlace WhatsApp con mensaje pre-llenado
- [ ] Commit + push a la landing

---

## 10. Referencias

| Recurso | URL |
|---------|-----|
| Landing actual | https://angelhdz84.github.io/Identidad_AHA/ |
| Repo landing | `https://github.com/angelhdz84/Identidad_AHA` |
| WhatsApp API | `https://wa.me/521NUMERO?text=...` |
| Ateje Stack (meta-repo) | `https://github.com/angelhdz84/SKILLS-AHAGUILERA` |
| Docs Ateje Stack | `D:\REPOSITORIOS GitHUB\Ateje\docs\guia-skills-mcps.html` |
