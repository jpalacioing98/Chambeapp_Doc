# 🛠️ Plan de Implementación — Mejora UX/UI del Panel Verificador

**Proyecto:** ChambeApp · `Chambeapp_admin_frontend`
**Rol:** Verificador (revisión documental KYC)
**Páginas:** 2 (Home/Dashboard + KycReviewPage/Cola)
**Versión:** 1.0 | **Fecha:** 13 noviembre 2026 | **Duración:** 4 semanas

---

## 1. Resumen ejecutivo

El **Verificador** tiene el trabajo más especializado y de mayor volumen: revisar documentos de identidad, antecedentes, financieros. Su UI actual es **la más pulida visualmente** (cards KYC con progress bars, highlight de "Nuevo", tooltips contextuales) pero tiene **deuda técnica crítica**: 482 líneas en un solo archivo, filtros 100% cliente, polling agresivo, y **accesibilidad incompleta** en la acción principal (aprobar/rechazar).

**Diferencia clave:** Verificador *juzga evidencia visual*. La UI debe optimizar para **velocidad de decisión visual** y **trazabilidad completa**.

| Indicador | Hoy | Meta (4 sem) |
|---|---|---|
| Tiempo "revisar + aprobar 1 doc" | ~35 s | < 15 s |
| Documentos/hora sostenible | ~80 | > 180 |
| Errores de rechazo sin motivo | ~3% | 0% |
| Contraste en cards KYC | Falla AA | 100% AA |
| Uso en tablet (revisión lado a lado) | Roto | Funcional |

---

## 2. Diagnóstico por categoría

### 2.1 Arquitectura y navegación — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| VN1 | **Tabbar móvil: solo 2 items** — KycReview inaccesible desde tabbar (está en sidebar) | `navigation.js:126-130` |
| VN2 | **Sin deep linking a documento** — no se puede compartir `verificador/kyc?doc=123` | `KycReviewPage.jsx` |
| VN3 | **Home y KycReview duplican lógica** de carga, polling, WebSocket | `VerificadorHome.jsx:22-61` vs `KycReviewPage.jsx:189-242` |

### 2.2 KycReviewPage — 🔴 Alta (archivo único de 482 líneas)

| # | Hallazgo | Evidencia |
|---|---|---|
| VK1 | **482 líneas, 17 `useState`, 7 `useEffect`, 3 `useMemo`, 5 componentes internos** | `KycReviewPage.jsx` completo |
| VK2 | **Filtros 100% en cliente** (`filteredDocs` useMemo) — no escala > 500 docs | `KycReviewPage.jsx:113-176` |
| VK3 | **10 selects de filtro** renderizados siempre — layout horizontal roto en móvil | `KycReviewPage.jsx:286-364` |
| VK4 | **Cards KYC sin virtualización** — renderiza todos los `filteredDocs` | `KycReviewPage.jsx:395-446` |
| VK5 | **Lógica de highlight "Nuevo" + toast + scroll** acoplada en useEffect | `KycReviewPage.jsx:223-235` |
| VK6 | **FileViewerModal + NoFileTooltip** definidos inline en el mismo archivo | `KycReviewPage.jsx:478-479` |

### 2.3 Accesibilidad — 🔴 Crítica (acción principal)

