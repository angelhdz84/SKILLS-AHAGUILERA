# 📚 Documentacion del Stack Ateje — Snapshot 2026-08-05

> **Fecha:** 2026-08-05
> **Repo:** `github.com/angelhdz84/SKILLS-AHAGUILERA.git`
> **Proposito:** Guias resumidas y actualizadas al estado actual del repo. Solo lo necesario para entender y usar el stack.

---

## Indice

| Documento | Que contiene |
|-----------|-------------|
| [📜 RESUMEN-HISTORIA-COMPLETA.md](./RESUMEN-HISTORIA-COMPLETA.md) | Historia completa del repo (150 commits) + sesion actual |
| [🏗️ FUNCIONAMIENTO-DEL-REPO.md](./FUNCIONAMIENTO-DEL-REPO.md) | Estructura, perfiles, comandos, code-review-engine, instalacion global, CI/CD, tests |
| [🧠 IA-JUTIA.md](./IA-JUTIA.md) | Mini IA offline-first: perfiles Lite/Full+, API, arquitectura plugin |
| [📱 AHAPP.md](./AHAPP.md) | Que es una AHApp, estructura de la app generada, core API, modulos |
| [🔀 TRANSVERSALES.md](./TRANSVERSALES.md) | Apps transversales, 8 verticales, kits, modulos compartidos |
| [🚀 CREAR-NUEVAS-APPS.md](./CREAR-NUEVAS-APPS.md) | Como crear apps nuevas con ejemplos paso a paso (`/new`, `/pro`, `/build`, `/review`) |

---

## ⭐ Novedad de esta fecha: code-review-engine v1.0

El 2026-08-05 se creo la skill **code-review-engine**: revision continua de codigo en **4 ejes** (Compliance, Calidad, Spec, Brand) con dos subagentes en paralelo (`review-agent` + `spec-reviewer`), auto-fix con confirmacion y comando `/review` para diffs git.

**Ya esta operativa:** junction global creada, agents registrados en `opencode.json`, auto-trigger en `code-generator`, tests 5/5 verdes.

---

## Archivos fuente (docs/ raiz)

- `docs/guia-estudio-ateje.md` — guia de estudio completa (24 secciones)
- `docs/stack-completo.md` — documentacion completa de referencia
- `docs/IA_Jutia_Mejorada.md` — SDD detallado de IA Jutia
- `docs/tutorial-crear-ahapp.md` — tutorial extendido de creacion de apps
- `docs/API.md` — API reference (auto-generado con `/docs-gen`)
- `docs/stack-versiones.md` — reporte de versiones de librerias
