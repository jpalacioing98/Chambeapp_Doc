# Contratos de API — ChambeApp Backend (Inventario Real vs Documentación)

> **Fuente:** `Chambeapp_backend/app/__init__.py` (registro de blueprints) + `app/controllers/*.py` (rutas reales).
> **Fecha:** 2026-09-25.
> **Estado:** Inventario exhaustivo de TODOS los endpoints registrados en el backend Flask-Smorest.
>
> **Leyenda:**
> - ✅ = endpoint (o equivalente directo) ya mencionado en `Arquitectura_Software.md` y/o `DOCUMENTACION_SOFTWARE.md`.
> - ❌ = endpoint **NO** mencionado en la documentación (nuevo / sin documentar).
> - Permisos: `público` (sin JWT), `jwt` (JWT requerido), `jwt?` (JWT opcional), `role:[...]` (rol del claim), `admin` (admin|superadmin), `superadmin`.

---

## 1. Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Blueprints registrados (Flask-Smorest) | **36** |
| Rutas/endpoints totales | **218** |
| Endpoints documentados (✅) | ~45 |
| Endpoints sin documentar (❌) | ~173 |
| Handlers Socket.IO | 3 (`chat_socket`, `oferta_socket`, `notification_socket`) |
| Prefijo base | `/api/v1` |

**Módulos completamente ausentes de la doc:** chambas, marañas, ofertas, anuncios, negocios, merchant, habilidades, regiones, KYC, admin, superadmin, tickets, disputas, métodos de pago, providers, 2FA, OTP.

---

## 2. Tabla Maestra de Blueprints (ordenada por módulo)

| # | Blueprint | Archivo | Prefijo | Rutas |
|---|---|---|---|---|
| 1 | `auth` | `routes/auth.py` | `/api/v1/auth` | 5 |
| 2 | `auth_password` | `routes/auth_password.py` | `/api/v1/auth` | 3 |
| 3 | `email_verification` | `routes/email_verification.py` | `/api/v1/auth` | 3 |
| 4 | `otp` | `routes/otp.py` | `/api/v1/auth` | 2 |
| 5 | `two_factor` | `routes/two_factor.py` | `/api/v1/auth` | 2 |
| 6 | `users` | `routes/users.py` | `/api/v1/users` | 6 |
| 7 | `user_preferences` | `routes/user_preferences.py` | `/api/v1/users` | 2 |
| 8 | `solicitudes` | `routes/solicitudes.py` | `/api/v1/solicitudes` | 7 |
| 9 | `ofertas` | `routes/ofertas.py` | `/api/v1` | 4 |
| 10 | `contracts` | `routes/contracts.py` | `/api/v1/contracts` | 4 |
| 11 | `chambas` | `routes/chambas.py` | `/api/v1/chambas` | 16 |
| 12 | `maranas` | `routes/maranas.py` | `/api/v1/maranas` | 10 |
| 13 | `anuncios` | `routes/anuncios.py` | `/api/v1/anuncios` | 8 |
| 14 | `negocios` | `routes/negocios.py` | `/api/v1/negocios` | 18 |
| 15 | `merchant` | `routes/merchant.py` | `/api/v1/merchant` | 5 |
| 16 | `habilidades` | `routes/habilidades.py` | `/api/v1` | 11 |
| 17 | `kyc` | `routes/kyc.py` | `/api/v1/kyc` | 6 |
| 18 | `notifications` | `routes/notifications.py` | `/api/v1/notifications` | 6 |
| 19 | `payments` | `routes/payments.py` | `/api/v1/payments` | 11 |
| 20 | `payment_methods` | `routes/payment_methods.py` | `/api/v1/metodos-pago` | 4 |
| 21 | `wallet` | `routes/wallet.py` | `/api/v1/wallet` | 14 |
| 22 | `subscriptions` | `routes/subscriptions.py` | `/api/v1/subscriptions` | 4 |
| 23 | `prices` | `routes/prices.py` | `/api/v1/prices` | 2 |
| 24 | `ai` | `routes/ai.py` | `/api/v1/ai` | 2 |
| 25 | `ai_metrics` | `routes/ai_metrics.py` | `/api/v1/ai` | 2 |
| 26 | `chat` | `routes/chat.py` | `/api/v1/chat` | 5 |
| 27 | `disputes` | `routes/disputes.py` | `/api/v1` | 3 |
| 28 | `tickets` | `routes/tickets.py` | `/api/v1/tickets` | 1 |
| 29 | `admin` | `routes/admin.py` | `/api/v1/admin` | 21 |
| 30 | `superadmin` | `routes/superadmin.py` | `/api/v1/superadmin` | 17 |
| 31 | `legal` | `routes/legal.py` | `/api/v1/legal` | 2 |
| 32 | `providers` | `routes/providers.py` | `/api/v1/providers` | 1 |
| 33 | `onboarding` | `routes/onboarding.py` | `/api/v1/onboarding` | 3 |
| 34 | `portfolio` | `routes/portfolio.py` | `/api/v1/portfolio` | 5 |
| 35 | `trust` | `routes/trust.py` | `/api/v1/trust` | 1 |
| 36 | `regions` | `routes/regions.py` | `/api/v1/regions` | 2 |

