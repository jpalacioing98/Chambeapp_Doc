# Verificación en dos pasos (2FA) — Guía de implementación

> Estado: **SMS + app autenticadora (TOTP) + códigos de recuperación**.
> Flujo de login, gestión desde Perfil → Seguridad y recuperación de cuenta.

---

## 1. Métodos

| Método | Cómo funciona | Requisitos |
|---|---|---|
| **SMS** | Código de 6 dígitos al celular registrado (Onurix en prod; `dev_code` en dev/test). | `User.telefono` |
| **TOTP** | Código de 6 dígitos de Google Authenticator, Authy, 1Password, etc. Se configura con QR + clave manual. | App autenticadora |
| **Recuperación** | 10 códigos de un solo uso (`XXXX-XXXX`). Se generan al activar y se pueden regenerar. | 2FA activa |

El método activo se guarda en `users.two_factor_method` (`sms` | `totp`). El
secreto TOTP se guarda cifrado (Fernet derivado de `SECRET_KEY`) y los códigos
de recuperación solo como HMAC-SHA256.

> Si se rota `SECRET_KEY`, los secretos TOTP existentes dejan de descifrarse.
> En ese caso los usuarios deben reconfigurar la app o usar un código de
> recuperación. No rotar sin planificar.

---

## 2. Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/v1/auth/2fa` | JWT | `{enabled, method, available_methods, has_phone, has_totp, recovery_codes_remaining}` |
| POST | `/api/v1/auth/2fa/sms/send` | JWT | Envía un código SMS (cooldown 60 s). |
| POST | `/api/v1/auth/2fa/setup/totp` | JWT | Genera secreto **pendiente** + `otpauth_uri` + `qr_svg`. |
| POST | `/api/v1/auth/2fa/enable` | JWT | `{method, code}` → activa y devuelve **10 códigos de recuperación** (única vez). |
| POST | `/api/v1/auth/2fa/disable` | JWT | `{password, code}` → desactiva y borra secreto/códigos. |
| POST | `/api/v1/auth/2fa/recovery-codes` | JWT | `{password, code}` → regenera e invalida los anteriores. |
| POST | `/api/v1/auth/2fa/verify` | Público | `{email, code}` → valida SMS/TOTP/recuperación y emite tokens. |
| POST | `/api/v1/auth/2fa/sms/resend` | Público | `{email}` → reenvía SMS del login (no revela si el correo existe). |

### Login

1. `POST /auth/login` valida correo + contraseña.
2. Si `two_factor_enabled`, **no** emite tokens:
   ```json
   {
     "requires_2fa": true,
     "method": "sms" | "totp",
     "masked_phone": "*** *** 567",
     "expires_in": 300,
     "dev_code": "123456"
   }
   ```
   `dev_code` solo aparece en dev/test. Para TOTP no hay `dev_code`.
3. `POST /auth/2fa/verify` con el código (SMS, TOTP o recuperación) emite
   `access_token` + `refresh_token`.

---

## 3. Base de datos

Migración **026**:

- `users.two_factor_method` (`sms` por defecto).
- `users.two_factor_secret` (TOTP confirmado, cifrado).
- `users.two_factor_pending_secret` (setup sin confirmar).
- `users.two_factor_confirmed_at`.
- Tabla `two_factor_recovery_codes` (`code_hash`, `usado`, `usado_en`).

En dev el entrypoint aplica las columnas/tabla con `IF NOT EXISTS` porque
dev usa `flask db stamp head`, no `upgrade`. En prod: `flask db upgrade`.

---

## 4. Frontend

| Archivo | Rol |
|---|---|
| `SeguridadPage.tsx` | Vista dedicada: estado, activar SMS/TOTP, QR, desactivar, regenerar códigos, contraseña y recuperación. |
| `SeguridadAccordion.tsx` | En el perfil: solo métodos + **Abrir seguridad** + **Cambiar contraseña** + **Recuperación**. |
| `LoginPage.tsx` | Vista de segundo factor con método, reenvío SMS y código de recuperación. |
| `useAuth.ts` | `login()` devuelve `requires2fa`; `completeTwoFactor()` guarda la sesión. |
| `usePerfil.ts` | Acciones `enviarCodigo2FA`, `configurarTotp`, `activar2FA`, `desactivar2FA`, `regenerarRecuperacion`. |

### Flujos de UI

- **Activar SMS:** Método SMS → Activar → código → se muestran los 10 códigos.
- **Activar app:** Configurar → escanear QR o copiar clave → código → se
  muestran los 10 códigos.
- **Desactivar:** contraseña + código vigente (SMS se envía desde el modal).
- **Regenerar códigos:** contraseña + código vigente; los anteriores mueren.
- **Login 2FA:** código del método; enlace “Usar código de recuperación”.

---

## 5. Pruebas

```bash
# Backend
docker exec chambeapp_backend_dev python -m pytest \
  tests/test_perfil_unificado.py tests/test_security.py -q

# Frontend
npx vitest run src/features/perfil/PerfilPage.test.tsx \
  src/features/perfil/components/VistasDedicadas.test.tsx
npx tsc --noEmit
npm run build
```

Cubierto: activación SMS, activación TOTP (QR/secreto), login por ambos
métodos, código de recuperación de un solo uso, regeneración que invalida los
anteriores, desactivación con contraseña + código y validación de payloads.
