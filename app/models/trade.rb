class Trade < ApplicationRecord
  enum :trade_type, { share: 0, option: 1 }
  enum :option_type, { call: 0, put: 1 }, prefix: true

  validates :trade_type, presence: true

  validates :shares, :entry_price, :exit_price,
            presence: true, if: :share?

  validates :contracts, :entry_premium, :exit_premium,
            :strike_price, :expiration_date, :option_type,
            presence: true, if: :option?

  validates :entry_datetime, presence: true
  validates :exit_datetime, presence: true, if: :exit_price?
end
