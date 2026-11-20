# Manual de Usuario — ChambeApp

> **Versión:** 1.11.0 | **Fecha:** 2026-11-18 | **Plataforma:** iOS / Android / Web PWA

---

## 📑 Índice General

1. [Introducción y Primeros Pasos](#1-introducción-y-primeros-pasos)
2. [Roles de Usuario y Qué Puedes Hacer](#2-roles-de-usuario-y-qué-puedes-hacer)
3. [Autenticación y Seguridad](#3-autenticación-y-seguridad)
4. [Módulo Solicitante — Publicar y Gestionar Trabajos](#4-módulo-solicitante--publicar-y-gestionar-trabajos)
5. [Módulo PDS (Prestador) — Encontrar y Ejecutar Trabajos](#5-módulo-pds-prestador--encontrar-y-ejecutar-trabajos)
6. [Módulo Merchant / Negocio — Anuncios y Servicios](#6-módulo-merchant--negocio--anuncios-y-servicios)
7. [Billetera y Monedas (ChambeCoins)](#7-billetera-y-monedas-chambecoins)
8. [Chat y Comunicaciones](#8-chat-y-comunicaciones)
9. [Notificaciones](#9-notificaciones)
10. [Perfil, KYC y Verificación](#10-perfil-kyc-y-verificación)
11. [Contratos, Chambas y Pagos](#11-contratos-chambas-y-pagos)
12. [Calificaciones, Endosos y Confianza](#12-calificaciones-endosos-y-confianza)
13. [Panel Superadmin (Solo Administradores)](#13-panel-superadmin-solo-administradores)
14. [Preguntas Frecuentes (FAQ)](#14-preguntas-frecuentes-faq)
15. [Glosario de Términos](#15-glosario-de-términos)
16. [Soporte y Contacto](#16-soporte-y-contacto)

---

## 1. Introducción y Primeros Pasos

### 1.1 ¿Qué es ChambeApp?
ChambeApp es una plataforma digital que conecta **quienes necesitan un trabajo** (Solicitantes) con **quienes saben hacerlo** (PDS — Prestadores de Servicios), y permite a **negocios locales** (Merchants) publicar vacantes y servicios. Todo ocurre en un entorno seguro con verificación de identidad, contratos digitales, pagos en monedas virtuales y sistema de reputación.

### 1.2 Descarga e Instalación
| Plataforma | Cómo Acceder |
|------------|--------------|
| **iOS** | App Store → Buscar "ChambeApp" → Instalar |
| **Android** | Google Play → Buscar "ChambeApp" → Instalar |
| **Web (PWA)** | Abrir `https://app.chambeapp.com` en navegador → Menú ☰ → "Instalar app" |
| **Escritorio** | Versión web responsive en cualquier navegador moderno |

> **Nota:** La PWA funciona offline para ver datos cargados; necesita conexión para acciones en tiempo real (chat, ofertas, pagos).

### 1.3 Registro de Cuenta
1. Abre la app → **"Crear cuenta"**
2. Elige tu **rol principal** (puedes tener varios roles en una misma cuenta):
   - **Solicitante** — Quiero contratar servicios
   - **PDS (Prestador)** — Quiero ofrecer mis habilidades
   - **Merchant / Negocio** — Tengo un local/comercio y quiero publicar
3. Ingresa: email, contraseña segura, nombre completo
4. Acepta **Términos y Condiciones** y **Política de Privacidad**
5. Verifica tu email (código de 6 dígitos)
6. ¡Listo! Accede a tu **Home** según tu rol

### 1.4 Primer Inicio — Onboarding
Al entrar por primera vez, la app te guía en 3-5 pasos según tu rol:
- **Solicitante:** Cómo publicar una solicitud, recibir ofertas, firmar contrato
- **PDS:** Completar perfil, añadir habilidades, ver solicitudes cercanas, ofertar
- **Merchant:** Crear ficha de negocio, publicar anuncio, gestionar postulaciones
- **Común:** Subir foto de perfil, activar notificaciones, configurar zona de trabajo

> **Tip:** Completa el onboarding al 100% para desbloquear todas las funciones y ganar tus primeras **ChambeCoins** de bienvenida.

---

## 2. Roles de Usuario y Qué Puedes Hacer

| Función | Solicitante | PDS (Prestador) | Merchant / Negocio | Staff / Admin |
|---------|-------------|-----------------|-------------------|---------------|
| **Publicar solicitudes de trabajo** | ✅ | ❌ | ✅ (como solicitante) | ❌ |
| **Recibir y gestionar ofertas** | ✅ | ❌ | ✅ | ❌ |
| **Ver solicitudes cercanas / mapa** | ✅ | ✅ | ✅ | ✅ |
| **Enviar ofertas a solicitudes** | ❌ | ✅ | ❌ | ❌ |
| **Publicar anuncios laborales** | ❌ | ❌ | ✅ | ❌ |
| **Gestionar postulaciones a anuncios** | ❌ | ❌ | ✅ | ❌ |
| **Firmar contratos digitales** | ✅ | ✅ | ✅ (como parte) | ❌ |
| **Subir evidencias de trabajo (chamba)** | ✅ | ✅ | ❌ | ❌ |
| **Comprar / usar ChambeCoins** | ✅ | ✅ | ✅ | ❌ |
| **Chat con contraparte** | ✅ | ✅ | ✅ | ✅ (soporte) |
| **Ver billetera y movimientos** | ✅ | ✅ | ✅ | ✅ (superadmin) |
| **Calificar / endosar habilidades** | ✅ | ✅ | ✅ | ❌ |
| **Panel de métricas y analítica** | ❌ | ❌ | ❌ | ✅ (superadmin) |
| **Gestionar usuarios / KYC** | ❌ | ❌ | ❌ | ✅ (staff/admin) |
| **Configurar tarifas y paquetes** | ❌ | ❌ | ❌ | ✅ (superadmin) |

> **Nota:** Un mismo usuario puede tener **múltiples roles** (ej. ser Solicitante y PDS a la vez). Cambia de vista desde el menú lateral o el selector de rol en el header.

---

## 3. Autenticación y Seguridad

### 3.1 Inicio de Sesión
- **Email + Contraseña** (estándar)
- **Recordarme** (30 días, opcional)
- **Olvidé mi contraseña** → Recuperación por email (enlace válido 1 hora)

### 3.2 Autenticación de Dos Factores (2FA)
- **Obligatorio** para roles Staff, Admin, Superadmin
- **Opcional** para Solicitante, PDS, Merchant (recomendado)
- Métodos: **SMS** (código 6 dígitos) o **App Autenticadora** (TOTP)
- Códigos de respaldo (10 códigos de un solo uso — guárdalos seguros)

### 3.3 Gestión de Sesiones
- Ver dispositivos activos: **Perfil → Seguridad → Sesiones activas**
- Cerrar sesión en todos los dispositivos: **Un clic**
- Expiración automática: 30 días de inactividad

### 3.4 Bloqueo y Desbloqueo de Cuenta
- 5 intentos fallidos → Bloqueo temporal 15 min
- Desbloqueo: enlace al email o soporte

---

## 4. Módulo Solicitante — Publicar y Gestionar Trabajos

### 4.1 Home Solicitante
- **Buscar PDS / Negocios** (mapa + lista con filtros)
- **Mis Solicitudes** (pestañas: Publicadas, En curso, Completadas, Canceladas)
- **Mis Ofertas Recibidas** (pendientes, aceptadas, rechazadas)
- **Accesos rápidos:** Nueva solicitud, Billetera, Chat, Notificaciones

### 4.2 Crear Nueva Solicitud (Paso a Paso)

#### Paso 1: Qué necesitas
- **Título** (ej. "Fuga de agua en baño principal")
- **Categoría** (plomería, electricidad, pintura, carpintería, limpieza, jardinería, construcción, tecnología, diseño, cuidado personas, eventos, transporte, cocina, otros)
- **Descripción detallada** (qué se necesita, materiales, condiciones)
- **Ubicación** (dirección + punto en mapa + radio de cobertura)
- **Presupuesto** (opcional — "A convenir" o monto en COP)
- **Urgencia:** Hoy / Esta semana / Flexible
- **Fecha deseada** (opcional)
- **Horario preferido** (Mañana / Tarde / Noche / Flexible)
- **Fotos** (hasta 3 — opcional)
- **Foto 360°** (opcional — para trabajos complejos)
- **Especificaciones técnicas** (opcional)

#### Paso 2: Revisión y Publicación
- Vista previa de cómo verán los PDS
- **Costo en ChambeCoins:** 10 monedas (se descuenta al publicar)
- **Confirmar** → La solicitud queda en estado **PUBLICADO**

> **Nota:** Si no tienes monedas suficientes, la app te lleva a **Comprar Monedas** → tras la compra, vuelve y publica automáticamente.

### 4.3 Gestión de Solicitudes Publicadas

| Estado | Qué Significa | Acciones Disponibles |
|--------|---------------|---------------------|
| **PUBLICADO** | Visible para PDS, recibiendo ofertas | Ver ofertas, Editar, Cerrar, Cancelar |
| **EN CURSO** | Contrato firmado, trabajo iniciado | Ver chamba, Subir evidencias, Chat |
| **COMPLETADO** | Trabajo finalizado y confirmado | Calificar, Endosar habilidades, Ver certificado |
| **CANCELADO** | Cancelado por ti o PDS | Ver motivo, Reabrir (si aplica) |

#### Acciones Principales:
- **Ver Ofertas:** Lista de PDS que ofertaron (monto, mensaje, fecha propuesta, rating)
- **Aceptar Oferta:** Elige una → Firma digital (firma + documento) → Se crea **Contrato**
- **Contraoferta:** Propón nuevo monto/fecha/horario → PDS acepta/rechaza
- **Cerrar Solicitud:** Deja de recibir ofertas (puedes reabrir luego pagando 5 monedas)
- **Cancelar:** Solo si no hay contrato firmado → Motivo obligatorio → Reembolso monedas si aplica

### 4.4 Contratos y Chambas
Al aceptar una oferta (ambas partes firman):
1. Se crea **Contrato** (estado `EN_PROGRESO`)
2. Se genera **Chamba** (expediente de gestión del trabajo)
3. **PDS hace Check-in** al iniciar → `inicio_en`
4. **PDS hace Check-out** al terminar → `fin_en` → estado `COMPLETADO_PENDIENTE`
5. **Tú confirmas** → Estado `COMPLETADO` → Se liberan ChambeCoins de fidelidad (10 monedas al PDS)

#### Evidencias en Chamba
- **Entrada:** Fotos/video al llegar (obligatorio para check-in)
- **Salida:** Fotos/video del trabajo terminado (obligatorio para check-out)
- **Adendas (Marañas):** Trabajos extra → se crean como Maranas vinculadas al contrato
- **Novedades:** Comentarios con fotos durante el trabajo

### 4.5 Calificación y Endosos
Al completar:
1. **Califica al PDS** (1-5 estrellas + comentario opcional)
2. **Endosa habilidades** (marca competencias que demostró — 5 endosos = habilidad validada en su perfil)
3. Recibes **Certificado de finalización** (PDF descargable)

---

## 5. Módulo PDS (Prestador) — Encontrar y Ejecutar Trabajos

### 5.1 Home PDS
- **Mapa de Solicitudes Cercanas** (pines por categoría, radio ajustable)
- **Lista de Solicitudes** (filtros: categoría, radio, urgencia, presupuesto)
- **Mis Chambas** (En curso, Programadas, Completadas)
- **Mis Ofertas Enviadas** (Pendientes, Aceptadas, Rechazadas)
- **Portafolio / Mis Oficios** (gestión de habilidades y trabajos previos)

### 5.2 Perfil Profesional (Tu Tarjeta de Presentación)
Completa al 100% para aparecer en búsquedas y ganar confianza:
- **Foto profesional** (cara visible, fondo neutro)
- **Oficios / Habilidades** (selecciona del catálogo nacional CUOC/SENA)
- **Experiencia** (años, descripción libre)
- **Zona de trabajo** (barrios/ciudades donde operas)
- **Categorías** (dónde quieres aparecer en búsquedas)
- **Portafolio** (hasta 20 fotos de trabajos anteriores con descripción)
- **Horarios de disponibilidad** (opcional)

> **Regla:** Perfil incompleto → no apareces en búsquedas ni recomendaciones.

### 5.3 Encontrar Trabajo — Flujo Completo

#### 1. Explorar Solicitudes
- **Mapa interactivo** (pines por categoría, color por urgencia)
- **Lista con filtros:** Categoría, Radio (1-50km), Urgencia, Presupuesto mínimo
- **Vista detalle:** Ver descripción, fotos, presupuesto, ubicación, solicitante

#### 2. Enviar Oferta
- **Monto** (en COP — obligatorio si solicitante puso "A convenir")
- **Mensaje** (presentación, cómo lo harás, materiales)
- **Fecha propuesta** (si solicitante dejó "Flexible")
- **Horario propuesto**
- **Costo en ChambeCoins:** 0 (ofertar es gratis; solo pagas al firmar contrato)

#### 3. Gestión de Ofertas
| Estado | Qué Pasa | Tus Acciones |
|--------|----------|--------------|
| **PENDIENTE** | Solicitante no ha respondido | Retirar, Editar monto/mensaje |
| **ACEPTADA** | Solicitante te eligió | Firmar contrato (ver 5.4) |
| **RECHAZADA** | No te eligieron | Ver motivo, buscar otras |
| **CONTRAOFERTA** | Solicitante propone cambios | Aceptar / Contraofertar / Rechazar |

#### 4. Firmar Contrato (Cuando Tu Oferta Es Aceptada)
1. Recibes notificación → Abre solicitud → **"Firmar Contrato"**
2. Lee el contrato digital (partes, alcance, monto, fechas, condiciones)
3. **Firma digital:** Dibuja firma, tipo de documento, número, fecha
4. **Costo en ChambeCoins:** Se descuenta al firmar (fórmula: `trunc((monto × 3%) / 100) + 1` monedas, mínimo 10)
5. Si **ambas partes firman** → Contrato `EN_PROGRESO` + Chamba creada

#### 5. Ejecutar el Trabajo (Chamba)
1. **Check-in** al llegar: Foto + GPS obligatorio → `inicio_en`
2. **Durante:** Sube fotos, comenta avances, registra novedades
3. **Marañas (Adendas):** Si hay trabajo extra → Crea Marana → Solicitante aprueba → Se suma al contrato
3. **Check-out** al terminar: Foto final + GPS → `fin_en` → Solicitante confirma
4. **Recibes:** 10 ChambeCoins de fidelidad + Calificación + Posibles endosos

### 5.4 Portafolio y Oficios
- **Portafolio:** Sube fotos de trabajos terminados (antes/después, detalles)
- **Oficios:** Gestiona tus habilidades certificadas (CUOC/SENA)
- **Endosos recibidos:** Qué competencias te han validado clientes

### 5.5 Billetera PDS (Ver sección 7)

---

## 6. Módulo Merchant / Negocio — Anuncios y Servicios

### 6.1 Home Merchant
- **Mapa de mi Negocio** (punto fijo + banner rotativo de anuncios activos)
- **Mis Anuncios** (Publicados / Cerrados — pestañas)
- **Mis Solicitudes** (como solicitante — si también eres cliente)
- **Postulaciones a Mis Anuncios** (gestión de contactos)

### 6.2 Crear y Gestionar Mi Negocio
1. **Datos básicos:** Nombre, tipo (comercio/servicio/restaurante/otros), descripción
2. **Ubicación:** Dirección + punto en mapa + radio de cobertura (km)
3. **Horarios:** Lunes-Domingo (abierto/cerrado, hora apertura/cierre)
4. **Contacto:** Teléfono, WhatsApp, Instagram, Facebook, Web
4. **Imágenes:** Logo, Banner, Galería (hasta 10 fotos)
5. **Categorías principales** (gastronomía, belleza, tecnología, construcción, etc.)
6. **Verificación KYC:** Obligatoria para publicar (ver sección 10)

> **Verificado =** Badge verde en mapa y perfil + prioridad en búsquedas

### 6.3 Publicar Anuncio Laboral
1. **Tipo:** Empleo / Servicio / Producto / Oferta
2. **Título** (ej. "Se busca mesero turno noche")
3. **Categoría** + **Descripción** detallada
4. **Ubicación** (auto: tu negocio o punto personalizado en mapa)
5. **Vacantes** (si es empleo) / **Precio** (si servicio/producto/oferta)
6. **Visibilidad:** En mapa (público) / Solo perfil (privado)
7. **Costo en ChambeCoins:** 10 monedas (publicar) / 5 monedas (reactivar si cerraste)

### 6.4 Gestionar Anuncios
| Acción | Qué Hace |
|--------|----------|
| **Gestionar** | Ver postulaciones, contactar, seleccionar, descartar |
| **Cerrar** | Deja de recibir postulaciones (motivo obligatorio si no seleccionaste a nadie) |
| **Reabrir** | Vuelve a público (cuesta 5 monedas) |
| **Seleccionar Candidato** | Marca uno como "Seleccionado" → Notifica al elegido |
| **Editar** | Modifica título, descripción, horario, fotos |

### 6.5 Postulaciones a Tus Anuncios
- **Ver perfil del postulante** (rating, habilidades, portfolio, KYC)
- **Acciones:** Contactar (chat), Seleccionar, Descartar
- **Seleccionar** → Notifica al postulante + cierra anuncio automáticamente
- **Historial** de todas las postulaciones recibidas

---

## 7. Billetera y Monedas (ChambeCoins)

### 7.1 Qué Son las ChambeCoins
- **Moneda virtual** de la plataforma (no criptomoneda, no retirable a efectivo)
- Se **compran con COP reales** (pasarela simulada ChambePay)
- Se **gastan dentro de la app**: firmar contratos, publicar/reactivar anuncios, destacar solicitudes
- **Se ganan:** 10 monedas al completar trabajo (fidelidad), bonos promocionales, referidos

### 7.2 Vista Principal de Billetera
Dos pestañas principales:

#### 🪙 Pestaña **Monedas**
- **Saldo actual** (grande, visible)
- **Desglose histórico:** Compradas / Promocionales / Ganadas / Gastadas
- **Pestañas internas:**
  - **Movimientos:** Historial completo (fecha, tipo, cantidad, saldo resultante, referencia)
  - **Pagos:** Métodos de pago vinculados (billetera virtual + cuentas bancarias)
  - **Paquetes:** Catálogo de paquetes de monedas disponibles

#### 💰 Pestaña **Finanzas** (Solo métricas — ledger COP interno)
- **Resumen:** Ingresos / Egresos / Neto (COP de actividad en app)
- **Desglose:** Por chambas, marañas, contratos, comisiones, retiros
- **Actividad:** Historial de transacciones COP (solo lectura)

### 7.3 Comprar Monedas — Flujo Realista (ChambePay)

1. **Botón "Recargar monedas"** o desde modal "Monedas insuficientes"
2. **Pantalla Comprar Monedas** (`/comprar-monedas`):
   - Ve tu saldo actual
   - Si venís de una acción (firmar, publicar), muestra: *"Te faltan N monedas para [acción]"*
   - **Catálogo de paquetes** (cards con nombre, monedas totales, bonus, precio COP, badge "Oferta" si aplica)
   - **Botón "Comprar"** por paquete
2. **Checkout — Pago Simulado ChambePay**:
   - Crea **Pago Pendiente** (estado `pendiente`, expira 15 min)
   - Redirige a `/pago/simulado/:pagoId`
   - **Fases visuales:** Conectando (0.7s) → Verificando (1.6s) → Acreditando
   - **Auto-confirma** → Estado `completado` → Monedas acreditadas al instante
   - **Toast:** *"Se acreditaron N monedas"*
   - **Redirección automática** a donde estabas (firmar, publicar, billetera)
3. **Si falla/expira:** Botón "Reintentar" o "Volver a paquetes"

> **Nota:** En producción real, esto será pasarela real (Nequi, PSE, tarjeta). Hoy es 100% simulado para testing.

### 7.4 Catálogo de Paquetes (Ejemplo)
| Paquete | Monedas Base | Bonus | Total | Precio COP | Precio/Moneda |
|---------|--------------|-------|-------|------------|---------------|
| Básico | 50 | 0 | 50 | $5,000 | $100 |
| Estándar | 150 | 15 | 165 | $15,000 | $91 |
| Premium | 350 | 50 | 400 | $30,000 | $75 |

> **Ofertas temporales:** Precio tachado + precio oferta + badge "Oferta" + fecha fin.

### 7.5 Movimientos de Monedas (Historial)
| Tipo | Qué Significa | Signo |
|------|---------------|-------|
| `compra` | Compraste paquete | + |
| `gasto` | Firmaste contrato, publicaste anuncio | – |
| `promocional` | Bono gratis (bienvenida, referido) | + |
| `ganada` | Completaste trabajo (10 monedas) | + |
| `vencimiento` | Promocionales expiraron (30 días) | – |
| `ajuste` | Corrección manual (soporte) | ± |

### 7.6 Métodos de Pago (Para Retiros Futuros)
- **Billetera Virtual ChambeApp** (creada automáticamente)
- **Cuentas Bancarias** (banco + últimos 4 dígitos) — principal / secundarias
- **Agregar:** Banco/Billetera (Nequi, Bancolombia, Daviplata...) + número
- **Principal:** Una sola a la vez (radio button)
- **Eliminar:** Solo cuentas bancarias (no la virtual)

> **Nota:** Retiros a efectivo **no están implementados** en esta versión. El saldo COP es solo métrica contable.

### 7.7 Certificado de Ingresos (Solo PDS)
- **Descargar PDF** con: Ingresos por chambas, chambas completadas, fecha generación
- Útil para declaración de renta, prueba de ingresos, trámites bancarios

---

## 8. Chat y Comunicaciones

### 8.1 Acceso al Chat
- **Desde solicitud/contrato/anuncio:** Botón "Chat" / ícono 💬
- **Desde Home:** Pestaña "Mensajes" / ícono 💬 en header
- **Notificación push** al recibir mensaje nuevo

### 8.2 Tipos de Conversación
| Tipo | Participantes | Cuándo Se Crea |
|------|---------------|----------------|
| **Solicitud-Oferta** | Solicitante ↔ PDS | Al enviar primera oferta |
| **Contrato-Chamba** | Solicitante ↔ PDS | Al firmar contrato (persiste post-contrato) |
| **Anuncio-Postulación** | Merchant ↔ Postulante | Al postularse a anuncio |
| **Soporte** | Usuario ↔ Staff/Admin | Desde "Ayuda" o reporte |

### 8.3 Funciones del Chat
- **Mensajes de texto** (ilimitados)
- **Imágenes** (fotos, capturas, documentos) — se comprimen auto
- **Ubicación** (enviar punto GPS actual)
- **Mensajes del sistema** (auto: "Oferta aceptada", "Contrato firmado", "Pago simulado completado")
- **Leído / No leído** (check azul doble)
- **Notificaciones push** configurables (todo / solo menciones / nada)

### 8.4 Mensajes Estructurados (Auto-generados)
| Evento | Mensaje Auto |
|--------|--------------|
| Nueva oferta | "Juan Pérez ofertó $120.000: 'Puedo ir mañana temprano'" |
| Oferta aceptada | "¡Oferta aceptada! Firma el contrato para iniciar." |
| Contrato firmado | "Ambas partes firmaron. La chamba inicia hoy." |
| Check-in / Check-out | "Juan Pérez inició/finalizó la chamba." |
| Pago simulado | "Pago completado. Se acreditaron 50 monedas." |
| Calificación recibida | "Recibiste 5⭐ de María González." |

---

## 9. Notificaciones

### 9.1 Centro de Notificaciones (Campana 🔔 en Header)
- **Todas** (lista cronológica, más reciente arriba)
- **No leídas** (badge rojo con contador)
- **Filtros:** Tipo (oferta, contrato, pago, chat, sistema, calificaciones)
- **Acciones:** Marcar como leída (swipe), Marcar todas como leídas, Eliminar

### 9.2 Tipos de Notificación
| Categoría | Eventos | Acción al Tocar |
|-----------|---------|-----------------|
| **Ofertas** | Nueva oferta, oferta aceptada/rechazada, contraoferta | Abre solicitud/oferta |
| **Contratos** | Firma pendiente, contrato firmado, check-in/out, completado | Abre contrato/chamba |
| **Pagos/Monedas** | Pago completado, monedas acreditadas, monedas insuficientes | Abre billetera/pago |
| **Chat** | Nuevo mensaje, mención | Abre chat |
| **Calificaciones** | Nueva calificación, endoso recibido | Abre perfil/calificación |
| **Sistema** | KYC aprobado/rechazado, mantenimiento, novedades | Abre sección relevante |

### 9.3 Configuración de Notificaciones
**Perfil → Notificaciones** (o desde campana → ⚙️):
- **Push:** Activar/Desactivar global
- **Por canal:** Push / Email / En-app (cada tipo independientemente)
- **Horario silencioso:** "No molestar" (ej. 22:00 - 07:00)
- **Sonido/Vibración:** Personalizable por tipo

---

## 10. Perfil, KYC y Verificación

### 10.1 Tu Perfil Público
- **Foto, Nombre, Rol(es), Rating promedio, Badges**
- **Verificado:** Badge verde ✅ (KYC aprobado)
- **Portafolio** (si PDS), **Negocio** (si Merchant)
- **Botón "Contactar"** (abre chat) / "Ver en mapa"

### 10.2 KYC (Know Your Customer) — Verificación de Identidad
**Obligatorio para:**
- PDS: Ofertar, postularse a marañas/anuncios, recibir alertas
- Merchant: Crear negocio, publicar solicitudes/anuncios, contratar
- Solicitante: Publicar solicitudes (opcional pero recomendado)

#### Documentos por Rol
| Rol | Documentos Obligatorios | Opcionales |
|-----|------------------------|------------|
| **PDS** | Doc. identidad (frente/reverso), Selfie con doc, Antecedentes (certificado judicial), Validación profesional (por oficio) | Certificados, Referencias laborales |
| **Solicitante** | Doc. identidad, Selfie, Comprobante residencia | Referencias |
| **Merchant** | Doc. identidad (representante legal), Selfie, Cámara de comercio, RUT, Comprobante dirección negocio | Licencia funcionamiento |

#### Estados de Documento
| Estado | Qué Significa |
|--------|---------------|
| `no_enviado` | Pendiente por subir |
| `enviado` | En revisión (staff/verificador) |
| `aprobado` | ✅ Válido |
| `rechazado` | ❌ Observaciones en "nota" — re-subir corregido |

#### Flujo KYC
1. **Perfil → Verificación de Identidad** → Ver lista de documentos requeridos
2. **Subir archivo** (foto/PDF — max 10MB) → Vista previa → Enviar
3. **Espera revisión** (24-48h hábiles) → Notificación push al cambiar estado
4. **Si rechazado:** Ver nota → Corregir → Re-enviar

> **Tip:** Sube fotos nítidas, bien iluminadas, sin flash directo sobre el documento.

### 10.3 Verificación de Perfil Completo
El badge **"Perfil Completo"** (check verde) se activa al tener:
- ✅ Foto de perfil
- ✅ KYC aprobado (todos los docs obligatorios)
- ✅ Al menos 1 habilidad/categoría (PDS) o negocio creado (Merchant)
- ✅ Teléfono verificado (opcional pero recomendado)

### 10.4 Seguridad y Privacidad
- **Perfil → Seguridad:** Cambiar contraseña, activar/desactivar 2FA, ver sesiones, códigos de respaldo 2FA
- **Perfil → Privacidad:** Quién ve tu perfil (Todos / Solo contactos / Nadie), mostrar rating, mostrar ubicación aproximada
- **Datos:** Descargar mis datos (GDPR/Ley 1581), Solicitar eliminación de cuenta

---

## 11. Contratos, Chambas y Pagos

### 11.1 Ciclo de Vida del Contrato
```
PENDIENTE
    │ (ambas partes firman)
    ▼
EN_PROGRESO  (inicio_en = check-in PDS)
    │ (PDS hace check-out)
    ▼
COMPLETADO_PENDIENTE  (fin_en = check-out PDS)
    │ (Solicitante confirma)
    ▼
COMPLETADO  ✅
    │ (Si se cancela antes de firmar ambas partes)
    ▼
CANCELADO  ❌ (reembolso monedas si aplica)
```

### 11.2 Firmas Digitales
- **Tipo:** Firma manuscrita en canvas (dedo/ratón) + datos documento (tipo, número, nombre)
- **Legalidad:** Cumple Ley 527/1999 (firma electrónica Colombia) — probatorio
- **Almacenamiento:** Imagen PNG (base64) + metadata (timestamp, IP, user-agent)
- **Verificación:** Hash SHA-256 del contenido del contrato al momento de firmar

### 11.3 Chambas (Gestión de Obra/Servicio)
| Componente | Qué Es | Quién |
|------------|--------|-------|
| **Check-in** | Foto + GPS al llegar | PDS (obligatorio) |
| **Check-out** | Foto final + GPS | PDS (obligatorio) |
| **Evidencias** | Fotos/video durante trabajo | PDS (voluntario) |
| **Novedades** | Comentarios + fotos en timeline | Ambos |
| **Marañas (Adendas)** | Trabajo extra / cambio alcance | PDS crea → Solicitante aprueba |
| **Habilidades validadas** | Endosos post-completado | Solicitante (post-chamba) |

### 11.4 Hitos de Pago (Contratos Largos)
- **Crear hitos:** Solicitante define (descripción, monto, orden) al crear contrato largo
- **Aprobar hito:** Solicitante aprueba → PDS cobra esa parte
- **Rechazar hito:** Solicitante rechaza → PDS corrige / negocia
- **Todos aprobados** → Contrato se marca completable

### 11.5 Pagos y Comisiones
| Concepto | Quién Paga | Cómo |
|----------|------------|------|
| **Monedas por firmar contrato** | Ambas partes (PDS + Solicitante) | ChambeCoins (fórmula: `trunc((monto × 3%) / 100) + 1`, mín 10) |
| **Publicar anuncio** | Merchant | ChambeCoins (10) |
| **Reactivar anuncio** | Merchant | ChambeCoins (5) |
| **Comisión plataforma** | **No hay** comisión COP sobre monto del trabajo | La app **no intermedia** el pago del servicio final |
| **Pago del servicio** | Solicitante → PDS directo (efectivo, transferencia, Nequi, etc.) | Fuera de la app (acuerdo entre partes) |

> **Importante:** ChambeApp **no retiene ni administra** el dinero del servicio final. Solo cobra la tarifa de uso de plataforma en **ChambeCoins**.

### 11.6 Certificado de Ingresos (PDS)
- **Descargar PDF** desde Billetera → "Certificado de ingresos"
- Incluye: Total ingresos chambas, chambas completadas, período, fecha generación
- Uso: Declaración de renta, certificado laboral, trámites bancarios

---

## 12. Calificaciones, Endosos y Confianza

### 12.1 Sistema de Calificaciones (1-5 Estrellas)
- **Bidireccional:** Al completar chamba, ambas partes se califican mutuamente
- **Ponderación:** Promedio simple (suma / cantidad)
- **Visibilidad:** Pública en perfil + desglose en detalle
- **Comentario opcional** (público, max 500 caracteres)

### 12.2 Endosos de Habilidades (Validación Social)
Al completar chamba, el Solicitante puede **endosar competencias** que el PDS demostró:
1. Ve lista de habilidades del PDS (del catálogo CUOC/SENA)
2. Marca las que vio demostradas (checkbox)
3. **5 endosos de clientes distintos** = Habilidad **Validada** en perfil (badge dorado)
4. **Notificación** al PDS: *"María endosó tu competencia 'Instalación de tuberías PVC'"

### 12.3 TrustScore (Score de Confianza 0-1)
Score interno que combina:
| Factor | Peso | Fuente |
|--------|------|--------|
| KYC Verificado | 25% | `verificado` boolean |
| Rating Promedio | 25% | `calificacion_promedio / 5` |
| Contratos Completados | 20% | `min(contratos/50, 1)` |
| Portfolio Calidad | 15% | `min(portafolio_aprobados/10, 1)` |
| Referidos | 15% | `min(referidos/5, 1)` |

**Uso:** Ranking en búsquedas, elegibilidad para ciertos anuncios, prioridad en soporte.

### 12.4 Badges (Insignias)
| Badge | Cómo Se Gana | Visual |
|-------|--------------|--------|
| **Primer Contrato** | Primera chamba completada | 🥇 |
| **Perfil Completo** | 100% perfil + KYC | ✅ |
| **Verificado** | KYC aprobado | 🛡️ |
| **Top Rated** | Rating ≥ 4.8 (mín 10 ratings) | ⭐ |
| **10 Contratos** | 10 chambas completadas | 🔟 |
| **Sin Disputas** | 0 disputas abiertas | 🤝 |

---

## 13. Panel Superadmin (Solo Administradores)

> **Acceso:** Solo rol `superadmin` → `/superadmin` (Web) o menú lateral en app

### 13.1 Inicio (Dashboard)
- **Resumen general:** Usuarios activos, transacciones 24h, alertas
- **Accesos rápidos:** Paquetes, Tarifas, Billeteras, Usuarios

### 13.2 Gestión de Paquetes de Monedas (`/superadmin/paquetes`)
- **Lista:** Nombre, monedas (base+bonus), precio COP, estado (activo/inactivo), oferta, orden
- **Crear:** Nombre, descripción, cantidad, bonus, precio COP, activo, oferta (precio, desde/hasta), orden
- **Editar:** Cualquier campo (parcial)
- **Activar/Desactivar:** Toggle (no borra histórico)
- **Reordenar:** Drag & drop → guarda orden (posición = orden de aparición)
- **Ofertas temporales:** Precio especial + fecha inicio/fin automática

### 13.3 Configuración de Tarifas (`/superadmin/tarifas`)
Formulario único con 6 campos numéricos:
| Tarifa | Default | Descripción | Validación |
|--------|---------|-------------|------------|
| `pct_contrato` | 3.0% | % monto contrato cobrado en monedas a cada parte | 0-100 |
| `precio_moneda_cop` | 100 | Precio referencia 1 moneda (recalcula paquetes) | ≥1 |
| `monedas_fijas` | 1 | Monedas fijas sumadas al cobro | ≥0 |
| `min_monedas_contrato` | 10 | Mínimo monedas por parte al firmar | ≥1 |
| `costo_publicar_anuncio` | 10 | Monedas para publicar anuncio | ≥0 |
| `costo_reactivar_anuncio` | 5 | Monedas para reactivar | ≥0 |

**Botón "Restablecer defaults"** → Rellena formulario con valores por defecto (no guarda hasta click "Guardar").
**Aviso:** *"Cambiar precio_moneda_cop recalcula TODOS los paquetes (cantidad × precio). Ofertas manuales se conservan."*

### 13.4 Billeteras de Usuarios (`/superadmin/billeteras`)
- **Buscador:** Email o ID → Lista resultados (email, rol, monedas, saldo COP)
- **Ficha usuario (solo lectura):**
  - Datos usuario (email, nombre, rol)
  - Wallet: saldo COP, monedas, bloqueado
  - Monedas: saldo, compradas, gastadas, promocionales, ganadas
  - Resumen financiero por rol (ingresos/egresos/neto COP)
  - Movimientos de monedas (tabla paginada)
  - Compras de paquetes (tabla con email, nombre, paquete, monedas, precio, estado)

### 13.5 Métricas y Analítica (`/superadmin/metrics/history`)
- **Histórico 300 días / 10 meses** (daily + monthly segments)
- **Distribuciones:** Región, distancia, tiempos, género, edad, actividad
- **Segmentación:** Por métrica × dimensión (región, oficio, género, edad, etc.)

---

## 14. Preguntas Frecuentes (FAQ)

### 💰 Monedas y Pagos
**P: ¿Las ChambeCoins se pueden cambiar por dinero real?**
R: No. Son moneda virtual de uso exclusivo dentro de la plataforma (firmar contratos, publicar anuncios). No son retirables ni transferibles a efectivo.

**P: ¿Cuánto cuestan las monedas?**
R: Depende del paquete. Ejemplo: Básico 50 monedas = $5.000 COP ($100/moneda), Premium 400 monedas = $30.000 COP ($75/moneda). Ver catálogo en Billetera → Paquetes.

**P: Me quedé sin monedas para firmar/publicar. ¿Qué hago?**
R: La app te muestra un modal *"Te faltan N monedas"* → Botón **"Recargar monedas"** → Te lleva a Comprar Monedas → al completar, **vuelve y reintenta automáticamente**.

**P: ¿El pago simulado es seguro?**
R: Sí, es 100% simulado (ChambePay). No ingresas datos de tarjeta reales. En producción será pasarela real (Nequi, PSE, tarjeta).

### 📝 Solicitudes y Contratos
**P: ¿Puedo editar una solicitud ya publicada?**
R: Sí, mientras esté en estado `PUBLICADO` y no tenga ofertas aceptadas. Ve a "Mis Solicitudes" → Editar.

**P: ¿Qué pasa si el PDS no hace check-in/check-out?**
R: Sin check-in no hay `inicio_en`; sin check-out no hay `fin_en`. La chamba queda en limbo. Contacta soporte si hay disputa.

**P: ¿Puedo cancelar un contrato ya firmado?**
R: Solo si **no ha iniciado** (`EN_PROGRESO` sin check-in). Si ya hay check-in, debes llegar a acuerdo con la otra parte o abrir disputa.

**P: ¿Qué pasa si el trabajo sale mal?**
R: Abre **Disputa** desde el contrato → Mediación por staff → Decisión vinculante. Ver sección Disputas.

### 🪪 KYC y Verificación
**P: ¿Cuánto tarda la verificación KYC?**
R: 24-48 horas hábiles. Recibes notificación push al cambiar estado.

**P: Mi documento fue rechazado. ¿Qué hago?**
R: Abre "Verificación de Identidad" → Ver nota de rechazo → Corrige (foto borrosa, documento vencido, datos ilegibles) → Re-envía.

**P: ¿Puedo usar la app sin KYC?**
R: Sí, pero limitado: Solicitante puede navegar pero no publicar; PDS no puede ofertar ni recibir alertas; Merchant no puede publicar anuncios ni crear negocio.

### 🔔 Notificaciones y Chat
**P: No me llegan notificaciones push.**
R: Verifica: 1) App tiene permiso en ajustes del sistema 2) Perfil → Notificaciones → Push activado 3) No estás en "No molestar" horario 4) Cierra y abre la app (refresca token FCM).

**P: ¿Puedo borrar mensajes del chat?**
R: No. Los chats son registro inmutable (evidencia legal). Solo puedes archivar la conversación (swipe → Archivar).

### 🛠️ Técnico y Cuenta
**P: ¿Cómo cambio mi email/contraseña?**
R: Perfil → Seguridad → Cambiar email / Cambiar contraseña.

**P: ¿Puedo tener dos cuentas?**
R: No. Un usuario = una cuenta (email único). Puedes tener **múltiples roles** en la misma cuenta.

**P: La app va lenta / se cierra.**
R: 1) Cierra y abre 2) Verifica actualización en Store 3) Limpia caché: Ajustes → Apps → ChambeApp → Almacenamiento → Limpiar caché 4) Reinstala si persiste.

---

## 15. Glosario de Términos

| Término | Definición |
|---------|------------|
| **PDS** | Prestador de Servicios — Trabajador independiente que ofrece sus habilidades en la plataforma. |
| **Solicitante** | Usuario que publica una solicitud de trabajo (cliente). |
| **Merchant / Negocio** | Comercio/local con ficha física que publica anuncios laborales o servicios. |
| **ChambeCoins** | Moneda virtual de la plataforma (se compra con COP, se gasta en app). |
| **ChambePay** | Pasarela simulada de compra de monedas (pendiente → completado/fallido/expirado). |
| **Solicitud** | Publicación de un trabajo por un Solicitante (categoría, presupuesto, ubicación, urgencia). |
| **Oferta** | Postulación de un PDS a una Solicitud (monto, mensaje, fecha/horario propuestos). |
| **Contrato** | Acuerdo formal tras aceptar oferta (firma digital dual, estados: pendiente → en_progreso → completado). |
| **Chamba** | Expediente de gestión del trabajo en curso (check-in/out, evidencias, novedades, marañas). |
| **Marana** | Adenda / orden de cambio derivada de un contrato (trabajo extra, cambio de alcance). |
| **Anuncio Laboral** | Publicación de Merchant (vacante, servicio, producto) — solo contacto, no genera contratos. |
| **KYC** | Know Your Customer — Verificación documental por rol (identidad, antecedentes, profesión). |
| **TrustScore** | Score 0-1 de confianza (KYC + rating + contratos + portfolio + referidos). |
| **Endoso** | Validación social de competencia: 5 endosos = habilidad validada (badge dorado). |
| **Ledger COP** | Contabilidad interna de ingresos/egresos en pesos (solo métricas, no retirable). |
| **ChambePay** | Pasarela de pago simulada (checkout → pendiente 15min → confirmar/webhook → completado). |
| **Lambdarank** | Algoritmo LightGBM para Learning-to-Rank (optimiza NDCG). |
| **Thompson Sampling** | Algoritmo de bandit para rotación de categorías (exploración/explotación). |
| **Shadow Mode** | Modo validación: ML corre en paralelo, loggea predicciones, pero retorna heurístico al usuario. |
| **NDCG** | Normalized Discounted Cumulative Gain — métrica de calidad de ranking (1 = perfecto). |
| **PostGIS / ST_DWithin** | Extensión geoespacial PostgreSQL / función "distancia ≤ radio". |

---

## 16. Soporte y Contacto

### 16.1 Canales Oficiales
| Canal | Disponibilidad | Para Qué |
|-------|----------------|----------|
| **Chat en App** (Ayuda → Chat Soporte) | Lun-Vie 8am-6pm, Sáb 9am-1pm | Dudas de uso, bugs, disputas, KYC |
| **Email** | soporte@chambeapp.com | Consultas formales, legales, privacidad |
| **Centro de Ayuda** (App → Ayuda) | 24/7 | Guías paso a paso, FAQ, videotutoriales |
| **Reporte de Bug** | App → Ayuda → "Reportar problema" | Errores técnicos, crashes, UX |

### 16.2 Tiempos de Respuesta (SLA)
| Prioridad | Tiempo Objetivo |
|-----------|-----------------|
| **Crítico** (app caída, pago fallido, seguridad) | < 2 horas hábiles |
| **Alto** (KYC rechazado injustamente, disputa urgente) | < 8 horas hábiles |
| **Normal** (dudas de uso, configuración) | < 24 horas hábiles |
| **Bajo** (sugerencias, feedback) | < 72 horas hábiles |

### 16.3 Reporte de Problemas (Plantilla)
Al contactar soporte, incluye:
1. **Tu email de cuenta**
2. **Rol** (PDS / Solicitante / Merchant)
3. **Qué intentabas hacer** (paso a paso)
4. **Qué pasó** (error, mensaje, comportamiento inesperado)
5. **Capturas de pantalla** (si aplica)
6. **Dispositivo / OS / Versión app** (ej. iPhone 14, iOS 17.2, App v1.11.0)

### 16.4 Redes Sociales y Comunidad
- **Instagram:** `@chambeapp` (tips, casos de éxito, novedades)
- **LinkedIn:** `ChambeApp` (alianzas, empleos, noticias)
- **Twitter/X:** `@ChambeApp_` (alertas, mantenimiento, tips rápidos)

---

---

*Manual de Usuario ChambeApp v1.11.0 — Noviembre 2026*  
*Para la versión más actual, visita la sección **Ayuda** dentro de la app o `https://docs.chambeapp.com/manual`*  
*© 2026 ChambeApp — Todos los derechos reservados*