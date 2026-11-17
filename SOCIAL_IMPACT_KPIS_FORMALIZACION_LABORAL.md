# Sistema de KPIs de Impacto Social: Formalización Laboral en ChambeApp

> **Proyecto:** ChambeApp — Plataforma Inteligente para la Contratación de Servicios Laborales con IA y Visualización 360 en Valledupar  
> **Versión:** 1.0  
> **Fecha:** 2026-11-15  
> **Metodología:** Social Impact Lens + AUP + Marco Normativo Colombiano (Ley 1429/2010, Ley 1562/2012, Ley 527/1999, Decreto 1273/2018, Ley 1581/2012)  
> **Baseline:** Valledupar, informalidad laboral ~55% (DANE 2024)  
> **Audiencia:** SuperAdmin, Directivos, Inversionistas de Impacto, Academia, Reguladores, Cooperación Internacional

---

## 1. Marco Conceptual: Teoría del Cambio

### 1.1 Problema Raíz
**Valledupar tiene ~55% de informalidad laboral** (DANE 2024). Los trabajadores informales (PDS) carecen de:
- Historial de ingresos verificable → exclusión financiera (banca, vivienda)
- Protección en seguridad social (pensión, salud, riesgos laborales - Ley 1562/2012)
- Trazabilidad de competencias → subempleo crónico
- Poder de negociación → subcotización sistemática

### 1.2 Teoría del Cambio (Logframe)

```
INPUTS (Recursos)                    ACTIVITIES (Acciones)                      OUTPUTS (Productos)                        OUTCOMES (Resultados)                                    IMPACT (Impacto)
├─ Plataforma digital                ├─ Matching IA geoespacial                 ├─ Solicitudes publicadas/día              ├─ PDS con ingresos trazables (Historial 12m)                ├─ Reducción informalidad
├─ Motor IA/ML (2 etapas)            ├─ Validación KYC 11 docs                 ├─ Contratos firmados/día                ├─ PDS con TrustScore ≥ Verificado                              ├─ Inclusión financiera
├─ Billetera virtual + monedas       ├─ Certificación ingresos (Ley 527)        ├─ Certificados de ingresos emitidos     ├─ PDS con ≥10 contratos/año → alerta Ley 1429/1562           ├─ Protección social
├─ Sistema TrustScore (5 dims)       ├─ Progresión 5 niveles (Novato→Experto)  ├─ PDS nivel Experto (N5)                ├─ Ingresos formales certificables para banca/vivienda         ├─ Movilidad social
├─ Visualización 3D/360°             ├─ Anuncios laborales (Merchant)          ├─ Anuncios → Contratos conversión       ├─ Empleo estable vía anuncios Merchant                          ├─ Economía formal
├─ FSM 6 hitos (geo + evidencia)     ├─ Cobros en monedas (sin fricción)       ├─ Monedas ganadas (10/contrato)         ├─ PDS que compran paquetes → reinvierten en visibilidad        ├─ Reducción pobreza
├─ Auditoría inmutable (audit_logs)  ├─ Derivación automática regional         ├─ Contratos cero cruce regional         ├─ Cero violaciones ADR-3 (gobernanza)                            ├─ Estado de derecho
└─ Normativa colombiana              └─ Alertas formalización progresiva       └─ Alertas Ley 1429/1562 activadas      └─ PDS afiliados a seguridad social                              └─ Sociedad incluyente
```

### 1.3 Suposiciones Críticas (Riesgos de la Teoría)
| Suposición | Indicador de Validación | Mitigación |
|------------|-------------------------|------------|
| PDS adoptan plataforma voluntariamente | MAU PDS > 40% registrados | Incentivos 0% comisión 3m + 50 monedas bienvenida |
| Solicitantes pagan comisión sin evasión | Tasa evasión < 5% | Doble check-in pago + auditoría inmutable |
| Verificadores KYC escalan | Pendientes < 50 / tiempo < 24h | Auto-aprobación docs simples + más verificadores |
| ML mejora matching vs heurístico | CTR ML > heurístico +15% | A/B testing obligatorio (RF-ML-2) + fallback |
| Certificados ingresos son aceptados por banca | 1 certificado → 1 crédito aprobado | Alianza bancaria + certificación Ley 527/1999 |

---

## 2. Sistema de KPIs: 4 Dimensiones, 3 Niveles, 60+ Métricas

### Taxonomía de Niveles

