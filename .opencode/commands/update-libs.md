```skills
stack-compliance-guard
```

Lee `stack-versions.json` (fuente central de versiones), consulta las últimas versiones disponibles en npm, compara con las versiones pinneadas y muestra un reporte. Opcionalmente actualiza las versiones y regenera los archivos de setup.

## Uso

```
/update-libs          → Solo verificación (readonly)
/update-libs apply    → Verifica y aplica actualizaciones
/update-libs alpinejs → Verifica solo Alpine.js
```

## Flujo

1. Leer `stack-versions.json` de la raíz del proyecto
2. Para cada librería con `npm` definido, consultar `registry.npmjs.org/{package}/latest`
3. Comparar `pinned` vs `latest` y clasificar: current / patch / minor / major
4. Mostrar tabla con colores: ✅ green, 🟡 yellow, 🔴 red
5. Si el usuario incluye `apply`, escribir las versiones actualizadas en `stack-versions.json` y actualizar `updated` con la fecha ISO
6. Recordar al usuario que debe ejecutar `/setup` para regenerar los archivos de instalación con las nuevas versiones

## Reglas

- NO actualizar versiones automáticamente sin confirmación explícita (`apply`)
- NO marcar como actualizada una librería si no se pudo verificar (npm timeout)
- Si una librería tiene `breaking: true`, mostrar advertencia roja [BREAKING]
- Si una librería tiene `status: legacy` o `deprecated`, mostrar su `alternative` si existe
- Si hay cambios, sugerir ejecutar `/setup` para regenerar scripts de descarga

## Output esperado

```
🔍 STACK ATEJE - VERIFICADOR DE VERSIONES
   2026-07-08 14:30

✅ Alpine.js    3.14.1 → 3.15.12  (minor)
🔴 Tailwind CSS 2.2.19 → 4.3.2   (major) [BREAKING]
🟡 DaisyUI      4.12.10 → 5.6.14 (major)
✅ Dexie.js     4.0.8 → 4.4.4    (minor)
💤 CryptoJS     4.2.0 → 4.2.0    (legacy)
  ...

  ✅ Actuales: 3  |  🟠 Patch: 1  |  🟡 Minor: 2  |  🔴 Major: 3
  💤 Legacy: 2  |  ⚠️ Deprecated: 1

📋 Alternativas disponibles:
  CryptoJS → Web Crypto API (esfuerzo Alto)
  QRCode.js → qrcode npm (esfuerzo Bajo)
```

## Archivos modificados

- `stack-versions.json` — solo si se usa `apply`
