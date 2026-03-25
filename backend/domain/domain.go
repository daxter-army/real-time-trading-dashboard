package domain

import "realtime-trading-be/utils"

type TickerInfo struct {
	Price  string
	Symbol utils.TickerType
}

type TickerHistory struct {
	OpenTime int64
	Open     float64
	Close    float64
	Low      float64
	High     float64
	Volume   float64
}
