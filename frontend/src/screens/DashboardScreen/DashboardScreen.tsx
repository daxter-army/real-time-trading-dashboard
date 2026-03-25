import { Fragment } from "react"
import { Navigate } from "react-router-dom"

import Ticker from "@/components/Ticker/Ticker"
import Visualization from "@/components/Visualization/Visualization"

import useDashboardScreen from "@/hooks/useDashboardScreen"

import { useAuthStore } from "@/store/auth"

import { APP_ROUTES } from "@/constants/constants"

import type { DashboardScreenProps } from "./DashboardScreen.props"

const DashboardScreen = ({ }: DashboardScreenProps) => {
    // login checks
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to={APP_ROUTES.LOGIN_SCREEN} replace />
    }

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
                <Visualization symbol={selectedTicker} />
            </main>
        }
    </Fragment>
}

export default DashboardScreen