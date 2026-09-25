# 📘 DOCUMENTACIÓN FUNCIONAL DEL SOFTWARE — ChambueApp

**Versión:** 1.0  
**Fecha:** 5 de Septiembre, 2026  
**Estado:** ✅ Sistema completo integrado y testeado  
**Referencia de tests:** `HOJA_DE_TESTS.md` (482 tests, 7 flujos)

---

## 📋 ÍNDICE

1. [Resumen del Sistema](#1-resumen-del-sistema)
2. [Diagrama de Arquitectura](#2-diagrama-de-arquitectura)
3. [Catálogo de Funcionalidades (F1-F7)](#3-catálogo-de-funcionalidades)
4. [Requisitos Funcionales](#4-requisitos-funcionales)
5. [Contratos de API](#5-contratos-de-api)
6. [Cobertura de Pruebas](#6-cobertura-de-pruebas)
7. [Estado de Integración](#7-estado-de-integración)

---

## 1. RESUMEN DEL SISTEMA

### 1.1 Descripción

ChambueApp es una plataforma de marketplace de servicios (Chamberos/PDS) que conecta solicitantes con proveedores de servicios en Valledupar, Colombia. El sistema incluye recomendación ML, notificaciones en cascada geoespacial, portafolio multimedia, sistema de confianza (Trust Score + Badges), chat en tiempo real y pagos vía Nequi.

### 1.2 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite PWA |
| State | Zustand |
| UI Real-time | Socket.IO Client |
| Mapas | Mapbox GL JS |
| 360° | A-Frame |
| API Gateway | Flask-Smorest (24 blueprints) |
| Auth | JWT (flask-jwt-extended) |
| ML Engine | LightGBM Lambdarank + FeatureExtractor (22 features) |
| Geoespacial | PostGIS + Haversine fallback |
| Base de datos | PostgreSQL 16 + PostGIS |
| Cache/Colas | Redis 7 |
| Async Tasks | Celery + Celery Beat |
| Storage | MinIO (S3-compatible) |
| Tiempo Real | Flask-SocketIO + Redis message_queue |
| Tests | pytest (272) + Vitest (210) = 482 total |

### 1.3 Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN (React PWA)                      │
│  28 feature modules · 28 componentes · 5 hooks custom           │
│  TrustScore · BadgePanel · PortfolioUploader · GeofenceMap       │
│  NotificationBell(socket) · Viewer360 · BottomNav(socket)       │
├─────────────────────────────────────────────────────────────────┤
│                    API GATEWAY (Flask-Smorest)                    │
│  24 blueprints registrados en app/__init__.py                    │
│  CORS · JWT auth · Rate limiting · Input validation (schemas)    │
├─────────────────────────────────────────────────────────────────┤
│                    SERVICIOS DE DOMINIO                           │
│  TrustService · CascadeManager · StorageService · ABTest         │
│  get_recommender() → HybridRecommender | ShadowRecommender       │
│                     → HeuristicRecommender                       │
├─────────────────────────────────────────────────────────────────┤
│                    ML / FEATURE LAYER                             │
│  FeatureExtractor (22 features) · MLRanker (LightGBM)            │
│  ThompsonBandit · ShadowRecommender · ABTest                     │
├─────────────────────────────────────────────────────────────────┤
│                    SOCKET.IO HANDLERS                             │
│  chat_socket · oferta_socket · notification_socket               │
│  3 handlers · eventos: message, oferta:nueva, notificacion:nueva │
├─────────────────────────────────────────────────────────────────┤
│                    INFRAESTRUCTURA                                │
│  PostgreSQL+PostGIS · Redis · Celery · MinIO · Socket.IO         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. DIAGRAMA DE ARQUITECTURA

```
                        ┌──────────────────────┐
                        │   CLIENTE (React PWA) │
                        │   28 feature modules  │
                        └──────────┬───────────┘
                                   │ HTTP/WS
                        ┌──────────▼───────────┐
                        │  API GATEWAY          │
                        │  Flask-Smorest        │
                        │  24 blueprints        │
                        │  JWT auth + CORS      │
                        └──┬───┬───┬───┬───┬──┘
                           │   │   │   │   │
          ┌────────────────┘   │   │   │   └────────────────┐
          │                    │   │   │                    │
┌─────────▼──────┐  ┌─────────▼───▼───▼─────────┐  ┌──────▼────────┐
│ SERVICIOS      │  │ SERVICIOS DE DOMINIO       │  │ SOCKET.IO     │
│                │  │                            │  │ HANDLERS      │
│ TrustService   │  │ CascadeManager             │  │               │
│ StorageService │  │ ABTest                     │  │ chat_socket   │
│                │  │ get_recommender()          │  │ oferta_socket │
│                │  │                            │  │ notif_socket  │
└───────┬────────┘  └─────────────┬──────────────┘  └───────┬───────┘
        │                         │                         │
        │            ┌────────────▼────────────┐            │
        │            │    ML / FEATURE LAYER    │            │
        │            │                         │            │
        │            │ FeatureExtractor (22)   │            │
        │            │ MLRanker (LightGBM)     │            │
        │            │ ThompsonBandit          │            │
        │            │ ShadowRecommender       │            │
        │            └────────────┬────────────┘            │
        │                         │                         │
┌───────▼─────────────────────────▼─────────────────────────▼───────┐
│                        INFRAESTRUCTURA                             │
│  ┌────────────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌────────────────┐  │
│  │ PostgreSQL  │ │Redis │ │Celery  │ │MinIO │ │ Socket.IO      │  │
│  │ + PostGIS   │ │      │ │+ Beat  │ │      │ │ + Redis MQ     │  │
│  └────────────┘ └──────┘ └────────┘ └──────┘ └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 2.1 Blueprints Registrados (24)

| # | Blueprint | Prefijo | Archivo |
|---|-----------|---------|---------|
| 1 | auth | /api/v1/auth | app/routes/auth.py |
| 2 | users | /api/v1/users | app/routes/users.py |
| 3 | solicitudes | /api/v1/solicitudes | app/routes/solicitudes.py |
| 4 | contracts | /api/v1/contracts | app/routes/contracts.py |
| 5 | notifications | /api/v1/notifications | app/routes/notifications.py |
| 6 | payments | /api/v1/payments | app/routes/payments.py |
| 7 | ai | /api/v1/ai | app/routes/ai.py |
| 8 | chat | /api/v1/chat | app/routes/chat.py |
| 9 | admin | /api/v1/admin | app/routes/admin.py |
| 10 | tickets | /api/v1/tickets | app/routes/tickets.py |
| 11 | superadmin | /api/v1/superadmin | app/routes/superadmin.py |
| 12 | ofertas | /api/v1 | app/routes/ofertas.py |
| 13 | legal | /api/v1/legal | app/routes/legal.py |
| 14 | kyc | /api/v1/kyc | app/routes/kyc.py |
| 15 | subscriptions | /api/v1/subscriptions | app/routes/subscriptions.py |
| 16 | wallet | /api/v1/wallet | app/routes/wallet.py |
| 17 | prices | /api/v1/prices | app/routes/prices.py |
| 18 | auth_password | /api/v1/auth | app/routes/auth_password.py |
| 19 | disputes | /api/v1 | app/routes/disputes.py |
| 20 | email_verification | /api/v1/auth | app/routes/email_verification.py |
| 21 | providers | /api/v1/providers | app/routes/providers.py |
| 22 | onboarding | /api/v1/onboarding | app/routes/onboarding.py |
| 23 | portfolio | /api/v1/portfolio | app/routes/portfolio.py |
| 24 | ai_metrics | /api/v1/ai | app/routes/ai_metrics.py |

### 2.2 Socket.IO Handlers (3)

| Handler | Eventos | Propósito |
|---------|---------|-----------|
| chat_socket | join, message, disconnect | Chat en tiempo real por conversación |
| oferta_socket | connect (auto-join) | Notificaciones de ofertas |
| notification_socket | join, disconnect | Notificaciones en tiempo real (cascade) |

**Flujo notificación en cascada:**
```
Cascada Celery → CascadeManager.send_phase()
  → crea Notification (DB)
  → socketio.emit('notificacion:nueva', notif.to_dict(), room=f'user:{notif.user_id}')
  → Redis message_queue → servidor Flask → sala user:<id>
  → cliente useNotificationSocket → store update → NotificationBell
  Tiempo total: <1s
```

---

## 3. CATÁLOGO DE FUNCIONALIDADES

### F1: Autenticación ✅

**Descripción:** Registro, login, recuperación de contraseña, verificación de email y onboarding de usuarios.

**Módulos involucrados:**
- Backend: `app/routes/auth.py`, `auth_password.py`, `email_verification.py`, `onboarding.py`
- Frontend: `src/features/auth/` (LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage), `src/features/onboarding/`

**Endpoints clave:**
- `POST /api/v1/auth/register` — Registro de usuario
- `POST /api/v1/auth/login` — Login (retorna JWT)
- `POST /api/v1/auth/forgot-password` — Solicitud de reset
- `POST /api/v1/auth/reset-password` — Reset de contraseña
- `POST /api/v1/auth/verify-email` — Verificación de email
- `GET /api/v1/onboarding/*` — Flujo de onboarding

**Estado:** ✅ Implementado + testeado

---

### F2: Perfil PDS (Trust + Badges + Portfolio) ✅

**Descripción:** Perfil completo del proveedor con score de confianza, insignias de logro y portafolio multimedia.

**Módulos involucrados:**
- Backend: `app/routes/users.py`, `app/routes/portfolio.py`, `app/models/trust.py`, `app/services/trust.py`, `app/models/badges.py`
- Frontend: `src/features/profile/ProfilePage.tsx`, `src/features/trust/` (TrustScore, TrustBreakdown), `src/features/badges/` (BadgePanel, BadgeLegend), `src/features/portfolio/` (PortfolioUploader, PortfolioGallery)

**Endpoints clave:**
- `GET /api/v1/users/me` — Perfil del usuario
- `PUT /api/v1/users/me` — Actualizar perfil
- `GET /api/v1/trust/{pds_id}` — Trust score de un proveedor
- `GET /api/v1/portfolio/items` — Items del portafolio
- `POST /api/v1/portfolio/upload` — Subir item (foto/video/doc)
- `GET /api/v1/portfolio/pds/{id}` — Portafolio público

**Componentes frontend:**
- `TrustScore` — Medidor circular 0-100 con color por nivel
- `TrustBreakdown` — Desglose por dimensión (KYC, rating, contratos, portfolio, referidos)
- `BadgePanel` — Panel con leyenda de insignias
- `PortfolioUploader` — Upload drag-and-drop (MinIO)
- `PortfolioGallery` — Galería de items aprobados
- `Viewer360` — Visor panorámico A-Frame

**Estado:** ✅ Implementado + testeado

---

### F3: Solicitud + Geofence ✅

**Descripción:** Publicación de solicitudes de servicio con geocercas configurables (radio_km) y visualización en mapa.

**Módulos involucrados:**
- Backend: `app/routes/solicitudes.py`, `app/models/solicitud.py` (columna `radio_km`), `migrations/versions/002_add_solicitud_radio.py`
- Frontend: `src/features/services/PublishSolicitudPage.tsx`, `src/features/geofence/` (GeofenceMap, GeofencePicker, circleGeoJson)

**Endpoints clave:**
- `POST /api/v1/solicitudes/` — Crear solicitud (incluye `radio_km`)
- `GET /api/v1/solicitudes/` — Listar solicitudes
- `GET /api/v1/solicitudes/{id}` — Detalle de solicitud

**Componentes frontend:**
- `GeofencePicker` — Selector de radio (1-20 km)
- `GeofenceMap` — Visualización del radio de cobertura en Mapbox
- `MapPicker` — Selección de punto en mapa

**Campo `radio_km`:** Enviable desde el frontend (default 5.0 km), almacena el radio de cobertura de la solicitud para la cascada de notificaciones.

**Estado:** ✅ Implementado + testeado

---

### F4: Recomendaciones ML ✅

**Descripción:** Motor de recomendación híbrido de dos etapas: retrieval geoespacial + ranking ML (LightGBM Lambdarank). Incluye A/B testing y rotación con Thompson Bandit.

**Módulos involucrados:**
- Backend: `app/ai/recommender.py` (HybridRecommender, ShadowRecommender, HeuristicRecommender, get_recommender()), `app/ai/features.py` (FeatureExtractor, 22 features), `app/ai/ml_ranker.py` (MLRanker), `app/ai/bandit.py` (ThompsonBandit), `app/ai/ab_testing.py` (ABTest), `app/ai/geo.py` (find_nearby_providers, haversine/postgis)
- Frontend: `src/features/match/` (RecommendationsList, SolicitudesForProvider)

**Endpoints clave:**
- `GET /api/v1/ai/recommendations?service_id=X` — Proveedores rankeados para una solicitud
- `GET /api/v1/ai/solicitudes-for-provider` — Solicitudes afines al perfil del proveedor
- `GET /api/v1/ai/metrics` — Métricas del modelo + A/B test (admin)
- `GET /api/v1/ai/metrics/feature-importance` — Importancia de features (admin)

**Pipeline ML:**
```
Solicitud → get_recommender() → HybridRecommender
  1. Retrieval: find_nearby_providers(lat, lng, 15km, top_k=50) [PostGIS/Haversine]
  2. Feature Extraction: FeatureExtractor.extract_batch() [22 features]
  3. ML Ranking: MLRanker.predict(X) [LightGBM Lambdarank]
  4. Results: [{user_id, email, score, ranking, explicacion, features, model_version}]
  5. Fallback: HeuristicRecommender si ML falla
```

**A/B Testing:**
- `ABTest.get_group(user_id)` → Asigna grupo 'A' o 'B' deterministicamente
- `ABTest.log_recommendation()` → Registra cada recomendación para análisis
- `ABTest.get_metrics()` → Métricas por grupo (total, avg_score, tasa_aceptacion)
- Cableado en ambos endpoints de `app/routes/ai.py`

**Feature Flags (FeatureFlag model):**
- `ml_ranking_enabled` — Activa ML ranking
- `ml_shadow_mode` — Log ML pero usa heurístico

**Estado:** ✅ Implementado + testeado

---

### F5: Cascada de Notificaciones ✅

**Descripción:** Sistema de notificaciones en cascada geoespacial (2km → 5km → 15km) con tiempos configurables y notificación en tiempo real vía Socket.IO.

**Módulos involucrados:**
- Backend: `app/services/cascade.py` (CascadeManager), `app/models/cascade.py` (NotificationCascade), `app/routes/notification_socket.py` (handler join/disconnect), `app/tasks.py` (Celery tasks)
- Frontend: `src/features/notifications/` (useNotificationSocket, useNotificationsStore), `src/components/NotificationBell.tsx`, `src/components/BottomNav.tsx`

**Flujo:**
```
Solicitud publicada → CascadeManager.start_cascade(solicitud_id)
  → Fase 1: 2km, 300s delay, max 5 candidatos
    → find_nearby_providers() → Notification → socketio.emit('notificacion:nueva')
  → Fase 2: 5km, 600s delay, max 10 candidatos
  → Fase 3: 15km, 900s delay, max 15 candidatos
```

**Configuración por defecto:**
```python
DEFAULT_CONFIG = [
    {"radius_km": 2.0, "delay_seconds": 300, "max_candidates": 5},
    {"radius_km": 5.0, "delay_seconds": 600, "max_candidates": 10},
    {"radius_km": 15.0, "delay_seconds": 900, "max_candidates": 15},
]
```

**Componentes frontend:**
- `useNotificationSocket` — Hook que escucha `notificacion:nueva` vía Socket.IO
- `useNotificationsStore` — Zustand store (unreadCount, notifications[])
- `NotificationBell` — Indicador de notificaciones no leídas (usa socket, no polling)
- `BottomNav` — Navegación inferior con badge de notificaciones

**Estado:** ✅ Implementado + testeado

---

### F6: Contrato + Chat ✅

**Descripción:** Flujo de contratación con aceptación de ofertas, chat en tiempo real, hitos y resolución de disputas.

**Módulos involucrados:**
- Backend: `app/routes/contracts.py`, `app/routes/chat.py`, `app/routes/ofertas.py`, `app/routes/chat_socket.py`, `app/routes/oferta_socket.py`, `app/routes/disputes.py`
- Frontend: `src/features/contracts/`, `src/features/chat/`, `src/features/disputes/`

**Endpoints clave:**
- `POST /api/v1/contracts/` — Crear contrato
- `GET /api/v1/contracts/` — Listar contratos
- `PUT /api/v1/contracts/{id}/estado` — Actualizar estado
- `POST /api/v1/chat/{conversation_id}/message` — Enviar mensaje
- `GET /api/v1/chat/conversations` — Listar conversaciones

**Socket.IO events:**
- `message` — Mensaje de chat (room: conversation_{id})
- `oferta:nueva` / `oferta:actualizada` — Notificación de oferta
- `contracto:actualizado` — Actualización de contrato

**Estado:** ✅ Implementado + testeado

---

### F7: Pago Nequi ✅

**Descripción:** Integración con Nequi para pagos, billetera virtual (wallet), monedas y suscripciones.

**Módulos involucrados:**
- Backend: `app/routes/payments.py`, `app/routes/wallet.py`, `app/routes/subscriptions.py`, `app/routes/prices.py`
- Frontend: `src/features/payments/` (CheckoutPage, PaymentDetailPage, EarningsHistoryPage), `src/features/wallet/`, `src/features/subscriptions/`

**Endpoints clave:**
- `POST /api/v1/payments/checkout` — Iniciar pago
- `GET /api/v1/payments/{id}` — Detalle de pago
- `GET /api/v1/wallet` — Balance de billetera
- `POST /api/v1/wallet/coins` — Comprar monedas
- `GET /api/v1/subscriptions` — Planes disponibles

**Estado:** ✅ Implementado + testeado

---

## 4. REQUISITOS FUNCIONALES

### RF-ML-1: Recomendación 2 Etapas ✅ IMPLEMENTADO

**Descripción:** El motor de recomendación debe usar retrieval geoespacial (PostGIS/Haversine) seguido de ranking ML (LightGBM Lambdarank).

**Componentes:**
- `app/ai/recommender.py` → `HybridRecommender`
- `app/ai/features.py` → `FeatureExtractor` (22 features)
- `app/ai/ml_ranker.py` → `MLRanker` (LightGBM)
- `app/ai/geo.py` → `find_nearby_providers()`

**Criterio:** Si ML falla, fallback a `HeuristicRecommender`.

---

### RF-ML-2: A/B Testing ✅ IMPLEMENTADO

**Descripción:** Framework de A/B testing para comparar ML vs heurístico con asignación determinista de grupos.

**Componentes:**
- `app/ai/ab_testing.py` → `ABTest`
- `app/models/recommendation_log.py` → `RecommendationLog`
- Cableado en `app/routes/ai.py` (ambos endpoints)

---

### RF-ML-3: Rotación con Thompson Bandit ✅ IMPLEMENTADO

**Descripción:** Multi-Armed Bandit con Thompson Sampling para rotación inteligente de categorías.

**Componentes:**
- `app/ai/bandit.py` → `ThompsonBandit`

---

### RF-Trust-1: Score de Confianza ✅ IMPLEMENTADO

**Descripción:** Score consolidado 0-100 con 5 dimensiones: KYC, rating, contratos, portfolio, referidos.

**Componentes:**
- Backend: `app/models/trust.py`, `app/services/trust.py`
- Frontend: `src/features/trust/TrustScore.tsx`, `TrustBreakdown.tsx`

**Niveles:**
- Experto: 80-100
- Verificado: 60-79
- Confiable: 40-59
- Nuevo: 0-39

---

### RF-Trust-2: Badges ✅ IMPLEMENTADO

**Descripción:** Sistema de insignias de logro conectado al backend.

**Componentes:**
- Backend: `app/models/badges.py`
- Frontend: `src/features/badges/BadgePanel.tsx`, `BadgeLegend.tsx`

---

### RF-Geo-1: Geocercas ✅ IMPLEMENTADO

**Descripción:** Publicación de solicitudes con radio_km configurable y visualización en mapa.

**Componentes:**
- Backend: `app/models/solicitud.py` (columna `radio_km`), `migrations/versions/002_add_solicitud_radio.py`
- Frontend: `src/features/geofence/GeofenceMap.tsx`, `GeofencePicker.tsx`

---

### RF-Geo-2: Cascada Geoespacial ✅ IMPLEMENTADO

**Descripción:** Notificaciones en cascada 2km → 5km → 15km con tiempos configurables.

**Componentes:**
- Backend: `app/services/cascade.py`, `app/models/cascade.py`
- Celery task: `send_phase_task`

---

### RF-360-1: Visor Panorámico ✅ IMPLEMENTADO

**Descripción:** Visor 360° con A-Frame para portafolio de proveedores.

**Componentes:**
- Frontend: `src/components/Viewer360.tsx`
- Integrado en: `src/features/profile/ProfilePage.tsx`

---

### RF-UI-1: Notificaciones Real-time ✅ IMPLEMENTADO

**Descripción:** Notificaciones en tiempo real via Socket.IO (reemplaza polling 30s).

**Componentes:**
- Backend: `app/routes/notification_socket.py`, `app/services/cascade.py` (emisión)
- Frontend: `src/features/notifications/useNotificationSocket.ts`, `useNotificationsStore.ts`
- Componentes: `NotificationBell.tsx`, `BottomNav.tsx`

---

### RF-UI-2: Portfolio Upload ✅ IMPLEMENTADO

**Descripción:** Upload de archivos (no solo URLs) con drag-and-drop a MinIO.

**Componentes:**
- Backend: `app/routes/portfolio.py`, `app/services/storage.py`
- Frontend: `src/features/portfolio/PortfolioUploader.tsx`, `PortfolioGallery.tsx`

---

### RF-ML-4: Métricas ML Dashboard ✅ IMPLEMENTADO

**Descripción:** Dashboard de métricas del modelo y resultados de A/B testing.

**Componentes:**
- Backend: `app/routes/ai_metrics.py` (blueprint `ai_metrics`)
- Endpoints: `GET /api/v1/ai/metrics`, `GET /api/v1/ai/metrics/feature-importance`

---

## 5. CONTRATOS DE API

### Autenticación

```
POST /api/v1/auth/register       → Registro
POST /api/v1/auth/login          → Login (JWT)
POST /api/v1/auth/forgot-password → Solicitud reset
POST /api/v1/auth/reset-password  → Reset contraseña
```

### Perfil y Confianza

```
GET  /api/v1/users/me            → Perfil autenticado
PUT  /api/v1/users/me            → Actualizar perfil
GET  /api/v1/trust/{pds_id}      → Trust score
```

### Portfolio

```
POST /api/v1/portfolio/upload     → Subir item (multipart)
GET  /api/v1/portfolio/items      → Items del usuario
GET  /api/v1/portfolio/{id}       → Item específico
DELETE /api/v1/portfolio/{id}     → Eliminar item
GET  /api/v1/portfolio/pds/{id}   → Portafolio público
```

### Solicitudes

```
POST /api/v1/solicitudes/         → Crear solicitud (con radio_km)
GET  /api/v1/solicitudes/         → Listar (filtros: categoria, ubicacion, q)
GET  /api/v1/solicitudes/{id}     → Detalle
```

### Motor de Recomendación (ML)

```
GET  /api/v1/ai/recommendations?service_id=X  → Proveedores rankeados
GET  /api/v1/ai/solicitudes-for-provider      → Solicitudes para proveedor
GET  /api/v1/ai/metrics                       → Métricas ML + A/B (admin)
GET  /api/v1/ai/metrics/feature-importance    → Importancia features (admin)
```

### Contratos y Chat

```
POST /api/v1/contracts/           → Crear contrato
GET  /api/v1/contracts/           → Listar contratos
PUT  /api/v1/contracts/{id}/estado → Actualizar estado
POST /api/v1/chat/{id}/message    → Enviar mensaje
GET  /api/v1/chat/conversations   → Listar conversaciones
```

### Pagos y Wallet

```
POST /api/v1/payments/checkout    → Iniciar pago
GET  /api/v1/payments/{id}        → Detalle pago
GET  /api/v1/wallet               → Balance
POST /api/v1/wallet/coins         → Comprar monedas
```

### Socket.IO Events

```
Server → Client:
  notificacion:nueva    → { id, tipo, titulo, mensaje, datos }
  message               → { conversation_id, sender_id, contenido }
  oferta:nueva          → { oferta_id, solicitud_id }
  contracto:actualizado → { contract_id, nuevo_estado }

Client → Server:
  join                  → { token } (une a sala user:<id>)
  message               → { conversation_id, contenido }
```

---

## 6. COBERTURA DE PRUEBAS

### Resumen

| Capa | Tests | Estado |
|------|-------|--------|
| Backend (pytest) | 272 | ✅ Todos pasan |
| Frontend (Vitest) | 210 | ✅ Todos pasan |
| **Total** | **482** | ✅ **100% pass** |

### 7 Flujos de Usuario Testeados

| Flujo | Descripción | Tests |
|-------|-------------|-------|
| F1 | Autenticación | Login, registro, JWT, roles |
| F2 | Perfil PDS + Trust + Badges + Portfolio | Trust score, badges, upload, gallery |
| F3 | Solicitud + Geofence | Creación con radio_km, geofence picker |
| F4 | Recomendaciones ML | HybridRecommender, A/B, features |
| F5 | Cascada Notificaciones | CascadeManager, Socket.IO, store |
| F6 | Contrato + Chat | Contrato, chat socket, ofertas |
| F7 | Pago Nequi | Checkout, wallet, monedas |

### Bugs Encontrados y Corregidos

- **14 bugs** encontrados durante la ronda de testing
- **9 en código de app/** (backend + frontend)
- **5 en archivos de test** (assertions incorrectas)
- Todos corregidos y verificados

### Referencia

Ver `HOJA_DE_TESTS.md` para el reporte completo de testing.

---

## 7. ESTADO DE INTEGRACIÓN

### ✅ Todo Integrado y en Verde

| Componente | Estado | Detalle |
|------------|--------|---------|
| Backend Flask | ✅ | 272 tests, 24 blueprints |
| Socket.IO Handlers | ✅ | 3 handlers (chat, ofertas, notifications) |
| ML Pipeline | ✅ | HybridRecommender + ShadowRecommender + ThompsonBandit |
| A/B Testing | ✅ | Cableado en app/routes/ai.py (ambos endpoints) |
| ai_metrics blueprint | ✅ | Registrado en app/__init__.py |
| notification_socket | ✅ | Emite notificacion:nueva a sala user:<id> via Redis |
| Portfolio + MinIO | ✅ | Upload, items, delete, público |
| Trust + Badges | ✅ | TrustScore, TrustBreakdown, BadgePanel |
| Geofence | ✅ | GeofenceMap + GeofencePicker en PublishSolicitudPage |
| radio_km | ✅ | Columna en solicitud + migración 002_add_solicitud_radio.py |
| Frontend React | ✅ | 210 tests, 28 feature modules |
| ProfilePage | ✅ | Integra Trust, Badges, Portfolio, Viewer360 |
| NotificationBell | ✅ | Usa socket (no polling) |
| 7 flujos usuario | ✅ | F1-F7 testeados y pasando |

### Módulos ML

| Módulo | Archivo | Estado |
|--------|---------|--------|
| FeatureExtractor | app/ai/features.py | ✅ 22 features |
| MLRanker | app/ai/ml_ranker.py | ✅ LightGBM Lambdarank |
| HybridRecommender | app/ai/recommender.py | ✅ Retrieval + ML |
| ShadowRecommender | app/ai/recommender.py | ✅ Log ML, usa heurístico |
| ThompsonBandit | app/ai/bandit.py | ✅ Rotación categorías |
| ABTest | app/ai/ab_testing.py | ✅ Cableado en ai.py |
| geo helpers | app/ai/geo.py | ✅ PostGIS + Haversine |

### Sin Pendientes Funcionales

> **Nota:** No hay funcionalidades pendientes de implementar. Este documento refleja el estado FINAL e integrado del software. Los únicos pendientes son documentación secundaria (guías de setup, runbooks) que no afectan la funcionalidad del sistema.

---

**Documento generado el 5 de Septiembre, 2026**  
**Arquitecto de Software — Disciplina Model (AUP)**
