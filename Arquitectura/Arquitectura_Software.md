# Arquitectura de Software — ChambeApp (PWA) v2.1

> Stack: **React + Vite (PWA)** (frontend) + **Python Flask** (backend REST API) + motor de IA y visualización 3D.
> Alineado con los módulos de contexto, requerimientos (RF-01 a RF-30), historias de usuario, modelo de monetización con billetera virtual y marco legal.
> Principios de ingeniería: separación de responsabilidades, carpetas por dominio (feature-based), auto-documentado, accesible por defecto.

---

## 1. Visión de Alto Nivel

```
┌─────────────────────────────────────────┐
│  Cliente PWA (React + Vite)              │
│  - SPA instalable (Service Worker)       │
│  - 3D/360 (Three.js / A-Frame)           │
│  - Estado, Router, Forms                 │
└───────────────┬─────────────────────────┘
                │ HTTPS / REST (JSON) + WebSocket
┌───────────────▼─────────────────────────┐
│  API Flask (Backend)                     │
│  - 35 blueprints REST + 3 handlers Socket.IO│
│  - Auth (JWT) · Validación (Marshmallow)│
│  - Servicios de negocio                  │
│  - Socket.IO (chat, ofertas, notifs)     │
└──┬──────────────┬──────────┬────────┬───┘
   │              │          │        │
┌──▼──────┐ ┌─────▼────┐ ┌──▼────┐ ┌─▼──────────────┐
│PostgreSQL│ │ Redis    │ │MinIO  │ │Motor IA        │
│+ PostGIS │ │(cola/    │ │(S3-   │ │(LightGBM       │
│(datos    │ │ cache /  │ │compat)│ │ Lambdarank +   │
│ geo)     │ │Socket.IO)│ │       │ │FeatureExtractor│
└──────────┘ └──────────┘ └───────┘ │ 22 features)   │
                                     │ + ThompsonBandit│
                                     └───────┬─────────┘
                                             │
┌────────────────────────────────────────────▼──────────┐
│ Geocerca en Cascada (Celery)                         │
│ 2km → 5km → 15km · notificacion:nueva vía Socket.IO │
└──────────────────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│ Integraciones: MercadoPago/PSE · WebPush             │
│ Storage (3D/assets) · Email/SMS · Mapbox GL JS       │
└──────────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────┐
│ Panel Admin (React 18 + Vite 6, admin frontend)      │
│ Guards RequireAuth/RequireRole · STAFF_ROLES         │
│ Scoping regional: admin solo opera su región         │
└──────────────────────────────────────────────────────┘
```

---

## 2. Tecnologías por Capa

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| UI/PWA | React 18 + TypeScript | Interfaz SPA instalable |
| Bundler/PWA | Vite + `vite-plugin-pwa` (Workbox) | Build, Service Worker, manifest, offline |
| Enrutado | React Router | Navegación por roles |
| Estado | Zustand (o Context) | Sesión, carrito de órdenes |
| 3D | Three.js + `@react-three/fiber` + `drei` | Visualización 3D |
| 360° | A-Frame | Visor panorámico 360° |
| HTTP client | Axios | Consumo de API |
| Forms | React Hook Form + Zod | Validación cliente |
| Mapas | Mapbox GL JS | Mapas interactivos |
| API | Flask + Flask-Smorest / Blueprint | Endpoints REST |
| Auth | Flask-JWT-Extended | Tokens, roles |
| ORM | SQLAlchemy 2.0 + Flask-Migrate | Persistencia PostgreSQL |
| Validación | Marshmallow | Schemas entrada/salida |
| Cola/Cache | Redis + Celery | Notificaciones, jobs IA, sesiones |
| Tiempo Real | Flask-SocketIO + Redis message_queue | Chat, ofertas, notificaciones push |
| IA/ML | LightGBM Lambdarank + FeatureExtractor (22 features) | Ranking de proveedores |
| Geoespacial | PostGIS + Haversine | Búsqueda por proximidad, geocercas |
| Storage | MinIO (S3-compatible) | Almacenamiento multimedia (portfolio, KYC) |
| Async | Celery + Celery Beat | Tareas programadas, retraining, health checks |
| Pagos | SDK MercadoPago + integración PSE | Pasarelas |
| Push | pywebpush (Web Push) | Notificaciones PWA |
| Tests | pytest (BE) · Vitest + RTL (FE) | Calidad |
| Admin FE | React 18 + Vite 6 + JS, react-router-dom 7, axios, lucide-react, sonner | Panel staff (verificador/soporte/admin/superadmin), guards RequireAuth/RequireRole, services adminApi/kycApi/superadminApi |
| División regional | Region + `services/region.py` + `auth/region.py` | Scoping por región, anti doble-conteo |

---

## 3. Mapeo Módulos (Doc) → Componentes

