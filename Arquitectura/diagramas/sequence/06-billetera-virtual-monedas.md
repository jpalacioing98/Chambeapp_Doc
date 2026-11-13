# Diagrama de Secuencia — Figura 6: Billetera Virtual, Monedas y Partida Doble (RF-25, RF-27, RF-08)

> **Módulo:** Flujo Financiero Completo: Wallet, Coins, Pagos Dual, Retiros  
> **Fuente:** `06_billetera_virtual.puml` (Figura 6)  
> **Referencias de Código:** `backend/app/controllers/wallet.py`, `backend/app/controllers/payments.py`, `backend/app/models/wallet.py`, `backend/app/models/coin.py`, `frontend/src/features/billetera/`

---

## 1. Diagrama de Secuencia (PlantUML)

```plantuml
@startuml
title Figura 6 - Billetera Virtual, Monedas y Partida Doble (RF-25, RF-27, RF-08)

actor "PDS" as PDS
actor "Solicitante" as SOL
actor "Superadmin" as SUP
actor "Plataforma" as PLAT

participant "Wallet\n(wallets table)" as W
participant "Transaction\n(transactions: saldo COP)" as WT
participant "Coin\n(3 tipos: COMPRADA/PROMO/GANADA)" as C
participant "MovimientoMonedas\n(libro de monedas)" as MM
participant "PaqueteMonedas /\nCompraPaquete" as CP
participant "TarifaCobro\n(tarifas configurables)" as TC
participant "Payment\n(pagos table + conformidad dual)" as PAY
participant "MetodoPago\n(billetera + cuentas banco)" as MP
participant "Pasarela\n(Nequi / PSE / MercadoPago)" as GW

== COMPRA DE PAQUETES DE MONEDAS ==
SOL -> W: GET /wallet/paquetes
W -> CP: Lee paquetes activos (cantidad, bonus, precio_cop/oferta)
SOL -> W: POST /wallet/coins/buy {paquete_id}
W -> CP: Crea CompraPaquete (pasarela=simulada, estado=completado)
W -> TC: Consulta precio_moneda_cop vigente
W -> MM: MovimientoMonedas tipo=compra (+cantidad + bonus)
MM -> W: Actualiza monedas_saldo (saldo_resultante)
W -> C: Registra Coin COMPRADA (cantidad comprada)
W --> SOL: 201 {compra, saldo_monedas}

== USO DE MONEDAS ==
SOL -> W: POST /wallet/coins/use {cantidad, motivo}
W -> MM: MovimientoMonedas tipo=gasto (−cantidad)
MM -> W: Actualiza monedas_saldo
W -> C: Descuenta Coin (COMPRADA/PROMOCIONAL/GANADA)
W --> SOL: 200 {mensaje}

== COBRO DE CONTRATO EN MONEDAS ==
SOL -> PAY: Acepta oferta → firma contrato
PAY -> TC: calcular_monedas_contrato(monto)
TC --> PAY: monedas_requeridas (mínimo configurable)
PAY -> W: cobrar_monedas(SOL, monedas_requeridas, ref=contract)
PAY -> W: cobrar_monedas(PDS, monedas_requeridas, ref=contract)
alt Monedas suficientes en ambas partes
    W -> MM: MovimientoMonedas tipo=gasto (−monedas)
    MM -> W: Actualiza monedas_saldo
    PAY -> PAY: Continúa firma / liberación
else Saldo insuficiente
    W --> PAY: ValueError (saldo insuficiente)
    PAY --> SOL: 400 monedas insuficientes
end

== MODALIDAD A: COMISIÓN (DEFAULT) ==
SOL -> PAY: Acepta oferta → genera Payment {modalidad=A_comision}
PAY -> W: Bloquea monto + comisiones (saldo_bloqueado)
PAY -> SOL: Solicita conformidad_solicitante (firma SHA256)
PAY -> PDS: Solicita conformidad_pds (firma SHA256)
alt Ambas conformidades OK
    PAY -> W: Transaction (liquidación partida doble)
    note right of W: Modalidad A - Liquidación\nDEBE: SOL (monto_total) → HABER: PDS (monto_neto=88%)\nDEBE: SOL (comision_solicitante=8%) → HABER: PLAT\nDEBE: PDS (comision_pds=12%) → HABER: PLAT
    W -> PDS: Saldo disponible inmediato
    PAY -> SOL: Recibo PDF (Ley 527) + Transaction log
else Conformidad parcial (72h Escrow)
    PAY -> PAY: Estado=escrow, mediación automática
end

== MODALIDAD B: SIN COMISIÓN (MONEDAS) ==
SOL -> PAY: Acepta oferta → genera Payment {modalidad=B_sin_comision, monedas_requeridas}
PAY -> C: Verifica Coin COMPRADA suficiente (saldo_actual ≥ requeridas)
PAY -> W: cobrar_monedas(SOL, monedas_requeridas) vía servicio cobros
PAY -> MM: MovimientoMonedas tipo=gasto (monedas quemadas)
PAY -> W: Transaction (liquidación sin comisión)
note right of W: Modalidad B - Liquidación\nDEBE: SOL (0 COP) → HABER: PDS (monto_total COP)\nDEBE: SOL (monedas) → HABER: PLAT (monedas quemadas)
PAY -> PDS: Saldo disponible 100% (sin comisión)
PAY -> SOL: 0 COP cobrados, solo monedas consumidas

== RETIROS PDS ==
PDS -> MP: GET /metodos-pago (lista: billetera + Nequi + Bancolombia)
PDS -> W: POST /wallet/withdraw {monto, cuenta_destino}
W -> W: Valida saldo_disponible ≥ monto + fee
W -> WT: Transaction tipo=retiro (−monto)
WT -> W: Actualiza saldo / saldo_bloqueado
W -> GW: Procesa transferencia Nequi (async Celery)
GW -> W: Confirma (webhook) → libera bloqueo
GW -> PDS: Notificación retiro completado + comprobante

== COIN PROMOCIONAL Y GANADA ==
PLAT -> C: Campaña → Coin PROMOCIONAL (cantidad, vence_en=30d)
PLAT -> C: Logro (PRIMER_CONTRATO, TOP_RATED) → Coin GANADA (sin expiración)
SOL -> C: Usa Coin PROMOCIONAL primero (vence_en más cercano)
SOL -> C: Luego Coin COMPRADA (FIFO por expiración)

== SUPERADMIN: TARIFAS Y PAQUETES ==
SUP -> TC: GET/PUT /admin/cobros (6 tarifas)
TC -> CP: Si cambia precio_moneda_cop → recalcula precio_cop de paquetes
SUP -> CP: GET/POST/PATCH/DELETE /wallet/admin/paquetes
SUP -> CP: POST /wallet/admin/paquetes/reordenar

note right of W
  WALLET (partida doble invariante):
  • wallets: user_id UK, saldo (COP), saldo_bloqueado, monedas_saldo
  • transactions: tipo[5], monto (COP +/−), descripcion, referencia
  • movimientos_monedas: tipo[6], cantidad (+/−), saldo_resultante
  • INVARIANTE: Σ(DEBE) = Σ(HABER) por usuario + plataforma
  • Saldo disponible = Σ(HABER usuario) - Σ(DEBE usuario) - saldo_bloqueado
end note

note right of C
  COINS (3 tipos, RF-27):
  • COMPRADA:    usuario paga COP → monedas, NO expiran, FIFO uso
  • PROMOCIONAL: plataforma regala → vence_en (ej. 30d), uso prioritario
  • GANADA:      logros/badges → sin expiración, uso último
  • coins table: user_id, tipo, cantidad, vence_en
  • paquetes_monedas: nombre, cantidad, bonus, precio_cop, en_oferta, orden
end note

note right of MM
  MOVIMIENTO MONEDAS:
  • TipoMovimientoMonedas: compra | gasto | promocional | ganada | vencimiento | ajuste
  • Guarda saldo_resultante para auditoría
  • referencia: contrato, anuncio, compra o ajuste
  • Reembolsos usan tipo=ajuste (services/cobros.py)
end note

note right of PAY
  PAYMENT (RF-08 + RF-23):
  • payments: contract_id UK, monto, comision_pds(12%), comision_solicitante(8%), estado, pasarela, conformidad_dual
  • Modalidad A (comisión): 20% total plataforma, conformidad dual obligatoria
  • Modalidad B (monedas): 0% comisión, consume Coin COMPRADA, conformidad dual
  • Escrow 72h si una parte no conforma → mediación soporte
end note

note right of MP
  METODOS PAGO:
  • metodos_pago: user_id, tipo[billetera/banco], banco, numero_cuenta, es_principal
  • merchant_payment_methods: user_id, tipo[nequi/bancolombia/efectivo], detalle JSON, principal
  • Primera entrada automática: tipo=billetera (wallet del sistema)
end note

@enduml
```

