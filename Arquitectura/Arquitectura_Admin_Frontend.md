# Arquitectura Admin Frontend — ChambeApp v1.0

> App separada del PWA público. Solo staff (`verificador`, `soporte`, `admin`, `superadmin`). Consume el backend vía `/api/v1`. Sin TypeScript: estado de sesión en `AuthContext` + `localStorage`.
> Complementa a `Arquitectura_Software.md` (PWA + API Flask). No describe el PWA de proveedores/solicitantes.

---

## 1. Visión de Alto Nivel

Aplicación SPA independiente (`chambeapp-admin-frontend`) para operación interna: revisión KYC, tickets de soporte, moderación (usuarios, solicitudes, contratos, disputas, contenido), estadística y gobierno del sistema (admins, config, auditoría, overrides, legal, IA, flags).

```
┌──────────────────────────────────────────────┐
│  Admin SPA (React 18 + Vite 6 + JS)           │
│  AppShell (Sidebar + Topbar + TabBar móvil)   │
│  NAV_SIDEBAR / NAV_TABBAR (config-driven)     │
└───────────────────┬──────────────────────────┘
                    │ guards por ruta
┌───────────────────▼──────────────────────────┐
│  Guards                                       │
│  RequireAuth → RequireRole(roles)             │
│  gate() + withAuth() + lazy/Suspense          │
└───────────────────┬──────────────────────────┘
                    │ render por rol
┌───────────────────▼──────────────────────────┐
│  Features (páginas por rol)                   │
│  verificador · soporte · admin · superadmin   │
│  auth (LoginPage pública)                     │
└───────────────────┬──────────────────────────┘
                    │ servicios JS
┌───────────────────▼──────────────────────────┐
│  Services                                     │
│  adminApi · kycApi · superadminApi            │
│  AuthContext (login/me) · lib/api.js          │
└───────────────────┬──────────────────────────┘
                    │ HTTPS / REST (JSON)
┌───────────────────▼──────────────────────────┐
│  API Flask `/api/v1`                          │
│  /admin · /kyc · /superadmin · /auth          │
│  Bearer JWT + refresh (`/auth/refresh`)       │
└──────────────────────────────────────────────┘
```

Reglas:

- Los roles base (`pds` / `solicitante` / `merchant`) **no** tienen panel aquí (`src/config/navigation.js`).
- Toda ruta funcional pasa por `RequireAuth`; cada namespace pasa además por `RequireRole` con su lista de roles.
- El frontend no implementa scoping regional: lo aplica el backend (ver §10).

---

## 2. Tecnologías por Capa

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| UI | React 18 + JS (sin TS) | SPA del panel staff |
| Bundler | Vite 6 | Dev + build (`dev`, `build`, `preview`) |
| Enrutado | react-router-dom 7 | Rutas por rol + `RootRedirect` (`homeForRole`) |
| HTTP client | axios 1.7 | `src/lib/api.js`: `baseURL /api/v1`, Bearer, cola de refresh ante 401 → `/auth/refresh` |
| Sesión/estado | `AuthContext` + `localStorage` | `user`, `access_token`, `refresh_token`; `login` (`POST /auth/login` + `GET /auth/me`), `logout`, `refreshUser` |
| Iconos | lucide-react 1.32 | Iconos de `NAV_SIDEBAR` / `NAV_TABBAR` y guards (`ShieldAlert`) |
| Notificaciones | sonner 2.0 (`Toaster`) | Toasts montados en `App.jsx` |
| Tests | vitest 3 + Testing Library + jsdom | `test`, `test:watch`; Playwright solo para capturas con mocks |
| Capturas | Playwright + `scripts/capturas.mjs` | Screenshots con API mockeada en `capturas/` |

Sin TypeScript: no hay `types/` ni validación con esquemas en cliente; el formateo vive en `src/lib/format.js`.

---

## 3. Estructura de Carpetas del Código

Árbol real de `Chambeapp_admin_frontend/src` (+ `scripts/`, `capturas/`):

