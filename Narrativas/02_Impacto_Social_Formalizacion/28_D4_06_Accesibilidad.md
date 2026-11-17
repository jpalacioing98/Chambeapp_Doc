# Narrativa: Accesibilidad — ¿Todos Pueden Usar ChambeApp?

**KPI Asociado:** D4.6  
**Nivel:** 🟠 Táctico (semanal) / 🔴 Crítico (mensual)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

**WCAG 2.1 AA no es opcional; es ley (Ley 1618/2013, Decreto 1073/2015)** y **derecho humano**. Si un PDS ciego no puede navegar, un sordo no recibe notificaciones push, un motor fino no toca botones de 44px → **exclusión digital = exclusión laboral**.

---

## Qué Nos Dice Realmente

| % Páginas Auditadas WCAG 2.1 AA Pass | Interpretación | Acción Inmediata |
|--------------------------------------|----------------|------------------|
| **100%** | **Inclusión real**: contrastes 4.63:1 (coral oscurecido), focus-visible, ARIA labels, screen reader, teclado completo, touch targets 44px | Mantener: auditoría continua CI/CD |
| **90–99%** | **Gap crítico**: una página clave (checkout, KYC, firma contrato) falla → usuario excluido en momento crítico | **Fix prioritario < 48h**: página crítica + auditoría regresión |
| **< 90%** | **Ilegal y excluyente**: riesgo demanda, reputación, pérdida usuarios vulnerables | **Congelar deployments** hasta 100% / Auditoría externa |

---

## Barreras y Soluciones Implementadas

| Barrera | Solución Implementada | Gap Pendiente |
|---------|----------------------|---------------|
| **Alfabetización digital baja** | Onboarding 3 pasos, iconografía universal, voz a texto (Web Speech API), tutoriales video cortos | Test usabilidad con adultos mayores / baja escolaridad |
| **Discapacidad visual** | WCAG 2.1 AA, contrastes coral oscurecidos (4.63:1), focus-visible, ARIA labels, screen reader friendly | Auditoría con usuarios ciegos reales |
| **Discapacidad motora** | Touch targets ≥ 44px, navegación teclado completa, voice control | Test con switch control |
| **Conectividad intermitente** | PWA + Service Worker (offline-first), Background Sync, cache agresivo | Test 2G/3G real en barrios Valledupar |
| **Idioma/Localización** | Español colombiano, formato COP, festivos Valledupar, términos locales ("maraña", "chamba") | Inclusión wayuunaiki/palenquero si expansión Caribe |

---

## Segmentación Obligatoria

- **Por dispositivo:** Móvil (PWA) vs Desktop (Admin) → touch targets vs keyboard nav
- **Por rol:** PDS (captura evidencia) vs Solicitante (publica) vs Verificador (revisa) vs Admin (gestiona)
- **Por discapacidad:** Visual / Auditiva / Motora / Cognitiva
- **Por conectividad:** 4G/WiFi vs 3G/2G vs Offline

---

## Palancas de Intervención

1. **`axe-core` en CI/CD:** Build falla si WCAG AA fail → zero tolerance
2. **Test manual trimestral:** NVDA (Windows) / VoiceOver (iOS/Mac) / TalkBack (Android) + usuarios reales discapacidad (1/trimestre)
3. **UX inclusiva por diseño:** Contraste 4.63:1 (coral oscurecido), focus-visible 3px, ARIA labels completos, touch targets 48px
4. **Offline-first real:** Service Worker + IndexedDB → captura evidencia 360° offline → sync al reconectar
5. **Voz a texto / Texto a voz:** Web Speech API para inputs / lectura pantalla para notificaciones

---

## Riesgo Si Se Ignora

- **Página crítica (KYC, Checkout, Firma) falla WCAG** → Usuario vulnerable excluido en momento crítico → **Demanda legal (Ley 1618/2013)** + Reputación destruida + Pérdida usuarios vulnerables
- **Solo 90% páginas pass** → "Casi accesible" = inaccesible → Exclusión sistemática usuarios vulnerables
- **Sin test usuarios reales** → Accesibilidad teórica ≠ real → Gaps invisibles para auditores automáticos

---

## Métricas Complementarias

- **RNF-01** — Usabilidad y Accesibilidad (WCAG 2.1 AA obligatorio)
- **D4.7 (Push Delivery)** → Push accesible (voz, vibración, visual)
- **D4.10 (KYC Tiempo)** → KYC accesible = tiempo real
- **D1.5, D1.6, D1.7** — Equidad incluye accesibilidad

---

## Alineación Estándares

- **WCAG 2.1 AA** — Estándar internacional accesibilidad web
- **Ley 1618/2013** — Estatutaria discapacidad Colombia
- **Decreto 1073/2015** — Accesibilidad tecnologías información
- **RNF-01** — Usabilidad y Accesibilidad (WCAG 2.1 AA)
- **ODS 10.2, 11.7** — Inclusión, accesibilidad universal

---

## Plantilla de Decisión (Para PM Producto/Frontend/Legal)

> **Si hoy:** % Páginas WCAG AA pass < 100% **O** Página crítica (KYC/Checkout/Firma) falla  
> **Entonces:** 1) **Congelar deployments** hasta fix 2) Fix prioritario < 48h (página crítica) 3) Auditoría regresión completa 4) Test usuario real discapacidad < 1 semana  
> **Owner:** PM Producto + Frontend Lead + Legal  
> **Revisión:** Inmediata (crítico) + Trimestral (auditoría completa)