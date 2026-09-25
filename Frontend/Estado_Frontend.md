# Estado_Frontend — verificación doc ↔ código real

**Fecha:** 2026-09-25 · **Método:** lectura directa de `Chambeapp_frontend/src` y `Chambeapp_admin_frontend/src` + `npm test` ejecutado. **Sin edición de código ni ROLE docs.**

**Veredicto global:** ROLE_*.md y COMMON_COMPONENTS.md describen la ARQUITECTURA VIEJA (app única, TSX, `src/components/` plano, RoleShell/ViewSection/Toast propio). El código real es arquitectura NUEVA: 2 apps, cliente con design-system (ui/layout/domain), staff panel aparte en JS+`AppShell` config-driven. Docs de roles → mayormente ✗. Design-system docs → ✓ fiable (52/52 existen).

---

## 1. Estructura real — Cliente PWA (`Chambeapp_frontend/src`)

React 18 + TS + Vite + PWA + react-router 7 + sonner + zustand + socket.io + mapbox-gl.

### 1.1 features/ (16 dominios)
| Feature | Páginas/rutas reales | Notas |
|---|---|---|
| `auth` | LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage | + `lib/roleNav.ts` (homeForRole), `lib/registerDraft.ts`, `hooks/useAuth.ts` |
| `landing` | LandingPage (`/`) | |
| `legal` | TerminosPage, PoliticaDatosPage, AutorizacionKycPage | |
| `solicitante` | SolicitanteHome, PublishSolicitudPage, SolicitudesListPage, SolicitudDetailPage, MisOfertasPage, ContractDetailPage, SolicitanteNegociosPage, SolicitanteNegocioDetallePage, SolChambasListPage, SolMaranaListPage + wrappers legacy (SolicitanteBilletera/Mensajes/PerfilPage) | componentes: CameraCapture, PanoViewer, SweepPanoCapture, panorama/*, Solicitudes/Contracts/PaymentsPanel, LocationPicker, PhotoUploader |
| `pds` | PdsInicioPage, PdsNegociosPage, PdsChambasPage, PdsPostularPage, PdsPortafolioPage, PdsCoinsPage, PdsMaranaPage + legacy no-routeadas (PdsOfertas/PdsContratos/PdsDisputas/PdsBuscar/PdsBilletera/PdsMensajes/PdsPerfil) | `/pds/ofertas` y `/pds/contratos` → redirect a `/pds/chambas` |
| `negocio` | NegocioInicio, MiNegocio, Solicitudes, Verificar, Imagenes, Horarios, Crear, Anuncios | |
| `publico` | NegociosMapaPage (`/negocios`), NegocioDetallePage (`/negocios/:id`), PdsPerfilPublicoPage (`/pds/:id`) | |
| `chamba` | ChambaDetallePage (`/solicitante/chambas/:id`, `/pds/chambas/:id`), ChambaPreviewPage (`/dev/chambas`) | módulo expedientes |
| `marana` | MaranaDetallePage (`/solicitante/maranas/:id`, `/pds/maranas/:id`) | adendas/rebusques |
| `contrato` | ContratoFirmaPage (`/contrato/firmar`) | firma pantalla completa |
| `billetera` | BilleteraPage compartida (roles: solicitante/pds/merchant) | |
| `mensajes` | MensajesPage compartida | chat unificado |
| `perfil` | PerfilPage compartida | acordeones: Billetera/DatosCuenta/KYC/Notificaciones/Preferencias/Seguridad |
| `disputas` | DisputasPage compartida | |
| `anuncios` | AnuncioDetallePage (`/anuncios/:id`) | |
| `dev` | ComponentsGallery (`/dev/components`), MapLab (`/dev/map`) | interno |

### 1.2 components/ (70 componentes reales vs 52 documentados)
- **ui/ (31):** Accordion, Avatar, Badge, Button, Card, Checkbox, Chip, Container, Dropdown, EmptyState, FormField, Icon, Input, LoadingState, Modal, MontoInput, Pagination, Pill, ProgressBar, Radio, RatingStars, Reveal, Select, Sheet, Skeleton, Spinner, Switch, Tabs, Textarea, Toast (wrapper de **sonner**), Tooltip + hook `useFocusTrap`.
- **layout/ (11):** AppShell, AuthBrand, AuthShell, Footer, Hero, LegalShell, PageHeader, SectionTitle, Sidebar, TabBar, Topbar.
- **domain/ (28):** ApplyModal, BeforeAfterSlider, CategoryChip, CategoryGridItem, ChambaCard, ChatBubble, ChatInput, ChatList, ChatListItem, ChatNegociacionCards, ChatShell, ChatThread, ContratoDocumento, DisputeCard, FilterSheet, ImageThumb, JobCard, KycDocRow, MapboxMap, MapPin, MapPlaceholder, OfferCard, ReportModal, ReviewCard, SignaturePad, StatCard, StepCard, StepWizard.

### 1.3 hooks/ y lib/
- hooks: `useAuth` (re-export de features/auth), `useChatUi`, `useMediaQuery`, `useOfferSocket`. **NO existe** `useContractSocket`, `useChatSocket`, `usePagination`.
- lib: `api.ts` (axios único), `contratoFirmas.ts`, `format.ts`, `geocode.ts`, `mensajesChat.ts`, `negociacion.ts`. **NO existe** `solicitudesApi/contractsApi/walletApi/paymentsApi/notificationsApi/portfolioApi/usersApi` como archivos `src/lib/*` → viven en `features/*/services/`.
- config: `navigation.ts` (NAV_SIDEBAR/NAV_TABBAR/NAV_PROFILE por rol + `homePathForRole`).
- routes.tsx: ~55 rutas declaradas, 9 redirecciones (`/dashboard`, `/pds/buscar|disputas|ofertas|contratos`, `/solicitante/contratos|pagos`, `/negocio/contratos|pagos`).

## 2. Estructura real — Admin (`Chambeapp_admin_frontend/src`)

React 18 + Vite + **JS/JSX** (sin TS). Mismo patrón: `AppShell` config-driven.

- **app/routes.jsx** — 23 rutas, guards `gate(roles, el)` = RequireAuth+RequireRole+Suspense:
  - `/login`
  - Verificador: `/verificador`, `/verificador/kyc`
  - Soporte: `/soporte`, `/soporte/tickets`
  - Admin: `/admin`, `/admin/estadisticas|usuarios|verificaciones|kyc|solicitudes|contratos|disputas|tickets|contenido`
  - Superadmin: `/superadmin`, `/superadmin/admins|config|auditoria|overrides|legal|ia|flags`
- **features/**: `admin/` (8 páginas), `superadmin/` (8), `verificador/` (2: VerificadorHome, KycReviewPage), `soporte/` (2: SoporteHome, TicketsPage), `auth/LoginPage.jsx`, `staff/` (compartido: components/AdminTable+FilterBar+StatusBadge, services/adminApi+kycApi+superadminApi, lib/labels).
- **components/ui/ (15):** Button, Input, Select, Textarea, FormField, Card, Badge, Chip, EmptyState, LoadingState, Spinner, Modal, Switch, Container, Pagination. **components/layout/ (2):** AppShell, PageHeader.
- **context/AuthContext.jsx:** STAFF_ROLES=[verificador,soporte,admin,superadmin], ROLE_HOME, login/logout/refreshUser, tokens en localStorage.
- **lib/:** api.js, format.js. **config/navigation.js:** NAV_SIDEBAR/NAV_TABBAR por rol staff.
- Toast = `sonner` directo (`toast.*` en páginas; `<Toaster/>` en App.jsx). StatCard = local en AdminHome.jsx / VerificadorHome.jsx (no componente compartido).

---

## 3. Matriz de divergencias: docs → realidad

### 3.1 ROLE_PDS.md / ROLE_SOLICITANTE.md (describen app única vieja)
| Doc dice | Realidad | Veredicto |
|---|---|---|
| Layout `RoleShell` + `RoleBottomNav` + `Header.tsx` | `AppShell` + `Sidebar`/`Topbar`/`TabBar` desde `config/navigation.ts` | ✗ renombrado/eliminado |
| Tabs desde `lib/roleNav.tsx` | tabs en `config/navigation.ts`; `roleNav.ts` solo da homeForRole | ✗ |
| `PdsHome.tsx` / `SolicitanteHome.tsx` | `pds/components/PdsInicioPage.tsx` / `solicitante/SolicitanteHome.tsx` | PDS ✗ renombrado · SOL ✓ |
| `ViewSection` | no existe → sustituto: `SectionTitle` | ✗ eliminado |
| `StatCard` en `src/components/StatCard.tsx` | existe en `components/domain/StatCard.tsx` | ✓ movido |
| `Toast` en `src/components/Toast.tsx` propio | `components/ui/Toast.tsx` = wrapper sonner | ✓ movido, impl cambiada |
| `TrustScore`, `TrustBreakdown`, `BadgePanel`, `features/trust`, `features/badges` | no existen | ✗ eliminados |
| `SolicitudesForProvider`, `RecommendationsList`, `features/match` | no existen | ✗ eliminados |
| `MapView` | `components/domain/MapboxMap.tsx` (+MapPlaceholder) | ✗ renombrado |
| `ChatButton`, `features/chat` | no existe; chat = `features/mensajes` + ChatShell/ChatThread | ✗ eliminado |
| `RatingForm` | no existe; rating = `RatingStars` + `chamba/components/RatingCard.tsx` | ✗ renombrado |
| `Viewer360` | `solicitante/components/PanoViewer.tsx` (photo-sphere-viewer) | ✗ renombrado |
| `PortfolioUploader/Gallery`, `features/portfolio` | `PdsPortafolioPage` + `PhotoUploader` | ✗ renombrado |
| `useContractSocket` | no existe | ✗ |
| `useOfferSocket` en `src/hooks/` | existe, misma ruta | ✓ |
| APIs `src/lib/solicitudesApi.ts`, `contractsApi`, `walletApi`, `paymentsApi`, `usersApi`, `portfolioApi`, `notificationsApi`, `coinsApi` | no existen como lib/ → `features/*/services/` (pdsApi, solicitanteApi, chambaApi, billetera hooks, etc.) | ✗ reorganizado |
| Rutas `/pds/solicitudes/:id`, `/pds/ofertas`, `/pds/contratos`, `/payments/checkout` | `/pds/chambas/:id`; ofertas/contratos = hub `ChambaDetallePage`/tabs; checkout no existe (pagos = tab + BilleteraPage) | ✗ |
| features viejos: `services`, `contracts`, `wallet`, `profile`, `disputes`, `solicitudes`, `dashboard` | renombrados: `solicitante`, `contrato`, `billetera`, `perfil`, `disputas`; dashboard ELIMINADO (`/dashboard`→redirect) | ✗ |
| No menciona: chamba, marana, coins, anuncios, negocio, publico, dev, contrato/firmar | existen y son el flujo actual | ✗ doc incompleto |

### 3.2 ROLE_ADMIN.md / ROLE_SUPERADMIN.md / ROLE_VERIFICADOR.md / ROLE_SOPORTE.md
| Doc dice | Realidad | Veredicto |
|---|---|---|
| `AdminLayout.tsx` / `SuperadminLayout.tsx` (TSX, duplicados) | no existen → `components/layout/AppShell.jsx` único config-driven (JS) | ✗ eliminado/unificado |
| Archivos `.tsx` (`UsersPage.tsx`, `StatsPage.tsx`…) | existen pero `.jsx` | ✓ con rename |
| `KycReviewPage.tsx` en `features/admin/` | `features/verificador/KycReviewPage.jsx` (reusada en `/admin/kyc`) | ✓ movida |
| `TicketsPage.tsx` en `features/admin/` | `features/soporte/TicketsPage.jsx` (reusada en `/admin/tickets`) | ✓ movida |
| `StatCard` compartido | StatCard local en AdminHome.jsx + `StatsGrid`; StatCardLocal en VerificadorHome | ✗ no compartido |
| `Toast` componente propio | sonner directo | ✗ impl cambiada |
| `Avatar` componente | no existe en admin; initials inline en AppShell (`ch-avatar`) | ✗ |
| `EmptyState`, `PageHeader`, `Button`, `Container` | existen (admin ui/layout) | ✓ |
| Tabla inline `admin-table` repetida en 4 páginas | abstraída a `staff/components/AdminTable.jsx` + FilterBar + StatusBadge | ✗ doc desactualizado (mejora) |
| Nav admin: 8 items (usuarios…estadisticas) | real = esos 8 + `/admin` inicio + `/admin/contratos` | ✓ casi (faltan 2 en doc) |
| Nav superadmin: 6 items | real = 6 + `/superadmin/overrides` | ✗ falta overrides en doc |
| ROLE_VERIFICADOR tabs `/verificador/mensajes`, `/verificador/perfil` | NO existen rutas staff de mensajes/perfil en admin | ✗ |
| ROLE_SOPORTE tab `/soporte/perfil` | no existe | ✗ |
| `useAuth` en `src/hooks/` | admin: `context/AuthContext.jsx`; cliente: `hooks/useAuth.ts` | ✓ concepto, ✗ ruta |
| `types/admin.ts` | existe SOLO en cliente (`src/types/admin.ts`); admin frontend es JS sin tipos | ✓ parcial |

### 3.3 COMMON_COMPONENTS.md (raíz)
Describen app vieja. NO existen: `Header.tsx`, `BottomNav`, `RoleShell`, `RoleBottomNav`, `ViewSection`, `MapView`, `Viewer360`, `BadgeGrid`, `IconButton`, `NotificationBell`, `InstallPrompt`, `FeatureCard`, `Section.tsx`, `ProtectedLayout`, `RequireRole` en `src/components/` (existe en admin `guards/`), `DashboardPage`, `useContractSocket`, `useChatSocket`, `usePagination`, `toast` propio sin librería. SI existen (con ruta nueva): Button/Card/Input/Avatar/StatCard/Pagination/Container/Footer/Hero/AuthShell/AuthBrand/LegalShell/Reveal/StepCard/`formatCOP`/`useOfferSocket`/`homeForRole`→`homePathForRole`. Secciones 5.x (duplicaciones) obsoletas: archivos citados eliminados.

### 3.4 docs/design-system/02-componentes.md (52 inventariados)
**Fiable.** 52/52 existen (único rename: `DropdownMenu`→`Dropdown.tsx`). El doc se queda CORTO: 18 componentes reales no inventariados (Accordion, MontoInput, Reveal, ChatThread, ChatNegociacionCards, ContratoDocumento, SignaturePad, BeforeAfterSlider, ApplyModal, MapboxMap, MapPlaceholder, CategoryGridItem, AuthShell, AuthBrand, LegalShell, Hero, LoadingState, useFocusTrap). Divergencia = deuda de doc, no de código.

---

## 4. Navegación por rol: real vs ROLE docs

**Cliente (config/navigation.ts, real):**
- PDS sidebar: Inicio `/pds`, Negocios, Chambas, Portafolio | Billetera | Mensajes, Perfil. Tabbar: Inicio, Negocios, Chambas, Billetera, Mensajes (Perfil→avatar topbar).
- Solicitante sidebar: Inicio, Negocios, Solicitudes | Billetera | Mensajes | Perfil. Tabbar: Inicio, Negocios, Solicitudes, Billetera, Mensajes.
- Merchant: Inicio, Mi Negocio, Solicitudes, Anuncios, Mensajes, Perfil | Billetera. Tabbar: 5.
- verificador/soporte/admin/superadmin: **placeholders** (1 item "Inicio" → rutas inexistentes en cliente). El UI real de staff vive en el admin frontend.

**Docs:** tabbar PDS con Ofertas/Buscar/Perfil ✗; tabbar SOL con Ofertas/Perfil ✗; no documentan Negocios/Chambas/Billetera como tabs ni el patrón config-driven; no documentan merchant.

**Admin (config/navigation.js, real):** verificador [Inicio, KYC]; soporte [Inicio, Tickets]; admin [Inicio, Usuarios, Verificaciones, KYC | Solicitudes, Contratos, Disputas, Tickets, Contenido | Estadísticas]; superadmin [Inicio, Admins, Overrides | Config, IA, Flags | Auditoría, Legal]. Docs ROLE_* coinciden en labels/iconos pero fallan en rutas extras (mensajes/perfil staff) y omiten Inicio/Contratos/Overrides.

---

## 5. Estado de tests

**Cliente:** scripts `test` (vitest run), `test:watch`, `typecheck`. **43 archivos `.test.*`** (unitarios junto al código + `src/test/`). Ejecutado 2026-09-25: **43 archivos ✓, 385 tests ✓, 0 fallos** (~33s). Cobertura: design-system (tokens, states, smoke-views, class-integrity, contraste), ui (Modal/Card/Button/Icon/Dropdown/Accordion/MontoInput), domain (ChatThread, ChatNegociacionCards, MapboxMap), layouts (PageHeader), config/navigation, hooks (useChatUi), lib (geocode, mensajesChat, negociacion), páginas core (Billetera, Disputas, Mensajes, Perfil, PdsPerfil, PdsPortafolio, ContratoFirma, Solicitante wrappers, publico, chamba, marana, auth registerDraft, panorama).

**Admin:** scripts `test`/`test:watch` (vitest) + `@playwright/test` en devDeps, config vitest en vite.config.js — pero **0 archivos de test en src/**. Sin cobertura. Brecha real.

---

## 6. Deuda de documentación (resumen accionable)

> Estado 2026-09-25: los docs obsoletos de la raíz (ROLE_*.md, COMMON_COMPONENTS.md)
> fueron consolidados en `Requerimientos/Roles_y_UI.md` y eliminados; `HOJA_DE_TESTS.md`
> se migró a `Arquitectura/Hoja_De_Tests.md`. Lo que queda accionable:

1. **ROLE_PDS/SOLICITANTE (consolidados en Roles_y_UI.md):** al reescribir los perfiles,
   usar `routes.tsx` + `navigation.ts` + features actuales (chamba, marana, coins, negocio,
   publico, anuncios, dev).
2. **Roles staff (consolidados en Roles_y_UI.md):** reflejar `Chambeapp_admin_frontend` en
   JSX con AppShell unificado, AdminTable/FilterBar/StatusBadge y sonner; incluir
   `/admin/contratos`, `/superadmin/overrides`, guards RequireAuth/RequireRole.
3. **COMMON_COMPONENTS.md:** superado por el design-system (`Branding/DesignSystem/`) y
   este documento.
4. **Hoja_De_Tests.md (migrada):** dice 140 tests/8 archivos; real 385/43. Verificar
   vigencia de BUG #1 (Modal aria-hidden) y HALLAZGO #2 (publico sin loading states) al revisar.
5. **02-componentes.md:** añadir los 18 componentes post-inventario o declarar el doc como
   snapshot de migración.
6. **Admin frontend sin tests** → deuda de calidad (no de doc): priorizar tests de guards,
   AuthContext y AdminTable.