| Nivel | Definición | Frecuencia | Audiencia | Acción |
|-------|------------|------------|-----------|--------|
| **Estratégico (🔴)** | Impacto social macro, alineado a ODS/Ley | Mensual/Trimestral | Junta Directiva, Inversionistas, Reguladores | Decisiones de política, asignación recursos |
| **Táctico (🟠)** | Efectividad operativa de formalización | Semanal | Product Managers, Country Manager | Ajustes de producto, campañas, incentivos |
| **Operativo (🟡)** | Salud del motor de formalización | Diario/Tiempo real | Equipo técnico, Verificadores, Soporte | Alertas, debugging, optimización continua |

### Dimensión 1: Distribución de Roles y Equidad de Acceso

| # | KPI | Definición | Fórmula | Fuente | Nivel | Target | Segmentación |
|---|-----|------------|---------|--------|-------|--------|--------------|
| **D1.1** | **Ratio PDS / Solicitante Activos** | Balance oferta-demanda en mercado | `MAU_PDS / MAU_Solicitante` | `users` + `last_login` | 🟠 Táctico | 0.8 – 1.5 | Por región, categoría |
| **D1.2** | **% PDS con KYC Completo** | Puerta de entrada a formalización | `COUNT(PDS KYC=aprobado) / COUNT(PDS registrados)` | `documentos_usuario` | 🔴 Estratégico | > 60% | Por oficio, nivel TrustScore |
| **D1.3** | **% Solicitantes con KYC Completo** | Contraparte formalizada | `COUNT(Sol KYC=aprobado) / COUNT(Sol registrados)` | `documentos_usuario` | 🟠 Táctico | > 40% | Por región |
| **D1.4** | **Merchants Activos / Total Registrados** | Adopción canal empleo formal | `COUNT(Merchant KYC ∧ anuncio_activo) / COUNT(Merchant)` | `anuncios_laborales` + `users` | 🟠 Táctico | > 30% | Por sector (construcción, servicios, comercio) |
| **D1.5** | **Índice de Equidad Género en PDS** | Brecha de participación | `% PDS Mujeres / % PDS Hombres` (vs población Valledupar) | `users` + `profile` | 🔴 Estratégico | 0.8 – 1.2 | Por oficio, nivel |
| **D1.6** | **Índice de Equidad Edad (Jóvenes 18-28)** | Inclusión juventud | `% PDS 18-28 / Total PDS` vs DANE Valledupar | `users.edad_verificada` + `profile` | 🔴 Estratégico | ≥ 35% | Por oficio |
| **D1.7** | **PDS Migrantes / Vulnerables Activos** | Inclusión poblaciones especiales | `COUNT(PDS vulnerable KYC) / COUNT(PDS vulnerable registrado)` | `documentos_usuario` (doc tipo migrante) | 🔴 Estratégico | > 50% | Por tipo vulnerabilidad |
| **D1.8** | **Ratio PDS Rural / Urbano** | Alcance geográfico | `COUNT(PDS región rural) / COUNT(PDS región urbana)` | `users.region_id` + `seed_regions` | 🟠 Táctico | > 0.3 | Por región DANE |

### Dimensión 2: Demanda de Habilidades y Brechas de Capacitación

| # | KPI | Definición | Fórmula | Fuente | Nivel | Target | Segmentación |
|---|-----|------------|---------|--------|-------|--------|--------------|
| **D2.1** | **Top 10 Habilidades Más Demandadas** | Señal de mercado para capacitación | `COUNT(solicitudes.categoria) GROUP BY TOP 10` | `solicitudes` + `habilidades` | 🟠 Táctico | Actualizado mensual | Por mes, región |
| **D2.2** | **Top 10 Habilidades Menos Ofertadas** | Brecha oferta-demanda (escasez) | `COUNT(solicitudes) - COUNT(PDS con habilidad) BY habilidad` | `solicitudes` + `profile.habilidades` | 🟠 Táctico | Gap < 20% | Por oficio, nivel |
| **D2.3** | **Tasa de Validación Quiz por Habilidad** | Efectividad micro-capacitación | `COUNT(quiz_aprobado ≥80%) / COUNT(quiz_intentos)` | `habilidad_nivel` (metodo=quiz) | 🟡 Operativo | > 60% | Por habilidad, nivel (N1-N5) |
| **D2.4** | **Tasa de Certificación Técnica SENA/Institucional** | Validación formal competencias | `COUNT(certificacion_tecnica=verificado) / COUNT(certificacion_enviada)` | `certificacion_tecnica` | 🔴 Estratégico | > 40% | Por institución, oficio |
| **D2.5** | **PDS con Progresión de Nivel (N1→N2→N3...)** | Movilidad en escalera competencias | `COUNT(PDS nivel_actual > nivel_anterior_30d) / COUNT(PDS activo)` | `habilidad_nivel` + `progreso` | 🟠 Táctico | > 15%/trimestre | Por oficio, nivel origen |
| **D2.6** | **Endosos Sociales por Habilidad** | Validación peer-to-peer | `COUNT(endoso_habilidad) GROUP BY habilidad` | `endoso_habilidad` | 🟡 Operativo | > 5 endosos/habilidad | Por oficio, nivel PDS |
| **D2.7** | **Brecha Habilidades 360° (Evidencia vs Requerida)** | Calidad evidencia técnica | `AVG(COUNT(evidencia_360_chamba) / COUNT(habilidades_requeridas_chamba))` | `chamba.evidencia_entrada/salida` + `habilidades_validadas` | 🟠 Táctico | ≥ 1.0 | Por categoría, hito |
| **D2.8** | **Tiempo Promedio N1 → N3 (Práctico)** | Velocidad desarrollo profesional | `AVG(fecha_nivel3 - fecha_nivel1) WHERE progresión` | `habilidad_nivel.creado_en` | 🔴 Estratégico | < 18 meses | Por oficio |

