import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, CreateRentalDTO, UpdateRentalDTO } from "@/features/types/booking";
import { useCourtsAllQuery } from "@/features/court/queries/useCourtsAllQuery";
import { useUsersSearchQuery } from "@/features/auth/queries/useUsersByRoleQuery";
import { rentalSchema } from "../../schema/RentalSchema";
import { updateRentalSchema } from "../../schema/UpdateRentalSchema";

interface RentalFormBodyProps {
  bookingToEdit: Booking | null;
  onSave: (data: CreateRentalDTO | UpdateRentalDTO) => void;
  isSaving: boolean;
  onCancel: () => void;
}

const RentalFormBody: React.FC<RentalFormBodyProps> = ({
  bookingToEdit,
  onSave,
  isSaving,
  onCancel,
}) => {
  const isEditMode = !!bookingToEdit;
  const { data: courts, isLoading: courtsLoading } = useCourtsAllQuery();

  // Estado para el buscador de usuarios (solo en modo creación)
  const [userSearch, setUserSearch] = useState("");
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const { data: users, isLoading: usersLoading } = useUsersSearchQuery(
    userSearch,
    !isEditMode // Solo buscar si no estamos editando
  );

  const [form, setForm] = useState({
    courtSlug: "",
    organizerUsername: "",
    startTime: "",
    endTime: "",
  });

  // Inicializar el formulario cuando cambia bookingToEdit
  useEffect(() => {
    if (bookingToEdit) {
      setForm({
        courtSlug: bookingToEdit.courtSlug || "",
        organizerUsername: bookingToEdit.organizerUsername || "",
        startTime: bookingToEdit.startTime
          ? new Date(bookingToEdit.startTime).toISOString().slice(0, 16)
          : "",
        endTime: bookingToEdit.endTime
          ? new Date(bookingToEdit.endTime).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setForm({
        courtSlug: "",
        organizerUsername: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [bookingToEdit]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Usar schema diferente según modo
    const schema = isEditMode ? updateRentalSchema : rentalSchema;
    const dataToValidate = isEditMode 
      ? { startTime: form.startTime, endTime: form.endTime }
      : form;

    const result = schema.safeParse(dataToValidate);

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
      // Solo enviar las horas para actualización
      const payload: UpdateRentalDTO = {
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      onSave(payload);
    } else {
      // Enviar todo para creación
      const payload: CreateRentalDTO = {
        courtSlug: form.courtSlug,
        organizerUsername: form.organizerUsername,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      onSave(payload);
    }
  };

  const activeCourts =
    courts?.filter((c) => c.isActive && c.status === "PUBLISHED") || [];

  // Encontrar el nombre de la pista para mostrar en modo edición
  const selectedCourt = courts?.find((c) => c.slug === form.courtSlug);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Pista - DESHABILITADO en modo edición */}
      <div className="space-y-1">
        <Label
          htmlFor="courtSlug"
          className={cn(
            errors.courtSlug ? "text-destructive" : "",
            isEditMode && "text-muted-foreground"
          )}
        >
          Pista * {isEditMode && <Lock className="inline h-3 w-3 ml-1" />}
        </Label>
        {isEditMode ? (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md border">
            <span className="text-sm">{selectedCourt?.name || form.courtSlug}</span>
            <span className="text-xs text-muted-foreground">(No modificable)</span>
          </div>
        ) : (
          <Select
            value={form.courtSlug}
            onValueChange={(value) => handleChange("courtSlug", value)}
            disabled={courtsLoading}
          >
            <SelectTrigger
              className={errors.courtSlug ? "border-destructive" : ""}
            >
              <SelectValue
                placeholder={
                  courtsLoading ? "Cargando pistas..." : "Selecciona una pista"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {activeCourts.map((court) => (
                <SelectItem key={court.slug} value={court.slug}>
                  {court.name} - {court.priceH}€/h
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.courtSlug && (
          <p className="text-xs text-destructive font-medium">
            {errors.courtSlug}
          </p>
        )}
      </div>

      {/* Usuario organizador - DESHABILITADO en modo edición */}
      <div className="space-y-1">
        <Label
          htmlFor="organizerUsername"
          className={cn(
            errors.organizerUsername ? "text-destructive" : "",
            isEditMode && "text-muted-foreground"
          )}
        >
          Usuario * {isEditMode && <Lock className="inline h-3 w-3 ml-1" />}
        </Label>
        {isEditMode ? (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md border">
            <User size={14} />
            <span className="text-sm">{form.organizerUsername}</span>
            <span className="text-xs text-muted-foreground">(No modificable)</span>
          </div>
        ) : (
          <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={userPopoverOpen}
                className={cn(
                  "w-full justify-between font-normal",
                  !form.organizerUsername && "text-muted-foreground",
                  errors.organizerUsername && "border-destructive"
                )}
              >
                {form.organizerUsername ? (
                  <span className="flex items-center gap-2">
                    <User size={14} />
                    {form.organizerUsername}
                  </span>
                ) : (
                  "Buscar usuario..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onValueChange={setUserSearch}
                />
                <CommandList>
                  {usersLoading ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  ) : users && users.length > 0 ? (
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.username}
                          value={user.username}
                          onSelect={() => {
                            handleChange("organizerUsername", user.username);
                            setUserPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.organizerUsername === user.username
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{user.username}</span>
                            {user.email && (
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>
                      {userSearch.length < 2
                        ? "Escribe al menos 2 caracteres..."
                        : "No se encontraron usuarios."}
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        {errors.organizerUsername && (
          <p className="text-xs text-destructive font-medium">
            {errors.organizerUsername}
          </p>
        )}
      </div>

      {/* Fecha y hora inicio/fin */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="startTime"
            className={errors.startTime ? "text-destructive" : ""}
          >
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
            <p className="text-xs text-destructive font-medium">
              {errors.startTime}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="endTime"
            className={errors.endTime ? "text-destructive" : ""}
          >
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
            <p className="text-xs text-destructive font-medium">
              {errors.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Info: precio se calcula automáticamente */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md text-sm text-blue-800 dark:text-blue-200">
        💡 El precio se calcula automáticamente según el tiempo reservado y el
        precio por hora de la pista.
        {isEditMode && " Si cambias las horas, el precio se recalculará."}
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving 
            ? "Guardando..." 
            : isEditMode 
              ? "Actualizar alquiler" 
              : "Crear alquiler"
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

interface RentalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingToEdit?: Booking | null;
  onSave: (data: CreateRentalDTO | UpdateRentalDTO) => void;
  isSaving: boolean;
}

export const RentalFormDialog: React.FC<RentalFormDialogProps> = ({
  open,
  onOpenChange,
  bookingToEdit = null,
  onSave,
  isSaving,
}) => {
  const isEditMode = !!bookingToEdit;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar alquiler" : "Crear alquiler de pista"}
          </DialogTitle>
          {isEditMode && (
            <DialogDescription>
              Solo puedes modificar las horas de la reserva. La pista y el usuario no se pueden cambiar.
            </DialogDescription>
          )}
        </DialogHeader>

        {open && (
          <RentalFormBody
            key={bookingToEdit?.slug || "new"}
            bookingToEdit={bookingToEdit}
            onSave={onSave}
            isSaving={isSaving}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
