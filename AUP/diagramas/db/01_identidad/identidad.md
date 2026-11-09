# Modulo 1 - Identidad y Autenticacion

## Diagrama
`identidad.puml` — Modelo relacional del núcleo de usuarios.

## Entidades
- **users**: cuenta de acceso (email, password_hash, rol, estado, versión de rol, región).
- **profiles**: datos públicos y profesionales (habilidades, calificación, geolocalización PostGIS, plan).
- **roles**: catálogo de roles (pds, solicitante, merchant, verificador, soporte, admin, superadmin).
- **regions**: división regional (clave DANE, departamento, cobertura).
- **user_sessions**: sesiones activas (refresh token, dispositivo, IP, expiración, revocación).
- **legal_acceptances**: trazabilidad clickwrap de Términos y Condiciones.
- **verifications**: verificaciones unificadas con discriminador `tipo` (KYC, EMAIL, PHONE, IDENTITY).

## Relaciones y cardinalidad
- `users` 1:1 `profiles` — separa credenciales de datos públicos.
- `roles` 1:N `users` — RBAC con `role_version` para revocación de tokens.
- `regions` 1:N `users` — acota operaciones del personal a una región.
- `users` 1:N `user_sessions` — control de sesiones por dispositivo.
- `users` 1:N `legal_acceptances` — aceptación de términos.
- `users` 1:N `verifications` — verificaciones de identidad/contacto.
- `users` N:1 `verifications` (revisado_by) — verificador que aprueba/rechaza.

## Por qué este diseño
- Tabla `verifications` unificada evita duplicar `verifications` + `user_verifications`.
- `role_version` permite invalidar tokens al cambiar de rol o suspender cuenta.
- `geom` PostGIS en `profiles` para búsquedas de proximidad.
- No hay herencia de tablas; todo es asociación mediante claves foráneas.

## Esquema SQL
`identidad.sql.puml` — Incluye tipos, valores por defecto e índices (`users(email, username, region_id, status)`, `verifications(user_id, status, created_at)`).
