# 🛠️ Plan de Implementación — Mejora UX/UI del Panel Admin

**Proyecto:** ChambeApp · `Chambeapp_admin_frontend`
**Rol:** Admin (gestión operativa de la plataforma)
**Páginas:** 8 (Home, Usuarios, Verificaciones, Stats, Solicitudes, Disputas, Contratos, Contenido)
**Versión:** 1.0 | **Fecha:** 13 noviembre 2026 | **Duración:** 8 semanas

---

## 1. Resumen ejecutivo

El panel **Admin** es la consola operativa diaria: gestiona usuarios, verifica identidades, modera contenido y resuelve disputas. Hoy funciona pero tiene **deuda sistémica** compartida con SuperAdmin (AdminTable, FilterBar, tokens) más **problemas propios** (Disputas = 1023 líneas en un archivo, navegación móvil incompleta, flujos de chat/disputa acoplados).

**Diferencia clave con SuperAdmin:** Admin *ejecuta* decisiones; SuperAdmin *configura* el sistema. La UI debe optimizar para **velocidad de juicio y acción**, no para densidad de configuración.

| Indicador | Hoy | Meta (8 sem) |
|---|---|---|
| Tiempo "aprobar verificación" | ~45 s | < 15 s |
| Tiempo "resolver disputa simple" | ~3 min | < 60 s |
| Acciones destructivas sin confirmar | ~5% | 0% |
| Páginas accesibles en 375px | 4 de 8 | 8 de 8 |
| Cobertura a11y (axe) | ~55% | 100% AA |

---

## 2. Diagnóstico por categoría

### 2.1 Arquitectura y navegación — 🔴 Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| AN1 | **Tabbar móvil solo 5 items** — Disputas, Contenido, Stats, Contratos, Verificaciones *inaccesibles* en móvil | `navigation.js:138-144` |
| AN2 | **Sin breadcrumbs** en vistas de detalle (Disputas, TicketDetail) | `DisputesPage.jsx:960`, `TicketsPage.jsx:186` |
| AN3 | **Duplicación de shell**: AdminHome usa `StatsGrid` local, no componente compartido | `AdminHome.jsx:39-51` vs `SuperadminHome.jsx:44-59` |
| AN4 | **Navegación contextual rota**: desde Disputa → ChatPanel → volver pierde estado | `DisputesPage.jsx:303-308` |

### 2.2 Componentes y patrones — 🔴 Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| CP1 | **DisputesPage = 1023 líneas** — 7 componentes internos, lógica de chat, variables, veredictos, todo acoplado | `DisputesPage.jsx` completo |
| CP2 | **AdminTable usado como "detail view"** — en Disputas el click abre vista lateral, no modal; patrón inconsistente | `DisputesPage.jsx:1011-1018` vs `UsersPage.jsx:127` |
| CP3 | **ChatPanel importado de Soporte** en Disputas — acoplamiento cruzado entre roles | `DisputesPage.jsx:14` |
| CP4 | **VerificationsPage: modal rechazo sin validación de longitud mínima** | `VerificationsPage.jsx:43-46` |
| CP5 | **ContentModPage sin filtros ni búsqueda** — carga todo sin paginación | `ContentModPage.jsx:17-22` |

### 2.3 Datos y performance — 🟠 Media-Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| DP1 | **Polling 20s + WebSocket + visibilitychange + focus** en *cada* página Home — 4 listeners duplicados | `AdminHome.jsx` (no tiene), `VerificadorHome.jsx:41-54`, `SoporteHome.jsx:71-84`, `DisputesPage.jsx:789-803` |
| DP2 | **Disputas carga conversación completa al abrir detalle** — sin virtualización ni paginación | `DisputesPage.jsx:119-136` |
| DP3 | **Filtros en cliente** (`useMemo`) para listas que pueden crecer — Users, Tickets, Disputas | `UsersPage.jsx`, `TicketsPage.jsx:90-109`, `DisputesPage.jsx:906-919` |
| DP4 | **Sin React Query / TanStack Query** — fetch crudo, sin cache, sin dedup | Todas las páginas |

