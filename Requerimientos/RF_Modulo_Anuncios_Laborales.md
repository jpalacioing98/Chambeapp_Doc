# RF Módulo Anuncios Laborales (no vinculantes) — RF-67 a RF-69

> Fuente: `Chambeapp_backend/CHANGELOG.md` (Unreleased: Anuncios Laborales — migración `013_anuncios`), verificado contra `app/models/anuncio.py`, `app/controllers/anuncios.py`, `app/schemas/anuncio.py`.
> Numeración continúa RF-66. Formato EARS. Implementado (10 tests `test_anuncios.py`).

## Modelo
- `anuncios_laborales {id, negocio_id FK users, titulo, descripcion, categoria, ubicacion?, latitud?, longitud?, vacantes?, estado: publicado|cerrado, creado_en, actualizado_en}` + `anuncios_postulaciones {id, anuncio_id FK, pds_id FK, mensaje?, telefono_contacto?, email_contacto?, estado: pendiente|contactado|descartado}`. `estado` ENUM `EstadoAnuncio`, `EstadoPostulacionAnuncio`.
- No vinculante: banner publicitario en mapa de negocios, sin contratos/chambas. Visible a todos los roles.

### RF-67: Publicar anuncio laboral (negocio)
**HU-67:** Como negocio quiero publicar oferta laboral visible en mapa para atraer PDS.
**EARS:** WHEN usuario con `role=merchant` envía `POST /api/v1/anuncios/ {titulo, descripcion, categoria, ubicacion?, latitud?, longitud?, vacantes?}` THEN sistema SHALL crear `AnuncioLaboral {negocio_id=jwt, estado=publicado}`. IF role != merchant THEN SHALL 403 "Solo un negocio puede publicar".
**CA:** `titulo` 200ch, `descripcion` text, `categoria` 120ch; `GET /anuncios/` feed público (solo `publicado`, `?categoria` filtro, orden `creado_en desc`) auth requerido; `GET /anuncios/negocio/<uid>` dueño ve todos + `postulaciones_count`, otros solo `publicado`; `GET /anuncios/<id>` dueño ve `postulaciones[]`, otros `[]` + count; `PATCH /anuncios/<id>/estado {accion: cerrar|reabrir}` solo dueño (400 si ya en estado).

### RF-68: Feed público y descubrimiento
**EARS:** WHEN cualquier rol autenticado `GET /anuncios/` THEN sistema SHALL retornar anuncios `publicado` con `negocio_nombre` agregado (join User.nombre). WHEN PDS busca `?categoria=` THEN SHALL filtrar por categoría.
**CA:** Mapa negocios integra anuncios como banners; paginación futura (actual `query.all()` no paginado — gap). Sin geo-filtro aún.

### RF-69: Postulaciones y gestión de contacto (PDS ↔ Negocio)
**EARS:**
- WHEN pds `POST /anuncios/<id>/postulaciones {mensaje?, telefono_contacto?, email_contacto?}` AND anuncio `publicado` AND pds no es dueño AND no postulado antes THEN SHALL crear `AnuncioPostulacion {pds_id, telefono_contacto ?? User.telefono, email_contacto ?? User.email, estado=pendiente}` + notif `anuncio_postulacion` + socket `anuncio:postulacion` al negocio. IF ya postulado THEN 400.
- WHEN negocio `GET /anuncios/<id>/postulaciones` (dueño) THEN SHALL listar con `pds_nombre`.
- WHEN negocio `PATCH /anuncios/<id>/postulaciones/<pid> {accion: contactar|descartar}` THEN SHALL `contactado` (notif `anuncio_contactado` + socket `anuncio:contactado`) o `descartado`.
**CA:** Validación 403 solo pds puede postular; 400 si anuncio cerrado; teléfono/email opcionales (fallback a User). Estados `pendiente→contactado|descartado` final.

## Trazabilidad API
| RF | Método |
|---|---|
|67|POST /anuncios/ + PATCH /anuncios/<id>/estado + GET /anuncios/ + GET /anuncios/negocio/<uid> + GET /anuncios/<id>|
|69|POST /anuncios/<id>/postulaciones + GET /anuncios/<id>/postulaciones + PATCH /anuncios/<id>/postulaciones/<pid>|

*Tests: 10 casos `test_anuncios.py`.*