# Modulo 2 - KYC Documentos

## Diagrama
`kyc.puml` — Modelo de documentos de identificación (Know Your Customer).

## Entidades
- **kyc_required_documents**: catálogo de documentos exigibles por rol (grupo, obligatorio, orden).
- **user_kyc_documents**: instancias subidas por el usuario (MinIO URL, hash SHA-256, estado, revisado por).

## Relaciones y cardinalidad
- `users` 1:N `user_kyc_documents` — un usuario sube muchos documentos.
- `kyc_required_documents` 1:N `user_kyc_documents` — un tipo de documento tiene muchas instancias.
- `users` N:1 `user_kyc_documents` (revisado_por) — verificador asignado.

## Por qué este diseño
- `hash_sha256` garantiza integridad y no repudio de los documentos.
- `multi_instancia` permite varios archivos del mismo tipo (ej. múltiples cédulas).
- `rol_aplicable` define qué roles deben presentar cada documento.

## Esquema SQL
`kyc.sql.puml` — Índices en `user_kyc_documents(user_id, documento_clave)`.
