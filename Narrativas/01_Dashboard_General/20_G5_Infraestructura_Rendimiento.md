# Narrativa: Infraestructura y Rendimiento (Transversal)

**KPIs Asociados:** G5.1–G5.8  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Transversal — Infraestructura y Rendimiento

---

## La Historia

La **infraestructura** es **el suelo sobre el que camina ChambeApp**. Si **latencia API p95 > 500ms**, los usuarios abandonan. Si **error rate 5xx > 1%**, la confianza se rompe. Si **cola Celery > 1000**, las notificaciones no llegan, los reportes no se generan, la limpieza de monedas no ocurre. El **disco PostgreSQL > 80%** es **el reloj de arena**: sin espacio, la BD se para y la plataforma muere.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Latencia API p95 (G5.1)** | < 200ms (críticos) | 200–500ms | > 500ms | Scale workers / cache / query optimization / read replicas |
| **Error Rate 5xx (G5.2)** | < 0.1% | 0.1–1% | > 1% | **Rollback deploy** / circuit breaker / fix bug / hotfix |
| **Throughput RPS (G5.3)** | Estable + headroom 3x | Cayendo / inestable | < 50% capacity | Scale horizontal / query optimization / cache |
| **Cola Celery (G5.4)** | < 100 tareas/cola | 100–1000 | > 1000 | Scale workers / purga tareas viejas / prioridad crítica |
| **DB Conexiones (G5.5)** | < 60% max_connections | 60–80% | > 80% | Connection pooling / read replicas / max_connections++ |
| **Cache Hit Rate Redis (G5.6)** | > 90% | 80–90% | < 80% | Revisar TTL / keys pattern / memoria Redis |
| **Almacenamiento MinIO (G5.7)** | < 70% capacidad | 70–85% | > 85% | Lifecycle policy / compresión / archive frío / disco++ |
| **Disco PostgreSQL (G5.8)** | < 60% | 60–80% | > 80% | **Urgente**: archive particiones / compresión / disco++ / partition pruning |

---

## Segmentación Obligatoria

- **Por endpoint crítico:** `/chambas` / `/solicitudes` / `/ai/recommend` / `/wallet` / `/chat` / `/auth`
- **Por cola Celery:** `default` / `notifications` / `ml_ranking` / `wallet_cleanup` / `cascade_geo`
- **Por tabla BD:** `contracts` / `chambas` / `wallet_transactions` / `audit_logs` / `recommendation_log`
- **Por bucket MinIO:** `evidencias` / `kyc` / `panoramas360` / `avatars`

---

## Palancas de Intervención

1. **Auto-scale horizontal** → CPU > 70% 5min → nuevo worker / pod (K8s HPA / ASG)
2. **Circuit breaker** → Error rate 5xx > 1% 5min → OPEN circuit → fallback estático / mantenimiento
2. **Read replicas** → Lecturas → réplicas / Escrituras → primary (pgBouncer pooling)
2. **Partition pruning** → `contracts` / `chambas` / `wallet_transactions` particionados por mes
2. **Lifecycle MinIO** → `evidencias` > 2 años → Glacier / `panoramas360` > 1 año → comprimido WebP 50%
2. **Partition pruning audit_logs** → Particionado por mes / retención 7 años / cold storage S3 Glacier

---

## Riesgo Si Se Ignora

- **Latencia p95 > 500ms** → Usuarios abandonan → CTR 0% → conversión 0% → revenue 0
- **Error 5xx > 1%** → Confianza rota → churn → reputación / legal / inversores
- **Cola Celery > 10k** → Notificaciones no llegan / reportes no generan / monedas no vencen → caos operativo
- **Disco > 90%** → BD se para → **plataforma muerta** → restore backup horas → SLA roto

---

## Métricas Complementarias

- **B1.3 (Latencia ML)** → Subconjunto latencia API
- **E1.4 (Latencia Socket.IO)** → Subconjunto latencia API
- **E2.3 (Push Delivery)** → Cola `notifications` → Push delivery
- **D6.7 (Monedas Vencidas)** → Job `wallet_cleanup` → Cola `wallet_cleanup`

---

## Alineación Estándares

- **RNF-04** — Rendimiento (búsqueda ≤ 2s, 3D ≤ 5s, API p95 < 200ms)
- **RNF-05** — Disponibilidad ≥ 99% horario pico
- **RNF-06** — Confiabilidad Pagos (> 98% éxito)
- **ODS 9.c** — Infraestructura tecnológica resiliente

---

## Plantilla de Decisión

> **Si ahora:** Error rate 5xx > 1% **O** Disco PostgreSQL > 85% **O** Cola Celery > 5000  
> **Entonces:** 1) **Rollback deploy** si deploy reciente 2) Scale workers / disco++ 3) Alerta P1 Slack + PagerDuty 4) Post-mortem < 2h  
> **Owner:** DevOps Lead / Backend Lead  
> **Revisión:** Tiempo real (alertas) + Cada 15min en incidente