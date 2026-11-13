# 🛠️ Plan de Implementación — Mejora UX/UI del Panel Soporte

**Proyecto:** ChambeApp · `Chambeapp_admin_frontend`
**Rol:** Soporte (tickets, chats, disputas, mediación)
**Páginas:** 4 (Home, Tickets, Chats, Disputas) + ChatPanel compartido
**Versión:** 1.0 | **Fecha:** 13 noviembre 2026 | **Duración:** 5 semanas

---

## 1. Resumen ejecutivo

**Soporte** es el rol más **conversacional y reactivo**: gestiona tickets, media en disputas, chatea con usuarios. Su UI actual tiene **dos caras**: el Home y Tickets usan patrones admin estándar (tablas, filtros), pero **ChatPanel y DisputeChat son componentes "chat-first" únicos** con WebSocket, composer, transcripts. La deuda principal es **acoplamiento** (Disputas de Admin importa ChatPanel de Soporte) y **ausencia de keyboard shortcuts** en un rol que vive en el teclado.

**Diferencia clave:** Soporte *resuelve conversaciones*. La UI debe optimizar para **contexto rápido + respuesta rápida + historial trazable**.

| Indicador | Hoy | Meta (5 sem) |
|---|---|---|
| Tiempo "primera respuesta ticket" | ~4 min | < 90 s |
| Tickets resueltos/hora | ~8 | > 15 |
| Contexto perdido al cambiar ticket | Frecuente | 0% |
| Atajos teclado (responder, cambiar, cerrar) | 0 | 8+ |
| Accesibilidad chat (lector pantalla) | ~40% | 100% AA |

---

## 2. Diagnóstico por categoría

### 2.1 Arquitectura y acoplamiento — 🔴 Crítica

| # | Hallazgo | Evidencia |
|---|---|---|
| SA1 | **DisputesPage (Admin) importa ChatPanel de Soporte** — acoplamiento cruzado roles | `DisputesPage.jsx:14` |
| SA2 | **ChatPanel usado en 3 contextos** (Tickets chat, Disputa chat usuarios, Disputa chat soporte) sin props de configuración | `ChatPanel.jsx`, `DisputesPage.jsx:112-218`, `DisputesPage.jsx:220-249` |
| SA3 | **createConversation duplicado** en DisputesPage (línea 13) y TicketsPage (no visible) | `DisputesPage.jsx:13` |
| SA4 | **TicketDetailView + ChatPanel + DisputeUserChat** = 3 patrones distintos para "ver conversación" | `TicketDetailView.jsx`, `ChatPanel.jsx`, `DisputesPage.jsx:112` |

### 2.2 ChatPanel — 🔴 Alta (componente core)

| # | Hallazgo | Evidencia |
|---|---|---|
| SC1 | **ChatPanel.jsx + ChatPanel.css** — 2 archivos, pero lógica de transcript, composer, WebSocket todo acoplado | `features/soporte/ChatPanel.jsx` |
| SC2 | **Sin virtualización de mensajes** — renderiza todo el historial | `ChatPanel.jsx` |
| SC3 | **Composer sin atajos** — `Enter` envía, `Shift+Enter` nueva línea (estándar), pero sin `/comandos` | `ChatPanel.jsx` |
| SC4 | **Mensajes de soporte vs usuario** solo difieren en clase CSS (`is-support`) — sin badge ARIA | `ChatPanel.jsx` / `TicketDetailView.css` |
| SC5 | **Adjuntos: render inline sin preview** — click abre nueva pestaña, sin modal | `TicketDetailView.jsx:1880-1887` |

