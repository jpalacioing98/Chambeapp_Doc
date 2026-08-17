# Documento de Requerimientos: ChambeApp

> Plataforma inteligente para la contratación de servicios laborales ocasionales en Valledupar (IA + Visualización 3D + Formalización).
> Formato: EARS (Easy Approach to Requirements Syntax).
> Fuentes: `01_Contexto/base.md`, `01_Contexto/contexto.md`, `04_Monetizacion/Monetizacion.md`, `05_Terminos_Condiciones/ChambeApp_Terminos_y_Condiciones.md`.
> **Decisión tecnológica:** El despliegue inicial será **PWA (Progressive Web App)** en lugar de app móvil nativa, por simplicidad de despliegue y mantenimiento multiplataforma desde el navegador.

## 1. Roles de Usuario

- **Proveedor de Servicio (Trabajador):** Trabajador informal que ofrece servicios ocasionales (plomería, jardinería, reparaciones, etc.). Alta sensibilidad al precio.
- **Solicitante (Empleador):** Persona natural o pequeño negocio que publica y contrata servicios. Sensibilidad media al precio.
- **Empresa / Equipo:** Solicitante o proveedor con necesidades de gestión multi-usuario (plan Empresa).
- **Sistema / Plataforma:** Componente automatizado (IA, pasarelas, notificaciones).

---

## 2. Requerimientos Funcionales

### RF-01: Registro y Autenticación Segmentada
**Historia de Usuario:** Como usuario nuevo, quiero registrarme diferenciando mi rol (proveedor o solicitante), para que el sistema me ofrezca las funciones adecuadas.

**Criterios de Aceptación:**
1. WHEN usuario inicia registro THEN sistema SHALL solicitar selección de rol (Proveedor / Solicitante).
2. WHEN usuario completa registro con datos válidos THEN sistema SHALL crear cuenta y perfil asociado al rol.
3. WHEN usuario intenta registrarse con correo ya existente THEN sistema SHALL mostrar error de duplicidad.
4. IF usuario no está autenticado THEN sistema SHALL exigir login antes de publicar o aceptar servicios.
5. WHEN usuario solicita recuperación de contraseña THEN sistema SHALL enviar enlace de restablecimiento.
6. WHEN usuario se registra THEN sistema SHALL exigir aceptación explícita de Términos y Condiciones y Política de Datos (clickwrap, Ley 527/1999).
7. WHEN usuario registra THEN sistema SHALL validar que sea mayor de 18 años con capacidad legal (T&C §4).
8. WHEN usuario solicita sus datos THEN sistema SHALL permitir conocer, actualizar, rectificar y suprimir sus datos personales (Habeas Data, Ley 1581/2012).

**Casos Límite:**
- WHEN usuario deja campos obligatorios vacíos THEN sistema SHALL marcar error y bloquear envío.
- WHEN usuario no acepta T&C THEN sistema SHALL bloquear la creación de cuenta.
- WHEN usuario sube documento de identidad THEN sistema SHALL iniciar proceso de verificación (ver RF-12).
- WHEN se detecta suplantación o falsedad documental THEN sistema SHALL suspender la cuenta e iniciar acciones correspondientes (T&C §4).

---

### RF-02: Perfil de Habilidades del Proveedor
**Historia de Usuario:** Como proveedor, quiero registrar mis competencias, experiencia y preferencias, para que el sistema me recomiende servicios afines.

**Criterios de Aceptación:**
1. WHEN proveedor edita su perfil THEN sistema SHALL permitir registrar habilidades, experiencia y categorías de servicio.
2. WHEN proveedor completa su perfil THEN sistema SHALL habilitar su visibilidad en búsquedas.
3. WHEN proveedor adjunta fotos de trabajos anteriores THEN sistema SHALL mostrarlas en portafolio (si contrata Portafolio Visual, ver RF-14).
4. IF perfil está incompleto THEN sistema SHALL limitar postulaciones según plan (ver RF-11).

