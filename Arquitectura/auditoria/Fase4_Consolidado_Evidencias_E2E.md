# Informe Ejecutivo de Consolidación — Fase 4: Testeo Automatizado End-to-End de 14 Flujos

> **Programa Académico:** Maestría en Ingeniería de Software / Arquitectura de Sistemas  
> **Proyecto:** ChambeApp — Plataforma de Servicios y Formalización Laboral  
> **Fecha de Consolidación:** 21 de Octubre de 2026  
> **Estado de la Fase:** **100% COMPLETADA Y CERRADA (14 de 14 Flujos PASA)**  
> **Entorno de Evaluación:** Frontend React/Vite (`http://localhost:5173`), Backend Flask REST/Socket.IO (`http://localhost:5000/api/v1`), Base de Datos PostgreSQL 16 + PostGIS, Redis 7, MinIO S3, Celery Worker.  
> **Infraestructura de Automatización:** Playwright Chromium Headless con renderizado SwiftShader WebGL para soporte Mapbox GL, monitor activo de red REST/WS y preservación de estado JWT multi-rol.

---

## 1. Resumen Ejecutivo de la Fase 4

La **Fase 4** de la auditoría de grado tuvo como objetivo someter a prueba la totalidad de los flujos de negocio, flujos operativos y mecanismos de gobernanza de la plataforma ChambeApp mediante pruebas automatizadas de extremo a extremo (E2E).

Siguiendo estrictamente el principio rector del proyecto (**"El código manda sobre la documentación"**), se preservó la integridad absoluta de la base de código de la aplicación:
* **Líneas de código modificadas en `backend/`:** **0** (cero).
* **Líneas de código modificadas en `frontend/`:** **0** (cero).
* **Seguridad de credenciales:** Ninguna contraseña de prueba (`users.md`) fue expuesta en texto plano en logs, terminales, capturas ni reportes (enmascaradas uniformemente como `********`).
* **Trazabilidad de evidencias:** Cada flujo cuenta con su propio paquete aislado y reproducible compuesto por capturas de pantalla secuenciales, grabación continua de video en formato `.webm`, script ejecutable de Playwright `.cjs` e informe técnico de arquitectura `resumen.md`.

---

## 2. Matriz Consolidada de los 14 Flujos Evaluados

