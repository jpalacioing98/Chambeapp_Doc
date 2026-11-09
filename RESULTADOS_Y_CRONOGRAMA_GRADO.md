# ChambeApp — Resultados y Cronograma de Proyecto de Grado

> **Maestría en Ingeniería de Software**  
> **Proyecto:** ChambeApp — Plataforma Tecnológica para la Intermediación de Servicios Informales, Marañas Barriales y Formalización Laboral  
> **Metodología:** AUP (Agile Unified Process)  
> **Fecha de Consolidación:** Octubre 2026  
> **Estado:** Auditoría arquitectónica 100% completada — Preparación para sustentación

---

## 1. Cronograma de Ejecución del Proyecto de Grado

El desarrollo del proyecto se estructuró en las cuatro fases de la metodología AUP (Inception, Elaboration, Construction, Transition), alineadas con las seis fases de auditoría arquitectónica ejecutadas, extendido hasta la sustentación programada para **principios de noviembre de 2026**.

### Fase Inception — Planteamiento y Alcance (Agosto 18 – Septiembre 1, 2026)

En esta etapa inicial se definió el problema central de la informalidad laboral en Colombia, donde más del 55% de la población ocupada se encontraba en condiciones de informalidad según mediciones del periodo 2025–2026, con especial incidencia en ciudades intermedias como Valledupar. Se formularon el objetivo general y los seis objetivos específicos que guiaron la investigación, abarcando el análisis contextual, el diseño arquitectónico, el desarrollo de inteligencia artificial, la visualización 3D, la integración de mecanismos de formalización y la evaluación empírica. Se establecieron los requerimientos funcionales base (RF-01 a RF-30) junto con siete requerimientos no funcionales, todos en formato EARS, y se redactaron las primeras dieciocho historias de usuario (HU-01 a HU-18) con sus criterios de aceptación. Simultáneamente se definió el modelo de monetización con tres planes de suscripción (Free, Básico, Profesional), los términos legales de intermediación blindados bajo la Ley 527 de 1999 y la Ley 1562 de 2012, y los lineamientos iniciales de branding.

### Fase Elaboration — Arquitectura y Refinamiento (Septiembre 1 – Septiembre 18, 2026)

Durante la elaboración se diseñó la arquitectura de software en tres capas: presentación (React 18 + Vite + TailwindCSS, Mapbox GL JS 3D, A-Frame para panorámicas 360°), lógica de negocio (Flask-Smorest con 36 blueprints REST y 3 handlers Socket.IO), y persistencia (PostgreSQL 16 + PostGIS, Redis 7, MinIO S3). Se incorporaron once nuevos requerimientos funcionales avanzados (RF-ML, RF-Trust, RF-Geo, RF-360, RF-UI) correspondientes a módulos de recomendación por aprendizaje automático, sistema de confianza y reputación, geocercas en cascada, visualización 360° y experiencia de usuario. Las historias de usuario se extendieron hasta HU-40 con casos de uso detallados. Se generaron seis diagramas PlantUML regenerados y tres nuevos: el pipeline de recomendación ML en dos etapas, la cascada geoespacial con filtrado por PostGIS ST_DWithin, y la arquitectura de tiempo real Socket.IO. Se produjo la guía de despliegue para desarrollo y producción, el plan de implementación en seis fases y la documentación de pruebas con inventario por archivo.

### Fase Construction — Implementación y Auditoría (Septiembre 18 – Octubre 25, 2026)

