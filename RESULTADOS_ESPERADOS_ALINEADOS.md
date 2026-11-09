# Resultados Esperados — Alineados al Marco Metodológico AUP

> **Proyecto:** ChambeApp — Plataforma Inteligente para la Contratación de Servicios Laborales con IA y Visualización 360 en Valledupar  
> **Metodología:** AUP (Agile Unified Process) — 4 fases: Inception, Elaboration, Construction, Transition  
> **Estrategia de desarrollo (base.md):** 5 fases secuenciales — Análisis, Diseño, Algoritmia-IA, Interfaz-3D, Confianza y Formalización  
> **Macro-módulos del sistema:** A. Gestión de Usuarios y Perfiles, B. Motor de Match/Recomendación (IA), C. Visualización Interactiva 3D, D. Gestión Contractual y Trazabilidad, E. Comunicación y Notificaciones  
> **Atributos de calidad (NFR):** Usabilidad y Accesibilidad, Transparencia Algorítmica, Seguridad de Datos

---

## Resultados Esperados por Fase Metodológica

### Fase 1 — Inception / Análisis: Fundamentación del Problema y Alcance

Como resultado de la fase de **Inception** (AUP) y **Análisis** (base.md), se entregará un **estudio contextual riguroso** que caracterice la informalidad laboral en Valledupar mediante la identificación de perfiles de usuarios, tipos de servicios predominantes (reparaciones domésticas, fontanería, electricidad, pintura, transporte menor, marañas barriales) y dinámicas de contratación actuales. Este análisis fundamentará la definición precisa del problema central —la ausencia de mecanismos digitales integrales para organizar, trazar y formalizar progresivamente el trabajo ocasional— y justificará la pertinencia de la solución bajo el marco normativo colombiano (Ley 1429/2010, Ley 1562/2012, Ley 527/1999, Decreto 1273/2018). Se formularán explícitamente el objetivo general, los seis objetivos específicos, el alcance del proyecto y la justificación académica con referencias bibliográficas actualizadas.

**Evidencia gráfica asociada:**  
*Figura 1.* Mapa de calor de informalidad laboral por ciudad intermedia (Valledupar, Sincelejo, Riohacha), período 2025–2026.  
*Figura 2.* Diagrama de contexto del sistema (C4 Level 1) — Actores principales: Prestador de Servicios (PDS), Solicitante, Comerciante, Administradores (Verificador, Soporte, Superadmin).

---

### Fase 2 — Elaboration / Diseño: Arquitectura, Requerimientos y Modelado

Como resultado de la fase de **Elaboration** (AUP) y **Diseño** (base.md), se producirán tres entregables integrados:

1. **Especificación completa y trazable de requerimientos:** Setenta y cinco requerimientos funcionales (RF-01 a RF-75) en formato EARS, organizados en núcleo base (RF-01 a RF-30: autenticación, perfiles, búsqueda, contratación, pagos, notificaciones, administración, formalización) y cinco módulos de extensión alineados a los macro-módulos: Comerciante y Negocios —Módulo A— (RF-31 a RF-48), Chambas y Marañas —Módulos A, D, E— (RF-49 a RF-60), Oficios y Habilidades —Módulo A— (RF-61 a RF-66), Anuncios Laborales —Módulos A, E— (RF-67 a RF-69), División Regional —Módulo D— (RF-70 a RF-75). Cada RF se complementará con su historia de usuario (HU-01 a HU-75) con criterios de aceptación, casos de uso y **matriz de trazabilidad bidireccional** (RF ↔ HU ↔ Flujo ↔ Diagrama ↔ Prueba). Se definirán cuatro niveles de rol con interfaces y permisos diferenciados, y una política KYC de once documentos en cuatro grupos (identidad, antecedentes, financiero, opcionales) con soporte multi-instancia.

2. **Arquitectura de software en tres capas:** Capa de presentación (PWA React 18 + Vite + TailwindCSS, Mapbox GL JS 3D con SwiftShader, A-Frame 360°, Canvas firma, Socket.IO client); capa de lógica (Flask-Smorest, 36 blueprints REST + 3 handlers Socket.IO en módulos: identidad, mercado/ofertas, ciclo operativo FSM 6 hitos, finanzas/reputación, gobernanza, workers Celery); capa de persistencia (PostgreSQL 16 + PostGIS, Redis 7, MinIO S3). Inventario de 218 endpoints REST con contratos OpenAPI/Smorest y 47 modelos SQLAlchemy con PostGIS.

