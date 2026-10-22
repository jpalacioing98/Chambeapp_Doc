# Fase 2 — Plan de Actualización de Historias de Usuario

> **Objetivo:** Actualizar el catálogo de requerimientos (`documentation/Requerimientos/HistoriasDeUsuario.md`) para que refleje de forma fidedigna el comportamiento real del código (`backend/` y `frontend/` en rama `Dev`), incorporando notas de brechas conocidas y creando las historias faltantes para los módulos sin documentación.
> **Trazabilidad:** Basado en el [Informe de discrepancias de Fase 1](Fase1_Informe_Discrepancias.md) y el [Registro de Riesgos Conocidos](Riesgos_Conocidos.md).
> **Regla de oro:** El código es la fuente de verdad. No se modifica el código de la aplicación.
> **Estado:** **EJECUTADO Y CERRADO (100%)**. Todas las historias han sido actualizadas y consolidadas en `HistoriasDeUsuario.md` v3.0 (HU-01 a HU-75).

---

## 1. Fundamentos y Riesgos de Seguridad

- [x] **P2-01:** Crear el [Registro de Riesgos Conocidos](Riesgos_Conocidos.md) documentando formalmente las brechas de seguridad (S-01 a S-04, R-01 a R-19) y limitaciones operativas encontradas en el código sin modificarlo.
- [x] **P2-02:** Diseñar el borrador de las nuevas Historias de Usuario (HU-41 a HU-75) cubriendo los módulos inventariados (Chambas, Marañas, Negocios, Comerciante, Anuncios, KYC, Habilidades, 2FA, OTP, Email, Password, Sesión/Tokens, Regiones, Admin, Superadmin, Disputas, Tickets, Onboarding, Preferencias, Métodos de Pago, Proveedores, Portafolio, Notificaciones, Chat y Legal).

---

## 2. Actualización de Historias de Usuario Existentes (HU-01 a HU-40)

- [x] **P2-03 (HU-01 / RF-01 — Autenticación y Registro):**
  - Reflejar que el registro público admite 3 roles (`pds`, `solicitante`, `merchant`).
  - Corregir el criterio de bloqueo: no hay bloqueo por cuenta a 3 intentos; existe *rate limit* de 5 intentos/15 min por IP en memoria (desactivado en dev/test).
  - Agregar nota de brecha conocida: no se valida mayoría de edad (`edad_verificada = False`, D-07, R-13).
  - Documentar integración de 2FA y OTP en el flujo de autenticación.
- [x] **P2-04 (HU-02 / RF-02 — Perfil de Proveedor):**
  - Ajustar regla: la limitación de postulaciones se rige estrictamente por el plan de suscripción (Free 3, Básico 15, Profesional ilimitado), no por `perfil_completo` (D-25).
  - Incluir derivación regional automática en actualización de zona.
- [x] **P2-05 (HU-03 / RF-03 — Reputación y Calificación):**
  - Aclarar que la calificación de la solicitud exige estado completado y autor único, pero el endpoint actual no valida pertenencia de la contraparte (D-08, R-06).
  - Indicar que la calificación de la Chamba (`rating_estrellas`) es independiente y no recalcula `Profile.calificacion_promedio`.
- [x] **P2-06 (HU-04 / RF-04 — Publicación de Solicitudes):**
  - Ajustar ciudad base: Medellín por defecto en configuración del sistema / Valledupar en modelo de datos; ubicaciones fuera de cobertura emiten advertencia y no bloquean (D-12).
  - Nota de brecha conocida: publicar una solicitud no dispara notificaciones en cascada a proveedores (D-09, R-19).
- [x] **P2-07 (HU-05 / RF-05 — Motor de Recomendación IA):**
  - Aclarar que la recomendación se ejecuta bajo demanda (`GET /ai/recommendations`) y no automáticamente al publicar la solicitud (D-13).
  - Describir modelo híbrido (ML / heurístico / fallback).
- [x] **P2-08 (HU-06 / RF-06 — Visualización Panorámica):**
  - Actualizar especificación técnica: visor panorámico 360° implementado con **Photo Sphere Viewer** (no A-Frame); no existe escenario 3D interactivo ni degradación por `navigator.connection` (D-14).
- [x] **P2-09 (HU-07 / RF-07 — Gestión Contractual):**
  - Documentar los estados reales del contrato: `creado`, `aceptado`, `completado_pendiente`, `completado`, `cancelado` (D-23).
  - Nota de brecha: no existe auto-aprobación a las 48h para el contrato general; el estado permanece en `completado_pendiente` hasta confirmación o cancelación (D-04).
- [x] **P2-10 (HU-08 / RF-08 — Pasarela de Pagos e Ingresos):**
  - Reflejar la realidad del código: pasarela configurada con **Nequi manual y MockGateway** que siempre aprueba; MercadoPago/PSE no están activos en producción (D-01, R-15).
  - Documentar que el retiro solo traslada saldo a `saldo_bloqueado` sin procesar transferencia bancaria real.
- [x] **P2-11 (HU-09 / RF-09 — Historial de Ingresos):**
  - Actualizar generación de reportes: descarga de CSV de historial de pagos y generación gratuita de PDF de certificado de ingresos (D-26).
