# Mejoras al Modelo de Datos — Simplificación por Módulos

Este documento resume los cambios aplicados al diagrama ER de ChambeApp para simplificar la estructura y agrupar responsabilidades por módulo. Cada cambio incluye el "por qué".

---

## Resumen de cambios

| Cambio | Antes | Después | Razón |
|--------|-------|---------|-------|
| Unificación de verificaciones | `verifications` + `user_verifications` | `verifications` con campo `tipo` | Dos tablas modelaban lo mismo (verificación de usuario) con campos superpuestos. Una sola tabla con discriminador `tipo` reduce joins y centraliza la lógica de verificación (KYC, email, teléfono, identidad). |
| Wallet sin `id` separado | `wallets.id` PK + `user_id` UK | `user_id` como PK | Relación 1:1 estricta usuario-billetera. Eliminar la clave surogada evita una columna innecesaria y simplifica las FK de `transactions`. |
| Check-ins movidos al contrato | `pagos_checkin.pago_id` | `contract_checkins.contract_id` | El check-in geográfico pertenece a la ejecución del contrato (entrada/salida en obra), no al pago financiero. Acoplarlo al pago mezcla responsabilidades. |
| `chambas` → `contract_execution` | Tabla aparte con 28 columnas | Tabla 1:1 con `contracts`, columnas reducidas | El expediente de ejecución es una extensión del contrato. Separarlo con 1:1 es correcto, pero columnas de pago directo (`pago_confirmado_*`, `pago_monto_final`) se movieron a `payments` o se eliminaron por redundancia. |
| Preferencias de pago eliminadas | `negocio_preferencias_pago` (1:1) | Columnas en `negocios` (`comision_pct`, `cuenta_bancaria_encriptada`) | Tabla 1:1 opcional que solo añade un join. Los datos son atributos del negocio. |
| `service_id` → `solicitud_id` | `contracts.service_id` | `contracts.solicitud_id` | Nombre consistente con la entidad `solicitudes`. El alias `service` generaba confusión con servicios de terceros. |
| `monto_total` añadido a `contracts` | No existía | Campo en `contracts` | El monto del contrato es un dato clave del acuerdo y evita calcularlo sumando pagos o ofertas. |

---

## Estructura por módulos (después de la simplificación)

### 1. Identidad
`users`, `profiles`, `roles`, `regions`, `user_sessions`, `legal_acceptances`, `verifications`

### 2. KYC Documentos
`kyc_required_documents`, `user_kyc_documents`

### 3. Servicios (solicitudes, ofertas, contratos, ejecución)
`solicitudes`, `ofertas`, `contracts`, `contract_execution`, `adendas`, `evidencias`, `hitos`, `ratings_solicitud`, `contract_checkins`

### 4. Marañas (subcontratación)
`maranas`, `ofertas_marana`

### 5. Finanzas
`wallets`, `transactions`, `payments`, `coins`, `coin_packages`, `precios_sugeridos`

### 6. Negocios / Merchant
`negocios`, `negocio_horarios`, `negocio_ratings`, `negocio_reportes`, `anuncios_laborales`, `postulaciones_anuncio`

### 7. Comunicación
`conversations`, `messages`, `notifications`, `notification_preferences`, `presence`

### 8. Gobernanza / Auditoría
`audit_logs`, `disputes`, `tickets`, `moderacion_contenido`, `region_scoping`

### 9. IA / Recomendación
`pds_embeddings`, `solicitud_embeddings`, `recommendation_logs`, `feature_flags`

### 10. Sistema / Utilidades
`system_config`, `migrations_log`, `seed_data`, `api_rate_limits`

---

## Detalle de relaciones y cardinalidad

### Identidad
- `users` 1:1 `profiles` (obligatorio). Separa credenciales de datos públicos.
- `roles` 1:N `users`. RBAC con `role_version` para revocación de tokens.
- `regions` 1:N `users`. Acota operaciones del personal a una región.
- `users` 1:N `user_sessions`. Control de sesiones y revocación por dispositivo.
- `users` 1:N `verifications`. Tabla unificada con discriminador `tipo`.

### Servicios
- `users` 1:N `solicitudes` (solicitante).
- `solicitudes` 1:N `ofertas`; `users` 1:N `ofertas` (PDS). Negociación bilateral.
- `solicitudes` 1:N `contracts`; `users` 2×1:N `contracts` (proveedor, solicitante).
- `contracts` 1:1 `contract_execution`. Expediente de ciclo de vida de la obra.
- `contracts` 1:N `adendas`, `evidencias`, `hitos`, `contract_checkins`.
- `solicitudes` 1:N `ratings_solicitud`; `users` 2×1:N (autor, calificado).

### Marañas
- `contracts` 1:N `maranas`. Subcontratación derivada de un contrato padre.
- `maranas` 1:N `ofertas_marana`; `users` 1:N `ofertas_marana`.

### Finanzas
- `users` 1:1 `wallets` (`user_id` como PK).
- `wallets` 1:N `transactions`.
- `users` 1:N `coins`.
- `contracts` 1:1 `payments`.
- `contracts` 1:N `contract_checkins` (georreferenciados, independientes del pago).

### Negocios
- `users` 1:N `negocios` (merchant dueño).
- `negocios` 1:N `negocio_horarios`, `negocio_ratings`, `negocio_reportes`, `anuncios_laborales`.
- `anuncios_laborales` 1:N `postulaciones_anuncio`; `users` 1:N `postulaciones_anuncio`.

### Comunicación
- `users` 2×1:N `conversations` (participante A / B con par único normalizado).
- `conversations` 1:N `messages`; `users` 1:N `messages`.
- `users` 1:N `notifications`; `users` 1:1 `notification_preferences`; `users` 1:1 `presence`.

### Gobernanza
- `users` 1:N `audit_logs`. Inmutable.
- `contracts` 1:N `disputes`; `users` 1:N `disputes` (inicia, resuelve opcional).
- `users` 1:N `tickets` (abre, asignado opcional).
- `users` 2×1:N `moderacion_contenido` (reportado por, moderado por).
- `users` 1:N `region_scoping`; `regions` 1:N `region_scoping` (PK compuesta).

### IA
- `users` 1:1 `pds_embeddings`; `solicitudes` 1:1 `solicitud_embeddings` (pgvector).
- `solicitudes` 1:N `recommendation_logs`; `users` 1:N `recommendation_logs`.

---

## Decisiones de diseño mantendas

- **Sin herencia de tablas**: SQLAlchemy no usa joined/single-table inheritance. Todas las relaciones son asociación mediante FK.
- **JSON para esquemas dinámicos**: `especificaciones_tecnicas`, `adendas`, `novedades`, `imagenes`, etc.
- **PostGIS**: `geom` en `profiles` y `negocios` para búsquedas de proximidad.
- **Auditoría inmutable**: `audit_logs` con `snapshot_diff_json`.
- **Hash SHA-256** en documentos KYC y evidencias para integridad.

---

## Archivos

- Diagrama simplificado: `fig_er_modelo_datos_simplificado.puml`
- Diagrama original: `fig_er_modelo_datos.puml`
- Modelos fuente: `Chambeapp_backend/app/models/`
