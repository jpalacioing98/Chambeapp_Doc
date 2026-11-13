# Flujos completos de ChambeApp

> Documento de referencia de los flujos funcionales de la plataforma,
> actualizado el **2026-11-13**. Describe el comportamiento real de
> `Chambeapp_frontend` (PWA de los 3 roles), `Chambeapp_backend` y
> `Chambeapp_admin_frontend` (panel staff).
>
> **Cambio clave de esta versión:** la plataforma **no intermedia dinero**.
> El pago del trabajo es directo entre las partes; ChambeApp solo cobra
> **monedas** por firmar contratos y por publicar/reactivar anuncios.
> Las modalidades RF-26 y los planes de suscripción están deshabilitados.

---

## 1. Actores

| Actor | Rol técnico | App |
|---|---|---|
| Solicitante | `solicitante` | PWA |
| Prestador de servicios (PDS) | `pds` | PWA |
| Comercio / negocio | `merchant` | PWA |
| Verificador KYC | `verificador` | Admin |
| Soporte | `soporte` | Admin |
| Administrador regional | `admin` | Admin |
| Superadministrador | `superadmin` | Admin |

---

## 2. Índice de flujos

| # | Flujo | Actores | Entrada principal |
|---|---|---|---|
| F1 | Registro, login, 2FA y recuperación | Todos | `/register`, `/login` |
| F2 | Verificación de identidad (KYC) | Todos | Perfil → Verificación |
| F3 | Publicar una solicitud | Solicitante | `/solicitante/solicitudes/new` |
| F4 | Explorar negocios en el mapa | Todos | `/negocios`, `/solicitante/negocios`, `/pds/negocios` |
| F5 | Ofertas y negociación | Solicitante + PDS | Detalle de solicitud / chat |
| F6 | Firma de contrato y cobro | Contratantes | `/contrato/firmar` |
| F7 | Ejecución de la chamba | Solicitante + PDS | `/solicitante/chambas/:id`, `/pds/chambas/:id` |
| F8 | Confirmación y cierre | Solicitante + PDS | Chamba / contrato |
| F9 | Marañas (trabajos rápidos) | Solicitante + PDS | `/solicitante/maranas`, `/pds/maranas` |
| F10 | Portafolio y oficios del PDS | PDS | `/pds/portafolio`, `/pds/oficios` |
| F11 | Crear y configurar negocio | Comercio | `/negocio/crear`, `/negocio/mi-negocio` |
| F12 | Rutas del negocio ambulante | Comercio | Mi negocio → Rutas |
| F13 | Anuncios del negocio | Comercio | `/negocio/anuncios` |
| F14 | Postulaciones a anuncios | PDS / Comercio | Anuncio |
| F15 | Perfil público del negocio | Todos | `/negocios/:id` |
| F16 | Monedas y paquetes | Todos | Billetera |
| F17 | Cobros por firma y anuncios | Contratantes / Comercio | Firma / Anuncios |
| F18 | Mensajes y chat | Todos | `/…/mensajes` |
| F19 | Notificaciones y push | Todos | Campana / `/notificaciones` |
| F20 | Ayuda y tickets | Todos | `/ayuda` |
| F21 | Disputas | Todos + Soporte | `/…/disputas` |
| F22 | Panel staff (KYC, moderación, soporte) | Staff | Admin |
| F23 | Configuración del superadmin | Superadmin | `/superadmin/*` |

---

## 3. F1 — Registro, login y seguridad

1. **Registro** (`/register`): email, contraseña, rol (`solicitante`, `pds`,
   `merchant`), aceptación de T&C y autorización de datos. Se crea usuario,
   perfil y billetera.
2. **Login** (`/login`): email + contraseña. Si el usuario tiene 2FA activo,
   se solicita el segundo factor (SMS/TOTP).
3. **Recuperación**: `/forgot-password` envía el mecanismo de recuperación;
   `/reset-password` fija la nueva contraseña.
4. **Sesión**: JWT con refresh; el rol viaja en claims y define el shell de
   navegación. Un usuario con rol distinto no puede abrir rutas de otro rol.
5. **Seguridad** (`/…/seguridad`): activar/desactivar 2FA, cambiar contraseña,
   códigos de recuperación.
6. **Cierre de sesión**: limpia tokens y vuelve al landing.

---

