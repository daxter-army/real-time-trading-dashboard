import { API_SUB_PATHS, WS_BASE_PATH } from "@/constants/constants"
import { create } from "zustand"

type WSStore = {
    socket: WebSocket | null
    connect: () => void
    disconnect: () => void
}

export const useWSStore = create<WSStore>((set, get) => ({
    socket: null,
    connect: () => {
        // socket connection already exists
        if (get().socket) return

        const ws = new WebSocket(
            WS_BASE_PATH + API_SUB_PATHS.LIVE_TICKERS
        )

        ws.onopen = () => {
            console.log("live ticker websocket connection established")
        }

        ws.onerror = (error) => {
            console.error("live ticker websocket connection error:", error);
        };

        ws.onclose = () => {
            console.log("live ticker websocket connection closed")

            set({ socket: null })
        }

        set({ socket: ws })
    },

    disconnect: () => {
        console.log("live ticker websocket connection disconnecting...")

        get().socket?.close()
        set({ socket: null })
    }
}))