### 2.3 TicketsPage — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| ST1 | **Click fila → navega a TicketDetailView (nueva ruta)** — pierde estado de filtros al volver | `TicketsPage.jsx:230` |
| ST2 | **Sin "Vista previa" hover** — hay que entrar al ticket para ver asunto completo | `TicketsPage.jsx:120-141` |
| ST3 | **Filtros básicos** — sin date range, sin "asignado a mí", sin "sin respuesta > 24h" | `TicketsPage.jsx:205-218` |
| ST4 | **Columnas fijas** — sin resize, sin reordenar, sin "mostrar/ocultar" | `TicketsPage.jsx:120-182` |

### 2.4 ChatsPage — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| SC6 | **ChatsPage.jsx + ChatsPage.css** — lista de conversaciones recientes, pero sin búsqueda ni filtros | `ChatsPage.jsx` (no leído, inferido por patrón) |
| SC7 | **Sin "Conversación activa" persistente** — al cambiar de tab se pierde | — |

### 2.5 Disputas (vista Soporte) — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| SD1 | **Disputas en SoporteHome → navega a `/soporte/disputas`** — pero esa ruta usa AdminDisputes? | `SoporteHome.jsx:228` |
| SD2 | **Chat entre usuarios en disputa** — renderizado en `DisputeUserChat` (Admin) duplicado | `DisputesPage.jsx:112-218` |

### 2.6 Accesibilidad — 🔴 Alta

| # | Hallazgo | Evidencia |
|---|---|---|
| SA5 | **Chat transcript: `div` sin `role="log" aria-live="polite"`** — lector pantalla no anuncia mensajes nuevos | `ChatPanel.jsx`, `TicketDetailView.jsx` |
| SA6 | **Composer: `input` sin `aria-label` descriptivo** | `ChatPanel.jsx` |
| SA7 | **Badges prioridad/estado solo color** — sin icono ni texto para daltónicos | `StatusBadge` usado en Tickets |
| SA8 | **Focus trap en TicketDetailView** — al abrir, foco no va al composer | `TicketsPage.jsx:186-191` |

### 2.7 UX Writing y flujos — 🟠 Media

| # | Hallazgo | Evidencia |
|---|---|---|
| SU1 | **Plantillas de respuesta (canned responses) hardcodeadas** — no existen | — |
| SU2 | **Macros/atajos** — `/close`, `/assign @user`, `/priority high` no implementados | — |
| SU3 | **Estado "Sin chat" en tickets** — botón "Abrir chat" crea conversación, pero UX confusa | `TicketsPage.jsx:166-179` |
| SU4 | **SoporteHome: "Tickets recientes" botón "Gestionar" va a Tickets sin filtro** — pierde contexto | `SoporteHome.jsx:254` |

---

## 3. Dirección de diseño — *Conversation Command Center*

| Atributo | Decisión |
|---|---|
| **Modo** | **Operate** — conversación reactiva, contexto rápido, teclado primero |
| **Estilo** | **Data-Dense Dashboard** + **Chat-First** (split view persistente) |
| **Densidad** | `VISUAL_DENSITY: 7` — lista tickets/chat densa, panel detalle amplio |
| **Varianza** | `DESIGN_VARIANCE: 3` — predecible |
| **Movimiento** | `MOTION_INTENSITY: 4` — mensajes new slide-in, focus transitions |
| **Acento** | **Azul `#3B82F6`** (soporte), **Verde `#22C55E`** (resuelto), **Ámbar `#F59E0B`** (pendiente), **Rojo `#EF4444`** (urgente) |

