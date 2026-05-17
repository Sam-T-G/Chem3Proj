"use client";

import { Beaker } from "@/components/game/Beaker";
import { Burette } from "@/components/game/Burette";
import { ControlPanel } from "@/components/game/ControlPanel";
import { HintPanel } from "@/components/game/HintPanel";
import { TitrationCurve } from "@/components/game/TitrationCurve";

/**
 * Shared interactive titration layout for the standardization and vinegar
 * steps. The store is configured by the parent step before mounting.
 */
export function TitrationStation() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="flex items-end justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <Burette />
          <Beaker />
        </div>
        <TitrationCurve />
        <ControlPanel />
      </div>
      <aside>
        <HintPanel />
      </aside>
    </div>
  );
}
