import { Link } from "react-router-dom";
import { Home } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../mode-toggle";
// import type { User } from '@/features/auth/types';
import { DashboardMenu } from "./dashboard-menu";

export interface LeftMenuProps {
  // user?: User | null;
  logout: () => void;
}

export function LeftMenu() {
  // const initials = user ? user.fullName.split(' ').map(n => n[0]).slice(0,2).join('') : 'U';
  // const avatarSrc = (user as any)?.profile?.avatar as string | undefined;

  return (
    <div className="flex h-screen w-64 flex-col bg-background text-foreground border-r border-border">
      {/* <Logo /> */}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <DashboardMenu />
      </div>

      <Separator />

      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          {/*<Avatar className="h-10 w-10">
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={user?.fullName ?? "User"} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 text-sm">
            <p className="font-medium">{user?.fullName ?? "Preferencias"}</p>
          </div>*/}
          <ModeToggle />
        </div>

        <div className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>Ir al Inicio</span>
          </Link>
          {/*<button
            onClick={logout}
            aria-label="Cerrar sesión"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>*/}
        </div>
      </div>
    </div>
  );
}
