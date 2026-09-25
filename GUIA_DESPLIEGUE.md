# Guía de Despliegue — ChambeApp

> Documento de referencia para levantar ChambeApp por primera vez en **desarrollo** y para su **despliegue en producción**.
> Repos: `Chambeapp_backend/` (Flask + Socket.IO + Celery), `Chambeapp_frontend/` (React + Vite PWA, cliente) y `Chambeapp_admin_frontend/` (React + Vite, panel de administración).

---

## 0. Prerrequisitos

- **Python 3.14**. ⚠️ En este entorno el `python` del sistema es 3.14 **sin dependencias instaladas**; usar el launcher `py` para crear el venv, instalar requisitos y correr los tests. `requirements.txt` está marcado como **compatible con Python 3.14** (actualizado 2026-09-01).
- **Node.js 18+** y `npm`.
- **Docker + Docker Compose** (recomendado para levantar PostgreSQL/PostGIS, Redis y MinIO).
- `git`.

---

## 1. Despliegue en Desarrollo (primera vez)

Objetivo: tener backend + frontend corriendo localmente con el mínimo esfuerzo. Por defecto el backend usa **SQLite** (sin Postgres) y el frontend usa el proxy de Vite hacia el backend.

### 1.1 Backend

```powershell
cd Chambeapp_backend

# 1. Entorno virtual con Python 3.14 (versión del entorno; requirements.txt ya es compatible)
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Dependencias
pip install -r requirements.txt

# 3. Configuración
Copy-Item .env.example .env        # por defecto usa SQLite

# 4. Crear tablas + usuarios de prueba (solo dev)
python seed.py

# 5. Migraciones (incluye 014_regiones: tabla regions + users.region_id)
flask db upgrade

# 6. Arrancar Flask + Socket.IO (debug)
python run.py
#   → http://localhost:5000  (health: GET /api/v1/auth/health)
```

> **Nota:** al arrancar la app (fuera de TESTING) se siembran automáticamente las **regiones base de Colombia** (Caribe, Andina, Pacífica, Orinoquía, Amazónica) vía `app/data/seed_regions.py` (`sync_regions()`, idempotente; no borra regiones custom del superadmin). También se sincroniza el catálogo KYC (`app/data/seed_kyc.py`).

> **Infraestructura real (opcional):** para usar PostGIS / Redis / MinIO en dev, levanta solo los servicios de infra y ajusta `.env`:
> ```powershell
> docker-compose up -d db redis minio
> ```
> Luego en `.env` pon `DATABASE_URL=postgresql+psycopg2://chambeapp:chambeapp_dev@localhost:5432/chambeapp`, `REDIS_URL=redis://localhost:6379/0` y las variables `S3_*`.
>
> Alternativa full-Docker con hot-reload: `docker compose -f docker-compose.dev.yml up -d --build` (levanta db/redis/minio/backend/celery; el entrypoint inicializa DB y arranca `run.py` con hot-reload).

### 1.2 Frontend cliente (PWA)

```powershell
cd Chambeapp_frontend
npm install
npm run dev
#   → http://localhost:5173  (proxy automático de /api y /socket.io → :5000)
```

> El frontend no requiere `.env` propio. Si necesitas una URL de Socket.IO distinta, crea `.env` con `VITE_SOCKET_URL`.

### 1.3 Frontend admin (panel de administración)

Repositorio: `Chambeapp_admin_frontend/` (React 18 + Vite + **JavaScript**, no TypeScript). Usa las **mismas APIs** del backend que el cliente PWA (`/api/v1/...`).

```powershell
cd Chambeapp_admin_frontend
npm install
npm run dev
#   → http://localhost:5174  (proxy automático de /api → :5000)
```

- **Dev:** puerto **5174**, proxy `/api` → `http://localhost:5000` (ver `vite.config.js`). No proxyea `/socket.io` (el panel no usa WebSockets).
- **Preview local del build:** `npm run preview` → `http://localhost:4174` (mismo proxy `/api`).
- **Tests:** `npm test` (Vitest, jsdom).
- **Build:** `npm run build` (solo `vite build`, sin typecheck — es JS).

### 1.4 Verificación

```powershell
# Backend: tests (usar SIEMPRE el venv de Python 3.14)
py -3.14 -m pytest tests/ -q -p no:cacheprovider

# Frontend cliente: tests (Vitest)
npm test

# Build PWA (typecheck + bundle)
npm run build

# Frontend admin: tests (Vitest)
cd ..\Chambeapp_admin_frontend
npm test

# Build admin (bundle)
npm run build
```

- Health backend: `GET http://localhost:5000/api/v1/auth/health`
- Flujo manual: login → publicar solicitud → ver recomendación → ofertar → contrato → chat → completar → pagar → calificar.

### 1.5 Notas de desarrollo

- **SQLite por defecto.** Para PostGIS real: `DATABASE_URL` Postgres y ejecuta migraciones Flask-Migrate (`flask db upgrade`); las migraciones `001_add_postgis_trust` y `002_add_solicitud_radio` crean las extensiones y la columna `radio_km`. La migración **`014_regiones`** crea la tabla `regions` y la columna `users.region_id` (división administrativa del panel admin).
- `SOCKETIO_MESSAGE_QUEUE` puede quedar en `None` en dev (un solo proceso). En producción es **obligatorio** Redis.
- Feature flags de ML: `ml_ranking_enabled` y `ml_shadow_mode` (ver `app/config.py`).
- **Token Mapbox (deuda conocida del frontend cliente):** el mapa (`MapboxMap`, `mapbox-gl`) requiere `VITE_MAPBOX_TOKEN` (token **público** `pk.…`) en el `.env` del frontend cliente; sin token (o sin WebGL) el componente muestra un fallback estático. Ver [Frontend/MAPBOX.md](Frontend/MAPBOX.md) y la página `/dev/map` del cliente.

