# Diagrama Completo - ChambeApp

## Archivo
`completo.puml` — Diagrama global de todas las entidades relacionadas del dominio.

## Contenido
Incluye los 10 módulos:
1. Identidad
2. KYC Documentos
3. Servicios (solicitudes, ofertas, contratos, ejecución)
4. Maranas (subcontratación)
5. Finanzas (wallet, pagos, monedas)
6. Negocios / Merchant
7. Comunicación (chat, notificaciones, presencia)
8. Gobernanza y auditoría
9. IA y recomendación

## Tablas eliminadas
Se eliminaron del completo las tablas sin relación FK con el dominio principal:
- `system_config`
- `migrations_log`
- `seed_data`
- `api_rate_limits`

Estas se documentan en el módulo 10 (Sistema y Utilidades).

## Cardinalidad (alas UML)
- `||` = exactamente uno (obligatorio)
- `o|` = cero o uno (opcional)
- `|{` = uno o muchos (obligatorio)
- `o{` = cero o muchos (opcional)

## Herencia
No existe herencia de tablas (joined / single-table / concrete). Todas las relaciones son asociación / composición mediante claves foráneas.

## Esquema SQL
`completo.sql.puml` — Esquema global con todos los índices y restricciones del dominio.
