package domain

type TickerInfo struct {
	Price  string
	Symbol string
}

type TickerHistory struct {
	OpenTime int64
	Open     float64
	Close    float64
	Low      float64
	High     float64
	Volume   float64
}