**Casos Límite:**
- WHEN proveedor no tiene habilidades registradas THEN sistema SHALL solicitar al menos una categoría antes de activar perfil.

---

### RF-03: Sistema de Reputación y Calificación
**Historia de Usuario:** Como solicitante, quiero calificar y comentar al proveedor tras un servicio, para generar confianza en la plataforma.

**Criterios de Aceptación:**
1. WHEN servicio finaliza THEN sistema SHALL permitir a ambas partes calificarse mutuamente.
2. WHEN se registra una calificación THEN sistema SHALL actualizar el promedio del perfil.
3. WHEN proveedor acumula calificaciones THEN sistema SHALL mostrar historial de servicios prestados.
4. WHEN usuario consulta perfil THEN sistema SHALL mostrar calificación promedio y comentarios.
5. IF una calificación es reportada como abusiva THEN sistema SHALL revisarla y ocultarla si aplica.

**Casos Límite:**
- WHEN servicio no se completa THEN sistema SHALL bloquear calificación cruzada.
- WHEN proveedor tiene 0 calificaciones THEN sistema SHALL mostrar estado "sin calificaciones".

---

### RF-04: Publicación de Servicios por Solicitante
**Historia de Usuario:** Como solicitante, quiero publicar un servicio con descripción, ubicación y presupuesto, para recibir postulaciones.

**Criterios de Aceptación:**
1. WHEN solicitante crea servicio THEN sistema SHALL requerir categoría, descripción y ubicación (Valledupar).
2. WHEN solicitante define presupuesto THEN sistema SHALL validar monto mínimo de $50.000 COP (umbral de comisión).
3. WHEN servicio se publica THEN sistema SHALL notificarlo a proveedores compatibles (ver RF-05).
4. WHEN solicitante adjunta especificaciones técnicas THEN sistema SHALL mostrarlas en la ficha del servicio.

**Casos Límite:**
- WHEN solicitante publica sin presupuesto THEN sistema SHALL marcarlo como "a convenir".
- WHEN ubicación está fuera de cobertura THEN sistema SHALL advertir (actual: solo Valledupar).

---

### RF-05: Motor de Match / Recomendación (IA)
**Historia de Usuario:** Como solicitante, quiero recibir sugerencias de proveedores ideales, para contratar más rápido y con confianza.

**Criterios de Aceptación:**
1. WHEN servicio es publicado THEN sistema SHALL generar ranking de proveedores compatibles por similitud de perfil/habilidades.
2. WHEN proveedor cumple criterios THEN sistema SHALL sugerirlo al solicitante ordenado por relevancia y reputación.
3. WHEN proveedor busca servicios THEN sistema SHALL mostrar los más afines a su perfil.
4. WHEN el sistema recomienda THEN sistema SHALL explicar brevemente el criterio (transparencia algorítmica).
5. WHEN proveedor tiene membresía Profesional/Empresa THEN sistema SHALL destacarlo en resultados (ver RF-11/14).

**Casos Límite:**
- WHEN no hay proveedores compatibles THEN sistema SHALL mostrar mensaje de "sin coincidencias" y sugerir ampliar criterios.
- WHEN histórico de comportamiento es insuficiente THEN sistema SHALL usar coincidencia por categoría básica.

---

### RF-06: Visualización Interactiva 3D / 360
**Historia de Usuario:** Como solicitante, quiero ver representaciones 3D/360 del escenario o especificaciones del servicio, para reducir incertidumbre antes de contratar.

**Criterios de Aceptación:**
1. WHEN servicio incluye recurso 3D THEN sistema SHALL renderizar escenario interactivo en la ficha.
2. WHEN usuario interactúa con modelo 3D THEN sistema SHALL permitir rotación/zoom/360.
3. WHEN usuario accede desde cualquier dispositivo (móvil/escritorio) THEN sistema SHALL adaptar la visualización 3D de forma responsiva (PWA).
4. WHEN no hay recurso 3D THEN sistema SHALL mostrar galería de imágenes por defecto.
5. WHEN sistema presenta simulación 3D THEN sistema SHALL declarar que es orientativa y no garantiza condiciones reales del inmueble/objeto (T&C §6).

