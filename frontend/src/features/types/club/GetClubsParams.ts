import type { ClubStatus } from "./Club";


export interface GetClubsParams {
    name?: string;
    status?: ClubStatus;
    sportSlugs?: string[]; // slugs
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
}
