import { Button } from "@/components/ui/button";
import { LogOut, PencilLine } from "lucide-react";

interface ProfileActionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onLogoutAll: () => void;
  isPending: boolean;
}

export const ProfileActions = ({ isOwner, onEdit, onLogoutAll, isPending }: ProfileActionsProps) => {
  if (!isOwner) return null;

  return (
    <section className="mt-6 rounded-3xl border border-cyan-300/30 bg-white/80 p-6 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_0_35px_rgba(56,189,248,0.18)]">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-white/10">
        <h3 className="text-lg font-black">Acciones de cuenta</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-100">
          Seguridad
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Button
          onClick={onEdit}
          disabled={isPending}
          className="h-11 border border-cyan-400/40 bg-cyan-50 font-semibold text-cyan-700 hover:bg-cyan-100 dark:border-cyan-300/40 dark:bg-cyan-300/10 dark:text-cyan-50 dark:hover:bg-cyan-300/20"
        >
          <PencilLine className="mr-2 h-4 w-4" />
          Editar mi perfil
        </Button>
        <Button
          onClick={onLogoutAll}
          variant="destructive"
          disabled={isPending}
          className="h-11 border border-rose-300/60 bg-rose-50 font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-400/40 dark:bg-rose-500/20 dark:text-rose-100 dark:hover:bg-rose-500/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesion en todos los dispositivos
        </Button>
      </div>

      {isPending && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-200/70">Cerrando sesiones, por favor espera...</p>
      )}
    </section>
  );
};
