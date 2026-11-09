# AUP - Modelo de Datos ChambeApp

Estructura organizada por módulos con diagramas UML relacionales (PlantUML), explicaciones y esquemas SQL.

## Estructura

```
AUP/
└── diagramas/
    └── db/
        ├── 01_identidad/       # identidad.puml + identidad.md + identidad.sql.puml
        ├── 02_kyc/             # kyc.puml + kyc.md + kyc.sql.puml
        ├── 03_servicios/       # servicios.puml + servicios.md + servicios.sql.puml
        ├── 04_maranas/         # maranas.puml + maranas.md + maranas.sql.puml
        ├── 05_finanzas/        # finanzas.puml + finanzas.md + finanzas.sql.puml
        ├── 06_negocios/        # negocios.puml + negocios.md + negocios.sql.puml
        ├── 07_comunicacion/    # comunicacion.puml + comunicacion.md + comunicacion.sql.puml
        ├── 08_gobernanza/      # gobernanza.puml + gobernanza.md + gobernanza.sql.puml
        ├── 09_ia/              # ia.puml + ia.md + ia.sql.puml
        ├── 10_sistema/         # sistema.puml + sistema.md + sistema.sql.puml
        └── completo/           # completo.puml + completo.md + completo.sql.puml
```

Cada carpeta de módulo contiene:
- **`.puml`**: diagrama UML relacional con alas (Crow's Foot) y cardinalidad.
- **`.md`**: explicación de entidades, relaciones y por qué del diseño.
- **`.sql.puml`**: esquema SQL con tipos, defaults, índices y restricciones.

## Modulos

| # | Modulo | Entidades principales |
|---|--------|----------------------|
| 01 | Identidad | users, profiles, roles, regions, user_sessions, legal_acceptances, verifications |
| 02 | KYC | kyc_required_documents, user_kyc_documents |
| 03 | Servicios | solicitudes, ofertas, contracts, contract_execution, adendas, evidencias, hitos, ratings_solicitud, contract_checkins |
| 04 | Maranas | maranas, ofertas_marana |
| 05 | Finanzas | wallets, transactions, payments, coins, coin_packages, precios_sugeridos |
| 06 | Negocios | negocios, negocio_horarios, negocio_ratings, negocio_reportes, anuncios_laborales, postulaciones_anuncio |
| 07 | Comunicación | conversations, messages, notifications, notification_preferences, presence |
| 08 | Gobernanza | audit_logs, disputes, tickets, moderacion_contenido, region_scoping |
| 09 | IA | pds_embeddings, solicitud_embeddings, recommendation_logs, feature_flags |
| 10 | Sistema | system_config, migrations_log, seed_data, api_rate_limits |

## Cardenalidad (alas UML)
- `||` = exactamente uno (obligatorio)
- `o|` = cero o uno (opcional)
- `|{` = uno o muchos (obligatorio)
- `o{` = cero o muchos (opcional)

## Tablas eliminadas del completo
`system_config`, `migrations_log`, `seed_data`, `api_rate_limits` (sin relación FK con el dominio principal).

## Herencia
No existe herencia de tablas en SQLAlchemy. Todas las relaciones son asociación / composición mediante claves foráneas.

## Renderizar diagramas
```bash
# Requiere Java + plantuml.jar
java -jar plantuml.jar archivo.puml
```
O abrir en https://www.plantuml.com/plantuml/ pegando el contenido del `.puml`.

## Modelo fuente
Código SQLAlchemy: `Chambeapp_backend/app/models/`