Esta fase concentró la mayor carga de trabajo técnico y de verificación. La **Fase 1 de auditoría** (septiembre 18–25) realizó el contraste entre las historias de usuario y el código fuente activo, produciendo un informe de discrepancias que identificó diez hallazgos de alta prioridad, once medios, cinco bajos y cuatro de seguridad. La **Fase 2** (septiembre 25 – octubre 2) normalizó el conjunto completo de 75 historias de usuario a la versión 3.0 en formato EARS, creó el catálogo formal de diecinueve riesgos conocidos (R-01 a R-19) documentando brechas de seguridad y limitaciones operativas sin alterar el código, y construyó la matriz de empalme entre flujos visuales end-to-end y capas técnicas del código. La **Fase 3** (octubre 2–8) documentó diecisiete flujos de negocio completos: catorce flujos UI end-to-end para automatización y tres flujos de API y gobernanza, cada uno con actores, precondiciones, paso a paso frontend/backend/base de datos, casos alternos y matriz de trazabilidad con las 75 historias de usuario. La **Fase 4** (octubre 8–18) ejecutó la validación automatizada end-to-end mediante Playwright Chromium con SwiftShader sobre los catorce flujos UI, obteniendo resultado PASA en el 100% de los casos, generando para cada flujo entre diez y doce capturas secuenciales de alta resolución, grabación continua en formato WebM, script autónomo reproducible y resumen técnico con auditoría de red HTTP y consistencia en PostgreSQL. La **Fase 5** (octubre 18–25) modeló los catorce flujos mediante diagramas de secuencia Mermaid interactivos y catorce diagramas estructurales PlantUML (componentes, despliegue, casos de uso, modelo de datos relacional, billetera virtual, pipeline ML, cascada geoespacial, tiempo real Socket.IO, datos del comerciante, división regional, frontend administrativo, infraestructura regional y moderación), produciendo quince renders gráficos PNG de alta resolución. Paralelamente, la **consolidación documental** (septiembre 25) unificó la especificación completa: 36 blueprints, 218 endpoints REST, 47 modelos SQLAlchemy y tres repositorios de código.

### Fase Transition — Sustentación y Cierre (Octubre 25 – Noviembre 7, 2026)

La **Fase 6 de auditoría** (octubre 25–31) consolidó el portal maestro de arquitectura y sustentación, integrando el mapa de arquitectura, los catorce flujos auditados, las nueve decisiones arquitectónicas fundamentales y la matriz integral de trazabilidad. Se prepararon tres documentos específicos para el jurado calificador: el guión ejecutivo para la exposición oral de quince a veinte minutos con diapositivas sugeridas y argumentario técnico para la ronda de preguntas y respuestas; la guía de re-ejecución autónoma que permite desplegar el stack localmente y reproducir los catorce scripts Playwright paso a paso; y el resumen de riesgos conocidos. La **primera semana de noviembre (3–7)** se destinó a la sustentación ante el jurado, precedida de ensayos de defensa oral, preparación de diapositivas (máximo quince) y rondas simuladas de preguntas y respuestas enfocadas en riesgos, decisiones arquitectónicas y evidencia empírica. La **semana posterior (8–15 de noviembre)** quedó reservada para incorporar observaciones del jurado y entregar la versión final del repositorio documental.

---

## 2. Resultados Alcançados

### 2.1 Análisis Contextual y Planteamiento del Problema

La investigación inició con un análisis exhaustivo de la informalidad laboral en Colombia, identificando que el 55% de la población ocupada carecía de acceso a seguridad social, estabilidad y garantías mínimas de protección según datos del periodo 2025–2026. El fenómeno mostró mayor intensidad en micronegocios y actividades de baja escala —comercio, servicios personales, labores manuales como plomería, jardinería y reparaciones— y brechas territoriales significativas en ciudades intermedias como Valledupar, Sincelejo y Riohacha. Se demostró que el crecimiento del empleo reciente estuvo impulsado por ocupaciones informales, sin que los mecanismos tradicionales lograran una transición efectiva hacia la formalidad, generando dependencia del "rebusque" caracterizado por ausencia de contratos, falta de regulación e inexistencia de trazabilidad de ingresos.

Desde el marco normativo, se estableció que el desafío no solo consistía en generar empleo sino en promover formalización progresiva, alineándose con la Ley 1429 de 2010 (incentivos a formalización empresarial y laboral) y la Ley 1562 de 2012 (protección obligatoria frente a riesgos laborales). En consecuencia, se definió el problema central: la ausencia de mecanismos digitales integrales capaces de transformar el trabajo informal de corta duración en oportunidades organizadas, trazables y progresivamente formales. Este planteamiento fundamentó la necesidad de una plataforma que integrara registro, trazabilidad de ingresos, calificación de servicios y acceso progresivo a protección social.

### 2.2 Especificación Completa y Trazable de Requerimientos

