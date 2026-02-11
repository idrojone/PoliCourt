import type { Booking } from "./Booking";

export interface SortObject {
    direction?: string;
    nullHandling?: string;
    ascending?: boolean;
    property?: string;
    ignoreCase?: boolean;
}

export interface PageableObject {
    offset?: number;
    sort?: SortObject[];
    pageNumber?: number;
    pageSize?: number;
    unpaged?: boolean;
    paged?: boolean;
}

export interface PageBookingResponse {
    totalPages: number;
    totalElements: number;
    size: number;
    content: Booking[];
    number: number;
    sort?: SortObject[];
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    pageable?: PageableObject;
    empty?: boolean;
}
