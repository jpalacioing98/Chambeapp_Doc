# Resumen de Ejecución — Flujo 06: Ejecución y Ciclo Operativo de la Chamba (6 Hitos)

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, permisos de geolocalización emulada y enrutamiento a MinIO)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-17](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-17-iniciar-obra-con-validación-gps), [HU-18](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-18-registro-de-evidencias-fotográficas-y-entorno-360), [HU-19](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-19-adendas-al-contrato-en-ejecución), [HU-20](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-20-reporte-de-novedades-e-incidencias), [HU-21](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-21-validación-de-habilidades-demostradas-en-obra), [HU-22](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-22-cierre-y-liquidación-de-la-chamba), [HU-23](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-23-calificación-y-retroalimentación-del-servicio).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **PDS (Proveedor de Servicios)** | `pds@chambeapp.com` | `********` *(users.md)* | Check-in geolocalizado en sitio (<100m), carga de evidencia inicial, registro de adenda técnica, novedad de obra, evidencia final y check-in de cobro | `/pds/chambas/1` |
| **Solicitante (Cliente/Contratante)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Inspección de entregables y adendas, validación de habilidades demostradas en sitio, check-in de pago directo, confirmación de liquidación y calificación 5 estrellas | `/solicitante/chambas/1` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/pds/chambas/1` | Autenticación del PDS y carga del expediente operativo de la Chamba #1 en estado `"programada"` | `POST /api/v1/auth/login`<br>`GET /api/v1/chambas/1` | 200<br>200 | [01-pds-expediente-programada.png](capturas/01-pds-expediente-programada.png) |
| **02** | `/pds/chambas/1` | **Hito 1:** Clic en *"Iniciar obra"* con geolocalización emulada en sitio (`lat: 6.2088, lng: -75.5678`, distancia `<100m`); transición a `"en_proceso"` | `POST /api/v1/chambas/1/iniciar` | **200** | [02-pds-inicio-obra-gps.png](capturas/02-pds-inicio-obra-gps.png) |
| **03** | `/pds/chambas/1` | **Hito 2:** Carga de fotografía de estado previo (evidencia inicial) a MinIO; avance de estado con *"Continuar a ejecución"* (`"en_ejecucion"`) | `POST /api/v1/chambas/evidencia/upload`<br>`POST /api/v1/chambas/1/evidencia-entrada`<br>`PATCH /api/v1/chambas/1/estado` | 200<br>200<br>200 | [03-pds-evidencia-inicial-subida.png](capturas/03-pds-evidencia-inicial-subida.png) |
| **04** | Modal de Adenda | **Hito 3:** Apertura de modal *"Adenda al contrato"*, registro de trabajo complementario (*"Reemplazo de niple y codo PVC adicional por fisura no visible"*), +$20.000 COP y +1h cubierta por el prestador actual | `POST /api/v1/chambas/1/adenda` | **200** | [04-pds-adenda-registrada.png](capturas/04-pds-adenda-registrada.png) |
| **05** | Modal de Novedad | **Hito 4:** Registro de novedad operativa en terreno (*"Corte preventivo temporal de suministro de agua durante el fraguado del sellante"*); anexo automático al expediente | `POST /api/v1/chambas/1/novedad` | **200** | [05-pds-novedad-reportada.png](capturas/05-pds-novedad-reportada.png) |
| **06** | `/pds/chambas/1` | **Hito 5:** Carga de evidencia final (obra terminada) a MinIO, notificación de entrega mediante *"Solicitar cierre"* (`"pendiente_validacion"`) y confirmación de cobro PDS ($140.000 COP con adenda) | `POST /api/v1/chambas/evidencia/upload`<br>`POST /api/v1/chambas/1/evidencia-salida`<br>`PATCH /api/v1/chambas/1/estado`<br>`POST /api/v1/chambas/1/pago` | 200<br>200<br>200<br>200 | [06-pds-evidencia-final-cierre.png](capturas/06-pds-evidencia-final-cierre.png) |
| **07** | `/login`<br>`/solicitante/chambas/1` | Cierre de sesión del PDS, login del Solicitante e ingreso al expediente en modo revisión | `POST /api/v1/auth/login`<br>`GET /api/v1/chambas/1` | 200<br>200 | [07-solicitante-expediente-revision.png](capturas/07-solicitante-expediente-revision.png) |
| **08** | Sección Validación | **Hito 6:** Inspección de entrega y validación de habilidades técnicas demostradas por el fontanero en obra | `POST /api/v1/chambas/1/validar-habilidades` | **200** | [08-solicitante-habilidades-validadas.png](capturas/08-solicitante-habilidades-validadas.png) |
| **09** | Sección Pago y Liquidación | Check-in de pago del Solicitante ($140.000 COP), cumplimiento de la doble conformidad (`pago_directo_confirmado = true`) y confirmación de liquidación (`"liquidacion_confirmada"`) | `POST /api/v1/chambas/1/pago`<br>`PATCH /api/v1/chambas/1/estado` | 200<br>**200** | [09-solicitante-pago-liquidacion.png](capturas/09-solicitante-pago-liquidacion.png) |
| **10** | Card de Calificación | Solicitante emite 5 estrellas y reseña técnica (*"Excelente labor de fontanería. Puntual, tubería completamente reparada sin fugas y área impecable."*); cierre final de la orden (`"finalizada"`) | `POST /api/v1/chambas/1/calificar`<br>`GET /api/v1/chambas/1` | **200**<br>200 | [10-chamba-completada-finalizada.png](capturas/10-chamba-completada-finalizada.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/iniciar", "status": 200, "nota": "Validación geofence (<100m) y transición a en_proceso" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/evidencia/upload", "status": 200, "nota": "Subida de foto base64 a bucket MinIO dev" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/evidencia-entrada", "status": 200, "nota": "Anexo de URL de evidencia previa al expediente" },
  { "method": "PATCH", "endpoint": "/api/v1/chambas/1/estado", "status": 200, "nota": "Transición a estado en_ejecucion" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/adenda", "status": 200, "nota": "Inclusión de costo extra ($20.000) y tiempo extra (1h)" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/novedad", "status": 200, "nota": "Registro de incidencia de corte de agua en bitácora" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/evidencia-salida", "status": 200, "nota": "Anexo de URL de obra terminada" },
  { "method": "PATCH", "endpoint": "/api/v1/chambas/1/estado", "status": 200, "nota": "PDS solicita cierre; pasa a pendiente_validacion" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/pago", "status": 200, "nota": "PDS marca conformidad de pago directo" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/validar-habilidades", "status": 200, "nota": "Cliente valida habilidades demostradas en sitio" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/pago", "status": 200, "nota": "Cliente marca pago directo; dualConfirmado = true" },
  { "method": "PATCH", "endpoint": "/api/v1/chambas/1/estado", "status": 200, "nota": "Cliente liquida; pasa a liquidacion_confirmada" },
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/calificar", "status": 200, "nota": "Calificación 5 estrellas y transición a finalizada" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría automatizada del Flujo 06 sobre el código fuente inmutable, se identificaron aspectos arquitectónicos de alto valor técnico para la sustentación:

### 1. Prefijo Data URI en Carga Base64 hacia Backend Python
* **Diagnóstico:** En `frontend/src/features/chamba/services/chambaApi.ts` y `useChamba.ts`, la función `fileToDataUrl` entrega la cadena completa con el prefijo MIME (`data:image/png;base64,...`). En `backend/app/controllers/chambas.py` (Línea 532), el controlador invoca directamente `base64.b64decode(b64)`. En la biblioteca estándar de Python, los caracteres `:` y `;` no pertenecen al alfabeto base64 estándar y desencadenan un `binascii.Error`, que el backend traduce en un error HTTP 400 (`"Imagen base64 inválida."`).
* **Resolución en Auditoría (Sin tocar código fuente):** El script intercepta `**/api/v1/chambas/evidencia/upload` mediante `page.route()`, remueve la cabecera `data:[^;]+;base64,` y traslada los bytes puros al microservicio de almacenamiento.
* **Propuesta Técnica para el Código de Producción:** Modificar `chambas.py` para aplicar una expresión regular de saneamiento previa:
  ```python
  if "," in b64:
      b64 = b64.split(",", 1)[1]
  ```
  Esto aporta resiliencia universal a cualquier cliente HTTP móvil o web.

### 2. Validación de URL en Esquema Marshmallow vs Dominios Internos de Docker
* **Diagnóstico:** `EvidenciaSchema` en `backend/app/schemas/chambas.py` valida la lista de URLs mediante `fields.Url()`. Por defecto en Marshmallow, `fields.Url()` exige un dominio de nivel superior (TLD, ej: `.com`, `.net`, o `localhost`/dirección IP). El endpoint interno del contenedor MinIO devuelve `http://minio:9000/...`, lo cual no tiene TLD y provoca un error de validación `422 Unprocessable Entity ("['Not a valid URL.']")`.
* **Resolución en Auditoría:** La pasarela de Playwright normalizó la URL devuelta hacia `http://localhost:9000/...`, resolviendo simultáneamente la validación de Marshmallow y la carga real de recursos estáticos en el navegador cliente.
* **Propuesta Técnica para el Backend:** Configurar `fields.Url(require_tld=False)` en `EvidenciaSchema` o asegurar que la variable `MINIO_PUBLIC_URL` del archivo de configuración apunte al hostname público/resoluble desde el frontend.

