# Documento de Requerimientos: ChambeApp

> Plataforma inteligente para la contratación de solicitudes laborales ocasionales en Valledupar (IA + Visualización 3D + Formalización).
> Formato: EARS (Easy Approach to Requirements Syntax).
> Fuentes: `01_Contexto/base.md`, `01_Contexto/contexto.md`, `04_Monetizacion/Monetizacion.md`, `05_Terminos_Condiciones/ChambeApp_Terminos_y_Condiciones.md`.
> **Decisión tecnológica:** El despliegue inicial será **PWA (Progressive Web App)** en lugar de app móvil nativa, por simplicidad de despliegue y mantenimiento multiplataforma desde el navegador.

## 1. Roles de Usuario

- **Proveedor de Servicio (pds):** pds informal que ofrece solicitudes ocasionales (plomería, jardinería, reparaciones, etc.). Alta sensibilidad al precio.
- **Solicitante (solicitante):** Persona natural o pequeño negocio que crea y contrata solicitudes. Sensibilidad media al precio.

- **Sistema / Plataforma:** Componente automatizado (IA, pasarelas, notificaciones).
- **Verificador:** Rol interno encargado de validar documentos de identidad y documentación subida por usuarios.
- **Soporte:** Rol interno encargado de atender incidencias (PQR), restablecer accesos de usuarios y gestionar tickets.
- **Admin:** Rol interno con panel de gestión de usuarios, moderación de solicitudes y órdenes, revisión de verificaciones, resolución de disputas, métricas y soporte.
- **Superadmin:** Rol máximo con gestión de cuentas administrativas, configuración global del sistema, auditoría, publicación de términos y condiciones, y sobreescritura de recursos.

---

## 2. Requerimientos Funcionales

### RF-01: Registro y Autenticación Segmentada
**Historia de Usuario:** Como usuario nuevo, quiero registrarme diferenciando mi rol (pds o solicitante), para que el sistema me ofrezca las funciones adecuadas.

**Criterios de Aceptación:**
1. WHEN usuario inicia registro THEN sistema SHALL solicitar selección de rol (Proveedor / Solicitante).
2. WHEN usuario completa registro con datos válidos THEN sistema SHALL crear cuenta y perfil asociado al rol.
3. WHEN usuario intenta registrarse con correo ya existente THEN sistema SHALL mostrar error de duplicidad.
4. IF usuario no está autenticado THEN sistema SHALL exigir login antes de publicar o aceptar solicitudes.
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
**Historia de Usuario:** Como pds, quiero registrar mis competencias, experiencia y preferencias, para que el sistema me recomiende solicitudes afines.

**Criterios de Aceptación:**
1. WHEN pds edita su perfil THEN sistema SHALL permitir registrar habilidades, experiencia y categorías de solicitud.
2. WHEN pds completa su perfil THEN sistema SHALL habilitar su visibilidad en búsquedas.
3. WHEN pds adjunta fotos de trabajos anteriores THEN sistema SHALL mostrarlas en portafolio (si contrata Portafolio Visual, ver RF-14).
4. IF perfil está incompleto THEN sistema SHALL limitar postulaciones según plan (ver RF-11).

**Casos Límite:**
- WHEN pds no tiene habilidades registradas THEN sistema SHALL solicitar al menos una categoría antes de activar perfil.

---

### RF-03: Sistema de Reputación y Calificación
**Historia de Usuario:** Como solicitante, quiero calificar y comentar al pds tras una solicitud, para generar confianza en la plataforma.

**Criterios de Aceptación:**
1. WHEN solicitud finaliza THEN sistema SHALL permitir a ambas partes calificarse mutuamente.
2. WHEN se registra una calificación THEN sistema SHALL actualizar el promedio del perfil.
3. WHEN pds acumula calificaciones THEN sistema SHALL mostrar historial de servicios prestados.
4. WHEN usuario consulta perfil THEN sistema SHALL mostrar calificación promedio y comentarios.
5. IF una calificación es reportada como abusiva THEN sistema SHALL revisarla y ocultarla si aplica.

**Casos Límite:**
- WHEN solicitud no se completa THEN sistema SHALL bloquear calificación cruzada.
- WHEN pds tiene 0 calificaciones THEN sistema SHALL mostrar estado "sin calificaciones".

---

### RF-04: Publicación de Servicios por Solicitante
**Historia de Usuario:** Como solicitante, quiero publicar una solicitud con descripción, ubicación y presupuesto, para recibir postulaciones.

