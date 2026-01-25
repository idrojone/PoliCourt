import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateCourt } from "../service/court.sp.service";
import type { Court } from "@/features/types/court/Court";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";

export const useCourtUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Court,
    AxiosError<{ message: string }>,
    { slug: string; payload: Partial<CreateCourtDTO> }
  >({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Partial<CreateCourtDTO>;
    }) => updateCourt(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts-all"] });
    },
  });
};
