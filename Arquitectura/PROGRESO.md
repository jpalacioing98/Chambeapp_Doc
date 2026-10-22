# Registro de avance — Auditoría y sustentación (ChambeApp)

> Checklist general de las 6 fases. Se actualiza al cerrar cada fase.
> Regla base: **el código manda sobre la documentación**. No se modifica código de la app.

- [x] **Fase 1 — Análisis y contraste HU vs. código** → [Informe de Discrepancias](auditoria/Fase1_Informe_Discrepancias.md)
  - Resultado: HU desactualizadas (10 Altas, 11 Medias, 5 Bajas, 4 hallazgos de seguridad).
- [x] **Fase 2 — Plan y actualización de historias de usuario** → [Plan Ejecutado](auditoria/Fase2_Plan_Actualizacion_HU.md)
  - Resultado:
    - [Registro de Riesgos Conocidos](auditoria/Riesgos_Conocidos.md) creado (R-01 a R-19: brechas de seguridad y limitaciones operativas documentadas sin alterar el código).
    - [Historias de Usuario v3.0](../Requerimientos/HistoriasDeUsuario.md) actualizado y consolidado al 100% (HU-01 a HU-75 con formato EARS, casos de uso y matriz de trazabilidad integral).
    - [Informe de Empalme de Flujos vs Código](auditoria/Fase2_Empalme_Flujos_Codigo.md) creado (13 flujos visuales end-to-end con UI y 3 flujos de API verificados).
- [x] **Fase 3 — Documentación de flujos** → [Documento de Flujos Oficial](flujos-chambeapp.md)
  - Resultado: 17 flujos completamente documentados (14 flujos UI End-to-End para automatización en Fase 4 y 3 flujos de API/Gobernanza) con actores, precondiciones, paso a paso frontend/backend/DB, casos alternos y matriz de trazabilidad con HU-01 a HU-75.
  - Pendiente: confirmación del usuario para iniciar la Fase 4 (Testeo automatizado con Obscura).
