# ChambeApp — Índice de Documentación

Documentación canónica del proyecto ChambeApp. Fuente única de verdad para
requerimientos, arquitectura, roles, contratos de API, modelo de datos,
diseño y despliegue. Mantenida por el agente `docs` (AUP) contra el código
real de `Chambeapp_backend`, `Chambeapp_frontend` y `Chambeapp_admin_frontend`.

Última sincronización con código: **2026-09-25** (RF-01..RF-75, 36 blueprints,
3 repos).

## 🗂 Estructura

| Carpeta | Contenido |
|---|---|
| [Contexto/](Contexto/) | Problema, tesis, flujo de aplicación, monetización, KYC, T&C, contrato de servicio, landing brief |
| [Requerimientos/](Requerimientos/) | RF-01..RF-75, historias de usuario, módulos, roles y UI |
| [Arquitectura/](Arquitectura/) | Arquitectura de software, plan, pruebas, contratos API, modelo de datos, estado, diagramas |
| [Branding/](Branding/) | Manual de marca, sistema de diseño, tokens, design system (tokens/componentes/reglas/CSS/iconos/decisiones) |
| [Frontend/](Frontend/) | Estado, divergencias, guía del mapa Mapbox y tests de los frontends |
| [seed/](seed/) | Credenciales y guía de pruebas de desarrollo |
| [AgentsWorkFlows/](AgentsWorkFlows/) | Configuración AUP/OpenCode: agentes, prompts, skills y flujos UI/UX |
| [GUIA_DESPLIEGUE.md](GUIA_DESPLIEGUE.md) | Despliegue dev/prod (backend + 2 frontends) |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios de la documentación |

## 📄 Requerimientos (RF-01..RF-75)

**Core (v1):** [Requerimientos.md](Requerimientos/Requerimientos.md) — RF-01..RF-30 +
RF-ML/Trust/Geo/360/UI + NFR. **Historias de usuario:** [HistoriasDeUsuario.md](Requerimientos/HistoriasDeUsuario.md) (HU-01..HU-40).

**Módulos (RF-31..RF-75):**
- **Comerciante/Negocios** (RF-31..RF-48): [RF_Modulo_Comerciante.md](Requerimientos/RF_Modulo_Comerciante.md)
- **Chambas y Marañas** (RF-49..RF-60): [RF_Modulo_Chambas_Maranas.md](Requerimientos/RF_Modulo_Chambas_Maranas.md)
- **Oficios y Habilidades** (RF-61..RF-66): [RF_Modulo_Oficios_Habilidades.md](Requerimientos/RF_Modulo_Oficios_Habilidades.md)
- **Anuncios Laborales** (RF-67..RF-69): [RF_Modulo_Anuncios_Laborales.md](Requerimientos/RF_Modulo_Anuncios_Laborales.md)
- **División Regional** (RF-70..RF-75): [RF_Division_Regional.md](Requerimientos/RF_Division_Regional.md)
- **Roles y UI por rol** (niveles 1-4): [Roles_y_UI.md](Requerimientos/Roles_y_UI.md)

## 🏗 Arquitectura

- [Arquitectura_Software.md](Arquitectura/Arquitectura_Software.md) — stack (36 blueprints
  REST + 3 handlers Socket.IO), módulos, despliegue, eventos.
- [Contratos_API.md](Arquitectura/Contratos_API.md) — inventario completo de
  blueprints, rutas, métodos y permisos (218 endpoints).
- [Modelo_Datos_Actual.md](Arquitectura/Modelo_Datos_Actual.md) — inventario de
  47 modelos SQLAlchemy.
- [Arquitectura_Admin_Frontend.md](Arquitectura/Arquitectura_Admin_Frontend.md) —
  panel administrativo (React+Vite+JS, features por rol, guards, servicios).
- [Plan_Implementacion.md](Arquitectura/Plan_Implementacion.md) y [Pruebas.md](Arquitectura/Pruebas.md).
- [Infraestructura_Regional.md](Arquitectura/Infraestructura_Regional.md) — infraestructura
  objetivo para la separación regional (LB, HA de datos, control plane vs data planes, roadmap).
- [Paso_A_Paso_Infraestructura_Regional.md](Arquitectura/Paso_A_Paso_Infraestructura_Regional.md) —
  guía ejecutable: conexión de regiones + identificación por ubicación (LB, réplicas, HA, verificación).
- [Documentacion_Software.md](Arquitectura/Documentacion_Software.md) — referencia
  funcional (stack, funcionalidades F1-F7, eventos).
- [Estado_Implementacion.md](Arquitectura/Estado_Implementacion.md) — estado de
  features/decisiones técnicas. [Hoja_De_Tests.md](Arquitectura/Hoja_De_Tests.md) —
  matriz de trazabilidad design-system→tests.

### Diagramas (`Arquitectura/diagramas/`)