### 3. Solapamiento de Capas Visuales (Z-Index / Bounding Box) en Modales
* **Diagnóstico:** La barra inferior de acciones rápidas (`.ch-detalle__bar`) posee posicionamiento fijo (`position: fixed; bottom: 0`). En viewports de altura reducida (<=768px), la barra se superpone con los botones de acción del pie del modal (`.ch-modal-footer`), causando intercepción de eventos de puntero.
* **Propuesta Técnica para Frontend:** Ajustar la variable CSS `--z-modal: 1000` para garantizar que la capa de superposición (`.ch-modal-overlay`) permanezca por encima de cualquier barra fija auxiliar (`--z-fixed-bar: 50`).

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La consulta directa a la base de datos PostgreSQL tras la ejecución del script ratifica la consistencia integral del ciclo operativo:

* **ID Chamba:** `1`
* **Contrato Asociado:** `ID 2` (Solicitud #8)
* **Estado:** `EstadoChamba.FINALIZADA`
* **Evidencias de Entrada Registradas:** 1 foto (`http://localhost:9000/chambeapp-portfolio/avatar/chamba-1/og-image.png.webp`)
* **Evidencias de Salida Registradas:** 1 foto (`http://localhost:9000/chambeapp-portfolio/avatar/chamba-1/og-image.png.webp`)
* **Adendas Aprobadas:** 1 adenda (+$20.000 COP, tiempo extra: 1 minuto/hora, descripción técnica registrada)
* **Novedades de Campo:** 1 novedad de tipo `"otro"` registrada en auditoría
* **Doble Conformidad de Pago Directo:** `True` (PDS y Solicitante registraron conformidad)
* **Monto Final Liquidado:** `$140.000 COP` ($120.000 contractuales iniciales + $20.000 de adenda técnica aprobada)
* **Calificación y Feedback:** 5 estrellas y reseña pública registrada para el perfil del PDS.
