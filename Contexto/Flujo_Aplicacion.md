# Flujo de la Aplicación — ChambeApp (v2.0)

> Descripción detallada del flujo completo de la aplicación, desde el registro hasta la finalización del servicio, incluyendo el nuevo modelo de billetera virtual y modalidades de cobro.
> Este documento complementa los requerimientos funcionales y describe la experiencia del usuario paso a paso.

---

## 1. Visión General del Flujo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO PRINCIPAL CHAMBEAPP                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   REGISTRO   │───▶│  SOLICITUD   │───▶│  OFERTAS     │                  │
│  │   LOGIN      │    │  DE SERVICIO │    │  DE PDS      │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│         │                    │                    │                          │
│         ▼                    ▼                    ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   KYC        │    │ NOTIFICACIÓN │    │  CONFIRMACIÓN│                  │
│  │   (PDS/Sol)  │    │   ALGORITMO  │    │  SOLICITANTE │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                   │                          │
│                                                   ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  DESBLOQUEO  │◀───│   CHAT       │◀───│  NEGOCIACIÓN │                  │
│  │  UBICACIÓN   │    │  DISPONIBLE  │    │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│         │                                                                           │
│         ▼                                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   INICIO     │───▶│  DURANTE     │───▶│ FINALIZACIÓN │                  │
│  │   SERVICIO   │    │  SERVICIO    │    │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                   │                          │
│                                                   ▼                          │
│                                            ┌──────────────┐                  │
│                                            │  PAGOS Y     │                  │
│                                            │  RESEÑAS     │                  │
│                                            └──────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detalle por Cada Punto del Flujo

### **PUNTO 1: LOGIN Y REGISTRO**

#### Descripción del Flujo
- **Registro básico**: Acceso rápido con número de cédula y datos básicos
- **Registro completo**: Subir documentación (desde registro inicial o posteriormente)
- **Diferenciación PDS vs Solicitante**: PDS requiere más requisitos y documentos

#### Flujo Principal
1. Usuario abre la PWA y selecciona "Registrarse"
2. Selecciona rol: Proveedor o Solicitante
3. Ingresa número de cédula, nombre, teléfono, contraseña
4. Sistema valida y crea cuenta → perfil en estado "No verificado"
5. Puede completar documentación inmediatamente o después

#### Flujo Alternativo
- Si el usuario ya tiene cuenta, puede iniciar sesión con cédula/contraseña
- Si el usuario no acepta T&C, se bloquea la creación de cuenta

#### Requerimientos Relacionados
- **RF-01**: Registro y Autenticación Segmentada
- **RF-12**: Verificación de Identidad

---

### **PUNTO 2: SOLICITUDES DE SERVICIO**

#### Descripción del Flujo
- **Creación**: Solicitante crea y publica solicitudes
- **Notificación**: Sistema notifica a PDS mediante algoritmo de recomendaciones
- **Algoritmo**: Debe ser justo, transparente, equitativo y balancear cargas

#### Flujo Principal
1. Solicitante accede a "Publicar Servicio"
2. Selecciona categoría, describe el servicio, fija ubicación y presupuesto
3. Sistema valida y publica la solicitud
4. Algoritmo de recomendaciones selecciona PDS compatibles
5. Sistema envía notificaciones a PDS seleccionados

#### Flujo Alternativo
- Si no hay PDS compatibles, sistema muestra "sin coincidencias"
- Si ubicación fuera de cobertura, sistema advierte

#### Requerimientos Relacionados
- **RF-04**: Publicación de Servicios por Solicitante
- **RF-05**: Motor de Match / Recomendación (IA)

---

### **PUNTO 3: GESTIÓN DE SERVICIOS (PDS)**

#### Descripción del Flujo
- **Recepción**: PDS recibe notificación de nueva solicitud
- **Oferta**: PDS hace oferta sobre el servicio
- **Protección**: No se muestran datos sensibles (ubicación, teléfono)
- **Información**: Solo información técnica del servicio

#### Flujo Principal
1. PDS recibe notificación de nueva solicitud
2. Revisa detalles técnicos (categoría, descripción, presupuesto)
3. Envía oferta con su propuesta (precio, tiempo, descripción)
4. Sistema almacena oferta y notifica al solicitante