---

## 3. Contratos por Módulo

### 3.1 Auth — `/api/v1/auth` (blueprints: `auth`, `auth_password`, `email_verification`, `otp`, `two_factor`)

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/auth/health` | `health` | público | ❌ |
| POST | `/auth/register` | `Register.post` | público (rate-limit) | ✅ |
| POST | `/auth/login` | `Login.post` | público (rate-limit) | ✅ |
| POST | `/auth/refresh` | `Refresh.post` | jwt (refresh) | ❌ |
| GET | `/auth/me` | `Me.get` | jwt | ❌ |
| POST | `/auth/forgot-password` | `ForgotPassword.post` | público | ✅ |
| POST | `/auth/reset-password` | `ResetPassword.post` | público (token) | ✅ |
| POST | `/auth/change-password` | `ChangePassword.post` | jwt | ❌ |
| POST | `/auth/send-verification` | `SendVerification.post` | jwt | ❌ |
| POST | `/auth/verify-email` | `VerifyEmail.post` | público (token) | ✅ |
| GET | `/auth/email-status` | `EmailStatus.get` | jwt | ❌ |
| POST | `/auth/otp/send` | `OtpSend.post` | público | ❌ |
| POST | `/auth/otp/verify` | `OtpVerify.post` | público | ❌ |
| GET | `/auth/2fa` | `TwoFactor.get` | jwt | ❌ |
| PUT | `/auth/2fa` | `TwoFactor.put` | jwt | ❌ |

> Notas: `register` exige `acepto_tyc=true` (RF-17) y solo acepta roles públicos `pds|solicitante|merchant` (otros roles → 422). El personal de administración (`verificador|soporte|admin|superadmin`) NO se autoregistra: lo crea el superadmin vía `POST /superadmin/admins` (o el admin regional crea `verificador|soporte` de su región vía `POST /admin/staff`); el panel admin solo expone login. `login` valida `status=active`. OTP usa Onurix en prod (dev_code en DEBUG/TESTING). 2FA es toggle MVP.

### 3.2 Usuarios — `/api/v1/users` (blueprints: `users`, `user_preferences`)

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/users/me/foto-perfil` | `MyFotoPerfil.post` | jwt | ❌ |
| DELETE | `/users/me/foto-perfil` | `MyFotoPerfil.delete` | jwt | ❌ |
| GET | `/users/me/profile` | `MyProfile.get` | jwt | ✅ (doc: `/users/me`) |
| PUT | `/users/me/profile` | `MyProfile.put` | jwt | ✅ (doc: `/users/me`) |
| GET | `/users/badges` | `UserBadges.get` | jwt | ❌ |
| GET | `/users/<user_id>/profile` | `PublicProfile.get` | público | ❌ |
| GET | `/users/me/preferences` | `UserPreferences.get` | jwt | ❌ |
| PUT | `/users/me/preferences` | `UserPreferences.put` | jwt | ❌ |

> Notas: `PUT /users/me/profile` dispara badges y asignación de región. `PublicProfile` expone ratings, habilidades con niveles y certificaciones.

### 3.3 Solicitudes — `/api/v1/solicitudes`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/solicitudes/` | `SolicitudList.post` | jwt + role:[solicitante,merchant] | ✅ |
| GET | `/solicitudes/` | `SolicitudList.get` | público | ✅ |
| GET | `/solicitudes/mias` | `SolicitudMias.get` | jwt | ❌ |
| GET | `/solicitudes/<id>` | `SolicitudDetail.get` | jwt? | ✅ |
| PATCH | `/solicitudes/<id>/estado` | `SolicitudEstado.patch` | jwt (dueño) | ❌ |
| POST | `/solicitudes/<id>/ratings` | `SolicitudRatings.post` | jwt | ❌ |
| GET | `/solicitudes/<id>/ratings` | `SolicitudRatings.get` | público | ❌ |

