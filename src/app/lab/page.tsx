"use client";

import { useState } from "react";
import { LabStepper, type LabStepId } from "@/components/lab/LabStepper";
import { PredictStep } from "@/components/lab/PredictStep";
import { StandardizeStep } from "@/components/lab/StandardizeStep";
import { TitrateStep } from "@/components/lab/TitrateStep";
import { ReportStep } from "@/components/lab/ReportStep";
import { useGameStore } from "@/lib/game/state";

export default function LabPage() {
  const [step, setStep] = useState<LabStepId>("predict");
  const [completed, setCompleted] = useState<Set<LabStepId>>(new Set());
  const reset = useGameStore((s) => s.reset);

  const complete = (id: LabStepId, next: LabStepId | null) => {
    setCompleted((prev) => new Set(prev).add(id));
    if (next) setStep(next);
  };

  const restart = () => {
    setCompleted(new Set());
    setStep("predict");
    reset();
  };

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Guided lab — vinegar titration</h1>
      <p className="mb-6 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
        Predict the outcome, standardize your NaOH, titrate the vinegar with realistic CO₂
        fade-back near the endpoint, and confront your predictions in the final report.
      </p>

      <LabStepper current={step} completed={completed} onSelect={setStep} />

      {step === "predict" && <PredictStep onComplete={() => complete("predict", "standardize")} />}
      {step === "standardize" && (
        <StandardizeStep onComplete={() => complete("standardize", "titrate")} />
      )}
      {step === "titrate" && <TitrateStep onComplete={() => complete("titrate", "report")} />}
      {step === "report" && <ReportStep onRestart={restart} />}
    </section>
  );
}
