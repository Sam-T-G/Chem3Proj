import type { TitrationSetup, WeakAcid } from "@/types/chemistry";
import { SODIUM_HYDROXIDE } from "./constants";

/**
 * Potassium hydrogen phthalate — the canonical primary standard for
 * standardizing NaOH. Solid, non-hygroscopic, high molar mass for low
 * weighing error, sharp endpoint with phenolphthalein.
 *
 *   KHP + NaOH → KNaP + H₂O          (1:1 stoichiometry)
 */
export const KHP: WeakAcid = {
  name: "Potassium hydrogen phthalate",
  formula: "KHC₈H₄O₄",
  Ka: 3.1e-6,
};

export const KHP_MOLAR_MASS = 204.22;

export interface KHPStandardConfig {
  readonly khpMass_g: number;
  readonly waterVolume_mL: number;
  readonly nominalNaOHMolarity: number;
}

export function khpStandardSetup(config: KHPStandardConfig): TitrationSetup {
  const moles = config.khpMass_g / KHP_MOLAR_MASS;
  const concentration = (moles / config.waterVolume_mL) * 1000;
  return {
    analyte: KHP,
    analyteSolution: { concentration, volume_mL: config.waterVolume_mL },
    titrant: SODIUM_HYDROXIDE,
    titrantConcentration: config.nominalNaOHMolarity,
  };
}

/**
 * Back-calculate the actual NaOH molarity from a recorded endpoint, given
 * the known mass of KHP that was dissolved. This is the whole point of
 * standardization — labels lie, but mass on an analytical balance doesn't.
 */
export function naOHMolarityFromKHPStandardization(
  khpMass_g: number,
  endpointVolume_mL: number,
): number {
  if (endpointVolume_mL <= 0) throw new Error("endpoint volume must be > 0");
  const moles_khp = khpMass_g / KHP_MOLAR_MASS;
  return (moles_khp / endpointVolume_mL) * 1000;
}
