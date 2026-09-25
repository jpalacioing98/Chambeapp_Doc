# 03 — Reglas del Sistema de Diseño

> Paso 2 del flujo UI/UX · Reglas duras y verificables para la migración React

---

## 1. Cuándo crear un componente vs escribir markup

### Regla de duplicación (P0)
> **Si un bloque HTML aparece en 2+ archivos → ES componente.**

Excepciones:
- Un `<div class="row between">` aislado en 1 archivo → markup inline
- Un layout específico de 1 pantalla (pds-buscar `.search-layout`) → componente domain-specific solo si se reutiliza en 2+ variantes

### Checklist de decisión
```
¿Se repite en 2+ archivos?          → Componente
¿Tiene estados propios?              → Componente
¿Se necesita testear aislado?        → Componente
¿Tiene lógica de interacción?        → Componente (con hook)
¿Es solo layout estático de 1 pantalla? → Markup inline
```

---

## 2. Capas de tokens

Basado en `01-tokens.md` (12 capas):

| Capa | Ejemplo | Cuándo usar |
|------|---------|-------------|
| **Primitivos** (1) | `--coral-500`, `--gris-100` | SOLO dentro de semánticos o componentes. NUNCA en markup directo. |
| **Semánticos** (2) | `--bg`, `--surface`, `--fg`, `--muted`, `--border`, `--accent` | En CSS de componentes para colores base. |
| **Estados** (3) | `--ok-text`, `--err-bg`, `--info-border` | En componentes de estado (badges, pills, forms). |
| **Componente** (4) | `--bubble-sent`, `--bubble-recv` | Solo cuando un token es exclusivo de 1 componente. |
| **Tipografía** (5) | `--fs-sm`, `--fw-bold`, `--lh-body` | En CSS de componentes. |
| **Espaciado** (6) | `--space-3`, `--space-md` | En CSS de componentes. |
| **Radios** (7) | `--radius`, `--radius-pill` | En CSS de componentes. |
| **Sombras** (8) | `--shadow`, `--shadow-modal` | En CSS de componentes. |
| **Motion** (9) | `--ease`, `--duration` | En transiciones de componentes. |
| **Layout** (10) | `--sidebar-w`, `--topbar-h`, `--tabbar-h` | En AppShell, Sidebar, Topbar, TabBar. |
| **Z-index** (11) | `--z-modal`, `--z-toast` | En componentes posicionados. |
| **Aliases** (12) | `--font-chambe`, `--radius-button` | SOLO para migración. Eliminar al completar. |

### Regla estricta de tokens
```css
/* BIEN — usa semántico */
.btn-primary { background: var(--accent); color: var(--accent-fg); }

/* MAL — usa primitivo directo en componente */
.btn-primary { background: var(--coral-500); color: #fff; }

/* EXCEPCIÓN — primitivo permitido en STATES */
.pill.ok { background: var(--ok-bg); color: var(--ok-text); border-color: var(--ok-border); }
```

---

## 3. Convenciones de nombre

### Archivos
```
src/components/ui/Button.tsx          → PascalCase .tsx
src/components/ui/Button.css          → PascalCase .css (co-locado)
src/components/layout/AppShell.tsx
src/components/domain/ChambaCard.tsx
src/features/solicitante/SolicitudesListPage.tsx  → feature pages
src/config/navigation.ts              → configuración
src/hooks/useAuth.ts                  → camelCase con prefijo "use"
src/styles/tokens.css                 → kebab-case para CSS global
```

### Clases CSS — BEM adaptado
```css
/* Bloque */
.ch-btn { }

/* Elemento (doble guión bajo) */
.ch-btn__icon { }

/* Modificador (doble guión) */
.ch-btn--primary { }
.ch-btn--loading { }
.ch-btn--full-width { }

/* Estados (con data-attribute) */
.ch-btn[disabled] { }
.ch-btn[data-loading] { }

/* Alternativa sin prefijo ch- (aceptable si no hay colisión) */
.btn { }
.btn--primary { }
.btn__icon { }
```

### Prefijo `ch-` (recomendado)
El prefijo `ch-` (ChambeApp) evita colisiones con librerías externas. Se aplica a todos los componentes del design system.

