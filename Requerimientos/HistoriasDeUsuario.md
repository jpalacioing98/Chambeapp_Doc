# Historias de Usuario y Casos de Uso — ChambeApp (v3.0 - Post-Auditoría)

> **Fuente de verdad:** El código de la aplicación (`backend/` rama `Dev`, `frontend/` rama `Dev`).
> **Alcance de la versión:** Catálogo completo auditado (HU-01 a HU-75) derivado de `Requerimientos.md`, `RF_Modulo_*.md` y `RF_Division_Regional.md`.
> **Formato normativo:** Historia de Usuario + Criterios de Aceptación (EARS: WHEN/THEN/IF) + Casos de Uso (Flujo Principal y Alternos).
> **Roles reales del sistema (7):** `pds`, `solicitante`, `merchant`, `verificador`, `soporte`, `admin`, `superadmin`. El registro público admite 3 roles (`pds`, `solicitante`, `merchant`).
> **Despliegue PWA:** Acceso web progresivo con Workbox, WebSockets (Socket.IO) y almacenamiento en MinIO.
> **Trazabilidad y Seguridad:** Las discrepancias de comportamiento y brechas identificadas se documentan con la etiqueta **"Brecha conocida"** y se enlazan formalmente con el [Registro de Riesgos Conocidos](../Arquitectura/auditoria/Riesgos_Conocidos.md) y el [Informe de Discrepancias de Fase 1](../Arquitectura/auditoria/Fase1_Informe_Discrepancias.md).

---

## RF-01: Registro y Autenticación Segmentada

**HU-01:** Como usuario nuevo, quiero registrarme eligiendo mi rol (`pds`, `solicitante` o `merchant`), para acceder a las funciones correspondientes a mi perfil.

**Criterios de Aceptación:**
1. WHEN usuario inicia registro THEN sistema SHALL permitir selección de rol entre `pds`, `solicitante` y `merchant`.
2. WHEN datos son válidos y usuario acepta T&C (`acepto_tyc = true`) THEN sistema SHALL crear cuenta y perfil asociado en estado inicial.
3. IF correo ya existe THEN sistema SHALL responder error de duplicidad (409).
4. IF usuario no autenticado intenta acceder a rutas protegidas THEN sistema SHALL exigir login.
5. WHEN usuario inicia sesión con credenciales válidas THEN sistema SHALL emitir tokens JWT (access 30 min y refresh rotativo 7 días).
6. IF usuario supera 5 intentos fallidos en 15 minutos por IP THEN sistema SHALL aplicar *rate limit* temporal (en memoria por proceso).

**CU-01.1 Registrarse (Actor: Usuario nuevo)**
- Flujo principal:
  1. Usuario abre la plataforma y selecciona "Registrarse".
  2. Selecciona rol: Proveedor (`pds`), Solicitante o Comerciante (`merchant`).
  3. Ingresa nombre, correo, teléfono y contraseña; acepta T&C y política de privacidad.
  4. Sistema valida unicidad de correo y crea cuenta con perfil asociado.
- Flujos alternos:
  - 3a. Correo ya registrado → error 409 con mensaje explicativo.
  - 3b. Campos requeridos vacíos o T&C no aceptados → bloqueo de envío en formulario.

**CU-01.2 Iniciar sesión (Actor: Usuario registrado)**
- Flujo principal:
  1. Ingresa correo y contraseña.
  2. Sistema valida credenciales. Si tiene 2FA activo, deriva al desafío OTP (HU-56).
  3. Emite tokens y redirige al dashboard según su rol.
- Flujos alternos:
  - 2a. Credenciales erróneas → mensaje de error. Si supera 5 intentos/15 min por IP, queda limitado temporalmente.
  - 2b. Cuenta suspendida o bloqueada por admin → rechazo de acceso (403).

> **Brecha conocida:** El registro no valida mayoría de edad (`edad_verificada = False`, D-07, R-07). El *rate limit* es en memoria por proceso y se desactiva en desarrollo/testing (D-11, R-04).

---

## RF-02: Perfil de Habilidades del Proveedor

**HU-02:** Como pds, quiero registrar mis habilidades, experiencia y zona de trabajo, para visibilizar mis capacidades y recibir solicitudes acordes.

**Criterios de Aceptación:**
1. WHEN pds actualiza su perfil THEN sistema SHALL permitir registrar habilidades, experiencia, categorías y zona.
2. WHEN el perfil contiene al menos una categoría o habilidad THEN sistema SHALL marcar `perfil_completo = true`.
3. WHEN se actualiza la zona THEN sistema SHALL derivar y asignar la región geográfica del usuario (HU-61).
4. WHEN pds postula a solicitudes THEN sistema SHALL limitar la cantidad mensual según su plan de suscripción (Free 3, Básico 15, Profesional ilimitado).

**CU-02.1 Completar perfil de PDS (Actor: PDS)**
- Flujo principal:
  1. Accede a "Mi Perfil".
  2. Ingresa categorías, habilidades específicas, años de experiencia y zona de residencia.
  3. Sistema guarda información, marca perfil completo y asigna región administrativa.
- Flujos alternos:
  - 2a. Campos vacíos → conserva estado incompleto sin bloquear navegación básica.

> **Nota:** La restricción de postulaciones no depende directamente del flag `perfil_completo`, sino del plan de suscripción activo (D-25).

---

## RF-03: Sistema de Reputación y Calificación

**HU-03:** Como solicitante o pds, quiero calificar la contraparte al finalizar un servicio, para construir reputación y confianza en la comunidad.

**Criterios de Aceptación:**
1. WHEN una solicitud está en estado `completada` THEN sistema SHALL habilitar la creación de calificación (`POST /solicitudes/<id>/ratings`).
2. WHEN se envía calificación válida (puntaje 1 a 5 y comentario) THEN sistema SHALL registrarla de forma única por autor y actualizar la calificación promedio del usuario calificado.
3. IF la solicitud no está completada THEN sistema SHALL rechazar la calificación (400).
4. IF el autor ya calificó dicha solicitud THEN sistema SHALL rechazar intento duplicado (409).
5. WHEN una calificación es reportada por abuso THEN sistema SHALL permitir a un administrador ocultarla o eliminarla (HU-63).

**CU-03.1 Calificar servicio de solicitud (Actores: Solicitante, PDS)**
- Flujo principal:
  1. Servicio completado. Usuario accede al detalle de la solicitud.
  2. Asigna puntaje de 1 a 5 estrellas y comentario opcional.
  3. Sistema persiste la calificación y recalcula `Profile.calificacion_promedio`.
- Flujos alternos:
  - 1a. Servicio no completado → opción de calificación bloqueada.
  - 2a. Intento de calificar dos veces la misma solicitud → error de calificación existente.

> **Brecha conocida:** El endpoint `POST /solicitudes/<id>/ratings` valida estado completado y autor único, pero no valida que el calificador y el calificado pertenezcan al contrato respectivo (D-08, R-06). La calificación de Chamba (`rating_estrellas`) es independiente y no recalcula `Profile.calificacion_promedio` (D-08).

---

## RF-04: Publicación de Servicios por Solicitante

**HU-04:** Como solicitante, quiero publicar una solicitud con descripción, categoría, ubicación y presupuesto, para recibir ofertas de prestadores.

**Criterios de Aceptación:**
1. WHEN solicitante crea solicitud THEN sistema SHALL exigir título, descripción, categoría y ubicación.
2. WHEN se define presupuesto numérico THEN sistema SHALL validar mínimo de $50.000; si no se especifica, queda registrado como "a convenir".
3. WHEN ubicación está fuera de la cobertura principal (Medellín/Valledupar) THEN sistema SHALL emitir advertencia geográfica sin bloquear la publicación.
4. WHEN solicitud es publicada exitosamente THEN sistema SHALL asignarla a la región geográfica correspondiente según su ubicación.

**CU-04.1 Publicar solicitud (Actor: Solicitante)**
- Flujo principal:
  1. Selecciona "Publicar servicio".
  2. Selecciona categoría, ingresa descripción detallada, ubicación en mapa y presupuesto.
  3. Sistema valida datos, crea solicitud en estado `publicado` y deriva región.
- Flujos alternos:
  - 2a. Presupuesto numérico menor a $50.000 → error de validación.
  - 2b. Sin presupuesto → se publica como "a convenir".

> **Brecha conocida:** Al publicar una solicitud no se disparan notificaciones automáticas a proveedores cercanos (`CascadeManager.start_cascade` no está cableado al controlador, D-09, R-19). `GET /solicitudes/` es público y no filtra por estado (R-01).

---

## RF-05: Motor de Recomendación IA

**HU-05:** Como solicitante, quiero consultar recomendaciones inteligentes de prestadores bajo demanda, para seleccionar al perfil más afín a mi necesidad.

**Criterios de Aceptación:**
1. WHEN solicitante consulta recomendaciones para un servicio (`GET /ai/recommendations`) THEN sistema SHALL calcular similitud vectorial entre la solicitud y los perfiles PDS.
2. WHEN el modelo ML está disponible THEN sistema SHALL rankear los prestadores combinando cercanía geográfica, score de confianza y afinidad de habilidades.
3. IF el servicio ML no responde THEN sistema SHALL aplicar recomendador heurístico como mecanismo de contingencia (*fallback*).
4. WHEN PDS consulta servicios sugeridos (`GET /ai/solicitudes-for-provider`) THEN sistema SHALL retornar solicitudes compatibles con sus habilidades registradas.

**CU-05.1 Consultar recomendaciones (Actor: Solicitante)**
- Flujo principal:
  1. Solicitante abre su solicitud publicada y solicita recomendaciones.
  2. Motor de IA procesa similitud bajo demanda y genera ranking con explicabilidad.
  3. Muestra lista ordenada de PDS compatibles con su puntaje de confianza.
- Flujos alternos:
  - 2a. Falla en modelo ML → responde lista ordenada por cercanía heurística básica.

---

## RF-06: Visualización Panorámica 360°

**HU-06:** Como usuario, quiero visualizar imágenes panorámicas en 360° dentro de solicitudes y portafolios, para evaluar con mayor detalle el entorno de trabajo.

**Criterios de Aceptación:**
1. WHEN una solicitud o ítem de portafolio contiene una imagen panorámica THEN sistema SHALL renderizarla mediante el visor Photo Sphere Viewer.
2. WHEN el usuario interactúa con el visor THEN sistema SHALL permitir rotación libre horizontal/vertical y zoom.
3. IF la carga de la imagen falla THEN sistema SHALL mostrar mensaje informativo y opción de reintento.

**CU-06.1 Explorar imagen 360° (Actor: Usuario)**
- Flujo principal:
  1. Usuario ingresa a la ficha que contiene evidencia panorámica.
  2. El visor Photo Sphere Viewer inicializa la imagen esférica.
  3. Usuario rota e inspecciona el área.
- Flujos alternos:
  - 2a. Error de red al cargar el archivo de imagen → visualizador muestra botón de recarga.

> **Nota técnica:** La implementación utiliza Photo Sphere Viewer para fotos 360°; no utiliza A-Frame ni escenarios 3D interactivos, y no realiza inspección de ancho de banda por API de conexión (D-14).

---

## RF-07: Gestión Contractual y Órdenes de Trabajo

**HU-07:** Como solicitante y pds, quiero formalizar el acuerdo mediante un contrato con estados trazables, para dar inicio a la prestación del servicio.

**Criterios de Aceptación:**
1. WHEN solicitante acepta una oferta THEN sistema SHALL generar un contrato en estado `creado` vinculado a las partes y a la solicitud.
2. WHEN pds firma/acepta el contrato THEN sistema SHALL cambiar su estado a `aceptado` y permitir crear la Chamba asociada (HU-41).
3. WHEN pds completa sus labores operativas THEN sistema SHALL cambiar estado a `completado_pendiente`.
4. WHEN solicitante confirma la entrega a satisfacción THEN sistema SHALL pasar contrato a `completado`.
5. WHEN alguna de las partes cancela el contrato THEN sistema SHALL registrar motivo y pasar estado a `cancelado`.

**CU-07.1 Ciclo de vida del contrato (Actores: Solicitante, PDS)**
- Flujo principal:
  1. Solicitante acepta oferta de un PDS → contrato generado en `creado`.
  2. PDS revisa términos y acepta → contrato pasa a `aceptado`.
  3. Se habilita y ejecuta la Chamba de trabajo (HU-41 a HU-45).
  4. Al concluir la entrega, PDS marca `completado_pendiente`.
  5. Solicitante confirma conformidad → contrato en `completado`.
- Flujos alternos:
  - 2a. Cancelación fundamentada por cualquiera de las partes antes de iniciar → estado `cancelado` con registro de motivo.

> **Brecha conocida:** No existe auto-confirmación a 48h para contratos; permanece en `completado_pendiente` hasta confirmación o cancelación explícita (D-04). `POST /contracts/` no valida que el proveedor tenga oferta previa (S-03, R-03).

---

## RF-08: Pasarela de Pagos e Ingresos

**HU-08:** Como usuario, quiero disponer de opciones para pagar servicios y registrar retiros de mi billetera, para mantener trazabilidad monetaria.

