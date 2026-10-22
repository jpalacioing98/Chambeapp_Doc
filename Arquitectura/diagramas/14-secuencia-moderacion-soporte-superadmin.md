# Diagrama de Secuencia — Flujo 14: Moderación, Soporte y Auditoría Superadmin

> **Módulo:** Gobernanza Multi-Rol, Fronteras Regionales, Arbitraje de Disputas, Feature Flags y Auditoría Forense  
> **Fuentes de Código:** [`backend/app/controllers/admin.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/admin.py), [`backend/app/controllers/superadmin.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/superadmin.py), [`backend/app/controllers/disputes.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/disputes.py), [`backend/app/models/audit.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/audit.py), [`frontend/src/features/disputas/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/disputas/)  
> **Historias de Usuario y Requerimientos:** [RF-73](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Verificación KYC), [RF-74](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Resolución de Disputas), [RF-75](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Mesa de Ayuda), [RF-76](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Aislamiento Regional), [RNF-AUD](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Pistas Inmutables de Auditoría), [RNF-CFG](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/Requerimientos.md) (Feature Flags en Caliente).

---

## 1. Diagrama de Secuencia (Mermaid e Imagen Renderizada)

![Diagrama de Secuencia Flujo 14](png/14-secuencia-moderacion-soporte-superadmin.png)

```mermaid
sequenceDiagram
    autonumber
    actor SOL as Solicitante
    actor PDS as PDS
    actor ADM as Admin Regional (Región 1)
    actor SUP as Superadmin (Universal)
    participant FE as Frontend React (DisputasHub / AdminConsole)
    participant API as Flask API Gateway (admin.py / superadmin.py / disputes.py)
    participant REG as Enforcer Regional (region_scope_id)
    participant DB as PostgreSQL 16 (disputes, tickets, kyc_docs, feature_flags, audit_logs)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: RADICACIÓN DE DISPUTA Y TICKET DE SOPORTE
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of SOL: SUBFLUJO A: Radicación de Controversia y Asistencia
    SOL->>FE: En /solicitante/disputas abre modal "Nueva disputa" para Contrato #1
    FE->>API: POST /api/v1/contracts/1/disputes {motivo: "calidad_insatisfactoria", monto: 25, descripcion: "..."}
    API->>DB: INSERT INTO disputes (contract_id=1, demandante_id=?, motivo, estado='abierta')
    DB-->>API: commit() exitoso (dispute_id = 2)
    API-->>FE: HTTP 201 Created {dispute_id: 2, estado: "abierta"}
    PDS->>API: POST /api/v1/tickets/ {categoria: "formalizacion", mensaje: "Consulta aportes Decreto 1273"}
    API->>DB: INSERT INTO tickets (user_id=pds_id, estado='open', prioridad='normal')
    DB-->>API: ticket_id = 3 generado
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: OPERACIÓN REGIONAL Y BARRERA DE AISLAMIENTO
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of ADM: SUBFLUJO B: Mesa Regional y Control de Fronteras (RF-76)
    ADM->>API: GET /api/v1/admin/stats/overview (Bearer JWT Admin Región 1)
    API->>REG: region_scope_id() -> 1
    API->>DB: SELECT * FROM stats WHERE region_id = 1
    DB-->>API: Métricas exclusivas de la Región 1
    API-->>ADM: HTTP 200 OK {kpis_region_1}
    ADM->>API: PATCH /api/v1/admin/tickets/3 {estado: "closed"}
    API->>DB: UPDATE tickets SET estado = 'closed' WHERE id = 3
    DB-->>API: commit()
    ADM->>API: GET /api/v1/admin/disputes/2 (Disputa perteneciente a Región 2)
    API->>REG: Compara contract.region_id (2) vs admin.region_id (1)
    REG-->>API: Conflicto de Frontera Regional
    API-->>ADM: HTTP 404 Recurso no encontrado en tu región
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: ARBITRAJE SUPERADMIN CON ALCANCE UNIVERSAL
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of SUP: SUBFLUJO C: Laudo Arbitral y Conciliación
    SUP->>API: POST /api/v1/admin/disputes/2/resolve {resolucion: "acuerdo_mutuo", ajuste_porcentaje: 85}
    API->>REG: region_scope_id() -> None (Superadmin Universal)
    API->>DB: UPDATE disputes SET estado='resuelta', laudo='...', resuelto_por=sup_id WHERE id = 2
    API->>DB: UPDATE contracts SET estado='conciliado' WHERE id = 1
    API->>DB: INSERT INTO audit_logs (actor_id=sup_id, accion='RESOLVER_DISPUTA', entidad='disputes', entidad_id=2)
    DB-->>API: commit() transaccional
    API-->>SUP: HTTP 200 OK {estado: "resuelta", laudo: "..."}
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: FEATURE FLAGS EN CALIENTE Y AUDITORÍA INMUTABLE
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of SUP: SUBFLUJO D: Conmutación en Tiempo Real y Logs Forenses
    SUP->>API: GET /api/v1/superadmin/flags
    API->>DB: SELECT * FROM feature_flags
    DB-->>API: Catálogo de 9 Feature Flags
    API-->>SUP: HTTP 200 OK [flags]
    SUP->>API: PATCH /api/v1/superadmin/flags/ml_ranking_enabled {habilitado: true}
    API->>DB: UPDATE feature_flags SET habilitado = true, updated_at=NOW() WHERE key = 'ml_ranking_enabled'
    API->>DB: INSERT INTO audit_logs (actor_id=sup_id, accion='UPDATE_FLAG', payload_diff='{old: false, new: true}')
    DB-->>API: commit()
    API-->>SUP: HTTP 200 OK {key: "ml_ranking_enabled", habilitado: true}
    SUP->>API: GET /api/v1/superadmin/audit-logs?limit=5
    API->>DB: SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5
    DB-->>API: Pistas inmutables (timestamp, actor, ip, accion, diff)
    API-->>SUP: HTTP 200 OK [audit_records]
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Segregación Estricta de Fronteras Regionales (RF-76):** El decorador de seguridad y la función `region_scope_id()` extraen la jurisdicción del administrador desde su identidad JWT. Si un operador regional intenta leer o alterar disputas o contratos fuera de su territorio, el sistema retorna `HTTP 404 Recurso no encontrado en tu región`, impidiendo fuga de datos sensibles entre departamentos.
2. **Autoridad Universal del Superadministrador:** El rol `superadmin` posee `scope = None`, otorgándole atribuciones de mediación universal, conmutación de políticas globales de plataforma y resolución de controversias escaladas.
3. **Conmutación de Funcionalidades en Caliente (RNF-CFG):** Los algoritmos de inteligencia artificial (como `ml_ranking_enabled`) se gobiernan mediante la tabla `feature_flags`. Esto permite activar o desactivar modelos predictivos en tiempo de ejecución sin redeploy ni reinicio de contenedores Docker.
4. **Pistas Inmutables de Auditoría Forense (RNF-AUD):** Cada mutación administrativa (aprobación KYC, laudo de disputa, cambio de bandera o parámetro económico) inserta de forma inmutable un registro en `audit_logs` que documenta el `actor_id`, `ip_address`, `timestamp_utc`, la entidad afectada y el `snapshot_diff` antes y después de la operación.
