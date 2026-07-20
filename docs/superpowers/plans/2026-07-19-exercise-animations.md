# Exercise Stick-Figure Animations (Pilot) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a looping stick-figure SVG animation of the movement above the technique cues in `HowToSheet`, for a 5-exercise pilot (Dominadas, Pike push-ups, Zancadas, Hollow body hold, Chest-to-wall hold), with no visual change for any other exercise.

**Architecture:** A reusable `StickFigure` SVG component exposes per-joint CSS class hooks (shoulder/elbow/hip/knee, left and right, plus torso). A single CSS file defines one `@keyframes` set per pilot exercise, scoped under a root class (e.g. `.anim-pull`). A plain object maps exercise id → root class name. `HowToSheet` looks up the exercise id in that map and, if found, renders `<StickFigure className={...} />` in a fixed-height container above the existing cues list; if not found, renders nothing there (unchanged behavior).

**Tech Stack:** React + TypeScript, Tailwind CSS (existing), plain CSS `@keyframes` (no animation library), Vitest + Testing Library (existing).

## Global Constraints

- No new npm dependencies — pure SVG + CSS, matching the design spec's decision to avoid video/GIF/animation-library approaches.
- Respect `prefers-reduced-motion: reduce` — animations must not play for users who request reduced motion.
- Exercises with no entry in the animation map must render exactly as they do today in `HowToSheet` (no empty boxes, no layout shift beyond the new container itself).
- Pilot covers exactly these 5 exercise ids from `src/data/days.ts`: `pull`, `pike`, `lunge`, `hollow`, `ctw`.

---

## File Structure

- Create: `src/components/exercise-animations/StickFigure.tsx` — the SVG primitive.
- Create: `src/components/exercise-animations/StickFigure.test.tsx` — structural test for the primitive.
- Create: `src/components/exercise-animations/exercise-animations.css` — one `@keyframes` block set per pilot exercise + reduced-motion override.
- Create: `src/components/exercise-animations/index.ts` — `EXERCISE_ANIMATIONS` map + re-export of `StickFigure`.
- Create: `src/components/exercise-animations/index.test.ts` — test for the map contents.
- Modify: `src/main.tsx` — import the new CSS file globally.
- Modify: `src/components/HowToSheet.tsx` — new `exerciseId` prop, conditional render of `StickFigure`.
- Modify: `src/components/HowToSheet.test.tsx` — cover mapped vs. unmapped `exerciseId`.
- Modify: `src/App.tsx` — pass `exerciseId={howToId}` to `<HowToSheet>`.

---

### Task 1: `StickFigure` SVG primitive

**Files:**
- Create: `src/components/exercise-animations/StickFigure.tsx`
- Test: `src/components/exercise-animations/StickFigure.test.tsx`