---

## 2. Despliegue en Producción

Arquitectura: contenedores Docker para backend (gunicorn + eventlet), Celery worker + beat, PostgreSQL/PostGIS, Redis y MinIO; frontend cliente como PWA estática y frontend admin como estático, ambos servidos por Nginx que hace proxy del API (y de Socket.IO para el cliente) al backend.

### 2.1 Infraestructura con Docker Compose

El `docker-compose.yml` define: `db` (postgis:16-3.4), `redis:7`, `minio`, `backend` (imagen del `Dockerfile`, arranca con **gunicorn + eventlet** sobre `wsgi:app`), `celery_worker` y `celery_beat`.

1. **Crear `.env` de producción** (no commitear). Variables mínimas:

```env
FLASK_ENV=production
SECRET_KEY=<secreto-fuerte>
JWT_SECRET_KEY=<secreto-fuerte>
DATABASE_URL=postgresql://chambeapp:<pass>@db:5432/chambeapp
REDIS_URL=redis://redis:6379/0
SOCKETIO_MESSAGE_QUEUE=redis://redis:6379/0   # CRÍTICO: Socket.IO multi-worker
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=chambeapp
S3_SECRET_KEY=<minio-pass>
S3_BUCKET=chambeapp-portfolio
ml_ranking_enabled=true
ml_shadow_mode=false
```

2. **Construir y levantar:**

```powershell
docker-compose up -d --build
```

3. **Migraciones de base de datos** (aplica PostGIS + `radio_km` + todas las posteriores, hasta **`014_regiones`**: tabla `regions` + `users.region_id`):

```powershell
docker-compose exec backend flask db upgrade
```

> Al arrancar el backend (fuera de TESTING) se siembran automáticamente las regiones base de Colombia (`app/data/seed_regions.py`, idempotente) y el catálogo KYC. No requiere paso manual.

4. **Crear bucket de MinIO:**

```powershell
# Con la CLI mc apuntando a minio:9000 / consola http://localhost:9001
mc mb local/chambeapp-portfolio
```

5. **(Opcional) Modelo ML y monitoreo:** entrenar `train.py`, activar con `rollout_ml.py`, y `check_ml_health` corre en Celery Beat.

### 2.2 Frontend cliente (PWA estática)

```powershell
cd Chambeapp_frontend
npm install
npm run build        # genera dist/ (service worker + manifest)
```

Sirve `dist/` con **Nginx** (o static host) y haz proxy del API y de Socket.IO al backend:

```nginx
server {
    listen 443 ssl;
    server_name app.chambeapp.com;
    root /var/www/chambeapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
    }
    location /socket.io {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

> Si el frontend se sirve desde otro dominio, define `VITE_API_URL` / `VITE_SOCKET_URL` en el build.

### 2.3 Frontend admin (estático)

```powershell
cd Chambeapp_admin_frontend
npm install
npm run build        # genera dist/ (vite build, sin service worker)
```

Sirve `dist/` en otro vhost/dominio de Nginx (p. ej. `admin.chambeapp.com`) con proxy del API al backend. El panel **no usa Socket.IO**, solo `/api`:

```nginx
server {
    listen 443 ssl;
    server_name admin.chambeapp.com;
    root /var/www/chambeapp-admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
    }
}
```

> Usa las mismas APIs `/api/v1/...` que el cliente PWA (mismo backend, mismo JWT). Si se sirve bajo el mismo dominio que el cliente, puede compartir el bloque `location /api` existente.

### 2.4 Verificación en producción

```powershell
# Health
curl https://app.chambeapp.com/api/v1/auth/health

# Logs
docker-compose logs -f backend celery_worker

# Métricas ML (admin)
GET /api/v1/ai/metrics
```

### 2.5 Notas de producción

- ⚠️ **Topología actual = instancia única (sin HA):** un solo `backend`
  (`gunicorn -w 1`), un solo Postgres, un solo Redis y un solo MinIO. **No hay
  balanceador de carga ni base de datos distribuida** en esta config.
- Para **sostener la separación regional** (RBAC + `region_id` ya implementados)
  y escalar, ver [Arquitectura/Infraestructura_Regional.md](Arquitectura/Infraestructura_Regional.md):
  Nginx LB + réplicas (`deploy.replicas`), Patroni (Postgres HA), Redis Sentinel
  y MinIO distribuido. Al escalar réplicas es **obligatorio**
  `SOCKETIO_MESSAGE_QUEUE=redis://...` (eventos Socket.IO entre procesos).
- ⚠️ **Nunca** `debug=True` en producción (el `Dockerfile` usa gunicorn + eventlet).
- Secretos fuertes y distintos a los de desarrollo.
- Backups de PostgreSQL y del volumen de MinIO.
- **HTTPS obligatorio** (PWA + WebPush + Habeas Data).
- Monitorear cola Celery y uso de Redis.

---

## 3. Mantenimiento y Rollback

- Reiniciar servicios: `docker-compose restart backend`
- Bajar todo: `docker-compose down`
- Migración atrás: `docker-compose exec backend flask db downgrade`
- Rollout de ML progresivo: activar `ml_ranking_enabled` y usar `ml_shadow_mode=true` (log ML, respuesta heurística) antes de 100% ML; luego `rollout_ml.py`.

---

*Generado como parte de la integración de documentación (ChambeApp_Doc, 2026-09-05). Actualizado 2026-09-25: frontend admin, migración 014_regiones, seed automático de regiones, Python 3.14, nota token Mapbox.*
