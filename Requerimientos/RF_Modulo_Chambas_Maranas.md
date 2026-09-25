# RF Módulo Chambas + Marañas (Rebusque) — RF-49 a RF-60

> Fuente: `modulo chambas.md`, `PLAN_IMPLEMENTACION_MODULO_CHAMBAS.md`, `Chambeapp_backend/CHANGELOG.md` (Unreleased: chambas + marañas), verificado contra `app/models/chamba.py`, `app/models/marana.py`, `app/routes/chambas.py`, `app/routes/maranas.py`, `app/services/chamba.py`.
> Numeración continúa RF-48 (RF_Modulo_Comerciante). Formato EARS. Implementado backend (100%).

## Modelo base

- Tabla `chambas` 1:1 con `contracts` (`contract_id` unique FK, `estado`, `estado_previo`, 6 timestamps hito, `evidencia_entrada/salida` JSON, `adendas`, `novedades`, `pago_*`, `rating_*`, `habilidades_validadas`). Migración `009_add_chamba_module` + `012_fecha_validacion`.
- Máquina estados reales `EstadoChamba`: `programada` → `en_proceso` → `en_ejecucion` ↔ `pausada` → `pendiente_validacion` → `liquidacion_confirmada` → `finalizada`. `TRANSICIONES_VALIDAS` en `app/services/chamba.py`.
- Maraña (`maranas` + `maranas_ofertas`) derivada de adenda: `EstadoMarana` `publicado|asignado|completado|pagado|cancelado`; oferta `pendiente|aceptada|rechazada|contraoferta`. Migración `011_marana_module`.
- Tests: `tests/test_chambas.py` (40), `tests/test_maranas.py` (16).

---

### RF-49: Crear expediente Chamba tras contrato firmado
**HU-49:** Como solicitante/prestador quiero expediente de ejecución al firmar contrato para trazar hitos.
**EARS:** WHEN contrato pasa a aceptado vía `PATCH /contracts/<id>/estado` THEN sistema SHALL crear `Chamba` en `programada` con `fecha_activacion=now` (auto) y 1:1 constraint. WHEN existe chamba para contrato THEN SHALL 400 "ya tiene chamba".
**APIs:** `POST /api/v1/chambas/` `{contract_id}` → 201 `ChambaSchema`; `GET /api/v1/chambas/<id>` (solo participantes); `GET /solicitante/<uid>` y `/prestador/<uid>` con `?estado` filtro + paginación.
**CA:** 1) Solo participantes pueden crear/ver. 2) Envelope `ChambaSchema`. 3) Emit `chamba:actualizado` socket a ambos.

### RF-50: Hito 1 — Activación / Contrato firmado
**EARS:** WHEN chamba creada THEN SHALL `estado=programada`, `fecha_activacion` registrada, `contract_id` vinculado. WHEN consultar detalle THEN SHALL mostrar `historialAdendas`, `novedades` vacíos, pago false.
**CA:** Generación automática al aceptar propuesta (flujo firma: oferta aceptada ≠ asignada hasta firmar; al firmar solicitud → "en curso").

### RF-51: Hito 2 — Inicio de obra con geo-validación
**EARS:** WHEN prestador envía `PATCH /chambas/<id>/estado {estado: en_proceso, latitud, longitud}` AND `estado actual=programada` THEN sistema SHALL validar GPS dentro de `RADIO_VALIDACION_KM=0.1` (100m) vía PostGIS `ST_DistanceSphere` (prod) / Haversine (tests) — `verificar_geoposicion` — y registrar `fecha_inicio_obra`.
**CA:** 1) Solo prestador. 2) 400 si sin coords o sin ubicación solicitud. 3) 400 "fuera del radio (100m)". 4) Solo desde `programada`.

### RF-52: Evidencia entrada (hito 2-3)
**EARS:** WHEN prestador `POST /chambas/<id>/evidencia-entrada {urls[]}` AND estado `en_proceso|en_ejecucion` THEN SHALL append a `evidencia_entrada`.
**CA:** Upload previo `POST /chambas/evidencia/upload {archivo_base64, nombre_archivo}` → MinIO `storage.upload_avatar` → `{url}`. Validación base64, no vacío. Si storage null → 502.

### RF-53: Hito 3 — Adendas al contrato (tiempo/monto extra)
**EARS:** WHEN participante `POST /chambas/<id>/adenda {descripcion, monto_extra?, tiempo_extra?, tiempo_extra_unidad?, cubierta_por?, categoria_requerida?}` AND chamba no finalizada THEN SHALL `agregar_adenda` con `fecha=now`, `sugerida_por_pds = (es_pds && cubierta_por=otro_pds)`.
**CA:** `cubierta_por: pds_actual|otro_pds` + `categoria_requerida` si otro perfil; `tiempo_extra_unidad: minutos|horas|dias`; validación monto/tiempo >=0; notif `chamba_adenda`; `PATCH /adenda/<idx>` y `DELETE /adenda/<idx>` solo solicitante si no derivada.

### RF-54: Hito 3 — Novedades / Botón pánico / Pausa
**EARS:** WHEN participante `POST /chambas/<id>/novedad {tipo, descripcion}` THEN SHALL `agregar_novedad` salvo FINALIZADA. WHEN `PATCH /estado {estado: pausada}` THEN SHALL guardar `estado_previo` y notificar `chamba_pausada`. WHEN `PAUSADA → en_proceso|en_ejecucion` THEN SHALL restaurar sin re-validar GPS.
**CA:** `TRANSICIONES_VALIDAS`: `en_proceso→en_ejecucion|pausada`, `en_ejecucion→pendiente_validacion|pausada`, `pausada→en_proceso|en_ejecucion`.

