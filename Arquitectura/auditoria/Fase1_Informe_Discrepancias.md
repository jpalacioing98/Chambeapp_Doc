# Fase 1 — Informe de discrepancias: Historias de Usuario vs. Código

> **Fuente de verdad:** el código (`backend/` rama `Dev`, `frontend/` rama `Dev`).
> **Documento auditado:** `Requerimientos/HistoriasDeUsuario.md` (v2.0, HU-01 a HU-40).
> **Fecha de auditoría:** 2026-10-19.
> **Método:** lectura de controladores, servicios, modelos, tareas Celery y configuración PWA; inventario automático de **217 endpoints** (script AST de solo lectura) y verificación puntual de reglas de negocio con búsquedas en el código.
> **Convención:** `ruta:Lx-y` = archivo y líneas del código. "Por confirmar" = no se pudo comprobar de forma concluyente.

## Veredicto

**Las historias de usuario NO están al día.** Se pasa a la **Fase 2** (plan de actualización).

| Severidad | Cantidad | Criterio |
|---|---|---|
| Alta | 10 | Flujo núcleo, privacidad/seguridad, dinero o cumplimiento legal no coinciden con la HU |
| Media | 11 | Funcionalidad parcial o con reglas distintas a las declaradas |
| Baja | 5 | Diferencias de detalle o documentación interna |
| Seguridad transversal | 4 | Hallazgos fuera de las HU pero que afectan los flujos |

---

## 1. Discrepancias de severidad ALTA

