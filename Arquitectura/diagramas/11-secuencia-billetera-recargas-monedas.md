# Diagrama de Secuencia — Flujo 11: Billetera Digital, Recargas Simuladas y Paquetes de Monedas

> **Módulo:** Billetera Digital, Libro Contable de Partida Doble, Paquetes ChambeCoins y Retención Escrow  
> **Fuentes de Código:** [`backend/app/controllers/wallet.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/wallet.py), [`backend/app/models/wallet.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/wallet.py), [`frontend/src/features/billetera/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/billetera/)  
> **Historias de Usuario:** [HU-25](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-25-visualización-de-billetera-digital), [HU-26](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-26-recarga-de-saldo-simulada), [HU-27](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-27-solicitud-de-retiro-de-fondos), [HU-28](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-28-historial-de-transacciones), [HU-66](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-66-compra-de-paquetes-de-chambecoins), [HU-67](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-67-gamificación-e-hitos-de-monedas), [HU-68](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-68-certificado-tributario-de-ingresos-pdf).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor SOL as Solicitante (Cliente)
    actor PDS as PDS (Trabajador)
    participant FE as Frontend React (BilleteraPage / CoinsTab / RetiroModal)
    participant API as Flask API Gateway (wallet.py / payments.py)
    participant PDF as Motor PDF (ReportLab Streaming)
    participant DB as PostgreSQL 16 (wallets, wallet_transactions, coins_ledger, milestones)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: RECARGA SIMULADA (NEQUI)
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of SOL: SUBFLUJO A: Depósito y Crédito en Ledger
    SOL->>FE: Accede a /solicitante/billetera y pulsa "Recargar saldo"
    FE-->>SOL: Despliega modal de abono simulado
    SOL->>FE: Ingresa $250.000 COP vía Nequi y confirma
    FE->>API: POST /api/v1/wallet/deposit {monto: 250000, metodo: "nequi"}
    API->>DB: UPDATE wallets SET saldo_disponible = saldo_disponible + 250000 WHERE user_id = ?
    API->>DB: INSERT INTO wallet_transactions (wallet_id, tipo='deposito', monto=250000, balance_resultante=...)
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 201 Created {saldo_disponible: 250000}
    FE-->>SOL: Saldo actualizado y nuevo asiento en el historial
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: ADQUISICIÓN DE PAQUETE DE CHAMBECOINS
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of SOL: SUBFLUJO B: Compra de Monedas Virtuales
    SOL->>FE: Clic en pestaña "ChambeCoins" -> Paquete Estándar ($15.000 COP = 150 + 15 bonus)
    FE->>API: POST /api/v1/wallet/coins/buy {paquete_id: "standard", coins: 165, costo: 15000}
    API->>DB: UPDATE wallets SET saldo_disponible = saldo_disponible - 15000
    API->>DB: INSERT INTO coins_ledger (user_id, tipo='comprada', cantidad=165)
    API->>DB: INSERT INTO wallet_transactions (tipo='compra_coins', debito=15000)
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created {coins_balance: 165}
    FE-->>SOL: Badge "165 Coins Compradas"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: RETIRO BANCARIO CON RETENCIÓN ESCROW (PDS)
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of PDS: SUBFLUJO C: Retiro y Retención Preventiva
    PDS->>FE: En /pds/billetera solicita retiro por $80.000 COP a Bancolombia
    FE->>API: POST /api/v1/wallet/withdraw {monto: 80000, banco: "Bancolombia", cuenta: "123456789"}
    API->>API: Valida que saldo_disponible >= 80000
    API->>DB: UPDATE wallets SET saldo_disponible = saldo_disponible - 80000, saldo_bloqueado = saldo_bloqueado + 80000
    API->>DB: INSERT INTO wallet_transactions (tipo='retiro_solicitado', monto=80000, estado='bloqueado')
    DB-->>API: commit()
    API-->>FE: HTTP 201 Created {saldo_disponible: 120000, saldo_bloqueado: 80000}
    FE-->>PDS: Muestra saldo retenido en custodia preventiva
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: CERTIFICADO TRIBUTARIO PDF Y GAMIFICACIÓN
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of PDS: SUBFLUJO D: Descarga de Certificado y Monedas de Rendimiento
    PDS->>FE: Clic en botón "Certificado" -> Modal tributario
    FE->>API: GET /api/v1/payments/certificado-ingresos/pdf
    API->>DB: SELECT SUM(monto) FROM payments WHERE pds_id = ? AND estado = 'completado'
    API->>PDF: Compila plantilla ReportLab en memoria (IO Bytes)
    PDF-->>API: Stream binario application/pdf
    API-->>FE: HTTP 200 OK (Content-Disposition: attachment; filename="certificado_ingresos.pdf")
    FE-->>PDS: Descarga de documento tributario
    PDS->>FE: Navega a /pds/coins (Hub de Gamificación)
    FE->>API: GET /api/v1/wallet/milestones/1
    API->>DB: SELECT * FROM milestones WHERE user_id = ?
    DB-->>API: Progreso: Hito "Primeras 5 Chambas" (100% completado -> +50 coins promocionales)
    API-->>FE: HTTP 200 OK {hitos, coins_promocionales: 50}
    FE-->>PDS: Despliega catálogo de canjes y recompensas
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Invariante Contable de Partida Doble:** Ningún saldo en `wallets` cambia sin un registro atómico correspondiente en `wallet_transactions` que documente el tipo (`deposito`, `compra_coins`, `retiro`), el monto exacto, la marca de tiempo UTC y el balance resultante.
2. **Escrow y Retención Preventiva en Retiros:** Para evitar sobregiros y cumplir con normativas de prevención de lavado, al solicitar un retiro bancario los fondos no abandonan la plataforma de inmediato; se deducen de `saldo_disponible` y se trasladan a `saldo_bloqueado` hasta la dispersión ACH.
3. **Discriminación Trilateral de Monedas (Coins Ledger):** La economía interna clasifica las ChambeCoins en tres categorías contables independientes: `compradas` (con dinero real, no vencen), `ganadas` (por calidad de servicio) y `promocionales` (bonos de plataforma con caducidad).
4. **Generación Streaming de Certificados Tributarios:** En lugar de almacenar miles de PDFs estáticos en disco o S3, `GET /api/v1/payments/certificado-ingresos/pdf` compila en tiempo real un documento binario mediante ReportLab agregando los contratos formalizados y el total devengado.