> Notas: presupuesto mínimo 50000 COP. Listados nunca exponen coordenadas exactas (solo dueño/PDS premiado vía Contract). `GET /solicitudes/` y `/mias` soportan `page`/`per_page`.

### 3.4 Ofertas — `/api/v1` (blueprint `ofertas`)

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/solicitudes/<sid>/ofertas` | `OfertaList.post` | jwt + role:[pds] | ❌ |
| GET | `/solicitudes/<sid>/ofertas` | `OfertaList.get` | jwt (dueño o pds) | ❌ |
| GET | `/mis-ofertas` | `MisOfertas.get` | jwt | ❌ |
| POST | `/ofertas/<oid>/responder` | `OfertaResponder.post` | jwt | ❌ |

> Notas: límite mensual de postulaciones por plan (free=3, basico=15, profesional=∞). Aceptar oferta crea Contract y descuenta 50 monedas en Modalidad B.

### 3.5 Contratos — `/api/v1/contracts`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/contracts/` | `ContractList.post` | jwt (dueño solicitud) | ✅ |
| GET | `/contracts/mine` | `MyContracts.get` | jwt | ✅ (doc: `GET /contracts/`) |
| GET | `/contracts/<id>` | `ContractDetail.get` | jwt (participante) | ❌ |
| PATCH | `/contracts/<id>/estado` | `ContractEstado.patch` | jwt (participante) | ✅ (doc: PUT) |

> Notas: acciones de estado: `aceptar` (proveedor, genera Chamba), `completar` (proveedor → `completado_pendiente`), `confirmar` (solicitante, RF-23 dual + pago billetera), `cancelar` (motivo obligatorio). Emite socket `contracto:actualizado`.

### 3.6 Chambas — `/api/v1/chambas` (Módulo de Gestión de Chamba) — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/chambas/` | `ChambaList.post` | jwt (participante contrato) | ❌ |
| GET | `/chambas/<id>` | `ChambaDetail.get` | jwt (participante) | ❌ |
| PATCH | `/chambas/<id>/estado` | `ChambaEstado.patch` | jwt (participante) | ❌ |
| POST | `/chambas/<id>/validacion` | `ChambaValidacion.post` | jwt (solicitante) | ❌ |
| POST | `/chambas/<id>/evidencia-entrada` | `ChambaEvidenciaEntrada.post` | jwt (prestador) | ❌ |
| POST | `/chambas/<id>/evidencia-salida` | `ChambaEvidenciaSalida.post` | jwt (prestador) | ❌ |
| POST | `/chambas/<id>/adenda` | `ChambaAdenda.post` | jwt (participante) | ❌ |
| PATCH | `/chambas/<id>/adenda/<idx>` | `ChambaAdendaItem.patch` | jwt (solicitante) | ❌ |
| DELETE | `/chambas/<id>/adenda/<idx>` | `ChambaAdendaItem.delete` | jwt (solicitante) | ❌ |
| POST | `/chambas/<id>/novedad` | `ChambaNovedad.post` | jwt (participante) | ❌ |
| POST | `/chambas/<id>/pago` | `ChambaPago.post` | jwt (participante) | ❌ |
| POST | `/chambas/<id>/calificacion` | `ChambaCalificacion.post` | jwt (solicitante) | ❌ |
| POST | `/chambas/<id>/marana` | `ChambaMarana.post` | jwt (solicitante) | ❌ |
| POST | `/chambas/evidencia/upload` | `ChambaEvidenciaUpload.post` | jwt | ❌ |
| GET | `/chambas/solicitante/<uid>` | `ChambasSolicitante.get` | jwt (self) | ❌ |
| GET | `/chambas/prestador/<uid>` | `ChambasPrestador.get` | jwt (self) | ❌ |

> Notas: hitos PROGRAMADA→EN_PROCESO (GPS obligatorio)→EN_EJECUCION→PENDIENTE_VALIDACION→LIQUIDACION_CONFIRMADA→FINALIZADA + PAUSADA. Pago directo dual. Emite socket `chamba:actualizada`.

### 3.7 Marañas — `/api/v1/maranas` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/maranas/chamba/<chamba_id>` | `MaranaDeChamba.get` | jwt (participante) | ❌ |
| GET | `/maranas/` | `MaranaList.get` | jwt | ❌ |
| GET | `/maranas/<id>` | `MaranaDetail.get` | jwt | ❌ |
| POST | `/maranas/<id>/ofertas` | `MaranaOfertaList.post` | jwt + role:[pds] | ❌ |
| GET | `/maranas/<id>/ofertas` | `MaranaOfertaList.get` | jwt | ❌ |
| POST | `/maranas/<id>/responder` | `MaranaResponder.post` | jwt | ❌ |
| PATCH | `/maranas/<id>/estado` | `MaranaEstado.patch` | jwt | ❌ |
| POST | `/maranas/<id>/pago` | `MaranaPago.post` | jwt | ❌ |
| GET | `/maranas/solicitante/<uid>` | `MaranaSolicitante.get` | jwt (self) | ❌ |
| GET | `/maranas/prestador/<uid>` | `MaranaPrestador.get` | jwt (self) | ❌ |

