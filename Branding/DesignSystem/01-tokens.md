# ChambeApp · Design Tokens

Fuente canónica: `frontend-guides/new_view/pds.css` `:root` (L1-40).
Tokens file: `src/styles/tokens.css`.

---

## Capa 1 · Primitivos

| Token | Valor | Uso | Ratio vs #FFF |
|-------|-------|-----|---------------|
| `--coral-400` | `#FF7A7E` | Coral claro (decorativo: bordes, gradients, tintes) | 2.52:1 ❌ |
| `--coral-500` | `#D63950` | Coral primario — **texto blanco sobre fondo** (btn, bubbles) | **4.63:1 ✅** |
| `--coral-600` | `#CC3347` | Coral oscuro — **hover/active, pressed** | **5.09:1 ✅** |
| `--coral-soft` | `#FFF1F1` | Tinte sutil coral (landing/auth) | — |
| `--accent-strong` | `#FF5A5F` | **ORIGINAL** — bordes, iconos, focus-ring, tintes decorativos | 3.05:1 ⚠️ |
| `--nequi` | `#7400c9` | Nequi brand purple |
| `--nequi-hover` | `#5e00a3` | Nequi hover |
| `--star-gold` | `#F5A623` | Rating star gold |
| `--gris-50` | `#FAFAFA` | Fondo page |
| `--gris-100` | `#F4F4F3` | Surface hover, pill bg, nav active |
| `--gris-200` | `#EAE9E8` | Border default, track bg |
| `--gris-300` | `#D6D5D2` | Input border, placeholder |
| `--gris-400` | `#A8A6A2` | Text terciario, icon inactive | ❌ solo >=18px bold / decorativo |
| `--gris-500` | `#807E7A` | Iconos decorativos, bordes suaves (NO texto pequeno) | 3.88:1 vs `--bg` ❌ |
| `--gris-550` | `#747270` | **Texto secundario/meta pequeno** (base de `--muted-soft`) | **4.79:1 ✅** (4.59:1 vs `--bg`) |
| `--gris-600` | `#5C5A57` | Text secundario, nav text |
| `--gris-700` | `#42403E` | Text important, form label |
| `--gris-800` | `#2C2B29` | Text strong, nav hover |
| `--gris-900` | `#1A1918` | Text primario, headings |
| `--ok` | `#2ECC71` | Estado: éxito/completado |
| `--err` | `#E74C3C` | Estado: error/cancelado |
| `--warn` | `#F39C12` | Estado: advertencia/pendiente |
| `--info` | `#3498DB` | Estado: información/en curso |

## Capa 2 · Semánticos

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `var(--gris-50)` | Fondo de página |
| `--surface` | `#FFFFFF` | Fondo de cards/paneles |
| `--surface-2` | `var(--gris-100)` | Fondo alternativo, secciones |
| `--fg` | `var(--gris-900)` | Texto primario |
| `--muted` | `var(--gris-600)` | Texto secundario/meta (WCAG AA: ~6.6:1) |
| `--muted-soft` | `var(--gris-550)` | Texto meta/decorativo — **AA en texto 11-14px** (ajuste 2026-09-17: antes `--gris-500` 3.88:1 ❌ → ahora 4.59:1 ✅ vs `--bg`, 4.79:1 ✅ vs `--surface`) |
| `--border` | `var(--gris-200)` | Bordes generales |
| `--accent` | `var(--coral-500)` | Color de acento (oscurecido, AA compliant) |
| `--accent-fg` | `#FFFFFF` | Texto sobre accent |
| `--accent-strong` | `#FF5A5F` | Coral original — uso decorativo sin texto blanco |

## Capa 3 · Estados semánticos + Tints

### Textos de estado (extraídos de color-mix en pds.css)

| Token | Valor | Uso |
|-------|-------|-----|
| `--ok-text` | `#1a7a44` | Texto pill.ok, d-status.done (ajuste 2026-09-17: antes `#1e8a4c` = 3.93:1 vs `--ok-bg` ❌ → ahora 4.82:1 ✅; 5.14:1 vs `--bg`) |
| `--err-text` | `#b33627` | Texto pill.err, disp-resolve.contra |
| `--warn-text` | `#8a5b08` | Texto pill.warn, miss-pill (WCAG AA: ~5.6:1) |
| `--info-text` | `#2470a3` | Texto pill.info, chamba-tag.curso |

