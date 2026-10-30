# Resultados Esperados — Sección para Documento Formal de Anteproyecto

> **Proyecto:** ChambeApp — Plataforma Inteligente para la Contratación de Servicios Laborales con IA y Visualización 360 en Valledupar  
> **Autores:** Jose David Palacio Mejía y Victor Alfonzo Ardila Montalván  
> **Director:** Amilkar Sierra Romano  
> **Institución:** Universidad Popular del Cesar  
> **Línea/Sub-línea:** Transformación digital / Sistemas inteligentes  
> **Grupo de Investigación:** Gisico

---

## Resultados Esperados

Como consecuencia de la ejecución del proyecto, se espera obtener una **plataforma tecnológica integral, validada y documentada** que permita transformar la intermediación de servicios laborales informales de corta duración en oportunidades organizadas, trazables y progresivamente formales en la ciudad de Valledupar. Los resultados se estructuran en torno a los seis objetivos específicos planteados y abarcan tanto el artefacto de software como la evidencia de su correcto funcionamiento y su fundamentación técnica.

### 1. Análisis Contextual Fundamentado y Planteamiento del Problema

Se entregará un **estudio contextual riguroso** que caracterice la informalidad laboral en Valledupar, identificando los tipos de servicios predominantes (reparaciones domésticas, fontanería, electricidad, pintura, transporte menor, micro-trabajos barriales o "marañas"), los perfiles de los prestadores independientes y las dinámicas de contratación actuales. Este análisis fundamentará la definición precisa del problema central —la ausencia de mecanismos digitales integrales para organizar, trazar y formalizar progresivamente el trabajo ocasional— y justificará la pertinencia de la solución propuesta bajo el marco normativo colombiano (Ley 1429 de 2010, Ley 1562 de 2012, Ley 527 de 1999, Decreto 1273 de 2018). El resultado incluirá la formulación explícita de objetivos generales y específicos, el alcance del proyecto y la justificación académica con referencias bibliográficas actualizadas.

### 2. Especificación Completa y Trazable de Requerimientos

Se producirá una **especificación de requerimientos exhaustiva** que contemple setenta y cinco requerimientos funcionales (RF-01 a RF-75) redactados en formato EARS, organizados en un núcleo base (autenticación, perfiles, búsqueda, contratación, pagos, notificaciones, administración, formalización) y cinco módulos de extensión: comerciante y negocios, chambas y marañas, oficios y habilidades, anuncios laborales y división regional. Cada requerimiento se complementará con su correspondiente historia de usuario (HU-01 a HU-75) en versión normalizada, con criterios de aceptación, casos de uso y una **matriz de trazabilidad bidireccional** que vincule cada historia a sus requerimientos origen, flujos de negocio, diagramas de secuencia, casos de prueba y evidencia de validación. Se definirán cuatro niveles de rol (prestador de servicios, solicitante, comerciante, administradores verificador/soporte/superadmin) con sus interfaces y permisos, y se documentará una política KYC con once documentos requeridos en cuatro grupos (identidad, antecedentes, financiero, opcionales) soportando multi-instancia.

### 3. Arquitectura de Software Diseñada, Implementada y Auditada

Se construirá una **arquitectura de tres capas desacopladas**, implementada y sometida a auditoría completa. La capa de presentación integrará una Progressive Web App mobile-first (React 18, Vite, TailwindCSS), visualización geoespacial 3D (Mapbox GL JS con fallback SwiftShader WebGL), inspección de panorámicas equirrectangulares 360° (A-Frame / Photo Sphere Viewer en WebGL), firma manuscrita en Canvas y mensajería en tiempo real (Socket.IO client). La capa de lógica de negocio se implementará en Flask-Smorest con treinta y seis blueprints REST organizados en módulos funcionales cohesionados: identidad y acceso (autenticación, 2FA TOTP, roles), mercado y ofertas (chambas, postulaciones, negociación), operaciones en campo (máquina de estados finita de seis hitos con verificación GPS Haversine <100m, evidencias fotográficas, adendas, novedades), finanzas y reputación (billetera digital, pago dual digital/efectivo, calificación 360°, TrustScore), gobernanza (scoping regional estricto, feature flags, auditoría forense) y procesamiento asíncrono (Celery distributed tasks), más tres handlers Socket.IO para comunicación bidireccional. La capa de persistencia empleará PostgreSQL 16 con motor espacial PostGIS, Redis 7 (caché, message queue, broker) y MinIO S3 (evidencias, panorámicas 360°, documentos KYC).