### Layout objetivo (Desktop ≥ 1024px) — **Master-Detail Persistente**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔍 Buscar tickets...  [Estado ▼] [Prioridad ▼] [Asignado ▼] [Fecha ▼]     │  ← FilterBar
│  Mostrando 23 de 147                                    [Guardar vista]     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐ ┌───────────────────────────────────┐ │
│  │  LISTA TICKETS (virtualizada)   │ │  DETALLE TICKET + CHAT (sticky)   │ │  ← 40/60 split
│  │  ┌───────────────────────────┐  │ │  ┌─────────────────────────────┐  │ │
│  │  │ #1245  🔴 Urgente         │  │ │  │  Ticket #1245               │  │ │
│  │  │ "Error pago" · Juan · 10m  │──│→ │  │  🔴 Urgente · Abierto      │  │ │
│  │  └───────────────────────────┘  │ │  │  Asignado: Tú              │  │ │
│  │  ┌───────────────────────────┐  │ │  ├─────────────────────────────┤  │ │
│  │  │ #1244  🟡 Alta            │  │ │  │  CHAT (virtualizado, live)  │  │ │
│  │  │ "Login falla" · María · 1h │  │ │  │  ┌─────────────────────┐   │  │ │
│  │  └───────────────────────────┘  │ │  │  │ Juan 10:30: Error... │   │  │ │
│  │  ... (scroll)                   │ │  │  │ Tú   10:31: Revisando │   │  │ │
│  └─────────────────────────────────┘ │  │  │  Juan 10:32: Gracias  │   │  │ │
│                                     │ │  │  └─────────────────────┘   │  │ │
│                                     │ │  ├─────────────────────────────┤  │ │
│                                     │ │  │  [Responder...]  [📎] [⌘Enter]│  │ │
│                                     │ │  │  /close  /assign  /prio    │  │ │
│                                     │ │  └─────────────────────────────┘  │ │
│                                     │ └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Mobile (≤ 768px):** Tabbar inferior + swipe horizontal entre Lista ↔ Detalle, o tabs "Cola / Activo"

---

## Fase 0 — Quick wins (Semana 0)

| ID | Acción | Esfuerzo |
|---|---|---|
| QW-S1 | `role="log" aria-live="polite"` en transcript de ChatPanel + TicketDetailView | 15 min |
| QW-S2 | `aria-label="Responder ticket #1245"` en composer input | 10 min |
| QW-S3 | Badge prioridad: añadir icono (exclamación/relámpago) + texto para daltónicos | 20 min |
| QW-S4 | Focus trap: al abrir TicketDetail, foco al composer | 15 min |
| QW-S5 | Botón "Abrir chat" en tickets → label "Iniciar conversación con usuario" | 10 min |
| QW-S6 | SoporteHome "Gestionar" → deep link con filtro `?status=open&priority=high` | 15 min |

---

## Fase 1 — Fundación compartida (Semana 1)

*Compartida con Admin/Verificador (Fase 1 plan Admin).*

- [ ] **F1.1** `ds-tokens.css` + `ThemeProvider`
- [ ] **F1.2** Phosphor Icons (reemplazar Lucide en SoporteHome, Tickets, Chats)
- [ ] **F1.3** TanStack Query v5 — migrar `listTickets`, `listDisputas`
- [ ] **F1.4** `useRealtime` hook unificado (WS único en AppShell)
- [ ] **F1.5** **Extraer `SharedChatComponents`** — package interno `packages/chat-components/`

---

## Fase 2 — Componentes core Chat (Semanas 1-2)

### 2.1 SharedChatComponents (nuevo package interno)

```
packages/chat-components/
├── src/
│   ├── Transcript/          # Virtualized message list + ARIA live
│   │   ├── Transcript.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── SystemMessage.jsx
│   │   └── AttachmentPreview.jsx
│   ├── Composer/            # Input + slash commands + attachments
│   │   ├── Composer.jsx
│   │   ├── SlashCommands.jsx
│   │   └── AttachButton.jsx
│   ├── ChatHeader/          # Participant info + actions
│   │   └── ChatHeader.jsx
│   ├── ChatLayout/          # Split view (list + detail) / Mobile tabs
│   │   ├── ChatSplitView.jsx
│   │   └── ChatMobileTabs.jsx
│   └── hooks/
│       ├── useChat.ts       # WS + messages + optimistic send
│       ├── useTranscript.ts # Virtualization + scroll management
│       └── useSlashCommands.ts
├── package.json
└── tsconfig.json
```

