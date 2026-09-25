# RF División Regional — RF-70 a RF-75

> Fuente: `CHANGELOG.md` (Fase 4: Division regional + Mitigación), verificado contra `app/models/region.py`, `app/models/user.py` (`users.region_id` FK), `app/controllers/regions.py`, `app/controllers/superadmin.py`, `app/controllers/admin.py`, `app/controllers/kyc.py`, `app/controllers/tickets.py`, `app/services/region.py`, `app/data/seed_regions.py`, migración `014_regiones`.
> Numeración continúa RF-69. EARS. Implementado (24 tests `test_regiones.py`).

## Modelo
- `regions {id, clave unique, nombre, descripcion?, departamentos JSON[], created_at}`. Seed `seed_regions.py` catálogo Colombia (Caribe, Andina, Pacífica, Orinoquía, Amazonía, etc. con departamentos).
- `users.region_id FK regions.id nullable` (personal interno y público). `GET /auth/me` incluye `region`.

### RF-70: Catálogo de regiones
**HU-70:** Como usuario quiero ver regiones disponibles para entender mi zona.
**EARS:** WHEN usuario autenticado `GET /api/v1/regions` THEN sistema SHALL retornar `{items: Region[]}` ordenadas por `id`. WHEN `GET /regions/detectar?ubicacion=<texto>` THEN SHALL `match_region_from_text(text)` (case-insensitive substring de departamento en texto) → `{region|None}` (ej. "Valledupar, Cesar" → Caribe).
**CA:** Sin auth 401; cualquier rol.

### RF-71: Asignación regional del personal interno
**EARS:** WHEN superadmin `POST /superadmin/admins {email, nombre, rol: admin|soporte|verificador, password, region_id}` OR `PATCH /superadmin/admins/<id> {region_id}` THEN sistema SHALL crear/reasignar con `region_id` validado. WHEN admin regional `GET/POST /api/v1/admin/staff` THEN SHALL crear/listar solo verificador/soporte dentro de SU región (scope=admin.region_id).
**CA:** `users.region_id` de staff nunca se reasigna automáticamente por `assign_region` (excluido en `_STAFF_ROLES`). Superadmin ve todo (scope null).

### RF-72: Derivación automática de región del usuario público
**EARS:** WHEN usuario público actualiza `Profile.zona` (vía `PUT /users/me` o preferencias) OR crea `Solicitud {ubicacion}` THEN sistema SHALL `assign_region(user, text=zona|ubicacion)` si `region` matchea departamento → set `user.region_id`. IF no match THEN SHALL dejar `NULL` (sin asignar). WHEN staff actualiza zona THEN SHALL NO reasignar.
**CA:** `match_region_from_text` itera regions por `departamentos` (lower contains). Devuelve first match. No toca personal interno.

### RF-73: Scope regional en paneles administrativos
**EARS:** WHEN actor con `region_id` consulta `GET /api/v1/admin/*` (usuarios, verificaciones, solicitudes, contratos, disputas, tickets, contenido) OR `GET /kyc/pendientes` / `POST /kyc/documentos/<id>/verificar` OR `GET/PATCH /admin/tickets` THEN sistema SHALL filtrar por `scope = actor.region_id` (superadmin scope null = ve todo). IF actor tiene región, SHALL excluir entidades de otras regiones.
**CA:** Implementado en `admin.py`/`kyc.py`/`tickets.py`: `WHERE users.region_id = scope`. Frontend `AdminLayout`/`KycReviewPage`/`TicketsPage` muestra solo su región.

### RF-74: Regla de propiedad anti doble-conteo
**EARS:** WHEN se lista/contabiliza contrato/disputa/pago para métricas por región THEN sistema SHALL atribuirlo SOLO a la región del SOLICITANTE (`contract_owned_by_region(contract, scope)`: `solicitante.region_id == scope`). IF proveedor es de otra región THEN SHALL NO aparecer en su región (evita doble conteo).
**CA:** Aplica a `stats`/`disputas`/`contracts` admin; proveedor de otra región no ve el contrato en su scope regional. Superadmin agrega global.

### RF-75: Reindex regional masivo
**EARS:** WHEN superadmin `POST /superadmin/regions/reindex` THEN sistema SHALL recorrer usuarios públicos (`rol NOT IN {admin,superadmin,verificador,soporte}`) y para cada uno `assign_region(user, text=profile.zona OR última solicitud.ubicacion)` y commit batch; SHALL retornar `{actualizados: n}`. WHEN no hay zona/ubicación THEN SHALL skip (queda NULL).
**CA:** No toca personal interno; idempotente; usado tras seed o migración de datos legacy. 24 tests cubren derivación, scope, anti-doble-conteo y reindex.

## Trazabilidad API
| RF | Endpoint |
|---|---|
|70|GET /regions + GET /regions/detectar|
|71|POST/PATCH /superadmin/admins + GET/POST /admin/staff|
|72|`assign_region` hook en perfil/solicitud|
|73|GET /admin/* + GET /kyc/pendientes + POST /kyc/verificar + GET/PATCH /admin/tickets|
|74|`contract_owned_by_region` en listados y stats|
|75|POST /superadmin/regions/reindex|

*Gap: región no requerida en registro (nullable); UI de selección región en onboarding pendiente.*