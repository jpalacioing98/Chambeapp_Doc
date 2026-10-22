# Directorio de Evidencias de Arquitectura (Fase 4 E2E)

> **Auditoría de Maestría en Ingeniería de Software**  
> **Proyecto:** ChambeApp — Plataforma de Servicios y Formalización Laboral  
> **Fecha:** Octubre 2026  
> **Estado:** **100% COMPLETADO (14 de 14 Flujos E2E PASA)**

---

## 1. Estructura del Directorio de Evidencias

Cada subdirectorio contiene el paquete completo de evidencia técnica reproducible generado mediante Playwright Chromium + SwiftShader:
* `capturas/`: 10 a 12 capturas de pantalla secuenciales en alta resolución.
* `video/`: Grabación continua completa en formato `.webm`.
* `script/`: Script de automatización `.cjs` ejecutable de forma autónoma.
* `resumen.md`: Informe técnico de arquitectura, auditoría de red HTTP y consistencia en PostgreSQL.

---

## 2. Índice de Carpetas por Flujo Evaluado

| Flujo | Denominación del Flujo | Directorio de Evidencias |
|:---:|:---|:---:|
| **01** | Autenticación y Registro de Usuarios | [`01-autenticacion-registro/`](01-autenticacion-registro/resumen.md) |
| **02** | Perfil de Usuario y Verificación de Identidad (KYC) | [`02-perfil-kyc/`](02-perfil-kyc/resumen.md) |
| **03** | Publicación de Solicitudes de Chamba (Geocerca y 360°) | [`03-publicacion-chamba/`](03-publicacion-chamba/resumen.md) |
| **04** | Exploración Geoespacial y Postulación de Ofertas (PDS) | [`04-exploracion-postulacion-pds/`](04-exploracion-postulacion-pds/resumen.md) |
| **05** | Negociación Bilateral de Ofertas y Firma Digital de Contrato | [`05-negociacion-contrato-firma/`](05-negociacion-contrato-firma/resumen.md) |
| **06** | Ejecución y Ciclo Operativo de la Chamba (6 Hitos) | [`06-ejecucion-ciclo-operativo/`](06-ejecucion-ciclo-operativo/resumen.md) |
| **07** | Pago Dual Directo y Calificación Mutua | [`07-pago-dual-calificacion/`](07-pago-dual-calificacion/resumen.md) |
| **08** | Derivación y Cierre Ágil de Marañas (Rebusques) | [`08-derivacion-cierre-maranas/`](08-derivacion-cierre-maranas/resumen.md) |
| **09** | Directorio y Gestión de Negocios Locales | [`09-directorio-negocios-locales/`](09-directorio-negocios-locales/resumen.md) |
| **10** | Anuncios Laborales de Negocios | [`10-anuncios-laborales-negocios/`](10-anuncios-laborales-negocios/resumen.md) |
| **11** | Billetera Digital, Recargas Simuladas y Paquetes de Monedas | [`11-billetera-recargas-monedas/`](11-billetera-recargas-monedas/resumen.md) |
| **12** | Mensajería y Chat en Tiempo Real WebSockets | [`12-mensajeria-chat-tiempo-real/`](12-mensajeria-chat-tiempo-real/resumen.md) |
| **13** | Notificaciones Push, In-App y Centro de Alertas | [`13-notificaciones-alertas/`](13-notificaciones-alertas/resumen.md) |
| **14** | Moderación, Soporte y Auditoría Superadmin | [`14-moderacion-soporte-superadmin/`](14-moderacion-soporte-superadmin/resumen.md) |

---

## 3. Delimitación de Alcance de Flujos Restantes (Flujos 15, 16 y 17)

Para conocer la justificación arquitectónica detallada sobre por qué los flujos 15, 16 y 17 corresponden a servicios de API y gobernanza de infraestructura sin pantallas interactivas de usuario en React, consultar:
* **[justificacion-alcance-flujos-15-17.md](justificacion-alcance-flujos-15-17.md)**

Para el informe consolidado maestro de la Fase 4 con estadísticas completas y hallazgos de maestría, consultar:
* **[Fase4_Consolidado_Evidencias_E2E.md](../auditoria/Fase4_Consolidado_Evidencias_E2E.md)**
