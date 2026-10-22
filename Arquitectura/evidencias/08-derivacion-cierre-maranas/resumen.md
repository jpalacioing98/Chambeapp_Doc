# Resumen de Ejecución — Flujo 08: Derivación y Cierre Ágil de Marañas (Rebusques)

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, monitoreo de WebSockets y preservación JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-53](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-53-publicación-ágil-de-marañas-o-rebusques), [HU-54](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-54-postulación-rápida-y-cierre-directo-de-marañas).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente/Contratante)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Derivación de adenda técnica de chamba activa hacia maraña pública, revisión de postulaciones, adjudicación directa sin burocracia y confirmación de pago directo | `/solicitante/chambas/1`<br>`/solicitante/maranas`<br>`/solicitante/maranas/1` |
| **PDS (Proveedor de Servicios)** | `pds@chambeapp.com` | `********` *(users.md)* | Exploración geoespacial en feed barrial de marañas (`/pds/maranas`), postulación económica y técnica inmediata, ejecución, reporte de culminación y check-in de cobro | `/pds/maranas`<br>`/pds/maranas/1` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/solicitante/chambas/1` | Solicitante ingresa al expediente de la Chamba #1 y visualiza en la bitácora de adendas la opción activa *"Lanzar maraña"* para trabajo no cubierto por el PDS titular | `POST /api/v1/auth/login`<br>`GET /api/v1/chambas/1` | 200<br>200 | [01-solicitante-chamba-adenda-marana.png](capturas/01-solicitante-chamba-adenda-marana.png) |
| **02** | Modal `MaranaCrearModal` | Apertura de modal de derivación; diligenciamiento ágil de título (*"Reconexión eléctrica de calentador"*), categoría (`electricidad`), presupuesto ($35.000 COP) y alcance técnico | *(Renderizado de formulario React)* | — | [02-solicitante-modal-lanzar-marana.png](capturas/02-solicitante-modal-lanzar-marana.png) |
| **03** | `/solicitante/maranas` | Envío del formulario; el presupuesto se deduce de la adenda y se publica la maraña #1; auditoría en listado de marañas activas con insignia `publicado` | `POST /api/v1/chambas/1/marana`<br>`GET /api/v1/maranas/` | **201**<br>200 | [03-solicitante-marana-publicada-lista.png](capturas/03-solicitante-marana-publicada-lista.png) |
| **04** | `/login`<br>`/pds/maranas` | PDS inicia sesión y accede al feed barrial de rebusques; localiza la oportunidad en la pestaña *"Disponibles (1)"* con datos de ubicación y presupuesto | `POST /api/v1/auth/login`<br>`GET /api/v1/maranas/` | 200<br>200 | [04-pds-feed-maranas-disponibles.png](capturas/04-pds-feed-maranas-disponibles.png) |
| **05** | Modal `MaranaPostularModal` | PDS abre modal de postulación rápida; especifica valor propuesto ($35.000 COP), mensaje de disponibilidad inmediata y herramientas de diagnóstico | *(Interacción modal PDS)* | — | [05-pds-modal-postulacion-marana.png](capturas/05-pds-modal-postulacion-marana.png) |
| **06** | `/login`<br>`/solicitante/maranas/1` | Solicitante reingresa al detalle de la maraña; inspecciona la postulación del Prestador #1 con opciones de *"Contraofertar"* o *"Aceptar y asignar"* | `POST /api/v1/auth/login`<br>`GET /api/v1/maranas/1`<br>`GET /api/v1/maranas/1/ofertas` | 200<br>200<br>200 | [06-solicitante-marana-ofertas-recibidas.png](capturas/06-solicitante-marana-ofertas-recibidas.png) |
| **07** | `/solicitante/maranas/1` | Solicitante presiona *"Aceptar y asignar"*; adjudicación inmediata sin firma contractual formal; estado transiciona a `asignado` | `POST /api/v1/maranas/1/responder?oferta_id=1` | **200** | [07-marana-asignada-expediente.png](capturas/07-marana-asignada-expediente.png) |
| **08** | `/login`<br>`/pds/maranas/1` | Prestador adjudicado accede a la orden de trabajo; tras ejecutar la tarea presiona *"Completar trabajo"*; transición a `completado` | `POST /api/v1/auth/login`<br>`PATCH /api/v1/maranas/1/estado` | 200<br>**200** | [08-pds-marana-completar-trabajo.png](capturas/08-pds-marana-completar-trabajo.png) |
| **09** | Modal `MaranaPago` | Registro de doble conformidad de pago directo: PDS confirma recepción y Solicitante confirma entrega mano a mano ($35.000 COP) | `POST /api/v1/maranas/1/pago` | **200** | [09-marana-checkin-pago-directo.png](capturas/09-marana-checkin-pago-directo.png) |
| **10** | `/solicitante/maranas/1` | Expediente finalizado con insignia verde `pagada`; auditoría de trazabilidad completa en la bitácora de hitos (Publicada, Asignada, Entregada, Pagada) | `GET /api/v1/maranas/1` | 200 | [10-marana-cerrada-pagada.png](capturas/10-marana-cerrada-pagada.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST",  "endpoint": "/api/v1/chambas/1/marana", "status": 201, "nota": "Derivación de adenda: crea maraña #1 y deduce monto de la chamba madre" },
  { "method": "GET",   "endpoint": "/api/v1/maranas/", "status": 200, "nota": "Feed público de marañas en estado publicado" },
  { "method": "POST",  "endpoint": "/api/v1/maranas/1/ofertas", "status": 201, "nota": "PDS postula oferta económica ($35.000) y mensaje técnico" },
  { "method": "GET",   "endpoint": "/api/v1/maranas/1/ofertas", "status": 200, "nota": "Consulta de postulaciones recibidas por el creador" },
  { "method": "POST",  "endpoint": "/api/v1/maranas/1/responder?oferta_id=1", "status": 200, "nota": "Aceptación directa: asigna maraña a PDS #1" },
  { "method": "PATCH", "endpoint": "/api/v1/maranas/1/estado", "status": 200, "nota": "PDS culmina labor: transición a estado completado" },
  { "method": "POST",  "endpoint": "/api/v1/maranas/1/pago", "status": 200, "nota": "PDS registra check-in de pago directo recibido" },
  { "method": "POST",  "endpoint": "/api/v1/maranas/1/pago", "status": 200, "nota": "Solicitante registra check-in de pago; transición final a pagado" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del ciclo de marañas sobre el código base, se identificaron aspectos arquitectónicos clave para la sustentación:

### 1. Desacoplamiento de Órdenes Menores y Prevención de Doble Facturación
* **Diagnóstico:** Cuando surge un imprevisto en una obra formal que requiere un oficio especializado diferente (ej. un fontanero que no realiza cableado de alta tensión), el backend en `app/controllers/chambas.py` traslada el `monto_extra` de la adenda hacia el presupuesto de la maraña y marca `adenda.derivada = True`.
* **Beneficio Arquitectónico:** Esto previene la doble imputación de costos al cliente en la liquidación final de la chamba y permite adjudicar el trabajo a un segundo prestador con agilidad.
* **Propuesta Técnica para el Backend:** Crear un evento de dominio desacoplado mediante Celery o signals de Blinker (`chamba_adenda_derivada`), de manera que la bitácora contable audite el traslado presupuestal con trazabilidad bancaria entre órdenes.

### 2. Check-in Bilateral Directo vs Custodia en Escrow
* **Diagnóstico:** Para tareas de bajo importe ("rebusques" o "marañas" barriales de $20.000 - $50.000 COP), la intermediación bancaria con comisiones de pasarela desincentiva la economía popular. El modelo implementa un check-in dual directo (`pago_confirmado_solicitante` y `pago_confirmado_prestador`), cerrando la orden únicamente cuando ambas partes otorgan su conformidad.
* **Propuesta Técnica para la API:** Incorporar un mecanismo de resolución por expiración temporal (*timeout de 48 horas*): si el prestador confirma la entrega y el cliente no responde ni genera reclamo, la plataforma podría auto-confirmar el cierre tras notificaciones SMS/Push de recordatorio.

### 3. Persistencia de Adendas en Columna JSON vs Modelo Relacional
* **Diagnóstico:** La columna `chambas.adendas` es de tipo `JSON`. En SQLAlchemy, las mutaciones directas sobre diccionarios o listas anidadas no disparan automáticamente el evento de *dirty checking* a menos que se reasigne una nueva referencia de lista (`chamba.adendas = nueva_lista`) o se utilice `MutableList.as_mutable(JSON)`.
* **Propuesta Técnica de Grado:** Normalizar las adendas en una tabla relacional independiente `chamba_adendas` con clave foránea a `chambas.id` y clave foránea opcional a `maranas.id`, simplificando las consultas SQL relacionales e índices geoespaciales.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La verificación directa en PostgreSQL certifica el éxito del ciclo de vida ágil:

* **ID Maraña:** `1`
* **Chamba Origen:** `ID 1` (Adenda derivada con trazabilidad cruzada)
* **Título:** `"Reconexión eléctrica de calentador"`
* **Categoría:** `"electricidad"`
* **Presupuesto Acordado:** `$35.000 COP`
* **Estado:** `EstadoMarana.PAGADO` (`pagada`)
* **PDS Asignado:** `ID 1` (`pds@chambeapp.com`)
* **Doble Conformidad de Pago Directo:**
  * `pago_confirmado_solicitante: True`
  * `pago_confirmado_prestador: True`
* **Ofertas Registradas:** 1 postulación de $35.000 COP en estado `aceptada`
* **Video de Auditoría:** `video/08-derivacion-cierre-maranas.webm` (6.2 MB)
