# Resumen de Ejecución — Flujo 05: Negociación Bilateral de Ofertas y Firma Digital de Contrato

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright (Chromium Headless con renderizado SwiftShader y emulación de puntero para firma digital)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-15](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-15-gestión-y-aceptación-de-ofertas-recibidas), [HU-16](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-16-formalización-de-contrato-digital), [HU-44](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-44-contraofertas-y-negociación-bilateral), [HU-45](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-45-firma-digital-en-pantalla-completa-con-evidencia-biométrica), [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-inicio-de-sesión).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente/Contratante)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Revisión de propuestas económicas, aceptación de oferta #3 ($120.000 COP) y suscripción digital como contratante | `/solicitante/solicitudes/8`, `/contrato/firmar` |
| **PDS (Proveedor/Contratista Independiente)** | `pds@chambeapp.com` | `********` *(users.md)* | Inspección de contrato pendiente en hub de chambas, contrafirma digital manuscrita y activación legal de la orden | `/pds/chambas`, `/contrato/firmar` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login` | Autenticación inicial con credenciales del Cliente Solicitante | `POST /api/v1/auth/login` | 200 | [01-solicitante-login.png](capturas/01-solicitante-login.png) |
| **02** | `/solicitante/solicitudes` | Acceso al hub de solicitudes activas del contratante | `GET /api/v1/solicitudes/` | 200 | [02-solicitante-solicitudes.png](capturas/02-solicitante-solicitudes.png) |
| **03** | `/solicitante/solicitudes/8` | Apertura de administración de Solicitud #8 y visualización de ofertas recibidas | `GET /api/v1/solicitudes/8`<br>`GET /api/v1/solicitudes/8/ofertas` | 200<br>200 | [03-solicitante-ofertas-recibidas.png](capturas/03-solicitante-ofertas-recibidas.png) |
| **04** | `/contrato/firmar` | Clic en *"Aceptar"* propuesta de PDS ($120.000 COP); apertura de documento contractual a pantalla completa con cláusulas 1 a 8 | `GET /api/v1/users/:id/profile` | 200 | [04-contrato-solicitante-vista.png](capturas/04-contrato-solicitante-vista.png) |
| **05** | Formulario de Firma Solicitante | Ingreso de Nombre Completo, Cédula de Ciudadanía (`1098765432`) y trazado de firma manuscrita sobre `SignaturePad` | N/A (Estado React Local) | N/A | [05-contrato-solicitante-firmado.png](capturas/05-contrato-solicitante-firmado.png) |
| **06** | `/solicitante/solicitudes/8` | Confirmación con *"Firmar y aceptar oferta"*; generación del contrato en backend y actualización del presupuesto a $120.000 | `POST /api/v1/ofertas/3/responder`<br>`POST /api/v1/conversations` | **200**<br>200 | [06-solicitante-oferta-aceptada.png](capturas/06-solicitante-oferta-aceptada.png) |
| **07** | `/login` | Cierre de sesión del Solicitante e inicio de sesión seguro del PDS (`pds@chambeapp.com`) | `POST /api/v1/auth/login` | 200 | [07-pds-login.png](capturas/07-pds-login.png) |
| **08** | `/pds/chambas` | Despliegue de panel *"Mis chambas"*; contrato `ct-1` listado bajo estado *"Por firmar"* con botón de acción *"Firmar contrato"* | `GET /api/v1/contracts/mine`<br>`GET /api/v1/mis-ofertas` | 200<br>200 | [08-pds-contrato-pendiente.png](capturas/08-pds-contrato-pendiente.png) |
| **09** | `/contrato/firmar` | Apertura de formalización como PDS; ingreso de datos de Carlos Pérez (`1020304050`), trazado de firma y habilitación de aceptación | `GET /api/v1/contracts/1` | 200 | [09-contrato-pds-firmado.png](capturas/09-contrato-pds-firmado.png) |
| **10** | `/pds/chambas` | Clic en *"Firmar y aceptar contrato"*; perfeccionamiento legal del contrato, creación de la entidad `Chamba` operativa y estado *"En curso"* | `PATCH /api/v1/contracts/1/estado` | **200** | [10-pds-chamba-en-curso.png](capturas/10-pds-chamba-en-curso.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST",  "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT Solicitante" },
  { "method": "GET",   "endpoint": "/api/v1/solicitudes/8", "status": 200, "nota": "Carga de publicación de tubería" },
  { "method": "GET",   "endpoint": "/api/v1/solicitudes/8/ofertas", "status": 200, "nota": "Lectura de ofertas recibidas" },
  { "method": "POST",  "endpoint": "/api/v1/ofertas/3/responder", "status": 200, "nota": "Aceptación de oferta del PDS y creación de contrato pendiente (ID 1)" },
  { "method": "POST",  "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Autenticación JWT PDS" },
  { "method": "GET",   "endpoint": "/api/v1/contracts/mine", "status": 200, "nota": "Listado de contratos del PDS reflejando estado 'pendiente'" },
  { "method": "GET",   "endpoint": "/api/v1/contracts/1", "status": 200, "nota": "Inspección de datos de servicio y partes para formalización" },
  { "method": "PATCH", "endpoint": "/api/v1/contracts/1/estado", "status": 200, "nota": "Firma del PDS ({ estado: 'aceptar' }); contrato pasa a 'en_progreso' y solicitud a 'asignada'" },
  { "method": "GET",   "endpoint": "/api/v1/chambas/prestador/1", "status": 200, "nota": "Comprobación de nueva entidad Chamba generada para gestión de hitos" }
]
```

