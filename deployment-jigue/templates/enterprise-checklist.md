# Enterprise Delivery Checklist

> Proyecto: **[AppName]**
> Cliente: **[Cliente]**
> Fecha: **[Fecha]**
> Perfil: **Full** (.exe + .apk + fuente completa)

---

## 0. White-Label habilitado

- [ ] `brand.config.json` generado (o creado desde el panel de branding)
- [ ] `core/brand-loader.js` incluido en el build
- [ ] `core/feature-flags.js` incluido en el build
- [ ] Colores, logo y nombre de cliente verificados en la UI
- [ ] Archivo de licencia `.aha` con `canWhiteLabel: true`

## 1. Branding aplicado

- [ ] Nombre de app reemplazado en `project.config.js`
- [ ] Colores (primario/secundario/acento) aplicados en `core/theme.js`
- [ ] Logo personalizado en `assets/logo.*`
- [ ] `favicon.ico` personalizado
- [ ] `index.html` title, meta tags, h1 actualizados
- [ ] `neutralino.config.json` applicationId actualizado
- [ ] `capacitor.config.json` appId actualizado
- [ ] `package.json` name actualizado
- [ ] `manifest.json` name/short_name actualizados

## 2. Compilacion verificada

- [ ] `neu build --release` exitoso (.exe)
- [ ] `npx cap sync android` exitoso
- [ ] `cd android && ./gradlew assembleRelease` exitoso (.apk)
- [ ] .exe probado en Windows (doble clic, ventana nativa)
- [ ] .apk instalado en dispositivo Android (API 26+)
- [ ] Plugins nativos: SQLite, cámara, GPS, notificaciones, compartir
- [ ] Datos offline: crear/leer/actualizar/borrar funcionan

## 3. Documentacion generada

- [ ] `docs/GUIA_USUARIO.md` — manual de usuario personalizado
- [ ] `docs/GUIA_INSTALACION.md` — cómo instalar .exe / .apk
- [ ] `docs/GUIA_DESARROLLO.md` — cómo modificar la app (código fuente)
- [ ] `README.md` personalizado con nombre del cliente

## 4. Assets de entrega

- [ ] `dist/[app]-win_x64.zip` — .exe portable (~2MB)
- [ ] `android/app/build/outputs/apk/release/app-release.apk` — APK firmado
- [ ] Código fuente completo en `src/` (si aplica)
- [ ] `dist/[app]-branded-v1.0.zip` — paquete white-label listo
- [ ] Script `brand.ps1` personalizado para el cliente

## 5. Opcionales Enterprise

- [ ] GitHub Pages: `https://[org].github.io/[repo]`
- [ ] GitHub Release creado con .exe + .apk
- [ ] GitHub Actions CI/CD configurado
- [ ] Repositorio privado (si aplica)
- [ ] Whitelabel SDK documentation
- [ ] Capacitacion/Uso guiado

---

## Notas de entrega

```
Version:     1.0.0
Perfil:      Full
Componentes: [listar modulos activos]
IA Jutia:    [Lite/Full/No]
Storage:     Dexie + [sql.js WASM / SQLite nativo Capacitor]
```

---

*Generado por Ateje Stack — deployment-jigue enterprise-checklist*
