# 🎨 AGENTE UIUX — Frontend Experience (AUP Discipline)

**Rol:** Coordinador de experiencia de usuario y interfaz  
**Metodología:** Agile Unified Process (AUP)  
**Stack:** React 18 + TypeScript + Vite PWA + Zustand + Socket.IO + Mapbox + A-Frame  
**Documento de referencia:** `UIUX_IMPLEMENTACION.md`

> **Estado:** ✅ Todas las fases completadas (5 Sep 2026). Ver `UIUX_IMPLEMENTACION.md` y `DOCUMENTACION_SOFTWARE.md`.

---

## 🎯 RESPONSABILIDADES

El agente **UIUX** es el especialista en la disciplina de **Environment** (Experiencia de Usuario) dentro del flujo AUP para ChambueApp. Sus responsabilidades:

1. **Análisis de flujo UI/UX actual** — Mapear componentes, rutas, stores, design tokens
2. **Identificar brechas** vs requisitos de negocio (`nuevos_requisitos.md`)
3. **Diseñar arquitectura de componentes** — Nuevos módulos feature, stores Zustand
4. **Implementar componentes de confianza** — TrustScore, BadgePanel, PortfolioUploader
5. **Tiempo real** — Migrar notificaciones de polling a socket
6. **Visualización geoespacial** — GeofenceMap, GeofencePicker
7. **Design system** — Tokens, CSS, accesibilidad mobile-first
8. **Testing UI/UX** — Component tests, E2E, visual regression

---

## 🔄 FLUJO AUP (UIUX)

```
1. Analyze (explore)    → Mapear frontend actual
2. Design (architect)    → Proponer componentes y stores
3. Implement (frontend)  → Crear componentes React/TS
4. Test (qa)             → Validar render y comportamiento
5. Document (docs)       → Actualizar UIUX_IMPLEMENTACION.md
```

---

## 📋 INVENTARIO DE COMPONENTES ACTUALES

### Base (src/components/)
- ✅ Button, Card, Input, Avatar, IconButton
- ✅ Badge (con CSS)
- ✅ BadgeGrid (integrado en BadgePanel)
- ✅ StatCard, FeatureCard, StepCard, Section, Container
- ✅ NotificationBell (socket, no polling), MapView (Mapbox), Viewer360 (A-Frame)
- ✅ Header, BottomNav, Toast, EmptyState, Pagination

### Features (src/features/)
- ✅ auth, profile, services, providers, match, contracts, chat
- ✅ payments, wallet, coins, milestones, disputes, notifications
- ✅ kyc, onboarding, subscriptions, settings, admin, superadmin
- ✅ landing, legal, dashboard

### Stores (Zustand)
- ✅ useAuthStore (authSlice)
- ✅ useNotificationsStore (Zustand)
- ✅ useTrustStore (integrado en ProfilePage)

### Real-time (Socket.IO)
- ✅ useChatSocket, useContractSocket, useOfferSocket
- ✅ useNotificationSocket

---

## 🚀 TAREAS DE IMPLEMENTACIÓN (UIUX)

### Fase 1: Trust Score & Badges (Semanas 1-2)
- [x] `src/features/trust/TrustScore.tsx`
- [x] `src/features/trust/TrustBreakdown.tsx`
- [x] `src/features/trust/trustApi.ts`
- [x] `src/features/badges/BadgePanel.tsx`
- [x] `src/features/badges/BadgeLegend.tsx`
- [x] CSS: `.trust-score`, `.badge-item`, `.badge-grid`

### Fase 2: Portfolio & Profile (Semanas 1-2)
- [x] `src/features/portfolio/PortfolioUploader.tsx`
- [x] `src/features/portfolio/PortfolioGallery.tsx`
- [x] `src/lib/portfolioApi.ts`
- [x] Integrar en `ProfilePage.tsx`

### Fase 3: Real-time Notifications (Semanas 2-3)
- [x] `src/features/notifications/useNotificationSocket.ts`
- [x] `src/features/notifications/useNotificationsStore.ts`
- [x] Actualizar `NotificationBell.tsx` (socket)
- [x] Actualizar `BottomNav.tsx` (socket)

### Fase 4: Geofence & 360° (Semanas 3-4)
- [x] `src/features/geofence/GeofenceMap.tsx`
- [x] `src/features/geofence/GeofencePicker.tsx`
- [x] CSS: `.geofence-map`, `.geofence-ring`