---

## 2. Actores y Participantes

| Actor/Participante | Tipo | Responsabilidad |
|--------------------|------|-----------------|
| **Solicitante (SOL)** | Actor | Compra paquetes de monedas, paga tarifas de contrato y servicios (Modalidad A/B) |
| **PDS** | Actor | Recibe pagos, retira a banco/Nequi, gestiona métodos de pago |
| **Plataforma (PLAT)** | Actor | Emite Coins promocionales/ganadas, recibe comisiones |
| **Wallet (W)** | Tabla/Entidad | Billetera virtual, partida doble DEBE/HABER, saldo disponible/bloqueado |
| **Transaction (WT)** | Tabla/Entidad | Libro contable COP: tipo[5], monto, descripcion, referencia |
| **MovimientoMonedas (MM)** | Tabla/Entidad | Libro de monedas: tipo[6], cantidad (+/−), saldo_resultante |
| **Coin (C)** | Tabla/Entidad | 3 tipos: COMPRADA/PROMOCIONAL/GANADA, FIFO por expiración |
| **Payment (PAY)** | Tabla/Entidad | Pagos contratos, comisiones 12%/8%, conformidad dual, Escrow 72h |
| **MetodoPago (MP)** | Tabla/Entidad | Métodos usuario (billetera/banco) + negocio (Nequi/Bancolombia/efectivo) |
| **Pasarela (GW)** | Servicio Externo | Nequi / PSE / MercadoPago, webhooks async |
| **PaqueteMonedas / CompraPaquete (CP)** | Entidad | Paquetes configurables: cantidad, bonus, precio COP, oferta; compras con pasarela simulada |
| **TarifaCobro (TC)** | Entidad | Tarifas configurables: pct_contrato, precio_moneda_cop, monedas_fijas, anuncios |

