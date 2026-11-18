# Manual de Métricas de Impacto Social — Formalización Laboral

> **Proyecto:** ChambeApp — Plataforma Inteligente para la Contratación de Servicios Laborales
> **Ámbito:** Valledupar, Colombia
> **Marco legal:** Ley 1429/2010, Ley 1562/2012, Ley 527/1999, Decreto 1273/2018, Ley 1581/2012
> **Dónde se lee:** Dashboard **Analítica** → `/superadmin/analitica`
> **Fuente de datos:** `SOCIAL_IMPACT_KPIS_FORMALIZACION_LABORAL.md` + demo determinista en ausencia de endpoint

---

## 1. Qué mide este sistema

El impacto social de ChambeApp no se mide en transacciones, sino en **trabajadores que pasan de la informalidad a la protección social, el crédito formal y la movilidad ascendente**. Las métricas se agrupan en **4 dimensiones** y **3 narrativas transversales**.

| Dimensión | Pregunta que responde | Métricas |
|-----------|------------------------|----------|
| **1. Roles y Equidad** | ¿Quién accede y con qué equidad? | D1.1 – D1.6 |
| **2. Habilidades** | ¿Qué demanda el mercado y cómo se valida el talento? | D2.1 – D2.8 |
| **3. Formalización** | ¿Se pasa del trabajo informal al empleo protegido? | D3.1 – D3.8 |
| **4. Gobernanza** | ¿La plataforma es íntegra, equitativa y sostenible? | D4.1 – D4.10 |
| **Transversal** | Funnel, teoría del cambio y efectos sistémicos | FUNNEL, TOC, 2DO |

**Niveles de importancia**
- 🔴 **Crítico** — KPI de salud del impacto; alerta inmediata.
- 🟠 **Táctico** — rendimiento operativo; revisión semanal.
- 🟡 **Operativo** — detalle táctico; revisión diaria.

---

## 2. Cómo leer una métrica de impacto

Cada métrica tiene seis lecturas:

1. **Definición** — qué cuenta.
2. **Fórmula** — cálculo exacto y fuente.
3. **Objetivo** — meta de referencia.
4. **Bandas** — rangos con etiqueta y estado (Óptimo / Atención / Crítico).
5. **Tendencia 6 meses** — evolución mensual.
6. **Segmentos aplicables** — al pulsar un segmento se desagrega y grafica (región, oficio, género, edad, cohorte…).

> Regla: nunca narres el total sin segmentar. El agregado esconde la historia; la segmentación aplicable la revela.

---

## 3. Dimensión 1 — Roles y Equidad

### D1.1 · Ratio PDS / Solicitante
- **Definición:** equilibrio entre oferta (prestadores) y demanda (solicitantes).
- **Fórmula:** `MAU_PDS / MAU_Solicitante`.
- **Objetivo:** 0.8 – 1.5.
- **Bandas:** `<0.5` desierto de talento (crítico) · `0.5–0.8` mercado comprador (atención) · `0.8–1.5` óptimo · `1.5–2.0` mercado vendedor (atención) · `>2.0` hambre de trabajo (crítico).
- **Segmentos:** categoría, región, hora, cohorte.
- **Relacionadas:** D1.2, B2.3, D3.1.
- **Pregunta guía:** ¿el mercado tiene liquidez o un lado se apaga?

### D1.2 · KYC Completion Rate
- **Definición:** % de PDS con KYC aprobado (11 documentos) y de solicitantes (8).
- **Fórmula:** `COUNT(PDS KYC aprobado) / COUNT(PDS registrados)`.
- **Objetivo:** PDS > 60% · Solicitante > 40%.
- **Bandas:** `<40%` onboarding roto (crítico) · `40–60%` progreso (atención) · `≥60%` madurez (óptimo).
- **Segmentos:** tipo de documento, verificador, rol, región.
- **Relacionadas:** D4.10, D4.5, D3.2.
- **Pregunta guía:** ¿la puerta de entrada deja gente afuera?

