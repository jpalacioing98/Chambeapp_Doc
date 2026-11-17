# Narrativa: Anuncios Laborales y Negocios (Módulo D)

**KPIs Asociados:** D5.1–D5.6  
**Nivel:** 🟠 Táctico (diario/semanal) / 🔴 Crítico (mensual)  
**Dimensión:** Módulo D — Anuncios Laborales y Negocios (Merchant)

---

## La Historia

Los **Anuncios Laborales (RF-67..69)** son el **canal de empleo formal**: un Merchant (negocio verificado) publica vacante → PDS se postula → si modalidad "contrato" → se genera Contract + Chamba + FSM 6 hitos + **seguridad social desde día 1**. La **conversión Anuncio→Contrato (D5.5)** mide si este canal **genera empleo real** o es solo vitrina.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Merchants KYC Aprobados (D5.1)** | Creciente + > 50 activos | Estable 20–50 | < 20 o cayendo | Campaña "Registra tu Negocio" + KYC express gratis |
| **Anuncios Publicados/día (D5.2)** | > 10/día | 3–10/día | < 3/día | Campaña "Publica Gratis" + 0 monedas modalidad "contrato" |
| **Modalidad Contrato vs Contacto (D5.3)** | Contrato > 50% | 20–50% | < 20% | Incentivar: 0 monedas "contrato" vs 10 "contacto" + badge "Empleo Formal" |
| **Postulaciones/Anuncio (D5.4)** | Promedio ≥ 5 | 2–5 | < 2 | Push geo PDS matching / monedas por postular |
| **Conversión Anuncio→Contrato (D5.5)** | > 10% | 5–10% | < 5% | Revisar UX modalidad "contrato" / incentivos Merchant |
| **Top 10 Merchants Revenue (D5.6)** | Diversificado (ninguno > 20%) | 1–2 dominan | 1 solo > 40% | Diversificar: onboarding nuevos sectores |

---

## Segmentación Obligatoria

- **Por modalidad:** "Contrato" (vinculante, genera Contract+Chamba) vs "Contacto" (solo contacto)
- **Por sector:** Construcción vs Servicios vs Comercio vs Estética
- **Por tipo:** Empleo (relación laboral) vs Servicio (contratación) vs Producto vs Oferta
- **Por Merchant:** KYC aprobado vs pendiente (solo aprobados publican "contrato")

---

## Palancas de Intervención

1. **Incentivo modalidad "Contrato"** → 0 monedas publicar "contrato" vs 10 monedas "contacto" + badge "Empleo Formal"
2. **Onboarding Merchant guiado** → KYC express (4h) + plantilla anuncio + precios sugeridos
2. **Push geo PDS matching** → "Vacante plomería en tu zona. Postula 1-click = 5 monedas"
2. **Badge "Empleo Formal"** → Anuncios modalidad "contrato" → visible en feed + prioridad ranking
2. **Analytics Merchant** → Dashboard: postulaciones, conversión, tiempo contrato, rating PDS contratados

---

## Riesgo Si Se Ignora

- **Conversión < 5%** → Anuncios = vitrina vacía → PDS dejan de postular → Merchants dejan de publicar
- **Modalidad "Contacto" > 80%** → Canal empleo formal muerto → solo contactos informales
- **Merchants < 20** → Canal empleo muerto → PDS pierden ruta a empleo formal + seguridad social

---

## Métricas Complementarias

- **D5.1 (Merchants KYC)** → Precondición: solo Merchants KYC aprueban "contrato"
- **D3.1 (Contratos Día)** → Output: Anuncio "contrato" → Contract + Chamba
- **D3.7 (Calificación)** → PDS contratado vía anuncio → calificación → TrustScore
- **D3.6 (PDS→Merchant)** → Output final: PDS formalizado → se vuelve Merchant

---

## Alineación Estándares

- **RF-67, RF-68, RF-69** — Anuncios Laborales completo
- **RF-31..48** — Módulo Comerciante/Negocios
- **Ley 1429/2010** — Empleo formal generado vía anuncios
- **ODS 8.3, 8.5** — Formalización + Empleo pleno productivo

---

## Plantilla de Decisión

> **Si hoy:** Conversión Anuncio→Contrato < 5% **O** Modalidad "Contrato" < 20%  
> **Entonces:** 1) Costo publicar "Contrato" = 0 monedas (vs 10 "Contacto") 2) Badge "Empleo Formal" visible 3) Push Merchant: "Cambia a modalidad Contrato = 0 costo + seguridad social"  
> **Owner:** PM Merchant  
> **Revisión:** Semanal lunes