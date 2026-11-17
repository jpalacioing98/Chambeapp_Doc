# Narrativa: Revocación JWT y Seguridad (Transversal)

**KPIs Asociados:** G4.1–G4.3  
**Nivel:** 🟠 Táctico (diario) / 🔴 Crítico (tiempo real para fuerza bruta)  
**Dimensión:** Transversal — Revocación JWT y Seguridad (ADR-2)

---

## La Historia

La **revocación JWT via `role_version` (ADR-2)** es **el freno de mano de la seguridad**. Cuando un admin cambia rol/estado/2FA de un usuario, **`role_version` incrementa** → **todos los tokens JWT activos se invalidan instantáneamente**. Sin esperar expiración (30min access / 7d refresh). Los **intentos login fallidos (G4.2)** son el **radar de ataques**: > 10/min/IP = ataque fuerza bruta. Las **cuentas suspendidas (G4.3)** son **la cuarentena**: fraude KYC, disputa grave, abuso plataforma.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Revocaciones/día (G4.1)** | Alineado a cambios admin (10–50/día) | Pico > 3x promedio | > 10x pico / 0 por 24h | Revisar: ¿cambio masivo roles? ¿script? ¿bug revocación? |
| **Intentos Login Fallidos (G4.2)** | < 10/min/IP | 10–50/min/IP | > 50/min/IP | **WAF block IP** + alerta Slack + revisar patrón (credenciales robadas?) |
| **Cuentas Suspendidas/Baneadas (G4.3)** | < 1% usuarios | 1–3% | > 3% | Revisar causa: fraude KYC / disputa / abuso / error |

---

## Segmentación Obligatoria

- **Por causa revocación:** `user.status.update` / `user.role.update` / `user.two_factor.update` / `user.password.change`
- **Por actor:** SuperAdmin / Admin / Usuario (cambio password/2FA) / Sistema (expiración)
- **Por tipo ataque:** Credential stuffing / Password spraying / Brute force / Credential stuffing distribuido
- **Por tipo suspensión:** `suspended` (temporal, reversible) vs `banned` (permanente, fraude grave)

---

## Palancas de Intervención

1. **Revocación instantánea** → `role_version++` en **misma transacción** que cambio rol/estado/2FA → tokens invalidados **al siguiente request**
2. **WAF rate limiting** → 10 req/min/IP login → 429 Too Many Requests + block 15min / 1h / 24h escalonado
2. **Detección distribuida** → Correlación IP + User-Agent + geo + dispositivo → block red / ASN
2. **Proceso suspensión** → Fraude KYC → `banned` + alerta Legal / Disputa grave → `suspended` 30d / Abuso → `suspended` 7d
2. **Apelación** → Usuario suspendido → formulario apelación → revisión Soporte 48h / SuperAdmin 24h

---

## Riesgo Si Se Ignora

- **Revocación falla** → Usuario con rol antiguo accede datos/acciones no autorizadas → fuga datos / abuso poder
- **Fuerza bruta exitosa** → Cuenta comprometida → fraude / robo identidad / pagos desviados
- **Suspensiones > 3%** → O epidemia fraude / O falsos positivos masivos → confianza rota / reputación

---

## Métricas Complementarias

- **G1.2 (Cambios Config)** → Cambio rol/estado = revocación
- **G2.2 (Acciones Críticas)** → Revocación = acción crítica auditada
- **G3.3 (Violaciones Regionales)** → Cambio región = revocación tokens
- **D4.5 (Fraude KYC)** → Fraude detectado → `banned` + revocación

---

## Alineación Estándares

- **ADR-2** — Revocación desacoplada tokens JWT via `role_version`
- **RNF-03** — Seguridad (revocación instantánea, rate limiting)
- **RNF-AUD** — Auditoría inmutable (revocación = acción auditada)
- **Ley 1581/2012** — Habeas Data (acceso controlado, revocable)
- **ODS 16.6** — Instituciones efectivas (seguridad robusta)

---

## Plantilla de Decisión

> **Si ahora:** Intentos login fallidos > 50/min/IP **O** Revocaciones 0 por 24h (inesperado)  
> **Entonces:** 1) WAF block IP/ASN 2) Alerta Slack #security-alerts 3) Revisar `audit_logs` últimas 24h 4) Si revocaciones 0 → revisar código `role_version` increment  
> **Owner:** Security Lead / Backend Lead  
> **Revisión:** Tiempo real (alertas) + Diario 8am (revisión)