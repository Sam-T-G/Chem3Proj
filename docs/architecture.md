# Architecture

## Goals

- Keep chemistry math **pure**, testable, and free of React.
- Keep React state in **one** store (`useGameStore`).
- Keep the UI a thin view layer that subscribes to the store and renders.

## Data flow

```
ControlPanel (button) ──► useGameStore.addDrop(0.05)
                              │
                              ▼
                     mutate { volumeAdded_mL, history }
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
          Burette         Beaker          TitrationCurve
        (reads vol)   (reads pH via      (reads setup +
                       indicatorColor)    history, plots)
                              ▲
                              │
                       HintPanel reads
                       regionAt(V, setup)
```

`selectCurrentPH` and `selectEquivalenceVolume` are derivation selectors —
components don't re-implement pH math, they ask the selector.

## Why Zustand (not Redux, not Context)

- One store, zero boilerplate.
- Selector-based subscriptions avoid re-rendering the entire game on every drop.
- No provider needed → easier to test components in isolation.

## Where to add new things

| If you want to add… | Put it here |
| --- | --- |
| A new pH calculation | `src/lib/chemistry/ph.ts` + unit test |
| A new indicator | `src/lib/chemistry/constants.ts` |
| A new acid (e.g. citric, polyprotic) | New file in `chemistry/`, type-modeled in `types/` |
| A new screen | `src/app/<route>/page.tsx` |
| A new game widget | `src/components/game/` |
| New Tro cross-references | `src/lib/content/tro-references.ts` |

## Performance notes

- `titrationCurve` is memoized in the chart by `useMemo([setup])`. The 240-point
  curve is regenerated only when the setup changes, not on every drop.
- The Recharts dot at the current `(V, pH)` is drawn from a `ReferenceDot`,
  not by extending the line, so the curve does not re-layout each drop.
