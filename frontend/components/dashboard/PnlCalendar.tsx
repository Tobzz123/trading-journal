"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DailyPnl, dateKey } from "@/lib/analytics";
import { formatCompactCurrency } from "@/lib/format";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Cell = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
};

function buildGrid(month: Date): Cell[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const startWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const cells: Cell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - startWeekday + 1;
    let date: Date;
    let isCurrentMonth: boolean;

    if (dayOffset < 1) {
      date = new Date(year, monthIndex - 1, daysInPrevMonth + dayOffset);
      isCurrentMonth = false;
    } else if (dayOffset > daysInMonth) {
      date = new Date(year, monthIndex + 1, dayOffset - daysInMonth);
      isCurrentMonth = false;
    } else {
      date = new Date(year, monthIndex, dayOffset);
      isCurrentMonth = true;
    }

    cells.push({ date, key: dateKey(date), isCurrentMonth });
  }
  return cells;
}

function cellToneClasses(pnl: number | undefined, maxAbs: number): string {
  if (pnl === undefined || pnl === 0 || maxAbs === 0) {
    return "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400";
  }

  const ratio = Math.abs(pnl) / maxAbs;
  const step = ratio > 0.66 ? "full" : ratio > 0.33 ? "medium" : "light";

  if (pnl > 0) {
    return {
      light: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      medium: "bg-green-300 dark:bg-green-800/60 text-green-900 dark:text-green-200",
      full: "bg-green-500 dark:bg-green-700 text-white",
    }[step];
  }

  return {
    light: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    medium: "bg-red-300 dark:bg-red-800/60 text-red-900 dark:text-red-200",
    full: "bg-red-500 dark:bg-red-700 text-white",
  }[step];
}

export default function PnlCalendar({
  dailyPnl,
  month,
  onMonthChange,
  selectedDateKey,
  onSelectDay,
}: {
  dailyPnl: Map<string, DailyPnl>;
  month: Date;
  onMonthChange: (date: Date) => void;
  selectedDateKey: string | null;
  onSelectDay: (key: string | null) => void;
}) {
  const cells = buildGrid(month);
  const monthPrefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;

  const maxAbs = Math.max(
    0,
    ...Array.from(dailyPnl.entries())
      .filter(([key]) => key.startsWith(monthPrefix))
      .map(([, v]) => Math.abs(v.pnl))
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMonthChange(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-slate-500 dark:text-slate-500 py-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, key, isCurrentMonth }) => {
          const entry = dailyPnl.get(key);
          const isSelected = selectedDateKey === key;

          if (!isCurrentMonth) {
            return (
              <div
                key={key}
                className="aspect-square rounded-lg p-1.5 text-xs text-slate-300 dark:text-slate-700"
              >
                {date.getDate()}
              </div>
            );
          }

          return (
            <button
              key={key}
              onClick={() => onSelectDay(isSelected ? null : key)}
              className={`aspect-square rounded-lg p-1.5 flex flex-col items-start justify-between text-left transition-all ${cellToneClasses(
                entry?.pnl,
                maxAbs
              )} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              title={
                entry
                  ? `${entry.trades.length} trade${entry.trades.length === 1 ? "" : "s"}, ${formatCompactCurrency(entry.pnl)}`
                  : "No closed trades"
              }
            >
              <span className="text-xs font-medium opacity-80">{date.getDate()}</span>
              {entry && (
                <span className="text-[11px] sm:text-xs font-bold leading-tight">
                  {formatCompactCurrency(entry.pnl)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
