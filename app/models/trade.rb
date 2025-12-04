class Trade < ApplicationRecord
  enum trade_type: { share: 0, option: 1 }
  enum option_type: { call: 0, put: 1 }

  # Validations
  validates :trade_type, presence: true
  validates :shares, presence: true, if: -> { trade_type == "share" }
  validates :contracts, presence: true, if: -> { trade_type == "option" }
  validates :entry_price, :exit_price, presence: true, if: -> { trade_type == "share" }
  validates :entry_premium, :exit_premium, presence: true, if: -> { trade_type == "option" }
  validates :strike_price, :expiration_date, :option_type, presence: true, if: -> { trade_type == "option" }
end