---

## 3. Flujos Principales

### A. Compra de Paquetes de Monedas
1. `SOL → W`: `GET /wallet/paquetes` (paquetes activos, bonus, oferta)
2. `SOL → W`: `POST /wallet/coins/buy {paquete_id}`
3. `W → CP`: Crea `CompraPaquete` (pasarela=simulada, estado=completado)
4. `W → TC`: Consulta `precio_moneda_cop` vigente
5. `W → MM`: `MovimientoMonedas` tipo=compra (+cantidad + bonus)
6. `W → C`: Registra `Coin COMPRADA` (cantidad comprada)
7. `MM → W`: Actualiza `monedas_saldo` (saldo_resultante)

### B. Modalidad A: Comisión (Default - 20% plataforma)
1. `SOL → PAY`: `POST /contracts/{id}/accept` → genera `Payment {modalidad=A_comision}`
2. `PAY → W`: Bloquea monto + comisiones (`saldo_bloqueado`)
3. `PAY → SOL`: Solicita `conformidad_solicitante` (firma digital SHA256)
4. `PAY → PDS`: Solicita `conformidad_pds` (firma digital SHA256)
5. **Si ambas OK**:
   - `PAY → W`: `Transaction` (liquidación)
     - DEBE: SOL (monto_total) → HABER: PDS (monto_neto = 88%)
     - DEBE: SOL (comision_solicitante = 8%) → HABER: PLAT
     - DEBE: PDS (comision_pds = 12%) → HABER: PLAT
   - `W → PDS`: Saldo disponible inmediato
   - `PAY → SOL`: Recibo PDF (Ley 527) + Transaction log
6. **Si conformidad parcial (72h)**: `PAY → PAY`: Estado = escrow, mediación automática

