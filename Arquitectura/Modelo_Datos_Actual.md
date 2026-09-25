# Modelo de Datos Actual — ChambeApp Backend (Inventario Real)

> **Fuente:** `Chambeapp_backend/app/models/*.py` (modelos SQLAlchemy).
> **Fecha:** 2026-09-25.
> **Referencia diagrama:** `Chambeapp_Doc/Arquitectura/diagramas/04_modelo_datos.puml`.
>
> **Leyenda:**
> - ✅ = modelo ya presente en `04_modelo_datos.puml`.
> - ❌ = modelo **NO** presente en el diagrama (falta documentar).
> - ⚠️ = el diagrama usa un nombre distinto al modelo real.

---

## 1. Resumen

| Métrica | Valor |
|---|---|
| Archivos de modelo | 27 |
| Modelos (clases SQLAlchemy) | **47** |
| Tablas en el diagrama `04_modelo_datos.puml` | 10 (incluye `Order` que no existe) |
| Modelos presentes en el diagrama | 9 |
| Modelos faltantes en el diagrama | **38** |

---

## 2. Inventario de Modelos por Módulo

### 2.1 Usuarios y Seguridad — `models/user.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `User` | `users` | id, email (uniq), password_hash, rol (enum 7 roles), status (active/suspended/banned), role_version, nombre, username, telefono, edad_verificada, acepto_tyc, consentimiento_datos, email_verificado, fecha_registro, last_login, activo, two_factor_enabled, region_id (FK regions) | ✅ |
| `Profile` | `profiles` | user_id (PK/FK), habilidades (JSON), experiencia, zona, calificacion_promedio, verificado, badges (JSON), portafolio (JSON), categorias (JSON), perfil_completo, foto_perfil, latitud, longitud, geom (PostGIS POINT), plan, destacado, onboarding_completed, onboarding_step | ✅ |
| `LegalAcceptance` | `legal_acceptances` | id, user_id (FK), version_tyc, fecha, ip | ❌ |
| `Verification` | `verifications` | id, user_id (FK), document_type, document_number, status (pending/approved/rejected), reviewed_by, reviewed_at, reason | ❌ |

### 2.2 Solicitudes y Ratings — `models/solicitud.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Solicitud` | `solicitudes` | id, solicitante_id (FK), titulo, categoria, descripcion, ubicacion, latitud, longitud, direccion, presupuesto, fecha_deseada, urgencia, estado (8 estados), especificaciones_tecnicas (JSON), imagen_360, horario, imagenes (JSON), radio_km | ✅ |
| `Rating` | `ratings_solicitud` | id, service_id (FK), autor_id (FK), calificado_id (FK), puntaje (1-5), comentario, reportado | ❌ |

### 2.3 Contratos y Disputas — `models/contract.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Contract` | `contracts` | id, service_id (FK), proveedor_id (FK), solicitante_id (FK), estado (6 estados), motivo_cancelacion, inicio_en, fin_en, confirmado_en | ⚠️ (diagrama usa `Order`) |
| `Dispute` | `disputes` | id, contract_id (FK), reason, status (abierta/resuelta), resolved_by, resolved_at, resolution | ❌ |

### 2.4 Chamba (Gestión de Ejecución) — `models/chamba.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Chamba` | `chambas` | id, contract_id (FK, uniq), estado (7 estados), estado_previo, fecha_activacion, fecha_inicio_obra, fecha_solicitud_cierre, fecha_validacion, fecha_liquidacion, fecha_finalizacion, evidencia_entrada (JSON), evidencia_salida (JSON), adendas (JSON), novedades (JSON), pago_confirmado_solicitante, pago_confirmado_prestador, pago_directo_confirmado, pago_monto_final, rating_estrellas, rating_comentario, habilidades_validadas (JSON) | ❌ |

### 2.5 Marañas — `models/marana.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Marana` | `maranas` | id, chamba_id (FK), adenda_idx, solicitante_id (FK), titulo, categoria, descripcion, presupuesto, ubicacion, estado (5 estados), pago_confirmado_solicitante, pago_confirmado_prestador, pago_monto_final, pds_asignado_id (FK), fecha_asignacion, fecha_entrega, fecha_pago | ❌ |
| `MaranaOferta` | `maranas_ofertas` | id, marana_id (FK), pds_id (FK), monto, mensaje, estado (4 estados), contra_monto, contra_mensaje | ❌ |

### 2.6 Anuncios Laborales — `models/anuncio.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `AnuncioLaboral` | `anuncios_laborales` | id, negocio_id (FK), titulo, descripcion, categoria, ubicacion, latitud, longitud, vacantes, estado (publicado/cerrado) | ❌ |
| `AnuncioPostulacion` | `anuncios_postulaciones` | id, anuncio_id (FK), pds_id (FK), mensaje, telefono_contacto, email_contacto, estado (pendiente/contactado/descartado) | ❌ |