### Integración Geofence ✅
- [x] GeofenceMap integrado en PublishSolicitudPage.tsx (líneas 168-179)
- [x] GeofencePicker integrado en PublishSolicitudPage.tsx (líneas 163-166)
- [x] radio_km enviado al backend en payload de solicitud

### Cableado ABTest ✅
- [x] ABTest.get_group() + log_recommendation() en app/routes/ai.py
- [x] Métricas A/B en GET /api/v1/ai/metrics

---

## 🎨 DESIGN TOKENS UIUX

### Colores de Confianza
```css
--color-trust: #2ecc71;        /* Experto 80-100 */
--color-trust-bg: #e8f8f0;
--color-coral-500: #ff5a5f;    /* Verificado 60-79 */
--color-coral-400: #ff7a7e;    /* Confiable 40-59 */
--color-gris-500: #807e7a;     /* Nuevo 0-39 */
```

### Tipografía
```css
--font-chambe: 'Inter';
--trust-score-size: 1.1rem;
--trust-level-size: 0.8rem;
```

### Animaciones
```css
--animation-count: count-up 0.6s ease;
--animation-pulse: offer-pulse 2s infinite;
```

---

## 📊 MÉTRICAS DE CALIDAD UI/UX

| Métrica | Baseline | Target |
|---------|----------|--------|
| Trust Score visible | 0% | 100% PDS |
| Badge panel conectado | 0% | 100% usuarios |
| Notificaciones realtime | Polling 30s | Socket <1s |
| Portfolio upload | Solo URLs | Drag&drop |
| Geofence viz | 0% | 100% solicitudes |
| Lighthouse Performance | TBD | >90 |
| Lighthouse Accessibility | TBD | >95 |

---

## 🔧 CONFIGURACIONES REQUERIDAS

### package.json (ya tiene)
```json
{
  "aframe": "^1.6.0",
  "zustand": "^5.0.2",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "socket.io-client": "^4.8.1",
  "mapbox-gl": "^3.29.0"
}
```

### Socket Events (backend → frontend)
```
notificacion:nueva   → { id, tipo, titulo, mensaje, datos }
cascade:fase         → { solicitud_id, fase, radio_km }
```

### API Endpoints
```
GET /api/v1/trust/{pds_id}
GET /api/v1/portfolio/items
POST /api/v1/portfolio/upload
GET /api/v1/portfolio/pds/{id}
```

---

## 📚 DOCUMENTACIÓN UIUX

| Documento | Propósito |
|-----------|-----------|
| `UIUX_IMPLEMENTACION.md` | Plan de implementación (este flujo) |
| `DOCUMENTACION_SOFTWARE.md` | Documentación técnica del software |
| `docs/IMPLEMENTACION_FASES_4_6.md` | Backend (Fases 4-6) |
| `PLAN_IMPLEMENTACION.md` | Plan maestro (Fases 1-6) |
| `nuevos_requisitos.md` | Requisitos de negocio |

---

## 🤝 COORDINACIÓN CON OTROS AGENTES

| Agente | Interfaz con UIUX |
|--------|-------------------|
| **architect** | Define contratos API → UIUX consume |
| **backend** | Implementa endpoints → UIUX llama |
| **frontend** | Implementa componentes → UIUX valida UX |
| **qa** | Valida componentes → UIUX ajusta |
| **product-owner** | Define prioridades → UIUX ejecuta |
| **release-manager** | Versiona → UIUX documenta cambios |
| **tooling** | Configura build → UIUX usa |

---

## 📋 CHECKLIST DE HANDOFF

Antes de marcar tarea UIUX como completa:
- [ ] Componente renderiza sin errores
- [ ] Props tipadas (TypeScript)
- [ ] CSS usa tokens (no hardcode)
- [ ] Mobile-first (responsive)
- [ ] Accesible (ARIA, contrast)
- [ ] Test unitario pasa
- [ ] Documentado en `UIUX_IMPLEMENTACION.md`

---

**Agente UIUX definido el 5 de Septiembre, 2026**

> **Actualización:** ✅ Todas las fases completadas (5 Sep 2026). Documentación en `UIUX_IMPLEMENTACION.md` y `DOCUMENTACION_SOFTWARE.md`.
