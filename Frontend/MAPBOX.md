# MAPBOX — Mapa real en ChambeApp

> Componente: `src/components/domain/MapboxMap.tsx` (+ CSS co-locado `ch-mapbox*`).
> Estado: **integrado en los 6 consumidores**; el mapa real se ve **solo con token** (ver Setup).
> Vista de prueba 3D + referencia de configuración: **`/dev/map`** (ver §7 Map Lab).

## 1. Setup para ver el mapa real

1. Obtén un **token público** (`pk.…`) en <https://account.mapbox.com/access-tokens/>
   (scopes: `styles:read`, `tiles:read`; nunca uses `sk.`).
2. Crea `Chambeapp_frontend/.env` (no está en git) con:
   ```
   VITE_MAPBOX_TOKEN=pk.xxxxxxxxxxxxxxxx
   ```
3. Reinicia `npm run dev` (Vite solo lee `.env` al arrancar).

**Sin token nada se rompe**: ver fallback abajo. NO hardcodees el token en
código: se lee únicamente vía `import.meta.env.VITE_MAPBOX_TOKEN`
(tipado en `src/vite-env.d.ts`).

## 2. Comportamiento sin token (contrato del `.env.example`)

`MapboxMap` → renderiza `MapPlaceholder` (el SVG esquemático del DS) con los
pins **proyectados lat/lng → %** alrededor de `center`, más un aviso
accesible `<p role="status">` (no `alert`) que indica que falta
`VITE_MAPBOX_TOKEN`. Lo mismo ocurre si **WebGL no está disponible**, si el
chunk de mapbox **falla al cargar**, o si el **token es inválido** (error de
estilo antes de `load`). La página nunca rompe.

`MapPlaceholder` se **mantiene a propósito**: es parte del contrato de
fallback y demo del DS. No borrar.

## 3. API de props

```ts
type MapPinType = 'job' | 'user' | 'merchant' | 'pds';

interface MapboxPin {
  id: string;
  lat: number;      // shape alineado con GET /api/v1/negocios/mapa (§5 doc arquitectura)
  lng: number;
  type: MapPinType;
  label?: string;
  selected?: boolean;
}

interface MapboxMapProps {
  center: [number, number];            // [lat, lng]
  zoom?: number;                       // default 13 (DEFAULT_ZOOM)
  pins?: MapboxPin[];                  // updates incrementales (no re-crea el mapa)
  radiusKm?: number;                   // círculo GeoJSON fill + línea punteada en center
  onPinClick?: (id: string) => void;   // click/Enter/Space; clusters expanden zoom
  clustering?: boolean;                // default false → supercluster nativo mapbox
  interactive?: boolean;               // default true; false = estático (pins siguen clicables)
  className?: string;                  // el ALTO la define el consumidor
  style?: CSSProperties;               // p.ej. { height: 500 }
  ariaLabel?: string;                  // default 'Mapa interactivo'

  /* Nuevas (3D + ubicación) — todas opcionales; sin ellas el
     comportamiento es idéntico al histórico (retrocompatible): */
  pitch?: number;                      // default 0 — inclinación 3D (0–85), al crear el mapa
  bearing?: number;                    // default 0 — rotación (p.ej. -20), al crear el mapa
  terrain?: boolean;                   // default false — relieve: fuente 'mapbox-dem' + setTerrain
  terrainExaggeration?: number;        // default 1.4 — exageración del relieve
  show3DBuildings?: boolean;           // default false — 3D nativo (standard) o fill-extrusion (clásicos)
  mapStyle?: string;                   // default DEFAULT_MAP_STYLE (light-v11)
  userLocation?: boolean;              // default false — marcador usuario + círculo de precisión
  userPosition?: UserLocationCoords | null; // undefined → autorrequisita geolocation; definido → solo dibuja
  onUserLocationChange?: (coords: UserLocationCoords | null) => void; // resultado de la autorrequisición
  accessToken?: string;                // token runtime (p.ej. /dev/map); si no: VITE_MAPBOX_TOKEN
}

interface UserLocationCoords {
  lat: number; lng: number;
  accuracy: number;   // metros → círculo de precisión
  timestamp: number;  // epoch ms
}

// Constantes exportadas
MEDELLIN_CENTER: [6.2442, -75.5812]
EL_POBLADO_CENTER: [6.2096, -75.5646]
DEFAULT_ZOOM = 13
DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/light-v11'
STANDARD_MAP_STYLE = 'mapbox://styles/mapbox/standard'

// Helpers exportados (testeados)
projectToPercent(center, zoom, lat, lng) → { x, y }  // % para el fallback
circleRing(center, radiusKm, steps?) → [lng,lat][]    // anillo de radio
accuracyRing(lat, lng, accuracyMeters) → [lng,lat][]  // anillo de precisión
boundsForPins(pins) → [[oeste,sur],[este,norte]] | null
fitPinsInView(map, pins, padding?)                    // bounds + fitBounds
```