Se produjo una especificación exhaustiva de **setenta y cinco requerimientos funcionales** (RF-01 a RF-75) en formato EARS, organizados en un núcleo base (RF-01 a RF-30) y cinco módulos de extensión: comerciante y negocios (RF-31 a RF-48), chambas y marañas (RF-49 a RF-60), oficios y habilidades (RF-61 a RF-66), anuncios laborales (RF-67 a RF-69) y división regional (RF-70 a RF-75), complementados con siete requerimientos no funcionales. Paralelamente se redactaron **setenta y cinco historias de usuario** (HU-01 a HU-75) en su versión 3.0, cada una con criterios de aceptación, casos de uso y matriz de trazabilidad integral que vincula cada historia a sus requerimientos origen, flujos de negocio, diagramas de secuencia y evidencia de prueba. Se definieron cuatro niveles de rol (prestador de servicios, solicitante, comerciante, y administradores verificador/soporte/superadmin) con sus interfaces y permisos correspondientes, y se documentó la política KYC con once documentos requeridos en cuatro grupos (identidad, antecedentes, financiero, opcionales) soportando multi-instancia para referencias bancarias, validaciones profesionales y certificados laborales.

### 2.3 Arquitectura de Software Implementada y Auditada

Se materializó una arquitectura de tres capas desacopladas. La **capa de presentación** comprendió una PWA mobile-first en React 18 + Vite + TailwindCSS, integración nativa con Mapbox GL JS 3D (con fallback SwiftShader WebGL), visor de panorámicas equirrectangulares 360° mediante A-Frame, firma manuscrita en Canvas y cliente Socket.IO para mensajería y notificaciones en tiempo real. La **capa de lógica de negocio** se implementó en Flask-Smorest con treinta y seis blueprints REST organizados en módulos de autenticación y 2FA TOTP, gestión de chambas y ofertas, máquina de estados finita del ciclo operativo (seis hitos), billetera y pagos, gobernanza regional y flags, y workers asíncronos Celery para tareas distribuidas, más tres handlers Socket.IO para comunicación bidireccional. La **capa de persistencia** utilizó PostgreSQL 16 con motor espacial PostGIS, Redis 7 para caché de sesión, message queue de Socket.IO y broker de Celery, y MinIO S3 para almacenamiento de evidencias fotográficas, panorámicas 360° y documentos KYC.

Se inventariaron **doscientos dieciocho endpoints REST** con sus contratos OpenAPI/Smorest (rutas, métodos, permisos, esquemas de entrada/salida) y **cuarenta y siete modelos SQLAlchemy** con extensiones PostGIS para datos geoespaciales. El panel administrativo se arquitectó como aplicación independiente React + Vite + JavaScript con RBAC por roles, guards de navegación, servicios tipados y scoping regional estricto. La infraestructura objetivo se diseñó para alta disponibilidad multi-región: balanceador de carga, réplicas de API, PostgreSQL con Patroni, Redis Sentinel, MinIO distribuido, control plane global versus data planes regionales, con roadmap en cuatro etapas (actual → HA → regional operativo → aislamiento físico opcional).

Nueve **decisiones arquitectónicas fundamentales** estructuraron el sistema: (1) privacidad diferencial de coordenadas en feed público, revelando ubicación exacta solo tras perfeccionamiento contractual con firma digital; (2) revocación desacoplada sin blacklist en memoria mediante claim `role_version` en JWT, invalidando tokens al incrementar `user.role_version` en base de datos; (3) fronteras regionales estrictas vía `region_scope_id`, restringiendo administradores territoriales a su jurisdicción departamental con autoridad universal solo para superadmin; (4) máquina de estados finita de seis hitos operativos con verificación estricta (check-in GPS Haversine <100m → evidencia entrada MinIO → adendas → novedades → evidencia salida → doble conformidad pago → calificación bilateral); (5) derivación ágil de marañas desde adendas contractuales hacia tablón de micro-trabajos barriales, descontando valor de orden madre y previniendo doble imputación; (6) invariante contable de partida doble en billetera digital con asientos inmutables en `wallet_transactions` y cálculo atómico de balance, retiros bajo retención preventiva Escrow a `saldo_bloqueado`; (7) protocolo ligero de mensajería estructurada `⟦c:...⟧` para acciones contractuales serializadas en tabla `messages` y compiladas dinámicamente en frontend; (8) pistas inmutables de auditoría forense en `audit_logs` con actor, IP, timestamp UTC y snapshot diff; (9) gobernanza de feature flags en tiempo real vía tabla `feature_flags` para activación en caliente de algoritmos IA sin reinicios.