- [ ] **F2.1** Crear package `chat-components` en monorepo (o carpeta `src/shared/chat`)
- [ ] **F2.2** `Transcript` con `@tanstack/react-virtual` + `aria-live="polite"`
- [ ] **F2.3** `Composer` con slash commands: `/close`, `/assign @user`, `/prio high|normal|low`, `/template nombre`
- [ ] **F2.4** `MessageBubble` variantes: `user`, `support`, `system`, `attachment`
- [ ] **F2.5** `AttachmentPreview` modal (imagen/PDF) con zoom

### 2.2 DataTable Pro para Tickets (migración AdminTable)

- [ ] **F2.6** `TicketsDataTable` con: columnas redimensionables, sticky header, row selection, bulk actions
- [ ] **F2.7** `FilterBarPro` tickets: date range, "asignado a mí", "sin respuesta > 24h", "mis tickets"
- [ ] **F2.8** `DetailDrawer` (reemplaza TicketDetailView ruta) — slide-in right, persist filtros

### 2.4 ChatLayout (Split View)

- [ ] **F2.9** `ChatSplitView` — resizable panel (40/60 default), persist width en localStorage
- [ ] **F2.10** Mobile: `ChatMobileTabs` — tabs "Cola / Activo" con swipe
- [ ] **F2.11** Keyboard: `Ctrl+1` = lista, `Ctrl+2` = detalle, `Esc` = cerrar detalle

---

## Fase 3 — Rediseño de páginas (Semanas 2-4)

### 3.1 SoporteHome → Command Center

- [ ] **F3.1** KPI row: Activos, Sin asignar, Alta prioridad, Disputas, Cerrados hoy
- [ ] **F3.2** "Action queue" unificada: tickets sin asignar + disputas abiertas + tickets > 24h sin respuesta
- [ ] **F3.3** Quick actions: "Nuevo ticket", "Ver cola", "Mis asignados"
- [ ] **F3.4** Eliminar polling/WS local → `useRealtime` global

### 3.2 TicketsPage → Master-Detail

```
features/soporte/
├── TicketsPage.jsx              (shell: FilterBar + ChatSplitView)
├── components/
│   ├── TicketsDataTable.jsx
│   ├── TicketDetailDrawer.jsx   (reemplaza TicketDetailView)
│   ├── TicketHeader.jsx
│   ├── TicketTranscript.jsx     (usa SharedChatComponents)
│   ├── TicketComposer.jsx       (usa SharedChatComponents + slash)
│   └── TicketSidebar.jsx        (metadatos, acciones, plantillas)
```

- [ ] **F3.5** `TicketsDataTable` + `ChatSplitView` (master-detail persistente)
- [ ] **F3.6** `TicketDetailDrawer`: header (asunto, prioridad, estado, asignado), transcript, composer, sidebar (metadatos, plantillas, acciones)
- [ ] **F3.7** Slash commands en composer: `/close`, `/assign`, `/prio`, `/template`
- [ ] **F3.8** Plantillas de respuesta (canned responses) — CRUD en Config Admin, sync a Soporte
- [ ] **F3.9** "Vista previa" hover en fila → tooltip con primer mensaje + usuario
- [ ] **F3.10** Filtros avanzados guardados como "Mis vistas" (URL + localStorage)

### 3.3 ChatsPage → Conversation List

- [ ] **F3.11** `ChatsDataTable` — columnas: Usuario, Último mensaje, Tiempo, Estado, Acciones
- [ ] **F3.12** Click → abre en `ChatSplitView` (mismo layout que Tickets)
- [ ] **F3.13** Filtros: "Activas", "Esperando respuesta", "Cerradas hoy", "Con adjuntos"

### 3.4 Disputas (vista Soporte) → Unificar con Admin