#### Flujo Alternativo
- Si PDS no está interesado, puede ignorar la notificación
- Si PDS modifica oferta, sistema reemplaza la anterior

#### Requerimientos Relacionados
- **RF-05**: Motor de Match / Recomendación (IA)
- **RF-16**: Comunicación y Notificaciones en Tiempo Real

---

### **PUNTO 4: CONFIRMACIÓN DEL SERVICIO**

#### Descripción del Flujo
- **Selección**: Solicitante selecciona una oferta
- **Negociación**: Chat disponible para negociar o aceptar directamente
- **Rechazo**: Si no se confirma, vuelve atrás y relanza notificaciones
- **Revisión**: Solicitante puede revisar ofertas anteriores

#### Flujo Principal
1. Solicitante revisa ofertas recibidas
2. Selecciona una oferta para negociar o aceptar directamente
3. Si acepta directamente, se procede al paso 5
4. Si negocia, abre chat con el PDS
5. Tras acuerdo, solicitante confirma el servicio

#### Flujo Alternativo
- Si solicitante rechaza todas las ofertas, sistema relanza notificaciones
- Si no hay acuerdo en negociación, solicitante puede descartar y relanzar

#### Requerimientos Relacionados
- **RF-07**: Gestión Contractual y Órdenes de Trabajo
- **RF-16**: Comunicación y Notificaciones en Tiempo Real

---

### **PUNTO 5: DESBLOQUEO DE INFORMACIÓN**

#### Descripción del Flujo
- **Condición**: Solo después de que solicitante acepta o confirma negociación
- **Desbloqueo**: Ubicación y chat se desbloquean para el PDS
- **Protección**: Datos sensibles se mantienen ocultos hasta confirmación

#### Flujo Principal
1. Solicitante confirma el servicio
2. Sistema desbloquea ubicación y chat para el PDS
3. PDS puede ver ubicación y contactar al solicitante
4. Chat queda habilitado para comunicación directa

#### Flujo Alternativo
- Si solicitante cancela antes del desbloqueo, información permanece oculta
- Si PDS no responde en 24h, solicitante puede rechazar y relanzar

#### Requerimientos Relacionados
- **RF-07**: Gestión Contractual y Órdenes de Trabajo
- **RF-16**: Comunicación y Notificaciones en Tiempo Real

---

### **PUNTO 6: INICIO DEL SERVICIO**

#### Descripción del Flujo
- **Inicio**: Servicio comienza después de confirmación
- **Estados**: Se actualizan estados del servicio durante la ejecución
- **Anotaciones**: Espacio compartido para observaciones entre solicitante y PDS

#### Flujo Principal
1. PDS llega al lugar y confirma inicio
2. Sistema cambia estado a "En progreso"
3. Ambas partes pueden agregar anotaciones observaciones
4. Se actualiza estado según avance del servicio

#### Flujo Alternativo
- Si PDS no se presenta, solicitante puede reportar "no-show"
- Si hay problemas, ambas partes pueden abrir disputa

#### Requerimientos Relacionados
- **RF-07**: Gestión Contractual y Órdenes de Trabajo

---

### **PUNTO 7: FINALIZACIÓN DEL SERVICIO**

#### Descripción del Flujo
- **Entrega**: Servicio se entrega y concluye
- **Confirmación**: Ambas partes confirman finalización
- **Reseñas**: Calificaciones y reseñas mutuas
- **Pagos**: Pago a través de la plataforma según modelo de monetización

#### Flujo Principal
1. PDS marca servicio como "Completado"
2. Solicitante confirma recepción y satisfacción
3. Ambas partes califican y reseñan
4. Sistema procesa pago (MercadoPago/PSE)
5. Se retienen comisiones (12% PDS + 8% solicitante)
6. Monto neto se libera al PDS
7. Flujo se finaliza

#### Flujo Alternativo
- Si solicitante no confirma en 48h, sistema libera fondos automáticamente
- Si hay disputa, sistema congela fondos y abre proceso de mediación
- Si servicio es defectuoso, solicitante puede reportar y iniciar disputa

#### Requerimientos Relacionados
- **RF-07**: Gestión Contractual y Órdenes de Trabajo
- **RF-08**: Pasarela de Pagos e Ingresos
- **RF-15**: Comisiones por Transacción

