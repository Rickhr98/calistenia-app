# React + Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the single-file `index.html` calisthenics tracker into a React + Vite + TypeScript project, deployed on GitHub Pages, backed by Supabase (Postgres + magic-link auth) instead of `localStorage`.

**Architecture:** Pure exercise-resolution logic and static routine data live in plain TS modules (`src/data`, `src/lib`). Supabase access is isolated behind three hooks (`useAuth`, `useSettings`, `useLogs`) so components never call the Supabase client directly. UI is composed from hand-vendored shadcn-style primitives (`src/components/ui`) on top of Radix + Tailwind, wired together in `App.tsx`.

**Tech Stack:** React 18, Vite, TypeScript, Vitest + Testing Library, Tailwind CSS, Radix UI primitives (class-variance-authority, clsx, tailwind-merge), `@supabase/supabase-js`, GitHub Actions → GitHub Pages.

## Global Constraints

- Deploy target is GitHub Pages (static only) — repo is `Rickhr98/calistenia-app`, so Vite `base` must be `/calistenia-app/`.
- Routine data (days/equipment/skills/presets) stays as versioned TypeScript config in the repo — never in Supabase.
- User data (`logs`, `user_settings`) lives in Supabase with Row Level Security scoped to `auth.uid()`.
- Auth is magic-link only (no password, no registration form).
- No migration of existing `localStorage` data — new installs start empty.
- No admin UI and no email allowlist in this pass — both are explicitly deferred.
- shadcn/ui components are hand-vendored (copied source, not the interactive CLI) since implementation runs non-interactively.

---

### Task 1: Project scaffold (Vite + React + TypeScript + Vitest)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/env.d.ts`
- Create: `src/setupTests.ts`
- Create: `.gitignore`
- Modify: `.gitignore` (root, replacing none — first creation)

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, and `npm test` for every later task to build on.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "sala-de-skills",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.400.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vite": "^5.4.0",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/calistenia-app/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
```

- [ ] **Step 5: Write `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <title>Sala de Skills</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Write `src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 7: Write a placeholder `src/App.tsx`** (replaced fully in Task 19)

```tsx
export default function App() {
  return <div>Sala de Skills</div>;
}
```

- [ ] **Step 8: Write `src/env.d.ts`**

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 9: Write `src/setupTests.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 10: Write `.gitignore`**

```
node_modules
dist
.env
.env.local
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`
Expected: lockfile `package-lock.json` created, no errors.

- [ ] **Step 12: Verify the scaffold builds and tests run**

Run: `npm test`
Expected: `No test files found` (or similar) — passes with zero tests, no crash.

Run: `npm run build`
Expected: build succeeds, `dist/` created.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts index.html src/main.tsx src/App.tsx src/env.d.ts src/setupTests.ts .gitignore
git commit -m "chore: scaffold Vite + React + TypeScript + Vitest project"
```

---

### Task 2: Tailwind CSS + design tokens + `cn()` utility

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/styles/globals.css`
- Create: `src/lib/utils.ts`
- Test: `src/lib/utils.test.ts`

**Interfaces:**
- Produces: `cn(...classes: ClassValue[]): string` from `src/lib/utils.ts`, used by every component in later tasks.
- Produces: Tailwind theme colors matching the current design (`bg`, `surface`, `surface-2`, `ink`, `muted`, `line`, `accent`, `accent-soft`, `lime`, `amber`, `ok`) and font families (`font-display`, `font-body`, `font-mono`).

- [ ] **Step 1: Write the failing test for `cn()`**

```ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('merges conflicting tailwind classes, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/utils.test.ts`
Expected: FAIL — `Cannot find module './utils'`.

- [ ] **Step 3: Write `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/utils.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#EBEEF3',
        surface: '#FFFFFF',
        'surface-2': '#F3F5F9',
        ink: '#141A24',
        muted: { foreground: '#6A7486' },
        line: '#DDE2EA',
        accent: { DEFAULT: '#4338CA', soft: '#EAE8FD' },
        lime: '#B6E82E',
        amber: '#F0A32B',
        ok: '#18A957',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Note: reference `text-muted-foreground` / `bg-muted-foreground` (not `text-muted`) in every later component, since `muted` is a nested color object here.

- [ ] **Step 6: Write `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Write `src/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  @apply bg-bg text-ink font-body;
  font-size: 15px;
  line-height: 1.5;
}
```

- [ ] **Step 8: Verify the app still builds with Tailwind wired in**

Run: `npm run build`
Expected: build succeeds with no PostCSS/Tailwind errors.

- [ ] **Step 9: Commit**

```bash
git add tailwind.config.ts postcss.config.js src/styles/globals.css src/lib/utils.ts src/lib/utils.test.ts
git commit -m "feat: add Tailwind design tokens and cn() utility"
```

---

### Task 3: Data types and static routine config

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/equipment.ts`
- Create: `src/data/presets.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/days.ts`
- Test: `src/data/days.test.ts`

**Interfaces:**
- Produces: `EquipmentId`, `Equipment`, `Preset`, `HowTo`, `ExerciseType`, `Exercise`, `ExerciseAlt`, `MobilityBlock`, `Day`, `Skill`, `ResolvedExercise`, `LogEntry` types from `src/data/types.ts`.
- Produces: `EQUIPMENT: Record<EquipmentId, Equipment>`, `PRESETS: Record<string, Preset>`, `SKILLS: Record<string, Skill>`, `DAYS: Day[]` — consumed by `lib/routine.ts` (Task 4) and every UI component from Task 12 onward.

- [ ] **Step 1: Write `src/data/types.ts`**

```ts
export type EquipmentId = 'floor' | 'wall' | 'pullbar' | 'dipbar' | 'lowbar' | 'rings' | 'weights';

export interface Equipment {
  label: string;
  fixed?: boolean;
}

export interface Preset {
  label: string;
  hint: string;
  set: EquipmentId[];
}

export interface HowTo {
  c: string[];
  y: string;
}

export type ExerciseType = 'hold' | 'reps';

export interface ExerciseAlt {
  id: string;
  name: string;
  target: string;
  type?: ExerciseType;
  hw?: HowTo;
  equip: EquipmentId[];
}

export interface Exercise {
  id: string;
  name: string;
  target: string;
  type: ExerciseType;
  equip: EquipmentId[];
  skill?: string;
  hw?: HowTo;
  alt?: ExerciseAlt[];
}

export interface MobilityBlock {
  t: string;
  d: string;
  s: string;
}

export interface Day {
  id: string;
  label: string;
  focus: string;
  ex?: Exercise[];
  mobility?: MobilityBlock[];
}

export interface Skill {
  name: string;
  goal: number;
  milestones: number[];
}

export interface ResolvedExercise {
  id: string;
  name: string;
  target: string;
  type: ExerciseType;
  skill: string | null;
  hw?: HowTo;
  adapted: boolean;
  orig?: string;
}

export interface LogEntry {
  id?: number;
  user_id?: string;
  ex_id: string;
  skill: string | null;
  type: ExerciseType;
  value: number;
  created_at?: string;
}
```

- [ ] **Step 2: Write `src/data/equipment.ts`**

```ts
import type { Equipment, EquipmentId } from './types';

export const EQUIPMENT: Record<EquipmentId, Equipment> = {
  floor: { label: 'Suelo', fixed: true },
  wall: { label: 'Pared' },
  pullbar: { label: 'Barra de dominadas' },
  dipbar: { label: 'Barras paralelas' },
  lowbar: { label: 'Barra baja / rail' },
  rings: { label: 'Anillas' },
  weights: { label: 'Pesas' },
};
```

- [ ] **Step 3: Write `src/data/presets.ts`**

```ts
import type { Preset } from './types';

export const PRESETS: Record<string, Preset> = {
  parque: { label: 'Parque', hint: 'barras', set: ['floor', 'pullbar', 'dipbar', 'lowbar'] },
  casa: { label: 'Casa', hint: 'pared + pesas', set: ['floor', 'wall', 'weights'] },
  todo: {
    label: 'Todo',
    hint: 'gym completo',
    set: ['floor', 'wall', 'pullbar', 'dipbar', 'lowbar', 'rings', 'weights'],
  },
};
```

- [ ] **Step 4: Write `src/data/skills.ts`**

```ts
import type { Skill } from './types';

export const SKILLS: Record<string, Skill> = {
  handstand: { name: 'Handstand (chest-to-wall)', goal: 60, milestones: [0, 15, 30, 45, 60] },
  lsit: { name: 'L-sit', goal: 30, milestones: [0, 8, 15, 22, 30] },
  frontlever: { name: 'Front lever (tuck)', goal: 20, milestones: [0, 5, 10, 15, 20] },
};
```

- [ ] **Step 5: Write `src/data/days.ts`** (ported verbatim from the exercise plan in the original `index.html`)

```ts
import type { Day } from './types';

