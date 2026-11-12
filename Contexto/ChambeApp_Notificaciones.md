# Notificaciones — Guía de implementación

> Estado: **in-app + Web Push implementados**. Email digest (Sprint 4) queda pendiente.
> Fuente de tipos: [`NOTIFICATION_SYSTEM_PLAN.md`](../NOTIFICATION_SYSTEM_PLAN.md).

---

## 1. Arquitectura

```
Evento de dominio (oferta, contrato, chamba, KYC, pago…)
        │
        ▼
crear_notificacion(user_id, tipo, mensaje, titulo, datos)
        ├─ MerchantPreference: ¿el usuario quiere este grupo? ──► si no, termina
        ├─ INSERT notifications (sin commit; lo hace el caller)
        ├─ safe_emit("notificacion:nueva", …, room="user:<id>")   → Socket.IO
        └─ enviar_push_notificacion(notif)
                ├─ prefs.push_enabled
                ├─ push_subscriptions del usuario (máx. 10)
                └─ pywebpush.webpush() → Service Worker → showNotification()
```

- **Persistencia + emisión:** `app/controllers/notifications.py:crear_notificacion`.
- **Preferencias:** `app/services/preferencias.py` (mapa único `tipo → toggle`).
- **Push:** `app/services/push.py` (VAPID, envío, limpieza de suscripciones 404/410).
- **Descubrimiento/cascada** también respetan `notif_nueva_solicitud` y envían push.
- **KYC:** `DocumentoVerificar.post` emite `kyc_aprobado` / `kyc_rechazado`
  (con el documento y la nota del revisor) al dueño del documento.
- **Suscripción del navegador:** `POST /api/v1/push/subscribe` (upsert por endpoint;
  el mismo navegador se reasigna si cambia de cuenta).

### Preferencias respetadas

| Toggle | Tipos |
|---|---|
| `notif_nueva_solicitud` | `nueva_solicitud`, `oferta_*`, `contrato_*`, `chamba_*`, `marana_*`, `anuncio_*` |
| `notif_nueva_resena` | `negocio:rating`, `resena_*` |
| `notif_estado_kyc` | `kyc_*`, `documento_*` |
| `notif_pago_recibido` | `pago_*`, `wallet_*`, `contrato_confirmado`, `chamba_pago_confirmado`, `marana_pago` |
| `push_enabled` | Web Push (además de in-app) |

`formalizacion`, `sistema`, `alerta_*` y `recomendacion_*` **no se pueden silenciar**.
Si el usuario no tiene fila en `merchant_preferences`, todo está permitido (defaults `True`).

> Decisión: el filtro de preferencias se centralizó en `crear_notificacion` (y en
> descubrimiento/cascada). Así ningún emisor nuevo puede olvidarse de respetarlas.

---

