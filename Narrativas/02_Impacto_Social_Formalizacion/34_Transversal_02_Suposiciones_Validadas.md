# Narrativa Transversal: La Teoría del Cambio en Acción — Suposiciones Validadas

**KPIs Asociados:** Todas (Dashboard de Suposiciones)  
**Nivel:** 🔴 Crítico (trimestral) / 🟠 Táctico (mensual)  
**Dimensión:** Transversal — Teoría del Cambio

---

## La Historia

Cada KPI del dashboard valida (o invalida) una **suposición crítica** de la Teoría del Cambio. El dashboard muestra **semáforos por suposición**: 🟢 Validada / 🟡 En prueba / 🔴 Falsa / ⚪ Pendiente. **Cada sprint valida una suposición.** No hay "creencias", solo evidencia.

---

## Matriz de Suposiciones Críticas (Tabla Viva)

| # | Suposición | KPI Validador | Target | Estado | Acción si Falsa |
|---|------------|---------------|--------|--------|-----------------|
| **S1** | PDS adoptan plataforma voluntariamente | MAU PDS > 40% registrados | > 40% | 🟡 En prueba | Incentivos 0% comisión 3m + 50 monedas bienvenida + campaña "Maestro en tu vereda" |
| **S2** | Solicitantes pagan comisión sin evasión | Tasa evasión < 5% | < 5% | 🟡 En prueba | Dual check-in obligatorio + auditoría sample 10% + recordatorios escalonados |
| **S3** | Verificadores KYC escalan | P90 revisión < 48h | < 48h | 🟡 En prueba | Auto-aprobación cédula/selfie (5 min) + 2 verificadores dedicados SENA |
| **S4** | ML mejora matching vs heurístico | CTR ML > heurístico +15% | > 15% | 🟡 En prueba | A/B testing obligatorio (RF-ML-2) + Feature flag OFF automático si degradado |
| **S5** | Certificados ingresos aceptados por banca | 15% aprobación crédito con certificado | > 15% | ⚪ Pendiente | Alianza técnica API Bancamía + Caso video PDS real + Marco legal |
| **S6** | PDS formalizados se quedan | Retención 12m > 65% | > 65% | 🟡 En prueba | TrustScore no exportable + Monedas + Endosos + Alertas recurrentes + Comunidad |
| **S7** | ML no discrimina | KL divergence < 0.05 | < 0.05 | 🟡 En prueba | Adversarial debiasing + Counterfactual fairness + A/B testing continuo |
| **S8** | Evasión comisión controlada | Tasa evasión < 5% | < 5% | 🟡 En prueba | Dual check-in UX 1-click + Auditoría 10%/mes + Recordatorios escalonados |
| **S9** | Scoping regional inquebrantable | Violaciones regionales = 0 | 0 | 🟢 Validada | Scoping en BD + Tests 24/7 + Kill switch `regional_scoping_enabled` |
| **S10** | KYC en 48h (Ley 1429) | P90 revisión < 48h | < 48h | 🟡 En prueba | Auto-aprobación 5 min + Verificador dedicado SENA + Cola priorizada |

---

## Semáforos de Estado (Definiciones)

| Estado | Definición | Acción |
|--------|------------|--------|
| 🟢 **Validada** | KPI ≥ target por 3+ meses consecutivos | Mantener monitoreo / Documentar learning |
| 🟡 **En prueba** | KPI cerca de target / En piloto / En mejora | Intervención activa / Medir 30 días |
| 🔴 **Falsa** | KPI < target por 2+ meses / Evidencia contrafuerte | Pivotar / Rediseñar / Escalar a Junta |
| ⚪ **Pendiente** | KPI no medible aún / Dependencia externa / Fase futura | Definir plan medición / Activar cuando ready |

---

## Proceso de Validación por Sprint

