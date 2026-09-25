# Infraestructura para la Separación Regional

> Documento de definición: qué infraestructura soporta la **división regional**
> implementada en el backend (Fase 4). Complementa `GUIA_DESPLIEGUE.md` y el
> diagrama `diagramas/13_infraestructura_regional.puml`.
> Estado: **definición / objetivo** — la topología actual es de instancia única.

---

## 1. Objetivo de la separación regional

La separación regional (ver `Requerimientos/RF_Division_Regional.md`) divide la
operación por **regiones de Colombia** (Caribe, Andina, Pacífica, Orinoquía,
Amazónica). Cada región tiene su propio equipo **admin + verificador + soporte**,
y todas las operaciones (usuarios, verificaciones, KYC, solicitudes, contratos,
disputas, tickets, contenido) quedan **acotadas a la región** del actor vía
`User.region_id` y el helper `app/auth/region.py`.

La infraestructura debe garantizar 4 cosas:

| Objetivo | Qué requiere |
|---|---|
| **1. Escalar la operación** (cada región crece) | Replicas de API detrás de un balanceador |
| **2. Aislamiento y control** | RBAC regional (ya resuelto en código) + separación de tráfico/políticas por región |
| **3. Disponibilidad** (una región no cae al resto) | HA de base de datos, Redis y almacenamiento |
| **4. Gobernanza global** | Control plane (superadmin/config/flags/auditoría/legal/IA) sin scope regional |

> La separación es **lógica (multi-tenancy por `region_id`)** en una sola base
> de datos. La infraestructura física puede ser **centralizada con HA** (recomendada
> para el MVP) o **física por región** (solo si se exige residencia de datos o
> latencia local). Ver §6.

---

## 2. Topología objetivo

Ver `diagramas/13_infraestructura_regional.puml` (render `.utxt` / `png`).

```
Borde           Nginx LB / Cloud LB  (healthcheck GET /api/v1/auth/health)
                   │            │
App layer       [Backend]      [Backend]   gunicorn + eventlet (-w 1) por réplica
                   │            │          Celery worker + beat (cola global)
Data layer      PostgreSQL/PostGIS (Patroni HA) · Redis (Sentinel HA) · MinIO (distribuido)
Control plane   Superadmin · Config · Flags · Auditoría · Legal · IA · Regiones  (global)
Panels          PWA cliente + Panel admin (roles scoped por region_id) → LB
```

### 2.1 Balanceador de carga

- **Hoy:** no existe (1 contenedor `backend`, gunicorn `-w 1`, `Dockerfile:34`).
- **Objetivo:** `Nginx upstream` sobre `backend:5000` con `least_conn` (o `ip_hash`
  para afinidad de sesión) y healthcheck en `/api/v1/auth/health`. Alternativa:
  LB de nube (AWS ALB / GCP HTTP(S) LB).
- **Método recomendado para la división regional:** NO se necesita enrutar por
  región (la lógica vive en el backend vía `region_id`); basta escalar réplicas
  idénticas tras un LB. El enrutado por región solo aplica si se opta por
  **data planes físicos** (§6).

### 2.2 Escalado de la API

- gunicorn con eventlet se queda en **1 worker por contenedor** (requisito de
  Socket.IO con greenlets). Se escala **horizontalmente** (más réplicas), nunca
  `-w > 1`.
- Para que los eventos Socket.IO (chat, ofertas, notificaciones, chambas)
  funcionen entre réplicas es **obligatorio** `SOCKETIO_MESSAGE_QUEUE=redis://...`
  (ya documentado en `GUIA_DESPLIEGUE`; el `docker-compose.dev.yml` ya lo usa).
- Celery worker: `--concurrency=2` por réplica + `--autoscale` para crecer con la
  cola; Celery Beat en una sola instancia (no debe duplicarse).

### 2.3 Capa de datos (alta disponibilidad)

| Servicio | Hoy | Objetivo regional |
|---|---|---|
| PostgreSQL/PostGIS | 1 instancia (`postgis:16-3.4`) | **Patroni** (primario + 2 réplicas, etcd/consul) + **PgBouncer**; backups `pgBackRest`/`WAL-G` |
| Redis | 1 instancia | **Sentinel** (o servicio gestionado) — cache + MQ Socket.IO + broker Celery |
| MinIO | 1 nodo | **Modo distribuido** (4+ discos, erasure coding); **bucket por región** o prefijo `/region/<clave>/...` |

Índices que sostienen el scope regional (ya en migración `014_regiones` y modelos):
- `users.region_id` (`ix_users_region_id`)
- Los filtros regionales se hacen por subconsultas sobre `users.id` (ver
  `app/routes/admin.py`, `_region_user_ids`); con volumen, valorar **particionado
  por región** en las tablas calientes (`solicitudes`, `tickets`, `contracts`).

### 2.4 Control plane (global)

- Los recursos **globales** (no regionales) son: superadmin, `system_configs`,
  `feature_flags`, `audit_logs`, `legal/tyc`, `ai/params`, catálogo `regions`.
- En la topología centralizada viven en la misma DB; la separación es conceptual.
- Si se migra a data planes físicos (§6), el control plane queda en un **clúster
  global aparte** y solo las entidades regionales se replican por región.

