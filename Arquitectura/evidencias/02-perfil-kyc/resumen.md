# Resumen de Ejecución — Flujo 02: Perfil de Usuario y Verificación de Identidad (KYC)

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright (Chromium Headless con renderizado SwiftShader)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-06](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-06-consulta-y-edición-de-perfil-de-usuario), [HU-07](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-07-subida-de-foto-de-perfil), [HU-51](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-51-verificación-de-identidad-kyc-con-documento), [HU-52](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-52-validación-telefónica-vía-otp-sms).

---

## 1. Identificación de Actores y Usuarios de Prueba

Este flujo involucra dos roles complementarios ejecutados por tramos separados con cierre e inicio de sesión independiente:

| Tramo | Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|:---:|---|---|---|---|:---:|
| **Tramo 1** | **PDS (Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Consulta de perfil, edición de ubicación de cuenta y subida de documento KYC | `/pds/perfil` |
| **Tramo 2** | **Solicitante (Empleador)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Verificación telefónica vía código OTP SMS en diálogo modal de perfil | `/solicitante/perfil` |

---

## 2. Pasos Ejecutados

| Paso | Tramo / Rol | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | Tramo 1 (PDS) | Login con credenciales oficiales de `pds@chambeapp.com` | `POST /api/v1/auth/login` | 200 | [01-pds-login.png](capturas/01-pds-login.png) |
| **02** | Tramo 1 (PDS) | Navegación a `/pds/perfil` — Consulta de reputación, insignias y estado | `GET /api/v1/users/me/profile`<br>`GET /api/v1/kyc/documentos/mios` | 200<br>200 | [02-pds-perfil-inicial.png](capturas/02-pds-perfil-inicial.png) |
| **03** | Tramo 1 (PDS) | Despliegue de "Datos de cuenta", edición de zona a *"Laureles, Medellín"* y guardado | `PUT /api/v1/users/me/profile` | 200 | [03-pds-datos-cuenta-editados.png](capturas/03-pds-datos-cuenta-editados.png) |
| **04** | Tramo 1 (PDS) | Despliegue de acordeón "Verificación de identidad (KYC)" con lista de requisitos | `GET /api/v1/kyc/documentos-requeridos` | 200 | [04-pds-kyc-acordeon.png](capturas/04-pds-kyc-acordeon.png) |
| **05** | Tramo 1 (PDS) | Carga de archivo de cédula CC mediante selector de archivos y confirmación | `POST /api/v1/kyc/documentos` | 200 | [05-pds-kyc-doc-subido.png](capturas/05-pds-kyc-doc-subido.png) |
| **06** | Tramo 1 (PDS) | Cierre de sesión seguro y limpieza de tokens de PDS | N/A (Client-side purge) | 200 | [06-pds-logout.png](capturas/06-pds-logout.png) |
| **07** | Tramo 2 (Solicitante) | Login con credenciales oficiales de `solicitante@chambeapp.com` | `POST /api/v1/auth/login` | 200 | [07-solicitante-login.png](capturas/07-solicitante-login.png) |
| **08** | Tramo 2 (Solicitante) | Navegación a `/solicitante/perfil` — Consulta de perfil de contratante | `GET /api/v1/users/me/profile` | 200 | [08-solicitante-perfil.png](capturas/08-solicitante-perfil.png) |
| **09** | Tramo 2 (Solicitante) | Clic en "Verificar número" en acordeón KYC, apertura de modal y envío OTP | `POST /api/v1/auth/otp/send` | 200 | [09-solicitante-otp-modal.png](capturas/09-solicitante-otp-modal.png) |
| **10** | Tramo 2 (Solicitante) | Ingreso del código OTP de 6 dígitos y verificación exitosa de contacto | `POST /api/v1/auth/otp/verify` | 200 | [10-solicitante-otp-verificado.png](capturas/10-solicitante-otp-verificado.png) |
| **11** | Tramo 2 (Solicitante) | Cierre de sesión final de Solicitante y regreso a `/login` | N/A (Client-side purge) | 200 | [11-solicitante-logout.png](capturas/11-solicitante-logout.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT PDS" },
  { "method": "GET",  "endpoint": "/api/v1/auth/me",    "status": 200, "nota": "Validación de claims y rol pds" },
  { "method": "GET",  "endpoint": "/api/v1/users/me/profile", "status": 200, "nota": "Carga inicial de perfil" },
  { "method": "GET",  "endpoint": "/api/v1/kyc/documentos/mios", "status": 200, "nota": "Consulta de documentos subidos" },
  { "method": "GET",  "endpoint": "/api/v1/kyc/documentos-requeridos", "status": 200, "nota": "Catálogo normativo KYC" },
  { "method": "PUT",  "endpoint": "/api/v1/users/me/profile", "status": 200, "nota": "Persistencia de zona y datos de cuenta" },
  { "method": "POST", "endpoint": "/api/v1/kyc/documentos", "status": 200, "nota": "Subida y registro de Cédula a MinIO" },
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT Solicitante" },
  { "method": "POST", "endpoint": "/api/v1/auth/otp/send", "status": 200, "nota": "Despacho de código OTP SMS" },
  { "method": "POST", "endpoint": "/api/v1/auth/otp/verify", "status": 200, "nota": "Acreditación de número telefónico" }
]
```

* **Control de Tokens:** Ambas sesiones intercambiaron sus respectivos tokens `access_token` en cabeceras `Authorization: Bearer ...`, verificándose la segregación de identidades y datos entre el trabajador y el solicitante.
* **Integridad de Almacenamiento:** El documento de identidad fue procesado por el backend e insertado con estado `'pendiente'` para la revisión administrativa de KYC.

---

## 4. Hallazgos y Observaciones

1. **Modularidad del Perfil:** El diseño mediante acordeones colapsables (`DatosCuentaAccordion`, `KycAccordion`, `BilleteraAccordion`, `SeguridadAccordion`) permite una navegación cómoda y compacta sin recargar la página.
2. **Diferenciación de Requisitos por Rol:** El componente `KycAccordion` adapta su interfaz según el rol: para el PDS solicita documentos formales de oficio/identidad para respaldo del cliente, mientras que para el Solicitante agiliza la validación mediante el número telefónico por OTP SMS.
3. **Modo Desarrollo para OTP:** Cuando el servicio de SMS está en modo desarrollo (`SMS_SEND_DEV=1`), el diálogo modal de verificación expone el código generado en la nota de ayuda, facilitando las pruebas automatizadas continuas de extremo a extremo sin dependencia de pasarelas de pago SMS externas.

---

## 5. Recursos Asociados al Flujo

* **Video de Grabación Completa:** [02-perfil-kyc.webm](video/02-perfil-kyc.webm) *(Duración del paso a paso continuo de ambos tramos grabado por Playwright, 4.05 MB)*.
* **Script de Re-ejecución:** [02-perfil-kyc.cjs](script/02-perfil-kyc.cjs) *(Ejecutable con `node` para reproducción exacta en vivo)*.
* **Directorio de Capturas:** [capturas/](capturas/) *(11 imágenes PNG en alta resolución numeradas en estricto orden cronológico).*
