import { getTrades } from "@/lib/api";

export default async function TradesPage() {
  const trades = await getTrades();

  return (
    <div>
      <h1>Trades</h1>
      <ul>
        {trades.map((t: any) => (
          <li key={t.id}>
            {t.ticker} – {t.trade_type}
          </li>
        ))}
      </ul>
    </div>
  );
}
