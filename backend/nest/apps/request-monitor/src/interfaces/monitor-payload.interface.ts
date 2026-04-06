export interface CreateMonitorPayload {
    email: string;
    description: string;
    documents: string[];
}

export interface PaginationPayload {
    page?: number;
    limit?: number;
}

export interface GetMonitorApplicationsPayload extends PaginationPayload {
    email: string;
}

export interface GetAllMonitorApplicationsPayload extends PaginationPayload {
    email?: string;
    status?: string;
}