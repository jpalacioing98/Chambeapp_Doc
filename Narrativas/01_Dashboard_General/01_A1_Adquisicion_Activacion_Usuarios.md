# Narrativa: Adquisición y Activación de Usuarios (Módulo A)

**KPIs Asociados:** A1.1–A1.8  
**Nivel:** 🟠 Táctico (diario/semanal)  
**Dimensión:** Módulo A — Gestión de Usuarios y Perfiles

---

## La Historia

Esta narrativa cuenta **cómo llegan, se quedan y se activan los usuarios** en ChambeApp. No es solo "cuántos se registran"; es **qué tan rápido entienden el valor** y cruzan la barrera del primer contrato. El ratio PDS/Solicitante (A1.5) es el latido del marketplace: si se rompe, el matching falla y la plataforma muere.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **MAU/DAU (A1.2)** | MAU crece 10% mes, DAU/MAU > 30% | MAU plano, DAU/MAU 15–30% | MAU cae, DAU/MAU < 15% | Revisar onboarding, notificaciones push, retención |
| **Tasa Activación D1/D7/D30 (A1.3)** | D1 > 20%, D7 > 40%, D30 > 60% | D1 10–20%, D7 25–40% | D1 < 10%, D7 < 25% | Simplificar onboarding, reducir fricción KYC |
| **Ratio PDS/Solicitante (A1.5)** | 0.8 – 1.5 | 0.5–0.8 o 1.5–2.0 | < 0.5 o > 2.0 | Campaña captación lado débil, incentivos asimétricos |
| **Distribución por Rol (A1.4)** | 4 roles balanceados según proyección | Un rol domina (> 60%) | Un rol < 5% | Revisar propuesta de valor por rol |
| **Usuarios por Región (A1.6)** | Cobertura Valledupar + corregimientos | Solo casco urbano | Solo 1–2 barrios | Expandir geocercas, seeding PDS rurales |
| **Verificación Email / 2FA (A1.7, A1.8)** | Email > 80%, 2FA > 30% | Email 50–80%, 2FA 10–30% | Email < 50%, 2FA < 10% | Recordatorios en-app, incentivar 2FA con monedas |

---

## Segmentación Obligatoria

- **Por rol:** PDS vs Solicitante vs Merchant (comportamientos radicalmente distintos)
- **Por cohorte mensual:** ¿Los usuarios de enero retienen mejor que los de junio?
- **Por canal de adquisición:** Orgánico vs referido vs campaña pagada
- **Por dispositivo:** Móvil (PWA) vs desktop (admin)

---

## Palancas de Intervención

1. **Onboarding guiado 3 pasos** → reduce fricción D1
2. **Incentivos asimétricos** → 0% comisión 3 meses PDS + 50 monedas bienvenida Solicitante
3. **Referidos gamificados** → 25 monedas por referido exitoso (tracking `audit_logs`)
4. **Seeding geográfico** → PDS "embajadores" en barrios/corregimientos sin cobertura
5. **Push personalizados** → "Te faltan 2 pasos para ofertar" / "3 ofertas cerca de ti"

---

## Riesgo Si Se Ignora

- **Ratio PDS/Solicitante < 0.3** → Solicitantes publican, nadie oferta → churn masivo en 2 semanas
- **Activación D7 < 25%** → CAC se triplica, payback > 12 meses
- **Concentración geográfica** → Plataforma "solo para el centro", exclusión sistemática

---

## Métricas Complementarias

- **A2.1 (KYC Completion)** → Usuario activado ≠ usuario verificado
- **B2.1 (Solicitudes Publicadas)** → Demanda real generada por usuarios activados
- **D1.1 (Contratos Día)** → Conversión final de usuario activado → ingreso

---

## Alineación Estándares

- **ODS 8.3** — Formalización empleo (usuarios activos = fuerza laboral trazable)
- **ODS 10.2** — Inclusión (distribución regional, equidad roles)
- **IRIS+ PI4060** — Trabajadores en empleo formal (MAU PDS con contratos)

---

## Plantilla de Decisión (Para SuperAdmin)

> **Si esta semana:** MAU cae > 5% WoW **Y** Ratio PDS/Solicitante < 0.5  
> **Entonces:** Activar campaña "Semana del PDS" (0% comisión + 100 monedas bono) + Seeding 5 barrios sin PDS  
> **Owner:** PM Crecimiento  
> **Revisión:** Próximo lunes en standup métricas