### 2.4 Accesibilidad — 🔴 Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| AC1 | **Botones "Ocultar/Eliminar" sin confirmación** en Solicitudes y Contenido | `SolicitudesModPage.jsx:77-84`, `ContentModPage.jsx:63-68` |
| AC2 | **Contraste `--muted` falla AA** (heredado de tokens globales) | `tokens.css:34` |
| AC3 | **Tabs en DisputeChat sin `aria-controls` ni `role="tabpanel"`** | `DisputesPage.jsx:267-298` |
| AC4 | **Inputs de rechazo sin `aria-describedby` para error** | `VerificationsPage.jsx:120-126` |

### 2.5 UX Writing y flujos — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| UW1 | **Veredictos de disputa: plantillas hardcodeadas** en JSX — no editables, no versionadas | `DisputesPage.jsx:31-52` |
| UW2 | **Estados de disputa: "abierta/cerrada" pero UI muestra "resuelta"** — inconsistencia semántica | `DisputesPage.jsx:57-59` |
| UW3 | **Empty states genéricos** — "Sin solicitudes", "Sin disputas" sin CTA | `SolicitudesModPage.jsx:105`, `DisputesPage.jsx:1017` |
| UW4 | **Falta ayuda contextual** en Variables de disputa (qué significa cada campo) | `DisputesPage.jsx:387-393` |

---

## 3. Dirección de diseño — *Operations Console*

| Atributo | Decisión |
|---|---|
| **Modo** | **Operate** — juicio rápido, acción inmediata |
| **Estilo** | **Data-Dense Dashboard** (igual que SuperAdmin) pero con **acciones primarias más visibles** |
| **Densidad** | `VISUAL_DENSITY: 7` — compacto pero con espacio para leer disputas |
| **Varianza** | `DESIGN_VARIANCE: 3` — predecible, simétrico |
| **Movimiento** | `MOTION_INTENSITY: 4` — feedback táctil, transiciones de estado |
| **Acento** | **Verde `#22C55E`** (aprobar), **Rojo `#EF4444`** (rechazar/eliminar), **Ámbar `#F59E0B`** (pendiente) |

### Paleta (extends Data-Dense Dashboard)

```css
:root {
  /* Hereda tokens base de ds-tokens.css */
  --admin-accent-approve: #22C55E;
  --admin-accent-reject:  #EF4444;
  --admin-accent-pending: #F59E0B;
  --admin-accent-info:    #3B82F6;
  
  /* Estados de disputa */
  --admin-dispute-open:     #F59E0B;
  --admin-dispute-resolved: #22C55E;
  --admin-dispute-closed:   #64748B;
  
  /* Chat soporte */
  --admin-support-badge:    #3B82F6;
}
```

---

## Fase 0 — Quick wins (Semana 0)

| ID | Acción | Esfuerzo |
|---|---|---|
| QW-A1 | Confirm dialog en "Ocultar" (Solicitudes) y "Eliminar" (Contenido) | 30 min |
| QW-A2 | `overflow-x: auto` en `.ch-table-wrap` global | 5 min |
| QW-A3 | `scope="col"` en todos los `th` de AdminTable | 10 min |
| QW-A4 | Validación longitud mínima en motivo de rechazo (Verificaciones) | 15 min |
| QW-A5 | EmptyState con CTA "Ver todas" en ContentModPage | 20 min |
| QW-A6 | `@media (prefers-reduced-motion: reduce)` global | 10 min |

---

## Fase 1 — Fundación compartida (Semanas 1-2)

*Igual que SuperAdmin Fase 1 — tokens, tipografía Fira, Phosphor Icons, React Query setup.*

- [ ] **F1.1** `ds-tokens.css` + `ThemeProvider` (alcance: Admin + Verificador + Soporte)
- [ ] **F1.2** Migración a Phosphor Icons (stroke 1.5)
- [ ] **F1.3** TanStack Query v5 + `queryClient` provider en `AppShell`
- [ ] **F1.4** Migrar *todos* los `useEffect` de polling/WS a `useQuery` + `useSubscription` (custom hook)

---

## Fase 2 — Shell y navegación Admin (Semanas 2-3)

### 2.1 Sidebar Admin — 5 grupos colapsables

