import { useCallback, useEffect } from "react";

import useFetch from "./useFetch";

import { useAppStore } from "@/store/app";
import { useWSStore } from "@/store/websocket";

import {
    API_SUB_PATHS,
    HTTP_BASE_PATH,
    WEBSOCKET_EVENTS,
} from "@/constants/constants"

type UseDashboardScreenProps = () => {
    tickerData: TickerResponseItem[],
    selectedTicker: string,
    tickerIsLoading: boolean,
    onTickerClickHandler: (symbol: string) => void
}

const useDashboardScreen: UseDashboardScreenProps = () => {
    // websocket connection setup
    // only establish connection when the dashboard actually loads
    // not on <App /> load, because we dont need this data on <LoginScreen />, save network bandwidth also, reduce load on the server etc
    const connectWS = useWSStore(state => state.connect)
    const isWSConnected = useWSStore(state => state.isConnected)
    const addEventListenerWS = useWSStore(state => state.addEventListener)
    const removeEventListenerWS = useWSStore(state => state.removeEventListener)
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
    } = useFetch<Map<string, TickerResponseItem>, TickerResponseItem[]>(`${HTTP_BASE_PATH}${API_SUB_PATHS.STATIC_TICKERS}`, new Map<string, TickerResponseItem>(),
        (result) => {
            const newMap = new Map<string, TickerResponseItem>()

            result.forEach((element) => {
                newMap.set(element.symbol, element)
            });

            // selecting first ticker as selected ticker
            setSelectedTicker(result[0].symbol)

            return newMap;
        })

    const selectedTicker = useAppStore(state => state.selectedTicker)
    const setSelectedTicker = useAppStore(state => state.setSelectedTicker)

    const onTickerClickHandler = (symbol: string) => {
        if (tickerIsLoading) return

        setSelectedTicker(symbol)
    }

    // handler to update data on each message received from the websocket connection
    const onLiveTickerUpdateHandler = useCallback((event: MessageEvent) => {
        const message: WebsockerMessageType = JSON.parse(event.data);

        if (message.type !== WEBSOCKET_EVENTS.TICKER_UPDATE) return;

        const newMap = new Map(
            message.data.map((ticker) => [
                ticker.symbol,
                ticker
            ])
        );

        setTickerData(newMap);
    }, [])

    useEffect(() => {
        if (!isWSConnected) return;

        addEventListenerWS("message", onLiveTickerUpdateHandler);
        return () => {
            removeEventListenerWS("message", onLiveTickerUpdateHandler);
        };
    }, [isWSConnected, onLiveTickerUpdateHandler]);

    return {
        tickerData: tickerData != null ? Array.from(tickerData.values()) : [],
        selectedTicker,
        tickerIsLoading,
        onTickerClickHandler
    }
}

export default useDashboardScreen