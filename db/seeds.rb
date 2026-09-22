# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Worked dataset for the P&L Dashboard & Calendar feature: 10 trades across July/August 2026,
# mixing shares and options, wins/losses/breakeven, two same-day closes (08/10), and one open
# share + one open option position. Hand-computed: totalRealizedPnl = $615.00, winCount = 4,
# lossCount = 3, breakevenCount = 1, winRate = 50%, avgWin = $231.25, avgLoss = -$103.33,
# profitFactor ≈ 2.98.

if Trade.count.zero?
  Trade.create!(
    ticker: "AAPL", trade_type: :share, shares: 10,
    entry_price: 100.00, exit_price: 110.00,
    entry_datetime: Time.new(2026, 7, 5, 10, 0, 0), exit_datetime: Time.new(2026, 7, 5, 15, 30, 0)
  )

  Trade.create!(
    ticker: "TSLA", trade_type: :share, shares: 5,
    entry_price: 250.00, exit_price: 230.00,
    entry_datetime: Time.new(2026, 7, 10, 9, 45, 0), exit_datetime: Time.new(2026, 7, 12, 11, 0, 0)
  )

  Trade.create!(
    ticker: "MSFT", trade_type: :option, option_type: :call, contracts: 2,
    entry_price: 0.00, entry_premium: 2.00, exit_premium: 3.50,
    strike_price: 300.00, expiration_date: Date.new(2026, 7, 17),
    entry_datetime: Time.new(2026, 7, 15, 10, 15, 0), exit_datetime: Time.new(2026, 7, 15, 14, 0, 0)
  )

  Trade.create!(
    ticker: "NVDA", trade_type: :option, option_type: :put, contracts: 1,
    entry_price: 0.00, entry_premium: 5.00, exit_premium: 5.00,
    strike_price: 120.00, expiration_date: Date.new(2026, 7, 24),
    entry_datetime: Time.new(2026, 7, 20, 9, 30, 0), exit_datetime: Time.new(2026, 7, 20, 15, 45, 0)
  )

  Trade.create!(
    ticker: "GOOG", trade_type: :share, shares: 20,
    entry_price: 140.00, exit_price: 132.00,
    entry_datetime: Time.new(2026, 8, 2, 9, 40, 0), exit_datetime: Time.new(2026, 8, 2, 13, 0, 0)
  )

  Trade.create!(
    ticker: "AMZN", trade_type: :share, shares: 15,
    entry_price: 130.00, exit_price: 145.00,
    entry_datetime: Time.new(2026, 8, 5, 10, 0, 0), exit_datetime: Time.new(2026, 8, 6, 12, 30, 0)
  )

  Trade.create!(
    ticker: "SPY", trade_type: :option, option_type: :call, contracts: 4,
    entry_price: 0.00, entry_premium: 1.50, exit_premium: 2.25,
    strike_price: 550.00, expiration_date: Date.new(2026, 8, 14),
    entry_datetime: Time.new(2026, 8, 10, 9, 35, 0), exit_datetime: Time.new(2026, 8, 10, 11, 15, 0)
  )

  Trade.create!(
    ticker: "QQQ", trade_type: :share, shares: 10,
    entry_price: 300.00, exit_price: 295.00,
    entry_datetime: Time.new(2026, 8, 10, 13, 0, 0), exit_datetime: Time.new(2026, 8, 10, 15, 50, 0)
  )

  # Open positions: exit_price/exit_premium are required at the model level even for
  # trades that haven't closed yet, so — matching what the log-trade form actually
  # submits when that field is left untouched — "open" is represented as 0.00, not blank.
  Trade.create!(
    ticker: "META", trade_type: :share, shares: 8,
    entry_price: 300.00, exit_price: 0.00,
    entry_datetime: Time.new(2026, 8, 15, 10, 0, 0)
  )

  Trade.create!(
    ticker: "AAPL", trade_type: :option, option_type: :put, contracts: 3,
    entry_price: 0.00, entry_premium: 3.00, exit_premium: 0.00,
    strike_price: 210.00, expiration_date: Date.new(2026, 9, 19),
    entry_datetime: Time.new(2026, 8, 16, 9, 50, 0)
  )
end
