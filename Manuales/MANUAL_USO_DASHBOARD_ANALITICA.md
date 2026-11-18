# Manual de Uso — Dashboard de Analítica (Narrativas)

> **Ruta:** `/superadmin/analitica`
> **Rol:** SuperAdmin
> **Propósito:** Explorar las métricas de forma jerárquica (panorama → dimensión → subgrupo → métrica) para construir narrativas a partir de los datos. El dashboard **no incluye textos narrativos**: entrega cifras, objetivos, bandas y gráficas con las que tú narras.

---

## 1. Los dos dashboards

| Dashboard | Ruta | Qué contiene | Cuándo usarlo |
|-----------|------|--------------|---------------|
| **Métricas** | `/superadmin/metricas` | Operación: series de tiempo, regiones, distancias, rangos de tiempo, actividad, capacidad, monedas. | Monitoreo operativo diario. |
| **Analítica** | `/superadmin/analitica` | Drill-down de las métricas de formalización agrupadas por dimensión y subgrupo, con bandas de interpretación. | Construir narrativas y análisis. |

Ambos comparten la barra lateral en **Inicio → Métricas / Analítica**.

---

## 2. Cómo se navega la Analítica (4 niveles)

```
Nivel 0 · PANORAMA      → gráficas macro + tira de dimensiones
        ↓ clic en dimensión
Nivel 1 · DIMENSIÓN     → gráficas de la dimensión + subgrupos
        ↓ clic en subgrupo
Nivel 2 · SUBGRUPO      → gráfica de apoyo + filas de métricas
        ↓ clic en métrica
Nivel 3 · MÉTRICA       → valor, objetivo, fórmula, bandas, segmentos
```

### Migas de pan
En la parte superior de la barra de filtros verás `Panorama › Dimensión › Subgrupo › Métrica`. Haz clic en cualquier nivel anterior para retroceder.

### Búsqueda
El buscador **“Buscar métrica…”** salta directo a cualquier métrica (por código, nombre o dimensión) y omite la navegación jerárquica. Útil cuando ya sabes qué métrica quieres narrar.

### Periodo
El selector **30 / 90 / 180 días (6 meses)** cambia las series temporales, la tendencia de cada métrica y las gráficas de actividad. El histórico demo cubre **6 meses de registros diarios**.

---

## 3. Anatomía de una métrica (Nivel 3)

Al abrir una métrica verás:

| Elemento | Qué te dice | Cómo usarlo en tu narrativa |
|----------|-------------|------------------------------|
| **Valor actual** | Cifra viva de la métrica | Es el “qué”. |
| **Pill de estado** | Óptimo / Atención / Crítico (según bandas) | Es el “cómo estamos”. |
| **Objetivo** | Meta de referencia | Es el “hacia dónde”. |
| **Fórmula** | Cálculo exacto y fuente | Da rigor y trazabilidad. |
| **Bandas de interpretación** | Rangos con etiqueta y estado | Es el “por qué” y el disparador de la historia. |
| **Tendencia 6 meses** | Serie mensual de la métrica | Es el “cómo evoluciona”. |
| **Segmentación aplicable** | Botones de segmento que, al pulsarlos, recalculan una desagregación y la grafican | Es el “para quién / dónde”, ya aplicado a los datos. |
| **Métricas relacionadas** | Vecinas que explican la causa | Es el “qué más mirar”. |
| **Estándares** | ODS, IRIS+, leyes, RF | Es el “a qué responde”. |

> La banda activa (la que contiene el valor) aparece resaltada. La segmentación **no es solo sugerencia**: al seleccionar un segmento se calcula su distribución real (demo o backend) y se muestra como gráfica; “Quitar filtro” vuelve al agregado.

---

## 4. Cómo construir una narrativa (receta)

1. **Elige la dimensión** que quieres contar (p. ej. Formalización).
2. **Lee las gráficas de la dimensión** para el contexto macro.
3. **Baja a un subgrupo** y abre la métrica protagonista.
4. **Anota**: valor, banda activa, objetivo y segmentos.
5. **Contrasta** con 1–2 métricas relacionadas (para causa/efecto).
6. **Narra** con esta estructura:
   - Situación: *“Hoy {métrica} está en {valor}, lo que la ubica en banda {etiqueta}.”*
   - Causa probable: *“Se relaciona con {métrica relacionada} que está en {estado}.”*
   - Segmento: *“El efecto se concentra en {segmento}.”*
   - Acción: *“La palanca es {lever}.”*
   - Meta: *“Objetivo: {target}.”*

