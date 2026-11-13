# Especificación de Dashboard de Métricas Profesional — ChambeApp

> **Proyecto:** ChambeApp — Plataforma Inteligente para la Contratación de Servicios Laborales con IA y Visualización 360 en Valledupar  
> **Fecha:** 2026-11-13  
> **Versión:** 1.0  
> **Basado en:** Anteproyecto de grado (RESULTADOS_ESPERADOS_ANTEPROYECTO_FINAL.md), arquitectura 3 capas, 47 modelos, 218 endpoints, 36 blueprints, 7 roles, 5 macro-módulos

---

## Resumen Ejecutivo

Este documento define el **catálogo completo de métricas** para un dashboard profesional de ChambeApp, organizado por **dominios de negocio** alineados a los **5 macro-módulos** del sistema (A–E) y las **decisiones arquitectónicas** (9 ADRs). Cada métrica incluye: **descripción, fuente de datos, fórmula, nivel de importancia (Crítica/Alta/Media/Baja), impacto de negocio, frecuencia de actualización y visualización recomendada**.

El dashboard actual (`/admin/stats/overview`) solo expone **6 métricas básicas**. Esta especificación amplía a **80+ métricas** con trazabilidad a RFs, NFRs y flujos E2E auditados.

---

## Taxonomía de Niveles

| Nivel | Definición | Uso en Dashboard |
|-------|------------|------------------|
| **Crítica (🔴)** | KPI directo de salud del negocio; alerta inmediata si desvía | Header superior, tiempo real, alertas push |
| **Alta (🟠)** | Indicador de rendimiento operativo; revisión diaria | Tarjetas principales, tendencias 7/30 días |
| **Media (🟡)** | Insight táctico; revisión semanal | Gráficos de detalle, drill-down |
| **Baja (🟢)** | Contexto estratégico; revisión mensual/trimestral | Reportes ejecutivos, exportación |

**Impacto de Negocio:** `Ingresos` | `Retención` | `Adquisición` | `Operación` | `Cumplimiento` | `Confianza` | `Crecimiento`

---

## MÓDULO A — GESTIÓN DE USUARIOS Y PERFILES (Macro-módulo A)

### A1. Adquisición y Activación de Usuarios

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| A1.1 | **Usuarios Registrados Totales** | Cuenta acumulada de `users` activos + suspendidos + baneados | `User.query.count()` | 🟡 Media | Crecimiento | Diaria | Línea temporal acumulada |
| A1.2 | **Usuarios Activos (MAU/DAU)** | Usuarios con `status='active'` y `last_login` en últimos 30/1 días | `User.query.filter(User.status=='active', User.last_login >= now()-30d).count()` | 🔴 Crítica | Retención | Tiempo real / Diaria | KPI card + sparkline |
| A1.3 | **Tasa de Activación (D1/D7/D30)** | % usuarios que completan onboarding (`profile.onboarding_completed=true`) a los 1/7/30 días de registro | `COUNT(onboarding_completed AND fecha_registro >= now()-Nd) / COUNT(fecha_registro >= now()-Nd)` | 🔴 Crítica | Adquisición | Diaria | Funnel horizontal |
| A1.4 | **Distribución por Rol** | Conteo de usuarios por `RolUsuario` (PDS, Solicitante, Merchant, Verificador, Soporte, Admin, Superadmin) | `User.query.group_by(User.rol).count()` | 🟠 Alta | Operación | Diaria | Donut chart interactivo |
| A1.5 | **Ratio PDS / Solicitante** | `COUNT(rol='pds') / COUNT(rol='solicitante')` — balance oferta/demanda | Derivada de A1.4 | 🔴 Crítica | Crecimiento | Diaria | Gauge + alerta si < 0.3 o > 3 |
| A1.6 | **Usuarios por Región** | Distribución geográfica según `User.region_id` (scoping regional) | `User.query.group_by(User.region_id).count()` | 🟠 Alta | Operación | Diaria | Mapa coroplético Colombia |
| A1.7 | **Tasa de Verificación Email** | `% usuarios con email_verificado=true` | `COUNT(email_verificado) / COUNT(*)` | 🟡 Media | Confianza | Diaria | KPI card |
| A1.8 | **Adopción 2FA** | `% usuarios con two_factor_enabled=true` desglosado por método (SMS/TOTP) | `User.query.filter(User.two_factor_enabled==True).group_by(User.two_factor_method).count()` | 🟡 Media | Seguridad | Semanal | Stacked bar |

### A2. KYC y Verificación de Identidad (RF-17, RF-18, RF-19)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| A2.1 | **KYC Completion Rate por Rol** | % usuarios con todos los documentos obligatorios `estado='aprobado'` por rol (PDS: 11 docs, Solicitante: 8, Merchant: 9) | `DocumentoUsuario.query.filter(estado='aprobado').group_by(rol).count() / DocumentoRequerido.query.filter(obligatorio=True).group_by(rol).count()` | 🔴 Crítica | Confianza / Cumplimiento | Tiempo real | Tabla heatmap rol vs documento |
| A2.2 | **Documentos Pendientes de Revisión** | Cola de `DocumentoUsuario.estado='enviado'` esperando verificador | `DocumentoUsuario.query.filter(estado='enviado').count()` | 🔴 Crítica | Operación | Tiempo real (Socket.IO) | Badge con contador + alerta si > 50 |
| A2.3 | **Tiempo Promedio de Revisión KYC** | `AVG(revisado_en - fecha_envio)` para documentos aprobados/rechazados últimos 30 días | SQL `AVG(EXTRACT(EPOCH FROM (revisado_en - fecha_envio))/3600)` | 🟠 Alta | Operación | Diaria | Histograma + p50/p90/p99 |
| A2.4 | **Tasa de Aprobación KYC** | `% documentos aprobados / (aprobados + rechazados)` por tipo de documento | Group by `documento_clave` | 🟠 Alta | Confianza | Semanal | Bar chart por tipo doc |
| A2.5 | **KYC Multi-instancia Activo** | Conteo de usuarios con >1 instancia de `validacion_profesional`, `cert_bancaria`, `certificado_laboral` | `DocumentoUsuario.query.filter(multi_instancia=True).group_by(user_id).having(count>1).count()` | 🟢 Baja | Crecimiento | Mensual | KPI card |
| A2.6 | **Usuarios Bloqueados por KYC Incompleto** | Usuarios que intentaron publicar/ofertar (`REQUIRE_KYC_TO_PUBLISH/OFFER=1`) y fueron rechazados | Logs de auditoría `action='kyc.gate.blocked'` | 🟠 Alta | Adquisición | Diaria | Línea temporal + correlación con A1.3 |

