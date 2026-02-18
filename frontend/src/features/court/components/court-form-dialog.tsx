import { useState, useEffect } from "react";
import { courtSchema } from "../schema/CourtSchema";
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { CourtFormDialogProps } from "@/features/types/court/CourtFormDialogProps";
import { CourtSurface } from "@/features/types/court/Court";
import { useSportSlugsQuery } from "@/features/sport/queries/useSportSlugsQuery";

interface CourtFormBodyProps {
    courtToEdit: CourtFormDialogProps["courtToEdit"];
    onSave: CourtFormDialogProps["onSave"];
    isSaving: CourtFormDialogProps["isSaving"];
    onCancel: () => void;
}

const CourtFormBody: React.FC<CourtFormBodyProps> = ({
    courtToEdit,
    onSave,
    isSaving,
    onCancel,
}) => {
    const { data: sports, isLoading: isLoadingSports } = useSportSlugsQuery();
    const [form, setForm] = useState<CreateCourtDTO>(() => ({
        name: courtToEdit?.name || "",
        locationDetails: courtToEdit?.locationDetails || "",
        imgUrl: courtToEdit?.imgUrl || "",
        priceH: courtToEdit?.priceH || 0,
        capacity: courtToEdit?.capacity || 10,
        isIndoor: courtToEdit?.isIndoor || false,
        surface: courtToEdit?.surface || CourtSurface.HARD,
        sportSlugs: courtToEdit?.sports?.map((s) => s.slug) || [],
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when courtToEdit changes
    useEffect(() => {
        setForm({
            name: courtToEdit?.name || "",
            locationDetails: courtToEdit?.locationDetails || "",
            imgUrl: courtToEdit?.imgUrl || "",
            priceH: courtToEdit?.priceH || 0,
            capacity: courtToEdit?.capacity || 10,
            isIndoor: courtToEdit?.isIndoor || false,
            surface: courtToEdit?.surface || CourtSurface.HARD,
            sportSlugs: courtToEdit?.sports?.map((s) => s.slug) || [],
        });
        setErrors({});
    }, [courtToEdit]);

    const handleChange = (field: keyof CreateCourtDTO, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSportToggle = (slug: string) => {
        setForm((prev) => {
            const current = prev.sportSlugs || [];
            const next = current.includes(slug)
                ? current.filter((s) => s !== slug)
                : [...current, slug];
            return { ...prev, sportSlugs: next };
        });
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

        onSave(result.data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                    <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                        Nombre
                    </Label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Ej: Pista Central"
                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
                </div>

                <div className="space-y-1 col-span-2">
                    <Label htmlFor="locationDetails" className={errors.locationDetails ? "text-destructive" : ""}>
                        Ubicación
                    </Label>
                    <Input
                        id="locationDetails"
                        value={form.locationDetails || ""}
                        onChange={(e) => handleChange("locationDetails", e.target.value)}
                        placeholder="Ej: Zona Norte, Edificio A"
                        className={errors.locationDetails ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.locationDetails && <p className="text-xs text-destructive font-medium">{errors.locationDetails}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="priceH" className={errors.priceH ? "text-destructive" : ""}>
                        Precio / Hora (€)
                    </Label>
                    <Input
                        id="priceH"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.priceH}
                        onChange={(e) => handleChange("priceH", parseFloat(e.target.value) || 0)}
                        className={errors.priceH ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.priceH && <p className="text-xs text-destructive font-medium">{errors.priceH}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="capacity" className={errors.capacity ? "text-destructive" : ""}>
                        Capacidad
                    </Label>
                    <Input
                        id="capacity"
                        type="number"
                        min="1"
                        step="1"
                        value={form.capacity}
                        onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 1)}
                        className={errors.capacity ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.capacity && <p className="text-xs text-destructive font-medium">{errors.capacity}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="surface">Superficie</Label>
                    <Select
                        value={form.surface}
                        onValueChange={(v) => handleChange("surface", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(CourtSurface).map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1 flex flex-col justify-end pb-2">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="isIndoor"
                            checked={form.isIndoor}
                            onCheckedChange={(c) => handleChange("isIndoor", c)}
                        />
                        <Label htmlFor="isIndoor" className="cursor-pointer">
                            Es Interior (Indoor)
                        </Label>
                    </div>
                </div>

                <div className="space-y-1 col-span-2">
                    <Label htmlFor="imgUrl" className={errors.imgUrl ? "text-destructive" : ""}>
                        URL de Imagen
                    </Label>
                    <Input
                        id="imgUrl"
                        value={form.imgUrl || ""}
                        onChange={(e) => handleChange("imgUrl", e.target.value)}
                        placeholder="https://..."
                        className={errors.imgUrl ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.imgUrl && <p className="text-xs text-destructive font-medium">{errors.imgUrl}</p>}
                </div>
                {form.imgUrl && !errors.imgUrl && (
                    <div className="col-span-2 mt-2 w-full h-32 bg-muted rounded-md overflow-hidden border">
                        <img
                            src={form.imgUrl}
                            alt="Previsualización"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    </div>
                )}

                <div className="col-span-2 space-y-2">
                    <Label>Deportes Permitidos</Label>
                    <ScrollArea className="h-32 w-full rounded-md border p-2">
                        {isLoadingSports ? (
                            <p className="text-sm text-muted-foreground p-2">Cargando deportes...</p>
                        ) : (
                            <div className="space-y-2">
                                {sports?.map((sport) => (
                                    <div key={sport.slug} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`sport-${sport.slug}`}
                                            checked={(form.sportSlugs || []).includes(sport.slug)}
                                            onCheckedChange={() => handleSportToggle(sport.slug)}
                                        />
                                        <label
                                            htmlFor={`sport-${sport.slug}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {sport.name}
                                        </label>
                                    </div>
                                ))}
                                {sports?.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No hay deportes disponibles.</p>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>

            <DialogFooter className="mt-6">
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

export const CourtFormDialog: React.FC<CourtFormDialogProps> = ({
    open,
    onOpenChange,
    courtToEdit,
    onSave,
    isSaving,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {courtToEdit ? "Editar Pista" : "Nueva Pista"}
                    </DialogTitle>
                    <DialogDescription>
                        {courtToEdit
                            ? "Modifica los datos de la pista existente."
                            : "Completa los datos para registrar una nueva pista."}
                    </DialogDescription>
                </DialogHeader>

                {open && (
                    <CourtFormBody
                        key={courtToEdit?.slug || "new"}
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
