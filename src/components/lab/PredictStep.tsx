"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/game/state";

const INDICATORS = [
  { name: "Phenolphthalein", note: "pH 8.2 – 10.0" },
  { name: "Methyl orange", note: "pH 3.1 – 4.4" },
];

export function PredictStep({ onComplete }: { onComplete: () => void }) {
  const predictions = useGameStore((s) => s.predictions);
  const setPrediction = useGameStore((s) => s.setPrediction);

  const [veq, setVeq] = useState<string>(predictions.expectedVeq_mL?.toString() ?? "");
  const [eqPH, setEqPH] = useState<string>(
    predictions.expectedEquivalencePH?.toString() ?? "",
  );

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
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          25 mL of diluted vinegar (~0.083 M acetic acid) vs. 0.100 M NaOH.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="V at equivalence (mL)">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={veq}
            onChange={(e) => setVeq(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>

        <Field label="pH at equivalence">
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
        <h3 className="mb-2 text-sm font-semibold">Indicator</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {INDICATORS.map((opt) => {
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
          Continue →
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