```
Chambeapp_admin_frontend/
├── package.json                 # react 18, vite 6, react-router-dom 7, axios, lucide, sonner, vitest
├── scripts/
│   └── capturas.mjs             # mocks + runner Playwright (SHOTS por rol)
├── capturas/
│   └── 01-login.png             # (runner genera verificador/|soporte/|admin/|superadmin/)
├── src/
│   ├── main.jsx                 # bootstrap React
│   ├── App.jsx                  # BrowserRouter + AuthProvider + AppRoutes + Toaster
│   ├── styles/
│   ├── app/
│   │   └── routes.jsx           # lazy pages + withAuth/gate + RootRedirect + "*"
│   ├── config/
│   │   └── navigation.js        # NAV_SIDEBAR / NAV_TABBAR / isNavActive / getActiveItemId
│   ├── context/
│   │   └── AuthContext.jsx      # STAFF_ROLES, ROLE_HOME, isStaffRole, homeForRole, AuthProvider, useAuth
│   ├── guards/
│   │   ├── RequireAuth.jsx      # redirige a /login con state.from
│   │   └── RequireRole.jsx      # 403 visual (ShieldAlert + EmptyState) si rol no permitido
│   ├── lib/
│   │   ├── api.js               # axios baseURL /api/v1 + interceptores Bearer/refresh
│   │   └── format.js            # formatCOP, formatDate(Time), initials, getErrorMessage
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx     # Sidebar + Topbar + TabBar (lee navigation.js)
│   │   │   └── PageHeader.jsx
│   │   └── ui/                  # Button, Input, Select, Textarea, FormField, Card,
│   │       └── index.js         #   Badge, Chip, EmptyState, LoadingState, Spinner,
│   │                            #   Modal, Switch, Container, Pagination
│   └── features/
│       ├── auth/
│       │   └── LoginPage.jsx
│       ├── verificador/
│       │   ├── VerificadorHome.jsx
│       │   └── KycReviewPage.jsx        # reutilizada en /admin/kyc
│       ├── soporte/
│       │   ├── SoporteHome.jsx
│       │   └── TicketsPage.jsx          # reutilizada en /admin/tickets
│       ├── admin/
│       │   ├── AdminHome.jsx
│       │   ├── StatsPage.jsx
│       │   ├── UsersPage.jsx
│       │   ├── VerificationsPage.jsx
│       │   ├── SolicitudesModPage.jsx
│       │   ├── ContractsModPage.jsx
│       │   ├── DisputesPage.jsx
│       │   └── ContentModPage.jsx
│       ├── superadmin/
│       │   ├── SuperadminHome.jsx
│       │   ├── AdminsPage.jsx
│       │   ├── ConfigPage.jsx
│       │   ├── AuditPage.jsx
│       │   ├── OverridesPage.jsx
│       │   ├── LegalPage.jsx
│       │   ├── AIParamsPage.jsx
│       │   └── FlagsPage.jsx
│       └── staff/
│           ├── components/
│           │   ├── AdminTable.jsx
│           │   ├── FilterBar.jsx
│           │   └── StatusBadge.jsx
│           ├── lib/
│           │   └── labels.js            # ROLE_LABELS, STATUS_LABELS, statusTone
│           └── services/
│               ├── adminApi.js
│               ├── kycApi.js
│               └── superadminApi.js
```

---

## 4. Roles y Guards

| Rol | Home (`ROLE_HOME`) | Rutas |
|-----|--------------------|-------|
| `verificador` | `/verificador` | `/verificador`, `/verificador/kyc` |
| `soporte` | `/soporte` | `/soporte`, `/soporte/tickets` |
| `admin` | `/admin` | `/admin` + 9 subrutas: `/admin/estadisticas`, `/admin/usuarios`, `/admin/verificaciones`, `/admin/kyc`, `/admin/solicitudes`, `/admin/contratos`, `/admin/disputas`, `/admin/tickets`, `/admin/contenido` |
| `superadmin` | `/superadmin` | `/superadmin` + 7 subrutas: `/superadmin/admins`, `/superadmin/config`, `/superadmin/auditoria`, `/superadmin/overrides`, `/superadmin/legal`, `/superadmin/ia`, `/superadmin/flags` |
| (no staff) | `/login` | `homeForRole` cae a `/login`; `RootRedirect` y `*` redirigen según sesión |

