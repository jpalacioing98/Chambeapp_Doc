# Narrativa: Validación Externa — ¿Los Bancos Confían en ChambeApp?

**KPI Asociado:** D3.4  
**Nivel:** 🔴 Crítico (trimestral) / 🔴 Crítico (anual)  
**Dimensión:** 3. Transición a Empleo Formal y Formalización

---

## La Historia

El certificado **solo vale si terceros lo aceptan**. Este KPI mide **validación de mercado**: ¿Bancolombia, Davivienda, Bancamía, Financieras, cajas de compensación piden/aceptan el certificado ChambeApp?

---

## Qué Nos Dice Realmente

| Alianzas Bancarias Activas | Interpretación | Acción Inmediata |
|---------------------------|----------------|------------------|
| **0** | Certificado ornamental: PDS gasta $25k, banco dice "no lo conozco", frustración total | Alianza técnica API + caso demostrado + marco legal |
| **1–2 Pilotos** | Validación incipiente: una entidad lo acepta, PDS de esa zona se benefician | Escalar: caso demostrado + marco legal + más entidades |
| **≥ 3 Entidades + 15% Aprobación** | **Estándar de facto**: certificado = moneda de cambio financiera | Escalar: API estandarizada + certificado portable (Ley 1581) |

---

## Estrategia de Alianzas (3 Fases)

**Fase 1 (Mes 1-3):** Piloto con **Bancamía** (enfoque microcrédito, población vulnerable)
- API certificado verificable via QR + firma digital
- 50 PDS piloto ≥10 contratos → certificado gratis → solicitud microcrédito
- Métrica: % aprobación vs control (sin certificado)

**Fase 2 (Mes 4-8):** **Bancamía + Bancamía + 1 Caja Compensación**
- Estandarizar API: QR + firma digital + campos estandarizados (ingresos 12m, contratos, rating, KYC)
- 200 PDS → certificados → solicitudes crédito/vivienda
- Métrica: % aprobación ≥ 15%

**Fase 3 (Mes 9-12):** **Estandar de facto** — 3+ entidades + certificado = requisito estándar
- API pública documentada (Swagger) + sandbox pruebas
- Certificado portable (Ley 1581 portabilidad) → PDS lleva su historial a cualquier plataforma
- Métrica: ≥ 3 entidades + 15% aprobación + 500 PDS/año usan certificado

---

## Marco Legal Requerido

- **Ley 527/1999** — Comercio electrónico, certificados digitales válidos
- **Decreto 1273/2018** — Facturación electrónica, certificados ingresos
- **Ley 1581/2012** — Habeas Data (portabilidad datos, consentimiento)
- **Circular Superfinanciera** — Requisitos certificación ingresos para crédito
- **Acuerdo marco:** Responsabilidad ChambeApp (veracidad datos) vs Banco (decisión crédito)

---

## Segmentación Obligatoria

- **Por entidad:** Bancolombia (masivo) vs Davivienda (masivo) vs Bancamía (microcrédito) vs Financieras (nicho) vs Cajas (subsidio vivienda)
- **Por producto:** Microcrédito (< $5M) / Crédito consumo ($5-50M) / Vivienda (> $50M) / Tarjeta crédito
- **Por PDS nivel:** Experto/Verificado (aprobación > 30%) vs Nuevo/Confiable (aprobación < 10%)
- **Por región:** Valledupar (piloto) vs Sincelejo/Riohacha (expansión)

---

## Riesgo Si Se Ignora

- **0 alianzas por 12+ meses** → Certificado "papel mojado" → PDS gasta $25k, banco dice "no lo conozco" → frustración total → churn masivo PDS ≥10 contratos
- **Alianza sin API** → Verificación manual → 2-3 semanas → PDS pierde oportunidad crédito → frustración
- **Solo 1 entidad** → Dependencia única → si entidad cambia política → certificado inútil

---

## Métricas Complementarias

- **D3.3 (Certificados Emitidos)** → Input: certificados disponibles para validar
- **D3.1 (Umbral 10 Contratos)** → PDS elegibles = demanda certificados
- **D3.7 (Prima Formalidad)** → Certificado aceptado = prima precio
- **D3.5 (Anuncios→Contrato)** → Empleo formal = ingresos certificables

---

## Alineación Estándares

- **Ley 527/1999** — Certificados digitales válidos
- **Decreto 1273/2018** — Certificados ingresos electrónicos
- **Ley 1581/2012** — Portabilidad datos (certificado portable)
- **ODS 8.3, 8.10, 10.2** — Formalización, acceso servicios financieros, inclusión
- **IRIS+ PI1248** — Acceso servicios financieros

---

## Plantilla de Decisión (Para PM Impacto/Alianzas/Financiero/Legal)

> **Si este trimestre:** 0 alianzas bancarias activas **O** % aprobación certificados < 10%  
> **Entonces:** 1) Iniciar piloto API Bancamía (Mes 1-3) 2) Definir API estándar QR + firma digital 3) Caso video PDS real + marco legal 4) Escalar a 3 entidades Mes 9  
> **Owner:** PM Impacto + Alianzas + Legal + Financiero  
> **Revisión:** Trimestral (board deck)