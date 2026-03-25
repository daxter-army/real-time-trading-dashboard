import clsx from "clsx"
import { useMemo } from "react"
import Chart from "react-apexcharts"
import { MdOutlineShowChart, MdOutlineCandlestickChart } from "react-icons/md";

import useVisualization from "@/hooks/useVisualization";

import ChartLoader from "./ChartLoader";

import {
    STATICS,
    CHART_TYPE_LINE,
    HISTORY_PERIOD_1D,
    HISTORY_PERIOD_5D,
    CHART_TYPE_CANDLE,
} from "@/constants/constants"

import type { VisualizationProps } from "./Visualization.props"

const Visualization = ({ }: VisualizationProps) => {
    const {
        chartData,
        chartError,
        chartType,
        chartPeriod,
        selectedTicker,
        chartIsLoading,
        onChartTypeClickHandler,
        onChartPeriodClickHandler,
    } = useVisualization()

    // Format series
    const lineSeries = useMemo(() => {
        return chartData.map(d => ({
            x: d.time,
            y: d.close
        }))
    }, [chartData])

    const candleSeries = useMemo(() => {
        return chartData.map(d => ({
            x: d.time,
            y: [d.open, d.high, d.low, d.close]
        }))
    }, [chartData])

    // Compute axis range
    const times = useMemo(() => chartData.map(d => d.time), [chartData])

    // last point for annotation
    const lastPoint = lineSeries[lineSeries.length - 1]
    const options = useMemo(
        () => ({
            chart: {
                type: chartType,
                toolbar: { show: false },
                zoom: { enabled: true },
                animations: {
                    enabled: false
                }
            },
            plotOptions: {
                candlestick: {
                    colors: {
                        upward: "#16c784",
                        downward: "#ea3943"
                    }
                }
            },
            annotations: {
                yaxis: [
                    {
                        y: lastPoint?.y,
                        borderColor: "#3498db",
                        label: {
                            text: lastPoint?.y.toFixed(2),
                            style: {
                                background: "#3498db",
                                color: "#fff"
                            }
                        }
                    }
                ]
            },
            xaxis: {
                type: "datetime",
                min: times.length ? Math.min(...times) : undefined,
                max: times.length ? Math.max(...times) : undefined,
                title: {
                    text: "Time"
                }
            },
            yaxis: {
                labels: {
                    formatter: (val: number) => val.toFixed(2)
                }
            },
            stroke: {
                curve: "smooth",
                width: 2
            },
            markers: {
                size: 0
            },
            tooltip: {
                x: {
                    format: "HH:mm:ss"
                },
                y: {
                    formatter: (val: number) => val.toFixed(2)
                }
            }
        }),
        [times]
    )

    const series = useMemo(() => {
        return chartType === CHART_TYPE_CANDLE ?
            [
                {
                    name: "Price",
                    data: candleSeries
                }
            ]
            : [
                {
                    name: "Price",
                    data: lineSeries
                }
            ]
    }, [chartType, lineSeries, candleSeries, lastPoint])

    if (chartError) return <div>Error loading chart</div>

    const buttonClassNames = "cursor-pointer border border-[#95a5a6] rounded-sm px-1 hover:border-[#3498db]"
    const buttonActiveClassNames = "border-[#3498db] bg-[#3498db] text-white"

    return (
        <div>
            <div className="flex justify-between pl-4 pr-2">
                <div className="flex gap-2 items-end">
                    <div className="flex gap-2">
                        <button className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartPeriod === HISTORY_PERIOD_1D })} onClick={() => onChartPeriodClickHandler(HISTORY_PERIOD_1D)}>{HISTORY_PERIOD_1D}</button>
                        <button className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartPeriod === HISTORY_PERIOD_5D })} onClick={() => onChartPeriodClickHandler(HISTORY_PERIOD_5D)}>{HISTORY_PERIOD_5D}</button>
                    </div>
                    <span className="font-medium"><span className="font-bold">{selectedTicker}</span> {STATICS.CLOSING_PRICE}</span>
                    {chartPeriod === HISTORY_PERIOD_1D && <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-600">Live</span>
                    </div>}
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onChartTypeClickHandler(CHART_TYPE_LINE)}
                        className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartType === CHART_TYPE_LINE })}
                    >
                        <MdOutlineShowChart />
                    </button>
                    <button
                        onClick={() => onChartTypeClickHandler(CHART_TYPE_CANDLE)}
                        className={clsx(buttonClassNames, { [buttonActiveClassNames]: chartType === CHART_TYPE_CANDLE })}
                    >
                        <MdOutlineCandlestickChart />
                    </button>
                </div>
            </div>
            <div className="relative">
                {chartIsLoading && <ChartLoader />}
                <Chart
                    height={400}
                    key={chartType}
                    series={series}
                    type={chartType}
                    options={options}
                />
            </div>
        </div>
    )
}

export default Visualization