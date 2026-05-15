"use client";

export type LabStepId = "predict" | "standardize" | "titrate" | "report";

export const LAB_STEPS: { id: LabStepId; label: string }[] = [
  { id: "predict", label: "1. Predict" },
  { id: "standardize", label: "2. Standardize" },
  { id: "titrate", label: "3. Titrate vinegar" },
  { id: "report", label: "4. Report" },
];

export function LabStepper({
  current,
  completed,
  onSelect,
}: {
  current: LabStepId;
  completed: Set<LabStepId>;
  onSelect: (step: LabStepId) => void;
}) {
  return (
    <ol className="mb-6 flex flex-wrap gap-2 text-sm">
      {LAB_STEPS.map((step) => {
        const isCurrent = step.id === current;
        const isDone = completed.has(step.id);
        const reachable = isCurrent || isDone || canReach(step.id, completed);
        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onSelect(step.id)}
              className={[
                "rounded-md border px-3 py-1.5 transition",
                isCurrent
                  ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : isDone
                    ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : "border-slate-300 text-slate-500 dark:border-slate-700",
                !reachable && "cursor-not-allowed opacity-60",
              ].join(" ")}
            >
              {step.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function canReach(step: LabStepId, completed: Set<LabStepId>): boolean {
  const idx = LAB_STEPS.findIndex((s) => s.id === step);
  return LAB_STEPS.slice(0, idx).every((s) => completed.has(s.id));
}
