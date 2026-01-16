import type { ApiResponse } from "@/types";

export interface Sport {
    slug: string;
    name: string;
    description: string;
    image: string;
}


export type SportsResponse = ApiResponse<Sport[]>;
