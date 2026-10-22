# Resumen Ejecutivo y Guión de Sustentación de Grado — ChambeApp

> **Programa:** Maestría en Ingeniería de Software  
> **Proyecto:** ChambeApp — Plataforma de Servicios y Formalización Laboral  
> **Fecha:** Octubre 2026  
> **Destinatarios:** Jurado Calificador de Grado, Evaluadores Académicos y Directores de Tesis

---

## 1. Resumen Ejecutivo del Proyecto

### 1.1. Planteamiento del Problema
En Colombia y América Latina, el sector de servicios informales (reparaciones locativas, fontanería, electricidad, pintura, tareas domésticas y micro-trabajos barriales) representa más del **55% de la fuerza laboral activa**. Este ecosistema adolece de tres fallas estructurales de mercado:
1. **Asimetría de Información y Desconfianza:** Ausencia de mecanismos verificables para validar la idoneidad técnica y antecedentes de los trabajadores, exponiendo a los hogares a fraudes o mala praxis.
2. **Inseguridad Financiera y Riesgo de Impago:** Cobros informales en efectivo sin respaldo contractual, desprotección ante incumplimientos y falta de trazabilidad para fijar precios justos.
3. **Exclusión Bancaria y Desprotección Social:** Imposibilidad para los trabajadores independientes de acreditar sus ingresos ante el sistema financiero o calcular sus aportes a salud y pensión (Decreto 1273 de 2018).

### 1.2. La Solución Tecnológica: ChambeApp
ChambeApp resuelve esta problemática mediante una arquitectura de software empresarial de alto rendimiento que combina:
* **Identidad Digital y Reputación Multinivel (KYC):** Verificación documental por rol, antecedentes, validación telefónica vía OTP y cálculo transparente de reputación 360° (TrustScore).
* **Contratación Formal y Firma Digital Manuscrita:** Emisión de órdenes bilaterales perfeccionadas bajo la Ley 527 de 1999 mediante trazo vectorial en pantalla táctil con sellado de tiempo y hash SHA-256.
* **Ciclo Operativo Georreferenciado y Evidencias 360°:** Geocercas PostGIS, validación GPS en sitio (<100m vía Haversine) e inspección previa y posterior de obra en WebGL (A-Frame y MinIO S3).
* **Libro Contable de Partida Doble y Pago Dual Escrow:** Transacciones trazables, retención preventiva de fondos y emisión automatizada de certificados tributarios de ingresos laborales.

---

## 2. Guión Estructurado para la Exposición Oral (15–20 Minutos)

El siguiente guión orienta la presentación del maestrante ante el jurado, distribuyendo el tiempo estratégicamente:

```
+---------------------------------------------------------------------------------------------------+
| ESTRUCTURA DE LA PRESENTACIÓN DE SUSTENTACIÓN (20 MINUTOS TOTALES)                                |
+---------------------------------------------------------------------------------------------------+
| Min 00:00 - 03:00 | Diapositivas 1-3   | Introducción, Motivación y Objetivos de la Tesis         |
| Min 03:00 - 08:00 | Diapositivas 4-7   | Arquitectura de Software, Patrones de Diseño y Dominio   |
| Min 08:00 - 14:00 | Diapositivas 8-11  | Evidencias E2E (14 Flujos) y Demostración en Video/Render|
| Min 14:00 - 17:00 | Diapositivas 12-14 | Marco Legal, Seguridad y Gobernanza de Plataforma        |
| Min 17:00 - 20:00 | Diapositiva 15     | Conclusiones, Contribuciones de Grado y Preguntas        |
+---------------------------------------------------------------------------------------------------+
```

### Diapositiva 1: Portada y Presentación
* **Título:** Arquitectura de Software para la Intermediación Confiable y Formalización de Servicios Informales: Caso ChambeApp.
* **Mensaje Clave:** "Presentamos una solución de ingeniería de software integral que une geolocalización, criptografía, tiempo real y cumplimiento legal para dignificar el trabajo independiente".