- [ ] **F3.14** **Decisión de arquitectura**: ¿Soporte tiene su propia vista de disputas o usa la de Admin?
    - **Opción A (recomendada)**: Soporte usa `AdminDisputesPage` embedido en su shell (iframe o micro-frontend)
    - **Opción B**: Vista ligera solo para "Disputas abiertas en mi región" → link a Admin para veredicto
- [ ] **F3.15** Si Opción B: `SoporteDisputasPage` — tabla compacta + link "Resolver en Admin"

### 3.5 ChatPanel → Deprecar

- [ ] **F3.16** Migrar todos los usos a `SharedChatComponents`:
    - `TicketsPage` → `TicketTranscript` + `TicketComposer`
    - `DisputesPage (Admin)` → `DisputeTranscript` + `DisputeComposer` (wrappers)
    - `ChatsPage` → `ChatSplitView` + `ChatTranscript` + `ChatComposer`
- [ ] **F3.17** Eliminar `ChatPanel.jsx`, `ChatPanel.css`, `TicketDetailView.jsx`, `TicketDetailView.css`

---

## Fase 4 — Movimiento y pulido (Semana 4)

- [ ] **F4.1** Message entrance: `slide-up + fade` 150ms stagger (nuevos mensajes)
- [ ] **F4.2** Composer focus: `border-color` transition 120ms
- [ ] **F4.3** Slash command menu: `fade + scale(0.96)` 100ms
- [ ] **F4.4** Drawer enter/exit: `translateX` 200ms ease-out/in
- [ ] **F4.5** Reduced-motion: desactiva slide-in mensajes, mantiene color "nuevo"

---

## Fase 5 — Hardening (Semana 5)

### 5.1 Testing

- [ ] **F5.1** Vitest: SharedChatComponents (Transcript, Composer, SlashCommands)
- [ ] **F5.2** Playwright 6 flujos E2E

### 5.2 Flujos E2E obligatorios (Soporte)

1. Login → Tickets → Filtrar "sin asignar" → Click fila → Drawer abre → Responder con `/template bienvenida` → Enviar (`Ctrl+Enter`) → Cerrar (`/close`)
2. Tickets → Buscar "pago" → Seleccionar 3 → Bulk "Asignar a mí" → Ver badge "Tú" en filas
3. Chat activo → Usuario escribe → Mensaje aparece en transcript (aria-live) sin recargar
4. Mobile → Tabbar "Tickets" → Swipe → Detalle → Composer → Enviar → Swipe back → Lista
5. Disputa (si Opción B) → SoporteHome → "Disputas abiertas" → Link abre Admin con deep link
6. Atajos: `Ctrl+1` (lista), `Ctrl+2` (detalle), `/` (focus search), `Esc` (cerrar drawer)

### 5.3 Performance

- [ ] **F5.3** Transcript 500 mensajes virtualizados, scroll 60fps
- [ ] **F5.4** Drawer open < 60ms, composer focus < 30ms
- [ ] **F5.5** Lighthouse móvil > 90, axe 0 violations (especialmente chat ARIA)

### 5.4 Docs

- [ ] **F5.6** Storybook: SharedChatComponents (Transcript, Composer, MessageBubble, SlashCommands)
- [ ] **F5.7** Guía: "Slash commands para soporte" + "Cómo crear plantillas"
- [ ] **F5.8** ADR: extracción SharedChatComponents, deprecación ChatPanel

---

## Riesgos específicos Soporte

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| SharedChatComponents requiere coordinación Admin ↔ Soporte | Alta | Alto | **Hacer primero** (Fase 2.1) antes de tocar páginas; demo a ambos equipos |
| Slash commands chocan con atajos navegador (`/`) | Media | Medio | Usar `Cmd+/` para focus search; `/` solo en composer enfocado |
| WebSocket reconexión + React Query cache = duplicados | Media | Alto | `useRealtime` maneja dedup por `messageId`; test de red inestable |
| AdminDisputesPage embedido en Soporte (Opción A) = CORS/iframe issues | Baja | Alto | Preferir Opción B (link profundo) salvo requisito fuerte de "una sola app" |

