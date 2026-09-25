# Requisitos Funcionales — Módulo Comerciante

> **Proyecto:** ChambeApp  
> **Módulo:** Comerciante (Merchant)  
> **Fecha:** 2026-09-16  
> **Formato:** EARS (Easy Approach to Requirements Syntax)  
> **Numeración:** RF-31 a RF-48 (continúa RF-30 de `Requerimientos.md`)

---

## Registro y Onboarding

### RF-31: Registro de rol Comerciante

**When** un usuario nuevo accede al formulario de registro **and** selecciona la opción "Comerciante" **The system shall** enviar un `POST /api/v1/auth/register` con `rol: "merchant"` **and** crear el usuario con estado `active` **and** redirigir al dashboard del comerciante.

**Criterios de aceptación:**
- CA-1: El formulario de registro muestra 3 opciones: Trabajador, Contratante, Comerciante (`RegisterPage.tsx:14-16`)
- CA-2: Al seleccionar "Comerciante", se envía `rol: "merchant"` en el payload
- CA-3: El backend crea el usuario con `rol = RolUsuario.MERCHANT` (`user.py:15`)
- CA-4: Se crea `merchant_preferences` con defaults al registrar
- CA-5: Redirige a `/negocio` (ruta home del merchant en `roleNav.ts`)

### RF-32: Onboarding del comerciante

**When** un merchant completa su registro **and** accede por primera vez a `/negocio` **The system shall** mostrar un wizard de onboarding que guíe: (1) crear negocio, (2) completar horarios, (3) subir logo, (4) iniciar KYC.

**Criterios de aceptación:**
- CA-1: El wizard tiene 4 pasos secuenciales
- CA-2: Cada paso tiene skip opcional excepto "crear negocio"
- CA-3: Al completar, se marca `onboarding_completado` en preferences
- CA-4: Si el merchant ya completó onboarding, no se muestra al entrar

---

## Gestión del Negocio

### RF-33: Crear negocio

**When** un merchant envía `POST /api/v1/negocios/` con nombre, categoría, dirección, tipo **and** el JWT es válido con rol `merchant` **The system shall** crear el negocio en estado `borrador` **and** generar slug único **and** calcular coordenadas PostGIS.

**Criterios de aceptación:**
- CA-1: Solo merchants autenticados pueden crear negocios (`negocios.py` — `@jwt_required()`)
- CA-2: El slug se genera automáticamente desde el nombre (`generar_slug`)
- CA-3: Se crea el campo `geom` con `ST_SetSRID(ST_MakePoint(lng, lat), 4326)`
- CA-4: Estado inicial es `borrador`
- CA-5: Se valida que el merchant no tenga más de N negocios (regla de negocio a definir)

### RF-34: Editar negocio

**When** un merchant envía `PUT /api/v1/negocios/<id>` con campos a actualizar **and** es owner del negocio **The system shall** actualizar los campos enviados **and** recalcular slug si cambió el nombre.

**Criterios de aceptación:**
- CA-1: Solo el owner puede editar (`_ensure_owner` en `negocios.py`)
- CA-2: Campos actualizables: nombre, descripción, tipo, categoría, servicios, redes sociales, radio de cobertura
- CA-3: No se puede cambiar `owner_id`
- CA-4: Se actualiza `actualizado_en`

### RF-35: Activar negocio

**When** un merchant envía `PATCH /api/v1/negocios/<id>/estado` con `estado: "activo"` **and** el negocio tieneKYC aprobado **The system shall** cambiar el estado a `activo` **and** hacer visible el negocio en el mapa público.

**Criterios de aceptación:**
- CA-1: Solo se puede activar si `verificado == true` o KYC completo
- CA-2: El negocio aparece en `GET /negocios/mapa` al activarse
- CA-3: Se envía notificación al merchant confirmando activación

### RF-36: Eliminar negocio

**When** un merchant envía `DELETE /api/v1/negocios/<id>` **and** es owner **The system shall** eliminar el negocio y sus horarios/ratings/reports en cascada.

**Criterios de aceptación:**
- CA-1: Solo owner puede eliminar
- CA-2: Se eliminan horarios, ratings, reportes (cascade en `negocio.py:107-119`)
- CA-3: No se eliminan contratos/pagos históricos (solo se desvinculan)

---

## Horarios

### RF-37: Gestionar horarios del negocio

**When** un merchant envía `PUT /api/v1/negocios/<id>/horarios` con array de horarios **The system shall** reemplazar los horarios existentes **and** validar unicidad de día por negocio.

