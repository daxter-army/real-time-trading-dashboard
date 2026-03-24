package service

import (
	"realtime-trading-be/domain"
	"realtime-trading-be/store"
)

func GetAllTickerPrices() []*domain.TickerInfo {
	return store.GetAllPrices()
}

func CalculatePL(ticker string, current float64) (float64, float64) {
	prev, ok := store.GetPrevPrices(ticker)

	if !ok || prev == 0 {
		return 0, 0
	}

	change := current - prev
	percent := (change / prev) * 100

	return change, percent
}