### 2.5 Aislamiento y acceso del personal regional

- El RBAC regional ya impide que un admin/verificador/soporte vea otra región.
- Reforzamientos de infraestructura opcionales:
  - **Host/subdominio por región** del panel (p. ej. `admin-caribe.chambeapp.com`)
    → mismo LB, misma app; solo cambia la política.
  - **Políticas de red por región** (IP allowlist / VPN por equipo regional) para
    reducir superficie de ataque.
  - **Auditoría por región**: el log ya registra `actor_id`; añadir dimensión
    `region` del actor para alertas por región (SLA KYC/tickets).

### 2.6 Observabilidad

- Prometheus + Grafana con etiqueta `region` (métrica derivada de `region_id`
  del actor o de la solicitud).
- Logs centralizados (Loki/ELK) con `region` para debugging por región.
- Alertas por SLA: revisión KYC y tickets pendientes por región (dashboards).

---

## 3. Mapa de componentes → infraestructura

| Componente de código | Infraestructura |
|---|---|
| `app/auth/region.py` (`region_scope_id`) | Lógica de scope — no requiere infra |
| `app/services/region.py` (derivación de región) | Idem (app layer) |
| `POST /superadmin/regions/reindex` | App layer + DB (job bajo demanda) |
| Socket.IO (chat/ofertas/notificaciones) | Redis MQ + réplicas |
| Celery (cascada, ML, reindex, alerts) | Redis broker + worker/beat |
| MinIO (evidencias 360°, KYC, portafolio) | MinIO distribuido + bucket por región |
| `audit_logs` | Control plane (global) |
| Panel admin (`Chambeapp_admin_frontend`) | Estático + Nginx → LB → backend |

---

## 4. Roadmap de infraestructura (gradual)

| Etapa | Alcance | Riesgo que cubre |
|---|---|---|
| **0 — Actual** | Instancia única (1 backend, 1 Postgres, 1 Redis, 1 MinIO) | MVP funcional |
| **1 — HA + escala** | Nginx LB + 2-3 réplicas backend + Redis MQ; Patroni (Postgres HA) + PgBouncer; Redis Sentinel; MinIO distribuido | Caída de un nodo; carga regional creciente |
| **2 — Regional operativo** | Read-replicas para stats/admin; buckets/prefijos MinIO por región; observabilidad por región; políticas de red por equipo regional | Latencia de reports; auditoría regional |
| **3 — Aislamiento físico (opcional)** | Data planes por región (DB/esquema por región + router) si se exige residencia de datos o aislamiento regulatorio | Cumplimiento / aislamiento estricto |

> Recomendación: implementar Etapas 1-2. La Etapa 3 solo si un socio/regulador
> (p. ej. tratamiento de datos personales Ley 1581 con residencia) lo exige;
> es un cambio mayor de arquitectura (enrutado + sincronización cross-región).

---

## 5. Configuración de referencia (fragmentos)

### 5.1 Nginx LB (mínimo)

```nginx
upstream chambeapp_backend {
    least_conn;
    server backend:5000 max_fails=3 fail_timeout=30s;
    server backend:5001 max_fails=3 fail_timeout=30s;   # 2ª réplica
}

server {
    listen 443 ssl;
    server_name app.chambeapp.com admin.chambeapp.com;

    location /api { proxy_pass http://chambeapp_backend; proxy_set_header Host $host; }
    location /socket.io {
        proxy_pass http://chambeapp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 5.2 Replicas en docker-compose

```yaml
# Referencia — no reemplaza docker-compose.yml actual
services:
  backend:
    build: .
    command: ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "wsgi:app"]
    env_file: .env
    deploy:
      replicas: 3
      update_config:
        order: start-first
        failure_action: rollback
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/v1/auth/health')"]
      interval: 10s
      retries: 3
  lb:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: ["./nginx-lb.conf:/etc/nginx/conf.d/default.conf:ro"]
    depends_on: [backend]
```

> ⚠️ Con réplicas es **obligatorio** `SOCKETIO_MESSAGE_QUEUE` y **no** usar
> estado en disco local (la app es stateless; todo el estado vive en
> Postgres/Redis/MinIO — ya es así por diseño).

---

## 6. Centralizado (HA) vs físico por región

| Criterio | Centralizado con HA (recomendado) | Físico por región |
|---|---|---|
| Costo | Bajo (1 clúster) | Alto (N clústeres) |
| Complejidad | Solo LB + HA | Router regional + sincronización cross-región |
| Latencia | Homogénea (Colombia) | Mejor local, peor cross |
| Residencia de datos | No aislada | Sí (por región) |
| Aislamiento de fallos | Parcial (HA) | Total |
| Cambio al código | Ninguno | Alto (enrutado por `region_id`, contratos cross-región) |

**Decisión:** adoptar **centralizado con HA** (Etapas 1-2). La separación
regional se logra por **RBAC + scope de datos** (ya implementado) y se sostiene
con **LB + replicas + HA de Postgres/Redis/MinIO**.

---

*Definición de infraestructura — 2026-09-25. Ver también `GUIA_DESPLIEGUE.md`
(estado actual) y `RF_Division_Regional.md` (requerimientos).*