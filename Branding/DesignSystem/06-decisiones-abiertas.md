# 06 — Decisiones Abiertas

> Paso 2 del flujo UI/UX · Decisiones que requieren input del equipo antes de avanzar

---

## D1. Rol `negocio` / `comerciante` no existe en el backend

**Problema:** `src/types/types.ts` define `Role = 'pds' | 'solicitante' | 'verificador' | 'soporte' | 'admin' | 'superadmin'`. Los HTML de `new_view` usan "merchant/comerciante" como un rol separado con su propio sidebar, tabbar y páginas.

**Opciones:**
- **A)** Agregar `'negocio' | 'comerciante'` al tipo `Role` en el backend y frontend
- **B)** Mapear merchant como variante de `solicitante` (un solicitante que también tiene negocio)
- **C)** Crear un sub-tipo `BusinessRole` que se resuelve después del login (ej: un usuario puede ser `solicitante` Y tener un `negocio` asociado)

**Recomendación:** Opción **C** — Un usuario tiene un `Role` del backend (pds/solicitante/etc.) y un flag `tiene_negocio: boolean` que determina si ve las pantallas de merchant. Esto evita romper el modelo de roles existente y es más flexible.

**Impacto:** Afecta `navigation.ts`, `routes.tsx`, y la lógica de `AppShell`.

---

## D2. Roles admin/verificador/soporte/superadmin no tienen UI

**Problema:** `roleNav.ts` define homes para estos 6 roles, pero `new_view` solo tiene HTML para pds, solicitante y merchant. Los roles admin, verificador, soporte y superadmin no tienen ninguna pantalla diseñada.

**Opciones:**
- **A)** Diseñarlos ahora (scope increase)
- **B)** Dejarlos como "próximamente" y focusear en pds + solicitante + merchant
- **C)** Redirigir todos estos roles a `/dashboard` por ahora

**Recomendación:** Opción **C** temporal + **B** en el roadmap. Las pantallas admin/verificador/soporte requieren un diseño completo que escapa del alcance de esta migración.

**Impacto:** `navigation.ts` necesita items para estos roles aunque sean placeholder.

---

## D3. `pds-perfil-publico` vs `pds-perfil-publico-2`

**Problema:** Existen 2 versiones de perfil público:
- `pds-perfil-publico.html` — usa `.profile-cover` + `.profile-head` + `.profile-grid` (con portfolio, skills, badges)
- `pds-perfil-publico-2.html` — usa estructura similar pero con diferencias en layout de skills

**Opciones:**
- **A)** `pds-perfil-publico.html` es el canónico (versión 1)
- **B)** `pds-perfil-publico-2.html` es el canónico (versión 2, más reciente)
- **C)** Fusionar ambas en un solo componente con variantes

**Recomendación:** Opción **C** — Crear `PublicProfilePage.tsx` que fusione lo mejor de ambas. La versión 2 parece una iteración de la 1. Se usa la 2 como base y se agregan los bloques faltantes de la 1.

**Impacto:** 1 componente `PublicProfilePage.tsx` en lugar de 2.

---

## D4. Pantallas huérfanas — ¿entran al scope?

**Problema:** Las siguientes pantallas NO están enlazadas en ningún launcher/sidebar:
- `pds-coins.html` — Coins/compras
- `pds-contratos.html` — Contratos PDS
- `pds-ofertas.html` — Ofertas PDS
- `pds-perfil-publico.html` / `pds-perfil-publico-2.html` — Perfil público
- `merchant-imagenes.html` — Gestión de imágenes
- `merchant-horarios.html` — Gestión de horarios
- `merchant-verificar.html` — Verificación KYC merchant
- 14 `components-*.html` — Viewer de componentes

**Opciones:**
- **A)** Migrarlas todas (scope increase ~30%)
- **B)** Migrar solo las que están enlazadas en launcher (pds-coins no, pero sí perfil-publico y merchant-verificar)
- **C)** Migrar las que tengan datos del backend soportados, descartar las demás

**Recomendación:** Opción **B** — Se migran: `pds-perfil-publico` (fusionada), `merchant-verificar`, `merchant-imagenes`, `merchant-horarios`. Se descartan: `pds-coins`, `pds-contratos` (duplica sol-contratos), `pds-ofertas` (duplica sol-solicitudes), `components-*.html` (son documentación visual, no pantallas reales).

**Impacto:** 4 pantallas adicionales al scope de migración.

---

## D5. Retiro de `pds.css` / `mod-negocios.css`

**Problema:** Al completar la migración, ¿se eliminan completamente o se mantienen como fallback?

**Opciones:**
- **A)** Eliminar al 100% — limpio pero rompe si alguna feature olvidada depende de ellos
- **B)** Mantener como `legacy.css` con solo las reglas no migradas
- **C)** Eliminar y hacer un audit final con `grep` para asegurar 0 referencias

**Recomendación:** Opción **C** — Eliminar completamente. Se hace un `grep` de todas las clases de `pds.css` en el código React para confirmar que 0 clases quedan sin migrar. Si alguna queda, se migra o se agrega al CSS co-locado del componente correspondiente.

**Impacto:** Limpieza completa del codebase. ~100 KB de CSS eliminado.

---

## D6. `index.css` legacy

**Problema:** `src/index.css` existe junto a `src/styles/globals.css` y `src/styles/tokens.css`. No está claro cuál es la fuente de verdad para resets y tipografía base.

**Opciones:**
- **A)** Consolidar todo en `globals.css` y eliminar `index.css`
- **B)** Mantener `index.css` como entry point que importa `globals.css` + `tokens.css`
- **C)** Mover imports a `main.tsx` y eliminar `index.css`

**Recomendación:** Opción **A** — `globals.css` absorbe los resets de `index.css`, `main.tsx` importa `globals.css` + `tokens.css` directamente, `index.css` se elimina.

**Impacto:** 1 archivo menos, imports más limpios.

---

## D7. CSS co-locado: ¿un archivo .css por componente o varios componentes en un .css?

**Problema:** Para componentes muy pequeños (Badge, Pill, Avatar), ¿cada uno tiene su propio `.css` o se agrupan?

**Opciones:**
- **A)** 1 archivo .css por componente (máxima co-locación)
- **B)** Agrupar primitivos pequeños en `ui-primitives.css` (Badge + Pill + Avatar + Checkbox + Radio)
- **C)** 1 archivo .css por componente, pero importar en batch desde `index.ts` del directorio

**Recomendación:** Opción **A** — 1 .css por componente. Vite tree-shakes CSS no utilizado. Si un componente tiene 5 líneas de CSS, igualmente tiene su archivo. Consistencia > ahorro de archivos.

**Impacto:** ~52 archivos `.css` en `src/components/`. Es manejable.

---

## ~~D8. Contraste WCAG AA — `--accent` / `--coral-*` blanco-sobre-coral~~ ✅ RESUELTO

**Resuelto:** 2026-09-16 — Token `--coral-500` oscurecido de `#FF5A5F` a `#D63950` (ratio 4.63:1 vs #FFF, PASS WCAG AA). Token `--coral-600` oscurecido de `#E04E53` a `#CC3347` (ratio 5.09:1 vs #FFF). Nuevo token `--accent-strong: #FF5A5F` preserva el coral original para usos decorativos (bordes, iconos, focus-ring).

**Antes:** Blanco sobre `#FF5A5F` = 3.05:1 ❌ FAIL
**Después:** Blanco sobre `#D63950` = 4.63:1 ✅ PASS

**Documentado en:** `docs/AJUSTE_CONTRASTE.md` (sección de cierre)

---

## Resumen de recomendaciones

| # | Decisión | Recomendación | Riesgo si no se decide |
|---|----------|---------------|------------------------|
| D1 | Rol negocio | Flag `tiene_negocio` (C) | No se puede loguear como merchant |
| D2 | Roles admin/etc | Redirigir a /dashboard (C) | Login falla para estos roles |
| D3 | Perfil público | Fusionar ambas versiones (C) | 2 componentes duplicados |
| D4 | Pantallas huérfanas | Migrar 4, descartar resto (B) | Scope descontrolado |
| D5 | Retiro CSS legacy | Eliminar con audit grep (C) | CSS duplicado persiste |
| D6 | index.css | Consolidar en globals (A) | 3 archivos de estilos confusos |
| D7 | CSS co-locación | 1 .css por componente (A) | Inconsistencia en estructura |
| D8 | Contraste coral AA | ~~Resuelto: coral-500 → #D63950 (4.63:1)~~ ✅ | ~~Botones/burbujas no pasan AA~~ |
