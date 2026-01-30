import { useState, useMemo } from "react";
import { bookingSchema } from "../schema/BookingSchema";
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
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, BookingType, CreateBookingDTO } from "@/features/types/booking";
import { toDateTimeLocalValue, fromDateTimeLocalValue } from "@/lib/dateTime";
import { useCourtsAllQuery } from "@/features/court/queries/useCourtsAllQuery";
import { 
  useUsersSearchQuery, 
  useCoachesQuery, 
  useMonitorsQuery 
} from "@/features/auth/queries/useUsersByRoleQuery";

const typeLabels: Record<BookingType, string> = {
  RENTAL: "Alquiler",
  CLASS: "Clase",
  TRAINING: "Entrenamiento",
};

interface BookingFormBodyProps {
  bookingType: BookingType;
  bookingToEdit: Booking | null;
  onSave: (data: Omit<CreateBookingDTO, "type">) => void;
  isSaving: boolean;
  onCancel: () => void;
}

const BookingFormBody: React.FC<BookingFormBodyProps> = ({
  bookingType,
  bookingToEdit,
  onSave,
  isSaving,
  onCancel,
}) => {
  const { data: courts, isLoading: courtsLoading } = useCourtsAllQuery();

  // Estado para el buscador de usuarios
  const [userSearch, setUserSearch] = useState("");
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  // =============================================
  // Lógica de búsqueda según tipo de booking:
  // - RENTAL: cualquier usuario
  // - CLASS: solo MONITOR
  // - TRAINING: solo COACH
  // =============================================
  const isClassType = bookingType === "CLASS";
  const isTrainingType = bookingType === "TRAINING";
  const isGeneralSearch = bookingType === "RENTAL";

  // Query para búsqueda general (RENTAL)
  const { 
    data: generalUsers, 
    isLoading: generalUsersLoading 
  } = useUsersSearchQuery(userSearch, isGeneralSearch);

  // Query para coaches (TRAINING)
  const { 
    data: coaches, 
    isLoading: coachesLoading 
  } = useCoachesQuery(userSearch || undefined, isTrainingType);

  // Query para monitores (CLASS)
  const { 
    data: monitors, 
    isLoading: monitorsLoading 
  } = useMonitorsQuery(userSearch || undefined, isClassType);

  // Determinar qué usuarios mostrar y si está cargando
  const users = useMemo(() => {
    if (isClassType) return monitors || [];
    if (isTrainingType) return coaches || [];
    return generalUsers || [];
  }, [isClassType, isTrainingType, monitors, coaches, generalUsers]);

  const usersLoading = isClassType 
    ? monitorsLoading 
    : isTrainingType 
      ? coachesLoading 
      : generalUsersLoading;

  // Placeholder dinámico según el tipo
  const getUserSearchPlaceholder = () => {
    if (isClassType) return "Buscar monitor...";
    if (isTrainingType) return "Buscar coach...";
    return "Buscar usuario...";
  };

  const getNoUserMessage = () => {
    if (isClassType) return "No se encontraron monitores.";
    if (isTrainingType) return "No se encontraron coaches.";
    return "No se encontraron usuarios.";
  };
  

  const [form, setForm] = useState<Omit<CreateBookingDTO, "type">>(() => ({
    courtSlug: bookingToEdit?.courtSlug || "",
    organizerUsername: bookingToEdit?.organizerUsername || "",
    title: bookingToEdit?.title || "",
    description: bookingToEdit?.description || "",
    startTime: toDateTimeLocalValue(bookingToEdit?.startTime),
    endTime: toDateTimeLocalValue(bookingToEdit?.endTime),
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Omit<CreateBookingDTO, "type">, value: string) => {
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

    // Validar con el schema completo (incluyendo type)
    const fullForm = { ...form, type: bookingType };
    const result = bookingSchema.safeParse(fullForm);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    // Convertir las fechas al formato ISO correcto para el backend (LocalDateTime sin Z)
    const payload: Omit<CreateBookingDTO, "type"> = {
      ...form,
      startTime: fromDateTimeLocalValue(form.startTime),
      endTime: fromDateTimeLocalValue(form.endTime),
    };

    onSave(payload);
  };

  const activeCourts = courts?.filter((c) => c.isActive && c.status === "PUBLISHED") || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Pista */}
      <div className="space-y-1">
        <Label htmlFor="courtSlug" className={errors.courtSlug ? "text-destructive" : ""}>
          Pista *
        </Label>
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
        {errors.courtSlug && (
          <p className="text-xs text-destructive font-medium">{errors.courtSlug}</p>
        )}
      </div>

      {/* Organizador - Buscador de usuarios */}
      <div className="space-y-1">
        <Label
          htmlFor="organizerUsername"
          className={errors.organizerUsername ? "text-destructive" : ""}
        >
          {isClassType ? "Monitor organizador *" : isTrainingType ? "Coach organizador *" : "Usuario organizador *"}
        </Label>
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
                getUserSearchPlaceholder()
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={getUserSearchPlaceholder()}
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
                      : getNoUserMessage()}
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.organizerUsername && (
          <p className="text-xs text-destructive font-medium">{errors.organizerUsername}</p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-1">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={`Ej: ${typeLabels[bookingType]} del lunes`}
        />
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descripción opcional..."
          rows={2}
        />
      </div>

      {/* Fecha y hora inicio */}
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

        {/* Fecha y hora fin */}
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
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
};

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingType: BookingType;
  bookingToEdit: Booking | null;
  onSave: (data: Omit<CreateBookingDTO, "type">) => void;
  isSaving: boolean;
}

export const BookingFormDialog: React.FC<BookingFormDialogProps> = ({
  open,
  onOpenChange,
  bookingType,
  bookingToEdit,
  onSave,
  isSaving,
}) => {
  const label = typeLabels[bookingType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {bookingToEdit ? `Editar ${label}` : `Crear ${label}`}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <BookingFormBody
            key={bookingToEdit?.slug || "new"}
            bookingType={bookingType}
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
