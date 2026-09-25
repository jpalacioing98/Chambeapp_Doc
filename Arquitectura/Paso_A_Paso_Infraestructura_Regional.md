# Paso a Paso — Infraestructura para la Conexión Regional e Identificación por Ubicación

> Guía ejecutable para definir y levantar la infraestructura que hace que las
> **regiones se conecten** entre sí y con los equipos regionales, usando la
> **identificación regional por ubicación** ya implementada en el backend.
>
> Referencias: `Arquitectura/Infraestructura_Regional.md` (definición),
> `Requerimientos/RF_Division_Regional.md` (requerimientos RF-70..RF-75),
> `diagramas/11_regiones.puml`, `diagramas/13_infraestructura_regional.puml`.
>
> Estado: guía — cada paso indica qué existe y qué hay que crear/configurar.

---

## 0. Contexto y modelo de conexión

**Cómo se conectan las regiones (modelo):**

- Las regiones **no** son aplicaciones separadas: todas se sirven desde el mismo
  backend, y la **identificación por ubicación** decide a qué región pertenece
  cada usuario. Un `Region` (catálogo) tiene `clave`, `nombre` y `departamentos`.
- `users.region_id` apunta al `Region` de cada usuario. El personal regional
  (admin/verificador/soporte) queda atado a su región y su operación se filtra
  por ella (`region_scope_id`).
- La **conexión entre regiones** es lógica: contratos y disputas con partes de
  dos regiones se asignan a la región del **solicitante** (regla anti doble-conteo).
- La infraestructura solo necesita **escalar y mantener disponible** ese backend
  único, y opcionalmente aislar tráfico/datos por región (Etapa 3).

```
Usuario con ubicación "Valledupar, Cesar"
   └─ match_region_from_text() → Region "caribe"
   └─ users.region_id = <id caribe>
   └─ Admin/Verificador/Soporte de caribe gestionan sus operaciones
```

---

## Paso 1 — Identificación regional por ubicación (lógica)

La identificación ya está implementada en `app/services/region.py`:

| Pieza | Endpoint / código | Estado |
|---|---|---|
| Catálogo de regiones | `GET /api/v1/regions` | ✅ implementado |
| Detección por ubicación | `GET /api/v1/regions/detectar?ubicacion=...` | ✅ implementado |
| Asignación al actualizar perfil | `PUT /users/me/profile` (campo `zona`) | ✅ implementado |
| Asignación al crear solicitud | `POST /solicitudes/` (campo `ubicacion`) | ✅ implementado |
| Reindexación masiva | `POST /superadmin/regions/reindex` | ✅ implementado |
| Scope en operaciones | `region_scope_id` en admin/kyc/tickets | ✅ implementado |
| Migración + seed | `014_regiones`, `app/data/seed_regions.py` | ✅ implementado |

### Qué debe hacer el equipo (config/calidad de datos)

1. **Garantizar que exista el dato de ubicación**: el matcher compara el texto
   de `zona`/`ubicacion` contra los `departamentos` de cada región.
   - El frontend debe pedir siempre `zona` o `ubicacion` (p. ej. "ciudad, departamento").
   - Si el dato viene como **coordenadas** (lat/long), añadir **geocodificación
     inversa** (Mapbox/Google/OpenStreetMap Nominatim) para obtener el departamento
     antes de `match_region_from_text`.
2. **Ejecutar el reindex** tras activar el feature: `POST /superadmin/regions/reindex`
   asigna región a los usuarios públicos que ya tienen `zona` o solicitudes con
   `ubicacion` (no toca personal interno).
3. **Auditar usuarios sin región**: consultar `users` con `region_id IS NULL` y
   decidir asignación manual (o depuración) para que no queden "huérfanos" que
   ningún admin regional vea.

> **Infraestructura asociada**: ninguno extra — solo calidad de datos y
> opcionalmente un servicio de geocodificación (etapa 2 del roadmap).

---

## Paso 2 — Definir la topología (cómo se conectan las regiones)

Elegir entre **centralizado con HA** (recomendado) y **físico por región**:

| | Centralizado con HA | Físico por región |
|---|---|---|
| Modelo de conexión | 1 backend + 1 DB, todas las regiones | 1 stack por región + control plane global |
| Router | No necesario (scope lógico) | Sí (router por `region_id`) |
| Costo | Bajo | Alto |
| Residencia de datos | No aislada | Aislada |

**Decisión por defecto:** centralizado con HA. Solo migrar a físico si un
regulador exige residencia de datos (Ley 1581) o aislamiento total.

Documentar la decisión en `Arquitectura/Infraestructura_Regional.md` §6.

---

## Paso 3 — Balanceador de carga (conectar todos los clientes al backend)

Objetivo: un único punto de entrada que reparta tráfico a las réplicas.

1. Crear `nginx-lb.conf` con `upstream` sobre las réplicas:

```nginx
upstream chambeapp_backend {
    least_conn;
    server backend:5000 max_fails=3 fail_timeout=30s;
    server backend:5001 max_fails=3 fail_timeout=30s;
    server backend:5002 max_fails=3 fail_timeout=30s;
}
server {
    listen 80; server_name app.chambeapp.com admin.chambeapp.com;
    location /api { proxy_pass http://chambeapp_backend; proxy_set_header Host $host; }
    location /socket.io {
        proxy_pass http://chambeapp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

2. Añadir el servicio `lb` (nginx) y escalar `backend` en `docker-compose.yml`:

```yaml
services:
  backend:
    build: .
    command: ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "wsgi:app"]
    env_file: .env
    deploy:
      replicas: 3
      update_config: { order: start-first, failure_action: rollback }
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

3. Levantar: `docker compose up -d --build` y verificar:
   `curl http://localhost/api/v1/auth/health` responde desde distintas réplicas.

> ⚠️ Con varias réplicas es **obligatorio** `SOCKETIO_MESSAGE_QUEUE=redis://...`
> (Paso 5) o los eventos de chat/ofertas/notificaciones se repartirán mal.

---

## Paso 4 — Réplicas de API y eventos en tiempo real

1. Mantener **1 worker por contenedor** (eventlet + greenlets). Nunca `-w > 1`.
2. Definir en `.env`: `SOCKETIO_MESSAGE_QUEUE=redis://redis:6379/0`.
3. Escalar Celery worker por réplica: `--concurrency=2 --autoscale=4,2`.
4. **Celery Beat en 1 sola instancia** (no duplicar tareas programadas: cascada,
   `check_ml_health`, etc.).

---

## Paso 5 — Alta disponibilidad de la base de datos (PostgreSQL)

Objetivo: el dato regional nunca se pierde y las réplicas leen/escriben con HA.

1. **Patroni** (primario + 2 réplicas + etcd/consul) sobre la imagen `postgis:16-3.4`
   para conservar PostGIS (clave para las geocercas del motor de recomendación).
2. **PgBouncer** como pooler de conexiones (evita agotar conexiones con réplicas).
3. Backups: `pgBackRest` / `WAL-G` con retención.
4. **Índices regionales** (ya creados por la migración `014_regiones`):
   - `users.region_id` (`ix_users_region_id`)
   - Añadir índices compuestos cuando el volumen lo pida:
     `solicitudes(solicitante_id, creado_en)`, `tickets(user_id, status)`,
     `contracts(solicitante_id, estado)`.
5. (Opcional, escala alta) **Particionar por región** las tablas calientes:
   `solicitudes`, `tickets`, `contracts` por `region` derivada del owner.

```sql
-- Referencia: particionamiento por lista de región (cuando aplique)
-- CREATE TABLE solicitudes_part ... PARTITION BY LIST (region_id);
```

---

## Paso 6 — Redis con alta disponibilidad

Redis sostiene 3 cosas: **cache**, **broker Celery** y **Socket.IO MQ**.

- **Opción A (docker):** Redis Sentinel (1 primary + 2 replicas + 3 sentinel).
- **Opción B (gestionado):** ElastiCache / Upstash / Redis Cloud.

El backend solo necesita la URL; para Sentinel usar
`redis://sentinel:26379?sentinel=...` según driver (`redis` + `socketio`).

---

## Paso 7 — MinIO distribuido + buckets por región

Almacena evidencias 360°, documentos KYC, portafolio y foto de perfil.