| Sprint | Suposición Foco | KPI Principal | Método Validación | Decisión Fin Sprint |
|--------|-----------------|---------------|-------------------|---------------------|
| 1 | S1 (Adopción PDS) | MAU PDS | Cohort analysis + Encuesta NPS | 🟢/🟡/🔴 |
| 2 | S2 (Evasión) | Tasa evasión | Auditoría sample 20% | 🟢/🟡/🔴 |
| 3 | S3 (KYC Escalado) | P90 KYC | Logs tiempo revisión | 🟢/🟡/🔴 |
| 4 | S4 (ML vs Heurístico) | CTR ML vs Heurístico | A/B test (RF-ML-2) | 🟢/🟡/🔴 |
| 5 | S5 (Certificados Bancos) | % Aprobación crédito | Piloto Bancamía | 🟢/🟡/🔴 |
| 6 | S6 (Retención) | Retención 12m | Cohort analysis 12m | 🟢/🟡/🔴 |
| 7 | S7 (Sesgo ML) | KL Divergence | Auditoría trimestral | 🟢/🟡/🔴 |
| 8 | S8 (Evasión) | Tasa evasión | Auditoría sample | 🟢/🟡/🔴 |
| 9 | S9 (Scoping) | Violaciones regionales | Logs + Tests | 🟢/🟡/🔴 |
| 10 | S10 (KYC 48h) | P90 KYC | Logs tiempo revisión | 🟢/🟡/🔴 |

---

## Dashboard de Suposiciones (UI SuperAdmin)

```
┌─────────────────────────────────────────────────────────────┐
│  TEORÍA DEL CAMBIO — SEMÁFOROS DE SUPOSICIONES              │
├─────────┬──────────────────────┬──────────┬────────┬────────┤
│  ID     │ Suposición           │ KPI      │ Target │ Estado │
├─────────┼──────────────────────┼──────────┼────────┼────────┤
│  S1     │ PDS adopción         │ MAU PDS  │ >40%   │ 🟡     │
│  S2     │ Evasión comisión     │ Evasión  │ <5%    │ 🟡     │
│  S3     │ KYC escalado         │ P90 KYC  │ <48h   │ 🟡     │
│  S4     │ ML > Heurístico      │ CTR ML   │ +15%   │ 🟡     │
│  S5     │ Certificados Bancos  │ Aprobación│ >15%  │ ⚪     │
│  S6     │ Retención 12m        │ Retención│ >65%   │ 🟡     │
│  S7     │ Sesgo ML             │ KL Div   │ <0.05  │ 🟡     │
│  S8     │ Evasión controlada   │ Evasión  │ <5%    │ 🟡     │
│  S9     │ Scoping regional     │ Violaciones│ 0     │ 🟢     │
│  S10    │ KYC 48h              │ P90 KYC  │ <48h   │ 🟡     │
└─────────┴──────────────────────┴──────────┴────────┴────────┘
```

---

## Riesgo Si Se Ignora

- **Suposición falsa no detectada** → Años invirtiendo en estrategia equivocada → Recursos quemados / Impacto nulo
- **Suposición válida no escalada** → Oportunidad perdida / Ventaja competitiva perdida
- **Sin semáforos** → Decisiones basadas en intuición / Política interna / HiPPO (Highest Paid Person's Opinion)

---

## Métricas Complementarias (Todas)

- **Todas las 60+ KPIs** del dashboard → Cada una valida/invalida una suposición
- **Dashboard semáforos** → Vista ejecutiva inmediata
- **Log de decisiones** → Trazabilidad: ¿Por qué se pivotó? ¿Qué evidencia?

---

## Alineación Estándares

- **Teoría del Cambio (Logframe)** — Marco metodológico estándar cooperación internacional
- **ODS 17.16, 17.19** — Alianzas efectivas, datos seguimiento
- **IRIS+** — Métricas estandarizadas impacto
- **GRI 3-3** — Gestión temas materiales (suposiciones = temas materiales)

---

## Plantilla de Decisión (Para PM Impacto/CEO/Junta/Inversionistas)

> **Si revisión mensual:** Suposición X en 🔴 Falsa por 2+ meses  
> **Entonces:** 1) Documentar evidencia contrafuerte 2) Definir pivot: ¿Qué cambiar? (Producto / Modelo / Mercado) 3) Comunicar a Junta/Inversionistas con evidencia 4) Ejecutar pivot en < 30 días  
> **Owner:** PM Impacto + CEO  
> **Revisión:** Mensual (board deck)