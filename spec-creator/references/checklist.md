# 📋 Checklist de Autovalidación

> Verifica cada punto antes de generar la spec final. Todos deben estar marcados ✅

---

## 🎯 Requisitos Offline-First

- [ ] **Sin servidor requerido** — La app funciona 100% en browser
- [ ] **Sin API externa** — Datos locales only (IndexedDB)
- [ ] **Sin cuenta/registro** — Uso inmediato sin login

---

## 💻 Tecnologías Permitidas

- [ ] **CDN globals** — No ES6 imports, usar CDN (cdnjs, unpkg, etc.)
- [ ] **Librerías offline-first**: Dexie, CryptoJS, pako, Alpine.js, TailwindCSS, DaisyUI
- [ ] **Iconos**: Bootstrap Icons (CDN)
- [ ] **Gráficos**: ApexCharts (CDN)

---

## 🔐 Seguridad

- [ ] **Campos sensibles cifrados** — password, token, datos personales
- [ ] **Clave en localStorage** — No hardcodeada en código
- [ ] **Sin credentials en código** — .env no se sube al repositorio
- [ ] **Validación de entrada** — Sanitizar inputs del usuario

---

## 🖼️ UI/UX

- [ ] **DaisyUI incluido** — Framework CSS utilizado
- [ ] **Bootstrap Icons** — Iconos vía CDN
- [ ] **Mobile-first** — Diseño responsive
- [ ] **Modo oscuro/claro** — Persistente en localStorage
- [ ] **Animaciones** — fadeInUp, slideIn, etc.

---

## ⚙️ Configuración

- [ ] **project.config.js** — Archivo de configuración existe
- [ ] **Módulos registrables** — Todos los features pueden habilitarse/deshabilitarse
- [ ] **Tema configurable** — Colores, fuentes ajustables

---

## 📦 Entregables

- [ ] **ZIP auto-contenido** — Todo en un archivo
- [ ] **index.html ejecutable** — Doble click para abrir
- [ ] **GUIA_USUARIO.md** — Documentación incluida
- [ ] **Backup manual** — Export a JSON/PDF

---

## 🔧不走 (No hacer)

- [ ] **No asumir servidor** — No mentioning backend/APIs
- [ ] **No asumir internet** — Offline funciona
- [ ] **No login requerido** — Sin auth externo
- [ ] **No DB externa** — Solo IndexedDB local