# 02 — Inventario de Componentes

> Paso 2 del flujo UI/UX · Fuente: 46 HTML de `new_view/` + `pds.css` + `mod-negocios.css`
> Cada componente = 1 archivo React (`.tsx`) + 1 CSS co-locado (`.css`)

---

## Convenciones de tabla

| Columna | Significado |
|---------|-------------|
| **Componente React** | Nombre PascalCase del archivo `src/components/ui/`, `layout/` o `domain/` |
| **Reemplaza** | Clases/bloques HTML que absorbe (líneas de `pds.css` / `mod-negocios.css`) |
| **Archivos origen** | HTMLs de `new_view/` que usan ese patrón |
| **Variantes** | Props que modifican apariencia (enum/string) |
| **Estados** | Estados obligatorios a soportar |
| **Tokens** | Variables de `tokens.css` que consume |
| **Prioridad** | P0 = blocker para migración · P1 = alta · P2 = nice-to-have |

---

## 1. UI — Primitivos (`src/components/ui/`)

### 1.1 Button

| Campo | Valor |
|-------|-------|
| **Componente** | `Button` |
| **Reemplaza** | `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-block`, `.btn-secondary`, `.btn-outline` (pds.css:194-203, components-button.html) |
| **Archivos origen** | 28 archivos HTML (todos usan `.btn`) + 14 `components-*.html` |
| **Variantes** | `primary` (default) · `secondary` · `ghost` · `outline` |
| **Estados** | default · hover · active · focus-visible · `disabled` · `loading` (spinner inline) · `fullWidth` (block) |
| **Tokens** | `--coral-500/400/600`, `--gris-400/700`, `--radius-sm`, `--font`, `--focus-ring`, `--duration`, `--ease` |
| **Prioridad** | **P0** |

> **Nota:** `.btn-primary:active` usa `scale(.96)` (components-button.html). Loading state NUEVO: spinner de 16px inline con `currentColor`.

### 1.2 Input

| Campo | Valor |
|-------|-------|
| **Componente** | `Input` |
| **Reemplaza** | `.input` (pds.css:225-230), `.field > input`, `.field > select` (components-input.html) |
| **Archivos origen** | 20+ archivos HTML + `components-input.html` |
| **Variantes** | `text` · `email` · `tel` · `password` · `number` · `search` · `file` · `date` · `range` |
| **Estados** | default · focus · error (`.field.error`) · disabled · `loading` |
| **Tokens** | `--border`, `--coral-500`, `--err`, `--gris-400/500/900`, `--radius-sm`, `--font` |
| **Prioridad** | **P0** |

### 1.3 Textarea

| Campo | Valor |
|-------|-------|
| **Componente** | `Textarea` |
| **Reemplaza** | `textarea.input` (pds-buscar.html:modal mApply, pds-mensajes:compose) + `.chat-input-field` (components-chatinput.html) |
| **Archivos origen** | pds-buscar, sol-solicitudes, sol-mensajes, merchant-solicitudes, components-chatinput |
| **Variantes** | `default` · `chat` (auto-resize + send button integration) |
| **Estados** | default · focus · error · disabled · auto-resize |
| **Tokens** | Mismos que Input + `--radius-sm` |
| **Prioridad** | **P0** |

### 1.4 Field / FormField

| Campo | Valor |
|-------|-------|
| **Componente** | `FormField` |
| **Reemplaza** | `.form-row` (pds.css:535), `.field > label` + input + `.form-error` + `.hint` (components-input.html), `.form-section` + `.fs-label` (pds.css:1321-1323) |
| **Archivos origen** | 15+ archivos con formularios |
| **Variantes** | `default` · `inline` (label + input en fila) · `section` (con `.fs-label`) |
| **Estados** | default · error (con `.form-error` inline) · disabled |
| **Tokens** | `--gris-500`, `--err`, `--err-text`, `--err-bg`, `--err-border`, `--font` |
| **Prioridad** | **P0** |

### 1.5 Select

| Campo | Valor |
|-------|-------|
| **Componente** | `Select` |
| **Reemplaza** | `select.input` (pds-buscar:sort-select, sol-contratos:metTipo, sol-solicitudes:apAvail) |
| **Archivos origen** | pds-buscar, sol-contratos, sol-solicitudes, merchant-solicitudes |
| **Variantes** | `default` · `native` (HTML select) |
| **Estados** | default · focus · disabled · error |
| **Tokens** | Mismos que Input |
| **Prioridad** | **P1** |

### 1.6 Switch

| Campo | Valor |
|-------|-------|
| **Componente** | `Switch` |
| **Reemplaza** | `.mode-switch` (pds.css:655-668), `.sw` / `.sw.on` (mod-negocios.css:424-426), `.switch-row` (mod-negocios.css:421) |
| **Archivos origen** | pds-perfil, merchant-verificar, negocios-mapa |
| **Variantes** | `default` |
| **Estados** | off · on · disabled · focus-visible |
| **Tokens** | `--coral-500`, `--gris-300`, `--gris-400`, `--radius-pill` |
| **Prioridad** | **P1** |

