class Trade < ApplicationRecord
  enum trade_type: { share: 0, option: 1 }
  enum option_type: { call: 0, put: 1 }, _prefix: :option

  # Validations
  validates :trade_type, presence: true
 
  # Shares-specific validations
  shares if: -> { share? } do
    validates :shares, presence: true
    validates :entry_price, presence: true
    validates :exit_price, presence: true
  end

  # Options-specific validations
  options if: -> { option? } do
    validates :contracts, presence: true
    validates :entry_premium, presence: true
    validates :exit_premium, presence: true
    validates :strike_price, presence: true
    validates :expiration_date, presence: true
    validates :option_type, presence: true
  end
end