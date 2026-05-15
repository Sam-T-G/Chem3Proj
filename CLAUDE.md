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
    lab/page.tsx       Guided lab (predict → standardize → titrate → report)
    game/page.tsx      Open sandbox simulation
    theory/page.tsx    Tro reference cards
  components/
    game/              Burette, Beaker, TitrationCurve, ControlPanel,
                       HintPanel, ResultsPanel — used by both /game and /lab
    lab/               LabStepper + PredictStep, StandardizeStep,
                       TitrateStep, ReportStep, TitrationStation
  lib/
    chemistry/         Pure functions — all the math lives here
      constants.ts     Ka, Kw, indicators, vinegar facts
      ph.ts            pH/pOH primitives, weak-acid, buffer, equivalence
      titration.ts     Region branching, pHAt(V), titrationCurve(),
                       indicatorEndpointVolume()
      indicators.ts    Color interpolation across the transition range
      vinegar.ts       % m/m ↔ molarity, lab setup builder
      khp.ts           KHP primary standard, NaOH standardization helpers
      co2-drift.ts     Transient CO₂ pickup model on top of equilibrium pH
    game/
      state.ts         Zustand store (predictions, standardization,
                       setup, history, lastMixedAt_ms)
      useDisplayPH.ts  Hook: equilibrium pH + CO₂ drift over wall-clock time
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
5. **Realism via hidden truths.** The store carries `LAB_TRUTHS` — the true
   NaOH molarity and the true vinegar %. Steps use these for simulation but
   never expose them until the report. Don't surface them anywhere else.
6. **Display pH vs. equilibrium pH.** The curve plots the equilibrium pH (real
   chemistry). The beaker color and digital readout show *displayPH*, which
   subtracts the CO₂-drift transient. That divergence is a feature, not a bug
   — it's how students learn what "persistent pink" means.

## When you're asked to add chemistry
- Add the new pure function to `src/lib/chemistry/`.
- Add a unit test with a textbook-anchored expected value (cite the example).
- Update `src/lib/content/tro-references.ts` if it touches a new concept.
- Only then wire it into a component.

## When you're asked to add UI
- Read game state via `useGameStore` selectors. Do not call chemistry functions
  in event handlers — update store state and let selectors derive.
- Keep `"use client"` only on components that actually need interactivity.

## The guided lab flow (`/lab`)
Four steps in a wizard, gated by completion of the previous one:

1. **Predict** — student commits V_eq, equivalence pH, and indicator. Stored
   in `predictions` on the game store. Not graded until the Report step.
2. **Standardize** — titrate ~0.5 g KHP against unknown-strength NaOH. The
   measured molarity replaces the nominal label for the next step.
3. **Titrate** — vinegar titration with CO₂ fade-back, swirl mechanic, and
   the choice to use the standardized vs. labeled NaOH.
4. **Report** — predictions vs. reality; endpoint vs. equivalence point;
   standardized vs. labeled vs. true NaOH; measured vs. true % acetic acid.

When adding lab content, prefer putting it inside the relevant `Step`
component and have it read from the store rather than threading more props
through the orchestrator at `app/lab/page.tsx`.

## What NOT to do
- Don't introduce a state library besides Zustand.
- Don't put magic numbers in components. Constants go in `lib/chemistry/constants.ts`.
- Don't approximate when the quadratic is cheap — see `pHWeakAcid` for the pattern.
- Don't reproduce textbook prose. Reference Tro by section; never paste.
- Don't surface `LAB_TRUTHS` outside the Report step. The hidden values exist
  precisely so the student confronts the gap between label and reality.
