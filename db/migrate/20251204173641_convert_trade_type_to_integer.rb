class ConvertTradeTypeToInteger < ActiveRecord::Migration[8.1]
  def up
    # 1. Rename old column
    rename_column :trades, :trade_type, :trade_type_old

    # 2. Add new integer column
    add_column :trades, :trade_type, :integer

    # 3. Convert string values to integer enums
    execute "UPDATE trades SET trade_type = 0 WHERE trade_type_old = 'share';"
    execute "UPDATE trades SET trade_type = 1 WHERE trade_type_old = 'option';"

    # 4. Remove old column
    remove_column :trades, :trade_type_old
  end

  def down
    # Reverse

    add_column :trades, :trade_type_old, :string

    execute "UPDATE trades SET trade_type_old = 'share' WHERE trade_type = 0;"
    execute "UPDATE trades SET trade_type_old = 'option' WHERE trade_type = 1;"

    remove_column :trades, :trade_type

    rename_column :trades, :trade_type_old, :trade_type
  end
end
