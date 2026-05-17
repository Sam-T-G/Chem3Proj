# Chem3 Titration Lab

Interactive titration of a vinegar sample with NaOH, grounded in Tro,
*Chemistry: A Molecular Approach*, chapters 16–17.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

To run the Playwright e2e tests locally, install the browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

Unit tests, typecheck, lint, and build need only `npm install`.

## What you can do

- **/** — Landing page, intro to the lab.
- **/game** — Drop or stream NaOH from a virtual burette into a vinegar flask
  with phenolphthalein. Watch the live titration curve, the indicator color
  transition, and the contextual hints that change with the titration region.
- **/theory** — Reference cards pointing back to Tro sections for each concept
  the simulation implements.

## How it's built

| Layer | Lives in | Notes |
| --- | --- | --- |
| Chemistry math | `src/lib/chemistry/` | Pure functions, no UI deps. Tested in isolation. |
| Game state | `src/lib/game/state.ts` | One Zustand store. Selectors derive pH, region. |
| UI | `src/app/`, `src/components/game/` | Next.js App Router + Tailwind + Recharts. |
| Tests | `tests/unit/`, `tests/e2e/` | Vitest for math, Playwright for the lab flow. |

See [`docs/chemistry-model.md`](./docs/chemistry-model.md) for the formulas the
simulation uses and [`docs/architecture.md`](./docs/architecture.md) for how the
pieces wire together.

## Scripts

| | |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run lint` | ESLint + Next rules |
| `npm test` | Vitest unit tests |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm run test:e2e` | Playwright e2e (boots dev server) |
| `npm run format` | Prettier write |

## Working with Claude Code

This repo is configured for [Claude Code](https://claude.ai/code):

- [`CLAUDE.md`](./CLAUDE.md) — operating notes and invariants.
- [`.claude/settings.json`](./.claude/settings.json) — permission allowlist and a
  Stop hook that runs `typecheck` between turns.
- [`.claude/agents/chemistry-validator.md`](./.claude/agents/chemistry-validator.md) —
  a custom reviewer agent for chemistry math.

## License

MIT — see `LICENSE` if/when added.