### Dimensión 3: Tasas de Transición a Empleos Estables y Formalización

| # | KPI | Definición | Fórmula | Fuente | Nivel | Target | Segmentación |
|---|-----|------------|---------|--------|-------|--------|--------------|
| **D3.1** | **% PDS con ≥10 Contratos/Año (Umbral Ley 1429)** | Elegibilidad seguridad social | `COUNT(PDS contratos_completados ≥10/año) / COUNT(PDS activo)` | `contracts` (estado=completado) | 🔴 Estratégico | > 25% | Por oficio, región |
| **D3.2** | **Alertas Ley 1429/1562 Activadas / PDS Elegibles** | Cobertura alerta formalización | `COUNT(alerta_enviada) / COUNT(PDS ≥10 contratos)` | `notificaciones` (tipo=alerta_formalizacion) | 🟠 Táctico | 100% | Por región, oficio |
| **D3.3** | **PDS Afiliados a Seguridad Social Post-Alerta** | Conversión alerta → acción | `COUNT(PDS afiliado_tras_alerta) / COUNT(alerta_enviada)` | `audit_logs` (action=afiliacion_seguridad_social) | 🔴 Estratégico | > 30% | Por alerta tipo, región |
| **D3.4** | **Certificados de Ingresos Emitidos / PDS con Ingresos** | Trazabilidad para banca/vivienda | `COUNT(certificado_ingresos) / COUNT(PDS ingresos>0)` | `audit_logs` (action=certificado_ingresos.generate) | 🔴 Estratégico | > 40% | Por uso (crédito, vivienda, visa) |
| **D3.5** | **Créditos/Vivienda Aprobados con Certificado ChambeApp** | Validación externa formalización | `COUNT(certificado_usado_aprobado) / COUNT(certificado_emitido)` | Encuesta post-emisión + alianza bancaria | 🔴 Estratégico | > 15% | Por entidad financiera |
| **D3.5** | **Conversión Anuncio Laboral → Contrato Formal** | Canal empleo estable | `COUNT(anuncio.modalidad=contrato ∧ estado=contratado) / COUNT(postulaciones)` | `anuncios_postulaciones` | 🟠 Táctico | > 10% | Por sector, región |
| **D3.6** | **PDS que Transitan: Ocasional → Merchant (Negocio)** | Emprendimiento formal | `COUNT(PDS → Merchant KYC aprobado) / COUNT(PDS activo)` | `users` (rol change) + `negocio` | 🔴 Estratégico | > 5%/año | Por oficio origen |
| **D3.7** | **Ingreso Promedio PDS Formalizado vs No Formalizado** | Prima de formalización | `AVG(ingresos_12m | formalizado) / AVG(ingresos_12m | no_formalizado)` | `wallet_transactions` + `certificado_ingresos` | 🔴 Estratégico | > 1.3x | Por oficio, región |
| **D3.8** | **Retención PDS a 12 Meses (Cohorte)** | Sostenibilidad formalización | `COUNT(PDS activo 12m post-primer_contrato) / COUNT(PDS primer_contrato)` | `contracts.creado_en` + `users.last_login` | 🟠 Táctico | > 60% | Por cohorte mes, oficio |

### Dimensión 4: Integridad, Gobernanza y Riesgos Sociales (Social Impact Lens)

