"use client";

import React, { useState, useEffect } from "react";
import { getTrades, createTrade, updateTrade, deleteTrade } from "@/lib/api";
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
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };
  

  const handleTradeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTradeType(e.target.value as TradeType.Share | TradeType.Option);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedTrade: Trade;
      if (form.id) {
        savedTrade = await updateTrade(form.id, { ...form, trade_type: tradeType });
        setTrades(trades.map(t => (t.id === form.id ? savedTrade : t)));
      } else {
        savedTrade = await createTrade({ ...form, trade_type: tradeType });
        setTrades([...trades, savedTrade]);
      }

      setForm({
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (trade: Trade) => {
    setForm(trade);
    setTradeType(trade.trade_type ?? TradeType.Share)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTrade(id);
      setTrades(trades.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

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
          <input name="ticker" value={form.ticker} onChange={handleTextChange} />
        </label>

        {tradeType === "share" && (
          <>
            <label>
              Shares:
              <input name="shares" type="number" value={form.shares} onChange={handleNumberChange} />
            </label>
            <label>
              Entry Price:
              <input name="entry_price" type="number" value={form.entry_price} onChange={handleNumberChange} />
            </label>
            <label>
              Exit Price:
              <input name="exit_price" type="number" value={form.exit_price} onChange={handleNumberChange} />
            </label>
            <label>
              Notes:
              <input name="notes" type="text" value={form.notes} onChange={handleTextChange} />
            </label>
          </>
        )}

        {tradeType === "option" && (
          <>
            <label>
              Contracts:
              <input name="contracts" type="number" value={form.contracts} onChange={handleNumberChange} />
            </label>
            <label>
              Entry Premium:
              <input name="entry_premium" type="number" value={form.entry_premium} onChange={handleNumberChange} />
            </label>
            <label>
              Exit Premium:
              <input name="exit_premium" type="number" value={form.exit_premium} onChange={handleNumberChange} />
            </label>
            <label>
              Strike Price:
              <input name="strike_price" type="number" value={form.strike_price} onChange={handleNumberChange} />
            </label>
            <label>
              Expiration Date:
              <input name="expiration_date" type="date" value={form.expiration_date} onChange={handleTextChange} />
            </label>
            <label>
              Option Type:
              <select name="option_type" value={form.option_type} onChange={handleTextChange}>
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </label>
            <label>
              Notes:
              <input name="notes" type="text" value={form.notes} onChange={handleTextChange} />
            </label>
          </>
        )}

        <label>
          Entry Datetime:
          <input name="entry_datetime" type="datetime-local" value={form.entry_datetime} onChange={handleTextChange} />
        </label>
        <label>
          Exit Datetime:
          <input name="exit_datetime" type="datetime-local" value={form.exit_datetime} onChange={handleTextChange} />
        </label>

        <button type="submit">{form.id ? "Save Changes" : "Add Trade"}</button>
      </form>

      <ul>
        {trades.map((t) => (
          <li key={t.id}>
            {t.ticker} – {t.trade_type} – {t.trade_type === "share" ? `${t.shares} shares` : `${t.contracts} contracts`}
          </li>
        ))}
      </ul>

      {trades.map(trade => (
        <div key={trade.id}>
          <span>{trade.ticker}</span>
          <button onClick={() => handleEdit(trade)}>Edit</button>
          <button onClick={() => handleDelete(trade.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}