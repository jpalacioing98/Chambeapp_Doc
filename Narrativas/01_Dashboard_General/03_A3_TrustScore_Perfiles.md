# Narrativa: Perfiles y TrustScore (Módulo A)

**KPIs Asociados:** A3.1–A3.5  
**Nivel:** 🔴 Crítico (tiempo real recálculo Celery) / 🟠 Táctico (diario)  
**Dimensión:** Módulo A — Perfiles y TrustScore

---

## La Historia

El **TrustScore** es **la reputación cuantificada** del PDS. No es un número arbitrario: 5 dimensiones con pesos transparentes (KYC 25%, Rating 25%, Contratos 20%, Portfolio 15%, Referidos 15%) que determinan **visibilidad en matching, acceso a contratos premium, y credibilidad ante solicitantes**. La distribución de niveles (Nuevo → Confiable → Verificado → Experto) cuenta la historia de **madurez del ecosistema**.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Distribución Niveles (A3.1)** | Experto > 15%, Verificado > 30% | Experto 5–15%, Verificado 15–30% | Experto < 5%, Verificado < 15% | Campaña "Sube de Nivel" + incentivos N3→N4 |
| **TrustScore Promedio (A3.2)** | > 0.65 | 0.45–0.65 | < 0.45 | Revisar componentes: ¿KYC bajo? ¿Rating inflado? |
| **Componentes Promedio (A3.3)** | Todos > 0.6 | 1–2 < 0.5 | ≥ 3 < 0.5 | Intervención quirúrgica en componente débil |
| **Portfolio Aprobado > 0 (A3.4)** | > 50% PDS | 25–50% | < 25% | Incentivar portfolio: 20 monedas/ítem aprobado |
| **Perfil Completo (A3.5)** | > 70% PDS/Sol | 50–70% | < 50% | Onboarding guiado: barra progreso + monedas por paso |

---

## Segmentación Obligatoria

- **Por nivel actual:** Nuevo (necesita primeros contratos) vs Confiable (necesita portfolio) vs Verificado (necesita certificación SENA)
- **Por oficio:** En plomería subir a Experto requiere certificación SENA; en jardinería no
- **Por cohorte:** ¿Cohorte enero 2026 llega a Experto más rápido que cohorte 2025?
- **Por TrustScore componentes:** ¿KYC es el freno común? ¿Rating inflado encoubre baja calidad?

---

## Palancas de Intervención

1. **Campaña "Sube de Nivel"** trimestral: metas claras (ej. "Este trimestre: 50 PDS a Verificado")
2. **Incentivos por nivel:** N3→N4 = 200 monedas + badge "Maestro" + verificación express gratis
3. **Portfolio obligatorio para N4+** → UX: "Para ser Maestro necesitas 3 fotos 360° aprobadas"
3. **Mentoría N5→N2:** PDS Experto voluntario mentoriza 2 Novatos/mes (200 monedas/mentoría)
3. **Transparencia radical:** Dashboard PDS muestra "Te faltan: 2 contratos + 1 quiz + certificación SENA para Verificado"

---

## Riesgo Si Se Ignora

- **Experto < 5%** → No hay "maestros" visibles → solicitantes no confían → matching se degrada
- **TrustScore avg < 0.45** → Matching ML no diferencia calidad → CTR cae → conversión cae
- **Portfolio < 25%** → Evidencia visual ausente → solicitantes piden más chats/llamadas → fricción

---

## Métricas Complementarias

- **A2.1 (KYC)** → 25% peso TrustScore (componente más fácil de subir)
- **B1.5 (CTR ML)** → TrustScore alto = mayor CTR en recomendaciones
- **D2.5 (Progresión Niveles)** → TrustScore es output; progresión es input
- **D3.7 (Prima Formalidad)** → TrustScore Verificado+ = prima precio

---

## Alineación Estándares

- **RNF-02** — Transparencia Algorítmica (pesos públicos, componentes auditables)
- **ODS 8.5** — Empleo pleno productivo (TrustScore = señal calidad)
- **IRIS+ PI4060** — Trabajadores en empleo formal (TrustScore ≥ Verificado)

---

## Plantilla de Decisión

> **Si esta semana:** % Experto < 5% **Y** TrustScore avg < 0.5  
> **Entonces:** Lanzar "Mes del Maestro" (bono 200 monedas N3→N4 + verificación express gratis + mentoría N5)  
> **Owner:** PM Trust & Safety  
> **Revisión:** Cada viernes en métricas TrustScore