Reutilización entre namespaces (mismo componente, distinto guard):

- `KycReviewPage` (verificador) se monta también en `/admin/kyc`.
- `TicketsPage` (soporte) se monta también en `/admin/tickets`.

Mecanismo (`src/app/routes.jsx` + `src/guards/`):

- `withAuth(element)` = `Suspense` (fallback `Cargando módulo…`) + `RequireAuth`.
- `gate(roles, element)` = `withAuth(RequireRole(roles, element))`.
- `RequireAuth`: si `!isAuthenticated`, `<Navigate to="/login" state={{from}} />`.
- `RequireRole`: si `user.rol ∉ roles`, pantalla `No autorizado` (`ShieldAlert` + `EmptyState`); si no, `children`.
- Todas las páginas van con `lazy()` + `Suspense`.

Herencia efectiva (por listas `gate` en `routes.jsx`):

| Namespace | Roles permitidos | Lectura |
|-----------|-----------------|---------|
| `/verificador/*` | `verificador`, `admin`, `superadmin` | admin hereda verificador |
| `/soporte/*` | `soporte`, `admin`, `superadmin` | admin hereda soporte |
| `/admin/*` | `admin`, `superadmin` | superadmin hereda todo admin |
| `/superadmin/*` | `superadmin` | exclusivo |

Resumen: `admin → verificador + soporte`; `superadmin → todo`.

---

## 5. Navegación Config-Driven

Fuente única: `src/config/navigation.js`. `AppShell.jsx` (Sidebar / TabBar / Topbar) solo lee esa config; no hay rutas hardcodeadas en el layout.

- `NAV_SIDEBAR`: por rol y por grupos con etiqueta.
  - `verificador`: grupo `Principal` (Inicio, Revisión KYC).
  - `soporte`: grupo `Principal` (Inicio, Tickets).
  - `admin`: `Principal` (Inicio, Usuarios, Verificaciones, Revisión KYC) + `Contenido` (Solicitudes, Contratos, Disputas, Tickets, Contenido) + `Análisis` (Estadísticas).
  - `superadmin`: `Principal` (Inicio, Admins, Overrides) + `Sistema` (Configuración, IA, Flags) + `Gobernanza` (Auditoría, Legal / T&C).
- `NAV_TABBAR`: versión móvil reducida (2–4 accesos por rol; admin: Inicio/Usuarios/Solicitudes/Disputas; superadmin: Inicio/Admins/Config/Flags).
- `isNavActive(itemPath, currentPath)`: igualdad o prefijo (`path + '/'`); caso raíz exacto.
- `getActiveItemId(items, currentPath)`: aplana grupos, filtra coincidencias y devuelve el `id` del path más largo (más específico).

---

## 6. Servicios API

Cliente (`src/lib/api.js`):

- `baseURL = /api/v1`, `Content-Type: application/json`.
- Interceptor request: inyecta `Authorization: Bearer <access_token>`.
- Interceptor response: ante `401` (una vez por petición, con `refresh_token` presente) hace `POST /api/v1/auth/refresh` con el refresh token, guarda el nuevo access token, reintenta la petición original y drena la cola (`pendingQueue`) de peticiones concurrentes; si el refresh falla, limpia `localStorage` y redirige a `/login`.

