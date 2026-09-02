# Modelo de Monetización - ChambeApp

## 1. Resumen Ejecutivo

ChambeApp es una plataforma digital para la contratación de servicios laborales ocasionales en Valledupar, Colombia, diseñada para conectar proveedores de servicios con solicitantes mediante tecnología inteligente (IA y visualización 3D). El objetivo principal es reducir la informalidad laboral (55%+) ofreciendo herramientas de trazabilidad de ingresos y formalización progresiva.

Este documento presenta un **modelo de monetización con billetera virtual** que combina comisiones por transacción, sistema de monedas y servicios de valor agregado para garantizar sostenibilidad financiera mientras se mantiene accesible para el mercado objetivo (trabajadores informales).

---

## 2. Filosofía del Modelo

Dado que el mercado objetivo son trabajadores informales con ingresos variables y sensibles a precios, el modelo de monetización debe:

1. **Minimizar la fricción** para incentivar adopción inicial
2. **Diversificar fuentes de ingresos** para reducir dependencia de una sola
3. **Ofrecer valor agregado** que justifique el pago
4. **Escalar con el crecimiento** de la plataforma

### 2.1 Principios Clave

| Principio | Descripción |
|-----------|-------------|
| **Sin fricción de entrada** | Publicar y ofertar son gratuitos por defecto |
| **Comisión solo al éxito** | Solo se cobra cuando el servicio se completa |
| **Precios en pesos** | Nunca mostrar porcentajes, siempre montos netos |
| **Transparencia total** | El usuario siempre sabe cuánto recibirá |

---

## 3. Billetera Virtual

### 3.1 Concepto

La billetera virtual es el corazón del sistema de pagos. Cada usuario tiene una billetera donde recibe saldos, paga comisiones y gestiona monedas internas.

### 3.2 Puntos Críticos de Seguridad

| Punto Crítico | Descripción |
|---------------|-------------|
| **Cifrado de extremo a extremo** | Todos los datos financieros cifrados AES-256 |
| **Cumplimiento PCI-DSS** | Estándares de seguridad para datos de tarjetas |
| **Autenticación multifactor** | Requerida para transacciones financieras |
| **Auditoría completa** | Registro inmutable de todas las operaciones |

### 3.3 Sincronización y Conciliación

| Característica | Descripción |
|----------------|-------------|
| **Saldo en tiempo real** | Actualización instantánea tras cada transacción |
| **Conciliación automática** | Sincronización con pasarelas (Nequi, etc.) |
| **Registro de transacciones** | Historial completo con estados |
| **Reportes de cuadre** | Herramientas para verificar consistencia |

### 3.4 Política Restrictiva de Canje

> **REGLA ESTRICTA:** Las monedas o saldo promocional **NO son reembolsables** en efectivo bajo ningún motivo.

| Escenario | Política |
|-----------|----------|
| Cierre de cuenta | Saldo promocional se pierde |
| Error de compra | No hay reembolso en efectivo |
| Promociones | Monedas ganadas no son canjeables |
| Excepción | Solo saldo depositado por el usuario puede retirarse |

### 3.5 Billetera Simétrica

La billetera tiene **interfaz y funcionalidad idéntica** tanto para solicitantes como para prestadores de servicios (PDS):

| Característica | Solicitante | PDS |
|----------------|-------------|-----|
| Ver saldo | ✓ | ✓ |
| Recibir pagos | ✓ | ✓ |
| Realizar pagos | ✓ | ✓ |
| Historial | ✓ | ✓ |
| Retiros | ✓ | ✓ |

### 3.6 Comisión Directa al Prestador

**Mecanismo de cobro:**