| # | KPI | Definición | Fórmula | Fuente | Nivel | Target | Segmentación |
|---|-----|------------|---------|--------|-------|--------|--------------|
| **D4.1** | **Violaciones Scoping Regional (Cero Tolerancia)** | Gobernanza territorial | `COUNT(contracts WHERE solicitante.region ≠ proveedor.region)` | `contracts` + `users.region_id` | 🔴 Estratégico | **0** (P1 incident) | Por región, mes |
| **D4.2** | **Kill Switches Activos Críticos** | Resiliencia operativa | `COUNT(flags WHERE critical=true ∧ enabled=true)` | `config` (flags) | 🟡 Operativo | 0 (salvo mantenimiento) | Por flag |
| **D4.3** | **Tasa Evasión Comisión (Pago Directo vs Plataforma)** | Confianza en plataforma | `COUNT(contratos_pago_directo_sin_comision) / COUNT(contratos_completados)` | `chambas.pago_directo_confirmado` + `contracts.cobro_*_monedas` | 🟠 Táctico | < 5% | Por modalidad, región |
| **D4.4** | **Disputas Laborales / 100 Contratos** | Calidad matching + seguridad | `COUNT(disputas) / COUNT(contratos) * 100` | `disputes` + `contracts` | 🟠 Táctico | < 3% | Por categoría, región |
| **D4.5** | **PDS Suspendidos/Baneados por Fraude KYC** | Integridad identidad | `COUNT(users.status IN (suspended,banned) WHERE rol=PDS ∧ reason=kyc_fraud)` | `users` + `audit_logs` | 🟡 Operativo | < 1% | Por tipo fraude |
| **D4.6** | **Accesibilidad WCAG AA Cumplimiento** | Inclusión digital | `% páginas auditadas WCAG 2.1 AA pass` | Auditoría frontend + `axe-core` | 🟠 Táctico | 100% | Por rol, dispositivo |
| **D4.7** | **Cobertura Push Notifications (Alcance Real)** | Derecho a información | `COUNT(push_entregado) / COUNT(push_enviado)` | `push_logs` | 🟡 Operativo | > 95% | Por rol, OS |
| **D4.8** | **Huella de Carbono por Transacción (Estimada)** | Sostenibilidad ambiental | `(CO2_servidores + CO2_dispositivos) / transacciones_mes` | Estimación cloud + device | 🔴 Estratégico | < 50g CO2e/tx | Por región, mes |
| **D4.9** | **Sesgo Algorítmico: Distribución Recomendaciones por Género/Edad/Región** | Equidad IA | `KL_divergence( distrib_PDS_recomendado || distrib_PDS_población )` | `recommendation_log` + `users` | 🔴 Estratégico | < 0.1 | Mensual, por feature flag |
| **D4.10** | **Tiempo Respuesta Verificador KYC (P90)** | Derecho a trabajo | `P90(revisado_en - fecha_envio) WHERE estado=aprobado|rechazado` | `documentos_usuario` | 🟠 Táctico | < 48h | Por tipo documento |

---

## 3. Social Impact Lens: Análisis Ético Profundo

Aplicando el framework **Social Impact Lens** (7 dimensiones) a la arquitectura completa de ChambeApp:

### 3.1 Beneficiarios Directos (¿Quién mejora materialmente?)

| Grupo | Beneficio Material | Magnitud Estimada | Evidencia |
|-------|-------------------|-------------------|-----------|
| **PDS Informales (Valledupar ~15,000 potenciales)** | Historial ingresos verificable → acceso crédito/vivienda; alertas Ley 1429 → seguridad social; progresión 5 niveles → mayor tarifa | **Alta** (cambio estructural) | RF-13 (certificado), RF-10 (alerta), RF-66 (progresión), TrustScore |
| **Solicitantes (hogares/pequeños negocios)** | Matching IA reduce tiempo contratación 4h→30min; calificación bilateral reduce riesgo; visualización 360° reduce incertidumbre | **Media-Alta** | RF-05 (ML), RF-03 (rating), RF-06 (3D) |
| **Merchants (negocios locales)** | Canal anuncios laborales gratis → empleo formal; 0% comisión en modalidad B | **Media** | RF-31..48 (comerciante), RF-67..69 (anuncios) |
| **Verificadores/Soporte/Admin (empleo formal)** | Trabajo digital calificado, trazable, con auditoría inmutable | **Media** | Roles staff, audit_logs inmutables |
| **Banca/Entidades crédito** | Certificados Ley 527 verificables → reducción riesgo cartera | **Media** | RF-13, certificado_ingresos |
| **Estado (MinTrabajo, UGPP, DANE)** | Datos tiempo real formalización → política pública basada en evidencia | **Alta** (sistémico) | Alertas Ley 1429/1562, certificados, métricas agregadas |

### 3.2 Perjudicados Directos (¿Quién pierde?)

