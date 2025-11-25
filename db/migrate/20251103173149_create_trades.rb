class CreateTrades < ActiveRecord::Migration[8.1]
  def change
    create_table :trades do |t|
      t.string :ticker
      t.string :trade_type
      t.decimal :entry_price, precision: 10, scale: 2, null: false
      t.decimal :exit_price, precision: 10, scale: 2
      t.integer :shares
      t.date :traded_on
      t.datetime :entry_datetime
      t.datetime :exit_datetime
      t.text :notes
      t.string :option_type
      t.decimal :strike_price, precision: 10, scale: 2
      t.date :expiration_date
      t.integer :contracts

      t.timestamps
    end
  end
end
