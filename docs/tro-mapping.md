# Tro chapter mapping

Section numbers refer to Tro, *Chemistry: A Molecular Approach*, 5th ed. If
you're on a different edition, the chapter titles below should still resolve.

| Concept in the app | Tro chapter / section | Module |
| --- | --- | --- |
| Ka, weak-acid equilibrium | Ch. 16 "Acids and Bases", §16.6 | `lib/chemistry/ph.ts → pHWeakAcid` |
| pH, pOH, Kw | Ch. 16 §16.4–16.5 | `lib/chemistry/ph.ts` |
| Buffers, Henderson–Hasselbalch | Ch. 17 "Aqueous Ionic Equilibrium", §17.2 | `lib/chemistry/ph.ts → pHBuffer` |
| Weak-acid / strong-base titration | Ch. 17 §17.4 | `lib/chemistry/titration.ts` |
| Half-equivalence (`pH = pKa`) | Ch. 17 §17.4 | `pHAt` (buffer branch at V_eq/2) |
| Equivalence-point hydrolysis | Ch. 17 §17.4 | `pHEquivalenceWeakAcidStrongBase` |
| Indicator selection | Ch. 17 §17.4 | `lib/chemistry/indicators.ts` |
| Percent composition / molarity | Ch. 4 "Stoichiometry" | `lib/chemistry/vinegar.ts` |

When you cite Tro in code comments, prefer the form `Tro §17.4` so search
across the codebase remains uniform.
