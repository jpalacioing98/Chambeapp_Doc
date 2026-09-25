# Contrato Independiente de Prestación de Servicios Ocasionales

> Fuente: `contrato de servicio.md` (raíz). Formato markdown mejorado. Versión 2026-09-25. Generado vía ChambeApp (Marketplace).

---

## Considerandos y Blindaje de ChambeApp

### Cláusula 1 — Naturaleza, monetización y exoneración

1. **Rol plataforma.** ChambeApp es **canal tecnológico de intermediación** (marketplace). No empleador, contratista, agencia ni garante. Sin subordinación (CST).
2. **Monetización (licencia uso).** Tarifa de uso vía:
   - Comisión intermediación por servicio (% sobre transacción, repartida solicitante/prestador).
   - Billetera virtual / monedas (créditos) para solicitudes/ofertas/contacto.
   - Membresías periódicas (Básico/Pro) opcionales.
3. **Inexistencia intermediación financiera de honorarios.** Cobros de comisión/créditos/membresías = **pago por software**. ChambeApp **no** recauda/administra pago del servicio final ni es pasarela de honorarios. Liquidación **directa** entre partes (efectivo/transferencia, pactado en chat).
4. **Ausencia vínculo laboral.** Sin solidaridad laboral (Ley 1562/2012, CST Art. 6).
5. **Alcance verificación.** Badges/certificados = **informativo previo** (documental). No certifica calidad/idoneidad moral ni garantiza resultado.

---

## Cláusulas entre Usuarios (Solicitante y Prestador)

### Cláusula 2 — Partes
- **Solicitante:** persona natural/jurídica que requiere tarea ocasional.
- **Prestador (Chambeador):** independiente que ofrece habilidades/herramientas.

### Cláusula 3 — Objeto
Prestador ejecuta de forma autónoma la obra/servicio acordado en módulo solicitudes + chat.

### Cláusula 4 — Valor del Chat, Billetera y 360° como Anexo Vinculante
1. **Chat como anexo principal.** Texto, voz, cotizaciones, montos, insumos, horarios del **chat oficial** = **anexo inseparable** (Ley 527/1999 mensajes de datos).
2. **Soportes multimedia.** Fotos/archivos y **capturas 360°/3D** (entorno) subidas a la orden = prueba técnica inicial de alcance y estado previo.
   - Hitos chamba: `evidencia_entrada` (H2) y `evidencia_salida` (H4 obligatoria antes de `pendiente_validacion`).
   - Adendas (`adendas[]`) y novedades (`novedades[]`) registradas en chamba/maraña.
3. **Monedas en negociación.** Uso de monedas = habilitación canal contacto, no pago del trabajo final.

### Cláusula 5 — Pago y comisiones
- **Precio y pago directo.** Monto y medio (efectivo/transferencia) fijados libremente en chat; confirmación dual (`pago_confirmado_solicitante + pago_confirmado_prestador → pago_directo_confirmado`) en chamba (`POST /chambas/<id>/pago`) y maraña (`POST /maranas/<id>/pago`).
- **Comisión plataforma.** Cargo independiente por uso software (% prefijado T&C; ej. 12% pds + 8% solicitante, exonerado <50k, descuentos volumen).
- **Exoneración disputas pago.** Mora/impago/cheques/estafas = responsabilidad exclusiva partes.

### Cláusula 6 — Autonomía técnica
Prestador con **autonomía técnica/administrativa/directiva**, herramientas propias, sin subordinación ChambeApp; solo condiciones pactadas con solicitante en chat/anexos (adendas).

### Cláusula 7 — Daños, garantía y exclusión responsabilidad
1. **Daños materiales/personales** a inmuebles/electro/véhiculos/terceros = responsabilidad culposa de la parte que causa.
2. **Indemnidad.** Partes mantienen indemne a ChambeApp/directivos/empleados ante demandas civil/penal/laboral/administrativa.

### Cláusula 8 — Seguridad social y riesgos
Prestador independiente asume **Salud/Pensión/ARL** (Ley 1562/2012). ChambeApp no cubre accidentes/incapacidades. Formalización progresiva (historial ingresos) habilita niveles Experto (N5).

### Cláusula 9 — Resolución de disputas y revisión del chat
- Reclamo ≤48h, mediación, decisión 5 días hábiles (T&C §8.4).
- Partes autorizan revisar **chat + soportes 360°** solo como **árbitro reputacional** (estrellas/bloqueo). Reclamación económica/judicial = vía directa solicitante↔prestador (conciliación/juzgado, jurisdicción Valledupar).
- Evidencias hito 3-6 (`habilidades_validadas`, `rating`, `fecha_validacion`, `fecha_liquidacion`) son base probatoria.

---

## Anexo técnico (trazabilidad app)

| Elemento | Campo/Endpoint |
|---|---|
| Chat hash anexo | `contracts.chatHash` / `chambas.adendas` (fecha, descripcion, monto_extra, tiempo_extra_unidad) |
| Evidencias | `chambas.evidencia_entrada/salida[]` (URLs MinIO), `POST /chambas/evidencia/upload` |
| Pago directo | `chambas.pago_*` + `maranas.pago_*` |
| Calificación | `chambas.rating_estrellas/comentario + habilidades_validadas[]` |
| Región aplicable | `users.region_id` (propiedad solicitante) |

*Este contrato se firma digitalmente al aceptar propuesta + firmar (`PATCH /contracts/<id>/estado → aceptar`) y se genera la chamba (`programada`). El historial completo es exportable para auditoría.*