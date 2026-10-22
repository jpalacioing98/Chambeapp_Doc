# Delimitación de Alcance y Justificación Técnica de Flujos de API (Flujos 15, 16 y 17)

> **Programa Académico:** Maestría en Ingeniería de Software / Arquitectura de Sistemas  
> **Documento:** Justificación de Alcance de Pruebas Automatizadas E2E (Fase 4)  
> **Proyecto:** ChambeApp — Plataforma de Servicios y Formalización Laboral  
> **Fecha:** 21 de Octubre de 2026  
> **Referencias:** [flujos-chambeapp.md](../flujos-chambeapp.md), [users.md](../../frontend/doc/users.md), [routes.tsx](../../frontend/src/app/routes.tsx), [Fase4_Consolidado_Evidencias_E2E.md](../auditoria/Fase4_Consolidado_Evidencias_E2E.md).

---

## 1. Declaración de Alcance de la Fase 4

En el marco de la auditoría de arquitectura de ChambeApp para la sustentación de maestría, la **Fase 4 (Testeo Automatizado End-to-End)** se estructuró con un alcance riguroso enfocado en los **14 flujos de usuario interactivos que poseen interfaz gráfica completa (Bloque A)**.

De los **17 flujos documentados en la arquitectura global** ([flujos-chambeapp.md](../flujos-chambeapp.md)), los flujos **15, 16 y 17** corresponden al **Bloque B (Servicios de Gobernanza y APIs de Infraestructura)**. El presente documento justifica formalmente por qué dichos flujos no forman parte de la suite de grabación visual de Playwright/Chromium en la Fase 4 y cómo su comportamiento técnico fue validado.

---

## 2. Criterios de Exclusión de Grabación Visual E2E

### Criterio 1: Ausencia Deliberada de Vistas en el Enrutador Frontend (`routes.tsx`)
La arquitectura del frontend de ChambeApp ([frontend/src/app/routes.tsx](../../frontend/src/app/routes.tsx)) fue diseñada para atender a los tres roles públicos principales:
1. **Solicitante / Empleador:** Namespace `/solicitante/*`
2. **PDS / Trabajador:** Namespace `/pds/*`
3. **Merchant / Comerciante:** Namespace `/negocio/*`

Para los roles internos del staff, la documentación oficial de roles y credenciales ([frontend/doc/users.md](../../frontend/doc/users.md)) establece de forma explícita:

```markdown
| Email | Contraseña | Rol | Módulo que abre |
|---|---|---|---|
| pds@chambeapp.com | `ChambeApp123!` | pds (trabajador) | `/pds` ✅ Implementado |
| solicitante@chambeapp.com | `ChambeApp123!` | solicitante (empleador) | `/solicitante` ✅ Implementado |
| merchant@chambeapp.com | `ChambeApp123!` | merchant (comerciante) | `/negocio` ✅ Implementado |
| verificador@chambeapp.com | `ChambeApp123!` | verificador | ❌ Sin UI (cae al landing `/`) |
| soporte@chambeapp.com | `ChambeApp123!` | soporte | ❌ Sin UI (cae al landing `/`) |
| admin@chambeapp.com | `ChambeApp123!` | admin | ❌ Sin UI (cae al landing `/`) |
| superadmin@chambeapp.com | `ChambeApp123!` | superadmin | ❌ Sin UI (cae al landing `/`) |
```

Dado que no existen componentes de vista ni pantallas montadas en React para estos roles internos, cualquier intento de forzar una prueba de navegación E2E simularía una interfaz ficticia, violando el principio metodológico: **"El código manda sobre la documentación. Cero modificaciones de código de la app"**.

---

## 3. Análisis Técnico Individual de los Flujos de Bloque B

### Flujo 15 — Evaluación de Competencias y Quizzes de Oficio
* **Naturaleza:** Servicio REST puro en `backend/app/controllers/habilidades.py`.
* **Endpoints Involucrados:** `GET /api/v1/habilidades/<oficio_id>/quiz` y `POST /api/v1/habilidades/<oficio_id>/quiz/responder`.
* **Motivo de Exclusión de Grabación:** El catálogo de habilidades y el banco de preguntas técnicas operan como un microservicio evaluador desacoplado. En el frontend no existe una ruta `/quizzes` o `/evaluacion`. Evaluarlo en un navegador requeriría inyectar componentes externos no contemplados en el diseño actual del cliente web.
* **Mecanismo de Verificación:** Fue verificado mediante pruebas unitarias/integración de backend y consultas directas en la base de datos PostgreSQL (`preguntas_quiz`, `intentos_quiz`, `certificaciones_oficio`).

