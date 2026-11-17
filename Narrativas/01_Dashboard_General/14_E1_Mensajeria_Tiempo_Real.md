# Narrativa: Mensajería Tiempo Real (Módulo E)

**KPIs Asociados:** E1.1–E1.5  
**Nivel:** 🔴 Crítico (tiempo real) / 🟡 Operativo (diario)  
**Dimensión:** Módulo E — Mensajería Tiempo Real (Socket.IO)

---

## La Historia

El **chat Socket.IO** no es "feature social": es **infraestructura contractual**. El protocolo `⟦c:...⟧` permite **acciones contractuales por chat** (oferta, aceptación, pago, firma). Si **latencia entrega > 100ms** o **conexiones caen**, **las negociaciones se rompen**, las ofertas expiran, los pagos se atrasan. Las **conexiones activas (E1.1)** son el **pulso de la plataforma viva**.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Conexiones Socket.IO (E1.1)** | > 80% MAU conectados | 60–80% | < 60% | Revisar reconexión automática / heartbeats / escalado workers |
| **Mensajes/día (E1.2)** | Creciente + alineado contratos | Plano | Caída > 20% | Revisar UX chat / notificaciones push / fricción |
| **Tasa Mensajes Contractuales (E1.3)** | > 15% | 10–15% | < 10% | UX: botones "Aceptar Oferta" / "Confirmar Pago" en chat |
| **Latencia Entrega p95 (E1.4)** | < 100ms | 100–300ms | > 300ms | Scale Socket.IO workers / Redis pub/sub / conexión persistente |
| **Chats Bloqueados Disputa (E1.5)** | 0 | 1–5 | > 5 | Mediación Soporte urgente / desbloqueo automático tras resolución |

---

## Segmentación Obligatoria

- **Por tipo mensaje:** Contractual (`⟦c:...⟧`) vs Conversacional vs Sistema (notificaciones)
- **Por contexto:** Negociación oferta vs Coordinación chamba vs Disputa vs Soporte
- **Por rol:** PDS↔Solicitante (mayoría) vs Merchant↔PDS (anuncios) vs Soporte↔Usuario
- **Por estado:** Chat activo vs Bloqueado (disputa) vs Archivado (chamba finalizada)

---

## Palancas de Intervención

1. **Reconexión automática agresiva** → Exponential backoff (1s, 2s, 4s, 8s, max 30s) + heartbeats 30s
2. **Acciones contractuales 1-click en chat** → Botones "✅ Aceptar Oferta" / "💰 Confirmar Pago" / "✍️ Firmar" inline
2. **Offline queue** → Mensajes en cola local (IndexedDB) → flush al reconectar
2. **Prioridad contractual** → Mensajes `⟦c:...⟧` prioridad alta en cola Socket.IO / QoS 1
2. **Desbloqueo automático** → Disputa resuelta → chat se desbloquea auto + notificación ambos

---

## Riesgo Si Se Ignora

- **Latencia > 300ms** → Usuario percibe "lag" → abandona chat → negociación muere
- **Conexiones < 60% MAU** → Push notifications fallan → ofertas expiran / pagos atrasan
- **Chats bloqueados > 5** → Disputas no resueltas → Soporte saturado / usuarios frustrados

---

## Métricas Complementarias

- **E2.3 (Push Delivery)** → Push = fallback si Socket.IO desconectado
- **B2.4 (Tiempo 1ª Oferta)** → Chat = canal negociación → tiempo oferta
- **D1.2 (Firma Bilateral)** → Chat = canal negociación → firma
- **D3.4 (Pago Efectivo)** → Chat = coordinación pago dual check-in

---

## Alineación Estándares

- **RF-UI-1** — Notificaciones Real-time Socket.IO implementado
- **RF-16** — Comunicación Tiempo Real
- **RNF-04** — Rendimiento (latencia < 100ms p95)
- **RF-23** — Confirmación Dual (coordinación por chat)

---

## Plantilla de Decisión

> **Si ahora:** Latencia p95 > 300ms **O** Conexiones activas < 60% MAU  
> **Entonces:** 1) Scale Socket.IO workers (horizontal) 2) Revisar Redis pub/sub / heartbeats 3) Alerta Slack #infra-alerts  
> **Owner:** Backend Lead  
> **Revisión:** Tiempo real (alertas) + Cada 15min en incidente