---

## Definition of Done (Soporte)

- [ ] `SharedChatComponents` package publicado internamente, 3 consumidores migrados
- [ ] TicketsPage: master-detail persistente, 0 navegaciones que pierdan filtros
- [ ] 8+ slash commands funcionando en composer
- [ ] Plantillas de respuesta CRUD (Admin) → sync automático a Soporte
- [ ] Chat ARIA: `role="log" aria-live="polite"`, `aria-label` en composer, focus management
- [ ] 6 flujos E2E verdes
- [ ] `ChatPanel`, `TicketDetailView` eliminados
- [ ] Storybook: SharedChatComponents completo

---

## Próximos pasos

1. **Aprobar plan** - decisión crítica: **Opción A vs B para Disputas en Soporte**
2. **Crear `SharedChatComponents` PRIMERO** (Semana 1) - bloquea todo lo demás
3. Rama `feat/soporte-v2` + `packages/chat-components`
4. Fase 0 (quick wins) esta semana
5. Fase 1 compartida con Admin/Verificador (tokens, React Query, WS unificado)

---

## Estado de implementación (13 nov 2026)

Implementado sin dependencias nuevas. Los componentes de chat ahora viven en
`src/features/soporte/components/` y `ChatPanel` quedó como wrapper fino (la clase `.ch-chat-panel`
se conserva porque Admin y `globals.css` dependen de ella).

| Área | Entregado |
|---|---|
| Componentes de chat | `ChatTranscript`, `MessageBubble`, `AttachmentPreview`, `ChatComposer`, `ChatHeader`, `ChatThread`, `ConversationList`, `ContextPanel`, `SplitWorkspace` + helpers (`chatContent`, `tickets`) y hooks (`useChatThread`, `useWorkspaceShortcuts`) |
| Chats | master-detail con `?chat=` (normaliza el legacy `?conversation=`), `?filter=`, polling y socket intactos, foco al detalle, Escape y "volver" en móvil |
| Tickets | `FilterBar` + `AdminTable` a la izquierda, panel de detalle a la derecha, filtros en la URL (`status`, `priority`, `assigned`, `q`, `ticket`) |
| Command Center | KPIs (activos, sin asignar, alta prioridad, chats, disputas, cerrados hoy), "siguiente" caso, cola unificada, distribución y esperas |
| Disputas | la vista de Admin sirve ambas rutas (el backend permite `soporte`); se eliminó la vista duplicada para tener una sola implementación |
| A11y | `role="log"` + `aria-live` en mensajes, `aria-activedescendant` en el menú de comandos, confirmaciones en cerrar/resolver, atajos `Ctrl+1/2`, `/`, `Esc` |

**Verificación**: `tsc` sin errores · build OK · **18/18** pruebas de componentes de chat · render de las
páginas de soporte cubierto por `src/test/pages-roles.test.jsx`.

### Pendientes y límites de API

- ~~Sin endpoint de creación de tickets~~ → **cerrado**: `POST /tickets/` acepta `user_id`, así que soporte
  crea tickets a nombre del usuario desde el modal **Nuevo ticket**.
- ~~Plantillas de respuesta locales~~ → **cerrado**: `GET /plantillas/` (`ticket_respuesta`), editables por
  el superadmin; la UI conserva el fallback local.
- `first_response_at`/`last_reply_at` no existen: la espera se calcula con `updated_at ?? created_at`.
- Filtros "chat cerrada" y "con adjuntos" se omitieron: el payload de conversación no los expone.
- Resizable 40/60 persistido y virtualización del transcript quedan para cuando se acepten dependencias
  (`@tanstack/react-virtual`) o se escriba un resizer propio.
- Faltan los flujos E2E autenticados de §5.2 (la infraestructura de Playwright ya está montada).