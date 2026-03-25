package service

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"realtime-trading-be/domain"
	"realtime-trading-be/mapper"
	"realtime-trading-be/store"
	"realtime-trading-be/utils"
)

func GetTickers() []*domain.TickerInfo {
	return store.GetInitialTickers()
}

func GetTickerHistory(symbol string, period string) ([]*domain.TickerHistory, error) {
	var interval string
	var limit int

	switch period {
	case "1D":
		interval = "5m"
		limit = 288 // 24h * 60min
	case "5D":
		interval = "1h"
		limit = 120 // 5days * 24h
	case "1M":
		interval = "4h"
		limit = 180 // 30days * 6 (4h candles)
	default:
		interval = "1m"
	}

	url := fmt.Sprintf(utils.BinanceHistoryURL, symbol, interval, limit)

	resp, err := http.Get(url)
	if err != nil {
		log.Println("[GetTickerHistory] error while:", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var data [][]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		log.Println("[GetTickerHistory] error while unmarshalling:", err)
		return nil, err
	}

	return mapper.ToGetHistoryDomain(data), nil
}
