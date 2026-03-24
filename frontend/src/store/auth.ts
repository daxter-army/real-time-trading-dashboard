import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LOCAL_STORAGE_KEYS } from "@/constants/constants";

type AuthState = {
    isLoggedIn: boolean;
    loginHandler: () => void;
    logoutHandler: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            loginHandler: () =>
                set({
                    isLoggedIn: true
                }),
            logoutHandler: () =>
                set({
                    isLoggedIn: false,
                }),
        }),
        {
            name: LOCAL_STORAGE_KEYS.USER_LOGGED_IN,
        }
    )
);