import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserForAdmin } from "@/features/types/auth/User";
import { type UserRole, USER_ROLES } from "@/features/types/auth/UserRole";
import {
  type UserStatus,
  USER_STATUSES,
} from "@/features/types/auth/UserStatus";
import { useUpdateUserRole } from "../mutations/useUpdateUserRoleMutation";
import { useUpdateUserStatus } from "../mutations/useUpdateUserStatusMutation";
import { useToggleUserActive } from "../mutations/useToggleUserActiveMutation";
import { cn } from "@/lib/utils";

interface UserRowProps {
  user: UserForAdmin;
}

const roleColorMap: Record<UserRole, string> = {
  ADMIN: "border-purple-600 text-purple-700 bg-purple-50",
  USER: "border-blue-500 text-blue-700 bg-blue-50",
  COACH: "border-yellow-500 text-yellow-700 bg-yellow-50",
  MONITOR: "border-yellow-500 text-yellow-700 bg-yellow-50",
  CLUB_ADMIN: "border-indigo-600 text-indigo-700 bg-indigo-50",
};

const statusColorMap: Record<UserStatus, string> = {
  PUBLISHED: "border-green-500 text-green-700 bg-green-50",
  DRAFT: "border-gray-500 text-gray-700 bg-gray-50",
  ARCHIVED: "border-orange-500 text-orange-700 bg-orange-50",
  SUSPENDED: "border-red-600 text-red-700 bg-red-50",
};

export const UserRow = ({ user }: UserRowProps) => {
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus();
  const { mutate: toggleActive, isPending: isTogglingActive } =
    useToggleUserActive();

  const handleRoleChange = (role: UserRole) => {
    updateRole({ username: user.username, role: role as UserRole });
  };

  const handleStatusChange = (status: UserStatus) => {
    updateStatus({ username: user.username, status: status as UserStatus });
  };

  const handleToggleActive = () => {
    toggleActive(user.username);
  };

  const isProcessing = isUpdatingRole || isUpdatingStatus || isTogglingActive;

  return (
    <TableRow key={user.username} className={isProcessing ? "opacity-50" : ""}>
      <TableCell>
        <Avatar>
          <AvatarImage src={user.imgUrl} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>

      {/* Columna ROL */}
      <TableCell>
        <Select
          onValueChange={handleRoleChange}
          defaultValue={user.role}
          disabled={isProcessing}
        >
          <SelectTrigger
            className={cn(
              "w-35 border-2 font-medium transition-colors h-9",
              roleColorMap[user.role],
            )}
          >
            <SelectValue>{user.role}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <Select
          onValueChange={handleStatusChange}
          defaultValue={user.status}
          disabled={isProcessing}
        >
          <SelectTrigger
            className={cn(
              "w-[140px] border-2 font-medium transition-colors h-9",
              statusColorMap[user.status],
            )}
          >
            <SelectValue>{user.status}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {USER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <Button
          onClick={handleToggleActive}
          className={cn(
            "w-28",
            user.isActive
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white",
          )}
          disabled={isProcessing}
          size="sm"
        >
          {user.isActive ? "Activado" : "Desactivado"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
