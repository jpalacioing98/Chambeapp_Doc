# Modulo 10 - Sistema y Utilidades

## Diagrama
`sistema.puml` — Utilidades transversales del sistema (sin relación FK con el dominio principal).

## Entidades
- **system_config**: configuración global editable (valor JSON).
- **migrations_log**: historial de migraciones Alembic (éxito, checksum).
- **seed_data**: datos semilla por tabla y versión.
- **api_rate_limits**: límites de velocidad por endpoint y rol excluido.

## Por qué este diseño
- Tablas sin relaciones foráneas con el dominio; por eso se excluyen del diagrama `completo`.
- `system_config` permite cambiar parámetros sin despliegue.

## Esquema SQL
`sistema.sql.puml` — Claves primarias naturales (clave, versión, tabla, endpoint+método).
