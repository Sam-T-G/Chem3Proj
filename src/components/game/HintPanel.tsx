"use client";

import { useGameStore } from "@/lib/game/state";
import { regionAt } from "@/lib/chemistry/titration";
import { useDisplayPH } from "@/lib/game/useDisplayPH";

const REGION_LABEL: Record<string, { name: string; one_liner: string }> = {
  initial: {
    name: "Initial weak acid",
    one_liner: "pH from Ka of the analyte alone.",
  },
  buffer: {
    name: "Buffer region",
    one_liner: "Mix of HA and A⁻. pH = pKa + log([A⁻]/[HA]).",
  },
  "half-equivalence": {
    name: "Half-equivalence",
    one_liner: "[HA] = [A⁻], so pH = pKa.",
  },
  equivalence: {
    name: "Equivalence point",
    one_liner: "All HA → A⁻; basic because A⁻ hydrolyzes.",
  },
  "post-equivalence": {
    name: "Past equivalence",
    one_liner: "Excess OH⁻ sets the pH.",
  },
};

export function HintPanel() {
  const setup = useGameStore((s) => s.setup);
  const volumeAdded = useGameStore((s) => s.volumeAdded_mL);
  const swirl = useGameStore((s) => s.swirl);
  const { equilibriumPH, displayedPH } = useDisplayPH();

  const region = regionAt(volumeAdded, setup);
  const label = REGION_LABEL[region] ?? REGION_LABEL.initial!;
  const fading = equilibriumPH > 8 && equilibriumPH - displayedPH > 0.15;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">Region</div>
        <div className="font-semibold">{label.name}</div>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{label.one_liner}</p>
      </div>

      <dl className="grid grid-cols-2 gap-1 text-xs">
        <dt className="text-slate-500">pH</dt>
        <dd className="text-right font-mono">{displayedPH.toFixed(2)}</dd>
        <dt className="text-slate-500">NaOH added</dt>
        <dd className="text-right font-mono">{volumeAdded.toFixed(2)} mL</dd>
      </dl>

      {fading && (
        <button
          type="button"
          onClick={swirl}
          className="flex w-full items-center justify-between rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
          title="CO₂ pickup is pulling pH back down. Real endpoints persist for ≥ 30 s."
        >
          <span>Pink is fading.</span>
          <span className="font-semibold">Swirl ↻</span>
        </button>
      )}
    </div>
  );
}