| Módulo Doc | Backend (Flask) | Frontend (React) |
|-----------|-----------------|------------------|
| A. Gestión de Usuarios / Perfiles | `routes/auth.py`, `routes/users.py`, `services/verification.py` | `features/auth`, `features/profile` |
| B. Motor IA (Match) | `ai/recommender.py` (HybridRecommender, ShadowRecommender, HeuristicRecommender, get_recommender()), `ai/features.py` (FeatureExtractor 22 features), `ai/ml_ranker.py` (MLRanker LightGBM), `ai/bandit.py` (ThompsonBandit), `ai/ab_testing.py` (ABTest), `ai/geo.py` (find_nearby_providers) | `features/match` |
| C. Visualización 3D | `services/media.py` (assets) | `features/threeD` |
| D. Contractual / Trazabilidad / Pagos | `routes/orders.py`, `services/orders.py`, `routes/payments.py`, `services/payments.py`, `services/earnings.py` | `features/orders`, `features/payments`, `features/earnings` |
| E. Comunicación / Notificaciones | `services/notifications.py`, `services/chat.py`, `routes/notifications.py` | `features/notifications`, `features/chat` |
| **F. Billetera Virtual** | `routes/wallet.py`, `services/wallet.py` | `features/wallet` |
| **G. Monedas** | `routes/coins.py`, `services/coins.py` | `features/coins` |
| **H. Modalidades de Cobro** | `routes/modalidades.py`, `services/modalidades.py` | `features/modalidades` |
| **I. Hitos de Pago** | `routes/milestones.py`, `services/milestones.py` | `features/milestones` |
| **J. Dashboard Operativo** | `routes/dashboard.py`, `services/dashboard.py` | `features/dashboard` |
| Trust / Confianza | `services/trust.py`, `models/trust.py`, `models/badges.py` | `features/trust`, `features/badges` |
| Geocerca / Cascada | `services/cascade.py`, `models/cascade.py`, `routes/notification_socket.py`, `tasks.py` (Celery) | `features/geofence`, `features/notifications` |
| Portafolio | `routes/portfolio.py`, `services/storage.py` | `features/portfolio` |
| Métricas IA | `routes/ai_metrics.py` | — |
| Monetización | `services/billing.py`, `services/subscriptions.py`, `routes/billing.py` | `features/billing` |
| Legal / T&C | `services/legal.py`, `routes/legal.py` | `features/legal` |
| K. Ejecución Chambas | `routes/chambas.py`, `models/chamba.py` | `features/chambas` |
| L. Marañas (subastas internas) | `routes/maranas.py`, `models/marana.py` (Marana+MaranaOferta) | `features/maranas` |
| M. Ofertas / Contraofertas | `routes/ofertas.py` (prefijo `/api/v1`), `models/oferta.py` | `features/ofertas` |
| N. Anuncios laborales | `routes/anuncios.py`, `models/anuncio.py` (AnuncioLaboral+AnuncioPostulacion) | `features/anuncios` |
| O. Negocios / Comerciante | `routes/negocios.py`, `routes/merchant.py`, `models/negocio.py` + MerchantPreference/MerchantPaymentMethod | `features/negocios` |
| P. Oficios / Habilidades | `routes/habilidades.py`, `models/habilidad.py` (Habilidad+HabilidadNivel+EndosoHabilidad+CertificacionTecnica) | `features/habilidades` |
| Q. División regional | `routes/regions.py`, `services/region.py`, `auth/region.py`, `models/region.py` (Region + User.region_id) | `features/regions` |
| R. Panel admin FE | `routes/admin.py`, `routes/superadmin.py` + `Chambeapp_admin_frontend` (config/navigation.js, services adminApi/kycApi/superadminApi) | `Chambeapp_admin_frontend` (React 18 + Vite 6) |

---

## 4. Estructura de Carpetas del Código

### 4.1 Backend (`backend/`)

