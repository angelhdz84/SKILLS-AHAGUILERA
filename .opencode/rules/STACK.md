# Stack offline-first (no negociable)

## Reglas comunes (ambos perfiles)

- ✅ Variables globales (`Alpine`, `Dexie`, `CryptoJS`) para reactividad
- ✅ `cryptoHelpers.encrypt()` en campos sensibles (CryptoJS en ambos)
- ✅ UI: DaisyUI + Bootstrap Icons + Animate.css en español
- ❌ CDNs en runtime — todo local en `assets/` o vía npm bundle
- ❌ Fetch/axios para datos — usar Dexie (IndexedDB local)
- ✅ Todo en español (UI, comentarios, docs)

## Perfil Lite (file://)

- ❌ `import`/`export`/`type="module"` — CORS en `file://` bloquea ES6 modules
- ❌ Build steps — la app se abre con doble clic en `index.html`
- ✅ Librerías en `assets/js/libs/` vía curl
- ✅ Service Worker para PWA opcional

## Perfil Full (Bun --compile .exe)

- ✅ `import`/`export` permitido dentro de `src/` (Bun maneja bundling)
- ❌ `import` NO permitido en `public/` (código frontend, mismo que Lite)
- ✅ Build: `bun build --compile ./src/index.js --outfile dist/app.exe`
- ✅ Dependencias vía `bun add` (npm)
- ✅ Mismo frontend que Lite en `public/` (Alpine + Dexie + CryptoJS + DaisyUI)
- Opcional: SQLite backend vía `Bun.sqlite` para sync/app data pesada
