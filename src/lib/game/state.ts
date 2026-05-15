import { create } from "zustand";
import type { TitrationSetup } from "@/types/chemistry";
import { PHENOLPHTHALEIN } from "@/lib/chemistry/constants";
import { equivalenceVolume_mL, pHAt } from "@/lib/chemistry/titration";
import { vinegarTitrationSetup } from "@/lib/chemistry/vinegar";

const DEFAULT_CONFIG = {
  vinegarPercent: 5.0,
  sampleVolume_mL: 25.0,
  dilutionFactor: 10,
  titrantConcentration: 0.1,
};

export interface GameState {
  setup: TitrationSetup;
  indicator: typeof PHENOLPHTHALEIN;
  volumeAdded_mL: number;
  history: { volume: number; pH: number }[];
  endpointVolume_mL: number | null;
  isDripping: boolean;

  addDrop: (volume_mL: number) => void;
  setDripping: (dripping: boolean) => void;
  markEndpoint: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  setup: vinegarTitrationSetup(DEFAULT_CONFIG),
  indicator: PHENOLPHTHALEIN,
  volumeAdded_mL: 0,
  history: [{ volume: 0, pH: pHAt(0, vinegarTitrationSetup(DEFAULT_CONFIG)) }],
  endpointVolume_mL: null,
  isDripping: false,

  addDrop: (volume_mL) => {
    const { setup, volumeAdded_mL, history } = get();
    const newVolume = volumeAdded_mL + volume_mL;
    const newPh = pHAt(newVolume, setup);
    set({
      volumeAdded_mL: newVolume,
      history: [...history, { volume: newVolume, pH: newPh }],
    });
  },

  setDripping: (dripping) => set({ isDripping: dripping }),

  markEndpoint: () => {
    const { volumeAdded_mL } = get();
    set({ endpointVolume_mL: volumeAdded_mL });
  },

  reset: () => {
    const setup = vinegarTitrationSetup(DEFAULT_CONFIG);
    set({
      setup,
      volumeAdded_mL: 0,
      history: [{ volume: 0, pH: pHAt(0, setup) }],
      endpointVolume_mL: null,
      isDripping: false,
    });
  },
}));

export function selectCurrentPH(state: GameState): number {
  return pHAt(state.volumeAdded_mL, state.setup);
}

export function selectEquivalenceVolume(state: GameState): number {
  return equivalenceVolume_mL(state.setup);
}
