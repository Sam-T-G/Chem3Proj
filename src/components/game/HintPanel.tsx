"use client";

import { selectEquivalenceVolume, useGameStore } from "@/lib/game/state";
import { regionAt } from "@/lib/chemistry/titration";
import { useDisplayPH } from "@/lib/game/useDisplayPH";
import { TRO_REFERENCES } from "@/lib/content/tro-references";

const REGION_HINTS: Record<
  string,
  { headline: string; body: string; refId: keyof typeof TRO_REFERENCES }
> = {
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
  const swirl = useGameStore((s) => s.swirl);
  const Veq = useGameStore(selectEquivalenceVolume);
  const { equilibriumPH, displayedPH, secondsSinceMixing } = useDisplayPH();

  const region = regionAt(volumeAdded, setup);
  const hint = REGION_HINTS[region] ?? REGION_HINTS.initial!;
  const ref = TRO_REFERENCES[hint.refId];
  const fading = equilibriumPH > 8 && equilibriumPH - displayedPH > 0.15;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">Region</div>
        <div className="font-semibold">{hint.headline}</div>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{hint.body}</p>
      </div>

      {fading && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/40">
          <div className="font-semibold text-amber-900 dark:text-amber-100">
            Phenolphthalein is fading.
          </div>
          <p className="mt-1 text-amber-900 dark:text-amber-200">
            CO₂ from the air is dissolving and converting OH⁻ to HCO₃⁻, pulling pH back below
            the transition. The real endpoint is the <em>first persistent pink</em>, not the
            first hint of pink. Swirl, watch for ≥ 30 s, then decide.
          </p>
          <button
            type="button"
            onClick={swirl}
            className="mt-2 rounded-md border border-amber-400 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/40"
          >
            Swirl &amp; re-equilibrate
          </button>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <dt className="text-slate-500">V added</dt>
        <dd className="text-right font-mono">{volumeAdded.toFixed(2)} mL</dd>
        <dt className="text-slate-500">
          V<sub>eq</sub> (true)
        </dt>
        <dd className="text-right font-mono">{Veq.toFixed(2)} mL</dd>
        <dt className="text-slate-500">pH (displayed)</dt>
        <dd className="text-right font-mono">{displayedPH.toFixed(2)}</dd>
        <dt className="text-slate-500">pH (equilibrium)</dt>
        <dd className="text-right font-mono">{equilibriumPH.toFixed(2)}</dd>
        <dt className="text-slate-500">Time since mix</dt>
        <dd className="text-right font-mono">{secondsSinceMixing.toFixed(1)} s</dd>
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
