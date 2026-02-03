import { useQuery } from "@tanstack/react-query";
import { getSportsActivePublished } from "../service/sport.fa.service";

export const useSportsActivePublishedQuery = () => {
    return useQuery({
        queryKey: ["sports-active-published"],
        queryFn: () => getSportsActivePublished(),
    }); 
}