# Narrativa: Exploración y Postulación (Módulo B)

**KPIs Asociados:** B2.1–B2.6  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo B — Exploración y Postulación

---

## La Historia

Estas métricas cuentan **qué tan líquido es el mercado**: ¿las solicitudes encuentran ofertas rápido? ¿Los PDS ofertan o solo miran? El **tiempo a primera oferta (B2.4)** es crítico: una solicitud "urgente: hoy" que recibe primera oferta a las 4 horas **ha fallado su promesa**. La **tasa de postulación (B2.3)** mide si el marketplace tiene liquidez real o es escaparate vacío.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Solicitudes/día (B2.1)** | Creciente + estable | Plano | Caída > 15% WoW | Campaña "Publica Gratis" + incentivos Solicitante |
| **Ofertas/Solicitud (B2.2)** | Promedio ≥ 2.5 | 1.5–2.5 | < 1.5 | Incentivar PDS: notificaciones geo + monedas por ofertar |
| **Tasa Postulación (B2.3)** | > 70% | 50–70% | < 50% | Revisar matching / notificaciones / incentivos PDS |
| **Tiempo 1ª Oferta (B2.4)** | Urgente "hoy" < 30min | 30min–2h | > 2h | Notificaciones push geo + cascada 2/5/15km + monedas por ofertar rápido |
| **Distribución Urgencia (B2.5)** | Balanceada (hoy/semana/flexible) | Sesgada > 70% una | > 90% una | Educar Solicitante: usa "flexible" si no es urgente real |
| **Solicitudes con 360° (B2.6)** | > 30% | 15–30% | < 15% | UX: "Añade 360° y recibe 2x más ofertas" + 10 monedas |

---

## Segmentación Obligatoria

- **Por urgencia:** "Hoy" (target < 30min) vs "Semana" (< 4h) vs "Flexible" (< 24h)
- **Por categoría:** Plomería/eléctrica (ofertas rápidas) vs Jardinería (más lentas)
- **Por hora:** Pico 7–9am → ofertas en < 15min; noche → > 2h
- **Por geocerca:** Radio 2km (cascada fase 1) vs 15km (fase 3)

---

## Palancas de Intervención

1. **Cascada geoespacial (RF-Geo-2)** → 2km/5min → 5km/10min → 15km/15min + monedas por ofertar en fase 1
2. **Notificaciones push geo** → "Solicitud plomería a 800m de ti. Oferta en 1 click = 10 monedas"
3. **Monedas por ofertar rápido** → 5 monedas si ofertas en < 15min (fase 1 cascada)
3. **UX "Urgencia real"** → Solicitante selecciona "hoy" → confirmación: "¿Realmente necesitas hoy? Si es flexible, eliges 'semana' y recibes más ofertas"
3. **Matching priorizado** → Solicitudes "hoy" sin ofertas en 30min → boost en ranking ML + notificación PDS top 5

---

## Riesgo Si Se Ignora

- **Tiempo 1ª oferta "hoy" > 2h** → Solicitante cancela / va a competidor / pierde confianza
- **Tasa postulación < 50%** → Mercado ilíquido → Solicitantes dejan de publicar → PDS se van
- **Ofertas/solicitud < 1.5** → Matching roto / PDS no notificados / incentivos insuficientes

---

## Métricas Complementarias

- **B1.5 (CTR ML)** → Recomendaciones → Ofertas
- **B1.6 (Conversión Rec→Contrato)** → Funnel completo
- **D1.1 (Contratos Día)** → Output final
- **D2.1 (Estados Chamba)** → Calidad postulación → ejecución

---

## Alineación Estándares

- **ODS 8.3** — Formalización (liquidez mercado = más contratos formales)
- **RNF-04** — Rendimiento (búsqueda ≤ 2s, oferta 1 click)
- **RF-Geo-2** — Cascada geoespacial implementada

---

## Plantilla de Decisión

> **Si hoy:** Tiempo 1ª oferta "hoy" > 2h **O** Tasa postulación < 50%  
> **Entonces:** 1) Boost monedas ofertar fase 1 cascada (5→15 monedas) 2) Push geo PDS radio 5km 3) Boost ranking ML solicitudes "hoy" sin ofertas 30min  
> **Owner:** PM Matching  
> **Revisión:** Cada 2h en hora pico (7–10am, 6–9pm)