---

## 3. Modelo de Desbloqueo de Información

### **3.1 Datos Sensibles (Bloqueados)**

| Tipo de Dato | Descripción | Condición de Desbloqueo |
|--------------|-------------|-------------------------|
| **Ubicación exacta** | Dirección del servicio | Confirmación del servicio |
| **Chat directo** | Comunicación PDS-Solicitante | Confirmación del servicio |
| **Teléfono** | Número de contacto | No se desbloquea (solo chat) |

### **3.2 Datos Técnicos (Siempre Visibles)**

| Tipo de Dato | Descripción |
|--------------|-------------|
| **Categoría** | Tipo de servicio (plomería, jardinería, etc.) |
| **Descripción** | Detalles del trabajo a realizar |
| **Presupuesto** | Valor offered o "a convenir" |
| **Fecha estimada** | Cuándo se necesita el servicio |

### **3.3 Flujo de Desbloqueo**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  SOLICITUD      │    │  OFERTA         │    │  CONFIRMACIÓN   │
│  PUBLICADA      │───▶│  ENVIADA        │───▶│  DEL SERVICIO   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  SERVICIO       │◀───│  CHAT           │◀───│  DESBLOQUEO     │
│  EN PROGRESO    │    │  HABILITADO     │    │  UBICACIÓN      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 4. Modelo de Confirmación Dual

### **4.1 Estados de Confirmación**

| Estado | Solicitante | PDS | Acción |
|--------|-------------|-----|--------|
| **Pendiente** | Pendiente | Pendiente | Esperando confirmación |
| **Confirmado** | Confirmado | Pendiente | Solicitante confirmó |
| **Confirmado** | Pendiente | Confirmado | PDS confirmó |
| **Completado** | Confirmado | Confirmado | Ambos confirmaron |

### **4.2 Flujo de Confirmación**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  SERVICIO       │    │  SOLICITANTE    │    │  PDS            │
│  COMPLETADO     │───▶│  CONFIRMA       │───▶│  CONFIRMA       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  PAGO           │◀───│  RESEÑAS        │◀───│  FLUJO          │
│  PROCESADO      │    │  MUTUAS         │    │  FINALIZADO     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 5. Modelo de Ofertas

### **5.1 Estados de Oferta**

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | Oferta enviada, esperando respuesta |
| **Aceptada** | Solicitante aceptó la oferta |
| **Rechazada** | Solicitante rechazó la oferta |
| **Negociando** | En proceso de negociación via chat |
| **Expirada** | Oferta reemplazada por nueva versión |

### **5.2 Reglas de Ofertas**

1. **Sin límite de tiempo**: Las ofertas no expiran automáticamente
2. **Reemplazo**: Si PDS modifica oferta, se reemplaza la anterior
3. **Rechazo**: Si solicitante rechaza, PDS puede enviar nueva oferta
4. **Cancelación**: Si solicitante cancela solicitud, todas las ofertas se invalidan

---

## 6. Modelo de Pagos (Billetera Virtual)

### **6.1 Concepto de Billetera Virtual**

Cada usuario tiene una **billetera virtual** donde:
- Recibe saldos por servicios completados
- Paga comisiones (si aplica)
- Gestiona monedas internas
- Solicita retiros a cuenta bancaria

### **6.2 Modalidades de Cobro**

| Modalidad | Publicar | Ofertar | Comisión Final |
|-----------|----------|---------|----------------|
| **A: Con Comisión** | Gratis | Gratis | 12% del servicio |
| **B: Sin Comisión** | Gratis | Pago monedas | 0% |

### **6.3 Flujo de Pagos con Billetera**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE PAGOS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  SOLICITANTE │    │   SISTEMA    │    │     PDS      │      │
│  │  PUBLICA     │───▶│  VERIFICA    │───▶│  OFERTA      │      │
│  │  (modalidad) │    │  MODALIDAD   │    │              │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  SI "SIN     │    │  DESCUENTA   │    │  SERVICIO    │      │
│  │  COMISIÓN"   │───▶│  MONEDAS     │───▶│  COMPLETADO  │      │
│  │  → monedas   │    │  (si aplica) │    │              │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  CONFIRMA    │    │  LIQUIDACIÓN │    │  RECIBE      │      │
│  │  SERVICIO    │───▶│  COMISIÓN    │───▶│  SALDO NETO  │      │
│  │              │    │  (si aplica) │    │  BILLETERA   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **6.4 Reglas de Comisión**

