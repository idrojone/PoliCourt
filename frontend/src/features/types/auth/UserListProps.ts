import type { UserForAdmin } from "./User";

export interface UsersListProps {
  users?: UserForAdmin[];
  isLoading: boolean;
  isError: boolean;
  error: any;
}