### D1.3 · Equidad de Género
- **Definición:** participación femenina en PDS frente a la masculina.
- **Fórmula:** `% PDS mujeres / % PDS hombres`.
- **Objetivo:** 0.8 – 1.2.
- **Bandas:** `<0.5` barreras sistémicas (crítico) · `0.5–0.8` progreso parcial (atención) · `0.8–1.2` equidad (óptimo) · `>1.2` revisar concentración (atención).
- **Segmentos:** oficio, nivel, cohorte, región.
- **Relacionadas:** D4.9, D2.5, D3.7.
- **Pregunta guía:** ¿las mujeres acceden a los oficios mejor pagados?

### D1.4 · Juventud (18–28)
- **Definición:** proporción de PDS jóvenes.
- **Fórmula:** `% PDS 18–28 / total PDS` (referencia DANE).
- **Objetivo:** ≥ 35%.
- **Bandas:** `<25%` onboarding hostil (crítico) · `25–35%` funcional (atención) · `≥35%` renovación (óptimo).
- **Segmentos:** oficio, cohorte, región, vía de entrada.
- **Relacionadas:** D2.3, D2.5, D4.4.
- **Pregunta guía:** ¿entra la próxima generación de maestros?

### D1.5 · Vulnerables / Migrantes
- **Definición:** % de población vulnerable (migrantes, desplazados) con KYC aprobado.
- **Fórmula:** `COUNT(vulnerable KYC aprobado) / COUNT(vulnerable registrado)`.
- **Objetivo:** > 50%.
- **Bandas:** `<30%` documentación incompatible (crítico) · `30–50%` ruta lenta (atención) · `≥50%` inclusión real (óptimo).
- **Segmentos:** tipo de documento, nacionalidad, oficio, región.
- **Relacionadas:** D1.2, D2.4, D4.5.
- **Pregunta guía:** ¿la formalización incluye a quien más lo necesita?

### D1.6 · Rural vs Urbano
- **Definición:** alcance territorial de la plataforma.
- **Fórmula:** `COUNT(PDS rural) / COUNT(PDS urbano)`.
- **Objetivo:** > 0.3.
- **Bandas:** `<0.2` solo urbana (crítico) · `0.2–0.5` incipiente (atención) · `≥0.5` equilibrio (óptimo).
- **Segmentos:** corregimiento, categoría, conectividad, hora.
- **Relacionadas:** D1.1, D4.4, D3.5.
- **Pregunta guía:** ¿la plataforma profundiza o cierra la brecha territorial?

---

## 4. Dimensión 2 — Habilidades

### D2.1 · Top habilidades demandadas
- **Definición:** oficios más solicitados.
- **Fórmula:** `COUNT(solicitudes) GROUP BY categoría TOP 10`.
- **Objetivo:** actualización mensual.
- **Lectura:** estabilidad del Top 3, entradas nuevas (señal de mercado) y salidas (obsolescencia).
- **Segmentos:** mes, región, urgencia, modalidad.
- **Pregunta guía:** ¿formamos para el mercado actual o para el pasado?

### D2.2 · Brecha demanda–oferta
- **Definición:** diferencia entre lo pedido y lo ofertado por habilidad.
- **Fórmula:** `COUNT(solicitudes) − COUNT(PDS con habilidad)`.
- **Objetivo:** gap < 20%.
- **Bandas:** `<20%` equilibrado · `20–50%` oportunidad (atención) · `>50%` emergencia (crítico).
- **Cuidado:** verificar requisitos legales antes de incentivar (electricidad, gas, altura).
- **Relacionadas:** D2.1, D2.3, D2.4.

### D2.3 · Quiz rate (≥80%)
- **Definición:** % de intentos de quiz aprobados.
- **Fórmula:** `COUNT(quiz aprobado) / COUNT(quiz intentados)`.
- **Objetivo:** > 60%.
- **Bandas:** `<50%` preguntas ambiguas (crítico) · `50–70%` ajuste (atención) · `>70%` efectivo (óptimo).
- **Complemento:** intentos por aprobación (objetivo 1.5).

### D2.4 · Certificación SENA
- **Definición:** % de certificaciones técnicas verificadas.
- **Fórmula:** `COUNT(cert verificada) / COUNT(cert enviada)`.
- **Objetivo:** > 40%.
- **Bandas:** `<30%` trámite roto · `30–50%` lento · `>50%` sano.
- **Relacionadas:** D2.5, D2.6, D3.1.

