# Diagrama ER — Figura 15: Modelo de Datos Completo (46 Entidades)

> **Módulo:** Modelo Entidad-Relación Unificado - ChambeApp  
> **Fuente:** `15_modelo_datos_completo.puml` (Figura 15)  
> **Referencias de Código:** Modelos SQLAlchemy en `backend/app/models/`, migraciones Alembic en `backend/migrations/`

---

## 1. Diagrama ER (PlantUML)

```plantuml
@startuml
!pragma layout smetana
title ChambeApp - Modelo de Datos Completo (ER Diagram)
skinparam classAttributeIconSize 0
skinparam defaultFontName Monospace

' ── Core Users & Auth ──────────────────────────────────────
class User {
  + id: Integer PK
  + email: String(255) UK
  + password_hash: String(255)
  + rol: Enum[RolUsuario] [PDS, SOLICITANTE, MERCHANT, VERIFICADOR, SOPORTE, ADMIN, SUPERADMIN]
  + status: String(20) [active, suspended, banned]
  + role_version: Integer
  + nombre: String(120)
  + username: String(60) UK
  + telefono: String(30)
  + edad_verificada: Boolean
  + acepto_tyc: Boolean
  + consentimiento_datos: Boolean
  + email_verificado: Boolean
  + fecha_registro: DateTime
  + last_login: DateTime
  + activo: Boolean
  + two_factor_enabled: Boolean
  + region_id: Integer FK
}

class Profile {
  + user_id: Integer PK,FK
  + habilidades: JSON
  + experiencia: Text
  + zona: String(120)
  + calificacion_promedio: Float
  + verificado: Boolean
  + badges: JSON
  + portafolio: JSON
  + categorias: JSON
  + perfil_completo: Boolean
  + foto_perfil: String(500)
  + latitud: Float
  + longitud: Float
  + geom: Geometry(POINT,4326)
  + plan: String(20) [free, basico, profesional]
  + destacado: Boolean
  + onboarding_completed: Boolean
  + onboarding_step: Integer
}

class Region {
  + id: Integer PK
  + clave: String(40) UK
  + nombre: String(120)
  + descripcion: Text
  + departamentos: JSON
  + created_at: DateTime
}

class LegalAcceptance {
  + id: Integer PK
  + user_id: Integer FK
  + version_tyc: String(20)
  + fecha: DateTime
  + ip: String(45)
}

class Verification {
  + id: Integer PK
  + user_id: Integer FK
  + document_type: String(50)
  + document_number: String(100)
  + status: String(20) [pending, approved, rejected]
  + reviewed_by: Integer FK
  + reviewed_at: DateTime
  + reason: Text
  + created_at: DateTime
}

' ── Solicitudes & Negotiation ───────────────────────────────
class Solicitud {
  + id: Integer PK
  + solicitante_id: Integer FK
  + titulo: String(200)
  + categoria: String(120)
  + descripcion: Text
  + ubicacion: String(120)
  + latitud: Float
  + longitud: Float
  + direccion: String(255)
  + presupuesto: Integer
  + fecha_deseada: Date
  + urgencia: Enum[UrgenciaSolicitud] [hoy, semana, flexible]
  + estado: Enum[EstadoSolicitud] [borrador, publicado, en_progreso, completado, cancelado, oculto, rechazado, asignada]
  + especificaciones_tecnicas: JSON
  + imagen_360: Text
  + horario: String(80)
  + imagenes: JSON
  + radio_km: Float
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class Oferta {
  + id: Integer PK
  + solicitud_id: Integer FK
  + pds_id: Integer FK
  + monto: Float
  + mensaje: Text
  + fecha_deseada: Date
  + horario: String(80)
  + estado: String(20) [pendiente, aceptada, rechazada, contraoferta, cancelada]
  + contra_monto: Float
  + contra_mensaje: Text
  + contra_fecha_deseada: Date
  + contra_horario: String(80)
  + created_at: DateTime
  + updated_at: DateTime
}

class Rating {
  + id: Integer PK
  + service_id: Integer FK
  + autor_id: Integer FK
  + calificado_id: Integer FK
  + puntaje: Integer (1-5)
  + comentario: Text
  + reportado: Boolean
  + creado_en: DateTime
}

' ── Contracts & Execution ──────────────────────────────────
class Contract {
  + id: Integer PK
  + service_id: Integer FK
  + proveedor_id: Integer FK
  + solicitante_id: Integer FK
  + estado: Enum[EstadoContrato] [pendiente, en_progreso, completado_pendiente, completado, cancelado, marcado]
  + motivo_cancelacion: String(500)
  + inicio_en: DateTime
  + fin_en: DateTime
  + confirmado_en: DateTime
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class Chamba {
  + id: Integer PK
  + contract_id: Integer FK,UK
  + estado: Enum[EstadoChamba] [programada, en_proceso, en_ejecucion, pausada, pendiente_validacion, liquidacion_confirmada, finalizada]
  + estado_previo: Enum[EstadoChamba]
  + fecha_activacion: DateTime
  + fecha_inicio_obra: DateTime
  + fecha_solicitud_cierre: DateTime
  + fecha_validacion: DateTime
  + fecha_liquidacion: DateTime
  + fecha_finalizacion: DateTime
  + evidencia_entrada: JSON
  + evidencia_salida: JSON
  + adendas: JSON
  + novedades: JSON
  + pago_confirmado_solicitante: Boolean
  + pago_confirmado_prestador: Boolean
  + pago_directo_confirmado: Boolean
  + pago_monto_final: Integer
  + rating_estrellas: Integer
  + rating_comentario: Text
  + habilidades_validadas: JSON
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class Dispute {
  + id: Integer PK
  + contract_id: Integer FK
  + reason: Text
  + status: String(20) [abierta, resuelta]
  + resolved_by: Integer FK
  + resolved_at: DateTime
  + resolution: Text
  + created_at: DateTime
}

class Milestone {
  + id: Integer PK
  + contract_id: Integer FK
  + numero: Integer
  + descripcion: Text
  + monto: Integer
  + estado: Enum[EstadoHito] [pendiente, aprobado, rechazado]
  + aprobado_en: DateTime
  + created_at: DateTime
}

class Modalidad {
  + id: Integer PK
  + service_id: Integer FK,UK
  + tipo: Enum[TipoModalidad] [A_comision, B_sin_comision]
  + monedas_requeridas: Integer
  + created_at: DateTime
}

' ── Marana (Rebusque) ──────────────────────────────────────
class Marana {
  + id: Integer PK
  + chamba_id: Integer FK
  + adenda_idx: Integer
  + solicitante_id: Integer FK
  + titulo: String(200)
  + categoria: String(120)
  + descripcion: Text
  + presupuesto: Integer
  + ubicacion: String(120)
  + latitud: Float
  + longitud: Float
  + fecha_deseada: Date
  + horario: String(80)
  + estado: Enum[EstadoMarana] [publicado, asignado, completado, pagado, cancelado]
  + pago_confirmado_solicitante: Boolean
  + pago_confirmado_prestador: Boolean
  + pago_monto_final: Integer
  + pds_asignado_id: Integer FK
  + fecha_asignacion: DateTime
  + fecha_entrega: DateTime
  + fecha_pago: DateTime
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class MaranaOferta {
  + id: Integer PK
  + marana_id: Integer FK
  + pds_id: Integer FK
  + monto: Integer
  + mensaje: Text
  + estado: String(20) [pendiente, aceptada, rechazada, contraoferta]
  + contra_monto: Integer
  + contra_mensaje: Text
  + created_at: DateTime
  + updated_at: DateTime
}

' ── Anuncios Laborales ─────────────────────────────────────
class AnuncioLaboral {
  + id: Integer PK
  + negocio_id: Integer FK
  + titulo: String(200)
  + descripcion: Text
  + categoria: String(120)
  + ubicacion: String(160)
  + latitud: Float
  + longitud: Float
  + vacantes: Integer
  + estado: Enum[EstadoAnuncio] [publicado, cerrado]
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class AnuncioPostulacion {
  + id: Integer PK
  + anuncio_id: Integer FK
  + pds_id: Integer FK
  + mensaje: Text
  + telefono_contacto: String(40)
  + email_contacto: String(120)
  + estado: Enum[EstadoPostulacionAnuncio] [pendiente, contactado, descartado]
  + created_at: DateTime
  + updated_at: DateTime
}

' ── Negocios ───────────────────────────────────────────────
class Negocio {
  + id: Integer PK
  + owner_id: Integer FK
  + nombre: String(150)
  + slug: String(170) UK
  + descripcion: Text
  + tipo: String(30) [comercio, servicio, virtual, hibrido]
  + logo_url: String(500)
  + banner_url: String(500)
  + imagenes: JSON
  + latitud: Float
  + longitud: Float
  + direccion: String(255)
  + ciudad: String(100)
  + departamento: String(100)
  + radio_cobertura_km: Float
  + geom: Geometry(POINT,4326)
  + categoria_principal: String(120)
  + categorias_secundarias: JSON
  + servicios: JSON
  + palabras_clave: JSON
  + whatsapp: String(30)
  + whatsapp_mensaje_pre: Text
  + instagram: String(255)
  + facebook: String(255)
  + tiktok: String(255)
  + sitio_web: String(255)
  + calificacion_promedio: Float
  + total_calificaciones: Integer
  + verificado: Boolean
  + estado: String(30) [borrador, pendiente_verificacion, activo, suspendido, rechazado]
  + motivo_rechazo: Text
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class NegocioHorario {
  + id: Integer PK
  + negocio_id: Integer FK
  + dia_semana: Integer (0=Lun, 6=Dom)
  + abierto: Boolean
  + hora_apertura: Time
  + hora_cierre: Time
}

class NegocioRating {
  + id: Integer PK
  + negocio_id: Integer FK
  + autor_id: Integer FK
  + puntaje: Integer (1-5)
  + comentario: Text
  + reportado: Boolean
  + creado_en: DateTime
}

class NegocioReporte {
  + id: Integer PK
  + negocio_id: Integer FK
  + reporter_id: Integer FK
  + tipo: String(30) [fraude, spam, contenido_inapropiado, servicio_no_prestado, otro]
  + descripcion: Text
  + estado: String(30) [abierto, investigando, resuelto, desestimado]
  + ticket_id: Integer FK
  + creado_en: DateTime
}

' ── Wallet & Payments ──────────────────────────────────────
class Wallet {
  + id: Integer PK
  + user_id: Integer FK,UK
  + saldo: Integer (COP)
  + saldo_bloqueado: Integer (COP)
  + created_at: DateTime
  + updated_at: DateTime
}

class Transaction {
  + id: Integer PK
  + wallet_id: Integer FK
  + tipo: Enum[TipoTransaccion] [comision, monedas, retiro, reembolso, deposito]
  + monto: Integer (COP)
  + descripcion: Text
  + referencia: String(100)
  + created_at: DateTime
}

class Coin {
  + id: Integer PK
  + user_id: Integer FK
  + cantidad: Integer
  + tipo: Enum[TipoMoneda] [comprada, promocional, ganada]
  + vence_en: DateTime
  + created_at: DateTime
}

class Payment {
  + id: Integer PK
  + contract_id: Integer FK,UK
  + monto: Integer (COP)
  + comision_pds: Integer (12%)
  + comision_solicitante: Integer (8%)
  + estado: Enum[EstadoPago] [pendiente, completado, reembolsado, fallido]
  + pasarela: String(50) [mock, nequi]
  + referencia_pasarela: String(255)
  + motivo_reembolso: String(500)
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class MetodoPago {
  + id: Integer PK
  + user_id: Integer FK
  + tipo: String(30) [billetera, banco]
  + banco: String(120)
  + numero_cuenta: String(60)
  + es_principal: Boolean
  + creado_en: DateTime
}

class MerchantPaymentMethod {
  + id: Integer PK
  + user_id: Integer FK
  + tipo: String(30) [nequi, bancolombia, efectivo, ...]
  + detalle: JSON
  + principal: Boolean
  + activo: Boolean
  + creado_en: DateTime
}

class MerchantPreference {
  + id: Integer PK
  + user_id: Integer FK,UK
  + notif_nueva_solicitud: Boolean
  + notif_nueva_resena: Boolean
  + notif_estado_kyc: Boolean
  + notif_pago_recibido: Boolean
  + push_enabled: Boolean
  + email_digest: String(10) [daily, weekly, never]
  + idioma: String(5)
  + tema: String(10) [system, light, dark]
  + creado_en: DateTime
  + actualizado_en: DateTime
}

class Subscription {
  + id: Integer PK
  + user_id: Integer FK,UK
  + plan: String(20) [free, basico, profesional]
  + estado: String(20) [activa, cancelada, vencida]
  + inicio_en: DateTime
  + fin_en: DateTime
  + monto: Integer
  + metodo_pago: String(20)
  + creado_en: DateTime
  + actualizado_en: DateTime
}

' ── KYC & Documents ────────────────────────────────────────
class DocumentoRequerido {
  + id: Integer PK
  + rol: String(30) [pds, solicitante]
  + clave: String(60)
  + nombre: String(120)
  + descripcion: Text
  + obligatorio: Boolean
  + grupo: String(30) [identidad, antecedentes, financiero, opcional]
  + multi_instancia: Boolean
  + orden: Integer
}

class DocumentoUsuario {
  + id: Integer PK
  + user_id: Integer FK
  + documento_requerido_id: Integer FK
  + documento_clave: String(60)
  + instancia: String(120)
  + rol: String(30)
  + estado: String(20) [no_enviado, enviado, aprobado, rechazado]
  + url: String(512)
  + archivo_base64: Text
  + nombre_archivo: String(255)
  + tipo_mime: String(100)
  + fecha_envio: DateTime
  + revisado_en: DateTime
  + revisor_id: Integer FK
  + nota: Text
}

' ── Skills & Certifications ────────────────────────────────
class Habilidad {
  + id: Integer PK
  + nombre: String(120) UK
  + descripcion: String(500)
  + categoria: String(60) [construccion, climatizacion, domesticos, estetica, mecanica]
  + habilidades: JSON
  + niveles: JSON [(nombre, tipo: quiz|certificacion, quiz: [...])]
  + activa: Boolean
  + creado_en: DateTime
}

class HabilidadNivel {
  + id: Integer PK
  + user_id: Integer FK
  + habilidad_id: Integer FK
  + nivel_index: Integer
  + metodo: String(20) [quiz, certificacion]
  + evidencia_url: String(500)
  + fecha: DateTime
}

class EndosoHabilidad {
  + id: Integer PK
  + contract_id: Integer FK
  + pds_id: Integer FK
  + solicitante_id: Integer FK
  + habilidad_id: Integer FK
  + competencia: String(150)
  + creado_en: DateTime
}

class CertificacionTecnica {
  + id: Integer PK
  + user_id: Integer FK
  + habilidad_id: Integer FK
  + institucion: String(150)
  + titulo: String(200)
  + anio: Integer
  + codigo_verificacion: String(120)
  + documento_url: String(500)
  + estado: String(20) [en_revision, verificado, rechazado]
  + creado_en: DateTime
}

' ── Portfolio & Trust ──────────────────────────────────────
class PortfolioItem {
  + id: Integer PK
  + pds_id: Integer FK
  + titulo: String(100)
  + descripcion: String(500)
  + tipo: Enum [foto, video, documento]
  + categoria: String(50)
  + s3_key: String(500)
  + url: String(500)
  + file_size_bytes: BigInteger
  + mime_type: String(50)
  + estado: Enum [pendiente_revision, aprobado, rechazado]
  + verificado_por: Integer FK
  + verificado_en: DateTime
  + vistas: Integer
  + created_at: DateTime
}

class TrustScore {
  + id: Integer PK
  + pds_id: Integer FK,UK
  + kyc_verificado: Boolean
  + portfolio_calidad: Float
  + rating_score: Float
  + contratos_completados: Integer
  + referidos_count: Integer
  + puntuacion: Float (0-1)
  + nivel: Enum [nuevo, confiable, verificado, experto]
  + componentes_json: JSON
  + calculado_en: DateTime
  + version: Integer
}

class Badge {
  + id: Integer PK
  + usuario_id: Integer FK
  + tipo: String(50) [primer_contrato, diez_contratos, cien_contratos, verificado, perfil_completo, primer_servicio, top_rated, sin_disputas, monedero_activo]
  + activo: Boolean
  + otorgado_en: DateTime
}

' ── Messaging & Notifications ──────────────────────────────
class Conversation {
  + id: Integer PK
  + user_a_id: Integer FK
  + user_b_id: Integer FK
  + creado_en: DateTime
}

class Message {
  + id: Integer PK
  + conversation_id: Integer FK
  + sender_id: Integer FK
  + contenido: Text
  + leido: Boolean
  + creado_en: DateTime
}

class Notification {
  + id: Integer PK
  + user_id: Integer FK
  + tipo: String(40)
  + titulo: String(200)
  + mensaje: Text
  + datos: JSON
  + leida: Boolean
  + creado_en: DateTime
}

class Ticket {
  + id: Integer PK
  + user_id: Integer FK
  + subject: String(200)
  + body: Text
  + status: String(20) [open, pending, closed]
  + priority: String(20) [low, normal, high]
  + assigned_to: Integer
  + created_at: DateTime
  + resolved_at: DateTime
}

' ── Admin & System ─────────────────────────────────────────
class AuditLog {
  + id: Integer PK
  + actor_id: Integer
  + action: String(100)
  + entity_type: String(50)
  + entity_id: Integer
  + before_json: Text
  + after_json: Text
  + ip: String(45)
  + created_at: DateTime
}

class SystemConfig {
  + id: Integer PK
  + key: String(100) UK
  + value: Text
  + value_type: String(20) [int, float, string, bool, json]
  + description: Text
  + updated_by: Integer
  + updated_at: DateTime
}

class FeatureFlag {
  + id: Integer PK
  + key: String(100) UK
  + enabled: Boolean
  + description: Text
}

' ── ML & Recommendations ───────────────────────────────────
class RecommendationLog {
  + id: Integer PK
  + solicitud_id: Integer FK
  + pds_id: Integer FK
  + puntuacion: Float
  + ranking_pos: Integer
  + features_snapshot: JSON
  + modelo_nombre: String(50) [lightgbm_v1, heuristic]
  + modelo_version: String(50)
  + notificado: Boolean
  + respondio: Boolean
  + aceptado: Boolean
  + experiment_group: String(50) [A, B]
  + created_at: DateTime
}

' ═════════════════════════════════════════════════════════════
' RELATIONSHIPS (sintaxis PlantUML válida, sin notación crow's foot)
' ═════════════════════════════════════════════════════════════

' User core
User "1" -- "1" Profile : "1:1"
User "1" -- "0..*" LegalAcceptance : "1:N"
User "1" -- "0..*" Verification : "1:N"
User "1..*" -- "0..1" Region : "N:1"
User "1" -- "1" Wallet : "1:1"
User "1" -- "0..*" Coin : "1:N"
User "1" -- "0..*" MetodoPago : "1:N"
User "1" -- "1" Subscription : "1:1"
User "1" -- "0..*" PortfolioItem : "pds"
User "1" -- "1" TrustScore : "1:1"
User "1" -- "0..*" Badge : "1:N"
User "1" -- "0..*" DocumentoUsuario : "1:N"
User "1" -- "0..*" HabilidadNivel : "1:N"
User "1" -- "0..*" CertificacionTecnica : "1:N"
User "1" -- "0..*" EndosoHabilidad : "pds"
User "1" -- "0..*" EndosoHabilidad : "solicitante"
User "1" -- "0..*" Conversation : "user_a"
User "1" -- "0..*" Conversation : "user_b"
User "1" -- "0..*" Message : "sender"
User "1" -- "0..*" Notification : "1:N"
User "1" -- "0..*" Ticket : "1:N"

' Solicitudes
User "1" -- "0..*" Solicitud : "solicitante"
Solicitud "1" -- "0..*" Oferta : "1:N"
Solicitud "1" -- "0..*" Rating : "1:N"
Solicitud "1" -- "0..1" Contract : "service"
Solicitud "1" -- "1" Modalidad : "1:1"
Solicitud "1" -- "0..*" RecommendationLog : "1:N"

User "1" -- "0..*" Oferta : "pds"
User "1" -- "0..*" Rating : "autor"
User "1" -- "0..*" Rating : "calificado"

' Contracts
User "1" -- "0..*" Contract : "proveedor"
User "1" -- "0..*" Contract : "solicitante"
Contract "1" -- "0..*" Dispute : "1:N"
Contract "1" -- "1" Chamba : "1:1"
Contract "1" -- "0..*" Milestone : "1:N"
Contract "1" -- "1" Payment : "1:1"
Contract "1" -- "0..*" EndosoHabilidad : "1:N"

Chamba "1" -- "0..*" Marana : "1:N"

' Marana
User "1" -- "0..*" Marana : "solicitante"
User "1" -- "0..*" Marana : "pds_asignado"
Marana "1" -- "0..*" MaranaOferta : "1:N"
User "1" -- "0..*" MaranaOferta : "pds"

' Anuncios
User "1" -- "0..*" AnuncioLaboral : "negocio"
AnuncioLaboral "1" -- "0..*" AnuncioPostulacion : "1:N"
User "1" -- "0..*" AnuncioPostulacion : "pds"

' Negocios
User "1" -- "0..*" Negocio : "owner"
Negocio "1" -- "0..*" NegocioHorario : "1:N"
Negocio "1" -- "0..*" NegocioRating : "1:N"
Negocio "1" -- "0..*" NegocioReporte : "1:N"
User "1" -- "0..*" NegocioRating : "autor"
User "1" -- "0..*" NegocioReporte : "reporter"

' Wallet
Wallet "1" -- "0..*" Transaction : "1:N"

' KYC
DocumentoRequerido "1" -- "0..*" DocumentoUsuario : "1:N"

' Skills
Habilidad "1" -- "0..*" HabilidadNivel : "1:N"
Habilidad "1" -- "0..*" EndosoHabilidad : "1:N"
Habilidad "1" -- "0..*" CertificacionTecnica : "1:N"

' Portfolio
User "1" -- "0..*" PortfolioItem : "verificado_por"

' Messaging
Conversation "1" -- "0..*" Message : "1:N"

' Notes
note right of User
  Entidad central con 7 roles.
  RBAC Fase 1-3 implementado.
end note

note right of Chamba
  Ciclo 6 hitos:
  PROGRAMADA → EN_PROCESO → EN_EJECUCION
  → PENDIENTE_VALIDACION → LIQUIDACION_CONFIRMADA → FINALIZADA
end note

note right of Modalidad
  A_comision: 12% PDS + 8% Solicitante
  B_sin_comision: usa monedas (Coin)
end note

note right of TrustScore
  Score 0-1 ponderado:
  KYC 25% + Rating 25% + Contratos 20%
  + Portfolio 15% + Referidos 15%
  Niveles: nuevo <0.4, confiable <0.6, verificado <0.8, experto
end note

note right of RecommendationLog
  A/B testing para ML recommender
  lightgbm_v1 vs heuristic
end note

@enduml
```