## 4. F2 — Verificación de identidad (KYC)

1. El usuario entra desde **Perfil → Verificación** o desde el aviso de KYC.
2. Acepta la autorización KYC (`/autorizacion-kyc`) si es la primera vez.
3. Sube los documentos del catálogo (identidad, prueba de vida, contacto,
   RUT/certificado, foto del local, etc., según el rol).
4. Cada documento queda en estado `no_enviado`, `enviado`, `en_revision`,
   `aprobado` o `rechazado`.
5. El verificador revisa en el panel (`/verificador/kyc`); el usuario recibe
   el resultado por notificación/push y ve el estado en su perfil.
6. **Regla:** los anuncios de negocio exigen KYC aprobado; el backend lo
   valida antes de publicar.

---

## 5. F3 — Publicar una solicitud (solicitante)

1. `/solicitante/solicitudes/new`.
2. Datos: título, categoría, descripción, ubicación (mapa/geocodificación),
   presupuesto, urgencia, fecha/horario, fotos y, si aplica, imagen 360.
3. Se valida y se crea la solicitud en estado `publicado`.
4. Motor de recomendación/cascada: notifica a PDS elegibles por categoría,
   ubicación y radio (20/50/100 km según configuración).
5. La solicitud aparece en:
   - el listado del solicitante (`/solicitante/solicitudes`),
   - el mapa/buscador de PDS (`/pds/chambas`, `/pds/negocios`),
   - el feed de negocios compatibles.
6. Estados: `borrador` → `publicado` → `asignada` → `completado` /
   `cancelado`.

---

## 6. F4 — Explorar negocios y mapa público

1. Entradas: `/negocios` (público), `/solicitante/negocios`,
   `/pds/negocios` (embebidos en su shell).
2. El mapa carga pines de negocios activos, filtros por categoría, búsqueda,
   calificación, abierto ahora y verificados; modos 2D/3D.
3. **Anuncios en el mapa:** cada negocio con anuncios publicados muestra una
   cajita de pensamiento sobre su pin.
   - Zoom ≥ 16: cajita completa (hasta 5 a la vez, prioridad al seleccionado
     y al más cercano al centro).
   - Zoom 12–15.6: círculo de notificación con contador.
   - Deslizar la cajita cambia de anuncio; **doble toque/clic** abre el
     anuncio.
4. **Rutas ambulantes:** si el negocio tiene una ruta en curso, el mapa dibuja
   la estela: tramo recorrido sólido, pendiente translúcido y punto actual.
5. Tocar un pin abre el detalle/resumen; “Ver detalle” navega al perfil
   público; “Cómo llegar” abre el mapa externo.

---

## 7. F5 — Ofertas y negociación

1. El PDS abre una solicitud (`/pds/chambas/:id` o `/pds/postular/:id`) y
   envía una oferta: monto, mensaje, fecha y horario.
2. La oferta queda `pendiente`; el solicitante recibe notificación y puede:
   aceptar, rechazar o contraofertar desde el detalle o el chat.
3. Cada contraoferta crea una nueva versión; **ambas partes deben aceptar el
   mismo valor** (`aceptada_por_pds` y `aceptada_por_solicitante`).
4. Al cerrarse el acuerdo bilateral se crea el contrato (`pendiente`) y se
   habilita la firma.
5. La comunicación ocurre por el chat de la negociación (mensajes de sistema
   codificados para ofertas/aceptaciones).

---

## 8. F6 — Firma de contrato y cobro en monedas

1. Entrada: `/contrato/firmar` (con `contratoId`/`solicitudId`).
2. Se muestra el contrato con el monto final, condiciones, partes y firmas.
3. El botón muestra el costo: **“Firmar contrato · N monedas”**. El servidor
   calcula N con la tarifa vigente:
   ```
   monedas_por_parte = max(10, trunc((monto × 3%) ÷ 100) + 1)
   ```
   - El mismo porcentaje aplica a los 3 roles.
   - `precio_moneda_cop` inicial: $100.
   - El cobro se hace **antes** de registrar la firma; si no alcanza, la firma
     no se guarda y se muestra “Te faltan X monedas → Recargar”.
4. Cada parte firma en paralelo; el contrato se activa cuando **ambas** han
   firmado (`en_progreso`).
5. **Reembolso:** si el contrato se cancela antes de que ambas firmen, se
   devuelven las monedas cobradas a quien ya había firmado.