### Ejemplo aplicado (Formalización)
- Métrica: **D3.1 % PDS ≥10 contratos** → valor 21.3% (banda “Transición”).
- Relacionada: **D3.2 conversión alerta→afiliación** 24.6% (Atención).
- Segmento: por oficio y región.
- Acción: afiliación 1-click + subsidio primer mes.
- Meta: > 25%.

---

## 5. Catálogo de métricas por dimensión

### 5.1 Roles y Equidad — `/analitica` → Roles y Equidad

| Código | Métrica | Gráfica de apoyo | Preguntas para narrar |
|--------|---------|------------------|------------------------|
| D1.1 | Ratio PDS/Solicitante | Regiones (PDS vs Sol) | ¿Hay más oferta o demanda? ¿En qué región se rompe? |
| D1.2 | KYC completion | Distribución por distancia / región | ¿La verificación frena la entrada? |
| D1.3 | Equidad de género | Donut de género | ¿Qué oficios concentran la brecha? |
| D1.4 | Juventud (18–28) | Barras de edad | ¿Entran jóvenes o envejece la base? |
| D1.5 | Vulnerables / migrantes | KYC por región | ¿La ruta alterna de documentos funciona? |
| D1.6 | Rural vs urbano | Regiones | ¿Llegamos a corregimientos? |

### 5.2 Habilidades — `/analitica` → Habilidades

| Código | Métrica | Gráfica de apoyo | Preguntas para narrar |
|--------|---------|------------------|------------------------|
| D2.1 | Top habilidades demandadas | Brecha por habilidad | ¿Qué pide el mercado? |
| D2.2 | Brecha demanda-oferta | Brecha por habilidad | ¿Qué falta y cuánto cuesta? |
| D2.3 | Quiz rate (≥80%) | Progresión | ¿La micro-capacitación funciona? |
| D2.4 | Certificación SENA | Progresión | ¿El puente formal fluye? |
| D2.5 | Progresión N1→N5 | Niveles | ¿Se desarrollan maestros? |
| D2.6 | Endosos por habilidad | Tiempo a 1ª oferta | ¿Hay validación peer-to-peer? |
| D2.7 | Evidencia 360° / habilidad | Actividad | ¿La evidencia es probatoria? |
| D2.8 | Tiempo N1→N3 | Progresión | ¿Qué tan rápido se madura? |

### 5.3 Formalización — `/analitica` → Formalización

| Código | Métrica | Gráfica de apoyo | Preguntas para narrar |
|--------|---------|------------------|------------------------|
| D3.1 | % PDS ≥10 contratos/año | Funnel | ¿Cuántos cruzan el umbral Ley 1429? |
| D3.2 | Alerta → afiliación | Funnel | ¿La alerta convierte en protección? |
| D3.3 | Certificados emitidos | Contratos vs solicitudes | ¿Se usa el certificado de ingresos? |
| D3.4 | Créditos bancarios externos | Tiempo KYC | ¿Los bancos aceptan el certificado? |
| D3.5 | Anuncio → contacto | Regiones | ¿Los anuncios conectan al comercio con trabajadores? |
| D3.6 | PDS → Merchant | Funnel | ¿Hay movilidad a empresario? |
| D3.7 | Prima de formalidad | Contratos vs solicitudes | ¿Formalizarse paga más? |
| D3.8 | Retención 12 meses | Actividad | ¿Se quedan los formalizados? |

### 5.4 Gobernanza — `/analitica` → Gobernanza

