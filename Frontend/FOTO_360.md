# FOTO 360 — captura esférica por anillos

> Componente: `src/features/solicitante/components/SpherePanoCapture.tsx`
> Geometría: `.../components/panorama/sphere.ts`
> Costura: `.../components/panorama/equirect.ts`
> Sensores: `.../components/panorama/useDeviceHeading.ts` (`useDeviceOrientation`)
> Visor: `.../components/PanoViewer.tsx` (Photo Sphere Viewer)
> Banco de pruebas: **`/dev/sphere`**

## 1. Qué resuelve

Antes existía un **barrido de una sola vuelta**: 12 fotos al horizonte, cosidas
como rectángulos en su columna del mapa equirectangular (`stitch.ts`). Funciona
para mirar alrededor, pero **el techo y el suelo quedan vacíos** y las verticales
se deforman.

La captura por anillos cubre la **esfera completa**: 3 pasadas (horizonte, +45°
y −45°) y proyección real de cada foto. Es el mismo enfoque que VFTCam de
Stanford (`vftcam.stanford.edu`), que a su vez es el sucesor de la app de Google
Street View.

## 2. Cómo probarlo

```
npm run dev
# móvil real (misma red) o escritorio:
http://<ip>:5173/dev/sphere
```

`/dev/sphere` permite elegir **puntos por anillo**:

| Modo | Fotos | Para qué |
|------|-------|----------|
| 12 (real) | 36 | Producto real |
| 6 (rápido) | 18 | Probar cobertura en ~20 s |
| 3 (costura) | 9 | Probar la costura en ~5 s |

En escritorio no hay brújula: aparece el botón **Capturar** y cada disparo se
asigna al punto que toca. En un móvil, la app dispara sola al alinear.

## 3. Flujo de captura

```
Abrir modal → cámara trasera en marcha (1920×1080)
  ↓
3 anillos × 12 puntos. El anillo 0 va 0°→330°, el 1 vuelve 330°→0°
(serpentina: no hay que deshacer la vuelta al cambiar de altura), el 2 repite.
  ↓
Asistente SIEMPRE activo: rumbo + inclinación + balanceo + velocidad
  → dice en pantalla y por voz qué hacer ("gira a la derecha", "sube el
    teléfono", "endereza", "más despacio")
  ↓
Con el disparo automático activo, al alinear (y nivelar) 320 ms → dispara sola
  ↓
Al completar los 36 puntos → costura esférica → JPEG equirectangular 2048×1024
```

### 3.1 Asistente (obligatorio) y disparo automático (opcional)

Son **dos cosas distintas**, y esa separación es deliberada:

| | Asistente | Disparo automático |
|--|-----------|--------------------|
| Qué hace | Mide y guía (pantalla + voz) | Dispara sin tocar el botón |
| ¿Se puede apagar? | **No** | Sí (interruptor "Auto") |
| Por qué | Una foto mal tomada no se puede arreglar después | Algunos usuarios prefieren decidir el instante |

Reglas del asistente, en orden de prioridad (`panorama/assist.ts`):

1. **Demasiado rápido** (> 180 °/s) → "Más despacio, la foto sale movida".
2. **Horizonte muy torcido** (|roll| > 32°) → "Endereza el teléfono" y **bloquea
   el disparo**.
3. **Alineado** → "¡Alineado! Mantente firme" (auto) o "Alineado, toca
   Capturar" (manual).
4. **Horizonte algo torcido** (15–32°) → avisa pero **no bloquea**.
5. **Lejos del punto** → "Gira 40° a la derecha", "Sube 30° el teléfono".

El orden no es arbitrario: avisar de una foto inservible va antes que guiar el
movimiento. Si el usuario está girando rápido, decirle "a la derecha" es inútil.

**Por qué dos umbrales de nivel**: con uno solo (15°) cualquier móvil con `gamma`
ruidoso o el teléfono ligeramente inclinado dejaba el disparo automático
bloqueado para siempre. Ahora se avisa a partir de 15° y sólo se bloquea a
partir de 32°.

### 3.0 Guía visual (lo que se ve en pantalla)