```
┌─────────────────────────────────────┐
│  📊  Inicio                         │
├─────────────────────────────────────┤
│  👥  USUARIOS                       │
│     Usuarios        [Badge]         │
│     Verificaciones  [Badge]         │
├─────────────────────────────────────┤
│  📋  CONTENIDO Y SOLICITUDES        │
│     Solicitudes     [Badge]         │
│     Contenido       [Badge]         │
├─────────────────────────────────────┤
│  ⚖️  MODERACIÓN Y DISPUTAS          │
│     Disputas        [Badge]         │
│     Contratos       [Badge]         │
├─────────────────────────────────────┤
│  📈  ANÁLISIS                       │
│     Estadísticas                    │
├─────────────────────────────────────┤
│  👤  Cuenta                         │
└─────────────────────────────────────┘
```

- [ ] **F2.1** Grupos colapsables con badge asíncrono (React Query)
- [ ] **F2.2** Tabbar móvil: 5 directos + "Más" (drawer con resto)
- [ ] **F2.3** Breadcrumbs en vistas de detalle (Disputa, Ticket, Usuario)
- [ ] **F2.4** Command Palette (Cmd+K) — busca usuario #ID, disputa #ID, ticket #ID

---

## Fase 3 — Componentes core (Semanas 3-4)

### 3.1 DataTable Pro (migración AdminTable → DataTable)

| Página | Columnas clave | Acciones fila | Filtros |
|---|---|---|---|
| **Usuarios** | Nombre, Rol (badge), Estado, Registro | Cambiar rol (select), Suspender/Activar | Rol, Estado, Búsqueda |
| **Verificaciones** | Usuario, Tipo, Número, Fecha | Aprobar, Rechazar (modal) | Estado, Tipo |
| **Solicitudes** | Título, Categoría, Estado, Usuario | Ocultar/Restaurar | Estado, Búsqueda |
| **Disputas** | Contrato/Sol, Motivo, Estado, Fecha | Ver detalle (drawer) | Estado, Búsqueda |
| **Contratos** | ID, Solicitante, Proveedor, Monto, Estado | Cancelar, Marcar | Estado |
| **Contenido** | Solicitud, Autor, Calificado, Puntaje | Ocultar, Eliminar | — (añadir) |
| **Tickets** (Soporte) | Asunto, Usuario, Prioridad, Estado | Abrir detalle (drawer) | Estado, Prioridad, Búsqueda |

- [ ] **F3.1** `DataTable` con: virtualización, sorting, selección, bulk actions, sticky header, row actions dropdown
- [ ] **F3.2** `FilterBarPro`: combobox searchable, date range, chips activos, URL sync
- [ ] **F3.3** `DetailDrawer` (reemplaza modal en Disputas/Tickets) — slide-in right, persist scroll
- [ ] **F3.4** `ActionConfirm` wrapper — `<ActionConfirm onConfirm={fn} message="¿Seguro?">Eliminar</ActionConfirm>`

### 3.2 Form System (React Hook Form + Zod)

- [ ] **F3.5** Campos base + `RejectReasonField` (validación longitud + obligatorio)
- [ ] **F3.6** `DisputeVerdictEditor` — rich text (TipTap) con plantillas versionadas
- [ ] **F3.7** `VariablesDisputaForm` — ayuda contextual inline por campo

---

## Fase 4 — Rediseño de páginas (Semanas 4-7)

### 4.1 AdminHome → Operations Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  📊  Panel administrativo              [Actualizar] [Cmd+K] │
├─────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │👥 12K  │ │✅ 8.2K │ │📋 342  │ │⚖️  12   │ │💰 45M  │ KPIs │
│  │Usuarios│ │Activos │ │Solicit.│ │Disputas│ │Ingresos│     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌───────────────────────────┐  │
│  │ ACCIONES PENDIENTES     │ │ ACCIONES RÁPIDAS          │  │
│  │ • 3 verificaciones ⏳   │ │ [Verificar usuarios]      │  │
│  │ • 12 disputas abiertas  │ │ [Moderar solicitudes]     │  │
│  │ • 5 tickets sin asignar │ │ [Revisar contenido]       │  │
│  └─────────────────────────┘ └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- [ ] **F4.1** KPI cards con datos React Query (stale-while-revalidate)
- [ ] **F4.2** "Action queue" — items que requieren atención (contadores clickeables)
- [ ] **F4.3** Quick actions como botones primarios (no tarjetas)