| Condición | Comisión |
|-----------|----------|
| Servicio < $50.000 | 0% (exento) |
| Servicio ≥ $50.000 | 12% del PDS |
| Modalidad "Sin Comisión" | 0% |
| Descuento volumen | 5-15% según servicios/mes |

### **6.5 Retiros de Billetera**

| Método | Tiempo | Costo |
|--------|--------|-------|
| Nequi | Instantáneo | 1.5% + $500 |
| PSE | 1-2 días hábiles | 1.99% + $500 |
| Efectivo | 3 días hábiles | $1.000 |

---

## 7. Matriz de Coexistencia (Modalidades Diferentes)

Cuando solicitante y PDS tienen preferencias distintas:

### **7.1 Regla: Predominio del Creador**

> La modalidad la determina **el solicitante al publicar**.

| Solicitante Publica | Puede Ofertar Con | Puede Ofertar Sin |
|--------------------|-------------------|-------------------|
| "Con Comisión" | ✓ (gratis) | ✗ |
| "Sin Comisión" | ✓ (paga comisión) | ✓ (paga monedas) |

### **7.2 Filtro de Preferencia PDS**

El PDS puede filtrar en su feed:
- **Todas**: Muestra ambos tipos
- **Solo Con Comisión**: Sin costo de monedas
- **Solo Sin Comisión**: 0% comisión

### **7.3 Notificación de Transición**

Si PDS configurado "Sin Comisión" ve publicación "Con Comisión":

> ⚠️ **"Esta solicitud aplica comisión al finalizar la labor. No se descontarán monedas de publicación."**

---

## 8. Herramientas Complementarias

### **8.1 Precios Sugeridos**

Sistema asistente que muestra precios promedio por categoría:

| Categoría | Mínimo | Promedio | Máximo |
|-----------|--------|----------|--------|
| Plomería | $30.000 | $75.000 | $150.000 |
| Electricidad | $25.000 | $60.000 | $120.000 |
| Jardinería | $20.000 | $50.000 | $100.000 |

### **8.2 Hitos de Pago (Milestones)**

Para contratos largos (mensuales, quincenales):

```
Contrato: $400.000 mensuales
  → Semana 1: $100.000 (aprobado → liquidado)
  → Semana 2: $100.000 (aprobado → liquidado)
  → Semana 3: $100.000 (pendiente)
  → Semana 4: $100.000 (pendiente)
```

### **8.3 Dashboard del PDS**

| Métrica | Descripción |
|---------|-------------|
| Saldo disponible | Para retiro |
| Ingresos del mes | Total ganado |
| Comisiones pagadas | Total descontado |
| Historial | Detalle transacciones |

---

## 9. Requerimientos Adicionales

### **9.1 RF-25: Sistema de Billetera Virtual**

**Historia de Usuario:** Como usuario, quiero tener una billetera virtual para recibir y pagar servicios.

**Criterios de Aceptación:**
1. WHEN usuario se registra THEN sistema SHALL crear billetera con saldo 0
2. WHEN PDS completa servicio THEN sistema SHALL descontar comisión de billetera
3. WHEN usuario solicita retiro THEN sistema SHALL transferir a cuenta bancaria
4. WHEN saldo insuficiente THEN sistema SHALL bloquear operaciones

### **9.2 RF-26: Modalidad de Cobro**

**Historia de Usuario:** Como solicitante, quiero elegir la modalidad de cobro al publicar.

**Criterios de Aceptación:**
1. WHEN solicitante publica THEN sistema SHALL ofrecer elegir modalidad
2. WHEN elige "Sin Comisión" THEN sistema SHALL requerir monedas
3. WHEN publica "Con Comisión" THEN sistema SHALL marcar solicitud

### **9.3 RF-27: Sistema de Monedas**

**Historia de Usuario:** Como usuario, quiero comprar monedas para usar en pagos.

**Criterios de Aceptación:**
1. WHEN usuario compra monedas THEN sistema SHALL procesar pago
2. WHEN usuario usa monedas THEN sistema SHALL descontar
3. WHEN monedas son promocionales THEN sistema SHALL marcar no reembolsables