### D2.5 · Progresión N1→N5
- **Definición:** % de PDS que sube de nivel por trimestre.
- **Fórmula:** `COUNT(PDS sube nivel/trimestre) / COUNT(PDS activo)`.
- **Objetivo:** > 15%/trimestre.
- **Bandas:** `<10%` escalera rota · `10–15%` valle · `>15%` motor de desarrollo.
- **Niveles:** N1 Novato → N2 Conocedor → N3 Práctico → N4 Maestro → N5 Experto.

### D2.6 · Endosos por habilidad
- **Definición:** validaciones peer-to-peer de una competencia.
- **Fórmula:** `COUNT(endosos) GROUP BY habilidad`.
- **Objetivo:** ≥ 5 por habilidad.
- **Bandas:** `<2` cultura pasiva · `2–5` emergente · `≥5` efecto red.
- **Regla:** 1 endoso por competencia por solicitante; requiere calificación 4+.

### D2.7 · Evidencia 360° / habilidad
- **Definición:** cobertura de evidencia técnica por habilidad validada.
- **Fórmula:** `AVG(evidencias 360° / habilidades requeridas)`.
- **Objetivo:** ≥ 1.0.
- **Bandas:** `<0.5` ornamental · `0.5–1.0` básico · `≥1.0` probatorio.

### D2.8 · Tiempo N1→N3
- **Definición:** meses hasta alcanzar nivel Práctico.
- **Fórmula:** `AVG(fecha N3 − fecha N1)`.
- **Objetivo:** < 18 meses.
- **Bandas:** `>24` lenta · `12–24` estándar · `<12` acelerada.

---

## 5. Dimensión 3 — Formalización

### D3.1 · % PDS ≥10 contratos/año (umbral Ley 1429)
- **Definición:** PDS que cruzan el umbral de seguridad social.
- **Fórmula:** `COUNT(PDS ≥10 contratos/año) / COUNT(PDS activo)`.
- **Objetivo:** > 25% (Año 1: 20%, Año 3: 40%).
- **Bandas:** `<15%` mercado precario · `15–25%` transición · `>25%` masificación.
- **Pregunta guía:** ¿cuántos trabajadores ganan protección vitalicia?

### D3.2 · Alerta → afiliación
- **Definición:** conversión de la alerta Ley 1429/1562 en afiliación real.
- **Fórmula:** `COUNT(afiliado tras alerta) / COUNT(alerta enviada)`.
- **Objetivo:** > 30%.
- **Bandas:** `<15%` ignorada · `15–30%` funciona · `>30%` cultura formal.
- **Relacionadas:** D3.1, D3.3, D3.7.

### D3.3 · Certificados emitidos
- **Definición:** uso del certificado de ingresos (Ley 527).
- **Fórmula:** `COUNT(certificados) / COUNT(PDS con ingresos)`.
- **Objetivo:** > 40%.
- **Bandas:** `<20%` invisible · `20–40%` conocido · `>40%` herramienta estándar.

### D3.4 · Créditos bancarios con certificado (externo)
- **Definición:** validación externa del certificado por entidades financieras (no es un producto de ChambeApp).
- **Fórmula:** `COUNT(certificado usado y aprobado) / COUNT(certificado emitido)`.
- **Objetivo:** > 15% y ≥ 3 entidades.
- **Bandas:** `<5%` sin validación · `5–15%` pilotos · `>15%` estándar de facto.

### D3.5 · Anuncio → contacto
- **Definición:** anuncios que el comercio cierra con al menos un seleccionado (PDS o solicitante). El anuncio no termina en contrato: termina en contacto.
- **Fórmula:** `anuncios cerrados con al menos un seleccionado / anuncios publicados`.
- **Objetivo:** > 60% con contacto y < 20% cerrados sin postulaciones.
- **Bandas:** `<40%` vitrina fría · `40–60%` conexión parcial · `>60%` canal efectivo.
- **Cierre:** con 1, con varios, o sin seleccionados (sin postulaciones o el comercio encontró por otro medio).