## 2. Backend

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/notifications` | Lista completa (legacy, sin paginar). Acepta `?page` y devuelve solo `items`. |
| GET | `/api/v1/notifications/pagina` | **Centro de notificaciones**: `{items,total,page,per_page,pages}`. Filtros: `grupo` (`chambas\|pagos\|resenas\|kyc\|sistema`), `tipo`, `solo_no_leidas=1`. |
| GET | `/api/v1/notifications/no-leidas` | `{count}` para la campana. |
| POST | `/api/v1/notifications/<id>/marcar-leida` | Marca una (solo dueño, 404 si no). |
| POST | `/api/v1/notifications/marcar-todas-leidas` | Marca todas. |
| GET | `/api/v1/push/vapid-public-key` | Clave pública VAPID (503 si no está configurada). |
| POST | `/api/v1/push/subscribe` | `{endpoint, keys:{p256dh,auth}, user_agent?}` → upsert. |
| DELETE | `/api/v1/push/subscribe` | `{endpoint}` → borra la suscripción del usuario. |
| GET | `/api/v1/push/subscriptions` | `{count}` (diagnóstico). |

### Modelo y migración

`app/models/push.py` → `push_subscriptions` (endpoint único, `p256dh`, `auth`,
`user_id`, `user_agent`, timestamps). Migración **025**.

En desarrollo el entrypoint crea la tabla con `CREATE TABLE IF NOT EXISTS`
(porque dev hace `flask db stamp head`, no `upgrade`). En prod: `flask db upgrade`.

### Claves VAPID

Generar una sola vez:

```bash
cd Chambeapp_backend
pip install pywebpush==2.5.0
python scripts/generate_vapid_keys.py      # guarda en system_configs
```

También se aceptan variables de entorno `VAPID_PUBLIC_KEY` y
`VAPID_PRIVATE_KEY` (tienen prioridad sobre `system_configs`).
La privada puede ser PEM o base64url DER; la pública es base64url del punto
sin comprimir (87 caracteres).

> En dev, `docker-entrypoint-dev.sh` genera las claves automáticamente si
> `pywebpush` está instalado y aún no existen.

---

## 3. Frontend

| Archivo | Rol |
|---|---|
| `src/features/notificaciones/NotificacionesPage.tsx` | Centro `/notificaciones` (una sola ruta para los 3 roles). |
| `src/features/notificaciones/hooks/useNotificaciones.ts` | Lista paginada, filtros, marcar leída/todas, contador de la campana. |
| `src/features/notificaciones/utils.ts` | Agrupación por fecha, iconos, deep-links por rol. |
| `src/hooks/usePushNotifications.ts` | Permiso, `pushManager.subscribe`, alta/baja en backend, re-asociación. |
| `public/sw-push.js` | `push` → `showNotification`; `notificationclick` → abre/focaliza la app. |
| `src/components/layout/AppShell.tsx` | Campana con contador real y clic → `/notificaciones`. |
| `src/features/perfil/components/NotificacionesAccordion.tsx` | Toggle push real + preferencias por grupo. |
| `vite.config.ts` | `workbox.importScripts: ['/sw-push.js']`. |

### Comportamiento

- **Tiempo real:** al recibir `notificacion:nueva` se refresca lista y contador
  (con 600 ms de margen para que el caller confirme la transacción).
- **Respaldo:** polling de 60 s y `visibilitychange` (si el socket está caído).
- **Filtros:** Todas / Chambas / Pagos / Reseñas / KYC / Sistema (servidor).
- **Leídas:** optimista; si falla la API se revierte el estado.
- **Deep-links:** cada tipo lleva a su entidad (solicitud, contrato, chamba,
  maraña, billetera, KYC, mensajes, anuncio) según el rol.
- **Push:** solo se pide permiso cuando el usuario activa el toggle
  (`NotificacionesAccordion`). Si ya lo concedió, `App` re-asocia la
  suscripción al iniciar sesión, sin volver a preguntar.
- **Iconos:** `icon` usa `/icons/icon-192.png` (color) y `badge` usa
  `/icons/badge-72.png` (glifo blanco con transparencia). Android exige un
  PNG monocromo para el icono pequeño de la barra de estado; un SVG se ve
  como un cuadro blanco.

### Service Worker

El SW generado por `vite-plugin-pwa` importa `/sw-push.js`. En dev (sin SW
generado) el push no está disponible: el toggle muestra el aviso correspondiente.
Probar en `npm run build && npm run preview` o en la PWA instalada.

---

## 4. Pruebas

```bash
# Backend (Docker)
docker exec chambeapp_backend_dev python -m pytest \
  tests/test_push.py tests/test_notificaciones.py \
  tests/test_descubrimiento.py tests/test_cascade.py -q

# Frontend
npx vitest run src/features/notificaciones/NotificacionesPage.test.tsx
npx tsc --noEmit
npm run build
```

Cubierto: alta/baja/upsert de suscripciones, reasignación entre usuarios,
503 sin VAPID, preferencias que suprimen in-app, `push_enabled` que suprime
el envío, payload con deep-link, filtros y paginación del centro.

---

## 5. Pendiente (no incluido)

- **Sprint 4:** email digest (`email_digest`) y alertas a admins por email
  (`check_kyc_sla`, `check_ml_health`).
- **Sprint 5 (resto):** E2E con service worker headless (el centro UI y los
  tests de API ya están).
- Push en segundo plano cuando el usuario tiene varias pestañas: hoy se envía
  a todas las suscripciones (sin control de presencia); el `tag` evita
  duplicados visuales por notificación.
- `sent_push_at` / idempotencia push a nivel de fila (el `tag` nativo cubre
  el caso normal).
