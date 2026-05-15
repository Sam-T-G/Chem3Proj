"use client";

import { selectCurrentPH, selectEquivalenceVolume, useGameStore } from "@/lib/game/state";
import { regionAt } from "@/lib/chemistry/titration";
import { TRO_REFERENCES } from "@/lib/content/tro-references";

const REGION_HINTS: Record<string, { headline: string; body: string; refId: keyof typeof TRO_REFERENCES }> = {
  initial: {
    headline: "Initial weak-acid solution",
    body: "Only HA is present. Compute pH from Ka via an ICE table; the 5% approximation usually holds for acetic acid at these concentrations.",
    refId: "weakAcidEquilibrium",
  },
  buffer: {
    headline: "Buffer region",
    body: "You're producing a mixture of HA and A⁻. pH = pKa + log([A⁻]/[HA]).",
    refId: "hendersonHasselbalch",
  },
  "half-equivalence": {
    headline: "Half-equivalence",
    body: "Exactly half the acid has reacted, so [HA] = [A⁻] and pH = pKa.",
    refId: "halfEquivalence",
  },
  equivalence: {
    headline: "Equivalence point",
    body: "All HA has converted to A⁻. Acetate hydrolyzes water → solution is basic (pH > 7).",
    refId: "weakStrongTitration",
  },
  "post-equivalence": {
    headline: "Past equivalence",
    body: "Excess strong base now dominates. Compute pH from [OH⁻] of the leftover NaOH.",
    refId: "weakStrongTitration",
  },
};

export function HintPanel() {
  const setup = useGameStore((s) => s.setup);
  const volumeAdded = useGameStore((s) => s.volumeAdded_mL);
  const Veq = useGameStore(selectEquivalenceVolume);
  const pH = useGameStore(selectCurrentPH);

  const region = regionAt(volumeAdded, setup);
  const hint = REGION_HINTS[region] ?? REGION_HINTS.initial!;
  const ref = TRO_REFERENCES[hint.refId];

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">Region</div>
        <div className="font-semibold">{hint.headline}</div>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{hint.body}</p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <dt className="text-slate-500">V added</dt>
        <dd className="text-right font-mono">{volumeAdded.toFixed(2)} mL</dd>
        <dt className="text-slate-500">V<sub>eq</sub> (true)</dt>
        <dd className="text-right font-mono">{Veq.toFixed(2)} mL</dd>
        <dt className="text-slate-500">pH</dt>
        <dd className="text-right font-mono">{pH.toFixed(2)}</dd>
      </dl>

      {ref && (
        <div className="border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-800">
          <span className="font-semibold">Tro reference:</span> {ref.title}{" "}
          <span className="ml-1">({ref.section})</span>
        </div>
      )}
    </div>
  );
}
