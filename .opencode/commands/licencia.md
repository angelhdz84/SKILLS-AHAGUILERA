---
name: licencia
description: Genera archivos de licencia .aha firmados
trigger: licencia
---

Ejecuta `scripts/license.js` para generar archivos .aha con doble seguridad (RSA + AES).

Subcomandos:
- `generar`: crea una licencia nueva. Pregunta plan (L/P/E), app(s), datos del cliente. Output en `licencias/[fecha]/[negocio].aha`
- `generar --kit [vertical]`: genera licencia para un kit completo de vertical.
- `--help`: muestra ayuda completa

El archivo .aha contiene: ID único (AHA-L/P/E-{napps}-{fecha}-{hora}), datos del cliente, apps licenciadas con plan, firma RSA, encriptación AES.

Registry: cada licencia se anota en `licencias/historial.csv`.

Ver spec completa en `docs/superpowers/specs/2026-07-01-license-system-design.md`
