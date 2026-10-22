# Resumen de Ejecución — Flujo 11: Billetera Digital, Recargas Simuladas y Paquetes de Monedas

> **Fecha de Ejecución:** 21 de Octubre de 2026  
> **Entorno de Prueba:** Frontend en `http://localhost:5173`, Backend en `http://localhost:5000/api/v1`  
> **Herramienta de Automatización:** Playwright Chromium Headless (SwiftShader WebGL, Mapbox GL JS, monitoreo de red y preservación JWT)  
> **Resultado General:** **PASA (100% Exitoso)**  
> **Historias de Usuario Cubiertas:** [HU-25](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-25-visualización-de-billetera-digital), [HU-26](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-26-recarga-de-saldo-simulada), [HU-27](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-27-solicitud-de-retiro-de-fondos), [HU-28](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-28-historial-de-transacciones), [HU-66](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-66-compra-de-paquetes-de-chambecoins), [HU-67](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-67-gamificación-e-hitos-de-monedas), [HU-68](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-68-certificado-tributario-de-ingresos-pdf).

---

## 1. Identificación de Actores y Usuarios de Prueba

| Actor / Rol | Usuario (Email) | Contraseña | Responsabilidad en la Prueba | Módulo Destino |
|---|---|---|---|:---:|
| **Solicitante (Cliente / Empleador)** | `solicitante@chambeapp.com` | `********` *(users.md)* | Consulta de saldo inicial, recarga simulada de fondos vía Nequi ($250.000 COP), adquisición de paquete estándar de ChambeCoins (150 + 15 bonus) y consulta de balance de monedas | `/solicitante/billetera` |
| **Prestador de Servicios (PDS / Trabajador)** | `pds@chambeapp.com` | `********` *(users.md)* | Consulta de billetera operativa, recarga de fondos ($200.000 COP), solicitud de retiro bancario con retención preventiva ($80.000 COP a Bancolombia), descarga de certificado de ingresos en PDF, recepción de monedas promocionales y auditoría del hub de hitos `/pds/coins` | `/pds/billetera`<br>`/pds/coins` |

---

## 2. Pasos Ejecutados

| Paso | Pantalla / Vista | Acción Realizada en Frontend | Endpoint Invocado | Código HTTP | Evidencia Visual (Relativa) |
|:---:|:---|:---|:---|:---:|:---|
| **01** | `/login`<br>`/solicitante/billetera` | Solicitante inicia sesión y accede al panel de Billetera; visualiza estado inicial con saldo disponible `$0` COP, `0` monedas y ledger de movimientos vacío | `POST /api/v1/auth/login`<br>`GET /api/v1/wallet/`<br>`GET /api/v1/wallet/coins`<br>`GET /api/v1/wallet/history` | 200<br>200<br>200<br>200 | [01-solicitante-billetera-saldo-inicial.png](capturas/01-solicitante-billetera-saldo-inicial.png) |
| **02** | Modal `Recargar saldo` | Apertura de modal de abono; diligenciamiento del campo de monto con `$250.000` COP; la UI advierte integración con pasarela simulada Nequi | *(Renderizado de modal React)* | — | [02-solicitante-modal-recarga-nequi.png](capturas/02-solicitante-modal-recarga-nequi.png) |
| **03** | `/solicitante/billetera` | Confirmación de recarga simulada; actualización inmediata del saldo disponible a `$250.000` COP y registro contable de entrada `+$250.000` (Depósito vía Nequi) | `POST /api/v1/wallet/deposit` | **201** | [03-solicitante-recarga-exitosa-movimientos.png](capturas/03-solicitante-recarga-exitosa-movimientos.png) |
| **04** | `/solicitante/billetera` (Tab Coins) | Compra del paquete estándar de ChambeCoins (150 monedas + 15 bonus); actualización del contador a `165` monedas compradas (`Total: 165`) | `POST /api/v1/wallet/coins/buy`<br>`GET /api/v1/wallet/coins` | **201**<br>200 | [04-solicitante-coins-adquiridos-balance.png](capturas/04-solicitante-coins-adquiridos-balance.png) |
| **05** | `/login`<br>`/pds/billetera` | Prestador PDS inicia sesión y accede a su billetera operativa; la cabecera expone acciones multirrol exclusivas: botón *"Certificado"* y botón *"Recargar"* | `POST /api/v1/auth/login`<br>`GET /api/v1/wallet/`<br>`GET /api/v1/wallet/coins` | 200<br>200<br>200 | [05-pds-billetera-vista-general.png](capturas/05-pds-billetera-vista-general.png) |
| **06** | Modal `Recargar saldo` (PDS) | PDS realiza abono operativo de `$200.000` COP vía pasarela simulada Nequi; saldo disponible actualizado a `$200.000` COP y asiento en historial | `POST /api/v1/wallet/deposit` | **201** | [06-pds-recarga-fondos-operativos.png](capturas/06-pds-recarga-fondos-operativos.png) |
| **07** | `/pds/billetera` | PDS solicita retiro bancario por `$80.000` COP con destino a cuenta Bancolombia; el backend debita saldo disponible a `$120.000` y traslada `$80.000` a `saldo_bloqueado` | `POST /api/v1/wallet/withdraw`<br>`GET /api/v1/wallet/` | **201**<br>200 | [07-pds-retiro-bancario-retencion.png](capturas/07-pds-retiro-bancario-retencion.png) |
| **08** | Modal `Certificado de ingresos` | PDS abre modal de certificación tributaria; visualiza balance acumulado `$120.000 COP`, fecha de corte y descarga el documento oficial generado en ReportLab PDF | `GET /api/v1/payments/certificado-ingresos/pdf` | **200** | [08-pds-modal-certificado-ingresos-pdf.png](capturas/08-pds-modal-certificado-ingresos-pdf.png) |
| **09** | `/pds/billetera` (Tab Coins) | Acreditación de bonificación promocional de `50` ChambeCoins por desempeño; pestaña Coins audita `50` promocionales en tiempo real | `GET /api/v1/wallet/coins` | 200 | [09-pds-coins-bonificacion-promocional.png](capturas/09-pds-coins-bonificacion-promocional.png) |
| **10** | `/pds/coins` | PDS navega al Hub de Gamificación e Hitos; audita métricas de monedas disponibles (`50`), monedas ganadas, hitos desbloqueables y catálogo de canjes | `GET /api/v1/wallet/coins`<br>`GET /api/v1/wallet/milestones/1`<br>`GET /api/v1/wallet/milestones/2` | 200<br>200<br>200 | [10-pds-hub-coins-milestones-canjes.png](capturas/10-pds-hub-coins-milestones-canjes.png) |

