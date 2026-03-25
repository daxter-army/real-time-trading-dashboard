import clsx from "clsx"

import Skeleton from "@/components/Skeleton/Skeleton"

import TickerLoader from "./TickerLoader"
import type { TickerProps } from "./Ticker.props"

const Ticker = ({ data, isLoading, onTickerClickHandler, selectedSymbol }: TickerProps) => {
    return <div className="p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {
            isLoading
                ? <TickerLoader />
                : Array.from(data.values()).map(item => {
                    return <button
                        key={item.symbol}
                        onClick={() => onTickerClickHandler(item.symbol)}
                        className={clsx("p-2 font-bold border border-[#95a5a6] rounded-sm cursor-pointer items-center flex flex-1 gap-2 hover:border-[#3498db]", { 'border-[#3498db] bg-[#3498db] text-white': selectedSymbol === item.symbol })}>
                        {item.symbol}
                        {
                            item.price.length === 0
                                ? <Skeleton customClassNames="w-18 h-5" />
                                : <span className="font-normal">{Number(item.price).toFixed(2)}</span>
                        }
                    </button>
                })
        }
    </div>
}

export default Ticker