| Elemento | Qué muestra |
|----------|-------------|
| **Brújula** (arriba izq.) | Aguja = rumbo actual; marca verde = punto objetivo |
| **Flecha grande** + grados | Hacia dónde girar ("‹ 60°") o inclinar |
| **Horizonte** | Línea que se inclina con el balanceo; verde = nivelado |
| **Barra de acercamiento** | Se llena al acercarse al punto (roja → verde al alinear) |
| **Retícula** | Se agranda y pone verde cuando puede dispararse |
| **Mensaje** | Instrucción exacta con los grados que faltan |

La brújula y las flechas son la forma de ver el giroscopio "contando el giro".
Si no aparecen, es que no llegan eventos del sensor (ver §3.6).

### 3.2 Narración (`useNarration.ts`)

Web Speech API, sin audio empaquetado. Reglas:

- **Antiduplicado**: la misma instrucción no se repite antes de 3.8 s. Sin esto,
  un sensor a 60 Hz diría "gira a la derecha" sesenta veces por segundo.
- **Anticolisión**: instrucciones distintas se separan ≥ 0.9 s y se cancela la
  anterior, para que la voz siga al usuario en vez de encolarse.
- **Voz**: es-CO → es-419 → es. Si no hay voces o el navegador no soporta la
  API, degrada a silencio y todo sigue funcionando en pantalla.
- **iOS**: el primer `speak()` se hace desde el clic de "Empezar captura"
  (`unlock()`), que es el gesto que Apple exige.
- Anuncios de pasada, arranque y fin usan `force` para no ser descartados por el
  antiduplicado.

### 3.3 Medición de la velocidad

La velocidad se mide entre eventos consecutivos de orientación (umbral 180 °/s,
que cruza el encuadre en un tercio de segundo). Los **saltos discretos no
cuentan**: si el evento llega con más de 200 ms de separación, el rumbo cambia
más de 45° de golpe o el cambio es menor de 3° (ruido del sensor), la velocidad
vuelve a 0. Sin ese filtro, el ruido del giroscopio dividido por 16 ms daba
velocidades absurdas y bloqueaba el disparo automático.

### 3.4 Disparo automático con histéresis

El temblor del giroscopio cruza el umbral de 9° constantemente. Si cada cruce
reiniciara el temporizador, **nunca dispararía**. Por eso:

- se **arma** al entrar en 9°;
- sólo se **desarma** si el usuario se aleja más de 1.7× (≈15°);
- al vencer los 320 ms se **recalcula** la distancia y, si se movió más de
  1.4× (≈13°), no dispara.

### 3.5 Sin sensores

`useDeviceOrientation` devuelve `unsupported` en escritorio o `denied` si se
niega el permiso. En ambos casos se cae al obturador manual y el punto se toma
del plan; además se muestra un aviso con **"Activar sensores"** para reintentar.

Dos detalles que costaron un fallo real:

1. **iOS 13+ exige que `requestPermission()` se llame dentro de un gesto.** Por
   eso el hook expone `requestSensors()` y el componente lo invoca en el clic de
   "Empezar captura". Pedirlo desde un `useEffect` hace que Safari lo rechace y
   la captura se queda sin giroscopio (sin guía y sin disparo automático).
2. **Un evento sin datos no debe descartar la fuente.** Al arrancar es normal
   recibir `deviceorientation` con `alpha: null`; si eso marcara la fuente como
   inválida, el giroscopio quedaría muerto toda la sesión. Ahora ese evento se
   ignora y se sigue escuchando.

También se escucha `deviceorientationabsolute` (Android): algunos equipos no
dan `alpha` en la orientación relativa. Las dos fuentes **no se mezclan** para
evitar saltos de rumbo.

## 4. Costura (`equirect.ts`)

Mapeo **inverso**: por cada píxel de la equirectangular se reconstruye su
dirección en el mundo, se lleva al sistema de la cámara que hizo la foto y se
busca el píxel de origen.

