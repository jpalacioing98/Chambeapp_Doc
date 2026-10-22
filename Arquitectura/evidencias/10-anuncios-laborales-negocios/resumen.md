# Resumen de Ejecución — Flujo 10: Anuncios Laborales de Negocios

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, Mapbox GL JS, captura de red y preservación JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-61](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-61-publicación-de-anuncios-laborales-por-negocios), [HU-62](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-62-postulación-a-vacantes-laborales-de-negocios).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Comerciante (Empleador / Merchant)** | `merchant@chambeapp.com` | `********` *(users.md)* | Creación de oferta laboral no vinculante, configuración de vacantes, evaluación de postulaciones de candidatos, cambio de estado de contacto y cierre del anuncio | `/negocio/anuncios`<br>`/anuncios/1` |
| **Prestador de Servicios (PDS / Postulante)** | `pds@chambeapp.com` | `********` *(users.md)* | Exploración de vacantes en el banner laboral sobre el mapa interactivo (`/negocios`), postulación no vinculante con carta de motivación y datos de contacto directo | `/negocios`<br>`/anuncios/1` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/negocio/anuncios` | Merchant inicia sesión y accede al panel de ofertas de empleo del comercio; visualiza estado inicial vacío con botón *"Nuevo anuncio"* | `POST /api/v1/auth/login`<br>`GET /api/v1/anuncios/negocio/3` | 200<br>200 | [01-merchant-panel-anuncios-vacio.png](capturas/01-merchant-panel-anuncios-vacio.png) |
| **02** | Modal `Publicar anuncio laboral` | Apertura de modal; diligenciamiento de título (*"Técnico en plomería e instalaciones hidráulicas"*), categoría (`plomeria`), descripción de tareas, ubicación y vacantes (`2`) | *(Renderizado de formulario React)* | — | [02-merchant-modal-publicar-anuncio.png](capturas/02-merchant-modal-publicar-anuncio.png) |
| **03** | `/negocio/anuncios` | Envío del formulario; el anuncio #1 se publica en estado `publicado`; confirmación en el feed del negocio con badge *"Activa"* y contador `0 postulaciones` | `POST /api/v1/anuncios/` | **201** | [03-merchant-anuncio-publicado-lista.png](capturas/03-merchant-anuncio-publicado-lista.png) |
| **04** | `/anuncios/1` | Merchant navega al expediente público de su oferta; audita hero banner, vacantes, ubicación, botón *"Cerrar anuncio"* y sección vacía de postulaciones | `GET /api/v1/anuncios/1`<br>`GET /api/v1/anuncios/1/postulaciones` | 200<br>200 | [04-merchant-detalle-anuncio-sin-postulaciones.png](capturas/04-merchant-detalle-anuncio-sin-postulaciones.png) |
| **05** | `/login`<br>`/negocios` | Prestador PDS inicia sesión y accede al mapa de negocios; el scroller flotante de anuncios laborales (`.ch-anc-strip`) muestra el banner de la nueva oferta | `POST /api/v1/auth/login`<br>`GET /api/v1/anuncios/`<br>`GET /api/v1/negocios/mapa` | 200<br>200<br>200 | [05-pds-mapa-banner-anuncios-laborales.png](capturas/05-pds-mapa-banner-anuncios-laborales.png) |
| **06** | `/anuncios/1` | PDS hace clic en el banner y accede al detalle; al ser usuario `pds`, la interfaz despliega el botón prominente *"Postularme a esta oferta"* | `GET /api/v1/anuncios/1` | 200 | [06-pds-detalle-anuncio-boton-postular.png](capturas/06-pds-detalle-anuncio-boton-postular.png) |
| **07** | Modal `Postular a la oferta` | PDS abre modal de postulación; redacta mensaje de experiencia técnica comprobada, teléfono de contacto directo (`3009876543`) y correo electrónico | *(Interacción modal PDS)* | — | [07-pds-modal-postulacion-diligenciado.png](capturas/07-pds-modal-postulacion-diligenciado.png) |
| **08** | `/anuncios/1` | PDS envía la postulación no vinculante; el backend registra la solicitud y notifica al negocio; toast *"Postulación enviada. El negocio podrá contactarte"* | `POST /api/v1/anuncios/1/postulaciones` | **201** | [08-pds-postulacion-enviada-confirmacion.png](capturas/08-pds-postulacion-enviada-confirmacion.png) |
| **09** | `/login`<br>`/anuncios/1` | Merchant reingresa al detalle; en la sección *"Postulaciones (1)"* visualiza la tarjeta del candidato con sus datos, mensaje y botones *"Contactar"* y *"Descartar"* | `POST /api/v1/auth/login`<br>`GET /api/v1/anuncios/1/postulaciones` | 200<br>200 | [09-merchant-gestion-candidatos-postulacion.png](capturas/09-merchant-gestion-candidatos-postulacion.png) |
| **10** | `/anuncios/1` | Merchant presiona *"Contactar"* (transición a estado `contactado`) y posteriormente *"Cerrar anuncio"*; el hero banner actualiza su badge a *"Cerrada"* | `PATCH /api/v1/anuncios/1/postulaciones/1`<br>`PATCH /api/v1/anuncios/1/estado` | **200**<br>**200** | [10-merchant-contacto-marcado-anuncio-cerrado.png](capturas/10-merchant-contacto-marcado-anuncio-cerrado.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "GET",   "endpoint": "/api/v1/anuncios/negocio/3", "status": 200, "nota": "Listado de anuncios creados por el negocio titular (User ID 3)" },
  { "method": "POST",  "endpoint": "/api/v1/anuncios/", "status": 201, "nota": "Creación de oferta laboral: inserta en anuncios_laborales con estado publicado" },
  { "method": "GET",   "endpoint": "/api/v1/anuncios/", "status": 200, "nota": "Feed público de ofertas activas para el banner flotante del mapa" },
  { "method": "GET",   "endpoint": "/api/v1/anuncios/1", "status": 200, "nota": "Detalle público de la vacante #1 (información de cargo, vacantes y ubicación)" },
  { "method": "GET",   "endpoint": "/api/v1/anuncios/1/postulaciones", "status": 403, "nota": "Seguridad RBAC: denegación de visualización de candidatos a usuarios no propietarios" },
  { "method": "POST",  "endpoint": "/api/v1/anuncios/1/postulaciones", "status": 201, "nota": "PDS radica postulación no vinculante con mensaje y teléfono de contacto" },
  { "method": "GET",   "endpoint": "/api/v1/anuncios/1/postulaciones", "status": 200, "nota": "Consulta de candidatos autorizada para el negocio titular" },
  { "method": "PATCH", "endpoint": "/api/v1/anuncios/1/postulaciones/1", "status": 200, "nota": "Transición de postulación a estado contactado y emisión de notificación" },
  { "method": "PATCH", "endpoint": "/api/v1/anuncios/1/estado", "status": 200, "nota": "Gobernanza de ciclo de vida: cierre voluntario de la oferta laboral" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del ciclo de intermediación laboral para comercios locales, se validaron aspectos de alta trascendencia para la sustentación:

### 1. Desacoplamiento de Ofertas No Vinculantes vs Contratos por Hora
* **Diagnóstico:** Los negocios locales requieren con frecuencia personal fijo o de temporada (ayudantes de cocina, bodegueros, plomeros de planta) cuya relación laboral escapa a la figura de contratos civiles de obra por hora gestionados bajo custodia escrow.
* **Beneficio Arquitectónico:** El módulo `anuncios` opera de forma completamente desacoplada de `contratos` y `billeteras`. No genera retenciones financieras ni comisiones por hora, actuando como un canal ágil de bolsa de empleo barrial.
* **Propuesta Técnica para el Backend:** Permitir vincular opcionalmente la postulación con el perfil verificado del PDS (incluyendo antecedentes y Trust Score) sin compartir datos sensibles de documento de identidad hasta que el empleador marque el estado como `contactado`.

### 2. Aislamiento y Privacidad de Candidatos (RBAC Multirrol)
* **Diagnóstico:** En el paso 06, cuando el PDS inspecciona el anuncio público, la petición `GET /api/v1/anuncios/1/postulaciones` es rechazada por el backend con `HTTP 403 Forbidden` (`Solo el negocio dueño gestiona las postulaciones`). En contraste, en el paso 09, cuando el Merchant titular consulta el mismo endpoint, el backend retorna `HTTP 200 OK` con la lista de candidatos.
* **Beneficio Arquitectónico:** Protección rigurosa de datos personales conforme a la Ley 1581 de 2012 (Habeas Data): ningún trabajador puede ver quiénes compiten contra él por una vacante ni acceder a los teléfonos privados de otros postulantes.
* **Propuesta Técnica para el Frontend:** Condicionar la llamada a `listarPostulaciones()` en `AnuncioDetallePage.tsx` exclusivamente si `user.id === anuncio.negocio_id`, evitando solicitudes 403 redundantes en el registro de red.

### 3. Trazabilidad de Ciclo de Vida y Notificaciones en Tiempo Real
* **Diagnóstico:** El controlador `backend/app/controllers/anuncios.py` emite eventos mediante WebSockets (`socketio.emit("anuncio:postulacion")` y `socketio.emit("anuncio:contactado")`) hacia salas privadas por usuario (`room=f"user:{target_user_id}"`), además de persistir la notificación en la tabla `notificaciones`.
* **Propuesta Técnica de Grado:** Implementar una tarea en Celery Beat que revise vacantes con más de 30 días en estado `publicado` sin actividad y envíe un correo recordatorio al comerciante consultando si desea prorrogar o archivar la vacante, manteniendo el catálogo actualizado y sin ofertas huérfanas.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La consulta directa en PostgreSQL (`chambeapp_db_dev`) certifica el éxito del flujo completo:

* **ID Anuncio Laboral:** `1`
* **Negocio / Empleador (User ID):** `3` (`merchant@chambeapp.com`)
* **Título de la Vacante:** `"Técnico en plomería e instalaciones hidráulicas"`
* **Categoría:** `"plomeria"`
* **Vacantes Solicitadas:** `2`
* **Ubicación:** `"Medellín, El Poblado"`
* **Estado Final del Anuncio:** `EstadoAnuncio.CERRADO` (`cerrado`)
* **Timestamp Creación:** `2026-10-21 23:46:34 UTC`
* **Postulación Registrada (`anuncios_postulaciones`):**
  * `ID:` `1`
  * `Anuncio ID:` `1`
  * `PDS Postulante ID:` `1` (`pds@chambeapp.com`)
  * `Mensaje de Presentación:` `"Cuento con más de 5 años de experiencia en mantenimiento preventivo de tuberías hidrosanitarias y trampas de grasa en restaurantes. Disponibilidad inmediata para entrevista."`
  * `Teléfono de Contacto:` `"3009876543"`
  * `Email de Contacto:` `"pds@chambeapp.com"`
  * `Estado Final de Postulación:` `EstadoPostulacionAnuncio.CONTACTADO` (`contactado`)
  * `Timestamp Postulación:` `2026-10-21 23:47:02 UTC`
* **Video de Auditoría:** `video/10-anuncios-laborales-negocios.webm` (11.9 MB)
