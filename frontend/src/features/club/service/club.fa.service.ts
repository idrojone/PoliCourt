import type { GetClubsParams } from "@/features/types/club/GetClubsParams"
import { api } from "@/lib/axios.fa"

export const getClubs = async (params: Partial<GetClubsParams>) => {
    return await api.get('/clubs', { params }).then((response) => response.data.data)
}