# Animaciones stick-figure en "Cómo hacerlo" (piloto)

## Contexto

La hoja `HowToSheet` (abierta desde el botón "ⓘ Cómo" en `ExerciseCard`) muestra hoy una lista numerada de puntos clave de técnica (`hw.c`) y un botón que abre una búsqueda de YouTube (`hw.y`). El usuario quiere agregar una animación visual del movimiento, para entender de un vistazo cómo se hace el ejercicio antes de leer el detalle en texto.

Hay ~40 ejercicios (incluyendo variantes `alt`) definidos en `src/data/days.ts`, cada uno con su propio `HowTo` (`{ c: string[], y: string }`). Diseñar una animación única por ejercicio es mucho trabajo para validar antes de comprometerse: este documento cubre un **piloto de 5 ejercicios** para validar el estilo visual y el mecanismo técnico.

## Alcance

**Incluido en el piloto:**
- Animación para 5 ejercicios: Dominadas (`pull`), Pike push-ups (`pike`), Zancadas (`lunge`), Hollow body hold (`hollow`), Chest-to-wall hold (`ctw`).
- El primitivo visual (`StickFigure`) y el mecanismo de animación (CSS keyframes por segmento corporal).
- Integración en `HowToSheet` con fallback correcto para ejercicios sin animación mapeada.

**Explícitamente fuera de alcance (decisión, no pendiente):**
- Animaciones para el resto de los ~35+ ejercicios/variantes. Se evalúa después de validar el piloto.
- Controles de reproducción (play/pause/velocidad).
- Un sistema genérico de "poses" parametrizadas por datos (JSON de ángulos, etc.). Con solo 5 animaciones, cada una se define directamente en CSS; si se escala a todos los ejercicios más adelante, se puede revisar si conviene un sistema data-driven.
- Video embebido o GIFs (opciones descartadas en brainstorming a favor del stick-figure SVG/CSS).

## Diseño visual

Pictograma minimalista tipo señalética: círculo para la cabeza, líneas rectas de trazo grueso para torso, brazos (superior + antebrazo) y piernas (muslo + pantorrilla), sin detalle anatómico. Consistente con el estilo limpio de la app.

## Componentes técnicos

### `StickFigure` (`src/components/exercise-animations/StickFigure.tsx`)

Componente SVG reutilizable. Renderiza la figura con cada segmento articulado en su propio `<g>` con una clase fija y estable para poder ser targeteado por CSS externo:

- `.torso`
- `.shoulder-l` / `.shoulder-r` (brazo superior)
- `.elbow-l` / `.elbow-r` (antebrazo)
- `.hip-l` / `.hip-r` (muslo)
- `.knee-l` / `.knee-r` (pantorrilla)

Recibe un prop `className` que se aplica al `<svg>` raíz — esa clase es la que activa la animación específica del ejercicio (ver siguiente sección). El propio `StickFigure` no sabe nada de qué ejercicio se está animando: solo expone los ganchos (hooks) de clase.

### `exercise-animations.css` (`src/components/exercise-animations/exercise-animations.css`)

Un archivo CSS con un bloque por ejercicio piloto. Ejemplo de forma (valores de ángulos ilustrativos, se ajustan visualmente durante implementación):

```css
.anim-pull .shoulder-l { animation: pull-shoulder-l 1.4s ease-in-out infinite; }
.anim-pull .elbow-l    { animation: pull-elbow-l 1.4s ease-in-out infinite; }
/* ...resto de segmentos relevantes para dominadas... */

@keyframes pull-shoulder-l {
  0%, 100% { transform: rotate(10deg); }
  50%      { transform: rotate(-40deg); }
}
```

Cada ejercicio anima solo los segmentos relevantes a su movimiento (ej. Zancadas anima piernas + torso, Hollow body anima una traslación/rotación leve del torso completo, no brazos/piernas). Los segmentos no animados quedan en su pose neutra por defecto.

Se importa una vez de forma global (junto a `globals.css` o vía `main.tsx`).

**Accesibilidad:** un bloque `@media (prefers-reduced-motion: reduce)` fija `animation: none` globalmente para todas las clases `.anim-*`, dejando la figura en una pose estática neutra.

### Mapeo de ejercicio → animación (`src/components/exercise-animations/index.ts`)

```ts
export const EXERCISE_ANIMATIONS: Record<string, string> = {
  pull: 'anim-pull',
  pike: 'anim-pike',
  lunge: 'anim-lunge',
  hollow: 'anim-hollow',
  ctw: 'anim-ctw',
};
```

Un `id` de ejercicio que no está en este objeto simplemente no tiene animación — comportamiento actual sin cambios.

### Cambios en `HowToSheet`

- Nuevo prop `exerciseId: string | null`.
- Si `EXERCISE_ANIMATIONS[exerciseId]` existe, renderiza `<StickFigure className={...} />` dentro de un contenedor (ej. `160px` de alto, centrado, fondo `bg-surface-2` consistente con el resto de la UI) entre el `SheetHeader` y la lista de cues.
- Si no existe mapeo para ese id, no se renderiza nada en esa zona (la lista de cues y el botón de YouTube quedan exactamente igual que hoy).

### Cambios en `App.tsx`

- Pasar el prop nuevo: `<HowToSheet ... exerciseId={howToId} />`. El estado `howToId` ya existe y contiene el id del ejercicio abierto.

## Testing

En `HowToSheet.test.tsx`:
1. Al pasar un `exerciseId` presente en `EXERCISE_ANIMATIONS` (ej. `'pull'`), se renderiza el contenedor de animación (verificable por un `data-testid` o rol accesible en `StickFigure`).
2. Al pasar un `exerciseId` ausente del mapeo (o `null`), no se renderiza el contenedor de animación, y el resto del comportamiento existente (cues, link de YouTube) sigue funcionando sin cambios — cubre el caso por defecto para los ~35+ ejercicios sin animación.

No se agregan tests de regresión visual (las animaciones CSS no se verifican pixel a pixel); el criterio de aceptación visual es revisión manual en el navegador durante el piloto.

## Criterio de éxito del piloto

El usuario revisa las 5 animaciones en el navegador y decide si:
(a) se extiende el mismo mecanismo al resto de ejercicios, o
(b) se ajusta el estilo/mecanismo antes de escalar.