```
┌─────────────────────────────────────────────────────────┐
│              FLUJO DE COMISIÓN                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Servicio completado                                 │
│           ↓                                             │
│  2. Solicitante confirma (o auto-confirmación 48h)      │
│           ↓                                             │
│  3. Sistema calcula comisión                            │
│           ↓                                             │
│  4. Comisión se DESCUENTA de billetera del PDS          │
│           ↓                                             │
│  5. PDS recibe monto neto en su billetera               │
│           ↓                                             │
│  6. PDS puede retirar a cuenta bancaria                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Ventaja tributaria:** La plataforma NO maneja los fondos del servicio principal, solo retiene la comisión. Esto reduce exposición tributaria y legal.

---

## 4. Modalidades de Cobro

### 4.1 Modalidad A: Con Comisión (Predeterminada)

| Etapa | Acción | Costo |
|-------|--------|-------|
| **Publicación** | Solicitante publica solicitud | **$0** |
| **Oferta** | PDS se postula | **$0** |
| **Servicio** | Se realiza el trabajo | **$0** |
| **Liquidación** | Servicio completado | **Comisión del PDS** |

**Ejemplo:**
```
Servicio: Plomería - $100.000 COP
Comisión PDS (12%): $12.000 COP
Solicitante paga: $100.000 COP
PDS recibe: $88.000 COP
Plataforma retiene: $12.000 COP
```

### 4.2 Modalidad B: Sin Comisión

| Etapa | Acción | Costo |
|-------|--------|-------|
| **Publicación** | Solicitante publica solicitud | **$0** |
| **Oferta** | PDS se postula | **Monedas internas** |
| **Servicio** | Se realiza el trabajo | **$0** |
| **Liquidación** | Servicio completado | **$0 de comisión** |

**Ejemplo:**
```
Servicio: Plomería - $100.000 COP
Monedas para ofertar: 50 monedas
Solicitante paga: $100.000 COP
PDS recibe: $100.000 COP (sin descuento)
Plataforma retiene: $0
```

### 4.3 Comparativa de Modalidades

| Aspecto | Modalidad A (Con Comisión) | Modalidad B (Sin Comisión) |
|---------|---------------------------|---------------------------|
| **Publicar** | Gratis | Gratis |
| **Ofertar** | Gratis | Pago con monedas |
| **Comisión final** | 12% del servicio | 0% |
| **Ideal para** | Usuarios ocasionales | Usuarios frecuentes |
| **Ingreso plataforma** | Por transacción | Por venta de monedas |

---

## 5. Matriz de Coexistencia

Cuando el solicitante y el prestador tienen configuraciones de cobro distintas, el sistema resuelve el conflicto bajo las siguientes reglas:

### 5.1 Regla General: Predominio del Creador

> **La modalidad del servicio la determina EL SOLICITANTE al publicar.**

| Escenario | Resultado |
|-----------|-----------|
| Solicitante publica "Con Comisión" | PDS ofertará bajo regla de comisión |
| Solicitante publica "Sin Comisión" | PDS debe pagar monedas para ofertar |

### 5.2 Opción Flex / Filtro de Preferencia

El PDS puede **filtrar en su feed** qué tipo de ofertas desea ver:

| Filtro | Descripción |
|--------|-------------|
| **Todas** | Muestra publicaciones de ambos tipos |
| **Solo Con Comisión** | Solo publicaciones donde no paga monedas |
| **Solo Sin Comisión** | Solo publicaciones donde paga monedas (0% comisión) |

### 5.3 Notificación de Transición

Si un PDS configurado "Sin Comisión" entra a una publicación "Con Comisión", el sistema le notificará:

> ⚠️ **"Esta solicitud aplica comisión al finalizar la labor. No se descontarán monedas de publicación."**

El PDS puede decidir:
- **Aceptar** y ofertar bajo modalidad A
- **Rechazar** y buscar otra publicación

---

## 6. Sistema de Monedas

### 6.1 Tipos de Monedas

| Tipo | Origen | Características |
|------|--------|-----------------|
| **Compradas** | Compra con dinero real | Retirables, sin vencimiento |
| **Promocionales** | Bonificaciones, eventos | No retirables, con vencimiento |
| **Ganadas** | Completar servicios | No retirables, sin vencimiento |

### 6.2 Precios de Monedas

| Paquete | Precio (COP) | Monedas | Bonus |
|---------|--------------|---------|-------|
| Básico | $5.000 | 50 | - |
| Estándar | $15.000 | 150 | +10% |
| Premium | $30.000 | 350 | +17% |

### 6.3 Uso de Monedas

| Acción | Costo en Monedas |
|--------|------------------|
| Ofertar en solicitud "Sin Comisión" | 50 monedas |
| Destacar perfil (1 día) | 20 monedas |
| Enviar mensaje prioritario | 10 monedas |
| Desbloquear chat | 5 monedas |

---

## 7. Reglas de Negocio

### 7.1 Exención para Trabajos Menores

| Valor del Servicio | Comisión |
|-------------------|----------|
| Menor a $50.000 COP | **0%** (exento) |
| $50.000 o más | **12%** PDS |

### 7.2 Descuentos por Volumen

| Servicios completados/mes | Descuento en comisión |
|--------------------------|----------------------|
| 1-5 servicios | 0% |
| 6-10 servicios | 5% |
| 11-20 servicios | 10% |
| +20 servicios | 15% |

### 7.3 Promociones Iniciales

| Período | Beneficio |
|---------|-----------|
| Primeros 3 meses nuevos PDS | 0% comisión |
| Primeros 100 solicitantes | 50 monedas gratis |
| Referidos exitosos | 25 monedas por referido |

---

## 8. Herramientas Complementarias

### 8.1 Sistema de Precios Sugeridos

**Funcionamiento:**

```
┌─────────────────────────────────────────────────────────┐
│              ASISTENTE DE PRECIOS                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Solicitante selecciona categoría: "Plomería"           │
│           ↓                                             │
│  Sistema consulta precios históricos:                   │
│    - Mínimo: $30.000                                    │
│    - Promedio: $75.000                                  │
│    - Máximo: $150.000                                   │
│           ↓                                             │
│  Sugiere: "El precio promedio es $75.000"               │
│           ↓                                             │
│  Si el usuario pone $20.000:                            │
│    ⚠️ "Este precio está muy bajo. Podría afectar        │
│        la calidad del servicio."                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Hitos de Pago (Milestones)