| # | Identificador del Flujo | Módulo / Dominio | Actores Involucrados | Capturas | Video (.webm) | Script Playwright | Resultado |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---:|
| **01** | `01-autenticacion-registro` | Acceso y Seguridad | PDS, Solicitante | 10 | 3.1 MB | [01-autenticacion-registro.cjs](../evidencias/01-autenticacion-registro/script/01-autenticacion-registro.cjs) | **PASA (100%)** |
| **02** | `02-perfil-kyc` | Identidad y Cumplimiento | PDS, Solicitante | 11 | 4.8 MB | [02-perfil-kyc.cjs](../evidencias/02-perfil-kyc/script/02-perfil-kyc.cjs) | **PASA (100%)** |
| **03** | `03-publicacion-chamba` | Geoespacial y Multimedia | Solicitante | 12 | 6.2 MB | [03-publicacion-chamba.cjs](../evidencias/03-publicacion-chamba/script/03-publicacion-chamba.cjs) | **PASA (100%)** |
| **04** | `04-exploracion-postulacion-pds` | Matching y Postulación | PDS | 10 | 4.5 MB | [04-exploracion-postulacion-pds.cjs](../evidencias/04-exploracion-postulacion-pds/script/04-exploracion-postulacion-pds.cjs) | **PASA (100%)** |
| **05** | `05-negociacion-contrato-firma` | Contratación Digital | Solicitante, PDS | 10 | 4.1 MB | [05-negociacion-contrato-firma.cjs](../evidencias/05-negociacion-contrato-firma/script/05-negociacion-contrato-firma.cjs) | **PASA (100%)** |
| **06** | `06-ejecucion-ciclo-operativo` | Ciclo Operativo (6 Hitos) | PDS, Solicitante | 10 | 5.0 MB | [06-ejecucion-ciclo-operativo.cjs](../evidencias/06-ejecucion-ciclo-operativo/script/06-ejecucion-ciclo-operativo.cjs) | **PASA (100%)** |
| **07** | `07-pago-dual-calificacion` | Pagos y Reputación | Solicitante, PDS | 10 | 3.9 MB | [07-pago-dual-calificacion.cjs](../evidencias/07-pago-dual-calificacion/script/07-pago-dual-calificacion.cjs) | **PASA (100%)** |
| **08** | `08-derivacion-cierre-maranas` | Trabajos Ágiles (Marañas) | PDS, Solicitante | 10 | 4.6 MB | [08-derivacion-cierre-maranas.cjs](../evidencias/08-derivacion-cierre-maranas/script/08-derivacion-cierre-maranas.cjs) | **PASA (100%)** |
| **09** | `09-directorio-negocios-locales` | Comercio Local y Catálogo | Merchant, Solicitante | 10 | 4.3 MB | [09-directorio-negocios-locales.cjs](../evidencias/09-directorio-negocios-locales/script/09-directorio-negocios-locales.cjs) | **PASA (100%)** |
| **10** | `10-anuncios-laborales-negocios` | Empleo y Reclutamiento | Merchant, PDS | 10 | 4.2 MB | [10-anuncios-laborales-negocios.cjs](../evidencias/10-anuncios-laborales-negocios/script/10-anuncios-laborales-negocios.cjs) | **PASA (100%)** |
| **11** | `11-billetera-recargas-monedas` | FinTech y Gamificación | Solicitante, PDS | 10 | 3.7 MB | [11-billetera-recargas-monedas.cjs](../evidencias/11-billetera-recargas-monedas/script/11-billetera-recargas-monedas.cjs) | **PASA (100%)** |
| **12** | `12-mensajeria-chat-tiempo-real` | WebSockets Bidireccional | Solicitante, PDS | 10 | 5.2 MB | [12-mensajeria-chat-tiempo-real.cjs](../evidencias/12-mensajeria-chat-tiempo-real/script/12-mensajeria-chat-tiempo-real.cjs) | **PASA (100%)** |
| **13** | `13-notificaciones-alertas` | Push y Centro de Alertas | Solicitante, PDS | 10 | 3.7 MB | [13-notificaciones-alertas.cjs](../evidencias/13-notificaciones-alertas/script/13-notificaciones-alertas.cjs) | **PASA (100%)** |
| **14** | `14-moderacion-soporte-superadmin` | Gobernanza y Auditoría | Admin, Superadmin, Solicitante, PDS | 10 | 9.4 MB | [14-moderacion-soporte-superadmin.cjs](../evidencias/14-moderacion-soporte-superadmin/script/14-moderacion-soporte-superadmin.cjs) | **PASA (100%)** |
| **TOTAL** | **14 Flujos Completados** | **Plataforma Integral** | **Todos los Roles** | **143** | **69.7 MB** | **14 Scripts CJS** | **100% PASA** |

---

## 3. Síntesis Técnica por Flujo de Negocio

### Flujo 01: Autenticación y Registro Multi-Rol
* **Foco Arquitectónico:** Emisión y validación de tokens JWT con claims de seguridad (`role`, `role_v`), encriptación de contraseñas mediante `bcrypt` y prevención de colisión de identidades.
* **Métricas:** 10 peticiones API capturadas. Verificación exitosa de login cruzado (PDS y Solicitante) y validación de esquemas de error HTTP 401 y 422.
* **Informe Detallado:** [`01-autenticacion-registro/resumen.md`](../evidencias/01-autenticacion-registro/resumen.md)

### Flujo 02: Perfil de Usuario y KYC Documental
* **Foco Arquitectónico:** Trazabilidad documental multinivel (`documentos_requeridos` vs `documentos_usuario`), cálculo reactivo de completitud KYC (0% a 100%) y persistencia de habilidades verificadas.
* **Métricas:** Carga de documentos de identidad, comprobantes de domicilio y antecedentes. Transición de estado a `enviado` y cálculo dinámico de `Profile.verificado`.
* **Informe Detallado:** [`02-perfil-kyc/resumen.md`](../evidencias/02-perfil-kyc/resumen.md)

### Flujo 03: Publicación de Solicitudes Geocerca y 360°
* **Foco Arquitectónico:** Geocodificación y proyección PostGIS (`ST_SetSRID`, `ST_MakePoint`), soporte de radios geográficos dinámicos (`radio_km`) y vinculación de visor inmersivo 360° para visualización de áreas de trabajo.
* **Métricas:** Publicación de solicitud con coordenadas GPS Medellín (`6.2442, -75.5812`), presupuesto fijado en $120.000 COP y verificación de índice geoespacial GiST.
* **Informe Detallado:** [`03-publicacion-chamba/resumen.md`](../evidencias/03-publicacion-chamba/resumen.md)

