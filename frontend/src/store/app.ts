import { create } from "zustand"

type AppStore = {
    selectedTicker: string | null,
    setSelectedTicker: (ticker: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
    selectedTicker: null,
    setSelectedTicker: (ticker: string) => {
        set({ selectedTicker: ticker })
    }
}))