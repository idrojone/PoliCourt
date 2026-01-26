export const USER_ROLES = [
  "ADMIN",
  "USER",
  "COACH",
  "MONITOR",
  "CLUB_ADMIN",
] as const;
export type UserRole = (typeof USER_ROLES)[number];