**Criterios de Aceptación:**
1. WHEN solicitante crea solicitud THEN sistema SHALL requerir categoría, descripción y ubicación (Valledupar).
2. WHEN solicitante define presupuesto THEN sistema SHALL validar monto mínimo de $50.000 COP (umbral de comisión).
3. WHEN solicitud se publica THEN sistema SHALL notificarlo a proveedores compatibles (ver RF-05).
4. WHEN solicitante adjunta especificaciones técnicas THEN sistema SHALL mostrarlas en la ficha de la solicitud.

**Casos Límite:**
- WHEN solicitante publica sin presupuesto THEN sistema SHALL marcarlo como "a convenir".
- WHEN ubicación está fuera de cobertura THEN sistema SHALL advertir (actual: solo Valledupar).

---

### RF-05: Motor de Match / Recomendación (IA)
**Historia de Usuario:** Como solicitante, quiero recibir sugerencias de pds ideales, para contratar más rápido y con confianza.

**Criterios de Aceptación:**
1. WHEN solicitud es publicada THEN sistema SHALL generar ranking de pds compatibles por similitud de perfil/habilidades.
2. WHEN pds cumple criterios THEN sistema SHALL sugerirlo al solicitante ordenado por relevancia y reputación.
3. WHEN pds busca solicitudes THEN sistema SHALL mostrar los más afines a su perfil.
4. WHEN el sistema recomienda THEN sistema SHALL explicar brevemente el criterio (transparencia algorítmica).
5. WHEN pds tiene membresía Profesional THEN sistema SHALL destacarlo en resultados (ver RF-11/14).

**Casos Límite:**
- WHEN no hay pds compatibles THEN sistema SHALL mostrar mensaje de "sin coincidencias" y sugerir ampliar criterios.
- WHEN histórico de comportamiento es insuficiente THEN sistema SHALL usar coincidencia por categoría básica.

---

### RF-06: Visualización Interactiva 3D / 360
**Historia de Usuario:** Como solicitante, quiero ver representaciones 3D/360 del escenario o especificaciones de la solicitud, para reducir incertidumbre antes de contratar.

**Criterios de Aceptación:**
1. WHEN solicitud incluye recurso 3D THEN sistema SHALL renderizar escenario interactivo en la ficha.
2. WHEN usuario interactúa con modelo 3D THEN sistema SHALL permitir rotación/zoom/360.
3. WHEN usuario accede desde cualquier dispositivo (móvil/escritorio) THEN sistema SHALL adaptar la visualización 3D de forma responsiva (PWA).
4. WHEN no hay recurso 3D THEN sistema SHALL mostrar galería de imágenes por defecto.
5. WHEN sistema presenta simulación 3D THEN sistema SHALL declarar que es orientativa y no garantiza condiciones reales del inmueble/objeto (T&C §6).

**Casos Límite:**
- WHEN conexión es lenta (<2 Mbps) THEN sistema SHALL degradar a vista de imágenes estáticas.
- WHEN modelo 3D falla al cargar THEN sistema SHALL mostrar placeholder y reintentar.

---

### RF-07: Gestión Contractual y Órdenes de Trabajo
**Historia de Usuario:** Como usuario, quiero crear, aceptar y seguir órdenes de trabajo en tiempo real, para formalizar la solicitud.

**Criterios de Aceptación:**
1. WHEN solicitante acepta un pds THEN sistema SHALL crear orden de trabajo con estado "Pendiente".
2. WHEN pds acepta la orden THEN sistema SHALL cambiar estado a "En progreso".
3. WHEN pds finaliza THEN sistema SHALL cambiar estado a "Completado" y habilitar pago/calificación.
4. WHEN usuario cancela orden THEN sistema SHALL registrar motivo y notificar a la contraparte.
5. WHEN orden existe THEN sistema SHALL mostrar seguimiento de estado en tiempo real.

**Casos Límite:**
- WHEN orden es cancelada tras inicio THEN sistema SHALL aplicar políticas de reembolso (T&C §8.3).
- WHEN ambas partes discrepan de estado THEN sistema SHALL abrir proceso de disputa (T&C §8.4):
  - WHEN solicitante reporta problema THEN sistema SHALL congelar fondos y notificar al pds en ≤48h con evidencia.
  - WHEN no hay acuerdo en 5 días hábiles THEN sistema SHALL evaluar evidencias y dictar decisión definitiva.
