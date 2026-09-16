# Sistema de Diseño — ChambeApp

**Fuente:** Derivado de la implementación UI/UX (UIUX_IMPLEMENTACION.md v1.2, 5 de septiembre de 2026)  
**Aplicación:** Interfaz web — ChambeApp  
**Última actualización:** 5 de septiembre de 2026

---

## 1. Paleta de Colores

### 1.1 Colores de Marca (Coral Scale)

| Token | Valor Hex | Descripción |
|-------|-----------|-------------|
| `--color-coral-400` | `#FF7A7E` | Coral claro — usado para nivel "Confiable" (40-59 pts) y estados hover |
| `--color-coral-500` | `#FF5A5F` | Coral principal — usado para nivel "Verificado" (60-79 pts) y primary accent |
| `--color-coral-600` | `#E04E53` | Coral oscuro — usado para estados hover/active |

### 1.2 Semánticos de Confianza (Trust Score)

| Nivel | Token | Rango | Descripción |
|-------|-------|-------|-------------|
| **Experto** | `--color-success` | 80-100 pts | Verde — rendimiento alto |
| **Verificado** | `--color-coral-500` | 60-79 pts | Coral — confianza media-alta |
| **Confiable** | `--color-coral-400` | 40-59 pts | Coral claro — confianza básica |
| **Nuevo** | `--color-gris-500` | 0-39 pts | Gris medio — nuevo usuario |

### 1.3 Neutros (Escala Gris)

| Token | Valor Hex | Uso típico |
|-------|-----------|------------|
| `--color-gris-50` | `#FAFAFA` | Fondos claros, bg alternado |
| `--color-gris-100` | `#F4F4F3` | Superficies elevadas |
| `--color-gris-200` | `#EAE9E8` | Bordes, separadores |
| `--color-gris-300` | `#D6D5D2` | Estados disabled |
| `--color-gris-500` | `#807E7A` | Texto secundario, muted |
| `--color-gris-700` | `#42403E` | Texto en fondos claros |
| `--color-gris-900` | `#1A1918` | Texto principal, contraste alto |

### 1.4 Semánticos Adicionales

| Token | Valor Hex | Uso |
|-------|-----------|-----|
| `--color-success` | `#2ECC71` | Éxito, validaciones, estados positivos |
| `--color-error` | `#E74C3C` | Errores, estados críticos |

---

## 2. Tipografía

| Token | Familia | Peso | Tamaño | Línea de base | Comentario |
|-------|---------|------|--------|---------------|------------|
| `--font-chambe` | `'Inter', 'Helvetica Neue', Arial, sans-serif` | — | — | — | Fuente principal, importada de Google Fonts |
| Trust Score valor | Inter | 700 | 1.1rem | — | Medidor numérico principal |
| Trust Score nivel | Inter | 600 | 0.8rem | — | Etiqueta de nivel (Experto/Verificado/...) |
| Badge nombre | Inter | 600 | 0.9rem | — | Texto dentro de badges |
| Texto cuerpo | Inter | 400 | 1rem | 1.5 | Uso general en la interfaz |

**Importación:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');`

---

## 3. Escala de Espaciado

| Token | Valor | Uso típico |
|-------|-------|------------|
| Espaciado base | `0.25rem` (4px) | — |
| `--space-xs` | `0.25rem` | Íconos, padding mínimo |
| `--space-sm` | `0.5rem` | Padding de tarjetas, gap de TrustScore |
| `--space-md` | `0.75rem` | Gap de BadgeGrid, márgenes de sección |
| `--space-lg` | `1rem` | Padding de página, separación de secciones |
| `--space-xl` | `1.5rem` | Márgenes grandes, hero sections |

**De la implementación:**
- `TrustScore: gap 0.5rem`
- `BadgeGrid: grid 4 cols, gap 0.75rem`
- `PortfolioGallery: grid 3 cols, gap 0.5rem`

---

## 4. Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-button` | `12px` | Botones, inputs |
| `--radius-card` | `16px` | Tarjetas, contenedores elevados |
| `--radius-gauge` | `50%` | Gauge circular del TrustScore (ojo: valor derivado para el SVG del componente) |

---

