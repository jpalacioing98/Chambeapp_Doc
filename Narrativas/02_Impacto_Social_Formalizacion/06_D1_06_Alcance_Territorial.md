# Narrativa: Alcance Territorial — Rural vs Urbano

**KPI Asociado:** D1.8  
**Nivel:** 🟠 Táctico (semanal) / 🔴 Crítico (mensual)  
**Dimensión:** 1. Distribución de Roles y Equidad de Acceso

---

## La Historia

Valledupar no es solo el centro; **barrios periféricos, corregimientos (La Mesa, Patillal, Badillo) y fincas aledañas** tienen distinta informalidad. Si ChambeApp solo sirve el casco urbano, **profundiza la brecha urbano-rural**. El ratio rural/urbano mide si la plataforma llega donde más falta hace.

---

## Qué Nos Dice Realmente

| Ratio Rural/Urbano | Interpretación | Acción Inmediata |
|-------------------|----------------|------------------|
| **< 0.2** | Plataforma solo urbana: geocercas no cubren, PDS rurales sin conectividad, solicitantes urbanos no van a rural | Geocercas adaptativas (default 10km) + cascada 15km + anuncios Merchant en corregimientos |
| **0.2–0.5** | Penetración incipiente: algunos PDS rurales (jardinería, construcción fincas), pero demanda urbana no cruza | Geocercas adaptativas por densidad + seeding PDS rurales (jardinería, construcción fincas) |
| **> 0.5** | **Equilibrio**: geo-cascada (RF-Geo-2) llega a 15km, marañas en fincas, anuncios Merchant en corregimientos | Escalar: replicar modelo Sincelejo/Riohacha |

---

## Palanca: Geocercas Configurables + Cascada 15km

El **radio_km configurable (RF-Geo-1)** + **cascada 2/5/15km (RF-Geo-2)** son la llave. Si **radio_km default 5km no cubre corregimientos**, **cambiar default a 10km** o hacer adaptativo por densidad poblacional.

---

## Palancas de Intervención

1. **Geocercas adaptativas:** Default 10km en zonas baja densidad / 5km alta densidad / configurable por usuario
2. **Cascada 15km real:** Fase 3 (15km/15min) activa por default en corregimientos
3. **Seeding PDS rurales:** Campaña "Maestro en tu vereda" → 0% comisión 6m + 200 monedas + kit herramientas básicas
4. **Anuncios Merchant corregimientos:** Costo 0 monedas modalidad "contrato" en corregimientos
5. **Conectividad offline:** PWA + Service Worker → PDS rurales capturan evidencia 360° offline → sync al reconectar

---

## Riesgo Si Se Ignora

- **Ratio < 0.15** → Plataforma "solo para el centro" → exclusión sistemática → profundiza brecha urbano-rural
- **PDS rurales sin conectividad** → No capturan evidencia 360° / no reciben notificaciones → chaperos urbanos ganan contratos rurales
- **Solicitantes urbanos no van a rural** → Mercado fragmentado → fincas/veredas sin servicios formales

---

## Métricas Complementarias

- **D1.1 (Ratio PDS/Solicitante)** → Por región (rural vs urbano)
- **D2.2 (Brecha Habilidades)** → ¿Habilidades rurales (jardinería, construcción fincas) cubiertas?
- **D4.4 (Maranas)** → Marañas en fincas/corregimientos (adendas "otro_pds" rurales)
- **G3.1 (Usuarios por Región)** → Distribución DANE vs usuarios reales

---

## Alineación Estándares

- **ODS 10.2** — Inclusión social/económica (territorial)
- **ODS 11.a** — Vínculos urbano-rurales positivos
- **ODS 9.c** — Acceso TIC universal (conectividad rural)
- **RF-Geo-1, RF-Geo-2** — Geocercas + Cascada implementadas
- **ADR-3 / RF-70..75** — Scoping Regional (regiones DANE incluyendo rurales)

---

## Plantilla de Decisión (Para PM Crecimiento/PM Impacto)

> **Si este mes:** Ratio Rural/Urbano < 0.2 **O** 0 PDS activos en corregimiento X  
> **Entonces:** 1) Cambiar default radio_km a 10km en zona X 2) Campaña "Maestro en tu vereda" (0% comisión 6m + 200 monedas) 3) Anuncios Merchant corregimiento X = 0 monedas modalidad "contrato"  
> **Owner:** PM Crecimiento + PM Impacto  
> **Revisión:** Mensual (board deck)