---

## 2. Resumen de Entidades (46 total)

### Core Users & Auth (6)
| Entidad | Descripción |
|---------|-------------|
| `User` | Entidad central con 7 roles (PDS, SOLICITANTE, MERCHANT, VERIFICADOR, SOPORTE, ADMIN, SUPERADMIN), RBAC Fase 1-3, `role_version` para revocación de sesión |
| `Profile` | Perfil extendido: skills JSON, rating, badges, portfolio, geolocalización (PostGIS Point), plan suscripción [free/basico/profesional] |
| `Region` | Divisiones administrativas DANE para RBAC regional, `departamentos` JSON |
| `LegalAcceptance` | Trazabilidad clickwrap Términos y Condiciones (Ley 527/1999) |
| `Verification` | Solicitudes KYC revisadas por Verificadores, estado [pending/approved/rejected] |
| `Badge` | Logros: primer_contrato, diez_contratos, cien_contratos, verificado, perfil_completo, primer_servicio, top_rated, sin_disputas, monedero_activo |

### Solicitudes & Negotiation (3)
| Entidad | Descripción |
|---------|-------------|
| `Solicitud` | Publicaciones de servicio con geocerca PostGIS (`radio_km`), panorama 360°, urgencia [hoy/semana/flexible], 8 estados |
| `Oferta` | Propuestas de PDS con negociación bilateral (contraofertas precio/fecha/horario) |
| `Rating` | Calificaciones mutuas 1-5 post-completado, UNIQUE (service_id, autor_id) |