| Grupo | Pérdida | Magnitud | Mitigación |
|-----|---------|----------|------------|
| **Intermediarios informales ("buscones", "cachacos")** | Pérdida renta de intermediación opaca | **Media** | No son usuarios objetivo; plataforma los desintermedia |
| **Empleadores que evaden seguridad social** | Presión a formalizar al contratar PDS con alerta Ley 1429 | **Baja-Media** (efecto deseado) | Alerta es informativa, no coercitiva; incentiva cumplimiento |
| **Plataformas competidoras sin formalización** | Ventaja competitiva de ChambeApp (TrustScore, certificado, KYC) | **Media** | Diferenciación por impacto social, no dumping de precios |
| **Usuarios con baja alfabetización digital** | Riesgo exclusión si UI no accesible | **Media** | WCAG AA, PWA offline, onboarding guiado, idioma español colombiano |

### 3.3 Efectos de Segundo Orden (Escala)

| Efecto | Descripción | Probabilidad | Señal Temprana (KPI) |
|--------|-------------|--------------|----------------------|
| **Formalización en cascada** | PDS formalizado → contrata otros PDS → multiplicador empleo formal | **Alta** | D3.6 (PDS→Merchant), D3.1 (umbral 10 contratos) |
| **Desplazamiento informalidad a otras ciudades** | Si Valledupar formaliza, informalidad migra a Sincelejo/Riohacha | **Media** | Expansión regional (RF-70..75), D1.8 (ratio rural/urbano) |
| **Dependencia plataforma (lock-in)** | PDS no puede exportar historial/reputación fácilmente | **Media** | Exportabilidad certificados (RF-13), portabilidad datos (Ley 1581) |
| **Sesgo algorítmico perpetuado** | ML recomienda más a PDS ya exitosos → brecha Matthew | **Media** | D4.9 (KL divergence), A/B testing continuo |
| **Financiarización informalidad** | Monedas/comisiones crean economía paralela no regulada | **Baja-Media** | Monedas no reembolsables (Monetizacion.md), supervisión financiera |
| **Vigilancia laboral** | Trazabilidad completa (geo, tiempo, evidencia 360°) → control patronal | **Media** | Scoping regional (ADR-3), privacy by design, Habeas Data |

### 3.4 Huella Ambiental

| Factor | Estimación | Acción |
|--------|------------|--------|
| **CO2e/transacción** | ~30-50g CO2e (servidor + red + dispositivo) | Objetivo < 50g; hosting renovable, PWA caching agresivo |
| **E-waste dispositivos** | Usuarios requieren smartphone ≥ Android 8/iOS 14 | PWA ligera, funciona en gama baja, no app nativa pesada |
| **Centro de datos** | AWS/GCP/Azure región Bogotá (renovable %) | Preferir región 100% renovable, carbon-aware scheduling |

### 3.5 Accesibilidad e Inclusión

| Barrera | Solución Implementada | Gap Pendiente |
|---------|----------------------|---------------|
| **Alfabetización digital baja** | Onboarding 3 pasos, iconografía universal, voz a texto (Web Speech API), tutoriales video cortos | Test usabilidad con adultos mayores / baja escolaridad |
| **Discapacidad visual** | WCAG 2.1 AA, contrastes coral oscurecidos (4.63:1), focus-visible, ARIA labels, screen reader friendly | Auditoría con usuarios ciegos reales |
| **Discapacidad motora** | Touch targets ≥ 44px, navegación teclado completa, voice control | Test con switch control |
| **Conectividad intermitente** | PWA + Service Worker (offline-first), Background Sync, cache agresivo | Test 2G/3G real en barrios Valledupar |
| **Idioma/Localización** | Español colombiano, formato COP, festivos Valledupar, términos locales ("maraña", "chamba") | Inclusión wayuunaiki/palenquero si expansión Caribe |
| **Género** | UI neutra, badges no estereotipados, alertas seguridad social igualitarias | D1.5 (índice equidad), análisis sesgo ML por género |

### 3.6 Coherencia Misionera (Mission Coherence)

| Valor Declarado | Implementación | Alineación |
|-----------------|----------------|------------|
| **"Reducir informalidad laboral"** | Métricas D3.1-D3.8 directas; alertas Ley 1429; certificados ingresos | **Alta** |
| **"Trazabilidad de ingresos"** | Billetera partida doble, certificado Ley 527, historial 12m, auditoría inmutable | **Alta** |
| **"IA transparente"** | RF-ML-1 explicabilidad, RF-ML-2 A/B testing, RF-ML-3 Thompson Bandit, feature flag | **Alta** |
| **"Seguridad datos / Habeas Data"** | Consentimiento clickwrap, Ley 1581, consentimiento_datos column, derecho olvido | **Alta** |
| **"Accesibilidad / PWA"** | WCAG AA, offline-first, instalable, responsive, español CO | **Media-Alta** (auditoría pendiente) |
| **"Gobernanza regional"** | Scoping estricto (ADR-3), cero tolerancia cruce regional, reindex masivo | **Alta** |

