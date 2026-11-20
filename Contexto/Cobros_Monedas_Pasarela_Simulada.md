# Cobros en monedas y pasarela simulada ChambePay

> Estado: vigente desde 2026-11-18. Complementa `Contexto/Flujos_Completos_App.md`.

## 1. Principio de los dos saldos

| Saldo | Campo | Uso |
|-------|-------|-----|
| **Monedas virtuales** | `Wallet.monedas_saldo` | Dinero real de la plataforma: se compra con COP por pasarela y se gasta en contratos y anuncios. |
| **Ledger COP** | `Wallet.saldo` | Solo métrica/contabilidad: ingresos y egresos de la actividad en la app. **No** se retira, transfiere ni paga con él. |

El certificado de ingresos y el resumen financiero mensual leen el ledger COP. Las
comisiones de la plataforma se cobran **siempre en monedas**, nunca en COP.

## 2. Tarifas configurables (superadmin)

Claves de `TarifaCobro` (valores por defecto entre paréntesis):

- `pct_contrato` (3.0): porcentaje del monto del contrato que paga **cada parte**.
- `precio_moneda_cop` (100): precio de referencia de 1 moneda. Al cambiarlo se
  recalculan los paquetes (`cantidad × precio`); las ofertas manuales se conservan.
- `monedas_fijas` (1): monedas fijas sumadas al cobro de contrato.
- `min_monedas_contrato` (10): mínimo por parte al firmar.
- `costo_publicar_anuncio` (10).
- `costo_reactivar_anuncio` (5).

Fórmula del contrato (por parte):

```
monedas = max(min_monedas_contrato,
              trunc((monto × pct_contrato / 100) / precio_moneda_cop) + monedas_fijas)
```

## 3. Cuándo se cobra

| Acción | Momento | Referencia idempotente |
|--------|---------|------------------------|
| Firmar contrato | Al registrar la firma de cada parte (`PATCH /contracts/<id>/estado` `aceptar`) | `COBRO-FIRMA-<contractId>-<userId>` |
| Publicar anuncio | Al crear el anuncio (`POST /anuncios/`) | `ANUNCIO-PUB-<anuncioId>` |
| Reactivar anuncio | Al reabrir (`PATCH /anuncios/<id>/estado` `abrir`) | `ANUNCIO-REACT-<anuncioId>-<epoch>` |

Si no alcanza, el backend responde `400` con
`MONEDAS_INSUFICIENTES:<monedasRequeridas>:<texto>`. El frontend extrae el número
con `monedasRequeridas()` y ofrece recargar.

Al cancelar un contrato que aún no tenía ambas firmas se reembolsan las monedas
cobradas (`reembolsar_monedas`, idempotente).

## 4. Compra de monedas (simulación realista)

La pasarela es simulada, pero el flujo sí tiene estados y expiración:

1. `POST /wallet/coins/checkout { paquete_id }` crea un `PagoSimulado` en
   `pendiente` (15 min de vigencia). **No acredita monedas.**
2. La UI navega a `/pago/simulado/<pagoId>` y muestra las fases
   *Conectando → Verificando → Acreditando*.
3. `POST /wallet/pagos/<id>/confirmar` valida vigencia, crea la `CompraPaquete`,
   acredita las monedas y marca el pago `completado`. Es idempotente.
4. `POST /wallet/pagos/<id>/webhook` hace lo mismo sin JWT (callback simulado de
   la pasarela, útil para pruebas).
5. `POST /wallet/pagos/<id>/cancelar` deja el pago en `fallido`.
6. Si vence, pasa a `expirado` y la UI invita a elegir otro paquete.

Estados: `pendiente → completado | fallido | expirado`.

`POST /wallet/coins/buy` se conserva por compatibilidad: compra y acredita al
instante (lo usan pruebas antiguas). El flujo nuevo usa `checkout`.

## 5. Recarga → reintento automático

| Pantalla | Clave `sessionStorage` | Al volver de comprar |
|----------|------------------------|----------------------|
| Detalle de contrato (solicitante) | `chambe_pending_firma` | Reintenta la firma una sola vez. |
| Firma de contrato (PDS/solicitante) | `chambe_firma_retry` | Restaura el estado de la firma y reintenta. |
| Publicar anuncio (merchant) | `chambe_pending_anuncio` | Restaura el formulario y reintenta la publicación. |

`return_to` solo acepta rutas internas (`/...`), nunca `//dominio`.

## 6. Rutas y endpoints

Frontend:

- `/comprar-monedas?return_to=<ruta>&motivo=<texto>` — catálogo y saldo.
- `/pago/simulado/:pagoId?return_to=<ruta>` — pasarela simulada.
- `/superadmin` — hub.
- `/superadmin/paquetes` — CRUD, orden, ofertas, activar/desactivar.
- `/superadmin/tarifas` (alias `/superadmin/cobros`) — tarifas.
- `/superadmin/billeteras` — buscador y ficha solo lectura (COP + monedas).

Backend (`/api/v1/wallet`):

```
POST   /coins/checkout
GET    /pagos/<id>
POST   /pagos/<id>/confirmar
POST   /pagos/<id>/cancelar
POST   /pagos/<id>/webhook
GET    /admin/tarifas
PATCH  /admin/tarifas
GET    /admin/usuarios?q=
GET    /admin/usuarios/<id>/billetera
GET    /admin/compras?page=&per_page=
```

Los endpoints `/admin/*` exigen rol `superadmin` (403 en otro caso).

## 7. Persistencia

Migración `035_pago_simulado` crea `pagos_simulados` (FK a `users`,
`paquetes_monedas` y `compras_paquetes`). Aplicar con:

```bash
flask db upgrade
```

En pruebas se usa `db.create_all()`; el modelo está registrado en
`app/models/__init__.py` para que el esquema se cree completo.
