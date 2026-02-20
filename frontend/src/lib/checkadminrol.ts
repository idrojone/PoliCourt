import type { AuthResponse } from "@/features/types/auth/auth";

const checkAdminRole = (user: AuthResponse | null) => {
    if (!user) {
        return false;
    }
    try {
        return user.role?.includes("ADMIN") ?? false;
    } catch (error) {
        console.error("Error checking admin role:", error);
        return false;
    }
};

export default checkAdminRole;