> **Deuda conocida (no cerrable por tokens)**: `.ch-badge--coral` / `.ch-pill--coral`
> pintan `--coral-600` sobre `--coral-tint-14` = **4.15:1** (falta AA 12px).
> `--coral-600` es coral de marca ya ajustado (no se toca) y aclarecer el tint
> compartiría efecto con otros consumidores. Fix propuesto: token
> `--coral-on-tint: #B02A3E` (5.30:1 sobre tint-14) aplicado en Badge.css/Pill.css
> cuando el DS owner lo autorice.

### Fondos / Bordes de estado

| Token | Valor | Uso |
|-------|-------|-----|
| `--ok-bg` | `color-mix(…ok 14%, #fff)` | Pill ok, d-status.done |
| `--err-bg` | `color-mix(…err 14%, #fff)` | Pill err, form-error |
| `--warn-bg` | `color-mix(…warn 16%, #fff)` | Pill warn, miss-pill |
| `--info-bg` | `color-mix(…info 14%, #fff)` | Pill info, chamba-tag |
| `--ok-border` | `color-mix(…ok 30%, #fff)` | d-status.done border |
| `--err-border` | `color-mix(…err 30%, #fff)` | form-error border |
| `--warn-border` | `color-mix(…warn 32%, #fff)` | disp-resolve.parcial |
| `--info-border` | `color-mix(…info 28%, #fff)` | note-info border |

### Tints coral reutilizables

Tokens `--coral-tint-{6,7,8,10,12,14,22,28,30,35,40,45}`.
**Fórmula**: `color-mix(in srgb, var(--coral-500) <PCT>%, #fff)`.
El %45 usa `transparent` como mix-target (para rings/bio focus).

## Capa 4 · Componente (Chat)

| Token | Valor | Uso |
|-------|-------|-----|
| `--bubble-sent` | `var(--coral-500)` | Burbuja mensaje enviado |
| `--bubble-recv` | `var(--gris-100)` | Burbuja mensaje recibido |
| `--bubble-system` | `color-mix(…coral-500 6%, surface)` | Mensaje del sistema |

**Decisión**: `--bubble-sent` y `--bubble-system` no existían como tokens (hardcodeados). Se definieron aquí unificando los valores de `pds.css` y `components-viewer.html`. `--bubble-recv` ya existía en `components-viewer.html` y se portó tal cual.

## Capa 5 · Tipografía

| Token | Valor | Uso |
|-------|-------|-----|
| `--font` | `'Inter', …` | Familia tipográfica |
| `--fs-2xs` | `10.5px` | Tab labels, badges micro |
| `--fs-xs` | `11px` | Nav labels, doc-group-label |
| `--fs-sm` | `12px` | Meta chips, hints, form labels |
| `--fs-s` | `12.5px` | Stat label, bio |
| `--fs-base` | `13px` | Pills, nav-item |
| `--fs-m` | `13.5px` | Offer sub, review text |
| `--fs-md` | `14px` | Body secondary, input, btn |
| `--fs-l` | `14.5px` | Banner title, conv name |
| `--fs-xl` | `15px` | Body principal, offer title |
| `--fs-2xl` | `16px` | Section-title, modal h3 |
| `--fs-3xl` | `17px` | disp-head h3 |
| `--fs-4xl` | `18px` | role-card h3 |
| `--fs-5xl` | `20px` | biz hero name |
| `--fs-6xl` | `21px` | page-head mobile h1 |
| `--fs-7xl` | `22px` | pkg-price |
| `--fs-8xl` | `23px` | profile h1 |
| `--fs-9xl` | `24px` | page-head h1 |
| `--fs-hero` | `30px` | Hero stat number |

Pesos: `--fw-light` (300) … `--fw-black` (900).
Line-heights: `--lh-tight` (1.25), `--lh-body` (1.5), `--lh-relaxed` (1.55), `--lh-loose` (1.6).

## Capa 6 · Espaciado

Numérico: `--space-1`(4) … `--space-22`(64) — 22 pasos.
Aliases: `--space-xs`(4), `--space-sm`(8), `--space-md`(16), `--space-lg`(24), `--space-xl`(32), `--space-2xl`(48), `--space-3xl`(64).

## Capa 7 · Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-pill` | `999px` | Badges, chips, pills |
| `--radius-circle` | `50%` | Avatars, icon buttons |
| `--radius-xs` | `8px` | Mini surfaces (edit-ic) |
| `--radius-sm` | `10px` | Inputs, btns, skills |
| `--radius-md` | `12px` | Thumbnails, stat-card |
| `--radius` | `14px` | Cards, modals, offers |
| `--radius-lg` | `18px` | Bottom-sheet |
| `--radius-sheet` | `18px 18px 0 0` | Sheet corners |

