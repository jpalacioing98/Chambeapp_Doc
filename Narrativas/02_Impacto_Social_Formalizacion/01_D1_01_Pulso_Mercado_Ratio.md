# Narrativa: El Pulso del Mercado — Ratio PDS/Solicitante

**KPI Asociado:** D1.1  
**Nivel:** 🟠 Táctico (diario/semanal)  
**Dimensión:** 1. Distribución de Roles y Equidad de Acceso

---

## La Historia

Este KPI es el **latido del marketplace**. Un ratio de **1.0** significa equilibrio perfecto: por cada solicitante hay un PDS disponible. Por debajo de **0.5**, hay "desierto de talento" — los solicitantes publican y nadie ofertta. Por encima de **2.0**, hay "hambre de trabajo" — los PDS compiten ferozmente, bajan precios, y la calidad puede resentirse.

---

## Qué Nos Dice Realmente

| Ratio | Interpretación | Acción Inmediata |
|-------|----------------|------------------|
| **< 0.5** | Desierto de talento: solicitantes publican, nadie ofertta | Campaña urgente captación PDS (bonos referidos, 0% comisión, marketing barrios) |
| **0.5 – 0.8** | Mercado comprador: solicitantes eligen, PDS deben diferenciarse | Incentivar PDS: TrustScore, portfolio, badges, monedas por ofertar |
| **0.8 – 1.5** | **Zona óptima**: matching fluido, precios justos, ambos lados satisfechos | Mantener: monitorear semanal |
| **1.5 – 2.0** | Mercado vendedor leve: PDS eligen, solicitantes mejoran oferta | Monitorear: ¿precios suben? ¿calidad baja? |
| **> 2.0** | Hambre de trabajo: PDS compiten ferozmente, precios bajan, calidad riesgo | Campaña captación Solicitantes / revisar precios sugeridos |

---

## Segmentación Obligatoria

- **Por categoría:** Plomería (ratio 0.3) vs Jardinería (ratio 2.0) vs Electricidad (0.5) vs Aseo (3.0)
- **Por región:** Valledupar centro (1.2) vs Corregimientos (0.2) vs Barrios periféricos (0.8)
- **Por hora:** Pico 7–9am (ratio distinto) vs Noche (ratio distinto)
- **Por cohorte:** Usuarios nuevos (ratio distinto) vs veteranos

---

## Palancas de Intervención

1. **Campaña "Semana del PDS"** → 0% comisión 7 días + 100 monedas bono primer contrato
2. **Seeding geográfico** → 5 PDS "embajadores" por barrio/corregimiento sin cobertura
2. **Referidos gamificados** → 25 monedas por referido PDS que complete 1er contrato
2. **Marketing hiperlocal** → WhatsApp/Instagram segmentado por barrio: "¿Eres plomero en La Mesa? Gana $X/semana"
2. **Incentivos asimétricos** → PDS: 0% comisión 3m + 50 monedas | Solicitante: 50 monedas bienvenida

---

## Riesgo Si Se Ignora

- **Ratio < 0.3 por 2 semanas** → Solicitantes dejan de publicar → MAU cae 30% en 2 semanas → revenue 0
- **Ratio > 3.0 por 2 semanas** → PDS bajan precios 40% → calidad cae → disputas suben 3x → TrustScore degrada
- **Concentración geográfica** → Plataforma "solo para el centro" → exclusión sistemática corregimientos

---

## Métricas Complementarias

- **D1.2 (KYC Completion)** → PDS activos ≠ PDS con KYC
- **D1.3 (Activación D7)** → Usuario nuevo → primer contrato
- **B2.3 (Tasa Postulación)** → Output directo del ratio
- **D3.1 (Umbral 10 Contratos)** → Output largo plazo del ratio sano

---

## Alineación Estándares

- **ODS 8.3** — Formalización empleo (liquidez mercado = más contratos formales)
- **ODS 10.2** — Inclusión (distribución geográfica equitativa)
- **IRIS+ PI4060** — Trabajadores en empleo formal (MAU PDS con contratos)

---

## Plantilla de Decisión (Para SuperAdmin/PM Crecimiento)

> **Si esta semana:** Ratio PDS/Solicitante < 0.5 **POR 3 DÍAS CONSECUTIVOS** en categoría X  
> **Entonces:** Activar campaña "Semana del PDS en [Categoría]" (0% comisión 7d + 100 monedas bono + seeding 3 barrios)  
> **Owner:** PM Crecimiento  
> **Revisión:** Próximo lunes en standup métricas