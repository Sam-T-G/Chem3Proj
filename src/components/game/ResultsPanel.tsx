"use client";

import { useGameStore } from "@/lib/game/state";
import { concentrationFromEndpoint } from "@/lib/chemistry/titration";
import { percentAceticFromMolarity } from "@/lib/chemistry/vinegar";

export function ResultsPanel() {
  const setup = useGameStore((s) => s.setup);
  const endpoint = useGameStore((s) => s.endpointVolume_mL);

  if (endpoint === null) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
        Mark the endpoint to see your result.
      </div>
    );
  }

  const measuredMolarity = concentrationFromEndpoint(
    endpoint,
    setup.titrantConcentration,
    setup.analyteSolution.volume_mL,
  );
  const trueMolarity = setup.analyteSolution.concentration;
  const percent = percentAceticFromMolarity(measuredMolarity * 10);
  const errorPct = (Math.abs(measuredMolarity - trueMolarity) / trueMolarity) * 100;

  return (
    <div className="space-y-1 rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt>Endpoint</dt>
        <dd className="text-right font-mono">{endpoint.toFixed(2)} mL</dd>
        <dt>% acetic acid</dt>
        <dd className="text-right font-mono">{percent.toFixed(2)}%</dd>
        <dt>Error vs. true</dt>
        <dd className="text-right font-mono">{errorPct.toFixed(2)}%</dd>
      </dl>
    </div>
  );
}
