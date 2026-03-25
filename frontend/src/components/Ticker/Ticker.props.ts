export type TickerProps = {
    data: any[]
    isLoading: boolean
    selectedSymbol: string | null
    onTickerClickHandler: (symbol: string) => void
}