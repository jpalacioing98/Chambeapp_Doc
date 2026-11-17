# Narrativa: Confianza vs Evasión — ¿Todos Pagan su Parte?

**KPI Asociado:** D4.3  
**Nivel:** 🟠 Táctico (diario) / 🔴 Crítico (semanal)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

El modelo **pago dual (RF-08, RF-23)** es la **innovación central de ChambeApp**: la plataforma NO intermedia el dinero del servicio. El PDS y el Solicitante acuerdan pago directo (efectivo, Nequi, transferencia) y **ambos confirman en app (dual check-in)**. Solo entonces se libera la calificación. La **tasa de evasión (D4.3)** mide si este mecanismo de confianza **funciona o se evade**.

---

## Qué Nos Dice Realmente

| Tasa Evasión | Interpretación | Acción Inmediata |
|--------------|----------------|------------------|
| **< 3%** | Control efectivo: dual check-in + auditoría sample + reputación (quien evade pierde TrustScore) | Mantener: auditoría sample 10% chambas/mes |
| **3–5%** | Alerta: revisar UX check-in (¿confunde?), recordatorios push "Confirma pago en app para proteger tu TrustScore" | Revisar UX check-in / recordatorios push / auditoría sample 20% |
| **> 5%** | **Crisis**: commission leakage, PDS/solicitantes normalizan evasión, revenue real << revenue potencial | **Auditoría 50% chambas/mes** + llamada verificación / UX redesign check-in |

---

## Cómo Se Detecta la Evasión

**Cruce de datos automático (job nocturno):**
1. `chambas.pago_directo_confirmado = true` (ambos confirmaron)
2. `contracts.cobro_solicitante_monedas = 0` Y `contracts.cobro_proveedor_monedas = 0` (no pagaron monedas)
3. `wallet_transactions` SIN comisión en ese contrato
4. **Flag evasión = TRUE** → Alerta Slack + Auditoría sample

---

## Segmentación Obligatoria

- **Por modalidad:** A (comisión) vs B (monedas) — evasión distinta
- **Por monto:** < 50k (exento) vs 50k–200k vs > 200k
- **Por región:** Centro (control alto) vs Corregimientos (control bajo)
- **Por tipo pago:** Nequi (trazable) vs Efectivo (riesgo alto) vs Transferencia (trazable)

---

## Palancas de Intervención

1. **UX Dual Check-in 1-click:** "Confirmo pago recibido" / "Confirmo pago enviado" → botones grandes, colores distintos
2. **Recordatorios escalonados:** 30min → 2h → 6h → 12h → 24h (ambos lados)
2. **Incentivo confirmación:** 5 monedas por confirmar pago en < 30min
2. **Disputa pago integrada:** "¿Pago no recibido?" → abre disputa automática + mediación Soporte
2. **Auditoría sample 10%/mes:** Llamada verificación aleatoria 10% chambas finalizadas → "¿Confirmaste pago en app?"

---

## Riesgo Si Se Ignora

- **Evasión > 5% por 2+ meses** → Pago "por fuera" normalizado → comisión evadida → TrustScore poco fiable → matching ciego
- **Evasión normalizada** → PDS/solicitantes enseñan a evadir → cultura de evasión → plataforma inviable
- **Revenue real << Revenue potencial** → Inversionistas pierden confianza → funding riesgo → plataforma inviable

---

## Métricas Complementarias

- **D1.6 (Cobro Monedas Firmar)** → Input: monedas cobradas al firmar
- **D3.4 (Pago Efectivo Dual)** → Output: dual check-in exitoso
- **A3.1 (TrustScore)** → Quien evade pierde TrustScore (componente "contratos" 20%)
- **G2.2 (Auditoría)** → Evasión detectada via auditoría pagos

---

## Alineación Estándares

- **RF-08, RF-23** — Pago Dual y Confirmación Dual
- **RNF-06** — Confiabilidad Pagos (> 98% éxito)
- **RNF-AUD** — Auditoría inmutable (evasión = acción auditada)
- **ODS 16.6** — Instituciones efectivas (control evasión)

---

## Plantilla de Decisión (Para PM Pagos/PM Impacto/SuperAdmin)

> **Si hoy:** Tasa evasión > 5% **O** Auditoría sample detecta > 3 evasiones/20 sample  
> **Entonces:** 1) Auditoría 50% chambas finalizadas/mes 2) Rediseño UX dual check-in (1-click, colores, recordatorios) 3) Llamada verificación 20% chambas finalizadas 4) Alerta Slack #commission-evasion  
> **Owner:** PM Pagos + PM Impacto + SuperAdmin  
> **Revisión:** Semanal (standup métricas)