### **9.4 RF-28: Precios Sugeridos**

**Historia de Usuario:** Como solicitante, quiero ver precios sugeridos para mi solicitud.

**Criterios de Aceptación:**
1. WHEN solicitante crea solicitud THEN sistema SHALL mostrar precio promedio
2. WHEN tiene categoría THEN sistema SHALL sugerir rango
3. WHEN precio es bajo THEN sistema SHALL advertir subcotización

### **9.5 RF-29: Hitos de Pago**

**Historia de Usuario:** Como usuario, quiero dividir el pago en hitos para servicios largos.

**Criterios de Aceptación:**
1. WHEN contrato es largo THEN sistema SHALL habilitar hitos
2. WHEN solicitante aprueba entrega THEN sistema SHALL liberar pago parcial
3. WHEN hito se aprueba THEN sistema SHALL descontar comisión proporcional

### **9.6 RF-30: Dashboard Operativo**

**Historia de Usuario:** Como PDS, quiero ver mi historial de cobros y comisiones.

**Criterios de Aceptación:**
1. WHEN PDS accede THEN sistema SHALL mostrar historial
2. WHEN filtra periodo THEN sistema SHALL mostrar cobros del rango
3. WHEN solicita reporte THEN sistema SHALL generar PDF

---

## 10. Requerimientos Faltantes Originales (Gaps Críticos)

### **10.1 RF-22: Sistema de Desbloqueo de Información**

**Historia de Usuario:** Como PDS, quiero ver la ubicación y contactar al solicitante solo después de que el servicio sea confirmado, para proteger datos sensibles.

**Criterios de Aceptación:**
1. WHEN solicitante confirma servicio THEN sistema SHALL desbloquear ubicación y chat para PDS
2. IF servicio no confirmado THEN sistema SHALL mantener datos sensibles ocultos
3. WHEN servicio cancelado THEN sistema SHALL mantener datos bloqueados
4. WHEN PDS accede a solicitud THEN sistema SHALL mostrar solo información técnica

### **10.2 RF-23: Confirmación Dual de Finalización**

**Historia de Usuario:** Como usuario, quiero confirmar la finalización del servicio para que se procese el pago y se califique.

**Criterios de Aceptación:**
1. WHEN PDS marca servicio como completado THEN sistema SHALL solicitar confirmación al solicitante
2. WHEN solicitante confirma THEN sistema SHALL cambiar estado a "Completado"
3. IF solicitante no confirma en 48h THEN sistema SHALL liberar fondos automáticamente
4. WHEN ambas partes confirman THEN sistema SHALL habilitar calificaciones y pagos

### **10.3 RF-24: Gestión de Ofertas**

**Historia de Usuario:** Como PDS, quiero poder enviar, modificar y rechazar ofertas para gestionar mis postulaciones.

**Criterios de Aceptación:**
1. WHEN PDS envía oferta THEN sistema SHALL almacenar y notificar al solicitante
2. WHEN PDS modifica oferta THEN sistema SHALL reemplazar la anterior
3. WHEN solicitante rechaza oferta THEN sistema SHALL notificar al PDS
4. IF solicitante cancela solicitud THEN sistema SHALL invalidar todas las ofertas

---

## 11. Próximos Pasos

### **11.1 Inmediatos (1-2 semanas)**
1. Actualizar documentos de requerimientos con nuevos RFs
2. Actualizar historias de usuario con nuevos flujos
3. Crear diagramas de flujo UML/PlantUML
4. Diseñar modelos de datos para desbloqueo y confirmación

### **11.2 Corto Plazo (1 mes)**
1. Implementar endpoints de desbloqueo
2. Implementar confirmación dual
3. Implementar gestión de ofertas
4. Integrar chat en flujo de negociación

### **11.3 Mediano Plazo (2-3 meses)**
1. Implementar billetera virtual
2. Implementar sistema de monedas
3. Implementar modalidades de cobro
4. Crear dashboard operativo PDS

---

*Documento generado automáticamente por el coordinador AUP*
*Proyecto: ChambeApp - Plataforma de Servicios Ocasionales*
*Revisión: 2.0 - Nuevo Modelo con Billetera Virtual*
*Fecha: 01/09/2026*