export const DAYS: Day[] = [
  {
    id: 'd1',
    label: 'Día 1',
    focus: 'Handstand + Empuje',
    ex: [
      {
        id: 'kick',
        name: 'Kick-ups a pared',
        target: '5 × 3 intentos',
        type: 'reps',
        equip: ['wall'],
        hw: {
          c: [
            'Manos a un palmo de la pared, dedos abiertos',
            'Mira entre tus manos, no al frente',
            'Patada controlada con una pierna, la otra la sigue',
            'Brazos rectos y hombros empujando siempre',
          ],
          y: 'kick up to handstand wall tutorial',
        },
        alt: [
          {
            id: 'kick_free',
            name: 'Kick-ups libres (buscar equilibrio)',
            target: '5 × 3 intentos',
            hw: {
              c: [
                'Sin pared: patada suave, no tan fuerte',
                'Busca el punto de balance, aguanta 1-2 s',
                'Sal de lado si te pasas, no en arco',
              ],
              y: 'handstand kick up freestanding beginner',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'ctw',
        name: 'Chest-to-wall hold',
        target: '4 × 20–40 s',
        type: 'hold',
        skill: 'handstand',
        equip: ['wall'],
        hw: {
          c: [
            'Sube gateando con el pecho hacia la pared',
            'Cadera sobre hombros, cuerpo en línea recta',
            'Aprieta glúteos y abdomen, costillas metidas',
            'Empuja el suelo (elevación de hombros)',
          ],
          y: 'chest to wall handstand hold tutorial',
        },
        alt: [
          {
            id: 'ctw_free',
            name: 'Handstand libre (holds cortos)',
            target: '4 × 15–30 s',
            hw: {
              c: [
                'Mirada al suelo entre las manos',
                'Corrige con las yemas de los dedos',
                'Cuerpo apretado como una tabla',
              ],
              y: 'freestanding handstand hold beginner',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'wall',
        name: 'Wall hold (alineación)',
        target: '3 × 30 s',
        type: 'hold',
        equip: ['wall'],
        hw: {
          c: [
            'Espalda a la pared, talones apoyados',
            'Camina las manos hacia la pared para alinear',
            'Costillas metidas, sin arquear la espalda',
          ],
          y: 'back to wall handstand alignment',
        },
      },
      {
        id: 'pike',
        name: 'Pike push-ups',
        target: '4 × 6–10',
        type: 'reps',
        equip: ['floor'],
        hw: {
          c: [
            'Cadera arriba en V invertida',
            'Baja la corona de la cabeza hacia el suelo',
            'Codos a unos 45°, no abiertos del todo',
          ],
          y: 'pike push up tutorial form',
        },
      },
      {
        id: 'dip',
        name: 'Fondos / dips',
        target: '4 × 8–12',
        type: 'reps',
        equip: ['dipbar'],
        hw: {
          c: ['Hombros abajo, lejos de las orejas', 'Baja hasta ~90° de codo', 'Ligera inclinación al frente'],
          y: 'parallel bar dips proper form',
        },
        alt: [
          {
            id: 'dip_low',
            name: 'Fondos en barra baja / banco',
            target: '4 × 8–12',
            hw: {
              c: ['Manos al borde, dedos al frente', 'Codos hacia atrás, no afuera', 'Baja controlado hasta 90°'],
              y: 'bench dips proper form',
            },
            equip: ['lowbar'],
          },
          {
            id: 'dip_dia',
            name: 'Flexiones diamante',
            target: '4 × 10–15',
            hw: {
              c: ['Manos en diamante bajo el pecho', 'Codos pegados al cuerpo', 'Cuerpo recto, core firme'],
              y: 'diamond push up form',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'plean',
        name: 'Pseudo planche lean',
        target: '3 × 15–20 s',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: [
            'Manos a la altura de la cadera, dedos afuera/atrás',
            'Inclínate al frente hasta sentir tensión en hombros',
            'Escápulas protraídas (empuja el suelo lejos)',
          ],
          y: 'pseudo planche lean tutorial',
        },
      },
      {
        id: 'press',
        name: 'Press de hombro (pesas)',
        target: '3 × 12',
        type: 'reps',
        equip: ['weights'],
        hw: {
          c: [
            'Core firme, no arquees la lumbar',
            'Sube hasta bloquear codos arriba',
            'Baja controlado a la altura de las orejas',
          ],
          y: 'dumbbell shoulder press form',
        },
        alt: [
          {
            id: 'press_pike',
            name: 'Pike push-ups elevadas',
            target: '3 × 8–12',
            hw: {
              c: [
                'Pies sobre una superficie elevada',
                'Cadera bien arriba para cargar hombros',
                'Corona al suelo, codos a 45°',
              ],
              y: 'elevated pike push up',
            },
            equip: ['floor'],
          },
        ],
      },
    ],
  },
  {
    id: 'd2',
    label: 'Día 2',
    focus: 'Tracción + Front lever + Core',
    ex: [
      {
        id: 'hang',
        name: 'Dead hang (colgado)',
        target: '3 × 20–30 s',
        type: 'hold',
        equip: ['pullbar'],
        hw: {
          c: ['Agarre firme, pulgares alrededor', 'Hombros activos: encoge un poco y sostén', 'Respira, relaja el resto del cuerpo'],
          y: 'active dead hang tutorial',
        },
      },
      {
        id: 'tfl',
        name: 'Tuck front lever hold',
        target: '5 × 10–15 s',
        type: 'hold',
        skill: 'frontlever',
        equip: ['pullbar'],
        hw: {
          c: [
            'Colgado, retrae y deprime las escápulas',
            'Lleva rodillas al pecho y sube la cadera',
            'Tira de la barra hacia tu cadera (brazos rectos)',
            'Busca cuerpo horizontal, espalda paralela al suelo',
          ],
          y: 'tuck front lever tutorial progression',
        },
        alt: [
          {
            id: 'tfl_ring',
            name: 'Tuck front lever en anillas',
            target: '5 × 10–15 s',
            hw: {
              c: [
                'Anillas firmes, gira los pulgares al frente',
                'Mismo tuck: rodillas al pecho, cadera arriba',
                'Controla la inestabilidad extra de las anillas',
              ],
              y: 'tuck front lever rings',
            },
            equip: ['rings'],
          },
        ],
      },
      {
        id: 'row',
        name: 'Remo invertido',
        target: '4 × 8–12',
        type: 'reps',
        equip: ['lowbar'],
        hw: {
          c: ['Cuerpo recto como tabla, talones apoyados', 'Tira del pecho hacia la barra', 'Aprieta escápulas arriba, baja controlado'],
          y: 'inverted row proper form',
        },
        alt: [
          {
            id: 'row_bar',
            name: 'Remo australiano (barra a la cadera)',
            target: '4 × 8–12',
            hw: {
              c: ['Barra a la altura de la cadera', 'Cuerpo recto, pecho a la barra', 'Más horizontal = más difícil'],
              y: 'australian pull up form',
            },
            equip: ['pullbar'],
          },
          {
            id: 'row_wt',
            name: 'Remo con pesa',
            target: '4 × 8–12',
            hw: {
              c: ['Bisagra de cadera, espalda recta', 'Lleva la pesa a la cadera, codo cerca', 'Aprieta la escápula al final'],
              y: 'single arm dumbbell row form',
            },
            equip: ['weights'],
          },
        ],
      },
      {
        id: 'pull',
        name: 'Dominadas',
        target: '4 × máx',
        type: 'reps',
        equip: ['pullbar'],
        hw: {
          c: ['Escápulas abajo antes de tirar', 'Pecho arriba, barbilla sobre la barra', 'Sin balanceo, baja hasta extender'],
          y: 'pull up proper form beginner',
        },
      },
      {
        id: 'hollow',
        name: 'Hollow body hold',
        target: '4 × 20–40 s',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: ['Lumbar pegada al suelo (sin hueco)', 'Brazos y piernas extendidos, hombros arriba', 'Aprieta el abdomen todo el tiempo'],
          y: 'hollow body hold tutorial',
        },
      },
      {
        id: 'arch',
        name: 'Arch / superman hold',
        target: '3 × 20 s',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: ['Boca abajo, brazos al frente', 'Eleva pecho y piernas a la vez', 'Aprieta glúteos, mira al suelo'],
          y: 'superman hold exercise form',
        },
      },
    ],
  },
  {
    id: 'd3',
    label: 'Día 3',
    focus: 'Movilidad · descanso activo',
    mobility: [
      { t: '5 min', d: 'Muñecas', s: 'Flexión/extensión, círculos, apoyo progresivo — base del handstand' },
      { t: '5 min', d: 'Hombros', s: 'Dislocates con banda/palo, flexión de hombro en pared' },
      { t: '5 min', d: 'Compresión de cadera', s: 'Pica sentado, buenos días con isquios — clave para L-sit' },
      { t: '5 min', d: 'Columna', s: 'Gato-camello, rotaciones torácicas' },
    ],
  },
  {
    id: 'd4',
    label: 'Día 4',
    focus: 'L-sit + Piernas + Core',
    ex: [
      {
        id: 'squat',
        name: 'Sentadilla con peso',
        target: '4 × 8–12',
        type: 'reps',
        equip: ['weights'],
        hw: {
          c: ['Pies al ancho de hombros', 'Rodillas siguen la punta de los pies', 'Baja controlado, pecho arriba'],
          y: 'goblet squat form',
        },
        alt: [
          {
            id: 'squat_bw',
            name: 'Sentadilla búlgara / progresión pistol',
            target: '4 × 8–12 c/lado',
            hw: {
              c: ['Pie trasero elevado en un banco', 'Baja recto sobre la pierna de adelante', 'Controla el equilibrio, torso erguido'],
              y: 'bulgarian split squat form',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'rdl',
        name: 'Peso muerto rumano',
        target: '3 × 10',
        type: 'reps',
        equip: ['weights'],
        hw: {
          c: ['Bisagra de cadera, no sentadilla', 'Espalda recta, pesas cerca de las piernas', 'Siente el estiramiento en isquios'],
          y: 'romanian deadlift dumbbell form',
        },
        alt: [
          {
            id: 'rdl_bw',
            name: 'Puente a una pierna / nordic asistido',
            target: '3 × 10 c/lado',
            hw: {
              c: ['Puente: una pierna, sube la cadera y aprieta glúteo', 'Nordic: baja lento controlando con isquios', 'No arquees la lumbar'],
              y: 'single leg glute bridge form',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'lunge',
        name: 'Zancadas',
        target: '3 × 10 c/lado',
        type: 'reps',
        equip: ['floor'],
        hw: {
          c: ['Paso largo, torso recto', 'Rodilla trasera baja hacia el suelo', 'Empuja con el talón de adelante'],
          y: 'reverse lunge form',
        },
      },
      {
        id: 'lsit',
        name: 'Tuck L-sit hold',
        target: '5 × 10–20 s',
        type: 'hold',
        skill: 'lsit',
        equip: ['floor'],
        hw: {
          c: ['Manos al lado de la cadera, empuja el suelo', 'Deprime los hombros (súbete del suelo)', 'Eleva la cadera y encoge las rodillas al pecho'],
          y: 'tuck l sit progression floor',
        },
        alt: [
          {
            id: 'lsit_bar',
            name: 'L-sit en barras paralelas',
            target: '5 × 10–20 s',
            hw: {
              c: ['Brazos rectos y bloqueados en las barras', 'Hombros abajo, no encogidos', 'Rodillas al pecho, sube la cadera'],
              y: 'l sit parallel bars tutorial',
            },
            equip: ['dipbar'],
          },
        ],
      },
      {
        id: 'comp',
        name: 'Compresión activa / leg raises',
        target: '3 × 10–15',
        type: 'reps',
        equip: ['floor'],
        hw: {
          c: ['Lumbar pegada al suelo', 'Sube piernas rectas sin impulso', 'Baja controlado, no dejes caer'],
          y: 'lying leg raises form',
        },
        alt: [
          {
            id: 'comp_hang',
            name: 'Elevaciones de piernas colgado',
            target: '3 × 8–12',
            hw: {
              c: ['Colgado con hombros activos', 'Sube las rodillas o piernas sin balanceo', 'Controla la bajada'],
              y: 'hanging leg raises form',
            },
            equip: ['pullbar'],
          },
        ],
      },
      {
        id: 'hs4',
        name: 'Handstand (práctica corta)',
        target: '5 min de holds',
        type: 'hold',
        skill: 'handstand',
        equip: ['wall'],
        hw: {
          c: ['Repasa alineación contra la pared', 'Series cortas y frescas, calidad > cantidad', 'Trabaja el empuje de hombros'],
          y: 'handstand practice routine wall',
        },
        alt: [
          {
            id: 'hs4_free',
            name: 'Handstand libre (práctica corta)',
            target: '5 min de intentos',
            hw: {
              c: ['Kick-ups suaves buscando balance', 'Corrige con los dedos', 'Sal de lado si te pasas'],
              y: 'freestanding handstand practice',
            },
            equip: ['floor'],
          },
        ],
      },
    ],
  },
  {
    id: 'd5',
    label: 'Día 5',
    focus: 'Skills integrados + Movilidad',
    ex: [
      {
        id: 'balance',
        name: 'Práctica de balance libre',
        target: '10 min',
        type: 'hold',
        skill: 'handstand',
        equip: ['floor'],
        hw: {
          c: ['Mira al suelo entre las manos', 'Micro-ajustes con las yemas de los dedos', 'Si caes al frente, presiona con las puntas'],
          y: 'handstand balance finger tips tutorial',
        },
      },
      {
        id: 'lsit5',
        name: 'L-sit progresión',
        target: '4 × máx',
        type: 'hold',
        skill: 'lsit',
        equip: ['floor'],
        hw: {
          c: ['Avanza: tuck → una pierna → L-sit completo', 'Hombros abajo siempre', 'Compresión activa de la cadera'],
          y: 'l sit progression steps',
        },
        alt: [
          {
            id: 'lsit5_bar',
            name: 'L-sit en barras (progresión)',
            target: '4 × máx',
            hw: {
              c: ['Brazos bloqueados en las barras', 'Sube el nivel: tuck → single → full', 'Hombros deprimidos'],
              y: 'l sit bars progression',
            },
            equip: ['dipbar'],
          },
        ],
      },
      {
        id: 'flprep',
        name: 'Front lever prep escapular',
        target: '4 × 8',
        type: 'reps',
        equip: ['pullbar'],
        hw: {
          c: ['Colgado con brazos rectos', 'Deprime y retrae las escápulas (sube el cuerpo sin doblar codos)', 'Baja controlado, repite'],
          y: 'scapular pull ups tutorial',
        },
        alt: [
          {
            id: 'flprep_floor',
            name: 'Arch + retracción escapular en suelo',
            target: '4 × 20 s',
            hw: {
              c: ['Boca abajo, brazos en Y/T', 'Retrae escápulas y eleva el pecho', 'Aprieta glúteos'],
              y: 'scapular retraction prone floor',
            },
            equip: ['floor'],
          },
        ],
      },
      {
        id: 'core5',
        name: 'Hollow + arch (superset)',
        target: '3 rondas',
        type: 'hold',
        equip: ['floor'],
        hw: {
          c: ['Alterna hollow (boca arriba) y arch (boca abajo)', 'Mantén tensión, sin descanso entre los dos', '20-30 s cada uno por ronda'],
          y: 'hollow body arch superset',
        },
      },
    ],
  },
];
```

- [ ] **Step 6: Write the failing integrity test**

```ts
import { describe, it, expect } from 'vitest';
import { DAYS } from './days';
import { EQUIPMENT } from './equipment';
import type { EquipmentId } from './types';

const validEquip = new Set(Object.keys(EQUIPMENT));

describe('DAYS data integrity', () => {
  it('has exactly 5 days in order d1..d5', () => {
    expect(DAYS.map((d) => d.id)).toEqual(['d1', 'd2', 'd3', 'd4', 'd5']);
  });

  it('every exercise and alt only references known equipment ids', () => {
    const badRefs: string[] = [];
    for (const day of DAYS) {
      for (const ex of day.ex ?? []) {
        for (const id of ex.equip) if (!validEquip.has(id)) badRefs.push(`${day.id}/${ex.id}: ${id}`);
        for (const alt of ex.alt ?? []) {
          for (const id of alt.equip) if (!validEquip.has(id as EquipmentId)) badRefs.push(`${day.id}/${alt.id}: ${id}`);
        }
      }
    }
    expect(badRefs).toEqual([]);
  });

  it('day 3 is mobility-only with no exercises', () => {
    const d3 = DAYS.find((d) => d.id === 'd3')!;
    expect(d3.mobility?.length).toBeGreaterThan(0);
    expect(d3.ex).toBeUndefined();
  });
});
```

- [ ] **Step 7: Run test to verify it fails first, then passes**

Run: `npx vitest run src/data/days.test.ts`
Expected before Step 5's file exists correctly: FAIL. After writing `days.ts`, `equipment.ts`, `types.ts`: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add src/data
git commit -m "feat: port routine data (days, equipment, skills, presets) to typed config"
```

---

### Task 4: Pure routine logic (`lib/routine.ts`)

**Files:**
- Create: `src/lib/routine.ts`
- Test: `src/lib/routine.test.ts`

**Interfaces:**
- Consumes: `EquipmentId`, `Exercise`, `ExerciseAlt`, `ResolvedExercise`, `LogEntry` from `src/data/types.ts`; `PRESETS` from `src/data/presets.ts`; `EQUIPMENT` from `src/data/equipment.ts`.
- Produces: `hasEquip(equipSet, required): boolean`, `sameSet(a, b): boolean`, `resolve(ex, equipSet): ResolvedExercise | null`, `equipLabel(equipSet): string`, `fmtSeconds(s): string`, `bestFor(logs, exId): number`, `lastFor(logs, exId): LogEntry | null`, `bestSkill(logs, skill): number` — consumed by every component from Task 12 onward.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { resolve, hasEquip, sameSet, equipLabel, fmtSeconds, bestFor, lastFor, bestSkill } from './routine';
import type { Exercise, LogEntry } from '../data/types';

describe('hasEquip', () => {
  it('returns true when all required equipment is present', () => {
    expect(hasEquip(['floor', 'wall'], ['wall'])).toBe(true);
  });
  it('returns false when required equipment is missing', () => {
    expect(hasEquip(['floor'], ['wall'])).toBe(false);
  });
});

describe('sameSet', () => {
  it('is true for equal sets regardless of order', () => {
    expect(sameSet(['floor', 'wall'], ['wall', 'floor'])).toBe(true);
  });
  it('is false for different lengths', () => {
    expect(sameSet(['floor'], ['floor', 'wall'])).toBe(false);
  });
});

describe('resolve', () => {
  const ex: Exercise = {
    id: 'dip',
    name: 'Fondos',
    target: '4x8',
    type: 'reps',
    equip: ['dipbar'],
    alt: [{ id: 'dip_low', name: 'Fondos banco', target: '4x8', equip: ['lowbar'] }],
  };

  it('returns the primary exercise when equipment matches', () => {
    const r = resolve(ex, ['floor', 'dipbar']);
    expect(r?.id).toBe('dip');
    expect(r?.adapted).toBe(false);
  });

  it('falls back to an alt when primary equipment is missing', () => {
    const r = resolve(ex, ['floor', 'lowbar']);
    expect(r?.id).toBe('dip_low');
    expect(r?.adapted).toBe(true);
    expect(r?.orig).toBe('Fondos');
  });

  it('returns null when neither primary nor alt equipment is available', () => {
    expect(resolve(ex, ['floor'])).toBeNull();
  });
});

describe('equipLabel', () => {
  it('matches a known preset', () => {
    expect(equipLabel(['floor', 'pullbar', 'dipbar', 'lowbar'])).toBe('Equipo: Parque');
  });
  it('falls back to a manual list beyond two items', () => {
    expect(equipLabel(['floor', 'wall', 'pullbar', 'rings'])).toBe('Equipo: Pared, Barra de dominadas +1');
  });
  it('reports solo suelo when nothing else is selected', () => {
    expect(equipLabel(['floor'])).toBe('Equipo: solo suelo');
  });
});

describe('fmtSeconds', () => {
  it('formats to one decimal place', () => {
    expect(fmtSeconds(12.345)).toBe('12.3');
  });
});

describe('log aggregations', () => {
  const logs: LogEntry[] = [
    { ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 20 },
    { ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 35 },
    { ex_id: 'dip', skill: null, type: 'reps', value: 10 },
  ];

  it('bestFor returns the max value for an exercise', () => {
    expect(bestFor(logs, 'ctw')).toBe(35);
  });
  it('lastFor returns the most recently pushed entry', () => {
    expect(lastFor(logs, 'ctw')?.value).toBe(35);
  });
  it('bestSkill returns the max value across a skill', () => {
    expect(bestSkill(logs, 'handstand')).toBe(35);
  });
  it('returns 0/null for exercises with no logs', () => {
    expect(bestFor(logs, 'unknown')).toBe(0);
    expect(lastFor(logs, 'unknown')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/routine.test.ts`
Expected: FAIL — `Cannot find module './routine'`.

- [ ] **Step 3: Write `src/lib/routine.ts`**

```ts
import type { Exercise, ResolvedExercise, EquipmentId, LogEntry } from '../data/types';
import { PRESETS } from '../data/presets';
import { EQUIPMENT } from '../data/equipment';

export function hasEquip(equipSet: EquipmentId[], required: EquipmentId[]): boolean {
  return required.every((r) => equipSet.includes(r));
}

export function sameSet(a: EquipmentId[], b: EquipmentId[]): boolean {
  return a.length === b.length && a.every((x) => b.includes(x));
}

export function resolve(ex: Exercise, equipSet: EquipmentId[]): ResolvedExercise | null {
  if (hasEquip(equipSet, ex.equip)) {
    return { id: ex.id, name: ex.name, target: ex.target, type: ex.type, skill: ex.skill ?? null, hw: ex.hw, adapted: false };
  }
  if (ex.alt) {
    for (const alt of ex.alt) {
      if (hasEquip(equipSet, alt.equip)) {
        return {
          id: alt.id,
          name: alt.name,
          target: alt.target,
          type: alt.type ?? ex.type,
          skill: ex.skill ?? null,
          hw: alt.hw ?? ex.hw,
          adapted: true,
          orig: ex.name,
        };
      }
    }
  }
  return null;
}

export function equipLabel(equipSet: EquipmentId[]): string {
  for (const preset of Object.values(PRESETS)) {
    if (sameSet(preset.set, equipSet)) return `Equipo: ${preset.label}`;
  }
  const names = equipSet.filter((x) => x !== 'floor').map((x) => EQUIPMENT[x].label);
  if (!names.length) return 'Equipo: solo suelo';
  const shown = names.slice(0, 2).join(', ');
  return `Equipo: ${shown}${names.length > 2 ? ` +${names.length - 2}` : ''}`;
}

export function fmtSeconds(s: number): string {
  return s.toFixed(1);
}

export function bestFor(logs: LogEntry[], exId: string): number {
  return logs.filter((l) => l.ex_id === exId).reduce((m, l) => Math.max(m, l.value), 0);
}

export function lastFor(logs: LogEntry[], exId: string): LogEntry | null {
  const matches = logs.filter((l) => l.ex_id === exId);
  return matches.length ? matches[matches.length - 1] : null;
}

export function bestSkill(logs: LogEntry[], skill: string): number {
  return logs.filter((l) => l.skill === skill).reduce((m, l) => Math.max(m, l.value), 0);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/routine.test.ts`
Expected: PASS (13 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/routine.ts src/lib/routine.test.ts
git commit -m "feat: add pure routine resolution and log aggregation logic"
```

---

### Task 5: Supabase client

**Files:**
- Create: `src/lib/supabaseClient.ts`
- Test: `src/lib/supabaseClient.test.ts`
- Create: `.env.example`

**Interfaces:**
- Produces: `supabase` (a `SupabaseClient`) from `src/lib/supabaseClient.ts` — consumed by `useAuth`, `useSettings`, `useLogs` (Tasks 7–9).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createClientMock = vi.fn(() => ({ mocked: true }));
vi.mock('@supabase/supabase-js', () => ({ createClient: createClientMock }));

describe('supabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
  });

  afterEach(() => vi.unstubAllEnvs());

  it('creates the client with the configured env vars', async () => {
    const { supabase } = await import('./supabaseClient');
    expect(createClientMock).toHaveBeenCalledWith('https://example.supabase.co', 'anon-key');
    expect(supabase).toEqual({ mocked: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/supabaseClient.test.ts`
Expected: FAIL — `Cannot find module './supabaseClient'`.

- [ ] **Step 3: Write `src/lib/supabaseClient.ts`**

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/supabaseClient.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Write `.env.example`**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabaseClient.ts src/lib/supabaseClient.test.ts .env.example
git commit -m "feat: add Supabase client initialized from env vars"
```

---

### Task 6: Supabase schema and setup docs

**Files:**
- Create: `supabase/schema.sql`
- Create: `docs/SUPABASE_SETUP.md`

**Interfaces:**
- Produces: the `logs` and `user_settings` table definitions that `useSettings` (Task 8) and `useLogs` (Task 9) assume exist.

- [ ] **Step 1: Write `supabase/schema.sql`**

```sql
create table logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null default auth.uid(),
  ex_id text not null,
  skill text,
  type text not null check (type in ('hold','reps')),
  value numeric not null,
  created_at timestamptz not null default now()
);

create table user_settings (
  user_id uuid primary key references auth.users default auth.uid(),
  equip_set text[] not null default '{floor}',
  quick_mode boolean not null default false
);

alter table logs enable row level security;
alter table user_settings enable row level security;

create policy "own logs" on logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own settings" on user_settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

- [ ] **Step 2: Write `docs/SUPABASE_SETUP.md`**

```markdown
# Configurar Supabase

1. Crea una cuenta en https://supabase.com y un nuevo proyecto.
2. En el SQL editor del proyecto, ejecuta el contenido de `supabase/schema.sql`.
3. En Project Settings → API, copia:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
4. Crea un archivo `.env` en la raíz del proyecto (no se commitea) con esos dos valores, siguiendo `.env.example`.
5. En Authentication → URL Configuration, agrega la URL de tu GitHub Pages
   (`https://rickhr98.github.io/calistenia-app/`) a "Redirect URLs" para que el magic link funcione en producción.
6. Para el despliegue automático, agrega los mismos dos valores como GitHub Secrets del repositorio
   (Settings → Secrets and variables → Actions → New repository secret), con los mismos nombres:
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
```

- [ ] **Step 3: Commit**

```bash
git add supabase/schema.sql docs/SUPABASE_SETUP.md
git commit -m "docs: add Supabase schema and setup instructions"
```

---

### Task 7: `useAuth` hook

**Files:**
- Create: `src/hooks/useAuth.ts`
- Test: `src/hooks/useAuth.test.ts`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabaseClient.ts`.
- Produces: `useAuth(): { session: Session | null; loading: boolean; signInWithEmail: (email: string) => Promise<{ error: string | null }>; signOut: () => Promise<void> }` — consumed by `App.tsx` (Task 19) and `Login.tsx` (Task 11).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signInWithOtpMock = vi.fn();
const signOutMock = vi.fn();

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
      signInWithOtp: (...args: unknown[]) => signInWithOtpMock(...args),
      signOut: (...args: unknown[]) => signOutMock(...args),
    },
  },
}));

import { useAuth } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    getSessionMock.mockReset().mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockReset().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    signInWithOtpMock.mockReset().mockResolvedValue({ error: null });
    signOutMock.mockReset().mockResolvedValue({ error: null });
  });

  it('starts loading and resolves to no session', async () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it('signInWithEmail calls signInWithOtp and returns no error on success', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    let response: { error: string | null } | undefined;
    await act(async () => {
      response = await result.current.signInWithEmail('me@example.com');
    });
    expect(signInWithOtpMock).toHaveBeenCalledWith(expect.objectContaining({ email: 'me@example.com' }));
    expect(response?.error).toBeNull();
  });

  it('signInWithEmail surfaces the error message on failure', async () => {
    signInWithOtpMock.mockResolvedValue({ error: { message: 'boom' } });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    let response: { error: string | null } | undefined;
    await act(async () => {
      response = await result.current.signInWithEmail('me@example.com');
    });
    expect(response?.error).toBe('boom');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useAuth.test.ts`
Expected: FAIL — `Cannot find module './useAuth'`.

- [ ] **Step 3: Write `src/hooks/useAuth.ts`**

```ts
import { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { session, loading, signInWithEmail, signOut };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useAuth.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAuth.ts src/hooks/useAuth.test.ts
git commit -m "feat: add useAuth hook wrapping Supabase magic-link auth"
```

---

### Task 8: `useSettings` hook

**Files:**
- Create: `src/hooks/useSettings.ts`
- Test: `src/hooks/useSettings.test.ts`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabaseClient.ts`; `EquipmentId` from `src/data/types.ts`.
- Produces: `useSettings(userId: string | null): { equipSet: EquipmentId[]; quickMode: boolean; loading: boolean; setEquipSet: (next: EquipmentId[]) => Promise<void>; setQuickMode: (next: boolean) => Promise<void> }` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const maybeSingleMock = vi.fn();
const upsertMock = vi.fn().mockResolvedValue({ error: null });
const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ select: selectMock, upsert: upsertMock }));

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: (...args: unknown[]) => fromMock(...args) },
}));

import { useSettings } from './useSettings';

describe('useSettings', () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    upsertMock.mockClear();
    maybeSingleMock.mockReset().mockResolvedValue({ data: null });
  });

  it('defaults to floor-only equipment with no user', async () => {
    const { result } = renderHook(() => useSettings(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.equipSet).toEqual(['floor']);
    expect(result.current.quickMode).toBe(false);
  });

  it('loads existing settings for a user', async () => {
    maybeSingleMock.mockResolvedValue({ data: { equip_set: ['floor', 'wall'], quick_mode: true } });
    const { result } = renderHook(() => useSettings('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.equipSet).toEqual(['floor', 'wall']);
    expect(result.current.quickMode).toBe(true);
  });

  it('setEquipSet updates state and upserts', async () => {
    const { result } = renderHook(() => useSettings('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.setEquipSet(['floor', 'pullbar']);
    });
    expect(result.current.equipSet).toEqual(['floor', 'pullbar']);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', equip_set: ['floor', 'pullbar'] })
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useSettings.test.ts`
Expected: FAIL — `Cannot find module './useSettings'`.

- [ ] **Step 3: Write `src/hooks/useSettings.ts`**

```ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { EquipmentId } from '../data/types';

export interface UseSettingsResult {
  equipSet: EquipmentId[];
  quickMode: boolean;
  loading: boolean;
  setEquipSet: (next: EquipmentId[]) => Promise<void>;
  setQuickMode: (next: boolean) => Promise<void>;
}

const DEFAULT_EQUIP: EquipmentId[] = ['floor'];

export function useSettings(userId: string | null): UseSettingsResult {
  const [equipSet, setEquipSetState] = useState<EquipmentId[]>(DEFAULT_EQUIP);
  const [quickMode, setQuickModeState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setEquipSetState(DEFAULT_EQUIP);
      setQuickModeState(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from('user_settings')
      .select('equip_set, quick_mode')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }: { data: { equip_set: EquipmentId[]; quick_mode: boolean } | null }) => {
        if (cancelled) return;
        if (data) {
          setEquipSetState(data.equip_set ?? DEFAULT_EQUIP);
          setQuickModeState(Boolean(data.quick_mode));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = useCallback(
    async (next: { equip_set?: EquipmentId[]; quick_mode?: boolean }) => {
      if (!userId) return;
      await supabase.from('user_settings').upsert({ user_id: userId, equip_set: equipSet, quick_mode: quickMode, ...next });
    },
    [userId, equipSet, quickMode]
  );

  const setEquipSet = useCallback(
    async (next: EquipmentId[]) => {
      setEquipSetState(next);
      await persist({ equip_set: next });
    },
    [persist]
  );

  const setQuickMode = useCallback(
    async (next: boolean) => {
      setQuickModeState(next);
      await persist({ quick_mode: next });
    },
    [persist]
  );

  return { equipSet, quickMode, loading, setEquipSet, setQuickMode };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useSettings.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSettings.ts src/hooks/useSettings.test.ts
git commit -m "feat: add useSettings hook backed by Supabase user_settings"
```

---

### Task 9: `useLogs` hook

**Files:**
- Create: `src/hooks/useLogs.ts`
- Test: `src/hooks/useLogs.test.ts`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabaseClient.ts`; `LogEntry` from `src/data/types.ts`.
- Produces: `useLogs(userId: string | null): { logs: LogEntry[]; loading: boolean; addLog: (entry: Pick<LogEntry,'ex_id'|'skill'|'type'|'value'>) => Promise<void>; wipe: () => Promise<void> }` — consumed by `App.tsx` (Task 19), `DayView`/`ExerciseCard` (Task 17) and `ProgressView` (Task 18).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const orderMock = vi.fn();
const eqSelectMock = vi.fn(() => ({ order: orderMock }));
const selectMock = vi.fn(() => ({ eq: eqSelectMock }));
const insertMock = vi.fn().mockResolvedValue({ error: null });
const eqDeleteMock = vi.fn().mockResolvedValue({ error: null });
const deleteMock = vi.fn(() => ({ eq: eqDeleteMock }));
const fromMock = vi.fn(() => ({ select: selectMock, insert: insertMock, delete: deleteMock }));

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: (...args: unknown[]) => fromMock(...args) },
}));

import { useLogs } from './useLogs';

describe('useLogs', () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqSelectMock.mockClear();
    orderMock.mockReset().mockResolvedValue({ data: [] });
    insertMock.mockClear().mockResolvedValue({ error: null });
    deleteMock.mockClear();
    eqDeleteMock.mockClear().mockResolvedValue({ error: null });
  });

  it('returns an empty list with no user', async () => {
    const { result } = renderHook(() => useLogs(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toEqual([]);
  });

  it('loads logs for a user ordered by created_at', async () => {
    orderMock.mockResolvedValue({ data: [{ ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 30 }] });
    const { result } = renderHook(() => useLogs('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toEqual([{ ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 30 }]);
  });

  it('addLog inserts a row scoped to the user and refreshes', async () => {
    const { result } = renderHook(() => useLogs('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.addLog({ ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 40 });
    });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ ex_id: 'ctw', value: 40, user_id: 'user-1' })
    );
  });

  it('wipe deletes all rows for the user', async () => {
    const { result } = renderHook(() => useLogs('user-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.wipe();
    });
    expect(deleteMock).toHaveBeenCalled();
    expect(eqDeleteMock).toHaveBeenCalledWith('user_id', 'user-1');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useLogs.test.ts`
Expected: FAIL — `Cannot find module './useLogs'`.

- [ ] **Step 3: Write `src/hooks/useLogs.ts`**

```ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { LogEntry } from '../data/types';

export interface UseLogsResult {
  logs: LogEntry[];
  loading: boolean;
  addLog: (entry: Pick<LogEntry, 'ex_id' | 'skill' | 'type' | 'value'>) => Promise<void>;
  wipe: () => Promise<void>;
}

export function useLogs(userId: string | null): UseLogsResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from('logs').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    setLogs((data as LogEntry[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLog = useCallback(
    async (entry: Pick<LogEntry, 'ex_id' | 'skill' | 'type' | 'value'>) => {
      if (!userId) return;
      await supabase.from('logs').insert({ ...entry, user_id: userId });
      await refresh();
    },
    [userId, refresh]
  );

  const wipe = useCallback(async () => {
    if (!userId) return;
    await supabase.from('logs').delete().eq('user_id', userId);
    await refresh();
  }, [userId, refresh]);

  return { logs, loading, addLog, wipe };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useLogs.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLogs.ts src/hooks/useLogs.test.ts
git commit -m "feat: add useLogs hook backed by Supabase logs table"
```

---

### Task 10: UI primitives (Button, Tabs, Progress, Sheet, Input)

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/tabs.tsx`
- Create: `src/components/ui/progress.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/input.tsx`
- Test: `src/components/ui/primitives.test.tsx`

**Interfaces:**
- Consumes: `cn` from `src/lib/utils.ts`.
- Produces: `Button`, `buttonVariants`, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, `Progress`, `Sheet`/`SheetTrigger`/`SheetClose`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetDescription`, `Input` — consumed by every component from Task 11 onward.

- [ ] **Step 1: Write `src/components/ui/button.tsx`**

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] text-sm font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'border border-line bg-surface text-ink',
        primary: 'border border-accent bg-accent text-white',
        dark: 'border border-ink bg-ink text-white',
        ghost: 'text-muted-foreground',
      },
      size: {
        default: 'px-3.5 py-2.5',
        sm: 'px-2.5 py-2',
        lg: 'px-4 py-3.5 text-[15px] justify-center',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';
```

- [ ] **Step 2: Write `src/components/ui/tabs.tsx`**

```tsx
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn('flex gap-1.5 overflow-x-auto px-1 py-1', className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex-none whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] font-semibold text-muted-foreground transition data-[state=active]:border-ink data-[state=active]:bg-ink data-[state=active]:text-white',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = TabsPrimitive.Content;
```

- [ ] **Step 3: Write `src/components/ui/progress.tsx`**

```tsx
import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn('relative h-[9px] w-full overflow-hidden rounded-full bg-surface-2', className)} {...props}>
    <ProgressPrimitive.Indicator
      className={cn('h-full w-full flex-1 rounded-full bg-accent transition-transform', indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
```

- [ ] **Step 4: Write `src/components/ui/sheet.tsx`**

```tsx
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/55 backdrop-blur-sm', className)} {...props} />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetContentClass = cva('fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-auto rounded-t-[22px] bg-surface p-5 shadow-lg');

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content ref={ref} className={cn(sheetContentClass(), className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 text-muted-foreground">
        <X className="h-5 w-5" />
        <span className="sr-only">Cerrar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-center', className)} {...props} />
);

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('font-display text-[17px] font-semibold', className)} {...props} />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('mt-0.5 text-[12.5px] text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
```

- [ ] **Step 5: Write `src/components/ui/input.tsx`**

```tsx
import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'rounded-[9px] border border-line bg-surface-2 px-3 py-2 text-center font-mono text-[15px] font-bold outline-none focus:border-accent',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
```

- [ ] **Step 6: Write the failing smoke tests**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Progress } from './progress';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from './sheet';

describe('Button', () => {
  it('renders children and responds to clicks', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    fireEvent.click(screen.getByText('Guardar'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Tabs', () => {
  it('switches content when a trigger is clicked', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Contenido A</TabsContent>
        <TabsContent value="b">Contenido B</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Contenido A')).toBeInTheDocument();
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByText('Contenido B')).toBeInTheDocument();
  });
});

describe('Progress', () => {
  it('renders without crashing at a given value', () => {
    render(<Progress value={40} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('Sheet', () => {
  it('opens content when the trigger is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('Abrir'));
    expect(screen.getByText('Título')).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/components/ui/primitives.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 8: Commit**

```bash
git add src/components/ui
git commit -m "feat: add hand-vendored shadcn-style UI primitives"
```

---

### Task 11: `Login` component

**Files:**
- Create: `src/components/Login.tsx`
- Test: `src/components/Login.test.tsx`

**Interfaces:**
- Consumes: `useAuth` from `src/hooks/useAuth.ts`; `Button`, `Input` from `src/components/ui`.
- Produces: `Login` component (no props) — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const signInWithEmailMock = vi.fn();
vi.mock('../hooks/useAuth', () => ({ useAuth: () => ({ signInWithEmail: signInWithEmailMock }) }));

import { Login } from './Login';

describe('Login', () => {
  beforeEach(() => signInWithEmailMock.mockReset());

  it('shows a confirmation after a successful magic link request', async () => {
    signInWithEmailMock.mockResolvedValue({ error: null });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'me@example.com' } });
    fireEvent.click(screen.getByText('Enviar link'));
    await waitFor(() => expect(screen.getByText(/Revisa tu correo/)).toBeInTheDocument());
    expect(signInWithEmailMock).toHaveBeenCalledWith('me@example.com');
  });

  it('shows the error message when the request fails', async () => {
    signInWithEmailMock.mockResolvedValue({ error: 'algo salió mal' });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'me@example.com' } });
    fireEvent.click(screen.getByText('Enviar link'));
    await waitFor(() => expect(screen.getByText('algo salió mal')).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/Login.test.tsx`
Expected: FAIL — `Cannot find module './Login'`.

- [ ] **Step 3: Write `src/components/Login.tsx`**

```tsx
import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Login() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await signInWithEmail(email);
    if (error) {
      setErrorMsg(error);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  if (status === 'sent') {
    return (
      <div className="p-6 text-center">
        <p className="font-display text-lg font-semibold">Revisa tu correo</p>
        <p className="mt-2 text-sm text-muted-foreground">Te enviamos un link de acceso a {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6">
      <p className="font-display text-lg font-semibold">Sala de Skills</p>
      <p className="text-sm text-muted-foreground">Escribe tu email para entrar, sin contraseña.</p>
      <Input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full text-left font-body text-base font-normal"
      />
      {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar link'}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/Login.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Login.tsx src/components/Login.test.tsx
git commit -m "feat: add magic-link Login component"
```

---

### Task 12: `Header` component

**Files:**
- Create: `src/components/Header.tsx`
- Test: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: `equipLabel` from `src/lib/routine.ts`; `EquipmentId` from `src/data/types.ts`.
- Produces: `Header(props: { equipSet: EquipmentId[]; quickMode: boolean; onOpenEquip: () => void; onToggleQuick: () => void; onSignOut: () => void })` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('shows the current equipment label and calls onOpenEquip', () => {
    const onOpenEquip = vi.fn();
    render(
      <Header equipSet={['floor', 'wall']} quickMode={false} onOpenEquip={onOpenEquip} onToggleQuick={() => {}} onSignOut={() => {}} />
    );
    expect(screen.getByText(/Pared/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Pared/));
    expect(onOpenEquip).toHaveBeenCalledOnce();
  });

  it('calls onToggleQuick when the quick button is clicked', () => {
    const onToggleQuick = vi.fn();
    render(
      <Header equipSet={['floor']} quickMode={false} onOpenEquip={() => {}} onToggleQuick={onToggleQuick} onSignOut={() => {}} />
    );
    fireEvent.click(screen.getByText('⚡ Rápida'));
    expect(onToggleQuick).toHaveBeenCalledOnce();
  });

  it('calls onSignOut when Salir is clicked', () => {
    const onSignOut = vi.fn();
    render(<Header equipSet={['floor']} quickMode={false} onOpenEquip={() => {}} onToggleQuick={() => {}} onSignOut={onSignOut} />);
    fireEvent.click(screen.getByText('Salir'));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/Header.test.tsx`
Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 3: Write `src/components/Header.tsx`**

```tsx
import { equipLabel } from '../lib/routine';
import type { EquipmentId } from '../data/types';
import { Button } from './ui/button';

interface HeaderProps {
  equipSet: EquipmentId[];
  quickMode: boolean;
  onOpenEquip: () => void;
  onToggleQuick: () => void;
  onSignOut: () => void;
}

export function Header({ equipSet, quickMode, onOpenEquip, onToggleQuick, onSignOut }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[5] bg-gradient-to-b from-bg to-transparent px-[18px] pb-[10px] pt-[22px]">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Sala de Skills</div>
        <button onClick={onSignOut} className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground underline">
          Salir
        </button>
      </div>
      <h1 className="mt-1.5 font-display text-[27px] font-bold tracking-[-0.02em]">Handstand · L-sit · Front lever</h1>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onOpenEquip}
          className="flex min-w-0 flex-1 items-center gap-[7px] rounded-full border border-line bg-surface py-2 pl-[11px] pr-[13px] text-[13px] font-semibold"
        >
          <span className="h-2 w-2 flex-none rounded-full bg-lime" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{equipLabel(equipSet)}</span>
          <span className="ml-auto flex-none text-muted-foreground">▾</span>
        </button>
        <Button onClick={onToggleQuick} className={quickMode ? 'flex-none border-lime bg-lime text-[#2c3a00]' : 'flex-none'}>
          ⚡ Rápida
        </Button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/Header.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Header.test.tsx
git commit -m "feat: add Header component with equipment label and quick toggle"
```

---

### Task 13: `EquipmentSheet` component

**Files:**
- Create: `src/components/EquipmentSheet.tsx`
- Test: `src/components/EquipmentSheet.test.tsx`

**Interfaces:**
- Consumes: `EQUIPMENT` from `src/data/equipment.ts`; `PRESETS` from `src/data/presets.ts`; `sameSet` from `src/lib/routine.ts`; `Sheet*` and `Button` from `src/components/ui`.
- Produces: `EquipmentSheet(props: { open: boolean; onOpenChange: (open: boolean) => void; equipSet: EquipmentId[]; onChange: (next: EquipmentId[]) => void })` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EquipmentSheet } from './EquipmentSheet';

describe('EquipmentSheet', () => {
  it('calls onChange with a preset set when a preset is clicked', () => {
    const onChange = vi.fn();
    render(<EquipmentSheet open onOpenChange={() => {}} equipSet={['floor']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Casa'));
    expect(onChange).toHaveBeenCalledWith(['floor', 'wall', 'weights']);
  });

  it('toggles an individual piece of equipment', () => {
    const onChange = vi.fn();
    render(<EquipmentSheet open onOpenChange={() => {}} equipSet={['floor']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Pared'));
    expect(onChange).toHaveBeenCalledWith(['floor', 'wall']);
  });

  it('does not toggle the fixed floor chip', () => {
    const onChange = vi.fn();
    render(<EquipmentSheet open onOpenChange={() => {}} equipSet={['floor']} onChange={onChange} />);
    fireEvent.click(screen.getByText(/Suelo/));
    expect(onChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/EquipmentSheet.test.tsx`
Expected: FAIL — `Cannot find module './EquipmentSheet'`.

- [ ] **Step 3: Write `src/components/EquipmentSheet.tsx`**

```tsx
import { EQUIPMENT } from '../data/equipment';
import { PRESETS } from '../data/presets';
import { sameSet } from '../lib/routine';
import type { EquipmentId } from '../data/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';

interface EquipmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipSet: EquipmentId[];
  onChange: (next: EquipmentId[]) => void;
}

export function EquipmentSheet({ open, onOpenChange, equipSet, onChange }: EquipmentSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>¿Qué tienes hoy?</SheetTitle>
          <SheetDescription>Elige un preset o marca tus implementos. La rutina se adapta sola.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => {
            const active = sameSet(preset.set, equipSet);
            return (
              <button
                key={key}
                onClick={() => onChange([...preset.set])}
                className={`flex-1 rounded-xl border px-1.5 py-2.5 text-center text-[13px] font-semibold ${
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-surface-2'
                }`}
              >
                {preset.label}
                <small className={`block text-[10px] font-normal ${active ? 'text-[#c9cdd6]' : 'text-muted-foreground'}`}>{preset.hint}</small>
              </button>
            );
          })}
        </div>
        <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Implementos</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.entries(EQUIPMENT) as [EquipmentId, (typeof EQUIPMENT)[EquipmentId]][]).map(([key, equip]) => {
            const on = equipSet.includes(key);
            return (
              <button
                key={key}
                disabled={equip.fixed}
                onClick={() => onChange(on ? equipSet.filter((x) => x !== key) : [...equipSet, key])}
                className={`flex items-center gap-[7px] rounded-[11px] border px-3.5 py-2.5 text-[13px] font-semibold ${
                  on ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-surface text-muted-foreground'
                } ${equip.fixed ? 'opacity-65' : ''}`}
              >
                <span className="grid h-4 w-4 place-items-center rounded-[5px] border-[1.5px] border-current text-[11px]">{on ? '✓' : ''}</span>
                {equip.label}
                {equip.fixed ? ' (siempre)' : ''}
              </button>
            );
          })}
        </div>
        <SheetClose asChild>
          <Button variant="dark" size="lg" className="mt-4 w-full">
            Listo
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/EquipmentSheet.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/EquipmentSheet.tsx src/components/EquipmentSheet.test.tsx
git commit -m "feat: add EquipmentSheet component"
```

---

### Task 14: `ExerciseCard` and `HowToSheet` components

**Files:**
- Create: `src/components/ExerciseCard.tsx`
- Create: `src/components/HowToSheet.tsx`
- Test: `src/components/ExerciseCard.test.tsx`
- Test: `src/components/HowToSheet.test.tsx`

**Interfaces:**
- Consumes: `ResolvedExercise`, `HowTo` from `src/data/types.ts`; `Sheet*`, `Button` from `src/components/ui`.
- Produces: `ExerciseCard(props: { ex: ResolvedExercise; best: number; last: { value: number } | null; onTrack: (id: string) => void; onHowTo: (id: string) => void })` and `HowToSheet(props: { open: boolean; onOpenChange: (open: boolean) => void; name: string; hw: HowTo | null })` — consumed by `DayView` (Task 17) and `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing test for `ExerciseCard`**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseCard } from './ExerciseCard';
import type { ResolvedExercise } from '../data/types';

const holdEx: ResolvedExercise = {
  id: 'ctw',
  name: 'Chest-to-wall hold',
  target: '4 × 20–40 s',
  type: 'hold',
  skill: 'handstand',
  adapted: false,
};

describe('ExerciseCard', () => {
  it('shows the timer action for hold exercises and calls onTrack', () => {
    const onTrack = vi.fn();
    render(<ExerciseCard ex={holdEx} best={30} last={{ value: 25 }} onTrack={onTrack} onHowTo={() => {}} />);
    expect(screen.getByText(/récord 30s/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('⏱ Cronometrar'));
    expect(onTrack).toHaveBeenCalledWith('ctw');
  });

  it('shows the adapted badge with the original exercise name struck through', () => {
    const adapted: ResolvedExercise = { ...holdEx, adapted: true, orig: 'Chest-to-wall hold original' };
    render(<ExerciseCard ex={adapted} best={0} last={null} onTrack={() => {}} onHowTo={() => {}} />);
    expect(screen.getByText('Chest-to-wall hold original')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write the failing test for `HowToSheet`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HowToSheet } from './HowToSheet';

describe('HowToSheet', () => {
  it('lists numbered cues and a youtube search link', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Kick-ups a pared"
        hw={{ c: ['Manos a un palmo de la pared', 'Mira entre tus manos'], y: 'kick up to handstand wall tutorial' }}
      />
    );
    expect(screen.getByText('Manos a un palmo de la pared')).toBeInTheDocument();
    expect(screen.getByText('Ver tutorial en YouTube').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('kick%20up%20to%20handstand%20wall%20tutorial')
    );
  });
});
```

- [ ] **Step 3: Run both to verify they fail**

Run: `npx vitest run src/components/ExerciseCard.test.tsx src/components/HowToSheet.test.tsx`
Expected: FAIL — modules don't exist yet.

- [ ] **Step 4: Write `src/components/ExerciseCard.tsx`**

```tsx
import type { ResolvedExercise } from '../data/types';

interface ExerciseCardProps {
  ex: ResolvedExercise;
  best: number;
  last: { value: number } | null;
  onTrack: (id: string) => void;
  onHowTo: (id: string) => void;
}

export function ExerciseCard({ ex, best, last, onTrack, onHowTo }: ExerciseCardProps) {
  const unit = ex.type === 'hold' ? 's' : ' reps';
  return (
    <div
      className={`mb-2.5 rounded-2xl border p-3.5 ${
        ex.adapted ? 'border-[#cfe6a8] bg-gradient-to-b from-[#fbfef4] to-white' : 'border-line bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div>
          <div className="font-display text-[15.5px] font-semibold leading-tight">{ex.name}</div>
          <div className="mt-0.5 text-[12.5px] text-muted-foreground">
            {ex.target}
            {best ? ` · récord ${best}${unit}` : ''}
          </div>
          {ex.adapted && (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-semibold text-[#4d7a00]">
              ↳ Adaptado a tu equipo <s className="font-normal text-muted-foreground">{ex.orig}</s>
            </div>
          )}
        </div>
        <span
          className={`flex-none rounded-[7px] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.05em] ${
            ex.skill ? 'bg-[#eafad0] text-[#4d7a00]' : ex.type === 'hold' ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted-foreground'
          }`}
        >
          {ex.skill ? 'Skill' : ex.type === 'hold' ? 'Hold' : 'Reps'}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onTrack(ex.id)}
          className={`rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold ${ex.type === 'hold' ? 'bg-ink text-white' : 'bg-accent text-white'}`}
        >
          {ex.type === 'hold' ? '⏱ Cronometrar' : '＋ Registrar'}
        </button>
        {ex.hw && (
          <button
            onClick={() => onHowTo(ex.id)}
            className="flex items-center gap-1 rounded-[10px] px-2.5 py-2.5 text-[13px] text-muted-foreground"
          >
            ⓘ Cómo
          </button>
        )}
        <div className={`ml-auto text-right font-mono text-xs font-bold ${last ? 'text-ok' : 'text-muted-foreground'}`}>
          <span className="block text-[10px] font-normal uppercase tracking-[0.08em] text-muted-foreground">último</span>
          {last ? `${last.value}${unit}` : '—'}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write `src/components/HowToSheet.tsx`**

```tsx
import type { HowTo } from '../data/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';

interface HowToSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  hw: HowTo | null;
}

export function HowToSheet({ open, onOpenChange, name, hw }: HowToSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Puntos clave de técnica</SheetDescription>
        </SheetHeader>
        <ul className="mt-4 list-none p-0">
          {hw?.c.map((cue, i) => (
            <li key={i} className="flex items-start gap-[11px] border-b border-line py-2.5 text-sm last:border-0">
              <span className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-accent-soft font-mono text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span>{cue}</span>
            </li>
          ))}
        </ul>
        {hw && (
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(hw.y)}`}
            target="_blank"
            rel="noopener"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff0033] p-3.5 text-sm font-bold text-white"
          >
            Ver tutorial en YouTube
          </a>
        )}
        <SheetClose asChild>
          <Button className="mt-3.5 w-full text-muted-foreground">Cerrar</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/ExerciseCard.test.tsx src/components/HowToSheet.test.tsx`
Expected: PASS (3 tests total).

- [ ] **Step 7: Commit**

```bash
git add src/components/ExerciseCard.tsx src/components/HowToSheet.tsx src/components/ExerciseCard.test.tsx src/components/HowToSheet.test.tsx
git commit -m "feat: add ExerciseCard and HowToSheet components"
```

---

### Task 15: `TimerSheet` component

**Files:**
- Create: `src/components/TimerSheet.tsx`
- Test: `src/components/TimerSheet.test.tsx`

**Interfaces:**
- Consumes: `fmtSeconds` from `src/lib/routine.ts`; `Sheet*`, `Button`, `Input` from `src/components/ui`.
- Produces: `TimerSheet(props: { open: boolean; onOpenChange: (open: boolean) => void; name: string; target: string; best: number; onSave: (value: number) => void })` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimerSheet } from './TimerSheet';

afterEach(() => vi.useRealTimers());

describe('TimerSheet', () => {
  it('counts up while running and saves the rounded elapsed value', () => {
    vi.useFakeTimers();
    const onSave = vi.fn();
    render(<TimerSheet open onOpenChange={() => {}} name="Chest-to-wall hold" target="4x20-40s" best={0} onSave={onSave} />);
    fireEvent.click(screen.getByText('Iniciar'));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('2.0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Detener'));
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).toHaveBeenCalledWith(2);
  });

  it('prefers the manual value over the stopwatch when provided', () => {
    const onSave = vi.fn();
    render(<TimerSheet open onOpenChange={() => {}} name="Hold" target="target" best={0} onSave={onSave} />);
    fireEvent.change(screen.getByPlaceholderText('seg'), { target: { value: '15' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).toHaveBeenCalledWith(15);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/TimerSheet.test.tsx`
Expected: FAIL — `Cannot find module './TimerSheet'`.

- [ ] **Step 3: Write `src/components/TimerSheet.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { fmtSeconds } from '../lib/routine';

interface TimerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  target: string;
  best: number;
  onSave: (value: number) => void;
}

export function TimerSheet({ open, onOpenChange, name, target, best, onSave }: TimerSheetProps) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [manual, setManual] = useState('');
  const startedAt = useRef(0);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      setRunning(false);
      setManual('');
    }
  }, [open]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 100);
    return () => clearInterval(id);
  }, [running]);

  const toggle = () => {
    if (!running) {
      startedAt.current = Date.now() - elapsed * 1000;
      setRunning(true);
    } else {
      setRunning(false);
    }
  };

  const save = () => {
    const man = parseFloat(manual);
    const value = !Number.isNaN(man) && man > 0 ? man : Math.round(elapsed * 10) / 10;
    if (!value) return;
    onSave(Math.round(value * 10) / 10);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Meta: {target}</SheetDescription>
        </SheetHeader>
        <div className={`my-4 text-center font-mono text-[62px] font-bold tracking-[-0.02em] ${running ? 'text-accent' : ''}`}>
          {fmtSeconds(elapsed)}
        </div>
        <div className="mb-3.5 text-center font-mono text-xs text-muted-foreground">
          {best ? (
            <>
              Tu récord: <b className="text-ok">{best}s</b> — ¡a superarlo!
            </>
          ) : (
            'Primer registro de este ejercicio'
          )}
        </div>
        <div className="flex gap-2.5">
          <Button variant="dark" size="lg" className="flex-[2]" onClick={toggle}>
            {running ? 'Detener' : elapsed > 0 ? 'Reanudar' : 'Iniciar'}
          </Button>
          <Button size="lg" className="flex-1" onClick={save}>
            Guardar
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
          o a mano:
          <Input type="number" inputMode="decimal" placeholder="seg" value={manual} onChange={(e) => setManual(e.target.value)} className="w-[74px]" />
          seg
        </div>
        <SheetClose asChild>
          <Button className="mt-3.5 w-full text-muted-foreground">Cerrar</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/TimerSheet.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/TimerSheet.tsx src/components/TimerSheet.test.tsx
git commit -m "feat: add TimerSheet component with stopwatch and manual entry"
```

---

### Task 16: `RepsSheet` component

**Files:**
- Create: `src/components/RepsSheet.tsx`
- Test: `src/components/RepsSheet.test.tsx`

**Interfaces:**
- Consumes: `Sheet*`, `Button`, `Input` from `src/components/ui`.
- Produces: `RepsSheet(props: { open: boolean; onOpenChange: (open: boolean) => void; name: string; target: string; onSave: (value: number) => void })` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RepsSheet } from './RepsSheet';

describe('RepsSheet', () => {
  it('saves the entered rep count', () => {
    const onSave = vi.fn();
    render(<RepsSheet open onOpenChange={() => {}} name="Dominadas" target="4 × máx" onSave={onSave} />);
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '8' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).toHaveBeenCalledWith(8);
  });

  it('does not save when the input is empty or invalid', () => {
    const onSave = vi.fn();
    render(<RepsSheet open onOpenChange={() => {}} name="Dominadas" target="4 × máx" onSave={onSave} />);
    fireEvent.click(screen.getByText('Guardar'));
    expect(onSave).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/RepsSheet.test.tsx`
Expected: FAIL — `Cannot find module './RepsSheet'`.

- [ ] **Step 3: Write `src/components/RepsSheet.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface RepsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  target: string;
  onSave: (value: number) => void;
}

export function RepsSheet({ open, onOpenChange, name, target, onSave }: RepsSheetProps) {
  const [reps, setReps] = useState('');

  useEffect(() => {
    if (!open) setReps('');
  }, [open]);

  const save = () => {
    const value = parseInt(reps, 10);
    if (!value || value < 0) return;
    onSave(value);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Meta: {target}</SheetDescription>
        </SheetHeader>
        <div className="mt-5 flex items-center justify-center gap-2 text-[15px] text-muted-foreground">
          Reps logradas:
          <Input type="number" inputMode="numeric" placeholder="0" value={reps} onChange={(e) => setReps(e.target.value)} className="w-[88px] text-lg" />
        </div>
        <div className="mt-5 flex gap-2.5">
          <Button variant="primary" size="lg" className="flex-1" onClick={save}>
            Guardar
          </Button>
          <SheetClose asChild>
            <Button size="lg" className="flex-1 text-muted-foreground">
              Cerrar
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/RepsSheet.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/RepsSheet.tsx src/components/RepsSheet.test.tsx
git commit -m "feat: add RepsSheet component"
```

---

### Task 17: `DayView` component

**Files:**
- Create: `src/components/DayView.tsx`
- Test: `src/components/DayView.test.tsx`

**Interfaces:**
- Consumes: `Day`, `EquipmentId`, `LogEntry` from `src/data/types.ts`; `resolve`, `bestFor`, `lastFor` from `src/lib/routine.ts`; `ExerciseCard` from `src/components/ExerciseCard.tsx`; `DAYS` from `src/data/days.ts` (test only).
- Produces: `DayView(props: { day: Day; equipSet: EquipmentId[]; quickMode: boolean; logs: LogEntry[]; onTrack: (exId: string) => void; onHowTo: (exId: string) => void })` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DayView } from './DayView';
import { DAYS } from '../data/days';

describe('DayView', () => {
  it('shows an empty-day message when required equipment is missing', () => {
    const day = DAYS.find((d) => d.id === 'd2')!;
    render(<DayView day={day} equipSet={['floor']} quickMode={false} logs={[]} onTrack={() => {}} onHowTo={() => {}} />);
    expect(screen.getByText('Nada disponible con este equipo')).toBeInTheDocument();
  });

  it('renders resolved exercises for the given equipment', () => {
    const day = DAYS.find((d) => d.id === 'd1')!;
    render(
      <DayView day={day} equipSet={['floor', 'wall', 'dipbar', 'weights']} quickMode={false} logs={[]} onTrack={() => {}} onHowTo={() => {}} />
    );
    expect(screen.getByText('Kick-ups a pared')).toBeInTheDocument();
  });

  it('renders mobility blocks for a mobility-only day, trimmed in quick mode', () => {
    const day = DAYS.find((d) => d.id === 'd3')!;
    render(<DayView day={day} equipSet={['floor']} quickMode logs={[]} onTrack={() => {}} onHowTo={() => {}} />);
    expect(screen.getAllByText(/min/).length).toBe(3);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/DayView.test.tsx`
Expected: FAIL — `Cannot find module './DayView'`.

- [ ] **Step 3: Write `src/components/DayView.tsx`**

```tsx
import { useMemo } from 'react';
import type { Day, EquipmentId, LogEntry, ResolvedExercise } from '../data/types';
import { resolve, bestFor, lastFor } from '../lib/routine';
import { ExerciseCard } from './ExerciseCard';

const QUICK_N = 5;

interface DayViewProps {
  day: Day;
  equipSet: EquipmentId[];
  quickMode: boolean;
  logs: LogEntry[];
  onTrack: (exId: string) => void;
  onHowTo: (exId: string) => void;
}

export function DayView({ day, equipSet, quickMode, logs, onTrack, onHowTo }: DayViewProps) {
  const { shown, hidden } = useMemo(() => {
    if (!day.ex) return { shown: [] as ResolvedExercise[], hidden: 0 };
    const resolved = day.ex.map((ex) => resolve(ex, equipSet));
    const shownAll = resolved.filter((r): r is ResolvedExercise => r !== null);
    const hiddenCount = resolved.length - shownAll.length;
    if (!quickMode) return { shown: shownAll, hidden: hiddenCount };
    const skills = shownAll.filter((x) => x.skill);
    const rest = shownAll.filter((x) => !x.skill);
    return { shown: [...skills, ...rest].slice(0, QUICK_N), hidden: hiddenCount };
  }, [day, equipSet, quickMode]);

  return (
    <div className="px-3.5">
      <div className="flex items-baseline justify-between px-1 pb-2.5 pt-1.5">
        <span className="font-mono text-[13px] font-bold text-accent">{day.label.toUpperCase()}</span>
        <span className="font-display text-[19px] font-semibold">{day.focus}</span>
      </div>

      {day.mobility && (
        <div className="rounded-2xl border border-line bg-surface p-1.5">
          {(quickMode ? day.mobility.slice(0, 3) : day.mobility).map((block, i) => (
            <div key={i} className="flex gap-3 border-b border-line px-3 py-3 last:border-0">
              <div className="w-[46px] flex-none font-mono text-[13px] font-bold text-accent">{block.t}</div>
              <div className="text-[13.5px]">
                {block.d}
                <small className="block text-xs text-muted-foreground">{block.s}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {!day.mobility && quickMode && shown.length > 0 && (
        <div className="mx-1 mb-3 flex items-center gap-2 rounded-xl border border-[#d8ec9f] bg-[#f4fbe0] p-2.5 text-xs font-semibold text-[#4d7a00]">
          ⚡ Rutina rápida · {shown.length} ejercicios (skills primero)
        </div>
      )}

      {!day.mobility && shown.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-[13.5px] text-muted-foreground">
          <b className="mb-1 block font-display text-ink">Nada disponible con este equipo</b>
          Este día necesita implementos que no marcaste. Cambia tu equipo arriba o elige otro día.
        </div>
      )}

      {!day.mobility &&
        shown.map((r) => (
          <ExerciseCard key={r.id} ex={r} best={bestFor(logs, r.id)} last={lastFor(logs, r.id)} onTrack={onTrack} onHowTo={onHowTo} />
        ))}

      {!day.mobility && !quickMode && hidden > 0 && (
        <div className="pb-0.5 pt-1.5 text-center text-xs text-muted-foreground">
          {hidden} ejercicio{hidden > 1 ? 's' : ''} oculto{hidden > 1 ? 's' : ''} por tu equipo actual
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/DayView.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/DayView.tsx src/components/DayView.test.tsx
git commit -m "feat: add DayView component with equipment resolution and quick mode"
```

---

### Task 18: `ProgressView` component

**Files:**
- Create: `src/components/ProgressView.tsx`
- Test: `src/components/ProgressView.test.tsx`

**Interfaces:**
- Consumes: `SKILLS` from `src/data/skills.ts`; `bestSkill` from `src/lib/routine.ts`; `LogEntry` from `src/data/types.ts`; `Progress` from `src/components/ui`.
- Produces: `ProgressView(props: { logs: LogEntry[]; onWipe: () => void })` — consumed by `App.tsx` (Task 19).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressView } from './ProgressView';
import type { LogEntry } from '../data/types';

describe('ProgressView', () => {
  it('shows aggregate stats and per-skill best values', () => {
    const logs: LogEntry[] = [
      { ex_id: 'ctw', skill: 'handstand', type: 'hold', value: 35, created_at: '2026-01-01T00:00:00Z' },
      { ex_id: 'lsit', skill: 'lsit', type: 'hold', value: 10, created_at: '2026-01-02T00:00:00Z' },
    ];
    render(<ProgressView logs={logs} onWipe={() => {}} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('35s')).toBeInTheDocument();
  });

  it('calls onWipe when the reset link is clicked', () => {
    const onWipe = vi.fn();
    render(<ProgressView logs={[]} onWipe={onWipe} />);
    fireEvent.click(screen.getByText('Borrar todos los registros'));
    expect(onWipe).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/ProgressView.test.tsx`
Expected: FAIL — `Cannot find module './ProgressView'`.

- [ ] **Step 3: Write `src/components/ProgressView.tsx`**

```tsx
import { SKILLS } from '../data/skills';
import { bestSkill } from '../lib/routine';
import type { LogEntry } from '../data/types';
import { Progress } from './ui/progress';

interface ProgressViewProps {
  logs: LogEntry[];
  onWipe: () => void;
}

export function ProgressView({ logs, onWipe }: ProgressViewProps) {
  const sessions = new Set(logs.map((l) => new Date(l.created_at ?? 0).toISOString().slice(0, 10))).size;

  return (
    <div className="px-3.5">
      <div className="flex items-baseline justify-between px-1 pb-2.5 pt-1.5">
        <span className="font-mono text-[13px] font-bold text-accent">PROGRESO</span>
        <span className="font-display text-[19px] font-semibold">Tus récords</span>
      </div>

      <div className="mb-3.5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <div className="font-mono text-xl font-bold">{sessions}</div>
          <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">Días activos</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <div className="font-mono text-xl font-bold">{logs.length}</div>
          <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">Registros</div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
          <div className="font-mono text-xl font-bold">{bestSkill(logs, 'handstand') || 0}s</div>
          <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">Mejor HS</div>
        </div>
      </div>

      {Object.entries(SKILLS).map(([key, skill]) => {
        const best = bestSkill(logs, key);
        const pct = Math.min(100, Math.round((best / skill.goal) * 100));
        const hits = logs.filter((l) => l.skill === key).slice(-14);
        const max = Math.max(...hits.map((x) => x.value), 1);
        return (
          <div key={key} className="mb-3 rounded-2xl border border-line bg-surface p-4">
            <h3 className="flex items-baseline justify-between text-base font-semibold">
              {skill.name}
              <span className="font-mono text-[22px] font-bold">
                {best}
                <small className="text-xs font-normal text-muted-foreground">/{skill.goal}s</small>
              </span>
            </h3>
            <Progress value={pct} className="my-3" indicatorClassName={best >= skill.goal ? 'bg-gradient-to-r from-amber to-lime' : undefined} />
            <div className="flex justify-between font-mono text-[10.5px] text-muted-foreground">
              {skill.milestones.map((m) => (
                <span key={m}>{m}s</span>
              ))}
            </div>
            {hits.length ? (
              <div className="mt-3 flex h-[34px] items-end gap-[3px]">
                {hits.map((h, i) => (
                  <i
                    key={i}
                    className={`block flex-1 rounded-t ${h.value === max ? 'bg-accent' : 'bg-accent-soft'}`}
                    style={{ height: `${Math.max(8, (h.value / max) * 100)}%` }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 p-2 text-center text-[12.5px] text-muted-foreground">Aún sin registros — cronométrate en la pestaña del día</div>
            )}
          </div>
        );
      })}

      <button onClick={onWipe} className="mx-auto mt-2 block text-xs text-muted-foreground underline">
        Borrar todos los registros
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/ProgressView.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressView.tsx src/components/ProgressView.test.tsx
git commit -m "feat: add ProgressView component with skill progress and sparkline"
```

---

### Task 19: `App.tsx` wiring

**Files:**
- Modify: `src/App.tsx` (replaces the Task 1 placeholder)
- Test: `src/App.loggedOut.test.tsx`
- Test: `src/App.loggedIn.test.tsx`

**Interfaces:**
- Consumes: `DAYS` from `src/data/days.ts`; `useAuth`, `useSettings`, `useLogs` from `src/hooks`; `Login`, `Header`, `EquipmentSheet`, `DayView`, `ProgressView`, `HowToSheet`, `TimerSheet`, `RepsSheet` from `src/components`; `Tabs`/`TabsList`/`TabsTrigger` from `src/components/ui/tabs.tsx`; `resolve` from `src/lib/routine.ts`.
- Produces: `App` (default export, no props) — the root component rendered by `main.tsx`.

- [ ] **Step 1: Write the failing logged-out test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ session: null, loading: false, signInWithEmail: vi.fn(), signOut: vi.fn() }),
}));
vi.mock('./hooks/useSettings', () => ({
  useSettings: () => ({ equipSet: ['floor'], quickMode: false, loading: false, setEquipSet: vi.fn(), setQuickMode: vi.fn() }),
}));
vi.mock('./hooks/useLogs', () => ({
  useLogs: () => ({ logs: [], loading: false, addLog: vi.fn(), wipe: vi.fn() }),
}));

import App from './App';

describe('App (logged out)', () => {
  it('shows the login screen when there is no session', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Write the failing logged-in test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } }, loading: false, signInWithEmail: vi.fn(), signOut: vi.fn() }),
}));
vi.mock('./hooks/useSettings', () => ({
  useSettings: () => ({
    equipSet: ['floor', 'wall', 'dipbar', 'weights'],
    quickMode: false,
    loading: false,
    setEquipSet: vi.fn(),
    setQuickMode: vi.fn(),
  }),
}));
vi.mock('./hooks/useLogs', () => ({
  useLogs: () => ({ logs: [], loading: false, addLog: vi.fn(), wipe: vi.fn() }),
}));

import App from './App';

describe('App (logged in)', () => {
  it('renders day 1 exercises by default and switches to progress', () => {
    render(<App />);
    expect(screen.getByText('Kick-ups a pared')).toBeInTheDocument();
    fireEvent.click(screen.getByText('📈 Progreso'));
    expect(screen.getByText('PROGRESO')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/App.loggedOut.test.tsx src/App.loggedIn.test.tsx`
Expected: FAIL — current `App.tsx` placeholder doesn't render a login form or day tabs.

- [ ] **Step 4: Write `src/App.tsx`**

```tsx
import { useState } from 'react';
import { DAYS } from './data/days';
import type { ResolvedExercise } from './data/types';
import { resolve } from './lib/routine';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { useLogs } from './hooks/useLogs';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { EquipmentSheet } from './components/EquipmentSheet';
import { DayView } from './components/DayView';
import { ProgressView } from './components/ProgressView';
import { HowToSheet } from './components/HowToSheet';
import { TimerSheet } from './components/TimerSheet';
import { RepsSheet } from './components/RepsSheet';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const { session, loading: authLoading, signOut } = useAuth();
  const userId = session?.user.id ?? null;
  const { equipSet, quickMode, setEquipSet, setQuickMode } = useSettings(userId);
  const { logs, addLog, wipe } = useLogs(userId);

  const [active, setActive] = useState('d1');
  const [equipOpen, setEquipOpen] = useState(false);
  const [howToId, setHowToId] = useState<string | null>(null);
  const [timerEx, setTimerEx] = useState<ResolvedExercise | null>(null);
  const [repsEx, setRepsEx] = useState<ResolvedExercise | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1900);
  };

  if (authLoading) return null;
  if (!session) return <Login />;

  const currentDay = DAYS.find((d) => d.id === active);

  const findResolved = (exId: string): ResolvedExercise | null => {
    for (const day of DAYS) {
      if (!day.ex) continue;
      for (const ex of day.ex) {
        const r = resolve(ex, equipSet);
        if (r?.id === exId) return r;
      }
    }
    return null;
  };

  const handleTrack = (exId: string) => {
    const r = findResolved(exId);
    if (!r) return;
    if (r.type === 'hold') setTimerEx(r);
    else setRepsEx(r);
  };

  const handleSaveHold = async (value: number) => {
    if (!timerEx) return;
    await addLog({ ex_id: timerEx.id, skill: timerEx.skill, type: 'hold', value });
    showToast(`Guardado: ${value}s`);
    setTimerEx(null);
  };

  const handleSaveReps = async (value: number) => {
    if (!repsEx) return;
    await addLog({ ex_id: repsEx.id, skill: repsEx.skill, type: 'reps', value });
    showToast(`Guardado: ${value} reps`);
    setRepsEx(null);
  };

  const handleWipe = async () => {
    if (!window.confirm('¿Borrar todos tus registros? No se puede deshacer.')) return;
    await wipe();
    showToast('Registros borrados');
  };

  const howToEx = howToId ? findResolved(howToId) : null;
  const timerBest = timerEx ? Math.max(0, ...logs.filter((l) => l.ex_id === timerEx.id).map((l) => l.value)) : 0;

  return (
    <div className="mx-auto min-h-screen max-w-[560px] pb-[90px]">
      <Header
        equipSet={equipSet}
        quickMode={quickMode}
        onOpenEquip={() => setEquipOpen(true)}
        onToggleQuick={() => setQuickMode(!quickMode)}
        onSignOut={() => signOut()}
      />

      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {DAYS.map((d) => (
            <TabsTrigger key={d.id} value={d.id}>
              {d.label}
            </TabsTrigger>
          ))}
          <TabsTrigger value="prog">📈 Progreso</TabsTrigger>
        </TabsList>
      </Tabs>

      <main>
        {active === 'prog' || !currentDay ? (
          <ProgressView logs={logs} onWipe={handleWipe} />
        ) : (
          <DayView day={currentDay} equipSet={equipSet} quickMode={quickMode} logs={logs} onTrack={handleTrack} onHowTo={setHowToId} />
        )}
      </main>

      <EquipmentSheet open={equipOpen} onOpenChange={setEquipOpen} equipSet={equipSet} onChange={setEquipSet} />
      <HowToSheet open={!!howToId} onOpenChange={(o) => !o && setHowToId(null)} name={howToEx?.name ?? ''} hw={howToEx?.hw ?? null} />
      {timerEx && (
        <TimerSheet
          open={!!timerEx}
          onOpenChange={(o) => !o && setTimerEx(null)}
          name={timerEx.name}
          target={timerEx.target}
          best={timerBest}
          onSave={handleSaveHold}
        />
      )}
      {repsEx && (
        <RepsSheet open={!!repsEx} onOpenChange={(o) => !o && setRepsEx(null)} name={repsEx.name} target={repsEx.target} onSave={handleSaveReps} />
      )}

      {toastMsg && (
        <div className="fixed bottom-[104px] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-[18px] py-2.5 text-sm font-medium text-white">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/App.loggedOut.test.tsx src/App.loggedIn.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all tests across every task pass.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.loggedOut.test.tsx src/App.loggedIn.test.tsx
git commit -m "feat: wire App.tsx with auth gate, day tabs, and tracking sheets"
```

---

### Task 20: GitHub Pages deployment and legacy cleanup

**Files:**
- Create: `.github/workflows/deploy.yml`
- Delete: legacy root `index.html` content (already replaced by Task 1's Vite entry file — this step just confirms no leftover single-file app content remains)
- Modify: `README.md` (create if absent)

**Interfaces:**
- Produces: an automated build+test+deploy pipeline triggered on push to `master`.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Confirm the legacy single-file app is fully replaced**

Run: `git diff --stat HEAD~19 -- index.html` (or inspect `index.html` directly)
Expected: `index.html` now matches the Task 1 Vite entry file (references `/src/main.tsx`, no inline `<style>`/`<script>` blocks with the old app logic). The old version remains reachable in git history from the "first commit".

- [ ] **Step 3: Write `README.md`**

```markdown
# Sala de Skills

Tracker de calistenia (handstand, L-sit, front lever) construido con React + Vite + TypeScript, desplegado en GitHub Pages, con Supabase para auth (magic link) y persistencia de registros.

## Desarrollo

```bash
npm install
cp .env.example .env   # completa con tus credenciales de Supabase, ver docs/SUPABASE_SETUP.md
npm run dev
```

## Tests

```bash
npm test
```

## Despliegue

Cada push a `master` corre tests, build, y publica a GitHub Pages vía `.github/workflows/deploy.yml`. Requiere los secrets de repo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (ver `docs/SUPABASE_SETUP.md`).
```

- [ ] **Step 4: Enable GitHub Pages for the repo**

In the GitHub repo settings → Pages, set Source to "GitHub Actions" (one-time manual step, cannot be automated from the workflow file itself).

- [ ] **Step 5: Verify the full pipeline locally before pushing**

Run: `npm test && npm run build`
Expected: tests pass, build succeeds, `dist/index.html` references hashed asset filenames under `/calistenia-app/`.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "chore: add GitHub Pages deployment workflow and README"
```

---

## Self-Review Notes

- **Spec coverage:** every spec section is covered — scaffold/stack (Task 1–2), routine data as repo config (Task 3–4), Supabase schema/auth/settings/logs (Tasks 5–9), shadcn-style UI on Tailwind (Task 10), every original UI surface (Tasks 11–18), full wiring (Task 19), and GitHub Pages deployment (Task 20). No `localStorage` import path was added, matching the "start fresh" decision.
- **Type consistency:** `ResolvedExercise`, `LogEntry`, and `EquipmentId` are defined once in `src/data/types.ts` (Task 3) and reused verbatim across `lib/routine.ts`, all three hooks, and every component — no renamed duplicates.
- **Naming note:** `src/lib/utils.ts` (Task 2) holds only the shadcn-style `cn()` helper; the exercise/log business logic lives in the separate `src/lib/routine.ts` (Task 4) to avoid overloading one file with two unrelated responsibilities.
