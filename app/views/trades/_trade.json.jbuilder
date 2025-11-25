json.extract! trade, :id, :ticker, :trade_type, :entry_price, :exit_price, :shares, :traded_on, :entry_datetime, :exit_datetime, :notes, :option_type, :strike_price, :expiration_date, :contracts, :created_at, :updated_at
json.url trade_url(trade, format: :json)
