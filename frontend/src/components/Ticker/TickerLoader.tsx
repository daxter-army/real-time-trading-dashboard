import Skeleton from "@/components/Skeleton/Skeleton"

import { TICKER_LOADER_SKELETON_QTY } from "@/constants/constants"

const TickerLoader = () => {
    return Array(TICKER_LOADER_SKELETON_QTY).fill(0).map((_, i) => <Skeleton key={i} customClassNames="w-full h-11" />)

}

export default TickerLoader