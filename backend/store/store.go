package store

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/gorilla/websocket"

	"realtime-trading-be/domain"
	"realtime-trading-be/responses"
	"realtime-trading-be/utils"
)

var AvailableTickers = []*domain.TickerInfo{
	{Symbol: utils.BTCUSDTTickerTye},
	{Symbol: utils.ETHUSDTTickerType},
	{Symbol: utils.SOLUSDTTickerType},
	{Symbol: utils.DOGEUSDTTickerType},
	{Symbol: utils.BNBUSDTTickerType},
	{Symbol: utils.LTCUSDTTickerType},
}

func GetInitialTickers() []*domain.TickerInfo {
	return AvailableTickers
}

var liveTickers = make(map[string]*domain.TickerInfo)
var mutex sync.Mutex

func StartLiveTickerConnection() (*websocket.Conn, error) {
	tickerSymbols := ""

	for i, ticker := range AvailableTickers {
		if i == len(AvailableTickers)-1 {
			tickerSymbols += strings.ToLower(ticker.Symbol) + "@trade"
		} else {
			tickerSymbols += strings.ToLower(ticker.Symbol) + "@trade/"
		}
	}

	websocketUrl := fmt.Sprintf(utils.BinanceWebsocketURL, tickerSymbols)

	connection, _, err := websocket.DefaultDialer.Dial(websocketUrl, nil)
	if err != nil {
		log.Println("[StartLiveTickerConnection] websocket dial error:", err)
		return nil, err
	}

	go func() {
		defer connection.Close()

		for {
			_, msg, err := connection.ReadMessage()
			if err != nil {
				log.Println("[StartLiveTickerConnection] websocket read error:", err)
				continue
			}

			var trade responses.TickerMessage
			if err := json.Unmarshal(msg, &trade); err != nil {
				log.Println("[StartLiveTickerConnection] unmarshal error:", err)
				continue
			}

			if trade.Data == nil {
				log.Println("[StartLiveTickerConnection] received nil data in the websocket stream:", string(msg))
				continue
			}

			mutex.Lock()
			liveTickers[trade.Data.S] = &domain.TickerInfo{
				Symbol: trade.Data.S,
				Price:  trade.Data.P,
			}
			mutex.Unlock()
		}
	}()

	return connection, nil
}

// Fetch all current live tickers
func GetLiveTickers() []*domain.TickerInfo {
	mutex.Lock()
	defer mutex.Unlock()

	res := make([]*domain.TickerInfo, 0, len(AvailableTickers))
	for _, t := range AvailableTickers {
		if live, ok := liveTickers[t.Symbol]; ok {
			res = append(res, live)
		} else {
			// if we don't have live data yet, send initial ticker info
			res = append(res, t)
		}
	}

	return res
}