```
backend/
├── app/
│   ├── __init__.py            # Factory create_app()
│   ├── config.py              # Config por entorno (dev/prod)
│   ├── extensions.py          # db, migrate, jwt, cache
│   ├── models/                # Entidades SQLAlchemy
│   │   ├── user.py            # Usuario, Perfil, Verificacion (+ region_id FK)
│   │   ├── order.py           # Orden, Estado, Disputa
│   │   ├── payment.py         # Pago, Reembolso
│   │   ├── subscription.py    # Plan, Suscripcion
│   │   ├── rating.py          # Calificacion, Reputacion
│   │   ├── service.py         # Catalogo de servicios
│   │   ├── wallet.py          # Billetera Virtual
│   │   ├── coin.py            # Sistema de Monedas
│   │   ├── modalidad.py       # Modalidades de Cobro
│   │   ├── milestone.py       # Hitos de Pago
│   │   ├── transaction.py     # Transacciones de Billetera
│   │   ├── trust.py           # TrustScore (0-100)
│   │   ├── badges.py          # Sistema de insignias
│   │   ├── cascade.py         # NotificationCascade
│   │   ├── recommendation_log.py # Log de predicciones ML
│   │   ├── chamba.py          # Chamba (1:1 contracts, evidencias/adendas/novedades JSON, pago dual, rating)
│   │   ├── marana.py          # Marana + MaranaOferta (chamba_id + adenda_idx)
│   │   ├── oferta.py          # Oferta (pendiente/aceptada/rechazada/contraoferta/cancelada)
│   │   ├── anuncio.py         # AnuncioLaboral + AnuncioPostulacion (negocio_id -> users.id)
│   │   ├── negocio.py         # Negocio + NegocioHorario + NegocioRating + NegocioReporte (geom PostGIS)
│   │   ├── merchant.py        # MerchantPreference + MerchantPaymentMethod
│   │   ├── habilidad.py       # Habilidad + HabilidadNivel + EndosoHabilidad + CertificacionTecnica
│   │   └── region.py          # Region (id/clave unique/nombre/descripcion/departamentos JSON)
│   ├── schemas/               # Marshmallow (validacion)
│   ├── routes/                # Blueprints (35 REST + 3 handlers Socket.IO)
│   │   ├── auth.py            # Registro, login, T&C (RF-01/RF-17) — prefijo /api/v1/auth
│   │   ├── users.py           # Perfil, user_preferences mismo prefijo /api/v1/users
│   │   ├── solicitudes.py     # Solicitudes — prefijo /api/v1/solicitudes
│   │   ├── contracts.py       # Contratos — prefijo /api/v1/contracts
│   │   ├── chambas.py         # Ejecucion — prefijo /api/v1/chambas
│   │   ├── maranas.py         # Marañas — prefijo /api/v1/maranas
│   │   ├── ofertas.py         # Ofertas — prefijo /api/v1 (/solicitudes/<sid>/ofertas, /mis-ofertas, /ofertas/<oid>/responder)
│   │   ├── anuncios.py        # Anuncios laborales — prefijo /api/v1/anuncios
│   │   ├── negocios.py        # Negocios — prefijo /api/v1/negocios
│   │   ├── merchant.py        # Comerciante — prefijo /api/v1/merchant
│   │   ├── habilidades.py     # Oficios — prefijo /api/v1 (/habilidades, /habilidades/mis-niveles, /quiz, /certificacion, /endosar)
│   │   ├── regions.py         # Regiones — prefijo /api/v1/regions (GET "" listar, GET /detectar?ubicacion=)
│   │   ├── admin.py           # Panel staff con scoping regional — prefijo /api/v1/admin
│   │   ├── superadmin.py      # Admins globales — prefijo /api/v1/superadmin
│   │   ├── notifications.py   # Push, chat (RF-16) — prefijo /api/v1/notifications
│   │   ├── payments.py        # Pasarela de pagos (RF-08) — prefijo /api/v1/payments
│   │   ├── wallet.py          # Billetera Virtual (RF-25) — prefijo /api/v1/wallet
│   │   ├── metodos_pago.py    # Métodos de pago — prefijo /api/v1/metodos-pago
│   │   ├── subscriptions.py   # Suscripciones — prefijo /api/v1/subscriptions
│   │   ├── prices.py          # Precios — prefijo /api/v1/prices
│   │   ├── providers.py       # Proveedores — prefijo /api/v1/providers
│   │   ├── onboarding.py      # Onboarding — prefijo /api/v1/onboarding
│   │   ├── portfolio.py       # Portafolio multimedia (upload/download) — prefijo /api/v1/portfolio
│   │   ├── trust.py           # Confianza — prefijo /api/v1/trust
│   │   ├── kyc.py             # KYC — prefijo /api/v1/kyc
│   │   ├── tickets.py         # Tickets — prefijo /api/v1/tickets
│   │   ├── chat.py            # Chat — prefijo /api/v1/chat
│   │   ├── ai.py              # Match/recomendacion (RF-05) — prefijo /api/v1/ai (ai_metrics mismo prefijo)
│   │   ├── ai_metrics.py      # Métricas ML y A/B testing
│   │   ├── legal.py           # T&C, disputas, Habeas Data (RF-17) — prefijo /api/v1/legal
│   │   ├── coins.py           # Sistema de Monedas (RF-27)
│   │   ├── modalidades.py     # Modalidades de Cobro (RF-26)
│   │   ├── milestones.py      # Hitos de Pago (RF-29)
│   │   ├── dashboard.py       # Dashboard Operativo (RF-30)
│   │   ├── chat_socket.py     # Handler Socket.IO chat
│   │   ├── oferta_socket.py   # Handler Socket.IO ofertas
│   │   └── notification_socket.py # Handler Socket.IO notificaciones
│   ├── services/              # Logica de negocio
│   │   ├── orders.py          # Ciclo de orden + disputas (RF-07)
│   │   ├── payments.py        # Pagos directos, reembolsos (RF-08)
│   │   ├── earnings.py        # Trazabilidad (RF-09)
│   │   ├── subscriptions.py   # Planes Premium (RF-11)
│   │   ├── notifications.py   # WebPush + Background Sync
│   │   ├── chat.py            # Mensajeria tiempo real
│   │   ├── media.py           # Assets 3D/imagenes
│   │   ├── legal.py           # Retenciones, jurisdiccion
│   │   ├── wallet.py          # Logica de billetera (RF-25)
│   │   ├── coins.py           # Logica de monedas (RF-27)
│   │   ├── modalidades.py     # Logica de modalidades (RF-26)
│   │   ├── milestones.py      # Logica de hitos (RF-29)
│   │   ├── dashboard.py       # Logica de dashboard (RF-30)
│   │   ├── cascade.py         # CascadeManager (geocerca 2-5-15km)
│   │   ├── storage.py         # MinIO upload/download (portfolio, KYC)
│   │   ├── trust.py           # TrustScore service (scoring 0-100)
│   │   └── region.py          # match_region_from_text, assign_region, contract_owned_by_region
│   │   ├── auth/region.py     # region_scope_id() (scoping por JWT)
│   ├── ai/                    # Motor de recomendacion ML
│   │   ├── recommender.py     # HybridRecommender, ShadowRecommender, HeuristicRecommender, get_recommender()
│   │   ├── features.py        # FeatureExtractor (22 features)
│   │   ├── ml_ranker.py       # MLRanker (LightGBM Lambdarank)
│   │   ├── bandit.py          # ThompsonBandit (Multi-Armed Bandit)
│   │   ├── ab_testing.py      # ABTest (A/B testing framework)
│   │   └── geo.py             # find_nearby_providers (PostGIS + Haversine)
│   └── tasks.py               # Celery tasks (cascade, retraining, health)
├── migrations/
│   └── versions/
│       ├── 001 postgis+trust, 002 radio solicitud, 003 username, 004 negocios,
│       ├── 005 merchant rol, 006 trust_scores, 007 solicitud horario/imagenes,
│       ├── 008 drop payment retention, 009 chamba, 010 oferta convenir,
│       ├── 011 marana, 012 fecha_validacion, 013 anuncios, 014 regiones,
│       ├── c3d5e7f9a1b2 oficios/habilidades, d7e9f1b3c5a7 categoria habilidades,
│       ├── f2a1c4e8d9b0 rutas certificables, e5b8c1d4f6a9 perfil prefs+2fa,
│       └── ac89426b23a3 foto perfil+metodos pago
├── scripts/
│   └── rollout_ml.py          # Script de rollout gradual ML
├── tests/                     # pytest
├── requirements.txt
├── run.py                     # Entrypoint
├── .env.example
└── README.md
```

### 4.2 Frontend (`frontend/`)

