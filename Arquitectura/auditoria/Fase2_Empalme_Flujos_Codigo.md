# Fase 2 — Informe de Empalme Técnico: Historias de Usuario vs. Código (Frontend & Backend)

> **Propósito:** Certificar que los flujos de la aplicación están implementados en el código y determinar con precisión el empalme entre las Historias de Usuario (HU-01 a HU-75), los controladores backend (`backend/app/controllers/`) y las rutas/componentes del frontend (`frontend/src/`).
> **Objetivo previo a Fase 3 y 4:** Dejar los flujos plenamente identificados, contrastados y clasificados por su método de prueba (Interacción en Navegador vía Obscura vs. Ejecución vía API Backend).
> **Fecha de verificación:** 2026-10-20.

---

## 1. Resumen Ejecutivo del Empalme

1. **Total de Historias de Usuario:** 75 (HU-01 a HU-75).
2. **Endpoints Backend:** 217 endpoints REST registrados bajo `/api/v1` en 25 blueprints de Flask-Smorest.
3. **Rutas Frontend:** 52 rutas declaradas en `frontend/src/app/routes.tsx` distribuidas en los roles `solicitante`, `pds`, `merchant` y páginas públicas.
4. **Veredicto de Cobertura:**
   - **13 Flujos End-to-End con UI Web:** Cuentan con interfaz gráfica completa en React, formularios, validaciones, gestión de estado y consumo de API. Están 100% listos para automatización en navegador mediante **Obscura** (Fase 4).
   - **3 Flujos Especializados de Backend / API:** Corresponden a capacidades internas de gobernanza (`superadmin`), moderación administrativa (`admin`) y micro-evaluaciones técnicas (`quizzes`). Cuentan con controladores y servicios completos en backend, y tipos en frontend, requiriendo validación automatizada por script API.

---

## 2. Matriz de Empalme por Flujo Operativo

### Flujo E2E-01: Autenticación, Registro y Control de Acceso
- **Historias cubiertas:** HU-01, HU-17, HU-56, HU-57, HU-58, HU-59, HU-60, HU-75.
- **Componentes Frontend:**
  - `RegisterPage.tsx` (`/register`): Selector de rol (`pds`, `solicitante`, `merchant`), validación de datos, clickwrap de T&C con enlace a `/terminos` y `/privacidad`.
  - `LoginPage.tsx` (`/login`): Formulario de credenciales. Soporta bifurcación 2FA condicional: si el backend retorna `requires_2fa: true`, renderiza pantalla de ingreso de código OTP de 6 dígitos.
  - `ForgotPasswordPage.tsx` (`/forgot-password`) y `ResetPasswordPage.tsx` (`/reset-password`).
- **Endpoints Backend:**
  - `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/2fa/verify`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**. Manejo de tokens JWT en `localStorage` con interceptor de rotación automática en `frontend/src/lib/api.ts`.

---

### Flujo E2E-02: Perfil Unificado, Verificación KYC y Seguridad
- **Historias cubiertas:** HU-02, HU-12, HU-52, HU-56, HU-57, HU-69, HU-70.
- **Componentes Frontend:**
  - `PerfilPage.tsx` en `/solicitante/perfil`, `/pds/perfil`, `/negocio/perfil`.
  - `DatosCuentaAccordion.tsx`: Nombre, teléfono, zona y habilidades.
  - `KycAccordion.tsx`: Listado dinámico de documentos por rol (`GET /kyc/mis-documentos`), subida de archivos base64 (`POST /kyc/documentos`), y botón de verificación OTP para número telefónico (`POST /auth/otp/send` y `/auth/otp/verify`).
  - `BilleteraAccordion.tsx`: Vinculación de cuentas bancarias (`GET/POST/PATCH/DELETE /metodos-pago`).
  - `SeguridadAccordion.tsx`: Conmutador de 2FA (`PUT /auth/2fa`) y modal de cambio de contraseña (`POST /auth/change-password`).
  - `PreferenciasAccordion.tsx` y `NotificacionesAccordion.tsx`: Configuración de interfaz (`GET/PUT /users/me/preferences`).
- **Endpoints Backend:**
  - `GET/PUT /api/v1/users/me/profile`, `GET /api/v1/kyc/mis-documentos`, `POST /api/v1/kyc/documentos`, `POST /api/v1/auth/otp/send`, `POST /api/v1/auth/otp/verify`, `PUT /api/v1/auth/2fa`, `POST /api/v1/auth/change-password`, `/metodos-pago`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-03: Publicación de Solicitudes con Geocerca y Visor 360°
