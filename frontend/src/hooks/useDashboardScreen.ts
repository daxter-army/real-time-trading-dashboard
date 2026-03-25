import { useCallback, useEffect } from "react";

import useFetch from "./useFetch";

import { useAppStore } from "@/store/app";
import { useWSStore } from "@/store/websocket";

import {
    API_SUB_PATHS,
    HTTP_BASE_PATH,
    WEBSOCKET_EVENTS,
} from "@/constants/constants"

type useDashboardScreenProps = {
    tickerData: any,
    selectedTicker: any,
    tickerIsLoading: any,
    onTickerClickHandler: (symbol: string) => void
}

const useDashboardScreen = (): useDashboardScreenProps => {
    // websocket connection setup
    // only establish connection when the dashboard actually loads
    // not on <App /> load, because we dont need this data on <LoginScreen />, save network bandwidth also, reduce load on the server etc
    const connectWS = useWSStore(state => state.connect)
    const wsConnection = useWSStore(state => state.socket)
    const disconnectWS = useWSStore(state => state.disconnect)

    useEffect(() => {
        connectWS()

        return () => {
            disconnectWS()
        }
    }, [])

    // initial api call to get list of all available tickers
    const {
        data: tickerData,
        setData: setTickerData,
        loading: tickerIsLoading,
    } = useFetch(
        `${HTTP_BASE_PATH}${API_SUB_PATHS.STATIC_TICKERS}`,
        new Map(),
        (result) => {
            const newMap = new Map()

            result.forEach((element: any) => {
                newMap.set(element.symbol, element)
            });

            // selecting first ticker as selected ticker
            setSelectedTicker(result[0].symbol)

            return newMap;
        })

    const isTabVisible = useAppStore(state => state.isTabVisible)
    const selectedTicker = useAppStore(state => state.selectedTicker)
    const setSelectedTicker = useAppStore(state => state.setSelectedTicker)

    const onTickerClickHandler = (symbol: string) => {
        if (tickerIsLoading) return

        setSelectedTicker(symbol)
    }

    // handler to update data on each message received from the websocket connection
    const onLiveTickerUpdateHandler = useCallback((event: MessageEvent) => {
        if (!isTabVisible) return

        const message = JSON.parse(event.data);

        if (message.type !== WEBSOCKET_EVENTS.TICKER_UPDATE) return;

        const newMap = new Map(
            message.data.map((ticker: any) => [
                ticker.symbol,
                ticker
            ])
        );

        setTickerData(newMap);
    }, [])

    useEffect(() => {
        if (!wsConnection || tickerIsLoading) return;

        wsConnection.addEventListener("message", onLiveTickerUpdateHandler);
        return () => {
            wsConnection.removeEventListener("message", onLiveTickerUpdateHandler);
        };

    }, [wsConnection, tickerIsLoading, onLiveTickerUpdateHandler]);

    return {
        tickerData,
        selectedTicker,
        tickerIsLoading,
        onTickerClickHandler
    }
}

export default useDashboardScreen