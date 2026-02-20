import { Navigate, Outlet } from "react-router-dom";
import type { AdminOnlyProps } from "./types/AdminOnlyProps";
import { useAuth } from "@/features/auth/context/AuthContext";

export const AdminOnly = ({
    redirectPath = "/",
    children,
}: AdminOnlyProps) => {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    if (!isAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;
}