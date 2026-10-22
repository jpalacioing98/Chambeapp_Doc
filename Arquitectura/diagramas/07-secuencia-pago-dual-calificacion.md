# Diagrama de Secuencia — Flujo 07: Pago Dual Directo y Calificación Mutua

> **Módulo:** Liquidación Financiera, Pasarela de Pagos (Nequi/PSE), Endosos y Reputación Bilateral  
> **Fuentes de Código:** [`backend/app/controllers/payments.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/payments.py), [`backend/app/controllers/solicitudes.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/solicitudes.py), [`backend/app/controllers/habilidades.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/habilidades.py), [`frontend/src/features/contrato/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/contrato/)  
> **Historias de Usuario:** [HU-21](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-21-selección-de-método-de-pago-dual), [HU-22](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-22-liberación-de-fondos-en-custodia-escrow), [HU-23](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-23-confirmación-bilateral-de-pago-directo-en-efectivotransferencia), [HU-24](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-24-calificación-y-reseña-cruzada).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor PDS as PDS (Contratista)
    actor SOL as Solicitante (Contratante)
    participant FE as Frontend React (ContratoPage / PaymentsPanel / RatingModal)
    participant API as Flask API Gateway (payments.py / solicitudes.py)
    participant GW as Pasarela Mock / Webhook Nequi
    participant DB as PostgreSQL 16 (contracts, payments, ratings, habilidades, profiles)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: CULMINACIÓN BILATERAL DEL SERVICIO
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of PDS: SUBFLUJO A: Hito de Culminación y Confirmación
    PDS->>FE: Marca obra como terminada en /pds/chambas
    FE->>API: PATCH /api/v1/contracts/2/estado {estado: "completar"}
    API->>DB: UPDATE contracts SET estado = 'completado_pendiente' WHERE id = 2
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 200 OK {estado: "completado_pendiente"}
    SOL->>FE: Ingresa a /solicitante/contratos/2 y verifica satisfacción
    FE->>API: PATCH /api/v1/contracts/2/estado {estado: "confirmar"}
    API->>DB: UPDATE contracts SET estado = 'completado' WHERE id = 2
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 200 OK {estado: "completado"}
    FE-->>SOL: Habilita opciones de Pago Dual y Panel de Calificación
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: PROCESAMIENTO DE PAGO DUAL (PASARELA NEQUI)
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of SOL: SUBFLUJO B: Registro y Confirmación de Pago
    SOL->>FE: Clic en "Pagar con Nequi / PSE"
    FE->>API: GET /api/v1/payments/nequi
    API-->>FE: HTTP 200 OK {telefono_cuenta: "3000000000", convenio: "ChambeApp"}
    SOL->>FE: Confirma transacción por $120.000 COP
    FE->>API: POST /api/v1/payments/ {contract_id: 2, monto: 120000, metodo: "nequi"}
    API->>DB: INSERT INTO payments (contract_id, user_id, monto, metodo, estado='pendiente')
    DB-->>API: payment_id = 2 generado
    API-->>FE: HTTP 201 Created {payment_id: 2, estado: "pendiente"}
    FE->>GW: Ejecuta redirección o confirmación mock
    GW-->>FE: Transacción aprobada (referencia "MOCK-2-1792552542")
    FE->>API: POST /api/v1/payments/2/confirm {referencia: "MOCK-2-1792552542"}
    API->>DB: UPDATE payments SET estado='completado', referencia=? WHERE id = 2
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {estado: "completado"}
    FE-->>SOL: Toast verde "Pago acreditado" y estado "Pagado"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: ENDOSO DE COMPETENCIAS Y CALIFICACIÓN CRUZADA
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of SOL: SUBFLUJO C: Endoso de Habilidades y Reputación 360°
    SOL->>FE: Selecciona habilidades observadas ("Termofusión", "Fugas") y 5 estrellas
    FE->>API: POST /api/v1/habilidades/endosos {pds_id: 1, habilidades: ["Termofusión", "Fugas"]}
    API->>DB: INSERT INTO habilidades_endosos ...
    API-->>FE: HTTP 201 Created
    FE->>API: POST /api/v1/solicitudes/8/ratings {calificado_id: 1, puntaje: 5, comentario: "Impecable trabajo"}
    API->>DB: INSERT INTO ratings (solicitud_id, calificador_id, calificado_id, puntaje=5)
    API->>API: _recalcular_promedio(calificado_id=1)
    API->>DB: UPDATE profiles SET calificacion_promedio = 5.0 WHERE user_id = 1
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: RECIPROCIDAD Y CERTIFICACIÓN TRIBUTARIA
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of PDS: SUBFLUJO D: Calificación al Cliente y Certificado Laboral
    PDS->>FE: Ingresa y califica al Solicitante con 5 estrellas
    FE->>API: POST /api/v1/solicitudes/8/ratings {calificado_id: 2, puntaje: 5, comentario: "Excelente pagador"}
    API->>DB: INSERT INTO ratings ... y recalcula promedio del solicitante
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created
    PDS->>FE: Solicita Certificado de Ingresos en /pds/billetera
    FE->>API: GET /api/v1/payments/certificado-ingresos
    API->>DB: SELECT SUM(monto) FROM payments WHERE pds_id = ? AND estado = 'completado'
    DB-->>API: Total acumulado verificado
    API-->>FE: HTTP 200 OK {pds_nombre, rut_nit, total_devengado, desglose_contratos}
    FE-->>PDS: Renderiza reporte descargable para formalización laboral
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Doble Aprobación de Término de Servicio:** El contrato no permite emitir cobros ni liberar fondos hasta que ocurran dos transiciones sucesivas: primero el PDS invoca `{ estado: 'completar' }` pasando a `completado_pendiente`; luego el contratante invoca `{ estado: 'confirmar' }` pasando a `completado`.
2. **Modelo de Pago Dual Desacoplado:** El contratante puede liquidar en efectivo mano a mano o emplear la pasarela digital (Nequi/PSE). Al optar por la pasarela, el backend genera un registro en `payments` con estado inicial `pendiente` y garantiza idempotencia mediante la referencia externa única (`MOCK-2-1792552542`).
3. **Cálculo Incremental de Reputación (`_recalcular_promedio`):** Cada vez que se emite una calificación bilateral (`ratings`), la función `_recalcular_promedio` consulta el histórico completo de puntuaciones recibidas por el usuario y actualiza `Profile.calificacion_promedio` de forma inmediata.
4. **Formalización Laboral e Inclusión Financiera:** El endpoint `GET /api/v1/payments/certificado-ingresos` compila los ingresos percibidos dentro de la plataforma, sirviendo como soporte formal verificable para entidades bancarias y de seguridad social en Colombia.
