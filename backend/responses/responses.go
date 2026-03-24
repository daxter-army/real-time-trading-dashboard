package responses

type TickerDTO struct {
	Price  string `json:"price"`
	Symbol string `json:"symbol"`
}

type TickerHistoryDTO struct {
	Time   int64   `json:"time"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume float64 `json:"volume"`
}

type TickerWebSocketMessage struct {
	Data *struct {
		S string `json:"s"`
		P string `json:"p"`
	} `json:"data"`
}
