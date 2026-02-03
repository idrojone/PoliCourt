import type { Court } from "@/features/types/court/Court"
import { api } from "@/lib/axios.fa"
import { mapCourtFromApi } from "./courtMapper"



export const getCourts = async (): Promise<Court[]> => {
    return await api
      .get("/courts")
      .then((res) => res.data.data.map(mapCourtFromApi))
}

export const getCourtsActivePublished = async (): Promise<Court[]> => {
    return await api
        .get("courts/active-published")
        .then((res) => res.data.data.map(mapCourtFromApi))
}