```
frontend/
├── public/
│   ├── manifest.webmanifest  # PWA manifest
│   └── icons/                # Iconos PWA (192/512)
├── src/
│   ├── main.tsx              # Bootstrap React + PWA
│   ├── App.tsx               # Router + providers
│   ├── features/             # Por dominio (feature-based)
│   │   ├── auth/             # Registro, login, aceptacion T&C (RF-01/17)
│   │   ├── profile/          # Habilidades, reputacion (RF-02/03)
│   │   ├── match/            # Recomendaciones IA (RF-05)
│   │   ├── threeD/           # Visualizacion 3D (RF-06)
│   │   ├── orders/           # Publicar, ciclo orden, disputas (RF-04/07)
│   │   ├── payments/         # Pasarela de pagos, reembolso (RF-08)
│   │   ├── earnings/         # Historial, certificados (RF-09/13)
│   │   ├── billing/          # Suscripciones, valor agregado (RF-11/14/15)
│   │   ├── notifications/    # Push, alertas, socket (RF-16)
│   │   ├── chat/             # Mensajeria
│   │   ├── legal/            # T&C, privacidad, Habeas Data (RF-17)
│   │   ├── wallet/           # Billetera Virtual (RF-25)
│   │   ├── coins/            # Sistema de Monedas (RF-27)
│   │   ├── modalidades/      # Modalidades de Cobro (RF-26)
│   │   ├── milestones/       # Hitos de Pago (RF-29)
│   │   ├── dashboard/        # Dashboard Operativo (RF-30)
│   │   ├── trust/            # TrustScore, TrustBreakdown
│   │   ├── badges/           # BadgePanel, BadgeLegend
│   │   ├── portfolio/        # PortfolioUploader, PortfolioGallery
│   │   └── geofence/         # GeofenceMap, GeofencePicker
│   ├── components/           # UI reutilizable
│   │   ├── Button.tsx, Card.tsx, Input.tsx, Badge.tsx, Avatar.tsx
│   │   ├── Viewer360.tsx     # Visor panorámico 360° (A-Frame)
│   │   ├── NotificationBell.tsx # Indicador notificaciones (Socket.IO)
│   │   └── BottomNav.tsx     # Navegación inferior con badge
│   ├── hooks/
│   │   ├── useAuth.ts, usePush.ts, useOffline.ts
│   │   ├── useNotificationSocket.ts  # Escucha notificacion:nueva vía Socket.IO
│   │   └── useNotificationsStore.ts  # Zustand store (unreadCount, notifications[])
│   ├── lib/                  # api.ts (Axios), auth.ts, storage.ts, socket.ts
│   ├── types/                # Tipos TS compartidos
│   └── pwa/                  # Registro SW, offline queue
├── index.html
├── vite.config.ts            # + vite-plugin-pwa
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Modelo de Datos (Entidades Clave)

### **5.1 Entidades Originales**

- **User**: id, rol (proveedor/solicitante), email, password_hash, edad_verificada, acepto_tyc (bool+log), fecha_registro.
- **Profile**: user_id, habilidades[], experiencia, zona, calificacion_promedio, verificado, badges[].
- **Service**: id, solicitante_id, categoria, descripcion, ubicacion, presupuesto, estado.
- **Order**: id, service_id, proveedor_id, estado (Pendiente/En progreso/Completado/Cancelado), creado_en.
- **Payment**: id, contract_id, monto, comision_pds, comision_solicitante, estado, pasarela.
- **Subscription**: id, user_id, plan (Basico/Pro), estado, renueva_en.
- **Rating**: id, order_id, autor_id, calificado_id, puntaje, comentario.
- **Dispute**: id, order_id, motivo, evidencias[], estado, resuelto_en.
- **LegalAcceptance**: id, user_id, version_tyc, fecha, ip.

### **5.2 Nuevas Entidades (Billetera y Monedas)**

- **Wallet**: id, user_id, saldo (integer, default 0), saldo_bloqueado (integer, default 0), created_at, updated_at.
- **Coin**: id, user_id, cantidad (integer), tipo (comprada/promocional/ganada), vence_en (timestamp nullable), created_at.
- **Transaction**: id, wallet_id, tipo (comision/monedas/retiro/reembolso/deposito), monto, descripcion, referencia, created_at.
- **Modalidad**: id, service_id, tipo (A_comision/B_sin_comision), monedas_requeridas (integer nullable), created_at.
- **Milestone**: id, order_id, numero (integer), descripcion, monto, estado (pendiente/aprobado/rechazado), aprobado_en (timestamp nullable), created_at.

### **5.3 Diagrama ER (Simplificado)**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    USER     │────▶│   WALLET    │────▶│ TRANSACTION │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│    COIN     │     │   ORDER     │
└─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  MILESTONE  │
                    └─────────────┘
```

### **5.4 Scripts SQL (PostgreSQL)**

```sql
-- Billetera Virtual
CREATE TABLE wallet (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    saldo INTEGER DEFAULT 0,
    saldo_bloqueado INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transacciones de Billetera
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallet(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('comision', 'monedas', 'retiro', 'reembolso', 'deposito')),
    monto INTEGER NOT NULL,
    descripcion TEXT,
    referencia VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Monedas
CREATE TABLE coin (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cantidad INTEGER DEFAULT 0,
    tipo VARCHAR(50) CHECK (tipo IN ('comprada', 'promocional', 'ganada')),
    vence_en TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Modalidad de Cobro
CREATE TABLE modalidad (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    tipo VARCHAR(20) CHECK (tipo IN ('A_comision', 'B_sin_comision')),
    monedas_requeridas INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Hitos de Pago
CREATE TABLE milestone (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    descripcion TEXT,
    monto INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    aprobado_en TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **5.5 Entidades de Ejecución y Marketplace**

- **Chamba** (tabla `chambas`, 1:1 con contracts): enum programada/en_proceso/en_ejecucion/pausada/pendiente_validacion/liquidacion_confirmada/finalizada; evidencias/adendas/novedades JSON; pago dual (check-in dual); rating.
- **Marana + MaranaOferta** (tablas `maranas`/`maranas_ofertas`): estados publicado/asignado/completado/pagado/cancelado; chamba_id + adenda_idx (marana lanzada desde adenda).
- **Oferta** (tabla `ofertas`): pendiente/aceptada/rechazada/contraoferta/cancelada; contra_monto/mensaje/fecha/horario.
- **AnuncioLaboral + AnuncioPostulacion** (tablas `anuncios_laborales`/`anuncios_postulaciones`): publicado/cerrado; pendiente/contactado/descartado; negocio_id -> users.id.
- **Negocio + NegocioHorario + NegocioRating + NegocioReporte** (tabla `negocios`): tipos comercio/servicio/virtual/hibrido; estados borrador/pendiente_verificacion/activo/suspendido/rechazado; geom PostGIS.
- **MerchantPreference + MerchantPaymentMethod**: preferencias y métodos de pago del comerciante.
- **Habilidad + HabilidadNivel + EndosoHabilidad + CertificacionTecnica** (tablas `habilidades`/`habilidad_niveles`/`endoso_habilidades`/`certificaciones_tecnicas`): quiz y certificación por nivel, endosos.

### **5.6 División Regional**

- **Region** (tabla `regions`): id/clave unique/nombre/descripcion/departamentos JSON.
- **User.region_id**: FK nullable a regions.
- **Reglas**: `services/region.py` con `match_region_from_text`, `assign_region` (usa Profile.zona, NUNCA reasigna staff admin/superadmin/verificador/soporte, NULL si sin coincidencia) y `contract_owned_by_region` (región del SOLICITANTE dueña, anti doble-conteo); `auth/region.py` con `region_scope_id()`.
- Ver detalle operativo en S11 y diagrama `diagramas/11_regiones.puml`.

---

## 6. Requerimientos No Funcionales (trazados)

- **PWA (RNF-07):** `vite-plugin-pwa` genera SW + manifest; `src/pwa/` maneja cola offline y Background Sync.
- **Seguridad (RNF-03):** JWT, cifrado de datos sensibles en reposo (PostgreSQL), HTTPS obligatorio, cumplimiento Ley 1581 (Habeas Data) vía `features/legal` y `services/legal`.
- **Rendimiento (RNF-04):** búsqueda <2s (índices DB + cache Redis), carga 3D <5s.
- **Transparencia algorítmica (RNF-02):** `ai/recommender.py` expone criterios; explicable en UI (RF-05).
- **Confiabilidad de pagos (RNF-06):** reintentos; tasa éxito >98%.

---

## 7. Endpoints API (Nuevos para Billetera y Monedas)

### **7.1 Billetera Virtual (RF-25)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/wallet` | Ver saldo y datos de billetera |
| `POST` | `/api/v1/wallet/deposit` | Depositar fondos |
| `POST` | `/api/v1/wallet/withdraw` | Solicitar retiro |
| `GET` | `/api/v1/wallet/history` | Historial de transacciones |