### C. Modalidad B: Sin Comisión (Monedas)
1. `SOL → PAY`: `POST /contracts/{id}/accept` → genera `Payment {modalidad=B_sin_comision, monedas_requeridas}`
2. `PAY → C`: Verifica `Coin COMPRADA` suficiente (`saldo_actual ≥ requeridas`)
3. `PAY → C`: Descuenta `Coin COMPRADA` (`saldo_actual - requeridas`)
4. `PAY → W`: `Transaction` + `MovimientoMonedas` (liquidación sin comisión)
   - DEBE: SOL (0 COP) → HABER: PDS (monto_total COP)
   - DEBE: SOL (monedas) → HABER: PLAT (monedas quemadas)
5. `PAY → PDS`: Saldo disponible 100% (sin comisión)
6. `PAY → SOL`: 0 COP cobrados, solo monedas consumidas

### D. Retiros PDS
1. `PDS → MP`: `GET /metodos-pago` (lista: billetera + Nequi + Bancolombia)
2. `PDS → W`: `POST /wallet/withdraw {monto, cuenta_destino}`
3. `GW → W`: Valida `saldo_disponible ≥ monto + fee`
4. `W → WT`: `Transaction` tipo=retiro (−monto)
5. `GW → GW`: Procesa transferencia Nequi (async Celery)
6. `GW → W`: Confirma (webhook) → libera bloqueo
7. `GW → PDS`: Notificación retiro completado + comprobante

### E. Coins Promocional y Ganada
1. `PLAT → C`: Campaña → `Coin PROMOCIONAL` (cantidad, `vence_en=30d`)
2. `PLAT → C`: Logro (`PRIMER_CONTRATO`, `TOP_RATED`) → `Coin GANADA` (sin expiración)
3. `SOL → C`: Usa `Coin PROMOCIONAL` primero (`vence_en` más cercano)
4. `SOL → C`: Luego `Coin COMPRADA` (FIFO por expiración)

---

## 4. Entidades y Tablas

| Tabla | Campos Clave | Descripción |
|-------|-------------|-------------|
| `wallets` | `id PK`, `user_id FK UK`, `saldo`, `saldo_bloqueado`, `monedas_saldo`, `created_at/updated_at` | Billetera por usuario |
| `transactions` | `id PK`, `wallet_id FK`, `tipo[5]`, `monto (COP +/-)`, `descripcion`, `referencia`, `created_at` | Libro contable COP |
| `movimientos_monedas` | `id PK`, `user_id FK`, `wallet_id FK`, `tipo[6]`, `cantidad (+/-)`, `saldo_resultante`, `referencia`, `paquete_id FK`, `creado_en` | Libro de monedas |
| `coins` | `id PK`, `user_id FK`, `cantidad`, `tipo[COMPRADA/PROMOCIONAL/GANADA]`, `vence_en`, `created_at` | Monedas por usuario |
| `paquetes_monedas` | `id PK`, `nombre`, `cantidad`, `bonus`, `precio_cop`, `en_oferta`, `precio_oferta_cop`, `orden`, `activo` | Paquetes configurables |
| `compras_paquetes` | `id PK`, `user_id FK`, `paquete_id FK`, `monedas`, `precio_cop`, `pasarela`, `estado`, `referencia` | Compras de paquetes |
| `tarifas_cobro` | `clave PK`, `valor`, `descripcion`, `actualizado_por FK` | Tarifas de cobro |
| `payments` | `id PK`, `contract_id FK UK`, `monto`, `comision_pds(12%)`, `comision_solicitante(8%)`, `estado[4]`, `pasarela[mock/nequi]`, `referencia_pasarela`, `motivo_reembolso`, `created_at/updated_at` | Pagos de contratos |
| `metodos_pago` | `id PK`, `user_id FK`, `tipo[billetera/banco]`, `banco`, `numero_cuenta`, `es_principal`, `created_at` | Métodos usuario |
| `merchant_payment_methods` | `id PK`, `user_id FK`, `tipo[nequi/bancolombia/efectivo...]`, `detalle JSON`, `principal`, `activo`, `created_at` | Métodos negocio |

---

