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
  pHAt,
} from "@/lib/chemistry/titration";
import { percentAceticFromMolarity } from "@/lib/chemistry/vinegar";

export function ReportStep({ onRestart }: { onRestart: () => void }) {
  const predictions = useGameStore((s) => s.predictions);
  const standardization = useGameStore((s) => s.standardization);
  const setup = useGameStore((s) => s.setup);
  const endpointVolume_mL = useGameStore((s) => s.endpointVolume_mL);

  const Veq = equivalenceVolume_mL(setup);
  const Veq_pH = pHAt(Veq, setup);

  const workingMolarity = standardization?.measuredNaOHMolarity ?? NOMINAL_NAOH_MOLARITY;
  const measuredPercent =
    endpointVolume_mL == null
      ? null
      : percentAceticFromMolarity(
          concentrationFromEndpoint(endpointVolume_mL, workingMolarity, VINEGAR_SAMPLE_VOLUME_ML) *
            VINEGAR_DILUTION_FACTOR,
        );

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Lab report</h2>
      </header>

      <Card title="Your prediction vs. reality">
        <Row
          label="V at equivalence"
          predicted={predictions.expectedVeq_mL}
          actual={Veq}
          unit="mL"
        />
        <Row
          label="pH at equivalence"
          predicted={predictions.expectedEquivalencePH}
          actual={Veq_pH}
          unit=""
        />
        {Veq_pH > 7.5 && predictions.expectedEquivalencePH != null && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Weak-acid + strong-base titrations end basic (the conjugate base hydrolyzes water).
            Not pH 7.
          </p>
        )}
      </Card>

      <Card title="Your result">
        <dl className="grid grid-cols-2 gap-y-1 text-sm">
          <dt>Indicator</dt>
          <dd className="text-right font-mono">{predictions.chosenIndicatorName ?? "—"}</dd>
          <dt>Endpoint volume</dt>
          <dd className="text-right font-mono">
            {endpointVolume_mL == null ? "—" : `${endpointVolume_mL.toFixed(2)} mL`}
          </dd>
          <dt>Measured % acetic acid</dt>
          <dd className="text-right font-mono">
            {measuredPercent == null ? "—" : `${measuredPercent.toFixed(2)}%`}
          </dd>
          <dt>Actual % (label says 5.00%)</dt>
          <dd className="text-right font-mono">{LAB_TRUTHS.vinegarTruePercent.toFixed(2)}%</dd>
        </dl>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          USDA-legal vinegar is 4–7%. Trust your measurement over the label.
        </p>
      </Card>

      <Card title="Standardization mattered">
        <dl className="grid grid-cols-2 gap-y-1 text-sm">
          <dt>Bottle label</dt>
          <dd className="text-right font-mono">{NOMINAL_NAOH_MOLARITY.toFixed(4)} M</dd>
          <dt>Your standardized value</dt>
          <dd className="text-right font-mono">
            {standardization?.measuredNaOHMolarity.toFixed(4) ?? "—"} M
          </dd>
          <dt>True NaOH</dt>
          <dd className="text-right font-mono">{LAB_TRUTHS.trueNaOHMolarity.toFixed(4)} M</dd>
        </dl>
      </Card>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Restart
        </button>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Row({
  label,
  predicted,
  actual,
  unit,
}: {
  label: string;
  predicted: number | null;
  actual: number;
  unit: string;
}) {
  return (
    <dl className="grid grid-cols-3 gap-x-2 py-0.5 text-sm">
      <dt className="text-slate-600 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-mono text-slate-500">
        {predicted == null ? "—" : predicted.toFixed(2)} {unit}
      </dd>
      <dd className="text-right font-mono">
        {actual.toFixed(2)} {unit}
      </dd>
    </dl>
  );
}
