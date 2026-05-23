"use client";

import { useEffect, useState } from "react";
import {
  NOMINAL_NAOH_MOLARITY,
  VINEGAR_SAMPLE_VOLUME_ML,
  useGameStore,
} from "@/lib/game/state";
import { TitrationStation } from "./TitrationStation";

export function TitrateStep({ onComplete }: { onComplete: () => void }) {
  const loadVinegarSetup = useGameStore((s) => s.loadVinegarSetup);
  const standardization = useGameStore((s) => s.standardization);
  const endpointVolume_mL = useGameStore((s) => s.endpointVolume_mL);

  const [loaded, setLoaded] = useState(false);
  const workingMolarity = standardization?.measuredNaOHMolarity ?? NOMINAL_NAOH_MOLARITY;

  useEffect(() => {
    loadVinegarSetup(workingMolarity);
    setLoaded(true);
  }, [loadVinegarSetup, workingMolarity]);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-bold">Titrate the vinegar</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {VINEGAR_SAMPLE_VOLUME_ML} mL of diluted vinegar with phenolphthalein. Stop at the
          first <em>persistent</em> pink.
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
              <span className="ml-3 text-slate-500">at endpoint</span>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={endpointVolume_mL == null}
          onClick={onComplete}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          See the report →
        </button>
      </div>
    </section>
  );
}