## 5. Sombras / Elevation

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.08)` | Sombra de tarjetas, superficies elevadas |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Sombra mínima, inputs enfocados |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.05)` | Sombra moderada, modals |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.1)` | Sombra fuerte, paneles activos |

---

## 6. Principios de Movimiento (Motion)

| Principio | Descripción |
|-----------|-------------|
| **Duración estándar** | 0.3s — transiciones rápidas y responsivas |
| **Duración larga** | 0.6s — animaciones más sutiles (ej. contador TrustScore) |
| **Curva easing** | `ease` — transiciones naturales; `ease-out` para entradas |
| **Reduce motion** | Respetar `prefers-reduced-motion`: transiciones a 0ms o desaparición instantánea |
| **Enter/Exit** | Fade-in/out 0.2s para elementos que aparecen/desaparecen dinámicamente |
| **Interacción** | Stroke-dasharray transition 0.6s para el gauge del TrustScore (trazado del arco) |

---

## 7. Reglas de Accesibilidad y Contraste

| Regla | Especificación |
|-------|----------------|
| **Contraste mínimo** | AA: 4.5:1 para texto normal; 3:1 para texto grande (18pt+ o 14pt negrita) |
| **Contraste AA grande** | 3:1 para texto grande |
| **Contraste AAA** | 7:1 para texto normal; 4.5:1 para texto grande |
| **Colores de estado** | Nunca usar color solo para transmitir información — acompañar de texto/icono |
| **Focus visible** | `:focus-outline` con `2px var(--color-coral-500) solid` sobre fondo neutral |
| **Texto en confianzas** | El valor numérico del TrustScore debe ser legible sobre el color de fondo del gauge |
| **Badges** | Texto en badges debe tener contraste sobre `--color-coral-500` o `--color-gris-900` según el caso |

**Combinaciones verificadas:**
- `--color-gris-900` (#1A1918) sobre `--color-gris-50` (#FAFAFA): contraste 15.3:1 (AAA)
- `--color-gris-500` (#807E7A) sobre `--color-gris-50` (#FAFAFA): contraste 3.6:1 (AA)
- `--color-gris-900` (#1A1918) sobre `--color-gris-100` (#F4F4F3): contraste 12.3:1 (AAA)
- Texto blanco sobre `--color-coral-500` (#FF5A5F): contraste 2.9:1 (fallback — usar `--color-gris-900` como texto sobre coral)

---

## 8. Principios UI

| Principio | Descripción |
|-----------|-------------|
| **Mobile-first** | El diseño se construye para móvil primero y se escala a desktop |
| **BEM** | Convenio de nombres de clases Block—Element—Modifier |
| **Feedback inmediato** | Interacciones (clicks, form submissions) deben dar respuesta visual en < 100ms |
| **Jerarquía visual** | Tamaño y peso de fuente guían el orden de lectura; colores semánticos indican estado |
| **Consistencia semántica** | Los tokens `--color-coral-500`, `--color-success`, `--color-error` siempre significan lo mismo en toda la app |
| **Accesibilidad primero** | El contraste y el enfoque de teclado son requisitos, no opcionales |
| **Estados definidos** | Cada componente debe tener estados: default, hover, active, disabled, focus |
| **Significado de colores** | Coral = verificación/confianza; Verde = éxito/Experto; Rojo = error; Gris = nuevo/neutro |

---

## 9. Referencia Rápida (Cheat Sheet)

```css
/* Colores */
--color-coral-400: #FF7A7E;
--color-coral-500: #FF5A5F;
--color-coral-600: #E04E53;
--color-gris-50: #FAFAFA;
--color-gris-100: #F4F4F3;
--color-gris-200: #EAE9E8;
--color-gris-300: #D6D5D2;
--color-gris-500: #807E7A;
--color-gris-700: #42403E;
--color-gris-900: #1A1918;
--color-success: #2ECC71;
--color-error: #E74C3C;

/* Tipografía */
font-family: var(--font-chambe);
font-weight: 400; /* cuerpo */
font-weight: 600; /* badges, labels */
font-weight: 700; /* títulos, TrustScore valor */
font-size: 1rem; /* cuerpo */
line-height: 1.5;

/* Radio y sombra */
border-radius: var(--radius-card); /* tarjetas */
box-shadow: var(--shadow-card); /* tarjetas */

/* Transiciones */
transition: all 0.3s ease;
transition: stroke-dasharray 0.6s ease; /* gauge TrustScore */
```

---