| # | Hallazgo | Evidencia |
|---|---|---|
| VA1 | **Botones Aprobar/Rechazar sin `aria-label` descriptivo** — solo icono + texto visual | `KycReviewPage.jsx:427-442` |
| VA2 | **Modal rechazo: `Textarea` sin `aria-describedby` para error/ayuda** | `KycReviewPage.jsx:469-475` |
| VA3 | **Cards clickeables sin `role="button"` ni `tabIndex`** — no accesibles por teclado | `KycReviewPage.jsx:397-401` |
| VA4 | **Progress bar por tipo (`ver-tipo__bar`) sin `role="progressbar"` ni `aria-valuenow`** | `VerificadorHome.css:150-152` |
| VA5 | **Contraste texto "SIN DOCUMENTO" (#807E7A sobre #EAE9E8) ≈ 2.8:1** — falla AA | `KycReviewPage.jsx:48`, `tokens.css:30` |

### 2.4 UX de revisión — 🟠 Media-Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| VU1 | **Zoom de documento: modal centrado** — no permite comparar lado a lado | `FileViewerModal.jsx` |
| VU2 | **Sin atajos de teclado** para Aprobar (A) / Rechazar (R) / Siguiente (→) | — |
| VU3 | **Motivo de rechazo: sin plantillas** — verificador escribe libre cada vez | `KycReviewPage.jsx:469-475` |
| VU4 | **No hay "Vista previa rápida" (hover)** — hay que clickar para ver archivo | `DocPreview` component |
| VU5 | **Contador "Nuevo" solo 8s** — si el verificador está en otro tab, se pierde | `KycReviewPage.jsx:229-231` |

### 2.5 Performance — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| VP1 | **Polling 20s + WS + visibility + focus = 4 triggers** duplicados con Home | `KycReviewPage.jsx:204-242` |
| VP2 | **`tipoOptions`, `rolOptions`, `grupoOptions` recalculados en cada render** | `KycReviewPage.jsx:87-111` |
| VP3 | **Sin React Query** — fetch crudo, sin cache, sin dedup | `kycApi.js` |

---

## 3. Dirección de diseño — *Document Review Workstation*

| Atributo | Decisión |
|---|---|
| **Modo** | **Operate** — juicio visual repetitivo, alta frecuencia |
| **Estilo** | **Data-Dense Dashboard** optimizado para **escaneo de cards** |
| **Densidad** | `VISUAL_DENSITY: 8` — máximo docs visibles, chrome mínimo |
| **Varianza** | `DESIGN_VARIANCE: 2` — rígido, predecible, sin sorpresas |
| **Movimiento** | `MOTION_INTENSITY: 3` — solo feedback táctil (press, focus) |
| **Acento** | **Verde `#22C55E`** (aprobar), **Rojo `#EF4444`** (rechazar) — grandes, inconfundibles |

### Layout objetivo (Desktop ≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 Buscar...  [Tipo ▼] [Rol ▼] [Grupo ▼] [Adjunto ▼] [Fecha ▼]   │  ← FilterBar compacta
│  Mostrando 47 de 231 docs                                    [Limpiar] │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ 📄 Cédula    │ │ 📄 RUT       │ │ 📄 Extracto  │ │ 📄 Cert.   │  │  ← Mini-stats
│  │    12        │ │    8         │ │    5         │ │    3       │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐ ┌────────────────────────┐ │
│  │  COLA DE REVISIÓN (virtualizada)    │ │  PREVIEW / DETALLE     │ │  ← Split 70/30
│  │  ┌───────────────────────────────┐  │ │  ┌──────────────────┐  │ │
│  │  │ Cédula · Juan Pérez · 10:30  │  │ │  │  [Vista previa   │  │ │
│  │  │ [PDF]          [Aprobar][✗]  │──│→ │  │   del documento] │  │ │
│  │  └───────────────────────────────┘  │ │  │  [Metadatos]     │  │ │
│  │  ┌───────────────────────────────┐  │ │  │  [Aprobar][Rech] │  │ │
│  │  │ RUT · María López · 10:25    │  │ │  └──────────────────┘  │ │
│  │  │ [IMG]         [Aprobar][✗]   │  │ │                        │ │
│  │  └───────────────────────────────┘  │ │  Atajos: A/R/→/←     │ │
│  │  ... (scroll virtual)               │ │                        │ │
│  └─────────────────────────────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile (≤ 768px) — Stack vertical

- FilterBar: colapsable en acordeón
- Cola: cards full-width, acciones sticky bottom
- Preview: drawer bottom-sheet (swipe up)

---

## Fase 0 — Quick wins (Semana 0)

| ID | Acción | Esfuerzo |
|---|---|---|
| QW-V1 | Contraste "SIN DOCUMENTO": usar `--ch-danger-text` (#B33627) en lugar de muted | 5 min |
| QW-V2 | `role="button" tabIndex=0` en cards KYC + `Enter` = abrir preview | 20 min |
| QW-V3 | `aria-label="Aprobar cédula de Juan Pérez"` en botones de acción | 15 min |
| QW-V4 | Progress bars con `role="progressbar" aria-valuenow={pct}` | 15 min |
| QW-V5 | Modal rechazo: `aria-describedby` + validación longitud mínima 10 chars | 20 min |
| QW-V6 | Deep link `?doc=123` → auto-abre preview al cargar | 30 min |

---

## Fase 1 — Fundación compartida (Semana 1)

*Parte del trabajo compartido con Admin/SuperAdmin (Fase 1 del plan Admin).*

- [ ] **F1.1** `ds-tokens.css` + `ThemeProvider` (alcance Verificador)
- [ ] **F1.2** Phosphor Icons (reemplazar Lucide en VerificadorHome.css + KycReviewPage)
- [ ] **F1.3** TanStack Query v5 — migrar `getPendientes` a `useQuery`
- [ ] **F1.4** `useRealtime` hook unificado (WS + polling dedup) en `AppShell`

---

## Fase 2 — Componentes core Verificador (Semanas 1-2)

### 2.1 KYCDataTable / VirtualizedCardGrid

- [ ] **F2.1** `@tanstack/react-virtual` para cards KYC — renderiza solo viewport + buffer
- [ ] **F2.2** `KYCCard` componente puro: props `{doc, onApprove, onReject, onPreview, highlight}`
- [ ] **F2.3** `KYCCardSkeleton` que replica layout exacto (imagen, meta, acciones)
- [ ] **F2.4** Navegación teclado: `↑/↓` selecciona, `Enter` preview, `A` aprobar, `R` rechazar, `→` siguiente

### 2.2 FilterBarPro KYC

- [ ] **F2.5** Acordeón colapsable en móvil ("Filtros ▼")
- [ ] **F2.6** Combobox searchable para "Tipo de documento" (> 10 valores)
- [ ] **F2.7** Chips de filtros activos + "Limpiar todo"
- [ ] **F2.8** URL sync (`?tipo=cedula&adjunto=con&fecha=7d`)

### 2.3 DocumentPreview (nuevo)

- [ ] **F2.9** `DocumentViewer` — visor PDF/IMG con zoom, rotación, descarga
- [ ] **F2.10** Modo **split-view** (desktop): lista 70% + preview 30% residable
- [ ] **F2.11** Mobile: bottom-sheet drawer con `snapPoints=[0.5, 1.0]`
- [ ] **F2.12** "Sin archivo" → tooltip con "Ver requisitos" (link a docs)

### 2.4 RejectReasonField

- [ ] **F2.13** Plantillas de rechazo versionadas (cargadas de Config)
- [ ] **F2.14** Autocomplete de plantillas (`/` para buscar)
- [ ] **F2.15** Validación: mín 10 chars, máx 500, contador visible

---

## Fase 3 — Rediseño de páginas (Semanas 2-3)

### 3.1 VerificadorHome → Compact Dashboard

- [ ] **F3.1** Stats row: 4 mini-cards (Total, Usuarios, Tipos, Promedio/día)
- [ ] **F3.2** "Distribución por tipo" → barras horizontales compactas (no cards)
- [ ] **F3.3** "Recientes" → 5 items + "Ver cola completa" (link a KycReview)
- [ ] **F3.4** Eliminar polling/WS duplicado → usa `useRealtime` global

### 3.2 KycReviewPage → Review Workstation

```
Archivos nuevos:
features/verificador/
├── KycReviewPage.jsx           (shell: FilterBar + VirtualizedGrid + PreviewPanel)
├── components/
│   ├── KYCFilterBar.jsx
│   ├── KYCVirtualizedGrid.jsx
│   ├── KYCCard.jsx
│   ├── DocumentPreviewPanel.jsx
│   ├── RejectReasonField.jsx
│   └── ReviewShortcutsHelp.jsx
```

- [ ] **F3.5** Layout split 70/30 (desktop) / stack (móvil)
- [ ] **F3.6** Preview panel persistente: click card → carga en panel derecho
- [ ] **F3.7** Acciones en preview: Aprobar / Rechazar / Siguiente / Anterior
- [ ] **F3.8** Atajos de teclado globales (`A`/`R`/`ArrowRight`/`ArrowLeft`) + help modal (`?`)
- [ ] **F3.9** Highlight "Nuevo" persistente hasta que se actúe (no 8s)
- [ ] **F3.10** Contador "Docs revisados hoy" en header (gamificación ligera)

---

## Fase 4 — Movimiento y pulido (Semana 3)

- [ ] **F4.1** Press feedback: botones Aprobar/Rechazar `scale(0.96)` 100ms
- [ ] **F4.2** Card selection: `outline` 2px verde/rojo según última acción
- [ ] **F4.3** Toast "Aprobado" con "Deshacer" (3s) → revierte en backend
- [ ] **F4.4** Reduced-motion: desactiva highlight pulse, mantiene color feedback

---

## Fase 5 — Hardening (Semana 4)

### 5.1 Testing

- [ ] **F5.1** Vitest: KYCCard, FilterBar, RejectReasonField, DocumentPreview
- [ ] **F5.2** Playwright 5 flujos E2E

### 5.2 Flujos E2E obligatorios (Verificador)

1. Login → KycReview → Filtrar "Cédula" + "Con archivo" → Aprobar 1 (tecla A) → Ver contador + toast
2. KycReview → Click card → Preview panel abre → Rechazar con plantilla "Illegible" → Verificar motivo guardado
3. KycReview → Navegar teclado: `↓` `↓` `Enter` (preview) → `A` (aprobar) → `→` (siguiente) → `R` (rechazar)
4. Mobile → Tabbar "Inicio" → "Más" → KycReview → Swipe up preview → Aprobar → Swipe down
5. Deep link `verificador/kyc?doc=42&tipo=cedula` → Abre preview directo con filtro aplicado

### 5.3 Performance

- [ ] **F5.3** Render 200 cards virtualizadas < 50ms
- [ ] **F5.4** Preview panel open < 80ms (PDF.js lazy load)
- [ ] **F5.5** Lighthouse móvil > 90, axe 0 violations

### 5.4 Docs

- [ ] **F5.6** Storybook: KYCCard, DocumentPreview, RejectReasonField
- [ ] **F5.7** Runbook: "Cómo configurar plantillas de rechazo"

---

## Riesgos específicos Verificador

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| PDF.js bundle grande (~2MB) afecta LCP | Media | Alto | **Lazy load** solo al abrir preview; placeholder mientras carga |
| Atajos de teclado chocan con navegador (A = "Añadir favoritos" en Chrome) | Media | Medio | Usar `Alt+A` / `Alt+R` o `Meta+A` en Mac; documentar en help modal |
| Backend no soporta filtros server-side hoy | Alta | Alto | Implementar filtros cliente + server híbrido; migrar API cuando backend listo |
| Verificadores usan tablet en vertical | Media | Medio | Test obligatorio en 768x1024; split-view colapsa a stack |

---

## Definition of Done (Verificador)

- [ ] KycReviewPage < 200 líneas (shell), componentes < 150 c/u
- [ ] 0 violations axe AA (contraste, teclado, ARIA)
- [ ] 200 docs virtualizados, scroll 60fps
- [ ] Atajos `A`/`R`/`→`/`←` funcionan en desktop
- [ ] Mobile: bottom-sheet preview + sticky actions
- [ ] 5 flujos E2E verdes
- [ ] Plantillas de rechazo configurables (no hardcodeadas)

---

## Próximos pasos

1. **Aprobar plan** - confirmar si split-view desktop es prioridad v1 o v1.1
2. Rama `feat/verificador-v2` - comparte `ds-tokens.css` y `useRealtime` con Admin
3. Ejecutar Fase 0 (quick wins) esta semana sobre producción
4. Fase 1-2 en paralelo con Admin (componentes core compartidos)

---

## Estado de implementación (13 nov 2026)

Implementado sin dependencias nuevas, sobre la fundación del plan SuperAdmin.

| Área | Entregado |
|---|---|
| Workstation KYC | `KycReviewPage` reescrita en 3 zonas: cola sticky + visor + datos; 3 columnas reales desde 1360 px y paneles lista↔detalle por debajo |
| Visor de documentos | `DocumentPreview` con zoom 50–400 %, rotación, reset, apertura en pestaña nueva y estados de carga/error |
| Decisión | `DecisionActions` con zona sticky en móvil, `RejectReasonField` (6 plantillas + texto libre, 10–500 caracteres, validación en vivo) y `ReviewShortcutsHelp` |
| Cola | `KycQueueList` + `KycFilterBar` con filtros, orden y chips; atajos `J/K`, `A`, `R`, `?`, `Esc` con `aria-keyshortcuts` |
| Dashboard | `VerificadorHome` con KPIs reales (usuarios, con/sin archivo, antigüedad media, más antiguo) y distribución con barra ARIA |
| Datos | `useKycPendientes` centraliza carga, polling 20 s, visibilidad/foco y socket |

**Verificación**: `tsc` sin errores · build OK · pruebas de `kycQueue` y `RejectReasonField` en verde ·
render de las páginas cubierto por `src/test/pages-roles.test.jsx`.

### Pendientes y límites de API

- ~~Solo existe `/kyc/pendientes`~~ → **cerrado**: `GET /kyc/metricas` devuelve pendientes, revisados hoy,
  tiempo medio, tasa de aprobación y antigüedad del más viejo; el dashboard ya los muestra.
- ~~Plantillas de rechazo locales~~ → **cerrado**: `GET /plantillas/` (`kyc_rechazo`), editable por el
  superadmin en la consola. Se mantiene el fallback local si la API falla.
- PDF sin zoom ni rotación (requeriría PDF.js): se abre en pestaña nueva con aviso.
- Filtros 100 % en cliente y sin virtualización: cómodo hasta ~200 documentos, no para 500+.
- `KycReviewPage` sigue en 529 líneas (DoD pedía <200): el estado y los efectos están concentrados ahí;
  los subcomponentes sí quedan por debajo de 150.