import { useNavigate } from "react-router-dom";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";

import { useAuthStore } from "@/store/auth";
import { APP_ROUTES, STATICS } from "@/constants/constants";

import type { HeaderProps } from "./Header.props";

const Header = ({ }: HeaderProps) => {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const loginHandler = useAuthStore(state => state.loginHandler);
    const logoutHandler = useAuthStore(state => state.logoutHandler);

    const onLogoutClickHandler = () => {
        logoutHandler()

        navigate(APP_ROUTES.LOGIN_SCREEN, {
            replace: true
        })
    }

    const onLoginClickHandler = () => {
        loginHandler()

        navigate(APP_ROUTES.DASHBOARD_SCREEN, {
            replace: true
        })
    }

    return <header className="flex justify-between items-center p-2 border-b border-[#bdc3c7]">
        <p className="font-bold">
            {STATICS.APP_TITLE}
        </p>
        {
            isLoggedIn
                ? <button onClick={onLogoutClickHandler} title="logout" className="cursor-pointer"><IoMdLogOut size={20} /></button>
                : <button onClick={onLoginClickHandler} title="login" className="cursor-pointer"><IoMdLogIn size={20} /></button>
        }
    </header>
}

export default Header