- [x] **P2-12 (HU-10 / RF-10 — Alertas y Formalización):**
  - Indicar que la notificación se genera al completar un contrato (idempotente). Las alertas por umbrales de ingresos específicos y descuento por volumen quedan marcadas como no implementadas en el código (D-21).
- [x] **P2-13 (HU-11 / RF-11 — Suscripciones y Planes):**
  - Reflejar suscripción simulada (`mock`, vigencia 30 días). Documentar que la cancelación revierte inmediatamente a Free y que las monedas de bienvenida no son abonadas automáticamente por el backend (D-06).
- [x] **P2-14 (HU-12, HU-13, HU-14 — Monetización y Servicios de Valor Agregado):**
  - HU-12: Aclarar que la verificación de identidad se canaliza por el módulo KYC con SLA de 48h (alerta admin en TODO). No existe verificación Express de $20k/4h (D-20).
  - HU-13: Aclarar que la generación de certificado de ingresos no cobra tarifa de $25k (es gratuita vía PDF/CSV) (D-20).
  - HU-14: Documentar que los servicios de valor agregado de pago por día/mes (destacado de pago, badge de pago, push de pago) no están implementados como compras individuales; `destacado` se otorga únicamente por plan Profesional (D-20).
- [x] **P2-15 (HU-15 / RF-15 — Comisiones de Plataforma):**
  - Documentar discrepancia de cálculo: `crear_pago` calcula 12% + 8%; la confirmación de contrato descuenta 12% solo en modalidad A. No existen los descuentos por volumen (-10%) ni la exención de 3 meses a PDS nuevo (D-05, R-16).
- [x] **P2-16 (HU-16, HU-18 — Notificaciones y Experiencia PWA):**
  - HU-16: Aclarar que las notificaciones en tiempo real operan mediante Socket.IO y registros en base de datos in-app; no hay Push API web nativa (D-15).
  - HU-18: Documentar PWA con manifiesto y caché estático Workbox; registrar brecha de ausencia de sincronización offline en segundo plano (D-15).
- [x] **P2-17 (HU-17 / RF-17 — Marco Legal y Términos):**
  - Reflejar que el registro valida clickwrap de T&C pero fija internamente `TYC_VERSION = "1.0"` independientemente de publicaciones del superadmin (D-07). Documentar ausencia de validación de edad.
- [x] **P2-18 (HU-19 / RF-22 — Desbloqueo de Información y Privacidad):**
  - Aclarar que las coordenadas se liberan al existir contrato (al aceptar la oferta), y que el chat no cuenta con bloqueo previo (cualquier usuario autenticado puede abrir conversación) (D-03, R-05).
- [x] **P2-19 (HU-20 / RF-23 — Confirmación de Finalización):**
  - Eliminar la aserción de auto-confirmación a 48h para contratos (D-04). El flujo de cierre formal y liquidación dual corresponde al módulo Chamba (HU-44 y HU-45).
- [x] **P2-20 (HU-21 / RF-24 — Gestión de Ofertas):**
  - Actualizar flujo: no existe modificación unilateral de oferta; se gestiona mediante negociación bilateral (`/responder` con contraofertas). Aceptar una oferta rechaza automáticamente las restantes (D-16).
- [x] **P2-21 (HU-22 / RF-25 — Billetera Virtual):**
  - Registrar que la billetera se crea bajo demanda (`get_or_create_wallet`). Depósitos acreditan inmediatamente sin pasarela bancaria. Retiro mínimo $10.000, depósito mínimo $1.000 (D-17).
- [x] **P2-22 (HU-23 / RF-26 — Modalidad de Cobro):**
  - Describir comportamiento verificado: Modalidad A por defecto. En modalidad B se descuentan 50 monedas al PDS al momento en que el solicitante acepta la oferta (D-18).
- [x] **P2-23 (HU-24 / RF-27 — Sistema de Monedas):**
  - Registrar catálogo exacto de paquetes con bonus: Básico 50, Estándar 150 (+15 bonus), Premium 350 (+50 bonus) (D-22). Tareas de expiración programadas.
- [x] **P2-24 (HU-26 / RF-29 — Hitos de Pago):**
  - Actualizar: aprobar hito no descuenta comisiones ni transfiere saldo; rechazar no abre disputa automáticamente. Registrar existencia de auto-aprobación a 48h en hitos (`auto_approve_milestones`) (D-19).
- [x] **P2-25 (HU-31, HU-32 / RF-ML-2, RF-ML-3 — IA y Thompson Bandit):**
  - Aclarar que el Thompson Bandit no rota categorías en la interfaz pública; se utiliza para calcular el parámetro `bandit_arm_value` como característica del modelo de ranking ML (D-13).
- [x] **P2-26 (HU-36 / RF-Geo-2 — Cascada Geoespacial):**
  - Cambiar estado de ✅ IMPLEMENTADO a ⚠️ DEFINIDO PERO NO CABLEADO: el servicio `CascadeManager.start_cascade` no tiene invocación desde los controladores de publicación de solicitudes (D-09, R-19).