### **7.2 Sistema de Monedas (RF-27)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/coins` | Ver saldo de monedas |
| `POST` | `/api/v1/coins/buy` | Comprar monedas |
| `POST` | `/api/v1/coins/use` | Usar monedas (ej: ofertar) |
| `GET` | `/api/v1/coins/history` | Historial de monedas |

### **7.3 Modalidades de Cobro (RF-26)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/modalidades` | Listar modalidades disponibles |
| `POST` | `/api/v1/services/:id/modalidad` | Establecer modalidad |
| `GET` | `/api/v1/services/:id/modalidad` | Ver modalidad de servicio |

### **7.4 Hitos de Pago (RF-29)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/orders/:id/milestones` | Ver hitos de orden |
| `POST` | `/api/v1/orders/:id/milestones` | Crear hitos |
| `POST` | `/api/v1/milestones/:id/approve` | Aprobar hito |
| `POST` | `/api/v1/milestones/:id/reject` | Rechazar hito |

### **7.5 Dashboard Operativo (RF-30)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard/pds` | Dashboard del PDS |
| `GET` | `/api/v1/dashboard/pds/history` | Historial de cobros |
| `GET` | `/api/v1/dashboard/pds/report` | Generar reporte PDF |
| `GET` | `/api/v1/dashboard/solicitante` | Dashboard del solicitante |

### **7.6 Precios Sugeridos (RF-28)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/prices/suggested` | Ver precios promedio |
| `POST` | `/api/v1/prices/calculate` | Calcular por categoría |

### **7.7 Recomendación ML (RF-05 / RF-ML)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/ai/recommendations?service_id=X` | Proveedores rankeados para una solicitud (ML + geo) |
| `GET` | `/api/v1/ai/solicitudes-for-provider` | Solicitudes afines al perfil del proveedor |
| `GET` | `/api/v1/ai/metrics` | Métricas del modelo y A/B testing (admin) |
| `GET` | `/api/v1/ai/metrics/feature-importance` | Importancia de features (admin) |

### **7.8 Confianza (Trust Score)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/trust/{pds_id}` | Trust score de un proveedor (0-100, 5 dimensiones) |

### **7.9 Portafolio Multimedia**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/portfolio/upload` | Subir item (foto/video/doc, multipart) |
| `GET` | `/api/v1/portfolio/items` | Items del portafolio del usuario |
| `GET` | `/api/v1/portfolio/pds/{id}` | Portafolio público de un proveedor |
| `DELETE` | `/api/v1/portfolio/{id}` | Eliminar item del portafolio |

### **7.10 Solicitudes (actualización)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/solicitudes/` | Crear solicitud — acepta `radio_km` (radio geocerca, default 5.0 km) |
| `GET` | `/api/v1/solicitudes/` | Listar solicitudes (filtros: categoría, ubicación, q) |
| `GET` | `/api/v1/solicitudes/{id}` | Detalle de solicitud |

> **Nota:** El campo `radio_km` se usa en la cascada de notificaciones (`CascadeManager`) para expandir progresivamente el radio de búsqueda (2km → 5km → 15km).

### **7.11 Socket.IO Events**

| Dirección | Evento | Payload | Descripción |
|-----------|--------|---------|-------------|
| Server→Client | `notificacion:nueva` | `{id, tipo, titulo, mensaje, datos}` | Notificación push en tiempo real (cascada) |
| Server→Client | `message` | `{conversation_id, sender_id, contenido}` | Mensaje de chat entrante |
| Server→Client | `oferta:nueva` | `{oferta_id, solicitud_id}` | Nueva oferta recibida |
| Server→Client | `contracto:actualizado` | `{contract_id, nuevo_estado}` | Estado de contrato cambiado |
| Client→Server | `join` | `{token}` | Unirse a sala `user:<id>` (decodifica JWT) |
| Client→Server | `message` | `{conversation_id, contenido}` | Enviar mensaje de chat |