- WHEN servicio defectuoso es reportado THEN sistema SHALL congelar fondos para iniciar disputa (excluye costos de materiales fuera de la app).

---

### RF-08: Pasarela de Pagos e Ingresos
**Historia de Usuario:** Como usuario, quiero pagar y recibir el dinero de la solicitud por la plataforma, para tener trazabilidad financiera.

**Criterios de Aceptación:**
1. WHEN orden pasa a "Completado" THEN sistema SHALL generar orden de pago.
2. WHEN solicitante paga THEN sistema SHALL procesar vía MercadoPago o PSE.
3. WHEN pago es confirmado THEN sistema SHALL retener comisión y transferir el monto neto al proveedor.
4. WHEN pds solicita retiro THEN sistema SHALL procesarlo vía transferencia directa.
5. WHEN transacción falla THEN sistema SHALL mostrar opción de reintento y conservar orden.
6. WHEN pago está pendiente THEN sistema SHALL transferir al pds si el solicitante confirma finalización o si transcurren 48h sin queja.
7. WHEN solicitante invoca retracto (5 días hábiles, Art. 47 Ley 1480) y la solicitud no ha iniciado THEN sistema SHALL revertir pago (T&C §8.5).

**Casos Límite:**
- WHEN pago es rechazado por pasarela THEN sistema SHALL notificar error y no liberar fondos.
- WHEN monto es menor a $50.000 THEN sistema SHALL eximir comisión (T&C §7.1).
- WHEN pds no tiene cuenta bancaria THEN sistema SHALL permitir retiro por transferencia directa.
- WHEN pds no se presenta (no-show) THEN sistema SHALL reembolsar 100% al solicitante (T&C §8.3).
- WHEN solicitante cancela antes del desplazamiento THEN sistema SHALL reembolsar según política de cancelación (T&C §8.3).
- WHEN la plataforma adquiere calidad de agente retenedor THEN sistema SHALL aplicar retenciones en la fuente (Renta/ICA) y certificarlas (T&C §12).

---

### RF-09: Historial y Trazabilidad de Ingresos
**Historia de Usuario:** Como pds, quiero ver mi historial de ingresos, para tener registro formal de mi actividad.

**Criterios de Aceptación:**
1. WHEN pds accede a su panel THEN sistema SHALL mostrar historial de servicios e ingresos.
2. WHEN usuario filtra por periodo THEN sistema SHALL mostrar ingresos del rango seleccionado.
3. WHEN se solicita certificado THEN sistema SHALL generar documento con historial verificado (ver RF-13).
4. WHEN ingreso se registra THEN sistema SHALL actualizar promedio mensual automáticamente.

**Casos Límite:**
- WHEN no hay ingresos THEN sistema SHALL mostrar estado "sin movimientos".

---

### RF-10: Alertas de Formalización / Enlace Legal
**Historia de Usuario:** Como pds, quiero recibir información sobre seguridad social y formalización, para acceder a protección laboral.

**Criterios de Aceptación:**
1. WHEN pds alcanza cierto volumen de ingresos THEN sistema SHALL enviar alerta sobre acceso a seguridad social (Ley 1429/1562).
2. WHEN usuario consulta sección legal THEN sistema SHALL mostrar guías de formalización y riesgos laborales.
3. WHEN pds completa +10 solicitudes/mes THEN sistema SHALL notificar elegibilidad de descuento por volumen (ver RF-15).

**Casos Límite:**
- WHEN usuario descarta alerta THEN sistema SHALL permitir silenciarla sin eliminar el registro.

---

### RF-11: Suscripciones y Planes
**Historia de Usuario:** Como pds, quiero un plan de suscripción escalonado que me dé más visibilidad y postulaciones, para conseguir más solicitudes según mi etapa de negocio.

**Criterios de Aceptación:**
1. WHEN usuario se registra THEN sistema SHALL asignar automáticamente el plan Free (por defecto, $0) sin tarjeta.
2. WHEN plan es Free THEN sistema SHALL limitar a 3 postulaciones por mes.
3. WHEN pds selecciona plan Básico ($15k) THEN sistema SHALL permitir 15 postulaciones por mes y otorgar 50 monedas de bienvenida.
4. WHEN pds selecciona plan Profesional ($35k) THEN sistema SHALL permitir postulaciones ilimitadas, perfil destacado, 150 monedas, analytics, verificación express y certificado mensual.
5. WHEN periodo de prueba (3 meses) finaliza THEN sistema SHALL iniciar cobro según plan.
6. WHEN usuario cancela suscripción THEN sistema SHALL degradar beneficios al final del ciclo y revertir a Free.

