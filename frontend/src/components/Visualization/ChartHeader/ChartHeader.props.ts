export type ChartHeaderProps = {
    chartType: string,
    chartPeriod: string,
    selectedTicker: string | null,
    onChartTypeClickHandler: (chartType: "line" | "candlestick") => void
    onChartPeriodClickHandler: (chartPeriod: string) => void,
}