### **7.12 Chambas (ejecución)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/chambas/` | Listar chambas |
| `POST` | `/api/v1/chambas/` | Crear desde contrato (verifica código) |
| `GET` | `/api/v1/chambas/<id>` | Detalle de chamba |
| `PATCH` | `/api/v1/chambas/<id>/estado` | Cambiar estado (programada/en_proceso/en_ejecucion/pausada/pendiente_validacion/liquidacion_confirmada/finalizada) |
| `POST` | `/api/v1/chambas/<id>/validacion` | Validar ejecución |
| `POST` | `/api/v1/chambas/<id>/evidencia-entrada` | Subir evidencia de entrada |
| `POST` | `/api/v1/chambas/<id>/evidencia-salida` | Subir evidencia de salida |
| `POST` | `/api/v1/chambas/<id>/adenda` | Crear adenda |
| `PATCH` | `/api/v1/chambas/<id>/adenda/<idx>` | Editar adenda |
| `DELETE` | `/api/v1/chambas/<id>/adenda/<idx>` | Eliminar adenda |
| `POST` | `/api/v1/chambas/<id>/novedad` | Reportar novedad |
| `POST` | `/api/v1/chambas/<id>/pago` | Pago con check-in dual |
| `POST` | `/api/v1/chambas/<id>/calificacion` | Calificar chamba |
| `POST` | `/api/v1/chambas/evidencia/upload` | Subir evidencia (multipart) |
| `GET` | `/api/v1/chambas/solicitante/<uid>` | Chambas por solicitante |
| `GET` | `/api/v1/chambas/prestador/<uid>` | Chambas por prestador |
| `POST` | `/api/v1/chambas/<id>/marana` | Lanzar marana desde adenda |

### **7.13 Marañas**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/maranas/chamba/<chamba_id>` | Marañas por chamba |
| `GET` | `/api/v1/maranas/` | Listar marañas |
| `GET` | `/api/v1/maranas/<id>` | Detalle (publicado/asignado/completado/pagado/cancelado) |
| `POST` | `/api/v1/maranas/<id>/ofertas` | Ofertar en marana |
| `GET` | `/api/v1/maranas/<id>/ofertas` | Listar ofertas de marana |
| `POST` | `/api/v1/maranas/<id>/responder` | Responder oferta de marana |
| `PATCH` | `/api/v1/maranas/<id>/estado` | Cambiar estado |
| `POST` | `/api/v1/maranas/<id>/pago` | Pagar marana |
| `GET` | `/api/v1/maranas/solicitante/<uid>` | Marañas por solicitante |
| `GET` | `/api/v1/maranas/prestador/<uid>` | Marañas por prestador |

### **7.14 Ofertas / Contraofertas**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/solicitudes/<sid>/ofertas` | Crear oferta |
| `GET` | `/api/v1/solicitudes/<sid>/ofertas` | Listar ofertas de solicitud |
| `GET` | `/api/v1/mis-ofertas` | Mis ofertas enviadas |
| `POST` | `/api/v1/ofertas/<oid>/responder` | Responder (aceptada/rechazada/contraoferta con contra_monto/mensaje/fecha/horario) |

### **7.15 Anuncios Laborales**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/anuncios/` | Crear anuncio (publicado/cerrado) |
| `GET` | `/api/v1/anuncios/` | Listar anuncios |
| `GET` | `/api/v1/anuncios/negocio/<uid>` | Anuncios por negocio |
| `GET` | `/api/v1/anuncios/<id>` | Detalle de anuncio |
| `PATCH` | `/api/v1/anuncios/<id>/estado` | Cambiar estado |
| `POST` | `/api/v1/anuncios/<id>/postulaciones` | Postularse |
| `GET` | `/api/v1/anuncios/<id>/postulaciones` | Listar postulaciones (pendiente/contactado/descartado) |
| `PATCH` | `/api/v1/anuncios/<id>/postulaciones/<pid>` | Moderar postulación |

### **7.16 Negocios + Merchant**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/v1/negocios/` | Crear negocio (comercio/servicio/virtual/hibrido) |
| `GET` | `/api/v1/negocios/` | Listar negocios |
| `GET` | `/api/v1/negocios/<id>` | Detalle (borrador/pendiente_verificacion/activo/suspendido/rechazado) |
| `GET` | `/api/v1/negocios/slug/<slug>` | Detalle por slug |
| `GET` | `/api/v1/negocios/mapa` | Negocios para mapa (PostGIS) |
| `GET` | `/api/v1/negocios/buscar` | Buscar negocios |
| `GET` | `/api/v1/negocios/categorias` | Categorías de negocio |
| `GET` | `/api/v1/negocios/<id>/horarios` | Listar horarios |
| `POST` | `/api/v1/negocios/<id>/horarios` | Crear horario |
| `POST` | `/api/v1/negocios/<id>/imagenes` | Subir imágenes (+upload) |
| `DELETE` | `/api/v1/negocios/<id>/imagenes/<idx>` | Eliminar imagen |
| `POST` | `/api/v1/negocios/<id>/rating` | Calificar negocio |
| `GET` | `/api/v1/negocios/<id>/ratings` | Ratings de negocio |
| `POST` | `/api/v1/negocios/<id>/reportar` | Reportar negocio |
| `GET` | `/api/v1/negocios/<id>/stats` | Estadísticas de negocio |
| `GET` | `/api/v1/merchant/payment-methods` | Listar métodos de pago del comerciante |
| `POST` | `/api/v1/merchant/payment-methods` | Crear método de pago |
| `PATCH` | `/api/v1/merchant/payment-methods/<id>` | Editar método de pago |
| `DELETE` | `/api/v1/merchant/payment-methods/<id>` | Eliminar método de pago |
| `GET` | `/api/v1/merchant/preferences` | Ver preferencias del comerciante |
| `PATCH` | `/api/v1/merchant/preferences` | Editar preferencias del comerciante |

### **7.17 Habilidades / Oficios**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/habilidades` | Lista de habilidades |
| `POST` | `/api/v1/habilidades` | Crear habilidad (según código) |
| `GET` | `/api/v1/habilidades/mis-niveles` | Mis niveles |
| `POST` | `/api/v1/habilidades/<id>/nivel/<idx>/quiz` | Quiz de nivel |
| `POST` | `/api/v1/habilidades/<id>/nivel/<idx>/certificacion` | Certificación técnica de nivel |
| `GET` | `/api/v1/habilidades/<id>` | Detalle de habilidad |
| `POST` | `/api/v1/habilidades/endosar` | Endosar habilidad |
| `GET` | `/api/v1/habilidades/certificaciones` | Mis certificaciones |
| `GET` | `/api/v1/habilidades/progreso` | Progreso de certificación |

### **7.18 Regiones**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/regions` | Listar regiones (GET "" ) |
| `GET` | `/api/v1/regions/detectar?ubicacion=` | Detectar región por texto de ubicación |