* **Transición de Estado Bilateral:**
  1. `POST /api/v1/ofertas/3/responder` (`accion: 'aceptar'`):
     - `ofertas.estado` transiciona a `'aceptada'`.
     - Las ofertas rivales pasan automáticamente a `'rechazada'`.
     - `solicitudes.presupuesto` se actualiza al valor pactado ($120.000 COP).
     - Se instancia `Contract` con `estado = 'pendiente'`.
  2. `PATCH /api/v1/contracts/1/estado` (`estado: 'aceptar'`):
     - `contratos.estado` transiciona a `'en_progreso'`.
     - `solicitudes.estado` transiciona a `'asignada'`.
     - Se instancia automáticamente la entidad operativa `Chamba` con `estado = 'programada'` (Hito 1 listo para ejecución operativa).

---

## 4. Hallazgos y Observaciones de Arquitectura

1. **Blindaje Jurídico Integral (Ley 527 de 1999 de Comercio Electrónico):** La vista contractual `/contrato/firmar` traslada fielmente los términos de exoneración y mediación técnica de la plataforma en 8 cláusulas estructuradas. Especifica que el chat oficial y las fotos panorámicas 360° forman un anexo técnico indivisible del contrato.
2. **Firma Digital con Soporte Biométrico Manuscrito:** El componente `SignaturePad` renderiza sobre un elemento HTML5 `<canvas>` escalado según el `devicePixelRatio`, capturando la rúbrica mediante eventos de puntero unificados (`PointerEvent`) que soportan mouse, lápiz óptico y pantallas táctiles capacitivas.
3. **Flujo Desacoplado y Resiliente:** La contrafirma del PDS no requiere que ambas partes coincidan simultáneamente en una sala de chat; el PDS recibe la orden directamente en su hub `/pds/chambas` bajo la sección *"Por firmar"*, permitiendo firmar de manera asíncrona pero vinculante.
4. **Activación Automática de Expediente Operativo:** Al completarse la contrafirma del PDS, el backend ejecuta una transacción atómica que genera el registro en la tabla `chambas`. La interfaz del PDS reemplaza instantáneamente el botón *"Firmar contrato"* por el acceso principal *"Abrir expediente"*, habilitando el paso directo al Flujo 06 (Ejecución y Ciclo Operativo de 6 Hitos).

---

## 5. Recursos Asociados al Flujo

* **Video de Grabación Completa:** [05-negociacion-contrato-firma.webm](video/05-negociacion-contrato-firma.webm) *(Registro audiovisual continuo de ambas firmas digitales y transiciones de estado, 7.89 MB)*.
* **Script de Re-ejecución:** [05-negociacion-contrato-firma.cjs](script/05-negociacion-contrato-firma.cjs) *(Script reproducible con Node.js y Playwright)*.
* **Directorio de Capturas:** [capturas/](capturas/) *(10 capturas en alta resolución numeradas cronológicamente).*
