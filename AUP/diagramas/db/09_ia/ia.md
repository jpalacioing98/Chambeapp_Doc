# Modulo 9 - IA y Recomendacion

## Diagrama
`ia.puml` — Matching semántico y logs de recomendación con pgvector.

## Entidades
- **pds_embeddings**: embedding vectorial (384 dims) de un PDS.
- **solicitud_embeddings**: embedding vectorial de una solicitud.
- **recommendation_logs**: log de recomendación (scores retrieval/ranking, SHAP, clic, contratado).
- **feature_flags**: banderas de funcionalidad con versión de modelo.

## Relaciones y cardinalidad
- `users` 1:1 `pds_embeddings` — un vector por PDS.
- `solicitudes` 1:1 `solicitud_embeddings` — un vector por solicitud.
- `solicitudes` 1:N `recommendation_logs`; `users` 1:N `recommendation_logs`.
- `users` N:1 `feature_flags` (actualizado_por).

## Por qué este diseño
- pgvector permite búsqueda por similitud coseno entre solicitudes y PDS.
- `recommendation_logs` cierra el bucle de ML: registra por qué se mostró un PDS y si terminó en contratación.
- `shap_explanation_json` brinda explicabilidad y auditoría de sesgos.

## Esquema SQL
`ia.sql.puml` — Requiere extensión `pgvector` en PostgreSQL.