**Casos Límite:**
- WHEN pago de suscripción falla THEN sistema SHALL mantener plan activo hasta vencimiento y avisar.
- WHEN pds Free excede 3 postulaciones/mes THEN sistema SHALL bloquear hasta próximo ciclo o upgrade.
- WHEN pds Básico excede 15 postulaciones/mes THEN sistema SHALL bloquear hasta próximo ciclo o upgrade a Profesional.

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
**Historia de Usuario:** Como pds, quiero un certificado oficial de mis ingresos, para trámites bancarios o de vivienda.

**Criterios de Aceptación:**
1. WHEN pds solicita certificado ($25k) THEN sistema SHALL generar documento con: nombre, historial 12 meses, promedio, solicitudes completadas, calificación, verificación.
2. WHEN certificado se genera THEN sistema SHALL marcarlo como verificado por la plataforma.
3. WHEN usuario lo descarga THEN sistema SHALL registrar la emisión.

**Casos Límite:**
- WHEN pds no tiene ingresos THEN sistema SHALL indicar insuficiencia de datos para certificado.

---

### RF-14: Servicios de Valor Agregado (Destacados, Badges, Portafolio)
**Historia de Usuario:** Como pds, quiero pagar por visibilidad y credenciales extra, para destacar frente a la competencia.

**Criterios de Aceptación:**
1. WHEN pds compra Destacado ($10k/día) THEN sistema SHALL posicionar su solicitud en primeras posiciones por 24h.
2. WHEN pds compra Badge de habilidad ($15k) THEN sistema SHALL mostrar certificación verificada en perfil.
3. WHEN pds compra Portafolio Visual ($8k/mes) THEN sistema SHALL habilitar galería de fotos.
4. WHEN pds compra Notificaciones Push Ilimitadas ($5k/mes) THEN sistema SHALL enviar alertas de nuevas solicitudes en tiempo real.

**Casos Límite:**
- WHEN periodo de beneficio expira THEN sistema SHALL remover beneficio automáticamente.

---

### RF-15: Comisiones por Transacción
**Historia de Usuario:** Como plataforma, quiero cobrar comisiones solo cuando hay transacción exitosa, para alinear incentivos.

**Criterios de Aceptación:**
1. WHEN solicitud se paga THEN sistema SHALL cobrar 12% al pds y 8% al solicitante sobre el valor.
2. WHEN valor de la solicitud es < $50.000 THEN sistema SHALL eximir comisión.
3. WHEN pds completa >10 solicitudes/mes THEN sistema SHALL aplicar 10% de descuento en su comisión.
4. WHEN pds es nuevo (primeros 3 meses) THEN sistema SHALL aplicar 0% comisión.

**Casos Límite:**
- WHEN transacción es reembolsada THEN sistema SHALL reversar comisiones cobradas.

---

### RF-16: Comunicación y Notificaciones en Tiempo Real
**Historia de Usuario:** Como usuario, quiero recibir notificaciones de confirmación, cancelación y actualizaciones, para estar informado.

**Criterios de Aceptación:**
1. WHEN solicitud es aceptada/cancelada THEN sistema SHALL enviar notificación push a ambas partes.
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
2. WHEN se describe la plataforma THEN sistema SHALL declarar que NO existe relación laboral ni subordinación con los pds (CST Art. 6; T&C §3).
3. WHEN surge controversia THEN sistema SHALL aplicar leyes de Colombia y jurisdicción de Valledupar (T&C §13).
4. WHEN ocurre daño/accidente en la ejecución de la solicitud THEN sistema SHALL eximirse de responsabilidad, recayendo en las partes (T&C §9).
5. WHEN la plataforma usa datos para entrenar IA/geolocalización THEN sistema SHALL informar la finalidad en la Política de Datos (T&C §10).

**Casos Límite:**
- WHEN usuario es menor de edad o sin capacidad legal THEN sistema SHALL bloquear el registro (T&C §4).
- WHEN usuario no acepta T&C THEN sistema SHALL denegar el uso de la plataforma.

---

### RF-18: Panel Administrador
**Historia de Usuario:** Como administrador, quiero un panel de control con gestión completa, para supervisar y operar la plataforma.
**Criterios de Aceptación:**
1. WHEN un usuario con rol 'admin' o 'superadmin' inicia sesión THEN el sistema SHALL presentar un panel administrativo con gestión de usuarios, moderación de servicios y órdenes, revisión de verificaciones, resolución de disputas, métricas y soporte.
2. IF la acción afecta fondos o roles THEN el sistema SHALL registrarla en auditoría.

