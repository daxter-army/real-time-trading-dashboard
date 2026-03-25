package mapper

import (
	"testing"

	"realtime-trading-be/domain"
)

func TestToGetTickerResponse(t *testing.T) {
	input := []*domain.TickerInfo{
		{Symbol: "BTCUSDT", Price: "60000"},
	}

	resp := ToGetTickerResponse(input)

	if resp[0].Symbol != "BTCUSDT" {
		t.Errorf("Mapping failed")
	}
}