### D3.6 · PDS → Merchant
- **Definición:** transición de trabajador a empleador formal.
- **Fórmula:** `COUNT(PDS → Merchant KYC) / COUNT(PDS activo)`.
- **Objetivo:** > 5%/año.
- **Bandas:** `<2%` techo de cristal · `2–5%` emergente · `>5%` ecosistema emprendedor.

### D3.7 · Prima de formalidad
- **Definición:** diferencia de ingresos entre formalizado e informal.
- **Fórmula:** `AVG(ingresos formalizado) / AVG(ingresos informal)`.
- **Objetivo:** > 1.3x.
- **Bandas:** `<1.1x` sin prima · `1.1–1.3x` incipiente · `>1.3x` prima clara.
- **Drivers:** TrustScore, certificado, seguridad social, evidencia 360°, badges SENA.

### D3.8 · Retención 12 meses
- **Definición:** permanencia tras el primer contrato.
- **Fórmula:** `COUNT(activo 12m post-1er contrato) / COUNT(1er contrato)`.
- **Objetivo:** > 65%.
- **Bandas:** `<50%` trámite único · `50–65%` transición · `>65%` ecosistema pegajoso.

---

## 6. Dimensión 4 — Gobernanza

### D4.1 · Violaciones regionales (cero tolerancia)
- **Fórmula:** `COUNT(contratos región cruzada)`.
- **Objetivo:** 0 (incidente P1).
- **Lectura:** cualquier valor > 0 activa bloqueo, alerta legal y auditoría.

### D4.2 · Kill switches activos
- **Fórmula:** `COUNT(flags críticos OFF)`.
- **Objetivo:** 0 (salvo mantenimiento).
- **Flags críticos:** `payments_enabled`, `ml_ranking_enabled`, `kyc_required`, `regional_scoping_enabled`.

### D4.3 · Evasión de comisión
- **Fórmula:** `COUNT(contratos pago directo sin comisión) / COUNT(contratos)`.
- **Objetivo:** < 5%.
- **Bandas:** `<3%` control · `3–5%` alerta · `>5%` crisis.

### D4.4 · Disputas / 100 contratos
- **Fórmula:** `COUNT(disputas) / COUNT(contratos) × 100`.
- **Objetivo:** < 3%.
- **Tipología:** calidad, retraso, pago, alcance.

### D4.5 · Fraude KYC
- **Fórmula:** `COUNT(suspendidos por fraude) / COUNT(PDS)`.
- **Objetivo:** < 1%.
- **Bandas:** `≤0.1%` robusto · `0.1–1%` aislado · `>1%` crisis sistémica.

### D4.6 · Accesibilidad WCAG AA
- **Fórmula:** `% páginas auditadas que pasan WCAG 2.1 AA`.
- **Objetivo:** 100%.
- **Bandas:** `<90%` ilegal · `90–99%` gap crítico · `100%` inclusión.

### D4.7 · Entrega push
- **Fórmula:** `entregados / enviados`.
- **Objetivo:** > 95% (PDS/Sol 99%).
- **Bandas:** `<95%` fallo · `95–98%` gap · `>98%` sana.

### D4.8 · Huella de carbono
- **Fórmula:** `(CO2 servidores + red + dispositivos) / transacciones`.
- **Objetivo:** < 50 g CO2e (Año 3: 25 g).
- **Bandas:** `>60g` ineficiente · `30–60g` objetivo · `<30g` liderazgo.

### D4.9 · Sesgo algorítmico (KL)
- **Fórmula:** `KL(P_recomendado || P_población)` por grupo protegido.
- **Objetivo:** < 0.05.
- **Bandas:** `<0.05` equidad · `0.05–0.10` incipiente · `>0.10` inaceptable (ML OFF).

### D4.10 · Tiempo KYC (P90)
- **Fórmula:** `P90(revisado_en − fecha_envio)`.
- **Objetivo:** < 48 h (Ley 1429 Art. 29).
- **Bandas:** `<24h` garantizado · `24–48h` límite · `>48h` violación.

---

## 7. Narrativas transversales

### FUNNEL — Registro → crédito (8 etapas)
Registro → KYC → 1er contrato → 10 contratos → alerta → afiliación → certificado → crédito.
- **Objetivo:** 15% registro→crédito.
- **Uso:** detectar el cuello de botella y priorizar la intervención en esa etapa.