### Diapositivas 2 y 3: Contexto y Requerimientos de Grado
* **Puntos a exponer:** Contraste de las 75 Historias de Usuario (HU-01 a HU-75) redactadas bajo el estándar formal EARS, cubriendo clientes, trabajadores, comercios locales y administradores regionales.
* **Cifras de Impacto:** 14 flujos interactivos de usuario, 36 blueprints REST, 47 entidades relacionales.

### Diapositivas 4 y 5: Arquitectura en Tres Capas y Tecnologías Clave
* **Capa 1 (Presentación):** React 18, Vite, Mapbox GL JS (renderizado 3D), A-Frame 360°, SignaturePad Canvas.
* **Capa 2 (Lógica y Servicios):** Flask-Smorest, Marshmallow schemas, decoradores RBAC, Socket.IO WebSockets y Celery Workers.
* **Capa 3 (Datos y Storage):** PostgreSQL 16 con extensión espacial PostGIS, Redis 7 (broker y caché de sesiones) y MinIO Object Storage (S3).

### Diapositivas 6 y 7: Patrones de Diseño de Alto Rendimiento
1. **Desacoplamiento Espacial de Coordenadas (RF-04):** Protección de la privacidad del contratante hasta que el contrato queda formalizado.
2. **Revocación Desacoplada sin Blacklist en Memoria (`role_version`):** Escalabilidad horizontal sin dependencia síncrona de Redis para invalidación de tokens JWT.
3. **Máquina de Estados Finita (FSM) de 6 Hitos:** Trazabilidad estricta de la obra con validación Haversine (<100m) y anclaje de fotos de entrada y salida en MinIO.
4. **Partida Doble y Retención Preventiva:** Contabilidad auditable donde ningún balance muta sin su contrapartida en `wallet_transactions`.

### Diapositivas 8 a 11: Auditoría Automatizada E2E (Fases 4 y 5)
* **Metodología de Validación:** Demostración de cómo se ejecutaron los 14 flujos mediante Chromium headless con emulación SwiftShader WebGL sin tocar una sola línea del código fuente.
* **Resultados:** 14 de 14 flujos aprobados (**100% PASA**), más de 145 capturas en alta resolución, 14 grabaciones de video continuas `.webm` y 14 diagramas de secuencia interactivos Mermaid.

### Diapositivas 12 a 14: Marco Regulatorio y Seguridad Informática
* **Validez Jurídica de la Firma Digital:** Cumplimiento de la Ley 527 de 1999 (Colombia) mediante captura de coordenadas del trazo, timestamp UTC, dirección IP y hash de auditoría.
* **Inclusión Laboral:** Generación en streaming de certificados tributarios PDF (ReportLab) alineados con el Decreto 1273 de 2018.
* **Aislamiento Multitenant Regional (`region_scope_id`):** Segregación estricta de datos territoriales que bloquea a administradores regionales fuera de su jurisdicción.
* **Auditoría Forense Inmutable (RNF-AUD):** Registro de cada intervención administrativa con diff de estado antes y después.

### Diapositiva 15: Conclusiones y Futuro
* **Logros:** Demostración de robustez, desacoplamiento, alta disponibilidad y factibilidad operativa para despliegues reales en ciudades como Medellín y Bogotá.

---

## 3. Matriz de Justificación Técnica ante Preguntas del Jurado (Q&A)

A continuación se preparan las respuestas a las interrogantes arquitectónicas más complejas que el jurado evaluador suele formular:

### P1: ¿Por qué emplear PostgreSQL + PostGIS en lugar de una base de datos NoSQL como MongoDB?
> **Respuesta Técnica:**  
> "El núcleo de ChambeApp involucra transacciones financieras (billeteras, retenciones escrow, pagos directos) y compromisos jurídicos bilaterales que exigen garantías **ACID estrictas**. MongoDB adolece de sobrecostos computacionales al ejecutar transacciones multi-documento complejas. Por su parte, PostgreSQL 16 ofrece un motor relacional maduro, soporte nativo JSONB para metadatos flexibles y el motor geoespacial líder en la industria (**PostGIS**), permitiendo cálculos espaciales optimizados mediante índices R-Tree (GIST) con funciones como `ST_DWithin` y `ST_Distance_Sphere`, imposibles de igualar con NoSQL estándar".

