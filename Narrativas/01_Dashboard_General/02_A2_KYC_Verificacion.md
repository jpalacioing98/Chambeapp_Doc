# Narrativa: KYC y Verificación de Identidad (Módulo A)

**KPIs Asociados:** A2.1–A2.6  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo A — KYC y Verificación de Identidad

---

## La Historia

El **KYC es el pasaporte a la formalidad**. Sin KYC aprobado, el PDS no firma contratos, no cobra, no gana TrustScore, no accede a certificados, no recibe alertas Ley 1429. Cada PDS sin KYC es un trabajador invisible para el sistema financiero y el Estado. La **cola de pendientes (A2.2)** es el termómetro operativo: si supera 50, los verificadores no dan abasto y los PDS abandonan.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **KYC Completion Rate (A2.1)** | PDS > 60%, Sol > 40% | PDS 40–60%, Sol 25–40% | PDS < 40%, Sol < 25% | Auto-aprobación docs simples + más verificadores |
| **Pendientes Revisión (A2.2)** | < 20 | 20–50 | > 50 | Alert Slack verificadores + reasignación automática |
| **Tiempo Promedio Revisión (A2.3)** | P90 < 24h | P90 24–48h | P90 > 48h | Auto-aprobación cédula/selfie (5 min) + cola priorizada |
| **Tasa Aprobación (A2.4)** | > 80% por tipo doc | 60–80% | < 60% | Revisar guías verificador / capacitación / docs ambiguos |
| **Multi-instancia Activa (A2.5)** | > 20% PDS usan | 10–20% | < 10% | Educar: "Una certificación por habilidad" |
| **Bloqueados por KYC (A2.6)** | < 5% intentos bloqueados | 5–15% | > 15% | Revisar UX gate: ¿usuario entiende por qué no puede ofertar? |

---

## Segmentación Obligatoria

- **Por tipo documento:** Cédula (auto-aprobable) vs Antecedentes (humano) vs Certificación SENA (humano + API)
- **Por verificador:** Carga de trabajo, tiempo promedio, tasa aprobación (detectar outliers)
- **Por rol:** PDS (11 docs) vs Solicitante (8) vs Merchant (9)
- **Por región:** Verificadores regionales (scope ADR-3)

---

## Palancas de Intervención

1. **Auto-aprobación 5 min:** Cédula + selfie liveness + OCR = aprobado automático (80% docs)
2. **Verificador dedicado SENA:** API carné QR + verificación batch
3. **Cola priorizada:** Docs > 24h → alerta Slack + reasignación automática
3. **UX Gate explicativo:** "Para ofertar necesitas: ✅ Cédula ✅ Selfie ⏳ Antecedentes"
4. **Incentivo completación:** 50 monedas al terminar KYC (solo PDS)

---

## Riesgo Si Se Ignora

- **Cola > 100** → Tiempo revisión > 72h → PDS abandonan → MAU cae → revenue 0
- **P90 > 48h** → Violación Ley 1429 Art. 29 (trámites ≤ 48h) → riesgo legal
- **Tasa aprobación < 60%** → Verificadores mal entrenados / docs confusos / fraude no detectado

---

## Métricas Complementarias

- **A1.3 (Activación D7)** → KYC completado ≠ usuario activo
- **A3.1 (TrustScore Niveles)** → KYC = 25% peso TrustScore
- **D3.2 (Alertas Ley 1429)** → Solo PDS con KYC reciben alertas
- **D4.5 (Fraude KYC)** → Integridad del proceso

---

## Alineación Estándares

- **Ley 1429/2010 Art. 29** — Trámites formalización ≤ 48h
- **Ley 1581/2012** — Habeas Data (consentimiento docs)
- **ODS 16.3** — Estado de derecho (procesos justos, trazables)
- **IRIS+ OI5922** — Seguridad social (KYC = puerta de entrada)

---

## Plantilla de Decisión (Para SuperAdmin/Verificador)

> **Si hoy:** Pendientes KYC > 50 **O** P90 revisión > 36h  
> **Entonces:** 1) Activar auto-aprobación cédula/selfie 2) Asignar 2 verificadores extra 3) Alerta Slack canal #kyc-urgente  
> **Owner:** Lead Verificadores  
> **Revisión:** Cada 2h hasta cola < 20