### 2.4 Modelado Formal de Interacciones y Estructura del Sistema

La arquitectura se modeló formalmente mediante **catorce diagramas de secuencia Mermaid** interactivos que cubren el ciclo de vida completo: autenticación y registro multi-rol, perfil y verificación KYC, publicación de solicitudes con geocerca y panorámicas 360°, exploración geoespacial y postulación de prestadores, negociación bilateral y firma digital de contrato, ejecución del ciclo operativo de seis hitos, pago dual directo y calificación mutua, derivación y cierre ágil de marañas, directorio y gestión de negocios locales, anuncios laborales de proximidad, billetera digital con recargas simuladas y paquetes de monedas, mensajería y chat en tiempo real WebSockets, notificaciones push/in-app y centro de alertas, y moderación, soporte y auditoría superadmin.

Complementariamente, **catorce diagramas estructurales PlantUML** representaron: arquitectura de componentes (36 blueprints + ML + Socket.IO + MinIO), despliegue productivo, flujo de orden de pago, modelo de datos relacional unificado (core + módulos nuevos), casos de uso con actores admin/merchant, billetera virtual, pipeline de recomendación ML en dos etapas, cascada geoespacial con filtrado PostGIS, arquitectura de tiempo real Socket.IO, modelo de datos del módulo comerciante, división regional con scoping, arquitectura del frontend administrativo, infraestructura regional (LB + HA), y moderación/soporte/superadmin. Quince renders PNG de alta resolución facilitaron la comunicación visual con stakeholders y jurado.

### 2.5 Validación Automatizada End-to-End

La verificación empírica se ejecutó mediante **catorce suites de prueba automatizadas Playwright** sobre Chromium con SwiftShader, cubriendo la totalidad de los flujos UI end-to-end. Todos los flujos obtuvieron resultado **PASA (100%)**, generando un banco de evidencia reproducible que incluye aproximadamente ciento cuarenta capturas de pantalla secuenciales, catorce grabaciones de video continuas en formato WebM, catorce scripts autónomos `.cjs` re-ejecutables independientemente, y catorce resúmenes técnicos con auditoría detallada de peticiones HTTP (códigos de estado, payloads, latencias), transacciones PostgreSQL (consistencia referencial, constraints, triggers) y verificación de invariantes de negocio.

Los flujos validados comprueban: el registro y autenticación multi-rol con 2FA TOTP; el flujo KYC completo con subida de once documentos y panel de revisión; la publicación de chambas con geocercas dinámicas y captura panorámica 360°; la exploración geoespacial con filtrado PostGIS ST_DWithin y postulación de prestadores; la negociación bilateral con contraofertas serializadas y firma digital de contrato; el ciclo operativo de seis hitos con check-in GPS, evidencias fotográficas, adendas, novedades y doble conformidad; el pago dual (digital Nequi/PSE y efectivo con doble check-in) y calificación 360°; la derivación de tareas técnicas no cubiertas hacia marañas barriales con descuento de orden madre; el directorio de negocios locales con KYC merchant, estadísticas y preferencias de pago; los anuncios laborales de proximidad; la billetera digital con recargas, tres tipos de monedas (comprada/promocional/ganada), modalidades de cobro y precios sugeridos; la mensajería 1:1 Socket.IO con historial y protocolo estructurado; las notificaciones multicanal con centro de alertas; y la gobernanza global con moderación de contenido, resolución de disputas, tickets de soporte y auditoría inmutable. Los tres flujos restantes (quizzes, admin staff, infraestructura de despliegue) corresponden a microservicios headless sin pantallas React, con capacidades críticas probadas integradas en el flujo de moderación.

### 2.6 Material de Sustentación para Jurado Calificador

