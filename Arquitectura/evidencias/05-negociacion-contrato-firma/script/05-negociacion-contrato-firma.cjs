const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de prueba (users.md)
const SOL_USER = 'solicitante@chambeapp.com';
const PDS_USER = 'pds@chambeapp.com';
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y consola

async function run() {
  console.log('== Iniciando Flujo 05: Negociación Bilateral de Ofertas y Firma Digital de Contrato ==');

  // Asegurar directorios
  [CAPTURAS_DIR, VIDEO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-gl=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1366, height: 768 },
    },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  // Monitoreo de peticiones HTTP clave
  const apiRequests = [];
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/v1/')) {
      const entry = {
        method: response.request().method(),
        endpoint: url.replace(/^http:\/\/[^/]+/, ''),
        status: response.status(),
      };
      apiRequests.push(entry);
      if (entry.status >= 400) {
        console.warn(`[WARN HTTP ${entry.status}] ${entry.method} ${entry.endpoint}`);
      }
    }
  });

  try {
    // =========================================================================
    // TRAMO 1: CLIENTE SOLICITANTE — REVISIÓN DE OFERTAS Y FIRMA DIGITAL
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Autenticación como Solicitante
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-solicitante-login.png') });

    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // -------------------------------------------------------------------------
    // Paso 2: Navegación al Hub de Solicitudes (/solicitante/solicitudes)
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Navegando a la lista de solicitudes del cliente...');
    await page.goto(`${BASE_URL}/solicitante/solicitudes`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-solicitudes.png') });

    // -------------------------------------------------------------------------
    // Paso 3: Apertura de Solicitud #8 y Visualización de Ofertas Recibidas
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Abriendo detalle de Solicitud #8 y revisando ofertas...');
    await page.goto(`${BASE_URL}/solicitante/solicitudes/8`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-manage, .ch-sol-offers', { timeout: 12000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-solicitante-ofertas-recibidas.png') });

    // -------------------------------------------------------------------------
    // Paso 4: Clic en "Aceptar" oferta y Navegación al Contrato en Pantalla Completa
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Aceptando oferta de PDS para formalizar contrato...');
    const acceptOfferBtn = page.locator('.ch-sol-offers button:has-text("Aceptar")').first();
    await acceptOfferBtn.waitFor({ state: 'visible', timeout: 8000 });
    await acceptOfferBtn.click();

    // Esperar navegación a /contrato/firmar
    await page.waitForURL('**/contrato/firmar**', { timeout: 10000 });
    await page.waitForSelector('.ch-contrato-doc', { timeout: 10000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-contrato-solicitante-vista.png') });

    // -------------------------------------------------------------------------
    // Paso 5: Diligenciamiento de Datos del Solicitante y Trazado de Firma Digital
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Trazando firma digital manuscrita del Solicitante...');
    const firmaBlock = page.locator('.ch-contrato-firma').first();
    await firmaBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Diligenciar Nombre y Documento de identidad
    const nombreInput = firmaBlock.locator('input').nth(0);
    const docInput = firmaBlock.locator('input').nth(1);

    await nombreInput.fill('Solicitante ChambeApp');
    await docInput.fill('1098765432');

    // Trazar trazo en canvas de firma
    const canvas = firmaBlock.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 5000 });
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 30, box.y + 45);
      await page.mouse.down();
      await page.mouse.move(box.x + 75, box.y + 70, { steps: 5 });
      await page.mouse.move(box.x + 120, box.y + 35, { steps: 5 });
      await page.mouse.move(box.x + 180, box.y + 65, { steps: 5 });
      await page.mouse.move(box.x + 230, box.y + 40, { steps: 5 });
      await page.mouse.up();
    }
    await page.waitForTimeout(800);

    // Confirmar firma en el bloque
    const firmarBtn = firmaBlock.locator('button:has-text("Firmar")');
    await firmarBtn.click();
    await page.waitForTimeout(800);

    // Capturar vista del contrato firmado por el solicitante
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-contrato-solicitante-firmado.png') });

    // -------------------------------------------------------------------------
    // Paso 6: Confirmación de "Firmar y aceptar oferta" (Creación del Contrato)
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Confirmando "Firmar y aceptar oferta"...');
    const acceptContratoBtn = page.locator('.ch-firma__bar button:has-text("Firmar y aceptar oferta")');
    await acceptContratoBtn.click();

    // Esperar retorno a la solicitud con toast de éxito
    await page.waitForURL('**/solicitante/solicitudes/8**', { timeout: 12000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-solicitante-oferta-aceptada.png') });

    // -------------------------------------------------------------------------
    // Cierre de sesión del Solicitante
    // -------------------------------------------------------------------------
    console.log('[Logout] Cerrando sesión del Solicitante...');
    await page.goto(`${BASE_URL}/solicitante/perfil`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const logoutBtn = page.locator('button:has-text("Cerrar sesión")');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    } else {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto(`${BASE_URL}/login`);
    }
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: PROVEEDOR PDS — CONTRAFIRMA DIGITAL Y PERFECCIONAMIENTO
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 7: Autenticación como PDS (Trabajador)
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-pds-login.png') });

    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // -------------------------------------------------------------------------
    // Paso 8: Navegación a Chambas y Localización de Contrato "Por firmar"
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Navegando a /pds/chambas y abriendo hub de chambas...');
    await page.goto(`${BASE_URL}/pds/chambas`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-pds-buscar, .mapboxgl-canvas', { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Clic en FAB "Mis chambas" para abrir la lista
    const fabChambas = page.locator('.ch-pds-buscar__fab');
    if (await fabChambas.isVisible()) {
      await fabChambas.click();
      await page.waitForTimeout(1500);
    }

    await page.waitForSelector('.ch-chamba-list', { timeout: 10000 });
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-contrato-pendiente.png') });

    // -------------------------------------------------------------------------
    // Paso 9: Apertura y Contrafirma Digital del PDS (/contrato/firmar)
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Abriendo formalización de contrato como PDS...');
    const firmarContratoBtn = page.locator('button:has-text("Firmar contrato")').first();
    await firmarContratoBtn.waitFor({ state: 'visible', timeout: 8000 });
    await firmarContratoBtn.click();

    await page.waitForURL('**/contrato/firmar**', { timeout: 10000 });
    await page.waitForSelector('.ch-contrato-doc', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Diligenciar bloque de firma del Prestador
    const pdsFirmaBlock = page.locator('.ch-contrato-firma').first();
    await pdsFirmaBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const pdsNombreInput = pdsFirmaBlock.locator('input').nth(0);
    const pdsDocInput = pdsFirmaBlock.locator('input').nth(1);

    await pdsNombreInput.fill('Carlos Pérez (PDS)');
    await pdsDocInput.fill('1020304050');

    // Trazar firma en canvas
    const pdsCanvas = pdsFirmaBlock.locator('canvas');
    await pdsCanvas.waitFor({ state: 'visible', timeout: 5000 });
    const pdsBox = await pdsCanvas.boundingBox();
    if (pdsBox) {
      await page.mouse.move(pdsBox.x + 35, pdsBox.y + 40);
      await page.mouse.down();
      await page.mouse.move(pdsBox.x + 85, pdsBox.y + 65, { steps: 5 });
      await page.mouse.move(pdsBox.x + 140, pdsBox.y + 30, { steps: 5 });
      await page.mouse.move(pdsBox.x + 200, pdsBox.y + 70, { steps: 5 });
      await page.mouse.up();
    }
    await page.waitForTimeout(800);

    // Confirmar firma individual
    const pdsFirmarBtn = pdsFirmaBlock.locator('button:has-text("Firmar")');
    await pdsFirmarBtn.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-contrato-pds-firmado.png') });

    // -------------------------------------------------------------------------
    // Paso 10: Perfeccionamiento del Contrato ("Firmar y aceptar contrato")
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Aceptando y activando contrato legal en backend...');
    const acceptFinalBtn = page.locator('.ch-firma__bar button:has-text("Firmar y aceptar contrato")');
    await acceptFinalBtn.click();

    // Esperar retorno a /pds/chambas
    await page.waitForURL('**/pds/chambas**', { timeout: 12000 });
    await page.waitForTimeout(2000);

    // Asegurar que estamos en el tab de chambas para ver la chamba "En curso"
    const fabCheck = page.locator('.ch-pds-buscar__fab');
    if (await fabCheck.isVisible()) {
      await fabCheck.click();
      await page.waitForTimeout(1500);
    }

    await page.waitForSelector('.ch-chamba-list', { timeout: 10000 });
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-pds-chamba-en-curso.png') });

    console.log('== Flujo 05 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 05:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Consolidar y renombrar archivo de video
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '05-negociacion-contrato-firma.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '05-negociacion-contrato-firma.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/05-negociacion-contrato-firma.webm');
    }

    console.log(`Total peticiones API interceptadas: ${apiRequests.length}`);
  }
}

run();
