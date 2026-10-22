# Registro de Riesgos Conocidos — ChambeApp

> **Estado:** documentado, **no corregido**. Por regla del proyecto, la auditoría **no modifica el código** de la aplicación; estos puntos quedan registrados para su priorización y para ser defendidos con transparencia en la sustentación.
> **Origen:** [Fase 1 — Informe de discrepancias](Fase1_Informe_Discrepancias.md) (S-01..S-04, D-xx) y lectura complementaria de la Fase 2.
> **Fecha de registro:** 2026-10-20 · **Fuente de verdad:** código (`backend/` rama `Dev`).
> **Convención:** `ruta:Lx-y` = archivo y líneas del código bajo `backend/app/`. "Por confirmar" = no se pudo comprobar de forma concluyente.

## Escala de severidad

| Severidad | Criterio |
|---|---|
| **Alta** | Expone datos/dinero o permite acciones no autorizadas en flujos núcleo |
| **Media** | Debilita una regla de negocio o seguridad, con mitigantes parciales |
| **Baja** | Impacto limitado o de detalle |

---

## A. Brechas de seguridad y control de acceso

| ID | Riesgo | Sev. | Evidencia | Impacto | Mitigación sugerida (NO aplicada) | Origen |
|---|---|---|---|---|---|---|
| R-01 | `GET /solicitudes/` es público y **no filtra por estado**: expone solicitudes `oculto`, `rechazado` y `cancelado`. | Alta | `controllers/solicitudes.py:L121-131` | Contradice la moderación admin; filtración de contenido retirado. | Filtrar por `estado=publicado` y exigir JWT. | S-01 |
| R-02 | `GET /wallet/milestones/<id>` y `/check` **no verifican que el usuario sea participante** del contrato. | Alta | `controllers/wallet.py:L228-235, L288-300` | Cualquier usuario autenticado puede consultar hitos y montos de contratos ajenos. | Validar `user_id ∈ {solicitante, proveedor}`. | S-02 |
| R-03 | `POST /contracts/` no valida que el `proveedor_id` tenga una oferta ni que sea `pds`. | Media | `controllers/contracts.py:L28-61` | Un solicitante puede crear contratos con usuarios arbitrarios (sin oferta aceptada). | Exigir oferta aceptada y rol `pds`. | S-03 |
| R-04 | El *rate limit* es **en memoria por proceso** y se **desactiva en `development`/`testing`**. | Media | `rate_limit.py:L5-6, L9-14, L50-56` | Ineficaz con varios workers; sin protección contra fuerza bruta en entornos no productivos. | Almacén compartido (Redis) y activarlo por entorno. | S-04 / D-11 |
| R-05 | **Chat sin control de acceso por relación**: cualquier usuario autenticado puede abrir una conversación con cualquier `user_b_id`. | Alta | `controllers/chat.py:L57-74` | Contacto no solicitado y elusión del desbloqueo de datos sensibles (HU-19). | Permitir chat solo entre participantes de una oferta/contrato. | D-03 |
| R-06 | `POST /solicitudes/<id>/ratings` **no valida que el autor sea participante** ni que `calificado_id` sea la contraparte. | Media | `controllers/solicitudes.py:L260-286` | Manipulación de reputación (calificaciones de terceros). | Validar participación en el contrato asociado. | D-08 |
| R-07 | `GET /maranas/<id>` devuelve **cualquier maraña** sin verificar que esté publicada o sea propia (el docstring dice "publicada o propia"). | Baja | `controllers/maranas.py` (`GET /maranas/<id>`) | Lectura de marañas canceladas/ajenas por ID. | Aplicar la regla del docstring. | Fase 2 |
| R-08 | `GET /providers/search` es **público** y devuelve el **correo electrónico** de cada PDS. | Media | `controllers/providers.py:L19-31, L74, L93` | Exposición de dato personal (Habeas Data) y riesgo de *scraping*/spam. | Omitir `email` en la respuesta pública y/o exigir JWT. | Fase 2 |
| R-09 | `POST /habilidades` y `DELETE /habilidades/<id>` solo exigen JWT: **cualquier usuario autenticado** puede crear o eliminar oficios del catálogo (si nadie los certificó). | Media | `controllers/habilidades.py:L91-118, L236-245` | Alteración del catálogo nacional de oficios por usuarios sin privilegios. | Restringir a `admin`/`superadmin`. | Fase 2 |
| R-10 | La certificación de un nivel por **documento/URL se registra al instante** sin revisión de un verificador. | Media | `controllers/habilidades.py:L193-231` | Niveles "certificados" sin validación real; puede inflar la progresión y el Trust Score. | Pasar por estado `en_revision` (como las certificaciones técnicas, `L331`). | Fase 2 |
| R-11 | `POST /negocios/<id>/rating`: **cualquier usuario autenticado** (incluido el dueño) puede calificar un negocio, sin vínculo con una transacción. | Baja | `controllers/negocios.py:L430-465` | Autocalificación y manipulación del promedio del negocio. | Impedir al dueño y exigir interacción previa. | Fase 2 |
| R-12 | `POST /chambas/` no verifica que el contrato esté **firmado/aceptado** y permite crearla a **cualquiera de las dos partes**; además `en_proceso → en_ejecucion` no exige rol ni condición. | Media | `controllers/chambas.py:L137-161, L177-280` | Chambas creadas sobre contratos no aceptados; avance de estado sin los controles previstos. Por confirmar si el frontend lo previene. | Validar `contract.estado` y rol por transición. | Fase 2 |

