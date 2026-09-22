import { Trade } from "@/app/types";

// Decimal columns (entry_price, exit_price, entry_premium, exit_premium, strike_price)
// come back from the Rails API as JSON strings, not numbers, even though `Trade` types
// them as `number`. Always coerce before doing math.
function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

// `exit_price`/`exit_premium` are required at the model level for every share/option
// trade (not just closed ones) — the log-trade form always submits 0.00 as a placeholder
// when a position hasn't been exited yet, since the backend rejects a blank value. So a
// real "open" trade is stored with an exit value of 0, not null; treat both as open.
export function isTradeOpen(trade: Trade): boolean {
  if (trade.trade_type === "option") {
    return (
      trade.exit_premium === null ||
      trade.exit_premium === undefined ||
      toNumber(trade.exit_premium) === 0
    );
  }
  return (
    trade.exit_price === null || trade.exit_price === undefined || toNumber(trade.exit_price) === 0
  );
}

export function getTradePnl(trade: Trade): number | null {
  if (isTradeOpen(trade)) return null;

  if (trade.trade_type === "option") {
    return (
      (toNumber(trade.exit_premium) - toNumber(trade.entry_premium)) *
      toNumber(trade.contracts) *
      100
    );
  }

  return (toNumber(trade.exit_price) - toNumber(trade.entry_price)) * toNumber(trade.shares);
}

// The `exit_datetime` model validation only fires off `exit_price`, so a closed option
// trade (closed via `exit_premium`) can legally have a null `exit_datetime`. Fall back to
// `entry_datetime`, which is unconditionally required, so every trade has a usable date.
export function getRealizedDate(trade: Trade): Date | null {
  if (isTradeOpen(trade)) return null;
  const raw = trade.exit_datetime ?? trade.entry_datetime;
  return raw ? new Date(raw) : null;
}

// Local Y-M-D, not UTC — Rails serializes datetimes in UTC, and bucketing by UTC day
// would misattribute evening trades (US business hours) to the next calendar day.
export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type DashboardStats = {
  totalTrades: number;
  openCount: number;
  closedCount: number;
  totalRealizedPnl: number;
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  winRate: number | null;
  avgWin: number | null;
  avgLoss: number | null;
  profitFactor: number | null;
};

export function computeDashboardStats(trades: Trade[]): DashboardStats {
  const closedPnls = trades
    .filter((t) => !isTradeOpen(t))
    .map((t) => getTradePnl(t) as number);

  const wins = closedPnls.filter((pnl) => pnl > 0);
  const losses = closedPnls.filter((pnl) => pnl < 0);
  const breakevenCount = closedPnls.filter((pnl) => pnl === 0).length;

  const totalRealizedPnl = closedPnls.reduce((sum, pnl) => sum + pnl, 0);
  const winSum = wins.reduce((sum, pnl) => sum + pnl, 0);
  const lossSum = losses.reduce((sum, pnl) => sum + pnl, 0);

  const closedCount = closedPnls.length;

  return {
    totalTrades: trades.length,
    openCount: trades.filter(isTradeOpen).length,
    closedCount,
    totalRealizedPnl,
    winCount: wins.length,
    lossCount: losses.length,
    breakevenCount,
    winRate: closedCount > 0 ? wins.length / closedCount : null,
    avgWin: wins.length > 0 ? winSum / wins.length : null,
    avgLoss: losses.length > 0 ? lossSum / losses.length : null,
    profitFactor:
      closedCount === 0
        ? null
        : lossSum === 0
        ? wins.length > 0
          ? Infinity
          : null
        : winSum / Math.abs(lossSum),
  };
}

export type EquityPoint = {
  date: Date;
  trade: Trade;
  pnl: number;
  cumulativePnl: number;
};

export function computeEquityCurve(trades: Trade[]): EquityPoint[] {
  const closed = trades
    .filter((t) => !isTradeOpen(t))
    .map((t) => ({ trade: t, date: getRealizedDate(t) as Date, pnl: getTradePnl(t) as number }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let running = 0;
  return closed.map(({ trade, date, pnl }) => {
    running += pnl;
    return { date, trade, pnl, cumulativePnl: running };
  });
}

export type DailyPnl = {
  dateKey: string;
  pnl: number;
  trades: Trade[];
};

export function computeDailyPnl(trades: Trade[]): Map<string, DailyPnl> {
  const map = new Map<string, DailyPnl>();

  for (const trade of trades) {
    if (isTradeOpen(trade)) continue;
    const date = getRealizedDate(trade);
    if (!date) continue;

    const key = dateKey(date);
    const pnl = getTradePnl(trade) as number;
    const existing = map.get(key);

    if (existing) {
      existing.pnl += pnl;
      existing.trades.push(trade);
    } else {
      map.set(key, { dateKey: key, pnl, trades: [trade] });
    }
  }

  return map;
}

export function getOpenTrades(trades: Trade[]): Trade[] {
  return trades.filter(isTradeOpen);
}