1. **Modo distribuido** (4+ discos / 2+ nodos, erasure coding) en lugar de
   `minio/minio server /data`.
2. **Organización por región**: bucket `chambeapp-portfolio` con prefijo
   `/region/<clave>/...` (p. ej. `/region/caribe/evidencias/...`).
   - O buckets dedicados por región si se exige aislamiento físico.
3. Conservar los healthchecks existentes (live/live) y los volúmenes con backup.

---

## Paso 8 — Aislamiento del acceso del personal regional

La RBAC regional ya limita qué ve cada rol. Reforzamientos opcionales de infra:

1. **Subdominio del panel por región**: `admin-caribe.chambeapp.com` → mismo LB
   (el RBAC filtra; el subdominio solo organiza acceso/política).
2. **Políticas de red por equipo regional**: IP allowlist o VPN por región
   (WAF/CGNAT) para reducir superficie.
3. **Usuarios internos con región** siempre asignada (ver Paso 1.3) para que
   nadie quede con acceso global accidental.

---

## Paso 9 — Observabilidad por región

1. Exportar la dimensión **`region`** en métricas (Prometheus) y logs (Loki/ELK):
   - Del `region_id` del actor (staff) o del owner (solicitudes/contratos).
2. Dashboards por región:
   - **SLA KYC**: pendientes por región y tiempo de revisión.
   - **SLA tickets**: abiertos por región y tiempo de respuesta.
   - **Disputas abiertas** por región.
   - **Ingresos y contratos** por región (recordar: propiedad del solicitante —
     sin doble conteo).
3. Alertas (p. ej. > N KYC pendientes en una región durante M horas).

---

## Paso 10 — Verificación end-to-end por región

Checklist para confirmar que las regiones "se conectan" correctamente:

1. **Identificación por ubicación:**
   - `GET /api/v1/regions` → devuelve las 5 regiones.
   - `GET /api/v1/regions/detectar?ubicacion=Valledupar, Cesar` → `caribe`.
   - Crear solicitud con `ubicacion` → el solicitante queda con `region_id`.
2. **Aislamiento por rol:**
   - Verificador de Caribe ve solo la cola KYC de Caribe.
   - Soporte de Caribe gestiona solo tickets de Caribe.
   - Admin de Caribe no ve usuarios/contratos de Andina.
3. **Doble conteo:** contrato entre solicitante (Caribe) y proveedor (Andina)
   → visible y contabilizado solo en Caribe (stats regionales).
4. **Superadmin:** ve todas las regiones.
5. **Reindex:** `POST /superadmin/regions/reindex` reasigna sin tocar staff.

---

## Paso 11 — Rollout y rollback

1. **Rollout gradual:** activar el scope regional por feature flag si se quiere
   (el código actual aplica scope siempre que el actor tenga `region_id`; para
   retrocompatibilidad, staff sin región sigue viendo global).
2. **Rollback:** 
   - De réplicas/LB: `docker compose up -d --scale backend=1` (vuelve a 1 réplica).
   - De HA de DB: retornar al primario original (Patroni `switchover` / failover).
   - De identificación por ubicación: `assign_region` no reasigna si no cambia;
     para revertir asignaciones, limpiar `region_id` y no reindexar.

---

## Checklist final

- [ ] Datos de ubicación (`zona`/`ubicacion`) presentes y con departamento.
- [ ] `POST /superadmin/regions/reindex` ejecutado.
- [ ] `GET /api/v1/regions` y `/detectar` verificados.
- [ ] Nginx LB con healthcheck sobre réplicas.
- [ ] `SOCKETIO_MESSAGE_QUEUE` configurado (réplicas + Socket.IO).
- [ ] PostgreSQL HA (Patroni + PgBouncer) y backups.
- [ ] Redis HA (Sentinel o gestionado).
- [ ] MinIO distribuido con prefijo/bucket por región.
- [ ] Políticas de red del personal regional (opcional).
- [ ] Dashboards/alertas por región.
- [ ] Verificación end-to-end (Paso 10) en al menos 2 regiones.

---

*Paso a paso — 2026-09-25. Complementa `Infraestructura_Regional.md` y
`GUIA_DESPLIEGUE.md`.*