**Criterios de aceptación:**
- CA-1: Cada horario tiene `dia_semana` (0-6), `abierto`, `hora_apertura`, `hora_cierre`
- CA-2: Constraint `uq_negocio_dia` previene duplicados (`negocio.py:134`)
- CA-3: Si `abierto=false`, no se requieren horas
- CA-4: Se recalcula `esta_abierto` para el mapa

---

## Imágenes del Negocio

### RF-38: Subir imagen del negocio

**When** un merchant envía `POST /api/v1/negocios/<id>/imagenes/upload` con archivo imagen **and** es owner **The system shall** subir la imagen a MinIO (`storage.py`) **and** optimizar a WebP **and** agregar la URL al array `imagenes` del negocio.

**Criterios de aceptación:**
- CA-1: Formatos aceptados: jpg, png, webp (máx 5MB)
- CA-2: Se usa `upload_portfolio_image` adaptado para negocios
- CA-3: La imagen se optimiza a WebP antes de subir
- CA-4: Se retorna la URL de la imagen subida
- CA-5: Límite máximo de 20 imágenes por negocio

### RF-39: Eliminar imagen del negocio

**When** un merchant envía `DELETE /api/v1/negocios/<id>/imagenes` con `{ "url": "..." }` **and** es owner **The system shall** eliminar la URL del array `imagenes`.

**Criterios de aceptación:**
- CA-1: Solo se elimina la referencia en la BD (el archivo en MinIO se limpia por job)
- CA-2: Si la imagen era el `logo_url` o `banner_url`, se limpia también

---

## KYC del Comerciante

### RF-40: Subir documento KYC comercial

**When** un merchant envía `POST /api/v1/kyc/documentos` con clave de documento **and** el JWT tiene rol `merchant` **The system shall** permitir la subida del documento **and** asociarlo al catálogo de documentos merchant (`seed_kyc_merchant.py`).

**Criterios de aceptación:**
- CA-1: El decorator `@role_required` acepta `"merchant"` (`kyc.py:164` — FIX REQUERIDO)
- CA-2: Se validan las 4 claves del catálogo: `doc_identidad`, `rut`, `certificado_comercial`, `foto_local`
- CA-3: Documentos obligatorios: `doc_identidad`, `rut`, `certificado_comercial`
- CA-4: El upload usa `upload_kyc` de `storage.py`

### RF-41: Consultar estado KYC del comerciante

**When** un merchant envía `GET /api/v1/kyc/mis-documentos` **The system shall** retornar el estado de cada documento requerido para su rol.

**Criterios de aceptación:**
- CA-1: Filtra por `rol="merchant"` automáticamente
- CA-2: Incluye `enviado: true/false` por cada documento
- CA-3: Incluye `aprobado/rechazado` si el verificador ya revisó

### RF-42: Verificar KYC del comerciante

**When** un verificador envía `POST /api/v1/kyc/documentos/<id>/verificar` con `aprobado: true/false` **The system shall** actualizar el estado del documento **and** si todos los obligatorios están aprobados, marcar `verificado=true` en el negocio.

**Criterios de aceptación:**
- CA-1: Solo verificadores pueden usar este endpoint
- CA-2: Si se rechaza, se notifica al merchant con motivo
- CA-3: La verificación del negocio se propagá a `negocios.verificado`

---

## Recepción y Respuesta de Solicitudes

### RF-43: Recibir solicitudes de la zona

**When** un merchant accede a su dashboard **and** tiene negocio activo **The system shall** mostrar solicitudes publicadas por solicitantes dentro del radio de cobertura del negocio.

**Criterios de aceptación:**
- CA-1: Se usa `GET /solicitudes/` con filtros geoespaciales
- CA-2: Se filtra por categoría del negocio vs categoría de la solicitud
- CA-3: Se excluyen solicitudes ya respondidas por este merchant
- CA-4: Se ordenan por distancia (más cercanas primero)

### RF-44: Responder a una solicitud

**When** un merchant envía `POST /api/v1/solicitudes/<id>/ofertas` con precio y mensaje **The system shall** crear la oferta **and** notificar al solicitante.

**Criterios de aceptación:**
- CA-1: Solo merchants con negocio activo pueden ofertar
- CA-2: Se valida que el merchant esté dentro del radio de cobertura
- CA-3: Se notifica al solicitante vía push/email
- CA-4: No se puede ofertar más de una vez por solicitud