**Casos Límite:**
- WHEN conexión es lenta (<2 Mbps) THEN sistema SHALL degradar a vista de imágenes estáticas.
- WHEN modelo 3D falla al cargar THEN sistema SHALL mostrar placeholder y reintentar.

---

### RF-07: Gestión Contractual y Órdenes de Trabajo
**Historia de Usuario:** Como usuario, quiero crear, aceptar y seguir órdenes de trabajo en tiempo real, para formalizar el servicio.

**Criterios de Aceptación:**
1. WHEN solicitante acepta un proveedor THEN sistema SHALL crear orden de trabajo con estado "Pendiente".
2. WHEN proveedor acepta la orden THEN sistema SHALL cambiar estado a "En progreso".
3. WHEN proveedor finaliza THEN sistema SHALL cambiar estado a "Completado" y habilitar pago/calificación.
4. WHEN usuario cancela orden THEN sistema SHALL registrar motivo y notificar a la contraparte.
5. WHEN orden existe THEN sistema SHALL mostrar seguimiento de estado en tiempo real.

**Casos Límite:**
- WHEN orden es cancelada tras inicio THEN sistema SHALL aplicar políticas de reembolso (T&C §8.3).
- WHEN ambas partes discrepan de estado THEN sistema SHALL abrir proceso de disputa (T&C §8.4):
  - WHEN solicitante reporta problema THEN sistema SHALL congelar fondos y notificar al proveedor en ≤48h con evidencia.
  - WHEN no hay acuerdo en 5 días hábiles THEN sistema SHALL evaluar evidencias y dictar decisión definitiva.
- WHEN servicio defectuoso es reportado THEN sistema SHALL congelar fondos para iniciar disputa (excluye costos de materiales fuera de la app).

---

### RF-08: Pasarela de Pagos e Ingresos
**Historia de Usuario:** Como usuario, quiero pagar y recibir el dinero del servicio por la plataforma, para tener trazabilidad financiera.

**Criterios de Aceptación:**
1. WHEN orden pasa a "Completado" THEN sistema SHALL generar orden de pago.
2. WHEN solicitante paga THEN sistema SHALL procesar vía MercadoPago o PSE.
3. WHEN pago es confirmado THEN sistema SHALL retener comisión y retener el monto en escrow (T&C §8.2).
4. WHEN proveedor solicita retiro THEN sistema SHALL procesarlo vía transferencia directa.
5. WHEN transacción falla THEN sistema SHALL mostrar opción de reintento y conservar orden.
6. WHEN fondos están en escrow THEN sistema SHALL liberar al proveedor si el solicitante confirma finalización o si transcurren 48h sin queja (T&C §8.2).
7. WHEN solicitante invoca retracto (5 días hábiles, Art. 47 Ley 1480) y el servicio no ha iniciado THEN sistema SHALL revertir pago (T&C §8.5).

**Casos Límite:**
- WHEN pago es rechazado por pasarela THEN sistema SHALL notificar error y no liberar fondos.
- WHEN monto es menor a $50.000 THEN sistema SHALL eximir comisión (T&C §7.1).
- WHEN proveedor no tiene cuenta bancaria THEN sistema SHALL permitir retiro por transferencia directa.
- WHEN trabajador no se presenta (no-show) THEN sistema SHALL reembolsar 100% al solicitante (T&C §8.3).
- WHEN solicitante cancela antes del desplazamiento THEN sistema SHALL reembolsar según política de cancelación (T&C §8.3).
- WHEN la plataforma adquiere calidad de agente retenedor THEN sistema SHALL aplicar retenciones en la fuente (Renta/ICA) y certificarlas (T&C §12).

---

