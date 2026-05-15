"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { selectEquivalenceVolume, useGameStore } from "@/lib/game/state";
import { indicatorEndpointVolume, pHAt, titrationCurve } from "@/lib/chemistry/titration";
import { useMemo } from "react";

export function TitrationCurve() {
  const setup = useGameStore((s) => s.setup);
  const indicator = useGameStore((s) => s.indicator);
  const volumeAdded = useGameStore((s) => s.volumeAdded_mL);
  const Veq = useGameStore(selectEquivalenceVolume);

  const curve = useMemo(() => titrationCurve(setup, { stepCount: 240 }), [setup]);
  const V_indicator = useMemo(
    () => indicatorEndpointVolume(setup, indicator),
    [setup, indicator],
  );

  const currentPh = pHAt(volumeAdded, setup);
  const eqPh = pHAt(Veq, setup);
  const indicatorPh = pHAt(V_indicator, setup);

  return (
    <div className="h-72 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Titration curve</h2>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-pink-500" />
            equivalence
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            indicator endpoint
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={curve} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="volumeAdded_mL"
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(v) => v.toFixed(0)}
            label={{ value: "NaOH (mL)", position: "insideBottom", offset: -2, fontSize: 11 }}
          />
          <YAxis
            domain={[0, 14]}
            label={{ value: "pH", angle: -90, position: "insideLeft", fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => value.toFixed(2)}
            labelFormatter={(label: number) => `${label.toFixed(2)} mL`}
          />
          <Line type="monotone" dataKey="pH" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          <ReferenceDot x={Veq} y={eqPh} r={5} fill="#ec4899" stroke="#ec4899" />
          <ReferenceDot x={V_indicator} y={indicatorPh} r={4} fill="#f59e0b" stroke="#f59e0b" />
          <ReferenceDot x={volumeAdded} y={currentPh} r={4} fill="#0f172a" stroke="#fff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