| Origen | Función | Endpoint |
|--------|---------|----------|
| `AuthContext` | `login(payload)` | `POST /auth/login` + `GET /auth/me` |
| `AuthContext` | `refreshUser()` | `GET /auth/me` |
| `lib/api.js` | refresh automático | `POST /auth/refresh` |
| `kycApi` | `getPendientes()` | `GET /kyc/pendientes` |
| `kycApi` | `verificarDocumento(id, decision, nota)` | `POST /kyc/documentos/{id}/verificar` |
| `adminApi` | `listUsers(params)` / `getUser(id)` | `GET /admin/users`, `GET /admin/users/{id}` |
| `adminApi` | `patchUserRole(id, role)` / `patchUserStatus(id, status)` | `PATCH /admin/users/{id}/role`, `PATCH /admin/users/{id}/status` |
| `adminApi` | `getStatsOverview()` | `GET /admin/stats/overview` |
| `adminApi` | `listVerifications(status)` / `approveVerification(id)` / `rejectVerification(id, reason)` | `GET /admin/verifications`, `POST /admin/verifications/{id}/approve`, `POST /admin/verifications/{id}/reject` |
| `adminApi` | `listSolicitudes(params)` / `moderateSolicitud(id, action)` | `GET /admin/solicitudes`, `PATCH /admin/solicitudes/{id}/moderate` |
| `adminApi` | `listContracts(params)` / `moderateContract(id, action)` | `GET /admin/contracts`, `PATCH /admin/contracts/{id}/moderate` |
| `adminApi` | `listDisputas(status)` / `getDisputa(id)` / `resolveDisputa(id, resolution)` | `GET /admin/disputes`, `GET /admin/disputes/{id}`, `POST /admin/disputes/{id}/resolve` |
| `adminApi` | `listTickets(params)` / `updateTicket(id, payload)` | `GET /admin/tickets`, `PATCH /admin/tickets/{id}` |
| `adminApi` | `listContentReports()` / `moderateContent(id, action)` | `GET /admin/content/reports`, `PATCH /admin/content/{id}/moderate` |
| `superadminApi` | `listAdmins()` / `createAdmin(payload)` / `updateAdmin(id, payload)` / `deleteAdmin(id)` | `GET/POST /superadmin/admins`, `PATCH/DELETE /superadmin/admins/{id}` |
| `superadminApi` | `getConfig()` / `updateConfig(key, value)` | `GET/PATCH /superadmin/config` |
| `superadminApi` | `listAuditLogs(params)` / `getAuditLog(id)` | `GET /superadmin/audit-logs`, `GET /superadmin/audit-logs/{id}` |
| `superadminApi` | `getTyc()` / `publishTyc(content)` | `GET/POST /superadmin/legal/tyc` |
| `superadminApi` | `overrideUser(userId, action)` / `overrideContract(contractId, action)` | `POST /superadmin/override/user`, `POST /superadmin/override/contract` |
| `superadminApi` | `getAIParams()` / `updateAIParams(weights)` | `GET/PATCH /superadmin/ai/params` |
| `superadminApi` | `listFlags()` / `toggleFlag(key, enabled)` | `GET /superadmin/flags`, `PATCH /superadmin/flags/{key}` |

Todas las funciones devuelven `r.data` (desenvuelven Axios).

---

## 7. Componentes Compartidos

| Componente / módulo | Ubicación | Uso |
|--------------------|-----------|-----|
| `AdminTable` | `features/staff/components/` | Tabla genérica (`columns {key,label,render}`, `rows`, `loading`, `empty`, `pagination`, `keyField`); estados con `Card` + `LoadingState` / `EmptyState` |
| `FilterBar` | `features/staff/components/` | Barra de filtros de listados staff |
| `StatusBadge` | `features/staff/components/` | Insignia de estado (tonos vía `statusTone`) |
| `labels.js` | `features/staff/lib/` | `ROLE_LABELS` (7 roles: pds/solicitante/merchant + 4 staff), `STATUS_LABELS` (usuario, verificación, solicitud, contrato, disputa, ticket ES/EN, prioridad, KYC, reportes, negocio), `statusTone()` (`ok/warn/danger/info/neutral`) |
| `format.js` | `src/lib/` | `formatCOP` (es-CO, 0 decimales), `formatDate` / `formatDateTime` (es-CO), `initials` (avatar Topbar), `getErrorMessage` (axios → mensaje) |
| Layout | `components/layout/` | `AppShell` (Sidebar + Topbar + TabBar), `PageHeader` |
| UI kit | `components/ui/` | `Button`, `Input`, `Select`, `Textarea`, `FormField`, `Card`, `Badge`, `Chip`, `EmptyState`, `LoadingState`, `Spinner`, `Modal`, `Switch`, `Container`, `Pagination` (re-export en `index.js`) |

---

## 8. Páginas por Feature (`.jsx` reales)

