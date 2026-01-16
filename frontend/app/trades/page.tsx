"use client";

import { useState, useEffect } from "react";
import { getTrades, createTrade } from "@/lib/api";
import { Trade, TradeType } from "../types";

export default function TradesPage() {
  //a Trades array to store the trades
  const [trades, setTrades] = useState<Trade[]>([]);
  //a tradeType state to store the type of trade
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.Share);
  //A form state to store the form data
  const [form, setForm] = useState<Trade>({
    id: 0,
    ticker: "",
    trade_type: TradeType.Share,
    option_type: "call",
    shares: 0,
    contracts: 0,
    entry_price: 0.00,
    exit_price: 0.00,
    entry_premium: 0.00,
    exit_premium: 0.00,
    strike_price: 0,
    expiration_date: "",
    entry_datetime: "",
    exit_datetime: ""
  });

  useEffect(() => {
    async function fetchTrades() {
      const data = await getTrades();
      setTrades(data);
    }
    fetchTrades();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTradeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTradeType(e.target.value as TradeType.Share | TradeType.Option);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTrade = await createTrade({ ...form, trade_type: tradeType });
      setTrades([...trades, newTrade]);
      setForm({
        id: 0,
        ticker: "",
        option_type: "call",
        shares: 0,
        contracts: 0,
        entry_price: 0.00,
        exit_price: 0.00,
        entry_premium: 0.00,
        exit_premium: 0.00,
        strike_price: 0,
        expiration_date: "",
        entry_datetime: "",
        exit_datetime: ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Trades</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Trade Type:
          <select value={tradeType} onChange={handleTradeTypeChange}>
            <option value="share">Share</option>
            <option value="option">Option</option>
          </select>
        </label>

        <label>
          Ticker:
          <input name="ticker" value={form.ticker} onChange={handleChange} />
        </label>

        {tradeType === "share" && (
          <>
            <label>
              Shares:
              <input name="shares" type="number" value={form.shares} onChange={handleChange} />
            </label>
            <label>
              Entry Price:
              <input name="entry_price" type="number" value={form.entry_price} onChange={handleChange} />
            </label>
            <label>
              Exit Price:
              <input name="exit_price" type="number" value={form.exit_price} onChange={handleChange} />
            </label>
            <label>
              Notes:
              <input name="notes" type="text" value={form.notes} onChange={handleChange} />
            </label>
          </>
        )}

        {tradeType === "option" && (
          <>
            <label>
              Contracts:
              <input name="contracts" type="number" value={form.contracts} onChange={handleChange} />
            </label>
            <label>
              Entry Premium:
              <input name="entry_premium" type="number" value={form.entry_premium} onChange={handleChange} />
            </label>
            <label>
              Exit Premium:
              <input name="exit_premium" type="number" value={form.exit_premium} onChange={handleChange} />
            </label>
            <label>
              Strike Price:
              <input name="strike_price" type="number" value={form.strike_price} onChange={handleChange} />
            </label>
            <label>
              Expiration Date:
              <input name="expiration_date" type="date" value={form.expiration_date} onChange={handleChange} />
            </label>
            <label>
              Option Type:
              <select name="option_type" value={form.option_type} onChange={handleChange}>
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </label>
            <label>
              Notes:
              <input name="notes" type="text" value={form.notes} onChange={handleChange} />
            </label>
          </>
        )}

        <label>
          Entry Datetime:
          <input name="entry_datetime" type="datetime-local" value={form.entry_datetime} onChange={handleChange} />
        </label>
        <label>
          Exit Datetime:
          <input name="exit_datetime" type="datetime-local" value={form.exit_datetime} onChange={handleChange} />
        </label>
        
        <button type="submit">Add Trade</button>
      </form>

      <ul>
        {trades.map((t) => (
          <li key={t.id}>
            {t.ticker} – {t.trade_type} – {t.trade_type === "share" ? `${t.shares} shares` : `${t.contracts} contracts`}
          </li>
        ))}
      </ul>
    </div>
  );
}