# Narrativa: Billetera Virtual y Monedas (Módulo D)

**KPIs Asociados:** D6.1–D6.8  
**Nivel:** 🔴 Crítico (tiempo real) / 🟠 Táctico (diario)  
**Dimensión:** Módulo D — Billetera Virtual y Monedas

---

## La Historia

La **billetera virtual** es el **sistema circulatorio** de ChambeApp. **Saldo COP** = dinero real (retirable). **Monedas** = economía cerrada (compradas/promocionales/ganadas). El **% saldo bloqueado/escrow (D6.2)** mide **capital de trabajo atrapado**: si > 30%, los PDS no tienen liquidez para vivir. Las **monedas ganadas (10 por chamba completada)** son el **motor de retención**: PDS que gana monedas → reinvierte en visibilidad → más contratos.

---

## Qué Nos Dice Realmente

| Métrica | Señal Verde 🟢 | Señal Amarilla 🟡 | Señal Roja 🔴 | Acción Inmediata |
|---------|----------------|-------------------|---------------|------------------|
| **Saldo Total COP (D6.1)** | Creciente + alineado contratos | Plano | Caída > 10% WoW | Revisar retiros / comisiones / disputas |
| **% Saldo Bloqueado Escrow (D6.2)** | < 20% | 20–30% | > 30% | **Alerta crítica**: auditoría chambas estancadas > 14d / mediación |
| **Monedas en Circulación (D6.3)** | Creciente + breakdown sano | Plano | Caída o desbalance (promocionales > 50%) | Revisar vencimiento / ganadas vs compradas |
| **Compras Paquetes/día COP (D6.4)** | Creciente + > $500k/día | $200–500k | < $200k | Promo paquetes / nuevo paquete / referral bonus |
| **Paquete Top (D6.5)** | Rotación sana (top 3 rotan) | 1 solo > 60% | 1 solo > 80% | Nuevo paquete / promociones rotativas |
| **Gasto Monedas/día (D6.6)** | Alineado a contratos+anuncios | Desviación 20% | Desviación > 50% | Auditoría: ¿gasto en qué? (contratos vs anuncios vs destacados) |
| **Monedas Vencidas/día (D6.7)** | < 1000/día | 1000–5000 | > 5000 | Notificar "Tus monedas vencen en 3 días" / extender |
| **Retiros COP/día (D6.8)** | Creciente + alineado ingresos PDS | Plano | Pico anómalo > 3x | Alerta fraude / lavado / auditoría sample |

---

## Segmentación Obligatoria

- **Por tipo moneda:** Compradas (retirables) vs Promocionales (vencen) vs Ganadas (retención)
- **Por uso:** Contratos (firma) vs Anuncios (publicar/reactivar) vs Destacados vs Chat prioritario
- **Por rol:** PDS (gana/gasta) vs Solicitante (compra/gasta) vs Merchant (gasta anuncios)
- **Por paquete:** Básico (50) vs Estándar (150+10%) vs Premium (350+17%)

---

## Palancas de Intervención

1. **Alertas vencimiento** → Push "Tus 500 monedas promocionales vencen en 3 días. Úsalas u obtén 10% extra renovando"
2. **Paquete "Starter PDS"** → 100 monedas + 10% bonus = $10.000 (gancho primera compra)
2. **Gasto inteligente** → UX: "Gasta 50 monedas en 'Destacado' = 2x ofertas" vs "Gasta en chat = 1x"
2. **Alerta escrow > 30%** → Alerta SuperAdmin + Auditoría chambas > 14d en "Pendiente Validación"
2. **Retiro 1-click** → Saldo disponible → "Retirar a Nequi" 1-click → 24h hábiles

---

## Riesgo Si Se Ignora

- **Escrow > 30%** → PDS sin liquidez → no pueden vivir → abandonan plataforma → churn masivo
- **Monedas promocionales > 50% circulación** → Economía inflada artificial → cuando vencen → crash demanda
- **Retiros anómalos** → Lavado dinero / fraude / cuenta comprometida → riesgo legal / reputacional

---

## Métricas Complementarias

- **D1.6 (Cobro Monedas Firmar)** → Input: monedas gastadas en contratos
- **D3.4 (Pago Efectivo)** → Output: chamba pagada → monedas ganadas (10/chamba)
- **D6.4 (Compras Paquetes)** → Revenue real COP → sostenibilidad plataforma
- **D6.7 (Vencidas)** → Limpieza automática job Celery `limpiar_monedas_vencidas`

---

## Alineación Estándares

- **RF-25, RF-27** — Billetera Virtual y Monedas completo
- **RF-26** — Modalidades Cobro A/B
- **Monetizacion.md** — Modelo económico documentado
- **RNF-06** — Confiabilidad Pagos (> 98% éxito retiros)

---

## Plantilla de Decisión

> **Si hoy:** % Saldo bloqueado > 30% **O** Retiros COP pico > 3x promedio  
> **Entonces:** 1) Alerta SuperAdmin + Auditoría chambas > 14d en Liquidación 2) Revisar retiros anómalos (KYC / fraude) 3) Mediación chambas estancadas  
> **Owner:** PM Wallet  
> **Revisión:** Tiempo real (alertas) + Diario 8am (revisión)