### 3.7 Riesgo Reputacional (Periodista Hostil en 3 Años)

| Titular Potencial | Probabilidad | Preparación |
|-------------------|--------------|-------------|
| *"ChambeApp: la app que vigila a los plomeros de Valledupar con GPS y cámaras 360°"* | **Media** | Privacy by design: geo solo 100m radio, evidencia 360° opcional, scoping regional, datos en Colombia |
| *"La app que cobra comisión a los más pobres y vende sus datos a bancos"* | **Baja** | Modelo: comisión solo PDS >50k, 0% primeros 3m, certificado opcional $25k, Habeas Data estricto |
| *"Algoritmo de ChambeApp discrimina a mujeres en plomería"* | **Media** | D4.9 (KL divergence), A/B testing, explicabilidad RF-ML-1, auditoría sesgo trimestral |
| *"ChambeApp lava dinero con monedas virtuales no reguladas"* | **Baja** | Monedas no reembolsables, KYC estricto, auditoría inmutable, asesoría legal financiera |
| *"Trabajadores de ChambeApp denuncian condiciones esclavas"* | **Baja** | No relación laboral (T&C §3, CST Art. 6), FSM 6 hitos protege PDS, botón pánico, doble check-in |

---

## 4. Implementación Técnica: Endpoints y Dashboard

### 4.1 Nuevos Endpoints `/superadmin/metrics/social-impact/*`

```python
# app/controllers/superadmin.py - Nuevas rutas

@blp.route("/metrics/social-impact/roles-distribution")
class SocialImpactRolesDistribution(MethodView):
    @superadmin_required
    @blp.response(200, SocialImpactRolesSchema)
    def get(self):
        """D1.1-D1.8: Distribución roles, equidad género/edad/vulnerabilidad/rural"""
        ...

@blp.route("/metrics/social-impact/skills-demand")
class SocialImpactSkillsDemand(MethodView):
    @superadmin_required
    @blp.response(200, SocialImpactSkillsSchema)
    def get(self):
        """D2.1-D2.8: Demanda habilidades, brechas, validación quiz, certificaciones, progresión"""
        ...

@blp.route("/metrics/social-impact/formalization-transitions")
class SocialImpactFormalization(MethodView):
    @superadmin_required
    @blp.response(200, SocialImpactFormalizationSchema)
    def get(self):
        """D3.1-D3.8: Umbral Ley 1429, alertas, certificados, conversión anuncio→contrato, PDS→Merchant, prima formalización, retención"""
        ...

@blp.route("/metrics/social-impact/governance-risks")
class SocialImpactGovernance(MethodView):
    @superadmin_required
    @blp.response(200, SocialImpactGovernanceSchema)
    def get(self):
        """D4.1-D4.10: Scoping regional, kill switches, evasión, disputas, fraude KYC, accesibilidad, huella carbono, sesgo ML, tiempo KYC"""
        ...

@blp.route("/metrics/social-impact/algorithmic-bias")
class SocialImpactAlgorithmicBias(MethodView):
    @superadmin_required
    @blp.response(200, AlgorithmicBiasSchema)
    def get(self):
        """D4.9 detalle: KL divergence por género/edad/región, feature importance, A/B test results"""
        ...

@blp.route("/metrics/social-impact/formalization-funnel")
class SocialImpactFormalizationFunnel(MethodView):
    @superadmin_required
    @blp.response(200, FormalizationFunnelSchema)
    def get(self):
        """Funnel completo: Registrado → KYC → Primer Contrato → 10 Contratos → Alerta → Afiliación → Certificado → Crédito"""
        ...
```

### 4.2 Esquemas de Respuesta (Ejemplo)

```python
# app/schemas/social_impact.py

class FormalizationFunnelSchema(Schema):
    registered_pds = fields.Int()
    kyc_completed = fields.Int()
    first_contract = fields.Int()
    contracts_10_plus = fields.Int()
    alert_sent = fields.Int()
    social_security_enrolled = fields.Int()
    certificate_issued = fields.Int()
    credit_approved = fields.Int()
    conversion_rates = fields.Dict(keys=fields.Str(), values=fields.Float())
    median_days_per_stage = fields.Dict(keys=fields.Str(), values=fields.Float())

class AlgorithmicBiasSchema(Schema):
    kl_divergence_gender = fields.Float()
    kl_divergence_age = fields.Float()
    kl_divergence_region = fields.Float()
    feature_importance = fields.List(fields.Dict())
    ab_test_results = fields.Dict()
    recommendation_distribution = fields.Dict(keys=fields.Str(), values=fields.Int())
    fairness_threshold_breached = fields.Bool()
```

