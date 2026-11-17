# Narrativa: Validación Peer-to-Peer — Endosos 360°

**KPI Asociado:** D2.6  
**Nivel:** 🟡 Operativo (diario) / 🟠 Táctico (semanal)  
**Dimensión:** 2. Demanda de Habilidades y Brechas de Capacitación

---

## La Historia

El **endoso social (RF-64)** es la **validación más poderosa**: un solicitante dice "este PDS SÍ sabe plomería" tras ver su trabajo en sitio (evidencia 360°). **≥5 endosos = habilidad validada automáticamente**. Es la **reputación distribuida, no centralizada**.

---

## Qué Nos Dice Realmente

| Endosos/Habilidad | Interpretación | Acción Inmediata |
|-------------------|----------------|------------------|
| **< 2** | Cultura pasiva: solicitantes no endosan, UI oculta botón, PDS no piden | UX: Botón "Endosar" visible post-chamba 4★ + 5 monedas por endosar |
| **2–5** | Emergente: algunos solicitantes activos, PDS orgullosos muestran badge | Incentivar: 10 monedas/endoso + badge "Endosado por [N] clientes" |
| **≥ 5** | **Efecto red**: endoso = moneda social, PDS compiten por endosos, matching prioriza endosados | Escalar: Endoso = requisito matching prioritario + TrustScore bonus |

---

## Diseño Crítico Anti-Gaming

- **Visible solo post-chamba finalizada + calificación 4+ estrellas**
- **Endoso requiere** `competencia ∈ Habilidad.habilidades` (no "buen tipo", sí "sabe soldar TIG")
- **Un solicitante = 1 endoso por competencia por PDS** (unique constraint `uq_endoso_contract_competencia`)
- **Evidencia 360° vinculada:** Endoso + evidencia 360° = validación robusta

---

## Segmentación Obligatoria

- **Por habilidad:** Plomería (endosos fáciles) vs Soldadura TIG (endosos duros, alto valor)
- **Por nivel PDS:** N1/N2 (pocos endosos) vs N4/N5 (muchos endosos, calidad alta)
- **Por solicitante:** Solicitantes "endosadores activos" (≥10 endosos) vs pasivos
- **Por evidencia:** Endoso con evidencia 360° vs solo texto

---

## Palancas de Intervención

1. **UX Post-Chamba:** "¿Tu plomero sabía lo que hacía? Endosa su habilidad 'Plomería tubería' → 5 monedas"
2. **Badge visible:** "Endosado por 12 clientes en Plomería" en perfil PDS + matching prioritario
2. **Incentivo solicitante:** 5 monedas/endoso (máx 50/mes) + badge "Cliente Experto"
2. **Matching prioritario:** PDS con ≥5 endosos en habilidad → prioridad ranking ML + badge visible
2. **Anti-gaming:** 1 endoso/competencia/solicitante + requiere calificación 4+ + evidencia 360° opcional

---

## Riesgo Si Se Ignora

- **Endosos < 2/habilidad** → Validación centralizada (TrustScore) única → sesgo algorítmico / opacidad
- **Gaming endosos** → Amigos se endosan mutuamente → TrustScore inflado → matching falla
- **Sin evidencia 360°** → Endoso = opinión subjetiva → no valida competencia técnica real

---

## Métricas Complementarias

- **D2.7 (Evidencia 360°)** → Endoso + evidencia 360° = validación robusta
- **D2.5 (Progresión Niveles)** → Endosos aceleran progresión N3→N4
- **A3.1 (TrustScore)** → Endosos = input futuro TrustScore (componente "Referidos" 15%)
- **D3.7 (Calificación)** → Calificación 4+ = prerequisito endoso

---

## Alineación Estándares

- **RF-64** — Validación social (endoso por clientes + evidencias 360°)
- **RF-56** — Hito 6: Calificación + habilidades validadas (alimenta endoso)
- **ODS 8.5** — Empleo pleno productivo (reputación distribuida = confianza)
- **IRIS+ OI5119** — Capacitación/validación peer-to-peer

---

## Plantilla de Decisión (Para PM Producto/PM Impacto)

> **Si este mes:** Endosos promedio/habilidad < 2 **O** % habilidades con ≥5 endosos < 10%  
> **Entonces:** 1) UX: Botón "Endosar" visible post-chamba 4★ 2) Incentivo 5 monedas/endoso (máx 50/mes) 3) Badge "Endosado por N clientes" visible en perfil + matching prioritario  
> **Owner:** PM Producto + PM Impacto  
> **Revisión:** Mensual