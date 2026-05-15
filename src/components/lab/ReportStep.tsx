"use client";

import {
  LAB_TRUTHS,
  NOMINAL_NAOH_MOLARITY,
  VINEGAR_DILUTION_FACTOR,
  VINEGAR_SAMPLE_VOLUME_ML,
  useGameStore,
} from "@/lib/game/state";
import {
  concentrationFromEndpoint,
  equivalenceVolume_mL,
  indicatorEndpointVolume,
  pHAt,
} from "@/lib/chemistry/titration";
import { percentAceticFromMolarity } from "@/lib/chemistry/vinegar";
import { PHENOLPHTHALEIN } from "@/lib/chemistry/constants";

export function ReportStep({ onRestart }: { onRestart: () => void }) {
  const predictions = useGameStore((s) => s.predictions);
  const standardization = useGameStore((s) => s.standardization);
  const setup = useGameStore((s) => s.setup);
  const endpointVolume_mL = useGameStore((s) => s.endpointVolume_mL);

  const Veq = equivalenceVolume_mL(setup);
  const Veq_pH = pHAt(Veq, setup);
  const V_indicator = indicatorEndpointVolume(setup, PHENOLPHTHALEIN);
  const indicatorError_mL = V_indicator - Veq;

  const workingMolarity = standardization?.measuredNaOHMolarity ?? NOMINAL_NAOH_MOLARITY;
  const measuredDilutedMolarity =
    endpointVolume_mL == null
      ? null
      : concentrationFromEndpoint(endpointVolume_mL, workingMolarity, VINEGAR_SAMPLE_VOLUME_ML);
  const measuredUndilutedMolarity =
    measuredDilutedMolarity == null ? null : measuredDilutedMolarity * VINEGAR_DILUTION_FACTOR;
  const measuredPercent =
    measuredUndilutedMolarity == null ? null : percentAceticFromMolarity(measuredUndilutedMolarity);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Lab report</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
          You committed your predictions before touching the burette. Here's what actually
          happened and where the gaps are.
        </p>
      </header>

      <ComparisonCard
        title="V at equivalence"
        predicted={predictions.expectedVeq_mL}
        actual={Veq}
        unit="mL"
      />
      <ComparisonCard
        title="pH at equivalence"
        predicted={predictions.expectedEquivalencePH}
        actual={Veq_pH}
        unit=""
        commentary={
          Veq_pH > 7
            ? "Above 7 because acetate (the conjugate base) hydrolyzes water. A pH-7 prediction is a strong-acid / strong-base reflex; it doesn't apply here."
            : ""
        }
      />
      <Card>
        <h3 className="font-semibold">Indicator choice</h3>
        <p className="mt-1 text-sm">
          You chose: <span className="font-mono">{predictions.chosenIndicatorName ?? "—"}</span>
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Phenolphthalein (pKa_HIn = 9.4, transition 8.2–10.0) straddles the equivalence pH of{" "}
          {Veq_pH.toFixed(2)}, which is why it's the standard choice for weak-acid /
          strong-base titrations. Methyl orange transitions far below — it would flag an
          "endpoint" while you're still mid-buffer.
        </p>
      </Card>

      <Card>
        <h3 className="font-semibold">Endpoint vs. equivalence point</h3>
        <dl className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
          <dt>Your endpoint (when you stopped)</dt>
          <dd className="text-right font-mono">
            {endpointVolume_mL == null ? "—" : `${endpointVolume_mL.toFixed(2)} mL`}
          </dd>
          <dt>Indicator midpoint (theoretical, pH = pKa_HIn)</dt>
          <dd className="text-right font-mono">{V_indicator.toFixed(2)} mL</dd>
          <dt>True equivalence (n_acid = n_base)</dt>
          <dd className="text-right font-mono">{Veq.toFixed(2)} mL</dd>
          <dt>Indicator error</dt>
          <dd className="text-right font-mono">{indicatorError_mL.toFixed(3)} mL</dd>
        </dl>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          The endpoint is what the eye sees; the equivalence point is what the stoichiometry
          says. The small gap is the "indicator error" — minimized by choosing an indicator
          whose pKa_HIn is close to the equivalence pH.
        </p>
      </Card>

      <Card>
        <h3 className="font-semibold">Standardization, then vinegar</h3>
        <dl className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
          <dt>Labeled NaOH molarity</dt>
          <dd className="text-right font-mono">{NOMINAL_NAOH_MOLARITY.toFixed(4)} M</dd>
          <dt>Your standardized NaOH molarity</dt>
          <dd className="text-right font-mono">
            {standardization?.measuredNaOHMolarity.toFixed(4) ?? "(skipped)"} M
          </dd>
          <dt>True NaOH molarity</dt>
          <dd className="text-right font-mono">{LAB_TRUTHS.trueNaOHMolarity.toFixed(4)} M</dd>
          <dt>Measured % acetic acid in vinegar</dt>
          <dd className="text-right font-mono">
            {measuredPercent == null ? "—" : `${measuredPercent.toFixed(2)}%`}
          </dd>
          <dt>True % acetic acid</dt>
          <dd className="text-right font-mono">
            {LAB_TRUTHS.vinegarTruePercent.toFixed(2)}%
          </dd>
          <dt>Bottle label</dt>
          <dd className="text-right font-mono">5.00%</dd>
        </dl>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Real vinegar varies 4–7% by law; don't anchor on the label. The propagation goes:
          KHP mass → standardized [NaOH] → V_endpoint of vinegar → diluted [HOAc] → undiluted
          [HOAc] → % m/m via density and molar mass.
        </p>
      </Card>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Restart the lab
        </button>
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">{children}</div>
  );
}

function ComparisonCard({
  title,
  predicted,
  actual,
  unit,
  commentary,
}: {
  title: string;
  predicted: number | null;
  actual: number;
  unit: string;
  commentary?: string;
}) {
  const delta = predicted == null ? null : actual - predicted;
  return (
    <Card>
      <h3 className="font-semibold">{title}</h3>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Predicted</dt>
          <dd className="font-mono">
            {predicted == null ? "—" : predicted.toFixed(2)} {unit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Actual</dt>
          <dd className="font-mono">
            {actual.toFixed(2)} {unit}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Δ</dt>
          <dd className="font-mono">
            {delta == null ? "—" : `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}`} {unit}
          </dd>
        </div>
      </dl>
      {commentary && (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{commentary}</p>
      )}
    </Card>
  );
}
