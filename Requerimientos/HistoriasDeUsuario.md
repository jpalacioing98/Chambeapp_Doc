# Historias de Usuario y Casos de Uso — ChambeApp (v2.0)

> Detalle de las historias de usuario y casos de uso derivados de `Requerimientos.md` (RF-01 a RF-30).
> Formato: Historia de Usuario + Criterios de Aceptación (EARS) + Casos de Uso (flujo principal / alternos).
> **Decisión tecnológica:** Despliegue inicial como **PWA** (no app móvil nativa). Los casos de uso asumen acceso vía navegador/instalación PWA.
> **Marco legal:** Se incorporan restricciones de Términos y Condiciones (reembolsos, disputas, Habeas Data, edad 18+, naturaleza de intermediario).
> **Nuevo modelo:** Incluye billetera virtual, modalidades de cobro y sistema de monedas.

---

## RF-01: Registro y Autenticación Segmentada

**HU-01:** Como usuario nuevo, quiero registrarme eligiendo mi rol (pds o solicitante), para acceder solo a las funciones que me corresponden.

**Criterios de Aceptación:**
1. WHEN usuario inicia registro THEN sistema SHALL solicitar selección de rol.
2. WHEN registro es válido THEN sistema SHALL crear cuenta y perfil asociado.
3. IF correo ya existe THEN sistema SHALL mostrar error de duplicidad.
4. IF usuario no autenticado THEN sistema SHALL exigir login antes de acciones protegidas.

**CU-01.1 Registrarse (Actor: Usuario nuevo)**
- Flujo principal:
  1. Usuario abre la PWA (navegador o app instalada) y selecciona "Registrarse".
  2. Selecciona rol: Proveedor o Solicitante.
  3. Ingresa correo, contraseña, datos básicos.
  4. Sistema valida y crea cuenta → perfil en estado "No verificado".
- Flujos alternos:
  - 3a. Correo duplicado → error, solicita otro correo.
  - 3b. Campos vacíos → bloqueo de envío con marcado de error.

**CU-01.2 Iniciar sesión (Actor: Usuario registrado)**
- Flujo principal: 1. Ingresa credenciales. 2. Sistema autentica y redirige al dashboard según rol.
- Alterno: 2a. Credenciales erróneas → 3 intentos, luego bloqueo temporal + opción recuperar.

---

## RF-02: Perfil de Habilidades del Proveedor

**HU-02:** Como pds, quiero registrar mis habilidades y experiencia, para recibir solicitudes acordes a mi perfil.

**Criterios de Aceptación:**
1. WHEN pds edita perfil THEN sistema SHALL permitir habilidades, experiencia y categorías.
2. WHEN perfil completo THEN sistema SHALL habilitar visibilidad en búsquedas.
3. IF perfil incompleto THEN sistema SHALL limitar postulaciones según plan.

**CU-02.1 Completar perfil de pds (Actor: pds)**
- Flujo principal:
  1. Accede a "Mi Perfil".
  2. Registra ≥1 categoría, habilidades, años de experiencia, zona.
  3. Guarda → perfil "Activo" y visible.
- Alterno: 3a. Sin categoría → bloquea activación.

---

## RF-03: Sistema de Reputación y Calificación

**HU-03:** Como solicitante, quiero calificar al pds tras una solicitud, para construir confianza en la plataforma.

**Criterios de Aceptación:**
1. WHEN solicitud finaliza THEN sistema SHALL permitir calificación mutua.
2. WHEN calificación registrada THEN sistema SHALL actualizar promedio.
3. IF calificación reportada THEN sistema SHALL revisar y ocultar si aplica.
4. WHEN solicitud no completada THEN sistema SHALL bloquear calificación.

**CU-03.1 Calificar solicitud (Actor: Solicitante / pds)**
- Flujo principal:
  1. Servicio en "Completado".
  2. Usuario asigna puntaje (1–5) y comentario.
  3. Sistema actualiza promedio y publica en perfil.
- Alterno: 3a. Reporte de abuso → moderación oculta comentario.

---

## RF-04: Publicación de Servicios por Solicitante

**HU-04:** Como solicitante, quiero publicar una solicitud con categoría, descripción, ubicación y presupuesto, para recibir postulaciones.

