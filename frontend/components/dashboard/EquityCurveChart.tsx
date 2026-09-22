"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EquityPoint } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { TrendingUp } from "lucide-react";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { fullDateLabel: string; pnl: number; cumulativePnl: number; ticker: string } }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg px-3 py-2 text-sm">
      <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">{point.fullDateLabel}</div>
      <div className="text-slate-700 dark:text-slate-300">
        {point.ticker}:{" "}
        <span className={point.pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
          {formatCurrency(point.pnl, { showSign: true })}
        </span>
      </div>
      <div className="font-bold text-slate-900 dark:text-slate-100">
        Total: {formatCurrency(point.cumulativePnl, { showSign: true })}
      </div>
    </div>
  );
}

export default function EquityCurveChart({ points }: { points: EquityPoint[] }) {
  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-slate-400 dark:text-slate-600">
        <TrendingUp className="w-10 h-10 mb-2 opacity-50" />
        <p className="text-sm">No closed trades yet — your equity curve will appear here.</p>
      </div>
    );
  }

  const data = points.map((p, i) => ({
    index: i,
    fullDateLabel: p.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    label: p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: p.cumulativePnl,
    pnl: p.pnl,
    cumulativePnl: p.cumulativePnl,
    ticker: p.trade.ticker,
  }));

  const values = data.map((d) => d.value);
  const dataMax = Math.max(...values, 0);
  const dataMin = Math.min(...values, 0);

  // Split the area fill at the zero baseline: green above $0, red below.
  // Standard Recharts "fill by value" pattern — a single gradient whose
  // color-stop offset is where the series crosses zero.
  let gradientOffset = 0.5;
  if (dataMax <= 0) gradientOffset = 0;
  else if (dataMin >= 0) gradientOffset = 1;
  else gradientOffset = dataMax / (dataMax - dataMin);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="equitySplitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset} stopColor="#16a34a" stopOpacity={0.35} />
              <stop offset={gradientOffset} stopColor="#dc2626" stopOpacity={0.35} />
            </linearGradient>
            <linearGradient id="equitySplitStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset} stopColor="#16a34a" />
              <stop offset={gradientOffset} stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            className="fill-slate-500 dark:fill-slate-400"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-slate-500 dark:fill-slate-400"
            tickFormatter={(v: number) => formatCurrency(v)}
            width={80}
          />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#equitySplitStroke)"
            strokeWidth={2}
            fill="url(#equitySplitColor)"
            dot={data.length === 1}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
