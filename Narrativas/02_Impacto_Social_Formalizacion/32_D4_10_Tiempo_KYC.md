# Narrativa: Tiempo es Derecho — KYC en 48 Horas

**KPI Asociado:** D4.10  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

**Artículo 29 Ley 1429/2010**: "trámites de formalización no podrán exceder 48 horas". Un PDS que sube docs y espera **> 48h para KYC** → **pierde ofertas, ingresos, confianza**. El **P90 tiempo revisión** mide el percentil 90: 90% de docs resueltos en X horas.

---

## Qué Nos Dice Realmente

| P90 Tiempo Revisión | Interpretación | Acción Inmediata |
|--------------------|----------------|------------------|
| **< 24h** | Derecho garantizado: verificadores escalan, auto-aprobación docs simples, cola priorizada por urgencia | Mantener: monitoreo diario |
| **24–48h** | Límite legal: la mayoría OK, pero cola picos (lunes, post-festivo) rompe SLA | Auto-aprobación docs simples + cola priorizada + alerta Slack > 24h |
| **> 48h** | **Violación legal + pérdida económica**: PDS abandona, solicita reembolso, denuncia Superintendencia | **Auto-aprobación 5 min** + Verificador dedicado + Cola priorizada + Alerta Slack > 24h |

---

## Solución Técnica: Pipeline KYC por Capas

| Capa | Docs | Tiempo | Método |
|------|------|--------|--------|
| **Capa 1: Auto-aprobación (80% docs)** | Cédula + Selfie liveness + OCR | **< 5 min** | Automatizado: OCR + Liveness + Cruce Registraduría API |
| **Capa 2: Verificador Humano (15% docs)** | Antecedentes / Certificaciones / Docs extranjeros | **< 24h** | Verificador dedicado + Cola priorizada por antigüedad |
| **Capa 3: Escalamiento (5% docs)** | Casos complejos / Fraude sospechoso / Docs extranjeros complejos | **< 48h** | Lead Verificador + Legal + Alerta Slack |

---

## Segmentación Obligatoria

- **Por tipo documento:** Cédula (auto 5 min) vs Antecedentes (humano 2h) vs Certificación SENA (humano + API 4h) vs Docs extranjeros (humano 24h)
- **Por verificador:** Carga trabajo / Tiempo promedio / Tasa aprobación / Alertas > 24h
- **Por urgencia:** PDS con ofertas activas (prioridad alta) vs PDS sin ofertas (normal)
- **Por región:** Verificadores regionales (scope ADR-3)

---

## Palancas de Intervención

1. **Auto-aprobación 5 min:** Cédula + Selfie liveness + OCR + Cruce Registraduría API = aprobado en 5 min (80% docs)
2. **Cola priorizada:** Docs > 24h → Alerta Slack verificador + reasignación automática al verificador con menos carga
2. **Verificador dedicado SENA:** API carné QR SENA → verificación instantánea certificación (24/7)
2. **SLA automático:** Job nocturno calcula P90 → Si > 36h → Alerta Slack #kyc-sla + reasignación automática
2. **Dashboard verificador:** Cola priorizada por antigüedad > 24h → alerta roja visual

---

## Riesgo Si Se Ignora

- **P90 > 48h por 2+ semanas** → Violación Ley 1429 Art. 29 → Denuncia Superintendencia / Acción legal PDS afectados
- **PDS abandonan** → Pierden ofertas → Ingresos perdidos → Churn → MAU cae → Revenue cae
- **Verificadores saturados** → Calidad revisión baja → Fraude KYC pasa → TrustScore roto → Certificados fraudulentos

---

## Métricas Complementarias

- **A2.1 (KYC Completion)** → Tiempo revisión afecta completación
- **A2.2 (Pendientes Revisión)** → Cola = tiempo espera
- **A2.3 (Tiempo Promedio)** → Promedio vs P90 (cola larga = P90 alto)
- **D4.5 (Fraude KYC)** → Tiempo presión = calidad baja = fraude pasa
- **D1.2 (KYC Completion)** → Tiempo afecta decisión completar KYC

---

## Alineación Estándares

- **Ley 1429/2010 Art. 29** — Trámites formalización ≤ 48h
- **Ley 1581/2012** — Habeas Data (derecho respuesta oportuna)
- **ODS 16.3** — Estado de derecho (acceso justicia oportuna)
- **ODS 16.6** — Instituciones efectivas (trámites eficientes)
- **IRIS+ OI5922** — Seguridad social (trámites oportunos)

---

## Plantilla de Decisión (Para SuperAdmin/Verificadores/DevOps/Legal)

> **Si hoy:** P90 tiempo revisión KYC > 36h **O** Cola pendientes > 50  
> **Entonces:** 1) Activar auto-aprobación cédula/selfie (si no activa) 2) Asignar 2 verificadores extra 3) Alerta Slack #kyc-sla cada 2h hasta P90 < 24h  
> **Owner:** Lead Verificadores + DevOps + Legal  
> **Revisión:** Cada 2h hasta P90 < 24h