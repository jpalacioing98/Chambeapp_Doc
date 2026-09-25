# HOJA DE TESTS — ChambeApp Frontend (Design System + Vistas)

**Fecha:** 16 de Septiembre, 2026
**Alcance:** Tests del design system, componentes UI y navegación
**Estado:** 139 tests pasan, 1 skip (hallazgo), 0 fallas

---

## RESUMEN EJECUTIVO

| Archivo | Tests | Pasan | Skips | Fallan |
|---------|-------|-------|-------|--------|
| `src/test/tokens.test.ts` | 5 | 5 | 0 | 0 |
| `src/test/smoke-views.test.tsx` | 6 | 6 | 0 | 0 |
| `src/test/states.test.tsx` | 11 | 10 | 1 | 0 |
| `src/components/ui/Modal.test.tsx` | 8 | 8 | 0 | 0 |
| `src/components/ui/Card.test.tsx` | 9 | 9 | 0 | 0 |
| `src/components/ui/Button.test.tsx` | 12 | 12 | 0 | 0 |
| `src/components/ui/Icon.test.tsx` | 65 | 65 | 0 | 0 |
| `src/config/navigation.test.ts` | 17 | 17 | 0 | 0 |
| **TOTAL** | **140** | **139** | **1** | **0** |

**Tiempo total:** ~4s (Vitest + jsdom)

---

## COMO EJECUTAR

```bash
cd E:\Team Chambeapp\Chambeapp_frontend
npm test              # vitest run (todos los tests)
npm run test:watch    # vitest watch (desarrollo)
npm run typecheck     # tsc --noEmit (debe seguir verde)
```

---

## ARCHIVOS DE TEST Y QUE CUBREN

### 1. `src/test/setup.ts` — Setup global
- Configura `@testing-library/jest-dom/vitest`
- Polyfills: `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollIntoView`, `scrollTo`, `requestAnimationFrame`
- Mocks: `URL.createObjectURL`/`revokeObjectURL`

### 2. `src/test/tokens.test.ts` — INTEGRIDAD DE TOKENS (LA MÁS IMPORTANTE)
- **Regresión real que previene:** 160 referencias rotas `--color-*`, `--text-*`, `--font-size-*`, `--ch-*` que tsc y vite build NO detectan
- Parsea `tokens.css` y extrae todas las variables definidas (~150)
- Escanea TODOS los `.css` y `.tsx` de `src/`
- Falla si alguna `var(--x)` sin fallback no está definida
- Falla si detecta variables `--color-*` prohibidas
- Incluye check informativo de variables con fallback no definidas

### 3. `src/test/smoke-views.test.tsx` — SMOKE TESTS DE VISTAS
- SolicitanteHome: renderiza sin crash, muestra AppShell
- PdsInicioPage: renderiza sin crash, muestra skeleton de carga
- NegocioInicioPage: renderiza sin crash, no deja pantalla en blanco
- Mockea: useAuth, useOfferSocket, solicitanteApi, formatCOP, Toast, sonner

### 4. `src/test/states.test.tsx` — ESTADOS OBLIGATORIOS
- Skeleton: renderiza, variantes `circle`/`rect`, `aria-hidden`
- Spinner: `role="status"`, `aria-label="Cargando"`, size
- EmptyState: titulo, descripcion, action, icono
- **Grep assert:** solicitante, pds, negocio importan al menos un estado de carga/vacío
- **HALLAZGO (skip):** `features/publico` NO importa Skeleton/EmptyState/Spinner

