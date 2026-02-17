import { useState } from "react";
import { sportSchema } from "../schema/SportSchema";
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
import type { CreateSportDTO } from "@/features/types/sport/CreateSportDTO";
import type { SportFormDialogProps } from "@/features/types/sport/SportFormDialogProps";
import type { Sport } from "@/features/types/sport/Sport";

interface SportFormBodyProps {
    sportToEdit: Sport;
    onSave: (data: CreateSportDTO) => void;
    isSaving: boolean;
    onCancel: () => void;
}

const SportFormBody: React.FC<SportFormBodyProps> = ({
    sportToEdit,
    onSave,
    isSaving,
    onCancel,
}) => {
    const [form, setForm] = useState<CreateSportDTO>(() => ({
        name: sportToEdit?.name || "",
        description: sportToEdit?.description || "",
        imgUrl: sportToEdit?.imgUrl || "",
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof CreateSportDTO, value: string) => {
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
        const result = sportSchema.safeParse(form);

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
            <div className="space-y-1">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                    Nombre
                </Label>
                <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Ej: Tenis"
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
                    placeholder="Breve descripción del deporte..."
                />
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
                    value={form.imgUrl || ""}
                    onChange={(e) => handleChange("imgUrl", e.target.value)}
                    placeholder="https://ejemplo.com/imgUrln.jpg"
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

            {form.imgUrl && !errors.imgUrl && (
                <div className="mt-2 w-full h-32 bg-muted rounded-md overflow-hidden border">
                    <img
                        src={form.imgUrl}
                        alt="Previsualización"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                </div>
            )}

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

export const SportFormDialog: React.FC<SportFormDialogProps> = ({
    open,
    onOpenChange,
    sportToEdit,
    onSave,
    isSaving,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {sportToEdit ? "Editar Deporte" : "Crear Deporte"}
                    </DialogTitle>
                </DialogHeader>

                {open && (
                    <SportFormBody
                        key={sportToEdit?.slug || "new"}
                        sportToEdit={sportToEdit}
                        onSave={onSave}
                        isSaving={isSaving}
                        onCancel={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