### 1.7 Checkbox / Radio

| Campo | Valor |
|-------|-------|
| **Componente** | `Checkbox` / `Radio` |
| **Reemplaza** | `.form-check` (pds.css:436-441), radio rows (negocios-mapa:filterModal) |
| **Archivos origen** | 10+ archivos con formularios |
| **Variantes** | `checkbox` · `radio` |
| **Estados** | unchecked · checked · disabled · focus-visible · error |
| **Tokens** | `--coral-500`, `--gris-300/400`, `--radius-xs` |
| **Prioridad** | **P0** |

### 1.8 Avatar

| Campo | Valor |
|-------|-------|
| **Componente** | `Avatar` |
| **Reemplaza** | `.avatar` (pds.css:148-153), `.avatar-lg` (pds.css:231-235), `.ava` (pds.css:964-975), `.rv-ava` / `.r-ava`, `.a` (stacked), `components-avatar.html` |
| **Archivos origen** | 28+ archivos |
| **Variantes** | `sm` (40px) · `md` (48px, default) · `lg` (60px) · `xl` (80px) · `initials` (default) · `image` · `stacked` (overlap group) |
| **Estados** | default · `online` (green dot) · `offline` · `verified` (vmark) |
| **Tokens** | `--coral-500`, `--gris-200/400/900`, `--radius-circle`, `--ok`, `--font` |
| **Prioridad** | **P0** |

> **Colisión resuelta:** `.avatar` en pds.css = iniciales 48px. `.avatar` en components-avatar.html = iniciales 60px default. **Gana la versión de components-avatar.html** (tamaños explícitos por prop).

### 1.9 Badge

| Campo | Valor |
|-------|-------|
| **Componente** | `Badge` |
| **Reemplaza** | `.badge` (nav-item badge, pds.css:108-114), `.badge-item` (pds.css:475-488), `.badge-status` (mod-negocios.css:174-179) |
| **Archivos origen** | 10+ archivos |
| **Variantes** | `count` (notification number) · `status` (activo/suspendido) · `icon` (with SVG) |
| **Estados** | default · `dot` (solo punto) · count > 9 → "9+" |
| **Tokens** | `--coral-500`, `--ok`, `--err`, `--warn`, `--gris-*`, `--font` |
| **Prioridad** | **P1** |

### 1.10 Pill

| Campo | Valor |
|-------|-------|
| **Componente** | `Pill` |
| **Reemplaza** | `.pill`, `.pill.ok`, `.pill.warn`, `.pill.err`, `.pill.info`, `.pill.coral` (pds.css:205-214) |
| **Archivos origen** | 20+ archivos |
| **Variantes** | `default` · `ok` · `warn` · `err` · `info` · `coral` · `interactive` (clickable, actúa como chip toggle) |
| **Estados** | default · hover (interactive) · active/selected (interactive) |
| **Tokens** | `--coral-500/600`, `--ok/ok-text/ok-bg/ok-border`, `--warn/*`, `--err/*`, `--info/*`, `--radius-pill`, `--font` |
| **Prioridad** | **P0** |

### 1.11 Chip

| Campo | Valor |
|-------|-------|
| **Componente** | `Chip` |
| **Reemplaza** | `.chip` (pds-buscar:cat-chips), `.cat-chips .chip` (pds-buscar.html) — **NO confundir con `.cat-chip`** |
| **Archivos origen** | pds-buscar (map chips), sol-solicitudes (urg-seg) |
| **Variantes** | `filter` (toggle on/off) · `removable` (con X) |
| **Estados** | default · `on/selected` · hover · disabled |
| **Tokens** | `--gris-100/700`, `--coral-500/400`, `--radius-pill`, `--border` |
| **Prioridad** | **P1** |

> **COLisión `.cat-chip`:** Ver resolución en sección de colisiones abajo.

### 1.12 Card

| Campo | Valor |
|-------|-------|
| **Componente** | `Card` |
| **Reemplaza** | `.card`, `.card-pad`, `.card-head` (pds.css:179-193, 595-603) + `components-card.html` |
| **Archivos origen** | 15+ archivos |
| **Variantes** | `default` · `pad` (con padding interno) · `interactive` (hover shadow) · `clickable` (como link) · `muted` (empty state wrapper) |
| **Estados** | default · hover · focus-visible (clickable) |
| **Tokens** | `--surface`, `--border`, `--radius`, `--shadow`, `--shadow-hover` |
| **Prioridad** | **P0** |

### 1.13 Modal (+ModalHeader/Body/Footer)

