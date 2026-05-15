# Componentes Pines — Stack Offline-First

Componentes Alpine.js + Tailwind CSS tomados de [Pines](https://devdojo.com/pines) (MIT), adaptados para el stack offline-first.

## Requisitos

- Alpine.js (cargado desde `../assets/` o vía CDN local)
- Tailwind CSS (play CDN o compilado)

## Uso

1. Abre el componente deseado en `pines/` o `marketing/`
2. Copia el contenido del `<div>` con `x-data`
3. Pégalo en tu HTML (asegúrate de que Alpine.js esté cargado)
4. Ajusta datos y texto según tu app

Los componentes usan **Tailwind nativo** (no DaisyUI). Se integran con DaisyUI si conviertes clases:
- `bg-white` → `bg-base-100`
- `text-gray-900` → `text-base-content`
- `border-neutral-200` → `border-base-300`

## Componentes disponibles

Ver `pines/` para componentes UI y `marketing/` para secciones de landing.