| Feature | Páginas |
|---------|---------|
| `auth` | `LoginPage.jsx` (única pública; `/login`) |
| `verificador` | `VerificadorHome.jsx`, `KycReviewPage.jsx` |
| `soporte` | `SoporteHome.jsx`, `TicketsPage.jsx` |
| `admin` | `AdminHome.jsx`, `StatsPage.jsx`, `UsersPage.jsx`, `VerificationsPage.jsx`, `SolicitudesModPage.jsx`, `ContractsModPage.jsx`, `DisputesPage.jsx`, `ContentModPage.jsx` (más `KycReviewPage` y `TicketsPage` reutilizadas) |
| `superadmin` | `SuperadminHome.jsx`, `AdminsPage.jsx`, `ConfigPage.jsx`, `AuditPage.jsx`, `OverridesPage.jsx`, `LegalPage.jsx`, `AIParamsPage.jsx`, `FlagsPage.jsx` |
| `staff` | Sin páginas: `components/` + `lib/labels.js` + `services/` compartidos |

---

## 9. Mocks y Capturas

- `scripts/capturas.mjs`: runner Playwright (base `http://localhost:5174`, viewport 1440×900 @2x).
  - `match(path)`: respuestas mock para los 18 endpoints consumidos (`/admin/stats/overview`, `/admin/users`, `/admin/verifications`, `/admin/solicitudes`, `/admin/contracts`, `/admin/disputes[/:id]`, `/admin/tickets`, `/admin/content/reports`, `/kyc/pendientes`, `/superadmin/admins|config|audit-logs[/:id]|legal/tyc|ai/params|flags`); datos semilla `USERS`, `VERIFICATIONS`, `SOLICITUDES`, `CONTRACTS`, `DISPUTES(+DETAIL)`, `TICKETS`, `RATINGS`, `PENDIENTES_KYC`, `ADMIN_INTERNALS`, `CONFIGS`, `AUDIT_LOGS(+DETAIL)`, `TYC`, `AI_PARAMS`, `FLAGS`.
  - `SHOTS`: 1 login + 2 verificador + 2 soporte + 10 admin + 8 superadmin = 23 capturas; sesión simulada por `ROLE_USER` vía `localStorage` (`user`, `access_token`, `refresh_token` mock).
  - Intercepta `**/api/v1/**` con `route.fulfill` (404 si no hay mock).
- `capturas/`: salida (`01-login.png` + subcarpetas `verificador/`, `soporte/`, `admin/`, `superadmin/`). Estado actual del repo: solo `01-login.png` versionado; el resto se generan al correr el script.

---

## 10. Trazabilidad Backend (página → endpoints)

Scoping: el admin opera con alcance regional (`region_scope_id` del staff) aplicado en el backend sobre `/api/v1/admin`; el superadmin es global. La creación de staff vive en el backend (`POST /admin/staff`); el frontend gestiona internos vía `/superadmin/admins` (ver tabla §6). El frontend leído no referencia `region_scope_id` directamente: envía el Bearer y el backend filtra.