| Campo | Valor |
|-------|-------|
| **Componente** | `Modal` + `ModalHeader` + `ModalBody` + `ModalFooter` |
| **Reemplaza** | `.modal-overlay`, `.modal`, `.modal.lg`, `.modal-head`, `.modal-close`, `.modal-body`, `.modal-foot` (pds.css:497-532) |
| **Archivos origen** | 12 archivos, 22 modales (mDetail, mApply, mFilters, mBuy, mFact, mPub, mDet, mNew, mMet, reportModal, filterModal) |
| **Variantes** | `default` (560px) · `lg` (760px) · `fullscreen` (mobile) |
| **Estados** | closed · opening · open · closing · `aria-modal="true"` |
| **Tokens** | `--z-modal`, `--shadow-modal`, `--radius`, `--surface`, `--bg`, `--duration`, `--ease` |
| **Prioridad** | **P0** |

### 1.14 Sheet / BottomSheet

| Campo | Valor |
|-------|-------|
| **Componente** | `Sheet` |
| **Reemplaza** | `.bsheet` (mod-negocios.css:143-157) — bottom sheet de negocios-mapa |
| **Archivos origen** | negocios-mapa |
| **Variantes** | `bottom` (default) · `full` |
| **Estados** | closed · dragging · open · `aria-modal="true"` |
| **Tokens** | `--z-modal`, `--shadow-sheet`, `--radius-sheet`, `--surface` |
| **Prioridad** | **P1** |

### 1.15 Tabs / SegmentedControl

