class AddPremiumFieldsToTrades < ActiveRecord::Migration[8.1]
  def change
    add_column :trades, :entry_premium, :decimal, precision: 10, scale: 2
    add_column :trades, :exit_premium, :decimal, precision: 10, scale: 2
  end
end
