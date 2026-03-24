import clsx from "clsx"
import Chart from "react-apexcharts"
import { useEffect, useMemo, useState } from "react"
import { MdOutlineShowChart, MdOutlineCandlestickChart } from "react-icons/md";

import ChartLoader from "./ChartLoader";

import {
    STATICS,
    API_SUB_PATHS,
    HTTP_BASE_PATH,
    CHART_TYPE_LINE,
    POLLING_INTERVAL,
    HISTORY_PERIOD_1D,
    HISTORY_PERIOD_5D,
    CHART_TYPE_CANDLE,
} from "../../constants/constants"

import type { VisualizationProps } from "./Visualization.props"

const Visualization = ({ symbol }: VisualizationProps) => {
    const [isTabVisible, setIsTabVisible] = useState(true)
    const [chartData, setChartData] = useState<any[]>([])
    const [chartError, setChartError] = useState(false)
    const [chartIsLoading, setChartIsLoading] = useState(true)

    const [chartType, setChartType] = useState(CHART_TYPE_LINE)

    const [period, setPeriod] = useState(HISTORY_PERIOD_1D)

    const fetchChartData = async (symbol: string, reflectLoading = false) => {
        try {
            if (reflectLoading) setChartIsLoading(true)

            const params = new URLSearchParams({
                symbol,
                period
            })

            const apiData = await fetch(
                HTTP_BASE_PATH + API_SUB_PATHS.PERIODIC_HISTORY + "?" + params
            )

            const parseApiData = await apiData.json()

            setChartData(parseApiData)
            setChartError(false)
        } catch (err) {
            console.error(err)
            setChartError(true)
        } finally {
            if (reflectLoading) setChartIsLoading(false)
        }
    }

    useEffect(() => {
        fetchChartData(symbol, true)
    }, [symbol, period])

    useEffect(() => {
        if (period !== HISTORY_PERIOD_1D || !isTabVisible) return

        const interval = setInterval(() => {
            fetchChartData(symbol)
        }, POLLING_INTERVAL)

        return () => clearInterval(interval)
    }, [symbol, period, isTabVisible])

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabVisible(!document.hidden)
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

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
    const times = useMemo(() => {
        return chartData.map(d => d.time)
    }, [chartData])

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
        if (chartType === "candlestick") {
            return [
                {
                    name: "Price",
                    data: candleSeries
                }
            ]
        }

        return [
            {
                name: "Price",
                data: lineSeries
            }
        ]
    }, [chartType, lineSeries, candleSeries, lastPoint])

    if (chartError) return <div>Error loading chart</div>

    const onChartPeriodClickHandler = (dataPeriod: string) => {
        setPeriod(dataPeriod)
    }

    const onChartTypeClickHandler = (toggledChartType: string) => {
        setChartType(toggledChartType)
    }

    const buttonClassNames = "cursor-pointer border border-[#95a5a6] rounded-sm px-1 hover:border-[#3498db]"
    const buttonActiveClassNames = "border-[#3498db] bg-[#3498db] text-white"

    return (
        <div>
            <div className="flex justify-between pl-4 pr-2">
                <div className="flex gap-2 items-end">
                    <div className="flex gap-2">
                        <button className={clsx(buttonClassNames, { [buttonActiveClassNames]: period === HISTORY_PERIOD_1D })} onClick={() => onChartPeriodClickHandler(HISTORY_PERIOD_1D)}>{HISTORY_PERIOD_1D}</button>
                        <button className={clsx(buttonClassNames, { [buttonActiveClassNames]: period === HISTORY_PERIOD_5D })} onClick={() => onChartPeriodClickHandler(HISTORY_PERIOD_5D)}>{HISTORY_PERIOD_5D}</button>
                    </div>
                    <span className="font-medium"><span className="font-bold">{symbol}</span> {STATICS.CLOSING_PRICE}</span>
                    {period === HISTORY_PERIOD_1D && <div className="flex items-center gap-2">
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