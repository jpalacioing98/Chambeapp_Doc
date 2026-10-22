const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de prueba (users.md)
const MERCHANT_USER = 'merchant@chambeapp.com';
const SOL_USER = 'solicitante@chambeapp.com';
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y logs

async function run() {
  console.log('== Iniciando Flujo 09: Directorio y Gestión de Negocios Locales ==');
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
    // TRAMO 1: COMERCIANTE (MERCHANT) — GESTIÓN INTEGRAL DEL NEGOCIO
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Login de Comerciante y Visualización del Dashboard (/negocio)
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con merchant@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', MERCHANT_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/negocio**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Esperando carga completa de /negocio...');
    await page.waitForSelector('.ch-mer-dash', { timeout: 12000 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-merchant-dashboard.png') });
    console.log('[Paso 1] Captura guardada: 01-merchant-dashboard.png');

    // -------------------------------------------------------------------------
    // Paso 2: Acceso a Mi Negocio (/negocio/mi-negocio)
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Navegando a /negocio/mi-negocio...');
    await page.goto(`${BASE_URL}/negocio/mi-negocio`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-mer-neg', { timeout: 12000 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-merchant-mi-negocio-configuracion.png') });
    console.log('[Paso 2] Captura guardada: 02-merchant-mi-negocio-configuracion.png');

    // -------------------------------------------------------------------------
    // Paso 3: Actualización de Canales de Contacto Directo (WhatsApp) y Guardado
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Desplegando acordeón "Contacto" y actualizando WhatsApp...');
    const contactoAccordion = page.locator('.ch-accordion__head', { hasText: 'Contacto' });
    if (await contactoAccordion.count() > 0) {
      await contactoAccordion.scrollIntoViewIfNeeded();
      await contactoAccordion.click();
      await page.waitForTimeout(800);
    }

    const whatsappInput = page.locator('input[placeholder*="+57 300"]').first();
    await whatsappInput.scrollIntoViewIfNeeded();
    await whatsappInput.fill('+57 300 123 4567');

    const whatsappMsgInput = page.locator('textarea[placeholder*="Mensaje que recibirán"]').first();
    if (await whatsappMsgInput.count() > 0) {
      await whatsappMsgInput.fill('¡Hola! Quiero consultar el menú del día y hacer un pedido en Restaurante El Sazón.');
    }

    console.log('[Paso 3] Guardando configuración de negocio...');
    const btnGuardarConfig = page.locator('button', { hasText: 'Guardar configuración' }).first();
    await btnGuardarConfig.scrollIntoViewIfNeeded();
    await btnGuardarConfig.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-merchant-guardar-contacto-exitoso.png') });
    console.log('[Paso 3] Captura guardada: 03-merchant-guardar-contacto-exitoso.png');

    // -------------------------------------------------------------------------
    // Paso 4: Gestión de Matriz de Horarios Semanales (/negocio/horarios)
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Navegando a /negocio/horarios...');
    await page.goto(`${BASE_URL}/negocio/horarios`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-negocio-horarios', { timeout: 12000 });
    await page.waitForTimeout(1000);

    // Ajustar horario de cierre para cubrir jornada completa actual
    const todayRow = page.locator('.ch-horarios-row--today');
    if (await todayRow.count() > 0) {
      console.log('[Paso 4] Ajustando hora de cierre de hoy a 23:59...');
      const closeInput = todayRow.locator('input[type="time"]').nth(1);
      await closeInput.fill('23:59');
    }

    console.log('[Paso 4] Guardando horarios actualizados...');
    const btnGuardarHorarios = page.locator('button', { hasText: 'Guardar horarios' }).first();
    await btnGuardarHorarios.scrollIntoViewIfNeeded();
    await btnGuardarHorarios.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-merchant-gestion-horarios.png') });
    console.log('[Paso 4] Captura guardada: 04-merchant-gestion-horarios.png');

    // -------------------------------------------------------------------------
    // Paso 5: Auditoría y Carga de Vitrina Fotográfica (/negocio/imagenes)
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Navegando a /negocio/imagenes...');
    await page.goto(`${BASE_URL}/negocio/imagenes`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-imagenes-url', { timeout: 12000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 5] Agregando imagen de vitrina por URL...');
    const urlInput = page.locator('.ch-imagenes-url input').first();
    await urlInput.fill('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800');

    const btnAgregarUrl = page.locator('.ch-imagenes-url button', { hasText: 'Agregar URL' }).first();
    await btnAgregarUrl.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-merchant-galeria-vitrina.png') });
    console.log('[Paso 5] Captura guardada: 05-merchant-galeria-vitrina.png');

    // Cerrar sesión del comerciante
    console.log('[Paso 5] Cerrando sesión del comerciante...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: CLIENTE / COMUNIDAD — DIRECTORIO, MAPA, RESEÑA Y REPORTE
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 6: Login de Solicitante y Acceso a Directorio Público en Mapa (/negocios)
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 6] Navegando a /negocios (Directorio público en Mapa Interactivo)...');
    await page.goto(`${BASE_URL}/negocios`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.mapboxgl-canvas', { timeout: 15000 });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-directorio-publico-mapa-negocios.png') });
    console.log('[Paso 6] Captura guardada: 06-directorio-publico-mapa-negocios.png');

    // -------------------------------------------------------------------------
    // Paso 7: Selección de Pin / Card de "Restaurante El Sazón" y Despliegue de Sheet
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Seleccionando card de "Restaurante El Sazón"...');
    const peekCard = page.locator('.ch-pub-peek-card', { hasText: 'Restaurante El Sazón' }).first();
    if (await peekCard.count() > 0) {
      await peekCard.click();
    } else {
      // Fallback: clic en la primera card disponible
      await page.locator('.ch-pub-peek-card').first().click();
    }
    await page.waitForSelector('.ch-sheet', { timeout: 8000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-sheet-detalle-restaurante-el-sazon.png') });
    console.log('[Paso 7] Captura guardada: 07-sheet-detalle-restaurante-el-sazon.png');

    // -------------------------------------------------------------------------
    // Paso 8: Navegación al Perfil Detallado Público (/negocios/1)
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Navegando a /negocios/1...');
    const btnVerDetalle = page.locator('.ch-sheet button', { hasText: 'Ver detalle' }).first();
    if (await btnVerDetalle.count() > 0) {
      await btnVerDetalle.click();
      await page.waitForURL('**/negocios/**', { timeout: 10000 });
    } else {
      await page.goto(`${BASE_URL}/negocios/1`, { waitUntil: 'domcontentloaded' });
    }

    await page.waitForSelector('.ch-pub-banner', { timeout: 12000 });
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-negocio-detalle-publico-horarios.png') });
    console.log('[Paso 8] Captura guardada: 08-negocio-detalle-publico-horarios.png');

    // -------------------------------------------------------------------------
    // Paso 9: Emisión de Reseña y Calificación de 5 Estrellas
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Abriendo formulario para escribir reseña...');
    const btnEscribirResena = page.locator('button', { hasText: 'Escribir reseña' }).first();
    await btnEscribirResena.scrollIntoViewIfNeeded();
    await btnEscribirResena.click();
    await page.waitForSelector('.ch-pub-review-box', { timeout: 8000 });
    await page.waitForTimeout(800);

    console.log('[Paso 9] Asignando 5 estrellas e ingresando comentario...');
    const starBtn5 = page.locator('.ch-pub-review-box .ch-rating--interactive button').nth(4);
    await starBtn5.click();

    const reviewTextarea = page.locator('.ch-pub-review-box textarea').first();
    await reviewTextarea.fill('Excelente atención y sabor tradicional inigualable. La comida criolla es de primera y el servicio sumamente ágil. Recomendadísimo para almorzar en familia.');

    console.log('[Paso 9] Publicando reseña...');
    const btnPublicarResena = page.locator('.ch-pub-review-box button', { hasText: 'Publicar reseña' }).first();
    await btnPublicarResena.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-solicitante-publicar-calificacion.png') });
    console.log('[Paso 9] Captura guardada: 09-solicitante-publicar-calificacion.png');

    // -------------------------------------------------------------------------
    // Paso 10: Envío de Reporte Comunitario Preventivo (ReportModal)
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Abriendo modal "Reportar negocio"...');
    const btnReportar = page.locator('.ch-pub-side button', { hasText: 'Reportar negocio' }).first();
    await btnReportar.scrollIntoViewIfNeeded();
    await btnReportar.click();
    await page.waitForSelector('.ch-report-modal', { timeout: 8000 });
    await page.waitForTimeout(800);

    console.log('[Paso 10] Seleccionando motivo "Otro" y diligenciando descripción...');
    const radioOtro = page.locator('.ch-report-modal input[value="Otro"]').first();
    if (await radioOtro.count() > 0) {
      await radioOtro.check({ force: true });
    }

    const descTextarea = page.locator('.ch-report-modal__textarea').first();
    await descTextarea.fill('Auditoría arquitectónica preventiva: verificación exitosa de funcionamiento, horarios y legalidad del comercio.');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-modal-reporte-comunitario.png') });
    console.log('[Paso 10] Captura guardada: 10-modal-reporte-comunitario.png');

    console.log('[Paso 10] Enviando reporte...');
    const btnEnviarReporte = page.locator('.ch-modal button', { hasText: 'Enviar' }).first();
    await btnEnviarReporte.click();
    await page.waitForTimeout(2500);

    console.log('== Flujo 09 completado exitosamente ==');

  } catch (err) {
    console.error('Error durante la ejecución del Flujo 09:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado
    const files = fs.readdirSync(VIDEO_DIR);
    const videoFile = files.find(f => f.endsWith('.webm') && !f.startsWith('09-directorio-negocios-locales'));
    if (videoFile) {
      const oldPath = path.join(VIDEO_DIR, videoFile);
      const newPath = path.join(VIDEO_DIR, '09-directorio-negocios-locales.webm');
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
  console.error('Fallo en script Flujo 09:', err);
  process.exit(1);
});
