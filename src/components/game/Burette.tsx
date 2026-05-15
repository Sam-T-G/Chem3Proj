"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/game/state";

const BURETTE_MAX_ML = 50;

export function Burette() {
  const volumeAdded = useGameStore((s) => s.volumeAdded_mL);
  const isDripping = useGameStore((s) => s.isDripping);

  const fillFraction = Math.max(0, 1 - volumeAdded / BURETTE_MAX_ML);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-slate-500">NaOH (0.1 M)</div>
      <svg viewBox="0 0 60 240" className="h-64 w-16" aria-label="Burette">
        <rect
          x="22"
          y="10"
          width="16"
          height="200"
          rx="2"
          className="fill-white stroke-slate-400 dark:fill-slate-800"
          strokeWidth="1.5"
        />
        <rect
          x="22"
          y={10 + 200 * (1 - fillFraction)}
          width="16"
          height={200 * fillFraction}
          className="fill-sky-300/70"
        />
        <line x1="30" y1="210" x2="30" y2="225" className="stroke-slate-400" strokeWidth="1.5" />
        {isDripping && (
          <motion.circle
            cx="30"
            cy="225"
            r="2.5"
            className="fill-sky-400"
            initial={{ cy: 225, opacity: 1 }}
            animate={{ cy: 240, opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeIn" }}
          />
        )}
      </svg>
      <div className="mt-1 font-mono text-xs">{volumeAdded.toFixed(2)} mL added</div>
    </div>
  );
}