- **Historias cubiertas:** HU-04, HU-06, HU-23, HU-25, HU-35, HU-37.
- **Componentes Frontend:**
  - `PublishSolicitudPage.tsx` (`/solicitante/solicitudes/new`): Formulario con categoría, descripción, presupuesto mínimo ($50.000 o a convenir), banda de precios sugeridos de mercado (`GET /prices/precios/<categoria>`), selector de geocerca en mapa con radio configurable (`LocationPicker.tsx`), modalidad de cobro (A con comisión / B sin comisión) y captura panorámica 360° (`SweepPanoCapture.tsx`, `CameraCapture.tsx`, `PhotoUploader.tsx`).
  - `SolicitudDetailPage.tsx` (`/solicitante/solicitudes/:id`): Renderizado esférico con `PanoViewer.tsx` (Photo Sphere Viewer).
- **Endpoints Backend:**
  - `POST /api/v1/solicitudes/`, `GET /api/v1/solicitudes/<id>`, `GET /api/v1/prices/precios/<categoria>`, subida MinIO.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-04: Exploración de Oportunidades y Postulación de Ofertas (PDS)
- **Historias cubiertas:** HU-05, HU-21, HU-23, HU-30.
- **Componentes Frontend:**
  - `PdsChambasPage.tsx` (`/pds/chambas`): Feed de solicitudes abiertas, tarjetas de trabajo, filtro por categoría, recomendaciones ML heurísticas.
  - `PdsPostularPage.tsx` (`/pds/postular/:id`): Formulario de postulación con cotización de precio, tiempo estimado y mensaje. Si la solicitud es Modalidad B, alerta sobre el costo de 50 monedas.
- **Endpoints Backend:**
  - `GET /api/v1/solicitudes/`, `GET /api/v1/ai/solicitudes-for-provider`, `POST /api/v1/solicitudes/<id>/ofertas`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-05: Negociación Bilateral de Ofertas y Firma Digital de Contrato
- **Historias cubiertas:** HU-07, HU-19, HU-21, HU-23, HU-60.
- **Componentes Frontend:**
  - `SolicitudDetailPage.tsx`: Lista de ofertas recibidas por el solicitante. Acciones de aceptar, rechazar o contraofertar (`POST /api/v1/ofertas/<id>/responder`).
  - `PdsChambasPage.tsx`: Vista de ofertas postuladas por el PDS, visualización de contraofertas y aceptación.
  - `ContratoFirmaPage.tsx` (`/contrato/firmar`): Vista a pantalla completa del contrato legal (`ContratoDocumento.tsx`), cláusulas de intermediación, tarifas y botón de firma vinculante (`PATCH /api/v1/contracts/<id>/estado` con acción `aceptar`).
- **Endpoints Backend:**
  - `POST /api/v1/ofertas/<id>/responder`, `POST /api/v1/contracts/`, `PATCH /api/v1/contracts/<id>/estado`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-06: Ejecución Operativa de la Chamba (6 Hitos de Obra)
- **Historias cubiertas:** HU-41, HU-42, HU-43, HU-44, HU-45.
- **Componentes Frontend:**
  - `ChambaDetallePage.tsx` y `ChambaDetalleContent.tsx` (`/solicitante/chambas/:id` y `/pds/chambas/:id`).
  - `ChambaTimeline.tsx`: Barra de estados de los 6 hitos.
  - **Hito 1 (Activación):** Creación de expediente (`POST /api/v1/chambas/`).
  - **Hito 2 (Llegada a Sitio):** Botón GPS en PDS con validación de distancia (≤ 100 m) + `EvidenceUploader.tsx` para fotos iniciales (`POST /chambas/:id/evidencia-entrada`).
  - **Hito 3 (Ejecución):** `AdendaNovedadForms.tsx` para adendas de tiempo/dinero (`POST /chambas/:id/adenda`) y `PanicButton.tsx` para novedades o pausar obra (`POST /novedad`, `PATCH /estado` → `pausada`).
  - **Hito 4 (Cierre y Revisión):** PDS sube evidencia final de salida (`POST /evidencia-salida`) y solicita validación. Solicitante revisa en `ValidacionHabilidades.tsx` y marca habilidades demostradas (`POST /validacion`).
  - **Hito 5 (Liquidación):** `PagoCheckin.tsx` con check-in dual independiente (`POST /chambas/:id/pago`) y confirmación de liquidación (`PATCH /estado` → `liquidacion_confirmada`).
  - **Hito 6 (Calificación Final):** `RatingCard.tsx`: Solicitante asigna estrellas (1 a 5) y reseña final (`POST /calificacion`), cerrando la Chamba como `finalizada`.
