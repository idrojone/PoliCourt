import type { GeneralStatusType } from "@/types";

export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string; // date-time
    gender?: string;
    avatarUrl?: string;
    password?: string;
}

export interface UserStatusUpdateRequest {
    status: GeneralStatusType;
}

export interface UserRoleUpdateRequest {
    role: string; // "ADMIN" | "USER" | "COACH" | "MONITOR" | "CLUB_ADMIN"
}