- [x] **Fase 4 — Testeo automatizado por flujo** con evidencias en `Arquitectura/evidencias/NN-nombre-flujo/` (14/14 Flujos 100% PASA)
  - [x] **Paso 0 — Verificaciones previas** (Servicios arriba, Mapbox token presente, WebGL SwiftShader operativo).
  - [x] **Flujo 01 — Autenticación y Registro de Usuarios** → [Evidencias](evidencias/01-autenticacion-registro/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 02 — Perfil de Usuario y Verificación de Identidad (KYC)** → [Evidencias](evidencias/02-perfil-kyc/resumen.md) (11 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 03 — Publicación de Solicitudes de Chamba (Geocerca y 360°)** → [Evidencias](evidencias/03-publicacion-chamba/resumen.md) (12 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 04 — Exploración Geoespacial y Postulación de Ofertas (PDS)** → [Evidencias](evidencias/04-exploracion-postulacion-pds/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 05 — Negociación Bilateral de Ofertas y Firma Digital de Contrato** → [Evidencias](evidencias/05-negociacion-contrato-firma/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 06 — Ejecución y Ciclo Operativo de la Chamba (6 Hitos)** → [Evidencias](evidencias/06-ejecucion-ciclo-operativo/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 07 — Pago Dual Directo y Calificación Mutua** → [Evidencias](evidencias/07-pago-dual-calificacion/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 08 — Derivación y Cierre Ágil de Marañas (Rebusques)** → [Evidencias](evidencias/08-derivacion-cierre-maranas/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 09 — Directorio y Gestión de Negocios Locales** → [Evidencias](evidencias/09-directorio-negocios-locales/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 10 — Anuncios Laborales de Negocios** → [Evidencias](evidencias/10-anuncios-laborales-negocios/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 11 — Billetera Digital, Recargas Simuladas y Paquetes de Monedas** → [Evidencias](evidencias/11-billetera-recargas-monedas/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 12 — Mensajería y Chat en Tiempo Real WebSockets** → [Evidencias](evidencias/12-mensajeria-chat-tiempo-real/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 13 — Notificaciones Push, In-App y Centro de Alertas** → [Evidencias](evidencias/13-notificaciones-alertas/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - [x] **Flujo 14 — Moderación, Soporte y Auditoría Superadmin** → [Evidencias](evidencias/14-moderacion-soporte-superadmin/resumen.md) (10 capturas, video `.webm`, script `.cjs`).
  - *Nota de Alcance:* Los flujos 15, 16 y 17 corresponden a servicios de API y gobernanza interna sin vistas en React (ver [Justificación de Alcance](evidencias/justificacion-alcance-flujos-15-17.md)). Las capacidades críticas de los flujos 16 y 17 fueron probadas e integradas en el Flujo 14.
- [x] **Fase 5 — Diagramas de secuencia (Mermaid)** en `Arquitectura/diagramas/NN-nombre-flujo.md` (14/14 Flujos 100% Completados)
  - [x] **Flujo 01 — Autenticación, Registro y Seguridad Multi-Rol** → [Diagrama](diagramas/01-secuencia-autenticacion-registro.md)
  - [x] **Flujo 02 — Perfil de Usuario y Verificación KYC** → [Diagrama](diagramas/02-secuencia-perfil-kyc.md)
  - [x] **Flujo 03 — Publicación de Solicitudes (Geocerca y 360°)** → [Diagrama](diagramas/03-secuencia-publicacion-chamba.md)
  - [x] **Flujo 04 — Exploración Geoespacial y Postulación PDS** → [Diagrama](diagramas/04-secuencia-exploracion-postulacion-pds.md)
  - [x] **Flujo 05 — Negociación Bilateral y Firma de Contrato** → [Diagrama](diagramas/05-secuencia-negociacion-contrato-firma.md)
  - [x] **Flujo 06 — Ejecución y Ciclo Operativo (6 Hitos)** → [Diagrama](diagramas/06-secuencia-ejecucion-ciclo-operativo.md)
  - [x] **Flujo 07 — Pago Dual Directo y Calificación Mutua** → [Diagrama](diagramas/07-secuencia-pago-dual-calificacion.md)
  - [x] **Flujo 08 — Derivación y Cierre Ágil de Marañas** → [Diagrama](diagramas/08-secuencia-derivacion-cierre-maranas.md)
  - [x] **Flujo 09 — Directorio y Gestión de Negocios Locales** → [Diagrama](diagramas/09-secuencia-directorio-negocios-locales.md)
  - [x] **Flujo 10 — Anuncios Laborales de Negocios** → [Diagrama](diagramas/10-secuencia-anuncios-laborales-negocios.md)
  - [x] **Flujo 11 — Billetera Digital, Recargas y Coins** → [Diagrama](diagramas/11-secuencia-billetera-recargas-monedas.md)
  - [x] **Flujo 12 — Mensajería y Chat en Tiempo Real WebSockets** → [Diagrama](diagramas/12-secuencia-mensajeria-chat-tiempo-real.md)
  - [x] **Flujo 13 — Notificaciones Push, In-App y Alertas** → [Diagrama](diagramas/13-secuencia-notificaciones-alertas.md)
  - [x] **Flujo 14 — Moderación, Soporte y Superadmin** → [Diagrama](diagramas/14-secuencia-moderacion-soporte-superadmin.md)
  - [x] **Catálogo Maestro e Interacción Arquitectónica** → [README de Diagramas](diagramas/README.md)
- [x] **Fase 6 — Material de sustentación** (`Arquitectura/README.md` + resúmenes ejecutivos + guía de re-ejecución) (100% Culminado)
  - [x] **Portal Maestro de Arquitectura y Sustentación:** [`documentation/Arquitectura/README.md`](README.md)
  - [x] **Resumen Ejecutivo y Guión para Jurado Calificador:** [`auditoria/Fase6_Resumen_Ejecutivo_Sustentacion.md`](auditoria/Fase6_Resumen_Ejecutivo_Sustentacion.md)
  - [x] **Guía de Re-ejecución Autónoma de Pruebas E2E:** [`auditoria/Guia_Reejecucion_Evidencias.md`](auditoria/Guia_Reejecucion_Evidencias.md)
  - [x] **Conclusión Oficial:** Las 6 fases de la auditoría arquitectónica de maestría han sido cerradas al 100% con trazabilidad completa y cero alteraciones de código fuente.

## Notas de entorno

- Repositorios: `backend/` (Flask, rama `Dev`), `frontend/` (Vite/React, rama `Dev`), `documentation/` (rama `dev`).
- Herramienta de automatización: **Obscura v0.2.5** (instalada en `D:\Programs\obscura`, disponible como `obscura`).
- Carpeta de arquitectura existente: `documentation/Arquitectura/` (incluye `diagramas/` con 13 `.puml`).