**Criterios de Aceptación:**
1. WHEN solicitante crea solicitud THEN sistema SHALL requerir categoría, descripción y ubicación.
2. WHEN presupuesto definido THEN sistema SHALL validar mínimo $50.000.
3. WHEN solicitud publicada THEN sistema SHALL notificar a proveedores compatibles.
4. WHEN ubicación fuera de cobertura THEN sistema SHALL advertir (solo Valledupar).

**CU-04.1 Publicar solicitud (Actor: Solicitante)**
- Flujo principal:
  1. Selecciona "Publicar servicio".
  2. Elige categoría, describe, fija ubicación (Valledupar) y presupuesto.
  3. Sistema valida y publica → notifica proveedores (RF-05).
- Alterno:
  - 2a. Presupuesto < $50.000 → error de validación.
  - 2b. Sin presupuesto → marca "a convenir".

---

## RF-05: Motor de Match / Recomendación (IA)

**HU-05:** Como solicitante, quiero ver pds sugeridos por IA ordenados por relevancia, para contratar rápido y con confianza.

**Criterios de Aceptación:**
1. WHEN solicitud publicada THEN sistema SHALL generar ranking por similitud perfil/habilidades.
2. WHEN pds busca THEN sistema SHALL mostrar solicitudes afines.
3. WHEN recomienda THEN sistema SHALL explicar criterio (transparencia).
4. WHEN no hay coincidencias THEN sistema SHALL sugerir ampliar criterios.

**CU-05.1 Generar recomendaciones (Actor: Sistema / Solicitante)**
- Flujo principal:
  1. Servicio publicado dispara motor de match.
  2. Sistema vectoriza perfil y calcula similitud.
  3. Devuelve ranking ordenado por relevancia + reputación.
- Alterno: 3a. Histórico insuficiente → coincidencia por categoría básica.

---

## RF-06: Visualización Interactiva 3D / 360

**HU-06:** Como solicitante, quiero explorar un escenario 3D de la solicitud, para reducir incertidumbre antes de contratar.

**Criterios de Aceptación:**
1. WHEN solicitud tiene recurso 3D THEN sistema SHALL renderizar escenario interactivo.
2. WHEN usuario interactúa THEN sistema SHALL permitir rotación/zoom/360.
3. WHEN conexión <2 Mbps THEN sistema SHALL degradar a imágenes estáticas.
4. WHEN falla carga 3D THEN sistema SHALL mostrar placeholder y reintentar.

**CU-06.1 Visualizar en 3D (Actor: Solicitante)**
- Flujo principal:
  1. Abre ficha de servicio con recurso 3D.
  2. Sistema renderiza modelo interactivo.
  3. Usuario rota/zoom/360.
- Alterno: 3a. Conexión lenta → vista de imágenes. 3b. Error de carga → placeholder + retry.

---

## RF-07: Gestión Contractual y Órdenes de Trabajo

**HU-07:** Como usuario, quiero crear y seguir órdenes de trabajo en tiempo real, para formalizar la solicitud.

**Criterios de Aceptación:**
1. WHEN solicitante acepta pds THEN sistema SHALL crear orden "Pendiente".
2. WHEN pds acepta THEN sistema SHALL pasar a "En progreso".
3. WHEN pds finaliza THEN sistema SHALL pasar a "Completado".
4. WHEN orden cancelada THEN sistema SHALL registrar motivo y notificar.
5. WHEN discrepan de estado THEN sistema SHALL abrir resolución/mediación.

**CU-07.1 Ciclo de orden de trabajo (Actores: Solicitante, pds)**
- Flujo principal:
  1. Solicitante acepta postulación → orden "Pendiente".
  2. Proveedor acepta → "En progreso".
  3. Proveedor finaliza → "Completado" → habilita pago y calificación.
- Alterno:
  - 2a. Cancelación → registro de motivo + notificación.
  - 3a. Discrepancia de estado → canal de mediación.

---

## RF-08: Pasarela de Pagos e Ingresos

**HU-08:** Como usuario, quiero pagar y cobrar por la plataforma, para tener trazabilidad financiera.

**Criterios de Aceptación:**
1. WHEN orden "Completado" THEN sistema SHALL generar orden de pago.
2. WHEN solicitante paga THEN sistema SHALL procesar vía MercadoPago o PSE.
3. WHEN pago confirmado THEN sistema SHALL retener comisión y liberar neto al proveedor.
4. WHEN proveedor retira THEN sistema SHALL procesar transferencia directa.
5. WHEN transacción falla THEN sistema SHALL permitir reintento sin liberar fondos.