```
dirección(yaw, pitch) = (cos p·sen y,  sen p,  cos p·cos y)
base cámara = forward/right/up  (right = up × forward)
nx = (d·right) / (d·forward) / tan(FOVh/2)
ny = (d·up)    / (d·forward) / tan(FOVv/2)
fuera de |n| ≤ 1  → la foto no cubre ese píxel
```

Además:

- **Caja de destino acotada** por foto: sin esto se recorren 2 M de píxeles × 36
  fotos y la costura pasa de ~0.3 s a decenas de segundos.
- **Igualación de exposición**: cada foto se lleva a la luminancia media del
  conjunto (ganancia acotada a 1/1.45–1.45) para que no haya bandas.
- **Fundido radial**: peso 1 en el centro → 0 en el borde; los solapes se
  promedian con pesos acumulados (no se oscurecen).
- **Relleno de polos**: ninguna foto alcanza ±90°; se copia hacia arriba/abajo
  la primera fila con datos de cada columna. Evita los "gorros" negros.

### Rendimiento medido

| Fotos | Costura (Chrome, equipo de desarrollo) |
|-------|----------------------------------------|
| 9     | ~215 ms |
| 36    | ~305 ms |

Todo ocurre en el dispositivo: **ninguna foto sale del navegador** hasta que el
usuario guarda la solicitud.

## 5. Diferencias con el barrido de una vuelta

| | Barrido 1 vuelta (`SweepPanoCapture`) | Anillos (`SpherePanoCapture`) |
|--|--------------------------------------|-------------------------------|
| Fotos | 12 | 36 |
| Cobertura | Banda del horizonte | Esfera completa |
| Proyección | Rectángulo por columna | Esférica (inversa) |
| Polos | Fondo neutro | Rellenos |
| Guía | Sólo rumbo | Rumbo + inclinación |
| Coste | ~1 vuelta | ~3 pasadas |

El barrido rápido se mantiene como opción secundaria en el formulario
("¿Sólo necesitas el horizonte?").

## 6. Límites conocidos

- **FOV asumido de 60°**: `getUserMedia` no expone el FOV real; el vídeo además
  suele ir recortado por estabilización. Si un dispositivo queda con costuras
  desplazadas, el ajuste es `FOV_H` en `SpherePanoCapture.tsx` (o un control de
  calibración como el de VFTCam).
- **Rotación pura**: si el usuario camina mientras gira hay paralaje; es la
  misma limitación de cualquier panorama hecho a pulso.
- **`beta` sólo es fiable en vertical**: se asume el uso normal (teléfono en
  vertical girando ±90°). Con el teléfono boca abajo la inclinación se acota.
- **Memoria**: 2048×1024 en un `ImageData` son ~8 MB más el búfer de pesos. En
  iOS conviene no subir de 2048 sin trocear el proceso.

## 7. Próximos pasos sugeridos

1. **Offload a IndexedDB/OPFS** de las fotos intermedias (VFTCam lo hace) para
   sobrevivir a que el navegador mate la pestaña a mitad de captura.
2. **Reanudar captura**: guardar el plan y las fotos tomadas; hoy se pierde todo
   si se cierra el modal.
3. **Calibración de FOV** por dispositivo (pantalla de ajuste + persistencia).
4. **Tiles multiresolución** para panoramas > 8K (`pannellum generate.py`).
5. **Video 360** con `MediaRecorder` sobre el mismo mapa de proyección.

## 8. Tests

| Archivo | Qué blinda |
|---------|-----------|
| `panorama/sphere.test.ts` | Direcciones, base de cámara, plan, guía, cobertura |
| `panorama/assist.test.ts` | Prioridad de avisos (velocidad → nivel → alineación), `readyToShoot` |
| `panorama/useNarration.test.ts` | Antiduplicado, anticolisión, voz es-CO, degradación a silencio |
| `panorama/equirect.test.ts` | Mapeo píxel a píxel, caja de destino, relleno de polos, costura |
| `panorama/useDeviceHeading.test.ts` | Rumbo (iOS/Android), inclinación (`beta − 90`) y balanceo (`gamma`) |
| `SpherePanoCapture.test.tsx` | Plan de 36, asistente fijo, interruptor Auto, disparo automático/manual, narración, costura, cámara |