### RF-09: Historial y Trazabilidad de Ingresos
**Historia de Usuario:** Como proveedor, quiero ver mi historial de ingresos, para tener registro formal de mis actividades.

**Criterios de Aceptación:**
1. WHEN proveedor accede a su panel THEN sistema SHALL mostrar historial de servicios e ingresos.
2. WHEN usuario filtra por periodo THEN sistema SHALL mostrar ingresos del rango seleccionado.
3. WHEN se solicita certificado THEN sistema SHALL generar documento con historial verificado (ver RF-13).
4. WHEN ingreso se registra THEN sistema SHALL actualizar promedio mensual automáticamente.

**Casos Límite:**
- WHEN no hay ingresos THEN sistema SHALL mostrar estado "sin movimientos".

---

### RF-10: Alertas de Formalización / Enlace Legal
**Historia de Usuario:** Como proveedor, quiero recibir información sobre seguridad social y formalización, para acceder a protección laboral.

**Criterios de Aceptación:**
1. WHEN proveedor alcanza cierto volumen de ingresos THEN sistema SHALL enviar alerta sobre acceso a seguridad social (Ley 1429/1562).
2. WHEN usuario consulta sección legal THEN sistema SHALL mostrar guías de formalización y riesgos laborales.
3. WHEN proveedor completa +10 servicios/mes THEN sistema SHALL notificar elegibilidad de descuento por volumen (ver RF-15).

**Casos Límite:**
- WHEN usuario descarta alerta THEN sistema SHALL permitir silenciarla sin eliminar el registro.

---

### RF-11: Suscripciones Premium
**Historia de Usuario:** Como proveedor establecido, quiero una suscripción que me dé beneficios, para conseguir más servicios.

**Criterios de Aceptación:**
1. WHEN proveedor selecciona plan THEN sistema SHALL activar beneficios según nivel (Básico $15k / Profesional $35k / Empresa $75k).
2. WHEN plan es Profesional/Empresa THEN sistema SHALL permitir postulaciones ilimitadas y perfil destacado.
3. WHEN plan es Empresa THEN sistema SHALL habilitar gestión de equipos y múltiples cuentas.
4. WHEN periodo de prueba (3 meses) finaliza THEN sistema SHALL iniciar cobro según plan.
5. WHEN usuario cancela suscripción THEN sistema SHALL degradar beneficios al final del ciclo.

**Casos Límite:**
- WHEN pago de suscripción falla THEN sistema SHALL mantener plan activo hasta vencimiento y avisar.
- WHEN usuario Básico excede 5 postulaciones/mes THEN sistema SHALL bloquear hasta próximo ciclo o upgrade.

---

### RF-12: Verificación de Identidad
**Historia de Usuario:** Como usuario, quiero verificar mi identidad, para ganar confianza y obtener badges.

**Criterios de Aceptación:**
1. WHEN usuario sube documento THEN sistema SHALL iniciar verificación en hasta 48h.
2. WHEN usuario paga Verificación Express ($20k) THEN sistema SHALL completar verificación en 4h.
3. WHEN verificación es exitosa THEN sistema SHALL otorgar badge de identidad verificada.

**Casos Límite:**
- WHEN documento es ilegible THEN sistema SHALL rechazar y solicitar reenvío.

---

### RF-13: Certificado de Ingresos
**Historia de Usuario:** Como proveedor, quiero un certificado oficial de mis ingresos, para trámites bancarios o de vivienda.

**Criterios de Aceptación:**
1. WHEN proveedor solicita certificado ($25k) THEN sistema SHALL generar documento con: nombre, historial 12 meses, promedio, servicios completados, calificación, verificación.
2. WHEN certificado se genera THEN sistema SHALL marcarlo como verificado por la plataforma.
3. WHEN usuario lo descarga THEN sistema SHALL registrar la emisión.

**Casos Límite:**
- WHEN proveedor no tiene ingresos THEN sistema SHALL indicar insuficiencia de datos para certificado.

