# Modulo 7 - Comunicacion (Chat, Notificaciones, Presencia)

## Diagrama
`comunicacion.puml` — Mensajería 1:1, notificaciones persistentes y estado de conexión.

## Entidades
- **conversations**: conversación 1:1 normalizada (par ordenado user_a < user_b para evitar duplicados).
- **messages**: mensaje dentro de una conversación (remitidor, contenido, leído).
- **notifications**: notificación persistente por usuario (tipo, título, canal, leída).
- **notification_preferences**: preferencias de canal (push/in-app/email) y categorías.
- **presence**: estado online/offline, socket_id y heartbeat para tiempo real (Socket.IO).

## Relaciones y cardinalidad
- `users` 2×1:N `conversations` (participante A y B).
- `conversations` 1:N `messages`; `users` 1:N `messages`.
- `users` 1:N `notifications`.
- `users` 1:1 `notification_preferences`.
- `users` 1:1 `presence`.

## Por qué este diseño
- Par ordenado en `conversations` evita conversaciones duplicadas por orden inverso de usuarios.
- `notifications` persistente permite historial, no solo push efímero.
- `presence` 1:1 con `users` para enrutar mensajes por socket en tiempo real.

## Esquema SQL
`comunicacion.sql.puml` — Índices en conversaciones, mensajes, notificaciones por usuario y fecha.