**CU-08.1 Pagar servicio (Actor: Solicitante)**
- Flujo principal:
  1. Orden en "Completado" → generar orden de pago.
  2. Solicitante elige pasarela (MercadoPago / PSE).
  3. Pago confirmado → retención de comisión (RF-15) + liberación de neto.
- Alterno: 3a. Rechazo → error, sin liberar, reintento habilitado.

**CU-08.2 Retirar fondos (Actor: Proveedor)**
- Flujo principal:
  1. Proveedor solicita retiro de saldo.
  2. Sistema procesa transferencia directa.
- Alterno: 2a. Sin cuenta bancaria → transferencia directa a tercero autorizado.

---

## RF-09: Historial y Trazabilidad de Ingresos

**HU-09:** Como pds, quiero ver mi historial de ingresos, para tener registro formal de mi actividad.

**Criterios de Aceptación:**
1. WHEN pds abre panel THEN sistema SHALL mostrar historial de ingresos.
2. WHEN filtra por periodo THEN sistema SHALL mostrar ingresos del rango.
3. WHEN solicita certificado THEN sistema SHALL generar documento (RF-13).
4. WHEN ingreso registrado THEN sistema SHALL recalcular promedio mensual.

**CU-09.1 Consultar historial (Actor: pds)**
- Flujo principal:
  1. Accede a "Mis Ingresos".
  2. Visualiza lista de servicios, montos, fechas.
  3. Aplica filtro de periodo.
- Alterno: 3a. Sin movimientos → estado "sin movimientos".

---

## RF-10: Alertas de Formalización / Enlace Legal

**HU-10:** Como pds, quiero recibir alertas sobre seguridad social, para acceder a protección laboral.

**Criterios de Aceptación:**
1. WHEN volumen de ingresos alcanzado THEN sistema SHALL alertar sobre seguridad social (Ley 1429/1562).
2. WHEN consulta sección legal THEN sistema SHALL mostrar guías de formalización.
3. WHEN +10 solicitudes/mes THEN sistema SHALL notificar descuento por volumen (RF-15).

**CU-10.1 Recibir alerta de formalización (Actor: Sistema / pds)**
- Flujo principal:
  1. Sistema detecta umbral de ingresos/servicios.
  2. Envía alerta push/in-app con guía de seguridad social.
- Alterno: 2a. Usuario descarta → silencia sin borrar registro.

---

## RF-11: Suscripciones Premium

**HU-11:** Como pds establecido, quiero una suscripción con beneficios, para conseguir más solicitudes.

**Criterios de Aceptación:**
1. WHEN selecciona plan THEN sistema SHALL activar beneficios según nivel (Básico $15k / Profesional $35k).
2. WHEN Profesional THEN sistema SHALL dar postulaciones ilimitadas y perfil destacado.
4. WHEN prueba 3 meses termina THEN sistema SHALL iniciar cobro.
5. WHEN cancela THEN sistema SHALL degradar al fin del ciclo.

**CU-11.1 Suscribirse a Premium (Actor: pds)**
- Flujo principal:
  1. Elige plan y paga.
  2. Sistema activa beneficios según nivel.
  3. Tras 3 meses de prueba → cobro recurrente.
- Alterno:
  - 3a. Pago falla → plan activo hasta vencimiento + aviso.
  - 2b. Básico excede 5 postulaciones/mes → bloqueo hasta upgrade.

---

## RF-12: Verificación de Identidad

**HU-12:** Como usuario, quiero verificar mi identidad, para obtener badge de confianza.

**Criterios de Aceptación:**
1. WHEN sube documento THEN sistema SHALL verificar en hasta 48h.
2. WHEN paga Express ($20k) THEN sistema SHALL verificar en 4h.
3. WHEN verificación exitosa THEN sistema SHALL otorgar badge.

**CU-12.1 Verificar identidad (Actor: Usuario)**
- Flujo principal:
  1. Sube documento de identidad.
  2. Sistema verifica (48h, o 4h si Express).
  3. Otorga badge de identidad verificada.
- Alterno: 2a. Documento ilegible → rechazo + reenvío.

---

## RF-13: Certificado de Ingresos

**HU-13:** Como pds, quiero un certificado oficial de ingresos, para trámites bancarios o de vivienda.