```css
/* Componentes ui/ */
.ch-btn, .ch-input, .ch-avatar, .ch-pill, .ch-modal, .ch-toast

/* Componentes layout/ */
.ch-sidebar, .ch-topbar, .ch-tabbar, .ch-app-shell

/* Componentes domain/ */
.ch-job-card, .ch-offer-card, .ch-chat-shell, .ch-kyc-doc
```

### Props y variantes
```tsx
// Variantes como union types, NO string generic
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;    // default: 'primary'
  size?: ButtonSize;          // default: 'md'
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

---

## 4. Estados obligatorios por componente

### Tabla de estados

| Estado | Aplica a | Implementación |
|--------|----------|----------------|
| **default** | Todos | Estado base |
| **hover** | Buttons, Cards, NavItems, Chips, Links | CSS `:hover` |
| **active** | Buttons, NavItems, Tabs | CSS `:active` + `transform: scale(.96)` |
| **focus-visible** | Todos los interactivos | CSS `:focus-visible` con `box-shadow: var(--focus-ring)` |
| **disabled** | Buttons, Inputs, Checkboxes | Atributo `disabled` + `[disabled]` CSS |
| **loading** | Buttons, Pages | Prop `loading` → spinner inline + `aria-busy="true"` |
| **error** | Inputs, Forms, Fields | Prop `error` → borde rojo + mensaje `role="alert"` |
| **empty** | Lists, Chat | `EmptyState` component con icon + title + CTA |
| **selected** | Cards, NavItems, Tabs | Clase `.active` o `aria-selected="true"` |

### Regla de accesibilidad

```tsx
// 1. focus-visible SIEMPRE en interactivos
.ch-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);  // 0 0 0 2px var(--coral-500)
}

// 2. Modales: aria-modal + focus trap
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

// 3. Toasts: aria-live
<div aria-live="polite" role="status">

// 4. Tabs: role="tablist" + role="tab" + role="tabpanel"
<nav role="tablist">
  <button role="tab" aria-selected={active}>Tab 1</button>
</nav>
<div role="tabpanel">

// 5. Contraste: mínimo WCAG AA (4.5:1 texto, 3:1 UI)
// --muted (#807E7A) sobre --surface (#FFFFFF) = 4.03:1 → NO usar para texto largo
// --gris-700 (#42403E) sobre --surface (#FFFFFF) = 8.54:1 → OK
// --coral-600 (#E04E53) sobre --surface (#FFFFFF) = 4.56:1 → OK para texto
```

---

## 5. Responsive

### Breakpoints reales (de HTML)
```css
/* Desktop: sidebar visible */
@media (min-width: 1024px) { .ch-sidebar { display: block; } }

/* Tablet: solo tabbar */
@media (max-width: 1023px) { .ch-tabbar { display: flex; } }