---

## 3. Peticiones de Red Clave Registradas (Auditoría de API)

Durante la sesión se registraron un total de **71 peticiones HTTP**, todas resueltas con código 200 OK o 201 Created sin advertencias:

```json
[
  { "method": "GET",  "endpoint": "/api/v1/wallet/", "status": 200, "nota": "Consulta de saldos de billetera: disponible y saldo retenido/bloqueado" },
  { "method": "GET",  "endpoint": "/api/v1/wallet/coins", "status": 200, "nota": "Consulta de monedas discriminadas por tipo: comprada, ganada y promocional" },
  { "method": "GET",  "endpoint": "/api/v1/wallet/history", "status": 200, "nota": "Consulta de transacciones históricas ordenadas cronológicamente descendente" },
  { "method": "POST", "endpoint": "/api/v1/wallet/deposit", "status": 201, "nota": "Abono simulado (Nequi/Daviplata) incrementando saldo disponible y emitiendo Tx" },
  { "method": "POST", "endpoint": "/api/v1/wallet/coins/buy", "status": 201, "nota": "Compra de paquete de monedas (estándar: 150 + 15 bono de bienvenida)" },
  { "method": "POST", "endpoint": "/api/v1/wallet/withdraw", "status": 201, "nota": "Solicitud de retiro: valida saldo disponible, debita y traslada a saldo_bloqueado" },
  { "method": "GET",  "endpoint": "/api/v1/payments/certificado-ingresos/pdf", "status": 200, "nota": "Generación ReportLab en streaming con headers application/pdf y descarga legal" },
  { "method": "GET",  "endpoint": "/api/v1/wallet/milestones/1", "status": 200, "nota": "Consulta de progreso de hitos de gamificación y logros para PDS" }
]
```

---

## 4. Auditoría Técnica de Arquitectura y Propuestas de Mejora de Grado

Durante la auditoría del subsistema financiero, de custodia y de gamificación, se identificaron patrones de diseño de alto impacto para la defensa de tesis:

### 1. Principio de Partida Doble y Retención Preventiva en Retiros (Escrow Contable)
* **Diagnóstico:** En sistemas de economía compartida, un error común consiste en debitar el saldo disponible solo cuando la transferencia bancaria ha finalizado en la red ACH, lo cual expone a la plataforma a ataques de doble gasto (*double spending*).
* **Solución Arquitectónica ChambeApp:** El modelo `Wallet` implementa dos campos diferenciados: `saldo` (disponible para contratación o retiro inmediato) y `saldo_bloqueado` (comprometido en órdenes de retiro en proceso o contratos activos en hito). Al invocar `POST /api/v1/wallet/withdraw`, el backend ejecuta en una transacción atómica ACID:
  $$\text{saldo}_{\text{nuevo}} = \text{saldo}_{\text{actual}} - \text{monto}$$
  $$\text{saldo\_bloqueado}_{\text{nuevo}} = \text{saldo\_bloqueado}_{\text{actual}} + \text{monto}$$
  De esta forma, la suma $\text{saldo} + \text{saldo\_bloqueado}$ preserva el principio contable de balance patrimonial sin riesgo de sobregiro.
