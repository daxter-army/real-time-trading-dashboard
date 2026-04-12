package controller

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetTickersHandler(t *testing.T) {
	req := httptest.NewRequest("GET", "/tickers/get", nil)
	rr := httptest.NewRecorder()

	GetTickers(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Expected 200, got %v", status)
	}
}

func TestGetHistory_Success(t *testing.T) {
	req := httptest.NewRequest(
		http.MethodGet,
		"/history?symbol=BTCUSDT&period=1D",
		nil,
	)

	rr := httptest.NewRecorder()

	GetHistory(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200 got %d", rr.Code)
	}
}

func TestGetHistory_MissingSymbol(t *testing.T) {
	req := httptest.NewRequest(
		http.MethodGet,
		"/history?period=1D",
		nil,
	)

	rr := httptest.NewRecorder()

	GetHistory(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400 got %d", rr.Code)
	}
}
