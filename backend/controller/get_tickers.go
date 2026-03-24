package controller

import (
	"encoding/json"
	"net/http"

	"realtime-trading-be/mapper"
	"realtime-trading-be/service"
)

// GET /tickers
func GetTickers(w http.ResponseWriter, r *http.Request) {
	data := service.GetAllTickerPrices()
	response := mapper.ToGetTickerResponse(data)

	json.NewEncoder(w).Encode(response)
}
