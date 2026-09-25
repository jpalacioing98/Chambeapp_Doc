# Roles y UI — Síntesis 6 roles (Admin, Superadmin, Soporte, Verificador, PDS, Solicitante)

> Síntesis de `ROLE_*.md` (6) de raíz. No copia verbatim; tabla consolidada. Verificado contra `Chambeapp_frontend/src` y `Chambeapp_backend/app/routes/*`. Fecha 2026-09-25.

## Tabla matriz roles → nivel → módulos → rutas → APIs

| Rol | Nivel | Namespace | Layout | Rutas clave (frontend) | APIs consumidas (backend) | Módulos |
|---|---|---|---|---|---|---|
| **Solicitante** | 1 base | `/solicitante/*` | `RoleShell`+`RoleBottomNav`+`Header` | `/solicitante` (Home), `/solicitante/solicitudes`, `/solicitante/solicitudes/new`, `/solicitante/solicitudes/:id`, `/solicitante/ofertas`, `/solicitante/contratos`, `/solicitante/contratos/:id`, `/solicitante/pagos`, `/payments/checkout`, `/solicitante/mensajes`, `/solicitante/perfil`, `/solicitante/disputas` | `solicitudesApi` (list/get/create/complete/listOfertas/responder), `contractsApi` (getMyContracts/getContract/updateEstado/create), `paymentsApi`, `usersApi` (profile), `portfolioApi`, `notificationsApi` | Publicar solicitud, ofertas recibidas (aceptar/rechazar/contraofertar), contratos, pagos checkout, chat, perfil 360/portfolio/trust |
| **PDS** | 1 base | `/pds/*` | `RoleShell`+`RoleBottomNav`+`Header` | `/pds` (Home), `/pds/chambas` (/pds/solicitudes/:id), `/pds/ofertas`, `/pds/contratos`, `/pds/contratos/:id`, `/pds/billetera`, `/pds/mensajes`, `/pds/perfil`, `/pds/disputas` | `solicitudesApi`, `contractsApi`, `walletApi` (getMyWallet/getHistorial/depositar/retirar), `coinsApi` (getSaldoMonedas), `usersApi`, `portfolioApi`, `trust` | Buscar chambas, crear oferta, contraoferta, wallet (saldo bloqueado, monedas comprada/promocional/ganada), chambas/marañas, chat, perfil |
| **Verificador** | 2 staff | `/verificador/*` | `RoleShell`+`RoleBottomNav` | `/verificador`, `/verificador/kyc`, `/verificador/mensajes`, `/verificador/perfil` | `kycApi` (getPendientes/verificarDocumento) | KYC revisión (`KycReviewPage.tsx` compartido): aprueba/rechaza con nota, preview base64 |
| **Soporte** | 2 staff | `/soporte/*` | `RoleShell`+`RoleBottomNav` | `/soporte`, `/soporte/tickets`, `/soporte/perfil` | `adminApi` (listTickets/updateTicket/createTicket) | Tickets (subject, status, priority; cambiar estado/prioridad) |
| **Admin** | 3 | `/admin/*` | `AdminLayout` (Sidebar+Header+Main) | `/admin/usuarios`, `/admin/verificaciones`, `/admin/kyc`, `/admin/solicitudes`, `/admin/disputas`, `/admin/tickets`, `/admin/contenido`, `/admin/estadisticas` | `adminApi` (listUsers/patchRole/patchStatus, listVerifications/approve/reject, listSolicitudes/moderate, listDisputes/resolve, listTickets, listContent/moderate, getStats), `kycApi` | Gestión usuarios (rol/status), verificaciones, KYC, moderación solicitudes (approve/reject/hide), disputas (resolution+paymentAction), tickets, contenido, stats (users/services/contracts/revenue/disputes) |
| **Superadmin** | 4 max | `/superadmin/*` | `SuperadminLayout` | `/superadmin/admins`, `/superadmin/config`, `/superadmin/auditoria`, `/superadmin/legal`, `/superadmin/ia`, `/superadmin/flags`, + `/superadmin/regions/reindex` | `superadminApi` (listAdmins/createAdmin/updateAdmin/deleteAdmin, getConfig/updateConfig, listAuditLogs, getTyc/publishTyc, getAIParams/updateAIParams, listFlags/toggleFlag) | Gestión staff interno (admin/soporte/verificador + region_id), config global, auditoría inmutable, legal T&C versionado, IA pesos, feature flags, regions reindex |

## Notas de divergencia (referencias que pueden haber cambiado)

- **ROLE_ADMIN.md §2.1-2.8**: referencia `src/features/admin/*.tsx` con APIs `adminApi` — nombres vigentes en código (`admin.py` routes). Scope regional (Fase 4) añade filtro `region_id` no documentado en ROLE docs originales (ahora `GET /admin/*` filtra por región; superadmin ve todo).
- **ROLE_SUPERADMIN.md**: `POST/PATCH /superadmin/admins` ahora aceptan `region_id` (no en doc origen); `POST /superadmin/regions/reindex` nuevo (no en doc).
- **ROLE_VERIFICADOR.md**: `KycReviewPage.tsx` compartido admin/verificador; endpoint real `GET /kyc/pendientes` + `POST /kyc/documentos/<id>/verificar` (ver RF-73) con scope regional.
- **ROLE_SOPORTE.md**: tickets `GET/PATCH /admin/tickets` acotados a región.
- **ROLE_PDS/ROLE_SOLICITANTE**: rutas `/pds/chambas` vs doc `PLAN_IMPLEMENTACION_MODULO_CHAMBAS` `/solicitante/chambas/:id` y `/prestador/chambas/:id` — actualmente `Chamba` usa `/chambas/*` (no `/solicitante/chambas` legacy); PDS `SolicitudesListPage` aún lista solicitudes, no chambas dedicadas (gap frontend).
- **Merchant (negocio)**: no tiene `ROLE_*.md` en raíz pero existe como `merchant` rol (RF-31..48) con ` /negocio/*` — falta ROLE doc (gap).
- **Auditoría**: `RNF-AUD` inmutable (`audit.py`) — todos los roles internos loguean `actor, action, entity, IP, before/after`.

*Síntesis no replica contenido completo; mapea nivel, layout, rutas, APIs y módulos. Validar nombres de componentes vs `src/features/*` si se renombran.*