6. **Pago del trabajo:** directo entre las partes, fuera de la plataforma. La
   app no recibe, retiene ni dispersa el monto.

---

## 9. F7 — Ejecución de la chamba

1. Al activarse el contrato se crea la **chamba** en `programada`.
2. El PDS hace **check-in** (`en_proceso`) con evidencia de entrada.
3. Durante la ejecución (`en_ejecucion`) se registran:
   - evidencias de avance,
   - adendas (cambios de alcance/valor),
   - novedades/incidencias,
   - pausas (botón de pánico) → `pausada`.
4. El PDS solicita el cierre (`pendiente_validacion`) con evidencia de salida.
5. El solicitante revisa y **confirma** → `liquidacion_confirmada` y luego
   `finalizada`. El pago se acuerda directamente entre las partes.
6. Cualquier desacuerdo puede escalar a **disputa** (F21).

Estados de chamba:
`programada → en_proceso → en_ejecucion → pausada → pendiente_validacion →
liquidacion_confirmada → finalizada`.

---

## 10. F8 — Confirmación y cierre de contrato

1. El PDS marca el trabajo como completado → contrato
   `completado_pendiente`.
2. El solicitante confirma → `completado`.
3. Se otorgan badges/reputación y se habilita la reseña.
4. El solicitante puede calificar con estrellas y comentario; la reseña
   actualiza el promedio del negocio/PDS.
5. No se acredita dinero en la billetera por este cierre.

---

## 11. F9 — Marañas (trabajos rápidos)

1. El solicitante publica una maraña (`publicado`).
2. PDS postulan (oferta `pendiente`); el solicitante acepta una (`asignado`).
3. El PDS ejecuta y marca `completado`.
4. El pago directo se confirma entre las partes → `pagado`.
5. Puede cancelarse antes de asignar → `cancelado`.

---

## 12. F10 — Portafolio y oficios (PDS)

1. `/pds/portafolio`: perfil laboral, habilidades, insignias y trabajos.
2. “Añadir trabajo”: título, categoría, descripción, precio y **fotos**.
   - Se puede **subir desde archivo** o **tomar foto** (cámara en móvil).
   - Máximo 5 fotos por trabajo; la primera es la portada.
   - Roles por foto: portada, antes, después, normal.
3. Las fotos se guardan en el bucket público y se ven en el perfil público.
4. `/pds/oficios`: catálogo de oficios/habilidades y presentación del quiz de
   validación cuando aplica.

---

## 13. F11 — Crear y configurar negocio (comercio)

1. `/negocio/crear`: wizard con identidad, categoría, ubicación y contacto.
   Requiere KYC aprobado.
2. `/negocio/mi-negocio` (configuración):
   - **Identidad**: nombre, tipo, **modalidad estático/ambulante**,
     categorías, descripción.
   - **Servicios**, **palabras clave**, **ubicación/cobertura**, **contacto**
     (WhatsApp, redes, web).
   - **Horarios** por día.
   - **Imágenes**: logo, banner y galería (subida o cámara; alta por URL como
     opción secundaria). Logo/banner **no** forman parte de la galería.
   - **Rutas** (si es ambulante): editor a pantalla completa con modos
     **Mano** y **Lápiz**, calles y color.
3. Guardar configuración (`PUT /negocios/<id>`).
4. El negocio aparece en el mapa público y en su perfil.

---

## 14. F12 — Rutas del negocio ambulante

1. En Mi negocio, modalidad **Ambulante** → sección **Rutas de recorrido**.
2. Crear/editar ruta:
   - nombre y descripción,
   - pintar el trazado con el dedo/mouse (línea punteada mientras se crea),
   - calles que recorre (chips),
   - color, activa/inactiva.
3. Guardar → la ruta queda disponible en el perfil público.
4. **Iniciar recorrido**: solo una ruta en curso por negocio; ajustar el
   avance con la barra. El mapa público dibuja la estela en vivo y se actualiza
   por socket.
5. Detener recorrido o cambiar a modalidad estática detiene la ruta.

---

## 15. F13 — Anuncios del negocio

