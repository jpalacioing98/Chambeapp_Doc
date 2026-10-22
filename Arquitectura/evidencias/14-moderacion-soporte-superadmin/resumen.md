# Resumen de Ejecución — Flujo 14: Moderación, Soporte y Auditoría Superadmin

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, monitor de tráfico REST/WS y preservación de estado JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario y Requerimientos Cubiertos:** [RF-73](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Verificación KYC documental por roles), [RF-74](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Mediación y resolución de controversias contractuales), [RF-75](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Gestión de tickets de mesa de ayuda y soporte técnico), [RF-76](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (División y alcance regional administrativo), [RNF-AUD](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Pistas inmutables de auditoría forense con actor, IP y snapshot diff), [RNF-CFG](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Gobernanza dinámica de Feature Flags y configuración del sistema).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente / Empleador)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Acceso al Hub de Disputas (`/solicitante/disputas`), apertura del modal de controversia, radicación formal de disputa contractual sobre el Contrato #1 | `/solicitante/disputas` |
| **Prestador de Servicios (PDS / Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Consulta de canales de soporte y emisión de ticket de asistencia técnica (`POST /tickets/`) sobre formalización laboral | `/pds` |
| **Administrador Regional (Admin)** | `admin@chambeapp.com` | `********` *(users.md)* | Consulta de métricas y KPIs de gobernanza (`/admin/stats/overview`), verificación y aprobación documental KYC (`POST /kyc/documentos/1/verificar`), atención y cierre de ticket de soporte (`PATCH /admin/tickets/3`), verificación del límite de alcance regional | `/admin` (API + Overlay) |
| **Superadministrador (Superadmin)** | `superadmin@chambeapp.com` | `********` *(users.md)* | Escalación y resolución formal de disputa con alcance universal (`POST /admin/disputes/2/resolve`), conmutación de Feature Flags (`PATCH /superadmin/flags/ml_ranking_enabled`), auditoría de parámetros globales y consulta de pistas forenses (`GET /superadmin/audit-logs`) | `/superadmin` (API + Overlay) |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/solicitante/disputas` | Solicitante inicia sesión y accede al Centro de Disputas; el layout carga encabezado, tabs (`Todas`, `Abiertas`, `En revisión`, `Resueltas`) y tarjetas de métricas | `POST /api/v1/auth/login`<br>`GET /api/v1/my-disputes`<br>`GET /api/v1/contracts/mine` | 200<br>200<br>200 | [01-solicitante-centro-disputas-hub.png](capturas/01-solicitante-centro-disputas-hub.png) |
| **02** | `/solicitante/disputas` | Solicitante presiona *"Nueva disputa"*; el modal despliega selección de contrato (#1), motivo (*Calidad del trabajo insatisfactoria*), monto (25%), descripción detallada y declaración bajo juramento | *(Renderizado de modal React)* | — | [02-solicitante-modal-nueva-disputa-contrato.png](capturas/02-solicitante-modal-nueva-disputa-contrato.png) |
| **03** | `/solicitante/disputas` | Solicitante confirma la apertura; el backend radica la controversia con estado `"abierta"` y la vista renderiza la tarjeta `DisputeCard` activa en el feed | `POST /api/v1/contracts/1/disputes`<br>`GET /api/v1/my-disputes` | **201**<br>200 | [03-solicitante-disputa-radicada-activa.png](capturas/03-solicitante-disputa-radicada-activa.png) |
| **04** | `/login`<br>`/pds` | PDS inicia sesión y radica ticket de soporte técnico solicitando guía sobre formalización laboral y aportes en salud según Decreto 1273 | `POST /api/v1/auth/login`<br>`POST /api/v1/tickets/` | 200<br>**201** | [04-pds-radicacion-ticket-soporte-tecnico.png](capturas/04-pds-radicacion-ticket-soporte-tecnico.png) |
| **05** | `/login`<br>Consola Admin | Admin Demo inicia sesión y audita las métricas globales de gobernanza (usuarios activos, contratos, volumen transaccionado y disputas abiertas) | `POST /api/v1/auth/login`<br>`GET /api/v1/admin/stats/overview` | 200<br>**200** | [05-admin-login-dashboard-kpis-metricas.png](capturas/05-admin-login-dashboard-kpis-metricas.png) |
| **06** | Consola Admin | Admin consulta la cola documental KYC pendiente (`GET /kyc/pendientes`) y aprueba oficialmente la cédula de ciudadanía del PDS (`doc_identidad`) | `GET /api/v1/kyc/pendientes`<br>`POST /api/v1/kyc/documentos/1/verificar` | 200<br>**200** | [06-admin-moderacion-kyc-aprobacion.png](capturas/06-admin-moderacion-kyc-aprobacion.png) |
| **07** | Consola Admin | Admin consulta la cola de mesa de ayuda (`GET /admin/tickets`) y actualiza el ticket de soporte del PDS a estado `closed` con prioridad normal | `GET /api/v1/admin/tickets`<br>`PATCH /api/v1/admin/tickets/3` | 200<br>**200** | [07-admin-gestion-resolucion-tickets-soporte.png](capturas/07-admin-gestion-resolucion-tickets-soporte.png) |
| **08** | Consola Admin | Demostración del aislamiento regional (admin regional bloqueado con 404 al intentar mediar fuera de su región) y resolución formal escalada por Superadmin con dictamen conciliatorio | `GET /api/v1/admin/disputes/2` (404)<br>`POST /api/v1/auth/login`<br>`POST /api/v1/admin/disputes/2/resolve` | 404<br>200<br>**200** | [08-admin-mediacion-resolucion-disputa.png](capturas/08-admin-mediacion-resolucion-disputa.png) |
| **09** | Consola Superadmin | Superadmin consulta catálogo de Feature Flags (`GET /superadmin/flags`), conmuta el flag de IA `ml_ranking_enabled` a `true` y audita la configuración global tipada | `GET /api/v1/superadmin/flags`<br>`PATCH /api/v1/superadmin/flags/ml_ranking_enabled`<br>`GET /api/v1/superadmin/config` | 200<br>**200**<br>200 | [09-superadmin-control-feature-flags-config.png](capturas/09-superadmin-control-feature-flags-config.png) |
| **10** | Consola Superadmin | Superadmin audita las pistas inmutables de auditoría forense (`GET /superadmin/audit-logs`), certificando la trazabilidad de cada acción administrativa con actor, IP, timestamp y snapshot diff | `GET /api/v1/superadmin/audit-logs?limit=5` | **200** | [10-superadmin-pistas-auditoria-inmutables.png](capturas/10-superadmin-pistas-auditoria-inmutables.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

Durante la sesión se registraron **49 peticiones HTTP** hacia la API REST de ChambeApp, auditando las operaciones de clientes, administradores regionales y superadministrador:

```json
[
  { "method": "POST",  "endpoint": "/api/v1/contracts/1/disputes", "status": 201, "nota": "Radicación formal de disputa contractual sobre Contrato #1" },
  { "method": "POST",  "endpoint": "/api/v1/tickets/", "status": 201, "nota": "Emisión de ticket de asistencia técnica por el prestador PDS" },
  { "method": "GET",   "endpoint": "/api/v1/admin/stats/overview", "status": 200, "nota": "Carga de KPIs analíticos de control y gobernanza administrativa" },
  { "method": "GET",   "endpoint": "/api/v1/kyc/pendientes", "status": 200, "nota": "Consulta de expedientes KYC documentales pendientes de validación" },
  { "method": "POST",  "endpoint": "/api/v1/kyc/documentos/1/verificar", "status": 200, "nota": "Aprobación oficial de cédula con recálculo de Profile.verificado" },
  { "method": "GET",   "endpoint": "/api/v1/admin/tickets", "status": 200, "nota": "Consulta de cola de mesa de ayuda regional" },
  { "method": "PATCH", "endpoint": "/api/v1/admin/tickets/3", "status": 200, "nota": "Cierre de ticket de soporte con registro de trazabilidad" },
  { "method": "GET",   "endpoint": "/api/v1/admin/disputes/2", "status": 404, "nota": "Verificación de frontera regional (admin región 1 bloqueado sobre región 2)" },
  { "method": "POST",  "endpoint": "/api/v1/admin/disputes/2/resolve", "status": 200, "nota": "Laudo arbitral emitido por Superadmin (alcance universal)" },
  { "method": "GET",   "endpoint": "/api/v1/superadmin/flags", "status": 200, "nota": "Inspección de catálogo de 9 feature flags del sistema" },
  { "method": "PATCH", "endpoint": "/api/v1/superadmin/flags/ml_ranking_enabled", "status": 200, "nota": "Activación en caliente del algoritmo de ranking ML" },
  { "method": "GET",   "endpoint": "/api/v1/superadmin/config", "status": 200, "nota": "Consulta de parámetros globales de comisiones y límites" },
  { "method": "GET",   "endpoint": "/api/v1/superadmin/audit-logs", "status": 200, "nota": "Extracción de pistas de auditoría forense inmutable" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del subsistema de moderación, soporte, gobierno multi-región y auditoría forense, se consolidaron los siguientes hallazgos de arquitectura:

### 1. Modelo de División Regional y Control de Acceso RBAC Scoped
* **Diagnóstico:** En plataformas descentralizadas de servicios presenciales con operación en múltiples ciudades (Medellín, Valledupar, etc.), permitir que un administrador local altere contratos o disputas de otra región introduce riesgos de doble conteo, corrupción de métricas e interferencia operativa.
* **Solución Arquitectónica ChambeApp:** El módulo `backend/app/auth/region.py` implementa `region_scope_id(user)`. Si el actor tiene un rol administrativo local (`admin`, `soporte`, `verificador`), su alcance queda rígidamente confinado a su `region_id`. Si intenta acceder a un recurso cuyo solicitante pertenece a otra región (`_assert_contract_in_region`), el backend responde inmediatamente con `HTTP 404 Recurso no encontrado en tu región`. Si el actor es `superadmin`, `region_scope_id` retorna `None`, permitiendo la escalación y resolución de controversias interregionales.
* **Aporte para la Tesis de Maestría:** Se documenta el patrón *Regional Partitioning & Hierarchical Escalation*, donde los límites geográficos se imponen a nivel de capa de servicio y consultas SQL (`Contract.solicitante_id.in_(_region_user_ids(scope))`), garantizando soberanía operativa local con capacidad de laudo superior.

### 2. Pistas de Auditoría Forense Inmutable (`RNF-AUD` y `write_audit`)
* **Diagnóstico:** Las acciones de moderación (suspensión de usuarios, resolución de disputas monetarias, alteración de feature flags) requieren garantías estrictas de no repudio. Modificar registros sin guardar el estado previo impide auditorías forenses posteriores.
* **Solución Arquitectónica ChambeApp:** La tabla `audit_logs` y la función `write_audit()` en `backend/app/models/audit.py` registran de forma obligatoria y transaccional:
  1. `actor_id`: Identificador del usuario autenticado que ejecutó la acción.
  2. `action`: Nombre calificado de la acción (`dispute.resolve`, `superadmin.flag.toggle`, `ticket.update`).
  3. `entity_type` y `entity_id`: Recurso afectado.
  4. `before_json` y `after_json`: Serialización JSON del diferencial (snapshot exacto antes y después del cambio).
  5. `ip`: Dirección de red del cliente (`request.remote_addr`).
  6. `created_at`: Marca de tiempo UTC inmutable.
* **Aporte para la Tesis:** Implementación del patrón *Event Ledger Audit Trail*, asegurando que ningún cambio de estado crítico pueda ocurrir sin dejar huella verificable en la base de datos.

### 3. Mediación y Arbitraje de Fondos en Custodia (Escrow)
* **Diagnóstico:** En disputas sobre servicios físicos (plomería, electricidad), las quejas por calidad no deben resultar en la retención indefinida de fondos o cancelaciones unilaterales que perjudiquen desproporcionadamente al trabajador o al empleador.
* **Solución Arquitectónica ChambeApp:** El tribunal administrativo emite laudos conciliatorios con compromisos de garantía (`resolution: "Acuerdo conciliatorio: Se aprueba garantía de ajuste técnico sin costo por el PDS en 48h"`). Al resolver la disputa, se actualiza el estado a `resuelta` en base de datos y se registra al moderador en `resolved_by`, permitiendo que el contrato continúe su ciclo hasta el desembolso final.
* **Propuesta Técnica para el Backend:** Integrar un mecanismo de *Split Payment* arbitral, permitiendo que el moderador ordene devoluciones parciales porcentuales automatizadas (e.g. 70% liberado al PDS por materiales y 30% reembolsado al Solicitante por demoras).

### 4. Gobernanza Dinámica vía Feature Flags sin Redespliegue
* **Diagnóstico:** Desplegar una nueva versión de código cada vez que se requiere encender o apagar un módulo experimental (como ranking de machine learning o cobertura en una nueva ciudad) incrementa los tiempos de inactividad y los riesgos de regresión.
* **Solución Arquitectónica ChambeApp:** La tabla `feature_flags` y el endpoint `PATCH /api/v1/superadmin/flags/<key>` permiten la conmutación en caliente en milisegundos (`ml_ranking_enabled = True`). Cada toggle queda inmediatamente reflejado en base de datos y respaldado en la pista de auditoría forense con actor y timestamp.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La auditoría directa en la base de datos PostgreSQL (`chambeapp_db_dev`) certifica el éxito integral del subsistema de moderación, soporte y superadministración:

### Tabla `disputes` (Controversias Contractuales)
* **Total Disputas Registradas:** 2
* **Disputa ID #1:** Contrato #1 | Estado: **`resuelta`** | Dictamen: *"Acuerdo conciliatorio: Se aprueba garantía de ajuste técnico..."* | Resuelto por: User #7 (Superadmin)
* **Disputa ID #2:** Contrato #1 | Estado: **`resuelta`** | Dictamen: *"Acuerdo conciliatorio: Se aprueba garantía de ajuste técnico sin costo por el PDS en 48h..."* | Resuelto por: User #7 (Superadmin)
* **Disputas Abiertas:** **0** (100% de controversias mediadas y resueltas)

### Tabla `tickets` (Mesa de Ayuda y Soporte)
* **Total Tickets Registrados:** 3
* **Ticket ID #3:** Asunto: *"Consulta sobre validación de certificado laboral e ingresos"* | Emisor: User #1 (PDS) | Estado: **`closed`** (Cerrado por Admin)

### Tabla `documentos_usuario` (KYC Documental)
* **Documento ID #1:** Usuario: User #1 (PDS) | Tipo: `doc_identidad` | Estado: **`aprobado`** | Revisor: User #6 (Admin Demo) | Nota: *"Cédula de ciudadanía validada contra base oficial y biometría conforme."*

### Tabla `audit_logs` (Pistas Forenses Inmutables)
* **Total Pistas Registradas:** **6 registros forenses**
  1. `ticket.update` (Ticket #2 | Actor: User #6)
  2. `dispute.resolve` (Dispute #1 | Actor: User #7)
  3. `superadmin.flag.toggle` (Feature Flag #5 | Actor: User #7)
  4. `ticket.update` (Ticket #3 | Actor: User #6)
  5. `dispute.resolve` (Dispute #2 | Actor: User #7)
  6. `superadmin.flag.toggle` (Feature Flag #5 | Actor: User #7)

### Tabla `feature_flags` (Conmutación en Caliente)
* **Flag `ml_ranking_enabled`:** **`True`** (activado en vivo por Superadmin)

* **Video de Auditoría:** `video/14-moderacion-soporte-superadmin.webm` (9.36 MB)