> Notas: la creación vive en `POST /chambas/<id>/marana`. Negociación tipo ofertas (postular/contraofertar/aceptar). Pago directo dual.

### 3.8 Anuncios Laborales — `/api/v1/anuncios` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/anuncios/` | `AnuncioRoot.post` | jwt + role:[merchant] | ❌ |
| GET | `/anuncios/` | `AnuncioRoot.get` | jwt | ❌ |
| GET | `/anuncios/negocio/<uid>` | `AnunciosDelNegocio.get` | jwt | ❌ |
| GET | `/anuncios/<id>` | `AnuncioDetail.get` | jwt | ❌ |
| PATCH | `/anuncios/<id>/estado` | `AnuncioEstado.patch` | jwt (dueño) | ❌ |
| POST | `/anuncios/<id>/postulaciones` | `AnuncioPostulacionList.post` | jwt + role:[pds] | ❌ |
| GET | `/anuncios/<id>/postulaciones` | `AnuncioPostulacionList.get` | jwt (dueño) | ❌ |
| PATCH | `/anuncios/<id>/postulaciones/<pid>` | `AnuncioPostulacionItem.patch` | jwt (dueño) | ❌ |

> Notas: ofertas laborales NO vinculantes (banner). Gestión de contacto: `contactar`/`descartar`.

### 3.9 Negocios — `/api/v1/negocios` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/negocios/` | `NegociosList.post` | jwt + role:[merchant] | ❌ |
| GET | `/negocios/` | `NegociosList.get` | público | ❌ |
| GET | `/negocios/<id>` | `NegocioDetail.get` | público | ❌ |
| PUT | `/negocios/<id>` | `NegocioDetail.put` | jwt (owner/admin) | ❌ |
| DELETE | `/negocios/<id>` | `NegocioDetail.delete` | jwt (owner/admin) | ❌ |
| GET | `/negocios/slug/<slug>` | `NegocioBySlug.get` | público | ❌ |
| GET | `/negocios/mapa` | `NegociosMapa.get` | público | ❌ |
| GET | `/negocios/buscar` | `NegociosBuscar.get` | público | ❌ |
| GET | `/negocios/categorias` | `NegociosCategorias.get` | público | ❌ |
| PUT | `/negocios/<id>/horarios` | `NegocioHorarios.put` | jwt (owner/admin) | ❌ |
| POST | `/negocios/<id>/imagenes` | `NegocioImagenes.post` | jwt (owner/admin) | ❌ |
| DELETE | `/negocios/<id>/imagenes/<idx>` | `NegocioImagenDelete.delete` | jwt (owner/admin) | ❌ |
| POST | `/negocios/<id>/imagenes/upload` | `NegocioImagenUpload.post` | jwt (owner/admin) | ❌ |
| POST | `/negocios/<id>/rating` | `NegocioRatingCreate.post` | jwt | ❌ |
| GET | `/negocios/<id>/ratings` | `NegocioRatingsList.get` | público | ❌ |
| POST | `/negocios/<id>/reportar` | `NegocioReporteCreate.post` | jwt | ❌ |
| GET | `/negocios/<id>/stats` | `NegocioStats.get` | jwt (owner/admin) | ❌ |

> Notas: usa PostGIS (`geom`), slug único, horarios por día, reportes crean Ticket automático.

### 3.10 Merchant — `/api/v1/merchant` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/merchant/payment-methods` | `MerchantPaymentMethodsList.get` | role:[merchant] | ❌ |
| POST | `/merchant/payment-methods` | `MerchantPaymentMethodsList.post` | role:[merchant] | ❌ |
| DELETE | `/merchant/payment-methods/<id>` | `MerchantPaymentMethodDetail.delete` | role:[merchant] | ❌ |
| GET | `/merchant/preferences` | `MerchantPreferences.get` | role:[merchant] | ❌ |
| PUT | `/merchant/preferences` | `MerchantPreferences.put` | role:[merchant] | ❌ |