### Contracts & Execution (6)
| Entidad | Descripción |
|---------|-------------|
| `Contract` | Contrato formal desde Oferta aceptada (RF-07), FSM 6 estados, firma digital SHA256 |
| `Chamba` | Ciclo de ejecución 6 hitos (PROGRAMADA → FINALIZADA), check-in/out GPS <100m, evidencias, adendas, novedades |
| `Dispute` | Disputas/escalamientos de contratos, estado [abierta/resuelta], laudo |
| `Milestone` | Hitos de pago para contratos largos (RF-29), 6 hitos máx, estado [pendiente/aprobado/rechazado] |
| `Modalidad` | A_comision (12% PDS + 8% Solicitante = 20% plataforma) vs B_sin_comision (monedas Coin) (RF-26) |
| `Payment` | Pagos de contratos con comisiones, conformidad dual, pasarela [mock/nequi], Escrow 72h |

### Marana / Rebusque (2)
| Entidad | Descripción |
|---------|-------------|
| `Marana` | Micro-tareas derivadas de adendas de Chamba, ciclo ágil 3 estados (publicado→asignado→completado→pagado) |
| `MaranaOferta` | Postulaciones de PDS a Maranas con negociación |

### Anuncios Laborales (2)
| Entidad | Descripción |
|---------|-------------|
| `AnuncioLaboral` | Ofertas laborales no vinculantes de Negocios (empleo fijo vs chamba escrow) |
| `AnuncioPostulacion` | Postulaciones de PDS con datos de contacto directo (tel/email) |