### Flujo 16 — Moderación y Operación Regional (Admin)
* **Naturaleza:** Endpoints administrativos acotados a la región (`backend/app/controllers/admin.py`).
* **Endpoints Involucrados:** `POST /api/v1/admin/staff`, `POST /api/v1/admin/solicitudes/<id>/moderate`.
* **Motivo de Exclusión como Flujo Aislado:** **El núcleo funcional de este flujo fue integrado y auditado directamente en el Flujo 14:**
  1. Aprobación y verificación de documentos KYC (`POST /api/v1/kyc/documentos/1/verificar`) — *Ver Flujo 14, Paso 6*.
  2. Gestión y cierre de tickets de mesa de ayuda (`PATCH /api/v1/admin/tickets/3`) — *Ver Flujo 14, Paso 7*.
  3. Verificación de aislamiento regional (`_assert_contract_in_region` que bloquea con `HTTP 404` intentos de mediación fuera de la región) — *Ver Flujo 14, Paso 8*.
* Crear un flujo visual 16 separado duplicaría innecesariamente las evidencias ya registradas en `14-moderacion-soporte-superadmin`.

### Flujo 17 — Gobernanza Global y Configuración de Plataforma (Superadmin)
* **Naturaleza:** APIs del sistema y scripts de mantenimiento (`backend/app/controllers/superadmin.py`).
* **Endpoints Involucrados:** `POST /api/v1/superadmin/regions/reindex`, `POST /api/v1/superadmin/legal/tyc`.
* **Motivo de Exclusión como Flujo Aislado:** Al igual que el Flujo 16, **las capacidades operativas críticas de Superadmin fueron auditadas y grabadas en el Flujo 14:**
  1. Control y conmutación en caliente de Feature Flags (`PATCH /api/v1/superadmin/flags/ml_ranking_enabled`) — *Ver Flujo 14, Paso 9*.
  2. Consulta de parámetros globales de comisiones y límites (`GET /api/v1/superadmin/config`) — *Ver Flujo 14, Paso 9*.
  3. Extracción y verificación de pistas forenses inmutables (`GET /api/v1/superadmin/audit-logs`, RNF-AUD) — *Ver Flujo 14, Paso 10*.
* Los endpoints restantes (`regions/reindex` y `legal/tyc`) corresponden a tareas de mantenimiento batch e infraestructura de despliegue, no a experiencias de interacción de usuario final.

---

## 4. Matriz de Cobertura y Trazabilidad

| ID | Denominación del Flujo | Tipo de Flujo | Modalidad de Testeo en Fase 4 | Justificación Arquitectónica |
|:---:|:---|:---:|:---:|:---|
| **01 a 14** | Flujos de Usuario con UI (Bloque A) | Interactivo E2E | **Playwright Chromium + SwiftShader** (10 capturas + video `.webm` + script `.cjs` c/u) | Interfaces completas implementadas en React con navegación web real. |
| **15** | Quizzes de Oficio | Servicio API | Pruebas de integración REST / Backend | Servicio desacoplado sin pantalla dedicada en `routes.tsx`. |
| **16** | Moderación Admin Regional | Gobernanza Staff | **Auditado en Flujo 14** (`14-moderacion-soporte-superadmin`) | Núcleo probado en Flujo 14 (KYC, tickets, aislamiento regional). |
| **17** | Superadmin y Configuración | Infraestructura | **Auditado en Flujo 14** (`14-moderacion-soporte-superadmin`) | Núcleo probado en Flujo 14 (Feature Flags, Config, AuditLog). |

---

## 5. Conclusión para la Sustentación de Grado

La suite de 14 flujos automatizados de la **Fase 4** cubre el **100% de la superficie visual e interactiva de la aplicación**. 

Los flujos 15, 16 y 17 no representan un vacío de cobertura, sino una delimitación rigurosa de responsabilidades: los componentes visuales fueron grabados en su entorno natural de navegador, mientras que las capacidades de gobernanza y servicios de backend fueron validadas y encapsuladas de forma transversal en el expediente de evidencias de la plataforma.
