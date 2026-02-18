import { useState } from "react";
import type { Club } from "@/features/types/club/Club";
import type { ClubCreateRequest } from "@/features/types/club/ClubCreateRequest";
import type { ClubUpdateRequest } from "@/features/types/club/ClubUpdateRequest";

export const useClubFormLogic = (
    createClub: (data: ClubCreateRequest) => void,
    updateClub: (data: { slug: string; data: ClubUpdateRequest }) => void,
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<Club | null>(null);

    const openCreate = () => {
        setEditing(null);
        setIsOpen(true);
    };

    const openEdit = (club: Club) => {
        setEditing(club);
        setIsOpen(true);
    };

    const handleSave = (data: ClubCreateRequest | ClubUpdateRequest) => {
        if (editing) {
            updateClub({ slug: editing.slug, data: data as ClubUpdateRequest });
        } else {
            createClub(data as ClubCreateRequest);
        }
        setIsOpen(false);
    };

    return {
        isOpen,
        setIsOpen,
        editing,
        openCreate,
        openEdit,
        handleSave,
    };
};
