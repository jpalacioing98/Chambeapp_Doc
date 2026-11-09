# Modelo de Datos ChambeApp — Entidades, Relaciones y Razonamiento de Diseño

Este documento describe el modelo entidad-relación (ER) de la base de datos de **ChambeApp**, backend construido con **Flask + SQLAlchemy + PostgreSQL/PostGIS**. Incluye:

1. Diagrama ER (PlantUML): `fig_er_modelo_datos.puml`
2. Catálogo de entidades y atributos clave.
3. Relaciones con cardinalidad y justificación del "por qué" de cada decisión de diseño.

---

## 1. Alcance y principios de diseño

La base de datos está normalizada en **3FN** y agrupada en 8 dominios funcionales:

| Dominio | Entidades | Propósito |
|---------|-----------|-----------|
| Core Usuarios | 8 | Identidad, autenticación, sesiones, roles, regiones, KYC |
| Chambas / Marañas | 8 | Publicación de solicitudes, ofertas, contratos, ejecución, hitos, subcontratación |
| Finanzas / Wallet | 7 | Billetera, transacciones, pagos, check-in, monedas, precios sugeridos |
| Negocios / Merchant | 6 | Perfiles de negocio, horarios, calificaciones, reportes, anuncios, postulaciones |
| IA / Recomendación | 4 | Embeddings vectoriales (pgvector), logs de recomendación, feature flags |
| Gobernanza / Auditoría | 5 | Logs inmutables, disputas, tickets, moderación, scoping regional |
| Comunicación | 5 | Conversaciones, mensajes, notificaciones, preferencias, presencia |
| Sistema / Utilidades | 4 | Configuración, log de migraciones, seed, límites de API |

**Total: 47 entidades** (coherente con `fig06_modelo_datos_47.puml`).

### Principios aplicados

1. **Integridad referencial**: toda FK apunta a una PK existente; `ON DELETE CASCADE` solo donde tiene sentido (ej. `chambas.contract_id`, `wallet_transactions.wallet_id`).
2. **Auditoría inmutable**: `audit_logs` captura actor, acción, entidad y diff JSON sin permitir edición.
3. **Geoespacial**: columnas `geom` (PostGIS `POINT`, SRID 4326) en `profiles`, `negocios` y `solicitudes` para búsquedas por proximidad y geocercas.
4. **Separación de preocupaciones**: tablas de rating separadas para solicitudes (`ratings_solicitud`) y negocios (`negocio_ratings`) para evitar colisión de metadatos y permitir reglas distintas.
5. **JSON para esquemas dinámicos**: `especificaciones_tecnicas`, `imagenes`, `adendas`, `novedades`, etc., evitan migraciones frecuentes cuando el frontend evolve rápido.
6. **Idempotencia y trazabilidad**: `hash_sha256` en documentos KYC y evidencias; `snapshot_diff_json` en auditoría.

---

## 2. Catálogo de entidades

### 2.1 Core Usuarios

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `users` | id | `regions.id` | Cuenta de acceso (email, password_hash, rol, estado, versión de rol). |
| `profiles` | user_id | `users.id` | Perfil público (habilidades, calificación, geolocalización, plan, foto). |
| `roles` | id | — | Catálogo de roles: pds, solicitante, merchant, verificador, soporte, admin, superadmin. |
| `user_sessions` | id | `users.id` | Sesiones activas (refresh token hash, dispositivo, IP, expiración, revocación). |
| `legal_acceptances` | id | `users.id` | Trazabilidad clickwrap de Términos y Condiciones (Ley 527/1999). |
| `verifications` | id | `users.id` (x2) | Solicitudes KYC revisadas por un verificador. |
| `regions` | id | — | División regional (clave DANE, departamento, radio de cobertura). |
| `user_verifications` | id | `users.id` | Verificaciones de correo/teléfono/identidad con código y expiración. |

### 2.2 KYC

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `kyc_required_documents` | clave | — | Catálogo de documentos exigibles por rol. |
| `user_kyc_documents` | id | `users.id`, `kyc_required_documents.clave` | Instancias de documentos subidos por el usuario (MinIO URL, hash SHA-256). |

