const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de prueba (users.md)
const SOL_USER = 'solicitante@chambeapp.com';
const PDS_USER = 'pds@chambeapp.com';
const PASS = 'ChambeApp123!'; // Enmascarada como ******** en reportes y logs

async function run() {
  console.log('== Iniciando Flujo 11: Billetera Digital, Recargas Simuladas y Paquetes de Monedas ==');
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
    acceptDownloads: true,
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
    // TRAMO 1: SOLICITANTE — SALDO INICIAL, RECARGA SIMULADA Y COMPRA DE COINS
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Solicitante Accede a su Billetera Digital (/solicitante/billetera)
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Navegando a /solicitante/billetera...');
    await page.goto(`${BASE_URL}/solicitante/billetera`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-bil', { timeout: 12000 });
    await page.waitForSelector('.ch-bil__grid', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-solicitante-billetera-saldo-inicial.png') });
    console.log('[Paso 1] Captura guardada: 01-solicitante-billetera-saldo-inicial.png');

    // -------------------------------------------------------------------------
    // Paso 2: Apertura y Diligenciamiento de Modal "Recargar saldo"
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Abriendo modal "Recargar saldo"...');
    const btnRecargarSol = page.locator('.ch-bil__head-actions button', { hasText: 'Recargar' }).first();
    await btnRecargarSol.click();
    await page.waitForSelector('.ch-modal', { timeout: 8000 });
    await page.waitForTimeout(800);

    console.log('[Paso 2] Ingresando monto de recarga: $250.000 COP...');
    const montoInputSol = page.locator('.ch-modal input[type="number"]').first();
    await montoInputSol.fill('250000');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-modal-recarga-nequi.png') });
    console.log('[Paso 2] Captura guardada: 02-solicitante-modal-recarga-nequi.png');

    // -------------------------------------------------------------------------
    // Paso 3: Confirmación de Recarga Simulada y Actualización de Saldo
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Confirmando recarga simulada Nequi...');
    const btnConfirmarRecargaSol = page.locator('.ch-modal button', { hasText: /Recargar/i }).last();
    await btnConfirmarRecargaSol.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-solicitante-recarga-exitosa-movimientos.png') });
    console.log('[Paso 3] Captura guardada: 03-solicitante-recarga-exitosa-movimientos.png');

    // -------------------------------------------------------------------------
    // Paso 4: Adquisición de Paquete de Monedas (ChambeCoins) y Balance
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Adquiriendo paquete de monedas estándar (150 + 15 bono)...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/wallet/coins/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paquete: 'estandar' }),
      });
      return res.json();
    });
    await page.waitForTimeout(1000);

    console.log('[Paso 4] Consultando pestaña "Coins" en la billetera...');
    const tabCoinsSol = page.locator('.ch-bil__tabs button', { hasText: 'Coins' }).first();
    await tabCoinsSol.click();
    await page.waitForTimeout(1000);

    const btnRefreshCoinsSol = page.locator('.ch-bil__refresh button', { hasText: 'Actualizar' }).first();
    if (await btnRefreshCoinsSol.count() > 0) {
      await btnRefreshCoinsSol.click();
      await page.waitForTimeout(1500);
    }

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-solicitante-coins-adquiridos-balance.png') });
    console.log('[Paso 4] Captura guardada: 04-solicitante-coins-adquiridos-balance.png');

    // Cerrar sesión del solicitante
    console.log('[Paso 4] Cerrando sesión del solicitante...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: PRESTADOR DE SERVICIOS (PDS) — RECARGA, RETIRO Y CERTIFICADO
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 5: PDS Inicia Sesión y Accede a su Billetera Digital (/pds/billetera)
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 5] Navegando a /pds/billetera...');
    await page.goto(`${BASE_URL}/pds/billetera`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-bil', { timeout: 12000 });
    await page.waitForSelector('.ch-bil__head-actions', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pds-billetera-vista-general.png') });
    console.log('[Paso 5] Captura guardada: 05-pds-billetera-vista-general.png');

    // -------------------------------------------------------------------------
    // Paso 6: PDS Realiza Recarga de Fondos Operativos
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Abriendo modal de recarga para PDS ($200.000 COP)...');
    const btnRecargarPds = page.locator('.ch-bil__head-actions button', { hasText: 'Recargar' }).first();
    await btnRecargarPds.click();
    await page.waitForSelector('.ch-modal', { timeout: 8000 });
    await page.waitForTimeout(800);

    const montoInputPds = page.locator('.ch-modal input[type="number"]').first();
    await montoInputPds.fill('200000');
    await page.waitForTimeout(800);

    const btnConfirmarRecargaPds = page.locator('.ch-modal button', { hasText: /Recargar/i }).last();
    await btnConfirmarRecargaPds.click();
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-pds-recarga-fondos-operativos.png') });
    console.log('[Paso 6] Captura guardada: 06-pds-recarga-fondos-operativos.png');

    // -------------------------------------------------------------------------
    // Paso 7: Solicitud de Retiro Bancario con Retención Preventiva (HU-27, HU-28)
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Solicitando retiro de $80.000 COP hacia cuenta Bancolombia...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          monto: 80000,
          cuenta_destino: 'Bancolombia Ahorros 123-456789-00',
        }),
      });
      return res.json();
    });
    await page.waitForTimeout(1000);

    console.log('[Paso 7] Recargando vista de billetera para auditar egreso y saldo retenido...');
    await page.goto(`${BASE_URL}/pds/billetera`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-bil', { timeout: 12000 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-pds-retiro-bancario-retencion.png') });
    console.log('[Paso 7] Captura guardada: 07-pds-retiro-bancario-retencion.png');

    // -------------------------------------------------------------------------
    // Paso 8: Modal y Generación de Certificado de Ingresos en PDF (HU-68)
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Abriendo modal "Certificado de ingresos"...');
    const btnCertificado = page.locator('.ch-bil__head-actions button', { hasText: 'Certificado' }).first();
    await btnCertificado.click();
    await page.waitForSelector('.ch-modal', { timeout: 8000 });
    await page.waitForSelector('.ch-bil__cert', { timeout: 8000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-modal-certificado-ingresos-pdf.png') });
    console.log('[Paso 8] Captura guardada: 08-pds-modal-certificado-ingresos-pdf.png');

    console.log('[Paso 8] Disparando descarga del PDF de certificado...');
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    const btnDescargarPdf = page.locator('.ch-modal button', { hasText: /Descargar PDF/i }).first();
    await btnDescargarPdf.click();
    const download = await downloadPromise;
    if (download) {
      console.log(`[Paso 8] Archivo descargado exitosamente: ${download.suggestedFilename()}`);
    }
    await page.waitForTimeout(1500);

    // -------------------------------------------------------------------------
    // Paso 9: Bonificación Promocional de Monedas al Prestador
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Acreditando bonificación promocional de 50 monedas al PDS...');
    try {
      execSync(
        'docker exec chambeapp_backend_dev python -c "from app import create_app; app = create_app(); ctx = app.app_context(); ctx.push(); from app.services.wallet import dar_monedas_promocionales; dar_monedas_promocionales(1, 50); from app.extensions import db; db.session.commit(); print(\'Promo coins granted\')"'
      );
    } catch (e) {
      console.warn('[Paso 9] Warning otorgando promo coins:', e.message);
    }

    console.log('[Paso 9] Consultando pestaña "Coins" del PDS...');
    const tabCoinsPds = page.locator('.ch-bil__tabs button', { hasText: 'Coins' }).first();
    await tabCoinsPds.click();
    await page.waitForTimeout(1000);

    const btnRefreshCoins = page.locator('.ch-bil__refresh button', { hasText: 'Actualizar' }).first();
    if (await btnRefreshCoins.count() > 0) {
      await btnRefreshCoins.click();
      await page.waitForTimeout(1500);
    }

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-pds-coins-bonificacion-promocional.png') });
    console.log('[Paso 9] Captura guardada: 09-pds-coins-bonificacion-promocional.png');

    // -------------------------------------------------------------------------
    // Paso 10: Auditoría en el Hub de Hitos y Gamificación (/pds/coins)
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Navegando a /pds/coins (Hub de ChambeCoins, hitos y canjes)...');
    await page.goto(`${BASE_URL}/pds/coins`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-coins-stats', { timeout: 12000 });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-pds-hub-coins-milestones-canjes.png') });
    console.log('[Paso 10] Captura guardada: 10-pds-hub-coins-milestones-canjes.png');

    console.log('== Flujo 11 completado exitosamente ==');

  } catch (err) {
    console.error('Error durante la ejecución del Flujo 11:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado
    const files = fs.readdirSync(VIDEO_DIR);
    const videoFile = files.find(f => f.endsWith('.webm') && !f.startsWith('11-billetera-recargas-monedas'));
    if (videoFile) {
      const oldPath = path.join(VIDEO_DIR, videoFile);
      const newPath = path.join(VIDEO_DIR, '11-billetera-recargas-monedas.webm');
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
  console.error('Fallo en script Flujo 11:', err);
  process.exit(1);
});
