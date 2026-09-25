# ChambeApp Documentation CHANGELOG

All notable changes to documentation will be documented in this file.

## [1.8.1] - 2026-09-25

### Added (registro previo a limpieza)
- Documentación externa registrada en `Chambeapp_Doc` antes de su eliminación:
  - `Branding/DesignSystem/` — `01-tokens` a `06-decisiones-abiertas` (design system completo).
  - `Frontend/MAPBOX.md`, `Branding/Ajuste_Contraste.md`, `Arquitectura/Estado_Implementacion.md`,
    `Arquitectura/Hoja_De_Tests.md`, `Arquitectura/Documentacion_Software.md`,
    `Contexto/Landing_Brief.md`, `AgentsWorkFlows/AGENTE_UIUX.md`, `AgentsWorkFlows/flujo_UI_Ux.md`.
- **`Arquitectura/Infraestructura_Regional.md`** — definición de infraestructura para la
  separación regional: balanceador de carga, réplicas de API, HA de PostgreSQL (Patroni),
  Redis (Sentinel), MinIO distribuido, control plane global vs data planes, roadmap
  (Etapa 0 actual → 1 HA → 2 regional operativo → 3 aislamiento físico opcional) y
  diagrama `13_infraestructura_regional.puml/.utxt/.png`.
- **`Arquitectura/Paso_A_Paso_Infraestructura_Regional.md`** — guía ejecutable paso a paso
  para conectar las regiones: identificación regional por ubicación (catálogo, detect,
  reindex), topología, balanceador de carga, réplicas + Socket.IO MQ, HA de Postgres/Redis,
  MinIO por región, aislamiento del personal, observabilidad por región y verificación
  end-to-end con checklist.

### Removed
- Documentación externa redundante (ya consolidada/superada en `Chambeapp_Doc`):
  - Raíz del repo: `ROLE_*.md` (6), `COMMON_COMPONENTS.md`, `contrato de servicio.md`,
    `modulo chambas.md`, `PLAN_IMPLEMENTACION_MODULO_CHAMBAS.md/.pdf`,
    `modeulo de oficio y habilidades.md`, `lista de oficion y habilidades.md`,
    `PRD - Módulo Negocios (Chamba App) V3.md`, `continuacion.md`.
  - Carpeta `docs/` completa (análisis, planes, estado, design-system legacy, MAPBOX, tests).
  - Carpeta `Chambeapp_product_brief/` (brief y brand-manual, migrados/equivalentes).
- Se conservan: `.json`, carpetas de agentes (`agent/`, `.claude/`, `.opencode/`, `.agents/`,
  `Chambeapp_Doc/AgentsWorkFlows/`), `frontend-guides/` (mockups de diseño referenciados por el DS)
  y `Chambeapp_promo_video/`.

## [1.8.0] - 2026-09-25

### Added
- **Consolidación de documentación externa** en `Chambeapp_Doc`: se analizaron
  todos los documentos fuera de la carpeta (raíz del repo, `docs/`,
  `Chambeapp_product_brief/`) y se anexó lo faltante.
- **Nuevos RFs (RF-49..RF-75)**, 27 requerimientos en archivos separados:
  - `Requerimientos/RF_Modulo_Chambas_Maranas.md` (RF-49..RF-60)
  - `Requerimientos/RF_Modulo_Oficios_Habilidades.md` (RF-61..RF-66)
  - `Requerimientos/RF_Modulo_Anuncios_Laborales.md` (RF-67..RF-69)
  - `Requerimientos/RF_Division_Regional.md` (RF-70..RF-75)
  - `Requerimientos/Roles_y_UI.md` (consolida los 6 ROLE_*.md de la raíz)
- `Contexto/Contrato_Servicio.md` — blindaje legal de intermediación (Ley 527/1562).
- `Arquitectura/Contratos_API.md` — inventario completo de 36 blueprints / 218 endpoints.
- `Arquitectura/Modelo_Datos_Actual.md` — inventario de 47 modelos SQLAlchemy.
- `Arquitectura/Arquitectura_Admin_Frontend.md` — arquitectura del panel admin (JS/Vite).
- `Frontend/Estado_Frontend.md` — estado y divergencias de los 2 frontends.
- Diagramas nuevos: `11_regiones.puml`, `12_arquitectura_admin_frontend.puml` (+ `.utxt`).
- `README.md` — índice navegable de toda la documentación.

