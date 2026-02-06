import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { courtSchema } from "../schema/CourtSchema";
import { useSportsActivePublishedQuery } from "@/features/sport/queries/useSportsActivePublishedQuery";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { Court } from "@/features/types/court/Court";
import type { Sport } from "@/features/types/sport/Sport";

// Prop Types
interface CourtFormBodyProps {
  courtToEdit?: Court | null;
  onSave: (data: CreateCourtDTO) => void;
  isSaving: boolean;
  onCancel: () => void;
}

interface CourtFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courtToEdit?: Court | null;
  onSave: (data: CreateCourtDTO) => Promise<void>;
  isSaving: boolean;
}

const defaultFormState: CreateCourtDTO = {
  name: "",
  locationDetails: "",
  imgUrl: "",
  priceH: 0,
  capacity: 0,
  isIndoor: false,
  surface: "HARD",
  status: "DRAFT",
  sports: [],
};

// Form Body Component
const CourtFormBody: React.FC<CourtFormBodyProps> = ({
  courtToEdit,
  onSave,
  isSaving,
  onCancel,
}) => {
  const { data: sportsData } = useSportsActivePublishedQuery();
  const [form, setForm] = useState<CreateCourtDTO>(() =>
    courtToEdit
      ? {
          name: courtToEdit.name,
          locationDetails: courtToEdit.location,
          imgUrl: courtToEdit.imgUrl,
          priceH: courtToEdit.priceH,
          capacity: courtToEdit.capacity,
          isIndoor: courtToEdit.isIndoor,
          surface: courtToEdit.surface,
          status: courtToEdit.status,
          sports: courtToEdit.sportsAvailable?.map((s) => s.slug) || [],
        }
      : defaultFormState,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof CreateCourtDTO,
    value: string | number | boolean | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSportSelection = (sportSlug: string) => {
    const newSports = form.sports.includes(sportSlug)
      ? form.sports.filter((s) => s !== sportSlug)
      : [...form.sports, sportSlug];
    handleChange("sports", newSports);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = courtSchema.safeParse(form);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    onSave(result.data as CreateCourtDTO);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name, Location, ImgUrl */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="name"
            className={errors.name ? "text-destructive" : ""}
          >
            Nombre
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Pista Central"
            className={
              errors.name
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.name && (
            <p className="text-xs text-destructive font-medium">
              {errors.name}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="locationDetails"
            className={errors.locationDetails ? "text-destructive" : ""}
          >
            Ubicación
          </Label>
          <Input
            id="locationDetails"
            value={form.locationDetails}
            onChange={(e) => handleChange("locationDetails", e.target.value)}
            placeholder="Ej: Av. Siempreviva 742"
            className={
              errors.locationDetails
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.locationDetails && (
            <p className="text-xs text-destructive font-medium">
              {errors.locationDetails}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <Label
          htmlFor="imgUrl"
          className={errors.imgUrl ? "text-destructive" : ""}
        >
          URL de la Imagen
        </Label>
        <Input
          id="imgUrl"
          value={form.imgUrl}
          onChange={(e) => handleChange("imgUrl", e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          className={
            errors.imgUrl
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.imgUrl && (
          <p className="text-xs text-destructive font-medium">
            {errors.imgUrl}
          </p>
        )}
      </div>

      {/* Price, Capacity, isIndoor, Surface */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <Label
            htmlFor="priceH"
            className={errors.priceH ? "text-destructive" : ""}
          >
            Precio/h
          </Label>
          <Input
            id="priceH"
            type="number"
            value={form.priceH}
            onChange={(e) => handleChange("priceH", e.target.valueAsNumber)}
            className={
              errors.priceH
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.priceH && (
            <p className="text-xs text-destructive font-medium">
              {errors.priceH}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="capacity"
            className={errors.capacity ? "text-destructive" : ""}
          >
            Capacidad
          </Label>
          <Input
            id="capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => handleChange("capacity", e.target.valueAsNumber)}
            className={
              errors.capacity
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.capacity && (
            <p className="text-xs text-destructive font-medium">
              {errors.capacity}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="surface">Superficie</Label>
          <Select
            key={courtToEdit?.slug || "new-surface"}
            defaultValue={form.surface}
            onValueChange={(val) => handleChange("surface", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="uperficie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HARD">Dura</SelectItem>
              <SelectItem value="CLAY">Arcilla</SelectItem>
              <SelectItem value="GRASS">Césped</SelectItem>
              <SelectItem value="SYNTHETIC">Sintética</SelectItem>
              <SelectItem value="WOOD">Madera</SelectItem>
              <SelectItem value="OTHER">Otra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pb-2">
          <Switch
            id="isIndoor"
            checked={form.isIndoor}
            onCheckedChange={(val) => handleChange("isIndoor", val)}
          />
          <Label htmlFor="isIndoor">¿Es cubierta?</Label>
        </div>
      </div>

      {/* Sports Selection */}
      <div className="space-y-2">
        <Label className={errors.sports ? "text-destructive" : ""}>
          Deportes Disponibles
        </Label>
        <ScrollArea className="h-32 w-full rounded-md border p-2">
          <div className="grid grid-cols-2 gap-2">
            {sportsData?.map((sport: Sport) => (
              <div key={sport.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`sport-${sport.slug}`}
                  checked={form.sports.includes(sport.slug)}
                  onCheckedChange={() => handleSportSelection(sport.slug)}
                />
                <label
                  htmlFor={`sport-${sport.slug}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {sport.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        {errors.sports && (
          <p className="text-xs text-destructive font-medium">
            {errors.sports}
          </p>
        )}
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

// Dialog Component
export const CourtFormDialog: React.FC<CourtFormDialogProps> = ({
  open,
  onOpenChange,
  courtToEdit,
  onSave,
  isSaving,
}) => {
  const title = courtToEdit ? "Editar Pista" : "Crear Pista";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {open && (
          <CourtFormBody
            key={courtToEdit?.slug || "new-court"}
            courtToEdit={courtToEdit}
            onSave={onSave}
            isSaving={isSaving}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
