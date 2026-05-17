"use client";

import { useEffect, useState } from "react";
import {
  NOMINAL_NAOH_MOLARITY,
  VINEGAR_DILUTION_FACTOR,
  VINEGAR_SAMPLE_VOLUME_ML,
  useGameStore,
} from "@/lib/game/state";
import { TitrationStation } from "./TitrationStation";

export function TitrateStep({ onComplete }: { onComplete: () => void }) {
  const loadVinegarSetup = useGameStore((s) => s.loadVinegarSetup);
  const standardization = useGameStore((s) => s.standardization);
  const endpointVolume_mL = useGameStore((s) => s.endpointVolume_mL);

  const [loaded, setLoaded] = useState(false);
  const [useLabelInstead, setUseLabelInstead] = useState(false);

  useEffect(() => {
    const working = useLabelInstead
      ? NOMINAL_NAOH_MOLARITY
      : (standardization?.measuredNaOHMolarity ?? NOMINAL_NAOH_MOLARITY);
    loadVinegarSetup(working);
    setLoaded(true);
  }, [loadVinegarSetup, standardization, useLabelInstead]);

  const workingMolarity = useLabelInstead
    ? NOMINAL_NAOH_MOLARITY
    : (standardization?.measuredNaOHMolarity ?? NOMINAL_NAOH_MOLARITY);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-bold">Titrate the vinegar</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-700 dark:text-slate-300">
          You pipetted <strong>{VINEGAR_SAMPLE_VOLUME_ML} mL</strong> of vinegar diluted{" "}
          <strong>{VINEGAR_DILUTION_FACTOR}×</strong> into the flask with two drops of
          phenolphthalein. Working NaOH molarity:{" "}
          <span className="font-mono">{workingMolarity.toFixed(4)} M</span>
          {useLabelInstead && (
            <span className="ml-1 text-amber-700 dark:text-amber-300">(from label)</span>
          )}
          .
        </p>
      </header>

      <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        <input
          type="checkbox"
          checked={useLabelInstead}
          onChange={(e) => setUseLabelInstead(e.target.checked)}
        />
        Use the bottle label (0.100 M) instead of your standardized value — what happens to
        the result?
      </label>

      {loaded && <TitrationStation />}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div className="text-sm">
          {endpointVolume_mL == null ? (
            <span className="text-slate-500">
              Add NaOH until persistent pink, then <em>Mark endpoint</em>.
            </span>
          ) : (
            <>
              <span className="font-semibold">Endpoint: </span>
              <span className="font-mono">{endpointVolume_mL.toFixed(2)} mL</span>
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