### Changed
- `Arquitectura/Arquitectura_Software.md` (v2.1): 24→**36 blueprints** REST +
  3 handlers Socket.IO; añadidos módulos chambas, marañas, ofertas, anuncios,
  negocios/merchant, habilidades, división regional y frontend admin.
- `Arquitectura/diagramas/04_modelo_datos.puml` y `05_casos_uso.puml`: añadidas
  entidades y actores faltantes (Region, Chamba, Marana, Oferta, Anuncio,
  Negocio, Habilidad, roles admin/merchant/verificador/soporte/superadmin).
- `Arquitectura/diagramas/01_componentes.puml`: 24→36 blueprints + bloques nuevos.
- `Arquitectura/Pruebas.md`: conteos reales **516 tests backend** (44 archivos) +
  **385 frontend cliente** (43 archivos) + frontend admin 0 (deuda); inventario por archivo.
- `GUIA_DESPLIEGUE.md`: frontend admin (puerto 5174, build, vhost), migración
  014, seed de regiones automático, Python 3.14, `docker-compose.dev.yml`.

## [1.7.0] - 2026-09-18

### Changed
- **Pagos directos sin retención**: eliminado por completo el sistema de retención/liberación de pagos.
  - Backend: fuera el estado `confirmado` y la columna `payments.liberado_en`; fuera los endpoints `POST /payments/<id>/release` y `POST /payments/admin/auto-release`; fuera la tarea Celery `auto_release_payments`, la config `ESCROW_AUTO_RELEASE_HOURS` y el valor `payment_release_hours`.
  - Disputas: fuera `disputes.payment_action` y la congelación de fondos; la resolución es solo informativa.
  - Migración `008_drop_payment_retention` (dropea columnas y recrea el enum `estadopago` sin `CONFIRMADO`).
- `Terminos_y_Condiciones.md`, `Flujo_Aplicacion.md`, `Requerimientos.md`, `HistoriasDeUsuario.md`, `Arquitectura_Software.md`: eliminadas referencias a retención/liberación de fondos y congelamiento por disputa; los hitos ya no "liberan/congelan" pagos, solo se aprueban o rechazan.
- Guías `frontend-guides`: `sol-contratos.html` sin modal "Liberar pago"; `pds-billetera.html`, `pds-disputas.html` y `terminos-y-condiciones.html` sin lenguaje de retención/liberación.

## [1.6.0] - 2026-09-13

### Added
- **KYC Upload Flow (Frontend)**: `KycDocumentsPage.tsx` — página completa de subida de documentos KYC con:
  - Barra de progreso general (obligatorios aprobados / total)
  - Acordeón por grupo (Identidad, Antecedentes, Financiero, Opcionales)
  - Tarjetas de documento con estado, descripción y zonas de subida drag-and-drop
  - Soporte multi-instancia: prompt para nombre de instancia al subir docs multi-instancia
  - Estados visuales: aprobado (verde), pendiente (amarillo), en revisión (azul), rechazado (rojo)
- **Dashboard Shell**: Layout con sidebar fijo + contenido principal; responsive con bottom bar en móvil
- **Dashboard tabs**: Inicio (PDS Home), Documentos KYC, Mi perfil — con navegación lateral
- **KYC API service**: `kycApi.ts` — fetchDocumentosRequeridos, fetchMisDocumentos, uploadDocumento
- **KYC types**: `types/kyc.ts` — DocumentoRequerido, DocumentoUsuario, KycDocView, GRUPO_LABELS
- Política KYC: 4 nuevos documentos requeridos para PDS:
  - `comprobante_residencia` (grupo identidad, obligatorio) — Recibo de servicios o extracto bancario.
  - `antecedentes_procuraduria` (grupo antecedentes, obligatorio) — Antecedentes disciplinarios Procuraduría General.
  - `antecedentes_contraduria` (grupo antecedentes, obligatorio) — Responsabilidad fiscal Contraloría General.
  - `certificado_laboral` (grupo opcional, multi-instancia) — Referencia de empleo por cada empleo.
- Soporte multi-instancia en el modelo KYC: campo `multi_instancia` en `DocumentoRequerido` y campo `instancia` en `DocumentoUsuario`.
- Documentos multi-instancia: `cert_bancaria` (una por cuenta), `validacion_profesional` (una por habilidad), `certificado_laboral` (una por empleo).