### 4.2 UsersPage → User Management

- [ ] **F4.4** `DataTable` con bulk actions: *Cambiar rol masivo, Suspender masivo, Exportar CSV*
- [ ] **F4.5** Drawer detalle usuario: historial roles, verificaciones, contratos, tickets
- [ ] **F4.6** Invite user flow (email → magic link) en lugar de crear con password

### 4.3 VerificationsPage → KYC Queue (versión Admin)

- [ ] **F4.7** Vista tabla *compacta* (no cards como Verificador) — más filas visibles
- [ ] **F4.8** Aprobación en lote (checkbox + "Aprobar seleccionados")
- [ ] **F4.9** Modal rechazo con plantillas de motivo + campo libre

### 4.4 DisputesPage → **Refactor mayor** (Divide en 3 archivos)

```
features/admin/
├── DisputesListPage.jsx      (tabla + filtros + drawer)
├── DisputeDetailDrawer.jsx   (vista lateral: chat, variables, partes)
├── DisputeVerdictDrawer.jsx  (veredicto + plantillas)
└── components/
    ├── DisputeChatTabs.jsx
    ├── DisputeVariablesForm.jsx
    ├── DisputePartiesPanel.jsx
    └── DisputeTimeline.jsx
```

- [ ] **F4.10** Extraer `DisputeDetailDrawer` — usa `DetailDrawer` core
- [ ] **F4.11** `DisputeChatTabs` componente propio (no importar de Soporte)
- [ ] **F4.12** Plantillas de veredicto en BD/Config (no hardcodeadas)
- [ ] **F4.13** Timeline visual de la disputa (creación → mensajes → decisiones → cierre)
- [ ] **F4.14** Variables de disputa con validación y preview de impacto

### 4.5 ContractsModPage / SolicitudesModPage / ContentModPage

- [ ] **F4.15** Migrar a `DataTable` + `FilterBarPro`
- [ ] **F4.16** ContentModPage: añadir filtros (fecha, puntaje, reportado) + búsqueda
- [ ] **F4.17** Acciones destructivas con `ActionConfirm`

### 4.6 StatsPage (nueva / mejorar)

- [ ] **F4.18** Dashboard analítico: gráficos de series temporales (Recharts)
- [ ] **F4.19** Filtros de rango de fecha + comparativa período anterior
- [ ] **F4.20** Export PDF/CSV de reportes

---

## Fase 5 — Movimiento y pulido (Semana 7)

- [ ] **F5.1** Tokens motion aplicados (`--ds-dur-fast/base/slow`, `--ds-ease-out/in-out`)
- [ ] **F5.2** Micro-feedback: row hover (120ms), button press (scale 0.97, 100ms), badge pulse en "Nuevo"
- [ ] **F5.3** Drawer enter: `translateX(100%) → 0` 200ms ease-out; exit 150ms ease-in
- [ ] **F5.4** Toast de acciones destructivas con "Deshacer" (5s)

---

## Fase 6 — Hardening (Semana 8)

### 6.1 Testing

- [ ] **F6.1** Vitest ≥ 80% componentes core
- [ ] **F6.2** Playwright 8 flujos E2E críticos

### 6.2 Flujos E2E obligatorios (Admin)

1. Login → Home → Verificaciones → Aprobar 1 → Rechazar 1 con motivo → Ver en auditoría
2. Usuarios → Filtrar "merchant" → Cambiar rol a "pds" → Verificar badge actualizado
3. Disputas → Abrir drawer → Leer chat → Completar variables → Emitir veredicto con plantilla → Cerrar
4. Solicitudes → Buscar título → Ocultar → Confirmar → Ver estado "oculto"
5. Contenido → Filtrar "reportado" → Eliminar → Confirmar → Verificar eliminado
6. Home → Action queue click "3 verificaciones" → Llega a Verificaciones filtrado
7. Móvil → Tabbar "Más" → Disputas → Abrir drawer → Ver chat
8. Cmd+K → "disputa 42" → Abre drawer directo

