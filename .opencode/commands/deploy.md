---
name: deploy
description: Publica cambios a GitHub + empaqueta segun perfil
trigger: publicar
---

Ejecuta el trigger `publicar`. Activa deployment-jigue: diagnostico -> commit -> push -> empaquetado (ZIP para Lite, .exe para Full) -> deploy a GitHub Pages. Pide confirmacion antes de push.