### 2.3 Chambas / Marañas

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `solicitudes` | id | `users.id` | Solicitud de servicio publicada por un solicitante (presupuesto, ubicación, urgencia). |
| `ofertas` | id | `solicitudes.id`, `users.id` | Propuesta de un PDS para una solicitud (monto, estado, contraoferta). |
| `contracts` | id | `solicitudes.id`, `users.id` (x2) | Contrato firmado entre solicitante y proveedor (PDS). |
| `chambas` | id | `contracts.id` | Expediente de ejecución 1:1 con contrato (hitos, evidencias, pago directo). |
| `adendas` | id | `contracts.id`, `users.id` | Modificaciones de alcance/precio/novedad a un contrato. |
| `evidencias` | id | `contracts.id`, `users.id` | Pruebas de entrada/salida/novedad con URLs MinIO y hash. |
| `hitos` | id | `contracts.id`, `users.id` | Hitos 1-6 de cierre y validación del servicio. |
| `maranas` | id | `contracts.id`, `adendas.id`, `users.id` | Subcontratación derivada de un contrato padre. |
| `ofertas_marana` | id | `maranas.id`, `users.id` | Ofertas de PDS dentro de una marana. |
| `ratings_solicitud` | id | `solicitudes.id`, `users.id` (x2) | Calificación 1-5 entre solicitante y PDS sobre una solicitud. |

### 2.4 Finanzas / Wallet

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `wallets` | id | `users.id` | Billetera virtual por usuario (saldo disponible y bloqueado). |
| `transactions` | id | `wallets.id` | Movimiento de caja (comisión, retiro, reembolso, depósito). |
| `payments` | id | `contracts.id` | Pago de un contrato (monto, comisiones PDS/solicitante, estado, pasarela). |
| `pagos_checkin` | id | `payments.id` | Check-in/out georreferenciado asociado a un pago (distancia, evidencias). |
| `coins` | id | `users.id` | Monedas del usuario (comprada/promocional/ganada) con vencimiento. |
| `coin_packages` | id | — | Paquetes de monedas a la venta (modalidad A/B, precio COP). |
| `precios_sugeridos` | id | — | Rangos de precio por categoría para guiar ofertas (muestra n, promedio). |

### 2.5 Negocios / Merchant

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `negocios` | id | `users.id` | Perfil de negocio (nombre, categoría, ubicación, redes, verificación). |
| `negocio_horarios` | id | `negocios.id` | Horario de atención por día de la semana. |
| `negocio_ratings` | id | `negocios.id`, `users.id` | Calificación de usuarios a negocios (1-5, único por par). |
| `negocio_reportes` | id | `negocios.id`, `users.id`, `tickets.id` | Reportes de fraude/spam/contenido vinculados a ticket. |
| `anuncios_laborales` | id | `negocios.id` | Ofertas de empleo publicadas por un negocio. |
| `postulaciones_anuncio` | id | `anuncios_laborales.id`, `users.id` | Postulación de un usuario a un anuncio laboral. |
| `negocio_preferencias_pago` | negocio_id | `negocios.id` | Configuración de comisión y cuenta bancaria del negocio. |

### 2.6 Comunicación

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `conversations` | id | `users.id` (x2) | Conversación 1:1 normalizada (user_a < user_b para evitar duplicados). |
| `messages` | id | `conversations.id`, `users.id` | Mensaje dentro de una conversación (remitidor, leído, contenido). |
| `notifications` | id | `users.id` | Notificación persistente por usuario (tipo, título, canal, leída). |
| `notification_preferences` | user_id | `users.id` | Preferencias de canal (push/in-app/email) y categorías. |
| `presence` | user_id | `users.id` | Estado online/offline, socket_id y heartbeat para tiempo real (Socket.IO). |

### 2.7 Gobernanza / Auditoría

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `audit_logs` | id | `users.id` | Log inmutable de acciones (actor, entidad, diff JSON, IP, user-agent). |
| `disputes` | id | `contracts.id`, `users.id` (x2) | Disputa sobre un contrato (iniciada/resuelta por usuarios). |
| `tickets` | id | `users.id` (x2) | Ticket de soporte/reclamo (prioridad, estado, asignado). |
| `moderacion_contenido` | id | `users.id` (x2) | Moderación de entidades reportadas (motivo, acción, moderador). |
| `region_scoping` | admin_id + region_id | `users.id`, `regions.id` | Permiso de admin sobre una región (lectura/escritura/admin). |

