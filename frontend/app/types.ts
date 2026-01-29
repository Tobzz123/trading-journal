export type Trade = {
    id: number;
    ticker: string;
    trade_type: TradeType;
    option_type?: OptionType;

    shares?: number;
    contracts?: number;

    entry_price?: number;
    exit_price?: number;

    
    entry_premium?: number;
    exit_premium?: number;

    entry_datetime?: string;
    exit_datetime?: string;

    strike_price?: number;
    expiration_date?: string;

    traded_on?: string;
    notes?: string;
    
}

export enum TradeType {
    Share = "share",
    Option = "option",
}
export type OptionType = "call" | "put";