**Criterios de Aceptación:**
1. WHEN un servicio concluye y se genera pago THEN sistema SHALL permitir el pago mediante Nequi (transferencia manual con instrucciones) o pasarela de prueba (`MockGateway`).
2. WHEN se utiliza `MockGateway` THEN sistema SHALL aprobar la transacción de forma inmediata y simular liquidación.
3. WHEN PDS solicita retiro de saldo disponible THEN sistema SHALL validar monto mínimo de $10.000 y transferir dicho valor a `saldo_bloqueado`.
4. WHEN ocurre un fallo en pago THEN sistema SHALL permitir reintento sin duplicar cargos.

**CU-08.1 Pagar servicio (Actor: Solicitante)**
- Flujo principal:
  1. Servicio completado genera pago. Solicitante selecciona método de pago.
  2. Si elige Nequi, visualiza datos bancarios de la plataforma para transferencia manual.
  3. En modo pasarela de prueba, confirma y el sistema marca el pago como completado.
- Flujos alternos:
  - 2a. Transacción no confirmada → opción de reintentar pago.

**CU-08.2 Solicitar retiro (Actor: PDS)**
- Flujo principal:
  1. PDS accede a su billetera con saldo disponible.
  2. Ingresa monto (≥ $10.000) y selecciona cuenta bancaria de destino (HU-70).
  3. Sistema traslada el monto a `saldo_bloqueado` y registra la transacción en historial.
- Flujos alternos:
  - 2a. Saldo disponible menor a $10.000 → bloqueo de solicitud de retiro.

> **Brecha conocida:** Pasarela MercadoPago/PSE no se encuentra activa en producción. El retiro únicamente bloquea saldo interno; no efectúa dispersión bancaria automática real (D-01, R-15).

---

## RF-09: Historial y Trazabilidad de Ingresos

**HU-09:** Como pds, quiero consultar mi historial de cobros y descargar reportes, para llevar el control financiero de mis servicios.

**Criterios de Aceptación:**
1. WHEN pds ingresa al módulo de pagos THEN sistema SHALL mostrar historial de transacciones recibidas con fecha, estado y monto neto.
2. WHEN pds solicita exportación THEN sistema SHALL generar archivo CSV con el historial de pagos.
3. WHEN pds solicita certificado de ingresos THEN sistema SHALL generar documento PDF oficial gratuito con el consolidado de los últimos 12 meses (HU-13).

**CU-09.1 Consultar ingresos y exportar (Actor: PDS)**
- Flujo principal:
  1. Accede a "Mis Ingresos".
  2. Visualiza listado de pagos recibidos.
  3. Presiona "Exportar CSV" → descarga el histórico consolidado.
- Flujos alternos:
  - 2a. Usuario sin transacciones → visualiza estado vacío sin movimientos.

---

## RF-10: Alertas de Formalización y Notificaciones Operativas

**HU-10:** Como pds, quiero recibir notificaciones al completar contratos, para estar informado sobre el cierre de mis servicios.

**Criterios de Aceptación:**
1. WHEN un contrato cambia a estado `completado` THEN sistema SHALL crear una notificación in-app para el proveedor.
2. WHEN se genera la notificación THEN sistema SHALL garantizar idempotencia para evitar notificaciones duplicadas por el mismo contrato.

**CU-10.1 Notificación de servicio completado (Actor: Sistema / PDS)**
- Flujo principal:
  1. Contrato completado exitosamente.
  2. Sistema genera notificación automática al PDS.
  3. PDS visualiza la campana de notificaciones con el nuevo aviso.

> **Brecha conocida:** Las alertas automáticas por superar umbrales de ingresos para cotización en seguridad social (Ley 1429/1562) y aviso de descuento por volumen no están implementadas en el código (D-21).

---

## RF-11: Suscripciones y Planes

**HU-11:** Como pds, quiero suscribirme a planes de servicio, para acceder a cupos de postulación ampliados y mayor visibilidad.

**Criterios de Aceptación:**
1. WHEN un usuario nuevo se registra THEN sistema SHALL asignar por defecto el plan Free ($0/mes, 3 postulaciones mensuales).
2. WHEN pds selecciona plan Básico ($15.000 COP) THEN sistema SHALL activar suscripción simulada por 30 días con 15 postulaciones mensuales.
3. WHEN pds selecciona plan Profesional ($35.000 COP) THEN sistema SHALL activar suscripción simulada con postulaciones ilimitadas y marca de perfil destacado.
4. WHEN pds cancela su suscripción activa THEN sistema SHALL revertir el plan a Free de forma inmediata.

**CU-11.1 Suscribirse a un plan (Actor: PDS)**
- Flujo principal:
  1. Ingresa a "Planes y Suscripciones".
  2. Selecciona Básico o Profesional.
  3. Sistema procesa suscripción simulada (`metodo_pago="mock"`) y actualiza límites de postulación.
- Flujos alternos:
  - 3a. Cancelación voluntaria → se desactiva suscripción y retorna de inmediato al plan Free.

> **Brecha conocida:** Las suscripciones operan en modo simulado sin cobro recurrente ni periodo de prueba de 3 meses. Las monedas de bienvenida listadas en catálogo no se acreditan automáticamente por código (D-06).

---

## RF-12: Verificación de Identidad

**HU-12:** Como usuario, quiero presentar mi documentación de verificación de identidad, para obtener la insignia de usuario verificado y mayor credibilidad.

**Criterios de Aceptación:**
1. WHEN usuario carga documentos de identidad según su rol THEN sistema SHALL registrarlos en estado `enviado` dentro del módulo KYC (HU-52).
2. WHEN el personal verificador o administrador aprueba todos los documentos obligatorios del rol THEN sistema SHALL asignar `Profile.verificado = true`.
3. IF un documento es rechazado con observaciones THEN sistema SHALL permitir al usuario cargar una nueva versión.