### Negocios / Merchant (4)
| Entidad | Descripción |
|---------|-------------|
| `Negocio` | Establecimientos merchant geolocalizados (PostGIS Point), reputación, redes sociales, estado [borrador/pendiente_verificacion/activo/suspendido/rechazado] |
| `NegocioHorario` | Horarios semanales de atención (0=Lun..6=Dom), UNIQUE (negocio_id, dia_semana) |
| `NegocioRating` | Calificaciones de clientes a Negocios 1-5, UNIQUE (negocio_id, autor_id) |
| `NegocioReporte` | Reportes/quejas comunitarias [fraude/spam/contenido_inapropiado/servicio_no_prestado/otro], estado [abierto/investigando/resuelto/desestimado] |

### Wallet & Payments (8)
| Entidad | Descripción |
|---------|-------------|
| `Wallet` | Billetera virtual por usuario (saldo COP, saldo_bloqueado para escrow/retiros) |
| `Transaction` | Movimientos partida doble: DEBE/HABER, tipo [comision/monedas/retiro/reembolso/deposito], invariante Σ(DEBE)=Σ(HABER) |
| `Coin` | Monedas usuario: COMPRADA (no expiran, FIFO), PROMOCIONAL (vence_en, uso prioritario), GANADA (sin expiración, uso último) |
| `Payment` | Pagos de contratos, comision_pds=12%, comision_solicitante=8%, conformidad dual obligatoria |
| `MetodoPago` | Métodos usuario: tipo [billetera/banco], cuenta principal |
| `MerchantPaymentMethod` | Métodos negocio: tipo [nequi/bancolombia/efectivo...], detalle JSON |
| `MerchantPreference` | Preferencias UI/notificaciones: push_enabled, email_digest [daily/weekly/never], tema [system/light/dark] |
| `Subscription` | Suscripciones premium simuladas: plan [free/basico/profesional], estado [activa/cancelada/vencida] |

