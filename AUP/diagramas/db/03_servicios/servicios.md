# Modulo 3 - Servicios (Solicitudes, Ofertas, Contratos, Ejecucion)

## Diagrama
`servicios.puml` — Núcleo operativo: publicación, negociación, contratación y ejecución de trabajos.

## Entidades
- **solicitudes**: solicitud de servicio publicada por un solicitante (presupuesto, ubicación, urgencia, imágenes 360°).
- **ofertas**: propuesta de un PDS para una solicitud (monto, estado, contraoferta).
- **contracts**: contrato firmado entre solicitante y proveedor (monto_total, estado FSM).
- **contract_execution**: expediente de ejecución 1:1 con el contrato (hitos, evidencias, pago directo).
- **adendas**: modificaciones de alcance/precio/novedad a un contrato.
- **evidencias**: pruebas de entrada/salida/adenda/novedad (MinIO, hash, EXIF).
- **hitos**: hitos 1-6 de cierre y validación del servicio.
- **ratings_solicitud**: calificación 1-5 bidireccional entre solicitante y PDS.
- **contract_checkins**: check-ins georreferenciados de entrada/salida en obra.

## Relaciones y cardinalidad
- `users` 1:N `solicitudes` (solicitante).
- `solicitudes` 1:N `ofertas`; `users` 1:N `ofertas` (PDS).
- `solicitudes` 1:N `contracts`; `users` 2×1:N `contracts` (proveedor, solicitante).
- `contracts` 1:1 `contract_execution` — expediente de ciclo de vida.
- `contracts` 1:N `adendas`, `evidencias`, `hitos`, `contract_checkins`.
- `solicitudes` 1:N `ratings_solicitud`; `users` 2×1:N (autor, calificado).

## Por qué este diseño
- `contract_execution` 1:1 evita filas esparcidas y mantiene el ciclo de vida cohesivo.
- `contract_checkins` pertenece al contrato (ejecución), no al pago financiero.
- `monto_total` en `contracts` evita recalcular sumando pagos u ofertas.
- `service_id` renombrado a `solicitud_id` para consistencia con la entidad.

## Esquema SQL
`servicios.sql.puml` — Índices en solicitudes, ofertas, contracts por estado y fechas de creación.
