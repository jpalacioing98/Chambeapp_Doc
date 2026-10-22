# Diagrama de Secuencia — Flujo 13: Notificaciones Push, In-App y Centro de Alertas

> **Módulo:** Notificaciones Multicanal, Centro de Alertas In-App, Sincronización Push y Preferencias  
> **Fuentes de Código:** [`backend/app/controllers/notifications.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/notifications.py), [`backend/app/controllers/notification_socket.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/notification_socket.py), [`backend/app/models/notification.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/notification.py), [`frontend/src/features/notifications/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/notifications/)  
> **Historias de Usuario:** [HU-33](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-33-notificaciones-push-en-cambios-de-estado), [HU-34](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-34-centro-de-notificaciones-in-app), [HU-35](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-35-gestión-de-lectura-de-notificaciones), [HU-70](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-70-preferencias-de-canales-de-notificación).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor ACT as Actor del Evento (Ej. Solicitante Acepta Oferta)
    actor REC as Usuario Destinatario (PDS / Cliente)
    participant API as Flask API Gateway (notifications.py / controllers)
    participant DB as PostgreSQL 16 (notifications, user_preferences)
    participant SIO as Socket.IO Hub (notification_socket.py)
    participant FE as Frontend React (Topbar / NotificacionesDrawer / Perfil)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: GENERACIÓN Y DESPACHO REACTIVO DE ALERTA
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of ACT: SUBFLUJO A: Emisión de Notificación por Evento
    ACT->>API: Transición de negocio (ej. POST /api/v1/ofertas/3/responder)
    API->>API: crear_notificacion(user_id=pds_id, tipo="oferta_aceptada", texto="Tu oferta fue aceptada")
    API->>DB: INSERT INTO notifications (user_id, tipo, titulo, mensaje, leida=false)
    DB-->>API: commit() exitoso (notification_id = 36)
    API->>SIO: emit("notificacion:nueva", {id: 36, tipo: "oferta_aceptada", ...}, room=f"user_{pds_id}")
    SIO-->>FE: Evento WS recibido en tiempo real
    FE->>FE: Incrementa contador no-leídas (+1) y despliega Toast flotante
    FE-->>REC: Notificación sonora y visual en pantalla
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: CONSULTA DEL FEED Y CONTEO DE NO LEÍDAS
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of REC: SUBFLUJO B: Inspección en Centro de Alertas In-App
    REC->>FE: Clic en icono de campana en Topbar
    FE->>API: GET /api/v1/notifications/no-leidas (Bearer JWT)
    API->>DB: SELECT COUNT(*) FROM notifications WHERE user_id = ? AND leida = false
    DB-->>API: count: 21
    API-->>FE: HTTP 200 OK {count: 21}
    FE->>API: GET /api/v1/notifications/
    API->>DB: SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC
    DB-->>API: Colección cronológica de notificaciones
    API-->>FE: HTTP 200 OK [notifications]
    FE-->>REC: Despliega cajón lateral con lista de avisos estructurados
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: GESTIÓN DE LECTURA ATÓMICA Y MASIVA
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of REC: SUBFLUJO C: Marcación de Lectura
    REC->>FE: Clic sobre la notificación #36 ("Ver detalle")
    FE->>API: POST /api/v1/notifications/36/marcar-leida
    API->>DB: UPDATE notifications SET leida = true WHERE id = 36 AND user_id = ?
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {id: 36, leida: true}
    FE-->>REC: Disminuye badge a 20 y redirige a la chamba
    REC->>FE: Clic en botón "Marcar todas como leídas"
    FE->>API: POST /api/v1/notifications/marcar-todas-leidas
    API->>DB: UPDATE notifications SET leida = true WHERE user_id = ? AND leida = false
    DB-->>API: commit() (20 registros actualizados)
    API-->>FE: HTTP 200 OK {message: "Todas marcadas"}
    FE-->>REC: Badge de campana se limpia a 0
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: CONFIGURACIÓN DE CANALES Y PREFERENCIAS
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of REC: SUBFLUJO D: Gobernanza de Preferencias de Notificación
    REC->>FE: En /perfil despliega acordeón "Notificaciones"
    FE->>API: GET /api/v1/users/me/preferences
    API->>DB: SELECT * FROM user_preferences WHERE user_id = ?
    DB-->>API: {push_enabled: true, email_digest: false, job_alerts: true}
    API-->>FE: HTTP 200 OK {preferences}
    REC->>FE: Activa digest por email y guarda cambios
    FE->>API: PUT /api/v1/users/me/preferences {email_digest: true}
    API->>DB: UPDATE user_preferences SET email_digest = true WHERE user_id = ?
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {message: "Preferencias actualizadas"}
    FE-->>REC: Toast verde de confirmación
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Canal Personalizado WebSocket (`user_<id>`):** Cada usuario autenticado se une automáticamente al conectarse a una sala privada basada en su ID criptográfico del JWT (`room = f"user_{identity}"`). Esto garantiza que los eventos de notificación in-app lleguen en milisegundos sin generar tráfico espurio a otros clientes.
2. **Alertas Obligatorias de Formalización Laboral (RF-10):** Ciertos eventos de plataforma (como la formalización de contrato o el comprobante de liquidación de pago) se marcan con prioridad alta y no pueden ser silenciados en las preferencias del usuario, garantizando el cumplimiento del marco legal de seguridad social en Colombia.
3. **Optimización en Serialización de Listados:** El endpoint `/api/v1/notifications/` evita problemas de paginación que retornen esquemas vacíos mediante el consumo directo de la colección de entidades serializadas con Marshmallow `NotificationSchema(many=True)`.
4. **Idempotencia en Marcación de Lectura:** El endpoint `POST /api/v1/notifications/marcar-todas-leidas` opera de manera idempotente sobre todos los registros en `leida = false`, reduciendo el contador a cero en una única transacción de base de datos.