| Campo | Valor |
|-------|-------|
| **Componente** | `Tabs` / `SegmentedControl` |
| **Reemplaza** | `.seg`, `.seg-wrap` (pds.css:849-862, 1349-1350) — segmented tabs |
| **Archivos origen** | sol-solicitudes (#segTabs), sol-contratos (#segTabs), merchant-solicitudes (#segTabs), pds-disputas |
| **Variantes** | `segmented` (pill background, default) · `underline` (tabs clásicos) · `with-badge` (count en tab) |
| **Estados** | tab activo · tab inactivo · disabled · focus-visible |
| **Tokens** | `--gris-100`, `--surface`, `--coral-600`, `--shadow`, `--radius-pill`, `--font` |
| **Prioridad** | **P0** |

### 1.16 Dropdown / Menu

| Campo | Valor |
|-------|-------|
| **Componente** | `DropdownMenu` |
| **Reemplaza** | `.skill-edit .sk-x` (pds.css:579-585), dropdowns implícitos en topbar |
| **Archivos origen** | pds-buscar, pds-perfil, sol-solicitudes |
| **Variantes** | `default` · `icon-trigger` |
| **Estados** | closed · open · focus-first-item |
| **Tokens** | `--z-dropdown`, `--surface`, `--border`, `--shadow`, `--radius`, `--fg` |
| **Prioridad** | **P2** |

### 1.17 Toast (usa sonner)

| Campo | Valor |
|-------|-------|
| **Componente** | `Toast` (wrapper sobre `sonner`) |
| **Reemplaza** | `.toast` + `.toast.show` + `.toastMsg` (pds.css:604-619) + `components-toast.html` + todos los `showToast()` inline |
| **Archivos origen** | 12 archivos con `.toast` + 14 `components-toast.html` |
| **Variantes** | `success` · `error` · `info` · `warning` |
| **Estados** | appearing · visible · disappearing · `aria-live="polite"` |
| **Tokens** | `--z-toast`, `--shadow-toast`, `--ok/err/warn/info`, `--gris-900`, `--radius-sm` |
| **Prioridad** | **P0** |

### 1.18 EmptyState

| Campo | Valor |
|-------|-------|
| **Componente** | `EmptyState` |
| **Reemplaza** | `.empty` (pds.css:887), `.empty-state` (pds.css:1142), `.chat-empty` (pds.css:1038), `.img-empty` (pds.css:469), `.map-res-empty` (mod-negocios.css:372), `.no-chats` (components-viewer.html:208), `emptyHtml()` fallback, `components-empty.html` |
| **Archivos origen** | 8 archivos + `components-empty.html` |
| **Variantes** | `default` (card con borde) · `inline` (sin borde) · `chat` (max-width 280px) |
| **Estados** | icon · title · description · optional CTA |
| **Tokens** | `--coral-500`, `--gris-300/500/700`, `--border`, `--surface`, `--radius`, `--font` |
| **Prioridad** | **P0** |

### 1.19 Pagination

| Campo | Valor |
|-------|-------|
| **Componente** | `Pagination` |
| **Reemplaza** | `components-pagination.html` + patrón de paginación en listas |
| **Archivos origen** | `components-pagination.html`, sol-solicitudes, pds-chambas |
| **Variantes** | `default` (page buttons) · `prev-next` (solo flechas) |
| **Estados** | page active · page inactive · disabled (prev/next) · focus-visible |
| **Tokens** | `--gris-300/400/700`, `--coral-500`, `--radius-sm`, `--font` |
| **Prioridad** | **P1** |

### 1.20 Skeleton (NUEVO)

| Campo | Valor |
|-------|-------|
| **Componente** | `Skeleton` |
| **Reemplaza** | **No existe en HTML actual** — NUEVO para estados de carga |
| **Archivos origen** | Ninguno (estados de loading ausentes en todo el sistema) |
| **Variantes** | `text` · `circle` (avatar) · `rect` (card) · `thumb` (imagen) |
| **Estados** | shimmer animation · `prefers-reduced-motion` → sin animación |
| **Tokens** | `--gris-100/200`, `--radius`, `--duration` |
| **Prioridad** | **P1** |

### 1.21 Spinner / LoadingState (NUEVO)

| Campo | Valor |
|-------|-------|
| **Componente** | `Spinner` |
| **Reemplaza** | **No existe** — NUEVO para button loading y page loading |
| **Archivos origen** | Ninguno |
| **Variantes** | `sm` (16px, button) · `md` (24px, inline) · `lg` (40px, page) · `fullPage` (centrado en viewport) |
| **Estados** | spinning · `prefers-reduced-motion` → pause |
| **Tokens** | `--coral-500`, `--gris-300`, `--duration` |
| **Prioridad** | **P1** |

### 1.22 Icon (registry)

| Campo | Valor |
|-------|-------|
| **Componente** | `Icon` |
| **Reemplaza** | ~301 SVGs inline repetidos en 46 HTML. Cada `<svg class="ico" viewBox="...">` se reemplaza por `<Icon name="home" />` |
| **Archivos origen** | Todos los archivos HTML |
| **Variantes** | `name` (string del registry) · `size` (16/18/20/22/24) |
| **Estados** | N/A |
| **Tokens** | `currentColor` heredado |
| **Prioridad** | **P0** |

> **Ver `05-iconos.md` para el registry completo.** Se reutiliza `lucide-react` cuando el icono coincide; los custom se definen como paths SVG.

### 1.23 Tooltip

| Campo | Valor |
|-------|-------|
| **Componente** | `Tooltip` |
| **Reemplaza** | `title` attributes implícitos (pds-buscar:pins, sol-solicitudes:avatars) |
| **Archivos origen** | pds-buscar, sol-solicitudes, pds-perfil |
| **Variantes** | `top` · `bottom` · `left` · `right` |
| **Estados** | hidden · visible (hover/focus) |
| **Tokens** | `--gris-800`, `--surface`, `--radius-xs`, `--z-dropdown`, `--font` |
| **Prioridad** | **P2** |

### 1.24 ProgressBar

| Campo | Valor |
|-------|-------|
| **Componente** | `ProgressBar` |
| **Reemplaza** | `.track > i` (pds-inicio:banner KYC), `.contract-progress` (pds.css:1221-1229) |
| **Archivos origen** | pds-inicio, sol-contratos, pds-chambas |
| **Variantes** | `default` · `with-label` (porcentaje) · `segmented` (milestones) |
| **Estados** | 0% · partial · 100% (success color) |
| **Tokens** | `--coral-500`, `--ok`, `--gris-200`, `--radius-pill` |
| **Prioridad** | **P1** |

### 1.25 Rating / Stars

| Campo | Valor |
|-------|-------|
| **Componente** | `RatingStars` |
| **Reemplaza** | `.r-stars` (pds.css:745), `.rating` (pds.css:381-386), `.rating-dist` (mod-negocios.css:76-80), star displays en merchant-inicio |
| **Archivos origen** | pds-perfil-publico, merchant-inicio, merchant-negocio, negocio-detalle |
| **Variantes** | `display` (readonly, default) · `interactive` (selectable) · `with-count` |
| **Estados** | filled · half · empty · hover (interactive) |
| **Tokens** | `#F5A623` (star gold), `--gris-300`, `--coral-500` |
| **Prioridad** | **P1** |

---

## 2. Layout — (`src/components/layout/`)

### 2.1 AppShell

| Campo | Valor |
|-------|-------|
| **Componente** | `AppShell` |
| **Reemplaza** | `.app` layout container (pds.css:67-68) que contiene sidebar + main + tabbar |
| **Archivos origen** | 28 archivos (todos los autenticados) |
| **Variantes** | `desktop` (sidebar visible) · `tablet` (tabbar only) · `mobile` (tabbar only) |
| **Estados** | sidebar collapsed/expanded · responsive breakpoints |
| **Tokens** | `--sidebar-w`, `--topbar-h`, `--tabbar-h`, `--bg` |
| **Prioridad** | **P0** |

### 2.2 Sidebar

| Campo | Valor |
|-------|-------|
| **Componente** | `Sidebar` |
| **Reemplaza** | `.sidebar`, `.brand`, `.brand .mark`, `.brand .word`, `.nav-group`, `.nav-label`, `.nav-item`, `.nav-item .ico`, `.nav-item .badge` (pds.css:70-114) |
| **Archivos origen** | 28 archivos (copiado íntegramente en cada HTML) |
| **Variantes** | `default` · `collapsed` (solo iconos, mobile drawer) |
| **Estados** | visible (≥1024px) · hidden (<1024px) · nav-item active · hover · focus-visible |
| **Tokens** | `--sidebar-w`, `--z-topbar`, `--surface`, `--border`, `--coral-500`, `--gris-*`, `--shadow`, `--font` |
| **Prioridad** | **P0** |

> **CONFIG-DRIVEN:** El contenido del sidebar se genera desde `navigation.ts`, NO se hardcodea. Ver `03-reglas.md`.

### 2.3 Topbar

| Campo | Valor |
|-------|-------|
| **Componente** | `Topbar` |
| **Reemplaza** | `.topbar`, `.loc-chip`, `.loc-chip .dot`, `.geo-pill`, `.spacer`, `.icon-btn`, `.icon-btn .ping`, `.avatar` (pds.css:118-153) |
| **Archivos origen** | 28 archivos (idéntica estructura, solo cambia avatar initials y ping) |
| **Variantes** | `default` · `with-location` (loc-chip + geo-pill) · `minimal` (sin location) |
| **Estados** | default · notification ping visible/hidden |
| **Tokens** | `--topbar-h`, `--z-topbar`, `--surface`, `--border`, `--coral-500`, `--ok`, `--font` |
| **Prioridad** | **P0** |

### 2.4 TabBar

| Campo | Valor |
|-------|-------|
| **Componente** | `TabBar` |
| **Reemplaza** | `.tabbar`, `.tab`, `.tab .ico`, `.tab.active` (pds.css:161-177) |
| **Archivos origen** | 28 archivos (copiado íntegramente en cada HTML) |
| **Variantes** | Solo mobile (<1024px) |
| **Estados** | tab active · tab inactive · focus-visible |
| **Tokens** | `--tabbar-h`, `--z-tabbar`, `--surface`, `--border`, `--coral-500`, `--gris-400`, `--font` |
| **Prioridad** | **P0** |

> **CONFIG-DRIVEN:** El contenido se genera desde `navigation.ts`.

### 2.5 PageHeader

| Campo | Valor |
|-------|-------|
| **Componente** | `PageHeader` |
| **Reemplaza** | `.page-head` (pds.css:156-159) — h1 + p.muted |
| **Archivos origen** | 15+ archivos |
| **Variantes** | `default` (title + subtitle) · `with-back` (← back button + title) · `with-action` (title + button) |
| **Estados** | default |
| **Tokens** | `--fg`, `--muted`, `--font`, `--fs-hero`, `--fs-md` |
| **Prioridad** | **P1** |

### 2.6 SectionTitle

| Campo | Valor |
|-------|-------|
| **Componente** | `SectionTitle` |
| **Reemplaza** | `.section-title` (pds.css:223-224) |
| **Archivos origen** | 12 archivos |
| **Variantes** | `default` · `with-action` (title + button/link) |
| **Estados** | default |
| **Tokens** | `--fg`, `--font`, `--fs-4xl`, `--fw-bold` |
| **Prioridad** | **P1** |

### 2.7 Container

| Campo | Valor |
|-------|-------|
| **Componente** | `Container` (ya existe: `src/components/ui/Container.tsx`) |
| **Reemplaza** | `.content` (pds.css:155) — wrapper del contenido principal |
| **Archivos origen** | 28 archivos |
| **Variantes** | `default` · `fluid` (sin max-width) |
| **Estados** | default |
| **Tokens** | `--space-*` |
| **Prioridad** | **P0** |

### 2.8 Footer

| Campo | Valor |
|-------|-------|
| **Componente** | `Footer` (ya existe: `src/components/layout/Footer.tsx`) |
| **Reemplaza** | Solo usado en landing/auth pages |
| **Archivos origen** | Landing/auth pages (no en new_view) |
| **Variantes** | `default` · `minimal` |
| **Estados** | default |
| **Tokens** | `--gris-500`, `--border`, `--font` |
| **Prioridad** | **P2** |

---

## 3. Domain — (`src/components/domain/`)

### 3.1 JobCard

| Campo | Valor |
|-------|-------|
| **Componente** | `JobCard` |
| **Reemplaza** | `.job-card`, `.jthumb`, `.jmeta`, `.jrow`, `.jtitle`, `.jprice`, `.jsub`, `.jcat`, `.japply` (pds-buscar.html CSS + HTML) |
| **Archivos origen** | pds-buscar (7 jobs renderizados dinámicamente) |
| **Variantes** | `default` · `selected` (.sel) · `applied` (.postulado) |
| **Estados** | default · hover · selected · applied (opacity reduced, button disabled) |
| **Tokens** | `--surface`, `--border`, `--coral-500/600`, `--gris-*`, `--radius`, `--shadow`, `--font` |
| **Prioridad** | **P1** |

### 3.2 OfferCard / OfferRow

| Campo | Valor |
|-------|-------|
| **Componente** | `OfferCard` · `OfferRow` |
| **Reemplaza** | `.offer` (pds.css:249-255), `.offer-row` (pds.css:1186-1195) |
| **Archivos origen** | pds-inicio (offer), pds-chambas (offer), sol-solicitudes (offer-row), merchant-solicitudes (offer-row), sol-contratos (offer) |
| **Variantes** | `card` (grid card) · `row` (horizontal, con avatar-lg) |
| **Estados** | default · hover · accepted · rejected |
| **Tokens** | `--surface`, `--border`, `--coral-500`, `--gris-*`, `--radius`, `--shadow`, `--font` |
| **Prioridad** | **P0** |

### 3.3 ChambaCard (empleador)

| Campo | Valor |
|-------|-------|
| **Componente** | `ChambaCard` |
| **Reemplaza** | `.chamba-card`, `.cc-top`, `.cc-main`, `.cc-stats`, `.cc-offers`, `.cc-actions`, `.avatars`, `.cc-offers-txt`, `.chip-urg`, `.req-note`, `.chamba-tag` (pds.css:1197-1290) |
| **Archivos origen** | sol-solicitudes, merchant-solicitudes (**SON CLONES**) |
| **Variantes** | `default` · `with-offers` (stacked avatars) · `with-actions` (administrar button) |
| **Estados** | default · hover · `espera` · `curso` · `finalizada` (chamba-tag variants) |
| **Tokens** | `--surface`, `--border`, `--coral-500/600`, `--ok/warn/err`, `--gris-*`, `--radius`, `--shadow`, `--font` |
| **Prioridad** | **P0** |

> **CRITICAL:** `sol-solicitudes` y `merchant-solicitudes` son clones casi idénticos. Un solo componente sirve ambos roles.

### 3.4 KycDocRow

| Campo | Valor |
|-------|-------|
| **Componente** | `KycDocRow` |
| **Reemplaza** | `.kyc-doc` (pds.css:489-494), `.kyc-doc` (mod-negocios.css:259-267), `.doc-row`, `.doc-list`, `.doc-group-label` (pds.css:543-568), `.doc-cred`, `.doc-ref`, `.doc-expand` (pds.css:761-777) |
| **Archivos origen** | pds-perfil, merchant-verificar, merchant-negocio, pds-inicio (banner) |
| **Variantes** | `list` (border-bottom separator, pds.css) · `card` (full border, mod-negocios.css) · `compact` (inline, for banner) |
| **Estados** | `pending` · `done` (green ico) · `required` · `optional` |
| **Tokens** | `--ok`, `--gris-100/500`, `--border`, `--radius`, `--font` |
| **Prioridad** | **P1** |

> **COLisión `.kyc-doc`:** Ver resolución abajo.

### 3.5 ChatShell

| Campo | Valor |
|-------|-------|
| **Componente** | `ChatShell` |
| **Reemplaza** | `.chat-shell` (pds.css:945-948) — grid layout 340px + 1fr |
| **Archivos origen** | pds-mensajes, sol-mensajes (idénticos), merchant-mensajes (estática) |
| **Variantes** | `desktop` (2 columnas) · `mobile` (1 columna con toggle) |
| **Estados** | list selected · chat open |
| **Tokens** | `--border`, `--surface`, `--bg` |
| **Prioridad** | **P0** |

### 3.6 ChatList

| Campo | Valor |
|-------|-------|
| **Componente** | `ChatList` |
| **Reemplaza** | `.chat-list`, `.chat-search`, `.chat-filters`, `.chat-filter`, `.chat-scroll` (pds.css:949-963) + `.conv` items (pds.css:964-982) |
| **Archivos origen** | pds-mensajes, sol-mensajes |
| **Variantes** | `default` |
| **Estados** | search active · filter selected · conversation unread/read |
| **Tokens** | `--coral-500`, `--gris-100/200`, `--border`, `--radius`, `--font` |
| **Prioridad** | **P0** |

### 3.7 ChatListItem

| Campo | Valor |
|-------|-------|
| **Componente** | `ChatListItem` |
| **Reemplaza** | `.conv` item (pds.css:964-982) con avatar + c-meta + c-top + c-name + c-time + c-msg + unread-dot + c-badge |
| **Archivos origen** | pds-mensajes, sol-mensajes (dinámico en JS) |
| **Variantes** | `default` · `unread` (highlighted bg) |
| **Estados** | default · unread · online · hover |
| **Tokens** | `--coral-500`, `--gris-100/500/700`, `--border`, `--ok`, `--font` |
| **Prioridad** | **P0** |

### 3.8 ChatBubble

| Campo | Valor |
|-------|-------|
| **Componente** | `ChatBubble` |
| **Reemplaza** | `.msg.in` / `.msg.out` / `.msg.typing` + `.bubble` + `.meta` + `.ticks.read` (pds.css:1009-1024) + `.message--sent/--received/--system` (components-viewer.html) + `.typing-indicator` + `.typing-dot` |
| **Archivos origen** | pds-mensajes, sol-mensajes, components-viewer |
| **Variantes** | `sent` · `received` · `system` · `typing` |
| **Estados** | sent · delivered · read (ticks) · typing animation |
| **Tokens** | `--bubble-sent`, `--bubble-recv`, `--bubble-system`, `--coral-500`, `--gris-100/800`, `--radius-sm`, `--font` |
| **Prioridad** | **P0** |

### 3.9 ChatInput

| Campo | Valor |
|-------|-------|
| **Componente** | `ChatInput` |
| **Reemplaza** | `.chat-compose` + `.c-attach` + `#msgInput.input` + `.c-send` (pds.css:1030-1037) + `.chat-input` + `.input-wrapper` + `.chat-input-field` + `.chat-input-btn` (components-chatinput.html) |
| **Archivos origen** | pds-mensajes, sol-mensajes, components-chatinput |
| **Variantes** | `default` · `with-attachment` |
| **Estados** | default · focus · sending · empty (send disabled) |
| **Tokens** | `--coral-500/400`, `--gris-50`, `--border`, `--radius-sm`, `--font`, `--focus-ring` |
| **Prioridad** | **P0** |

### 3.10 ReviewCard

| Campo | Valor |
|-------|-------|
| **Componente** | `ReviewCard` |
| **Reemplaza** | `.review` (pds.css:739-746) card style + `.review` (mod-negocios.css:213-216) list-item style |
| **Archivos origen** | pds-perfil-publico, merchant-inicio, merchant-negocio, negocio-detalle |
| **Variantes** | `card` (full border, with stars) · `inline` (border-top separator) |
| **Estados** | default |
| **Tokens** | `--surface`, `--border`, `--gris-200/600/700`, `--radius`, `--font`, star gold |
| **Prioridad** | **P1** |

> **COLisión `.review`:** Ver resolución abajo.

### 3.11 StatCard

| Campo | Valor |
|-------|-------|
| **Componente** | `StatCard` |
| **Reemplaza** | `.stat` > `.num` + `.lbl` (pds.css:216-222), `.biz-stat` > `.bs-n` + `.bs-l` (mod-negocios.css:69-74) |
| **Archivos origen** | pds-inicio (4 stats), merchant-inicio (4 biz-stats) |
| **Variantes** | `default` · `hero` (hero-bal, pds.css:908-913) |
| **Estados** | default |
| **Tokens** | `--fg`, `--muted`, `--font`, `--fs-hero`, `--fs-xs` |
| **Prioridad** | **P1** |

### 3.12 StepWizard + StepCard

| Campo | Valor |
|-------|-------|
| **Componente** | `StepWizard` + `StepCard` |
| **Reemplaza** | `.wizard-steps` (mod-negocios.css:223-235), `.stepper` + `.step` (components-stepcard.html), `.timeline` + `.tl-step` + `.tl-line` (pds.css:895-907) |
| **Archivos origen** | merchant-verificar, components-stepcard, pds-chambas |
| **Variantes** | `horizontal` (stepper bar) · `vertical` (timeline) |
| **Estados** | completed · active · pending · error |
| **Tokens** | `--coral-500`, `--gris-200/600`, `--ok`, `--err`, `--radius-pill`, `--font` |
| **Prioridad** | **P1** |

### 3.13 RatingStars (domain variant)

Ver 1.25 arriba. Cuando se usa en contextos de perfil/negocio se importa como componente domain.

### 3.14 ImageThumb

| Campo | Valor |
|-------|-------|
| **Componente** | `ImageThumb` |
| **Reemplaza** | `.img-thumb` + `.img-manager` + `.img-empty` (pds.css:449-473), `.galeria-strip` (mod-negocios.css:218-221), `.jd-gallery` (pds.css:750-751), `.pp-thumb` (pub-preview) |
| **Archivos origen** | pds-perfil, sol-solicitudes, merchant-solicitudes, merchant-imagenes, merchant-negocio |
| **Variantes** | `grid` · `strip` (horizontal scroll) · `principal` (highlighted) · `add` (empty + button) |
| **Estados** | loaded · loading · error · `principal` (border accent) |
| **Tokens** | `--border`, `--coral-500`, `--gris-100/400`, `--radius`, `--font` |
| **Prioridad** | **P1** |

### 3.15 MapPin

| Campo | Valor |
|-------|-------|
| **Componente** | `MapPin` |
| **Reemplaza** | `.pin` + `.pin .dot` + `.pin.sel` + `.pin.user` (pds-buscar.html CSS), `.map-pin` + `.pin-dot` + `.pin-lbl` (mod-negocios.css:95-112) |
| **Archivos origen** | pds-buscar, negocios-mapa |
| **Variantes** | `job` (coral) · `user` (blue) · `merchant` (store icon) · `pds` (person icon) · `selected` |
| **Estados** | default · hover · selected · pulse animation |
| **Tokens** | `--coral-500/600`, `--info`, `--surface`, `--radius-circle`, `--shadow` |
| **Prioridad** | **P2** |

### 3.16 DisputeCard

| Campo | Valor |
|-------|-------|
| **Componente** | `DisputeCard` |
| **Reemplaza** | `.disp-card`, `.disp-ava`, `.disp-head`, `.disp-body`, `.disp-sec-title`, `.disp-timeline`, `.tl-item`, `.evi-grid`, `.evi`, `.disp-resolve`, `.disp-cta`, `.disp-stats`, `.disp-stat`, `.disp-toolbar` (pds.css:1070-1155) |
| **Archivos origen** | pds-disputas |
| **Variantes** | `compact` (list) · `expanded` (detail) |
| **Estados** | `abierta` · `en_proceso` · `resuelta` |
| **Tokens** | `--err`, `--warn`, `--ok`, `--surface`, `--border`, `--radius`, `--font` |
| **Prioridad** | **P1** |

### 3.17 CategoryChip

| Campo | Valor |
|-------|-------|
| **Componente** | `CategoryChip` |
| **Reemplaza** | `.cat-chip` de mod-negocios (pill horizontal para mapa) + `.cat-grid > .cat-chip` de pds (column para publicar) |
| **Archivos origen** | negocios-mapa, pds-buscar, sol-solicitudes, merchant-solicitudes |
| **Variantes** | `pill` (horizontal, for filters) · `grid` (column with icon, for forms) · `selectable` |
| **Estados** | default · selected · hover |
| **Tokens** | `--gris-100/700`, `--coral-500`, `--border`, `--radius-pill`, `--radius-xs` |
| **Prioridad** | **P1** |

> **COLisión `.cat-chip`:** Ver resolución abajo.

### 3.18 FilterSheet

| Campo | Valor |
|-------|-------|
| **Componente** | `FilterSheet` |
| **Reemplaza** | `mFilters` modal (pds-buscar) + `filterModal` (negocios-mapa) — ambos son modales/sheets de filtros |
| **Archivos origen** | pds-buscar, negocios-mapa |
| **Variantes** | `modal` (desktop) · `sheet` (mobile) |
| **Estados** | open · applying · applied |
| **Tokens** | Mismos que Modal/Sheet |
| **Prioridad** | **P1** |

### 3.19 ReportModal

| Campo | Valor |
|-------|-------|
| **Componente** | `ReportModal` |
| **Reemplaza** | `reportModal` (pds-mensajes chat context) |
| **Archivos origen** | pds-mensajes (referenciado en JS) |
| **Variantes** | `default` |
| **Estados** | open · submitting · submitted |
| **Tokens** | Mismos que Modal |
| **Prioridad** | **P2** |

---

## Resolución de Colisiones de Clase

| # | Clase | Ganador | Justificación |
|---|-------|---------|---------------|
| 1 | **`.cat-chip`** | **Se separa en 2 componentes**: `CategoryChip` (pill, para filtros de mapa, de mod-negocios) y `CategoryGridItem` (column, para form de publicar, de pds). La clase `.cat-chip` de mod-negocios.css (pill, line 134) gana el nombre `CategoryChip`; la de pds.css (column, line 1328) se renombra a `CategoryGridItem`. | Son layouts completamente opuestos (row vs column), no se puede unificar con una sola clase. |
| 2 | **`.kyc-doc`** | **Un componente `KycDocRow` con prop `variant`**: `list` (de pds.css, border-bottom, 38px icon) vs `card` (de mod-negocios.css, full border, 44px icon). El variant `card` es el default porque es más reciente y visualmente más rico. | Estructura DOM diferente pero información idéntica (icon + name + status). |
| 3 | **`.note-info`** | **pds.css gana** (blue info theme, line 918). La versión de mod-negocios.css (coral, line 430) se renombra a `.note-brand` o se unifica usando `--info-*` tokens. | Semanticamente "info" = azul. Coral = brand/alert, necesita nombre propio. |
| 4 | **`.review`** | **Se separa en 2 variantes de `ReviewCard`**: `card` (de pds.css, full border, stars, line 739) y `inline` (de mod-negocios.css, border-top, line 213). Default = `card`. | Estructura DOM y children diferentes (.r-* vs .rv-*). No se puede unificar sin romper uno de los dos. |
| 5 | **`.seg-wrap`** | **Un componente `SegmentedControl`** que reemplaza `.seg` + `.seg-wrap` (pds.css lines 849-862). La redefinición en línea 1349 se elimina (es un duplicado interno). | Duplicado interno de pds.css. Un solo componente canonical. |

---

## Conteo por grupo

| Grupo | Componentes | Archivos HTML que elimina duplicación | KB de CSS que absorbe |
|-------|-------------|---------------------------------------|----------------------|
| **ui/** | 25 | 46 (todos usan primitivos) | ~45 KB (botones, inputs, pills, cards, modals, toasts, empty states) |
| **layout/** | 8 | 28 (sidebar+topbar+tabbar repetidos) | ~25 KB (shell, sidebar, topbar, tabbar) |
| **domain/** | 19 | 30+ (chamba-card, offer, chat, kyc, reviews, etc.) | ~30 KB (cards domain, chat, disputes, wallet, profile) |
| **TOTAL** | **52** | — | **~100 KB** (de ~100 KB totales entre ambos CSS) |