### 2.8 IA / Recomendación

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `pds_embeddings` | pds_id | `users.id` | Embedding vectorial (pgvector, 384 dims) de un PDS para búsqueda semántica. |
| `solicitud_embeddings` | solicitud_id | `solicitudes.id` | Embedding vectorial de una solicitud para matching. |
| `recommendation_logs` | id | `solicitudes.id`, `users.id` | Log de recomendación (scores retrieval/ranking, SHAP, clic, contratado). |
| `feature_flags` | nombre | `users.id` | Banderas de funcionalidad con versión de modelo y autor. |

### 2.9 Sistema / Utilidades

| Entidad | PK | FK | Descripción |
|---------|----|----|-------------|
| `system_config` | clave | — | Configuración global editable (valor JSON). |
| `migrations_log` | version | — | Historial de migraciones aplicadas (éxito, checksum). |
| `seed_data` | tabla | — | Datos semilla por tabla y versión. |
| `api_rate_limits` | endpoint + metodo | — | Límites de velocidad por endpoint y rol excluido. |

---

## 3. Relaciones y razonamiento ("por qué")

### 3.1 `users` 1:1 `profiles` (obligatorio por lado de profile)
**Por qué:** separar credenciales y seguridad (`users`) de datos públicos y de negocio (`profiles`). Permite actualizar el perfil sin tocar la tabla de autenticación y aplicar políticas de visibilidad distintas. El cascade `delete-orphan` asegura que al borrar un usuario se borre su perfil.

### 3.2 `users` N:1 `roles` y `users` N:1 `regions`
**Por qué:** el rol define permisos (RBAC) y `role_version` en `users` permite revocar tokens al cambiar de rol. La región acota operaciones del personal administrativo (verificador/soporte/admin) a una zona geográfica (multiregión).

### 3.3 `users` 1:N `user_sessions`
**Por qué:** control de sesiones activas y revocación individual por dispositivo/IP sin cerrar todas las sesiones del usuario.

### 3.4 `users` 1:N `solicitudes` (solicitante) y `users` 1:N `ofertas` (PDS)
**Por qué:** un solicitante puede publicar muchas solicitudes; un PDS puede ofertar a muchas. La doble FK en `ofertas` (`solicitud_id` + `pds_id`) modela la negociación bilateral.

### 3.5 `solicitudes` 1:N `contracts`
**Por qué:** una oferta aceptada se convierte en un contrato. Un contrato pertenece a una sola solicitud, pero una solicitud puede generar contratos a lo largo del tiempo (renovaciones/recontratación).

### 3.6 `contracts` 1:1 `chambas`, `contracts` 1:1 `payments`
**Por qué:** el expediente de ejecución (`chambas`) y el pago (`payments`) son extensiones 1:1 del contrato para evitar filas esparcidas y mantener el ciclo de vida cohesivo. El cascade `ON DELETE` en `chambas.contract_id` preserva la integridad del expediente.

### 3.7 `contracts` 1:N `adendas`, `evidencias`, `hitos`
**Por qué:** durante la ejecución se agregan adendas (cambio de alcance/precio), evidencias (fotos 360° de entrada/salida) y hitos (validación 1-6). Son colecciones de por vida del contrato.

### 3.8 `contracts` 1:N `maranas`
**Por qué:** una marana es una subcontratación derivada de un contrato padre, permitiendo que el PDS principal contrate a terceros para parte del trabajo. `adenda_id` opcional vincula la marana a una adenda que la autorizó.

### 3.9 `users` 1:1 `wallets`, `wallets` 1:N `transactions`
**Por qué:** una billetera por usuario con saldo consolidado; cada movimiento (comisión, retiro, depósito) es una transacción inmutable con saldo resultante.

### 3.10 `contracts` 1:1 `payments`, `payments` 1:N `pagos_checkin`
**Por qué:** el pago está ligado al contrato para reconciliar quién pagó cuánto por qué trabajo. Los check-ins georreferenciados validan que el PDS estuvo físicamente en el sitio (distancia en metros vs. geocerca).