### KYC & Documents (2)
| Entidad | Descripción |
|---------|-------------|
| `DocumentoRequerido` | Catálogo docs por rol [pds/solicitante], grupo [identidad/antecedentes/financiero/opcional], multi_instancia, orden |
| `DocumentoUsuario` | Estado documental por usuario: estado [no_enviado/enviado/aprobado/rechazado], archivo_base64 (MVP), URL MinIO, revisor_id |

### Skills & Certifications (4)
| Entidad | Descripción |
|---------|-------------|
| `Habilidad` | Catálogo oficios (construccion/climatizacion/domesticos/estetica/mecanica), rutas certificables JSON (quiz/certificación) |
| `HabilidadNivel` | Progreso usuario por nivel: metodo [quiz/certificacion], evidencia_url, UNIQUE (user_id, habilidad_id, nivel_index) |
| `EndosoHabilidad` | Endosos de clientes a competencias PDS al cerrar contrato, UNIQUE (contract, pds, habilidad, competencia) |
| `CertificacionTecnica` | Certificaciones formales (SENA, instituciones), codigo_verificacion, estado [en_revision/verificado/rechazado] |

### Portfolio & Trust (3)
| Entidad | Descripción |
|---------|-------------|
| `PortfolioItem` | Items portafolio PDS (foto/video/documento), MinIO S3, moderación [pendiente_revision/aprobado/rechazado], verificado_por FK |
| `TrustScore` | Score consolidado 0-1 (KYC 25% + Rating 25% + Contratos 20% + Portfolio 15% + Referidos 15%), niveles [nuevo/confiable/verificado/experto], recálculo nocturno |
| `Badge` | Ver tabla Core (9 tipos) |

