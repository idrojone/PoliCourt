export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  familyId?: string;
  username?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
}
