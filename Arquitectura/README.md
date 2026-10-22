# Portal Maestro de Arquitectura y Sustentación de Grado — ChambeApp

> **Maestría en Ingeniería de Software**  
> **Proyecto:** ChambeApp — Plataforma Tecnológica para la Intermediación de Servicios Informales, Marañas Barriales y Formalización Laboral  
> **Fecha de Consolidación:** Octubre 2026  
> **Estado de la Auditoría:** **100% COMPLETADO (Fases 1 a 6 Culminadas Exitosamente)**

---

## 1. Visión General del Proyecto

**ChambeApp** es una plataforma tecnológica diseñada para transformar la economía informal de servicios en Colombia (reparaciones domésticas, fontanería, electricidad, pintura, transporte menor y micro-trabajos barriales o "marañas"). Su propósito es cerrar la brecha entre prestadores independientes (PDS) y contratantes mediante:
1. **Confianza y Reputación Criptográfica:** Verificación de identidad multinivel (KYC documental y validación OTP telefónica), calificaciones mutuas 360° y TrustScore auditable.
2. **Seguridad y Custodia de Pagos:** Modelo de pago dual con retención preventiva tipo Escrow, dispersión mediante pasarela digital (Nequi / PSE) o efectivo con doble check-in obligatorio.
3. **Formalización e Inclusión Financiera:** Certificación tributaria descargable de ingresos devengados (conforme a la Ley 527 de 1999 y Decreto 1273 de 2018), bancarización de prestadores y adscripción progresiva a seguridad social.
4. **Geolocalización Asistida y Soporte 360°:** Búsquedas por geocercas dinámicas (`PostGIS ST_DWithin`), inspección de patologías de obra mediante panorámicas equirrectangulares 360° en WebGL (A-Frame) y validación de arribo a obra (<100m vía Haversine).

---

## 2. Mapa de Navegación del Repositorio de Arquitectura

El ecosistema de documentación de arquitectura se estructura en módulos interconectados y navegables:

```
documentation/Arquitectura/
├── README.md                                  <-- (Este Documento) Portal Maestro de Sustentación
├── PROGRESO.md                                <-- Registro de avance y checklist oficial de las 6 fases
├── flujos-chambeapp.md                        <-- Especificación exhaustiva de 17 flujos de negocio (14 UI + 3 API)
├── Arquitectura_Software.md                   <-- Stack técnico, 36 blueprints REST, Socket.IO y eventos
├── Contratos_API.md                           <-- Inventario y contratos OpenAPI/Smorest de 218 endpoints
├── Modelo_Datos_Actual.md                     <-- Modelo relacional de 47 entidades SQLAlchemy y PostGIS
├── Arquitectura_Admin_Frontend.md             <-- Arquitectura de gobernanza, RBAC y scoping regional
├── Infraestructura_Regional.md                <-- Topología de alta disponibilidad, Load Balancer y multi-región
│
├── auditoria/                                 <-- Informes de evaluación técnica de grado
│   ├── Fase1_Informe_Discrepancias.md         <-- Auditoría inicial vs código fuente activo
│   ├── Fase2_Plan_Actualizacion_HU.md         <-- Normalización EARS de Historias de Usuario v3.0
│   ├── Fase2_Empalme_Flujos_Codigo.md         <-- Matriz de empalme técnico entre capas
│   ├── Riesgos_Conocidos.md                   <-- Catálogo formal de riesgos operativos (R-01 a R-19)
│   ├── Fase4_Consolidado_Evidencias_E2E.md    <-- Informe maestro de auditoría Playwright (14 flujos PASA)
│   ├── Fase6_Resumen_Ejecutivo_Sustentacion.md<-- Guión para jurado calificador y defensa técnica
│   └── Guia_Reejecucion_Evidencias.md         <-- Manual de re-ejecución paso a paso para evaluadores
│
├── evidencias/                                <-- Banco de pruebas reproducibles E2E (Playwright)
│   ├── README.md                              <-- Índice consolidado de pruebas automatizadas
│   ├── justificacion-alcance-flujos-15-17.md  <-- Delimitación de flujos headless/API sin pantallas React
│   └── 01-autenticacion-registro/ ... 14-moderacion-soporte-superadmin/
│       ├── capturas/                          <-- 10 a 12 capturas de pantalla secuenciales por flujo
│       ├── video/                             <-- Grabación de video continua (.webm) de la sesión
│       ├── script/                            <-- Script Playwright (.cjs) autónomo y reproducible
│       └── resumen.md                         <-- Análisis técnico de peticiones HTTP, estado e invariantes
│
└── diagramas/                                 <-- Modelado formal de interacción y secuencia
    ├── README.md                              <-- Catálogo maestro de diagramas e interacción en 3 capas
    ├── 01-secuencia-autenticacion-registro.md ... 14-secuencia-moderacion-soporte-superadmin.md
    │                                          <-- 14 Diagramas de Secuencia nativos interactivos Mermaid
    ├── 01_componentes.puml ... 14_moderacion_soporte_superadmin.puml
    │                                          <-- 14 Diagramas estructurales y de despliegue PlantUML
    └── png/                                   <-- 15 Renders gráficos de alta resolución (.png)
```