| ID | HU | Qué dice la HU | Qué hace realmente el código | Evidencia |
|---|---|---|---|---|
| D-01 | HU-08 / CU-08.1 / CU-08.2 | Pago vía **MercadoPago o PSE**; el retiro procesa "transferencia directa". | La pasarela por defecto es **`nequi` (transferencia manual)** con `MockGateway` que **siempre aprueba**. MercadoPago está comentado ("NO activo"). `retirar()` solo mueve saldo a `saldo_bloqueado`; **no ejecuta transferencia**. | `backend/app/services/payments.py:L36-70, L76-122`; `services/wallet.py:L62-84`; `controllers/payments.py:L69-78` |
| D-02 | (sin HU) | El flujo de ejecución se describe como orden "Pendiente → En progreso → Completado". | El ciclo real es la **Chamba** (6 hitos): `programada → en_proceso → en_ejecucion ⇄ pausada → pendiente_validacion → liquidacion_confirmada → finalizada`. Incluye validación geoespacial de llegada (100 m), evidencias de entrada/salida, adendas, novedades/botón de pánico, **check-in de pago directo dual** y calificación final. Además existen las **Marañas** (rebusques) derivadas de adendas. Ninguno tiene HU. | `models/chamba.py:L9-30`; `services/chamba.py:L19-39`; `controllers/chambas.py` (17 endpoints); `controllers/maranas.py` (12 endpoints) |
| D-03 | HU-19 / CU-19.1 | Ubicación y chat se **desbloquean solo cuando el solicitante confirma** al PDS; si no, datos sensibles ocultos. | **Coordenadas**: parcialmente gestionadas (solo dueño o PDS con `Contract`; el contrato se crea al aceptar la oferta, antes de que el PDS lo firme). **Chat: sin gating** — cualquier usuario autenticado puede abrir conversación con cualquier `user_b_id`. | `controllers/solicitudes.py:L209-236`; `controllers/ofertas.py:L290-296`; `controllers/chat.py:L57-74` |
| D-04 | HU-20 / CU-20.1 | Si el solicitante no confirma en **48 h**, el sistema confirma automáticamente. | **No existe** esa tarea. La única auto-aprobación a 48 h es de **hitos de pago** (`auto_approve_milestones`). El contrato queda en `completado_pendiente` indefinidamente. | `app/tasks.py:L59-84`; `controllers/contracts.py:L161-184` |
| D-05 | HU-15 / CU-15.1 | 12 % PDS + 8 % solicitante; <$50.000 exento; **−10 % por volumen (>10/mes)**; **0 % para PDS nuevo (3 meses)**. | Hay **dos cálculos inconsistentes**: `crear_pago` calcula 12 % + 8 %; `contracts.confirmar` descuenta **solo 12 %**, **solo en modalidad A** y sobre el presupuesto, con `except: pass` que oculta fallos. **No existen** el descuento por volumen ni la exención de 3 meses. | `services/payments.py:L100-106`; `controllers/contracts.py:L196-232`; `config.py:L88-92` |
| D-06 | HU-11 / CU-11.1 | Prueba de 3 meses y luego cobro recurrente; cancelación degrada **al fin del ciclo**; Básico da **50** y Profesional **150** monedas de bienvenida. | Suscripción **simulada** (`metodo_pago="mock"`, vigencia 30 días). **No hay** prueba de 3 meses ni cobro recurrente. Cancelar revierte a `free` **de inmediato**. Las monedas de bienvenida figuran en el catálogo pero **nunca se otorgan** (`dar_monedas_promocionales` no tiene invocadores). | `controllers/subscriptions.py:L29-76, L109-148, L151-179`; `services/wallet.py:L206` |
| D-07 | HU-01 / HU-17 | Menores de 18 años → **bloqueo de registro** (T&C §4). | El registro **no valida edad**; `edad_verificada` queda en `False`. La versión de T&C está fija (`TYC_VERSION = "1.0"`) aunque el superadmin puede publicar nuevas versiones. | `controllers/auth.py:L26, L45-77`; `models/user.py:L41`; `controllers/superadmin.py` (`/legal/tyc`) |
| D-08 | HU-03 / CU-03.1 | Calificación mutua tras servicio completado; actualiza promedio. | `POST /solicitudes/<id>/ratings` solo exige solicitud completada y autor único: **no valida que el autor sea participante ni que `calificado_id` sea la contraparte**. La calificación de la Chamba (`rating_estrellas`) es **independiente** y no recalcula `calificacion_promedio`. | `controllers/solicitudes.py:L260-286`; `services/chamba.py:L134-149` |
| D-09 | HU-36 / CU-36.1 (marcada ✅) | Al publicar, el `CascadeManager` notifica 2 km → 5 km → 15 km. | `CascadeManager.start_cascade` **no se invoca desde ningún controlador** (solo definición y tests). Publicar una solicitud **no dispara notificaciones** a proveedores (contradice también HU-04 criterio 3). | `services/cascade.py:L40`; `controllers/solicitudes.py:L51-109` |
| D-10 | (sin HU) | Solo existen los roles `pds` y `solicitante`. | Existen **7 roles** (`pds`, `solicitante`, `merchant`, `verificador`, `soporte`, `admin`, `superadmin`) y módulos completos **sin HU**: Negocios/Comerciante (~25 endpoints), Anuncios laborales (9), KYC por rol (6), Habilidades/quizzes/certificaciones (11), Regiones (3), 2FA (3), OTP (2), verificación de email (3), recuperación/cambio de contraseña (3), Tickets/Soporte, Panel Admin (~21), Superadmin (19), Onboarding (3), Preferencias (2), Métodos de pago (4), Búsqueda de proveedores, Disputas (3). Existen RF en `Requerimientos/RF_*.md` pero **no HU** equivalentes. | `schemas/auth.py:L12-16`; `models/user.py:L10-19`; `app/__init__.py:L83-118` |

---

## 2. Discrepancias de severidad MEDIA