### 3.11 Habilidades — `/api/v1` (blueprint `habilidades`) — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/habilidades` | `HabilidadesList.get` | jwt | ❌ |
| POST | `/habilidades` | `HabilidadesList.post` | jwt | ❌ |
| GET | `/habilidades/mis-niveles` | `MisNiveles.get` | jwt | ❌ |
| GET | `/habilidades/<id>/nivel/<n>/quiz` | `NivelQuiz.get` | jwt | ❌ |
| POST | `/habilidades/<id>/nivel/<n>/quiz` | `NivelQuiz.post` | jwt | ❌ |
| POST | `/habilidades/<id>/nivel/<n>/certificacion` | `NivelCertificacion.post` | jwt | ❌ |
| DELETE | `/habilidades/<id>` | `HabilidadDetail.delete` | jwt | ❌ |
| POST | `/habilidades/endosar` | `EndosarHabilidad.post` | jwt (solicitante) | ❌ |
| GET | `/habilidades/certificaciones` | `CertificacionesTecnicas.get` | jwt | ❌ |
| POST | `/habilidades/certificaciones` | `CertificacionesTecnicas.post` | jwt | ❌ |
| GET | `/habilidades/progreso` | `ProgresoOficios.get` | jwt | ❌ |

> Notas: umbral quiz 80%. Niveles 1-5 (Novato→Experto). Certificaciones técnicas requieren verificación.

### 3.12 KYC — `/api/v1/kyc` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/kyc/documentos-requeridos` | `DocumentosRequeridos.get` | jwt | ❌ |
| GET | `/kyc/mis-documentos` | `MisDocumentos.get` | jwt | ❌ |
| POST | `/kyc/documentos` | `Documentos.post` | role:[pds,solicitante,merchant] | ❌ |
| GET | `/kyc/documentos/mios` | `MisDocumentosSubidos.get` | jwt | ❌ |
| GET | `/kyc/pendientes` | `DocumentosPendientes.get` | role:[verificador,admin,superadmin,soporte] | ❌ |
| POST | `/kyc/documentos/<id>/verificar` | `DocumentoVerificar.post` | role:[verificador,admin,superadmin] | ❌ |

> Notas: documentos multi-instancia (validacion_profesional, cert_bancaria, certificado_laboral). Recalcula `Profile.verificado`. Scoped por región.

### 3.13 Notificaciones — `/api/v1/notifications`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/notifications/` | `NotificationList.get` | jwt | ❌ |
| GET | `/notifications/no-leidas` | `NotificationUnreadCount.get` | jwt | ❌ |
| POST | `/notifications/<id>/marcar-leida` | `NotificationMarcarLeida.post` | jwt | ❌ |
| POST | `/notifications/marcar-todas-leidas` | `NotificationMarcarTodasLeidas.post` | jwt | ❌ |
| GET | `/notifications/me` | `MyNotifications.get` | jwt (legacy) | ❌ |
| PATCH | `/notifications/<id>/read` | `NotificationRead.patch` | jwt (legacy) | ❌ |

> Notas: la doc solo menciona el evento socket `notificacion:nueva`, no los endpoints REST.

### 3.14 Pagos — `/api/v1/payments`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/payments/` | `PaymentList.post` | jwt (solicitante/admin) | ✅ (doc: `/payments/checkout`) |
| GET | `/payments/nequi` | `NequiInfo.get` | público | ❌ |
| POST | `/payments/<id>/confirm` | `PaymentConfirm.post` | jwt (solicitante/admin) | ❌ |
| POST | `/payments/<id>/refund` | `PaymentRefund.post` | jwt (solicitante/admin) | ❌ |
| POST | `/payments/<id>/retry` | `PaymentRetry.post` | jwt (solicitante/admin) | ❌ |
| GET | `/payments/<id>` | `PaymentDetail.get` | jwt (participante/admin) | ✅ |
| GET | `/payments/mine` | `MyPayments.get` | jwt | ❌ |
| GET | `/payments/certificado-ingresos` | `IncomeCertificate.get` | jwt | ❌ |
| GET | `/payments/certificado-ingresos/pdf` | `IncomeCertificatePDF.get` | jwt | ❌ |
| GET | `/payments/certificado-ingresos/csv` | `IncomeCertificateCSV.get` | jwt | ❌ |
| GET | `/payments/history/csv` | `PaymentHistoryCSV.get` | jwt | ❌ |

> Notas: pasarela por defecto `nequi` (transferencia manual). Comisión 12% PDS (Modalidad A, monto ≥ umbral).