---

## 3. Síntesis de la Arquitectura en Tres Capas

```mermaid
graph TD
    subgraph Capa 1: Presentación y Experiencia de Usuario (Frontend React 18 + Vite)
        FE_PWA[ChambeApp PWA Mobile-First / TailwindCSS]
        FE_MAP[Mapbox GL JS 3D - SwiftShader WebGL]
        FE_VR[A-Frame / Photo Sphere Viewer 360°]
        FE_CANVAS[SignaturePad Canvas Firma Manuscrita]
        FE_WS[Socket.IO Client - Mensajería & Notificaciones]
    end

    subgraph Capa 2: API Gateway y Reglas de Negocio (Flask-Smorest 36 Blueprints)
        BE_AUTH[Autenticación & 2FA TOTP: auth.py, two_factor.py]
        BE_CORE[Gestión de Chambas & Ofertas: solicitudes.py, ofertas.py]
        BE_FSM[Ciclo Operativo & Hitos: chambas.py, contracts.py]
        BE_FIN[Billetera & Pagos: wallet.py, payments.py]
        BE_ADM[Gobernanza Regional & Flags: admin.py, superadmin.py]
        BE_ASYNC[Workers Asíncronos: Celery Distributed Tasks]
    end

    subgraph Capa 3: Persistencia, Mensajería y Almacenamiento de Objetos
        DB_PG[(PostgreSQL 16 + PostGIS Spatial Engine)]
        CACHE_RD[(Redis 7: Session Cache, Socket.IO MQ & Celery Broker)]
        STORE_S3[(MinIO S3: Evidencias Fotográficas, Panoramas 360° & KYC)]
    end

    FE_PWA -->|REST HTTPS| BE_AUTH
    FE_PWA -->|REST HTTPS| BE_CORE
    FE_PWA -->|REST HTTPS| BE_FSM
    FE_PWA -->|REST HTTPS| BE_FIN
    FE_PWA -->|REST HTTPS| BE_ADM
    FE_WS <-->|WebSocket WSS| BE_CORE

    BE_AUTH --> DB_PG
    BE_AUTH --> CACHE_RD
    BE_CORE --> DB_PG
    BE_CORE --> CACHE_RD
    BE_CORE --> STORE_S3
    BE_CORE --> BE_ASYNC
    BE_FSM --> DB_PG
    BE_FSM --> STORE_S3
    BE_FIN --> DB_PG
    BE_ADM --> DB_PG
    BE_ASYNC --> CACHE_RD
    BE_ASYNC --> DB_PG
```

---

## 4. Matriz Integral de Trazabilidad: 14 Flujos Auditados

La siguiente tabla resume la alineación total entre los requerimientos funcionales, las historias de usuario de maestría, las evidencias de prueba de la Fase 4 y los diagramas de secuencia de la Fase 5:

