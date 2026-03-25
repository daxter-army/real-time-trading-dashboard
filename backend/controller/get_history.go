package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"realtime-trading-be/mapper"
	"realtime-trading-be/service"
)

func GetHistory(w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")
	period := r.URL.Query().Get("period")

	if symbol == "" || period == "" {
		http.Error(w, "symbol and period are required", http.StatusBadRequest)
		return
	}

	response, err := service.GetTickerHistory(symbol, period)
	if err != nil {
		log.Println("[GetHistory] service error:", err)
		http.Error(w, "failed to fetch history:", http.StatusInternalServerError)
		return
	}

	mappedResponse := mapper.ToGetHistoryResponse(response)
	json.NewEncoder(w).Encode(mappedResponse)
}
