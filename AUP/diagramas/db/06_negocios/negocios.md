# Modulo 6 - Negocios / Merchant

## Diagrama
`negocios.puml` — Perfiles de establecimientos/comercios y su operación.

## Entidades
- **negocios**: perfil de negocio (nombre, categoría, ubicación, redes, verificación, comisión, cuenta bancaria).
- **negocio_horarios**: horario de atención por día de la semana.
- **negocio_ratings**: calificación de usuarios a negocios (1-5, único por par).
- **negocio_reportes**: reportes de fraude/spam/contenido vinculados a ticket.
- **anuncios_laborales**: ofertas de empleo publicadas por un negocio.
- **postulaciones_anuncio**: postulación de un usuario a un anuncio laboral.

## Relaciones y cardinalidad
- `users` 1:N `negocios` — un merchant puede tener varios negocios.
- `negocios` 1:N `negocio_horarios`, `negocio_ratings`, `negocio_reportes`, `anuncios_laborales`.
- `users` 1:N `negocio_ratings` — un usuario califica muchos negocios.
- `anuncios_laborales` 1:N `postulaciones_anuncio`; `users` 1:N `postulaciones_anuncio`.

## Por qué este diseño
- `negocio_preferencias_pago` eliminado: sus columnas (`comision_pct`, `cuenta_bancaria_encriptada`) se integraron directamente en `negocios`, evitando un join 1:1 innecesario.
- Módulo independiente del PDS/solicitante: un negocio no es necesariamente un PDS de servicios.

## Esquema SQL
`negocios.sql.puml` — Índices en `negocios(estado, calificacion_promedio)`, `(estado, categoria_principal)`; UK en `negocio_horarios(negocio_id, dia_semana)` y `negocio_ratings(negocio_id, autor_id)`.
