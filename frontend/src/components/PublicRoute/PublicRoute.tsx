import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth";

import { APP_ROUTES } from "@/constants/constants";

const PublicRoute = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={APP_ROUTES.DASHBOARD_SCREEN} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;