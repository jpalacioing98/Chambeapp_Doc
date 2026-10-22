# Resumen de Ejecución — Flujo 01: Autenticación, Registro y Recuperación de Credenciales

> **Fecha de Ejecución:** 20 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright (Chromium Headless con renderizado SwiftShader)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-registro-de-usuario), [HU-02](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-02-inicio-de-sesión-y-autenticación-jwt), [HU-03](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-03-cierre-de-sesión), [HU-49](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-49-autenticación-en-dos-factores-2fa-totp), [HU-50](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-50-recuperación-de-contraseña-mediante-código-otp).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Estado de Sesión Inicial | Módulo Destino |
|---|---|---|---|---|
| **PDS (Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Sin sesión (Limpio) | `/pds` |
| **Visitante / Nuevo Registro** | `carlos.mendoza.demo@chambeapp.com` | `********` | Sin sesión | `/register` |

---

## 2. Pasos Ejecutados

| Paso | Rol Interviniente | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | Sin Sesión | Navegación a `/login` en estado limpio inicial | N/A | 200 | [01-login-vacio.png](capturas/01-login-vacio.png) |
| **02** | Sin Sesión | Caso alterno: intento de login con credenciales erróneas | `POST /api/v1/auth/login` | 401 | [02-login-error-credenciales.png](capturas/02-login-error-credenciales.png) |
| **03** | Sin Sesión | Subflujo de recuperación: clic en "¿Olvidaste tu contraseña?" y envío de correo | Interfaz / View Recover | 200 | [03-recuperar-contrasena.png](capturas/03-recuperar-contrasena.png) |
| **04** | Nuevo Usuario | Navegación a `/register` — Selección de Rol Trabajador (PDS) | N/A | 200 | [04-registro-paso0-rol.png](capturas/04-registro-paso0-rol.png) |
| **05** | Nuevo Usuario | Formulario de Registro — Paso 1: Datos de Identidad (Nombre, Cédula CC) | N/A | 200 | [05-registro-paso1-identidad.png](capturas/05-registro-paso1-identidad.png) |
| **06** | Nuevo Usuario | Formulario de Registro — Paso 2: Cuenta (Email, Usuario, Teléfono, Password) | N/A | 200 | [06-registro-paso2-cuenta.png](capturas/06-registro-paso2-cuenta.png) |
| **07** | Nuevo Usuario | Formulario de Registro — Paso 3: Aceptación de Términos, Datos y KYC | N/A | 200 | [07-registro-paso3-terminos.png](capturas/07-registro-paso3-terminos.png) |
| **08** | PDS Oficial | Login exitoso con credenciales de `users.md` (`pds@chambeapp.com`) | `POST /api/v1/auth/login`<br>`GET /api/v1/auth/me` | 200<br>200 | [08-pds-dashboard-exito.png](capturas/08-pds-dashboard-exito.png) |
| **09** | PDS Oficial | Navegación a perfil del trabajador (`/pds/perfil`) previo al cierre | `GET /api/v1/users/me/profile` | 200 | [09-pds-perfil-logout.png](capturas/09-pds-perfil-logout.png) |
| **10** | PDS Oficial | Clic en "Cerrar sesión", destrucción de tokens y redirección | N/A (Client-side purge) | 200 | [10-logout-redireccion.png](capturas/10-logout-redireccion.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

```json
[
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 401, "nota": "Validación caso alterno (contraseña errónea)" },
  { "method": "POST", "endpoint": "/api/v1/auth/login", "status": 200, "nota": "Login exitoso PDS" },
  { "method": "GET",  "endpoint": "/api/v1/auth/me",    "status": 200, "nota": "Obtención de perfil y rol (pds)" },
  { "method": "GET",  "endpoint": "/api/v1/users/me/profile", "status": 200, "nota": "Datos completos de perfil" },
  { "method": "GET",  "endpoint": "/api/v1/solicitudes/",     "status": 200, "nota": "Carga inicial feed solicitudes" },
  { "method": "GET",  "endpoint": "/api/v1/contracts/mine",   "status": 200, "nota": "Contratos activos del trabajador" },
  { "method": "GET",  "endpoint": "/api/v1/wallet/",          "status": 200, "nota": "Balance disponible y retenido" }
]
```

* **Control de Tokens:** Se constató que `localStorage.getItem('access_token')` y `localStorage.getItem('user')` se crearon correctamente tras el login y fueron eliminados por completo al ejecutar el logout.
* **Seguridad de Cabeceras:** Todas las llamadas autenticadas llevaron la cabecera `Authorization: Bearer ...` válida, respondiendo con código HTTP 200 (sin caídas a 401 ni mensajes de *"Missing authorization header"*).

---

## 4. Hallazgos y Observaciones

1. **Gestión de Errores Inline:** El componente `LoginPage.tsx` maneja de forma adecuada el error 401 del backend, desplegando la alerta visual sin congelar la interfaz ni romper la navegación.
2. **Persistencia del Borrador de Registro:** El formulario de registro multipaso conserva los datos ingresados en caso de navegación accidental a los términos de servicio mediante el helper `registerDraft`.
3. **Cierre de Sesión Seguro:** Al pulsar el botón "Cerrar sesión" en `/pds/perfil`, se purgan las claves `access_token`, `refresh_token` y `user` en el cliente, evitando re-accesos no autenticados mediante el botón atrás del navegador.

---

## 5. Recursos Asociados al Flujo

* **Video de Grabación Completa:** [01-autenticacion-registro.webm](video/01-autenticacion-registro.webm) *(Duración del paso a paso continuo grabado por Playwright)*.
* **Script de Re-ejecución:** [01-autenticacion-registro.cjs](script/01-autenticacion-registro.cjs) *(Ejecutable con `node` para reproducción exacta en vivo)*.
* **Directorio de Capturas:** [capturas/](capturas/) *(10 imágenes PNG en alta resolución).*