### 6.3 Performance

- [ ] **F6.4** Bundle Admin chunk < 150 KB gz
- [ ] **F6.5** LCP Home < 1.5s, Drawer open < 60ms
- [ ] **F6.6** Lighthouse móvil > 90, axe 0 violaciones

### 6.4 Docs y resiliencia

- [ ] **F6.7** Storybook: DataTable, FilterBarPro, DetailDrawer, ActionConfirm
- [ ] **F6.8** ADR: extracción DisputesPage, shared chat components
- [ ] **F6.9** ErrorBoundary por feature + Sentry

---

## Riesgos específicos Admin

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Refactor DisputesPage rompe flujos de Soporte (ChatPanel compartido) | Alta | Alto | **Crear `SharedChatComponents`** package interno antes de tocar DisputesPage |
| Plantillas veredicto en BD requiere backend | Media | Medio | Mock local primero; coordinar API `/api/admin/dispute-templates` |
| Polling 20s en 4 páginas = carga servidor | Alta | Medio | Migrar a React Query + WebSocket único en `AppShell` (Fase 1.4) |

---

## Definition of Done (Admin)

- [ ] 8 páginas migradas a DataTable + FilterBarPro
- [ ] DisputesPage refactorizada en 3 archivos < 300 líneas c/u
- [ ] 0 acciones destructivas sin confirmación
- [ ] 100% páginas accesibles en 375px
- [ ] axe 0 violations AA
- [ ] 8 flujos E2E verdes en CI
- [ ] Storybook publicado para componentes core

---

## Próximos pasos

1. **Aprobar plan** y confirmar si `SharedChatComponents` se hace en este plan o aparte
2. Rama `feat/admin-v2` + configurar Vitest/Playwright
3. Ejecutar Fase 0 (quick wins) esta semana
4. Fase 1 (tokens compartidos con SuperAdmin) - **hacer una sola vez para todos los roles**

---

## Estado de implementación (13 nov 2026)

Implementado sobre `Chambeapp_admin_frontend` sin dependencias nuevas, reutilizando la fundación
del plan SuperAdmin (`ds-tokens.css`, tema oscuro, `AdminTable`/`FilterBar`, `ConfirmDialog`,
`Modal`, `EmptyState`).

| Área | Entregado |
|---|---|
| Dashboard | 5 KPIs reales, cola KYC/disputas/tickets con degradación por fuente, feed de auditoría y accesos rápidos |
| Usuarios | sorting, selección, acciones masivas (rol, suspender, CSV), `rowActions`, drawer de detalle y confirmación |
| Verificaciones | cola con prioridad y antigüedad, multiselección para aprobar, filtros y rechazo con mínimo de 10 caracteres |
| Disputas | refactor en 8 archivos (`disputes/`): chat, partes, variables, timeline y veredicto; mismas llamadas API |
| Contratos / Solicitudes / Contenido | filtros, sorting, acciones masivas, confirmaciones y estados vacíos con CTA |
| Estadísticas | periodos 7/30/90/todo, deltas contra ventana previa, export CSV |
| Componentes | `DetailDrawer` accesible y `lib/csv.js` (export sin dependencias) |

**Verificación**: `tsc` sin errores · build OK · suite del panel **79/79** · render de las 13 páginas
de Admin/Soporte/Verificador cubierto por `src/test/pages-roles.test.jsx`.

### Pendientes y límites de API

- `getStatsOverview` no acepta rango de fechas: los KPIs globales se rotulan como tales y los periodos se
  calculan sobre las listas disponibles.
- ~~No existe endpoint de plantillas de veredicto~~ → **cerrado**: `GET /plantillas/` (`disputa_veredicto`),
  editable desde la consola del superadmin; se conserva el fallback local.
- Las acciones masivas disparan N peticiones en paralelo; para selecciones muy grandes conviene un endpoint en lote.
- `DisputesPage` quedó en ~328 líneas (DoD sugería <300) y sigue usando `ChatPanel` de soporte, ya desacoplado.
- Faltan los flujos E2E autenticados de §6.2 (la infraestructura de Playwright ya está montada).