Como resultado de la auditoría arquitectónica, se documentarán **nueve decisiones arquitectónicas fundamentales**: (1) privacidad diferencial de coordenadas en feed público; (2) revocación desacoplada de tokens JWT mediante claim `role_version`; (3) fronteras regionales estrictas vía `region_scope_id`; (4) máquina de estados finita de seis hitos operativos; (5) derivación ágil de marañas desde adendas contractuales; (6) invariante contable de partida doble en billetera digital; (7) protocolo ligero de mensajería estructurada para acciones contractuales; (8) pistas inmutables de auditoría forense; (9) gobernanza de feature flags en tiempo real. Se entregarán inventarios completos de doscientos dieciocho endpoints REST con contratos OpenAPI/Smorest, cuarenta y siete modelos SQLAlchemy con extensiones PostGIS, y el diseño de infraestructura objetivo multi-región de alta disponibilidad (balanceador de carga, réplicas API, Patroni, Redis Sentinel, MinIO distribuido, control plane global vs data planes).

### 4. Modelado Formal de la Arquitectura y sus Interacciones

Se generará un **corpus de modelado formal** compuesto por catorce diagramas de secuencia Mermaid interactivos que cubran el ciclo de vida completo de la plataforma: autenticación y registro multi-rol, perfil y verificación KYC, publicación con geocerca y 360°, exploración geoespacial y postulación, negociación y firma digital, ejecución del ciclo operativo (seis hitos), pago dual y calificación mutua, derivación y cierre de marañas, directorio de negocios locales, anuncios laborales, billetera digital y monedas, mensajería tiempo real, notificaciones multicanal, y moderación/superadmin. Complementariamente, se producirán catorce diagramas estructurales PlantUML: arquitectura de componentes (36 blueprints + ML + Socket.IO + MinIO), despliegue productivo, flujo de orden de pago, modelo de datos relacional unificado, casos de uso con actores extendidos, billetera virtual, pipeline de recomendación ML en dos etapas, cascada geoespacial con PostGIS, tiempo real Socket.IO, modelo de datos comerciante, división regional con scoping, arquitectura frontend administrativo, infraestructura regional (LB + HA), y moderación/soporte/superadmin. Quince renders gráficos PNG de alta resolución facilitarán la comunicación técnica y la defensa del proyecto.

### 5. Sistema de Inteligencia Artificial para Recomendación y Asignación

Se desarrollará e integrará un **motor de recomendación en dos etapas** (retrieval + ranking) basado en sentence-transformers y scikit-learn, que procese perfiles de prestadores, habilidades, historial de comportamiento, ubicación geográfica y requerimientos del servicio para generar coincidencias óptimas. El pipeline incluirá vectorización de información, filtrado por geocercas dinámicas (PostGIS ST_DWithin), scoring de similitud semántica y ranking final con explicabilidad del score. La capacidad se activará/desactivará en caliente mediante feature flag (`ml_ranking_enabled`) sin requerir redeploy, y se documentará su transparencia algorítmica (score + explicación) como requerimiento no funcional. El modelo se validará mediante diagramas de secuencia y estructurales dedicados (pipeline ML, cascada geoespacial) y su integración se verificará en los flujos de exploración/postulación y ejecución operativa.

### 6. Módulo de Visualización 3D e Interacción Inmersiva

Se implementará un **módulo de visualización tridimensional** que combine Mapbox GL JS 3D para la exploración geoespacial de servicios (con capas de calor, clustering, geocercas dinámicas y navegación en primera persona) y A-Frame / Photo Sphere Viewer para la inspección de patologías de obra y entornos de trabajo mediante panorámicas equirrectangulares 360° capturadas in-situ y renderizadas en WebGL. Esta capacidad permitirá a empleadores y prestadores reducir la incertidumbre previa a la contratación, validar condiciones del sitio remotamente y documentar evidencias de entrada/salida con contexto espacial inmersivo. La integración se modelará en diagramas de secuencia (publicación, ejecución, exploración) y estructurales (flujo orden-pago, tiempo real), y se verificará end-to-end en los flujos automatizados correspondientes.

### 7. Mecanismos Integrados de Trazabilidad, Calificación y Formalización Progresiva

Se incorporarán **mecanismos nativos de formalización** que trasciendan la mera intermediación: verificación de identidad multinivel (KYC documental + OTP telefónico), certificación tributaria de ingresos devengados descargable (conforme Ley 527/1999 y Decreto 1273/2018), TrustScore auditable construido sobre calificaciones bilaterales 360°, historial inmutable de transacciones con invariante de partida doble en billetera digital (asientos en `wallet_transactions`, balance atómico, retenciones Escrow en `saldo_bloqueado`), y máquina de estados finita de seis hitos que exige evidencias fotográficas georreferenciadas y doble conformidad antes de liberar calificación. Estos mecanismos se diseñarán para apoyar la bancarización de prestadores y la adscripción progresiva a seguridad social, alineándose con la Ley 1429/2010 y Ley 1562/2012. Su correcto funcionamiento se demostrará mediante los flujos de KYC, ejecución operativa, pago dual y billetera, cada uno con evidencia automatizada.

### 8. Validación Empírica Mediante Pruebas Automatizadas End-to-End

