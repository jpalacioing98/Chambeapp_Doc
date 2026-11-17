# Narrativas Construibles con el Dashboard de Métricas — ChambeApp

> **Fuente:** Dashboard `/superadmin/metricas` (80+ métricas, 11 tabs, tiempo real)
> **Audiencia:** SuperAdmin, Directivos, Inversionistas, Equipo de Producto, Auditoría
> **Fecha:** 2026-11-15

---

## Índice de Narrativas

1. [Narrativa Estratégica: Salud Global del Negocio](#1-narrativa-estratégica-salud-global-del-negocio)
2. [Narrativa de Crecimiento: Adquisición y Activación de Usuarios](#2-narrativa-de-crecimiento-adquisición-y-activación-de-usuarios)
3. [Narrativa de Mercado: Liquidez y Matching Oferta-Demanda](#3-narrativa-de-mercado-liquidez-y-matching-oferta-demanda)
4. [Narrativa de Ingresos: Monetización por Cobros en Monedas](#4-narrativa-de-ingresos-monetización-por-cobros-en-monedas)
5. [Narrativa de Producto: Adopción y Efectividad del Motor IA/ML](#5-narrativa-de-producto-adopción-y-efectividad-del-motor-iaml)
6. [Narrativa de Confianza: KYC, TrustScore y Formalización](#6-narrativa-de-confianza-kyc-trustscore-y-formalización)
7. [Narrativa Operativa: Eficiencia de Contratos y Anuncios](#7-narrativa-operativa-eficiencia-de-contratos-y-anuncios)
8. [Narrativa Económica: Economía Virtual de Monedas](#8-narrativa-económica-economía-virtual-de-monedas)
9. [Narrativa Técnica: Salud de Infraestructura y SLA](#9-narrativa-técnica-salud-de-infraestructura-y-sla)
10. [Narrativa de Gobernanza: Cumplimiento, Seguridad y Riesgo](#10-narrativa-de-gobernanza-cumplimiento-seguridad-y-riesgo)
11. [Narrativa por Cohorte: Comportamiento por Rol de Usuario](#11-narrativa-por-cohorte-comportamiento-por-rol-de-usuario)
12. [Narrativa Temporal: Tendencias, Estacionalidad y Anomalías](#12-narrativa-temporal-tendencias-estacionalidad-y-anomalías)
13. [Narrativa de Alerta: Detección Temprana de Problemas Críticos](#13-narrativa-de-alerta-detección-temprana-de-problemas-críticos)
14. [Narrativa de Inversionista: Unidad Económica y Escalabilidad](#14-narrativa-de-inversionista-unidad-económica-y-escalabilidad)
15. [Narrativa de Auditoría: Trazabilidad y Evidencia Forense](#15-narrativa-de-auditoría-trazabilidad-y-evidencia-forense)

---

## 1. Narrativa Estratégica: Salud Global del Negocio

### ¿Qué cuenta?
Una visión ejecutiva de "¿qué tan viva y sana está la plataforma hoy?" combinando vitalidad técnica, adopción de usuarios y generación de valor.

### Métricas clave
- **Health Score** (0–100): composite de uptime, latencia, error rate, cola KYC, violaciones regionales
- **Uptime 30d** (%): disponibilidad real vs SLA 99.9%
- **MAU / DAU**: usuarios activos mensuales/diarios
- **Contratos firmados hoy**: motor de actividad transaccional
- **Monedas en circulación**: profundidad de la economía virtual

### Preguntas que responde
- ¿La plataforma está operativa y confiable?
- ¿Hay tracción real de usuarios?
- ¿El core business (contratos) está generando actividad?
- ¿Hay señales de alerta sistémica (error rate, escrow, regional)?

### Acciones derivadas
- Health Score < 70 → activar war room técnico
- MAU cayendo 3+ días → revisar onboarding / adquisición
- Contratos = 0 por 24h → revisar matching / cobros / KYC

---

## 2. Narrativa de Crecimiento: Adquisición y Activación de Usuarios

### ¿Qué cuenta?
El embudo desde registro → activación → retención, segmentado por rol (PDS, Solicitante, Merchant).

### Métricas clave
- **MAU / DAU** totales y por rol
- **Ratio PDS / Solicitante**: balance oferta/demanda (target 0.5–2.0)
- **Activación D1/D7/D30**: % que completan onboarding
- **Distribución por región**: penetración geográfica
- **2FA adoption**: madurez de seguridad por usuario

### Preguntas que responde
- ¿Estamos creciendo en el lado correcto (oferta vs demanda)?
- ¿Los usuarios entienden el valor en la primera semana?
- ¿Valledupar vs otras regiones: dónde enfocar marketing?
- ¿La seguridad (2FA) fricciona el onboarding?

### Acciones derivadas
- Ratio PDS/Solicitante < 0.3 → campaña captación PDS
- Activación D7 < 40% → rediseñar onboarding / simplificar KYC
- Crecimiento concentrado en 1 región → expandir geográficamente

---

## 3. Narrativa de Mercado: Liquidez y Matching Oferta-Demanda

### ¿Qué cuenta?
¿Qué tan eficiente es el mercado para conectar quien necesita con quien ofrece? Velocidad, profundidad y calidad del match.

### Métricas clave
- **Solicitudes publicadas/día** + **Ofertas por solicitud** (promedio y distribución)
- **Tasa de postulación** (% solicitudes con ≥1 oferta)
- **Tiempo medio primera oferta** (por urgencia: hoy/semana/flexible)
- **CTR Recomendaciones ML** + **Conversión Recomendación → Contrato**
- **Cobertura geoespacial** (% solicitudes con PDS en radio)

### Preguntas que responde
- ¿Las solicitudes encuentran ofertas rápido?
- ¿El ML realmente mejora el matching vs heurística?
- ¿Hay "desiertos" geográficos sin PDS?
- ¿La urgencia "hoy" se resuelve o se frustra?

### Acciones derivadas
- Ofertas/solicitud < 1.5 → incentivar PDS a ofertar / revisar precios
- Tiempo primera oferta "hoy" > 4h → alerta operativa / notificar PDS cercanos
- CTR ML < 5% → revisar ranking / explicabilidad / feature flag
- Cobertura geo < 70% → reclutar PDS en zonas frías

---

## 4. Narrativa de Ingresos: Monetización por Cobros en Monedas

### ¿Qué cuenta?
La plataforma no cobra comisión sobre el trabajo (pago directo entre partes). Su revenue son **cobros en monedas virtuales** al firmar contratos y publicar anuncios, más venta de paquetes de monedas.

### Métricas clave
- **Cobros Solicitante hoy** (count + monedas)
- **Cobros Proveedor hoy** (count + monedas)
- **Anuncios publicados hoy** + **monedas cobradas**
- **Anuncios reactivados hoy** + **monedas cobradas**
- **Paquetes vendidos hoy** + **ingresos COP**
- **Monedas gastadas hoy** (breakdown: contratos vs anuncios)

### Preguntas que responde
- ¿Cuánto revenue real (COP) genera la plataforma hoy?
- ¿Qué lado del mercado paga más (solicitante vs proveedor)?
- ¿Los anuncios (merchant) son canal creciente?
- ¿El precio de la moneda (COP/moneda) es óptimo?
- ¿Hay fuga: usuarios sin monedas que no pueden firmar?

### Acciones derivadas
- Revenue/day < target → ajustar `pct_contrato` o `precio_moneda_cop` (superadmin)
- Cobros solicitante ≠ proveedor → revisar simetría / percepción de valor
- Paquetes vendidos cayendo → lanzar promo / nuevo paquete
- "Monedas insuficientes" errors ↑ → reducir `min_monedas_contrato` / regalar promo

---

## 5. Narrativa de Producto: Adopción y Efectividad del Motor IA/ML

### ¿Qué cuenta?
El motor de recomendación en 2 etapas (retrieval + ranking) con feature flag `ml_ranking_enabled`. ¿Está activo? ¿Mejora resultados? ¿Los usuarios confían?

### Métricas clave
- **ML Ranking**: Activo/Inactivo + % uptime 30d
- **Latencia p95** (target < 200ms)
- **Tasa Fallback** (ML → heurística) (target < 10%)
- **CTR Recomendaciones** (% clic en "Ofertar" tras ver recomendación)
- **Conversión Recomendación → Contrato** (funnel completo)
- **Explicabilidad Score Promedio** (transparencia algorítmica NFR)
- **Zero results %** en búsquedas

### Preguntas que responde
- ¿El ML está encendido y estable?
- ¿Es lo suficientemente rápido para UX fluida?
- ¿Los usuarios hacen clic en lo que recomienda?
- ¿Esos clics se convierten en contratos reales?
- ¿La explicación del score genera confianza?

### Acciones derivadas
- Fallback > 10% → investigar errores ranking / modelos
- Latencia p95 > 200ms → optimizar retrieval / cache / hardware
- CTR < 3% → A/B test UI de recomendaciones / diversificar
- Conversión < 1% → revisar ranking features / cold start
- Explicabilidad < 0.6 → mejorar features interpretables / UI

---

## 6. Narrativa de Confianza: KYC, TrustScore y Formalización

### ¿Qué cuenta?
El camino desde usuario anónimo → verificado → confiable → experto. Base de la formalización progresiva (Ley 1429/2010, Ley 1562/2012, Ley 527/1999).

### Métricas clave
- **KYC Completion Rate por rol** (PDS 11 docs, Solicitante 8, Merchant 9)
- **Documentos pendientes revisión** (cola verificadores)
- **Tiempo promedio revisión KYC** (target < 24h)
- **Tasa aprobación KYC** por tipo documento
- **TrustScore distribución**: Nuevo / Confiable / Verificado / Experto
- **TrustScore promedio** + **componentes** (KYC 25%, Rating 25%, Contratos 20%, Portfolio 15%, Referidos 15%)
- **PDS con Portfolio aprobado > 0**
- **Certificados de ingresos generados** (Ley 527)

### Preguntas que responde
- ¿El KYC es cuello de botella o fluye?
- ¿Los verificadores dan abasto?
- ¿El TrustScore diferencia realmente calidad?
- ¿Los PDS "Experto" ganan más contratos?
- ¿La certificación de ingresos se usa para bancarización?

### Acciones derivadas
- Pendientes > 50 → contratar más verificadores / auto-aprobar docs simples
- Tiempo revisión > 48h → SLA automático / escalamiento
- TrustScore avg < 0.4 → campaña "completa tu perfil / portfolio"
- Certificados = 0 → educar PDS / simplificar descarga

---

## 7. Narrativa Operativa: Eficiencia de Contratos y Anuncios

### ¿Qué cuenta?
El ciclo de vida operativo: publicación → negociación → firma → ejecución (6 hitos) → pago → calificación. Y el canal Merchant (anuncios).

### Métricas clave
**Contratos:**
- **Contratos firmados hoy** + **Conversión firma bilateral** (%)
- **Tiempo medio firma** (creación → ambas firmas)
- **Distribución estados Chamba** (FSM 6 hitos)
- **Tasa finalización exitosa** (% finalizada / total activas)
- **Tiempo por hito** (activación → inicio → cierre → validación → liquidación → fin)
- **Evidencias fotográficas completas** (% entrada + salida)
- **Calificación promedio** + **Tasa calificación bilateral**

**Anuncios (Merchant):**
- **Anuncios publicados/reactivados hoy**
- **Postulaciones por anuncio** (promedio)
- **Conversión Anuncio → Contrato** (modalidad "contrato")
- **Top 10 Merchants por revenue**

### Preguntas que responde
- ¿Los contratos se firman rápido o se estancan en negociación?
- ¿El FSM 6 hitos se respeta o se saltean pasos?
- ¿Las evidencias se suben realmente? (cumplimiento)
- ¿Los anuncios generan contratos reales o solo contactos?
- ¿Qué merchants son power users?

### Acciones derivadas
- Conversión firma < 60% → simplificar firma / notificaciones push
- Tiempo hito "inicio obra" > 48h → recordatorio automático PDS
- Evidencias < 80% → bloquear calificación sin evidencias / UX obligatoria
- Anuncio→Contrato < 5% → revisar modalidad "contacto" vs "contrato" / UX

---

## 8. Narrativa Económica: Economía Virtual de Monedas

### ¿Qué cuenta?
Las monedas son la "moneda interna" de la plataforma. Se compran (paquetes), se ganan (completar contratos = 10 monedas), se gastan (firmar contratos, publicar anuncios), vencen (promocionales). No son cripto, son closed-loop.

### Métricas clave
- **Monedas en circulación** (total + breakdown: compradas / promocionales / ganadas)
- **Monedas ganadas hoy** (PDS ×10 por completado)
- **Monedas gastadas hoy** (breakdown: contratos vs anuncios)
- **Paquetes vendidos hoy** + **Ingresos COP** + **Paquete top**
- **Monedas por vencer (7d)** (alertas de vencimiento promocionales)
- **Saldo total COP en billeteras** (revenue real disponible para retiro)

### Preguntas que responde
- ¿La economía es sostenible (entrada ≈ salida) o hay inflación/deflación?
- ¿Los PDS ganan suficientes monedas para seguir firmando sin comprar?
- ¿Los paquetes se venden o los usuarios compran monedas sueltas?
- ¿El vencimiento de promocionales genera churn o reactivación?
- ¿El precio COP/moneda refleja valor percibido?

### Acciones derivadas
- Monedas ganadas < gastadas → reducir `min_monedas_contrato` / aumentar recompensa completado
- Paquetes vendidos cayendo → test precio / nuevo paquete / bundle
- Vencimiento masivo → notificar "tus monedas vencen en 3 días" / extender
- Inflación (circulación ↑ sin revenue) → auditar fuentes "ganadas" / promo

---

## 9. Narrativa Técnica: Salud de Infraestructura y SLA

### ¿Qué cuenta?
La plataforma como sistema técnico: disponibilidad, latencia, errores, capacidad. Base para confianza de usuarios y SLA internos.

### Métricas clave
- **Latencia API p50/p95/p99** por endpoint crítico (`/chambas`, `/solicitudes`, `/ai/recommend`, `/wallet`, `/chat`)
- **Error Rate 5xx** % (target < 1%)
- **Throughput (RPS)** total y por blueprint
- **Celery Queue Lag** por cola (`default`, `notifications`, `ml_ranking`, `wallet_cleanup`)
- **DB Conexiones Activas / Max** (%)
- **Cache Hit Rate Redis** (%)
- **Almacenamiento MinIO** (GB) + proyección
- **Disco PostgreSQL** (%)

### Preguntas que responde
- ¿La API responde dentro de SLA (<200ms p95)?
- ¿Hay endpoints degradados silenciosamente?
- ¿Las colas Celery procesan a tiempo (notificaciones, ML, limpieza)?
- ¿La BD tiene cabeza para crecer 3x?
- ¿MinIO costos bajo control?

### Acciones derivadas
- p95 > 500ms en `/ai/recommend` → scale ML workers / cache embeddings
- Error rate 5xx > 1% → rollback deploy / fix bug / circuit breaker
- Queue lag > 1000 → scale Celery workers / optimizar tasks
- DB conexiones > 80% → connection pooling / read replicas
- MinIO > 80% → lifecycle policy / compress / archive

---

## 10. Narrativa de Gobernanza: Cumplimiento, Seguridad y Riesgo

### ¿Qué cuenta?
Los guardrails no negociables: scoping regional (ADR-3), revocación JWT (ADR-2), kill switches, auditoría forense inmutable, cero tolerancia a contratos cruzados entre regiones.

### Métricas clave
- **Kill Switches activos** (`ml_ranking_enabled`, `maintenance_mode`, `payments_enabled`, `kyc_required`)
- **Cambios config/día** (auditoría)
- **Logs auditoría/día** + **Acciones críticas** (user.status, contract.moderate, payment.refund, kyc.approve)
- **Violaciones Regionales** (contratos cruzados región) — **CERO TOLERANCIA**
- **Revocaciones JWT/día** (role_version increments)
- **Intentos login fallidos** (brute force detection)
- **Cuentas suspendidas/baneadas**
- **Integridad referencial BD** (job nocturno)

### Preguntas que responde
- ¿Todos los kill switches están en posición segura?
- ¿Hay actividad administrativa anómala (config changes spikes)?
- **¿Algún contrato cruzó regiones?** (P1 incident inmediato)
- ¿Tokens revocados por cambios de rol/estado funcionan?
- ¿Ataques de fuerza bruta detectados/mitigados?

### Acciones derivadas
- **Violación regional > 0** → INCIDENTE P1 INMEDIATO: bloquear, auditar, notificar legal
- Kill switch `payments_enabled` OFF → investigar por qué / rollback
- Config changes > 50/día sin ticket → investigar admin rogue
- Brute force > 10/min/IP → WAF block / rate limit hardening
- Integridad BD FAIL → maintenance window urgente / repair

---

## 11. Narrativa por Cohorte: Comportamiento por Rol de Usuario

### ¿Qué cuenta?
Cada rol tiene journey, métricas y dolores distintos. Agregar todo oculta patrones.

### Cohortes y sus narrativas

| Rol | Métricas Propias | Preguntas Clave |
|-----|------------------|-----------------|
| **PDS (Prestador)** | TrustScore, contratos completados, monedas ganadas/gastadas, rating, portfolio, tiempo por hito, evidencias | ¿Los PDS expertos ganan más? ¿Completan hitos a tiempo? ¿Tienen monedas para firmar? |
| **Solicitante** | Solicitudes publicadas, ofertas recibidas, primera oferta tiempo, contratos firmados, pagos confirmados, calificaciones dadas | ¿Reciben ofertas rápido? ¿Firman sin fricción? ¿Confirman pago y califican? |
| **Merchant/Negocio** | Anuncios publicados, postulaciones, conversión a contrato, revenue, KYC aprobado | ¿Los anuncios generan contratos? ¿Reactivan? ¿Valen la pena los cobros? |
| **Verificador** | KYC pendientes, tiempo revisión, tasa aprobación, docs tipo | ¿Dan abasto? ¿Consistentes? ¿Cuellos de botella por tipo doc? |
| **Soporte** | Disputas abiertas, tickets, chats bloqueados, tiempo resolución | ¿Disputas escalan? ¿Tickets resueltos < SLA? |
| **Admin (Regional)** | Usuarios región, KYC cola, disputas, contratos, métricas scoped | ¿Su región sana? ¿Scoping respetado? |

### Acciones derivadas
- PDS sin monedas → regalar paquete promo "bienvenida"
- Solicitante sin ofertas → notificar PDS cercanos / relajar radio
- Merchant sin conversión → revisar anuncios / UX / precios
- Verificador saturado → auto-aprobar docs simples / más verificadores

---

## 12. Narrativa Temporal: Tendencias, Estacionalidad y Anomalías

### ¿Qué cuenta?
Las métricas no son estáticas. Su evolución en el tiempo revela ciclos, efectos de cambios, y alertas tempranas.

### Ventanas temporales estándar
- **Tiempo real** (30s): health, realtime, alertas
- **Intradía** (1h): contratos, cobros, búsquedas, KYC pendientes
- **Diaria** (24h): MAU, revenue, paquetes, monedas, errores
- **Semanal** (7d): tendencias, comparativas WoW
- **Mensual** (30d): cohortes, retention, growth accounting
- **Trimestral** (90d): strategic review, board deck

### Patrones a detectar
- **Estacionalidad**: fines de semana ↑ solicitudes hogar, lunes ↑ anuncios empleo
- **Efecto deploy**: error rate spike post-deploy → rollback automático
- **Efecto feature flag**: ML ON/OFF → CTR/conversión delta medible
- **Efecto promo**: paquetes en oferta → spike ventas → normalización
- **Drift silencioso**: latencia subiendo 5ms/día → capacity planning
- **Churn silencioso**: MAU plano pero DAU cayendo → engagement decay

### Herramientas
- Sparklines en cada KPI (7d/30d)
- Anomaly detection (z-score > 3) → alerta automática
- Comparativa WoW / MoM en tooltips
- Anotaciones automáticas: "Deploy v2.3.1", "ML enabled", "Promo Black Friday"

---

## 13. Narrativa de Alerta: Detección Temprana de Problemas Críticos

### ¿Qué cuenta?
El sistema de alertas automáticas del dashboard (panel derecho "Alertas Activas") que convierte métricas en acciones.

### Alertas configuradas (críticas → altas → medias)

| Alerta | Trigger | Severidad | Acción Automática | Acción Humana |
|--------|---------|-----------|-------------------|---------------|
| **Violación Regional** | `cross_region_contracts > 0` | 🔴 Crítica | Bloquear contrato, notificar legal | Investigar P1 |
| **Kill Switch Payments** | `payments_enabled = false` | 🔴 Crítica | Alerta Slack/PagerDuty | Verificar deploy / rollback |
| **Escrow / Saldo Bloqueado** | `locked_pct > 30%` | 🔴 Crítica | Dashboard badge rojo | Revisar disputas/chambas estancadas |
| **Error Rate 5xx** | `> 1%` sostenido 5min | 🔴 Crítica | Auto-alert + circuit breaker | On-call investiga |
| **Cola KYC** | `pending_review > 50` | 🟠 Alta | Notificar verificadores | Contratar / auto-aprobar |
| **Paquetes Inactivos** | `packages_active = 0` | 🟠 Alta | Alerta SuperAdmin | Publicar paquete base |
| **Monedas por Vencer** | `expiring_7d > 10,000` | 🟡 Media | Notificar usuarios push | Extender / comunicar |
| **ML Fallback** | `fallback_rate > 10%` | 🟡 Media | Log + alerta | Revisar modelos |
| **Latencia API** | `p95 > 500ms` | 🟡 Media | Auto-scale workers | Capacity planning |
| **Push Delivery** | `delivery_pct < 95%` | 🟡 Media | Revisar FCM/APNs | Reconfigurar |

### Filosofía de alertas
- **Pocas, accionables, con runbook**: cada alerta tiene botón "Ver X" que navega al tab correspondiente
- **Sin alert fatigue**: solo umbrales que requieren acción humana
- **Auto-resolución**: si métrica vuelve a normal, alerta desaparece sola

---

## 14. Narrativa de Inversionista: Unidad Económica y Escalabilidad

### ¿Qué cuenta?
La historia para quien pone capital: ¿el modelo unitario funciona? ¿Escala? ¿Defendible?

### Métricas de unidad económica (calculadas desde dashboard)

| Métrica | Fórmula (desde dashboard) | Target |
|---------|---------------------------|--------|
| **CAC Blended** | Gasto marketing / (MAU nuevo mes) | < $15 USD |
| **LTV Solicitante** | (Contratos/año × commission) / churn | > $50 USD |
| **LTV PDS** | (Contratos/año × commission + paquetes) / churn | > $80 USD |
| **Take Rate** | Comisión plataforma / GMV transaccionado | 12% PDS + 8% Sol (umbral 50k) |
| **Moneda ARPU** | Revenue paquetes COP / MAU | > $5 USD/mes |
| **Payback Period** | CAC / (Margin mensual por usuario) | < 6 meses |
| **Viral Coefficient** | Referidos activos / usuario | > 0.3 |
| **Net Revenue Retention** | (Expansion - Churn) / Revenue inicio mes | > 100% |

### Preguntas de inversionista que responde el dashboard
- ¿Cada peso invertido en traer usuarios retorna en < 6 meses?
- ¿Los usuarios existentes gastan más con el tiempo (upsell paquetes, más contratos)?
- ¿El churn está compensado por expansión (más contratos/usuario)?
- ¿La economía de monedas es margen puro (costo marginal ~0)?

### Acciones derivadas
- Payback > 6 meses → reducir CAC (orgánico/referidos) / aumentar take rate / paquetes
- NRR < 100% → reactivar churned / upsell paquetes / nuevo rol Merchant
- Viral < 0.3 → programa referidos formal / incentivos compartir

---

## 15. Narrativa de Auditoría: Trazabilidad y Evidencia Forense

### ¿Qué cuenta?
El dashboard no solo muestra números; cada KPI es **trazable a evidencia inmutable** en `audit_logs`, `wallet_transactions`, `chamba` FSM, `contract` firmas. Diseñado para auditoría externa (universidad, regulador, inversionista).

### Cadena de trazabilidad por métrica

| KPI Dashboard | Tabla Origen | Campo Clave | Evidencia Inmutable |
|---------------|--------------|-------------|---------------------|
| Contratos firmados hoy | `contracts` | `firma_solicitante`, `firma_proveedor`, `firmado_*_en` | `audit_logs` action `contract.sign` |
| Cobros solicitante/proveedor | `contracts` | `cobro_solicitante_monedas`, `cobro_proveedor_monedas` | `movimientos_monedas` tipo `GASTO` |
| Monedas ganadas (PDS) | `movimientos_monedas` | `tipo=GANADA`, `descripcion="Recompensa completado"` | `wallet_transactions` + `chamba.estado=FINALIZADA` |
| Anuncios publicados | `anuncios_laborales` | `creado_en`, `costo_anuncio` | `movimientos_monedas` tipo `GASTO` ref `ANUNCIO-PUB` |
| KYC aprobado | `documentos_usuario` | `estado=aprobado`, `revisado_en`, `revisor_id` | `audit_logs` action `kyc.approve` |
| TrustScore actualizado | `trust_scores` | `calculado_en`, `version`, `componentes_json` | Job Celery `recalculate_all` log |
| Pago directo confirmado | `chambas` | `pago_confirmado_*`, `fecha_liquidacion` | `audit_logs` action `chamba.payment_confirmed` |
| Configuración cambiada | `tarifas_cobro` | `actualizado_en`, `actualizado_por` | `audit_logs` action `cobros.update` |
| Violación regional | `contracts` JOIN `users` x2 | `solicitante.region_id != proveedor.region_id` | `audit_logs` action `contract.cross_region_blocked` |

### Auditoría automatizada (Transition Phase - 14/14 flujos PASA)
- **Playwright E2E** valida que cada KPI coincide con BD
- **140+ capturas** + **14 videos** + **14 scripts .cjs** reproducibles
- **Consistencia PostgreSQL**: constraints, triggers, FK válidas
- **Invariantes de negocio**: partida doble wallet, FSM 6 hitos, scoping regional

### Preguntas de auditor que responde
- "Demuéstrame que el KPI 'Contratos hoy = 47' es real" → query `contracts` + `audit_log` + video E2E
- "¿Quién cambió el precio de la moneda y cuándo?" → `tarifas_cobro.actualizado_por` + `audit_log`
- "¿Hubo algún contrato cruzado regiones este mes?" → query `contracts` JOIN `users` + alerta histórica
- "¿Las monedas 'ganadas' corresponden a chambas finalizadas reales?" → JOIN `movimientos_monedas` + `chambas` + `audit_log`

### Entregables de auditoría
1. **Informe maestro** (PDF) con estadísticas completas y hallazgos
2. **Guía de re-ejecución autónoma** (scripts .cjs + pasos manuales)
3. **Catálogo de 19 riesgos** (R-01 a R-19) con brechas, limitaciones, deuda técnica
4. **Portal maestro de arquitectura** (mapa navegable, matriz trazabilidad 75 RF ↔ 75 HU ↔ 14 flujos ↔ 28 diagramas)

---

## Cómo Usar Este Documento

| Audiencia | Narrativas Recomendadas | Frecuencia |
|-----------|------------------------|------------|
| **SuperAdmin (diario)** | 1, 13, 9 | Inicio de jornada |
| **Product Manager (semanal)** | 3, 4, 5, 7, 8 | Sprint review |
| **Engineering Lead (semanal)** | 9, 13, 10 | Tech sync |
| **CEO / Board (mensual)** | 1, 2, 4, 14 | Board deck |
| **Auditor / Regulador (bajo demanda)** | 15, 6, 10 | Auditoría formal |
| **Inversionista (trimestral)** | 14, 1, 4 | Investor update |
| **Verificador / Soporte (diario)** | 11 (su rol), 13 | Inicio turno |

---

## Próximas Narrativas a Construir (Backlog)

- [ ] **Narrativa de Cohorte Temporal**: "Usuarios registrados en enero vs julio: retention a 90 días"
- [ ] **Narrativa de Experimento**: "A/B test: botón 'Firmar' rojo vs coral → conversión +12%"
- [ ] **Narrativa de Incidente Post-Mortem**: "Error rate 5xx 15% por 20min el 2026-10-15: causa, impacto, fix, prevención"
- [ ] **Narrativa de Migración**: "De escrow a cobros en monedas: impacto en revenue, churn, trust"
- [ ] **Narrativa de Expansión Geográfica**: "Valledupar → Sincelejo: métricas de lanzamiento, adopción, ajustes"

---

*Documento vivo. Actualizar cada sprint con nuevas métricas, narrativas validadas y lecciones aprendidas. Cada narrativa debe tener: **Owner**, **Fuente de datos**, **Frecuencia de revisión**, **Umbrales de acción**.*