---

### RF-19: Panel Superadministrador
**Historia de Usuario:** Como superadministrador, quiero acceso total a configuración global, para gestionar la entidad operativa.
**Criterios de Aceptación:**
1. WHEN un usuario con rol 'superadmin' accede THEN el sistema SHALL habilitar la gestión de cuentas administrativas, configuración global del sistema, auditoría, publicación de términos y condiciones, y sobreescritura de recursos.
2. WHEN se cambia un parámetro global THEN el sistema SHALL versionarlo y notificarlo a los administradores.

---

### RF-20: Rol Verificador
**Historia de Usuario:** Como verificador, quiero recibir documentos para aprobación, para validar identidades.
**Criterios de Aceptación:**
1. WHEN un usuario sube documentos de identidad para verificación THEN el sistema SHALL asignarlos a la cola del rol 'verificador' para aprobación humana.
2. WHEN el verificador aprueba THEN el sistema SHALL otorgar insignia de verificado; IF rechaza THEN el sistema SHALL solicitar reenvío con motivo.

---

### RF-21: Rol Soporte / PQR
**Historia de Usuario:** Como usuario, quiero abrir incidencias y restablecer accesos, para recibir asistencia.
**Criterios de Aceptación:**
1. WHEN un usuario abre una incidencia (PQR) THEN el sistema SHALL crear un ticket asignable al rol 'soporte'.
2. WHEN el soporte restablece el acceso de un usuario THEN el sistema SHALL registrar la acción en auditoría.

---

### RF-22: Sistema de Desbloqueo de Información
**Historia de Usuario:** Como PDS, quiero ver la ubicación y contactar al solicitante solo después de que el servicio sea confirmado, para proteger datos sensibles.

**Criterios de Aceptación:**
1. WHEN solicitante confirma servicio THEN sistema SHALL desbloquear ubicación y chat para PDS
2. IF servicio no confirmado THEN sistema SHALL mantener datos sensibles ocultos
3. WHEN servicio cancelado THEN sistema SHALL mantener datos bloqueados
4. WHEN PDS accede a solicitud THEN sistema SHALL mostrar solo información técnica

**Casos Límite:**
- WHEN solicitante cancela antes del desbloqueo THEN sistema SHALL mantener información oculta
- WHEN PDS no responde en 24h THEN sistema SHALL permitir al solicitante rechazar y relanzar

---

### RF-23: Confirmación Dual de Finalización
**Historia de Usuario:** Como usuario, quiero confirmar la finalización del servicio para que se procese el pago y se califique.

**Criterios de Aceptación:**
1. WHEN PDS marca servicio como completado THEN sistema SHALL solicitar confirmación al solicitante
2. WHEN solicitante confirma THEN sistema SHALL cambiar estado a "Completado"
3. IF solicitante no confirma en 48h THEN sistema SHALL liberar fondos automáticamente
4. WHEN ambas partes confirman THEN sistema SHALL habilitar calificaciones y pagos

**Casos Límite:**
- WHEN solicitante no confirma en 48h THEN sistema SHALL liberar fondos automáticamente
- WHEN hay disputa THEN sistema SHALL congelar fondos y abrir proceso de mediación

---

### RF-24: Gestión de Ofertas
**Historia de Usuario:** Como PDS, quiero poder enviar, modificar y rechazar ofertas para gestionar mis postulaciones.

**Criterios de Aceptación:**
1. WHEN PDS envía oferta THEN sistema SHALL almacenar y notificar al solicitante
2. WHEN PDS modifica oferta THEN sistema SHALL reemplazar la anterior
3. WHEN solicitante rechaza oferta THEN sistema SHALL notificar al PDS
4. IF solicitante cancela solicitud THEN sistema SHALL invalidar todas las ofertas

**Casos Límite:**
- WHEN PDS modifica oferta THEN sistema SHALL mantener solo la versión más reciente
- WHEN solicitante rechaza todas las ofertas THEN sistema SHALL relanzar notificaciones

---

### RF-25: Sistema de Billetera Virtual
**Historia de Usuario:** Como usuario, quiero tener una billetera virtual para recibir y pagar servicios, para gestionar mis finanzas en la plataforma.

