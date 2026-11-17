# Narrativa: Fraude KYC — La Línea Roja de la Identidad

**KPI Asociado:** D4.5  
**Nivel:** 🟡 Operativo (diario) / 🔴 Crítico (semanal)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

**KYC es la confianza**. Si un PDS usa cédula falsa, certificado SENA adulterado, selfie deepfake → **todo el TrustScore es mentira**, el solicitante contrata a fantasmas, el certificado ingresos es fraude. **> 1% PDS suspendidos por fraude KYC** = epidemia.

---

## Qué Nos Dice Realmente

| Fraude KYC (PDS Suspendidos/Baneados) | Interpretación | Acción Inmediata |
|--------------------------------------|----------------|------------------|
| **0%** | KYC robusto: verificadores entrenados, docs biométricos, cruce Registraduría/SENA, selfie liveness | Mantener: auditoría trimestral verificadores |
| **0.1–1%** | Casos aislados: revisar patrón (¿misma cédula? ¿mismo verificador? ¿misma IP?) | Investigar cluster / capacitar verificador / reforzar validación tipo doc |
| **> 1%** | **Crisis sistémica**: revisar todo pipeline KYC, auditoría externa, notificar autoridades | **Congelar onboarding PDS** + Auditoría externa + Notificar Superintendencia/Registraduría |

---

## Tipos de Fraude Detectados

| Tipo Fraude | Detección | Prevención |
|-------------|-----------|------------|
| **Cédula falsa/alterada** | OCR + cruce Registraduría API + validación hologramas | OCR avanzado + cruce Registraduría API tiempo real |
| **Certificado SENA adulterado** | Verificador detecta / API carné QR falla | API carné QR SENA (verificación instantánea) |
| **Selfie deepfake / suplantación** | Liveness detection falla / verificación biométrica | Liveness detection avanzado (parpadeo, giro cabeza, textura piel) |
| **Documentos prestados/robados** | Cruce facial selfie vs cédula / geolocalización inconsistente | Verificación biométrica facial + geolocalización coherente |
| **Verificador corrupto/negligente** | Auditoría `audit_logs`: aprobaciones masivas / tiempo < 30s / patrón | Auditoría trimestral verificadores / rotación / alertas anomalías |

---

## Tecnología Anti-Fraude (Stack Recomendado)

1. **Verificación biométrica facial:** Liveness detection (parpadeo, giro, textura) + matching facial selfie vs cédula
2. **OCR cédula + cruce Registraduría:** Tiempo real + validación hologramas / fechas / numéricos
3. **API carné QR SENA:** Verificación instantánea certificación (24/7, sin verificador humano)
4. **Hash certificado SENA en blockchain (opcional):** Inmutabilidad + trazabilidad
5. **Auditoría verificadores:** Trimestral + alertas anomalías (tiempo < 30s, tasa aprobación > 95%, misma IP)

---

## Segmentación Obligatoria

- **Por tipo fraude:** Cédula / Certificación / Selfie / Documentos prestados / Verificador
- **Por verificador:** Tasa aprobación / Tiempo promedio / Patrón anomalías
- **Por región:** Verificadores regionales (scope ADR-3)
- **Por tipo doc:** Cédula (auto) vs Antecedentes (humano) vs Certificación (humano + API)

---

## Riesgo Si Se Ignora

- **Fraude KYC > 1% por 2+ meses** → TrustScore generalizado poco fiable → Solicitantes contratan "fantasmas" → Disputas calidad disparan → Certificados ingresos fraudulentos → Banca rechaza certificados ChambeApp → Colapso confianza total
- **Verificador corrupto no detectado** → Aproba 100+ PDS fraudulentos/mes → Daño masivo reputación + legal
- **Deepfake no detectado** → Suplantación identidad → Contratos firmados por impostores → Responsabilidad legal ChambeApp

---

## Métricas Complementarias

- **A2.1 (KYC Completion)** → Fraude reduce completación real
- **A3.1 (TrustScore)** → Fraude infla TrustScore artificialmente
- **D3.3 (Certificados Emitidos)** → Certificados basados en KYC fraudulento = inválidos
- **D3.4 (Validación Bancos)** → Bancos detectan fraude → dejan de aceptar certificados
- **G2.2 (Acciones Críticas Auditadas)** → Fraude KYC = acción crítica auditada

---

## Alineación Estándares

- **Ley 1581/2012** — Habeas Data (veracidad datos personales)
- **Ley 1429/2010** — Formalización (identidad verificada)
- **Ley 527/1999** — Comercio electrónico (identidad verificada)
- **ODS 16.3, 16.6** — Estado de derecho, instituciones efectivas
- **IRIS+ OI7007** — Diversidad e inclusión (protección vulnerables contra fraude)

---

## Plantilla de Decisión (Para SuperAdmin/Legal/Verificadores/Seguridad)

> **Si hoy:** PDS suspendidos por fraude KYC > 1% **O** Cluster fraude detectado (misma IP/verificador/patrón)  
> **Entonces:** 1) **Congelar onboarding PDS** inmediato 2) Auditoría externa pipeline KYC 3) Notificar Superintendencia/Registraduría 4) Reforzar stack anti-fraude (biométrico + OCR + API SENA + blockchain)  
> **Owner:** SuperAdmin + Legal + Seguridad + Lead Verificadores  
> **Revisión:** Inmediata (Crisis) + Semanal (post-crisis)