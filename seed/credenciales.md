# Usuarios de prueba (Seed) — ChambeApp

| Rol | Email | Password | Descripción/uso |
|---|---|---|---|
| trabajador / proveedor | trabajador@chambeapp.com | ChambeApp123! | Acceso al panel de trabajador, visualización de sugerencias de servicio y creación de órdenes |
| empleador / solicitante | empleador@chambeapp.com | ChambeApp123! | Acceso al panel de empleador, publicación de servicios y gestión de órdenes |
| verificador | verificador@chambeapp.com | ChambeApp123! | Valida y aprueba órdenes, confirma cumplimiento de requisitos |
| soporte | soporte@chambeapp.com | ChambeApp123! | Atiende incidencias, restablece accesos y soporte general |
| admin | admin@chambeapp.com | ChambeApp123! | Permisos de administración general, gestión de usuarios y configuración |
| superadmin | superadmin@chambeapp.com | ChambeApp123! | Máximo nivel de permisos, administración del sistema y todos los recursos |

**Nota:** Son usuarios demo para desarrollo/local. **CAMBIAR passwords y no usar en producción.** El script `seed.py` los crea idempotentemente.

**Cómo usar:** Ejecutar `python seed.py` en el backend tras instalar dependencias. Esto crea las tablas y los usuarios de prueba de forma idempotente.