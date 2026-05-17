import { Kw } from "./constants";

export function pH(hydroniumMolar: number): number {
  if (hydroniumMolar <= 0) throw new Error("[H+] must be > 0");
  return -Math.log10(hydroniumMolar);
}

export function pOH(hydroxideMolar: number): number {
  if (hydroxideMolar <= 0) throw new Error("[OH-] must be > 0");
  return -Math.log10(hydroxideMolar);
}

export function pHfromPOH(poh: number): number {
  return 14 - poh;
}

export function hydroniumFromPH(ph: number): number {
  return Math.pow(10, -ph);
}

/**
 * Weak acid initial pH via the quadratic form of the Ka expression.
 * Avoids the small-x approximation, so it stays accurate at low Ca / high Ka.
 *   Ka = x² / (Ca − x)  →  x² + Ka·x − Ka·Ca = 0
 */
export function pHWeakAcid(Ca: number, Ka: number): number {
  if (Ca <= 0) return 7;
  const discriminant = Ka * Ka + 4 * Ka * Ca;
  const x = (-Ka + Math.sqrt(discriminant)) / 2;
  return pH(x);
}

/**
 * Henderson–Hasselbalch for the buffer region (Tro §17.2).
 *   pH = pKa + log([A⁻] / [HA])
 * This is what students learn. It assumes weak-acid auto-dissociation is
 * negligible next to the conjugate base supplied by titration; that
 * assumption fails near V_b = 0, where you should prefer
 * `pHBufferEquilibrium` instead.
 */
export function pHBuffer(molA_minus: number, molHA: number, Ka: number): number {
  if (molHA <= 0) throw new Error("buffer region requires unreacted HA");
  if (molA_minus <= 0) throw new Error("buffer region requires some A⁻");
  const pKa = -Math.log10(Ka);
  return pKa + Math.log10(molA_minus / molHA);
}

/**
 * Full equilibrium for a mixed HA / A⁻ solution.
 *   Ka = x·(Cf_A + x) / (Cf_HA − x)
 *   ⇒ x² + (Cf_A + Ka)·x − Ka·Cf_HA = 0
 *
 * Reduces to the weak-acid case when Cf_A = 0 and to Henderson–Hasselbalch
 * when Cf_A ≫ x. Use this in the simulation to avoid the H-H discontinuity at
 * very small base additions.
 */
export function pHBufferEquilibrium(Cf_HA: number, Cf_A: number, Ka: number): number {
  if (Cf_HA <= 0) throw new Error("formal [HA] must be > 0");
  if (Cf_A < 0) throw new Error("formal [A⁻] must be ≥ 0");
  const b = Cf_A + Ka;
  const discriminant = b * b + 4 * Ka * Cf_HA;
  const x = (-b + Math.sqrt(discriminant)) / 2;
  return pH(x);
}

/**
 * Equivalence-point pH for a weak-acid / strong-base titration.
 * All HA has become A⁻; A⁻ hydrolyzes:  A⁻ + H₂O ⇌ HA + OH⁻
 *   Kb = Kw / Ka,    [OH⁻] ≈ √(Kb · [A⁻])
 */
export function pHEquivalenceWeakAcidStrongBase(saltConcentration: number, Ka: number): number {
  const Kb = Kw / Ka;
  const discriminant = Kb * Kb + 4 * Kb * saltConcentration;
  const oh = (-Kb + Math.sqrt(discriminant)) / 2;
  return pHfromPOH(pOH(oh));
}

/**
 * Past equivalence: excess strong base dominates.
 */
export function pHExcessStrongBase(excessMolesOH: number, totalVolume_L: number): number {
  const oh = excessMolesOH / totalVolume_L;
  return pHfromPOH(pOH(oh));
}
