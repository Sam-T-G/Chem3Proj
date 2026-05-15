"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/game/state";

const DROP_VOLUME_ML = 0.05;
const STREAM_VOLUME_ML = 0.5;

export function ControlPanel() {
  const addDrop = useGameStore((s) => s.addDrop);
  const setDripping = useGameStore((s) => s.setDripping);
  const markEndpoint = useGameStore((s) => s.markEndpoint);
  const reset = useGameStore((s) => s.reset);

  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (streamTimer.current) clearInterval(streamTimer.current);
    };
  }, []);

  const startStream = () => {
    setDripping(true);
    if (streamTimer.current) return;
    streamTimer.current = setInterval(() => addDrop(STREAM_VOLUME_ML), 200);
  };

  const stopStream = () => {
    setDripping(false);
    if (streamTimer.current) {
      clearInterval(streamTimer.current);
      streamTimer.current = null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <button
        type="button"
        onClick={() => addDrop(DROP_VOLUME_ML)}
        className="rounded-md bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700"
      >
        Drop (0.05 mL)
      </button>
      <button
        type="button"
        onMouseDown={startStream}
        onMouseUp={stopStream}
        onMouseLeave={stopStream}
        onTouchStart={startStream}
        onTouchEnd={stopStream}
        className="rounded-md bg-sky-500 px-3 py-1.5 text-sm text-white hover:bg-sky-600"
      >
        Hold to stream
      </button>
      <button
        type="button"
        onClick={markEndpoint}
        className="rounded-md bg-pink-600 px-3 py-1.5 text-sm text-white hover:bg-pink-700"
      >
        Mark endpoint
      </button>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Reset
      </button>
    </div>
  );
}
