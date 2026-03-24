import type { User } from "@/features/types/user/User";

interface ProfileHeaderProps {
  profile: User;
  isOwner: boolean;
}

export const ProfileHeader = ({ profile, isOwner }: ProfileHeaderProps) => {
  return (
    <header className="rounded-2xl bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-500 px-6 py-6 text-white shadow-xl dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 dark:text-slate-100 dark:shadow-none">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">{profile.firstName} {profile.lastName}</h1>
          <p className="text-sm opacity-90 dark:opacity-80">@{profile.username}</p>
        </div>
        <div className="text-right text-xs opacity-90 dark:opacity-80">
          <span>{isOwner ? "Propietario" : "Visitante"}</span>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-left text-sm dark:text-slate-200">{isOwner ? "Tu perfil personal, con información y reservas visibles en un solo lugar sin tarjetas separadas." : "Perfil público con información visible al instante."}</p>
    </header>
  );
};