---

### RF-14: Servicios de Valor Agregado (Destacados, Badges, Portafolio)
**Historia de Usuario:** Como proveedor, quiero pagar por visibilidad y credenciales extra, para destacar frente a la competencia.

**Criterios de Aceptación:**
1. WHEN proveedor compra Destacado ($10k/día) THEN sistema SHALL posicionar su servicio en primeras posiciones por 24h.
2. WHEN proveedor compra Badge de habilidad ($15k) THEN sistema SHALL mostrar certificación verificada en perfil.
3. WHEN proveedor compra Portafolio Visual ($8k/mes) THEN sistema SHALL habilitar galería de fotos.
4. WHEN proveedor compra Notificaciones Push Ilimitadas ($5k/mes) THEN sistema SHALL enviar alertas de nuevos servicios en tiempo real.

**Casos Límite:**
- WHEN periodo de servicio expira THEN sistema SHALL remover beneficio automáticamente.

---

### RF-15: Comisiones por Transacción
**Historia de Usuario:** Como plataforma, quiero cobrar comisiones solo cuando hay transacción exitosa, para alinear incentivos.

**Criterios de Aceptación:**
1. WHEN servicio se paga THEN sistema SHALL cobrar 12% al proveedor y 8% al solicitante sobre el valor.
2. WHEN valor del servicio es < $50.000 THEN sistema SHALL eximir comisión.
3. WHEN proveedor completa >10 servicios/mes THEN sistema SHALL aplicar 10% de descuento en su comisión.
4. WHEN proveedor es nuevo (primeros 3 meses) THEN sistema SHALL aplicar 0% comisión.

**Casos Límite:**
- WHEN transacción es reembolsada THEN sistema SHALL reversar comisiones cobradas.

---

### RF-16: Comunicación y Notificaciones en Tiempo Real
**Historia de Usuario:** Como usuario, quiero recibir notificaciones de confirmación, cancelación y actualizaciones, para estar informado.

**Criterios de Aceptación:**
1. WHEN servicio es aceptado/cancelado THEN sistema SHALL enviar notificación push a ambas partes.
2. WHEN hay nueva postulación THEN sistema SHALL notificar al solicitante.
3. WHEN orden cambia de estado THEN sistema SHALL notificar a los involucrados.
4. WHEN mensaje es enviado entre usuarios THEN sistema SHALL entregarlo en tiempo real.

**Casos Límite:**
- WHEN usuario desactiva notificaciones THEN sistema SHALL respetar preferencia y usar solo in-app.
- WHEN dispositivo está offline THEN sistema SHALL reencolar y entregar al reconectar.

---

### RF-17: Marco Legal, Naturaleza de Intermediario y Limitación de Responsabilidad
**Historia de Usuario:** Como plataforma, quiero declarar mi rol de intermediario tecnológico y limitar mi responsabilidad civil, para mitigar riesgos de solidaridad laboral y litigios (T&C §1, §3, §9).

**Criterios de Aceptación:**
1. WHEN usuario acepta T&C THEN sistema SHALL dejar constancia (log) de aceptación vinculante (clickwrap, Ley 527/1999).
2. WHEN se describe la plataforma THEN sistema SHALL declarar que NO existe relación laboral ni subordinación con los trabajadores (CST Art. 6; T&C §3).
3. WHEN surge controversia THEN sistema SHALL aplicar leyes de Colombia y jurisdicción de Valledupar (T&C §13).
4. WHEN ocurre daño/accidente en la ejecución del servicio THEN sistema SHALL eximirse de responsabilidad, recayendo en las partes (T&C §9).
5. WHEN la plataforma usa datos para entrenar IA/geolocalización THEN sistema SHALL informar la finalidad en la Política de Datos (T&C §10).

**Casos Límite:**
- WHEN usuario es menor de edad o sin capacidad legal THEN sistema SHALL bloquear el registro (T&C §4).
- WHEN usuario no acepta T&C THEN sistema SHALL denegar el uso de la plataforma.