### RF-45: Gestionar ofertas recibidas

**When** un merchant envía `GET /api/v1/mis-ofertas` **The system shall** retornar todas las ofertas que ha enviado, con estado y respuesta del solicitante.

**Criterios de aceptación:**
- CA-1: Incluye estado de cada oferta (pendiente, aceptada, rechazada, contraoferta)
- CA-2: Paginado con estándar `{items, total, page, per_page, pages}`
- CA-3: Incluye datos de la solicitud asociada

---

## Mensajería

### RF-46: Enviar y recibir mensajes

**When** un merchant envía `POST /api/v1/chat/conversations/<id>/messages` con contenido **The system shall** guardar el mensaje **and** emitir vía SocketIO al destinatario.

**Criterios de aceptación:**
- CA-1: Se crea conversación automáticamente si no existe (`POST /chat/conversations`)
- CA-2: Los mensajes se marcan como leídos con `PATCH /chat/conversations/<id>/messages/read`
- CA-3: El merchant puede listar sus conversaciones con `GET /chat/conversations`

---

## Visibilidad Pública (Mapa + Detalle)

### RF-47: Aparecer en el mapa público

**When** un negocio tiene `estado="activo"` **and** `verificado=true` **The system shall** incluirlo en `GET /negocios/mapa` con sus coordenadas, categoría, calificación y estado de horario.

**Criterios de aceptación:**
- CA-1: El pin incluye: `id`, `nombre`, `slug`, `lat`, `lng`, `categoria`, `calificacion`, `verificado`, `abierto`, `logo_url`
- CA-2: El clustering se realiza con redondeo a 2 decimales (`negocios.py:258`)
- CA-3: Se puede filtrar por `lat`, `lng`, `radio` (km)
- CA-4: El campo `abierto` se calcula en tiempo real desde horarios

### RF-48: Página de detalle del negocio (público)

**When** un usuario accede a `/negocios/<slug>` **The system shall** mostrar: nombre, descripción, categoría, horarios, galería, calificaciones, ubicación en mapa, redes sociales.

**Criterios de aceptación:**
- CA-1: Se usa `GET /negocios/slug/<slug>` (endpoint existente)
- CA-2: Se muestra mapa con pin de la ubicación del negocio
- CA-3: Se muestran ratings con `GET /negocios/<id>/ratings`
- CA-4: Se muestran horarios con estado actual (abierto/cerrado)
- CA-5: WhatsApp con mensaje predefinido es clickeable

---

## Trazabilidad

| RF | Módulo | Mock reemplazado | Endpoint |
|----|--------|-----------------|----------|
| RF-31 | Auth/Register | `RegisterPage.tsx` | `POST /auth/register` |
| RF-32 | Onboarding | — | `GET/PUT /merchant/preferences` |
| RF-33 | Negocios | `MOCK_BUSINESS` | `POST /negocios/` |
| RF-34 | Negocios | `MOCK_BUSINESS` | `PUT /negocios/<id>` |
| RF-35 | Negocios | — | `PATCH /negocios/<id>/estado` |
| RF-36 | Negocios | — | `DELETE /negocios/<id>` |
| RF-37 | Horarios | `MOCK_HOURS` | `PUT /negocios/<id>/horarios` |
| RF-38 | Imágenes | `MOCK_GALLERY` | `POST /negocios/<id>/imagenes/upload` |
| RF-39 | Imágenes | `MOCK_GALLERY` | `DELETE /negocios/<id>/imagenes` |
| RF-40 | KYC | `MOCK_KYC_DOCS` | `POST /kyc/documentos` |
| RF-41 | KYC | `MOCK_KYC_DOCS` | `GET /kyc/mis-documentos` |
| RF-42 | KYC | — | `POST /kyc/documentos/<id>/verificar` |
| RF-43 | Solicitudes | `MOCK_CHAMBAS` | `GET /solicitudes/` |
| RF-44 | Ofertas | `MOCK_CHAMBAS` | `POST /solicitudes/<id>/ofertas` |
| RF-45 | Ofertas | `MOCK_CHAMBAS` | `GET /mis-ofertas` |
| RF-46 | Chat | `MOCK_CONVERSATIONS` | `GET/POST /chat/conversations` |
| RF-47 | Mapa | `MOCK_MAP_PINS` | `GET /negocios/mapa` |
| RF-48 | Detalle | `MOCK_BUSINESS_DETAIL` | `GET /negocios/slug/<slug>` |