### **7.19 Admin + Superadmin**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/users` | Listar usuarios (scoping regional) |
| `GET` | `/api/v1/admin/users/<id>` | Detalle de usuario en región |
| `PATCH` | `/api/v1/admin/users/<id>/role` | Cambiar rol |
| `PATCH` | `/api/v1/admin/users/<id>/status` | Cambiar estado |
| `GET` | `/api/v1/admin/stats/overview` | Resumen operativo regional |
| `GET` | `/api/v1/admin/verifications` | Cola de verificaciones |
| `POST` | `/api/v1/admin/verifications/approve` | Aprobar verificación |
| `POST` | `/api/v1/admin/verifications/reject` | Rechazar verificación |
| `GET` | `/api/v1/admin/solicitudes` | Solicitudes de la región |
| `POST` | `/api/v1/admin/solicitudes/moderate` | Moderar solicitud |
| `GET` | `/api/v1/admin/contracts` | Contratos de la región |
| `POST` | `/api/v1/admin/contracts/moderate` | Moderar contrato |
| `GET` | `/api/v1/admin/disputes` | Disputas de la región |
| `POST` | `/api/v1/admin/disputes/resolve` | Resolver disputa |
| `GET` | `/api/v1/admin/tickets` | Tickets de la región |
| `PATCH` | `/api/v1/admin/tickets` | Actualizar ticket |
| `GET` | `/api/v1/admin/content/reports` | Reportes de contenido |
| `POST` | `/api/v1/admin/content/reports/moderate` | Moderar reporte |
| `GET` | `/api/v1/admin/staff` | Listar staff regional |
| `POST` | `/api/v1/admin/staff` | Crear staff regional |
| `GET` | `/api/v1/superadmin/admins` | Listar admins globales |
| `POST` | `/api/v1/superadmin/admins` | Crear admin global |
| `GET` | `/api/v1/superadmin/config` | Ver configuración global |
| `GET` | `/api/v1/superadmin/audit-logs` | Logs de auditoría |
| `GET` | `/api/v1/superadmin/legal/tyc` | T&C vigentes |
| `POST` | `/api/v1/superadmin/override/user` | Override sobre usuario |
| `POST` | `/api/v1/superadmin/override/contract` | Override sobre contrato |
| `GET` | `/api/v1/superadmin/ai/params` | Parámetros IA |
| `GET` | `/api/v1/superadmin/flags` | Feature flags |
| `POST` | `/api/v1/superadmin/regions/reindex` | Reindexar regiones |

---

## 8. Flujo de Despliegue (PWA)

1. `frontend`: `vite build` → assets estáticos servidos por CDN/static host (HTTPS).
2. `backend`: Gunicorn + Flask detrás de Nginx (proxy HTTPS).
3. Worker Celery + Redis para notificaciones/push y jobs de IA.
4. Un solo build multiplataforma (cumple RNF-07.6).

---

## 9. Módulos Implementados (IA, Confianza, Geocerca y Tiempo Real)

### **9.1 Motor de Recomendación (2 etapas)**

El motor de recomendación combina retrieval geoespacial con ranking ML:

- **Retrieval geoespacial:** `find_nearby_providers()` usa PostGIS `ST_DWithin` en producción o fórmula Haversine en tests/SQLite. Busca hasta 50 candidatos en un radio de 15km.
- **Feature Extraction:** `FeatureExtractor` extrae 22 features por proveedor-solicitud: geoespaciales (distancia, zona), confianza (trust_score, KYC, portfolio, badges, contratos), historial (rating, tasa aceptación, tiempo respuesta), negocio (match categoría, precio, saturación), rotación (bandit, fresh, exploración) y metadata (hora, día, urgencia).
- **ML Ranking:** `MLRanker` usa LightGBM Lambdarank para predecir scores de relevancia (entrenado por el script `train.py` con Lambdarank). Se fallbacka a `HeuristicRecommender` si ML falla.
- **ShadowRecommender:** Loguea predicciones ML pero retorna heurístico — usado en modo `ml_shadow_mode` para validar sin afectar usuarios.
- **ThompsonBandit:** Multi-Armed Bandit con Thompson Sampling para rotación inteligente de categorías. Estado persistido en BD.
- **Factory `get_recommender()`:** Selecciona implementación según feature flags: `ml_ranking_enabled` + `!ml_shadow_mode` → `HybridRecommender`; `ml_shadow_mode` → `ShadowRecommender`; default → `HeuristicRecommender`.

### **9.2 Trust Score (Sistema de Confianza)**

Score consolidado 0-100 con 5 dimensiones:

| Dimensión | Ponderación | Fuente |
|-----------|-------------|--------|
| KYC Verificado | 25% | `profile.verificado` |
| Rating Promedio | 25% | `profile.calificacion_promedio / 5.0` |
| Contratos Completados | 20% | `min(contratos / 50, 1.0)` |
| Calidad Portafolio | 15% | `min(items_aprobados / 10, 1.0)` |
| Referidos | 15% | `min(referidos / 10, 1.0)` |

**Niveles:** Experto (80-100), Verificado (60-79), Confiable (40-59), Nuevo (0-39).

**Componentes:** `models/trust.py` (TrustScore), `services/trust.py` (TrustService), `models/badges.py` (Badge). Frontend: `TrustScore` (medidor circular), `TrustBreakdown` (desglose), `BadgePanel` (insignias).

### **9.3 Geocerca en Cascada**

`CascadeManager` gestiona notificaciones geoespaciales progresivas:

```
Solicitud publicada → CascadeManager.start_cascade(solicitud_id)
  → Fase 1: radio 2km, delay 300s, máx 5 candidatos
  → Fase 2: radio 5km, delay 600s, máx 10 candidatos
  → Fase 3: radio 15km, delay 900s, máx 15 candidatos
```

Cada fase: busca proveedores con `find_nearby_providers()` → crea `Notification` → emite `socketio.emit('notificacion:nueva', room=f'user:{id}')` vía Redis message_queue. Tiempo total de entrega: <1s desde emisión hasta cliente. Celery gestiona los timers entre fases.

### **9.4 A/B Testing**

