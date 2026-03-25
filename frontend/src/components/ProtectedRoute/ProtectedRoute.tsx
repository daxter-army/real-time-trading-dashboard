import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth";
import { APP_ROUTES } from "@/constants/constants";

const ProtectedRoute = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to={APP_ROUTES.LOGIN_SCREEN} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;