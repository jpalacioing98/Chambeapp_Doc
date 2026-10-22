# Diagrama de Secuencia — Flujo 09: Directorio y Gestión de Negocios Locales

> **Módulo:** Directorio Comercial, Mapa Interactivo de Comercios, Horarios Dinámicos y Vitrina Digital  
> **Fuentes de Código:** [`backend/app/controllers/negocios.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/negocios.py), [`backend/app/models/negocio.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/negocio.py), [`frontend/src/features/negocios/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/negocios/)  
> **Historias de Usuario:** [HU-55](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-55-registro-y-perfil-de-negocio-local), [HU-56](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-56-directorio-público-de-negocios-en-mapa-interactivo), [HU-57](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-57-horarios-de-atención-y-contacto-directo), [HU-58](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-58-galería-fotográfica-de-negocios-en-minio), [HU-59](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-59-reseñas-y-calificaciones-de-negocios), [HU-60](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-60-sistema-de-reporte-comunitario-de-negocios).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor MER as Comerciante (Merchant)
    actor VEC as Vecino / Cliente
    participant FE as Frontend React (MerchantDashboard / DirectorioMapa / NegocioDetailPage)
    participant API as Flask API Gateway (negocios.py)
    participant S3 as MinIO S3 (negocios-vitrina)
    participant DB as PostgreSQL 16 (negocios, horarios, imagenes, ratings_negocio, reportes)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: GESTIÓN DE FICHA COMERCIAL (MERCHANT)
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of MER: SUBFLUJO A: Administración de Ficha y Contacto Directo
    MER->>FE: Accede a /negocio (Dashboard de Comerciante)
    FE->>API: GET /api/v1/negocios/ (Bearer JWT Merchant)
    API->>DB: SELECT * FROM negocios WHERE user_id = ?
    DB-->>API: Datos del comercio "Restaurante El Sazón" (id=1)
    FE->>API: GET /api/v1/negocios/1/stats
    API->>DB: Agregación de visitas y pedidos
    API-->>FE: HTTP 200 OK {stats, comercio}
    FE-->>MER: Renderiza métricas, rating e insignias
    MER->>FE: Actualiza WhatsApp a "+57 300 123 4567"
    FE->>API: PUT /api/v1/negocios/1 {whatsapp: "+573001234567", mensaje_cotizacion: "..."}
    API->>DB: UPDATE negocios SET whatsapp = ? WHERE id = 1 AND user_id = ?
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 200 OK {message: "Contacto actualizado"}
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: HORARIOS SEMANALES Y VITRINA FOTOGRÁFICA
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of MER: SUBFLUJO B: Horarios y Galería Multimedia
    MER->>FE: En /negocio/horarios configura atención lunes a sábado (08:00 - 20:00)
    FE->>API: PUT /api/v1/negocios/1/horarios {matriz_dias: [...]}
    API->>DB: UPSERT INTO negocio_horarios ...
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {abierto_ahora: true}
    MER->>FE: En /negocio/imagenes añade fotografía de catálogo
    FE->>API: POST /api/v1/negocios/1/imagenes {url: "...", pie: "Platos a la carta"}
    API->>DB: INSERT INTO negocio_imagenes (negocio_id=1, url=...)
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: EXPLORACIÓN GEOESPACIAL PÚBLICA (MAPBOX)
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of VEC: SUBFLUJO C: Directorio Público en Mapa Interactivo
    VEC->>FE: Ingresa a /negocios (Directorio Georreferenciado)
    FE->>API: GET /api/v1/negocios/mapa?categoria=Gastronomía
    API->>DB: SELECT id, nombre, latitud, longitud, calificacion FROM negocios WHERE activo = true
    DB-->>API: Colección geoespacial de pines
    API-->>FE: HTTP 200 OK [negocios_geopoints]
    FE->>FE: Mapbox GL JS renderiza marcadores y clusterización barrial
    VEC->>FE: Clic en pin "Restaurante El Sazón"
    FE-->>VEC: Despliega Bottom Sheet emergente con botón directo a WhatsApp
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: RESEÑA Y REPORTE COMUNITARIO
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of VEC: SUBFLUJO D: Evaluación y Moderación Comunitaria
    VEC->>FE: Navega a /negocios/1 y emite calificación de 5 estrellas
    FE->>API: POST /api/v1/negocios/1/rating {puntaje: 5, comentario: "Excelente atención"}
    API->>DB: INSERT INTO ratings_negocio ...
    API->>DB: UPDATE negocios SET calificacion_promedio = (SELECT AVG(puntaje)...)
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created
    VEC->>FE: Abre ReportModal para auditoría ("Reporte preventivo de horario")
    FE->>API: POST /api/v1/negocios/1/reportar {motivo: "Otro", detalle: "Auditoría..."}
    API->>DB: INSERT INTO reportes_negocio (negocio_id=1, reportante_id=?, estado='abierto')
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created {reporte_id, estado: "abierto"}
    FE-->>VEC: Confirmación de radicación ante moderación
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Aislamiento Multitenant de Analíticas (RBAC):** La ruta `GET /api/v1/negocios/<id>/stats` exige autenticación JWT y restringe el acceso exclusivamente al propietario del establecimiento (`negocio.user_id == identity`). Peticiones de usuarios externos son rechazadas con `HTTP 403 Forbidden`.
2. **Evaluación de Apertura en Tiempo Real (`abierto_ahora`):** Al consultar el detalle de un comercio, el backend o el cliente computa dinámicamente si el instante actual (`now()`, huso America/Bogota UTC-5) cae dentro del intervalo `[hora_apertura, hora_cierre]` del día de la semana correspondiente (0=Domingo a 6=Sábado).
3. **Pines Vectoriales y Bounding Box:** El endpoint `/api/v1/negocios/mapa` devuelve una carga comprimida con atributos espaciales mínimos para nutrir las capas GeoJSON de Mapbox GL JS, garantizando fluidez en navegadores móviles.
4. **Gobierno Comunitario Descentralizado:** El sistema de reporte preventivo (`reportes_negocio`) permite a los vecinos notificar anomalías o suplantaciones, canalizando tickets de revisión directamente a la bandeja de moderación del administrador regional.
