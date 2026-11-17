# Narrativa: Ciclo Operativo — FSM 6 Hitos (Módulo D)

**KPIs Asociados:** D2.1–D2.7  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario/semanal)  
**Dimensión:** Módulo D — Ciclo Operativo FSM 6 Hitos

---

## La Historia

La **Máquina de Estados Finitos de 6 Hitos** es **el corazón operativo** de ChambeApp. Cada chamba debe recorrer: **Programada → En Proceso → En Ejecución → Pendiente Validación → Liquidación Confirmada → Finalizada**. Si una chamba se atasca en "En Ejecución" por 10 días, **algo se rompió**: evidencia faltante, disputa silenciosa, PDS desapareció. La **distribución de estados (D2.1)** es el mapa de calor operativo.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Distribución Estados (D2.1)** | Mayoría en Finalizada / Liquidación | Acumulación en En Ejecución / Pendiente Validación | > 20% en Programada / En Proceso > 7d | Revisar cuellos de botella por hito / alertas automáticas |
| **Tasa Finalización (D2.2)** | > 85% | 70–85% | < 70% | Auditoría chambas estancadas > 14d / mediación Soporte |
| **Tiempo por Hito (D2.3)** | Hito 1→2 < 24h, 2→3 < 48h, 3→4 < 72h, 4→5 < 24h, 5→6 < 12h | 1 hito 2x target | 1 hito 3x target | Alerta automática en hito atascado / recordatorios escalonados |
| **Tasa Pausa Botón Pánico (D2.4)** | < 2% | 2–5% | > 5% | Revisar causas: seguridad / clima / materiales / disputa |
| **Adendas/Chamba (D2.5)** | 0.5–1.5 (ajustes normales) | 0 (rígido) o > 3 (caos) | > 5 (descontrol) | Límite 3 adendas / aprobadas por Soporte |
| **Novedades Reportadas (D2.6)** | 0–1 por chamba | 1–2 | > 3 | Revisar tipo: seguridad / clima / materiales / alcance |
| **Evidencias Completas (D2.7)** | > 90% chambas finalizadas | 70–90% | < 70% | Bloquear calificación sin evidencias / UX obligatoria |

---

## Segmentación Obligatoria

- **Por hito atascado:** ¿Es Hito 2 (check-in GPS)? ¿Hito 4 (validación solicitante)? ¿Hito 5 (pago)?
- **Por categoría:** Plomería (rápida) vs Construcción (lenta, hitos múltiples)
- **Por monto:** < 50k (rápida) vs > 500k (hitos múltiples, adendas)
- **Por región:** Check-in GPS precision distinta urbano vs rural

---

## Palancas de Intervención

1. **Alertas automáticas por hito** → Chambas en mismo estado > 48h (configurable) → Push al PDS + Push al Solicitante + Alerta Soporte
2. **Recordatorios escalonados por hito** → Hito 2: "Haz check-in GPS" → Hito 4: "Sube evidencia salida" → Hito 5: "Confirma pago"
2. **Botón pánico visible** → PDS/Sol pueden pausar con motivo → Notifica a ambos + Soporte
2. **Validación evidencia obligatoria** → UI bloquea "Solicitar cierre" sin evidencia salida 360°/foto
2. **Mediación automática disputa** → Chambas > 14d en mismo estado → Soporte interviene

---

## Riesgo Si Se Ignora

- **Chambas atascadas > 30%** → Capital de trabajo atrapado (pago no liberado) → PDS sin flujo caja → churn
- **Evidencias < 70%** → Calificación sin prueba → disputas calidad suben → TrustScore poco fiable
- **Pausa > 5%** → Botón pánico usado como "escape" → revisar seguridad / expectativas

---

## Métricas Complementarias

- **D1.2 (Firma Bilateral)** → Input: contrato firmado → Chamba creada (Hito 1)
- **D3.4 (Pago Efectivo Dual)** → Output: Hito 5 completado → Hito 6
- **D3.7 (Calificación)** → Output: Hito 6 completado
- **D2.5 (Adendas)** → Generan Marañas (RF-59) → nuevo ciclo

---

## Alineación Estándares

- **RF-20, RF-21, RF-22, RF-23** — FSM 6 hitos completo
- **RF-52, RF-53, RF-54, RF-55, RF-56, RF-57, RF-58** — Cada hito implementado
- **RNF-AUD** — Auditoría inmutable (cada transición estado en audit_logs)
- **Ley 1429/2010** — Trazabilidad contractual para formalización

---

## Plantilla de Decisión

> **Si hoy:** Chambas en "En Ejecución" > 7d > 15% **O** Evidencias completas < 70%  
> **Entonces:** 1) Alerta Soporte: lista chambas atascadas 2) Push PDS/Sol: "Acción requerida en chamba #X" 3) Soporte llama a chambas > 14d  
> **Owner:** PM Operaciones  
> **Revisión:** Diario 8am en standup operaciones