### Messaging & Notifications (4)
| Entidad | Descripción |
|---------|-------------|
| `Conversation` | Chat 1:1 normalizado (user_a_id < user_b_id), UNIQUE |
| `Message` | Mensajes con protocolo `⟦c:action⟧` para acciones contractuales |
| `Notification` | Centro alertas persistente (RF-10), tipo[40], datos JSON, leida |
| `Ticket` | Tickets soporte (RBAC Fase 2), status [open/pending/closed], priority [low/normal/high] |

### Admin & System (3)
| Entidad | Descripción |
|---------|-------------|
| `AuditLog` | Trazabilidad inmutable acciones admin (RNF-AUD), append-only, hash chain, snapshot_diff_json {before/after}, retención 10 años |
| `SystemConfig` | Config global tipada: value_type [int/float/string/bool/json] |
| `FeatureFlag` | Toggles calientes sin deploy: cache memoria + invalidación Redis pub/sub (5s) |

### ML & Recommendations (1)
| Entidad | Descripción |
|---------|-------------|
| `RecommendationLog` | Log A/B testing: grupo [A/B], modelo [lightgbm_v1/heuristic], SHAP explanations, metrics (CTR, contratación, tiempo primera oferta) |

---

## 3. Relaciones Clave (Extraídas del .puml corregido)

