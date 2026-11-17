# Narrativa: Disputas — El Termómetro de la Calidad

**KPI Asociado:** D4.4  
**Nivel:** 🟠 Táctico (diario/semanal) / 🔴 Crítico (mensual)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

**Disputas / 100 contratos** mide **fallas de matching, expectativas rotas, calidad insuficiente**. Una disputa no es fracaso; **tasa > 3%** sí lo es: la plataforma conecta mal, o no gestiona expectativas, o no valida habilidades.

---

## Qué Nos Dice Realmente

| Disputas/100 Contratos | Interpretación | Acción Inmediata |
|------------------------|----------------|------------------|
| **< 1%** | Matching excelente: expectativas alineadas, habilidades validadas, FSM 6 hitos claros | Mantener: monitoreo semanal |
| **1–3%** | Normal: fricción humana normal (retrasos, malentendidos, clima) | Monitorear tipología / revisar mensual |
| **> 3%** | **Alerta**: revisar ML (¿recomienda mal?), KYC (¿valida mal habilidades?), FSM (¿hitos ambiguos?), precios sugeridos (¿subcotización?) | Auditoría sample 20% disputas/mes → acción correctiva |

---

## Tipología Clave (Campo `disputes.reason`)

| Tipo Disputa | Causa Raíz | Acción Correctiva |
|--------------|------------|-------------------|
| **Calidad trabajo** | Skill gap (PDS no tiene habilidad) | Revisar ML / KYC habilidades / Quiz / Certificación SENA |
| **Retraso** | Gestión tiempo / imprevistos | FSM hitos: recordatorios / hitos intermedios / penalización suave |
| **Pago** | Evasión / cambio modalidad / monto | Dual check-in / recordatorios / mediación Soporte |
| **Alcance** | Adendas mal gestionadas / expectativas | Límite 2 adendas / UX adenda clara / mediación automática |

---

## Segmentación Obligatoria

- **Por tipo disputa:** Calidad / Retraso / Pago / Alcance / Comunicación / Seguridad
- **Por categoría oficio:** Plomería (disputas calidad) vs Jardinería (retrasos clima) vs Electricidad (seguridad)
- **Por monto:** < 50k (bajo) vs 50k-200k (medio) vs > 200k (alto, más disputas)
- **Por región:** Centro (más contratos) vs Corregimientos (menos contratos, más informales)
- **Por nivel TrustScore:** PDS Novato (más disputas) vs Experto (menos disputas)

---

## Palancas de Intervención

1. **Prevención ML:** Disputas "calidad" ↑ → Revisar features ML / A/B test ranking / Diversidad Thompson Bandit
2. **Prevención KYC:** Disputas "calidad" ↑ → Revisar quiz rate / certificación SENA / endosos / evidencia 360°
2. **FSM hitos claros:** Límite 2 adendas / UX adenda obligatoria campos / Recordatorios hitos automatizados
2. **Mediación automática Soporte:** Disputa > 48h sin avance → Asignación automática Soporte + mediación 48h
2. **Penalización suave:** PDS con > 3 disputas "calidad" / 6 meses → TrustScore penalty -10% / Suspensión temporal ofertas

---

## Riesgo Si Se Ignora

- **Tasa > 5% por 2+ meses** → Confianza rota → Solicitantes dejan de publicar / PDS dejan de ofertar → Platform death spiral
- **Disputas "calidad" > 50% del total** → ML/KYC/Validación rotos → TrustScore inútil → Matching ciego
- **Disputas "pago" > 30%** → Evasión normalizada / Dual check-in falla → Revenue leakage

---

## Métricas Complementarias

- **B1.5 (CTR ML)** → ML recomienda mal → disputas calidad
- **B1.6 (Conversión Rec→Contrato)** → ML recomienda bien → menos disputas
- **A2.1 (KYC Completion)** → KYC valida habilidades → menos disputas calidad
- **D2.3 (Quiz Rate)** → Quiz valida habilidades → menos disputas calidad
- **D2.7 (Evidencia 360°)** → Evidencia respalda/desmiente disputa

---

## Alineación Estándares

- **RNF-AUD** — Auditoría inmutable (disputas = acciones auditadas)
- **RF-23** — Confirmación Dual (reduce disputas pago)
- **RF-56, RF-57, RF-58** — FSM 6 hitos (reduce disputas alcance/retraso)
- **ODS 16.3** — Estado de derecho (acceso justicia/mediación)
- **IRIS+ OI5922** — Seguridad social (disputas laborales)

---

## Plantilla de Decisión (Para PM Operaciones/PM Producto/Soporte)

> **Si esta semana:** Disputas/100 contratos > 3% **O** Disputas "calidad" > 50% del total  
> **Entonces:** 1) Auditoría sample 20% disputas mes 2) Revisar ML/KYC/FSM según tipología 3) Medidas correctivas: límite adendas / mediación automática / penalización TrustScore  
> **Owner:** PM Operaciones + PM Producto + Soporte  
> **Revisión:** Semanal (standup métricas)