- [x] **P2-27 (HU-37 / RF-360-1 — Visor Panorámico):**
  - Corregir componente tecnológico: Photo Sphere Viewer en lugar de A-Frame (D-14).

---

## 3. Incorporación de Nuevas Historias de Usuario (HU-41 a HU-75)

- [x] **P2-28 (HU-41 a HU-45): Módulo Chamba (Flujo Núcleo de Ejecución de 6 Hitos):**
  - HU-41: Expediente de Chamba y máquina de estados (`programada → en_proceso → en_ejecucion ⇄ pausada → pendiente_validacion → liquidacion_confirmada → finalizada`).
  - HU-42: Hito 2 — Inicio de obra con validación geoespacial (100 m) y evidencia de entrada.
  - HU-43: Hito 3 — Adendas al contrato, novedades y botón de pánico / pausa.
  - HU-44: Hito 4 — Solicitud de cierre con evidencia de salida y revisión de habilidades.
  - HU-45: Hitos 5 y 6 — Pago directo dual (check-in de ambas partes) y calificación final.
- [x] **P2-29 (HU-46): Módulo Marañas (Micro-solicitudes / Rebusques):**
  - HU-46: Derivación de adendas a marañas públicas, postulación de PDS, negociación y pago dual.
- [x] **P2-30 (HU-47 a HU-49): Módulo Comerciante y Directorio de Negocios:**
  - HU-47: Registro y gestión de negocio por rol `merchant` (horarios, galería MinIO, slug).
  - HU-48: Directorio público, mapa interactivo (pins/clusters), búsqueda fuzzy, calificaciones y reportes con generación de tickets.
  - HU-49: Dashboard de comerciante, métricas de negocio, métodos de pago y preferencias.
- [x] **P2-31 (HU-50 y HU-51): Módulo Anuncios Laborales:**
  - HU-50: Publicación, cierre y reapertura de anuncios laborales por comercios.
  - HU-51: Postulación de PDS y gestión de contacto por el negocio (no vinculante).
- [x] **P2-32 (HU-52 y HU-53): Módulo KYC y Verificación de Identidad:**
  - HU-52: Carga de documentos requeridos por rol (PDS, Solicitante, Comerciante).
  - HU-53: Bandeja de revisión scoped por región y recálculo de verificación de perfil.
- [x] **P2-33 (HU-54 y HU-55): Módulo de Oficios y Habilidades:**
  - HU-54: Catálogo nacional de oficios, rutas de niveles y evaluación por quiz (umbral 80%).
  - HU-55: Endosos sociales, certificaciones técnicas SENA/instituciones y progresión Novato → Experto.
- [x] **P2-34 (HU-56 a HU-60): Seguridad, Identidad y Sesión:**
  - HU-56: Verificación en dos pasos (2FA) vía SMS con código de 6 dígitos.
  - HU-57: Verificación de teléfono por OTP.
  - HU-58: Verificación de correo electrónico.
  - HU-59: Recuperación y cambio seguro de contraseña.
  - HU-60: Sesión con access token (30 min), refresh token rotativo (7 días) y revocación por versión de rol.
- [x] **P2-35 (HU-61 a HU-63): División Regional y Panel Administrativo:**
  - HU-61: Catálogo regional, derivación automática por ubicación y regla anti doble-conteo.
  - HU-62: Gestión de usuarios y personal regional (verificador/soporte) por administradores.
  - HU-63: Moderación regional de solicitudes, contratos y calificaciones.
- [x] **P2-36 (HU-64 y HU-65): Disputas y Soporte Técnico:**
  - HU-64: Apertura y resolución de disputas de contratos.
  - HU-65: Creación y gestión de tickets de soporte.
- [x] **P2-37 (HU-66 y HU-67): Módulo Superadministrador:**
  - HU-66: Gestión de personal interno, overrides de cuentas/contratos y logs de auditoría.
  - HU-67: Parámetros globales, feature flags, pesos de IA, versiones de T&C y reindexación regional.
- [x] **P2-38 (HU-68 a HU-75): Experiencia de Usuario, Finanzas y Legal:**
  - HU-68: Onboarding guiado por pasos.
  - HU-69: Preferencias de interfaz y notificaciones.
  - HU-70: Métodos de pago vinculados (cuentas bancarias y billetera del sistema).
  - HU-71: Búsqueda pública de proveedores PDS activos.
  - HU-72: Perfil público con portafolio de evidencias MinIO.
  - HU-73: Centro de notificaciones in-app.
  - HU-74: Mensajería y chat 1:1 en tiempo real.
  - HU-75: Consulta pública de documentos legales (T&C, Política de Datos).

---

## 4. Trazabilidad y Consolidación

- [x] **P2-39:** Actualizar la Matriz de Trazabilidad global (HU → RF) integrando todas las historias de HU-01 a HU-75.
- [x] **P2-40:** Verificar preservación del formato documental (CRLF, estilo EARS, estructura CU, enlaces markdown).
- [x] **P2-41:** Actualizar `PROGRESO.md` marcando el cierre de la Fase 2 y enlazando los entregables.