- `ABTest.get_group(user_id)` — Asigna grupo 'A' o 'B' de forma determinista (50/50).
- `ABTest.log_recommendation()` — Registra cada recomendación con solicitud, proveedor, score, modelo y grupo.
- `ABTest.get_metrics()` — Métricas por grupo: total, avg_score, tasa_aceptacion.
- Cableado en `app/controllers/ai.py` (ambos endpoints: recommendations y solicitudes-for-provider).

### **9.5 Visor 360°**

`Viewer360` (A-Frame) muestra imágenes panorámicas del portafolio de proveedores. Integrado en `ProfilePage.tsx` y en detalle de solicitudes. Dependencia: `aframe` en `package.json`.

### **9.6 Portafolio Multimedia**

Blueprint `/api/v1/portfolio` con:
- Upload drag-and-drop a MinIO (S3-compatible).
- Optimización automática de imágenes a WebP (800x800px, calidad 85%).
- Soporte: fotos, videos y documentos.
- Moderación: estado `pendiente_revision` → `aprobado` / `rechazado`.
- `PortfolioUploader` (upload), `PortfolioGallery` (galería), integrados en `ProfilePage`.

### **9.7 Observabilidad ML**

- **Blueprint `ai_metrics`** (`routes/ai_metrics.py`): dashboard de métricas del modelo (versión, feature importance, A/B test results).
- **Tarea Celery `check_ml_health`** (cada 6 horas): alerta si modelo no entrenado o tasa aceptación < baseline.
- **Script `rollout_ml.py`**: rollout gradual (shadow → 10% → 50% → 100% tráfico ML).

---

*Versión: 2.1 — Sincronización con backend real (35 blueprints + 3 sockets, chambas/maranas/ofertas/anuncios/negocios/habilidades/regiones, panel admin FE).*

## 10. Diagramas

Los diagramas se regeneraron para reflejar la arquitectura implementada (motor ML 2 etapas, geocerca en cascada, tiempo real Socket.IO, trust, portfolio, 35 blueprints REST + 3 handlers Socket.IO). Fuente `.puml` y render ASCII `.utxt` en `diagramas/`; PNG en `diagramas/png/`.

| # | Diagrama | Descripción | PNG | Fuente |
|---|----------|-------------|-----|--------|
| 01 | Componentes | Arquitectura de componentes real (35 blueprints REST + 3 handlers Socket.IO, capa ML, Socket.IO, MinIO, Celery, Redis) | [png](diagramas/png/01_componentes.png) | [puml](diagramas/01_componentes.puml) |
| 02 | Despliegue | Producción: Nginx, Flask/Socket.IO, Redis MQ, Celery, MinIO, PostgreSQL+PostGIS | [png](diagramas/png/02_despliegue.png) | [puml](diagramas/02_despliegue.puml) |
| 03 | Flujo Solicitud→Pago | Solicitud→Recomendación ML→Cascada→Oferta→Contrato+Chat→Pago | [png](diagramas/png/03_flujo_orden_pago.png) | [puml](diagramas/03_flujo_orden_pago.puml) |
| 04 | Modelo de Datos | Entidades: User, Profile, Solicitud, Order, Trust, Badge, NotificationCascade, RecommendationLog, PortfolioItem, Wallet | [png](diagramas/png/04_modelo_datos.png) | [puml](diagramas/04_modelo_datos.puml) |
| 05 | Casos de Uso | Casos implementados (trust, geocerca, notificación cascada, portafolio/360°, ML) | [png](diagramas/png/05_casos_uso.png) | [puml](diagramas/05_casos_uso.puml) |
| 06 | Billetera Virtual | Wallet, monedas, transacciones | [png](diagramas/png/06_billetera_virtual.png) | [puml](diagramas/06_billetera_virtual.puml) |
| 07 | Pipeline Recomendación ML | Secuencia 2 etapas: retrieval→FeatureExtractor(22)→MLRanker→ABTest, fallback/shadow | [png](diagramas/png/07_pipeline_recomendacion.png) | [puml](diagramas/07_pipeline_recomendacion.puml) |
| 08 | Cascada Geoespacial | Secuencia cascada 2/5/15km → Socket.IO `notificacion:nueva` → Redis MQ → <1s | [png](diagramas/png/08_cascada_geoespacial.png) | [puml](diagramas/08_cascada_geoespacial.puml) |
| 09 | Tiempo Real (Socket.IO) | Handlers notification/chat/oferta, sala `user:<id>` | [png](diagramas/png/09_tiempo_real_socketio.png) | [puml](diagramas/09_tiempo_real_socketio.puml) |
| 10 | Negocios / Comerciante | Negocio+horarios/ratings/reportes, MerchantPreference/MerchantPaymentMethod, anuncios+postulaciones | — | [puml](diagramas/10_modelo_datos_comerciante.puml) |
| 11 | División regional | Region, scoping admin (`_region_user_ids`, `_assert_in_region`), `assign_region`, `region_scope_id()` | — | [puml](diagramas/11_regiones.puml) |
| 12 | Panel admin FE | React 18 + Vite 6, guards, NAV_SIDEBAR/NAV_TABBAR, adminApi/kycApi/superadminApi | — | [puml](diagramas/12_arquitectura_admin_frontend.puml) |

## 11. División Regional

- Scoping en `admin.py` con `_region_user_ids`, `_assert_in_region`, `_assert_contract_in_region`, `_assert_rating_in_region`.
- `services/region.py`: `assign_region` usa Profile.zona y NUNCA reasigna staff; `contract_owned_by_region` evita doble-conteo (dueña = región del solicitante).
- Superadmin gestiona admins globales y `regions/reindex`; ver `diagramas/11_regiones.puml`.

## 12. Panel Admin FE

- `Chambeapp_admin_frontend` (React 18 + Vite 6 + JS, react-router-dom 7, axios, lucide-react, sonner).
- Roles `verificador/soporte/admin/superadmin`, guards `RequireAuth`/`RequireRole`, `config/navigation.js` (NAV_SIDEBAR+NAV_TABBAR).
- Detalle completo en `Arquitectura_Admin_Frontend.md` (documento hermano, referencia normativa del frontend staff).

*Versión: 2.1 — Sincronización con backend real (35 blueprints + 3 sockets, chambas/maranas/ofertas/anuncios/negocios/habilidades/regiones, panel admin FE).**
