# Política de Seguridad y Validaciones KYC (Know Your Customer) - ChambeApp

Para garantizar la seguridad de la plataforma, proteger a los usuarios y cumplir con la promesa de minimizar estafas y evitar personas con delitos pendientes, se establece el siguiente proceso de validación documental y operativa.

---

## 1. Documentación y Validaciones para Trabajadores / Prestadores de Servicio (PDS)

Dado que los trabajadores ejecutan la labor presencialmente, representan el mayor punto de riesgo y deben cumplir con los siguientes requisitos:

### 1.1 Verificación de Identidad (Obligatorios)

| # | Documento | Descripción | Tipo |
|---|-----------|-------------|------|
| 1 | **Documento de Identidad** | Fotografía nítida por ambas caras de la Cédula de Ciudadanía (CC), Cédula de Extranjería (CE) o Permiso de Protección Temporal (PPT). | Single |
| 2 | **Prueba de Vida (Biometría)** | Captura fotográfica ("selfie") en tiempo real desde la aplicación, la cual debe coincidir biométricamente con la fotografía del documento de identidad suministrado. | Single |
| 3 | **Comprobante de Residencia** | Recibo de servicios públicos, extracto bancario o certificación de dirección. Máximo 3 meses de antigüedad. | Single |

### 1.2 Verificación de Antecedentes (Obligatorios)

| # | Documento | Descripción | Tipo |
|---|-----------|-------------|------|
| 4 | **Antecedentes Judiciales** | Certificado de antecedentes judiciales emitido por la Policía Nacional. Verifica ausencia de condenas vigentes o requerimientos judiciales. | Single |
| 5 | **RNMC (Registro Nacional de Medidas Correctivas)** | Consulta para verificar la existencia de multas por comportamientos contrarios a la convivencia (ej. riñas, porte de armas blancas). | Single |
| 6 | **Antecedentes de Procuraduría** | Consulta de antecedentes disciplinarios ante la Procuraduría General de la Nación. Verifica sanciones disciplinarias vigentes. | Single |
| 7 | **Antecedentes de Contraloría** | Consulta de responsabilidad fiscal ante la Contraloría General de la República. Verifica que no existan pendientes por responsabilidad fiscal. | Single |

### 1.3 Trazabilidad Financiera (Obligatorio)

| # | Documento | Descripción | Tipo |
|---|-----------|-------------|------|
| 8 | **Certificación Bancaria** | Registro de cuenta bancaria o billetera digital (Nequi, Daviplata, Bancolombia, etc.) a nombre exclusivo del titular. **No se permite el registro de cuentas de terceros.** | **Multi-instancia** (una por cuenta) |

### 1.4 Validaciones Opcionales

| # | Documento | Descripción | Tipo |
|---|-----------|-------------|------|
| 9 | **Validación Profesional** | Tarjeta profesional, certificado SENA o constancia de competencia técnica. Para badges de habilidad. | **Multi-instancia** (una por habilidad/certificación) |
| 10 | **Salud y Seguridad (EPS + ARL)** | Certificado de afiliación activa al Sistema de Seguridad Social Integral. Obligatorio para planes Premium. | Single |
| 11 | **Certificado Laboral / Referencia de Empleo** | Constancia de trabajo o referencia de un empleador anterior. Sirve como respaldo de experiencia. | **Multi-instancia** (una por empleo) |

### 1.5 Documentos Multi-Instancia

Algunos documentos admiten múltiples ejemplares del mismo tipo. Cada ejemplar se diferencia por un nombre de instancia:

| Clave | Ejemplo de instancia |
|-------|---------------------|
| `cert_bancaria` | "Nequi", "Daviplata", "Bancolombia" |
| `validacion_profesional` | "Electricidad", "Plomería", "Certificado SENA Gas" |
| `certificado_laboral` | "Empresa XYZ 2022-2024", "Contratista ABC 2020-2022" |

---

## 2. Documentación y Validaciones para Contratantes / Empleadores (Solicitante)

Para proteger a los trabajadores y asegurar la viabilidad transaccional, los contratantes deben cumplir con:

### 2.1 Verificación Básica (Obligatorios)

| # | Documento | Descripción | Tipo |
|---|-----------|-------------|------|
| 1 | **Documento de Identidad** | Cédula de Ciudadanía (CC), Cédula de Extranjería (CE) o NIT (en caso de personas jurídicas). | Single |
| 2 | **Verificación de Contacto** | Validación del número de teléfono celular mediante código OTP (One-Time Password) enviado por SMS durante el registro. | Single |

### 2.2 Seguridad Transaccional (Obligatorio)

| # | Documento | Descripción | Tipo |
|---|-----------|-------------|------|
| 3 | **Validación de Método de Pago** | Micro-cargo de autorización vía pasarela de pagos (ej. MercadoPago) para confirmar validez, titularidad y disponibilidad de fondos. | Single |

---

## 3. Flujo de Verificación

1. **Registro** → El usuario completa datos básicos y verifica celular por OTP.
2. **Subida de documentos** → El usuario sube los documentos requeridos para su rol.
3. **Revisión** → Un verificador (rol `verificador`, `admin` o `superadmin`) revisa y aprueba/rechaza cada documento.
4. **Cálculo automático** → `Profile.verificado` se marca `True` cuando **todos** los documentos obligatorios del rol tienen estado "aprobado".
5. **Permisos** → Solo usuarios verificados pueden acceder a funcionalidades avanzadas (contratar, publicar servicios, recibir pagos).

---

## 4. Consideraciones Legales Críticas (Habeas Data)

El tratamiento de esta información se rige estrictamente por la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013:

* **Consentimiento Expreso:** Todo usuario deberá otorgar su autorización expresa, previa e informada (mediante casilla de verificación en el registro) para el tratamiento de datos personales, datos sensibles (biometría) y la consulta de antecedentes en bases de datos públicas y privadas.
* **Almacenamiento Seguro:** Las fotografías de documentos y datos biométricos serán almacenados bajo protocolos de encriptación y seguridad informática avanzados, garantizando su confidencialidad y previniendo el acceso no autorizado.

---

## 5. Endpoints KYC (API)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/v1/kyc/documentos-requeridos` | Catálogo de documentos para el rol del usuario | Autenticado |
| GET | `/api/v1/kyc/mis-documentos` | Estado de los documentos del usuario | Autenticado |
| POST | `/api/v1/kyc/documentos` | Subir/actualizar un documento (base64 MVP) | PDS, Solicitante |
| GET | `/api/v1/kyc/documentos/mios` | Documentos subidos con info del catálogo | Autenticado |
| GET | `/api/v1/kyc/pendientes` | Documentos pendientes de revisión | Verificador, Admin |
| POST | `/api/v1/kyc/documentos/<id>/verificar` | Aprobar o rechazar un documento | Verificador, Admin |

### Campos multi-instancia

- `DocumentoRequerido.multi_instancia` (Boolean): indica si el documento admite múltiples ejemplares.
- `DocumentoUsuario.instancia` (String nullable): nombre de la instancia (ej: "Nequi", "Electricidad").
- Constraint único: `(user_id, documento_clave, instancia)`.
