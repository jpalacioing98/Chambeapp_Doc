# Narrativa: Feature Flags y Gobernanza (Transversal)

**KPIs Asociados:** G1.1–G1.3  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Transversal — Feature Flags y Configuración Dinámica

---

## La Historia

Los **Feature Flags** son **los mandos de control de la plataforma**. `ml_ranking_enabled` (ML ON/OFF), `payments_enabled` (cobros ON/OFF), `kyc_required` (puerta KYC), `maintenance_mode` (apagón controlado). Si un **kill switch crítico se apaga por error**, **toda la plataforma deja de funcionar** (pagos 0, matching ciego, KYC bypass). La **auditoría de cambios (G1.2)** es **trazabilidad de poder**: ¿quién tocó qué y cuándo?

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Flags Activos (G1.1)** | Solo flags no críticos ON | 1–2 críticos ON (mantenimiento) | > 2 críticos ON inesperados | Alerta Slack + rollback automático si `payments_enabled` OFF |
| **Cambios Config/día (G1.2)** | < 10/día (planificados) | 10–50/día | > 50/día o picos nocturnos | Auditoría: ¿cambio no autorizado? ¿script malicioso? |
| **Kill Switches Críticos (G1.3)** | Todos ON (salvo mantenimiento) | 1 OFF (mantenimiento programado) | > 1 OFF inesperado | **Alerta P1**: rollback inmediato + alerta Legal/SuperAdmin |

---

## Segmentación Obligatoria

- **Por criticidad:** Críticos (`payments_enabled`, `ml_ranking_enabled`, `kyc_required`, `maintenance_mode`) vs Operativos (`nuevo_feature_x`, `beta_feature_y`)
- **Por actor:** SuperAdmin (autorizado) vs Admin regional (scope limitado) vs Sistema (automático)
- **Por entorno:** Producción (crítico) vs Staging (testing) vs Development
- **Por tipo cambio:** Toggle ON/OFF vs Valor numérico vs JSON config

---

## Palancas de Intervención

1. **Four-eyes principle** → Todo kill switch crítico requiere **2 SuperAdmins** para toggle (four-eyes en UI + audit_logs)
2. **Rollback automático** → `payments_enabled` OFF > 5min sin mantenimiento programado → auto-ON + alerta P1
2. **Maintenance window** → Ventana 02:00–04:00 UTC solo → cambios fuera de ventana = alerta
2. **Config versioning** → Cada cambio = versión + diff + rollback 1-click en UI SuperAdmin
2. **Alertas gradientes** → Flag crítico OFF → Alerta P1 (Slack + PagerDuty + Email Legal) / Flag operativo OFF → Warning (Slack)

---

## Riesgo Si Se Ignora

- **`payments_enabled` OFF 10min** → Revenue 0, usuarios no pagan, contratos no cierran, confianza rota
- **`ml_ranking_enabled` OFF** → Matching ciego → CTR cae → conversión cae → disputas suben
- **`kyc_required` OFF** → PDS ofertan sin KYC → fraude / TrustScore roto / certificados inválidos
- **Cambios > 50/día** → Caos operativo / debugging imposible / auditoría imposible

---

## Métricas Complementarias

- **G2.2 (Acciones Críticas Auditadas)** → Cambios flags = acciones críticas
- **G4.1 (Revocaciones JWT)** → Cambio rol/estado = revocación tokens
- **B1.1 (ML Flag)** → Feature flag principal ML
- **D3.4 (Pago Efectivo)** → `payments_enabled` OFF = pago 0

---

## Alineación Estándares

- **RNF-AUD** — Auditoría inmutable (cada toggle en audit_logs inmutable)
- **ADR-9** — Gobernanza feature flags en tiempo real
- **RNF-03** — Seguridad (four-eyes, rollback, audit trail)
- **ODS 16.6** — Instituciones efectivas (gobernanza transparente)

---

## Plantilla de Decisión

> **Si ahora:** Kill switch crítico OFF sin mantenimiento programado **O** Cambios config > 50/día  
> **Entonces:** 1) Rollback automático a último estado estable 2) Alerta P1: Slack + PagerDuty + Email Legal 3) Auditoría `audit_logs` últimos 60min 4) Post-mortem < 2h  
> **Owner:** SuperAdmin de turno  
> **Revisión:** Inmediata (P1)