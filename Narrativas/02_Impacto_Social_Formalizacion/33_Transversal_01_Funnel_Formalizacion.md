# Narrativa Transversal: El Funnel de la Formalización — De Registro a Crédito

**KPIs Asociados:** D1.2, D3.1, D3.2, D3.3, D3.4, D3.5  
**Nivel:** 🔴 Crítico (mensual) / 🟠 Táctico (semanal)  
**Dimensión:** Transversal — Funnel Integral de Formalización

---

## La Historia

El **funnel de formalización** cuenta la historia completa: desde que un usuario se registra hasta que accede a crédito formal. **Cada caída es una intervención; cada conversión es un impacto validado.**

```
REGISTRO (100%)
    ↓ KYC APROBADO (60%)          ← Puerta de entrada (D1.2)
    ↓ PRIMER CONTRATO (40%)       ← Matching + confianza (B2.3, D1.1)
    ↓ 10 CONTRATOS (20%)          ← Umbral Ley 1429 (D3.1)
    ↓ ALERTA ENVIADA (100%)       ← RF-10 automática (D3.2)
    ↓ AFILIACIÓN SEG. SOCIAL (30%)← Conversión alerta→acción (D3.2)
    ↓ CERTIFICADO EMITIDO (40%)   ← RF-13 $25k (D3.3)
    ↓ CRÉDITO APROBADO (15%)      ← Validación externa (D3.4)
```

**Cada flecha es una métrica, cada caída es una intervención.** El funnel completo permite **atribución de impacto**: si 1000 PDS registrados → 150 créditos aprobados, **ROI formalización = 15%**. Si cuello de botella en "KYC → Primer Contrato", **invertir en matching/onboarding**, no en certificados.

---

## Análisis de Cuellos de Botella (Ejemplo Real)

| Etapa | Conversión | Cuello de Botella | Intervención Prioritaria |
|-------|------------|-------------------|-------------------------|
| Registro → KYC | 60% | Docs confusos / Verificadores lentos | Auto-aprobación 5 min + Verificador dedicado |
| KYC → 1er Contrato | 67% | Matching bajo / Ofertas pocas | ML ranking ON + Cascada geo + Monedas por ofertar |
| 1er Contrato → 10 Contratos | 50% | Volumen bajo / Estacionalidad | Incentivos volumen / Marañas / Alertas Ley 1429 |
| 10 Contratos → Alerta | 100% | Automática (RF-10) | Verificar delivery push |
| Alerta → Afiliación | 30% | Trámite complejo / Costo percibido | Afiliación 1-click app + Subsidio 1er mes |
| Afiliación → Certificado | 40% | $25k barrera / No ven utilidad | Subsidio PDS ≥10 contratos = Gratis |
| Certificado → Crédito | 15% | Bancos no aceptan / Trámite lento | Alianza API Bancamía + Caso video |

---

## Atribución de Impacto (ROI Formalización)

Si **1000 PDS registrados → 150 créditos aprobados**:
- **ROI formalización = 15%**
- **Costo por crédito aprobado** = (CAC + Costos operativos) / 150
- **Impacto social por crédito** = Vivienda / Microempresa / Consumo responsable

**Si cuello de botella en "KYC → Primer Contrato" (67% → target 80%):**  
Invertir en **matching/onboarding** genera **2x más impacto** que invertir en certificados.

---

## Segmentación Obligatoria del Funnel

- **Por cohorte mensual:** Enero 2026 vs Julio 2025 (madurez plataforma)
- **Por oficio:** Plomería (funnel rápido) vs Jardinería (funnel lento, estacional)
- **Por canal entrada:** Orgánico vs Referido vs Campaña pagada
- **Por región:** Centro vs Corregimientos
- **Por género/edad/vulnerabilidad:** Equidad en cada etapa

---

## Palancas de Intervención por Etapa

| Etapa | Palanca | KPI Target |
|-------|---------|------------|
| Registro → KYC | Auto-aprobación 5 min + Verificador dedicado | KYC > 70% |
| KYC → 1er Contrato | ML ranking ON + Cascada geo + Monedas por ofertar | Tasa postulación > 70% |
| 1er Contrato → 10 Contratos | Incentivos volumen + Marañas + Alertas Ley 1429 | % PDS ≥10 contratos > 25% |
| Alerta → Afiliación | Afiliación 1-click app + Subsidio 1er mes | Conversión > 50% |
| Afiliación → Certificado | Subsidio PDS ≥10 contratos = Gratis | Tasa emisión > 50% |
| Certificado → Crédito | Alianza API Bancamía + Caso video | Aprobación > 15% |

---

## Riesgo Si Se Ignora

- **Funnel roto en etapa temprana** → Invertir en certificados (etapa final) = dinero quemado
- **Sin atribución** → No saber qué interventions funcionan → Gasto ineficiente
- **Cuello de botella no detectado** → Años invirtiendo en etapa equivocada → Impacto social nulo

---

## Métricas Complementarias (Todas las del Funnel)

- **A1.2 (KYC Completion)** → Etapa 1
- **B2.3 (Tasa Postulación)** → Etapa 2
- **D1.1 (Contratos Día)** → Etapa 2 output
- **D3.1 (Umbral 10 Contratos)** → Etapa 3
- **D3.2 (Alerta → Afiliación)** → Etapa 4
- **D3.3 (Certificados Emitidos)** → Etapa 5
- **D3.4 (Créditos Aprobados)** → Etapa 6 (Outcome final)

---

## Alineación Estándares

- **ODS 1.3, 8.3, 10.2** — Protección social, formalización, inclusión
- **Ley 1429/2010, 1562/2012, 527/1999** — Marco legal completo
- **IRIS+ PI4060, PI8330, PI1248, OI5922** — Métricas estandarizadas impacto

---

## Plantilla de Decisión (Para PM Impacto/CEO/Junta/Inversionistas)

> **Si este mes:** Cuello de botella detectado en Etapa X (conversión < target por 2+ meses)  
> **Entonces:** 1) Auditoría etapa X: ¿Por qué cae? (datos + entrevistas) 2) Diseñar intervención específica 3) Medir impacto 30 días 4) Escalar si funciona / Pivotar si no  
> **Owner:** PM Impacto + PM Producto + Data  
> **Revisión:** Mensual (board deck)