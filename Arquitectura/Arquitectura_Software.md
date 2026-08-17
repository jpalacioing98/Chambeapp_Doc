# Arquitectura de Software — ChambeApp (PWA)

> Stack: **React + Vite (PWA)** (frontend) + **Python Flask** (backend REST API) + motor de IA y visualización 3D.
> Alineado con los módulos de `01_Contexto`, requerimientos de `02_Requerimientos`, historias de `03_Historias_Usuario`, modelo de `04_Monetizacion` y marco legal de `05_Terminos_Condiciones`.
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
│   │   ├── payment.py         # Pago, Escrow, Reembolso
│   │   ├── subscription.py    # Plan, Suscripcion
│   │   ├── rating.py          # Calificacion, Reputacion
│   │   └── service.py         # Catalogo de servicios
│   ├── schemas/               # Marshmallow (validacion)
│   ├── routes/                # Blueprints (endpoints)
│   │   ├── auth.py            # Registro, login, T&C (RF-01/RF-17)
│   │   ├── users.py           # Perfil, habilidades (RF-02/03)
│   │   ├── services.py        # Publicacion/ordenes (RF-04/07)
│   │   ├── payments.py        # Pasarela, escrow (RF-08)
│   │   ├── ai.py              # Match/recomendacion (RF-05)
│   │   ├── billing.py         # Suscripciones, valor agregado (RF-11/13/14/15)
│   │   ├── notifications.py   # Push, chat (RF-16)
│   │   └── legal.py           # T&C, disputas, Habeas Data (RF-17)
│   ├── services/              # Logica de negocio
│   │   ├── orders.py          # Ciclo de orden + disputas (RF-07)
│   │   ├── payments.py        # Escrow 48h, reembolsos (RF-08)
│   │   ├── earnings.py        # Trazabilidad (RF-09)
│   │   ├── subscriptions.py   # Planes Premium (RF-11)
│   │   ├── notifications.py   # WebPush + Background Sync
│   │   ├── chat.py            # Mensajeria tiempo real
│   │   ├── media.py           # Assets 3D/imagenes
│   │   └── legal.py           # Retenciones, jurisdiccion
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
│   │   ├── payments/         # Pasarela, escrow, reembolso (RF-08)
│   │   ├── earnings/         # Historial, certificados (RF-09/13)
│   │   ├── billing/          # Suscripciones, valor agregado (RF-11/14/15)
│   │   ├── notifications/    # Push, alertas (RF-16)
│   │   ├── chat/             # Mensajeria
│   │   └── legal/            # T&C, privacidad, Habeas Data (RF-17)
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

- **User**: id, rol (proveedor/solicitante), email, password_hash, edad_verificada, acepto_tyc (bool+log), fecha_registro.
- **Profile**: user_id, habilidades[], experiencia, zona, calificacion_promedio, verificado, badges[].
- **Service**: id, solicitante_id, categoria, descripcion, ubicacion, presupuesto, estado.
- **Order**: id, service_id, proveedor_id, estado (Pendiente/En progreso/Completado/Cancelado), escrow_status, creado_en.
- **Payment**: id, order_id, monto, comision, estado, pasarela, liberado_en (escrow 48h).
- **Subscription**: id, user_id, plan (Basico/Pro/Empresa), estado, renueva_en.
- **Rating**: id, order_id, autor_id, calificado_id, puntaje, comentario.
- **Dispute**: id, order_id, motivo, evidencias[], estado, resuelto_en.
- **LegalAcceptance**: id, user_id, version_tyc, fecha, ip.

---

## 6. Requerimientos No Funcionales (trazados)

- **PWA (RNF-07):** `vite-plugin-pwa` genera SW + manifest; `src/pwa/` maneja cola offline y Background Sync.
- **Seguridad (RNF-03):** JWT, cifrado de datos sensibles en reposo (PostgreSQL), HTTPS obligatorio, cumplimiento Ley 1581 (Habeas Data) vía `features/legal` y `services/legal`.
- **Rendimiento (RNF-04):** búsqueda <2s (índices DB + cache Redis), carga 3D <5s.
- **Transparencia algorítmica (RNF-02):** `ai/recommender.py` expone criterios; explicable en UI (RF-05).
- **Confiabilidad de pagos (RNF-06):** escrow + reintentos; tasa éxito >98%.

---

## 7. Flujo de Despliegue (PWA)

1. `frontend`: `vite build` → assets estáticos servidos por CDN/static host (HTTPS).
2. `backend`: Gunicorn + Flask detrás de Nginx (proxy HTTPS).
3. Worker Celery + Redis para notificaciones/push y jobs de IA.
4. Un solo build multiplataforma (cumple RNF-07.6).

---

*Versión: 1.0 — Arquitectura inicial. Siguiente paso: modelado detallado de BD (scripts de migración) y contratos de API.*
