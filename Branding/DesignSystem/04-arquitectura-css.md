# 04 — Arquitectura CSS y Plan de Migración

> Paso 2 del flujo UI/UX · Estrategia CSS y eliminación de duplicados

---

## 1. Decisión de arquitectura CSS

### Estrategia elegida: **CSS co-locado por componente con prefijo `ch-`**

```
src/
├── styles/
│   ├── tokens.css          ← Única fuente de verdad (ya existe, ~168 tokens)
│   └── globals.css         ← Reset + tipografía base + utilidades mínimas
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Button.css      ← co-locado, clases .ch-btn, .ch-btn--primary
│   │   ├── Modal.tsx
│   │   ├── Modal.css
│   │   └── index.ts
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── AppShell.css
│   │   └── index.ts
│   └── domain/
│       ├── ChambaCard.tsx
│       ├── ChambaCard.css
│       └── index.ts
```

### Justificación (5 líneas)
1. **Co-locación** = el CSS viaja con el componente, se elimina junto con él, no hay lookup en archivos monolíticos.
2. **Prefijo `ch-`** previene colisiones con librerías externas (sonner, lucide, mapbox-gl) y permite identificar quick qué clases son del DS.
3. **Sin CSS modules ni Tailwind** = el stack actual es CSS plano con variables, se mantiene consistencia con `tokens.css`.
4. **Cada `.css` se importa solo donde se usa** = Vite tree-shakes CSS no utilizado, reduce bundle.
5. **`pds.css` y `mod-negocios.css` quedan como legacy** temporalmente, se eliminan al completar migración.

### Nomenclatura definitiva

```css
/* Bloque */
.ch-btn { }

/* Elemento */
.ch-btn__icon { }
.ch-btn__label { }

/* Modificador */
.ch-btn--primary { }
.ch-btn--ghost { }
.ch-btn--loading { }
.ch-btn--full-width { }

/* Estado (data-attribute para estados JS-driven) */
.ch-btn[disabled] { opacity: .5; pointer-events: none; }
.ch-btn[data-loading] { position: relative; }
```

### Importación de CSS
```tsx
// Cada componente importa su CSS co-locado
import './Button.css';

// Los componentes que usan tokens los obtienen de globals
// tokens.css se importa UNA vez en main.tsx
import '../styles/tokens.css';
```

---

## 2. Mapa de Migración

### 2.1 App Shell (sidebar + topbar + tabbar)

| Bloque pds.css (líneas) | Componente React | Acción |
|--------------------------|-----------------|--------|
| `.app` (67-68) | `AppShell.tsx` + `AppShell.css` | **Mover** → `.ch-app-shell` |
| `.sidebar` (70-81) | `Sidebar.tsx` + `Sidebar.css` | **Mover** → `.ch-sidebar` |
| `.brand`, `.brand .mark`, `.brand .word` (82-91) | `Sidebar.tsx` (interno) | **Mover** → `.ch-sidebar__brand` |
| `.nav-group`, `.nav-label` (92-97) | `Sidebar.tsx` (interno) | **Mover** → `.ch-nav-group`, `.ch-nav-label` |
| `.nav-item`, `.nav-item .ico`, `.nav-item.active`, `.nav-item .badge` (98-114) | `Sidebar.tsx` (interno) | **Mover** → `.ch-nav-item`, `.ch-nav-item--active` |
| `.main` (116-117) | `AppShell.tsx` (interno) | **Mover** → `.ch-main` |
| `.topbar`, `.loc-chip`, `.geo-pill`, `.spacer`, `.icon-btn`, `.avatar` (118-153) | `Topbar.tsx` + `Topbar.css` | **Mover** → `.ch-topbar`, `.ch-loc-chip`, etc. |
| `.content`, `.page-head` (155-159) | `Container.tsx` + `PageHeader.tsx` | **Mover** → `.ch-content`, `.ch-page-head` |
| `.tabbar`, `.tab`, `.tab.active` (161-177) | `TabBar.tsx` + `TabBar.css` | **Mover** → `.ch-tabbar`, `.ch-tab` |

