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
│  - 3D/360 (Three.js / R3F)               │
│  - Estado, Router, Forms                 │
└───────────────┬─────────────────────────┘
                │ HTTPS / REST (JSON)
┌───────────────▼─────────────────────────┐
│  API Flask (Backend)                     │
│  - Blueprints por dominio                │
│  - Auth (JWT) · Validación (Marshmallow)│
│  - Servicios de negocio                  │
└──────┬───────────────┬──────────┬────────┘
       │               │          │
┌──────▼─────┐  ┌──────▼─────┐ ┌──▼──────────┐
│ PostgreSQL │  │ Redis      │ │ Motor IA    │
│ (datos)    │  │ (cola/cache│ │ (recommender│
│            │  │  /sesiones)│ │  /vectorize)│
└────────────┘  └────────────┘ └─────────────┘
       │               │          │
┌──────▼───────────────▼──────────▼──────────┐
│ Integraciones: MercadoPago/PSE · WebPush   │
│ Storage (3D/assets) · Email/SMS            │
└────────────────────────────────────────────┘
```

---

## 2. Tecnologías por Capa

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| UI/PWA | React 18 + TypeScript | Interfaz SPA instalable |
| Bundler/PWA | Vite + `vite-plugin-pwa` (Workbox) | Build, Service Worker, manifest, offline |
| Enrutado | React Router | Navegación por roles |
| Estado | Zustand (o Context) | Sesión, carrito de órdenes |
| 3D | Three.js + `@react-three/fiber` + `drei` | Visualización 3D/360 |
| HTTP client | Axios | Consumo de API |
| Forms | React Hook Form + Zod | Validación cliente |
| API | Flask + Flask-Smorest / Blueprint | Endpoints REST |
| Auth | Flask-JWT-Extended | Tokens, roles |
| ORM | SQLAlchemy 2.0 + Flask-Migrate | Persistencia PostgreSQL |
| Validación | Marshmallow | Schemas entrada/salida |
| Cola/Cache | Redis + Celery | Notificaciones, jobs IA, sesiones |
| IA | scikit-learn / sentence-transformers | Vectorización y match |
| Pagos | SDK MercadoPago + integración PSE | Pasarelas |
| Push | pywebpush (Web Push) | Notificaciones PWA |
| Tests | pytest (BE) · Vitest + RTL (FE) | Calidad |

---

## 3. Mapeo Módulos (Doc) → Componentes

| Módulo Doc | Backend (Flask) | Frontend (React) |
|-----------|-----------------|------------------|
| A. Gestión de Usuarios / Perfiles | `routes/auth.py`, `routes/users.py`, `services/verification.py` | `features/auth`, `features/profile` |
| B. Motor IA (Match) | `ai/recommender.py`, `ai/vectorizer.py`, `routes/ai.py` | `features/match` |
| C. Visualización 3D | `services/media.py` (assets) | `features/threeD` |
| D. Contractual / Trazabilidad / Pagos | `routes/orders.py`, `services/orders.py`, `routes/payments.py`, `services/payments.py`, `services/earnings.py` | `features/orders`, `features/payments`, `features/earnings` |
| E. Comunicación / Notificaciones | `services/notifications.py`, `services/chat.py`, `routes/notifications.py` | `features/notifications`, `features/chat` |
| **F. Billetera Virtual** | `routes/wallet.py`, `services/wallet.py` | `features/wallet` |
| **G. Monedas** | `routes/coins.py`, `services/coins.py` | `features/coins` |
| **H. Modalidades de Cobro** | `routes/modalidades.py`, `services/modalidades.py` | `features/modalidades` |
| **I. Hitos de Pago** | `routes/milestones.py`, `services/milestones.py` | `features/milestones` |
| **J. Dashboard Operativo** | `routes/dashboard.py`, `services/dashboard.py` | `features/dashboard` |
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
│   ├── extensions.py          # db, migrate, jwt, migrate, cache
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
│   │   └── transaction.py     # Transacciones de Billetera
│   ├── schemas/               # Marshmallow (validacion)
│   ├── routes/                # Blueprints (endpoints)
│   │   ├── auth.py            # Registro, login, T&C (RF-01/RF-17)
│   │   ├── users.py           # Perfil, habilidades (RF-02/03)
│   │   ├── services.py        # Publicacion/ordenes (RF-04/07)
│   │   ├── payments.py        # Pasarela de pagos (RF-08)
│   │   ├── ai.py              # Match/recomendacion (RF-05)
│   │   ├── billing.py         # Suscripciones, valor agregado (RF-11/13/14/15)
│   │   ├── notifications.py   # Push, chat (RF-16)
│   │   ├── legal.py           # T&C, disputas, Habeas Data (RF-17)
│   │   ├── wallet.py          # Billetera Virtual (RF-25)
│   │   ├── coins.py           # Sistema de Monedas (RF-27)
│   │   ├── modalidades.py     # Modalidades de Cobro (RF-26)
│   │   ├── milestones.py      # Hitos de Pago (RF-29)
│   │   └── dashboard.py       # Dashboard Operativo (RF-30)
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
│   │   └── dashboard.py       # Logica de dashboard (RF-30)
│   └── ai/                    # Motor de recomendacion
│       ├── recommender.py     # Ranking por similitud
│       └── vectorizer.py      # Vectorizacion de perfiles
├── migrations/                # Alembic (Flask-Migrate)
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
│   │   ├── threeD/           # Visualizacion 3D/360 (RF-06)
│   │   ├── orders/           # Publicar, ciclo orden, disputas (RF-04/07)
│   │   ├── payments/         # Pasarela de pagos, reembolso (RF-08)
│   │   ├── earnings/         # Historial, certificados (RF-09/13)
│   │   ├── billing/          # Suscripciones, valor agregado (RF-11/14/15)
│   │   ├── notifications/    # Push, alertas (RF-16)
│   │   ├── chat/             # Mensajeria
│   │   ├── legal/            # T&C, privacidad, Habeas Data (RF-17)
│   │   ├── wallet/           # Billetera Virtual (RF-25)
│   │   ├── coins/            # Sistema de Monedas (RF-27)
│   │   ├── modalidades/      # Modalidades de Cobro (RF-26)
│   │   ├── milestones/       # Hitos de Pago (RF-29)
│   │   └── dashboard/        # Dashboard Operativo (RF-30)
│   ├── components/           # UI reutilizable (Button, Modal, Card)
│   ├── lib/                  # api.ts (Axios), auth.ts, storage.ts
│   ├── hooks/                # useAuth, usePush, useOffline
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

---

## 8. Flujo de Despliegue (PWA)

1. `frontend`: `vite build` → assets estáticos servidos por CDN/static host (HTTPS).
2. `backend`: Gunicorn + Flask detrás de Nginx (proxy HTTPS).
3. Worker Celery + Redis para notificaciones/push y jobs de IA.
4. Un solo build multiplataforma (cumple RNF-07.6).

---

*Versión: 2.0 — Arquitectura actualizada con billetera virtual, modalidades de cobro y sistema de monedas.*