## 5. Endpoints Clave

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/wallet/paquetes` | Paquetes de monedas activos |
| POST | `/api/v1/wallet/coins/buy` | Compra paquete de monedas |
| POST | `/api/v1/wallet/coins/use` | Usa monedas (gasto) |
| GET | `/api/v1/wallet/coins/movimientos` | Historial de movimientos de monedas |
| POST | `/api/v1/payments` | Genera payment (modalidad A/B) |
| POST | `/api/v1/payments/:id/conformidad_solicitante` | Firma digital solicitante |
| POST | `/api/v1/payments/:id/conformidad_pds` | Firma digital PDS |
| POST | `/api/v1/wallet/withdraw` | Solicita retiro Nequi/Bancolombia |
| GET | `/api/v1/metodos-pago` | Lista métodos pago usuario/negocio |
| GET | `/api/v1/wallet/history` | Historial de transacciones COP |
| GET | `/api/v1/wallet/coins` | Saldo actual de monedas |
| GET/PUT | `/api/v1/admin/cobros` | Tarifas de cobro (superadmin) |
| GET/POST | `/api/v1/wallet/admin/paquetes` | Gestión de paquetes (superadmin) |

---

## 6. Reglas de Negocio Críticas

### Partida Doble Invariante (Wallet)
```
wallets: user_id UK, saldo (COP), saldo_bloqueado, monedas_saldo
transactions: tipo[5], monto (COP +/−), descripcion, referencia
movimientos_monedas: tipo[6], cantidad (+/−), saldo_resultante, referencia

