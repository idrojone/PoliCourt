import { Navigate, Outlet } from "react-router-dom";
import type { AdminOnlyProps } from "./types/AdminOnlyProps";

export const AdminOnly= ({
    isAdmin,
    redirectPath = "/",
    children,
}: AdminOnlyProps) => {
    if (!isAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;

}