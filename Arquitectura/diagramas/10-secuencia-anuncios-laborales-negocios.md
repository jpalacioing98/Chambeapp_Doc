# Diagrama de Secuencia — Flujo 10: Anuncios Laborales de Negocios

> **Módulo:** Intermediación Laboral Barrial, Tablón de Vacantes y Postulaciones de Oficio  
> **Fuentes de Código:** [`backend/app/controllers/anuncios.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/anuncios.py), [`backend/app/models/anuncio.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/anuncio.py), [`frontend/src/features/negocios/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/negocios/)  
> **Historias de Usuario:** [HU-61](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-61-publicación-de-anuncios-laborales-por-negocios), [HU-62](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-62-postulación-a-vacantes-laborales-de-negocios).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor MER as Comerciante (Empleador)
    actor PDS as PDS (Candidato)
    participant FE as Frontend React (AnunciosPanel / MapaBanner / PostularModal)
    participant API as Flask API Gateway (anuncios.py)
    participant DB as PostgreSQL 16 (anuncios_laborales, postulaciones_anuncio)
    participant NOTIF as Sistema de Notificaciones / Socket.IO

    %% ---------------------------------------------------------
    %% SUBFLUJO A: PUBLICACIÓN DE VACANTE LABORAL
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of MER: SUBFLUJO A: Creación de Anuncio por el Negocio
    MER->>FE: Accede a /negocio/anuncios y hace clic en "Nuevo anuncio"
    FE-->>MER: Despliega modal de creación de oferta laboral
    MER->>FE: Completa datos: "Técnico en fontanería", vacantes: 2, horario: "Tiempo completo"
    FE->>API: POST /api/v1/anuncios/ {titulo, categoria: "plomeria", vacantes: 2, descripcion: "..."}
    API->>API: Valida rol merchant y propiedad de negocio_id
    API->>DB: INSERT INTO anuncios_laborales (negocio_id, titulo, vacantes, estado='publicado')
    DB-->>API: commit() exitoso (anuncio_id = 1)
    API-->>FE: HTTP 201 Created {anuncio_id: 1, estado: "publicado"}
    FE-->>MER: Insignia verde "Activa" en el panel del comerciante
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: DESCUBRIMIENTO Y POSTULACIÓN NO VINCULANTE
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of PDS: SUBFLUJO B: Descubrimiento y Postulación del Trabajador
    PDS->>FE: En /negocios visualiza cintillo interactivo de empleos (.ch-anc-strip)
    FE->>API: GET /api/v1/anuncios/?estado=publicado
    API->>DB: SELECT * FROM anuncios_laborales WHERE estado = 'publicado'
    DB-->>API: Lista de vacantes abiertas
    API-->>FE: HTTP 200 OK [anuncios]
    PDS->>FE: Clic en banner -> Carga expediente público /anuncios/1
    FE-->>PDS: Detalle de responsabilidades y botón "Postularme a esta oferta"
    PDS->>FE: Abre modal, escribe experiencia y teléfono "3009876543"
    FE->>API: POST /api/v1/anuncios/1/postulaciones {mensaje: "...", telefono: "3009876543"}
    API->>DB: INSERT INTO postulaciones_anuncio (anuncio_id=1, pds_id=?, telefono, estado='enviada')
    DB-->>API: commit()
    API->>NOTIF: disparar_notificacion(owner_id, "nueva_postulacion_laboral")
    API-->>FE: HTTP 201 Created
    FE-->>PDS: Toast "Postulación enviada. El negocio podrá contactarte"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: GESTIÓN DE CANDIDATOS Y CONTACTO
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of MER: SUBFLUJO C: Evaluación de Perfiles y Entrevistas
    MER->>FE: Accede a /anuncios/1 (expediente privado del empleador)
    FE->>API: GET /api/v1/anuncios/1/postulaciones
    API->>API: Verifica que JWT identity sea dueño del negocio
    API->>DB: SELECT * FROM postulaciones_anuncio WHERE anuncio_id = 1
    DB-->>API: Lista de candidatos y teléfonos de contacto directo
    API-->>FE: HTTP 200 OK [postulaciones]
    FE-->>MER: Tarjeta de candidato PDS con botón "Contactar"
    MER->>FE: Presiona "Contactar"
    FE->>API: PATCH /api/v1/anuncios/1/postulaciones/1 {estado: "contactado"}
    API->>DB: UPDATE postulaciones_anuncio SET estado = 'contactado' WHERE id = 1
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK
    FE-->>MER: Badge azul "Contactado" y apertura de enlace WhatsApp
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: CIERRE DE LA CONVOCATORIA
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of MER: SUBFLUJO D: Cierre de Vacante
    MER->>FE: Clic en "Cerrar anuncio"
    FE->>API: PATCH /api/v1/anuncios/1/estado {estado: "cerrado"}
    API->>DB: UPDATE anuncios_laborales SET estado = 'cerrado' WHERE id = 1
    DB-->>API: commit()
    API-->>FE: HTTP 200 OK {estado: "cerrado"}
    FE-->>MER: Badge gris "Cerrada" y retiro automático del feed del mapa
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Diferenciación Conceptual (Empleo Fijo vs Chamba Escrow):** Los anuncios de negocios responden a relaciones laborales continuas o de nómina tradicional, desacopladas del ciclo civil de contratos por hora y retención de fondos en custodia escrow.
2. **Protección de Datos Personales del Postulante:** El endpoint `GET /api/v1/anuncios/<id>/postulaciones` implementa control de acceso estricto (RBAC). Si un usuario externo o competidor intenta consultar los teléfonos o correos de los candidatos, la API responde con `HTTP 403 Forbidden`.
3. **Cintillo Flotante Geoespacial:** Para maximizar la visibilidad sin saturar la cartografía, las ofertas laborales activas se proyectan en un banner horizontal flotante (`.ch-anc-strip`) sobre el mapa vectorial de negocios, enlazando directamente al expediente de postulación.
4. **Ciclo de Vida de Vacante:** La transición a estado `cerrado` despublica la oferta de forma instantánea de la vista pública, pero mantiene el histórico de candidatos archivado en PostgreSQL para futuras auditorías o contrataciones.
