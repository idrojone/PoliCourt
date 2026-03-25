import { useState } from "react";
import type { User } from "@/features/types/user/User";
import { CalendarClock, UserCircle2 } from "lucide-react";

interface ProfileHeaderProps {
  profile: User;
  isOwner: boolean;
}

export const ProfileHeader = ({ profile, isOwner }: ProfileHeaderProps) => {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const showAvatar = Boolean(profile.avatarUrl) && !hasAvatarError;

  return (
    <header className="relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.02)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.01)_100%)] px-6 py-7 text-foreground shadow-lg">
      <div className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-foreground/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-56 w-56 rounded-full bg-foreground/5 blur-3xl" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-background/60">
            {showAvatar ? (
              <img
                src={profile.avatarUrl}
                alt={`Avatar de ${profile.firstName} ${profile.lastName}`}
                className="h-full w-full object-cover"
                onError={() => setHasAvatarError(true)}
              />
            ) : (
              <UserCircle2 className="h-8 w-8 text-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black">{profile.firstName} {profile.lastName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>
          </div>
        </div>

        <div className="text-right text-xs text-foreground">
          <span className="inline-flex rounded-full border border-border bg-accent px-3 py-1 font-semibold uppercase tracking-wide text-accent-foreground">
            {isOwner ? "Propietario" : "Visitante"}
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
        <p>
          {isOwner
            ? "Tu panel personal para gestionar cuenta, sesiones y reservas con una vista más clara y directa."
            : "Vista pública del usuario con la información y actividad disponible en PoliCourt."}
        </p>
        <div className="flex items-center justify-start gap-2 md:justify-end">
          <CalendarClock className="h-4 w-4 text-foreground" />
          <span>
            Miembro desde {new Date(profile.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
      </div>
    </header>
  );
};
