package store

import (
	"realtime-trading-be/domain"
	"sync"
)

var Tickers = []string{
	// Stocks
	// "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN",
	// "META", "NVDA", "JPM", "V", "WMT",

	// Crypto
	"BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:BNBUSDT",
	"BINANCE:SOLUSDT", "BINANCE:XRPUSDT", "BINANCE:ADAUSDT",
	"BINANCE:DOGEUSDT", "BINANCE:MATICUSDT", "BINANCE:LTCUSDT",
	"BINANCE:DOTUSDT",
}

var latestPrices = make(map[string]*domain.TickerInfo)
var prevPrices = make(map[string]float64)

var mu sync.RWMutex

func UpdatePrice(ticker string, price float64, ts int64) (bool, *domain.TickerInfo) {
	mu.Lock()
	defer mu.Unlock()

	// if there is no update in price, skip it
	old, exists := latestPrices[ticker]
	if exists && old.Price == price {
		return false, &domain.TickerInfo{}
	}

	// for storing the old prices
	if exists {
		prevPrices[ticker] = old.Price
	}

	updatedTicker := &domain.TickerInfo{
		Ticker:    ticker,
		Price:     price,
		Timestamp: ts,
	}

	latestPrices[ticker] = updatedTicker
	return true, updatedTicker
}

func GetAllPrices() []*domain.TickerInfo {
	mu.RLock()
	defer mu.RUnlock()

	var res []*domain.TickerInfo
	for _, t := range Tickers {
		if val, ok := latestPrices[t]; ok {
			res = append(res, val)
		}
	}

	return res
}

func GetPrevPrices(ticker string) (float64, bool) {
	mu.RLock()
	defer mu.RUnlock()

	val, ok := prevPrices[ticker]
	return val, ok
}