**CU-12.1 Tramitar verificación (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Verificación KYC".
  2. Carga documento de identidad y selfie de prueba de vida.
  3. Personal interno revisa y aprueba → insignia de verificación otorgada.
- Flujos alternos:
  - 3a. Documento rechazado → usuario recibe notificación con el motivo del rechazo y reenvía.

> **Brecha conocida:** No existe opción de verificación Express de pago ($20k / 4h) (D-20). El SLA de 48h detecta demoras pero la alerta a administradores está pendiente (`TODO`, R-18).

---

## RF-13: Certificado de Ingresos

**HU-13:** Como pds, quiero generar un certificado oficial de ingresos en formato digital, para acreditar mi actividad productiva en trámites personales.

**Criterios de Aceptación:**
1. WHEN pds solicita certificado de ingresos (`GET /payments/certificado-ingresos/pdf`) THEN sistema SHALL compilar historial de los últimos 12 meses, promedio de ingresos, cantidad de servicios completados y calificación.
2. WHEN se solicita el certificado THEN sistema SHALL generarlo de forma gratuita sin requerir pago previo.
3. WHEN pds solicita el detalle en datos THEN sistema SHALL ofrecer descarga complementaria en formato CSV.

**CU-13.1 Descargar certificado (Actor: PDS)**
- Flujo principal:
  1. Ingresa a su sección de ingresos y selecciona "Generar Certificado".
  2. Sistema genera el archivo PDF con marca de verificación y firma digital.
  3. PDS descarga el documento.

> **Nota:** La emisión del certificado es gratuita y no cobra tarifa de $25.000 COP (D-20).

---

## RF-14: Servicios de Valor Agregado

**HU-14:** Como pds con suscripción profesional, quiero contar con perfil destacado, para aumentar mis oportunidades de contratación.

**Criterios de Aceptación:**
1. WHEN pds cuenta con suscripción activa al plan Profesional THEN sistema SHALL mostrar su perfil con distintivo destacado en búsquedas.
2. WHEN finaliza la suscripción Profesional THEN sistema SHALL remover el distintivo destacado del perfil.

**CU-14.1 Beneficio de perfil destacado (Actor: PDS)**
- Flujo principal:
  1. PDS adquiere plan Profesional.
  2. Su perfil y postulaciones se visualizan con etiqueta destacada.

> **Brecha conocida:** No existen endpoints para compra individual o diaria de servicios de valor agregado (destacado por día a $10k, insignias individuales a $15k, portafolio extra a $8k ni push a $5k). La única vía de distinción implementada es el plan Profesional (D-20).

---

## RF-15: Comisiones por Transacción

**HU-15:** Como plataforma, quiero aplicar deducciones porcentuales por servicio prestado, para financiar la operación del sistema.

**Criterios de Aceptación:**
1. WHEN se procesa un pago mediante la pasarela de pagos THEN sistema SHALL calcular deducción de 12% a cargo del PDS y 8% a cargo del solicitante.
2. WHEN se confirma un contrato en Modalidad A THEN sistema SHALL calcular retención de comisión de plataforma del 12% sobre el valor acordado.

**CU-15.1 Retención de comisión (Actor: Sistema)**
- Flujo principal:
  1. Solicitante realiza el pago del servicio.
  2. Sistema aplica el descuento de comisión de plataforma y liquida el saldo neto.

> **Brecha conocida:** Existen discrepancias entre el cálculo de pagos (12% + 8%) y el cálculo de contratos (12% solo Modalidad A con captura de excepciones silenciosa `except: pass`). No están implementados los descuentos por volumen (-10% a más de 10 servicios) ni la exención de comisión de 3 meses para PDS nuevos (D-05, R-16).

---

## RF-16: Comunicación y Notificaciones en Tiempo Real

**HU-16:** Como usuario, quiero recibir avisos in-app y actualizaciones instantáneas mediante WebSockets, para responder oportunamente a eventos de mis solicitudes.

**Criterios de Aceptación:**
1. WHEN se emite una oferta, contrato o actualización de Chamba THEN sistema SHALL enviar evento Socket.IO a las salas privadas de los usuarios involucrados.
2. WHEN se envía un mensaje de chat THEN sistema SHALL persistirlo y difundirlo inmediatamente por WebSockets.
3. WHEN usuario ingresa a la plataforma THEN sistema SHALL listar sus notificaciones pendientes y el conteo de no leídas.

**CU-16.1 Recibir notificación en vivo (Actor: Usuario)**
- Flujo principal:
  1. Usuario mantiene la aplicación abierta.
  2. Ocurre un cambio de estado en una de sus solicitudes o contratos.
  3. Servidor emite evento vía Socket.IO y la interfaz actualiza el contador y la vista al instante.

> **Brecha conocida:** No se encuentra implementada la integración con Web Push API para notificaciones en segundo plano cuando el navegador está cerrado (D-15).

---

## RF-17: Marco Legal y Términos y Condiciones

**HU-17:** Como plataforma, quiero que los usuarios acepten formalmente los Términos y Condiciones al registrarse, para establecer la relación de intermediación y mitigar riesgos legales.

**Criterios de Aceptación:**
1. WHEN usuario se registra THEN sistema SHALL exigir confirmación explícita de lectura y aceptación de los T&C (`acepto_tyc = true`).
2. WHEN se consulta la versión pública de T&C (`GET /legal/tyc`) THEN sistema SHALL retornar el contenido legal vigente.
3. WHEN se consulta la política de tratamiento de datos (`GET /legal/politica-datos`) THEN sistema SHALL entregar los términos de Habeas Data según Ley 1581 de 2012.

**CU-17.1 Aceptar términos legales (Actor: Usuario)**
- Flujo principal:
  1. Durante el formulario de registro, usuario consulta los enlaces de términos y política de datos.
  2. Marca la casilla de aceptación obligatoria.
  3. Sistema registra la aceptación y crea la cuenta.

> **Brecha conocida:** La versión de T&C en el controlador de registro está fija en `"1.0"` independientemente de nuevas versiones publicadas por el superadmin. No se verifica edad mínima de 18 años en el registro (D-07, R-07).

---

## RNF-07: Experiencia PWA y Acceso Web

**HU-18:** Como usuario, quiero acceder a la plataforma como una Aplicación Web Progresiva (PWA), para contar con acceso rápido y carga ágil de la interfaz.

**Criterios de Aceptación:**
1. WHEN el usuario visita la plataforma desde un navegador compatible THEN sistema SHALL ofrecer la instalación de la PWA mediante su *manifest*.
2. WHEN el usuario navega por la aplicación THEN los componentes estáticos y shell SHALL servirse desde la memoria caché gestionada por Workbox.
3. IF se pierde temporalmente la conexión a Internet THEN sistema SHALL mantener cargada la vista en pantalla informando la falta de conectividad.

**CU-18.1 Uso de la PWA (Actor: Usuario)**
- Flujo principal:
  1. Abre el enlace web de ChambeApp en su dispositivo móvil o de escritorio.
  2. Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio".
  3. La PWA se abre como ventana independiente con inicio ágil.

> **Brecha conocida:** No existe cola de sincronización offline en segundo plano (Background Sync) para enviar transacciones o mensajes mientras no haya red (D-15).

---

## RF-22: Desbloqueo Gradual de Información y Privacidad

**HU-19:** Como solicitante y pds, quiero que los datos sensibles de ubicación exacta se protejan hasta que exista un acuerdo formal, para resguardar la privacidad.

**Criterios de Aceptación:**
1. WHEN una solicitud está publicada THEN las coordenadas exactas SHALL reservarse para el solicitante o usuarios con contrato asociado.
2. WHEN se formaliza el acuerdo mediante la aceptación de la oferta THEN el sistema SHALL liberar la visualización de la ubicación al prestador adjudicado.
3. WHEN una solicitud es cancelada THEN los datos sensibles de ubicación SHALL mantenerse protegidos.

**CU-19.1 Acceder a datos de ubicación (Actores: PDS, Solicitante)**
- Flujo principal:
  1. Solicitante publica solicitud con ubicación referencial.
  2. PDS postula conociendo solo la zona general.
  3. Solicitante acepta la oferta → contrato creado habilita al PDS para consultar la ubicación detallada.

> **Brecha conocida:** El chat no cuenta con control de acceso previo; cualquier usuario autenticado puede abrir conversación con otro sin necesidad de contrato previo (D-03, R-05).

---

## RF-23: Confirmación de Finalización de Servicios

**HU-20:** Como solicitante, quiero confirmar la recepción conforme del servicio antes del cierre definitivo, para validar la calidad del trabajo.

**Criterios de Aceptación:**
1. WHEN el prestador marca la entrega en el contrato THEN este SHALL pasar a estado `completado_pendiente`.
2. WHEN el solicitante confirma satisfacción THEN el contrato SHALL cambiar a `completado` habilitando calificaciones y liquidación.
3. IF el solicitante presenta inconformidad THEN el contrato SHALL permitir la apertura de una disputa administrativa (HU-64).

**CU-20.1 Confirmar finalización (Actor: Solicitante)**
- Flujo principal:
  1. PDS notifica la entrega del trabajo. Contrato en `completado_pendiente`.
  2. Solicitante revisa el resultado.
  3. Confirma la recepción → contrato pasa a `completado`.
- Flujos alternos:
  - 2a. Desacuerdo en la entrega → solicitante acude al canal de disputas.

> **Brecha conocida:** No existe auto-confirmación a 48h para contratos; permanece en `completado_pendiente` de forma indefinida hasta acción explícita (D-04). El flujo de ejecución detallado con evidencias y check-in dual se realiza en el módulo Chamba (HU-44 y HU-45).

---

## RF-24: Gestión de Ofertas y Negociación Bilateral

**HU-21:** Como pds, quiero postularme a solicitudes con ofertas y negociar condiciones con el solicitante, para acordar precio y alcance justos.

**Criterios de Aceptación:**
1. WHEN un pds con rol válido postula a una solicitud ajena THEN sistema SHALL registrar la oferta y notificar al solicitante.
2. WHEN el solicitante o el pds desean ajustar términos THEN sistema SHALL permitir contraofertar bilateralmente mediante el endpoint `/responder`.
3. WHEN el solicitante acepta una oferta THEN sistema SHALL crear el contrato respectivo y rechazar automáticamente las demás ofertas activas de la solicitud.
4. IF el solicitante cancela la solicitud THEN sistema SHALL mantener el historial de las ofertas registradas.

**CU-21.1 Postular y negociar oferta (Actores: PDS, Solicitante)**
- Flujo principal:
  1. PDS visualiza solicitud y envía oferta con monto propuesto y mensaje.
  2. Solicitante recibe oferta; puede aceptarla, rechazarla o enviar una contraoferta con nuevo precio.
  3. PDS evalúa contraoferta y puede aceptarla.
  4. Al consolidar la aceptación, se crea el contrato y se descartan las ofertas de otros postulantes.

> **Nota:** No existe un endpoint para modificación unilateral de oferta enviada; los ajustes se realizan a través del mecanismo de contraofertas bilaterales (D-16).

---

## RF-25: Sistema de Billetera Virtual

**HU-22:** Como usuario, quiero contar con una billetera virtual dentro de la plataforma, para administrar mi saldo disponible, abonos y retiros.

**Criterios de Aceptación:**
1. WHEN un usuario consulta su billetera por primera vez THEN sistema SHALL inicializarla bajo demanda con saldo $0.
2. WHEN usuario realiza un depósito simulado THEN sistema SHALL acreditar el saldo inmediatamente (mínimo $1.000).
3. WHEN PDS solicita retiro THEN sistema SHALL verificar saldo disponible suficiente (mínimo $10.000) y pasar el monto a `saldo_bloqueado`.
4. WHEN ocurre un movimiento en la billetera THEN sistema SHALL registrar la entrada correspondiente en el historial de transacciones.

**CU-22.1 Operaciones en billetera (Actor: Usuario)**
- Flujo principal:
  1. Usuario abre "Mi Billetera" y visualiza su saldo disponible y bloqueado.
  2. Selecciona "Depositar", ingresa monto (≥ $1.000) y el saldo se abona al instante.
  3. Selecciona "Retirar", ingresa monto (≥ $10.000) y cuenta bancaria de destino. El valor pasa a saldo bloqueado.

> **Brecha conocida:** El depósito acredita saldo al instante sin validación de pasarela bancaria. El retiro traslada saldo a bloqueado sin dispersar fondos reales a cuentas bancarias (D-01, D-17, R-15).

---

## RF-26: Modalidad de Cobro

**HU-23:** Como solicitante y pds, quiero disponer de modalidades con y sin comisión monetaria, para flexibilizar la contratación.

**Criterios de Aceptación:**
1. WHEN solicitante crea una solicitud THEN sistema SHALL fijar Modalidad A ("Con Comisión") por defecto, permitiendo elegir Modalidad B ("Sin Comisión").
2. WHEN una solicitud es de Modalidad B THEN sistema SHALL exigir el débito de 50 monedas al PDS al momento en que el solicitante acepta su oferta.
3. WHEN PDS consulta la solicitud THEN sistema SHALL mostrar claramente la modalidad aplicable.

**CU-23.1 Modalidad en oferta (Actores: Solicitante, PDS)**
- Flujo principal:
  1. Solicitante publica solicitud en Modalidad B (sin comisión porcentual monetaria).
  2. PDS postula a la solicitud.
  3. Solicitante acepta la oferta del PDS. Sistema debita 50 monedas de la cuenta del PDS y formaliza el contrato.
- Flujos alternos:
  - 3a. PDS no posee saldo suficiente de monedas al momento de la aceptación → el sistema rechaza la aceptación (error 400).

> **Nota:** En Modalidad B el PDS no es bloqueado al postular; la validación y el débito de 50 monedas ocurren cuando el solicitante intenta aceptar la oferta (D-18).

---

## RF-27: Sistema de Monedas

**HU-24:** Como usuario, quiero adquirir y consumir paquetes de monedas, para participar en solicitudes sin comisión y acceder a beneficios.

**Criterios de Aceptación:**
1. WHEN usuario adquiere un paquete de monedas THEN sistema SHALL acreditar las monedas adquiridas más su bonificación: Básico 50 ($5k), Estándar 150+15 ($15k), Premium 350+50 ($30k).
2. WHEN usuario consulta su saldo de monedas THEN sistema SHALL desglosar entre compradas, promocionales y ganadas.
3. WHEN monedas promocionales alcanzan su fecha de vencimiento THEN una tarea automática en segundo plano SHALL debitarlas del saldo.

**CU-24.1 Comprar y consultar monedas (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Comprar Monedas".
  2. Selecciona paquete (ej. Estándar 150 + 15 bonus por $15.000).
  3. Sistema acredita 165 monedas a su cuenta.
  4. Consulta el detalle por tipo de moneda en "Mis Monedas".

---

## RF-28: Precios Sugeridos por Categoría

**HU-25:** Como solicitante, quiero consultar referencias de precios sugeridos por oficio, para formular ofertas acordes al mercado local.

**Criterios de Aceptación:**
1. WHEN solicitante consulta precios de referencia (`GET /prices/precios/<categoria>`) THEN sistema SHALL retornar valores mínimo, promedio y máximo orientativos.
2. WHEN se consulta el catálogo general (`GET /prices/precios`) THEN sistema SHALL entregar los rangos tabulados para todas las categorías activas.

**CU-25.1 Consultar precios sugeridos (Actor: Solicitante)**
- Flujo principal:
  1. Al redactar una solicitud, selecciona la categoría de trabajo.
  2. Visualiza la banda de precios sugeridos por la plataforma como guía presupuestal.

---

## RF-29: Hitos de Pago en Contratos

**HU-26:** Como usuario en contratos de obra extensa, quiero dividir el servicio en hitos entregables, para efectuar aprobaciones por etapas.

**Criterios de Aceptación:**
1. WHEN un contrato requiere entregas parciales THEN sistema SHALL permitir crear múltiples hitos con descripción y porcentaje/monto asociado.
2. WHEN solicitante aprueba la entrega de un hito THEN sistema SHALL cambiar su estado a `aprobado`.
3. IF un hito permanece en estado pendiente durante más de 48 horas THEN una tarea programada Celery (`auto_approve_milestones`) SHALL aprobarlo automáticamente.
4. WHEN se verifica el contrato (`/check`) y todos los hitos están aprobados THEN sistema SHALL confirmar la finalización integral de las entregas.

**CU-26.1 Gestión de hitos (Actores: Solicitante, PDS)**
- Flujo principal:
  1. Se configuran 3 hitos de entrega en el contrato.
  2. PDS entrega hito 1. Solicitante aprueba → estado `aprobado`.
  3. Hito 2 permanece 48h sin revisión → tarea en segundo plano lo aprueba por vencimiento de plazo.
  4. Se aprueban todos los hitos → se valida la completitud de las etapas del contrato.

> **Brecha conocida:** La aprobación de un hito no descuenta comisiones ni transfiere fondos de forma automática en la billetera; el rechazo no abre una disputa de forma automática (D-19). Los endpoints de hitos no validan pertenencia al contrato (S-02, R-02).

---

## RF-30: Dashboards Operativos y Financieros

**HU-27:** Como pds, quiero visualizar un dashboard operativo con el resumen de mis servicios y cobros, para monitorear mi rendimiento.

**Criterios de Aceptación:**
1. WHEN pds ingresa a su panel operativo THEN sistema SHALL mostrar métricas de trabajos completados, saldo disponible e ingresos acumulados.
2. WHEN pds solicita historial financiero THEN sistema SHALL permitir descargar el registro de pagos en formato CSV.

**CU-27.1 Consultar dashboard de PDS (Actor: PDS)**
- Flujo principal:
  1. Ingresa a su panel principal.
  2. Visualiza tarjetas con estadísticas de servicios y finanzas.

---

**HU-28:** Como solicitante, quiero consultar mi historial de pagos y servicios contratados, para mantener orden en mis gastos.

**Criterios de Aceptación:**
1. WHEN solicitante ingresa a su panel THEN sistema SHALL listar los pagos realizados con identificación de servicio y fecha.
2. WHEN solicita detalle THEN sistema SHALL mostrar montos pagados y contraparte contratada.

**CU-28.1 Ver pagos de solicitante (Actor: Solicitante)**
- Flujo principal:
  1. Abre "Mis Pagos".
  2. Visualiza historial de transacciones efectuadas.

---

**HU-29:** Como usuario, quiero visualizar en un solo lugar mis recursos de billetera y monedas, para planificar mis transacciones.

**Criterios de Aceptación:**
1. WHEN usuario ingresa a la vista de recursos THEN sistema SHALL presentar saldo en pesos y monedas discriminadas por origen.
2. WHEN existen transacciones en curso THEN sistema SHALL reflejar los saldos retenidos o bloqueados.

**CU-29.1 Ver estado de recursos (Actor: Usuario)**
- Flujo principal:
  1. Abre "Billetera y Monedas".
  2. Consulta balances consolidados en tiempo real.

---

## Requerimientos de IA, Confianza, Geocerca y Tiempo Real

## RF-ML-1: Recomendación Geoespacial y Machine Learning

**HU-30:** Como solicitante, quiero que el sistema clasifique a los proveedores combinando distancia física y afinidad de perfil, para contactar a los más aptos.
- **Criterios de Aceptación:**
  1. WHEN se solicita recomendación THEN sistema SHALL calcular distancia geográfica y score ML.
  2. IF el ranking ML no genera resultados suficientes THEN sistema SHALL ordenar por cercanía y reputación heurística.
- **CU-30.1 Ranking inteligente (Actor: Solicitante)**
  - Flujo principal: 1. Publica solicitud. 2. Consulta sugerencias. 3. Visualiza lista con desglose de compatibilidad.

---

## RF-ML-2: Experimentación A/B Testing

**HU-31:** Como equipo técnico, quiero que el motor de recomendación asigne grupos A/B deterministas, para comparar el desempeño de los algoritmos.
- **Criterios de Aceptación:**
  1. WHEN se solicita recomendación THEN sistema SHALL asignar grupo de prueba determinista y almacenar la métrica de consulta.
- **CU-31.1 Asignación A/B (Actor: Sistema)**
  - Flujo principal: 1. Evalúa identificador de solicitud. 2. Asigna grupo A o B. 3. Aplica variante y registra log.

---

## RF-ML-3: Característica Thompson Bandit en Ranking ML

**HU-32:** Como sistema, quiero calcular valores probabilísticos mediante Thompson Sampling, para enriquecer las variables de entrada del modelo predictivo.
- **Criterios de Aceptación:**
  1. WHEN el modelo de IA calcula el ranking de proveedores THEN sistema SHALL incorporar el valor `bandit_arm_value` como característica (*feature*) predictiva.
- **CU-32.1 Evaluación de features (Actor: Sistema)**
  - Flujo principal: 1. Motor de IA procesa candidatos. 2. Inyecta valor de exploración Thompson. 3. Genera ranking ponderado.

> **Nota técnica:** El algoritmo Thompson Bandit opera como un extractor de características para el modelo de Machine Learning; no realiza rotación visual de categorías en la interfaz pública (D-13).

---

## RF-Trust-1: Puntaje de Confianza (Trust Score)

**HU-33:** Como solicitante, quiero consultar el Trust Score (0 a 100) de un pds, para tomar decisiones basadas en reputación verificable.
- **Criterios de Aceptación:**
  1. WHEN se consulta el perfil de un PDS (`GET /trust/<id>`) THEN sistema SHALL calcular y entregar el puntaje consolidado de 0 a 100 con su nivel cualitativo (Nuevo, Confiable, Verificado, Experto).
- **CU-33.1 Ver Trust Score (Actor: Solicitante)**
  - Flujo principal: 1. Abre perfil de PDS. 2. Visualiza puntaje de confianza con dimensiones de verificación, historial y calificaciones.

---

## RF-Trust-2: Insignias de Logro (Badges)

**HU-34:** Como pds, quiero recibir insignias por cumplimiento de metas y verificaciones, para acreditar mi trayectoria ante los clientes.
- **Criterios de Aceptación:**
  1. WHEN PDS alcanza hitos de verificación o servicios concluidos THEN sistema SHALL otorgar insignias visibles en su perfil público.
- **CU-34.1 Obtener y exhibir badges (Actor: PDS)**
  - Flujo principal: 1. Cumple condiciones (ej. identidad verificada, primeros 5 servicios). 2. Sistema concede insignia. 3. Se exhibe en su perfil.

---

## RF-Geo-1: Delimitación de Cobertura con Geocercas

**HU-35:** Como solicitante, quiero configurar el radio geográfico (`radio_km`) al publicar una solicitud, para delimitar la zona de cobertura deseada.
- **Criterios de Aceptación:**
  1. WHEN solicitante crea una solicitud THEN sistema SHALL permitir definir `radio_km` (por defecto 5 km) y almacenar el punto geoespacial PostGIS.
- **CU-35.1 Definir geocerca (Actor: Solicitante)**
  - Flujo principal: 1. Selecciona punto en mapa. 2. Ajusta el radio de cobertura en kilómetros. 3. Publica solicitud.

---

## RF-Geo-2: Notificación en Cascada Geoespacial

**HU-36:** Como pds, quiero que la plataforma gestione notificaciones escalonadas por anillos de proximidad, para una difusión eficiente de oportunidades.
- **Criterios de Aceptación:**
  1. WHEN el servicio de cascada es invocado THEN sistema SHALL calcular anillos concéntricos (2 km, 5 km, 15 km) para notificación progresiva.
- **CU-36.1 Ejecutar cascada (Actor: Sistema)**
  - Flujo principal: 1. Procesa coordenadas de solicitud. 2. Identifica PDS por radio concéntrico. 3. Emite notificaciones por etapas.

> **Brecha conocida / Estado:** ⚠️ **DEFINIDO PERO NO CABLEADO.** El servicio `CascadeManager.start_cascade` se encuentra implementado a nivel de servicio y pruebas unitarias, pero no se invoca desde los controladores de creación de solicitudes (D-09, R-19).

---

## RF-360-1: Visor Panorámico de Portafolio

**HU-37:** Como usuario, quiero explorar trabajos del portafolio en formato 360°, para verificar la calidad de las obras terminadas.
- **Criterios de Aceptación:**
  1. WHEN se abre un ítem de portafolio clasificado como 360° THEN sistema SHALL abrir el visualizador Photo Sphere Viewer.
- **CU-37.1 Ver portafolio 360° (Actor: Usuario)**
  - Flujo principal: 1. Selecciona foto 360° del portafolio. 2. Explora el entorno esférico de la obra.

---

## RF-UI-1: Comunicación en Tiempo Real por WebSockets

**HU-38:** Como usuario, quiero recibir alertas y mensajes instantáneos mediante WebSockets, para interactuar sin refrescar la página.
- **Criterios de Aceptación:**
  1. WHEN ocurre un evento relevante (ofertas, cambios de estado en chambas o mensajes) THEN el servidor SHALL emitir evento Socket.IO correspondiente a la sala del usuario en tiempo real.
- **CU-38.1 Notificación en vivo (Actor: Usuario)**
  - Flujo principal: 1. Cliente conectado por socket se une a su sala personal. 2. Servidor envía evento `chamba:actualizado` o `message`. 3. UI actualiza badge y contenido.

---

## RF-UI-2: Carga de Archivos de Portafolio en MinIO

**HU-39:** Como pds, quiero subir fotografías y evidencias a almacenamiento seguro en la nube, para enriquecer mi portafolio profesional.
- **Criterios de Aceptación:**
  1. WHEN PDS carga un archivo a su portafolio THEN sistema SHALL almacenarlo en el servicio de objetos MinIO y registrar la URL pública correspondiente.
- **CU-39.1 Subir archivo a MinIO (Actor: PDS)**
  - Flujo principal: 1. Selecciona imagen local. 2. Sistema sube archivo a MinIO. 3. Añade el ítem al portafolio del perfil.

---

## RF-ML-4: Dashboard de Métricas de Inteligencia Artificial

**HU-40:** Como administrador, quiero consultar un dashboard con métricas de desempeño de los modelos de recomendación y pruebas A/B, para monitorear su precisión.
- **Criterios de Aceptación:**
  1. WHEN administrador consulta `/api/v1/ai/metrics` THEN sistema SHALL retornar indicadores de tasa de interacción por variante A/B e importancia relativa de las variables (*features*) del modelo.
- **CU-40.1 Consultar métricas de IA (Actor: Administrador)**
  - Flujo principal: 1. Accede al panel técnico de IA. 2. Visualiza gráficos de rendimiento de modelos y pruebas A/B.

---

## Módulos documentados a partir del código (HU-41 en adelante)

> **Origen:** Fase 2 de la auditoría. Estos módulos **existen en el código** pero no tenían historia de usuario (discrepancia D-10 del [informe de Fase 1](../Arquitectura/auditoria/Fase1_Informe_Discrepancias.md)). Las HU describen el **comportamiento verificado en el código** (`backend/` rama `Dev`); donde el comportamiento esperado por los RF difiere se indica **"Brecha conocida"** y se enlaza el [Registro de Riesgos Conocidos](../Arquitectura/auditoria/Riesgos_Conocidos.md).
> **Roles reales del sistema (7):** `pds`, `solicitante`, `merchant`, `verificador`, `soporte`, `admin`, `superadmin`. El registro público solo admite `pds`, `solicitante` y `merchant`; el personal interno lo crea el superadmin o un admin regional.
> **Convención de trazabilidad:** cada HU cita sus RF (`RF_Modulo_*.md`, `RF_Division_Regional.md`); "Sin RF previo" indica funcionalidad implementada que aún no tiene RF formal.

---

## RF-49 / RF-50: Chamba — creación y ciclo de estados (Hitos 1–2)

**HU-41:** Como solicitante o pds de un contrato firmado, quiero un expediente de **Chamba** con un ciclo de estados controlado, para seguir la ejecución del servicio de principio a fin.

**Criterios de Aceptación:**
1. WHEN el pds acepta (firma) el contrato THEN sistema SHALL crear la Chamba en estado `programada` con evidencias, adendas y novedades vacías.
2. WHEN un participante del contrato solicita `POST /chambas/` THEN sistema SHALL crear la Chamba una sola vez por contrato (si ya existe → error 400).
3. WHEN se solicita una transición de estado THEN sistema SHALL validarla contra la máquina: `programada → en_proceso → en_ejecucion ⇄ pausada → pendiente_validacion → liquidacion_confirmada → finalizada`.
4. IF la transición no es válida THEN sistema SHALL responder 400 indicando estado actual y solicitado.
5. WHEN la Chamba cambia de estado THEN sistema SHALL emitir el evento Socket.IO `chamba:actualizado` a ambos participantes.
6. IF el usuario no participa en el contrato THEN sistema SHALL responder 403 en cualquier operación sobre la Chamba.

**CU-41.1 Crear y consultar chamba (Actores: Solicitante, PDS)**
- Flujo principal: 1. El pds firma el contrato. 2. Sistema crea la Chamba `programada`. 3. Ambas partes consultan el expediente (`GET /chambas/<id>`) y sus listados (`/chambas/solicitante/<uid>`, `/chambas/prestador/<uid>`, con filtro por estado).
- Alterno: 2a. Contrato con Chamba existente → 400. 3a. Usuario ajeno → 403.

> **Brecha conocida:** `POST /chambas/` no valida que el contrato esté firmado y permite crearla a cualquiera de las dos partes; `en_proceso → en_ejecucion` no exige rol ni condición (R-12). · **Trazabilidad:** RF-49, RF-50.

---

## RF-51 / RF-52: Chamba — inicio de obra con geo-validación y evidencia de entrada (Hito 2)

**HU-42:** Como pds, quiero iniciar la obra validando mi llegada al sitio y registrar evidencia fotográfica inicial, para dejar constancia de las condiciones de partida.

**Criterios de Aceptación:**
1. WHEN el pds solicita pasar a `en_proceso` THEN sistema SHALL exigir sus coordenadas GPS (`latitud`, `longitud`).
2. IF la solicitud no tiene ubicación registrada THEN sistema SHALL responder 400.
3. IF el pds está a más de **100 m** del sitio de trabajo THEN sistema SHALL rechazar el inicio indicando el radio permitido.
4. IF quien inicia la obra no es el pds de la Chamba THEN sistema SHALL responder 403.
5. WHEN la validación es exitosa THEN sistema SHALL registrar `fecha_inicio_obra`.
6. WHEN el pds registra evidencia de entrada THEN sistema SHALL aceptarla solo en estados `en_proceso` o `en_ejecucion` y guardar las URLs.
7. WHEN se sube una foto o 360° (`POST /chambas/evidencia/upload`) THEN sistema SHALL almacenarla en MinIO y devolver la URL.

**CU-42.1 Iniciar obra (Actor: PDS)**
- Flujo principal: 1. El pds llega al sitio y abre la Chamba. 2. El navegador aporta su GPS. 3. Sistema valida distancia ≤ 100 m (PostGIS `ST_DistanceSphere`; Haversine si PostGIS no está disponible). 4. Estado pasa a `en_proceso`.
- Alterno: 3a. Fuera de radio → error con la distancia máxima. 3b. Sin GPS → 400.

**CU-42.2 Registrar evidencia de entrada (Actor: PDS)**
- Flujo principal: 1. Sube foto/360° al almacenamiento. 2. Registra las URLs como evidencia de entrada. 3. Contraparte recibe la actualización en tiempo real.
- Alterno: 2a. Chamba fuera de ejecución → 400.

> **Trazabilidad:** RF-51, RF-52.

---

## RF-53 / RF-54: Chamba — adendas, novedades, pánico y pausa (Hito 3)

**HU-43:** Como participante de una Chamba, quiero registrar adendas al contrato y novedades (incluido el botón de pánico), para gestionar imprevistos durante la ejecución.

**Criterios de Aceptación:**
1. WHEN un participante registra una adenda THEN sistema SHALL guardar descripción, `monto_extra`, `tiempo_extra` (minutos/horas/días), `cubierta_por` (`pds_actual` u `otro_pds`) y `categoria_requerida`, y notificar a la contraparte.
2. WHEN el pds propone una adenda cubierta por `otro_pds` THEN sistema SHALL marcarla como **sugerencia** (`sugerida_por_pds`); la decisión de lanzar la Maraña es del solicitante.
3. WHEN el solicitante edita o elimina una adenda THEN sistema SHALL permitirlo solo si **no está derivada** a una Maraña.
4. IF la Chamba está `finalizada` THEN sistema SHALL rechazar nuevas adendas y novedades (400).
5. WHEN un participante registra una novedad (tipo + descripción) THEN sistema SHALL guardarla con fecha y notificar a la contraparte.
6. WHEN cualquiera de las partes pasa la Chamba a `pausada` THEN sistema SHALL guardar el `estado_previo` y notificar.
7. WHEN se reanuda desde `pausada` THEN sistema SHALL restaurar el estado previo sin revalidar GPS ni hitos cumplidos.

**CU-43.1 Registrar adenda (Actores: Solicitante, PDS)**
- Flujo principal: 1. Participante describe el trabajo extra y su costo/tiempo. 2. Sistema lo agrega al expediente y notifica. 3. El solicitante puede editar cobertura/perfil requerido o eliminarla.
- Alterno: 1a. El pds propone trabajo de otro perfil → queda como sugerencia.

**CU-43.2 Reportar novedad / pánico (Actores: Solicitante, PDS)**
- Flujo principal: 1. Participante registra la novedad. 2. Sistema notifica a la contraparte. 3. Si es grave, pausa la Chamba (`PATCH /estado` → `pausada`).
- Alterno: 3a. Resuelta la incidencia, cualquiera reanuda → vuelve al estado previo.

> **Nota:** registrar una novedad **no pausa** automáticamente la Chamba; la pausa es una transición de estado explícita. · **Trazabilidad:** RF-53, RF-54.

---

## RF-55 / RF-56: Chamba — cierre, evidencia de salida y validación de habilidades (Hito 4)

**HU-44:** Como pds, quiero solicitar el cierre con evidencia final; y como solicitante, quiero revisar la entrega y validar las habilidades demostradas, para cerrar el trabajo con transparencia.

**Criterios de Aceptación:**
1. WHEN el pds registra evidencia de salida THEN sistema SHALL aceptarla solo en `en_ejecucion` o `pendiente_validacion`.
2. WHEN el pds solicita `pendiente_validacion` THEN sistema SHALL exigir **al menos una evidencia de salida**; sin ella → 400.
3. IF quien solicita el cierre no es el pds THEN sistema SHALL responder 403.
4. WHEN pasa a `pendiente_validacion` THEN sistema SHALL registrar `fecha_solicitud_cierre` y notificar al solicitante.
5. WHEN el solicitante valida (`POST /validacion`) THEN sistema SHALL guardar la lista de habilidades demostradas y `fecha_validacion`, solo en estado `pendiente_validacion` y solo por el solicitante.

**CU-44.1 Solicitar cierre (Actor: PDS)**
- Flujo principal: 1. Sube foto/360° de la obra terminada. 2. Registra evidencia de salida. 3. Solicita cierre → `pendiente_validacion`.
- Alterno: 3a. Sin evidencia final → error.

**CU-44.2 Revisar y validar habilidades (Actor: Solicitante)**
- Flujo principal: 1. Inspecciona la entrega. 2. Marca las habilidades demostradas. 3. Sistema guarda la validación.
- Alterno: 2a. Estado distinto de `pendiente_validacion` → 400.

> **Trazabilidad:** RF-55, RF-56.

---

## RF-57 / RF-58: Chamba — pago directo dual y calificación final (Hitos 5–6)

**HU-45:** Como solicitante y pds, quiero confirmar el pago directo por separado y que el solicitante califique al finalizar, para cerrar la Chamba con respaldo de ambas partes.

**Criterios de Aceptación:**
1. WHEN una parte confirma el pago (`POST /chambas/<id>/pago`) THEN sistema SHALL marcar su check-in (solicitante o prestador) y opcionalmente el `monto_final`.
2. WHEN ambas partes confirman THEN sistema SHALL marcar `pago_directo_confirmado = true`.
3. WHEN el solicitante pasa a `liquidacion_confirmada` THEN sistema SHALL exigir `pago_directo_confirmado`; si no → 400. Solo el solicitante puede hacerlo.
4. WHEN el solicitante califica (`POST /calificacion`) THEN sistema SHALL guardar estrellas, comentario y habilidades (si no se envían se conservan las validadas en Hito 4) y pasar a `finalizada`.
5. IF la calificación la envía un usuario que no es el solicitante, o el estado no es `liquidacion_confirmada` THEN sistema SHALL rechazarla.

**CU-45.1 Confirmar pago directo (Actores: Solicitante, PDS)**
- Flujo principal: 1. El solicitante paga al pds fuera de la plataforma. 2. Cada parte confirma su check-in. 3. Con ambos check-ins el sistema habilita la liquidación.
- Alterno: 3a. Solo una parte confirma → se mantiene pendiente.

**CU-45.2 Liquidar y calificar (Actor: Solicitante)**
- Flujo principal: 1. Confirma liquidación. 2. Califica (1–5) y comenta. 3. Chamba `finalizada`.

> **Brecha conocida:** la calificación de la Chamba (`rating_estrellas`) es independiente y **no recalcula** `Profile.calificacion_promedio` (D-08). · **Trazabilidad:** RF-57, RF-58.

---

## RF-59 / RF-60: Marañas (rebusques)

**HU-46:** Como solicitante con una Chamba en curso, quiero derivar un trabajo extra (adenda) como **Maraña** a otros pds, para resolver imprevistos sin frenar la obra.

**Criterios de Aceptación:**
1. WHEN el solicitante lanza una Maraña desde una adenda (`POST /chambas/<id>/marana`) THEN sistema SHALL crearla `publicado`, mover el `monto_extra` de la adenda a la Maraña y marcar la adenda como `derivada`.
2. IF la adenda ya está derivada, no existe, o la Chamba está `finalizada` THEN sistema SHALL rechazar (400); si quien lanza no es el solicitante → 403.
3. WHEN un pds publica su postulación (`POST /maranas/<id>/ofertas`) THEN sistema SHALL registrar monto y mensaje y notificar al solicitante.
4. IF el pds ya tiene una postulación activa, o la Maraña es propia, o ya no está `publicado` THEN sistema SHALL rechazar.
5. WHEN se responde una postulación (`POST /maranas/<id>/responder`: `aceptar`, `rechazar`, `contraofertar`, `aceptar_contraoferta`) THEN sistema SHALL actualizar la negociación; al aceptar sistema SHALL asignar la Maraña y rechazar las demás postulaciones.
6. WHEN el pds asignado completa (`/estado: completar`) THEN estado `completado`; WHEN el solicitante cancela THEN `cancelado`.
7. WHEN ambas partes confirman el pago (`/pago`, check-in dual) THEN sistema SHALL pasar la Maraña a `pagado`.
8. WHEN un pds consulta el feed (`GET /maranas/`) THEN sistema SHALL listar marañas publicadas con filtro por categoría.

**CU-46.1 Lanzar maraña (Actor: Solicitante)**
- Flujo principal: 1. Registra adenda cubierta por otro perfil. 2. Lanza la Maraña con título, categoría, descripción y presupuesto (por defecto el `monto_extra`). 3. Aparece en el feed de pds.
- Alterno: 1a. Adenda ya derivada → error.

**CU-46.2 Postularse y negociar (Actores: PDS, Solicitante)**
- Flujo principal: 1. El pds propone monto y mensaje. 2. El solicitante acepta, rechaza o contraoferta. 3. Al aceptar, la Maraña queda `asignado`. 4. El pds completa; ambos confirman pago → `pagado`.

> **Brecha conocida:** `GET /maranas/<id>` no verifica visibilidad (R-07). · **Trazabilidad:** RF-59, RF-60.

---

## RF-31 / RF-33 a RF-39: Comerciante — rol y gestión de negocio

**HU-47:** Como comerciante (rol `merchant`), quiero registrar y administrar mi negocio, para ser visible en la plataforma.

**Criterios de Aceptación:**
1. WHEN un usuario se registra eligiendo `merchant` THEN sistema SHALL crear cuenta con ese rol.
2. WHEN un merchant crea un negocio (`POST /negocios/`) THEN sistema SHALL generar un `slug` único (sufijo temporal si hay duplicado), crear la geometría PostGIS desde latitud/longitud y crear 7 horarios por defecto **cerrados**.
3. IF el usuario no es `merchant` THEN sistema SHALL responder 403 al crear un negocio.
4. WHEN el dueño (o un admin/superadmin) actualiza o elimina el negocio THEN sistema SHALL permitirlo; cualquier otro usuario → 403.
5. WHEN se actualizan horarios (`PUT /horarios`) THEN sistema SHALL guardar apertura/cierre por día.
6. WHEN se agrega una imagen por URL o se sube a MinIO (`/imagenes/upload`) THEN sistema SHALL validar tipo (jpg/png/webp), tamaño ≤ 5 MB y máximo 20 imágenes por negocio.
7. WHEN se elimina una imagen por índice THEN sistema SHALL reasignar la galería.
8. WHEN el merchant sube documentos KYC THEN sistema SHALL aplicar HU-52 con el catálogo de rol `merchant`.

**CU-47.1 Crear negocio (Actor: Merchant)**
- Flujo principal: 1. Completa nombre, categoría, ubicación y datos de contacto. 2. Sistema crea negocio con horarios cerrados. 3. Configura horarios e imágenes.
- Alterno: 1a. Rol distinto de merchant → 403.

> **Por confirmar:** RF-35 (activar negocio) y RF-43..46 (recibir solicitudes, responder, gestionar ofertas): no existe endpoint dedicado de activación (el estado se modifica por `PUT`), y `POST /solicitudes/<id>/ofertas` exige rol `pds`. Ver [Riesgos Conocidos §C](../Arquitectura/auditoria/Riesgos_Conocidos.md). · **Trazabilidad:** RF-31, RF-33–39.

---

## RF-47 / RF-48: Directorio público de negocios

**HU-48:** Como usuario, quiero explorar negocios en un mapa y ver su detalle, calificarlos y reportarlos, para encontrar comercios confiables.

**Criterios de Aceptación:**
1. WHEN se consulta el listado (`GET /negocios/`) THEN sistema SHALL mostrar solo negocios `activo` con filtros de categoría, verificado, calificación mínima, texto y paginación (20 por página).
2. WHEN se consulta el mapa (`GET /negocios/mapa`) con `lat`, `lng`, `radio` (km, def. 10) THEN sistema SHALL devolver pins y clusters por celda de ~0,01° con indicador abierto/cerrado.
3. WHEN se busca (`/buscar`) THEN sistema SHALL exigir ≥ 2 caracteres y buscar en nombre, descripción, categorías y palabras clave.
4. WHEN se consulta por ID o `slug` THEN sistema SHALL devolver el detalle público (sin autenticación).
5. WHEN un usuario autenticado califica (`/rating`) THEN sistema SHALL permitir una calificación por usuario y recalcular promedio y total.
6. WHEN un usuario autenticado reporta (`/reportar`) THEN sistema SHALL registrar el reporte `abierto` y crear un **ticket de soporte** automático de prioridad alta.

**CU-48.1 Explorar negocios (Actor: Cualquier usuario)**
- Flujo principal: 1. Abre el mapa. 2. Ve pins/clusters. 3. Abre el detalle por slug.
- Alterno: 3a. Negocio inexistente → 404.

> **Brecha conocida:** cualquier usuario autenticado, incluido el dueño, puede calificar (R-11). · **Trazabilidad:** RF-47, RF-48.

---

## Sin RF previo: Comerciante — dashboard, métodos de pago y preferencias

**HU-49:** Como comerciante, quiero ver estadísticas de mi negocio y gestionar mis métodos de pago y preferencias de notificación, para operar con control.

**Criterios de Aceptación:**
1. WHEN el dueño consulta `GET /negocios/<id>/stats` THEN sistema SHALL devolver promedio, total y distribución de estrellas, solicitudes de la categoría, contratos completados e ingresos de pagos completados.
2. WHEN se consulta el campo `visitas_perfil` THEN sistema SHALL devolver 0 (marcador de posición, sin *tracking*).
3. WHEN el merchant gestiona métodos de pago (`/merchant/payment-methods`) THEN sistema SHALL listar activos (principal primero), agregar y desactivar (borrado lógico).
4. WHEN el merchant consulta o actualiza preferencias (`/merchant/preferences`) THEN sistema SHALL persistirlas; los endpoints exigen rol `merchant`.

**CU-49.1 Consultar dashboard (Actor: Merchant)**
- Flujo principal: 1. Abre el dashboard. 2. Sistema calcula métricas. 3. Visualiza calificaciones, solicitudes, contratos e ingresos.

> **Nota:** las "solicitudes en zona" se calculan por **categoría del negocio**, no por cercanía; los contratos e ingresos se cuentan por el `user_id` del dueño. · **Trazabilidad:** Sin RF previo.

---

## RF-67 / RF-68: Anuncios laborales — publicación y feed

**HU-50:** Como comerciante, quiero publicar anuncios laborales no vinculantes, para atraer prestadores a mi negocio.

**Criterios de Aceptación:**
1. WHEN un `merchant` publica un anuncio THEN sistema SHALL crearlo `publicado` con título, descripción, categoría, ubicación, lat/lng y vacantes.
2. IF el usuario no es `merchant` THEN sistema SHALL rechazar la publicación.
3. WHEN cualquier rol autenticado consulta el feed (`GET /anuncios/`) THEN sistema SHALL listar anuncios publicados (visibles en el mapa).
4. WHEN el dueño consulta sus anuncios THEN sistema SHALL mostrar todos con `postulaciones_count`; otros usuarios solo ven los publicados.
5. WHEN el dueño cierra o reabre un anuncio (`PATCH /estado`) THEN sistema SHALL alternar `publicado`/`cerrado`.
6. WHEN se consulta el detalle THEN sistema SHALL mostrar las postulaciones solo al dueño.

**CU-50.1 Publicar anuncio (Actor: Merchant)**
- Flujo principal: 1. Completa el formulario. 2. Sistema publica el anuncio. 3. Aparece en el feed y mapa.
- Alterno: 1a. Rol no merchant → rechazo.

> **Trazabilidad:** RF-67, RF-68. Ningún anuncio crea contratos ni chambas.

---

## RF-69: Anuncios laborales — postulación y gestión de contacto

**HU-51:** Como pds, quiero postularme a un anuncio dejando mis datos de contacto, para que el negocio me contacte.

**Criterios de Aceptación:**
1. WHEN un pds se postula (`POST /anuncios/<id>/postulaciones`) THEN sistema SHALL registrar la postulación con contacto por defecto (teléfono y correo del pds) y notificar al negocio.
2. IF el pds ya se postuló, o el anuncio es propio o está cerrado THEN sistema SHALL rechazar.
3. WHEN el dueño lista las postulaciones THEN sistema SHALL mostrarlas solo a él.
4. WHEN el dueño marca una postulación `contactado` o `descartado` THEN sistema SHALL actualizar el estado, notificar al pds y emitir un evento Socket.IO.

**CU-51.1 Postularse y ser contactado (Actores: PDS, Merchant)**
- Flujo principal: 1. El pds se postula. 2. El negocio revisa. 3. Marca `contactado` y el pds recibe notificación.
- Alterno: 3a. `descartado` → notificación al pds.

> **Trazabilidad:** RF-69.

---

## RF-12 / RF-40 / RF-41: KYC por rol — envío de documentos

**HU-52:** Como pds, solicitante o comerciante, quiero subir los documentos de verificación que exige mi rol, para obtener la insignia de verificado.

**Criterios de Aceptación:**
1. WHEN el usuario consulta `GET /kyc/documentos-requeridos` THEN sistema SHALL devolver el catálogo de su rol.
2. **PDS — obligatorios:** documento de identidad, prueba de vida, comprobante de residencia, antecedentes judiciales, RNMC, antecedentes Procuraduría y Contraloría, certificación bancaria (multi-instancia). **Opcionales:** validación profesional, salud y seguridad, certificado laboral.
3. **Solicitante — obligatorios:** documento de identidad, prueba de vida, verificación de contacto (OTP). **Comerciante:** catálogo propio (`seed_kyc_merchant.py`).
4. WHEN el usuario envía un documento (`POST /kyc/documentos`, solo `pds`/`solicitante`/`merchant`) THEN sistema SHALL crear o reemplazar (upsert) con estado `enviado`.
5. IF el documento es multi-instancia THEN sistema SHALL exigir el nombre de `instancia`.
6. WHEN el usuario consulta `mis-documentos` o `documentos/mios` THEN sistema SHALL unir el catálogo con el estado de cada documento.

**CU-52.1 Subir documento KYC (Actor: Usuario)**
- Flujo principal: 1. Elige el documento requerido. 2. Adjunta el archivo (MVP: base64). 3. Estado `enviado`, pendiente de revisión.
- Alterno: 1a. Documento no pertenece a su rol → rechazo. 2a. Falta `instancia` → 400.

> **Nota:** `Profile.verificado = true` solo cuando **todos** los documentos obligatorios del rol tienen al menos una instancia aprobada (HU-53). · **Trazabilidad:** RF-12, RF-40, RF-41.

---

## RF-12 / RF-42: KYC — revisión por verificador/admin

**HU-53:** Como verificador o administrador, quiero revisar y aprobar o rechazar los documentos KYC de mi región, para garantizar la identidad de los usuarios.

**Criterios de Aceptación:**
1. WHEN un verificador, admin, superadmin o soporte consulta `GET /kyc/pendientes` THEN sistema SHALL listar documentos `enviado` **filtrados por la región del revisor** (el superadmin ve todo).
2. WHEN un verificador, admin o superadmin resuelve (`POST /kyc/documentos/<id>/verificar`) THEN sistema SHALL marcar `aprobado` o `rechazado` y recalcular `Profile.verificado`.
3. IF se rechaza THEN sistema SHALL permitir reenvío del documento (upsert).
4. WHEN existe una verificación pendiente en el panel admin THEN sistema SHALL permitir aprobarla o rechazarla con motivo (`/admin/verifications/<id>/approve|reject`).

**CU-53.1 Revisar documentos (Actor: Verificador)**
- Flujo principal: 1. Abre la bandeja de pendientes de su región. 2. Revisa el documento. 3. Aprueba o rechaza.
- Alterno: 3a. Rechazo → el usuario puede reenviar.

> **Brecha conocida:** la alerta al admin por SLA de 48 h está en `TODO` (R-18). El rol `soporte` puede ver pendientes pero **no** resolver. · **Trazabilidad:** RF-12, RF-42.

---

## RF-61 / RF-62 / RF-63: Habilidades — catálogo, niveles y quiz

**HU-54:** Como pds, quiero ver el catálogo de oficios y certificar niveles mediante quiz o certificado, para demostrar mi competencia.

**Criterios de Aceptación:**
1. WHEN un usuario consulta el catálogo (`GET /habilidades`) THEN sistema SHALL mostrar habilidades activas con su ruta de niveles.
2. WHEN un nivel es de tipo `quiz` y el pds consulta las preguntas THEN sistema SHALL ocultar las respuestas correctas.
3. WHEN el pds presenta el quiz THEN sistema SHALL exigir responder todas las preguntas y calificar al instante; se aprueba con **≥ 80 %** de aciertos (`UMBRAL_QUIZ = 0.8`).
4. IF el intento no aprueba THEN sistema SHALL permitir reintentar sin bloqueo.
5. WHEN el nivel es de tipo `certificacion` THEN sistema SHALL registrarlo al subir un archivo (base64 → MinIO) o una URL.
6. WHEN el pds consulta `mis-niveles` THEN sistema SHALL listar sus niveles certificados.

**CU-54.1 Aprobar nivel por quiz (Actor: PDS)**
- Flujo principal: 1. Abre el quiz del nivel. 2. Responde todas las preguntas. 3. Sistema califica; si aprueba registra el nivel.
- Alterno: 3a. No alcanza el umbral → mensaje y reintento.

> **Brecha conocida:** el mensaje y el docstring indican 70 % pero el código aplica 80 %; `POST`/`DELETE` del catálogo no tienen control de rol (R-09) y la certificación por documento no se revisa (R-10). · **Trazabilidad:** RF-61, RF-62, RF-63.

---

## RF-64 / RF-65 / RF-66: Habilidades — endosos, certificaciones técnicas y progresión

**HU-55:** Como solicitante, quiero endosar las competencias de un pds; y como pds, quiero cargar mi formación técnica y ver mi progresión de nivel, para consolidar mi reputación profesional.

**Criterios de Aceptación:**
1. WHEN el solicitante de un contrato `completado` endosa (`POST /habilidades/endosar`) THEN sistema SHALL registrar el endoso a nombre del pds; solo el solicitante y solo en contratos completados.
2. IF la competencia no pertenece al oficio, o ya fue endosada en ese contrato THEN sistema SHALL rechazar (400/409).
3. WHEN el pds carga una certificación técnica (institución, título, año, código) THEN sistema SHALL guardarla `en_revision` pendiente de un verificador.
4. WHEN el pds consulta `GET /habilidades/progreso` THEN sistema SHALL calcular el nivel 1–5 por oficio: N1 Novato; N2 Conocedor (≥1 quiz, ≥3 trabajos, ≥4,0); N3 Práctico (≥1 quiz, ≥15, ≥4,5); N4 Maestro (quiz + título verificado, ≥35, ≥4,7); N5 Experto (quiz + título verificado, ≥70, ≥4,8).

**CU-55.1 Consultar progresión (Actor: PDS)**
- Flujo principal: 1. Abre su progreso. 2. Sistema cruza quizzes, certificaciones verificadas, trabajos completados y calificación. 3. Muestra nivel por oficio.

> **Brecha conocida:** `endosos` se devuelve fijo en 0 (no entra en la progresión); no se identificó endpoint para que el verificador resuelva las certificaciones técnicas (por confirmar). · **Trazabilidad:** RF-64, RF-65, RF-66.

---

## Sin RF previo: Verificación en dos pasos (2FA)

**HU-56:** Como usuario, quiero activar la verificación en dos pasos, para proteger mi cuenta.

**Criterios de Aceptación:**
1. WHEN el usuario consulta o cambia (`GET/PUT /auth/2fa`) THEN sistema SHALL mostrar o actualizar el estado de 2FA.
2. WHEN un usuario con 2FA inicia sesión THEN sistema SHALL responder `requires_2fa` y `expires_in` (300 s) **sin emitir tokens**.
3. WHEN el usuario tiene teléfono THEN sistema SHALL enviar un código de 6 dígitos por SMS (Onurix); en desarrollo/pruebas devuelve `dev_code`.
4. WHEN el usuario envía email y código a `POST /auth/2fa/verify` THEN sistema SHALL emitir `access_token` y `refresh_token` si es correcto.
5. IF el código expira (5 min) o se superan **5 intentos** THEN sistema SHALL invalidar el desafío.

**CU-56.1 Iniciar sesión con 2FA (Actor: Usuario)**
- Flujo principal: 1. Ingresa credenciales. 2. Recibe el código. 3. Lo ingresa. 4. Obtiene sesión.
- Alterno: 3a. Código incorrecto → reintento (máx. 5).

> **Brecha conocida:** los desafíos se guardan en memoria (R-13). · **Trazabilidad:** Sin RF previo (RF-01 ampliado).

---

## Sin RF previo: Verificación de teléfono por OTP

**HU-57:** Como usuario nuevo, quiero verificar mi celular con un código, para confirmar mi contacto.

**Criterios de Aceptación:**
1. WHEN se solicita `POST /auth/otp/send` (público) THEN sistema SHALL normalizar el número a +57, generar un código de 6 dígitos y enviarlo.
2. WHEN se envía `POST /auth/otp/verify` con el código correcto THEN sistema SHALL confirmarlo y eliminarlo.
3. IF el código expira (5 min) o supera 5 intentos THEN sistema SHALL invalidarlo.

**CU-57.1 Verificar celular (Actor: Usuario)**
- Flujo principal: 1. Ingresa su celular. 2. Recibe el SMS. 3. Digita el código. 4. Sistema confirma.
- Alterno: 3a. Código vencido → solicita uno nuevo.

> **Brecha conocida:** almacén OTP en memoria (R-13). · **Trazabilidad:** Sin RF previo; alimenta el documento KYC `verificacion_contacto`.

---

## Sin RF previo: Verificación de correo electrónico

**HU-58:** Como usuario, quiero verificar mi correo, para confirmar mi identidad de contacto.

**Criterios de Aceptación:**
1. WHEN un usuario autenticado solicita `POST /auth/send-verification` THEN sistema SHALL generar un token con vigencia de 24 h.
2. WHEN se envía el token a `POST /auth/verify-email` THEN sistema SHALL marcar `email_verificado`.
3. WHEN el usuario consulta `GET /auth/email-status` THEN sistema SHALL informar el estado.

**CU-58.1 Verificar correo (Actor: Usuario)**
- Flujo principal: 1. Solicita verificación. 2. Abre el enlace con token. 3. Sistema marca el correo como verificado.

> **Brecha conocida:** **no se envía el correo** (TODO) y los tokens son en memoria (R-13, R-14). · **Trazabilidad:** Sin RF previo.

---

## Sin RF previo: Recuperación y cambio de contraseña

**HU-59:** Como usuario, quiero recuperar o cambiar mi contraseña, para recuperar el acceso a mi cuenta.

**Criterios de Aceptación:**
1. WHEN se solicita `POST /auth/forgot-password` THEN sistema SHALL responder siempre el mismo mensaje (no revela si el correo existe) y generar un token de 1 h; límite de 3 solicitudes por hora por IP.
2. WHEN se envía `POST /auth/reset-password` con token válido THEN sistema SHALL cambiar la contraseña e invalidar el token.
3. IF el token es inválido, usado o expirado THEN sistema SHALL responder 400.
4. WHEN un usuario autenticado cambia su contraseña (`/auth/change-password`) THEN sistema SHALL exigir la contraseña actual.

**CU-59.1 Recuperar contraseña (Actor: Usuario)**
- Flujo principal: 1. Ingresa su correo. 2. Recibe el enlace. 3. Define nueva contraseña.
- Alterno: 3a. Token vencido → solicita otro.

> **Brecha conocida:** no se envía el correo (TODO) y los tokens son en memoria (R-13, R-14). · **Trazabilidad:** Sin RF previo (complementa HU-01).

---

## Sin RF previo: Sesión, refresh rotativo y revocación

**HU-60:** Como usuario, quiero mantener mi sesión de forma segura, para no iniciar sesión constantemente sin comprometer la cuenta.

**Criterios de Aceptación:**
1. WHEN el usuario inicia sesión THEN sistema SHALL emitir `access_token` (30 min) y `refresh_token` (7 días).
2. WHEN se usa `POST /auth/refresh` THEN sistema SHALL emitir un nuevo access y **rotar** el refresh.
3. WHEN un admin cambia el rol o el estado de una cuenta THEN sistema SHALL incrementar `role_version` y revocar los tokens vigentes.
4. WHEN el usuario consulta `GET /auth/me` THEN sistema SHALL devolver su perfil.

**CU-60.1 Renovar sesión (Actor: Usuario)**
- Flujo principal: 1. El access expira. 2. El cliente usa el refresh. 3. Recibe un par nuevo.
- Alterno: 2a. Refresh inválido/revocado → vuelve al login.

> **Nota:** el docstring de login dice "JWT 8h"; la configuración real es 30 min (D-24). · **Trazabilidad:** Sin RF previo.

---

## RF-70 / RF-72 / RF-74: División regional — catálogo y derivación

**HU-61:** Como plataforma, quiero asignar a cada usuario una región según su ubicación, para operar y moderar por zonas sin doble conteo.

**Criterios de Aceptación:**
1. WHEN un usuario autenticado consulta `GET /regions` THEN sistema SHALL listar las regiones.
2. WHEN se consulta `GET /regions/detectar` con un texto de ubicación THEN sistema SHALL derivar la región por departamento/ciudad (p. ej. "Cesar" → Caribe).
3. WHEN se crea una solicitud, se avanza el onboarding con zona o se ejecuta el reindex THEN sistema SHALL asignar la región del usuario.
4. WHEN un caso involucra a varias regiones THEN sistema SHALL asignarlo a la **región del solicitante** (anti doble-conteo) para contratos, pagos y disputas.
5. WHEN se asigna una región THEN el personal interno **no** se reasigna automáticamente (lo decide el superadmin).

**CU-61.1 Derivar región (Actor: Sistema)**
- Flujo principal: 1. Usuario indica su zona. 2. Sistema detecta la región. 3. La región queda en el usuario.
- Alterno: 2a. Texto sin coincidencia → sin región (por confirmar el valor de respaldo).

> **Trazabilidad:** RF-70, RF-72, RF-74.

---

## RF-71 / RF-73: Panel Admin — usuarios y personal regional

**HU-62:** Como administrador regional, quiero gestionar los usuarios y el personal de mi región, para mantener la operación local.

**Criterios de Aceptación:**
1. WHEN el admin lista usuarios (`GET /admin/users`) THEN sistema SHALL filtrar por rol, estado y texto, con máximo 50, **limitado a su región** (el superadmin ve todo).
2. IF el usuario consultado es de otra región THEN sistema SHALL responder 404.
3. WHEN el admin cambia el rol (`PATCH /admin/users/<id>/role`) THEN sistema SHALL incrementar `role_version`, registrar auditoría; **solo el superadmin** asigna `admin` o `superadmin`.
4. WHEN el admin suspende, bloquea o reactiva una cuenta THEN sistema SHALL actualizar el estado, revocar tokens y auditar.
5. WHEN el admin crea personal (`POST /admin/staff`) THEN sistema SHALL permitir solo `verificador` o `soporte` dentro de su región.
6. WHEN consulta `GET /admin/stats/overview` THEN sistema SHALL devolver usuarios, solicitudes, contratos, ingresos y disputas abiertas de su región.

**CU-62.1 Gestionar usuario (Actor: Admin regional)**
- Flujo principal: 1. Busca al usuario. 2. Cambia su estado o rol. 3. Sistema audita y revoca sesiones.
- Alterno: 2a. Rol no permitido → 403.

> **Trazabilidad:** RF-71, RF-73.

---

## RF-73: Panel Admin — moderación de contenido y contratos

**HU-63:** Como administrador, quiero moderar solicitudes, contratos y calificaciones, para mantener la calidad de la plataforma.

**Criterios de Aceptación:**
1. WHEN el admin modera una solicitud (`PATCH /admin/solicitudes/<id>/moderate`) THEN sistema SHALL aplicar `approve`, `reject` o `hide`.
2. WHEN el admin modera un contrato (`PATCH /admin/contracts/<id>/moderate`) THEN sistema SHALL aplicar `cancel` o `flag`.
3. WHEN el admin modera una calificación (`PATCH /admin/content/<id>/moderate`) THEN sistema SHALL ocultarla (`reportado = true`) o eliminarla.
4. WHEN el admin lista solicitudes, contratos o calificaciones THEN sistema SHALL limitarlo a su región (máx. 50).

**CU-63.1 Ocultar solicitud (Actor: Admin)**
- Flujo principal: 1. Localiza la solicitud. 2. La oculta. 3. Deja de aparecer en el listado.
- Alterno: 3a. Falla de visibilidad pública (R-01).

> **Brecha conocida:** `GET /solicitudes/` público no excluye las ocultas (R-01). · **Trazabilidad:** RF-73.

---

## Sin RF previo: Disputas de contrato

**HU-64:** Como participante de un contrato, quiero abrir una disputa; y como admin, quiero resolverla, para manejar desacuerdos.

**Criterios de Aceptación:**
1. WHEN un participante crea una disputa (`POST /contracts/<id>/disputes`) THEN sistema SHALL registrarla `abierta`.
2. IF el contrato está `completado` o `cancelado`, o ya hay una disputa abierta THEN sistema SHALL rechazarla.
3. WHEN un participante consulta `GET /contracts/<id>/disputes` o `/my-disputes` THEN sistema SHALL listar sus disputas.
4. WHEN el admin consulta `GET /admin/disputes` THEN sistema SHALL listar `abierta` por defecto, limitado a su región, con detalle de contrato y pago.
5. WHEN el admin resuelve (`POST /admin/disputes/<id>/resolve`) THEN sistema SHALL **registrar** la resolución.

**CU-64.1 Abrir y resolver disputa (Actores: Participante, Admin)**
- Flujo principal: 1. Participante abre la disputa. 2. Admin revisa. 3. Registra la resolución.
- Alterno: 1a. Contrato completado → rechazo.

> **Brecha conocida:** la resolución es solo registro, sin retención de fondos (R-17); el rechazo de un hito no abre disputa (D-19). · **Trazabilidad:** Sin RF previo (ver HU-07 criterio 5).

---

## Sin RF previo: Tickets de soporte

**HU-65:** Como usuario, quiero crear tickets de soporte; y como personal de soporte, quiero gestionarlos, para resolver incidencias.

**Criterios de Aceptación:**
1. WHEN un usuario autenticado crea un ticket (`POST /tickets/`) THEN sistema SHALL guardar asunto y cuerpo en estado inicial.
2. WHEN `admin`, `superadmin` o `soporte` lista tickets THEN sistema SHALL filtrar por estado, máximo 50, limitado a su región.
3. WHEN actualiza un ticket THEN sistema SHALL modificar estado, asignación y prioridad.
4. WHEN se reporta un negocio THEN sistema SHALL crear un ticket automático de prioridad alta.

**CU-65.1 Atender ticket (Actor: Soporte)**
- Flujo principal: 1. Abre la lista. 2. Asigna y cambia estado. 3. Ticket resuelto.

> **Trazabilidad:** Sin RF previo.

---

## Sin RF previo: Superadmin — personal interno, overrides y auditoría

**HU-66:** Como superadmin, quiero gestionar el personal interno y forzar acciones excepcionales con trazabilidad, para garantizar el control del sistema.

**Criterios de Aceptación:**
1. WHEN el superadmin lista o crea usuarios internos (`/superadmin/admins`) THEN sistema SHALL permitir los roles `admin`, `soporte` y `verificador`.
2. WHEN actualiza un admin THEN sistema SHALL modificar nombre, rol y estado.
3. WHEN elimina un admin (`DELETE`) THEN sistema SHALL **desactivarlo** (`banned`), no borrarlo.
4. WHEN aplica un override a un usuario THEN sistema SHALL ejecutar `reactivate` o `suspend`; sobre un contrato, `complete` o `cancel`.
5. WHEN consulta `GET /superadmin/audit-logs` THEN sistema SHALL listar logs filtrables por actor y tipo de entidad (por defecto 100), con detalle `before/after`.

**CU-66.1 Auditar acción (Actor: Superadmin)**
- Flujo principal: 1. Filtra por entidad. 2. Abre un log. 3. Compara estado anterior y posterior.

> **Por confirmar:** qué acciones, además de rol y estado de usuario, escriben auditoría. · **Trazabilidad:** Sin RF previo.

---

## RF-75: Superadmin — configuración global, flags, IA, T&C y reindex

**HU-67:** Como superadmin, quiero ajustar la configuración global del sistema, para adaptar su comportamiento sin redesplegar.

**Criterios de Aceptación:**
1. WHEN consulta o actualiza `/superadmin/config` THEN sistema SHALL leer o escribir `SystemConfig` convirtiendo el valor según `value_type`.
2. WHEN lista o conmuta `/superadmin/flags` THEN sistema SHALL activar o desactivar la bandera por clave.
3. WHEN consulta o actualiza `/superadmin/ai/params` THEN sistema SHALL leer o escribir `ai_weights`.
4. WHEN publica una versión de T&C (`POST /superadmin/legal/tyc`) THEN sistema SHALL incrementar la versión vigente.
5. WHEN ejecuta `POST /superadmin/regions/reindex` THEN sistema SHALL reasignar la región de los usuarios según su ubicación.

**CU-67.1 Activar feature flag (Actor: Superadmin)**
- Flujo principal: 1. Lista flags. 2. Activa uno. 3. El sistema lo aplica.

> **Brecha conocida:** el registro usa `TYC_VERSION = "1.0"` fija, aunque el superadmin publique nuevas versiones (D-07). · **Trazabilidad:** RF-75.

---

## Sin RF previo: Onboarding guiado

**HU-68:** Como usuario nuevo, quiero completar un onboarding guiado, para dejar mi perfil listo.

**Criterios de Aceptación:**
1. WHEN el usuario consulta `GET /onboarding/status` THEN sistema SHALL devolver completado, paso y perfil (creando el perfil si no existe).
2. WHEN guarda un paso (`PATCH /onboarding/step`) THEN sistema SHALL conservar el mayor paso alcanzado y aplicar habilidades, categorías, experiencia y zona.
3. WHEN se guarda la zona THEN sistema SHALL asignar la región del usuario.
4. WHEN el perfil tiene al menos una categoría o habilidad THEN sistema SHALL marcarlo `perfil_completo`.
5. WHEN el usuario completa (`POST /onboarding/complete`) THEN sistema SHALL marcar `onboarding_completed`, fijar el paso en 999 y evaluar insignias.

**CU-68.1 Completar onboarding (Actor: Usuario)**
- Flujo principal: 1. Elige categorías y habilidades. 2. Indica experiencia y zona. 3. Finaliza y obtiene perfil completo.

> **Trazabilidad:** RF-32 (aplicado a todos los roles; por confirmar el alcance para comerciante) y HU-02.

---

## Sin RF previo: Preferencias del usuario

**HU-69:** Como usuario, quiero configurar idioma, tema y notificaciones, para personalizar mi experiencia.

**Criterios de Aceptación:**
1. WHEN el usuario consulta `GET /users/me/preferences` THEN sistema SHALL devolver sus preferencias, creándolas por defecto.
2. WHEN las actualiza (`PUT`) THEN sistema SHALL modificar solo los campos enviados.
3. IF el usuario es comerciante THEN sistema SHALL ofrecer además `/merchant/preferences` restringido a ese rol.

**CU-69.1 Cambiar preferencias (Actor: Usuario)**
- Flujo principal: 1. Abre ajustes. 2. Cambia tema/idioma/avisos. 3. Se guardan.

> **Nota:** reutiliza el modelo `MerchantPreference` para todos los roles. · **Trazabilidad:** Sin RF previo.

---

## RF-08 (ampliado): Métodos de pago vinculados

**HU-70:** Como usuario, quiero vincular cuentas bancarias y elegir un método principal, para recibir mis retiros.

**Criterios de Aceptación:**
1. WHEN el usuario lista sus métodos (`GET /metodos-pago`) THEN sistema SHALL mostrar **primero la billetera virtual** (creada si no existe) con su saldo.
2. WHEN vincula una cuenta bancaria (banco + número) THEN sistema SHALL guardarla; la primera vinculada queda como principal.
3. WHEN marca un método como principal THEN sistema SHALL dejar el resto como no principal; solo el dueño puede hacerlo (403).
4. WHEN desvincula un método propio THEN sistema SHALL eliminarlo y reasignar el principal si era el principal.
5. IF el método es la billetera THEN sistema SHALL rechazar su eliminación (400).

**CU-70.1 Vincular cuenta (Actor: Usuario)**
- Flujo principal: 1. Ingresa banco y número. 2. Sistema la vincula. 3. La marca como principal.

> **Nota:** el retiro de fondos no transfiere dinero (D-01, R-15). · **Trazabilidad:** RF-08 (ampliado).

---

## Sin RF previo: Búsqueda de proveedores

**HU-71:** Como usuario, quiero buscar prestadores por texto, categoría, zona, calificación y verificación, para encontrar al más adecuado.

**Criterios de Aceptación:**
1. WHEN se consulta `GET /providers/search` THEN sistema SHALL devolver solo pds con estado `active`.
2. WHEN se aplican `q`, `categoria`, `zona`, `min_rating` o `verificado` THEN sistema SHALL filtrar.
3. WHEN hay resultados THEN sistema SHALL ordenarlos por calificación descendente y paginarlos.

**CU-71.1 Buscar prestadores (Actor: Usuario)**
- Flujo principal: 1. Escribe filtros. 2. Sistema lista pds. 3. Abre un perfil.

> **Brecha conocida:** el endpoint es público y devuelve el correo del pds (R-08). · **Trazabilidad:** Sin RF previo.

---

## RF-03 (ampliado): Perfil público, foto y portafolio visible

**HU-72:** Como usuario, quiero ver el perfil público de un pds con su calificación y portafolio, para evaluarlo antes de contratar.

**Criterios de Aceptación:**
1. WHEN se consulta `GET /users/<id>/profile` THEN sistema SHALL mostrar perfil público, calificación promedio y calificaciones recientes sin autenticación.
2. WHEN se consulta `GET /portfolio/pds/<id>` THEN sistema SHALL mostrar solo los ítems **aprobados** del portafolio.
3. WHEN el usuario sube o reemplaza su foto (`POST /users/me/foto-perfil`) o la elimina (`DELETE`) THEN sistema SHALL actualizar su avatar.
4. WHEN el pds gestiona su portafolio THEN sistema SHALL permitir subir, listar, consultar y eliminar ítems propios (HU-39).

**CU-72.1 Ver perfil de un pds (Actor: Solicitante)**
- Flujo principal: 1. Abre el perfil. 2. Ve calificación, insignias, Trust Score (HU-33) y portafolio. 3. Decide contratar.

> **Por confirmar:** exposición de `telefono` en perfiles públicos (HU-19). · **Trazabilidad:** RF-03, RF-02.

---

## RF-16 (ampliado): Notificaciones in-app

**HU-73:** Como usuario, quiero consultar y gestionar mis notificaciones, para no perder eventos importantes.

**Criterios de Aceptación:**
1. WHEN el usuario consulta `GET /notifications/` o `/notifications/me` THEN sistema SHALL listar sus notificaciones.
2. WHEN consulta `/no-leidas` THEN sistema SHALL devolver el conteo de no leídas.
3. WHEN marca una notificación como leída THEN sistema SHALL permitirlo solo al dueño (403 si no lo es).
4. WHEN marca todas como leídas THEN sistema SHALL actualizar todas las suyas.
5. WHEN ocurre un evento THEN sistema SHALL crear la notificación y emitir Socket.IO (ver HU-38).

**CU-73.1 Revisar notificaciones (Actor: Usuario)**
- Flujo principal: 1. Abre la campana. 2. Ve no leídas primero. 3. Marca leídas.

> **Brecha conocida:** no hay Web Push ni cola offline (D-15). · **Trazabilidad:** RF-16.

---

## RF-16 (ampliado): Chat 1:1

**HU-74:** Como usuario, quiero conversar en tiempo real con otro usuario, para coordinar servicios.

**Criterios de Aceptación:**
1. WHEN el usuario abre una conversación (`POST /chat/conversations` con `otro_usuario_id`) THEN sistema SHALL crear o devolver la existente.
2. WHEN lista conversaciones THEN sistema SHALL mostrar las suyas con el último mensaje.
3. WHEN consulta el historial o envía un mensaje THEN sistema SHALL permitirlo solo a participantes, persistir y difundir por Socket.IO (`message`).
4. WHEN marca como leídos THEN sistema SHALL actualizar los mensajes recibidos.

**CU-74.1 Enviar mensaje (Actor: Usuario)**
- Flujo principal: 1. Abre conversación. 2. Envía mensaje. 3. La contraparte lo recibe en tiempo real.

> **Brecha conocida:** cualquier usuario autenticado puede abrir chat con cualquier otro; el desbloqueo de HU-19 no aplica al chat (R-05). · **Trazabilidad:** RF-16.

---

## RF-17 (ampliado): Consulta pública de documentos legales

**HU-75:** Como visitante o usuario, quiero consultar los Términos y Condiciones y la Política de Datos, para conocer mis derechos y obligaciones.

**Criterios de Aceptación:**
1. WHEN se consulta `GET /legal/tyc` sin autenticación THEN sistema SHALL devolver la versión vigente de T&C.
2. WHEN se consulta `GET /legal/politica-datos` THEN sistema SHALL devolver la Política de Tratamiento de Datos (Habeas Data).
3. WHEN la web se visita THEN frontend SHALL ofrecer las rutas `/terminos`, `/privacidad` y `/autorizacion-kyc`.

**CU-75.1 Leer T&C (Actor: Visitante)**
- Flujo principal: 1. Abre el enlace en el registro. 2. Lee la versión vigente. 3. Acepta (HU-17).

> **Trazabilidad:** RF-17.

---

---

## Matriz de Trazabilidad Integral (HU-01 a HU-75)

| HU | RF | Módulo / Componente | Código Fuente Principal |
|---|---|---|---|
| HU-01 | RF-01 | Autenticación y Registro Segmentado | `controllers/auth.py`, `schemas/auth.py` |
| HU-02 | RF-02 | Perfil de Habilidades de Proveedor | `controllers/users.py`, `models/user.py` |
| HU-03 | RF-03 | Sistema de Reputación y Calificación | `controllers/solicitudes.py` |
| HU-04 | RF-04 | Publicación de Solicitudes | `controllers/solicitudes.py`, `models/solicitud.py` |
| HU-05 | RF-05 | Motor de Recomendación IA | `controllers/ai.py`, `ai/hybrid.py` |
| HU-06 | RF-06 | Visualización Panorámica 360° | `frontend/.../PanoViewer.tsx` |
| HU-07 | RF-07 | Gestión Contractual | `controllers/contracts.py`, `models/contract.py` |
| HU-08 | RF-08 | Pasarela de Pagos e Ingresos | `controllers/payments.py`, `services/payments.py` |
| HU-09 | RF-09 | Historial y Trazabilidad de Ingresos | `controllers/payments.py` |
| HU-10 | RF-10 | Alertas Operativas | `controllers/notifications.py` |
| HU-11 | RF-11 | Suscripciones y Planes | `controllers/subscriptions.py` |
| HU-12 | RF-12 | Verificación de Identidad | `controllers/kyc.py` |
| HU-13 | RF-13 | Certificado de Ingresos | `controllers/payments.py` |
| HU-14 | RF-14 | Servicios de Valor Agregado | `controllers/subscriptions.py` |
| HU-15 | RF-15 | Comisiones por Transacción | `services/payments.py`, `contracts.py` |
| HU-16 | RF-16 | Notificaciones en Tiempo Real | `controllers/notifications.py`, `socketio` |
| HU-17 | RF-17 | Marco Legal y Términos y Condiciones | `controllers/auth.py`, `data/tyc.py` |
| HU-18 | RNF-07 | Experiencia PWA | `frontend/vite.config.ts`, `manifest` |
| HU-19 | RF-22 | Desbloqueo Gradual de Información | `controllers/solicitudes.py`, `contracts.py` |
| HU-20 | RF-23 | Confirmación de Finalización | `controllers/contracts.py` |
| HU-21 | RF-24 | Gestión de Ofertas y Negociación | `controllers/ofertas.py` |
| HU-22 | RF-25 | Billetera Virtual | `controllers/wallet.py`, `services/wallet.py` |
| HU-23 | RF-26 | Modalidad de Cobro | `controllers/wallet.py`, `ofertas.py` |
| HU-24 | RF-27 | Sistema de Monedas | `controllers/wallet.py`, `services/wallet.py` |
| HU-25 | RF-28 | Precios Sugeridos por Categoría | `controllers/prices.py` |
| HU-26 | RF-29 | Hitos de Pago en Contratos | `controllers/wallet.py`, `tasks.py` |
| HU-27 | RF-30 | Dashboard Operativo PDS | `controllers/payments.py` |
| HU-28 | RF-30 | Dashboard Operativo Solicitante | `controllers/payments.py` |
| HU-29 | RF-25 | Estado Consolidado de Recursos | `controllers/wallet.py` |
| HU-30 | RF-ML-1 | Recomendación Geoespacial y ML | `controllers/ai.py` |
| HU-31 | RF-ML-2 | Experimentación A/B Testing | `controllers/ai.py`, `ai/experiments.py` |
| HU-32 | RF-ML-3 | Thompson Bandit en Ranking ML | `ai/features.py`, `ai/bandit.py` |
| HU-33 | RF-Trust-1 | Score de Confianza (Trust Score) | `controllers/trust.py`, `services/trust.py` |
| HU-34 | RF-Trust-2 | Insignias de Logro (Badges) | `controllers/users.py`, `services/badges.py` |
| HU-35 | RF-Geo-1 | Geocercas en Publicación | `models/solicitud.py`, `frontend` |
| HU-36 | RF-Geo-2 | Cascada Geoespacial (No Cableada) | `services/cascade.py` |
| HU-37 | RF-360-1 | Visor Panorámico de Portafolio | `controllers/portfolio.py`, `PanoViewer.tsx` |
| HU-38 | RF-UI-1 | WebSockets en Tiempo Real | `controllers/chat.py`, `app/extensions.py` |
| HU-39 | RF-UI-2 | Carga de Portafolio en MinIO | `controllers/portfolio.py`, `services/storage.py` |
| HU-40 | RF-ML-4 | Dashboard de Métricas de IA | `controllers/ai_metrics.py` |
| HU-41 | RF-49, RF-50 | Chamba — Creación y Ciclo de Estados | `controllers/chambas.py`, `models/chamba.py` |
| HU-42 | RF-51, RF-52 | Chamba — Inicio con Geo-validación y Entrada | `controllers/chambas.py`, `services/chamba.py` |
| HU-43 | RF-53, RF-54 | Chamba — Adendas, Novedades y Pánico | `controllers/chambas.py`, `services/chamba.py` |
| HU-44 | RF-55, RF-56 | Chamba — Cierre y Validación de Habilidades | `controllers/chambas.py` |
| HU-45 | RF-57, RF-58 | Chamba — Pago Directo Dual y Calificación | `controllers/chambas.py`, `services/chamba.py` |
| HU-46 | RF-59, RF-60 | Marañas (Micro-solicitudes / Rebusques) | `controllers/maranas.py`, `models/marana.py` |
| HU-47 | RF-31, RF-33..39 | Comerciante — Registro y Negocio | `controllers/negocios.py`, `models/negocio.py` |
| HU-48 | RF-47, RF-48 | Directorio y Mapa Público de Negocios | `controllers/negocios.py` |
| HU-49 | Sin RF previo | Comerciante — Dashboard y Preferencias | `controllers/negocios.py`, `controllers/merchant.py` |
| HU-50 | RF-67, RF-68 | Anuncios Laborales — Publicación y Feed | `controllers/anuncios.py`, `models/anuncio.py` |
| HU-51 | RF-69 | Anuncios Laborales — Postulación y Contacto | `controllers/anuncios.py` |
| HU-52 | RF-12, RF-40, RF-41 | KYC — Carga de Documentos por Rol | `controllers/kyc.py`, `data/seed_kyc.py` |
| HU-53 | RF-12, RF-42 | KYC — Revisión Regional y Dictamen | `controllers/kyc.py`, `controllers/admin.py` |
| HU-54 | RF-61..63 | Habilidades — Catálogo, Niveles y Quizzes | `controllers/habilidades.py`, `models/habilidad.py` |
| HU-55 | RF-64..66 | Habilidades — Endosos y Progresión Experto | `controllers/habilidades.py` |
| HU-56 | Sin RF previo | Verificación en Dos Pasos (2FA) | `controllers/two_factor.py`, `services/two_factor.py` |
| HU-57 | Sin RF previo | Verificación de Teléfono por OTP | `controllers/otp.py` |
| HU-58 | Sin RF previo | Verificación de Correo Electrónico | `controllers/email_verification.py` |
| HU-59 | Sin RF previo | Recuperación y Cambio de Contraseña | `controllers/auth_password.py` |
| HU-60 | Sin RF previo | Sesión, Refresh Rotativo y Revocación | `controllers/auth.py`, `config.py` |
| HU-61 | RF-70, RF-72, RF-74 | División Regional y Regla Anti Doble-Conteo | `controllers/regions.py`, `services/region.py` |
| HU-62 | RF-71, RF-73 | Panel Admin — Usuarios y Personal Regional | `controllers/admin.py` |
| HU-63 | RF-73 | Panel Admin — Moderación Regional | `controllers/admin.py` |
| HU-64 | Sin RF previo | Disputas de Contrato | `controllers/disputes.py`, `controllers/admin.py` |
| HU-65 | Sin RF previo | Tickets de Soporte Técnico | `controllers/tickets.py`, `controllers/admin.py` |
| HU-66 | Sin RF previo | Superadmin — Personal, Overrides y Auditoría | `controllers/superadmin.py` |
| HU-67 | RF-75 | Superadmin — Configuración, Flags, IA y T&C | `controllers/superadmin.py` |
| HU-68 | RF-32 / HU-02 | Onboarding Guiado de Usuario | `controllers/onboarding.py` |
| HU-69 | Sin RF previo | Preferencias de Perfil de Usuario | `controllers/user_preferences.py` |
| HU-70 | RF-08 (ampliado) | Métodos de Pago Vinculados | `controllers/payment_methods.py` |
| HU-71 | Sin RF previo | Búsqueda Pública de Proveedores PDS | `controllers/providers.py` |
| HU-72 | RF-02, RF-03 | Perfil Público, Foto y Portafolio Aprobado | `controllers/users.py`, `controllers/portfolio.py` |
| HU-73 | RF-16 (ampliado) | Centro de Notificaciones In-App | `controllers/notifications.py` |
| HU-74 | RF-16 (ampliado) | Mensajería y Chat 1:1 en Tiempo Real | `controllers/chat.py` |
| HU-75 | RF-17 (ampliado) | Consulta Pública de Documentos Legales | `controllers/legal.py` |

---

*Versión del documento: 3.0 — Catálogo consolidado post-auditoría de arquitectura. Refleja fielmente el código fuente de ChambeApp en rama Dev.*