**Archivos HTML eliminados:** 28 (todos los que copian sidebar+topbar+tabbar)
**CSS eliminado:** ~35 KB (pds.css líneas 67-177, 340-443)

### 2.2 Botones, Inputs, Pills

| Bloque pds.css (líneas) | Componente React | Acción |
|--------------------------|-----------------|--------|
| `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-block` (194-204) | `Button.tsx` + `Button.css` | **Mover** → `.ch-btn`, `.ch-btn--primary` |
| `.pill`, `.pill.ok/warn/err/info/coral` (205-214) | `Pill.tsx` + `Pill.css` | **Mover** → `.ch-pill`, `.ch-pill--ok` |
| `.input` (225-230) | `Input.tsx` + `Input.css` | **Mover** → `.ch-input` |
| `.form-row`, `.form-error` (535-542) | `FormField.tsx` + `FormField.css` | **Mover** → `.ch-form-field` |
| `.form-check` (436-441) | `Checkbox.tsx` + `Checkbox.css` | **Mover** → `.ch-checkbox` |

### 2.3 Cards

| Bloque pds.css (líneas) | Componente React | Acción |
|--------------------------|-----------------|--------|
| `.card`, `.card-pad` (179-193) | `Card.tsx` + `Card.css` | **Mover** → `.ch-card`, `.ch-card--pad` |
| `.offer` (249-255) | `OfferCard.tsx` + `OfferCard.css` | **Mover** → `.ch-offer-card` |
| `.job-card` (pds-buscar CSS) | `JobCard.tsx` + `JobCard.css` | **Mover** → `.ch-job-card` |
| `.chamba-card`, `.cc-top/main/stats/offers/actions` (1247-1290) | `ChambaCard.tsx` + `ChambaCard.css` | **Mover** → `.ch-chamba-card` |
| `.offer-row` (1186-1195) | `OfferRow.tsx` (parte de OfferCard) | **Mover** → `.ch-offer-row` |
| `.stat` > `.num` + `.lbl` (216-222) | `StatCard.tsx` + `StatCard.css` | **Mover** → `.ch-stat-card` |

### 2.4 Modal + Toast + Empty

| Bloque pds.css (líneas) | Componente React | Acción |
|--------------------------|-----------------|--------|
| `.modal-overlay/open`, `.modal`, `.modal.lg`, `.modal-head/close/body/foot` (497-532) | `Modal.tsx` + `Modal.css` | **Mover** → `.ch-modal-overlay`, `.ch-modal` |
| `.toast`, `.toast.show` (604-619) | `Toast.tsx` (wrapper sonner) | **Borrar** → usar sonner directamente |
| `.empty` (887-891) | `EmptyState.tsx` + `EmptyState.css` | **Mover** → `.ch-empty-state` |
| `.empty-state` (1142-1155) | Merge into `EmptyState.tsx` | **Eliminar** duplicado |
| `.chat-empty` (1038-1041) | Merge into `EmptyState.tsx` variant="chat" | **Eliminar** duplicado |
| `.img-empty` (469-473) | Merge into `EmptyState.tsx` variant="inline" | **Eliminar** duplicado |

### 2.5 Chat

| Bloque pds.css (líneas) | Componente React | Acción |
|--------------------------|-----------------|--------|
| `.chat-shell` (945-948) | `ChatShell.tsx` + `ChatShell.css` | **Mover** → `.ch-chat-shell` |
| `.chat-list/search/filters/filter/scroll` (949-963) | `ChatList.tsx` | **Mover** → `.ch-chat-list` |
| `.conv` (964-982) | `ChatListItem.tsx` | **Mover** → `.ch-conv` |
| `.chat-main/head/job/body/compose/empty` (983-1041) | `ChatMain.tsx`, `ChatInput.tsx` | **Mover** → `.ch-chat-*` |
| `.msg/in/out`, `.bubble`, `.typing`, `.day-sep` (1007-1024) | `ChatBubble.tsx` | **Mover** → `.ch-msg`, `.ch-bubble` |
| `.chat-quick`, `.qr` (1026-1029) | `ChatQuickReplies.tsx` | **Mover** → `.ch-chat-quick` |

