import { useState } from "react";
import { clubSchema, type ClubFormValues } from "../schema/ClubSchema";
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
import type { ClubCreateRequest } from "@/features/types/club/ClubCreateRequest";
import type { ClubUpdateRequest } from "@/features/types/club/ClubUpdateRequest";
import type { Club } from "@/features/types/club/Club";
import { useSportSlugsQuery } from "@/features/sport/queries/useSportSlugsQuery";

interface ClubFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clubToEdit: Club | null;
    onSave: (data: ClubCreateRequest | ClubUpdateRequest) => void;
    isSaving: boolean;
}

interface ClubFormBodyProps {
    clubToEdit: Club | null;
    onSave: (data: ClubCreateRequest | ClubUpdateRequest) => void;
    isSaving: boolean;
    onCancel: () => void;
}

const ClubFormBody: React.FC<ClubFormBodyProps> = ({
    clubToEdit,
    onSave,
    isSaving,
    onCancel,
}) => {
    const { data: sportsData } = useSportSlugsQuery();
    const availableSports = sportsData || [];

    const [form, setForm] = useState<ClubFormValues>(() => ({
        name: clubToEdit?.name || "",
        description: clubToEdit?.description || "",
        imgUrl: clubToEdit?.imgUrl || "",
        sportSlug: clubToEdit?.sportSlug || "",
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof ClubFormValues, value: any) => {
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
        const result = clubSchema.safeParse(form);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setErrors(newErrors);
            return;
        }

        // Transform to valid request object based on editing state
        const submissionData = { ...result.data } as ClubCreateRequest | ClubUpdateRequest;

        // Ensure sportSlug is present if required (it is required for Create, optional for Update but schema handles validation)
        if (!submissionData.sportSlug && !clubToEdit) {
            setErrors((prev) => ({ ...prev, sportSlug: "Debes seleccionar un deporte" }));
            return;
        }

        onSave(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                    Nombre
                </Label>
                <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nombre del club"
                    className={
                        errors.name
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }
                />
                {errors.name && (
                    <p className="text-xs text-destructive font-medium">{errors.name}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    value={form.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Descripción del club..."
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor="imgUrl">URL de la Imagen</Label>
                <Input
                    id="imgUrl"
                    value={form.imgUrl || ""}
                    onChange={(e) => handleChange("imgUrl", e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>
            {form.imgUrl && (
                <div className="mt-2 w-full h-32 bg-muted rounded-md overflow-hidden border">
                    <img
                        src={form.imgUrl}
                        alt="Previsualización"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                </div>
            )}

            <div className="space-y-1">
                <Label htmlFor="sportSlug" className={errors.sportSlug ? "text-destructive" : ""}>Deporte</Label>
                <Select
                    value={form.sportSlug}
                    onValueChange={(val) => handleChange("sportSlug", val)}
                >
                    <SelectTrigger className={errors.sportSlug ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecciona un deporte" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableSports.map((sport) => (
                            <SelectItem key={sport.slug} value={sport.slug}>
                                {sport.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.sportSlug && (
                    <p className="text-xs text-destructive font-medium">{errors.sportSlug}</p>
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

export const ClubFormDialog: React.FC<ClubFormDialogProps> = ({
    open,
    onOpenChange,
    clubToEdit,
    onSave,
    isSaving,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {clubToEdit ? "Editar Club" : "Crear Club"}
                    </DialogTitle>
                </DialogHeader>

                {open && (
                    <ClubFormBody
                        key={clubToEdit?.slug || "new"}
                        clubToEdit={clubToEdit}
                        onSave={onSave}
                        isSaving={isSaving}
                        onCancel={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