| Código | Métrica | Gráfica de apoyo | Preguntas para narrar |
|--------|---------|------------------|------------------------|
| D4.1 | Violaciones regionales | Regiones | ¿Se respeta ADR-3? |
| D4.2 | Kill switches activos | Actividad | ¿Hay flags críticos fuera de lugar? |
| D4.3 | Evasión de comisión | Contratos vs solicitudes | ¿Se paga la parte? |
| D4.4 | Disputas / 100 contratos | Disputas por tipo | ¿Dónde falla la calidad? |
| D4.5 | Fraude KYC | Tiempo KYC | ¿La identidad es confiable? |
| D4.6 | WCAG AA | — | ¿Es accesible? |
| D4.7 | Entrega push | Actividad | ¿La información llega? |
| D4.8 | Huella CO2e/tx | Contratos vs solicitudes | ¿Es sostenible? |
| D4.9 | Sesgo ML (KL) | Sesgo por grupo | ¿La IA discrimina? |
| D4.10 | KYC P90 (<48h) | Tiempo KYC | ¿Se cumple la ley? |

### 5.5 Transversal

| Código | Métrica | Gráfica de apoyo | Preguntas para narrar |
|--------|---------|------------------|------------------------|
| FUNNEL | Registro → crédito | Funnel | ¿Dónde se rompe el embudo? |
| TOC | Suposiciones | — (lista de estados) | ¿Qué supuesto falla? |
| 2DO | Efectos de 2.º orden | Actividad / regiones | ¿Qué pasa a escala? |

---

## 6. Reglas de lectura

1. **Un solo protagonista por narrativa.** Elige una métrica ancla y usa las demás como causa/efecto.
2. **Siempre cita la banda.** “Está en banda X” es más útil que “está mal”.
3. **Segmenta antes de concluir.** El promedio oculta diferencias por oficio, región, género o cohorte.
4. **Contrasta con la relacionada.** Una cifra sola no explica; el par sí.
5. **Cierra con palanca y meta.** Toda narrativa debe terminar en una acción y un objetivo.

### 6.1 Gráficas accionables (filtro cruzado, tipo Power BI)

Las gráficas del panorama y de cada dimensión **son clicables**:

- Al pulsar una barra, columna, región o leyenda de dona se aplica un **filtro** en esa dimensión.
- **Todas las demás gráficas se recalculan** sobre el subconjunto. Ejemplo: si seleccionas el oficio **Plomería**, las franjas de **tiempo a primera oferta**, la **revisión KYC**, la **firma**, la **edad**, el **género** y la **actividad** cambian a ese oficio.
- Si **no hay ningún filtro**, se muestran los **promedios globales**.
- Los filtros activos aparecen como **chips** en la barra superior; al pulsarlos se quitan, y “Limpiar todo” los borra todos.
- Un segundo clic sobre el mismo elemento quita el filtro.

> Los filtros son combinables: puedes filtrar por región y luego por oficio; el resto de gráficas responde a la intersección.

### 6.2 Detalle de métrica: segmentación aplicable

En el nivel de métrica, los botones de **“Segmentación aplicable”** desagregan esa métrica y la grafican. Se puede quitar el filtro con “Quitar filtro”. Cada segmento tiene **etiquetas legibles** (región, oficio, género, edad, cohorte, modalidad, etc.), nunca códigos A/B/C/D.

---

## 7. Atajos y accesibilidad

- **Búsqueda**: salta directo a la métrica.
- **Migas**: retroceso en un clic.
- **Teclado**: `Tab` recorre filas y botones; `Esc` cierra overlays.
- **Reduced motion**: respetado; las animaciones se reducen.
- **Responsive**: panorama y dimensiones se apilan en móvil.

---

## 8. Datos reales vs demo

La fuente principal es la base de datos: la migración **`033_analytics_history`** crea `metrics_daily` (180 días de agregados diarios) y `metrics_segment_monthly` (6 meses de desagregaciones por región, oficio, género, edad, urgencia, canal, distancia, tiempos y cohorte). El dashboard las consume vía `GET /superadmin/metrics/history` y `GET /superadmin/metrics/distributions`.

Si el backend no responde, el dashboard usa **datos demo deterministas** con la misma estructura (180 días y 6 meses). El aviso aparece en la barra superior.

---

*Documento de uso. Para el detalle de cada métrica de impacto social, ver `MANUAL_METRICAS_IMPACTO_SOCIAL.md`.*
