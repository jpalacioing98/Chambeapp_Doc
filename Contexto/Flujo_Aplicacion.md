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
- **Creación**: Solicitante crea y publica solicitudes con geocercas configurables
- **Notificación**: Sistema notifica a PDS mediante algoritmo de recomendaciones 2-stage
- **Algoritmo**: Debe ser justo, transparente, equitativo y balancear cargas
- **Geofence**: Solicitante puede establecer `radio_km` (1-20 km, default 5) mediante GeofencePicker/GeofenceMap (Mapbox)
- **Notificaciones**: Enviadas mediante cascada geoespacial (2km→5km→15km) con delays 300/600/900s

#### Flujo Principal
1. Solicitante accede a "Publicar Servicio"
2. Selecciona categoría, describe el servicio, fija ubicación y presupuesto
3. Define radio_km vía GeofenceMap/GeofencePicker (Mapbox) — default 5 km
4. Sistema valida y publica la solicitud
5. Motor de recomendaciones 2-stage: retrieval geoespacial (PostGIS/Haversine top_k=50) → ranking LightGBM Lambdarank
6. Sistema envía notificaciones a PDS seleccionados mediante cascada geoespacial (2km→5km→15km)

#### Flujo Alternativo
- Si no hay PDS compatibles, sistema muestra "sin coincidencias"
- Si ubicación fuera de cobertura, sistema advierte
- Fallback a HeuristicRecommender si el pipeline ML falla

#### Requerimientos Relacionados
- **RF-04**: Publicación de Servicios por Solicitante
- **RF-05**: Motor de Match / Recomendación (IA)

---

### **PUNTO 3: GESTIÓN DE SERVICIOS (PDS)**

#### Descripción del Flujo
- **Recepción**: PDS recibe notificación en tiempo real vía Socket.IO (no polling) de nueva solicitud
- **Oferta**: PDS hace oferta sobre el servicio
- **Protección**: No se muestran datos sensibles (ubicación, teléfono) hasta confirmación
- **Información**: Solo información técnica del servicio
- **Perfil PDS**: Muestra Trust Score (0-100) con badges por dimensiones (KYC, rating, contratos, portfolio, referidos)

#### Flujo Principal
1. PDS recibe notificación `oferta:nueva` o `notificacion:nueva` vía Socket.IO en sala `user:<id>` (entregado <1s via Redis message_queue)
2. Revisa detalles técnicos y Trust Score del proveedor en su perfil
3. Envía oferta con su propuesta (precio, tiempo, descripción)
4. Sistema almacena oferta y notifica al solicitante
5. Solicitante revisa ofertas y selecciona o negocia

#### Flujo Alternativo
- Si PDS no está interesado, puede ignorar la notificación
- Si PDS modifica oferta, sistema reemplaza la anterior
- Si no hay ofertas, solicitante ve "sin ofertas recibidas"

#### Requerimientos Relacionados
- **RF-05**: Motor de Match / Recomendación (IA)
- **RF-16**: Comunicación y Notificaciones en Tiempo Real
- **RF-Trust-1**: Score de Confianza 0-100 con 5 dimensiones
- **RF-Trust-2**: Sistema de Badges conectado al perfil

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

## Modelo de Recomendación ML

**Motor de recomendación híbrido 2-stage** para emparejar solicitantes con PDS compatibles.

### Pipeline de two-stage:

```
Solicitud → get_recommender() → HybridRecommender
  1. Retrieval: find_nearby_providers(lat, lng, 15km, top_k=50) [PostGIS/Haversine]
  2. Feature Extraction: FeatureExtractor.extract_batch() [22 features]
  3. ML Ranking: MLRanker.predict(X) [LightGBM Lambdarank]
  4. Results: [{pds_id, nombre, score, ranking, explicacion, features, model_version}]
  5. Fallback: HeuristicRecommender si ML falla o ml_ranking_enabled=false
```

### ASCII Diagram:

```
Solicitud ──▶ [Retrieval Geoespacial top_k=50]
               │              Haversine/PostGIS
               ▼
          FeatureExtractor (22 features)
               │
               ▼
          MLRanker (LightGBM Lambdarank)
               │
               ▼
          Results with score & explicacion
               │
   ┌───────────┼─────────────┐
   ▼           ▼           ▼
Heuristic    Fallback    A/B Test
Recommender   disabled    (ABTest group)
```

### A/B Testing y Thompson Bandit:

- `ABTest.get_group(user_id)` → Asigna grupo 'A' o 'B' deterministicemente por usuario
- `ABTest.log_recommendation()` → Registra cada recomendación para análisis posterior
- `ABTest.get_metrics()` → Métricas por grupo: total, avg_score, tasa_aceptación
- Cableado en ambos endpoints de `app/routes/ai.py`
- `ThompsonBandit` para rotación inteligente de categorías sobre aciertos/fallos

**Feature Flags:** `ml_ranking_enabled`, `ml_shadow_mode`

