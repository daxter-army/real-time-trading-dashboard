import { useCallback, useEffect, useState } from "react"

import useFetch from "./useFetch";

import { useAppStore } from "@/store/app";
import { useWSStore } from "@/store/websocket";

import { API_SUB_PATHS, HISTORY_PERIOD, HTTP_BASE_PATH, CHART_TYPES, WEBSOCKET_EVENTS } from "@/constants/constants";

import type { CHART_TYPE, HISTORY_PERIOD_TYPE } from "@/types/types";

type useVisualizationProps = () => {
    selectedTicker: string,
    chartData: HistoryApiResponseItem[],
    chartError: Error | null,
    chartIsLoading: boolean,
    chartType: CHART_TYPE,
    chartPeriod: HISTORY_PERIOD_TYPE,
    onChartTypeClickHandler: (toggledChartType: CHART_TYPE) => void,
    onChartPeriodClickHandler: (dataPeriod: HISTORY_PERIOD_TYPE) => void,
}

const useVisualization: useVisualizationProps = () => {
    const isWSConnected = useWSStore(state => state.isConnected)
    const addEventListenerWS = useWSStore(state => state.addEventListener)
    const removeEventListenerWS = useWSStore(state => state.removeEventListener)
    const selectedTicker = useAppStore(state => state.selectedTicker)

    const [chartPeriod, setChartPeriod] = useState<HISTORY_PERIOD_TYPE>(HISTORY_PERIOD["1D"])
    const [chartType, setChartType] = useState<CHART_TYPE>(CHART_TYPES.LINE)

    const queryParams = new URLSearchParams({
        symbol: selectedTicker!,
        period: chartPeriod
    })
    const {
        data,
        setData,
        loading,
        error,
    } = useFetch<HistoryApiResponseItem[], HistoryApiResponseItem[]>(
        `${HTTP_BASE_PATH}${API_SUB_PATHS.PERIODIC_HISTORY}?${queryParams}`,
        [],
        (result) => result
    )

    const onChartPeriodClickHandler = (dataPeriod: HISTORY_PERIOD_TYPE) => {
        setChartPeriod(dataPeriod)
    }

    const onChartTypeClickHandler = (toggledChartType: CHART_TYPE) => {
        setChartType(toggledChartType)
    }

    const onLiveTickerUpdateHandler = useCallback((event: MessageEvent) => {
        const message: WebsockerMessageType = JSON.parse(event.data)
        if (message.type !== WEBSOCKET_EVENTS.TICKER_UPDATE) return

        const ticker = message.data?.find(
            (t) => t.symbol === selectedTicker
        )

        if (!ticker) return

        setData(prevData => {
            if (!prevData?.length) return prevData

            const totalNumberOfEntries = prevData.length

            const price = Number(ticker.price)
            const now = Date.now()

            const last = prevData[totalNumberOfEntries - 1]
            const FIVE_MIN = 5 * 60 * 1000

            let newData = []
            if (now - last.time < FIVE_MIN) {
                // update last candle
                newData = [...prevData]
                const updatedLast = { ...last }

                updatedLast.close = price
                updatedLast.high = Math.max(last.high, price)
                updatedLast.low = Math.min(last.low, price)

                newData[newData.length - 1] = updatedLast
            } else {
                // append new candle
                newData = [...prevData, {
                    time: now,
                    open: last.close,
                    high: price,
                    low: price,
                    close: price,
                    volume: 0
                }]

                newData = newData.slice(-totalNumberOfEntries)
            }

            return newData
        })
    }, [selectedTicker])

    // subscribe to live ticker updates
    useEffect(() => {
        if (!isWSConnected || chartPeriod !== HISTORY_PERIOD["1D"]) return

        addEventListenerWS("message", onLiveTickerUpdateHandler)
        return () => {
            removeEventListenerWS("message", onLiveTickerUpdateHandler)
        }
    }, [isWSConnected, onLiveTickerUpdateHandler, chartPeriod])

    return {
        selectedTicker: selectedTicker,
        chartData: data != null ? data : [],
        chartError: error,
        chartType: chartType,
        chartIsLoading: loading,
        chartPeriod: chartPeriod,
        onChartTypeClickHandler,
        onChartPeriodClickHandler,
    }
}

export default useVisualization