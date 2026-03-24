package mapper

import (
	"realtime-trading-be/domain"
	"realtime-trading-be/responses"
	"realtime-trading-be/service"
	"realtime-trading-be/utils"
)

func ToGetTickerResponse(rawData []*domain.TickerInfo) []*responses.TickerInfoDTO {
	var response []*responses.TickerInfoDTO

	for _, item := range rawData {
		if item == nil {
			continue
		}

		change, precent := service.CalculatePL(item.Ticker, item.Price)

		response = append(response, &responses.TickerInfoDTO{
			Ticker:        utils.NormalizeTickerName(item.Ticker),
			Change:        change,
			ChangePercent: precent,
			Price:         item.Price,
			Timestamp:     item.Timestamp,
		})
	}

	return response
}