### TOC — Teoría del cambio (10 suposiciones)
Cada suposición se valida con un KPI: adopción, evasión, escalado KYC, ML vs heurístico, aceptación bancaria, retención, sesgo, evasión, scoping, KYC 48 h.
- **Estados:** 🟢 validada · 🟡 en prueba · 🔴 falsa · ⚪ pendiente.

### 2DO — Efectos de segundo orden (6 efectos)
Cascada de formalización, desplazamiento geográfico, lock-in reputacional, sesgo Matthew, financiarización de monedas, vigilancia laboral.
- **Uso:** monitoreo trimestral de señales tempranas y acciones preventivas.

---

## 8. Cómo construir la narrativa de impacto

1. **Elige la dimensión** (equidad, habilidades, formalización o gobernanza).
2. **Abre la métrica ancla** y anota valor, banda y objetivo.
3. **Segmenta** por oficio, región, género, edad o cohorte.
4. **Cruza con 1–2 relacionadas** para causa/efecto.
5. **Narra** con esta secuencia:
   - Contexto: *“En {dimensión}, {métrica} está en {valor} ({banda}).”*
   - Evidencia: *“El segmento {X} concentra {Y}.”*
   - Causa: *“Se explica por {relacionada} en {estado}.”*
   - Acción: *“La palanca es {lever}.”*
   - Meta: *“Objetivo {target}.”*
6. **Cierra con impacto:** a qué ODS / IRIS+ / ley responde.

---

## 9. Frecuencia y audiencias

| Audiencia | Métricas foco | Frecuencia |
|-----------|---------------|------------|
| SuperAdmin | D4.1, D4.2, D4.9, D4.10, D4.3 | Diaria |
| PM Impacto | D1.1, D1.2, D2.1, D2.2, D3.1, D3.2 | Semanal |
| PM Producto | D2.3, D2.5, D3.5, D3.6 | Semanal |
| CEO / Junta | D1.3, D1.4, D1.5, D3.1, D3.3, D3.7, FUNNEL | Mensual |
| Inversionistas | D3.4, D3.8, TOC, 2DO | Trimestral |
| Regulador / Academia | D3.1, D3.2, D4.1, D4.5, D4.6, FUNNEL | Bajo demanda |

---

## 10. Fuentes de datos y trazabilidad

| Métrica | Tabla origen | Campo clave |
|---------|--------------|-------------|
| D1.1 | `users` | rol, `last_login` |
| D1.2 | `documentos_usuario` | `estado` |
| D1.3/1.4/1.5 | `users` + `profiles` | género, edad, docs |
| D2.1/2.2 | `solicitudes` + `profiles` | categoría, habilidades |
| D2.3 | `habilidad_nivel` | `metodo=quiz` |
| D2.4 | `certificacion_tecnica` | `estado=verificado` |
| D2.5/2.8 | `habilidad_nivel` | nivel, fechas |
| D3.1 | `contracts` | `estado=completado` |
| D3.2 | `notifications` + `audit_logs` | alerta, afiliación |
| D3.3/3.4 | `audit_logs` | certificado emitido/usado |
| D3.5 | `anuncios_postulaciones` | contratado |
| D4.1 | `contracts` JOIN `users` | regiones |
| D4.9 | `recommendation_log` | KL por grupo |

Toda cifra es trazable a `audit_logs` (inmutable) y a los flujos E2E auditados.

---

## 11. Alertas automáticas sugeridas

| Métrica | Umbral | Acción |
|---------|--------|--------|
| D4.1 | > 0 | Bloqueo + P1 legal |
| D4.9 | > 0.10 | ML OFF + auditoría |
| D3.1 | < 15% | Campaña 10 contratos |
| D4.10 | > 48h | Auto-aprobación + verificadores |
| D4.3 | > 5% | Auditoría de pagos |
| D4.7 | < 95% | Revisión push |

---

*Manual de referencia. La navegación y las recetas de uso están en `MANUAL_USO_DASHBOARD_ANALITICA.md`. Los datos se leen en `/superadmin/analitica`; las gráficas operativas en `/superadmin/metricas`.*
