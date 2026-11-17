# Narrativa: Scoping Regional Estricto (Transversal)

**KPIs Asociados:** G3.1–G3.3  
**Nivel:** 🔴 Crítico (tiempo real, cero tolerancia) / 🟠 Táctico (diario)  
**Dimensión:** Transversal — Scoping Regional Estricto (ADR-3, RF-70..75)

---

## La Historia

El **Scoping Regional (ADR-3)** es **la frontera constitucional de ChambeApp**. Un contrato **NUNCA** puede cruzar regiones: solicitante en Caribe (Valledupar) + PDS en Andina (Bogotá) = **violación P1, bloqueo inmediato, auditoría forense**. Esto evita: doble conteo métricas, evasión fiscal, explotación laboral transfronteriza, fuga de datos regionales. El **reindex masivo (RF-75)** mantiene la asignación fresca.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Usuarios por Región (G3.1)** | Distribución alineada DANE | Concentración > 70% en 1 región | 1 región = 0 usuarios | Seeding PDS/Solicitantes regiones vacías / campañas geo |
| **Staff por Región (G3.2)** | Cada región: Admin + Verificador + Soporte | 1 región sin Verificador | 1 región sin Admin | Contratar/Asignar staff / reindex regional |
| **Violaciones Regionales (G3.3)** | **0 (Cero Tolerancia)** | N/A | **> 0 = INCIDENTE P1 INMEDIATO** | Bloqueo contrato + Alerta Legal/SuperAdmin + Auditoría `audit_logs` |

---

## Segmentación Obligatoria

- **Por región DANE:** Caribe, Andina, Pacífica, Orinoquía, Amazonía, Insular
- **Por rol:** Público (PDS/Sol/Merchant) vs Staff (Admin/Verificador/Soporte) vs SuperAdmin (global)
- **Por tipo entidad:** Contrato / Disputa / Pago / KYC / Ticket / Anuncio
- **Por origen:** Derivación automática (`assign_region`) vs Manual (SuperAdmin) vs Seed

---

## Palancas de Intervención

1. **Scoping en BD** → `WHERE users.region_id = scope` en **todos** `GET /admin/*` + `GET /kyc/pendientes` + `POST /kyc/verificar`
2. **Propiedad por solicitante** → `contract_owned_by_region(contract, scope)` = `solicitante.region_id == scope` (evita doble conteo)
3. **Reindex masivo (RF-75)** → `POST /superadmin/regions/reindex` → batch nocturno / idempotente / reporte `{actualizados: n}`
3. **Derivación automática** → `assign_region(user, text=zona|ubicacion)` en perfil + solicitud + onboarding
3. **Test automatizado** → 24 tests `test_regiones.py` cubren: derivación, scope, anti-doble-conteo, reindex

---

## Riesgo Si Se Ignora

- **1 violación regional** → Doble conteo métricas / evasión fiscal / explotación laboral transfronteriza / fuga datos → **P1 INMEDIATO**
- **Región sin Verificador** → KYC estancado → PDS no firman → revenue 0 en región
- **Región sin usuarios** → Plataforma "fantasma" → inversión infra desperdiciada

---

## Métricas Complementarias

- **RF-70..75** — División Regional completo (24 tests)
- **G1.3 (Kill Switches)** → `regional_scoping_enabled` = kill switch crítico
- **G2.2 (Acciones Críticas)** → Violación regional = acción crítica auditada
- **D4.1 (Violaciones Regionales)** → KPI duplicado en Dimensión 4 (cero tolerancia)

---

## Alineación Estándares

- **ADR-3** — Scoping Regional Estricto
- **RF-70..75** — División Regional completo (24 tests)
- **RNF-AUD** — Auditoría inmutable (violación = acción crítica auditada)
- **Ley 1581/2012** — Habeas Data (datos no cruzan fronteras sin consentimiento)
- **ODS 16.6** — Instituciones efectivas (gobernanza territorial)

---

## Plantilla de Decisión

> **Si ahora:** Violaciones Regionales > 0  
> **Entonces:** 1) **BLOQUEO INMEDIATO** contrato violador 2) Alerta P1: Slack + PagerDuty + Email Legal + SuperAdmin 3) Auditoría `audit_logs` últimas 24h 4) Fix deploy < 2h (scoping en admin/kyc/tickets/contracts)  
> **Owner:** SuperAdmin de turno / Legal  
> **Revisión:** Inmediata (P1 - Cero Tolerancia)