# Diagrama de Secuencia — Flujo 02: Perfil de Usuario y Verificación de Identidad (KYC)

> **Módulo:** Perfil de Usuario, Identidad y Cumplimiento Normativo (KYC)  
> **Fuentes de Código:** [`backend/app/controllers/kyc.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/kyc.py), [`backend/app/controllers/users.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/users.py), [`backend/app/controllers/two_factor.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/controllers/two_factor.py), [`backend/app/models/kyc.py`](file:///d:/Programs/Chambeapp_frontend-main/backend/app/models/kyc.py), [`frontend/src/features/perfil/`](file:///d:/Programs/Chambeapp_frontend-main/frontend/src/features/perfil/)  
> **Historias de Usuario:** [HU-06](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-06-consulta-y-edición-de-perfil-de-usuario), [HU-07](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-07-subida-de-foto-de-perfil), [HU-51](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-51-verificación-de-identidad-kyc-con-documento), [HU-52](file:///d:/Programs/Chambeapp_frontend-main/documentation/Requerimientos/HistoriasDeUsuario.md#hu-52-validación-telefónica-vía-otp-sms).

---

## 1. Diagrama de Secuencia (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor PDS as PDS (Trabajador)
    actor SOL as Solicitante (Empleador)
    actor VER as Verificador / Superadmin
    participant FE as Frontend React (PerfilPage / KYCSection)
    participant API as Flask API Gateway (kyc.py / users.py)
    participant S3 as MinIO Object Storage (S3 kyc-docs)
    participant DB as PostgreSQL (users, profiles, kyc_docs)
    participant SMS as Servicio OTP / Notificaciones

    %% ---------------------------------------------------------
    %% SUBFLUJO A: CONSULTA Y ACTUALIZACIÓN DE PERFIL PDS
    %% ---------------------------------------------------------
    rect rgb(240, 249, 255)
    note right of PDS: SUBFLUJO A: Consulta y Actualización de Perfil
    PDS->>FE: Navega a /pds/perfil
    FE->>API: GET /api/v1/users/me/profile (Bearer JWT)
    API->>DB: SELECT * FROM profiles WHERE user_id = ?
    DB-->>API: Datos del perfil (nombre, reputación, zona, habilidades)
    API-->>FE: HTTP 200 OK {profile}
    FE-->>PDS: Renderiza tarjeta de perfil, reputación e insignias
    PDS->>FE: Modifica zona a "Laureles, Medellín" y guarda
    FE->>API: PUT /api/v1/users/me/profile {zona: "Laureles, Medellín"}
    API->>DB: UPDATE profiles SET zona = ? WHERE user_id = ?
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 200 OK {message: "Perfil actualizado"}
    FE-->>PDS: Notificación Toast de éxito
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO B: CARGA DOCUMENTAL KYC (PDS)
    %% ---------------------------------------------------------
    rect rgb(254, 249, 195)
    note right of PDS: SUBFLUJO B: Subida Documental KYC por Rol
    PDS->>FE: Despliega acordeón "Verificación de Identidad (KYC)"
    FE->>API: GET /api/v1/kyc/documentos-requeridos
    API->>DB: SELECT * FROM kyc_documentos_requeridos WHERE rol = 'pds'
    DB-->>API: Catálogo normativo [cedula_ciudadania, antecedentes, cert_bancaria]
    FE->>API: GET /api/v1/kyc/documentos/mios
    API->>DB: SELECT * FROM kyc_documentos_usuario WHERE user_id = ?
    DB-->>API: Documentos previamente subidos
    API-->>FE: HTTP 200 OK {catalogo, mios}
    FE-->>PDS: Despliega lista de requisitos pendientes
    PDS->>FE: Selecciona archivo Cédula PDF/JPG y confirma
    FE->>FE: Codificación Base64 / Multipart Payload
    FE->>API: POST /api/v1/kyc/documentos {documento_clave: "cedula", archivo: "..."}
    API->>S3: PutObject(bucket="kyc-documents", key="user_1/cedula.pdf")
    S3-->>API: URL / Storage Key confirmada
    API->>DB: INSERT / UPDATE kyc_documentos_usuario (estado="pendiente", storage_path)
    DB-->>API: Registro persistido
    API-->>FE: HTTP 200 OK {message: "Documento recibido para verificación"}
    FE-->>PDS: Badge cambia a amarillo "En Revisión"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO C: VALIDACIÓN TELEFÓNICA OTP SMS (SOLICITANTE)
    %% ---------------------------------------------------------
    rect rgb(236, 253, 245)
    note right of SOL: SUBFLUJO C: Verificación Telefónica OTP SMS
    SOL->>FE: En /solicitante/perfil hace clic en "Verificar número"
    FE->>API: POST /api/v1/auth/otp/send {telefono: "+573001234567"}
    API->>API: Genera código criptográfico de 6 dígitos (TTL 5 min)
    API->>SMS: Despacha SMS con código OTP
    SMS-->>SOL: Mensaje SMS recibido en teléfono móvil
    API-->>FE: HTTP 200 OK {message: "Código enviado"}
    FE-->>SOL: Despliega modal de ingreso de 6 dígitos
    SOL->>FE: Digita código OTP recibido
    FE->>API: POST /api/v1/auth/otp/verify {code: "123456"}
    API->>DB: UPDATE users SET telefono_verificado = true WHERE id = ?
    DB-->>API: commit() exitoso
    API-->>FE: HTTP 200 OK {verificado: true}
    FE-->>SOL: Badge verde "Teléfono Verificado"
    end

    %% ---------------------------------------------------------
    %% SUBFLUJO D: APROBACIÓN ADMINISTRATIVA Y RECÁLCULO KYC
    %% ---------------------------------------------------------
    rect rgb(245, 243, 255)
    note right of VER: SUBFLUJO D: Moderación KYC y Recálculo Automático
    VER->>API: GET /api/v1/kyc/pendientes (Header: Bearer JWT Admin)
    API->>DB: SELECT * FROM kyc_documentos_usuario WHERE estado = 'pendiente'
    DB-->>API: Lista de expedientes por dictaminar
    API-->>VER: Muestra expediente de PDS con vista previa de MinIO
    VER->>API: POST /api/v1/kyc/documentos/{id}/verificar {estado: "aprobado"}
    API->>DB: UPDATE kyc_documentos_usuario SET estado = 'aprobado' WHERE id = ?
    API->>API: _recalcular_verificado(user, profile)
    API->>DB: Comprueba si todos los obligatorios del rol están aprobados
    DB-->>API: Todos aprobados = True
    API->>DB: UPDATE profiles SET verificado = true WHERE user_id = ?
    DB-->>API: commit()
    API-->>VER: HTTP 200 OK {verificado: true, estado: "aprobado"}
    end
```

---

## 2. Descripción Técnica y Contratos de Datos

### Puntos de Decisión y Reglas de Negocio
1. **Catálogo Normativo por Rol (`DocumentoRequerido`):** La API desacopla los requisitos por tipo de actor (`pds`, `solicitante`, `merchant`). Un trabajador requiere Cédula y antecedentes; un comercio requiere RUT y Cámara de Comercio.
2. **Documentos Multi-Instancia:** Habilidades técnicas o cuentas bancarias aceptan múltiples ejemplares diferenciados por la columna `instancia` (`kyc_documentos.instancia`).
3. **Recálculo Atómico de Verificación (`_recalcular_verificado`):** `Profile.verificado` nunca se edita manualmente. Se calcula como la conjunción lógica estricta (`AND`) de que cada documento marcado como `obligatorio=True` en `DocumentoRequerido` cuente con al menos un registro en estado `'aprobado'`.
4. **Almacenamiento Desacoplado de Evidencias:** Los binarios pesados residen en MinIO S3 bajo nombres canónicos seudonimizados; la base de datos relacional almacena únicamente la ruta, metadatos MIME, hash y estado del ciclo de vida.
