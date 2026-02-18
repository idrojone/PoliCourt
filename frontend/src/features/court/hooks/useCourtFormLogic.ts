import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { UpdateCourtDTO } from "@/features/types/court/UpdateCourtDTO";
import type { Court } from "@/features/types/court/Court";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import type { UseMutateFunction } from "@tanstack/react-query";

export const useCourtFormLogic = (
    createCourt: UseMutateFunction<Court, Error, CreateCourtDTO, unknown>,
    updateCourt: UseMutateFunction<
        Court,
        AxiosError<{ message: string }>,
        { slug: string; payload: UpdateCourtDTO },
        unknown
    >
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<Court | null>(null);

    const openCreate = () => {
        setEditing(null);
        setIsOpen(true);
    };

    const openEdit = (c: Court) => {
        setEditing(c);
        setIsOpen(true);
    };

    const handleSave = (formData: CreateCourtDTO) => {
        const payload: CreateCourtDTO = {
            ...formData,
            name: formData.name.trim(),
            locationDetails: formData.locationDetails?.trim(),
            imgUrl: formData.imgUrl?.trim(),
        };

        const onSuccess = (msg: string) => {
            setIsOpen(false);
            setEditing(null);
            toast.success(msg);
        };

        const onError = (err: any) => {
            // Simple error handling
            const message = err?.response?.data?.message || err?.message || "Error al guardar";
            toast.error(message);
        };

        if (editing) {
            updateCourt(
                { slug: editing.slug, payload },
                {
                    onSuccess: () => onSuccess(`Pista "${payload.name}" actualizada.`),
                    onError,
                }
            );
        } else {
            createCourt(payload, {
                onSuccess: () => onSuccess(`Pista "${payload.name}" creada.`),
                onError,
            });
        }
    };

    return { isOpen, setIsOpen, editing, openCreate, openEdit, handleSave };
};
