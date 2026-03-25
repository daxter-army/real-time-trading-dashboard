package service

import (
	"testing"
)

func TestGetTickers(t *testing.T) {
	tickers := GetTickers()

	if len(tickers) == 0 {
		t.Errorf("Expected tickers, got empty list")
	}

	if tickers[0].Symbol != "BTCUSDT" {
		t.Errorf("Expected BTCUSDT, got %s", tickers[0].Symbol)
	}
}
