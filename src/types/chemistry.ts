export interface Solution {
  readonly concentration: number;
  readonly volume_mL: number;
}

export interface WeakAcid {
  readonly name: string;
  readonly formula: string;
  readonly Ka: number;
}

export interface StrongBase {
  readonly name: string;
  readonly formula: string;
}

export interface TitrationSetup {
  readonly analyte: WeakAcid;
  readonly analyteSolution: Solution;
  readonly titrant: StrongBase;
  readonly titrantConcentration: number;
}

export interface TitrationPoint {
  readonly volumeAdded_mL: number;
  readonly pH: number;
  readonly region: TitrationRegion;
}

export type TitrationRegion =
  | "initial"
  | "buffer"
  | "half-equivalence"
  | "equivalence"
  | "post-equivalence";

export interface Indicator {
  readonly name: string;
  readonly pKaHIn: number;
  readonly acidColor: string;
  readonly baseColor: string;
  readonly transitionLow: number;
  readonly transitionHigh: number;
}
