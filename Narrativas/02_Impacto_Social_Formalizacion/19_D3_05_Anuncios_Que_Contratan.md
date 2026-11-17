# Narrativa: Anuncios que Contratan — El Canal Merchant

**KPI Asociado:** D3.5  
**Nivel:** 🟠 Táctico (semanal) / 🔴 Crítico (mensual)  
**Dimensión:** 3. Transición a Empleo Formal y Formalización

---

## La Historia

Los **Anuncios Laborales (RF-67..69)** son el **canal de empleo formal**: un Merchant (negocio verificado) publica vacante → PDS se postula → si modalidad "contrato" → se genera Contract + Chamba + FSM 6 hitos + **seguridad social desde día 1**. La **conversión Anuncio→Contrato (D3.5)** mide si este canal **genera empleo real** o es solo vitrina.

---

## Qué Nos Dice Realmente

| Conversión Anuncio→Contrato | Interpretación | Acción Inmediata |
|----------------------------|----------------|------------------|
| **< 5%** | Anuncios decorativos: negocios publican "por imagen", no contratan, PDS pierden tiempo postulando | Revisar UX modalidad "contrato" / incentivos Merchant / calidad postulaciones |
| **5–10%** | Funcional: algunos contratos reales, pero mayoría modalidad "contacto" (no vinculante) | Incentivar modalidad "contrato": 0 monedas vs 10 "contacto" + badge "Empleo Formal" |
| **> 10% + Modalidad "Contrato" > 50%** | **Motor empleo formal**: anuncios = vacantes reales, PDS ganan empleo + seguridad social | Escalar: campaña "Contrata Formal" + incentivos Merchant + onboarding guiado |

---

## La Clave: Modalidad "Contrato" vs "Contacto" (RF-68)

- **Modalidad "Contacto" (default actual):** Solo contacto → PDS postula → Merchant contacta/descarta → **NO vinculante** → NO genera Contract/Chamba → **NO seguridad social**
- **Modalidad "Contrato" (nueva):** Postulación → Merchant elige → se genera **Contract + Chamba + FSM 6 hitos** → **Seguridad social desde día 1**

**La clave:** Hacer que **"Contrato" sea la opción por defecto y gratis.**

---

## Palancas de Intervención

1. **Incentivo modalidad "Contrato":** 0 monedas publicar "contrato" vs 10 monedas "contacto" + badge "Empleo Formal" visible en feed
2. **Onboarding Merchant guiado:** KYC express (4h) + plantilla anuncio + precios sugeridos + "Contrato = 0 monedas + Empleo Formal"
2. **Push geo PDS matching:** "Vacante plomería en tu zona. Postula 1-click = 5 monedas"
2. **Badge "Empleo Formal":** Anuncios modalidad "contrato" → visible en feed + prioridad ranking ML
2. **Analytics Merchant:** Dashboard: postulaciones, conversión, tiempo contrato, rating PDS contratados

---

## Riesgo Si Se Ignora

- **Conversión < 5% por 6+ meses** → Anuncios = vitrina vacía → PDS dejan de postular → Merchants dejan de publicar → canal empleo muerto
- **Modalidad "Contacto" > 80%** → Canal empleo formal muerto → solo contactos informales → **0 seguridad social generada**
- **Merchants < 20 activos** → Canal empleo muerto → PDS pierden ruta a empleo formal + seguridad social

---

## Métricas Complementarias

- **D5.1 (Merchants KYC Aprobados)** → Precondición: solo Merchants KYC publican "contrato"
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

## Plantilla de Decisión (Para PM Merchant/PM Impacto)

> **Si este mes:** Conversión Anuncio→Contrato < 5% **O** Modalidad "Contrato" < 20%  
> **Entonces:** 1) Costo publicar "Contrato" = 0 monedas (vs 10 "Contacto") 2) Badge "Empleo Formal" visible 3) Push Merchant: "Cambia a modalidad Contrato = 0 costo + seguridad social"  
> **Owner:** PM Merchant + PM Impacto  
> **Revisión:** Semanal (standup métricas)