**Criterios de Aceptación:**
1. WHEN usuario se registra THEN sistema SHALL crear billetera con saldo 0
2. WHEN PDS completa servicio THEN sistema SHALL descontar comisión de billetera
3. WHEN usuario solicita retiro THEN sistema SHALL transferir saldo a cuenta bancaria
4. WHEN saldo es insuficiente THEN sistema SHALL bloquear operaciones de pago
5. WHEN usuario deposite fondos THEN sistema SHALL acreditar saldo en tiempo real
6. WHEN transacción ocurre THEN sistema SHALL registrar en historial de billetera

**Casos Límite:**
- WHEN saldo es negativo THEN sistema SHALL bloquear retiros y pagos
- WHEN usuario solicita retiro mínimo $10.000 THEN sistema SHALL procesar
- WHEN hay error en depósito THEN sistema SHALL reversar y notificar

---

### RF-26: Modalidad de Cobro
**Historia de Usuario:** Como solicitante, quiero elegir la modalidad de cobro al publicar, para controlar mis costos.

**Criterios de Aceptación:**
1. WHEN solicitante publica THEN sistema SHALL ofrecer elegir "Con Comisión" o "Sin Comisión"
2. WHEN elige "Sin Comisión" THEN sistema SHALL requerir pago en monedas
3. WHEN publica "Con Comisión" THEN sistema SHALL marcar solicitud como modalidad A
4. WHEN publica "Sin Comisión" THEN sistema SHALL marcar solicitud como modalidad B
5. WHEN PDS ve solicitud THEN sistema SHALL mostrar modalidad aplicable

**Casos Límite:**
- WHEN solicitante no elige modalidad THEN sistema SHALL usar "Con Comisión" por defecto
- WHEN modalidad es "Sin Comisión" y PDS no tiene monedas THEN sistema SHALL bloquear oferta

---

### RF-27: Sistema de Monedas
**Historia de Usuario:** Como usuario, quiero comprar monedas para usar en pagos de servicios.

**Criterios de Aceptación:**
1. WHEN usuario compra monedas THEN sistema SHALL procesar pago y acreditar
2. WHEN usuario usa monedas THEN sistema SHALL descontar del saldo
3. WHEN monedas son promocionales THEN sistema SHALL marcar como no reembolsables
4. WHEN monedas expiran THEN sistema SHALL descontar automáticamente
5. WHEN usuario ve monedas THEN sistema SHALL mostrar saldo y tipo

**Casos Límite:**
- WHEN monedas son compradas THEN sistema SHALL permitir uso ilimitado
- WHEN monedas son ganadas THEN sistema SHALL marcar fecha de vencimiento
- WHEN usuario cierra cuenta THEN sistema SHALL perder monedas promocionales

---

### RF-28: Precios Sugeridos
**Historia de Usuario:** Como solicitante, quiero ver precios sugeridos para mi solicitud, para publicar a precio justo.

**Criterios de Aceptación:**
1. WHEN solicitante crea solicitud THEN sistema SHALL mostrar precio promedio de mercado
2. WHEN solicitud tiene categoría THEN sistema SHALL sugerir rango de precio
3. WHEN precio es muy bajo THEN sistema SHALL advertir sobre subcotización
4. WHEN precio es muy alto THEN sistema SHALL mostrar advertencia de sobreprecio
5. WHEN usuario ajusta precio THEN sistema SHALL recalcular sugerencia

**Casos Límite:**
- WHEN no hay datos históricos THEN sistema SHALL mostrar "sin referencia"
- WHEN categoría es nueva THEN sistema SHALL usar promedio general

---

### RF-29: Hitos de Pago
**Historia de Usuario:** Como usuario, quiero dividir el pago en hitos para servicios de larga duración.

**Criterios de Aceptación:**
1. WHEN contrato es largo THEN sistema SHALL habilitar hitos
2. WHEN solicitante aprueba entrega THEN sistema SHALL liberar pago parcial
3. WHEN hito se aprueba THEN sistema SHALL descontar comisión proporcional
4. WHEN hito es rechazado THEN sistema SHALL congelar pago de ese hito
5. WHEN todos los hitos aprueban THEN sistema SHALL completar contrato

**Casos Límite:**
- WHEN hito tiene disputa THEN sistema SHALL congelar fondos
- WHEN solicitante no responde en 48h THEN sistema SHALL auto-aprobar hito

---

### RF-30: Dashboard Operativo
**Historia de Usuario:** Como PDS, quiero ver mi historial de cobros y comisiones, para controlar mis finanzas.

