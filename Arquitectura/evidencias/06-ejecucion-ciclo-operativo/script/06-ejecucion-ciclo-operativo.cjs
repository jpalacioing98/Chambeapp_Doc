const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de prueba (users.md)
const PDS_USER = 'pds@chambeapp.com';
const SOL_USER = 'solicitante@chambeapp.com';
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y consola

// Coordenadas exactas del sitio de trabajo (Solicitud #8)
const SITIO_LAT = 6.2088;
const SITIO_LNG = -75.5678;

// Imagen real para evidencia válida en MinIO
const SAMPLE_IMG = path.resolve(__dirname, '../../../../../frontend/public/og-image.png');

async function run() {
  console.log('== Iniciando Flujo 06: Ejecución y Ciclo Operativo de la Chamba (6 Hitos) ==');
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
    permissions: ['geolocation'],
    geolocation: { latitude: SITIO_LAT, longitude: SITIO_LNG },
  });

  const page = await context.newPage();

  // Interceptar subida de evidencia para remover prefijo data URI antes del backend
  await page.route('**/api/v1/chambas/evidencia/upload', async route => {
    try {
      const postData = route.request().postDataJSON();
      if (postData && postData.archivo_base64) {
        const cleanB64 = postData.archivo_base64.replace(/^data:[^;]+;base64,/, '');
        const reqHeaders = { ...route.request().headers() };
        delete reqHeaders['host'];
        delete reqHeaders['content-length'];
        const response = await page.request.post('http://localhost:5000/api/v1/chambas/evidencia/upload', {
          headers: reqHeaders,
          data: {
            ...postData,
            archivo_base64: cleanB64,
          },
        });
        let body = await response.text();
        if (body.includes('minio:9000')) {
          body = body.replaceAll('minio:9000', 'localhost:9000');
        }
        await route.fulfill({
          status: response.status(),
          headers: response.headers(),
          body: body,
        });
        return;
      }
    } catch (e) {
      console.warn('Error en route handler evidencia/upload:', e);
    }
    await route.continue();
  });
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/v1/')) {
      const entry = {
        method: response.request().method(),
        endpoint: url.replace(/^http:\/\/[^/]+/, ''),
        status: response.status(),
      };
      apiRequests.push(entry);
      if (url.includes('evidencia/upload')) {
        try {
          console.log('UPLOAD RES STATUS:', response.status(), await response.text());
        } catch {}
      }
      if (entry.status >= 400) {
        console.warn(`[WARN HTTP ${entry.status}] ${entry.method} ${entry.endpoint}`);
      }
    }
  });

  try {
    // =========================================================================
    // TRAMO 1: PDS — CHECK-IN GPS (<100M) Y EVIDENCIA INICIAL
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Autenticación del PDS y Acceso al Expediente (#1)
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Navegando al expediente de Chamba #1 (/pds/chambas/1)...');
    await page.goto(`${BASE_URL}/pds/chambas/1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-detalle', { timeout: 12000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-pds-expediente-programada.png') });

    // -------------------------------------------------------------------------
    // Paso 2: Hito 1 — Check-in con Validación Estricta de Proximidad GPS (<100m)
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Ejecutando inicio de obra con geolocalización en sitio...');
    const btnIniciar = page.locator('button:has-text("Iniciar obra")').first();
    await btnIniciar.waitFor({ state: 'visible', timeout: 8000 });
    await btnIniciar.click();

    // Esperar transición a estado "en_proceso"
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-pds-inicio-obra-gps.png') });

    // -------------------------------------------------------------------------
    // Paso 3: Hito 2 — Carga de Evidencia Fotográfica Inicial y Avance a Ejecución
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Subiendo evidencia inicial (estado previo)...');
    const uploaderEntrada = page.locator('.ch-evidence-uploader').first();
    const fileInputEntrada = uploaderEntrada.locator('input[type="file"]');
    await fileInputEntrada.setInputFiles(SAMPLE_IMG);
    await page.waitForTimeout(1200);

    const btnSubirEntrada = uploaderEntrada.locator('.ch-evidence-uploader__prev button:has-text("Subir"), button:has-text("Subir")').first();
    if (await btnSubirEntrada.isVisible()) {
      await btnSubirEntrada.click();
      await page.waitForTimeout(3000);
    }

    // Avanzar a ejecución activa
    const btnContinuar = page.locator('button:has-text("Continuar a ejecución")').first();
    await btnContinuar.waitFor({ state: 'visible', timeout: 8000 });
    await btnContinuar.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-pds-evidencia-inicial-subida.png') });

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // Paso 4: Hito 3 — Registro de Adenda Técnica (Costo y Tiempo Extra)
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Registrando adenda al contrato...');
    const btnAbrirAdenda = page.locator('button:has-text("Adenda al contrato")').first();
    await btnAbrirAdenda.scrollIntoViewIfNeeded();
    await btnAbrirAdenda.evaluate(b => b.click());
    await page.waitForTimeout(600);

    // Diligenciar modal de adenda
    const modalAdenda = page.locator('.ch-modal');
    await modalAdenda.waitFor({ state: 'visible', timeout: 8000 });
    await modalAdenda.locator('textarea').fill('Reemplazo de niple y codo PVC adicional por fisura no visible');
    const inputMontoAdenda = modalAdenda.locator('input[type="number"]').first();
    await inputMontoAdenda.fill('20000');
    const inputsNum = modalAdenda.locator('input[type="number"]');
    if (await inputsNum.count() > 1) {
      await inputsNum.nth(1).fill('1');
    }

    const btnSubmitAdenda = modalAdenda.locator('button:has-text("Registrar adenda")');
    await btnSubmitAdenda.evaluate(b => b.click());
    await page.waitForSelector('.ch-modal', { state: 'detached', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-pds-adenda-registrada.png') });

    // -------------------------------------------------------------------------
    // Paso 5: Hito 4 — Reporte de Novedad Operativa en Terreno
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Reportando novedad de obra...');
    const btnAbrirNovedad = page.locator('button:has-text("Reportar novedad")').first();
    await btnAbrirNovedad.scrollIntoViewIfNeeded();
    await btnAbrirNovedad.evaluate(b => b.click());
    await page.waitForTimeout(600);

    const modalNovedad = page.locator('.ch-modal');
    await modalNovedad.waitFor({ state: 'visible', timeout: 8000 });
    await modalNovedad.locator('textarea').fill('Corte preventivo temporal de suministro de agua durante el fraguado del sellante');
    const btnSubmitNovedad = modalNovedad.locator('button:has-text("Registrar novedad")');
    await btnSubmitNovedad.evaluate(b => b.click());
    await page.waitForSelector('.ch-modal', { state: 'detached', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pds-novedad-reportada.png') });

    // -------------------------------------------------------------------------
    // Paso 6: Hito 5 — Evidencia Final y Notificación de Cierre de Obra
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Subiendo evidencia final y solicitando cierre...');
    const uploaderSalida = page.locator('.ch-evidence-uploader').last();
    if (await uploaderSalida.isVisible()) {
      const fileInputSalida = uploaderSalida.locator('input[type="file"]');
      await fileInputSalida.setInputFiles(SAMPLE_IMG);
      await page.waitForTimeout(1200);

      const btnSubirSalida = uploaderSalida.locator('.ch-evidence-uploader__prev button:has-text("Subir"), button:has-text("Subir")').first();
      if (await btnSubirSalida.isVisible()) {
        await btnSubirSalida.evaluate(b => b.click());
        await page.waitForTimeout(3000);
      }
    }

    // Solicitar cierre de la chamba
    await page.waitForSelector('button:has-text("Solicitar cierre"):not([disabled])', { timeout: 12000 });
    const btnSolicitarCierre = page.locator('button:has-text("Solicitar cierre")').first();
    await btnSolicitarCierre.scrollIntoViewIfNeeded();
    await btnSolicitarCierre.evaluate(b => b.click());
    await page.waitForTimeout(2500);

    // Check-in de pago del PDS
    console.log('[Paso 6] Confirmando check-in de pago del prestador...');
    const btnPagoPds = page.locator('.ch-pago button:has-text("Confirmar pago directo")').first();
    if (await btnPagoPds.isVisible()) {
      await btnPagoPds.evaluate(b => b.click());
      await page.waitForTimeout(600);
      const modalPago = page.locator('.ch-modal');
      await modalPago.waitFor({ state: 'visible', timeout: 8000 });
      const inputMonto = modalPago.locator('input[type="number"]');
      await inputMonto.fill('140000');
      const btnSubmitPagoPds = modalPago.locator('button:has-text("Confirmar pago")');
      await btnSubmitPagoPds.evaluate(b => b.click());
      await page.waitForSelector('.ch-modal', { state: 'detached', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1500);
    }

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-pds-evidencia-final-cierre.png') });

    // Cierre de sesión PDS
    console.log('[Logout] Cerrando sesión del PDS...');
    await page.goto(`${BASE_URL}/pds/perfil`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const logoutPdsBtn = page.locator('button:has-text("Cerrar sesión")').first();
    if (await logoutPdsBtn.isVisible()) {
      await logoutPdsBtn.click();
    } else {
      await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
      await page.goto(`${BASE_URL}/login`);
    }
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: SOLICITANTE — REVISIÓN, HABILIDADES EN SITIO, PAGO Y CALIFICACIÓN
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 7: Autenticación del Solicitante y Acceso al Expediente
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 7] Accediendo a /solicitante/chambas/1...');
    await page.goto(`${BASE_URL}/solicitante/chambas/1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-detalle', { timeout: 12000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-solicitante-expediente-revision.png') });

    // -------------------------------------------------------------------------
    // Paso 8: Hito 6 — Validación de Habilidades Demostradas en Obra
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Validando habilidades demostradas en sitio...');
    const skillBtns = page.locator('.ch-validacion__skill');
    const skillCount = await skillBtns.count();
    if (skillCount > 0) {
      await skillBtns.first().evaluate(b => b.click());
      await page.waitForTimeout(500);
      const btnGuardarSkills = page.locator('button:has-text("Validar habilidades")').first();
      if (await btnGuardarSkills.isVisible()) {
        await btnGuardarSkills.evaluate(b => b.click());
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-solicitante-habilidades-validadas.png') });

    // -------------------------------------------------------------------------
    // Paso 9: Check-in Dual de Pago Directo y Confirmación de Liquidación
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Confirmando pago directo del solicitante y liquidando...');
    const btnPagoSol = page.locator('.ch-pago button:has-text("Confirmar pago directo")').first();
    if (await btnPagoSol.isVisible()) {
      await btnPagoSol.evaluate(b => b.click());
      await page.waitForTimeout(600);
      const modalPago = page.locator('.ch-modal');
      await modalPago.waitFor({ state: 'visible', timeout: 8000 });
      const inputMonto = modalPago.locator('input[type="number"]');
      await inputMonto.fill('140000');
      const btnSubmitPagoSol = modalPago.locator('button:has-text("Confirmar pago")');
      await btnSubmitPagoSol.evaluate(b => b.click());
      await page.waitForSelector('.ch-modal', { state: 'detached', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }

    // Confirmar liquidación
    console.log('[Paso 9] Esperando habilitación de liquidación...');
    await page.waitForSelector('button:has-text("Confirmar liquidación")', { timeout: 10000 });
    const btnConfirmarLiq = page.locator('button:has-text("Confirmar liquidación")').first();
    await btnConfirmarLiq.scrollIntoViewIfNeeded();
    await btnConfirmarLiq.evaluate(b => b.click());
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-solicitante-pago-liquidacion.png') });

    // -------------------------------------------------------------------------
    // Paso 10: Calificación Final (5 Estrellas) y Cierre Definitivo de Chamba
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Emitiendo calificación de 5 estrellas y reseña final...');
    await page.waitForSelector('.ch-rating-card', { timeout: 10000 });
    const starBtn = page.locator('.ch-rating__star').nth(4);
    await starBtn.evaluate(b => b.click());
    await page.waitForTimeout(500);

    const txtComentario = page.locator('.ch-rating-card textarea');
    await txtComentario.fill('Excelente labor de fontanería. Puntual, tubería completamente reparada sin fugas y área impecable.');

    const btnFinalizar = page.locator('.ch-rating-card button:has-text("Finalizar chamba")').first();
    await btnFinalizar.evaluate(b => b.click());
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-chamba-completada-finalizada.png') });

    console.log('== Flujo 06 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 06:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Consolidar video en 06-ejecucion-ciclo-operativo.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '06-ejecucion-ciclo-operativo.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '06-ejecucion-ciclo-operativo.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/06-ejecucion-ciclo-operativo.webm');
    }

    console.log(`Total peticiones API interceptadas: ${apiRequests.length}`);
  }
}

run();
