import { useMemo } from "react"
import Chart from "react-apexcharts"

import useVisualization from "@/hooks/useVisualization";

import ChartError from "./ChartError/ChartError";
import ChartHeader from "./ChartHeader/ChartHeader";
import ChartLoader from "./ChartLoader/ChartLoader";

import { CHART_TYPE_CANDLE } from "@/constants/constants"

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

    // format for line graph
    const lineSeries = useMemo(() => {
        return chartData.map(d => ({
            x: d.time,
            y: d.close
        }))
    }, [chartData])

    // format for candle stick graph
    const candleSeries = useMemo(() => {
        return chartData.map(d => ({
            x: d.time,
            y: [d.open, d.high, d.low, d.close]
        }))
    }, [chartData])

    // compute the x-axis
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

    return chartError
        ? <ChartError />
        : <div>
            <ChartHeader
                chartType={chartType}
                chartPeriod={chartPeriod}
                selectedTicker={selectedTicker}
                onChartTypeClickHandler={onChartTypeClickHandler}
                onChartPeriodClickHandler={onChartPeriodClickHandler}
            />
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

}

export default Visualization