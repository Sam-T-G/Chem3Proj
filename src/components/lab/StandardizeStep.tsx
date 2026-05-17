"use client";

import { useEffect, useState } from "react";
import { KHP_MASS_G, useGameStore } from "@/lib/game/state";
import { naOHMolarityFromKHPStandardization } from "@/lib/chemistry/khp";
import { TitrationStation } from "./TitrationStation";

export function StandardizeStep({ onComplete }: { onComplete: () => void }) {
  const loadStandardizationSetup = useGameStore((s) => s.loadStandardizationSetup);
  const endpointVolume_mL = useGameStore((s) => s.endpointVolume_mL);
  const recordStandardization = useGameStore((s) => s.recordStandardization);
  const standardization = useGameStore((s) => s.standardization);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadStandardizationSetup();
    setLoaded(true);
  }, [loadStandardizationSetup]);

  const submit = () => {
    if (endpointVolume_mL == null) return;
    const measured = naOHMolarityFromKHPStandardization(KHP_MASS_G, endpointVolume_mL);
    recordStandardization({
      endpointVolume_mL,
      measuredNaOHMolarity: measured,
    });
    onComplete();
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-bold">Standardize the NaOH</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-700 dark:text-slate-300">
          The bottle is labeled 0.100 M, but NaOH is hygroscopic and absorbs CO₂ in storage —
          the real molarity drifts. Standardize it against a known mass of primary-standard
          KHP. You weighed out <strong>{KHP_MASS_G.toFixed(4)} g</strong> of KHP and dissolved
          it in ~50 mL of water. Titrate it to the phenolphthalein endpoint, then{" "}
          <em>Mark endpoint</em>.
        </p>
      </header>

      {loaded && <TitrationStation />}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div className="text-sm">
          {endpointVolume_mL == null ? (
            <span className="text-slate-500">
              Drop NaOH until the phenolphthalein turns persistently pink, then{" "}
              <em>Mark endpoint</em>.
            </span>
          ) : (
            <>
              <span className="font-semibold">Endpoint: </span>
              <span className="font-mono">{endpointVolume_mL.toFixed(2)} mL</span>
              <span className="ml-3 text-slate-500">→ measured</span>{" "}
              <span className="font-mono">
                {naOHMolarityFromKHPStandardization(KHP_MASS_G, endpointVolume_mL).toFixed(4)} M
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
          Use this NaOH for the vinegar titration →
        </button>
      </div>

      {standardization && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
          Recorded. Working NaOH molarity for the next step:{" "}
          <span className="font-mono">{standardization.measuredNaOHMolarity.toFixed(4)} M</span>.
        </div>
      )}
    </section>
  );
}
