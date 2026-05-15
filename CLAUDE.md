# Chem3 Titration Lab — Claude operating notes

## Project in one sentence
A Next.js 15 web app that simulates a vinegar (acetic acid) titration with NaOH,
grounded in **Tro, *Chemistry: A Molecular Approach*, Ch. 16–17**.

## Stack
- Next.js 15 (App Router) + TypeScript (strict, `noUncheckedIndexedAccess`)
- React 18, Tailwind CSS, Framer Motion, Recharts, Zustand
- Vitest (unit) + Playwright (e2e)
- Path alias: `@/*` → `src/*`

## Commands you can rely on
| Task | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Unit tests | `npm test` |
| Unit + coverage | `npm run test:coverage` |
| E2E (Playwright) | `npm run test:e2e` |
| Format | `npm run format` |

Before declaring a chemistry/UI task done locally, run `npm run typecheck && npm test`.

## Directory map
```
src/
  app/                 Next.js routes (App Router)
    page.tsx           Landing
    game/page.tsx      Interactive simulation
    theory/page.tsx    Tro reference cards
  components/game/     Burette, Beaker, TitrationCurve, ControlPanel, HintPanel
  lib/
    chemistry/         Pure functions — all the math lives here
      constants.ts     Ka, Kw, indicators, vinegar facts
      ph.ts            pH/pOH primitives, weak-acid, buffer, equivalence
      titration.ts     Region branching, pHAt(V), titrationCurve()
      indicators.ts    Color interpolation across the transition range
      vinegar.ts       % m/m ↔ molarity, lab setup builder
    game/state.ts      Zustand store (one source of truth for the game)
    content/           Tro section pointers
  types/chemistry.ts   Shared types
tests/
  unit/chemistry/      Test the math against textbook anchors
  e2e/                 Playwright smoke tests
```

## Non-negotiable invariants
1. **All chemistry calculations are pure functions in `src/lib/chemistry/`** —
   no React, no zustand, no DOM. They must be independently testable.
2. **The four canonical pH regions** (initial / buffer / equivalence /
   post-equivalence) are the model used throughout (Tro §17.4). When you add
   new behavior, branch off `regionAt(V, setup)`, do not duplicate the logic.
3. **Anchor points** that tests pin down (DO NOT regress):
   - 0.10 M HOAc, no base added → pH ≈ 2.87
   - At V = V_eq / 2 → pH = pKa ≈ 4.74
   - At V = V_eq (0.1 M HOAc + 0.1 M NaOH, equal volumes) → pH ≈ 8.7
4. **Units in names.** Volumes use `_mL` / `_L` suffixes. Concentrations are in
   molarity unless documented otherwise.

## When you're asked to add chemistry
- Add the new pure function to `src/lib/chemistry/`.
- Add a unit test with a textbook-anchored expected value (cite the example).
- Update `src/lib/content/tro-references.ts` if it touches a new concept.
- Only then wire it into a component.

## When you're asked to add UI
- Read game state via `useGameStore` selectors. Do not call chemistry functions
  in event handlers — update store state and let selectors derive.
- Keep `"use client"` only on components that actually need interactivity.

## What NOT to do
- Don't introduce a state library besides Zustand.
- Don't put magic numbers in components. Constants go in `lib/chemistry/constants.ts`.
- Don't approximate when the quadratic is cheap — see `pHWeakAcid` for the pattern.
- Don't reproduce textbook prose. Reference Tro by section; never paste.
