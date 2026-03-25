package store

import (
	"testing"

	"realtime-trading-be/domain"
)

func TestGetLiveTickersOrder(t *testing.T) {
	liveTickers["ETHUSDT"] = &domain.TickerInfo{
		Symbol: "ETHUSDT",
		Price:  "2000",
	}

	liveTickers["BTCUSDT"] = &domain.TickerInfo{
		Symbol: "BTCUSDT",
		Price:  "60000",
	}

	res := GetLiveTickers()

	if res[0].Symbol != "BTCUSDT" {
		t.Errorf("Expected BTCUSDT first, got %s", res[0].Symbol)
	}
}
