package mapper

import (
	"realtime-trading-be/domain"
	"realtime-trading-be/responses"
)

func ToGetTickerResponse(rawData []*domain.TickerInfo) []*responses.TickerDTO {
	var response []*responses.TickerDTO

	for _, item := range rawData {
		if item == nil {
			continue
		}

		response = append(response, &responses.TickerDTO{
			Symbol: item.Symbol,
			Price:  item.Price,
		})
	}

	return response
}

func ToGetHistoryResponse(rawData []*domain.TickerHistory) []*responses.TickerHistoryDTO {
	var finalResponse []*responses.TickerHistoryDTO

	for _, item := range rawData {
		finalResponse = append(finalResponse, &responses.TickerHistoryDTO{
			Time:   item.OpenTime,
			Open:   item.Open,
			High:   item.High,
			Low:    item.Low,
			Close:  item.Close,
			Volume: item.Volume,
		})
	}

	return finalResponse
}
