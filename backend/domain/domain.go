package domain

type TickerInfo struct {
	Price     float64 `json:"price"`
	Ticker    string  `json:"ticker"`
	Timestamp int64   `json:"timestamp"`
}