| # | Tema | Fuente |
|---|---|---|
| 01 | Componentes (36 blueprints + ML + Socket.IO + MinIO) | [01_componentes.puml](Arquitectura/diagramas/01_componentes.puml) |
| 02 | Despliegue prod | [02_despliegue.puml](Arquitectura/diagramas/02_despliegue.puml) |
| 03 | Flujo orden de pago | [03_flujo_orden_pago.puml](Arquitectura/diagramas/03_flujo_orden_pago.puml) |
| 04 | Modelo de datos (core + módulos nuevos) | [04_modelo_datos.puml](Arquitectura/diagramas/04_modelo_datos.puml) |
| 05 | Casos de uso (incluye roles admin/merchant) | [05_casos_uso.puml](Arquitectura/diagramas/05_casos_uso.puml) |
| 06 | Billetera virtual | [06_billetera_virtual.puml](Arquitectura/diagramas/06_billetera_virtual.puml) |
| 07 | Pipeline de recomendación ML | [07_pipeline_recomendacion.puml](Arquitectura/diagramas/07_pipeline_recomendacion.puml) |
| 08 | Cascada geoespacial | [08_cascada_geoespacial.puml](Arquitectura/diagramas/08_cascada_geoespacial.puml) |
| 09 | Tiempo real Socket.IO | [09_tiempo_real_socketio.puml](Arquitectura/diagramas/09_tiempo_real_socketio.puml) |
| 10 | Modelo de datos comerciante | [10_modelo_datos_comerciante.puml](Arquitectura/diagramas/10_modelo_datos_comerciante.puml) |
| 11 | División regional (ER + scoping) | [11_regiones.puml](Arquitectura/diagramas/11_regiones.puml) |
| 12 | Arquitectura frontend admin | [12_arquitectura_admin_frontend.puml](Arquitectura/diagramas/12_arquitectura_admin_frontend.puml) |
| 13 | Infraestructura regional (LB + HA) | [13_infraestructura_regional.puml](Arquitectura/diagramas/13_infraestructura_regional.puml) |

## 🎨 Branding y Design System

- Manual de marca: [Brandi_spec.md](Branding/Brandi_spec.md) (+ PDF del manual completo).
- Sistema de diseño (tokens): [Sistema_Diseno.md](Branding/Sistema_Diseno.md).
- Decisiones de contraste WCAG: [Ajuste_Contraste.md](Branding/Ajuste_Contraste.md).
- **Design System completo** (`Branding/DesignSystem/`):
  [01-tokens](Branding/DesignSystem/01-tokens.md) ·
  [02-componentes](Branding/DesignSystem/02-componentes.md) ·
  [03-reglas](Branding/DesignSystem/03-reglas.md) ·
  [04-arquitectura-css](Branding/DesignSystem/04-arquitectura-css.md) ·
  [05-iconos](Branding/DesignSystem/05-iconos.md) ·
  [06-decisiones-abiertas](Branding/DesignSystem/06-decisiones-abiertas.md).

## 🗺 Frontend (cliente y admin)

- [Estado_Frontend.md](Frontend/Estado_Frontend.md) — estado y divergencias doc↔código.
- [MAPBOX.md](Frontend/MAPBOX.md) — guía del mapa (token, fallback, props, Map Lab).

## 🧭 Mapa módulo → documento

| Módulo | Requerimiento | Arquitectura | Código |
|---|---|---|---|
| Chambas / Marañas / Ofertas | RF-49..RF-60 | `04`, `05` | `app/models/{chamba,marana,oferta}.py` |
| Negocios / Comerciante | RF-31..RF-48 | `10` | `app/models/{negocio,merchant}.py` |
| Oficios y Habilidades | RF-61..RF-66 | `04` | `app/models/habilidad.py` |
| Anuncios Laborales | RF-67..RF-69 | `04` | `app/models/anuncio.py` |
| División Regional | RF-70..RF-75 | `11` | `app/models/region.py`, `app/services/region.py` |
| Panel Administrativo | Roles_y_UI | `12` | `Chambeapp_admin_frontend/` |
| Monetización | RF-11..15, 25..30 | `06` | `app/models/wallet.py` |
| Recomendación IA | RF-ML | `07`, `08` | `app/ai/*` |

## 🔍 Notas de sincronización con código

- La verificación doc↔código (2026-09-25) encontró y corrigió divergencias:
  blueprints (24→36), modelos omitidos en diagramas (38), endpoints sin
  documentar (~173), componentes/hooks obsoletos de los ROLE_*.md.
- Ver [Frontend/Estado_Frontend.md](Frontend/Estado_Frontend.md) para las
  divergencias frontend y la deuda de tests del panel admin (0 tests).
- La fuente de verdad de tokens/branding es [Branding/Sistema_Diseno.md](Branding/Sistema_Diseno.md)
  y el archivo de tokens del cliente `src/styles/tokens.css`.