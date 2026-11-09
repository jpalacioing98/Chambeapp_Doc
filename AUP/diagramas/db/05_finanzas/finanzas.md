# Modulo 5 - Finanzas (Wallet, Pagos, Monedas)

## Diagrama
`finanzas.puml` — Modelo de billetera virtual, pagos y monedas de la plataforma.

## Entidades
- **wallets**: billetera por usuario (saldo disponible, saldo bloqueado).
- **transactions**: movimientos de caja (comisión, retiro, reembolso, depósito).
- **payments**: pago de un contrato (monto, comisiones PDS/solicitante, estado, pasarela).
- **coins**: monedas del usuario (comprada/promocional/ganada) con vencimiento.
- **coin_packages**: paquetes de monedas a la venta.
- **precios_sugeridos**: rangos de precio por categoría para guiar ofertas.

## Relaciones y cardinalidad
- `users` 1:1 `wallets` (`user_id` como PK) — relación estricta.
- `wallets` 1:N `transactions` — cada movimiento pertenece a una billetera.
- `users` 1:N `coins` — monedas por usuario.
- `contracts` 1:1 `payments` — un pago por contrato.

## Por qué este diseño
- `wallets.user_id` como PK elimina la clave surogada innecesaria en relación 1:1.
- `payments` separado de `wallets` para reconciliar pagos por contrato vs. movimientos de caja.
- `contract_checkins` (ver servicios) valida presencia física, independiente del pago.

## Esquema SQL
`finanzas.sql.puml` — Índices en `wallets(user_id)`, `transactions(wallet_id, created_at)`, `payments(contract_id UK)`, `coins(user_id, tipo)`.
