package utils

import "strings"

const (
	binancePrefix = "BINANCE"
)

func NormalizeTickerName(t string) string {
	namePrefix := binancePrefix + ":"

	if strings.Contains(t, namePrefix) {
		return strings.Replace(t, namePrefix, "", 1)
	}

	return t
}
