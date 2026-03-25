package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"realtime-trading-be/controller"
)

func middlewareEnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// load the env variables from .env file
	godotenv.Load()
	PORT := os.Getenv("PORT")

	// create a new mux
	mux := http.NewServeMux()

	// http routes
	mux.HandleFunc("/tickers/get", controller.GetTickers)
	mux.HandleFunc("/history/get", controller.GetHistory)

	// websocket routes
	mux.HandleFunc("/ws/tickers/get", controller.GetLiveTickers)

	// wrap mux with CORS middleware
	handler := middlewareEnableCORS(mux)

	log.Println("server running on port:", PORT)
	log.Fatal(http.ListenAndServe(":"+PORT, handler))
}
