import type { GeneralStatusType } from "@/types";

export const UserRole = {
    ADMIN: "ADMIN",
    USER: "USER",
    COACH: "COACH",
    MONITOR: "MONITOR",
    CLUB_ADMIN: "CLUB_ADMIN",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string; // Date string
    gender?: string;
    avatarUrl?: string;
    role: UserRoleType;
    status: GeneralStatusType;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt?: string;
    createdAt: string;
}
