# 📄 Especificación: [Nombre]

## 🎯 Historia de Usuario
[Descripción clara del problema del usuario - qué necesita, por qué,para quién]

## ✅ Criterios de Aceptación (Gherkin)
- **Escenario 1**: [Nombre]
  - Dado que [condición inicial]
  - Cuando [acción del usuario]
  - Entonces [resultado esperado]

- **Escenario 2**: [Nombre]
  - Dado que [condición inicial]
  - Cuando [acción del usuario]
  - Entonces [resultado esperado]

## 🧱 Arquitectura y Módulos
- **Tipo**: SPA hash-based
- **Router**: core/app.js
- **Módulos**: [lista de módulos registrables en project.config.js]
- **Datos**: IndexedDB vía Dexie (sin JOINs complejos)

## 🔐 Seguridad y Datos
- **Cifrado**: [Campo sensible] cifrado con CryptoJS
- **Clave**: Almacenada en localStorage (no en código)
- **Validación**: Formularios con feedback inmediato en español

## 🎨 UI/UX y Animaciones
- **Enfoque**: Mobile-first
- **Tema**: Modo oscuro/claro persistente
- **Animaciones**: fadeInUp para transiciones
- **UI**: DaisyUI + Bootstrap Icons
- **Colores**: [definir paleta si aplica]

## ⚙️ Configuración
- Todos los módulos activables/desactivables en `project.config.js`
- Exportación: JSON/PDF comprimido con pako si >1MB

## 📦 Entregables
- Web (ZIP) con todos los assets
- `index.html` ejecutable sin servidor
- `GUIA_USUARIO.md`