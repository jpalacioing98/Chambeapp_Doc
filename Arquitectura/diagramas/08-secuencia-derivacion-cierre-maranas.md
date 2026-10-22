# Diagrama de Secuencia — Flujo 08: Derivación y Cierre Ágil de Marañas (Rebusques)

> **Módulo:** Micro-trabajos Barriales (Marañas), Derivación de Adendas y Ciclo Ágil sin Burocracia  
> **Fuentes de Código:** [`backend/app/controllers/maranas.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/maranas.py), [`backend/app/controllers/chambas.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/chambas.py), [`backend/app/models/marana.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/marana.py), [`frontend/src/features/maranas/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/maranas/)  
> **Historias de Usuario:** [HU-53](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-53-publicación-ágil-de-marañas-o-rebusques), [HU-54](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-54-postulación-rápida-y-cierre-directo-de-marañas).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor SOL as Solicitante (Dueño de Obra)
    actor PDS2 as PDS Especialista (Electricista)
    participant FE as Frontend React (ChambaExpediente / MaranasFeed / Modals)
    participant API as Flask API Gateway (chambas.py / maranas.py)
    participant DB as PostgreSQL 16 (chambas, adendas, maranas, ofertas_marana)
    participant SIO as Socket.IO Hub (notificaciones barriales)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: DERIVACIÓN DE ADENDA A MARAÑA
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of SOL: SUBFLUJO A: Derivación Ágil desde Obra Madre
    SOL->>FE: En /solicitante/chambas/1 abre adenda no cubierta y pulsa "Lanzar maraña"
    FE-->>SOL: Despliega MaranaCrearModal precargado con contexto de la chamba
    SOL->>FE: Confirma: "Reconexión eléctrica de calentador", $35.000 COP, categoría "Electricidad"
    FE->>API: POST /api/v1/chambas/1/marana {titulo: "...", presupuesto: 35000, categoria: "electricidad"}
    API->>DB: UPDATE adendas SET derivada = true WHERE chamba_id = 1
    API->>DB: INSERT INTO maranas (chamba_origen_id=1, solicitante_id=?, titulo, presupuesto, estado='publicado')
    DB-->>API: commit() exitoso (marana_id = 1)
    API->>SIO: emit("nueva_marana_barrial", {marana_id: 1, categoria: "electricidad"})
    API-->>FE: HTTP 201 Created {marana_id: 1, estado: "publicado"}
    FE-->>SOL: Badge "Maraña Derivada" y redirección a /solicitante/maranas
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: POSTULACIÓN RÁPIDA (PDS ESPECIALISTA)
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of PDS2: SUBFLUJO B: Exploración y Postulación Inmediata
    PDS2->>FE: Accede a /pds/maranas (pestaña "Disponibles")
    FE->>API: GET /api/v1/maranas/?estado=publicado
    API->>DB: SELECT * FROM maranas WHERE estado = 'publicado'
    DB-->>API: Lista de oportunidades locales
    API-->>FE: HTTP 200 OK [maranas]
    PDS2->>FE: Abre MaranaPostularModal e ingresa oferta de $35.000 COP
    FE->>API: POST /api/v1/maranas/1/ofertas {monto: 35000, mensaje: "Disponible ya con tester y pinza"}
    API->>DB: INSERT INTO ofertas_marana (marana_id, pds_id, monto, estado='pendiente')
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created
    FE-->>PDS2: Toast "Postulación enviada"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: ADJUDICACIÓN DIRECTA SIN BUROCRACIA
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of SOL: SUBFLUJO C: Adjudicación Inmediata (Sin Firma Contractual)
    SOL->>FE: Accede a /solicitante/maranas/1 -> lista de ofertas recibidas
    FE->>API: GET /api/v1/maranas/1/ofertas
    API-->>FE: HTTP 200 OK [ofertas]
    SOL->>FE: Clic en "Aceptar y asignar"
    FE->>API: POST /api/v1/maranas/1/responder?oferta_id=1 {accion: "aceptar"}
    API->>DB: UPDATE maranas SET estado='asignado', pds_id=PDS2_id WHERE id = 1
    API->>DB: UPDATE ofertas_marana SET estado='aceptada' WHERE id = 1
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {estado: "asignado"}
    FE-->>SOL: Vista de seguimiento operativa activada
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: CULMINACIÓN Y PAGO DIRECTO DUAL
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of PDS2: SUBFLUJO D: Ejecución Exprés y Cierre Bilateral
    PDS2->>FE: Ejecuta la labor técnica y presiona "Completar trabajo"
    FE->>API: PATCH /api/v1/maranas/1/estado {estado: "completado"}
    API->>DB: UPDATE maranas SET estado = 'completado' WHERE id = 1
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK
    PDS2->>FE: Check-in de cobro en efectivo mano a mano ($35.000)
    FE->>API: POST /api/v1/maranas/1/pago {rol: "pds", confirmado: true}
    API->>DB: UPDATE maranas SET pds_pago_confirmado = true
    SOL->>FE: Solicitante valida reconexión y confirma entrega del dinero
    FE->>API: POST /api/v1/maranas/1/pago {rol: "solicitante", confirmado: true}
    API->>DB: UPDATE maranas SET solicitante_pago_confirmado=true, estado='pagado'
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {estado: "pagado"}
    FE-->>SOL: Badge verde "Pagada" y expediente cerrado exitosamente
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Derivación y Prevención de Doble Imputación:** Al derivar una tarea imprevista desde el expediente maestro de una chamba (`POST /api/v1/chambas/<id>/marana`), el backend marca `adendas.derivada = True` y descuenta su valor de la orden principal, evitando que el contratante pague dos veces por el mismo alcance.
2. **Ciclo Ágil de 3 Estados (vs FSM Formal de 6 Hitos):** A diferencia de las contrataciones formales de obra, las marañas prescinden de la firma manuscrita Canvas, reduciendo la fricción a tres estados canónicos: `publicado` -> `asignado` -> `completado` -> `pagado`.
3. **Micro-arbitraje Local y Notificación Barrial:** Mediante Socket.IO, la publicación de una maraña emite un broadcast a los prestadores con cobertura activa en la comuna correspondiente, posibilitando respuestas en menos de 15 minutos.
4. **Doble Confirmación Simplificada:** El pago en efectivo requiere que ambos participantes marquen su check-in en el modal `MaranaPago`; tras completarse, la maraña queda blindada en la base de datos contra reclamaciones extemporáneas.