**Criterios de Aceptación:**
1. WHEN solicita certificado ($25k) THEN sistema SHALL generar con nombre, historial 12 meses, promedio, servicios completados, calificación, verificación.
2. WHEN generado THEN sistema SHALL marcarlo verificado.
3. WHEN descarga THEN sistema SHALL registrar emisión.

**CU-13.1 Generar certificado (Actor: pds)**
- Flujo principal:
  1. Solicita certificado y paga $25k.
  2. Sistema compila datos y genera PDF verificado.
  3. Usuario descarga.
- Alterno: 2a. Sin ingresos → indica insuficiencia de datos.

---

## RF-14: Servicios de Valor Agregado

**HU-14:** Como pds, quiero pagar por visibilidad y credenciales, para destacar frente a la competencia.

**Criterios de Aceptación:**
1. WHEN compra Destacado ($10k/día) THEN sistema SHALL posicionar en primeras posiciones 24h.
2. WHEN compra Badge ($15k) THEN sistema SHALL mostrar certificación verificada.
3. WHEN compra Portafolio ($8k/mes) THEN sistema SHALL habilitar galería.
4. WHEN compra Push Ilimitadas ($5k/mes) THEN sistema SHALL enviar alertas en tiempo real.

**CU-14.1 Comprar solicitud adicional (Actor: pds)**
- Flujo principal:
  1. Selecciona servicio y paga.
  2. Sistema activa beneficio por periodo definido.
- Alterno: 2a. Expiración → remoción automática.

---

## RF-15: Comisiones por Transacción

**HU-15:** Como plataforma, quiero cobrar comisiones solo en transacción exitosa, para alinear incentivos.

**Criterios de Aceptación:**
1. WHEN solicitud pagada THEN sistema SHALL cobrar 12% pds + 8% solicitante.
2. WHEN valor < $50.000 THEN sistema SHALL eximir comisión.
3. WHEN pds >10 solicitudes/mes THEN sistema SHALL aplicar 10% descuento.
4. WHEN pds nuevo (3 meses) THEN sistema SHALL aplicar 0% comisión.

**CU-15.1 Aplicar comisión (Actor: Sistema)**
- Flujo principal:
  1. Pago confirmado.
  2. Sistema calcula 12%+8% sobre valor.
  3. Retiene y libera neto al proveedor.
- Alterno:
  - 2a. Valor < $50.000 → 0% comisión.
  - 2b. Reembolso → reversión de comisiones.

---

## RF-16: Comunicación y Notificaciones en Tiempo Real

**HU-16:** Como usuario, quiero recibir notificaciones de confirmación, cancelación y actualizaciones, para estar informado.

**Criterios de Aceptación:**
1. WHEN solicitud aceptada/cancelada THEN sistema SHALL enviar notificación push a ambas partes.
2. WHEN nueva postulación THEN sistema SHALL notificar solicitante.
3. WHEN orden cambia de estado THEN sistema SHALL notificar involucrados.
4. WHEN mensaje es enviado THEN sistema SHALL entregarlo en tiempo real.

**CU-16.1 Enviar notificación (Actor: Sistema / Usuario)**
- Flujo principal:
  1. Evento dispara notificación.
  2. Sistema envía push/in-app/mensaje en tiempo real (vía Push API de la PWA).
- Alterno:
  - 2a. Usuario desactiva → solo in-app.
  - 2b. Offline → reencolar y entregar al reconectar.

---

## RF-17: Marco Legal, Naturaleza de Intermediario y Limitación de Responsabilidad

**HU-17:** Como plataforma, quiero que al registrarse el usuario acepte los Términos y Condiciones y la Política de Datos, y que se declare mi rol de intermediario, para mitigar riesgos legales.

**Criterios de Aceptación:**
1. WHEN usuario acepta T&C THEN sistema SHALL registrar log de aceptación vinculante (clickwrap, Ley 527/1999).
2. WHEN se describe la plataforma THEN sistema SHALL declarar ausencia de relación laboral/subordinación (CST Art. 6; T&C §3).
3. WHEN usuario es menor de 18 años o sin capacidad legal THEN sistema SHALL bloquear el registro (T&C §4).
4. WHEN surge controversia THEN sistema SHALL aplicar leyes de Colombia y jurisdicción de Valledupar (T&C §13).