Para **contratos de larga duración** (quincenales, mensuales o por avance):

| Paso | Acción | Sistema |
|------|--------|---------|
| 1 | Solicitante crea hitos | Define entregas parciales |
| 2 | PDS completa un hito | Notifica al solicitante |
| 3 | Solicitante aprueba | Libera pago parcial |
| 4 | Comisión se descuenta | Proporcional al hito |
| 5 | Repite hasta completar | Hasta finalizar contrato |

**Ejemplo:**
```
Contrato mensual: $400.000 COP
Hitos: 4 semanales de $100.000

Semana 1: Aprobado → PDS recibe $88.000 (comisión $12.000)
Semana 2: Aprobado → PDS recibe $88.000 (comisión $12.000)
Semana 3: Pendiente...
Semana 4: Pendiente...
```

### 8.3 Dashboard Operativo

El PDS tiene acceso a un panel con:

| Métrica | Descripción |
|---------|-------------|
| **Saldo disponible** | Monto disponible para retiro |
| **Ingresos del mes** | Total ganado en el período |
| **Comisiones descontadas** | Total de comisiones pagadas |
| **Servicios completados** | Cantidad de trabajos finalizados |
| **Historial de transacciones** | Detalle de cada operación |
| **Cuentas de cobro** | Facturas generadas automáticamente |

---

## 9. Integración de Pagos

### 9.1 Pasarelas Integradas

| Pasarela | Uso | Ventajas |
|----------|-----|----------|
| **Nequi** | Pagos y retiros | Principal en Colombia, baja comisión |
| **PSE** | Transferencias bancarias | Sin costo adicional |
| **Efectivo** | Pago en puntos autorizados | Para usuarios sin cuenta |

### 9.2 Flujo de Pagos Completo

