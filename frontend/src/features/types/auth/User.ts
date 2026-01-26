// "username": "john.doe",
// "email": "john.doe@example.com",
// "firstName": "John",
// "lastName": "Doe",
// "phone": "+1234567890",
// "imgUrl": "https://www.gravatar.com/avatar/8eb1b522f60d11fa897de1dc6351b7e8?s=200&d=identicon&r=g",
// "role": "ADMIN",
// "status": "PUBLISHED",
// "isActive": true

import type { ApiResponse } from "@/types";

export interface UserForAdmin {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  imgUrl: string;
  role: string;
  status: string;
  isActive: boolean;
}

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  imgUrl: string;
}
export type UserForAdminResponse = ApiResponse<UserForAdmin>;
export type UserResponse = ApiResponse<User>;
