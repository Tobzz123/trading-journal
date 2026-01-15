class CreateTestEnums < ActiveRecord::Migration[8.1]
  def change
    create_table :test_enums do |t|
      t.string :name

      t.timestamps
    end
  end
end
