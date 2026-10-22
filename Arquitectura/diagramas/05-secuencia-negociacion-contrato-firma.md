# Diagrama de Secuencia — Flujo 05: Negociación Bilateral de Ofertas y Firma Digital de Contrato

> **Módulo:** Negociación Contractual, Perfeccionamiento Jurídico y Firma Digital Manuscrita  
> **Fuentes de Código:** [`backend/app/controllers/ofertas.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/ofertas.py), [`backend/app/controllers/contracts.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/contracts.py), [`backend/app/models/contract.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/contract.py), [`frontend/src/features/contrato/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/contrato/)  
> **Historias de Usuario:** [HU-15](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-15-gestión-y-aceptación-de-ofertas-recibidas), [HU-16](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-16-formalización-de-contrato-digital), [HU-44](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-44-contraofertas-y-negociación-bilateral), [HU-45](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-45-firma-digital-en-pantalla-completa-con-evidencia-biométrica), [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-inicio-de-sesión).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor SOL as Solicitante (Contratante)
    actor PDS as PDS (Contratista)
    participant FE as Frontend React (SolicitudDetail / ContratoFirmarPage)
    participant API as Flask API Gateway (ofertas.py / contracts.py)
    participant DB as PostgreSQL 16 (ofertas, contracts, chambas, conversations)
    participant SIO as Socket.IO Hub (notificaciones en vivo)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: REVISIÓN DE OFERTAS Y CONTRAOFERTA/ACEPTACIÓN
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of SOL: SUBFLUJO A: Evaluación y Aceptación por Solicitante
    SOL->>FE: Accede a /solicitante/solicitudes/8
    FE->>API: GET /api/v1/solicitudes/8/ofertas
    API->>DB: SELECT * FROM ofertas WHERE solicitud_id = 8
    DB-->>API: Oferta #3 ($120.000 COP, PDS Carlos Pérez)
    API-->>FE: HTTP 200 OK [ofertas]
    FE-->>SOL: Tarjeta de propuesta con opciones "Aceptar" o "Contraofertar"
    SOL->>FE: Clic en "Aceptar propuesta"
    FE-->>SOL: Redirige a /contrato/firmar con cláusulas 1 a 8
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: PRIMERA FIRMA DIGITAL (SOLICITANTE)
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of SOL: SUBFLUJO B: Trazado y Creación de Contrato
    SOL->>FE: Digita Cédula ("1098765432") y dibuja firma en SignaturePad Canvas
    FE->>FE: Exporta firma a PNG Base64 y genera Hash SHA-256
    SOL->>FE: Clic en "Firmar y aceptar oferta"
    FE->>API: POST /api/v1/ofertas/3/responder {accion: "aceptar", firma: "data:image/png;base64,..."}
    API->>DB: UPDATE ofertas SET estado = 'aceptada' WHERE id = 3
    API->>DB: UPDATE ofertas SET estado = 'rechazada' WHERE solicitud_id = 8 AND id != 3
    API->>DB: UPDATE solicitudes SET presupuesto = 120000, estado = 'en_negociacion'
    API->>DB: INSERT INTO contracts (solicitud_id, oferta_id, solicitante_id, pds_id, monto, estado='pendiente', firma_solicitante)
    API->>DB: INSERT INTO conversations (solicitante_id, pds_id, solicitud_id)
    DB-->>API: commit() exitoso (contract_id = 1)
    API->>SIO: emit("contrato_por_firmar", {contract_id: 1}, room="user_pds")
    API-->>FE: HTTP 200 OK {contract_id: 1, estado: "pendiente"}
    FE-->>SOL: Mensaje de confirmación y redirección
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: CONTRAFIRMA DIGITAL (PDS)
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of PDS: SUBFLUJO C: Contrafirma y Perfeccionamiento Legal
    PDS->>FE: Accede a /pds/chambas -> panel "Mis chambas"
    FE->>API: GET /api/v1/contracts/mine
    API->>DB: SELECT * FROM contracts WHERE pds_id = ? AND estado = 'pendiente'
    DB-->>API: Contrato #1 (Por firmar)
    API-->>FE: HTTP 200 OK [{contract_id: 1, estado: "pendiente"}]
    FE-->>PDS: Muestra alerta amarilla con botón "Firmar contrato"
    PDS->>FE: Clic en "Firmar contrato" -> Carga /contrato/firmar?contract_id=1
    FE->>API: GET /api/v1/contracts/1
    API->>DB: SELECT * FROM contracts WHERE id = 1
    DB-->>API: Datos contractuales completos y firma del solicitante
    API-->>FE: HTTP 200 OK {contrato}
    PDS->>FE: Digita Cédula ("1020304050") y estampa firma manuscrita Canvas
    PDS->>FE: Clic en "Firmar y aceptar contrato"
    FE->>API: PATCH /api/v1/contracts/1/estado {estado: "aceptar", firma: "data:image/png;base64,..."}
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: ACTIVACIÓN DEL CICLO OPERATIVO
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of PDS: SUBFLUJO D: Creación de Entidad Operativa Chamba
    API->>DB: UPDATE contracts SET estado = 'en_progreso', firma_pds = ?, fecha_firma = NOW() WHERE id = 1
    API->>DB: UPDATE solicitudes SET estado = 'asignada' WHERE id = 8
    API->>DB: INSERT INTO chambas (contract_id, pds_id, solicitante_id, estado_hito='CREADO')
    DB-->>API: commit() exitoso (chamba_id generado)
    API->>SIO: emit("contrato_activo", {contract_id: 1, chamba_id: 1})
    API-->>FE: HTTP 200 OK {contract_id: 1, estado: "en_progreso"}
    FE-->>PDS: Toast verde "Contrato formalizado" y estado de chamba "En curso"
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Exclusión Mutua de Postulaciones Rival:** Cuando el solicitante acepta formalmente una oferta (`POST /api/v1/ofertas/<id>/responder` con `accion: 'aceptar'`), el sistema ejecuta una actualización transaccional en lote que pasa automáticamente el resto de ofertas de dicha solicitud a `'rechazada'`, liberando a los demás postulantes.
2. **Generación Automática del Canal de Chat:** Como parte de la aceptación de la oferta, se inicializa un canal privado de mensajería (`conversations`) entre el contratante y el contratista para coordinar detalles logísticos.
3. **Validez Legal de la Firma Digital (Ley 527 de 1999 Colombia):** El frontend captura el trazo vectorial en un elemento `<canvas>` exportado como imagen rasterizada en Base64 con metadatos asociados: cédula del firmante, timestamp UTC, dirección IP y aceptación expresa de las cláusulas contractuales 1 a 8.
4. **Instanciación de la Máquina de Estados Operativa:** El paso a `'en_progreso'` genera de forma síncrona el registro en la tabla `chambas`, habilitando el seguimiento por hitos operativos y desbloqueando las coordenadas exactas de la obra.
