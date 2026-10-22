const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de prueba (users.md)
const MERCHANT_USER = 'merchant@chambeapp.com';
const PDS_USER = 'pds@chambeapp.com';
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y logs

async function run() {
  console.log('== Iniciando Flujo 10: Anuncios Laborales de Negocios ==');
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
      } else {
        console.log(`[HTTP ${entry.status}] ${entry.method} ${entry.endpoint}`);
      }
    }
  });

  try {
    // =========================================================================
    // TRAMO 1: COMERCIANTE (MERCHANT) — PUBLICACIÓN DE OFERTA LABORAL
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Login de Comerciante y Acceso a Panel de Anuncios Laborales
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con merchant@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', MERCHANT_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/negocio**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Navegando a /negocio/anuncios...');
    await page.goto(`${BASE_URL}/negocio/anuncios`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-sol-page', { timeout: 12000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-merchant-panel-anuncios-vacio.png') });
    console.log('[Paso 1] Captura guardada: 01-merchant-panel-anuncios-vacio.png');

    // -------------------------------------------------------------------------
    // Paso 2: Apertura y Diligenciamiento de Modal "Publicar anuncio laboral"
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Abriendo modal "Publicar anuncio laboral"...');
    const btnNuevoAnuncio = page.locator('button', { hasText: /Nuevo anuncio|Crear anuncio/i }).first();
    await btnNuevoAnuncio.click();
    await page.waitForSelector('.ch-modal', { timeout: 8000 });
    await page.waitForTimeout(800);

    console.log('[Paso 2] Diligenciando campos de la oferta laboral...');
    const tituloInput = page.locator('.ch-modal input[placeholder*="Ej. Se busca"]').first();
    await tituloInput.fill('Técnico en plomería e instalaciones hidráulicas');

    const catBtn = page.locator('.ch-anc-form__cats button', { hasText: 'plomeria' }).first();
    if (await catBtn.count() > 0) {
      await catBtn.click();
    }

    const descTextarea = page.locator('.ch-modal textarea').first();
    await descTextarea.fill('Se requiere plomero certificado para mantenimiento preventivo de redes hidrosanitarias y trampas de grasa del restaurante. Jornada diurna, contratación fija con todas las prestaciones.');

    const ubiInput = page.locator('.ch-anc-form__grid2 input[placeholder*="Valledupar"]').first();
    if (await ubiInput.count() > 0) {
      await ubiInput.fill('Medellín, El Poblado');
    }

    const vacantesInput = page.locator('.ch-anc-form__grid2 input[type="number"]').first();
    if (await vacantesInput.count() > 0) {
      await vacantesInput.fill('2');
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-merchant-modal-publicar-anuncio.png') });
    console.log('[Paso 2] Captura guardada: 02-merchant-modal-publicar-anuncio.png');

    // -------------------------------------------------------------------------
    // Paso 3: Envío de Publicación y Confirmación en Feed del Negocio
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Enviando publicación de anuncio laboral...');
    const btnPublicar = page.locator('.ch-modal button', { hasText: 'Publicar anuncio' }).first();
    await btnPublicar.click();
    await page.waitForTimeout(2500);

    await page.waitForSelector('.ch-anc-card', { timeout: 10000 });
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-merchant-anuncio-publicado-lista.png') });
    console.log('[Paso 3] Captura guardada: 03-merchant-anuncio-publicado-lista.png');

    // -------------------------------------------------------------------------
    // Paso 4: Auditoría del Expediente de la Oferta Laboral (/anuncios/1)
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Accediendo al detalle del anuncio creado...');
    const adCard = page.locator('.ch-anc-card').first();
    await adCard.click();
    await page.waitForURL('**/anuncios/**', { timeout: 10000 });
    await page.waitForSelector('.ch-anc-hero', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-merchant-detalle-anuncio-sin-postulaciones.png') });
    console.log('[Paso 4] Captura guardada: 04-merchant-detalle-anuncio-sin-postulaciones.png');

    // Cerrar sesión del comerciante
    console.log('[Paso 4] Cerrando sesión del comerciante...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: PRESTADOR DE SERVICIOS (PDS) — DESCUBRIMIENTO Y POSTULACIÓN
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 5: Login de PDS y Descubrimiento de Banner Laboral en Directorio/Mapa
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 5] Navegando a /negocios para descubrir ofertas laborales en el mapa...');
    await page.goto(`${BASE_URL}/negocios`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.mapboxgl-canvas', { timeout: 15000 });
    await page.waitForSelector('.ch-anc-strip', { timeout: 10000 });
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pds-mapa-banner-anuncios-laborales.png') });
    console.log('[Paso 5] Captura guardada: 05-pds-mapa-banner-anuncios-laborales.png');

    // -------------------------------------------------------------------------
    // Paso 6: Acceso al Detalle de Oferta desde Perspectiva del Prestador
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Clic en el banner de la oferta laboral...');
    const ancBanner = page.locator('.ch-anc-banner').first();
    await ancBanner.click();
    await page.waitForURL('**/anuncios/**', { timeout: 10000 });
    await page.waitForSelector('.ch-anc-hero', { timeout: 10000 });
    await page.waitForSelector('.ch-anc-accion button', { timeout: 8000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-pds-detalle-anuncio-boton-postular.png') });
    console.log('[Paso 6] Captura guardada: 06-pds-detalle-anuncio-boton-postular.png');

    // -------------------------------------------------------------------------
    // Paso 7: Apertura y Diligenciamiento de Modal de Postulación No Vinculante
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Abriendo modal "Postular a la oferta"...');
    const btnPostularme = page.locator('.ch-anc-accion button', { hasText: 'Postularme a esta oferta' }).first();
    await btnPostularme.click();
    await page.waitForSelector('.ch-modal', { timeout: 8000 });
    await page.waitForTimeout(800);

    console.log('[Paso 7] Diligenciando formulario de postulación...');
    const mensajeTextarea = page.locator('.ch-modal textarea').first();
    await mensajeTextarea.fill('Cuento con más de 5 años de experiencia en mantenimiento preventivo de tuberías hidrosanitarias y trampas de grasa en restaurantes. Disponibilidad inmediata para entrevista.');

    const telInput = page.locator('.ch-modal input[placeholder*="300 000"]').first();
    if (await telInput.count() > 0) {
      await telInput.fill('3009876543');
    }

    const emailInput = page.locator('.ch-modal input[placeholder*="tucorreo"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill('pds@chambeapp.com');
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-pds-modal-postulacion-diligenciado.png') });
    console.log('[Paso 7] Captura guardada: 07-pds-modal-postulacion-diligenciado.png');

    // -------------------------------------------------------------------------
    // Paso 8: Envío de Postulación y Confirmación en Pantalla
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Enviando postulación no vinculante...');
    const btnEnviarPostulacion = page.locator('.ch-modal button', { hasText: 'Enviar postulación' }).first();
    await btnEnviarPostulacion.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-postulacion-enviada-confirmacion.png') });
    console.log('[Paso 8] Captura guardada: 08-pds-postulacion-enviada-confirmacion.png');

    // Cerrar sesión del prestador
    console.log('[Paso 8] Cerrando sesión del prestador...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 3: COMERCIANTE (MERCHANT) — GESTIÓN DE CANDIDATOS Y GOBERNANZA
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 9: Comerciante Reingresa y Evalúa al Candidato Postulado (/anuncios/1)
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Iniciando sesión con merchant@chambeapp.com para gestión de candidatos...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', MERCHANT_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/negocio**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 9] Navegando a /anuncios/1...');
    await page.goto(`${BASE_URL}/anuncios/1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-anc-postulaciones', { timeout: 12000 });
    await page.waitForSelector('.ch-anc-postulacion', { timeout: 10000 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-merchant-gestion-candidatos-postulacion.png') });
    console.log('[Paso 9] Captura guardada: 09-merchant-gestion-candidatos-postulacion.png');

    // -------------------------------------------------------------------------
    // Paso 10: Comerciante Marca Candidato como "Contactado" y Cierra el Anuncio
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Marcando candidato como "Contactado"...');
    const btnContactar = page.locator('.ch-anc-postulacion__acciones button', { hasText: 'Contactar' }).first();
    await btnContactar.click();
    await page.waitForTimeout(2000);

    console.log('[Paso 10] Cerrando el anuncio laboral (gobernanza de ciclo de vida)...');
    const btnCerrarAnuncio = page.locator('.ch-anc-accion button', { hasText: 'Cerrar anuncio' }).first();
    await btnCerrarAnuncio.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-merchant-contacto-marcado-anuncio-cerrado.png') });
    console.log('[Paso 10] Captura guardada: 10-merchant-contacto-marcado-anuncio-cerrado.png');

    console.log('== Flujo 10 completado exitosamente ==');

  } catch (err) {
    console.error('Error durante la ejecución del Flujo 10:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado
    const files = fs.readdirSync(VIDEO_DIR);
    const videoFile = files.find(f => f.endsWith('.webm') && !f.startsWith('10-anuncios-laborales-negocios'));
    if (videoFile) {
      const oldPath = path.join(VIDEO_DIR, videoFile);
      const newPath = path.join(VIDEO_DIR, '10-anuncios-laborales-negocios.webm');
      if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      fs.renameSync(oldPath, newPath);
      console.log(`[Video] Renombrado a: ${newPath}`);
    }

    console.log(`\n--- RESUMEN DE LLAMADAS API REGISTRADAS (${apiRequests.length}) ---`);
    apiRequests.forEach((req, idx) => {
      console.log(`${idx + 1}. [HTTP ${req.status}] ${req.method} ${req.endpoint}`);
    });
  }
}

run().catch(err => {
  console.error('Fallo en script Flujo 10:', err);
  process.exit(1);
});
