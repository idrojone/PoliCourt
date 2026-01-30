import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  CalendarDays,
  CreditCard,
  Dumbbell,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const platformMenuItems = [
  { name: "Calendario", icon: CalendarDays, path: "/dashboard/calendario" },
  { name: "Deportes", icon: Dumbbell, path: "/dashboard/deportes" },
  { name: "Pistas", icon: MapPin, path: "/dashboard/pistas" },
  { name: "Clubes", icon: Building2, path: "/dashboard/clubes" },
  { name: "Usuarios", icon: Users, path: "/dashboard/usuarios" },
  { name: "Pagos", icon: CreditCard, path: "/dashboard/pagos" },
];

const bookingMenuItems = [
  { name: "Alquileres", icon: BookOpen, path: "/dashboard/alquileres" },
  { name: "Clases", icon: GraduationCap, path: "/dashboard/clases" },
  { name: "Entrenamientos", icon: LayoutDashboard, path: "/dashboard/entrenamientos" },
  { name: "Mantenimientos", icon: Wrench, path: "/dashboard/mantenimientos" },
];

export function DashboardMenu() {

    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="space-y-6">
        {/* Plataforma */}
        <div>
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Plataforma
        </h3>
        <nav className="space-y-1" role="navigation" aria-label="Plataforma">
            {platformMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
                <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                </Link>
            );
            })}
        </nav>
        </div>

        {/* Reservas */}
        <div>
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reservas
        </h3>
        <nav className="space-y-1" role="navigation" aria-label="Reservas">
            {bookingMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
                <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                </Link>
            );
            })}
        </nav>
        </div>
        </div>
    );
}
