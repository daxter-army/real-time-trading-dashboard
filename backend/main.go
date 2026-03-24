package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"realtime-trading-be/controller"
)

func main() {
	// load the env variables from .env file
	godotenv.Load()
	PORT := os.Getenv("PORT")

	// http routes
	http.HandleFunc("/tickers/get", controller.GetTickers)
	http.HandleFunc("/history/get", controller.GetHistory)

	// websocket routes
	http.HandleFunc("/ws/tickers/get", controller.GetLiveTickers)

	log.Println("server running on port:", PORT)
	http.ListenAndServe(":"+PORT, nil)
}
