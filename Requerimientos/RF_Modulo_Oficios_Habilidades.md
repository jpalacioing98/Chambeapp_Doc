# RF Módulo Oficios y Habilidades — RF-61 a RF-66

> Fuente: `modeulo de oficio y habilidades.md`, `lista de oficion y habilidades.md`, verificado contra `app/models/habilidad.py`, `app/controllers/habilidades.py`, `app/data/seed_habilidades.py` (si existe), `CHANGELOG` no dedicado pero backend ya implementado.
> Catálogo nacional CUOC/SENA. Formato EARS. Implementado.

## RF-61: Catálogo nacional de oficios (5 categorías)
**HU-61:** Como PDS quiero catálogo estructurado de oficios para registrar mi oficio principal.
**EARS:** WHEN usuario consulta `GET /habilidades` THEN sistema SHALL retornar `Habilidad[]` activas `{nombre, descripcion, categoria, habilidades[], niveles[], activa}` ordenadas por nombre. WHEN admin crea `POST /habilidades {nombre, descripcion?, categoria, habilidades[], niveles[]}` THEN SHALL persistir con `categoria ∈ {construccion, climatizacion, domesticos, estetica, mecanica}`.
**Categorías (código real):** `construccion` (albañilería, plomería, electricidad, pintura, drywall, carpintería, soldadura, cerrajería), `climatizacion` (aire, electrodomésticos, redes/CCTV), `domesticos` (jardinería, aseo, cuidado personas, mudanzas), `estetica` (barbería, uñas, facial/corporal), `mecanica` (mecánica auto/moto). Ver `Habilidad.categoria` index.
**CA:** ~30+ oficios predefinidos (seed nacional); `DELETE /habilidades/<id>` solo si nadie certificó (400 si hay `HabilidadNivel`).

Detallado: Construcción/Obra Blanca: plomería (termofusión, fugas, sanitarios, motobombas, destape, calentadores), electricidad (cableado conduit, tableros, LED, cortos, puesta tierra, acometidas), albañilería (ladrillo/pañete, enchape, pisos, morteros, cimientos, demolición), pintura (tipo1-3, estuco, resane, impermeabilización, compresor, fachadas altura), drywall (perfilería, placas yeso/fibrocemento, encintado, cielos PVC, aislamiento), carpintería MDF/RH (RTA, cocinas, bisagras, pulido, barniz, puertas), soldadura SMAW/MIG/TIG (corte pulidora, rejas, cerchas, pasamanos), cerrajería (apertura, guardas, alta seguridad, biométrica, blindadas). Climatización: AA minisplit (lavado químico, instalación, R410A/R22/R32, fugas cobre, tarjetas), electrodomésticos (lavadoras, neveras no-frost, estufas, microondas, rodamientos), redes (UTP Cat5e/6, routers MESH, CCTV IP, mantenimiento PC, formateo, SSD/RAM). Domésticos: jardinería (poda, guadañadora, abono, plagas, riego), aseo (cocinas/baños, lencería, muebles inyección, vidrios, organización), cuidado (adulto mayor, niñera, medicamentos, signos vitales, dietas), mudanzas (embalaje vinipel, carga, estiba, desmonte, transporte). Estética: barbería (fades, barba, colorimetría balayage, queratina), uñas (rusa, semipermanente, acrílico/gel/polygel, nail art), facial (limpieza, depilación cera/hilo, cejas henna/laminado, extensiones pelo-a-pelo, masajes). Mecánica: auto (aceite/filtros, frenos, OBD2, batería, correas), moto (sincronización carburador/inyección, kit arrastre, despinchado, frenos disco/tambor, eléctrico).

## RF-62: Ruta de niveles certificables por oficio
**HU-62:** Como PDS quiero ver ruta de niveles de mi oficio para progresar.
**EARS:** WHEN se crea habilidad THEN sistema SHALL guardar `niveles: [{nombre, tipo: quiz|certificacion, quiz?: [{pregunta, opciones[], correcta}] }]`. WHEN se consulta catálogo THEN SHALL exponer niveles SIN `quiz.correcta` salvo si `nivel_index == consultado` vía `to_dict(nivel_index)`.
**CA:** Ruta típica 3-5 niveles; ej. Básico quiz → Intermedio quiz → Avanzado certificación.

