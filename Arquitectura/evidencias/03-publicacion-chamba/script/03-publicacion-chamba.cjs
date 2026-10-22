/**
 * Script de Automatización — Flujo 03: Publicación de Solicitudes de Chamba (Geocerca y Panorámicas 360°)
 * ChambeApp Architecture Testing Suite (Fase 4)
 *
 * Herramienta: Playwright con Chromium + SwiftShader (aceleración por software)
 * Origen: http://localhost:5173
 * Rol evaluado: Solicitante (Empleador) — solicitante@chambeapp.com
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de frontend/doc/users.md (enmascaradas)
const SOL_EMAIL = 'solicitante@chambeapp.com';
const USER_PASS = 'ChambeApp123!';

async function run() {
  console.log('== Iniciando Flujo 03: Publicación de Solicitudes de Chamba (Geocerca y 360°) ==');

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
    permissions: ['geolocation'],
    geolocation: { latitude: 6.2088, longitude: -75.5678 }, // Medellín (El Poblado)
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1366, height: 768 },
    },
  });

  const page = await context.newPage();
  const apiRequests = [];

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
    // -------------------------------------------------------------------------
    // 1. Login con rol Solicitante
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', SOL_EMAIL);
    await page.fill('input[type="password"]', USER_PASS);
    await page.click('button[type="submit"]:has-text("Entrar")');

    await page.waitForURL('**/solicitante**', { timeout: 12000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-solicitante-login.png') });

    // -------------------------------------------------------------------------
    // 2. Navegación al Hub de Solicitudes
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Navegando a /solicitante/solicitudes...');
    await page.goto(`${BASE_URL}/solicitante/solicitudes`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-hub.png') });

    // -------------------------------------------------------------------------
    // 3. Inicio de publicación de solicitud: /solicitante/solicitudes/new
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Abriendo wizard de creación (/solicitante/solicitudes/new)...');
    await page.goto(`${BASE_URL}/solicitante/solicitudes/new`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ch-sol-wizard-form, input[placeholder*="Reparar"]', { timeout: 10000 });

    // Paso 0: Necesidad (Título)
    console.log('-> Completando Paso 0: Necesidad...');
    const tituloInput = page.locator('input[placeholder*="Reparar"]').first();
    await tituloInput.fill('Reparación urgente de fuga de agua en tubería de cocina');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-publicar-paso0-necesidad.png') });
    await page.click('.ch-sol-wizard-nav button:has-text("Continuar")');

    // Paso 1: Categoría
    console.log('-> Completando Paso 1: Categoría...');
    await page.waitForSelector('.chip, button:has-text("Plomería")', { timeout: 5000 });
    await page.click('.chip:has-text("Plomería"), button:has-text("Plomería")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-publicar-paso1-categoria.png') });
    await page.click('.ch-sol-wizard-nav button:has-text("Continuar")');

    // Paso 2: Detalles (Descripción)
    console.log('-> Completando Paso 2: Detalles...');
    await page.waitForSelector('textarea', { timeout: 5000 });
    await page.locator('textarea').first().fill(
      'Goteo constante en la unión de la tubería principal bajo el lavaplatos. Se requiere revisión, cambio de codo PVC y sellante termo-fusión.'
    );
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-publicar-paso2-detalles.png') });
    await page.click('.ch-sol-wizard-nav button:has-text("Continuar")');

    // Paso 3: Ubicación con Mapa Mapbox y Geocerca
    console.log('-> Completando Paso 3: Ubicación y Geocerca (esperando Mapbox WebGL)...');
    await page.waitForSelector('.ch-loc', { timeout: 8000 });
    await page.fill('#sol-ubicacion', 'Carrera 43A # 1-50, El Poblado, Medellín');
    
    // Clic en Usar mi ubicación actual
    const geoBtn = page.locator('.ch-loc__geo');
    if (await geoBtn.isVisible()) {
      await geoBtn.click();
      await page.waitForTimeout(1000);
    }

    // Esperar a que el canvas de Mapbox se renderice y se estabilice
    await page.waitForSelector('.mapboxgl-canvas, .ch-mapbox', { timeout: 12000 });
    await page.waitForTimeout(2000); // Dar margen a los tiles vectoriales

    // Ajustar slider de radio a 15 km
    const radioRange = page.locator('#sol-radio');
    if (await radioRange.isVisible()) {
      await radioRange.fill('15');
      await page.waitForTimeout(400);
    }

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-publicar-paso3-ubicacion-mapa.png') });
    await page.click('.ch-sol-wizard-nav button:has-text("Continuar")');

    // Paso 4: ¿Cuándo? (Urgencia)
    console.log('-> Completando Paso 4: Cuándo / Urgencia...');
    await page.waitForSelector('.ch-sol-urgency', { timeout: 5000 });
    await page.click('.ch-sol-urgency__opt:has-text("Hoy")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-publicar-paso4-cuando.png') });
    await page.click('.ch-sol-wizard-nav button:has-text("Continuar")');

    // Paso 5: Presupuesto
    console.log('-> Completando Paso 5: Presupuesto...');
    await page.waitForSelector('input[type="number"]', { timeout: 5000 });
    await page.fill('input[type="number"]', '130000');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-publicar-paso5-presupuesto.png') });
    await page.click('.ch-sol-wizard-nav button:has-text("Continuar")');

    // Paso 6: Fotos / Soporte 360
    console.log('-> Completando Paso 6: Fotos y soporte 360...');
    await page.waitForSelector('.ch-photo', { timeout: 5000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-publicar-paso6-fotos.png') });
    // Avanzar a Paso 7 usando evaluate para evitar race condition de coordenadas con el botón submit
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.ch-sol-wizard-nav button'))
        .find(b => b.textContent && b.textContent.includes('Continuar'));
      if (btn) btn.click();
    });

    // Paso 7: Revisar Resumen y Publicar
    console.log('-> Completando Paso 7: Revisar y Publicar...');
    await page.waitForSelector('.ch-sol-review', { timeout: 8000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-publicar-paso7-revisar.png') });

    // Clic en Publicar chamba con transición limpia hacia /solicitante/solicitudes
    console.log('[Paso 4] Enviando solicitud (POST /api/v1/solicitudes/)...');
    const submitBtn = page.locator('.ch-sol-wizard-nav button[type="submit"]');
    await submitBtn.scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL('**/solicitante/solicitudes**', { timeout: 15000 }),
      submitBtn.click(),
    ]);

    // Esperar a que el feed de solicitudes cargue con la nueva solicitud activa
    await page.waitForSelector('.ch-sol-page, .ch-app-shell', { timeout: 10000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '11-solicitud-creada-feed.png') });

    // -------------------------------------------------------------------------
    // 5. Cierre de sesión final
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Navegando a perfil de solicitante y cerrando sesión...');
    await page.goto(`${BASE_URL}/solicitante/perfil`, { waitUntil: 'networkidle' });
    await page.waitForSelector('button:has-text("Cerrar sesión")', { timeout: 8000 });
    const logoutBtn = page.locator('button:has-text("Cerrar sesión")');
    await logoutBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await logoutBtn.click();
    await page.waitForURL('**/login', { timeout: 8000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '12-solicitante-logout.png') });

    console.log('== Flujo 03 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 03:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado a 03-publicacion-chamba.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '03-publicacion-chamba.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '03-publicacion-chamba.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/03-publicacion-chamba.webm');
    }

    fs.writeFileSync(
      path.join(EVIDENCIAS_DIR, 'requests.json'),
      JSON.stringify(apiRequests, null, 2),
      'utf8'
    );
  }
}

run();