**CU-17.1 Aceptar Términos y registrar naturaleza legal (Actor: Usuario)**
- Flujo principal:
  1. Durante registro, sistema presenta T&C y Política de Datos.
  2. Usuario acepta explícitamente.
  3. Sistema registra log y habilita la cuenta.
- Alterno: 2a. No acepta → bloqueo de cuenta. 3a. Menor de edad → bloqueo.

---

## RF-07 (NFR): Experiencia PWA

**HU-18:** Como usuario, quiero instalar la plataforma en mi dispositivo y usarla aunque pierda conexión, para acceder como una app nativa.

**Criterios de Aceptación:**
1. WHEN usuario visita la plataforma THEN sistema SHALL ofrecer instalación de la PWA.
2. WHEN usuario está offline THEN sistema SHALL servir el shell y funciones cacheadas.
3. WHEN reconecta THEN sistema SHALL sincronizar datos pendientes.

**CU-18.1 Instalar y usar PWA (Actor: Usuario)**
- Flujo principal:
  1. Usuario abre URL HTTPS de la plataforma.
  2. Navegador ofrece "Añadir a pantalla de inicio".
  3. Usuario instala → usa como app, incluso offline para contenido cacheado.
- Alterno: 3a. Sin conexión → solo funciones cacheadas + cola de sincronización.

---

## RF-22: Sistema de Desbloqueo de Información

**HU-19:** Como PDS, quiero ver la ubicación y contactar al solicitante solo después de que el servicio sea confirmado, para proteger datos sensibles.

**Criterios de Aceptación:**
1. WHEN solicitante confirma servicio THEN sistema SHALL desbloquear ubicación y chat para PDS
2. IF servicio no confirmado THEN sistema SHALL mantener datos sensibles ocultos
3. WHEN servicio cancelado THEN sistema SHALL mantener datos bloqueados
4. WHEN PDS accede a solicitud THEN sistema SHALL mostrar solo información técnica

**CU-19.1 Desbloquear información (Actor: Sistema)**
- Flujo principal:
  1. Solicitante confirma servicio.
  2. Sistema desbloquea ubicación y chat para PDS.
  3. PDS puede ver ubicación y contactar al solicitante.
- Alterno: 1a. Solicitante cancela → información permanece oculta.

---

## RF-23: Confirmación Dual de Finalización

**HU-20:** Como usuario, quiero confirmar la finalización del servicio para que se procese el pago y se califique.

**Criterios de Aceptación:**
1. WHEN PDS marca servicio como completado THEN sistema SHALL solicitar confirmación al solicitante
2. WHEN solicitante confirma THEN sistema SHALL cambiar estado a "Completado"
3. IF solicitante no confirma en 48h THEN sistema SHALL liberar fondos automáticamente
4. WHEN ambas partes confirman THEN sistema SHALL habilitar calificaciones y pagos

**CU-20.1 Confirmar finalización (Actor: Solicitante)**
- Flujo principal:
  1. PDS marca servicio como "Completado".
  2. Sistema notifica al solicitante para confirmar.
  3. Solicitante confirma recepción y satisfacción.
  4. Sistema cambia estado a "Completado" y habilita pagos/calificaciones.
- Alterno: 3a. Solicitante no confirma en 48h → sistema libera fondos automáticamente.

---

## RF-24: Gestión de Ofertas

**HU-21:** Como PDS, quiero poder enviar, modificar y rechazar ofertas para gestionar mis postulaciones.

**Criterios de Aceptación:**
1. WHEN PDS envía oferta THEN sistema SHALL almacenar y notificar al solicitante
2. WHEN PDS modifica oferta THEN sistema SHALL reemplazar la anterior
3. WHEN solicitante rechaza oferta THEN sistema SHALL notificar al PDS
4. IF solicitante cancela solicitud THEN sistema SHALL invalidar todas las ofertas

**CU-21.1 Enviar oferta (Actor: PDS)**
- Flujo principal:
  1. PDS recibe notificación de solicitud.
  2. Revisa detalles técnicos.
  3. Envía oferta con propuesta (precio, tiempo, descripción).
  4. Sistema almacena y notifica al solicitante.
- Alterno: 3a. PDS modifica oferta → sistema reemplaza la anterior.

