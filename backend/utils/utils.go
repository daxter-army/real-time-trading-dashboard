package utils

const (
	binancePrefix = "BINANCE"

	TickerUpdateEventType = "ticker:update"
	AlertTriggerEventType = "alert:trigger"

	BinanceHistoryURL   = "https://api.binance.com/api/v3/klines?symbol=%s&interval=%s&limit=%d"
	BinanceWebsocketURL = "wss://stream.binance.com:9443/stream?streams=%s"

	BTCUSDTTickerTye   = "BTCUSDT"
	ETHUSDTTickerType  = "ETHUSDT"
	SOLUSDTTickerType  = "SOLUSDT"
	DOGEUSDTTickerType = "DOGEUSDT"
	BNBUSDTTickerType  = "BNBUSDT"
	LTCUSDTTickerType  = "LTCUSDT"
)