## 4. Decisiones de implementación

| Tema | Decisión |
|------|----------|
| **Bundle** | `mapbox-gl` + su CSS se cargan con **dynamic `import()`** solo si hay token → chunk async `mapbox-gl-*.js` (~1.83 MB, 503 kB gzip) fuera del bundle principal (index.js +0.08 kB). Sin token, mapbox **jamás se descarga**. |
| **Instancia única / StrictMode** | Un `useEffect` de montaje crea el mapa; flag `cancelled` en cleanup descarta la creación async pendiente y `map.remove()` destruye la instancia. Doble ejecución dev no duplica ni fuga. |
| **Marcadores** | Overlay **React** encima del canvas: reusa `<MapPin>` del DS (misma `ch-pin`, cero duplicación de estilo), posicionado con `map.project()` en cada `move` (rAF-throttled). Actualización incremental natural; foco/teclado del propio MapPin. |
| **Clustering** | `clustering={true}` → fuente GeoJSON con `cluster:true` (supercluster nativo), capas `ch-cluster`/`ch-cluster-count`/`ch-pin-dots`; click en cluster = `getClusterExpansionZoom`; el pin seleccionado se pinta encima como `MapPin` DOM. |
| **Radio** | `radiusKm` → `circleRing()` (72 segmentos) como `fill` 7% + `line` punteada, color leído de los **tokens CSS** (`--coral-500`) vía `getComputedStyle` — cero hex en JS. |
| **Selección** | Pin con `selected` → `easeTo` al centro + resaltado DS (`ch-pin--selected`). |
| **Reduced motion** | `prefers-reduced-motion: reduce` → `jumpTo` en vez de `easeTo`, `scrollZoom` desactivado. |
| **A11y** | Contenedor `role="region"` + `aria-label`; pins DOM enfocables (Tab + Enter/Space); overlay `pointer-events:none` para no tapar los controles de zoom de mapbox (alcanzables por Tab); resumen `sr-only` con `aria-live="polite"` ("N resultados en el mapa…"). Lista alternativa de resultados: los consumidores ya la tienen (columna de `JobCard` en PdsBuscar, peek de `Card` en NegociosMapa). |
| **Errores de token** | Error de estilo ANTES de `load` (401/token inválido) → fallback con aviso "no disponible". Errores de tiles sueltos después de `load` no rompen. |

## 5. Consumidores migrados

| Página | Uso |
|--------|-----|
| `publico/NegociosMapaPage` | pins `MOCK_MAP_PINS` (lat/lng El Poblado), `clustering`, h=500 |
| `publico/NegocioDetallePage` | pin del negocio + `radiusKm=coverageRadius`, `interactive={false}` |
| `pds/PdsBuscarPage` | pins `pdsJobs`, `radiusKm={filterRadius}` (8 km default), `clustering`, fill del `map-box` |
| `negocio/NegocioMiNegocioPage` | `<BusinessMap>` (2 usos): centro coords negocio (default Medellín) + pin + radio cobertura |
| `solicitante/SolicitudDetailPage` | pin con `solicitud.latitud/longitud` reales de la API |
| `dev/ComponentsGallery` | demo MapboxMap (El Poblado, radio 2 km) + demo MapPlaceholder |

Mocks: `MapBusiness`, `BusinessDetail`, `PdsJob`, `BusinessProfile` ahora llevan
`lat`/`lng` (Medellín) además de `x`/`y` legacy. El backend (`/negocios/mapa`)
devuelve pins con `lat`/`lng` (verificado contra `localhost:5000`: `{clusters, pins}`,
hoy vacío por falta de datos seed) → el reemplazo mock→API es directo.

## 6. Pruebas

- Unitarias: `src/components/domain/MapboxMap.test.tsx` — fallback sin token
  (aviso `role="status"` + placeholder + pins proyectados + click/teclado),
  `projectToPercent`, `circleRing`, `boundsForPins`, `accuracyRing`,
  `userLocation` (autorrequisición/denegada/control externo) y props 3D en
  fallback. El token local de `.env` se fuerza a vacío con `vi.stubEnv` para
  que el contrato sea determinista.
