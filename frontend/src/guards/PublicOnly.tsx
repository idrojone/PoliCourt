import { Navigate, Outlet } from "react-router-dom";
import { type PublicOnlyProps } from "./types/PublicOnlyProps";
import { useAuth } from "@/features/auth/context/AuthContext";

export const PublicOnly = ({
  redirectPath = "/",
  children,
}: PublicOnlyProps) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;
};