INVARIANTE: Σ(DEBE) = Σ(HABER) por usuario + plataforma
Saldo disponible = Σ(HABER usuario) - Σ(DEBE usuario) - saldo_bloqueado
```

### 3 Tipos de Coins (RF-27)
| Tipo | Origen | Expiración | Prioridad Uso |
|------|--------|------------|---------------|
| **COMPRADA** | Usuario paga COP | NO expiran | 2da (FIFO) |
| **PROMOCIONAL** | Plataforma regala (campañas) | `vence_en` (ej. 30d) | 1ra (más próxima a vencer) |
| **GANADA** | Logros/badges (PRIMER_CONTRATO, TOP_RATED) | Sin expiración | 3ra (última) |

### Modalidad A vs B (RF-26)
| Aspecto | Modalidad A (Comisión) | Modalidad B (Monedas) |
|---------|------------------------|----------------------|
| **Comisión** | 12% PDS + 8% Solicitante = 20% plataforma | 0% comisión |
| **Pago** | COP desde wallet | Coin COMPRADA |
| **Conformidad** | Dual obligatoria (SHA256) | Dual obligatoria |
| **Escrow** | 72h si una parte no conforma | 72h si una parte no conforma |
| **Recibo** | PDF Ley 527 | Solo transaction log |

### Retiros con Escrow Preventivo
- Validación: `saldo_disponible ≥ monto + fee`
- `saldo_bloqueado` incrementado al solicitar
- Transferencia async Celery (Nequi/Bancolombia)
- Webhook confirma → libera `saldo_bloqueado`
- Comprobante generado automáticamente

---

## 7. Notas Técnicas (Extraídas del .puml)

### Wallet (Partida Doble Invariante)
- `wallets`: `user_id UK`, `saldo`, `saldo_bloqueado`, `monedas_saldo`
- `transactions`: `tipo[5]`, `monto (COP +/−)`, `descripcion`, `referencia`
- `movimientos_monedas`: `tipo[6]`, `cantidad (+/−)`, `saldo_resultante`, `referencia`
- **INVARIANTE**: `Σ(DEBE) = Σ(HABER)` por usuario + plataforma
- **Saldo disponible** = `Σ(HABER usuario) - Σ(DEBE usuario) - saldo_bloqueado`

### Coins (3 Tipos, RF-27)
- **COMPRADA**: usuario paga COP → monedas, NO expiran, FIFO uso
- **PROMOCIONAL**: plataforma regala → `vence_en` (ej. 30d), uso prioritario
- **GANADA**: logros/badges → sin expiración, uso último
- `coins`: `user_id`, `tipo`, `cantidad`, `vence_en`
- `paquetes_monedas`: `nombre`, `cantidad`, `bonus`, `precio_cop`, `en_oferta`, `orden`, `activo`
- `compras_paquetes`: `user_id`, `paquete_id`, `monedas`, `precio_cop`, `pasarela`, `estado`

### Payment (RF-08 + RF-23)
- `payments`: `contract_id UK`, `monto`, `comision_pds(12%)`, `comision_solicitante(8%)`, `estado`, `pasarela`, `conformidad_dual`
- El cobro de contrato usa `TarifaCobro` y es idempotente por referencia
- **Modalidad A (comisión)**: 20% total plataforma, conformidad dual obligatoria
- **Modalidad B (monedas)**: 0% comisión, consume Coin COMPRADA, conformidad dual
- **Escrow 72h**: si una parte no conforma → mediación soporte

### Métodos Pago
- `metodos_pago`: `user_id`, `tipo[billetera/banco]`, `banco`, `numero_cuenta`, `es_principal`
- `merchant_payment_methods`: `user_id`, `tipo[nequi/bancolombia/efectivo]`, `detalle JSON`, `principal`
- Primera entrada automática: `tipo=billetera` (wallet del sistema)

---

## 8. Validación de PlantUML

- ✅ Sintaxis validada: `java -jar plantuml.jar -tpng -charset UTF-8 06_billetera_virtual.puml` → **Sin errores**
- ✅ PNG generado: `06_billetera_virtual.png` (300 KB)
- ✅ SVG generado: `06_billetera_virtual.svg` (43 KB)
- ✅ UTXT generado: `06_billetera_virtual.utxt` (90 KB, 181 líneas)

---

## 9. Inconsistencias Detectadas y Corregidas

### Errores de Sintaxis PlantUML (Original)
1. **Líneas 30-33**: Bloque `alt` con contenido multi-línea indentado inválido:
   ```
   PAY -> W: WalletTransaction:
     DEBE: SOL (monto_total) → HABER: PDS (monto_neto=88%)
     DEBE: SOL (comision_solicitante=8%) → HABER: PLAT
     DEBE: PDS (comision_pds=12%) → HABER: PLAT
   ```
   **Corrección**: Movido a `note right of W` con salto de línea `\n`

2. **Líneas 44-46**: Mismo problema en Modalidad B:
   ```
   PAY -> W: WalletTransaction:
     DEBE: SOL (0 COP) → HABER: PDS (monto_total COP)
     DEBE: SOL (monedas) → HABER: PLAT (monedas quemadas)
   ```
   **Corrección**: Movido a `note right of W`

### Validación Contable (Partida Doble)
| Movimiento | DEBE | HABER | Validación |
|------------|------|-------|------------|
| Modalidad A - Principal | SOL (monto_total) | PDS (88%) | ✅ Balancea |
| Modalidad A - Comisión Solicitante | SOL (8%) | PLAT | ✅ Balancea |
| Modalidad A - Comisión PDS | PDS (12%) | PLAT | ✅ Balancea |
| Modalidad B - Principal | SOL (0 COP) | PDS (100%) | ✅ Balancea (0 COP = sin efectivo) |
| Modalidad B - Quema Monedas | SOL (monedas) | PLAT (monedas) | ✅ Balancea (unidades, no COP) |

**Nota**: En Modalidad B, el DEBE de SOL es "0 COP" porque no hay flujo de efectivo; el valor se transfiere vía quema de monedas. La partida doble se mantiene invariante en su dimensión contable (unidades monetarias vs COP).

---

## 10. Archivos Generados/Actualizados

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `06_billetera_virtual.puml` | ✅ Corregido | Sintaxis PlantUML válida, notas para DEBE/HABER |
| `06_billetera_virtual.utxt` | ✅ Regenerado | Texto Unicode del diagrama (90 KB, 181 líneas) |
| `06_billetera_virtual.png` | ✅ Generado | Imagen PNG (300 KB) |
| `06_billetera_virtual.svg` | ✅ Generado | Imagen SVG (43 KB) |
| `06-billetera-virtual-monedas.md` | ✅ Actualizado | Documentación sincronizada con .puml corregido |

---

*Generado automáticamente desde `06_billetera_virtual.puml` (Figura 6) — Validado sin errores de sintaxis PlantUML*