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
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y logs

async function run() {
  console.log('== Iniciando Flujo 08: Derivación y Cierre Ágil de Marañas (Rebusques) ==');
  const apiRequests = [];

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
    viewport: { width: 1366, height: 900 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1366, height: 900 },
    },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  page.on('response', async response => {
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

  let maranaId = null;

  try {
    // =========================================================================
    // TRAMO 1: SOLICITANTE — DERIVACIÓN DE MARAÑA DESDE ADENDA
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Solicitante Accede a Chamba #1 y Visualiza Adenda de Otro Perfil
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Navegando a /solicitante/chambas/1...');
    await page.goto(`${BASE_URL}/solicitante/chambas/1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-detalle', { timeout: 12000 });
    await page.waitForTimeout(2000);

    // Scroll hacia la sección de adendas
    const btnLanzarMarana = page.locator('.ch-detalle__adenda-marana').first();
    await btnLanzarMarana.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-solicitante-chamba-adenda-marana.png') });

    // -------------------------------------------------------------------------
    // Paso 2: Apertura y Diligenciamiento de Modal MaranaCrearModal
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Abriendo modal "Lanzar maraña"...');
    await btnLanzarMarana.click();
    await page.waitForSelector('.ch-mar-form__adenda', { timeout: 8000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 2] Diligenciando campos de la maraña...');
    const inputTitulo = page.locator('input[placeholder*="Ej. Cambio de tubería"]');
    await inputTitulo.fill('Reconexión eléctrica de calentador');

    // Seleccionar categoría electricidad si no está activa
    const btnCatElec = page.locator('button.ch-mar-form__cat:has-text("electricidad")').first();
    if (await btnCatElec.isVisible()) {
      await btnCatElec.click();
    }

    const inputDesc = page.locator('.modal textarea, textarea').first();
    await inputDesc.fill('Se requiere electricista calificado para reconectar circuito de calentador y verificar conexiones tras reparación de plomería.');

    // Seleccionar franja Mañana
    const btnFranja = page.locator('button.ch-mar-form__franja:has-text("Mañana")').first();
    if (await btnFranja.isVisible()) {
      await btnFranja.click();
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-modal-lanzar-marana.png') });

    // -------------------------------------------------------------------------
    // Paso 3: Publicación de Maraña y Auditoría en /solicitante/maranas
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Clic en "Publicar maraña"...');
    const btnPublicar = page.locator('button:has-text("Publicar maraña")').first();
    await btnPublicar.click();
    await page.waitForTimeout(2500);

    console.log('[Paso 3] Navegando a /solicitante/maranas...');
    await page.goto(`${BASE_URL}/solicitante/maranas`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mar-card, .ch-mar-list', { timeout: 12000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-solicitante-marana-publicada-lista.png') });

    // Obtener ID de la maraña creada
    const maranasSolRes = await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const r = await fetch('/api/v1/maranas/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await r.json();
    });
    if (Array.isArray(maranasSolRes) && maranasSolRes.length > 0) {
      maranaId = maranasSolRes[0].id;
    } else if (maranasSolRes?.items?.length > 0) {
      maranaId = maranasSolRes.items[0].id;
    } else {
      maranaId = 1;
    }
    console.log(`[Paso 3] Maraña creada con ID: ${maranaId}`);

    // Cierre de sesión Solicitante
    console.log('[Logout] Cerrando sesión del Solicitante...');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: PDS — EXPLORACIÓN Y POSTULACIÓN EN FEED BARRIAL
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 4: PDS Explora Feed de Marañas Disponibles en /pds/maranas
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 4] Navegando al feed de marañas (/pds/maranas)...');
    await page.goto(`${BASE_URL}/pds/maranas`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mar-feed-item, .ch-mar-list', { timeout: 12000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-pds-feed-maranas-disponibles.png') });

    // -------------------------------------------------------------------------
    // Paso 5: PDS Abre Modal y Envía Postulación Rápida
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Clic en botón "Postular"...');
    const btnPostular = page.locator('button:has-text("Postular")').first();
    await btnPostular.click();
    await page.waitForSelector('#mar-post-monto', { timeout: 8000 });
    await page.waitForTimeout(1000);

    const inputMontoPost = page.locator('#mar-post-monto');
    await inputMontoPost.fill('35000');

    const inputMsgPost = page.locator('.modal textarea, textarea').first();
    await inputMsgPost.fill('Cuento con herramientas de diagnóstico y disponibilidad inmediata para la reconexión.');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pds-modal-postulacion-marana.png') });

    console.log('[Paso 5] Enviando postulación...');
    const btnEnviarPost = page.locator('button:has-text("Enviar postulación")').first();
    await btnEnviarPost.click();
    await page.waitForTimeout(2500);

    // Cierre de sesión PDS
    console.log('[Logout] Cerrando sesión del PDS...');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 3: SOLICITANTE — REVISIÓN, NEGOCIACIÓN Y ASIGNACIÓN DIRECTA
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 6: Solicitante Abre Expediente de Maraña y Visualiza Postulación
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log(`[Paso 6] Accediendo a /solicitante/maranas/${maranaId}...`);
    await page.goto(`${BASE_URL}/solicitante/maranas/${maranaId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mar-detalle', { timeout: 12000 });
    await page.waitForTimeout(2000);

    const seccionOfertas = page.locator('.ch-mar-oferta').first();
    await seccionOfertas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-solicitante-marana-ofertas-recibidas.png') });

    // -------------------------------------------------------------------------
    // Paso 7: Solicitante Acepta Postulación y Asigna la Maraña
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Clic en "Aceptar y asignar"...');
    const btnAceptar = page.locator('button:has-text("Aceptar y asignar")').first();
    await btnAceptar.click();
    await page.waitForTimeout(2500);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-marana-asignada-expediente.png') });

    // Cierre de sesión Solicitante
    console.log('[Logout] Cerrando sesión del Solicitante...');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 4: PDS — EJECUCIÓN, ENTREGA Y CHECK-IN DE COBRO
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 8: PDS Entrega la Labor y Marca "Completar trabajo"
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log(`[Paso 8] Navegando a /pds/maranas/${maranaId}...`);
    await page.goto(`${BASE_URL}/pds/maranas/${maranaId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mar-detalle', { timeout: 12000 });
    await page.waitForTimeout(2000);

    console.log('[Paso 8] Clic en "Completar trabajo"...');
    const btnCompletar = page.locator('button:has-text("Completar trabajo")').first();
    await btnCompletar.click();
    await page.waitForTimeout(2500);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-marana-completar-trabajo.png') });

    // -------------------------------------------------------------------------
    // Paso 9: PDS Confirma Recepción de Pago Directo ($35.000 COP)
    // -------------------------------------------------------------------------
    console.log('[Paso 9] PDS confirmando recepción de pago directo...');
    const btnPagoPds = page.locator('button:has-text("Confirmar pago directo")').first();
    if (await btnPagoPds.isVisible()) {
      await btnPagoPds.click();
      await page.waitForSelector('button:has-text("Confirmar pago")', { timeout: 8000 });
      await page.waitForTimeout(800);
      const btnModalPago = page.locator('.modal-footer button:has-text("Confirmar pago"), button:has-text("Confirmar pago")').last();
      await btnModalPago.click();
      await page.waitForTimeout(2000);
    }

    // Cierre de sesión PDS
    console.log('[Logout] Cerrando sesión del PDS...');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 5: SOLICITANTE — CIERRE BILATERAL Y AUDITORÍA
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 9 (Cont.): Solicitante Confirma Entrega de Pago Directo
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log(`[Paso 9] Solicitante accede a /solicitante/maranas/${maranaId}...`);
    await page.goto(`${BASE_URL}/solicitante/maranas/${maranaId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mar-pago', { timeout: 12000 });
    await page.waitForTimeout(1500);

    const btnPagoSol = page.locator('button:has-text("Confirmar pago directo")').first();
    if (await btnPagoSol.isVisible()) {
      await btnPagoSol.click();
      await page.waitForSelector('button:has-text("Confirmar pago")', { timeout: 8000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-marana-checkin-pago-directo.png') });
      const btnModalPago = page.locator('.modal-footer button:has-text("Confirmar pago"), button:has-text("Confirmar pago")').last();
      await btnModalPago.click();
      await page.waitForTimeout(2500);
    }

    // -------------------------------------------------------------------------
    // Paso 10: Expediente Final en Estado "Pagado" e Historial Consolidado
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Recargando expediente final de la maraña...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mar-detalle', { timeout: 12000 });
    await page.waitForTimeout(2000);

    // Scroll hacia el historial completo
    const seccionHistorial = page.locator('.ch-mar-detalle__historial').first();
    await seccionHistorial.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-marana-cerrada-pagada.png') });

    console.log('== Flujo 08 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 08:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Consolidar video en 08-derivacion-cierre-maranas.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '08-derivacion-cierre-maranas.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '08-derivacion-cierre-maranas.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/08-derivacion-cierre-maranas.webm');
    }

    console.log(`Total peticiones API interceptadas: ${apiRequests.length}`);
  }
}

run();
