# Resumen de Ejecución — Flujo 09: Directorio y Gestión de Negocios Locales

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, Mapbox GL JS, captura de red y preservación JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-55](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-55-registro-y-perfil-de-negocio-local), [HU-56](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-56-directorio-público-de-negocios-en-mapa-interactivo), [HU-57](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-57-horarios-de-atención-y-contacto-directo), [HU-58](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-58-galería-fotográfica-de-negocios-en-minio), [HU-59](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-59-reseñas-y-calificaciones-de-negocios), [HU-60](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-60-sistema-de-reporte-comunitario-de-negocios).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Comerciante (Merchant)** | `merchant@chambeapp.com` | `********` *(users.md)* | Gestión integral de la ficha comercial de "Restaurante El Sazón", actualización de canales de contacto directo (WhatsApp), ajuste de matriz semanal de horarios y carga de fotografías en vitrina digital | `/negocio`<br>`/negocio/mi-negocio`<br>`/negocio/horarios`<br>`/negocio/imagenes` |
| **Cliente / Vecino (Solicitante)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Exploración geoespacial en directorio público sobre mapa Mapbox, apertura de tarjeta emergente (Sheet), consulta de horarios en tiempo real ("Abierto ahora"), emisión de reseña con 5 estrellas y reporte preventivo comunitario | `/negocios`<br>`/negocios/1` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/negocio` | Merchant inicia sesión y accede al dashboard de comerciante; visualiza métricas comerciales, estado ("Activo", "Abierto ahora", "4.5★") y gráficas de distribución | `POST /api/v1/auth/login`<br>`GET /api/v1/negocios/`<br>`GET /api/v1/negocios/1/stats` | 200<br>200<br>200 | [01-merchant-dashboard.png](capturas/01-merchant-dashboard.png) |
| **02** | `/negocio/mi-negocio` | Merchant navega a la ficha de configuración completa; audita ubicación geoespacial en mapa estático, tipo de negocio, categorías y servicios | `GET /api/v1/negocios/`<br>`GET /api/v1/negocios/1` | 200<br>200 | [02-merchant-mi-negocio-configuracion.png](capturas/02-merchant-mi-negocio-configuracion.png) |
| **03** | `/negocio/mi-negocio` | Despliegue de acordeón "Contacto"; actualización de número WhatsApp (`+57 300 123 4567`) y mensaje predeterminado de cotización; guardado exitoso | `PUT /api/v1/negocios/1` | **200** | [03-merchant-guardar-contacto-exitoso.png](capturas/03-merchant-guardar-contacto-exitoso.png) |
| **04** | `/negocio/horarios` | Acceso al editor semanal de atención; verificación de banner de estado en tiempo real y ampliación de horario de cierre para garantizar estado "Abierto ahora" | `PUT /api/v1/negocios/1/horarios` | **200** | [04-merchant-gestion-horarios.png](capturas/04-merchant-gestion-horarios.png) |
| **05** | `/negocio/imagenes` | Auditoría de vitrina fotográfica comercial; alta de fotografía de alta resolución de catálogo por URL y persistencia en backend; cierre de sesión de comerciante | `POST /api/v1/negocios/1/imagenes` | **201** | [05-merchant-galeria-vitrina.png](capturas/05-merchant-galeria-vitrina.png) |
| **06** | `/login`<br>`/negocios` | Solicitante inicia sesión y accede al directorio público de comercios locales en mapa interactivo Mapbox GL JS (renderizado vía SwiftShader WebGL) | `POST /api/v1/auth/login`<br>`GET /api/v1/negocios/mapa`<br>`GET /api/v1/negocios/categorias` | 200<br>200<br>200 | [06-directorio-publico-mapa-negocios.png](capturas/06-directorio-publico-mapa-negocios.png) |
| **07** | `/negocios` (Sheet) | Interacción con card de "Restaurante El Sazón"; despliegue de Bottom Sheet emergente con insignia "Abierto", calificación, dirección y botón de WhatsApp | `GET /api/v1/negocios/1` | 200 | [07-sheet-detalle-restaurante-el-sazon.png](capturas/07-sheet-detalle-restaurante-el-sazon.png) |
| **08** | `/negocios/1` | Navegación a página completa de detalle público; visualización de hero banner, insignias "Abierto" y "Verificado", matriz semanal de horarios y mapa de cobertura | `GET /api/v1/negocios/1`<br>`GET /api/v1/negocios/1/ratings` | 200<br>200 | [08-negocio-detalle-publico-horarios.png](capturas/08-negocio-detalle-publico-horarios.png) |
| **09** | `/negocios/1` | Solicitante despliega caja de reseña, selecciona 5 estrellas interactivas, redacta comentario de experiencia gastronómica y publica la calificación | `POST /api/v1/negocios/1/rating` | **201** | [09-solicitante-publicar-calificacion.png](capturas/09-solicitante-publicar-calificacion.png) |
| **10** | `/negocios/1` (`ReportModal`) | Apertura de modal de reporte comunitario; selección de motivo "Otro", redacción de descripción de auditoría preventiva y radicación ante moderación | `POST /api/v1/negocios/1/reportar` | **201** | [10-modal-reporte-comunitario.png](capturas/10-modal-reporte-comunitario.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "GET",  "endpoint": "/api/v1/negocios/", "status": 200, "nota": "Carga de ficha de negocio asociado al token JWT del merchant" },
  { "method": "GET",  "endpoint": "/api/v1/negocios/1/stats", "status": 200, "nota": "Consulta de analíticas y vistas de perfil permitida para el owner" },
  { "method": "PUT",  "endpoint": "/api/v1/negocios/1", "status": 200, "nota": "Actualización de metadata de contacto directo (WhatsApp y redes sociales)" },
  { "method": "PUT",  "endpoint": "/api/v1/negocios/1/horarios", "status": 200, "nota": "Persistencia de matriz semanal de horarios (días 0 a 6)" },
  { "method": "POST", "endpoint": "/api/v1/negocios/1/imagenes", "status": 201, "nota": "Adición de fotografía de vitrina comercial a la lista imagenes[]" },
  { "method": "GET",  "endpoint": "/api/v1/negocios/mapa", "status": 200, "nota": "Consulta geoespacial de pines y clusters de negocios para Mapbox" },
  { "method": "GET",  "endpoint": "/api/v1/negocios/1", "status": 200, "nota": "Detalle público de negocio consumido por Sheet y vista detallada" },
  { "method": "GET",  "endpoint": "/api/v1/negocios/1/stats", "status": 403, "nota": "Seguridad RBAC: denegación de analíticas privadas a clientes no propietarios" },
  { "method": "POST", "endpoint": "/api/v1/negocios/1/rating", "status": 201, "nota": "Emisión de calificación de 5 estrellas con recálculo de promedio en BD" },
  { "method": "POST", "endpoint": "/api/v1/negocios/1/reportar", "status": 201, "nota": "Creación de reporte comunitario con estado 'abierto' para moderación" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del ciclo de vida del directorio y perfiles de negocio, se validaron aspectos de alta relevancia para la sustentación arquitectónica:

### 1. Cálculo Dinámico de Horarios y Manejo de Zona Horaria (UTC vs COT)
* **Diagnóstico:** El servicio `backend/app/services/negocio_utils.py` implementa `calcular_estado_horario()`, contrastando `hora_apertura <= hora_actual <= hora_cierre` contra `datetime.now().time()`. En entornos contenerizados en la nube que operan bajo UTC, la hora del servidor puede diferir en 5 horas respecto a la hora legal colombiana (`America/Bogota` / UTC-5).
* **Beneficio Arquitectónico:** Permite a la plataforma calcular dinámicamente si el negocio está "Abierto ahora" o "Cierra pronto" (ventana `<= 30 min`) sin requerir un cronjob periódico que actualice banderas estáticas en base de datos.
* **Propuesta Técnica para el Backend:** Forzar la evaluación temporal contra el huso horario local mediante `zoneinfo.ZoneInfo("America/Bogota")` o parametrizar el huso horario en la entidad `negocios.timezone`, evitando falsos estados cerrados por discrepancia de reloj entre el cluster y la ubicación física del local.

### 2. Aislamiento de Privilegios y Seguridad RBAC en Analíticas de Negocio
* **Diagnóstico:** En la vista pública `/negocios/1`, el frontend intenta consultar `GET /api/v1/negocios/1/stats`. El backend responde estrictamente con `HTTP 403 Forbidden` (`_ensure_owner`), impidiendo que un tercero o competidor espíe las métricas privadas (ingresos, tasa de respuesta, contrataciones). En el panel privado del comerciante (`/negocio`), la misma petición devuelve `HTTP 200 OK`.
* **Beneficio Arquitectónico:** Cumplimiento del principio de mínimo privilegio (*Least Privilege*) y protección de datos comerciales sensibles contra *data scraping*.
* **Propuesta Técnica para el Frontend:** Omitir la invocación de `/stats` en la ruta pública `/negocios/:id` cuando el usuario no sea el propietario autenticado, evitando peticiones 403 esperadas en el registro de red.

### 3. Mutabilidad de Colecciones JSON en SQLAlchemy 2.0 y MinIO
* **Diagnóstico:** Las imágenes de la vitrina se almacenan en la columna `negocios.imagenes` (tipo `JSON`). En SQLAlchemy 2.0, mutar una lista in-place (`negocio.imagenes.append(...)`) no activa la detección de cambios (*dirty tracking*).
* **Hallazgo Positivo:** El controlador `backend/app/controllers/negocios.py` reasigna explícitamente una copia de lista nueva (`imagenes = list(negocio.imagenes or []); imagenes.append(...); negocio.imagenes = imagenes`), garantizando la persistencia efectiva en PostgreSQL sin pérdida de enlaces a objetos MinIO.
* **Propuesta Técnica de Grado:** Implementar `sqlalchemy.ext.mutable.MutableList.as_mutable(JSON)` sobre el modelo `Negocio` para soporte nativo y agregar límites de cuota (máximo 10 fotografías de hasta 5 MB por comercio) validados mediante Celery.

### 4. Sistema Preventivo de Reportes Comunitarios y Moderación Ágil
* **Diagnóstico:** El endpoint `POST /api/v1/negocios/1/reportar` inserta un registro en la tabla `reportes_negocio` con estado inicial `abierto` y tipos tipificados (`fraude`, `spam`, `contenido_inapropiado`, `servicio_no_prestado`, `otro`).
* **Propuesta Técnica:** Incorporar un disparador que suspenda preventivamente la visibilidad del comercio en el mapa público si acumula un umbral de 3 o más reportes de `fraude` en menos de 24 horas, notificando de inmediato a la mesa de ayuda de soporte administrativo.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La consulta directa en PostgreSQL (`chambeapp_db_dev`) confirma la integridad transaccional de los datos modificados durante la ejecución:

* **ID Negocio:** `1`
* **Nombre Comercial:** `"Restaurante El Sazón"`
* **Slug URL:** `"restaurante-el-sazon"`
* **Propietario (Owner ID):** `3` (`merchant@chambeapp.com`)
* **Canal WhatsApp Directo:** `+57 300 123 4567` (actualizado y verificado)
* **Vitrina Fotográfica:** Fotografía de catálogo agregada y disponible en `imagenes[]`
* **Calificación Promedio:** `5.0★` (`calificacion_promedio = 5.0`)
* **Total Calificaciones:** `1` (`total_calificaciones = 1`)
* **Calificación en BD (`NegocioRating`):**
  * `ID:` `2`
  * `Autor ID:` `2` (`solicitante@chambeapp.com`)
  * `Puntaje:` `5`
  * `Comentario:` `"Excelente atención y sabor tradicional inigualable. La comida criolla es de primera y el servicio sumamente ágil. Recomendadísimo para almorzar en familia."`
  * `Timestamp:` `2026-10-21 23:31:54 UTC`
* **Reporte Comunitario en BD (`NegocioReporte`):**
  * `ID:` `1`
  * `Reporter ID:` `2` (`solicitante@chambeapp.com`)
  * `Tipo:` `"otro"`
  * `Descripción:` `"Auditoría arquitectónica preventiva: verificación exitosa de funcionamiento, horarios y legalidad del comercio."`
  * `Estado:` `"abierto"`
  * `Timestamp:` `2026-10-21 23:31:59 UTC`
* **Video de Auditoría:** `video/09-directorio-negocios-locales.webm` (10.2 MB)
