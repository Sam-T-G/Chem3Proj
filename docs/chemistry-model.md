# Chemistry model

This file documents the equations the simulation uses, with section pointers
into Tro, *Chemistry: A Molecular Approach* (5th ed.). The implementations live
in `src/lib/chemistry/`.

## System

- **Analyte:** acetic acid, CH₃COOH, Ka = 1.8 × 10⁻⁵ (pKa ≈ 4.74).
- **Titrant:** sodium hydroxide, NaOH (strong base, treated as fully dissociated).
- **Indicator:** phenolphthalein (pKa_HIn ≈ 9.4, transition 8.2–10.0).
- **Reaction:**  CH₃COOH(aq) + OH⁻(aq) → CH₃COO⁻(aq) + H₂O(l)  (1:1 stoichiometry).

## The four pH regions (Tro §17.4)

Let
- `Ca = [HA]₀`, `Va` = analyte volume,
- `Cb` = titrant concentration, `Vb` = titrant volume added,
- `n_HA = Ca·Va`, `n_OH = Cb·Vb`.

### 1. Initial — `Vb = 0`

Solve the weak-acid equilibrium without the small-x approximation:

```
Ka = x² / (Ca − x)   ⇒   x² + Ka·x − Ka·Ca = 0
[H⁺] = (−Ka + √(Ka² + 4·Ka·Ca)) / 2
pH   = −log₁₀([H⁺])
```

Implemented in `pHWeakAcid`.

### 2. Buffer — `0 < Vb < Veq`

After reaction, `n_HA → n_HA − n_OH` and `n_A⁻ → n_OH`. Apply
Henderson–Hasselbalch (Tro §17.2):

```
pH = pKa + log₁₀(n_A⁻ / n_HA)
```

Implemented in `pHBuffer`. At the **half-equivalence point** (`Vb = Veq/2`),
`n_A⁻ = n_HA` so `pH = pKa` exactly — a useful experimental anchor.

### 3. Equivalence — `Vb = Veq`

All HA has been converted to A⁻ (acetate). Acetate hydrolyzes water:

```
A⁻ + H₂O ⇌ HA + OH⁻        Kb = Kw / Ka
[OH⁻] from y² + Kb·y − Kb·[A⁻] = 0
pH = 14 − pOH
```

The pH is **greater than 7** — that's why phenolphthalein, with its 8.2–10
transition, is the standard indicator for weak-acid/strong-base titrations
(Tro §17.4).

Implemented in `pHEquivalenceWeakAcidStrongBase`.

### 4. Post-equivalence — `Vb > Veq`

Excess strong base overwhelms the equilibrium:

```
[OH⁻] = (n_OH − n_HA) / (Va + Vb)
pH    = 14 − pOH
```

Implemented in `pHExcessStrongBase`.

## Indicator color

For a single-step indicator HIn ⇌ H⁺ + In⁻ with `pKa_HIn`,

```
f_basic = 10^(pH − pKa_HIn) / (1 + 10^(pH − pKa_HIn))
color   = lerp(acidColor, baseColor, f_basic)
```

Implemented in `indicators.ts`.

## Vinegar percent-by-mass conversion

Vinegar labels list percent acetic acid by mass. To convert to molarity:

```
M = (% / 100) · ρ · 1000 / MW_HOAc      where MW_HOAc = 60.052 g/mol
```

The student's measured molarity (back-calculated from `Veq` and the dilution
factor) is converted back to % to compare against the label.

## Real-lab quirks the simulation *does* model

These were added once the scope expanded from "interactive plot" to
"lab-failure-aware teaching tool":

### CO₂ pickup near the endpoint (`co2-drift.ts`)

Above pH ≈ 7, atmospheric CO₂ dissolves and reacts:

```
OH⁻ + CO₂ → HCO₃⁻        ;        OH⁻ + HCO₃⁻ → CO₃²⁻ + H₂O
```

The net effect is a slow drift of pH back down with time-since-mixing.
Modelled as a linear-in-time drift capped so display pH never falls
below the threshold, reset whenever the student adds a drop or swirls.

This is what makes phenolphthalein fade back from pink to colorless if
the student stops near the endpoint and waits — the visible cue that
the real endpoint is "first persistent pink", not "first pink".

### Indicator endpoint vs. equivalence point (`indicatorEndpointVolume`)

The endpoint is the volume at which the indicator visibly transitions
(midpoint at pH = pKa_HIn). The equivalence point is the volume at which
stoichiometric base equals stoichiometric acid. These are different
volumes; the gap is the indicator error.

Computed by bisection on `pHAt`. Reported in both the sandbox results
panel and the guided-lab report so the student confronts the distinction.

### NaOH standardization against KHP (`khp.ts`)

The bottle is labeled 0.100 M; the simulation's hidden truth is ~0.0987 M.
The student weighs out a primary-standard KHP sample (mass on the balance
is exact) and titrates the NaOH against it to recover the true molarity.

Real-world motivation: solid NaOH is hygroscopic; aqueous NaOH absorbs CO₂
to form Na₂CO₃; both effects shift the molarity from the label.

### Realistic vinegar percent

USDA legal range is 4–7%. The simulation uses 5.4% (hidden) for a bottle
labeled 5.0%, so the student must trust their measurement over the label.

## What the simulation still deliberately omits

- Activity coefficients (we treat activity ≈ concentration).
- Temperature dependence of Ka and Kw (everything at 25 °C).
- Indicator's own contribution to pH (negligible at typical doses).
- Brownian noise on burette readings (could be added as a "realism" mode).
- Color perception variability across users.

These are reasonable for an introductory simulation; revisit if/when the
project grows into a quantitative-analysis context.
