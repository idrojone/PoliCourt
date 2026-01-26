export const USER_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
] as const;
export type UserStatus = (typeof USER_STATUSES)[number];