### 2.6 KYC, Reviews, Profile, Wallet, Disputes

| Bloque pds.css (líneas) | Componente React | Acción |
|--------------------------|-----------------|--------|
| `.kyc-doc`, `.kd-ico/name/sub/status` (489-494, 543-568) | `KycDocRow.tsx` | **Mover** → `.ch-kyc-doc` |
| `.review`, `.r-top/ava/name/meta/stars/text` (739-746) | `ReviewCard.tsx` | **Mover** → `.ch-review` |
| `.banner`, `.b-ico/body/title/sub/track/cta` (273-310) | `Banner.tsx` (domain) | **Mover** → `.ch-banner` |
| `.profile-cover/head/avatar/id/bio/actions/meta/grid` (311-441) | Per-component in profile page | **Mover** selectively |
| `.hero-bal`, `.hb-*` (908-915) | `HeroBalance.tsx` | **Mover** → `.ch-hero-balance` |
| `.pkg`, `.pkg-price/buy` (923-926) | `CoinPackage.tsx` | **Mover** → `.ch-coin-pkg` |
| `.hero-employer` (1157-1169) | `HeroBalance.tsx` (reuse) | **Mover** → `.ch-hero-balance--employer` |
| `.pay-method`, `.pay-item` (1204-1219) | `PaymentMethod.tsx`, `PaymentItem.tsx` | **Mover** → `.ch-pay-*` |
| `.disp-*` (1070-1155) | `DisputeCard.tsx` | **Mover** → `.ch-dispute-*` |
| `.timeline`, `.tl-step/line` (895-907) | `StepWizard.tsx` | **Mover** → `.ch-timeline` |
| `.chambe-badge`, `.mode-switch` (683-691, 655-668) | `Switch.tsx`, `Badge.tsx` | **Mover** → `.ch-switch`, `.ch-badge` |

### 2.7 mod-negocios.css

| Bloque mod-negocios.css (líneas) | Componente React | Acción |
|-----------------------------------|-----------------|--------|
| `.mod-hero` (7-26) | `PageHeader.tsx` variant="hero" | **Mover** → `.ch-page-head--hero` |
| `.role-grid`, `.role-card` (28-52) | `RoleCard.tsx` | **Mover** → `.ch-role-card` |
| `.biz-hero`, `.biz-logo/bh-name/bh-meta/bh-actions` (54-66) | `BusinessHeader.tsx` | **Mover** → `.ch-biz-hero` |
| `.biz-grid`, `.biz-stat` (68-74) | `StatCard.tsx` (reuse) | **Eliminar** → usar `StatCard` |
| `.rating-dist` (76-80) | `RatingDist.tsx` | **Mover** → `.ch-rating-dist` |
| `.map-wrap/canvas/pin/cluster/geo/you` (82-131) | `MapView.tsx` + map components | **Mover** → `.ch-map-*` |
| `.cat-chips`, `.cat-chip` (132-140) | `CategoryChip.tsx` | **Mover** → `.ch-category-chip` |
| `.bsheet` (143-157) | `Sheet.tsx` | **Mover** → `.ch-sheet` |
| `.biz-card` (159-172) | `Card.tsx` (reuse) | **Eliminar** → usar `Card` |
| `.badge-status`, `.type-badge` (174-183) | `Badge.tsx` variants | **Mover** → `.ch-badge--status` |
| `.detail-*` (185-210) | Page-specific components | **Mover** selectively |
| `.review` (213-216) | `ReviewCard.tsx` variant="inline" | **Eliminar** → usar `ReviewCard` |
| `.galeria-strip` (218-221) | `ImageThumb.tsx` variant="strip" | **Mover** → `.ch-img-thumb--strip` |
| `.wizard-steps` (223-235) | `StepWizard.tsx` | **Mover** → `.ch-step-wizard` |
| `.radio-row` (237-243) | `Radio.tsx` (ui) | **Eliminar** → usar `Radio` |
| `.hours-table` (245-257) | `HoursTable.tsx` (domain) | **Mover** → `.ch-hours-table` |
| `.kyc-doc` (259-267) | `KycDocRow.tsx` variant="card" | **Eliminar** → usar `KycDocRow` |
| `.ms-cover/head`, `.field-list` (270-280) | Page-specific | **Mover** selectively |
| `.map-main/top/back/search/filter/chips/fab/results` (282-380) | `MapView.tsx` sub-components | **Mover** → `.ch-map-*` |
| `.switch-row`, `.sw` (421-430) | `Switch.tsx` | **Eliminar** → usar `Switch` |
| `.note-info` (430-431) | Se renombra a `.ch-note-brand` | **Renombrar** |

