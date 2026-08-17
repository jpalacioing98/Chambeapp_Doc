# Historias de Usuario y Casos de Uso — ChambeApp

> Detalle de las historias de usuario y casos de uso derivados de `02_Requerimientos/Requerimientos.md` (RF-01 a RF-17).
> Formato: Historia de Usuario + Criterios de Aceptación (EARS) + Casos de Uso (flujo principal / alternos).
> **Decisión tecnológica:** Despliegue inicial como **PWA** (no app móvil nativa). Los casos de uso asumen acceso vía navegador/instalación PWA.
> **Marco legal:** Se incorporan restricciones de `05_Terminos_Condiciones/ChambeApp_Terminos_y_Condiciones.md` (escrow 48h, reembolsos, disputas, Habeas Data, edad 18+, naturaleza de intermediario).

---

## RF-01: Registro y Autenticación Segmentada

**HU-01:** Como usuario nuevo, quiero registrarme eligiendo mi rol (proveedor o solicitante), para acceder solo a las funciones que me corresponden.

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

**HU-02:** Como proveedor, quiero registrar mis habilidades y experiencia, para recibir servicios acordes a mi perfil.

**Criterios de Aceptación:**
1. WHEN proveedor edita perfil THEN sistema SHALL permitir habilidades, experiencia y categorías.
2. WHEN perfil completo THEN sistema SHALL habilitar visibilidad en búsquedas.
3. IF perfil incompleto THEN sistema SHALL limitar postulaciones según plan.

**CU-02.1 Completar perfil de proveedor (Actor: Proveedor)**
- Flujo principal:
  1. Accede a "Mi Perfil".
  2. Registra ≥1 categoría, habilidades, años de experiencia, zona.
  3. Guarda → perfil "Activo" y visible.
- Alterno: 3a. Sin categoría → bloquea activación.

---

## RF-03: Sistema de Reputación y Calificación

**HU-03:** Como solicitante, quiero calificar al proveedor tras un servicio, para construir confianza en la plataforma.

**Criterios de Aceptación:**
1. WHEN servicio finaliza THEN sistema SHALL permitir calificación mutua.
2. WHEN calificación registrada THEN sistema SHALL actualizar promedio.
3. IF calificación reportada THEN sistema SHALL revisar y ocultar si aplica.
4. WHEN servicio no completado THEN sistema SHALL bloquear calificación.

**CU-03.1 Calificar servicio (Actor: Solicitante / Proveedor)**
- Flujo principal:
  1. Servicio en "Completado".
  2. Usuario asigna puntaje (1–5) y comentario.
  3. Sistema actualiza promedio y publica en perfil.
- Alterno: 3a. Reporte de abuso → moderación oculta comentario.

---

## RF-04: Publicación de Servicios por Solicitante

**HU-04:** Como solicitante, quiero publicar un servicio con categoría, descripción, ubicación y presupuesto, para recibir postulaciones.

**Criterios de Aceptación:**
1. WHEN servicio creado THEN sistema SHALL requerir categoría, descripción, ubicación.
2. WHEN presupuesto definido THEN sistema SHALL validar mínimo $50.000.
3. WHEN publicado THEN sistema SHALL notificar a proveedores compatibles.
4. WHEN ubicación fuera de cobertura THEN sistema SHALL advertir (solo Valledupar).

**CU-04.1 Publicar servicio (Actor: Solicitante)**
- Flujo principal:
  1. Selecciona "Publicar servicio".
  2. Elige categoría, describe, fija ubicación (Valledupar) y presupuesto.
  3. Sistema valida y publica → notifica proveedores (RF-05).
- Alterno:
  - 2a. Presupuesto < $50.000 → error de validación.
  - 2b. Sin presupuesto → marca "a convenir".

---

## RF-05: Motor de Match / Recomendación (IA)

**HU-05:** Como solicitante, quiero ver proveedores sugeridos por IA ordenados por relevancia, para contratar rápido y con confianza.

**Criterios de Aceptación:**
1. WHEN servicio publicado THEN sistema SHALL generar ranking por similitud perfil/habilidades.
2. WHEN proveedor busca THEN sistema SHALL mostrar servicios afines.
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

**HU-06:** Como solicitante, quiero explorar un escenario 3D del servicio, para reducir incertidumbre antes de contratar.

**Criterios de Aceptación:**
1. WHEN servicio tiene recurso 3D THEN sistema SHALL renderizar escenario interactivo.
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

**HU-07:** Como usuario, quiero crear y seguir órdenes de trabajo en tiempo real, para formalizar el servicio.

**Criterios de Aceptación:**
1. WHEN solicitante acepta proveedor THEN sistema SHALL crear orden "Pendiente".
2. WHEN proveedor acepta THEN sistema SHALL pasar a "En progreso".
3. WHEN proveedor finaliza THEN sistema SHALL pasar a "Completado".
4. WHEN orden cancelada THEN sistema SHALL registrar motivo y notificar.
5. WHEN discrepan de estado THEN sistema SHALL abrir resolución/mediación.

**CU-07.1 Ciclo de orden de trabajo (Actores: Solicitante, Proveedor)**
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

**HU-09:** Como proveedor, quiero ver mi historial de ingresos, para tener registro formal de mi actividad.

