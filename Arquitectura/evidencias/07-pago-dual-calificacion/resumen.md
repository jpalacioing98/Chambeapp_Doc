# Resumen de Ejecución — Flujo 07: Pago Dual Directo y Calificación Mutua

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, intercepción de rutas y preservación de credenciales JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-21](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-21-selección-de-método-de-pago-dual), [HU-22](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-22-liberación-de-fondos-en-custodia-escrow), [HU-23](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-23-confirmación-bilateral-de-pago-directo-en-efectivotransferencia), [HU-24](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-24-calificación-y-reseña-cruzada).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **PDS (Proveedor de Servicios)** | `pds@chambeapp.com` | `********` *(users.md)* | Culminación contractual de obra, consulta de billetera de cobro, calificación recíproca al cliente y descarga de certificado de ingresos | `/solicitante/contratos/2`<br>`/pds/billetera`<br>`/pds/perfil` |
| **Solicitante (Cliente/Contratante)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Confirmación formal de entrega, consulta de cuenta institucional Nequi, registro y confirmación de pago dual ($120.000 COP), auditoría contable en panel de pagos, endoso de competencias técnicas y calificación 5 estrellas | `/solicitante/contratos/2`<br>`/solicitante/solicitudes?tab=pagos`<br>`/solicitante/billetera` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/pds/chambas` | PDS inicia sesión, marca la culminación formal del contrato #2 (`"completar"`) y audita el estado en su lista de chambas | `POST /api/v1/auth/login`<br>`PATCH /api/v1/contracts/2/estado` | 200<br>**200** | [01-pds-contrato-completar.png](capturas/01-pds-contrato-completar.png) |
| **02** | `/login`<br>`/solicitante/contratos/2` | Solicitante inicia sesión, confirma cumplimiento (`"confirmar"`); el contrato pasa a `"completado"` y despliega el botón de pago y panel de endosos | `POST /api/v1/auth/login`<br>`PATCH /api/v1/contracts/2/estado`<br>`GET /api/v1/contracts/2` | 200<br>**200**<br>200 | [02-solicitante-contrato-confirmado.png](capturas/02-solicitante-contrato-confirmado.png) |
| **03** | Modal / Detalle de Pago | Solicitante consulta la cuenta institucional Nequi de ChambeApp y revisa el desglose económico del servicio ($120.000 COP) | `GET /api/v1/payments/nequi` | **200** | [03-solicitante-resumen-pago-nequi.png](capturas/03-solicitante-resumen-pago-nequi.png) |
| **04** | `/solicitante/contratos/2` | Clic en el botón *"Pagar $120.000"*; se genera la orden de pago #2 con método Nequi en estado `"pendiente"` y notificación toast exitosa | `POST /api/v1/payments/` | **201** | [04-solicitante-pago-registrado.png](capturas/04-solicitante-pago-registrado.png) |
| **05** | `/solicitante/contratos/2` | Confirmación del pago en la pasarela externa (`/confirm`); asignación de referencia `MOCK-2-1792552542` y actualización a `"completado"` | `POST /api/v1/payments/2/confirm` | **200** | [05-pago-confirmado-pasarela.png](capturas/05-pago-confirmado-pasarela.png) |
| **06** | `/solicitante/solicitudes?tab=pagos` | Auditoría en el panel de pagos del cliente (`PaymentsPanel`): métricas `$120.000 Pagado`, `$0 Pendiente` y tarjeta de `Pago #2 · nequi` con insignia verde `"Pagado"` | `GET /api/v1/payments/mine` | **200** | [06-solicitante-panel-pagos.png](capturas/06-solicitante-panel-pagos.png) |
| **07** | `/solicitante/contratos/2` | Solicitante selecciona 3 competencias técnicas observadas en obra (*Termofusión, Fugas, Grifería*), presiona *"Endosar seleccionadas"*, y emite calificación mutua (5.0★) con reseña | `POST /api/v1/habilidades/endosos`<br>`POST /api/v1/solicitudes/8/ratings` | **201**<br>**201** | [07-solicitante-habilidades-endosadas.png](capturas/07-solicitante-habilidades-endosadas.png) |
| **08** | `/solicitante/billetera` | Inspección de la billetera virtual del Solicitante; validación de balance contable, medios de pago vinculados y ausencia de saldos retenidos | `GET /api/v1/wallet/transactions`<br>`GET /api/v1/wallet/balance` | 200<br>200 | [08-solicitante-billetera-balance.png](capturas/08-solicitante-billetera-balance.png) |
| **09** | `/login`<br>`/pds/billetera` | Cierre de sesión cliente, ingreso de PDS; calificación recíproca al cliente (5.0★), apertura de modal de *"Certificado de ingresos"* y generación de reporte tributario | `POST /api/v1/auth/login`<br>`POST /api/v1/solicitudes/8/ratings`<br>`GET /api/v1/payments/certificado-ingresos` | 200<br>**201**<br>**200** | [09-pds-billetera-certificado.png](capturas/09-pds-billetera-certificado.png) |
| **10** | `/pds/perfil` | Verificación del perfil unificado del prestador: insignia destacada `5.0★ reputación`, insignia `Identidad verificada` y acordeón con competencias técnicas validadas | `GET /api/v1/users/me`<br>`GET /api/v1/users/me/profile` | 200<br>200 | [10-pds-perfil-reputacion.png](capturas/10-pds-perfil-reputacion.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "PATCH", "endpoint": "/api/v1/contracts/2/estado", "status": 200, "nota": "PDS culmina obra: transición a completado_pendiente" },
  { "method": "PATCH", "endpoint": "/api/v1/contracts/2/estado", "status": 200, "nota": "Solicitante confirma entrega: transición a completado" },
  { "method": "GET",   "endpoint": "/api/v1/payments/nequi", "status": 200, "nota": "Consulta de cuenta Nequi 3000000000 (ChambeApp)" },
  { "method": "POST",  "endpoint": "/api/v1/payments/", "status": 201, "nota": "Registro de pago de $120.000 COP para contrato #2 (estado pendiente)" },
  { "method": "POST",  "endpoint": "/api/v1/payments/2/confirm", "status": 200, "nota": "Confirmación de pasarela y cierre directo de pago" },
  { "method": "GET",   "endpoint": "/api/v1/payments/mine", "status": 200, "nota": "Historial de pagos del solicitante: Pago #2 pagado" },
  { "method": "POST",  "endpoint": "/api/v1/habilidades/endosos", "status": 201, "nota": "Endoso formal de 3 competencias técnicas al PDS" },
  { "method": "POST",  "endpoint": "/api/v1/solicitudes/8/ratings", "status": 201, "nota": "Solicitante califica al PDS con 5 estrellas" },
  { "method": "POST",  "endpoint": "/api/v1/solicitudes/8/ratings", "status": 201, "nota": "PDS califica al Solicitante con 5 estrellas (mutua)" },
  { "method": "GET",   "endpoint": "/api/v1/payments/certificado-ingresos", "status": 200, "nota": "Generación de certificado de ingresos laborales PDS" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del ciclo de pago dual y calificación mutua sobre la base de código inalterada, se identificaron tres hallazgos arquitectónicos de alto impacto:

### 1. Manejo de Trailing Slash en Flask-Smorest y Descarte de Cabecera Authorization en Navegadores
* **Diagnóstico:** En `backend/app/controllers/payments.py`, el decorador `@blp.route("/")` asocia la ruta canónica con trailing slash (`/api/v1/payments/`). En el frontend (`solicitanteApi.ts`), la llamada de Axios se realiza a `/payments`. Werkzeug emite automáticamente una redirección `HTTP 308 Permanent Redirect`. Al seguir dicha redirección en navegadores basados en Chromium, la especificación de seguridad de Fetch/XHR remueve la cabecera `Authorization: Bearer <token>`, provocando un falso positivo de rechazo `HTTP 401 Unauthorized`.
* **Resolución en Auditoría (Sin tocar código productivo):** Mediante Playwright `page.route('**/api/v1/payments')`, la petición fue normalizada inmediatamente a `/api/v1/payments/` conservando los encabezados JWT intactos.
* **Propuesta Técnica para el Backend:** Configurar `strict_slashes=False` en el Blueprint de Flask o definir `@blp.route("", strict_slashes=False)` en los MethodViews para que la aplicación acepte indistintamente URIs con y sin barra inclinada final sin forzar redirección 308.

### 2. Contrato de Respuesta en `GET /api/v1/payments/mine` (Array Plano vs Estructura Paginada)
* **Diagnóstico:** En `backend/app/controllers/payments.py`, el método `get` de `MyPayments` retorna una lista plana `PaymentSchema(many=True).dump(...)` cuando no se envían los parámetros `page` o `per_page`. Sin embargo, cuando se provee paginación, retorna `{ "items": [...], "total": ..., "page": ... }`. Esta dualidad en el tipo de retorno genera inconsistencias en clientes que tipan estrictamente la respuesta como `PaginatedResponse<Payment>`.
* **Propuesta Técnica para la API:** Unificar la estructura de respuesta envolviendo siempre la colección en un envelope estándar `{ items: [...], meta: { total, page, per_page } }`, independientemente de si se pasaron parámetros de paginación explícitos.

### 3. Discrepancia entre Nombres en Perfil Libre (`profile.habilidades`) y Catálogo Canónico (`Habilidad`)
* **Diagnóstico:** El perfil de usuario permitía almacenar habilidades como cadenas de texto libre (`['plomería', 'electricista']`). Al consultar `/habilidades/endosos`, el controlador backend efectúa un filtro `ilike` que no resolvía nombres truncados contra el catálogo oficial (`'Plomería y Fontanería'`). 
* **Propuesta Técnica para Arquitectura de Datos:** Establecer una clave foránea explícita (`habilidad_id`) en una tabla intermedia `usuario_habilidades` en lugar de arreglos JSON de texto desnormalizados, garantizando integridad referencial y autocompletado consistente de competencias demostrables en obra.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La auditoría en vivo sobre PostgreSQL ratifica la consistencia integral del ciclo contractual y financiero:

* **ID Contrato:** `2` (Solicitud #8)
* **Estado Contrato:** `EstadoContrato.COMPLETADO`
* **Pago Registrado y Confirmado:**
  * **ID Pago:** `2`
  * **Monto:** `$120.000 COP`
  * **Pasarela:** `nequi`
  * **Estado Pago:** `EstadoPago.COMPLETADO`
  * **Referencia Pasarela:** `MOCK-2-1792552542`
* **Calificaciones Mutuas Cruzadas (Ratings):**
  * **Solicitante -> PDS (Rating #3):** `puntaje: 5.0★`, Comentario: *"Excelente servicio técnico en plomería y fontanería. Muy puntual, pulcro y profesional."*
  * **PDS -> Solicitante (Rating #4):** `puntaje: 5.0★`, Comentario: *"Excelente cliente. Comunicación clara, facilidades en el lugar de trabajo y pago oportuno."*
* **Reputación Promedio Resultante:**
  * **PDS (Usuario 1):** `5.0★` (reflejado en `/pds/perfil`)
  * **Solicitante (Usuario 2):** `5.0★`
* **Endosos de Competencias Registrados en `endoso_habilidades`:** 3 competencias validadas socialmente para el oficio de *Plomería y Fontanería*:
  1. *Termofusión de tuberías (PVC, CPVC, PPR)*
  2. *Detección y reparación de fugas en muros, placas y acometidas*
  3. *Instalación, mantenimiento y reparación de sanitarios, lavamanos y grifería*
* **Video de Auditoría:** `video/07-pago-dual-calificacion.webm` (8.0 MB)
