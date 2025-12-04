class Api::V1::TradesController < ApplicationController
    before_action :set_trade, only: [:show, :update, :destroy]
  
    def index
      render json: Trade.all
    end
  
    def show
      render json: @trade
    end
  
    def create
      trade = Trade.new(trade_params)
      if trade.save
        render json: trade, status: :created
      else
        render json: { errors: trade.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def update
      if @trade.update(trade_params)
        render json: @trade
      else
        render json: { errors: @trade.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
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
        :symbol, :entry_price, :exit_price,
        :trade_type, :shares, :contracts,
        :entry_time, :exit_time, :notes
      )
    end
  end
  