1. `/negocio/anuncios`: lista publicados/cerrados y vista previa en mapa.
2. **Publicar anuncio** (cuesta **10 monedas**):
   - tipo (empleo, servicio, producto, oferta), título, categoría,
     descripción, visibilidad en mapa, ubicación/punto, vacantes,
     presupuesto/fecha/horario según tipo.
   - Requiere KYC aprobado y saldo de monedas.
3. El anuncio se publica y aparece en:
   - el feed público de anuncios,
   - el mapa (cajita sobre el pin del negocio),
   - el perfil público del negocio.
4. **Cerrar anuncio**: sin costo.
5. **Reactivar anuncio cerrado**: cuesta **5 monedas**.
6. Si no hay monedas, el anuncio no se crea/reactiva y se ofrece recargar.

---

## 16. F14 — Postulaciones a anuncios

1. El PDS ve un anuncio (`/anuncios/:id`) y postula con mensaje y datos de
   contacto.
2. El negocio recibe la postulación en `/negocio/anuncios` y puede
   **contactar** o **descartar**.
3. Si el anuncio es vinculante y hay acuerdo, se genera contrato y se sigue
   F6 (firma + cobro en monedas).
4. El negocio puede consultar las postulaciones de cada anuncio.

---

## 17. F15 — Perfil público del negocio

Ruta: `/negocios/:id` (también embebido en `/solicitante/negocios/:id` y
`/pds/negocios/:id`).

1. **Hero**: banner, logo, categoría, nombre, abierto/cerrado, verificado,
   rating; acciones WhatsApp y Cómo llegar.
2. **Hoy**: horario del día y dirección.
3. **Sobre el negocio**: descripción, categorías secundarias, palabras clave.
4. **Lo que hay hoy**: anuncios publicados.
5. **Servicios**, **Galería** (sin logo/banner).
6. **Recorrido**: mapa de rutas activas y calles; badge “En curso”.
7. **Dónde encontrarlo**: dirección + Cómo llegar.
8. **Reseñas**: promedio, distribución y formulario (requiere sesión).
9. **Reportar** negocio (motivo) y volver a la pantalla anterior.

---

## 18. F16 — Monedas y paquetes

1. La billetera (`/…/billetera`) tiene dos vistas:
   - **Monedas**: saldo, compradas, gastadas, paquetes y movimientos.
   - **Finanzas**: ingresos/egresos COP históricos de la actividad; ya no se
     acreditan pagos de contratos nuevos.
2. **Comprar paquete** (`POST /wallet/coins/buy`): acredita monedas y registra
   el movimiento. La pasarela está simulada en dev.
3. **Paquetes**: el precio en COP se recalcula al cambiar el precio de la
   moneda (`cantidad × precio_moneda`); el `bonus` es monedas de regalo.
4. **Movimientos**: compras, gastos, ganadas, promocionales, vencimientos y
   ajustes/reembolsos.
5. Los cobros descuentan primero monedas promocionales, luego ganadas y luego
   compradas.

---

## 19. F17 — Reglas de cobro vigentes

| Acción | Quién paga | Costo |
|---|---|---|
| Firmar contrato | Cada parte (cualquiera de los 3 roles) | `max(10, trunc((monto × 3%) ÷ 100) + 1)` monedas |
| Publicar anuncio | Comercio dueño | 10 monedas |
| Reactivar anuncio cerrado | Comercio dueño | 5 monedas |
| Publicar solicitud | — | Gratis |
| Postularse | — | Gratis (sin límite de plan) |
| Chat, KYC, tickets, reseñas | — | Gratis |
| Pago del trabajo | Directo entre usuarios | Fuera de la plataforma |

- **Reembolso de firma:** solo si el contrato se cancela antes de completar
  las dos firmas.
- **Configuración:** el superadmin edita porcentaje, precio de moneda, monedas
  fijas, mínimo y costos de anuncios en **Cobros**.
- **Idempotencia:** cada cobro lleva una referencia única; reintentar no cobra
  dos veces.

---

## 20. F18 — Mensajes y chat

1. Bandeja (`/…/mensajes`): conversaciones de negociaciones, contratos,
   chambas y soporte.
2. Hilo de chat en tiempo real (Socket.IO) con texto, adjuntos y mensajes de
   sistema (ofertas, aceptaciones, contratos).
3. Los chats de soporte se diferencian de los de negociación; el staff puede
   habilitarlos en disputas.
4. Estados de lectura/no leídos y badge en la tabbar.

---

## 21. F19 — Notificaciones y push

