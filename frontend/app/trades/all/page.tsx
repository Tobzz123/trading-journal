"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getTrades, deleteTrade, updateTrade } from "@/lib/api";
import { Trade, TradeType } from "../../types";
import { TrendingUp, ArrowLeft, DollarSign, Edit, Trash2, Calendar, Save, X } from "lucide-react";

export default function AllTradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Trade | null>(null);

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

  // Sort trades by newest first
  const sortedTrades = useMemo(() => {
    return [...trades].sort((a, b) => {
      const dateA = a.entry_datetime ? new Date(a.entry_datetime).getTime() : a.id;
      const dateB = b.entry_datetime ? new Date(b.entry_datetime).getTime() : b.id;
      return dateB - dateA;
    });
  }, [trades]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this trade?")) {
      try {
        await deleteTrade(id);
        setTrades(trades.filter(t => t.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingId(trade.id);
    setEditForm({ ...trade });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editForm) {
      setEditForm(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleEditNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editForm) {
      setEditForm(prev => prev ? { ...prev, [name]: Number(value) } : null);
    }
  };

  const formatDateTimeLocal = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editingId) return;

    try {
      const updatedTrade = await updateTrade(editingId, editForm);
      setTrades(trades.map(t => (t.id === editingId ? updatedTrade : t)));
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading trades...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/trades"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trade Entry
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                All Trades
              </h1>
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {trades.length} {trades.length === 1 ? 'trade' : 'trades'} total
            </div>
          </div>
        </div>

        {/* Trades List */}
        {sortedTrades.length > 0 ? (
          <div className="grid gap-4">
            {sortedTrades.map((trade) => (
              <div 
                key={trade.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                {editingId === trade.id && editForm ? (
                  // Edit Mode
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Trade</h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Save"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Ticker
                        </label>
                        <input
                          name="ticker"
                          value={editForm.ticker || ""}
                          onChange={handleEditTextChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Trade Type
                        </label>
                        <select
                          name="trade_type"
                          value={editForm.trade_type || "share"}
                          onChange={handleEditTextChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="share">Share</option>
                          <option value="option">Option</option>
                        </select>
                      </div>

                      {editForm.trade_type === "share" ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Shares
                            </label>
                            <input
                              name="shares"
                              type="number"
                              value={editForm.shares || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Entry Price ($)
                            </label>
                            <input
                              name="entry_price"
                              type="number"
                              step="0.01"
                              value={editForm.entry_price || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Exit Price ($)
                            </label>
                            <input
                              name="exit_price"
                              type="number"
                              step="0.01"
                              value={editForm.exit_price || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Contracts
                            </label>
                            <input
                              name="contracts"
                              type="number"
                              value={editForm.contracts || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Entry Premium ($)
                            </label>
                            <input
                              name="entry_premium"
                              type="number"
                              step="0.01"
                              value={editForm.entry_premium || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Exit Premium ($)
                            </label>
                            <input
                              name="exit_premium"
                              type="number"
                              step="0.01"
                              value={editForm.exit_premium || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Strike Price ($)
                            </label>
                            <input
                              name="strike_price"
                              type="number"
                              step="0.01"
                              value={editForm.strike_price || ""}
                              onChange={handleEditNumberChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Option Type
                            </label>
                            <select
                              name="option_type"
                              value={editForm.option_type || "call"}
                              onChange={handleEditTextChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="call">Call</option>
                              <option value="put">Put</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Expiration Date
                            </label>
                            <input
                              name="expiration_date"
                              type="date"
                              value={editForm.expiration_date || ""}
                              onChange={handleEditTextChange}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Entry Datetime
                        </label>
                        <input
                          name="entry_datetime"
                          type="datetime-local"
                          value={formatDateTimeLocal(editForm.entry_datetime)}
                          onChange={handleEditTextChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Exit Datetime
                        </label>
                        <input
                          name="exit_datetime"
                          type="datetime-local"
                          value={formatDateTimeLocal(editForm.exit_datetime)}
                          onChange={handleEditTextChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Notes
                        </label>
                        <textarea
                          name="notes"
                          value={editForm.notes || ""}
                          onChange={handleEditTextChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2 font-bold text-xl shadow-md">
                          {trade.ticker}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              ${trade.entry_price ? Number(trade.entry_price).toFixed(2) : "0.00"}
                            </span>
                            {trade.exit_price && (
                              <>
                                <span className="text-slate-400">→</span>
                                <span className="text-xl font-semibold text-slate-600 dark:text-slate-400">
                                  ${Number(trade.exit_price).toFixed(2)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full capitalize">
                              {trade.trade_type}
                            </span>
                            {trade.trade_type === "share" && trade.shares && (
                              <span>{trade.shares} shares</span>
                            )}
                            {trade.trade_type === "option" && trade.contracts && (
                              <span>{trade.contracts} contracts</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(trade)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(trade.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {trade.notes && (
                      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {trade.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                      {trade.entry_datetime && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Entry: {new Date(trade.entry_datetime).toLocaleString()}</span>
                        </div>
                      )}
                      {trade.exit_datetime && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Exit: {new Date(trade.exit_datetime).toLocaleString()}</span>
                        </div>
                      )}
                      {trade.trade_type === "option" && trade.strike_price && (
                        <span>Strike: ${Number(trade.strike_price).toFixed(2)}</span>
                      )}
                      {trade.trade_type === "option" && trade.expiration_date && (
                        <span>Exp: {new Date(trade.expiration_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 border border-slate-200 dark:border-slate-700 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No trades yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start logging your trades to see them here
            </p>
            <Link
              href="/trades"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Create Your First Trade
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