**CU-21.2 Responder oferta (Actor: Solicitante)**
- Flujo principal:
  1. Solicitante revisa ofertas recibidas.
  2. Selecciona una oferta para aceptar, rechazar o negociar.
  3. Si acepta → se procede al flujo de confirmación (RF-23).
  4. Si rechaza → notifica al PDS.
  5. Si negocia → abre chat con el PDS.
- Alterno: 4a. Solicitante rechaza todas → sistema relanza notificaciones.

---

## RF-25: Sistema de Billetera Virtual

**HU-22:** Como usuario, quiero tener una billetera virtual para recibir y pagar servicios, para gestionar mis finanzas en la plataforma.

**Criterios de Aceptación:**
1. WHEN usuario se registra THEN sistema SHALL crear billetera con saldo 0
2. WHEN PDS completa servicio THEN sistema SHALL descontar comisión de billetera
3. WHEN usuario solicita retiro THEN sistema SHALL transferir saldo a cuenta bancaria
4. WHEN saldo insuficiente THEN sistema SHALL bloquear operaciones de pago
5. WHEN usuario deposita fondos THEN sistema SHALL acreditar saldo en tiempo real
6. WHEN transacción ocurre THEN sistema SHALL registrar en historial de billetera

**CU-22.1 Consultar billetera (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Mi Billetera".
  2. Visualiza saldo disponible, historial de transacciones.
  3. Puede solicitar retiro si tiene saldo.
- Alterno: 3a. Sin saldo → muestra "sin fondos disponibles".

**CU-22.2 Depositar fondos (Actor: Usuario)**
- Flujo principal:
  1. Selecciona "Depositar".
  2. Ingresa monto y método de pago.
  3. Sistema procesa y acredita saldo.
- Alterno: 3a. Error en pago → no acredita, notifica error.

**CU-22.3 Retirar fondos (Actor: Usuario)**
- Flujo principal:
  1. Selecciona "Retirar".
  2. Ingresa monto y cuenta destino.
  3. Sistema procesa transferencia.
- Alterno: 3a. Monto mínimo $10.000 → error. 3b. Sin saldo → bloqueado.

---

## RF-26: Modalidad de Cobro

**HU-23:** Como solicitante, quiero elegir la modalidad de cobro al publicar, para controlar mis costos.

**Criterios de Aceptación:**
1. WHEN solicitante publica THEN sistema SHALL ofrecer elegir "Con Comisión" o "Sin Comisión"
2. WHEN elige "Sin Comisión" THEN sistema SHALL requerir pago en monedas
3. WHEN publica "Con Comisión" THEN sistema SHALL marcar solicitud como modalidad A
4. WHEN publica "Sin Comisión" THEN sistema SHALL marcar solicitud como modalidad B
5. WHEN PDS ve solicitud THEN sistema SHALL mostrar modalidad aplicable

**CU-23.1 Seleccionar modalidad (Actor: Solicitante)**
- Flujo principal:
  1. Al crear solicitud, sistema muestra opciones de modalidad.
  2. Solicitante elige "Con Comisión" o "Sin Comisión".
  3. Si elige "Sin Comisión" → sistema verifica monedas suficientes.
  4. Sistema publica solicitud con modalidad seleccionada.
- Alterno: 3a. Sin monedas suficientes → error, sugiere cambiar modalidad.

**CU-23.2 Ver modalidad en solicitud (Actor: PDS)**
- Flujo principal:
  1. PDS accede a solicitud.
  2. Sistema muestra modalidad aplicable (A o B).
  3. Si modalidad B → sistema muestra costo en monedas.
- Alterno: 3a. PDS no tiene monedas → puede ver pero no ofertar.

---

## RF-27: Sistema de Monedas

**HU-24:** Como usuario, quiero comprar monedas para usar en pagos de servicios.

**Criterios de Aceptación:**
1. WHEN usuario compra monedas THEN sistema SHALL procesar pago y acreditar
2. WHEN usuario usa monedas THEN sistema SHALL descontar del saldo
3. WHEN monedas son promocionales THEN sistema SHALL marcar como no reembolsables
4. WHEN monedas expiran THEN sistema SHALL descontar automáticamente
5. WHEN usuario ve monedas THEN sistema SHALL mostrar saldo y tipo

**CU-24.1 Comprar monedas (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Tienda de Monedas".
  2. Selecciona paquete (Básico $5k/50, Estándar $15k/150, Premium $30k/350).
  3. Paga y recibe monedas acreditadas.
- Alterno: 3a. Error de pago → no acredita, notifica error.

**CU-24.2 Usar monedas (Actor: PDS)**
- Flujo principal:
  1. PDS ve solicitud "Sin Comisión".
  2. Oferta usando monedas (50 monedas).
  3. Sistema descuenta del saldo de monedas.
- Alterno: 2a. Sin monedas suficientes → bloqueado, sugiere comprar.

**CU-24.3 Ver historial de monedas (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Mis Monedas".
  2. Visualiza saldo por tipo (compradas, promocionales, ganadas).
  3. Ve historial de transacciones de monedas.
- Alterno: 3a. Sin movimientos → "sin transacciones".

---

## RF-28: Precios Sugeridos

**HU-25:** Como solicitante, quiero ver precios sugeridos para mi solicitud, para publicar a precio justo.

**Criterios de Aceptación:**
1. WHEN solicitante crea solicitud THEN sistema SHALL mostrar precio promedio de mercado
2. WHEN solicitud tiene categoría THEN sistema SHALL sugerir rango de precio
3. WHEN precio es muy bajo THEN sistema SHALL advertir sobre subcotización
4. WHEN precio es muy alto THEN sistema SHALL mostrar advertencia de sobreprecio
5. WHEN usuario ajusta precio THEN sistema SHALL recalcular sugerencia

**CU-25.1 Ver precios sugeridos (Actor: Solicitante)**
- Flujo principal:
  1. Al crear solicitud, sistema muestra precios sugeridos por categoría.
  2. Muestra mínimo, promedio, máximo de mercado.
  3. Si precio actual es bajo → advierte "precio muy bajo para la calidad".
- Alterno: 3a. Sin datos históricos → muestra "sin referencia de mercado".

**CU-25.2 Ajustar precio según sugerencia (Actor: Solicitante)**
- Flujo principal:
  1. Solicitante ve sugerencia.
  2. Ajusta precio basado en recomendación.
  3. Sistema recalcula si es necesario.
- Alterno: 2a. No ajusta → mantiene precio original con advertencia.

---

## RF-29: Hitos de Pago

**HU-26:** Como usuario, quiero dividir el pago en hitos para servicios de larga duración.

**Criterios de Aceptación:**
1. WHEN contrato es largo THEN sistema SHALL habilitar hitos
2. WHEN solicitante aprueba entrega THEN sistema SHALL liberar pago parcial
3. WHEN hito se aprueba THEN sistema SHALL descontar comisión proporcional
4. WHEN hito es rechazado THEN sistema SHALL congelar pago de ese hito
5. WHEN todos los hitos aprueban THEN sistema SHALL completar contrato

**CU-26.1 Crear hitos (Actor: Solicitante)**
- Flujo principal:
  1. Al crear contrato largo, sistema sugiere dividir en hitos.
  2. Solicitante define cantidad de hitos y montos.
  3. Sistema crea hitos con estados pendientes.
- Alterno: 2a. No define hitos → sistema usa 1 hito único.

**CU-26.2 Aprobar hito (Actor: Solicitante)**
- Flujo principal:
  1. PDS completa entrega de hito.
  2. Sistema notifica al solicitante.
  3. Solicitante aprueba → sistema libera pago parcial.
- Alterno: 3a. Rechaza → congelar pago, abrir disputa.

**CU-26.3 Ver progreso de hitos (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Mis Contratos".
  2. Ve lista de hitos con estados (pendiente, aprobado, rechazado).
  3. Ve pagos liberados y pendientes.
- Alterno: 3a. Sin hitos → muestra contrato único.

---

## RF-30: Dashboard Operativo

**HU-27:** Como PDS, quiero ver mi historial de cobros y comisiones, para controlar mis finanzas.

**Criterios de Aceptación:**
1. WHEN PDS accede a dashboard THEN sistema SHALL mostrar historial
2. WHEN filtra por periodo THEN sistema SHALL mostrar cobros del rango
3. WHEN solicita reporte THEN sistema SHALL generar PDF con detalle
4. WHEN PDS ve saldo THEN sistema SHALL mostrar disponible para retiro
5. WHEN hay transacciones THEN sistema SHALL mostrar comisiones descontadas

**CU-27.1 Ver dashboard de cobros (Actor: PDS)**
- Flujo principal:
  1. Accede a "Dashboard Operativo".
  2. Ve resumen: saldo disponible, ingresos del mes, comisiones pagadas.
  3. Ve historial de transacciones.
- Alterno: 2a. Sin transacciones → "sin movimientos".

**CU-27.2 Filtrar por periodo (Actor: PDS)**
- Flujo principal:
  1. Selecciona rango de fechas.
  2. Sistema muestra cobros del periodo.
  3. Ve detalle de cada transacción.
- Alterno: 3a. Sin datos en periodo → "sin movimientos en este rango".

**CU-27.3 Generar reporte PDF (Actor: PDS)**
- Flujo principal:
  1. Solicita reporte PDF.
  2. Sistema genera documento con detalle completo.
  3. Usuario descarga PDF.
- Alterno: 2a. Error al generar → reintento habilitado.

**HU-28:** Como solicitante, quiero ver mis pagos realizados y comisiones pagadas, para tener trazabilidad financiera.

**Criterios de Aceptación:**
1. WHEN solicitante accede a dashboard THEN sistema SHALL mostrar pagos realizados
2. WHEN filtra por periodo THEN sistema SHALL mostrar pagos del rango
3. WHEN ve detalle THEN sistema SHALL mostrar comisiones incluidas
4. WHEN solicita reporte THEN sistema SHALL generar PDF

**CU-28.1 Ver pagos realizados (Actor: Solicitante)**
- Flujo principal:
  1. Accede a "Mis Pagos".
  2. Ve historial de pagos realizados.
  3. Ve detalle de comisiones pagadas por servicio.
- Alterno: 2a. Sin pagos → "sin pagos registrados".

**HU-29:** Como usuario, quiero ver el estado de mi billetera y monedas, para gestionar mis recursos.

**Criterios de Aceptación:**
1. WHEN usuario accede THEN sistema SHALL mostrar saldo billetera y monedas
2. WHEN ve monedas THEN sistema SHALL mostrar por tipo y vencimiento
3. WHEN hay transacciones pendientes THEN sistema SHALL mostrar estado

**CU-29.1 Ver estado de recursos (Actor: Usuario)**
- Flujo principal:
  1. Accede a "Mis Recursos".
  2. Ve saldo billetera disponible.
  3. Ve monedas por tipo (compradas, promocionales, ganadas).
  4. Ve transacciones pendientes.
- Alterno: 2a. Sin saldo → "sin fondos". 3a. Sin monedas → "sin monedas".

---

## Matriz de Trazabilidad (HU → RF)

| HU | RF | Módulo |
|----|----|--------|
| HU-01 | RF-01 | A. Gestión de Usuarios |
| HU-02 | RF-02 | A. Perfil de Habilidades |
| HU-03 | RF-03 | A. Reputación |
| HU-04 | RF-04 | D. Publicación |
| HU-05 | RF-05 | B. Motor IA |
| HU-06 | RF-06 | C. Visualización 3D |
| HU-07 | RF-07 | D. Contractual |
| HU-08 | RF-08 | D. Pagos |
| HU-09 | RF-09 | D. Trazabilidad |
| HU-10 | RF-10 | D. Formalización |
| HU-11 | RF-11 | Monetización |
| HU-12 | RF-12 | A. Verificación |
| HU-13 | RF-13 | Monetización |
| HU-14 | RF-14 | Monetización |
| HU-15 | RF-15 | Monetización |
| HU-16 | RF-16 | E. Comunicación |
| HU-17 | RF-17 | Legal / Marco regulatorio |
| HU-18 | RNF-07 | PWA (no funcional) |
| HU-19 | RF-22 | Desbloqueo de Información |
| HU-20 | RF-23 | Confirmación Dual |
| HU-21 | RF-24 | Gestión de Ofertas |
| HU-22 | RF-25 | Billetera Virtual |
| HU-23 | RF-26 | Modalidad de Cobro |
| HU-24 | RF-27 | Sistema de Monedas |
| HU-25 | RF-28 | Precios Sugeridos |
| HU-26 | RF-29 | Hitos de Pago |
| HU-27 | RF-30 | Dashboard Operativo PDS |
| HU-28 | RF-30 | Dashboard Operativo Solicitante |
| HU-29 | RF-25 | Estado de Recursos (Billetera/Monedas) |

---

*Versión: 2.0 — Derivado de `Requerimientos.md`. Nuevo modelo de billetera virtual y modalidades de cobro.*