---

## Sistema de Confianza (Trust Score + Badges)

**Score consolidado 0-100** con 5 dimensiones y niveles asociados.

### 5 Dimensiones:

| Dimensión | Peso | Descripción |
|-----------|------|-------------|
| **KYC** | 20% | Verificación de identidad y documentos |
| **Rating** | 25% | Calificación promedio de servicios completados |
| **Contratos** | 20% | Número de contratos finalizados exitosamente |
| **Portfolio** | 15% | Calidad y variedad del portafolio multimedia |
| **Referidos** | 20% | Usuarios traídos a la plataforma |

### Niveles y Rangos:

| Nivel | Rango | Color | Badge |
|-------|-------|-------|-------|
| **Experto** | 80-100 | Verde `#2ecc71` | 🥇 |
| **Verificado** | 60-79 | Coral `#ff5a5f` | 🥈 |
| **Confiable** | 40-59 | Coral `#ff7a7e` | 🥉 |
| **Nuevo** | 0-39 | Gris `#807e7a` | 🌱 |

### Badges Conectados:

- **Badge "KYC Completa"**: Cuando KYC ≥ 80% y documentos aprobados
- **Badge "Rating Alto"**: Cuando rating promedio ≥ 4.5/5
- **Badge "Contratos Consistentes"**: Cuando contratos completados ≥ 10
- **Badge "Portafolio Diverso"**: Cuando portfolio tiene ≥ 3 categorías distintas
- **Badge "Embajador"**: Cuando referidos activos ≥ 5

El Trust Score y badges se muestran en el perfil PDS vía `GET /api/v1/trust/{pds_id}` y `GET /api/v1/users/me`.

---

## Portafolio Multimedia y Visor 360°

**Sistema de portafolio enriquecido** con upload drag-and-drop y visor interactivo.

### PortfolioUploader:

- **Arrastrar y soltar** (drag-and-drop) archivos a MinIO
- **Formatos soportados**: WebP, JPEG, PNG, MP4, MOV
- **Validación**: Tipo MIME y tamaño máximo 50MB
- **URLs firmadas** para acceso público temporal
- Integrado en `src/features/profile/ProfilePage.tsx`

### PortfolioGallery:

- **Grid responsive** de items del portafolio
- **Miniaturas con hover** para vista previa
- **Acciones**: Ver detalles, eliminar, marcar como favorito
- Conectado a `GET /api/v1/portfolio/items` y `POST /api/v1/portfolio/upload`

### Viewer360 (A-Frame):

- **Visor panorámico** en perfil de proveedor y en solicitudes
- **A-Frame** con entidad `<a-scene>` y `<a-sky>` o `<a-cube>`
- Navegación: flechas direccionales o control mouse-arrastrar
- Mostrado en `src/features/profile/ProfilePage.tsx` y `src/features/solicitudes/SolicitudDetailPage.tsx`
- Soporte para imágenes equirectangulares y videos 360°

---

## Notificaciones en Tiempo Real (Socket.IO)

**Cascada de notificaciones** en tiempo real vía Socket.IO con Redis message_queue.

### CascadeManager:

- **Fase 1**: Radio 2km, delay 300s, max 5 candidatos
- **Fase 2**: Radio 5km, delay 600s, max 10 candidatos
- **Fase 3**: Radio 15km, delay 900s, max 15 candidatos
- Configuración por defecto en `DEFAULT_CONFIG`

### Flujo de emisión:

```
CascadeManager.send_phase()
  │
  ▼
Crear Notification (DB)
  │
  ▼
socketio.emit('notificacion:nueva', notif.to_dict(), room=f'user:{notif.user_id}')
  │
  ▼
Redis message_queue → servidor Flask → sala user:<id>
  │
  ▼
Cliente useNotificationSocket → store update → NotificationBell
```

### Tiempo total: <1s (Cascada Celery → DB → Redis → Flask → Cliente)

### Eventos Socket.IO adicionales:

- **`message`** — Chat en tiempo real (room: conversation_{id})
- **`oferta:nueva`** — Notificación de nueva oferta (room: user:{pds_id})
- **`oferta:actualizada`** — Notificación de oferta modificada
- **`join`** — Cliente se une a sala `user:<id>` tras validar JWT

### Cliente (`useNotificationSocket`):

- Suscribe al evento `notificacion:nueva` vía Socket.IO compartido
- Al recibir, llama `addNotification(notif)` y `incrementUnread()`
- **No usa polling** — todo push por WS
- `NotificationBell` muestra badge de no leídas en tiempo real
- Almacenamiento en `useNotificationsStore` (Zustand)

---

*Sección añadida en enriquecimiento del Flujo de Aplicación v2.1*

*Documento generado automáticamente por el coordinador AUP*
*Proyecto: ChambeApp - Plataforma de Servicios Ocasionales*
*Revisión: 2.0 - Nuevo Modelo con Billetera Virtual*
*Fecha: 01/09/2026*
