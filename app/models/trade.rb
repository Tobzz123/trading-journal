class Trade < ApplicationRecord
  enum trade_type: { share: 0, option: 1 }

  # Validations
  validates :trade_type, presence: true
  validates :quantity, presence: true, if: -> { trade_type == "share" }
  validates :contracts, presence: true, if: -> { trade_type == "option" }
  validates :entry_price, :exit_price, presence: true
end
