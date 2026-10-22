# Diagrama de Secuencia — Flujo 04: Exploración Geoespacial y Postulación de Ofertas (PDS)

> **Módulo:** Descubrimiento Geoespacial, Filtrado por Geocerca y Postulación Bilateral  
> **Fuentes de Código:** [`backend/app/controllers/solicitudes.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/solicitudes.py), [`backend/app/controllers/ofertas.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/ofertas.py), [`backend/app/models/oferta.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/oferta.py), [`frontend/src/features/pds/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/pds/)  
> **Historias de Usuario:** [HU-13](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-13-búsqueda-y-filtrado-geoespacial-de-chambas), [HU-14](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-14-postulación-de-ofertas-a-chambas), [HU-43](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-43-filtrado-avanzado-por-distancia-y-geocerca), [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-inicio-de-sesión).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor PDS as PDS (Trabajador)
    actor SOL as Solicitante (Dueño Chamba)
    participant FE as Frontend React (Mapbox 3D / FilterSheet / PostularPage)
    participant API as Flask API Gateway (solicitudes.py / ofertas.py)
    participant DB as PostgreSQL 16 + PostGIS (solicitudes, ofertas, profiles)
    participant SIO as Socket.IO Hub (oferta_socket.py)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: CARGA DE MAPA 3D Y BÚSQUEDA GEOESPACIAL
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of PDS: SUBFLUJO A: Exploración de Chambas y Geocerca
    PDS->>FE: Navega a /pds/chambas
    FE->>API: GET /api/v1/solicitudes/?categoria=&ubicacion=
    API->>DB: SELECT * FROM solicitudes WHERE estado = 'PUBLICADO'
    DB-->>API: Listado con geocercas
    API-->>FE: HTTP 200 OK [solicitudes] (sin coordenadas exactas RF-04)
    FE->>FE: Renderiza mapa Mapbox GL 3D (edificios extruidos y pines)
    PDS->>FE: Abre FilterSheet y ajusta slider de radio a 20 km
    FE->>FE: Recalcula matriz de proximidad visual y filtra marcadores
    PDS->>FE: Selecciona pin de chamba "Reparación fuga de agua"
    FE-->>PDS: Despliega BottomSheet resumen y botón "Postularme"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: VALIDACIÓN DE HABILIDADES Y PREPARACIÓN
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of PDS: SUBFLUJO B: Validación de Perfil y Cuota de Plan
    PDS->>FE: Clic en "Postularme" -> Navega a /pds/postular/8
    FE->>API: GET /api/v1/solicitudes/8
    API->>DB: SELECT * FROM solicitudes WHERE id = 8
    DB-->>API: Detalle técnico, requerimientos de oficio ("Plomería")
    API-->>FE: HTTP 200 OK {solicitud}
    FE->>FE: Valida que profile.habilidades incluya "Plomería"
    FE-->>PDS: Habilita formulario económico y selector de franja
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: POSTULACIÓN ECONÓMICA Y NOTIFICACIÓN REACTIVA
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of PDS: SUBFLUJO C: Envío de Oferta y Despacho en Tiempo Real
    PDS->>FE: Ingresa $120.000 COP, franja "Mañana", disponibilidad inmediata y mensaje
    FE->>API: POST /api/v1/solicitudes/8/ofertas {monto: 120000, horario: "Mañana", mensaje: "..."}
    API->>API: Verifica claims JWT (role == 'pds' y user_id != solicitante_id)
    API->>DB: SELECT plan FROM profiles WHERE user_id = ?
    DB-->>API: plan: "free" (límite 10 postulaciones/mes)
    API->>DB: SELECT COUNT(*) FROM ofertas WHERE pds_id = ? AND mes = actual
    DB-->>API: count = 2 (< 10 permitido)
    API->>DB: INSERT INTO ofertas (solicitud_id, pds_id, monto, horario, estado='pendiente')
    DB-->>API: commit() exitoso (oferta_id generado)
    API->>DB: INSERT INTO notificaciones (user_id=solicitante_id, tipo='oferta_nueva', texto=...)
    DB-->>API: commit() notificacion
    API->>SIO: emit("oferta_recibida", data, room=f"user_{solicitante_id}")
    SIO-->>SOL: Badge reactivo en navbar y push in-app
    API-->>FE: HTTP 201 Created {oferta_id, estado: "pendiente"}
    FE-->>PDS: Toast verde "Postulación enviada" y redirige al mapa
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: VERIFICACIÓN EN HUB DE MIS CHAMBAS
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of PDS: SUBFLUJO D: Seguimiento en Mis Ofertas
    PDS->>FE: Clic en FAB "Mis chambas" -> pestaña "Postulaciones"
    FE->>API: GET /api/v1/mis-ofertas
    API->>DB: SELECT * FROM ofertas JOIN solicitudes WHERE pds_id = ?
    DB-->>API: Oferta recientemente creada
    API-->>FE: HTTP 200 OK [{id, monto: 120000, estado: "pendiente", solicitud: {...}}]
    FE-->>PDS: Renderiza tarjeta con badge amarillo "Pendiente" ($120.000)
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Seguridad y Conflicto de Interés:** El backend aborta con `HTTP 403 Forbidden` si un usuario intenta ofertar en una solicitud creada por él mismo (`solicitud.solicitante_id == user_id`).
2. **Cuota Mensual por Nivel de Suscripción (RF-11):** Se aplica la política `PLANES_LIMITE_POSTULACIONES` sobre la tabla `ofertas`. Usuarios con plan gratuito (`free`) cuentan con una cuota mensual estricta; superado el límite se exige migración a nivel `pro` o `premium`.
3. **Puntualización de Condiciones "A Convenir":** Si la solicitud carece de fecha u horario prefijado, el modelo de datos de ofertas exige que el PDS suministre explícitamente `fecha_deseada` y `horario`, cerrando vacíos operativos.
4. **Alerta Bilateral en Tiempo Real:** La creación de la oferta desencadena una notificación persistente en base de datos (`notificaciones`) y un evento WebSockets Socket.IO canalizado a la sala personal del cliente (`user_{solicitante_id}`).
