package responses

type TickerInfoDTO struct {
	Price         float64 `json:"price"`
	Ticker        string  `json:"ticker"`
	Timestamp     int64   `json:"timestamp"`
	Change        float64 `json:"change"`
	ChangePercent float64 `json:"changePercent"`
}
