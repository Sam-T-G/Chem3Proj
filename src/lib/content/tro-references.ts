/**
 * Cross-references to Tro, "Chemistry: Structure and Properties" /
 * "Chemistry: A Molecular Approach". Section numbers refer to the 5th edition
 * acid/base chapter cluster; adjust if your edition differs.
 *
 * These are *pointers* to where a concept is taught — not reproduced text.
 */
export interface TroReference {
  readonly id: string;
  readonly title: string;
  readonly chapter: string;
  readonly section: string;
  readonly summary: string;
}

export const TRO_REFERENCES: Record<string, TroReference> = {
  weakAcidEquilibrium: {
    id: "weakAcidEquilibrium",
    title: "Finding [H₃O⁺] and pH of a Weak Acid Solution",
    chapter: "Acids and Bases",
    section: "§16.6",
    summary:
      "Set up an ICE table with Ka. For acetic acid (Ka ≈ 1.8×10⁻⁵), use the quadratic if the 5% approximation fails.",
  },
  hendersonHasselbalch: {
    id: "hendersonHasselbalch",
    title: "Henderson–Hasselbalch Equation",
    chapter: "Aqueous Ionic Equilibrium",
    section: "§17.2",
    summary:
      "pH = pKa + log([A⁻]/[HA]). Valid in the buffer region of a weak-acid titration.",
  },
  weakStrongTitration: {
    id: "weakStrongTitration",
    title: "Titration of a Weak Acid with a Strong Base",
    chapter: "Aqueous Ionic Equilibrium",
    section: "§17.4",
    summary:
      "Four canonical regions: initial weak-acid, buffer, equivalence (basic — conjugate base hydrolysis), past equivalence (excess OH⁻ dominates).",
  },
  indicatorChoice: {
    id: "indicatorChoice",
    title: "Choosing an Indicator",
    chapter: "Aqueous Ionic Equilibrium",
    section: "§17.4",
    summary:
      "Pick an indicator whose transition range straddles the equivalence-point pH. For weak-acid/strong-base, that pH is > 7, so phenolphthalein (8.2–10.0) is the standard choice.",
  },
  halfEquivalence: {
    id: "halfEquivalence",
    title: "Half-Equivalence Point",
    chapter: "Aqueous Ionic Equilibrium",
    section: "§17.4",
    summary: "When half the acid has reacted, [HA] = [A⁻], so pH = pKa exactly.",
  },
  indicatorError: {
    id: "indicatorError",
    title: "Endpoint vs. Equivalence Point",
    chapter: "Aqueous Ionic Equilibrium",
    section: "§17.4",
    summary:
      "The indicator endpoint (pH = pKa_HIn) is what the eye sees; the equivalence point (n_acid = n_base) is what the stoichiometry says. The gap between them is the indicator error.",
  },
  standardization: {
    id: "standardization",
    title: "Standardizing a Solution",
    chapter: "Stoichiometry / Titration",
    section: "Tro Ch. 4 + §17.4",
    summary:
      "NaOH is hygroscopic and absorbs CO₂, so its labeled molarity drifts from the truth. The fix is to titrate it against a primary standard (KHP) whose mass you trust on the balance.",
  },
  co2Pickup: {
    id: "co2Pickup",
    title: "CO₂ Absorption Near the Endpoint",
    chapter: "Aqueous Ionic Equilibrium",
    section: "§17.4 (lab technique)",
    summary:
      "Once the solution is basic, OH⁻ + CO₂ → HCO₃⁻ slowly pulls pH back down — phenolphthalein fades. Real endpoints are taken as the first *persistent* pink (≥30 s).",
  },
} as const;
