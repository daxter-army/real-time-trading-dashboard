import { useAuthStore } from "@/store/auth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute