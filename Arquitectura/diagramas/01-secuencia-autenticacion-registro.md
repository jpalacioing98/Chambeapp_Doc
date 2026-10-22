# Diagrama de Secuencia — Flujo 01: Autenticación, Registro y Seguridad Multi-Rol

> **Módulo:** Acceso, Identidad y Seguridad  
> **Fuentes de Código:** [`backend/app/controllers/auth.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/auth.py), [`backend/app/controllers/two_factor.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/two_factor.py), [`backend/app/auth/decorators.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/auth/decorators.py), [`frontend/src/features/auth/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/auth/)  
> **Historias de Usuario:** [HU-01](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-01-registro-de-usuario), [HU-02](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-02-inicio-de-sesión-y-autenticación-jwt), [HU-03](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-03-cierre-de-sesión), [HU-49](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-49-autenticación-en-dos-factores-2fa-totp), [HU-50](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-50-recuperación-de-contraseña-mediante-código-otp).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario (Cliente / PDS)
    participant FE as Frontend React (AuthShell / useAuth)
    participant API as Flask API Gateway (auth.py / two_factor.py)
    participant SEC as Motor Criptográfico (Bcrypt / JWT Manager)
    participant DB as PostgreSQL (users, wallets)
    participant REDIS as Redis (Sesiones / Rate Limiting)

    %% ---------------------------------------------------------
    %% SUBFLUJO A: REGISTRO DE USUARIO
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of U: SUBFLUJO A: Registro y Aprovisionamiento
    U->>FE: Diligencia formulario (Nombre, Email, Password, Rol)
    FE->>FE: Validación esquema Zod (min 8 car., formato email)
    FE->>API: POST /api/v1/auth/register {email, password, rol, nombre}
    API->>DB: SELECT id FROM users WHERE email = ?
    alt Email ya registrado
        DB-->>API: User record exists
        API-->>FE: HTTP 409 Conflict {"message": "Email ya registrado"}
        FE-->>U: Muestra toast de error
    else Email disponible
        DB-->>API: None
        API->>SEC: bcrypt.generate_password_hash(password, rounds=12)
        SEC-->>API: password_hash
        API->>DB: INSERT INTO users (email, password_hash, rol, role_version, activo)
        API->>DB: INSERT INTO wallets (user_id, balance, coins) VALUES (?, 0, 0)
        DB-->>API: commit() exitoso (user_id generado)
        API->>SEC: create_access_token(identity=user_id, claims={role, role_v: 1})
        SEC-->>API: JWT access_token
        API-->>FE: HTTP 201 Created {user, access_token}
        FE->>FE: localStorage.setItem("access_token", token)
        FE-->>U: Redirección automática a homePathForRole(rol)
    end
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: INICIO DE SESIÓN Y GOBERNANZA JWT
    %% ---------------------------------------------------------
    rect rgb(254, 242, 242)
    note right of U: SUBFLUJO B: Login y Verificación de Sesión
    U->>FE: Ingresa email y contraseña (********)
    FE->>API: POST /api/v1/auth/login {email, password}
    API->>DB: SELECT * FROM users WHERE email = ? AND activo = true
    alt Usuario inexistente o inactivo
        DB-->>API: None
        API-->>FE: HTTP 401 Unauthorized {"message": "Credenciales inválidas"}
        FE-->>U: Error en pantalla
    else Usuario encontrado
        DB-->>API: User record
        API->>SEC: bcrypt.check_password_hash(hash, password)
        alt Password incorrecta
            SEC-->>API: False
            API-->>FE: HTTP 401 Unauthorized {"message": "Credenciales inválidas"}
            FE-->>U: Error en pantalla
        else Password correcta
            SEC-->>API: True
            alt 2FA Habilitado (two_factor_enabled = true)
                API-->>FE: HTTP 200 OK {"2fa_required": true, "temp_token": "..."}
                FE-->>U: Despliega modal de código TOTP (Google Authenticator)
                U->>FE: Ingresa código 6 dígitos
                FE->>API: POST /api/v1/auth/2fa/verify {code, temp_token}
                API->>SEC: pyotp.TOTP(secret).verify(code)
                SEC-->>API: True
            end
            API->>SEC: create_access_token(identity, claims={role, role_v})
            SEC-->>API: JWT Token (vigencia 24h)
            API-->>FE: HTTP 200 OK {user, access_token}
            FE->>FE: Guarda sesión y contexto de usuario
            FE-->>U: Redirección al panel del rol (/solicitante o /pds)
        end
    end
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: REVOCACIÓN DE TOKEN POR CAMBIO DE ESTADO
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of U: SUBFLUJO C: Revocación de Sesión Inmediata (RNF-SEC)
    U->>FE: Solicita acción protegida (con token antiguo)
    FE->>API: GET /api/v1/users/me/profile (Header: Bearer JWT)
    API->>API: @jwt_required() & Claims check
    API->>DB: SELECT role_version, status FROM users WHERE id = identity
    DB-->>API: role_version = 2 (BD) vs token.claim.role_v = 1
    API-->>FE: HTTP 401 Unauthorized {"message": "Sesión revocada: el rol o estado cambió"}
    FE->>FE: localStorage.clear()
    FE-->>U: Redirección inmediata al login
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Aprovisionamiento Atómico:** Cada nuevo registro de usuario genera simultáneamente en la misma transacción (`db.session.commit()`) un registro en `users` y una billetera en `wallets` con saldo cero, garantizando que ninguna cuenta exista sin libro contable.
2. **Revocación Desacoplada sin Blacklist en Memoria (`role_version`):** En lugar de consultar una lista negra en Redis para cada petición REST, el backend incluye el claim `role_v` en el JWT. Si un administrador suspende a un usuario o degrada su rol, solo incrementa `user.role_version += 1` en la BD; la siguiente llamada con el token anterior falla inmediatamente con `HTTP 401`.
3. **Hashing de Contraseñas:** Se utiliza `bcrypt` con 12 rondas de salting, mitigando ataques de fuerza bruta y diccionarios precomputados.
