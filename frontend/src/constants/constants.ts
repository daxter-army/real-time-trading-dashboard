export const HTTP_BASE_PATH = `http://localhost:${import.meta.env.VITE_BACKEND_SERVER_PORT}`
export const WS_BASE_PATH = `ws://localhost:${import.meta.env.VITE_BACKEND_SERVER_PORT}`

export const API_SUB_PATHS = {
    STATIC_TICKERS: "/tickers/get",
    LIVE_TICKERS: "/ws/tickers/get",
    PERIODIC_HISTORY: "/history/get"
}

export const POLLING_INTERVAL = 2000

export const HISTORY_PERIOD_1D = "1D"
export const HISTORY_PERIOD_5D = "5D"

export const CHART_TYPE_LINE = "line"
export const CHART_TYPE_CANDLE = "candlestick"

export const STATICS = {
    CLOSING_PRICE: "closing price",
    APP_TITLE: "My trading dashboard",
    LOGIN_MANDATE: "Please login to view dashboard"
}

export const WEBSOCKET_EVENTS = {
    TICKER_UPDATE: "ticker:update",
    ALERT_TRIGGER: "alert:trigger"
}

export const LOCAL_STORAGE_KEYS = {
    USER_LOGGED_IN: "my-rtd-user-logged-in"
}

export const APP_ROUTES = {
    ROOT: "/",
    WILDCARD: "*",
    LOGIN_SCREEN: "/login",
    DASHBOARD_SCREEN: "/dashboard",
}

export const TICKER_LOADER_SKELETON_QTY = 6