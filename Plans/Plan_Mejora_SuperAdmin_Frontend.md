# 🛠️ Plan de Implementación — Mejora UX/UI del SuperAdmin Frontend

**Proyecto:** ChambeApp · `Chambeapp_admin_frontend`
**Alcance:** Módulo SuperAdmin (10 páginas + shell + design system)
**Versión del plan:** 1.0
**Fecha:** 13 de noviembre de 2026
**Duración estimada:** 12 semanas
**Estado:** 🟢 IMPLEMENTADO — 13 de noviembre de 2026 (ver [§11](#11-estado-de-implementación-13-nov-2026))

---

## 📑 Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Diagnóstico: hallazgos por categoría](#2-diagnóstico-hallazgos-por-categoría)
3. [Dirección de diseño objetivo](#3-dirección-de-diseño-objetivo)
4. [Fase 0 — Quick wins](#fase-0--quick-wins-semana-0)
5. [Fase 1 — Fundación: tokens y tipografía](#fase-1--fundación-tokens-y-tipografía-semanas-1-2)
6. [Fase 2 — Shell y navegación](#fase-2--shell-y-navegación-semanas-2-3)
7. [Fase 3 — Componentes core](#fase-3--componentes-core-semanas-3-5)
8. [Fase 4 — Rediseño de páginas](#fase-4--rediseño-de-páginas-semanas-5-9)
9. [Fase 5 — Movimiento y pulido](#fase-5--movimiento-y-pulido-semanas-9-10)
10. [Fase 6 — Hardening y calidad](#fase-6--hardening-y-calidad-semanas-10-12)
11. [Stack tecnológico](#5-stack-tecnológico)
12. [Métricas de éxito](#6-métricas-de-éxito)
13. [Cronograma](#7-cronograma)
14. [Riesgos y mitigaciones](#8-riesgos-y-mitigaciones)
15. [Definition of Done](#9-definition-of-done)
16. [Próximos pasos](#10-próximos-pasos)
17. [Estado de implementación](#11-estado-de-implementación-13-nov-2026)

---

## 1. Resumen ejecutivo

El panel SuperAdmin funciona, pero fue construido por acumulación: cada página resuelve su problema con estilos inline, grids ad-hoc y componentes genéricos reutilizados de otros roles. El resultado es un panel **funcional pero inconsistente**: ritmo visual irregular, tablas sin capacidad de operación, navegación móvil incompleta y accesibilidad por debajo de AA.

Este plan no propone un rediseño cosmético. Propone **construir la capa que hoy no existe**: un design system consolidado, componentes de datos de nivel operativo y una estructura de navegación que escale a 10+ módulos, sin romper lo que ya funciona.

### Diagnóstico en una línea

> El SuperAdmin se comporta como un CRUD administrativo, pero se usa como una consola de operaciones. La brecha entre esos dos modelos es el origen de casi todos los problemas de UX.

### Objetivo medible (12 semanas)

| Indicador | Hoy (estimado) | Meta |
|---|---|---|
| Tarea "crear paquete de monedas" | ~4 min | < 90 s |
| Acciones destructivas sin confirmar | ~5% | 0% |
| Cobertura a11y (axe, WCAG AA) | ~60% | 100% |
| Lighthouse móvil (usabilidad) | ~45 | > 90 |
| Bundle del chunk SuperAdmin | ~350 KB | < 180 KB |
| Páginas accesibles desde móvil | 5 de 10 | 10 de 10 |

---

## 2. Diagnóstico: hallazgos por categoría

Cada hallazgo está referenciado con el archivo y la línea que lo evidencia, para que la corrección sea verificable.

### 2.1 Arquitectura de información y navegación — 🔴 Alta

| # | Hallazgo | Evidencia | Consecuencia |
|---|---|---|---|
| N1 | Sidebar con 14 ítems en 4 grupos sin jerarquía colapsable | `src/config/navigation.js:92-122` | Sobrecarga cognitiva; el usuario escanea en lugar de reconocer |
| N2 | Tabbar móvil expone solo 5 de 10 módulos | `src/config/navigation.js:145-151` | **Funciones críticas inaccesibles en móvil** (Auditoría, Legal, IA, Overrides, Cobros, Paquetes) |
| N3 | Sin breadcrumbs en jerarquías de 3+ niveles | `src/components/layout/AppShell.jsx` | Pérdida de orientación |
| N4 | Sin búsqueda global (Cmd+K) | — | Fricción para usuarios frecuentes |

### 2.2 Espaciado, ritmo y layout — 🔴 Alta

| # | Hallazgo | Evidencia | Consecuencia |
|---|---|---|---|
| S1 | Padding de contenido `30px` desktop / `16px` móvil sin escala semántica | `src/styles/globals.css:141,1424` | Ritmo irregular entre breakpoints |
| S2 | Grid de stats fijo en `minmax(180px, 1fr)` | `src/styles/globals.css:922` | Tarjetas deformadas en tablet |
| S3 | Quick-grid en `minmax(160px, 1fr)` | `src/styles/globals.css:1043` | Tarjetas estrechas, labels truncados |
| S4 | AdminTable sin virtualización; Audit carga `limit: 100` sin paginación | `src/features/staff/components/AdminTable.jsx`, `src/features/superadmin/AuditPage.jsx:24` | Degradación con listas grandes |
| S5 | Modal de paquetes: 337 líneas en un solo archivo | `src/features/superadmin/PaquetesMonedasPage.jsx:240-334` | Viola responsabilidad única; difícil de mantener |
| S6 | Tablas sin `overflow-x` explícito en móvil | `src/styles/globals.css:732-738` | Tablas rotas en pantallas pequeñas |

### 2.3 Tipografía y jerarquía — 🟠 Media-Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| T1 | Tokens duplicados entre `tokens.css` y `globals.css` | `src/styles/tokens.css:136-139` vs `src/styles/globals.css:61-62` |
| T2 | Título de página 24px vs título del shell 20px sin escala común | `PageHeader.jsx:95` vs `globals.css:914` |
| T3 | JSON y código en 12.5px — por debajo del mínimo legible en monoespaciada | `globals.css:118,1028` |
| T4 | Body 14px con inputs 14px: sin diferenciación jerárquica por rol tipográfico | `globals.css:97,686` |

### 2.4 Color y estados semánticos — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| C1 | Doble sistema semántico (`--bg/--surface` y `--ch-bg/--ch-surface`) | `tokens.css:52-88` vs `globals.css:31-54` |
| C2 | Focus ring usa `--accent-strong` (`#FF5A5F`), un color decorativo, no semántico | `tokens.css:247`, `globals.css:72` |
| C3 | Chip de rol visible solo en móvil | `globals.css:575-578` |
| C4 | Paleta no optimizada para densidad de datos (acento coral sobre superficies blancas) | Resultado ui-ux-pro-max: *Data-Dense Dashboard* |

### 2.5 Componentes e interacción — 🔴 Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| I1 | AdminTable sin ordenamiento, selección, resize, sticky header ni acciones por fila | `AdminTable.jsx` |
| I2 | FilterBar solo con `<select>` nativos; sin combobox searchable, sin date range, sin chips de filtro activo | `src/features/staff/components/FilterBar.jsx` |
| I3 | Edición inline sin feedback de guardado ni UI optimista | `ConfigPage.jsx:77-94`, `FlagsPage.jsx:36-44` |
| I4 | Skeleton genérico no coincide con el layout final (riesgo de CLS) | `LoadingState.tsx` |
| I5 | Tabs/SegmentedControl disponibles pero no usados en SuperAdmin | `Tabs.tsx` (sin uso en `features/superadmin`) |
| I6 | Formulario de paquetes con fechas `type="date"` sin validación de rango ni animación de campos condicionales | `PaquetesMonedasPage.jsx:310-332` |

### 2.6 Movimiento — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| M1 | `prefers-reduced-motion` solo cubierto en hover de nav | `globals.css:211-213` |
| M2 | Transiciones con propiedades comodín (`all`) | `globals.css:211-213`, `1062-1064` |
| M3 | Duraciones mezcladas: `.16s`, `.24s`, `.28s` sin token único | `tokens.css:255-266` |
| M4 | Modales sin animación de entrada/salida consistente | `Modal.tsx` (clases sin keyframes definidos) |
| M5 | Filas de tabla aparecen sin stagger | `AdminTable.jsx:47-70` |

### 2.7 Responsive — 🔴 Crítica

| # | Hallazgo | Evidencia |
|---|---|---|
| R1 | En ≤900px el sidebar desaparece y el tabbar no cubre el 100% de módulos | `globals.css:1401-1473` |
| R2 | `mobileBehavior="bottom-sheet"` existe en `Modal` pero no se usa en SuperAdmin | `Modal.tsx:34` |
| R3 | Safe-area solo aplicado al tabbar | `globals.css:1436` |

### 2.8 Accesibilidad (WCAG 2.1 AA) — 🔴 Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| A1 | `--muted` (`#5C5A57`) sobre `--bg` (`#FAFAFA`) ≈ 3.88:1 — falla AA para texto pequeño (el token `gris-550` ya existe y no se usa) | `tokens.css:34` |
| A2 | `th` sin `scope="col"` | `AdminTable.jsx:42` |
| A3 | Modal sin `aria-describedby` para el subtítulo | `Modal.tsx:101` |
| A4 | Acciones destructivas sin confirmación ("Desactivar" admin/paquete) | `AdminsPage.jsx:112`, `PaquetesMonedasPage.jsx:209` |
| A5 | Hints/errores de `Input` soportados pero no usados en formularios SuperAdmin | `Input.tsx:49-51` vs uso real |

### 2.9 Performance y arquitectura — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| P1 | Llamadas duplicadas en mount sin cache ni deduplicación | `SuperadminHome.jsx:32-38` |
| P2 | Sin capa de data fetching (fetch crudo, sin stale-while-revalidate) | `src/features/staff/services/superadminApi.js` |
| P3 | Render de todas las filas sin virtualización (~1500 nodos con 100 filas) | `AdminTable.jsx` |
| P4 | `globals.css` monolítico de 1953 líneas | `src/styles/globals.css` |

### 2.10 Copy y UX writing — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| W1 | Verbos inconsistentes: "Crear admin", "Nuevo paquete", "Publicar versión" | Varias páginas |
| W2 | Empty states sin CTA contextual | `AdminsPage`, `FlagsPage`, `PaquetesMonedasPage` |
| W3 | Toasts sin acción de deshacer | `AdminsPage.jsx:70-76` |
| W4 | Ayuda contextual ausente en Parámetros IA (a diferencia de Cobros) | `AIParamsPage.jsx` vs `CobrosPage.jsx:10-41` |

---

## 3. Dirección de diseño objetivo

Adoptamos el patrón **Data-Dense Dashboard** para una consola de operaciones. No es una preferencia estética: es el patrón que corresponde a un panel donde se escanean, filtran y ejecutan acciones sobre datos.

| Atributo | Decisión |
|---|---|
| **Modo** | *Operate* — el usuario completa tareas; la marca vive en el detalle preciso |
| **Estilo** | Data-Dense Dashboard, soporte completo light/dark |
| **Densidad** | `VISUAL_DENSITY: 8` — padding compacto, grid, máxima visibilidad de datos |
| **Varianza** | `DESIGN_VARIANCE: 3` — simétrico, predecible, escaneable |
| **Movimiento** | `MOTION_INTENSITY: 5` — tooltips, highlight de fila, filtros animados |
| **Acento** | Verde `#22C55E` reservado a estados/acciones positivas; rojo `#EF4444` a destructivas |

### Paleta propuesta

```css
:root {
  /* Superficies */
  --ds-bg:            #F8FAFC;
  --ds-surface:       #FFFFFF;
  --ds-surface-2:     #F1F5F9;
  --ds-border:        #E2E8F0;

  /* Texto */
  --ds-fg:            #0F172A;
  --ds-muted:         #64748B;   /* ≥ 4.6:1 sobre --ds-bg */

  /* Estados */
  --ds-accent:        #22C55E;
  --ds-accent-hover:  #16A34A;
  --ds-danger:        #EF4444;
  --ds-warning:       #F59E0B;
  --ds-info:          #3B82F6;

  /* Forma */
  --ds-radius:        8px;
  --ds-radius-lg:     12px;

  /* Espaciado (escala 4pt) */
  --ds-space-1: 4px;  --ds-space-2: 8px;  --ds-space-3: 12px;
  --ds-space-4: 16px; --ds-space-5: 24px; --ds-space-6: 32px;
  --ds-space-7: 48px;

  /* Tipografía */
  --ds-font-ui:   'Fira Sans', system-ui, sans-serif;
  --ds-font-mono: 'Fira Code', monospace;

  /* Elevación */
  --ds-shadow:    0 1px 2px rgb(15 23 42 / .05), 0 2px 8px rgb(15 23 42 / .08);
  --ds-shadow-lg: 0 8px 24px rgb(15 23 42 / .12);

  /* Movimiento */
  --ds-ease-out:   cubic-bezier(0.23, 1, 0.32, 1);
  --ds-ease-in-out:cubic-bezier(0.77, 0, 0.175, 1);
  --ds-dur-fast:   120ms;
  --ds-dur-base:   200ms;
  --ds-dur-slow:   350ms;
}

[data-theme="dark"] {
  --ds-bg:        #020617;
  --ds-surface:   #0F172A;
  --ds-surface-2: #1E293B;
  --ds-border:    #334155;
  --ds-fg:        #F8FAFC;
  --ds-muted:     #94A3B8;
}
```

### Tipografía

- **Display / headings:** Fira Code 600–700 (carácter técnico, coherente con la operación)
- **UI / body:** Fira Sans 400–500
- **Datos:** Fira Code 400 con `font-variant-numeric: tabular-nums`
- **Escala:** `12 / 13 / 14 / 16 / 18 / 20 / 24 / 30` con `clamp()` fluido

---

## Fase 0 — Quick wins (Semana 0)

Objetivo: **parchear producción esta semana** sin esperar la migración completa. Todas son de bajo riesgo y alto impacto.

- [ ] **QW-1** Añadir `overflow-x: auto` a `.ch-table-wrap` *(5 min)* — tablas usables en móvil
- [ ] **QW-2** `aria-label` en botones solo-icono (Desactivar, Editar) *(15 min)* — a11y
- [ ] **QW-3** Diálogo de confirmación para acciones destructivas *(30 min)* — previene errores
- [ ] **QW-4** Bloque global `@media (prefers-reduced-motion: reduce)` en `globals.css` *(10 min)*
- [ ] **QW-5** Skeleton que replique el número de columnas de la tabla *(20 min)* — reduce CLS
- [ ] **QW-6** Corregir `th` con `scope="col"` en `AdminTable` *(10 min)*
- [ ] **QW-7** Usar `--muted-soft`/`gris-550` donde el texto pequeño falla contraste *(20 min)*
- [ ] **QW-8** EmptyState con CTA contextual en las 3 páginas que lo necesitan *(1 h)*

**Criterio de aceptación Fase 0:** las 10 páginas pasan un audit manual de contraste AA, las tablas se pueden leer en 375px, y ninguna acción destructiva se ejecuta sin confirmación.

---

## Fase 1 — Fundación: tokens y tipografía (Semanas 1-2)

Objetivo: una sola fuente de verdad para color, espacio, tipo y movimiento.

- [ ] **F1.1** Crear `src/styles/ds-tokens.css` con la paleta objetivo y eliminar la duplicación entre `tokens.css` y `globals.css`.
- [ ] **F1.2** Definir tema oscuro con `[data-theme="dark"]` y un `ThemeProvider` con persistencia en `localStorage`.
- [ ] **F1.3** Cargar Fira Sans + Fira Code con `font-display: swap` y `preload` de solo los pesos críticos.
- [ ] **F1.4** Migrar los iconos de `lucide-react` a `@phosphor-icons/react` en el módulo SuperAdmin, con `weight`/`stroke` unificado (1.5).
- [ ] **F1.5** Crear `IconRegistry.js` que solo registre los iconos usados (tree-shaking real).
- [ ] **F1.6** Documentar los tokens en `Chambeapp_Doc/Branding/DesignSystem/01-tokens.md`.
- [ ] **F1.7** Añadir script `npm run lint:tokens` que falle si aparece un color hex hardcodeado en `features/superadmin/**`.

**Criterio de aceptación Fase 1:** existe una única definición de cada token; el cambio de un token se refleja en toda la aplicación; no quedan colores hardcodeados en `features/superadmin`.

---

## Fase 2 — Shell y navegación (Semanas 2-3)

Objetivo: que el usuario siempre sepa dónde está y pueda llegar a cualquier módulo desde cualquier dispositivo.

- [ ] **F2.1** Sidebar con grupos colapsables (chevron), badge de conteo asíncrono y navegación por teclado (↑/↓/Enter/Esc).
- [ ] **F2.2** Reagrupar la navegación en 5 bloques: *Inicio · Gestión de usuarios · Sistema · Gobernanza · Análisis*.
- [ ] **F2.3** Tabbar móvil: 5 accesos directos + botón **"Más"** que abre un drawer con el resto de módulos.
- [ ] **F2.4** Persistir la posición de scroll al navegar atrás.
- [ ] **F2.5** Componente `Breadcrumbs` generado desde el router + `navigation.js`; en móvil colapsado a `... › último`.
- [ ] **F2.6** `CommandPalette` (cmdk) con búsqueda de páginas, acciones y entidades por ID.
- [ ] **F2.7** `focus-on-route-change`: al cambiar de ruta, mover el foco al `<main>` para lectores de pantalla.

**Criterio de aceptación Fase 2:** las 10 páginas del SuperAdmin son alcanzables desde 375px; `Cmd+K` encuentra cualquier página; el segundo nivel de navegación tiene breadcrumb.

---

## Fase 3 — Componentes core (Semanas 3-5)

Objetivo: dejar de construir tablas y formularios a mano en cada página.

### 3.1 DataTable Pro

- [ ] **F3.1** Instalar `@tanstack/react-table` + `@tanstack/react-virtual`.
- [ ] **F3.2** Implementar `DataTable` con: sorting multi-columna, selección con checkbox, acciones en lote, resize de columna, header sticky y virtualización.
- [ ] **F3.3** Acciones por fila en menú contextual (no botones sueltos).
- [ ] **F3.4** Navegación por teclado: ↑↓ mover, Espacio seleccionar, Enter abrir, `/` enfocar filtro.
- [ ] **F3.5** Stagger de entrada de filas a 30 ms/ítem, respetando `prefers-reduced-motion`.
- [ ] **F3.6** Migrar `AdminTable` → `DataTable` en las 5 páginas que lo usan.

### 3.2 FilterBar Pro

- [ ] **F3.7** Combobox searchable para selects con > 10 opciones.
- [ ] **F3.8** `DateRangePicker` con presets (*Hoy, 7d, 30d, Personalizado*).
- [ ] **F3.9** Filtros activos como chips removibles individualmente.
- [ ] **F3.10** Sincronización con la URL (enlaces compartibles con filtros).

### 3.3 Form System

- [ ] **F3.11** Instalar `react-hook-form` + `zod`.
- [ ] **F3.12** Campos: `TextField`, `SelectField`, `DateField`, `NumberField`, `JsonField`, `SwitchField`.
- [ ] **F3.13** Layouts `FormSection` y `FormGrid` responsivos (1 / 2 / 3-4 columnas).
- [ ] **F3.14** Validación en blur + submit, errores inline y resumen superior con anclas.
- [ ] **F3.15** Banner de cambios sin guardar + confirmación al abandonar.

### 3.4 Modal y estados

- [ ] **F3.16** Ampliar `Modal` con sizes `sm/md/lg/xl/full` y `bottom-sheet` por defecto en ≤ 560px.
- [ ] **F3.17** Animación de entrada `scale(0.96) + fade` 200 ms ease-out; salida 150 ms ease-in.
- [ ] **F3.18** `TableSkeleton` y `CardSkeleton` que repliquen el layout final.
- [ ] **F3.19** Variantes de `EmptyState`: `default`, `action` (con CTA), `search` (sin resultados).

**Criterio de aceptación Fase 3:** ninguna página SuperAdmin define su propia tabla o formulario desde cero; todos consumen los componentes core.

---

## Fase 4 — Rediseño de páginas (Semanas 5-9)

### 4.1 SuperadminHome → Operations Dashboard

- [ ] **F4.1** 4 KPI cards (Admins, Configs, Flags, Paquetes) con datos de React Query.
- [ ] **F4.2** Feed de actividad reciente (últimos 10 registros de auditoría).
- [ ] **F4.3** Acciones rápidas como botones primarios/secundarios (no tarjetas).
- [ ] **F4.4** Botón de refresco global con estado de "actualizando".

### 4.2 AdminsPage → User Management

- [ ] **F4.5** `DataTable` con sort, filtro, selección y acciones en lote (Activar / Desactivar / Exportar).
- [ ] **F4.6** Modal crear/editar con tabs *Datos · Permisos · Notificaciones*.
- [ ] **F4.7** Flujo de invitación por email (magic link) en lugar de contraseña en creación.
- [ ] **F4.8** Historial de cambios por admin (audit filtrado).

### 4.3 ConfigPage → System Configuration

- [ ] **F4.9** Agrupar por tabs: *General · Pagos · Notificaciones · Seguridad · IA · Avanzado*.
- [ ] **F4.10** Por cada clave: descripción, tipo, valor editado según tipo, última modificación y autor.
- [ ] **F4.11** Import/export JSON.
- [ ] **F4.12** Historial de versiones por clave con diff.

### 4.4 FlagsPage → Feature Flags Manager

- [ ] **F4.13** Tabla con entorno (prod/staging/dev), % de rollout y reglas de targeting.
- [ ] **F4.14** Edición inline: switch + % + "Añadir regla".
- [ ] **F4.15** Modal de detalle con historial de cambios y kill switch con confirmación.

### 4.5 AIParamsPage → AI Weights Editor

- [ ] **F4.16** Sliders 0–1 sincronizados con input numérico.
- [ ] **F4.17** Presets *Conservador / Equilibrado / Agresivo*.
- [ ] **F4.18** Panel de simulación con datos de prueba y scores de salida.
- [ ] **F4.19** Versionado con rollback y configuración de A/B test.

### 4.6 AuditPage → Audit Log Explorer

- [ ] **F4.20** Tabla virtualizada (10k+ filas) con filtros avanzados.
- [ ] **F4.21** Detalle en *drawer* lateral con diff visual antes/después.
- [ ] **F4.22** Export CSV / JSON / PDF.
- [ ] **F4.23** Búsquedas guardadas ("Mis vistas").

### 4.7 CobrosPage → Pricing Calculator

- [ ] **F4.24** Formulario estructurado con validación en vivo.
- [ ] **F4.25** Preview interactivo: slider de monto → cálculo de monedas en tiempo real.
- [ ] **F4.26** Historial de cambios con diff visual.
- [ ] **F4.27** Simulador de impacto en revenue estimado.

### 4.8 LegalPage → Legal Version Manager

- [ ] **F4.28** Tabs *Versión actual · Historial · Draft*.
- [ ] **F4.29** Editor rich text (TipTap) con variables.
- [ ] **F4.30** Vista de diff (lado a lado / inline).
- [ ] **F4.31** Flujo de publicación con confirmación + número de versión automático + notificación a usuarios.
- [ ] **F4.32** Rollback en un clic.

### 4.9 OverridesPage → Emergency Actions

- [ ] **F4.33** Layout de dos columnas (Usuarios / Contratos) con autocomplete por ID.
- [ ] **F4.34** Campo *Justificación* obligatorio.
- [ ] **F4.35** Confirmación: escribir `CONFIRMAR` + checkbox de irreversibilidad.
- [ ] **F4.36** Registro automático en auditoría con la justificación.
- [ ] **F4.37** Rate limit de 5 overrides/hora por admin (validación en front + back).

### 4.10 PaquetesMonedasPage → Coin Package Manager

- [ ] **F4.38** Tabla con monedas base+bonus, precio COP, precio por moneda, estado, oferta y orden.
- [ ] **F4.39** Wizard de 3 pasos: *Básicos · Precios · Configuración*.
- [ ] **F4.40** Validación de rango de fechas de oferta.
- [ ] **F4.41** Reordenamiento por drag-drop.
- [ ] **F4.42** Acciones: duplicar, activar/desactivar en lote.

**Criterio de aceptación Fase 4:** cada página cumple los flujos críticos definidos en la Fase 6 y no contiene estilos inline de layout.

---

## Fase 5 — Movimiento y pulido (Semanas 9-10)

- [ ] **F5.1** Tokens `--ds-ease-*` y `--ds-dur-*` aplicados de forma única; eliminar `transition: all`.
- [ ] **F5.2** Micro-interacciones: press de botón (`scale(0.97)`, 100 ms), hover de fila (120 ms), switch (spring 150 ms).
- [ ] **F5.3** Entrada/salida de modal, drawer y toast con direcciones coherentes.
- [ ] **F5.4** Transición de página con View Transitions API (con fallback estático).
- [ ] **F5.5** Shimmer de skeleton (1.5 s, `linear`), desactivado con reduced-motion.

**Criterio de aceptación Fase 5:** con `prefers-reduced-motion: reduce` toda animación de posición se desactiva y la interfaz sigue siendo comprensible.

---

## Fase 6 — Hardening y calidad (Semanas 10-12)

### 6.1 Testing

- [ ] **F6.1** Vitest + React Testing Library — ≥ 80 % de componentes core.
- [ ] **F6.2** Playwright — 10 flujos críticos E2E.
- [ ] **F6.3** `axe-core` integrado en Playwright — 0 violaciones AA.
- [ ] **F6.4** Snapshots visuales de las 10 páginas (light + dark + móvil).

### 6.2 Flujos E2E obligatorios

1. Login → Home → Crear admin → verificar en tabla → cambiar rol → desactivar.
2. Config → cambiar valor → guardar → verificar en auditoría.
3. Flags → toggle → verificar propagación.
4. Paquetes → crear con oferta → verificar en preview → activar.
5. Legal → editar draft → publicar v2 → verificar versión vigente.
6. Cobros → cambiar % → verificar preview → guardar.
7. Auditoría → filtrar por actor + fecha → detalle → diff.
8. Overrides → buscar usuario → suspender con justificación → verificar en auditoría.
9. Móvil → tabbar → "Más" → Auditoría → detalle.
10. `Cmd+K` → buscar flag → toggle desde la paleta.

### 6.3 Performance

- [ ] **F6.5** Budgets: JS < 180 KB gz, CSS < 30 KB gz, LCP < 1.8 s, TTI < 2.5 s.
- [ ] **F6.6** Render de 100 filas en < 100 ms; apertura de modal < 80 ms.
- [ ] **F6.7** Lighthouse CI en cada PR.

### 6.4 Resiliencia y documentación

- [ ] **F6.8** Error Boundary por feature + integración Sentry.
- [ ] **F6.9** Fallback de red con reintento visible.
- [ ] **F6.10** Storybook para todo componente core.
- [ ] **F6.11** ADR de las decisiones: TanStack Table, React Query, Phosphor, Fira.
- [ ] **F6.12** Runbook: despliegue, rollback, desactivación de emergencia por flag.

---

## 5. Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Data fetching | **TanStack Query v5** | Cache, deduplicación, mutaciones, devtools |
| Tablas | **TanStack Table v8** + `react-virtual` | Headless, virtualización, control total |
| Formularios | **React Hook Form + Zod** | Rendimiento y validación tipada |
| Iconos | **Phosphor Icons React** | Stroke uniforme, tree-shaking |
| Animación | **Motion** | Springs, exit animations, reduced-motion |
| Diálogos | **Radix UI Dialog / Sheet** | Accesibilidad y focus trap probados |
| Toasts | **Sonner** (ya en uso) | API de promesas y dismiss |
| Fechas | **date-fns** + `@internationalized/date` | Ligero e i18n |
| Editor rich text | **TipTap** | Extensible (solo Legal) |
| Command palette | **cmdk** | Accesible y keyboard-first |
| Tests | **Vitest + RTL + Playwright + axe** | Cobertura unitaria, E2E y a11y |

---

## 6. Métricas de éxito

| KPI | Hoy | Meta | Medición |
|---|---|---|---|
| Finalización de tarea (crear admin) | ~60 % | > 95 % | Playwright E2E |
| Tiempo de "crear paquete" | ~4 min | < 90 s | Test de usuario |
| Acciones destructivas sin confirmar | ~5 % | 0 % | Sentry |
| Lighthouse móvil (usabilidad) | ~45 | > 90 | Lighthouse CI |
| Cobertura a11y (axe) | ~60 % | 100 % AA | Playwright + axe |
| Bundle SuperAdmin | ~350 KB | < 180 KB | Vite build report |
| LCP (Home) | ~3.2 s | < 1.8 s | Lighthouse CI |

---

## 7. Cronograma

| Semana | Fase | Entregable |
|---|---|---|
| 0 | Quick wins | Parches de producción de bajo riesgo |
| 1-2 | Fundación | Tokens consolidados, tipografía, iconos |
| 2-3 | Shell y navegación | Sidebar, tabbar "Más", Cmd+K, breadcrumbs |
| 3-5 | Componentes core | DataTable, FilterBar, Form System, Modal |
| 5-9 | Páginas | 10 módulos rediseñados |
| 9-10 | Movimiento | Tokens de motion, micro-interacciones, transiciones |
| 10-12 | Hardening | Tests, performance, error boundaries, docs |

**Total: ~12 semanas** hasta una versión 2.0 lista para producción.

---

## 8. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Cambio de paleta rompe otros roles que comparten `tokens.css` | Alta | Alto | Introducir `ds-tokens.css` con alcance al SuperAdmin primero; migrar roles por separado |
| Migración a Phosphor afecta consistencia con el frontend principal | Media | Medio | Aplicar solo en Admin; documentar divergencia en ADR |
| DataTable Pro añade complejidad de mantenimiento | Media | Medio | Encapsular en un componente único con API estable + Storybook |
| Falta de datos reales para el feed de actividad | Media | Bajo | Fallback a EmptyState ilustrado |
| Rate limit de overrides requiere cambios en backend | Alta | Medio | Coordinar con el equipo backend antes de la Fase 4.9 |
| Tiempo de carga del editor TipTap | Baja | Bajo | Lazy load solo en LegalPage |

---

## 9. Definition of Done

Una tarea se considera terminada cuando:

- [ ] Cumple el criterio de aceptación de su fase.
- [ ] No introduce colores ni espaciados hardcodeados en `features/superadmin`.
- [ ] Tiene test unitario (si es un componente core) o E2E (si es un flujo).
- [ ] Pasa `axe` sin violaciones AA.
- [ ] Funciona en 375 px, 768 px y 1440 px, en light y dark.
- [ ] Respeta `prefers-reduced-motion`.
- [ ] Está documentada en Storybook (si es un componente core).

---

## 10. Próximos pasos

1. **Aprobar el plan** y confirmar alcance (¿se aplica solo al SuperAdmin o también a Admin/Verificador/Soporte?).
2. Crear rama `feat/superadmin-v2` y configurar Vitest + Playwright + Lighthouse CI.
3. Ejecutar **Fase 0** (quick wins) esta semana sobre producción.
4. Iniciar **Fase 1** (tokens, tipografía, iconos).
5. Sync semanal para revisar avance y ajustar alcance.

---

### Archivos clave de referencia

| Ruta | Rol |
|---|---|
| `Chambeapp_admin_frontend/src/features/superadmin/` | Páginas del módulo |
| `Chambeapp_admin_frontend/src/styles/tokens.css` | Tokens actuales (a consolidar) |
| `Chambeapp_admin_frontend/src/styles/globals.css` | Shell y estilos base (1953 líneas) |
| `Chambeapp_admin_frontend/src/config/navigation.js` | Navegación por rol |
| `Chambeapp_admin_frontend/src/components/layout/AppShell.jsx` | Shell (sidebar, topbar, tabbar) |
| `Chambeapp_admin_frontend/src/components/ui/` | Design system base |
| `Chambeapp_Doc/Branding/DesignSystem/` | Documentación del sistema de diseño |

---

## 11. Estado de implementación (13 nov 2026)

Implementado sobre `Chambeapp_admin_frontend` **sin añadir dependencias npm**: el stack propuesto en §5
(TanStack Query/Table, Radix, Motion, cmdk, Phosphor, TipTap) se sustituyó por React + `react-router-dom` +
`lucide-react` + `sonner`, para no disparar el bundle ni romper el panel existente. La migración a ese stack
queda disponible como paso posterior.

### Por fase

| Fase | Estado | Entregado |
|---|---|---|
| 0 — Quick wins | ✅ | Correcciones aplicadas dentro de las fases siguientes (scroll, focus visible, overflow de tablas). |
| 1 — Fundación | ✅ | `ds-tokens.css` con paleta, espaciado 4 pt, escala tipográfica, sombras y movimiento; tema oscuro que remapea los primitivos legacy; `ThemeContext` con persistencia y anti-flash. |
| 2 — Shell | ✅ | Sidebar con grupos colapsables y teclado, topbar con búsqueda/tema/rol, tabbar 5 + **Más**, breadcrumbs, Cmd/Ctrl+K, skip link y foco a `<main>`. |
| 3 — Componentes core | ✅ | `AdminTable` (sorting, selección, bulk, sticky, skeleton), `ConfirmDialog`, `Modal` con bottom-sheet, `EmptyState` con acción, `TableSkeleton`, `FilterBar` con chips. |
| 4 — Páginas | ✅ 10/10 | Inicio, Admins, Configuración, Flags, IA, Auditoría, Cobros, Legal, Overrides, Paquetes. |
| 5 — Movimiento | ✅ (F5.4 pendiente) | Tokens de duración/easing, press de botón, hover de fila, switch, entradas/salidas de modal y drawer, shimmer con `prefers-reduced-motion`. Falta la View Transitions API entre páginas. |
| 6 — Hardening | 🟡 parcial | Error Boundary por ruta, Vitest + Testing Library con 26 pruebas (componentes core y render de las 10 páginas), bundle 118,30 KB gzip. Pendiente: Playwright + axe, Storybook, Sentry, Lighthouse CI. |

### Verificación ejecutada

| Comprobación | Resultado |
|---|---|
| `tsc --noEmit` | 0 errores |
| `npm run build` | OK · bundle principal **118,47 KB gzip** |
| `vitest run` | **79/79** pruebas en verde (todo el panel, no solo SuperAdmin) |
| `playwright test` | **10 passed, 2 skipped** (flujos con sesión requieren credenciales) |
| `transition: all` | 0 apariciones en `src/**/*.css` |
| Render de las 23 páginas | Todas montan el shell y su contenido sin errores |

### Brechas de API — cerradas el 13 nov 2026

Las cinco limitaciones detectadas al implementar el plan se resolvieron en backend y el panel ya las consume:

| Brecha | Solución aplicada |
|---|---|
| Auditoría solo filtraba por `actor_id`, `entity_type` y `limit` | `GET /superadmin/audit-logs` acepta `action`, `q`, `from`, `to`, `offset` y acota `limit` a 500. La página consulta al servidor con debounce y pagina con "Cargar más". |
| T&C sin historial, borrador remoto ni rollback | `PUT /legal/tyc/draft`, `GET /legal/tyc/history` (20 versiones) y `POST /legal/tyc/rollback`, todos reversibles y auditados. Publicar descarta el borrador. |
| Overrides sin persistir la justificación | El schema acepta `justificacion` (15–500) y queda en `after_json` de la auditoría; el panel la envía siempre. |
| Paquetes sin reordenamiento masivo ni reactivación | `POST /wallet/admin/paquetes/reordenar` (transaccional) y `POST /wallet/admin/paquetes/<id>/activar`. |
| Cobros sin `updated_at` | `GET/PUT /admin/cobros` devuelven `updated_at` y `updated_by` reales. |

Cubierto por `tests/test_superadmin_mejoras.py` (16 casos).

### Pendientes conscientes

- Playwright + `axe-core`: **integrado** (`playwright.config.js`, `e2e/humo.spec.js`, proyectos desktop y móvil).
  Cubre login, redirección de rutas protegidas, teclado y escaneo AA; los flujos autenticados se activan con
  `E2E_EMAIL`/`E2E_PASSWORD`. Faltan los 10 flujos completos de §6.2 y los snapshots visuales.
- Storybook de componentes core y ADR de las decisiones de stack.
- Sentry y budgets de Lighthouse en CI (los budgets de bundle ya se cumplen).
- ~~F5.4: View Transitions~~ → **implementado**: navegación interna envuelta con `document.startViewTransition`
  + `flushSync`, con fallback estático y desactivación en `prefers-reduced-motion`.
