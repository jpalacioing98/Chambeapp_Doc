# Usuarios de prueba (Seed) — ChambeApp

| Rol | Email | Password | Descripción/uso |
|---|---|---|---|
| pds / proveedor | pds@chambeapp.com | ChambeApp123! | Acceso al panel de pds, visualización de sugerencias de solicitud y creación de órdenes |
| solicitante | solicitante@chambeapp.com | ChambeApp123! | Acceso al panel de solicitante, creación de solicitudes y gestión de órdenes |
| merchant | merchant@chambeapp.com | ChambeApp123! | Módulo Negocios: crea y gestiona su negocio (directorio de comercios) |
| verificador | verificador@chambeapp.com | ChambeApp123! | Valida y aprueba órdenes, confirma cumplimiento de requisitos |
| soporte | soporte@chambeapp.com | ChambeApp123! | Atiende incidencias, restablece accesos y soporte general |
| admin | admin@chambeapp.com | ChambeApp123! | Permisos de administración general, gestión de usuarios y configuración |
| superadmin | superadmin@chambeapp.com | ChambeApp123! | Máximo nivel de permisos, administración del sistema y todos los recursos |

Todos los usuarios semilla quedan asignados a la **Región Caribe** (Valledupar/Cesar, `region_id=1`).

**Nota:** Son usuarios demo para desarrollo/local. **CAMBIAR passwords y no usar en producción.** El script `seed.py` los crea idempotentemente.

**Cómo usar:** Ejecutar `python seed.py` en el backend tras instalar dependencias. Esto crea las tablas y los usuarios de prueba de forma idempotente.