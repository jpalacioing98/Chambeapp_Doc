# Catálogo Maestro de Diagramas de Secuencia (Fase 5)

> **Auditoría de Maestría en Ingeniería de Software**  
> **Proyecto:** ChambeApp — Plataforma de Servicios y Formalización Laboral  
> **Herramienta:** Diagramas Nativos de Secuencia Mermaid (`sequenceDiagram`) y PlantUML Clásico  
> **Estado:** **100% COMPLETADO (14 de 14 Flujos Documentados)**

---

## 1. Índice General de Diagramas de Secuencia por Flujo

Todos los diagramas han sido elaborados en sintaxis nativa de **Mermaid (`sequenceDiagram`)**, permitiendo su visualización interactiva y renderizado inmediato en Markdown sin dependencias binarias externas, con estricta trazabilidad hacia el código activo en `backend/` y `frontend/`:

| Flujo | Denominación del Flujo | Documento del Diagrama | Módulo del Sistema | Participantes Principales | Historias de Usuario |
|:---:|---|:---:|---|---|:---:|
| **01** | Autenticación, Registro y Seguridad Multi-Rol | [`01-secuencia-autenticacion-registro.md`](01-secuencia-autenticacion-registro.md) | Acceso e Identidad | React, Bcrypt, JWT Manager, Redis, PostgreSQL | HU-01, HU-02, HU-03, HU-49, HU-50 |
| **02** | Perfil de Usuario y Verificación KYC | [`02-secuencia-perfil-kyc.md`](02-secuencia-perfil-kyc.md) | Identidad y Cumplimiento | PerfilPage, MinIO S3, SMS OTP, Admin KYC | HU-06, HU-07, HU-51, HU-52 |
| **03** | Publicación de Solicitudes (Geocerca y 360°) | [`03-secuencia-publicacion-chamba.md`](03-secuencia-publicacion-chamba.md) | Solicitudes y Espacio | Stepper Wizard, Mapbox GL, PostGIS, A-Frame 360 | HU-08, HU-49, HU-01 |
| **04** | Exploración Geoespacial y Postulación PDS | [`04-secuencia-exploracion-postulacion-pds.md`](04-secuencia-exploracion-postulacion-pds.md) | Mercado Laboral | Mapbox 3D, PostGIS ST_DWithin, Cuotas Plan | HU-13, HU-14, HU-43, HU-01 |
| **05** | Negociación Bilateral y Firma de Contrato | [`05-secuencia-negociacion-contrato-firma.md`](05-secuencia-negociacion-contrato-firma.md) | Contratación Digital | Ofertas, Canvas SignaturePad, SHA-256, FSM | HU-15, HU-16, HU-44, HU-45 |
| **06** | Ejecución y Ciclo Operativo (6 Hitos) | [`06-secuencia-ejecucion-ciclo-operativo.md`](06-secuencia-ejecucion-ciclo-operativo.md) | Operaciones en Campo | Geofence Haversine <100m, MinIO S3, Bitácora | HU-17 a HU-23 |
| **07** | Pago Dual Directo y Calificación Mutua | [`07-secuencia-pago-dual-calificacion.md`](07-secuencia-pago-dual-calificacion.md) | Finanzas y Reputación | Nequi / PSE Gateway, Endosos, TrustScore, DIAN | HU-21, HU-22, HU-23, HU-24 |
| **08** | Derivación y Cierre Ágil de Marañas | [`08-secuencia-derivacion-cierre-maranas.md`](08-secuencia-derivacion-cierre-maranas.md) | Micro-trabajos | Derivación Adenda, Socket.IO Barrial, Ciclo Ágil | HU-53, HU-54 |
| **09** | Directorio y Gestión de Negocios Locales | [`09-secuencia-directorio-negocios-locales.md`](09-secuencia-directorio-negocios-locales.md) | Ecosistema Comercial | Mapbox Pines, Horarios en Vivo (UTC-5), Vitrina | HU-55 a HU-60 |
| **10** | Anuncios Laborales de Negocios | [`10-secuencia-anuncios-laborales-negocios.md`](10-secuencia-anuncios-laborales-negocios.md) | Empleo Barrial | Banner Cintillo, Postulación No Vinculante, RBAC | HU-61, HU-62 |
| **11** | Billetera Digital, Recargas y Coins | [`11-secuencia-billetera-recargas-monedas.md`](11-secuencia-billetera-recargas-monedas.md) | Finanzas y Custodia | Partida Doble, ChambeCoins Ledger, Escrow, PDF | HU-25 a HU-28, HU-66 a HU-68 |
| **12** | Mensajería y Chat en Tiempo Real WebSockets | [`12-secuencia-mensajeria-chat-tiempo-real.md`](12-secuencia-mensajeria-chat-tiempo-real.md) | Comunicación Viva | Flask-SocketIO, Marcadores `⟦c:...⟧`, Salas Privadas | HU-29 a HU-32, HU-69 |
| **13** | Notificaciones Push, In-App y Alertas | [`13-secuencia-notificaciones-alertas.md`](13-secuencia-notificaciones-alertas.md) | Notificaciones | Socket room `user:<id>`, Marcación Masiva, RF-10 | HU-33, HU-34, HU-35, HU-70 |
| **14** | Moderación, Soporte y Superadmin | [`14-secuencia-moderacion-soporte-superadmin.md`](14-secuencia-moderacion-soporte-superadmin.md) | Gobernanza y Control | `region_scope_id`, Feature Flags, AuditLog Forense | RF-73 a RF-76, RNF-AUD, RNF-CFG |

