# Narrativa: Alcance Real — Push Notifications que Llegan

**KPI Asociado:** D4.7  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** 4. Gobernanza, Integridad y Riesgos Sociales

---

## La Historia

Una **notificación push no entregada** es **información negada**. Alerta Ley 1429, oferta nueva, chat mensaje, pago confirmado — si no llega, **el usuario pierde oportunidad, dinero, derecho**. La **tasa de entrega push (D4.7)** es **infraestructura crítica**: < 95% = falla de infra o permisos.

---

## Qué Nos Dice Realmente

| Push Delivery Rate | Interpretación | Acción Inmediata |
|--------------------|----------------|------------------|
| **> 98%** | Infra sana: FCM/APNs configurados, permisos bien pedidos, reintento exponencial, fallback in-app | Mantener: monitoreo diario |
| **95–98%** | Gap: algunos dispositivos (iOS 15+, Android 13+ restricciones), tokens expirados, usuario revocó permiso | Limpieza tokens diaria / re-solicitud permisos contextual / fallback email crítico |
| **< 95%** | **Fallo**: tokens masivos inválidos, certificado APNs expirado, quota FCM excedida | **Alerta P1**: limpieza masiva tokens / renovar cert APNs / revisar quota FCM |

---

## Segmentación Obligatoria

- **Por rol:** PDS (ofertas urgentes, pagos) y Solicitante (ofertas recibidas, pagos) = **> 99%** / Verificador (KYC pendiente) = **> 95%** / Admin (alertas P1) = **100%**
- **Por criticidad:** P1 (pago, alerta Ley 1429, disputa) = 100% / P2 (oferta, chat, chamba) = 98% / P3 (marketing, genérico) = 95%
- **Por dispositivo:** iOS (APNs, permisos estrictos, 98% target) vs Android (FCM, permisos flexibles, 99% target)
- **Por canal:** Push (FCM/APNs) vs In-App (centro alertas) vs Email (fallback crítico)

---

## Palancas de Intervención

1. **Gestión tokens proactiva:** Limpieza diaria tokens inválidos/expirados/revocados → re-registro automático al abrir app
2. **Solicitud permisos contextual:** "Para recibir ofertas cerca de ti, activa notificaciones" (no al instalar, al necesitar)
2. **Prioridad visual en centro alertas:** P1: rojo + sonido + vibración / P2: naranja / P3: gris agrupado
2. **Fallback Email:** Push fallido 3x → Email automático (crítico: pago, alerta Ley 1429)
2. **Agrupación inteligente:** 5 ofertas en 10min → 1 notificación "5 ofertas cerca de ti" + deep link lista
2. **Re-solicitud permisos:** Usuario revocó → banner in-app "Activa notificaciones para no perder ofertas" + deep link settings

---

## Riesgo Si Se Ignora

- **Push delivery < 95%** → Usuario pierde: oferta (dinero), pago (dinero), alerta Ley 1429 (derecho), chat (negociación)
- **Lectura in-app < 40%** → Centro alertas = ruido → usuario ignora todo → pierde críticas
- **Suscripciones < 60% MAU** → Base instalada no recibe push → canal muerto

---

## Métricas Complementarias

- **E1.1 (Conexiones Socket.IO)** → Push = fallback si Socket.IO off
- **B2.4 (Tiempo 1ª Oferta)** → Push geo = canal crítico ofertas
- **D3.4 (Pago Efectivo)** → Push confirmación pago = dual check-in
- **D3.2 (Alertas Ley 1429)** → Push crítico = derecho formalización
- **E2.2 (Lectura In-App)** → Centro alertas usable = push leído

---

## Alineación Estándares

- **RF-UI-1** — Notificaciones Real-time implementado
- **RF-10** — Alertas Formalización (Ley 1429/1562)
- **RNF-01** — Usabilidad (centro alertas usable, no ruido)
- **RNF-06** — Confiabilidad Pagos (push pago = dual check-in)
- **ODS 9.c** — Acceso TIC universal (notificaciones accesibles)

---

## Plantilla de Decisión (Para Backend Lead/PM Producto/DevOps)

> **Si ahora:** Push delivery < 95% **O** Fallidos > 3%  
> **Entonces:** 1) Limpiar tokens inválidos (job diario) 2) Revisar cert APNs / quota FCM 3) Alerta Slack #push-alerts 4) Email fallback crítico  
> **Owner:** Backend Lead + DevOps  
> **Revisión:** Tiempo real (alertas) + Cada 15min en incidente