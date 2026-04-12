import { create } from "zustand"
import { API_SUB_PATHS, WS_BASE_PATH } from "@/constants/constants"

type WSStore = {
    isConnected: boolean
    connect: () => void
    disconnect: () => void
    addEventListener: <K extends keyof WebSocketEventMap>(
        type: K,
        callbackFn: (event: WebSocketEventMap[K]) => void
    ) => void
    removeEventListener: <K extends keyof WebSocketEventMap>(
        type: K,
        callbackFn: (event: WebSocketEventMap[K]) => void
    ) => void
}

export const useWSStore = create<WSStore>((set) => {
    // internal ref to track the WebSocket safely
    let socketRef: WebSocket | null = null

    return {
        isConnected: false,
        connect: () => {
            // if socket is already open, do nothing
            if (socketRef && socketRef.readyState === WebSocket.OPEN) return

            socketRef = new WebSocket(WS_BASE_PATH + API_SUB_PATHS.LIVE_TICKERS)

            socketRef.onopen = () => {
                console.log("live ticker websocket connection established")

                set({ isConnected: true })
            }

            socketRef.onerror = (error) => {
                console.error("live ticker websocket connection error:", error)
            }

            socketRef.onclose = () => {
                console.log("live ticker websocket connection closed")

                socketRef = null
                set({ isConnected: false })
            }
        },
        disconnect: () => {
            if (socketRef && socketRef.readyState === WebSocket.OPEN) {
                console.log("live ticker websocket connection disconnecting...")

                socketRef.close()
                socketRef = null
                set({ isConnected: false })
            }
        },
        addEventListener: (type, callbackFn) => {
            if (!socketRef) return

            socketRef.addEventListener(type, callbackFn)
        },
        removeEventListener: (type, callbackFn) => {
            if (!socketRef) return

            socketRef.removeEventListener(type, callbackFn)
        },
    }
})