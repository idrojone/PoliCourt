import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLogoutMutation } from "@/features/auth/mutations/useLogoutMutation";

export const UserMenu = () => {
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();

  if (!user) return null;

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // We are currently falling back to username since AuthResponse might not have firstName or lastName populated initially from endpoints yet.
  const displayName = user.username || "Usuario";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className={`${getAvatarColor(user.username || "u")} text-white`}>
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user.username}
            </p>
            {user.email && (
                <p className="text-xs leading-none text-muted-foreground">
                {user.email}
                </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to={`/profile/${user.username}`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>

        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Panel Admin</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{logoutMutation.isPending ? "Cerrando..." : "Cerrar sesión"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