| ID | HU | Qué dice la HU | Qué hace el código | Evidencia |
|---|---|---|---|---|
| D-11 | HU-01 / CU-01.2 | 3 intentos fallidos → bloqueo temporal por cuenta. | *Rate limit* **5 intentos / 15 min por IP**, en memoria, **desactivado en development y testing**; sin bloqueo por cuenta. Recuperación de contraseña sí existe. | `rate_limit.py:L9-14, L50-56` |
| D-12 | HU-04 criterio 4 | Cobertura **solo Valledupar**. | Ciudad base por defecto **"Medellin"** (configurable por `SystemConfig`); el modelo usa **"Valledupar"** por defecto. Solo emite `advertencia`, no bloquea. | `controllers/solicitudes.py:L24-32, L93-98`; `models/solicitud.py:L53` |
| D-13 | HU-05 / HU-32 | Ranking al publicar; Thompson Bandit **rota categorías mostradas**. | Recomendación **bajo demanda** (`GET /ai/recommendations`) con recomendador híbrido/heurístico/shadow. El bandit solo aporta `bandit_arm_value` como *feature* del ranking ML; **no rota categorías en la UI**. | `controllers/ai.py:L37-45`; `ai/features.py:L227-233` |
| D-14 | HU-06 / HU-37 | Escenario **3D** interactivo y visor **A-Frame (Viewer360)**; degrada a imágenes si <2 Mbps. | Visor **panorámico 360° con Photo Sphere Viewer** (no A-Frame); sin escenario 3D; **no hay detección de conexión** (`navigator.connection`). | `frontend/src/features/solicitante/components/PanoViewer.tsx:L12`; búsqueda `navigator.connection` sin resultados |
| D-15 | HU-16 / HU-18 | Push API de la PWA; cola de sincronización offline. | PWA con `manifest` y **precaché estático Workbox**; **sin Web Push** ni cola de sincronización. Notificaciones = in-app + Socket.IO. | `frontend/vite.config.ts:L15-47` |
| D-16 | HU-21 / CU-21 | PDS puede **modificar** oferta (reemplaza); cancelar solicitud **invalida ofertas**. | No hay endpoint de modificación (solo `POST`); la negociación se hace con **contraoferta bilateral**. Cambiar estado de la solicitud **no invalida** ofertas. Aceptar una oferta **rechaza las demás** (no documentado). | `controllers/ofertas.py:L58-112, L242-320`; `solicitudes.py:L239-252` |
| D-17 | HU-22 / RF-25 | Billetera creada **al registrarse**; depósito acredita tras pago. | Se crea **bajo demanda** (`get_or_create_wallet`). El depósito **acredita al instante sin pasarela**; mínimo $1.000 (no documentado). | `services/wallet.py:L23-59` |
| D-18 | HU-23 / CU-23.2 | Modalidad B exige pago en monedas; PDS sin monedas "puede ver pero no ofertar". | Modalidad A por defecto. En B se **descuentan 50 monedas al PDS al aceptar la oferta**; no se bloquea ofertar antes y el error (400) lo recibe el **solicitante**. | `controllers/ofertas.py:L277-288`; `services/wallet.py:L250-279` |
| D-19 | HU-26 / CU-26 | Hito aprobado descuenta comisión proporcional; rechazo abre disputa; todos aprobados completan el contrato. | `aprobar_hito` **solo cambia estado**; sin comisión ni abono; rechazo **no abre disputa**; el cierre del contrato no es automático (solo `/check`). Existe **auto-aprobación a 48 h** (no documentada). | `services/wallet.py:L313-337`; `app/tasks.py:L59-84` |
| D-20 | HU-12 / HU-13 / HU-14 | Verificación Express ($20k/4 h), certificado de ingresos ($25k), destacado/badge/portafolio/push de pago. | **No hay cobro** del certificado (se genera PDF/CSV sin pago); Express y servicios de valor agregado **no existen**; `destacado` solo por plan Profesional. SLA KYC de 48 h con alerta en `TODO`. | `controllers/payments.py:L229-401`; `app/tasks.py:L100-123`; `subscriptions.py:L74` |
| D-21 | HU-10 / CU-10.1 | Alerta por umbral de ingresos y >10 solicitudes/mes. | Solo notificación **al completar un contrato**, idempotente por usuario. Sin umbrales. | `controllers/notifications.py:L30-53`; `contracts.py:L279` |

---

## 3. Discrepancias de severidad BAJA

| ID | HU | Diferencia | Evidencia |
|---|---|---|---|
| D-22 | HU-24 | Paquetes de monedas incluyen **bonus** (150+15, 350+50); la HU indica 150 y 350. | `services/wallet.py:L142-146` |
| D-23 | HU-07 / HU-20 | Falta documentar el estado `completado_pendiente` y los estados de la Chamba; disputas: solo registro, sin retención de fondos; no se crean en contratos completados/cancelados. | `models/contract.py:L14`; `controllers/disputes.py:L31-32`; `admin.py` (`/disputes/<id>/resolve`) |
| D-24 | (interno) | El docstring del login dice "JWT 8h"; la configuración real es **30 min** (access) y 7 días (refresh rotativo). | `config.py:L14-15`; `controllers/auth.py:L108` |
| D-25 | HU-02 | "Perfil incompleto limita postulaciones": el límite depende del **plan**, no de `perfil_completo`. | `controllers/ofertas.py:L68-89` |
| D-26 | HU-09 / HU-27 / HU-28 | Reporte PDF de cobros/pagos: existe PDF del **certificado** y CSV del historial; el PDF de reporte operativo y el filtro por periodo en UI están **por confirmar**. | `controllers/payments.py:L302-424` |

