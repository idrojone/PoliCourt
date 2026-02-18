import { ClubStatus } from "./Club";

export interface GetClubsParams {
    name?: string;
    status?: ClubStatus;
    sports?: string[]; // slugs
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
}
