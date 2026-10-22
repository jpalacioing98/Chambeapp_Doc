# Guía de Re-ejecución Autónoma de Pruebas E2E (Playwright)

> **Destinatarios:** Jurados Calificadores, Evaluadores Técnicos y Desarrolladores  
> **Propósito:** Procedimiento reproducible y determinista para ejecutar los 14 flujos de prueba automatizada de ChambeApp en un entorno local o de integración continua (CI/CD).  
> **Garantía:** Los scripts fueron validados con el código fuente activo sin requerir parches en `backend/` ni `frontend/`.

---

## 1. Requisitos Previos del Sistema

Asegúrese de contar con las siguientes herramientas instaladas en la máquina evaluadora:
* **Sistema Operativo:** Windows 10/11, Ubuntu 22.04+ o macOS Sonoma.
* **Docker y Docker Compose:** Docker Engine v24.0+ y Docker Compose v2.20+.
* **Node.js:** Versión 18.x, 20.x o 22.x LTS.
* **Memoria RAM:** Mínimo 8 GB (16 GB recomendado para renderizado WebGL SwiftShader y contenedores).

---

## 2. Paso a Paso para el Levantamiento del Entorno

### Paso 1: Inicialización de la Infraestructura en Contenedores (Docker)
En la terminal raíz del proyecto o en la carpeta `backend/`, levante los 5 servicios base:

```bash
# Desde la carpeta backend (o raíz del proyecto)
docker compose up -d db redis minio backend celery
```

Verifique que los servicios estén activos y respondiendo correctamente:
* **PostgreSQL 16 + PostGIS:** Puerto `5433` (mapeado al `5432` interno).
* **Redis 7:** Puerto `6379`.
* **MinIO Object Storage:** Puerto `9000` (API S3) y `9001` (Consola Web).
* **Flask API Backend:** Puerto `5000`.
* **Celery Worker:** Procesamiento en segundo plano de tareas asíncronas.

Verifique la salud de la API REST mediante una petición HTTP:
```bash
curl http://localhost:5000/api/v1/auth/health
# Debe responder: {"status": "healthy"} con código HTTP 200 OK
```

### Paso 2: Inicialización del Servidor Frontend (React + Vite)
Abra una segunda terminal e inicie el servidor de desarrollo del cliente:

```bash
cd frontend
npm install
npm run dev
```

El servidor Vite quedará disponible en:
👉 `http://localhost:5173/`

### Paso 3: Instalación de Dependencias de Automatización (Playwright)
Abra una tercera terminal en la carpeta `documentation/` para preparar el motor de pruebas:

```bash
cd documentation
npm install
# Instalar los binarios de Chromium si no están presentes:
npx playwright install chromium
```

---

## 3. Ejecución de los Flujos de Prueba

Cada uno de los 14 flujos cuenta con un script independiente y autosuficiente en formato CommonJS (`.cjs`) ubicado en su respectiva subcarpeta `script/`.

### Ejecución de un Flujo Individual
Para ejecutar cualquier flujo en particular (por ejemplo, el Flujo 06 de Ciclo Operativo de 6 Hitos):

```bash
cd documentation
node Arquitectura/evidencias/06-ejecucion-ciclo-operativo/script/06-ejecucion-ciclo-operativo.cjs
```

Durante la ejecución, el script:
1. Lanza una instancia headless de Chromium con banderas de aceleración por software WebGL (`--enable-webgl`, `--use-gl=angle`, `--use-angle=swiftshader`) para renderizar el mapa Mapbox GL 3D sin GPU física.
2. Emula las credenciales oficiales de `users.md` (con enmascaramiento estricto `********` en los registros de auditoría).
3. Captura secuencialmente de 10 a 12 pantallas en `capturas/`.
4. Graba un video continuo en alta definición en formato `.webm` en la carpeta `video/`.
5. Emite por consola el balance de peticiones HTTP, tiempos de respuesta y transacciones en PostgreSQL.

---

## 4. Directorio y Tabla de Comandos de los 14 Flujos

A continuación se detalla el comando exacto para re-ejecutar cada uno de los 14 flujos desde la carpeta `documentation/`:

| Flujo | Denominación del Flujo | Comando de Re-ejecución Directa |
|:---:|---|---|
| **01** | Autenticación y Registro | `node Arquitectura/evidencias/01-autenticacion-registro/script/01-autenticacion-registro.cjs` |
| **02** | Perfil de Usuario y KYC | `node Arquitectura/evidencias/02-perfil-kyc/script/02-perfil-kyc.cjs` |
| **03** | Publicación de Solicitudes (360°) | `node Arquitectura/evidencias/03-publicacion-chamba/script/03-publicacion-chamba.cjs` |
| **04** | Exploración Geoespacial PDS | `node Arquitectura/evidencias/04-exploracion-postulacion-pds/script/04-exploracion-postulacion-pds.cjs` |
| **05** | Negociación y Firma Digital | `node Arquitectura/evidencias/05-negociacion-contrato-firma/script/05-negociacion-contrato-firma.cjs` |
| **06** | Ciclo Operativo (6 Hitos) | `node Arquitectura/evidencias/06-ejecucion-ciclo-operativo/script/06-ejecucion-ciclo-operativo.cjs` |
| **07** | Pago Dual y Calificación | `node Arquitectura/evidencias/07-pago-dual-calificacion/script/07-pago-dual-calificacion.cjs` |
| **08** | Derivación y Cierre de Marañas | `node Arquitectura/evidencias/08-derivacion-cierre-maranas/script/08-derivacion-cierre-maranas.cjs` |
| **09** | Directorio de Negocios Locales | `node Arquitectura/evidencias/09-directorio-negocios-locales/script/09-directorio-negocios-locales.cjs` |
| **10** | Anuncios Laborales de Negocios | `node Arquitectura/evidencias/10-anuncios-laborales-negocios/script/10-anuncios-laborales-negocios.cjs` |
| **11** | Billetera Digital y Coins | `node Arquitectura/evidencias/11-billetera-recargas-monedas/script/11-billetera-recargas-monedas.cjs` |
| **12** | Mensajería y Chat en Tiempo Real | `node Arquitectura/evidencias/12-mensajeria-chat-tiempo-real/script/12-mensajeria-chat-tiempo-real.cjs` |
| **13** | Notificaciones Push y Alertas | `node Arquitectura/evidencias/13-notificaciones-alertas/script/13-notificaciones-alertas.cjs` |
| **14** | Moderación, Soporte y Superadmin | `node Arquitectura/evidencias/14-moderacion-soporte-superadmin/script/14-moderacion-soporte-superadmin.cjs` |

---

## 5. Diagnóstico y Solución de Problemas Frecuentes (Troubleshooting)

### A. Fallo de Renderizado en Mapas Mapbox GL (Pantalla Negra en Headless)
* **Causa:** El entorno no dispone de aceleración por hardware GPU o los controladores gráficos están ausentes.
* **Solución:** Los scripts incluyen por defecto el emulador por software SwiftShader:
  ```javascript
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl']
  });
  ```
  No elimine estos argumentos al ejecutar en servidores Linux sin entorno de escritorio (X11/Wayland).

### B. Conflicto de Sesiones o Token Expirado en LocalStorage
* **Causa:** Ejecuciones repetidas pueden dejar tokens de sesiones previas en el navegador.
* **Solución:** Cada script Playwright inicia un `browser.newContext()` completamente aislado y ejecuta una limpieza explícita de `localStorage` y `sessionStorage` antes de cada inicio de sesión.

### C. Error de Permisos en Carga de Archivos hacia MinIO S3
* **Causa:** El bucket `chambas-media` o `kyc-documents` no ha sido inicializado en el contenedor MinIO.
* **Solución:** El backend ejecuta automáticamente la creación de buckets al levantar el contenedor en desarrollo. Si es necesario forzar la inicialización, ejecute:
  ```bash
  docker compose exec backend python -c "from app.services.s3 import init_buckets; init_buckets()"
  ```

### D. Aislamiento Regional en Administradores (Error 404 intencional)
* **Nota:** En el Flujo 14, la llamada del Administrador de Región 1 hacia una disputa de Región 2 (`GET /api/v1/admin/disputes/2`) **debe retornar 404**. Este comportamiento no es un error de la prueba sino la validación exitosa de la regla de negocio de segregación territorial (RF-76).
