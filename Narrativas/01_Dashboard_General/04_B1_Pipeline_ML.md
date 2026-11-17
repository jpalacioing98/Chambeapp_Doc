# Narrativa: Rendimiento del Pipeline ML (Módulo B)

**KPIs Asociados:** B1.1–B1.8  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo B — Motor de Match/Recomendación IA

---

## La Historia

El **Motor ML en 2 etapas (Retrieval + Ranking)** es el cerebro que decide **qué PDS ve qué solicitud**. Si el feature flag `ml_ranking_enabled` está OFF, el sistema cae a heurística geo/categoría (matching ciego). La **latencia p95 < 200ms** no es capricho técnico: un PDS que espera 500ms por recomendaciones **abandona la app**. El **CTR y conversión** miden si el ML realmente **entrega valor** vs heurística.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Feature Flag ML (B1.1)** | ON 99.9% uptime | OFF ocasional (mantenimiento) | OFF > 1% tiempo | Alert Slack + rollback automático si error |
| **Requests/día (B1.2)** | Creciente + estable | Plano | Caída > 20% WoW | Revisar salud API / matching / geocerca |
| **Latencia p95 (B1.3)** | < 200ms | 200–500ms | > 500ms | Scale workers GPU / cache embeddings / batch inference |
| **Tasa Fallback (B1.4)** | < 5% | 5–10% | > 10% | Investigar errores ranking / modelos corruptos |
| **CTR Recomendaciones (B1.5)** | > 8% | 4–8% | < 4% | A/B test UI recomendaciones / diversificar retrieval |
| **Conversión Rec→Contrato (B1.6)** | > 2% | 1–2% | < 1% | Revisar ranking features / cold start / diversidad |
| **Explicabilidad Score (B1.7)** | > 0.7 | 0.5–0.7 | < 0.5 | Mejorar features interpretables / UI explicación |
| **Cobertura Geoespacial (B1.8)** | > 85% | 70–85% | < 70% | Seeding PDS zonas frías / expandir geocercas |

---

## Segmentación Obligatoria

- **Por grupo A/B (RF-ML-2):** ML ON vs heurística → CTR, conversión, latencia
- **Por categoría:** ML brilla en oficios técnicos (plomería, electricidad); heurística basta en aseo/jardinería
- **Por región:** Cobertura geoespacial distinta por densidad PDS
- **Por hora:** Pico 7–9am / 6–8pm → latencia crítica

---

## Palancas de Intervención

1. **Feature flag kill switch** → OFF automático si latencia p95 > 500ms por 5min
2. **Cache embeddings PDS** → Redis TTL 1h, invalida en actualización perfil
3. **Batch inference nocturna** → Pre-computa scores para solicitudes recurrentes
4. **Thompson Bandit (RF-ML-3)** → Diversifica retrieval → evita sesgo Matthew
5. **Cold start PDS nuevos** → Boost temporal + quiz obligatorio + portfolio mínimo

---

## Riesgo Si Se Ignora

- **Latencia > 500ms** → PDS abandona app antes de ver recomendaciones → CTR 0%
- **Fallback > 10%** → ML efectivamente apagado → matching ciego → disputas suben
- **CTR < 4%** → ML no entrega valor → feature flag OFF permanente → deuda técnica
- **Conversión < 1%** → ML recomienda mal → TrustScore no usado → matching ciego

---

## Métricas Complementarias

- **A3.1 (TrustScore Niveles)** → Feature principal ranking (peso implícito en features)
- **B1.8 (Cobertura Geo)** → Retrieval geoespacial (PostGIS ST_DWithin) prerequisito
- **D2.1 (Distribución Estados Chamba)** → Output final del matching
- **D4.9 (Sesgo ML)** → KL divergence distribution recomendada vs población

---

## Alineación Estándares

- **RNF-02** — Transparencia Algorítmica (explicabilidad score, feature flag, A/B testing)
- **RF-ML-1, ML-2, ML-3** — Implementación completa 2 etapas + A/B + Bandit
- **ODS 9.c** — Acceso TIC universal (latencia baja = inclusión dispositivos gama baja)

---

## Plantilla de Decisión

> **Si ahora:** Latencia p95 > 500ms por 5min **O** Fallback rate > 10%  
> **Entonces:** Feature flag `ml_ranking_enabled` = OFF automático + Alert Slack #ml-alerts + Issue Jira "ML degradado"  
> **Owner:** ML Engineer  
> **Revisión:** Cada 5min hasta latencia < 200ms y fallback < 5%