3. **Modelado formal de arquitectura:** Catorce diagramas de secuencia (Mermaid) que cubren el ciclo de vida completo: autenticación/registro, perfil/KYC, publicación con geocerca/360°, exploración/postulación, negociación/firma, ejecución 6 hitos, pago dual/calificación, derivación marañas, directorio negocios, anuncios laborales, billetera/monedas, mensajería tiempo real, notificaciones, moderación/superadmin. Catorce diagramas estructurales (PlantUML): componentes (36 blueprints + ML + Socket.IO + MinIO), despliegue productivo, flujo orden-pago, modelo datos relacional unificado, casos de uso extendidos, billetera virtual, pipeline ML 2 etapas, cascada geoespacial PostGIS, tiempo real Socket.IO, modelo datos comerciante, división regional scoping, frontend admin, infraestructura regional LB+HA, moderación/soporte/superadmin. Quince renders PNG de alta resolución.

**Evidencia gráfica asociada:**  
*Figura 3.* Arquitectura de tres capas — Presentación (PWA, Mapbox 3D, A-Frame 360°), Lógica (36 blueprints, 3 Socket.IO, Celery), Persistencia (PostgreSQL/PostGIS, Redis, MinIO).  
*Figura 4.* Diagrama de componentes — 36 blueprints REST organizados en 6 módulos funcionales + bloques ML, Socket.IO, MinIO.  
*Figura 5.* Diagrama de despliegue productivo — Contenedores, balanceador, réplicas, Patroni, Sentinel, MinIO distribuido.  
*Figura 6.* Modelo de datos relacional unificado — 47 entidades SQLAlchemy con extensiones PostGIS (core + 5 módulos).  
*Figura 7.* Casos de uso extendidos — 4 roles, 14 flujos principales, actores admin/merchant/verificador/soporte/superadmin.  
*Figura 8.* Diagrama de secuencia — Autenticación y registro multi-rol con 2FA TOTP y JWT role_version.  
*Figura 9.* Diagrama de secuencia — Publicación de chamba con geocerca dinámica y captura panorámica 360°.  
*Figura 10.* Diagrama de secuencia — Ciclo operativo FSM 6 hitos (check-in GPS, evidencias, adendas, novedades, doble conformidad, calificación).  
*Figura 11.* Diagrama de secuencia — Pago dual (Nequi/PSE + efectivo doble check-in) y calificación bilateral 360°.  
*Figura 12.* Diagrama de secuencia — Derivación ágil de marañas desde adenda contractual con descuento orden madre.  
*Figura 13.* Diagrama de componentes — Pipeline ML 2 etapas (retrieval + ranking) con sentence-transformers y feature flag.  
*Figura 14.* Diagrama de componentes — Cascada geoespacial con filtrado PostGIS ST_DWithin y clustering.  
*Figura 15.* Diagrama de componentes — Arquitectura tiempo real Socket.IO (mensajería, notificaciones, presencia).  
*Figura 16.* Diagrama de componentes — Infraestructura regional multi-región (LB, HA Patroni/Sentinel, data planes).  
*Figura 17.* Diagrama de secuencia — Moderación, soporte y auditoría superadmin con scoping regional estricto.

---

### Fase 3 — Construction / Algoritmia-IA: Motor de Recomendación y Asignación

Como resultado de la fase de **Construction** (AUP) y **Algoritmia-IA** (base.md), se desarrollará e integrará el **motor de recomendación en dos etapas (retrieval + ranking)** —Macro-módulo B— basado en sentence-transformers y scikit-learn, que procese perfiles de prestadores, habilidades, historial de comportamiento, ubicación geográfica y requerimientos del servicio para generar coincidencias óptimas. El pipeline incluirá vectorización semántica de perfiles y servicios, filtrado geoespacial por geocercas dinámicas (PostGIS ST_DWithin), scoring de similitud coseno y ranking final con explicabilidad del score (transparencia algorítmica —NFR—). La capacidad se activará/desactivará en caliente mediante feature flag (`ml_ranking_enabled`) sin redeploy. El modelo se validará mediante su integración en los flujos de exploración/postulación y ejecución operativa, y se documentará en diagrama de secuencia dedicado y diagrama estructural de pipeline.

**Evidencia gráfica asociada:**  
*Figura 13.* Pipeline de recomendación ML — Etapa 1: Retrieval (filtrado geoespacial + vectorial), Etapa 2: Ranking (scikit-learn, score + explicación), feature flag `ml_ranking_enabled`.

---

### Fase 4 — Construction / Interfaz-3D: Visualización Inmersiva e Interacción

Como resultado de la fase de **Construction** (AUP) y **Interfaz-3D** (base.md), se implementará el **módulo de visualización tridimensional** —Macro-módulo C— que combine Mapbox GL JS 3D para exploración geoespacial de servicios (capas de calor, clustering, geocercas dinámicas, navegación primera persona) y A-Frame / Photo Sphere Viewer para inspección de patologías de obra y entornos mediante panorámicas equirrectangulares 360° capturadas in-situ y renderizadas en WebGL. Esta capacidad permitirá reducir incertidumbre previa a contratación, validar condiciones del sitio remotamente y documentar evidencias de entrada/salida con contexto espacial inmersivo. La integración se modelará en diagramas de secuencia (publicación, ejecución, exploración) y estructurales (flujo orden-pago, tiempo real), y se verificará end-to-end en flujos automatizados correspondientes.