---

## 3. Plan de borrado

### Meta: `pds.css` y `mod-negocios.css` eliminados al 100%

| Fase | Qué se elimina | KB recuperados |
|------|----------------|----------------|
| **Fase 1** — Shell | sidebar + topbar + tabbar + app layout | ~35 KB |
| **Fase 2** — UI primitives | btn, pill, input, card, modal, toast, empty | ~25 KB |
| **Fase 3** — Domain | offer, chamba-card, chat, kyc, reviews, wallet, disputes | ~30 KB |
| **Fase 4** — Negocios | mod-negocios.css completo | ~25 KB |
| **TOTAL** | Ambos archivos eliminados | **~115 KB** (75 + 25 + ~15 de duplicados internos) |

### Archivos que desaparecen al terminar
```
frontend-guides/new_view/pds.css              → eliminado
frontend-guides/new_view/mod-negocios.css     → eliminado
frontend-guides/new_view/*.html (46 archivos) → eliminados (referencia visual)
Chambeapp_frontend/src/index.css              → merge a globals.css o eliminado
```

### Regla de eliminación gradual
> **Cada componente migrado DEJA de importar las reglas de `pds.css` que absorbe.** Se puede hacer incrementalmente: mientras un componente exista en `pds.css`, el nuevo componente React funciona con su CSS co-locado. Al final, `pds.css` queda vacío y se borra.

---

## 4. Resolución de las 5 colisiones de clase

| # | Clase | Ganador | Acción de migración | Justificación (1 línea) |
|---|-------|---------|---------------------|------------------------|
| 1 | `.cat-chip` | mod-negocios.css (pill) → `CategoryChip.tsx` | pds.css `.cat-chip` se renombra a `.ch-category-grid-item` en `CategoryGridItem.tsx` | Son layouts opuestos (row vs column), impossible unificar. |
| 2 | `.kyc-doc` | mod-negocios.css (card) → default de `KycDocRow.tsx` | pds.css `.kyc-doc` se absorbe como `variant="list"` | La versión card es más rica y reciente. |
| 3 | `.note-info` | pds.css (blue info) → `.ch-note-info` | mod-negocios.css se renombra a `.ch-note-brand` (coral) | "info" = azul semanticamente; coral = brand, necesita nombre propio. |
| 4 | `.review` | pds.css (card) → default de `ReviewCard.tsx` | mod-negocios.css se absorbe como `variant="inline"` | La versión card tiene más features (stars, full text). |
| 5 | `.seg-wrap` | pds.css `.seg` → `SegmentedControl.tsx` | Redefinición en línea 1349 se elimina (duplicado interno) | Es un copy-paste interno de pds.css. |

---

## 5. Navegación config-driven

### Problema actual
28 archivos HTML copian el sidebar íntegramente. 28 archivos copian el tabbar íntegramente. Solo cambia el item `active` y 1 href.

### Solución
```typescript
// src/config/navigation.ts
// Una ÚNICA fuente de verdad para la navegación
// Sidebar y TabBar se renderizan desde esta config
// El item active se detecta por match de pathname
```

### Implementación
```tsx
// Sidebar.tsx
import { NAV_SIDEBAR } from '../../config/navigation';

export function Sidebar({ role, currentPath }: SidebarProps) {
  const groups = NAV_SIDEBAR[role];
  return (
    <aside className="ch-sidebar">
      <Brand />
      <nav>
        {groups.map(group => (
          <NavGroup key={group.label} group={group} activePath={currentPath} />
        ))}
      </nav>
    </aside>
  );
}
```

