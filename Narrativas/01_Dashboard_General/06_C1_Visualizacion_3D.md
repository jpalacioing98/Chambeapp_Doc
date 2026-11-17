# Narrativa: Visualización 3D e Inmersiva (Módulo C)

**KPIs Asociados:** C1.1–C1.5  
**Nivel:** 🟡 Operativo (diario) / 🟠 Táctico (semanal)  
**Dimensión:** Módulo C — Visualización 3D e Inmersiva

---

## La Historia

La **visualización 3D (Mapbox GL JS) + 360° (A-Frame)** no es "feature bonita": **reduce incertidumbre pre-contratación**, valida condiciones sitio remotamente, y **documenta evidencia entrada/salida con contexto espacial**. Si la **tasa de error WebGL (C1.3) > 5%**, la experiencia se rompe en dispositivos gama baja y la promesa "reduce incertidumbre" se convierte en frustración.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Sesiones Mapbox 3D/día (C1.1)** | Creciente + > 20% MAU | Estable 10–20% MAU | < 10% MAU o cayendo | UX: "Ver en 3D" más visible / onboarding muestra valor |
| **Panorámicas 360° Cargadas (C1.2)** | > 30% solicitudes con 360° | 15–30% | < 15% | UX: "Añade 360° = 2x ofertas" + 10 monedas |
| **Tasa Error WebGL/Shader (C1.3)** | < 2% | 2–5% | > 5% | Fallback SwiftShader automático / degradar a imágenes estáticas / optimizar shaders |
| **Evidencias 360° en Chamba (C1.4)** | > 50% chambas finalizadas | 25–50% | < 25% | UX: "Evidencia 360° = validación automática habilidades" |
| **Geocercas Activas Check-in (C1.5)** | > 90% check-ins válidos | 80–90% | < 80% | Revisar GPS precision / radio_km config / GPS spoofing |

---

## Segmentación Obligatoria

- **Por dispositivo:** Gama alta (WebGL2 OK) vs Gama baja (SwiftShader fallback) vs iOS (WebGL限制)
- **Por conexión:** 4G/WiFi (360° fluido) vs 3G/2G (fallback imágenes)
- **Por rol:** PDS (captura 360°) vs Solicitante (visualiza 360°) vs Verificador (revisa evidencia)
- **Por tipo evidencia:** Entrada (inicio obra) vs Salida (fin obra) vs 360° panorama

---

## Palancas de Intervención

1. **Fallback inteligente** → Detecta WebGL fallo → auto-switch a imágenes estáticas + banner "Modo básico activado"
2. **Compresión adaptativa** → 360° WebP 50% calidad en 3G/2G, calidad full en WiFi
2. **Captura guiada** → App guía captura 360°: "Gira 360° manteniendo teléfono estable" + overlay grid
2. **Incentivo captura** → 10 monedas por evidencia 360° válida (validador automático detecta panorama válido)
2. **Degradación grácil** → Si dispositivo no soporta WebGL → galería imágenes + mensaje "Para 360° usa navegador moderno"

---

## Riesgo Si Se Ignora

- **Tasa error > 10%** → Usuarios gama baja (mayoría en Valledupar) no ven 3D → feature "muerta" para mayoría
- **360° < 15% solicitudes** → Promesa "reduce incertidumbre" incumplida → disputas por "no vi bien el trabajo" suben
- **Check-in GPS inválido > 20%** → FSM 6 hitos se rompe → disputas pago / evidencia suben

---

## Métricas Complementarias

- **B2.6 (Solicitudes con 360°)** → Input: solicitudes publicadas con 360°
- **D2.7 (Evidencias 360° completas)** → Output: chambas con evidencia entrada + salida 360°
- **D2.3 (Tiempo por Hito)** → Check-in GPS válido acelera Hito 2
- **RF-06, RF-360-1** — Implementación completa Mapbox + A-Frame

---

## Alineación Estándares

- **RNF-01** — Usabilidad (degradación grácil, accesibilidad)
- **RNF-04** — Rendimiento (carga 3D ≤ 5s conexión estándar)
- **RF-06, RF-360-1** — Implementación completa
- **ODS 9.c** — Acceso TIC (degradación grácil = inclusión gama baja)

---

## Plantilla de Decisión

> **Si hoy:** Tasa error WebGL > 5% **O** Sesiones 3D/día < 10% MAU  
> **Entonces:** 1) Activar fallback SwiftShader global 2) Auditar shaders / assets 360° 3) Campaña "Tu dispositivo soporta 3D? Prueba aquí"  
> **Owner:** Frontend Lead  
> **Revisión:** Diario hasta error < 2%