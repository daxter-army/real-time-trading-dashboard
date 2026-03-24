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

	// routes
	http.HandleFunc("/tickers", controller.GetTickers)

	log.Println("server running on port:", PORT)
	http.ListenAndServe(":"+PORT, nil)
}
