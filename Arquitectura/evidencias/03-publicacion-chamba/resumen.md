# Resumen de Ejecución — Flujo 03: Publicación de Solicitudes de Chamba (Geocerca y Fotos 360°)

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright (Chromium Headless con renderizado Mapbox WebGL vía SwiftShader)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-08](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-08-publicación-de-solicitud-con-georreferenciación), [HU-49](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-49-soporte-de-fotos-360-y-panorámicas-en-solicitudes), [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-inicio-de-sesión).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente/Empleador)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Creación de solicitud de chamba guiada paso a paso (8 pasos) con geocerca Mapbox y revisión de resumen | `/solicitante/solicitudes/new` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login` | Inicio de sesión con credenciales de Solicitante | `POST /api/v1/auth/login` | 200 | [01-solicitante-login.png](capturas/01-solicitante-login.png) |
| **02** | `/solicitante/solicitudes` | Acceso al hub principal de solicitudes del cliente | `GET /api/v1/solicitudes/mias` | 200 | [02-solicitante-hub.png](capturas/02-solicitante-hub.png) |
| **03** | Wizard Paso 0: Título | Ingreso del título de la necesidad: *"Reparación urgente de fuga de agua en tubería de cocina"* | N/A (Estado local React) | N/A | [03-publicar-paso0-necesidad.png](capturas/03-publicar-paso0-necesidad.png) |
| **04** | Wizard Paso 1: Categoría | Selección de categoría de oficio: `Plomería` mediante chips interactivos | N/A (Estado local React) | N/A | [04-publicar-paso1-categoria.png](capturas/04-publicar-paso1-categoria.png) |
| **05** | Wizard Paso 2: Detalles | Redacción de descripción y especificaciones técnicas de materiales PVC y termofusión | N/A (Estado local React) | N/A | [05-publicar-paso2-detalles.png](capturas/05-publicar-paso2-detalles.png) |
| **06** | Wizard Paso 3: Ubicación | Dirección, activación de geolocalización, renderizado WebGL del mapa Mapbox y geocerca de 15 km | N/A (Mapbox GL JS) | 200 | [06-publicar-paso3-ubicacion-mapa.png](capturas/06-publicar-paso3-ubicacion-mapa.png) |
| **07** | Wizard Paso 4: Cuándo | Selección de urgencia *"Hoy"* con auto-asignación de fecha deseada para la jornada actual | N/A (Estado local React) | N/A | [07-publicar-paso4-cuando.png](capturas/07-publicar-paso4-cuando.png) |
| **08** | Wizard Paso 5: Presupuesto | Definición de presupuesto estimado de referencia por `$130.000 COP` | N/A (Estado local React) | N/A | [08-publicar-paso5-presupuesto.png](capturas/08-publicar-paso5-presupuesto.png) |
| **09** | Wizard Paso 6: Fotos y 360° | Configuración de soporte multimedia (subida tradicional o panorama 360° interactivo) | N/A (Estado local React) | N/A | [09-publicar-paso6-fotos.png](capturas/09-publicar-paso6-fotos.png) |
| **10** | Wizard Paso 7: Revisión | Comprobación integral de datos consolidados: título, oficio, mapa (`6.2088, -75.5678`), radio y costo | N/A (Preview vivo) | N/A | [10-publicar-paso7-revisar.png](capturas/10-publicar-paso7-revisar.png) |
| **11** | `/solicitante/solicitudes` | Envío formal de solicitud con persistencia y retorno al feed con badge *"Activa"* | `POST /api/v1/solicitudes/`<br>`GET /api/v1/solicitudes/mias` | 201<br>200 | [11-solicitud-creada-feed.png](capturas/11-solicitud-creada-feed.png) |
| **12** | `/login` | Cierre de sesión seguro desde el perfil del contratante | N/A (Client-side purge) | 200 | [12-solicitante-logout.png](capturas/12-solicitante-logout.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Inicio de sesión JWT Solicitante" },
  { "method": "GET",  "endpoint": "/api/v1/auth/me", "status": 200, "nota": "Validación de claims de usuario" },
  { "method": "GET",  "endpoint": "/api/v1/notifications/no-leidas", "status": 200, "nota": "Carga de insignias de notificación" },
  { "method": "GET",  "endpoint": "/api/v1/solicitudes/mias?page=1&per_page=10", "status": 200, "nota": "Consulta de historial previo" },
  { "method": "POST", "endpoint": "/api/v1/solicitudes/", "status": 201, "nota": "Creación exitosa de la solicitud en base de datos PostGIS" },
  { "method": "GET",  "endpoint": "/api/v1/solicitudes/mias?page=1&per_page=10", "status": 200, "nota": "Recarga reactiva con la nueva solicitud activa" },
  { "method": "GET",  "endpoint": "/api/v1/users/me/profile", "status": 200, "nota": "Carga de perfil previo a cierre de sesión" }
]
```

* **Persistencia Espacial:** La solicitud insertó coordenadas precisas (`latitud: 6.2088`, `longitud: -75.5678`) y un radio de geocerca de `15 km`, permitiendo la indexación PostGIS para el cálculo de distancia y proximidad de los prestadores (PDS).
* **Confirmación Inmediata:** La API retornó código `201 Created` y el cliente redirigió fluidamente al listado con notificación toast verde: *"¡Solicitud publicada! Los prestadores cerca ya pueden verla."*.

---

## 4. Hallazgos y Observaciones

1. **Diseño Dual (Stepper vs Formulario):** El módulo ofrece dos modos de captura: un asistente guiado paso a paso (`mode="stepper"`, 8 pasos progresivos) ideal para usuarios casuales, y una vista de formulario único continuo (`mode="form"`) orientada a usuarios avanzados o comerciantes.
2. **Geolocalización Asistida con Mapbox GL:** La integración del mapa vectorial interactivo mediante Mapbox GL JS permite marcar la ubicación exacta mediante clic en el canvas o utilizar geolocalización del navegador, con ajuste dinámico de radio en kilómetros.
3. **Módulo Fotográfico Híbrido:** Admite tanto fotografías convencionales como soporte de imágenes panorámicas 360° (Photo Sphere Viewer / SweepPanoCapture), reduciendo visitas innecesarias de diagnóstico previo.
4. **Resumen de Validación Pre-Envío:** El paso final consolida todos los datos clave en una matriz legible antes de comprometer la publicación en la red de prestadores.

---

## 5. Recursos Asociados al Flujo

* **Video de Grabación Completa:** [03-publicacion-chamba.webm](video/03-publicacion-chamba.webm) *(Paso a paso continuo de la creación y publicación guiada, 4.13 MB)*.
* **Script de Re-ejecución:** [03-publicacion-chamba.cjs](script/03-publicacion-chamba.cjs) *(Script reproducible con Node.js y Playwright)*.
* **Directorio de Capturas:** [capturas/](capturas/) *(12 capturas cronológicas desde el login, los 8 pasos del wizard, el feed actualizado y el logout).*