```
┌─────────────────────────────────────────────────────────┐
│              FLUJO DE PAGOS COMPLETO                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SOLICITANTE                                            │
│  ────────────                                           │
│  1. Publica solicitud (gratis)                          │
│  2. Espera ofertas                                      │
│  3. Acepta PDS                                          │
│  4. Servicio se realiza                                 │
│  5. Confirma completado                                 │
│  6. Pago se procesa                                     │
│           ↓                                             │
│  SISTEMA                                                │
│  ────────                                               │
│  7. Verifica servicio completado                        │
│  8. Calcula comisión (si aplica)                        │
│  9. Descuenta de billetera PDS                          │
│  10. Transfiere saldo neto a PDS                        │
│  11. Registra transacción                               │
│           ↓                                             │
│  PDS                                                    │
│  ───                                                    │
│  12. Recibe notificación                                │
│  13. Ve saldo en billetera                              │
│  14. Solicita retiro (opcional)                         │
│  15. Recibe dinero en cuenta                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 9.3 Costos de Pasarela

| Pasarela | Costo por transacción |
|----------|----------------------|
| Nequi | 1.5% + $500 COP |
| PSE | 1.99% + $500 COP |

---

## 10. Fuentes de Ingresos

### 10.1 Resumen de Fuentes

| Fuente | Descripción | % Ingresos Esperado |
|--------|-------------|---------------------|
| **Comisiones** | Por servicio completado | 50% |
| **Monedas** | Venta de monedas internas | 25% |
| **Suscripciones** | Planes Premium | 15% |
| **Valor Agregado** | Certificados, destacados | 10% |

### 10.2 Suscripciones Premium

| Plan | Precio Mensual (COP) | Beneficios |
|------|---------------------|------------|
| **Básico** | $15.000 | 5 postulaciones/mes, perfil básico |
| **Profesional** | $35.000 | Postulaciones ilimitadas, perfil destacado |

### 10.3 Servicios de Valor Agregado

| Servicio | Precio (COP) |
|----------|--------------|
| Certificado de ingresos | $25.000 |
| Verificación express | $20.000 |
| Destacado en búsquedas | $10.000/día |
| Badge de habilidad | $15.000 |

---

## 11. Análisis de Unit Economics

### 11.1 Métricas Clave

| Métrica | Objetivo Año 1 | Objetivo Año 3 |
|---------|----------------|----------------|
| **CAC** | $8.000 COP | $5.000 COP |
| **LTV** | $120.000 COP | $350.000 COP |
| **LTV:CAC** | 3:1 | 5:1 |
| **Churn Rate** | 8% | 4% |
| **Gross Margin** | 60% | 75% |

### 11.2 Punto de Equilibrio

| Concepto | Valor |
|----------|-------|
| Costo mensual operación | $8.000.000 COP |
| Ingreso promedio/usuario/mes | $20.000 COP |
| **Usuarios necesarios** | **400** |

---

## 12. Proyección Financiera

### 12.1 Escenario Conservador (Año 1)

| Fuente | Volumen | Ingresos (COP) |
|--------|---------|----------------|
| Comisiones | 500 PDS × 4 × $200K × 12% | $48.000.000 |
| Monedas | 1.000 compras × $15.000 | $15.000.000 |
| Suscripciones | 100 × $25.000 × 12 | $30.000.000 |
| Valor Agregado | 500 × $20.000 | $10.000.000 |
| **Total** | | **$103.000.000** |

### 12.2 Escenario Optimista (Año 3)

| Fuente | Volumen | Ingresos (COP) |
|--------|---------|----------------|
| Comisiones | 5.000 PDS × 6 × $200K × 12% | $720.000.000 |
| Monedas | 10.000 × $20.000 | $200.000.000 |
| Suscripciones | 1.500 × $40.000 × 12 | $720.000.000 |
| Valor Agregado | 5.000 × $25.000 | $125.000.000 |
| **Total** | | **$1.765.000.000** |

---

## 13. KPIs de Monitoreo

### 13.1 KPIs de Negocio

| KPI | Fórmula | Meta |
|-----|---------|------|
| **Take rate** | Ingresos / Valor transacciones | 15-20% |
| **Net revenue retention** | Ingresos recurrentes mes anterior | >95% |
| **Gross margin** | (Ingresos - Costos) / Ingresos | >65% |

### 13.2 KPIs de Producto

| KPI | Meta |
|-----|------|
| Transacciones por usuario/mes | >3 |
| Conversión Premium | >10% |
| Uso de monedas | >40% PDS |
| Satisfacción con pagos | >4.5/5 |

---

## 14. Factores de Riesgo

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Baja adopción de monedas | Media | Promociones, bonificaciones |
| Evasión de comisiones | Baja | Monitoreo, auditoría |
| Fraude en billeteras | Baja | KYC, límites, monitoreo |
| Regulación financiera | Media | Asesoría legal, cumplimiento |

---

## 15. Conclusión

El modelo de monetización con billetera virtual de ChambeApp es **sostenible y escalable** porque:

1. **Sin fricción de entrada**: Publicar y ofertar son gratuitos
2. **Comisión al éxito**: Solo se cobra cuando hay transacción exitosa
3. **Flexibilidad**: Modalidades para diferentes perfiles de usuario
4. **Transparencia**: Precios claros en pesos, sin sorpresas
5. **Escalable**: Múltiples fuentes de ingresos

La clave del éxito será **equilibrar la monetización con la experiencia del usuario** - too much too soon matará la adopción, mientras que too little restringirá el crecimiento.

---

*Documento preparado con metodología de Business Analysis*
*Versión: 2.0 - Nuevo Modelo con Billetera Virtual*
*Fecha: Septiembre 2026*
*Proyecto: ChambeApp - Plataforma de Servicios Ocasionales*
