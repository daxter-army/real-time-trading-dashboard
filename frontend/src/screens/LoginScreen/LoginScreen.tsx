import { Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth";

import { APP_ROUTES, STATICS } from "@/constants/constants";

import type { LoginScreenProps } from "./LoginScreen.props";

const LoginScreen = ({ }: LoginScreenProps) => {
    const navigate = useNavigate();

    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const loginHandler = useAuthStore(state => state.loginHandler);

    if (isLoggedIn) {
        return <Navigate to={APP_ROUTES.DASHBOARD_SCREEN} replace />
    }

    const onLoginClickHandler = () => {
        loginHandler()

        navigate(APP_ROUTES.DASHBOARD_SCREEN, {
            replace: true
        })
    }

    return <main className="text-center">
        <div className="mt-8">
            <p>{STATICS.LOGIN_MANDATE}</p>
            <br />
            <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-sm py-1 px-3 cursor-pointer" onClick={onLoginClickHandler}>login</button>
        </div>
    </main>
}

export default LoginScreen