### 2.7 Ofertas — `models/oferta.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Oferta` | `ofertas` | id, solicitud_id (FK), pds_id (FK), monto, mensaje, fecha_deseada, horario, estado (5 estados), contra_monto, contra_mensaje, contra_fecha_deseada, contra_horario | ❌ |

### 2.8 Negocios — `models/negocio.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Negocio` | `negocios` | id, owner_id (FK), nombre, slug (uniq), descripcion, tipo, logo_url, banner_url, imagenes (JSON), latitud, longitud, direccion, ciudad, departamento, radio_cobertura_km, geom (PostGIS), categoria_principal, categorias_secundarias (JSON), servicios (JSON), palabras_clave (JSON), whatsapp, instagram, facebook, tiktok, sitio_web, calificacion_promedio, total_calificaciones, verificado, estado (5 estados), motivo_rechazo | ❌ |
| `NegocioHorario` | `negocio_horarios` | id, negocio_id (FK), dia_semana (0-6), abierto, hora_apertura, hora_cierre | ❌ |
| `NegocioRating` | `negocio_ratings` | id, negocio_id (FK), autor_id (FK), puntaje (1-5, check), comentario, reportado | ❌ |
| `NegocioReporte` | `negocio_reportes` | id, negocio_id (FK), reporter_id (FK), tipo (5 tipos), descripcion, estado (4 estados), ticket_id (FK) | ❌ |

### 2.9 Comerciante — `models/merchant.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `MerchantPreference` | `merchant_preferences` | id, user_id (FK, uniq), notif_nueva_solicitud, notif_nueva_resena, notif_estado_kyc, notif_pago_recibido, push_enabled, email_digest, idioma, tema | ❌ |
| `MerchantPaymentMethod` | `merchant_payment_methods` | id, user_id (FK), tipo, detalle (JSON), principal, activo | ❌ |

### 2.10 Habilidades — `models/habilidad.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Habilidad` | `habilidades` | id, nombre (uniq), descripcion, categoria, habilidades (JSON), niveles (JSON), activa | ❌ |
| `HabilidadNivel` | `habilidad_niveles` | id, user_id (FK), habilidad_id (FK), nivel_index, metodo (quiz/certificacion), evidencia_url, fecha | ❌ |
| `EndosoHabilidad` | `endoso_habilidades` | id, contract_id (FK), pds_id (FK), solicitante_id (FK), habilidad_id (FK), competencia | ❌ |
| `CertificacionTecnica` | `certificaciones_tecnicas` | id, user_id (FK), habilidad_id (FK), institucion, titulo, anio, codigo_verificacion, documento_url, estado (en_revision/verificado/rechazado) | ❌ |

### 2.11 KYC — `models/kyc.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `DocumentoRequerido` | `documentos_requeridos` | id, rol, clave, nombre, descripcion, obligatorio, grupo, multi_instancia, orden | ❌ |
| `DocumentoUsuario` | `documentos_usuario` | id, user_id (FK), documento_requerido_id (FK), documento_clave, instancia, rol, estado (no_enviado/enviado/aprobado/rechazado), url, archivo_base64, nombre_archivo, tipo_mime, fecha_envio, revisado_en, revisor_id, nota | ❌ |

### 2.12 Notificaciones — `models/notification.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Notification` | `notifications` | id, user_id (FK), tipo, titulo, mensaje, datos (JSON), leida | ❌ |

### 2.13 Pagos — `models/payment.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Payment` | `payments` | id, contract_id (FK, uniq), monto, comision_pds, comision_solicitante, estado (4 estados), pasarela, referencia_pasarela, motivo_reembolso | ❌ |

### 2.14 Métodos de Pago — `models/payment_method.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `MetodoPago` | `metodos_pago` | id, user_id (FK), tipo (billetera/banco), banco, numero_cuenta, es_principal | ❌ |

### 2.15 Portafolio — `models/portfolio.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `PortfolioItem` | `portfolio_items` | id, pds_id (FK), titulo, descripcion, tipo (foto/video/documento), categoria, s3_key, url, file_size_bytes, mime_type, estado (pendiente_revision/aprobado/rechazado), verificado_por, verificado_en, vistas | ✅ |

### 2.16 Regiones — `models/region.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Region` | `regions` | id, clave (uniq), nombre, descripcion, departamentos (JSON) | ❌ |

### 2.17 Tickets — `models/ticket.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Ticket` | `tickets` | id, user_id (FK), subject, body, status (open/pending/closed), priority (low/normal/high), assigned_to, resolved_at | ❌ |

