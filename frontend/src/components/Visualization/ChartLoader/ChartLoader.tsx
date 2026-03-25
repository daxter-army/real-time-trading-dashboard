import Spinner from "@/components/Loaders/Spinner/Spinner"

const ChartLoader = () => {
    return <div className="absolute h-100 inset-0 flex items-center justify-center bg-white/30 backdrop-blur-xs z-50">
        <Spinner />
    </div>
}

export default ChartLoader