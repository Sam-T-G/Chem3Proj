"use client";

import { useEffect, useState } from "react";
import { KHP_MASS_G, useGameStore } from "@/lib/game/state";
import { naOHMolarityFromKHPStandardization } from "@/lib/chemistry/khp";
import { TitrationStation } from "./TitrationStation";

export function StandardizeStep({ onComplete }: { onComplete: () => void }) {
  const loadStandardizationSetup = useGameStore((s) => s.loadStandardizationSetup);
  const endpointVolume_mL = useGameStore((s) => s.endpointVolume_mL);
  const recordStandardization = useGameStore((s) => s.recordStandardization);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadStandardizationSetup();
    setLoaded(true);
  }, [loadStandardizationSetup]);

  const submit = () => {
    if (endpointVolume_mL == null) return;
    const measured = naOHMolarityFromKHPStandardization(KHP_MASS_G, endpointVolume_mL);
    recordStandardization({ endpointVolume_mL, measuredNaOHMolarity: measured });
    onComplete();
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-bold">Standardize the NaOH</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Titrate {KHP_MASS_G.toFixed(4)} g of KHP to find the real NaOH molarity (the label
          drifts over time).
        </p>
      </header>

      {loaded && <TitrationStation />}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div className="text-sm">
          {endpointVolume_mL == null ? (
            <span className="text-slate-500">Mark the endpoint when pink persists.</span>
          ) : (
            <>
              <span className="font-mono">{endpointVolume_mL.toFixed(2)} mL</span>
              <span className="ml-3 text-slate-500">→</span>{" "}
              <span className="font-mono">
                {naOHMolarityFromKHPStandardization(KHP_MASS_G, endpointVolume_mL).toFixed(4)} M
                NaOH
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={endpointVolume_mL == null}
          onClick={submit}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}