```
User (1) ── (1) Profile
User (1) ── (N) LegalAcceptance
User (1) ── (N) Verification
User (N) ── (1) Region
User (1) ── (1) Wallet
User (1) ── (N) Coin
User (1) ── (N) MetodoPago
User (1) ── (1) Subscription
User (1) ── (N) PortfolioItem [pds]
User (1) ── (1) TrustScore
User (1) ── (N) Badge
User (1) ── (N) DocumentoUsuario
User (1) ── (N) HabilidadNivel
User (1) ── (N) CertificacionTecnica
User (1) ── (N) EndosoHabilidad [pds]
User (1) ── (N) EndosoHabilidad [solicitante]
User (1) ── (N) Conversation [user_a]
User (1) ── (N) Conversation [user_b]
User (1) ── (N) Message [sender]
User (1) ── (N) Notification
User (1) ── (N) Ticket

User (1) ── (N) Solicitud [solicitante]
Solicitud (1) ── (N) Oferta
Solicitud (1) ── (N) Rating
Solicitud (1) ── (0..1) Contract [service]
Solicitud (1) ── (1) Modalidad
Solicitud (1) ── (N) RecommendationLog

User (1) ── (N) Oferta [pds]
User (1) ── (N) Rating [autor]
User (1) ── (N) Rating [calificado]

User (1) ── (N) Contract [proveedor]
User (1) ── (N) Contract [solicitante]
Contract (1) ── (N) Dispute
Contract (1) ── (1) Chamba
Contract (1) ── (N) Milestone
Contract (1) ── (1) Payment
Contract (1) ── (N) EndosoHabilidad

Chamba (1) ── (N) Marana

User (1) ── (N) Marana [solicitante]
User (1) ── (N) Marana [pds_asignado]
Marana (1) ── (N) MaranaOferta
User (1) ── (N) MaranaOferta [pds]

User (1) ── (N) AnuncioLaboral [negocio]
AnuncioLaboral (1) ── (N) AnuncioPostulacion
User (1) ── (N) AnuncioPostulacion [pds]

User (1) ── (N) Negocio [owner]
Negocio (1) ── (N) NegocioHorario
Negocio (1) ── (N) NegocioRating
Negocio (1) ── (N) NegocioReporte
User (1) ── (N) NegocioRating [autor]
User (1) ── (N) NegocioReporte [reporter]

Wallet (1) ── (N) Transaction

DocumentoRequerido (1) ── (N) DocumentoUsuario

Habilidad (1) ── (N) HabilidadNivel
Habilidad (1) ── (N) EndosoHabilidad
Habilidad (1) ── (N) CertificacionTecnica

User (1) ── (N) PortfolioItem [verificado_por]

Conversation (1) ── (N) Message
```