### 4.3 Dashboard SuperAdmin: Nueva Pestaña "Impacto Social"

```jsx
// src/features/superadmin/SocialImpactDashboard.jsx
// Tabs: Resumen | Roles & Equidad | Habilidades | Formalización | Gobernanza | Sesgo IA
// KPIs críticos en tiempo real (D1.1, D1.2, D3.1, D4.1, D4.9)
// Gráficos: Funnel formalización, Distribución roles, Brecha habilidades, KL divergence temporal
// Alertas: Violación regional (P1), Sesgo ML > 0.1, KYC > 48h, Evasión > 5%
// Exportación: PDF ejecutivo mensual, CSV datos crudos para investigación
```

---

## 5. Plan de Medición y Reporte

### 5.1 Cadena de Custodia de Datos (Trazabilidad)

| KPI | Tabla Origen | Campo Clave | Audit Log | Frecuencia Cálculo |
|-----|--------------|-------------|-----------|-------------------|
| D1.2 KYC PDS | `documentos_usuario` | `estado=aprobado` WHERE `rol=pds` | `kyc.approve/reject` | Diario (job 06:00) |
| D2.3 Quiz Rate | `habilidad_nivel` | `metodo=quiz` + `creado_en` | `habilidad.quiz.approve` | Tiempo real (evento) |
| D3.1 Umbral 10 | `contracts` | `estado=completado` + `proveedor_id` | `chamba.finalizada` | Diario (job 06:00) |
| D3.4 Certificados | `audit_logs` | `action=certificado_ingresos.generate` | Inmutable | Tiempo real |
| D4.1 Violación Regional | `contracts` JOIN `users` x2 | `solicitante.region_id ≠ proveedor.region_id` | `contract.cross_region_blocked` | Tiempo real (trigger) |
| D4.9 Sesgo ML | `recommendation_log` JOIN `users` | `KL_divergence(recomendados || población)` | `ml.recommendation.logged` | Semanal (job lunes 03:00) |

### 5.2 Frecuencia de Reporte

| Reporte | Frecuencia | Formato | Destinatarios | Owner |
|---------|------------|---------|---------------|-------|
| **Dashboard Tiempo Real** | Continuo | Web (SuperAdmin) | SuperAdmin, CTO | Tech Lead |
| **Alerta P1 (Violación Regional)** | Inmediata | Push + Slack + Email | SuperAdmin, Legal, CTO | On-call |
| **Ejecutivo Semanal** | Lunes 08:00 | PDF 2 págs | CEO, Junta, Inversionistas | PM Impacto |
| **Operativo Diario** | 06:30 | Email + Dashboard | Verificadores, Soporte, PM | Tech Lead |
| **Mensual de Impacto** | Día 1 c/mes | PDF 10 págs + CSV | Junta, Inversionistas Impacto, Academia | PM Impacto |
| **Trimestral Regulador** | Día 15 post-trimestre | PDF formal + Anexos | MinTrabajo, UGPP, DANE | Legal + PM |
| **Anual Público** | Marzo | Reporte Impacto (GRI/IRIS+) | Público, Web | PM Impacto + Comms |

### 5.3 Umbrales de Alerta Automática

| KPI | Umbral Warning | Umbral Critical | Acción Automática |
|-----|----------------|-----------------|-------------------|
| D4.1 Violación Regional | N/A (cero tolerancia) | > 0 | Bloqueo contrato + P1 Slack + Email Legal |
| D4.9 Sesgo ML (KL) | > 0.05 | > 0.10 | Feature flag ML OFF + Alerta Slack + Issue Jira |
| D1.2 KYC PDS | < 50% | < 30% | Email PM + Pausa onboarding nuevos PDS |
| D3.1 Umbral 10 | < 20% | < 10% | Campaña incentivos + Revisión precios |
| D4.3 Evasión Comisión | > 3% | > 5% | Auditoría sample + Refuerzo doble check-in |
| D4.10 KYC P90 | > 36h | > 48h | Alerta verificadores + Auto-escalamiento |

---

## 6. Alineación con Estándares Internacionales

### 6.1 ODS (Objetivos Desarrollo Sostenible)

