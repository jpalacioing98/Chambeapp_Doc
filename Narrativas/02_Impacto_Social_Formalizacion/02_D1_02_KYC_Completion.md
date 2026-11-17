# Narrativa: La Puerta de Entrada — KYC Completion Rate

**KPI Asociado:** D1.2  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** 1. Distribución de Roles y Equidad de Acceso

---

## La Historia

El **KYC es el pasaporte a la formalidad**. Sin KYC aprobado, el PDS no firma contratos, no cobra, no gana TrustScore, no accede a certificados de ingresos, no recibe alertas Ley 1429. Cada PDS sin KYC es un trabajador invisible para el sistema financiero y el Estado. La **cola de pendientes (D1.2 / A2.2)** es el termómetro operativo: si supera 50, los verificadores no dan abasto y los PDS abandonan.

---

## Qué Nos Dice Realmente

| KYC PDS | Interpretación | Acción Inmediata |
|---------|----------------|------------------|
| **> 60%** | Madurez: mayoría puede operar plenamente | Mantener: monitorear cuellos de botella por tipo doc |
| **40–60%** | Progreso: verificar cuellos de botella | Auto-aprobación docs simples (cédula, selfie) + más verificadores |
| **< 40%** | Onboarding roto: docs confusos, verificadores saturados, UX confusa | **Crítico**: Auto-aprobación cédula/selfie (5 min) + 2 verificadores extra |

| KYC Solicitante | Interpretación | Acción |
|-----------------|----------------|--------|
| **> 40%** | Madurez | Mantener |
| **25–40%** | Progreso | Revisar UX gate: ¿usuario entiende por qué no puede publicar? |
| **< 25%** | Cuello de botella | Simplificar: solo docs esenciales para publicar |

---

## Diferencia Crítica PDS vs Solicitante

El solicitante necesita **menos docs (8 vs 11)**, pero su KYC baja suele ser "no me pediste aún". El PDS la necesita **YA para ofertar**. **Meta asimétrica:** PDS > 60%, Solicitante > 40%.

---

## Cuello de Botella Real: Tiempo de Revisión (D4.10)

Si **P90 > 48h**, el PDS abandona. **Solución:**
1. **Auto-aprobación 5 min:** Cédula + selfie liveness + OCR = aprobado automático (80% docs)
2. **Verificador dedicado SENA:** API carné QR + verificación batch
3. **Cola priorizada:** Docs > 24h → alerta Slack + reasignación automática
4. **UX Gate explicativo:** "Para ofertar necesitas: ✅ Cédula ✅ Selfie ⏳ Antecedentes"

---

## Segmentación Obligatoria

- **Por tipo documento:** Cédula (auto) vs Antecedentes (humano) vs Certificación SENA (humano + API)
- **Por verificador:** Carga trabajo, tiempo promedio, tasa aprobación (detectar outliers)
- **Por rol:** PDS (11 docs) vs Solicitante (8) vs Merchant (9)
- **Por región:** Verificadores regionales (scope ADR-3)

---

## Palancas de Intervención

1. **Auto-aprobación 5 min:** Cédula + selfie liveness + OCR = aprobado automático (80% docs)
2. **Verificador dedicado SENA:** API carné QR + verificación batch
3. **Cola priorizada:** Docs > 24h → alerta Slack + reasignación automática
4. **UX Gate explicativo:** "Para ofertar necesitas: ✅ Cédula ✅ Selfie ⏳ Antecedentes"
5. **Incentivo completación:** 50 monedas al terminar KYC (solo PDS)

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