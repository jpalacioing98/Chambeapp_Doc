# Documentación Exhaustiva de Flujos de la Aplicación (ChambeApp)

> **Versión:** 1.0 — Documento Oficial de Arquitectura para Sustentación de Grado  
> **Fecha:** Octubre 2026  
> **Fuentes de Verdad:** Código fuente activo (`backend/` Flask, `frontend/` React/Vite) y [Historias de Usuario v3.0](../Requerimientos/HistoriasDeUsuario.md)  
> **Trazabilidad:** Contrastado contra las 75 Historias de Usuario (HU-01 a HU-75) y los [Riesgos Conocidos](auditoria/Riesgos_Conocidos.md)

---

## Tabla de Contenido de Flujos

### Bloque A: Flujos End-to-End con Interfaz Visual Completa (14 Flujos UI)
1. [Flujo 01 — Autenticación, Registro y Recuperación de Credenciales](#flujo-01--autenticación-registro-y-recuperación-de-credenciales)
2. [Flujo 02 — Perfil de Usuario y Verificación de Identidad (KYC)](#flujo-02--perfil-de-usuario-y-verificación-de-identidad-kyc)
3. [Flujo 03 — Publicación de Solicitudes de Chamba (Geocerca y Panorámicas 360°)](#flujo-03--publicación-de-solicitudes-de-chamba-geocerca-y-panorámicas-360)
4. [Flujo 04 — Exploración Geoespacial y Postulación de Ofertas (PDS)](#flujo-04--exploración-geoespacial-y-postulación-de-ofertas-pds)
5. [Flujo 05 — Negociación Bilateral de Ofertas y Firma Digital de Contrato](#flujo-05--negociación-bilateral-de-ofertas-y-firma-digital-de-contrato)
6. [Flujo 06 — Ejecución y Ciclo Operativo de la Chamba (6 Hitos)](#flujo-06--ejecución-y-ciclo-operativo-de-la-chamba-6-hitos)
7. [Flujo 07 — Pago Dual Directo y Calificación Mutua](#flujo-07--pago-dual-directo-y-calificación-mutua)
8. [Flujo 08 — Derivación y Cierre Ágil de Marañas (Rebusques)](#flujo-08--derivación-y-cierre-ágil-de-marañas-rebusques)
9. [Flujo 09 — Directorio y Gestión de Negocios Locales](#flujo-09--directorio-y-gestión-de-negocios-locales)
10. [Flujo 10 — Anuncios Laborales de Negocios](#flujo-10--anuncios-laborales-de-negocios)
11. [Flujo 11 — Billetera Digital, Recargas Simuladas y Paquetes de Monedas](#flujo-11--billetera-digital-recargas-simuladas-y-paquetes-de-monedas)
12. [Flujo 12 — Mensajería y Chat 1:1 en Tiempo Real (WebSockets)](#flujo-12--mensajería-y-chat-11-en-tiempo-real-websockets)
13. [Flujo 13 — Canal de Disputas y Arbitraje Contractual](#flujo-13--canal-de-disputas-y-arbitraje-contractual)
14. [Flujo 14 — Portafolio de Evidencias y Reputación PDS (Trust Score)](#flujo-14--portafolio-de-evidencias-y-reputación-pds-trust-score)

### Bloque B: Flujos de Gobernanza y Servicios API (3 Flujos Administrativos)
15. [Flujo 15 — Evaluación de Competencias y Quizzes de Oficio](#flujo-15--evaluación-de-competencias-y-quizzes-de-oficio)
16. [Flujo 16 — Moderación y Operación Regional (Admin)](#flujo-16--moderación-y-operación-regional-admin)
17. [Flujo 17 — Gobernanza Global y Configuración de Plataforma (Superadmin)](#flujo-17--gobernanza-global-y-configuración-de-plataforma-superadmin)

---

## Bloque A: Flujos End-to-End con Interfaz Visual Completa

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 01: AUTENTICACIÓN, REGISTRO Y RECUPERACIÓN DE CREDENCIALES                                   |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 01 — Autenticación, Registro y Recuperación de Credenciales

* **Actores Involucrados:** Visitante / Usuario no registrado, Usuario registrado (Cliente o PDS).
* **Precondiciones:**
  * Conectividad con el backend Flask (`http://localhost:5000/api/v1`).
  * Base de datos PostgreSQL activa con esquema cargado.
  * Formulario accesible en las rutas de React: `/registro`, `/login`, `/verificar-2fa`, `/recuperar-clave`.
* **Historias de Usuario Asociadas:** [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-registro-de-usuario), [HU-02](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-02-inicio-de-sesión-y-autenticación-jwt), [HU-03](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-03-cierre-de-sesión), [HU-49](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-49-autenticación-en-dos-factores-2fa-totp), [HU-50](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-50-recuperación-de-contraseña-mediante-código-otp).

#### Paso a Paso Detallado:

##### Subflujo A: Registro de Cuenta
1. **Acción del Usuario en Frontend (`/registro` - `RegisterPage.tsx`):**
   * El usuario diligencia el formulario: Nombre completo, correo electrónico, contraseña (mínimo 8 caracteres, mayúscula, minúscula y número), confirmación de contraseña, número de celular, rol principal (`cliente` o `trabajador`), departamento y municipio.
   * Hace clic en **"Crear Cuenta"**.
2. **Petición HTTP:**
   * `POST /api/v1/auth/registro`
   * **Headers:** `Content-Type: application/json`
   * **Body JSON:**
     ```json
     {
       "nombre": "Carlos Mendoza",
       "email": "carlos.pds@example.com",
       "password": "Password123*",
       "telefono": "+573001234567",
       "rol": "trabajador",
       "departamento_id": 1,
       "municipio_id": 101
     }
     ```
3. **Procesamiento y Respuesta del Backend (`controllers/auth.py`):**
   * Valida unicidad de `email` y `telefono`.
   * Genera hash criptográfico con `bcrypt` (`password_hash`).
   * Crea un registro en `usuarios` (`is_active = True`, `two_factor_enabled = False`, `kyc_status = 'no_iniciado'`).
   * Crea automáticamente una billetera inicial en `billeteras` vinculada al nuevo `usuario_id` con saldo `0.00 COP` y `0 monedas`.
   * Genera el par de tokens JWT (`access_token` y `refresh_token`).
   * **Respuesta HTTP:** `201 Created`
     ```json
     {
       "user": {
         "id": 15,
         "nombre": "Carlos Mendoza",
         "email": "carlos.pds@example.com",
         "rol": "trabajador",
         "kyc_status": "no_iniciado"
       },
       "access_token": "eyJhbGciOi...",
       "refresh_token": "eyJhbGciOi..."
     }
     ```
4. **Impacto en Base de Datos:**
   * `INSERT INTO usuarios (nombre, email, password_hash, telefono, rol, departamento_id, municipio_id, is_active, created_at)`
   * `INSERT INTO billeteras (usuario_id, saldo_disponible, saldo_retenido, saldo_monedas, created_at)`

##### Subflujo B: Inicio de Sesión y Verificación 2FA
1. **Acción del Usuario en Frontend (`/login` - `LoginPage.tsx`):**
   * Ingresa correo y contraseña. Hace clic en **"Iniciar Sesión"**.
2. **Petición HTTP:**
   * `POST /api/v1/auth/login`
   * **Body JSON:** `{ "email": "carlos.pds@example.com", "password": "Password123*" }`
3. **Respuesta del Backend:**
   * **Caso sin 2FA:** Retorna `200 OK` con tokens JWT y perfil de usuario. Frontend redirige a `/explorar` o `/solicitudes`.
   * **Caso con 2FA habilitado (`two_factor_enabled = True`):**
     * Retorna `200 OK` indicando desafío:
       ```json
       {
         "requires_2fa": true,
         "temp_token": "eyJhbGciOi...",
         "message": "Ingrese su código de autenticación de dos factores"
       }
       ```
     * Frontend abre modal `/verificar-2fa` (`TwoFactorVerifyModal.tsx`).
     * Usuario ingresa código de 6 dígitos de Google Authenticator / Authy.
     * Petición: `POST /api/v1/auth/2fa/verificar` con `{ "temp_token": "...", "code": "489201" }`.
     * Backend valida TOTP mediante `pyotp` (o código de respaldo en `usuarios.two_factor_backup_codes`).
     * Retorna `200 OK` con tokens definitivos.

##### Subflujo C: Recuperación de Contraseña
1. **Acción en Frontend (`/recuperar-clave` - `ForgotPasswordPage.tsx`):**
   * Usuario ingresa su correo y presiona **"Enviar instrucciones"**.
2. **Petición HTTP:** `POST /api/v1/auth/recuperar-password` con `{ "email": "carlos.pds@example.com" }`.
3. **Respuesta Backend:** Retorna `200 OK` (simula envío de correo o guarda código OTP en `password_reset_tokens`).
4. **Acción en Frontend (`/restablecer-clave` - `ResetPasswordPage.tsx`):**
   * Usuario ingresa código OTP y nueva contraseña.
   * `POST /api/v1/auth/restablecer-password` con `{ "token": "...", "new_password": "NewPassword456*" }`.
   * Backend actualiza `usuarios.password_hash` e invalida el token.

* **Resultado Esperado:** Usuario autenticado con sesión iniciada en `localStorage`/`sessionStorage` y redirección inmediata a su panel principal.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Correo ya registrado (`"El correo ya se encuentra en uso"`).
  * `401 Unauthorized`: Contraseña incorrecta o usuario inactivo (`"Credenciales inválidas"`).
  * `422 Unprocessable Entity`: Código 2FA inválido o expirado.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 02: PERFIL DE USUARIO Y VERIFICACIÓN DE IDENTIDAD (KYC)                                     |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 02 — Perfil de Usuario y Verificación de Identidad (KYC)

* **Actores Involucrados:** Usuario registrado (PDS o Cliente), Administrador (moderador).
* **Precondiciones:**
  * Usuario con sesión iniciada (`access_token` vigente).
  * Servicio de almacenamiento MinIO activo (`http://minio:9000`).
* **Historias de Usuario Asociadas:** [HU-06](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-06-consulta-y-edición-de-perfil-de-usuario), [HU-07](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-07-subida-de-foto-de-perfil), [HU-51](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-51-verificación-de-identidad-kyc-con-documento), [HU-52](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-52-validación-telefónica-vía-otp-sms).

#### Paso a Paso Detallado:
1. **Consulta de Perfil (`/perfil` - `ProfilePage.tsx`):**
   * Frontend ejecuta `GET /api/v1/usuarios/perfil`.
   * Backend retorna datos del usuario, avatar, `kyc_status` (`no_iniciado`, `pendiente`, `aprobado`, `rechazado`), indicador de teléfono verificado (`telefono_verificado: bool`) y Trust Score actual.
2. **Validación Telefónica OTP SMS (`PhoneVerificationModal.tsx`):**
   * Usuario solicita validación de su número de teléfono.
   * `POST /api/v1/auth/telefono/enviar-otp` `{ "telefono": "+573001234567" }`.
   * Backend genera código OTP numérico de 6 dígitos, lo almacena en Redis con TTL de 300 segundos, e invoca API de Onurix (o modo mock si `SMS_SEND_DEV=1`).
   * Usuario introduce código en pantalla y frontend envía:
     * `POST /api/v1/auth/telefono/verificar-otp` `{ "codigo": "382910" }`.
   * Backend valida y ejecuta: `UPDATE usuarios SET telefono_verificado = True WHERE id = :user_id`.
   * Retorna `200 OK` `{ "verified": true, "message": "Teléfono validado exitosamente" }`.
3. **Carga de Documentos KYC (`/verificacion-kyc` - `KycVerificationPage.tsx`):**
   * Usuario selecciona tipo de documento (Cédula de Ciudadanía, Cédula de Extranjería, PPT) e ingresa número de documento.
   * Carga dos archivos fotográficos: Cara frontal del documento y cara posterior.
   * Frontend envía formulario multipart/form-data:
     * `POST /api/v1/kyc/solicitud`
     * **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
     * **Campos:** `tipo_documento="CC"`, `numero_documento="1098765432"`, `foto_frontal=@cedula_frente.jpg`, `foto_trasera=@cedula_reverso.jpg`.
4. **Procesamiento Backend (`controllers/kyc.py`):**
   * Sube imágenes a MinIO (`s3://chambeapp-portfolio/kyc/...`).
   * Inserta registro en `solicitudes_kyc` con `estado = 'pendiente'` y los URLs de almacenamiento seguro.
   * Actualiza `usuarios.kyc_status = 'pendiente'`.
   * Emite notificación interna para administradores.
   * **Respuesta HTTP:** `201 Created`
     ```json
     {
       "solicitud_id": 8,
       "estado": "pendiente",
       "mensaje": "Documentos recibidos para revisión manual"
     }
     ```
* **Resultado Esperado:** Badge de KYC en estado "En Revisión" en la interfaz del usuario; acceso condicionado a operaciones de alto valor.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Formato de archivo no permitido (solo JPEG/PNG/PDF) o archivo supera los 5MB.
  * `409 Conflict`: Ya existe una solicitud de KYC pendiente o aprobada para este usuario.
  * `429 Too Many Requests`: Exceso de solicitudes de OTP SMS en menos de 10 minutos.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 03: PUBLICACIÓN DE SOLICITUDES DE CHAMBA (GEOCERCA Y PANORÁMICAS 360°)                      |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 03 — Publicación de Solicitudes de Chamba (Geocerca y Panorámicas 360°)

* **Actores Involucrados:** Cliente (creador de la necesidad laboral).
* **Precondiciones:**
  * Cliente con sesión iniciada.
  * Categorías y oficios configurados en base de datos.
* **Historias de Usuario Asociadas:** [HU-11](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-11-creación-y-publicación-de-solicitud-de-chamba), [HU-12](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-12-edición-y-cancelación-de-solicitud), [HU-41](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-41-geocerca-y-radio-de-cobertura-en-solicitudes), [HU-42](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-42-visor-de-fotos-panorámicas-360-en-solicitudes).

#### Paso a Paso Detallado:
1. **Acción en Frontend (`/solicitudes/crear` - `CreateRequestPage.tsx`):**
   * **Paso 1 (Detalles):** Ingresa título ("Reparación de fuga de tubería en cocina"), descripción detallada, selecciona Categoría ("Plomería") y Oficio ("Fontanero"), define presupuesto estimado (`120000 COP`) y fecha límite.
   * **Paso 2 (Geolocalización y Geocerca):** Utiliza mapa interactivo Leaflet; coloca un pin en su ubicación y ajusta el radio de cobertura mediante un slider (ej. `5.0 km`). El componente dibuja un círculo semitransparente sobre el mapa.
   * **Paso 3 (Material Fotográfico / Panorámica 360°):** Adjunta fotos del problema. Si activa el toggle *"Imagen Panorámica 360°"*, el visor embebido (*Photo Sphere Viewer*) previsualiza la imagen equirrectangular.
   * Hace clic en **"Publicar Chamba"**.
2. **Petición HTTP:**
   * `POST /api/v1/solicitudes`
   * **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
   * **Campos:** `titulo`, `descripcion`, `categoria_id=3`, `oficio_id=7`, `presupuesto=120000`, `latitud=4.6532`, `longitud=-74.0836`, `direccion="Cra 30 # 45-10"`, `radio_cobertura_km=5.0`, `es_panoramica_360=true`, archivos adjuntos.
3. **Procesamiento Backend (`controllers/solicitudes.py`):**
   * Almacena las imágenes en MinIO.
   * Inserta registro en `solicitudes`:
     * Calcula la geometría PostGIS: `geom = ST_SetSRID(ST_MakePoint(-74.0836, 4.6532), 4326)`.
     * Asigna `estado = 'publicada'`.
   * Inserta rutas en `fotos_solicitud` con flag `es_360 = true`.
   * **Respuesta HTTP:** `201 Created`
     ```json
     {
       "id": 42,
       "titulo": "Reparación de fuga de tubería en cocina",
       "estado": "publicada",
       "presupuesto": 120000.0,
       "radio_cobertura_km": 5.0,
       "es_panoramica_360": true,
       "fotos": ["http://localhost:9000/chambeapp-portfolio/solicitudes/42_foto_360.jpg"]
     }
     ```
* **Resultado Esperado:** La solicitud queda visible en el feed público para los PDS situados dentro del radio de 5 km.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Presupuesto inferior al mínimo permitido por oficio o coordenadas fuera del territorio soportado.
  * `413 Payload Too Large`: Fotografías exceden el límite de carga (máx 15MB para 360°).

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 04: EXPLORACIÓN GEOESPACIAL Y POSTULACIÓN DE OFERTAS (PDS)                                  |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 04 — Exploración Geoespacial y Postulación de Ofertas (PDS)

* **Actores Involucrados:** Proveedor de Servicios (PDS / Trabajador).
* **Precondiciones:**
  * PDS autenticado con perfil configurado.
  * Solicitudes en estado `'publicada'` existentes.
* **Historias de Usuario Asociadas:** [HU-13](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-13-búsqueda-y-filtrado-geoespacial-de-chambas), [HU-14](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-14-postulación-de-ofertas-a-chambas), [HU-43](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-43-filtrado-avanzado-por-distancia-y-geocerca).

#### Paso a Paso Detallado:
1. **Exploración en Frontend (`/explorar` - `ExploreRequestsPage.tsx`):**
   * El navegador solicita permisos de geolocalización o el usuario fija su posición en el mapa.
   * Aplica filtros: Categoría ("Plomería"), Rango de distancia máxima (`≤ 10 km`), Ordenamiento por cercanía o presupuesto.
2. **Petición HTTP:**
   * `GET /api/v1/solicitudes/cercanas?lat=4.6500&lon=-74.0800&radio_km=10&categoria_id=3`
   * **Headers:** `Authorization: Bearer <token>`
3. **Procesamiento Backend (`controllers/solicitudes.py`):**
   * Ejecuta consulta espacial en PostgreSQL:
     ```sql
     SELECT s.*, ST_Distance(s.geom::geography, ST_SetSRID(ST_MakePoint(-74.0800, 4.6500), 4326)::geography) / 1000.0 AS distancia_km
     FROM solicitudes s
     WHERE s.estado = 'publicada'
       AND ST_DWithin(s.geom::geography, ST_SetSRID(ST_MakePoint(-74.0800, 4.6500), 4326)::geography, 10000)
     ORDER BY distancia_km ASC;
     ```
   * Retorna lista de solicitudes con distancia calculada en kilómetros.
4. **Visualización de Detalle (`/solicitudes/:id` - `RequestDetailPage.tsx`):**
   * PDS abre la solicitud #42, interactúa con la panorámica 360° para inspeccionar la fuga y presiona **"Postular Oferta"**.
5. **Postulación de Oferta (`ApplyOfferModal.tsx`):**
   * Diligencia: Monto propuesto (`$110,000 COP`), tiempo estimado (`3 horas`), y mensaje de valor agregado ("Cuento con tubería PVC y sellante termo-fusión, disponible de inmediato").
   * Petición: `POST /api/v1/solicitudes/42/ofertas`
   * Backend inserta en tabla `ofertas`:
     * `solicitud_id = 42`, `trabajador_id = user_id`, `monto = 110000`, `tiempo_estimado = "3 horas"`, `estado = 'pendiente'`.
   * Emite evento Socket.IO `nueva_oferta` al cliente propietario de la solicitud.
   * **Respuesta HTTP:** `201 Created`
* **Resultado Esperado:** La oferta queda registrada en el listado de propuestas de la solicitud con estado "Pendiente".
* **Casos Alternos y de Error:**
  * `400 Bad Request`: El PDS ya tiene una oferta activa sobre esta solicitud.
  * `403 Forbidden`: El creador de la solicitud intenta postularse a su propia solicitud.
  * `409 Conflict`: La solicitud cambió de estado a `'en_negociacion'` o `'cancelada'`.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 05: NEGOCIACIÓN BILATERAL DE OFERTAS Y FIRMA DIGITAL DE CONTRATO                            |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 05 — Negociación Bilateral de Ofertas y Firma Digital de Contrato

* **Actores Involucrados:** Cliente (contratante) y PDS (contratista).
* **Precondiciones:**
  * Solicitud de chamba con al menos una oferta recibida.
* **Historias de Usuario Asociadas:** [HU-15](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-15-gestión-y-aceptación-de-ofertas-recibidas), [HU-16](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-16-formalización-de-contrato-digital), [HU-44](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-44-contraofertas-y-negociación-bilateral), [HU-45](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-45-firma-digital-en-pantalla-completa-con-evidencia-biométrica).

#### Paso a Paso Detallado:
1. **Revisión y Contraoferta (`/solicitudes/:id/ofertas` - `OffersManagementPage.tsx`):**
   * El cliente visualiza las ofertas recibidas con el perfil y Trust Score de cada postulante.
   * Decide contraofertar al PDS: Clic en **"Contraofertar"**, propone `$100,000 COP` con mensaje "Si incluye el reemplazo del codo de tubería cerramos trato".
   * `POST /api/v1/ofertas/85/contraoferta` `{ "nuevo_monto": 100000, "mensaje": "..." }`.
   * El PDS recibe notificación en tiempo real, revisa la contrapropuesta y hace clic en **"Aceptar Contraoferta"**.
2. **Generación del Contrato Digital:**
   * Cliente confirma aceptación definitiva: `POST /api/v1/ofertas/85/aceptar`.
   * Backend actualiza `ofertas.estado = 'aceptada'`, descarta las demás ofertas (`estado = 'rechazada'`), y genera un nuevo registro en `contratos` en `estado = 'borrador'`.
   * `contratos` almacena: `solicitud_id`, `cliente_id`, `trabajador_id`, `monto_pactado = 100000`, `clausulas_json`.
3. **Firma Digital en Pantalla Completa (`/contratos/:id/firmar` - `ContractSignPage.tsx`):**
   * Ambas partes (primero cliente, luego PDS o viceversa) abren la vista de formalización legal.
   * El componente bloquea la pantalla completa con fondo blanco inmersivo (*SignatureCanvas*).
   * El usuario traza su firma manuscrita con el dedo o puntero.
   * Hace clic en **"Confirmar y Firmar Contrato"**.
4. **Petición HTTP de Firma:**
   * `POST /api/v1/contratos/12/firmar`
   * **Body JSON:**
     ```json
     {
       "firma_base64": "data:image/png;base64,iVBORw0KGgo...",
       "latitud": 4.6530,
       "longitud": -74.0832,
       "navegador_info": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
     }
     ```
5. **Procesamiento Backend (`controllers/contratos.py`):**
   * Convierte la firma en imagen PNG y la guarda en MinIO (`contracts/signatures/...`).
   * Calcula hash criptográfico SHA-256 del trazado + texto del contrato.
   * Inserta registro en `firmas_contrato`: `contrato_id=12`, `usuario_id`, `ip_origen`, `latitud`, `longitud`, `hash_sha256`, `fecha_firma`.
   * Si ambas partes han firmado:
     * Actualiza `contratos.estado = 'activo'`.
     * Actualiza `solicitudes.estado = 'en_progreso'`.
     * Crea automáticamente la entidad operativa en `chambas` con `estado = 'iniciada'`.
   * **Respuesta HTTP:** `200 OK` `{ "contrato_activo": true, "chamba_id": 19 }`
* **Resultado Esperado:** Contrato legalmente perfeccionado, descargable en PDF con estampado cronológico y coordenadas GPS; activación inmediata de la chamba.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Firma vacía o canvas sin trazo suficiente.
  * `403 Forbidden`: Usuario ajeno al contrato intentando firmar.
  * `409 Conflict`: El contrato ya fue firmado previamente por este usuario.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 06: EJECUCIÓN Y CICLO OPERATIVO DE LA CHAMBA (6 HITOS)                                      |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 06 — Ejecución y Ciclo Operativo de la Chamba (6 Hitos)

* **Actores Involucrados:** PDS (ejecutor en campo) y Cliente (verificador en sitio).
* **Precondiciones:**
  * Contrato firmado bilateralmente.
  * Chamba creada en tabla `chambas` en estado `'iniciada'`.
* **Historias de Usuario Asociadas:** [HU-17](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-17-check-in-con-proximidad-gps-en-chamba), [HU-18](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-18-registro-de-evidencias-iniciales-y-finales), [HU-19](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-19-gestión-de-adendas-y-modificaciones-a-la-chamba), [HU-20](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-20-check-out-y-cierre-operativo-de-la-chamba), [HU-46](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-46-validación-estricta-de-proximidad-gps--100-metros), [HU-47](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-47-botón-de-novedades-y-alerta-de-pánico-en-ejecución), [HU-48](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-48-acreditación-de-habilidades-demostradas-en-chamba).

#### Paso a Paso Detallado:

```
[Inicio: Chamba #19]
       │
       ▼
[1. Validación GPS <= 100m] ──(>100m)──> [Error 400: Fuera de rango]
       │ (<=100m)
       ▼
[2. Check-in + Foto Inicial MinIO] ──> Estado: 'en_ejecucion'
       │
       ├─► [Adendas: Tiempo/Costo] ──► Aprobación de Cliente
       ├─► [Botón Alerta/Pánico]   ──► Ticket de Soporte Crítico
       │
       ▼
[3. Check-out + Foto Final MinIO] ──> Estado: 'completada'
       │
       ▼
[4. Validación de Habilidades Demostradas] ──► Impacto en Nivel PDS
```

1. **Hito 1: Validación Estricta de Proximidad GPS (`GpsCheckinModal.tsx`):**
   * El PDS se desplaza al domicilio del cliente. Al llegar, hace clic en **"Realizar Check-in"**.
   * El frontend captura coordenadas del navegador (`navigator.geolocation`).
   * `POST /api/v1/chambas/19/validar-gps` `{ "latitud": 4.6533, "longitud": -74.0835 }`.
   * Backend ejecuta validación espacial contra el punto acordado en la solicitud:
     ```sql
     SELECT ST_Distance(
       ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
       s.geom::geography
     ) AS distancia_metros
     FROM chambas c JOIN solicitudes s ON c.solicitud_id = s.id
     WHERE c.id = 19;
     ```
   * Si `distancia_metros <= 100`, retorna `200 OK` `{ "permitido": true, "distancia_metros": 24.5 }`.
2. **Hito 2: Check-in y Evidencia Inicial (`EvidenceUploadModal.tsx`):**
   * PDS toma foto del estado inicial del lugar con la cámara de su dispositivo.
   * `POST /api/v1/chambas/19/check-in` (multipart con foto inicial, latitud y longitud).
   * Backend sube imagen a MinIO, registra `chambas.hora_inicio = NOW()`, `estado = 'en_ejecucion'` e inserta en `evidencias_chamba` con `tipo = 'inicial'`.
3. **Hito 3: Gestión de Adendas / Imprevistos (Opcional - `AddendaModal.tsx`):**
   * Si durante el trabajo se descubre una falla oculta (ej. tubería oxidada adicional), el PDS solicita una adenda:
     * `POST /api/v1/chambas/19/adendas` `{ "costo_adicional": 30000, "tiempo_adicional_horas": 2, "motivo": "Reemplazo de niple fisurado no visible" }`.
   * El cliente visualiza la adenda en su pantalla y aprueba: `PUT /api/v1/chambas/19/adendas/5/aprobar`.
   * Se actualiza el monto total del contrato y la hora estimada de culminación.
4. **Hito 4: Botón de Novedad / Alerta de Pánico (En contingencia - `PanicButtonModal.tsx`):**
   * Si ocurre un incidente de seguridad o accidente laboral, cualquiera de las partes presiona el botón rojo **"Alerta / Pánico"**.
   * `POST /api/v1/chambas/19/novedad` `{ "tipo": "seguridad", "descripcion": "Fuga de gas imprevista", "lat": 4.6533, "lon": -74.0835 }`.
   * Backend dispara un ticket prioritario en `tickets_soporte` con nivel `critico`, notifica al equipo de soporte y envía un mensaje SMS de contingencia.
5. **Hito 5: Check-out y Evidencias Finales (`ChambaTrackingPage.tsx`):**
   * Finalizado el trabajo, el PDS captura la fotografía de la obra culminada y limpia.
   * `POST /api/v1/chambas/19/check-out` `{ "foto_final": @obra_terminada.jpg, "notas": "Tubería cambiada y probada bajo presión" }`.
   * Backend registra `chambas.hora_fin = NOW()`, `estado = 'completada'`, e inserta evidencia `'final'` en MinIO.
6. **Hito 6: Validación de Habilidades Demostradas (`SkillValidationModal.tsx`):**
   * El cliente confirma el cierre y selecciona las habilidades que constató en el PDS: `"Termofusión"`, `"Manejo de herramientas hidráulicas"`, `"Puntualidad"`.
   * `POST /api/v1/chambas/19/validar-habilidades` `{ "habilidades": [12, 18, 4] }`.
   * Backend registra votos de suficiencia en `habilidades_usuario_demostradas` para elevar la puntuación del oficio del trabajador.

* **Resultado Esperado:** Chamba marcada como `'completada'`, evidencias fotográficas antes/después asociadas en MinIO y lista para liquidación económica.
* **Casos Alternos y de Error:**
  * `400 Bad Request` en GPS: Distancia superior a 100 metros (`"Usted se encuentra a 340 metros del lugar acordado. Debe estar a menos de 100m para registrar check-in"`).
  * `409 Conflict`: Intentar hacer check-out sin haber completado el check-in previo.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 07: PAGO DUAL DIRECTO Y CALIFICACIÓN MUTUA                                                  |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 07 — Pago Dual Directo y Calificación Mutua

* **Actores Involucrados:** Cliente (pagador) y PDS (beneficiario).
* **Precondiciones:**
  * Chamba en estado `'completada'`.
  * Monto total acordado fijado (incluyendo adendas aprobadas).
* **Historias de Usuario Asociadas:** [HU-21](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-21-selección-de-método-de-pago-dual), [HU-22](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-22-liberación-de-fondos-en-custodia-escrow), [HU-23](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-23-confirmación-bilateral-de-pago-directo-en-efectivotransferencia), [HU-24](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-24-calificación-y-reseña-cruzada).

#### Paso a Paso Detallado:
1. **Selección de Modalidad de Pago (`PaymentMethodModal.tsx`):**
   * El cliente visualiza el resumen de cobro (ej. `$130,000 COP`).
   * La plataforma ofrece dos modalidades:
     * **Modalidad 1 (Billetera / Saldo en Custodia):** Para usuarios que fondearon anticipadamente su cuenta ChambeApp.
     * **Modalidad 2 (Pago Directo en Efectivo o Transferencia Externa):** Cero comisiones de plataforma para el trabajador; pago mano a mano o vía Daviplata/Nequi personal.
2. **Ejecución del Pago:**
   * **Opción A (Liberación de Billetera):**
     * Petición: `POST /api/v1/chambas/19/liberar-pago`.
     * Backend traslada `$130,000` de `billeteras.saldo_retenido` del cliente a `billeteras.saldo_disponible` del PDS, registrando dos transacciones contables en `transacciones_billetera`.
   * **Opción B (Pago Directo y Confirmación Bilateral - `DualPaymentConfirmation.tsx`):**
     * El cliente entrega el efectivo o transfiere por Nequi al celular del PDS.
     * El cliente presiona en la app: **"He entregado el pago directo ($130,000)"**.
     * Petición cliente: `POST /api/v1/chambas/19/confirmar-pago-directo` `{ "metodo": "efectivo", "monto": 130000 }`.
     * En la pantalla del PDS aparece la alerta: *"El cliente informa haber entregado $130,000 en efectivo. ¿Confirmas la recepción?"*.
     * PDS presiona: **"Confirmar Recepción"**.
     * Petición PDS: `POST /api/v1/chambas/19/confirmar-pago-directo` `{ "confirmado": true }`.
     * Backend actualiza `chambas.estado_pago = 'pagado'` y `contratos.estado = 'liquidado'`.
3. **Calificación y Reseña Cruzada (`RatingModal.tsx`):**
   * Tras la liquidación, se abre automáticamente la ventana de evaluación mutua.
   * **Cliente califica al PDS:** Selecciona de 1 a 5 estrellas y desglosa: Puntualidad (1-5), Calidad técnica (1-5), Trato respetuoso (1-5), y escribe comentario ("Excelente trabajo, rápido y muy limpio").
   * Petición: `POST /api/v1/chambas/19/resenas` `{ "evaluado_id": pds_id, "estrellas": 5, "comentario": "...", "puntualidad": 5, "calidad": 5 }`.
   * **PDS califica al Cliente:** Evalúa claridad en el requerimiento y puntualidad en el pago.
   * Backend inserta registros en `resenas`, recalcula el promedio en `usuarios.promedio_calificacion` y dispara la tarea Celery para actualización del **Trust Score**.

* **Resultado Esperado:** Chamba liquidada con estado `pagado`, contrato cerrado, saldo reflejado y reputación de ambos usuarios actualizada.
* **Casos Alternos y de Error:**
  * `402 Payment Required`: Saldo insuficiente en billetera al optar por custodia.
  * `400 Bad Request`: Discrepancia en el monto informado en el pago directo.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 08: DERIVACIÓN Y CIERRE ÁGIL DE MARAÑAS (REBUSQUES)                                         |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 08 — Derivación y Cierre Ágil de Marañas (Rebusques)

* **Actores Involucrados:** Demandante ocasional y PDS / Rebuscador barrial.
* **Precondiciones:**
  * Usuarios con sesión activa.
* **Historias de Usuario Asociadas:** [HU-53](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-53-publicación-ágil-de-marañas-o-rebusques), [HU-54](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-54-postulación-rápida-y-cierre-directo-de-marañas).

#### Paso a Paso Detallado:
1. **Publicación Rápida (`/maranas/crear` - `CreateMaranaModal.tsx`):**
   * Diseñado para tareas inmediatas y de bajo costo (ej. "Ayuda para subir una lavadora al 3er piso hoy a las 4 PM").
   * Campos simplificados: Título breve, descripción corta, pago ofrecido (`$25,000 COP`), ubicación aproximada y teléfono de contacto rápido.
   * `POST /api/v1/maranas` `{ "titulo": "Subir lavadora al 3er piso", "descripcion": "...", "pago": 25000, "lat": 4.65, "lon": -74.08 }`.
   * Backend inserta en `maranas` con `estado = 'activa'`.
2. **Exploración y Postulación (`/maranas` - `MaranasFeedPage.tsx`):**
   * El usuario interesado abre el feed de marañas, filtrado por cercanía barrial.
   * Presiona **"Me interesa este rebusque"**.
   * `POST /api/v1/maranas/7/postular`.
   * El creador recibe el contacto directo por WhatsApp o llamada telefónica.
3. **Cierre Directo de Maraña (`MaranaDetailPage.tsx`):**
   * Realizada la tarea, el creador presiona **"Marcar como realizada"**.
   * `POST /api/v1/maranas/7/cerrar` `{ "resultado": "exitosa" }`.
   * Backend actualiza `maranas.estado = 'cerrada'`. No genera contrato formal extenso ni retenciones de custodia.
* **Resultado Esperado:** Conexión ágil sin burocracia para trabajos informales rápidos, descongestionando el módulo formal de chambas.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Falta de número de contacto o descripción vacía.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 09: DIRECTORIO Y GESTIÓN DE NEGOCIOS LOCALES                                                |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 09 — Directorio y Gestión de Negocios Locales

* **Actores Involucrados:** Propietario de Negocio (Merchant) y Comunidad de Usuarios/Clientes.
* **Precondiciones:**
  * Usuario con cuenta activa en rol comerciante o cliente.
* **Historias de Usuario Asociadas:** [HU-55](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-55-registro-y-perfil-de-negocio-local), [HU-56](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-56-directorio-público-de-negocios-en-mapa-interactivo), [HU-57](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-57-horarios-de-atención-y-contacto-directo), [HU-58](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-58-galería-fotográfica-de-negocios-en-minio), [HU-59](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-59-reseñas-y-calificaciones-de-negocios), [HU-60](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-60-sistema-de-reporte-comunitario-de-negocios).

#### Paso a Paso Detallado:
1. **Registro del Perfil Comercial (`/negocios/registrar` - `BusinessRegisterPage.tsx`):**
   * El comerciante ingresa: Nombre comercial ("Ferretería El Tornillo Dorado"), NIT o cédula, categoría comercial ("Ferretería y Materiales"), dirección física, pin geolocalizado en mapa Leaflet, teléfono fijo y enlace directo a WhatsApp.
   * Configura matriz de horarios semanales: Lunes a Sábado de 07:30 a 18:00, Domingo cerrado.
   * Carga logotipo comercial y hasta 5 fotos de vitrina/inventario a MinIO.
2. **Petición HTTP:**
   * `POST /api/v1/negocios` (multipart con metadata y fotografías).
   * Backend inserta en `negocios` (con `geom` PostGIS), `horarios_negocio` y `fotos_negocio`.
3. **Exploración en Directorio Público (`/negocios` - `BusinessDirectoryPage.tsx`):**
   * Los vecinos acceden al directorio en mapa interactivo. Los marcadores se agrupan en *clusters* según el nivel de zoom.
   * Al hacer clic en un pin, visualizan tarjeta emergente con estado en tiempo real: *"Abierto ahora"* (calculado contra la hora actual del servidor y los horarios configurados).
4. **Reseña y Reporte Comunitario (`BusinessProfilePage.tsx`):**
   * **Reseña:** Un cliente publica una reseña con calificación: `POST /api/v1/negocios/14/resenas` `{ "estrellas": 5, "comentario": "Excelente surtido y precios justos" }`.
   * **Reporte de Fraude o Anomalía (`ReportBusinessModal.tsx`):** Si un negocio es fachada o cambió de actividad ilícita, un usuario envía reporte: `POST /api/v1/negocios/14/reportar` `{ "motivo": "negocio_inexistente", "descripcion": "Fui a la dirección y es un lote abandonado" }`.
   * Backend inserta en `reportes_negocio` y notifica a moderación de administradores.
* **Resultado Esperado:** Negocio visible en el mapa local con enlace a WhatsApp para cotizaciones directas; control comunitario ante irregularidades.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Coordenadas geográficas fuera del municipio seleccionado.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 10: ANUNCIOS LABORALES DE NEGOCIOS                                                          |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 10 — Anuncios Laborales de Negocios

* **Actores Involucrados:** Propietario de Negocio (Empleador) y PDS / Trabajador (Postulante).
* **Precondiciones:**
  * Negocio registrado y verificado.
  * Trabajador con perfil activo.
* **Historias de Usuario Asociadas:** [HU-61](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-61-publicación-de-anuncios-laborales-por-negocios), [HU-62](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-62-postulación-a-vacantes-laborales-de-negocios).

#### Paso a Paso Detallado:
1. **Publicación de Vacante (`/negocios/:id/anuncios/crear` - `CreateJobAdPage.tsx`):**
   * El negocio requiere personal permanente o por temporada (ej. "Auxiliar de bodega y despachos").
   * Configura: Cargo, descripción de responsabilidades, rango salarial (`$1,400,000 - $1,600,000 COP`), tipo de contratación (término fijo, obra/labor), requisitos mínimos y número de vacantes (2).
   * `POST /api/v1/negocios/14/anuncios` `{ "cargo": "Auxiliar de bodega", ... }`.
   * Backend inserta en `anuncios_laborales` con `estado = 'abierta'`.
2. **Exploración de Vacantes (`/empleos` - `JobAdsFeedPage.tsx`):**
   * Los trabajadores consultan el catálogo de vacantes fijas, filtrando por sector y salario.
3. **Postulación No Vinculante (`ApplyJobModal.tsx`):**
   * El trabajador revisa la vacante #9 y hace clic en **"Enviar Hoja de Vida / Postularme"**.
   * Adjunta mensaje de presentación y autoriza al negocio a visualizar su perfil integral, certificaciones de oficio y Trust Score.
   * `POST /api/v1/anuncios-laborales/9/postular` `{ "mensaje": "Tengo 3 años de experiencia en bodegas ferreteras..." }`.
   * Backend inserta en `postulaciones_empleo` con `estado = 'enviada'`.
4. **Gestión del Empleador (`BusinessJobCandidatesPage.tsx`):**
   * El dueño del negocio revisa los candidatos recibidos, califica su idoneidad y actualiza su estado: `'preseleccionado'`, `'entrevista'`, `'contratado'` o `'descartado'`.
* **Resultado Esperado:** Canal formal de intermediación laboral para comercios locales sin ataduras a contratos por hora.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: El trabajador ya se encuentra postulado a esta vacante.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 11: BILLETERA DIGITAL, RECARGAS SIMULADAS Y PAQUETES DE MONEDAS                             |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 11 — Billetera Digital, Recargas Simuladas y Paquetes de Monedas

* **Actores Involucrados:** Usuario (Cliente o PDS).
* **Precondiciones:**
  * Usuario autenticado con billetera asociada en base de datos.
* **Historias de Usuario Asociadas:** [HU-25](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-25-consulta-de-saldo-y-movimientos-de-billetera), [HU-26](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-26-recarga-de-saldo-en-billetera), [HU-27](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-27-solicitud-de-retiro-de-fondos), [HU-28](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-28-bloqueo-y-retención-preventiva-de-fondos), [HU-66](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-66-compra-de-paquetes-de-monedas), [HU-67](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-67-saldo-de-monedas-y-bonificaciones-promocionales), [HU-68](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-68-historial-contable-y-extractos-de-billetera).

#### Paso a Paso Detallado:
1. **Consulta de Billetera (`/billetera` - `WalletPage.tsx`):**
   * Frontend consulta: `GET /api/v1/billetera`.
   * Backend retorna: Saldo disponible en pesos (`saldo_disponible`), saldo en custodia (`saldo_retenido`), saldo de monedas de plataforma (`saldo_monedas`), y últimos 20 movimientos.
2. **Recarga Simulada de Saldo (`RechargeModal.tsx`):**
   * El usuario desea fondear `$200,000 COP`. Selecciona método simulado: PSE / Nequi / Tarjeta.
   * Hace clic en **"Confirmar Recarga de Prueba"**.
   * Petición: `POST /api/v1/billetera/recargar` `{ "monto": 200000, "metodo": "pse_simulado" }`.
   * Backend actualiza: `UPDATE billeteras SET saldo_disponible = saldo_disponible + 200000 WHERE id = :id`.
   * Registra en `transacciones_billetera`: `tipo = 'recarga'`, `monto = 200000`, `estado = 'completada'`.
3. **Compra de Paquetes de Monedas (`/monedas/comprar` - `CoinPackagesStorePage.tsx`):**
   * Las monedas se emplean para destacar publicaciones o postular ofertas prémium.
   * El usuario selecciona el "Paquete Pro: 100 Monedas + 20 de Bono" por `$30,000 COP`.
   * Petición: `POST /api/v1/billetera/paquetes-monedas/3/comprar`.
   * Backend debita `$30,000` de `saldo_disponible`, acredita `120 monedas` a `saldo_monedas` y genera el comprobante contable.
4. **Solicitud de Retiro de Fondos (`WithdrawalModal.tsx`):**
   * Un PDS con saldo acumulado solicita transferir `$150,000 COP` a su cuenta bancaria.
   * Ingresa: Entidad bancaria (ej. Bancolombia), tipo de cuenta (Ahorros), número de cuenta y documento del titular.
   * Petición: `POST /api/v1/billetera/retirar` `{ "monto": 150000, "banco": "Bancolombia", "cuenta": "123-456789-00" }`.
   * Backend valida que `saldo_disponible >= 150000`.
   * Debita de `saldo_disponible`, incrementa temporalmente `saldo_retenido` e inserta solicitud en `solicitudes_retiro` en `estado = 'pendiente_dispersion'`.
* **Resultado Esperado:** Saldos actualizados en tiempo real y registro contable inmutable con hash de auditoría.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Monto de retiro menor al umbral mínimo establecido ($20,000 COP) o cuenta bancaria con formato inválido.
  * `402 Payment Required`: Saldo insuficiente para realizar el retiro o compra de monedas.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 12: MENSAJERÍA Y CHAT 1:1 EN TIEMPO REAL (WEBSOCKETS)                                       |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 12 — Mensajería y Chat 1:1 en Tiempo Real (WebSockets)

* **Actores Involucrados:** Cliente y PDS vinculados por una solicitud u oferta.
* **Precondiciones:**
  * Ambos usuarios autenticados.
  * Conexión WebSocket mediante Socket.IO establecida contra el backend.
* **Historias de Usuario Asociadas:** [HU-31](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-31-mensajería-instantánea-entre-partes), [HU-32](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-32-notificaciones-de-mensajes-nuevos).

#### Paso a Paso Detallado:
1. **Apertura de la Conversación (`/mensajes/:id` - `MessagesPage.tsx`):**
   * El usuario hace clic en el botón de chat desde la solicitud o perfil de la oferta.
   * Frontend invoca `POST /api/v1/conversaciones/iniciar` `{ "receptor_id": 25, "solicitud_id": 42 }`.
   * Backend obtiene o crea la conversación en tabla `conversaciones` y retorna `conversacion_id = 9`.
2. **Conexión y Suscripción a la Sala (Socket.IO):**
   * El cliente de React emite el evento de conexión WebSocket con su JWT en el handshake:
     `socket.emit("join_room", { room: "conversacion_9" })`.
   * El servidor Flask-SocketIO valida el token, verifica que el usuario sea emisor o receptor en dicha conversación y lo une a la sala Redis.
3. **Envío y Difusión de Mensajes (`ChatWindow.tsx`):**
   * El usuario escribe: "Hola, ¿a qué hora podrías pasar a revisar la tubería?" y presiona Enter.
   * Frontend emite:
     `socket.emit("send_message", { conversacion_id: 9, contenido: "Hola, ¿a qué hora podrías pasar...?" })`.
   * El servidor persiste el mensaje en `mensajes`: `conversacion_id=9`, `emisor_id=15`, `contenido`, `leido=False`, `created_at=NOW()`.
   * El servidor emite a la sala `conversacion_9`:
     `socket.to("conversacion_9").emit("new_message", { id: 184, emisor_id: 15, contenido: "...", fecha: "2026-10-20T11:00:00Z" })`.
   * Si el receptor no tiene la ventana abierta, Celery dispara una notificación push/badge en el header.
4. **Marcado de Lectura:**
   * Al abrir la ventana, el receptor emite `read_messages` `{ conversacion_id: 9 }`.
   * Backend ejecuta `UPDATE mensajes SET leido = True WHERE conversacion_id = 9 AND emisor_id != :current_user`.
* **Resultado Esperado:** Mensajes bidireccionales con latencia inferior a 200ms, persistidos en base de datos e historial recuperable tras recargar la página.
* **Casos Alternos y de Error:**
  * `403 Forbidden`: Intento de unirse a una conversación donde el usuario no es parte interviniente.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 13: CANAL DE DISPUTAS Y ARBITRAJE CONTRACTUAL                                               |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 13 — Canal de Disputas y Arbitraje Contractual

* **Actores Involucrados:** Parte Afectada (Cliente o PDS), Contraparte, y Administrador Árbitro.
* **Precondiciones:**
  * Contrato formal existente en estado `'activo'` o `'en_ejecucion'`.
* **Historias de Usuario Asociadas:** [HU-29](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-29-apertura-de-disputa-o-reclamación), [HU-30](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-30-resolución-y-arbitraje-de-disputas).

#### Paso a Paso Detallado:
1. **Apertura de Disputa (`/contratos/:id/disputa` - `OpenDisputeModal.tsx`):**
   * El cliente reporta que el trabajador abandonó la obra sin culminar la instalación.
   * Selecciona motivo: `"Incumplimiento de términos"` / `"Calidad deficiente"` / `"Abandono"`.
   * Describe los hechos, cuantifica el monto reclamado (`$80,000 COP`) y adjunta 3 fotografías de prueba a MinIO.
2. **Petición HTTP:**
   * `POST /api/v1/disputas`
   * **Body JSON:** `{ "contrato_id": 12, "motivo": "abandono_obra", "descripcion": "...", "monto_reclamado": 80000, "pruebas": ["url1", "url2"] }`.
3. **Procesamiento Backend (`controllers/disputas.py`):**
   * Cambia el estado del contrato: `UPDATE contratos SET estado = 'en_disputa' WHERE id = 12`.
   * Congela de inmediato la liberación de los fondos de la chamba en la billetera (`billeteras.saldo_retenido` queda bloqueado para retiros).
   * Inserta registro en `disputas`: `contrato_id=12`, `demandante_id`, `demandado_id`, `estado = 'abierta'`.
   * Notifica a la contraparte para que presente sus descargos en un plazo improrrogable de 48 horas.
4. **Presentación de Descargos (`DisputeDetailPage.tsx`):**
   * El PDS accede a la disputa y carga su alegato: `POST /api/v1/disputas/4/alegatos` `{ "argumento": "El cliente no suministró los materiales pactados...", "pruebas": ["url3"] }`.
5. **Arbitraje y Resolución por Administrador:**
   * Un administrador revisa el expediente, historial de chat, coordenadas GPS y fotos antes/después.
   * Emite fallo formal: `PUT /api/v1/admin/disputas/4/resolver`
     ```json
     {
       "resolucion": "parcial",
       "porcentaje_cliente": 60,
       "porcentaje_trabajador": 40,
       "dictamen": "Se constató avance parcial del 40% del contrato"
     }
     ```
   * El backend liquida los fondos en custodia proporcionalmente en las dos billeteras y cierra la disputa (`estado = 'resuelta'`).
* **Resultado Esperado:** Resolución imparcial sustentada en evidencia digital y trazabilidad criptográfica.
* **Casos Alternos y de Error:**
  * `400 Bad Request`: Intentar abrir disputa sobre un contrato que ya fue liquidado y calificado hace más de 7 días.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 14: PORTAFOLIO DE EVIDENCIAS Y REPUTACIÓN PDS (TRUST SCORE)                                 |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 14 — Portafolio de Evidencias y Reputación PDS (Trust Score)

* **Actores Involucrados:** PDS (gestor de su perfil) y Clientes/Visitantes (evaluadores).
* **Precondiciones:**
  * Cuenta de PDS creada y activa.
* **Historias de Usuario Asociadas:** [HU-08](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-08-gestión-de-portafolio-de-trabajos-anteriores), [HU-09](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-09-cálculo-y-visualización-del-trust-score), [HU-10](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-10-visualización-de-insignias-y-certificaciones), [HU-63](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-63-soporte-de-proyectos-360-en-portafolio), [HU-64](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-64-endoso-social-de-habilidades-entre-usuarios), [HU-65](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-65-desglose-analítico-del-trust-score).

#### Paso a Paso Detallado:
1. **Carga de Proyecto al Portafolio (`/perfil/portafolio` - `PortfolioManagerPage.tsx`):**
   * El PDS publica un proyecto realizado anteriormente: Título ("Remodelación de baño principal"), descripción, oficio ("Enchapes y Plomería"), fecha de ejecución.
   * Adjunta fotos estándar y una foto esférica en formato equirrectangular marcando el checkbox *"Soporte Panorámico 360°"*.
   * `POST /api/v1/usuarios/portafolio` (multipart).
   * Backend sube archivos a MinIO y registra en `portafolio_items` con flag `es_360 = true`.
2. **Visualización Pública del Perfil PDS (`/trabajadores/:id` - `PublicProfileView.tsx`):**
   * Un cliente potencial inspecciona el perfil del trabajador.
   * El componente permite explorar interactivamente las obras en 360° mediante *Photo Sphere Viewer*.
3. **Cálculo y Desglose Analítico del Trust Score (`TrustScoreCard.tsx`):**
   * Frontend invoca: `GET /api/v1/usuarios/15/trust-score`.
   * El algoritmo del backend analiza los 6 pilares de confiabilidad y retorna el puntaje consolidado (0 a 100 puntos):
     ```json
     {
       "trust_score_total": 88.5,
       "nivel_confianza": "Sobresaliente",
       "desglose": {
         "identidad_kyc": { "puntaje": 20.0, "max": 20.0, "estado": "aprobado" },
         "reputacion_resenas": { "puntaje": 28.5, "max": 30.0, "promedio": 4.8 },
         "cumplimiento_chambas": { "puntaje": 18.0, "max": 20.0, "completadas": 14, "canceladas": 0 },
         "certificaciones_quizzes": { "puntaje": 12.0, "max": 15.0, "quizzes_aprobados": 2 },
         "endosos_sociales": { "puntaje": 5.0, "max": 5.0, "total_endosos": 8 },
         "penalizaciones_disputas": { "puntaje": 5.0, "max": 10.0, "disputas_activas": 0 }
       },
       "insignias": [
         { "codigo": "KYC_VERIFIED", "nombre": "Identidad Verificada" },
         { "codigo": "PRO_PLUMBER", "nombre": "Fontanero Nivel 2" },
         { "codigo": "TOP_RATED", "nombre": "5 Estrellas Consecutivas" }
       ]
     }
     ```
4. **Endoso Social de Habilidades:**
   * Un cliente previo o colega acreditado visita el perfil y hace clic en **"Endosar habilidad: Fontanería rápida"**.
   * `POST /api/v1/usuarios/15/endoso` `{ "habilidad_id": 7 }`.
   * Backend previene endosos duplicados e incrementa la reputación social en `endosos_sociales`.
* **Resultado Esperado:** Perfil profesional transparente, auditable y con métricas analíticas que reducen la asimetría de información en la contratación informal.

---

## Bloque B: Flujos de Gobernanza y Servicios API (3 Flujos Administrativos)

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 15: EVALUACIÓN DE COMPETENCIAS Y QUIZZES DE OFICIO                                          |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 15 — Evaluación de Competencias y Quizzes de Oficio

* **Actores Involucrados:** PDS (evaluado) y Motor Evaluador de Backend.
* **Precondiciones:**
  * Oficios dados de alta con bancos de preguntas técnicas configurados.
* **Historias de Usuario Asociadas:** [HU-35](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-35-banco-de-preguntas-y-quizzes-de-oficio), [HU-36](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-36-certificación-técnica-y-subida-de-nivel-de-oficio).

#### Paso a Paso Detallado:
1. **Solicitud de Evaluación (`GET /api/v1/habilidades/:oficio_id/quiz`):**
   * PDS solicita iniciar test de suficiencia para el oficio de "Electricista Residencial" (`oficio_id = 4`).
   * Backend selecciona aleatoriamente 5 preguntas técnicas del banco `preguntas_quiz` asociadas a dicho oficio.
   * Retorna preguntas con enunciados y opciones de respuesta (sin incluir las claves correctas).
   * Genera un registro de intento en `intentos_quiz` con timestamp de inicio y límite de tiempo (15 minutos).
2. **Envío de Respuestas:**
   * PDS responde las preguntas y envía:
     * `POST /api/v1/habilidades/4/quiz/responder`
     * **Body JSON:**
       ```json
       {
         "intento_id": 31,
         "respuestas": [
           { "pregunta_id": 101, "opcion_id": 3 },
           { "pregunta_id": 104, "opcion_id": 1 },
           { "pregunta_id": 109, "opcion_id": 2 },
           { "pregunta_id": 115, "opcion_id": 4 },
           { "pregunta_id": 120, "opcion_id": 2 }
         ]
       }
       ```
3. **Calificación Automatizada y Acreditación:**
   * Backend contrasta contra las respuestas correctas.
   * Calcula porcentaje de aciertos: Si `aciertos >= 80%` (4 de 5):
     * Actualiza `intentos_quiz.aprobado = True`.
     * Inserta certificación en `certificaciones_oficio`: `usuario_id`, `oficio_id=4`, `nivel = 1`, `fecha_expedicion = NOW()`.
     * Asigna la insignia `"ELECTRICISTA_CERTIFICADO"` al usuario.
     * Incrementa el pilar de certificaciones en el cálculo de su **Trust Score**.
   * **Respuesta HTTP:** `200 OK`
     ```json
     {
       "aprobado": true,
       "puntaje": 100.0,
       "nivel_obtenido": 1,
       "insignia": "ELECTRICISTA_CERTIFICADO",
       "mensaje": "¡Felicitaciones! Has certificado tus competencias en Electricista Residencial"
     }
     ```
* **Resultado Esperado:** Desbloqueo de nivel superior de oficio y distintivo visible en ofertas.
* **Casos Alternos y de Error:**
  * `422 Unprocessable Entity`: Menos del 80% de aciertos. Se bloquea el reintento para ese oficio durante 7 días.
  * `408 Request Timeout`: Respuestas enviadas después de los 15 minutos asignados.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 16: MODERACIÓN Y OPERACIÓN REGIONAL (ADMIN)                                                 |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 16 — Moderación y Operación Regional (Admin)

* **Actores Involucrados:** Administrador / Moderador Regional y Usuarios finales.
* **Precondiciones:**
  * Usuario autenticado con rol `admin` o `moderador` regional.
* **Historias de Usuario Asociadas:** [HU-37](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-37-panel-de-administración-regional), [HU-38](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-38-gestión-y-resolución-de-tickets-de-soporte), [HU-69](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-69-auditoría-y-aprobación-manual-de-solicitudes-kyc), [HU-70](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-70-moderación-de-reportes-de-negocios), [HU-71](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-71-atención-prioritaria-de-alertas-de-pánico), [HU-72](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-72-métricas-operativas-y-reportes-por-municipio).

#### Paso a Paso Detallado:
1. **Auditoría de KYC (`GET /api/v1/admin/kyc/pendientes`):**
   * El administrador consulta la cola de solicitudes de verificación de documentos.
   * Visualiza las imágenes anverso/reverso de la cédula obtenidas de MinIO, contrasta el número de documento con el nombre del usuario y verifica nitidez.
   * Emite veredicto:
     * `PUT /api/v1/admin/kyc/8` `{ "estado": "aprobado", "observaciones": "Cédula legítima y legible" }`.
     * Backend actualiza `solicitudes_kyc.estado = 'aprobado'` y `usuarios.kyc_status = 'aprobado'`, otorgando la insignia de verificación.
2. **Atención de Alertas de Pánico e Incidencias (`GET /api/v1/admin/tickets/prioritarios`):**
   * El panel destaca tickets originados por el botón de novedad en chambas activas.
   * El operador toma el ticket, revisa las coordenadas GPS de los involucrados y activa protocolo de llamada de asistencia.
   * Marca el ticket como resuelto: `PUT /api/v1/admin/tickets/22/cerrar` `{ "resolucion": "Asistencia telefónica brindada, partes acordaron reprogramación" }`.
3. **Métricas Territoriales (`GET /api/v1/admin/metricas-regionales`):**
   * Consulta agregaciones analíticas de PostGIS filtradas por departamento y municipio: Volumen de chambas publicadas, tasa de éxito en contratación, tiempo medio de cierre y oficios con mayor demanda insatisfecha.
* **Resultado Esperado:** Garantía de seguridad operativa, saneamiento de identidades y trazabilidad institucional.
* **Casos Alternos y de Error:**
  * `403 Forbidden`: Intento de acceso de un usuario estándar a endpoints bajo `/api/v1/admin/*`.

---

```
+---------------------------------------------------------------------------------------------------+
| FLUJO 17: GOBERNANZA GLOBAL Y CONFIGURACIÓN DE PLATAFORMA (SUPERADMIN)                            |
+---------------------------------------------------------------------------------------------------+
```

### Flujo 17 — Gobernanza Global y Configuración de Plataforma (Superadmin)

* **Actores Involucrados:** Superadministrador de Sistema / Equipo Directivo.
* **Precondiciones:**
  * Usuario autenticado con rol `superadmin`.
* **Historias de Usuario Asociadas:** [HU-39](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-39-panel-de-superadministrador-y-gobernanza-global), [HU-40](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-40-gestión-de-parámetros-globales-y-comisiones), [HU-73](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-73-gestión-de-paquetes-de-monedas-y-promociones), [HU-74](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-74-control-de-feature-flags-y-modelos-de-machine-learning), [HU-75](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-75-gestión-de-regiones-departamentos-y-municipios).

#### Paso a Paso Detallado:
1. **Configuración de Parámetros Globales:**
   * `GET /api/v1/superadmin/configuracion`
   * Consulta valores activos de la plataforma: Porcentaje de comisión para retiros a cuenta bancaria (ej. `2.5%`), vigencia de los códigos OTP (ej. `300s`), radio máximo de búsqueda en feed (ej. `50 km`), umbral mínimo de retiro (`$20,000 COP`).
   * `PUT /api/v1/superadmin/configuracion` `{ "comision_retiro_porcentaje": 2.0, "monto_minimo_retiro": 25000 }`.
   * Backend actualiza tabla `configuracion_global` e invalida la caché en Redis.
2. **Control de Feature Flags y Machine Learning:**
   * Superadmin activa o desactiva módulos experimentales de recomendación:
     * `POST /api/v1/superadmin/feature-flags` `{ "flag": "ML_PREDICTIVE_MATCHING", "enabled": true }`.
     * `POST /api/v1/superadmin/feature-flags` `{ "flag": "DYNAMIC_TRUST_SCORE_V2", "enabled": true }`.
   * Backend registra el cambio en `feature_flags` y refresca el comportamiento de los controladores de solicitudes.
3. **Expansión Territorial (Regiones y Municipios):**
   * Apertura de nuevas zonas operativas:
     * `POST /api/v1/superadmin/regiones` `{ "nombre": "Eje Cafetero", "departamento_id": 17, "municipios_habilitados": [17001, 17042] }`.
   * Permite que los usuarios de dichos municipios puedan registrarse y geolocalizar publicaciones.
* **Resultado Esperado:** Gobernanza centralizada y flexible del ecosistema ChambeApp sin necesidad de redespliegue de código.
* **Casos Alternos y de Error:**
  * `403 Forbidden`: Token no posee privilegios de superadministrador.
  * `400 Bad Request`: Parámetro fuera de rangos permitidos (ej. comisión negativa o superior al 50%).

---

## Matriz de Cobertura y Trazabilidad de Flujos vs. Código

| ID Flujo | Denominación del Flujo | Componentes React (Frontend) | Controladores Flask (Backend) | Entidades de Base de Datos | Historias de Usuario (HU) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **01** | Autenticación, Registro y 2FA | `RegisterPage`, `LoginPage`, `TwoFactorVerifyModal`, `ForgotPasswordPage` | `controllers/auth.py` | `usuarios`, `billeteras`, `password_reset_tokens` | HU-01 a 03, HU-49, 50 |
| **02** | Perfil de Usuario y KYC | `ProfilePage`, `KycVerificationPage`, `PhoneVerificationModal` | `controllers/usuarios.py`, `kyc.py` | `usuarios`, `solicitudes_kyc` | HU-06, 07, HU-51, 52 |
| **03** | Publicación de Chambas (360°) | `CreateRequestPage`, `PhotoSphereViewer360`, `LeafletMapPicker` | `controllers/solicitudes.py` | `solicitudes`, `fotos_solicitud` | HU-11, 12, HU-41, 42 |
| **04** | Exploración y Postulación PDS | `ExploreRequestsPage`, `RequestDetailPage`, `ApplyOfferModal` | `controllers/solicitudes.py`, `ofertas.py` | `solicitudes`, `ofertas`, `notificaciones` | HU-13, 14, HU-43 |
| **05** | Negociación y Firma Digital | `OffersManagementPage`, `ContractSignPage` (*canvas*) | `controllers/ofertas.py`, `contratos.py` | `ofertas`, `contratos`, `firmas_contrato`, `chambas` | HU-15, 16, HU-44, 45 |
| **06** | Ciclo Operativo (6 Hitos) | `ChambaTrackingPage`, `GpsCheckinModal`, `EvidenceModal`, `AddendaModal` | `controllers/chambas.py` | `chambas`, `evidencias_chamba`, `adendas`, `tickets` | HU-17 a 20, HU-46 a 48 |
| **07** | Pago Dual y Calificación | `PaymentMethodModal`, `DualPaymentConfirmation`, `RatingModal` | `controllers/pagos.py`, `resenas.py` | `billeteras`, `transacciones`, `resenas`, `chambas` | HU-21 a 24 |
| **08** | Derivación de Marañas | `MaranasFeedPage`, `CreateMaranaModal`, `MaranaDetailPage` | `controllers/maranas.py` | `maranas`, `postulaciones_marana` | HU-53, 54 |
| **09** | Directorio de Negocios | `BusinessDirectoryPage`, `BusinessProfilePage`, `ReportModal` | `controllers/negocios.py` | `negocios`, `horarios_negocio`, `resenas_negocio` | HU-55 a 60 |
| **10** | Anuncios Laborales | `JobAdsFeedPage`, `CreateJobAdPage`, `ApplyJobModal` | `controllers/anuncios.py` | `anuncios_laborales`, `postulaciones_empleo` | HU-61, 62 |
| **11** | Billetera y Monedas | `WalletPage`, `RechargeModal`, `WithdrawalModal`, `CoinStorePage` | `controllers/billetera.py` | `billeteras`, `transacciones`, `solicitudes_retiro` | HU-25 a 28, HU-66 a 68 |
| **12** | Chat 1:1 en Tiempo Real | `MessagesPage`, `ChatWindow`, `MessageInput` | `controllers/chat.py`, `socketio_events.py` | `conversaciones`, `mensajes` | HU-31, 32 |
| **13** | Canal de Disputas | `OpenDisputeModal`, `DisputeDetailPage`, `EvidenceTimeline` | `controllers/disputas.py` | `disputas`, `alegatos_disputa`, `contratos` | HU-29, 30 |
| **14** | Portafolio y Trust Score | `PortfolioManagerPage`, `TrustScoreCard`, `PublicProfileView` | `controllers/usuarios.py`, `reputacion.py` | `portafolio_items`, `metricas_reputacion`, `endosos` | HU-08 a 10, HU-63 a 65 |
| **15** | Quizzes de Oficio (API) | *Servicio Backend / Modal de Evaluación* | `controllers/habilidades.py` | `preguntas_quiz`, `intentos_quiz`, `certificaciones` | HU-35, 36 |
| **16** | Panel Admin Regional (API) | *Panel Administrativo / Vistas de Soporte* | `controllers/admin.py`, `kyc.py` | `solicitudes_kyc`, `tickets_soporte`, `regiones` | HU-37, 38, HU-69 a 72 |
| **17** | Superadmin y Gobernanza (API)| *Panel Superadmin / Consola del Sistema* | `controllers/superadmin.py` | `configuracion_global`, `feature_flags`, `logs` | HU-39, 40, HU-73 a 75 |

---

## Conclusión y Preparación para Fase 4

Este documento consolida la arquitectura funcional y operativa de ChambeApp. Los **14 flujos con interfaz de usuario (Bloque A)** constituyen la batería de pruebas automatizadas que serán ejecutadas y grabadas con la herramienta **Obscura v0.2.5** en la **Fase 4**, generando las evidencias paso a paso en video y capturas en el directorio `documentation/Arquitectura/evidencias/`.