### Flujo 04: Exploración Geoespacial y Postulación PDS
* **Foco Arquitectónico:** Filtrado espacial por proximidad (`ST_DWithin`), cálculo de distancia euclidiana/Haversine y postulación atómica de ofertas con deducción de monedas de postulación.
* **Métricas:** Postulación del PDS a la solicitud con tarifa propuesta de $120.000 COP, mensaje técnico y confirmación en tiempo real en la bandeja del cliente.
* **Informe Detallado:** [`04-exploracion-postulacion-pds/resumen.md`](../evidencias/04-exploracion-postulacion-pds/resumen.md)

### Flujo 05: Negociación Bilateral y Firma Digital de Contrato
* **Foco Arquitectónico:** Ciclo de negociación contractual (oferta -> contraoferta -> aceptación), compilación de términos vinculantes y firma digital en pantalla completa con generación de hash SHA-256 inmutable.
* **Métricas:** Formalización del Contrato #1, transición de estado a `EN_PROGRESO` y generación del expediente legal con sellado de tiempo UTC.
* **Informe Detallado:** [`05-negociacion-contrato-firma/resumen.md`](../evidencias/05-negociacion-contrato-firma/resumen.md)

### Flujo 06: Ejecución y Ciclo Operativo (6 Hitos)
* **Foco Arquitectónico:** Máquina de estados finita determinista en `contracts.py`:
  `CREADO` -> `EN_CAMINO` -> `EN_SITIO` -> `INICIADO` -> `COMPLETADO_PENDIENTE` -> `COMPLETADO`.
* **Métricas:** Ejecución secuencial de los 6 hitos con registro fotográfico de evidencias de inicio y fin, geocercas de arribo y verificación bilateral.
* **Informe Detallado:** [`06-ejecucion-ciclo-operativo/resumen.md`](../evidencias/06-ejecucion-ciclo-operativo/resumen.md)

### Flujo 07: Pago Dual Directo y Calificación Mutua
* **Foco Arquitectónico:** Modelo de pago dual (Efectivo presencial vs. Pasarela Wompi/Billetera), cálculo de comisión de plataforma (5% PDS, 0% Solicitante) y matriz de calificación bilateral 360° (1 a 5 estrellas con tags de reputación).
* **Métricas:** Confirmación de pago de $120.000 COP, recálculo atómico de `Profile.rating_avg` y actualización de TrustScore.
* **Informe Detallado:** [`07-pago-dual-calificacion/resumen.md`](../evidencias/07-pago-dual-calificacion/resumen.md)

### Flujo 08: Derivación y Cierre Ágil de Marañas (Rebusques)
* **Foco Arquitectónico:** Adendas contractuales ágiles derivadas de un contrato principal (`parent_id = 1`) para trabajos adicionales sobrevenidos, con ciclo de vida acelerado de 3 hitos.
* **Métricas:** Radicación y cierre de maraña por $45.000 COP, liberación de pago directo y consolidación en el expediente maestro.
* **Informe Detallado:** [`08-derivacion-cierre-maranas/resumen.md`](../evidencias/08-derivacion-cierre-maranas/resumen.md)

### Flujo 09: Directorio y Gestión de Negocios Locales
* **Foco Arquitectónico:** Subdominio comercial (`merchant`), gestión de perfiles de negocio, georreferenciación en mapa interactivo de comercios aliados y catálogo de productos/servicios.
* **Métricas:** Consulta de directorio local, apertura de ficha de comercio y auditoría de métodos de contacto directo.
* **Informe Detallado:** [`09-directorio-negocios-locales/resumen.md`](../evidencias/09-directorio-negocios-locales/resumen.md)

### Flujo 10: Anuncios Laborales de Negocios
* **Foco Arquitectónico:** Tablón de empleo barrial para comercios, publicación de vacantes operativas con requisitos de oficio y postulación de trabajadores locales.
* **Métricas:** Publicación de anuncio laboral, filtrado por sector y envío de postulación de PDS con notificación automática al comerciante.
* **Informe Detallado:** [`10-anuncios-laborales-negocios/resumen.md`](../evidencias/10-anuncios-laborales-negocios/resumen.md)

### Flujo 11: Billetera Digital, Recargas Simuladas y Monedas
* **Foco Arquitectónico:** Libro mayor (*Ledger*) con balance contable estricto (`saldo_disponible`, `saldo_bloqueado`), paquetes de monedas virtuales (`CoinsPackage`) para postulación y recarga simulada bancaria (PSE/Nequi/Daviplata).
* **Métricas:** Recarga de $50.000 COP, adquisición de paquete de 50 monedas y auditoría de integridad transaccional en `wallet_transactions`.
* **Informe Detallado:** [`11-billetera-recargas-monedas/resumen.md`](../evidencias/11-billetera-recargas-monedas/resumen.md)

