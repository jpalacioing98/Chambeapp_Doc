# Modulo 4 - Maranas (Subcontratacion)

## Diagrama
`maranas.puml` — Modelo de subcontratación derivada de un contrato padre.

## Entidades
- **maranas**: subcontratación de un contrato (descripción, presupuesto, estado, PDS a cargo).
- **ofertas_marana**: ofertas de PDS dentro de una marana (precio, mensaje, estado).

## Relaciones y cardinalidad
- `contracts` 1:N `maranas` — un contrato puede generar varias subcontrataciones.
- `users` 1:N `maranas` — PDS gestiona la marana.
- `maranas` 1:N `ofertas_marana`; `users` 1:N `ofertas_marana`.

## Por qué este diseño
- Permite que el PDS principal contrate a terceros para parte del trabajo sin crear un contrato independiente.
- `adenda_id` (opcional) vincula la marana a una adenda que la autorizó (en el diagrama completo).

## Esquema SQL
`maranas.sql.puml` — Índices en `maranas(contract_id, pds_id)` y `ofertas_marana(marana_id, pds_id)`.
