# 05 — Registry de Iconos

> Paso 2 del flujo UI/UX · Reemplazo de ~301 SVGs inline por componente `<Icon />`

---

## Estrategia

1. **Primero: `lucide-react`** — si lucide tiene el icono exacto, se usa directamente.
2. **Segundo: Custom registry** — iconos sin equivalente en lucide se definen como paths SVG en un objeto `ICON_PATHS`.
3. **Componente `Icon`** — resuelve por nombre, acepta `size` y `color` (default: `currentColor`).

### Componente Icon

```tsx
// src/components/ui/Icon.tsx
import { LucideIcon } from 'lucide-react';
import { ICON_PATHS } from './icon-paths';

// Iconos de lucide-react (importados directamente)
import {
  Home, Search, Briefcase, Wallet, MessageCircle, Bell, User,
  ChevronLeft, ChevronRight, ChevronDown, Plus, Check, X, Star,
  MapPin, Filter, Clock, Image, Shield, Flag, Coins, ArrowRight,
  Upload, Trash, Edit, Send, Paperclip, Phone, Info, Menu,
  CreditCard, Globe, Navigation, Eye, Calendar, FileText,
  AlertTriangle, CircleDot, CheckCircle, XCircle, LogOut,
  Settings, Heart, Award, Zap, Users, Building, Map,
  Camera, Lock, Unlock, Download, ExternalLink, MoreHorizontal,
  ChevronUp, Minus, Hash, AtSign, Mail
} from 'lucide-react';
```

### Registry de iconos custom (no disponibles en lucide)

```typescript
// src/components/ui/icon-paths.ts
export const ICON_PATHS: Record<string, string[]> = {
  // Ya cubierto por lucide-react:
  // home, search, briefcase, wallet, message-circle, bell, user,
  // chevron-left/right/down, plus, check, x, star, map-pin, filter,
  // clock, image, shield, flag, coins, arrow-right, upload, trash, edit

  // Custom: iconos específicos de ChambeApp que no existen en lucide
  'chambe-logo': ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  'geofence': ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2', 'M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10', 'M12 8a4 4 0 100 8 4 4 0 000-8z'],
  'handshake': ['M7 11l4.09-4.09a2 2 0 012.82 0L17 11', 'M17 11l-4.09 4.09a2 2 0 01-2.82 0L7 11'],
  'micrositio': ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
};
```

---

## Registry completo de iconos

### Iconos de navegación (sidebar + tabbar)

| Nombre canónico | lucide-react | SVG paths origen | Archivos donde se repite | Uso |
|----------------|--------------|------------------|--------------------------|-----|
| `home` | ✅ `Home` | pds-inicio sidebar: `<path d="M3 11l9-8 9 8M5 10v10h14V10"/>` | 28 archivos (sidebar) + 28 (tabbar) | Inicio |
| `search` | ✅ `Search` | `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>` | 28+28 | Buscar chamba |
| `briefcase` | ✅ `Briefcase` | `<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2"/>` | 28+28 | Chambas/Mis ofertas |
| `wallet` | ✅ `Wallet` | `<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12h3"/>` | 28+28 | Billetera |
| `message-circle` | ✅ `MessageCircle` | `<path d="M21 12a8 8 0 01-11 7L4 21l2-6A8 8 0 1121 12z"/>` | 28+28 | Mensajes |
| `bell` | ✅ `Bell` | `<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.5 21a2 2 0 01-3 0"/>` | 28+28 | Notificaciones |
| `user` | ✅ `User` | `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>` | 28+28 | Perfil / KYC |
| `flag` | ✅ `Flag` | `<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>` | 28+28 | Disputas |
| `store` | ✅ `Building` | *(merchant-inicio sidebar)* | 9 merchant files | Mi Negocio |
| `grid` | ✅ `LayoutGrid` | *(merchant-inicio "Inicio" uses 4-squares icon)* | 9 merchant files | Inicio merchant |
| `document` | ✅ `FileText` | `<path d="M6 3h9l5 5v13H6z"/><path d="M14 3v6h6"/>` | 28+28 | Contratos |

### Iconos de UI

