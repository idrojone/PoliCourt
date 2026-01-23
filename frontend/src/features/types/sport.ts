import type { ApiResponse, GeneralStatus } from "@/types";

// "name": "Fútbol",
// "slug": "futbol",
// "description": "string",
// "imgUrl": "string",
// "status": "PUBLISHED",
// "isActive": true
export interface Sport {
  name: string;
  slug: string;
  description: string;
  imgUrl: string;
  status: typeof GeneralStatus;
  isActive: boolean;
}
export type SportResponse = ApiResponse<Sport>;
