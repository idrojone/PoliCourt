import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import type { User } from "@/features/types/user/User";
import { GeneralStatus, type GeneralStatusType } from "@/types";
import { useUserToggleActiveMutation } from "../mutations/useUserToggleActiveMutation";
import { useUserStatusMutation } from "../mutations/useUserStatusMutation";
import { useUserRoleMutation } from "../mutations/useUserRoleMutation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/features/types/user/User";
import { cn } from "@/lib/utils";

interface UserListProps {
    users: User[];
    sort: string;
    onSort: (sort: string) => void;
}

export const UserList = ({ users, sort, onSort }: UserListProps) => {
    const toggleActiveMutation = useUserToggleActiveMutation();
    const statusMutation = useUserStatusMutation();
    const roleMutation = useUserRoleMutation();

    const handleToggleActive = (user: User) => {
        console.log("handleToggleActive user:", user);
        console.log("Sending username:", user.username);
        toggleActiveMutation.mutate({
            username: user.username,
            isActive: user.isActive,
        });
    };

    const handleStatusChange = (user: User, status: GeneralStatusType) => {
        console.log("handleStatusChange user:", user);
        console.log("Sending username:", user.username);
        statusMutation.mutate({ username: user.username, status });
    };

    const handleRoleChange = (user: User, role: string) => {
        console.log("handleRoleChange user:", user);
        console.log("Sending username:", user.username);
        roleMutation.mutate({ username: user.username, role });
    }


    const getStatusColor = (status: GeneralStatusType) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-green-100 text-green-800";
            case "DRAFT":
                return "bg-gray-100 text-gray-800";
            case "ARCHIVED":
                return "bg-red-100 text-red-800";
            case "SUSPENDED":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const toggleSort = (field: string) => {
        if (sort === `${field}_asc`) {
            onSort(`${field}_desc`);
        } else {
            onSort(`${field}_asc`);
        }
    };

    if (!users.length) {
        return <div className="text-center p-4">No se encontraron usuariosAPI.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Avatar</TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => toggleSort("name")}>
                                Nombre
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => toggleSort("email")}>
                                Email
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => toggleSort("username")}>
                                Username
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Activo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.email}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                                    <AvatarFallback>
                                        {user.firstName?.charAt(0)}
                                        {user.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={user.role}
                                    onValueChange={(val) => handleRoleChange(user, val)}
                                    disabled={roleMutation.isPending}
                                >
                                    <SelectTrigger className="w-[130px] h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(UserRole).map((role) => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={user.status}
                                    onValueChange={(val) => handleStatusChange(user, val as GeneralStatusType)}
                                    disabled={statusMutation.isPending}
                                >
                                    <SelectTrigger
                                        className={cn(
                                            "w-[120px] h-8 border-none",
                                            getStatusColor(user.status)
                                        )}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(GeneralStatus).map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.isActive}
                                    onCheckedChange={() => handleToggleActive(user)}
                                    disabled={toggleActiveMutation.isPending}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => navigator.clipboard.writeText(user.email)}
                                        >
                                            Copiar Email
                                        </DropdownMenuItem>
                                        {/* Add edit user dialog trigger here if needed */}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
