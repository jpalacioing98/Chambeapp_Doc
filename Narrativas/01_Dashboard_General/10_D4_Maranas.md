# Narrativa: Marañas — Micro-trabajos Derivados (Módulo D)

**KPIs Asociados:** D4.1–D4.4  
**Nivel:** 🟡 Operativo (diario) / 🟠 Táctico (semanal)  
**Dimensión:** Módulo D — Marañas (Rebusque)

---

## La Historia

Las **Marañas (RF-59, RF-60)** son el **"primer escalón"** para PDS novatos y el **motor de agilidad** para adendas que requieren otro perfil. Una adenda de plomería en una chamba de pintura → se deriva como maraña → PDS plomero la toma → se paga por separado (dual check-in). La **tasa de asignación (D4.2)** mide si el mercado de micro-trabajos **tiene liquidez**.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Maranas Creadas/día (D4.1)** | Creciente + > 5/día | Estable 1–5/día | 0 por 2+ días | Revisar adendas "otro_pds" / UX deriva maraña |
| **Tasa Asignación (D4.2)** | > 70% | 50–70% | < 50% | Notificaciones push PDS perfil matching / monedas por ofertar |
| **Presupuesto Total Marañas (D4.3)** | Creciente + alineado adendas | Plano | 0 por semana | Revisar adendas "otro_pds" sin derivar |
| **Tiempo Publicada→Pagada (D4.4)** | < 48h | 48h–5d | > 5d | Recordatorios PDS/Sol / mediación Soporte |

---

## Segmentación Obligatoria

- **Por categoría origen:** Adenda plomería en chamba pintura vs electricidad en chamba construcción
- **Por presupuesto:** < 50k (rápida) vs > 200k (negociación)
- **Por PDS asignado:** Novato (primera maraña) vs Experto (recurrente)
- **Por origen chamba:** Adenda "otro_pds" vs adenda "cubierta_por=otro_pds"

---

## Palancas de Intervención

1. **UX deriva maraña 1-click** → En adenda "otro_pds": botón "Crear Maraña" → auto-llena datos → publica
2. **Notificaciones push matching** → "Maraña plomería a 500m de ti. 50 monedas por ofertar en 15min"
2. **Monedas por ofertar rápido** → 10 monedas si ofertas en < 30min
2. **Recordatorios dual check-in** → Maraña completada → "Confirma pago" ambos lados
2. **Mediación automática** → Maraña > 5d en "Asignado" → Soporte media

---

## Riesgo Si Se Ignora

- **Maranas 0/día** → Adendas "otro_pds" se acumulan → chambas se atrasan → PDS frustrados
- **Tasa asignación < 50%** → Mercado marañas ilíquido → PDS no ven valor → adendas se cancelan
- **Tiempo pagada > 5d** → Capital atrapado → PDS dejan de aceptar marañas

---

## Métricas Complementarias

- **D2.5 (Adendas/Chamba)** → Input: adendas "otro_pds" → Output: marañas
- **D2.3 (Tiempo por Hito)** → Maraña derivada acelera hito 3 (adenda)
- **D3.4 (Pago Efectivo Dual)** → Maraña usa mismo dual check-in
- **D4.2 (Tasa Asignación)** → Liquidez mercado micro-trabajos

---

## Alineación Estándares

- **RF-59, RF-60** — Marañas implementadas completo
- **RF-53** — Adendas generan marañas
- **RF-23** — Dual check-in aplicado a marañas
- **ODS 8.3** — Formalización (marañas = trazabilidad micro-trabajos)

---

## Plantilla de Decisión

> **Si hoy:** Maranas creadas = 0 por 2 días **O** Tasa asignación < 50%  
> **Entonces:** 1) Revisar adendas "otro_pds" sin derivar 2) Push PDS matching: "Maraña cerca de ti" 3) Boost monedas ofertar maraña (5→20 monedas)  
> **Owner:** PM Marañas  
> **Revisión:** Diario 9am