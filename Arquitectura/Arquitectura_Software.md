# Arquitectura de Software — ChambeApp (PWA) v2.0

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
│  - 24 Blueprints por dominio            │
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
│   │   ├── user.py            # Usuario, Perfil, Verificacion
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
│   │   └── recommendation_log.py # Log de predicciones ML
│   ├── schemas/               # Marshmallow (validacion)
│   ├── routes/                # Blueprints (endpoints)
│   │   ├── auth.py            # Registro, login, T&C (RF-01/RF-17)
│   │   ├── users.py           # Perfil, habilidades (RF-02/03)
│   │   ├── services.py        # Publicacion/ordenes (RF-04/07)
│   │   ├── payments.py        # Pasarela de pagos (RF-08)
│   │   ├── ai.py              # Match/recomendacion (RF-05)
│   │   ├── ai_metrics.py      # Métricas ML y A/B testing
│   │   ├── billing.py         # Suscripciones, valor agregado (RF-11/13/14/15)
│   │   ├── notifications.py   # Push, chat (RF-16)
│   │   ├── notification_socket.py # Handler Socket.IO notificaciones
│   │   ├── legal.py           # T&C, disputas, Habeas Data (RF-17)
│   │   ├── wallet.py          # Billetera Virtual (RF-25)
│   │   ├── coins.py           # Sistema de Monedas (RF-27)
│   │   ├── modalidades.py     # Modalidades de Cobro (RF-26)
│   │   ├── milestones.py      # Hitos de Pago (RF-29)
│   │   ├── dashboard.py       # Dashboard Operativo (RF-30)
│   │   └── portfolio.py       # Portafolio multimedia (upload/download)
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
│   │   └── trust.py           # TrustScore service (scoring 0-100)
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
│       ├── 001_add_postgis_trust.py   # PostGIS + TrustScore + Badges
│       └── 002_add_solicitud_radio.py # radio_km en solicitudes
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
- **Payment**: id, order_id, monto, comision, estado, pasarela, liberado_en.
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
- Cableado en `app/routes/ai.py` (ambos endpoints: recommendations y solicitudes-for-provider).

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

*Versión: 2.0 — Arquitectura actualizada con billetera virtual, modalidades de cobro y sistema de monedas.

## 10. Diagramas

Los diagramas se regeneraron para reflejar la arquitectura implementada (motor ML 2 etapas, geocerca en cascada, tiempo real Socket.IO, trust, portfolio, 24 blueprints). Fuente `.puml` y render ASCII `.utxt` en `diagramas/`; PNG en `diagramas/png/`.

| # | Diagrama | Descripción | PNG | Fuente |
|---|----------|-------------|-----|--------|
| 01 | Componentes | Arquitectura de componentes real (24 blueprints, capa ML, Socket.IO, MinIO, Celery, Redis) | [png](diagramas/png/01_componentes.png) | [puml](diagramas/01_componentes.puml) |
| 02 | Despliegue | Producción: Nginx, Flask/Socket.IO, Redis MQ, Celery, MinIO, PostgreSQL+PostGIS | [png](diagramas/png/02_despliegue.png) | [puml](diagramas/02_despliegue.puml) |
| 03 | Flujo Solicitud→Pago | Solicitud→Recomendación ML→Cascada→Oferta→Contrato+Chat→Pago | [png](diagramas/png/03_flujo_orden_pago.png) | [puml](diagramas/03_flujo_orden_pago.puml) |
| 04 | Modelo de Datos | Entidades: User, Profile, Solicitud, Order, Trust, Badge, NotificationCascade, RecommendationLog, PortfolioItem, Wallet | [png](diagramas/png/04_modelo_datos.png) | [puml](diagramas/04_modelo_datos.puml) |
| 05 | Casos de Uso | Casos implementados (trust, geocerca, notificación cascada, portafolio/360°, ML) | [png](diagramas/png/05_casos_uso.png) | [puml](diagramas/05_casos_uso.puml) |
| 06 | Billetera Virtual | Wallet, monedas, transacciones | [png](diagramas/png/06_billetera_virtual.png) | [puml](diagramas/06_billetera_virtual.puml) |
| 07 | Pipeline Recomendación ML | Secuencia 2 etapas: retrieval→FeatureExtractor(22)→MLRanker→ABTest, fallback/shadow | [png](diagramas/png/07_pipeline_recomendacion.png) | [puml](diagramas/07_pipeline_recomendacion.puml) |
| 08 | Cascada Geoespacial | Secuencia cascada 2/5/15km → Socket.IO `notificacion:nueva` → Redis MQ → <1s | [png](diagramas/png/08_cascada_geoespacial.png) | [puml](diagramas/08_cascada_geoespacial.puml) |
| 09 | Tiempo Real (Socket.IO) | Handlers notification/chat/oferta, sala `user:<id>` | [png](diagramas/png/09_tiempo_real_socketio.png) | [puml](diagramas/09_tiempo_real_socketio.puml) |

*Versión: 2.0 — Arquitectura actualizada con billetera virtual, modalidades de cobro y sistema de monedas.*
