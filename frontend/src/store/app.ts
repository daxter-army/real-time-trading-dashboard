import { create } from "zustand"

type AppStore = {
    selectedTicker: string | null,
    setSelectedTicker: (ticker: string) => void,
    isTabVisible: boolean,
    setIsTabVisible: (isTabVisible: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
    selectedTicker: null,
    setSelectedTicker: (ticker: string) => {
        set({ selectedTicker: ticker })
    },
    isTabVisible: true,
    setIsTabVisible: (isTabVisible: boolean) => {
        set({ isTabVisible })
    }
}))