| Página | Endpoints backend |
|--------|-------------------|
| Login | `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| VerificadorHome / KycReviewPage (`/verificador`, `/verificador/kyc`, `/admin/kyc`) | `GET /api/v1/kyc/pendientes`, `POST /api/v1/kyc/documentos/{id}/verificar` |
| SoporteHome / TicketsPage (`/soporte`, `/soporte/tickets`, `/admin/tickets`) | `GET /api/v1/admin/tickets`, `PATCH /api/v1/admin/tickets/{id}` |
| AdminHome / StatsPage | `GET /api/v1/admin/stats/overview` |
| UsersPage | `GET /api/v1/admin/users`, `GET /api/v1/admin/users/{id}`, `PATCH /api/v1/admin/users/{id}/role`, `PATCH /api/v1/admin/users/{id}/status` |
| VerificationsPage | `GET /api/v1/admin/verifications`, `POST /api/v1/admin/verifications/{id}/approve|reject` |
| SolicitudesModPage | `GET /api/v1/admin/solicitudes`, `PATCH /api/v1/admin/solicitudes/{id}/moderate` |
| ContractsModPage | `GET /api/v1/admin/contracts`, `PATCH /api/v1/admin/contracts/{id}/moderate` |
| DisputesPage | `GET /api/v1/admin/disputes`, `GET /api/v1/admin/disputes/{id}`, `POST /api/v1/admin/disputes/{id}/resolve` |
| ContentModPage | `GET /api/v1/admin/content/reports`, `PATCH /api/v1/admin/content/{id}/moderate` |
| SuperadminHome/AdminsPage | `GET/POST /api/v1/superadmin/admins`, `PATCH/DELETE /api/v1/superadmin/admins/{id}` (+ `POST /api/v1/admin/staff` en backend para alta de staff) |
| ConfigPage | `GET/PATCH /api/v1/superadmin/config` |
| AuditPage | `GET /api/v1/superadmin/audit-logs[/{id}]` |
| OverridesPage | `POST /api/v1/superadmin/override/user`, `POST /api/v1/superadmin/override/contract` |
| LegalPage | `GET/POST /api/v1/superadmin/legal/tyc` |
| AIParamsPage | `GET/PATCH /api/v1/superadmin/ai/params` |
| FlagsPage | `GET /api/v1/superadmin/flags`, `PATCH /api/v1/superadmin/flags/{key}` |

---

## 11. Diagramas

Fuente `.puml` y equivalente ASCII manual `.utxt` en `diagramas/` (los `.utxt` llevan cabecera `NOTA: ASCII manual — sin binario PlantUML en este entorno`).

| # | Diagrama | Descripción | Fuente |
|---|----------|-------------|--------|
| 11 | Regiones y scoping multirregión | SPA + `regions` (`GET /regions`, `GET /regions/detectar`), `services/region.py` (`match/assign/owned`), `regions` + `users.region_id`, scoping en `/api/v1/admin`, reindex superadmin | [puml](diagramas/11_regiones.puml) · [utxt](diagramas/11_regiones.utxt) |
| 12 | Arquitectura Admin Frontend | Roles → SPA → `RequireAuth` → `RequireRole` → `NAV_SIDEBAR/TABBAR` → `adminApi/kycApi/superadminApi` → `/api/v1/admin·kyc·superadmin` | [puml](diagramas/12_arquitectura_admin_frontend.puml) · [utxt](diagramas/12_arquitectura_admin_frontend.utxt) |

> Nota: `10_modelo_datos_comerciante` solo tiene `.puml` (falta el binario PlantUML en este entorno para generar su `.utxt`; no se creó).

---

*Versión: 1.0 — Documento inicial del Admin Frontend (app staff separada del PWA).*


## UI — design system del frontend principal (portado)

El panel admin usa el **kit de componentes del frontend cliente** (Chambeapp_frontend/src/components/ui/*, TSX + CSS ch-), portado a Chambeapp_admin_frontend/src/components/ui/ con Vite (transpila TSX vía esbuild). Incluye 	okens.css canónico y wrappers de compatibilidad para la API legacy del panel:

- AdminModal (API 	itle/ooter sobre ModalHeader/Body/Footer)
- AdminBadge (API 	one → variantes status del kit)
- AdminLoadingState (acepta ows/label)
- AdminEmptyState (acepta icon como ReactNode o string)
- Chip (label estático del panel)

Overrides del panel: src/styles/ui-fixes.css (.ch-btn--ok/danger, badge neutral) y globals.css recortado (solo layout: shell, sidebar, tabla, stats, kyc, auth…).

## Mi perfil y cierre de sesión

- Nueva página `/perfil` (`src/features/perfil/PerfilPage.jsx`) para todos los roles:
  credencial de acceso regional (banda de registro + región + rol, identidad en Archivo,
  datos de credencial en mono) + secciones funcionales: **Información personal**
  (`PUT /users/me/profile`), **Notificaciones** y **Preferencias** (`PUT /users/me/preferences`),
  y **Seguridad** (cambio de contraseña `POST /auth/change-password` + 2FA `GET/PUT /auth/2fa`),
  más el botón **Cerrar sesión**.
- El **logout se quitó de la barra superior** (Topbar). La topbar muestra el avatar (componente Avatar) y el nombre, clicable hacia /perfil.
- Navegación: grupo **Cuenta → Mi perfil** en el sidebar y tab **Perfil** en el tabbar para verificador, soporte, admin y superadmin.
