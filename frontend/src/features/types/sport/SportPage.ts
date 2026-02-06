import type { Sport } from "./Sport";

export interface PageableObject {
  offset?: number;
  pageSize?: number;
  pageNumber?: number;
  paged?: boolean;
  unpaged?: boolean;
}

export interface SortObject {
  direction?: string;
  property?: string;
  ascending?: boolean;
  ignoreCase?: boolean;
}

export interface PageSportResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  size: number;
  content: Sport[];
  number: number;
  sort?: SortObject[];
  pageable?: PageableObject;
  empty?: boolean;
}

export interface ApiPageSportResponse {
  success: boolean;
  message?: string;
  data: PageSportResponse;
  timestamp?: string;
}