- **Endpoints Backend:**
  - `controllers/chambas.py` (17 endpoints), `services/chamba.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-07: Derivación, Negociación y Cierre de Marañas
- **Historias cubiertas:** HU-46.
- **Componentes Frontend:**
  - `MaranaCrearModal.tsx`: Solicitante deriva una adenda de la Chamba hacia una Maraña pública (`POST /chambas/:id/marana`).
  - `SolMaranaListPage.tsx` (`/solicitante/maranas`) y `PdsMaranaPage.tsx` (`/pds/maranas`): Feeds de marañas publicadas.
  - `MaranaDetallePage.tsx` y `MaranaDetalleContent.tsx`:
    - `MaranaPostularModal.tsx`: Postulación de PDS (`POST /maranas/:id/ofertas`).
    - `MaranaOfertas.tsx`: Negociación de contraofertas (`POST /maranas/:id/responder`).
    - Finalización operativa por PDS (`PATCH /maranas/:id/estado`).
    - `MaranaPago.tsx`: Check-in dual de pago directo (`POST /maranas/:id/pago`).
- **Endpoints Backend:**
  - `controllers/maranas.py` (12 endpoints), `models/marana.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-08: Gestión de Negocios y Directorio Público en Mapa
- **Historias cubiertas:** HU-47, HU-48, HU-49.
- **Componentes Frontend:**
  - Gestión Merchant:
    - `NegocioCrearPage.tsx` (`/negocio/crear`): Registro de negocio (`POST /negocios/`).
    - `NegocioHorariosPage.tsx` (`/negocio/horarios`): Horarios por día (`PUT /negocios/:id/horarios`).
    - `NegocioImagenesPage.tsx` (`/negocio/imagenes`): Galería MinIO (`POST /negocios/:id/imagenes/upload`).
    - `NegocioInicioPage.tsx` (`/negocio`): Dashboard de estadísticas (`GET /negocios/:id/stats`).
  - Directorio Público:
    - `NegociosMapaPage.tsx` (`/negocios`): Mapa con clusters/pins (`GET /negocios/mapa`), búsqueda fuzzy (`GET /negocios/buscar`), catálogo (`GET /negocios/categorias`).
    - `NegocioDetallePage.tsx` (`/negocios/:id`): Vista pública con horarios en tiempo real, calificación (`POST /negocios/:id/rating`) y reporte (`POST /negocios/:id/reportar`, crea ticket automático).
- **Endpoints Backend:**
  - `controllers/negocios.py` (20 endpoints), `controllers/merchant.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-09: Anuncios Laborales de Negocios (Publicación y Contacto)
- **Historias cubiertas:** HU-50, HU-51.
- **Componentes Frontend:**
  - `NegocioAnunciosPage.tsx` (`/negocio/anuncios`): Publicación de anuncio (`POST /anuncios/`), conmutación de estado (`PATCH /anuncios/:id/estado`), gestión de postulantes (`PATCH /anuncios/:id/postulaciones/:pid`).
  - `AnuncioDetallePage.tsx` (`/anuncios/:id`): Vista pública de vacante y postulación de PDS (`POST /anuncios/:id/postulaciones`).
- **Endpoints Backend:**
  - `controllers/anuncios.py` (9 endpoints), `models/anuncio.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-10: Gestión Financiera, Billetera y Monedas
- **Historias cubiertas:** HU-22, HU-24, HU-27, HU-28, HU-29, HU-70.
- **Componentes Frontend:**
  - `BilleteraPage.tsx` (`/solicitante/billetera`, `/pds/billetera`, `/negocio/billetera`): Saldo disponible/bloqueado (`GET /wallet/`), depósito simulado (`POST /wallet/deposit`), solicitud de retiro (`POST /wallet/withdraw`), historial (`GET /wallet/history`).
  - `PdsCoinsPage.tsx` (`/pds/coins`): Saldo de monedas por categoría (`GET /wallet/coins`), paquetes disponibles con bonificación (`GET /wallet/coins/packages`) y compra (`POST /wallet/coins/buy`).
