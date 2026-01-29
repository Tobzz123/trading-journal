"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getTrades, createTrade, updateTrade, deleteTrade } from "@/lib/api";
import { Trade, TradeType } from "../types";
import { TrendingUp, ArrowRight, DollarSign } from "lucide-react";

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
    notes: "",
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

  // Get the 3 newest trades, sorted by newest first
  const newestTrades = useMemo(() => {
    return [...trades]
      .sort((a, b) => {
        // Sort by entry_datetime if available, otherwise by id (assuming higher id = newer)
        const dateA = a.entry_datetime ? new Date(a.entry_datetime).getTime() : a.id;
        const dateB = b.entry_datetime ? new Date(b.entry_datetime).getTime() : b.id;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [trades]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        notes: "",
        expiration_date: "",
        entry_datetime: "",
        exit_datetime: ""
      });
      setTradeType(TradeType.Share);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              LogRhythm
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Log your trades and track your performance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
              {form.id ? "Edit Trade" : "New Trade Entry"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Trade Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Trade Type
                </label>
                <select 
                  value={tradeType} 
                  onChange={handleTradeTypeChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="share">Share</option>
                  <option value="option">Option</option>
                </select>
              </div>

              {/* Ticker */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ticker Symbol
                </label>
                <input 
                  name="ticker" 
                  value={form.ticker} 
                  onChange={handleTextChange}
                  placeholder="e.g., AAPL"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                  required
                />
              </div>

              {/* Share-specific fields */}
              {tradeType === "share" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Shares
                    </label>
                    <input 
                      name="shares" 
                      type="number" 
                      value={form.shares || ""} 
                      onChange={handleNumberChange}
                      placeholder="0"
                      min="0"
                      step="1"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Entry Price ($)
                    </label>
                    <input 
                      name="entry_price" 
                      type="number" 
                      value={form.entry_price || ""} 
                      onChange={handleNumberChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Exit Price ($)
                    </label>
                    <input 
                      name="exit_price" 
                      type="number" 
                      value={form.exit_price || ""} 
                      onChange={handleNumberChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </>
              )}

              {/* Option-specific fields */}
              {tradeType === "option" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contracts
                    </label>
                    <input 
                      name="contracts" 
                      type="number" 
                      value={form.contracts || ""} 
                      onChange={handleNumberChange}
                      placeholder="0"
                      min="0"
                      step="1"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Entry Premium ($)
                    </label>
                    <input 
                      name="entry_premium" 
                      type="number" 
                      value={form.entry_premium || ""} 
                      onChange={handleNumberChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Exit Premium ($)
                    </label>
                    <input 
                      name="exit_premium" 
                      type="number" 
                      value={form.exit_premium || ""} 
                      onChange={handleNumberChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Strike Price ($)
                    </label>
                    <input 
                      name="strike_price" 
                      type="number" 
                      value={form.strike_price || ""} 
                      onChange={handleNumberChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Expiration Date
                    </label>
                    <input 
                      name="expiration_date" 
                      type="date" 
                      value={form.expiration_date || ""} 
                      onChange={handleTextChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Option Type
                    </label>
                    <select 
                      name="option_type" 
                      value={form.option_type} 
                      onChange={handleTextChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="call">Call</option>
                      <option value="put">Put</option>
                    </select>
                  </div>
                </>
              )}

              {/* Common fields */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Entry Datetime
                </label>
                <input 
                  name="entry_datetime" 
                  type="datetime-local" 
                  value={form.entry_datetime || ""} 
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Exit Datetime
                </label>
                <input 
                  name="exit_datetime" 
                  type="datetime-local" 
                  value={form.exit_datetime || ""} 
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes
                </label>
                <textarea 
                  name="notes" 
                  value={form.notes || ""} 
                  onChange={handleTextChange}
                  placeholder="Add any notes about this trade..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {form.id ? "Save Changes" : "Add Trade"}
              </button>
            </form>
          </div>

          {/* Recent Trades Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
                Recent Trades
              </h2>
              
              {newestTrades.length > 0 ? (
                <div className="space-y-4">
                  {newestTrades.map((trade) => (
                    <div 
                      key={trade.id}
                      className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white rounded-lg px-3 py-1.5 font-bold text-lg">
                            {trade.ticker}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              ${trade.entry_price ? Number(trade.entry_price).toFixed(2) : "0.00"}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full capitalize">
                          {trade.trade_type}
                        </span>
                      </div>
                      
                      {trade.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                          {trade.notes}
                        </p>
                      )}
                      
                      {trade.entry_datetime && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          {new Date(trade.entry_datetime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No trades yet. Start logging your trades above!</p>
                </div>
              )}

              {trades.length > 3 && (
                <Link 
                  href="/trades/all"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  View All Trades
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}