# Narrativa: Notificaciones Push / In-App (Módulo E)

**KPIs Asociados:** E2.1–E2.5  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo E — Notificaciones Push / In-App

---

## La Historia

Una **notificación push no entregada** es **información negada**. Alerta Ley 1429, oferta nueva, chat mensaje, pago confirmado — si no llega, **el usuario pierde oportunidad, dinero, derecho**. La **tasa de entrega push (E2.3)** es **infraestructura crítica**: < 95% = falla de infra o permisos. La **tasa de lectura in-app (E2.2)** mide si el **centro de alertas** es útil o ruido.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Notificaciones Creadas/día (E2.1)** | Alineada a eventos (contratos, ofertas, pagos) | Pico anómalo > 2x | Caída > 30% (eventos no notifican) | Revisar triggers / workers notificaciones |
| **Tasa Lectura In-App (E2.2)** | > 60% (7d) | 40–60% | < 40% | UX: centro alertas visible / agrupación / prioridad visual |
| **Push Entregados / Fallidos (E2.3)** | Entregados > 98%, Fallidos < 1% | Entregados 95–98%, Fallidos 1–3% | Entregados < 95% / Fallidos > 3% | Tokens inválidos / cert APNs expirado / quota FCM / permisos revocados |
| **Suscripciones Push Activas (E2.4)** | > 80% MAU | 60–80% | < 60% | UX: solicitud permisos contextual / re-solicitud tras revocación |
| **Top 10 Tipos Notificación (E2.5)** | Contratos, Ofertas, Pagos, KYC, Alertas Ley 1429 | Ruido: marketing, genéricos | Ruido > 50% | Limpieza: solo accionables / agrupar / prioridad visual |

---

## Segmentación Obligatoria

- **Por rol:** PDS (ofertas, pagos, chambas) vs Solicitante (ofertas, pagos, chambas) vs Merchant (anuncios, postulaciones) vs Staff (KYC, tickets, disputas)
- **Por criticidad:** P1 (pago, alerta Ley 1429) > P2 (oferta, chat) > P3 (marketing, genérico)
- **Por canal:** Push (FCM/APNs) vs In-App (centro alertas) vs Email (fallback)
- **Por dispositivo:** iOS (APNs, permisos estrictos) vs Android (FCM, permisos flexibles)

---

## Palancas de Intervención

1. **Gestión tokens proactiva** → Limpieza diaria tokens inválidos / expirados / revocados → re-registro automático al abrir app
2. **Solicitud permisos contextual** → "Para recibir ofertas cerca de ti, activa notificaciones" (no al instalar, al necesitar)
2. **Prioridad visual en centro alertas** → P1: rojo + sonido + vibración / P2: naranja / P3: gris agrupado
2. **Fallback Email** → Push fallido 3x → Email automático (crítico: pago, alerta Ley 1429)
2. **Agrupación inteligente** → 5 ofertas en 10min → 1 notificación "5 ofertas cerca de ti" + deep link lista

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

---

## Alineación Estándares

- **RF-UI-1** — Notificaciones Real-time implementado
- **RF-10** — Alertas Formalización (Ley 1429/1562)
- **RNF-01** — Usabilidad (centro alertas usable, no ruido)
- **RNF-06** — Confiabilidad Pagos (push pago = dual check-in)

---

## Plantilla de Decisión

> **Si ahora:** Push delivery < 95% **O** Fallidos > 3%  
> **Entonces:** 1) Limpiar tokens inválidos (job diario) 2) Revisar cert APNs / quota FCM 3) Alerta Slack #push-alerts 4) Email fallback crítico  
> **Owner:** Backend Lead  
> **Revisión:** Tiempo real (alertas) + Cada 15min en incidente