package utils

const (
	binancePrefix = "BINANCE"

	TickerUpdateEventType = "ticker:update"
	AlertTriggerEventType = "alert:trigger"

	BinanceHistoryURL   = "https://api.binance.com/api/v3/klines?symbol=%s&interval=%s&limit=%d"
	BinanceWebsocketURL = "wss://stream.binance.com:9443/stream?streams=%s"
)

type TickerType string

const (
	TickerTypeBTCUSDT  TickerType = "BTCUSDT"
	TickerTypeETHUSDT  TickerType = "ETHUSDT"
	TickerTypeSOLUSDT  TickerType = "SOLUSDT"
	TickerTypeDOGEUSDT TickerType = "DOGEUSDT"
	TickerTypeBNBUSDT  TickerType = "BNBUSDT"
	TickerTypeLTCUSDT  TickerType = "LTCUSDT"
)

func (t TickerType) String() string {
	return string(t)
}