### 2.18 Confianza — `models/trust.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `TrustScore` | `trust_scores` | id, pds_id (FK, uniq), kyc_verificado, portfolio_calidad, rating_score, contratos_completados, referidos_count, puntuacion, nivel (nuevo/confiable/verificado/experto), componentes_json, calculado_en, version | ⚠️ (diagrama usa `Trust`) |

### 2.19 Billetera y Monedas — `models/wallet.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Wallet` | `wallets` | id, user_id (FK, uniq), saldo, saldo_bloqueado | ✅ |
| `Transaction` | `transactions` | id, wallet_id (FK), tipo (comision/monedas/retiro/reembolso/deposito), monto, descripcion, referencia | ❌ |
| `Coin` | `coins` | id, user_id (FK), cantidad, tipo (comprada/promocional/ganada), vence_en | ❌ |

### 2.20 Modalidades e Hitos — `models/modalidad.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Modalidad` | `modalidades` | id, service_id (FK, uniq), tipo (A_comision/B_sin_comision), monedas_requeridas | ❌ |
| `Milestone` | `milestones` | id, contract_id (FK), numero, descripcion, monto, estado (pendiente/aprobado/rechazado), aprobado_en | ❌ |

### 2.21 Suscripciones — `models/subscription.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Suscripcion` | `suscripciones` | id, user_id (FK, uniq), plan (free/basico/profesional), estado (activa/cancelada/vencida), inicio_en, fin_en, monto, metodo_pago | ❌ |

### 2.22 Chat — `models/chat.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Conversation` | `conversations` | id, user_a_id (FK), user_b_id (FK), creado_en (uniq par) | ❌ |
| `Message` | `messages` | id, conversation_id (FK), sender_id (FK), contenido, leido | ❌ |

### 2.23 Configuración — `models/config.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `SystemConfig` | `system_configs` | id, key (uniq), value, value_type (int/float/string/bool/json), description, updated_by, updated_at | ❌ |
| `FeatureFlag` | `feature_flags` | id, key (uniq), enabled, description | ❌ |

### 2.24 Auditoría — `models/audit.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `AuditLog` | `audit_logs` | id, actor_id, action, entity_type, entity_id, before_json, after_json, ip, created_at | ❌ |

### 2.25 Badges — `models/badges.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `Badge` | `badges` | id, usuario_id (FK), tipo (9 tipos), activo, otorgado_en | ✅ |

### 2.26 Cascada de Notificaciones — `models/cascade.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `NotificationCascade` | `notification_cascades` | id, solicitud_id (FK, uniq), fase_actual, config_json, estado (activa/completada/expirada/cancelada), enviados_total, respondidos_total, timer_expira, started_at, completed_at, log_json | ✅ |

### 2.27 Log de Recomendaciones — `models/recommendation_log.py`

| Modelo | Tabla | Columnas clave | Diagrama |
|---|---|---|---|
| `RecommendationLog` | `recommendation_logs` | id, solicitud_id (FK), pds_id (FK), puntuacion, ranking_pos, features_snapshot, modelo_nombre, modelo_version, notificado, respondio, aceptado, experiment_group | ✅ |

---

## 3. Modelos Faltantes en `04_modelo_datos.puml` (38)

`LegalAcceptance`, `Verification`, `Rating`, `Contract`, `Dispute`, `Chamba`, `Marana`, `MaranaOferta`, `AnuncioLaboral`, `AnuncioPostulacion`, `Oferta`, `Negocio`, `NegocioHorario`, `NegocioRating`, `NegocioReporte`, `MerchantPreference`, `MerchantPaymentMethod`, `Habilidad`, `HabilidadNivel`, `EndosoHabilidad`, `CertificacionTecnica`, `DocumentoRequerido`, `DocumentoUsuario`, `Notification`, `Payment`, `MetodoPago`, `Region`, `Ticket`, `Transaction`, `Coin`, `Modalidad`, `Milestone`, `Suscripcion`, `Conversation`, `Message`, `SystemConfig`, `FeatureFlag`, `AuditLog`.

## 4. Divergencias del Diagrama

1. **`Order`** aparece en el diagrama pero **no existe** en el código; el modelo real es **`Contract`** (`contracts`).
2. **`Trust`** en el diagrama corresponde a **`TrustScore`** (`trust_scores`).
3. El diagrama no refleja los enums de estado ni las columnas JSON/geo (PostGIS `geom` en `Profile` y `Negocio`).
4. El diagrama omite todas las tablas de los módulos nuevos (chambas, marañas, anuncios, negocios, habilidades, KYC, admin/superadmin, regiones, tickets, chat, config, auditoría).

---

*Generado automáticamente desde `app/models/*.py`. No editar a mano; regenerar al cambiar modelos.*