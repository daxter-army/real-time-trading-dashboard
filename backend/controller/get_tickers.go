package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"realtime-trading-be/mapper"
	"realtime-trading-be/responses"
	"realtime-trading-be/service"
	"realtime-trading-be/store"
	"realtime-trading-be/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func GetTickers(w http.ResponseWriter, r *http.Request) {
	data := service.GetTickers()
	response := mapper.ToGetTickerResponse(data)

	json.NewEncoder(w).Encode(response)
}

func GetLiveTickers(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[GetLiveTickers] upgrade error:", err)
		return
	}
	defer conn.Close()

	// create a str of all available tickers
	tickerSymbols := ""
	for i, ticker := range store.AvailableTickers {
		if i == len(store.AvailableTickers) {
			tickerSymbols += ticker.Symbol + "@trade"
		} else {
			tickerSymbols += ticker.Symbol + "@trade/"
		}
	}

	// check client disconnects
	go func() {
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				log.Println("[GetLiveTickers] client disconnected:", err)
				conn.Close()
				return
			}
		}
	}()

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		<-ticker.C
		live := store.GetLiveTickers()
		resp := mapper.ToGetTickerResponse(live)

		message := &responses.WebsocketMessage{
			Type: utils.TickerUpdateEventType,
			Data: resp,
		}

		if err := conn.WriteJSON(message); err != nil {
			log.Println(" [GetLiveTickers] ws write error in websocket message loop:", err)
			return
		}
	}
}