### A3. Perfiles y TrustScore (RF-24, TrustScore model)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| A3.1 | **Distribución TrustScore Niveles** | Conteo de PDS por nivel: `nuevo` (0–0.4), `confiable` (0.4–0.6), `verificado` (0.6–0.8), `experto` (0.8–1.0) | `TrustScore.query.group_by(TrustScore.nivel).count()` | 🔴 Crítica | Confianza / Retención | Tiempo real (recalculo Celery) | Funnel invertido + % en experto |
| A3.2 | **TrustScore Promedio Global** | `AVG(puntuacion)` de todos los PDS | `db.func.avg(TrustScore.puntuacion)` | 🟠 Alta | Confianza | Diaria | Gauge 0–1 |
| A3.3 | **Componentes TrustScore Promedio** | Desglose promedio de los 5 pesos: KYC (25%), Rating (25%), Contratos (20%), Portfolio (15%), Referidos (15%) | `AVG` de cada columna componente | 🟡 Media | Confianza | Semanal | Radar chart |
| A3.4 | **PDS con Portfolio Aprobado > 0** | `% PDS con al menos 1 `PortfolioItem.estado='aprobado'` | `PortfolioItem.query.filter(estado='aprobado').distinct(pds_id).count() / User.query.filter(rol='pds').count()` | 🟡 Media | Confianza | Semanal | KPI card |
| A3.5 | **Perfiles Completos (`perfil_completo=true`)** | % PDS/Solicitantes con perfil 100% según onboarding | `Profile.query.filter(perfil_completo=True).count() / User.query.filter(rol.in_(['pds','solicitante'])).count()` | 🟠 Alta | Adquisición | Diaria | KPI card + trend |

---

## MÓDULO B — MOTOR DE MATCH/RECOMENDACIÓN IA (Macro-módulo B)

### B1. Rendimiento del Pipeline ML (RF-33, RF-34, RF-35)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| B1.1 | **Feature Flag `ml_ranking_enabled`** | Estado actual (ON/OFF) + % tiempo activo últimos 30 días | `Config.query.filter(clave='ml_ranking_enabled').first().valor` + auditoría | 🔴 Crítica | Operación | Tiempo real | Toggle badge + uptime % |
| B1.2 | **Requests de Recomendación/día** | Llamadas a `/api/v1/ai/recommend` (retrieval + ranking) | `RecommendationLog.query.filter(creado_en >= today()).count()` | 🟠 Alta | Crecimiento | Diaria | Línea temporal + media móvil 7d |
| B1.3 | **Latencia Promedio Pipeline (p50/p95/p99)** | Tiempo total retrieval + ranking en ms | `RecommendationLog` campos `latencia_retrieval_ms`, `latencia_ranking_ms` | 🔴 Crítica | Operación | Tiempo real | Histograma + SLA badge (<200ms p95) |
| B1.4 | **Tasa de Fallback (ML → Heurístico)** | % requests donde `ml_ranking_enabled=false` O error en ranking → usa heurística geo/categoría | `COUNT(fallback=True) / COUNT(*)` | 🟠 Alta | Operación | Diaria | KPI card + alerta si > 10% |
| B1.5 | **CTR Recomendaciones** | % solicitudes donde el PDS hace clic en "Ofertar" tras ver recomendación | `RecommendationLog.query.filter(clicked=True).count() / RecommendationLog.query.count()` | 🔴 Crítica | Crecimiento / Retención | Diaria | Línea temporal + cohortes |
| B1.6 | **Conversión Recomendación → Contrato** | % recomendaciones que terminan en `Contract.estado='completado'` | Join `RecommendationLog` → `Oferta` → `Contract` | 🔴 Crítica | Ingresos / Crecimiento | Semanal | Funnel: Impresión → Clic → Oferta → Contrato → Completado |
| B1.7 | **Explicabilidad Score Promedio** | Promedio de `explanation_score` (0–1) devuelto en ranking — transparencia algorítmica (NFR) | `AVG(RecommendationLog.explanation_score)` | 🟡 Media | Confianza / Cumplimiento | Semanal | Gauge + distribución |
| B1.8 | **Cobertura Geoespacial (PostGIS ST_DWithin)** | % solicitudes con al menos 1 PDS en radio `radio_km` (cascada geoespacial) | `Solicitud` con `EXISTS PDS en ST_DWithin(geom, radio_km)` | 🟠 Alta | Operación | Diaria | Mapa de calor cobertura |

### B2. Exploración y Postulación (RF-03, RF-04, RF-05)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| B2.1 | **Solicitudes Publicadas/día** | `Solicitud.estado='publicado'` creadas hoy | `Solicitud.query.filter(estado='publicado', creado_en >= today()).count()` | 🔴 Crítica | Adquisición | Tiempo real | KPI card + sparkline |
| B2.2 | **Ofertas por Solicitud (Promedio)** | `AVG(COUNT(Oferta) GROUP BY solicitud_id)` para solicitudes publicadas | Subquery | 🟠 Alta | Operación | Diaria | Histograma (0, 1, 2, 3, 4+) |
| B2.3 | **Tasa de Postulación (Solicitudes con ≥1 oferta)** | `COUNT(DISTINCT solicitud_id FROM Oferta) / COUNT(Solicitud PUBLICADO)` | Derivada | 🔴 Crítica | Crecimiento | Diaria | KPI card % |
| B2.4 | **Tiempo Medio Primera Oferta** | `AVG(MIN(Oferta.created_at) - Solicitud.creado_en)` para solicitudes con ofertas | SQL window function | 🟠 Alta | Operación | Diaria | Box plot por urgencia (hoy/semana/flexible) |
| B2.5 | **Distribución por Urgencia** | % solicitudes `urgencia=hoy/semana/flexible` | `Solicitud.query.group_by(urgencia).count()` | 🟡 Media | Operación | Diaria | Stacked bar |
| B2.6 | **Solicitudes con Imagen 360°** | % solicitudes con `imagen_360 IS NOT NULL` (uso Macro-módulo C) | `Solicitud.query.filter(imagen_360.isnot(None)).count() / total` | 🟢 Baja | Crecimiento | Semanal | KPI card |

---

## MÓDULO C — VISUALIZACIÓN 3D E INTERACCIÓN INMERSIVA (Macro-módulo C)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| C1.1 | **Uso Mapbox 3D (Sesiones/día)** | Sesiones frontend con evento `mapbox_3d_load` (telemetría cliente) | `AnalyticsEvent.query.filter(evento='mapbox_3d_load').count()` | 🟡 Media | Crecimiento | Diaria | Línea temporal |
| C1.2 | **Panorámicas 360° Cargadas** | Eventos `aframe_360_load` exitosos | `AnalyticsEvent.query.filter(evento='aframe_360_load', success=True).count()` | 🟡 Media | Crecimiento | Diaria | KPI card |
| C1.3 | **Tasa de Error WebGL/Shader** | % eventos 3D con `success=false` (fallback SwiftShader, errores GPU) | `COUNT(success=False) / COUNT(*)` | 🟠 Alta | Operación / Usabilidad | Tiempo real | Alerta + trend |
| C1.4 | **Evidencias 360° en Chamba** | `Chamba.evidencia_entrada/salida` con URLs tipo `360/` (MinIO) | `Chamba.query.filter(evidencia_entrada @> '[{"tipo":"360"}]').count()` | 🟢 Baja | Confianza | Semanal | KPI card |
| C1.5 | **Geocercas Dinámicas Activas** | `Solicitud.radio_km` + `Chamba` check-in GPS Haversine < 100m | `Chamba` con `fecha_inicio_obra` y coordenadas válidas | 🟠 Alta | Operación | Diaria | Mapa + % check-ins válidos |

---

## MÓDULO D — GESTIÓN CONTRACTUAL Y TRAZABILIDAD (Macro-módulo D)

### D1. Negociación y Contratos (RF-06, RF-07, RF-23)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D1.1 | **Contratos Creados/día** | `Contract` nuevos (estado `pendiente`) | `Contract.query.filter(creado_en >= today()).count()` | 🔴 Crítica | Ingresos | Tiempo real | KPI card + sparkline |
| D1.2 | **Tasa de Firma Bilateral** | % contratos con `firma_solicitante=true AND firma_proveedor=true` / total contratos | `Contract.query.filter(firma_solicitante=True, firma_proveedor=True).count() / Contract.query.count()` | 🔴 Crítica | Ingresos / Operación | Diaria | Funnel: Creado → Firma Solicitante → Firma Proveedor → Activo |
| D1.3 | **Tiempo Promedio Firma (h)** | `AVG(GREATEST(firmado_solicitante_en, firmado_proveedor_en) - creado_en)` | SQL | 🟠 Alta | Operación | Diaria | Box plot |
| D1.4 | **Contratos con Contraoferta** | % contratos originados de `Oferta.estado='contraoferta'` aceptada | Join `Contract.oferta_id` → `Oferta` | 🟡 Media | Operación | Semanal | KPI card |
| D1.5 | **Monto Promedio Contrato (COP)** | `AVG(monto)` de contratos firmados | `Contract.query.filter(firma_solicitante=True, firma_proveedor=True).with_entities(func.avg(monto))` | 🟠 Alta | Ingresos | Diaria | Gauge COP + trend |
| D1.6 | **Cobro en Monedas al Firmar** | Total monedas cobradas (`cobro_solicitante_monedas + cobro_proveedor_monedas`) / día | `SUM(cobro_solicitante_monedas + cobro_proveedor_monedas) GROUP BY DATE(creado_en)` | 🟡 Media | Ingresos | Diaria | Línea temporal COP equivalente |

### D2. Ciclo Operativo — FSM 6 Hitos (RF-20, RF-21, RF-22, Chamba model)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D2.1 | **Distribución Estados Chamba** | Conteo por `EstadoChamba`: PROGRAMADA, EN_PROCESO, EN_EJECUCION, PAUSADA, PENDIENTE_VALIDACION, LIQUIDACION_CONFIRMADA, FINALIZADA | `Chamba.query.group_by(estado).count()` | 🔴 Crítica | Operación | Tiempo real | Sankey diagram flujo estados |
| D2.2 | **Tasa de Finalización Exitosa** | `COUNT(estado='finalizada') / COUNT(estado IN ('programada','en_proceso','en_ejecucion','pausada','pendiente_validacion','liquidacion_confirmada','finalizada'))` | Derivada | 🔴 Crítica | Ingresos / Confianza | Diaria | KPI card % + trend 30d |
| D2.3 | **Tiempo Promedio por Hito (h)** | Duración media entre hitos consecutivos: `fecha_activacion → fecha_inicio_obra → fecha_solicitud_cierre → fecha_validacion → fecha_liquidacion → fecha_finalizacion` | `AVG` de diferencias por par de hitos | 🟠 Alta | Operación | Semanal | Gantt chart promedio + p50/p90 |
| D2.4 | **Tasa de Pausa (Botón Pánico)** | % chambas que pasan por `PAUSADA` | `COUNT(estado_previo IS NOT NULL) / COUNT(*)` | 🟠 Alta | Operación / Seguridad | Diaria | KPI card + alerta si > 5% |
| D2.5 | **Adendas por Chamba (Promedio)** | `AVG(JSON_ARRAY_LENGTH(adendas))` | `Chamba` | 🟡 Media | Ingresos (upsell) | Semanal | Histograma |
| D2.6 | **Novedades/Incidencias Reportadas** | Total `novedades` items / chambas en ejecución | `Chamba.query.filter(estado.in_(['en_proceso','en_ejecucion'])).with_entities(func.sum(JSON_ARRAY_LENGTH(novedades)))` | 🟡 Media | Operación | Diaria | Línea temporal |
| D2.7 | **Evidencias Fotográficas Completas** | % chambas con `evidencia_entrada` Y `evidencia_salida` no vacías | `Chamba.query.filter(evidencia_entrada != '[]', evidencia_salida != '[]').count() / Chamba.query.filter(estado='finalizada').count()` | 🔴 Crítica | Confianza / Cumplimiento | Diaria | KPI card % |

### D3. Pago Dual y Calificación 360° (RF-08, RF-09, RF-23, Payment model)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D3.1 | **Volumen Pagos Completados (COP/día)** | `SUM(Payment.monto) WHERE estado='completado' AND actualizado_en >= today()` | `Payment` | 🔴 Crítica | Ingresos | Tiempo real | KPI card COP + sparkline |
| D3.2 | **Comisión Plataforma (COP/día)** | `SUM(comision_pds + comision_solicitante)` pagos completados — 12% PDS + 8% solicitante (umbral 50k) | `Payment` | 🔴 Crítica | Ingresos | Diaria | KPI card + % sobre volumen |
| D3.3 | **Distribución Pasarela** | % pagos por `pasarela`: `mock`, `nequi`, `pse`, `efectivo` | `Payment.query.group_by(pasarela).count()` | 🟠 Alta | Operación | Diaria | Donut chart |
| D3.4 | **Tasa de Pago Efectivo (Doble Check-in)** | % pagos `pasarela='efectivo'` con `pago_confirmado_solicitante=true AND pago_confirmado_prestador=true` | `Payment` + `Chamba` join | 🔴 Crítica | Operación / Confianza | Diaria | Funnel: Efectivo iniciado → Check-in Solicitante → Check-in Prestador → Confirmado |
| D3.5 | **Tiempo Promedio Liquidación (h)** | `AVG(fecha_liquidacion - fecha_solicitud_cierre)` para chambas completadas | `Chamba` | 🟠 Alta | Operación | Semanal | Box plot |
| D3.6 | **Reembolsos / Disputas de Pago** | `Payment.estado='reembolsado'` count + monto | `Payment.query.filter(estado='reembolsado').count()` | 🟠 Alta | Ingresos / Confianza | Diaria | KPI card + alerta si spike |
| D3.7 | **Calificación Promedio (Estrellas)** | `AVG(Chamba.rating_estrellas)` últimas 30 días | `Chamba.query.filter(rating_estrellas.isnot(None), fecha_finalizacion >= now()-30d).with_entities(func.avg(rating_estrellas))` | 🔴 Crítica | Confianza / Retención | Diaria | Gauge 1–5 + distribución |
| D3.8 | **Tasa de Calificación Bilateral** | % chambas finalizadas CON `rating_estrellas` / total finalizadas | `Chamba.query.filter(estado='finalizada', rating_estrellas.isnot(None)).count() / Chamba.query.filter(estado='finalizada').count()` | 🟠 Alta | Confianza | Diaria | KPI card % |

### D4. Marañas — Micro-trabajos Derivados (RF-49 a RF-60, Marana model)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D4.1 | **Maranas Creadas/día** | `Marana.estado='publicado'` nuevas | `Marana.query.filter(creado_en >= today()).count()` | 🟡 Media | Crecimiento | Diaria | KPI card |
| D4.2 | **Tasa de Asignación Maraña** | % maranas con `pds_asignado_id IS NOT NULL` | `Marana.query.filter(pds_asignado_id.isnot(None)).count() / Marana.query.count()` | 🟠 Alta | Operación | Diaria | KPI card % |
| D4.3 | **Presupuesto Total Marañas (COP)** | `SUM(presupuesto) WHERE estado IN ('completado','pagado')` | `Marana` | 🟡 Media | Ingresos | Semanal | Línea temporal |
| D4.4 | **Tiempo Maraña Publicada → Pagada** | `AVG(fecha_pago - creado_en)` para maranas `estado='pagado'` | `Marana` | 🟡 Media | Operación | Semanal | Box plot |

### D5. Anuncios Laborales y Negocios (RF-67 a RF-69, RF-31 a RF-48, AnuncioLaboral, Negocio models)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D5.1 | **Negocios Registrados (Merchant KYC Aprobado)** | `User.rol='merchant' AND Profile.verificado=true` | Join User+Profile | 🟠 Alta | Crecimiento | Diaria | KPI card |
| D5.2 | **Anuncios Publicados/día** | `AnuncioLaboral.estado='publicado'` nuevos | `AnuncioLaboral.query.filter(creado_en >= today()).count()` | 🟡 Media | Crecimiento | Diaria | KPI card |
| D5.3 | **Modalidad Contrato vs Contacto** | % anuncios `modalidad='contrato'` vs `'contacto'` | `AnuncioLaboral.query.group_by(modalidad).count()` | 🟡 Media | Ingresos | Semanal | Donut chart |
| D5.4 | **Postulaciones por Anuncio (Promedio)** | `AVG(COUNT(AnuncioPostulacion) GROUP BY anuncio_id)` | `AnuncioPostulacion` | 🟡 Media | Operación | Semanal | Histograma |
| D5.5 | **Conversión Anuncio → Contrato** | % postulaciones `estado='contratado'` / total postulaciones (modalidad='contrato') | `AnuncioPostulacion.query.filter(estado='contratado').count() / AnuncioPostulacion.query.filter(anuncio.modalidad='contrato').count()` | 🔴 Crítica | Ingresos | Semanal | Funnel |
| D5.6 | **Ingresos por Comerciante (Top 10)** | `SUM(Contract.monto) GROUP BY negocio_id ORDER BY DESC LIMIT 10` | Join Contract → Solicitud → Negocio | 🟠 Alta | Ingresos | Mensual | Bar chart horizontal |

### D6. Billetera Virtual y Monedas (RF-25, RF-27, Wallet, Coin models)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D6.1 | **Saldo Total COP en Billeteras** | `SUM(Wallet.saldo + Wallet.saldo_bloqueado)` | `Wallet` | 🔴 Crítica | Ingresos / Operación | Tiempo real | KPI card COP |
| D6.2 | **Saldo Bloqueado (Escrow) %** | `SUM(saldo_bloqueado) / SUM(saldo + saldo_bloqueado) * 100` | `Wallet` | 🔴 Crítica | Operación / Riesgo | Tiempo real | Gauge % + alerta si > 30% |
| D6.3 | **Monedas Virtuales en Circulación** | `SUM(Wallet.monedas_saldo)` + `SUM(Coin.cantidad WHERE vence_en > now())` | `Wallet` + `Coin` | 🟠 Alta | Ingresos | Diaria | KPI card + desglose por tipo (comprada/promocional/ganada) |
| D6.4 | **Compras de Paquetes/día (COP)** | `SUM(CompraPaquete.precio_cop) WHERE creado_en >= today()` | `CompraPaquete` | 🔴 Crítica | Ingresos | Tiempo real | KPI card + sparkline |
| D6.5 | **Paquete Más Vendido** | `CompraPaquete GROUP BY paquete_id ORDER BY COUNT(*) DESC LIMIT 1` | `CompraPaquete` | 🟡 Media | Ingresos | Semanal | KPI card + nombre paquete |
| D6.6 | **Gasto Monedas/día (Operaciones)** | `SUM(ABS(cantidad)) FROM MovimientoMonedas WHERE tipo='gasto' AND creado_en >= today()` | `MovimientoMonedas` | 🟠 Alta | Operación | Diaria | Línea temporal |
| D6.7 | **Monedas Vencidas/día (Limpieza)** | `COUNT(Coin WHERE vence_en <= now() AND tipo='promocional')` limpiadas por job Celery | Job log `limpiar_monedas_vencidas` | 🟢 Baja | Operación | Diaria | KPI card |
| D6.8 | **Retiros a Bancaria (COP/día)** | `SUM(Transaction.monto) WHERE tipo='retiro' AND monto < 0 AND created_at >= today()` | `Transaction` | 🔴 Crítica | Ingresos / Confianza | Tiempo real | KPI card + alerta si spike |

### D7. Certificación de Ingresos y Formalización (Ley 527/1999, Decreto 1273/2018)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| D7.1 | **Certificados de Ingresos Generados** | Count de descargas/generaciones de certificación tributaria (endpoint `/wallet/certificado-ingresos`) | `AuditLog.query.filter(action='wallet.certificado_ingresos.generate').count()` | 🟡 Media | Cumplimiento / Confianza | Semanal | KPI card |
| D7.2 | **PDS con Ingresos Certificables (> 0 COP)** | `User.rol='pds' AND Wallet.transactions SUM(monto) > 0` | Join + aggregate | 🟢 Baja | Cumplimiento | Mensual | KPI card % |

---

## MÓDULO E — COMUNICACIÓN Y NOTIFICACIONES (Macro-módulo E)

### E1. Mensajería Tiempo Real (Socket.IO, Chat model)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| E1.1 | **Conexiones Socket.IO Activas** | Usuarios conectados a `user:<id>` room (presencia) | `SocketIO` server metric / Redis `SMEMBERS socketio:rooms:user:*` | 🔴 Crítica | Operación | Tiempo real | Gauge + trend |
| E1.2 | **Mensajes Enviados/día** | `ChatMessage` creados (incluye protocolo `⟦c:...⟧` para acciones contractuales) | `ChatMessage.query.filter(creado_en >= today()).count()` | 🟠 Alta | Operación | Diaria | Línea temporal |
| E1.3 | **Tasa de Mensajes Contractuales** | % mensajes con `tipo IN ('contract_action','offer_action','payment_action')` | `ChatMessage.query.filter(tipo.like('%action%')).count() / total` | 🟡 Media | Confianza | Semanal | KPI card % |
| E1.4 | **Latencia Entrega Socket.IO (p95)** | Tiempo `emit` → `ack` cliente (ms) — instrumentación custom | Métrica Prometheus/Grafana | 🟠 Alta | Usabilidad | Tiempo real | Histograma + SLA < 100ms |
| E1.5 | **Chats Bloqueados por Disputa** | `Dispute.chat_habilitado=false` count | `Dispute.query.filter(chat_habilitado=False).count()` | 🟠 Alta | Operación | Tiempo real | KPI card + alerta |

### E2. Notificaciones Push / In-App (Notification, PushSubscription models)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| E2.1 | **Notificaciones Creadas/día** | `Notification` insertadas (todos los tipos) | `Notification.query.filter(creado_en >= today()).count()` | 🟠 Alta | Operación | Diaria | Línea temporal por tipo |
| E2.2 | **Tasa de Lectura (In-App)** | `COUNT(leida=true) / COUNT(*)` últimos 7 días | `Notification.query.filter(creado_en >= now()-7d)` | 🟠 Alta | Retención | Diaria | KPI card % + trend |
| E2.3 | **Push Entregados / Fallidos** | `PushSubscription` + FCM/APNs delivery receipts (log) | `PushLog.query.group_by(status).count()` | 🔴 Crítica | Retención | Tiempo real | KPI cards: Entregados / Fallidos / Tasa |
| E2.4 | **Suscripciones Push Activas** | `PushSubscription` únicas por usuario (endpoint válido) | `PushSubscription.query.distinct(user_id).count()` | 🟡 Media | Retención | Diaria | KPI card |
| E2.5 | **Tipos de Notificación Top 10** | `Notification.tipo` más frecuentes últimos 30 días | `Notification.query.filter(creado_en >= now()-30d).group_by(tipo).order_by(func.count().desc()).limit(10)` | 🟢 Baja | Operación | Semanal | Bar chart horizontal |

---

## MÓDULOS TRANSVERSALES — GOBERNANZA, SEGURIDAD, INFRAESTRUCTURA

### G1. Feature Flags y Configuración Dinámica (Config model, 9 ADRs)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| G1.1 | **Flags Activos Totales** | `Config` con `clave` tipo flag + `valor='true'` | `Config.query.filter(valor='true', clave.like('%flag%') OR clave.like('%enabled%')).count()` | 🟠 Alta | Operación | Tiempo real | KPI card + lista toggle |
| G1.2 | **Cambios de Config/día (Auditoría)** | `AuditLog.action='config.update'` | `AuditLog` | 🟡 Media | Seguridad / Operación | Diaria | Línea temporal |
| G1.3 | **Kill Switches Activos** | Flags críticos: `ml_ranking_enabled`, `maintenance_mode`, `payments_enabled`, `kyc_required` | `Config.query.filter(clave.in_(...)).all()` | 🔴 Crítica | Operación / Riesgo | Tiempo real | Status badges (ROJO/VERDE) |

### G2. Auditoría Forense e Inmutabilidad (AuditLog model, ADR-8)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| G2.1 | **Logs de Auditoría/día** | `AuditLog` insertados | `AuditLog.query.filter(creado_en >= today()).count()` | 🟡 Media | Seguridad / Cumplimiento | Diaria | Línea temporal |
| G2.2 | **Acciones Críticas Auditadas** | Count de `action IN ('user.status.update', 'user.role.update', 'contract.moderate', 'payment.refund', 'kyc.approve', 'kyc.reject')` | `AuditLog.query.filter(action.in_(...)).count()` | 🔴 Crítica | Seguridad / Cumplimiento | Tiempo real | Tabla accion x actor x tiempo |
| G2.3 | **Integridad Referencial BD** | % tablas con FK válidas (job nocturno `pg_check_constraints`) | Job result log | 🟠 Alta | Cumplimiento | Diaria | Badge OK/FAIL + detalle |

### G3. Scoping Regional Estricto (ADR-3, Region model)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| G3.1 | **Usuarios por Región (Heatmap)** | `User.region_id` distribution | `User.query.group_by(region_id).count()` | 🟠 Alta | Operación | Diaria | Mapa coroplético Colombia |
| G3.2 | **Admins/Verificadores/Soporte por Región** | Staff `region_id` coverage | `User.query.filter(rol.in_(['admin','verificador','soporte'])).group_by(region_id).count()` | 🟠 Alta | Operación | Diaria | Tabla región x rol |
| G3.3 | **Contratos Cruzados Región (Violaciones)** | `Contract` donde `solicitante.region_id != proveedor.region_id` (debería ser 0) | `Contract` join `User` x2 | 🔴 Crítica | Seguridad / Cumplimiento | Tiempo real | Alerta inmediata si > 0 |

### G4. Revocación JWT y Seguridad (ADR-2, User.role_version)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| G4.1 | **Revocaciones de Tokens/día** | `User.role_version` incrementos (cambio rol/status/2FA) | `AuditLog.query.filter(action.in_(['user.status.update','user.role.update','user.two_factor.update'])).count()` | 🟠 Alta | Seguridad | Diaria | KPI card |
| G4.2 | **Intentos Login Fallidos (Brute Force)** | `AuditLog.action='auth.login.failed'` agrupado por IP/usuario | `AuditLog` | 🔴 Crítica | Seguridad | Tiempo real | Alerta si > 10/min/IP |
| G4.3 | **Cuentas Suspendidas/Baneadas** | `User.status IN ('suspended','banned')` count | `User.query.filter(status.in_(...)).count()` | 🟠 Alta | Seguridad / Operación | Diaria | KPI cards |

### G5. Infraestructura y Rendimiento (NFR: Performance, 218 endpoints)

| # | Métrica | Descripción | Fuente / Fórmula | Nivel | Impacto | Frec. | Visualización |
|---|---------|-------------|------------------|-------|---------|-------|---------------|
| G5.1 | **Latencia API p50/p95/p99 (ms)** | Por endpoint crítico (`/chambas`, `/solicitudes`, `/ai/recommend`, `/wallet`, `/chat`) | Prometheus `http_request_duration_seconds` | 🔴 Crítica | Operación / Usabilidad | Tiempo real | Heatmap endpoint x percentil |
| G5.2 | **Error Rate 5xx (%)** | `COUNT(status>=500) / COUNT(*)` por endpoint | Prometheus | 🔴 Crítica | Operación | Tiempo real | Línea temporal + alerta > 1% |
| G5.3 | **Throughput (RPS)** | Requests/segundo totales y por blueprint | Prometheus | 🟠 Alta | Operación | Tiempo real | Línea temporal |
| G5.4 | **Celery Queue Lag** | Tareas pendientes en Redis por cola (`default`, `notifications`, `ml_ranking`, `wallet_cleanup`) | Redis `LLEN` | 🟠 Alta | Operación | Tiempo real | Gauge por cola + alerta > 1000 |
| G5.5 | **DB Conexiones Activas / Max** | `pg_stat_activity` count / `max_connections` | PostgreSQL | 🟠 Alta | Operación | Tiempo real | Gauge % |
| G5.6 | **Cache Hit Rate (Redis)** | `keyspace_hits / (keyspace_hits + keyspace_misses)` | Redis `INFO STATS` | 🟡 Media | Operación | Diaria | KPI card % |
| G5.7 | **Almacenamiento MinIO (GB)** | Tamaño bucket `evidencias`, `kyc`, `panoramas360` | MinIO admin API | 🟡 Media | Operación / Costos | Diaria | Línea temporal + proyección |
| G5.8 | **Disco PostgreSQL (GB / %)** | `pg_database_size('chambeapp')` | PostgreSQL | 🟠 Alta | Operación | Diaria | Gauge % + alerta > 80% |

---

## DASHBOARDS POR ROL — VISTAS RECOMENDADAS

| Rol | Vistas Principales | Métricas Clave (Subconjunto) |
|-----|-------------------|------------------------------|
| **Superadmin** | System Health, Governance, Revenue, Security, Infra | G1.1, G1.3, G2.2, G3.3, G4.2, G5.1–G5.8, D3.1, D3.2, D6.1, D6.2, A1.2, A1.4 |
| **Admin (Regional)** | Regional Operations, KYC Queue, Disputes, Users | A1.6, A2.2, A2.3, D1.1, D1.2, D2.1, D2.2, D3.4, D3.7, E2.1, E2.2, G3.1, G3.2 |
| **Verificador** | KYC Pipeline, Document Review SLA | A2.1, A2.2, A2.3, A2.4, A2.6 |
| **Soporte** | Disputes, Tickets, Chat Blocked, Notifications | D1.6 (disputes), E1.5, E2.3, G2.2 |
| **Merchant (Negocio)** | Anuncios, Postulaciones, Contratos, Ingresos | D5.1–D5.6, D1.1, D1.5, D3.1 |
| **PDS (Prestador)** | TrustScore, Chamba Pipeline, Wallet, Ratings | A3.1, A3.2, D2.1, D2.2, D2.7, D3.7, D6.3, D6.8 |
| **Solicitante** | Solicitudes, Ofertas, Chamba Tracking, Pagos | B2.1, B2.2, B2.3, D2.1, D3.4, D3.7 |

---

## IMPLEMENTACIÓN TÉCNICA RECOMENDADA

### Stack de Métricas
| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Colección** | Prometheus (Pushgateway para jobs Celery) + OpenTelemetry Python (Flask) | Estándar cloud-native, compatible con 218 endpoints |
| **Almacenamiento** | Prometheus TSDB (retención 15d) + Thanos para largo plazo (1a) | Coste-efectivo, query PromQL |
| **Visualización** | Grafana (dashboards por rol, alerting) + Admin Frontend embebido (iframe/SSO) | Grafana para ops; React para negocio |
| **Tiempo Real** | Socket.IO server metrics → Prometheus exporter + WebSocket a frontend admin | Sub-segundo para KPIs críticos |
| **Logs Estructurados** | Loki + Promtail (audit_logs, application logs) | Correlación logs-métricas |
| **Alerting** | Alertmanager → PagerDuty/Slack/WhatsApp (webhook) | Escalamiento por severidad |

### Endpoints de Métricas Requeridos (Backend)
```python
# Nuevos endpoints en admin.py / superadmin.py
GET /api/v1/admin/metrics/overview          # KPIs críticos tiempo real (cache 10s)
GET /api/v1/admin/metrics/timeseries        # Series temporales (PromQL proxy)
GET /api/v1/admin/metrics/kyc/pipeline      # A2.1–A2.6
GET /api/v1/admin/metrics/trustscore        # A3.1–A3.5
GET /api/v1/admin/metrics/ml/pipeline       # B1.1–B1.8
GET /api/v1/admin/metrics/contracts/funnel  # D1.1–D1.6
GET /api/v1/admin/metrics/chamba/fsm        # D2.1–D2.7
GET /api/v1/admin/metrics/payments/dual     # D3.1–D3.8
GET /api/v1/admin/metrics/wallet/coins      # D6.1–D6.8
GET /api/v1/admin/metrics/realtime/socket   # E1.1–E1.5
GET /api/v1/admin/metrics/notifications     # E2.1–E2.5
GET /api/v1/superadmin/metrics/governance   # G1–G5
GET /api/v1/superadmin/metrics/infra        # G5.1–G5.8 (Prometheus proxy)
```

### Caché y Performance
- **KPIs críticos (🔴):** Cache Redis 10s, invalidación por evento (Socket.IO emit `metrics:updated`)
- **KPIs operativos (🟠):** Cache 60s
- **KPIs tácticos (🟡):** Cache 5min, pre-agregados en tabla `metrics_daily` (job Celery 00:05 UTC)
- **KPIs estratégicos (🟢):** Materialized views refrescadas 1h

### Esquema de Tabla de Agregados Diarios (Sugerida)
```sql
CREATE TABLE metrics_daily (
    date DATE PRIMARY KEY,
    -- Usuario
    users_total INT, users_active INT, mau INT, dau INT,
    activation_rate_d1 NUMERIC, activation_rate_d7 NUMERIC, activation_rate_d30 NUMERIC,
    pds_count INT, solicitante_count INT, merchant_count INT, ratio_pds_solicitante NUMERIC,
    -- KYC
    kyc_completion_pds NUMERIC, kyc_completion_solicitante NUMERIC, kyc_pending_review INT,
    kyc_avg_review_hours NUMERIC, kyc_approval_rate NUMERIC,
    -- TrustScore
    trust_avg NUMERIC, trust_nuevo INT, trust_confiable INT, trust_verificado INT, trust_experto INT,
    -- ML
    ml_requests INT, ml_latency_p95 INT, ml_fallback_rate NUMERIC, ml_ctr NUMERIC, ml_conv_rate NUMERIC,
    -- Solicitudes/Ofertas
    solicitudes_publicadas INT, ofertas_por_solicitud NUMERIC, postulacion_rate NUMERIC,
    primera_oferta_horas NUMERIC,
    -- Contratos/Chamba
    contratos_creados INT, firma_bilateral_rate NUMERIC, monto_promedio_contrato NUMERIC,
    chamba_finalizada INT, chamba_finalizacion_rate NUMERIC, avg_hito_hours JSONB,
    evidencias_completas_rate NUMERIC,
    -- Pagos
    volumen_pagos_cop BIGINT, comision_plataforma_cop BIGINT, pago_efectivo_rate NUMERIC,
    rating_promedio NUMERIC, calificacion_bilateral_rate NUMERIC,
    -- Wallet/Monedas
    saldo_total_cop BIGINT, saldo_bloqueado_pct NUMERIC, monedas_circulacion INT,
    compras_paquetes_cop BIGINT, retiros_cop BIGINT,
    -- Notificaciones/Chat
    notificaciones_creadas INT, notificaciones_leidas_rate NUMERIC,
    push_entregados INT, push_fallidos INT, socket_conexiones_activas INT,
    -- Infra
    api_latency_p95 INT, error_rate_5xx NUMERIC, db_conexiones_pct NUMERIC,
    minio_storage_gb NUMERIC
);
```

---

## PRIORIZACIÓN DE IMPLEMENTACIÓN (Roadmap)

| Sprint | Foco | Métricas Entregables | Esfuerzo |
|--------|------|---------------------|----------|
| **1** | **Core Crítico** | A1.2, A1.4, A1.5, D1.1, D1.2, D2.1, D2.2, D3.1, D3.2, D3.4, D3.7, G5.1, G5.2 | 3 SP |
| **2** | **KYC + TrustScore** | A2.1–A2.4, A3.1–A3.3 | 3 SP |
| **3** | **ML + Búsqueda** | B1.1–B1.6, B2.1–B2.4 | 3 SP |
| **4** | **Chamba FSM + Pagos** | D2.3–D2.7, D3.3, D3.5, D3.6, D3.8 | 3 SP |
| **5** | **Wallet/Monedas + Marañas/Anuncios** | D6.1–D6.8, D4.1–D4.4, D5.1–D5.6 | 3 SP |
| **6** | **Tiempo Real + Notificaciones** | E1.1–E1.5, E2.1–E2.5 | 2 SP |
| **7** | **Gobernanza + Infra + Regional** | G1.1–G1.3, G2.1–G2.3, G3.1–G3.3, G4.1–G4.3, G5.3–G5.8 | 3 SP |
| **8** | **Dashboards por Rol + Alertas** | Vistas Superadmin, Admin, Verificador, Soporte, Merchant, PDS, Solicitante | 3 SP |
| **Total** | | **80+ métricas, 8 dashboards, alerting completo** | **23 SP** |

---

## CRITERIOS DE ACEPTACIÓN POR MÉTRICA (Ejemplo)

| Métrica | Criterio de Aceptación |
|---------|------------------------|
| D2.2 Tasa Finalización | Dashboard muestra % con 1 decimal; trend 30d; alerta si < 80% por 3 días consecutivos |
| B1.3 Latencia ML | p95 < 200ms; histograma con buckets [50,100,200,500,1000,>1000]; badge ROJO si p95 > 200ms |
| D6.2 Saldo Bloqueado % | Gauge 0–100%; ámbar > 20%, rojo > 30%; tooltip con COP absolutos |
| G3.3 Contratos Cruzados Región | **Cero tolerancia**: alerta inmediata (P1) si count > 0; auditoría automática |
| A2.2 KYC Pendientes | Badge en header admin; WebSocket push cada cambio; sound notification si > 50 |

---

## ANEXO: TRAZABILIDAD A ARTEFACTOS DEL PROYECTO

| Métrica | RF / HU | Diagrama Secuencia | Diagrama Estructural | Flujo E2E Auditado |
|---------|---------|-------------------|---------------------|-------------------|
| A2.1 KYC Completion | RF-17, RF-18, RF-19 | Fig 8 (Auth/KYC) | Fig 19 (Flujo KYC) | Flujo 02 (KYC) |
| B1.1 ML Flag | RF-33, RF-34, RF-35 | Fig 13 (Pipeline ML) | Fig 13 (Pipeline ML) | Flujo 03 (Exploración/Postulación) |
| D2.1 Chamba FSM | RF-20, RF-21, RF-22 | Fig 10 (FSM 6 hitos) | Fig 10 (FSM) | Flujo 06 (Ejecución Ciclo Operativo) |
| D3.4 Pago Efectivo | RF-08, RF-23 | Fig 11 (Pago Dual) | Fig 11 (Billetera) | Flujo 07 (Pago Dual/Calificación) |
| D6.1 Wallet Saldos | RF-25, RF-27 | Fig 11 (Billetera) | Fig 11 (Billetera) | Flujo 07 |
| G3.3 Regional Scoping | ADR-3 | Fig 17 (Moderación) | Fig 16 (Infra Regional) | Flujo 14 (Gobernanza) |

---

*Documento generado como parte de la especificación de resultados esperados del anteproyecto de grado. Cada métrica es trazable a requerimientos funcionales, no funcionales, decisiones arquitectónicas y flujos de validación automatizada.*