Se ejecutará una **auditoría automatizada completa** de los catorce flujos de negocio UI end-to-end mediante Playwright Chromium con SwiftShader, generando evidencia reproducible e independiente del observador. Se espera obtener resultado **PASA en el 100% de los flujos**, produciendo para cada uno: capturas de pantalla secuenciales (10–12 por flujo), grabación de video continua (WebM), script autónomo re-ejecutable (`.cjs`), y resumen técnico con auditoría de red HTTP (códigos, payloads, latencias), consistencia en PostgreSQL (constraints, triggers, integridad referencial) y verificación de invariantes de negocio. Los flujos cubrirán la totalidad del ciclo de vida: autenticación, KYC, publicación, exploración/postulación, negociación/contrato, ejecución (6 hitos), pago/calificación, marañas, directorio negocios, anuncios, billetera, mensajería, notificaciones y gobernanza. Tres flujos adicionales (quizzes, admin staff, infraestructura) corresponderán a servicios headless sin UI, con capacidades críticas probadas en el flujo de gobernanza. Se consolidará un informe maestro de auditoría con estadísticas completas y hallazgos, y una guía de re-ejecución autónoma para evaluadores.

### 9. Sistema de Diseño Cohesivo y Branding Aplicado

Se entregará un **Design System completo y consistente** aplicado a ambos frontends (cliente PWA y panel administrativo), que incluya: tokens de diseño (paleta semántica, tipografía, espaciado 4px, radios, sombras, motion), biblioteca de componentes atómicos y compuestos, reglas de composición (layout, grid, breakpoints responsivos, accesibilidad WCAG AA), arquitectura CSS en capas (tokens, base, componentes, utilidades, overrides), iconografía unificada y decisiones de evolución documentadas. El manual de marca establecerá identidad visual, tono de voz y aplicaciones. La migración al panel administrativo incluirá wrappers de compatibilidad y correcciones de shell, garantizando coherencia visual y de experiencia de usuario en todo el ecosistema.

### 10. Material de Sustentación y Gobernanza del Proceso Metodológico

Se preparará el **paquete completo para sustentación ante jurado calificador**: portal maestro de arquitectura (mapa navegable, síntesis tres capas, matriz integral de trazabilidad 75 RF ↔ 75 HU ↔ 14 flujos ↔ evidencias ↔ 28 diagramas ↔ 218 endpoints ↔ 47 modelos, 9 decisiones, recursos jurado), guión ejecutivo de defensa oral (15–20 min, diapositivas sugeridas, argumentario Q&A), guía de re-ejecución autónoma de stack y pruebas, y catálogo de diecinueve riesgos conocidos (R-01 a R-19) con brechas de seguridad, limitaciones operativas y deuda técnica documentadas sin alterar código. Adicionalmente, se dejará constancia de la **configuración metodológica AUP** mediante agentes especializados (ingeniería software, diseño frontend, diagramas PlantUML, documentación API, business analyst) y flujos UI/UX estandarizados que garantizan trazabilidad entre decisiones de diseño, implementación y documentación a lo largo de las seis fases de auditoría.

---

## Síntesis de Entregables Esperados

| Categoría | Entregable Principal |
|-----------|---------------------|
| **Documentación de Análisis** | Estudio contextual, problema, objetivos, justificación, alcance |
| **Especificación de Requerimientos** | 75 RF (EARS) + 75 HU v3.0 + matriz trazabilidad + 4 roles + política KYC |
| **Arquitectura y Código** | 3 capas, 36 blueprints, 3 Socket.IO, 218 endpoints, 47 modelos, infra multi-región |
| **Decisiones Arquitectónicas** | 9 decisiones fundamentales documentadas y justificadas |
| **Modelado Formal** | 14 diagramas secuencia (Mermaid) + 14 diagramas estructurales (PlantUML) + 15 PNG |
| **Inteligencia Artificial** | Pipeline ML 2 etapas (retrieval+ranking), feature flag, transparencia, diagramas dedicados |
| **Visualización 3D** | Mapbox GL JS 3D + A-Frame 360°, integrado en flujos core |
| **Formalización** | KYC multinivel, certificación ingresos (Ley 527), TrustScore, FSM 6 hitos, partida doble wallet |
| **Validación Empírica** | 14/14 flujos E2E PASA (Playwright), ~140 capturas, 14 videos, 14 scripts, informe maestro |
| **Design System** | Tokens, componentes, reglas, CSS architecture, iconos, decisiones, manual marca, 2 frontends |
| **Sustentación** | Portal maestro, guión defensa, guía re-ejecución, catálogo 19 riesgos, configuración AUP |

---

*Esta sección constituye los **Resultados Esperados** del proyecto de grado, redactada en forma narrativa para su inclusión directa en el documento formal de anteproyecto. Cada resultado se deriva de los objetivos específicos y se soporta en la evidencia técnica que se generará durante la ejecución.*