class ConvertOptionTypeToInteger < ActiveRecord::Migration[8.1]
  def up
    # 1. Rename old column
    rename_column :trades, :option_type, :option_type_old

    # 2. Add new integer column
    add_column :trades, :option_type, :integer

    # 3. Convert existing values
    execute "UPDATE trades SET option_type = 0 WHERE option_type_old = 'call';"
    execute "UPDATE trades SET option_type = 1 WHERE option_type_old = 'put';"

    # 4. Remove old column
    remove_column :trades, :option_type_old
  end

  def down
    # Reverse the change

    add_column :trades, :option_type_old, :string

    execute "UPDATE trades SET option_type_old = 'call' WHERE option_type = 0;"
    execute "UPDATE trades SET option_type_old = 'put' WHERE option_type = 1;"

    remove_column :trades, :option_type

    rename_column :trades, :option_type_old, :option_type
  end
end
