import { STATICS } from "@/constants/constants";
import { MdErrorOutline } from "react-icons/md";

const ChartError = () => {
    return <div className="mx-2 rounded-sm h-100 inset-0 flex items-center gap-1 justify-center border border-[#95a5a6]">
        <MdErrorOutline size={24} />
        <span className="font-medium">{STATICS.ERROR_TITLE}</span>
    </div>
}

export default ChartError