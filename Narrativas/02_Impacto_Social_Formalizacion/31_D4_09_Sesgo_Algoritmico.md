# Narrativa: El Sesgo Invisible — ¿La IA Discrimina?

**KPI Asociado:** D4.9  
**Nivel:** 🔴 Crítico (semanal) / 🔴 Crítico (mensual)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

El **motor ML (RF-ML-1, RF-ML-2, RF-ML-3)** decide quién ve qué oferta. Si **KL divergence > 0.1** entre distribución recomendada y población PDS, **el algoritmo amplifica brechas**: recomienda más a hombres en construcción, a jóvenes en tech, a urbanos en todo. **El sesgo no es bug; es feature si no se mide.**

---

## Qué Nos Dice Realmente

| KL Divergence | Interpretación | Acción Inmediata |
|---------------|----------------|------------------|
| **< 0.05** | Equidad algorítmica: distribución recomendada ≈ población PDS por género/edad/región/oficio | Mantener: monitoreo semanal + A/B testing continuo |
| **0.05–0.10** | Sesgo incipiente: revisar features (¿`genero` en feature extractor? ¿`region_id` proxy de raza/clase?), reentrenar con fairness constraints | Revisar feature extractor / Adversarial debiasing / Counterfactual fairness |
| **> 0.10** | **Feature flag ML OFF automático + alerta P1**: sesgo inaceptable, auditoría completa, reentrenamiento con `fairlearn`/`aif360` | **ML OFF automático** + Alerta P1 + Auditoría completa + Reentrenamiento `fairlearn`/`aif360` |

---

## Features de Riesgo (Auditadas Trimestralmente)

| Feature | Riesgo | Mitigación |
|---------|--------|------------|
| `region_id` | Proxy estrato socioeconómico / raza / acceso | Eliminar / Anonimizar / Adversarial debiasing |
| `edad` | Proxy experiencia / edadismo | Bucketing (rangos) / Counterfactual fairness |
| `genero` | Discriminación directa (explícita) | **Eliminar del feature extractor** / Adversarial debiasing |
| `habilidades` | Proxy oficio generizado (plomería=hombre, estética=mujer) | Embeddings habilidades sin género / Counterfactual fairness |
| `TrustScore` | Historial sesgado (rating inflado hombres / mujeres) | Calibración por grupo protegido / Calibración isotónica |

---

## Pipeline Anti-Sesgo (Continuo)

1. **Feature Audit Trimestral:** Auditoría `feature_extractor.py` → identificar features riesgo → eliminar/transformar
2. **Adversarial Debiasing:** Entrenamiento con `fairlearn`/`aif360` → penaliza predicción atributos protegidos
3. **Counterfactual Fairness:** "¿Cambiaría la recomendación si solo cambia género/edad/región?" → Test contrafactual automatizado
4. **A/B Testing Continuo (RF-ML-2):** ML ON vs OFF → CTR/conversión por grupo protegido (género/edad/región)
5. **Thompson Bandit Diversity Boost (RF-ML-3):** `ThompsonBandit` con diversity penalty → explora PDS sub-representados

---

## Métrica: KL Divergence (Detalle)

```
KL(P_recomendado || P_población) = Σ P_recomendado(i) * log(P_recomendado(i) / P_población(i))
```

Donde `i` = (género, edad_bucket, región, oficio). **Target: KL < 0.05**

---

## Segmentación Obligatoria

- **Por atributo protegido:** Género / Edad / Región / Etnia (proxy región) / Discapacidad (proxy accesibilidad)
- **Por oficio:** Construcción (hombres) vs Estética (mujeres) vs Domésticos (mujeres migrantes)
- **Por cohorte:** Nuevos PDS (cold start) vs Veteranos (historial rico)
- **Por feature flag:** ML ON vs OFF (A/B test continuo)

---

## Riesgo Si Se Ignora

- **KL > 0.1 por 2+ sprints** → Discriminación sistémica → Demanda legal (Ley 1482/2011 anti-discriminación) / Periódico "ChambeApp discrimina mujeres en plomería" → Pérdida confianza / Inversionistas impacto huyen
- **Sesgo Matthew (ricos más ricos)** → PDS ya exitosos reciben más recomendaciones → brecha se amplifica → PDS nuevos nunca entran
- **Proxy discriminatorio** → `region_id` = estrato → PDS barrios pobres no reciben ofertas → pobreza geográfica reforzada

---

## Métricas Complementarias

- **B1.5 (CTR ML)** → Por grupo protegido (CTR mujeres vs hombres)
- **B1.6 (Conversión Rec→Contrato)** → Por grupo protegido
- **D1.5 (Equidad Género)** → Output sesgo ML
- **D1.6 (Juventud)** → Output sesgo ML
- **D1.7 (Vulnerables)** → Output sesgo ML
- **D4.9 (KL Divergence)** → Métrica directa sesgo

---

## Alineación Estándares

- **RNF-02** — Transparencia Algorítmica (explicabilidad, no discriminación)
- **RF-ML-1, ML-2, ML-3** — ML 2 etapas + A/B + Bandit (anti-sesgo integrado)
- **Ley 1482/2011** — Anti-discriminación (sanciona discriminación algorítmica)
- **ODS 5.1, 10.2, 10.3** — Igualdad, no discriminación
- **IRIS+ OI7007** — Diversidad e inclusión
- **EU AI Act (referencia)** — High-risk AI system requirements

---

## Plantilla de Decisión (Para ML Engineer/PM Impacto/Legal/SuperAdmin)

> **Si ahora:** KL divergence > 0.10 **O** CTR/conversión diferencia > 20% entre grupos protegidos  
> **Entonces:** 1) **Feature flag `ml_ranking_enabled` = OFF automático** 2) Alerta P1 Slack + PagerDuty + Legal 3) Auditoría completa feature extractor + reentrenamiento `fairlearn`/`aif360` 4) Post-mortem público < 48h  
> **Owner:** ML Engineer + PM Impacto + Legal  
> **Revisión:** Inmediata (P1) + Semanal (post-fix)