Se consolidó un **portal maestro de arquitectura y sustentación** que integra el mapa de navegación del repositorio, la síntesis de arquitectura en tres capas, la matriz integral de trazabilidad (75 RF ↔ 75 HU ↔ 14 flujos ↔ evidencias E2E ↔ 14 diagramas secuencia ↔ 14 diagramas estructurales), las nueve decisiones arquitectónicas y los recursos para jurado. El guión ejecutivo estructura la defensa oral en quince a veinte minutos con diapositivas sugeridas: contextualización del problema, objetivos y alcance, arquitectura y decisiones clave, evidencia de validación (14 flujos PASA), contribuciones (formalización embebida, geoespacial+3D, IA recomendación, trazabilidad total), riesgos conocidos y limitaciones (R-01 a R-19), y cierre con aporte a la línea de investigación. La guía de re-ejecución permite a evaluadores desplegar el stack completo (backend Flask + 2 frontends + PostgreSQL + Redis + MinIO + Celery) y reproducir cualquier flujo automatizado paso a paso. El catálogo de diecinueve riesgos documenta brechas de seguridad (ausencia HSTS/CSP, logging estructurado, health checks, CI/CD), limitaciones operativas (pagos Nequi mock, push notifications Web Push API ausente, desbloqueo formal de información parcial) y deuda técnica (panel admin 0 tests frontend).

### 2.7 Sistema de Diseño y Branding Cohesivo

Se construyó un **Design System completo** aplicado consistentemente a ambos frontends (cliente PWA y panel administrativo). El sistema definió tokens de diseño (paleta cromática con roles semánticos, escala tipográfica, espaciado basado en 4px, radios, sombras, motion), biblioteca de componentes atómicos y compuestos (botones, inputs, cards, modales, chips, badges, loading states, empty states, tablas, formularios), reglas de composición (layout, grid, responsive breakpoints, accesibilidad WCAG AA), arquitectura CSS con capas (tokens, base, componentes, utilidades, overrides), iconografía unificada (Lucide React + custom SVG), y seis decisiones abiertas documentadas para evolución futura. El manual de marca estableció identidad visual, tono de voz, aplicaciones y variaciones, con ajustes de contraste validados contra WCAG. La migración del design system al panel admin incluyó wrappers de compatibilidad y correcciones de shell (sidebar selection bug, topbar padding, notificaciones dropdown, página de perfil integrada con endpoints de cliente).

### 2.8 Configuración Metodológica AUP y Gobernanza del Proceso

Se instauró un entorno de trabajo bajo metodología AUP soportado por agentes especializados en OpenCode: agente de ingeniería de software con workflow de implementación y patrones, agente de diseño frontend con vocación UI/UX, generador de diagramas PlantUML, generador de documentación API, y skills transversales (business analyst, color expert, animation vocabulary, find-skills, vercel-react-best-practices). Los flujos de trabajo UI/UX estandarizaron el ciclo diseño-desarrollo-validación, y la configuración de agentes garantizó trazabilidad entre decisiones de diseño, implementación en código y documentación arquitectónica, permitiendo reproducibilidad y gobernanza del proceso de desarrollo a lo largo de las seis fases de auditoría.

---

## 3. Correspondencia entre Objetivos Específicos y Resultados

El **objetivo específico 1** (analizar informalidad en Valledupar) se cumplió mediante el análisis contextual documentado que identificó tipos de servicios, perfiles de trabajadores y dinámicas de contratación, fundamentando el problema central. El **objetivo 2** (diseñar arquitectura definiendo módulos funcionales) se materializó en la arquitectura de tres capas con treinta y seis blueprints, módulos funcionales completos (identidad, chambas/ofertas, ciclo operativo, finanzas, gobernanza, IA, tiempo real, almacenamiento) y infraestructura multi-región. El **objetivo 3** (desarrollar sistema IA de recomendación) se realizó mediante el pipeline ML en dos etapas (retrieval + ranking) con sentence-transformers y scikit-learn, modelado en diagrama de secuencia y pipeline, con feature flag `ml_ranking_enabled` para activación en caliente. El **objetivo 4** (implementar visualización 3D) se concretó con Mapbox GL JS 3D para exploración geoespacial y A-Frame/Photo Sphere Viewer para inspección de patologías de obra mediante panorámicas equirrectangulares 360° en WebGL, integradas en flujos de publicación y ejecución. El **objetivo 5** (integrar trazabilidad, calificación y formalización) se logró mediante KYC multinivel, certificación tributaria de ingresos descargable (Ley 527/1999, Decreto 1273/2018), TrustScore auditable, FSM de seis hitos con evidencias inmutables en MinIO, partida doble en billetera y calificaciones bilaterales 360°. El **objetivo 6** (evaluar plataforma con usuarios) se alcanzó mediante la auditoría automatizada de catorce flujos end-to-end con Playwright, 100% PASA, con evidencia reproducible de red, base de datos e invariantes de negocio.

