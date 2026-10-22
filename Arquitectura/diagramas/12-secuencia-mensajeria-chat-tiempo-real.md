# Diagrama de Secuencia — Flujo 12: Mensajería y Chat 1:1 en Tiempo Real (WebSockets)

> **Módulo:** Mensajería Bidireccional WebSockets, Negociación Estructurada y Protocolo de Marcadores  
> **Fuentes de Código:** [`backend/app/controllers/chat.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/chat.py), [`backend/app/controllers/oferta_socket.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/oferta_socket.py), [`backend/app/models/message.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/message.py), [`frontend/src/features/chat/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/chat/), [`frontend/src/lib/mensajesChat.ts`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/lib/mensajesChat.ts)  
> **Historias de Usuario:** [HU-29](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-29-envío-y-recepción-de-mensajes-de-texto-en-tiempo-real), [HU-30](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-30-negociación-interactiva-de-condiciones-en-el-chat), [HU-31](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-31-intercambio-de-adjuntos-multimedia), [HU-32](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-32-mensajes-del-sistema-y-tarjetas-de-acuerdo), [HU-69](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-69-historial-de-mensajes-scroll-automático-y-estados-de-lectura).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor SOL as Solicitante (Cliente)
    actor PDS as PDS (Trabajador)
    participant FE1 as Frontend React Solicitante
    participant SIO as Servidor Flask-SocketIO
    participant API as Flask API Gateway (chat.py)
    participant DB as PostgreSQL 16 (conversations, messages)
    participant FE2 as Frontend React PDS

    %% ---------------------------------------------------------
    %% SUBFLUJO A: CONEXIÓN Y SUSCRIPCIÓN A SALA PRIVADA
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of SOL: SUBFLUJO A: Apertura de Chat y Handshake WS
    SOL->>FE1: Accede a /solicitante/mensajes y selecciona conversación #1
    FE1->>API: GET /api/v1/chat/conversations/1/messages
    API->>DB: SELECT * FROM messages WHERE conversation_id = 1 ORDER BY created_at ASC
    DB-->>API: Historial previo
    API-->>FE1: HTTP 200 OK [messages]
    FE1->>SIO: WS connect (auth: Bearer JWT)
    FE1->>SIO: WS emit("join_room", {room: "conversation_1"})
    SIO-->>FE1: Confirmación de unión a sala privada
    FE1-->>SOL: Renderiza mensajes previos y tarjetas del sistema
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: MENSAJE ESTRUCTURADO (PROTOCOLO ⟦c:...⟧)
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of SOL: SUBFLUJO B: Tarjetas Estructuradas en Chat
    SOL->>FE1: Agrega condición técnica (Garantía 6 meses) y horario (8:30 AM)
    FE1->>FE1: encodeMensaje("⟦c:contraoferta|monto=120000|hora=8:30AM|garantia=6m⟧")
    FE1->>API: POST /api/v1/chat/conversations/1/messages {contenido: "⟦c:...⟧"}
    API->>DB: INSERT INTO messages (conversation_id=1, sender_id=sol_id, contenido=..., leido=false)
    DB-->>API: commit() exitoso (message_id = 15)
    API->>SIO: socketio.emit("message", {id: 15, contenido: "⟦c:...⟧", sender_id: sol_id}, to="conversation_1")
    SIO-->>FE1: Echo WS -> actualiza hilo local
    SIO-->>FE2: Evento WS "message" recibido en tiempo real
    FE2->>FE2: parseMensaje("⟦c:contraoferta...⟧") -> Renderiza ContraofertaCard
    FE2-->>PDS: Sonido / Toast y visualización interactiva de propuesta
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: RESPUESTA TÉCNICA Y LECTURA MASIVA
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of PDS: SUBFLUJO C: Lectura y Confirmación del Trabajador
    PDS->>FE2: Abre la conversación; el foco desencadena marcación de lectura
    FE2->>API: PATCH /api/v1/chat/conversations/1/messages/read
    API->>DB: UPDATE messages SET leido = true WHERE conversation_id = 1 AND sender_id != pds_id
    DB-->>API: commit()
    API->>SIO: socketio.emit("messages_read", {conversation_id: 1, read_by: pds_id}, to="conversation_1")
    SIO-->>FE1: Doble check azul en pantalla del Solicitante
    PDS->>FE2: Responde con tarjeta de materiales ("Tubería de cobre tipo M")
    FE2->>API: POST /api/v1/chat/conversations/1/messages {contenido: "⟦c:condicion|material=Cobre tipo M⟧"}
    API->>DB: INSERT INTO messages ...
    API->>SIO: socketio.emit("message", ...)
    SIO-->>FE1: Renderiza CondicionCard en pantalla del cliente
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: MODERACIÓN Y ESCALADO A DISPUTA
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of SOL: SUBFLUJO D: Controles de Seguridad y Disputas
    SOL->>FE1: Despliega menú contextual "..." en cabecera
    FE1-->>SOL: Opciones "Denunciar usuario", "Denunciar conversación", "Bloquear"
    PDS->>FE2: Presiona FAB flotante "Nueva disputa" en caso de controversia
    FE2-->>PDS: Modal de radicación de arbitraje enlazado a la chamba
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Protocolo Ligero de Marcadores (`⟦c:...⟧`):** Para evitar sobrecargar la base de datos relacional con múltiples esquemas de mensajería, la tabla `messages` almacena texto plano estructurado. El compilador cliente en `frontend/src/lib/mensajesChat.ts` detecta patrones como `⟦c:condicion⟧` o `⟦c:contraoferta⟧` y los transmuta en componentes interactivos con botones de acción y resúmenes de precio.
2. **Aislamiento Criptográfico de Salas WebSocket:** Cada conversación habita en la sala `conversation_<id>`. Un usuario solo puede suscribirse si su identidad JWT coincide con `solicitante_id` o `pds_id` de la conversación, previniendo espionaje o inyección de tráfico entre participantes no autorizados.
3. **Marcación Eficiente de Lectura en Lote:** En lugar de emitir un evento por cada mensaje individual, `PATCH /api/v1/chat/conversations/<id>/messages/read` actualiza masivamente todos los registros pendientes del peer en una sola sentencia SQL (`UPDATE messages SET leido = true WHERE conversation_id = ? AND sender_id != ?`), notificando el cambio de estado mediante el evento socket `messages_read`.
4. **Resiliencia Híbrida (REST + WS Fallback):** La persistencia se efectúa primero a través del API Gateway HTTP (`POST /messages`), garantizando durabilidad transaccional en PostgreSQL antes de emitir la difusión en memoria mediante Socket.IO.