| Nombre canónico | lucide-react | SVG paths origen | Archivos donde se repite | Uso |
|----------------|--------------|------------------|--------------------------|-----|
| `chevron-left` | ✅ `ChevronLeft` | `<path d="M15 18l-6-6 6-6"/>` | 15+ | Back navigation |
| `chevron-right` | ✅ `ChevronRight` | `<path d="M9 18l6-6-6-6"/>` | 10+ | Forward/expand |
| `chevron-down` | ✅ `ChevronDown` | `<path d="m6 9 6 6 6-6"/>` | 10+ | Dropdown toggle |
| `chevron-up` | ✅ `ChevronUp` | *(used in collapses)* | 5+ | Collapse toggle |
| `plus` | ✅ `Plus` | `<path d="M12 5v14M5 12h14"/>` | 10+ | Add/Create |
| `check` | ✅ `Check` | `<path d="m5 12 5 5L20 7"/>` | 20+ | Success/Confirm |
| `x` | ✅ `X` | `<path d="M6 6l12 12M18 6 6 18"/>` | 15+ | Close/Cancel |
| `star` | ✅ `Star` | *(used in ratings)* | 8+ | Rating star |
| `map-pin` | ✅ `MapPin` | *(used in map views)* | 5+ | Location |
| `filter` | ✅ `Filter` | `<path d="M3 6h18M6 12h12M10 18h4"/>` | 8+ | Filter |
| `clock` | ✅ `Clock` | *(used in urgency chips)* | 6+ | Time/Urgency |
| `image` | ✅ `Image` | *(used in galleries)* | 5+ | Image |
| `shield` | ✅ `Shield` | *(used in KYC/verification)* | 6+ | Security/verified |
| `coins` | ✅ `Coins` | *(used in wallet)* | 3+ | Coins |
| `arrow-right` | ✅ `ArrowRight` | *(used in links)* | 8+ | Navigate forward |
| `upload` | ✅ `Upload` | *(used in file upload)* | 4+ | Upload |
| `trash` | ✅ `Trash2` | *(used in delete)* | 4+ | Delete |
| `edit` | ✅ `Pencil` | *(used in edit links)* | 5+ | Edit |
| `send` | ✅ `Send` | `<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>` | 5+ | Send message |
| `paperclip` | ✅ `Paperclip` | *(used in chat attach)* | 3+ | Attach file |
| `phone` | ✅ `Phone` | *(used in chat header)* | 3+ | Call |
| `info` | ✅ `Info` | *(used in info notes)* | 5+ | Information |
| `menu` | ✅ `Menu` | *(used in mobile nav)* | 3+ | Hamburger |
| `credit-card` | ✅ `CreditCard` | *(used in payments)* | 3+ | Payment method |
| `globe` | ✅ `Globe` | *(used in web links)* | 2+ | Website |
| `navigation` | ✅ `Navigation` | *(used in geo)* | 3+ | GPS/Location |
| `eye` | ✅ `Eye` | *(used in "Ver público")* | 3+ | View |
| `calendar` | ✅ `Calendar` | *(used in dates)* | 4+ | Date |
| `file-text` | ✅ `FileText` | *(used in documents)* | 3+ | Document |
| `alert-triangle` | ✅ `AlertTriangle` | *(used in warnings)* | 3+ | Warning |
| `check-circle` | ✅ `CheckCircle` | *(used in success)* | 3+ | Verified |
| `x-circle` | ✅ `XCircle` | *(used in errors)* | 2+ | Error |
| `log-out` | ✅ `LogOut` | *(used in logout)* | 3+ | Logout |
| `settings` | ✅ `Settings` | *(used in config)* | 2+ | Settings |
| `heart` | ✅ `Heart` | *(used in EPS/ARL)* | 2+ | Health |
| `award` | ✅ `Award` | *(used in badges)* | 2+ | Badge/Award |
| `zap` | ✅ `Zap` | *(used in urgency)* | 2+ | Lightning/Urgent |
| `users` | ✅ `Users` | *(used in team/group)* | 2+ | Group |
| `building` | ✅ `Building` | *(used in business)* | 3+ | Business |
| `map` | ✅ `Map` | *(used in map views)* | 2+ | Map |
| `camera` | ✅ `Camera` | *(used in selfie)* | 2+ | Camera |
| `lock` | ✅ `Lock` | *(used in password)* | 2+ | Locked |
| `download` | ✅ `Download` | *(used in download)* | 2+ | Download |
| `external-link` | ✅ `ExternalLink` | *(used in links)* | 2+ | External |
| `more-horizontal` | ✅ `MoreHorizontal` | *(used in menus)* | 2+ | More |
| `minus` | ✅ `Minus` | *(used in remove)* | 2+ | Remove |
| `mail` | ✅ `Mail` | *(used in email)* | 2+ | Email |
| `circle-dot` | ✅ `CircleDot` | *(used in radio selects)* | 2+ | Radio active |
| `navigation` | ✅ `Navigation` | *(used in GPS)* | 2+ | Location |

### Iconos custom (NO en lucide)

| Nombre canónico | Archivos origen | SVG original | Uso |
|----------------|-----------------|--------------|-----|
| `chambe-logo` | 28 sidebar files | `<div class="mark">Ch</div>` (no SVG, es un div con texto) | Brand mark |
| `geofence` | pds-buscar | Circle with dashed border | Radio de búsqueda |
| `micrositio` | pds-micrositio | House with window | Micro-sitio PDS |
| `handshake` | sol-contratos | Two hands | Acuerdo/Contrato |

---

## Impacto de migración

| Métrica | Valor |
|---------|-------|
| **SVGs inline eliminados** | ~301 |
| **Archivos HTML afectados** | 46 |
| **KB de JSX eliminado** | ~15 KB (SVGs inline promedio ~50 bytes × 301) |
| **Componente resultante** | 1 (`Icon.tsx`) + 1 registry (`icon-paths.ts`) |
| **Dependencia** | `lucide-react` (ya instalada en `package.json`) |

### Regla de uso
```tsx
// En componentes del design system:
import { Icon } from '../ui/Icon';

<Icon name="home" size={20} />
<Icon name="search" size={18} color="var(--muted)" />

// En feature pages (acceso directo a lucide cuando es más legible):
import { Home, Search } from 'lucide-react';
<Home size={20} />
```
