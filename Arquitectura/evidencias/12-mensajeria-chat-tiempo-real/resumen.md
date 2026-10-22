# Resumen de Ejecución — Flujo 12: Mensajería y Chat en Tiempo Real WebSockets

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, monitor de tráfico REST/WS y preservación de estado JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-29](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-29-envío-y-recepción-de-mensajes-de-texto-en-tiempo-real), [HU-30](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-30-negociación-interactiva-de-condiciones-en-el-chat), [HU-31](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-31-intercambio-de-adjuntos-multimedia), [HU-32](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-32-mensajes-del-sistema-y-tarjetas-de-acuerdo), [HU-69](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-69-historial-de-mensajes-scroll-automático-y-estados-de-lectura).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente / Empleador)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Carga de bandeja de entrada, apertura de conversación activa con prestador, publicación de condición contractual estructurada, envío de contraoferta con horario convenido, transmisión de referencia fotográfica y auditoría de moderación | `/solicitante/mensajes` |
| **Prestador de Servicios (PDS / Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Recepción en tiempo real de notificaciones y mensajes entrantes, apertura de conversación, confirmación técnica mediante tarjeta de especificación de materiales, despliegue del modal integrado de resolución de disputas y marcación de lectura | `/pds/mensajes` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/solicitante/mensajes` | Solicitante inicia sesión y accede al módulo de Mensajes; el layout 2-pane carga la lista de conversaciones y los filtros de estado (`Todos`, `No leídos`, `Mis chambas`, `Disputa`) | `POST /api/v1/auth/login`<br>`GET /api/v1/chat/conversations` | 200<br>200 | [01-solicitante-bandeja-mensajes-lista.png](capturas/01-solicitante-bandeja-mensajes-lista.png) |
| **02** | `/solicitante/mensajes` | Solicitante selecciona la conversación activa con PDS; el hilo despliega avatar `PD`, nombre `Pds`, badge `Verificado`, tarjeta contextual de chamba vinculada y tarjeta del sistema `ACUERDO ALCANZADO` | `GET /api/v1/chat/conversations/1/messages`<br>`GET /api/v1/users/1/profile` | 200<br>200 | [02-solicitante-hilo-conversacion-abierto.png](capturas/02-solicitante-hilo-conversacion-abierto.png) |
| **03** | `/solicitante/mensajes` | Solicitante agrega condición técnica vinculante (`⟦c:condicion⟧`); el frontend renderiza la tarjeta interactiva `CondicionCard` destacando garantía de 6 meses y autor | `POST /api/v1/chat/conversations/1/messages` | **201** | [03-solicitante-condicion-contractual-publicada.png](capturas/03-solicitante-condicion-contractual-publicada.png) |
| **04** | `/solicitante/mensajes` | Solicitante publica tarjeta estructurada de contraoferta (`⟦c:contraoferta⟧`) con ajuste de fecha (`jue, 22 de oct`), franja horaria (`8:30 AM`) y monto acordado (`$120.000` COP) | `POST /api/v1/chat/conversations/1/messages` | **201** | [04-solicitante-contraoferta-horario-ajustado.png](capturas/04-solicitante-contraoferta-horario-ajustado.png) |
| **05** | `/solicitante/mensajes` | Solicitante envía evidencia fotográfica y URL del área de tubería bajo el fregadero; el snippet de la conversación en la bandeja izquierda se actualiza automáticamente | `POST /api/v1/chat/conversations/1/messages` | **201** | [05-solicitante-adjunto-multimedia-enviado.png](capturas/05-solicitante-adjunto-multimedia-enviado.png) |
| **06** | `/solicitante/mensajes` (Dropdown) | Solicitante despliega el menú contextual de gobernanza y seguridad (`...` en cabecera); visualiza opciones *"Denunciar usuario"*, *"Denunciar conversación"* y *"Bloquear usuario"* | *(Interacción DOM Dropdown)* | — | [06-solicitante-menu-seguridad-moderacion.png](capturas/06-solicitante-menu-seguridad-moderacion.png) |
| **07** | `/login`<br>`/pds/mensajes` | PDS inicia sesión; en la barra lateral el badge numérico indica mensajes pendientes; al ingresar al chat se marcan leídos los mensajes previos del cliente | `POST /api/v1/auth/login`<br>`GET /api/v1/chat/conversations`<br>`PATCH /api/v1/chat/conversations/1/messages/read` | 200<br>200<br>**200** | [07-pds-bandeja-mensajes-hilo-activo.png](capturas/07-pds-bandeja-mensajes-hilo-activo.png) |
| **08** | `/pds/mensajes` | PDS responde con especificación técnica estructurada (codos de cobre soldables tipo M y teflón de alta densidad); se renderiza como tarjeta saliente a la derecha (`ch-neg-card--out`) | `POST /api/v1/chat/conversations/1/messages` | **201** | [08-pds-condicion-tecnica-confirmada.png](capturas/08-pds-condicion-tecnica-confirmada.png) |
| **09** | Modal `Nueva disputa` | En el hilo de conversación, PDS presiona el FAB flotante *"Nueva disputa"*; despliega modal para radicar controversia con selección de chamba, motivo y descripción detallada | *(Renderizado de modal React)* | — | [09-pds-modal-nueva-disputa-integrada.png](capturas/09-pds-modal-nueva-disputa-integrada.png) |
| **10** | `/pds/mensajes` | Cierre del modal y auditoría general del feed con auto-scroll: presencia de tarjetas de acuerdo, condiciones mutuas, contraoferta de horario y aislamiento de sala privada | `PATCH /api/v1/chat/conversations/1/messages/read` | **200** | [10-auditoria-hilo-completo-sala-privada.png](capturas/10-auditoria-hilo-completo-sala-privada.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

Durante la sesión se registraron peticiones de sincronización en tiempo real y persistencia en base de datos:

```json
[
  { "method": "GET",   "endpoint": "/api/v1/chat/conversations", "status": 200, "nota": "Carga de conversaciones 1:1 del usuario con datos del peer y último mensaje" },
  { "method": "GET",   "endpoint": "/api/v1/chat/conversations/1/messages", "status": 200, "nota": "Carga del historial cronológico ordenado asc por creado_en" },
  { "method": "GET",   "endpoint": "/api/v1/users/1/profile", "status": 200, "nota": "Enriquecimiento de cabecera de chat con datos de verificación, reputación y rol" },
  { "method": "POST",  "endpoint": "/api/v1/chat/conversations/1/messages", "status": 201, "nota": "Persistencia de mensaje (texto/estructurado) y emisión socketio.emit('message')" },
  { "method": "PATCH", "endpoint": "/api/v1/chat/conversations/1/messages/read", "status": 200, "nota": "Marcación en lote de leido=true para todos los mensajes recibidos del peer" },
  { "method": "GET",   "endpoint": "/api/v1/my-disputes", "status": 200, "nota": "Consulta de disputas activas integradas al panel de mensajes como hilo especial" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del subsistema de mensajería bidireccional y negociación contractual en tiempo real, se analizaron los siguientes patrones arquitectónicos:

### 1. Desacoplamiento de Mensajes Estructurados mediante Protocolo de Marcadores (`⟦c:...⟧`)
* **Diagnóstico:** En un chat colaborativo de servicios, los usuarios no solo intercambian texto informal sino que toman decisiones contractuales críticas (acordar precio final, pactar hora exacta de llegada, incorporar garantías técnicas). Almacenar estas acciones en tablas relacionales complejas y separadas fragmentaría la cronología visual del chat.
* **Solución Arquitectónica ChambeApp:** El backend mantiene una tabla `messages` uniforme y liviana (`contenido: db.Text`), mientras que el frontend implementa un compilador/deserializador en `frontend/src/lib/mensajesChat.ts` (`parseMensaje` y `encodeMensaje`) que detecta marcadores `⟦c:condicion⟧`, `⟦c:contraoferta⟧`, `⟦c:aceptada⟧` y `⟦c:fin⟧`. Cuando el parser detecta el marcador, renderiza dinámicamente componentes React de primer nivel (`CondicionCard`, `ContraofertaCard`, `AceptacionCard`) preservando la secuencia histórica exacta.
* **Propuesta Técnica para el Backend:** Implementar una columna nativa `tipo_mensaje` (`Enum: texto, condicion, contraoferta, sistema, adjunto`) y una columna JSONB `metadatos` en la tabla `messages`, permitiendo consultas indexadas por base de datos (e.g., extraer todas las condiciones aprobadas de una chamba mediante SQL directo `WHERE tipo_mensaje = 'condicion'`).

### 2. Gobernanza de Seguridad en WebSockets y Control de Acceso RBAC
* **Diagnóstico:** En aplicaciones basadas en WebSockets (Flask-SocketIO), un vector de ataque común consiste en permitir que el cliente envíe su propio `user_id` en el evento `join` o `message` para suplantar a otro participante.
* **Solución Arquitectónica ChambeApp:** El módulo `backend/app/controllers/chat_socket.py` deriva el `user_id` **exclusivamente del token JWT verificado** mediante `decode_socket_user_id(auth=auth)` durante el handshake. En las salas `conversation_<id>`, el servidor valida obligatoriamente que `conv.involves(int(user_id))` sea verdadero antes de ejecutar `join_room()`, denegando el acceso a terceros con evento `error: 'No autorizado para unirse a la conversación'`.
* **Propuesta Técnica de Grado:** Implementar *Rate Limiting* en WebSockets (máximo 10 mensajes por minuto por usuario) mediante una ventana deslizante en Redis para mitigar ataques de denegación de servicio (DoS) o spam automatizado en canales de mensajería.

### 3. Integración Nativa del Módulo de Disputas en el Chat (Sin Fricción de UX)
* **Diagnóstico:** Cuando un cliente o prestador experimenta un conflicto durante la ejecución, forzarlo a abandonar la conversación para buscar un formulario de soporte en la configuración de la cuenta incrementa la tasa de abandono y la frustración.
* **Solución Arquitectónica ChambeApp:** El componente `MensajesPage.tsx` integra el FAB *"Nueva disputa"* directamente sobre el lienzo del chat. Al accionarlo, se precargan los datos de la chamba y el usuario puede radicar la controversia sin perder el contexto conversacional.
* **Propuesta Técnica de Grado:** Permitir que, al abrirse una disputa formal, un moderador o agente de soporte de ChambeApp sea suscrito automáticamente a una sala de chat tripartita (`conversation_disputa_<id>`), facilitando la mediación asistida y la recopilación de evidencias en tiempo real.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La consulta directa en PostgreSQL (`chambeapp_db_dev`) certifica el éxito del flujo completo:

### Tabla `conversations`
* **ID Conversación:** `1`
* **Participante A (`user_a_id`):** `1` (`pds@chambeapp.com`)
* **Participante B (`user_b_id`):** `2` (`solicitante@chambeapp.com`)
* **Timestamp Creación:** `2026-10-07 03:45:19 UTC` (Normalización de par ordenada y única)

### Tabla `messages` (Historial de Conversación #1)
| Msg ID | Sender ID | Rol Emisor | Estado Lectura (`leido`) | Resumen de Contenido | Tipo Estructurado |
|:---:|:---:|:---:|:---:|:---|:---:|
| `1` | `2` | Solicitante | **True** | `⟦c:aceptada⟧{"quien":"solicitante","monto":120000}` | `AceptacionCard` |
| `6` | `2` | Solicitante | **True** | `⟦c:condicion⟧{"texto":"Garantía técnica: El prestador debe garantizar 6 meses..."}` | `CondicionCard` |
| `7` | `2` | Solicitante | **True** | `⟦c:contraoferta⟧{"ofertaId":1,"monto":120000,"fecha":"2026-10-22","horario":"8:30 AM"}` | `ContraofertaCard` |
| `8` | `2` | Solicitante | **True** | `Te comparto foto del estado actual de la tubería debajo del fregadero...` | Adjunto / Foto |
| `9` | `1` | PDS | **False** | `⟦c:condicion⟧{"texto":"Especificación de materiales: Se utilizarán codos de cobre..."}` | `CondicionCard` |

* **Video de Auditoría:** `video/12-mensajeria-chat-tiempo-real.webm` (5.2 MB)
