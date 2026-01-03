class TradesController < ApplicationController
  before_action :set_trade, only: %i[show update destroy]

  # GET /trades
  def index
    trades = Trade.all.order(created_at: :desc)
    render json: trades
  end

  # GET /trades/:id
  def show
    render json: @trade
  end

  # POST /trades
  def create
    trade = Trade.new(trade_params)
    if trade.save
      render json: trade, status: :created
    else
      render json: { errors: trade.errors }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /trades/:id
  def update
    if @trade.update(trade_params)
      render json: @trade
    else
      render json: { errors: @trade.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /trades/:id
  def destroy
    @trade.destroy
    head :no_content
  end

  private

  def set_trade
    @trade = Trade.find(params[:id])
  end

  def trade_params
    params.require(:trade).permit(
      :ticker,
      :trade_type,
      :option_type,
      :shares,
      :contracts,
      :entry_price,
      :exit_price,
      :entry_premium,
      :exit_premium,
      :strike_price,
      :expiration_date,
      :entry_datetime,
      :exit_datetime,
      :notes,
      :traded_on
    )
  end
end
