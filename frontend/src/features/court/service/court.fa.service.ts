import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import { api } from "@/lib/axios.fa";

export const getCourts = async (params: Partial<GetCourtsParams> = {}) => {
    return await api
        .get("/courts", { params })
        .then((res) => res.data.data);
}