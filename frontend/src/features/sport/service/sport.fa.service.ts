import { api } from "@/lib/axios.fa";

export const getSportsActivePublished = async () => {
  return await api
    .get("/sports/active-published")
    .then((res) => res.data.data);
}

export const getSportsSlugs = async () => {
  return await api
    .get("/sports/slugs")
    .then((res) => res.data.data);
}