import type { ApiResponse } from "@/types";
// import { exactOptional } from "zod";

// Register
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
}

export interface RegisterData {
    message: string;
}

export type RegisterResponse = ApiResponse<RegisterData>;

// Login
export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginUserResponseData {
    accessToken: string;
    refreshToken: string;
    user: User & {
        status?: string | null;
        profile?: Record<string, unknown> | null;
        lastLogin?: string | null;
        isActive?: boolean | null;
        clubId?: string | null;
        role?: string | null;
        clubName?: string | null;
        createdAt?: string;
        updatedAt?: string | null;
    };
}

export type LoginUserResponse = ApiResponse<LoginUserResponseData>;


export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: ("ADMIN" | "PLAYER" | "STAFF" | "CLUB_ADMIN")[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    role: User['role'];
} 