---

## 4. Hallazgos de seguridad transversales (fuera de las HU)

| ID | Hallazgo | Evidencia |
|---|---|---|
| S-01 | `GET /solicitudes/` es público y **no filtra por estado** (expone también `oculto`, `rechazado`, `cancelado`), lo que contradice la moderación admin. | `controllers/solicitudes.py:L121-131` |
| S-02 | `GET /wallet/milestones/<id>` y `/check` **no verifican que el usuario participe** en el contrato. | `controllers/wallet.py:L228-235, L288-300` |
| S-03 | `POST /contracts/` no valida que el `proveedor_id` tenga oferta ni sea `pds`. | `controllers/contracts.py:L28-61` |
| S-04 | El rate limit es en memoria por proceso (no sirve con varios workers) y se desactiva en `development`. | `rate_limit.py:L5-6, L53-55` |

> Estos hallazgos se documentan como **riesgos conocidos**; por regla del proyecto no se modifica el código.

---

## 5. Historias **alineadas** con el código (✔)

| HU | Verificación |
|---|---|
| HU-04 | Presupuesto mínimo $50.000 y "a convenir" (`presupuesto=None`) — `solicitudes.py:L69-71` |
| HU-03 (parcial) | Unicidad de calificación y bloqueo si no está completada — `solicitudes.py:L265-269` |
| HU-07 | Transiciones `aceptar/completar/confirmar/cancelar` con motivo y notificaciones — `contracts.py:L116-273` |
| HU-11 | Precios y límites Free 3 / Básico 15 / Profesional ilimitado — `subscriptions.py:L29-76`, `ofertas.py:L68-89` |
| HU-22 | Retiro mínimo $10.000 — `services/wallet.py:L62-69` |
| HU-24 | Paquetes y vencimiento de monedas promocionales (cron APScheduler + Celery) — `services/wallet.py:L232-243` |
| HU-25 | Endpoints `/prices/precios[/<categoria>]` — `controllers/prices.py` |
| HU-33 / HU-34 | `/trust/<id>` y `/users/badges` — `controllers/trust.py`, `users.py` |
| HU-35 | `radio_km` configurable (default 5) — `models/solicitud.py:L81` |
| HU-38 | Eventos Socket.IO `oferta:*`, `contracto:actualizado`, `chamba:actualizado`, `message` — controladores y servicios |
| HU-39 | Subida a MinIO — `controllers/portfolio.py`, `services/storage.py` |
| HU-40 | `/ai/metrics` y `/ai/metrics/feature-importance` — `controllers/ai_metrics.py` |

---

## 6. Puntos "por confirmar"

- `NotificationBell` y manejo de `notificacion:nueva` en el frontend (HU-38).
- Exposición de `telefono` en perfiles públicos y respuestas de oferta (HU-19, `explicacion.txt`).
- Filtro por periodo y reporte PDF operativo en dashboards (HU-27, HU-28).
- Lógica exacta de los límites de precio de `/prices` (HU-25).

---

## 7. Cobertura del análisis

Revisados en profundidad: `auth`, `solicitudes`, `ofertas`, `contracts`, `chambas` (+ modelo y servicio), `payments` (+ servicio), `wallet` (+ servicio), `subscriptions`, `chat`, `disputes`, `tasks`, `config`, `rate_limit`, KYC (catálogo), `vite.config.ts` y trazabilidad de IA/Trust/Cascade.
Inventariados por firma (no revisados línea a línea): `admin`, `superadmin`, `negocios`, `merchant`, `anuncios`, `habilidades`, `maranas`, `portfolio`, `onboarding`, `otp`, `two_factor`, `regions`.

*Evidencia técnica reproducible: inventario de 217 endpoints generado con un script AST de solo lectura.*
