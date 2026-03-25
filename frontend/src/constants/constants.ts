export const HTTP_BASE_PATH = import.meta.env.VITE_BACKEND_HTTP_SERVER_URL
export const WS_BASE_PATH = import.meta.env.VITE_BACKEND_WS_SERVER_URL

export const API_SUB_PATHS = {
    STATIC_TICKERS: "/tickers/get",
    LIVE_TICKERS: "/ws/tickers/get",
    PERIODIC_HISTORY: "/history/get"
}

export const HISTORY_PERIOD_1D = "1D"
export const HISTORY_PERIOD_5D = "5D"

export const CHART_TYPE_LINE = "line"
export const CHART_TYPE_CANDLE = "candlestick"

export const STATICS = {
    LOGIN: "login",
    CLOSING_PRICE: "closing price",
    APP_TITLE: "My trading dashboard",
    LOGIN_MANDATE: "Please login to view dashboard",
    ERROR_TITLE: "Error while loading! Please try again",
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