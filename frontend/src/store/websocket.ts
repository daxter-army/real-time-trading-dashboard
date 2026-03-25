import { create } from "zustand"
import { API_SUB_PATHS, WS_BASE_PATH } from "@/constants/constants"

type WSStore = {
    socket: WebSocket | null
    connect: () => void
    disconnect: () => void
}

export const useWSStore = create<WSStore>((set) => {
    // internal ref to track the WebSocket safely
    let socketRef: WebSocket | null = null

    return {
        socket: null,

        connect: () => {
            // if socket is already open, do nothing
            if (socketRef && socketRef.readyState === WebSocket.OPEN) return

            socketRef = new WebSocket(WS_BASE_PATH + API_SUB_PATHS.LIVE_TICKERS)

            socketRef.onopen = () => {
                console.log("live ticker websocket connection established")
                set({ socket: socketRef })
            }

            socketRef.onerror = (error) => {
                console.error("live ticker websocket connection error:", error)
            }

            socketRef.onclose = () => {
                console.log("live ticker websocket connection closed")
                set({ socket: null })
                socketRef = null
            }

            set({ socket: socketRef })
        },

        disconnect: () => {
            if (socketRef && socketRef.readyState === WebSocket.OPEN) {
                console.log("live ticker websocket connection disconnecting...")
                socketRef.close()
                socketRef = null
                set({ socket: null })
            }
        }
    }
})