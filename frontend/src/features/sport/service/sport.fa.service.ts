import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";
import { api } from "@/lib/axios.fa";

export const getSportsActivePublished = async (params: Partial<GetSportsParams>) => {
    return await api
        .get("/sports")
        .then((res) => res.data.data);
}

export const getSportSlugs = async () => {
    return await api
        .get("/sports/list")
        .then((res) => res.data.data);
}