**Criterios de Aceptación:**
1. WHEN PDS accede a dashboard THEN sistema SHALL mostrar historial
2. WHEN filtra por periodo THEN sistema SHALL mostrar cobros del rango
3. WHEN solicita reporte THEN sistema SHALL generar PDF con detalle
4. WHEN PDS ve saldo THEN sistema SHALL mostrar disponible para retiro
5. WHEN hay transacciones THEN sistema SHALL mostrar comisiones descontadas

**Casos Límite:**
- WHEN no hay transacciones THEN sistema SHALL mostrar "sin movimientos"
- WHEN reporte falla THEN sistema SHALL mostrar error y sugerir reintento

---

### Requerimientos de Inteligencia Artificial, Confianza, Geocerca y Tiempo Real (Implementados)

### RF-ML-1: Recomendación 2 Etapas ✅ IMPLEMENTADO

**Historia de Usuario:** Como usuario, quiero recibir un ranking de proveedores mediante recuperación geoespacial seguida de ranking ML, para contratar más rápido y con confianza.

**Criterios de Aceptación:**
1. WHEN una solicitud es publicada THEN el sistema SHALL ejecutar retrieval geoespacial (PostGIS/Haversine) de proveedores cercanos.
2. WHEN se obtienen candidatos THEN el sistema SHALL aplicar ranking ML (LightGBM Lambdarank) sobre 22 features.
3. IF el modelo ML falla THEN el sistema SHALL usar `HeuristicRecommender` como fallback.
4. WHEN el sistema recomienda THEN sistema SHALL explicar el criterio (transparencia algorítmica).

**Componentes:** `app/ai/recommender.py` (HybridRecommender), `app/ai/features.py` (FeatureExtractor 22 features), `app/ai/ml_ranker.py` (MLRanker), `app/ai/geo.py`.

---

### RF-ML-2: A/B Testing ✅ IMPLEMENTADO

**Historia de Usuario:** Como equipo de producto, quiero comparar ML vs heurístico con asignación determinista, para medir impacto.

**Criterios de Aceptación:**
1. WHEN se genera una recomendación THEN el sistema SHALL asignar el usuario a un grupo A o B determinísticamente (`ABTest.get_group`).
2. WHEN se asigna THEN el sistema SHALL registrar la recomendación (`log_recommendation`).
3. WHEN se consultan métricas THEN el sistema SHALL reportar métricas por grupo (`get_metrics`).
4. WHEN se invocan los endpoints de `app/routes/ai.py` THEN el sistema SHALL ejecutar el A/B testing cableado.

**Componentes:** `app/ai/ab_testing.py` (ABTest), `app/models/recommendation_log.py`, `app/routes/ai.py`.

---

### RF-ML-3: Rotación con Thompson Bandit ✅ IMPLEMENTADO

**Historia de Usuario:** Como sistema, quiero rotar categorías con Multi-Armed Bandit (Thompson Sampling), para equilibrar exposición.

**Criterios de Aceptación:**
1. WHEN el sistema selecciona categorías a mostrar THEN sistema SHALL usar `ThompsonBandit` para rotación inteligente.

**Componentes:** `app/ai/bandit.py` (ThompsonBandit).

---

### RF-Trust-1: Score de Confianza ✅ IMPLEMENTADO

**Historia de Usuario:** Como usuario, quiero ver un Trust Score 0-100 con dimensiones, para evaluar la confiabilidad de un proveedor.

**Criterios de Aceptación:**
1. WHEN se consulta un pds THEN el sistema SHALL calcular Trust Score 0-100 con 5 dimensiones (KYC, rating, contratos, portfolio, referidos).
2. WHEN el score está en 80-100 THEN sistema SHALL clasificar como Experto; 60-79 Verificado; 40-59 Confiable; 0-39 Nuevo.

**Componentes:** `app/models/trust.py`, `app/services/trust.py`; frontend `features/trust`.

---

### RF-Trust-2: Badges ✅ IMPLEMENTADO

**Historia de Usuario:** Como pds, quiero insignias de logro conectadas al backend, para destacar mis credenciales.

**Criterios de Aceptación:**
1. WHEN un pds cumple criterios THEN el sistema SHALL otorgar badges conectados al backend.

**Componentes:** `app/models/badges.py`; frontend `features/badges`.

---

### RF-Geo-1: Geocercas ✅ IMPLEMENTADO

**Historia de Usuario:** Como solicitante, quiero publicar con `radio_km` configurable, para controlar la cobertura de la solicitud.