---

## 2. Matriz de Interacción Arquitectónica en Tres Capas

Cada diagrama de secuencia expone cómo los componentes de software interactúan a lo largo del stack de tecnología:

```mermaid
graph TD
    subgraph Capa 1: Presentación y Experiencia de Usuario (Frontend React + Vite)
        UI_AUTH[AuthShell / Login]
        UI_MAP[Mapbox GL JS 3D / A-Frame 360]
        UI_SIGN[Canvas SignaturePad Digital]
        UI_CHAT[Chat 2-Pane + Marcadores]
        UI_ADMIN[Consola de Moderación y Disputas]
    end

    subgraph Capa 2: API Gateway y Lógica de Negocio (Flask-Smorest + Extensiones)
        API_AUTH[controllers/auth.py & two_factor.py]
        API_SOL[controllers/solicitudes.py & ofertas.py]
        API_OPS[controllers/chambas.py & contracts.py]
        API_FIN[controllers/wallet.py & payments.py]
        API_SIO[controllers/oferta_socket.py & notification_socket.py]
        API_ADM[controllers/admin.py & superadmin.py]
    end

    subgraph Capa 3: Persistencia, Cómputo Asíncrono y Almacenamiento
        DB_POSTGRES[(PostgreSQL 16 + PostGIS)]
        CACHE_REDIS[(Redis 7: Colas & Broker)]
        STORE_MINIO[(MinIO S3: Evidencias & KYC)]
        WORKER_CELERY[Celery Distributed Workers]
    end

    UI_AUTH --> API_AUTH
    UI_MAP --> API_SOL
    UI_SIGN --> API_OPS
    UI_CHAT --> API_SIO
    UI_ADMIN --> API_ADM

    API_AUTH --> DB_POSTGRES
    API_AUTH --> CACHE_REDIS
    API_SOL --> DB_POSTGRES
    API_SOL --> STORE_MINIO
    API_SOL --> WORKER_CELERY
    API_OPS --> DB_POSTGRES
    API_OPS --> STORE_MINIO
    API_FIN --> DB_POSTGRES
    API_SIO --> CACHE_REDIS
    API_ADM --> DB_POSTGRES
```

---

## 3. Diagramas Complementarios de Arquitectura Existentes (PlantUML)

En este mismo directorio se conservan los diagramas estructurales complementarios de la fase de modelado inicial:

* **Arquitectura de Componentes:** [`01_componentes.puml`](01_componentes.puml)
* **Diagrama de Despliegue de Infraestructura:** [`02_despliegue.puml`](02_despliegue.puml)
* **Flujo de Órdenes de Pago y Escrow:** [`03_flujo_orden_pago.puml`](03_flujo_orden_pago.puml)
* **Modelo Entidad-Relación de Datos:** [`04_modelo_datos.puml`](04_modelo_datos.puml)
* **Casos de Uso de Alto Nivel:** [`05_casos_uso.puml`](05_casos_uso.puml)
* **Billetera Virtual y Movimientos:** [`06_billetera_virtual.puml`](06_billetera_virtual.puml)
* **Pipeline de Recomendación Machine Learning:** [`07_pipeline_recomendacion.puml`](07_pipeline_recomendacion.puml)
* **Cascada Geoespacial PostGIS:** [`08_cascada_geoespacial.puml`](08_cascada_geoespacial.puml)
* **Mensajería en Tiempo Real Socket.IO:** [`09_tiempo_real_socketio.puml`](09_tiempo_real_socketio.puml)
* **Modelo de Datos de Comerciante:** [`10_modelo_datos_comerciante.puml`](10_modelo_datos_comerciante.puml)
* **División y Aislamiento Regional:** [`11_regiones.puml`](11_regiones.puml)
* **Arquitectura Administrativa Frontend:** [`12_arquitectura_admin_frontend.puml`](12_arquitectura_admin_frontend.puml)
* **Infraestructura Regional y Despliegue:** [`13_infraestructura_regional.puml`](13_infraestructura_regional.puml)
* **Moderación, Soporte y Gobernanza Superadmin:** [`14_moderacion_soporte_superadmin.puml`](14_moderacion_soporte_superadmin.puml) ([Render PNG](png/14_moderacion_soporte_superadmin.png))
