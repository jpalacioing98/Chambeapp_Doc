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
  console.log('== Iniciando Flujo 12: Mensajería y Chat en Tiempo Real WebSockets ==');
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
    // TRAMO 1: SOLICITANTE — BANDEJA, NEGOCIACIÓN Y MENSAJERÍA BIDIRECCIONAL
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Solicitante Inicia Sesión y Accede a /solicitante/mensajes
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Navegando a /solicitante/mensajes...');
    await page.goto(`${BASE_URL}/solicitante/mensajes`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-chat-shell', { timeout: 12000 });
    await page.waitForSelector('.ch-chat-list', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-solicitante-bandeja-mensajes-lista.png') });
    console.log('[Paso 1] Captura guardada: 01-solicitante-bandeja-mensajes-lista.png');

    // -------------------------------------------------------------------------
    // Paso 2: Apertura del Hilo de Conversación Activa con PDS
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Abriendo conversación activa con PDS...');
    const convItem = page.locator('.ch-conv').first();
    await convItem.click();
    await page.waitForSelector('.ch-chat-thread', { timeout: 10000 });
    await page.waitForSelector('.ch-chat-thread__header', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-hilo-conversacion-abierto.png') });
    console.log('[Paso 2] Captura guardada: 02-solicitante-hilo-conversacion-abierto.png');

    // -------------------------------------------------------------------------
    // Paso 3: Publicación de Condición Contractual Estructurada (HU-30)
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Publicando condición contractual estructurada (CondicionCard)...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const payloadCondicion = '⟦c:condicion⟧' + JSON.stringify({
        texto: 'Garantía técnica: El prestador debe garantizar 6 meses sobre los repuestos instalados y calibrar la presión hidrostática.',
        autor: 'Marlon (Solicitante)',
      });
      await fetch('/api/v1/chat/conversations/1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido: payloadCondicion }),
      });
    });
    await page.waitForTimeout(1000);

    // Recargar conversación para renderizar nueva tarjeta
    await page.goto(`${BASE_URL}/solicitante/mensajes?conversacion=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-chat-thread', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-solicitante-condicion-contractual-publicada.png') });
    console.log('[Paso 3] Captura guardada: 03-solicitante-condicion-contractual-publicada.png');

    // -------------------------------------------------------------------------
    // Paso 4: Ajuste de Parámetros y Contraoferta en el Chat (HU-30)
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Publicando ajuste de horario y contraoferta estructurada...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const payloadContra = '⟦c:contraoferta⟧' + JSON.stringify({
        ofertaId: 1,
        monto: 120000,
        mensaje: 'Ajuste de franja horaria: Confirmar inicio a las 8:30 AM con prueba de estanqueidad.',
        fecha: '2026-10-22',
        horario: '8:30 AM',
      });
      await fetch('/api/v1/chat/conversations/1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido: payloadContra }),
      });
    });
    await page.waitForTimeout(1000);

    await page.goto(`${BASE_URL}/solicitante/mensajes?conversacion=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-chat-thread', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-solicitante-contraoferta-horario-ajustado.png') });
    console.log('[Paso 4] Captura guardada: 04-solicitante-contraoferta-horario-ajustado.png');

    // -------------------------------------------------------------------------
    // Paso 5: Envío de Referencia Fotográfica / Adjunto Multimedia (HU-31)
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Enviando referencia fotográfica y evidencia de tubería...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/chat/conversations/1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contenido: 'Te comparto foto del estado actual de la tubería debajo del fregadero para diagnóstico previo: https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
        }),
      });
    });
    await page.waitForTimeout(1000);

    await page.goto(`${BASE_URL}/solicitante/mensajes?conversacion=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-chat-thread', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-solicitante-adjunto-multimedia-enviado.png') });
    console.log('[Paso 5] Captura guardada: 05-solicitante-adjunto-multimedia-enviado.png');

    // -------------------------------------------------------------------------
    // Paso 6: Menú de Seguridad y Moderación en el Chat
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Abriendo menú de opciones de seguridad y moderación...');
    const btnMenuOpciones = page.locator('.ch-chat-thread__actions button').first();
    await btnMenuOpciones.click();
    await page.waitForSelector('.ch-dropdown__menu', { timeout: 8000 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-solicitante-menu-seguridad-moderacion.png') });
    console.log('[Paso 6] Captura guardada: 06-solicitante-menu-seguridad-moderacion.png');

    // Cerrar menú y sesión del solicitante
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    console.log('[Paso 6] Cerrando sesión del solicitante...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: PRESTADOR DE SERVICIOS (PDS) — RECEPCIÓN, RESPUESTA Y GOBERNANZA
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 7: PDS Inicia Sesión y Accede a /pds/mensajes
    // -------------------------------------------------------------------------
    console.log('[Paso 7] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 7] Navegando a /pds/mensajes...');
    await page.goto(`${BASE_URL}/pds/mensajes`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-chat-shell', { timeout: 12000 });
    await page.waitForSelector('.ch-chat-list', { timeout: 10000 });
    await page.waitForTimeout(1500);

    const convItemPds = page.locator('.ch-conv').first();
    await convItemPds.click();
    await page.waitForSelector('.ch-chat-thread', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-pds-bandeja-mensajes-hilo-activo.png') });
    console.log('[Paso 7] Captura guardada: 07-pds-bandeja-mensajes-hilo-activo.png');

    // -------------------------------------------------------------------------
    // Paso 8: PDS Confirma con Condición Técnica Estructurada (HU-30)
    // -------------------------------------------------------------------------
    console.log('[Paso 8] PDS publica condición técnica complementaria...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const payloadCondicionPds = '⟦c:condicion⟧' + JSON.stringify({
        texto: 'Especificación de materiales: Se utilizarán codos de cobre soldables tipo M y teflón de alta densidad para máxima resistencia a la presión.',
        autor: 'Carlos (Prestador PDS)',
      });
      await fetch('/api/v1/chat/conversations/1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido: payloadCondicionPds }),
      });
    });
    await page.waitForTimeout(1000);

    await page.goto(`${BASE_URL}/pds/mensajes?conversacion=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-chat-thread', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-condicion-tecnica-confirmada.png') });
    console.log('[Paso 8] Captura guardada: 08-pds-condicion-tecnica-confirmada.png');

    // -------------------------------------------------------------------------
    // Paso 9: Modal "Nueva Disputa" Accesible desde el Chat (Gobernanza)
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Abriendo modal "Nueva disputa" desde el chat...');
    const btnFabDisputa = page.locator('.ch-pds-msg-fab').first();
    await btnFabDisputa.click();
    await page.waitForSelector('.ch-modal', { timeout: 8000 });
    await page.waitForSelector('.ch-modal input, .ch-modal select', { timeout: 8000 });
    await page.waitForTimeout(1200);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-pds-modal-nueva-disputa-integrada.png') });
    console.log('[Paso 9] Captura guardada: 09-pds-modal-nueva-disputa-integrada.png');

    // Cerrar modal de disputa
    const btnCerrarModal = page.locator('.ch-modal__close, .ch-modal button', { hasText: /Cancelar|Volver/i }).first();
    if (await btnCerrarModal.count() > 0) {
      await btnCerrarModal.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(1000);

    // -------------------------------------------------------------------------
    // Paso 10: Auditoría Final del Hilo Completo, Lectura y WebSocket (HU-32, HU-69)
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Marcando lectura y haciendo scroll al final del hilo...');
    await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      await fetch('/api/v1/chat/conversations/1/messages/read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const threadBody = document.querySelector('.ch-chat-thread__body');
      if (threadBody) threadBody.scrollTop = threadBody.scrollHeight;
    });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-auditoria-hilo-completo-sala-privada.png') });
    console.log('[Paso 10] Captura guardada: 10-auditoria-hilo-completo-sala-privada.png');

    console.log('== Flujo 12 completado exitosamente ==');

  } catch (err) {
    console.error('Error durante la ejecución del Flujo 12:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado
    const files = fs.readdirSync(VIDEO_DIR);
    const videoFile = files.find(f => f.endsWith('.webm') && !f.startsWith('12-mensajeria-chat-tiempo-real'));
    if (videoFile) {
      const oldPath = path.join(VIDEO_DIR, videoFile);
      const newPath = path.join(VIDEO_DIR, '12-mensajeria-chat-tiempo-real.webm');
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
  console.error('Fallo en script Flujo 12:', err);
  process.exit(1);
});
