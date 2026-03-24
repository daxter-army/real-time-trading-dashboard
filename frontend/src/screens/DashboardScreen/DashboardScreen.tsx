import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

import Ticker from "@/components/Ticker/Ticker"
import Visualization from "@/components/Visualization/Visualization"

import useLocalStorage from "@/hooks/useLocalStorage"

import {
    APP_ROUTES,
    WS_BASE_PATH,
    API_SUB_PATHS,
    HTTP_BASE_PATH,
    LOCAL_STORAGE_KEYS,
} from "@/constants/constants"

import type { DashboardScreenProps } from "./DashboardScreen.props"

const DashboardScreen = ({ }: DashboardScreenProps) => {
    const { get } = useLocalStorage<boolean>(LOCAL_STORAGE_KEYS.USER_LOGGED_IN)
    const isLoggedIn = get()

    if (!isLoggedIn) {
        return <Navigate to={APP_ROUTES.LOGIN_SCREEN} replace />
    }

    const [selectedTicker, setSelectedTicker] = useState<null | string>(null)

    const [tickerData, setTickerData] = useState(new Map())
    const [tickerError, setTickerError] = useState(false)
    const [tickerIsLoading, setTickerIsLoading] = useState(true)

    const fetchTickerData = async () => {
        const apiData = await fetch(HTTP_BASE_PATH + API_SUB_PATHS.STATIC_TICKERS)
        const parseApiData = await apiData.json()

        const newMap = new Map()
        parseApiData.forEach(element => {
            newMap.set(element.symbol, element)
        });

        setTickerData(newMap)
        setSelectedTicker(parseApiData[0].symbol)
        setTickerIsLoading(false)
    }

    useEffect(() => {
        fetchTickerData()
    }, [])

    useEffect(() => {
        if (tickerIsLoading || tickerData.size === 0) return;

        const ws = new WebSocket(
            WS_BASE_PATH + API_SUB_PATHS.LIVE_TICKERS
        );

        ws.onmessage = (event) => {
            const tickers = JSON.parse(event.data);

            const newMap = new Map(
                tickers.map((ticker: any) => [
                    ticker.symbol,
                    ticker
                ])
            );

            setTickerData(newMap);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            ws.close();
        };

    }, [tickerIsLoading]);

    const onTickerClick = (symbol: string) => {
        if (tickerIsLoading) return

        setSelectedTicker(symbol)
    }

    return <>
        <Ticker
            data={tickerData}
            onClick={onTickerClick}
            isLoading={tickerIsLoading}
            selectedSymbol={selectedTicker}
        />
        <main>
            {selectedTicker && <Visualization symbol={selectedTicker} />}
        </main>
    </>
}

export default DashboardScreen