**Evidencia gráfica asociada:**  
*Figura 18.* Módulo visualización 3D — Mapbox GL JS 3D (exploración geoespacial, heatmap, clustering, geocercas) + A-Frame 360° (panorámicas equirrectangulares, inspección patologías, evidencias entrada/salida).

---

### Fase 5 — Construction / Confianza y Formalización: Mecanismos de Trazabilidad y Formalización Progresiva

Como resultado de la fase de **Construction** (AUP) y **Confianza y Formalización** (base.md), se incorporarán **mecanismos nativos de formalización** —Macro-módulo D— que trasciendan la intermediación: verificación identidad multinivel (KYC documental + OTP telefónico), certificación tributaria de ingresos descargable (Ley 527/1999, Decreto 1273/2018), TrustScore auditable sobre calificaciones bilaterales 360°, historial inmutable de transacciones con invariante de partida doble en billetera digital (asientos `wallet_transactions`, balance atómico, retenciones Escrow en `saldo_bloqueado`), y máquina de estados finita de 6 hitos que exige evidencias fotográficas georreferenciadas y doble conformidad antes de liberar calificación. Estos mecanismos apoyarán bancarización de prestadores y adscripción progresiva a seguridad social (Ley 1429/2010, Ley 1562/2012). Su funcionamiento se demostrará en flujos de KYC, ejecución operativa, pago dual y billetera con evidencia automatizada.

**Evidencia gráfica asociada:**  
*Figura 10.* FSM 6 hitos operativos — Check-in GPS Haversine <100m → Evidencia entrada MinIO → Adendas → Novedades → Evidencia salida → Doble conformidad pago → Calificación bilateral.  
*Figura 11.* Billetera digital — Partida doble inmutable, 3 tipos moneda (comprada/promocional/ganada), modalidades cobro A/B, retención Escrow en saldo_bloqueado.  
*Figura 19.* Flujo KYC multinivel — 11 documentos, 4 grupos, multi-instancia, panel revisión, verificación OTP.

---

### Fase 6 — Construction / Módulos Transversales: Comunicación, Notificaciones y Atributos de Calidad

Como resultado transversal en **Construction** (AUP), se implementarán el **módulo de comunicación y notificaciones** —Macro-módulo E— (mensajería 1:1 Socket.IO con historial y protocolo estructurado `⟦c:...⟧`, notificaciones push/in-app multicanal con centro de alertas) y se garantizarán los **atributos de calidad** —NFR—: usabilidad y accesibilidad (diseño centrado en usuario, WCAG AA, Design System tokens/componentes/reglas aplicado a ambos frontends), transparencia algorítmica (score + explicación en recomendación y reputación), seguridad de datos (JWT role_version revocación, scoping regional `region_scope_id`, auditoría forense inmutable `audit_logs`, Habeas Data Ley 1581/2012).

**Evidencia gráfica asociada:**  
*Figura 15.* Arquitectura tiempo real Socket.IO — Mensajería 1:1, notificaciones push/in-app, presencia, protocolo estructurado.  
*Figura 20.* Design System — Tokens semánticos, componentes atómicos/compuestos, reglas composición, arquitectura CSS capas, iconografía unificada.

---

### Fase 7 — Transition: Validación Empírica y Entrega

Como resultado de la fase de **Transition** (AUP), se ejecutará una **auditoría automatizada completa** de los catorce flujos UI end-to-end mediante Playwright Chromium + SwiftShader, obteniendo **PASA 100%** con evidencia reproducible: ~140 capturas secuenciales, 14 videos WebM, 14 scripts `.cjs` autónomos, 14 resúmenes técnicos con auditoría HTTP (códigos, payloads, latencias), consistencia PostgreSQL (constraints, triggers, integridad referencial) y verificación invariantes de negocio. Los flujos cubrirán la totalidad del ciclo de vida alineados a macro-módulos: A (autenticación, KYC, perfiles), B (exploración/postulación con ML), C (publicación 360°, ejecución con evidencias 3D), D (negociación/contrato, ejecución 6 hitos, pago dual, billetera, marañas, directorio, anuncios), E (mensajería, notificaciones, gobernanza). Se consolidará informe maestro de auditoría y guía de re-ejecución autónoma.

**Evidencia gráfica asociada:**  
*Figura 21.* Dashboard de resultados auditoría E2E — 14/14 flujos PASA, métricas HTTP, consistencia BD, invariantes negocio.  
*Figura 22.* Evidencia muestra flujo 06 (ejecución ciclo operativo) — Capturas secuenciales 6 hitos, video WebM, script autónomo.

