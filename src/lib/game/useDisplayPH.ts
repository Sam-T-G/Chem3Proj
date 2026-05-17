"use client";

import { useEffect, useState } from "react";
import { displayPH } from "@/lib/chemistry/co2-drift";
import { selectCurrentPH, useGameStore } from "./state";

/**
 * Returns {equilibriumPH, displayedPH, secondsSinceMixing}. The display
 * is what the eye / indicator / readout sees; the equilibrium is the
 * "real" chemistry. The two diverge while the solution sits with
 * pH > 7 (CO₂ pickup) and re-converge each time the student adds a
 * drop or swirls.
 */
export function useDisplayPH(): {
  equilibriumPH: number;
  displayedPH: number;
  secondsSinceMixing: number;
} {
  const equilibriumPH = useGameStore(selectCurrentPH);
  const lastMixedAt_ms = useGameStore((s) => s.lastMixedAt_ms);

  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (equilibriumPH <= 7) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [equilibriumPH, lastMixedAt_ms]);

  const secondsSinceMixing = Math.max(0, (now - lastMixedAt_ms) / 1000);
  return {
    equilibriumPH,
    displayedPH: displayPH(equilibriumPH, secondsSinceMixing),
    secondsSinceMixing,
  };
}