### Changed
- `seed.py`: catálogo KYC PDS ampliado de 7 a 11 documentos; añadido flag `multi_instancia` por documento.
- `app/models/kyc.py`: campo `multi_instancia` en `DocumentoRequerido`; campo `instancia` en `DocumentoUsuario`; constraint único cambiado a `(user_id, documento_clave, instancia)`.
- `app/routes/kyc.py`: endpoints `/documentos-requeridos` y `/mis-documentos` exponen `multi_instancia`; upload soporta `instancia` para docs multi-instancia; `_recalcular_verificado` verfica al menos una instancia aprobada por clave obligatoria.
- `app/schemas/kyc.py`: schemas exponen `multi_instancia` e `instancia`.
- Política KYC (`ChambeApp_Politica_KYC.md`): reescrita completamente con tablas, grupos, docs multi-instancia, flujo de verificación y endpoints.

## [1.5.0] - 2026-09-06

### Added
- Plan Free (gratis, por defecto) al modelo de suscripción: todo usuario nuevo queda en Free (3 postulaciones/mes) hasta comprar un plan.
- Escalonado de postulaciones por plan: Free 3/mes, Básico 15/mes, Profesional ilimitadas.

### Changed
- subscriptions.py: catálogo de planes ampliado a 3 niveles (Free/Básico/Profesional) con tagline, precios y beneficios; nueva constante `PLANES_LIMITE_POSTULACIONES`.
- ofertas.py: límite de postulaciones escalonado por plan (antes Free y Básico compartían 5/mes).
- schemas/subscription.py: PlanSchema con campo `tagline`.
- data/tyc.py + Terminos_y_Condiciones.md: sección 7.2 reescrita con los 3 planes.
- Monetizacion.md: sección 10.2 con tabla de 3 planes.
- Requerimientos.md (RF-11) y HistoriasDeUsuario.md (HU-11): reescritos con plan Free y límites escalonados.
- Frontend: PlanesPage.tsx (3 tarjetas, Free como "plan actual", tagline, "Gratis"), LandingPage.tsx (3 planes + subtítulo "Planes que crecen contigo"), subscriptionsApi.ts (campo tagline).
- Tests: test_subscriptions.py actualizado (3 planes, límite Free=3, nuevo test límite Básico=15).

## [1.4.0] - 2026-09-05

### Added
- Arquitectura/Arquitectura_Software.md: integradas secciones de módulos IA/Confianza/Geocerca/Tiempo Real — diagrama alto nivel (Motor IA, Tiempo Real, MinIO), tabla de tecnologías (LightGBM, PostGIS, Socket.IO, MinIO, Mapbox, A-Frame, Celery), mapeo de módulos (`ai/*`, `services/trust|cascade|storage`, `routes/portfolio|ai_metrics|notification_socket`, `models/trust|badges|cascade|recommendation_log`), estructura de carpetas backend/frontend, endpoints API (`ai/recommendations`, `trust/{pds_id}`, `portfolio`, `radio_km`) y sección Socket.IO Events; nuevas secciones 9 (Módulos Implementados) y 10 (Diagramas, índice de 9 diagramas).
- Requerimientos/Requerimientos.md: 11 nuevos RFs implementados (RF-ML-1/2/3/4, RF-Trust-1/2, RF-Geo-1/2, RF-360-1, RF-UI-1/2) en formato EARS.
- Requerimientos/HistoriasDeUsuario.md: HUs HU-30..HU-40 + casos de uso para los nuevos RFs.
- Contexto/Flujo_Aplicacion.md: enriquecido con geofence/ML en PUNTO 2-3 y nuevas secciones (Modelo de Recomendación ML, Sistema de Confianza, Portafolio y Visor 360°, Notificaciones en Tiempo Real Socket.IO).
- Branding/Sistema_Diseno.md: sistema de diseño (tokens de color, tipografía, espaciado, radios, sombras, movimiento, accesibilidad) derivado de la implementación UI/UX.
- Arquitectura/diagramas: 6 diagramas `.puml` regenerados para reflejar la arquitectura real (ML 2 etapas, geocerca en cascada, Socket.IO, trust, portfolio, 24 blueprints) + 3 nuevos (`07_pipeline_recomendacion`, `08_cascada_geoespacial`, `09_tiempo_real_socketio`); renderizados a `.utxt` (ASCII) y `.png`.
- GUIA_DESPLIEGUE.md: guía de despliegue en desarrollo (primera vez, SQLite por defecto) y en producción (Docker Compose + gunicorn/eventlet + Nginx PWA, Redis MQ, MinIO, migraciones, feature flags ML).
- Arquitectura/Plan_Implementacion.md: plan de implementación sintetizado (6 fases, decisiones técnicas, estado ✅).
- Arquitectura/Pruebas.md: documentación de calidad sintetizada (482 tests, 7 flujos, comandos, bugs corregidos).

