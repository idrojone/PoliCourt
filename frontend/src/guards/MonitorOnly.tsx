import { Navigate, Outlet } from "react-router-dom";
import type { AdminOnlyProps } from "./types/AdminOnlyProps";
import { useAuth } from "@/features/auth/context/AuthContext";

export const MonitorOnly = ({
    redirectPath = "/",
    children,
  
}: AdminOnlyProps) => {
    const { user, isInitializing } = useAuth();
    const isMonitor = user?.role === "MONITOR";
  
    if (isInitializing) {
      return null;
    }

    if (!isMonitor) {
      return <Navigate to={redirectPath} replace />;
    }

    if (children) {
      return <>{children}</>;
    }

    return <Outlet />;
};