- **Endpoints Backend:**
  - `controllers/wallet.py`, `services/wallet.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-11: Chat y Mensajería en Tiempo Real (Socket.IO)
- **Historias cubiertas:** HU-16, HU-38, HU-74.
- **Componentes Frontend:**
  - `MensajesPage.tsx` (`/solicitante/mensajes`, `/pds/mensajes`, `/negocio/mensajes`): Lista de conversaciones (`GET /chat/conversations`), historial (`GET /chat/conversations/:id/messages`), envío (`POST /chat/conversations/:id/messages`), recepción viva por socket (`message`) y marcado de leído (`PATCH /messages/read`).
- **Endpoints Backend:**
  - `controllers/chat.py`, `chat_socket.py`, `extensions.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-12: Canal de Disputas de Contratos
- **Historias cubiertas:** HU-64.
- **Componentes Frontend:**
  - `DisputasPage.tsx` (`/solicitante/disputas`, `/negocio/disputas`): Listado de disputas activas (`GET /my-disputes`), formulario de radicación sobre contratos no completados (`POST /contracts/:id/disputes`) con motivo y evidencia, seguimiento de estado.
- **Endpoints Backend:**
  - `controllers/disputes.py`, `models/contract.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

### Flujo E2E-13: Portafolio de Evidencias y Perfil Público del Prestador
- **Historias cubiertas:** HU-37, HU-39, HU-71, HU-72.
- **Componentes Frontend:**
  - `PdsPortafolioPage.tsx` (`/pds/portafolio`): Subida de ítems fotográficos y panorámicos a MinIO (`POST /portfolio/upload`), eliminación de ítems.
  - `PdsPerfilPublicoPage.tsx` (`/pds/:id`): Vista pública del perfil PDS con Trust Score (`GET /trust/:id`), badges (`GET /users/badges`), habilidades declaradas y validadas, y galería con visor 360° Photo Sphere Viewer (`GET /portfolio/pds/:id`).
  - `ContractDetailPage.tsx`: Módulo de validación social mediante endoso de habilidades (`POST /habilidades/endosar`).
- **Endpoints Backend:**
  - `controllers/portfolio.py`, `controllers/trust.py`, `controllers/users.py`, `controllers/habilidades.py`.
- **Estado de Empalme:** **COMPLETO Y CONECTADO**.

---

## 3. Flujos Operativos y de Gobernanza a Nivel Backend / API

Los siguientes módulos cuentan con implementación completa en el backend y modelos de datos, pero no disponen de una vista web dedicada en `routes.tsx`:

1. **Flujo API-01 — Quizzes y Progresión de Oficios:**
   - HU asociadas: HU-54, HU-55.
   - Endpoints: `GET /habilidades`, `GET /habilidades/:id/nivel/:n/quiz`, `POST /habilidades/:id/nivel/:n/quiz`, `POST /habilidades/:id/nivel/:n/certificacion`, `GET /habilidades/progreso`, `GET/POST /habilidades/certificaciones`.
   - Método de prueba: Script automatizado de API (invocación HTTP con token JWT de PDS).

2. **Flujo API-02 — Panel Administrativo Regional (Admin Staff):**
   - HU asociadas: HU-53, HU-62, HU-63, HU-65.
   - Endpoints: `GET/PATCH /admin/users`, `GET /admin/stats/overview`, `GET/POST /admin/verifications` (revisión KYC regional), `PATCH /admin/solicitudes/:id/moderate`, `PATCH /admin/contracts/:id/moderate`, `GET/POST /admin/disputes/:id/resolve`, `GET/PATCH /admin/tickets`, `GET/POST /admin/staff`.
   - Método de prueba: Script automatizado de API (con token JWT de rol `admin` regional).

3. **Flujo API-03 — Gobernanza y Superadministrador:**
   - HU asociadas: HU-66, HU-67.
   - Endpoints: `GET/POST/PATCH/DELETE /superadmin/admins`, `GET/PATCH /superadmin/config`, `GET /superadmin/audit-logs`, `POST /superadmin/override/user|contract`, `GET/PATCH /superadmin/ai/params`, `GET/PATCH /superadmin/flags`, `POST /superadmin/regions/reindex`.
   - Método de prueba: Script automatizado de API (con token JWT de rol `superadmin`).

---

## 4. Conclusión de Preparación para Fase 3 y Fase 4

- El código fuente respalda con total fidelidad el ciclo de vida de la aplicación.
- No existen piezas desconectadas en los flujos principales: la transición de solicitud a oferta, de oferta a contrato firmado, de contrato a expediente de Chamba (con sus 6 hitos), y de adenda a Maraña, cuenta con empalme exacto tanto en modelos como en componentes React y controladores REST.
- Los flujos quedan clasificados claramente para su posterior automatización: **13 flujos visuales para Obscura** y **3 flujos transaccionales para scripts de API**.