### 3.15 Métodos de Pago — `/api/v1/metodos-pago` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/metodos-pago` | `MetodosPagoList.get` | jwt | ❌ |
| POST | `/metodos-pago` | `MetodosPagoList.post` | jwt | ❌ |
| PATCH | `/metodos-pago/<id>/principal` | `MetodoPrincipal.patch` | jwt | ❌ |
| DELETE | `/metodos-pago/<id>` | `MetodoPagoDetail.delete` | jwt | ❌ |

> Notas: la billetera virtual (tipo `billetera`) siempre es el primer método y no se elimina.

### 3.16 Billetera / Monedas / Modalidades / Hitos — `/api/v1/wallet`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/wallet/` | `WalletDetail.get` | jwt | ✅ |
| POST | `/wallet/deposit` | `WalletDeposit.post` | jwt | ✅ |
| POST | `/wallet/withdraw` | `WalletWithdraw.post` | jwt | ✅ |
| GET | `/wallet/history` | `WalletHistory.get` | jwt | ✅ |
| GET | `/wallet/coins` | `CoinsDetail.get` | jwt | ✅ |
| POST | `/wallet/coins/buy` | `CoinsBuy.post` | jwt | ✅ (doc: `/wallet/coins`) |
| POST | `/wallet/coins/use` | `CoinsUse.post` | jwt | ✅ |
| GET | `/wallet/coins/packages` | `CoinsPackages.get` | público | ❌ |
| GET | `/wallet/modalidades/<service_id>` | `ModalidadDetail.get` | jwt | ✅ (doc: `/services/:id/modalidad`) |
| POST | `/wallet/modalidades/<service_id>` | `ModalidadDetail.post` | jwt (solicitante/admin) | ✅ |
| GET | `/wallet/milestones/<contract_id>` | `MilestonesList.get` | jwt | ✅ (doc: `/orders/:id/milestones`) |
| POST | `/wallet/milestones/<contract_id>/create` | `MilestonesCreate.post` | jwt (solicitante/admin) | ✅ |
| POST | `/wallet/milestones/<hito_id>/action` | `MilestoneAction.post` | jwt (solicitante/admin) | ✅ (doc: approve/reject) |
| GET | `/wallet/milestones/<contract_id>/check` | `MilestonesCheck.get` | jwt | ❌ |

> Notas: la doc usa rutas antiguas (`/coins`, `/modalidades`, `/orders/:id/milestones`) que NO existen; las reales viven bajo `/wallet/`. No existe blueprint `dashboard` (RF-30) en el código.

### 3.17 Suscripciones — `/api/v1/subscriptions`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/subscriptions/planes` | `PlanesCatalogo.get` | público | ✅ (doc: `GET /subscriptions`) |
| GET | `/subscriptions/mine` | `MiSuscripcion.get` | jwt | ❌ |
| POST | `/subscriptions/` | `Suscribirse.post` | jwt | ❌ |
| POST | `/subscriptions/cancel` | `CancelarSuscripcion.post` | jwt | ❌ |

### 3.18 Precios Sugeridos — `/api/v1/prices`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/prices/precios/<categoria>` | `PriceSuggestion.get` | público (cache 1h) | ✅ (doc: `/prices/suggested`) |
| GET | `/prices/precios` | `AllPrices.get` | público (cache 1h) | ✅ |

> Notas: la doc usa `/prices/suggested` y `/prices/calculate` que NO existen; las reales son `/prices/precios[...]`.

### 3.19 IA / Recomendación — `/api/v1/ai` (blueprints: `ai`, `ai_metrics`)

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/ai/recommendations` | `Recommendations.get` | público | ✅ |
| GET | `/ai/solicitudes-for-provider` | `SolicitudesForProvider.get` | jwt | ✅ |
| GET | `/ai/metrics` | `AIMetrics.get` | jwt + admin/superadmin (check en código) | ✅ |
| GET | `/ai/metrics/feature-importance` | `FeatureImportance.get` | jwt + admin/superadmin (check en código) | ✅ |

### 3.20 Chat — `/api/v1/chat`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/chat/conversations` | `Conversations.post` | jwt | ❌ |
| GET | `/chat/conversations` | `Conversations.get` | jwt | ✅ |
| GET | `/chat/conversations/<id>/messages` | `ConversationMessages.get` | jwt (participante) | ✅ |
| POST | `/chat/conversations/<id>/messages` | `ConversationMessages.post` | jwt (participante) | ✅ (doc: `/chat/{id}/message`) |
| PATCH | `/chat/conversations/<id>/messages/read` | `ConversationMessagesRead.patch` | jwt (participante) | ❌ |

