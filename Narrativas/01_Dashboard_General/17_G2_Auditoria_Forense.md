# Narrativa: Auditoría Forense e Inmutabilidad (Transversal)

**KPIs Asociados:** G2.1–G2.3  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Transversal — Auditoría Forense e Inmutabilidad (ADR-8)

---

## La Historia

El **`audit_logs` inmutable** es **la memoria indeleble de la plataforma**. Cada acción privilegiada (cambio rol, moderación contrato, reembolso, aprobación KYC, override SuperAdmin) queda registrada **en la misma transacción**, **sin posibilidad de edición posterior**. Si **acciones críticas/día (G2.2) caen a 0**, **alguien está operando en la sombra**. La **integridad referencial BD (G2.3)** es el **chequeo de salud de la verdad**.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Logs Auditoría/día (G2.1)** | Alineado a actividad (1000–5000/día) | Caída > 30% vs promedio | < 500/día (actividad oculta) | Revisar: ¿triggers fallaron? ¿código bypass? |
| **Acciones Críticas (G2.2)** | Alineado a actividad admin | Caída > 50% vs promedio | 0 por 2+ horas | **Alerta P1**: ¿auditoría desactivada? ¿código bypass? |
| **Integridad Referencial BD (G2.3)** | Job nocturno PASS | 1–2 FK rotas (job repara) | > 5 FK rotas / job FAIL | **Mantenimiento urgente**: repair FK / restore backup |

---

## Segmentación Obligatoria

- **Por acción:** `user.status.update` / `user.role.update` / `contract.moderate` / `payment.refund` / `kyc.approve` / `kyc.reject` / `flag.toggle` / `override.user` / `config.update`
- **Por actor:** SuperAdmin / Admin / Verificador / Soporte / Sistema (automático)
- **Por entidad:** User / Contract / Payment / KYC / Flag / Config / Tarifa
- **Por severidad:** Crítica (cambio rol/estado/pago) vs Operativa (cambio config/flag)

---

## Palancas de Intervención

1. **Triggers BD inmutables** → `audit_logs` insert en **misma transacción** que acción → imposible bypass sin acceso BD root
2. **Job nocturno integridad** → `pg_check_constraints` + `FK validation` → reporte 06:00 UTC + alerta si FAIL
2. **Alertas silencio auditoría** → Acciones críticas = 0 por 2h → Alerta P1 Slack + Email Legal
2. **Búsqueda forense UI** → SuperAdmin: filtro actor/acción/entidad/rango fecha / export CSV/JSON
2. **Retención legal** → `audit_logs` retención 7 años (Ley 1581/2012 + normativa financiera) / cold storage S3 Glacier

---

## Riesgo Si Se Ignora

- **Auditoría silenciosa** → Acciones privilegiadas sin rastro → fraude / abuso poder / cumplimiento legal roto
- **Integridad BD rota** → Datos inconsistentes → reportes erróneos / decisiones erradas / auditoría externa falla
- **Logs < 500/día** → Plataforma "fantasma" → actividad real no auditada → riesgo legal / regulatorio

---

## Métricas Complementarias

- **G1.2 (Cambios Config)** → Subconjunto acciones críticas
- **G4.1 (Revocaciones JWT)** → Subconjunto acciones críticas
- **D4.3 (Evasión Comisión)** → Detectada via auditoría pagos
- **D4.5 (Fraude KYC)** → Detectada via auditoría KYC

---

## Alineación Estándares

- **ADR-8** — Pistas inmutables auditoría forense
- **RNF-AUD** — Auditoría inmutable (misma transacción, sin edición posterior)
- **Ley 1581/2012** — Habeas Data (trazabilidad datos personales)
- **Ley 527/1999** — Comercio electrónico (trazabilidad contractual)
- **ODS 16.6** — Instituciones efectivas, transparentes

---

## Plantilla de Decisión

> **Si ahora:** Acciones críticas auditadas = 0 por 2h **O** Job integridad BD FAIL  
> **Entonces:** 1) Alerta P1: Slack + PagerDuty + Email Legal 2) Congelar deployments 3) Auditoría `audit_logs` últimas 24h 4) Restore backup si integridad BD comprometida  
> **Owner:** DBA / Legal  
> **Revisión:** Inmediata (P1)