### Flujo 12: Mensajería y Chat en Tiempo Real WebSockets
* **Foco Arquitectónico:** Despacho bidireccional mediante Flask-SocketIO sobre salas privadas `conversation_<id>`, protocolo de marcadores estructurados (`⟦c:condicion⟧`, `⟦c:contraoferta⟧`) y control de acceso verificado por JWT.
* **Métricas:** Intercambio fluido de mensajes de texto, tarjetas de condiciones contractuales, adjuntos fotográficos y marcación masiva de lectura (`PATCH /messages/read`).
* **Informe Detallado:** [`12-mensajeria-chat-tiempo-real/resumen.md`](../evidencias/12-mensajeria-chat-tiempo-real/resumen.md)

### Flujo 13: Notificaciones Push, In-App y Centro de Alertas
* **Foco Arquitectónico:** Centro unificado de notificaciones persistentes (RF-10), despacho asíncrono vía WebSocket a la sala `user:<id>`, alerta obligatoria de formalización laboral colombiana tras finalizar servicios y preferencias de canal en perfil.
* **Métricas:** 40 peticiones API capturadas. Consulta de 21 alertas no leídas del cliente y marcación masiva en lote del PDS que redujo su balance a 0 pendientes manteniendo aislamiento estricto.
* **Informe Detallado:** [`13-notificaciones-alertas/resumen.md`](../evidencias/13-notificaciones-alertas/resumen.md)

### Flujo 14: Moderación, Soporte y Auditoría Superadmin
* **Foco Arquitectónico:** Gobernanza multi-región (`region_scope_id`), tribunal arbitral de disputas, mesa de ayuda, aprobación documental KYC, gestión de Feature Flags en caliente y pistas inmutables de auditoría forense (`RNF-AUD`).
* **Métricas:** 49 peticiones API capturadas. Demostración de bloqueo regional (HTTP 404 fuera de región), laudo formal de disputa por Superadmin, cierre de ticket #3, activación de `ml_ranking_enabled` y verificación de 6 pistas inmutables en `audit_logs`.
* **Informe Detallado:** [`14-moderacion-soporte-superadmin/resumen.md`](../evidencias/14-moderacion-soporte-superadmin/resumen.md)

---

## 4. Hallazgos Arquitectónicos Clave para la Defensa de Tesis

Durante la ejecución de las pruebas automatizadas de la Fase 4, se validaron patrones de software de alto nivel que enriquecen la discusión académica de la tesis:

1. **Partición Regional y Modelo de Aislamiento Soberano:**
   El mecanismo `region_scope_id` demostró cómo aislar la gestión administrativa por municipios o áreas metropolitanas (Medellín vs. otras regiones) directamente a nivel de consulta relacional, previniendo fugas de datos y garantizando que solo el rol `superadmin` ejerza soberanía universal.
2. **Desacoplamiento Cronológico de Negociación Contractual:**
   El uso del compilador de marcadores en frontend (`⟦c:...⟧`) sobre una tabla de mensajes plana permitió entrelazar la conversación informal con compromisos vinculantes sin recurrir a costosos esquemas de polimorfismo relacional en la base de datos.
3. **Máquina de Estados Finita e Inmutable para Pagos Directos:**
   La verificación cruzada de hitos operativos aseguró que el desembolso o la confirmación de pago dual solo sea habilitada tras la aceptación bilateral del hito `COMPLETADO_PENDIENTE`, mitigando el riesgo de fraude en servicios físicos no bancarizados.
4. **Auditoría Forense con Diferencial de Estado (`AuditLog`):**
   El registro transaccional obligatorio de `before_json` y `after_json` asegura que cualquier arbitraje, modificación de comisiones o conmutación de feature flags cuente con trazabilidad forense inmutable de grado corporativo.

---

## 5. Estado de Cierre de la Fase 4 y Siguiente Fase

* **Fase 4 — Testeo automatizado por flujo:** **CERRADA AL 100%**
* **Siguiente Paso Oficial (Fase 5):** **Diagramas de Secuencia (Mermaid)**
  * Generación y alineación de los diagramas de secuencia formales en sintaxis Mermaid para cada uno de los flujos de la plataforma bajo `documentation/Arquitectura/diagramas/`, documentando las interacciones exactas entre Actor, Frontend (React), API Gateway / Controlador Flask, Servicios de Dominio, Base de Datos PostgreSQL/PostGIS, Redis y WebSockets.