### 3.21 Disputas — `/api/v1` (blueprint `disputes`) — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/contracts/<contract_id>/disputes` | `DisputeList.post` | jwt (participante) | ❌ |
| GET | `/contracts/<contract_id>/disputes` | `DisputeList.get` | jwt (participante) | ❌ |
| GET | `/my-disputes` | `MyDisputes.get` | jwt | ❌ |

### 3.22 Tickets — `/api/v1/tickets` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/tickets/` | `TicketCreate.post` | jwt | ❌ |

> Notas: la gestión (listar/actualizar) vive en `/api/v1/admin/tickets`.

### 3.23 Admin — `/api/v1/admin` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/admin/users` | `AdminUserList.get` | admin | ❌ |
| GET | `/admin/users/<id>` | `AdminUserDetail.get` | admin | ❌ |
| PATCH | `/admin/users/<id>/role` | `AdminUserRole.patch` | admin | ❌ |
| PATCH | `/admin/users/<id>/status` | `AdminUserStatus.patch` | admin | ❌ |
| GET | `/admin/stats/overview` | `AdminStats.get` | admin | ❌ |
| GET | `/admin/verifications` | `AdminVerificationList.get` | admin | ❌ |
| POST | `/admin/verifications/<id>/approve` | `AdminVerificationApprove.post` | admin | ❌ |
| POST | `/admin/verifications/<id>/reject` | `AdminVerificationReject.post` | admin | ❌ |
| GET | `/admin/solicitudes` | `AdminSolicitudList.get` | admin | ❌ |
| PATCH | `/admin/solicitudes/<id>/moderate` | `AdminSolicitudModerate.patch` | admin | ❌ |
| GET | `/admin/contracts` | `AdminContractList.get` | admin | ❌ |
| PATCH | `/admin/contracts/<id>/moderate` | `AdminContractModerate.patch` | admin | ❌ |
| GET | `/admin/disputes` | `AdminDisputeList.get` | admin | ❌ |
| GET | `/admin/disputes/<id>` | `AdminDisputeDetail.get` | admin | ❌ |
| POST | `/admin/disputes/<id>/resolve` | `AdminDisputeResolve.post` | admin | ❌ |
| GET | `/admin/tickets` | `AdminTicketList.get` | role:[admin,superadmin,soporte] | ❌ |
| PATCH | `/admin/tickets/<id>` | `AdminTicketPatch.patch` | role:[admin,superadmin,soporte] | ❌ |
| GET | `/admin/content/reports` | `AdminContentReports.get` | admin | ❌ |
| PATCH | `/admin/content/<rating_id>/moderate` | `AdminContentModerate.patch` | admin | ❌ |
| GET | `/admin/staff` | `AdminStaff.get` | admin | ❌ |
| POST | `/admin/staff` | `AdminStaff.post` | admin | ❌ |

> Notas: RBAC Fase 1-2 + división regional (admin regional scoped por `region_id`). Auditoría vía `write_audit`.

### 3.24 Superadmin — `/api/v1/superadmin` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/superadmin/admins` | `SuperAdminAdminList.get` | superadmin | ❌ |
| POST | `/superadmin/admins` | `SuperAdminAdminList.post` | superadmin | ❌ |
| PATCH | `/superadmin/admins/<id>` | `SuperAdminAdminDetail.patch` | superadmin | ❌ |
| DELETE | `/superadmin/admins/<id>` | `SuperAdminAdminDetail.delete` | superadmin | ❌ |
| GET | `/superadmin/config` | `SuperAdminConfig.get` | superadmin | ❌ |
| PATCH | `/superadmin/config` | `SuperAdminConfig.patch` | superadmin | ❌ |
| GET | `/superadmin/audit-logs` | `SuperAdminAuditList.get` | superadmin | ❌ |
| GET | `/superadmin/audit-logs/<id>` | `SuperAdminAuditDetail.get` | superadmin | ❌ |
| GET | `/superadmin/legal/tyc` | `SuperAdminTyC.get` | superadmin | ❌ |
| POST | `/superadmin/legal/tyc` | `SuperAdminTyC.post` | superadmin | ❌ |
| POST | `/superadmin/override/user` | `SuperAdminOverrideUser.post` | superadmin | ❌ |
| POST | `/superadmin/override/contract` | `SuperAdminOverrideContract.post` | superadmin | ❌ |
| GET | `/superadmin/ai/params` | `SuperAdminAIParams.get` | superadmin | ❌ |
| PATCH | `/superadmin/ai/params` | `SuperAdminAIParams.patch` | superadmin | ❌ |
| GET | `/superadmin/flags` | `SuperAdminFlagList.get` | superadmin | ❌ |
| PATCH | `/superadmin/flags/<key>` | `SuperAdminFlagToggle.patch` | superadmin | ❌ |
| POST | `/superadmin/regions/reindex` | `SuperAdminRegionsReindex.post` | superadmin | ❌ |

