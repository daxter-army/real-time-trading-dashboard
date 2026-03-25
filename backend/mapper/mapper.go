package mapper

import (
	"strconv"

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
			Symbol: item.Symbol.String(),
			Price:  item.Price,
		})
	}

	return response
}

func ToGetHistoryDomain(rawData [][]interface{}) []*domain.TickerHistory {
	candles := []*domain.TickerHistory{}

	for _, item := range rawData {
		openTime := int64(item[0].(float64))
		open, _ := strconv.ParseFloat(item[1].(string), 64)
		high, _ := strconv.ParseFloat(item[2].(string), 64)
		low, _ := strconv.ParseFloat(item[3].(string), 64)
		closeP, _ := strconv.ParseFloat(item[4].(string), 64)
		volume, _ := strconv.ParseFloat(item[5].(string), 64)

		candles = append(candles, &domain.TickerHistory{
			OpenTime: openTime,
			Open:     open,
			High:     high,
			Low:      low,
			Close:    closeP,
			Volume:   volume,
		})
	}

	return candles
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
