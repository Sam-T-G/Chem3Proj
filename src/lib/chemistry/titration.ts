import type { TitrationPoint, TitrationRegion, TitrationSetup } from "@/types/chemistry";
import {
  pHBufferEquilibrium,
  pHEquivalenceWeakAcidStrongBase,
  pHExcessStrongBase,
  pHWeakAcid,
} from "./ph";

const ML_TO_L = 1 / 1000;
const EPSILON_VOL_ML = 1e-6;

export function equivalenceVolume_mL(setup: TitrationSetup): number {
  const molAcid = setup.analyteSolution.concentration * setup.analyteSolution.volume_mL * ML_TO_L;
  return (molAcid / setup.titrantConcentration) * 1000;
}

export function regionAt(volumeAdded_mL: number, setup: TitrationSetup): TitrationRegion {
  const Veq = equivalenceVolume_mL(setup);
  if (volumeAdded_mL <= EPSILON_VOL_ML) return "initial";
  if (Math.abs(volumeAdded_mL - Veq / 2) < EPSILON_VOL_ML) return "half-equivalence";
  if (Math.abs(volumeAdded_mL - Veq) < EPSILON_VOL_ML) return "equivalence";
  if (volumeAdded_mL < Veq) return "buffer";
  return "post-equivalence";
}

/**
 * Compute pH at any titrant volume for a weak-acid / strong-base titration.
 * Branches across the four canonical regions (Tro §17.4).
 */
export function pHAt(volumeAdded_mL: number, setup: TitrationSetup): number {
  const { analyte, analyteSolution, titrantConcentration } = setup;
  const Va_L = analyteSolution.volume_mL * ML_TO_L;
  const Vb_L = volumeAdded_mL * ML_TO_L;
  const Vtotal_L = Va_L + Vb_L;

  const molAcid_initial = analyteSolution.concentration * Va_L;
  const molBase_added = titrantConcentration * Vb_L;

  if (volumeAdded_mL <= EPSILON_VOL_ML) {
    return pHWeakAcid(analyteSolution.concentration, analyte.Ka);
  }

  if (molBase_added < molAcid_initial - EPSILON_VOL_ML) {
    // Use full equilibrium (not bare H-H) to stay continuous at V_b → 0.
    const Cf_HA = (molAcid_initial - molBase_added) / Vtotal_L;
    const Cf_A = molBase_added / Vtotal_L;
    return pHBufferEquilibrium(Cf_HA, Cf_A, analyte.Ka);
  }

  if (Math.abs(molBase_added - molAcid_initial) < EPSILON_VOL_ML * analyteSolution.concentration) {
    const saltConcentration = molAcid_initial / Vtotal_L;
    return pHEquivalenceWeakAcidStrongBase(saltConcentration, analyte.Ka);
  }

  const excessOH = molBase_added - molAcid_initial;
  return pHExcessStrongBase(excessOH, Vtotal_L);
}

export function titrationCurve(
  setup: TitrationSetup,
  options: { stepCount?: number; maxVolume_mL?: number } = {},
): TitrationPoint[] {
  const Veq = equivalenceVolume_mL(setup);
  const maxVolume = options.maxVolume_mL ?? Veq * 1.6;
  const steps = options.stepCount ?? 200;
  const points: TitrationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const volumeAdded_mL = (maxVolume * i) / steps;
    points.push({
      volumeAdded_mL,
      pH: pHAt(volumeAdded_mL, setup),
      region: regionAt(volumeAdded_mL, setup),
    });
  }
  return points;
}

/**
 * Back-calculate the analyte concentration from a successful titration.
 * Used after the student records their endpoint volume.
 */
export function concentrationFromEndpoint(
  endpointVolume_mL: number,
  titrantConcentration: number,
  analyteVolume_mL: number,
): number {
  const molBase = titrantConcentration * endpointVolume_mL * ML_TO_L;
  const Va_L = analyteVolume_mL * ML_TO_L;
  return molBase / Va_L;
}
