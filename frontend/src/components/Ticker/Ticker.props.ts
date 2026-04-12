export type TickerProps = {
    data: TickerResponseItem[]
    isLoading: boolean
    selectedSymbol: string
    onTickerClickHandler: (symbol: string) => void
}