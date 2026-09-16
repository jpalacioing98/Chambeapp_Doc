# Guía de Despliegue — ChambeApp

> Documento de referencia para levantar ChambeApp por primera vez en **desarrollo** y para su **despliegue en producción**.
> Repos: `Chambeapp_backend/` (Flask + Socket.IO + Celery) y `Chambeapp_frontend/` (React + Vite PWA).

---

## 0. Prerrequisitos

- **Python 3.11+**. ⚠️ En este entorno el `python` del sistema es 3.14 **sin dependencias instaladas**; usar `py -3.11` para crear el venv, instalar requisitos y correr los tests.
- **Node.js 18+** y `npm`.
- **Docker + Docker Compose** (recomendado para levantar PostgreSQL/PostGIS, Redis y MinIO).
- `git`.

---

## 1. Despliegue en Desarrollo (primera vez)

Objetivo: tener backend + frontend corriendo localmente con el mínimo esfuerzo. Por defecto el backend usa **SQLite** (sin Postgres) y el frontend usa el proxy de Vite hacia el backend.

### 1.1 Backend

```powershell
cd Chambeapp_backend

# 1. Entorno virtual con Python 3.11 (crítico en este entorno)
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Dependencias
pip install -r requirements.txt

# 3. Configuración
Copy-Item .env.example .env        # por defecto usa SQLite

# 4. Crear tablas + usuarios de prueba (solo dev)
python seed.py

# 5. Arrancar Flask + Socket.IO (debug)
python run.py
#   → http://localhost:5000  (health: GET /api/v1/auth/health)
```

> **Infraestructura real (opcional):** para usar PostGIS / Redis / MinIO en dev, levanta solo los servicios de infra y ajusta `.env`:
> ```powershell
> docker-compose up -d db redis minio
> ```
> Luego en `.env` pon `DATABASE_URL=postgresql+psycopg2://chambeapp:chambeapp_dev@localhost:5432/chambeapp`, `REDIS_URL=redis://localhost:6379/0` y las variables `S3_*`.

### 1.2 Frontend

```powershell
cd Chambeapp_frontend
npm install
npm run dev
#   → http://localhost:5173  (proxy automático de /api y /socket.io → :5000)
```

> El frontend no requiere `.env` propio. Si necesitas una URL de Socket.IO distinta, crea `.env` con `VITE_SOCKET_URL`.

### 1.3 Verificación

```powershell
# Backend: 272 tests (usar SIEMPRE Python 3.11)
py -3.11 -m pytest tests/ -q -p no:cacheprovider

# Frontend: 210 tests (Vitest)
npm test

# Build PWA (typecheck + bundle)
npm run build
```

- Health backend: `GET http://localhost:5000/api/v1/auth/health`
- Flujo manual: login → publicar solicitud → ver recomendación → ofertar → contrato → chat → completar → pagar → calificar.

### 1.4 Notas de desarrollo

- **SQLite por defecto.** Para PostGIS real: `DATABASE_URL` Postgres y ejecuta migraciones Flask-Migrate (`flask db upgrade`); las migraciones `001_add_postgis_trust` y `002_add_solicitud_radio` crean las extensiones y la columna `radio_km`.
- `SOCKETIO_MESSAGE_QUEUE` puede quedar en `None` en dev (un solo proceso). En producción es **obligatorio** Redis.
- Feature flags de ML: `ml_ranking_enabled` y `ml_shadow_mode` (ver `app/config.py`).

---

## 2. Despliegue en Producción

Arquitectura: contenedores Docker para backend (gunicorn + eventlet), Celery worker + beat, PostgreSQL/PostGIS, Redis y MinIO; frontend como PWA estática servida por Nginx que hace proxy del API y de Socket.IO.

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

3. **Migraciones de base de datos** (aplica PostGIS + `radio_km`):

```powershell
docker-compose exec backend flask db upgrade
```

4. **Crear bucket de MinIO:**

```powershell
# Con la CLI mc apuntando a minio:9000 / consola http://localhost:9001
mc mb local/chambeapp-portfolio
```

5. **(Opcional) Modelo ML y monitoreo:** entrenar `train.py`, activar con `rollout_ml.py`, y `check_ml_health` corre en Celery Beat.

### 2.2 Frontend (PWA estática)

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

### 2.3 Verificación en producción

```powershell
# Health
curl https://app.chambeapp.com/api/v1/auth/health

# Logs
docker-compose logs -f backend celery_worker

# Métricas ML (admin)
GET /api/v1/ai/metrics
```

### 2.4 Notas de producción

- ⚠️ **Nunca** `debug=True` en producción (el `Dockerfile` usa gunicorn + eventlet).
- Secretos fuertes y distintos a los de desarrollo.
- `SOCKETIO_MESSAGE_QUEUE=redis://...` es **obligatorio** para que los eventos en tiempo real funcionen con varios workers/procesos.
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

*Generado como parte de la integración de documentación (ChambeApp_Doc, 2026-09-05).*
