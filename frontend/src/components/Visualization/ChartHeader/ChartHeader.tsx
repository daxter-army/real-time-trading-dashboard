import clsx from "clsx"
import { MdOutlineCandlestickChart, MdOutlineShowChart } from "react-icons/md"

import { CHART_TYPES, HISTORY_PERIOD, STATICS } from "@/constants/constants"

import type { ChartHeaderProps } from "./ChartHeader.props"

const ChartHeader = ({ chartPeriod, chartType, selectedTicker, onChartPeriodClickHandler, onChartTypeClickHandler }: ChartHeaderProps) => {
    const buttonClassNames = "cursor-pointer border border-[#95a5a6] rounded-sm px-1 hover:border-[#3498db]"
    const buttonActiveClassNames = "border-[#3498db] bg-[#3498db] text-white"

    return <div className="flex justify-between pl-4 pr-2">
        <div className="flex gap-2 items-end">
            <div className="flex gap-2">
                <button className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartPeriod === HISTORY_PERIOD["1D"] })} onClick={() => onChartPeriodClickHandler(HISTORY_PERIOD["1D"])}>{HISTORY_PERIOD["1D"]}</button>
                <button className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartPeriod === HISTORY_PERIOD["5D"] })} onClick={() => onChartPeriodClickHandler(HISTORY_PERIOD["5D"])}>{HISTORY_PERIOD["5D"]}</button>
            </div>
            <span className="font-medium"><span className="font-bold">{selectedTicker}</span> {STATICS.CLOSING_PRICE}</span>
            {chartPeriod === HISTORY_PERIOD["1D"] && <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-600">Live</span>
            </div>}
        </div>
        <div className="flex gap-2 ml-4">
            <button
                onClick={() => onChartTypeClickHandler(CHART_TYPES.LINE)}
                className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartType === CHART_TYPES.LINE })}
            >
                <MdOutlineShowChart />
            </button>
            <button
                onClick={() => onChartTypeClickHandler(CHART_TYPES.CANDLESTICK)}
                className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartType === CHART_TYPES.CANDLESTICK })}
            >
                <MdOutlineCandlestickChart />
            </button>
        </div>
    </div>
}

export default ChartHeader