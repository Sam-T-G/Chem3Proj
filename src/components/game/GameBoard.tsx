"use client";

import { Burette } from "./Burette";
import { Beaker } from "./Beaker";
import { TitrationCurve } from "./TitrationCurve";
import { ControlPanel } from "./ControlPanel";
import { HintPanel } from "./HintPanel";
import { ResultsPanel } from "./ResultsPanel";

export function GameBoard() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="flex items-end justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <Burette />
          <Beaker />
        </div>
        <TitrationCurve />
        <ControlPanel />
        <ResultsPanel />
      </div>
      <aside>
        <HintPanel />
      </aside>
    </div>
  );
}
