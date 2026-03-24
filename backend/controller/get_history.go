package controller

import (
	"encoding/json"
	"net/http"
	"realtime-trading-be/mapper"
	"realtime-trading-be/service"
)

func GetHistory(w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")
	period := r.URL.Query().Get("period")
	// TODO: add minor validations here

	response, err := service.GetTickerHistory(symbol, period)
	if err != nil {
		// TODO: handle error here
	}

	mappedResponse := mapper.ToGetHistoryResponse(response)
	json.NewEncoder(w).Encode(mappedResponse)
}