| ODS | Meta | KPIs ChambeApp |
|-----|------|----------------|
| **ODS 1: Fin de la pobreza** | 1.3 Sistemas protección social | D3.1, D3.2, D3.3 (seguridad social) |
| **ODS 8: Trabajo decente** | 8.3 Formalización empleo | D3.1-D3.8 (formalización completa) |
| | 8.5 Empleo pleno productivo | D2.5 (progresión), D3.6 (emprendimiento) |
| | 8.8 Derechos laborales | D4.4 (disputas), D4.1 (gobernanza) |
| **ODS 10: Desigualdades** | 10.2 Inclusión social/económica | D1.5 (género), D1.6 (juventud), D1.7 (vulnerables) |
| **ODS 9: Industria/Innovación** | 9.c Acceso TIC universal | D4.6 (accesibilidad), D4.7 (push reach) |
| **ODS 16: Instituciones** | 16.3 Estado de derecho | D4.1 (scoping), D4.10 (KYC tiempo) |

### 6.2 IRIS+ (GIIN) / GRI / SASB

| Estándar | Métrica ChambeApp | Código IRIS+ |
|----------|-------------------|--------------|
| **Trabajadores en empleo formal** | D3.1 (PDS ≥10 contratos/año) | PI4060 |
| **Ingresos verificables** | D3.4 (Certificados emitidos) | PI8330 |
| **Acceso servicios financieros** | D3.5 (Créditos aprobados con certificado) | PI1248 |
| **Capacitación/training** | D2.3, D2.5 (Quiz rate, progresión nivel) | OI5119 |
| **Seguridad social** | D3.2, D3.3 (Alertas, afiliación) | OI5922 |
| **Diversidad/inclusión** | D1.5, D1.6, D1.7 (Equidad) | OI7007 |
| **Huella carbono** | D4.8 (CO2e/transacción) | PI5929 |

---

## 7. Roadmap de Implementación (6 Sprints)

| Sprint | Foco | Entregables | Esfuerzo |
|--------|------|-------------|----------|
| **1** | **Backend Core** | 6 endpoints `/superadmin/metrics/social-impact/*`, jobs diarios/semanales, audit log extensions | 5 SP |
| **2** | **Dashboard SuperAdmin** | Tab "Impacto Social" con 4 sub-tabs, 20+ KPIs visualizados, alertas P1 | 5 SP |
| **3** | **Funnel & Bias** | Endpoint `/formalization-funnel`, `/algorithmic-bias`, KL divergence job semanal, A/B test integration | 3 SP |
| **4** | **Reportes Automatizados** | PDF semanal/mensual/trimestral, CSV export, email scheduling, plantillas GRI/IRIS+ | 3 SP |
| **5** | **Validación & Auditoría** | 14 flujos E2E extendidos (Social Impact), datos sintéticos test, chaos engineering bias | 3 SP |
| **6** | **Documentación & Lanzamiento** | Guía usuario SuperAdmin, documentación técnica, capacitación staff, lanzamiento progresivo | 2 SP |
| **Total** | | **60+ KPIs operativos, 6 endpoints, 1 dashboard, 4 reportes automatizados** | **21 SP** |

---

## 8. Conclusión: ChambeApp como Infraestructura de Formalización

Este sistema de KPIs transforma a ChambeApp de **plataforma de marketplace** a **infraestructura pública digital de formalización laboral**. Cada métrica está diseñada para:

1. **Ser accionable**: Umbrales claros → alertas → runbooks
2. **Ser auditable**: Trazabilidad completa `audit_logs` inmutables
3. **Ser equitativa**: Segmentación por género, edad, vulnerabilidad, geografía
4. **Ser transparente**: Explicabilidad algorítmica + A/B testing + feature flags
5. **Ser escalable**: Arquitectura regional (scoping), multi-ciudad (Sincelejo/Riohacha), multi-país

**El éxito no se mide en transacciones, sino en PDS que cruzan el umbral de la informalidad hacia la protección social, el crédito formal y la movilidad social ascendente.**

---

*Anexo A: Diccionario de Datos Completo (Tablas, Campos, Tipos)*  
*Anexo B: Queries SQL de Referencia para Cada KPI*  
*Anexo C: Plantillas de Reporte (GRI, IRIS+, Propia)*  
*Anexo C: Runbooks de Alerta (P1, Warning, Info)*  
*Anexo D: Plan de Auditoría Externa Anual*

---

*Documento versionado en `Chambeapp_Doc/SOCIAL_IMPACT_KPIS_FORMALIZACION_LABORAL.md`. Fuente de verdad para implementación backend, dashboard SuperAdmin, reportes regulatorios y evaluación de impacto. Sincronizado con código real `Chambeapp_backend` v2.0 (RF-01..RF-75, 36 blueprints, 47 modelos).*