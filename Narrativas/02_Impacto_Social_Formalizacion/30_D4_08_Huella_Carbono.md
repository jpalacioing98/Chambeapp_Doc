# Narrativa: Huella de Carbono — El Costo Ambiental por Transacción

**KPI Asociado:** D4.8  
**Nivel:** 🔴 Crítico (trimestral) / 🟠 Táctico (mensual)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

Cada transacción ChambeApp consume energía: servidor (API, ML, BD), red (4G/WiFi), dispositivo (render 3D, push, GPS). **~30-50g CO2e/transacción** es el costo planetario de formalizar un trabajo. **Objetivo < 50g CO2e/tx** alinea impacto social con ambiental.

---

## Qué Nos Dice Realmente

| CO2e/Transacción | Interpretación | Acción Inmediata |
|------------------|----------------|------------------|
| **> 60g CO2e** | Ineficiente: ML inference en CPU (no GPU), 3D render pesado, polling 30s (no push), queries N+1, imágenes sin WebP | ML GPU/batch / 3D lazy-load + WebP / push nativo / PWA caching agresivo / hosting 100% renovable |
| **30–50g** | **Objetivo**: ML GPU/batch, 3D lazy-load + WebP, push nativo, PWA caching agresivo, hosting 100% renovable | Optimizar: carbon-aware scheduling / edge computing / dispositivos gama baja |
| **< 30g** | **Liderazgo**: carbon-aware scheduling (jobs en horas renovables) / edge computing / dispositivos gama baja optimizados | Escalar: objetivo Año 3 = 25g CO2e/tx |

---

## Metodología de Cálculo (Proxy)

```
CO2e/tx = (CPU-hours servidores × factor_emisión_CPU) 
        + (GB transferidos × factor_emisión_red) 
        + (device_energy_estimado × factor_emisión_dispositivo)
        / transacciones_mes
```

**Factores referencia (Colombia 2026):**
- CPU: 0.5 kg CO2e/kWh (mix eléctrico Colombia ~50% renovable)
- Red móvil: 0.15 kg CO2e/GB (4G) / 0.05 kg CO2e/GB (WiFi)
- Dispositivo: 0.002 kg CO2e/transacción (smartphone gama media)

---

## Segmentación Obligatoria

- **Por componente:** Servidor (API, ML, BD) / Red (4G vs WiFi) / Dispositivo (render 3D, push, GPS)
- **Por tipo transacción:** Contrato (pesado: ML + 3D + BD) vs Pago (ligero) vs Chat (medio)
- **Por dispositivo:** Gama alta (WebGL2, 3D fluido) vs Gama baja (SwiftShader, fallback imágenes)
- **Por región:** Valledupar (4G bueno) vs Corregimientos (3G/2G, más datos retransmitidos)

---

## Palancas de Reducción

1. **ML en GPU + Batch inference:** Pre-computa embeddings nocturno → inference < 50ms CPU
2. **3D Lazy-load + WebP:** 360° solo carga si usuario click "Ver 360°" / WebP 50% calidad en 3G
2. **Push nativo + PWA Caching:** Elimina polling 30s → Service Worker + Background Sync
2. **Carbon-aware Scheduling:** Jobs Celery (ML, limpieza, reportes) → horas valle renovable (madrugada)
2. **Hosting 100% Renovable:** AWS/GCP/Azure región Bogotá (verificar % renovable) / Edge computing
2. **Dispositivos gama baja:** PWA ligera (< 5MB) / render 3D opcional / fallback imágenes

---

## Riesgo Si Se Ignora

- **CO2e > 60g/tx** → Hipocresía impacto social (formalizas trabajo pero destruyes planeta) → Inversionistas impacto rechazan / Usuarios conscientes abandonan / Regulación futura (impuesto carbono digital)
- **Sin medición** → No se puede mejorar → "No se gestiona lo que no se mide"
- **Hosting no renovable** → 2x huella → Inversionistas ESG rechazan

---

## Métricas Complementarias

- **B1.3 (Latencia ML)** → ML GPU = menor latencia + menor CO2e
- **C1.3 (Error WebGL)** → Fallback SwiftShader = más CPU = más CO2e
- **E2.3 (Push Delivery)** → Push nativo vs Polling = 10x menos CO2e
- **G5.1-8 (Infra)** → Latencia, throughput, disco, red = proxy CO2e

---

## Alineación Estándares

- **ODS 9.4** — Infraestructura sostenible
- **ODS 12.2** — Gestión eficiente recursos naturales
- **ODS 13.2** — Acción por el clima (integrar en políticas)
- **GHG Protocol** — Corporate Standard (Scope 2: electricidad, Scope 3: cadena valor)
- **GHG Protocol ICT Sector Guidance** — Guía sector TIC
- **Science Based Targets (SBTi)** — Metas basadas en ciencia

---

## Plantilla de Decisión (Para DevOps/PM Impacto/Financiero)

> **Si este trimestre:** CO2e/tx > 50g **O** Hosting no 100% renovable  
> **Entonces:** 1) Migrar ML a GPU batch 2) Activar carbon-aware scheduling Celery 3) Migrar hosting 100% renovable (verificar certificado) 4) Objetivo Año 3: 25g CO2e/tx  
> **Owner:** DevOps Lead + PM Impacto + Financiero  
> **Revisión:** Trimestral (board deck + reporte GHG)