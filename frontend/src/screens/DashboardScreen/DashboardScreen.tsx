import { Fragment, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"

import Ticker from "@/components/Ticker/Ticker"
import Visualization from "@/components/Visualization/Visualization"

import useDashboardScreen from "@/hooks/useDashboardScreen"

import { useAuthStore } from "@/store/auth"

import { APP_ROUTES } from "@/constants/constants"

import type { DashboardScreenProps } from "./DashboardScreen.props"

const DashboardScreen = ({ }: DashboardScreenProps) => {
    // login checks
    const navigate = useNavigate()
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate(APP_ROUTES.LOGIN_SCREEN, { replace: true })
        }
    }, [isLoggedIn, navigate])

    const {
        tickerData,
        tickerIsLoading,
        selectedTicker,
        onTickerClickHandler
    } = useDashboardScreen()

    return <Fragment>
        <Ticker
            data={tickerData}
            isLoading={tickerIsLoading}
            selectedSymbol={selectedTicker}
            onTickerClickHandler={onTickerClickHandler}
        />
        {
            selectedTicker && <main>
                <Visualization />
            </main>
        }
    </Fragment>
}

export default DashboardScreen