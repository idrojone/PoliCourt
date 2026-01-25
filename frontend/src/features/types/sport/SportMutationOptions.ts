import type { AxiosError } from "axios";
import type { Sport } from "./Sport";

export interface SportMutationOptions<TVariables> {
  onSuccess?: (data: Sport, variables: TVariables, context: unknown) => void;
  onError?: (
    error: AxiosError<{ message: string }>,
    variables: TVariables,
    context: unknown,
  ) => void;
}