> Notas: RBAC Fase 3. Gestión de admins internos (admin/soporte/verificador), config global tipada, T&C, override forzado, pesos IA, feature flags, reindex regional.

### 3.25 Legal — `/api/v1/legal`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/legal/tyc` | `TyCPublic.get` | público | ❌ |
| GET | `/legal/politica-datos` | `PoliticaDatosPublic.get` | público | ❌ |

> Notas: T&C y Política de Datos (Ley 1581/2012) públicos, sin JWT.

### 3.26 Providers — `/api/v1/providers` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/providers/search` | `ProviderSearch.get` | público | ❌ |

> Notas: búsqueda de PDS con filtros `q, categoria, zona, min_rating, verificado, page, per_page`.

### 3.27 Onboarding — `/api/v1/onboarding`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/onboarding/status` | `OnboardingStatus.get` | jwt | ✅ |
| PATCH | `/onboarding/step` | `OnboardingStep.patch` | jwt | ✅ |
| POST | `/onboarding/complete` | `OnboardingComplete.post` | jwt | ✅ |

### 3.28 Portfolio — `/api/v1/portfolio`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| POST | `/portfolio/upload` | `PortfolioUpload.post` | jwt | ✅ |
| GET | `/portfolio/items` | `PortfolioItems.get` | jwt | ✅ |
| GET | `/portfolio/<id>` | `PortfolioItemDetail.get` | jwt | ✅ |
| DELETE | `/portfolio/<id>` | `PortfolioItemDetail.delete` | jwt | ✅ |
| GET | `/portfolio/pds/<pds_id>` | `PortfolioByPDS.get` | público | ✅ |

### 3.29 Trust — `/api/v1/trust`

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/trust/<user_id>` | `TrustScorePublic.get` | público | ✅ |

### 3.30 Regiones — `/api/v1/regions` — **TODO NUEVO**

| Método | Ruta | Handler | Permiso | Doc |
|---|---|---|---|---|
| GET | `/regions` | `RegionList.get` | jwt | ❌ |
| GET | `/regions/detectar` | `RegionDetect.get` | jwt | ❌ |

---

## 4. Handlers Socket.IO (no REST)

| Handler | Archivo | Eventos |
|---|---|---|
| `register_chat_socketio` | `routes/chat_socket.py` | `join`, `message`, `disconnect` (sala `conversation_<id>`) |
| `register_ofertas_socketio` | `routes/oferta_socket.py` | auto-join sala `user:<id>` |
| `register_notification_socketio` | `routes/notification_socket.py` | `join`, `disconnect` (sala `user:<id>`) |

Eventos server→client emitidos desde rutas: `notificacion:nueva`, `message`, `oferta:nueva`, `oferta:actualizada`, `contracto:actualizado`, `chamba:actualizada`, `marana:actualizada`, `marana:asignada`, `anuncio:postulacion`, `anuncio:contactado`.

---

## 5. Divergencias Detectadas entre Doc y Código

1. **Doc dice 24 blueprints; el código registra 36.** Faltan en la doc: `chambas`, `maranas`, `anuncios`, `negocios`, `merchant`, `habilidades`, `payment_methods`, `otp`, `two_factor`, `user_preferences`, `regions`, `trust`.
2. **Rutas de wallet/monedas/modalidades/hitos:** la doc usa `/coins`, `/modalidades`, `/orders/:id/milestones`; el código real las tiene bajo `/wallet/...`.
3. **No existe blueprint `dashboard` (RF-30)** en el código, aunque la doc lo lista.
4. **`Order` no existe en el código** (el modelo real es `Contract`).
5. **Pagos:** la doc usa `/payments/checkout`; el código usa `POST /payments/`.
6. **Precios:** la doc usa `/prices/suggested` y `/prices/calculate`; el código usa `/prices/precios[...]`.
7. **Contratos:** la doc usa `PUT /contracts/{id}/estado`; el código usa `PATCH`.
8. **Chat:** la doc usa `/chat/{id}/message`; el código usa `/chat/conversations/{id}/messages`.
9. **Perfil:** la doc usa `/users/me`; el código usa `/users/me/profile` (y `/auth/me`).
10. **Suscripciones:** la doc usa `GET /subscriptions`; el código usa `/subscriptions/planes`.

---

*Generado automáticamente desde el código backend (app/__init__.py + app/controllers/*.py). No editar a mano; regenerar al cambiar rutas.*