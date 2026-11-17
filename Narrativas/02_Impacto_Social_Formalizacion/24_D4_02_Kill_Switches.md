# Narrativa: Los Interruptores de Emergencia — Kill Switches

**KPI Asociado:** D4.2  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

Los **Feature Flags** son **los mandos de control de la plataforma**. `ml_ranking_enabled` (ML ON/OFF), `payments_enabled` (cobros ON/OFF), `kyc_required` (puerta KYC), `maintenance_mode` (apagón controlado). Si un **kill switch crítico se apaga por error**, **toda la plataforma deja de funcionar** (pagos 0, matching ciego, KYC bypass). La **auditoría de cambios (G1.2)** es **trazabilidad de poder**: ¿quién tocó qué y cuándo?

---

## Qué Nos Dice Realmente

| Kill Switches Activos | Interpretación | Acción Inmediata |
|----------------------|----------------|------------------|
| **0 críticos OFF** (salvo mantenimiento) | Operación normal | Mantener |
| **1 crítico OFF inesperado** | **Alerta P1**: ¿deploy fallido? ¿config errónea? ¿ataque? | Rollback inmediato + alerta Legal/SuperAdmin |
| **> 1 críticos OFF** | Caos: rollback inmediato a versión estable | **CONGELAR DEPLOYS** + Auditoría completa |

---

## Kill Switches Críticos (Lista Oficial)

| Flag | Función | Si OFF → Impacto |
|------|---------|------------------|
| `payments_enabled` | Cobros ON/OFF | **Revenue 0**, contratos no cierran, usuarios no pagan |
| `ml_ranking_enabled` | ML ON/OFF | Matching ciego → CTR cae → conversión cae → disputas suben |
| `kyc_required` | Puerta KYC ON/OFF | PDS ofertan sin KYC → fraude / TrustScore roto / certificados inválidos |
| `maintenance_mode` | Apagón controlado | Plataforma en mantenimiento (planificado) |
| `regional_scoping_enabled` | Scoping regional | Violaciones regionales → P1 / legal / fuga datos |

---

## Gestión de Kill Switches (Four-Eyes Principle)

1. **Todo kill switch crítico requiere 2 SuperAdmins** para toggle (four-eyes en UI + `audit_logs`)
2. **Rollback automático:** `payments_enabled` OFF > 5min sin mantenimiento programado → auto-ON + alerta P1
3. **Maintenance window:** Ventana 02:00–04:00 UTC solo → cambios fuera de ventana = alerta
4. **Config versioning:** Cada cambio = versión + diff + rollback 1-click en UI SuperAdmin
5. **Alertas gradientes:** Flag crítico OFF → Alerta P1 (Slack + PagerDuty + Email Legal) / Flag operativo OFF → Warning (Slack)

---

## Segmentación Obligatoria

- **Por criticidad:** Críticos (4) vs Operativos (10-20) vs Experimentales (5-10)
- **Por actor:** SuperAdmin (autorizado) vs Admin regional (scope limitado) vs Sistema (automático)
- **Por entorno:** Producción (crítico) vs Staging (testing) vs Development
- **Por tipo cambio:** Toggle ON/OFF vs Valor numérico vs JSON config

---

## Riesgo Si Se Ignora

- **`payments_enabled` OFF 10min** → Revenue 0, usuarios no pagan, contratos no cierran, confianza rota
- **`ml_ranking_enabled` OFF** → Matching ciego → CTR cae → conversión cae → disputas suben
- **`kyc_required` OFF** → PDS ofertan sin KYC → fraude / TrustScore roto / certificados inválidos
- **Cambios > 50/día** → Caos operativo / debugging imposible / auditoría imposible

---

## Métricas Complementarias

- **G1.2 (Cambios Config)** → Cambios flags = acciones críticas
- **G2.2 (Acciones Críticas)** → Toggle kill switch = acción crítica auditada
- **B1.1 (ML Flag)** → Feature flag principal ML
- **D3.4 (Pago Efectivo)** → `payments_enabled` OFF = pago 0

---

## Alineación Estándares

- **RNF-AUD** — Auditoría inmutable (cada toggle en `audit_logs` inmutable)
- **ADR-9** — Gobernanza feature flags en tiempo real
- **RNF-03** — Seguridad (four-eyes, rollback, audit trail)
- **ODS 16.6** — Instituciones efectivas (gobernanza transparente)

---

## Plantilla de Decisión (Para SuperAdmin/DevOps/Legal)

> **Si ahora:** Kill switch crítico OFF sin mantenimiento programado **O** Cambios config > 50/día  
> **Entonces:** 1) Rollback automático a último estado estable 2) Alerta P1: Slack + PagerDuty + Email Legal 3) Auditoría `audit_logs` últimas 24h 4) Post-mortem < 2h  
> **Owner:** SuperAdmin de turno  
> **Revisión:** Inmediata (P1)