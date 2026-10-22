# Diagrama de Secuencia — Flujo 03: Publicación de Solicitudes de Chamba (Geocerca y Panorámicas 360°)

> **Módulo:** Publicación de Solicitudes, Geocercas PostGIS y Soporte Multimedia 360°  
> **Fuentes de Código:** [`backend/app/controllers/solicitudes.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/solicitudes.py), [`backend/app/models/solicitud.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/solicitud.py), [`backend/app/services/region.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/services/region.py), [`frontend/src/features/solicitudes/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/solicitudes/)  
> **Historias de Usuario:** [HU-08](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-08-publicación-de-solicitud-con-georreferenciación), [HU-49](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-49-soporte-de-fotos-360-y-panorámicas-en-solicitudes), [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-inicio-de-sesión).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor SOL as Solicitante / Contratante
    participant FE as Frontend React (SolicitudWizard / Mapbox GL)
    participant S3 as MinIO S3 (chambas-media / 360-panoramas)
    participant API as Flask API Gateway (solicitudes.py)
    participant REG as Servicio de Región (region.py)
    participant DB as PostgreSQL 16 + PostGIS (solicitudes, users)
    participant CELERY as Worker Asíncrono Celery (Redis Broker)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: CONFIGURACIÓN DEL WIZARD Y GEORREFERENCIACIÓN
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of SOL: SUBFLUJO A: Asistente Progresivo y Geocerca
    SOL->>FE: Inicia asistente en /solicitante/solicitudes/new
    FE-->>SOL: Paso 0-2: Título ("Fuga de agua"), Categoría ("Plomería"), Descripción
    SOL->>FE: Paso 3: Interactúa con mapa Mapbox GL e indica radio
    FE->>FE: Captura lat: 6.2088, lng: -75.5678, radio_km: 15.0
    SOL->>FE: Paso 4-5: Define urgencia ("Hoy") y presupuesto ($130.000 COP)
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: ADJUNCIÓN MULTIMEDIA Y PANORÁMICA 360°
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of SOL: SUBFLUJO B: Panorámica 360° Equirrectangular (A-Frame)
    SOL->>FE: Paso 6: Carga fotografía panorámica del entorno
    FE->>FE: Renderiza previsualización interactiva WebGL (A-Frame / Canvas 360)
    FE->>S3: Upload Direct / Backend Stream (bucket="chambas-media")
    S3-->>FE: storage_url: "s3://chambas-media/solicitudes/solic_360_fuga.jpg"
    SOL->>FE: Paso 7: Comprueba resumen consolidado y hace clic en "Publicar"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: PERSISTENCIA ESPACIAL Y GOBERNANZA REGIONAL
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of SOL: SUBFLUJO C: Inserción PostGIS y Asignación Regional
    FE->>API: POST /api/v1/solicitudes/ {titulo, categoria, latitud, longitud, radio_km, presupuesto, imagen_360}
    API->>API: Valida rol (solicitante/merchant) y presupuesto >= 50.000 COP
    API->>REG: assign_region(solicitante, text=ubicacion)
    REG->>DB: Determina region_id según cobertura territorial
    REG-->>API: region_id asignado
    API->>DB: INSERT INTO solicitudes (solicitante_id, titulo, categoria, presupuesto, latitud, longitud, radio_km, imagen_360, estado='PUBLICADO')
    DB-->>API: commit() exitoso (solicitud_id generado)
    API->>CELERY: disparar_notificacion_prestadores_cercanos.delay(solicitud_id)
    API-->>FE: HTTP 201 Created {solicitud_id, estado: "PUBLICADO"}
    FE-->>SOL: Redirige al Hub con Toast verde "¡Solicitud publicada!"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: CONSULTA PÚBLICA CON PRIVACIDAD DE COORDENADAS (RF-04)
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of SOL: SUBFLUJO D: Desacoplamiento de Coordenadas en Feed Público
    participant PDS as PDS Explorando Feed
    PDS->>API: GET /api/v1/solicitudes/?categoria=Plomería
    API->>DB: SELECT * FROM solicitudes WHERE estado = 'PUBLICADO'
    DB-->>API: Colección de solicitudes con coordenadas exactas
    API->>API: Purga latitud, longitud y dirección exacta del JSON de salida (RF-04)
    API-->>PDS: HTTP 200 OK [{id, titulo, categoria, presupuesto, ubicacion: "Medellin (Zona general)"}]
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Validación de Presupuesto Mínimo:** Se restringe un piso financiero de `$50.000 COP` para evitar subcotización precaria, o se permite explícitamente `presupuesto: None` ("A convenir") requiriendo cotización abierta del trabajador.
2. **Privacidad de Coordenadas Geográficas (RF-04):** Para salvaguardar la seguridad física del solicitante, el endpoint público `GET /api/v1/solicitudes/` elimina de forma estricta las llaves `latitud`, `longitud` y `direccion`. Las coordenadas exactas solo se revelan al PDS una vez formalizado el contrato bilateral mediante firma digital.
3. **Indexación y Geocerca PostGIS:** El punto geográfico se almacena como `geometry(Point, 4326)` con un radio de cobertura `radio_km` (predeterminado 5.0 a 15.0 km), habilitando búsquedas espaciales optimizadas con `ST_DWithin`.
4. **Inspección Inmersiva 360° (A-Frame):** El atributo `imagen_360` almacena el URI a la proyección equirrectangular cargada en MinIO, consumida por el frontend mediante A-Frame para permitir a los postulantes inspeccionar patologías constructivas antes de cotizar.
