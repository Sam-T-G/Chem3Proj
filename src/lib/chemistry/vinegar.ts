import {
  ACETIC_ACID,
  ACETIC_ACID_MOLAR_MASS,
  SODIUM_HYDROXIDE,
  VINEGAR_DENSITY_G_PER_ML,
  VINEGAR_TYPICAL_PERCENT_ACETIC,
} from "./constants";
import type { TitrationSetup } from "@/types/chemistry";

/**
 * Convert a vinegar percent-by-mass label into molarity of acetic acid.
 * M = (percent/100 · density · 1000) / molar_mass
 */
export function vinegarMolarity(
  percentByMass: number = VINEGAR_TYPICAL_PERCENT_ACETIC,
  density_g_per_mL: number = VINEGAR_DENSITY_G_PER_ML,
): number {
  return ((percentByMass / 100) * density_g_per_mL * 1000) / ACETIC_ACID_MOLAR_MASS;
}

export function percentAceticFromMolarity(
  molarity: number,
  density_g_per_mL: number = VINEGAR_DENSITY_G_PER_ML,
): number {
  return ((molarity * ACETIC_ACID_MOLAR_MASS) / (density_g_per_mL * 1000)) * 100;
}

export interface VinegarLabConfig {
  readonly vinegarPercent: number;
  readonly sampleVolume_mL: number;
  readonly dilutionFactor: number;
  readonly titrantConcentration: number;
}

export function vinegarTitrationSetup(config: VinegarLabConfig): TitrationSetup {
  const stockMolarity = vinegarMolarity(config.vinegarPercent);
  return {
    analyte: ACETIC_ACID,
    analyteSolution: {
      concentration: stockMolarity / config.dilutionFactor,
      volume_mL: config.sampleVolume_mL,
    },
    titrant: SODIUM_HYDROXIDE,
    titrantConcentration: config.titrantConcentration,
  };
}
