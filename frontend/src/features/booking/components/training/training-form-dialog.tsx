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
import type { Booking, CreateBookingDTO, UpdateBookingDTO } from "@/features/types/booking";
import { useCourtsAllQuery } from "@/features/court/queries/useCourtsAllQuery";
import { useCoachesQuery } from "@/features/auth/queries/useUsersByRoleQuery";
import { bookingSchema } from "../../schema/BookingSchema";
import { updateBookingSchema } from "../../schema/UpdateBookingSchema";

interface TrainingFormBodyProps {
  bookingToEdit: Booking | null;
  onSave: (data: Omit<CreateBookingDTO, "type"> | UpdateBookingDTO) => void;
  isSaving: boolean;
  onCancel: () => void;
}

const TrainingFormBody: React.FC<TrainingFormBodyProps> = ({
  bookingToEdit,
  onSave,
  isSaving,
  onCancel,
}) => {
  const isEditMode = !!bookingToEdit;
  const { data: courts, isLoading: courtsLoading } = useCourtsAllQuery();

  // Estado para el buscador de coaches (solo en modo creación)
  const [userSearch, setUserSearch] = useState("");
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const { data: coaches, isLoading: coachesLoading } = useCoachesQuery(
    userSearch || undefined,
    !isEditMode // Solo buscar si no estamos editando
  );

  const [form, setForm] = useState({
    courtSlug: "",
    organizerUsername: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  // Inicializar el formulario cuando cambia bookingToEdit
  useEffect(() => {
    if (bookingToEdit) {
      setForm({
        courtSlug: bookingToEdit.courtSlug || "",
        organizerUsername: bookingToEdit.organizerUsername || "",
        title: bookingToEdit.title || "",
        description: bookingToEdit.description || "",
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
        title: "",
        description: "",
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
    const dataToValidate = isEditMode 
      ? { title: form.title, description: form.description, startTime: form.startTime, endTime: form.endTime }
      : { ...form, type: "TRAINING" as const };

    const schema = isEditMode ? updateBookingSchema : bookingSchema;
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
      // Solo enviar campos editables para actualización
      const payload: UpdateBookingDTO = {
        title: form.title || undefined,
        description: form.description || undefined,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      onSave(payload);
    } else {
      // Enviar todo para creación
      const payload: Omit<CreateBookingDTO, "type"> = {
        courtSlug: form.courtSlug,
        organizerUsername: form.organizerUsername,
        title: form.title || undefined,
        description: form.description || undefined,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      onSave(payload);
    }
  };

  const activeCourts = courts?.filter((c) => c.isActive && c.status === "PUBLISHED") || [];
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
            <SelectTrigger className={errors.courtSlug ? "border-destructive" : ""}>
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
        )}
        {errors.courtSlug && (
          <p className="text-xs text-destructive font-medium">{errors.courtSlug}</p>
        )}
      </div>

      {/* Coach organizador - DESHABILITADO en modo edición */}
      <div className="space-y-1">
        <Label
          htmlFor="organizerUsername"
          className={cn(
            errors.organizerUsername ? "text-destructive" : "",
            isEditMode && "text-muted-foreground"
          )}
        >
          Coach organizador * {isEditMode && <Lock className="inline h-3 w-3 ml-1" />}
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
                  "Buscar coach..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar coach..."
                  value={userSearch}
                  onValueChange={setUserSearch}
                />
                <CommandList>
                  {coachesLoading ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  ) : coaches && coaches.length > 0 ? (
                    <CommandGroup>
                      {coaches.map((user) => (
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
                        : "No se encontraron coaches."}
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        {errors.organizerUsername && (
          <p className="text-xs text-destructive font-medium">{errors.organizerUsername}</p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-1">
        <Label htmlFor="title">
          Título {isEditMode && <span className="text-xs text-muted-foreground">(cambiar regenera el slug)</span>}
        </Label>
        <Input
          id="title"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ej: Entrenamiento de fuerza"
        />
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descripción del entrenamiento..."
          rows={2}
        />
      </div>

      {/* Fecha y hora inicio/fin */}
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

      {isEditMode && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md text-sm text-amber-800 dark:text-amber-200">
          ⚠️ Si cambias las horas, se verificará que no haya conflictos con otras reservas.
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving 
            ? "Guardando..." 
            : isEditMode 
              ? "Actualizar entrenamiento" 
              : "Crear entrenamiento"
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

interface TrainingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingToEdit?: Booking | null;
  onSave: (data: Omit<CreateBookingDTO, "type"> | UpdateBookingDTO) => void;
  isSaving: boolean;
}

export const TrainingFormDialog: React.FC<TrainingFormDialogProps> = ({
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
            {isEditMode ? "Editar entrenamiento" : "Crear entrenamiento"}
          </DialogTitle>
          {isEditMode && (
            <DialogDescription>
              Puedes modificar el título, descripción y horarios. La pista y el coach no se pueden cambiar.
            </DialogDescription>
          )}
        </DialogHeader>

        {open && (
          <TrainingFormBody
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
