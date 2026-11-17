# Narrativa: Micro-Capacitación Efectiva — Quiz Rate del 80%

**KPI Asociado:** D2.3  
**Nivel:** 🟡 Operativo (diario) / 🟠 Táctico (semanal)  
**Dimensión:** 2. Demanda de Habilidades y Brechas de Capacitación

---

## La Historia

El **quiz (RF-63)** es **la micro-credencial más ágil**: 3-5 preguntas, 30-45s, 80% para aprobar, reintentos ilimitados. Si el **quiz rate < 60%**, o las preguntas son malas, o el nivel es inadecuado, o el PDS no estudió. Si **> 80%**, la micro-capacitación **funciona**: PDS validan habilidad en < 1min, TrustScore sube, matching mejora.

---

## Qué Nos Dice Realmente

| Quiz Rate | Interpretación | Acción Inmediata |
|-----------|----------------|------------------|
| **< 50%** | Preguntas ambiguas, nivel errado (N3 preguntas en N1), traducción pobre, UX confusa | Auditoría pregunta por pregunta: % acierto, tiempo, abandono → fix/eliminar < 48h |
| **50–70%** | Ajuste fino | A/B test redacción / revisar analytics por pregunta |
| **> 80%** | **Efectivo**: PDS validan habilidad en < 1min, TrustScore sube, matching mejora | Escalar: más quizzes / niveles / habilidades |

---

## Métrica Complementaria: Intentos por Aprobación

Si **promedio > 3 intentos** → quiz confuso o difícil. **Target: 1.5 intentos**.

---

## Segmentación Obligatoria

- **Por habilidad:** Plomería (quiz rate 85%) vs Soldadura TIG (quiz rate 45%)
- **Por nivel:** N1 (básico, 90%) vs N4 (avanzado, 55%)
- **Por dispositivo:** Móvil (touch) vs Desktop (mouse) → UX distinta
- **Por idioma/lectura:** Español simple vs técnico → legibilidad

---

## Palancas de Intervención

1. **Analytics por pregunta:** Dashboard % acierto, tiempo, abandono por pregunta → Pregunta < 40% acierto → **revisar/eliminar en < 48h**
2. **A/B test redacción:** Versión A (técnica) vs B (simple, ejemplo visual) → medir % acierto + tiempo
2. **Nivel adaptativo:** PDS falla 2x N3 → sugiere N2 + contenido puente / PDS aprueba 2x N2 → sugiere N3
2. **Feedback inmediato:** "Incorrecto. La respuesta correcta es B porque [explicación 1 línea]. Intenta de nuevo."
2. **Gamificación:** Racha 5 aprobados seguidos = 20 monedas bonus + racha visible en perfil

---

## Riesgo Si Se Ignora

- **Quiz rate < 50% por 2+ semanas** → PDS frustran → abandonan capacitación → brecha habilidades no se cierra → matching degrada
- **Preguntas malas persistentes** → PDS aprenden respuestas de memoria, no competencia → TrustScore inflado → matching falla
- **Nivel inadecuado** → PDS N1 reciben quiz N3 → abandono masivo → onboarding roto

---

## Métricas Complementarias

- **D2.1 (Top 10 Demandadas)** → Priorizar quiz habilidades Top 10
- **D2.2 (Brecha Habilidades)** → Priorizar quiz habilidades con brecha > 50%
- **D2.4 (Certificación SENA)** → Quiz = paso previo a certificación formal
- **D2.5 (Progresión Niveles)** → Quiz rate = predictor progresión N1→N2→N3

---

## Alineación Estándares

- **RF-63** — Validación por quiz (micro-evaluación) implementada
- **ODS 4.4** — Habilidades técnicas/profesionales (micro-credenciales)
- **ODS 4.6** — Alfabetización digital (quiz digital = alfabetización)
- **IRIS+ OI5119** — Capacitación/training efectiva (micro-learning)

---

## Plantilla de Decisión (Para PM Producto/Content)

> **Si esta semana:** Quiz rate < 50% en habilidad X **O** Intentos promedio > 3  
> **Entonces:** 1) Auditoría pregunta por pregunta (analytics) 2) Preguntas < 40% acierto → fix/eliminar en 48h 3) A/B test redacción preguntas problemáticas  
> **Owner:** PM Producto + Content Team  
> **Revisión:** Semanal (analytics quiz)