## B. Persistencia, entrega y operación

| ID | Riesgo | Sev. | Evidencia | Impacto | Mitigación sugerida (NO aplicada) |
|---|---|---|---|---|---|
| R-13 | **Almacenes en memoria** para OTP, desafíos 2FA y tokens de verificación de email/reseteo de contraseña. | Media | `controllers/otp.py:L24`; `services/two_factor.py:L18`; `controllers/auth_password.py:L22-23`; `controllers/email_verification.py` | Se pierden al reiniciar y no funcionan con varios workers/instancias. | Redis con TTL. |
| R-14 | **No se envía el correo** de verificación ni de recuperación de contraseña (solo se genera el token). | Alta (funcional) | `controllers/auth_password.py:L68-70` (TODO); `controllers/email_verification.py:L63` (TODO) | En un despliegue real el usuario **no puede recuperar su contraseña ni verificar su email**. | Integrar proveedor de correo (`send_reset_email`). |
| R-15 | **Pagos y depósitos simulados**: pasarela `MockGateway` que siempre aprueba; el depósito a billetera **acredita al instante sin pasarela**; el retiro solo mueve saldo a `saldo_bloqueado`. | Alta (si se despliega a producción) | `services/payments.py:L36-122`; `services/wallet.py:L23-84` | Creación de saldo sin respaldo monetario; sin transferencia real. | Activar pasarela real (MercadoPago/PSE) y conciliación. |
| R-16 | Cálculo de comisión **inconsistente** y con `except: pass` que oculta fallos. | Media | `services/payments.py:L100-106`; `controllers/contracts.py:L196-232` | Montos distintos según el camino; errores silenciosos en liquidación. | Unificar el cálculo y registrar excepciones. |
| R-17 | Las disputas son **solo registro**: el admin las resuelve sin retención de fondos. | Media | `controllers/admin.py` (`/disputes/<id>/resolve`) | La resolución no tiene efecto financiero automático. | Integrar retención/liberación de fondos. |
| R-18 | El **SLA de KYC (48 h)** detecta casos vencidos pero **no alerta al admin** (TODO). | Baja | `app/tasks.py:L100-123` (TODO en L119) | Verificaciones pueden quedar sin atender. | Notificación/correo al admin regional. |
| R-19 | Cascada geoespacial de notificaciones **no cableada**: `CascadeManager.start_cascade` nunca se invoca. | Media (funcional) | `services/cascade.py:L40`; `controllers/solicitudes.py:L51-109` | Los PDS cercanos **no reciben aviso** al publicarse una solicitud (HU-36 / HU-04.3). | Invocarlo al publicar. |

---

## C. Limitaciones funcionales conocidas (no son brechas de seguridad)

Se documentan en las HU correspondientes con la etiqueta **"Brecha conocida"**:

| Ref. | Limitación | HU afectada |
|---|---|---|
| D-04 | No existe la confirmación automática a las 48 h (`completado_pendiente` queda abierto). | HU-07, HU-20 |
| D-05 | No existen el descuento por volumen (10 %) ni la exención de 3 meses para PDS nuevo. | HU-15 |
| D-06 | Suscripciones simuladas (sin prueba de 3 meses ni cobro recurrente); cancelar degrada de inmediato; monedas de bienvenida nunca se otorgan. | HU-11 |
| D-07 | El registro no valida mayoría de edad. | HU-01, HU-17 |
| D-14 / D-15 | Visor 360° es Photo Sphere Viewer (no A-Frame), sin detección de ancho de banda; PWA sin Web Push ni cola offline. | HU-06, HU-16, HU-18, HU-37 |
| D-20 | Verificación Express, servicios de valor agregado y cobro del certificado de ingresos no existen. | HU-12, HU-13, HU-14 |
| D-26 | PDF de reporte operativo y filtro por periodo en UI: por confirmar. | HU-09, HU-27, HU-28 |
| Fase 2 | La HU `RF-44` (comerciante responde a solicitudes) **no coincide** con `POST /solicitudes/<id>/ofertas`, que exige rol `pds`; por confirmar si el comerciante puede ofertar. | HU-47 |
| Fase 2 | Umbral del quiz de habilidades: constante `UMBRAL_QUIZ = 0.8` pero el mensaje y el docstring dicen 70 %. | HU-54 |
| Fase 2 | `GET /habilidades/progreso` devuelve `endosos: 0` fijo (los endosos no se cuentan en la progresión). | HU-55 |

---

*Este registro es un insumo del material de sustentación: evidencia de que el análisis fue crítico y de que las brechas están identificadas, trazadas y pendientes de priorización.*