## RF-63: Validación por quiz (micro-evaluación)
**EARS:** WHEN usuario `GET /habilidades/<id>/nivel/<n>/quiz` THEN SHALL retornar `{nivel, preguntas:[{pregunta, opciones}]}` (tipo quiz). WHEN `POST .../quiz {respuestas:int[]}` THEN SHALL calificar: `aciertos/total >= 0.8` (80% — `UMBRAL_QUIZ` en `app/controllers/habilidades.py`; doc origen decía 70% pero código exige 80%) → `HabilidadNivel {metodo:quiz}`; else mensaje "No alcanzaste... Reintenta" (reintento ilimitado, no bloqueo). Validación longitudes exacta.
**CA:** 3-5 preguntas, 30-45s recomendado; aprobación ≥80% otorga "Habilidad Validada por Quiz" (RF origen 80%, código 80%).

## RF-64: Validación social — endoso por clientes + evidencias 360°
**EARS:**
- WHEN solicitante `POST /habilidades/endosar {contract_id, habilidad_id, competencia}` AND contrato `completado` AND solicitante es dueño THEN SHALL crear `EndosoHabilidad {contract_id, pds_id=proveedor, solicitante_id, habilidad_id, competencia}` (competencia debe ∈ `Habilidad.habilidades`; unique `uq_endoso_contract_competencia`; 409 si duplica).
- WHEN chamba finaliza con `POST /chambas/<id>/calificacion` o `POST /validacion` THEN SHALL opcionalmente guardar `habilidades_validadas[]` (array IDs) que alimenta endoso social (≥5 confirmaciones → habilidad validada automáticamente según doc origen).
**CA:** Soportes multimedia/360° del historial chamba (`evidencia_entrada/salida` 360°) son prueba técnica adicional (cláusula contrato).

## RF-65: Certificación técnica SENA / instituciones + Insignia Verificado
**EARS:**
- WHEN PDS `POST /habilidades/certificaciones {habilidad_id?, institucion, titulo, anio?, codigo_verificacion?, archivo_base64|url?}` THEN SHALL crear `CertificacionTecnica {estado: en_revision, documento_url=MinIO upload_avatar}` (no auto-verifica; requiere verificador).
- WHEN verificador revisa (vía KYC/admin flow) THEN SHALL pasar a `verificado|rechazado`; si `verificado` THEN SHALL habilitar insignia/badge "Verificado por Chambeapp" y desbloquear N4/N5.
- WHEN nivel requiere certificación (`POST .../nivel/<n>/certificacion {url|archivo_base64}`) THEN SHALL validar tipo `certificacion` y registrar `HabilidadNivel {metodo:certificacion, evidencia_url}`.
**CA:** Tarjeta UI `Perfil → Formación Técnica` muestra institución, título, año, badge; prioridad IA para verificados en solicitudes complejas. Blindaje legal: verificación documental informativa, no garantía de resultado (doc origen §6).

## RF-66: Sistema de progresión Novato → Experto (5 niveles)
**EARS:** WHEN usuario consulta `GET /habilidades/progreso` THEN sistema SHALL calcular por oficio (profile.habilidades) el nivel 1-5 con reglas reales `app/controllers/habilidades.py`:
- N1 Novato: oficio registrado (default).
- N2 Conocedor: ≥1 quiz + ≥3 trabajos completados + rating ≥4.0
- N3 Práctico: ≥1 quiz + ≥15 trabajos + rating ≥4.5
- N4 Maestro: ≥1 quiz + cert técnica `verificado` + ≥35 trabajos + rating ≥4.7
- N5 Experto/Élite: ≥1 quiz + cert `verificado` + ≥70 trabajos + rating ≥4.8
**CA:** `trabajos_completados` = contratos `completado` del PDS agrupados por categoría normalizada (sin acentos); `calificacion_promedio` de `Profile`; respuesta `[{habilidad_id, oficio, nivel, nombre_nivel, trabajos_completados, calificacion, quizzes_aprobados, titulo_verificado, habilidades[]}]`. Doc origen pedía también ARl/Seguridad Social y <5% cancelación para N5 — no implementado en código actual (gap a documentar).
**CRITERIO ACEPTACIÓN BREVE (EARS consolidado):** WHEN progreso calculado THEN SHALL retornar nivel correcto; WHEN `GET /habilidades/mis-niveles` THEN SHALL listar `HabilidadNivel` del usuario.

## Trazabilidad API
| RF | Endpoint |
|---|---|
|61|GET /habilidades, POST /habilidades, DELETE /habilidades/<id>|
|63|GET/POST /habilidades/<id>/nivel/<n>/quiz|
|65|POST /habilidades/<id>/nivel/<n>/certificacion + GET/POST /habilidades/certificaciones|
|64|POST /habilidades/endosar|
|66|GET /habilidades/progreso + GET /habilidades/mis-niveles|

*Nota verificación: categoría código en `habilidad.py` (5 valores); umbral quiz código 80% difiere doc 70% — se documenta código como fuente de verdad.*