**Criterios de Aceptación:**
1. WHEN se publica una solicitud THEN el sistema SHALL aceptar `radio_km` (1-20 km, default 5) y almacenarlo.
2. WHEN se muestra en mapa THEN sistema SHALL visualizar `GeofenceMap`/`GeofencePicker`.

**Componentes:** `app/models/solicitud.py` (columna `radio_km`), `migrations/versions/002_add_solicitud_radio.py`; frontend `features/geofence`.

---

### RF-Geo-2: Cascada Geoespacial ✅ IMPLEMENTADO

**Historia de Usuario:** Como pds, quiero recibir notificaciones en cascada 2/5/15 km, para no perder oportunidades cercanas.

**Criterios de Aceptación:**
1. WHEN una solicitud es publicada THEN el sistema SHALL iniciar cascada (2km/300s/max5, 5km/600s/max10, 15km/900s/max15).
2. WHEN cada fase ejecuta THEN sistema SHALL notificar a proveedores cercanos.

**Componentes:** `app/services/cascade.py`, `app/models/cascade.py`, `app/tasks.py` (Celery `send_phase_task`).

---

### RF-360-1: Visor Panorámico ✅ IMPLEMENTADO

**Historia de Usuario:** Como usuario, quiero ver el portafolio en 360° (A-Frame), para evaluar mejor al proveedor.

**Criterios de Aceptación:**
1. WHEN se muestra el portafolio THEN el sistema SHALL renderizar `Viewer360` (A-Frame) en perfil y solicitudes.

**Componentes:** frontend `components/Viewer360.tsx`.

---

### RF-UI-1: Notificaciones Real-time ✅ IMPLEMENTADO

**Historia de Usuario:** Como usuario, quiero notificaciones en tiempo real vía Socket.IO, para recibir información inmediata.

**Criterios de Aceptación:**
1. WHEN ocurre un evento THEN el sistema SHALL emitir `notificacion:nueva` vía Socket.IO a sala `user:<id>`.
2. WHEN el cliente conecta THEN sistema SHALL unirlo vía evento `join` con token (`useNotificationSocket`).
3. WHEN se entrega THEN sistema SHALL hacerlo en <1s (reemplaza polling 30s).

**Componentes:** `app/routes/notification_socket.py`, `app/services/cascade.py`; frontend `features/notifications`.

---

### RF-UI-2: Portfolio Upload ✅ IMPLEMENTADO

**Historia de Usuario:** Como pds, quiero subir archivos (no solo URLs) a MinIO, para un portafolio más rico.

**Criterios de Aceptación:**
1. WHEN un pds sube un item THEN el sistema SHALL aceptar multipart (foto/video/doc) y guardarlo en MinIO.
2. WHEN se lista THEN sistema SHALL mostrar items y galería pública.

**Componentes:** `app/routes/portfolio.py`, `app/services/storage.py`; frontend `features/portfolio`.

---

### RF-ML-4: Métricas ML Dashboard ✅ IMPLEMENTADO

**Historia de Usuario:** Como admin, quiero un dashboard de métricas ML y A/B, para monitorear el modelo.

**Criterios de Aceptación:**
1. WHEN un admin consulta THEN el sistema SHALL exponer `GET /api/v1/ai/metrics` y `GET /api/v1/ai/metrics/feature-importance`.

**Componentes:** `app/routes/ai_metrics.py`.

---

## 3. Requerimientos No Funcionales

### RNF-AUD (Auditoría inmutable)
1. WHEN cualquier rol interno (verificador, soporte, admin, superadmin) ejecuta una acción privilegiada THEN el sistema SHALL persistir un registro de auditoría (actor, acción, entidad, IP, timestamp) en la misma transacción de la acción, sin posibilidad de edición posterior.

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
2. WHEN crece a 5.000 pds (Año 3) THEN sistema SHALL mantener métricas de rendimiento.

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

*Versión: 2.0 — Generado con metodología de Ingeniería de Requerimientos (EARS). Incluye restricciones de Términos y Condiciones y despliegue PWA. Se añadieron RF-18 a RF-30 y RNF-AUD. Roles internos completos. Nuevo modelo de billetera virtual y modalidades de cobro.*

---Nota de modelo de interacción (por definir / futuro)---
El solicitante crea y gestiona la solicitud; el pds aplica/oferta sobre una solicitud; el solicitante selecciona un pds, puede aceptar la oferta o negociar; al acordar se inicia el flujo para el pds (por definir).