### 3.11 `users` 1:N `negocios`, `negocios` 1:N `{negocio_horarios, negocio_ratings, negocio_reportes, anuncios_laborales}`
**Por qué:** un usuario (merchant) puede tener varios negocios; cada negocio tiene su propio horario, reputación, reportes y publicaciones laborales. El módulo Merchant es independiente del módulo PDS/solicitante.

### 3.12 `anuncios_laborales` 1:N `postulaciones_anuncio`, `users` 1:N `postulaciones_anuncio`
**Por qué:** canal de empleo dentro de la plataforma: un negocio publica vacantes y varios usuarios se postulan (único par anuncio-usuario implícito en la UI).

### 3.13 `users` 2:N `conversations` (user_a / user_b) y `conversations` 1:N `messages`
**Por qué:** chat 1:1 normalizado con restricción de unicidad en el par ordenado para evitar conversaciones duplicadas. Los mensajes pertenecen a una conversación y a un remitidor.

### 3.14 `users` 1:N `notifications` y `users` 1:1 `notification_preferences`
**Por qué:** centro de notificaciones persistente (no solo push efímero) con preferencias por canal para respetar la elección del usuario.

### 3.15 `users` 1:1 `presence`
**Por qué:** estado de conexión en tiempo real para Socket.IO (quién está online, último visto, socket para enrutar mensajes).

### 3.16 `users` 1:N `audit_logs`, `contracts` 1:N `disputes`, `users` 1:N `tickets`, `users` 2:N `moderacion_contenido`
**Por qué:** capa de gobernanza. Auditoría inmutable para trazabilidad regulatoria; disputas vinculadas a contratos (la plataforma no retiene fondos, resolución informativa); tickets de soporte; moderación de contenido reportado por usuarios y actuado por moderadores.

### 3.17 `users` 1:N `region_scoping`, `regions` 1:N `region_scoping`
**Por qué:** control de acceso regional: un administrador/verificador solo ve usuarios, KYC, solicitudes, contratos, disputas, tickets y contenido de su región asignada.

### 3.18 `solicitudes` 1:1 `solicitud_embeddings`, `users` 1:1 `pds_embeddings`, `solicitudes` 1:N `recommendation_logs`, `users` 1:N `recommendation_logs`
**Por qué:** matching semántico con pgvector. Los logs de recomendación capturan por qué se mostró un PDS para una solicitud (scores, explicación SHAP) y si terminó en clic/contratación, cerrando el bucle de ML.

### 3.19 `users` 1:N `ratings_solicitud` (autor y calificado)
**Por qué:** calificación bidireccional entre solicitante y PDS sobre una solicitud, con restricción única (service_id, autor_id) para evitar doble calificación.

---

## 4. Decisiones de diseño destacadas y su justificación

| Decisión | Razón |
|----------|-------|
| `ratings_solicitud` separada de `negocio_ratings` | Evita colisión de metadata y permite reglas de negocio distintas (servicio vs comercio). |
| `JSON` para `adendas`, `novedades`, `imagenes`, `especificaciones_tecnicas` | Flexibilidad de esquema sin migraciones constantes; el frontend evoluye rápido. |
| `geom` PostGIS en `profiles`, `negocios`, `solicitudes` | Búsquedas por proximidad y geocercas (`radio_km`) para notificaciones cercanas. |
| `hash_sha256` en KYC y evidencias | Integridad y no repudio de documentos; detección de alteraciones. |
| `role_version` en `users` | Revocación de tokens de acceso ante cambio de rol o suspensión. |
| `ON DELETE CASCADE` solo en `chambas.contract_id` y relaciones de bajo valor (wallet→transactions, negocio→horarios) | Evita borrados en cadena accidentales en tablas núcleo (contratos, solicitudes, usuarios). |
| `audit_logs` con `snapshot_diff_json` | Auditoría inmutable sin versionar cada tabla individualmente. |
| `recommendation_logs` con SHAP JSON | Explicabilidad de la IA y auditoría de sesgos en el matching. |

---

## 5. Archivos relacionados

- Diagrama ER (PlantUML): `fig_er_modelo_datos.puml`
- Modelo de datos unificado previo: `fig06_modelo_datos_47.puml`
- Código fuente de modelos: `Chambeapp_backend/app/models/`
- Migraciones (Alembic): `Chambeapp_backend/migrations/versions/`