/* Mobile: compacto */
@media (max-width: 560px) { /* adjustments */ }
```

| Breakpoint | Rango | Comportamiento |
|------------|-------|----------------|
| **Desktop** | ≥1024px | Sidebar visible, tabbar hidden, 2-4 column grid |
| **Tablet** | ≤1023px | Sidebar hidden (drawer), tabbar visible, 2 column grid |
| **Mobile** | ≤560px | Tabbar visible, 1 column grid, textos compactos |
| **Tiny** | ≤390px | Ajustes mínimos (padding, font-size) |

### Regla de área táctil
> Todo elemento clickeable debe tener mínimo **44×44px** de área táctil.

```css
/* Ejemplo: icon-btn en topbar */
.ch-icon-btn {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

## 6. Motion

### Tokens de motion (de `tokens.css`)
```css
--ease: cubic-bezier(.2, .7, .2, 1);  /* ease suave, salida natural */
--duration: .28s;                       /* duración estándar */
```

### Reglas
```css
/* Transiciones estándar */
.ch-btn { transition: background var(--duration) var(--ease), transform .12s var(--ease); }
.ch-card { transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease); }

/* Transiciones rápidas (micro-interacciones) */
.ch-btn:active { transform: scale(.96); transition: transform .12s var(--ease); }

/*(prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    transition-duration: .001ms !important;
    scroll-beachavior: auto !important;
  }
}
```

### Duraciones
| Tipo | Duración | Uso |
|------|----------|-----|
| Micro | .12s | Button press, scale |
| Standard | .28s | Hover states, color changes |
| Slow | .4s | Modal enter/exit, page transitions |
| Page | .6s | Skeleton shimmer cycle |

---

## 7. Contenido y tono

### Idioma
> **Español-Colombia (es-CO)** en toda la UI.

### Formato de moneda
```typescript
// SIEMPRE usar esta función
function formatCOP(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

// Ejemplo: formatCOP(80000) → "$80.000"
// Ejemplo: formatCOP(1240000) → "$1.240.000"
// Nunca: "$80,000" (formato US)
// Nunca: "$80.000,00" (decimales innecesarios para COP)
```

### Textos de referencia (de HTML)
- Saludo: "Buenos días, {nombre}" / "Buenas tardes, {nombre}"
- Subtítulo: "Tienes X chambas recomendadas cerca de ti y X mensaje(s) sin leer."
- Empty state: "No hay {noun} disponibles" + "Sé el primero en publicar {noun}"
- CTAs: "Publicar chamba" / "Ver" / "Postular" / "Enviar" / "Guardar" / "Cancelar"
- Errores: "Marca la confirmación para enviar" / "Escribe un mensaje para el contratante"
- KYC: "Faltan X documentos obligatorios para acceder a las chambas"
- Moneda: "$80k" (abreviado en cards) / "$80.000" (completo en detail)

---

## 8. Reglas de JS/TS

### Prohibiciones absolutas
```typescript
// ❌ PROHIBIDO
let data: any = {};                    // any
<div style={{ color: 'red' }}>         // inline style (salvo valores dinámicos)
<button onclick="handleClick()">       // onclick inline
document.querySelector('.btn')         // DOM manipulation directa en React
```

### Permitido
```typescript
// ✅ Valores dinámicos en inline style
<div style={{ width: `${progress}%` }}>     // progreso
<div style={{ background: `linear-gradient(...)` }}>  // gradientes de avatar

// ✅ Eventos con handlers React
<button onClick={handleClick}>

// ✅ Referencias DOM con ref
const inputRef = useRef<HTMLInputElement>(null);
```

### Regla de estilos inline
> Solo se permite `style={}` para valores que **cambian en runtime** y no se pueden expresar con CSS puro:
> - Porcentaje de progreso (`width: ${pct}%`)
> - Gradientes dinámicos de avatar
> - Posiciones absolutas de pins en mapa

---

## 9. Checklist de PR de UI

Cada PR que modifique componentes debe verificar:

```
[ ] Tokens: ¿Se usan tokens de tokens.css? (no colores hardcodeados)
[ ] Estados: ¿Tiene hover, active, focus-visible, disabled?
[ ] Accesibilidad: ¿focus-visible visible? ¿aria-labels? ¿role correcto?
[ ] Responsive: ¿Funciona en 3 breakpoints? (1024, 1023, 560)
[ ] Touch: ¿Área táctil mínima 44×44px?
[ ] Motion: ¿Transiciones con --duration/--ease? ¿prefers-reduced-motion?
[ ] Loading: ¿Tiene estado loading/skeleton si carga datos?
[ ] Empty: ¿Tiene empty state si la lista puede estar vacía?
[ ] Error: ¿Tiene estado error si la operación puede fallar?
[ ] Contenido: ¿Textos en es-CO? ¿Moneda con formatCOP?
[ ] TypeScript: ¿Sin `any`? ¿Props tipadas? ¿Sin estilos inline innecesarios?
[ ] CSS: ¿Clase con prefijo `ch-`? ¿Co-locado con el componente?
[ ] Naming: ¿PascalCase .tsx? ¿camelCase hooks? ¿kebab-case CSS?
[ ] Barrel: ¿Exportado en `index.ts` del directorio?
[ ] Duplicación: ¿Se reutiliza componente existente? ¿No se crea duplicado?
```

---

## 10. Reglas de SVG / Iconos

> Ver `05-iconos.md` para el registry completo.

### Regla
```tsx
// ❌ PROHIBIDO — SVG inline repetido
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <path d="M3 11l9-8 9 8M5 10v10h14V10"/>
</svg>

// ✅ CORRECTO — usando Icon registry
<Icon name="home" size={20} />

// ✅ CORRECTO — usando lucide-react cuando existe
import { Home } from 'lucide-react';
<Home size={20} />
```

### Regla de selección
1. Si `lucide-react` tiene el icono → usar lucide-react
2. Si no → definir en `Icon` registry con SVG paths
3. Nunca SVG inline en JSX
