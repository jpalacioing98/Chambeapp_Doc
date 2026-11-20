# Manual de Usuario Extensivo — ChambeApp

> **Versión:** 1.11.0 | **Fecha:** 2026-11-18 | **Plataforma:** iOS / Android / Web PWA / Escritorio
> **Estado:** Documento vivo — Actualizado con cada release

---

## 📑 Índice Maestro Detallado

### PARTE I: FUNDAMENTOS Y ACCESO
1. [Introducción Profunda a ChambeApp](#1-introducción-profunda-a-chambeapp)
2. [Arquitectura de Roles y Permisos](#2-arquitectura-de-roles-y-permisos)
3. [Onboarding Inteligente por Rol](#3-onboarding-inteligente-por-rol)
4. [Seguridad Avanzada y Gestión de Identidad](#4-seguridad-avanzada-y-gestión-de-identidad)

### PARTE II: MÓDULO SOLICITANTE — GESTIÓN COMPLETA DE TRABAJOS
5. [Anatomía de una Solicitud Perfecta](#5-anatomía-de-una-solicitud-perfecta)
6. [Ciclo de Vida Completo: De Publicación a Finalización](#6-ciclo-de-vida-completo-de-publicación-a-finalización)
7. [Gestión Avanzada de Ofertas y Negociación](#7-gestión-avanzada-de-ofertas-y-negociación)
8. [Contratos Inteligentes y Firmas Digitales](#8-contratos-inteligentes-y-firmas-digitales)
9. [Chambas: Gestión Profesional de Obra/Servicio](#9-chambas-gestión-profesional-de-obraservicio)
10. [Marañas y Adendas: Cambios de Alcance Controlados](#10-marañas-y-adendas-cambios-de-alcance-controlados)

### PARTE III: MÓDULO PDS — EXCELENCIA OPERATIVA
11. [Perfil Profesional de Alto Impacto](#11-perfil-profesional-de-alto-impacto)
12. [Estrategias de Búsqueda y Oferta Ganadora](#12-estrategias-de-búsqueda-y-oferta-ganadora)
13. [Ejecución Técnica: Check-in, Evidencias, Check-out](#13-ejecución-técnica-check-in-evidencias-check-out)
14. [Gestión de Portafolio y Certificación de Habilidades](#14-gestión-de-portafolio-y-certificación-de-habilidades)

### PARTE IV: MÓDULO MERCHANT / NEGOCIO — COMERCIO LOCAL INTELIGENTE
15. [Ficha de Negocio: Tu Escaparate Digital](#15-ficha-de-negocio-tu-escaparate-digital)
16. [Anuncios Laborales: De Vacantes a Servicios](#16-anuncios-laborales-de-vacantes-a-servicios)
17. [Gestión de Postulaciones y Selección](#17-gestión-de-postulaciones-y-selección)

### PARTE V: ECONOMÍA INTERNA - BILLETERA Y CHAMBECOINS
18. [Filosofía Económica: Monedas Virtuales vs Ledger COP](#18-filosofía-económica-monedas-virtuales-vs-ledger-cop)
19. [ChambePay: Pasarela Simulada Realista](#19-chambeay-pasarela-simulada-realista)
20. [Estrategias de Compra y Gestión de Monedas](#20-estrategias-de-compra-y-gestión-de-monedas)
21. [Finanzas: Ledger COP, Certificados y Analítica](#20-finanzas-ledger-cop-certificados-y-analítica)

### PARTE VI: COMUNICACIÓN Y COLABORACIÓN
21. [Chat Inteligente: Tipos, Estructura, Automatismos](#21-chat-inteligente-tipos-estructura-automatismos)
22. [Notificaciones: Centro de Control Inteligente](#22-notificaciones-centro-de-control-inteligente)

### PARTE VII: IDENTIDAD, CONFIANZA Y SEGURIDAD
23. [KYC Profundo: Verificación por Rol y Nivel](#23-kyc-profundo-verificación-por-rol-y-nivel)
24. [Sistema de Confianza: TrustScore, Endosos, Badges](#23-sistema-de-confianza-trustscore-endosos-badges)
24. [Seguridad Avanzada: 2FA, Sesiones, Privacidad](#24-seguridad-avanzada-2fa-sesiones-privacidad)

### PARTE VIII: CONTRATOS, PAGOS Y RESOLUCIÓN
25. [Anatomía del Contrato Digital](#25-anatomía-del-contrato-digital)
26. [Chambas: Gestión de Obra/Servicio Profesional](#26-chambas-gestión-de-obra-servicio-profesional)
27. [Hitos de Pago: Contratos Fraccionados](#27-hitos-de-pago-contratos-fraccionados)
28. [Disputas y Resolución Automatizada](#28-disputas-y-resolución-automatizada)

### PARTE IX: ECOSISTEMA DE CONFIANZA
29. [Sistema de Calificaciones Bidireccional](#29-sistema-de-calificaciones-bidireccional)
30. [Endosos: Validación Social de Competencias](#30-endosos-validación-social-de-competencias)
31. [TrustScore: La Matemática de la Confianza](#31-trustscore-la-matemática-de-la-confianza)
32. [Badges y Gamificación de Confianza](#32-badges-y-gamificación-de-confianza)

### PARTE X: SUPERADMINISTRACIÓN Y GOBERNANZA
33. [Dashboard Ejecutivo: Métricas en Tiempo Real](#33-dashboard-ejecutivo-métricas-en-tiempo-real)
34. [Gestión de Paquetes: Economía de Monedas](#34-gestión-de-paquetes-economía-de-monedas)
35. [Tarifas y Parámetros Económicos](#35-tarifas-y-parámetros-económicos)
36. [Auditoría de Usuarios y Billeteras](#36-auditoría-de-usuarios-y-billeteras)
37. [Analítica Histórica: 10 Meses de Inteligencia](#37-analítica-histórica-10-meses-de-inteligencia)

### PARTE XI: INTELIGENCIA ARTIFICIAL EN CHAMBEAPP
38. [Motor de Recomendaciones: 4 Cerebros, 1 Factory](#38-motor-de-recomendaciones-4-cerebros-1-factory)
39. [Shadow Mode: Validación A/B Sin Riesgo](#39-shadow-mode-validación-ab-sin-riesgo)
40. [Bandit Thompson: Exploración Inteligente](#40-bandit-thompson-exploración-inteligente)

### PARTE XII: REFERENCIA TÉCNICA Y SOPORTE
41. [API Reference para Desarrolladores](#41-api-reference-para-desarrolladores)
42. [Troubleshooting Profundo por Módulo](#42-troubleshooting-profundo-por-módulo)
43. [FAQ Exhaustivo: 50+ Preguntas Resueltas](#43-faq-exhaustivo-50-preguntas-resueltas)
44. [Glosario Técnico Completo: 80+ Términos](#44-glosario-técnico-completo-80-términos)
45. [Soporte Enterprise: Canales, SLAs, Escalamiento](#45-soporte-enterprise-canales-slas-escalamiento)

---

# PARTE I: FUNDAMENTOS Y ACCESO

## 1. Introducción Profunda a ChambeApp

### 1.1 Visión de Producto
ChambeApp no es solo una bolsa de trabajo. Es una **plataforma de orquestación de trabajo independiente** que resuelve tres problemas fundamentales del mercado informal latinoamericano:

| Problema Tradicional | Solución ChambeApp |
|----------------------|-------------------|
| **Desconfianza mutua** | KYC obligatorio + TrustScore + Contratos digitales + Escrow de monedas |
| **Pagos informales / fantasmas** | ChambeCoins (escrow de plataforma) + Contratos digitales + Chambas con evidencias |
| **Falta de trazabilidad** | Chambas con check-in/out GPS, evidencias fotográficas, timeline inmutable |

### 1.2 Diferenciadores Clave
| Característica | Competencia Tradicional | ChambeApp |
|----------------|------------------------|-----------|
| **Verificación** | Opcional / Básica | KYC obligatorio por rol + TrustScore dinámico |
| **Pagos** | Efectivo / Transferencia sin garantía | ChambeCoins (escrow plataforma) + Contratos digitales |
| **Gestión** | Solo contacto | Chambas completas (check-in/out, evidencias, hitos, marañas) |
| **Reputación** | Estrellas simples | Rating + Endosos (5 = validado) + TrustScore matemático |
| **IA** | Ninguna / Básica | HybridRecommender (Geo + LightGBM Lambdarank) + Shadow Mode A/B |

### 1.3 Números que Importan (Simulación Scale 25)
| Métrica | Valor | Qué Significa |
|---------|-------|---------------|
| **Usuarios activos** | ~12,500 | Densidad real para recomendaciones |
| **Solicitudes/mes** | ~4,500 | Volumen para entrenar ML |
| **Tasa match** | ~68% | Ofertas que terminan en contrato |
| **Tiempo primer oferta** | < 15 min | Eficiencia del motor de recomendación |
| **Tasa completación** | 92% | Contratos que llegan a COMPLETADO |

---

## 2. Arquitectura de Roles y Permisos

### 2.1 Matriz de Capacidades Completa (60+ Acciones)

| Capacidad | Solicitante | PDS | Merchant | Verificador | Soporte | Admin | Superadmin |
|-----------|-------------|-----|----------|-------------|---------|-------|------------|
| **GESTIÓN DE SOLICITUDES** |
| Crear solicitud | ✅ | ❌ | ✅* | ❌ | ❌ | ❌ | ❌ |
| Editar propia solicitud (PUBLICADO) | ✅ | ❌ | ✅* | ❌ | ❌ | ✅ | ✅ |
| Ver solicitudes en mapa/lista | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Filtrar por categoría/radio/urgencia | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **OFERTAS Y NEGOCIACIÓN** |
| Enviar oferta | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Retirar/editar oferta propia | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Aceptar/Rechazar/Contraoferta | ✅ | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ |
| Ver ofertas en propia solicitud | ✅ | ❌ | ✅* | ❌ | ❌ | ✅ | ✅ |
| **CONTRATOS Y CHAMBAS** |
| Firmar contrato digital | ✅ | ✅ | ✅* | ❌ | ❌ | ✅ (override) | ✅ (override) |
| Check-in / Check-out (GPS + Foto) | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (audit) | ✅ (audit) |
| Subir evidencias / Novedades | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Crear/Aprobar Maraños (Adendas) | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Aprobar/Rechazar Hitos de Pago | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **ANUNCIOS LABORALES** |
| Crear anuncio (Empleo/Servicio/Producto/Oferta) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gestionar postulaciones (Contactar/Seleccionar/Descartar) | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Cerrar/Reabrir anuncio (Costo monedas) | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **BILLETERA Y MONEDAS** |
| Comprar paquetes de monedas (ChambePay) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Ver saldo, movimientos, métodos de pago | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Certificado de ingresos (PDF) | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ver billetera de OTRO usuario | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **CALIFICACIONES Y CONFIANZA** |
| Calificar contraparte (1-5) | ✅ | ✅ | ✅* | ❌ | ❌ | ✅ | ✅ |
| Endosar competencias (5 = validado) | ✅ | ✅ | ✅* | ❌ | ❌ | ✅ | ✅ |
| Ver TrustScore propio | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Ver TrustScore de OTRO usuario | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **ADMINISTRACIÓN** |
| Gestionar paquetes de monedas (CRUD) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configurar tarifas globales (6 parámetros) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gestionar usuarios (ban, role, region) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Ver métricas históricas (300 días / 10 meses) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Configurar Feature Flags (ML, Bandit, etc.) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

> *Merchant actuando como Solicitante (puede publicar solicitudes desde su negocio)

### 2.2 Cambio de Rol en Una Cuenta
- Un usuario puede tener **múltiples roles simultáneos** (ej. PDS + Solicitante)
- Cambio instantáneo: **Header → Selector de Rol** o **Menú Lateral → "Cambiar a vista PDS/Solicitante/Merchant"**
- Cada vista mantiene su navegación, estado y datos independientes
- Los datos se comparten: Wallet, KYC, Chat, Notificaciones, TrustScore

---

## 3. Onboarding Inteligente por Rol

### 3.1 Flujo Unificado (5 Pasos Máximo)
```
Paso 1: Bienvenida + Rol Principal
    → Selección visual con iconos y descripciones
    → "¿Qué quieres hacer principalmente?"
    
Paso 2: Perfil Básico (Común)
    → Foto (cámara/galería) → Recorte automático 1:1 → Subida a MinIO
    → Nombre completo + Teléfono (opcional, verificación SMS)
    → Zona de trabajo/ciudad (autocompletado + mapa)
    
Paso 3: Específico por Rol
    SOLICITANTE:
        → Categorías de interés (multi-select + "Otras")
        → Presupuesto típico (rangos)
        → Urgencia habitual (Hoy/Semana/Flexible)
    
    PDS:
        → Oficios del catálogo CUOC/SENA (búsqueda + multi-select)
        → Años de experiencia (slider 0-40+)
        → Categorías de trabajo (multi-select)
        → Zona de cobertura (radio km 5-50)
        → Disponibilidad horaria (grid semanal)
    
    MERCHANT:
        → Tipo de negocio (Comercio/Servicio/Restaurante/Otros)
        → Nombre comercial + Descripción
        → Dirección física + Punto en mapa
        → Horarios semanales (grid L-D)
        
Paso 4: KYC Inicial (Obligatorio según rol)
    → Lista de documentos requeridos por rol
    → Subida guiada (cámara/galería → recorte → compresión → MinIO)
    → Envío a cola de verificación
    
Paso 5: Primeras Acciones Guiadas
    SOLICITANTE: "Publica tu primera solicitud" → Wizard 3 pasos
    PDS: "Explora solicitudes cercanas" → Mapa interactivo
    MERCHANT: "Crea tu negocio" → Formulario 4 secciones
```

### 3.2 Métricas de Onboarding
| Métrica | Target | Actual (Sim) |
|---------|--------|--------------|
| Tasa finalización Paso 1-3 | > 85% | 87% |
| Tiempo medio completación | < 5 min | 4:32 min |
| Tasa KYC enviado en 24h | > 60% | 64% |
| Primera acción en 48h | > 70% | 73% |

---

## 4. Seguridad Avanzada y Gestión de Identidad

### 4.1 Autenticación Multi-Capa

| Capa | Mecanismo | Configuración |
|------|-----------|---------------|
| **1. Credenciales** | Email + Contraseña (bcrypt 12 rounds) | Mín 8 chars, 1 mayús, 1 num, 1 especial |
| **2. 2FA (TOTP)** | App Autenticadora (Google Auth, Authy, 1Password) | **Obligatorio**: Staff, Admin, Superadmin<br/>**Opcional**: Usuario final (recomendado) |
| **3. 2FA (SMS)** | Código 6 dígitos vía proveedor (Twilio/Vonage) | Fallback si no hay app autenticadora |
| **4. Códigos Respaldo** | 10 códigos 8 chars (un solo uso) | Generados al activar 2FA → Descargar PDF |
| **5. Biometría** | FaceID / TouchID / Huella (mobile) | Desbloqueo app + confirmar acciones críticas |

### 4.2 Gestión de Sesiones y Dispositivos

| Función | Detalle |
|---------|---------|
| **Sesiones activas** | Perfil → Seguridad → "Sesiones activas" → Lista: Dispositivo, IP, Ubicación aprox, Última actividad, Navegador/App |
| **Cierre remoto** | Botón "Cerrar esta sesión" / "Cerrar TODAS las demás" |
| **Expiración** | Access Token: 30 min (rotación automática)<br/>Refresh Token: 7 días (rotación en cada uso) |
| **Bloqueo por inactividad** | 30 días sin actividad → Refresh token revocado |
| **Bloqueo por intentos** | 5 fallos → Bloqueo 15 min → Email de alerta |

### 4.3 2FA: Guía Paso a Paso

#### Activar 2FA con App Autenticadora (Recomendado)
1. **Perfil → Seguridad → Autenticación de dos factores → "Activar con App"**
2. Escanea QR con Google Authenticator / Authy / 1Password / Microsoft Authenticator
3. Ingresa código de 6 dígitos de la app → **Confirmar**
4. **¡CRÍTICO:** Descarga/imprime los **10 códigos de respaldo** (PDF)
5. Guarda en lugar seguro (gestor de contraseñas, caja fuerte, impreso)

#### Activar 2FA por SMS (Fallback)
1. **Perfil → Seguridad → "Activar por SMS"**
2. Ingresa número móvil (validación automática formato colombiano)
3. Recibe SMS con código 6 dígitos → Ingresa → Confirmar
6. Igual: **Descarga códigos de respaldo**

#### Recuperación si Pierdes 2FA
| Escenario | Solución |
|-----------|----------|
| Tienes códigos de respaldo | Ingresa uno en login → Accede → Perfil → Seguridad → Regenera 2FA |
| NO tienes códigos | Contacta Soporte → Verificación de identidad (video llamada + doc identidad) → Reset manual por Staff |

### 4.4 Privacidad y Control de Datos (Ley 1581/2012 + GDPR)

| Derecho | Cómo Ejercer |
|---------|--------------|
| **Acceso** | Perfil → Privacidad → "Descargar mis datos" (JSON completo) |
| **Rectificación** | Perfil → Editar cualquier campo → Guardar |
| **Supresión** | Perfil → Privacidad → "Eliminar mi cuenta" → Confirmación 2FA + Email → 30 días para revertir |
| **Portabilidad** | JSON incluye: Perfil, Solicitudes, Ofertas, Contratos, Chat, Ratings, KYC, Wallet, Monedas |
| **Oposición** | Perfil → Privacidad → "No usar mis datos para ML" → Excluye de training set |
| **Limitación** | Perfil → Privacidad → "Solo contactos ven mi perfil" / "Nadie ve mi ubicación" |

---

# PARTE II: MÓDULO SOLICITANTE — GESTIÓN COMPLETA DE TRABAJOS

## 5. Anatomía de una Solicitud Perfecta

### 5.1 Estructura de Datos Completa

| Campo | Tipo | Obligatorio | Validaciones | Impacto en Matching |
|-------|------|-------------|--------------|---------------------|
| **titulo** | String | ✅ | 5-100 chars, no solo números | Pesado en búsqueda textual |
| **categoria** | Enum (13) | ✅ | De catálogo CUOC/SENA | **Crítico**: Filtro principal ML + Heurístico |
| **descripcion** | Text | ✅ | 50-5000 chars | NLP para embedding futuro / palabras clave |
| **ubicacion** | String | ✅ | 5-200 chars + Geocoding | Filtro geo (radio_km) |
| **latitud/longitud** | Float | ✅ (auto) | -90/90, -180/180 | **Crítico**: PostGIS ST_DWithin |
| **direccion** | String | Opcional | 200 chars | Display en mapa/detalle |
| **presupuesto** | Integer (COP) | Opcional | > 0, < 10^9 | Price_match feature ML |
| **especificaciones_tecnicas** | Text | Opcional | 5000 chars | Palabras clave para NLP |
| **fecha_deseada** | Date | Opcional | ≥ hoy | Urgencia + scheduling |
| **urgencia** | Enum (3) | ✅ | hoy/semana/flexible | Feature `is_urgent` + prioridad notificaciones |
| **horario** | Enum (4) | Opcional | Mañana/Tarde/Noche/Flexible | Disponibilidad PDS |
| **radio_km** | Float | Opcional | 1-100 (default 15) | Radio PostGIS retrieval |
| **imagen_360** | String (URL) | Opcional | Data URL / HTTPS | Visor inmersivo |
| **imagenes[]** | Array[URL] | Opcional | Max 3, 10MB c/u, WebP | Evidencia visual + NLP futuro |

### 5.2 Wizard de Publicación (4 Pasos)

#### Paso 1: Qué y Dónde
- **Título** + **Categoría** (chips visuales con iconos)
- **Descripción** (editor rico: negrita, listas, enlaces)
- **Ubicación**: Autocompletado Google Places + Punto en mapa (drag) + Radio slider (1-50km)

#### Paso 2: Cuándo y Cuánto
- **Presupuesto**: Input numérico con formato COP ($1.200.000) + "A convenir" toggle
- **Urgencia**: Chips visuales (Hoy 🔴 / Esta semana 🟡 / Flexible 🟢)
- **Fecha deseada** (calendario) + **Horario** (chips: Mañana/Tarde/Noche/Flexible)
- **Especificaciones técnicas** (textarea expandible)

#### Paso 3: Multimedia
- **Fotos**: Cámara / Galería → Máx 3 → Compresión auto WebP 85% → Subida paralela
- **Foto 360°**: Cámara especial / Subida equirectangular → Visor inmersivo preview
- **Video** (futuro): Hasta 30 seg, compresión H.264

#### Paso 4: Revisión y Costo
- **Resumen completo** (expandible por secciones)
- **Costo en ChambeCoins**: `costo_publicar_anuncio` (default 10) — visible grande
- **Saldo actual** visible → Si insuficiente: Botón "Recargar" → Compra → Auto-reintento
- **Botón "Publicar"** → Loading → Toast success → Redirect a "Mis Solicitudes"

---

## 6. Ciclo de Vida Completo: De Publicación a Finalización

### 6.1 Máquina de Estados de Solicitud

```
BORRADOR
    │ (Usuario click "Publicar" + tiene monedas)
    ▼
PUBLICADO ──────────────────────────────────────┐
    │                                           │
    ├── Ofertas recibidas                       │
    │   ├── PDS ofertas → Notificación push     │
    │   ├── Solicitante ve en "Mis Ofertas"     │
    │   └── Expiración: 30 días → AUTO → OCULTO │
    │                                           │
    ├── ACCIONES SOLICITANTE:                   │
    │   ├── Ver ofertas (lista + detalle)       │
    │   ├── Aceptar oferta → Firma contrato     │
    │   ├── Contraofertar (monto/fecha/horario) │
    │   ├── Cerrar (deja de recibir ofertas)    │
    │   └── Cancelar (motivo obligatorio)       │
    │                                           │
    └── REACTIVAR (si CERRADO) → 5 monedas ◄────┘
            │
            ▼ (Acepta oferta + Ambas firman)
CONTRATO CREADO → EN_PROGRESO
            │
            ├── CHAMBA CREADA (auto)
            │   ├── Check-in PDS (Foto+GPS) → inicio_en
            │   ├── Evidencias/Novedades (timeline)
            │   ├── Marañas (Adendas) → Aprobación
            │   └── Check-out PDS → fin_en → COMPLETADO_PENDIENTE
            │
            ├── HITOS (si contrato largo)
            │   ├── Solicitante crea hitos (descripción, monto, orden)
            │   ├── PDS ejecuta → Solicitante aprueba/rechaza hito
            │   └── Todos aprobados → Auto-completable
            │
            └── DISPUTA (en cualquier momento)
                ├── Abre ticket → Staff asignado
                ├── Chat tripartito (Solicitante + PDS + Staff)
                ├── Evidencias → Decisión vinculante
                └── Penalizaciones / Reembolsos
            │
            ▼ (Solicitante confirma finalización)
COMPLETADO ✅
            │
            ├── Calificación mutua (1-5 + comentario)
            ├── Endosos de competencias (5 = validado)
            ├── 10 ChambeCoins fidelidad al PDS
            ├── Certificado ingresos PDF (PDS)
            └── Notificaciones a ambas partes
```

### 6.2 Transiciones y Reglas de Negocio

| Transición | Quién | Condición | Efecto Secundario |
|------------|-------|-----------|-------------------|
| PUBLICADO → OCULTO | Sistema | 30 días sin ofertas | Expira, no recibe ofertas |
| PUBLICADO → CERRADO | Solicitante | Click "Cerrar" | Deja de recibir ofertas |
| CERRADO → PUBLICADO | Solicitante | Click "Reabrir" (5 monedas) | Vuelve a visible |
| PUBLICADO → EN_PROGRESO | Sistema | Ambas partes firman | Crea Contrato + Chamba |
| EN_PROGRESO → COMPLETADO_PENDIENTE | PDS | Check-out + Foto+GPS | Notifica a Solicitante |
| COMPLETADO_PENDIENTE → COMPLETADO | Solicitante | Click "Confirmar" | +10 monedas PDS, Rating, Endosos |
| CUALQUIER → CANCELADO | Cualquiera | Motivo obligatorio | Reembolso monedas si sin firmas |

---

## 7. Gestión Avanzada de Ofertas y Negociación

### 7.1 Anatomía de una Oferta

| Campo | Tipo | Reglas |
|-------|------|--------|
| **monto** | Integer (COP) | Obligatorio si presupuesto="A convenir"; ≥ 10.000 |
| **mensaje** | Text (5000) | Obligatorio. Presentación + método + materiales |
| **fecha_deseada** | Date | Opcional. Si solicitante dejó "Flexible" |
| **horario** | Enum (4) | Opcional. Mañana/Tarde/Noche/Flexible |
| **estado** | Enum | `pendiente` → `aceptada`/`rechazada`/`contraoferta`/`cancelada` |
| **contra_monto** | Integer | Solo si estado=`contraoferta` |
| **aceptada_por_solicitante** | Boolean | Para contraofertas |
| **aceptada_por_pds** | Boolean | Para contraofertas |

### 7.2 Flujo de Negociación (Máquina de Estados)

```
PENDIENTE
    │ (Solicitante click "Aceptar")
    ▼
ACEPTADA ──────────────────────┐
    │ (Ambas partes firman)    │
    ▼                            │
CONTRATO CREADO                │
                               │
    │ (Solicitante click "Rechazar")           │
    ▼                                            │
RECHAZADA                                    │
    │ (PDS click "Retirar")                    │
    ▼                                            │
CANCELADA                                    │
                               │
    │ (Solicitante click "Contraofertar")      │
    ▼                                            │
CONTRAOFERTA (monto/fecha/horario/mensaje)     │
    │                                            │
    ├── PDS "Aceptar contraoferta" → ACEPTADA  │
    ├── PDS "Contraofertar" → NUEVA CONTRAOFERTA│
    └── PDS "Rechazar" → RECHAZADA              │
```

### 7.3 Reglas de Negociación

| Regla | Detalle |
|-------|---------|
| **Máximo contraofertas** | 3 por parte (6 total) → luego solo Aceptar/Rechazar |
| **Tiempo respuesta** | 24h para responder contraoferta → expira → estado anterior |
| **Monto mínimo** | 10.000 COP |
| **Notificaciones** | Push + In-app + Email (configurable) por cada transición |
| **Historial inmutable** | Todo mensaje/monto/fecha queda en `condiciones[]` del contrato |

### 7.4 Estrategias Ganadoras para Solicitante

| Situación | Recomendación |
|-----------|-------------|
| **Muchas ofertas similares** | Usa "Contraoferta" para ajustar monto/fecha sin rechazar |
| **PDS sin rating** | Pide referencias en chat antes de aceptar |
| **Urgencia "Hoy"** | Acepta primera oferta razonable; negocia después en chat |
| **Presupuesto "A convenir"** | Espera 2-3 ofertas → Contraoferta al promedio |
| **PDS lejano** | Pregunta en chat si cobra desplazamiento (no está en monto) |

---

## 8. Contratos Inteligentes y Firmas Digitales

### 8.1 Anatomía del Contrato Digital

| Sección | Contenido | Fuente |
|---------|-----------|--------|
| **Encabezado** | "CONTRATO DE PRESTACIÓN DE SERVICIOS" + ID único | Auto |
| **Partes** | Solicitante (nombre, email, doc) + PDS (nombre, email, doc) | Perfiles + KYC |
| **Objeto** | Título + Descripción + Categoría + Ubicación | Solicitud |
| **Alcance** | Especificaciones técnicas + Entregables | Solicitud + Oferta |
| **Valor** | Monto acordado (COP) + Forma de pago acordada | Oferta aceptada |
| **Plazos** | Fecha inicio/fin + Horario + Hitos (si aplica) | Oferta + Solicitud |
| **Condiciones** | Array de textos + autor + timestamp | Negociación (chat/ofertas) |
| **Firmas** | 2 bloques: Solicitante + PDS (ver 8.2) | Firma digital |
| **Anexos** | Fotos 360°, Planos, Especificaciones PDF | Adjuntos |

### 8.2 Firma Digital — Estándar Legal Colombiano (Ley 527/1999)

#### Componente Técnico
| Componente | Implementación |
|------------|----------------|
| **Canvas** | HTML5 Canvas (touch/mouse) → PNG base64 (max 500KB) |
| **Metadatos** | `{tipo_doc: "CC/CE/PAS", numero: "123456789", nombre: "Juan Pérez", timestamp: ISO8601, ip: "xxx.xxx.xxx.xxx", user_agent: "..."}` |
| **Hash** | SHA-256 del contenido del contrato al momento de firmar |
| **Almacenamiento** | `datos_firma_solicitante` / `datos_firma_proveedor` (JSONB) |

#### Flujo de Firma (Paralelo e Independiente)
```
1. Solicitud en estado PENDIENTE
2. Solicitante click "Firmar" → Modal Firma
    → Dibuja firma → Ingresa doc/tipo/nombre → "Firmar"
    → Estado: firma_solicitante=true, firmado_solicitante_en=now
    → Notifica a PDS: "Falta tu firma"
3. PDS recibe notificación → Click "Firmar" → Modal Firma
    → Dibuja firma → Ingresa doc/tipo/nombre → "Firmar"
    → Estado: firma_proveedor=true, firmado_proveedor_en=now
4. SI AMBAS FIRMAN:
    → Contrato.estado = EN_PROGRESO
    → Contrato.inicio_en = now
    → Crea CHAMBA auto (estado PROGRAMADA)
    → Notifica a AMBOS: "Contrato activo. Chamba creada."
    → Cobra monedas a AMBOS (fórmula cobro)
5. SI SOLO UNA FIRMA:
    → Espera a contraparte (sin timeout fijo)
    → Cualquiera puede CANCELAR → Reembolso monedas
```

### 8.3 Cobro de Monedas al Firmar (Fórmula Exacta)

```python
# En app/services/cobros.py → calcular_monedas_contrato(monto)
monedas_por_parte = max(
    min_monedas_contrato,                    # Default: 10
    trunc((monto * pct_contrato / 100) / precio_moneda_cop) + monedas_fijas
)
# Defaults: pct=3%, precio=100 COP, fijas=1, min=10
# Ejemplo: $150.000 → trunc(150000*0.03/100) + 1 = trunc(45) + 1 = 46 monedas c/u
```

| Monto Contrato | Monedas c/u (Default) | COP Equiv (100 COP/moneda) |
|----------------|----------------------|----------------------------|
| $50.000 | 10 (mínimo) | $1.000 |
| $100.000 | 31 | $3.100 |
| $500.000 | 151 | $15.100 |
| $1.000.000 | 301 | $30.100 |

> **Importante:** Se cobra a **AMBAS PARTES** al firmar. Si una parte no tiene monedas → Error 400 `MONEDAS_INSUFICIENTES` → Modal recarga → Reintento automático.

### 8.4 Cancelación y Reembolso de Monedas

| Escenario | Reembolso | Condición |
|-----------|-----------|-----------|
| Cancelar **antes** de que ambas firmen | ✅ 100% a ambas partes | `cobros_reembolsados = true` (idempotente) |
| Cancelar **después** de ambas firmas (EN_PROGRESO) | ❌ No reembolso | Solo disputa |
| PDS cancela antes de firmar | ✅ 100% al Solicitante | Solicitante no pagó aún |
| Solicitante cancela antes de que PDS firme | ✅ 100% al PDS | PDS ya pagó al firmar |

---

## 9. Chambas: Gestión Profesional de Obra/Servicio

### 9.1 Qué es una Chamba
> **Expediente digital inmutable** que acompaña todo el ciclo de vida operativo del contrato. No es el contrato (legal), es la **gestión operativa**.

### 9.2 Estructura de una Chamba

| Componente | Tipo | Obligatorio | Quién | Validación |
|------------|------|-------------|-------|------------|
| **Check-in** | Foto (1) + GPS (lat/lng) + Timestamp | ✅ | PDS | Foto ≥ 50KB, GPS precision < 50m |
| **Check-out** | Foto (1) + GPS + Timestamp | ✅ | PDS | Foto distinta a check-in |
| **Evidencias Entrada** | Array[URL] (fotos/video) | Opcional | PDS | Max 10, WebP 85% |
| **Evidencias Salida** | Array[URL] | Opcional | PDS | Max 20 |
| **Novedades** | Array[Texto+Fotos+Timestamp] | Opcional | Ambos | Timeline inmutable |
| **Marañas** | Array[Objeto Maraño] | Opcional | PDS crea / Solicitante aprueba | Ver 10 |
| **Habilidades Validadas** | Array[HabilidadID] | Auto (post-completado) | Solicitante (endosos) | 5 endosos = validado |
| **Rating Estrellas** | 1-5 + Comentario | Post-completado | Ambos | 1 rating por parte |

### 9.3 Flujo Operativo de Chamba

```
CONTRATO FIRMADO (EN_PROGRESO)
        │
        ▼
CHAMBA CREADA (estado: PROGRAMADA)
        │
        ├── PDS: "Iniciar Chamba" → CHECK-IN
        │   ├── Cámara → Foto (auto-compresión WebP 85%)
        │   ├── GPS → Lat/Lng (precisión < 50m)
        │   └── Timestamp → inicio_en = NOW
        │       ▼
        │   ESTADO: EN_EJECUCION
        │       ├── Evidencias (fotos/video) → Subida paralela → MinIO
        │       ├── Novedades → Comentarios + Fotos → Timeline inmutable
        │       ├── Marañas → PDS crea → Solicitante aprueba/rechaza
        │       └── Hitos (si contrato largo) → Aprobación por hito
        │
        └── PDS: "Finalizar Chamba" → CHECK-OUT
            ├── Cámara → Foto final (distinta a check-in)
            ├── GPS → Lat/Lng
            └── Timestamp → fin_en = NOW
                ▼
            ESTADO: COMPLETADO_PENDIENTE
                │
                ▼ (Solicitante confirma en 48h o auto-confirm)
            ESTADO: COMPLETADA ✅
                │
                ├── Rating mutuo (1-5 + comentario)
                ├── Endosos competencias (Solicitante → PDS)
                ├── +10 ChambeCoins fidelidad al PDS
                ├── Certificado ingresos PDF (PDS)
                └── Notificaciones push + Email
```

### 9.4 Evidencias: Estándares Técnicos

| Tipo | Formato | Compresión | Límite | Naming |
|------|---------|------------|--------|--------|
| **Foto** | JPEG/WebP | 85% calidad, max 1920px lado mayor | 10 MB | `evidencia_{timestamp}_{hash}.webp` |
| **Video** | MP4 (H.264) | 720p, 1.5 Mbps, max 30s | 50 MB | `video_{timestamp}_{hash}.mp4` |
| **Panorama 360°** | JPEG equirectangular | 80%, 4096x2048 max | 15 MB | `pano_{timestamp}.jpg` |

> **Subida:** Paralela (3 hilos) → MinIO bucket `chambeapp-chat` / `chambeapp-portfolio-publico` según tipo → CDN URL inmediata.

### 9.5 Marañas (Adendas / Órdenes de Cambio)

| Campo | Tipo | Reglas |
|-------|------|--------|
| **descripcion** | Text | Obligatorio, qué trabajo extra |
| **monto_adicional** | Integer (COP) | ≥ 10.000 |
| **fecha_ejecucion** | Date | ≥ Hoy |
| **estado** | Enum | `pendiente` → `aprobada` / `rechazada` / `en_ejecucion` / `completada` |
| **evidencias** | Array[URL] | Como evidencias principales |

**Flujo:** PDS crea → Solicitante recibe notificación → Aprueba/Rechaza → Si aprueba: se suma al contrato, monto adicional se paga según acuerdo (fuera de app o monedas).

---

## 10. Marañas y Adendas: Cambios de Alcance Controlados

> **Nota:** Las Marañas son **adendas formales** al contrato original. Tienen ciclo de vida propio, evidencias y cobro separado.

### 10.1 Cuándo Crear una Maraña
| Situación | Ejemplo |
|-----------|---------|
| Trabajo extra no previsto | "También pinte el techo" en contrato de paredes |
| Cambio de materiales | "Use pintura anti-humedad en lugar de normal" |
| Ampliación de área | "También pinte la fachada lateral" |
| Imprevisto técnico | "Tubería rota detrás de la pared, hay que cambiarla" |

### 10.2 Flujo de Aprobación
```
PDS CREA MARAÑA
    │ (descripción, monto, fecha, fotos opcionales)
    ▼
SOLICITANTE RECIBE NOTIFICACIÓN
    │ "Nueva maraña: 'Pintar techo' + $80.000"
    ▼
    ├── APROBAR → Estado: APROBADA
    │   ├── Se suma al contrato (monto total actualizado)
    │   ├── Se crea hito de pago si aplica
    │   └── PDS puede iniciar → Check-in maraña
    │
    └── RECHAZAR → Estado: RECHAZADA
        ├── Motivo obligatorio
        └── PDS puede: Modificar + Reenviar / Cancelar
```

### 10.3 Pago de Maraños
| Acuerdo | Cómo Se Paga |
|---------|--------------|
| **Monedas** | Se cobra `costo_anuncio`-style al crear (configurable) |
| **Efectivo/Transferencia** | Acuerdo directo PDS ↔ Solicitante (fuera de app) |
| **Hito de pago** | Si monto > $500k → Se crea hito automático |

---

# PARTE III: MÓDULO PDS — EXCELENCIA OPERATIVA

## 11. Perfil Profesional de Alto Impacto

### 11.1 Compleción Obligatoria (100% = Visibilidad)

| Sección | Campos | Validación | Impacto en Matching |
|---------|--------|------------|---------------------|
| **Foto Profesional** | 1 archivo (1:1, cara visible) | Cara detectada (MediaPipe) | +15% CTR en ofertas |
| **Oficios CUOC/SENA** | Multi-select catálogo nacional (200+) | Mín 1, Máx 10 | **Crítico**: Category Match ML |
| **Habilidades/Competencias** | Por oficio (checkbox por competencia) | Mín 3 por oficio | Endosos + ML features |
| **Años Experiencia** | Slider 0-40+ | Integer | Feature `contratos_completados` proxy |
| **Categorías de Trabajo** | Multi-select (13 categorías) | Mín 1 | Category Match (peso 0.6 heurístico) |
| **Zona de Cobertura** | Radio km (5-50) + Centro (mapa) | Int 5-50 | Distance_km feature (peso #1 ML) |
| **Disponibilidad Horaria** | Grid L-D (Mañana/Tarde/Noche) | 7x3 checkboxes | Feature `disponibilidad` |
| **Portafolio** | 3-20 items (foto + título + desc + categoría) | Mín 3 aprobados | Portfolio_calidad feature |
| **Certificaciones** | CUOC/SENA + PDF/Imagen | Verificación opcional | Badge "Certificado" + TrustScore |

### 11.2 Verificación de Perfil (Checklist 100%)

| Check | Verificación | Badge Resultado |
|-------|--------------|-----------------|
| Foto profesional | Cara detectada + buena iluminación | 📸 |
| Oficios seleccionados | ≥ 1 del catálogo CUOC | 🛠️ |
| Habilidades marcadas | ≥ 3 competencias totales | 🎯 |
| Zona + Radio | Coordenadas válidas + radio 5-50km | 📍 |
| Disponibilidad | ≥ 1 slot semanal | 🕐 |
| Portafolio | ≥ 3 items aprobados | 🖼️ |
| KYC Aprobado | Todos docs obligatorios ✅ | 🛡️ **VERIFICADO** |
| **TOTAL** | **7/7** | **PERFIL 100%** + Badge **VERIFICADO** |

> **Regla dura:** Perfil < 100% → **No aparece en búsquedas ni recomendaciones ML**. Solo visible si usuario busca por email exacto.

### 11.3 Portafolio: Estructura de Cada Item

| Campo | Tipo | Reglas |
|-------|------|--------|
| **Titulo** | String | 5-80 chars |
| **Descripción** | Text | 50-500 chars (qué hiciste, materiales, reto) |
| **Tipo** | Enum | `foto` / `video` / `documento` |
| **Categoría** | Enum | De tus oficios seleccionados |
| **Archivo** | File | Foto: WebP 85% / Video: MP4 720p / Doc: PDF |
| **Antes/Después** | Array[2 URLs] | Opcional pero potente |
| **Galería** | Array[URLs] | Hasta 10 fotos adicionales |
| **Estado** | Enum | `pendiente_revision` → `aprobado` / `rechazado` |
| **Vistas/Contactos** | Counters | Auto-increment |

> **Aprobación:** Staff revisa en < 24h → Notificación push al cambiar estado.

---

## 12. Estrategias de Búsqueda y Oferta Ganadora

### 12.1 Mapa Interactivo: Controles Avanzados

| Control | Función | Atajo |
|---------|---------|-------|
| **Radio Slider** | 1-50 km (default 15) | `R` |
| **Categoría** | Chips multi-select + "Todas" | `C` |
| **Urgencia** | Chips: Hoy 🔴 / Semana 🟡 / Flexible 🟢 | `U` |
| **Presupuesto** | Range slider (Min-Max COP) | `P` |
| **Solo Verificados** | Toggle (solo KYC aprobado) | `V` |
| **Modo 3D** | Terreno + Edificios (Mapbox GL) | `3` |
| **Auto-rotate** | Rotación lenta (solo desktop) | `A` |

### 12.2 Filtros Avanzados (Panel Lateral)
| Filtro | Tipo | Default |
|--------|------|---------|
| **Categoría** | Multi-select chips | Todas |
| **Radio** | Slider 1-50 km | 15 km |
| **Urgencia** | Chips (Hoy/Semana/Flexible) | Todas |
| **Presupuesto** | Range min-max COP | Sin límite |
| **Solo Verificados** | Toggle | OFF |
| **Solo con Foto 360°** | Toggle | OFF |
| **Radio Cobertura PDS** | Mostrar radio de cada PDS | ON |

### 12.3 Anatomía de una Tarjeta de Solicitud (Mapa + Lista)

```
┌─────────────────────────────────────────────────────┐
│ [🔴 HOY]  Fuga agua baño principal          $150.000 │
│ 📍 Barrio Centro · 2.3 km  🕐 Mañana (6-12)          │
│ 👤 12 ofertas  ⭐ 4.8  🛡️ Verificado                │
│ [Ver detalle]                    [Ofertar]           │
└─────────────────────────────────────────────────────┘
```

| Elemento | Significado |
|----------|-------------|
| **Badge Urgencia** | 🔴 Hoy / 🟡 Semana / 🟢 Flexible |
| **Distancia** | Haversine desde tu centro de cobertura |
| **Horario** | Preferencia del solicitante |
| **Ofertas** | Conteo real-time (WebSocket) |
| **Rating + Verificado** | TrustScore visual |

### 12.4 Detalle de Solicitud: Qué Analizar Antes de Ofertar

| Sección | Qué Buscar | Bandera Roja 🚩 |
|---------|------------|-----------------|
| **Presupuesto** | ¿Realista para la categoría? | "A convenir" sin rango |
| **Descripción** | ¿Alcance claro? Materiales incluidos? | "Arreglar lo que esté malo" |
| **Ubicación** | ¿En tu radio? ¿Acceso fácil? | > 20 km de tu centro |
| **Urgencia** | ¿Puedes cumplir fecha? | "Hoy" y son las 6 PM |
| **Fotos/360°** | ¿Alcance visual claro? | Sin fotos + "A convenir" |
| **Ofertas actuales** | ¿Cuántas? ¿Cuánto ofrecen? | > 15 ofertas = saturación |
| **Perfil Solicitante** | Rating + Verificado + Historial | Sin verificado + 0 ratings |

### 12.5 Construir Oferta Ganadora (Plantilla)

```
ASUNTO: [Categoría] - [Tu diferenciador]
Ej: "Plomería - Especialista en fugas ocultas + cámara térmica"

MENSAJE ESTRUCTURADO:
1. SALUDO PERSONALIZADO
   "Hola [Nombre si visible], vi tu solicitud de [categoría]..."

2. TU PROPUESTA DE VALOR (3 líneas máx)
   - "Especialista en fugas ocultas con cámara térmica FLIR"
   - "Materiales incluidos (tubería PVC, conexiones, sellante)"
   - "Garantía 6 meses por escrito"

3. PLAN DE EJECUCIÓN
   - "Visita diagnóstico: [Fecha propuesta] [Horario]"
   - "Ejecución: [Días estimados] [Horario]"
   - "Limpieza y prueba final incluidas"

4. MATERIALES Y GARANTÍA
   - "Materiales: PVC Schedule 40, cemento solvente, teflón"
   - "Garantía escrita 6 meses mano de obra + materiales"

5. CIERRE PROFESIONAL
   "Disponible para visita técnica gratuita previa.
   Quedo atento a tu respuesta. Saludos, [Tu Nombre] - [Oficio]"
```

### 12.6 Monitoreo de Ofertas Enviadas

| Vista | Qué Ver | Acción |
|-------|---------|--------|
| **Pendientes** | Solicitud, monto, fecha envío, días transcurridos | Retirar si > 7 días sin respuesta |
| **Aceptadas** | Contrato pendiente firma / En progreso | Firmar / Ver chamba |
| **Rechazadas** | Motivo (si dado) | Aprender / Buscar otras |
| **Contraofertas** | Tu última contraoferta + estado | Aceptar / Nueva contraoferta |

---

## 13. Ejecución Técnica: Check-in, Evidencias, Check-out

### 13.1 Check-in: Protocolo Obligatorio

**Cuándo:** Al llegar al sitio, **antes de iniciar cualquier trabajo**

**Pasos en App:**
1. Abre Chamba → Botón **"Iniciar Chamba"** (solo si estado `PROGRAMADA`)
2. **Cámara se abre** → Encuadra: Fachada/entrada + tu presencia
3. **GPS se captura automáticamente** (precisión < 50m, reintento si > 100m)
4. **Confirmar** → Subida paralela (Foto + GPS + Timestamp)
5. **Toast:** "Chamba iniciada. ¡Buen trabajo!" → Estado `EN_EJECUCION`

> **Validaciones:** Foto ≥ 50KB, GPS precision < 50m (reintento auto 3x), Timestamp = NOW ± 5 min

### 13.2 Durante la Ejecución: Evidencias y Novedades

| Tipo | Cuándo | Cómo | Buenas Prácticas |
|------|--------|------|------------------|
| **Foto Avance** | Cada hito importante | Chat → 📎 → Cámara/Galería | Encuadre: Antes/Durante/Después |
| **Video Proceso** | Proceso crítico (soldadura, tubería) | Chat → 📎 → Video (max 30s) | Narración en video: "Aquí soldando unión PVC..." |
| **Novedad Texto** | Cambio de plan, hallazgo | Chat → Texto | "Hallé tubería rota detrás de pared. Propongo Marana $80k" |
| **Materiales** | Llegada/uso de materiales | Foto + Texto | "Llegaron 20m PVC 1/2", foto factura |

> **Tip:** Usa **Chat de la Chamba** (no chat general) → Todo queda en timeline inmutable de la chamba.

### 13.3 Marañas Durante Ejecución (Ver Sección 10)

> **Regla:** Cualquier trabajo **fuera del alcance original** = Marana obligatoria antes de ejecutar.

### 13.6 Check-out: Protocolo de Cierre

**Cuándo:** Trabajo 100% completo, limpieza hecha, cliente presente si posible.

**Pasos:**
1. Chamba → Botón **"Finalizar Chamba"**
2. **Cámara** → Foto final: Trabajo terminado + Limpieza + Tu presencia opcional
3. **GPS** → Captura automática
4. **Confirmar** → Subida → Estado `COMPLETADO_PENDIENTE`
5. **Toast:** "Chamba finalizada. Esperando confirmación del solicitante."

> **Validación:** Foto distinta a check-in (comparación perceptual hash), GPS ≤ 100m del check-in.

### 13.7 Post Check-out: Confirmación y Rating

| Plazo | Qué Pasa |
|-------|----------|
| **0-48h** | Solicitante recibe notificación → Abre chamba → "Confirmar finalización" |
| **48h sin acción** | Auto-confirmación → Estado `COMPLETADA` |
| **Inmediato post-confirmación** | Rating mutuo (1-5 + comentario) + Endosos (solicitante → PDS) + 10 ChambeCoins PDS + Certificado PDF |

---

## 14. Gestión de Portafolio y Certificación de Habilidades

### 14.1 Portafolio: Tu Escaparate de Pruebas

| Métrica | Target | Por Qué |
|---------|--------|---------|
| **Items totales** | ≥ 3 aprobados | Mínimo para badge "Portafolio Completo" |
| **Variedad categorías** | ≥ 2 oficios distintos | Demuestra versatilidad |
| **Antes/Después** | ≥ 50% items | Prueba visual de transformación |
| **Calidad media** | Rating staff ≥ 4/5 | Staff aprueba/rechaza en 24h |

### 14.2 Endosos: Validación Social (5 = Validado)

| Paso | Quién | Acción |
|------|-------|--------|
| 1 | Solicitante (post-chamba) | Ve lista competencias del PDS → Marca checkboxes |
| 2 | Sistema | Cuenta endosos por competencia |
| 3 | Al llegar a **5 endosos distintos** | Competencia → Estado `VALIDADA` + Badge dorado 🏅 |
| 4 | PDS | Notificación: "¡Tu competencia 'Instalación tubería PVC' fue validada!" |

> **Regla:** 1 endoso por cliente por competencia. No auto-endoso.

### 14.3 Certificaciones CUOC/SENA

| Nivel | Requisito | Beneficio |
|-------|-----------|-----------|
| **Técnico** | Certificado SENA + Práctica verificada | Badge "Técnico Certificado" + Filtro premium |
| **Tecnólogo** | Título + Experiencia 3+ años | Ranking prioritario en búsquedas |
| **Especialista** | Certificación avanzada + Portafolio 10+ | Top 3 en recomendaciones ML |

---

# PARTE IV: MÓDULO MERCHANT / NEGOCIO — COMERCIO LOCAL INTELIGENTE

## 15. Ficha de Negocio: Tu Escaparate Digital

### 15.1 Anatomía de la Ficha Completa

| Sección | Campos | Validación | Visibilidad |
|---------|--------|------------|-------------|
| **Identidad** | Nombre, Slug (auto), Tipo (Comercio/Servicio/Restaurante/Otro) | Único | Pública + Mapa |
| **Descripción** | 100-2000 chars | Rich text | Perfil + Mapa |
| **Ubicación** | Dirección + Lat/Lng (mapa drag) + Radio cobertura (km) | Geocoding + Mapa | Mapa + "Cerca de ti" |
| **Contacto** | Tel, WhatsApp, Email, Instagram, FB, Web, Sitio web | Validación formato | Perfil + Mapa |
| **Horarios** | Grid L-D: Abierto/Cerrado + Hora apertura/cierre | Grid 7x2 | Perfil + "Abierto ahora" badge |
| **Categorías** | Principal + 2 Secundarias (13 catálogos) | Multi-select | Filtros mapa/búsqueda |
| **Servicios** | Array[Nombre, Descripción, Precio desde] | Min 1 | Perfil + Anuncios |
| **Imágenes** | Logo (1:1), Banner (16:9), Galería (hasta 10) | WebP auto | Perfil + Mapa (banner rotativo) |
| **Palabras Clave** | Tags (categoría, barrio, ciudad, tags custom) | Tags input | SEO interno + Mapa |
| **Redes Sociales** | IG, FB, TikTok, Web, WhatsApp Business | URLs válidas | Iconos clicables |
| **Verificación** | KYC Negocio (Cámara Comercio + RUT + Rep Legal) | Badge 🛡️ | Mapa + Perfil |

### 15.2 Verificación KYC Negocio (Obligatoria para Publicar)

| Documento | Tipo | Validación |
|-----------|------|------------|
| **Cédula Representante Legal** | Frente + Reverso (PDF/JPG) | OCR + FaceMatch |
| **Selfie + Cédula** | Foto cara + doc visible | Liveness check |
| **Cámara de Comercio** | PDF (vigencia < 3 meses) | Verificación API RUES |
| **RUT** | PDF (vigente) | Validación DIAN |
| **Comprobante Dirección** | Recibo servicio / Contrato arrendamiento | Geocoding match |

> **Estados:** `pendiente_verificacion` → `en_revision` → `verificado` / `rechazado` (nota)
> **Tiempo:** 24-48h hábiles. Notificación push en cada cambio.

### 15.3 Mapa del Negocio: Comportamiento

| Elemento | Comportamiento |
|----------|----------------|
| **Pin Principal** | Siempre visible (centro del mapa) |
| **Banner Rotativo** | Sobre el pin: rota cada 5s entre anuncios `PUBLICADO` + `visible_mapa=true` |
| **Radio Cobertura** | Círculo semi-transparente (radio_km configurable) |
| **Badge "Abierto Ahora"** | Verde pulsante si horario actual = abierto |
| **Click en Pin** → Panel lateral con: Nombre, Categoría, Rating, Anuncios activos, Botón "Ver Perfil" |

---

## 16. Anuncios Laborales: De Vacantes a Servicios

### 16.1 Tipos de Anuncio y Sus Reglas

| Tipo | Uso | Campos Específicos | Costo Monedas |
|------|-----|-------------------|---------------|
| **Empleo** | Vacantes fijas/tiempo completo | Vacantes (int), Horario fijo, Requisitos | 10 (publicar) / 5 (reactivar) |
| **Servicio** | Servicios recurrentes (ej. limpieza semanal) | Precio base, Frecuencia, Área cobertura | 10 / 5 |
| **Producto** | Venta de bienes (ej. materiales) | Precio, Stock, Envío/Retiro | 10 / 5 |
| **Oferta** | Promociones temporales (2x1, descuento) | Precio oferta, Vigencia (desde/hasta) | 10 / 5 |

### 16.2 Flujo de Publicación (Wizard 4 Pasos)

| Paso | Contenido | Validaciones |
|------|-----------|--------------|
| **1. Tipo + Título** | Chips visuales + Input (5-80 chars) | Título único por negocio |
| **2. Detalles** | Categoría + Descripción + Especificaciones | Desc ≥ 50 chars |
| **3. Ubicación + Precio** | Mapa (drag) + Precio (COP) / Vacantes / Precio oferta | Coords obligatorias si visible_mapa |
| **4. Visibilidad + Multimedia** | Toggle "En mapa" + Logo/Banner/Galería + Horarios | Logo/Banner obligatorios si visible_mapa |

### 16.3 Estados de Anuncio

| Estado | Qué Significa | Transiciones |
|--------|---------------|--------------|
| `BORRADOR` | Guardado, no publicado | → `PUBLICADO` (click Publicar + monedas) |
| `PUBLICADO` | Visible en mapa/búsqueda | → `CERRADO` (click Cerrar + motivo) |
| `CERRADO` | No visible, historial | → `PUBLICADO` (Reabrir: 5 monedas) |
| `PENDIENTE_VERIFICACION` | KYC negocio en revisión | → `VERIFICADO` / `RECHAZADO` |

### 16.4 Costo en Monedas (Configurable por Superadmin)

| Acción | Costo Default | Config Key |
|--------|---------------|------------|
| Publicar anuncio | 10 monedas | `costo_publicar_anuncio` |
| Reactivar (CERRADO → PUBLICADO) | 5 monedas | `costo_reactivar_anuncio` |
| Destacar en mapa (futuro) | 20 monedas/día | `costo_destacar_anuncio` |

> **Si no hay monedas:** Modal "Te faltan N monedas" → Botón "Recargar" → Compra → Auto-reintento publicación.

---

## 17. Gestión de Postulaciones y Selección

### 17.1 Flujo Postulación (PDS/Solicitante → Anuncio Merchant)

```
POSTULANTE (PDS o Solicitante)
    │ Click "Postularse" en anuncio
    ▼
FORMULARIO POSTULACIÓN
    ├── Mensaje (obligatorio)
    ├── Teléfono contacto (auto: perfil)
    ├── Email contacto (auto: perfil)
    └── CV/Portafolio adjunto (opcional)
    ▼
MERCHANT RECIBE NOTIFICACIÓN
    │ "Nueva postulación a 'Se busca mesero'"
    ▼
GESTIÓN EN PANEL MERCHANT
    │ Lista postulaciones (Nuevas primero)
    ▼
    ├── CONTACTAR → Abre Chat directo
    ├── SELECCIONAR → Marca "Seleccionado" (solo 1)
    │   ├── Notifica a postulante: "¡Seleccionado!"
    │   └── Cierra anuncio automáticamente
    ├── DESCARTAR → Marca "Descartado" (oculto para postulante)
    └── MOTIVO CIERRE (si cierra sin seleccionar) → Obligatorio
```

### 17.2 Panel de Gestión (Merchant)

| Vista | Qué Ver | Acciones |
|-------|---------|----------|
| **Pendientes** | Nuevas postulaciones (badge rojo) | Contactar / Seleccionar / Descartar |
| **Seleccionado** | 1 solo (badge verde) | Ver perfil / Chat / Deseleccionar |
| **Contactados** | Historial de chats abiertos | Continuar conversación |
| **Descartados** | Ocultos para postulante | Restaurar (si error) |

### 17.3 Métricas de Anuncio (Dashboard Merchant)

| Métrica | Cálculo | Uso |
|---------|---------|-----|
| **Vistas** | Unique views (IP+día) | Ajustar título/fotos si bajo |
| **Postulaciones** | Count unique postulantes | Subir monedas si 0 en 48h |
| **Tasa Conversión** | Seleccionados / Postulaciones | Mejorar descripción si < 10% |
| **Tiempo Respuesta** | Promedio chat respuesta | Compromiso < 2h = badge "Respuesta Rápida" |

---

# PARTE V: ECONOMÍA INTERNA - BILLETERA Y CHAMBECOINS

## 18. Filosofía Económica: Monedas Virtuales vs Ledger COP

### 18.1 Dos Economías Separadas

| Concepto | ChambeCoins (Monedas Virtuales) | Ledger COP (Contable) |
|----------|--------------------------------|----------------------|
| **Naturaleza** | Moneda virtual de plataforma | Registro contable interno |
| **Origen** | Compra con COP real (ChambePay) | Actividad en app (chambas, contratos) |
| **Uso** | Firmar contratos, publicar anuncios, destacar | **Solo métricas / certificado** |
| **Retirable** | ❌ No | ❌ No (solo métrica) |
| **Transferible** | ❌ No (salvo reembolso idempotente) | N/A |
| **Expiración** | Promocionales: 30 días | No expira |
| **Visible en** | Billetera → Pestaña "Monedas" | Billetera → Pestaña "Finanzas" |

### 18.2 Por Qué Esta Separación

| Problema | Solución Dual |
|----------|---------------|
| **Regulatorio** | Monedas virtuales ≠ dinero electrónico (no requieren licencia bancaria) |
| **Fiscal** | Ledger COP = métrica actividad, no renta gravable |
| **Operativo** | Monedas = motor de plataforma (cobros, incentivos) |
| **Transparencia** | Usuario ve: "Gané 500k COP en chambas" + "Tengo 200 monedas" |

### 18.3 Flujo de Dinero Real vs Virtual

```
DINERO REAL (COP)                    MONEDAS VIRTUALES
    │                                      │
    ▼                                      ▼
Usuario paga $15.000 COP          Usuario gasta 150 monedas
por paquete "Estándar"                firmando contrato
    │                                      │
    ▼                                      ▼
ChambePay (simulado)              Ledger COP: +0 (no ingreso)
    │                                      │
    ▼                                      ▼
Monedas acreditadas: +165       Wallet.monedas_saldo += 165
    │                                      │
    ▼                                      ▼
PDS firma contrato              Gasta 46 monedas
    │                                      │
    ▼                                      ▼
Ledger COP: +150.000 (ingreso)   Wallet.monedas_saldo -= 46
    │                                      │
    ▼                                      ▼
Solicitante paga $150.000       (Fuera de app: efectivo/Nequi)
    │                                      │
    ▼                                      ▼
PDS recibe $150.000 real        Ledger COP: +150.000 (egreso solicitante)
```

> **Clave:** El **dinero real del servicio NUNCA pasa por ChambeApp**. La plataforma solo cobra **tarifa de uso en monedas**.

---

## 19. ChambePay: Pasarela Simulada Realista

### 19.1 Arquitectura de Estados

```
PENDIENTE (15 min TTL)
    │
    ├── CONFIRMAR (usuario click / webhook) → COMPLETADO ✅
    │       ├── Crea CompraPaquete (estado=completado)
    │       ├── Acredita monedas (wallet + movimiento + coin)
    │       └── Notificación: "Se acreditaron N monedas"
    │
    ├── CANCELAR (usuario click) → FALLIDO ❌
    │       └── Libera reserva, sin cargos
    │
    └── EXPIRAR (15 min sin confirmar) → EXPIRADO ⏰
            └── Libera reserva, usuario debe crear nuevo pago
```

### 19.2 Flujo de Usuario (UX Realista)

```
1. BOTÓN "COMPRAR" EN PAQUETE
    ▼
2. POST /wallet/coins/checkout {paquete_id}
    → Response: {pago_id, url_redirect: "/pago/simulado/123", expira_en}
    ▼
3. REDIRECT A /pago/simulado/:pagoId?return_to=...
    ▼
3. PANTALLA DE PAGO (3 FASES VISUALES)
    ├── FASE 1: "Conectando con ChambePay..." (700ms, spinner)
    ├── FASE 2: "Verificando pago..." (1600ms, barra progreso)
    ├── FASE 3: "Acreditando monedas..." (POST /confirmar)
    │       ├── SUCCESS → Toast "Se acreditaron N monedas" + Redirect return_to
    │       └── ERROR/EXPIRADO → Modal "Vencido/Error" + Botones [Reintentar] [Volver a paquetes]
    ▼
4. REDIRECCIÓN AUTOMÁTICA
    → return_to (sanitizado) O billetera según rol
```

### 19.3 Endpoints ChambePay

| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| `/wallet/coins/checkout` | POST | JWT | Crea pago pendiente, retorna `pago_id` + `url_redirect` |
| `/wallet/pagos/<id>` | GET | JWT | Estado actual del pago |
| `/wallet/pagos/<id>/confirmar` | POST | JWT | Confirma pago → acredita monedas (idempotente) |
| `/wallet/pagos/<id>/cancelar` | POST | JWT | Cancela pendiente → `fallido` |
| `/wallet/pagos/<id>/webhook` | POST | **Sin JWT** | Callback simulado pasarela (testing) |

### 19.4 Webhook Simulado (Testing Automatizado)

```bash
# En tests: simula pasarela real confirmando pago
curl -X POST http://localhost:5000/api/v1/wallet/pagos/123/webhook
# Response idéntico a /confirmar pero sin JWT
```

---

## 20. Estrategias de Compra y Gestión de Monedas

### 20.1 Catálogo de Paquetes (Configurable por Superadmin)

| Paquete | Monedas Base | Bonus | Total | Precio COP | $/Moneda | Mejor Para |
|---------|--------------|-------|-------|------------|----------|------------|
| **Básico** | 50 | 0 | 50 | $5.000 | $100 | Prueba / 1 contrato |
| **Estándar** | 150 | 15 | 165 | $15.000 | $91 | Usuario activo mensual |
| **Premium** | 350 | 50 | 400 | $30.000 | $75 | Power user / Negocio |
| **Empresarial** | 1000 | 200 | 1200 | $75.000 | $62 | Merchant alto volumen |

> **Ofertas temporales:** Precio tachado + Precio oferta + Badge "Oferta" + Countdown timer.

### 20.2 Estrategias de Compra Inteligente

| Perfil | Estrategia Recomendada |
|--------|------------------------|
| **Solicitante ocasional** (1-2 trabajos/mes) | Compra **Básico** cuando falte → Gasto ~$5k/mes |
| **PDS activo** (5-10 ofertas/mes) | **Estándar** mensual → $15k = 165 monedas ≈ 10 firmas |
| **Merchant alto volumen** (20+ anuncios/mes) | **Premium** quincenal → $30k = 400 monedas ≈ 40 publicaciones |
| **Empresa/Constructora** | **Empresarial** mensual + Factura automática |

### 20.3 Recarga Inteligente: Flujo "Monedas Insuficientes"

```
1. Usuario intenta ACCIÓN (Firmar / Publicar / Reactivar)
    ▼
2. Backend: 400 MONEDAS_INSUFICIENTES:46:Necesitas 46 monedas...
    ▼
3. Frontend: Modal "Monedas Insuficientes"
    ├── Texto: "Te faltan 46 monedas para firmar este contrato"
    ├── Botón "Recargar ahora" → /comprar-monedas?return_to=...
    └── Botón "Ahora no" → Cierra modal
    ▼
3. Usuario compra → Pago simulado → Monedas acreditadas
    ▼
4. return_to detectado → REDIRECT AUTOMÁTICO a acción original
    ▼
5. REINTENTO AUTOMÁTICO de la acción original
    ▼
6. ÉXITO → Toast "Acción completada" + Redirect a destino final
```

> **Clave:** `sessionStorage` guarda `chambe_pending_firma` / `chambe_pending_anuncio` con payload exacto → Reintento **idempotente** una sola vez.

---

## 21. Finanzas: Ledger COP, Certificados y Analítica

### 21.1 Ledger COP: Qué Es y Qué No Es

| ✅ SÍ Es | ❌ NO Es |
|----------|----------|
| Registro contable de **actividad en la app** | Saldo retirable |
| Ingresos: Chambas completadas, Contratos, Maraños | Saldo para pagar servicios |
| Egresos: Comisiones, Anuncios, Monedas gastadas | Transferible a otros usuarios |
| Métrica para **Certificado de Ingresos** | Dinero real / Cuenta bancaria |

### 21.2 Vista Finanzas (Billetera → Pestaña "Finanzas")

| Sección | Qué Muestra | Fórmulas |
|---------|-------------|----------|
| **Resumen** | Ingresos / Egresos / Neto COP | `ingresos - egresos` |
| **Desglose Ingresos** | Chambas + Marañas + Contratos + Otros | `SUM(monto) WHERE tipo IN (chamba, maraña, contrato)` |
| **Desglose Egresos** | Chambas pagadas + Marañas + Comisiones + Anuncios | `SUM(monto) WHERE tipo IN (gasto_anuncio, comision, etc)` |
| **Retiros** | Total retirado a cuenta bancaria | `SUM(monto) WHERE tipo=RETIRO` |

> **Nota:** El ledger COP **no se usa para pagar nada**. Es pura analítica.

### 21.3 Certificado de Ingresos (Solo PDS)

| Campo | Fuente |
|-------|--------|
| **Ingresos por chambas** | `SUM(chamba.monto) WHERE estado=COMPLETADA` |
| **Chambas completadas** | `COUNT(*) WHERE estado=COMPLETADA` |
| **Período** | Desde primera chamba → Hoy (o filtro fecha) |
| **Fecha generación** | NOW |
| **Formato** | PDF (A4, logo, firma digital hash, QR verificación) |

**Descarga:** Billetera → Botón "Certificado" → Modal preview → "Descargar PDF"

### 21.4 Métricas Personales (Dashboard Usuario)

| Métrica | Cálculo | Frecuencia |
|---------|---------|------------|
| **Monedas gastadas mes** | `SUM(movimientos.cantidad) WHERE tipo=gasto AND mes=actual` | Tiempo real |
| **Tasa conversión ofertas** | `Ofertas aceptadas / Ofertas enviadas` | Diaria |
| **Tiempo avg respuesta** | `AVG(oferta.created_at - solicitud.created_at)` | Semanal |
| **Ingresos netos COP** | `Ledger.ingresos - Ledger.egresos` | Tiempo real |

---

# PARTE VI: COMUNICACIÓN Y COLABORACIÓN

## 21. Chat Inteligente: Tipos, Estructura, Automatismos

### 21.1 Tipos de Conversación y Ciclo de Vida

| Tipo | Participantes | Trigger Creación | Ciclo de Vida |
|------|---------------|------------------|---------------|
| **Solicitud-Oferta** | Solicitante ↔ PDS | Primera oferta enviada | Vive mientras solicitud `PUBLICADA/EN_PROGRESO` → Archiva tras `COMPLETADA` |
| **Contrato-Chamba** | Solicitante ↔ PDS | Firma contrato (ambas partes) | Persiste post-`COMPLETADA` (evidencia legal) |
| **Anuncio-Postulación** | Merchant ↔ Postulante | Primera postulación | Vive mientras anuncio `PUBLICADO/CERRADO` |
| **Soporte** | Usuario ↔ Staff/Admin | Click "Ayuda → Chat Soporte" | 30 días inactividad → Archivo |

### 21.2 Estructura de Mensaje

| Campo | Tipo | Detalle |
|-------|------|---------|
| **contenido** | Text | Texto plano (max 5000 chars) |
| **tipo** | Enum | `texto` / `imagen` / `video` / `ubicacion` / `sistema` / `archivo` |
| **metadata** | JSON | `{url, size, mime, width, height, duration}` |
| **leido** | Boolean | `false` → `true` al abrir chat |
| **timestamp** | ISO8601 | UTC |

### 21.3 Mensajes de Sistema (Auto-generados)

| Evento Trigger | Mensaje Auto (Template) |
|----------------|-------------------------|
| Nueva oferta | `"{{nombre_pds}} ofertó ${{monto}}: '{{mensaje_oferta[:50]}}..."` |
| Oferta aceptada | `"¡Oferta aceptada! Firma el contrato para iniciar la chamba."` |
| Contrato firmado (ambos) | `"Ambas partes firmaron. La chamba inicia hoy. ¡Éxitos!"` |
| Check-in PDS | `"{{nombre_pds}} inició la chamba. 📍{{distancia}}km del sitio"` |
| Check-out PDS | `"{{nombre_pds}} finalizó la chamba. Esperando tu confirmación."` |
| Solicitante confirma | `"Chamba completada. +10 monedas para {{pds_nombre}}. ¡Califica!"` |
| Pago simulado completado | `"Pago simulado completado. Se acreditaron {{N}} monedas."` |
| Calificación recibida | `"Recibiste {{puntaje}}⭐ de {{nombre}}. {{comentario[:30]}}"` |
| KYC aprobado | `"Tu documento {{clave}} fue aprobado. ¡Ya puedes ofertar/publicar!"` |
| Nueva postulación | `"{{nombre}} se postuló a tu anuncio '{{titulo}}'"` |

### 21.4 Funciones Avanzadas de Chat

| Función | Cómo | Detalle |
|---------|------|---------|
| **Imágenes** | 📎 → Cámara/Galería → Auto-comprime WebP 85% / max 1920px | Subida paralela 3 hilos |
| **Video** | 📎 → Video (max 30s, 50MB) | Compresión H.264 720p |
| **Ubicación** | 📍 → "Enviar mi ubicación" | GPS actual + precisión |
| **Archivo** | 📎 → Archivo (PDF, DOC, XLS) | Max 10MB, tipos permitidos |
| **Respuesta Rápida** | Desliza mensaje → "Responder" | Cita original + input |
| **Reacciones** | Long-press mensaje → 👍 ❤️ 😂 😮 😢 😡 | Contador visible |
| **Marcar No Leído** | Long-press → "Marcar no leído" | Badge rojo reaparece |
| **Buscar en Chat** | Lupa 🔍 → Texto / Fecha / Tipo | Highlight resultados |

---

## 22. Notificaciones: Centro de Control Inteligente

### 22.1 Arquitectura de Notificaciones

| Capa | Tecnología | Detalle |
|------|------------|---------|
| **Push** | Firebase Cloud Messaging (FCM) | Tokens por dispositivo, topics por rol |
| **In-App** | WebSocket (Socket.IO) + Polling fallback | Real-time en app abierta |
| **Email** | SendGrid / AWS SES | Template HTML + Texto plano |
| **Persistencia** | Tabla `notifications` + `notification_cascades` | Historial completo |

### 22.2 Tipología Completa (30+ Tipos)

| Categoría | Eventos | Prioridad | Canales Default |
|-----------|---------|-----------|-----------------|
| **OFERTAS** | Nueva oferta, Aceptada, Rechazada, Contraoferta, Retirada | Alta | Push + In-App + Email |
| **CONTRATOS** | Firma pendiente, Firmado (ambos), Check-in, Check-out, Completado, Cancelado | Alta | Push + In-App |
| **PAGOS/MONEDAS** | Pago completado, Monedas acreditadas, Insuficientes, Pago fallido/expirado | Media | Push + In-App |
| **CHAT** | Nuevo mensaje, Mención (@usuario), Respuesta a tu mensaje | Media | Push (si app cerrada) + In-App |
| **CALIFICACIONES** | Nueva calificación, Endoso recibido, Habilidad validada | Baja | In-App + Email |
| **KYC** | Documento aprobado/rechazado, Verificación completada | Alta | Push + Email |
| **ANUNCIOS** | Nueva postulación, Seleccionado, Anuncio cerrado, Reactivado | Media | Push + In-App |
| **SISTEMA** | Mantenimiento programado, Nueva versión, Seguridad, Promociones | Baja | In-App + Email |

### 22.3 Centro de Notificaciones (UI)

| Vista | Funcionalidad |
|-------|---------------|
| **Todas** | Lista cronológica (más reciente arriba) + Infinite scroll |
| **No Leídas** | Filtro `leida=false` + Badge rojo en campana |
| **Por Tipo** | Tabs: Ofertas / Contratos / Pagos / Chat / Sistema |
| **Acciones** | Swipe izq: "Marcar leída" / Swipe der: "Eliminar" / Click: Navega a origen |
| **Acciones Masivas** | "Marcar todas como leídas" / "Eliminar todas leídas" |

### 22.4 Configuración Granular (Perfil → Notificaciones)

| Control | Qué Controla |
|---------|-------------|
| **Push Global** | ON/OFF maestro |
| **Por Categoría** | 10 toggles independientes (Ofertas, Contratos, Pagos, Chat, KYC, Anuncios, Sistema, Calificaciones, Disputas, Promociones) |
| **Por Canal** | Push / Email / In-App (matriz 10x3 = 30 combinaciones) |
| **Horario Silencioso** | "No molestar" 22:00-07:00 (configurable) → Queuea pushes |
| **Sonido/Vibración** | Por categoría (sonido personalizado + patrón vibración) |

### 22.5 Badge Inteligente en Campana

| Estado | Visual |
|---------|--------|
| **0 no leídas** | Campana gris simple |
| **1-9** | Badge rojo con número |
| **10-99** | Badge rojo "9+" |
| **100+** | Badge rojo "99+" + punto pulsante |

---

# PARTE VII: IDENTIDAD, CONFIANZA Y SEGURIDAD

## 23. KYC Profundo: Verificación por Rol y Nivel

### 23.1 Matriz de Documentos por Rol

| Documento | PDS | Solicitante | Merchant | Staff/Verificador |
|-----------|-----|-------------|----------|-------------------|
| **Identidad** (Frente+Reverso) | ✅ Obligatorio | ✅ Obligatorio | ✅ Obligatorio (Rep Legal) | ✅ Obligatorio |
| **Selfie + Documento** | ✅ Obligatorio | ✅ Obligatorio | ✅ Obligatorio | ✅ Obligatorio |
| **Antecedentes Judiciales** | ✅ Obligatorio | ❌ | ❌ | ❌ |
| **Validación Profesional** | ✅ Por oficio (CUOC/SENA) | ❌ | ❌ | ❌ |
| **Certificado Bancario** | ✅ Obligatorio (cuenta destino) | ❌ | ✅ Obligatorio | ❌ |
| **Comprobante Residencia** | ✅ Obligatorio | ✅ Obligatorio | ✅ Obligatorio | ❌ |
| **Cámara de Comercio** | ❌ | ❌ | ✅ Obligatorio | ❌ |
| **RUT** | ❌ | ❌ | ✅ Obligatorio | ❌ |
| **Licencia Funcionamiento** | ❌ | ❌ | ✅ Si aplica | ❌ |

### 23.2 Estados de Documento (Máquina de Estados)

```
NO_ENVIADO
    │ (Usuario sube archivo)
    ▼
ENVIADO ─────────────────────┐
    │ (Verificador revisa)   │
    ├── APROBADO ────────────┤
    │   ├── Badge verde ✅   │
    │   ├── Desbloquea acciones (ofertar, publicar) │
    │   └── Notificación push │
    │                          │
    └── RECHAZADO ───────────┘
        ├── Nota obligatoria (motivo)
        ├── Usuario ve en "Verificación" → "Corregir y reenviar"
        └── Re-subida → Vuelve a ENVIADO
```

### 23.3 Niveles de Verificación (Perfil Público)

| Nivel | Requisitos | Badge | Desbloquea |
|-------|------------|-------|------------|
| **Nivel 0** | Sin KYC | ⚪ Gris | Solo navegar |
| **Nivel 1** | Identidad + Selfie aprobados | 🔵 Azul | Publicar solicitudes (Solicitante) |
| **Nivel 2** | + Antecedentes + Validación Prof. | 🟢 Verde | Ofertar, Postularse, Alertas (PDS) |
| **Nivel 3** | + Cert. Bancario + Residencia | 🟣 Morado | Publicar Anuncios (Merchant) |
| **Nivel 4** | + Cámara Comercio + RUT (Merchant) | 🟡 Dorado | Verificación Negocio Completa |

### 23.4 Flujo de Subida (UX)

```
1. Perfil → "Verificación de Identidad"
    ▼
2. Lista de documentos requeridos (chips por estado)
    ├── 🔴 Pendiente → Click → Cámara/Galería → Recorte → Subir
    ├── 🟡 En revisión → Spinner + "En revisión (24-48h)"
    ├── 🟢 Aprobado → Check verde + "Aprobado"
    └── 🔴 Rechazado → 🔴 Badge + "Requiere corrección" + Nota
    ▼
2. Click en rechazado → Modal con NOTA del verificador
    ▼
3. "Corregir y reenviar" → Nueva subida → Vuelve a ENVIADO
```

> **Tip Foto:** Sin flash directo, fondo plano, 4 esquinas visibles, texto legible.

---

## 24. Sistema de Confianza: TrustScore, Endosos, Badges

### 24.1 TrustScore: Fórmula Matemática (0.0 - 1.0)

```python
trust_score = (
    0.25 * (1 if kyc_verificado else 0)                    # KYC
  + 0.25 * min(rating_promedio / 5.0, 1.0)                 # Reputación
  + 0.20 * min(contratos_completados / 50.0, 1.0)         # Experiencia
  + 0.15 * min(portafolio_aprobados / 10.0, 1.0)          # Calidad portafolio
  + 0.15 * min(referidos / 5.0, 1.0)                        # Red social
)
```

| Rango | Etiqueta | Color | Significado |
|-------|----------|-------|-------------|
| 0.00 - 0.30 | **Bajo** | 🔴 Rojo | Perfil nuevo / incompleto |
| 0.31 - 0.50 | **Medio** | 🟡 Amarillo | Activo pero sin historial fuerte |
| 0.51 - 0.70 | **Bueno** | 🟢 Verde | Confiable, historial sólido |
| 0.71 - 0.85 | **Muy Bueno** | 🔵 Azul | Experto confiable |
| 0.86 - 1.00 | **Excelente** | 🟣 Púrpura | Referente top plataforma |

### 24.2 Endosos: Validación Social (5 = Validado)

| Paso | Actor | Acción |
|------|-------|--------|
| 1 | Solicitante (post-chamba) | Ve competencias del PDS → Marca checkboxes |
| 2 | Sistema | Incrementa contador por competencia |
| 3 | Al llegar a **5 endosos de clientes DISTINTOS** | Competencia → `VALIDADA` + Badge 🏅 |
| 4 | PDS recibe notificación | "¡Tu competencia 'Instalación tubería PVC' fue validada!" |

| Estado Competencia | Badge | Significado |
|--------------------|-------|-------------|
| Sin endosos | ⚪ Gris | Sin validar |
| 1-4 endosos | 🔵 Azul | En proceso |
| **5+ endosos** | 🏅 **Dorado** | **VALIDADA** (Top skill) |

> **Regla:** 1 endoso por cliente por competencia. No auto-endoso. Solo post-chamba `COMPLETADA`.

### 24.3 Badges del Ecosistema

| Badge | Cómo Se Gana | Rareza | Beneficio |
|-------|--------------|--------|-----------|
| **Primer Contrato** | Primera chamba `COMPLETADA` | Común | Psicológico |
| **Perfil Completo** | 100% perfil + KYC | Común | Visibilidad +15% |
| **Verificado** | KYC Nivel 2+ | Común | Confianza + Filtros |
| **Top Rated** | Rating ≥ 4.8 (mín 10 ratings) | Raro | Ranking +10% |
| **10 Contratos** | 10 chambas `COMPLETADA` | Poco común | Confianza |
| **50 Contratos** | 50 chambas `COMPLETADA` | Raro | Experto |
| **100 Contratos** | 100 chambas `COMPLETADA` | Épico | Leyenda |
| **Top Rated Merchant** | Rating ≥ 4.9 (20+ ratings) | Muy raro | Prioridad mapa |
| **Sin Disputas** | 0 disputas abiertas (mín 20 contratos) | Poco común | Confianza |
| **Respuesta Rápida** | Avg respuesta chat < 30 min (50+ chats) | Poco común | Prioridad chat |
| **Mentor** | 10+ endosos dados a otros | Raro | Comunidad |
| **Experto Validado** | 5+ competencias 🏅 | Raro | Filtro premium |

---

## 25. Seguridad Avanzada: 2FA, Sesiones, Privacidad

### 25.1 Matriz de Amenazas y Mitigaciones

| Amenaza | Vector | Mitigación Implementada |
|---------|--------|-------------------------|
| **Credential Stuffing** | Listas credenciales filtradas | Rate limit login (5/min), 2FA obligatorio staff, Device fingerprinting |
| **Account Takeover** | Phishing, malware | 2FA obligatorio staff, Device trust scoring, Session binding IP |
| **Session Hijacking** | XSS, MITM | HttpOnly/Secure/SameSite cookies, JWT short-lived (30min), Rotation |
| **Data Breach** | SQLi, NoSQLi, IDOR | ORM parametrizado, Row-level security, Audit log inmutable |
| **Fraude KYC** | Docs falsos, Deepfake | Liveness check, OCR + FaceMatch, Verificador humano |
| **Fraude Pagos** | Chargeback, Card testing | ChambePay simulado (sin tarjetas reales), Idempotencia, Webhook HMAC |
| **Abuso Recomendaciones** | Gaming del ML | Shadow mode, A/B logging, Feature flags kill-switch |

### 25.2 Device Trust Scoring (Silencioso)

| Señal | Peso | Acción si Score Bajo |
|-------|------|----------------------|
| Dispositivo conocido (cookie + FP) | 30% | Requiere 2FA |
| IP consistente (últimos 7 días) | 20% | Challenge email |
| User-Agent consistente | 15% | Log de auditoría |
| Horario habitual | 10% | Log |
| Geolocalización consistente | 15% | Alerta seguridad |
| 2FA activo | 10% | (Bonus positivo) |

> **Umbral:** Score < 40 → Requiere 2FA obligatorio en siguiente login sensible.

### 25.3 Auditoría Inmutable (Tabla `audit_logs`)

| Evento | Qué Se Loggea | Retención |
|--------|---------------|-----------|
| Login/Logout | User, IP, Device, Location, Success/Fail | 2 años |
| Cambio Contraseña/2FA | User, IP, Old/Hash New, Method | 5 años |
| Acciones Críticas (Pagos, Contratos, KYC, Admin) | Actor, Target, Before/After JSON, IP | 7 años |
| Accesos Admin/Superadmin | User, Action, Target, Params, IP | 7 años |
| Errores 5xx | Stack trace, Request, User, Context | 1 año |

> **Inmutable:** Append-only, hash encadenado (hash anterior + hash actual), firma digital diaria.

---

# PARTE VIII: CONTRATOS, PAGOS Y RESOLUCIÓN

## 25. Anatomía del Contrato Digital

### 25.1 Estructura Legal (Cumple Ley 527/1999 Colombia)

| Cláusula | Contenido | Origen |
|----------|-----------|--------|
| **1. Partes** | Identificación completa (Nombre, Doc, Email, Dirección) | Perfiles + KYC |
| **2. Objeto** | Descripción detallada del servicio/obra | Solicitud + Oferta |
| **3. Alcance y Especificaciones** | Entregables, Materiales, Normas técnicas, Calidad | Especificaciones + Oferta |
| **4. Precio y Forma de Pago** | Monto total (COP), Monedas cobradas, Forma pago acordada | Oferta + Cobros |
| **5. Plazos y Cronograma** | Inicio, Fin, Hitos, Horarios, Penalties | Solicitud + Oferta + Hitos |
| **6. Obligaciones PDS** | Ejecución, Materiales, Seguridad, Calidad, Limpieza | Estándar + Especificaciones |
| **7. Obligaciones Solicitante** | Acceso, Materiales propios, Pagos, Decisiones oportunas | Estándar |
| **8. Garantías** | 6 meses mano de obra + materiales (configurable) | Estándar + Oferta |
| **8. Seguros** | Responsabilidad civil (opcional), Riesgos laborales | Opcional |
| **8. Propiedad Intelectual** | Diseños, planos, fotos → Propiedad del solicitante | Estándar |
| **9. Confidencialidad** | Datos personales, técnicos, comerciales | Estándar |
| **10. Fuerza Mayor** | Definición, Notificación 48h, Suspensión plazos | Estándar |
| **11. Terminación** | Causas, Preaviso 5 días, Liquidación, Penalizaciones | Estándar |
| **12. Disputas** | Mediación ChambeApp → Arbitraje → Judicial | **Obligatorio** |
| **13. Ley Aplicable** | República de Colombia | Fija |
| **14. Firmas** | Digitales (Ley 527/1999) + Hash SHA-256 | **Obligatorio** |

### 25.2 Hash de Integridad

```python
# Al firmar cada parte:
contract_hash = sha256(
    json.dumps(contract_content, sort_keys=True) + 
    firma_solicitante_hash + 
    firma_proveedor_hash
).hexdigest()

# Almacenado en: contract.hash_integridad
# Verificación posterior: recalcular y comparar
```

---

## 26. Chambas: Gestión de Obra/Servicio Profesional

> Ver **Sección 9** para detalle técnico completo. Aquí enfoque operativo.

### 26.1 Roles y Responsabilidades en Chamba

| Acción | PDS | Solicitante | Staff (si disputa) |
|--------|-----|-------------|-------------------|
| Check-in (inicio) | ✅ Obligatorio | ❌ | ✅ Audit |
| Subir evidencias | ✅ Principal | ✅ Puede | ✅ Audit |
| Crear Maraños | ✅ Inicia | ✅ Aprueba/Rechaza | ✅ Medía |
| Check-out (fin) | ✅ Obligatorio | ❌ | ✅ Audit |
| Confirmar finalización | ❌ | ✅ (48h) | ✅ Force-complete |
| Calificar/Endosar | ✅ Mutuo | ✅ Mutuo | ❌ |
| Abrir Disputa | ✅ | ✅ | ✅ Gestiona |

### 26.2 Timeline Inmutable (Event Sourcing)

Cada chamba genera **eventos inmutables** en orden cronológico:

```json
[
  {"event": "CHAMBA_CREATED", "timestamp": "2026-11-18T10:00:00Z", "actor": "system"},
  {"event": "CHECK_IN", "timestamp": "2026-11-18T08:00:00Z", "actor": "pds_123", "data": {"gps": "...", "photo_hash": "..."}},
  {"event": "EVIDENCE_ADDED", "timestamp": "2026-11-18T10:30:00Z", "actor": "pds_123", "data": {"type": "photo", "url": "..."}},
  {"event": "MARANA_CREATED", "timestamp": "2026-11-18T14:00:00Z", "actor": "pds_123", "data": {"monto": 80000, "desc": "Pintar techo"}},
  {"event": "MARANA_APPROVED", "timestamp": "2026-11-18T14:30:00Z", "actor": "sol_456", "data": {"marana_id": 789}},
  {"event": "CHECK_OUT", "timestamp": "2026-11-18T17:00:00Z", "actor": "pds_123", "data": {"gps": "...", "photo_hash": "..."}},
  {"event": "COMPLETION_CONFIRMED", "timestamp": "2026-11-18T18:00:00Z", "actor": "sol_456"},
  {"event": "RATING_CREATED", "timestamp": "2026-11-18T18:05:00Z", "actor": "sol_456", "data": {"score": 5, "comentario": "Excelente trabajo"}}
]
```

> **Inmutable:** Append-only, hash encadenado, firma digital diaria.

---

## 27. Hitos de Pago: Contratos Fraccionados

### 27.1 Cuándo Usar Hitos

| Tipo Proyecto | Ejemplo | Hitos Típicos |
|---------------|---------|---------------|
| **Construcción/Remodelación** | Casa completa | 1. Cimentación 2. Estructura 3. Cerramientos 4. Acabados 5. Entrega |
| **Instalaciones Complejas** | Aire acondicionado central | 1. Diseño 2. Equipos 3. Instalación 4. Puesta en marcha |
| **Proyectos Largos** (> 30 días) | Mantenimiento anual | Mensuales / Por fase |

### 27.2 Creación de Hitos (Solo Solicitante, Pre-Contrato)

```json
POST /wallet/milestones/<contract_id>/create
{
  "hitos": [
    {"descripcion": "Cimentación y estructura", "monto": 5000000},
    {"descripcion": "Mampostería y cerramientos", "monto": 8000000},
    {"descripcion": "Instalaciones hidrosanitarias", "monto": 3000000},
    {"descripcion": "Acabados y pintura", "monto": 4000000},
    {"descripcion": "Entrega final y protocolos", "monto": 2000000}
  ]
}
```

**Reglas:**
- Suma hitos = Monto contrato
- Máx 12 hitos
- Cada hito: descripción + monto (≥ 10.000 COP)

### 27.3 Ciclo de Aprobación por Hito

```
PDS EJECUTA HITO 1
    │ Sube evidencias + "Solicitar aprobación hito 1"
    ▼
SOLICITANTE RECIBE NOTIFICACIÓN
    │ Revisa evidencias + visita opcional
    ▼
    ├── APROBAR → Estado: APROBADO
    │   ├── Hito marcado completado
    │   ├── Pago liberado (acuerdo fuera app o monedas)
    │   └── PDS puede solicitar siguiente hito
    │
    └── RECHAZAR → Estado: RECHAZADO
        ├── Motivo obligatorio
        └── PDS corrige → Vuelve a solicitar
```

### 27.4 Auto-completado

```
TODOS LOS HITOS APROBADOS
    │
    ▼
AUTO: Contrato → COMPLETADO (si no hay más hitos)
    │
    ▼
CHAMBA → CHECK_OUT disponible
```

---

## 28. Disputas y Resolución Automatizada

### 28.1 Tipos de Disputa

| Categoría | Ejemplos | SLA Resolución |
|-----------|----------|----------------|
| **Calidad** | Trabajo mal ejecutado, materiales defectuosos | 7 días |
| **Alcance** | PDS hizo menos/más de lo acordado | 5 días |
| **Pago** | Solicitante no paga monto acordado fuera app | 3 días |
| **Incumplimiento** | PDS no llega, abandona, no comunica | 2 días (urgente) |
| **Daños** | PDS rompe algo del inmueble | 5 días |
| **Contractual** | Incumplimiento cláusulas contrato | 7 días |

### 28.2 Flujo de Disputa (Automatizado + Humano)

```
USUARIO ABRE DISPUTA (desde Contrato/Chamba/Chat)
    │ Formulario: Tipo + Descripción + Evidencias (fotos/docs)
    ▼
SISTEMA: Crea Ticket + Asigna Staff (Round-robin + especialidad)
    ▼
NOTIFICACIÓN A AMBAS PARTES + STAFF
    │ "Disputa abierta: #DSP-20261118-0042 - Calidad trabajo"
    ▼
CHAT TRIPARTITO CREADO (Solicitante + PDS + Staff)
    │ Solo participantes + Staff pueden ver/escribir
    ▼
STAFF GESTIONA:
    ├── Pide evidencias adicionales (fotos, contratos, chats)
    ├── Propone mediación (videollamada opcional)
    ├── Decisión preliminar (borrador)
    └── DECISIÓN FINAL VINCULANTE
    ▼
EJECUCIÓN AUTOMÁTICA:
    ├── Reembolso monedas (si aplica) → Idempotente
    ├── Penalización TrustScore (si aplica)
    ├── Bloqueo temporal / Permanente (si grave)
    └── Notificación a ambas partes + PDF decisión
```

### 28.3 Penalizaciones Automatizadas

| Infracción | Penalización TrustScore | Bloqueo | Monedas |
|------------|-------------------------|---------|---------|
| Abandono chamba (sin check-out 48h) | -0.15 | 7 días | -50 monedas |
| Trabajo defectuoso (confirmado staff) | -0.10 | 3 días | -30 monedas |
| No pago acordado (fuera app) | -0.20 | 14 días | -100 monedas |
| Documentos KYC falsos | -0.50 | Permanente | -500 monedas |
| Reincidencia (3+ en 6 meses) | -0.30 | 30 días / Permanente | -200 monedas |

> **Apelación:** 5 días hábiles → Revisión por Superadmin → Reversión si procede.

---

# PARTE IX: ECOSISTEMA DE CONFIANZA

## 29. Sistema de Calificaciones Bidireccional

### 29.1 Mecánica

| Momento | Quién Califica a Quién | Escala | Obligatorio |
|---------|------------------------|--------|-------------|
| Post-`COMPLETADA` | Solicitante → PDS | 1-5 ⭐ + Comentario (500 chars) | ✅ Sí |
| Post-`COMPLETADA` | PDS → Solicitante | 1-5 ⭐ + Comentario | ✅ Sí |
| Durante `EN_PROGRESO` | PDS → Solicitante (opcional) | 1-5 | Opcional |

### 29.2 Cálculo y Visibilidad

| Métrica | Fórmula | Visibilidad |
|---------|---------|-------------|
| **Rating Promedio** | `AVG(puntaje) WHERE calificado_id = user` | Público (perfil + tarjetas) |
| **Total Ratings** | `COUNT(*)` | Público |
| **Distribución** | Histograma 1-5 | Detalle perfil |
| **Últimos 3 Comentarios** | `ORDER BY creado_en DESC LIMIT 3` | Detalle perfil |

### 29.3 Reporte y Moderación

| Situación | Acción |
|-----------|--------|
| Comentario ofensivo / difamatorio | Reportar → Staff revisa 24h → Oculta si procede |
| Rating spam (mismo usuario múltiples) | Auto-detect: 1 rating por contrato por parte |
| Extorsión ("5 estrellas o te denuncio") | Reporte → Staff → Penalización -0.2 TrustScore |

---

## 30. Endosos: Validación Social de Competencias

> Ver **Sección 14.2** para detalle. Resumen operativo:

| Concepto | Detalle |
|----------|---------|
| **Qué** | Validación social de competencia técnica |
| **Quién endosa** | Solicitante (post-chamba `COMPLETADA`) |
| **Qué se endosa** | Competencias específicas del catálogo CUOC/SENA |
| **Umbral validación** | **5 endosos de clientes DISTINTOS** |
| **Resultado** | Competencia → `VALIDADA` + Badge 🏅 + Filtro premium |
| **Notificación** | Push + Email a PDS: "¡Competencia 'X' validada!" |

> **Anti-gaming:** 1 endoso por cliente por competencia. Solo post-`COMPLETADA`. No auto-endoso.

---

## 31. TrustScore: La Matemática de la Confianza

### 31.1 Fórmula Completa (Pesos Sumados = 1.0)

```python
trust_score = (
    0.25 * KYC_Score                    # 0.0 - 1.0
  + 0.25 * Reputation_Score             # rating/5.0
  + 0.20 * Experience_Score             # min(contratos/50, 1.0)
  + 0.15 * Portfolio_Quality_Score      # min(portafolio/10, 1.0)
  + 0.15 * Referral_Score               # min(referidos/5, 1.0)
)
```

### 31.2 Desglose por Componente

| Componente | Cálculo Detallado | Peso | Máximo |
|------------|-------------------|------|--------|
| **KYC_Score** | `1.0 si Nivel≥2 else 0.5 si Nivel=1 else 0.0` | 25% | 0.25 |
| **Reputation_Score** | `min(rating_promedio / 5.0, 1.0)` | 25% | 0.25 |
| **Experience_Score** | `min(contratos_completados / 50.0, 1.0)` | 20% | 0.20 |
| **Portfolio_Quality** | `min(items_aprobados / 10.0, 1.0)` | 15% | 0.15 |
| **Referral_Score** | `min(referidos_exitosos / 5.0, 1.0)` | 15% | 0.15 |

### 24.3 Uso del TrustScore en el Sistema

| Uso | Cómo Afecta |
|-----|-------------|
| **Ranking Búsqueda** | Multiplicador final: `score_final = score_base * (0.5 + 0.5 * trust_score)` |
| **Filtro "Solo Verificados"** | `trust_score >= 0.5` (equivale a Nivel 2 KYC) |
| **Elegibilidad Anuncios Premium** | `trust_score >= 0.7` |
| **Prioridad Soporte** | `trust_score >= 0.7` → Cola prioritaria |
| **Límite Ofertas Simultáneas** | `max_ofertas = 3 + floor(trust_score * 10)` (3 a 13) |
| **Descuento Monedas** | `descuento = trust_score * 10%` en paquetes (máx 10%) |

---

## 32. Badges y Gamificación de Confianza

### 32.1 Catálogo Completo (20+ Badges)

| Categoría | Badge | Trigger | Rareza | Beneficio |
|-----------|-------|---------|--------|-----------|
| **Inicio** | Primer Contrato | 1ª chamba COMPLETADA | Común | Psicológico |
| **Inicio** | Perfil Completo | 100% checks + KYC | Común | Visibilidad +15% |
| **Confianza** | Verificado | KYC Nivel 2+ | Común | Filtros + Confianza |
| **Calidad** | Top Rated | Rating ≥ 4.8 (10+ ratings) | Raro | Ranking +10% |
| **Volumen** | 10 Contratos | 10 chambas COMPLETADA | Poco común | Confianza |
| **Volumen** | 50 Contratos | 50 chambas | Raro | Experto |
| **Volumen** | 100 Contratos | 100 chambas | Épico | Leyenda |
| **Comercio** | Top Merchant | Rating ≥ 4.9 (20+ ratings) | Muy raro | Prioridad Mapa |
| **Conducta** | Sin Disputas | 0 disputas (20+ contratos) | Poco común | Confianza |
| **Comunicación** | Respuesta Rápida | Avg chat < 30 min (50+) | Poco común | Prioridad Chat |
| **Comunidad** | Mentor | 10+ endosos dados | Raro | Visibilidad |
| **Maestría** | Experto Validado | 5+ competencias 🏅 | Raro | Filtro Premium |
| **Especial** | Early Adopter | Usuario < 1000 | Leyenda | Historia |
| **Especial** | Beta Tester | Participó beta testing | Leyenda | Acceso anticipado |

---

# PARTE X: SUPERADMINISTRACIÓN Y GOBERNANZA

## 33. Dashboard Ejecutivo: Métricas en Tiempo Real

### 33.1 KPIs Principales (Tiempo Real)

| KPI | Cálculo | Actualización | Alerta Si |
|-------|---------|---------------|-----------|
| **Usuarios Activos (DAU)** | `COUNT(DISTINCT user_id) WHERE last_login > 24h` | 5 min | < 80% vs ayer |
| **Solicitudes Publicadas** | `COUNT(*) WHERE creado_en > 24h` | 5 min | < 50% vs promedio |
| **Tasa Conversión** | `Contratos / Solicitudes` (7 días) | 15 min | < 15% |
| **Ingresos Monedas (COP/día)** | `SUM(paquetes.precio) WHERE date=hoy` | 5 min | < 80% vs promedio |
| **Chambas Activas** | `COUNT(*) WHERE estado=EN_EJECUCION` | 5 min | > 200 (capacidad staff) |
| **Disputas Abiertas** | `COUNT(*) WHERE estado=abierta` | 5 min | > 20 |
| **KYC Pendientes** | `COUNT(*) WHERE estado=enviado` | 5 min | > 50 (capacidad verificadores) |
| **Salud ML** | `model_version` + `predictions_24h` + `fallback_rate` | 15 min | `fallback_rate > 20%` |

### 33.2 Visualizaciones (Gráficos)

| Gráfico | Dimensión | Periodo | Interactividad |
|---------|-----------|---------|----------------|
| **Usuarios Nuevos** | Día / Semana / Mes | 30 / 90 / 365 días | Zoom + Tooltip + Export CSV |
| **Embudo Conversión** | Solicitud → Oferta → Contrato → Chamba → Completado | 30 días | Click paso → Drill-down |
| **Mapa de Calor Actividad** | Lat/Lng + Intensidad solicitudes | 30 días | Zoom mapa + Filtro categoría |
| **Salud ML** | NDCG@10 / Precision@5 / Latencia p95 | 7 / 30 días | Alerta si NDCG < 0.65 |
| **Economía Monedas** | Compras / Gastos / Saldo neto / Monedas en circulación | 30 / 90 días | Stacked area + Proyección |

---

## 34. Gestión de Paquetes: Economía de Monedas

### 34.1 CRUD Completo (`/superadmin/paquetes`)

| Acción | Permisos | Validaciones |
|--------|----------|--------------|
| **Crear** | Superadmin | Nombre único, Cantidad ≥1, Precio ≥1, Bonus ≥0, Orden único |
| **Editar** | Superadmin | Parcial (PATCH), no cambia ID |
| **Desactivar** | Superadmin | Soft delete (`activo=false`), no borra histórico |
| **Activar** | Superadmin | Reactiva `activo=true` |
| **Reordenar** | Superadmin | Drag & Drop → Envía array IDs completo → Valida permutación |
| **Oferta Temporal** | Superadmin | `en_oferta=true` + `precio_oferta_cop` + `oferta_desde/hasta` |

### 34.2 Reglas de Negocio Paquetes

| Regla | Detalle |
|-------|---------|
| **Precio Efectivo** | `precio_oferta_cop` si `en_oferta=true` Y `oferta_desde ≤ NOW ≤ oferta_hasta` ELSE `precio_cop` |
| **Recálculo Automático** | Si `precio_moneda_cop` cambia → `precio_cop = cantidad * precio_moneda_cop` (ofertas manuales se conservan) |
| **Orden de Visualización** | `orden` ASC (1,2,3...) → Drag & Drop en admin |
| **Mínimos** | `cantidad ≥ 1`, `precio_cop ≥ 1`, `bonus ≥ 0`, `orden ≥ 0` |
| **Oferta Valida** | `en_oferta=true` → Requiere `precio_oferta_cop` < `precio_cop` Y `oferta_desde < oferta_hasta` |

---

## 35. Tarifas y Parámetros Económicos

### 35.1 Las 6 Tarifas Maestras (`/superadmin/tarifas`)

| Clave | Default | Descripción | Validación | Impacto |
|-------|---------|-------------|------------|---------|
| `pct_contrato` | 3.0% | % monto contrato cobrado en monedas a **cada parte** | 0-100 | Cobro al firmar |
| `precio_moneda_cop` | 100 | Precio referencia 1 moneda (recalcula paquetes) | ≥1 | Economía base |
| `monedas_fijas` | 1 | Monedas fijas sumadas al cobro contrato | ≥0 | Piso mínimo |
| `min_monedas_contrato` | 10 | Mínimo monedas por parte al firmar | ≥1 | Protección inflación |
| `costo_publicar_anuncio` | 10 | Monedas para publicar anuncio | ≥0 | Ingreso merchants |
| `costo_reactivar_anuncio` | 5 | Monedas para reactivar anuncio cerrado | ≥0 | Recurrencia |

### 35.2 Reglas de Cambio

| Cambio | Efecto Inmediato | Efecto Diferido |
|--------|------------------|-----------------|
| `pct_contrato` | Próximo cobro firma | - |
| `precio_moneda_cop` | **Recalcula TODOS los paquetes** (`precio_cop = cantidad * precio`) | Ofertas manuales (`precio_oferta_cop`) se conservan |
| `monedas_fijas` | Próximo cobro | - |
| `min_monedas_contrato` | Próximo cobro | - |
| `costo_publicar_anuncio` | Próxima publicación | - |
| `costo_reactivar_anuncio` | Próxima reactivación | - |

### 35.3 Auditoría de Cambios

| Campo | Qué Se Guarda |
|-------|---------------|
| `clave` | Nombre tarifa |
| `valor_anterior` | Float |
| `valor_nuevo` | Float |
| `actualizado_por` | User ID (Superadmin) |
| `actualizado_en` | Timestamp UTC |
| `ip` | IP del admin |

---

## 36. Auditoría de Usuarios y Billeteras

### 36.1 Buscador de Usuarios (`/superadmin/usuarios?q=`)

| Filtro | Qué Busca |
|--------|-----------|
| **Email** | ILIKE `%q%` |
| **ID Exacto** | `q` numérico → `id = q` |
| **Rol** | Filtro lateral (checkboxes) |
| **Estado** | `activo` / `suspendido` / `banned` |

**Resultado:** Tabla paginada (20/page) → Email, Nombre, Rol, Monedas, Saldo COP, Último login

### 36.2 Ficha de Billetera Usuario (`/superadmin/usuarios/<id>/billetera`)

| Sección | Qué Muestra | Solo Lectura |
|---------|-------------|--------------|
| **Usuario** | Email, Nombre, Rol, ID | ✅ |
| **Wallet** | Saldo COP, Saldo Bloqueado, Monedas, Created/Updated | ✅ |
| **Monedas** | Saldo, Compradas, Gastadas, Promocionales, Ganadas | ✅ |
| **Resumen Financiero** | Ingresos/Egresos/Neto COP + Detalle por rol | ✅ |
| **Movimientos Monedas** | Tabla paginada (tipo, cantidad, saldo, desc, ref, fecha) | ✅ |
| **Compras Paquetes** | Tabla (fecha, paquete, monedas, precio, pasarela, estado, ref) | ✅ |

> **Solo lectura.** Sin botones de edición. Para auditoría y soporte.

### 36.3 Compras Históricas (`/superadmin/compras`)

| Filtro | Qué Filtra |
|--------|------------|
| `page` / `per_page` | Paginación (default 20) |
| `user_id` | Compras de un usuario |
| `paquete_id` | Compras de un paquete |
| `estado` | `completado` / `pendiente` / `fallido` / `expirado` |
| `fecha_desde/hasta` | Rango fechas |

**Resultado:** Items con `user_email`, `usuario_nombre`, `paquete_nombre`, `monedas`, `precio_cop`, `pasarela`, `estado`, `referencia`, `creado_en`

---

## 37. Analítica Histórica: 10 Meses de Inteligencia

### 37.1 Métricas Diarias (`metrics_daily` — 300 días)

| Métrica | Descripción | Uso Dashboard |
|---------|-------------|---------------|
| `contratos` | Contratos creados/día | Gráfico líneas + Media móvil 7d |
| `solicitudes` | Solicitudes publicadas/día | Barras + Media móvil |
| `ofertas` | Ofertas enviadas/día | Líneas |
| `ingresos_cop` | Ingresos ledger COP/día | Área apilada |
| `comisiones_cop` | Comisiones plataforma/día | Línea |
| `usuarios_nuevos` | Registros/día | Barras |
| `kyc_aprobados` | KYC aprobados/día | Línea |
| `monedas_ganadas` | Monedas ganadas (fidelidad)/día | Barras |
| `monedas_gastadas` | Monedas gastadas (firmas, anuncios)/día | Barras |
| `paquetes_vendidos` | Paquetes comprados/día | Línea |
| `alertas_enviadas` | Notificaciones push enviadas/día | Línea |
| `afiliaciones` | Suscripciones activadas/día | Línea |
| `certificados` | Certificados ingresos generados/día | Línea |
| `disputas` | Disputas abiertas/día | Línea (0/1) |
| `evasion` | Usuarios que evaden pago (fuera app) | Línea (0/1) |
| `tiempo_primera_oferta_min` | Promedio min hasta 1ª oferta | Línea + Benchmark |
| `pds_activos` | PDS con ≥1 acción/día | Línea |
| `solicitantes_activos` | Solicitantes con ≥1 acción/día | Línea |

### 37.2 Segmentos Mensuales (`metrics_segment_monthly` — 10 meses)

| Dimensión | Valores (Ejemplos) | Métricas Por Segmento |
|-----------|-------------------|----------------------|
| **region** | "Valledupar Centro", "La Mesa", "Patillal" | Contratos, Solicitudes, Ingresos |
| **oficio** | "Plomería", "Electricidad", "Pintura" | Contratos, Rating Avg, Tiempo 1ª oferta |
| **genero** | "Hombres", "Mujeres", "No especifica" | Usuarios, Contratos, Retención |
| **edad** | "18-24", "25-28", "29-35", "36-45", "46-55", "56+" | Onboarding, Conversión |
| **urgencia** | "hoy", "semana", "flexible" | Tiempo 1ª oferta, Tasa conversión |
| **canal** | "Orgánico", "Referido", "Campaña pagada" | CAC, LTV |
| **distancia** | "0-2km", "2-5km", "5-10km", "10-15km", "15+" | Match rate, Satisfacción |
| **primera_oferta** | "<15min", "15-30min", "30min-2h", "2-4h", "4-24h", ">24h" | Conversión |
| **revision_kyc** | "<6h", "6-12h", "12-24h", "24-48h", ">48h" | Tasa aprobación |
| **firma** | "<1h", "1-4h", "4-12h", "12-24h", ">24h" | Tiempo cierre |
| **cohorte** | "Enero", "Febrero", ... "Noviembre" | Retención M1/M3/M6 |
| **formalidad** | "Formal", "Informal" | Ingresos, Protección social |

### 37.3 Consultas Avanzadas (Superadmin)

```sql
-- Top 10 oficios por contratos completados (últimos 3 meses)
SELECT categoria, COUNT(*) as contratos
FROM contracts c
JOIN solicitudes s ON c.service_id = s.id
WHERE c.estado = 'completado' 
  AND c.fin_en > NOW() - INTERVAL '3 months'
GROUP BY s.categoria
ORDER BY contratos DESC
LIMIT 10;

-- Retención de PDS por cohorte (mes registro)
SELECT 
  DATE_TRUNC('month', u.fecha_registro) as cohorte,
  COUNT(DISTINCT u.id) as total_pds,
  COUNT(DISTINCT CASE WHEN c.estado='completado' THEN c.proveedor_id END) as activos_3m
FROM users u
LEFT JOIN contracts c ON c.proveedor_id = u.id 
  AND c.fin_en > NOW() - INTERVAL '3 months'
WHERE u.rol = 'pds'
GROUP BY 1
ORDER BY 1;
```

---

# PARTE XI: INTELIGENCIA ARTIFICIAL EN CHAMBEAPP

## 38. Motor de Recomendaciones: 4 Cerebros, 1 Factory

### 38.1 Arquitectura General

```
get_recommender() ──► Feature Flags ──► Instancia Concreta
      │
      ├── ml_enabled=False ──► HeuristicRecommender (Base, siempre)
      │
      ├── ml_enabled=True + shadow_mode=True ──► ShadowRecommender (A/B)
      │
      └── ml_enabled=True + shadow_mode=False ──► HybridRecommender (Prod ML)
```

### 38.2 HeuristicRecommender (Cerebro Base — Siempre Disponible)

**Fórmula:** `Score = 0.6×Cat_Match + 0.3×Reputación + 0.1×Verificado`

| Componente | Peso | Cálculo |
|------------|------|---------|
| **Cat_Match** | 0.6 | `1` si categoría en `profile.categorias/habilidades`, `0` si no |
| **Reputación** | 0.3 | `rating_promedio / 5.0` (0.0-1.0) |
| **Verificado** | 0.1 | `1` si `profile.verificado` else `0` |

**Carácter:** Determinista, transparente, fallback universal, 0 dependencias ML.

### 2. HybridRecommender (Cerebro ML — Retrieval + Ranking)

**Arquitectura Two-Stage:**

```
ETAPA 1: RETRIEVAL (PostGIS)
    find_nearby_providers(lat, lng, radius_km, top_k=50)
    → ST_DWithin(geom, ST_MakePoint(lng, lat), radius_m)
    → Devuelve ≤50 candidatos geo-filtrados

ETAPA 2: RANKING ML (LightGBM Lambdarank)
    FeatureExtractor.extract_batch(candidatos, solicitud) → X (n, 22)
    MLRanker.predict(X) → scores [0,1] (sigmoid normalizado)
    → Orden descendente → top_n
    → Fallback heurístico si ML falla
```

**22 Features (Normalizadas 0-1):**

| Grupo | Features |
|-------|----------|
| **Geo (2)** | `distance_km`, `zona_match` |
| **Confianza (5)** | `trust_score`, `kyc_verificado`, `portfolio_calidad`, `badges_count`, `contratos_completados` |
| **Historial (5)** | `rating_avg`, `rating_count`, `tasa_aceptacion`, `tiempo_respuesta_promedio`, `ultima_actividad_dias` |
| **Negocio (4)** | `category_match`, `price_match`, `saturacion_pen`, `disponibilidad` |
| **Rotación (3)** | `bandit_arm_value`, `fresh_provider_bonus`, `exploration_slot` |
| **Metadata (3)** | `hour_of_day`, `day_of_week`, `is_urgent` |

**Modelo:** LightGBM `objective='lambdarank'`, `metric='ndcg'`, 100 rounds, `num_leaves=31`.

### 3. ShadowRecommender (Validación A/B Offline)

```
Usuario pide recomendación
    │
    ├── Shadow ejecuta Hybrid completo (geo + features + ML) → ml_results
    ├── Loggea: "Shadow mode - solicitud 123: ML top-3 = [pds1:0.847, pds2:0.723]"
    └── Retorna HeuristicRecommender (usuario ve solo heurístico)
```

**Métricas Offline (Post-análisis):**
- NDCG@10 ML vs Heurístico vs Ground Truth
- Precision@K: % top-K ML elegidos realmente
- Rank Correlation (Spearman) ML vs Heurístico
- Divergence Rate: % top-1 ML ≠ top-1 Heurístico

### 28.3 VectorRecommender (Futuro: Semántico + pgvector)

```python
# Stack Futuro
Embeddings: sentence-transformers/all-MiniLM-L6-v2 (384 dims)
Vector DB: pgvector + HNSW index
Query: Embedding(service.descripcion + categoria) → Cosine similarity + Metadata filter
Cold-start: Resuelve PDS nuevos sin historial (usa descripción perfil)
```

---

## 39. Shadow Mode: Validación A/B Sin Riesgo

### 39.1 Concepto
> **Ejecuta ML en paralelo, loggea predicciones, pero retorna heurístico al usuario.**

### 39.2 Arquitectura
```
ShadowRecommender
├── heuristic = HeuristicRecommender()     # Lo que ve el usuario (producción)
├── hybrid = HybridRecommender()           # Lo que ejecutamos para loggear
└── _log_comparison(solicitud_id, ml_results)
```

### 39.3 Métricas Offline (Post-procesamiento)

| Métrica | Cómo Calcular | Target |
|---------|---------------|--------|
| **NDCG@10** | Comparar ranking ML vs heurístico vs Ground Truth | ML > Heurístico +5% |
| **Precision@K** | % of top-K ML que fueron elegidos realmente | ML > Heurístico |
| **Rank Correlation (Spearman)** | Correlación entre ML score y heurístico score | > 0.7 |
| **Divergence Rate** | % veces que top-1 ML ≠ top-1 heurístico | 15-30% (saludable) |
| **Calibration** | Score 0.8 ≈ 80% éxito real | ECE < 0.05 |

### 39.4 Decisión de Promoción

```python
# Cuando métricas offline cumplen targets por 2 semanas consecutivas:
if ml_ndcg > heuristic_ndcg * 1.05 and ml_precision > heuristic_precision:
    # Flip feature flag
    UPDATE feature_flags SET enabled=false WHERE key='ml_shadow_mode';
    # Resultado: HybridRecommender activo en prod
```

---

## 40. Bandit Thompson: Exploración Inteligente

### 40.1 Propósito
Multi-Armed Bandit por **categoría de servicio** para rotación inteligente y exploración automática de categorías nuevas/poco volúmenes.

### 40.2 Algoritmo Thompson Sampling

```python
# Prior uniforme por categoría
PRIOR_ALPHA = 1  # Successes + 1
PRIOR_BETA = 1   # Failures + 1

# Selección: Sample Beta(α, β) por categoría → elige máximo
def select_category(categories):
    samples = [np.random.beta(alpha.get(c,1), beta.get(c,1)) for c in categories]
    return categories[np.argmax(samples)]

# Actualización
def update(category, accepted):
    if accepted: alpha[cat] += 1
    else: beta[cat] += 1
    save_state()

# Feature ML
def get_arm_value(category):
    return alpha/(alpha+beta)  # Probabilidad éxito posterior
```

### 40.3 Persistencia
- **Storage:** `SystemConfig['bandit_state']` = `{alpha: {...}, beta: {...}}`
- **Inicialización:** Prior `Beta(1,1)` por categoría nueva
- **Uso en Features:** `bandit_arm_value = α/(α+β)` ∈ [0,1]

---

# PARTE XII: REFERENCIA TÉCNICA Y SOPORTE

## 41. API Reference para Desarrolladores

### 41.1 Autenticación
```
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json

Tokens:
  Access: 30 min (JWT HS256)
  Refresh: 7 días (rotación en uso)
  Endpoints: POST /auth/login, /auth/refresh, /auth/register
```

### 41.2 Endpoints Principales (v1)

| Módulo | Endpoint | Método | Auth | Descripción |
|--------|----------|--------|------|-------------|
| **Auth** | `/auth/login` | POST | Público | Login email/password |
| | `/auth/register` | POST | Público | Registro + rol |
| | `/auth/refresh` | POST | Refresh Token | Renueva access |
| **Solicitudes** | `/solicitudes` | GET/POST | JWT | Listar/Crear |
| | `/solicitudes/<id>` | GET/PATCH | JWT | Detalle/Actualizar |
| | `/solicitudes/<id>/estado` | PATCH | JWT | Transición estado |
| **Ofertas** | `/solicitudes/<id>/ofertas` | GET/POST | JWT | Listar/Crear ofertas |
| | `/ofertas/<id>/responder` | POST | JWT | Aceptar/Rechazar/Contraoferta |
| **Contratos** | `/contracts` | GET/POST | JWT | Listar/Crear |
| | `/contracts/<id>/estado` | PATCH | JWT | Firmar/Completar/Cancelar |
| | `/contracts/<id>/cobro` | GET | JWT | Estimación monedas |
| **Chambas** | `/chambas` | GET | JWT | Lista chambas |
| | `/chambas/<id>/checkin` | POST | JWT | Check-in (foto+GPS) |
| | `/chambas/<id>/checkout` | POST | JWT | Check-out |
| | `/chambas/<id>/evidencias` | POST | JWT | Subir evidencia |
| **Billetera** | `/wallet/` | GET | JWT | Saldo COP + Monedas |
| | `/wallet/coins` | GET | JWT | Saldo monedas desglosado |
| | `/wallet/coins/checkout` | POST | JWT | Inicia compra (ChambePay) |
| | `/wallet/pagos/<id>/confirmar` | POST | JWT | Confirma pago simulado |
| | `/wallet/paquetes` | GET | JWT | Catálogo paquetes |
| | `/wallet/tarifas` | GET | JWT | Tarifas públicas |
| **Monedas Admin** | `/wallet/admin/paquetes` | GET/POST/PATCH/DELETE | Superadmin | CRUD Paquetes |
| | `/wallet/admin/tarifas` | GET/PATCH | Superadmin | Tarifas |
| | `/wallet/admin/usuarios` | GET | Superadmin | Buscar usuarios |
| | `/wallet/admin/usuarios/<id>/billetera` | GET | Superadmin | Ficha completa |
| **Recomendaciones** | `/ai/recommendations?service_id=` | GET | Público* | Ranking PDS |
| | `/ai/solicitudes-for-provider` | GET | JWT (PDS) | Servicios afines |
| **Superadmin** | `/superadmin/metrics/history?days=300` | GET | Superadmin | Métricas 300 días |
| | `/superadmin/metrics/distributions` | GET | Superadmin | Distribuciones segmentadas |

> *Público = No requiere JWT, solo `service_id` query param.

### 21.3 Códigos de Error Estándar

| Código HTTP | Código App | Significado | Acción Cliente |
|-------------|------------|-------------|----------------|
| 400 | `MONEDAS_INSUFICIENTES:<n>:<msg>` | Faltan N monedas | Mostrar modal recarga + auto-reintento |
| 400 | `VALIDATION_ERROR` | Body inválido | Mostrar errores campo por campo |
| 401 | `TOKEN_EXPIRED` / `INVALID_TOKEN` | Auth falló | Auto-refresh → retry / Redirect login |
| 403 | `FORBIDDEN` | Sin permiso | Mostrar "No autorizado" |
| 404 | `NOT_FOUND` | Recurso no existe | "No encontrado" |
| 409 | `CONFLICT` | Duplicado (email, username) | "Ya existe" |
| 422 | `UNPROCESSABLE_ENTITY` | Regla de negocio violada | Mensaje específico |
| 429 | `RATE_LIMITED` | Demasiadas requests | Backoff exponencial + Retry-After |
| 500 | `INTERNAL_ERROR` | Error servidor | "Intenta luego" + Reportar |

---

## 42. Troubleshooting Profundo por Módulo

### 42.1 Módulo Monedas / ChambePay

| Síntoma | Causa Probable | Solución |
|---------|----------------|----------|
| **Checkout retorna 400 "Paquete no disponible"** | Paquete `activo=false` o no existe | Verificar `/wallet/paquetes` → Solo activos |
| **Pago queda en `pendiente` > 15 min** | Webhook no llegó / MinIO caído | Ver logs backend → `POST /webhook` manual |
| **Confirmar pago → 400 "El pago expiró"** | `expira_en` < NOW (15 min TTL) | Usuario debe crear nuevo checkout |
| **Monedas no acreditadas tras confirmar** | `comprar_paquete` falló (FK, constraint) | Ver logs `comprar_paquete` → Reintentar manual |
| **Saldo monedas no actualiza en UI** | Cache frontend / WebSocket desconectado | `refresh()` en hook `useBilletera` / Reconnect WS |

### 42.2 Módulo Recomendaciones (ML)

| Síntoma | Causa | Solución |
|---------|-------|----------|
| **Siempre retorna heurístico (shadow)** | `ml_shadow_mode=true` | Ver flags: `ml_ranking_enabled=true, ml_shadow_mode=false` para prod |
| **Hybrid retorna 0 candidatos** | `find_nearby_providers` vacía | Verificar `service.latitud/longitud` + `radio_km` + PDS con `geom` |
| **ML error → fallback heurístico** | Excepción en `ranker.predict()` | Ver logs `MLRanker` → `model.is_trained()` + `feature_names` match |
| **Feature importance todas 0** | Modelo no entrenado / `train()` falló | Ejecutar `python -m app.ai.train` → Ver `len(X) >= 100` |

### 22.3 Módulo KYC

| Síntoma | Causa | Solución |
|---------|-------|----------|
| **Documento rechazado sin nota** | Verificador no escribió nota | Staff → Editar doc → Agregar nota → Re-notificar |
| **OCR falla en cédula** | Foto borrosa / flash / fondo complejo | Usuario: Re-tomar foto (luz natural, 4 esquinas, sin flash) |
| **FaceMatch falla** | Selfie ≠ Foto cédula | Usuario: Re-tomar selfie (misma luz, sin gafas, cara centrada) |
| **KYC atascado en "en_revision" > 48h** | Falta verificadores / Cola llena | Admin → Asignar verificador / Escalar |

### 22.4 Módulo Chat / WebSocket

| Síntoma | Causa | Solución |
|---------|-------|----------|
| **Mensajes no llegan en tiempo real** | Socket.IO desconectado / CORS | Ver `socket.io` logs → Reconnect automático (5 reintentos) |
| **Notificaciones push no llegan** | Token FCM expirado / Permisos denegados | Frontend: Re-register token → `navigator.serviceWorker.pushManager.subscribe()` |
| **Mensajes duplicados** | Double emit (client + server) | Ver `socket.on('message')` single listener |
| **Chat no carga historial** | Paginación rota / `conversation_id` erróneo | Ver `GET /chat/conversations/<id>/messages?page=` |

### 22.5 Módulo KYC / Verificación

| Síntoma | Causa | Solución |
|---------|-------|----------|
| **Documento rechazado sin nota** | Verificador no escribió nota | Staff → Editar doc → Agregar nota → Re-notificar |
| **OCR falla en cédula** | Foto borrosa / flash / fondo complejo | Usuario: Re-tomar foto (luz natural, 4 esquinas, sin flash) |
| **FaceMatch falla** | Selfie ≠ Foto cédula | Usuario: Re-tomar selfie (misma luz, sin gafas, cara centrada) |
| **KYC atascado en "en_revisión" > 48h** | Falta verificadores / Cola llena | Admin → Asignar verificador / Escalar |

---

## 43. FAQ Exhaustivo: 50+ Preguntas Resueltas

### 💰 Monedas y Pagos (1-10)

**1. ¿Las ChambeCoins se pueden cambiar por dinero real?**
No. Son moneda virtual de uso exclusivo dentro de la plataforma (firmar contratos, publicar anuncios). No son retirables, transferibles a efectivo ni intercambiables entre usuarios.

**2. ¿Cuánto cuestan las monedas?**
Depende del paquete. Ejemplos: Básico 50 monedas = $5.000 COP ($100/moneda), Estándar 165 monedas = $15.000 COP ($91/moneda), Premium 400 monedas = $30.000 COP ($75/moneda). Ver catálogo en Billetera → Paquetes.

**3. ¿Cómo funciona el pago simulado (ChambePay)?**
1. Eliges paquete → Checkout → Se crea `PagoSimulado` estado `pendiente` (15 min TTL).
2. Redirige a `/pago/simulado/:id` → Fases visuales: Conectando → Verificando → Acreditando.
3. Auto-confirma (o webhook) → Estado `completado` → Crea `CompraPaquete` → Acredita monedas instantáneo.
4. Toast "Se acreditaron N monedas" + Redirect automático a donde estabas.

**4. ¿Qué pasa si me quedo sin monedas en medio de una acción?**
La app detecta `MONEDAS_INSUFICIENTES:<n>` → Modal "Te faltan N monedas" → Botón "Recargar ahora" → Te lleva a `/comprar-monedas?return_to=...` → Tras comprar, **vuelve y reintenta automáticamente** la acción original.

**5. ¿Cuántas monedas cuesta firmar un contrato?**
Fórmula: `max(10, trunc((monto × 3%) / 100) + 1)` monedas **por cada parte**.
Ejemplos: $50k → 10 monedas | $100k → 31 | $500k → 151 | $1M → 301. Configurable por Superadmin (`pct_contrato`, `precio_moneda_cop`, `monedas_fijas`, `min_monedas_contrato`).

**6. ¿Cuánto cuesta publicar un anuncio?**
10 monedas (publicar) / 5 monedas (reactivar). Configurable por Superadmin (`costo_publicar_anuncio`, `costo_reactivar_anuncio`).

**7. ¿Puedo transferir monedas a otro usuario?**
No. Las monedas son **intransferibles** entre usuarios. Solo se mueven: Usuario ↔ Plataforma (compra, gasto, reembolso, ganancia).

**8. ¿Las monedas expiran?**
Solo las **promocionales** (bonos, bienvenida, referidos) expiran a los 30 días. Las **compradas** y **ganadas** (fidelidad) **no expiran nunca**.

**9. ¿Qué es el saldo COP en la billetera?**
Es un **ledger contable interno** (métricas). Registra ingresos/egresos de tu actividad en la app (chambas, contratos, comisiones). **No es dinero real**, no se retira, no se usa para pagar. Sirve para certificado de ingresos y métricas.

**10. ¿Cómo descargo mi certificado de ingresos?**
Solo PDS: Billetera → Pestaña "Finanzas" → Botón "Certificado de ingresos" → Modal preview → "Descargar PDF". Incluye: Total ingresos chambas, chambas completadas, período, fecha, hash verificación.

### 📝 Solicitudes y Contratos (11-20)

**11. ¿Puedo editar una solicitud ya publicada?**
Sí, mientras esté en estado `PUBLICADO` y **no tenga ofertas aceptadas**. Ve a "Mis Solicitudes" → Editar. Si ya hay oferta aceptada, no se puede editar (solo cancelar).

**12. ¿Qué pasa si el PDS no hace check-in/check-out?**
Sin check-in: no hay `inicio_en` → chamba no inicia formalmente.
Sin check-out: no hay `fin_en` → chamba queda en `EN_EJECUCION` indefinido.
Contacta Soporte si hay disputa. Staff puede force-complete con evidencias.

**13. ¿Puedo cancelar un contrato ya firmado?**
- **Antes de que ambas partes firmen:** Sí, reembolso 100% monedas a quien pagó.
- **Después de ambas firmas (EN_PROGRESO):** Solo si **no ha habido check-in**. Si ya hubo check-in → Disputa obligatoria.

**14. ¿Qué pasa si el trabajo sale mal / hay disputa?**
Abre **Disputa** desde Contrato/Chamba/Chat → Formulario (Tipo + Descripción + Evidencias) → Staff asignado → Chat tripartito → Decisión vinculante → Ejecución automática (reembolso monedas, penalización TrustScore, bloqueo).

**15. ¿Puedo editar una oferta ya enviada?**
Solo si estado `PENDIENTE` y **no ha sido respondida**. Retirar → Editar monto/mensaje/fecha → Reenviar. Si ya fue `ACEPTADA` o `RECHAZADA` → No editable.

**16. ¿Qué es una "Maraña"?**
Adenda formal al contrato: trabajo extra, cambio de materiales, ampliación de área, imprevisto técnico. PDS crea → Solicitante aprueba/rechaza → Si aprueba: se suma al contrato, evidencias propias, pago acordado.

**17. ¿Cómo funcionan los hitos de pago?**
Solo contratos largos. Solicitante crea hitos (descripción + monto) → PDS ejecuta → Solicita aprobación → Solicitante aprueba/rechaza → Si aprueba: pago liberado (acuerdo fuera app). Todos aprobados → Auto-completado contrato.

**18. ¿Qué pasa si el PDS abandona la chamba?**
Sin check-out 48h → Staff puede force-complete con evidencias. Penalización: -0.15 TrustScore, 7 días bloqueo, -50 monedas. Solicitante puede abrir disputa por abandono.

**19. ¿Puedo tener múltiples roles a la vez?**
Sí. Un email = una cuenta. Puedes ser **PDS + Solicitante + Merchant** simultáneamente. Cambio instantáneo: Header → Selector de rol. Datos compartidos: Wallet, KYC, Chat, Notificaciones, TrustScore.

**19. ¿Cómo funciona el "Shadow Mode" de la IA?**
`ml_ranking_enabled=true` + `ml_shadow_mode=true` → `ShadowRecommender` corre Hybrid (ML) en paralelo, loggea predicciones, **pero retorna Heurístico al usuario**. Permite validar ML offline (NDCG, Precision@K) sin afectar usuarios. Cuando métricas offline confirman superioridad ML → Flip `ml_shadow_mode=false` → Hybrid en prod.

**20. ¿Cómo denuncio a un usuario / trabajo fraudulento?**
Desde perfil/contrato/chat → "Reportar" → Formulario (Tipo: Fraude/Estafa/Suplantación/Calidad + Descripción + Evidencias) → Staff revisa 24h → Penalizaciones: -TrustScore, bloqueo, ban permanente si reincidente.

### 🪪 KYC y Verificación (21-30)

**21. ¿Cuánto tarda la verificación KYC?**
24-48 horas hábiles. Recibes notificación push al cambiar estado. Verificadores humanos revisan cada documento.

**22. ¿Mi documento fue rechazado. ¿Qué hago?**
Abre "Verificación de Identidad" → Ver nota de rechazo (ej: "Foto borrosa", "Documento vencido", "Datos ilegibles") → Corrige → Click "Corregir y reenviar" → Nueva subida → Vuelve a cola de revisión.

**23. ¿Puedo usar la app sin KYC?**
Sí, pero limitado:
- **Solicitante:** Navegar sí, **Publicar NO** (requiere Nivel 1)
- **PDS:** Navegar sí, **Ofertar/Postularse/Alertas NO** (requiere Nivel 2)
- **Merchant:** Navegar sí, **Crear negocio/Publicar/Contratar NO** (requiere Nivel 3)

**24. ¿Qué documentos necesito según mi rol?**
| Rol | Obligatorios |
|-----|--------------|
| **PDS** | Cédula (frente/reverso), Selfie+Doc, Antecedentes, Validación Prof. (por oficio), Cert. Bancaria, Residencia |
| **Solicitante** | Cédula, Selfie, Residencia |
| **Merchant** | Cédula Rep. Legal, Selfie, Cámara Comercio, RUT, Residencia Negocio |

**25. ¿Puedo subir PDF en lugar de foto para KYC?**
Sí. Formatos: JPG, PNG, PDF. Máx 10MB. OCR funciona en ambos. Foto preferible para FaceMatch.

**26. ¿Qué pasa si mi cédula se vence?**
Recibirás notificación 30 días antes. Debes subir nueva cédula vigente → KYC pasa a "en_revisión" → Al aprobar, se reactiva todo.

**27. ¿Puedo usar pasaporte en lugar de cédula?**
Sí, para extranjeros. Pasaporte vigente + Visa/residencia válida + Selfie. Misma validación OCR + FaceMatch.

**28. ¿Mi foto de perfil debe ser profesional?**
Recomendado: Cara visible, fondo neutro, buena luz, sin gafas/sombrero. La app detecta cara (MediaPipe) y valida calidad. Foto borrosa/oscura → Rechazo KYC.

**29. ¿Puedo cambiar mi foto de perfil después de KYC?**
Sí. Perfil → Editar foto → Nueva subida → Validación automática (cara detectada) → Si pasa, actualiza sin re-KYC.

**30. ¿Qué es el "Nivel de Verificación" en mi perfil?**
| Nivel | Requisitos | Badge | Desbloquea |
|-------|------------|-------|------------|
| 0 | Sin KYC | ⚪ | Solo navegar |
| 1 | Identidad + Selfie | 🔵 | Publicar solicitudes |
| 2 | + Antecedentes + Validación Prof. | 🟢 | Ofertar, Postularse, Alertas |
| 3 | + Cert. Bancario + Residencia | 🟣 | Publicar Anuncios (Merchant) |
| 4 | + Cámara Comercio + RUT | 🟡 | Negocio Verificado Completo |

### 🔔 Notificaciones y Chat (31-35)

**31. ¿No me llegan notificaciones push?**
1. Verifica: Ajustes sistema → Apps → ChambeApp → Notificaciones: ON
2. Perfil → Notificaciones → Push: ON
3. No estás en "No molestar" (22:00-07:00 default)
4. Cierra y abre app (refresca token FCM)
5. Si persiste: Ayuda → "Reportar problema" → Logs FCM

**32. ¿Puedo borrar mensajes del chat?**
No. Los chats son **registro inmutable** (evidencia legal). Solo puedes: Archivar conversación (swipe → Archivar), Silenciar notificaciones de esa conversación.

**33. ¿Por qué mis mensajes no se envían?**
1. Sin internet / WiFi inestable
2. WebSocket desconectado → App reconecta auto (5 reintentos)
3. Mensaje > 5000 chars → Divide en varios
3. Archivo > 10MB → Comprime o usa enlace Drive

**34. ¿Qué son los "Mensajes de Sistema" en el chat?**
Son auto-generados por eventos: "Juan ofertó $120k", "Contrato firmado", "Check-in iniciado", "Pago completado", "Calificación recibida". No se pueden borrar, son evidencia legal.

**35. ¿Cómo configuro "No molestar" horario?**
Perfil → Notificaciones → "Horario silencioso" → Inicio (ej 22:00) / Fin (ej 07:00) → Guarda. Durante ese horario: Push queueado → Se entregan al finalizar.

### 🛠️ Técnico y Cuenta (36-40)

**36. ¿Cómo cambio mi email/contraseña?**
Perfil → Seguridad → "Cambiar email" (verifica nuevo email) / "Cambiar contraseña" (actual + nueva 2x).

**37. ¿Puedo tener dos cuentas con el mismo email?**
No. **Un email = una cuenta**. Puedes tener **múltiples roles** en la misma cuenta (PDS + Solicitante + Merchant). Cambio instantáneo: Header → Selector de rol.

**38. La app va lenta / se cierra / consume mucha batería.**
1. Cierra y abre (force close)
2. Verifica actualización en Store (Google Play / App Store)
3. Ajustes → Apps → ChambeApp → Almacenamiento → **Limpiar caché** (no datos)
4. Reinstala si persiste (tus datos están en servidor)
5. Reporta: Ayuda → "Reportar problema" → Logs automáticos adjuntos

**39. ¿Cómo elimino mi cuenta definitivamente?**
Perfil → Privacidad → "Eliminar mi cuenta" → Confirmación 2FA + Email → **30 días para revertir** (cuenta en "pending_delete") → Luego borrado irreversible (GDPR/Ley 1581).

**40. ¿Dónde veo la versión de la app y changelog?**
Perfil → Acerca de → Versión (ej. 1.11.0) + "Ver novedades" → Changelog completo.

### 🏢 Merchant / Negocio (41-45)

**41. ¿Cómo creo mi negocio si ya tengo cuenta de usuario?**
Perfil → Selector de rol → "Merchant" → Si no tienes negocio: "Crear mi negocio" → Wizard 4 pasos (Datos, Ubicación, Horarios, Imágenes) → KYC Negocio → Verificación → Listo para publicar.

**42. ¿Puedo tener múltiples negocios en una cuenta?**
Sí. Un Merchant puede crear **múltiples negocios** (sedes, marcas distintas). Cada uno con su KYC, ficha, anuncios, postulaciones independientes. Selector de negocio en header Merchant.

**43. ¿Qué diferencia hay entre "Empleo" y "Servicio" en anuncios?**
| Tipo | Uso | Campos Especiales |
|------|-----|-------------------|
| **Empleo** | Vacantes fijas (mesero, cajero) | Vacantes (int), Horario fijo, Requisitos, Beneficios |
| **Servicio** | Servicios recurrentes (limpieza, mantenimiento) | Precio base, Frecuencia, Área cobertura, Duración estimada |

**44. ¿Cómo funciona la selección de postulante?**
Merchant ve postulaciones → Click "Seleccionar" en uno → Marca badge verde "Seleccionado" → **Cierra anuncio automáticamente** → Notifica a elegido: "¡Seleccionado para [Título]!" → Abre chat directo.

**45. ¿Puedo destacar mi anuncio en el mapa?**
Próximamente: "Destacar en mapa" → 20 monedas/día (configurable `costo_destacar_anuncio`). Badge "Destacado" + Posición prioritaria en banner rotativo.

### 🤖 IA y Recomendaciones (46-50)

**46. ¿Por qué me recomiendan a ese PDS y no a otro?**
El motor híbrido combina:
1. **Geo:** Distancia real (PostGIS) — peso #1
2. **ML (LightGBM):** 22 features (distancia, match categoría, trust, rating, bandit, etc.)
3. **Heurístico fallback:** Categoría (60%) + Reputación (30%) + Verificado (10%)

Ver explicación en cada recomendación: Botón "¿Por qué este?" → Detalle features + pesos.

**47. ¿Puedo desactivar las recomendaciones de IA?**
No hay toggle usuario aún. Pero: `ml_ranking_enabled=false` (admin) → Solo heurístico. En shadow mode, usuario siempre ve heurístico.

**48. ¿Qué es el "Bandit" que aparece en la explicación?**
Thompson Sampling por categoría. Aprende qué categorías tienen más éxito. `bandit_arm_value` = probabilidad estimada de éxito en esa categoría. Ayuda a explorar categorías nuevas.

**49. ¿Cómo sé si estoy en Shadow Mode o ML real?**
En recomendación verás `ab_group`: "A" = Shadow (heurístico), "B" = ML real (cuando `shadow_mode=false`). Staff ve en logs: `model: "HybridRecommender" | "ShadowRecommender" | "HeuristicRecommender"`.

**50. ¿Puedo entrenar el modelo con mis datos?**
No directamente. El modelo se entrena **offline** con datos históricos anonimizados (`python -m app.ai.train`). Requiere ≥100 samples + queries con positivos/negativos. Superadmin gestiona reentrenamiento.

### 📊 Métricas y Superadmin (51-55)

**51. ¿Cómo accedo al panel Superadmin?**
Rol `superadmin` → Web: `/superadmin` / App: Menú lateral → "Panel Admin" → 4 secciones: Inicio, Paquetes, Tarifas, Billeteras.

**52. ¿Cómo cambio las tarifas de cobro?**
Superadmin → Tarifas → Edita 6 campos → Guardar → Si cambia `precio_moneda_cop`: **Recalcula TODOS los paquetes** automáticamente (ofertas manuales se conservan).

**53. ¿Cómo creo un paquete de monedas personalizado?**
Superadmin → Paquetes → "Nuevo paquete" → Nombre, Descripción, Cantidad, Bonus, Precio COP, Activo, Oferta (precio, desde/hasta), Orden → Guardar → Aparece en catálogo instantáneo.

**54. ¿Cómo veo la billetera de un usuario específico?**
Superadmin → Billeteras → Buscador (email/id) → Click usuario → Ficha completa (Wallet, Monedas, Movimientos, Compras, Resumen financiero). **Solo lectura.**

**55. ¿Cómo exporto métricas para análisis externo?**
Superadmin → Métricas → "Exportar CSV" (diario/mensual) → O API: `GET /superadmin/metrics/history?days=300` + `Authorization: Bearer <superadmin_token>` → JSON listo para Python/R/Tableau.

---

## 44. Glosario Técnico Completo: 80+ Términos

### Términos de Machine Learning

| Término | Definición |
|---------|------------|
| **Lambdarank** | Algoritmo Learning-to-Rank de LightGBM que optimiza NDCG directamente usando gradientes lambda. |
| **NDCG** | Normalized Discounted Cumulative Gain. Métrica de ranking que penaliza elementos relevantes en posiciones bajas. |
| **Learning-to-Rank (LTR)** | Paradigma ML donde el objetivo es ordenar items, no clasificar/regresar individualmente. |
| **Groups/Queries (LTR)** | En Lambdarank, cada "query" (solicitud) define un grupo de candidates. El modelo aprende a rankear dentro de cada grupo. |
| **Feature Extraction** | Proceso de transformar datos crudos (usuario, solicitud, contexto) en vector numérico de 22 features normalizadas. |
| **Retrieval (Two-Stage)** | Primera etapa: filtrar candidatos masivos (ej. geo) → pocos candidatos. Segunda etapa: rankear con modelo costoso (ML). |
| **Lambdarank Objective** | Función de pérdida que aproxima el gradiente de NDCG. `objective='lambdarank'` en LightGBM. |
| **Sigmoid Normalization** | `1 / (1 + exp(-raw_score))` para mapear scores raw de LightGBM a probabilidad [0,1]. |
| **Feature Importance (Gain)** | Importancia de feature medida por reducción total de pérdida (gain) que aporta en los splits del árbol. |
| **Cold Start Problem** | Problema de recomendar items/usuarios nuevos sin historial. VectorRecommender lo resuelve con embeddings semánticos. |
| **Online Learning** | Actualización incremental del modelo con nuevos datos sin reentrenar desde cero (`partial_fit`). |
| **Partial Fit** | Entrenamiento incremental en LightGBM/XGBoost añadiendo árboles al ensemble existente. |
| **Thompson Sampling** | Algoritmo de bandit que muestrea de distribuciones Beta posteriores para balancear exploración/explotación. |
| **Multi-Armed Bandit (MAB)** | Problema de decisión secuencial: elegir entre K opciones (brazos) maximizando recompensa acumulada. |
| **Prior Beta(1,1)** | Distribución a priori uniforme para probabilidad de éxito en Thompson Sampling. |
| **Posterior Beta(α, β)** | Distribución actualizada tras observar `α-1` éxitos y `β-1` fallos. |
| **UCB / Arm Value** | Upper Confidence Bound / Valor del brazo. En Thompson: `α/(α+β)` = media posterior. |
| **Shadow Mode** | Patrón de deployment: modelo nuevo corre en paralelo, loggea predicciones, pero no afecta usuarios. |
| **A/B Testing** | Experimento controlado: grupo A ve versión A, grupo B ve versión B. Métricas comparadas offline/online. |
| **NDCG@K** | Normalized Discounted Cumulative Gain at K. Métrica estándar de ranking (1 = ranking perfecto). |
| **Precision@K** | Proporción de items relevantes en top-K posiciones. |
| **Rank Correlation (Spearman)** | Correlación entre dos rankings (ej. ML vs heurístico). |
| **Divergence Rate** | Porcentaje de queries donde top-1 del modelo A ≠ top-1 del modelo B. |
| **Calibration** | Alineación entre score predicho y probabilidad empírica real (score 0.8 ≈ 80% éxito real). |
| **Feature Engineering** | Proceso de crear/transformar features crudas en señales predictivas (normalización, encoding, interacciones). |
| **Cold Start** | Usuario/item nuevo sin historial → sin features de historial. Solución: features geográficas + categóricas + bandit. |
| **Retrieval vs Ranking** | Retrieval = filtrado rápido (millones → cientos). Ranking = ordenación precisa (cientos → top-10). |
| **PostGIS ST_DWithin** | Función geoespacial: `ST_DWithin(geom1, geom2, distance_meters)` → true si distancia ≤ umbral. |
| **Haversine Formula** | Cálculo distancia esférica entre dos puntos lat/lng. Usado cuando no hay PostGIS. |
| **Sigmoid** | `σ(x) = 1/(1+e⁻ˣ)` mapea ℝ → (0,1). Usado para normalizar scores LightGBM a probabilidad. |
| **Joblib** | Serialización eficiente de objetos Python (modelos ML, numpy arrays). Mejor que pickle para arrays grandes. |
| **Joblib Dump/Load** | `joblib.dump(obj, path)` / `joblib.load(path)` para persistir modelos LightGBM. |

### Términos del Proyecto ChambeApp (Negocio)

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
| **ChambePay** | Pasarela simulada de compra de monedas (pendiente → completado/fallido/expirado). |
| **Lambdarank** | Algoritmo LightGBM para Learning-to-Rank (optimiza NDCG). |
| **Thompson Sampling** | Algoritmo de bandit para rotación de categorías (exploración/explotación). |
| **Shadow Mode** | Patrón de deployment: modelo nuevo corre en paralelo, loggea predicciones, pero no afecta usuarios. |
| **A/B Testing** | Experimento controlado: grupo A ve versión A, grupo B ve versión B. Métricas comparadas offline/online. |
| **NDCG** | Normalized Discounted Cumulative Gain. Métrica estándar de ranking (1 = ranking perfecto). |
| **PostGIS ST_DWithin** | Función geoespacial: `ST_DWithin(geom1, geom2, distance_meters)` → true si distancia ≤ umbral. |
| **Haversine Formula** | Cálculo distancia esférica entre dos puntos lat/lng. Usado cuando no hay PostGIS. |
| **Sigmoid** | `σ(x) = 1/(1+e⁻ˣ)` mapea ℝ → (0,1). Usado para normalizar scores LightGBM a probabilidad. |
| **Joblib** | Serialización eficiente de objetos Python (modelos ML, numpy arrays). Mejor que pickle para arrays grandes. |
| **Joblib Dump/Load** | `joblib.dump(obj, path)` / `joblib.load(path)` para persistir modelos LightGBM. |

---

## 45. Soporte Enterprise: Canales, SLAs, Escalamiento

### 45.1 Canales Oficiales

| Canal | Disponibilidad | Para Qué | Tiempo Respuesta Objetivo |
|-------|----------------|----------|---------------------------|
| **Chat en App** (Ayuda → Chat Soporte) | Lun-Vie 8am-6pm, Sáb 9am-1pm | Dudas de uso, bugs, disputas, KYC | < 30 min |
| **Email** | soporte@chambeapp.com | 24/7 | Consultas formales, legales, privacidad, facturación | < 4 horas hábiles |
| **Centro de Ayuda** (App → Ayuda) | 24/7 | Guías paso a paso, FAQ, videotutoriales, changelog | Auto-servicio |
| **Reporte de Bug** | App → Ayuda → "Reportar problema" | 24/7 | Errores técnicos, crashes, UX, performance | < 24h (triaje) |
| **Emergencia Seguridad** | security@chambeapp.com | 24/7 | Vulnerabilidades, brechas, fraude masivo | < 1 hora |

### 45.2 SLAs por Severidad

| Severidad | Definición | Tiempo Primera Respuesta | Tiempo Resolución |
|-----------|------------|--------------------------|-------------------|
| **P1 - Crítico** | App caída, pago fallido masivo, brecha seguridad, ML caído en prod | < 15 min | < 2 horas |
| **P2 - Alto** | Función crítica rota (pagos, KYC, chat), disputa urgente, KYC masivo rechazado | < 1 hora | < 8 horas |
| **P3 - Normal** | Bug no crítico, duda uso, configuración, feature request | < 4 horas | < 48 horas |
| **P4 - Bajo** | Sugerencias, feedback, documentación, typos | < 24 horas | < 1 semana |

### 45.3 Escalamiento Automático

| Trigger | Acción |
|---------|--------|
| **P1 sin respuesta 15 min** | Alerta PagerDuty → On-call Ingeniero Senior + Tech Lead |
| **P2 sin respuesta 1 hora** | Alerta Slack #support-escalation → Team Lead + Product Manager |
| **Disputa sin staff asignado 30 min** | Alerta → Asignación automática round-robin + notificación Slack |
| **KYC pendiente > 48h** | Alerta → Reasignación automática a verificador disponible |
| **ML fallback_rate > 20%** | Alerta → Alerta #ml-alerts → Rollback automático a heurístico si > 50% |

### 45.4 Plantilla de Reporte de Bug (Para Usuarios)

```
**Título:** [Breve descripción: ej. "Error 500 al confirmar pago simulado"]

**Información de Contexto:**
- Email cuenta: usuario@ejemplo.com
- Rol: PDS / Solicitante / Merchant
- Dispositivo: iPhone 14 Pro / Android 14 / Chrome 119 / App v1.11.0
- Red: WiFi 50Mbps / 4G Claro
- Hora exacta: 2026-11-18 14:32:15 (UTC-5)

**Qué intentaba hacer:**
1. Abrir billetera
2. Click "Comprar" en paquete Estándar
3. Checkout → Redirige a /pago/simulado/123
4. Espera fases → Error en fase "Acreditando"

**Qué pasó:**
- Pantalla se quedó en "Acreditando monedas..." > 30 seg
- Toast rojo: "Error de servidor. Intenta de nuevo."
- Monedas NO acreditadas (saldo sigue 120)
- No hay toast de éxito ni redirect

**Evidencia:**
- Captura pantalla error adjunta
- Logs app (si accesible): Ayuda → "Reportar problema" → Incluye logs

**Impacto:**
- No puedo firmar contrato que expira en 2 horas
- Necesito monedas ya para ofertar en solicitud #4567

**Severidad percibida:** ALTA (bloquea ingreso / pago)
```

---

---

*Manual de Usuario Extensivo ChambeApp v1.11.0 — Noviembre 2026*  
*Documento vivo — Actualizado con cada release*  
*Para desarrolladores: Ver `MOTOR_RECOMENDACIONES_DETALLADO.md` y `API_REFERENCE.md`*  
*© 2026 ChambeApp — Todos los derechos reservados*