### Cómo se maneja el active
```typescript
// nav match: soporta subrutas
function isActive(itemPath: string, currentPath: string): boolean {
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}
```

---

## 6. Estado de `index.css` legacy

`src/index.css` actual contiene resets y estilos base. Al completar la migración:
- Los resets se consolidan en `globals.css`
- `index.css` se elimina
- `main.tsx` importa solo `globals.css` + `tokens.css`

---

## 7. Fix: Tabbar de negocio (D1b)

### Problema detectado
`negocio-detalle.html:148-154` tiene una tabbar con items de **solicitante** (`sol-inicio`, `sol-solicitudes`, `sol-contratos`) mezclados con el path "Negocios". Los links apuntaban a `sol-inicio.html`, `sol-solicitudes.html`, `sol-contratos.html` — incorrectos para el rol `negocio`.

### Causa raíz
El HTML fue copiado del template de solicitante y no se actualizaron los hrefs al contexto de negocio.

### Solución
La config `NAV_TABBAR.negocio` en `navigation.ts` ya tenía los items correctos (Inicio, Mi Negocio, Solicitudes, Mensajes, Perfil). El `AppShell` renderiza la tabbar desde la config, no desde HTML hardcodeado. **El bug queda resuelto al usar el shell config-driven.**

### Antes (HTML hardcodeado en negocio-detalle.html)
```html
<nav class="tabbar">
  <a href="sol-inicio.html">Inicio</a>         <!-- ❌ ruta de solicitante -->
  <a href="sol-solicitudes.html">Solicitudes</a> <!-- ❌ ruta de solicitante -->
  <a href="sol-contratos.html">Contratos</a>     <!-- ❌ ruta de solicitante -->
</nav>
```

### Después (config-driven desde NAV_TABBAR.negocio)
```tsx
<AppShell role="negocio">
  {/* TabBar renderiza: Inicio → /negocio, Mi Negocio → /negocio/mi-negocio,
      Solicitudes → /negocio/solicitudes, Mensajes → /negocio/mensajes,
      Perfil → /negocio/perfil */}
</AppShell>
```

---

## 8. Estado de implementación del Shell (D1b)

### Archivos creados
| Archivo | Tipo |
|---------|------|
| `src/components/layout/AppShell.tsx` | Componente principal |
| `src/components/layout/AppShell.css` | CSS co-locado |
| `src/components/layout/Sidebar.tsx` | Sidebar config-driven |
| `src/components/layout/Sidebar.css` | CSS co-locado |
| `src/components/layout/Topbar.tsx` | Topbar (2 variantes) |
| `src/components/layout/Topbar.css` | CSS co-locado |
| `src/components/layout/TabBar.tsx` | TabBar config-driven |
| `src/components/layout/TabBar.css` | CSS co-locado |
| `src/components/layout/PageHeader.tsx` | Page header reutilizable |
| `src/components/layout/PageHeader.css` | CSS co-locado |
| `src/components/layout/SectionTitle.tsx` | Section title + action |
| `src/components/layout/SectionTitle.css` | CSS co-locado |

### Z-index stacking (resuelve auditoría)
```
Sidebar  → z-index: 20  (calc(--z-topbar - 10))
Topbar   → z-index: 30  (--z-topbar)
TabBar   → z-index: 40  (--z-tabbar)
Dropdown → z-index: 50  (--z-dropdown) [otro agente]
Modal    → z-index: 80  (--z-modal) [otro agente]
Toast    → z-index: 90  (--z-toast) [otro agente]
```

---

## 9. Estado final (cierre D4 — Auditoría de integridad)

### 9.1 Inventario de archivos CSS del proyecto (2026-09-16)

