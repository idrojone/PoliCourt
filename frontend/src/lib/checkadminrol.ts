import { type User } from "../features/auth/types";

const checkAdminRole = (user: User | null) => {
    if (!user) {
        return false;
    }
    try {
        return user.role.includes("ADMIN") ?? false; 
    } catch (error) {
        console.error("Error checking admin role:", error);
        return false;
    }
};

export default checkAdminRole;