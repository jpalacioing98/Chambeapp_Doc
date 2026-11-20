# Motor de Recomendaciones ChambeApp — Documentación Técnica Completa

> **Versión:** 1.11.0 | **Fecha:** 2026-11-18 | **Estado:** ML en Shadow Mode (validación A/B)

---

## 📑 Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura: Factory Pattern Pluggable](#2-arquitectura-factory-pattern-pluggable)
3. [Estrategia 1: HeuristicRecommender (Base)](#3-estrategia-1-heuristicrecommender-base)
4. [Estrategia 2: VectorRecommender (Stub Futuro)](#4-estrategia-2-vectorrecommender-stub-futuro)
5. [Estrategia 3: HybridRecommender (ML + Geo)](#5-estrategia-3-hybridrecommender-ml--geo)
6. [Estrategia 4: ShadowRecommender (A/B Testing)](#6-estrategia-4-shadowrecommender-ab-testing)
7. [Factory: get_recommender()](#7-factory-get_recommender)
8. [Modelo ML: LightGBM Lambdarank](#8-modelo-ml-lightgbm-lambdarank)
8.1 [22 Features](#81-22-features)
8.2 [Entrenamiento](#82-entrenamiento)
8.3 [Feature Importance](#83-feature-importance)
9. [Bandit: Thompson Sampling](#9-bandit-thompson-sampling)
10. [Endpoints API](#10-endpoints-api)
11. [A/B Logging Automático](#11-ab-logging-automático)
12. [Flujo Completo de Una Recomendación](#12-flujo-completo-de-una-recomendación)
13. [Feature Flags y Control](#13-feature-flags-y-control)
14. [Glosario de Términos](#14-glosario-de-términos)
15. [Términos del Proyecto ChambeApp](#15-términos-del-proyecto-chambeapp)

---

## 📖 Resumen Narrativo: Cómo Funciona Cada Modelo (Historia Completa)

Imagina que abres la app y publicas: *"Necesito arreglar una fuga en el baño, presupuesto $150.000, urgencia para hoy"*. Detrás de esa simple acción, se activa todo un ecosistema de recomendaciones que decide **qué 10 plomeros verás primero**. Aquí te cuento la historia de cómo cada "cerebro" toma esa decisión.

---

### 🧠 El Cerebro Básico: HeuristicRecommender (El Sabio Tradicional)

Es el abuelo del sistema. No necesita GPUs, no necesita entrenar, no falla nunca. Cuando le llegan 300 plomeros con perfil completo, hace tres preguntas simples a cada uno:

1. **¿Sabe hacer esto?** (¿Tiene "plomería" en sus categorías/habilidades?) → **Peso 60%**. Si la respuesta es no, su score se hunde inmediato.
2. **¿Qué tal le ha ido?** (Su calificación promedio / 5) → **Peso 30%**. Un 4.8/5 vale 0.96; un 3.2/5 vale 0.64.
3. **¿Está verificado?** (KYC aprobado) → **Peso 10%**. Un checkbox que suma 0.1 al score final.

Suma ponderada, ordena descendente, te devuelve los 10 primeros. Es transparente: *"Te recomendamos a Juan porque coincide en categoría (sí, 60%), tiene 4.7/5 de reputación (30%) y está verificado (10%)"*. Fin. Determinista, auditable, incansable. Es el **fallback universal**: si todo lo demás falla, él responde.

---

### 🔮 El Cerebro Futuro: VectorRecommender (El Soñador Semántico)

Aún no existe en producción —es un stub, una promesa—. Su idea: **"Entender el significado, no solo las etiquetas"**.

Imagina que publicas: *"Se mojó la pared del baño, huele a humedad, creo que es tubería rota"*. El heurístico busca "plomería" en categorías. El vectorizador soñaría: transforma tu descripción en un vector de 384 dimensiones (embedding semántico), busca en el espacio vectorial (pgvector + HNSW) los plomeros cuyos perfiles —descripciones, habilidades, trabajos previos— están **cerca en significado**, aunque no digan exactamente "plomería". Encontraría al especialista en "humedad y filtraciones" aunque su categoría diga "impermeabilización".

Necesita: `sentence-transformers` (384 dims), `pgvector` en PostgreSQL con índice HNSW, filtrado híbrido (metadata geo + vector). Resuelve el **cold start**: el plomero nuevo sin historial pero con buena descripción aparece. Por ahora, duerme en `raise NotImplementedError`.

---

### 🤖 El Cerebro Híbrido: HybridRecommender (El Arquitecto de Dos Etapas)

Es el cerebro actual en **shadow mode** (loggea, pero no manda). Trabaja en **dos etapas**, como un reclutador senior:

#### Etapa 1: Retrieval — El Filtro Geo (El Portero)
> *"Solo me importan los que están cerca."*

Usa PostGIS (`ST_DWithin`) con las coordenadas de tu solicitud. Radio configurable (default 15km, máximo 100km). De 3000 plomeros en la BD, saca **≤50 candidatos** que están realmente a distancia razonable. Es un filtro duro, binario, geoespacial. Si no hay nadie en radio → fallback al heurístico.

#### Etapa 2: Ranking ML — El Evaluador Experto (LightGBM Lambdarank)
> *"De estos 50 cercanos, ¿quién es el mejor para ESTE trabajo específico?"*

Extrae **22 features** por cada candidato (distancia, match categoría, trust score, KYC, portfolio, badges, contratos completados, rating, tasa aceptación, tiempo respuesta, última actividad, match categoría, match precio, saturación, disponibilidad, bandit arm value, fresh bonus, exploration slot, hora, día, urgencia). Las normaliza 0-1, las apila en matriz `(n_candidatos, 22)`.

Pasa la matriz por **LightGBM entrenado con Lambdarank** (objetivo: optimizar NDCG). El modelo devuelve scores raw → sigmoid → probabilidades [0,1]. Ordena descendente, top-10, añade explicación legible (`ranker.explain`), versión del modelo, ranking position.

**Fallback de acero**: Si ML falla (excepción, modelo no cargado, datos raros) → **silenciosamente** devuelve al heurístico. El usuario nunca ve error.

---

### 👻 El Cerebro Fantasma: ShadowRecommender (El Validador Silencioso)

Es el modo **validación A/B sin riesgo**. Corre el Hybrid completo **en paralelo**, pero **el usuario nunca ve sus scores**.

1. Usuario pide recomendaciones → Shadow ejecuta Hybrid completo (geo + features + ML) → obtiene scores ML.
2. **Loggea todo** para análisis offline: *"Solicitud 12345: ML dice pds001=0.847, pds005=0.723, pds012=0.654"*.
3. **Descarta ML** y retorna **HeuristicRecommender** al usuario.

¿Para qué? Para que el equipo de datos compare **offline**:
- NDCG@10 ML vs Heurístico vs Ground Truth (oferta aceptada real)
- Precision@K: ¿Cuántos del top-K ML fueron elegidos realmente?
- Rank Correlation (Spearman): ¿Qué tan distinto rankea ML vs heurístico?
- Divergence Rate: ¿Cuántas veces top-1 ML ≠ top-1 heurístico?
- Calibration: ¿Score 0.8 ≈ 80% éxito real?

Cuando las métricas offline dicen "ML gana", se flipa `ml_shadow_mode=false` y **de un commit a prod**, el Hybrid manda. Cero riesgo, cero downtime.

---

### 🎭 El Director: get_recommender() (El Factory)

Es el semáforo que decide qué cerebro manda **en runtime, sin redeploy**, leyendo dos feature flags:

| `ml_ranking_enabled` | `ml_shadow_mode` | Instancia | Qué Pasa |
|----------------------|------------------|-----------|----------|
| `False` | Cualquiera | `HeuristicRecommender` | **Default seguro** |
| `True` | `True` | `ShadowRecommender` | **Validación A/B** (log ML, usa heurístico) |
| `True` | `False` | `HybridRecommender` | **Producción ML real** |

Cambias en BD: `UPDATE feature_flags SET enabled=true WHERE key='ml_ranking_enabled';` → **instantáneo**, sin deploy, sin reinicio.

---

### 🎯 El Flujo Completo: De Tu Publicación a Los 10 Plomeros

```
Tú publicas: "Fuga baño, $150k, urgencia hoy" (service_id=123)
        │
        ▼
GET /api/v1/ai/recommendations?service_id=123
        │
        ▼
get_recommender() ── Lee flags ──► HybridRecommender (shadow=true)
        │
        ▼
Hybrid.rank_providers_for_service(solicitud, top_n=10)
        │
        ├── 1. PostGIS ST_DWithin(lat, lng, 15km) → 47 plomeros cercanos
        │
        ├── 2. FeatureExtractor.extract_batch(47, solicitud) → X(47, 22)
        │
        ├── 3. MLRanker.predict(X) → LightGBM Lambdarank → scores [0.847, 0.723, ...]
        │
        └── 4. Construye respuesta + A/B logging (ABTest.log_recommendation)
                │
                ▼
Response JSON: 10 plomeros con score, explicación, features, ab_group="A", ranking
```

Cada recomendación se loggea en `RecommendationLog` con: `solicitud_id`, `provider_id`, `score`, `model`, `ab_group`, `ranking_pos`, `model_version`. **Auditoría completa, gratis**.

---

### 🎛️ El Control: Dos Switches en la BD

```sql
-- Activar ML híbrido real (producción)
UPDATE feature_flags SET enabled=true WHERE key='ml_ranking_enabled';

-- Poner en shadow (valida, no afecta usuarios)
UPDATE feature_flags SET enabled=true WHERE key='ml_shadow_mode';

-- Apagar todo ML (vuelve a heurístico puro)
UPDATE feature_flags SET enabled=false WHERE key='ml_ranking_enabled';
```

**Estado actual**: `ml_ranking_enabled=true`, `ml_shadow_mode=true` → **ShadowRecommender**. El ML corre, aprende, loggea, pero los usuarios ven al sabio heurístico. Cuando las métricas offline digan "ML gana", se flipa el switch y **el modelo ya entrenado manda**.

---

### 📈 Lo Que El Modelo Aprendió (Feature Importance Real)

| Rank | Feature | Gain | Qué Significa |
|------|---------|------|---------------|
| 1 | `distance_km` | 5,174 | **Distancia manda** — la geografía es rey |
| 2 | `tasa_aceptacion` | 3,234 | Quien acepta ofertas, gana visibilidad |
| 3 | `category_match` | 1,107 | Especialización exacta importa |
| 4 | `rating_avg` | 450 | Reputación histórica pesa |
| 5 | `price_match` | 1,546 | Presupuesto vs rango de la categoría |
| 6 | `trust_score` | 1,353 | Confianza global (KYC + portfolio + historial) |
| 7 | `contratos_completados` | 316 | Experiencia real medible |

El modelo **no** aprendió que día de la semana o bandit importan (gain ≈ 0). Aprendió que **geografía + disposición + especialización** predicen quién será elegido.

---

### 🔮 Hacia Dónde Va Esto

1. **Activar ML real** (`shadow_mode=false`) cuando tengas ≥5k samples con positivos/negativos balanceados.
2. **Online Learning**: `partial_fit` incremental en LightGBM al recibir feedback nuevo.
3. **VectorRecommender**: Embeddings de descripción + `pgvector` para cold-start semántico.
4. **Explainability UI**: `ranker.explain(features)` en frontend PDS/Solicitante.
5. **Fairness**: `monotone_constraints` en LightGBM (distancia monótona decreciente).

---

*Esta narrativa acompaña a la documentación técnica completa en `MOTOR_RECOMENDACIONES_DETALLADO.md`. Para implementación: revisar `app/ai/` y `app/controllers/ai.py`.*

El motor de recomendaciones de ChambeApp implementa un **sistema de match bidireccional** entre **Solicitantes** (quienes publican trabajos) y **PDS** (Prestadores de Servicios / trabajadores). 

### Objetivos
- **RF-05.1**: Rankear PDS para una solicitud dada (Solicitante ve quién puede hacer el trabajo)
- **RF-05.2**: Rankear solicitudes para un PDS (PDS ve qué trabajos le convienen)
- **RF-05.4**: Transparencia algorítmica (explicación legible de cada score)
- **RF-05.5**: Validación A/B sin afectar usuarios (Shadow Mode)

### Diseño Clave: **Pluggable Factory**
Todas las estrategias implementan la interfaz `Recommender` (ABC). El factory `get_recommender()` selecciona la estrategia según **feature flags** en runtime, sin redeploy.

---

## 2. Arquitectura: Factory Pattern Pluggable

```python
# app/ai/recommender.py
class Recommender(ABC):
    @abstractmethod
    def rank_providers_for_service(self, service: Solicitud, top_n: int = 10) -> list[dict]: ...
    
    @abstractmethod
    def rank_services_for_provider(self, profile: Profile, top_n: int = 10) -> list[dict]: ...

def get_recommender() -> Recommender:
    ml_enabled = FeatureFlag.get('ml_ranking_enabled')
    shadow_mode = FeatureFlag.get('ml_shadow_mode')
    
    if not ml_enabled:     return HeuristicRecommender()
    if shadow_mode:        return ShadowRecommender()
    return HybridRecommender()
```

### Diagrama de Decisión

```
                    ┌─────────────────────┐
                    │  get_recommender()  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ml_enabled?        ml_enabled?       ml_enabled?
         =False             =True             =True
              │                │                │
              ▼                ▼                ▼
    ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
    │ HeuristicReco-  │ │ ShadowReco-  │ │ HybridRecom-    │
    │ mmender         │ │ mmender      │ │ mender          │
    │ (solo heurís-   │ │ (log ML,     │ │ (ML real en     │
    │ tico, siempre    │ │  usa heurís- │ │  prod)          │
    │  disponible)    │ │  tico)       │ │                 │
    └─────────────────┘ └──────────────┘ └─────────────────┘
```

---

## 3. Estrategia 1: HeuristicRecommender (Base, Siempre Disponible)

**Archivo:** `app/ai/recommender.py` líneas 37-130

### Fórmula de Score
```
Score = 0.6 × Categoria_Match + 0.3 × Reputación + 0.1 × Verificado
```

| Componente | Peso | Cálculo Detallado |
|------------|------|-------------------|
| **Categoria_Match** | 0.6 | `1` si proveedor tiene la categoría/habilidad en `profile.categorias` o `profile.habilidades`; `0` si no |
| **Reputación** | 0.3 | `calificacion_promedio / 5.0` (normalizado 0-1). Si no tiene ratings → `0.0` |
| **Verificado** | 0.1 | `1` si `profile.verificado=True` (KYC aprobado), `0` si no |

### Algoritmo: `rank_providers_for_service(service, top_n=10)`

```python
def rank_providers_for_service(self, service, top_n=10):
    # 1. Candidatos: PDS con perfil_completo=True
    providers = User.query.join(Profile).filter(
        User.rol == RolUsuario.PDS,
        Profile.perfil_completo == True
    ).all()
    
    results = []
    for p in providers:
        cm = self._categoria_match(service.categoria, p.profile)  # 0 o 1
        rep = (p.profile.calificacion_promedio or 0) / 5.0       # 0.0 - 1.0
        ver = bool(p.profile.verificado)                         # True/False
        score = 0.6*cm + 0.3*rep + 0.1*(1 if ver else 0)
        
        results.append({
            "user_id": p.id,
            "email": p.email,
            "score": round(score, 4),
            "explicacion": f"Coincidencia categoría '{service.categoria}': "
                           f"{'sí' if cm else 'no'} (peso 0.6); "
                           f"reputación {rep*5:.1f}/5 (peso 0.3); "
                           f"{'verificado' if ver else 'no verificado'} (peso 0.1)."
        })
    
    results.sort(key=lambda r: r["score"], reverse=True)
    return results[:top_n]
```

### Algoritmo: `rank_services_for_provider(profile, top_n=10)`

Mismo cálculo pero **invertido**: itera sobre **todas las solicitudes PUBLICADO** y calcula qué tan bien encaja cada servicio con el perfil del PDS.

### Características Clave
| Aspecto | Detalle |
|---------|---------|
| **Dependencias** | Cero (solo BD) |
| **Transparencia** | Total (explicación legible) |
| **Determinismo** | 100% (mismos inputs = mismo output) |
| **Latencia** | ~50-100ms para 300 PDS |
| **Uso** | Default cuando ML off; fallback si ML falla |

---

## 4. Estrategia 2: VectorRecommender (Stub - Iteración Futura)

**Archivo:** `app/ai/recommender.py` líneas 133-148

### Diseño Planeado
```python
class VectorRecommender(Recommender):
    """Embeddings semánticos + pgvector"""
    
    def rank_providers_for_service(self, service, top_n=10):
        # 1. Embedding de service.descripcion + categoria + metadata
        #    → sentence-transformers/all-MiniLM-L6-v2 (384 dims)
        # 2. Query vectorial en BD (cosine similarity + filtros metadata)
        #    → pgvector HNSW index
        # 3. Re-rank con heurístico como fallback
        raise NotImplementedError("Iteración futura: requiere sentence-transformers + pgvector")
```

### Stack Futuro
| Componente | Tecnología |
|------------|------------|
| **Embeddings** | `sentence-transformers/all-MiniLM-L6-v2` (384 dims) |
| **Vector DB** | `pgvector` en PostgreSQL + índice HNSW |
| **Filtrado híbrido** | Metadata (categoria, zona, radio) + vector score |
| **Cold-start** | Resuelve el problema de PDS nuevos sin historial |

---

## 5. Estrategia 3: HybridRecommender (ML + Geo) — Producción/Shadow

**Archivo:** `app/ai/recommender.py` líneas 151-258

### Arquitectura: **Retrieval + Ranking (Two-Stage)**

```
┌─────────────────────────────────────────────────────────────────────┐
│                      HybridRecommender                               │
├─────────────────────────────────────────────────────────────────────┤
│  1. RETRIEVAL (PostGIS) — Filtro Espacial Duro                      │
│     find_nearby_providers(lat, lng, radius_km, top_k=50)           │
│     → ST_DWithin(geom, ST_MakePoint(lng, lat), radius_m)           │
│     → Devuelve ≤50 candidatos PDS cercanos (respeta radio_km)      │
├─────────────────────────────────────────────────────────────────────┤
│  2. FEATURE EXTRACTION (22 features normalizadas 0-1)              │
│     FeatureExtractor.extract_batch(providers, solicitud)           │
│     → Array numpy (n_candidatos, 22)                               │
├─────────────────────────────────────────────────────────────────────┤
│  3. RANKING ML (LightGBM Lambdarank)                                │
│     MLRanker.predict(X) → scores [0,1] (sigmoid normalizado)       │
│     → Fallback a Heuristic si ML falla                             │
├─────────────────────────────────────────────────────────────────────┤
│  4. RESPUESTA                                                       │
│     Ordena por score ML → top_n                                     │
│     Incluye: explicación (ranker.explain), features,               │
│     model_version, ranking_pos                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Paso a Paso: `rank_providers_for_service(service, top_n=10)`

| Paso | Acción | Código / Detalle |
|------|--------|------------------|
| **1️⃣ Validar coords** | Si solicitud sin lat/lng → fallback heurístico | `if service.latitud is None: return heuristic...` |
| **2️⃣ Calcular radio** | Usa `service.radio_km` (default 15km, clamp 1-100km) | `radius_km = clamp(service.radio_km or 15, 1, 100)` |
| **3️⃣ Retrieval Geo** | PostGIS `ST_DWithin` → candidatos cercanos | `find_nearby_providers(lat, lng, radius_km, top_k=50)` |
| **4️⃣ Validar candidatos** | Si 0 candidatos → fallback heurístico | `if not candidates: return heuristic...` |
| **4️⃣ Feature Extraction** | 22 features × n_candidatos | `extractor.extract_batch(candidates, service)` → `(n, 22)` |
| **5️⃣ Predicción ML** | LightGBM Lambdarank → scores [0,1] | `ranker.predict(X)` + sigmoid normalizado |
| **6️⃣ Manejo errores** | Try/except → fallback heurístico | `try: scores=ranker.predict(X) except: return heuristic...` |
| **7️⃣ Construir respuesta** | Para cada: user_id, email, score, explicación, features, model_version | Ver estructura abajo |
| **8️⃣ Ordenar + Top-N** | Sort desc por score + ranking_pos | `sort(key=score, reverse=True)[:top_n]` |

### Estructura de Respuesta (cada recomendación)
```json
{
  "user_id": 123,
  "email": "pds@sim.co",
  "score": 0.8472,
  "explicacion": "distance_km: 2.34 | category_match: 1.00 | trust_score: 0.85 | ...",
  "ab_group": "A",
  "ranking": 1,
  "features": { "distance_km": 2.34, "category_match": 1.0, ... },
  "model_version": "1.0.0-202611182203"
}
```

### Flujo: `rank_services_for_provider(profile, top_n=10)`

| Diferencia vs `rank_providers` | Detalle |
|--------------------------------|---------|
| **Input** | Perfil del PDS autenticado (JWT) |
| **Candidates** | **Todas** solicitudes `PUBLICADO` (sin filtro geo obligatorio) |
| **Features** | `extract_for_provider(profile.user, service)` por cada servicio |
| **Predicción** | Una a una (`X.shape = (1, 22)`) |
| **Output** | Servicios rankeados con score ML + explicación + model_version |

### Fallback Strategy (Robustez)
```python
try:
    scores = self.ranker.predict(X)
except Exception as e:
    logger.error(f"HybridRecommender ML error: {e}, fallback to heuristic")
    return self.heuristic.rank_providers_for_service(service, top_n)
```
**Garantía**: Siempre responde, aunque ML falle completamente.

---

## 6. Estrategia 4: ShadowRecommender (A/B Testing - Validación Offline)

**Archivo:** `app/ai/recommender.py` líneas 261-297

### Propósito
> **Loggea predicciones ML PERO retorna heurístico** → Permite validar modelo offline sin afectar experiencia de usuario.

### Arquitectura
```
ShadowRecommender
├── heuristic = HeuristicRecommender()     # Lo que ve el usuario (producción)
├── hybrid = HybridRecommender()           # Lo que ejecutamos para loggear
└── _log_comparison(solicitud_id, ml_results)
```

### Flujo: `rank_providers_for_service()`
```python
def rank_providers_for_service(self, service, top_n=10):
    # 1. Ejecuta ML completo (retrieval + features + predict)
    ml_results = self.hybrid.rank_providers_for_service(service, top_n)
    
    # 2. Loggea para análisis offline
    self._log_comparison(service.id, ml_results)
    
    # 3. Retorna HEURÍSTICO (lo que ve el usuario real)
    return self.heuristic.rank_providers_for_service(service, top_n)
```

### Log Output (ejemplo real)
```
INFO Shadow mode - solicitud 12345
INFO   ML: pds001@sim.co score=0.8472
INFO   ML: pds005@sim.co score=0.7231
INFO   ML: pds012@sim.co score=0.6543
```

### Métricas Offline Posibles (Post-procesamiento)

| Métrica | Cómo Calcular |
|---------|---------------|
| **NDCG@10** | Comparar ranking ML vs heurístico vs ground truth (oferta aceptada) |
| **Precision@K** | % of top-K ML que fueron elegidos realmente |
| **Rank Correlation** | Spearman entre ML score y heurístico score |
| **Divergence Rate** | % veces que top-1 ML ≠ top-1 heurístico |
| **Calibration** | Score ML vs probabilidad real de aceptación |

---

## 7. Factory: `get_recommender()` — El Cerebro

**Archivo:** `app/ai/recommender.py` líneas 299-321

```python
def get_recommender() -> Recommender:
    ml_enabled = FeatureFlag.query.filter_by(
        key='ml_ranking_enabled', enabled=True
    ).first() is not None
    
    shadow_mode = FeatureFlag.query.filter_by(
        key='ml_shadow_mode', enabled=True
    ).first() is not None
    
    if not ml_enabled:
        return HeuristicRecommender()           # 1. Solo heurístico
    if shadow_mode:
        return ShadowRecommender()              # 2. Shadow (log ML, usa heurístico)
    return HybridRecommender()                  # 3. Híbrido real (ML en prod)
```

### Tabla de Decisión Completa

| `ml_ranking_enabled` | `ml_shadow_mode` | Instancia | Comportamiento |
|----------------------|------------------|-----------|----------------|
| `False` | `False/True` | `HeuristicRecommender` | **Default** / ML off |
| `True` | `True` | `ShadowRecommender` | **Validación A/B** (log ML, usa heurístico) |
| `True` | `False` | `HybridRecommender` | **Producción ML real** |

---

## 8. Modelo ML: LightGBM Lambdarank

**Archivo:** `app/ai/ml_ranker.py`

### Configuración del Modelo
| Parámetro | Valor |
|-----------|-------|
| **Algoritmo** | LightGBM (`objective='lambdarank'`) |
| **Objetivo** | Optimizar NDCG (ranking) |
| **Features** | **22** (geo, confianza, historial, negocio, rotación, metadata) |
| **Groups/Queries** | Cada solicitud = 1 grupo; candidatos = ofertas + logs |
| **Label** | `1` = oferta aceptada / contrato firmado; `0` = ofertó y no elegido |
| **Mínimo entrenamiento** | **100 samples** + al menos 1 query con pos/neg |
| **Persistencia** | `joblib` en `models/ranker_lgb.pkl` (versión + feature_names + timestamp) |

### Hiperparámetros Fijos
```python
params = {
    "objective": "lambdarank",
    "metric": "ndcg",
    "num_leaves": 31,
    "min_data_in_leaf": 20,
    "learning_rate": 0.05,
    "num_boost_round": 100,
    "verbose": -1,
}
```

### Entrenamiento (`app/ai/train.py`)
```bash
cd Chambeapp_backend
python -m app.ai.train
```

**Proceso:**
1. **Genera datos**: Recorre solicitudes con ofertas → candidates = ofertantes + recommendation_logs
2. **Labels**: `1` = PDS elegido (oferta aceptada/contrato), `0` = ofertó y no ganó
3. **Groups**: Una query por solicitud (tamaño = nº candidatos)
4. **Filtro**: Descarta queries sin al menos 1 positivo + 1 negativo
5. **Entrena** `MLRanker.train(X, y, feature_names, groups=groups)`
6. **Guarda** modelo en `models/ranker_lgb.pkl` con versionado

### 8.1 22 Features (`app/ai/features.py`)

| Grupo | Features (normalizadas 0-1) | Descripción |
|-------|----------------------------|-------------|
| **Geo (2)** | `distance_km`, `zona_match` | Distancia haversine + match zona textual |
| **Confianza (5)** | `trust_score`, `kyc_verificado`, `portfolio_calidad`, `badges_count`, `contratos_completados` | TrustScore + KYC + portfolio + badges + historial |
| **Historial (5)** | `rating_avg`, `rating_count`, `tasa_aceptacion`, `tiempo_respuesta_promedio`, `ultima_actividad_dias` | Rating normalizado, volumen, % ofertas aceptadas, tiempo respuesta, recencia |
| **Negocio (4)** | `category_match`, `price_match`, `saturacion_pen`, `disponibilidad` | Match categórico, presupuesto vs rango, contratos activos, carga |
| **Rotación (3)** | `bandit_arm_value`, `fresh_provider_bonus`, `exploration_slot` | Thompson Sampling, bonus nuevo, slot exploración |
| **Metadata (3)** | `hour_of_day`, `day_of_week`, `is_urgent` | Contexto temporal |

### 8.2 Feature Importance (Modelo Entrenado con Datos Simulados)

| Rank | Feature | Importance (Gain) | Interpretación |
|------|---------|-------------------|----------------|
| 1 | `distance_km` | 5,174 | **#1** - Distancia geográfica domina |
| 2 | `tasa_aceptacion` | 3,234 | Qué tan seguido acepta ofertas |
| 3 | `category_match` | 1,107 | Match categórico exacto |
| 4 | `rating_avg` | 450 | Reputación histórica |
| 5 | `price_match` | 1,546 | Presupuesto vs rango categoría |
| 6 | `trust_score` | 1,353 | Score de confianza global |
| 7 | `contratos_completados` | 316 | Experiencia real |
| 8 | `category_match` | 1,107 | Match categórico exacto |
| 9 | `saturacion_pen` | 201 | Penalización por saturación |
| 10 | `portfolio_calidad` | 230 | Calidad de portafolio |
| 11 | `price_match` | 1,546 | Match de precio |
| 12 | `tiempo_respuesta_promedio` | 2,293 | Velocidad de respuesta |
| 13 | `ultima_actividad_dias` | 1,362 | Recencia |
| 14 | `trust_score` | 1,353 | Trust score |
| 15 | `zona_match` | 179 | Match de zona textual |
| 16 | `kyc_verificado` | 29 | KYC aprobado |
| 17 | `hour_of_day` | 284 | Hora del día |
| 18 | `is_urgent` | 190 | Urgencia "hoy" |
| 19 | `exploration_slot` | 16 | Slot exploración |
| 20 | `fresh_provider_bonus` | 2.3 | Bonus nuevo |
| 21 | `bandit_arm_value` | 0 | Thompson Sampling |
| 22 | `day_of_week` | 0 | Sin señal |

> **Insight**: El modelo aprendió que **distancia + aceptación + categoría** son predictores #1 de qué PDS será elegido.

---

## 9. Bandit: Thompson Sampling

**Archivo:** `app/ai/bandit.py`

### Propósito
Multi-Armed Bandit por **categoría de servicio** para rotación inteligente y exploración automática.

### Algoritmo
- **Prior uniforme**: `Beta(1, 1)` por categoría
- **Actualización**: `update(categoria, accepted=True/False)`
  - `accepted=True` → `α += 1`
  - `accepted=False` → `β += 1`
- **Selección**: Sample `Beta(α, β)` por categoría → elige el máximo
- **Feature ML**: `bandit_arm_value = α / (α + β)` (probabilidad de éxito)

### Persistencia
- **Storage**: `SystemConfig['bandit_state']` = `{alpha: {...}, beta: {...}}`
- **Inicialización**: Prior uniforme `Beta(1,1)` por categoría nueva

### Uso en Features
```python
# En FeatureExtractor._get_bandit_value()
bandit = ThompsonBandit()
return bandit.get_arm_value(categoria)  # α/(α+β) ∈ [0,1]
```

---

## 10. Endpoints API

**Archivo:** `app/controllers/ai.py`

### `GET /api/v1/ai/recommendations?service_id=<id>`
**Auth:** Público (solo `service_id` query param)

**Response:**
```json
{
  "recommendations": [
    {
      "user_id": 123,
      "email": "pds@sim.co",
      "score": 0.8472,
      "explicacion": "distance_km: 2.34 | category_match: 1.00 | trust_score: 0.85 | ...",
      "ab_group": "A",
      "ranking": 1,
      "features": { "distance_km": 2.34, "category_match": 1.0, ... },
      "model_version": "1.0.0-202611182203"
    }
  ]
}
```

### `GET /api/v1/ai/solicitudes-for-provider` (JWT requerido - PDS)
**Auth:** Bearer Token (PDS autenticado)

**Response:** Array plano (sin envoltura) para consumo directo en frontend
```json
[
  {
    "id": 456,
    "titulo": "Fuga en baño",
    "categoria": "plomeria",
    "score": 0.7231,
    "explicacion": "category_match: 1.00 | trust_score: 0.85 | ...",
    "model_version": "1.0.0-202611182203"
  }
]
```

---

## 11. A/B Logging Automático

**Archivo:** `app/controllers/ai.py` líneas 40-57, 75-90

Cada recomendación se registra automáticamente en `RecommendationLog`:

```python
# En Recommendations.get()
ab_group = ABTest.get_group(solicitud.solicitante_id)
model_name = type(recommender).__name__  # "HybridRecommender", "ShadowRecommender", etc.

for i, rec in enumerate(recs):
    ABTest.log_recommendation(
        solicitud_id=solicitud.id,
        provider_id=rec["user_id"],
        score=rec["score"],
        model=model_name,
        group=ab_group,
        ranking_pos=i + 1,
    )
    rec["ab_group"] = ab_group
```

**Campos loggeados por recomendación:**
| Campo | Descripción |
|-------|-------------|
| `solicitud_id` | ID de la solicitud |
| `provider_id` | ID del PDS recomendado |
| `score` | Score del modelo (0-1) |
| `model` | "HeuristicRecommender" \| "HybridRecommender" \| "ShadowRecommender" |
| `group` | "A" \| "B" (asignación aleatoria determinista por usuario) |
| `ranking_pos` | Posición en ranking (1-indexed) |
| `model_version` | Versión del modelo ML (si aplica) |

---

## 12. Flujo Completo de Una Recomendación

```
Usuario Solicitante crea Solicitud (service_id=123)
         │
         ▼
GET /api/v1/ai/recommendations?service_id=123
         │
         ▼
get_recommender()  ──► Feature Flags ──► HybridRecommender (shadow=true)
         │
         ▼
HybridRecommender.rank_providers_for_service(solicitud, top_n=10)
         │
         ├── 1. find_nearby_providers(lat, lng, radius_km=15, top_k=50)
         │      └─► PostGIS ST_DWithin → 47 candidatos
         │
         ├── 2. FeatureExtractor.extract_batch(47 candidatos, solicitud)
         │      └─► X.shape = (47, 22)
         │
         ├── 3. MLRanker.predict(X)
         │      ├─► LightGBM Lambdarank
         │      └─► scores = [0.847, 0.723, 0.654, ...]
         │
         └── 4. Construye respuesta + A/B logging
                └─► ABTest.log_recommendation() para cada uno
         │
         ▼
Response JSON con 10 PDS rankeados + scores + explicaciones + ab_group
```

---

## 13. Feature Flags y Control

### Flags en `FeatureFlag` (tabla BD)
| Flag | Clave | Default | Descripción |
|------|-------|---------|-------------|
| Habilitar ML | `ml_ranking_enabled` | `False` | Master switch ML |
| Shadow Mode | `ml_shadow_mode` | `True` | Log ML, usa heurístico |

### Cambiar en Runtime (Sin Deploy)
```sql
-- Activar ML híbrido (producción real)
UPDATE feature_flags SET enabled=true WHERE key='ml_ranking_enabled';

-- Poner en shadow (log ML, usa heurístico)
UPDATE feature_flags SET enabled=true WHERE key='ml_shadow_mode';

-- Desactivar todo ML
UPDATE feature_flags SET enabled=false WHERE key='ml_ranking_enabled';
```

### Estado Actual (Simulación)
```bash
# Flags actuales
ml_ranking_enabled = true
ml_shadow_mode = true
# Resultado: ShadowRecommender (loggea ML, retorna heurístico)
```

---

## 14. Glosario de Términos

### Términos de Machine Learning

| Término | Definición |
|---------|------------|
| **Lambdarank** | Algoritmo de Learning-to-Rank de LightGBM que optimiza NDCG directamente usando gradientes lambda. |
| **NDCG** | Normalized Discounted Cumulative Gain. Métrica de ranking que penaliza elementos relevantes en posiciones bajas. |
| **Learning-to-Rank (LTR)** | Paradigma ML donde el objetivo es ordenar items, no clasificar/regresar individualmente. |
| **Groups/Queries (LTR)** | En Lambdarank, cada "query" (solicitud) define un grupo de candidates. El modelo aprende a rankear dentro de cada grupo. |
| **Feature Extraction** | Proceso de transformar datos crudos (usuario, solicitud, contexto) en vector numérico de 22 features normalizadas. |
| **Retrieval (Two-Stage)** | Primera etapa: filtrar candidatos masivos (ej. geo) → pocos candidatos. Segunda etapa: rankear con modelo costoso (ML). |
| **Lambdarank Objective** | Función de pérdida que aproxima el gradiente de NDCG. `objective='lambdarank'` en LightGBM. |
| **Sigmoid Normalization** | `1 / (1 + exp(-raw_score))` para mapear scores raw de LightGBM a probabilidad [0,1]. |
| **Feature Importance (Gain)** | Importancia de feature medida por reducción total de pérdida (gain) que aporta en los splits del árbol. |
| **Cold Start Problem** | Problema de recomendar items/usuarios nuevos sin historial. VectorRecommender lo resuelve con embeddings semánticos. |
| **Online Learning** | Actualización incremental del modelo con nuevos datos sin reentrenar desde cero (`partial_fit`). |
| **Partial Fit** | Entrenamiento incremental en LightGBM/XGBoost añadiendo árboles al ensemble existente. |
| **Thompson Sampling** | Algoritmo de bandit que muestrea de distribuciones Beta posteriores para balancear exploración/explotación. |
| **Multi-Armed Bandit (MAB)** | Problema de decisión secuencial: elegir entre K opciones (brazos) maximizando recompensa acumulada. |
| **Prior Beta(1,1)** | Distribución a priori uniforme para probabilidad de éxito en Thompson Sampling. |
| **Posterior Beta(α, β)** | Distribución actualizada tras observar `α-1` éxitos y `β-1` fallos. |
| **UCB / Arm Value** | Upper Confidence Bound / Valor del brazo. En Thompson: `α/(α+β)` = media posterior. |
| **Shadow Mode** | Patrón de deployment: modelo nuevo corre en paralelo, loggea predicciones, pero no afecta usuarios. |
| **A/B Testing** | Experimento controlado: grupo A ve versión A, grupo B ve versión B. Métricas comparadas offline/online. |
| **NDCG@K** | Normalized Discounted Cumulative Gain at K. Métrica estándar de ranking (1 = ranking perfecto). |
| **Precision@K** | Proporción de items relevantes en top-K posiciones. |
| **Rank Correlation (Spearman)** | Correlación entre dos rankings (ej. ML vs heurístico). |
| **Divergence Rate** | Porcentaje de queries donde top-1 del modelo A ≠ top-1 del modelo B. |
| **Calibration** | Alineación entre score predicho y probabilidad empírica real (score 0.8 ≈ 80% éxito real). |
| **Feature Engineering** | Proceso de crear/transformar features crudas en señales predictivas (normalización, encoding, interacciones). |
| **Cold Start** | Usuario/item nuevo sin historial → sin features de historial. Solución: features geográficas + categóricas + bandit. |
| **Retrieval vs Ranking** | Retrieval = filtrado rápido (millones → cientos). Ranking = ordenación precisa (cientos → top-10). |
| **PostGIS ST_DWithin** | Función geoespacial: `ST_DWithin(geom1, geom2, distance_meters)` → true si distancia ≤ umbral. |
| **Haversine Formula** | Cálculo distancia esférica entre dos puntos lat/lng. Usado cuando no hay PostGIS. |
| **Sigmoid** | `σ(x) = 1/(1+e⁻ˣ)` mapea ℝ → (0,1). Usado para normalizar scores LightGBM a probabilidad. |
| **Joblib** | Serialización eficiente de objetos Python (modelos ML, numpy arrays). Mejor que pickle para arrays grandes. |
| **Joblib Dump/Load** | `joblib.dump(obj, path)` / `joblib.load(path)` para persistir modelos LightGBM. |

---

## 15. Términos del Proyecto ChambeApp

### Roles de Usuario

| Rol | Código | Descripción |
|-----|--------|-------------|
| **PDS** | `pds` | **Prestador de Servicios** — Trabajador independiente (plomero, electricista, pintor, etc.) que ofrece servicios. |
| **Solicitante** | `solicitante` | Persona natural o empresa que publica una solicitud de trabajo (cliente). |
| **Merchant / Negocio** | `merchant` | Comercio/empresa con local físico que publica anuncios laborales o servicios. |
| **Verificador** | `verificador` | Staff que revisa y aprueba documentos KYC. |
| **Soporte** | `soporte` | Staff de atención al cliente / disputas. |
| **Admin** | `admin` | Administrador regional (gestión usuarios de su región). |
| **Superadmin** | `superadmin` | Superadministrador global (configuración global, tarifas, paquetes, auditoría). |

### Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| **Solicitud** | Publicación de un trabajo/servicio por un Solicitante. Tiene categoría, presupuesto, ubicación, urgencia, estado. |
| **Oferta** | Postulación de un PDS a una Solicitud. Incluye monto, mensaje, fecha/horario propuestos. Estados: pendiente, aceptada, rechazada, contraoferta. |
| **Contrato** | Acuerdo formal tras aceptar oferta. Estados: pendiente, en_progreso, completado_pendiente, completado, cancelado. |
| **Chamba** | Módulo de gestión de obra/servicio en curso. Evidencias, hitos, adendas (marañas), novedades. |
| **Marana** | Adenda/orden de cambio derivada de un contrato (trabajo extra, cambio de alcance). |
| **Anuncio Laboral** | Publicación de Merchant (vacante, servicio, producto). No genera contratos; solo contacto. |
| **Pago Simulado** | Checkout de monedas con estados: pendiente → completado/fallido/expirado (15 min TTL). |
| **Monedas (ChambeCoins)** | Moneda virtual de la plataforma. Se compra con COP real, se gasta en publicar/firmar/activar. |
| **Ledger COP** | Contabilidad interna de ingresos/egresos en pesos colombianos (solo métricas, no retirable). |
| **TrustScore** | Score de confianza del PDS (0-1): KYC, portfolio, ratings, contratos, verificaciones. |
| **KYC** | Know Your Customer. Verificación documental por rol (doc_identidad, validacion_profesional, etc.). |
| **ChambePay** | Pasarela simulada de compra de monedas (pendiente → completado/fallido/expirado). |

### Estados de Solicitud
| Estado | Código | Significado |
|--------|--------|-------------|
| `borrador` | Creada pero no publicada |
| `publicado` | Visible para PDS, aceptando ofertas |
| `en_progreso` | Contrato activo, trabajo en curso |
| `completado` | Trabajo finalizado y confirmado |
| `cancelado` | Cancelado por alguna parte |
| `asignada` | Oferta aceptada, esperando firma dual |
| `oculto` | Oculto por moderación |
| `rechazado` | Rechazado por moderación |

### Estados de Oferta
| Estado | Código |
|--------|--------|
| `pendiente` | Enviada, esperando respuesta |
| `aceptada` | Aceptada por solicitante |
| `rechazada` | Rechazada por solicitante |
| `contraoferta` | Contraoferta activa |
| `cancelada` | Retirada por PDS |

### Estados de Contrato
| Estado | Código |
|--------|--------|
| `pendiente` | Creado, firmas pendientes |
| `en_progreso` | Ambas firmas OK, trabajo iniciado |
| `completado_pendiente` | PDS marcó completo, esperando confirmación solicitante |
| `completado` | Confirmado por ambas partes |
| `cancelado` | Cancelado antes de completar |

### Monedas (ChambeCoins)
| Concepto | Costo (configurable por Superadmin) |
|----------|-------------------------------------|
| Firmar contrato (cada parte) | `trunc((monto × pct_contrato/100) / precio_moneda) + monedas_fijas` ≥ `min_monedas_contrato` |
| Publicar anuncio | `costo_publicar_anuncio` (default 10) |
| Reactivar anuncio | `costo_reactivar_anuncio` (default 5) |
| Paquetes | Configurables: cantidad, bonus, precio COP, ofertas temporales |

### Tarifas Configurables (Superadmin)
| Clave | Default | Descripción |
|-------|---------|-------------|
| `pct_contrato` | 3.0% | % del monto cobrado en monedas a cada parte al firmar |
| `precio_moneda_cop` | 100 COP | Precio referencia 1 moneda (recalcula paquetes al cambiar) |
| `monedas_fijas` | 1 | Monedas fijas sumadas al cobro de contrato |
| `min_monedas_contrato` | 10 | Mínimo monedas por parte al firmar |
| `costo_publicar_anuncio` | 10 | Monedas para publicar anuncio |
| `costo_reactivar_anuncio` | 5 | Monedas para reactivar anuncio |

### Métricas y Analítica
| Tabla | Granularidad | Retención |
|-------|--------------|-----------|
| `metrics_daily` | Diaria (300 días) | 300 días |
| `metrics_segment_monthly` | Mensual por dimensión (10 meses) | 10 meses |

**Dimensiones segmentadas:** region, oficio, genero, edad, urgencia, canal, distancia, primera_oferta, revision_kyc, firma, cohorte, formalidad.

---

## 📚 Referencias de Código Clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `app/ai/recommender.py` | Factory + 4 estrategias (Heuristic, Vector, Hybrid, Shadow) |
| `app/ai/ml_ranker.py` | LightGBM Lambdarank (train/predict/explain) |
| `app/ai/features.py` | FeatureExtractor (22 features normalizadas) |
| `app/ai/train.py` | Script entrenamiento desde BD histórica |
| `app/ai/bandit.py` | Thompson Sampling por categoría |
| `app/ai/geo.py` | Haversine + PostGIS nearby providers |
| `app/ai/ab_testing.py` | A/B group assignment + logging |
| `app/controllers/ai.py` | Endpoints `/recommendations` + `/solicitudes-for-provider` |
| `app/services/metrics_seed.py` | Seed métricas 300 días / 10 meses |
| `app/services/metrics_history.py` | Lectura dashboard histórico |
| `app/models/metrics.py` | Modelos `MetricsDaily`, `MetricsSegmentMonthly` |
| `app/data/seed_habilidades.py` | Catálogo nacional oficios (CUOC/SENA) |

---

## 🔗 Enlaces Rápidos (Comandos Útiles)

```bash
# Entrenar modelo
docker compose -f docker-compose.dev.yml exec -T backend python -m app.ai.train

# Activar ML
docker compose -f docker-compose.dev.yml exec -T db psql -U chambeapp -d chambeapp -c "
UPDATE feature_flags SET enabled=true WHERE key IN ('ml_ranking_enabled','ml_shadow_mode');"

# Ver feature flags
docker compose -f docker-compose.dev.yml exec -T db psql -U chambeapp -d chambeapp -c "
SELECT key, enabled FROM feature_flags WHERE key LIKE 'ml_%';"

# Seed scale 25 (~12.5k users)
docker compose -f docker-compose.dev.yml exec -T backend python seed.py --reset --scale 25

# Ver logs backend
docker compose -f docker-compose.dev.yml logs -f backend
```

---

*Documento generado automáticamente — v1.11.0 — 2026-11-18*  
*Para dudas técnicas: revisar `app/ai/` y `app/controllers/ai.py`*