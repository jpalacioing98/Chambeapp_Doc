# Guía de entorno local y pruebas (test_dev)

## Prerrequisitos
- Python 3.11+
- Node.js 18+
- pip
- npm

## Backend (Chambeapp_backend)
### Mover/configurar entorno
Copiar `Chambeapp_backend/.env.example` → `Chambeapp_backend/.env` (lo que debes mover/crear; editar solo si usas Postgres real). Por defecto usa SQLite (sin config extra).

### Pasos
1. `pip install -r requirements.txt`
2. `python seed.py` (crea tablas + usuarios de prueba)
3. `python run.py` (arranca Flask + SocketIO en http://localhost:5000)

## Frontend (Chambeapp_frontend)
1. `cd Chambeapp_frontend && npm install`
2. `npm run dev` (Vite en http://localhost:5173, ya tiene proxy a :5000 para `/api` y `/socket.io`)
3. No requiere .env propio; usa proxy de vite.config.ts. Si quieres URL socket custom, crear `.env` con `VITE_SOCKET_URL`.

## Cómo probar el flujo
1. Login con credenciales de arriba (6 usuarios de prueba).
2. Empleador publica un servicio.
3. Trabajador ve sugerencias (match).
4. Crear orden.
5. Completar servicio.
6. Pagar.
7. Calificar.
8. Chatear.

## Tests
- **Backend:** `pytest -q` (55 tests).
- **Frontend:** `npm test` (vitest) y `npm run build` (typecheck + build PWA).

## Notas
- SQLite por defecto para dev rápido.
- Para Postgres: setear `DATABASE_URL` en `.env` y ejecutar migraciones Flask-Migrate (`flask db init/migrate/upgrade`). Nota: `seed.py` usa `db.create_all()` para dev.
- **Qué mover:** Lo único que debes "mover" es `.env.example` → `.env` en el backend; el frontend funciona con el proxy por defecto.
- Backend y frontend son repos separados (no monorepo).