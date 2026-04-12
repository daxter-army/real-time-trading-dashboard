import { create } from "zustand"

type AppStore = {
    selectedTicker: string,
    setSelectedTicker: (ticker: string) => void,
}

export const useAppStore = create<AppStore>((set) => ({
    selectedTicker: "",
    setSelectedTicker: (ticker: string) => {
        set({ selectedTicker: ticker })
    }
}))