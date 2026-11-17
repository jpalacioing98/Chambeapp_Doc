# Narrativa: Evidencia Técnica — ¿El 360° Cumple su Promesa?

**KPI Asociado:** D2.7  
**Nivel:** 🟠 Táctico (semanal) / 🟡 Operativo (diario)  
**Dimensión:** 2. Demanda de Habilidades y Brechas de Capacitación

---

## La Historia

La **evidencia 360° (RF-06, RF-52, RF-55)** promete: "ver el antes y después en sitio, reducir incertidumbre, validar habilidades técnicas". Si **ratio evidencia/habilidad < 1.0**, el 360° es decorativo, no probatorio.

---

## Qué Nos Dice Realmente

| Ratio Evidencia/Habilidad | Interpretación | Acción Inmediata |
|---------------------------|----------------|------------------|
| **< 0.5** | 360° ornamental: PDS suben fotos genéricas, solicitantes no revisan, no alimenta endoso | UX: Captura guiada 360° obligatoria post-chamba + 10 monedas/evidencia válida |
| **0.5–1.0** | Funcional básico: evidencia entrada/salida existe pero no mapea a habilidades específicas | Mapeo 1:1 `habilidades_validadas` ↔ `evidencia_salida` 360° |
| **≥ 1.0** | **Probatorio**: cada habilidad validada tiene su evidencia 360° (antes/después tubería, cableado, pintura) | Escalar: Validación automática evidencia 360° → endoso automático |

---

## Integración Clave

`chamba.habilidades_validadas` (array IDs) **debe mapear 1:1 a `evidencia_salida` URLs 360°**. Si no, la evidencia es ruido.

**Flujo ideal:**
1. PDS completa chamba → Sube evidencia salida 360° (obligatoria para Hito 4)
2. Solicitante valida → Marca `habilidades_validadas` [ID_plomería, ID_soldadura]
3. Sistema mapea: ID_plomería → URL evidencia 360° tubería / ID_soldadura → URL evidencia 360° soldadura
4. Endoso automático: Solicitante ve evidencia 360° → Click "Endosar plomería" → Validado

---

## Segmentación Obligatoria

- **Por habilidad:** Plomería (evidencia tubería visible) vs Electricidad (cableado visible) vs Pintura (antes/después visible)
- **Por tipo evidencia:** Entrada (inicio obra) vs Salida (fin obra) vs 360° panorama
- **Por validador:** Solicitante (valida) vs Verificador (audita) vs ML (clasifica automático)

---

## Palancas de Intervención

1. **Captura guiada obligatoria:** App guía captura 360°: "Gira 360° manteniendo teléfono estable" + overlay grid + validación automática panorama válido
2. **Mapeo 1:1 obligatorio:** UI bloquea "Validar habilidades" si `habilidades_validadas` no mapea 1:1 a `evidencia_salida` 360°
2. **Incentivo captura:** 10 monedas por evidencia 360° válida (validador automático detecta panorama válido)
2. **Clasificación ML:** `evidencia_salida` → ML clasifica (tubería/cableado/pintura) → sugiere `habilidades_validadas`
2. **Validación automática:** Evidencia 360° válida + solicitante valida → Endoso automático + TrustScore bonus

---

## Riesgo Si Se Ignora

- **Ratio < 0.5** → 360° ornamental → solicitantes no confían → piden más chats/llamadas → fricción
- **Sin mapeo 1:1** → Evidencia = ruido → endoso manual subjetivo → TrustScore poco fiable
- **Sin captura guiada** → PDS suben fotos borrosas/genéricas → evidencia inútil → disputas calidad

---

## Métricas Complementarias

- **C1.2 (Panorámicas 360° Cargadas)** → Input: solicitudes con 360°
- **C1.4 (Evidencias 360° en Chamba)** → Output: chambas con evidencia 360°
- **D2.6 (Endosos 360°)** → Endoso + evidencia 360° = validación robusta
- **D3.7 (Calificación)** → Evidencia 360° respalda calificación / disputa

---

## Alineación Estándares

- **RF-06, RF-360-1** — Visualización 360° implementada
- **RF-52, RF-55** — Evidencia entrada/salida en chamba (hitos 2, 4)
- **RF-64** — Endoso social + evidencias 360°
- **ODS 9.c** — Tecnología reduce asimetría información

---

## Plantilla de Decisión (Para PM Producto/PM Impacto)

> **Si esta semana:** Ratio evidencia/habilidad < 0.5 **O** % chambas con mapeo 1:1 < 50%  
> **Entonces:** 1) UX: Captura guiada 360° obligatoria post-Hito 4 2) Mapeo 1:1 obligatorio `habilidades_validadas` ↔ `evidencia_salida` 3) Incentivo 10 monedas/evidencia 360° válida  
> **Owner:** PM Producto + PM Impacto  
> **Revisión:** Semanal