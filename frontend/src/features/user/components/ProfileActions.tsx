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
    <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
        <h3 className="text-lg font-black text-card-foreground">Acciones de cuenta</h3>
        <span className="rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          Seguridad
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Button
          onClick={onEdit}
          disabled={isPending}
          className="h-11 font-semibold"
        >
          <PencilLine className="mr-2 h-4 w-4" />
          Editar mi perfil
        </Button>
        <Button
          onClick={onLogoutAll}
          variant="destructive"
          disabled={isPending}
          className="h-11 font-semibold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión en todos los dispositivos
        </Button>
      </div>

      {isPending && (
        <p className="mt-3 text-xs text-muted-foreground">Cerrando sesiones, por favor espera...</p>
      )}
    </section>
  );
};
