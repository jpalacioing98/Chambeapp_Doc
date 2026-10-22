# Resumen de Ejecución — Flujo 04: Exploración Geoespacial y Postulación de Ofertas (PDS)

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright (Chromium Headless con renderizado Mapbox WebGL y edificios 3D vía SwiftShader)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-13](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-13-búsqueda-y-filtrado-geoespacial-de-chambas), [HU-14](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-14-postulación-de-ofertas-a-chambas), [HU-43](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-43-filtrado-avanzado-por-distancia-y-geocerca), [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-inicio-de-sesión).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **PDS (Proveedor de Servicios / Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Exploración 3D en mapa, filtrado por geocerca/radio (20 km), selección de chamba, postulación de oferta y verificación en hub | `/pds/chambas`, `/pds/postular/:id` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login` | Autenticación con credenciales oficiales de PDS | `POST /api/v1/auth/login` | 200 | [01-pds-login.png](capturas/01-pds-login.png) |
| **02** | `/pds` | Carga de Dashboard del PDS con métricas activas, KYC y accesos directos | `GET /api/v1/auth/me`<br>`GET /api/v1/users/me/profile` | 200<br>200 | [02-pds-inicio-dashboard.png](capturas/02-pds-inicio-dashboard.png) |
| **03** | `/pds/chambas` | Vista inmersiva del mapa Mapbox GL en 3D con edificios, pines vectoriales y controles flotantes | `GET /api/v1/solicitudes/` | 200 | [03-pds-mapa-chambas.png](capturas/03-pds-mapa-chambas.png) |
| **04** | FilterSheet Modal | Apertura de controles, despliegue de filtros y ajuste del slider de radio a `20 km` | N/A (Estado React UI) | N/A | [04-pds-filtro-radio.png](capturas/04-pds-filtro-radio.png) |
| **05** | Bottom Sheet Resultados | Clic en *"Ver resultados"*, despliegue del panel inferior reactivo y selección de *"Reparación urgente de tubería de cocina"* | `GET /api/v1/solicitudes/:id` | 200 | [05-pds-chamba-card.png](capturas/05-pds-chamba-card.png) |
| **06** | `/pds/postular/:id` | Navegación a página completa de postulación con especificaciones de la chamba | `GET /api/v1/solicitudes/:id` | 200 | [06-pds-postular-vista.png](capturas/06-pds-postular-vista.png) |
| **07** | Formulario Postulación | Diligenciamiento de propuesta: `$120.000 COP`, franja *"Mañana"*, disponibilidad *"Hoy mismo"*, mensaje y check de confirmación | N/A (Estado React) | N/A | [07-pds-postular-diligenciado.png](capturas/07-pds-postular-diligenciado.png) |
| **08** | `/pds/chambas` | Envío formal de la propuesta económica y retorno al mapa con toast verde *"Postulación enviada"* | `POST /api/v1/solicitudes/:id/ofertas` | **201** | [08-pds-postulacion-enviada.png](capturas/08-pds-postulacion-enviada.png) |
| **09** | Hub Mis Chambas | Clic en FAB *"Mis chambas"*, pestaña *"Postulaciones"* con la oferta listada en estado *"Pendiente"* ($120.000) | `GET /api/v1/mis-ofertas`<br>`GET /api/v1/contracts/mine` | 200<br>200 | [09-pds-mis-postulaciones.png](capturas/09-pds-mis-postulaciones.png) |
| **10** | `/login` | Cierre de sesión seguro desde el perfil del trabajador y purga de tokens en almacenamiento local | N/A (Client-side purge) | 200 | [10-pds-logout.png](capturas/10-pds-logout.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT PDS" },
  { "method": "GET",  "endpoint": "/api/v1/auth/me", "status": 200, "nota": "Validación de claims de rol pds" },
  { "method": "GET",  "endpoint": "/api/v1/users/me/profile", "status": 200, "nota": "Consulta de habilidades del PDS (plomería, jardinería)" },
  { "method": "GET",  "endpoint": "/api/v1/solicitudes/", "status": 200, "nota": "Listado de chambas públicas en el área" },
  { "method": "GET",  "endpoint": "/api/v1/solicitudes/8", "status": 200, "nota": "Detalle completo de la solicitud (coordenadas e historial)" },
  { "method": "POST", "endpoint": "/api/v1/solicitudes/8/ofertas", "status": 201, "nota": "Creación exitosa de la oferta del PDS ($120.000 COP)" },
  { "method": "GET",  "endpoint": "/api/v1/mis-ofertas", "status": 200, "nota": "Consulta de propuestas enviadas con estado 'pendiente'" }
]
```

* **Validación de Competencia:** El frontend valida que el PDS posea la habilidad del oficio (`habilidades` del perfil) antes de habilitar el botón *"Postularme"*; de lo contrario se degrada limpiamente a *"Solo visualizar"*.
* **Persistencia Bilateral:** La oferta fue registrada en base de datos vinculando `solicitud_id = 8`, `trabajador_id = 1`, `monto = 120000`, `estado = 'pendiente'`, quedando inmediatamente lista para la negociación del contratante en el siguiente flujo.

---

## 4. Hallazgos y Observaciones

1. **Arquitectura Map-First Inmersiva:** La vista `/pds/chambas` utiliza un diseño envolvente de pantalla completa con Mapbox GL JS en 3D, edificios extruidos y sombreado topográfico, optimizado para ejecución headless con SwiftShader.
2. **Filtrado por Radio Dinámico:** El componente `FilterSheet` permite ajustar el radio de búsqueda de 2 a 25 km mediante un slider interactivo, permitiendo al trabajador descubrir chambas fuera de su zona inmediata según su capacidad de desplazamiento.
3. **Formulario de Postulación Robusto:** La vista `/pds/postular/:id` valida de manera estricta que cuando una solicitud deja la fecha o la franja horaria *"a convenir"*, el PDS deba proponer explícitamente su disponibilidad (`Mañana`, `Tarde`, `Noche`), evitando ambigüedades contractuales.
4. **Sincronización Reactiva:** Al enviar la oferta, el hook `usePdsChambas` recarga automáticamente el feed de `mis-ofertas`, reflejando la nueva postulación con badge amarillo *"Pendiente"* y actualizando el contador de postulaciones a 3.

---

## 5. Recursos Asociados al Flujo

* **Video de Grabación Completa:** [04-exploracion-postulacion-pds.webm](video/04-exploracion-postulacion-pds.webm) *(Paso a paso continuo de la navegación, filtrado, postulación y verificación, 6.99 MB)*.
* **Script de Re-ejecución:** [04-exploracion-postulacion-pds.cjs](script/04-exploracion-postulacion-pds.cjs) *(Script reproducible con Node.js y Playwright)*.
* **Directorio de Capturas:** [capturas/](capturas/) *(10 capturas en alta resolución numeradas cronológicamente).*
