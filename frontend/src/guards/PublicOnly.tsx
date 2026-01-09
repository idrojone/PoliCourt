import { Navigate, Outlet } from "react-router-dom";
import { type PublicOnlyProps } from "./types/PublicOnlyProps";

export const PublicOnly = ({
  isAuthenticated,
  redirectPath = "/",
  children,
}: PublicOnlyProps) => {

    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;
};