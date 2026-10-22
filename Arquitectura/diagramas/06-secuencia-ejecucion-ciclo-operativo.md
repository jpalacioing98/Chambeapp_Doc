# Diagrama de Secuencia — Flujo 06: Ejecución y Ciclo Operativo de la Chamba (6 Hitos)

> **Módulo:** Ciclo de Vida Operativo, Geocercas en Terreno, Bitácora y Validación de Habilidades  
> **Fuentes de Código:** [`backend/app/controllers/chambas.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/chambas.py), [`backend/app/models/chamba.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/chamba.py), [`backend/app/services/geofence.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/services/geofence.py), [`frontend/src/features/chambas/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/chambas/)  
> **Historias de Usuario:** [HU-17](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-17-iniciar-obra-con-validación-gps), [HU-18](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-18-registro-de-evidencias-fotográficas-y-entorno-360), [HU-19](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-19-adendas-al-contrato-en-ejecución), [HU-20](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-20-reporte-de-novedades-e-incidencias), [HU-21](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-21-validación-de-habilidades-demostradas-en-obra), [HU-22](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-22-cierre-y-liquidación-de-la-chamba), [HU-23](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-23-calificación-y-retroalimentación-del-servicio).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor PDS as PDS (En Sitio)
    actor SOL as Solicitante (En Sitio)
    participant FE as Frontend React (ChambaDetailPage / Milestones)
    participant API as Flask API Gateway (chambas.py)
    participant GEO as Validador Haversine / PostGIS
    participant S3 as MinIO S3 (chambas-evidencias)
    participant DB as PostgreSQL 16 (chambas, adendas, novedades, skills)

    %% ---------------------------------------------------------
    %% HITO 1: INICIO DE OBRA CON GEOFENCE GPS (<100m)
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of PDS: HITO 1: Llegada a Sitio y Validación GPS
    PDS->>FE: Clic en "Iniciar Obra" en /pds/chambas/1
    FE->>FE: navigator.geolocation.getCurrentPosition() -> lat: 6.2088, lng: -75.5678
    FE->>API: POST /api/v1/chambas/1/iniciar {latitud: 6.2088, longitud: -75.5678}
    API->>GEO: Validar proximidad con coordenadas del contrato
    GEO-->>API: Distancia calculada = 14 metros (< 100 metros OK)
    API->>DB: UPDATE chambas SET estado = 'en_proceso', inicio_real = NOW() WHERE id = 1
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 200 OK {estado: "en_proceso"}
    FE-->>PDS: Badge cambia a azul "En Proceso"
    end

    %% ---------------------------------------------------------
    %% HITO 2: EVIDENCIA INICIAL Y TRANSICIÓN A EJECUCIÓN
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of PDS: HITO 2: Fijación Fotográfica Previa
    PDS->>FE: Captura foto del daño previo y confirma
    FE->>API: POST /api/v1/chambas/evidencia/upload {file: base64}
    API->>S3: PutObject(bucket="chambas-evidencias", key="chamba_1/antes.jpg")
    S3-->>API: url_evidencia_inicial
    API-->>FE: HTTP 200 OK {url}
    FE->>API: POST /api/v1/chambas/1/evidencia-entrada {url: "..."}
    FE->>API: PATCH /api/v1/chambas/1/estado {estado: "en_ejecucion"}
    API->>DB: UPDATE chambas SET estado = 'en_ejecucion', evidencia_inicio = url
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {estado: "en_ejecucion"}
    end

    %% ---------------------------------------------------------
    %% HITOS 3 Y 4: ADENDA CONTRACTUAL Y NOVEDADES
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of PDS: HITOS 3 y 4: Modificaciones y Bitácora de Campo
    PDS->>FE: Registra Adenda (Codo PVC extra, +$20.000 COP, +1h)
    FE->>API: POST /api/v1/chambas/1/adenda {monto_adicional: 20000, tiempo_horas: 1, descripcion: "..."}
    API->>DB: INSERT INTO adendas (chamba_id, monto, horas, estado='aprobada_en_sitio')
    DB-->>API: Total acumulado recalculado ($140.000 COP)
    API-->>FE: HTTP 200 OK {nuevo_total: 140000}
    PDS->>FE: Reporta Novedad (Corte preventivo temporal de agua)
    FE->>API: POST /api/v1/chambas/1/novedad {tipo: "operativa", mensaje: "..."}
    API->>DB: INSERT INTO novedades (chamba_id, mensaje, fecha=NOW())
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {novedad_id}
    end

    %% ---------------------------------------------------------
    %% HITO 5: EVIDENCIA FINAL Y SOLICITUD DE CIERRE
    %% ---------------------------------------------------------
    rect rgb(254, 242, 242)
    note right of PDS: HITO 5: Carga de Entrega y Check-in de Cobro
    PDS->>FE: Sube foto de obra concluida (tubería sellada y limpia)
    FE->>API: POST /api/v1/chambas/evidencia/upload
    API->>S3: PutObject(bucket="chambas-evidencias", key="chamba_1/despues.jpg")
    API-->>FE: url_evidencia_final
    FE->>API: POST /api/v1/chambas/1/evidencia-salida {url: "..."}
    FE->>API: PATCH /api/v1/chambas/1/estado {estado: "pendiente_validacion"}
    FE->>API: POST /api/v1/chambas/1/pago {rol: "pds", confirmado: true}
    API->>DB: UPDATE chambas SET estado='pendiente_validacion', pds_pago_confirmado=true
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK
    end

    %% ---------------------------------------------------------
    %% HITO 6: VALIDACIÓN DE HABILIDADES, PAGO DUAL Y CALIFICACIÓN
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of SOL: HITO 6: Recepción, Doble Check-in y Calificación
    SOL->>FE: En /solicitante/chambas/1 valida habilidades ("Plomería", "Soldadura PVC")
    FE->>API: POST /api/v1/chambas/1/validar-habilidades {habilidades: ["Plomería"]}
    API->>DB: INSERT INTO habilidades_validadas (user_id=pds_id, skill="Plomería", validador_id=sol_id)
    API-->>FE: HTTP 200 OK
    SOL->>FE: Confirma pago directo efectivo ($140.000 COP) y liquida
    FE->>API: POST /api/v1/chambas/1/pago {rol: "solicitante", confirmado: true}
    API->>DB: UPDATE chambas SET solicitante_pago_confirmado=true, dual_confirmado=true
    FE->>API: PATCH /api/v1/chambas/1/estado {estado: "liquidacion_confirmada"}
    API->>DB: UPDATE chambas SET estado = 'liquidacion_confirmada'
    SOL->>FE: Califica con 5 Estrellas y reseña técnica
    FE->>API: POST /api/v1/chambas/1/calificar {estrellas: 5, comentario: "Excelente labor..."}
    API->>DB: INSERT INTO ratings ...
    API->>DB: UPDATE chambas SET estado = 'finalizada'
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {estado: "finalizada"}
    FE-->>SOL: Pantalla final de éxito con sello de cierre
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Validación de Geocerca Estricta (HU-17):** Para transicionar de `'programada'` a `'en_proceso'`, el dispositivo del prestador debe enviar coordenadas que verifiquen una distancia euclidiana/Haversine menor a 100 metros respecto al punto pactado en el contrato, previniendo fraudes remotos.
2. **Evidencias Comparativas Antes/Después:** El expediente técnico exige dos anclajes visuales obligatorios en MinIO S3: `evidencia_inicio` (estado previo de la infraestructura) y `evidencia_salida` (resultado terminado) como respaldo ante eventuales reclamos o arbitrajes.
3. **Adendas Directas en Obra (HU-19):** Si surgen imprevistos o vicios ocultos durante la reparación, el PDS puede registrar un anexo de tiempo y costo sin romper el contrato original; el nuevo total devengado se refleja automáticamente en la orden de cobro ($140.000 COP).
4. **Doble Confirmación de Pago Directo:** La plataforma asegura que tanto el pagador como el receptor confirmen de forma bilateral e independiente (`pds_pago_confirmado = true` y `solicitante_pago_confirmado = true`) antes de permitir el cierre definitivo y la liquidación contable.
