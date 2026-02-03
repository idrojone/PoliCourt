import { api } from "@/lib/axios.fa";

export const getActivePublishedUsers = async () => {
  return await api
    .get("/users/active-published")
    .then((res) => res.data.data);
}