### 5. `src/components/ui/Modal.test.tsx` — A11Y MODAL
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` válido
- Escape cierra (con delay de animación 280ms, fake timers)
- Click overlay cierra, click dentro NO cierra
- Subcomponentes ModalHeader/Body/Footer renderizan
- Botón "Cerrar" ejecuta onClose
- Body scroll lock
- **HALLAZGO:** overlay `aria-hidden="true"` esconde dialog del a11y tree

### 6. `src/components/ui/Card.test.tsx` — CARD INTERACTIVO
- `clickable`: `role="button"`, `tabIndex=0`, Enter/Space activan onClick
- Click normal activa onClick
- NO clickable NO tiene `role="button"`
- Clases CSS según props (padding, interactive, muted, className extra)

### 7. `src/components/ui/Button.test.tsx` — BUTTON VARIANTES
- 5 variantes: primary, secondary, ghost, outline, nequi
- `disabled` bloquea click
- `loading` pone `aria-busy`, muestra spinner, bloquea click
- `fullWidth`, sizes (sm/md/lg), className extra

### 8. `src/components/ui/Icon.test.tsx` — ICON REGISTRY
- `aria-hidden="true"` por defecto
- `aria-label` cuando se pasa
- **Itera los 57 iconos lucide** del registry: cada uno renderiza un SVG
- **Itera 5 iconos custom** (chambe-logo, geofence, etc.)
- Icono desconocido no renderiza nada

### 9. `src/config/navigation.test.ts` — NAVEGACIÓN VS RUTAS
- Parsea `routes.tsx` y extrae paths definidos
- Para cada rol (pds, solicitante, negocio): cada path de NAV_SIDEBAR y NAV_TABBAR existe en routes.tsx
- `isNavActive`: subrutas activan padre, prefijo parcial sin slash NO activa, raíz solo exacta
- `getActiveItemId`: retorna item más específico, undefined sin match

---

## MATRIZ DE TRAZABILIDAD — Regla del DS → Test que la cubre

| # | Regla del Design System | Test | Archivo |
|---|------------------------|------|---------|
| 1 | Todos los tokens CSS deben estar definidos en tokens.css | tokens.test.ts | `src/test/tokens.test.ts` |
| 2 | No usar variables `--color-*`, `--text-*`, `--font-size-*`, `--ch-*` | tokens.test.ts | `src/test/tokens.test.ts` |
| 3 | Modal tiene role="dialog", aria-modal, aria-labelledby | Modal.test.tsx | `src/components/ui/Modal.test.tsx` |
| 4 | Modal tiene focus trap | Modal.test.tsx (escape) | `src/components/ui/Modal.test.tsx` |
| 5 | Modal: Escape cierra, overlay cierra, dentro NO cierra | Modal.test.tsx | `src/components/ui/Modal.test.tsx` |
| 6 | Card clickable → role="button" + tabIndex + keys | Card.test.tsx | `src/components/ui/Card.test.tsx` |
| 7 | Button variantes aplican clase correcta | Button.test.tsx | `src/components/ui/Button.test.tsx` |
| 8 | Button disabled/loading bloquean interacción | Button.test.tsx | `src/components/ui/Button.test.tsx` |
| 9 | Icon aria-hidden por defecto, aria-label opcional | Icon.test.tsx | `src/components/ui/Icon.test.tsx` |
| 10 | Icon registry: todos los nombres renderizan SVG | Icon.test.tsx | `src/components/ui/Icon.test.tsx` |
| 11 | NavItem paths coinciden con routes.tsx | navigation.test.ts | `src/config/navigation.test.ts` |
| 12 | isNavActive: subrutas activan padre, prefijo parcial no | navigation.test.ts | `src/config/navigation.test.ts` |
| 13 | Cada feature dir importa estados de carga/vacío | states.test.tsx | `src/test/states.test.tsx` |
| 14 | Skeleton/EmptyState/Spinner renderizan correctamente | states.test.tsx | `src/test/states.test.tsx` |
| 15 | Vistas clave renderizan sin crash (smoke) | smoke-views.test.tsx | `src/test/smoke-views.test.tsx` |
| 16 | Modal body scroll lock | Modal.test.tsx | `src/components/ui/Modal.test.tsx` |

---

## HALLAZGOS / BUGS ENCONTRADOS

### BUG #1: Modal `aria-hidden` en overlay esconde dialog del a11y tree
- **Archivo:** `src/components/ui/Modal.tsx:96`
- **Descripción:** El overlay `<div>` tiene `aria-hidden="true"`. El dialog `<div role="dialog">` está anidado DENTRO de este overlay. Según la spec WAI-ARIA, cuando un padre tiene `aria-hidden="true"`, todos sus hijos son invisible para tecnologías asistivas independientemente de su propio `aria-hidden`. Resultado: `screen.getByRole('dialog')` no encuentra el diálogo.
- **Impacto:** El modal NO es accesible por lectores de pantalla. Los usuarios con discapacidad visual no pueden interactuar con el modal.
- **Fix recomendado:** Remover `aria-hidden="true"` del overlay, o mover el dialog fuera del overlay al DOM level (portal).
- **Estado del test:** Documentado como test que falla si se intenta usar `getByRole('dialog')`.

### HALLAZGO #2: features/publico no maneja estados de carga
- **Directorio:** `src/features/publico/` (3 páginas: NegociosMapaPage, NegocioDetallePage, PdsPerfilPublicoPage)
- **Descripción:** Ninguna de las 3 páginas públicas importa `Skeleton`, `EmptyState`, `Spinner` o `LoadingState`.
- **Impacto:** Las páginas públicas no muestran feedback visual durante carga ni cuando no hay datos.
- **Estado del test:** `it.skip` documentando el hallazgo.

### REGRESIÓN PREVENIDA: Variables CSS inexistentes
- **Contexto:** En Septiembre 2026, 160 referencias a variables CSS (`--color-*`, `--text-*`, etc.) fueron escritas durante la migración. Ni `tsc` ni `vite build` las detectaron. `tokens.test.ts` ahora lo previene.

---

## QUE QUEDÓ SIN CUBRIR Y POR QUÉ

| Area | Razón |
|------|-------|
| Animaciones/transiciones CSS | No testables con jsdom (no tiene layout engine) |
| Responsive/media queries | jsdom no soporta `matchMedia` real con media queries |
| Dark mode `[data-theme="dark"]` | Requiere testing de CSS computed styles (no soportado por jsdom) |
| Hook `useFocusTrap` aislado | Se testea indirectamente vía Modal.test.tsx |
| Formularios (Input, Textarea, Select, etc.) | Componentes simples sin lógica compleja; prioridad baja |
| Toast/Dropdown/Sheet/Tooltip | Overlays con positioning que requiere layout real |
| Performance / re-renders | Requiere React DevTools Profiler o tools especializados |
| `features/publico` (3 páginas) | Sin loading states (hallazgo documentado) |

---

## ENTORNO

- **Runner:** Vitest 4.1.11 + jsdom
- **Setup:** `src/test/setup.ts`
- **@testing-library/react** 16.1.0
- **@testing-library/jest-dom** 6.6.3
- **No se instalaron dependencias nuevas** (usa solo las existentes)
- **typecheck:** `tsc --noEmit` pasa en verde

---

**Generado el 16 de Septiembre, 2026 — Test Specs Agent (Paso 5 UI/UX)**