## Capa 8 · Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow` | `0 1px 2px …04, 0 6px 20px …05` | Card default (pds.css) |
| `--shadow-hover` | `0 4px 18px rgba(…,.09)` | Hover cards |
| `--shadow-modal` | `0 24px 70px rgba(…,.34)` | Modal overlay |
| `--shadow-toast` | `0 14px 40px rgba(…,.4)` | Toast |
| `--shadow-sheet` | `0 -8px 30px rgba(…,.18)` | Bottom sheet |
| `--shadow-knob` | `0 1px 3px rgba(0,0,0,.2)` | Switch knob |
| `--focus-ring` | `0 0 0 2px accent-strong` | Focus visible (decorativo, usa coral original) |

## Capa 9 · Motion

| Token | Valor |
|-------|-------|
| `--ease` | `cubic-bezier(.2, .7, .2, 1)` |
| `--duration` | `.28s` |

## Capa 10 · Layout

| Token | Valor |
|-------|-------|
| `--sidebar-w` | `248px` |
| `--topbar-h` | `60px` |
| `--tabbar-h` | `64px` |

## Capa 11 · Z-index

| Token | Valor |
|-------|-------|
| `--z-topbar` | `30` |
| `--z-tabbar` | `40` |
| `--z-dropdown` | `50` |
| `--z-modal` | `80` |
| `--z-toast` | `90` |
| `--z-top` | `99999` |

## Capa 12 · Aliases de compatibilidad

| Token | Mapea a | Consumido por |
|-------|---------|---------------|
| `--font-chambe` | `--font` | ~51 refs TSX (solicitante) |
| `--radius-button` | `--radius-sm` | ~28 refs TSX |
| `--radius-card` | `--radius` | ~15 refs TSX |
| `--shadow-md` | `--shadow-hover` | Toast.tsx |

---

## Reglas de uso

1. **Primitivos** → solo en capas superiores (semánticos/componentes). Nunca en CSS de features.
2. **Semánticos** → en CSS de componentes y features. Nunca hardcoded.
3. **Componente** → solo donde aplica (burbujas de chat).
4. **Tints** → usar tokens `--*-bg`, `--*-border`, `--coral-tint-*` en vez de `color-mix()` inline.

## Fórmula de tints

```css
/* Patrón base — bg de estado */
--ok-bg: color-mix(in srgb, var(--ok) 14%, #fff);

/* Patrón base — borde de estado */
--ok-border: color-mix(in srgb, var(--ok) 30%, #fff);

/* Regla: para dark mode, cambiar #fff por var(--surface) */
```

Porcentajes típicos: 6-8% (hover sutil), 10-14% (pill/tag bg), 16-22% (borders), 28-45% (emphasis rings/borders).

## Breakpoints

| Rango | Contexto |
|-------|----------|
| `>= 1024px` | Desktop: sidebar visible |
| `<= 1023px` | Tablet: tabbar visible, sidebar oculto |
| `<= 860px` | Tablet estrecho: profile-grid 1col |
| `<= 560px` | Móvil: ajustes compactos |
| `<= 390px` | Móvil pequeño: oculta geo-pill |
| `<= 380px` | Móvil muy pequeño: cat-grid 2col |

## Tema oscuro

Override en `[data-theme="dark"]`. Solo cambia semánticos + gris-100/200. Coral, grises base y font se heredan.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `var(--gris-50)` | `#141312` |
| `--surface` | `#FFFFFF` | `#1F1E1C` |
| `--fg` | `var(--gris-900)` | `#FAFAFA` |
| `--muted` | `var(--gris-500)` | `#A8A6A2` |
| `--border` | `var(--gris-200)` | `#343230` |
| `--bubble-recv` | `var(--gris-100)` | `#2A2927` |

## Tokens DEPRECADOS / eliminados

| Token viejo | Razón | Reemplazo |
|-------------|-------|-----------|
| `--radius: 24px` | Mockup login, no pds.css | `--radius: 14px` |
| `--radius-sm: 14px` | Mockup login | `--radius-sm: 10px` |
| `--shadow: 0 24px 70px …` | Shadow grande de modal | `--shadow: 0 1px 2px …, 0 6px 20px …` |
| `--shadow-sm: 0 12px 28px …` | No usado en pds.css | `--shadow` (canonical) |
| `--shadow-lg: 0 35px 80px …` | No usado en pds.css | `--shadow-modal` |
| `--warn` | Faltaba de tokens.css | ✅ Agregado |
| `--info` | Faltaba de tokens.css | ✅ Agregado |
| `--color-*` (prefijo) | Nunca existió en CSS | Consumidores → `--coral-*`, `--gris-*`, `--ok`, `--err` |
