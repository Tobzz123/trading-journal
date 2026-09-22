"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { getTrades } from "@/lib/api";
import { Trade } from "../types";
import NavBar from "@/components/NavBar";
import StatCard from "@/components/dashboard/StatCard";
import EquityCurveChart from "@/components/dashboard/EquityCurveChart";
import PnlCalendar from "@/components/dashboard/PnlCalendar";
import {
  computeDashboardStats,
  computeEquityCurve,
  computeDailyPnl,
  getOpenTrades,
  getTradePnl,
} from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  LayoutDashboard,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  Target,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const hasSetDefaultMonth = useRef(false);

  useEffect(() => {
    async function fetchTrades() {
      try {
        const data = await getTrades();
        setTrades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrades();
  }, []);

  const stats = useMemo(() => computeDashboardStats(trades), [trades]);
  const equityPoints = useMemo(() => computeEquityCurve(trades), [trades]);
  const dailyPnl = useMemo(() => computeDailyPnl(trades), [trades]);
  const openTrades = useMemo(() => getOpenTrades(trades), [trades]);

  // Default the calendar to the month of the most recent closed trade, falling back to
  // the most recent open trade's entry, falling back to the current month. Only run once
  // after the first successful load so the user's own month navigation isn't overridden.
  useEffect(() => {
    if (hasSetDefaultMonth.current || isLoading) return;
    hasSetDefaultMonth.current = true;

    if (equityPoints.length > 0) {
      setMonth(equityPoints[equityPoints.length - 1].date);
      return;
    }

    const mostRecentEntry = openTrades.reduce<Date | null>((latest, t) => {
      const d = t.entry_datetime ? new Date(t.entry_datetime) : null;
      if (!d) return latest;
      return !latest || d > latest ? d : latest;
    }, null);

    if (mostRecentEntry) setMonth(mostRecentEntry);
  }, [isLoading, equityPoints, openTrades]);

  const selectedDay = selectedDateKey ? dailyPnl.get(selectedDateKey) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <NavBar />
      <div className="container mx-auto px-4 pb-12 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {stats.totalTrades} {stats.totalTrades === 1 ? "trade" : "trades"} total
          </div>
        </div>

        {stats.totalTrades === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 border border-slate-200 dark:border-slate-700 text-center">
            <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No trades yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Log your first trade to start seeing your P&amp;L here
            </p>
            <Link
              href="/trades"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Log Your First Trade
            </Link>
          </div>
        ) : (
          <>
            {/* Stat tiles */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <StatCard
                label="Realized P&L"
                value={formatCurrency(stats.totalRealizedPnl, { showSign: true })}
                tone={stats.totalRealizedPnl > 0 ? "positive" : stats.totalRealizedPnl < 0 ? "negative" : "neutral"}
                icon={DollarSign}
              />
              <StatCard
                label="Win Rate"
                value={stats.winRate !== null ? formatPercent(stats.winRate) : "N/A"}
                icon={Percent}
              />
              <StatCard
                label="Avg Win"
                value={stats.avgWin !== null ? formatCurrency(stats.avgWin) : "N/A"}
                tone={stats.avgWin !== null ? "positive" : "neutral"}
                icon={TrendingUp}
              />
              <StatCard
                label="Avg Loss"
                value={stats.avgLoss !== null ? formatCurrency(stats.avgLoss) : "N/A"}
                tone={stats.avgLoss !== null ? "negative" : "neutral"}
                icon={TrendingDown}
              />
              <StatCard
                label="Profit Factor"
                value={
                  stats.profitFactor === null
                    ? "N/A"
                    : stats.profitFactor === Infinity
                    ? "∞"
                    : stats.profitFactor.toFixed(2)
                }
                icon={Target}
              />
              <StatCard label="Open Positions" value={String(stats.openCount)} icon={Layers} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Equity curve */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Equity Curve
                </h3>
                <EquityCurveChart points={equityPoints} />
              </div>

              {/* Open positions */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Open Positions
                </h3>
                {openTrades.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-500">No open positions.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {openTrades.map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {trade.ticker}
                          </span>
                          <span className="text-slate-500 dark:text-slate-500 ml-2 capitalize">
                            {trade.trade_type}
                          </span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">
                          {trade.entry_datetime
                            ? new Date(trade.entry_datetime).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PnlCalendar
                  dailyPnl={dailyPnl}
                  month={month}
                  onMonthChange={(m) => {
                    setMonth(m);
                    setSelectedDateKey(null);
                  }}
                  selectedDateKey={selectedDateKey}
                  onSelectDay={setSelectedDateKey}
                />
                <Link
                  href="/trades/all"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-3"
                >
                  View as a list <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  {selectedDateKey
                    ? new Date(selectedDateKey + "T00:00:00").toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select a day"}
                </h3>
                {!selectedDateKey ? (
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Click a day on the calendar to see its trades.
                  </p>
                ) : !selectedDay ? (
                  <p className="text-sm text-slate-500 dark:text-slate-500">No closed trades on this day.</p>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`text-lg font-bold ${
                        selectedDay.pnl > 0
                          ? "text-green-600 dark:text-green-400"
                          : selectedDay.pnl < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {formatCurrency(selectedDay.pnl, { showSign: true })}
                    </div>
                    {selectedDay.trades.map((trade) => {
                      const pnl = getTradePnl(trade) ?? 0;
                      return (
                        <div
                          key={trade.id}
                          className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {trade.ticker}
                            </span>
                            <span className="text-slate-500 dark:text-slate-500 ml-2 capitalize">
                              {trade.trade_type}
                            </span>
                          </div>
                          <span
                            className={
                              pnl > 0
                                ? "text-green-600 dark:text-green-400"
                                : pnl < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-600 dark:text-slate-400"
                            }
                          >
                            {formatCurrency(pnl, { showSign: true })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
