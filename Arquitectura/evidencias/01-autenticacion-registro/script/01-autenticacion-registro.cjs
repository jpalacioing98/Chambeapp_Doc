/**
 * Script de Automatización — Flujo 01: Autenticación, Registro y Recuperación de Credenciales
 * ChambeApp Architecture Testing Suite (Fase 4)
 *
 * Herramienta: Playwright con Chromium + SwiftShader (aceleración por software)
 * Origen: http://localhost:5173
 * Rol evaluado: PDS (Trabajador) — pds@chambeapp.com
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de frontend/doc/users.md (no se imprimen en logs)
const USER_EMAIL = 'pds@chambeapp.com';
const USER_PASS = 'ChambeApp123!';

async function run() {
  console.log('== Iniciando Flujo 01: Autenticación, Registro y Recuperación ==');

  // Asegurar directorios
  fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-gl=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1366, height: 768 },
    },
  });

  const page = await context.newPage();
  const apiRequests = [];

  // Registrar llamadas de red relevantes (sin registrar tokens ni passwords)
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/api/v1/')) {
      apiRequests.push({
        method: response.request().method(),
        endpoint: url.replace('http://localhost:5000/api/v1', '/api/v1'),
        status: response.status(),
      });
    }
  });

  try {
    // -------------------------------------------------------------
    // Paso 1: Visita a /login en estado limpio (sin sesión)
    // -------------------------------------------------------------
    console.log('[Paso 1] Navegando a /login en estado limpio...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-login-vacio.png') });

    // -------------------------------------------------------------
    // Paso 2: Caso alterno / de error — Contraseña errónea
    // -------------------------------------------------------------
    console.log('[Paso 2] Probando caso alterno de error (credenciales inválidas)...');
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', 'WrongPassword999*');
    await page.click('button[type="submit"]:has-text("Entrar")');
    await page.waitForSelector('.auth__alert.show, [role="alert"]', { timeout: 8000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-login-error-credenciales.png') });

    // -------------------------------------------------------------
    // Paso 3: Subflujo de Recuperación de contraseña
    // -------------------------------------------------------------
    console.log('[Paso 3] Probando subflujo de recuperación de contraseña...');
    await page.click('a[href="#recuperar"]');
    await page.waitForSelector('#view-recover.active', { timeout: 5000 });
    await page.fill('#view-recover input[type="email"]', USER_EMAIL);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-recuperar-contrasena.png') });

    // -------------------------------------------------------------
    // Paso 4: Subflujo de Registro (/register)
    // -------------------------------------------------------------
    console.log('[Paso 4] Navegando a /register y probando formulario de registro...');
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    // Selección de rol Trabajador (pds)
    await page.click('.kyc__role-card:has-text("Trabajador")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-registro-paso0-rol.png') });

    // Avanzar a paso 1 (Identidad)
    await page.click('button:has-text("Continuar")');
    await page.waitForSelector('#fullname', { timeout: 5000 });
    await page.fill('#fullname', 'Carlos Andrés Mendoza');
    await page.fill('#docnum', '1098765432');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-registro-paso1-identidad.png') });

    // Avanzar a paso 2 (Cuenta)
    await page.click('button:has-text("Continuar")');
    await page.waitForSelector('#phone', { timeout: 5000 });
    await page.fill('input[type="email"]', 'carlos.mendoza.demo@chambeapp.com');
    await page.fill('#username', 'carlos.mendoza');
    await page.fill('#phone', '3001234567');
    await page.fill('#password', 'ChambeApp123!');
    await page.fill('#confirm', 'ChambeApp123!');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-registro-paso2-cuenta.png') });

    // Avanzar a paso 3 (Aceptación de Términos)
    await page.click('button:has-text("Continuar")');
    await page.waitForSelector('.kyc__consent', { timeout: 5000 });
    const checkboxes = await page.$$('.kyc__consent input[type="checkbox"]');
    for (const cb of checkboxes) {
      await cb.check();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-registro-paso3-terminos.png') });

    // -------------------------------------------------------------
    // Paso 5: Inicio de Sesión Exitoso con Rol Oficial (PDS)
    // -------------------------------------------------------------
    console.log('[Paso 5] Iniciando sesión con rol PDS oficial (pds@chambeapp.com)...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASS);
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Esperar navegación al dashboard /pds
    await page.waitForURL('**/pds**', { timeout: 12000 });
    await page.waitForSelector('.ch-app-shell', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // Validar token en localStorage
    const hasToken = await page.evaluate(() => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      return !!token && !!user;
    });
    console.log(`[Validación de Sesión] Tokens en localStorage presentes: ${hasToken}`);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-dashboard-exito.png') });

    // -------------------------------------------------------------
    // Paso 6: Perfil y Cierre de Sesión (Logout)
    // -------------------------------------------------------------
    console.log('[Paso 6] Navegando a perfil de PDS y ejecutando logout...');
    await page.goto(`${BASE_URL}/pds/perfil`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ch-perfil, button:has-text("Cerrar sesión")', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-pds-perfil-logout.png') });

    // Clic en Cerrar sesión
    await page.click('button:has-text("Cerrar sesión")');
    await page.waitForURL('**/login', { timeout: 8000 });
    await page.waitForTimeout(1000);

    const isLoggedOut = await page.evaluate(() => {
      return !localStorage.getItem('access_token');
    });
    console.log(`[Validación de Sesión] Sesión cerrada y token destruido: ${isLoggedOut}`);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-logout-redireccion.png') });

    console.log('== Flujo 01 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 01:', err);
    throw err;
  } finally {
    // Cerrar página y contexto para fijar el video
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado a 01-autenticacion-registro.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '01-autenticacion-registro.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '01-autenticacion-registro.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/01-autenticacion-registro.webm');
    }

    // Exportar bitácora de requests
    fs.writeFileSync(
      path.join(EVIDENCIAS_DIR, 'requests.json'),
      JSON.stringify(apiRequests, null, 2),
      'utf8'
    );
  }
}

run();
