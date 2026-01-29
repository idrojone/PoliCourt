import { useState } from "react";
import { DashboardLayout } from "@/layout/dashboard";
import {
  useMaintenancesAllQuery,
  useUpdateMaintenanceStatusMutation,
  useDeleteMaintenanceMutation,
  MaintenanceFormDialog,
  MaintenanceCardAdmin,
} from "@/features/maintenance";
import { toast } from "sonner";
import type { Maintenance, MaintenanceStatus } from "@/features/types/maintenance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wrench } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const DashboardMaintenances = () => {
  const { data: maintenances, isLoading, isError } = useMaintenancesAllQuery();
  const updateStatusMutation = useUpdateMaintenanceStatusMutation();
  const deleteMutation = useDeleteMaintenanceMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null);

  const isMutating =
    updateStatusMutation.isPending ||
    deleteMutation.isPending;

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (maintenance: Maintenance) => {
    setEditing(maintenance);
    setIsOpen(true);
  };

  const handleStatusChange = (slug: string, status: MaintenanceStatus) => {
    toast.promise(
      updateStatusMutation.mutateAsync({ slug, status }),
      {
        loading: "Actualizando estado...",
        success: `Estado del mantenimiento actualizado a ${getStatusLabel(status)}.`,
        error: "Error al actualizar el estado.",
      }
    );
  };

  const handleDelete = (maintenance: Maintenance) => {
    setDeleteTarget(maintenance);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    toast.promise(deleteMutation.mutateAsync(deleteTarget.slug), {
      loading: "Eliminando mantenimiento...",
      success: "Mantenimiento eliminado correctamente.",
      error: "Error al eliminar el mantenimiento.",
    });
    setDeleteTarget(null);
  };

  const getStatusLabel = (status: MaintenanceStatus) => {
    const labels: Record<MaintenanceStatus, string> = {
      SCHEDULED: "Programado",
      IN_PROGRESS: "En progreso",
      COMPLETED: "Completado",
      CANCELLED: "Cancelado",
    };
    return labels[status];
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Cargando mantenimientos...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Error al cargar los mantenimientos.</AlertDescription>
        </Alert>
      );
    }

    if (!maintenances || maintenances.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hay mantenimientos programados.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Creá uno nuevo para bloquear reservas en una pista.
          </p>
        </div>
      );
    }

    return (
      <>
        <Alert className="mb-4 border-orange-300 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Atención:</strong> Al programar un mantenimiento, las
            reservas existentes en ese horario serán canceladas automáticamente.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maintenances.map((maintenance) => (
            <MaintenanceCardAdmin
              key={maintenance.slug}
              maintenance={maintenance}
              isPending={isMutating}
              handleStatusChange={handleStatusChange}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <DashboardLayout
        title="Mantenimientos"
        actionLabel="Nuevo Mantenimiento"
        onAction={openCreate}
      >
        {renderContent()}
      </DashboardLayout>

      <MaintenanceFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        maintenanceToEdit={editing}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar mantenimiento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El mantenimiento "{deleteTarget?.title}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