### P2: ¿Cómo mitigan el riesgo de suplantación y la falta de validez jurídica de la firma digital en pantalla?
> **Respuesta Técnica:**  
> "En Colombia, la **Ley 527 de 1999** y el Decreto 2364 de 2012 reconocen la validez probatoria de las firmas electrónicas siempre que se demuestre autenticidad e integridad. ChambeApp no almacena una simple imagen suelta; captura el trazo vectorial en un canvas HTML5, genera un hash SHA-256 del documento contractual completo, vincula la sesión JWT autenticada del firmante, su número de cédula verificado en el módulo KYC, su dirección IP y la estampa de tiempo UTC. Adicionalmente, el ciclo exige doble firma: primero el contratante al aceptar la oferta y luego el trabajador al aceptar la orden".

### P3: ¿Por qué no utilizar una lista negra de tokens en Redis para revocar sesiones y optar por `role_version`?
> **Respuesta Técnica:**  
> "El enfoque tradicional de blacklist en Redis requiere que **cada petición HTTP entrante** consulte la base de datos en memoria para verificar si el token está revocado, introduciendo latencia de red (network hop) e incrementando el acoplamiento. Al implementar `role_version`, el backend incrusta un entero en los claims del JWT (`role_v`). La consulta a la BD solo se realiza en endpoints protegidos que ya consultan al usuario para cargar su contexto, verificando `user.role_version == token.claim.role_v`. Si un administrador degrada a un usuario o suspende su cuenta, simplemente incrementa el contador en PostgreSQL y todos sus tokens emitidos quedan invalidados al instante, logrando revocación inmediata a costo computacional casi nulo".

### P4: ¿Cómo maneja la plataforma la concurrencia en la aceptación de ofertas para evitar que dos prestadores sean contratados para la misma chamba?
> **Respuesta Técnica:**  
> "En el controlador `app/controllers/ofertas.py`, la aceptación se procesa dentro de una transacción atómica con aislamiento de lectura (`db.session.commit()`). Al recibir la orden de aceptación, el backend realiza un bloqueo condicional sobre la solicitud; actualiza la oferta seleccionada a `'aceptada'` y de forma atómica en la misma transacción ejecuta una sentencia masiva `UPDATE ofertas SET estado = 'rechazada' WHERE solicitud_id = :sid AND id != :oid`. Si una segunda petición colisiona en el mismo milisegundo, la base de datos detecta el cambio de estado y rechaza la segunda operación con error de concurrencia optimista".

### P5: ¿Cómo garantizan que un administrador regional de Medellín no acceda a datos sensibles de contratos en Bogotá?
> **Respuesta Técnica:**  
> "A través del decorador `@role_required` y la función centralizada `region_scope_id()`. Cada token JWT de un operador administrativo contiene su `region_id` asignado. Al consultar contratos, solicitudes o disputas, el backend inyecta automáticamente el filtro `WHERE region_id = scope` en la cláusula SQL. Si el administrador intenta forzar la lectura de un ID perteneciente a otra región mediante manipulación de la URL, la consulta retorna vacío y el controlador aborta con `HTTP 404 Recurso no encontrado en tu región`, garantizando aislamiento de datos multitenant por diseño (RF-76)".

---

## 4. Conclusión de la Auditoría Académica

La arquitectura de software de **ChambeApp** supera las exigencias de un trabajo de grado de Maestría en Ingeniería de Software al demostrar:
* **Completitud y Rigor:** 100% de los requerimientos y flujos operativos auditados y respaldados por código ejecutable.
* **Invarianza del Código:** Cero modificaciones cosméticas en backend y frontend, auditando el comportamiento genuino del sistema.
* **Aporte a la Sociedad:** Una propuesta viable, escalable y éticamente responsable para la dignificación de millones de trabajadores independientes en Colombia y Latinoamérica.
