import type { ApiResponse, GeneralStatusType } from "@/types";

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
  status: GeneralStatusType;
  isActive: boolean;
}
export type SportResponse = ApiResponse<Sport>;