| Flujo | Denominación del Flujo | Módulo de Arquitectura | Historias de Usuario | Evidencias E2E (Fase 4) | Diagrama de Secuencia (Fase 5) | Estado |
|:---:|---|---|:---:|:---:|:---:|:---:|
| **01** | Autenticación, Registro y Seguridad Multi-Rol | Identidad y Acceso | HU-01, HU-02, HU-03, HU-49, HU-50 | [`01-autenticacion-registro/`](evidencias/01-autenticacion-registro/resumen.md) | [`01-secuencia-autenticacion-registro.md`](diagramas/01-secuencia-autenticacion-registro.md) | **PASA** |
| **02** | Perfil de Usuario y Verificación KYC | Cumplimiento e Identidad | HU-06, HU-07, HU-51, HU-52 | [`02-perfil-kyc/`](evidencias/02-perfil-kyc/resumen.md) | [`02-secuencia-perfil-kyc.md`](diagramas/02-secuencia-perfil-kyc.md) | **PASA** |
| **03** | Publicación de Solicitudes (Geocerca y 360°) | Solicitudes y Geoespacial | HU-08, HU-49, HU-01 | [`03-publicacion-chamba/`](evidencias/03-publicacion-chamba/resumen.md) | [`03-secuencia-publicacion-chamba.md`](diagramas/03-secuencia-publicacion-chamba.md) | **PASA** |
| **04** | Exploración Geoespacial y Postulación PDS | Mercado y Ofertas | HU-13, HU-14, HU-43, HU-01 | [`04-exploracion-postulacion-pds/`](evidencias/04-exploracion-postulacion-pds/resumen.md) | [`04-secuencia-exploracion-postulacion-pds.md`](diagramas/04-secuencia-exploracion-postulacion-pds.md) | **PASA** |
| **05** | Negociación Bilateral y Firma de Contrato | Contratación Digital | HU-15, HU-16, HU-44, HU-45 | [`05-negociacion-contrato-firma/`](evidencias/05-negociacion-contrato-firma/resumen.md) | [`05-secuencia-negociacion-contrato-firma.md`](diagramas/05-secuencia-negociacion-contrato-firma.md) | **PASA** |
| **06** | Ejecución y Ciclo Operativo (6 Hitos) | Operaciones en Campo | HU-17 a HU-23 | [`06-ejecucion-ciclo-operativo/`](evidencias/06-ejecucion-ciclo-operativo/resumen.md) | [`06-secuencia-ejecucion-ciclo-operativo.md`](diagramas/06-secuencia-ejecucion-ciclo-operativo.md) | **PASA** |
| **07** | Pago Dual Directo y Calificación Mutua | Finanzas y Reputación | HU-21, HU-22, HU-23, HU-24 | [`07-pago-dual-calificacion/`](evidencias/07-pago-dual-calificacion/resumen.md) | [`07-secuencia-pago-dual-calificacion.md`](diagramas/07-secuencia-pago-dual-calificacion.md) | **PASA** |
| **08** | Derivación y Cierre Ágil de Marañas | Micro-trabajos Barriales | HU-53, HU-54 | [`08-derivacion-cierre-maranas/`](evidencias/08-derivacion-cierre-maranas/resumen.md) | [`08-secuencia-derivacion-cierre-maranas.md`](diagramas/08-secuencia-derivacion-cierre-maranas.md) | **PASA** |
| **09** | Directorio y Gestión de Negocios Locales | Ecosistema Comercial | HU-55 a HU-60 | [`09-directorio-negocios-locales/`](evidencias/09-directorio-negocios-locales/resumen.md) | [`09-secuencia-directorio-negocios-locales.md`](diagramas/09-secuencia-directorio-negocios-locales.md) | **PASA** |
| **10** | Anuncios Laborales de Negocios | Empleo de Proximidad | HU-61, HU-62 | [`10-anuncios-laborales-negocios/`](evidencias/10-anuncios-laborales-negocios/resumen.md) | [`10-secuencia-anuncios-laborales-negocios.md`](diagramas/10-secuencia-anuncios-laborales-negocios.md) | **PASA** |
| **11** | Billetera Digital, Recargas y Coins | Custodia y Gamificación | HU-25 a HU-28, HU-66 a HU-68 | [`11-billetera-recargas-monedas/`](evidencias/11-billetera-recargas-monedas/resumen.md) | [`11-secuencia-billetera-recargas-monedas.md`](diagramas/11-secuencia-billetera-recargas-monedas.md) | **PASA** |
| **12** | Mensajería y Chat en Tiempo Real WebSockets | Comunicación Viva | HU-29 a HU-32, HU-69 | [`12-mensajeria-chat-tiempo-real/`](evidencias/12-mensajeria-chat-tiempo-real/resumen.md) | [`12-secuencia-mensajeria-chat-tiempo-real.md`](diagramas/12-secuencia-mensajeria-chat-tiempo-real.md) | **PASA** |
| **13** | Notificaciones Push, In-App y Alertas | Alertas Multicanal | HU-33, HU-34, HU-35, HU-70 | [`13-notificaciones-alertas/`](evidencias/13-notificaciones-alertas/resumen.md) | [`13-secuencia-notificaciones-alertas.md`](diagramas/13-secuencia-notificaciones-alertas.md) | **PASA** |
| **14** | Moderación, Soporte y Superadmin | Gobernanza Global | RF-73 a RF-76, RNF-AUD, RNF-CFG | [`14-moderacion-soporte-superadmin/`](evidencias/14-moderacion-soporte-superadmin/resumen.md) | [`14-secuencia-moderacion-soporte-superadmin.md`](diagramas/14-secuencia-moderacion-soporte-superadmin.md) | **PASA** |

