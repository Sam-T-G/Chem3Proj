import { create } from "zustand";
import type { TitrationSetup } from "@/types/chemistry";
import { PHENOLPHTHALEIN } from "@/lib/chemistry/constants";
import { equivalenceVolume_mL, pHAt } from "@/lib/chemistry/titration";
import { vinegarTitrationSetup } from "@/lib/chemistry/vinegar";
import { khpStandardSetup } from "@/lib/chemistry/khp";

/**
 * Hidden truths the simulation enforces, but the student doesn't know:
 *  - `trueNaOHMolarity`: the bottle is labeled 0.1000 M, but it's actually
 *    a bit weaker because of CO₂ pickup in storage. Standardizing against
 *    KHP is what surfaces this.
 *  - `vinegarTruePercent`: the bottle is labeled 5.0%, but the actual value
 *    is in the legal range 4–7% — students should accept the *measured*
 *    value, not anchor on the label.
 */
const LAB_SECRETS = {
  trueNaOHMolarity: 0.0987,
  vinegarTruePercent: 5.4,
} as const;

const DEFAULT_VINEGAR_CONFIG = {
  vinegarPercent: LAB_SECRETS.vinegarTruePercent,
  sampleVolume_mL: 25.0,
  dilutionFactor: 10,
  titrantConcentration: LAB_SECRETS.trueNaOHMolarity,
};

const DEFAULT_KHP_CONFIG = {
  khpMass_g: 0.5102,
  waterVolume_mL: 50,
  nominalNaOHMolarity: LAB_SECRETS.trueNaOHMolarity,
};

export const NOMINAL_NAOH_MOLARITY = 0.1;
export const KHP_MASS_G = DEFAULT_KHP_CONFIG.khpMass_g;
export const VINEGAR_DILUTION_FACTOR = DEFAULT_VINEGAR_CONFIG.dilutionFactor;
export const VINEGAR_SAMPLE_VOLUME_ML = DEFAULT_VINEGAR_CONFIG.sampleVolume_mL;

export interface Predictions {
  expectedVeq_mL: number | null;
  expectedEquivalencePH: number | null;
  chosenIndicatorName: string | null;
}

export interface StandardizationResult {
  endpointVolume_mL: number;
  measuredNaOHMolarity: number;
}

export interface GameState {
  setup: TitrationSetup;
  indicator: typeof PHENOLPHTHALEIN;
  volumeAdded_mL: number;
  history: { volume: number; pH: number }[];
  endpointVolume_mL: number | null;
  isDripping: boolean;
  lastMixedAt_ms: number;

  predictions: Predictions;
  standardization: StandardizationResult | null;

  addDrop: (volume_mL: number) => void;
  setDripping: (dripping: boolean) => void;
  markEndpoint: () => void;
  swirl: () => void;
  reset: () => void;

  loadStandardizationSetup: () => void;
  loadVinegarSetup: (workingMolarity?: number) => void;

  setPrediction: <K extends keyof Predictions>(key: K, value: Predictions[K]) => void;
  recordStandardization: (result: StandardizationResult) => void;
}

const initialPredictions: Predictions = {
  expectedVeq_mL: null,
  expectedEquivalencePH: null,
  chosenIndicatorName: null,
};

function freshTitrationState(setup: TitrationSetup) {
  return {
    setup,
    volumeAdded_mL: 0,
    history: [{ volume: 0, pH: pHAt(0, setup) }],
    endpointVolume_mL: null,
    isDripping: false,
    lastMixedAt_ms: Date.now(),
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...freshTitrationState(vinegarTitrationSetup(DEFAULT_VINEGAR_CONFIG)),
  indicator: PHENOLPHTHALEIN,
  predictions: initialPredictions,
  standardization: null,

  addDrop: (volume_mL) => {
    const { setup, volumeAdded_mL, history } = get();
    const newVolume = volumeAdded_mL + volume_mL;
    const newPh = pHAt(newVolume, setup);
    set({
      volumeAdded_mL: newVolume,
      history: [...history, { volume: newVolume, pH: newPh }],
      lastMixedAt_ms: Date.now(),
    });
  },

  setDripping: (dripping) => set({ isDripping: dripping }),

  markEndpoint: () => {
    const { volumeAdded_mL } = get();
    set({ endpointVolume_mL: volumeAdded_mL });
  },

  swirl: () => set({ lastMixedAt_ms: Date.now() }),

  reset: () => set(freshTitrationState(get().setup)),

  loadStandardizationSetup: () => {
    const setup = khpStandardSetup(DEFAULT_KHP_CONFIG);
    set(freshTitrationState(setup));
  },

  loadVinegarSetup: (workingMolarity) => {
    const setup = vinegarTitrationSetup({
      ...DEFAULT_VINEGAR_CONFIG,
      titrantConcentration: workingMolarity ?? LAB_SECRETS.trueNaOHMolarity,
    });
    set(freshTitrationState(setup));
  },

  setPrediction: (key, value) =>
    set({ predictions: { ...get().predictions, [key]: value } }),

  recordStandardization: (result) => set({ standardization: result }),
}));

export function selectCurrentPH(state: GameState): number {
  return pHAt(state.volumeAdded_mL, state.setup);
}

export function selectEquivalenceVolume(state: GameState): number {
  return equivalenceVolume_mL(state.setup);
}

export const LAB_TRUTHS = LAB_SECRETS;
