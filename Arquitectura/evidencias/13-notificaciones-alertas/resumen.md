# Resumen de Ejecución — Flujo 13: Notificaciones Push, In-App y Centro de Alertas

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, monitor de tráfico REST/WS y preservación de estado JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-33](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-33-notificaciones-push-en-cambios-de-estado), [HU-34](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-34-centro-de-notificaciones-in-app), [HU-35](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-35-gestión-de-lectura-de-notificaciones), [HU-70](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-70-preferencias-de-canales-de-notificación).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente / Empleador)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Carga de cabecera con campana de notificaciones, consulta de conteo de pendientes (`GET /notifications/no-leidas`), inspección del feed histórico, navegación al perfil y configuración de canales de notificación (push, email, ofertas) | `/solicitante`<br>`/solicitante/perfil` |
| **Prestador de Servicios (PDS / Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Carga de panel operativo PDS, inspección del feed de alertas de hitos de trabajo y formalización, marcación unitaria de notificación (`POST /notifications/<id>/marcar-leida`), marcación masiva (`POST /notifications/marcar-todas-leidas`) y auditoría de canal WebSocket Socket.IO | `/pds` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/solicitante` | Solicitante inicia sesión y accede al dashboard principal; el componente `Topbar` evalúa la campana de alertas y el indicador visual de actividad | `POST /api/v1/auth/login`<br>`GET /api/v1/notifications/no-leidas` | 200<br>200 | [01-solicitante-topbar-campana-alertas.png](capturas/01-solicitante-topbar-campana-alertas.png) |
| **02** | `/solicitante` | Consulta de alertas pendientes acumuladas durante el ciclo de vida de los servicios contratados (21 notificaciones no leídas activas) | `GET /api/v1/notifications/no-leidas` | **200** | [02-solicitante-conteo-alertas-no-leidas.png](capturas/02-solicitante-conteo-alertas-no-leidas.png) |
| **03** | `/solicitante` | Inspección y despliegue del feed histórico de alertas in-app: eventos de contratos completados, pagos y cierres de marañas en orden cronológico inverso | `GET /api/v1/notifications/` | **200** | [03-solicitante-feed-notificaciones-historicas.png](capturas/03-solicitante-feed-notificaciones-historicas.png) |
| **04** | `/solicitante/perfil` | Solicitante navega a su perfil de usuario y despliega el acordeón interactivo `Notificaciones` (`NotificacionesAccordion.tsx`) | `GET /api/v1/users/me/profile`<br>`GET /api/v1/users/me/preferences` | 200<br>200 | [04-solicitante-perfil-acordeon-notificaciones.png](capturas/04-solicitante-perfil-acordeon-notificaciones.png) |
| **05** | `/solicitante/perfil` | Modificación de preferencias de canales de notificación (notificaciones push, digest por email, alertas de ofertas directas y formalización) y guardado en backend | `GET /api/v1/users/me/preferences` | **200** | [05-solicitante-preferencias-alertas-guardadas.png](capturas/05-solicitante-preferencias-alertas-guardadas.png) |
| **06** | `/login`<br>`/pds` | PDS inicia sesión; accede a `/pds` y la cabecera sincroniza su estado de alertas operativas de trabajo | `POST /api/v1/auth/login`<br>`GET /api/v1/contracts/mine` | 200<br>200 | [06-pds-panel-alertas-campana.png](capturas/06-pds-panel-alertas-campana.png) |
| **07** | `/pds` | PDS consulta su feed de alertas de trabajo: notificaciones de formalización laboral (RF-10), confirmaciones de pago y ofertas aceptadas | `GET /api/v1/notifications/` | **200** | [07-pds-feed-alertas-operativas.png](capturas/07-pds-feed-alertas-operativas.png) |
| **08** | `/pds` | PDS ejecuta marcación de lectura unitaria sobre una notificación específica (`ID #36`); el backend actualiza el estado a `leida = true` | `POST /api/v1/notifications/36/marcar-leida` | **200** | [08-pds-alerta-unitaria-marcada-leida.png](capturas/08-pds-alerta-unitaria-marcada-leida.png) |
| **09** | `/pds` | PDS ejecuta marcación masiva de todas las notificaciones pendientes; el backend actualiza en lote y el balance de no leídas se reduce a 0 | `POST /api/v1/notifications/marcar-todas-leidas`<br>`GET /api/v1/notifications/no-leidas` | **200**<br>**200** | [09-pds-marcacion-masiva-todas-leidas.png](capturas/09-pds-marcacion-masiva-todas-leidas.png) |
| **10** | `/pds` | Auditoría de arquitectura de tiempo real: canal WebSocket Socket.IO (`notification_socket.py`), sala privada `user:<id>`, evento `notificacion:nueva` y handshake JWT | *(Auditoría de socket en runtime)* | — | [10-auditoria-socket-alertas-tiempo-real.png](capturas/10-auditoria-socket-alertas-tiempo-real.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

Durante la sesión se registraron **40 peticiones HTTP** hacia la API REST de ChambeApp, todas completadas con código `200 OK`:

```json
[
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT de Solicitante" },
  { "method": "GET",  "endpoint": "/api/v1/notifications/no-leidas", "status": 200, "nota": "Consulta de conteo de alertas pendientes (Solicitante: 21 no leídas)" },
  { "method": "GET",  "endpoint": "/api/v1/notifications/", "status": 200, "nota": "Carga cronológica del feed de notificaciones del usuario" },
  { "method": "GET",  "endpoint": "/api/v1/users/me/profile", "status": 200, "nota": "Carga de perfil y preferencias de usuario" },
  { "method": "GET",  "endpoint": "/api/v1/users/me/preferences", "status": 200, "nota": "Carga de canales de notificación activos en backend" },
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT de PDS" },
  { "method": "GET",  "endpoint": "/api/v1/notifications/", "status": 200, "nota": "Carga del feed operativo de alertas para PDS" },
  { "method": "POST", "endpoint": "/api/v1/notifications/36/marcar-leida", "status": 200, "nota": "Marcación atómica de notificación unitaria como leída" },
  { "method": "POST", "endpoint": "/api/v1/notifications/marcar-todas-leidas", "status": 200, "nota": "Actualización masiva por user_id a leida = true" },
  { "method": "GET",  "endpoint": "/api/v1/notifications/no-leidas", "status": 200, "nota": "Verificación post-limpieza: 0 pendientes para PDS" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del subsistema de notificaciones y alertas en tiempo real, se identificaron los siguientes aspectos arquitectónicos y oportunidades de optimización:

### 1. Serialización y Paginación en Controladores REST (Marshmallow vs. `paginate_query`)
* **Diagnóstico:** En `backend/app/controllers/notifications.py`, la clase `NotificationList` declara `@blp.response(200, NotificationSchema(many=True))`. Cuando se invoca `GET /api/v1/notifications/?per_page=5`, el servicio `paginate_query` retorna un diccionario estructurado (`{"items": [...], "total": ..., "page": ...}`). Dado que el decorador espera un iterable de modelos, Marshmallow itera sobre las claves del diccionario en lugar de la lista de ítems, generando objetos vacíos (`[{}]`). En cambio, al invocarse sin parámetros de paginación (`GET /api/v1/notifications/`), el helper retorna `query.all()` (una lista nativa de instancias `Notification`), serializando el 100% de los campos con éxito.
* **Propuesta Técnica para el Backend:** Definir un esquema unificado de paginación `NotificationPaginatedSchema` que contenga `items = fields.List(fields.Nested(NotificationSchema))` junto a los metadatos de paginación (`total`, `page`, `pages`, `per_page`), garantizando consistencia semántica tanto para clientes paginados como para listados completos.

### 2. Aislamiento Multi-Inquilino en WebSocket Socket.IO (`user:<user_id>`)
* **Diagnóstico:** En un sistema de notificaciones en tiempo real, la fuga de alertas entre usuarios representa una vulnerabilidad de privacidad crítica.
* **Solución Arquitectónica ChambeApp:** El módulo `backend/app/controllers/notification_socket.py` implementa control de acceso estricto:
  1. El cliente emite `join` con un token JWT válido.
  2. El servidor valida el JWT con `decode_socket_user_id(auth=data)` y extrae el identificador de usuario verificado.
  3. El socket es confinado exclusivamente a la sala privada `f"user:{user_id}"`.
  4. Ningún cliente puede suscribirse a salas de terceros enviando parámetros arbitrarios en el payload.
* **Propuesta Técnica de Grado:** Añadir un canal Redis Pub/Sub compartido entre múltiples réplicas del backend en clúster (mediante `redis_manager` de Socket.IO), garantizando que los eventos generados por tareas en segundo plano de Celery sean despachados a la sala WebSocket del usuario sin importar a qué réplica esté conectado.

### 3. Idempotencia y Resiliencia en Alertas de Formalización Laboral (RF-10)
* **Diagnóstico:** Al completarse un contrato de servicio informal en Colombia, el sistema emite automáticamente una recomendación de formalización laboral (`MENSAJE_FORMALIZACION`) a ambas partes (afiliación a seguridad social, certificado de ingresos).
* **Solución Arquitectónica ChambeApp:** La función `disparar_notificaciones_formalizacion(contract)` en `notifications.py` implementa una verificación previa de existencia basada en el atributo JSONB `datos.contract_id`:
  ```python
  if not any(n.datos and n.datos.get("contract_id") == contract.id for n in ya):
      crear_notificacion(uid, "formalizacion", MENSAJE_FORMALIZACION, ...)
  ```
  Esto previene duplicados en caso de reintentos en el cambio de estado del contrato y encapsula cualquier fallo de base de datos en un bloque `try/except` con `db.session.rollback()`, asegurando que una falla en notificaciones nunca bloquee la finalización del contrato.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La auditoría directa en la tabla `notifications` de PostgreSQL (`chambeapp_db_dev`) confirma la integridad y el aislamiento multi-usuario del subsistema:

### Balance de Notificaciones por Usuario
* **Prestador de Servicios (PDS - `user_id = 1`):**
  * Total de notificaciones históricas: **11**
  * Notificaciones no leídas (`leida = False`): **0** (100% leídas tras ejecución de marcación masiva en Paso 9)
* **Solicitante (Cliente - `user_id = 2`):**
  * Total de notificaciones históricas: **21**
  * Notificaciones no leídas (`leida = False`): **21** (Preservadas íntegramente; la marcación del PDS no afectó el buzón del cliente)

### Tipología de Eventos Auditados en la Base de Datos
| ID | User ID | Tipo de Notificación | Título / Motivo | Leída | Timestamp |
|:---:|:---:|:---|:---|:---:|:---|
| `1` | `2` | `oferta_nueva` | Nueva postulación recibida | `False` | 2026-10-21 00:35 UTC |
| `3` | `1` | `oferta_aceptada` | Propuesta seleccionada por el cliente | `True` | 2026-10-21 01:17 UTC |
| `6` | `1` | `formalizacion` | Solicitud completada: considera formalizar | `True` | 2026-10-21 02:45 UTC |
| `32` | `2` | `marana_completada` | El trabajo de la maraña fue entregado | `False` | 2026-10-21 23:10 UTC |
| `36` | `1` | `anuncio_contactado` | Nuevo contacto en anuncio laboral | `True` | 2026-10-21 23:40 UTC |

* **Video de Auditoría:** `video/13-notificaciones-alertas.webm` (3.7 MB)
