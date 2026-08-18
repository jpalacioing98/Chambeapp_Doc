# Política de Seguridad y Validaciones KYC (Know Your Customer) - ChambeApp

Para garantizar la seguridad de la plataforma, proteger a los usuarios y cumplir con la promesa de minimizar estafas y evitar personas con delitos pendientes, se establece el siguiente proceso de validación documental y operativa.

---

## 1. Documentación y Validaciones para Trabajadores / Prestadores de Servicio

Dado que los trabajadores ejecutan la labor presencialmente, representan el mayor punto de riesgo y deben cumplir con los siguientes requisitos:

### 1.1 Verificación de Identidad (Antisuplantación)
* **Documento de Identidad:** Fotografía nítida por ambas caras de la Cédula de Ciudadanía (CC), Cédula de Extranjería (CE) o Permiso de Protección Temporal (PPT).
* **Prueba de Vida (Biometría):** Captura fotográfica ("selfie") en tiempo real desde la aplicación, la cual debe coincidir biométricamente con la fotografía del documento de identidad suministrado.

### 1.2 Verificación de Antecedentes (Prevención de delitos)
* **Certificado de Antecedentes Judiciales:** Consulta automatizada en las bases de datos de la Policía Nacional para verificar la ausencia de condenas vigentes o requerimientos judiciales.
* **Registro Nacional de Medidas Correctivas (RNMC):** Consulta para verificar la existencia de multas por comportamientos contrarios a la convivencia (ej. riñas, porte de armas blancas).

### 1.3 Trazabilidad Financiera (Antifraude y Lavado de Activos)
* **Certificación Bancaria:** Registro de una cuenta bancaria o billetera digital (Nequi, Daviplata, Bancolombia, etc.) a nombre exclusivo del titular de la cuenta en la plataforma. **No se permite el registro de cuentas de terceros.**

### 1.4 Validaciones Opcionales / Específicas
* **Validación Profesional (Para "Badges de Habilidad"):** Carga de tarjetas profesionales (ej. CONTE para electricistas) o certificados de aptitud profesional (ej. SENA) para oficios que requieran certificación técnica.
* **Salud y Seguridad:** Certificado de afiliación activa al Sistema de Seguridad Social Integral (EPS y ARL), requerido obligatoriamente para acceder a los planes de suscripción Premium.

---

## 2. Documentación y Validaciones para Contratantes / Empleadores

Para proteger a los trabajadores y asegurar la viabilidad transaccional, los contratantes deben cumplir con:

### 2.1 Verificación Básica
* **Documento de Identidad:** Cédula de Ciudadanía (CC), Cédula de Extranjería (CE) o NIT (en caso de personas jurídicas).
* **Verificación de Contacto:** Validación del número de teléfono celular mediante código OTP (One-Time Password) enviado por SMS durante el registro.

### 2.2 Seguridad Transaccional
* **Validación de Método de Pago:** Al registrar una tarjeta de crédito o débito, la pasarela de pagos (ej. MercadoPago) realizará un cobro de autorización (micro-cargo que será reversado posteriormente) para confirmar la validez, titularidad y disponibilidad de fondos del medio de pago.

---

## 3. Consideraciones Legales Críticas (Habeas Data)

El tratamiento de esta información se rige estrictamente por la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013:

* **Consentimiento Expreso:** Todo usuario deberá otorgar su autorización expresa, previa e informada (mediante casilla de verificación en el registro) para el tratamiento de datos personales, datos sensibles (biometría) y la consulta de antecedentes en bases de datos públicas y privadas.
* **Almacenamiento Seguro:** Las fotografías de documentos y datos biométricos serán almacenados bajo protocolos de encriptación y seguridad informática avanzados, garantizando su confidencialidad y previniendo el acceso no autorizado.