- `src/features/dev/MapLab.test.tsx` — smoke de /dev/map (fallback, controles,
  9 URLs de estilo, estados de geolocalización, snippets).
- Manual con token: `/dev` (ComponentsGallery) → mapa con tiles, zoom por
  teclado, radio punteado, click de pin centra y notifica.

## 7. Map Lab — `/dev/map` (vista de prueba 3D + referencia de config)

Página de laboratorio: **`src/features/dev/MapLab.tsx`** (lazy en `routes.tsx`,
misma mecánica que `/dev/components`). NO es un panel de configuración: la
config del mapa es FIJA; la página sirve para (1) VER el 3D con la ubicación
real del usuario y (2) CONSULTAR cómo se configura (código real, copiable).

**URLs de prueba**: `http://localhost:5173/dev/map` (dev) — geolocalización
exige `localhost` o HTTPS (`window.isSecureContext`).

### Config fija que demuestra

```tsx
<MapboxMap
  center={coords ? [coords.lat, coords.lng] : MEDELLIN_CENTER}
  mapStyle="mapbox://styles/mapbox/standard"
  zoom={16.5} pitch={60} bearing={-20}
  terrain terrainExaggeration={1.4}
  show3DBuildings
  userLocation userPosition={coords}
  accessToken={token || undefined}
  style={{ height: 520 }}
/>
```

Al montar pide `navigator.geolocation.getCurrentPosition`: ok → centra ahí +
marcador `ch-mapbox__user` + círculo de precisión (polygon GeoJSON desde
`accuracy`); denegado/timeout/no soportado/contexto inseguro → sigue en
`MEDELLIN_CENTER` con aviso `role="status" aria-live="polite"`. La
geolocalización funciona **aunque no haya token** (MapboxMap dibuja el
marcador proyectado sobre el placeholder).

### Token en runtime (sin editar `.env`)

Si `VITE_MAPBOX_TOKEN` no está en `.env`, la página muestra un Card compacto:
pegar token `pk.…` → "Cargar mapa" → se valida contra
`https://api.mapbox.com/styles/v1/mapbox/standard?access_token=…` (401/403 →
mensaje claro) y se guarda **solo en `localStorage`** (clave
`chambe.mapbox.token`, nunca en el repo). Con token en `.env` se muestra el
`Badge` "token desde .env" y NO el input.

### Los 9 estilos base (URL literal)

| Estilo | URL | Cuándo |
|---|---|---|
| Standard ★ | `mapbox://styles/mapbox/standard` | RECOMENDADO producto: 3D nativo por config |
| Streets | `mapbox://styles/mapbox/streets-v12` | 2D con etiquetas claras |
| Outdoors | `mapbox://styles/mapbox/outdoors-v12` | parques/relieve/rural |
| Satellite | `mapbox://styles/mapbox/satellite-v9` | foto real (sin customizar) |
| Satellite Streets | `mapbox://styles/mapbox/satellite-streets-v12` | foto + etiquetas |
| Navigation Day | `mapbox://styles/mapbox/navigation-day-v1` | rutas de día |
| Navigation Night | `mapbox://styles/mapbox/navigation-night-v1` | rutas/noche |
| Light | `mapbox://styles/mapbox/light-v11` | base neutra para datos (default histórico) |
| Dark | `mapbox://styles/mapbox/dark-v11` | datos claros sobre oscuro |

Estilo propio: `mapbox://styles/<usuario>/<id>` (se crea en
<https://studio.mapbox.com/>), pasa por la prop `mapStyle`.

### Cómo se activa el 3D (los 2 caminos)

| Camino | Cuándo | Cómo |
|---|---|---|
| **3D nativo por config** | solo estilo `standard` | `map.setConfigProperty('basemap', 'show3dObjects', true)` — una línea, los edificios ya vienen en el estilo |
| **Capa `fill-extrusion`** | estilos clásicos (streets/light/dark…) | `addLayer({ type:'fill-extrusion', source:'mapbox', 'source-layer':'building', minzoom:15, filter:['has','height'], paint:{ height:['coalesce',['get','height'],0], … } })` — el clásico NO tiene 3D, se simula; caro de render → minzoom |

`show3DBuildings` detecta el estilo (`mapStyle.includes('/standard')`) y usa
el camino que toca. El **relieve** es común a ambos: fuente `mapbox-dem`
(`raster-dem`, `tileSize: 512`, `maxzoom: 14`) + `map.setTerrain({ source,
exaggeration })`.