### Changed
- Arquitectura/Arquitectura_Software.md: versión 2.0 ampliada con motor de recomendación ML, geocerca en cascada y notificaciones en tiempo real.

> Nota: `AGENTE_UIUX.md` NO se integró en la documentación del producto (es una herramienta de trabajo externa para facilitar el desarrollo).

## [1.3.0] - 2026-09-01

### Changed
- Monetizacion.md: Eliminado plan Empresa ($75k) - solo Básico ($15k) y Profesional ($35k)
- Monetizacion.md: Eliminado sistema escrow - pagos directos sin retención
- Monetizacion.md: Actualizadas proyecciones financieras
- Terminos_y_Condiciones.md: Eliminado plan Empresa de planes de suscripción
- Flujo_Aplicacion.md: Eliminada referencia a escrow automático
- ANALISIS_MONETIZACION.md: Actualizado para reflejar cambios (38.5% implementado)

## [1.2.0] - 2026-09-01

### Added
- Flujo de Aplicacion.md: Documento completo del flujo de la aplicación
- RF-22: Sistema de Desbloqueo de Información (nuevo)
- RF-23: Confirmación Dual de Finalización (nuevo)
- RF-24: Gestión de Ofertas (nuevo)
- HU-19: Desbloqueo de Información (nueva)
- HU-20: Confirmación Dual (nueva)
- HU-21: Gestión de Ofertas (nueva)
- Actualización de matriz de trazabilidad (HU-19 a HU-21)

### Changed
- Requerimientos.md: Agregados RF-22, RF-23, RF-24
- HistoriasDeUsuario.md: Agregadas HU-19, HU-20, HU-21
- Monetizacion.md: Eliminado plan Empresa ($75k) - solo Básico ($15k) y Profesional ($35k)
- Monetizacion.md: Eliminado sistema escrow - pagos directos sin retención
- Requerimientos.md: Eliminadas referencias a plan Empresa y escrow
- HistoriasDeUsuario.md: Eliminadas referencias a plan Empresa y escrow
- Flujo_Aplicacion.md: Eliminada referencia a escrow automático
- Terminos_y_Condiciones.md: Eliminado plan Empresa de planes de suscripción
- Arquitectura_Software.md: Eliminadas referencias a escrow
- Diagramas PlantUML: Actualizados para eliminar escrow
- seed/test_dev.md: Eliminada referencia a escrow

### Fixed
- Completamiento de gaps críticos en flujo de aplicación

## [1.1.0] - 2026-09-01

### Added
- RF-18/19/20/21 user stories documented
- RNF-AUD (Roles: admin/superadmin/verificador/soporte) NFRs
- User role renaming: trabajador ↔ pdS, empleador ↔ solicitante
- Credenciales de usuarios demo y guía test_dev local
- Architecture diagrams (5 PlantUML diagrams)
- Branding manual and design tokens (CSS custom properties)
- Monetization model: virtual coins (1 moneda = $100 COP), commissions
- Legal terms: Colombian labor law, Habeas Data documentation
- Full requirements in EARS format (RF-01 to RF-17 + 7 NFRs)
- User stories (HU-01 to HU-18) with acceptance criteria

### Changed
- Renamed archived doc/ copies to Chambeapp_Doc canonical location
- Updated architecture documentation with PlantUML sources
- Improved requirements traceability matrix

### Fixed
- Documentation consistency fixes
- Role naming alignment across all docs

## [1.0.0] - 2026-08-18

### Added
- Initial documentation setup
- Architecture overview and folder structure
- Branding assets and logo
- Requirements base doc and monetization terms
- Legal terms and conditions (Colombian labor law)