*Nota sobre Flujos 15, 16 y 17:* Corresponden a microservicios headless de backend (Quizzes, Admin Staff e Infraestructura de Despliegue) sin pantallas interactivas de usuario en React. Su justificación arquitectónica formal se encuentra documentada en [`evidencias/justificacion-alcance-flujos-15-17.md`](evidencias/justificacion-alcance-flujos-15-17.md); sus capacidades clave fueron probadas en el Flujo 14.

---

## 5. Decisiones Arquitectónicas y Patrones Fundamentales

1. **Privacidad Diferencial de Coordenadas (RF-04):** En el feed público de chambas (`GET /solicitudes/`), las coordenadas exactas (`latitud`, `longitud`, `direccion`) se purgan en la capa de serialización Marshmallow, revelándose únicamente tras el perfeccionamiento legal del contrato bilateral con firma digital.
2. **Revocación Desacoplada sin Blacklist en Memoria (`role_version`):** El claim `role_v` viaja encapsulado en el token JWT. Al suspender a un usuario o modificar su perfil, la base de datos incrementa `user.role_version`, invalidando de forma instantánea cualquier token activo sin requerir consultas de Redis en cada petición REST.
3. **Fronteras Regionales Estrictas (`region_scope_id` - RF-76):** Los administradores territoriales están restringidos por jurisdicción departamental. Si intentan arbitrar controversias ajenas a su demarcación, el backend devuelve `HTTP 404 Recurso no encontrado en tu región`. Solo el rol `superadmin` posee autoridad conciliatoria universal (`scope = None`).
4. **Máquina de Estados Finita (FSM) de 6 Hitos Operativos:** La obra transiciona formalmente bajo verificación estricta: Check-in GPS Haversine (<100m) -> Evidencia de Entrada en MinIO -> Adendas -> Novedades -> Evidencia de Salida -> Doble Conformidad de Pago -> Calificación bilateral.
5. **Derivación Ágil de Marañas:** Tareas técnicas no cubiertas por el prestador principal se derivan de la adenda contractual hacia el tablón de micro-trabajos barriales, descontando el valor de la orden madre y previniendo la doble imputación de costos al contratante.
6. **Invariante Contable de Partida Doble en Billetera Digital:** Cada movimiento financiero (recargas, transferencias, compra de ChambeCoins) genera un asiento inmutable en `wallet_transactions` con cálculo atómico del balance resultante. Los retiros bancarios trasladan saldo a `saldo_bloqueado` bajo retención preventiva Escrow.
7. **Protocolo Ligero de Mensajería Estructurada (`⟦c:...⟧`):** Para mantener un esquema liviano en la tabla `messages`, las acciones contractuales (condiciones, contraofertas y acuerdos) viajan como texto serializado y son compiladas dinámicamente por el frontend en tarjetas interactivas de primer nivel.
8. **Pistas Inmutables de Auditoría Forense (RNF-AUD):** Cada intervención administrativa (aprobación KYC, conmutación de banderas, laudos de disputas) genera un registro inmutable en `audit_logs` con `actor_id`, `ip_address`, `timestamp_utc` y `snapshot_diff` de la operación.
9. **Gobernanza de Feature Flags en Tiempo Real (RNF-CFG):** Algoritmos de inteligencia artificial como `ml_ranking_enabled` se activan o desactivan en caliente mediante la tabla `feature_flags`, eliminando la necesidad de reinicios o redeploys en los contenedores Docker de producción.

---

## 6. Recursos para el Jurado Calificador

Para la revisión exhaustiva y sustentación de la tesis de maestría, consulte los siguientes documentos específicos:
* **[Fase6_Resumen_Ejecutivo_Sustentacion.md](auditoria/Fase6_Resumen_Ejecutivo_Sustentacion.md):** Guión ejecutivo para la exposición oral (15 a 20 minutos), diapositivas sugeridas y argumentario técnico para la ronda de preguntas y respuestas.
* **[Guia_Reejecucion_Evidencias.md](auditoria/Guia_Reejecucion_Evidencias.md):** Manual técnico paso a paso para desplegar el stack localmente y re-ejecutar de forma autónoma los 14 scripts Playwright.
* **[Fase4_Consolidado_Evidencias_E2E.md](auditoria/Fase4_Consolidado_Evidencias_E2E.md):** Informe consolidado de auditoría de red, consumo de APIs y transacciones PostgreSQL.
