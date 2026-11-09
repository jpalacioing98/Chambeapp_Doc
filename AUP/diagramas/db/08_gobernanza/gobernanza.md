# Modulo 8 - Gobernanza y Auditoria

## Diagrama
`gobernanza.puml` — Capa de control, auditoría, disputas, tickets y moderación.

## Entidades
- **audit_logs**: log inmutable de acciones (actor, entidad, diff JSON, IP, user-agent).
- **disputes**: disputa sobre un contrato (iniciada/resuelta por usuarios, resolución informativa).
- **tickets**: ticket de soporte/reclamo (prioridad, estado, asignado).
- **moderacion_contenido**: moderación de entidades reportadas (motivo, acción, moderador).
- **region_scoping**: permiso de admin sobre una región (lectura/escritura/admin).

## Relaciones y cardinalidad
- `users` 1:N `audit_logs` — actor de cada acción auditada.
- `contracts` 1:N `disputes`; `users` 1:N `disputes` (inicia, resuelve opcional).
- `users` 1:N `tickets` — abre tickets; asignado opcional.
- `users` 2×1:N `moderacion_contenido` (reportado por, moderado por).
- `users` 1:N `region_scoping`; `regions` 1:N `region_scoping` (PK compuesta).

## Por qué este diseño
- `audit_logs` con `snapshot_diff_json` ofrece trazabilidad regulatoria sin versionar cada tabla.
- La plataforma no retiene ni congela fondos: resolución de disputas es informativa.
- `region_scoping` permite operación multiregión con personal acotado por zona.

## Esquema SQL
`gobernanza.sql.puml` — Índices en auditoría, disputas y tickets por usuario/estado/fecha.
