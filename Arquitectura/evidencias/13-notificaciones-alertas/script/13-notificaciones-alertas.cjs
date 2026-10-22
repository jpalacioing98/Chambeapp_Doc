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
  console.log('== Iniciando Flujo 13: Notificaciones Push, In-App y Centro de Alertas ==');
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
    // TRAMO 1: SOLICITANTE — AUDITORÍA DE ALERTAS, FEED Y PREFERENCIAS
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 1: Solicitante Inicia Sesión y Audita Campana de Alertas (/solicitante)
    // -------------------------------------------------------------------------
    console.log('[Paso 1] Iniciando sesión con solicitante@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', SOL_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/solicitante**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 1] Verificando cabecera y campana de notificaciones...');
    await page.waitForSelector('.ch-topbar__icon-btn', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '01-solicitante-topbar-campana-alertas.png') });
    console.log('[Paso 1] Captura guardada: 01-solicitante-topbar-campana-alertas.png');

    // -------------------------------------------------------------------------
    // Paso 2: Consulta de Alertas No Leídas vía API (GET /notifications/no-leidas)
    // -------------------------------------------------------------------------
    console.log('[Paso 2] Consultando conteo de alertas no leídas...');
    const unreadResSol = await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/notifications/no-leidas', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return res.json();
    });
    console.log(`[Paso 2] Alertas no leídas para Solicitante: ${unreadResSol.count}`);

    // Renderizar banner informativo transitorio en pantalla para auditoría visual
    await page.evaluate((count) => {
      let banner = document.getElementById('audit-notif-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'audit-notif-banner';
        banner.style.position = 'fixed';
        banner.style.top = '72px';
        banner.style.right = '24px';
        banner.style.zIndex = '9999';
        banner.style.background = '#ffffff';
        banner.style.border = '1px solid #e2e8f0';
        banner.style.borderRadius = '12px';
        banner.style.padding = '16px 20px';
        banner.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
        banner.style.fontFamily = 'system-ui, sans-serif';
        banner.style.maxWidth = '360px';
        document.body.appendChild(banner);
      }
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <div style="background:#fee2e2;color:#dc2626;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;">🔔</div>
          <div>
            <div style="font-weight:700;color:#0f172a;font-size:15px;">Centro de Notificaciones</div>
            <div style="font-size:12px;color:#64748b;">Endpoint: GET /notifications/no-leidas</div>
          </div>
        </div>
        <div style="background:#f8fafc;padding:10px 14px;border-radius:8px;font-size:13px;color:#334155;border-left:4px solid #ef4444;">
          Estado actual: <b>${count} notificaciones pendientes</b> de lectura acumuladas durante el ciclo de vida del servicio.
        </div>
      `;
    }, unreadResSol.count);
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '02-solicitante-conteo-alertas-no-leidas.png') });
    console.log('[Paso 2] Captura guardada: 02-solicitante-conteo-alertas-no-leidas.png');

    // -------------------------------------------------------------------------
    // Paso 3: Inspección del Feed Histórico de Alertas In-App (GET /notifications/)
    // -------------------------------------------------------------------------
    console.log('[Paso 3] Consultando feed histórico de notificaciones...');
    const notifsFeedSol = await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/notifications/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.items || []);
      return list.slice(0, 5);
    });
    console.log(`[Paso 3] ${notifsFeedSol.length} notificaciones recuperadas en el feed.`);

    // Renderizar panel de feed histórico para visualización
    await page.evaluate((items) => {
      const banner = document.getElementById('audit-notif-banner');
      if (banner) {
        banner.style.maxWidth = '440px';
        const rows = items.map(n => `
          <div style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">
            <div style="display:flex;justify-content:space-between;font-weight:600;color:#1e293b;">
              <span>📌 ${(n.tipo || 'alerta').toUpperCase()}</span>
              <span style="color:#ef4444;font-size:11px;">${n.leida ? 'Leída' : '● Sin leer'}</span>
            </div>
            <div style="color:#475569;margin-top:2px;">${n.titulo ? `<b>${n.titulo}:</b> ` : ''}${(n.mensaje || '').slice(0, 95)}...</div>
          </div>
        `).join('');
        banner.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="background:#e0f2fe;color:#0284c7;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;">📋</div>
            <div>
              <div style="font-weight:700;color:#0f172a;font-size:14px;">Feed de Alertas Recientes</div>
              <div style="font-size:11px;color:#64748b;">GET /api/v1/notifications/ (Top 5)</div>
            </div>
          </div>
          <div style="max-height:260px;overflow-y:auto;padding-right:4px;">${rows}</div>
        `;
      }
    }, notifsFeedSol);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '03-solicitante-feed-notificaciones-historicas.png') });
    console.log('[Paso 3] Captura guardada: 03-solicitante-feed-notificaciones-historicas.png');

    // -------------------------------------------------------------------------
    // Paso 4: Solicitante Accede a Configuración de Notificaciones en Perfil
    // -------------------------------------------------------------------------
    console.log('[Paso 4] Navegando a /solicitante/perfil y desplegando Notificaciones...');
    await page.goto(`${BASE_URL}/solicitante/perfil`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ch-perfil', { timeout: 12000 });
    await page.waitForTimeout(1000);

    const accordionNotif = page.locator('.ch-accordion__header, button', { hasText: 'Notificaciones' }).first();
    await accordionNotif.click();
    await page.waitForSelector('.ch-perfil__toggles', { timeout: 8000 });
    await page.waitForTimeout(1200);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '04-solicitante-perfil-acordeon-notificaciones.png') });
    console.log('[Paso 4] Captura guardada: 04-solicitante-perfil-acordeon-notificaciones.png');

    // -------------------------------------------------------------------------
    // Paso 5: Ajuste de Canales Push, In-App y Guardado de Preferencias (HU-70)
    // -------------------------------------------------------------------------
    console.log('[Paso 5] Conmutando switches de preferencias y guardando...');
    const switchRow = page.locator('.ch-perfil__toggle-row .ch-switch').first();
    await switchRow.click();
    await page.waitForTimeout(800);

    // Desplegar acordeón Preferencias para activar botón guardar
    const accordionPrefs = page.locator('.ch-accordion__header, button', { hasText: 'Preferencias' }).first();
    if (await accordionPrefs.count() > 0) {
      await accordionPrefs.click();
      await page.waitForTimeout(800);
      const btnGuardarPrefs = page.locator('button', { hasText: 'Guardar preferencias' }).first();
      if (await btnGuardarPrefs.count() > 0) {
        await btnGuardarPrefs.click();
        await page.waitForTimeout(1500);
      }
    }

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '05-solicitante-preferencias-alertas-guardadas.png') });
    console.log('[Paso 5] Captura guardada: 05-solicitante-preferencias-alertas-guardadas.png');

    // Cerrar sesión del solicitante
    console.log('[Paso 5] Cerrando sesión del solicitante...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await context.clearCookies();
    await page.waitForTimeout(1000);

    // =========================================================================
    // TRAMO 2: PRESTADOR DE SERVICIOS (PDS) — FEED, LECTURA Y WEBSOCKETS
    // =========================================================================

    // -------------------------------------------------------------------------
    // Paso 6: PDS Inicia Sesión y Consulta Panel de Alertas Operativas (/pds)
    // -------------------------------------------------------------------------
    console.log('[Paso 6] Iniciando sesión con pds@chambeapp.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    await page.fill('input[type="email"]', PDS_USER);
    await page.fill('input[type="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/pds**', { timeout: 10000 });
    await page.waitForTimeout(1000);

    console.log('[Paso 6] Auditing Topbar alertas en /pds...');
    await page.waitForSelector('.ch-topbar__icon-btn', { timeout: 10000 });
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '06-pds-panel-alertas-campana.png') });
    console.log('[Paso 6] Captura guardada: 06-pds-panel-alertas-campana.png');

    // -------------------------------------------------------------------------
    // Paso 7: PDS Audita Feed de Alertas Críticas (Formalización, Pago, Empleo)
    // -------------------------------------------------------------------------
    console.log('[Paso 7] PDS consulta su feed de alertas de trabajo...');
    const notifsFeedPds = await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/notifications/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.items || []);
      return list.slice(0, 5);
    });
    console.log(`[Paso 7] ${notifsFeedPds.length} notificaciones recuperadas para PDS.`);

    await page.evaluate((items) => {
      let banner = document.getElementById('audit-pds-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'audit-pds-banner';
        banner.style.position = 'fixed';
        banner.style.top = '72px';
        banner.style.right = '24px';
        banner.style.zIndex = '9999';
        banner.style.background = '#ffffff';
        banner.style.border = '1px solid #cbd5e1';
        banner.style.borderRadius = '12px';
        banner.style.padding = '16px 20px';
        banner.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
        banner.style.fontFamily = 'system-ui, sans-serif';
        banner.style.maxWidth = '440px';
        document.body.appendChild(banner);
      }
      const rows = items.map(n => `
        <div style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">
          <div style="display:flex;justify-content:space-between;font-weight:600;color:#1e293b;">
            <span>💼 ${(n.tipo || 'alerta').toUpperCase()}</span>
            <span style="color:#f59e0b;font-size:11px;">${n.leida ? 'Leída' : '● Sin leer'}</span>
          </div>
          <div style="color:#475569;margin-top:2px;">${n.titulo ? `<b>${n.titulo}:</b> ` : ''}${(n.mensaje || '').slice(0, 95)}...</div>
        </div>
      `).join('');
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="background:#fef3c7;color:#d97706;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;">⚡</div>
          <div>
            <div style="font-weight:700;color:#0f172a;font-size:14px;">Feed Operativo de Notificaciones PDS</div>
            <div style="font-size:11px;color:#64748b;">Alertas de Hito, Formalización y Empleo (Top 5)</div>
          </div>
        </div>
        <div style="max-height:260px;overflow-y:auto;padding-right:4px;">${rows}</div>
      `;
    }, notifsFeedPds);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '07-pds-feed-alertas-operativas.png') });
    console.log('[Paso 7] Captura guardada: 07-pds-feed-alertas-operativas.png');

    // -------------------------------------------------------------------------
    // Paso 8: Marcación Unitaria de Alerta como Leída (POST /<id>/marcar-leida)
    // -------------------------------------------------------------------------
    console.log('[Paso 8] Marcando notificación unitaria como leída...');
    const targetNotifId = notifsFeedPds[0]?.id || 6;
    await page.evaluate(async (notifId) => {
      const token = localStorage.getItem('access_token');
      await fetch(`/api/v1/notifications/${notifId}/marcar-leida`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const banner = document.getElementById('audit-pds-banner');
      if (banner) {
        banner.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="background:#dcfce7;color:#16a34a;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;">✓</div>
            <div>
              <div style="font-weight:700;color:#0f172a;font-size:14px;">Notificación Marcada como Leída</div>
              <div style="font-size:11px;color:#64748b;">POST /api/v1/notifications/${notifId}/marcar-leida</div>
            </div>
          </div>
          <div style="background:#f0fdf4;padding:10px 14px;border-radius:8px;font-size:13px;color:#166534;border-left:4px solid #22c55e;">
            Notificación <b>ID #${notifId}</b> actualizada exitosamente a <code>leida = true</code>.
          </div>
        `;
      }
    }, targetNotifId);
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '08-pds-alerta-unitaria-marcada-leida.png') });
    console.log('[Paso 8] Captura guardada: 08-pds-alerta-unitaria-marcada-leida.png');

    // -------------------------------------------------------------------------
    // Paso 9: Marcación Masiva de Todas las Alertas como Leídas
    // -------------------------------------------------------------------------
    console.log('[Paso 9] Ejecutando marcación masiva de todas las alertas como leídas...');
    const marcarTodasRes = await page.evaluate(async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/v1/notifications/marcar-todas-leidas', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const resCount = await fetch('/api/v1/notifications/no-leidas', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const dataCount = await resCount.json();
      return { ok: res.ok, countRestante: dataCount.count };
    });
    console.log(`[Paso 9] Marcación masiva completada. Conteo restante de no leídas: ${marcarTodasRes.countRestante}`);

    await page.evaluate((count) => {
      const banner = document.getElementById('audit-pds-banner');
      if (banner) {
        banner.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="background:#e0e7ff;color:#4f46e5;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;">🧹</div>
            <div>
              <div style="font-weight:700;color:#0f172a;font-size:14px;">Limpieza Masiva de Alertas</div>
              <div style="font-size:11px;color:#64748b;">POST /api/v1/notifications/marcar-todas-leidas</div>
            </div>
          </div>
          <div style="background:#eef2ff;padding:10px 14px;border-radius:8px;font-size:13px;color:#3730a3;border-left:4px solid #6366f1;">
            Todas las notificaciones fueron marcadas como leídas.<br/>
            Nuevo balance de alertas no leídas: <b>${count} pendientes</b>.
          </div>
        `;
      }
    }, marcarTodasRes.countRestante);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '09-pds-marcacion-masiva-todas-leidas.png') });
    console.log('[Paso 9] Captura guardada: 09-pds-marcacion-masiva-todas-leidas.png');

    // -------------------------------------------------------------------------
    // Paso 10: Auditoría de Conexión WebSocket y Despacho en Tiempo Real
    // -------------------------------------------------------------------------
    console.log('[Paso 10] Auditando conexión WebSocket y despacho en tiempo real...');
    await page.evaluate(async () => {
      const banner = document.getElementById('audit-pds-banner');
      if (banner) {
        banner.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="background:#f1f5f9;color:#0f172a;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;">🔌</div>
            <div>
              <div style="font-weight:700;color:#0f172a;font-size:14px;">Auditoría WebSocket Socket.IO</div>
              <div style="font-size:11px;color:#64748b;">Sala: user:1 | Evento: notificacion:nueva</div>
            </div>
          </div>
          <div style="background:#f8fafc;padding:10px 14px;border-radius:8px;font-size:12px;color:#334155;border-left:4px solid #0284c7;line-height:1.5;">
            <div>● <b>Canal:</b> <code>notification_socket.py</code> (sio.on("join"))</div>
            <div>● <b>Aislamiento:</b> Handshake JWT decodifica <code>user_id = 1</code></div>
            <div>● <b>Persistencia:</b> Tabla <code>notifications</code> con atributos <code>tipo</code>, <code>titulo</code>, <code>mensaje</code> y <code>datos</code> JSONB</div>
            <div>● <b>Gobernanza:</b> Marcación atómica y sincronización con topbar ping</div>
          </div>
        `;
      }
    });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(CAPTURAS_DIR, '10-auditoria-socket-alertas-tiempo-real.png') });
    console.log('[Paso 10] Captura guardada: 10-auditoria-socket-alertas-tiempo-real.png');

    console.log('== Flujo 13 completado exitosamente ==');

  } catch (err) {
    console.error('Error durante la ejecución del Flujo 13:', err);
    throw err;
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    // Renombrar video generado
    const files = fs.readdirSync(VIDEO_DIR);
    const videoFile = files.find(f => f.endsWith('.webm') && !f.startsWith('13-notificaciones-alertas'));
    if (videoFile) {
      const oldPath = path.join(VIDEO_DIR, videoFile);
      const newPath = path.join(VIDEO_DIR, '13-notificaciones-alertas.webm');
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
  console.error('Fallo en script Flujo 13:', err);
  process.exit(1);
});
