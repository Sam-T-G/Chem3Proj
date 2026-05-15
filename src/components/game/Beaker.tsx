"use client";

import { motion } from "framer-motion";
import { selectCurrentPH, useGameStore } from "@/lib/game/state";
import { indicatorColor } from "@/lib/chemistry/indicators";

export function Beaker() {
  const indicator = useGameStore((s) => s.indicator);
  const pH = useGameStore(selectCurrentPH);

  const color = indicatorColor(pH, indicator);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-slate-500">Vinegar + phenolphthalein</div>
      <svg viewBox="0 0 160 160" className="h-40 w-40" aria-label="Erlenmeyer flask">
        <path
          d="M65 20 L65 70 L25 140 Q25 150 35 150 L125 150 Q135 150 135 140 L95 70 L95 20 Z"
          className="fill-white stroke-slate-400 dark:fill-slate-800"
          strokeWidth="2"
        />
        <motion.path
          d="M50 105 L25 140 Q25 150 35 150 L125 150 Q135 150 135 140 L110 105 Z"
          animate={{ fill: color }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      <div className="mt-1 font-mono text-xs">pH = {pH.toFixed(2)}</div>
    </div>
  );
}
