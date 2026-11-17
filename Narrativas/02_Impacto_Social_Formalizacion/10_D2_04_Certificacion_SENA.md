# Narrativa: Certificación Formal — El Puente al SENA

**KPI Asociado:** D2.4  
**Nivel:** 🔴 Crítico (mensual) / 🟠 Táctico (semanal)  
**Dimensión:** 2. Demanda de Habilidades y Brechas de Capacitación

---

## La Historia

El **quiz valida "saber hacer"**; la **certificación SENA valida "saber formal"**. Para oficios de riesgo (electricidad, gas, altura, soldadura presión), **la certificación es obligatoria legal y aseguradora**. El KPI mide: de los PDS que inician trámite, ¿cuántos terminan verificados?

---

## Qué Nos Dice Realmente

| Tasa Certificación | Interpretación | Acción Inmediata |
|--------------------|----------------|------------------|
| **< 30%** | Trámite roto: docs confusos, verificador lento, SENA no responde, PDS abandona | Verificador dedicado SENA + API carné QR + notificaciones push estado |
| **30–50%** | Funciona pero lento: cuellos de botella en verificador o carga docs | Verificador dedicado + API carné QR + notificaciones push |
| **> 50%** | **Pipeline sano**: PDS confían en ruta formal, TrustScore N4/N5 accesibles | Escalar: más verificadores / más oficios con certificación |

---

## Cuello de Botella Real: Verificador Humano (RF-65, RF-73)

Cada certificación requiere **revisión manual**. **Solución:**
1. **Verificador dedicado SENA** (medio tiempo asignado a ChambeApp)
2. **API verificación automática:** Código QR en carné SENA → verificación instantánea
3. **Notificaciones push estado:** "Tu certificación: En revisión → Aprobada/Rechazada" + deep link
4. **Verificador dedicado SENA:** Medio tiempo asignado + KPI: < 24h revisión

---

## Segmentación Obligatoria

- **Por institución:** SENA (mayoría) vs Otras (universidades, gremios, fabricantes)
- **Por oficio:** Electricidad/Gas/Altura (obligatorio) vs Plomería/Pintura (voluntario pero valorado)
- **Por nivel:** N4 (Maestro) / N5 (Experto) **requieren** certificación verificada
- **Por resultado:** Verificada / Rechazada / En revisión > 48h (alerta)

---

## Palancas de Intervención

1. **Alianza SENA técnica:** API verificación carné QR → verificación instantánea 24/7
2. **Verificador dedicado:** 1 verificador medio tiempo = 20 certificaciones/día revisadas
2. **Notificaciones push estado:** "Tu certificación eléctricista: ✅ Aprobada" / "❌ Rechazada: [motivo] → Reintentar"
2. **Incentivo PDS:** Certificación verificada = 200 monedas + badge "Verificado SENA" + prioridad matching
2. **Dashboard verificador:** Cola priorizada por antigüedad > 48h → alerta roja

---

## Riesgo Si Se Ignora

- **Tasa < 30% por 3+ meses** → PDS abandonan ruta formal → oficios de riesgo sin certificación → riesgo legal / seguro / disputas
- **Verificador único saturado** → Cuello de botella único punto de fallo → certificación se detiene si verificador enfermo/vacaciones
- **SENA no responde** → Certificación "en revisión" por semanas → PDS abandona / busca atajos informales

---

## Métricas Complementarias

- **D2.3 (Quiz Rate)** → Prerequisito: quiz aprobado → certificación
- **D2.5 (Progresión Niveles)** → N4/N5 requieren certificación verificada
- **D2.6 (Endosos)** → Endoso social + certificación = validación robusta
- **D3.1 (Umbral 10 Contratos)** → PDS certificados alcanzan umbral más rápido

---

## Alineación Estándares

- **RF-65** — Certificación técnica SENA/instituciones + Insignia Verificado
- **RF-73** — Scope regional en verificación (verificador regional)
- **Ley 1429/2010** — Formalización emprendimiento (certificación = formalidad)
- **SENA** — Certificación competencias laborales (validez nacional)
- **ODS 4.4, 8.5** — Habilidades certificadas = empleo formal

---

## Plantilla de Decisión (Para PM Impacto/SENA/Verificadores)

> **Si este mes:** Tasa certificación < 30% **O** Tiempo revisión > 48h  
> **Entonces:** 1) Asignar verificador dedicado SENA (medio tiempo) 2) Activar API carné QR SENA (verificación instantánea) 3) Push notificaciones estado certificación 4) Incentivo 200 monedas certificación verificada  
> **Owner:** PM Impacto + SENA Regional + Lead Verificadores  
> **Revisión:** Mensual (board deck)