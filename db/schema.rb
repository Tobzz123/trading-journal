# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_11_03_173149) do
  create_table "trades", force: :cascade do |t|
    t.integer "contracts"
    t.datetime "created_at", null: false
    t.datetime "entry_datetime"
    t.decimal "entry_price", precision: 10, scale: 2, null: false
    t.datetime "exit_datetime"
    t.decimal "exit_price", precision: 10, scale: 2
    t.date "expiration_date"
    t.text "notes"
    t.string "option_type"
    t.integer "shares"
    t.decimal "strike_price", precision: 10, scale: 2
    t.string "ticker"
    t.string "trade_type"
    t.date "traded_on"
    t.datetime "updated_at", null: false
  end
end