1. Campana del topbar con contador de no leídas.
2. `/notificaciones`: lista, marcado como leídas.
3. Push web (suscripción VAPID) para eventos críticos: ofertas, contratos,
   mensajes, KYC, disputas y tickets.
4. En tiempo real, el socket actualiza contadores y listas sin recargar.

---

## 22. F20 — Ayuda y tickets

1. Entrada: sidebar **Ayuda** o Perfil → **Ayuda y soporte** (`/ayuda`).
2. **Crear ticket**:
   - tipo/categoría (cuenta, pagos, chambas, negocio, anuncios, verificación,
     técnico, otro),
   - asunto y descripción.
3. **Mis tickets**: estado (abierto, en revisión, cerrado), fecha, detalle
   expandible; se actualiza en vivo.
4. Soporte ve los tickets en el panel, los clasifica (`low/normal/high`) y
   gestiona el contacto/chat.
5. El usuario recibe respuesta por notificación/mensajes de soporte.

---

## 23. F21 — Disputas

1. Cualquier parte de un contrato/solicitud puede abrir una disputa con motivo.
2. La disputa nace `abierta`; el chat entre las partes queda bloqueado.
3. Soporte revisa, habilita el chat si corresponde y decide sobre las
   variables (`pendiente/aceptada/rechazada`).
4. La resolución es **informativa**: no hay retención ni devolución de fondos
   porque el pago fue directo.
5. Al cerrar, se notifica a ambas partes y se registra la decisión.

---

## 24. F22 — Panel staff (admin frontend)

| Área | Rutas | Flujo |
|---|---|---|
| Verificador | `/verificador`, `/verificador/kyc` | Revisar documentos, aprobar/rechazar, ver archivos |
| Soporte | `/soporte`, `/soporte/tickets`, `/soporte/chats`, `/soporte/disputas` | Atender tickets, chats y disputas regionales |
| Admin | `/admin/*` | Usuarios, verificaciones, solicitudes, contratos, contenido |
| Superadmin | `/superadmin/*` | Admins, configuración, paquetes, cobros, IA, flags, auditoría, legal |

Reglas:
- `admin` ve su región; `superadmin` ve todo.
- Tickets y disputas se filtran por región del usuario.
- Cada acción sensible queda en auditoría.

---

## 25. F23 — Configuración del superadmin

1. **Configuración** (`/superadmin/config`): parámetros del sistema.
2. **Paquetes de monedas** (`/superadmin/paquetes`): cantidad, bonus, precio,
   ofertas y estado. El precio base se recalcula al cambiar el precio de la
   moneda.
3. **Cobros** (`/superadmin/cobros`): porcentaje de contrato, precio de la
   moneda, monedas fijas, mínimo y costos de anuncios, con vista previa.
4. **Flags**, **IA**, **Overrides**, **Auditoría** y **Legal/T&C**.

---

## 26. Matriz de estados clave

**Contrato:** `pendiente → en_progreso → completado_pendiente → completado`
(o `cancelado`; reembolso de monedas si se cancela antes de ambas firmas).

**Solicitud:** `borrador → publicado → asignada → completado / cancelado`.

**Chamba:** `programada → en_proceso → en_ejecucion → pausada →
pendiente_validacion → liquidacion_confirmada → finalizada`.

**Maraña:** `publicado → asignado → completado → pagado / cancelado`.

**Anuncio:** `publicado ↔ cerrado`.

**Ticket:** `open → pending → closed`.

**Disputa:** `abierta → resuelta`.

---

## 27. Referencias rápidas de rutas (PWA)

| Rol | Inicio | Flujos principales |
|---|---|---|
| Solicitante | `/solicitante` | solicitudes, ofertas, chambas, marañas, billetera, disputas, mensajes, perfil, ayuda |
| PDS | `/pds` | chambas, marañas, portafolio, oficios, negocios, billetera, mensajes, perfil, ayuda |
| Comercio | `/negocio` | mi negocio, solicitudes, anuncios, billetera, mensajes, perfil, ayuda |
| Público | `/` | mapa (`/negocios`), perfil (`/negocios/:id`), anuncio (`/anuncios/:id`) |

---

*Fin del documento. Mantener sincronizado con `routes.tsx`, `routes.jsx` y los
controladores del backend al agregar flujos nuevos.*
