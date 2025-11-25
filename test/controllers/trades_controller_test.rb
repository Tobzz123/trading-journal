require "test_helper"

class TradesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @trade = trades(:one)
  end

  test "should get index" do
    get trades_url
    assert_response :success
  end

  test "should get new" do
    get new_trade_url
    assert_response :success
  end

  test "should create trade" do
    assert_difference("Trade.count") do
      post trades_url, params: { trade: { contracts: @trade.contracts, entry_datetime: @trade.entry_datetime, entry_price: @trade.entry_price, exit_datetime: @trade.exit_datetime, exit_price: @trade.exit_price, expiration_date: @trade.expiration_date, notes: @trade.notes, option_type: @trade.option_type, shares: @trade.shares, strike_price: @trade.strike_price, ticker: @trade.ticker, trade_type: @trade.trade_type, traded_on: @trade.traded_on } }
    end

    assert_redirected_to trade_url(Trade.last)
  end

  test "should show trade" do
    get trade_url(@trade)
    assert_response :success
  end

  test "should get edit" do
    get edit_trade_url(@trade)
    assert_response :success
  end

  test "should update trade" do
    patch trade_url(@trade), params: { trade: { contracts: @trade.contracts, entry_datetime: @trade.entry_datetime, entry_price: @trade.entry_price, exit_datetime: @trade.exit_datetime, exit_price: @trade.exit_price, expiration_date: @trade.expiration_date, notes: @trade.notes, option_type: @trade.option_type, shares: @trade.shares, strike_price: @trade.strike_price, ticker: @trade.ticker, trade_type: @trade.trade_type, traded_on: @trade.traded_on } }
    assert_redirected_to trade_url(@trade)
  end

  test "should destroy trade" do
    assert_difference("Trade.count", -1) do
      delete trade_url(@trade)
    end

    assert_redirected_to trades_url
  end
end
