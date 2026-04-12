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
    <header className="relative overflow-hidden rounded-3xl border border-cyan-300/30 bg-white/80 px-6 py-7 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_0_40px_rgba(56,189,248,0.2)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16)_0%,transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute -left-14 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/15" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-56 w-56 rounded-full bg-lime-200/20 blur-3xl dark:bg-lime-300/10" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[22px] border border-cyan-300/40 bg-white/70 dark:border-cyan-300/30 dark:bg-slate-950/60">
            {showAvatar ? (
              <img
                src={profile.avatarUrl}
                alt={`Avatar de ${profile.firstName} ${profile.lastName}`}
                className="h-full w-full object-cover"
                onError={() => setHasAvatarError(true)}
              />
            ) : (
              <UserCircle2 className="h-8 w-8 text-cyan-700 dark:text-cyan-100" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black">{profile.firstName} {profile.lastName}</h2>
            <p className="mt-1 text-sm text-cyan-700/70 dark:text-cyan-100/70">@{profile.username}</p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-900 dark:text-white">
          <span className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-100/70 px-3 py-1 font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100">
            {isOwner ? "Propietario" : "Visitante"}
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-200/80 md:grid-cols-2">
        <p>
          {isOwner
            ? "Tu panel personal para gestionar cuenta, sesiones y reservas con una vista mas clara y directa."
            : "Vista publica del usuario con la informacion y actividad disponible en PoliCourt."}
        </p>
        <div className="flex items-center justify-start gap-2 md:justify-end">
          <CalendarClock className="h-4 w-4 text-cyan-700 dark:text-cyan-100" />
          <span>
            Miembro desde {new Date(profile.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
      </div>
    </header>
  );
};
