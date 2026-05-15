import type { Indicator, StrongBase, WeakAcid } from "@/types/chemistry";

export const Kw = 1.0e-14;

export const ACETIC_ACID: WeakAcid = {
  name: "Acetic acid",
  formula: "CH₃COOH",
  Ka: 1.8e-5,
};

export const SODIUM_HYDROXIDE: StrongBase = {
  name: "Sodium hydroxide",
  formula: "NaOH",
};

export const PHENOLPHTHALEIN: Indicator = {
  name: "Phenolphthalein",
  pKaHIn: 9.4,
  acidColor: "#fafafa",
  baseColor: "#ec4899",
  transitionLow: 8.2,
  transitionHigh: 10.0,
};

export const BROMOTHYMOL_BLUE: Indicator = {
  name: "Bromothymol blue",
  pKaHIn: 7.1,
  acidColor: "#facc15",
  baseColor: "#3b82f6",
  transitionLow: 6.0,
  transitionHigh: 7.6,
};

export const VINEGAR_TYPICAL_PERCENT_ACETIC = 5.0;
export const VINEGAR_DENSITY_G_PER_ML = 1.005;
export const ACETIC_ACID_MOLAR_MASS = 60.052;
