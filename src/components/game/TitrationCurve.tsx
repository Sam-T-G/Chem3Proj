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
import { pHAt, titrationCurve } from "@/lib/chemistry/titration";
import { useMemo } from "react";

export function TitrationCurve() {
  const setup = useGameStore((s) => s.setup);
  const volumeAdded = useGameStore((s) => s.volumeAdded_mL);
  const Veq = useGameStore(selectEquivalenceVolume);

  const curve = useMemo(() => titrationCurve(setup, { stepCount: 240 }), [setup]);
  const currentPh = pHAt(volumeAdded, setup);
  const eqPh = pHAt(Veq, setup);

  return (
    <div className="h-64 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <h2 className="mb-2 text-sm font-semibold">Titration curve</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={curve} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="volumeAdded_mL"
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(v) => v.toFixed(0)}
            label={{ value: "NaOH (mL)", position: "insideBottom", offset: -2, fontSize: 11 }}
          />
          <YAxis domain={[0, 14]} label={{ value: "pH", angle: -90, position: "insideLeft", fontSize: 11 }} />
          <Tooltip
            formatter={(value: number) => value.toFixed(2)}
            labelFormatter={(label: number) => `${label.toFixed(2)} mL`}
          />
          <Line type="monotone" dataKey="pH" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          <ReferenceDot x={Veq} y={eqPh} r={5} fill="#ec4899" stroke="#ec4899" />
          <ReferenceDot x={volumeAdded} y={currentPh} r={4} fill="#0f172a" stroke="#fff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