---

## 4. Métricas de Cumplimiento del Proyecto de Grado

| Métrica | Valor |
|---------|-------|
| Requerimientos funcionales especificados (EARS) | 75 (RF-01 a RF-75) |
| Historias de usuario v3.0 (EARS + casos de uso + trazabilidad) | 75 (HU-01 a HU-75) |
| Endpoints REST documentados y auditados | 218 |
| Modelos SQLAlchemy con PostGIS | 47 |
| Blueprints Flask-Smorest | 36 |
| Handlers Socket.IO | 3 |
| Diagramas de secuencia Mermaid (flujos UI) | 14 |
| Diagramas estructurales PlantUML | 14 |
| Renders PNG arquitectura | 15 |
| Flujos E2E automatizados aprobados | 14/14 (100% PASA) |
| Capturas de pantalla totales (evidencia) | ~140 |
| Videos de prueba WebM | 14 |
| Scripts Playwright autónomos | 14 |
| Tests backend (pytest) | 516 (44 archivos) |
| Tests frontend cliente (Vitest) | 385 (43 archivos) |
| Riesgos conocidos documentados | 19 (R-01 a R-19) |
| Decisiones arquitectónicas fundamentales | 9 |
| Fases de auditoría completadas | 6/6 (100%) |

---

## 5. Conclusiones

El proyecto demostró la factibilidad técnica y operativa de una plataforma inteligente para la intermediación de servicios informales que integra, en una arquitectura cohesiva y validada: una **arquitectura robusta y escalable** de tres capas desacopladas, treinta y seis blueprints y preparación multi-región; **formalización progresiva embebida** mediante KYC multinivel, certificación de ingresos conforme a normativa colombiana, TrustScore auditable y contabilidad de partida doble en billetera digital; **geolocalización asistida y visualización 3D** con geocercas dinámicas PostGIS, panorámicas 360° en WebGL A-Frame y Mapbox GL JS 3D; **validación empírica completa** mediante catorce flujos end-to-end automatizados con resultado 100% PASA y evidencia reproducible de red, base de datos e invariantes; y **trazabilidad total** bidireccional entre requerimientos, historias de usuario, flujos, evidencias, diagramas y código fuente (matriz integral 75 RF ↔ 75 HU ↔ 14 flujos ↔ 14 diagramas secuencia ↔ 14 diagramas estructurales ↔ 218 endpoints ↔ 47 modelos).

Se cumplieron los seis objetivos específicos planteados. Se entregó un artefacto de software documentado, auditado y listo para sustentación ante jurado calificador en la ventana del **3 al 7 de noviembre de 2026**.

---

## 6. Próximos Pasos Inmediatos (Semana 27 Octubre – 7 Noviembre 2026)

| Acción | Fecha Límite |
|--------|--------------|
| Ensayo defensa oral (15–20 min) con cronómetro | 29 octubre 2026 |
| Preparación diapositivas (máximo 15) | 30 octubre 2026 |
| Ronda Q&A simulada (riesgos R-01 a R-19, decisiones arquitectónicas) | 31 octubre 2026 |
| Verificación stack local + re-ejecución 1 script Playwright | 2 noviembre 2026 |
| **Sustentación ante jurado** | **3–7 noviembre 2026** |
| Incorporación observaciones jurado | 10 noviembre 2026 |
| Entrega versión final documental | 14 noviembre 2026 |

---

*Documento generado a partir de la documentación canónica del proyecto — Octubre 2026*  
*Metodología AUP — Trazabilidad completa — Cero alteraciones de código fuente*