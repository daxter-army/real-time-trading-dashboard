package utils

import (
	"math"
	"strings"
)

const (
	binancePrefix = "BINANCE"

	TickerUpdateEventType = "ticker:update"
	AlertTriggerEventType = "alert:trigger"
)

func NormalizeTickerName(t string) string {
	namePrefix := binancePrefix + ":"

	if strings.Contains(t, namePrefix) {
		return strings.Replace(t, namePrefix, "", 1)
	}

	return t
}