---

## 4. Índices y Constraints Críticos

| Tabla | Índice / Constraint | Propósito |
|-------|---------------------|-----------|
| `users` | `ix_users_region_id`, `email UK`, `username UK` | Scoping regional, login único |
| `profiles` | `geom GIST (PostGIS)` | Búsquedas proximidad ST_DWithin |
| `solicitudes` | `geom GIST`, `ix_solicitudes_solicitante_id`, `estado` | Feed geoespacial, mis solicitudes |
| `ofertas` | `ix_ofertas_solicitud_id`, `ix_ofertas_pds_id` | Ofertas por solicitud / por PDS |
| `contracts` | `service_id UK`, `proveedor_id`, `solicitante_id` | Un contrato por servicio |
| `chambas` | `contract_id UK,FK` | Una chamba por contrato |
| `wallets` | `user_id UK` | Una wallet por usuario |
| `wallet_transactions` | `wallet_id`, `tipo`, `created_at` | Libro contable ordenado |
| `coins` | `user_id`, `tipo`, `vence_en` | FIFO por expiración |
| `payments` | `contract_id UK` | Un pago por contrato |
| `negocios` | `slug UK`, `geom GIST`, `ix_negocios_estado_categoria` | Directorio público |
| `conversations` | `UNIQUE (user_a_id, user_b_id)` | Chat 1:1 normalizado |
| `notifications` | `user_id`, `leida`, `created_at DESC` | Centro alertas RF-10 |
| `audit_logs` | `actor_id`, `entity_type`, `entity_id`, `created_at` | Pista forense |

---

## 5. Enums Principales (PostgreSQL)

| Enum | Valores |
|------|---------|
| `RolUsuario` | PDS, SOLICITANTE, MERCHANT, VERIFICADOR, SOPORTE, ADMIN, SUPERADMIN |
| `EstadoSolicitud` | borrador, publicado, en_progreso, completado, cancelado, oculto, rechazado, asignada |
| `UrgenciaSolicitud` | hoy, semana, flexible |
| `EstadoOferta` | pendiente, aceptada, rechazada, contraoferta, cancelada |
| `EstadoContrato` | pendiente, en_progreso, completado_pendiente, completado, cancelado, marcado |
| `EstadoChamba` | programada, en_proceso, en_ejecucion, pausada, pendiente_validacion, liquidacion_confirmada, finalizada |
| `EstadoMarana` | publicado, asignado, completado, pagado, cancelado |
| `EstadoAnuncio` | publicado, cerrado |
| `EstadoPostulacionAnuncio` | pendiente, contactado, descartado |
| `TipoNegocio` | comercio, servicio, virtual, hibrido |
| `EstadoNegocio` | borrador, pendiente_verificacion, activo, suspendido, rechazado |
| `TipoReporteNegocio` | fraude, spam, contenido_inapropiado, servicio_no_prestado, otro |
| `TipoModalidad` | A_comision, B_sin_comision |
| `EstadoHito` | pendiente, aprobado, rechazado |
| `TipoTransaccion` | comision, monedas, retiro, reembolso, deposito |
| `TipoMoneda` | comprada, promocional, ganada |
| `EstadoPago` | pendiente, completado, reembolsado, fallido |
| `EstadoDocumento` | no_enviado, enviado, aprobado, rechazado |
| `GrupoDocumento` | identidad, antecedentes, financiero, opcional |

---

## 6. Notas Técnicas del Diagrama

- **User (entidad central)**: 7 roles implementados con RBAC Fase 1-3. `role_version` permite revocación inmediata de sesión sin blacklist en Redis.
- **Chamba (ciclo 6 hitos)**: PROGRAMADA → EN_PROCESO → EN_EJECUCION → PENDIENTE_VALIDACION → LIQUIDACION_CONFIRMADA → FINALIZADA. Check-in/out GPS validado con Haversine <100m.
- **Modalidad A vs B**: A_comision = 20% total plataforma (12% PDS + 8% Solicitante), conformidad dual obligatoria. B_sin_comision = 0% comisión, consume Coin COMPRADA.
- **TrustScore**: Score 0-1 ponderado (KYC 25% + Rating 25% + Contratos 20% + Portfolio 15% + Referidos 15%). Niveles: nuevo <0.4, confiable <0.6, verificado <0.8, experto. Recalculado nocturnamente.
- **RecommendationLog**: A/B testing para ML recommender. Grupo A: LightGBM v1 (producción), Grupo B: Heuristic (control). Asignación: hash(user_id + solicitud_id) % 2.

---

*Generado automáticamente desde `15_modelo_datos_completo.puml` (Figura 15) — 46 entidades, sintaxis PlantUML válida con `!pragma layout smetana`*