### RF-55: Hito 4 — Solicitud de cierre + Evidencia salida obligatoria
**EARS:** WHEN prestador `POST /chambas/<id>/evidencia-salida {urls}` AND estado `en_ejecucion|pendiente_validacion` THEN SHALL append a `evidencia_salida`. WHEN prestador `PATCH /estado {estado: pendiente_validacion}` THEN SHALL exigir `evidencia_salida` no vacía (400 si falta) y set `fecha_solicitud_cierre=now` + notif `chamba_cierre_solicitado`.
**CA:** 400 "Registra al menos una evidencia final (foto/360°)" — hito 4 del CHANGELOG. Solo prestador.

### RF-56: Hito 4 — Validación de habilidades en sitio (revisión)
**EARS:** WHEN solicitante `POST /chambas/<id>/validacion {habilidades[]}` AND `estado=pendiente_validacion` THEN SHALL guardar `habilidades_validadas` + `fecha_validacion=now` (migración 012).
**CA:** Solo solicitante; liquidación queda solo para pago. Conserva habilidades si calificación no envía array.

### RF-57: Hito 5 — Liquidación / Pago directo dual (check-in)
**EARS:** WHEN participante `POST /chambas/<id>/pago {monto_final?}` AND estado `pendiente_validacion|liquidacion_confirmada` THEN SHALL `confirmar_pago`: flag `pago_confirmado_solicitante|prestador`; si ambos true → `pago_directo_confirmado=true`. WHEN estado `liquidacion_confirmada` requiere `pago_directo_confirmado` true (validado en `PATCH /estado` a liquidación).
**CA:** 1) Solo participantes. 2) `PATCH /estado {estado: liquidacion_confirmada}` solo solicitante. 3) Notif `chamba_pago_confirmado`. 4) `pago_monto_final` actualizable.

### RF-58: Hito 6 — Finalización, calificación y crecimiento profesional
**EARS:** WHEN solicitante `POST /chambas/<id>/calificacion {estrellas 1-5, comentario?, habilidades?}` AND `estado=liquidacion_confirmada` THEN SHALL `finalizar_chamba`: set `rating_estrellas`, `rating_comentario`, `habilidades_validadas` (si provided else conserva), `estado=finalizada`, `fecha_finalizacion=now`.
**CA:** Solo solicitante; `habilidades_validadas` alimenta `EndosoHabilidad`/progreso; notif `chamba_finalizada`; emit socket.

### RF-59: Maraña (rebusque) — adenda derivada como micro-solicitud
**EARS:** WHEN solicitante `POST /chambas/<id>/marana {adenda_idx, titulo, categoria, descripcion, presupuesto?, fecha_deseada?, horario?}` AND adenda no derivada THEN sistema SHALL crear `Marana {chamba_id, adenda_idx, solicitante_id, presupuesto = body.presupuesto ?? adenda.monto_extra, ubicacion=copia solicitud, estado=publicado}` y mutar adenda: `{derivada:true, marana_id, monto_extra:null, tiempo_extra:null}` (MUEVE monto fuera de chamba).
**CA:** 1) Solo solicitante de la chamba, 403 else. 2) 400 si finalizada o idx inválido o ya derivada. 3) Feed `GET /maranas/` (solo `publicado`, filtro `?categoria`, paginado) público PDS. 4) `GET /maranas/chamba/<id>` solo participantes. 5) Detalle `GET /maranas/<id>` auth.

### RF-60: Maraña — postulación, negociación y pago directo
**EARS:**
- WHEN pds `POST /maranas/<id>/ofertas {monto?, mensaje?}` AND `publicado` AND rol `pds` THEN SHALL crear `MaranaOferta pendiente` (400 si ya activa, 403 si es solicitante).
- WHEN `POST /maranas/<id>/responder {accion}` con `?oferta_id` THEN SHALL: `contraofertar`→ `contraoferta` (+`contra_monto/mensaje`), `rechazar`→ `rechazada`, `aceptar|aceptar_contraoferta`→ `aceptada` + `estado=asignado`, `pds_asignado_id`, `fecha_asignacion`, `presupuesto=monto_acordado` (contra_monto si existe), rechazar otras pendientes. Permisos: aceptar solo solicitante; rechazar solicitante o pds en contraoferta; contraofertar ambas partes; aceptar_contraoferta solo pds.
- WHEN pds asignado `PATCH /maranas/<id>/estado {accion: completar}` AND `asignado` THEN `completado` + `fecha_entrega`. WHEN solicitante `cancelar` THEN `cancelado` (salvo pagado/cancelado).
- WHEN `POST /maranas/<id>/pago {monto_final?}` AND `completado` THEN flag dual como chamba → ambos true → `pagado` + `fecha_pago`; listados `GET /maranas/solicitante/<uid>` y `/prestador/<uid>` con `?estado`.
**CA:** Notifs `marana_oferta/contraoferta/asignada/completada/pago` + socket `marana:actualizada/asignada`.

## Diagrama estados
`programada → en_proceso --(evidencia_entrada)--> en_ejecucion --(evidencia_salida)--> pendiente_validacion --(validacion habilidades)--> pendiente_validacion --(pago dual)--> liquidacion_confirmada --(calificación)--> finalizada`; `en_proceso|en_ejecucion ↔ pausada`; adenda `otro_pds` → `maraña publicado→asignado→completado→pagado`.

## Trazabilidad API
| RF | Endpoint |
|---|---|
|49|POST /chambas/ + GET /chambas/<id> + GET /solicitante|prestador/<uid>|
|51-58|PATCH /chambas/<id>/estado + evidencias + adenda + novedad + pago + validacion + calificacion|
|59-60|POST /chambas/<id>/marana + /maranas/* + ofertas/responder/estado/pago|

*Verificado código: estados y transiciones idénticos a `app/models/chamba.py` y `app/services/chamba.py`.*