import { useState } from "react";
import { maintenanceSchema } from "../schema/MaintenanceSchema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import type { Maintenance, CreateMaintenanceDTO, UpdateMaintenanceDTO } from "@/features/types/maintenance";
import { toDateTimeLocalValue, fromDateTimeLocalValue } from "@/lib/dateTime";
import { useCourtsAllQuery } from "@/features/court/queries/useCourtsAllQuery";
import { useClubAdminsQuery } from "@/features/auth/queries/useUsersByRoleQuery";
import { useCreateMaintenanceMutation } from "../mutations/useCreateMaintenanceMutation";
import { useUpdateMaintenanceMutation } from "../mutations/useUpdateMaintenanceMutation";

interface MaintenanceFormBodyProps {
  maintenanceToEdit: Maintenance | null;
  onSaveCreate: (data: CreateMaintenanceDTO) => void;
  onSaveUpdate: (data: UpdateMaintenanceDTO) => void;
  isSaving: boolean;
  onCancel: () => void;
}

const MaintenanceFormBody: React.FC<MaintenanceFormBodyProps> = ({
  maintenanceToEdit,
  onSaveCreate,
  onSaveUpdate,
  isSaving,
  onCancel,
}) => {
  const isEditMode = !!maintenanceToEdit;
  const { data: courts, isLoading: courtsLoading } = useCourtsAllQuery();
  const [userSearch, setUserSearch] = useState("");
  const { data: users = [], isLoading: usersLoading } = useClubAdminsQuery(userSearch);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const [form, setForm] = useState<Omit<CreateMaintenanceDTO, "status">>(() => ({
    courtSlug: maintenanceToEdit?.courtSlug || "",
    createdByUsername: maintenanceToEdit?.createdByUsername || "",
    title: maintenanceToEdit?.title || "",
    description: maintenanceToEdit?.description || "",
    startTime: toDateTimeLocalValue(maintenanceToEdit?.startTime),
    endTime: toDateTimeLocalValue(maintenanceToEdit?.endTime),
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Omit<CreateMaintenanceDTO, "status">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleUserSelect = (username: string) => {
    handleChange("createdByUsername", username);
    setUserPopoverOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = maintenanceSchema.safeParse(form);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    if (isEditMode) {
      // En modo edición, solo enviamos título, descripción y fechas
      const updatePayload: UpdateMaintenanceDTO = {
        title: form.title,
        description: form.description,
        startTime: fromDateTimeLocalValue(form.startTime),
        endTime: fromDateTimeLocalValue(form.endTime),
      };
      onSaveUpdate(updatePayload);
    } else {
      // En modo creación, enviamos todo
      const createPayload: CreateMaintenanceDTO = {
        ...form,
        startTime: fromDateTimeLocalValue(form.startTime),
        endTime: fromDateTimeLocalValue(form.endTime),
      };
      onSaveCreate(createPayload);
    }
  };

  const activeCourts = courts?.filter((c) => c.isActive && c.status === "PUBLISHED") || [];

  const selectedUser = users.find((u) => u.username === form.createdByUsername);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert className="border-orange-300 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Atención:</strong> Las reservas existentes en el horario seleccionado
          serán canceladas automáticamente.
        </AlertDescription>
      </Alert>

      {/* Pista */}
      <div className="space-y-1">
        <Label htmlFor="courtSlug" className={errors.courtSlug ? "text-destructive" : ""}>
          Pista *
        </Label>
        <Select
          value={form.courtSlug}
          onValueChange={(value) => handleChange("courtSlug", value)}
          disabled={courtsLoading || isEditMode}
        >
          <SelectTrigger className={cn(
            errors.courtSlug ? "border-destructive" : "",
            isEditMode && "opacity-60 cursor-not-allowed"
          )}>
            <SelectValue placeholder={courtsLoading ? "Cargando pistas..." : "Selecciona una pista"} />
          </SelectTrigger>
          <SelectContent>
            {activeCourts.map((court) => (
              <SelectItem key={court.slug} value={court.slug}>
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isEditMode && (
          <p className="text-xs text-muted-foreground">No se puede cambiar la pista una vez creado.</p>
        )}
        {errors.courtSlug && (
          <p className="text-xs text-destructive font-medium">{errors.courtSlug}</p>
        )}
      </div>

      {/* Usuario responsable (con buscador) */}
      <div className="space-y-1">
        <Label className={errors.createdByUsername ? "text-destructive" : ""}>
          Responsable del mantenimiento *
        </Label>
        <Popover open={userPopoverOpen && !isEditMode} onOpenChange={setUserPopoverOpen}>
          <PopoverTrigger asChild disabled={isEditMode}>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={userPopoverOpen}
              disabled={isEditMode}
              className={cn(
                "w-full justify-between",
                errors.createdByUsername && "border-destructive",
                isEditMode && "opacity-60 cursor-not-allowed"
              )}
            >
              {selectedUser
                ? `${selectedUser.firstName} ${selectedUser.lastName} (@${selectedUser.username})`
                : maintenanceToEdit
                ? `@${maintenanceToEdit.createdByUsername}`
                : "Buscar administrador..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar por username..."
                value={userSearch}
                onValueChange={setUserSearch}
              />
              <CommandList>
                {usersLoading ? (
                  <CommandEmpty>Buscando...</CommandEmpty>
                ) : users.length === 0 ? (
                  <CommandEmpty>No se encontraron administradores.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.username}
                        value={user.username}
                        onSelect={() => handleUserSelect(user.username)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.createdByUsername === user.username
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{user.firstName} {user.lastName}</span>
                          <span className="text-xs text-muted-foreground">
                            @{user.username} · {user.role}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {isEditMode && (
          <p className="text-xs text-muted-foreground">No se puede cambiar el responsable una vez creado.</p>
        )}
        {errors.createdByUsername && (
          <p className="text-xs text-destructive font-medium">{errors.createdByUsername}</p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-1">
        <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
          Título *
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ej: Reparación del césped"
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-xs text-destructive font-medium">{errors.title}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descripción detallada del mantenimiento..."
          rows={2}
        />
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="startTime" className={errors.startTime ? "text-destructive" : ""}>
            Inicio *
          </Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
            className={errors.startTime ? "border-destructive" : ""}
          />
          {errors.startTime && (
            <p className="text-xs text-destructive font-medium">{errors.startTime}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="endTime" className={errors.endTime ? "text-destructive" : ""}>
            Fin *
          </Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
            className={errors.endTime ? "border-destructive" : ""}
          />
          {errors.endTime && (
            <p className="text-xs text-destructive font-medium">{errors.endTime}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving 
            ? (isEditMode ? "Guardando..." : "Programando...") 
            : (isEditMode ? "Guardar cambios" : "Programar mantenimiento")}
        </Button>
      </DialogFooter>
    </form>
  );
};

interface MaintenanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceToEdit: Maintenance | null;
  isSaving?: boolean;
}

export const MaintenanceFormDialog: React.FC<MaintenanceFormDialogProps> = ({
  open,
  onOpenChange,
  maintenanceToEdit,
  isSaving: externalIsSaving,
}) => {
  const isEditMode = !!maintenanceToEdit;
  const createMutation = useCreateMaintenanceMutation();
  const updateMutation = useUpdateMaintenanceMutation();
  const isSaving = externalIsSaving || createMutation.isPending || updateMutation.isPending;

  const handleSaveCreate = (data: CreateMaintenanceDTO) => {
    toast.promise(createMutation.mutateAsync(data), {
      loading: "Programando mantenimiento...",
      success: (response) => {
        onOpenChange(false);
        if (response.cancelledBookingsCount > 0) {
          return `Mantenimiento programado. Se cancelaron ${response.cancelledBookingsCount} reservas.`;
        }
        return "Mantenimiento programado correctamente.";
      },
      error: "Error al programar el mantenimiento.",
    });
  };

  const handleSaveUpdate = (data: UpdateMaintenanceDTO) => {
    if (!maintenanceToEdit) return;
    
    toast.promise(updateMutation.mutateAsync({ slug: maintenanceToEdit.slug, payload: data }), {
      loading: "Guardando cambios...",
      success: (response) => {
        onOpenChange(false);
        if (response.cancelledBookingsCount > 0) {
          return `Mantenimiento actualizado. Se cancelaron ${response.cancelledBookingsCount} reservas adicionales.`;
        }
        return "Mantenimiento actualizado correctamente.";
      },
      error: "Error al actualizar el mantenimiento.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar mantenimiento" : "Programar mantenimiento"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <MaintenanceFormBody
            key={maintenanceToEdit?.slug || "new"}
            maintenanceToEdit={maintenanceToEdit}
            onSaveCreate={handleSaveCreate}
            onSaveUpdate={handleSaveUpdate}
            isSaving={isSaving}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