**Criterios de Aceptación:**
1. WHEN proveedor abre panel THEN sistema SHALL mostrar historial de ingresos.
2. WHEN filtra por periodo THEN sistema SHALL mostrar ingresos del rango.
3. WHEN solicita certificado THEN sistema SHALL generar documento (RF-13).
4. WHEN ingreso registrado THEN sistema SHALL recalcular promedio mensual.

**CU-09.1 Consultar historial (Actor: Proveedor)**
- Flujo principal:
  1. Accede a "Mis Ingresos".
  2. Visualiza lista de servicios, montos, fechas.
  3. Aplica filtro de periodo.
- Alterno: 3a. Sin movimientos → estado "sin movimientos".

---

## RF-10: Alertas de Formalización / Enlace Legal

**HU-10:** Como proveedor, quiero recibir alertas sobre seguridad social, para acceder a protección laboral.

**Criterios de Aceptación:**
1. WHEN volumen de ingresos alcanzado THEN sistema SHALL alertar sobre seguridad social (Ley 1429/1562).
2. WHEN consulta sección legal THEN sistema SHALL mostrar guías de formalización.
3. WHEN +10 servicios/mes THEN sistema SHALL notificar descuento por volumen (RF-15).

**CU-10.1 Recibir alerta de formalización (Actor: Sistema / Proveedor)**
- Flujo principal:
  1. Sistema detecta umbral de ingresos/servicios.
  2. Envía alerta push/in-app con guía de seguridad social.
- Alterno: 2a. Usuario descarta → silencia sin borrar registro.

---

## RF-11: Suscripciones Premium

**HU-11:** Como proveedor establecido, quiero una suscripción con beneficios, para conseguir más servicios.

**Criterios de Aceptación:**
1. WHEN selecciona plan THEN sistema SHALL activar beneficios (Básico $15k / Pro $35k / Empresa $75k).
2. WHEN Pro/Empresa THEN sistema SHALL dar postulaciones ilimitadas y perfil destacado.
3. WHEN Empresa THEN sistema SHALL habilitar equipos y múltiples cuentas.
4. WHEN prueba 3 meses termina THEN sistema SHALL iniciar cobro.
5. WHEN cancela THEN sistema SHALL degradar al fin del ciclo.

**CU-11.1 Suscribirse a Premium (Actor: Proveedor)**
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

**HU-13:** Como proveedor, quiero un certificado oficial de ingresos, para trámites bancarios o de vivienda.

**Criterios de Aceptación:**
1. WHEN solicita certificado ($25k) THEN sistema SHALL generar con nombre, historial 12 meses, promedio, servicios, calificación, verificación.
2. WHEN generado THEN sistema SHALL marcarlo verificado.
3. WHEN descarga THEN sistema SHALL registrar emisión.

**CU-13.1 Generar certificado (Actor: Proveedor)**
- Flujo principal:
  1. Solicita certificado y paga $25k.
  2. Sistema compila datos y genera PDF verificado.
  3. Usuario descarga.
- Alterno: 2a. Sin ingresos → indica insuficiencia de datos.

---

## RF-14: Servicios de Valor Agregado

**HU-14:** Como proveedor, quiero pagar por visibilidad y credenciales, para destacar frente a la competencia.

**Criterios de Aceptación:**
1. WHEN compra Destacado ($10k/día) THEN sistema SHALL posicionar en primeras posiciones 24h.
2. WHEN compra Badge ($15k) THEN sistema SHALL mostrar certificación verificada.
3. WHEN compra Portafolio ($8k/mes) THEN sistema SHALL habilitar galería.
4. WHEN compra Push Ilimitadas ($5k/mes) THEN sistema SHALL enviar alertas en tiempo real.
5. WHEN periodo expira THEN sistema SHALL remover beneficio.

**CU-14.1 Comprar servicio adicional (Actor: Proveedor)**
- Flujo principal:
  1. Selecciona servicio y paga.
  2. Sistema activa beneficio por periodo definido.
- Alterno: 2a. Expiración → remoción automática.

---

## RF-15: Comisiones por Transacción

**HU-15:** Como plataforma, quiero cobrar comisiones solo en transacción exitosa, para alinear incentivos.

**Criterios de Aceptación:**
1. WHEN servicio pagado THEN sistema SHALL cobrar 12% proveedor + 8% solicitante.
2. WHEN valor < $50.000 THEN sistema SHALL eximir comisión.
3. WHEN proveedor >10 servicios/mes THEN sistema SHALL aplicar 10% descuento.
4. WHEN proveedor nuevo (3 meses) THEN sistema SHALL aplicar 0% comisión.
5. WHEN reembolso THEN sistema SHALL reversar comisiones.

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
1. WHEN servicio aceptado/cancelado THEN sistema SHALL notificar push a ambas partes.
2. WHEN nueva postulación THEN sistema SHALL notificar solicitante.
3. WHEN orden cambia estado THEN sistema SHALL notificar involucrados.
4. WHEN mensaje enviado THEN sistema SHALL entregarlo en tiempo real.
5. WHEN usuario offline THEN sistema SHALL reencolar y entregar al reconectar.

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

---

*Versión: 1.0 — Derivado de `Requerimientos.md`.*