* **Propuesta Técnica para el Backend:** Implementar una restricción de integridad a nivel de base de datos (`CHECK (saldo >= 0 AND saldo_bloqueado >= 0)`) para asegurar a nivel de motor PostgreSQL que ningún retiro concurrente degrade el saldo por debajo de cero.

### 2. Jerarquía de Consumo y Segregación de Tipos de Moneda (ChambeCoins)
* **Diagnóstico:** El sistema de gamificación clasifica las monedas en tres modalidades: `comprada` (adquirida con dinero fiduciario COP, sin fecha de expiración), `ganada` (obtenida por cumplimiento de hitos y contratos) y `promocional` (otorgada por marketing, con expiración temporal en `vence_en`).
* **Beneficio Arquitectónico:** La función `usar_monedas()` en `backend/app/services/wallet.py` aplica una política contable FIFO (*First-In, First-Out*) optimizada por costo: consume primero las monedas promocionales (de mayor riesgo de caducidad), luego las ganadas y finalmente las compradas. Esto maximiza el valor percibido del usuario protegiendo su inversión monetaria real.
* **Propuesta Técnica de Grado:** Exponer en el endpoint `GET /api/v1/wallet/coins` una clave `proximas_a_vencer` que indique al usuario cuántas monedas promocionales expiran en los próximos 7 días, disparando notificaciones push proactivas para incentivar el destaque de ofertas antes de su caducidad.

### 3. Generación Segura de Certificados de Ingresos en PDF mediante ReportLab
* **Diagnóstico:** La generación de certificados fiscales para prestadores independientes suele realizarse mediante librerías de navegador pesadas (e.g., Puppeteer/html-pdf) con alto consumo de memoria RAM.
* **Solución Arquitectónica ChambeApp:** El controlador `backend/app/controllers/payments.py` utiliza `ReportLab` compilado nativamente en Python, construyendo el documento binario directamente en memoria (`io.BytesIO`) y transmitiéndolo mediante un `Response` con MIME `application/pdf` y cabecera `Content-Disposition: attachment`.
* **Propuesta Técnica de Grado:** Incorporar un código QR dinámico en la esquina inferior del PDF que contenga una firma criptográfica HMAC-SHA256 del certificado y un enlace de validación pública (`https://chambeapp.com/certificados/verify?token=...`), permitiendo a entidades bancarias verificar la autenticidad del documento sin necesidad de credenciales internas.

---

## 5. Estado Final en Base de Datos y Verificación de Consistencia

La consulta directa en PostgreSQL (`chambeapp_db_dev`) certifica la perfecta integridad de las cuentas:

### Tabla `wallets`
| Wallet ID | User ID | Rol | Saldo Disponible (COP) | Saldo Bloqueado (COP) | Balance Total |
|:---:|:---:|:---:|:---:|:---:|:---:|
| `1` | `3` | `merchant` | `$0` | `$0` | `$0` |
| **`3`** | **`2`** | `solicitante` | **`$250.000`** | **`$0`** | **`$250.000`** |
| **`2`** | **`1`** | `pds` | **`$120.000`** | **`$80.000`** | **`$200.000`** |

### Tabla `transactions`
| Tx ID | Wallet ID | Tipo | Monto (COP) | Descripción | Referencia / Pasarela |
|:---:|:---:|:---:|:---:|:---|:---|
| `4` | `3` (Solicitante) | `deposito` | `+$250.000` | Depósito vía nequi | Nequi Simulado |
| `5` | `2` (PDS) | `deposito` | `+$200.000` | Depósito vía nequi | Nequi Simulado |
| `6` | `2` (PDS) | `retiro` | `-$80.000` | Retiro a Bancolombia Ahorros 123-456789-00 | Solicitud ACH en retención |

### Tabla `coins`
| Coin ID | User ID | Rol | Cantidad | Tipo | Vence En | Estado |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `1` | `2` | `solicitante` | **165** | `comprada` | *Indefinido* | Activa (150 base + 15 bono bienvenida) |
| `2` | `1` | `pds` | **50** | `promocional` | *30 días* | Activa (Gamificación / Bonificación inicial) |

* **Video de Auditoría:** `video/11-billetera-recargas-monedas.webm` (3.7 MB)