**Interfaces:**
- Consumes: nothing (leaf component).
- Produces: `StickFigure({ className }: { className: string })` — a React component. Renders an `<svg data-testid="stick-figure">` containing, as direct or nested descendants, elements with these exact class names (used by CSS in Task 2 and asserted by this task's test): `torso`, `shoulder-l`, `shoulder-r`, `elbow-l`, `elbow-r`, `hip-l`, `hip-r`, `knee-l`, `knee-r`. The `className` prop is applied to the root `<svg>`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/exercise-animations/StickFigure.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StickFigure } from './StickFigure';

describe('StickFigure', () => {
  it('renders an svg with the given className and all joint hooks', () => {
    render(<StickFigure className="anim-pull" />);
    const svg = screen.getByTestId('stick-figure');
    expect(svg).toHaveClass('anim-pull');

    const joints = ['torso', 'shoulder-l', 'shoulder-r', 'elbow-l', 'elbow-r', 'hip-l', 'hip-r', 'knee-l', 'knee-r'];
    joints.forEach((cls) => {
      expect(svg.querySelector(`.${cls}`)).not.toBeNull();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/exercise-animations/StickFigure.test.tsx`
Expected: FAIL with "Cannot find module './StickFigure'"

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/exercise-animations/StickFigure.tsx
interface StickFigureProps {
  className: string;
}

export function StickFigure({ className }: StickFigureProps) {
  return (
    <svg data-testid="stick-figure" className={className} viewBox="0 0 120 160" width="120" height="160" fill="none">
      <circle cx="60" cy="22" r="10" stroke="currentColor" strokeWidth="4" />
      <g className="torso" style={{ transformOrigin: '60px 95px' }}>
        <line className="limb" x1="60" y1="32" x2="60" y2="95" stroke="currentColor" strokeWidth="4" />

        {/* left arm */}
        <g transform="translate(60,38)">
          <g className="shoulder-l" style={{ transformOrigin: '0px 0px' }}>
            <line className="limb" x1="0" y1="0" x2="-22" y2="18" stroke="currentColor" strokeWidth="4" />
            <g transform="translate(-22,18)">
              <g className="elbow-l" style={{ transformOrigin: '0px 0px' }}>
                <line className="limb" x1="0" y1="0" x2="-18" y2="20" stroke="currentColor" strokeWidth="4" />
              </g>
            </g>
          </g>
        </g>

        {/* right arm */}
        <g transform="translate(60,38)">
          <g className="shoulder-r" style={{ transformOrigin: '0px 0px' }}>
            <line className="limb" x1="0" y1="0" x2="22" y2="18" stroke="currentColor" strokeWidth="4" />
            <g transform="translate(22,18)">
              <g className="elbow-r" style={{ transformOrigin: '0px 0px' }}>
                <line className="limb" x1="0" y1="0" x2="18" y2="20" stroke="currentColor" strokeWidth="4" />
              </g>
            </g>
          </g>
        </g>

        {/* left leg */}
        <g transform="translate(60,95)">
          <g className="hip-l" style={{ transformOrigin: '0px 0px' }}>
            <line className="limb" x1="0" y1="0" x2="-14" y2="30" stroke="currentColor" strokeWidth="4" />
            <g transform="translate(-14,30)">
              <g className="knee-l" style={{ transformOrigin: '0px 0px' }}>
                <line className="limb" x1="0" y1="0" x2="-6" y2="30" stroke="currentColor" strokeWidth="4" />
              </g>
            </g>
          </g>
        </g>

        {/* right leg */}
        <g transform="translate(60,95)">
          <g className="hip-r" style={{ transformOrigin: '0px 0px' }}>
            <line className="limb" x1="0" y1="0" x2="14" y2="30" stroke="currentColor" strokeWidth="4" />
            <g transform="translate(14,30)">
              <g className="knee-r" style={{ transformOrigin: '0px 0px' }}>
                <line className="limb" x1="0" y1="0" x2="6" y2="30" stroke="currentColor" strokeWidth="4" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
```

Note the nesting: each joint's static position comes from the SVG `transform="translate(...)"` attribute on an outer `<g>`, while the animated rotation lives on an inner `<g className="...">` with only a CSS `transform-origin` set (its `transform` is provided later by CSS in Task 2). This split matters because a CSS `transform` on an element overrides its SVG `transform` attribute entirely — keeping them on separate nested elements is what lets the joint chain rotate correctly (e.g. the elbow group follows the shoulder group's rotation since it's nested inside it).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/exercise-animations/StickFigure.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/exercise-animations/StickFigure.tsx src/components/exercise-animations/StickFigure.test.tsx
git commit -m "feat: add StickFigure SVG primitive for exercise animations"
```

---

### Task 2: Per-exercise CSS keyframes

**Files:**
- Create: `src/components/exercise-animations/exercise-animations.css`

**Interfaces:**
- Consumes: the joint class names produced by Task 1 (`torso`, `shoulder-l`, `shoulder-r`, `elbow-l`, `elbow-r`, `hip-l`, `hip-r`, `knee-l`, `knee-r`), scoped under 5 root classes: `anim-pull`, `anim-pike`, `anim-lunge`, `anim-hollow`, `anim-ctw`.
- Produces: those same 5 root class names, which Task 4's mapping (Task 3) must use verbatim.

This is a CSS-only task (no meaningful unit test — jsdom doesn't run animations). Verification is a manual visual check, done in Task 6.

- [ ] **Step 1: Write the CSS file**

```css
/* src/components/exercise-animations/exercise-animations.css */

/* Dominadas (pull-up): arms pull down/back, elbows bend, torso rises slightly */
.anim-pull .shoulder-l { animation: pull-shoulder-l 1.6s ease-in-out infinite; }
.anim-pull .shoulder-r { animation: pull-shoulder-r 1.6s ease-in-out infinite; }
.anim-pull .elbow-l { animation: pull-elbow-l 1.6s ease-in-out infinite; }
.anim-pull .elbow-r { animation: pull-elbow-r 1.6s ease-in-out infinite; }
.anim-pull .torso { animation: pull-torso 1.6s ease-in-out infinite; }

@keyframes pull-shoulder-l {
  0%, 100% { transform: rotate(5deg); }
  50% { transform: rotate(70deg); }
}
@keyframes pull-shoulder-r {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(-70deg); }
}
@keyframes pull-elbow-l {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(90deg); }
}
@keyframes pull-elbow-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-90deg); }
}
@keyframes pull-torso {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

/* Pike push-ups: vertical push, elbows bend at the bottom, hips stay piked (static) */
.anim-pike .shoulder-l { animation: pike-shoulder-l 1.6s ease-in-out infinite; }
.anim-pike .shoulder-r { animation: pike-shoulder-r 1.6s ease-in-out infinite; }
.anim-pike .elbow-l { animation: pike-elbow-l 1.6s ease-in-out infinite; }
.anim-pike .elbow-r { animation: pike-elbow-r 1.6s ease-in-out infinite; }
.anim-pike .torso { animation: pike-torso 1.6s ease-in-out infinite; }

@keyframes pike-shoulder-l {
  0%, 100% { transform: rotate(-100deg); }
  50% { transform: rotate(-60deg); }
}
@keyframes pike-shoulder-r {
  0%, 100% { transform: rotate(100deg); }
  50% { transform: rotate(60deg); }
}
@keyframes pike-elbow-l {
  0%, 100% { transform: rotate(10deg); }
  50% { transform: rotate(80deg); }
}
@keyframes pike-elbow-r {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(-80deg); }
}
@keyframes pike-torso {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* Zancadas (lunge): alternating leg steps forward, torso stays upright */
.anim-lunge .hip-l { animation: lunge-hip-l 1.8s ease-in-out infinite; }
.anim-lunge .hip-r { animation: lunge-hip-r 1.8s ease-in-out infinite; }
.anim-lunge .knee-l { animation: lunge-knee-l 1.8s ease-in-out infinite; }
.anim-lunge .knee-r { animation: lunge-knee-r 1.8s ease-in-out infinite; }

@keyframes lunge-hip-l {
  0%, 100% { transform: rotate(-35deg); }
  50% { transform: rotate(35deg); }
}
@keyframes lunge-hip-r {
  0%, 100% { transform: rotate(35deg); }
  50% { transform: rotate(-35deg); }
}
@keyframes lunge-knee-l {
  0%, 100% { transform: rotate(60deg); }
  50% { transform: rotate(10deg); }
}
@keyframes lunge-knee-r {
  0%, 100% { transform: rotate(10deg); }
  50% { transform: rotate(60deg); }
}

/* Hollow body hold: whole body rocks gently between a deeper and shallower hollow */
.anim-hollow .torso { animation: hollow-torso 2.2s ease-in-out infinite; }
.anim-hollow .shoulder-l { animation: hollow-shoulder-l 2.2s ease-in-out infinite; }
.anim-hollow .shoulder-r { animation: hollow-shoulder-r 2.2s ease-in-out infinite; }
.anim-hollow .hip-l { animation: hollow-hip-l 2.2s ease-in-out infinite; }
.anim-hollow .hip-r { animation: hollow-hip-r 2.2s ease-in-out infinite; }

@keyframes hollow-torso {
  0%, 100% { transform: rotate(-4deg) translateY(0); }
  50% { transform: rotate(4deg) translateY(-4px); }
}
@keyframes hollow-shoulder-l {
  0%, 100% { transform: rotate(15deg); }
  50% { transform: rotate(25deg); }
}
@keyframes hollow-shoulder-r {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes hollow-hip-l {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes hollow-hip-r {
  0%, 100% { transform: rotate(15deg); }
  50% { transform: rotate(25deg); }
}

/* Chest-to-wall hold: mostly static handstand pose with a subtle balance sway */
.anim-ctw .torso { animation: ctw-torso 3s ease-in-out infinite; }
.anim-ctw .shoulder-l { animation: ctw-shoulder-l 3s ease-in-out infinite; }
.anim-ctw .shoulder-r { animation: ctw-shoulder-r 3s ease-in-out infinite; }
.anim-ctw .hip-l { animation: ctw-hip 3s ease-in-out infinite; }
.anim-ctw .hip-r { animation: ctw-hip 3s ease-in-out infinite; }

@keyframes ctw-torso {
  0%, 100% { transform: rotate(178deg) translateX(0); }
  50% { transform: rotate(182deg) translateX(2px); }
}
@keyframes ctw-shoulder-l {
  0%, 100% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
}
@keyframes ctw-shoulder-r {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
@keyframes ctw-hip {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(4deg); }
}

@media (prefers-reduced-motion: reduce) {
  .anim-pull .shoulder-l, .anim-pull .shoulder-r, .anim-pull .elbow-l, .anim-pull .elbow-r, .anim-pull .torso,
  .anim-pike .shoulder-l, .anim-pike .shoulder-r, .anim-pike .elbow-l, .anim-pike .elbow-r, .anim-pike .torso,
  .anim-lunge .hip-l, .anim-lunge .hip-r, .anim-lunge .knee-l, .anim-lunge .knee-r,
  .anim-hollow .torso, .anim-hollow .shoulder-l, .anim-hollow .shoulder-r, .anim-hollow .hip-l, .anim-hollow .hip-r,
  .anim-ctw .torso, .anim-ctw .shoulder-l, .anim-ctw .shoulder-r, .anim-ctw .hip-l, .anim-ctw .hip-r {
    animation: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/exercise-animations/exercise-animations.css
git commit -m "feat: add per-exercise CSS keyframes for animation pilot"
```

---

### Task 3: Exercise-id → animation-class map

**Files:**
- Create: `src/components/exercise-animations/index.ts`
- Test: `src/components/exercise-animations/index.test.ts`

**Interfaces:**
- Consumes: the 5 root class names from Task 2 (`anim-pull`, `anim-pike`, `anim-lunge`, `anim-hollow`, `anim-ctw`) and the `StickFigure` component from Task 1.
- Produces: `EXERCISE_ANIMATIONS: Record<string, string>` and a re-exported `StickFigure`, both imported from `'./exercise-animations'` by `HowToSheet` in Task 4.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/exercise-animations/index.test.ts
import { describe, it, expect } from 'vitest';
import { EXERCISE_ANIMATIONS } from './index';

describe('EXERCISE_ANIMATIONS', () => {
  it('maps exactly the 5 pilot exercise ids to their animation class', () => {
    expect(EXERCISE_ANIMATIONS).toEqual({
      pull: 'anim-pull',
      pike: 'anim-pike',
      lunge: 'anim-lunge',
      hollow: 'anim-hollow',
      ctw: 'anim-ctw',
    });
  });

  it('has no entry for an unmapped exercise id', () => {
    expect(EXERCISE_ANIMATIONS['kick']).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/exercise-animations/index.test.ts`
Expected: FAIL with "Cannot find module './index'"

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/exercise-animations/index.ts
import './exercise-animations.css';

export { StickFigure } from './StickFigure';

export const EXERCISE_ANIMATIONS: Record<string, string> = {
  pull: 'anim-pull',
  pike: 'anim-pike',
  lunge: 'anim-lunge',
  hollow: 'anim-hollow',
  ctw: 'anim-ctw',
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/exercise-animations/index.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/exercise-animations/index.ts src/components/exercise-animations/index.test.ts
git commit -m "feat: add exercise-id to animation-class map"
```

---

### Task 4: Wire `StickFigure` into `HowToSheet`

**Files:**
- Modify: `src/components/HowToSheet.tsx`
- Modify: `src/components/HowToSheet.test.tsx`

**Interfaces:**
- Consumes: `EXERCISE_ANIMATIONS: Record<string, string>` and `StickFigure` from `'./exercise-animations'` (Tasks 1 & 3).
- Produces: `HowToSheet` now takes an additional required prop `exerciseId: string | null`. Later, `App.tsx` (Task 5) must pass this prop.

- [ ] **Step 1: Write the failing tests**

Replace the contents of `src/components/HowToSheet.test.tsx` with:

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
        exerciseId="kick"
        hw={{ c: ['Manos a un palmo de la pared', 'Mira entre tus manos'], y: 'kick up to handstand wall tutorial' }}
      />
    );
    expect(screen.getByText('Manos a un palmo de la pared')).toBeInTheDocument();
    expect(screen.getByText('Ver tutorial en YouTube').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('kick%20up%20to%20handstand%20wall%20tutorial')
    );
  });

  it('renders the stick-figure animation for a mapped exerciseId', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Dominadas"
        exerciseId="pull"
        hw={{ c: ['Cuelga con agarre firme'], y: 'pull up tutorial' }}
      />
    );
    expect(screen.getByTestId('stick-figure')).toHaveClass('anim-pull');
  });

  it('renders no animation for an unmapped exerciseId', () => {
    render(
      <HowToSheet
        open
        onOpenChange={() => {}}
        name="Kick-ups a pared"
        exerciseId="kick"
        hw={{ c: ['Manos a un palmo de la pared'], y: 'kick up to handstand wall tutorial' }}
      />
    );
    expect(screen.queryByTestId('stick-figure')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npx vitest run src/components/HowToSheet.test.tsx`
Expected: FAIL — `exerciseId` is not a known prop / no `stick-figure` rendered, TypeScript error on missing prop.

- [ ] **Step 3: Update `HowToSheet.tsx`**

```tsx
import type { HowTo } from '../data/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from './ui/sheet';
import { Button } from './ui/button';
import { StickFigure, EXERCISE_ANIMATIONS } from './exercise-animations';

interface HowToSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  exerciseId: string | null;
  hw: HowTo | null;
}

export function HowToSheet({ open, onOpenChange, name, exerciseId, hw }: HowToSheetProps) {
  const animationClass = exerciseId ? EXERCISE_ANIMATIONS[exerciseId] : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Puntos clave de técnica</SheetDescription>
        </SheetHeader>
        {animationClass && (
          <div className="mt-3 flex h-40 items-center justify-center rounded-xl bg-surface-2 text-ink">
            <StickFigure className={animationClass} />
          </div>
        )}
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

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/HowToSheet.test.tsx`
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/HowToSheet.tsx src/components/HowToSheet.test.tsx
git commit -m "feat: render stick-figure animation in HowToSheet for mapped exercises"
```

---

### Task 5: Pass `exerciseId` from `App.tsx`

**Files:**
- Modify: `src/App.tsx:124`

**Interfaces:**
- Consumes: `HowToSheet`'s new `exerciseId` prop (Task 4). The existing `howToId` state (`src/App.tsx:26`) already holds the currently-open exercise id.
- Produces: nothing further downstream — this is the final integration point.

- [ ] **Step 1: Update the `HowToSheet` call site**

In `src/App.tsx`, change line 124 from:

```tsx
      <HowToSheet open={!!howToId} onOpenChange={(o) => !o && setHowToId(null)} name={howToEx?.name ?? ''} hw={howToEx?.hw ?? null} />
```

to:

```tsx
      <HowToSheet
        open={!!howToId}
        onOpenChange={(o) => !o && setHowToId(null)}
        name={howToEx?.name ?? ''}
        exerciseId={howToId}
        hw={howToEx?.hw ?? null}
      />
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: All existing tests still PASS (this change is a prop pass-through; `App.loggedIn.test.tsx` and `App.loggedOut.test.tsx` don't assert on `HowToSheet` internals, so no new failures are expected).

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: thread exerciseId into HowToSheet from App"
```

---

### Task 6: Global CSS import + manual visual check

**Files:**
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `src/components/exercise-animations/exercise-animations.css` (Task 2) — imported once so its `@keyframes` and `.anim-*` rules are available app-wide (note: Task 3's `index.ts` already imports this CSS file as a side effect, so this import is technically redundant at build time, but keeping it explicit in `main.tsx` alongside `globals.css` documents the app's global stylesheets in one place and doesn't rely on an internal component module having a side-effecting import).

- [ ] **Step 1: Add the import**

In `src/main.tsx`, add the import after the existing `globals.css` import:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './components/exercise-animations/exercise-animations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: All tests PASS.

- [ ] **Step 3: Manual visual check**

Run: `npm run dev`, open the app in a browser, open "Día 1" and "Día 2" (or whichever days contain Dominadas, Pike push-ups, Zancadas, Hollow body hold, Chest-to-wall hold), tap "ⓘ Cómo" on each of the 5 pilot exercises and confirm:
- The stick figure animates in a loop above the cues list.
- The motion is recognizable for that exercise (arms pulling for Dominadas, vertical push for Pike push-ups, alternating legs for Zancadas, gentle rock for Hollow body hold, near-static sway for Chest-to-wall hold).
- Opening "ⓘ Cómo" on any other exercise (e.g. Kick-ups a pared) shows no animation box, unchanged from before.

If any animation looks visually wrong (wrong direction, distorted proportions, too fast/slow), adjust the relevant `@keyframes` rule(s) in `exercise-animations.css` and re-check — this is expected tuning, not a plan deviation.

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx
git commit -m "feat: import exercise-animations stylesheet globally"
```

If Step 3 required CSS tweaks, include them in this same commit.

---

## Self-Review Notes

- **Spec coverage:** `StickFigure` primitive (Task 1) ✓, per-exercise CSS keyframes (Task 2) ✓, exercise→class mapping (Task 3) ✓, `HowToSheet` placement above cues list + fallback for unmapped ids (Task 4) ✓, `App.tsx` wiring (Task 5) ✓, `prefers-reduced-motion` (Task 2) ✓, global CSS import + manual visual acceptance check (Task 6) ✓. No spec section is unaddressed.
- **Placeholder scan:** all steps contain full, concrete code; no TBD/TODO markers.
- **Type consistency:** `exerciseId: string | null` matches `howToId`'s type in `App.tsx` (`useState<string | null>`); `EXERCISE_ANIMATIONS: Record<string, string>` keys/values match the class names used in both `exercise-animations.css` and the `StickFigure` test; joint class names (`torso`, `shoulder-l`, `shoulder-r`, `elbow-l`, `elbow-r`, `hip-l`, `hip-r`, `knee-l`, `knee-r`) are identical across Task 1's component, Task 1's test, and Task 2's CSS.
