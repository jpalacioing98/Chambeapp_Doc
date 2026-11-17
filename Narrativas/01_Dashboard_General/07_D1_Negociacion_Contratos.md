# Narrativa: Negociación y Contratos (Módulo D)

**KPIs Asociados:** D1.1–D1.6  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo D — Negociación y Contratos

---

## La Historia

El **contrato es el momento de la verdad**: todo el matching, matching, KYC, TrustScore converge aquí. La **tasa de firma bilateral (D1.2)** mide si el flujo de negociación (oferta → contraoferta → aceptación → firma) **fluye o se atasca**. El **tiempo a firma (D1.3)** mide fricción: si un contrato tarda > 24h en firmarse por ambas partes, **la oportunidad se enfría** y el PDS busca otra solicitud.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Contratos Creados/día (D1.1)** | Creciente + estable | Plano | Caída > 15% WoW | Revisar funnel: postulación → oferta → negociación → firma |
| **Tasa Firma Bilateral (D1.2)** | > 80% | 60–80% | < 60% | Revisar UX firma: notificaciones, UX mobile, recordatorios |
| **Tiempo Promedio Firma (D1.3)** | < 4h | 4–24h | > 24h | Push "Falta tu firma" cada 2h / UX 1-click firma |
| **Contratos con Contraoferta (D1.4)** | 20–40% (negociación sana) | < 10% (no negocian) o > 60% (estancados) | > 80% (bucle infinito) | Límite 2 contraofertas / mediación automática |
| **Monto Promedio Contrato (D1.5)** | Alineado a mercado + prima TrustScore | Desalineado > 20% | Desalineado > 50% | Revisar precios sugeridos / TrustScore prima |
| **Cobro Monedas al Firmar (D1.6)** | > 90% contratos cobran | 70–90% | < 70% | Revisar UX cobro monedas / saldo insuficiente / modalidad B |

---

## Segmentación Obligatoria

- **Por modalidad:** Modalidad A (comisión) vs B (monedas) — firma distinta
- **Por origen:** Oferta directa vs contraoferta aceptada vs mediación disputa
- **Por rol firmante primero:** Solicitante primero (común) vs PDS primero (raro)
- **Por monto:** < 50k (exento comisión) vs 50k–200k vs > 200k

---

## Palancas de Intervención

1. **Firma 1-click mobile** → Touch ID / Face ID / PIN → firma en 3 segundos
2. **Recordatorios escalonados** → 30min → 2h → 6h → 12h → 24h (push + in-app + email)
2. **Límite contraofertas** → Máx 2 rondas → mediación automática Soporte
2. **Vista previa contrato** → PDF preview antes de firmar → reduce arrepentimiento
2. **Cobro monedas integrado** → Saldo visible + "Recarga 50 monedas = $5.000" 1-click

---

## Riesgo Si Se Ignora

- **Tasa firma < 60%** → Contratos "fantasma" creados pero no firmados → PDS/Sol frustados → churn
- **Tiempo firma > 24h** → PDS busca otra solicitud / Solicitante cancela → contrato muerto
- **Contraofertas > 80%** → Negociación infinita → Soporte saturado / mediación manual

---

## Métricas Complementarias

- **B2.3 (Tasa Postulación)** → Input: ofertas recibidas
- **B2.4 (Tiempo 1ª Oferta)** → Velocidad entrada a negociación
- **D2.1 (Estados Chamba)** → Output: contrato firmado → Chamba creada
- **D3.4 (Pago Efectivo)** → Contrato firmado → pago dual check-in

---

## Alineación Estándares

- **RF-06, RF-07** — Gestión Contractual y Órdenes de Trabajo
- **RF-23** — Confirmación Dual (firma paralela)
- **RNF-AUD** — Auditoría inmutable (firma registrada en audit_logs)
- **Ley 527/1999** — Clickwrap vinculante (firma digital = firma manuscrita)

---

## Plantilla de Decisión

> **Si hoy:** Tasa firma bilateral < 60% **O** Tiempo promedio firma > 24h  
> **Entonces:** 1) Activar recordatorios push cada 2h 2) Simplificar UX firma mobile (1-click) 3) Revisar contratos atascados > 24h → llamada mediación Soporte  
> **Owner:** PM Contratos  
> **Revisión:** Cada 4h en hora pico