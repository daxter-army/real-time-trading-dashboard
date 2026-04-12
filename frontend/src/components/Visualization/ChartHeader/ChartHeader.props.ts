import type { CHART_TYPE, HISTORY_PERIOD_TYPE } from "@/types/types"

export type ChartHeaderProps = {
    chartType: CHART_TYPE,
    chartPeriod: HISTORY_PERIOD_TYPE,
    selectedTicker: string,
    onChartTypeClickHandler: (chartType: CHART_TYPE) => void
    onChartPeriodClickHandler: (chartPeriod: HISTORY_PERIOD_TYPE) => void,
}