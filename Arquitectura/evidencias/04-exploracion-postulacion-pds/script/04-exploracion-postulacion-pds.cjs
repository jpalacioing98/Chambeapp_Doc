const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const EVIDENCIAS_DIR = path.resolve(__dirname, '..');
const CAPTURAS_DIR = path.join(EVIDENCIAS_DIR, 'capturas');
const VIDEO_DIR = path.join(EVIDENCIAS_DIR, 'video');

// Credenciales oficiales de prueba
const PDS_USER = 'pds@chambeapp.com';
const PDS_PASS = 'ChambeApp123!'; // En reportes y capturas se enmascara como ********

async function run() {
  console.log('== Iniciando Flujo 04: Exploración Geoespacial y Postulación de Ofertas (PDS) ==');

  // Asegurar directorios limpios
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

  // Interceptar y registrar peticiones de API
  const apiRequests = [];
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/v1/')) {
      apiRequests.push({
        method: response.request().method(),
        endpoint: url,
        status: response.status(),
      });
    }
  });

  try {
    // -------------------------------------------------------------------------
    // 1. Inicio de Sesión como PDS (Trabajador)
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PDS_PASS);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-pds-login.png') });

    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // -------------------------------------------------------------------------
    // 2. Dashboard PDS (/pds)
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Visualizando Dashboard PDS con stats y recomendadas...');
    await page.waitForSelector('.ch-pds-inicio, .ch-app-shell', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-pds-inicio-dashboard.png') });

    // -------------------------------------------------------------------------
    // 3. Navegación al Mapa y Explorador de Chambas (/pds/chambas)
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Navegando al mapa de chambas (/pds/chambas)...');
    await page.goto(`${BASE_URL}/pds/chambas`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-pds-buscar, .mapboxgl-canvas', { timeout: 15000 });
    await page.waitForTimeout(2500); // Tiempo para estabilización de tiles y edificios 3D
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-pds-mapa-chambas.png') });

    // -------------------------------------------------------------------------
    // 4. Filtrado Geoespacial y Configuración de Radio
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Abriendo panel de filtros y configurando radio a 20 km...');
    // Desplegar controles flotantes si están colapsados
    const collapseBtn = page.locator('.ch-pds-buscar__collapse');
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(800);
    }

    // Clic en botón "Filtrar" para abrir el FilterSheet
    const filterBtn = page.locator('.ch-pds-buscar__filter-btn');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForSelector('.ch-filter-sheet', { timeout: 8000 });
      await page.waitForTimeout(600);

      // Ajustar slider de radio a 20 km para incluir la chamba publicada
      const radiusSlider = page.locator('.ch-filter-sheet input[type="range"]');
      if (await radiusSlider.isVisible()) {
        await radiusSlider.fill('20');
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-pds-filtro-radio.png') });

      // Aplicar filtros: Clic en "Ver resultados"
      await page.click('.ch-filter-sheet button:has-text("Ver resultados")');
      await page.waitForTimeout(1000);
    }

    // -------------------------------------------------------------------------
    // 5. Selección de la Chamba en el Bottom Sheet de Resultados
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Seleccionando la chamba en la lista de resultados...');
    // Esperar a que la lista de resultados esté presente
    await page.waitForSelector('.ch-job-card, .ch-pds-buscar__list', { timeout: 10000 });
    
    // Localizar específicamente la solicitud de cocina creada en Flujo 03
    const targetJobCard = page.locator('.ch-job-card').filter({ hasText: 'tubería de cocina' }).first();
    const finalCard = (await targetJobCard.count()) > 0 ? targetJobCard : page.locator('.ch-job-card').first();
    await finalCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-pds-chamba-card.png') });

    // -------------------------------------------------------------------------
    // 6. Navegación a la Vista Completa de Postulación (/pds/postular/:id)
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Abriendo formulario de postulación...');
    const postularBtn = finalCard.locator('button:has-text("Postularme"), button:has-text("Postular")');
    if (await postularBtn.isVisible()) {
      await postularBtn.click();
    } else {
      await finalCard.click();
    }

    await page.waitForURL('**/pds/postular/**', { timeout: 12000 });
    await page.waitForSelector('.ch-pds-postular__form', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-pds-postular-vista.png') });

    // -------------------------------------------------------------------------
    // 7. Diligenciamiento de la Oferta / Propuesta
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Diligenciando campos de la postulación...');
    // Mensaje para el contratante
    await page.fill(
      'textarea',
      'Cuento con herramientas profesionales de termofusión y repuestos de tubería PVC de 1/2 pulgada. Tengo disponibilidad inmediata para atender la fuga de cocina con garantía de mano de obra.'
    );

    // Propuesta de precio: proponer $120.000 COP
    const priceInput = page.locator('.ch-pds-postular__price-row input[type="number"], input[placeholder*="Ej:"], input[placeholder="0"]');
    if (await priceInput.isVisible()) {
      await priceInput.fill('120000');
    }

    // Franja horaria si quedó a convenir
    const franjaBtn = page.locator('.ch-pds-postular__franja:has-text("Mañana"), .ch-pds-postular__franja').first();
    if (await franjaBtn.isVisible()) {
      await franjaBtn.click();
    }

    // Fecha propuesta si quedó a convenir
    const dateInput = page.locator('#pds-fecha-propuesta');
    if (await dateInput.isVisible()) {
      await dateInput.fill(new Date().toISOString().slice(0, 10));
    }

    // Disponibilidad: 'hoy'
    const availSelect = page.locator('select');
    if (await availSelect.isVisible()) {
      await availSelect.selectOption('hoy');
    }

    // Checkbox de confirmación (usar force: true debido al span custom sobre el input)
    const confirmCheckbox = page.locator('input[type="checkbox"]');
    if (await confirmCheckbox.count() > 0) {
      await confirmCheckbox.check({ force: true });
    }

    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-pds-postular-diligenciado.png') });

    // -------------------------------------------------------------------------
    // 8. Envío de Postulación (POST /api/v1/solicitudes/:id/ofertas)
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Enviando postulación...');
    const submitBtn = page.locator('.ch-pds-postular__actions button[type="submit"]');
    await Promise.all([
      page.waitForURL('**/pds/chambas**', { timeout: 15000 }),
      submitBtn.click(),
    ]);

    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-postulacion-enviada.png') });

    // -------------------------------------------------------------------------
    // 9. Consulta de Ofertas Propias / Postulaciones Activas
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Cambiando a vista Mis Chambas -> Postulaciones...');
    // Clic en FAB "Mis chambas" si estamos en el mapa
    const fabMisChambas = page.locator('.ch-pds-buscar__fab');
    if (await fabMisChambas.isVisible()) {
      await fabMisChambas.click();
      await page.waitForTimeout(1000);
    }

    // Cambiar tab a 'Postulaciones'
    const postTab = page.locator('.ch-seg__tab:has-text("Postulaciones"), button:has-text("Postulaciones")');
    if (await postTab.isVisible()) {
      await postTab.click();
      await page.waitForTimeout(1200);
    }

    await page.waitForSelector('.ch-pds-chambas, .ch-app-shell', { timeout: 10000 });
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-pds-mis-postulaciones.png') });

    // -------------------------------------------------------------------------
    // 10. Cierre de Sesión Seguro
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Navegando a perfil de PDS y cerrando sesión...');
    await page.goto(`${BASE_URL}/pds/perfil`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button:has-text("Cerrar sesión")', { timeout: 8000 });
    const logoutBtn = page.locator('button:has-text("Cerrar sesión")');
    await logoutBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await logoutBtn.click();
    await page.waitForURL('**/login', { timeout: 8000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-pds-logout.png') });

    console.log('== Flujo 04 completado exitosamente ==');
  } catch (err) {
    console.error('Error durante la ejecución del Flujo 04:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video consolidado a 04-exploracion-postulacion-pds.webm
    const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm') && f !== '04-exploracion-postulacion-pds.webm');
    if (videoFiles.length > 0) {
      const targetVideo = path.join(VIDEO_DIR, '04-exploracion-postulacion-pds.webm');
      if (fs.existsSync(targetVideo)) {
        fs.unlinkSync(targetVideo);
      }
      fs.renameSync(path.join(VIDEO_DIR, videoFiles[0]), targetVideo);
      console.log('Video consolidado en video/04-exploracion-postulacion-pds.webm');
    }

    fs.writeFileSync(
      path.join(EVIDENCIAS_DIR, 'requests.json'),
      JSON.stringify(apiRequests, null, 2),
      'utf8'
    );
  }
}

run();
