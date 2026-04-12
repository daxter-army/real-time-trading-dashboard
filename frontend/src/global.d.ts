interface TickerResponseItem {
    price: string
    symbol: string
}

interface WebsockerMessageType {
    type: WEBSOCKET_EVENT_TYPE
    data: TickerResponseItem[]
}

interface HistoryApiResponseItem {
    time: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
}