"use client";

import { useState } from "react";
import {
  NOMINAL_NAOH_MOLARITY,
  VINEGAR_DILUTION_FACTOR,
  VINEGAR_SAMPLE_VOLUME_ML,
  useGameStore,
} from "@/lib/game/state";
import { vinegarMolarity } from "@/lib/chemistry/vinegar";

const INDICATOR_OPTIONS = [
  {
    name: "Phenolphthalein",
    transition: "8.2 – 10.0",
    note: "colorless → pink",
  },
  {
    name: "Methyl orange",
    transition: "3.1 – 4.4",
    note: "red → yellow",
  },
  {
    name: "Bromothymol blue",
    transition: "6.0 – 7.6",
    note: "yellow → blue",
  },
];

export function PredictStep({ onComplete }: { onComplete: () => void }) {
  const predictions = useGameStore((s) => s.predictions);
  const setPrediction = useGameStore((s) => s.setPrediction);

  const [veq, setVeq] = useState<string>(
    predictions.expectedVeq_mL?.toString() ?? "",
  );
  const [eqPH, setEqPH] = useState<string>(
    predictions.expectedEquivalencePH?.toString() ?? "",
  );

  const expectedAnalyteM = vinegarMolarity(5.0) / VINEGAR_DILUTION_FACTOR;
  const ballparkVeq =
    ((expectedAnalyteM * VINEGAR_SAMPLE_VOLUME_ML) / NOMINAL_NAOH_MOLARITY).toFixed(1);

  const canSubmit =
    veq.length > 0 && eqPH.length > 0 && predictions.chosenIndicatorName !== null;

  const submit = () => {
    setPrediction("expectedVeq_mL", parseFloat(veq));
    setPrediction("expectedEquivalencePH", parseFloat(eqPH));
    onComplete();
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-bold">Predict before you titrate</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
          You have a bottle of distilled vinegar labeled <strong>5.0% acetic acid</strong>.
          You diluted <strong>{VINEGAR_SAMPLE_VOLUME_ML} mL</strong> of it by a factor of{" "}
          <strong>{VINEGAR_DILUTION_FACTOR}×</strong> before pipetting it into the flask, and
          you'll titrate it with NaOH labeled <strong>{NOMINAL_NAOH_MOLARITY.toFixed(3)} M</strong>.
          Commit your predictions below — the lab won't tell you the answer until step 4.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Predicted V at equivalence (mL)"
          help={`Hint: n_acid = n_base. The diluted analyte is ~ ${expectedAnalyteM.toFixed(3)} M. Ballpark ≈ ${ballparkVeq} mL.`}
        >
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={veq}
            onChange={(e) => setVeq(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>

        <Field
          label="Predicted pH at equivalence"
          help="Hint: this is a weak acid + strong base titration. Not 7."
        >
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={eqPH}
            onChange={(e) => setEqPH(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Which indicator will you use?</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {INDICATOR_OPTIONS.map((opt) => {
            const selected = predictions.chosenIndicatorName === opt.name;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => setPrediction("chosenIndicatorName", opt.name)}
                className={[
                  "rounded-md border p-3 text-left transition",
                  selected
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40"
                    : "border-slate-300 hover:border-slate-400 dark:border-slate-700",
                ].join(" ")}
              >
                <div className="font-semibold">{opt.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">pH {opt.transition}</div>
                <div className="mt-0.5 text-xs text-slate-500">{opt.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lock in predictions →
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      <span className="mt-1 block text-xs text-slate-500">{help}</span>
    </label>
  );
}
