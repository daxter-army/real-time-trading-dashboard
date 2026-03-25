import { useCallback, useEffect, useState } from "react"

import useFetch from "./useFetch";

import { useAppStore } from "@/store/app";
import { useWSStore } from "@/store/websocket";

import { API_SUB_PATHS, CHART_TYPE_LINE, HISTORY_PERIOD_1D, HTTP_BASE_PATH, WEBSOCKET_EVENTS } from "@/constants/constants";

type useVisualizationProps = {
    selectedTicker: string,
    chartData: any[],
    chartError: Error | null,
    chartIsLoading: boolean,
    chartPeriod: string,
    chartType: "line" | "candlestick",
    onChartPeriodClickHandler: (dataPeriod: string) => void,
    onChartTypeClickHandler: (toggledChartType: "line" | "candlestick") => void,
}

const useVisualization = (): useVisualizationProps => {
    const wsConnection = useWSStore(state => state.socket)
    const selectedTicker = useAppStore(state => state.selectedTicker)
    const isTabVisible = useAppStore(state => state.isTabVisible)

    const [chartPeriod, setChartPeriod] = useState(HISTORY_PERIOD_1D)
    const [chartType, setChartType] = useState<"line" | "candlestick">(CHART_TYPE_LINE)

    const queryParams = new URLSearchParams({
        symbol: selectedTicker!,
        period: chartPeriod
    })
    const {
        data,
        setData,
        loading,
        error,
    } = useFetch(HTTP_BASE_PATH + API_SUB_PATHS.PERIODIC_HISTORY + "?" + queryParams, [], (result: any) => {
        return result
    })

    const onChartPeriodClickHandler = (dataPeriod: string) => {
        setChartPeriod(dataPeriod)
    }

    const onChartTypeClickHandler = (toggledChartType: "line" | "candlestick") => {
        setChartType(toggledChartType)
    }

    const onLiveTickerUpdateHandler = useCallback((event: MessageEvent) => {
        if (!isTabVisible) return

        const message = JSON.parse(event.data)
        if (message.type !== WEBSOCKET_EVENTS.TICKER_UPDATE) return

        const ticker = message.data?.find(
            (t: any) => t.symbol === selectedTicker
        )

        if (!ticker || !data?.length) return
        const totalNumberOfEntries = data.length

        const price = Number(ticker.price)
        const now = Date.now()

        const last = data[data.length - 1]
        const ONE_MIN = 60 * 1000

        // update last candle
        if (now - last.time < ONE_MIN) {
            last.close = price
            last.high = Math.max(last.high, price)
            last.low = Math.min(last.low, price)

            // trigger rerender
            setData([...data])
            return
        }

        // append new candle
        data.push({
            time: now,
            open: last.close,
            high: price,
            low: price,
            close: price,
            volume: 0
        })

        // keep only latest totalNumberOfEntries (i.e 288 entires of 5min intervals as of now) entries
        const sliced = data.slice(-totalNumberOfEntries)

        setData([...sliced])
    }, [selectedTicker, data, setData, isTabVisible])

    // subscribe to live ticker updates
    useEffect(() => {
        if (!wsConnection || chartPeriod !== HISTORY_PERIOD_1D) return

        wsConnection.addEventListener("message", onLiveTickerUpdateHandler)
        return () => {
            wsConnection.removeEventListener("message", onLiveTickerUpdateHandler)
        }
    }, [wsConnection, onLiveTickerUpdateHandler, chartPeriod])

    return {
        selectedTicker: selectedTicker!,
        chartData: data,
        chartError: error,
        chartType: chartType,
        chartIsLoading: loading,
        chartPeriod: chartPeriod,
        onChartTypeClickHandler,
        onChartPeriodClickHandler,
    }
}

export default useVisualization