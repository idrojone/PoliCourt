import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onLogoutAll: () => void;
  isPending: boolean;
}

export const ProfileActions = ({ isOwner, onEdit, onLogoutAll, isPending }: ProfileActionsProps) => {
  if (!isOwner) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 p-4 text-center shadow-md dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 dark:text-slate-100 dark:shadow-lg">
      <Button onClick={onEdit} disabled={isPending} className="text-sm font-medium dark:text-slate-100">
        Editar mi perfil
      </Button>
      <Button onClick={onLogoutAll} variant="destructive" disabled={isPending} className="text-sm font-medium dark:text-slate-100">
        Cerrar sesión en todos los dispositivos
      </Button>
      {isPending && (
        <p className="text-xs text-emerald-700 dark:text-sky-300">Cerrando sesiones, por favor espera...</p>
      )}
    </div>
  );
};