---

## Matriz de Alineación: Fase Metodológica ↔ Macro-módulo ↔ NFR ↔ Resultado Entregable

| Fase AUP / base.md | Macro-módulo | NFR Abordados | Resultado Entregable Principal |
|-------------------|--------------|---------------|--------------------------------|
| Inception / Análisis | — | — | Estudio contextual, problema, objetivos, justificación, alcance |
| Elaboration / Diseño | A, B, C, D, E | Usabilidad, Seguridad | 75 RF/EARS + 75 HU + Trazabilidad + Arquitectura 3 capas + 28 diagramas + 15 PNG |
| Construction / Algoritmia-IA | B | Transparencia, Seguridad | Pipeline ML 2 etapas (retrieval+ranking), feature flag, diagramas dedicados |
| Construction / Interfaz-3D | C | Usabilidad, Accesibilidad | Mapbox 3D + A-Frame 360° integrado en flujos core |
| Construction / Confianza-Formalización | D | Seguridad, Transparencia | KYC multinivel, certificación ingresos (Ley 527), TrustScore, FSM 6 hitos, partida doble wallet |
| Construction / Transversales | E | Usabilidad, Accesibilidad, Seguridad | Mensajería Socket.IO, notificaciones multicanal, Design System 2 frontends, scoping regional, auditoría forense |
| Transition | A–E (integral) | Todos | 14/14 flujos E2E PASA (Playwright), evidencia reproducible, informe maestro |

---

## Referencias de Figuras en Formato APA (Séptima Edición)

> **Nota:** Las figuras referenciadas corresponden a los diagramas y renders generados en la fase de Elaboration/Diseño y validados en Construction/Transition. En el documento final, cada figura se numerará secuencialmente y se incluirá en el listado de figuras con su título descriptivo y fuente.

**Figuras de arquitectura y modelado (Fase 2 — Elaboration/Diseño)**

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 3. Arquitectura de tres capas del sistema ChambeApp* [Diagrama de arquitectura C4 Level 2]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 4. Diagrama de componentes — 36 blueprints REST organizados en seis módulos funcionales* [Diagrama de componentes PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 5. Diagrama de despliegue productivo multi-región* [Diagrama de despliegue PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 6. Modelo de datos relacional unificado — 47 entidades SQLAlchemy con PostGIS* [Diagrama entidad-relación PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 7. Casos de uso extendidos — Cuatro roles y catorce flujos principales* [Diagrama de casos de uso PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 8. Diagrama de secuencia — Autenticación y registro multi-rol con 2FA TOTP* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 9. Diagrama de secuencia — Publicación de chamba con geocerca dinámica y panorámica 360°* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 10. Máquina de estados finita — Ciclo operativo de seis hitos con verificación GPS y evidencias* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 11. Diagrama de secuencia — Pago dual y calificación bilateral 360°* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 12. Diagrama de secuencia — Derivación ágil de marañas desde adenda contractual* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 13. Pipeline de recomendación ML — Dos etapas (retrieval + ranking) con feature flag* [Diagrama de componentes PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 14. Cascada geoespacial — Filtrado PostGIS ST_DWithin y clustering* [Diagrama de componentes PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 15. Arquitectura tiempo real Socket.IO — Mensajería, notificaciones, presencia* [Diagrama de componentes PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 16. Infraestructura regional multi-región — LB, HA Patroni/Sentinel, data planes* [Diagrama de componentes PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 17. Diagrama de secuencia — Moderación, soporte y auditoría superadmin* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

**Figuras de módulos especializados (Fases 3–5 — Construction)**

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 18. Módulo visualización 3D — Mapbox GL JS 3D + A-Frame 360°* [Captura de interfaz y diagrama de integración]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 19. Flujo KYC multinivel — Once documentos, cuatro grupos, multi-instancia, panel revisión* [Diagrama de secuencia Mermaid]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 20. Design System aplicado — Tokens, componentes, reglas, arquitectura CSS, iconografía* [Diagrama de arquitectura del Design System PlantUML]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

**Figuras de validación (Fase 7 — Transition)**

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 21. Dashboard resultados auditoría E2E — 14/14 flujos PASA, métricas HTTP, consistencia BD* [Captura de dashboard de pruebas automatizadas]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

Palacio Mejía, J. D., & Ardila Montalván, V. A. (2026). *Figura 22. Evidencia muestra flujo 06 — Capturas secuenciales 6 hitos, video, script autónomo* [Evidencia Playwright]. En *Plataforma inteligente para la contratación de servicios laborales con IA y visualización 360 en Valledupar* (Tesis de maestría). Universidad Popular del Cesar.

---

*Documento preparado para inclusión directa en la sección **Resultados Esperados** del anteproyecto de grado. Queda a la espera de revisión y aprobación del director y jurados.*