| Ruta | Líneas | Categoría |
|------|--------|-----------|
| `src/styles/tokens.css` | 327 | Design tokens |
| `src/styles/globals.css` | 157 | Reset + base + legacy compat |
| **src/components/ui/** | | |
| Avatar.css | 58 | UI primitive |
| Badge.css | 54 | UI primitive |
| Button.css | 143 | UI primitive |
| Card.css | 56 | UI primitive |
| CheckRadio.css | 98 | UI primitive |
| Chip.css | 59 | UI primitive |
| Dropdown.css | 66 | UI primitive |
| EmptyState.css | 47 | UI primitive |
| Input.css | 120 | UI primitive |
| Modal.css | 135 | UI primitive |
| Pagination.css | 54 | UI primitive |
| Pill.css | 54 | UI primitive |
| ProgressBar.css | 38 | UI primitive |
| RatingStars.css | 56 | UI primitive |
| Sheet.css | 73 | UI primitive |
| Skeleton.css | 59 | UI primitive |
| Spinner.css | 33 | UI primitive |
| Switch.css | 69 | UI primitive |
| Tabs.css | 110 | UI primitive |
| Tooltip.css | 53 | UI primitive |
| **Subtotal UI** | **1,476** | |
| **src/components/layout/** | | |
| AppShell.css | 33 | Layout |
| PageHeader.css | 67 | Layout |
| SectionTitle.css | 23 | Layout |
| Sidebar.css | 126 | Layout |
| TabBar.css | 63 | Layout |
| Topbar.css | 154 | Layout |
| **Subtotal layout** | **466** | |
| **src/components/domain/** | | |
| BeforeAfterSlider.css | 102 | Domain |
| CategoryChip.css | 41 | Domain |
| CategoryGridItem.css | 58 | Domain |
| ChambaCard.css | 121 | Domain |
| ChatBubble.css | 125 | Domain |
| ChatInput.css | 108 | Domain |
| ChatList.css | 114 | Domain |
| ChatListItem.css | 109 | Domain |
| ChatShell.css | 17 | Domain |
| DisputeCard.css | 91 | Domain |
| FilterSheet.css | 23 | Domain |
| ImageThumb.css | 108 | Domain |
| JobCard.css | 92 | Domain |
| KycDocRow.css | 166 | Domain |
| MapPin.css | 84 | Domain |
| MapPlaceholder.css | 55 | Domain |
| OfferCard.css | 114 | Domain |
| ReportModal.css | 114 | Domain |
| ReviewCard.css | 44 | Domain |
| StatCard.css | 32 | Domain |
| StepCard.css | 83 | Domain |
| StepWizard.css | 81 | Domain |
| **Subtotal domain** | **1,882** | |
| **src/features/** | | |
| auth/auth.css | 674 | No migrado |
| dashboard/dashboard.css | 257 | No migrado |
| dashboard/dashboard-kyc.css | 297 | No migrado |
| landing/landing.css | 819 | No migrado |
| legal/legal.css | 285 | No migrado |
| negocio/components/NegocioInicioPage.css | 144 | Migrado |
| negocio/components/NegocioMensajesPage.css | 164 | Migrado |
| negocio/components/NegocioMiNegocioPage.css | 269 | Migrado |
| negocio/components/NegocioSolicitudesPage.css | 80 | Migrado |
| pds/components/PdsBilleteraPage.css | 288 | Migrado |
| pds/components/PdsBuscarPage.css | 146 | Migrado |
| pds/components/PdsChambasPage.css | 214 | Migrado |
| pds/components/PdsCoinsPage.css | 73 | Migrado |
| pds/components/PdsContratosPage.css | 40 | Migrado |
| pds/components/PdsDisputasPage.css | 151 | Migrado |
| pds/components/PdsInicioPage.css | 107 | Migrado |
| pds/components/PdsMensajesPage.css | 203 | Migrado |
| pds/components/PdsOfertasPage.css | 39 | Migrado |
| pds/components/PdsPerfilPage.css | 441 | Migrado |
| solicitante/solicitante.css | 492 | Migrado |
| **Subtotal features** | **4,967** | |
| | | |
| **TOTAL** | **9,275** | |

### 9.2 Archivos eliminados en cierre D4

| Archivo | Líneas | Destino |
|---------|--------|---------|
| `src/index.css` | 204 | Consolidado en `globals.css` (font import, #toast-root, card/page-header legacy) |
| `src/components/Toast.tsx` | 121 | Migrado a `src/components/ui/Toast.tsx` (sonner wrapper) |

**CSS eliminado: 325 líneas** (204 de index.css + 121 de Toast.tsx)

### 9.3 Migración Toast (D4)

Los 4 consumidores del Toast legacy (`ContractDetailPage.tsx`, `PublishSolicitudPage.tsx`, `SolicitanteHome.tsx`, `useSolicitante.ts`) fueron migrados de `toast(msg, type)` a `toast.success/error/info(msg)` usando el wrapper de sonner.

### 9.4 Consolidación de index.css (D4)

| Contenido migrado a `globals.css` | Justificación |
|-----------------------------------|---------------|
| `@import url('https://fonts.googleapis.com/css2?family=Inter...')` | Fuente Inter cargada una vez |
| `#toast-root` styles | Portal de sonner Toaster |
| `.card`, `.card__title` | Usado por auth pages (ResetPassword, ForgotPassword) |
| `.page-header`, `.page-header h1`, `.page-header__title` | Usado por auth pages |

**CSS legacy eliminado de index.css** (no migrado a globals.css):
`.btn--nequi`, `.badge--ok/warn/pendiente/completado/cancelado`, `.bubble--mine/other`, `.notif-bell__badge`, `.service-card/*`, `.grid` responsive — **0 consumidores** en TSX, eliminado como dead code.

### 9.5 Auditoría de tokens — 0 discrepancias

| Métrica | Valor |
|---------|-------|
| Variables consumidas (`var(--X)` en src/) | 104 únicas |
| Variables definidas en tokens.css | 153 |
| Consumidas pero no definidas | **0** |
| Tokens muertos (definidos, nunca consumidos) | 37 (pendiente de limpieza futura) |
| `--color-*` restantes en src/ | **0** (solo 1 comentario en tokens.css) |

### 9.6 Auditoría de reglas del DS (03-reglas.md)

| Regla | Comando / Método | Resultado |
|-------|-----------------|-----------|
| 0 hex hardcodeado en DS + features migradas | `grep -r '#[0-9a-fA-F]\{3,8\}'` en ui/layout/domain/pds/negocio/publico/solicitante CSS | **0 violaciones** |
| 0 `onclick=` inline en TSX | `grep -r 'onclick=' src/**/*.tsx` | **0 violaciones** |
| 0 `any` en components/ y config/ | `grep -r ': any\|as any' src/components/ src/config/` | **0 violaciones** |
| Modales siempre usan DS Modal/Sheet | `grep -r 'ch-modal-overlay\|role="dialog"' src/` (fuera de ui/) | **0 duplicados** |
| Ninguna feature replica shell | `grep -r 'sidebar\|topbar\|tabbar'` en features | **2 deudas pendiente** (dashboard, legal — no migradas) |

### 9.7 Deuda pendiente

| Deuda | Archivos | Razón por la que no se cerró |
|-------|----------|------------------------------|
| Hex hardcoded en auth/landing/legal/dashboard | auth.css (13), landing.css (37), legal.css (6), dashboard.css (6), dashboard-kyc.css (6) | Páginas NO migradas al DS. No romper. |
| Shell replication en dashboard | dashboard.css (`.dashboard-sidebar`), DashboardPage.tsx | Feature no migrada al DS. |
| Shell replication en legal | legal.css (`.legal__topbar`, `.legal__topbar-inner`, `.legal__topbar-actions`) | Feature no migrada al DS. |
| `any` en features | useSolicitante.ts (8 catch clauses), KycDocumentsPage.tsx (1), LoginPage.tsx (1), NegocioDetallePage.tsx (1) | Fuera del alcance de DS components/config. |
| `any` en types | types.ts (`datos?: any`) | Tipo de interfaz legacy. |
| 37 tokens muertos en tokens.css | --bg, --avatar-gradient, --fs-m, --fs-4xl/5xl/7xl/8xl, --fw-regular, --lh-loose/relaxed, 12 spacing, 9 coral tints, --ok-border, --info-border, --shadow-md/toast, --z-toast/top | Definidos para completar la escala. Pueden eliminarse en limpieza futura. |
