import { api } from "@/lib/axios";

import type { Sport } from "../types";

export const getSports = async (params?: Record<string, any>): Promise<Sport[]> => {
    const response = await api.get<Sport[]>("/api/sports", { params });
    return response.data;
};