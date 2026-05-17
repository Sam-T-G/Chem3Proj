"use client";

import { PHENOLPHTHALEIN } from "@/lib/chemistry/constants";
import { useGameStore } from "@/lib/game/state";
import {
  concentrationFromEndpoint,
  equivalenceVolume_mL,
  indicatorEndpointVolume,
} from "@/lib/chemistry/titration";
import { percentAceticFromMolarity } from "@/lib/chemistry/vinegar";

export function ResultsPanel() {
  const setup = useGameStore((s) => s.setup);
  const endpoint = useGameStore((s) => s.endpointVolume_mL);

  if (endpoint === null) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
        Mark an endpoint to see your computed concentration and how it compares to the true
        equivalence point.
      </div>
    );
  }

  const trueVeq = equivalenceVolume_mL(setup);
  const indicatorVeq = indicatorEndpointVolume(setup, PHENOLPHTHALEIN);
  const measuredMolarity = concentrationFromEndpoint(
    endpoint,
    setup.titrantConcentration,
    setup.analyteSolution.volume_mL,
  );
  const trueMolarity = setup.analyteSolution.concentration;
  const percent = percentAceticFromMolarity(measuredMolarity * 10);
  const errorPct = (Math.abs(measuredMolarity - trueMolarity) / trueMolarity) * 100;

  return (
    <div className="space-y-2 rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
      <h2 className="font-semibold">Endpoint recorded</h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt>Your endpoint</dt>
        <dd className="text-right font-mono">{endpoint.toFixed(2)} mL</dd>
        <dt>Indicator midpoint (theory)</dt>
        <dd className="text-right font-mono">{indicatorVeq.toFixed(2)} mL</dd>
        <dt>
          True V<sub>eq</sub>
        </dt>
        <dd className="text-right font-mono">{trueVeq.toFixed(2)} mL</dd>
        <dt>Measured [analyte] (diluted)</dt>
        <dd className="text-right font-mono">{measuredMolarity.toFixed(4)} M</dd>
        <dt>% acetic acid (assuming 10× dilution)</dt>
        <dd className="text-right font-mono">{percent.toFixed(2)}%</dd>
        <dt>Error vs. true [analyte]</dt>
        <dd className="text-right font-mono">{errorPct.toFixed(2)}%</dd>
      </dl>
    </div>
  );
}
