# Narrativa: Pago Dual y Calificación 360° (Módulo D)

**KPIs Asociados:** D3.1–D3.8  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo D — Pago Dual y Calificación 360°

---

## La Historia

El **pago dual (RF-08, RF-23)** es la **innovación central de ChambeApp**: la plataforma NO intermedia el dinero del servicio. El PDS y el Solicitante acuerdan pago directo (efectivo, Nequi, transferencia) y **ambos confirman en app (dual check-in)**. Solo entonces se libera la calificación. La **tasa de pago efectivo dual (D3.4)** mide si este mecanismo de confianza **funciona o se evade**.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Volumen Pagos/día (D3.1)** | Creciente + alineado contratos | Plano | Caída > 15% WoW | Revisar funnel: contrato → chamba → pago |
| **Comisión Plataforma (D3.2)** | Alineada a contratos × 12% (umbral 50k) | Desviación 5–10% | Desviación > 10% | Auditoría sample: evasión / modalidad B / exención <50k |
| **Distribución Pasarela (D3.3)** | Nequi > 50%, PSE 30%, Efectivo 20% | Un canal > 80% | Efectivo > 50% (riesgo evasión) | Incentivar Nequi/PSE: 0 comisión pasarela / UX superior |
| **Tasa Pago Efectivo Dual (D3.4)** | > 90% | 80–90% | < 80% | Revisar UX check-in / recordatorios / disputas pago |
| **Tiempo Liquidación (D3.5)** | < 12h | 12–48h | > 48h | Recordatorios escalonados / mediación Soporte |
| **Reembolsos/Disputas Pago (D3.6)** | < 1% contratos | 1–3% | > 3% | Revisar causa: calidad / alcance / evasión / fraude |
| **Calificación Promedio (D3.7)** | 4.3–4.7 (sano) | 4.0–4.3 o > 4.7 (inflado) | < 4.0 o > 4.8 | Auditoría inflado / revisar sesgo recíproco |
| **Tasa Calificación Bilateral (D3.8)** | > 90% | 70–90% | < 70% | Bloquear nueva chamba sin calificar anterior / recordatorios |

---

## Segmentación Obligatoria

- **Por modalidad:** A (comisión) vs B (monedas) — comisión distinta
- **Por pasarela:** Nequi (rápido) vs PSE (bancarizado) vs Efectivo (riesgo evasión)
- **Por monto:** < 50k (exento) vs 50k–200k vs > 200k
- **Por calificación:** 1–2★ (disputa latente) vs 3★ (neutro) vs 4–5★ (sano)

---

## Palancas de Intervención

1. **Dual check-in UX 1-click** → "Confirmo pago recibido" / "Confirmo pago enviado" → botones grandes, colores distintos
2. **Recordatorios escalonados** → 30min → 2h → 6h → 12h → 24h (ambos lados)
2. **Incentivo confirmación** → 5 monedas por confirmar pago en < 30min
2. **Disputa pago integrada** → "¿Pago no recibido?" → abre disputa automática + mediación Soporte
2. **Calificación obligatoria** → Bloquea nueva chamba PDS/Sol si tiene calificación pendiente > 48h

---

## Riesgo Si Se Ignora

- **Tasa dual check-in < 80%** → Pago "por fuera" normalizado → comisión evadida → TrustScore poco fiable
- **Calificación avg < 4.0** → Problema sistémico calidad / expectativas / matching
- **Calificación > 4.8** → Inflado recíproco → TrustScore poco discriminante → matching ciego
- **Reembolsos > 3%** → Disputas no resueltas en mediación → Soporte saturado / confianza rota

---

## Métricas Complementarias

- **D1.2 (Firma Bilateral)** → Precondición: contrato firmado → chamba → pago
- **D2.7 (Evidencias Completas)** → Prerequisito calificación: evidencia salida obligatoria
- **A3.1 (TrustScore Niveles)** → Calificación = 25% peso TrustScore
- **D4.3 (Evasión Comisión)** → Pago dual evadido = comisión 0

---

## Alineación Estándares

- **RF-08, RF-23** — Pago Dual y Confirmación Dual implementados
- **RF-09** — Calificación 360° bilateral
- **RNF-06** — Confiabilidad Pagos (> 98% éxito)
- **Ley 1429/2010** — Trazabilidad ingresos para formalización

---

## Plantilla de Decisión

> **Si hoy:** Tasa pago efectivo dual < 80% **O** Calificación avg < 4.0 **O** Reembolsos > 3%  
> **Entonces:** 1) Auditoría sample 20 chambas finalizadas 2) Push recordatorio check-in a chambas en liquidación 3) Revisar UX dual check-in / disputas pago  
> **Owner:** PM Pagos  
> **Revisión:** Cada 4h en hora pico