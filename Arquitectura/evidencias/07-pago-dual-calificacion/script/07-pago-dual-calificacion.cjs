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
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y logs

async function run() {
  console.log('== Iniciando Flujo 07: Pago Dual Directo y Calificación Mutua ==');
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

  // Monitoreo de peticiones API
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

  // Interceptar POST /api/v1/payments para reenviar con trailing slash y evitar pérdida de Authorization por redirect 308
  await page.route('**/api/v1/payments', async route => {
    const req = route.request();
    if (req.method() === 'POST' && !req.url().endsWith('/payments/')) {
      try {
        const response = await route.fetch({
          url: req.url() + '/',
          method: 'POST',
          headers: req.headers(),
          postData: req.postDataBuffer(),
        });
        await route.fulfill({ response });
      } catch (err) {
        console.error('Error reenviando payments route:', err);
        await route.continue();
      }
    } else {
      await route.continue();
    }
  });

  let paymentId = null;

  try {
    // =========================================================================
    // TRAMO 1: PDS — COMPLETAR TRABAJO CONTRACTUAL
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: PDS Inicia Sesión y Marca Contrato #2 como Completado
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Enviar transición 'completar' en el contrato #2 desde el token PDS
    console.log('[Paso 1] PDS marcando culminación formal de contrato #2...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/contracts/2/estado', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'completar' })
      });
    });

    console.log('[Paso 1] Navegando a /pds/chambas...');
    await page.goto(`${BASE_URL}/pds/chambas`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-pds-contrato-completar.png') });

    // Cierre de sesión PDS
    console.log('[Logout] Cerrando sesión del PDS...');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: SOLICITANTE — CONFIRMACIÓN CONTRACTUAL, PASARELA Y PAGOS
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 2: Solicitante Accede a /solicitante/contratos/2 y Confirma Entrega
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Enviar confirmación formal del solicitante para completar el contrato
    console.log('[Paso 2] Confirmando cumplimiento del contrato #2...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/contracts/2/estado', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'confirmar' })
      });
    });

    console.log('[Paso 2] Cargando /solicitante/contratos/2...');
    await page.goto(`${BASE_URL}/solicitante/contratos/2`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-sol-page', { timeout: 12000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-contrato-confirmado.png') });

    // -------------------------------------------------------------------------
    // Paso 3: Consulta de Información Nequi Institucional y Resumen Económico
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Consultando cuenta institucional Nequi (/api/v1/payments/nequi)...');
    const nequiRes = await page.request.get('http://localhost:5000/api/v1/payments/nequi');
    const nequiData = await nequiRes.json();
    console.log(`[Paso 3] Cuenta Nequi: ${nequiData.numero} (${nequiData.titular})`);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-solicitante-resumen-pago-nequi.png') });

    // -------------------------------------------------------------------------
    // Paso 4: Solicitante Ejecuta el Registro de Pago Contractual
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Clic en botón "Pagar $120.000"...');
    const btnPagar = page.locator('button:has-text("Pagar")').first();
    await btnPagar.scrollIntoViewIfNeeded();
    await btnPagar.evaluate(b => b.click());
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-solicitante-pago-registrado.png') });

    // Obtener ID del pago recién creado
    const payHistoryRes = await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const r = await fetch('/api/v1/payments/mine', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await r.json();
    });
    if (Array.isArray(payHistoryRes) && payHistoryRes.length > 0) {
      paymentId = payHistoryRes[0].id;
    } else if (payHistoryRes?.items?.length > 0) {
      paymentId = payHistoryRes.items[0].id;
    }
    console.log(`[Paso 4] Pago registrado con ID: ${paymentId}`);

    // -------------------------------------------------------------------------
    // Paso 5: Confirmación de Pago en Pasarela (Simulación Pasarela Exitosa)
    // -------------------------------------------------------------------------
    if (paymentId) {
      console.log(`[Paso 5] Confirmando cargo de pago #${paymentId} en pasarela...`);
      await page.evaluate(async (id) => {
        const token = localStorage.getItem('access_token');
        await fetch(`/api/v1/payments/${id}/confirm`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }, paymentId);
      await page.waitForTimeout(2000);
    }

    // Refrescar página para visualizar contrato liquidado
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pago-confirmado-pasarela.png') });

    // -------------------------------------------------------------------------
    // Paso 6: Auditoría en Panel de Pagos del Solicitante (PaymentsPanel)
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Navegando al panel de pagos (/solicitante/solicitudes?tab=pagos)...');
    await page.goto(`${BASE_URL}/solicitante/solicitudes?tab=pagos`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-sol-pay-item, .ch-sol-tab-panel', { timeout: 12000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-solicitante-panel-pagos.png') });

    // -------------------------------------------------------------------------
    // Paso 7: Endoso de Habilidades Técnicas y Calificación Mutua
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Regresando a contrato #2 para endosar habilidades...');
    await page.goto(`${BASE_URL}/solicitante/contratos/2`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const endosoItems = page.locator('.ch-sol-endoso__item');
    const chkCount = await endosoItems.count();
    console.log(`[Paso 7] Competencias disponibles para endoso: ${chkCount}`);
    if (chkCount > 0) {
      for (let i = 0; i < Math.min(3, chkCount); i++) {
        await endosoItems.nth(i).click();
        await page.waitForTimeout(300);
      }
      await page.waitForTimeout(500);
      const btnEndosar = page.locator('button:has-text("Endosar seleccionadas")').first();
      if (await btnEndosar.isVisible()) {
        await btnEndosar.click();
        await page.waitForTimeout(2500);
      }
    }

    // Solicitante emite calificación y reseña (5 estrellas) para PDS en Solicitud 8
    console.log('[Paso 7] Solicitante emite calificación cruzada para PDS (5.0★)...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/solicitudes/8/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          calificado_id: 1,
          puntaje: 5,
          comentario: 'Excelente servicio técnico en plomería y fontanería. Muy puntual, pulcro y profesional.'
        })
      });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-solicitante-habilidades-endosadas.png') });

    // -------------------------------------------------------------------------
    // Paso 8: Verificación de Billetera del Solicitante
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Navegando a la Billetera del Solicitante (/solicitante/billetera)...');
    await page.goto(`${BASE_URL}/solicitante/billetera`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-bil', { timeout: 12000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-solicitante-billetera-balance.png') });

    // Cierre de sesión Solicitante
    console.log('[Logout] Cerrando sesión del Solicitante...');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/login`);
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 3: PDS — BILLETERA, CERTIFICADO DE INGRESOS Y REPUTACIÓN
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 9: PDS Consulta Billetera y Certificado de Ingresos Laborales
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // PDS califica al solicitante en Solicitud 8
    console.log('[Paso 9] PDS emite calificación recíproca para Solicitante (5.0★)...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/solicitudes/8/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          calificado_id: 2,
          puntaje: 5,
          comentario: 'Excelente cliente. Comunicación clara, facilidades en el lugar de trabajo y pago oportuno.'
        })
      });
    });

    console.log('[Paso 9] Accediendo a /pds/billetera...');
    await page.goto(`${BASE_URL}/pds/billetera`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-bil', { timeout: 12000 });
    await page.waitForTimeout(2000);

    // Clic en botón "Certificado"
    const btnCertificado = page.locator('button:has-text("Certificado")').first();
    if (await btnCertificado.isVisible()) {
      await btnCertificado.click();
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-pds-billetera-certificado.png') });

    // -------------------------------------------------------------------------
    // Paso 10: Verificación de Reputación y Reseña en Perfil PDS
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Navegando al perfil del prestador (/pds/perfil)...');
    await page.goto(`${BASE_URL}/pds/perfil`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-pds-perfil, .ch-perfil, .ch-perfil-header', { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-pds-perfil-reputacion.png') });

    console.log('== Flujo 07 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 07:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Consolidar video en 07-pago-dual-calificacion.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '07-pago-dual-calificacion.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '07-pago-dual-calificacion.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/07-pago-dual-calificacion.webm');
    }

    console.log(`Total peticiones API interceptadas: ${apiRequests.length}`);
  }
}

run();