---

## 3. Requerimientos No Funcionales

### RNF-01: Usabilidad y Accesibilidad
1. WHEN nuevo usuario inicia THEN sistema SHALL requerir no más de 3 clics para alcanzar la funcionalidad principal (publicar/postular).
2. WHEN usuario tiene baja alfabetización digital THEN sistema SHALL ofrecer interfaz intuitiva y guiada.
3. IF sistema es PWA THEN sistema SHALL cumplir estándares de accesibilidad WCAG 2.1 AA y diseño responsivo.

### RNF-02: Transparencia Algorítmica
1. WHEN sistema recomienda o califica THEN sistema SHALL ser explicable y evitar sesgos injustos.
2. WHEN se usa IA THEN sistema SHALL documentar criterios de decisión accesibles al usuario.

### RNF-03: Seguridad de Datos
1. WHEN sistema almacena datos financieros/personales THEN sistema SHALL cifrarlos en reposo y tránsito.
2. IF usuario no autenticado THEN sistema SHALL denegar acceso a datos sensibles.
3. WHEN se procesa pago THEN sistema SHALL cumplir normativa de protección de datos (Colombia).

### RNF-04: Rendimiento
1. WHEN usuario realiza búsqueda THEN sistema SHALL responder en ≤ 2 segundos.
2. WHEN usuario carga modelo 3D THEN sistema SHALL iniciar render en ≤ 5 segundos en conexión estándar.

### RNF-05: Disponibilidad y Escala
1. WHEN la plataforma opera THEN sistema SHALL mantener disponibilidad ≥ 99% en horario pico.
2. WHEN crece a 5.000 proveedores (Año 3) THEN sistema SHALL mantener métricas de rendimiento.

### RNF-06: Confiabilidad de Pagos
1. WHEN transacción se procesa THEN sistema SHALL alcanzar tasa de éxito > 98%.

### RNF-07: Características PWA (Progressive Web App)
1. WHEN usuario visita la plataforma THEN sistema SHALL ofrecer instalación de la PWA (manifest + iconos).
2. WHEN usuario instala la PWA THEN sistema SHALL permitir uso con aspecto de app nativa (sin barra de navegador).
3. WHEN usuario está offline THEN sistema SHALL servir shell de la app y funciones cacheadas vía Service Worker.
4. WHEN hay conectividad intermitente THEN sistema SHALL sincronizar datos pendientes al reconectar (Background Sync).
5. WHEN sistema envía notificación THEN sistema SHALL usar Push API del navegador (Service Worker) compatible con iOS/Android/desktop.
6. WHEN se despliega THEN sistema SHALL ser accesible vía HTTPS con un solo build multiplataforma.

---

## 4. Fuera de Alcance (v1)

- Expansión fuera de Valledupar (fase Mes 7+, Sincelejo/Riohacha).
- Integraciones B2B empresariales avanzadas (fase 18+ meses).
- Microcréditos y servicios financieros propios (largo plazo).
- Validación normativa legal exhaustiva (se delega a asesoría externa).

---

## 5. Preguntas Abiertas

- ~~¿Qué nivel de resolución de disputas (mediación) se implementará en v1?~~ **Resuelto por T&C §8.4:** reporte ≤48h, mediación, decisión en 5 días hábiles.
- ¿Cómo se define "volumen de ingresos" exacto para disparar alertas de Ley 1429/1562?
- ¿Qué métricas de sesgo algorítmico se auditarán y con qué frecuencia?
- ¿La visualización 3D es obligatoria para todo servicio o solo opcional por categoría?
- ¿Quién asume costos de pasarela (2.99%+$800 / 1.99%+$500) en micro-servicios exentos de comisión?

---

*Versión: 1.1 — Generado con metodología de Ingeniería de Requerimientos (EARS). Incluye restricciones de Términos y Condiciones y despliegue PWA.*
