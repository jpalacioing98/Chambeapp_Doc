# Branding aplicado al panel administrativo

**Fecha:** 13 de noviembre de 2026
**Alcance:** todos los roles del panel (`verificador`, `soporte`, `admin`, `superadmin`)
**Proyecto:** `Chambeapp_admin_frontend`

## Qué se hizo

El panel usaba dos sistemas en paralelo: la capa `--ch-*` (heredada, ya alineada con la marca) y una
capa `--ds-*` introducida en el rediseño del SuperAdmin con una paleta **slate/azul** ajena al branding
(`#020617`, `#0F172A`, `#22C55E`…). Eso hacía que el SuperAdmin se viera como otro producto.

Ahora `--ds-*` **deriva de los primitivos de marca** de `tokens.css`, así que los cuatro roles comparten
exactamente la misma paleta y el modo oscuro es coherente.

## Mapeo aplicado

| Token del panel | Antes (slate) | Ahora (marca) |
|---|---|---|
| `--ds-bg` | `#F8FAFC` | `--gris-50` `#FAFAFA` |
| `--ds-surface` | `#FFFFFF` | `#FFFFFF` |
| `--ds-surface-2` | `#F1F5F9` | `--gris-100` `#F4F4F3` |
| `--ds-border` | `#E2E8F0` | `--gris-200` `#EAE9E8` |
| `--ds-fg` | `#0F172A` | `--gris-900` `#1A1918` |
| `--ds-muted` | `#64748B` | `--gris-600` `#5C5A57` |
| `--ds-accent` | verde `#22C55E` | **coral de marca** `--coral-500` `#D63950` |
| `--ds-focus` | azul `#2563EB` | coral de marca (regla de accesibilidad del branding) |
| Estados | tailwind (`#EF4444`, `#F59E0B`, `#3B82F6`) | `--ok`, `--err`, `--warn`, `--info` con sus variantes de texto AA |
| Tipografía | Fira Sans (solo SuperAdmin) | `--font` del panel (una sola familia para los cuatro roles) |

## Dirección visual: lineal minimalista

- **Superficies planas**: se eliminaron degradados decorativos (incluido el del login).
- **Bordes de 1 px** como separador principal; sombras reducidas a `0 1px 2px` salvo modales.
- **Radios cortos**: 4 / 6 / 8 / 12 px (antes hasta 16 px).
- **Coral solo donde significa algo**: acción principal, ítem activo, foco y enlaces. Los KPIs y los
  iconos de estado son neutros; el color semántico queda en los valores y badges.
- **Modo oscuro cálido**: derivado de `--gris-900` (`#131211`, `#1A1918`, `#232221`), no azulado.
- **Logo**: SVG **embebido** (`src/components/BrandLogo.jsx`) con el wordmark en `currentColor`; el badge
  conserva el degradado coral. Antes se cargaba como `<img>` y el tema oscuro pedía otro archivo: ese
  request extra era el único tráfico al cambiar de tema (y en servidores con reglas estrictas de estáticos
  devolvía error). Ahora cambiar de tema no genera ninguna petición.
- **El tema no vive en la barra superior**: se elige en **Perfil → Preferencias** (Claro / Oscuro / Sistema).
  La preferencia se aplica al instante, se guarda en el perfil (`tema`) y en `localStorage`; "Sistema"
  escucha `prefers-color-scheme` en vivo. La barra superior quedó con búsqueda, notificaciones y usuario,
  sin el chip de rol.
- **Foco del contenido**: `<main>` ya no dibuja un marco coral alrededor de toda la página al navegar.

## Verificación

| Comprobación | Resultado |
|---|---|
| `tsc --noEmit` | 0 errores |
| `npm run build` | OK · 118,47 KB gzip |
| `vitest run` | 79/79 |
| `playwright test` | 10 passed · 2 skipped · axe AA sin violaciones |
| Capturas | 8 (4 roles × claro/oscuro) revisadas a 1440 px |

## Cómo cambiarla en el futuro

- La fuente de verdad de la paleta es `src/styles/tokens.css` (primitivos de marca).
- `src/styles/ds-tokens.css` **solo mapea** esos primitivos a la API `--ds-*` y define el tema oscuro.
- No agregar hex nuevos en `features/**`: usar `--ds-*`. Si falta un token, se agrega aquí, no en la página.
