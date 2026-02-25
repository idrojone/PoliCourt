import { api } from "@/lib/axios.fa";

export const getUser = async (username: string) => {
    return await api.get(`/users/${username}`).then((res) => res.data.data);
}

export const getUserCount = async () => {
    return await api.get(`/users/count`).then((res) => res.data.data);
}