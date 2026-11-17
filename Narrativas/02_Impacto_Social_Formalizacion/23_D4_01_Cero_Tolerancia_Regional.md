# Narrativa: Cero Tolerancia — Scoping Regional Inquebrantable

**KPI Asociado:** D4.1  
**Nivel:** 🔴 Crítico (tiempo real, cero tolerancia) / 🟠 Táctico (diario)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

El **Scoping Regional (ADR-3)** es **la frontera constitucional de ChambeApp**. Un contrato **NUNCA** puede cruzar regiones: solicitante en Caribe (Valledupar) + PDS en Andina (Bogotá) = **violación P1, bloqueo inmediato, auditoría forense**. Esto evita: doble conteo métricas, evasión fiscal, explotación laboral transfronteriza, fuga de datos regionales. El **reindex masivo (RF-75)** mantiene la asignación fresca.

---

## Qué Nos Dice Realmente

| Violaciones Regionales | Interpretación | Acción Inmediata |
|------------------------|----------------|------------------|
| **0 (Cero Tolerancia)** | Gobernanza perfecta: scoping en `admin.py`, `kyc.py`, `tickets.py`, `contracts.py` funciona; `contract_owned_by_region` en stats | Mantener: tests automatizados 24/7 |
| **1** | **INCIDENTE P1 INMEDIATO**: bloqueo contrato, alerta Legal/SuperAdmin, auditoría `audit_logs`, fix deploy < 2h | **BLOQUEO INMEDIATO** + Alerta P1 + Auditoría + Fix < 2h |
| **> 1** | Fallo sistémico: scoping roto en migración, reindex, o nuevo blueprint sin filtro `region_id` | **CONGELAR DEPLOYS** + Auditoría completa + Post-mortem público |

---

## Arquitectura de Cero Tolerancia

1. **Scoping en BD:** `WHERE users.region_id = scope` en **todos** `GET /admin/*` + `GET /kyc/pendientes` + `POST /kyc/verificar`
2. **Propiedad por solicitante:** `contract_owned_by_region(contract, scope)` = `solicitante.region_id == scope` (evita doble conteo)
3. **Reindex masivo (RF-75):** `POST /superadmin/regions/reindex` → batch nocturno / idempotente / reporte `{actualizados: n}`
4. **Derivación automática:** `assign_region(user, text=zona|ubicacion)` en perfil + solicitud + onboarding
5. **Test automatizado:** 24 tests `test_regiones.py` cubren: derivación, scope, anti-doble-conteo, reindex

---

## Segmentación Obligatoria

- **Por región DANE:** Caribe, Andina, Pacífica, Orinoquía, Amazonía, Insular
- **Por rol:** Público (PDS/Sol/Merchant) vs Staff (Admin/Verificador/Soporte) vs SuperAdmin (global)
- **Por tipo entidad:** Contrato / Disputa / Pago / KYC / Ticket / Anuncio
- **Por origen:** Derivación automática (`assign_region`) vs Manual (SuperAdmin) vs Seed

---

## Palancas de Intervención

1. **Scoping en BD:** `WHERE users.region_id = scope` en **todos** `GET /admin/*` + `GET /kyc/pendientes` + `POST /kyc/verificar`
2. **Propiedad por solicitante:** `contract_owned_by_region(contract, scope)` = `solicitante.region_id == scope` (evita doble conteo)
2. **Reindex masivo (RF-75):** `POST /superadmin/regions/reindex` → batch nocturno / idempotente / reporte `{actualizados: n}`
2. **Derivación automática:** `assign_region(user, text=zona|ubicacion)` en perfil + solicitud + onboarding
2. **Test automatizado:** 24 tests `test_regiones.py` cubren: derivación, scope, anti-doble-conteo, reindex

---

## Riesgo Si Se Ignora

- **1 violación regional** → Doble conteo métricas / evasión fiscal / explotación laboral transfronteriza / fuga de datos regionales → **P1 INMEDIATO**
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

## Plantilla de Decisión (Para SuperAdmin/Legal/DevOps)

> **Si ahora:** Violaciones Regionales > 0  
> **Entonces:** 1) **BLOQUEO INMEDIATO** contrato violador 2) Alerta P1: Slack + PagerDuty + Email Legal + SuperAdmin 3) Auditoría `audit_logs` últimas 24h 4) Fix deploy < 2h (scoping en admin/kyc/tickets/contracts)  
> **Owner:** SuperAdmin de turno / Legal  
> **Revisión:** Inmediata (P1 - Cero Tolerancia)