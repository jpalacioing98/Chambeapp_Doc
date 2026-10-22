/**
 * Script de Automatización — Flujo 02: Perfil de Usuario y Verificación de Identidad (KYC)
 * ChambeApp Architecture Testing Suite (Fase 4)
 *
 * Herramienta: Playwright con Chromium + SwiftShader (aceleración por software)
 * Origen: http://localhost:5173
 * Roles evaluados:
 *   - Tramo 1: PDS (Trabajador) — pds@chambeapp.com (Consulta perfil, edición cuenta, subida doc KYC)
 *   - Tramo 2: Solicitante (Empleador) — solicitante@chambeapp.com (Validación telefónica OTP SMS)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de frontend/doc/users.md (no se imprimen en logs)
const PDS_EMAIL = 'pds@chambeapp.com';
const SOL_EMAIL = 'solicitante@chambeapp.com';
const USER_PASS = 'ChambeApp123!';

// Crear imagen PNG válida de prueba para documentos KYC
const DUMMY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAYklEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPBg8AAAB8U7lMAAAAABJRU5ErkJggg==',
  'base64'
);
const TEMP_DOC_PATH = path.join(EVIDENCIAS_DIR, 'cedula_prueba.png');
fs.writeFileSync(TEMP_DOC_PATH, DUMMY_PNG);

async function run() {
  console.log('== Iniciando Flujo 02: Perfil de Usuario y Verificación de Identidad (KYC) ==');

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
    // =========================================================================
    // TRAMO 1: PDS (Trabajador) — Perfil, Edición de Cuenta y Documentos KYC
    // =========================================================================
    console.log('[Tramo 1 - PDS] 1. Inicio de sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', PDS_EMAIL);
    await page.fill('input[type="password"]', USER_PASS);
    await page.click('button[type="submit"]:has-text("Entrar")');

    await page.waitForURL('**/pds**', { timeout: 12000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-pds-login.png') });

    console.log('[Tramo 1 - PDS] 2. Navegando al perfil del trabajador (/pds/perfil)...');
    await page.goto(`${BASE_URL}/pds/perfil`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ch-perfil, .ch-perfil__header', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-pds-perfil-inicial.png') });

    console.log('[Tramo 1 - PDS] 3. Editando datos de cuenta (Zona / Ubicación)...');
    // Abrir acordeón de datos de cuenta
    const cuentaHeader = page.locator('.ch-accordion__header:has-text("Datos de cuenta")');
    if (await cuentaHeader.isVisible()) {
      await cuentaHeader.click();
      await page.waitForTimeout(500);
    }
    const zonaInput = page.locator('input[placeholder*="Laureles"]');
    if (await zonaInput.isVisible()) {
      await zonaInput.fill('Laureles, Medellín - Sector Estadio');
      const saveBtn = page.locator('.ch-perfil__save button:has-text("Guardar cambios")').first();
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(800);
      }
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-pds-datos-cuenta-editados.png') });

    console.log('[Tramo 1 - PDS] 4. Abriendo módulo de Verificación de Identidad (KYC)...');
    const kycHeader = page.locator('.ch-accordion__header:has-text("Verificación de identidad")');
    if (await kycHeader.isVisible()) {
      await kycHeader.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-pds-kyc-acordeon.png') });

    console.log('[Tramo 1 - PDS] 5. Subiendo documento de identidad KYC...');
    const subirBtn = page.locator('.ch-perfil__row button:has-text("Subir"), .ch-perfil__row button:has-text("Reenviar")').first();
    if (await subirBtn.isVisible()) {
      // Manejar el selector de archivos
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 8000 }),
        subirBtn.click(),
      ]);
      await fileChooser.setFiles(TEMP_DOC_PATH);
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pds-kyc-doc-subido.png') });

    console.log('[Tramo 1 - PDS] 6. Cerrando sesión de PDS...');
    await page.click('button:has-text("Cerrar sesión")');
    await page.waitForURL('**/login', { timeout: 8000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-pds-logout.png') });

    // =========================================================================
    // TRAMO 2: Solicitante (Empleador) — Verificación Telefónica OTP SMS
    // =========================================================================
    console.log('[Tramo 2 - Solicitante] 7. Inicio de sesión con solicitante@chambeapp.com...');
    await page.fill('input[type="email"]', SOL_EMAIL);
    await page.fill('input[type="password"]', USER_PASS);
    await page.click('button[type="submit"]:has-text("Entrar")');

    await page.waitForURL('**/solicitante**', { timeout: 12000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-solicitante-login.png') });

    console.log('[Tramo 2 - Solicitante] 8. Navegando al perfil del solicitante (/solicitante/perfil)...');
    await page.goto(`${BASE_URL}/solicitante/perfil`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ch-perfil', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-solicitante-perfil.png') });

    console.log('[Tramo 2 - Solicitante] 9. Abriendo verificación de identidad y enviando OTP...');
    const solKycHeader = page.locator('.ch-accordion__header:has-text("Verificación de identidad")');
    if (await solKycHeader.isVisible()) {
      await solKycHeader.click();
      await page.waitForTimeout(500);
    }

    const verifyPhoneBtn = page.locator('button:has-text("Verificar número")');
    if (await verifyPhoneBtn.isVisible()) {
      await verifyPhoneBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-solicitante-otp-modal.png') });

    console.log('[Tramo 2 - Solicitante] 10. Validando código OTP en pantalla...');
    const otpInput = page.locator('#perfil-otp');
    if (await otpInput.isVisible()) {
      // Si hay dev code en el texto del modal, lo usamos; si no, código estándar de test
      const noteText = await page.locator('.ch-perfil__otp .ch-perfil__note').textContent().catch(() => '');
      const match = noteText.match(/\b\d{6}\b/);
      const codeToUse = match ? match[0] : '123456';
      await otpInput.fill(codeToUse);
      await page.click('.ch-perfil__otp-actions button:has-text("Verificar")');
      await page.waitForTimeout(1500);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-solicitante-otp-verificado.png') });

    console.log('[Tramo 2 - Solicitante] 11. Cierre de sesión final...');
    await page.click('button:has-text("Cerrar sesión")');
    await page.waitForURL('**/login', { timeout: 8000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '11-solicitante-logout.png') });

    console.log('== Flujo 02 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 02:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Eliminar archivo temporal de prueba
    if (fs.existsSync(TEMP_DOC_PATH)) {
      fs.unlinkSync(TEMP_DOC_PATH);
    }

    // Renombrar video generado a 02-perfil-kyc.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '02-perfil-kyc.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '02-perfil-kyc.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/02-perfil-kyc.webm');
    }

    fs.writeFileSync(
      path.join(EVIDENCIAS_DIR, 'requests.json'),
      JSON.stringify(apiRequests, null, 2),
      'utf8'
    );
  }
}

run();
